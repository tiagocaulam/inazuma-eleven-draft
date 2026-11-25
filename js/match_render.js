function buildFireballSVG() {
  return `
    <svg viewBox="0 0 36 36" width="32" height="32" aria-hidden="true">
      <circle cx="18" cy="18" r="14" fill="#ffffff" stroke="#1e293b" stroke-width="2" />
      <polygon points="18,10 23,14 21,21 15,21 13,14" fill="#0f172a" />
      <line x1="18" y1="10" x2="18" y2="4" stroke="#0f172a" stroke-width="1.8" />
      <line x1="23" y1="14" x2="30" y2="11" stroke="#0f172a" stroke-width="1.8" />
      <line x1="13" y1="14" x2="6" y2="11" stroke="#0f172a" stroke-width="1.8" />
      <line x1="21" y1="21" x2="27" y2="27" stroke="#0f172a" stroke-width="1.8" />
      <line x1="15" y1="21" x2="9" y2="27" stroke="#0f172a" stroke-width="1.8" />
    </svg>
  `;
}

function buildDribbleBootSVG() {
  // Pernas e chuteiras correndo em passadas alternadas conduzindo a bola
  return `
    <svg viewBox="0 0 64 40" width="60" height="38" aria-hidden="true">
      <line x1="2" y1="12" x2="11" y2="12" stroke="#e9d5ff" stroke-width="2" stroke-linecap="round" opacity="0.8" />
      <line x1="0" y1="20" x2="9" y2="20" stroke="#c084fc" stroke-width="2" stroke-linecap="round" opacity="0.65" />
      <!-- Perna traseira -->
      <g class="dribble-leg-b">
        <path d="M22 4 L27 4 L23 19 L17 18 Z" fill="#eab308" stroke="#1e1b4b" stroke-width="1.4" />
        <path d="M18 17 L25 18 L29 24 L16 23 Z" fill="#7e22ce" stroke="#e9d5ff" stroke-width="1.3" />
        <rect x="18" y="23" width="2.5" height="2.2" fill="#fde047" />
        <rect x="24" y="24" width="2.5" height="2.2" fill="#fde047" />
      </g>
      <!-- Perna dianteira chutando/conduzindo -->
      <g class="dribble-leg-a">
        <path d="M26 4 L32 5 L34 20 L27 20 Z" fill="#facc15" stroke="#1e1b4b" stroke-width="1.4" />
        <path d="M28 8 L33 9" stroke="#2563eb" stroke-width="2.4" />
        <path d="M27 19 L36 19 L43 24 C44 26.5, 42 28, 39 28 L26 27 C24.5 26, 25 21, 27 19 Z" fill="#a855f7" stroke="#ffffff" stroke-width="1.5" />
        <rect x="28" y="27.5" width="2.8" height="2.5" rx="0.6" fill="#fef08a" />
        <rect x="34" y="27.5" width="2.8" height="2.5" rx="0.6" fill="#fef08a" />
        <rect x="39" y="27.5" width="2.5" height="2.5" rx="0.6" fill="#fef08a" />
      </g>
      <!-- Bola girando na condução -->
      <g class="dribble-ball-spin">
        <circle cx="52" cy="25" r="9" fill="#ffffff" stroke="#1e293b" stroke-width="1.8" />
        <polygon points="52,20.5 55.2,23 54,27 50,27 48.8,23" fill="#1e1b4b" />
        <line x1="52" y1="20.5" x2="52" y2="16" stroke="#1e1b4b" stroke-width="1.2" />
        <line x1="55.2" y1="23" x2="59.5" y2="21.5" stroke="#1e1b4b" stroke-width="1.2" />
        <line x1="48.8" y1="23" x2="44.5" y2="21.5" stroke="#1e1b4b" stroke-width="1.2" />
      </g>
    </svg>
  `;
}

function buildSlideTackleSVG() {
  // Carrinho clássico rente ao gramado apontando para a esquerda (flipado via CSS se LTR)
  return `
    <svg viewBox="0 0 68 40" width="64" height="38" aria-hidden="true">
      <!-- Rastro de grama e poeira atrás -->
      <path d="M40 34 L66 34" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" opacity="0.85" />
      <path d="M48 29 Q56 26 64 31" stroke="#bae6fd" stroke-width="1.8" fill="none" stroke-linecap="round" />
      <!-- Perna de apoio dobrada no chão (atrás) -->
      <path d="M53 16 L44 26 L56 30 L59 25 L50 22 L57 18 Z" fill="#1e3a8a" stroke="#93c5fd" stroke-width="1.3" />
      <!-- Perna estendida dando o carrinho para frente -->
      <path d="M50 18 L31 24 L33 30 L53 24 Z" fill="#0284c7" stroke="#e0f2fe" stroke-width="1.4" />
      <!-- Listras do meião -->
      <path d="M36 22 L38 29" stroke="#facc15" stroke-width="2.6" />
      <!-- Chuteira bem nítida apontada pro corte (bico + cadarço + travas) -->
      <path d="M32 22 L34 30 L21 31 C17.5 30, 17 25.5, 20.5 23.5 L32 22 Z" fill="#0ea5e9" stroke="#ffffff" stroke-width="1.6" />
      <line x1="23" y1="24" x2="27" y2="23.5" stroke="#fde047" stroke-width="1.5" stroke-linecap="round" />
      <!-- Travas na sola da chuteira voltadas para frente/baixo -->
      <rect x="19" y="30.5" width="3" height="3" rx="0.6" fill="#fde047" />
      <rect x="24.5" y="30.5" width="3" height="3" rx="0.6" fill="#fde047" />
      <rect x="30" y="30" width="3" height="3" rx="0.6" fill="#fde047" />
      <!-- Bola interceptada + faísca -->
      <circle cx="10.5" cy="24" r="8.5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8" />
      <polygon points="10.5,19.5 13.5,22 12.2,26 8.8,26 7.5,22" fill="#0f172a" />
      <path d="M18 11 L15 16.5 L20 16.5 L16 21.5" stroke="#fde047" stroke-width="2.1" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `;
}

function getTacticalRole(slotLabel) {
  if (slotLabel === "GOL") return "GK";
  if (slotLabel === "LIB") return "LIB";
  if (slotLabel === "ZAG") return "CB";
  if (slotLabel === "LE" || slotLabel === "LD") return "FB";
  if (slotLabel === "AE" || slotLabel === "AD") return "WB";
  if (slotLabel === "VOL") return "DM";
  if (slotLabel === "ME" || slotLabel === "MD") return "WM";
  if (slotLabel === "MC") return "CM";
  if (slotLabel === "MEI") return "AM";
  if (slotLabel === "PE" || slotLabel === "PD") return "WING";
  if (slotLabel === "CA" || slotLabel === "ATA") return "ST";
  return "CM";
}

function calcNodeBaseSpeed(tacticalRole, effOvr, player = null) {
  const roleMult =
    tacticalRole === "WING" || tacticalRole === "ST"
      ? 14.6
      : tacticalRole === "WB" || tacticalRole === "FB" || tacticalRole === "AM"
      ? 13.8
      : tacticalRole === "WM" || tacticalRole === "CM"
      ? 13.0
      : tacticalRole === "DM" || tacticalRole === "LIB"
      ? 12.2
      : tacticalRole === "CB"
      ? 11.4
      : 9.2;
  const spdStat = calcPlayerSpeedStat(player, effOvr);
  const spdFactor = 0.72 + (spdStat / 100) * 0.50;
  return roleMult * spdFactor;
}

function resetPitchForKickoff(pitch, kickoffSide, snapNodes = false, isGoalReset = false) {
  if (!pitch) return;
  const koNodes = kickoffSide === "user" ? pitch.userNodes : pitch.oppNodes;
  const koMid = koNodes.find((n) => n.role === "MF") || koNodes[5] || koNodes[0];

  // Após um gol, apenas os goleiros recuperam energia; jogadores de linha não recuperam com o gol!
  if (isGoalReset) {
    [...pitch.userNodes, ...pitch.oppNodes].forEach((n) => {
      if (n.role !== "GK") return;
      const lost = Math.max(0, 100 - n.stamina);
      if (lost > 0) {
        n.stamina = Math.min(100, Math.round(n.stamina + lost * 0.55));
      }
    });
  }

  [...pitch.userNodes, ...pitch.oppNodes].forEach((n) => {
    n.vx = 0;
    n.vy = 0;
    n.duelCooldown = 0.6;
    n.staggerTimer = 0;
    n.receiveDashUntil = 0;
    n.carryTime = 0;
    n.decisionTimer = 0.25;
    if (snapNodes) {
      const halfClampX =
        n.side === "user" ? Math.min(46, n.baseX) : Math.max(54, n.baseX);
      n.x = halfClampX;
      n.y = n.baseY;
      n.targetX = halfClampX;
      n.targetY = n.baseY;
    }
  });

  pitch.ballSide = kickoffSide;
  pitch.ballMode = "CARRIED";
  pitch.carrierUid = koMid ? koMid.uid : "u_MF1";
  pitch.challengerUid = null;
  pitch.chaserUid = null;
  pitch.looseAttChaserUid = null;
  pitch.looseDefChaserUid = null;
  pitch.ballFlight = null;
  pitch.passState = null;
  pitch.looseState = null;
  pitch.holdBallPos = null;
  pitch.lastAssistCandidate = null;
  pitch.lastPasserUid = null;
  pitch.lastAction = null;
  pitch.sameActionStreak = 0;
  pitch.teamConsecutivePasses = 0;
  pitch.ballX = 50;
  pitch.ballY = 50;
  pitch.ballZ = 0;
  pitch.ballVx = 0;
  pitch.ballVy = 0;
  pitch.ballVz = 0;
  pitch.ballSpinDeg = 0;
  pitch.ballSpinVel = 0;
  pitch.synergyLinkFx = null;
  pitch.coopFreeze = null;
  [...(pitch.userNodes || []), ...(pitch.oppNodes || [])].forEach((n) => {
    n.jumpZ = 0;
    n.jumpStartMs = 0;
    n.jumpDurationMs = 0;
    n.jumpPeak = 0;
  });
  pitch.camX = 50;
  pitch.camY = 50;
  pitch.camSnap = true;
  pitch.passTrail = null;
  pitch.dashFx = null;
  pitch.pushTweens = [];
  pitch.interceptTweens = [];
  pitch.shockFx = null;
  pitch.saveRingFx = null;
  pitch.justKickedOff = true;

  if (koMid) {
    koMid.x = 50;
    koMid.y = 50;
    koMid.targetX = 50;
    koMid.targetY = 50;
  }
}

function showRefereeWhistleModal(st, type, onProceed) {
  hideBondPlayersTooltip();
  clearTournamentTimers(false);
  const slotEl = document.getElementById("shot-clash-slot");
  if (!slotEl || !st) {
    if (typeof onProceed === "function") onProceed();
    return;
  }

  const isHalftime = type === "HALFTIME";
  const isEtHalftime = type === "ET_HALFTIME";
  const isExtraTime = type === "EXTRA_TIME";
  const isPenalties = type === "PENALTIES";
  const isFulltime = type === "FULLTIME";

  if (typeof playSfx === "function") {
    playSfx("whistle", { long: isFulltime || isPenalties });
    if (isFulltime && !st.won && !st.isDraw) {
      setTimeout(() => {
        if (typeof playSfx === "function") playSfx("defeat", { force: true });
      }, 240);
    }
  }
  const activeTeamName = typeof getActiveTeamName === "function" ? getActiveTeamName() : "Dream Team";
  const activeTeamUpper = activeTeamName.toUpperCase();

  const t = state.tournament;
  const isAdvancingToNextStage = Boolean(
    t &&
    t.stages &&
    t.stageIndex + 1 < t.stages.length &&
    (st.isGroupStage
      ? st.groupRoundIdx < 2 || getUserGroupRank(t.worldGroup) <= 2
      : st.won)
  );
  const nextStageName = isAdvancingToNextStage ? t.stages[t.stageIndex + 1].stageName : "";

  const headerBadge = isHalftime
    ? "INTERVALO • FIM DO 1º TEMPO"
    : isEtHalftime
    ? "INTERVALO DA PRORROGAÇÃO • 105'"
    : isExtraTime
    ? "FIM DO TEMPO NORMAL • PRORROGAÇÃO"
    : isPenalties
    ? "FIM DA PRORROGAÇÃO • PÊNALTIS"
    : "APITO FINAL • FIM DE JOGO";

  const minuteText = isHalftime ? "45'" : isEtHalftime ? "105'" : isExtraTime ? "90'" : isPenalties ? "120'" : `${st.minute}'`;
  const soundText = isFulltime || isPenalties ? "⚡ FIIII-FIII-FIIIIII! ⚡" : "⚡ FIIII-FIIII! ⚡";

  const mainTitle = isHalftime
    ? "FIM DO PRIMEIRO TEMPO!"
    : isEtHalftime
    ? "VIRADA DA PRORROGAÇÃO!"
    : isExtraTime
    ? "EMPATE NO TEMPO NORMAL!"
    : isPenalties
    ? "DECISÃO POR PÊNALTIS!"
    : st.won
    ? (activeTeamName === "Dream Team" ? "VITÓRIA DO DREAM TEAM!" : `VITÓRIA DE ${activeTeamUpper}!`)
    : st.isDraw
    ? "FIM DE JOGO • EMPATE!"
    : `VITÓRIA DE ${st.oppTeam?.name || "ADVERSÁRIO"}!`;

  const restBonus = (t?.prepBonuses?.restLvl || 0) * 4;
  const subtitleText = isHalftime
    ? `O árbitro apita o intervalo! Ambos os times recuperam fôlego (+${35 + restBonus}% linha / +${45 + restBonus}% goleiro).`
    : isEtHalftime
    ? `Fim do 1º tempo extra! Ambos os times recuperam fôlego (+${18 + restBonus}% linha / +${25 + restBonus}% goleiro) para os 15' finais.`
    : isExtraTime
    ? `O empate persiste aos 90'! Ambos os times recuperam +${30 + restBonus}% de fôlego para a Prorrogação!`
    : isPenalties
    ? "O árbitro encerra a prorrogação! A vaga será decidida nos pênaltis!"
    : isAdvancingToNextStage
    ? `Partida encerrada com avanço para ${nextStageName}!`
    : "O árbitro apita o fim da partida! Confira os números e os destaques.";

  const buttonText = isHalftime
    ? "⚡ Iniciar 2º Tempo ▶"
    : isEtHalftime
    ? "⚡ Iniciar 2º Tempo Extra ▶"
    : isExtraTime
    ? "⚡ Iniciar Prorrogação ▶"
    : isPenalties
    ? "⚡ Bater Pênaltis ▶"
    : isAdvancingToNextStage
    ? `⚡ Preparar para ${nextStageName} ▶`
    : "🏆 Ver Resultado da Campanha ▶";

  // Modal do árbitro/apito limpo e direto: Ícone/PNG do Apito, Fim do 1º Tempo / Fim de Jogo, Placar e Botão abaixo
  slotEl.classList.add("is-referee-overlay");
  slotEl.style.display = "flex";
  slotEl.innerHTML = `
    <div class="referee-whistle-stage">
      <div class="referee-hero-frame">
        <img class="referee-sprite-img whistle-png-img" src="images/whistle.png" alt="Apito do Árbitro" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" />
        <div class="referee-whistle-emoji-fallback" style="display:none; width:100%; height:100%; align-items:center; justify-content:center; font-size:3.2rem; filter:drop-shadow(0 4px 10px rgba(250,204,21,0.5));">
          📢
        </div>
      </div>

      <div class="referee-title">${mainTitle}</div>
      ${subtitleText ? `<div class="referee-subtitle">${subtitleText}</div>` : ""}

      <div class="referee-scoreboard">
        <span class="ref-team-name">${st.userTeamName || activeTeamName}</span>
        <span class="ref-score-badge">${st.userScore} - ${st.oppScore}</span>
        <span class="ref-team-name">${st.oppTeam?.name || "Adversário"}</span>
      </div>

      <button class="ie-cmd-btn ie-cmd-gold referee-proceed-btn" id="btn-referee-proceed">
        <span>${buttonText}</span>
      </button>
    </div>
  `;

  let closed = false;

  const closeAndProceed = (targetMode = null) => {
    if (closed) return;
    closed = true;
    if (state.tournament.whistleTimerId) {
      clearTimeout(state.tournament.whistleTimerId);
      state.tournament.whistleTimerId = null;
    }
    state.tournament.pendingWhistleFinish = null;
    if (state.tournament.whistleKeyHandler) {
      document.removeEventListener("keydown", state.tournament.whistleKeyHandler);
      state.tournament.whistleKeyHandler = null;
    }
    slotEl.classList.remove("is-fixed-overlay");
    slotEl.classList.remove("is-referee-overlay");
    slotEl.innerHTML = "";
    slotEl.style.display = "none";

    if (isHalftime) {
      st.running = true;
      if (st.pitch) {
        st.pitch.minuteFloat = 45;
        st.minute = 45;
        st.pitch.stoppageTicks = 0;
        st.pitch.stoppageBoundaryMin = null;
      }
    } else if (isExtraTime) {
      st.running = true;
      if (st.pitch) {
        st.pitch.minuteFloat = 90;
        st.minute = 90;
        st.pitch.stoppageTicks = 0;
        st.pitch.stoppageBoundaryMin = null;
      }
    } else if (isEtHalftime) {
      st.running = true;
      if (st.pitch) {
        st.pitch.minuteFloat = 105;
        st.minute = 105;
        st.pitch.stoppageTicks = 0;
        st.pitch.stoppageBoundaryMin = null;
      }
    }

    if (isFulltime && targetMode === "DIRECT_ACTION") {
      if (isAdvancingToNextStage) {
        openBetweenMatchPrep(t.stageIndex + 1);
        return;
      } else {
        state.tournament.showRunSummary = true;
        renderTournamentScreen();
        return;
      }
    }

    if (typeof onProceed === "function") {
      onProceed();
    }
  };

  state.tournament.pendingWhistleFinish = closeAndProceed;

  const keyHandler = (e) => {
    if (e.code === "Space" || e.code === "Enter") {
      e.preventDefault();
      closeAndProceed("DIRECT_ACTION");
    }
  };
  state.tournament.whistleKeyHandler = keyHandler;
  document.addEventListener("keydown", keyHandler);

  const btn = document.getElementById("btn-referee-proceed");
  if (btn) {
    btn.addEventListener("click", () => closeAndProceed("DIRECT_ACTION"));
  }

  const peekBtn = document.getElementById("btn-peek-stats");
  if (peekBtn) {
    peekBtn.addEventListener("click", () => closeAndProceed("PEEK"));
  }

  // Auto-avanço com tempo generoso para leitura sem pressa
  const autoAdvanceMs = state.simSpeed === 4 ? 4500 : 7500;
  state.tournament.whistleTimerId = setTimeout(() => {
    closeAndProceed(isFulltime ? "DIRECT_ACTION" : null);
  }, autoAdvanceMs);
}

function applyIntervalStaminaRecharge(st, fieldGain, gkGain) {
  const restLvl = state.tournament?.prepBonuses?.restLvl || 0;
  const restBonus = restLvl * 4;
  const result = {
    userField: fieldGain + restBonus,
    userGk: gkGain + restBonus,
    restBonus
  };
  if (!st?.pitch) return result;
  [...(st.pitch.userNodes || []), ...(st.pitch.oppNodes || [])].forEach((n) => {
    const base = n.role === "GK" ? gkGain : fieldGain;
    const bonus = n.side === "user" ? restBonus : 0;
    n.stamina = Math.min(100, Math.round((n.stamina + base + bonus) * 10) / 10);
    // Intervalo / prorrogação limpa a exaustão pós-Keshin (mantendo keshinUsed = true)
    if (n.keshinState === "EXHAUSTED") {
      n.keshinState = null;
    }
  });
  return result;
}

function handleMinuteEndBoundaries(st, ovrDiff) {
  if (st.isGoldenGoal5v5) {
    if (st.userScore > 0 || st.oppScore > 0) {
      if (st._goldenHandled) return true;
      st._goldenHandled = true;
      clearTournamentTimers(false);
      st.running = false;
      st.finished = true;
      st.won = st.userScore > st.oppScore;
      if (typeof st.onGoldenGoalDone === "function") {
        const scorerName = st.userScore > 0 ? st.goalsUser[0]?.name : st.goalsOpp[0]?.name;
        if (state.simSpeed === 1) {
          st.onGoldenGoalDone(st, scorerName);
        } else {
          state.tournament.prepMatchTimerId = setTimeout(() => {
            state.tournament.prepMatchTimerId = null;
            st.onGoldenGoalDone(st, scorerName);
          }, 220);
        }
      }
      return true;
    }
    return false;
  }

  if (st.minute === 45 && !st.halftimeHandled) {
    st.halftimeHandled = true;
    st.running = false;
    clearTournamentTimers(false);
    const rec = applyIntervalStaminaRecharge(st, 35, 45);
    const restNote = rec.restBonus > 0 ? ` (+${rec.restBonus}% Descanso)` : "";
    if (st.pitch) {
      st.pitch.minuteFloat = 45;
      st.pitch.stoppageTicks = 0;
      st.pitch.stoppageBoundaryMin = null;
      st.pitch.ticker = `45' Fim do 1º tempo! Placar: ${st.userScore} x ${st.oppScore} (+${rec.userField}% Fôlego${restNote})`;
      const secondHalfSide = st.pitch.initialSide === "user" ? "opp" : "user";
      resetPitchForKickoff(st.pitch, secondHalfSide, true);
      syncLivePitchDOM(st);
    }
    const teamDisp = typeof getActiveTeamName === "function" ? getActiveTeamName() : "Dream Team";
    prependNarrationLine(
      st,
      "nar-pass",
      `45' [Intervalo] Árbitro apitou o fim do 1º tempo (${st.userScore} x ${st.oppScore}) — ${teamDisp} recupera +${rec.userField}% de fôlego (+${rec.userGk}% GOL)${restNote}!`,
      null,
      null,
      "FF"
    );
    showRefereeWhistleModal(st, "HALFTIME", () => {
      st.running = true;
      if (st.pitch) {
        st.pitch.minuteFloat = 45;
        st.minute = 45;
        st.pitch.stoppageTicks = 0;
        st.pitch.stoppageBoundaryMin = null;
      }
      if (!st.finished && st.running) {
        startMatchInterval();
      }
    });
    return true;
  }

  if (st.minute === 90 && st.userScore === st.oppScore && st.maxMinute === 90 && !st.isGroupStage) {
    st.maxMinute = 120;
    st.running = false;
    clearTournamentTimers(false);
    const rec = applyIntervalStaminaRecharge(st, 30, 40);
    const restNote = rec.restBonus > 0 ? ` (+${rec.restBonus}% Descanso)` : "";
    const teamDisp = typeof getActiveTeamName === "function" ? getActiveTeamName() : "Dream Team";
    if (st.pitch) {
      st.pitch.minuteFloat = 90;
      st.pitch.stoppageTicks = 0;
      st.pitch.stoppageBoundaryMin = null;
      resetPitchForKickoff(st.pitch, "user", true);
      st.pitch.ticker = `90' Prorrogação iniciada! ${teamDisp} recupera +${rec.userField}% de fôlego${restNote}!`;
      syncLivePitchDOM(st);
    }
    prependNarrationLine(
      st,
      "nar-save",
      `90' Empate no tempo normal! ${teamDisp} recupera +${rec.userField}% de fôlego (+${rec.userGk}% GOL)${restNote} para a Prorrogação (até os 120')!`,
      null,
      null,
      "FF"
    );
    showRefereeWhistleModal(st, "EXTRA_TIME", () => {
      st.running = true;
      if (st.pitch) {
        st.pitch.minuteFloat = 90;
        st.minute = 90;
        st.pitch.stoppageTicks = 0;
        st.pitch.stoppageBoundaryMin = null;
      }
      if (!st.finished && st.running) {
        startMatchInterval();
      }
    });
    return true;
  }

  if (st.minute === 105 && !st.etHalftimeHandled && st.maxMinute === 120) {
    st.etHalftimeHandled = true;
    clearTournamentTimers(false);
    st.running = false;
    const rec = applyIntervalStaminaRecharge(st, 18, 25);
    const restNote = rec.restBonus > 0 ? ` (+${rec.restBonus}% Descanso)` : "";
    if (st.pitch) {
      st.pitch.minuteFloat = 105;
      st.pitch.stoppageTicks = 0;
      st.pitch.stoppageBoundaryMin = null;
      resetPitchForKickoff(st.pitch, "opp", true);
      st.pitch.ticker = `105' Virada da Prorrogação! Fôlego recarregado (+${rec.userField}%${restNote}) para os 15 minutos finais!`;
      syncLivePitchDOM(st);
    }
    const teamDisp = typeof getActiveTeamName === "function" ? getActiveTeamName() : "Dream Team";
    prependNarrationLine(
      st,
      "nar-pass",
      `105' [Virada da Prorrogação] ${teamDisp} recupera +${rec.userField}% de fôlego (+${rec.userGk}% GOL)${restNote} para o 2º tempo extra!`,
      null,
      null,
      "FF"
    );
    showRefereeWhistleModal(st, "ET_HALFTIME", () => {
      st.running = true;
      if (st.pitch) {
        st.pitch.minuteFloat = 105;
        st.minute = 105;
        st.pitch.stoppageTicks = 0;
        st.pitch.stoppageBoundaryMin = null;
      }
      if (!st.finished && st.running) {
        startMatchInterval();
      }
    });
    return true;
  }

  if (st.minute >= st.maxMinute) {
    clearTournamentTimers(false);
    st.running = false;

    if (!st.isGroupStage && st.userScore === st.oppScore && !st.penalties) {
      st.finished = false;
      st.penalties = createPenaltyShootoutState(st);
      if (st.pitch) {
        st.pitch.stoppageTicks = 0;
        st.pitch.stoppageBoundaryMin = null;
        st.pitch.ticker = `120' Empate em ${st.userScore} x ${st.oppScore}! Decisão por Pênaltis — defina os batedores!`;
      }
      prependNarrationLine(
        st,
        "nar-save",
        `120' FIM DA PRORROGAÇÃO! Empate em ${st.userScore} x ${st.oppScore} — Decisão por Pênaltis!`,
        null,
        null,
        null
      );
      showRefereeWhistleModal(st, "PENALTIES", () => {
        renderTournamentScreen();
      });
      return true;
    }

    st.finished = true;
    st.isDraw = st.userScore === st.oppScore;
    st.won = st.userScore > st.oppScore;
    if (typeof recordBetaPostMatchMemory === "function") {
      recordBetaPostMatchMemory(st);
    }
    if (st.pitch) {
      st.pitch.ballFlight = null;
      st.pitch.goalBurstFx = null;
      st.pitch.passState = null;
      st.pitch.looseState = null;
      st.pitch.stoppageTicks = 0;
      st.pitch.stoppageBoundaryMin = null;
    }
    const teamDisp = typeof getActiveTeamName === "function" ? getActiveTeamName() : "Dream Team";
    prependNarrationLine(
      st,
      st.won ? "nar-goal-user" : st.isDraw ? "nar-save" : "nar-goal-opp",
      `${st.minute}' APITO FINAL! ${teamDisp} ${st.userScore} x ${st.oppScore} ${st.oppTeam.name}${st.isDraw ? " (Empate)" : ""}!`,
      null,
      null,
      "FF"
    );
    if (st.isGroupStage) {
      finalizeWorldGroupRound(st);
    } else if (typeof advanceTournamentBracketAfterStage === "function") {
      advanceTournamentBracketAfterStage(st);
    }
    awardPostMatchExperience(st);
    if (isTournamentRunTerminal(state.tournament)) {
      maybeAutoSaveRunToRanking(state.tournament);
    }

    clearTournamentTimers(false);
    st.running = false;
    renderTournamentScreen();
    return true;
  }
  return false;
}

// ============================================================================
// CAMPO TÁTICO AO VIVO & SIMULAÇÃO POR POSSE / DUELOS INDIVIDUAIS
// ============================================================================
const ELEMENT_ADVANTAGE = {
  Fogo: "Floresta",
  Floresta: "Vento",
  Vento: "Montanha",
  Montanha: "Fogo"
};

function compressOvr(effOvr) {
  // Sem compressão artificial: craques 88..97 mantêm 100% do seu peso e ainda escalam mais Poder por Nível!
  return effOvr;
}

function getElementEdge(atkElem, defElem) {
  if (!atkElem || !defElem) return 0;
  // Sistema Elemental canônico de Inazuma Eleven:
  // Fogo > Floresta > Vento > Montanha > Fogo
  // Vantagem elemental: +5.2 pontos de duelo (impacto decisivo)
  // Desvantagem elemental: -5.2 pontos de duelo
  if (ELEMENT_ADVANTAGE[atkElem] === defElem) return 5.2;
  if (ELEMENT_ADVANTAGE[defElem] === atkElem) return -5.2;
  return 0;
}

function calcNodeDuelScore(node, teamSupportBonus, opponentElem = null, actionKind = null) {
  if (!node) return 75;
  // Penalidade de cansaço quando a energia cai na zona vermelha (< 45%)
  const fatiguePenalty = node.stamina < 45 ? Math.min(5.0, 1.4 + (45 - node.stamina) * 0.09) : 0;
  // Keshin agora é ativada dinamicamente 1x por partida: grande surto de poder (~+10% chance) durante a aura!
  const keshinBonus = node.keshinState === "ACTIVE" ? 3.4 : 0;
  const evoBonus = node.player?.moveEvoCount ? Math.min(1.4, node.player.moveEvoCount * 0.7) : 0;

  // Poder individual e Status Base crescentes com o Nível (FOR, TEC, DEF, VEL, FIS)
  const pLvl = node.level || getPlayerLevel(node.player);
  const indivPwr =
    node.indivPower ||
    calcIndividualPlayerPower(node.player, node.role, pLvl);
  const attrs =
    node.attrs ||
    calcPlayerAttributes(node.player, node.role, pLvl);

  // Bônus específico dos Status Base do jogador conforme a ação em campo
  const roleOrAction = actionKind || node.role || "MF";
  let statSpecBonus = 0;
  if (roleOrAction === "SH" || roleOrAction === "FW") {
    statSpecBonus = (attrs.for - 82) * 0.036 + (attrs.tec - 82) * 0.016;
  } else if (roleOrAction === "OF" || roleOrAction === "MF") {
    statSpecBonus = (attrs.tec - 82) * 0.036 + (attrs.vel - 82) * 0.020;
  } else if (roleOrAction === "DF") {
    statSpecBonus = (attrs.def - 82) * 0.036 + (attrs.fis - 82) * 0.016;
  } else if (roleOrAction === "GK") {
    statSpecBonus = (attrs.def - 82) * 0.042 + (attrs.fis - 82) * 0.018;
  }

  const logPwrScore = Math.log(Math.max(40, indivPwr) / 100) * 16.5;
  const powerScore = 54 + logPwrScore + (node.effOvr - 80) * 0.15 + statSpecBonus;

  const activeStage = state.tournament?.stages?.[state.tournament.stageIndex];
  const livePitch = activeStage?.pitch || null;
  const curMin = activeStage?.minute || 0;
  const active5v5 = state.tournament?.prep?.clash5v5?.miniSt;
  const isIn5v5 = Boolean(active5v5 && active5v5.running && !active5v5.finished);

  let tacticalAndEnergyAdj = 0;
  if (node.side === "user") {
    if (!isIn5v5) {
      const band = getTeamEnergyBand();
      tacticalAndEnergyAdj += band.duelPenalty || 0;

      const tac = getTactics();
      // Postura Tática
      if (tac.posture === "defensive") {
        if (roleOrAction === "DF" || roleOrAction === "GK") tacticalAndEnergyAdj += 2.0;
        else if (roleOrAction === "SH") tacticalAndEnergyAdj -= 1.0;
      } else if (tac.posture === "offensive") {
        if (roleOrAction === "SH" || roleOrAction === "OF" || roleOrAction === "FW") tacticalAndEnergyAdj += 1.8;
        else if (roleOrAction === "DF") tacticalAndEnergyAdj -= 1.5;
      }

      // Canal de Ataque (escalado pelos atributos do jogador apenas em ações ofensivas, sem buffar GK/zaga!)
      if (roleOrAction === "SH" || roleOrAction === "OF") {
        if (tac.lane === "wings" && (node.y < 34 || node.y > 66)) {
          tacticalAndEnergyAdj += 1.1 + Math.max(-0.4, Math.min(1.1, (attrs.vel - 80) * 0.045));
        } else if (tac.lane === "center" && node.y >= 34 && node.y <= 66) {
          tacticalAndEnergyAdj += 1.1 + Math.max(-0.4, Math.min(1.1, (attrs.tec - 80) * 0.045));
        }
      }

      // Intensidade
      if (tac.intensity === "high") tacticalAndEnergyAdj += 1.1;
      else if (tac.intensity === "low") tacticalAndEnergyAdj -= 2.1;

      // Referência Ofensiva ("Camisa 10")
      if (tac.acePlayerId && node.player?.id === tac.acePlayerId && (roleOrAction === "SH" || roleOrAction === "OF")) {
        tacticalAndEnergyAdj += 0.6;
      }

      // Aura do Capitão do Time (proximidade <= 24u + buff após passe do Capitão)
      if (typeof getActiveTeamCaptain === "function" && typeof getCaptainAuraInfo === "function") {
        const capObj = getActiveTeamCaptain();
        if (capObj) {
          const capTacRole = capObj.player?.id && capObj.player.id === getTactics().acePlayerId ? "CAMISA_10" : "NONE";
          const aura = getCaptainAuraInfo(capObj.player, capObj.role, capTacRole);
          const isTrailing = (activeStage?.userScore || 0) < (activeStage?.oppScore || 0);
          const capNode = livePitch?.userNodes?.find((un) => un.player?.id === capObj.player.id) || null;
          const capDist = capNode
            ? (typeof visualPitchDist === "function"
              ? visualPitchDist(capNode.x, capNode.y, node.x, node.y)
              : Math.hypot(capNode.x - node.x, capNode.y - node.y))
            : 999;
          const nearCap = Boolean(capNode && (capNode.uid === node.uid || capDist <= 24));
          const hasCapPass = Boolean((node.captainPassBuffTimer || 0) > 0 && node.captainPassAuraType === aura.type);

          if (aura.type === "EGO_STRIKER") {
            if (hasCapPass && roleOrAction === "SH") tacticalAndEnergyAdj += 1.65;
            else if (nearCap && (roleOrAction === "SH" || roleOrAction === "OF")) tacticalAndEnergyAdj += 1.25;
            else if (roleOrAction === "SH") tacticalAndEnergyAdj += 0.45;
          } else if (aura.type === "STRATEGIST") {
            if (hasCapPass && (roleOrAction === "SH" || roleOrAction === "OF")) tacticalAndEnergyAdj += 1.35;
            else if (nearCap && (roleOrAction === "OF" || roleOrAction === "SH")) tacticalAndEnergyAdj += 0.85;
          } else if (aura.type === "PACE_LEADER") {
            if (hasCapPass && (roleOrAction === "OF" || roleOrAction === "SH")) tacticalAndEnergyAdj += 1.30;
            else if (nearCap && (roleOrAction === "OF" || roleOrAction === "DF")) tacticalAndEnergyAdj += 0.90;
          } else if (aura.type === "WARRIOR") {
            if (nearCap && (roleOrAction === "DF" || roleOrAction === "GK")) {
              tacticalAndEnergyAdj += (isTrailing || curMin >= 70) ? 1.50 : 1.05;
            } else if (hasCapPass) {
              tacticalAndEnergyAdj += 0.95;
            }
          } else if (aura.type === "KEEPER_WALL") {
            if (nearCap && (roleOrAction === "GK" || roleOrAction === "DF")) tacticalAndEnergyAdj += 1.25;
            else if (hasCapPass && roleOrAction === "DF") tacticalAndEnergyAdj += 0.95;
          } else if (aura.type === "COLLECTIVE") {
            if (hasCapPass) tacticalAndEnergyAdj += 1.20;
            else if (nearCap) tacticalAndEnergyAdj += 0.75;
          }
        }
      }

      // Tática Especial Ativa (Hissatsu Tactic!)
      if (livePitch && (livePitch.hissatsuTacticTimer || 0) > 0) {
        const htId = livePitch.activeHissatsuTacticId;
        if (htId === "catenaccio" && (roleOrAction === "DF" || roleOrAction === "GK")) {
          tacticalAndEnergyAdj += 1.8;
        } else if (htId === "lightning_press" && roleOrAction === "DF") {
          tacticalAndEnergyAdj += 1.4;
        } else if (htId === "raimon_harmony") {
          tacticalAndEnergyAdj += 1.3;
        }
      }
      if (livePitch && (livePitch.catenaccioCounterTimer || 0) > 0 && roleOrAction === "SH") {
        tacticalAndEnergyAdj += 1.8;
      }
      if (typeof isBetaMode === "function" && isBetaMode() && node && (node.synergyPassBuffTimer || 0) > 0) {
        tacticalAndEnergyAdj += Number(node.synergyPassBuffBonus || 0.85);
      }
      if (typeof isBetaMode === "function" && isBetaMode() && !isIn5v5 && Array.isArray(state.tournament?.nextMatchChatBuffs)) {
        const pid = node?.player?.id;
        for (const cb of state.tournament.nextMatchChatBuffs) {
          if (cb.type === "BLOOD_FOCUS" && pid && cb.playerIds?.includes(pid)) {
            tacticalAndEnergyAdj += 0.75;
          } else if (cb.type === "MORALE_BOOST" && (node?.stamina || 0) >= 60) {
            tacticalAndEnergyAdj += 0.45;
          }
        }
      }
    }
  } else if (node.side === "opp") {
    const sIdx = !isIn5v5 ? (state.tournament?.stageIndex || 0) : 0;
    tacticalAndEnergyAdj += Math.min(1.5, Math.max(0, sIdx - 1) * 0.18);

    const oppPost = getOpponentDynamicPosture();
    if (oppPost === "offensive") {
      if (roleOrAction === "SH" || roleOrAction === "OF" || roleOrAction === "FW") tacticalAndEnergyAdj += 1.4;
      else if (roleOrAction === "DF") tacticalAndEnergyAdj -= 1.0;
    } else if (oppPost === "defensive") {
      if (roleOrAction === "DF" || roleOrAction === "GK") tacticalAndEnergyAdj += 1.6;
      else if (roleOrAction === "SH") tacticalAndEnergyAdj -= 0.8;
    }

    // Marcação Especial escolhida no Scout do Adversário (apenas jogadores de linha)
    if (!isIn5v5 && node.role !== "GK" && getTactics().markedOppId && node.player?.id === getTactics().markedOppId && (roleOrAction === "SH" || roleOrAction === "OF")) {
      tacticalAndEnergyAdj -= 1.4;
    }
  }

  return (
    powerScore +
    teamSupportBonus +
    keshinBonus +
    evoBonus -
    fatiguePenalty +
    tacticalAndEnergyAdj +
    getElementEdge(node.player?.element, opponentElem)
  );
}

function logisticWinProb(atkScore, defScore, baseShift = 0, minP = 0.06, maxP = 0.90) {
  // Curva logística calibrada (0.12) e faixa -24..+24:
  // Mantém vantagem clara de Poder/Combos sem travar duelos nos extremos!
  const diff = Math.max(-24, Math.min(24, atkScore - defScore)) + baseShift;
  const p = 1 / (1 + Math.exp(-diff * 0.12));
  return Math.max(minP, Math.min(maxP, p));
}

function spendStamina(node, cost) {
  if (!node) return;
  const active5v5 = state.tournament?.prep?.clash5v5?.miniSt;
  const isIn5v5 = Boolean(active5v5 && active5v5.running && !active5v5.finished);
  const activeStage = isIn5v5 ? null : state.tournament?.stages?.[state.tournament.stageIndex];
  const curMinute = activeStage?.minute || 0;
  const hasFinalResistance = !isIn5v5 && node.side === "user" && state.tournament?.prepBonuses?.lateMatchNoStaminaLoss;
  const lateMul = hasFinalResistance && curMinute >= 75 ? 0.5 : 1;
  const fisStat = node.attrs?.fis || 80;
  const fisMul = Math.max(0.76, Math.min(1.12, 1 - (fisStat - 82) * 0.004));
  const tac = getTactics();
  const userInt = !isIn5v5 && node.side === "user" ? tac.intensity : "medium";
  const tacIntMul = userInt === "high" ? 1.28 : userInt === "low" ? 0.86 : 1.0;

  let extraMul = 1.0;
  if (!isIn5v5 && node.side === "user") {
    if (tac.style === "possession") extraMul *= 0.90;
    if (typeof isBetaMode === "function" && isBetaMode() && Array.isArray(state.tournament?.nextMatchChatBuffs)) {
      const pid = node?.player?.id;
      if (pid && state.tournament.nextMatchChatBuffs.some((b) => b.type === "LIGHT_LOCKER" && b.playerIds?.includes(pid))) {
        extraMul *= 0.88;
      }
    }
    const lp = activeStage?.pitch;
    if (lp && (lp.hissatsuTacticTimer || 0) > 0 && lp.activeHissatsuTacticId === "lightning_press") {
      extraMul *= 1.20;
    }
    if (typeof getActiveTeamCaptain === "function" && typeof getCaptainAuraInfo === "function") {
      const capObj = getActiveTeamCaptain();
      const capTacRole = capObj?.player?.id && capObj.player.id === tac.acePlayerId ? "CAMISA_10" : "NONE";
      const aura = capObj ? getCaptainAuraInfo(capObj.player, capObj.role, capTacRole) : null;
      const isTrailing = (activeStage?.userScore || 0) < (activeStage?.oppScore || 0);
      const capNode = lp?.userNodes?.find((un) => un.player?.id === capObj?.player?.id) || null;
      const capDist = capNode
        ? (typeof visualPitchDist === "function"
          ? visualPitchDist(capNode.x, capNode.y, node.x, node.y)
          : Math.hypot(capNode.x - node.x, capNode.y - node.y))
        : 999;
      const nearCap = Boolean(capNode && (capNode.uid === node.uid || capDist <= 24));
      const hasCapPass = Boolean((node.captainPassBuffTimer || 0) > 0 && node.captainPassAuraType === aura?.type);
      if (aura?.type === "WARRIOR" && (hasCapPass || (nearCap && (isTrailing || curMinute >= 70)))) {
        extraMul *= hasCapPass ? 0.85 : 0.88;
      } else if (aura?.type === "KEEPER_WALL" && (nearCap || hasCapPass)) {
        extraMul *= 0.88;
      }
    }
  }

  const snackMul = !isIn5v5 && node.side === "user" ? (state.tournament?.nextMatchEnergyMul || 1) : 1;
  const mul = (node.side === "user" ? state.tournament?.prepBonuses?.staminaMul || 1 : 1) * snackMul * fisMul * tacIntMul * lateMul * extraMul;
  node.stamina = Math.max(5, node.stamina - cost * mul);
}

function buildOpponentLineup(oppTeam, stageIdx) {
  const { formSlots, assignments, oppLevel } = getEvolvedOpponentRoster(oppTeam, stageIdx);
  return formSlots.map((slot, idx) => {
    const player = assignments[slot.id];
    const effOvr = getEffectiveOvr(player, slot.role);
    const indivPower = calcIndividualPlayerPower(player, slot.role, oppLevel);
    const attrs = calcPlayerAttributes(player, slot.role, oppLevel);
    const baseX = Math.max(7, Math.min(93, 100 - ((96 - slot.y) * 0.78 + 4)));
    const baseY = Math.max(12, Math.min(88, 100 - slot.x + (slot.role === "DF" ? 3 : -3)));
    const tacticalRole = getTacticalRole(slot.label);
    const spd = attrs.vel;
    return {
      uid: `o_${slot.id}`,
      side: "opp",
      slotId: slot.id,
      role: slot.role,
      tacticalRole,
      label: slot.label,
      player,
      effOvr,
      level: oppLevel,
      indivPower,
      attrs,
      spd,
      stamina: 100,
      baseX,
      baseY,
      x: baseX,
      y: baseY,
      vx: 0,
      vy: 0,
      maxSpeed: calcNodeBaseSpeed(tacticalRole, effOvr, player),
      targetX: baseX,
      targetY: baseY,
      targetSprint: 0.9,
      duelCooldown: 0,
      staggerTimer: 0,
      receiveDashUntil: 0,
      carryTime: 0,
      decisionTimer: 0.25 + (idx % 3) * 0.08,
      wanderPhase: idx * 1.37
    };
  });
}

function initMatchPitchState(st, stageIdx) {
  const slots = getSlots();
  const userNodes = slots.map((slot, idx) => {
    const player = state.squad[slot.id];
    const effOvr = getEffectiveOvr(player, slot.role);
    const pLvl = getPlayerLevel(player);
    const indivPower = calcIndividualPlayerPower(player, slot.role, pLvl);
    const attrs = calcPlayerAttributes(player, slot.role, pLvl);
    const baseX = Math.max(7, Math.min(76, (96 - slot.y) * 0.78 + 4));
    const baseY = Math.max(12, Math.min(88, slot.x));
    const tacticalRole = getTacticalRole(slot.label);
    const spd = attrs.vel;
    const startStam = getTeamEnergyBand().startStamina || 100;
    return {
      uid: `u_${slot.id}`,
      side: "user",
      slotId: slot.id,
      role: slot.role,
      tacticalRole,
      label: slot.label,
      player,
      effOvr,
      level: pLvl,
      indivPower,
      attrs,
      spd,
      stamina: startStam,
      baseX,
      baseY,
      x: baseX,
      y: baseY,
      vx: 0,
      vy: 0,
      maxSpeed: calcNodeBaseSpeed(tacticalRole, effOvr, player),
      targetX: baseX,
      targetY: baseY,
      targetSprint: 0.9,
      duelCooldown: 0,
      staggerTimer: 0,
      receiveDashUntil: 0,
      carryTime: 0,
      decisionTimer: 0.25 + (idx % 3) * 0.08,
      wanderPhase: idx * 1.19
    };
  });

  const oppNodes = buildOpponentLineup(st.oppTeam, stageIdx);
  const startSide = Math.random() < 0.55 ? "user" : "opp";
  const startPool = (startSide === "user" ? userNodes : oppNodes).filter((n) => n.role === "MF");
  const startNode = startPool[0] || (startSide === "user" ? userNodes[5] : oppNodes[5]);
  if (startNode) {
    startNode.x = 50;
    startNode.y = 50;
    startNode.targetX = 50;
    startNode.targetY = 50;
  }

  const pitch = {
    is5v5: false,
    userNodes,
    oppNodes,
    oppTeamName: st.oppTeam.name,
    initialSide: startSide,
    ballSide: startSide,
    ballMode: "CARRIED",
    carrierUid: startNode ? startNode.uid : "u_MF1",
    challengerUid: null,
    chaserUid: null,
    ballX: 50,
    ballY: 50,
    ballZ: 0,
    ballVx: 0,
    ballVy: 0,
    ballVz: 0,
    ballSpinDeg: 0,
    ballSpinVel: 0,
    synergyLinkFx: null,
    camX: 50,
    camY: 50,
    camSnap: true,
    camLastNow: 0,
    ballFlight: null,
    passState: null,
    looseState: null,
    holdBallPos: null,
    lastAssistCandidate: null,
    lastPasserUid: null,
    lastAction: null,
    sameActionStreak: 0,
    teamConsecutivePasses: 0,
    justKickedOff: true,
    passTrail: null,
    interceptTweens: [],
    floatBadge: null,
    nodeBadges: {},
    goalFlashSide: null,
    goalFlashUntil: 0,
    simTime: 0,
    minuteFloat: 0,
    matchSupport: { userTeamSupport: 0, oppTeamSupport: 0, ovrDiff: 0 },
    ticker: `0' Bola rolando — ${startNode?.player?.name || "Meio-campo"} inicia a jogada!`,
    lastClashMinute: -10,
    stats: {
      userTicks: 1,
      oppTicks: 1,
      userPassesOk: 0,
      userPassesTry: 0,
      userGkReleases: 0,
      userDribblesOk: 0,
      userDribblesTry: 0,
      userSteals: 0,
      userBlocks: 0,
      userSaves: 0,
      userShots: 0,
      oppShots: 0,
      playerStats: (() => {
        const map = {};
        userNodes.forEach((n) => {
          map[n.uid] = {
            uid: n.uid,
            slotId: n.slotId,
            role: n.role,
            id: n.player.id,
            name: n.player.name,
            fullName: n.player.fullName || n.player.name,
            sprite: getPlayerFormSprite(n.player, n.role),
            element: n.player.element,
            teamEmblem: n.player.teamEmblem,
            teamName: n.player.teamName,
            ovr: n.effOvr,
            goals: 0,
            assists: 0,
            passesOk: 0,
            passesTry: 0,
            gkReleases: 0,
            dribblesOk: 0,
            dribblesTry: 0,
            steals: 0,
            blocks: 0,
            shots: 0,
            saves: 0
          };
        });
        return map;
      })()
    }
  };
  recomputePitchTargets(pitch);
  return pitch;
}

function recordUserPlayerStat(pitch, node, field, amount = 1) {
  if (!pitch?.stats?.playerStats || !node || node.side !== "user") return;
  const entry = pitch.stats.playerStats[node.uid];
  if (!entry) return;
  entry[field] = (entry[field] || 0) + amount;
}

function findPitchNode(pitch, uid) {
  if (!pitch || !uid) return null;
  return (
    pitch.userNodes.find((n) => n.uid === uid) ||
    pitch.oppNodes.find((n) => n.uid === uid) ||
    null
  );
}

function pinNodeToCoord(pitch, node, wx, wy, snapImmediate = false) {
  if (!pitch || !node) return;
  const clampedX = Math.max(8, Math.min(92, wx));
  const clampedY = Math.max(9, Math.min(91, wy));
  node.targetX = Number(clampedX.toFixed(1));
  node.targetY = Number(clampedY.toFixed(1));
  if (snapImmediate) {
    node.x = node.targetX;
    node.y = node.targetY;
    node.vx = 0;
    node.vy = 0;
  }
}

function evalQuadraticBezier(p0x, p0y, cpx, cpy, p2x, p2y, u) {
  const inv = 1 - u;
  return {
    x: inv * inv * p0x + 2 * inv * u * cpx + u * u * p2x,
    y: inv * inv * p0y + 2 * inv * u * cpy + u * u * p2y
  };
}

function evalQuadraticBezierDeriv(p0x, p0y, cpx, cpy, p2x, p2y, u) {
  const inv = 1 - u;
  return {
    dx: 2 * inv * (cpx - p0x) + 2 * u * (p2x - cpx),
    dy: 2 * inv * (cpy - p0y) + 2 * u * (p2y - cpy)
  };
}

function easePassProgress(p) {
  const clamped = Math.max(0, Math.min(1, p));
  // Sai rápido do pé e desacelera suavemente no gramado até o alvo
  return 1.24 * clamped - 0.24 * clamped * clamped;
}

function getNodePersonality(node) {
  if (!node) {
    return { archetype: "COLETIVISTA", ego: 0.45, vision: 0.55, combativeness: 0.5, roaming: 0.5, shotInstinct: 0.5 };
  }
  if (node.aiProfile) return node.aiProfile;

  const p = node.player || {};
  const attrs = node.attrs || { for: 75, tec: 75, def: 75, vel: 75, fis: 75 };
  const role = node.role || p.pos || "MF";
  const tr = node.tacticalRole || role;
  const moves = p.moves || {};
  const shCnt = Array.isArray(moves.SH) ? moves.SH.length : 0;
  const ofCnt = Array.isArray(moves.OF) ? moves.OF.length : 0;
  const dfCnt = Array.isArray(moves.DF) ? moves.DF.length : 0;

  // Seed determinística por jogador para dar individualidade única mesmo entre stats parecidos
  const keyStr = String(p.id || p.name || node.uid || "p");
  let hash = 0;
  for (let i = 0; i < keyStr.length; i++) {
    hash = ((hash << 5) - hash + keyStr.charCodeAt(i)) | 0;
  }
  const seed = (Math.abs(hash) % 1000) / 1000; // 0..1
  const jitter = (seed - 0.5) * 0.18;

  const avg = (attrs.for + attrs.tec + attrs.def + attrs.vel + attrs.fis) / 5 || 75;
  const relFor = (attrs.for - avg) / 18;
  const relTec = (attrs.tec - avg) / 18;
  const relDef = (attrs.def - avg) / 18;
  const relVel = (attrs.vel - avg) / 18;
  const relFis = (attrs.fis - avg) / 18;

  let archetype = "COLETIVISTA";
  if (role === "GK") {
    archetype = (attrs.vel >= attrs.def - 6 || attrs.vel + attrs.fis * 0.52 >= attrs.def * 1.48)
      ? "GOLEIRO_LIBERO"
      : "GOLEIRO_CLASSICO";
  } else {
    const scoreIndiv =
      (role === "FW" ? 0.55 : tr === "WING" || tr === "AM" ? 0.35 : 0.0) +
      relFor * 0.65 +
      relVel * 0.35 +
      (shCnt >= 2 ? 0.25 : 0) +
      (ofCnt >= 2 ? 0.2 : 0) +
      jitter;
    const scoreEstrat =
      (role === "MF" ? 0.5 : tr === "AM" || tr === "CM" || tr === "DM" ? 0.35 : 0.05) +
      relTec * 0.85 +
      (ofCnt >= 1 ? 0.12 : 0) -
      jitter * 0.5;
    const scoreComb =
      (role === "DF" ? 0.55 : tr === "DM" || tr === "CM" ? 0.3 : 0.05) +
      relDef * 0.6 +
      relFis * 0.6 +
      (dfCnt >= 2 ? 0.28 : dfCnt === 1 ? 0.1 : 0) +
      jitter * 0.4;
    const scoreVeloz =
      (tr === "WING" || tr === "WB" || tr === "FB" ? 0.48 : role === "FW" ? 0.22 : 0.0) +
      relVel * 0.95 +
      (ofCnt >= 1 ? 0.1 : 0) -
      jitter * 0.3;
    const scoreColet =
      0.42 +
      relTec * 0.35 +
      relFis * 0.25 -
      Math.max(0, relFor) * 0.2 +
      (0.5 - Math.abs(seed - 0.5)) * 0.25;

    const ranked = [
      ["INDIVIDUALISTA", scoreIndiv],
      ["ESTRATEGISTA", scoreEstrat],
      ["COMBATIVO", scoreComb],
      ["VELOZ", scoreVeloz],
      ["COLETIVISTA", scoreColet]
    ].sort((a, b) => b[1] - a[1]);
    archetype = ranked[0][0];
  }

  const clamp01 = (v) => Math.max(0.08, Math.min(0.96, v));
  const ego = clamp01(
    (archetype === "INDIVIDUALISTA" ? 0.78 : archetype === "VELOZ" ? 0.62 : archetype === "ESTRATEGISTA" ? 0.42 : archetype === "COLETIVISTA" ? 0.26 : 0.44) +
      relFor * 0.18 +
      jitter
  );
  const vision = clamp01(
    (archetype === "ESTRATEGISTA" ? 0.84 : archetype === "COLETIVISTA" ? 0.74 : archetype === "INDIVIDUALISTA" ? 0.38 : 0.52) +
      relTec * 0.22 -
      jitter * 0.5
  );
  const combativeness = clamp01(
    (archetype === "COMBATIVO" ? 0.86 : archetype === "GOLEIRO_LIBERO" ? 0.84 : archetype === "INDIVIDUALISTA" ? 0.58 : archetype === "VELOZ" ? 0.62 : 0.54) +
      relDef * 0.16 +
      relFis * 0.18 +
      jitter * 0.6
  );
  const roaming = clamp01(
    (archetype === "ESTRATEGISTA" ? 0.78 : archetype === "INDIVIDUALISTA" ? 0.74 : archetype === "VELOZ" ? 0.76 : archetype === "COLETIVISTA" ? 0.64 : 0.52) +
      relVel * 0.14 +
      jitter * 0.5
  );
  const shotInstinct = clamp01(
    (archetype === "INDIVIDUALISTA" ? 0.86 : archetype === "VELOZ" ? 0.72 : archetype === "ESTRATEGISTA" ? 0.64 : archetype === "COLETIVISTA" ? 0.54 : 0.56) +
      (role === "FW" ? 0.14 : role === "MF" ? 0.04 : -0.1) +
      relFor * 0.16 +
      (shCnt >= 2 ? 0.08 : 0) +
      jitter * 0.5
  );

  node.aiProfile = { archetype, ego, vision, combativeness, roaming, shotInstinct, seed };
  return node.aiProfile;
}

function computeNodeRoleTarget(node, pitch, carrier, chaserUid, coverUid, deepestOppDefX, deepestOwnDefX, isGkHolding = false, gkMarkMap = null, pressSupportUid = null, shadowMarkUid = null, markedNode = null) {
  const isUser = node.side === "user";
  const dir = isUser ? 1 : -1;
  const ownGoalX = isUser ? 4 : 96;
  const oppGoalX = isUser ? 96 : 4;
  const inPossession = pitch.ballSide === node.side;
  const ballX = pitch.ballFlight ? pitch.ballFlight.toX : pitch.passState ? pitch.passState.toX : pitch.ballX;
  const ballY = pitch.ballFlight ? pitch.ballFlight.toY : pitch.passState ? pitch.passState.toY : pitch.ballY;
  const t = pitch.simTime || 0;
  const tr = node.tacticalRole || node.role;
  const prof = getNodePersonality(node);
  const oppNodes = isUser ? pitch.oppNodes : pitch.userNodes;
  const ownNodes = isUser ? pitch.userNodes : pitch.oppNodes;

  // 1) Se está recebendo um passe em voo, avança com dash/sprint até encontrar a trajetória real da bola!
  if (pitch.ballMode === "PASS_FLIGHT" && pitch.passState && pitch.passState.receiverUid === node.uid) {
    const ps = pitch.passState;
    const curBallX = pitch.ballX ?? ps.toX;
    const curBallY = pitch.ballY ?? ps.toY;
    const meetBlend = ps.progress >= 0.45 ? Math.min(1, (ps.progress - 0.45) / 0.55) : 0;
    const aimX = ps.toX * (1 - meetBlend) + curBallX * meetBlend;
    const aimY = ps.toY * (1 - meetBlend) + curBallY * meetBlend;
    const distToMeet = Math.hypot(aimX - node.x, aimY - node.y);
    const isUrgent = Boolean(ps.isThroughBall || ps.isOneTwoPass || distToMeet >= 3.2);
    const sprintMult = distToMeet >= 6.0 ? 1.62 : isUrgent ? 1.46 : 1.28;
    if (isUrgent && distToMeet >= 4.0) {
      node.receiveDashUntil = Math.max(node.receiveDashUntil || 0, t + 0.24);
    }
    return {
      tx: Math.max(8, Math.min(92, aimX)),
      ty: Math.max(10, Math.min(90, aimY)),
      sprint: sprintMult
    };
  }

  // 1B) Bola solta rolando no gramado: recebedor e perseguidor mais próximo disparam (dash) para disputar a posse!
  if (pitch.ballMode === "LOOSE_BALL" && pitch.looseState) {
    const ls = pitch.looseState;
    const isBetaBall = typeof isBetaMode === "function" && isBetaMode();
    const rawDist = Math.hypot((pitch.ballX ?? 50) - node.x, (pitch.ballY ?? 50) - node.y);
    const lookT = isBetaBall ? Math.min(0.40, 0.14 + rawDist * 0.014) : 0.16;
    const predX = Math.max(6, Math.min(94, (pitch.ballX ?? 50) + (ls.vx || 0) * lookT));
    const predY = Math.max(9, Math.min(91, (pitch.ballY ?? 50) + (ls.vy || 0) * lookT));
    const gkSweepDepth = prof.archetype === "GOLEIRO_LIBERO" ? 21 : 17.5;
    const inOwnPenaltyBox = isUser ? predX <= gkSweepDepth && Math.abs(predY - 50) <= 25 : predX >= (100 - gkSweepDepth) && Math.abs(predY - 50) <= 25;

    if (tr === "GK" && inOwnPenaltyBox) {
      node.isGkRushing = true;
      return { tx: predX, ty: predY, sprint: 1.42 };
    }
    const isAttRunner = ls.receiverUid === node.uid || pitch.looseAttChaserUid === node.uid;
    const isDefRunner = pitch.looseDefChaserUid === node.uid;
    if ((isAttRunner || isDefRunner) && node.staggerTimer <= 0) {
      const distLoose = Math.hypot(predX - node.x, predY - node.y);
      if (distLoose >= 4.0) {
        node.receiveDashUntil = Math.max(node.receiveDashUntil || 0, t + 0.24);
      }
      const combBoost = 0.94 + prof.combativeness * 0.18;
      const urgentBoost = ((ls.age || 0) > 1.8 ? 1.72 : distLoose > 5.0 ? 1.62 : 1.45) * combBoost;
      return {
        tx: Math.max(8, Math.min(92, predX)),
        ty: Math.max(10, Math.min(90, predY)),
        sprint: Math.min(1.85, urgentBoost)
      };
    } else if (isBetaBall && tr === "DF" && !isAttRunner && !isDefRunner && prof.vision >= 0.62) {
      // Defensores com leitura tática seguram a linha de cobertura enquanto o cão de caça fecha a bola solta
      const coverX = isUser ? Math.min(44, Math.max(12, predX - 10)) : Math.max(56, Math.min(88, predX + 10));
      const coverY = Math.max(14, Math.min(86, node.baseY * 0.65 + predY * 0.35));
      return { tx: coverX, ty: coverY, sprint: 1.04 };
    }
  }

  // 2) Portador da bola: conduz livremente com base em instinto, personalidade, espaço e leitura do goleiro!
  if (carrier && carrier.uid === node.uid && pitch.ballMode === "CARRIED") {
    if (tr === "GK") {
      node.isGkRushing = false;
      return {
        tx: isUser ? 11.5 : 88.5,
        ty: Math.max(42, Math.min(58, node.baseY + (ballY - 50) * 0.25)),
        sprint: 0.72
      };
    }
    const defNodes = oppNodes;
    const oppGk = defNodes.find((d) => d.role === "GK");
    const laneAim = isUser && !pitch.is5v5 ? getTactics().lane : "balanced";

    // Personalidade define o corredor preferido de condução
    let carrierLaneY = 50 + Math.sin(t * (1.0 + prof.roaming * 0.55) + node.wanderPhase) * (13 + prof.roaming * 8);
    if (prof.archetype === "INDIVIDUALISTA") {
      // Corta para dentro buscando o eixo do gol para finalizar
      carrierLaneY = Math.abs(oppGoalX - node.x) < 34 ? (50 + (node.y < 50 ? -7 : 7)) : (node.y * 0.65 + 50 * 0.35);
    } else if (prof.archetype === "VELOZ") {
      // Explora corredor lateral aberto antes de diagonalizar para a área
      carrierLaneY = Math.abs(oppGoalX - node.x) > 25 ? (node.y < 50 ? 18 : 82) : (node.y < 50 ? 36 : 64);
    } else if (prof.archetype === "ESTRATEGISTA") {
      // Flutua pelo meio-espaço mantendo ângulos de passe dos dois lados
      carrierLaneY = 50 + Math.sin(t * 0.9 + node.wanderPhase) * 14;
    }

    if (laneAim === "wings") {
      const wingCorridorY = node.y < 50 ? 19 : 81;
      carrierLaneY = Math.abs(oppGoalX - node.x) > 22 ? wingCorridorY : (node.y < 50 ? 34 : 66);
    } else if (laneAim === "center") {
      carrierLaneY = 50 + Math.sin(t * 1.1 + node.wanderPhase) * 7;
    }

    // Não avança cegamente na cara do goleiro: para na zona ideal de chute (15-18m) e respeita distância segura do GK!
    const distToOppGk = oppGk ? Math.hypot(oppGk.x - node.x, oppGk.y - node.y) : 99;
    const stopBeforeGoal = prof.archetype === "INDIVIDUALISTA" ? 13.5 : 16.5;
    const pocketX = oppGoalX - dir * stopBeforeGoal;
    let steerX = pocketX - node.x;
    let steerY = carrierLaneY - node.y;
    const distGoal = Math.hypot(steerX, steerY) || 1;
    steerX /= distGoal;
    steerY /= distGoal;

    // Se o goleiro está próximo/saindo, abre lateralmente e recua levemente para fugir do abafa e ganhar ângulo de chute
    if (oppGk && distToOppGk < 15.5) {
      const avoidGkY = node.y >= oppGk.y ? 1 : -1;
      const gkPressure = (15.5 - distToOppGk) / 15.5;
      steerX -= dir * (0.65 + gkPressure * 1.15);
      steerY += avoidGkY * (1.05 + gkPressure * 0.95);
    }

    // Steering avoidance ao redor de marcadores próximos (sem empurrar o portador para cima do GK)
    const inShootingPocket = isUser ? node.x >= pocketX - 1.5 : node.x <= pocketX + 1.5;
    const dodgeSharpness = prof.archetype === "INDIVIDUALISTA" || prof.archetype === "VELOZ" ? 1.32 : 1.05;
    defNodes.forEach((d) => {
      if (d.role === "GK") return;
      const dx = node.x - d.x;
      const dy = node.y - d.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 0.1 && dist < 14.5) {
        const repulse = Math.pow((14.5 - dist) / 14.5, 1.35) * 1.85 * dodgeSharpness;
        let repX = (dx / dist) * repulse * 0.42;
        if (inShootingPocket && repX * dir > 0) repX *= 0.15;
        steerX += repX;
        steerY += (dy / dist) * repulse * 1.18;
      }
    });

    if (node.y < 15) steerY += 0.75;
    if (node.y > 85) steerY -= 0.75;

    const steerMag = Math.hypot(steerX, steerY) || 1;
    if (steerMag > 1.25) {
      steerX = (steerX / steerMag) * 1.25;
      steerY = (steerY / steerMag) * 1.25;
    }

    const carrierSprint = node.staggerTimer > 0
      ? 0.55
      : prof.archetype === "VELOZ"
      ? 1.12
      : prof.archetype === "INDIVIDUALISTA"
      ? 1.08
      : 1.03;

    const stepDist = Math.min(14, Math.max(3.5, distGoal));
    const maxUserTx = oppGk ? Math.max(Math.min(node.x - 1.0, 84), Math.min(84, oppGk.x - 7.5)) : 84;
    const minOppTx = oppGk ? Math.min(Math.max(node.x + 1.0, 16), Math.max(16, oppGk.x + 7.5)) : 16;
    const rawTx = node.x + steerX * stepDist;
    const rawTy = node.y + steerY * stepDist;

    return {
      tx: isUser ? Math.max(8, Math.min(maxUserTx, rawTx)) : Math.min(92, Math.max(minOppTx, rawTx)),
      ty: Math.max(11, Math.min(89, rawTy)),
      sprint: carrierSprint
    };
  }

  // 3) Goleiro sem bola: comando de área real — sai do gol para abafar/roubar se o atacante invadir a área!
  if (tr === "GK") {
    node.isGkRushing = false;
    const isOppCarrier = Boolean(carrier && carrier.side !== node.side && pitch.ballMode === "CARRIED");
    if (isOppCarrier && node.staggerTimer <= 0 && node.duelCooldown <= 0) {
      const boxLimitX = prof.archetype === "GOLEIRO_LIBERO" ? 24.5 : 21.5;
      const carrierInOwnBox = isUser
        ? carrier.x <= boxLimitX && Math.abs(carrier.y - 50) <= 27
        : carrier.x >= (100 - boxLimitX) && Math.abs(carrier.y - 50) <= 27;

      if (carrierInOwnBox) {
        const distCarrierToGk = Math.hypot(carrier.x - node.x, carrier.y - node.y);
        // Checa se há um zagueiro nosso bem posicionado entre o atacante e o gol
        const hasCloseShieldDef = ownNodes.some((d) => {
          if (d.role === "GK" || d.staggerTimer > 0) return false;
          const betweenGoal = isUser ? d.x < carrier.x + 1.5 : d.x > carrier.x - 1.5;
          return betweenGoal && Math.hypot(d.x - carrier.x, d.y - carrier.y) <= 5.2;
        });

        // Sai correndo para abafar se o atacante está livre na cara do gol OU entrou perto da área do GK!
        const veryCloseToGoal = isUser ? carrier.x <= 18.5 : carrier.x >= 81.5;
        if (!hasCloseShieldDef || veryCloseToGoal || distCarrierToGk <= 13.5) {
          node.isGkRushing = true;
          // Fecha o ângulo mirando diretamente no pé/trajetória do portador
          const leadX = carrier.x + (carrier.vx || 0) * 0.12;
          const leadY = carrier.y + (carrier.vy || 0) * 0.12;
          const clampRushX = isUser ? Math.max(5.5, Math.min(23, leadX)) : Math.min(94.5, Math.max(77, leadX));
          const clampRushY = Math.max(24, Math.min(76, leadY));
          return {
            tx: clampRushX,
            ty: clampRushY,
            sprint: prof.archetype === "GOLEIRO_LIBERO" ? 1.38 : 1.28
          };
        }
      }
    }

    // Posicionamento dinâmico fechando o ângulo conforme a bola se aproxima
    const ballNearOwnGoal = isUser ? Math.max(0, (42 - ballX) / 42) : Math.max(0, (ballX - 58) / 42);
    const stepUp = (prof.archetype === "GOLEIRO_LIBERO" ? 4.8 : 3.2) * (0.4 + ballNearOwnGoal * 0.6);
    const gx = isUser ? 6.0 + stepUp : 94.0 - stepUp;
    const gy = Math.max(37, Math.min(63, 50 + (ballY - 50) * (0.28 + ballNearOwnGoal * 0.16)));
    return { tx: gx, ty: gy, sprint: 0.96 };
  }

  // 4) Defendendo: marcação combativa, fechamento de chutes e dobras inteligentes!
  if (!inPossession) {
    if (isGkHolding) {
      const mark = gkMarkMap && gkMarkMap[node.uid];
      if (mark && node.staggerTimer <= 0) {
        return {
          tx: mark.tx,
          ty: mark.ty,
          sprint: 1.02
        };
      }
    }
    // Antecipação em voo de passe: defensor mais próximo fecha a linha do passe no ponto futuro!
    if (
      pitch.ballMode === "PASS_FLIGHT" &&
      pitch.passState &&
      !pitch.passState.isSafeProtectedPass &&
      (chaserUid === node.uid || coverUid === node.uid) &&
      node.staggerTimer <= 0
    ) {
      const ps = pitch.passState;
      const isBetaAir = typeof isBetaMode === "function" && isBetaMode() && (Number(ps.peakZ) || 0) >= 0.60;
      const predFrac = isBetaAir
        ? (chaserUid === node.uid ? 0.88 : 0.95)
        : (chaserUid === node.uid ? 0.65 : 0.85);
      const cutX = (ps.fromX ?? ballX) * (1 - predFrac) + (ps.toX ?? ballX) * predFrac;
      const cutY = (ps.fromY ?? ballY) * (1 - predFrac) + (ps.toY ?? ballY) * predFrac;
      const iqBoost = (typeof isBetaMode === "function" && isBetaMode() && prof.vision >= 0.72) ? 0.08 : 0;
      return {
        tx: Math.max(8, Math.min(92, cutX)),
        ty: Math.max(10, Math.min(90, cutY)),
        sprint: Math.min(1.44, 1.06 + prof.combativeness * 0.16 + prof.vision * 0.14 + iqBoost)
      };
    }

    const targetAnchorX = carrier ? carrier.x + (carrier.vx || 0) * 0.22 : ballX;
    const targetAnchorY = carrier ? carrier.y + (carrier.vy || 0) * 0.22 : ballY;
    const dangerousZone = isUser ? ballX <= 42 : ballX >= 58;
    const isPressingMarked = Boolean(isUser && markedNode && carrier && carrier.uid === markedNode.uid);
    const pressSprint = 1.04 + prof.combativeness * 0.16 + (isPressingMarked ? 0.08 : 0);

    // Previsão de alvo de passe: encontra o atacante rival livre mais perigoso para fechar a linha
    const dangerOpp = oppNodes
      .filter((o) => o.role !== "GK" && (!carrier || o.uid !== carrier.uid))
      .sort((a, b) => Math.hypot(a.x - ownGoalX, a.y - 50) - Math.hypot(b.x - ownGoalX, b.y - 50))[0] || null;

    if (!isGkHolding && chaserUid === node.uid && node.staggerTimer <= 0) {
      return {
        tx: Math.max(8, Math.min(92, targetAnchorX)),
        ty: Math.max(10, Math.min(90, targetAnchorY)),
        sprint: pressSprint
      };
    }
    if (!isGkHolding && coverUid === node.uid && node.staggerTimer <= 0) {
      if (dangerousZone || isPressingMarked) {
        const flankOffset = carrier && carrier.y < 50 ? (isPressingMarked ? 2.6 : 3.5) : (isPressingMarked ? -2.6 : -3.5);
        return {
          tx: Math.max(8, Math.min(92, targetAnchorX + (isUser ? -1.8 : 1.8))),
          ty: Math.max(12, Math.min(88, targetAnchorY + flankOffset)),
          sprint: Math.max(1.04, pressSprint * 0.97)
        };
      }
      if (dangerOpp && carrier) {
        const laneX = carrier.x * 0.42 + dangerOpp.x * 0.46 + ownGoalX * 0.12;
        const laneY = carrier.y * 0.40 + dangerOpp.y * 0.48 + 50 * 0.12;
        return {
          tx: Math.max(8, Math.min(92, laneX)),
          ty: Math.max(12, Math.min(88, laneY)),
          sprint: 0.98 + prof.combativeness * 0.10 + prof.vision * 0.06
        };
      }
      return {
        tx: Math.max(8, Math.min(92, targetAnchorX * 0.78 + ownGoalX * 0.22)),
        ty: Math.max(12, Math.min(88, targetAnchorY * 0.76 + 50 * 0.24)),
        sprint: 0.95 + prof.combativeness * 0.08
      };
    }
    // Marcação Especial (sombra próxima entre o craque rival marcado e o gol do usuário)
    if (!isGkHolding && isUser && shadowMarkUid === node.uid && markedNode && node.staggerTimer <= 0) {
      const shTx = Math.max(10, Math.min(88, markedNode.x - 3.2));
      const shTy = Math.max(11, Math.min(89, markedNode.y + (50 - markedNode.y) * 0.12));
      return {
        tx: shTx,
        ty: shTy,
        sprint: 1.05 + prof.combativeness * 0.1
      };
    }
    // 3º marcador combativo fecha linha de passe do atacante mais perigoso ou ajuda na dobra!
    if (!isGkHolding && pressSupportUid === node.uid && (dangerousZone || dangerOpp) && node.staggerTimer <= 0) {
      const refX = dangerOpp && carrier ? (carrier.x * 0.35 + dangerOpp.x * 0.50 + ownGoalX * 0.15) : (targetAnchorX * 0.62 + ownGoalX * 0.38);
      const refY = dangerOpp && carrier ? (carrier.y * 0.35 + dangerOpp.y * 0.50 + 50 * 0.15) : (targetAnchorY * 0.65 + (node.baseY < 50 ? 32 : 68) * 0.35);
      return {
        tx: Math.max(10, Math.min(90, refX)),
        ty: Math.max(12, Math.min(88, refY)),
        sprint: 0.99 + prof.combativeness * 0.12
      };
    }
  }

  // Helper de movimentação livre & desmarcação ativa no ataque baseada na personalidade do jogador!
  const applyPersonalityAttackFreedom = (rawTx, rawTy, baseSprint, allowDeepRun = true) => {
    let tx = rawTx;
    let ty = rawTy;
    let sp = baseSprint;

    // 1. Movimento orgânico por personalidade
    const roamAmp = 4 + prof.roaming * 10;
    const waveA = Math.sin(t * (0.9 + prof.seed * 0.7) + node.wanderPhase);
    const waveB = Math.cos(t * (0.65 + prof.seed * 0.5) + node.wanderPhase * 1.4);

    if (prof.archetype === "ESTRATEGISTA") {
      // Flutua nos meios-espaços buscando linha de passe limpa
      tx += dir * waveB * 6.5;
      ty += waveA * (roamAmp * 0.95);
      sp += 0.04;
    } else if (prof.archetype === "COLETIVISTA" && carrier && carrier.uid !== node.uid) {
      // Aproxima em triângulo de apoio (12-18m) para tabela rápida
      const distC = Math.hypot(carrier.x - node.x, carrier.y - node.y);
      if (distC > 19 && distC < 44) {
        const supportX = carrier.x + dir * (6 + prof.seed * 6);
        const supportY = carrier.y + (node.baseY < carrier.y ? -12 : 12);
        tx = tx * 0.52 + supportX * 0.48;
        ty = ty * 0.52 + supportY * 0.48;
        sp += 0.06;
      }
    } else if (prof.archetype === "INDIVIDUALISTA" && allowDeepRun) {
      // Corta em diagonal para atacar a entrada da área e pedir bola em condição de chute
      tx += dir * (4.5 + prof.ego * 5);
      ty = ty * 0.78 + (50 + (node.baseY < 50 ? -11 : 11)) * 0.22 + waveA * 5;
      sp += 0.07;
    } else if (prof.archetype === "VELOZ" && allowDeepRun) {
      // Espeta em velocidade buscando espaço nas costas da defesa
      tx += dir * (6 + prof.roaming * 5);
      ty += waveA * 8;
      sp += 0.1;
    } else if (prof.archetype === "COMBATIVO") {
      // Chega de trás como elemento surpresa / garante rebote na entrada da área
      tx += dir * (waveB > 0 ? 5.5 : -2.5);
      ty += waveA * 5;
      sp += 0.05;
    }

    // 2. Desmarcação ativa: se há marcador colado (< 9.5m), descola para espaço livre!
    let closestMark = null;
    let closestMarkDist = 99;
    oppNodes.forEach((d) => {
      if (d.role === "GK") return;
      const dd = Math.hypot(node.x - d.x, node.y - d.y);
      if (dd < closestMarkDist) {
        closestMarkDist = dd;
        closestMark = d;
      }
    });
    if (closestMark && closestMarkDist < 9.5 && closestMarkDist > 0.1) {
      const peelStrength = ((9.5 - closestMarkDist) / 9.5) * (4.5 + prof.roaming * 5.5);
      tx += ((node.x - closestMark.x) / closestMarkDist) * peelStrength * 0.65;
      ty += ((node.y - closestMark.y) / closestMarkDist) * peelStrength * 1.15;
    }

    // 3. No 11x11 respeita a linha de impedimento para não ficar na banheira
    if (!pitch.is5v5) {
      const legalMaxX = isUser ? Math.min(88, Math.max(52, deepestOppDefX - 0.7)) : Math.max(12, Math.min(48, deepestOppDefX + 0.7));
      if (isUser) tx = Math.min(legalMaxX, tx);
      else tx = Math.max(legalMaxX, tx);
    }

    return {
      tx: Math.max(10, Math.min(90, tx)),
      ty: Math.max(11, Math.min(89, ty)),
      sprint: Math.min(1.16, sp)
    };
  };

  // 5) Posicionamento tático fluido por função (com bola vs sem bola)
  const ballShift = (ballX - 50) * 0.36;
  const latPull = (ballY - 50) * (inPossession ? 0.26 : 0.38);

  if (tr === "CB" || tr === "LIB") {
    if (inPossession) {
      const pushDepth = tr === "LIB" || prof.archetype === "ESTRATEGISTA" ? 15 : 9;
      const maxHoldX = isUser ? 56 : 44;
      const rawX = node.baseX + dir * pushDepth + ballShift * 0.65;
      const clampedX = isUser ? Math.min(maxHoldX, Math.max(16, rawX)) : Math.max(maxHoldX, Math.min(84, rawX));
      return applyPersonalityAttackFreedom(clampedX, Math.max(16, Math.min(84, node.baseY + latPull * 0.55)), 0.8, false);
    } else {
      const combStep = prof.combativeness > 0.72 ? dir * 3.5 : 0;
      const holdX = isUser
        ? Math.max(13, Math.min(node.baseX + 5 + combStep, ballX - 7))
        : Math.min(87, Math.max(node.baseX - 5 + combStep, ballX + 7));
      const tuckY = node.baseY * 0.72 + ballY * 0.28;
      return { tx: holdX, ty: Math.max(14, Math.min(86, tuckY)), sprint: 0.9 + prof.combativeness * 0.08 };
    }
  }

  if (tr === "FB" || tr === "WB") {
    const sameFlankAsBall = (node.baseY < 50 && ballY < 54) || (node.baseY >= 50 && ballY >= 46);
    if (inPossession) {
      const overlapBoost = sameFlankAsBall ? (tr === "WB" || prof.archetype === "VELOZ" ? 28 : 22) : tr === "WB" ? 16 : 12;
      const rawX = node.baseX + dir * overlapBoost + ballShift * 0.45;
      const wideY = node.baseY < 50 ? Math.min(18, node.baseY) : Math.max(82, node.baseY);
      return applyPersonalityAttackFreedom(Math.max(14, Math.min(86, rawX)), wideY, sameFlankAsBall ? 1.0 : 0.86, true);
    } else {
      const holdX = isUser
        ? Math.max(13, Math.min(node.baseX + 4, ballX - 5))
        : Math.min(87, Math.max(node.baseX - 4, ballX + 5));
      const trackY = node.baseY * 0.8 + ballY * 0.2;
      return { tx: holdX, ty: Math.max(10, Math.min(90, trackY)), sprint: 0.92 + prof.combativeness * 0.08 };
    }
  }

  if (tr === "DM") {
    if (inPossession) {
      const pivotX = Math.max(18, Math.min(82, ballX - dir * (prof.archetype === "ESTRATEGISTA" ? 10 : 13)));
      const oppSideY = ballY < 50 ? 56 : 44;
      return applyPersonalityAttackFreedom(pivotX, node.baseY * 0.55 + oppSideY * 0.45, 0.86, false);
    } else {
      const shieldX = isUser ? deepestOwnDefX + 10 : deepestOwnDefX - 10;
      return {
        tx: Math.max(18, Math.min(82, shieldX * 0.58 + ballX * 0.42)),
        ty: Math.max(22, Math.min(78, 50 + (ballY - 50) * 0.48)),
        sprint: 0.92 + prof.combativeness * 0.1
      };
    }
  }

  if (tr === "CM" || tr === "WM") {
    if (inPossession) {
      const adv = tr === "WM" ? 17 : 12;
      const wobble = Math.sin(t * 1.15 + node.wanderPhase) * 7;
      const wideY =
        tr === "WM"
          ? node.baseY < 50
            ? 17
            : 83
          : Math.max(18, Math.min(82, node.baseY + latPull * 0.5 + wobble));
      return applyPersonalityAttackFreedom(Math.max(18, Math.min(84, node.baseX + dir * adv + ballShift * 0.55)), wideY, 0.9, true);
    } else {
      return {
        tx: Math.max(16, Math.min(84, node.baseX - dir * 4 + ballShift * 0.58)),
        ty: Math.max(14, Math.min(86, node.baseY + latPull * 0.62)),
        sprint: 0.88 + prof.combativeness * 0.1
      };
    }
  }

  if (tr === "AM") {
    if (inPossession) {
      const holeX = isUser ? Math.min(81, Math.max(54, deepestOppDefX - 7)) : Math.max(19, Math.min(46, deepestOppDefX + 7));
      const probeY = 50 + Math.sin(t * 1.35 + node.wanderPhase) * 16 + (ballY < 50 ? 6 : -6);
      return applyPersonalityAttackFreedom(holeX, Math.max(20, Math.min(80, probeY)), 0.95, true);
    } else {
      return {
        tx: Math.max(22, Math.min(78, ballX * 0.48 + node.baseX * 0.52)),
        ty: Math.max(22, Math.min(78, ballY * 0.48 + 50 * 0.52)),
        sprint: 0.86 + prof.combativeness * 0.08
      };
    }
  }

  if (tr === "WING") {
    const ballOnOppositeFlank = (node.baseY < 50 && ballY > 56) || (node.baseY >= 50 && ballY < 44);
    if (inPossession) {
      const maxLegalPushX = pitch.is5v5
        ? (isUser ? 89 : 11)
        : (isUser ? Math.min(88, Math.max(52, deepestOppDefX - 0.5)) : Math.max(12, Math.min(48, deepestOppDefX + 0.5)));
      const pushX = isUser
        ? Math.min(maxLegalPushX, Math.max(66, deepestOppDefX - 0.5))
        : Math.max(maxLegalPushX, Math.min(34, deepestOppDefX + 0.5));
      const targetY = ballOnOppositeFlank
        ? node.baseY < 50
          ? 33
          : 67
        : node.baseY < 50
        ? 14
        : 86;
      return applyPersonalityAttackFreedom(pushX, targetY, 0.99, true);
    } else {
      return {
        tx: Math.max(20, Math.min(80, ballX - dir * 5)),
        ty: Math.max(14, Math.min(86, node.baseY * 0.7 + ballY * 0.3)),
        sprint: 0.85 + prof.combativeness * 0.09
      };
    }
  }

  // ST (CA / ATA): espeta na última linha defensiva com movimentação livre e desmarcação!
  if (inPossession) {
    let lineX;
    if (pitch.is5v5) {
      lineX = isUser
        ? Math.min(90, Math.max(66, deepestOppDefX + 1.2))
        : Math.max(10, Math.min(34, deepestOppDefX - 1.2));
    } else {
      const isPastDefLine = isUser ? node.x >= deepestOppDefX - 0.2 : node.x <= deepestOppDefX + 0.2;
      const legalHoldX = isUser
        ? Math.min(87, Math.max(52, deepestOppDefX - 0.8))
        : Math.max(13, Math.min(48, deepestOppDefX + 0.8));

      lineX = isPastDefLine ? legalHoldX : (isUser ? Math.min(legalHoldX, node.baseX + 17) : Math.max(legalHoldX, node.baseX - 17));
    }
    const runY = node.baseY + Math.sin(t * 1.55 + node.wanderPhase) * 14;
    return applyPersonalityAttackFreedom(lineX, Math.max(22, Math.min(78, runY)), 1.0, true);
  } else {
    if (isGkHolding) {
      const holdX = isUser ? Math.min(72, Math.max(46, ballX - 20)) : Math.max(28, Math.min(54, ballX + 20));
      return {
        tx: holdX,
        ty: Math.max(20, Math.min(80, node.baseY * 0.7 + ballY * 0.3)),
        sprint: 0.9
      };
    }
    return {
      tx: Math.max(18, Math.min(82, ballX + dir * 4)),
      ty: Math.max(24, Math.min(76, ballY * 0.55 + node.baseY * 0.45)),
      sprint: 0.84 + prof.combativeness * 0.09
    };
  }
}

function recomputePitchTargets(pitch) {
  if (!pitch) return;
  const carrier = findPitchNode(pitch, pitch.carrierUid);
  const attIsUser = pitch.ballSide === "user";
  const attNodes = attIsUser ? pitch.userNodes : pitch.oppNodes;
  const defNodes = attIsUser ? pitch.oppNodes : pitch.userNodes;
  const isGkHolding = Boolean(carrier && carrier.role === "GK" && pitch.ballMode === "CARRIED");

  const userBackLine = Math.min(...pitch.userNodes.filter((n) => n.role !== "GK").map((n) => n.x));
  const oppBackLine = Math.max(...pitch.oppNodes.filter((n) => n.role !== "GK").map((n) => n.x));

  const ballRefX = pitch.ballMode === "LOOSE_BALL" && pitch.looseState
    ? Math.max(6, Math.min(94, (pitch.ballX ?? 50) + (pitch.looseState.vx || 0) * 0.14))
    : pitch.passState
    ? pitch.passState.toX
    : pitch.ballX;
  const ballRefY = pitch.ballMode === "LOOSE_BALL" && pitch.looseState
    ? Math.max(9, Math.min(91, (pitch.ballY ?? 50) + (pitch.looseState.vy || 0) * 0.14))
    : pitch.passState
    ? pitch.passState.toY
    : pitch.ballY;

  const gkSafeMinX = attIsUser ? 22 : 10;
  const gkSafeMaxX = attIsUser ? 90 : 78;
  const enforceGkSafeTarget = (rawX, rawY) => {
    let sx = Math.max(gkSafeMinX, Math.min(gkSafeMaxX, rawX));
    let sy = Math.max(10, Math.min(90, rawY));
    if (carrier) {
      const dx = sx - carrier.x;
      const dy = sy - carrier.y;
      const d = Math.hypot(dx, dy);
      if (d < 13 && Math.abs(dy) < 13) {
        const awayX = attIsUser ? 1 : -1;
        const reqDx = Math.sqrt(Math.max(0, 13.2 * 13.2 - dy * dy));
        sx = carrier.x + awayX * reqDx;
        sx = Math.max(10, Math.min(90, Math.max(gkSafeMinX, Math.min(gkSafeMaxX, sx))));
      }
    }
    return { tx: Number(sx.toFixed(1)), ty: Number(sy.toFixed(1)) };
  };

  let chaserUid = null;
  let coverUid = null;
  let pressSupportUid = null;
  let gkMarkMap = null;

  if (isGkHolding) {
    pitch.chaserUid = null;
    pitch.challengerUid = null;

    const rolePri = (r) => (r === "DF" ? 0 : r === "MF" ? 1 : 2);
    const gkOutlets = attNodes
      .filter((n) => n.role !== "GK")
      .map((n) => ({
        node: n,
        pri: rolePri(n.role),
        dGk: Math.hypot(n.x - carrier.x, n.y - carrier.y)
      }))
      .sort((a, b) => a.pri - b.pri || a.dGk - b.dGk)
      .map((e) => e.node);

    const pressCandidates = defNodes
      .filter((d) => d.role !== "GK")
      .map((d) => ({
        node: d,
        dGk: Math.hypot(d.x - carrier.x, d.y - carrier.y)
      }))
      .sort((a, b) => a.dGk - b.dGk)
      .map((e) => e.node);

    const maxMarkers = pitch.is5v5 ? 2 : 4;
    const outletPool = gkOutlets.slice(0, Math.min(gkOutlets.length, maxMarkers + 2));
    const usedOutlets = new Set();
    gkMarkMap = {};

    pressCandidates.slice(0, maxMarkers).forEach((marker) => {
      let bestOutlet = null;
      let bestDist = Infinity;
      outletPool.forEach((out) => {
        if (usedOutlets.has(out.uid)) return;
        const dist = Math.hypot(out.x - marker.x, out.y - marker.y);
        if (dist < bestDist) {
          bestDist = dist;
          bestOutlet = out;
        }
      });
      if (!bestOutlet) return;
      usedOutlets.add(bestOutlet.uid);
      const rawTx = bestOutlet.x * 0.84 + carrier.x * 0.16;
      const rawTy = bestOutlet.y * 0.84 + carrier.y * 0.16;
      gkMarkMap[marker.uid] = enforceGkSafeTarget(rawTx, rawTy);
    });
  } else {
    // Combatividade influencia quem se antecipa para pressionar o portador!
    const rankedDefs = defNodes
      .filter((d) => d.role !== "GK" && (d.staggerTimer || 0) <= 0)
      .map((d) => {
        const prof = getNodePersonality(d);
        const rawDist = Math.hypot(d.x - (carrier ? carrier.x : ballRefX), (d.y - (carrier ? carrier.y : ballRefY)) * 1.1);
        const combBias = prof.combativeness * 3.2;
        return {
          uid: d.uid,
          dist: rawDist,
          effDist: rawDist - combBias
        };
      })
      .sort((a, b) => a.effDist - b.effDist);

    chaserUid = rankedDefs[0]?.uid || null;
    coverUid = rankedDefs[1]?.uid || null;
    pressSupportUid = rankedDefs[2]?.uid || null;
    pitch.chaserUid = chaserUid;
    pitch.challengerUid = carrier && chaserUid && rankedDefs[0].dist < 10.5 ? chaserUid : null;
  }

  // Marcação Especial (Scout): seleciona marcador sombra quando o craque rival marcado está sem bola no campo defensivo
  let markedNode = null;
  let shadowMarkUid = null;
  if (!isGkHolding && !pitch.is5v5 && pitch.ballSide === "opp") {
    const markedId = getTactics().markedOppId;
    if (markedId) {
      markedNode = (pitch.oppNodes || []).find((n) => n.role !== "GK" && n.player?.id === markedId) || null;
      if (markedNode && carrier?.uid !== markedNode.uid && markedNode.x <= 58) {
        const shadowCand = (pitch.userNodes || [])
          .filter((d) => d.role !== "GK" && d.uid !== chaserUid && (d.staggerTimer || 0) <= 0)
          .sort((a, b) => {
            const rolePriA = a.role === "DF" || a.tacticalRole === "DM" ? 0 : 1;
            const rolePriB = b.role === "DF" || b.tacticalRole === "DM" ? 0 : 1;
            const da = Math.hypot(a.x - markedNode.x, a.y - markedNode.y) + rolePriA * 4;
            const db = Math.hypot(b.x - markedNode.x, b.y - markedNode.y) + rolePriB * 4;
            return da - db;
          })[0];
        if (shadowCand) shadowMarkUid = shadowCand.uid;
      }
    }
  }

  if (pitch.ballMode === "LOOSE_BALL" && pitch.looseState) {
    const attTeamNodes = attIsUser ? pitch.userNodes : pitch.oppNodes;
    const defTeamNodes = attIsUser ? pitch.oppNodes : pitch.userNodes;
    const recNode = findPitchNode(pitch, pitch.looseState.receiverUid);
    const rankLoose = (list) =>
      list
        .filter((n) => n.role !== "GK" && (n.staggerTimer || 0) <= 0)
        .sort((a, b) => {
          const da = Math.hypot(a.x - ballRefX, a.y - ballRefY) - getNodePersonality(a).combativeness * 2.4;
          const db = Math.hypot(b.x - ballRefX, b.y - ballRefY) - getNodePersonality(b).combativeness * 2.4;
          return da - db;
        })[0];
    const bestAtt = (recNode && recNode.role !== "GK" && (recNode.staggerTimer || 0) <= 0)
      ? recNode
      : rankLoose(attTeamNodes);
    const bestDef = rankLoose(defTeamNodes);
    pitch.looseAttChaserUid = bestAtt?.uid || null;
    pitch.looseDefChaserUid = bestDef?.uid || null;
  } else {
    pitch.looseAttChaserUid = null;
    pitch.looseDefChaserUid = null;
  }

  const assignTeamTargets = (teamNodes, deepestOwnDef, deepestOppDef) => {
    teamNodes.forEach((node) => {
      const aim = computeNodeRoleTarget(
        node,
        pitch,
        carrier,
        chaserUid,
        coverUid,
        deepestOppDef,
        deepestOwnDef,
        isGkHolding,
        gkMarkMap,
        pressSupportUid,
        shadowMarkUid,
        markedNode
      );
      node.targetX = aim.tx;
      node.targetY = aim.ty;
      node.targetSprint = aim.sprint || 0.9;
      const isBallChaser =
        (pitch.ballMode === "PASS_FLIGHT" && pitch.passState?.receiverUid === node.uid) ||
        (pitch.ballMode === "LOOSE_BALL" && (
          pitch.looseState?.receiverUid === node.uid ||
          pitch.looseAttChaserUid === node.uid ||
          pitch.looseDefChaserUid === node.uid
        ));
      if (node.side === "user" && node.role !== "GK" && !pitch.is5v5 && node.uid !== pitch.carrierUid && !isBallChaser) {
        const tac = getTactics();
        if (tac.posture === "defensive") {
          node.targetX = Math.max(10, node.targetX - 7);
        } else if (tac.posture === "offensive" && !(isGkHolding && pitch.ballSide !== "user")) {
          const maxAttackX =
            pitch.ballSide === "user" && (node.role === "FW" || node.tacticalRole === "WING" || node.tacticalRole === "ST")
              ? Math.min(89, Math.max(52, deepestOppDef - 0.6))
              : 90;
          node.targetX = Math.min(maxAttackX, node.targetX + 7);
        }
        if (tac.lane === "wings" && (node.role === "MF" || node.role === "FW")) {
          const sideBias = node.baseY < 48 ? -1 : node.baseY > 52 ? 1 : node.y <= 50 ? -1 : 1;
          const wingFactor = Math.abs(node.targetY - 50) < 6 ? 0.5 : 1;
          node.targetY = Math.max(10, Math.min(90, node.targetY + sideBias * 6 * wingFactor));
        } else if (tac.lane === "center" && (node.role === "MF" || node.role === "FW")) {
          node.targetY = node.targetY * 0.72 + 50 * 0.28;
        }
      } else if (node.side === "opp" && node.role !== "GK" && !pitch.is5v5 && node.uid !== pitch.carrierUid && !isBallChaser) {
        const oppPost = getOpponentDynamicPosture();
        if (oppPost === "offensive" && !(isGkHolding && pitch.ballSide !== "opp")) {
          const minOppX =
            pitch.ballSide === "opp" && (node.role === "FW" || node.tacticalRole === "WING" || node.tacticalRole === "ST")
              ? Math.max(11, Math.min(48, deepestOppDef + 0.6))
              : 10;
          node.targetX = Math.max(minOppX, node.targetX - 5);
        } else if (oppPost === "defensive") node.targetX = Math.min(90, node.targetX + 5);
      }

      // Garantia final: enquanto um goleiro segura a bola, nenhum marcador entra na área ou cola nele
      if (isGkHolding && node.role !== "GK" && node.side !== pitch.ballSide) {
        const safe = enforceGkSafeTarget(node.targetX, node.targetY);
        node.targetX = safe.tx;
        node.targetY = safe.ty;
      }
    });
  };

  assignTeamTargets(pitch.userNodes, userBackLine, oppBackLine);
  assignTeamTargets(pitch.oppNodes, oppBackLine, userBackLine);
}

function showPitchBadge(pitch, x, y, text, cls = "badge-pass", durationMs = 750, iconCat = null) {
  if (!pitch) return;
  pitch.floatBadge = {
    x: Math.max(12, Math.min(88, x)),
    y: Math.max(18, Math.min(86, y)),
    text,
    iconCat,
    cls,
    until: performance.now() + durationMs
  };
}

function showNodeBadge(pitch, uid, text, cls = "badge-dribble", durationMs = 1450, iconCat = null) {
  if (!pitch || !uid) return;
  if (!pitch.nodeBadges) pitch.nodeBadges = {};
  const scaled =
    state.simSpeed === 4 ? Math.min(340, durationMs) : state.simSpeed === 2 ? Math.round(durationMs * 0.5) : durationMs;
  pitch.nodeBadges[uid] = {
    text,
    iconCat,
    cls,
    until: performance.now() + scaled
  };
}

function syncNodeBadgesDOM(pitch, now) {
  if (!pitch) return;
  const allNodes = [...pitch.userNodes, ...pitch.oppNodes];
  allNodes.forEach((node) => {
    const badgeEl = document.getElementById(`pbadge-${node.uid}`);
    if (!badgeEl) return;
    const nb = pitch.nodeBadges ? pitch.nodeBadges[node.uid] : null;
    if (nb && now < nb.until) {
      const edgeCls = [
        node.y < 25 ? "pos-below" : "",
        node.x < 22 ? "pos-left" : node.x > 78 ? "pos-right" : ""
      ]
        .filter(Boolean)
        .join(" ");
      const nextClass = `pitch-token-action-badge ${nb.cls} ${edgeCls} is-visible`;
      if (badgeEl.className !== nextClass) badgeEl.className = nextClass;
      const rKey = `${nb.iconCat || ""}|${nb.text}`;
      if (badgeEl.dataset.renderKey !== rKey) {
        badgeEl.dataset.renderKey = rKey;
        const iconHTML = nb.iconCat ? renderPitchIconTag(nb.iconCat, "badge-move-icon") : "";
        badgeEl.innerHTML = `${iconHTML}<span>${nb.text}</span>`;
      }
    } else {
      if (badgeEl.className !== "pitch-token-action-badge") {
        badgeEl.className = "pitch-token-action-badge";
      }
    }
  });
}

function startBallFlight(pitch, fromX, fromY, toX, toY, durationMs, arcHeight = 2.6, kind = "PASS", trailColor = "#4ade80", opts = null) {
  if (!pitch) return;
  const now = performance.now();
  const dur = Math.max(55, durationMs);
  const isShot = kind === "SHOT" || kind === "GOAL";
  // Disparo direto reto sem arco para chutes a gol
  const actualArc = isShot || kind === "CONTROL" ? 0 : arcHeight;
  const linearShot = Boolean(opts?.linear);
  pitch.ballFlight = {
    fromX,
    fromY,
    toX,
    toY,
    start: now,
    duration: dur,
    arcHeight: actualArc,
    kind,
    linear: linearShot,
    isSpecial: Boolean(opts?.isSpecial),
    elem: opts?.elem || null
  };
  if (kind !== "CONTROL") {
    const trailFromX = typeof opts?.trailOriginX === "number" ? opts.trailOriginX : fromX;
    const trailFromY = typeof opts?.trailOriginY === "number" ? opts.trailOriginY : fromY;
    pitch.passTrail = {
      fromX: trailFromX,
      fromY: trailFromY,
      toX,
      toY,
      curX: fromX,
      curY: fromY,
      peakZ: 0,
      progress: 0,
      frozenPathD: null,
      isShot: Boolean(isShot),
      color: trailColor,
      start: now,
      flightDuration: dur,
      fadeUntil: now + dur + 460
    };
  }
}

function getSpeedMultiplier() {
  if (state.simSpeed === 4) return 7.0;
  if (state.simSpeed === 2) return 2.4;
  return 1.0;
}

function resolveDynamicNodeSprite(node, pitch) {
  const p = node?.player;
  if (!p) return "";
  const fs = p.formSprites;
  if (fs && fs.ATK && fs.DEF) {
    const isUser = node.side === "user";
    const dir = isUser ? 1 : -1;
    const inAtkHalf = isUser ? node.x >= 47 : node.x <= 53;
    const hasBall = pitch && (pitch.carrierUid === node.uid || pitch.dashFx?.uid === node.uid);
    const teamAttacking = pitch && pitch.ballSide === node.side;
    if (hasBall || (teamAttacking && (inAtkHalf || node.role === "FW" || (node.vx || 0) * dir > 2.0))) {
      return fs.ATK;
    }
    if (!teamAttacking || !inAtkHalf) {
      return fs.DEF;
    }
  }
  return getPlayerFormSprite(p, node.role);
}

function renderPitchDOMFrame(pitch, st, now) {
  // 1) Animações de dash (drible) e repulsão da onda de choque (roubo), inclusive durante a pausa breve
  if (pitch.dashFx) {
    const df = pitch.dashFx;
    const dNode = findPitchNode(pitch, df.uid);
    const t = Math.min(1, Math.max(0, (now - df.start) / df.duration));
    const eased = 1 - Math.pow(1 - t, 3);
    if (dNode) {
      dNode.x = df.fromX + (df.toX - df.fromX) * eased;
      dNode.y = df.fromY + (df.toY - df.fromY) * eased;
      const dir = dNode.side === "user" ? 1 : -1;
      pitch.ballX = dNode.x + dir * 2.0;
      pitch.ballY = dNode.y + 0.9;
      if (pitch.passTrail && pitch.passTrail.isDash) {
        pitch.passTrail.curX = dNode.x;
        pitch.passTrail.curY = dNode.y;
        pitch.passTrail.fadeUntil = Math.max(pitch.passTrail.fadeUntil, now + 380);
      }
    }
    if (t >= 1) pitch.dashFx = null;
  }

  if (pitch.pushTweens && pitch.pushTweens.length > 0) {
    pitch.pushTweens = pitch.pushTweens.filter((pt) => {
      const t = Math.min(1, Math.max(0, (now - pt.start) / pt.duration));
      const eased = 1 - Math.pow(1 - t, 2.5);
      pt.node.x = pt.fromX + (pt.toX - pt.fromX) * eased;
      pt.node.y = pt.fromY + (pt.toY - pt.fromY) * eased;
      return t < 1;
    });
  }

  if (pitch.interceptTweens && pitch.interceptTweens.length > 0) {
    pitch.interceptTweens = pitch.interceptTweens.filter((tw) => {
      const t = Math.min(1, Math.max(0, (now - tw.start) / tw.duration));
      const eased = 1 - Math.pow(1 - t, 2.4);
      tw.node.x = tw.fromX + (tw.toX - tw.fromX) * eased;
      tw.node.y = tw.fromY + (tw.toY - tw.fromY) * eased;
      return t < 1;
    });
  }

  const activeDashUid = pitch.dashFx ? pitch.dashFx.uid : null;
  const simClock = pitch.simTime || 0;
  const betaOn = typeof isBetaMode === "function" && isBetaMode();
  const activeCoopFreeze = betaOn && pitch.coopFreeze && now < pitch.coopFreeze.start + pitch.coopFreeze.duration ? pitch.coopFreeze : null;
  if (!activeCoopFreeze && pitch.coopFreeze) pitch.coopFreeze = null;
  const coopStarSet = activeCoopFreeze
    ? new Set([activeCoopFreeze.shooterUid, ...(activeCoopFreeze.partnerUids || [])])
    : null;
  const pitchFieldEl = document.getElementById("live-pitch-world") || document.querySelector(".pitch-world");
  if (pitchFieldEl) {
    pitchFieldEl.classList.toggle("is-coop-freeze", Boolean(activeCoopFreeze));
  }
  const coopBannerEl = document.getElementById("pitch-coop-banner");
  if (coopBannerEl) {
    if (activeCoopFreeze) {
      coopBannerEl.style.display = "flex";
      coopBannerEl.innerHTML = `<span class="coop-banner-tier">⚡ TÉCNICA EM ${activeCoopFreeze.tier}</span><strong>【${activeCoopFreeze.moveName}】</strong>`;
    } else {
      coopBannerEl.style.display = "none";
    }
  }

  const stepDomNode = (node) => {
    const el = document.getElementById(`pnode-${node.uid}`);
    if (el) {
      let jZ = 0;
      if (betaOn && (node.jumpDurationMs || 0) > 0 && (node.jumpStartMs || 0) > 0) {
        const jp = (now - node.jumpStartMs) / node.jumpDurationMs;
        if (jp >= 1 || jp < 0) {
          node.jumpZ = 0;
          node.jumpStartMs = 0;
          node.jumpDurationMs = 0;
          node.jumpPeak = 0;
        } else {
          jZ = Math.max(0, Math.min(0.9, 4 * jp * (1 - jp) * (node.jumpPeak || 0.78)));
          node.jumpZ = jZ;
        }
      } else {
        node.jumpZ = 0;
      }
      const liftedNodeY = Math.max(2, node.y - jZ * 3.0);
      el.style.left = `${node.x.toFixed(2)}%`;
      el.style.top = `${liftedNodeY.toFixed(2)}%`;
      el.classList.toggle("is-jumping", jZ > 0.04);
      if (jZ > 0.04) {
        if (typeof el.style.setProperty === "function") el.style.setProperty("--jump-scale", (1 + jZ * 0.16).toFixed(2));
        el.style.zIndex = "15";
      } else {
        if (typeof el.style.removeProperty === "function") el.style.removeProperty("--jump-scale");
        el.style.zIndex = "";
      }
      el.classList.toggle("is-coop-star", Boolean(coopStarSet && coopStarSet.has(node.uid)));
      const isDribbleDash = node.uid === activeDashUid;
      const isReceiveDash = Boolean(
        !isDribbleDash &&
        node.receiveDashUntil &&
        simClock < node.receiveDashUntil &&
        pitch.carrierUid !== node.uid
      );
      el.classList.toggle("is-dashing", isDribbleDash);
      el.classList.toggle("is-receiving-dash", isReceiveDash);
      if (node.player?.formSprites) {
        const nextSprite = resolveDynamicNodeSprite(node, pitch);
        if (nextSprite && node._renderedSprite !== nextSprite) {
          const imgEl = el.querySelector(".pitch-token-avatar");
          if (imgEl) imgEl.src = nextSprite;
          node._renderedSprite = nextSprite;
        }
      }
      if ((isDribbleDash || isReceiveDash) && state.simSpeed === 1 && el.parentElement && typeof document.createElement === "function") {
        const lastGhostAt = node._lastDashGhostAt || 0;
        if (now - lastGhostAt >= 55) {
          node._lastDashGhostAt = now;
          const worldEl = el.parentElement;
          const gSprite = node._renderedSprite || (typeof getPlayerFormSprite === "function" ? getPlayerFormSprite(node.player, node.role) : node.player?.sprite);
          if (gSprite && worldEl && typeof worldEl.appendChild === "function") {
            const ghost = document.createElement("div");
            ghost.className = `pitch-dash-ghost ${node.side === "opp" ? "side-opp" : "side-user"}${isDribbleDash ? " is-dribble" : ""}`;
            ghost.style.left = `${node.x.toFixed(2)}%`;
            ghost.style.top = `${liftedNodeY.toFixed(2)}%`;
            const gImg = document.createElement("img");
            gImg.src = gSprite;
            gImg.alt = "";
            ghost.appendChild(gImg);
            worldEl.appendChild(ghost);
            setTimeout(() => {
              if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
            }, 290);
          }
        }
      }
    }
  };
  pitch.userNodes.forEach(stepDomNode);
  pitch.oppNodes.forEach(stepDomNode);

  const shockEl = document.getElementById("pitch-shockwave");
  if (shockEl) {
    const sf = pitch.shockFx;
    if (sf && now - sf.start < sf.duration) {
      const t = Math.max(0, Math.min(1, (now - sf.start) / sf.duration));
      const eased = 1 - Math.pow(1 - t, 2.2);
      const sizePx = 28 + eased * 130;
      shockEl.style.left = `${sf.x.toFixed(1)}%`;
      shockEl.style.top = `${sf.y.toFixed(1)}%`;
      shockEl.style.width = `${sizePx.toFixed(0)}px`;
      shockEl.style.height = `${sizePx.toFixed(0)}px`;
      shockEl.style.opacity = (0.95 * (1 - t)).toFixed(2);
      shockEl.classList.add("is-active");
    } else {
      pitch.shockFx = null;
      shockEl.classList.remove("is-active");
      shockEl.style.opacity = "0";
    }
  }

  const saveRingEl = document.getElementById("pitch-save-ring");
  if (saveRingEl) {
    const sr = pitch.saveRingFx;
    if (sr && now - sr.start < sr.duration) {
      const t = Math.max(0, Math.min(1, (now - sr.start) / sr.duration));
      const eased = Math.pow(t, 0.72);
      const sizePx = 136 - eased * 118;
      const opacity = t < 0.75 ? 0.35 + (t / 0.75) * 0.6 : Math.max(0, 0.95 * (1 - (t - 0.75) / 0.25));
      saveRingEl.style.left = `${sr.x.toFixed(1)}%`;
      saveRingEl.style.top = `${sr.y.toFixed(1)}%`;
      saveRingEl.style.width = `${Math.max(16, sizePx).toFixed(0)}px`;
      saveRingEl.style.height = `${Math.max(16, sizePx).toFixed(0)}px`;
      saveRingEl.style.opacity = opacity.toFixed(2);
      saveRingEl.classList.add("is-active");
    } else {
      pitch.saveRingFx = null;
      saveRingEl.classList.remove("is-active");
      saveRingEl.style.opacity = "0";
    }
  }

  const goalBurstEl = document.getElementById("pitch-goal-burst");
  if (goalBurstEl) {
    const gb = pitch.goalBurstFx;
    if (gb && now - gb.start < gb.duration) {
      const t = Math.max(0, Math.min(1, (now - gb.start) / gb.duration));
      const scale = 0.52 + Math.sin(t * Math.PI * 0.5) * 0.88;
      const opacity = t < 0.15 ? 1 : Math.max(0, Math.pow(1 - (t - 0.15) / 0.85, 1.35));
      const dirScaleX = gb.side === "right" ? -1 : 1;
      goalBurstEl.className = `pitch-goal-burst side-${gb.side} is-active`;
      // Posicionamento exato onde a bola estufou a rede do gol (núcleo do SVG está em cx=24/160 = 15%, cy=70/140 = 50%)
      if (typeof gb.x === "number") {
        goalBurstEl.style.left = `${gb.x.toFixed(1)}%`;
        goalBurstEl.style.right = "auto";
      }
      if (typeof gb.y === "number") {
        goalBurstEl.style.top = `${gb.y.toFixed(1)}%`;
      }
      goalBurstEl.style.transform = `translate(-15%, -50%) scaleX(${dirScaleX}) scale(${scale.toFixed(3)})`;
      goalBurstEl.style.opacity = opacity.toFixed(3);
    } else {
      pitch.goalBurstFx = null;
      goalBurstEl.className = "pitch-goal-burst";
      goalBurstEl.style.opacity = "0";
    }
  }

  const BETA_BALL_LIFT_MULT = 7.6;
  let ballScale = 1;
  let ballTransform = "translate(-50%, -50%)";
  let ballSvgSpinDeg = null;
  let isShotBall = false;
  if (pitch.ballMode === "CARRIED" && !pitch.ballFlight) {
    if (betaOn) {
      const zCushion = Math.max(0, Number(pitch.ballZ) || 0);
      if (zCushion <= 0.008) {
        pitch.ballZ = 0;
        pitch.ballVz = 0;
      }
      const carryScale = zCushion > 0.008 ? 1 + zCushion * 0.24 : 1;
      ballTransform = carryScale !== 1 ? `translate(-50%, -50%) scale(${carryScale.toFixed(2)})` : "translate(-50%, -50%)";
      ballSvgSpinDeg = null;
    } else {
      pitch.ballZ = 0;
      pitch.ballVz = 0;
    }
  }
  if (pitch.ballFlight) {
    const f = pitch.ballFlight;
    const t = Math.min(1, Math.max(0, (now - f.start) / f.duration));
    const isShot = f.kind === "SHOT" || f.kind === "GOAL";
    isShotBall = isShot;
    const eased = isShot ? (f.linear ? t : Math.pow(t, 1.06)) : (1 - Math.pow(1 - t, 2.1));
    pitch.ballX = f.fromX + (f.toX - f.fromX) * eased;
    const verticalArc = isShot ? 0 : Math.sin(t * Math.PI) * (f.arcHeight || 0);
    if (betaOn) {
      pitch.ballY = f.fromY + (f.toY - f.fromY) * eased;
      pitch.ballZ = isShot ? 0 : Math.min(1.3, verticalArc * 0.25);
    } else {
      pitch.ballY = f.fromY + (f.toY - f.fromY) * eased - verticalArc;
      pitch.ballZ = 0;
    }

    if (isShot) {
      // Disparo direto reto: distorção de movimento (squash & stretch alinhado à trajetória)
      const dx = f.toX - f.fromX;
      const dy = (f.toY - f.fromY) * 0.55;
      const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
      const flightIntensity = f.linear ? 0.65 + 0.35 * Math.sin(t * Math.PI) : Math.sin(t * Math.PI);
      const stretch = 1.0 + flightIntensity * 0.72;
      const squash = Math.max(0.62, 1.0 - flightIntensity * 0.32);
      ballTransform = `translate(-50%, -50%) rotate(${angleDeg.toFixed(1)}deg) scale(${stretch.toFixed(2)}, ${squash.toFixed(2)})`;
      ballSvgSpinDeg = null;
    } else {
      ballScale = betaOn ? 1 + (pitch.ballZ || 0) * 0.24 + Math.sin(t * Math.PI) * 0.06 : 1 + Math.sin(t * Math.PI) * 0.26;
      ballTransform = `translate(-50%, -50%) scale(${ballScale.toFixed(2)})`;
      ballSvgSpinDeg = null;
    }
    if (pitch.passTrail) {
      pitch.passTrail.curX = pitch.ballX;
      pitch.passTrail.curY = pitch.ballY;
      pitch.passTrail.progress = t;
    }
    if (t >= 1) {
      pitch.ballX = f.toX;
      pitch.ballY = f.toY;
      pitch.ballZ = 0;
      if (!pitch.carrierUid) {
        pitch.holdBallPos = { x: f.toX, y: f.toY };
      }
      pitch.ballFlight = null;
    }
  } else if (pitch.passState && pitch.ballMode === "PASS_FLIGHT") {
    const zHeight = betaOn ? Math.max(0, Number(pitch.ballZ) || 0) : 0;
    ballScale = !betaOn
      ? 1 + Math.sin(pitch.passState.progress * Math.PI) * 0.22
      : zHeight > 0.01
      ? 1 + zHeight * 0.24
      : 1 + Math.sin(pitch.passState.progress * Math.PI) * 0.04;
    ballTransform = `translate(-50%, -50%) scale(${ballScale.toFixed(2)})`;
    ballSvgSpinDeg = null;
    if (pitch.passTrail) {
      pitch.passTrail.curX = pitch.ballX;
      pitch.passTrail.curY = pitch.ballY;
      pitch.passTrail.progress = pitch.passState.progress;
      pitch.passTrail.u = easePassProgress(pitch.passState.progress);
      pitch.passTrail.fadeUntil = now + 320;
    }
  } else if (pitch.ballMode === "LOOSE_BALL" && pitch.looseState) {
    if (betaOn) {
      const zLoose = Math.max(0, Number(pitch.ballZ) || 0);
      ballScale = 1 + zLoose * 0.24;
      ballTransform = `translate(-50%, -50%) scale(${ballScale.toFixed(2)})`;
      ballSvgSpinDeg = null;
    } else {
      ballTransform = "translate(-50%, -50%)";
      ballSvgSpinDeg = null;
    }
  } else if (pitch.holdBallPos && !pitch.carrierUid) {
    pitch.ballX = pitch.holdBallPos.x;
    pitch.ballY = pitch.holdBallPos.y;
    pitch.ballZ = 0;
  }

  const ballZVis = !betaOn || isShotBall ? 0 : Math.max(0, Math.min(1.8, Number(pitch.ballZ) || 0));
  const ballShadowEl = document.getElementById("live-pitch-ball-shadow");
  if (ballShadowEl) {
    ballShadowEl.style.left = `${pitch.ballX.toFixed(2)}%`;
    ballShadowEl.style.top = `${(pitch.ballY + 0.6).toFixed(2)}%`;
    if (ballZVis > 0.02) {
      const shScale = Math.max(0.48, 1 - ballZVis * 0.28);
      const shAlpha = Math.max(0.22, 0.72 - ballZVis * 0.28);
      ballShadowEl.style.opacity = shAlpha.toFixed(2);
      ballShadowEl.style.transform = `translate(-50%, -50%) scale(${shScale.toFixed(2)})`;
      ballShadowEl.style.filter = `blur(${(0.6 + ballZVis * 1.4).toFixed(1)}px)`;
    } else {
      ballShadowEl.style.opacity = "0";
    }
  }

  const ballEl = document.getElementById("live-pitch-ball");
  const liftedY = Math.max(2, pitch.ballY - ballZVis * BETA_BALL_LIFT_MULT);
  if (ballEl) {
    ballEl.style.left = `${pitch.ballX.toFixed(2)}%`;
    ballEl.style.top = `${liftedY.toFixed(2)}%`;
    ballEl.style.transform = ballTransform;
    ballEl.style.zIndex = ballZVis > 0.45 ? "16" : "9";

    const specialShotFlame = Boolean(betaOn && isShotBall && pitch.ballFlight?.isSpecial);
    const animeSpinActive = false;
    ballEl.classList.toggle("is-elem-flame", specialShotFlame);
    ballEl.classList.toggle("is-anime-spin", false);
    ballEl.classList.toggle("is-spin-ccw", false);
    const ballSvgEl = typeof ballEl.querySelector === "function" ? ballEl.querySelector(".pitch-ball-svg") : null;
    if (ballSvgEl) {
      ballSvgEl.style.transform = "";
    }
    const elemSlug = specialShotFlame
      ? String(pitch.ballFlight?.elem || "Fogo")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      : "";
    ballEl.classList.toggle("elem-fogo", elemSlug === "fogo");
    ballEl.classList.toggle("elem-vento", elemSlug === "vento");
    ballEl.classList.toggle("elem-floresta", elemSlug === "floresta");
    ballEl.classList.toggle("elem-montanha", elemSlug === "montanha");
  }

  const lineGlow = document.getElementById("pitch-pass-glow");
  const lineMain = document.getElementById("pitch-pass-line");
  if (lineGlow && lineMain) {
    const tr = pitch.passTrail;
    if (tr && now < tr.fadeUntil) {
      const fromX = Number.isFinite(tr.fromX) ? tr.fromX : 50;
      const fromY = Number.isFinite(tr.fromY) ? tr.fromY : 50;
      const rawEndX = tr.curX !== undefined ? tr.curX : tr.toX;
      const isActivelyFlying = pitch.ballMode === "PASS_FLIGHT" || isShotBall;
      const rawEndY = betaOn && isActivelyFlying ? liftedY : (tr.curY !== undefined ? tr.curY : tr.toY);
      const endX = Number.isFinite(rawEndX) ? rawEndX : fromX;
      const endY = Number.isFinite(rawEndY) ? rawEndY : fromY;
      const remain = Math.max(0, Math.min(1, (tr.fadeUntil - now) / 420));
      let pathD = "";
      if (!isActivelyFlying && tr.frozenPathD) {
        pathD = tr.frozenPathD;
      } else if (isShotBall || tr.isShot) {
        pathD = `M ${fromX.toFixed(1)} ${fromY.toFixed(1)} L ${endX.toFixed(1)} ${endY.toFixed(1)}`;
        tr.frozenPathD = pathD;
      } else if (betaOn && (tr.peakZ || 0) > 0.01) {
        const steps = 14;
        const maxP = Math.max(0.02, Math.min(1, Number(tr.progress) || Number(tr.u) || 1));
        const cpx = Number.isFinite(tr.ctrlX) ? tr.ctrlX : (fromX + (tr.toX ?? endX)) * 0.5;
        const cpy = Number.isFinite(tr.ctrlY) ? tr.ctrlY : (fromY + (tr.toY ?? endY)) * 0.5;
        const dstX = Number.isFinite(tr.toX) ? tr.toX : endX;
        const dstY = Number.isFinite(tr.toY) ? tr.toY : endY;
        const segs = [];
        for (let s = 0; s <= steps; s++) {
          const tp = (s / steps) * maxP;
          const up = typeof easePassProgress === "function" ? easePassProgress(tp) : tp;
          const pt = typeof evalQuadraticBezier === "function"
            ? evalQuadraticBezier(fromX, fromY, cpx, cpy, dstX, dstY, up)
            : { x: fromX + (dstX - fromX) * up, y: fromY + (dstY - fromY) * up };
          const zAt = 4 * tp * (1 - tp) * tr.peakZ;
          const vy = Math.max(2, pt.y - zAt * BETA_BALL_LIFT_MULT);
          segs.push(`${s === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${vy.toFixed(1)}`);
        }
        pathD = segs.join(" ");
        tr.frozenPathD = pathD;
      } else if (Number.isFinite(tr.ctrlX) && Number.isFinite(tr.ctrlY)) {
        const u = Number.isFinite(tr.u) ? Math.max(0.02, Math.min(1, tr.u)) : 1;
        // De Casteljau: sub-curva exata de 0 até u para o traçado acompanhar a parábola da bola!
        const subCx = fromX + (tr.ctrlX - fromX) * u;
        const subCy = fromY + (tr.ctrlY - fromY) * u;
        pathD = `M ${fromX.toFixed(1)} ${fromY.toFixed(1)} Q ${subCx.toFixed(1)} ${subCy.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;
        tr.frozenPathD = pathD;
      } else {
        pathD = `M ${fromX.toFixed(1)} ${fromY.toFixed(1)} L ${endX.toFixed(1)} ${endY.toFixed(1)}`;
        tr.frozenPathD = pathD;
      }
      lineGlow.setAttribute("d", pathD);
      lineGlow.setAttribute("stroke", tr.color);
      lineGlow.style.opacity = (0.36 * remain).toFixed(2);

      lineMain.setAttribute("d", pathD);
      lineMain.setAttribute("stroke", tr.color);
      lineMain.setAttribute(
        "stroke-dasharray",
        (isShotBall || tr.isShot) ? "" : (betaOn && tr.isAerial) ? "3.4 2.2" : "2.2 1.6"
      );
      lineMain.style.opacity = (0.94 * remain).toFixed(2);
    } else {
      pitch.passTrail = null;
      lineGlow.style.opacity = "0";
      lineMain.style.opacity = "0";
    }
  }

  const synLineEl = document.getElementById("pitch-synergy-line");
  if (synLineEl) {
    const sfx = betaOn ? pitch.synergyLinkFx : null;
    if (sfx && now < sfx.start + sfx.duration) {
      const nA = findPitchNode(pitch, sfx.fromUid);
      const nB = findPitchNode(pitch, sfx.toUids?.[0]);
      if (nA && nB) {
        const remainSyn = Math.max(0, Math.min(1, (sfx.start + sfx.duration - now) / sfx.duration));
        synLineEl.setAttribute("x1", nA.x.toFixed(1));
        synLineEl.setAttribute("y1", nA.y.toFixed(1));
        synLineEl.setAttribute("x2", nB.x.toFixed(1));
        synLineEl.setAttribute("y2", nB.y.toFixed(1));
        synLineEl.setAttribute("stroke", sfx.color || "#facc15");
        synLineEl.setAttribute("stroke-width", "1.4");
        synLineEl.style.opacity = (0.88 * remainSyn).toFixed(2);
      } else {
        synLineEl.style.opacity = "0";
      }
    } else {
      pitch.synergyLinkFx = null;
      synLineEl.style.opacity = "0";
    }
  }

  const badgeEl = document.getElementById("pitch-float-badge");
  if (badgeEl) {
    const fb = pitch.floatBadge;
    if (fb && now < fb.until) {
      badgeEl.className = `pitch-float-badge ${fb.cls} is-visible`;
      badgeEl.style.left = `${fb.x.toFixed(1)}%`;
      badgeEl.style.top = `${fb.y.toFixed(1)}%`;
      const fKey = `${fb.iconCat || ""}|${fb.text}`;
      if (badgeEl.dataset.renderKey !== fKey) {
        badgeEl.dataset.renderKey = fKey;
        const iconHTML = fb.iconCat ? renderPitchIconTag(fb.iconCat, "badge-move-icon") : "";
        badgeEl.innerHTML = `${iconHTML}<span>${fb.text}</span>`;
      }
    } else {
      badgeEl.className = "pitch-float-badge";
    }
  }
  syncNodeBadgesDOM(pitch, now);

  const gLeft = document.getElementById("pitch-goal-left");
  const gRight = document.getElementById("pitch-goal-right");
  if (gLeft && gRight) {
    const activeFlash = pitch.goalFlashUntil && now < pitch.goalFlashUntil ? pitch.goalFlashSide : null;
    gLeft.classList.toggle("goal-flash", activeFlash === "left");
    gRight.classList.toggle("goal-flash", activeFlash === "right");
  }

  updatePitchCameraTransform(pitch, now, false);
}

function updatePitchCameraTransform(pitch, now = performance.now(), snapImmediate = false) {
  if (!pitch) return;
  const viewportEl = document.getElementById("live-tactical-pitch-viewport");
  const worldEl = document.getElementById("live-pitch-world");
  if (!viewportEl || !worldEl) return;

  const vw = viewportEl.clientWidth;
  const vh = viewportEl.clientHeight;
  const ww = worldEl.offsetWidth;
  const wh = worldEl.offsetHeight;
  if (vw <= 0 || vh <= 0 || ww <= vw || wh <= vh) return;

  const lastNow = pitch.camLastNow || now;
  const camDt = Math.min(0.05, Math.max(0.004, (now - lastNow) / 1000));
  pitch.camLastNow = now;

  // Foco suave da câmera top-down acompanhando a bola (com leve antecipação na jogada)
  let targetX = pitch.ballX ?? 50;
  let targetY = pitch.ballY ?? 50;
  if (pitch.ballFlight) {
    targetX = targetX * 0.72 + pitch.ballFlight.toX * 0.28;
    targetY = targetY * 0.78 + pitch.ballFlight.toY * 0.22;
  } else if (pitch.passState && pitch.ballMode === "PASS_FLIGHT") {
    targetX = targetX * 0.8 + pitch.passState.toX * 0.2;
    targetY = targetY * 0.85 + pitch.passState.toY * 0.15;
  } else if (pitch.ballMode === "LOOSE_BALL" && pitch.looseState) {
    targetX = Math.max(6, Math.min(94, targetX + (pitch.looseState.vx || 0) * 0.12));
    targetY = Math.max(9, Math.min(91, targetY + (pitch.looseState.vy || 0) * 0.12));
  } else if (pitch.ballMode === "CARRIED" && pitch.carrierUid) {
    const carrier = findPitchNode(pitch, pitch.carrierUid);
    if (carrier) {
      targetX += carrier.side === "user" ? 4.5 : -4.5;
    }
  }

  if (pitch.camX === undefined) pitch.camX = targetX;
  if (pitch.camY === undefined) pitch.camY = targetY;

  if (snapImmediate || pitch.camSnap) {
    pitch.camX = targetX;
    pitch.camY = targetY;
    pitch.camSnap = false;
  } else {
    const camSpeed = state.simSpeed === 4 ? 14 : state.simSpeed === 2 ? 9.5 : 6.4;
    const alpha = 1 - Math.exp(-camSpeed * camDt);
    pitch.camX += (targetX - pitch.camX) * alpha;
    pitch.camY += (targetY - pitch.camY) * alpha;
  }

  const focusPxX = (pitch.camX / 100) * ww;
  const focusPxY = (pitch.camY / 100) * wh;
  const tx = Math.min(0, Math.max(vw - ww, vw * 0.5 - focusPxX));
  const ty = Math.min(0, Math.max(vh - wh, vh * 0.5 - focusPxY));
  worldEl.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`;
}

function startPitchRafLoop(st) {
  if (state.tournament.pitchRafId) {
    cancelAnimationFrame(state.tournament.pitchRafId);
    state.tournament.pitchRafId = null;
  }
  const loopGen = (state.tournament._pitchRafGen = (state.tournament._pitchRafGen || 0) + 1);

  let lastNow = performance.now();

  const step = (now) => {
    if (loopGen !== state.tournament._pitchRafGen) return;
    if (state.phase !== "tournament" || !st || !st.pitch) {
      state.tournament.pitchRafId = null;
      return;
    }

    const pitchEl = document.getElementById("live-pitch-box");
    if (!pitchEl) {
      state.tournament.pitchRafId = null;
      return;
    }

    const pitch = st.pitch;
    const rawDt = Math.min(0.055, Math.max(0.004, (now - lastNow) / 1000));
    lastNow = now;

    const isPaused = Boolean(
      state.tournament.pendingBeatFinish ||
      state.tournament.pendingClashFinish ||
      state.tournament.pendingWhistleFinish ||
      state.tournament.pendingShotFlightFinish ||
      state.tournament.pendingNetFlightFinish
    );
    if (!st.finished && st.running && !isPaused) {
      const simDtTotal = rawDt * getSpeedMultiplier();
      const subSteps = Math.min(8, Math.max(1, Math.ceil(simDtTotal / 0.028)));
      const subDt = simDtTotal / subSteps;
      for (let s = 0; s < subSteps; s++) {
        if (
          loopGen !== state.tournament._pitchRafGen ||
          state.tournament.pendingBeatFinish ||
          state.tournament.pendingClashFinish ||
          state.tournament.pendingWhistleFinish ||
          state.tournament.pendingShotFlightFinish ||
          state.tournament.pendingNetFlightFinish ||
          st.finished ||
          !st.running
        ) {
          break;
        }
        stepContinuousPhysics(st, pitch, subDt);
      }
    }

    if (loopGen !== state.tournament._pitchRafGen) return;
    renderPitchDOMFrame(pitch, st, now);

    if (loopGen !== state.tournament._pitchRafGen) return;
    if (!st.finished || pitch.ballFlight || pitch.goalBurstFx) {
      state.tournament.pitchRafId = requestAnimationFrame(step);
    } else {
      state.tournament.pitchRafId = null;
    }
  };

  state.tournament.pitchRafId = requestAnimationFrame(step);
}

function getEffectiveCarrierRole(carrier) {
  if (!carrier) return "MF";
  if (carrier.side === "user") {
    if (carrier.x >= 60 && carrier.role !== "GK") return "FW";
    if (carrier.x >= 36 && carrier.role === "DF") return "MF";
  } else {
    if (carrier.x <= 40 && carrier.role !== "GK") return "FW";
    if (carrier.x <= 64 && carrier.role === "DF") return "MF";
  }
  return carrier.role;
}

function pickWeightedNode(candidates) {
  if (!candidates || candidates.length === 0) return null;
  const weights = candidates.map((n) => {
    const staminaW = Math.max(0.25, n.stamina / 100);
    const skillW = Math.pow(Math.max(55, n.effOvr) / 80, 0.7);
    return staminaW * skillW;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

function pickPassReceiver(nodes, defNodes, carrier, strictForward = false, pitch = null) {
  const order = { GK: 0, DF: 1, MF: 2, FW: 3 };
  const effRole = getEffectiveCarrierRole(carrier);
  const curRank = order[effRole] ?? 2;
  const attIsUser = carrier.side === "user";
  const prof = getNodePersonality(carrier);
  const inFinalThird = attIsUser ? carrier.x >= 58 : carrier.x <= 42;

  let candidates = nodes.filter((n) => {
    if (n.uid === carrier.uid || n.role === "GK") return false;
    const dxForward = attIsUser ? n.targetX - carrier.x : carrier.x - n.targetX;
    if (strictForward) {
      return dxForward >= -2 && (order[n.role] ?? 1) >= Math.min(2, curRank);
    }
    return (order[n.role] ?? 1) >= curRank && (order[n.role] ?? 1) <= curRank + 1;
  });

  if (!strictForward && effRole === "FW") {
    candidates = nodes.filter((n) => {
      if (n.uid === carrier.uid || n.role === "GK") return false;
      const dxForward = attIsUser ? n.targetX - carrier.x : carrier.x - n.targetX;
      return dxForward >= -5 && (n.role === "FW" || n.role === "MF");
    });
  }
  if (candidates.length === 0) {
    candidates = nodes.filter((n) => {
      if (n.uid === carrier.uid || n.role === "GK") return false;
      const dxForward = attIsUser ? n.targetX - carrier.x : carrier.x - n.targetX;
      return strictForward ? dxForward >= -6 : true;
    });
  }
  if (candidates.length === 0) {
    candidates = nodes.filter((n) => n.uid !== carrier.uid && n.role !== "GK");
  }
  if (candidates.length === 0) return nodes[0];

  const betaPickOn = typeof isBetaMode === "function" && isBetaMode();
  const teamChemNow =
    betaPickOn && attIsUser && !pitch?.is5v5
      ? (pitch?.support?.user?.chem ?? (typeof calcSquadStats === "function" ? (calcSquadStats()?.chem ?? 50) : 50))
      : 50;

  const weights = candidates.map((n) => {
    const forwardGain = attIsUser ? n.targetX - carrier.x : carrier.x - n.targetX;
    const dist = Math.hypot(n.targetX - carrier.x, n.targetY - carrier.y);
    // No terço final, penaliza fortemente recuos sem sentido (a menos que seja a única opção livre)
    const forwardFactor =
      forwardGain >= 5
        ? 2.25
        : forwardGain >= 0
        ? 1.75
        : forwardGain >= -5
        ? (inFinalThird ? 0.42 : 0.78)
        : (inFinalThird ? 0.04 : 0.16);
    const idealMaxDist = prof.archetype === "ESTRATEGISTA" ? 46 : prof.archetype === "COLETIVISTA" ? 28 : 38;
    const distFactor = dist >= 8 && dist <= idealMaxDist ? 1.5 : dist < 6 ? 0.35 : 0.78;

    const laneMidX = (carrier.x + n.targetX) * 0.5;
    const laneMidY = (carrier.y + n.targetY) * 0.5;
    let minDefDist = 99;
    let laneDefDist = 99;
    if (defNodes && defNodes.length) {
      defNodes.forEach((d) => {
        const dd = Math.hypot(d.x - n.targetX, d.y - n.targetY);
        const ld = Math.hypot(d.x - laneMidX, d.y - laneMidY);
        if (dd < minDefDist) minDefDist = dd;
        if (ld < laneDefDist) laneDefDist = ld;
      });
    }
    const isGkPass = carrier.role === "GK";
    const openFactor =
      (minDefDist >= 12 ? (isGkPass ? 3.2 : 2.4) : minDefDist >= 8 ? (isGkPass ? 2.1 : 1.75) : minDefDist >= 5.5 ? (isGkPass ? 0.85 : 1.0) : (isGkPass ? 0.18 : 0.42)) *
      (laneDefDist >= 8 ? 1.35 : laneDefDist < 4.0 ? 0.45 : 0.95);
    const staminaW = n.stamina >= 45 ? 1.15 : 0.55;
    const antiPingPongW = pitch && pitch.lastPasserUid === n.uid ? 0.40 : 1.0;
    const switchAffinity = prof.archetype === "ESTRATEGISTA" ? 2.15 : 1.55;
    const wingSwitchW = Math.abs(n.targetY - carrier.y) >= 16 && forwardGain >= -3 && minDefDist >= 7.5 ? switchAffinity : 1.0;
    const skillW = Math.pow(Math.max(55, n.effOvr) / 80, 0.85);
    let tacticLaneW = 1.0;
    if (attIsUser && !pitch?.is5v5) {
      const laneMode = getTactics().lane;
      const isWide = n.targetY < 34 || n.targetY > 66;
      if (laneMode === "wings") tacticLaneW = isWide ? 1.95 : 0.52;
      else if (laneMode === "center") tacticLaneW = isWide ? 0.52 : 1.95;
    }

    const oppGk = defNodes?.find((d) => d.role === "GK");
    let elemSynergyW = 1.0;
    if (oppGk?.player?.element && n.player?.element) {
      if (ELEMENT_ADVANTAGE[n.player.element] === oppGk.player.element) {
        elemSynergyW = 1.65;
      } else if (ELEMENT_ADVANTAGE[oppGk.player.element] === n.player.element) {
        elemSynergyW = 0.75;
      }
    }

    const oppOutfieldDefs = (defNodes || []).filter((d) => d.role !== "GK");
    const oppDefLineX = oppOutfieldDefs.length > 0
      ? (attIsUser ? Math.max(...oppOutfieldDefs.map((d) => d.x)) : Math.min(...oppOutfieldDefs.map((d) => d.x)))
      : (attIsUser ? 84 : 16);

    const isCandidateOffside = !pitch.is5v5 && (attIsUser
      ? (n.x > 50 && n.x > carrier.x + 0.6 && n.x > oppDefLineX + 0.6)
      : (n.x < 50 && n.x < carrier.x - 0.6 && n.x < oppDefLineX - 0.6));

    if (isCandidateOffside) {
      return 0.001;
    }

    // Bônus para companheiro livre na zona de gol (tap-in / passe decisivo)
    const oppGoalX = attIsUser ? 96 : 4;
    const recGoalDist = Math.hypot(n.x - oppGoalX, n.y - 50);
    const tapInBonus = recGoalDist <= 22 && minDefDist >= 6.5 ? (1.45 + prof.vision * 0.75) : 1.0;

    // Bônus para companheiro com corredor aberto à frente para receber passe no espaço vazio
    const openForwardGrass = attIsUser ? (oppDefLineX - n.x) : (n.x - oppDefLineX);
    const spaceRunBonus = (openForwardGrass >= 6 && forwardGain >= 0) ? (1.35 + prof.vision * 0.45) : 1.0;

    // Referência Ofensiva ("Camisa 10") e Estilo de Jogo (Posse vs Vertical)
    let aceW = 1.0;
    let styleW = 1.0;
    if (attIsUser && !pitch?.is5v5) {
      const tac = getTactics();
      if (tac.acePlayerId && n.player?.id === tac.acePlayerId && minDefDist >= 5.0 && n.x >= 42) {
        aceW = 1.52;
      }
      if (tac.style === "possession") {
        styleW = dist <= 26 && minDefDist >= 7.0 ? 1.35 : 0.82;
      } else if (tac.style === "vertical") {
        styleW = forwardGain >= 5 ? 1.38 : 0.75;
      }
    }

    let pairAffinityW = 1.0;
    if (betaPickOn && attIsUser && !pitch?.is5v5 && typeof getPairAffinityEntry === "function") {
      const pairEnt = getPairAffinityEntry(carrier.player, n.player);
      pairAffinityW = [1.0, 1.08, 1.18, 1.30][pairEnt?.level || 0] || 1.0;
      if (teamChemNow < 24 && (pairEnt?.points || 0) === 0) {
        pairAffinityW *= 0.94;
      }
    }

    const isRouteOfSkyNow =
      attIsUser && !pitch?.is5v5 && (pitch?.hissatsuTacticTimer || 0) > 0 && pitch?.activeHissatsuTacticId === "route_of_sky";
    const chipLobW =
      betaPickOn && laneDefDist < 4.5 && minDefDist >= 6.5 && (prof.archetype === "ESTRATEGISTA" || isRouteOfSkyNow) ? 1.22 : 1.0;

    return forwardFactor * distFactor * openFactor * staminaW * antiPingPongW * wingSwitchW * skillW * elemSynergyW * spaceRunBonus * tapInBonus * tacticLaneW * aceW * styleW * pairAffinityW * chipLobW;
  });

  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

function chooseTacticalAction(carrier, attNodes, defNodes, attIsUser, pitch) {
  if (pitch.justKickedOff) {
    pitch.justKickedOff = false;
    return { action: "PASS", strictForward: false, safeRestart: true };
  }

  const effRole = getEffectiveCarrierRole(carrier);
  if (effRole === "GK") return { action: "PASS", strictForward: true, safeRestart: true };

  const oppGk = defNodes.find((d) => d.role === "GK");
  const oppGkElem = oppGk?.player?.element;
  const carrierElem = carrier.player?.element;
  const isCarrierDisadvantagedVsGk = carrierElem && oppGkElem && ELEMENT_ADVANTAGE[oppGkElem] === carrierElem;

  const oppGoalX = attIsUser ? 96 : 4;
  const goalDist = Math.hypot(carrier.x - oppGoalX, carrier.y - 50);
  const inPenaltyX = attIsUser ? carrier.x >= 72 : carrier.x <= 28;
  const centralLane = carrier.y >= 24 && carrier.y <= 76;
  const inFinalThird = attIsUser ? carrier.x >= 58 : carrier.x <= 42;

  // Conta defensores na frente e mede pressão imediata em cima do portador
  let nearestDefDist = 99;
  const blockingDefs = defNodes.filter((d) => {
    if (d.role === "GK") return false;
    const dDist = Math.hypot(d.x - carrier.x, d.y - carrier.y);
    if (dDist < nearestDefDist) nearestDefDist = dDist;
    const isAhead = attIsUser ? d.x >= carrier.x - 1 : d.x <= carrier.x + 1;
    const nearCorridor = Math.abs(d.y - carrier.y) <= 13 && Math.abs(d.x - carrier.x) <= 16;
    return isAhead && nearCorridor;
  }).length;

  // Colega de ataque livre dentro da área em melhor ângulo
  const hasOpenBoxTarget = attNodes.some((n) => {
    if (n.uid === carrier.uid || n.role === "GK") return false;
    const insideBox = (attIsUser ? n.x >= 70 : n.x <= 30) && n.y >= 28 && n.y <= 72;
    const closerToGoal = Math.hypot(n.x - oppGoalX, n.y - 50) + 3 < goalDist;
    return insideBox && closerToGoal;
  });

  // Inteligência tática elemental: atacante em desvantagem contra o goleiro procura companheiro com vantagem ou neutro
  const hasBetterElementalTeammateInBox = attNodes.some((n) => {
    if (n.uid === carrier.uid || n.role === "GK") return false;
    const forwardPos = attIsUser ? n.x >= 65 : n.x <= 35;
    const elem = n.player?.element;
    const hasElemEdge = elem && oppGkElem && ELEMENT_ADVANTAGE[elem] === oppGkElem;
    const isNotDisadvantaged = elem && oppGkElem && ELEMENT_ADVANTAGE[oppGkElem] !== elem;
    return forwardPos && (hasElemEdge || isNotDisadvantaged);
  });

  const isTired = carrier.stamina < 45;
  const underClosePress = nearestDefDist < 9.5;
  const tooManyDribbles = pitch.lastAction === "DRIBBLE" && (pitch.sameActionStreak || 0) >= 2;
  const stalePasses = (pitch.teamConsecutivePasses || 0) >= 3;
  const roll = Math.random();

  // 1) Cara a cara ou dentro da área central -> finaliza com inteligência ou rola pro colega livre
  if ((inPenaltyX && centralLane) || goalDist <= 22) {
    if (blockingDefs <= 1 || goalDist <= 18) {
      // Se estiver em desvantagem elemental contra o goleiro e tiver companheiro melhor posicionado/elemental, passa a bola!
      if (hasOpenBoxTarget && (isCarrierDisadvantagedVsGk ? roll < 0.65 : (blockingDefs >= 1 && roll < 0.24))) {
        return { action: "PASS", strictForward: true };
      }
      return { action: "SHOT", strictForward: true };
    }
    if (hasOpenBoxTarget && roll < (isCarrierDisadvantagedVsGk ? 0.70 : 0.36)) return { action: "PASS", strictForward: true };
    if (roll < (isCarrierDisadvantagedVsGk ? 0.45 : 0.78)) return { action: "SHOT", strictForward: true };
    return isTired ? { action: "SHOT", strictForward: true } : { action: "DRIBBLE", strictForward: true };
  }

  // 2) Ponta / linha de fundo na área -> cruza quando há opção livre, corta pra dentro se tiver espaço
  if (inPenaltyX && !centralLane) {
    if (hasOpenBoxTarget && roll < (isTired || tooManyDribbles || isCarrierDisadvantagedVsGk ? 0.85 : 0.60)) {
      return { action: "PASS", strictForward: true };
    }
    if (!isTired && !tooManyDribbles && roll < 0.85) return { action: "DRIBBLE", strictForward: true };
    return { action: "SHOT", strictForward: true };
  }

  // 3) Terço final / entrada da área
  if (inFinalThird || effRole === "FW") {
    // Se o atacante sabe que o goleiro anula seu elemento, prioriza rolar para outros atacantes/meias
    if (isCarrierDisadvantagedVsGk && hasBetterElementalTeammateInBox && roll < 0.68) {
      return { action: "PASS", strictForward: true };
    }
    const activePosture = !pitch.is5v5
      ? (attIsUser ? getTactics().posture : getOpponentDynamicPosture())
      : "balanced";
    const shotBoost = activePosture === "offensive" ? (attIsUser ? 0.16 : 0.11) : activePosture === "defensive" ? -0.14 : 0;
    if (blockingDefs === 0) {
      if (roll < Math.max(0.15, (isCarrierDisadvantagedVsGk ? 0.35 : 0.58) + shotBoost)) return { action: "SHOT", strictForward: true };
      if (!isTired && !tooManyDribbles && roll < 0.82) return { action: "DRIBBLE", strictForward: true };
      return { action: "PASS", strictForward: true };
    }
    if ((isTired || tooManyDribbles) && roll < 0.65) {
      return { action: "PASS", strictForward: true };
    }
    if (stalePasses && roll < 0.68) {
      return roll < 0.36 ? { action: "SHOT", strictForward: true } : { action: "DRIBBLE", strictForward: true };
    }
    if (roll < Math.max(0.14, 0.34 + shotBoost)) return { action: "SHOT", strictForward: true };
    if (roll < 0.66) return { action: "DRIBBLE", strictForward: true };
    return { action: "PASS", strictForward: true };
  }

  // 4) Defesa / Meio-campo construtivo: evita insistir no drible quando cansado ou encurralado, e quebra tiki-taka longo
  if (effRole === "DF") {
    if (isTired || underClosePress || tooManyDribbles) {
      return roll < 0.86 ? { action: "PASS", strictForward: true } : { action: "DRIBBLE", strictForward: false };
    }
    return roll < 0.74 ? { action: "PASS", strictForward: true } : { action: "DRIBBLE", strictForward: false };
  }

  if (isTired || tooManyDribbles) {
    return roll < 0.78 ? { action: "PASS", strictForward: false } : { action: "DRIBBLE", strictForward: false };
  }
  if (stalePasses) {
    if (roll < 0.52) return { action: "DRIBBLE", strictForward: false };
    if (roll < 0.68) return { action: "SHOT", strictForward: true };
    return { action: "PASS", strictForward: true };
  }
  if (underClosePress && blockingDefs >= 2) {
    return roll < 0.72 ? { action: "PASS", strictForward: false } : { action: "DRIBBLE", strictForward: false };
  }
  if (roll < 0.54) return { action: "PASS", strictForward: false };
  if (roll < 0.90) return { action: "DRIBBLE", strictForward: false };
  return { action: "SHOT", strictForward: true };
}

function pickMarkerFor(oppNodes, targetSectorRoles, refX = 50, refY = 50) {
  let pool = oppNodes.filter((n) => targetSectorRoles.includes(n.role));
  if (pool.length === 0) pool = oppNodes.filter((n) => n.role !== "GK");
  if (pool.length === 0) return oppNodes[0];

  // Escolhe prioritariamente o defensor mais próximo da jogada naquele corredor do campo!
  const weights = pool.map((n) => {
    const dist = Math.hypot(n.x - refX, (n.y - refY) * 1.15);
    const proxW = 1 / Math.pow(Math.max(5, dist), 1.35);
    const staminaW = Math.max(0.3, n.stamina / 100);
    const skillW = Math.pow(Math.max(55, n.effOvr) / 80, 0.6);
    return proxW * staminaW * skillW;
  });

  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

function syncLivePitchDOM(st) {
  const pitch = st?.pitch;
  if (!pitch) return;

  recomputePitchTargets(pitch);

  const tickerEl = document.getElementById("pitch-action-ticker");
  if (tickerEl && pitch.ticker) {
    tickerEl.textContent = pitch.ticker;
  }

  const cardEl = document.getElementById("live-pitch-box");
  const possBar = document.getElementById("pitch-possession-bar");
  const isUserPoss = pitch.ballSide === "user";

  if (cardEl) {
    cardEl.classList.toggle("poss-user", isUserPoss);
    cardEl.classList.toggle("poss-opp", !isUserPoss);
  }
  if (possBar) {
    possBar.classList.toggle("poss-user", isUserPoss);
    possBar.classList.toggle("poss-opp", !isUserPoss);
    const userUpper = (typeof getActiveTeamName === "function" ? getActiveTeamName() : "Dream Team").toUpperCase();
    const teamLabel = isUserPoss ? userUpper : (pitch.oppTeamName || "ADVERSÁRIO").toUpperCase();
    const dirArrow = isUserPoss ? "Atacando ➔" : "⬅ Atacando";
    possBar.innerHTML = `
      <span class="poss-team-chip">
        <span class="poss-pulse-dot"></span>
        <span>POSSE: ${teamLabel}</span>
      </span>
      <span class="poss-dir-label">${dirArrow}</span>
    `;
  }

  const tacNow = getTactics();
  const capId = tacNow.captainPlayerId || null;
  const markedOppId = tacNow.markedOppId || null;

  const updateNodeState = (list) => {
    list.forEach((node) => {
      const el = document.getElementById(`pnode-${node.uid}`);
      if (!el) return;
      el.classList.toggle("has-ball", node.uid === pitch.carrierUid);
      el.classList.toggle("is-challenger", node.uid === pitch.challengerUid);
      el.classList.toggle("is-tired", node.stamina < 45);
      el.classList.toggle("is-keshin-active", node.keshinState === "ACTIVE");
      el.classList.toggle("is-keshin-exhausted", node.keshinState === "EXHAUSTED");
      el.classList.toggle("is-captain-node", !pitch.is5v5 && node.side === "user" && Boolean(capId && node.player?.id === capId));
      el.classList.toggle("is-marked-opp", !pitch.is5v5 && node.side === "opp" && node.role !== "GK" && Boolean(markedOppId && node.player?.id === markedOppId));

      const stamBar = el.querySelector(".pitch-token-stamina-fill");
      if (stamBar) {
        stamBar.style.width = `${Math.round(node.stamina)}%`;
        stamBar.style.backgroundColor =
          node.stamina >= 70
            ? "#4ade80"
            : node.stamina >= 45
            ? "#facc15"
            : "#ef4444";
      }
    });
  };

  updateNodeState(pitch.userNodes);
  updateNodeState(pitch.oppNodes);
  syncNodeBadgesDOM(pitch, performance.now());

  const hBtn = document.getElementById("btn-activate-hissatsu-tactic");
  const hHint = document.getElementById("pitch-coach-hint");
  if (hBtn && !pitch.is5v5) {
    const resolvedTacticId = pitch.activeHissatsuTacticId || pitch.usedHissatsuTacticId || tacNow.hissatsuTactic;
    const hObj = HISSATSU_TACTICS_CATALOG?.[resolvedTacticId] || HISSATSU_TACTICS_CATALOG?.route_of_sky;
    if ((pitch.hissatsuTacticTimer || 0) > 0) {
      const remMin = Math.max(1, Math.ceil((pitch.hissatsuTacticTimer || 0) * 1.45));
      hBtn.classList.add("is-tactic-active");
      hBtn.classList.remove("is-tactic-used");
      hBtn.disabled = true;
      hBtn.innerHTML = `<span>⚡ ${hObj?.name || "Tática"} (${remMin}')</span>`;
      if (hHint) hHint.textContent = `Ativa: ${hObj?.shortEffect || "efeito em campo!"}`;
    } else if (pitch.hissatsuTacticUsed) {
      hBtn.classList.remove("is-tactic-active");
      hBtn.classList.add("is-tactic-used");
      hBtn.disabled = true;
      hBtn.innerHTML = `<span>✓ ${hObj?.name || "Tática"} Usada</span>`;
      if (hHint) hHint.textContent = "Já utilizada nesta partida";
    } else {
      hBtn.classList.remove("is-tactic-active", "is-tactic-used");
      hBtn.disabled = false;
      hBtn.innerHTML = `<span>⚡ Ativar Tática: ${hObj?.name || "Rota do Céu"}</span>`;
      if (hHint) hHint.textContent = hObj?.shortEffect || "";
    }
  }

  const statsEl = document.getElementById("pitch-live-stats");
  if (statsEl && pitch.stats) {
    const s = pitch.stats;
    const totTicks = Math.max(1, s.userTicks + s.oppTicks);
    const userPoss = Math.round((s.userTicks / totTicks) * 100);
    statsEl.innerHTML = `
      <div class="pitch-stat-pill"><small>Posse</small><strong>${userPoss}% - ${100 - userPoss}%</strong></div>
      <div class="pitch-stat-pill"><small>Passes</small><strong>${s.userPassesOk}/${s.userPassesTry}</strong></div>
      <div class="pitch-stat-pill"><small>Dribles</small><strong>${s.userDribblesOk}/${s.userDribblesTry}</strong></div>
      <div class="pitch-stat-pill"><small>Roubos</small><strong>${s.userSteals}</strong></div>
      <div class="pitch-stat-pill"><small>Chutes</small><strong>${s.userShots} - ${s.oppShots}</strong></div>
    `;
  }
}

function buildLiveScoreboardHTML(st, stats, oppStats) {
  const stadiumStyle = UI.stadiumBg ? `background-image: url('${UI.stadiumBg}');` : "";
  const oppLvl = oppStats.oppLevel || oppStats.avgLevel || 1;
  const userTeamDisp = typeof getActiveTeamName === "function" ? getActiveTeamName() : "Dream Team";
  return `
    <div class="live-scoreboard" style="${stadiumStyle}">
      <div class="scoreboard-overlay"></div>
      <div class="score-team">
        ${UI.raimonEmblem ? `<img class="score-emblem" src="${UI.raimonEmblem}" alt="${escapeHtml(userTeamDisp)}" />` : `<div style="font-size:1.9rem;">⚡</div>`}
        <div style="font-weight:900; font-size:0.95rem; display:flex; align-items:center; justify-content:center; gap:5px;">
          <span>${escapeHtml(userTeamDisp)}</span>
          <span class="stage-opp-buff-badge" style="border-color:#4ade80; color:#86efac; background:rgba(21,128,61,0.35);">Nv. ${stats.avgLevel || 1}</span>
        </div>
        <div style="font-size:0.7rem; color:#fed7aa; font-weight:800;">Poder ${stats.power.toLocaleString("pt-BR")} • OVR ${stats.ovr} • Quím ${stats.chem}%</div>
      </div>

      <div class="score-digits">
        <span id="live-score-user">${st.userScore}</span>
        <span style="font-size:1.2rem; color:#93c5fd;">X</span>
        <span id="live-score-opp">${st.oppScore}</span>
      </div>

      <div class="score-team">
        <img class="score-emblem" src="${st.oppTeam.emblem}" alt="${st.oppTeam.name}" />
        <div style="font-weight:900; font-size:0.95rem; display:flex; align-items:center; justify-content:center; gap:5px;">
          <span>${st.oppTeam.name}</span>
          <span class="stage-opp-buff-badge">⚡ Nv. ${oppLvl}</span>
        </div>
        <div style="font-size:0.7rem; color:#facc15; font-weight:800;">Poder ${oppStats.power.toLocaleString("pt-BR")} • Nv. ${oppLvl} • OVR ${oppStats.ovr}</div>
      </div>
    </div>
  `;
}

function buildMatchRecapBoxHTML(st, oppTeam, stats = calcSquadStats(), oppStats = calcOpponentStats(oppTeam, state.tournament.stageIndex)) {
  const pitch = st.pitch;
  const s = pitch?.stats || {};
  const totTicks = Math.max(1, (s.userTicks || 0) + (s.oppTicks || 0));
  const userPoss = Math.round(((s.userTicks || 0) / totTicks) * 100);
  const oppPoss = 100 - userPoss;
  const passTry = s.userPassesTry || 0;
  const passOk = s.userPassesOk || 0;
  const passAcc = passTry > 0 ? Math.round((passOk / passTry) * 100) : 0;
  const dribTry = s.userDribblesTry || 0;
  const dribOk = s.userDribblesOk || 0;
  const dribAcc = dribTry > 0 ? Math.round((dribOk / dribTry) * 100) : 0;

  const matchPlayers = Object.values(s.playerStats || {});
  const bestMatchPlayer = matchPlayers
    .slice()
    .sort(
      (a, b) =>
        (b.goals * 6 + b.assists * 4.5 + b.steals * 1.7 + b.dribblesOk * 1.3 + b.saves * 1.2) -
        (a.goals * 6 + a.assists * 4.5 + a.steals * 1.7 + a.dribblesOk * 1.3 + a.saves * 1.2)
    )[0];

  const userTeamDisp = typeof getActiveTeamName === "function" ? getActiveTeamName() : "Dream Team";
  const verdictText = st.penaltiesText
    ? st.won
      ? "Vitória nos Pênaltis"
      : "Derrota nos Pênaltis"
    : st.won
    ? (userTeamDisp === "Dream Team" ? "Vitória do Dream Team" : `Vitória: ${userTeamDisp}`)
    : st.isDraw
    ? "Empate"
    : `Vitória de ${oppTeam.name}`;
  const recapCardCls = st.won ? "recap-win" : st.isDraw ? "recap-draw" : "recap-loss";
  const recapPillCls = st.won ? "is-win" : st.isDraw ? "is-draw" : "is-loss";

  return `
    <div id="live-match-recap-box" class="live-pitch-card match-recap-card ${recapCardCls}">
      <div class="recap-top-bar">
        <span class="recap-phase-tag">Placar &amp; Estatísticas · ${st.stageName}</span>
        <span class="recap-verdict-pill ${recapPillCls}">${verdictText}</span>
      </div>

      ${buildLiveScoreboardHTML(st, stats, oppStats)}

      <div class="recap-poss-block">
        <div class="recap-poss-labels">
          <strong style="color:#4ade80;">Posse: ${userPoss}%</strong>
          <span>Posse de Bola</span>
          <strong style="color:#f87171;">${oppPoss}%</strong>
        </div>
        <div class="recap-poss-bar">
          <div class="recap-poss-user" style="width:${userPoss}%;"></div>
          <div class="recap-poss-opp" style="width:${oppPoss}%;"></div>
        </div>
      </div>

      <div class="recap-stats-grid">
        <div class="recap-stat-item">
          <small>Chutes</small>
          <strong>${s.userShots || 0} x ${s.oppShots || 0}</strong>
          <span>${escapeHtml(userTeamDisp)} vs ${oppTeam.name}</span>
        </div>
        <div class="recap-stat-item">
          <small>Passes Certos</small>
          <strong style="color:#86efac;">${passOk}/${passTry}</strong>
          <span>${passAcc}% de acerto</span>
        </div>
        <div class="recap-stat-item">
          <small>Dribles Certos</small>
          <strong style="color:#c084fc;">${dribOk}/${dribTry}</strong>
          <span>${dribAcc}% de sucesso</span>
        </div>
        <div class="recap-stat-item">
          <small>Roubos</small>
          <strong style="color:#38bdf8;">${s.userSteals || 0}</strong>
          <span>${pluralPt(s.userBlocks || 0, "bloqueio", "bloqueios")} na área</span>
        </div>
        <div class="recap-stat-item">
          <small>Defesas (GOL)</small>
          <strong style="color:#facc15;">${s.userSaves || 0}</strong>
          <span>${pluralPt(s.userGkReleases || 0, "reposição", "reposições")}</span>
        </div>
        <div class="recap-stat-item">
          <small>Destaque</small>
          <strong style="font-size:0.84rem; color:#fde047;">${bestMatchPlayer ? bestMatchPlayer.name : "—"}</strong>
          <span>${
            bestMatchPlayer
              ? `${bestMatchPlayer.goals}G · ${bestMatchPlayer.assists}A · ${bestMatchPlayer.steals}R`
              : "—"
          }</span>
        </div>
      </div>
    </div>
  `;
}
