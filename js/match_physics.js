function buildLivePitchBoxHTML(st, oppTeam, stats = calcSquadStats(), oppStats = calcOpponentStats(oppTeam, state.tournament.stageIndex)) {
  if (!st.finished && st.penalties) {
    return buildPenaltyShootoutHTML(st);
  }
  if (st.finished) {
    return buildMatchRecapBoxHTML(st, oppTeam, stats, oppStats);
  }
  const pitch = st.pitch;
  if (!pitch) return "";
  const allNodes = [...pitch.userNodes, ...pitch.oppNodes];

  const tokensHTML = allNodes
    .map((node) => {
      const sideCls = node.side === "user" ? "side-user" : "side-opp";
      const ballCls = node.uid === pitch.carrierUid ? "has-ball" : "";
      const chalCls = node.uid === pitch.challengerUid ? "is-challenger" : "";
      const tiredCls = node.stamina < 45 ? "is-tired" : "";
      const shortName = (node.player?.name || node.label).split(" ").slice(-1)[0];
      const stamColor =
        node.stamina >= 70 ? "#4ade80" : node.stamina >= 45 ? "#facc15" : "#ef4444";

      const initSprite = resolveDynamicNodeSprite(node, pitch);
      const keshinCls = node.keshinState === "ACTIVE" ? "is-keshin-active" : node.keshinState === "EXHAUSTED" ? "is-keshin-exhausted" : "";
      return `
        <div id="pnode-${node.uid}" class="pitch-player-token ${sideCls} ${ballCls} ${chalCls} ${tiredCls} ${keshinCls}" style="left:${node.x}%; top:${node.y}%;">
          <div class="keshin-flame-aura" aria-hidden="true"></div>
          <div id="pbadge-${node.uid}" class="pitch-token-action-badge"></div>
          <img class="pitch-token-avatar" src="${initSprite}" alt="${shortName}" />
          <div class="pitch-token-stamina">
            <div class="pitch-token-stamina-fill" style="width:${Math.round(node.stamina)}%; background:${stamColor};"></div>
          </div>
          <div class="pitch-token-name">${shortName}</div>
        </div>
      `;
    })
    .join("");

  const s = pitch.stats;
  const totTicks = Math.max(1, s.userTicks + s.oppTicks);
  const userPoss = Math.round((s.userTicks / totTicks) * 100);
  const isUserPoss = pitch.ballSide === "user";
  const possCls = isUserPoss ? "poss-user" : "poss-opp";
  const userTeamDisp = typeof getActiveTeamName === "function" ? getActiveTeamName() : "Dream Team";
  const possTeamLabel = isUserPoss ? userTeamDisp.toUpperCase() : oppTeam.name.toUpperCase();

  const oppTag = (oppTeam.name || "RIV").replace(/[^A-Za-zÀ-ÿ0-9]/g, "").slice(0, 3).toUpperCase() || "RIV";

  return `
    <div id="live-pitch-box" class="live-pitch-card ${possCls}">
      <div class="pitch-header-strip">
        <span class="pitch-side-dir" style="color:#4ade80;">
          ${UI.raimonEmblem ? `<img src="${UI.raimonEmblem}" alt="" />` : "⚡"} Gol →
        </span>
        <div class="pitch-action-ticker" id="pitch-action-ticker">${pitch.ticker}</div>
        <span class="pitch-side-dir" style="color:#f87171;">
          ← Gol <img src="${oppTeam.emblem}" alt="" />
        </span>
      </div>

      <div class="live-tactical-pitch ${st.isGoldenGoal5v5 ? "is-5v5-pitch" : ""}" id="live-tactical-pitch-viewport">
        ${
          !st.isGoldenGoal5v5
            ? `
          <div class="pitch-tv-scoreboard-bug">
            <span class="tv-team is-user">
              ${UI.raimonEmblem ? `<img src="${UI.raimonEmblem}" alt="" />` : ""}
              <span>DRM</span>
            </span>
            <span class="tv-score-box">
              <span id="live-score-user">${st.userScore}</span>
              <span class="tv-sep">-</span>
              <span id="live-score-opp">${st.oppScore}</span>
            </span>
            <span class="tv-team is-opp">
              <span>${oppTag}</span>
              ${oppTeam.emblem ? `<img src="${oppTeam.emblem}" alt="" />` : ""}
            </span>
            <span class="tv-clock-pill" id="live-clock-text">${st.minute}'</span>
          </div>
          <div class="pitch-tv-controls-bug">
            <button type="button" class="ie-cmd-btn pitch-hud-btn" id="btn-toggle-speed">
              <span>Vel: ${state.simSpeed}x</span>
            </button>
            <button type="button" class="ie-cmd-btn ie-cmd-gold pitch-hud-btn" id="btn-open-live-tactics" title="Prancheta Tática (Pausar)">
              <span class="btn-inline-flex">${typeof buildClipboardIconSVG === "function" ? buildClipboardIconSVG("live-clip-svg") : ""}</span>
            </button>
          </div>
        `
            : ""
        }
        <div class="pitch-world" id="live-pitch-world">
          <div class="pitch-field-outline"></div>
          <div class="pitch-line-mid"></div>
          <div class="pitch-center-circle"></div>
          <div class="pitch-center-dot"></div>
          <div class="pitch-box-left"></div>
          <div class="pitch-box-right"></div>
          <div class="pitch-small-box-left"></div>
          <div class="pitch-small-box-right"></div>
          <div class="pitch-arc-left"></div>
          <div class="pitch-arc-right"></div>
          <div class="pitch-goal-left" id="pitch-goal-left">${buildGoalTopDownSVG("left")}</div>
          <div class="pitch-goal-right" id="pitch-goal-right">${buildGoalTopDownSVG("right")}</div>

          <svg class="pitch-pass-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path id="pitch-pass-glow" d="M50 50" fill="none" stroke="#facc15" stroke-width="2.2" stroke-linecap="round" style="opacity:0;" />
            <path id="pitch-pass-line" d="M50 50" fill="none" stroke="#facc15" stroke-width="0.9" stroke-dasharray="2.5 1.8" stroke-linecap="round" style="opacity:0;" />
            <line id="pitch-synergy-line" x1="0" y1="0" x2="0" y2="0" stroke="#facc15" stroke-width="1.2" stroke-linecap="round" style="opacity:0;" />
          </svg>

          <div id="pitch-shockwave" class="pitch-shockwave"></div>
          <div id="pitch-save-ring" class="pitch-save-ring"></div>
          <div id="pitch-goal-burst" class="pitch-goal-burst">
            <svg viewBox="0 0 160 140" fill="none" class="pitch-lightning-svg">
              <defs>
                <radialGradient id="plasmaGlow" cx="20%" cy="50%" r="65%">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
                  <stop offset="25%" stop-color="#fef08a" stop-opacity="0.95"/>
                  <stop offset="55%" stop-color="#38bdf8" stop-opacity="0.8"/>
                  <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="boltGradGold" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#ffffff"/>
                  <stop offset="40%" stop-color="#fde047"/>
                  <stop offset="100%" stop-color="#f59e0b"/>
                </linearGradient>
                <linearGradient id="boltGradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#ffffff"/>
                  <stop offset="45%" stop-color="#7dd3fc"/>
                  <stop offset="100%" stop-color="#0284c7"/>
                </linearGradient>
                <filter id="lightningGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1"/>
                  <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2"/>
                  <feMerge>
                    <feMergeNode in="blur2"/>
                    <feMergeNode in="blur1"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <ellipse class="lightning-ring outer-ring" cx="24" cy="70" rx="34" ry="48" stroke="rgba(56,189,248,0.7)" stroke-width="2.5" stroke-dasharray="10 8" fill="none"/>
              <ellipse class="lightning-ring inner-ring" cx="24" cy="70" rx="20" ry="28" stroke="rgba(254,240,138,0.9)" stroke-width="3" fill="none"/>
              <circle class="lightning-core" cx="24" cy="70" r="16" fill="url(#plasmaGlow)"/>
              <path class="lightning-wave-crest wave-1" d="M 45,18 C 72,38 78,102 45,122" stroke="rgba(254,240,138,0.95)" stroke-width="3.6" stroke-linecap="round" fill="none"/>
              <path class="lightning-wave-crest wave-2" d="M 68,10 C 102,32 108,108 68,130" stroke="rgba(56,189,248,0.85)" stroke-width="2.8" stroke-linecap="round" fill="none"/>
              <path class="lightning-wave-crest wave-3" d="M 94,6 C 132,28 138,112 94,134" stroke="rgba(186,230,253,0.65)" stroke-width="2" stroke-linecap="round" stroke-dasharray="6 4" fill="none"/>
              <path class="lightning-bolt bolt-main" d="M 24,70 L 42,60 L 52,66 L 76,52 L 90,60 L 118,44 L 140,50 L 158,40" stroke="url(#boltGradGold)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" filter="url(#lightningGlow)"/>
              <path class="lightning-bolt bolt-top" d="M 24,66 L 40,46 L 54,54 L 78,32 L 96,40 L 122,22 L 138,28 L 156,14" stroke="url(#boltGradCyan)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" filter="url(#lightningGlow)"/>
              <path class="lightning-bolt bolt-bot" d="M 24,74 L 40,92 L 56,86 L 80,108 L 98,100 L 124,118 L 142,112 L 158,126" stroke="url(#boltGradCyan)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" filter="url(#lightningGlow)"/>
              <path class="lightning-bolt bolt-fork-1" d="M 52,66 L 68,82 L 88,78 L 112,94" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path class="lightning-bolt bolt-fork-2" d="M 76,52 L 92,36 L 114,40 L 134,26" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle class="lightning-spark s1" cx="82" cy="44" r="2.8" fill="#ffffff"/>
              <circle class="lightning-spark s2" cx="106" cy="74" r="3.2" fill="#fde047"/>
              <circle class="lightning-spark s3" cx="128" cy="36" r="2.5" fill="#38bdf8"/>
              <circle class="lightning-spark s4" cx="138" cy="98" r="2.8" fill="#ffffff"/>
              <circle class="lightning-spark s5" cx="64" cy="98" r="2.2" fill="#fde047"/>
            </svg>
          </div>
          ${tokensHTML}
          <div id="live-pitch-ball-shadow" class="pitch-ball-shadow" style="left:${pitch.ballX}%; top:${pitch.ballY}%;"></div>
          <div id="live-pitch-ball" class="pitch-ball-dot" style="left:${pitch.ballX}%; top:${pitch.ballY}%;">
            <span class="pitch-ball-flame" aria-hidden="true"></span>
            <svg class="pitch-ball-spin-svg" viewBox="0 0 36 36" aria-hidden="true">
              <circle cx="18" cy="18" r="8.2" fill="none" stroke="rgba(224,242,254,0.45)" stroke-width="1.2" stroke-dasharray="6 5"/>
              <circle cx="18" cy="18" r="5.4" fill="none" stroke="rgba(56,189,248,0.38)" stroke-width="1.0" stroke-dasharray="4 6"/>
              <path d="M21 10.2 C27 9.6, 32.5 13.5, 33 20.2 C31.5 17.5, 29.2 15.8, 26.5 15.4" fill="none" stroke="rgba(224,242,254,0.92)" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M21 10.2 C27 9.6, 32.5 13.5, 33 20.2 C31.5 17.5, 29.2 15.8, 26.5 15.4" fill="none" stroke="rgba(56,189,248,0.92)" stroke-width="1.5" stroke-linecap="round" transform="rotate(120 18 18)"/>
              <path d="M21 10.2 C27 9.6, 32.5 13.5, 33 20.2 C31.5 17.5, 29.2 15.8, 26.5 15.4" fill="none" stroke="rgba(250,204,21,0.88)" stroke-width="1.4" stroke-linecap="round" transform="rotate(240 18 18)"/>
            </svg>
            ${buildMiniBallSVG("pitch-ball-svg")}
          </div>
          <div id="pitch-coop-banner" class="pitch-coop-banner" style="display:none;"></div>
          <div id="pitch-float-badge" class="pitch-float-badge"></div>
        </div>
        <div id="pitch-center-callout" class="pitch-center-callout" style="display:none;"></div>
        <div id="shot-clash-slot" class="pitch-clash-modal" style="display:none;"></div>
      </div>

      ${
        !st.isGoldenGoal5v5
          ? (() => {
              const tacNow = getTactics();
              const resolvedTacticId = pitch.activeHissatsuTacticId || pitch.usedHissatsuTacticId || tacNow.hissatsuTactic;
              const hObj = HISSATSU_TACTICS_CATALOG?.[resolvedTacticId] || HISSATSU_TACTICS_CATALOG?.route_of_sky;
              const isUsed = Boolean(pitch.hissatsuTacticUsed);
              const isActive = (pitch.hissatsuTacticTimer || 0) > 0;
              const label = isActive
                ? `⚡ ${hObj?.name || "Tática"} (${Math.max(1, Math.ceil((pitch.hissatsuTacticTimer || 0) * 1.45))}')`
                : isUsed
                ? `✓ ${hObj?.name || "Tática"} Usada`
                : `⚡ Ativar Tática: ${hObj?.name || "Rota do Céu"}`;
              const hintTxt = isActive
                ? `Ativa: ${hObj?.shortEffect || "efeito em campo!"}`
                : isUsed
                ? "Já utilizada nesta partida"
                : (hObj?.shortEffect || "");
              return `
                <div class="pitch-coach-bar">
                  <button type="button" class="ie-cmd-btn pitch-tactic-btn ${isActive ? "is-tactic-active" : ""} ${isUsed && !isActive ? "is-tactic-used" : ""}" id="btn-activate-hissatsu-tactic" ${isUsed || isActive ? "disabled" : ""}>
                    <span>${label}</span>
                  </button>
                  <span class="pitch-coach-hint" id="pitch-coach-hint">${hintTxt}</span>
                </div>
              `;
            })()
          : ""
      }

      <div class="pitch-live-stats" id="pitch-live-stats">
        <div class="pitch-stat-pill"><small>Posse</small><strong>${userPoss}% - ${100 - userPoss}%</strong></div>
        <div class="pitch-stat-pill"><small>Passes</small><strong>${s.userPassesOk}/${s.userPassesTry}</strong></div>
        <div class="pitch-stat-pill"><small>Dribles</small><strong>${s.userDribblesOk}/${s.userDribblesTry}</strong></div>
        <div class="pitch-stat-pill"><small>Roubos</small><strong>${s.userSteals}</strong></div>
        <div class="pitch-stat-pill"><small>Chutes</small><strong>${s.userShots} - ${s.oppShots}</strong></div>
      </div>
    </div>
  `;
}

function pauseForPitchBeat(st, calloutHTML, calloutCls, durationMs, ovrDiff, onBeatDone = null) {
  if (state.simSpeed !== 1) {
    if (onBeatDone) onBeatDone(true);
    syncLivePitchDOM(st);
    handleMinuteEndBoundaries(st, ovrDiff);
    return;
  }

  if (state.tournament.timerId) {
    clearInterval(state.tournament.timerId);
    state.tournament.timerId = null;
  }

  const calloutEl = document.getElementById("pitch-center-callout");
  if (calloutEl && calloutHTML) {
    calloutEl.className = `pitch-center-callout ${calloutCls || ""}`.trim();
    calloutEl.innerHTML = calloutHTML;
    calloutEl.style.display = "flex";
  }

  let beatResolved = false;
  const finishBeat = (skipRestart = false) => {
    if (beatResolved) return;
    beatResolved = true;
    state.tournament.pendingBeatFinish = null;
    if (state.tournament.actionBeatTimer) {
      clearTimeout(state.tournament.actionBeatTimer);
      state.tournament.actionBeatTimer = null;
    }

    const cEl = document.getElementById("pitch-center-callout");
    if (cEl) {
      cEl.innerHTML = "";
      cEl.style.display = "none";
      cEl.className = "pitch-center-callout";
    }

    if (onBeatDone) onBeatDone(skipRestart);
    syncLivePitchDOM(st);
    const matchEnded = handleMinuteEndBoundaries(st, ovrDiff);
    if (!matchEnded && !skipRestart && st.running && !st.finished && !state.tournament.pendingClashFinish) {
      startMatchInterval();
    }
  };

  state.tournament.pendingBeatFinish = finishBeat;
  state.tournament.actionBeatTimer = setTimeout(() => {
    finishBeat(false);
  }, durationMs);
}

const TRIO_SHOT_MOVES = new Set([
  "a fenix", "a terra", "a terra (the earth)", "big bang", "corrente de jato (jet stream)",
  "espada crisantemo", "explosao do caos (chaos break)", "fenix negra",
  "furacao de fogo tc", "grande fenrir", "grande fogo", "impulso triplo",
  "nevasca tripla", "onda dos onze mais fortes", "pinguins espaciais",
  "pinguins imperiais no 2", "pinguins imperiais no 2 (tubarao)",
  "pinguins imperiais no 3", "pinguins imperiais x", "ruptura mortal (death break)",
  "supernova", "tempestade relampago (inazuma break)", "tempestade relampago cg",
  "the earth infinity (the earth ∞)", "tri-pegaso", "triangulo z", "triangulo zz",
  "urso polar no 2", "zona esmagadora mortal", "zona mortal", "zona mortal 2",
  "ultima zona mortal", "evolucao"
]);

const DUO_SHOT_MOVES = new Set([
  "a origem (the birth)", "alvorecer negro", "blitz do amanhecer",
  "dragao celestial", "explosao universo", "fogo cruzado (crossfire)",
  "furacao dragao", "furacao duplo", "furacao de fogo dd", "golpe duplo",
  "granada dupla", "impacto duplo branco", "impacto wyvern", "impulso cruzado",
  "impulso duplo", "impulso duplo f", "impulso torre eiffel", "impulso unicornio",
  "lanca dupla", "lenda suprema (prime legend)", "prime legend", "mandibula dupla",
  "pinguins deus e demonio", "relampago no 1", "revolucao v", "super relampago",
  "super relampago no 1", "tempestade do tigre", "tempestade tornado furacao",
  "ultimo recurso σ", "vendaval wyvern", "zero magnum", "aguia de duas cabecas"
]);

const TRIO_OF_MOVES = new Set([
  "disparada tripla"
]);

const DUO_OF_MOVES = new Set([
  "campo assassino", "corrida em dupla", "cruz britanica", "passe duplo",
  "passe do julgamento", "passe do julgamento 2", "passe do julgamento 3",
  "harmonia olimpica", "zero-quatro"
]);

const TRIO_DF_MOVES = new Set([
  "selva profunda", "zona sigma", "zona do pentagrama"
]);

const DUO_DF_MOVES = new Set([
  "ciclone duplo", "tempestade dupla", "mistura dupla", "jogada ensaiada",
  "ponte relampago", "muralha de ferro", "barragem de pedra", "defesa propulsora",
  "sem saida", "guarda da baleia", "equacao defensiva", "zona de perfil",
  "prisao fractal", "armadilha maravilha", "cinturao de asteroides"
]);

function normalizeCoopMoveKey(moveName) {
  const tail = String(moveName || "").split("➔").pop();
  return tail
    .replace(/\s*\(enfraquecido\)\s*/gi, "")
    .replace(/(?:\s*(?:g[2-5]|shin|kai|v[2-4]|\+|★))+$/gi, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/º/g, "o")
    .trim()
    .toLowerCase();
}

function getCoopMovePartnerCount(moveName, cat = "SH") {
  const key = normalizeCoopMoveKey(moveName);
  if (!key) return 0;
  if (cat === "OF") {
    if (TRIO_OF_MOVES.has(key)) return 2;
    if (DUO_OF_MOVES.has(key)) return 1;
    return 0;
  }
  if (cat === "DF") {
    if (TRIO_DF_MOVES.has(key)) return 2;
    if (DUO_DF_MOVES.has(key)) return 1;
    return 0;
  }
  if (TRIO_SHOT_MOVES.has(key)) return 2;
  if (DUO_SHOT_MOVES.has(key)) return 1;
  return 0;
}

function getCoopShotPartnerCount(moveName) {
  return getCoopMovePartnerCount(moveName, "SH");
}

function hasFriendshipLinkBetween(pA, pB) {
  if (!pA || !pB || typeof FRIENDSHIP_BONDS === "undefined" || !Array.isArray(FRIENDSHIP_BONDS)) return false;
  const normFn = typeof normalizePlayerFullName === "function" ? normalizePlayerFullName : (s) => String(s || "").trim();
  const fA = normFn(pA.fullName || pA.name || "").toLowerCase();
  const fB = normFn(pB.fullName || pB.name || "").toLowerCase();
  const sA = String(pA.name || "").toLowerCase();
  const sB = String(pB.name || "").toLowerCase();
  if ((!fA && !sA) || (!fB && !sB) || (fA && fA === fB)) return false;
  return FRIENDSHIP_BONDS.some((b) => {
    const req = b?.members || b?.players || b?.names || [];
    if (!Array.isArray(req) || req.length < 2) return false;
    const low = req.map((x) => normFn(x).toLowerCase());
    const hasA = low.some((x) => x === fA || (sA && x.includes(sA)));
    const hasB = low.some((x) => x === fB || (sB && x.includes(sB)));
    return hasA && hasB;
  });
}

function getCoopShotPartners(moveName, shooterNode, teamNodes, pitch, cat = "SH") {
  const count = getCoopMovePartnerCount(moveName, cat);
  if (count <= 0 || !shooterNode || !Array.isArray(teamNodes)) return [];
  const isUserSide = shooterNode.side === "user" && !pitch?.is5v5;
  const getAffLv = (mate) => {
    if (!isUserSide || typeof getPairAffinityEntry !== "function") return 0;
    return getPairAffinityEntry(shooterNode.player, mate?.player)?.level || 0;
  };
  const roleRank = (r) => {
    if (cat === "DF") return r === "DF" ? 0 : r === "MF" ? 1 : 2;
    if (cat === "OF") return r === "MF" ? 0 : r === "FW" ? 1 : 2;
    return r === "FW" ? 0 : r === "MF" ? 1 : 2;
  };

  const eligible = teamNodes.filter((n) => n && n.uid !== shooterNode.uid && n.role !== "GK" && (n.staggerTimer || 0) <= 0);
  const fallbackPool = eligible.length >= count ? eligible : teamNodes.filter((n) => n && n.uid !== shooterNode.uid && n.role !== "GK");
  const pool = [...fallbackPool].sort((a, b) => {
    const aBond = hasFriendshipLinkBetween(shooterNode.player, a.player) ? 1 : 0;
    const bBond = hasFriendshipLinkBetween(shooterNode.player, b.player) ? 1 : 0;
    if (aBond !== bBond) return bBond - aBond;
    const aAff = getAffLv(a);
    const bAff = getAffLv(b);
    if (aAff !== bAff) return bAff - aAff;
    const aSameTeam = shooterNode.player?.teamId && a.player?.teamId === shooterNode.player.teamId ? 1 : 0;
    const bSameTeam = shooterNode.player?.teamId && b.player?.teamId === shooterNode.player.teamId ? 1 : 0;
    if (aSameTeam !== bSameTeam) return bSameTeam - aSameTeam;
    const ra = roleRank(a.role);
    const rb = roleRank(b.role);
    if (ra !== rb) return ra - rb;
    const da = Math.hypot(a.x - shooterNode.x, a.y - shooterNode.y);
    const db = Math.hypot(b.x - shooterNode.x, b.y - shooterNode.y);
    return da - db;
  });

  return pool.slice(0, count).map((n) => {
    const affLevel = getAffLv(n);
    const hasBond = hasFriendshipLinkBetween(shooterNode.player, n.player);
    const sameTeam = Boolean(shooterNode.player?.teamId && n.player?.teamId === shooterNode.player.teamId);
    const sameElem = Boolean(shooterNode.player?.element && n.player?.element === shooterNode.player.element);
    const dist = Math.hypot(n.x - shooterNode.x, n.y - shooterNode.y);
    return {
      uid: n.uid,
      node: n,
      name: n.player.name,
      sprite: typeof resolveDynamicNodeSprite === "function" ? resolveDynamicNodeSprite(n, pitch) : n.player.sprite,
      affinityLevel: affLevel,
      hasBond,
      sameTeam,
      sameElem,
      dist
    };
  });
}

function evaluateCoopMoveSupport(moveName, cat, actorNode, teamNodes, pitch, awardAffinity = true) {
  if (typeof isBetaMode === "function" && !isBetaMode()) {
    const partners = cat === "SH" ? getCoopShotPartners(moveName, actorNode, teamNodes, pitch, "SH") : [];
    return { partners, bonusScore: 0, summaryTag: "" };
  }
  const partners = getCoopShotPartners(moveName, actorNode, teamNodes, pitch, cat);
  if (!partners || partners.length === 0) {
    return { partners: [], bonusScore: 0, summaryTag: "" };
  }
  const isShot = cat === "SH";
  const affWeights = isShot ? [0, 0.45, 0.95, 1.50] : [0, 0.35, 0.75, 1.15];
  const basePerPartner = isShot ? 0.50 : 0.40;
  let total = 0;
  let maxAffLv = 0;
  let anyBond = false;

  partners.forEach((pt) => {
    const affLv = pt.affinityLevel || 0;
    if (affLv > maxAffLv) maxAffLv = affLv;
    if (pt.hasBond) anyBond = true;
    const proxMul = pt.dist <= 22 ? 1.0 : pt.dist <= 28 ? 0.85 : 0.65;
    const partnerRaw =
      basePerPartner +
      (affWeights[affLv] || 0) +
      (pt.hasBond ? 0.40 : 0) +
      (pt.sameTeam ? 0.25 : 0) +
      (pt.sameElem ? 0.20 : 0);
    total += partnerRaw * proxMul;
  });

  const cap = isShot ? (partners.length >= 2 ? 3.8 : 2.6) : (partners.length >= 2 ? 2.8 : 2.0);
  if (actorNode?.side === "user" && !pitch?.is5v5) {
    if (
      Array.isArray(state.tournament?.nextMatchChatBuffs) &&
      state.tournament.nextMatchChatBuffs.some((b) => b.type === "COOP_SYNC" && actorNode?.player?.id && b.playerIds?.includes(actorNode.player.id))
    ) {
      total += 0.80;
    }
    if (typeof getBetaPairArc === "function") {
      partners.forEach((pt) => {
        const arc = getBetaPairArc(actorNode.player, pt.node?.player);
        if (!arc) return;
        if (arc.state === "PARCERIA_EM_ALTA" || arc.state === "RECONCILIADOS") total += 0.45;
        else if (arc.state === "TRETA_ABERTA") total -= 0.55;
      });
    }
    if (typeof getCoachRespectInfo === "function") {
      const rTier = getCoachRespectInfo().tier;
      if (rTier === "HIGH") total += 0.25;
      else if (rTier === "LOW") total -= 0.35;
    }
  }
  const bonusScore = Number(Math.max(0, Math.min(cap, total)).toFixed(2));
  const kindWord = partners.length >= 2 ? "Trio" : "Dupla";
  const synSuffix = maxAffLv > 0 ? ` Nv.${maxAffLv}` : anyBond ? " Laço" : "";
  const summaryTag = `${kindWord}${synSuffix} +${bonusScore.toFixed(1)}`;

  if (awardAffinity && actorNode?.side === "user" && !pitch?.is5v5 && typeof addPairAffinityPoints === "function") {
    partners.forEach((pt) => {
      if (pt.node?.player) {
        addPairAffinityPoints(actorNode.player, pt.node.player, 10, "coopMoves");
      }
    });
    if (pitch) {
      pitch.synergyLinkFx = {
        fromUid: actorNode.uid,
        toUids: partners.map((p) => p.uid),
        color: cat === "DF" ? "#38bdf8" : cat === "OF" ? "#a855f7" : "#facc15",
        start: performance.now(),
        duration: 780
      };
    }
  }
  return { partners, bonusScore, summaryTag };
}

function applyCoopStaminaCost(actorNode, baseCost, partners) {
  if (!actorNode) return;
  const cost = Number(baseCost) || 0;
  if (cost <= 0) return;
  if (typeof isBetaMode === "function" && !isBetaMode()) {
    spendStamina(actorNode, cost);
    return;
  }
  const fitPartners = (partners || []).filter((pt) => pt.node && (pt.node.stamina || 0) >= 45);
  if (fitPartners.length === 0) {
    spendStamina(actorNode, cost);
    return;
  }
  const shareRatio = (partners || []).length >= 2 ? 0.30 : 0.20;
  spendStamina(actorNode, cost * (1 - shareRatio));
  const eachCost = (cost * shareRatio) / fitPartners.length;
  fitPartners.forEach((pt) => spendStamina(pt.node, eachCost));
}

function renderClashFighterColumnHTML(fighter, sideCls) {
  const partners = Array.isArray(fighter.partners) ? fighter.partners : [];
  const topPartner = partners.length >= 1 ? partners[0] : null;
  const bottomPartner = partners.length >= 2 ? partners[1] : null;
  return `
    <div class="clash-fighter ${partners.length > 0 ? "has-coop-partners" : ""} ${partners.length >= 2 ? "is-trio-coop" : partners.length === 1 ? "is-duo-coop" : ""}">
      <div class="clash-avatar-stack">
        ${topPartner ? `
          <div class="clash-coop-partner is-top" title="${topPartner.name}">
            <img class="clash-coop-avatar ${sideCls}" src="${topPartner.sprite}" alt="${topPartner.name}" />
          </div>
        ` : ""}
        <img class="clash-avatar ${sideCls}" src="${fighter.sprite}" alt="${fighter.name}" />
        ${bottomPartner ? `
          <div class="clash-coop-partner is-bottom" title="${bottomPartner.name}">
            <img class="clash-coop-avatar ${sideCls}" src="${bottomPartner.sprite}" alt="${bottomPartner.name}" />
          </div>
        ` : ""}
      </div>
      <div class="clash-fighter-name">${fighter.name}</div>
      <span class="clash-role-badge">${fighter.roleText}</span>
      ${fighter.coopTag ? `<div class="clash-coop-syn-badge">${fighter.coopTag}</div>` : ""}
    </div>
  `;
}

function playShotClashAndContinue(st, clash, onImpactOutcome, ovrDiff, onModalClosed = null) {
  // Em 2x/4x resolve instantaneamente sem abrir o modal
  if (state.simSpeed !== 1) {
    if (onImpactOutcome) onImpactOutcome();
    if (onModalClosed) onModalClosed(true);
    syncLivePitchDOM(st);
    handleMinuteEndBoundaries(st, ovrDiff);
    return;
  }

  // Pausa o relógio lógico para a cena de duelo (o campo rAF 60fps continua rodando!)
  if (state.tournament.timerId) {
    clearInterval(state.tournament.timerId);
    state.tournament.timerId = null;
  }

  const slotEl = document.getElementById("shot-clash-slot");
  if (!slotEl) {
    if (onImpactOutcome) onImpactOutcome();
    if (onModalClosed) onModalClosed(true);
    syncLivePitchDOM(st);
    if (!handleMinuteEndBoundaries(st, ovrDiff)) startMatchInterval();
    return;
  }

  const dir = clash.dir === "rtl" ? "rtl" : "ltr";
  const dirCls = `dir-${dir}`;
  const topPillCls = "clash-move-shoot";
  const topIconCat = "SH";
  const botPillCls = "clash-move-def";
  const botIconCat = clash.bottomIcon || "GK";
  const runnerHTML = `
    <div class="fireball-runner ${dirCls}">
      <div class="fireball-trail"></div>
      <div class="fireball-orb">${buildFireballSVG()}</div>
    </div>
  `;
  const actionMs = 1950;
  const bannerMs = 850;

  slotEl.style.display = "flex";

  // Modal de Chute / Bloqueio sobre o campo (Dream Team à ESQUERDA, Adversário à DIREITA)
  slotEl.innerHTML = `
    <div class="shot-clash-stage pitch-modal-stage">
      <div class="clash-arena-grid">
        ${renderClashFighterColumnHTML(clash.userPlayer, "side-user")}

        <div class="clash-center-lane">
          <div class="clash-move-pill ${topPillCls}">
            ${moveIconHTML(topIconCat)} <span>${clash.topMoveName}</span>
          </div>

          <div class="clash-track">
            ${runnerHTML}
          </div>

          <div class="clash-move-pill ${botPillCls}">
            ${moveIconHTML(botIconCat)} <span>${clash.bottomMoveName}</span>
          </div>
        </div>

        ${renderClashFighterColumnHTML(clash.oppPlayer, "side-opp")}
      </div>
      <div id="clash-result-mount"></div>
    </div>
  `;

  let impactApplied = false;
  let afterApplied = false;

  const finishClash = (skipRestart = false) => {
    state.tournament.pendingClashFinish = null;
    const mountSlot = document.getElementById("shot-clash-slot");
    if (mountSlot) {
      mountSlot.innerHTML = "";
      mountSlot.style.display = "none";
    }

    if (!impactApplied && onImpactOutcome) {
      impactApplied = true;
      onImpactOutcome();
    }
    syncLivePitchDOM(st);

    let beatOwned = false;
    if (!afterApplied && onModalClosed) {
      afterApplied = true;
      beatOwned = Boolean(onModalClosed(skipRestart));
    }
    if (!beatOwned) {
      const matchEnded = handleMinuteEndBoundaries(st, ovrDiff);
      if (!matchEnded && !skipRestart && st.running && !st.finished) {
        startMatchInterval();
      }
    }
  };

  state.tournament.pendingClashFinish = finishClash;

  state.tournament.clashTimer1 = setTimeout(() => {
    if (!impactApplied && onImpactOutcome) {
      impactApplied = true;
      onImpactOutcome();
      syncLivePitchDOM(st);
    }

    const resMount = document.getElementById("clash-result-mount");
    if (resMount) {
      const resCls = clash.outcomePositive ? "res-goal" : "res-saved";
      resMount.innerHTML = `
        <div class="clash-result-overlay ${resCls}">
          <div class="clash-result-banner">${clash.resultBannerText}</div>
        </div>
      `;
    }

    state.tournament.clashTimer2 = setTimeout(() => {
      finishClash(false);
    }, bannerMs);
  }, actionMs);
}

function ensureMatchSupport(st, pitch) {
  if (!pitch || pitch.matchSupportInitialized) return;
  if (st.isGoldenGoal5v5) {
    const uPwrAvg = pitch.userNodes.reduce((s, n) => s + (n.indivPower || 120), 0) / Math.max(1, pitch.userNodes.length);
    const oPwrAvg = pitch.oppNodes.reduce((s, n) => s + (n.indivPower || 120), 0) / Math.max(1, pitch.oppNodes.length);
    const avgPwr5 = Math.max(80, (uPwrAvg + oPwrAvg) * 0.5);
    const relPwrDiff5 = (uPwrAvg - oPwrAvg) / avgPwr5;
    const pwrEdge = relPwrDiff5 * 8.0;
    pitch.matchSupport = {
      userTeamSupport: 2.0 + Math.max(-3.0, Math.min(4.0, pwrEdge)),
      oppTeamSupport: 2.0 + Math.max(-3.0, Math.min(4.0, -pwrEdge)),
      powerDiff: Math.round((uPwrAvg - oPwrAvg) * 5),
      relPwrDiff: relPwrDiff5,
      ovrDiff: Math.round((uPwrAvg - oPwrAvg) / 10)
    };
    pitch.matchSupportInitialized = true;
    return;
  }
  const stageIdx = state.tournament.stageIndex || 0;
  const userStats = calcSquadStats();
  const oppStats = calcOpponentStats(st.oppTeam, stageIdx);
  const powerDiff = userStats.power - oppStats.power;
  // Vantagem proporcional (relativa ao nível da fase) gera suporte equilibrado nos duelos!
  const avgPwr = Math.max(1000, (userStats.power + oppStats.power) * 0.5);
  const relPwrDiff = powerDiff / avgPwr;
  const userPwrBonus = relPwrDiff > 0 ? Math.min(2.2, relPwrDiff * 7.5) : 0;
  const oppPwrBonus = relPwrDiff < 0 ? Math.min(2.2, Math.abs(relPwrDiff) * 7.5) : 0;

  pitch.matchSupport = {
    userTeamSupport:
      (userStats.chem / 100) * 3.4 +
      userPwrBonus,
    oppTeamSupport:
      (oppStats.chem / 100) * 3.4 +
      oppPwrBonus,
    powerDiff,
    relPwrDiff,
    ovrDiff: userStats.ovr - oppStats.ovr
  };
  pitch.matchSupportInitialized = true;
}

function triggerStealShockwave(pitch, centerX, centerY, stealerUid, tackledUid = null) {
  if (!pitch) return;
  const now = performance.now();
  const dur = state.simSpeed === 4 ? 95 : state.simSpeed === 2 ? 220 : 420;
  pitch.shockFx = { x: centerX, y: centerY, start: now, duration: dur + 120 };
  pitch.pushTweens = [];
  pitch.interceptTweens = [];

  [...pitch.userNodes, ...pitch.oppNodes].forEach((n) => {
    if (n.uid === stealerUid || n.role === "GK") return;
    const dx = n.x - centerX;
    const dy = n.y - centerY;
    const dist = Math.hypot(dx, dy);
    if (dist > 20) return;

    const angle = dist > 0.25 ? Math.atan2(dy, dx) : n.side === "user" ? Math.PI : 0;
    const pushDist = n.uid === tackledUid ? 6.6 : Math.max(2.6, (1 - dist / 20) * 5.8);
    const toX = Math.max(8, Math.min(92, n.x + Math.cos(angle) * pushDist));
    const toY = Math.max(10, Math.min(90, n.y + Math.sin(angle) * pushDist));

    n.vx = Math.cos(angle) * 7.5;
    n.vy = Math.sin(angle) * 7.5;
    n.duelCooldown = Math.max(n.duelCooldown || 0, 0.75);
    pitch.pushTweens.push({
      node: n,
      fromX: n.x,
      fromY: n.y,
      toX,
      toY,
      start: now,
      duration: dur
    });
  });
}

function triggerSaveImplosion(pitch, centerX, centerY) {
  if (!pitch) return;
  const dur = state.simSpeed === 4 ? 130 : state.simSpeed === 2 ? 270 : 620;
  pitch.saveRingFx = {
    x: Math.max(4, Math.min(96, centerX)),
    y: Math.max(10, Math.min(90, centerY)),
    start: performance.now(),
    duration: dur
  };
}

function triggerGoalLightningBurst(pitch, goalSide, targetX = null, targetY = 50) {
  if (!pitch) return;
  const dur = state.simSpeed === 4 ? 260 : state.simSpeed === 2 ? 550 : 1200;
  const isRight = goalSide !== "left";
  const burstX = targetX !== null ? targetX : (isRight ? 95.8 : 4.2);
  const burstY = targetY !== null ? targetY : 50;
  pitch.goalBurstFx = {
    side: isRight ? "right" : "left",
    x: burstX,
    y: burstY,
    start: performance.now(),
    duration: dur
  };
}

function resolvePhysicalDribbleClash(st, pitch, carrier, marker, attSupport, defSupport, ovrDiff) {
  const attIsUser = carrier.side === "user";
  const ofPick = pickStaminaGatedMove(carrier, "OF");
  const dfPick = pickStaminaGatedMove(marker, "DF");
  const carrierSpd = carrier.spd || calcPlayerSpeedStat(carrier.player, carrier.effOvr);
  const markerSpd = marker.spd || calcPlayerSpeedStat(marker.player, marker.effOvr);
  const spdDiff = carrierSpd - markerSpd;
  const spdBonus = Math.max(-4.5, Math.min(4.5, spdDiff * 0.28));
  let dribTacBonus = 0;
  if (attIsUser) {
    const dLvl = state.tournament?.prepBonuses?.dribbleEdgeLvl || 0;
    if (dLvl > 0) {
      dribTacBonus += [0, 0.9, 1.8, 2.7][dLvl] || 2.7;
      const lane = getTactics().lane;
      const inChosenLane =
        (lane === "wings" && (carrier.y < 34 || carrier.y > 66)) ||
        (lane === "center" && carrier.y >= 34 && carrier.y <= 66);
      if (inChosenLane) dribTacBonus += 0.8;
    }
  }
  const attTeamNodes = attIsUser ? (pitch.userNodes || []) : (pitch.oppNodes || []);
  const defTeamNodes = attIsUser ? (pitch.oppNodes || []) : (pitch.userNodes || []);
  const coopOf = ofPick.move ? evaluateCoopMoveSupport(ofPick.move, "OF", carrier, attTeamNodes, pitch, true) : { partners: [], bonusScore: 0, summaryTag: "" };
  const coopDf = dfPick.move ? evaluateCoopMoveSupport(dfPick.move, "DF", marker, defTeamNodes, pitch, true) : { partners: [], bonusScore: 0, summaryTag: "" };

  const dribScore = calcNodeDuelScore(carrier, attSupport, marker?.player?.element, "OF") + ofPick.duelBonus + spdBonus + dribTacBonus + coopOf.bonusScore;
  const defScore = calcNodeDuelScore(marker, defSupport, carrier?.player?.element, "DF") + dfPick.duelBonus + coopDf.bonusScore;
  const wonDribble = Math.random() < logisticWinProb(dribScore, defScore, 4.4, 0.38, 0.86);

  applyCoopStaminaCost(carrier, ofPick.cost, coopOf.partners);
  applyCoopStaminaCost(marker, dfPick.cost, coopDf.partners);
  carrier.duelCooldown = 1.45;
  marker.duelCooldown = 1.45;

  if (attIsUser) {
    pitch.stats.userDribblesTry++;
    recordUserPlayerStat(pitch, carrier, "dribblesTry", 1);
  }

  const ofMove = ofPick.move || (ofPick.exhausted ? "Drible sem técnica (sem energia)" : "Avanço Direto");
  const dfMove = dfPick.move || (dfPick.exhausted ? "Corte sem técnica (sem energia)" : "Marcação Cerrada");
  const dir = attIsUser ? 1 : -1;

  if (wonDribble) {
    if (attIsUser) {
      pitch.stats.userDribblesOk++;
      recordUserPlayerStat(pitch, carrier, "dribblesOk", 1);
    }
    if (
      !(
        pitch.lastAssistCandidate &&
        pitch.lastAssistCandidate.side === carrier.side &&
        pitch.lastAssistCandidate.receiverUid === carrier.uid
      )
    ) {
      pitch.lastAssistCandidate = null;
    }
    pitch.lastPasserUid = null;
    pitch.lastAction = "DRIBBLE";
    const startX = carrier.x;
    const startY = carrier.y;
    const dodgeSign = startY >= marker.y ? 1 : -1;
    const defList = attIsUser ? (pitch.oppNodes || []) : (pitch.userNodes || []);
    const oppGk = defList.find((d) => d.role === "GK");
    const gkMargin = 6.8;
    const maxSafeX = attIsUser ? (oppGk ? Math.min(84.5, oppGk.x - gkMargin) : 84.5) : 90;
    const minSafeX = !attIsUser ? (oppGk ? Math.max(15.5, oppGk.x + gkMargin) : 15.5) : 10;
    const dashToX = attIsUser
      ? Math.max(10, Math.min(Math.max(startX - 1.5, maxSafeX), startX + dir * 10.5))
      : Math.min(90, Math.max(Math.min(startX + 1.5, minSafeX), startX + dir * 10.5));
    const dashToY = Math.max(12, Math.min(88, startY + dodgeSign * 5.2));
    const dashMs = state.simSpeed === 4 ? 95 : state.simSpeed === 2 ? 190 : 380;

    pitch.dashFx = {
      uid: carrier.uid,
      fromX: startX,
      fromY: startY,
      toX: dashToX,
      toY: dashToY,
      start: performance.now(),
      duration: dashMs
    };
    if (typeof playSfx === "function") playSfx("dribble");
    pitch.passTrail = {
      isDash: true,
      fromX: startX,
      fromY: startY,
      toX: dashToX,
      toY: dashToY,
      curX: startX,
      curY: startY,
      color: "#c084fc",
      start: performance.now(),
      flightDuration: dashMs,
      fadeUntil: performance.now() + dashMs + 520
    };
    if (state.simSpeed !== 1) {
      carrier.x = dashToX;
      carrier.y = dashToY;
      pitch.ballX = dashToX;
      pitch.ballY = dashToY;
    }
    carrier.vx = dir * carrier.maxSpeed * 1.15;
    carrier.vy = dodgeSign * 6.5;
    carrier.carryTime = 0.35;
    carrier.decisionTimer = 0.32;
    marker.staggerTimer = 1.15;
    marker.vx *= 0.15;
    marker.vy *= 0.15;

    const spdAdvTag = spdDiff >= 5 ? ` <span style="color:#7dd3fc; font-size:0.75rem;">(⚡ +${spdDiff} VEL)</span>` : "";
    const ofCoopNames = coopOf.partners.length > 0 ? ` c/ ${coopOf.partners.map((p) => p.name).join(" & ")}` : "";
    const ofBadgeText = ofPick.move ? `Avançou • ${ofMove}` : ofPick.exhausted ? "Avançou (Sem técnica)" : "Avançou";
    showNodeBadge(pitch, carrier.uid, ofBadgeText, "badge-dribble", 1500, ofPick.move ? "OF" : null);
    pitch.ticker = `${st.minute}' ${carrier.player.name} avançou com ${ofMove}${ofCoopNames} sobre ${marker.player.name}!`;
    prependNarrationLine(
      st,
      "nar-dribble",
      ofPick.move
        ? `${st.minute}' [Drible] ${carrier.player.name} ativou 【${ofMove}】${ofCoopNames} e avançou por ${marker.player.name}!${spdAdvTag}`
        : `${st.minute}' [Drible] ${carrier.player.name} avançou sem técnica${ofPick.exhausted ? " (energia vermelha)" : ""} por ${marker.player.name}!${spdAdvTag}`,
      { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side },
      { name: marker.player.name, sprite: marker.player.sprite, side: marker.side },
      "OF"
    );
    syncLivePitchDOM(st);
    pauseForPitchBeat(st, "", "", 1050, ovrDiff);
  } else {
    pitch.ballSide = attIsUser ? "opp" : "user";
    pitch.ballMode = "CARRIED";
    pitch.carrierUid = marker.uid;
    pitch.challengerUid = null;
    pitch.holdBallPos = null;
    pitch.passState = null;
    pitch.looseState = null;
    pitch.lastAssistCandidate = null;
    pitch.lastPasserUid = null;
    pitch.lastAction = "STEAL";
    pitch.teamConsecutivePasses = 0;
    if (typeof playSfx === "function") playSfx("steal");
    marker.carryTime = 0;
    marker.decisionTimer = 0.25;
    marker.vx = -dir * marker.maxSpeed * 0.85;
    carrier.staggerTimer = 1.05;
    carrier.vx *= 0.15;
    carrier.vy *= 0.15;
    const stealFootX = marker.x + (marker.side === "user" ? 1.9 : -1.9);
    const stealFootY = marker.y + 1.0;
    if (state.simSpeed === 1) {
      startBallFlight(pitch, pitch.ballX, pitch.ballY, stealFootX, stealFootY, 145, 0, "CONTROL", null);
    } else {
      pitch.ballX = stealFootX;
      pitch.ballY = stealFootY;
    }

    const spdDefTag = spdDiff <= -5 ? ` <span style="color:#7dd3fc; font-size:0.75rem;">(⚡ +${Math.abs(spdDiff)} VEL marcador)</span>` : "";
    const dfCoopNames = coopDf.partners.length > 0 ? ` c/ ${coopDf.partners.map((p) => p.name).join(" & ")}` : "";
    pitch.ballZ = 0;
    pitch.ballVz = 0;
    triggerStealShockwave(pitch, marker.x, marker.y, marker.uid, carrier.uid);
    showNodeBadge(pitch, carrier.uid, "Perdeu a bola", "badge-lost", 1500);
    showNodeBadge(pitch, marker.uid, dfPick.move ? `Roubou • ${dfMove}` : "Roubou (Sem técnica)", "badge-steal", 1500, dfPick.move ? "DF" : null);
    if (!attIsUser) {
      pitch.stats.userSteals++;
      triggerCatenaccioCounterIfActive(pitch);
      recordUserPlayerStat(pitch, marker, "steals", 1);
    } else {
      pitch.catenaccioCounterTimer = 0;
    }
    pitch.ticker = `${st.minute}' ${carrier.player.name} perdeu a bola — roubo de ${marker.player.name} (${dfMove}${dfCoopNames})!`;
    prependNarrationLine(
      st,
      "nar-steal",
      dfPick.move
        ? `${st.minute}' [Desarme] ${marker.player.name} usou 【${dfMove}】${dfCoopNames} e roubou a bola de ${carrier.player.name}!${spdDefTag}`
        : `${st.minute}' [Desarme] ${marker.player.name} roubou a bola sem técnica${dfPick.exhausted ? " (energia vermelha)" : ""} de ${carrier.player.name}!${spdDefTag}`,
      { name: marker.player.name, sprite: marker.player.sprite, side: marker.side },
      { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side },
      "DF"
    );
    syncLivePitchDOM(st);
    pauseForPitchBeat(st, "", "", 1050, ovrDiff);
  }
}

function getUserCaptainAuraType(pitch) {
  if (!pitch || pitch.is5v5) return null;
  if (typeof getActiveTeamCaptain !== "function" || typeof getCaptainAuraInfo !== "function") return null;
  const capObj = getActiveTeamCaptain();
  if (!capObj) return null;
  const tacRole = capObj.player?.id && capObj.player.id === getTactics().acePlayerId ? "CAMISA_10" : "NONE";
  return getCaptainAuraInfo(capObj.player, capObj.role, tacRole).type;
}

function isPlayThreateningBoundary(st) {
  const pitch = st?.pitch;
  if (!pitch || st.isGoldenGoal5v5) return false;
  if (pitch.ballMode === "SHOT_FLIGHT" || pitch.ballMode === "GOAL_NET") return true;
  const ballX = pitch.ballX ?? 50;
  if (pitch.ballMode === "PASS_FLIGHT" && pitch.passState) {
    const toX = pitch.passState.toX ?? ballX;
    return pitch.ballSide === "user" ? toX >= 68 : toX <= 32;
  }
  if (pitch.ballMode === "CARRIED") {
    return pitch.ballSide === "user" ? ballX >= 68 : ballX <= 32;
  }
  if (pitch.ballMode === "LOOSE_BALL") {
    return ballX >= 76 || ballX <= 24;
  }
  return false;
}

function triggerCatenaccioCounterIfActive(pitch) {
  if (!pitch || pitch.is5v5) return;
  if ((pitch.hissatsuTacticTimer || 0) > 0 && pitch.activeHissatsuTacticId === "catenaccio") {
    pitch.catenaccioCounterTimer = 7.0;
    showPitchBadge(pitch, 50, 44, "⚡ CONTRA-ATAQUE!", "badge-keshin", 1200);
  }
}

function formatPtShotArticle(label) {
  const low = String(label || "chute").toLowerCase();
  const isFem = /^(bomba|finaliza|cabe[çc]ada|batida|chapa|cavadinha|pancada|fogueteira)/i.test(low);
  return `${isFem ? "uma" : "um"} ${low}`;
}

function resolveGkRushClash(st, pitch, carrier, oppGk, attSupport, defSupport, ovrDiff) {
  const gkPick = pickStaminaGatedMove(oppGk, "GK");
  const gkDist = visualPitchDist(oppGk.x, oppGk.y, carrier.x, carrier.y);
  const handGrabSure = gkDist <= 4.1;

  let gkWon = handGrabSure;
  if (!handGrabSure) {
    const ofPick = pickStaminaGatedMove(carrier, "OF");
    const gkScore = calcNodeDuelScore(oppGk, defSupport, carrier?.player?.element, "GK") + gkPick.duelBonus + 2.4;
    const attScore = calcNodeDuelScore(carrier, attSupport, oppGk?.player?.element, "OF") + ofPick.duelBonus;
    gkWon = Math.random() < logisticWinProb(gkScore, attScore, 1.4, 0.52, 0.94);
    spendStamina(carrier, Math.max(1.5, ofPick.cost * 0.4));
  }

  spendStamina(oppGk, Math.max(1.5, gkPick.cost * 0.35));
  oppGk.duelCooldown = 1.35;
  carrier.duelCooldown = 1.1;
  oppGk.isGkRushing = false;

  if (!gkWon) {
    const dodgeSign = carrier.y >= oppGk.y ? 1 : -1;
    const dir = carrier.side === "user" ? 1 : -1;
    const safeMinX = carrier.side === "user" ? 10 : Math.max(14.5, oppGk.x + 5.0);
    const safeMaxX = carrier.side === "user" ? Math.min(85.5, oppGk.x - 5.0) : 90;
    carrier.x = Math.max(safeMinX, Math.min(safeMaxX, carrier.x + dir * 1.0));
    carrier.y = Math.max(14, Math.min(86, carrier.y + dodgeSign * 4.6));
    carrier.decisionTimer = 0.04;
    oppGk.staggerTimer = 0.72;
    showNodeBadge(pitch, carrier.uid, "Passou pelo Goleiro!", "badge-dribble", 1300, "OF");
    pitch.ticker = `${st.minute}' ${carrier.player.name} tirou do alcance de ${oppGk.player.name} na área!`;
    syncLivePitchDOM(st);
    pauseForPitchBeat(st, "", "", 650, ovrDiff);
    return;
  }

  carrier.staggerTimer = 0.72;
  pitch.ballSide = oppGk.side;
  pitch.ballMode = "CARRIED";
  pitch.carrierUid = oppGk.uid;
  pitch.challengerUid = null;
  pitch.holdBallPos = null;
  pitch.passState = null;
  pitch.looseState = null;
  pitch.ballZ = 0;
  pitch.ballVz = 0;
  pitch.lastAssistCandidate = null;
  pitch.lastPasserUid = null;
  pitch.lastAction = "SAVE";
  pitch.teamConsecutivePasses = 0;
  oppGk.carryTime = 0.08;
  oppGk.decisionTimer = 0.55;

  const gkFootX = oppGk.x + (oppGk.side === "user" ? 1.8 : -1.8);
  const gkFootY = oppGk.y + 0.6;
  if (state.simSpeed === 1) {
    startBallFlight(pitch, pitch.ballX, pitch.ballY, gkFootX, gkFootY, 130, 0, "CONTROL", null);
  } else {
    pitch.ballX = gkFootX;
    pitch.ballY = gkFootY;
  }

  triggerStealShockwave(pitch, oppGk.x, oppGk.y, oppGk.uid, carrier.uid);
  showNodeBadge(pitch, oppGk.uid, handGrabSure ? "Pegou com as mãos!" : "Saída Corajosa!", "badge-save", 1600, "GK");
  showNodeBadge(pitch, carrier.uid, "Abafado!", "badge-lost", 1500);
  if (oppGk.side === "user") {
    pitch.stats.userSaves++;
    triggerCatenaccioCounterIfActive(pitch);
    recordUserPlayerStat(pitch, oppGk, "saves", 1);
  } else {
    pitch.catenaccioCounterTimer = 0;
  }
  pitch.ticker = `${st.minute}' ${oppGk.player.name} saiu na área e agarrou a bola com as mãos dos pés de ${carrier.player.name}!`;
  prependNarrationLine(
    st,
    "nar-save",
    `${st.minute}' [Saída do Goleiro] ${oppGk.player.name} fechou o espaço na área e agarrou a bola com as mãos antes de ${carrier.player.name} finalizar!`,
    { name: oppGk.player.name, sprite: oppGk.player.sprite, side: oppGk.side },
    { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side },
    "GK"
  );
  syncLivePitchDOM(st);
  pauseForPitchBeat(st, "", "", 850, ovrDiff);
}

function isNodeOffside(receiver, passer, attIsUser, defNodes) {
  const oppOutfieldDefs = (defNodes || []).filter((d) => d.role !== "GK");
  const oppDefLineX = oppOutfieldDefs.length > 0
    ? (attIsUser ? Math.max(...oppOutfieldDefs.map((d) => d.x)) : Math.min(...oppOutfieldDefs.map((d) => d.x)))
    : (attIsUser ? 84 : 16);
  const isOnside = attIsUser
    ? (receiver.x <= 50 || receiver.x <= passer.x + 0.8 || receiver.x <= oppDefLineX + 0.8)
    : (receiver.x >= 50 || receiver.x >= passer.x - 0.8 || receiver.x >= oppDefLineX - 0.8);
  return !isOnside && (attIsUser ? receiver.x > 50 : receiver.x < 50);
}

function launchContinuousPass(st, pitch, carrier, attNodes, defNodes, strictForward, safeRestart, isOneTwoPass = false, passOptions = {}) {
  const attIsUser = carrier.side === "user";
  const isGkOutlet = carrier.role === "GK";
  const isSafeProtectedPass = Boolean(safeRestart || isGkOutlet || isOneTwoPass || passOptions.isReturnOneTwo);
  const receiver = passOptions.targetReceiver || pickPassReceiver(attNodes, defNodes, carrier, strictForward, pitch);
  if (!receiver) return false;

  const fwdDir = attIsUser ? 1 : -1;

  // Linha de impedimento (penúltimo adversário, ou seja, o último jogador de linha)
  // No 5x5 NÃO há regra de impedimento
  const oppOutfieldDefs = (defNodes || []).filter((d) => d.role !== "GK");
  const oppDefLineX = oppOutfieldDefs.length > 0
    ? (attIsUser ? Math.max(...oppOutfieldDefs.map((d) => d.x)) : Math.min(...oppOutfieldDefs.map((d) => d.x)))
    : (attIsUser ? 84 : 16);

  const wasOffsideAtPassTime = !pitch.is5v5 && isNodeOffside(receiver, carrier, attIsUser, defNodes);
  const isReceiverOnside = !wasOffsideAtPassTime;

  const effRole = getEffectiveCarrierRole(carrier);
  const forwardSpace = attIsUser ? (oppDefLineX - receiver.x) : (receiver.x - oppDefLineX);
  const fwdDistToCarrier = attIsUser ? (receiver.x - carrier.x) : (carrier.x - receiver.x);

  // Decisão tática de colocar a bola à frente no espaço vazio (Passe em Profundidade / Enfiada de Bola):
  const userStyle = attIsUser && !pitch.is5v5 ? getTactics().style : "free";
  const capAura = attIsUser ? getUserCaptainAuraType(pitch) : null;
  let spaceRollProb = userStyle === "vertical" ? 0.58 : userStyle === "possession" ? 0.30 : 0.42;
  if (capAura === "STRATEGIST") spaceRollProb += 0.14;
  const wantsSpacePass = Boolean(
    passOptions.forceSpacePass ||
    isOneTwoPass ||
    passOptions.isReturnOneTwo ||
    (!isGkOutlet && !safeRestart && isReceiverOnside && (effRole === "MF" || effRole === "FW") && (forwardSpace >= 5 || fwdDistToCarrier >= 4) && Math.random() < Math.min(0.85, spaceRollProb))
  );

  const isThroughBall = Boolean(wantsSpacePass && !wasOffsideAtPassTime && !passOptions.isCross);

  let leadX;
  let leadY;

  if (passOptions.isCross) {
    const crossBoxX = attIsUser ? Math.max(76, Math.min(85, receiver.x + 1.8)) : Math.min(24, Math.max(15, receiver.x - 1.8));
    leadX = Number.isFinite(crossBoxX) ? crossBoxX : (attIsUser ? 82 : 18);
    leadY = Math.max(24, Math.min(76, receiver.y * 0.72 + 50 * 0.28));
  } else if (isThroughBall) {
    // Projeta a bola à frente no espaço vazio para o recebedor avançar com dash e buscar!
    const passerSkill = Math.max(50, Math.min(99, carrier.effOvr || 75));
    const spaceLeadDist = 6.5 + (passerSkill / 100) * 5.0; // 6.5 a 11.5 unidades de avanço

    let projX = receiver.x + fwdDir * spaceLeadDist;
    if (attIsUser) {
      projX = Math.max(12, Math.min(85.5, projX));
    } else {
      projX = Math.max(14.5, Math.min(88, projX));
    }

    const rx = Number.isFinite(receiver.x) ? receiver.x : (attIsUser ? 45 : 55);
    const ry = Number.isFinite(receiver.y) ? receiver.y : 50;
    const uidHash = typeof receiver.uid === "string"
      ? (receiver.uid.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 5)
      : ((Number(receiver.uid) || 1) % 5);
    const corridorDrift = (50 - ry) * 0.18 + (uidHash - 2) * 1.5;
    let projY = ry + corridorDrift;
    projY = Math.max(13, Math.min(87, projY));

    leadX = Number.isFinite(projX) ? projX : (attIsUser ? 75 : 25);
    leadY = Number.isFinite(projY) ? projY : 50;
  } else {
    const rx = Number.isFinite(receiver.x) ? receiver.x : (attIsUser ? 45 : 55);
    const ry = Number.isFinite(receiver.y) ? receiver.y : 50;
    const rawDist = Math.hypot(rx - carrier.x, ry - carrier.y);
    const estFlight = Math.max(0.22, Math.min(0.65, rawDist / 45));
    const rawVx = receiver.vx || 0;
    const rawVy = receiver.vy || 0;
    const leadStepX = Math.max(-5.5, Math.min(5.5, rawVx * estFlight * 0.55));
    const leadStepY = Math.max(-4.5, Math.min(4.5, rawVy * estFlight * 0.55));
    // Leve toque na passada à frente do receptor para o passe fluir sem empurrar para o goleiro
    const stridePushX = (!isGkOutlet && !safeRestart && Math.abs(leadStepX) < 1.5) ? fwdDir * 1.6 : 0;
    const minPassX = attIsUser ? 8 : 14.5;
    const maxPassX = attIsUser ? 85.5 : 92;
    leadX = Math.max(minPassX, Math.min(maxPassX, rx + leadStepX + stridePushX));
    leadY = Math.max(10, Math.min(90, ry + leadStepY));
  }

  const fromX = pitch.ballX;
  const fromY = pitch.ballY;
  const dx = leadX - fromX;
  const dy = leadY - fromY;
  const dist = Math.hypot(dx, dy) || 0.1;

  // Classificação real de altura da bola (GROUND / CHIP / LOB / CROSS / GK_CLEAR) apenas no modo Teste Beta
  const betaAerial = typeof isBetaMode === "function" && isBetaMode();
  let passType = "GROUND";
  let peakZ = 0;
  if (betaAerial) {
    let hasBlockerInCorridor = false;
    if (dist >= 9.5 && defNodes && defNodes.length > 0) {
      const uxB = dx / dist;
      const uyB = dy / dist;
      const nxB = -uyB;
      const nyB = uxB;
      hasBlockerInCorridor = defNodes.some((d) => {
        if (d.role === "GK" || d.staggerTimer > 0) return false;
        const rxD = d.x - fromX;
        const ryD = d.y - fromY;
        const along = rxD * uxB + ryD * uyB;
        if (along <= dist * 0.16 || along >= dist * 0.84) return false;
        return Math.abs(rxD * nxB + ryD * nyB) < 4.6;
      });
    }

    const profPasser = typeof getNodePersonality === "function" ? getNodePersonality(carrier) : { archetype: "EQUILIBRADO" };
    const routeSkyOn = attIsUser && !pitch?.is5v5 && (pitch?.hissatsuTacticTimer || 0) > 0 && pitch?.activeHissatsuTacticId === "route_of_sky";
    if (passOptions.forceClearance) {
      passType = "GK_CLEAR";
      peakZ = 1.28;
    } else if (passOptions.isCross) {
      passType = "CROSS";
      const recFis = receiver?.attrs?.fis || 75;
      const recVel = receiver?.attrs?.vel || 75;
      peakZ = recFis >= recVel + 4 ? 1.15 : 0.72;
    } else if (isGkOutlet && dist >= 22) {
      passType = "GK_CLEAR";
      peakZ = 1.30;
    } else if (
      !isOneTwoPass &&
      !passOptions.isReturnOneTwo &&
      !safeRestart &&
      (dist >= 26 || (isThroughBall && hasBlockerInCorridor && dist >= 16) || (Math.abs(dy) >= 24 && dist >= 20))
    ) {
      passType = "LOB";
      peakZ = Number(Math.min(1.25, 0.85 + Math.max(0, dist - 16) * 0.015).toFixed(2));
    } else if (
      !isOneTwoPass &&
      !passOptions.isReturnOneTwo &&
      !safeRestart &&
      hasBlockerInCorridor &&
      dist >= 9.5 &&
      (profPasser.archetype === "ESTRATEGISTA" || profPasser.archetype === "COLETIVISTA" || routeSkyOn || Math.random() < 0.72)
    ) {
      passType = "CHIP";
      peakZ = 0.65;
    }
  }

  const crossWhipBonus = betaAerial && passOptions.isCross && peakZ < 0.9 ? 5 : 0;
  const passSpeed = (peakZ >= 0.9 ? 31 : peakZ > 0 ? 36 : dist > 32 ? 50 : isThroughBall ? 46 : 44) + crossWhipBonus;
  const duration = betaAerial ? Math.max(0.22, Math.min(1.65, dist / passSpeed)) : Math.max(0.22, Math.min(1.25, dist / passSpeed));
  pitch.ballZ = 0;
  pitch.ballVz = 0;

  // Trajetória orgânica fixa: mistura passes retos/diretos com passes com efeito (curva)
  // Curva aparece naturalmente ao contornar marcador no caminho, em viradas/lançamentos longos ou ocasionais enfiadas diagonais
  let ctrlX = (fromX + leadX) * 0.5;
  let ctrlY = (fromY + leadY) * 0.5;
  let isCurvedPass = false;
  let curveSpinSign = 0;
  if (dist >= 11.5) {
    const ux = dx / dist;
    const uy = dy / dist;
    const nx = -uy;
    const ny = ux;
    let laneBias = 0;
    (defNodes || []).forEach((d) => {
      if (d.role === "GK") return;
      const rx = d.x - fromX;
      const ry = d.y - fromY;
      const along = rx * ux + ry * uy;
      if (along > dist * 0.15 && along < dist * 0.85) {
        const perp = rx * nx + ry * ny;
        if (Math.abs(perp) < 8.0) {
          const weight = (8.0 - Math.abs(perp)) / 8.0;
          laneBias += (perp >= 0 ? -1 : 1) * weight;
        }
      }
    });

    const hasBlockerInLane = Math.abs(laneBias) > 0.22;
    const isLongSwitch = dist >= 28;
    const isDiagonalSpace = isThroughBall && dist >= 16 && Math.abs(dy) >= 6;
    // No Modo Teste Beta, passes por cima (peakZ > 0) muitas vezes são ARCOS RETOS (sobem e descem sem efeito lateral),
    // pegando efeito/giro animesco apenas em parte dos cruzamentos e lançamentos técnicos!
    const shouldCurve =
      betaAerial && peakZ > 0
        ? (passOptions.isCross
            ? Math.random() < 0.56
            : ((carrier.attrs?.tec || 75) >= 82 && Math.random() < 0.36) || Math.random() < 0.20)
        : (passOptions.isCross ||
            hasBlockerInLane ||
            (isLongSwitch && Math.random() < 0.72) ||
            (isDiagonalSpace && Math.random() < 0.55) ||
            (!isOneTwoPass && dist >= 16 && Math.random() < 0.26));

    if (shouldCurve) {
      isCurvedPass = true;
      let curveSign;
      if (passOptions.isCross) {
        curveSign = (fromY < 50 ? fwdDir : -fwdDir);
      } else if (hasBlockerInLane) {
        curveSign = laneBias >= 0 ? 1 : -1;
      } else {
        const centerSide = (50 - ctrlY) * ny + fwdDir * nx * 0.4;
        curveSign = Math.abs(centerSide) > 0.1 ? (centerSide >= 0 ? 1 : -1) : (fromY < 50 ? 1 : -1);
      }
      curveSpinSign = curveSign;
      const maxArc = passOptions.isCross ? 6.4 : hasBlockerInLane ? 5.6 : isThroughBall ? 4.8 : 4.2;
      const minArc = passOptions.isCross ? 2.4 : hasBlockerInLane ? 1.5 : 1.0;
      const arcMag = Math.min(maxArc, Math.max(minArc, dist * (passOptions.isCross ? 0.16 : hasBlockerInLane ? 0.145 : 0.105)));
      ctrlX = Math.max(5, Math.min(95, ctrlX + nx * arcMag * curveSign));
      ctrlY = Math.max(7, Math.min(93, ctrlY + ny * arcMag * curveSign * 1.15));
    }
  }

  // Recebedor reage imediatamente ao passe: avança / ativa Dash para atacar a bola!
  const chaseDist = Math.hypot(leadX - receiver.x, leadY - receiver.y);
  receiver.targetX = leadX;
  receiver.targetY = leadY;
  if (isThroughBall || isOneTwoPass || chaseDist >= 4.0) {
    receiver.targetSprint = chaseDist >= 6.0 ? 1.62 : 1.46;
    receiver.receiveDashUntil = Math.max(receiver.receiveDashUntil || 0, (pitch.simTime || 0) + Math.min(1.05, Math.max(0.38, duration * 0.9)));
    const rxDx = leadX - receiver.x;
    const rxDy = leadY - receiver.y;
    const rxD = Math.hypot(rxDx, rxDy) || 1;
    const kickSpeed = receiver.maxSpeed * receiver.targetSprint * 0.88;
    receiver.vx = (rxDx / rxD) * kickSpeed;
    receiver.vy = (rxDy / rxD) * kickSpeed;
  } else {
    receiver.targetSprint = 1.28;
  }

  // Passe normal consome 2.2; reposição de goleiro 1.2; bola enfiada 3.5; tabela com arrancada 6.5 de stamina
  const passStaminaCost = isOneTwoPass ? 6.5 : isThroughBall ? 3.5 : isGkOutlet ? 1.2 : safeRestart ? 1.5 : 2.2;
  spendStamina(carrier, passStaminaCost);
  if (attIsUser) {
    if (isGkOutlet) {
      pitch.stats.userGkReleases = (pitch.stats.userGkReleases || 0) + 1;
      recordUserPlayerStat(pitch, carrier, "gkReleases", 1);
    } else {
      pitch.stats.userPassesTry++;
      recordUserPlayerStat(pitch, carrier, "passesTry", 1);
    }
  }

  // Se for jogada combinada / tabela (1-2), o passador dá um DASH nas costas do marcador!
  if (isOneTwoPass) {
    carrier.targetX = Math.max(8, Math.min(92, carrier.x + fwdDir * 18));
    carrier.targetY = Math.max(12, Math.min(88, carrier.y + (Math.random() < 0.5 ? 5 : -5)));
    carrier.vx += fwdDir * 28;
    carrier.targetSprint = 1.48;
    carrier.receiveDashUntil = Math.max(carrier.receiveDashUntil || 0, (pitch.simTime || 0) + 0.65);
    showNodeBadge(pitch, carrier.uid, "⚡ Tabela (Dash)!", "badge-dribble", 1500);
    prependNarrationLine(
      st,
      "nar-pass",
      `${st.minute}' [Tabela Rápida] ${carrier.player.name} tabelou de primeira com ${receiver.player.name} e arrancou em velocidade nas costas da marcação!`,
      { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side },
      { name: receiver.player.name, sprite: receiver.player.sprite, side: receiver.side },
      "BALL"
    );
  } else if (isThroughBall && !passOptions.isReturnOneTwo) {
    showNodeBadge(pitch, receiver.uid, "⚡ Dash no Espaço!", "badge-dribble", 1400);
    prependNarrationLine(
      st,
      "nar-pass",
      `${st.minute}' [Passe em Profundidade] ${carrier.player.name} enfiou a bola no espaço vazio! ${receiver.player.name} disparou em posição legal para buscar!`,
      { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side },
      { name: receiver.player.name, sprite: receiver.player.sprite, side: receiver.side },
      "BALL"
    );
  } else if (passOptions.isCross) {
    showNodeBadge(pitch, receiver.uid, "Cruzamento na Área!", "badge-pass", 1300);
    prependNarrationLine(
      st,
      "nar-pass",
      `${st.minute}' [Cruzamento] ${carrier.player.name} ergueu da ponta na medida para ${receiver.player.name} na área!`,
      { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side },
      { name: receiver.player.name, sprite: receiver.player.sprite, side: receiver.side },
      "BALL"
    );
  } else if (passOptions.isReturnOneTwo) {
    showNodeBadge(pitch, receiver.uid, "⚡ Dash p/ Receber!", "badge-dribble", 1400);
    prependNarrationLine(
      st,
      "nar-pass",
      `${st.minute}' [Tabela no Espaço] ${carrier.player.name} colocou a bola mais à frente no espaço vazio e ${receiver.player.name} correu para pegar!`,
      { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side },
      { name: receiver.player.name, sprite: receiver.player.sprite, side: receiver.side },
      "BALL"
    );
  } else if (chaseDist >= 7.5 && !isGkOutlet) {
    showNodeBadge(pitch, receiver.uid, "⚡ Avançou!", "badge-pass", 900);
  }

  const hasAnimeSpin = Boolean(betaAerial && isCurvedPass);
  const passSpinVel = betaAerial
    ? (hasAnimeSpin
        ? (curveSpinSign || 1) * (passOptions.isCross ? 980 : 860)
        : peakZ >= 0.90
        ? 260
        : peakZ > 0
        ? 210
        : isThroughBall
        ? 240
        : 160)
    : 0;
  const releaseToLooseAt =
    betaAerial && isThroughBall && !isOneTwoPass && !passOptions.isReturnOneTwo && !passOptions.isCross && dist >= 14
      ? Math.min(0.90, Math.max(0.76, 0.78 + ((carrier.effOvr || 75) - 70) * 0.0035))
      : null;
  pitch.ballSpinVel = passSpinVel;

  pitch.ballMode = "PASS_FLIGHT";
  pitch.carrierUid = null;
  pitch.challengerUid = null;
  pitch.holdBallPos = null;
  pitch.looseState = null;
  pitch.lastAction = passOptions.isCross ? "CROSS" : (isOneTwoPass || passOptions.isReturnOneTwo) ? "ONE_TWO" : isThroughBall ? "THROUGH_BALL" : "PASS";
  pitch.teamConsecutivePasses = (pitch.teamConsecutivePasses || 0) + 1;

  pitch.passState = {
    passerUid: carrier.uid,
    passerNode: carrier,
    receiverUid: receiver.uid,
    effRole,
    isGkOutlet,
    isSafeProtectedPass,
    isOneTwoPass,
    isThroughBall,
    isCross: Boolean(passOptions.isCross),
    passType,
    peakZ,
    hasAnimeSpin,
    spinVel: passSpinVel,
    releaseToLooseAt,
    wasOffsideAtPassTime,
    fromX,
    fromY,
    ctrlX,
    ctrlY,
    toX: leadX,
    toY: leadY,
    elapsed: 0,
    duration,
    progress: 0
  };

  const trailColor = passOptions.isCross
    ? "#fb923c"
    : (isOneTwoPass || passOptions.isReturnOneTwo)
    ? "#facc15"
    : isThroughBall
    ? (attIsUser ? "#38bdf8" : "#f472b6")
    : peakZ > 0
    ? (attIsUser ? "#60a5fa" : "#fb7185")
    : (attIsUser ? "#4ade80" : "#f87171");

  pitch.passTrail = {
    fromX,
    fromY,
    ctrlX: isCurvedPass ? ctrlX : null,
    ctrlY: isCurvedPass ? ctrlY : null,
    toX: leadX,
    toY: leadY,
    curX: fromX,
    curY: fromY,
    peakZ,
    progress: 0,
    frozenPathD: null,
    u: 0,
    isAerial: peakZ > 0,
    hasAnimeSpin,
    color: trailColor,
    start: performance.now(),
    flightDuration: Math.round(duration * 1000),
    fadeUntil: performance.now() + 750
  };

  const badgeTxt = isGkOutlet
    ? (passType === "GK_CLEAR" ? "TIRO LONGO" : "REPOSIÇÃO")
    : passOptions.isCross
    ? "CRUZAMENTO"
    : (isOneTwoPass || passOptions.isReturnOneTwo)
    ? "TABELA"
    : isThroughBall
    ? (peakZ > 0 ? "ENFIADA ALTA" : "NO ESPAÇO")
    : passType === "LOB"
    ? "LANÇAMENTO"
    : passType === "CHIP"
    ? "POR CIMA"
    : "PASSE";

  showPitchBadge(pitch, leadX, leadY, badgeTxt, "badge-pass", 750, isGkOutlet ? "GK" : "BALL");
  pitch.ticker = isGkOutlet
    ? `${st.minute}' Reposição: ${carrier.player.name} ➔ ${receiver.player.name}`
    : passOptions.isCross
    ? `${st.minute}' Cruzamento na área: ${carrier.player.name} ➔ ${receiver.player.name}!`
    : (isOneTwoPass || passOptions.isReturnOneTwo)
    ? `${st.minute}' Tabela no Espaço: ${carrier.player.name} ➔ ${receiver.player.name}!`
    : isThroughBall
    ? `${st.minute}' Bola Enfiada: ${carrier.player.name} ➔ espaço vazio para ${receiver.player.name}!`
    : `${st.minute}' Passe: ${carrier.player.name} ➔ ${receiver.player.name}`;
  if (typeof playSfx === "function") playSfx(peakZ > 0 ? "pass_aerial" : "pass");
  return true;
}

function projectPointOnSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq <= 0.0001) {
    return { x: ax, y: ay, t: 0, dist: Math.hypot(px - ax, py - ay) };
  }
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  const x = ax + t * dx;
  const y = ay + t * dy;
  return { x, y, t, dist: Math.hypot(px - x, py - y) };
}

function pointToSegmentDist(px, py, ax, ay, bx, by) {
  return projectPointOnSegment(px, py, ax, ay, bx, by).dist;
}

function pickShotGoalTarget(fromX, fromY, attIsUser) {
  const goalLineX = attIsUser ? 95.5 : 4.5;
  const goalX = attIsUser ? 97.2 : 2.8;
  const aimBias = (fromY - 50) * 0.14;
  const cornerSpread = (Math.random() - 0.5) * 9.0;
  let goalY = Math.max(41.5, Math.min(58.5, 50 + aimBias + cornerSpread));
  const dxTotal = goalX - fromX;
  if (Math.abs(dxTotal) > 0.5) {
    const tLine = (goalLineX - fromX) / dxTotal;
    if (tLine > 0 && tLine < 1) {
      const yAtLine = fromY + (goalY - fromY) * tLine;
      if (yAtLine < 40.0 || yAtLine > 60.0) {
        const clampedLineY = Math.max(40.5, Math.min(59.5, yAtLine));
        goalY = Math.max(39.0, Math.min(61.0, fromY + (clampedLineY - fromY) / tLine));
      }
    }
  }
  return { goalX, goalY };
}

function computeGkInterceptOnRay(fromX, fromY, goalX, goalY, attIsUser) {
  const dx = goalX - fromX;
  const dy = goalY - fromY;
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
    return { x: goalX, y: goalY, t: 0.5 };
  }
  const defaultGkX = attIsUser ? 92.0 : 8.0;
  const insideBox = attIsUser ? fromX >= defaultGkX - 1.2 : fromX <= defaultGkX + 1.2;
  let t = insideBox ? 0.42 : (defaultGkX - fromX) / dx;
  t = Math.max(0.18, Math.min(0.92, t));
  let ix = fromX + dx * t;
  let iy = fromY + dy * t;
  if (!insideBox && (iy < 36.5 || iy > 63.5)) {
    const nearGkX = attIsUser ? 94.2 : 5.8;
    if (attIsUser ? fromX < nearGkX - 0.6 : fromX > nearGkX + 0.6) {
      const nearT = Math.max(0.18, Math.min(0.92, (nearGkX - fromX) / dx));
      ix = fromX + dx * nearT;
      iy = fromY + dy * nearT;
      t = nearT;
    }
  }
  return { x: ix, y: iy, t };
}

function startNodeInterceptTween(pitch, node, toX, toY, durationMs, instant = false) {
  if (!pitch || !node) return;
  const minX = node.role === "GK" ? 4.5 : 8;
  const maxX = node.role === "GK" ? 95.5 : 92;
  const clampedX = Math.max(minX, Math.min(maxX, toX));
  const clampedY = Math.max(9, Math.min(91, toY));
  if (!Array.isArray(pitch.interceptTweens)) pitch.interceptTweens = [];
  pitch.interceptTweens = pitch.interceptTweens.filter((tw) => tw.node !== node);
  if (instant || durationMs <= 60) {
    node.x = clampedX;
    node.y = clampedY;
    node.vx = 0;
    node.vy = 0;
    return;
  }
  pitch.interceptTweens.push({
    node,
    fromX: node.x,
    fromY: node.y,
    toX: clampedX,
    toY: clampedY,
    start: performance.now(),
    duration: Math.max(80, durationMs)
  });
}

function pushNodeOffShotRay(pitch, node, rayDx, rayDy, pushDist = 3.0, durationMs = 260) {
  if (!pitch || !node) return;
  if (Array.isArray(pitch.interceptTweens)) {
    pitch.interceptTweens = pitch.interceptTweens.filter((tw) => tw.node !== node);
  }
  const len = Math.hypot(rayDx, rayDy) || 1;
  const dirX = rayDx / len;
  const dirY = rayDy / len;
  let perpX = -dirY;
  let perpY = dirX;
  const centerOutY = node.y >= 50 ? 1 : -1;
  if (perpY * centerOutY < 0 || (Math.abs(perpY) < 0.15 && node.y >= 50 && perpX < 0)) {
    perpX = -perpX;
    perpY = -perpY;
  }
  const pushDirX = perpX * 0.75 + dirX * 0.25;
  const pushDirY = perpY * 0.75 + dirY * 0.25;
  const norm = Math.hypot(pushDirX, pushDirY) || 1;
  const isGk = node.role === "GK";
  const minX = isGk ? 4.8 : 8;
  const maxX = isGk ? 95.2 : 92;
  const minY = isGk ? 35 : 10;
  const maxY = isGk ? 65 : 90;
  const toX = Math.max(minX, Math.min(maxX, node.x + (pushDirX / norm) * pushDist));
  const toY = Math.max(minY, Math.min(maxY, node.y + (pushDirY / norm) * pushDist));
  if (!Array.isArray(pitch.pushTweens)) pitch.pushTweens = [];
  pitch.pushTweens = pitch.pushTweens.filter((pt) => pt.node !== node);
  pitch.pushTweens.push({
    node,
    fromX: node.x,
    fromY: node.y,
    toX,
    toY,
    start: performance.now(),
    duration: durationMs
  });
}

function computeShotFlightMs(dist, isContinuation = false, instant = false) {
  if (instant) return isContinuation ? 50 : 65;
  if (isContinuation) {
    return Math.round(Math.max(200, Math.min(720, 80 + dist * 13.5)));
  }
  return Math.round(Math.max(250, Math.min(1050, 175 + dist * 13.5)));
}

function visualPitchDist(ax, ay, bx, by) {
  // Compensa proporção do campo expandido (largura vs altura visual) para colisões fiéis ao tamanho dos ícones
  return Math.hypot(ax - bx, (ay - by) * 0.52);
}

function selectShotBlockerEntry(pathEnemies) {
  if (!Array.isArray(pathEnemies) || pathEnemies.length === 0) return null;
  const laneBlockers = pathEnemies.filter((b) => {
    const role = b.node?.role;
    if (role === "DF") return b.distShooter <= 34 && b.distLine <= 8.5;
    if (role === "MF") return b.distShooter <= 30 && b.distLine <= 6.8;
    if (role === "FW") return b.distShooter <= 24 && b.distLine <= 4.5;
    return false;
  });
  if (laneBlockers.length === 0) return null;

  const scored = laneBlockers.map((entry) => {
    const blockPick = pickStaminaGatedMove(entry.node, "DF");
    return {
      entry,
      blockPick,
      hasDfTech: Boolean(blockPick.move),
      priorityScore:
        (entry.node.role === "DF" ? 0 : entry.node.role === "MF" ? 1.5 : 3.0) +
        entry.distLine +
        entry.proj.t * 4.0
    };
  });
  scored.sort((a, b) => a.priorityScore - b.priorityScore);

  const techBlockers = scored.filter((c) => c.hasDfTech);
  const bodyBlockers = scored.filter((c) => !c.hasDfTech);
  let primary = null;
  let triggerProb = 0;

  if (techBlockers.length > 0) {
    primary = techBlockers[0];
    const base = primary.entry.distLine <= 4.5 ? 0.74 : 0.56;
    const extra = techBlockers.length >= 2 ? 0.18 : laneBlockers.length >= 2 ? 0.10 : 0;
    triggerProb = Math.min(0.94, base + extra);
  } else if (bodyBlockers.length > 0) {
    primary = bodyBlockers[0];
    triggerProb =
      laneBlockers.length >= 2
        ? (primary.entry.distLine <= 3.5 ? 0.34 : 0.22)
        : (primary.entry.distLine <= 3.5 ? 0.20 : 0.11);
  }

  if (!primary || Math.random() >= triggerProb) return null;
  return {
    entry: primary.entry,
    blockPick: primary.blockPick,
    laneCount: laneBlockers.length,
    hasDfTech: primary.hasDfTech
  };
}

function triggerNodeJump(node, peak = 0.85, duration = 0.50) {
  if (!node || typeof isBetaMode !== "function" || !isBetaMode()) return;
  node.jumpPeak = Math.max(0.25, Math.min(1.15, Number(peak) || 0.85));
  node.jumpDuration = Math.max(0.22, Number(duration) || 0.50);
  node.jumpElapsed = 0;
  node.jumpZ = 0.08;
}

function launchContinuousShot(st, pitch, shooterNode, defNodes, attSupport, defSupport, ovrDiff, attNodesArg = null, opts = {}) {
  const origAttIsUser = shooterNode.side === "user";
  const origAttNodes = attNodesArg || (origAttIsUser ? pitch.userNodes : pitch.oppNodes);
  const origDefNodes = defNodes || (origAttIsUser ? pitch.oppNodes : pitch.userNodes);
  const effRole = getEffectiveCarrierRole(shooterNode);
  const shotOriginX =
    Number.isFinite(pitch.ballX) && Math.hypot(pitch.ballX - shooterNode.x, pitch.ballY - shooterNode.y) <= 4.5
      ? pitch.ballX
      : shooterNode.x;
  const shotOriginY =
    Number.isFinite(pitch.ballY) && Math.hypot(pitch.ballX - shooterNode.x, pitch.ballY - shooterNode.y) <= 4.5
      ? pitch.ballY
      : shooterNode.y;
  const origGoal = pickShotGoalTarget(shotOriginX, shotOriginY, origAttIsUser);
  const origGoalX = origGoal.goalX;
  const origGoalY = origGoal.goalY;
  const origTrailOrigin = { x: shotOriginX, y: shotOriginY };
  const origGkNode = origDefNodes.find((n) => n.role === "GK") || origDefNodes[0];

  const shotDist = Math.hypot(shotOriginX - origGoalX, shotOriginY - origGoalY);
  const isLongDist = effRole === "MF" || shotDist > 26;
  const shotInfo = buildShotInfoForNode(shooterNode, Boolean(opts.forceLongShot));
  const isLongShotPlay = Boolean(shotInfo.isLongShotMove && (isLongDist || opts.forceLongShot));
  const isCrossVolley = (shooterNode.crossVolleyTimer || 0) > 0;
  if (isCrossVolley) shooterNode.crossVolleyTimer = 0;
  const volleyBonus = isCrossVolley ? 1.1 : 0;
  const longMod = isLongShotPlay ? 0.3 : isLongDist ? -3.5 : 0;
  const closeFinishMod = !isLongDist && shotDist <= 18 && Math.abs(shotOriginY - 50) <= 18 ? 0.8 : 0;
  const acuteAnglePenalty = Math.abs(shotOriginY - 50) > 24 ? -1.1 : 0;

  const coopShot = shotInfo.isHissatsu
    ? evaluateCoopMoveSupport(shotInfo.label, "SH", shooterNode, origAttNodes, pitch, true)
    : { partners: [], bonusScore: 0, summaryTag: "" };

  // Vantagem elemental contra o goleiro (calculada diretamente para o chute contra o GK)
  const baseShotScore =
    calcNodeDuelScore(shooterNode, attSupport, origGkNode?.player?.element, "SH") +
    longMod +
    closeFinishMod +
    acuteAnglePenalty +
    volleyBonus +
    (shotInfo.duelBonus || 0) +
    (coopShot.bonusScore || 0);

  applyCoopStaminaCost(shooterNode, shotInfo.cost, coopShot.partners);
  pitch.ballZ = 0;
  pitch.ballVz = 0;

  const betaShotFx = typeof isBetaMode === "function" && isBetaMode();
  const isAerialMove =
    isCrossVolley ||
    (shotInfo.isHissatsu &&
      /Furacão|Fênix|Dragão|Pássaro|Estrela|Meteoro|Trovão|Aéreo|Celestial|Tempestade/i.test(shotInfo.label || ""));
  const hasCoopGather = Boolean(betaShotFx && shotInfo.isHissatsu && coopShot.partners.length >= 1 && !pitch.is5v5);
  const partnerTargets = [];
  if (hasCoopGather) {
    const partnerOffsets = [
      { dx: -2.4, dy: -3.4 },
      { dx: -2.4, dy: 3.4 }
    ];
    coopShot.partners.forEach((pt, idx) => {
      if (!pt?.node) return;
      const off = partnerOffsets[idx] || { dx: -2.8, dy: 0 };
      const tx = Math.max(6, Math.min(94, shotOriginX + (origAttIsUser ? off.dx : -off.dx)));
      const ty = Math.max(8, Math.min(92, shotOriginY + off.dy));
      partnerTargets.push({ node: pt.node, tx, ty });
    });
  } else if (betaShotFx && isAerialMove) {
    triggerNodeJump(shooterNode, 0.92, 0.56);
  }

  const shotAssistCandidate =
    pitch.lastAssistCandidate &&
    pitch.lastAssistCandidate.side === shooterNode.side &&
    pitch.lastAssistCandidate.receiverUid === shooterNode.uid &&
    pitch.lastAssistCandidate.passerUid !== shooterNode.uid
      ? pitch.lastAssistCandidate
      : null;
  if (
    typeof isBetaMode === "function" &&
    isBetaMode() &&
    shotAssistCandidate &&
    origAttIsUser &&
    !pitch.is5v5 &&
    typeof addPairAffinityPoints === "function"
  ) {
    const prePasser = findPitchNode(pitch, shotAssistCandidate.passerUid);
    if (prePasser?.player) {
      addPairAffinityPoints(prePasser.player, shooterNode.player, 5);
    }
  }
  pitch.lastAssistCandidate = null;
  pitch.lastPasserUid = null;
  pitch.lastAction = "SHOT";
  pitch.teamConsecutivePasses = 0;

  if (origAttIsUser) {
    pitch.stats.userShots++;
    recordUserPlayerStat(pitch, shooterNode, "shots", 1);
  } else {
    pitch.stats.oppShots++;
  }

  if (isLongShotPlay) {
    showNodeBadge(pitch, shooterNode.uid, `⚡ Chute Longo! • ${shotInfo.label}`, "badge-shot", 1300, "SH");
    prependNarrationLine(
      st,
      "nar-shot",
      `${st.minute}' [Chute Longo] ${shooterNode.player.name} arriscou de longe com 【${shotInfo.label}】!`,
      { name: shooterNode.player.name, sprite: shooterNode.player.sprite, side: shooterNode.side },
      null,
      "SH"
    );
  }

  const resolveAgainstGk = (
    activeShooter,
    activeShotLabel,
    activeIsHissatsu,
    effectiveShotScore,
    fromX,
    fromY,
    curAttIsUser,
    curGkNode,
    curDefSupport,
    curGoalX,
    curGoalY,
    weakenedByBlocker,
    specialContext = null,
    forceInstant = false,
    trailOrigin = null,
    isContinuation = false
  ) => {
    const gkPick = pickStaminaGatedMove(curGkNode, "GK");
    const gkMoveName =
      gkPick.move || (gkPick.exhausted ? "Defesa sem técnica (sem energia)" : "Defesa Direta");
    spendStamina(curGkNode, gkPick.cost);

    const gkStopScore = calcNodeDuelScore(curGkNode, curDefSupport, activeShooter?.player?.element, "GK") + gkPick.duelBonus;
    const goldenBias = st.isGoldenGoal5v5
      ? st.minute >= 30
        ? Math.min(14, 7.5 + (st.minute - 30) * 0.25)
        : st.minute >= 8
        ? Math.min(7.5, 1.5 + (st.minute - 7) * 0.7)
        : 1.5
      : 0;
    // Domínio proporcional na finalização: vantagem ajuda sem anular o goleiro rival
    const rawRelDiff = pitch.matchSupport?.relPwrDiff || 0;
    const attRelDiff = curAttIsUser ? rawRelDiff : -rawRelDiff;
    const dominanceShift = Math.max(-1.2, Math.min(1.2, attRelDiff * 4.5));
    const goalProb = st.isGoldenGoal5v5
      ? logisticWinProb(effectiveShotScore + goldenBias + dominanceShift * 0.6, gkStopScore, -3.2, 0.12, 0.78)
      : logisticWinProb(effectiveShotScore + dominanceShift, gkStopScore, -4.4, 0.08, 0.54);
    const isGoal = Math.random() < goalProb;

    const gkHit = computeGkInterceptOnRay(fromX, fromY, curGoalX, curGoalY, curAttIsUser);
    const duelX = gkHit.x;
    const duelY = gkHit.y;
    const shotGoalY = curGoalY;
    const tOriginX = trailOrigin ? trailOrigin.x : fromX;
    const tOriginY = trailOrigin ? trailOrigin.y : fromY;
    const instantMode = forceInstant || state.simSpeed !== 1;

    pitch.ballMode = "SHOT_FLIGHT";
    pitch.carrierUid = null;
    pitch.challengerUid = curGkNode.uid;
    pitch.holdBallPos = { x: duelX, y: duelY };
    pitch.lastClashMinute = st.minute;

    const flightDist = Math.hypot(duelX - fromX, duelY - fromY);
    const flightMs = computeShotFlightMs(flightDist, isContinuation, instantMode);
    const trailCol = specialContext?.isChain ? "#facc15" : specialContext?.isCounter ? "#38bdf8" : "#f97316";
    startBallFlight(pitch, fromX, fromY, duelX, duelY, flightMs, 0, "SHOT", trailCol, {
      trailOriginX: tOriginX,
      trailOriginY: tOriginY,
      linear: isContinuation,
      isSpecial: Boolean(activeIsHissatsu),
      elem: activeShooter?.player?.element || "Fogo"
    });
    startNodeInterceptTween(pitch, curGkNode, duelX, duelY, Math.round(flightMs * 0.88), instantMode);
    if (!weakenedByBlocker) {
      showPitchBadge(pitch, fromX, fromY, activeShotLabel, specialContext?.isChain ? "badge-goal" : "badge-shot", instantMode ? 600 : 1750, "SH");
    }
    pitch.ticker = `${st.minute}' CHUTE! ${activeShooter.player.name} (${activeShotLabel}) vs ${curGkNode.player.name}!`;
    syncLivePitchDOM(st);
    if (typeof playSfx === "function") {
      playSfx(activeIsHissatsu ? "hissatsu" : "shot", { elem: activeShooter?.player?.element });
    }

    const gSide = curAttIsUser ? "right" : "left";
    const concedingSide = curAttIsUser ? "opp" : "user";
    let impactApplied = false;

    const commitGoalOutcome = () => {
      if (impactApplied) return;
      impactApplied = true;
      if (typeof playSfx === "function") playSfx("goal");
      const userTeamUpper = (typeof getActiveTeamName === "function" ? getActiveTeamName() : "Dream Team").toUpperCase();

      const weakNote = weakenedByBlocker ? " (mesmo após desvio da zaga)" : "";
      const styleTag = specialContext?.isChain
        ? " [CHUTE EM CADEIA]"
        : specialContext?.isCounter
        ? " [CONTRA-CHUTE]"
        : isLongShotPlay && !specialContext?.isCounter
        ? " [CHUTE LONGO]"
        : "";
      const gkMoveDisplay = gkPick.move ? `【${gkMoveName}】` : gkMoveName.toLowerCase();

      if (curAttIsUser) {
        st.userScore++;
        recordUserPlayerStat(pitch, activeShooter, "goals", 1);
        const assistNode = specialContext?.chainInitiator
          ? specialContext.chainInitiator
          : !specialContext?.isCounter && shotAssistCandidate
          ? findPitchNode(pitch, shotAssistCandidate.passerUid)
          : null;
        if (assistNode && assistNode.uid !== activeShooter.uid && assistNode.side === "user") {
          recordUserPlayerStat(pitch, assistNode, "assists", 1);
          if (typeof isBetaMode === "function" && isBetaMode() && !pitch.is5v5 && typeof addPairAffinityPoints === "function") {
            addPairAffinityPoints(assistNode.player, activeShooter.player, 14, "assists");
          }
        }
        const assistTag =
          assistNode && assistNode.uid !== activeShooter.uid ? ` (assist. de ${assistNode.player.name})` : "";
        const goalObj = {
          minute: st.minute,
          name: activeShooter.player.name,
          sprite: activeShooter.player.sprite,
          shotLabel: `${activeShotLabel}${styleTag}`,
          isHissatsu: activeIsHissatsu,
          assistName: assistNode && assistNode.uid !== activeShooter.uid ? assistNode.player.name : null
        };
        st.goalsUser.push(goalObj);
        const scoreUserEl = document.getElementById("live-score-user");
        if (scoreUserEl) scoreUserEl.textContent = st.userScore;
        appendGoalItemDOM("user", goalObj);
        prependNarrationLine(
          st,
          "nar-goal-user",
          activeIsHissatsu
            ? `${st.minute}' GOOOL DO ${userTeamUpper}!${styleTag} ${activeShooter.player.name} disparou 【${activeShotLabel}】${assistTag}${weakNote} e furou ${gkMoveDisplay} de ${curGkNode.player.name}! (${st.userScore} x ${st.oppScore})`
            : `${st.minute}' GOOOL DO ${userTeamUpper}!${styleTag} ${activeShooter.player.name} superou ${curGkNode.player.name} com ${formatPtShotArticle(activeShotLabel)}${assistTag}${weakNote}! (${st.userScore} x ${st.oppScore})`,
          { name: activeShooter.player.name, sprite: activeShooter.player.sprite, side: "user" },
          { name: curGkNode.player.name, sprite: curGkNode.player.sprite, side: "opp" },
          "SH"
        );
      } else {
        st.oppScore++;
        const goalObj = {
          minute: st.minute,
          name: activeShooter.player.name,
          sprite: activeShooter.player.sprite,
          shotLabel: `${activeShotLabel}${styleTag}`,
          isHissatsu: activeIsHissatsu
        };
        st.goalsOpp.push(goalObj);
        const scoreOppEl = document.getElementById("live-score-opp");
        if (scoreOppEl) scoreOppEl.textContent = st.oppScore;
        appendGoalItemDOM("opp", goalObj);
        prependNarrationLine(
          st,
          "nar-goal-opp",
          activeIsHissatsu
            ? `${st.minute}' GOL DE ${st.oppTeam.name.toUpperCase()}!${styleTag} ${activeShooter.player.name} usou 【${activeShotLabel}】${weakNote} e venceu ${gkMoveDisplay} de ${curGkNode.player.name}! (${st.userScore} x ${st.oppScore})`
            : `${st.minute}' GOL DE ${st.oppTeam.name.toUpperCase()}!${styleTag} ${activeShooter.player.name} venceu ${curGkNode.player.name} com ${formatPtShotArticle(activeShotLabel)}${weakNote}! (${st.userScore} x ${st.oppScore})`,
          { name: activeShooter.player.name, sprite: activeShooter.player.sprite, side: "opp" },
          { name: curGkNode.player.name, sprite: curGkNode.player.sprite, side: "user" },
          "SH"
        );
      }
      pitch.ticker = `${st.minute}' GOOOL de ${activeShooter.player.name}! (${st.userScore} x ${st.oppScore})`;
    };

    const commitSaveOutcome = () => {
      if (impactApplied) return;
      impactApplied = true;
      if (typeof playSfx === "function") playSfx("save");

      if (!curAttIsUser) {
        pitch.stats.userSaves++;
        recordUserPlayerStat(pitch, curGkNode, "saves", 1);
      }
      pitch.ticker = `${st.minute}' ${curGkNode.player.name} defendeu o chute de ${activeShooter.player.name}!`;
      const gkAdvantageNote =
        curGkNode.player?.element &&
        activeShooter.player?.element &&
        ELEMENT_ADVANTAGE[curGkNode.player.element] === activeShooter.player.element
          ? " (Vantagem Elemental de Defesa)"
          : "";
      const shotDisplay = activeIsHissatsu ? `【${activeShotLabel}】` : activeShotLabel.toLowerCase();
      prependNarrationLine(
        st,
        "nar-save",
        gkPick.move
          ? `${st.minute}' [Defesa de Goleiro] ${curGkNode.player.name} acionou 【${gkMoveName}】${gkAdvantageNote} e espalmou ${weakenedByBlocker ? "o chute enfraquecido " : ""}${shotDisplay} de ${activeShooter.player.name}!`
          : `${st.minute}' [Defesa de Goleiro] ${curGkNode.player.name} defendeu sem técnica${gkAdvantageNote}${gkPick.exhausted ? " (energia vermelha)" : ""} e segurou ${weakenedByBlocker ? "o chute enfraquecido " : ""}${shotDisplay} de ${activeShooter.player.name}!`,
        { name: curGkNode.player.name, sprite: curGkNode.player.sprite, side: curGkNode.side },
        { name: activeShooter.player.name, sprite: activeShooter.player.sprite, side: activeShooter.side },
        "GK"
      );
    };

    const applyShotImpact = () => {
      const nowInstant = forceInstant || state.simSpeed !== 1;
      if (nowInstant) {
        pitch.interceptTweens = [];
        curGkNode.x = Math.max(4.5, Math.min(95.5, duelX));
        curGkNode.y = Math.max(9, Math.min(91, duelY));
        if (isGoal) {
          commitGoalOutcome();
          pitch.ballMode = "GOAL_NET";
          pitch.carrierUid = null;
          pitch.challengerUid = null;
          pitch.holdBallPos = { x: curGoalX, y: shotGoalY };
          startBallFlight(pitch, duelX, duelY, curGoalX, shotGoalY, 45, 0, "GOAL", "#facc15", {
            trailOriginX: tOriginX,
            trailOriginY: tOriginY,
            linear: true
          });
          pitch.goalFlashSide = gSide;
          pitch.goalFlashUntil = performance.now() + 2200;
          triggerStealShockwave(pitch, curGoalX, shotGoalY, null, null);
          triggerGoalLightningBurst(pitch, gSide, curGoalX, shotGoalY);
          showPitchBadge(pitch, curGoalX, shotGoalY, "GOOOL!!", "badge-goal", 1400, "SH");
          showNodeBadge(pitch, activeShooter.uid, `GOOOL! • ${activeShotLabel}`, "badge-goal", 1400, "SH");
        } else {
          commitSaveOutcome();
          pitch.ballSide = curAttIsUser ? "opp" : "user";
          pitch.ballMode = "CARRIED";
          pitch.carrierUid = curGkNode.uid;
          pitch.chaserUid = null;
          pitch.challengerUid = null;
          pitch.holdBallPos = null;
          curGkNode.carryTime = 0;
          curGkNode.decisionTimer = 0.35;
          curGkNode.duelCooldown = 1.8;
          if (activeShooter) {
            activeShooter.vx = (activeShooter.vx || 0) * 0.2;
            activeShooter.vy = (activeShooter.vy || 0) * 0.2;
          }
          pitch.ballFlight = null;
          pitch.ballX = curGkNode.x + (curGkNode.side === "user" ? 1.9 : -1.9);
          pitch.ballY = curGkNode.y + 1.0;
          pitch.ballZ = 0;
          pitch.ballVz = 0;
          pitch.passTrail = null;
          recomputePitchTargets(pitch);
          triggerSaveImplosion(pitch, duelX, duelY);
          showPitchBadge(pitch, curGkNode.x, curGkNode.y, gkMoveName, "badge-steal", 900, "GK");
          showNodeBadge(pitch, curGkNode.uid, `Defendeu • ${gkMoveName}`, "badge-steal", 900, "GK");
        }
      }
    };

    const onShotModalClosed = (skipRestart = false) => {
      const nowInstant = forceInstant || state.simSpeed !== 1;
      if (isGoal) {
        const doKickoffReset = () => {
          resetPitchForKickoff(pitch, concedingSide, true, true);
          const kickName = typeof getActiveTeamName === "function" ? getActiveTeamName() : "Dream Team";
          pitch.ticker = `${st.minute}' Saída no centro com ${concedingSide === "user" ? kickName : st.oppTeam.name}! Goleiros recuperam fôlego.`;
        };

        if (skipRestart || nowInstant) {
          pitch.interceptTweens = [];
          curGkNode.x = Math.max(4.5, Math.min(95.5, duelX));
          curGkNode.y = Math.max(9, Math.min(91, duelY));
          commitGoalOutcome();
          pitch.goalFlashSide = gSide;
          pitch.goalFlashUntil = performance.now() + (state.simSpeed === 4 ? 700 : 1400);
          triggerStealShockwave(pitch, curGoalX, shotGoalY, null, null);
          triggerGoalLightningBurst(pitch, gSide, curGoalX, shotGoalY);
          showPitchBadge(pitch, curGoalX, shotGoalY, "GOOOL!!", "badge-goal", 1100, "SH");
          showNodeBadge(pitch, activeShooter.uid, `GOOOL! • ${activeShotLabel}`, "badge-goal", 1100, "SH");
          if (st.isGoldenGoal5v5) return false;
          doKickoffReset();
          return false;
        }

        pitch.interceptTweens = [];
        curGkNode.x = Math.max(4.5, Math.min(95.5, duelX));
        curGkNode.y = Math.max(9, Math.min(91, duelY));
        // Animação de GOL no campo pós-resultado do duelo:
        // 1) Onda de choque atravessando o goleiro EXATAMENTE no ponto do impacto (duelX, duelY)
        triggerStealShockwave(pitch, duelX, duelY, null, curGkNode.uid);
        curGkNode.staggerTimer = 1.35;
        pushNodeOffShotRay(pitch, curGkNode, curGoalX - fromX, shotGoalY - fromY, 2.8, 280);
        showPitchBadge(pitch, duelX, duelY, "FURADA!", "badge-shot", 850, "SH");

        // 2) Bola atravessa de (duelX, duelY) em linha reta contínua até o fundo das redes (curGoalX, shotGoalY)
        const netDist = Math.hypot(curGoalX - duelX, shotGoalY - duelY);
        const netFlightMs = Math.round(Math.max(130, Math.min(230, netDist * 24)));
        pitch.ballMode = "GOAL_NET";
        pitch.carrierUid = null;
        pitch.challengerUid = null;
        pitch.holdBallPos = { x: curGoalX, y: shotGoalY };
        startBallFlight(pitch, duelX, duelY, curGoalX, shotGoalY, netFlightMs, 0, "GOAL", "#fde047", {
          trailOriginX: tOriginX,
          trailOriginY: tOriginY,
          linear: true,
          isSpecial: Boolean(activeIsHissatsu),
          elem: activeShooter?.player?.element || "Fogo"
        });
        syncLivePitchDOM(st);

        // 3) Entrada nas redes com onda de choque e raio fluído exatamente onde a bola entrou na rede (curGoalX, shotGoalY)
        let netResolved = false;
        const finishGoalNetEntry = (skipBeat = false) => {
          if (netResolved) return;
          netResolved = true;
          state.tournament.pendingNetFlightFinish = null;
          if (state.tournament.netFlightTimer) {
            clearTimeout(state.tournament.netFlightTimer);
            state.tournament.netFlightTimer = null;
          }
          commitGoalOutcome();
          pitch.goalFlashSide = gSide;
          pitch.goalFlashUntil = performance.now() + 2200;
          triggerStealShockwave(pitch, curGoalX, shotGoalY, null, null);
          triggerGoalLightningBurst(pitch, gSide, curGoalX, shotGoalY);
          showPitchBadge(pitch, curGoalX, shotGoalY, "GOOOL!!", "badge-goal", 1600, "SH");
          showNodeBadge(pitch, activeShooter.uid, `GOOOL! • ${activeShotLabel}`, "badge-goal", 1650, "SH");
          syncLivePitchDOM(st);

          if (skipBeat || state.simSpeed !== 1) {
            if (!st.isGoldenGoal5v5) doKickoffReset();
            syncLivePitchDOM(st);
            handleMinuteEndBoundaries(st, ovrDiff);
            return;
          }

          if (st.isGoldenGoal5v5) {
            pauseForPitchBeat(
              st,
              `<span class="callout-tag">GOL DE OURO!</span><strong>${activeShooter.player.name}</strong><span>5x5 Encerrado · ${activeShotLabel}</span>`,
              "callout-goal",
              1200,
              ovrDiff,
              null
            );
          } else {
            pauseForPitchBeat(
              st,
              `<span class="callout-tag">GOOOL!</span><strong>${activeShooter.player.name}</strong><span>${st.userScore} x ${st.oppScore} · ${activeShotLabel}</span>`,
              "callout-goal",
              1500,
              ovrDiff,
              doKickoffReset
            );
          }
        };

        state.tournament.pendingNetFlightFinish = finishGoalNetEntry;
        state.tournament.netFlightTimer = setTimeout(() => {
          finishGoalNetEntry(false);
        }, netFlightMs);

        return true;
      }

      // Cenário de DEFESA: transfere sempre a posse limpa para o goleiro (mesmo se mudou para 2x/4x durante o duelo!)
      pitch.interceptTweens = [];
      curGkNode.x = Math.max(4.5, Math.min(95.5, duelX));
      curGkNode.y = Math.max(9, Math.min(91, duelY));
      commitSaveOutcome();
      pitch.ballSide = curAttIsUser ? "opp" : "user";
      pitch.ballMode = "CARRIED";
      pitch.carrierUid = curGkNode.uid;
      pitch.chaserUid = null;
      pitch.challengerUid = null;
      pitch.holdBallPos = null;
      curGkNode.carryTime = 0;
      curGkNode.decisionTimer = 0.4;
      curGkNode.duelCooldown = 1.8;
      if (activeShooter) {
        activeShooter.vx = (activeShooter.vx || 0) * 0.2;
        activeShooter.vy = (activeShooter.vy || 0) * 0.2;
      }
      pitch.ballFlight = null;
      pitch.ballX = curGkNode.x + (curGkNode.side === "user" ? 1.9 : -1.9);
      pitch.ballY = curGkNode.y + 0.8;
      pitch.passTrail = null;
      recomputePitchTargets(pitch);

      triggerSaveImplosion(pitch, curGkNode.x, curGkNode.y);
      showPitchBadge(pitch, curGkNode.x, curGkNode.y, `DEFESA! • ${gkMoveName}`, "badge-steal", 1100, "GK");
      showNodeBadge(pitch, curGkNode.uid, `Defendeu • ${gkMoveName}`, "badge-steal", 1200, "GK");
      syncLivePitchDOM(st);

      if (skipRestart || nowInstant) {
        return false;
      }

      pauseForPitchBeat(st, "", "", 750, ovrDiff, null);
      return true;
    };

    const launchClashModal = (skipModal = false) => {
      state.tournament.shotFlightTimer = null;
      state.tournament.pendingShotFlightFinish = null;

      if (skipModal || forceInstant || state.simSpeed !== 1) {
        applyShotImpact();
        onShotModalClosed(true);
        syncLivePitchDOM(st);
        handleMinuteEndBoundaries(st, ovrDiff);
        return true;
      }

      const roleTag = specialContext?.isChain
        ? "CHUTE EM CADEIA!"
        : specialContext?.isCounter
        ? "CONTRA-CHUTE!"
        : isLongShotPlay
        ? "CHUTE LONGO"
        : weakenedByBlocker
        ? "CHUTE (-FORÇA)"
        : "CHUTE";

      const curTeamNodes = curAttIsUser ? pitch.userNodes : pitch.oppNodes;
      const shooterCoopInfo = activeIsHissatsu
        ? evaluateCoopMoveSupport(activeShotLabel, "SH", activeShooter, curTeamNodes, pitch, false)
        : { partners: [], summaryTag: "" };
      const shooterPartners = shooterCoopInfo.partners;

      playShotClashAndContinue(
        st,
        {
          kind: "SHOT",
          dir: curAttIsUser ? "ltr" : "rtl",
          userPlayer: curAttIsUser
            ? { name: activeShooter.player.name, sprite: resolveDynamicNodeSprite(activeShooter, pitch), roleText: roleTag, partners: shooterPartners, coopTag: shooterCoopInfo.summaryTag }
            : { name: curGkNode.player.name, sprite: resolveDynamicNodeSprite(curGkNode, pitch), roleText: "GOLEIRO" },
          oppPlayer: curAttIsUser
            ? { name: curGkNode.player.name, sprite: resolveDynamicNodeSprite(curGkNode, pitch), roleText: "GOLEIRO" }
            : { name: activeShooter.player.name, sprite: resolveDynamicNodeSprite(activeShooter, pitch), roleText: roleTag, partners: shooterPartners, coopTag: shooterCoopInfo.summaryTag },
          topMoveName: weakenedByBlocker ? `${activeShotLabel} (Enfraquecido)` : activeShotLabel,
          bottomMoveName: gkMoveName,
          bottomIcon: "GK",
          outcomePositive: isGoal ? curAttIsUser : !curAttIsUser,
          resultBannerText: isGoal ? "GOOOL!!" : "DEFENDEU!"
        },
        applyShotImpact,
        ovrDiff,
        onShotModalClosed
      );
      return true;
    };

    if (instantMode) {
      return launchClashModal();
    }

    // Em velocidade normal (1x): o chute viaja visivelmente pelo campo até o goleiro!
    // Apenas quando chega perto dele abre-se a cena/modal das técnicas e o resultado.
    if (state.tournament.timerId) {
      clearInterval(state.tournament.timerId);
      state.tournament.timerId = null;
    }
    state.tournament.pendingShotFlightFinish = launchClashModal;
    state.tournament.shotFlightTimer = setTimeout(() => {
      launchClashModal();
    }, Math.max(50, flightMs - 40));
    return true;
  };

  // Verifica possibilidade de CHAIN SHOT por um companheiro posicionado na linha do chute!
  const maybeChainAndResolveGk = (
    activeShooter,
    activeShotLabel,
    activeIsHissatsu,
    effectiveShotScore,
    fromX,
    fromY,
    curAttIsUser,
    curAttNodes,
    curGkNode,
    curDefSupport,
    curGoalX,
    curGoalY,
    weakenedByBlocker,
    specialContext = null,
    forceInstant = false,
    trailOrigin = null,
    isContinuation = false
  ) => {
    const gkElem = curGkNode?.player?.element;
    const shooterDisadv =
      activeShooter.player?.element && gkElem && ELEMENT_ADVANTAGE[gkElem] === activeShooter.player.element;

    const chainCandidates = (curAttNodes || [])
      .filter((n) => n.uid !== activeShooter.uid && n.role !== "GK" && (n.staggerTimer || 0) <= 0 && n.stamina >= 48)
      .map((n) => {
        const proj = projectPointOnSegment(n.x, n.y, fromX, fromY, curGoalX, curGoalY);
        const chainPick = getNodeChainShotMove(n);
        return { node: n, proj, chainPick };
      })
      .filter(
        (x) =>
          Boolean(x.chainPick) &&
          x.proj.dist <= 9.5 &&
          x.proj.t >= 0.12 &&
          x.proj.t <= 0.82 &&
          Math.hypot(x.proj.x - fromX, x.proj.y - fromY) >= 4.0 &&
          (curAttIsUser ? x.proj.x <= 87.5 : x.proj.x >= 12.5)
      )
      .sort((a, b) => a.proj.t - b.proj.t);

    if (chainCandidates.length > 0 && !specialContext?.isChain) {
      const chosen = chainCandidates[0];
      const chainNode = chosen.node;
      const cPick = chosen.chainPick;
      const chainX = chosen.proj.x;
      const chainY = chosen.proj.y;
      const cElem = chainNode.player?.element;
      const chainBetterVsGk =
        cElem &&
        gkElem &&
        (ELEMENT_ADVANTAGE[cElem] === gkElem || ELEMENT_ADVANTAGE[gkElem] !== cElem);

      const chainPairAff =
        curAttIsUser && !pitch.is5v5 && typeof getPairAffinityEntry === "function"
          ? getPairAffinityEntry(activeShooter.player, chainNode.player)
          : null;
      const chainAffLv = chainPairAff?.level || 0;

      let willProb = 0.40 + ([0, 0.08, 0.16, 0.24][chainAffLv] || 0);
      if (cPick.isCanonicalChain) willProb += 0.22;
      if (shooterDisadv && chainBetterVsGk) willProb += 0.22;
      if (isLongShotPlay) willProb += 0.16;
      if (chainNode.stamina < 62) willProb -= 0.16;
      if (curAttIsUser) {
        const intMode = getTactics().intensity;
        if (intMode === "low") willProb -= 0.35;
        else if (intMode === "high") willProb += 0.25;
      }

      if (Math.random() < Math.max(0.08, Math.min(0.92, willProb))) {
        // Chain Shot aceito! Cansa bastante o 2º jogador (+14 extra já incluído em cPick.cost) e aumenta muito a força
        spendStamina(chainNode, cPick.cost);
        const ovrBoost = Math.max(0, (chainNode.effOvr - 75) * 0.15);
        const affChainBoost = [0, 0.5, 1.1, 1.8][chainAffLv] || 0;
        const chainPowerBoost = 4.8 + ovrBoost + cPick.bonus + affChainBoost;
        if (typeof isBetaMode === "function" && isBetaMode() && curAttIsUser && !pitch.is5v5 && typeof addPairAffinityPoints === "function") {
          addPairAffinityPoints(activeShooter.player, chainNode.player, 12, "chains");
          pitch.synergyLinkFx = {
            fromUid: activeShooter.uid,
            toUids: [chainNode.uid],
            color: "#facc15",
            start: performance.now(),
            duration: 900
          };
        }
        const elemUpgrade = Math.max(
          0,
          getElementEdge(cElem, gkElem) - getElementEdge(activeShooter.player?.element, gkElem)
        ) * 0.8;
        const chainedScore = effectiveShotScore + chainPowerBoost + elemUpgrade;
        const combinedMove = `${activeShotLabel} ➔ ${cPick.move}`;
        const nextCtx = {
          ...(specialContext || {}),
          isChain: true,
          chainInitiator: activeShooter
        };

        const chainInstant = forceInstant || state.simSpeed !== 1;
        const tOriginX = trailOrigin ? trailOrigin.x : fromX;
        const tOriginY = trailOrigin ? trailOrigin.y : fromY;
        const chainOrigin = { x: tOriginX, y: tOriginY };

        pitch.ballMode = "SHOT_FLIGHT";
        pitch.carrierUid = null;
        pitch.challengerUid = chainNode.uid;
        pitch.holdBallPos = { x: chainX, y: chainY };

        const leg1Dist = Math.hypot(chainX - fromX, chainY - fromY);
        const leg1Ms = computeShotFlightMs(leg1Dist, isContinuation, chainInstant);
        startBallFlight(pitch, fromX, fromY, chainX, chainY, leg1Ms, 0, "SHOT", "#facc15", {
          trailOriginX: tOriginX,
          trailOriginY: tOriginY,
          linear: isContinuation
        });
        startNodeInterceptTween(pitch, chainNode, chainX, chainY, Math.round(leg1Ms * 0.86), chainInstant);
        showNodeBadge(pitch, chainNode.uid, `⚡ Chute em Cadeia! • ${cPick.move}`, "badge-chain", 1600, "SH");
        pitch.ticker = `${st.minute}' CHUTE EM CADEIA! ${activeShooter.player.name} encadeou com ${chainNode.player.name} (${cPick.move})!`;
        prependNarrationLine(
          st,
          "nar-shot",
          `${st.minute}' [Chute em Cadeia] ${activeShooter.player.name} (【${activeShotLabel}】) encadeou com ${chainNode.player.name} (【${cPick.move}】) — chute com força amplificada!`,
          { name: activeShooter.player.name, sprite: activeShooter.player.sprite, side: activeShooter.side },
          { name: chainNode.player.name, sprite: chainNode.player.sprite, side: chainNode.side },
          "SH"
        );
        syncLivePitchDOM(st);

        if (chainInstant) {
          return resolveAgainstGk(
            chainNode,
            combinedMove,
            true,
            chainedScore,
            chainX,
            chainY,
            curAttIsUser,
            curGkNode,
            curDefSupport,
            curGoalX,
            curGoalY,
            weakenedByBlocker,
            nextCtx,
            true,
            chainOrigin,
            true
          );
        }

        pauseForPitchBeat(st, "", "", leg1Ms, ovrDiff, (skipRestart) => {
          pitch.interceptTweens = [];
          chainNode.x = Math.max(8, Math.min(92, chainX));
          chainNode.y = Math.max(9, Math.min(91, chainY));
          resolveAgainstGk(
            chainNode,
            combinedMove,
            true,
            chainedScore,
            chainX,
            chainY,
            curAttIsUser,
            curGkNode,
            curDefSupport,
            curGoalX,
            curGoalY,
            weakenedByBlocker,
            nextCtx,
            Boolean(skipRestart || state.simSpeed !== 1),
            chainOrigin,
            true
          );
        });
        return true;
      }
    }

    return resolveAgainstGk(
      activeShooter,
      activeShotLabel,
      activeIsHissatsu,
      effectiveShotScore,
      fromX,
      fromY,
      curAttIsUser,
      curGkNode,
      curDefSupport,
      curGoalX,
      curGoalY,
      weakenedByBlocker,
      specialContext,
      forceInstant,
      trailOrigin,
      isContinuation
    );
  };

  const executeShotPhase = (forceGatherInstant = false) => {
  // Verifica interceptadores na linha do chute: 1) Counter Shot, 2) Bloqueio de zaga
  const pathEnemies = origDefNodes
    .filter((n) => n.role !== "GK" && (n.staggerTimer || 0) <= 0)
    .map((n) => {
      const proj = projectPointOnSegment(n.x, n.y, shotOriginX, shotOriginY, origGoalX, origGoalY);
      return {
        node: n,
        proj,
        distLine: proj.dist,
        distShooter: Math.hypot(proj.x - shotOriginX, proj.y - shotOriginY),
        distGoal: Math.hypot(proj.x - origGoalX, proj.y - origGoalY)
      };
    })
    .filter(
      (b) =>
        b.distLine <= 8.5 &&
        b.proj.t >= 0.04 &&
        b.proj.t <= 0.88 &&
        b.distShooter >= 1.8 &&
        (origAttIsUser ? b.proj.x <= 88.0 : b.proj.x >= 12.0)
    )
    .sort((a, b) => a.proj.t - b.proj.t);

  // 1) COUNTER SHOT (se algum jogador na trajetória tiver técnica de contra-chute)
  const counterCandEntry = pathEnemies
    .map((e) => ({ entry: e, cPick: getNodeCounterShotMove(e.node) }))
    .find((x) => x.cPick);

  const counterBaseProb = counterCandEntry ? (counterCandEntry.cPick.isShCounter ? 0.44 : 0.25) : 0;
  const userCounterLvl = !origAttIsUser ? (state.tournament?.prepBonuses?.counterShotLvl || 0) : 0;
  const counterTriggerProb = counterBaseProb + ([0, 0.12, 0.24, 0.35][userCounterLvl] || 0);

  if (counterCandEntry && Math.random() < Math.min(0.85, counterTriggerProb)) {
    const counterNode = counterCandEntry.entry.node;
    const cPick = counterCandEntry.cPick;
    spendStamina(counterNode, cPick.cost);

    const counterLvlBonus = [0, 1.0, 2.0, 3.2][userCounterLvl] || 0;
    const counterDuelScore =
      calcNodeDuelScore(counterNode, defSupport, shooterNode?.player?.element, cPick.isShCounter ? "SH" : "DF") + cPick.bonus + counterLvlBonus;
    const counterWinProb = logisticWinProb(counterDuelScore, baseShotScore, -0.3, 0.22, 0.78);
    const counterSuccess = Math.random() < counterWinProb;

    const duelX = counterCandEntry.entry.proj.x;
    const duelY = counterCandEntry.entry.proj.y;
    pitch.ballMode = "SHOT_FLIGHT";
    pitch.carrierUid = null;
    pitch.challengerUid = counterNode.uid;
    pitch.holdBallPos = { x: duelX, y: duelY };
    pitch.lastClashMinute = st.minute;

    const cFlightMs = computeShotFlightMs(Math.hypot(duelX - shotOriginX, duelY - shotOriginY), false, state.simSpeed !== 1);
    startBallFlight(pitch, shotOriginX, shotOriginY, duelX, duelY, cFlightMs, 0, "SHOT", "#38bdf8", {
      trailOriginX: shotOriginX,
      trailOriginY: shotOriginY,
      linear: false,
      isSpecial: Boolean(shotInfo.isHissatsu),
      elem: shooterNode.player?.element || "Fogo"
    });
    startNodeInterceptTween(pitch, counterNode, duelX, duelY, Math.round(cFlightMs * 0.88), state.simSpeed !== 1);
    showNodeBadge(pitch, counterNode.uid, `🔄 Contra-Chute!`, "badge-counter", 1400, cPick.isShCounter ? "SH" : "DF");
    pitch.ticker = `${st.minute}' CONTRA-CHUTE! ${counterNode.player.name} tenta rebater ${shotInfo.label} com ${cPick.move}!`;
    syncLivePitchDOM(st);

    const applyCounterImpact = () => {
      pitch.interceptTweens = [];
      counterNode.x = Math.max(8, Math.min(92, duelX));
      counterNode.y = Math.max(9, Math.min(91, duelY));
      if (counterSuccess) {
        counterNode.duelCooldown = 1.2;
        pitch.ballSide = origAttIsUser ? "opp" : "user";
        if (!origAttIsUser) {
          pitch.stats.userShots++;
          recordUserPlayerStat(pitch, counterNode, "shots", 1);
        } else {
          pitch.stats.oppShots++;
        }
        showNodeBadge(pitch, counterNode.uid, `CONTRA-CHUTE! • ${cPick.move}`, "badge-counter", 1600, "SH");
        pitch.ticker = `${st.minute}' CONTRA-CHUTE! ${counterNode.player.name} devolveu com 【${cPick.move}】!`;
        prependNarrationLine(
          st,
          "nar-shot",
          `${st.minute}' [Contra-Chute!] ${counterNode.player.name} rebateu 【${shotInfo.label}】 de ${shooterNode.player.name} de volta com 【${cPick.move}】!`,
          { name: counterNode.player.name, sprite: counterNode.player.sprite, side: counterNode.side },
          { name: shooterNode.player.name, sprite: shooterNode.player.sprite, side: shooterNode.side },
          "SH"
        );
      } else {
        counterNode.staggerTimer = 0.95;
        counterNode.duelCooldown = 1.35;
        pushNodeOffShotRay(pitch, counterNode, origGoalX - shotOriginX, origGoalY - shotOriginY, 3.0, 260);
        showPitchBadge(pitch, duelX, duelY, "Contra-chute falhou!", "badge-shot", 850, "SH");
        prependNarrationLine(
          st,
          "nar-shot",
          `${st.minute}' [Contra-Chute Superado] ${counterNode.player.name} tentou rebater com 【${cPick.move}】, mas 【${shotInfo.label}】 de ${shooterNode.player.name} furou!`,
          { name: shooterNode.player.name, sprite: shooterNode.player.sprite, side: shooterNode.side },
          { name: counterNode.player.name, sprite: counterNode.player.sprite, side: counterNode.side },
          "SH"
        );
      }
    };

    const onCounterModalClosed = (skipRestart = false) => {
      if (counterSuccess) {
        const retAttIsUser = !origAttIsUser;
        const retAttNodes = retAttIsUser ? pitch.userNodes : pitch.oppNodes;
        const retDefNodes = retAttIsUser ? pitch.oppNodes : pitch.userNodes;
        const retGkNode = retDefNodes.find((n) => n.role === "GK") || retDefNodes[0];
        const retGoal = pickShotGoalTarget(duelX, duelY, retAttIsUser);
        const returnScore = Math.max(baseShotScore, counterDuelScore) + 3.2;

        return maybeChainAndResolveGk(
          counterNode,
          cPick.move,
          true,
          returnScore,
          duelX,
          duelY,
          retAttIsUser,
          retAttNodes,
          retGkNode,
          attSupport,
          retGoal.goalX,
          retGoal.goalY,
          false,
          { isCounter: true },
          skipRestart,
          { x: duelX, y: duelY },
          false
        );
      }

      const weakenedScore = baseShotScore - 3.2;
      return maybeChainAndResolveGk(
        shooterNode,
        shotInfo.label,
        shotInfo.isHissatsu,
        weakenedScore,
        duelX,
        duelY,
        origAttIsUser,
        origAttNodes,
        origGkNode,
        defSupport,
        origGoalX,
        origGoalY,
        true,
        null,
        skipRestart,
        origTrailOrigin,
        true
      );
    };

    const launchCounterModal = (skipModal = false) => {
      state.tournament.shotFlightTimer = null;
      state.tournament.pendingShotFlightFinish = null;
      if (skipModal || state.simSpeed !== 1) {
        applyCounterImpact();
        const beatOwned = onCounterModalClosed(true);
        syncLivePitchDOM(st);
        if (!beatOwned) handleMinuteEndBoundaries(st, ovrDiff);
        return;
      }
      const origTeamNodes = origAttIsUser ? pitch.userNodes : pitch.oppNodes;
      const shooterCoopC = shotInfo.isHissatsu
        ? evaluateCoopMoveSupport(shotInfo.label, "SH", shooterNode, origTeamNodes, pitch, false)
        : { partners: [], summaryTag: "" };
      const shooterPartners = shooterCoopC.partners;
      playShotClashAndContinue(
        st,
        {
          kind: "SHOT",
          dir: origAttIsUser ? "ltr" : "rtl",
          userPlayer: origAttIsUser
            ? { name: shooterNode.player.name, sprite: resolveDynamicNodeSprite(shooterNode, pitch), roleText: "CHUTE", partners: shooterPartners, coopTag: shooterCoopC.summaryTag }
            : { name: counterNode.player.name, sprite: resolveDynamicNodeSprite(counterNode, pitch), roleText: "CONTRA-CHUTE" },
          oppPlayer: origAttIsUser
            ? { name: counterNode.player.name, sprite: resolveDynamicNodeSprite(counterNode, pitch), roleText: "CONTRA-CHUTE" }
            : { name: shooterNode.player.name, sprite: resolveDynamicNodeSprite(shooterNode, pitch), roleText: "CHUTE", partners: shooterPartners, coopTag: shooterCoopC.summaryTag },
          topMoveName: shotInfo.label,
          bottomMoveName: `Contra-Chute: ${cPick.move}`,
          bottomIcon: cPick.isShCounter ? "SH" : "DF",
          outcomePositive: counterSuccess ? !origAttIsUser : origAttIsUser,
          resultBannerText: counterSuccess ? "CONTRA-CHUTE!!" : "FUROU O CONTRA-CHUTE!"
        },
        applyCounterImpact,
        ovrDiff,
        onCounterModalClosed
      );
    };

    if (forceGatherInstant || state.simSpeed !== 1) {
      launchCounterModal(true);
      return;
    }
    if (state.tournament.timerId) {
      clearInterval(state.tournament.timerId);
      state.tournament.timerId = null;
    }
    state.tournament.pendingShotFlightFinish = launchCounterModal;
    state.tournament.shotFlightTimer = setTimeout(() => {
      launchCounterModal(false);
    }, Math.max(50, cFlightMs - 30));
    return;
  }

  // 2) BLOQUEIO DE CHUTE (prioriza jogadores com técnica de DF na linha do chute)
  const blockerChoice = selectShotBlockerEntry(pathEnemies);

  if (!blockerChoice) {
    maybeChainAndResolveGk(
      shooterNode,
      shotInfo.label,
      shotInfo.isHissatsu,
      baseShotScore,
      shotOriginX,
      shotOriginY,
      origAttIsUser,
      origAttNodes,
      origGkNode,
      defSupport,
      origGoalX,
      origGoalY,
      false,
      null,
      Boolean(forceGatherInstant),
      origTrailOrigin,
      false
    );
    return;
  }

  // Etapa 1: Jogador na linha do chute entra na frente e tenta bloquear!
  const blockerEntry = blockerChoice.entry;
  const blockerNode = blockerEntry.node;
  const blockPick = blockerChoice.blockPick;
  const blockMoveName =
    blockPick.move || (blockPick.exhausted ? "Bloqueio sem técnica (sem energia)" : "Bloqueio de Corpo");
  const blockRoleLabel = blockerNode.role === "DF" ? "ZAGA • BLOQUEIO" : "BLOQUEIO";
  const blockNarTag = blockerNode.role === "DF" ? "[Bloqueio da Zaga]" : "[Bloqueio]";
  const coopBlock = blockPick.move
    ? evaluateCoopMoveSupport(blockPick.move, "DF", blockerNode, origDefNodes, pitch, true)
    : { partners: [], bonusScore: 0, summaryTag: "" };
  applyCoopStaminaCost(blockerNode, blockPick.cost, coopBlock.partners);

  const wallSupportBonus = blockerChoice.laneCount >= 2 && blockerChoice.hasDfTech ? 1.2 : 0;
  const blockerStopScore =
    calcNodeDuelScore(blockerNode, defSupport, shooterNode?.player?.element, "DF") +
    blockPick.duelBonus +
    wallSupportBonus +
    (coopBlock.bonusScore || 0);
  const passBlockerProb = logisticWinProb(baseShotScore, blockerStopScore, -1.6, 0.38, 0.80);
  const passedBlocker = Math.random() < passBlockerProb;

  const duelX = blockerEntry.proj.x;
  const duelY = blockerEntry.proj.y;
  pitch.ballMode = "SHOT_FLIGHT";
  pitch.carrierUid = null;
  pitch.challengerUid = blockerNode.uid;
  pitch.holdBallPos = { x: duelX, y: duelY };
  pitch.lastClashMinute = st.minute;

  const blockFlightMs = computeShotFlightMs(Math.hypot(duelX - shotOriginX, duelY - shotOriginY), false, state.simSpeed !== 1);
  startBallFlight(pitch, shotOriginX, shotOriginY, duelX, duelY, blockFlightMs, 0, "SHOT", "#f97316", {
    trailOriginX: shotOriginX,
    trailOriginY: shotOriginY,
    linear: false,
    isSpecial: Boolean(shotInfo.isHissatsu),
    elem: shooterNode.player?.element || "Fogo"
  });
  startNodeInterceptTween(pitch, blockerNode, duelX, duelY, Math.round(blockFlightMs * 0.88), state.simSpeed !== 1);
  showPitchBadge(pitch, shotOriginX, shotOriginY, shotInfo.label, "badge-shot", state.simSpeed === 1 ? 1600 : 600, "SH");
  pitch.ticker = `${st.minute}' CHUTE! ${shooterNode.player.name} (${shotInfo.label}) enfrenta bloqueio de ${blockerNode.player.name}!`;
  syncLivePitchDOM(st);

  const applyBlockerImpact = () => {
    pitch.interceptTweens = [];
    blockerNode.x = Math.max(8, Math.min(92, duelX));
    blockerNode.y = Math.max(9, Math.min(91, duelY));
    if (!passedBlocker) {
      pitch.ballSide = origAttIsUser ? "opp" : "user";
      pitch.ballMode = "CARRIED";
      pitch.carrierUid = blockerNode.uid;
      pitch.challengerUid = null;
      pitch.holdBallPos = null;
      blockerNode.carryTime = 0;
      blockerNode.decisionTimer = 0.35;
      blockerNode.duelCooldown = 1.25;
      pitch.ballFlight = null;
      pitch.ballX = blockerNode.x + (blockerNode.side === "user" ? 1.9 : -1.9);
      pitch.ballY = blockerNode.y + 1.0;
      pitch.passTrail = null;
      if (state.simSpeed !== 1) triggerSaveImplosion(pitch, duelX, duelY);
      showPitchBadge(pitch, blockerNode.x, blockerNode.y, blockMoveName, "badge-steal", 1000, "DF");

      if (!origAttIsUser) {
        pitch.stats.userSteals++;
        pitch.stats.userBlocks = (pitch.stats.userBlocks || 0) + 1;
        triggerCatenaccioCounterIfActive(pitch);
        recordUserPlayerStat(pitch, blockerNode, "blocks", 1);
        recordUserPlayerStat(pitch, blockerNode, "steals", 1);
      } else {
        pitch.catenaccioCounterTimer = 0;
      }
      const blkDisplay = blockPick.move ? `【${blockMoveName}】` : blockMoveName.toLowerCase();
      const shotDisplayBlk = shotInfo.isHissatsu ? `【${shotInfo.label}】` : shotInfo.label.toLowerCase();
      pitch.ticker = `${st.minute}' ${blockerNode.player.name} bloqueou o chute de ${shooterNode.player.name}!`;
      prependNarrationLine(
        st,
        "nar-steal",
        `${st.minute}' ${blockNarTag} ${blockerNode.player.name} entrou na frente com ${blkDisplay} e bloqueou ${shotDisplayBlk} de ${shooterNode.player.name}!`,
        { name: blockerNode.player.name, sprite: blockerNode.player.sprite, side: blockerNode.side },
        { name: shooterNode.player.name, sprite: shooterNode.player.sprite, side: shooterNode.side },
        "DF"
      );
    } else {
      blockerNode.staggerTimer = 0.95;
      blockerNode.duelCooldown = 1.35;
      pushNodeOffShotRay(pitch, blockerNode, origGoalX - shotOriginX, origGoalY - shotOriginY, 3.0, 260);
      showPitchBadge(pitch, duelX, duelY, "Desviou (-Força)", "badge-shot", 850, "DF");
      const blkDisplay = blockPick.move ? `【${blockMoveName}】` : blockMoveName.toLowerCase();
      const shotDisplayBlk = shotInfo.isHissatsu ? `【${shotInfo.label}】` : shotInfo.label.toLowerCase();
      pitch.ticker = `${st.minute}' ${shooterNode.player.name} furou o bloqueio de ${blockerNode.player.name} — bola vai para o gol!`;
      prependNarrationLine(
        st,
        "nar-shot",
        `${st.minute}' [Bloqueio Parcial] ${blockerNode.player.name} tentou travar ${shotDisplayBlk} com ${blkDisplay} — o chute perdeu força, mas passou para ${origGkNode.player.name}!`,
        { name: shooterNode.player.name, sprite: shooterNode.player.sprite, side: shooterNode.side },
        { name: blockerNode.player.name, sprite: blockerNode.player.sprite, side: blockerNode.side },
        "DF"
      );
    }
  };

  const onBlockerModalClosed = (skipRestart = false) => {
    if (!passedBlocker) {
      if (state.simSpeed === 1) {
        triggerSaveImplosion(pitch, pitch.ballX, pitch.ballY);
      }
      showNodeBadge(pitch, blockerNode.uid, `Bloqueou • ${blockMoveName}`, "badge-steal", 1100, "DF");
      if (skipRestart || state.simSpeed !== 1) return false;
      pauseForPitchBeat(st, "", "", 780, ovrDiff, null);
      return true;
    }

    // Chute passou pelo defensor mantendo a mesma linha para o gol -> pode virar Chute em Cadeia ou ir direto ao goleiro!
    const weakenedScore = baseShotScore - 5.2;
    return maybeChainAndResolveGk(
      shooterNode,
      shotInfo.label,
      shotInfo.isHissatsu,
      weakenedScore,
      duelX,
      duelY,
      origAttIsUser,
      origAttNodes,
      origGkNode,
      defSupport,
      origGoalX,
      origGoalY,
      true,
      null,
      skipRestart,
      origTrailOrigin,
      true
    );
  };

  const launchBlockerModal = (skipModal = false) => {
    state.tournament.shotFlightTimer = null;
    state.tournament.pendingShotFlightFinish = null;
    if (skipModal || state.simSpeed !== 1) {
      applyBlockerImpact();
      const beatOwned = onBlockerModalClosed(true);
      syncLivePitchDOM(st);
      if (!beatOwned) handleMinuteEndBoundaries(st, ovrDiff);
      return;
    }
    const origTeamNodes = origAttIsUser ? pitch.userNodes : pitch.oppNodes;
    const shooterCoopB = shotInfo.isHissatsu
      ? evaluateCoopMoveSupport(shotInfo.label, "SH", shooterNode, origTeamNodes, pitch, false)
      : { partners: [], summaryTag: "" };
    const shooterPartners = shooterCoopB.partners;
    playShotClashAndContinue(
      st,
      {
        kind: "SHOT",
        dir: origAttIsUser ? "ltr" : "rtl",
        userPlayer: origAttIsUser
          ? { name: shooterNode.player.name, sprite: resolveDynamicNodeSprite(shooterNode, pitch), roleText: "CHUTE", partners: shooterPartners, coopTag: shooterCoopB.summaryTag }
          : { name: blockerNode.player.name, sprite: resolveDynamicNodeSprite(blockerNode, pitch), roleText: blockRoleLabel, partners: coopBlock.partners, coopTag: coopBlock.summaryTag },
        oppPlayer: origAttIsUser
          ? { name: blockerNode.player.name, sprite: resolveDynamicNodeSprite(blockerNode, pitch), roleText: blockRoleLabel, partners: coopBlock.partners, coopTag: coopBlock.summaryTag }
          : { name: shooterNode.player.name, sprite: resolveDynamicNodeSprite(shooterNode, pitch), roleText: "CHUTE", partners: shooterPartners, coopTag: shooterCoopB.summaryTag },
        topMoveName: shotInfo.label,
        bottomMoveName: blockMoveName,
        bottomIcon: "DF",
        outcomePositive: passedBlocker ? origAttIsUser : !origAttIsUser,
        resultBannerText: passedBlocker ? "PASSOU • PERDEU FORÇA!" : "CHUTE BLOQUEADO!"
      },
      applyBlockerImpact,
      ovrDiff,
      onBlockerModalClosed
    );
  };

  if (forceGatherInstant || state.simSpeed !== 1) {
    launchBlockerModal(true);
    return;
  }
  if (state.tournament.timerId) {
    clearInterval(state.tournament.timerId);
    state.tournament.timerId = null;
  }
  state.tournament.pendingShotFlightFinish = launchBlockerModal;
  state.tournament.shotFlightTimer = setTimeout(() => {
    launchBlockerModal(false);
  }, Math.max(50, blockFlightMs - 30));
  };

  if (hasCoopGather && state.simSpeed === 1) {
    const gatherMs = 540;
    pitch.ballMode = "HOLD";
    pitch.carrierUid = shooterNode.uid;
    pitch.challengerUid = null;
    pitch.ballX = shotOriginX;
    pitch.ballY = shotOriginY;
    pitch.holdBallPos = { x: shotOriginX, y: shotOriginY };
    pitch.ballFlight = null;
    pitch.passTrail = null;
    pitch.lastClashMinute = st.minute;

    partnerTargets.forEach((pt) => {
      startNodeInterceptTween(pitch, pt.node, pt.tx, pt.ty, 380, false);
    });
    const partnerNames = coopShot.partners.map((p) => p.node?.player?.name).filter(Boolean).join(" & ");
    pitch.coopFreeze = {
      start: performance.now(),
      duration: gatherMs,
      shooterUid: shooterNode.uid,
      partnerUids: coopShot.partners.map((p) => p.node?.uid).filter(Boolean),
      targetX: shotOriginX,
      targetY: shotOriginY,
      moveName: shotInfo.label,
      tier: coopShot.partners.length >= 2 ? "TRIO" : "DUPLA",
      elem: shooterNode.player?.element || "Fogo"
    };
    pitch.ticker = `${st.minute}' ⚡ ${shooterNode.player.name} & ${partnerNames} se juntam para 【${shotInfo.label}】!`;
    if (state.tournament.timerId) {
      clearInterval(state.tournament.timerId);
      state.tournament.timerId = null;
    }
    syncLivePitchDOM(st);
    if (!state.tournament.pitchRafId) startPitchRafLoop(st);

    let gatherFired = false;
    const finishCoopGather = (skipDelay = false) => {
      if (gatherFired) return;
      gatherFired = true;
      state.tournament.pendingShotFlightFinish = null;
      if (state.tournament.shotFlightTimer) {
        clearTimeout(state.tournament.shotFlightTimer);
        state.tournament.shotFlightTimer = null;
      }
      pitch.coopFreeze = null;
      if (st.finished) return;
      if (skipDelay) {
        pitch.interceptTweens = [];
        partnerTargets.forEach((pt) => {
          pt.node.x = pt.tx;
          pt.node.y = pt.ty;
        });
      }
      triggerNodeJump(shooterNode, 0.92, 0.56);
      partnerTargets.forEach((pt) => triggerNodeJump(pt.node, 0.92, 0.58));
      executeShotPhase(Boolean(skipDelay));
    };
    state.tournament.pendingShotFlightFinish = finishCoopGather;
    state.tournament.shotFlightTimer = setTimeout(() => {
      finishCoopGather(false);
    }, gatherMs);
    return;
  }

  if (hasCoopGather) {
    partnerTargets.forEach((pt) => {
      pt.node.x = pt.tx;
      pt.node.y = pt.ty;
    });
    triggerNodeJump(shooterNode, 0.92, 0.56);
    partnerTargets.forEach((pt) => triggerNodeJump(pt.node, 0.92, 0.58));
  }
  executeShotPhase(false);
}

function stepContinuousPhysics(st, pitch, dt) {
  if (!st || !pitch || st.finished || !st.running) return;
  ensureMatchSupport(st, pitch);
  const { userTeamSupport, oppTeamSupport, ovrDiff } = pitch.matchSupport;

  pitch.simTime += dt;
  pitch.minuteFloat += dt * 1.45;

  const allNodes = [...pitch.userNodes, ...pitch.oppNodes];
  const sideHasActiveKeshin = {
    user: (pitch.userNodes || []).some((x) => x.keshinState === "ACTIVE"),
    opp: (pitch.oppNodes || []).some((x) => x.keshinState === "ACTIVE")
  };
  allNodes.forEach((n) => {
    if (n.duelCooldown > 0) n.duelCooldown = Math.max(0, n.duelCooldown - dt);
    if (n.staggerTimer > 0) n.staggerTimer = Math.max(0, n.staggerTimer - dt);

    // KESHIN DINÂMICA: 1x por jogo, jogador decide quando invocar (nunca em esforço Baixo!), fica forte e depois cansa!
    if (n.keshinState === "ACTIVE") {
      n.keshinTimer = Math.max(0, (n.keshinTimer || 0) - dt);
      if (n.keshinTimer <= 0) {
        n.keshinState = "EXHAUSTED";
        n.stamina = Math.max(25, n.stamina - 18);
        showNodeBadge(pitch, n.uid, "Exausto (Pós-Keshin)", "badge-lost", 1500);
        prependNarrationLine(
          st,
          "nar-steal",
          `${st.minute}' [Fim da Incorporação] A aura de ${n.player.name} (${n.player.keshin?.name || "Keshin"}) se dissipou — o desgaste bateu forte!`,
          { name: n.player.name, sprite: n.player.sprite, side: n.side },
          null,
          "BALL"
        );
      }
    } else if (n.player?.keshin && !n.keshinUsed && n.stamina >= 38 && !pitch.justKickedOff && !sideHasActiveKeshin[n.side]) {
      const blockedByLowEffort = n.side === "user" && !pitch.is5v5 && getTactics().intensity === "low";
      if (!blockedByLowEffort) {
        const isCarrying = pitch.ballMode === "CARRIED" && pitch.carrierUid === n.uid;
        const inAttackHalf = n.side === "user" ? n.x >= 50 : n.x <= 50;
        const oppThreatening =
          pitch.ballSide !== n.side &&
          ((n.side === "user" && (pitch.ballX || 50) <= 38) || (n.side === "opp" && (pitch.ballX || 50) >= 62));
        const isTrailing = n.side === "user" ? (st.userScore || 0) < (st.oppScore || 0) : (st.oppScore || 0) < (st.userScore || 0);
        const allowEarly = (isCarrying && inAttackHalf) || isTrailing;
        const isBigMoment =
          (st.minute >= 10 || allowEarly) &&
          ((isCarrying && inAttackHalf) ||
            ((n.role === "GK" || n.role === "DF") && oppThreatening && st.minute >= 12) ||
            (st.minute >= 52 && Math.abs((st.userScore || 0) - (st.oppScore || 0)) <= 1));

        if (isBigMoment) {
          const prof = typeof getNodePersonality === "function" ? getNodePersonality(n) : { ego: 0.5, combativeness: 0.5 };
          const intBoost = n.side === "user" && !pitch.is5v5 && getTactics().intensity === "high" ? 1.45 : 1.0;
          const baseRate = isCarrying && inAttackHalf ? 0.42 : oppThreatening ? 0.22 : 0.06;
          const triggerChance = baseRate * (0.75 + (prof.ego + prof.combativeness) * 0.35) * intBoost * dt;
          if (Math.random() < triggerChance) {
            n.keshinUsed = true;
            n.keshinState = "ACTIVE";
            n.keshinTimer = 13.0; // ~18–20 minutos de jogo em aura flamejante!
            sideHasActiveKeshin[n.side] = true;
            const kName = n.player.keshin.name || "Espírito Guerreiro";
            showNodeBadge(pitch, n.uid, `🔥 ${kName}!`, "badge-keshin", 2000);
            pitch.ticker = `${st.minute}' 🔥 ${n.player.name} invocou 【${kName}】! Aura azul-violeta em chamas!`;
            prependNarrationLine(
              st,
              "nar-dribble",
              `${st.minute}' 🔥 [Incorporação!] ${n.player.name} despertou 【${kName}】! Envolto em chamas azul-violeta, seus atributos dispararam!`,
              { name: n.player.name, sprite: n.player.sprite, side: n.side },
              null,
              n.role === "GK" ? "GK" : n.role === "DF" ? "DF" : "SH"
            );
            syncLivePitchDOM(st);
          }
        }
      }
    }
  });

  // Timers da Tática Especial (Hissatsu Tactic)
  if ((pitch.hissatsuTacticTimer || 0) > 0) {
    pitch.hissatsuTacticTimer = Math.max(0, pitch.hissatsuTacticTimer - dt);
    if (pitch.hissatsuTacticTimer <= 0) {
      const endedTactic = HISSATSU_TACTICS_CATALOG?.[pitch.activeHissatsuTacticId];
      pitch.activeHissatsuTacticId = null;
      if (endedTactic) {
        pitch.ticker = `${st.minute}' Tática Especial 【${endedTactic.name}】 encerrada.`;
      }
      syncLivePitchDOM(st);
    }
  }
  if ((pitch.catenaccioCounterTimer || 0) > 0) {
    pitch.catenaccioCounterTimer = Math.max(0, pitch.catenaccioCounterTimer - dt);
  }

  // Decaimento de timers de aura, voleio e passe de sintonia
  allNodes.forEach((n) => {
    if ((n.captainPassBuffTimer || 0) > 0) n.captainPassBuffTimer = Math.max(0, n.captainPassBuffTimer - dt);
    if ((n.crossVolleyTimer || 0) > 0) n.crossVolleyTimer = Math.max(0, n.crossVolleyTimer - dt);
    if ((n.synergyPassBuffTimer || 0) > 0) n.synergyPassBuffTimer = Math.max(0, n.synergyPassBuffTimer - dt);
  });

  if (typeof isBetaMode === "function" && isBetaMode()) {
    allNodes.forEach((n) => {
      if ((n.jumpDuration || 0) > 0) {
        n.jumpElapsed = (n.jumpElapsed || 0) + dt;
        const jp = Math.min(1, n.jumpElapsed / n.jumpDuration);
        n.jumpZ = jp >= 1 ? 0 : Math.sin(jp * Math.PI) * (n.jumpPeak || 0.85);
        if (jp >= 1) {
          n.jumpElapsed = 0;
          n.jumpDuration = 0;
          n.jumpPeak = 0;
          n.jumpZ = 0;
        }
      }
    });
    if (pitch.coopFreeze) {
      const nowCf = performance.now();
      if (nowCf < pitch.coopFreeze.start + pitch.coopFreeze.duration) {
        // Freeze-frame cinematográfico: o resto do campo congela enquanto a Dupla/Trio converge!
        return;
      }
      pitch.coopFreeze = null;
    }
    pitch.ballSpinDeg = ((pitch.ballSpinDeg || 0) + (pitch.ballSpinVel || 0) * dt) % 360;
    if (pitch.ballMode === "CARRIED" && !pitch.ballFlight) {
      if ((pitch.ballZ || 0) > 0) {
        pitch.ballZ = Math.max(0, pitch.ballZ - dt * 2.15);
        pitch.ballVz = 0;
      }
      const cCarrier = findPitchNode(pitch, pitch.carrierUid);
      const cSpd = cCarrier ? Math.hypot(cCarrier.vx || 0, cCarrier.vy || 0) : 0;
      const dirSign = (cCarrier?.side || pitch.ballSide) === "user" ? 1 : -1;
      pitch.ballSpinVel = cSpd > 0.5 ? dirSign * Math.min(340, 110 + cSpd * 11) : (pitch.ballSpinVel || 0) * Math.exp(-5 * dt);
    }
  }

  // Avança minutos do relógio (com mini-acréscimo +1'..+3' se lance perigoso acontecer no limite!) e recupera energia fora da posse
  if ((pitch.stoppageTicks || 0) > 0 && pitch.stoppageBoundaryMin && !isPlayThreateningBoundary(st)) {
    // Ataque perigoso nos acréscimos encerrou: apita imediatamente sem resetar o contador!
    pitch.minuteFloat = Math.max(pitch.minuteFloat, pitch.stoppageBoundaryMin);
    pitch.stoppageTicks = 3;
  }
  const targetMin = Math.floor(pitch.minuteFloat);
  if (targetMin > st.minute) {
    while (st.minute < targetMin && !st.finished) {
      const nextMin = st.minute + 1;
      const isHoldBoundary =
        (nextMin === 45 && !st.halftimeHandled) ||
        (nextMin === 90 && st.maxMinute === 90) ||
        (nextMin === 105 && !st.etHalftimeHandled && st.maxMinute === 120) ||
        nextMin >= st.maxMinute;
      if (isHoldBoundary && isPlayThreateningBoundary(st) && (pitch.stoppageTicks || 0) < 3) {
        pitch.stoppageBoundaryMin = nextMin;
        pitch.stoppageTicks = (pitch.stoppageTicks || 0) + 1;
        pitch.minuteFloat = nextMin - 0.55;
        const clockEl = document.getElementById("live-clock-text");
        if (clockEl) clockEl.textContent = `${nextMin}+${pitch.stoppageTicks}'`;
        if (pitch.stoppageTicks === 1) {
          pitch.ticker = `${nextMin}+1' Acréscimo! O árbitro aguarda o desfecho do ataque!`;
          syncLivePitchDOM(st);
        }
        break;
      }
      pitch.stoppageTicks = 0;
      pitch.stoppageBoundaryMin = null;
      st.minute = nextMin;
      const clockEl = document.getElementById("live-clock-text");
      const barEl = document.getElementById("live-bar-fill");
      if (clockEl) clockEl.textContent = `${st.minute}'`;
      if (barEl) {
        const pct = Math.min(100, Math.round((st.minute / st.maxMinute) * 100));
        barEl.style.width = `${pct}%`;
      }
      const activeInt = getTactics().intensity;
      const capAuraType = getUserCaptainAuraType(pitch);
      allNodes.forEach((n) => {
        if (n.uid !== pitch.carrierUid) {
          const sideInt = n.side === "user" && !pitch.is5v5 ? activeInt : "medium";
          const capRegen = n.side === "user" && capAuraType === "COLLECTIVE" ? 0.14 : 0;
          const postKeshinPenalty = n.keshinState === "EXHAUSTED" ? 0.72 : 1.0;
          const regen =
            ((n.role === "GK"
              ? sideInt === "low" ? 0.95 : sideInt === "high" ? 0.55 : 0.75
              : sideInt === "low" ? 0.68 : sideInt === "high" ? 0.30 : 0.48) + capRegen) * postKeshinPenalty;
          n.stamina = Math.min(100, n.stamina + regen);
        }
      });
      if (!pitch.is5v5) {
        const tac = getTactics();
        const hasLateRes = Boolean(state.tournament?.prepBonuses?.lateMatchNoStaminaLoss && st.minute >= 75);
        const lateDrainMul = hasLateRes ? 0.5 : 1;
        const etDrainMul = st.minute > 90 ? 0.60 : 1;
        const perMinDrain = tac.intensity === "high" ? 0.62 : tac.intensity === "low" ? 0.22 : 0.38;
        const stamMul = state.tournament?.prepBonuses?.staminaMul || 1;
        const snackMul = state.tournament?.nextMatchEnergyMul || 1;
        adjustTeamEnergy(-(perMinDrain * stamMul * lateDrainMul * etDrainMul * snackMul));
        syncTeamEnergyBarDOM("live", st.minute);
      }
      if (pitch.ballSide === "user") pitch.stats.userTicks++;
      else pitch.stats.oppTicks++;

      syncLivePitchDOM(st);
      if (handleMinuteEndBoundaries(st, ovrDiff)) return;
    }
  }

  // Steering + integração suave de velocidade e separação entre colegas (ZERO teleporte!)
  recomputePitchTargets(pitch);
  const getEffectiveMatchSpeed = (n) => {
    const raw = n.spd || calcPlayerSpeedStat(n.player, n.effOvr);
    const stam = typeof n.stamina === "number" ? n.stamina : 100;
    const keshinBonusSpd = n.keshinState === "ACTIVE" ? 6 : 0;
    if (stam >= 70) return Math.min(125, raw + keshinBonusSpd);
    if (stam >= 45) return Math.min(125, Math.round(raw + keshinBonusSpd - 3 - ((70 - stam) / 25) * 3));
    return Math.max(45, Math.round(raw + keshinBonusSpd - 8 - ((45 - stam) / 40) * 7));
  };
  const steerNodes = (list) => {
    const activeHt = (pitch.hissatsuTacticTimer || 0) > 0 ? pitch.activeHissatsuTacticId : null;
    const capAuraType = getUserCaptainAuraType(pitch);
    const capNode =
      capAuraType === "PACE_LEADER" && !pitch.is5v5
        ? (() => {
            const cap = typeof getActiveTeamCaptain === "function" ? getActiveTeamCaptain() : null;
            return cap ? list.find((u) => u.side === "user" && u.player?.id === cap.player?.id) : null;
          })()
        : null;
    list.forEach((node) => {
      const dx = node.targetX - node.x;
      const dy = node.targetY - node.y;
      const dist = Math.hypot(dx, dy);
      const staminaFactor =
        node.stamina >= 70
          ? 1.0
          : node.stamina >= 45
          ? 0.96
          : Math.max(0.76, 0.90 - ((45 - node.stamina) / 40) * 0.14);
      const staggerFactor = node.staggerTimer > 0 ? 0.42 : 1.0;
      const keshinSpdFactor = node.keshinState === "ACTIVE" ? 1.12 : 1.0;
      let tacticSpdFactor = 1.0;
      if (node.side === "user" && activeHt) {
        if (activeHt === "route_of_sky" && pitch.ballSide === "user" && (node.role === "FW" || node.role === "MF")) {
          tacticSpdFactor = 1.12;
        } else if (activeHt === "lightning_press" && pitch.ballSide !== "user" && node.role !== "GK") {
          tacticSpdFactor = 1.16;
        }
      }
      if (node.side === "user" && capAuraType === "PACE_LEADER" && !pitch.is5v5) {
        const nearPaceCap = capNode && (capNode.uid === node.uid || visualPitchDist(capNode.x, capNode.y, node.x, node.y) <= 24);
        const hasPacePass = (node.captainPassBuffTimer || 0) > 0 && node.captainPassAuraType === "PACE_LEADER";
        if (nearPaceCap || hasPacePass) tacticSpdFactor *= 1.08;
      }
      const speedLimit = node.maxSpeed * (node.targetSprint || 0.9) * staminaFactor * staggerFactor * keshinSpdFactor * tacticSpdFactor;
      const arriveScale = dist < 3.0 ? dist / 3.0 : 1.0;

      let desVx = dist > 0.05 ? (dx / dist) * speedLimit * arriveScale : 0;
      let desVy = dist > 0.05 ? (dy / dist) * speedLimit * arriveScale : 0;

      // Separação suave entre companheiros para aproveitar o campo amplo sem amontoar
      if (node.role !== "GK") {
        list.forEach((other) => {
          if (other.uid === node.uid || other.role === "GK") return;
          const rx = node.x - other.x;
          const ry = node.y - other.y;
          const rDist = Math.hypot(rx, ry);
          if (rDist > 0.05 && rDist < 9.2) {
            const push = ((9.2 - rDist) / 9.2) * 13.5;
            desVx += (rx / rDist) * push;
            desVy += (ry / rDist) * push;
          }
        });
      }

      const accel = Math.min(1, dt * 8.2);
      node.vx += (desVx - node.vx) * accel;
      node.vy += (desVy - node.vy) * accel;
      node.x += node.vx * dt;
      node.y += node.vy * dt;

      const minX = node.role === "GK" ? 4 : 8;
      const maxX = node.role === "GK" ? 96 : 92;
      node.x = Math.max(minX, Math.min(maxX, node.x));
      node.y = Math.max(9, Math.min(91, node.y));
    });
  };
  steerNodes(pitch.userNodes);
  steerNodes(pitch.oppNodes);

  const attIsUser = pitch.ballSide === "user";
  const attNodes = attIsUser ? pitch.userNodes : pitch.oppNodes;
  const defNodes = attIsUser ? pitch.oppNodes : pitch.userNodes;
  const attSupport = attIsUser ? userTeamSupport : oppTeamSupport;
  const defSupport = attIsUser ? oppTeamSupport : userTeamSupport;

  // Watchdog anti-travamento: se a física rodar sem modal ativo e a bola ficar presa fora dos modos ativos (ou LOOSE_BALL expirada), devolve posse ao goleiro defensor
  const isStuckLoose = pitch.ballMode === "LOOSE_BALL" && (pitch.looseState?.age || 0) > 4.2;
  if ((pitch.ballMode !== "CARRIED" && pitch.ballMode !== "PASS_FLIGHT" && pitch.ballMode !== "LOOSE_BALL") || isStuckLoose) {
    pitch._stuckBallTime = (pitch._stuckBallTime || 0) + dt;
    if (pitch._stuckBallTime > 0.85 || isStuckLoose) {
      pitch._stuckBallTime = 0;
      const recoveryGk = defNodes.find((n) => n.role === "GK") || defNodes[0];
      if (recoveryGk) {
        pitch.ballSide = recoveryGk.side;
        pitch.ballMode = "CARRIED";
        pitch.carrierUid = recoveryGk.uid;
        pitch.challengerUid = null;
        pitch.holdBallPos = null;
        pitch.ballFlight = null;
        pitch.passState = null;
        pitch.looseState = null;
        recoveryGk.carryTime = 0;
        recoveryGk.decisionTimer = 0.35;
        pitch.ballX = recoveryGk.x + (recoveryGk.side === "user" ? 1.8 : -1.8);
        pitch.ballY = recoveryGk.y;
      }
    }
    return;
  }
  pitch._stuckBallTime = 0;

  // FASE A: BOLA NO PÉ DE UM PORTADOR EM MOVIMENTO CONTÍNUO
  if (pitch.ballMode === "CARRIED") {
    const carrier = findPitchNode(pitch, pitch.carrierUid) || attNodes[0];
    if (!carrier) return;

    carrier.carryTime += dt;
    carrier.decisionTimer -= dt;

    const weave = Math.sin(pitch.simTime * 8.5) * 0.42;
    const footX = carrier.x + (attIsUser ? 1.8 : -1.8);
    const footY = carrier.y + 0.9 + weave;
    // Domínio suave sem teleporte: puxa a bola naturalmente do ponto de contato até o pé de condução
    if (!pitch.ballFlight) {
      const betaSoft = typeof isBetaMode === "function" && isBetaMode();
      const settleRate = carrier.carryTime < 0.25 ? (betaSoft ? 10 : 14) : 28;
      const alpha = Math.min(1, dt * settleRate);
      pitch.ballX += (footX - pitch.ballX) * alpha;
      pitch.ballY += (footY - pitch.ballY) * alpha;
    }

    const oppGk = defNodes.find((d) => d.role === "GK");

    // 1) Checa saída/abafa do Goleiro na área ANTES do cooldown de drible: se o atacante colar, o GK rouba com a mão!
    if (carrier.role !== "GK" && !pitch.justKickedOff) {
      if (oppGk && oppGk.staggerTimer <= 0 && oppGk.duelCooldown <= 0 && carrier.carryTime >= 0.05) {
        const gkDist = visualPitchDist(oppGk.x, oppGk.y, carrier.x, carrier.y);
        const carrierInOppBox = attIsUser
          ? carrier.x >= 75 && Math.abs(carrier.y - 50) <= 28
          : carrier.x <= 25 && Math.abs(carrier.y - 50) <= 28;
        const gkOffLine = attIsUser ? oppGk.x < 91.5 : oppGk.x > 8.5;
        const gkRushRange = gkOffLine ? 5.6 : 4.6;
        if (carrierInOppBox && gkDist <= gkRushRange) {
          resolveGkRushClash(st, pitch, carrier, oppGk, attSupport, defSupport, ovrDiff);
          return;
        }
      }
    }

    // 2) Depois checa contato físico com marcadores de linha: Drible (OF) vs Desarme (DF) ou Tabela!
    if (carrier.role !== "GK" && !pitch.justKickedOff && carrier.duelCooldown <= 0) {
      let closestDef = null;
      let closestDist = 999;
      defNodes.forEach((d) => {
        if (d.role === "GK" || d.staggerTimer > 0 || d.duelCooldown > 0) return;
        const dist = visualPitchDist(d.x, d.y, carrier.x, carrier.y);
        if (dist < closestDist) {
          closestDist = dist;
          closestDef = d;
        }
      });

      // Quando o marcador se aproxima, avalia diferencial de velocidade (Arranque / Recuperação Veloz), Tabela ou Duelo
      if (closestDef && carrier.carryTime >= 0.16) {
        const carrierSpd = getEffectiveMatchSpeed(carrier);
        const defSpd = getEffectiveMatchSpeed(closestDef);
        const spdDiff = carrierSpd - defSpd;
        const oppGkDistNow = oppGk ? visualPitchDist(oppGk.x, oppGk.y, carrier.x, carrier.y) : 99;

        // 1. ⚡ Arranque Veloz com range variável por velocidade/fôlego/espaço (não teletransporta para dentro das mãos do GK!)
        if (carrier.stamina >= 45 && spdDiff >= 6 && closestDist <= 6.2 && closestDist > 3.65 && oppGkDistNow > 9.5) {
          const burstChance = Math.min(0.68, 0.35 + (spdDiff - 6) * 0.04);
          if (Math.random() < burstChance) {
            spendStamina(carrier, 2.5);
            carrier.duelCooldown = 0.95;
            closestDef.duelCooldown = 1.35;
            closestDef.staggerTimer = 0.55;
            const dir = attIsUser ? 1 : -1;
            const startX = carrier.x;
            const startY = carrier.y;
            const dodgeSign = startY >= closestDef.y ? 1 : -1;
            const stamMod = carrier.stamina >= 75 ? 2.1 : carrier.stamina >= 55 ? 0.8 : -0.6;
            const rawDashDist = Math.max(6.5, Math.min(14.5, 7.0 + Math.max(0, spdDiff - 4) * 0.42 + stamMod));
            const maxSafeDist = oppGk
              ? Math.max(0, (attIsUser ? oppGk.x - startX : startX - oppGk.x) - 6.8)
              : rawDashDist;
            const dashDist = Math.max(2.5, Math.min(rawDashDist, maxSafeDist));
            const safeMaxBurstX = attIsUser ? (oppGk ? Math.min(84.5, oppGk.x - 6.8) : 84.5) : 90;
            const safeMinBurstX = !attIsUser ? (oppGk ? Math.max(15.5, oppGk.x + 6.8) : 15.5) : 10;
            const dashToX = attIsUser
              ? Math.max(10, Math.min(Math.max(startX - 1.0, safeMaxBurstX), startX + dir * dashDist))
              : Math.min(90, Math.max(Math.min(startX + 1.0, safeMinBurstX), startX + dir * dashDist));
            const dashToY = Math.max(12, Math.min(88, startY + dodgeSign * 4.4));
            const baseMs = state.simSpeed === 4 ? 90 : state.simSpeed === 2 ? 180 : 360;
            const dashMs = Math.round(baseMs * Math.max(0.65, Math.min(1.25, dashDist / 11.0)));
            pitch.dashFx = {
              uid: carrier.uid,
              fromX: startX,
              fromY: startY,
              toX: dashToX,
              toY: dashToY,
              start: performance.now(),
              duration: dashMs
            };
            if (typeof playSfx === "function") playSfx("dribble");
            pitch.passTrail = {
              isDash: true,
              fromX: startX,
              fromY: startY,
              toX: dashToX,
              toY: dashToY,
              curX: startX,
              curY: startY,
              color: "#38bdf8",
              start: performance.now(),
              flightDuration: dashMs,
              fadeUntil: performance.now() + dashMs + 450
            };
            if (state.simSpeed !== 1) {
              carrier.x = dashToX;
              carrier.y = dashToY;
              pitch.ballX = dashToX + dir * 2.0;
              pitch.ballY = dashToY + 0.9;
            }
            carrier.vx = dir * carrier.maxSpeed * 1.15;
            carrier.vy = dodgeSign * 5.0;
            carrier.carryTime = 0.1;
            carrier.decisionTimer = 0.3;
            showNodeBadge(pitch, carrier.uid, `⚡ Arranque (+${spdDiff} VEL)`, "badge-dribble", 1500, "OF");
            pitch.ticker = `${st.minute}' Arranque Veloz: ${carrier.player.name} (VEL ${carrierSpd}) deixou ${closestDef.player.name} (VEL ${defSpd}) para trás!`;
            prependNarrationLine(
              st,
              "nar-dribble",
              `${st.minute}' ⚡ [Arranque Veloz] ${carrier.player.name} (VEL ${carrierSpd}) acelerou fundo e deixou ${closestDef.player.name} (VEL ${defSpd}) para trás na velocidade pura! (+${spdDiff} VEL)`,
              { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side },
              { name: closestDef.player.name, sprite: closestDef.player.sprite, side: closestDef.side },
              "OF"
            );
            if (attIsUser) {
              pitch.stats.userDribblesOk++;
              pitch.stats.userDribblesTry++;
              recordUserPlayerStat(pitch, carrier, "dribblesOk", 1);
              recordUserPlayerStat(pitch, carrier, "dribblesTry", 1);
            }
            syncLivePitchDOM(st);
            pauseForPitchBeat(st, "", "", 750, ovrDiff);
            return;
          }
        }

        // 2. ⚡ Recuperação Veloz: Marcador descansado com vantagem de velocidade (spdDiff <= -6) engole a distância na corrida
        if (closestDef.stamina >= 45 && spdDiff <= -6 && closestDist <= 5.4 && closestDist > 3.1) {
          const recoveryChance = Math.min(0.65, 0.32 + (Math.abs(spdDiff) - 6) * 0.04);
          if (Math.random() < recoveryChance) {
            spendStamina(closestDef, 2.5);
            closestDef.duelCooldown = 0.95;
            carrier.duelCooldown = 1.35;
            carrier.staggerTimer = 0.55;
            pitch.ballSide = closestDef.side;
            pitch.ballMode = "CARRIED";
            pitch.carrierUid = closestDef.uid;
            pitch.challengerUid = null;
            pitch.holdBallPos = null;
            pitch.passState = null;
            pitch.looseState = null;
            pitch.lastAssistCandidate = null;
            pitch.lastPasserUid = null;
            pitch.lastAction = "STEAL";
            pitch.teamConsecutivePasses = 0;
            closestDef.carryTime = 0.1;
            closestDef.decisionTimer = 0.32;
            const recFootX = closestDef.x + (closestDef.side === "user" ? 1.9 : -1.9);
            const recFootY = closestDef.y + 1.0;
            if (state.simSpeed === 1) {
              startBallFlight(pitch, pitch.ballX, pitch.ballY, recFootX, recFootY, 145, 0, "CONTROL", null);
            } else {
              pitch.ballX = recFootX;
              pitch.ballY = recFootY;
            }
            triggerStealShockwave(pitch, closestDef.x, closestDef.y, closestDef.uid, carrier.uid);
            if (typeof playSfx === "function") playSfx("steal");
            showNodeBadge(pitch, closestDef.uid, `⚡ Recuperação (+${Math.abs(spdDiff)} VEL)`, "badge-steal", 1500, "DF");
            showNodeBadge(pitch, carrier.uid, "Alcançado!", "badge-lost", 1500);
            pitch.ticker = `${st.minute}' Recuperação Veloz: ${closestDef.player.name} (VEL ${defSpd}) desarmou ${carrier.player.name} (VEL ${carrierSpd}) na corrida!`;
            prependNarrationLine(
              st,
              "nar-steal",
              `${st.minute}' ⚡ [Recuperação Veloz] ${closestDef.player.name} (VEL ${defSpd}) engoliu a distância na corrida e desarmou ${carrier.player.name} (VEL ${carrierSpd}) com velocidade pura! (+${Math.abs(spdDiff)} VEL)`,
              { name: closestDef.player.name, sprite: closestDef.player.sprite, side: closestDef.side },
              { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side },
              "DF"
            );
            if (closestDef.side === "user") {
              pitch.stats.userSteals++;
              triggerCatenaccioCounterIfActive(pitch);
              recordUserPlayerStat(pitch, closestDef, "steals", 1);
            } else {
              pitch.catenaccioCounterTimer = 0;
            }
            syncLivePitchDOM(st);
            pauseForPitchBeat(st, "", "", 750, ovrDiff);
            return;
          }
        }

        // 3) Quando o marcador se aproxima (entre 3.75 e 6.3 unidades visuais),
        // personalidade + Estilo + Capitão + Harmonia da Raimon decidem entre TABELAR (1-2) ou partir para o 1x1!
        if (closestDist <= 6.3 && closestDist > 3.75 && carrier.carryTime >= 0.30) {
          const cProf = typeof getNodePersonality === "function" ? getNodePersonality(carrier) : { archetype: "COLETIVISTA", ego: 0.5, vision: 0.5 };
          const oppGoalXCheck = attIsUser ? 96 : 4;
          const distGoalCheck = Math.hypot(carrier.x - oppGoalXCheck, carrier.y - 50);
          const defIsBehind = attIsUser ? closestDef.x < carrier.x - 1.5 : closestDef.x > carrier.x + 1.5;
          // Se está perto do gol com marcador atrás, não tabela para longe — parte pro chute!
          if (!(distGoalCheck <= 22 && defIsBehind)) {
            const passReceiver = pickPassReceiver(attNodes, defNodes, carrier, true, pitch);
            const hasTeammateNear = passReceiver && Math.hypot(passReceiver.x - carrier.x, passReceiver.y - carrier.y) <= 32;
            const baseTabela = carrier.effOvr >= 80 ? 0.34 : 0.22;
            const persMod =
              cProf.archetype === "COLETIVISTA"
                ? 0.16
                : cProf.archetype === "ESTRATEGISTA"
                ? 0.12
                : cProf.archetype === "INDIVIDUALISTA"
                ? -0.18
                : cProf.archetype === "VELOZ"
                ? -0.12
                : 0;
            const userStyleNow = attIsUser && !pitch.is5v5 ? getTactics().style : "free";
            const styleTabelaMod = userStyleNow === "possession" ? 0.10 : userStyleNow === "vertical" ? -0.05 : 0;
            const capAuraTabela = attIsUser && getUserCaptainAuraType(pitch) === "COLLECTIVE" ? 0.12 : 0;
            const harmonyTabela =
              attIsUser && !pitch.is5v5 && (pitch.hissatsuTacticTimer || 0) > 0 && pitch.activeHissatsuTacticId === "raimon_harmony"
                ? 0.20
                : 0;
            const tabelaChance = Math.max(0.06, Math.min(0.75, baseTabela + persMod + styleTabelaMod + capAuraTabela + harmonyTabela));
            if (hasTeammateNear && Math.random() < tabelaChance) {
              carrier.duelCooldown = 0.9;
              closestDef.duelCooldown = 0.9;
              launchContinuousPass(st, pitch, carrier, attNodes, defNodes, true, false, true);
              return;
            }
          }
        }

        if (closestDist <= 3.75) {
          resolvePhysicalDribbleClash(st, pitch, carrier, closestDef, attSupport, defSupport, ovrDiff);
          return;
        }
      }
    }

    // 2) Decisão tática contínua guiada por personalidade, Estilo, Postura, Camisa 10 e leitura do goleiro
    const oppGkNow = defNodes.find((d) => d.role === "GK");
    const distToOppGkNow = oppGkNow ? Math.hypot(oppGkNow.x - carrier.x, oppGkNow.y - carrier.y) : 99;
    const gkUrgentPressure =
      carrier.role !== "GK" &&
      !pitch.justKickedOff &&
      carrier.carryTime >= 0.16 &&
      oppGkNow &&
      ((oppGkNow.isGkRushing && distToOppGkNow <= 15.5) || distToOppGkNow <= 11.2);

    if (carrier.decisionTimer <= 0 || gkUrgentPressure) {
      const cProf = typeof getNodePersonality === "function"
        ? getNodePersonality(carrier)
        : { archetype: "COLETIVISTA", ego: 0.5, vision: 0.55, combativeness: 0.5, roaming: 0.5, shotInstinct: 0.6 };
      const tacNow = getTactics();
      const userStyle = attIsUser && !pitch.is5v5 ? tacNow.style : "free";
      const userPosture = attIsUser && !pitch.is5v5 ? tacNow.posture : "balanced";
      const aceId = attIsUser && !pitch.is5v5 ? tacNow.acePlayerId : null;
      const isCarrierAce = Boolean(aceId && carrier.player?.id === aceId);
      const capAura = attIsUser ? getUserCaptainAuraType(pitch) : null;
      const rawRelDiff = pitch.matchSupport?.relPwrDiff || 0;
      const sideRelDiff = attIsUser ? rawRelDiff : -rawRelDiff;
      const tempoFactor = sideRelDiff >= 0.14 ? 0.82 : sideRelDiff <= -0.14 ? 1.12 : 1.0;
      // Estrategistas, instintivos e estilo Vertical decidem mais rápido
      const mindSpeed = (cProf.archetype === "ESTRATEGISTA" ? 0.88 : cProf.archetype === "INDIVIDUALISTA" ? 0.92 : 1.0) * (userStyle === "vertical" ? 0.90 : 1.0);
      carrier.decisionTimer = (0.21 + Math.random() * 0.12) * tempoFactor * mindSpeed;

      if (pitch.justKickedOff) {
        pitch.justKickedOff = false;
        launchContinuousPass(st, pitch, carrier, attNodes, defNodes, false, true);
        return;
      }

      if (carrier.role === "GK") {
        if (carrier.carryTime >= 0.72) {
          launchContinuousPass(st, pitch, carrier, attNodes, defNodes, true, true);
        }
        return;
      }

      const oppGoalX = attIsUser ? 96 : 4;
      const goalDist = Math.hypot(carrier.x - oppGoalX, carrier.y - 50);
      const inPenaltyX = attIsUser ? carrier.x >= 76 : carrier.x <= 24;
      const centralLane = carrier.y >= 24 && carrier.y <= 76;
      const shootableAngle = Math.abs(carrier.y - 50) <= 32;
      const inFinalThird = attIsUser ? carrier.x >= 58 : carrier.x <= 42;

      const oppGk = oppGkNow;
      const oppGkElem = oppGk?.player?.element;
      const carrierElem = carrier.player?.element;
      const isCarrierDisadvVsGk = Boolean(carrierElem && oppGkElem && ELEMENT_ADVANTAGE[oppGkElem] === carrierElem);

      const oppOutfieldDefs = defNodes.filter((d) => d.role !== "GK");
      let nearestDefDist = 99;
      let blockingDefs = 0;
      let laneBlockers = 0;
      oppOutfieldDefs.forEach((d) => {
        const dd = visualPitchDist(d.x, d.y, carrier.x, carrier.y);
        if (dd < nearestDefDist) nearestDefDist = dd;
        const isAhead = attIsUser ? d.x >= carrier.x - 1 : d.x <= carrier.x + 1;
        if (isAhead && Math.abs(d.y - carrier.y) <= 13 && Math.abs(d.x - carrier.x) <= 16) blockingDefs++;
        // Checa se o defensor realmente está na linha de chute entre o portador e o gol!
        if (isAhead && pointToSegmentDist(d.x, d.y, carrier.x, carrier.y, oppGoalX, 50) <= 4.4) {
          laneBlockers++;
        }
      });

      const oppDefLineX = oppOutfieldDefs.length > 0
        ? (attIsUser ? Math.max(...oppOutfieldDefs.map((d) => d.x)) : Math.min(...oppOutfieldDefs.map((d) => d.x)))
        : (attIsUser ? 84 : 16);

      // Procura companheiro realmente livre em posição AINDA MELHOR de gol (prioriza o Camisa 10 quando livre!)
      const isLegalPassTarget = (n) => {
        if (pitch.is5v5) return true;
        return attIsUser
          ? (n.x <= 50 || n.x <= carrier.x + 0.6 || n.x <= oppDefLineX + 0.6)
          : (n.x >= 50 || n.x >= carrier.x - 0.6 || n.x >= oppDefLineX - 0.6);
      };

      const prioritizedAttNodes = aceId
        ? [...attNodes].sort((a, b) => (b.player?.id === aceId ? 1 : 0) - (a.player?.id === aceId ? 1 : 0))
        : attNodes;

      const betterShotTeammate = prioritizedAttNodes.find((n) => {
        if (n.uid === carrier.uid || n.role === "GK" || !isLegalPassTarget(n)) return false;
        const nGoalDist = Math.hypot(n.x - oppGoalX, n.y - 50);
        const nOpen = !oppOutfieldDefs.some((d) => visualPitchDist(d.x, d.y, n.x, n.y) < 6.8);
        const betterAngle = nGoalDist + 2.5 < goalDist && Math.abs(n.y - 50) <= 22;
        const sameOrAhead = attIsUser ? n.x >= carrier.x - 3 : n.x <= carrier.x + 3;
        return nOpen && betterAngle && sameOrAhead;
      });

      const betterElemTeammate = prioritizedAttNodes.find((n) => {
        if (n.uid === carrier.uid || n.role === "GK" || !isLegalPassTarget(n)) return false;
        const fwd = attIsUser ? n.x >= Math.max(58, carrier.x - 4) : n.x <= Math.min(42, carrier.x + 4);
        const el = n.player?.element;
        const open = !oppOutfieldDefs.some((d) => visualPitchDist(d.x, d.y, n.x, n.y) < 6.0);
        return fwd && open && el && oppGkElem && ELEMENT_ADVANTAGE[oppGkElem] !== el;
      });

      const roll = Math.random();
      const effShotInstinct = Math.min(0.98, cProf.shotInstinct + (isCarrierAce ? 0.08 : 0));

      // TESTE BETA: Desobediência tática por Respeito baixo ao técnico / Insatisfação individual ou Treta Aberta!
      if (attIsUser && !pitch.is5v5 && typeof isBetaMode === "function" && isBetaMode()) {
        if (!st.betaMatchStats) st.betaMatchStats = { disobediences: 0, feudSnubs: 0, honoredPromises: 0, brokenPromises: 0 };
        const respectInfo = typeof getCoachRespectInfo === "function" ? getCoachRespectInfo() : { value: 66, tier: "MID" };
        const pMood = typeof getPlayerRespectStatus === "function" ? getPlayerRespectStatus(carrier.player?.id) : { mood: "NEUTRAL" };
        if (
          betterShotTeammate &&
          typeof getBetaPairArc === "function" &&
          st.betaMatchStats.feudSnubs < 2
        ) {
          const pairArc = getBetaPairArc(carrier.player, betterShotTeammate.player);
          if (pairArc && pairArc.state === "TRETA_ABERTA" && Math.random() < 0.34 && goalDist <= 38) {
            st.betaMatchStats.feudSnubs += 1;
            if (typeof prependNarrationLine === "function") {
              prependNarrationLine(
                st,
                "nar-save",
                `${st.minute}' 💢 ${carrier.player.name} evitou tocar para ${betterShotTeammate.player.name} (treta no vestiário) e arriscou por conta própria!`,
                null,
                null,
                null
              );
            }
            launchContinuousShot(st, pitch, carrier, defNodes, attSupport, defSupport, ovrDiff, attNodes, { forceLongShot: goalDist > 26 });
            return;
          }
        }
        const isUnhappyOrLowRespect = respectInfo.tier === "LOW" || pMood.mood === "UNHAPPY";
        if (
          isUnhappyOrLowRespect &&
          st.betaMatchStats.disobediences < 3 &&
          carrier.carryTime >= 0.35 &&
          goalDist <= 40 &&
          (userStyle === "possession" || userPosture === "defensive" || betterShotTeammate)
        ) {
          const disobeyProb = respectInfo.value < 30 ? 0.24 : respectInfo.tier === "LOW" ? 0.16 : 0.14;
          if (Math.random() < disobeyProb) {
            st.betaMatchStats.disobediences += 1;
            const orderTxt = userStyle === "possession" ? "de posse" : userPosture === "defensive" ? "recuada" : "tática";
            if (typeof prependNarrationLine === "function") {
              prependNarrationLine(
                st,
                "nar-save",
                `${st.minute}' ⚠️ ${carrier.player.name} ignorou a ordem ${orderTxt} do técnico e tentou resolver sozinho!`,
                null,
                null,
                null
              );
            }
            launchContinuousShot(st, pitch, carrier, defNodes, attSupport, defSupport, ovrDiff, attNodes, { forceLongShot: goalDist > 25 });
            return;
          }
        }
      }

      // LONG SHOT: técnica de Chute Longo (mais frequente para Individualistas, Camisa 10 e estilo Vertical)
      const longMove = getNodeLongShotMove(carrier);
      const inLongZone = attIsUser ? (carrier.x >= 28 && carrier.x < 68) : (carrier.x <= 72 && carrier.x > 32);
      const longShotChance =
        (carrier.role === "FW" || carrier.role === "MF" ? 0.22 : 0.13) +
        (effShotInstinct - 0.5) * 0.14 +
        (userStyle === "vertical" ? 0.06 : 0);
      if (
        longMove &&
        inLongZone &&
        carrier.stamina >= 50 &&
        carrier.carryTime >= 0.42 &&
        nearestDefDist >= 4.2 &&
        !isCarrierDisadvVsGk &&
        roll < longShotChance
      ) {
        launchContinuousShot(st, pitch, carrier, defNodes, attSupport, defSupport, ovrDiff, attNodes, { forceLongShot: true });
        return;
      }

      // REAÇÃO À SAÍDA DO GOLEIRO: se o GK está saindo para abafar, decide AGORA (chuta antes do abafa ou rola pro tap-in!)
      if (gkUrgentPressure && shootableAngle) {
        if (
          betterShotTeammate &&
          (cProf.archetype === "COLETIVISTA" || cProf.archetype === "ESTRATEGISTA") &&
          Math.random() < (0.45 + cProf.vision * 0.35)
        ) {
          launchContinuousPass(st, pitch, carrier, attNodes, defNodes, true, false, false, {
            targetReceiver: betterShotTeammate
          });
          return;
        }
        launchContinuousShot(st, pitch, carrier, defNodes, attSupport, defSupport, ovrDiff, attNodes);
        return;
      }

      // INSTINTO DE FINALIZAÇÃO: livre pro gol CHUTA! Não recua a bola sem motivo!
      const postureShotMod = userPosture === "offensive" ? 0.10 : userPosture === "defensive" ? -0.10 : 0;
      const clearShotRange =
        (cProf.archetype === "INDIVIDUALISTA" ? 31.5 : effRoleOrPos(carrier) === "FW" ? 29.5 : 27.5) +
        (userStyle === "vertical" ? 2.5 : 0);
      const isClearOnGoal = laneBlockers === 0 && shootableAngle && goalDist <= clearShotRange;
      const clearBoxShot = inPenaltyX && centralLane && (laneBlockers === 0 || (laneBlockers === 1 && goalDist <= 22));
      const pointBlankShot = goalDist <= 19.5 && Math.abs(carrier.y - 50) <= 26;
      const openShotTrigger =
        isClearOnGoal &&
        (goalDist <= 23.5 ||
          roll <
            Math.min(
              0.96,
              0.56 +
                effShotInstinct * 0.34 +
                (sideRelDiff >= 0.14 ? 0.10 : 0) +
                (userStyle === "vertical" ? 0.14 : 0) +
                postureShotMod
            ));
      const contestedOpportunityShot =
        effRoleOrPos(carrier) === "FW" &&
        goalDist <= 27 &&
        laneBlockers <= 1 &&
        shootableAngle &&
        roll <
          Math.max(
            0.05,
            0.18 +
              cProf.ego * 0.24 +
              (userStyle === "vertical" ? 0.10 : userStyle === "possession" ? -0.08 : 0) +
              postureShotMod
          );

      const wantsToShoot = pointBlankShot || clearBoxShot || openShotTrigger || contestedOpportunityShot;

      if (wantsToShoot) {
        // Decisão PENSADA #1: Coletivista/Estrategista vê colega livre em tap-in melhor que o próprio chute
        if (
          betterShotTeammate &&
          goalDist > 12.5 &&
          cProf.archetype !== "INDIVIDUALISTA" &&
          Math.random() < (cProf.vision * 0.52 - cProf.ego * 0.22)
        ) {
          launchContinuousPass(st, pitch, carrier, attNodes, defNodes, true, false, false, {
            targetReceiver: betterShotTeammate
          });
          return;
        }
        // Decisão PENSADA #2: Desvantagem elemental contra o GK com colega livre melhor posicionado no ataque
        if (isCarrierDisadvVsGk && betterElemTeammate && goalDist > 14 && cProf.ego < 0.72 && roll < 0.42) {
          launchContinuousPass(st, pitch, carrier, attNodes, defNodes, true, false, false, {
            targetReceiver: betterElemTeammate
          });
          return;
        }
        // Decisão PENSADA #3: Realmente bloqueado na frente (muro) e colega livre para abrir o ângulo
        if (goalDist > 16.5 && laneBlockers >= 1 && blockingDefs >= 2 && betterShotTeammate && Math.random() < (0.30 + cProf.vision * 0.35)) {
          launchContinuousPass(st, pitch, carrier, attNodes, defNodes, true, false, false, {
            targetReceiver: betterShotTeammate
          });
          return;
        }
        launchContinuousShot(st, pitch, carrier, defNodes, attSupport, defSupport, ovrDiff, attNodes);
        return;
      }

      // VOLEIO / BOLA CRUZADA: se recebeu um cruzamento fresco na área, bate de primeira!
      if ((carrier.crossVolleyTimer || 0) > 0 && Math.abs(carrier.y - 50) <= 25 && goalDist <= 28) {
        launchContinuousShot(st, pitch, carrier, defNodes, attSupport, defSupport, ovrDiff, attNodes);
        return;
      }

      // CRUZAMENTO INTELIGENTE PELAS PONTAS: no terço final pela lateral, cruza com curva para quem ataca a área!
      const isWideFinalThird = (attIsUser ? carrier.x >= 69 : carrier.x <= 31) && Math.abs(carrier.y - 50) >= 24;
      if (isWideFinalThird && carrier.carryTime >= 0.25) {
        const boxTarget = prioritizedAttNodes.find((n) => {
          if (n.uid === carrier.uid || n.role === "GK" || !isLegalPassTarget(n)) return false;
          const inBox = (attIsUser ? n.x >= 72 : n.x <= 28) && Math.abs(n.y - 50) <= 19;
          return inBox;
        });
        if (boxTarget && Math.random() < (0.52 + cProf.vision * 0.26 - cProf.ego * 0.14)) {
          launchContinuousPass(st, pitch, carrier, attNodes, defNodes, true, false, false, {
            targetReceiver: boxTarget,
            isCross: true
          });
          return;
        }
      }

      // Se está livre rumo ao gol (sem marcadores na linha de chute), segue conduzindo para finalizar em vez de recuar!
      if (isClearOnGoal) {
        return;
      }

      // INVERSÃO DE JOGO: quando está cercado em um lado e há colega livre no flanco oposto, inverte a jogada!
      if (blockingDefs >= 2 && carrier.carryTime >= 0.45 && cProf.ego < 0.72) {
        const oppositeFlankTarget = prioritizedAttNodes.find((n) => {
          if (n.uid === carrier.uid || n.role === "GK" || !isLegalPassTarget(n)) return false;
          const isOppSide = carrier.y < 50 ? n.y > 54 : n.y < 46;
          const nOpen = !oppOutfieldDefs.some((d) => visualPitchDist(d.x, d.y, n.x, n.y) < 7.5);
          return isOppSide && nOpen;
        });
        if (oppositeFlankTarget && roll < 0.48 + cProf.vision * 0.24) {
          launchContinuousPass(st, pitch, carrier, attNodes, defNodes, false, false, false, {
            targetReceiver: oppositeFlankTarget
          });
          return;
        }
      }

      // Procura enfiada de bola / passe no espaço vazio (Estrategistas, Capitão Maestro, Estilo Vertical e Camisa 10!)
      const throughCandidate = prioritizedAttNodes.find((n) => {
        if (n.uid === carrier.uid || n.role === "GK" || !isLegalPassTarget(n)) return false;
        const fwdGain = attIsUser ? (n.x - carrier.x) : (carrier.x - n.x);
        const openGrass = attIsUser ? (oppDefLineX - n.x) : (n.x - oppDefLineX);
        return fwdGain >= 3 && openGrass >= 5;
      });

      const throughProb = Math.max(
        0.08,
        Math.min(
          0.82,
          0.22 +
            cProf.vision * 0.28 -
            cProf.ego * 0.12 +
            (userStyle === "vertical" ? 0.18 : userStyle === "possession" ? -0.08 : 0) +
            (capAura === "STRATEGIST" ? 0.14 : 0)
        )
      );
      if (throughCandidate && carrier.carryTime >= 0.38 && nearestDefDist >= 3.8 && roll < throughProb) {
        launchContinuousPass(st, pitch, carrier, attNodes, defNodes, true, false, false, {
          targetReceiver: throughCandidate,
          forceSpacePass: true
        });
        return;
      }

      // Passes de construção / reciclagem pensada (Individualistas/Velozes conduzem se tiverem campo aberto!)
      const fastCarrierSpace = (cProf.archetype === "VELOZ" || cProf.archetype === "INDIVIDUALISTA") && nearestDefDist >= 6.8;
      const tiredPass = carrier.stamina < 42 && roll < 0.58;
      const pressPass = nearestDefDist < 7.5 && roll < (0.36 + cProf.vision * 0.24 - cProf.ego * 0.18);
      // No terço final, só recicla para trás se estiver REALMENTE cercado (decisão pensada de Estrategista/Coletivista)
      const boxedInFinalThird = inFinalThird && laneBlockers >= 1 && blockingDefs >= 2 && carrier.carryTime >= 0.55;
      const crowdedRecycle = boxedInFinalThird && roll < (0.30 + cProf.vision * 0.32 - cProf.ego * 0.14);
      const baseHoldLimit = cProf.archetype === "INDIVIDUALISTA" ? 3.2 : cProf.archetype === "COLETIVISTA" ? 1.85 : 2.5;
      const holdLimit = userStyle === "possession" ? baseHoldLimit * 0.85 : baseHoldLimit;
      const flowPass =
        !inFinalThird &&
        !fastCarrierSpace &&
        carrier.carryTime >= (cProf.archetype === "COLETIVISTA" || userStyle === "possession" ? 0.68 : 1.05) &&
        roll <
          ((carrier.role === "DF" ? 0.64 : 0.34 + cProf.vision * 0.22 - cProf.ego * 0.18) +
            (userStyle === "possession" ? 0.14 : 0));
      const forceRecycle = carrier.carryTime >= holdLimit && (!inFinalThird || blockingDefs >= 1);

      if (
        typeof isBetaMode === "function" &&
        isBetaMode() &&
        carrier.role === "DF" &&
        nearestDefDist < 4.8 &&
        (attIsUser ? carrier.x < 35 : carrier.x > 65) &&
        roll < 0.72
      ) {
        launchContinuousPass(st, pitch, carrier, attNodes, defNodes, true, false, false, { forceClearance: true });
        return;
      }

      if (tiredPass || pressPass || crowdedRecycle || flowPass || forceRecycle) {
        // Se estiver cercado no terço final, permite passe pensado de reorganização; Vertical força progressão!
        const strictFwd = carrier.role === "DF" || userStyle === "vertical" || (inFinalThird && !boxedInFinalThird);
        launchContinuousPass(st, pitch, carrier, attNodes, defNodes, strictFwd, false);
        return;
      }
    }
    return;
  }

  const triggerOffsideRestart = (catcher) => {
    const foulX = Math.max(14, Math.min(86, catcher.x));
    const foulY = Math.max(16, Math.min(84, catcher.y));
    const nonGkDefs = defNodes.filter((d) => d.role !== "GK");
    const restartDef =
      nonGkDefs.length > 0
        ? nonGkDefs.slice().sort((a, b) => Math.hypot(a.x - foulX, a.y - foulY) - Math.hypot(b.x - foulX, b.y - foulY))[0]
        : defNodes[0];

    pitch.ballSide = attIsUser ? "opp" : "user";
    pitch.ballMode = "CARRIED";
    pitch.carrierUid = restartDef.uid;
    pitch.challengerUid = null;
    pitch.holdBallPos = null;
    pitch.ballFlight = null;
    pitch.passTrail = null;
    pitch.passState = null;
    pitch.looseState = null;
    pitch.lastAssistCandidate = null;
    pitch.lastPasserUid = null;
    pitch.teamConsecutivePasses = 0;
    pitch.justKickedOff = true;
    restartDef.carryTime = 0;
    restartDef.decisionTimer = 0.35;

    pitch.ballX = foulX;
    pitch.ballY = foulY;

    // Reestruturação tática animada: ambos os times se reorganizam em campo antes de bater o tiro livre indireto!
    const now = performance.now();
    const tweenDur = state.simSpeed === 1 ? 950 : 180;
    const defSideIsUser = restartDef.side === "user";
    const reorganizeMoves = [];
    pitch.pushTweens = [];

    [...pitch.userNodes, ...pitch.oppNodes].forEach((n) => {
      n.vx = 0;
      n.vy = 0;
      n.duelCooldown = 0.9;
      n.staggerTimer = 0;
      n.receiveDashUntil = 0;
      let toX = n.x;
      let toY = n.y;

      if (n.uid === restartDef.uid) {
        toX = foulX;
        toY = foulY;
      } else if (n.role === "GK") {
        toX = n.baseX;
        toY = 50;
      } else if (n.side === restartDef.side) {
        toX = defSideIsUser
          ? Math.min(80, Math.max(14, n.baseX + 5))
          : Math.max(20, Math.min(86, n.baseX - 5));
        toY = n.baseY;
      } else {
        // Time infrator recompõe inteiro para o seu campo / atrás da linha da bola
        toX = defSideIsUser
          ? Math.max(Math.min(88, foulX + 8), Math.min(88, n.baseX + 4))
          : Math.min(Math.max(12, foulX - 8), Math.max(12, n.baseX - 4));
        toY = n.baseY;
      }

      reorganizeMoves.push({ node: n, toX, toY });
      if (state.simSpeed === 1) {
        pitch.pushTweens.push({
          node: n,
          fromX: n.x,
          fromY: n.y,
          toX,
          toY,
          start: now,
          duration: tweenDur
        });
      } else {
        n.x = toX;
        n.y = toY;
        n.targetX = toX;
        n.targetY = toY;
      }
    });

    const applyReorganizedCoords = () => {
      reorganizeMoves.forEach(({ node, toX, toY }) => {
        node.x = toX;
        node.y = toY;
        node.targetX = toX;
        node.targetY = toY;
        node.vx = 0;
        node.vy = 0;
      });
      pitch.ballX = foulX + (defSideIsUser ? 1.6 : -1.6);
      pitch.ballY = foulY;
    };

    showNodeBadge(pitch, catcher.uid, "🚩 Impedimento!", "badge-lost", 1700);
    showPitchBadge(pitch, foulX, foulY, "IMPEDIMENTO", "badge-lost", 1350);
    prependNarrationLine(
      st,
      "nar-steal",
      `${st.minute}' [Impedimento] O árbitro paralisa o lance! ${catcher.player.name} estava adiantado. Os times se reestruturam antes da cobrança.`,
      { name: catcher.player.name, sprite: catcher.player.sprite, side: catcher.side },
      { name: restartDef.player.name, sprite: restartDef.player.sprite, side: restartDef.side },
      "BALL"
    );
    pitch.ticker = `${st.minute}' 🚩 Impedimento contra ${catcher.player.name}! Times se reestruturando para a cobrança...`;
    syncLivePitchDOM(st);
    pauseForPitchBeat(st, "", "", 1250, ovrDiff, applyReorganizedCoords);
  };

  const completeAttackingPassCatch = (playMeta, catcher) => {
    if (playMeta.wasOffsideAtPassTime && !pitch.is5v5 && catcher.uid === playMeta.receiverUid) {
      triggerOffsideRestart(catcher);
      return;
    }

    if (attIsUser && !playMeta.isGkOutlet) {
      pitch.stats.userPassesOk++;
      if (playMeta.passerNode) recordUserPlayerStat(pitch, playMeta.passerNode, "passesOk", 1);
    }
    if (!playMeta.isGkOutlet) {
      const teamList = attIsUser ? pitch.userNodes : pitch.oppNodes;
      (teamList || []).forEach((n) => {
        if (n.uid === catcher.uid) {
          n.stamina = Math.min(100, n.stamina + 1.0);
        } else {
          n.stamina = Math.min(100, n.stamina + 0.25);
        }
      });
    }
    const isBetaCatch = typeof isBetaMode === "function" && isBetaMode();
    pitch.lastAssistCandidate = playMeta.isGkOutlet
      ? null
      : { passerUid: playMeta.passerUid, receiverUid: catcher.uid, side: catcher.side };
    pitch.lastPasserUid = playMeta.passerUid;
    pitch.ballMode = "CARRIED";
    pitch.carrierUid = catcher.uid;
    pitch.passState = null;
    pitch.looseState = null;
    pitch.ballZ = isBetaCatch ? Math.min(0.28, (Number(pitch.ballZ) || 0) * 0.55) : 0;
    pitch.ballVz = 0;
    if (isBetaCatch) {
      pitch.ballSpinVel = (pitch.ballSpinVel || 0) * 0.45;
    }
    if (pitch.passTrail && !pitch.passTrail.isDash) {
      const doneP = Math.max(0.05, Math.min(1, Number(playMeta.progress) || 1));
      pitch.passTrail.progress = doneP;
      pitch.passTrail.u = easePassProgress(doneP);
      pitch.passTrail.curX = pitch.ballX;
      pitch.passTrail.curY = pitch.ballY;
      pitch.passTrail.fadeUntil = Math.min(pitch.passTrail.fadeUntil || (performance.now() + 280), performance.now() + 280);
      pitch.passTrail.frozenPathD = null;
    }
    if (attIsUser && !pitch.is5v5 && playMeta.passerNode) {
      if (
        isBetaCatch &&
        catcher.uid !== playMeta.passerUid &&
        typeof addPairAffinityPoints === "function"
      ) {
        const isOneTwo = Boolean(playMeta.isReturnOneTwo || playMeta.isOneTwoPass);
        const pts = playMeta.isReturnOneTwo ? 8 : playMeta.isOneTwoPass ? 5 : !playMeta.isGkOutlet ? 2 : 0;
        const tblRes = pts > 0 ? addPairAffinityPoints(playMeta.passerNode.player, catcher.player, pts, playMeta.isReturnOneTwo ? "tables" : null) : null;
        const pairLv = tblRes?.entry?.level ?? (typeof getPairAffinityEntry === "function" ? getPairAffinityEntry(playMeta.passerNode.player, catcher.player)?.level || 0 : 0);
        if (pairLv >= 1) {
          catcher.synergyPassBuffTimer = 2.4;
          catcher.synergyPassBuffBonus = [0, 0.65, 1.15, 1.70][pairLv] || 0.65;
        }
        if (tblRes && ((pairLv >= 2 && !playMeta.isGkOutlet) || isOneTwo)) {
          pitch.synergyLinkFx = {
            fromUid: playMeta.passerNode.uid,
            toUids: [catcher.uid],
            color: "#38bdf8",
            start: performance.now(),
            duration: 680
          };
        }
      }
      const capObj = typeof getActiveTeamCaptain === "function" ? getActiveTeamCaptain() : null;
      if (capObj && capObj.player?.id && playMeta.passerNode.player?.id === capObj.player.id && catcher.uid !== playMeta.passerUid) {
        const capTacRole = capObj.player.id === getTactics().acePlayerId ? "CAMISA_10" : "NONE";
        const capAuraInfo = typeof getCaptainAuraInfo === "function" ? getCaptainAuraInfo(capObj.player, capObj.role, capTacRole) : null;
        catcher.captainPassBuffTimer = 2.8;
        catcher.captainPassAuraType = capAuraInfo?.type || "COLLECTIVE";
        showNodeBadge(pitch, catcher.uid, `★ Passe do Cap (${capAuraInfo?.archetypeLabel || "Aura"})!`, "badge-pass", 1200);
      }
    }
    catcher.crossVolleyTimer = playMeta.isCross ? 1.6 : 0;
    if (isBetaCatch && (playMeta.isCross || (Number(playMeta.peakZ) || 0) >= 0.72)) {
      triggerNodeJump(catcher, 0.68, 0.40);
    }
    catcher.receiveDashUntil = 0;
    catcher.carryTime = 0;
    catcher.duelCooldown = playMeta.isGkOutlet ? 0.65 : 0.25;
    catcher.decisionTimer = playMeta.isGkOutlet ? 0.14 : (playMeta.isOneTwoPass || playMeta.isCross) ? 0.06 : 0.30;

    if (
      isBetaCatch &&
      !playMeta.isSafeProtectedPass &&
      !playMeta.isGkOutlet &&
      !playMeta.isOneTwoPass &&
      !playMeta.isReturnOneTwo
    ) {
      const fwdDirTouch = catcher.side === "user" ? 1 : -1;
      const nearPressDefs = (defNodes || []).filter(
        (d) => d.role !== "GK" && d.staggerTimer <= 0 && visualPitchDist(d.x, d.y, catcher.x, catcher.y) <= 4.4
      ).length;
      const inOppDangerBox = attIsUser ? catcher.x >= 76 : catcher.x <= 24;
      const catchSkill = (catcher.attrs?.tec || 75) * 0.6 + (catcher.stamina || 80) * 0.25;
      const touchDiff = nearPressDefs * 15 + ((Number(playMeta.peakZ) || 0) >= 0.85 ? 16 : playMeta.isThroughBall ? 10 : 4);
      const heavyMargin = touchDiff - catchSkill * 0.62;
      if (!inOppDangerBox && nearPressDefs >= 1 && heavyMargin > 4) {
        const heavyProb = Math.min(0.26, 0.08 + heavyMargin * 0.012);
        if (Math.random() < heavyProb) {
          const knockVx = fwdDirTouch * 14.5;
          const knockVy = (Math.random() - 0.5) * 7.0;
          pitch.ballMode = "LOOSE_BALL";
          pitch.carrierUid = null;
          pitch.ballZ = 0.08;
          pitch.ballVz = 0.75;
          pitch.ballSpinVel = (pitch.ballSpinVel || 240) * 1.15;
          pitch.looseState = {
            vx: knockVx,
            vy: knockVy,
            passerUid: playMeta.passerUid,
            passerNode: playMeta.passerNode,
            receiverUid: catcher.uid,
            isGkOutlet: false,
            isOneTwoPass: false,
            isThroughBall: false,
            wasOffsideAtPassTime: false,
            age: 0
          };
          catcher.decisionTimer = 0.08;
          showNodeBadge(pitch, catcher.uid, "Adiantou!", "badge-lost", 950);
          syncLivePitchDOM(st);
          return;
        }
      } else if ((catcher.attrs?.tec || 75) >= 82 || (catcher.attrs?.vel || 75) >= 84) {
        catcher.vx = (catcher.vx || 0) + fwdDirTouch * 6.5;
        catcher.decisionTimer = Math.min(catcher.decisionTimer, 0.16);
      }
    }
    // NUNCA teletransporta a bola ao recebedor: mantém pitch.ballX/Y onde houve o contato real;
    // CARRIED desliza suavemente a bola do ponto de domínio para o pé de condução!

    const isHarmonyActive =
      attIsUser && !pitch.is5v5 && (pitch.hissatsuTacticTimer || 0) > 0 && pitch.activeHissatsuTacticId === "raimon_harmony";
    const returnOneTwoProb = isHarmonyActive ? 0.94 : 0.78;
    if (playMeta.isOneTwoPass && playMeta.passerNode && Math.random() < returnOneTwoProb) {
      const runner = playMeta.passerNode;
      const runnerFwd = attIsUser ? runner.x > catcher.x - 4 : runner.x < catcher.x + 4;
      const runnerOnside =
        pitch.is5v5 || !isNodeOffside(runner, catcher, attIsUser, defNodes);
      if (runnerFwd && runnerOnside && Math.hypot(runner.x - catcher.x, runner.y - catcher.y) <= 32) {
        catcher.duelCooldown = 0.65;
        launchContinuousPass(st, pitch, catcher, attNodes, defNodes, true, false, false, {
          targetReceiver: runner,
          forceSpacePass: true,
          isReturnOneTwo: true
        });
        return;
      }
    }
    syncLivePitchDOM(st);
  };

  // FASE B: BOLA VIAJANDO NO PASSE EM CURVA FIXA DE BÉZIER (SEM TELEPORTE)
  if (pitch.ballMode === "PASS_FLIGHT" && pitch.passState) {
    const ps = pitch.passState;
    const receiver = findPitchNode(pitch, ps.receiverUid);

    ps.elapsed += dt;
    ps.progress = Math.min(1, ps.elapsed / ps.duration);
    const u = easePassProgress(ps.progress);
    const cpx = Number.isFinite(ps.ctrlX) ? ps.ctrlX : (ps.fromX + ps.toX) * 0.5;
    const cpy = Number.isFinite(ps.ctrlY) ? ps.ctrlY : (ps.fromY + ps.toY) * 0.5;
    const pos = evalQuadraticBezier(ps.fromX, ps.fromY, cpx, cpy, ps.toX, ps.toY, u);
    pitch.ballX = pos.x;
    pitch.ballY = pos.y;
    const peakZ = typeof isBetaMode === "function" && isBetaMode() ? (Number(ps.peakZ) || 0) : 0;
    const pClamped = Math.max(0, Math.min(1, ps.progress));
    pitch.ballZ = peakZ > 0 ? 4 * pClamped * (1 - pClamped) * peakZ : 0;
    if (pitch.passTrail && !pitch.passTrail.isDash) {
      pitch.passTrail.progress = pClamped;
      pitch.passTrail.u = u;
    }

    // 1) Goleiro sai para abafar cruzamento/lançamento alto dentro da sua área
    if (!ps.isSafeProtectedPass && peakZ >= 0.65 && ps.progress >= 0.58 && pitch.ballZ <= 0.88) {
      const oppGk = defNodes.find((d) => d.role === "GK" && d.staggerTimer <= 0 && d.duelCooldown <= 0);
      const ballInDefBox = oppGk && (attIsUser ? pitch.ballX >= 78 : pitch.ballX <= 22) && Math.abs(pitch.ballY - 50) <= 24;
      if (oppGk && ballInDefBox && visualPitchDist(oppGk.x, oppGk.y, pitch.ballX, pitch.ballY) <= 3.4) {
        oppGk.duelCooldown = 1.25;
        const gkCatchProb = Math.max(0.42, Math.min(0.86, 0.58 + ((oppGk.effOvr || 80) - (ps.passerNode?.effOvr || 75)) * 0.015));
        if (Math.random() < gkCatchProb) {
          spendStamina(oppGk, 2.0);
          pitch.ballSide = oppGk.side;
          pitch.ballMode = "CARRIED";
          pitch.carrierUid = oppGk.uid;
          pitch.challengerUid = null;
          pitch.passState = null;
          pitch.looseState = null;
          pitch.lastAssistCandidate = null;
          pitch.lastPasserUid = null;
          pitch.lastAction = "SAVE";
          pitch.teamConsecutivePasses = 0;
          pitch.ballZ = 0;
          pitch.ballVz = 0;
          oppGk.carryTime = 0.08;
          oppGk.decisionTimer = 0.45;
          showNodeBadge(pitch, oppGk.uid, "Saída pelo Alto!", "badge-save", 1450, "GK");
          if (!attIsUser) {
            pitch.stats.userSaves++;
            recordUserPlayerStat(pitch, oppGk, "saves", 1);
          }
          pitch.ticker = `${st.minute}' ${oppGk.player.name} saiu pelo alto na área e segurou a bola!`;
          syncLivePitchDOM(st);
          if (typeof playSfx === "function") playSfx("save");
          pauseForPitchBeat(st, "", "", 780, ovrDiff);
          return;
        }
      }
    }

    // 2) Interceptação física no chão: passes por cima (ballZ > 0.42) voam sobre os marcadores do meio do caminho!
    if (!ps.isSafeProtectedPass && ps.progress >= 0.16 && ps.progress <= 0.90 && pitch.ballZ <= 0.42) {
      const interceptor = defNodes.find(
        (d) =>
          d.role !== "GK" &&
          d.staggerTimer <= 0 &&
          d.duelCooldown <= 0 &&
          visualPitchDist(d.x, d.y, pitch.ballX, pitch.ballY) <= 2.45
      );
      if (interceptor) {
        interceptor.duelCooldown = 1.25;
        const passScore = calcNodeDuelScore(ps.passerNode, attSupport, interceptor?.player?.element, "OF");
        const defScore = calcNodeDuelScore(interceptor, defSupport, ps.passerNode?.player?.element, "DF");

        const passerOvr = ps.passerNode?.effOvr || 75;
        const defOvr = interceptor.effOvr || 75;
        const ovrAdvantage = passerOvr - defOvr;
        const powerWhiffChance = ovrAdvantage >= 6 ? Math.min(0.45, 0.22 + (ovrAdvantage - 6) * 0.03) : 0.06;
        const rawSuccessProb = Math.max(0.10, Math.min(0.48, 0.32 + (defScore - passScore) * 0.022));
        let finalInterceptProb = Math.random() < powerWhiffChance ? 0 : rawSuccessProb;
        if (attIsUser && finalInterceptProb > 0) {
          const pbLvl = state.tournament?.prepBonuses?.passBypassLvl || 0;
          if (pbLvl > 0) {
            const mult = [1, 0.85, 0.72, 0.60][pbLvl] || 0.60;
            finalInterceptProb *= mult;
          }
          if (!pitch.is5v5) {
            const tac = getTactics();
            if ((pitch.hissatsuTacticTimer || 0) > 0 && pitch.activeHissatsuTacticId === "route_of_sky") {
              finalInterceptProb *= 0.45;
            }
            if (tac.style === "possession") {
              finalInterceptProb *= 0.86;
            }
            if (getUserCaptainAuraType(pitch) === "STRATEGIST") {
              finalInterceptProb *= 0.85;
            }
            if (typeof isBetaMode === "function" && isBetaMode() && ps.passerNode && receiver && typeof getPairAffinityEntry === "function") {
              const pairAffLv = getPairAffinityEntry(ps.passerNode.player, receiver.player)?.level || 0;
              if (pairAffLv > 0) {
                finalInterceptProb *= [1, 0.92, 0.84, 0.75][pairAffLv] || 1;
              }
            }
            if (typeof isBetaMode === "function" && isBetaMode() && Array.isArray(state.tournament?.nextMatchChatBuffs)) {
              const cBuffs = state.tournament.nextMatchChatBuffs;
              if (cBuffs.some((b) => b.type === "RIVAL_READ")) {
                finalInterceptProb *= 0.88;
              }
              if (cBuffs.some((b) => b.type === "COOP_SYNC" && ps.passerNode?.player?.id && b.playerIds?.includes(ps.passerNode.player.id))) {
                finalInterceptProb *= 0.90;
              }
            }
          }
        } else if (!attIsUser && !pitch.is5v5 && finalInterceptProb > 0) {
          if ((pitch.hissatsuTacticTimer || 0) > 0 && (pitch.activeHissatsuTacticId === "catenaccio" || pitch.activeHissatsuTacticId === "lightning_press")) {
            finalInterceptProb = Math.min(0.75, finalInterceptProb * 1.28);
          }
          // Marcação Especial fecha linha de passe destinada ao craque rival marcado!
          const markedOppId = getTactics().markedOppId;
          if (markedOppId && receiver && receiver.role !== "GK" && receiver.player?.id === markedOppId) {
            finalInterceptProb = Math.min(0.78, finalInterceptProb * 1.15);
          }
        }

        if (Math.random() < finalInterceptProb) {
          if (!attIsUser) {
            triggerCatenaccioCounterIfActive(pitch);
          } else {
            pitch.catenaccioCounterTimer = 0;
          }
          spendStamina(interceptor, 2.2);

          pitch.ballSide = attIsUser ? "opp" : "user";
          pitch.ballMode = "CARRIED";
          pitch.carrierUid = interceptor.uid;
          pitch.challengerUid = null;
          pitch.passState = null;
          pitch.looseState = null;
          pitch.lastAssistCandidate = null;
          pitch.lastPasserUid = null;
          pitch.lastAction = "STEAL";
          pitch.teamConsecutivePasses = 0;
          pitch.ballZ = 0;
          pitch.ballVz = 0;
          interceptor.carryTime = 0;
          interceptor.decisionTimer = 0.25;
          const intFootX = interceptor.x + (interceptor.side === "user" ? 1.9 : -1.9);
          const intFootY = interceptor.y + 1.0;
          if (state.simSpeed === 1) {
            startBallFlight(pitch, pitch.ballX, pitch.ballY, intFootX, intFootY, 145, 0, "CONTROL", null);
          } else {
            pitch.ballX = intFootX;
            pitch.ballY = intFootY;
          }

          if (ps.passerNode) showNodeBadge(pitch, ps.passerNode.uid, "Interceptado", "badge-lost", 1450);
          showNodeBadge(pitch, interceptor.uid, "Interceptou", "badge-steal", 1450, "BALL");
          if (!attIsUser) {
            pitch.stats.userSteals++;
            recordUserPlayerStat(pitch, interceptor, "steals", 1);
          }
          pitch.ticker = `${st.minute}' ${interceptor.player.name} interceptou o passe de ${ps.passerNode?.player?.name || ""}!`;
          prependNarrationLine(
            st,
            "nar-steal",
            `${st.minute}' [Interceptação] ${interceptor.player.name} interceptou o passe de ${ps.passerNode?.player?.name || ""}!`,
            { name: interceptor.player.name, sprite: interceptor.player.sprite, side: interceptor.side },
            ps.passerNode ? { name: ps.passerNode.player.name, sprite: ps.passerNode.player.sprite, side: ps.passerNode.side } : null,
            "BALL"
          );
          syncLivePitchDOM(st);
          if (typeof playSfx === "function") playSfx("steal");
          pauseForPitchBeat(st, "", "", 950, ovrDiff);
          return;
        } else {
          showNodeBadge(pitch, interceptor.uid, "Passe Forte!", "badge-lost", 1000);
        }
      }
    }

    // 3) Disputa aérea no ponto de queda de lançamento/cruzamento/cavadinha
    if (!ps.aerialContestResolved && !ps.isSafeProtectedPass && peakZ >= 0.60 && ps.progress >= 0.78 && pitch.ballZ <= 0.55) {
      const recDist = receiver ? visualPitchDist(receiver.x, receiver.y, pitch.ballX, pitch.ballY) : 99;
      const airDef = defNodes.find(
        (d) =>
          d.role !== "GK" &&
          d.staggerTimer <= 0 &&
          d.duelCooldown <= 0 &&
          visualPitchDist(d.x, d.y, pitch.ballX, pitch.ballY) <= 2.9
      );
      if (receiver && airDef && recDist <= 3.2) {
        ps.aerialContestResolved = true;
        airDef.duelCooldown = 1.25;
        const routeAirBoost =
          attIsUser && !pitch.is5v5 && (pitch.hissatsuTacticTimer || 0) > 0 && pitch.activeHissatsuTacticId === "route_of_sky"
            ? 6.0
            : 0;
        const attAirScore =
          (receiver.attrs?.fis || 80) * 0.55 +
          (receiver.effOvr || 80) * 0.45 +
          ((receiver.stamina || 80) - 70) * 0.12 +
          routeAirBoost;
        const defAirScore =
          (airDef.attrs?.fis || 80) * 0.55 +
          (airDef.effOvr || 80) * 0.45 +
          ((airDef.stamina || 80) - 70) * 0.12;
        if (Math.random() < logisticWinProb(attAirScore, defAirScore, 1.8, 0.25, 0.85)) {
          triggerNodeJump(receiver, 0.88, 0.48);
          triggerNodeJump(airDef, 0.72, 0.44);
          showNodeBadge(pitch, receiver.uid, "Ganhou no Alto!", "badge-pass", 1100, "BALL");
          completeAttackingPassCatch(ps, receiver);
          return;
        } else {
          triggerNodeJump(airDef, 0.96, 0.52);
          triggerNodeJump(receiver, 0.68, 0.42);
          spendStamina(airDef, 2.2);
          pitch.ballSide = attIsUser ? "opp" : "user";
          pitch.ballMode = "CARRIED";
          pitch.carrierUid = airDef.uid;
          pitch.challengerUid = null;
          pitch.passState = null;
          pitch.looseState = null;
          pitch.lastAssistCandidate = null;
          pitch.lastPasserUid = null;
          pitch.lastAction = "STEAL";
          pitch.teamConsecutivePasses = 0;
          pitch.ballZ = 0;
          pitch.ballVz = 0;
          airDef.carryTime = 0;
          airDef.decisionTimer = 0.25;
          showNodeBadge(pitch, airDef.uid, "Corte Aéreo!", "badge-steal", 1300, "DF");
          if (!attIsUser) {
            pitch.stats.userSteals++;
            recordUserPlayerStat(pitch, airDef, "steals", 1);
          }
          pitch.ticker = `${st.minute}' ${airDef.player.name} subiu mais alto e cortou a bola pelo alto!`;
          syncLivePitchDOM(st);
          if (typeof playSfx === "function") playSfx("steal");
          pauseForPitchBeat(st, "", "", 780, ovrDiff);
          return;
        }
      }
    }

    // Recepção apenas por alcance FÍSICO real (no Teste Beta exige descida real antes de dominar bolas altas!)
    const isBetaFlight = typeof isBetaMode === "function" && isBetaMode();
    const canCatchByHeight = isBetaFlight
      ? (peakZ < 0.45 || (ps.progress >= 0.82 && pitch.ballZ <= 0.36) || pitch.ballZ <= 0.24)
      : (peakZ < 0.60 || pitch.ballZ <= 0.62 || ps.progress >= 0.72);
    const catchRadius = (ps.isThroughBall || ps.isOneTwoPass) ? 2.85 : 2.35;
    let physicalCatcher = null;
    if (canCatchByHeight && receiver && ps.progress >= 0.32 && visualPitchDist(receiver.x, receiver.y, pitch.ballX, pitch.ballY) <= catchRadius) {
      physicalCatcher = receiver;
    } else if (canCatchByHeight && ps.progress >= 0.55) {
      physicalCatcher = attNodes.find(
        (n) =>
          n.uid !== ps.passerUid &&
          n.staggerTimer <= 0 &&
          visualPitchDist(n.x, n.y, pitch.ballX, pitch.ballY) <= 2.15
      ) || null;
    }

    if (physicalCatcher) {
      completeAttackingPassCatch(ps, physicalCatcher);
      return;
    }

    // Passe no espaço (ou chegada sem toque): vira BOLA SOLTA viva rolando/quicando com spin para disputarem na corrida!
    const shouldReleaseToLoose = (isBetaFlight && ps.releaseToLooseAt && ps.progress >= ps.releaseToLooseAt) || ps.progress >= 1;
    if (shouldReleaseToLoose) {
      const deriv = evalQuadraticBezierDeriv(ps.fromX, ps.fromY, cpx, cpy, ps.toX, ps.toY, Math.min(1, u));
      const rawVx = (deriv.dx * 0.76) / Math.max(0.2, ps.duration);
      const rawVy = (deriv.dy * 0.76) / Math.max(0.2, ps.duration);
      const mag = Math.hypot(rawVx, rawVy) || 1;
      const cappedSpeed = Math.min(24, Math.max(9, mag * (isBetaFlight && ps.releaseToLooseAt ? 0.52 : 0.42)));
      const endVx = (rawVx / mag) * cappedSpeed;
      const endVy = (rawVy / mag) * cappedSpeed;

      if (pitch.passTrail && !pitch.passTrail.isDash) {
        pitch.passTrail.progress = Math.max(0.05, Math.min(1, Number(ps.progress) || 1));
        pitch.passTrail.u = Math.min(1, u);
        pitch.passTrail.curX = pitch.ballX;
        pitch.passTrail.curY = pitch.ballY;
        pitch.passTrail.frozenPathD = null;
        pitch.passTrail.fadeUntil = performance.now() + 340;
      }
      pitch.ballMode = "LOOSE_BALL";
      if (isBetaFlight) {
        pitch.ballZ = Math.max(0, Number(pitch.ballZ) || 0);
        pitch.ballVz = pitch.ballZ > 0.08 ? -0.9 : peakZ > 0 ? Math.min(2.6, peakZ * 2.1) : 0;
        if (Number.isFinite(ps.spinVel)) pitch.ballSpinVel = ps.spinVel * 0.85;
      } else {
        pitch.ballZ = 0;
        pitch.ballVz = 0;
      }
      pitch.looseState = {
        vx: endVx,
        vy: endVy,
        passerUid: ps.passerUid,
        passerNode: ps.passerNode,
        receiverUid: ps.receiverUid,
        isGkOutlet: ps.isGkOutlet,
        isOneTwoPass: ps.isOneTwoPass,
        isThroughBall: ps.isThroughBall,
        wasOffsideAtPassTime: ps.wasOffsideAtPassTime,
        age: 0
      };
      pitch.passState = null;
      return;
    }
    return;
  }

  // FASE C: BOLA SOLTA ROLANDO/QUICANDO NO GRAMADO (ATÉ ALGUÉM CHEGAR FISICAMENTE E DOMINAR)
  if (pitch.ballMode === "LOOSE_BALL" && pitch.looseState) {
    const ls = pitch.looseState;
    ls.age += dt;
    const damp = Math.exp(-2.85 * dt);
    ls.vx *= damp;
    ls.vy *= damp;
    pitch.ballX += ls.vx * dt;
    pitch.ballY += ls.vy * dt;

    if (typeof isBetaMode === "function" && isBetaMode()) {
      const GRAVITY = 6.2;
      pitch.ballVz = (pitch.ballVz || 0) - GRAVITY * dt;
      pitch.ballZ = (pitch.ballZ || 0) + pitch.ballVz * dt;
      if (pitch.ballZ <= 0) {
        pitch.ballZ = 0;
        pitch.ballVz = Math.abs(pitch.ballVz) > 0.45 ? Math.abs(pitch.ballVz) * 0.52 : 0;
      }
      // Desaceleração natural do spin na grama e leve curva magnus em bolas com efeito
      pitch.ballSpinVel = (pitch.ballSpinVel || 0) * Math.exp(-1.9 * dt);
      const spdNow = Math.hypot(ls.vx, ls.vy);
      if (spdNow > 2.5 && Math.abs(pitch.ballSpinVel || 0) > 80) {
        const swerve = (pitch.ballSpinVel / 600) * 1.45 * dt;
        ls.vx += (-ls.vy / spdNow) * swerve;
        ls.vy += (ls.vx / spdNow) * swerve;
      }
    } else {
      pitch.ballZ = 0;
      pitch.ballVz = 0;
    }

    if (pitch.ballX < 7.0) {
      pitch.ballX = 7.0;
      ls.vx = Math.abs(ls.vx) * 0.45;
    } else if (pitch.ballX > 93.0) {
      pitch.ballX = 93.0;
      ls.vx = -Math.abs(ls.vx) * 0.45;
    }
    if (pitch.ballY < 9.0) {
      pitch.ballY = 9.0;
      ls.vy = Math.abs(ls.vy) * 0.45;
    } else if (pitch.ballY > 91.0) {
      pitch.ballY = 91.0;
      ls.vy = -Math.abs(ls.vy) * 0.45;
    }

    let bestCollector = null;
    let bestScore = 999;
    [...attNodes, ...defNodes].forEach((n) => {
      if (n.staggerTimer > 0) return;
      if (n.uid === ls.passerUid && ls.age < 0.35) return;
      if (typeof isBetaMode === "function" && isBetaMode()) {
        const maxCatchZ = n.role === "GK" ? 0.85 : 0.48;
        if ((pitch.ballZ || 0) > maxCatchZ) return;
      }
      const d = visualPitchDist(n.x, n.y, pitch.ballX, pitch.ballY);
      const reach = n.uid === ls.receiverUid || n.role === "GK" ? 2.75 : 2.35;
      if (d <= reach) {
        const priorityScore = n.uid === ls.receiverUid ? d - 0.35 : n.side === (attIsUser ? "user" : "opp") ? d - 0.1 : d;
        if (priorityScore < bestScore) {
          bestScore = priorityScore;
          bestCollector = n;
        }
      }
    });

    if (bestCollector) {
      const wonByAttack = bestCollector.side === (attIsUser ? "user" : "opp");
      if (wonByAttack) {
        completeAttackingPassCatch(ls, bestCollector);
      } else {
        spendStamina(bestCollector, 1.8);
        pitch.ballSide = bestCollector.side;
        pitch.ballMode = "CARRIED";
        pitch.carrierUid = bestCollector.uid;
        pitch.challengerUid = null;
        pitch.passState = null;
        pitch.looseState = null;
        pitch.ballZ = 0;
        pitch.ballVz = 0;
        pitch.lastAssistCandidate = null;
        pitch.lastPasserUid = null;
        pitch.lastAction = "STEAL";
        pitch.teamConsecutivePasses = 0;
        bestCollector.receiveDashUntil = 0;
        bestCollector.carryTime = 0;
        bestCollector.decisionTimer = 0.25;
        showNodeBadge(pitch, bestCollector.uid, "Recuperou!", "badge-steal", 1100, "BALL");
        if (bestCollector.side === "user") {
          pitch.stats.userSteals++;
          triggerCatenaccioCounterIfActive(pitch);
          recordUserPlayerStat(pitch, bestCollector, "steals", 1);
        } else {
          pitch.catenaccioCounterTimer = 0;
        }
        pitch.ticker = `${st.minute}' ${bestCollector.player.name} ganhou a disputa na corrida e ficou com a bola!`;
        syncLivePitchDOM(st);
        if (typeof playSfx === "function") playSfx("steal");
      }
    }
    return;
  }
}

function effRoleOrPos(node) {
  return getEffectiveCarrierRole(node);
}

function activateUserHissatsuTactic(st) {
  const pitch = st?.pitch;
  if (!st || !pitch || pitch.is5v5 || st.finished || st.penalties) return false;
  if (
    !st.running ||
    state.tournament?.pendingWhistleFinish ||
    state.tournament?.pendingClashFinish ||
    state.tournament?.pendingShotFlightFinish ||
    state.tournament?.pendingNetFlightFinish
  ) {
    return false;
  }
  if (pitch.hissatsuTacticUsed || (pitch.hissatsuTacticTimer || 0) > 0) return false;

  const tac = getTactics();
  const hObj = HISSATSU_TACTICS_CATALOG?.[tac.hissatsuTactic] || HISSATSU_TACTICS_CATALOG?.route_of_sky;
  if (!hObj) return false;

  pitch.hissatsuTacticUsed = true;
  pitch.usedHissatsuTacticId = hObj.id;
  pitch.activeHissatsuTacticId = hObj.id;
  pitch.hissatsuTacticTimer = hObj.durationSec || 10.5;

  if (hObj.id === "raimon_harmony") {
    (pitch.userNodes || []).forEach((n) => {
      n.stamina = Math.min(100, (n.stamina || 60) + 10);
    });
  }

  const capObj = typeof getActiveTeamCaptain === "function" ? getActiveTeamCaptain() : null;
  const caller = capObj?.player || pitch.userNodes?.[0]?.player || null;
  showPitchBadge(pitch, 50, 48, `⚡ ${hObj.name.toUpperCase()}!`, "badge-keshin", 1700);
  pitch.ticker = `${st.minute}' ⚡ TÁTICA ESPECIAL: 【${hObj.name}】 ativada!`;
  prependNarrationLine(
    st,
    "nar-dribble",
    `${st.minute}' ⚡ [Tática Especial!] ${caller ? `${caller.name} comandou ` : "O técnico acionou "}【${hObj.name}】! ${hObj.desc}`,
    caller ? { name: caller.name, sprite: caller.sprite, side: "user" } : null,
    null,
    "FF"
  );
  syncLivePitchDOM(st);
  const ovrDiff = pitch.matchSupport?.ovrDiff || 0;
  pauseForPitchBeat(st, "", "", 780, ovrDiff);
  return true;
}

function startMatchInterval() {
  if (state.tournament.timerId) {
    clearInterval(state.tournament.timerId);
    state.tournament.timerId = null;
  }
  const active5v5 = state.tournament.prep?.clash5v5?.miniSt;
  if (active5v5 && active5v5.running && !active5v5.finished) {
    ensureMatchSupport(active5v5, active5v5.pitch);
    if (!state.tournament.pitchRafId) startPitchRafLoop(active5v5);
    return;
  }
  const stageIdx = state.tournament.stageIndex;
  const st = state.tournament.stages[stageIdx];
  if (!st || st.finished) return;
  if (!st.pitch) st.pitch = initMatchPitchState(st, stageIdx);
  ensureMatchSupport(st, st.pitch);
  if (!state.tournament.pitchRafId) startPitchRafLoop(st);
}

function runLiveMatchSimulation(stageIdx) {
  clearTournamentTimers(false);
  const resolvedIdx = typeof stageIdx === "number"
    ? stageIdx
    : state.tournament?.stages?.indexOf(stageIdx);
  if (!Number.isInteger(resolvedIdx) || resolvedIdx < 0 || !state.tournament?.stages?.[resolvedIdx]) {
    return;
  }
  stageIdx = resolvedIdx;
  state.tournament.stageIndex = stageIdx;
  state.tournament.showRunSummary = false;
  state.tournament.preMatchTeamEnergy = getTeamEnergy();
  saveActiveRunProgress();

  const st = state.tournament.stages[stageIdx];
  if (st.isGroupStage && state.tournament.worldGroup) {
    if (st._groupSnapshotBefore) {
      state.tournament.worldGroup = JSON.parse(JSON.stringify(st._groupSnapshotBefore));
    } else {
      st._groupSnapshotBefore = JSON.parse(JSON.stringify(state.tournament.worldGroup));
    }
    st._groupRecorded = false;
  }
  const compLabel = st.competition === "WORLD" ? "Mundial (FFI)" : "Futebol Fronteira";
  st.minute = 0;
  st.maxMinute = 90;
  st.userScore = 0;
  st.oppScore = 0;
  st.goalsUser = [];
  st.goalsOpp = [];
  st.narration = [
    {
      cls: "",
      iconCat: "FF",
      text: `0' Apito inicial pela ${st.stageName} do ${compLabel}: Sua Seleção enfrenta ${st.oppTeam.name}!`
    }
  ];
  st._betaMemoryRecorded = false;
  if (typeof isBetaMode === "function" && isBetaMode()) {
    const promRes = typeof checkAndConsumeChatPromisesBeforeMatch === "function"
      ? checkAndConsumeChatPromisesBeforeMatch(state.tournament)
      : { honored: [], broken: [] };
    st.betaMatchStats = {
      disobediences: 0,
      feudSnubs: 0,
      honoredPromises: promRes.honored.length,
      brokenPromises: promRes.broken.length
    };
    if (promRes.broken.length > 0) {
      st.narration.unshift({
        cls: "nar-save",
        iconCat: "FF",
        text: `0' ⚠️ O elenco notou que o combinado no vestiário (${promRes.broken[0].label}) foi alterado antes do apito inicial...`
      });
    } else if (typeof getCoachRespectInfo === "function") {
      const rInfo = getCoachRespectInfo();
      if (rInfo.tier === "HIGH") {
        st.narration.unshift({
          cls: "nar-goal-user",
          iconCat: "FF",
          text: `0' 🫡 Elenco fechado com o técnico (Respeito ${rInfo.value}%): foco total na estratégia!`
        });
      } else if (rInfo.tier === "LOW") {
        st.narration.unshift({
          cls: "nar-save",
          iconCat: "FF",
          text: `0' ⚠️ Clima tenso com a comissão técnica (Respeito ${rInfo.value}%): jogadores podem desobedecer ordens em campo!`
        });
      }
    }
  }
  st.running = true;
  st.finished = false;
  st.halftimeHandled = false;
  st.etHalftimeHandled = false;
  st.won = null;
  st.isDraw = false;
  st.penalties = null;
  st.penaltiesText = null;
  st.pitch = initMatchPitchState(st, stageIdx);

  renderTournamentScreen();
  startPitchRafLoop(st);
  startMatchInterval();
  if (typeof playSfx === "function") playSfx("whistle");
}
