// Motor de efeitos sonoros com síntese física realista de futebol e anime (Web Audio API — zero arquivos externos)
(function () {
  const SFX_STORAGE_KEY = "inazuma_sfx_settings_v1";
  const DEFAULT_SFX = { enabled: true, volume: 0.65 };

  let cachedSettings = null;
  let audioCtx = null;
  let masterGain = null;
  let busInput = null;
  let satCurveNode = null;
  const noiseBuffers = { white: null, pink: null, brown: null, sr: 0 };
  let unlockBound = false;
  const lastPlayedAt = {};

  function clampVol(v) {
    const num = Number(v);
    if (!Number.isFinite(num)) return DEFAULT_SFX.volume;
    return Math.max(0, Math.min(1, Math.round(num * 100) / 100));
  }

  function loadSettings() {
    if (cachedSettings) return { ...cachedSettings };
    let next = { ...DEFAULT_SFX };
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = window.localStorage.getItem(SFX_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") {
            next = {
              enabled: parsed.enabled !== false,
              volume: parsed.volume !== undefined ? clampVol(parsed.volume) : DEFAULT_SFX.volume
            };
          }
        }
      }
    } catch {
      // ignora erro de armazenamento local
    }
    cachedSettings = next;
    return { ...cachedSettings };
  }

  function saveSettings(next) {
    cachedSettings = {
      enabled: next.enabled !== false,
      volume: clampVol(next.volume)
    };
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(SFX_STORAGE_KEY, JSON.stringify(cachedSettings));
      }
    } catch {
      // ignora erro de armazenamento local
    }
    if (masterGain && audioCtx) {
      masterGain.gain.setTargetAtTime(
        cachedSettings.enabled ? cachedSettings.volume * 0.72 : 0,
        audioCtx.currentTime,
        0.015
      );
    }
    if (typeof updateSettingsBtnIndicator === "function") {
      updateSettingsBtnIndicator();
    }
    return { ...cachedSettings };
  }

  function getSfxSettings() {
    return loadSettings();
  }

  function setSfxSettings(patch) {
    const cur = loadSettings();
    const merged = {
      enabled: patch && typeof patch.enabled === "boolean" ? patch.enabled : cur.enabled,
      volume: patch && patch.volume !== undefined ? clampVol(patch.volume) : cur.volume
    };
    return saveSettings(merged);
  }

  function isSfxEnabled() {
    const cfg = loadSettings();
    return Boolean(cfg.enabled && cfg.volume > 0);
  }

  function buildWarmDriveCurve(amount = 2.6) {
    const n = 256;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / (n - 1) - 1;
      curve[i] = Math.tanh(x * amount) / Math.tanh(amount);
    }
    return curve;
  }

  function ensureAudioContext() {
    if (typeof window === "undefined") return null;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtx) {
      try {
        audioCtx = new Ctx();
        masterGain = audioCtx.createGain();
        const cfg = loadSettings();
        masterGain.gain.value = cfg.enabled ? cfg.volume * 0.72 : 0;
        masterGain.connect(audioCtx.destination);

        busInput = masterGain;
        try {
          if (typeof audioCtx.createDynamicsCompressor === "function") {
            const comp = audioCtx.createDynamicsCompressor();
            comp.threshold.value = -14;
            comp.knee.value = 12;
            comp.ratio.value = 4;
            comp.attack.value = 0.003;
            comp.release.value = 0.16;
            comp.connect(masterGain);
            busInput = comp;
          }
        } catch {
          busInput = masterGain;
        }

        try {
          if (typeof audioCtx.createWaveShaper === "function") {
            const ws = audioCtx.createWaveShaper();
            ws.curve = buildWarmDriveCurve(2.4);
            ws.oversample = "2x";
            ws.connect(busInput);
            satCurveNode = ws;
          }
        } catch {
          satCurveNode = null;
        }
      } catch {
        return null;
      }
    }
    if (audioCtx.state === "suspended") {
      try {
        audioCtx.resume().catch(() => {});
      } catch {
        // ignora erro de autoplay
      }
    }
    return audioCtx;
  }

  const SAMPLE_PATHS = {
    goal: "assets/sfx/crowd_goal.mp3",
    goal_concede: "assets/sfx/crowd_boo.mp3",
    near_miss: "assets/sfx/crowd_ooh.mp3"
  };
  const rawSampleData = {};
  const rawFetchPromises = {};
  const sampleBuffers = {};
  const sampleStartOffsets = {};
  const samplePromises = {};

  function computeSampleStartOffset(decoded) {
    if (!decoded || typeof decoded.getChannelData !== "function") return 0;
    try {
      const data = decoded.getChannelData(0);
      const sr = decoded.sampleRate || 44100;
      const step = 16;
      for (let i = 0; i < data.length; i += step) {
        if (Math.abs(data[i]) > 0.045) {
          const sec = Math.max(0, i / sr - 0.025);
          return Math.min(sec, Math.max(0, (decoded.duration || 1) - 0.5));
        }
      }
    } catch {
      return 0;
    }
    return 0;
  }

  function prefetchSampleBytes(key) {
    const url = SAMPLE_PATHS[key];
    if (!url || rawSampleData[key] || rawFetchPromises[key] || typeof fetch !== "function") {
      return rawFetchPromises[key] || Promise.resolve(rawSampleData[key] || null);
    }
    rawFetchPromises[key] = fetch(url)
      .then((res) => (res && res.ok && typeof res.arrayBuffer === "function" ? res.arrayBuffer() : null))
      .then((arrBuf) => {
        if (arrBuf) rawSampleData[key] = arrBuf;
        return arrBuf || null;
      })
      .catch(() => null);
    return rawFetchPromises[key];
  }

  function prefetchAllSampleBytes() {
    Object.keys(SAMPLE_PATHS).forEach((key) => prefetchSampleBytes(key));
  }

  function decodeSampleAsync(ctx, key) {
    const url = SAMPLE_PATHS[key];
    if (!url || sampleBuffers[key] || samplePromises[key] || !ctx || typeof ctx.decodeAudioData !== "function") {
      return samplePromises[key] || null;
    }
    samplePromises[key] = prefetchSampleBytes(key)
      .then((arrBuf) => (arrBuf ? ctx.decodeAudioData(arrBuf.slice(0)) : null))
      .then((decoded) => {
        if (decoded) {
          sampleBuffers[key] = decoded;
          sampleStartOffsets[key] = computeSampleStartOffset(decoded);
        }
        return decoded;
      })
      .catch(() => null);
    return samplePromises[key];
  }

  function preloadCrowdSamples(ctx) {
    prefetchAllSampleBytes();
    if (!ctx) return;
    Object.keys(SAMPLE_PATHS).forEach((key) => decodeSampleAsync(ctx, key));
  }

  if (typeof window !== "undefined") {
    prefetchAllSampleBytes();
  }

  function playSampleClip(ctx, dest, key, opts = {}) {
    const url = SAMPLE_PATHS[key];
    if (!url || !isSfxEnabled()) return false;
    const clipDur = Math.max(0.45, opts.maxDur || 2.2);
    const fadeDur = Math.max(0.25, opts.fadeDur || 0.75);
    const clipGain = Math.max(0.05, Math.min(1, opts.gain !== undefined ? opts.gain : 0.9));
    const offset = sampleStartOffsets[key] !== undefined ? sampleStartOffsets[key] : Math.max(0, opts.offset || 0);
    const decoded = sampleBuffers[key];

    if (decoded && ctx && dest) {
      try {
        const src = ctx.createBufferSource();
        src.buffer = decoded;
        const g = ctx.createGain();
        const t0 = ctx.currentTime + (opts.delay || 0);
        const availDur = Math.max(0.28, decoded.duration - offset);
        const playDur = Math.min(clipDur, availDur);
        const actualFade = Math.min(fadeDur, playDur * 0.62);
        const fadeStart = t0 + Math.max(0.14, playDur - actualFade);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(clipGain, t0 + 0.03);
        g.gain.setValueAtTime(clipGain, fadeStart);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + playDur);
        src.connect(g);
        g.connect(dest);
        src.start(t0, offset, playDur + 0.05);
        src.stop(t0 + playDur + 0.08);
        return true;
      } catch {
        // segue para fallback Audio
      }
    }

    if (ctx) decodeSampleAsync(ctx, key);
    if (typeof Audio === "function") {
      try {
        const audio = new Audio(url);
        const cfg = loadSettings();
        const targetVol = Math.max(0, Math.min(1, cfg.volume * clipGain * 0.72));
        audio.volume = targetVol;
        if (offset > 0) {
          audio.addEventListener("loadedmetadata", () => {
            try {
              if (audio.duration > offset + 0.4) audio.currentTime = offset;
            } catch {}
          }, { once: true });
        }
        const startDelayMs = Math.max(0, Math.round((opts.delay || 0) * 1000));
        const runPlayback = () => {
          audio.play().catch(() => {});
          const fadeWindow = Math.max(0.3, Math.min(fadeDur, clipDur * 0.55));
          const fadeTimer = setInterval(() => {
            if (audio.paused) {
              clearInterval(fadeTimer);
              return;
            }
            const elapsed = Math.max(0, (audio.currentTime || 0) - offset);
            const remain = clipDur - elapsed;
            if (remain <= fadeWindow) {
              const frac = Math.max(0, remain / fadeWindow);
              audio.volume = Math.max(0, targetVol * frac * frac);
            }
          }, 55);
          setTimeout(() => {
            clearInterval(fadeTimer);
            try {
              audio.pause();
            } catch {}
          }, Math.round(clipDur * 1000));
        };
        if (startDelayMs > 0) setTimeout(runPlayback, startDelayMs);
        else runPlayback();
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  function unlockSfxAudio() {
    if (!isSfxEnabled()) return false;
    const ctx = ensureAudioContext();
    if (ctx) preloadCrowdSamples(ctx);
    return Boolean(ctx);
  }

  function ensureNoiseBuffers(ctx) {
    const sr = ctx.sampleRate || 44100;
    if (noiseBuffers.sr === sr && noiseBuffers.white && noiseBuffers.pink && noiseBuffers.brown) {
      return noiseBuffers;
    }
    const len = Math.floor(sr * 2.0);
    const wBuf = ctx.createBuffer(1, len, sr);
    const pBuf = ctx.createBuffer(1, len, sr);
    const bBuf = ctx.createBuffer(1, len, sr);
    const wData = wBuf.getChannelData(0);
    const pData = pBuf.getChannelData(0);
    const bData = bBuf.getChannelData(0);

    // Paul Kellet pink noise filter + Brown random walk
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let lastBrown = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      wData[i] = white;

      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const pinkRaw = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;
      pData[i] = Math.max(-1, Math.min(1, pinkRaw * 0.13));

      lastBrown = (lastBrown + 0.03 * white) / 1.03;
      bData[i] = Math.max(-1, Math.min(1, lastBrown * 3.4));
    }

    noiseBuffers.white = wBuf;
    noiseBuffers.pink = pBuf;
    noiseBuffers.brown = bBuf;
    noiseBuffers.sr = sr;
    return noiseBuffers;
  }

  function playTone(ctx, dest, opts) {
    const t0 = ctx.currentTime + (opts.delay || 0);
    const dur = Math.max(0.02, opts.dur || 0.12);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = opts.type || "sine";
    const startFreq = Math.max(20, opts.freq || 440);
    const endFreq = opts.freqEnd !== undefined ? Math.max(20, opts.freqEnd) : startFreq;
    osc.frequency.setValueAtTime(startFreq, t0);
    if (endFreq !== startFreq) {
      if (opts.linearSweep) {
        osc.frequency.linearRampToValueAtTime(endFreq, t0 + dur);
      } else {
        osc.frequency.exponentialRampToValueAtTime(endFreq, t0 + dur);
      }
    }
    const peak = Math.max(0.005, opts.gain || 0.25);
    const atk = Math.min(dur * 0.35, opts.attack || 0.004);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(peak, t0 + atk);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(t0);
    osc.stop(t0 + dur + 0.025);
  }

  function playNoiseSweep(ctx, dest, opts) {
    const t0 = ctx.currentTime + (opts.delay || 0);
    const dur = Math.max(0.02, opts.dur || 0.16);
    const bufs = ensureNoiseBuffers(ctx);
    const chosenBuf = opts.noiseType === "brown" ? bufs.brown : opts.noiseType === "white" ? bufs.white : bufs.pink;

    const src = ctx.createBufferSource();
    src.buffer = chosenBuf;
    const filter = ctx.createBiquadFilter();
    filter.type = opts.filterType || "bandpass";
    const fStart = Math.max(40, opts.freqStart || opts.freq || 900);
    filter.frequency.setValueAtTime(fStart, t0);
    if (opts.freqMid) {
      filter.frequency.exponentialRampToValueAtTime(Math.max(40, opts.freqMid), t0 + dur * 0.42);
    }
    if (opts.freqEnd) {
      filter.frequency.exponentialRampToValueAtTime(Math.max(40, opts.freqEnd), t0 + dur);
    }
    filter.Q.value = opts.q !== undefined ? opts.q : 1.2;

    const gain = ctx.createGain();
    const peak = Math.max(0.005, opts.gain || 0.22);
    const atk = Math.min(dur * 0.45, opts.attack || 0.015);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(peak, t0 + atk);
    if (opts.sustainHold && dur > atk + 0.06) {
      gain.gain.linearRampToValueAtTime(peak * 0.78, t0 + dur * 0.55);
    }
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    const maxStartOffset = Math.max(0, 1.9 - dur);
    const startOff = maxStartOffset > 0.05 ? Math.random() * maxStartOffset * 0.5 : 0;
    try {
      src.start(t0, startOff, dur + 0.03);
    } catch {
      src.start(t0);
    }
    src.stop(t0 + dur + 0.03);
  }

  // Impacto físico de bola de futebol: cavidade grave curta + estalo seco da chuteira no couro
  function playKickTransient(ctx, dest, opts = {}) {
    const delay = opts.delay || 0;
    const targetNode = opts.saturate && satCurveNode ? satCurveNode : dest;

    // 1) Estalo do couro (transiente 14–28ms de ruído branco filtrado)
    playNoiseSweep(ctx, targetNode, {
      noiseType: "white",
      filterType: "bandpass",
      freqStart: opts.slapFreq || 1350,
      freqEnd: Math.max(240, (opts.slapFreq || 1350) * 0.36),
      q: 1.5,
      dur: opts.slapDur || 0.024,
      attack: 0.002,
      gain: opts.slapGain !== undefined ? opts.slapGain : 0.30,
      delay
    });

    // 2) Ressonância da câmara de ar da bola (sub-grave muito rápido, sem soar sintético)
    playTone(ctx, targetNode, {
      type: "sine",
      freq: opts.subStart || 115,
      freqEnd: opts.subEnd || 40,
      dur: opts.subDur || 0.048,
      attack: 0.002,
      gain: opts.punchGain !== undefined ? opts.punchGain : 0.42,
      delay
    });
  }

  // Metais de estádio filtrados e quentes para comemoração de gol e carga especial
  function playBrassNote(ctx, dest, opts = {}) {
    const t0 = ctx.currentTime + (opts.delay || 0);
    const dur = Math.max(0.05, opts.dur || 0.22);
    const freq = Math.max(55, opts.freq || 523.25);
    const endFreq = opts.freqEnd ? Math.max(55, opts.freqEnd) : freq;
    const peak = Math.max(0.005, opts.gain || 0.16);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(opts.cutoff || 1450, t0);
    filter.frequency.exponentialRampToValueAtTime(Math.max(380, (opts.cutoff || 1450) * 0.65), t0 + dur);
    filter.Q.value = 0.8;

    const gain = ctx.createGain();
    const atk = Math.min(dur * 0.3, opts.attack || 0.016);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(peak, t0 + atk);
    gain.gain.setValueAtTime(peak * 0.85, Math.max(t0 + atk + 0.01, t0 + dur * 0.72));
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    filter.connect(gain);
    gain.connect(dest);

    [0.996, 1.004].forEach((detuneMul) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq * detuneMul, t0);
      if (endFreq !== freq) {
        osc.frequency.exponentialRampToValueAtTime(endFreq * detuneMul, t0 + dur);
      }
      osc.connect(filter);
      osc.start(t0);
      osc.stop(t0 + dur + 0.025);
    });
  }

  // Apito realista de árbitro com bolinha interna vibrando a ~38 Hz + sopro de ar
  function playPeaWhistle(ctx, dest, opts = {}) {
    const t0 = ctx.currentTime + (opts.delay || 0);
    const dur = Math.max(0.08, opts.dur || 0.22);

    const carrier = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoFreqGain = ctx.createGain();
    const lfoAmpGain = ctx.createGain();
    const env = ctx.createGain();

    carrier.type = "sine";
    carrier.frequency.setValueAtTime(2840, t0);
    carrier.frequency.linearRampToValueAtTime(2780, t0 + dur);

    overtone.type = "sine";
    overtone.frequency.setValueAtTime(4260, t0);

    const overGain = ctx.createGain();
    overGain.gain.value = 0.14;

    lfo.type = "sine";
    lfo.frequency.setValueAtTime(38, t0);
    lfoFreqGain.gain.value = 85;
    lfoAmpGain.gain.value = 0.06;

    env.gain.setValueAtTime(0.0001, t0);
    env.gain.linearRampToValueAtTime(0.18, t0 + 0.015);
    env.gain.setValueAtTime(0.17, Math.max(t0 + 0.02, t0 + dur - 0.03));
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    lfo.connect(lfoFreqGain);
    lfoFreqGain.connect(carrier.frequency);
    lfo.connect(lfoAmpGain);
    lfoAmpGain.connect(env.gain);

    carrier.connect(env);
    overtone.connect(overGain);
    overGain.connect(env);
    env.connect(dest);

    carrier.start(t0);
    overtone.start(t0);
    lfo.start(t0);
    carrier.stop(t0 + dur + 0.02);
    overtone.stop(t0 + dur + 0.02);
    lfo.stop(t0 + dur + 0.02);

    // Sopro de ar sibilante ao redor do apito
    playNoiseSweep(ctx, dest, {
      noiseType: "white",
      filterType: "bandpass",
      freqStart: 3300,
      freqEnd: 2900,
      q: 2.2,
      dur,
      attack: 0.012,
      gain: 0.075,
      delay: opts.delay || 0
    });
  }

  const MIN_GAP_MS = {
    ui_click: 55,
    chat_msg: 75,
    chat_send: 85,
    pass: 115,
    pass_aerial: 140,
    dribble: 150,
    steal: 145,
    shot: 170,
    hissatsu: 240,
    goal: 450,
    goal_concede: 450,
    near_miss: 300,
    save: 190,
    post: 190,
    miss: 190,
    fail: 210,
    defeat: 500,
    whistle: 280,
    unlock: 260,
    level_up: 220,
    prep_reward: 190,
    roulette_tick: 18,
    roulette_stop: 150
  };

  const SPEED_4X_ALLOWED = new Set([
    "goal",
    "goal_concede",
    "near_miss",
    "whistle",
    "unlock",
    "post",
    "save",
    "miss",
    "fail",
    "defeat",
    "level_up",
    "prep_reward",
    "chat_msg",
    "chat_send",
    "ui_click",
    "roulette_tick",
    "roulette_stop"
  ]);

  function playSfx(type, opts = {}) {
    if (!type || !isSfxEnabled()) return false;
    if (typeof window === "undefined") return false;
    if (!opts.force && typeof state !== "undefined" && state?.simSpeed === 4 && !SPEED_4X_ALLOWED.has(type)) {
      return false;
    }

    const nowMs = Date.now();
    const minGap = MIN_GAP_MS[type] || 80;
    if (!opts.force && lastPlayedAt[type] && nowMs - lastPlayedAt[type] < minGap) {
      return false;
    }
    lastPlayedAt[type] = nowMs;

    const ctx = ensureAudioContext();
    if (!ctx || !masterGain || (ctx.state === "suspended" && !opts.force)) return false;

    const dest = busInput || masterGain;
    switch (type) {
      case "ui_click":
        // Clique tátil suave (nunca estridente/8-bit)
        playNoiseSweep(ctx, dest, {
          noiseType: "pink",
          filterType: "bandpass",
          freqStart: 1650,
          freqEnd: 920,
          q: 2.0,
          dur: 0.025,
          attack: 0.002,
          gain: 0.14
        });
        playTone(ctx, dest, { type: "sine", freq: 520, freqEnd: 320, dur: 0.032, attack: 0.002, gain: 0.09 });
        break;

      case "chat_send":
        playTone(ctx, dest, { type: "sine", freq: 680, freqEnd: 940, dur: 0.06, gain: 0.16 });
        playTone(ctx, dest, { type: "sine", freq: 980, freqEnd: 1120, dur: 0.075, delay: 0.045, gain: 0.14 });
        break;

      case "chat_msg":
        playTone(ctx, dest, { type: "sine", freq: 510, freqEnd: 800, dur: 0.058, gain: 0.18 });
        break;

      case "unlock":
        [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
          playTone(ctx, dest, { type: "sine", freq: f, dur: idx === 3 ? 0.34 : 0.16, delay: idx * 0.068, gain: 0.16 });
        });
        break;

      case "level_up":
        [440, 554.37, 659.25, 880].forEach((f, idx) => {
          playTone(ctx, dest, { type: "sine", freq: f, dur: idx === 3 ? 0.28 : 0.14, delay: idx * 0.058, gain: 0.16 });
        });
        break;

      case "prep_reward":
        [587.33, 739.99, 880].forEach((f, idx) => {
          playTone(ctx, dest, { type: "sine", freq: f, dur: idx === 2 ? 0.24 : 0.13, delay: idx * 0.052, gain: 0.15 });
        });
        break;

      case "whistle":
        if (opts.long) {
          playPeaWhistle(ctx, dest, { dur: 0.19, delay: 0 });
          playPeaWhistle(ctx, dest, { dur: 0.34, delay: 0.23 });
        } else {
          playPeaWhistle(ctx, dest, { dur: 0.23, delay: 0 });
        }
        break;

      case "pass":
        // Toque curto seco no couro da bola
        playKickTransient(ctx, dest, {
          subStart: 108,
          subEnd: 42,
          subDur: 0.040,
          slapFreq: 1350,
          slapDur: 0.020,
          slapGain: 0.26,
          punchGain: 0.36
        });
        break;

      case "pass_aerial":
        // Batida mais funda embaixo da bola + vento leve da parábola no ar
        playKickTransient(ctx, dest, {
          subStart: 132,
          subEnd: 38,
          subDur: 0.058,
          slapFreq: 1050,
          slapDur: 0.026,
          slapGain: 0.30,
          punchGain: 0.42,
          saturate: true
        });
        playNoiseSweep(ctx, dest, {
          noiseType: "pink",
          filterType: "bandpass",
          freqStart: 360,
          freqMid: 960,
          freqEnd: 320,
          q: 1.5,
          dur: 0.19,
          attack: 0.025,
          gain: 0.11,
          delay: 0.02
        });
        break;

      case "dribble":
        // Vento limpo e veloz cortando o ar ao driblar
        playNoiseSweep(ctx, dest, {
          noiseType: "pink",
          filterType: "bandpass",
          freqStart: 280,
          freqMid: 1950,
          freqEnd: 460,
          q: 1.8,
          dur: 0.22,
          attack: 0.022,
          gain: 0.24
        });
        playNoiseSweep(ctx, dest, {
          noiseType: "white",
          filterType: "bandpass",
          freqStart: 950,
          freqMid: 2850,
          freqEnd: 980,
          q: 2.0,
          dur: 0.18,
          attack: 0.018,
          gain: 0.13
        });
        break;

      case "steal":
        // Corte/carrinho na grama + toque firme na bola
        playNoiseSweep(ctx, dest, {
          noiseType: "pink",
          filterType: "bandpass",
          freqStart: 980,
          freqEnd: 340,
          q: 1.1,
          dur: 0.115,
          attack: 0.006,
          gain: 0.24
        });
        playKickTransient(ctx, dest, {
          subStart: 120,
          subEnd: 46,
          subDur: 0.036,
          slapFreq: 1620,
          slapDur: 0.018,
          slapGain: 0.25,
          punchGain: 0.30,
          delay: 0.022
        });
        break;

      case "shot":
        // Chute seco com impacto pesado no couro + corte rápido de ar
        playKickTransient(ctx, dest, {
          subStart: 142,
          subEnd: 36,
          subDur: 0.068,
          slapFreq: 1300,
          slapDur: 0.026,
          slapGain: 0.38,
          punchGain: 0.62,
          saturate: true
        });
        playNoiseSweep(ctx, dest, {
          noiseType: "pink",
          filterType: "bandpass",
          freqStart: 420,
          freqMid: 1240,
          freqEnd: 360,
          q: 1.4,
          dur: 0.105,
          attack: 0.01,
          gain: 0.13,
          delay: 0.01
        });
        break;

      case "hissatsu": {
        const el = String(opts.elem || "Fogo").toLowerCase();
        // Impacto pesado + fogo / vento cortando com força pelo campo
        playKickTransient(ctx, dest, {
          subStart: 146,
          subEnd: 34,
          subDur: 0.072,
          slapFreq: 1280,
          slapDur: 0.028,
          slapGain: 0.38,
          punchGain: 0.64,
          saturate: true
        });
        if (el.includes("vent")) {
          playNoiseSweep(ctx, dest, {
            noiseType: "pink",
            filterType: "bandpass",
            freqStart: 360,
            freqMid: 2100,
            freqEnd: 520,
            q: 2.2,
            dur: 0.26,
            attack: 0.02,
            gain: 0.26,
            delay: 0.014
          });
          playNoiseSweep(ctx, dest, {
            noiseType: "white",
            filterType: "bandpass",
            freqStart: 950,
            freqMid: 2600,
            freqEnd: 880,
            q: 2.0,
            dur: 0.20,
            attack: 0.018,
            gain: 0.13,
            delay: 0.02
          });
        } else if (el.includes("flor")) {
          playNoiseSweep(ctx, dest, {
            noiseType: "pink",
            filterType: "bandpass",
            freqStart: 500,
            freqMid: 1580,
            freqEnd: 580,
            q: 2.0,
            dur: 0.24,
            attack: 0.02,
            gain: 0.22,
            delay: 0.015
          });
        } else if (el.includes("mont")) {
          playNoiseSweep(ctx, satCurveNode || dest, {
            noiseType: "brown",
            filterType: "lowpass",
            freqStart: 270,
            freqMid: 480,
            freqEnd: 70,
            q: 1.0,
            dur: 0.28,
            attack: 0.008,
            gain: 0.38,
            delay: 0.01
          });
        } else {
          // Fogo passando rápido: rugido denso de chama + rastro quente no ar
          playNoiseSweep(ctx, satCurveNode || dest, {
            noiseType: "brown",
            filterType: "lowpass",
            freqStart: 240,
            freqMid: 920,
            freqEnd: 170,
            q: 1.15,
            dur: 0.30,
            attack: 0.016,
            gain: 0.34,
            delay: 0.01
          });
          playNoiseSweep(ctx, dest, {
            noiseType: "pink",
            filterType: "bandpass",
            freqStart: 380,
            freqMid: 1650,
            freqEnd: 360,
            q: 1.4,
            dur: 0.26,
            attack: 0.018,
            gain: 0.22,
            delay: 0.016
          });
        }
        break;
      }

      case "goal":
        // Estilo Brasfoot: impacto na rede + torcida explodindo com fade suave no final
        playKickTransient(ctx, dest, {
          subStart: 125,
          subEnd: 38,
          subDur: 0.06,
          slapFreq: 1100,
          slapDur: 0.02,
          slapGain: 0.22,
          punchGain: 0.45,
          saturate: true
        });
        playSampleClip(ctx, masterGain, "goal", { maxDur: 3.1, fadeDur: 1.15, gain: 0.94 });
        break;

      case "goal_concede":
        // Gol sofrido: reclamação / vaia da torcida com fade suave
        playSampleClip(ctx, masterGain, "goal_concede", { maxDur: 2.6, fadeDur: 0.95, gain: 0.88 });
        break;

      case "near_miss":
        // "Uuuhhhh!" da torcida em quase gol / chute raspando
        playSampleClip(ctx, masterGain, "near_miss", { maxDur: 1.75, fadeDur: 0.65, gain: 0.82 });
        break;

      case "fail":
        // Feedback negativo limpo (sem buzz 8-bit) para escolha ruim no chat / falha leve
        playNoiseSweep(ctx, dest, {
          noiseType: "brown",
          filterType: "lowpass",
          freqStart: 320,
          freqEnd: 110,
          q: 0.9,
          dur: 0.08,
          attack: 0.004,
          gain: 0.14
        });
        playTone(ctx, dest, { type: "sine", freq: 270, freqEnd: 165, dur: 0.16, attack: 0.006, gain: 0.14 });
        break;

      case "defeat":
        // Tom descendente suave + lamentação da torcida com fade-out
        playTone(ctx, dest, { type: "sine", freq: 329.63, freqEnd: 246.94, dur: 0.18, attack: 0.008, gain: 0.14 });
        playTone(ctx, dest, { type: "sine", freq: 246.94, freqEnd: 174.61, dur: 0.28, delay: 0.14, attack: 0.008, gain: 0.15 });
        playSampleClip(ctx, masterGain, "goal_concede", { maxDur: 2.0, fadeDur: 0.85, gain: 0.58, delay: 0.08 });
        break;

      case "save":
        // Tapa de luva na bola + "uuuhhhh!" da torcida no quase gol
        playKickTransient(ctx, dest, {
          subStart: 120,
          subEnd: 42,
          subDur: 0.068,
          slapFreq: 820,
          slapDur: 0.026,
          slapGain: 0.32,
          punchGain: 0.42,
          saturate: true
        });
        playSampleClip(ctx, masterGain, "near_miss", { maxDur: 1.55, fadeDur: 0.55, gain: 0.72, delay: 0.04 });
        break;

      case "post":
        // Pancada metálica na trave + "uuuhhhh!" da torcida
        playKickTransient(ctx, dest, {
          subStart: 120,
          subEnd: 48,
          subDur: 0.04,
          slapFreq: 1450,
          slapGain: 0.22,
          punchGain: 0.26
        });
        playTone(ctx, dest, { type: "sine", freq: 612, freqEnd: 604, dur: 0.46, attack: 0.002, gain: 0.26, delay: 0.01 });
        playTone(ctx, dest, { type: "sine", freq: 1094, freqEnd: 1082, dur: 0.38, attack: 0.002, gain: 0.20, delay: 0.01 });
        playTone(ctx, dest, { type: "sine", freq: 1672, freqEnd: 1658, dur: 0.28, attack: 0.002, gain: 0.12, delay: 0.01 });
        playSampleClip(ctx, masterGain, "near_miss", { maxDur: 1.7, fadeDur: 0.60, gain: 0.80, delay: 0.06 });
        break;

      case "miss":
        // Vento da bola tirando tinta + "uuuhhhh!" da torcida
        playNoiseSweep(ctx, dest, {
          noiseType: "pink",
          filterType: "bandpass",
          freqStart: 980,
          freqEnd: 240,
          q: 1.4,
          dur: 0.18,
          attack: 0.012,
          gain: 0.18
        });
        playSampleClip(ctx, masterGain, "near_miss", { maxDur: 1.7, fadeDur: 0.60, gain: 0.84, delay: 0.03 });
        break;

      case "roulette_tick": {
        const pm = Math.max(0.75, Math.min(1.4, Number(opts.pitchMul) || 1));
        playNoiseSweep(ctx, dest, {
          noiseType: "white",
          filterType: "bandpass",
          freqStart: 2050 * pm,
          freqEnd: 1050 * pm,
          q: 2.6,
          dur: 0.016,
          attack: 0.002,
          gain: 0.17
        });
        playTone(ctx, dest, {
          type: "triangle",
          freq: 740 * pm,
          freqEnd: 390 * pm,
          dur: 0.022,
          attack: 0.002,
          gain: 0.11
        });
        break;
      }

      case "roulette_stop":
        // Trava mecânica da roleta + brilho suave da revelação do time
        playNoiseSweep(ctx, dest, {
          noiseType: "white",
          filterType: "bandpass",
          freqStart: 1450,
          freqEnd: 650,
          q: 1.8,
          dur: 0.028,
          attack: 0.002,
          gain: 0.22
        });
        playTone(ctx, dest, { type: "sine", freq: 523.25, dur: 0.22, attack: 0.004, gain: 0.14 });
        playTone(ctx, dest, { type: "sine", freq: 783.99, dur: 0.28, delay: 0.055, attack: 0.004, gain: 0.15 });
        break;
    }
    return true;
  }

  let rouletteTimers = [];
  function stopRouletteSpinAudio() {
    if (rouletteTimers.length > 0) {
      rouletteTimers.forEach((id) => clearTimeout(id));
      rouletteTimers = [];
    }
  }

  function playRouletteSpinSequence(durationMs = 1550, tickCount = 19) {
    stopRouletteSpinAudio();
    if (!isSfxEnabled() || typeof window === "undefined") return false;
    unlockSfxAudio();
    const total = Math.max(8, Math.min(28, Number(tickCount) || 19));
    const span = Math.max(400, Number(durationMs) || 1550) - 30;
    for (let i = 0; i < total; i++) {
      const u = i / total;
      const delayMs = Math.round((0.22 * u + 0.78 * u * u) * span);
      const pitchMul = 0.94 + u * 0.18;
      const tid = setTimeout(() => {
        playSfx("roulette_tick", { pitchMul, force: true });
      }, delayMs);
      rouletteTimers.push(tid);
    }
    return true;
  }

  if (typeof document !== "undefined" && typeof document.addEventListener === "function" && !unlockBound) {
    unlockBound = true;
    const onFirstGesture = () => {
      if (isSfxEnabled()) {
        const ctx = ensureAudioContext();
        if (ctx) preloadCrowdSamples(ctx);
      }
    };
    document.addEventListener("pointerdown", onFirstGesture, { passive: true });
    document.addEventListener("keydown", onFirstGesture, { passive: true });
  }

  if (typeof window !== "undefined") {
    window.getSfxSettings = getSfxSettings;
    window.setSfxSettings = setSfxSettings;
    window.isSfxEnabled = isSfxEnabled;
    window.unlockSfxAudio = unlockSfxAudio;
    window.playSfx = playSfx;
    window.playRouletteSpinSequence = playRouletteSpinSequence;
    window.stopRouletteSpinAudio = stopRouletteSpinAudio;
    window.computeSampleStartOffset = computeSampleStartOffset;
  }
})();
