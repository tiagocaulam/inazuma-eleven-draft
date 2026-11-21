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
  pitch.ballVx = 0;
  pitch.ballVy = 0;
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
  const isExtraTime = type === "EXTRA_TIME";
  const isPenalties = type === "PENALTIES";
  const isFulltime = type === "FULLTIME";

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
    : isExtraTime
    ? "FIM DO TEMPO NORMAL • PRORROGAÇÃO"
    : isPenalties
    ? "FIM DA PRORROGAÇÃO • PÊNALTIS"
    : "APITO FINAL • FIM DE JOGO";

  const minuteText = isHalftime ? "45'" : isExtraTime ? "90'" : isPenalties ? "120'" : `${st.minute}'`;
  const soundText = isFulltime || isPenalties ? "⚡ FIIII-FIII-FIIIIII! ⚡" : "⚡ FIIII-FIIII! ⚡";

  const mainTitle = isHalftime
    ? "FIM DO PRIMEIRO TEMPO!"
    : isExtraTime
    ? "EMPATE NO TEMPO NORMAL!"
    : isPenalties
    ? "DECISÃO POR PÊNALTIS!"
    : st.won
    ? "VITÓRIA DO DREAM TEAM!"
    : st.isDraw
    ? "FIM DE JOGO • EMPATE!"
    : `VITÓRIA DE ${st.oppTeam?.name || "ADVERSÁRIO"}!`;

  const restBonus = (t?.prepBonuses?.restLvl || 0) * 4;
  const subtitleText = isHalftime
    ? `O árbitro apita o intervalo! Ambos os times recuperam fôlego (+${35 + restBonus}% linha / +${45 + restBonus}% goleiro).`
    : isExtraTime
    ? `O empate persiste aos 90'! Ambos os times recuperam +${30 + restBonus}% de fôlego para a Prorrogação!`
    : isPenalties
    ? "O árbitro encerra a prorrogação! A vaga será decidida nos pênaltis!"
    : isAdvancingToNextStage
    ? `Partida encerrada com avanço para ${nextStageName}!`
    : "O árbitro apita o fim da partida! Confira os números e os destaques.";

  const buttonText = isHalftime
    ? "⚡ Iniciar 2º Tempo ▶"
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

      <div class="referee-scoreboard">
        <span class="ref-team-name">${st.userTeamName || "Dream Team"}</span>
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
      }
    } else if (isExtraTime) {
      st.running = true;
      if (st.pitch) {
        st.pitch.minuteFloat = 90;
        st.minute = 90;
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
      st.pitch.ticker = `45' Fim do 1º tempo! Placar: ${st.userScore} x ${st.oppScore} (+${rec.userField}% Fôlego${restNote})`;
      const secondHalfSide = st.pitch.initialSide === "user" ? "opp" : "user";
      resetPitchForKickoff(st.pitch, secondHalfSide, true);
      syncLivePitchDOM(st);
    }
    prependNarrationLine(
      st,
      "nar-pass",
      `45' [Intervalo] Árbitro apitou o fim do 1º tempo (${st.userScore} x ${st.oppScore}) — Dream Team recupera +${rec.userField}% de fôlego (+${rec.userGk}% GOL)${restNote}!`,
      null,
      null,
      "FF"
    );
    showRefereeWhistleModal(st, "HALFTIME", () => {
      st.running = true;
      if (st.pitch) {
        st.pitch.minuteFloat = 45;
        st.minute = 45;
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
    if (st.pitch) {
      st.pitch.minuteFloat = 90;
      resetPitchForKickoff(st.pitch, "user", true);
      st.pitch.ticker = `90' Prorrogação iniciada! Dream Team recupera +${rec.userField}% de fôlego${restNote}!`;
      syncLivePitchDOM(st);
    }
    prependNarrationLine(
      st,
      "nar-save",
      `90' Empate no tempo normal! Dream Team recupera +${rec.userField}% de fôlego (+${rec.userGk}% GOL)${restNote} para a Prorrogação (até os 120')!`,
      null,
      null,
      "FF"
    );
    showRefereeWhistleModal(st, "EXTRA_TIME", () => {
      st.running = true;
      if (st.pitch) {
        st.pitch.minuteFloat = 90;
        st.minute = 90;
      }
      if (!st.finished && st.running) {
        startMatchInterval();
      }
    });
    return true;
  }

  if (st.minute === 105 && !st.etHalftimeHandled && st.maxMinute === 120) {
    st.etHalftimeHandled = true;
    const rec = applyIntervalStaminaRecharge(st, 18, 25);
    const restNote = rec.restBonus > 0 ? ` (+${rec.restBonus}% Descanso)` : "";
    if (st.pitch) {
      resetPitchForKickoff(st.pitch, "opp", true);
      st.pitch.ticker = `105' Virada da Prorrogação! Fôlego recarregado (+${rec.userField}%${restNote}) para os 15 minutos finais!`;
      syncLivePitchDOM(st);
    }
    prependNarrationLine(
      st,
      "nar-pass",
      `105' [Virada da Prorrogação] Dream Team recupera +${rec.userField}% de fôlego (+${rec.userGk}% GOL)${restNote} para o 2º tempo extra!`,
      null,
      null,
      "FF"
    );
  }

  if (st.minute >= st.maxMinute) {
    clearTournamentTimers(false);
    st.running = false;

    if (!st.isGroupStage && st.userScore === st.oppScore && !st.penalties) {
      st.finished = false;
      st.penalties = createPenaltyShootoutState(st);
      if (st.pitch) {
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
    prependNarrationLine(
      st,
      st.won ? "nar-goal-user" : st.isDraw ? "nar-save" : "nar-goal-opp",
      `${st.minute}' APITO FINAL! Dream Team ${st.userScore} x ${st.oppScore} ${st.oppTeam.name}${st.isDraw ? " (Empate)" : ""}!`,
      null,
      null,
      "FF"
    );
    if (st.isGroupStage) {
      finalizeWorldGroupRound(st);
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
  const keshinBonus = node.player?.keshin ? 1.5 : 0;
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

  let tacticalAndEnergyAdj = 0;
  if (node.side === "user") {
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
  } else if (node.side === "opp") {
    // Disciplina tática crescente das seleções e rivais de fases avançadas
    const active5v5 = state.tournament?.prep?.clash5v5?.miniSt;
    const isIn5v5 = Boolean(active5v5 && active5v5.running && !active5v5.finished);
    const sIdx = !isIn5v5 ? (state.tournament?.stageIndex || 0) : 0;
    tacticalAndEnergyAdj += Math.min(2.8, Math.max(0, sIdx - 1) * 0.32);

    // Adaptação silenciosa da CPU ao placar durante a partida
    const oppPost = getOpponentDynamicPosture();
    if (oppPost === "offensive") {
      if (roleOrAction === "SH" || roleOrAction === "OF" || roleOrAction === "FW") tacticalAndEnergyAdj += 1.4;
      else if (roleOrAction === "DF") tacticalAndEnergyAdj -= 1.0;
    } else if (oppPost === "defensive") {
      if (roleOrAction === "DF" || roleOrAction === "GK") tacticalAndEnergyAdj += 1.6;
      else if (roleOrAction === "SH") tacticalAndEnergyAdj -= 0.8;
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
  // Passiva: Pingente da Resistência Final — reduz em 50% o gasto de stamina a partir dos 75' (11x11)
  const active5v5 = state.tournament?.prep?.clash5v5?.miniSt;
  const isIn5v5 = Boolean(active5v5 && active5v5.running && !active5v5.finished);
  const curMinute = isIn5v5
    ? 0
    : state.tournament?.stages?.[state.tournament.stageIndex]?.minute || 0;
  const hasFinalResistance = !isIn5v5 && node.side === "user" && state.tournament?.prepBonuses?.lateMatchNoStaminaLoss;
  const lateMul = hasFinalResistance && curMinute >= 75 ? 0.5 : 1;
  const fisStat = node.attrs?.fis || 80;
  const fisMul = Math.max(0.76, Math.min(1.12, 1 - (fisStat - 82) * 0.004));
  const userInt = node.side === "user" ? getTactics().intensity : "medium";
  const tacIntMul = userInt === "high" ? 1.28 : userInt === "low" ? 0.86 : 1.0;
  const mul = (node.side === "user" ? state.tournament?.prepBonuses?.staminaMul || 1 : 1) * fisMul * tacIntMul * lateMul;
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
    ballVx: 0,
    ballVy: 0,
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

function computeNodeRoleTarget(node, pitch, carrier, chaserUid, coverUid, deepestOppDefX, deepestOwnDefX, isGkHolding = false, gkMarkMap = null) {
  const isUser = node.side === "user";
  const dir = isUser ? 1 : -1;
  const ownGoalX = isUser ? 4 : 96;
  const oppGoalX = isUser ? 96 : 4;
  const inPossession = pitch.ballSide === node.side;
  const ballX = pitch.ballFlight ? pitch.ballFlight.toX : pitch.passState ? pitch.passState.toX : pitch.ballX;
  const ballY = pitch.ballFlight ? pitch.ballFlight.toY : pitch.passState ? pitch.passState.toY : pitch.ballY;
  const t = pitch.simTime || 0;
  const tr = node.tacticalRole || node.role;

  // 1) Se está recebendo um passe em voo, avança com dash/sprint até encontrar a trajetória real da bola!
  if (pitch.ballMode === "PASS_FLIGHT" && pitch.passState && pitch.passState.receiverUid === node.uid) {
    const ps = pitch.passState;
    const curBallX = pitch.ballX ?? ps.toX;
    const curBallY = pitch.ballY ?? ps.toY;
    // Na segunda metade do voo, converge diretamente para a bola viva para nunca errar o encontro
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
    const predX = Math.max(6, Math.min(94, (pitch.ballX ?? 50) + (ls.vx || 0) * 0.16));
    const predY = Math.max(9, Math.min(91, (pitch.ballY ?? 50) + (ls.vy || 0) * 0.16));
    const inOwnPenaltyBox = isUser ? predX <= 16.5 && Math.abs(predY - 50) <= 22 : predX >= 83.5 && Math.abs(predY - 50) <= 22;

    if (tr === "GK" && inOwnPenaltyBox) {
      return { tx: predX, ty: predY, sprint: 1.35 };
    }
    const isAttRunner = ls.receiverUid === node.uid || pitch.looseAttChaserUid === node.uid;
    const isDefRunner = pitch.looseDefChaserUid === node.uid;
    if ((isAttRunner || isDefRunner) && node.staggerTimer <= 0) {
      const distLoose = Math.hypot(predX - node.x, predY - node.y);
      if (distLoose >= 4.0) {
        node.receiveDashUntil = Math.max(node.receiveDashUntil || 0, t + 0.24);
      }
      const urgentBoost = (ls.age || 0) > 1.8 ? 1.72 : distLoose > 5.0 ? 1.62 : 1.45;
      return {
        tx: Math.max(8, Math.min(92, predX)),
        ty: Math.max(10, Math.min(90, predY)),
        sprint: urgentBoost
      };
    }
  }

  // 2) Portador da bola: conduz livremente buscando espaço e desviando de marcadores!
  if (carrier && carrier.uid === node.uid && pitch.ballMode === "CARRIED") {
    if (tr === "GK") {
      return {
        tx: isUser ? 11.5 : 88.5,
        ty: Math.max(42, Math.min(58, node.baseY + (ballY - 50) * 0.25)),
        sprint: 0.72
      };
    }
    const defNodes = isUser ? pitch.oppNodes : pitch.userNodes;
    const laneAim = isUser && !pitch.is5v5 ? getTactics().lane : "balanced";
    let carrierLaneY = 50 + Math.sin(t * 1.1 + node.wanderPhase) * 16;
    if (laneAim === "wings") {
      const wingCorridorY = node.y < 50 ? 19 : 81;
      carrierLaneY = Math.abs(oppGoalX - node.x) > 22 ? wingCorridorY : (node.y < 50 ? 34 : 66);
    } else if (laneAim === "center") {
      carrierLaneY = 50 + Math.sin(t * 1.1 + node.wanderPhase) * 7;
    }
    let steerX = oppGoalX - dir * 10 - node.x;
    let steerY = carrierLaneY - node.y;
    const distGoal = Math.hypot(steerX, steerY) || 1;
    steerX /= distGoal;
    steerY /= distGoal;

    // Steering avoidance ao redor de marcadores próximos para driblar pelo espaço livre
    defNodes.forEach((d) => {
      if (d.role === "GK") return;
      const dx = node.x - d.x;
      const dy = node.y - d.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 0.1 && dist < 14.5) {
        const repulse = Math.pow((14.5 - dist) / 14.5, 1.35) * 1.85;
        steerX += (dx / dist) * repulse * 0.45;
        steerY += (dy / dist) * repulse * 1.15;
      }
    });

    if (node.y < 16) steerY += 0.7;
    if (node.y > 84) steerY -= 0.7;

    return {
      tx: Math.max(8, Math.min(92, node.x + steerX * 14)),
      ty: Math.max(11, Math.min(89, node.y + steerY * 14)),
      sprint: node.staggerTimer > 0 ? 0.55 : 1.04
    };
  }

  // 3) Goleiro sem bola: interposto entre a bola e o centro do gol
  if (tr === "GK") {
    const gx = isUser ? 6.2 + (ballX / 100) * 3.5 : 93.8 - ((100 - ballX) / 100) * 3.5;
    const gy = Math.max(40, Math.min(60, 50 + (ballY - 50) * 0.24));
    return { tx: gx, ty: gy, sprint: 0.9 };
  }

  // 4) Defendendo: quando o goleiro rival segura a bola, fecha linhas de passe sem invadir a área; caso contrário fecha o portador!
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
      // Demais defensores sem marcação individual caem para o reposicionamento tático na seção 5
    }
    const targetAnchorX = carrier ? carrier.x + (carrier.vx || 0) * 0.22 : ballX;
    const targetAnchorY = carrier ? carrier.y + (carrier.vy || 0) * 0.22 : ballY;
    const dangerousZone = isUser ? ballX <= 42 : ballX >= 58;

    if (!isGkHolding && chaserUid === node.uid && node.staggerTimer <= 0) {
      return {
        tx: Math.max(8, Math.min(92, targetAnchorX)),
        ty: Math.max(10, Math.min(90, targetAnchorY)),
        sprint: 1.08
      };
    }
    if (!isGkHolding && coverUid === node.uid && node.staggerTimer <= 0) {
      // Se o adversário estiver perigoso próximo à área, o segundo zagueiro fecha junto em dobra de marcação!
      if (dangerousZone) {
        const flankOffset = carrier && carrier.y < 50 ? 3.5 : -3.5;
        return {
          tx: Math.max(8, Math.min(92, targetAnchorX + (isUser ? -1.5 : 1.5))),
          ty: Math.max(12, Math.min(88, targetAnchorY + flankOffset)),
          sprint: 1.04
        };
      }
      return {
        tx: Math.max(8, Math.min(92, targetAnchorX * 0.78 + ownGoalX * 0.22)),
        ty: Math.max(12, Math.min(88, targetAnchorY * 0.76 + 50 * 0.24)),
        sprint: 0.96
      };
    }
  }

  // 5) Posicionamento tático fluido por função (com bola vs sem bola)
  const ballShift = (ballX - 50) * 0.34;
  const latPull = (ballY - 50) * (inPossession ? 0.24 : 0.36);

  if (tr === "CB" || tr === "LIB") {
    if (inPossession) {
      const pushDepth = tr === "LIB" ? 13 : 8;
      const maxHoldX = isUser ? 52 : 48;
      const rawX = node.baseX + dir * pushDepth + ballShift * 0.65;
      return {
        tx: isUser ? Math.min(maxHoldX, Math.max(16, rawX)) : Math.max(maxHoldX, Math.min(84, rawX)),
        ty: Math.max(16, Math.min(84, node.baseY + latPull * 0.55)),
        sprint: 0.78
      };
    } else {
      const holdX = isUser
        ? Math.max(13, Math.min(node.baseX + 4, ballX - 8))
        : Math.min(87, Math.max(node.baseX - 4, ballX + 8));
      const tuckY = node.baseY * 0.72 + ballY * 0.28;
      return { tx: holdX, ty: Math.max(14, Math.min(86, tuckY)), sprint: 0.9 };
    }
  }

  if (tr === "FB" || tr === "WB") {
    const sameFlankAsBall = (node.baseY < 50 && ballY < 54) || (node.baseY >= 50 && ballY >= 46);
    if (inPossession) {
      const overlapBoost = sameFlankAsBall ? (tr === "WB" ? 27 : 21) : tr === "WB" ? 16 : 11;
      const rawX = node.baseX + dir * overlapBoost + ballShift * 0.45;
      const wideY = node.baseY < 50 ? Math.min(18, node.baseY) : Math.max(82, node.baseY);
      return {
        tx: Math.max(14, Math.min(86, rawX)),
        ty: wideY,
        sprint: sameFlankAsBall ? 1.0 : 0.85
      };
    } else {
      const holdX = isUser
        ? Math.max(13, Math.min(node.baseX + 3, ballX - 5))
        : Math.min(87, Math.max(node.baseX - 3, ballX + 5));
      const trackY = node.baseY * 0.82 + ballY * 0.18;
      return { tx: holdX, ty: Math.max(10, Math.min(90, trackY)), sprint: 0.92 };
    }
  }

  if (tr === "DM") {
    if (inPossession) {
      const pivotX = Math.max(18, Math.min(82, ballX - dir * 13));
      const oppSideY = ballY < 50 ? 56 : 44;
      return { tx: pivotX, ty: node.baseY * 0.55 + oppSideY * 0.45, sprint: 0.84 };
    } else {
      const shieldX = isUser ? deepestOwnDefX + 10 : deepestOwnDefX - 10;
      return {
        tx: Math.max(18, Math.min(82, shieldX * 0.6 + ballX * 0.4)),
        ty: Math.max(24, Math.min(76, 50 + (ballY - 50) * 0.45)),
        sprint: 0.9
      };
    }
  }

  if (tr === "CM" || tr === "WM") {
    if (inPossession) {
      const adv = tr === "WM" ? 16 : 11;
      const wobble = Math.sin(t * 1.15 + node.wanderPhase) * 6;
      const wideY =
        tr === "WM"
          ? node.baseY < 50
            ? 16
            : 84
          : Math.max(20, Math.min(80, node.baseY + latPull * 0.5 + wobble));
      return {
        tx: Math.max(18, Math.min(84, node.baseX + dir * adv + ballShift * 0.55)),
        ty: wideY,
        sprint: 0.88
      };
    } else {
      return {
        tx: Math.max(16, Math.min(84, node.baseX - dir * 5 + ballShift * 0.55)),
        ty: Math.max(14, Math.min(86, node.baseY + latPull * 0.6)),
        sprint: 0.88
      };
    }
  }

  if (tr === "AM") {
    if (inPossession) {
      const holeX = isUser ? Math.min(80, Math.max(54, deepestOppDefX - 8)) : Math.max(20, Math.min(46, deepestOppDefX + 8));
      const probeY = 50 + Math.sin(t * 1.35 + node.wanderPhase) * 14 + (ballY < 50 ? 6 : -6);
      return { tx: holeX, ty: Math.max(22, Math.min(78, probeY)), sprint: 0.94 };
    } else {
      return {
        tx: Math.max(22, Math.min(78, ballX * 0.45 + node.baseX * 0.55)),
        ty: Math.max(22, Math.min(78, ballY * 0.45 + 50 * 0.55)),
        sprint: 0.86
      };
    }
  }

  if (tr === "WING") {
    const ballOnOppositeFlank = (node.baseY < 50 && ballY > 56) || (node.baseY >= 50 && ballY < 44);
    if (inPossession) {
      // No 11x11 com impedimento, pontas não estouram a linha de impedimento; buscam ficar no limite legal (onside)
      const maxLegalPushX = pitch.is5v5
        ? (isUser ? 89 : 11)
        : (isUser ? Math.min(88, Math.max(52, deepestOppDefX - 0.5)) : Math.max(12, Math.min(48, deepestOppDefX + 0.5)));
      const pushX = isUser
        ? Math.min(maxLegalPushX, Math.max(66, deepestOppDefX - 0.5))
        : Math.max(maxLegalPushX, Math.min(34, deepestOppDefX + 0.5));
      const targetY = ballOnOppositeFlank
        ? node.baseY < 50
          ? 34
          : 66
        : node.baseY < 50
        ? 14
        : 86;
      return { tx: pushX, ty: targetY, sprint: 0.98 };
    } else {
      return {
        tx: Math.max(20, Math.min(80, ballX - dir * 6)),
        ty: Math.max(14, Math.min(86, node.baseY * 0.72 + ballY * 0.28)),
        sprint: 0.84
      };
    }
  }

  // ST (CA / ATA): espeta na última linha defensiva e faz desmarcações!
  // Inteligência tática: no 11x11, atacantes aprendem a NÃO ficar impedidos e recuam para posição legal se estiverem adiantados.
  if (inPossession) {
    let lineX;
    if (pitch.is5v5) {
      // No 5x5 NÃO existe impedimento, atacante pode espetar e infiltrar livremente!
      lineX = isUser
        ? Math.min(90, Math.max(66, deepestOppDefX + 1.2))
        : Math.max(10, Math.min(34, deepestOppDefX - 1.2));
    } else {
      // No 11x11: monitora a linha defensiva adversária (deepestOppDefX).
      // Se o atacante estiver adiantado além da linha de impedimento (ou na iminência),
      // ele recua ativamente 0.8 a 1.5m para sair do impedimento e dar opção de passe limpa.
      const isPastDefLine = isUser ? node.x >= deepestOppDefX - 0.2 : node.x <= deepestOppDefX + 0.2;
      const legalHoldX = isUser
        ? Math.min(87, Math.max(52, deepestOppDefX - 0.8))
        : Math.max(13, Math.min(48, deepestOppDefX + 0.8));

      lineX = isPastDefLine ? legalHoldX : (isUser ? Math.min(legalHoldX, node.baseX + 16) : Math.max(legalHoldX, node.baseX - 16));
    }
    const runY = node.baseY + Math.sin(t * 1.55 + node.wanderPhase) * 12;
    return { tx: lineX, ty: Math.max(24, Math.min(76, runY)), sprint: 1.0 };
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
      ty: Math.max(26, Math.min(74, ballY * 0.55 + node.baseY * 0.45)),
      sprint: 0.82
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
  let gkMarkMap = null;

  if (isGkHolding) {
    pitch.chaserUid = null;
    pitch.challengerUid = null;

    // Marcadores saem de cima do goleiro e fecham os possíveis receptores do passe curto/médio
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
    const rankedDefs = defNodes
      .filter((d) => d.role !== "GK" && (d.staggerTimer || 0) <= 0)
      .map((d) => ({
        uid: d.uid,
        dist: Math.hypot(d.x - (carrier ? carrier.x : ballRefX), (d.y - (carrier ? carrier.y : ballRefY)) * 1.1)
      }))
      .sort((a, b) => a.dist - b.dist);

    chaserUid = rankedDefs[0]?.uid || null;
    coverUid = rankedDefs[1]?.uid || null;
    pitch.chaserUid = chaserUid;
    pitch.challengerUid = carrier && chaserUid && rankedDefs[0].dist < 10 ? chaserUid : null;
  }

  if (pitch.ballMode === "LOOSE_BALL" && pitch.looseState) {
    const attTeamNodes = attIsUser ? pitch.userNodes : pitch.oppNodes;
    const defTeamNodes = attIsUser ? pitch.oppNodes : pitch.userNodes;
    const recNode = findPitchNode(pitch, pitch.looseState.receiverUid);
    const bestAtt = (recNode && recNode.role !== "GK" && (recNode.staggerTimer || 0) <= 0)
      ? recNode
      : attTeamNodes
          .filter((n) => n.role !== "GK" && (n.staggerTimer || 0) <= 0)
          .sort((a, b) => Math.hypot(a.x - ballRefX, a.y - ballRefY) - Math.hypot(b.x - ballRefX, b.y - ballRefY))[0];
    const bestDef = defTeamNodes
      .filter((n) => n.role !== "GK" && (n.staggerTimer || 0) <= 0)
      .sort((a, b) => Math.hypot(a.x - ballRefX, a.y - ballRefY) - Math.hypot(b.x - ballRefX, b.y - ballRefY))[0];
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
        gkMarkMap
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
    linear: linearShot
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
      if (pitch.passTrail) {
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
  const stepDomNode = (node) => {
    const el = document.getElementById(`pnode-${node.uid}`);
    if (el) {
      el.style.left = `${node.x.toFixed(2)}%`;
      el.style.top = `${node.y.toFixed(2)}%`;
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

  let ballScale = 1;
  let ballTransform = "translate(-50%, -50%)";
  if (pitch.ballFlight) {
    const f = pitch.ballFlight;
    const t = Math.min(1, Math.max(0, (now - f.start) / f.duration));
    const isShot = f.kind === "SHOT" || f.kind === "GOAL";
    const eased = isShot ? (f.linear ? t : Math.pow(t, 1.06)) : (1 - Math.pow(1 - t, 2.1));
    pitch.ballX = f.fromX + (f.toX - f.fromX) * eased;
    const verticalArc = isShot ? 0 : Math.sin(t * Math.PI) * (f.arcHeight || 0);
    pitch.ballY = f.fromY + (f.toY - f.fromY) * eased - verticalArc;

    if (isShot) {
      // Disparo direto reto: distorção de movimento (squash & stretch alinhado à trajetória)
      const dx = f.toX - f.fromX;
      const dy = (f.toY - f.fromY) * 0.55;
      const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
      const flightIntensity = f.linear ? 0.65 + 0.35 * Math.sin(t * Math.PI) : Math.sin(t * Math.PI);
      const stretch = 1.0 + flightIntensity * 0.72;
      const squash = Math.max(0.62, 1.0 - flightIntensity * 0.32);
      ballTransform = `translate(-50%, -50%) rotate(${angleDeg.toFixed(1)}deg) scale(${stretch.toFixed(2)}, ${squash.toFixed(2)})`;
    } else {
      ballScale = 1 + Math.sin(t * Math.PI) * 0.28;
      ballTransform = `translate(-50%, -50%) scale(${ballScale.toFixed(2)})`;
    }
    if (pitch.passTrail) {
      pitch.passTrail.curX = pitch.ballX;
      pitch.passTrail.curY = pitch.ballY;
    }
    if (t >= 1) {
      pitch.ballX = f.toX;
      pitch.ballY = f.toY;
      if (!pitch.carrierUid) {
        pitch.holdBallPos = { x: f.toX, y: f.toY };
      }
      pitch.ballFlight = null;
    }
  } else if (pitch.passState && pitch.ballMode === "PASS_FLIGHT") {
    ballScale = 1 + Math.sin(pitch.passState.progress * Math.PI) * 0.22;
    ballTransform = `translate(-50%, -50%) scale(${ballScale.toFixed(2)})`;
    if (pitch.passTrail) {
      pitch.passTrail.curX = pitch.ballX;
      pitch.passTrail.curY = pitch.ballY;
      pitch.passTrail.u = easePassProgress(pitch.passState.progress);
      pitch.passTrail.fadeUntil = now + 400;
    }
  } else if (pitch.ballMode === "LOOSE_BALL" && pitch.looseState) {
    const speedMag = Math.hypot(pitch.looseState.vx || 0, pitch.looseState.vy || 0);
    const rollSpin = ((pitch.simTime || 0) * speedMag * 18) % 360;
    ballTransform = `translate(-50%, -50%) rotate(${rollSpin.toFixed(0)}deg)`;
  } else if (pitch.holdBallPos && !pitch.carrierUid) {
    pitch.ballX = pitch.holdBallPos.x;
    pitch.ballY = pitch.holdBallPos.y;
  }

  const ballEl = document.getElementById("live-pitch-ball");
  if (ballEl) {
    ballEl.style.left = `${pitch.ballX.toFixed(2)}%`;
    ballEl.style.top = `${pitch.ballY.toFixed(2)}%`;
    ballEl.style.transform = ballTransform;
  }

  const lineGlow = document.getElementById("pitch-pass-glow");
  const lineMain = document.getElementById("pitch-pass-line");
  if (lineGlow && lineMain) {
    const tr = pitch.passTrail;
    if (tr && now < tr.fadeUntil) {
      const fromX = Number.isFinite(tr.fromX) ? tr.fromX : 50;
      const fromY = Number.isFinite(tr.fromY) ? tr.fromY : 50;
      const rawEndX = tr.curX !== undefined ? tr.curX : tr.toX;
      const rawEndY = tr.curY !== undefined ? tr.curY : tr.toY;
      const endX = Number.isFinite(rawEndX) ? rawEndX : fromX;
      const endY = Number.isFinite(rawEndY) ? rawEndY : fromY;
      const remain = Math.max(0, Math.min(1, (tr.fadeUntil - now) / 460));
      let pathD;
      if (Number.isFinite(tr.ctrlX) && Number.isFinite(tr.ctrlY)) {
        const u = Number.isFinite(tr.u) ? Math.max(0.02, Math.min(1, tr.u)) : 1;
        // De Casteljau: sub-curva exata de 0 até u para o traçado acompanhar a parábola da bola!
        const subCx = fromX + (tr.ctrlX - fromX) * u;
        const subCy = fromY + (tr.ctrlY - fromY) * u;
        pathD = `M ${fromX.toFixed(1)} ${fromY.toFixed(1)} Q ${subCx.toFixed(1)} ${subCy.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;
      } else {
        pathD = `M ${fromX.toFixed(1)} ${fromY.toFixed(1)} L ${endX.toFixed(1)} ${endY.toFixed(1)}`;
      }
      lineGlow.setAttribute("d", pathD);
      lineGlow.setAttribute("stroke", tr.color);
      lineGlow.style.opacity = (0.38 * remain).toFixed(2);

      lineMain.setAttribute("d", pathD);
      lineMain.setAttribute("stroke", tr.color);
      lineMain.style.opacity = (0.95 * remain).toFixed(2);
    } else {
      pitch.passTrail = null;
      lineGlow.style.opacity = "0";
      lineMain.style.opacity = "0";
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

  let lastNow = performance.now();

  const step = (now) => {
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

    renderPitchDOMFrame(pitch, st, now);

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

  let candidates = nodes.filter((n) => {
    if (n.uid === carrier.uid || n.role === "GK") return false;
    const dxForward = attIsUser ? n.targetX - carrier.x : carrier.x - n.targetX;
    if (strictForward) {
      // No terço final ou dentro da área, só toca se o colega estiver na linha da bola ou à frente (NUNCA para trás!)
      return dxForward >= -2 && (order[n.role] ?? 1) >= Math.min(2, curRank);
    }
    return (order[n.role] ?? 1) >= curRank && (order[n.role] ?? 1) <= curRank + 1;
  });

  if (!strictForward && effRole === "FW") {
    candidates = nodes.filter((n) => {
      if (n.uid === carrier.uid || n.role === "GK") return false;
      const dxForward = attIsUser ? n.targetX - carrier.x : carrier.x - n.targetX;
      return dxForward >= -6 && (n.role === "FW" || n.role === "MF");
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

  const weights = candidates.map((n) => {
    const forwardGain = attIsUser ? n.targetX - carrier.x : carrier.x - n.targetX;
    const dist = Math.hypot(n.targetX - carrier.x, n.targetY - carrier.y);
    const forwardFactor =
      forwardGain >= 5 ? 2.05 : forwardGain >= 0 ? 1.60 : forwardGain >= -6 ? 0.78 : 0.18;
    const distFactor = dist >= 9 && dist <= 40 ? 1.45 : dist < 6 ? 0.35 : 0.8;

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
    const openFactor =
      (minDefDist >= 12 ? 2.4 : minDefDist >= 8 ? 1.75 : minDefDist >= 5.5 ? 1.0 : 0.42) *
      (laneDefDist >= 8 ? 1.35 : laneDefDist < 4.0 ? 0.45 : 0.95);
    const staminaW = n.stamina >= 45 ? 1.15 : 0.55;
    const antiPingPongW = pitch && pitch.lastPasserUid === n.uid ? 0.40 : 1.0;
    const wingSwitchW = Math.abs(n.targetY - carrier.y) >= 16 && forwardGain >= -3 && minDefDist >= 7.5 ? 1.65 : 1.0;
    const skillW = Math.pow(Math.max(55, n.effOvr) / 80, 0.85);
    let tacticLaneW = 1.0;
    if (attIsUser && !pitch?.is5v5) {
      const laneMode = getTactics().lane;
      const isWide = n.targetY < 34 || n.targetY > 66;
      if (laneMode === "wings") tacticLaneW = isWide ? 1.95 : 0.52;
      else if (laneMode === "center") tacticLaneW = isWide ? 0.52 : 1.95;
    }

    // Inteligência de passe por elemento: se o goleiro adversário tem elemento desfavorável pro portador,
    // prioriza passar para companheiros que tenham vantagem elemental sobre o goleiro
    const oppGk = defNodes?.find((d) => d.role === "GK");
    let elemSynergyW = 1.0;
    if (oppGk?.player?.element && n.player?.element) {
      if (ELEMENT_ADVANTAGE[n.player.element] === oppGk.player.element) {
        elemSynergyW = 1.65; // Vantagem contra o goleiro: procura muito esse companheiro!
      } else if (ELEMENT_ADVANTAGE[oppGk.player.element] === n.player.element) {
        elemSynergyW = 0.75; // Também desfavorecido contra o GK
      }
    }

    // Regra de impedimento: no 5x5 NÃO há impedimento. No 11x11, evita tocar para jogador adiantado na banheira em posição irregular
    const oppOutfieldDefs = (defNodes || []).filter((d) => d.role !== "GK");
    const oppDefLineX = oppOutfieldDefs.length > 0
      ? (attIsUser ? Math.max(...oppOutfieldDefs.map((d) => d.x)) : Math.min(...oppOutfieldDefs.map((d) => d.x)))
      : (attIsUser ? 84 : 16);

    const isCandidateOffside = !pitch.is5v5 && (attIsUser
      ? (n.x > 50 && n.x > carrier.x + 0.6 && n.x > oppDefLineX + 0.6)
      : (n.x < 50 && n.x < carrier.x - 0.6 && n.x < oppDefLineX - 0.6));

    if (isCandidateOffside) {
      return 0.001; // Inteligência tática: recusa passar para companheiro em posição de impedimento!
    }

    // Bônus para companheiro com corredor aberto à frente para receber passe no espaço vazio
    const openForwardGrass = attIsUser ? (oppDefLineX - n.x) : (n.x - oppDefLineX);
    const spaceRunBonus = (openForwardGrass >= 6 && forwardGain >= 0) ? 1.45 : 1.0;

    return forwardFactor * distFactor * openFactor * staminaW * antiPingPongW * wingSwitchW * skillW * elemSynergyW * spaceRunBonus * tacticLaneW;
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
    const teamLabel = isUserPoss ? "DREAM TEAM" : (pitch.oppTeamName || "ADVERSÁRIO").toUpperCase();
    const dirArrow = isUserPoss ? "Atacando ➔" : "⬅ Atacando";
    possBar.innerHTML = `
      <span class="poss-team-chip">
        <span class="poss-pulse-dot"></span>
        <span>POSSE: ${teamLabel}</span>
      </span>
      <span class="poss-dir-label">${dirArrow}</span>
    `;
  }

  const updateNodeState = (list) => {
    list.forEach((node) => {
      const el = document.getElementById(`pnode-${node.uid}`);
      if (!el) return;
      el.classList.toggle("has-ball", node.uid === pitch.carrierUid);
      el.classList.toggle("is-challenger", node.uid === pitch.challengerUid);
      el.classList.toggle("is-tired", node.stamina < 45);

      const stamBar = el.querySelector(".pitch-token-stamina-fill");
      if (stamBar) {
        stamBar.style.width = `${Math.round(node.stamina)}%`;
        stamBar.style.backgroundColor =
          node.stamina >= 70 ? "#4ade80" : node.stamina >= 45 ? "#facc15" : "#ef4444";
      }
    });
  };

  updateNodeState(pitch.userNodes);
  updateNodeState(pitch.oppNodes);
  syncNodeBadgesDOM(pitch, performance.now());

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
  return `
    <div class="live-scoreboard" style="${stadiumStyle}">
      <div class="scoreboard-overlay"></div>
      <div class="score-team">
        ${UI.raimonEmblem ? `<img class="score-emblem" src="${UI.raimonEmblem}" alt="Dream Team" />` : `<div style="font-size:1.9rem;">⚡</div>`}
        <div style="font-weight:900; font-size:0.95rem; display:flex; align-items:center; justify-content:center; gap:5px;">
          <span>Dream Team</span>
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

  const verdictText = st.penaltiesText
    ? st.won
      ? "Vitória nos Pênaltis"
      : "Derrota nos Pênaltis"
    : st.won
    ? "Vitória do Dream Team"
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
          <span>Dream vs ${oppTeam.name}</span>
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
