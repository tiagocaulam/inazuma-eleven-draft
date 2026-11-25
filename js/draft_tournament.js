// Sorteia o próximo time e anima o carrossel da roleta sem piscar!
function spinNextTeam(isManualReroll = false) {
  if (state.isSpinning) return;
  if (isManualReroll) {
    if (state.hideOvrBeforePick || state.rerollsLeft <= 0) return;
    state.rerollsLeft--;
  }

  state.selectedPlayer = null;
  state.peekField = false;

  const pickedIds = getPickedPlayerIds();
  const pickedFulls = getPickedFullNames();
  const openRoles = new Set(getOpenSlots().map((s) => s.role));
  const isAvail = (p) => !pickedIds.has(p.id) && !pickedFulls.has((p.fullName || p.name || "").trim().toLowerCase());

  let pool = DB.teams.filter(
    (t) =>
      !state.usedTeamIds.includes(t.id) &&
      t.players.some((p) => isAvail(p) && getPlayerPositionsList(p).some((r) => openRoles.has(r)))
  );
  if (pool.length === 0) {
    pool = DB.teams.filter((t) => t.players.some((p) => isAvail(p)));
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)];
  state.currentTeam = chosen;
  state.usedTeamIds.push(chosen.id);
  state.isSpinning = true;

  // Renderiza a tela da roleta + elenco (com elenco suavemente aguardando o giro terminar)
  renderHeaderAndBonds();
  renderDraftWheelAndRoster(true);
}

function renderDraftWheelAndRoster(animateWheel = false) {
  const container = document.getElementById("main-screen-container");
  if (!container) return;

  if (state.spinTimerId) {
    clearTimeout(state.spinTimerId);
    state.spinTimerId = null;
  }

  const pickedCount = getPickedCount();
  const pickedIds = getPickedPlayerIds();
  const pickedFulls = getPickedFullNames();
  const openSlots = getOpenSlots();
  const openRoles = new Set(openSlots.map((s) => s.role));
  const team = state.currentTeam || DB.teams[0];

  // Monta a tira da roleta com 28 itens onde o item #22 é o time sorteado!
  // Gera tira sem repetir times nem emblemas em posições próximas/adjacentes
  const targetIdx = 22;
  const stripTeams = new Array(28).fill(null);
  stripTeams[targetIdx] = team;
  const matchesDuplicate = (a, b) => Boolean(a && b && (a.id === b.id || (a.emblem && b.emblem && a.emblem === b.emblem)));
  for (let i = 0; i < 28; i++) {
    if (i === targetIdx) continue;
    let candidates = DB.teams.filter((cand) => {
      if (i >= 20 && i <= 24 && matchesDuplicate(cand, team)) return false;
      for (let d = 1; d <= 5; d++) {
        if (i - d >= 0 && matchesDuplicate(cand, stripTeams[i - d])) return false;
        if (i + d < 28 && matchesDuplicate(cand, stripTeams[i + d])) return false;
      }
      return true;
    });
    if (candidates.length === 0) {
      candidates = DB.teams.filter((cand) => {
        const prev = i > 0 ? stripTeams[i - 1] : null;
        const next = i < 27 ? stripTeams[i + 1] : null;
        return !matchesDuplicate(cand, prev) && !matchesDuplicate(cand, next);
      });
    }
    if (candidates.length === 0) candidates = DB.teams;
    stripTeams[i] = candidates[Math.floor(Math.random() * candidates.length)];
  }

  const posOrder = { GK: 1, DF: 2, MF: 3, FW: 4 };
  const sortedPlayers = [...team.players].sort(
    (a, b) => (posOrder[a.pos] || 9) - (posOrder[b.pos] || 9) || b.ovr - a.ovr
  );

  const openRolesSummary = ["GK", "DF", "MF", "FW"]
    .map((r) => {
      const cnt = openSlots.filter((s) => s.role === r).length;
      return cnt > 0
        ? `<span style="display:inline-flex; align-items:center; gap:3px; background:rgba(9,22,50,0.85); border:1px solid rgba(96,165,250,0.4); border-radius:4px; padding:2px 6px; font-size:0.72rem; font-weight:900;">${posIconHTML(r, true)} ×${cnt}</span>`
        : "";
    })
    .filter(Boolean)
    .join(" ");

  function buildRevealedTeamHTML() {
    return `
      <div class="roster-fade-in">
        <div class="drawn-team-header" style="margin-bottom: 12px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="${team.emblem}" alt="" style="width:48px; height:48px; object-fit:contain;" />
            <div>
              <h3 style="font-size:1.12rem; font-weight:900; color:#fff;" id="drawn-team-title">
                ${team.name}
              </h3>
              <p style="font-size:0.74rem; color:#bfdbfe;">
                Selecione <strong>1 jogador</strong> abaixo para escalar na sua formação:
              </p>
            </div>
          </div>

          <div class="drawn-team-actions">
            <button class="ie-cmd-btn" id="btn-peek-field">
              ${formationIconHTML()} <span>Campo (${pickedCount}/11)</span>
            </button>
            ${
              !state.hideOvrBeforePick
                ? `<button class="ie-cmd-btn ie-cmd-gold" id="btn-reroll-team" ${state.rerollsLeft <= 0 ? "disabled" : ""}>
                    <span>Girar Outro (${state.rerollsLeft})</span>
                  </button>`
                : ""
            }
          </div>
        </div>

        <div class="roster-grid">
          ${sortedPlayers
            .map((p) => {
              const fnKey = (p.fullName || p.name || "").trim().toLowerCase();
              const alreadyPicked = pickedIds.has(p.id) || (fnKey && pickedFulls.has(fnKey));
              const hasNaturalSlot = getPlayerPositionsList(p).some((r) => openRoles.has(r));
              const movesSummary = formatPlayerMovesSummary(p);
              const hasLink = !alreadyPicked && hasAffinityWithCurrentSquad({ ...p, teamId: team.id });
              const altPosHTML =
                Array.isArray(p.altPositions) && p.altPositions.length > 0
                  ? `<span class="dual-pos-chip" title="Também joga sem penalidade em ${p.altPositions.join("/")}">/${p.altPositions.map((r) => posIconHTML(r, true)).join("")}</span>`
                  : "";

              const basePwr = calcIndividualPlayerPower(p, p.pos, 1);
              const stBase = calcPlayerAttributes(p, p.pos, 1);
              const statsTooltip = `Status Base (Nv.1): FOR ${stBase.for} • TEC ${stBase.tec} • DEF ${stBase.def} • VEL ${stBase.vel} • FIS ${stBase.fis}`;

              return `
                <div class="roster-player-card ${alreadyPicked ? "disabled-card" : ""} ${!hasNaturalSlot && !alreadyPicked ? "pos-full-card" : ""}"
                     data-player-id="${p.id}"
                     title="${state.hideOvrBeforePick && !alreadyPicked ? p.name : statsTooltip}">
                  <img class="roster-sprite" src="${p.sprite}" alt="${p.name}" />
                  <div class="roster-meta">
                    <div class="roster-name">${p.isCaptain ? captainIconHTML() : ""} <span>#${p.number} ${p.name}</span></div>
                    <div class="roster-sub">${movesSummary}</div>
                    <div class="roster-badges">
                      ${posIconHTML(p.pos, true)}${altPosHTML}
                      <span class="ovr-tag">${state.hideOvrBeforePick && !alreadyPicked ? "OVR ??" : `OVR ${p.ovr}`}</span>
                      <span class="pwr-base-tag" title="Poder Base do jogador no Nv. 1">${state.hideOvrBeforePick && !alreadyPicked ? "⚔️ Poder ??" : `⚔️ Poder ${basePwr}`}</span>
                      ${elemIconHTML(p.element)}
                      ${hasLink ? `<span class="affinity-badge">+Química</span>` : ""}
                      ${!hasNaturalSlot && !alreadyPicked ? `<span style="font-size:0.62rem; color:#facc15;">(Cheia)</span>` : ""}
                    </div>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  function bindRosterEvents() {
    const peekBtn = document.getElementById("btn-peek-field");
    if (peekBtn) {
      peekBtn.addEventListener("click", () => {
        state.peekField = true;
        renderMainScreen();
      });
    }

    const rerollBtn = document.getElementById("btn-reroll-team");
    if (rerollBtn) {
      rerollBtn.addEventListener("click", () => spinNextTeam(true));
    }

    container.querySelectorAll(".roster-player-card").forEach((card) => {
      card.addEventListener("click", () => {
        if (state.isSpinning) return;
        const pid = card.getAttribute("data-player-id");
        const player = team.players.find((x) => x.id === pid);
        const fnKey = player ? (player.fullName || player.name || "").trim().toLowerCase() : "";
        if (player && !pickedIds.has(player.id) && !(fnKey && pickedFulls.has(fnKey))) {
          state.selectedPlayer = cloneFreshPlayerForSquad(player, team, 1);
          state.swapSlotId = null;
          renderMainScreen();
        }
      });
    });
  }

  container.innerHTML = `
    <div class="ie-section-bar">
      <div class="ie-section-title">
        ${formationIconHTML()} <span>SCOUTING • RODADA ${pickedCount + 1} DE 11</span>
      </div>
      <div style="display:flex; gap:5px; align-items:center; flex-wrap:wrap;">
        ${openRolesSummary}
      </div>
    </div>

    <!-- Roleta Carrossel com Todos os Times -->
    <div class="wheel-carousel-wrapper" id="wheel-box">
      <div class="wheel-center-pointer"></div>
      <div class="wheel-strip" id="wheel-strip">
        ${stripTeams
          .map(
            (t) => {
              const shortWheelName = String(t.name || "").replace(/^Protocolo Ômega/i, "Prot. Ômega");
              return `
          <div class="wheel-item" title="${t.name}">
            <img src="${t.emblem}" alt="${t.name}" />
            <span>${shortWheelName}</span>
          </div>
        `;
            }
          )
          .join("")}
      </div>
    </div>

    <!-- Elenco do Time Sorteado: só é revelado após a roleta parar! -->
    <div id="roster-reveal-section">
      ${
        animateWheel
          ? `<div class="wheel-waiting-box">
               ${UI.raimonEmblem ? `<img src="${UI.raimonEmblem}" alt="" style="width:40px; height:40px; object-fit:contain; opacity:0.85;" />` : ""}
               <span>Girando a roleta de times... revelando em instantes!</span>
             </div>`
          : buildRevealedTeamHTML()
      }
    </div>
  `;

  // Posiciona e anima a tira da roleta com CSS transition suave (responsivo desktop & mobile!)
  const wheelBox = document.getElementById("wheel-box");
  const stripEl = document.getElementById("wheel-strip");
  const firstItem = stripEl ? stripEl.querySelector(".wheel-item") : null;
  const itemWidth = firstItem ? firstItem.offsetWidth + 6 : 126;
  const boxCenter = (wheelBox ? wheelBox.clientWidth : 340) / 2;
  const finalOffset = boxCenter - targetIdx * itemWidth - itemWidth / 2;

  if (animateWheel && stripEl) {
    stripEl.style.transition = "none";
    stripEl.style.transform = `translateX(0px)`;
    void stripEl.offsetWidth;
    stripEl.style.transition = "transform 1.55s cubic-bezier(0.12, 0.82, 0.18, 1)";
    stripEl.style.transform = `translateX(${finalOffset}px)`;

    state.spinTimerId = setTimeout(() => {
      state.spinTimerId = null;
      state.isSpinning = false;
      const rev = document.getElementById("roster-reveal-section");
      if (rev) {
        rev.innerHTML = buildRevealedTeamHTML();
        bindRosterEvents();
      }
    }, 1620);
  } else if (stripEl) {
    state.isSpinning = false;
    stripEl.style.transform = `translateX(${finalOffset}px)`;
    bindRosterEvents();
  }
}

function placeSelectedPlayerOnPitch(slotId) {
  if (!state.selectedPlayer || state.squad[slotId]) return;
  state.squad[slotId] = state.selectedPlayer;
  state.selectedPlayer = null;
  state.peekField = false;
  state.swapSlotId = null;

  renderHeaderAndBonds();

  if (getPickedCount() < 11) {
    spinNextTeam(false);
  } else {
    renderMainScreen();
  }
}

function handleFieldSlotClick(slotId) {
  if (state.selectedPlayer) {
    if (!state.squad[slotId]) {
      placeSelectedPlayerOnPitch(slotId);
    }
    return;
  }

  if (!state.swapSlotId) {
    if (state.squad[slotId]) {
      state.swapSlotId = slotId;
      renderMainScreen();
    }
  } else {
    if (state.swapSlotId !== slotId) {
      const tmp = state.squad[state.swapSlotId];
      state.squad[state.swapSlotId] = state.squad[slotId];
      state.squad[slotId] = tmp;
    }
    state.swapSlotId = null;
    renderAll();
  }
}

function getLiveStaminaMapForStage(st) {
  if (!st?.pitch?.userNodes) return null;
  const map = {};
  st.pitch.userNodes.forEach((n) => {
    if (n.player?.id && typeof n.stamina === "number") {
      map[n.player.id] = Math.round(n.stamina);
    }
  });
  return map;
}

function buildPitchHTML(isComplete = false, liveStaminaByPlayerId = null) {
  const slots = getSlots();
  const sel = state.selectedPlayer;
  const adjPairs = getAdjacentSlotPairs(slots);
  const squadStats = calcSquadStats();
  const elemColors = {
    Fogo: "#ef4444",
    Floresta: "#22c55e",
    Vento: "#38bdf8",
    Montanha: "#f59e0b"
  };

  // Barra de Vantagens e Porcentagens no Canto Superior da Escalação
  const synergiesChips = squadStats.activeBonds && squadStats.activeBonds.length > 0
    ? squadStats.activeBonds.map((b) => {
        const playersList = Array.isArray(b.players) && b.players.length > 0 ? b.players.join("||") : "";
        const safeAttr = playersList ? ` data-bond-players="${playersList.replace(/"/g, "&quot;")}"` : "";
        const clickCls = playersList ? " is-clickable" : "";
        return `<span class="pitch-synergy-chip chip-${b.type}${clickCls}"${safeAttr}>${b.label}</span>`;
      }).join("")
    : `<span class="pitch-synergy-chip chip-empty">${formationIconHTML("inline-ui-icon")} Escale na posição certa (improvisar aplica -OVR) e conecte mesmo elemento colado!</span>`;

  const linksSVG = adjPairs
    .map(([a, b]) => {
      const pA = state.squad[a.id];
      const pB = state.squad[b.id];
      if (pA && pB && pA.element && pA.element === pB.element) {
        const col = elemColors[pA.element] || "#facc15";
        return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${col}" stroke-width="1.4" stroke-opacity="0.88" stroke-linecap="round" />`;
      }
      return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="rgba(255,255,255,0.2)" stroke-width="0.6" stroke-dasharray="1.8 1.8" />`;
    })
    .join("");

  const nodesHTML = slots
    .map((slot) => {
      const p = state.squad[slot.id];
      const isSwap = state.swapSlotId === slot.id;

      const renderY = slot.role === "GK" ? 90.5 : slot.role === "DF" && slot.y >= 73 ? 71.5 : slot.y;

      if (!p) {
        let targetClass = "";
        let hintText = "Vazio";
        if (sel) {
          if (playerMatchesRole(sel, slot.role)) {
            targetClass = "valid-target";
            hintText = "Escalar";
          } else {
            targetClass = "improv-target";
            hintText = "Improvisar";
          }
        }

        return `
          <div class="field-node ${targetClass}"
               style="left:${slot.x}%; top:${renderY}%;"
               data-slot="${slot.id}">
            ${posIconHTML(slot.role, true)}
            <span style="font-size:1.15rem; color:rgba(255,255,255,0.65); margin:1px 0;">＋</span>
            <span style="font-size:0.6rem; color:#f8fafc; font-weight:800;">${hintText}</span>
          </div>
        `;
      }

      const effOvr = getEffectiveOvr(p, slot.role);
      const pLvl = getPlayerLevel(p);
      const pPwr = calcIndividualPlayerPower(p, slot.role, pLvl);
      const attrs = calcPlayerAttributes(p, slot.role, pLvl);
      const isImprovised = !playerMatchesRole(p, slot.role);
      const nodeSprite = getPlayerFormSprite(p, slot.role);
      const pStam =
        liveStaminaByPlayerId && p?.id != null && typeof liveStaminaByPlayerId[p.id] === "number"
          ? liveStaminaByPlayerId[p.id]
          : null;
      const stamCol = pStam === null ? "" : pStam >= 70 ? "#4ade80" : pStam >= 45 ? "#facc15" : "#ef4444";
      const nodeTooltip = `OVR ${effOvr} • Nv.${pLvl} • Poder ${pPwr}${pStam !== null ? ` • Fôlego ${pStam}%` : ""} | FOR ${attrs.for} · TEC ${attrs.tec} · DEF ${attrs.def} · VEL ${attrs.vel} · FIS ${attrs.fis}`;

      return `
        <div class="field-node occupied ${isSwap ? "swap-active" : ""}"
             style="left:${slot.x}%; top:${renderY}%;"
             data-slot="${slot.id}"
             title="${nodeTooltip}">
          <span class="node-lvl-chip" title="${nodeTooltip}">Nv.${pLvl}</span>
          <div class="node-ovr" title="${nodeTooltip}">${effOvr}</div>
          <div class="node-avatar-wrap">
            <img class="node-avatar" src="${nodeSprite}" alt="${p.name}" />
            ${elemIconHTML(p.element, "node-elem-mini")}
          </div>
          <div class="node-name">${p.name}</div>
          <div class="node-pos-row">
            ${posIconHTML(slot.role, true)}
            <span class="node-slot-label">${slot.label}${isImprovised ? " *" : ""}</span>
          </div>
          <div class="node-pwr-pill${isImprovised ? " is-improvised" : ""}" title="${nodeTooltip}">⚔️ ${pPwr.toLocaleString("pt-BR")}</div>
          ${pStam !== null ? `<div class="node-live-stam-track" title="Fôlego atual: ${pStam}%"><div class="node-live-stam-fill" style="width:${pStam}%; background:${stamCol};"></div></div>` : ""}
        </div>
      `;
    })
    .join("");

  return `
    <div class="pitch-formation-wrapper">
      <div class="pitch-synergies-header" id="pitch-synergies-header">
        <div class="pitch-synergies-title">
          <span class="pitch-synergies-icon">🌱</span>
          <span>VANTAGENS &amp; SINERGIAS DA ESCALAÇÃO</span>
        </div>
        <div class="pitch-synergies-list">
          ${synergiesChips}
        </div>
      </div>
      ${
        isComplete
          ? `<div class="pitch-swap-instruction-pill">
              <span style="color:#facc15;">⇄</span>
              <span>Toque em um jogador para trocar de lugar com outro</span>
            </div>`
          : ""
      }
      <div class="soccer-pitch">
        <div class="pitch-penalty-top"></div>
        <div class="pitch-half-line"></div>
        <div class="pitch-center-circle">
          ${UI.raimonEmblem ? `<img class="pitch-center-emblem" src="${UI.raimonEmblem}" alt="" />` : "⚡"}
        </div>
        <div class="pitch-penalty-bottom"></div>
        <svg class="draft-links-svg" viewBox="0 0 100 100" preserveAspectRatio="none">${linksSVG}</svg>
        <div id="pitch-nodes-container">${nodesHTML}</div>
      </div>
    </div>
  `;
}

// ============================================================================
// TORNEIO FUTEBOL FRONTEIRA (SEM PISCAR! ATUALIZAÇÃO INCREMENTAL DO DOM)
// ============================================================================
function getTickMs() {
  if (state.simSpeed === 4) return 85;
  if (state.simSpeed === 2) return 200;
  return 680; // 1x tático: tempo legível entre passes e movimentação no campo
}

function resetSquadPrepBonuses() {
  Object.keys(state.squad).forEach((slotId) => {
    const p = state.squad[slotId];
    if (!p) return;
    p.level = 1;
    p.xp = 0;
    p.bonusStats = { for: 0, tec: 0, def: 0, vel: 0, fis: 0 };
    p.bonusPower = 0;
    p.bonusSpd = 0;
    p.equippedItems = [];
    p.keshin = null;
    p.moveEvoCount = 0;
    p.learnedSecretManual = false;
    p.learnedLvlMilestones = [];
    if (p._baseMovesSnapshot) {
      p.moves = JSON.parse(JSON.stringify(p._baseMovesSnapshot));
      delete p._baseMovesSnapshot;
    }
    if (p._baseHissatsuSnapshot) {
      p.hissatsu = p._baseHissatsuSnapshot;
      delete p._baseHissatsuSnapshot;
    }
  });
}

function createTournamentStage({
  stageName,
  oppTeam,
  competition = "FF",
  ovrBoost = 0,
  oppBuffPct = 0,
  oppLevel = 1,
  isGroupStage = false,
  groupRoundIdx = -1
}) {
  return {
    stageName,
    oppTeam,
    competition,
    ovrBoost,
    oppBuffPct,
    oppLevel,
    isGroupStage,
    groupRoundIdx,
    minute: 0,
    maxMinute: 90,
    userScore: 0,
    oppScore: 0,
    goalsUser: [],
    goalsOpp: [],
    narration: [],
    running: false,
    finished: false,
    won: null,
    isDraw: false,
    penaltiesText: null
  };
}

function pickPoolTeam(pools, usedIds) {
  for (const pool of pools) {
    const candidates = pool.filter((t) => !usedIds.has(t.id));
    if (candidates.length > 0) {
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      usedIds.add(picked.id);
      return picked;
    }
  }
  const fallback = DB.teams.find((t) => !usedIds.has(t.id)) || DB.teams[0];
  usedIds.add(fallback.id);
  return fallback;
}

function makeBracketTeamEntry(team, isUser = false) {
  if (isUser) {
    return {
      id: "user_dream",
      name: typeof getActiveTeamName === "function" ? getActiveTeamName() : (state.tournament?.rankingTeamName || "Dream Team"),
      emblem: UI.raimonEmblem || "",
      baseOvr: calcSquadStats().ovr || 85,
      isUser: true
    };
  }
  if (!team) return null;
  return {
    id: team.id,
    name: team.name,
    emblem: team.emblem || "",
    baseOvr: team.baseOvr || 84,
    isUser: false
  };
}

function createKnockoutBracket(comp, title, userR16Opp, poolTeams, usedIds = new Set(), seededOppRight = null) {
  const taken = new Set(usedIds);
  if (userR16Opp?.id) taken.add(userR16Opp.id);
  if (seededOppRight?.id) taken.add(seededOppRight.id);

  const pickNextOpp = () => {
    const cands = (poolTeams || []).filter((t) => t && !taken.has(t.id));
    if (cands.length > 0) {
      const ch = cands[Math.floor(Math.random() * cands.length)];
      taken.add(ch.id);
      return ch;
    }
    const fallback = (DB.teams || []).find((t) => t && !taken.has(t.id)) || DB.teams[0];
    if (fallback?.id) taken.add(fallback.id);
    return fallback;
  };

  const makeMatch = (id, aTeam, bTeam, aIsUser = false) => ({
    id,
    a: makeBracketTeamEntry(aTeam, aIsUser),
    b: makeBracketTeamEntry(bTeam, false),
    scoreA: null,
    scoreB: null,
    penText: null,
    played: false,
    winner: null
  });

  const r16 = [];
  for (let i = 0; i < 8; i++) {
    if (i === 0) {
      r16.push(makeMatch(`${comp}_r16_0`, null, userR16Opp, true));
    } else if (i === 4 && seededOppRight) {
      r16.push(makeMatch(`${comp}_r16_4`, seededOppRight, pickNextOpp(), false));
    } else {
      r16.push(makeMatch(`${comp}_r16_${i}`, pickNextOpp(), pickNextOpp(), false));
    }
  }
  const emptyRound = (prefix, count) =>
    Array.from({ length: count }, (_, idx) => ({
      id: `${comp}_${prefix}_${idx}`,
      a: null,
      b: null,
      scoreA: null,
      scoreB: null,
      penText: null,
      played: false,
      winner: null
    }));

  return {
    comp,
    title,
    rounds: [r16, emptyRound("qf", 4), emptyRound("sf", 2), emptyRound("f", 1)],
    champion: null
  };
}

function advanceTournamentBracketAfterStage(st) {
  const t = state.tournament;
  if (!t || !st || st.isGroupStage || st._bracketRecorded) return;
  const isWorld = st.competition === "WORLD";
  const bracket = isWorld ? t.worldBracket : t.ffBracket;
  const roundIdx = isWorld ? (t.stageIndex - 7) : t.stageIndex;
  if (!bracket || !Array.isArray(bracket.rounds) || roundIdx < 0 || roundIdx > 3) return;

  st._bracketRecorded = true;
  const round = bracket.rounds[roundIdx] || [];
  round.forEach((m, idx) => {
    if (!m || m.played) return;
    if (idx === 0) {
      m.scoreA = st.userScore || 0;
      m.scoreB = st.oppScore || 0;
      m.played = true;
      if (st.penalties && st.penaltiesText) {
        m.penText = `${st.penalties.userGoals ?? 0} x ${st.penalties.oppGoals ?? 0}`;
      }
      const userFirst = !m.a || m.a.isUser;
      m.winner = st.won ? (userFirst ? m.a : m.b) : (userFirst ? m.b : m.a);
    } else if (m.a && m.b) {
      const sim = simulateParallelGroupMatch(m.a, m.b);
      m.scoreA = sim.gA;
      m.scoreB = sim.gB;
      m.played = true;
      if (sim.gA > sim.gB) {
        m.winner = m.a;
      } else if (sim.gB > sim.gA) {
        m.winner = m.b;
      } else {
        const edge = ((m.a.baseOvr || 84) - (m.b.baseOvr || 84)) * 0.03;
        const aWinsPen = Math.random() < Math.max(0.25, Math.min(0.75, 0.5 + edge));
        m.winner = aWinsPen ? m.a : m.b;
        m.penText = aWinsPen ? "4 x 3" : "3 x 4";
      }
    }
  });

  if (roundIdx < 3) {
    const nextRound = bracket.rounds[roundIdx + 1] || [];
    for (let i = 0; i < nextRound.length; i++) {
      nextRound[i].a = round[i * 2]?.winner || null;
      nextRound[i].b = round[i * 2 + 1]?.winner || null;
    }
    const nextStage = t.stages?.[t.stageIndex + 1];
    const nextUserMatch = nextRound[0];
    if (st.won && nextStage && nextUserMatch?.b?.id) {
      const realOpp = (DB.teams || []).find((tm) => tm.id === nextUserMatch.b.id);
      if (realOpp) nextStage.oppTeam = realOpp;
    }
  } else {
    bracket.champion = round[0]?.winner || null;
  }
}

function startTournamentGo() {
  clearTournamentTimers(false);
  resetSquadPrepBonuses();

  const domestic = DB.teams.filter((t) => !WORLD_TEAM_IDS.has(t.id));
  const tiers = [
    domestic.filter((t) => t.baseOvr <= 81),
    domestic.filter((t) => t.baseOvr >= 82 && t.baseOvr <= 85),
    domestic.filter((t) => t.baseOvr >= 86 && t.baseOvr <= 88),
    domestic.filter((t) => t.baseOvr >= 88 && t.baseOvr <= 91)
  ];

  const stageNames = [
    "Oitavas de Final",
    "Quartas de Final",
    "Semifinal",
    "Grande Final"
  ];

  const usedOpp = new Set();
  const stages = stageNames.map((sName, idx) => {
    const opp = pickPoolTeam([tiers[idx], domestic, DB.teams], usedOpp);
    const oppLevel = STAGE_OPPONENT_LEVELS[idx] || (1 + idx * 2);
    const oppBuffPct = idx * 5;
    return createTournamentStage({
      stageName: sName,
      oppTeam: opp,
      competition: "FF",
      oppBuffPct,
      oppLevel,
      ovrBoost: 0
    });
  });

  const ffBracket = createKnockoutBracket(
    "FF",
    "Chaveamento • Futebol Fronteira",
    stages[0].oppTeam,
    domestic.slice().sort((a, b) => (a.baseOvr || 84) - (b.baseOvr || 84)),
    new Set([stages[0].oppTeam.id])
  );

  const chosenTeamName = typeof setSavedTeamName === "function"
    ? setSavedTeamName(
        state.draftTeamName !== undefined && state.draftTeamName !== null
          ? state.draftTeamName
          : (typeof getSavedTeamName === "function" ? getSavedTeamName() : "")
      )
    : "Dream Team";
  state.phase = "tournament";
  state.tournament = {
    ...createFreshTournamentState(),
    rankingTeamName: chosenTeamName,
    stages,
    ffBracket
  };

  // Preparação em Inazuma também antes da 1ª partida!
  openBetweenMatchPrep(0);
}

function sortWorldGroupStandings(standings) {
  if (!Array.isArray(standings)) return [];
  return standings.sort(
    (a, b) =>
      b.pts - a.pts ||
      b.w - a.w ||
      b.gd - a.gd ||
      b.gf - a.gf ||
      (b.isUser ? 1 : 0) - (a.isUser ? 1 : 0)
  );
}

function getUserGroupRank(worldGroup) {
  if (!worldGroup?.standings) return 1;
  const idx = worldGroup.standings.findIndex((row) => row.isUser);
  return idx >= 0 ? idx + 1 : 1;
}

function simulateParallelGroupMatch(teamA, teamB) {
  const diff = (teamA.baseOvr || 86) - (teamB.baseOvr || 86);
  const sampleGoals = (edge) => {
    const r = Math.random();
    const baseMean = Math.max(0.45, Math.min(2.6, 1.25 + edge * 0.11));
    if (r < Math.exp(-baseMean)) return 0;
    if (r < Math.exp(-baseMean) * (1 + baseMean)) return 1;
    if (r < 0.86) return 2;
    return Math.random() < 0.72 ? 3 : 4;
  };
  const gA = sampleGoals(diff);
  const gB = sampleGoals(-diff);
  return { gA, gB };
}

function recordStandingResult(row, gf, ga) {
  if (!row) return;
  row.p += 1;
  row.gf += gf;
  row.ga += ga;
  row.gd = row.gf - row.ga;
  if (gf > ga) {
    row.w += 1;
    row.pts += 3;
  } else if (gf === ga) {
    row.d += 1;
    row.pts += 1;
  } else {
    row.l += 1;
  }
}

function finalizeWorldGroupRound(st) {
  const t = state.tournament;
  const wg = t?.worldGroup;
  if (!wg || !st || !st.isGroupStage || st._groupRecorded) return;
  st._groupRecorded = true;

  const userRow = wg.standings.find((r) => r.isUser);
  const oppRow = wg.standings.find((r) => r.id === st.oppTeam.id);
  recordStandingResult(userRow, st.userScore || 0, st.oppScore || 0);
  recordStandingResult(oppRow, st.oppScore || 0, st.userScore || 0);

  const rIdx = st.groupRoundIdx;
  const otherPair = wg.otherPairs?.[rIdx];
  if (otherPair && wg.opponents?.[otherPair[0]] && wg.opponents?.[otherPair[1]]) {
    const teamA = wg.opponents[otherPair[0]];
    const teamB = wg.opponents[otherPair[1]];
    const { gA, gB } = simulateParallelGroupMatch(teamA, teamB);
    recordStandingResult(wg.standings.find((r) => r.id === teamA.id), gA, gB);
    recordStandingResult(wg.standings.find((r) => r.id === teamB.id), gB, gA);
    const resText = `${teamA.name} ${gA} x ${gB} ${teamB.name}`;
    wg.lastOtherResult = resText;
    prependNarrationLine(
      st,
      "nar-dribble",
      `[Grupo A · Outro Jogo] ${resText}`,
      null,
      null,
      "FF"
    );
  }

  sortWorldGroupStandings(wg.standings);

  if (st.groupRoundIdx === 2 && getUserGroupRank(wg) <= 2 && !t.worldBracket) {
    const worldPool = DB.teams.filter((tm) => WORLD_TEAM_IDS.has(tm.id));
    const koFallbackPool = DB.teams.filter((tm) => (tm.baseOvr || 80) >= 86);
    const otherQualRow = wg.standings.find((r) => !r.isUser);
    const otherQualTeam = otherQualRow ? DB.teams.find((tm) => tm.id === otherQualRow.id) || null : null;
    const eliminatedGrpIds = wg.standings
      .filter((r) => !r.isUser && r.id !== otherQualTeam?.id)
      .map((r) => r.id);
    if (t.stages?.[7]) {
      const r16Cur = t.stages[7].oppTeam;
      if (!r16Cur || eliminatedGrpIds.includes(r16Cur.id) || r16Cur.id === otherQualTeam?.id) {
        const alt = pickPoolTeam(
          [worldPool.filter((tm) => (tm.baseOvr || 84) >= 87), worldPool, koFallbackPool],
          new Set([...eliminatedGrpIds, otherQualTeam?.id].filter(Boolean))
        );
        t.stages[7].oppTeam = alt;
      }
      t.worldBracket = createKnockoutBracket(
        "WORLD",
        "Chaveamento • Mata-Mata Mundial (FFI)",
        t.stages[7].oppTeam,
        [...worldPool, ...koFallbackPool],
        new Set([...eliminatedGrpIds, t.stages[7].oppTeam.id]),
        otherQualTeam
      );
    }
  }
}

function advanceToWorldCup() {
  const t = state.tournament;
  if (!t) return;
  clearTournamentTimers(false);

  const worldPool = DB.teams.filter((tm) => WORLD_TEAM_IDS.has(tm.id));
  const usedWorld = new Set();

  // 3 Seleções para o Grupo A do Mundial (FFI) — progressão monotônica (sem queda pós-FF!)
  const grpOpp1 = pickPoolTeam(
    [worldPool.filter((tm) => tm.baseOvr >= 86 && tm.baseOvr <= 88), worldPool.filter((tm) => tm.baseOvr <= 88), worldPool],
    usedWorld
  );
  const grpOpp2 = pickPoolTeam(
    [worldPool.filter((tm) => tm.baseOvr >= 87 && tm.baseOvr <= 89), worldPool],
    usedWorld
  );
  const grpOpp3 = pickPoolTeam(
    [worldPool.filter((tm) => tm.baseOvr >= 88 && tm.baseOvr <= 90), worldPool],
    usedWorld
  );
  const groupOpps = [grpOpp1, grpOpp2, grpOpp3];

  const stats = calcSquadStats();
  const standings = [
    {
      id: "user_dream",
      name: typeof getActiveTeamName === "function" ? getActiveTeamName() : "Dream Team",
      emblem: UI.raimonEmblem || "",
      isUser: true,
      baseOvr: stats.ovr,
      p: 0,
      w: 0,
      d: 0,
      l: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0
    },
    ...groupOpps.map((tm) => ({
      id: tm.id,
      name: tm.name,
      emblem: tm.emblem,
      isUser: false,
      baseOvr: tm.baseOvr,
      p: 0,
      w: 0,
      d: 0,
      l: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0
    }))
  ];

  t.worldGroup = {
    groupName: "Grupo A",
    opponents: groupOpps,
    otherPairs: [
      [1, 2],
      [0, 2],
      [0, 1]
    ],
    standings,
    lastOtherResult: ""
  };

  const groupStages = groupOpps.map((opp, rIdx) => {
    const idx = 4 + rIdx;
    const oppLevel = STAGE_OPPONENT_LEVELS[idx] || (8 + rIdx * 2);
    const oppBuffPct = idx * 5;
    return createTournamentStage({
      stageName: `Grupo A · ${rIdx + 1}ª Rodada`,
      oppTeam: opp,
      competition: "WORLD",
      oppBuffPct,
      oppLevel,
      ovrBoost: 0,
      isGroupStage: true,
      groupRoundIdx: rIdx
    });
  });

  // 4 Fases de Mata-Mata do Mundial (Oitavas -> Quartas -> Semifinal -> Final Mundial)
  const koSpecs = [
    {
      stageName: "Oitavas do Mundial",
      pools: [worldPool.filter((tm) => tm.baseOvr >= 87 && tm.baseOvr <= 89), worldPool.filter((tm) => tm.baseOvr >= 86), worldPool]
    },
    {
      stageName: "Quartas do Mundial",
      pools: [worldPool.filter((tm) => tm.baseOvr >= 88 && tm.baseOvr <= 90), worldPool]
    },
    {
      stageName: "Semifinal Mundial",
      pools: [worldPool.filter((tm) => tm.baseOvr >= 90 && tm.baseOvr <= 91), worldPool.filter((tm) => tm.baseOvr >= 89), worldPool]
    },
    {
      stageName: "Final Mundial (FFI)",
      pools: [worldPool.filter((tm) => tm.baseOvr >= 91), worldPool.filter((tm) => tm.baseOvr >= 90), worldPool]
    }
  ];

  const koStages = koSpecs.map((spec, kIdx) => {
    const idx = 7 + kIdx;
    const oppLevel = STAGE_OPPONENT_LEVELS[idx] || (13 + kIdx * 2);
    const oppBuffPct = idx * 5;
    return createTournamentStage({
      stageName: spec.stageName,
      oppTeam: pickPoolTeam([...spec.pools, DB.teams], usedWorld),
      competition: "WORLD",
      oppBuffPct,
      oppLevel,
      ovrBoost: 0
    });
  });

  // Mantém apenas as 4 fases do Futebol Fronteira caso houvesse estado anterior e anexa as 7 do Mundial
  t.stages = [...t.stages.slice(0, 4), ...groupStages, ...koStages];
  t.worldUnlocked = true;
  t.stageIndex = 4;
  t.showRunSummary = false;

  t.teamEnergy = 100;
  openBetweenMatchPrep(4, { worldFullRest: true });
}

function buildGoalShotLabel(scorer) {
  const shMove = pickPlayerMove(scorer, "SH");
  if (shMove && Math.random() < 0.75) {
    return { isHissatsu: true, label: shMove };
  }
  const normalDesc =
    NORMAL_SHOT_DESCRIPTIONS[Math.floor(Math.random() * NORMAL_SHOT_DESCRIPTIONS.length)];
  return { isHissatsu: false, label: normalDesc };
}

function buildNarrationItemHTML(item) {
  let avatarsHTML = "";
  if (item.actor) {
    const actorSideCls = item.actor.side === "user" ? "side-user" : "side-opp";
    const actorImg = item.actor.sprite
      ? `<img class="nar-avatar ${actorSideCls}" src="${item.actor.sprite}" alt="${item.actor.name}" title="${item.actor.name}" />`
      : "";
    let targetImg = "";
    if (item.target && item.target.sprite) {
      const targetSideCls = item.target.side === "user" ? "side-user" : "side-opp";
      targetImg = `<span class="nar-vs-arrow">➔</span><img class="nar-avatar ${targetSideCls}" src="${item.target.sprite}" alt="${item.target.name}" title="${item.target.name}" />`;
    }
    if (actorImg) {
      avatarsHTML = `<div class="nar-avatars">${actorImg}${targetImg}</div>`;
    }
  }
  const catIcon = item.iconCat ? `<span class="nar-cat-badge">${renderPitchIconTag(item.iconCat, "nar-move-icon")}</span>` : "";
  return `<div class="narration-item ${item.cls || ""}">${avatarsHTML}<div class="nar-text">${catIcon}<span>${item.text}</span></div></div>`;
}

// Insere apenas 1 linha nova no topo do histórico de narração sem tocar no resto da página!
function prependNarrationLine(st, cls, text, actor = null, target = null, iconCat = null) {
  const item = { cls, text, actor, target, iconCat };
  st.narration.unshift(item);
  const feedEl = document.getElementById("live-narration-feed");
  const countEl = document.getElementById("live-narration-count");
  if (feedEl) {
    feedEl.insertAdjacentHTML("afterbegin", buildNarrationItemHTML(item));
  }
  if (countEl) {
    countEl.textContent = st.narration.length;
  }
}

function appendGoalItemDOM(side, goalObj) {
  const listEl = document.getElementById(side === "user" ? "live-goals-user" : "live-goals-opp");
  const emptyEl = document.getElementById(side === "user" ? "empty-goals-user" : "empty-goals-opp");
  if (emptyEl) emptyEl.remove();
  if (listEl) {
    const color = side === "user" ? (goalObj.isHissatsu ? "#86efac" : "#cbd5e1") : (goalObj.isHissatsu ? "#fca5a5" : "#cbd5e1");
    const assistPart = goalObj.assistName
      ? `<span style="color:#93c5fd; margin-left:4px;">• Assist: ${goalObj.assistName}</span>`
      : "";
    listEl.insertAdjacentHTML(
      "beforeend",
      `<div class="goal-item ${side === "user" ? "user-goal" : "opp-goal"}">
        <img src="${goalObj.sprite}" alt="" />
        <div>
          <div style="font-weight:800; color:#fff;">${goalObj.minute}' ${goalObj.name}</div>
          <div style="font-size:0.68rem; color:${color}; display:flex; align-items:center; flex-wrap:wrap; gap:4px;">
            ${goalObj.isHissatsu ? `${moveIconHTML("SH")} <span>${goalObj.shotLabel}</span>` : `<span>${goalObj.shotLabel}</span>`}${assistPart}
          </div>
        </div>
      </div>`
    );
  }
}

function clearTournamentTimers(resolvePending = false) {
  if (state.tournament.timerId) {
    clearInterval(state.tournament.timerId);
    state.tournament.timerId = null;
  }
  if (state.tournament.pitchRafId) {
    cancelAnimationFrame(state.tournament.pitchRafId);
    state.tournament.pitchRafId = null;
  }
  state.tournament._pitchRafGen = (state.tournament._pitchRafGen || 0) + 1;
  if (state.tournament.clashTimer1) {
    clearTimeout(state.tournament.clashTimer1);
    state.tournament.clashTimer1 = null;
  }
  if (state.tournament.clashTimer2) {
    clearTimeout(state.tournament.clashTimer2);
    state.tournament.clashTimer2 = null;
  }
  if (state.tournament.actionBeatTimer) {
    clearTimeout(state.tournament.actionBeatTimer);
    state.tournament.actionBeatTimer = null;
  }
  if (state.tournament.penTimerId) {
    clearTimeout(state.tournament.penTimerId);
    state.tournament.penTimerId = null;
  }
  if (state.tournament.prepTimerId) {
    clearTimeout(state.tournament.prepTimerId);
    state.tournament.prepTimerId = null;
  }
  if (state.tournament.prepMatchTimerId) {
    clearTimeout(state.tournament.prepMatchTimerId);
    state.tournament.prepMatchTimerId = null;
  }
  if (state.tournament.whistleTimerId) {
    clearTimeout(state.tournament.whistleTimerId);
    state.tournament.whistleTimerId = null;
  }
  if (typeof state.tournament.whistleKeyHandler === "function") {
    document.removeEventListener("keydown", state.tournament.whistleKeyHandler);
    state.tournament.whistleKeyHandler = null;
  }

  const calloutEl = document.getElementById("pitch-center-callout");
  if (calloutEl) {
    calloutEl.innerHTML = "";
    calloutEl.style.display = "none";
    calloutEl.className = "pitch-center-callout";
  }

  if (state.tournament.shotFlightTimer) {
    clearTimeout(state.tournament.shotFlightTimer);
    state.tournament.shotFlightTimer = null;
  }
  const activeClearPitch = state.tournament?.stages?.[state.tournament.stageIndex]?.pitch;
  if (activeClearPitch && Array.isArray(activeClearPitch.interceptTweens)) {
    activeClearPitch.interceptTweens = [];
  }
  if (resolvePending && typeof state.tournament.pendingShotFlightFinish === "function") {
    const sfn = state.tournament.pendingShotFlightFinish;
    state.tournament.pendingShotFlightFinish = null;
    sfn(true);
  } else {
    state.tournament.pendingShotFlightFinish = null;
  }

  if (state.tournament.netFlightTimer) {
    clearTimeout(state.tournament.netFlightTimer);
    state.tournament.netFlightTimer = null;
  }
  if (resolvePending && typeof state.tournament.pendingNetFlightFinish === "function") {
    const nfn = state.tournament.pendingNetFlightFinish;
    state.tournament.pendingNetFlightFinish = null;
    nfn(true);
  } else {
    state.tournament.pendingNetFlightFinish = null;
  }

  if (resolvePending && typeof state.tournament.pendingWhistleFinish === "function") {
    const wfn = state.tournament.pendingWhistleFinish;
    state.tournament.pendingWhistleFinish = null;
    wfn(true);
  } else {
    state.tournament.pendingWhistleFinish = null;
  }

  if (resolvePending && typeof state.tournament.pendingClashFinish === "function") {
    const fn = state.tournament.pendingClashFinish;
    state.tournament.pendingClashFinish = null;
    const slot = document.getElementById("shot-clash-slot");
    if (slot) {
      slot.classList.remove("is-fixed-overlay", "is-referee-overlay");
      slot.innerHTML = "";
      slot.style.display = "none";
    }
    fn(true);
  } else {
    state.tournament.pendingClashFinish = null;
    const slot = document.getElementById("shot-clash-slot");
    if (slot) {
      slot.classList.remove("is-fixed-overlay", "is-referee-overlay");
      slot.innerHTML = "";
      slot.style.display = "none";
    }
  }

  if (resolvePending && typeof state.tournament.pendingBeatFinish === "function") {
    const bfn = state.tournament.pendingBeatFinish;
    state.tournament.pendingBeatFinish = null;
    bfn(true);
  } else {
    state.tournament.pendingBeatFinish = null;
  }
}
