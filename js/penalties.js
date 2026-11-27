const PENALTY_CORNERS = [
  { id: 0, label: "Canto Superior Esquerdo", short: "Sup. Esq.", x: 19, y: 28, col: 0, diveCls: "dive-left" },
  { id: 1, label: "Centro Alto", short: "Centro Alto", x: 50, y: 28, col: 1, diveCls: "dive-center" },
  { id: 2, label: "Canto Superior Direito", short: "Sup. Dir.", x: 81, y: 28, col: 2, diveCls: "dive-right" },
  { id: 3, label: "Canto Inferior Esquerdo", short: "Inf. Esq.", x: 19, y: 74, col: 0, diveCls: "dive-left" },
  { id: 4, label: "Centro Baixo", short: "Centro Baixo", x: 50, y: 74, col: 1, diveCls: "dive-center" },
  { id: 5, label: "Canto Inferior Direito", short: "Inf. Dir.", x: 81, y: 74, col: 2, diveCls: "dive-right" }
];

function createPenaltyShootoutState(st) {
  const pitch = st.pitch;
  const scorePriority = (n) =>
    (n.role === "GK" ? -100 : n.role === "FW" ? 16 : n.role === "MF" ? 9 : 2) + n.effOvr;
  const userOrder = [...(pitch?.userNodes || [])].sort((a, b) => scorePriority(b) - scorePriority(a));
  const oppOrder = [...(pitch?.oppNodes || [])].sort((a, b) => scorePriority(b) - scorePriority(a));
  const userGk = pitch?.userNodes?.find((n) => n.role === "GK") || userOrder[userOrder.length - 1];
  const oppGk = pitch?.oppNodes?.find((n) => n.role === "GK") || oppOrder[oppOrder.length - 1];

  return {
    phase: "ORDER",
    firstSide: "user",
    activeSide: "user",
    userOrder,
    oppOrder,
    userGk,
    oppGk,
    swapIdx: null,
    userKicks: [],
    oppKicks: [],
    userGoals: 0,
    oppGoals: 0,
    userTaken: 0,
    oppTaken: 0,
    lastAnim: null
  };
}

function isPenaltyShootoutDecided(pen) {
  if (!pen) return false;
  if (pen.userTaken < 5 || pen.oppTaken < 5) {
    const remUser = Math.max(0, 5 - pen.userTaken);
    const remOpp = Math.max(0, 5 - pen.oppTaken);
    if (pen.userGoals - pen.oppGoals > remOpp) return true;
    if (pen.oppGoals - pen.userGoals > remUser) return true;
    return false;
  }
  return pen.userTaken === pen.oppTaken && pen.userGoals !== pen.oppGoals;
}

function getCurrentPenaltyKicker(pen, side) {
  const list = side === "user" ? pen.userOrder : pen.oppOrder;
  const taken = side === "user" ? pen.userTaken : pen.oppTaken;
  return list[taken % list.length];
}

function awardPostMatchExperience(st) {
  if (!st || st.isGoldenGoal5v5 || st._postMatchXpAwarded) return;
  st._postMatchXpAwarded = true;
  const baseXp = st.won ? 88 : st.isDraw ? 62 : 42;
  const cleanSheetBonus = st.won && st.oppScore === 0 ? 6 : 0;
  const marginBonus = st.won && (st.userScore - st.oppScore) >= 2 ? 5 : 0;
  const xpSpiritLvl = Math.min(3, state.tournament?.prepBonuses?.xpSpiritLvl || 0);
  const xpMult = [1, 1.12, 1.24, 1.36][xpSpiritLvl] || 1;

  const pStats = st.pitch?.stats?.playerStats || {};
  const leveledNames = [];
  let minXpGained = Infinity;
  let maxXpGained = 0;

  getSlots().forEach((slot) => {
    const p = state.squad[slot.id];
    if (!p) return;
    const uid = `u_${slot.id}`;
    const ps = pStats[uid] || {};
    const rawPerfXp =
      (ps.goals || 0) * 10 +
      (ps.assists || 0) * 8 +
      Math.min(4, ps.saves || 0) * 6 +
      Math.min(4, ps.steals || 0) * 5 +
      Math.min(3, ps.blocks || 0) * 5 +
      Math.min(5, ps.passesOk || 0) * 2.0 +
      Math.min(4, ps.dribblesOk || 0) * 2.5;
    const perfXp = Math.min(38, rawPerfXp);
    const luckyMul = typeof hasPlayerEquippedItem === "function" && hasPlayerEquippedItem(p, "lucky_amulet") ? 1.20 : 1.0;
    const gained = Math.round((baseXp + cleanSheetBonus + marginBonus + perfXp) * xpMult * luckyMul);
    minXpGained = Math.min(minXpGained, gained);
    maxXpGained = Math.max(maxXpGained, gained);

    const res = gainPlayerXp(p, gained, slot.role);
    if (res.levelsGained > 0) {
      const moveNote = res.learnedMoves?.length ? ` [Aprendeu: ${res.learnedMoves.map((m) => m.move).join(", ")}]` : "";
      leveledNames.push(`${p.name} (Nv.${getPlayerLevel(p)})${moveNote}`);
    }
  });

  const bonusPct = Math.round((xpMult - 1) * 100);
  const xpSummaryTxt = minXpGained <= maxXpGained
    ? `+${minXpGained}${minXpGained !== maxXpGained ? ` a +${maxXpGained}` : ""} XP${bonusPct > 0 ? ` (+${bonusPct}% Espírito)` : ""}`
    : "";

  if (leveledNames.length > 0) {
    prependNarrationLine(
      st,
      "nar-goal-user",
      `📈 [Evolução Pós-Jogo • ${xpSummaryTxt}] Subiram de nível: ${leveledNames.join(", ")}!`,
      null,
      null,
      "FF"
    );
  } else if (xpSummaryTxt) {
    prependNarrationLine(
      st,
      "nar-pass",
      `📈 [Experiência Pós-Jogo] O elenco recebeu ${xpSummaryTxt} acumulados para o próximo nível!`,
      null,
      null,
      "FF"
    );
  }
  renderHeaderAndBonds();
}

function finishPenaltyShootout(st) {
  const pen = st.penalties;
  if (!pen || st.finished) return;
  if (state.tournament.penTimerId) {
    clearTimeout(state.tournament.penTimerId);
    state.tournament.penTimerId = null;
  }
  pen.phase = "DONE";
  st.won = pen.userGoals > pen.oppGoals;
  st.finished = true;
  st.running = false;
  if (typeof recordBetaPostMatchMemory === "function") {
    recordBetaPostMatchMemory(st);
  }
  const userTeamDisp = typeof getActiveTeamName === "function" ? getActiveTeamName() : "Dream Team";
  st.penaltiesText = `Decisão por Pênaltis: ${userTeamDisp} ${pen.userGoals} x ${pen.oppGoals} ${st.oppTeam.name}`;
  prependNarrationLine(
    st,
    st.won ? "nar-goal-user" : "nar-goal-opp",
    `${st.won ? "VITÓRIA NOS PÊNALTIS!" : "DERROTA NOS PÊNALTIS!"} ${st.penaltiesText}!`,
    null,
    null,
    null
  );
  awardPostMatchExperience(st);
  if (typeof advanceTournamentBracketAfterStage === "function") {
    advanceTournamentBracketAfterStage(st);
  }
  if (isTournamentRunTerminal(state.tournament)) {
    maybeAutoSaveRunToRanking(state.tournament);
  }
  renderTournamentScreen();
}

function scheduleNextPenaltyStep(st) {
  const pen = st?.penalties;
  if (!pen || st.finished || pen.phase !== "PREP_KICK") return;
  if (state.tournament.penTimerId) {
    clearTimeout(state.tournament.penTimerId);
    state.tournament.penTimerId = null;
  }
  const prepMs = state.simSpeed === 4 ? 220 : state.simSpeed === 2 ? 420 : 680;
  state.tournament.penTimerId = setTimeout(() => {
    state.tournament.penTimerId = null;
    resolvePenaltyKick(st, false);
  }, prepMs);
}

function resolvePenaltyKick(st, isAuto = false) {
  const pen = st?.penalties;
  if (!pen || st.finished || (!isAuto && pen.phase !== "PREP_KICK")) return;

  const pitch = st.pitch;
  const isUserKicking = pen.activeSide === "user";
  const kicker = getCurrentPenaltyKicker(pen, isUserKicking ? "user" : "opp");
  const keeper = isUserKicking ? pen.oppGk : pen.userGk;

  // Cobrança direta (sem técnicas): batedor mira 1 de 6 alvos internos; pode acertar gol, defesa, TRAVE ou FORA!
  const shootCorner = Math.floor(Math.random() * PENALTY_CORNERS.length);
  const kickerOvr = kicker?.effOvr || kicker?.player?.ovr || 85;
  const keeperOvr = keeper?.effOvr || keeper?.player?.ovr || 85;
  const kickerStam = typeof kicker?.stamina === "number" ? kicker.stamina : 70;
  const errFactor = Math.max(0.65, Math.min(1.42, 1 + (85 - kickerOvr) * 0.015 + (kickerStam < 40 ? 0.16 : 0)));
  const postProb = 0.065 * errFactor;
  const missProb = 0.055 * errFactor;

  const gkGuessProb = Math.max(0.28, Math.min(0.39, 1 / 3 + (keeperOvr - kickerOvr) * 0.004));
  const errRoll = Math.random();
  let outcome = "GOAL";
  let gkGuessedRight = false;
  if (errRoll < postProb) {
    outcome = "POST";
  } else if (errRoll < postProb + missProb) {
    outcome = "MISS";
  } else {
    gkGuessedRight = Math.random() < gkGuessProb;
    outcome = gkGuessedRight ? "SAVED" : "GOAL";
  }

  let diveCorner = shootCorner;
  if (!gkGuessedRight) {
    const others = PENALTY_CORNERS.map((c) => c.id).filter((id) => id !== shootCorner);
    diveCorner = others[Math.floor(Math.random() * others.length)];
  }
  const isGoal = outcome === "GOAL";
  const shootInfo = PENALTY_CORNERS[shootCorner] || PENALTY_CORNERS[0];
  const diveInfo = PENALTY_CORNERS[diveCorner] || PENALTY_CORNERS[0];
  let shotBallX = shootInfo.x;
  let shotBallY = Math.round(shootInfo.y + (Math.random() - 0.5) * 6);
  let postPartLabel = "na trave";
  if (outcome === "POST") {
    if (shootInfo.col === 1) {
      shotBallX = Math.round(35 + Math.random() * 30);
      shotBallY = 2;
      postPartLabel = "no travessão";
    } else {
      shotBallX = shootInfo.col === 0 ? 1 : 99;
      shotBallY = Math.round(16 + Math.random() * 52);
      postPartLabel = shootInfo.col === 0 ? "na trave esquerda" : "na trave direita";
    }
  } else if (outcome === "MISS") {
    if (shootInfo.col === 1 || Math.random() < 0.36) {
      shotBallX = Math.round(28 + Math.random() * 44);
      shotBallY = -18;
      postPartLabel = "por cima do travessão";
    } else {
      shotBallX = shootInfo.col === 0 ? -9 : 109;
      shotBallY = Math.round(12 + Math.random() * 58);
      postPartLabel = shootInfo.col === 0 ? "à esquerda do gol" : "à direita do gol";
    }
  }

  if (isUserKicking) {
    pen.userTaken++;
    if (isGoal) pen.userGoals++;
    pen.userKicks.push({
      kickerName: kicker.player.name,
      sprite: kicker.player.sprite,
      corner: shootCorner,
      diveCorner,
      outcome
    });
    const narText =
      outcome === "GOAL"
        ? `[Pênalti ${pen.userTaken}] ${kicker.player.name} bateu no ${shootInfo.label} (${keeper.player.name} pulou no ${diveInfo.label}) — GOOOL! (${pen.userGoals} x ${pen.oppGoals})`
        : outcome === "POST"
        ? `[Pênalti ${pen.userTaken}] ${kicker.player.name} soltou a bomba e carimbou ${postPartLabel}! (${pen.userGoals} x ${pen.oppGoals})`
        : outcome === "MISS"
        ? `[Pênalti ${pen.userTaken}] ${kicker.player.name} pegou mal na bola e mandou pra fora (${postPartLabel})! (${pen.userGoals} x ${pen.oppGoals})`
        : `[Pênalti ${pen.userTaken}] ${kicker.player.name} bateu no ${shootInfo.label}, mas ${keeper.player.name} adivinhou o canto e defendeu! (${pen.userGoals} x ${pen.oppGoals})`;
    prependNarrationLine(
      st,
      isGoal ? "nar-goal-user" : "nar-save",
      narText,
      { name: kicker.player.name, sprite: kicker.player.sprite, side: "user" },
      { name: keeper.player.name, sprite: keeper.player.sprite, side: "opp" },
      null
    );
  } else {
    pen.oppTaken++;
    if (isGoal) pen.oppGoals++;
    else if (outcome === "SAVED") recordUserPlayerStat(pitch, keeper, "saves", 1);
    pen.oppKicks.push({
      kickerName: kicker.player.name,
      sprite: kicker.player.sprite,
      corner: shootCorner,
      diveCorner,
      outcome
    });
    const narText =
      outcome === "GOAL"
        ? `[Pênalti ${pen.oppTaken}] ${kicker.player.name} bateu no ${shootInfo.label} (${keeper.player.name} pulou no ${diveInfo.label}) — Gol rival. (${pen.userGoals} x ${pen.oppGoals})`
        : outcome === "POST"
        ? `[NA TRAVE!] ${kicker.player.name} mandou ${postPartLabel} e desperdiçou o pênalti rival! (${pen.userGoals} x ${pen.oppGoals})`
        : outcome === "MISS"
        ? `[PRA FORA!] ${kicker.player.name} isolou ${postPartLabel} e perdeu o pênalti rival! (${pen.userGoals} x ${pen.oppGoals})`
        : `[DEFESA DE ${keeper.player.name.toUpperCase()}!] ${keeper.player.name} acertou o ${diveInfo.label} e defendeu o pênalti de ${kicker.player.name}! (${pen.userGoals} x ${pen.oppGoals})`;
    prependNarrationLine(
      st,
      isGoal ? "nar-goal-opp" : "nar-save",
      narText,
      { name: keeper.player.name, sprite: keeper.player.sprite, side: "user" },
      { name: kicker.player.name, sprite: kicker.player.sprite, side: "opp" },
      null
    );
  }

  if (isAuto) {
    if (isPenaltyShootoutDecided(pen)) {
      finishPenaltyShootout(st);
      return;
    }
    pen.activeSide = isUserKicking ? "opp" : "user";
    pen.phase = "PREP_KICK";
    return;
  }

  pen.phase = "RESULT_BEAT";
  pen.lastAnim = {
    isUserKicking,
    shootCorner,
    diveCorner,
    shootInfo,
    diveInfo,
    shotBallX,
    shotBallY,
    outcome,
    postPartLabel,
    isGoal,
    kicker,
    keeper,
    kickNum: isUserKicking ? pen.userTaken : pen.oppTaken
  };

  renderTournamentScreen();

  // Dispara transição fluida do batedor, bola, goleiro e impacto na rede/trave!
  setTimeout(() => {
    if (st.finished || st.penalties !== pen || pen.phase !== "RESULT_BEAT") return;
    const gkEl = document.getElementById("pen-gk-actor");
    const ballEl = document.getElementById("pen-ball-actor");
    const kickerEl = document.getElementById("pen-kicker-actor");
    const goalFrameEl = document.getElementById("pen-goal-frame");
    const trailEl = document.getElementById("pen-shot-trail");
    if (kickerEl) {
      kickerEl.classList.add("is-strike");
    }
    if (gkEl) {
      gkEl.style.left = `${diveInfo.x}%`;
      gkEl.style.top = `${diveInfo.y}%`;
      gkEl.classList.add(diveInfo.diveCls);
    }
    if (trailEl) {
      trailEl.classList.add("is-visible");
    }
    if (ballEl) {
      ballEl.style.left = `${shotBallX}%`;
      ballEl.style.top = `${shotBallY}%`;
      const ballCls =
        outcome === "GOAL"
          ? "ball-goal"
          : outcome === "POST"
          ? "ball-post"
          : outcome === "MISS"
          ? "ball-miss"
          : "ball-saved";
      ballEl.classList.add(ballCls);
    }
    if (goalFrameEl) {
      if (outcome === "GOAL") goalFrameEl.classList.add("is-goal-net");
      else if (outcome === "POST") goalFrameEl.classList.add("is-post-shake");
    }
    if (typeof playSfx === "function") {
      playSfx(
        outcome === "GOAL" ? (isUserKicking ? "goal" : "goal_concede") : outcome === "POST" ? "post" : outcome === "MISS" ? "miss" : "save",
        { force: true }
      );
    }
  }, 35);

  if (state.tournament.penTimerId) clearTimeout(state.tournament.penTimerId);
  const beatMs = state.simSpeed === 4 ? 580 : state.simSpeed === 2 ? 1050 : 1650;
  state.tournament.penTimerId = setTimeout(() => {
    state.tournament.penTimerId = null;
    if (isPenaltyShootoutDecided(pen)) {
      finishPenaltyShootout(st);
      return;
    }
    pen.lastAnim = null;
    pen.activeSide = isUserKicking ? "opp" : "user";
    pen.phase = "PREP_KICK";
    renderTournamentScreen();
    scheduleNextPenaltyStep(st);
  }, beatMs);
}

function autoResolveRemainingPenalties(st) {
  const pen = st.penalties;
  if (!pen || st.finished) return;
  if (state.tournament.penTimerId) {
    clearTimeout(state.tournament.penTimerId);
    state.tournament.penTimerId = null;
  }
  if (pen.phase === "ORDER") {
    pen.activeSide = pen.firstSide;
    pen.phase = "PREP_KICK";
  } else if (pen.phase === "RESULT_BEAT") {
    if (isPenaltyShootoutDecided(pen)) {
      finishPenaltyShootout(st);
      return;
    }
    const wasUserKicking = pen.lastAnim ? pen.lastAnim.isUserKicking : pen.activeSide === "user";
    pen.lastAnim = null;
    pen.activeSide = wasUserKicking ? "opp" : "user";
    pen.phase = "PREP_KICK";
  }
  let guard = 0;
  while (!st.finished && guard < 60) {
    guard++;
    resolvePenaltyKick(st, true);
  }
  if (!st.finished) {
    if (pen.userGoals === pen.oppGoals) {
      pen.userTaken++;
      pen.userGoals++;
      pen.oppTaken++;
      pen.userKicks.push({ kickerName: "Desempate", sprite: pen.userOrder?.[0]?.player?.sprite || "", corner: 0, diveCorner: 2, outcome: "GOAL" });
      pen.oppKicks.push({ kickerName: "Desempate", sprite: pen.oppOrder?.[0]?.player?.sprite || "", corner: 0, diveCorner: 0, outcome: "SAVED" });
    }
    finishPenaltyShootout(st);
  }
}

function buildPenaltyDotsHTML(kicks, totalSlots = 5) {
  const count = Math.max(totalSlots, kicks.length);
  const items = [];
  for (let i = 0; i < count; i++) {
    const k = kicks[i];
    if (!k) items.push(`<span class="pen-dot is-empty"></span>`);
    else if (k.outcome === "GOAL") items.push(`<span class="pen-dot is-goal" title="${k.kickerName}: Gol">✓</span>`);
    else items.push(`<span class="pen-dot is-miss" title="${k.kickerName}: Defendido">✗</span>`);
  }
  return items.join("");
}

function buildPenaltyShootoutHTML(st) {
  const pen = st.penalties;
  if (!pen) return "";

  const seriesMax = Math.max(5, pen.userTaken, pen.oppTaken);
  const userTeamDisp = typeof getActiveTeamName === "function" ? getActiveTeamName() : "Dream Team";

  if (pen.phase === "ORDER") {
    const rowsHTML = pen.userOrder
      .map((n, idx) => {
        const pLvl = n.level || getPlayerLevel(n.player);
        const attrs = n.attrs || calcPlayerAttributes(n.player, n.role, pLvl);
        const isTop5 = idx < 5;
        const isSwapSelected = pen.swapIdx === idx;
        return `
          <div class="pen-order-row ${isTop5 ? "is-main5" : "is-alt"} ${isSwapSelected ? "is-swap" : ""}" data-pen-swap="${idx}">
            <span class="pen-order-num">${idx + 1}º</span>
            <img class="pen-order-avatar" src="${n.player.sprite || ""}" alt="${n.player.name}" />
            <div class="pen-order-meta">
              <strong>${n.player.name} <small>(${n.label} · OVR ${n.effOvr})</small></strong>
              <span>FOR ${attrs.for} · TEC ${attrs.tec} · Nv. ${pLvl}</span>
            </div>
            <span class="pen-order-tag">${isTop5 ? "Titular" : "Alternada"}</span>
            <div class="pen-order-arrows">
              <button type="button" class="pen-arrow-btn" data-pen-move="up" data-idx="${idx}" ${idx === 0 ? "disabled" : ""}>▲</button>
              <button type="button" class="pen-arrow-btn" data-pen-move="down" data-idx="${idx}" ${idx === pen.userOrder.length - 1 ? "disabled" : ""}>▼</button>
            </div>
          </div>
        `;
      })
      .join("");

    return `
      <div id="live-pitch-box" class="live-pitch-card pen-shootout-card">
        <div class="pen-header-row">
          <div>
            <span class="pen-eyebrow">⚽ DECISÃO POR PÊNALTIS</span>
            <h4>Defina a Ordem dos Batedores</h4>
            <p>Defina a ordem dos batedores (cobranças diretas, sem técnicas). Depois, acompanhe a disputa na simulação.</p>
          </div>
          <button type="button" class="ie-cmd-btn" id="btn-pen-first-toggle" style="font-size:0.7rem; padding:6px 10px;">
            <span>Inicia: ${pen.firstSide === "user" ? escapeHtml(userTeamDisp) : st.oppTeam.name}</span>
          </button>
        </div>

        <div class="pen-order-list">${rowsHTML}</div>

        <div class="pen-footer-actions">
          <button type="button" class="ie-cmd-btn ie-cmd-green" id="btn-pen-start-shootout" style="flex:1;">
            <span>Confirmar Ordem e Acompanhar Pênaltis</span>
          </button>
          <button type="button" class="ie-cmd-btn" id="btn-pen-auto-finish" style="font-size:0.72rem;">
            <span>Simular Direto</span>
          </button>
        </div>
      </div>
    `;
  }

  const isBeat = pen.phase === "RESULT_BEAT" && pen.lastAnim;
  const isUserKicking = isBeat ? pen.lastAnim.isUserKicking : pen.activeSide === "user";
  const kicker = isBeat ? pen.lastAnim.kicker : getCurrentPenaltyKicker(pen, isUserKicking ? "user" : "opp");
  const keeper = isBeat ? pen.lastAnim.keeper : (isUserKicking ? pen.oppGk : pen.userGk);
  const kickNum = isBeat
    ? pen.lastAnim.kickNum
    : isUserKicking
    ? pen.userTaken + 1
    : pen.oppTaken + 1;
  const kickSideTitle = isUserKicking ? userTeamDisp.toUpperCase() : st.oppTeam.name.toUpperCase();
  const beatOutcome = isBeat ? (pen.lastAnim.outcome || (pen.lastAnim.isGoal ? "GOAL" : "SAVED")) : null;
  const modeTitle = isBeat
    ? beatOutcome === "GOAL"
      ? "⚽ GOOOL!"
      : beatOutcome === "POST"
      ? "💥 NA TRAVE!"
      : beatOutcome === "MISS"
      ? "❌ PRA FORA!"
      : "🧤 DEFENDEU!"
    : `COBRANÇA ${kickNum} • ${kickSideTitle}`;
  const modeSub = isBeat
    ? beatOutcome === "GOAL"
      ? `${pen.lastAnim.kicker.player.name} mandou no fundo da rede (${pen.lastAnim.shootInfo.label})!`
      : beatOutcome === "POST"
      ? `${pen.lastAnim.kicker.player.name} carimbou ${pen.lastAnim.postPartLabel || "a trave"}!`
      : beatOutcome === "MISS"
      ? `${pen.lastAnim.kicker.player.name} mandou pra fora (${pen.lastAnim.postPartLabel || "longe do gol"})!`
      : `${pen.lastAnim.keeper.player.name} voou no canto e defendeu a cobrança de ${pen.lastAnim.kicker.player.name}!`
    : `${kicker.player.name} caminha para a marca da cal contra ${keeper.player.name}...`;

  const kickerShortName = (kicker.player.name || "").split(" ").slice(-1)[0];
  const keeperShortName = (keeper.player.name || "").split(" ").slice(-1)[0];
  const trailTargetX = isBeat ? (pen.lastAnim.shotBallX ?? pen.lastAnim.shootInfo.x) : 50;
  const trailTargetY = isBeat ? (pen.lastAnim.shotBallY ?? pen.lastAnim.shootInfo.y) : 50;
  const trailColor =
    beatOutcome === "GOAL"
      ? "#facc15"
      : beatOutcome === "POST"
      ? "#fb923c"
      : beatOutcome === "MISS"
      ? "#f87171"
      : "#38bdf8";

  return `
    <div id="live-pitch-box" class="live-pitch-card pen-shootout-card ${isUserKicking ? "poss-user" : "poss-opp"}">
      <div class="pen-scoreboard">
        <div class="pen-sb-side">
          <strong>${escapeHtml(userTeamDisp)} (${pen.userGoals})</strong>
          <div class="pen-dots-row">${buildPenaltyDotsHTML(pen.userKicks, seriesMax)}</div>
        </div>
        <div class="pen-sb-center">
          <small>${pen.userTaken >= 5 && pen.oppTaken >= 5 ? "ALTERNADAS" : "PÊNALTIS"}</small>
          <strong>${pen.userGoals} × ${pen.oppGoals}</strong>
        </div>
        <div class="pen-sb-side is-right">
          <strong>${st.oppTeam.name} (${pen.oppGoals})</strong>
          <div class="pen-dots-row">${buildPenaltyDotsHTML(pen.oppKicks, seriesMax)}</div>
        </div>
      </div>

      <div class="pen-matchup-strip">
        <div class="pen-actor-chip side-user">
          <img src="${(isUserKicking ? kicker : keeper).player.sprite || ""}" alt="" />
          <div>
            <small>${isUserKicking ? `${kickNum}º Batedor` : "Seu Goleiro"}</small>
            <strong>${(isUserKicking ? kicker : keeper).player.name}</strong>
          </div>
        </div>

        <div class="pen-turn-callout ${isBeat ? (beatOutcome === "GOAL" ? "is-goal" : beatOutcome === "POST" || beatOutcome === "MISS" ? "is-miss" : "is-save") : ""}">
          <small>${modeTitle}</small>
          <strong>${modeSub}</strong>
        </div>

        <div class="pen-actor-chip side-opp is-right">
          <div>
            <small>${isUserKicking ? "Goleiro Rival" : `${kickNum}º Batedor`}</small>
            <strong>${(isUserKicking ? keeper : kicker).player.name}</strong>
          </div>
          <img src="${(isUserKicking ? keeper : kicker).player.sprite || ""}" alt="" />
        </div>
      </div>

      <div class="pen-goal-stage">
        <div id="pen-goal-frame" class="pen-goal-frame">
          <div class="pen-net-ripple"></div>
          ${
            isBeat
              ? `<svg id="pen-shot-trail" class="pen-shot-trail" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="penTrailGrad" x1="50%" y1="100%" x2="${trailTargetX}%" y2="${trailTargetY}%">
                      <stop offset="0%" stop-color="${trailColor}" stop-opacity="0.05" />
                      <stop offset="100%" stop-color="${trailColor}" stop-opacity="0.88" />
                    </linearGradient>
                  </defs>
                  <path d="M 50 102 Q ${Math.round((50 + trailTargetX) / 2)} ${Math.round((102 + trailTargetY) / 2) - 10} ${trailTargetX} ${trailTargetY}" fill="none" stroke="url(#penTrailGrad)" stroke-width="3.2" stroke-linecap="round" />
                </svg>`
              : ""
          }

          <div id="pen-gk-actor" class="pen-gk-actor ${isUserKicking ? "side-opp" : "side-user"}" style="left:50%; top:58%;">
            <img src="${keeper.player.sprite || ""}" alt="${keeper.player.name}" />
            <span>${keeperShortName}</span>
          </div>

          <div id="pen-ball-actor" class="pen-ball-actor" style="left:50%; top:102%;">
            ${buildMiniBallSVG("pen-ball-svg")}
          </div>

          ${
            isBeat
              ? `<div class="pen-result-pop ${beatOutcome === "GOAL" ? "is-goal" : beatOutcome === "POST" ? "is-post" : beatOutcome === "MISS" ? "is-miss" : "is-save"}">
                  <span>${modeTitle}</span>
                </div>`
              : ""
          }
        </div>
        <div class="pen-turf-strip">
          <span class="pen-spot-dot"></span>
          <div id="pen-kicker-actor" class="pen-kicker-actor ${isUserKicking ? "side-user" : "side-opp"}">
            <img src="${kicker.player.sprite || ""}" alt="${kicker.player.name}" />
            <span>${kickerShortName}</span>
          </div>
        </div>
      </div>

      <div class="pen-footer-actions">
        <span class="pen-hint-txt">Simulando cobrança a cobrança (sem técnicas)</span>
        <div style="display:flex; align-items:center; gap:6px;">
          <button type="button" class="ie-cmd-btn" id="btn-pen-speed" style="font-size:0.68rem; padding:5px 10px;">
            <span>Vel: ${state.simSpeed}x</span>
          </button>
          <button type="button" class="ie-cmd-btn" id="btn-pen-auto-finish" style="font-size:0.68rem; padding:5px 10px;">
            <span>Simular Restante</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function attachPenaltyListeners(st) {
  const pen = st?.penalties;
  if (!pen || st.finished) return;

  document.querySelectorAll("[data-pen-move]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const dir = btn.getAttribute("data-pen-move");
      const idx = Number(btn.getAttribute("data-idx"));
      const swapWith = dir === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= pen.userOrder.length) return;
      const tmp = pen.userOrder[idx];
      pen.userOrder[idx] = pen.userOrder[swapWith];
      pen.userOrder[swapWith] = tmp;
      pen.swapIdx = null;
      renderTournamentScreen();
    });
  });

  document.querySelectorAll("[data-pen-swap]").forEach((row) => {
    row.addEventListener("click", () => {
      const idx = Number(row.getAttribute("data-pen-swap"));
      if (pen.swapIdx === null) {
        pen.swapIdx = idx;
      } else {
        if (pen.swapIdx !== idx) {
          const tmp = pen.userOrder[pen.swapIdx];
          pen.userOrder[pen.swapIdx] = pen.userOrder[idx];
          pen.userOrder[idx] = tmp;
        }
        pen.swapIdx = null;
      }
      renderTournamentScreen();
    });
  });

  const toggleFirstBtn = document.getElementById("btn-pen-first-toggle");
  if (toggleFirstBtn) {
    toggleFirstBtn.addEventListener("click", () => {
      pen.firstSide = pen.firstSide === "user" ? "opp" : "user";
      renderTournamentScreen();
    });
  }

  const startPenBtn = document.getElementById("btn-pen-start-shootout");
  if (startPenBtn) {
    startPenBtn.addEventListener("click", () => {
      pen.activeSide = pen.firstSide;
      pen.phase = "PREP_KICK";
      pen.lastAnim = null;
      renderTournamentScreen();
      scheduleNextPenaltyStep(st);
    });
  }

  const penSpeedBtn = document.getElementById("btn-pen-speed");
  if (penSpeedBtn) {
    penSpeedBtn.addEventListener("click", () => {
      state.simSpeed = state.simSpeed === 1 ? 2 : state.simSpeed === 2 ? 4 : 1;
      document.querySelectorAll("#btn-pen-speed span, #btn-toggle-speed span").forEach((el) => {
        el.textContent = `Vel: ${state.simSpeed}x`;
      });
    });
  }

  const autoBtn = document.getElementById("btn-pen-auto-finish");
  if (autoBtn) {
    autoBtn.addEventListener("click", () => {
      autoResolveRemainingPenalties(st);
    });
  }
}
