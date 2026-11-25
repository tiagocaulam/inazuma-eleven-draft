// Motor procedural de efeitos sonoros (Web Audio API — zero arquivos externos)
(function () {
  const SFX_STORAGE_KEY = "inazuma_sfx_settings_v1";
  const DEFAULT_SFX = { enabled: true, volume: 0.65 };

  let cachedSettings = null;
  let audioCtx = null;
  let masterGain = null;
  let noiseBuffer = null;
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
        cachedSettings.enabled ? cachedSettings.volume * 0.42 : 0,
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

  function ensureAudioContext() {
    if (typeof window === "undefined") return null;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtx) {
      try {
        audioCtx = new Ctx();
        masterGain = audioCtx.createGain();
        const cfg = loadSettings();
        masterGain.gain.value = cfg.enabled ? cfg.volume * 0.42 : 0;
        masterGain.connect(audioCtx.destination);
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

  function unlockSfxAudio() {
    if (!isSfxEnabled()) return false;
    const ctx = ensureAudioContext();
    return Boolean(ctx);
  }

  function getNoiseBuffer(ctx) {
    if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer;
    const len = Math.floor(ctx.sampleRate * 0.6);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noiseBuffer = buf;
    return buf;
  }

  function playTone(ctx, dest, opts) {
    const t0 = ctx.currentTime + (opts.delay || 0);
    const dur = Math.max(0.02, opts.dur || 0.12);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = opts.type || "sine";
    const startFreq = Math.max(24, opts.freq || 440);
    const endFreq = opts.freqEnd !== undefined ? Math.max(24, opts.freqEnd) : startFreq;
    osc.frequency.setValueAtTime(startFreq, t0);
    if (endFreq !== startFreq) {
      if (opts.linearSweep) {
        osc.frequency.linearRampToValueAtTime(endFreq, t0 + dur);
      } else {
        osc.frequency.exponentialRampToValueAtTime(endFreq, t0 + dur);
      }
    }
    const peak = Math.max(0.005, opts.gain || 0.25);
    const atk = Math.min(dur * 0.35, opts.attack || 0.008);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(peak, t0 + atk);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function playFilteredNoise(ctx, dest, opts) {
    const t0 = ctx.currentTime + (opts.delay || 0);
    const dur = Math.max(0.03, opts.dur || 0.16);
    const src = ctx.createBufferSource();
    src.buffer = getNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = opts.filterType || "bandpass";
    filter.frequency.setValueAtTime(opts.freq || 1200, t0);
    if (opts.freqEnd) {
      filter.frequency.exponentialRampToValueAtTime(Math.max(60, opts.freqEnd), t0 + dur);
    }
    filter.Q.value = opts.q || 1.4;

    const gain = ctx.createGain();
    const peak = Math.max(0.005, opts.gain || 0.18);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(peak, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  const MIN_GAP_MS = {
    ui_click: 50,
    chat_msg: 70,
    chat_send: 80,
    pass: 110,
    pass_aerial: 130,
    steal: 140,
    shot: 160,
    hissatsu: 220,
    goal: 320,
    save: 180,
    post: 180,
    miss: 180,
    whistle: 260,
    unlock: 250,
    level_up: 220,
    prep_reward: 180
  };

  const SPEED_4X_ALLOWED = new Set([
    "goal",
    "whistle",
    "unlock",
    "post",
    "save",
    "miss",
    "level_up",
    "prep_reward",
    "chat_msg",
    "chat_send",
    "ui_click"
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

    const dest = masterGain;
    switch (type) {
      case "ui_click":
        playTone(ctx, dest, { type: "triangle", freq: 720, freqEnd: 410, dur: 0.042, gain: 0.16, attack: 0.004 });
        break;

      case "chat_send":
        playTone(ctx, dest, { type: "sine", freq: 740, freqEnd: 980, dur: 0.065, gain: 0.20, attack: 0.005 });
        playTone(ctx, dest, { type: "sine", freq: 1046, freqEnd: 1180, dur: 0.08, delay: 0.045, gain: 0.18, attack: 0.005 });
        break;

      case "chat_msg":
        playTone(ctx, dest, { type: "sine", freq: 540, freqEnd: 840, dur: 0.065, gain: 0.22, attack: 0.005 });
        playTone(ctx, dest, { type: "triangle", freq: 1080, dur: 0.045, delay: 0.025, gain: 0.08, attack: 0.004 });
        break;

      case "unlock":
        [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
          playTone(ctx, dest, { type: "triangle", freq: f, dur: idx === 3 ? 0.28 : 0.13, delay: idx * 0.065, gain: 0.22 });
          playTone(ctx, dest, { type: "sine", freq: f * 2, dur: 0.11, delay: idx * 0.065, gain: 0.07 });
        });
        break;

      case "level_up":
        [392.0, 493.88, 587.33, 783.99].forEach((f, idx) => {
          playTone(ctx, dest, { type: "triangle", freq: f, dur: idx === 3 ? 0.24 : 0.11, delay: idx * 0.055, gain: 0.21 });
        });
        break;

      case "prep_reward":
        [659.25, 830.61, 987.77].forEach((f, idx) => {
          playTone(ctx, dest, { type: "sine", freq: f, dur: idx === 2 ? 0.22 : 0.12, delay: idx * 0.05, gain: 0.19 });
        });
        break;

      case "whistle": {
        const dur = opts.long ? 0.44 : 0.20;
        playTone(ctx, dest, { type: "sine", freq: 2740, freqEnd: 2680, dur, gain: 0.18, attack: 0.01 });
        playTone(ctx, dest, { type: "sine", freq: 2825, freqEnd: 2765, dur, gain: 0.14, attack: 0.01 });
        if (opts.long) {
          playTone(ctx, dest, { type: "sine", freq: 2760, freqEnd: 2640, dur: 0.24, delay: 0.19, gain: 0.16, attack: 0.01 });
        }
        break;
      }

      case "pass":
        playTone(ctx, dest, { type: "sine", freq: 185, freqEnd: 68, dur: 0.075, gain: 0.28, attack: 0.003 });
        playFilteredNoise(ctx, dest, { filterType: "bandpass", freq: 950, dur: 0.04, gain: 0.09, q: 1.8 });
        break;

      case "pass_aerial":
        playTone(ctx, dest, { type: "sine", freq: 160, freqEnd: 56, dur: 0.11, gain: 0.30, attack: 0.003 });
        playFilteredNoise(ctx, dest, { filterType: "bandpass", freq: 720, freqEnd: 1650, dur: 0.15, delay: 0.02, gain: 0.11, q: 2.2 });
        break;

      case "steal":
        playTone(ctx, dest, { type: "triangle", freq: 310, freqEnd: 115, dur: 0.085, gain: 0.24, attack: 0.004 });
        playFilteredNoise(ctx, dest, { filterType: "highpass", freq: 1600, dur: 0.055, gain: 0.11, q: 1.0 });
        break;

      case "shot":
        playTone(ctx, dest, { type: "sine", freq: 220, freqEnd: 46, dur: 0.15, gain: 0.38, attack: 0.003 });
        playTone(ctx, dest, { type: "triangle", freq: 340, freqEnd: 90, dur: 0.12, gain: 0.22, attack: 0.003 });
        playFilteredNoise(ctx, dest, { filterType: "lowpass", freq: 1800, freqEnd: 420, dur: 0.11, gain: 0.16 });
        break;

      case "hissatsu": {
        const el = String(opts.elem || "Fogo").toLowerCase();
        if (el.includes("vent")) {
          playFilteredNoise(ctx, dest, { filterType: "bandpass", freq: 520, freqEnd: 2400, dur: 0.26, gain: 0.22, q: 3.2 });
          playTone(ctx, dest, { type: "sine", freq: 440, freqEnd: 1180, dur: 0.24, gain: 0.22 });
        } else if (el.includes("flor")) {
          [440, 554.37, 659.25].forEach((f, idx) => {
            playTone(ctx, dest, { type: "triangle", freq: f, freqEnd: f * 1.4, dur: 0.20, delay: idx * 0.025, gain: 0.15 });
          });
        } else if (el.includes("mont")) {
          playTone(ctx, dest, { type: "sine", freq: 135, freqEnd: 38, dur: 0.26, gain: 0.42, attack: 0.004 });
          playTone(ctx, dest, { type: "sawtooth", freq: 160, freqEnd: 55, dur: 0.22, gain: 0.18, attack: 0.005 });
        } else {
          // Fogo padrão
          playTone(ctx, dest, { type: "sawtooth", freq: 260, freqEnd: 620, dur: 0.16, gain: 0.18 });
          playTone(ctx, dest, { type: "sine", freq: 240, freqEnd: 52, dur: 0.20, delay: 0.05, gain: 0.38 });
          playFilteredNoise(ctx, dest, { filterType: "bandpass", freq: 1100, freqEnd: 450, dur: 0.22, delay: 0.03, gain: 0.20 });
        }
        break;
      }

      case "goal":
        playTone(ctx, dest, { type: "sine", freq: 150, freqEnd: 42, dur: 0.24, gain: 0.40, attack: 0.004 });
        [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
          playTone(ctx, dest, { type: "triangle", freq: f, dur: 0.34, delay: 0.05 + idx * 0.03, gain: 0.20 });
        });
        playFilteredNoise(ctx, dest, { filterType: "bandpass", freq: 920, freqEnd: 620, dur: 0.42, delay: 0.04, gain: 0.18, q: 0.9 });
        break;

      case "save":
        playTone(ctx, dest, { type: "triangle", freq: 280, freqEnd: 92, dur: 0.14, gain: 0.30, attack: 0.004 });
        playFilteredNoise(ctx, dest, { filterType: "lowpass", freq: 1300, dur: 0.09, gain: 0.16 });
        break;

      case "post":
        playTone(ctx, dest, { type: "triangle", freq: 980, freqEnd: 940, dur: 0.42, gain: 0.26, attack: 0.002 });
        playTone(ctx, dest, { type: "sine", freq: 1475, freqEnd: 1420, dur: 0.36, gain: 0.20, attack: 0.002 });
        playTone(ctx, dest, { type: "sine", freq: 2210, dur: 0.24, gain: 0.12, attack: 0.002 });
        break;

      case "miss":
        playFilteredNoise(ctx, dest, { filterType: "bandpass", freq: 620, freqEnd: 240, dur: 0.22, gain: 0.18, q: 1.5 });
        playTone(ctx, dest, { type: "sine", freq: 320, freqEnd: 140, dur: 0.18, gain: 0.14 });
        break;
    }
    return true;
  }

  if (typeof document !== "undefined" && typeof document.addEventListener === "function" && !unlockBound) {
    unlockBound = true;
    const onFirstGesture = () => {
      if (isSfxEnabled()) ensureAudioContext();
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
  }
})();
