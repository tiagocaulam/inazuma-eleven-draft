function buildWorldGroupTableHTML(wg, t) {
  if (!wg || !Array.isArray(wg.standings)) return "";
  return `
    <div class="world-group-card">
      <div class="world-group-head">
        <div style="display:flex; align-items:center; gap:6px;">
          ${ffLogoIconHTML("inline-ui-icon")}
          <strong>MUNDIAL (FFI) • ${wg.groupName} (Top 2 classificam às Oitavas)</strong>
        </div>
        ${wg.lastOtherResult ? `<span class="world-group-other">Outro jogo: ${wg.lastOtherResult}</span>` : ""}
      </div>
      <div class="world-group-table-wrap">
      <table class="world-group-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Seleção</th>
            <th class="num">P</th>
            <th class="num">J</th>
            <th class="num">V</th>
            <th class="num">E</th>
            <th class="num">D</th>
            <th class="num">SG</th>
          </tr>
        </thead>
        <tbody>
          ${wg.standings
            .map((row, idx) => {
              const rank = idx + 1;
              const rowCls = [
                row.isUser ? "is-user-row" : "",
                rank <= 2 ? "is-qualifies" : "is-elim"
              ]
                .filter(Boolean)
                .join(" ");
              const gdStr = row.gd > 0 ? `+${row.gd}` : String(row.gd);
              return `
                <tr class="${rowCls}">
                  <td class="pos-col">${rank}º</td>
                  <td class="team-col">
                    ${row.emblem ? `<img src="${row.emblem}" alt="" />` : ""}
                    <span>${row.name}</span>
                  </td>
                  <td class="num pts-col">${row.pts}</td>
                  <td class="num">${row.p}</td>
                  <td class="num">${row.w}</td>
                  <td class="num">${row.d}</td>
                  <td class="num">${row.l}</td>
                  <td class="num">${gdStr}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
      </div>
    </div>
  `;
}

function getActiveBracketForTournament(t, focusIdx) {
  if (!t) return null;
  if (focusIdx <= 3 && t.ffBracket) return t.ffBracket;
  if (focusIdx >= 7 && t.worldBracket) return t.worldBracket;
  return null;
}

function buildTournamentBracketModalHTML(t, focusIdx) {
  const br = getActiveBracketForTournament(t, focusIdx);
  if (!br || !Array.isArray(br.rounds)) return "";
  const roundNames = ["Oitavas", "Quartas", "Semifinal", "Final"];
  const colsHTML = br.rounds
    .map((matches, rIdx) => {
      const cards = (matches || [])
        .map((m) => {
          const renderSide = (entry, scoreVal, oppWinner) => {
            if (!entry) {
              return `<div class="bracket-team-row is-tbd"><span class="bracket-team-name">A definir</span><span class="bracket-team-score">-</span></div>`;
            }
            const isWin = Boolean(m.played && m.winner && m.winner.id === entry.id);
            const isLoss = Boolean(m.played && m.winner && m.winner.id !== entry.id);
            const cls = ["bracket-team-row", entry.isUser ? "is-user-team" : "", isWin ? "is-winner" : "", isLoss ? "is-eliminated" : ""].filter(Boolean).join(" ");
            return `
              <div class="${cls}">
                ${entry.emblem ? `<img class="bracket-team-emblem" src="${entry.emblem}" alt="" />` : `<span class="bracket-emblem-ph"></span>`}
                <span class="bracket-team-name" title="${entry.name}">${entry.name}</span>
                <span class="bracket-team-score">${m.played && scoreVal !== null && scoreVal !== undefined ? scoreVal : ""}</span>
              </div>
            `;
          };
          const mCls = ["bracket-match-card", (m.a?.isUser || m.b?.isUser) ? "has-user-match" : "", m.played ? "is-played" : ""].filter(Boolean).join(" ");
          return `
            <div class="${mCls}">
              ${renderSide(m.a, m.scoreA)}
              ${renderSide(m.b, m.scoreB)}
              ${m.penText ? `<div class="bracket-pen-note">Pênaltis: ${m.penText}</div>` : ""}
            </div>
          `;
        })
        .join("");
      return `
        <div class="bracket-round-col">
          <div class="bracket-round-title">${roundNames[rIdx] || `Fase ${rIdx + 1}`}</div>
          <div class="bracket-round-matches">${cards}</div>
        </div>
      `;
    })
    .join("");

  return `
    <div class="live-tactics-modal-backdrop" id="tournament-bracket-modal">
      <div class="live-tactics-modal-card bracket-modal-card">
        <div class="live-tactics-modal-head">
          <div>
            <div style="font-size:0.68rem; font-weight:900; color:#facc15; text-transform:uppercase;">${ffLogoIconHTML("inline-ui-icon")} Chaveamento Oficial (16 Times)</div>
            <h4 style="margin:0; font-size:1rem; font-weight:900; color:#fff;">${br.title || "Chaveamento do Torneio"}</h4>
          </div>
          <button type="button" class="ie-cmd-btn" id="btn-close-bracket-modal" style="padding:5px 12px; font-size:0.74rem; background:#334155;">
            <span>Fechar ✕</span>
          </button>
        </div>
        ${br.champion ? `<div class="bracket-champion-banner">${ffLogoIconHTML("inline-ui-icon")} Campeão: <strong>${br.champion.name}</strong></div>` : ""}
        <div class="bracket-tree-scroll">
          <div class="bracket-rounds-grid">${colsHTML}</div>
        </div>
      </div>
    </div>
  `;
}

function bindTournamentBracketModalEvents(liveStage = null) {
  const modal = document.getElementById("tournament-bracket-modal");
  const openBtn = document.getElementById("btn-open-bracket-modal");
  const closeBtn = document.getElementById("btn-close-bracket-modal");
  if (!modal) return;
  let pausedByBracket = false;
  const closeFn = () => {
    modal.classList.remove("is-open");
    if (pausedByBracket && liveStage && !liveStage.finished) {
      pausedByBracket = false;
      liveStage.running = true;
      startPitchRafLoop(liveStage);
      startMatchInterval();
    }
  };
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      if (liveStage && liveStage.running && !liveStage.finished && !state.tournament.pendingWhistleFinish) {
        pausedByBracket = true;
        liveStage.running = false;
        clearTournamentTimers(true);
      }
      modal.classList.add("is-open");
    });
  }
  if (closeBtn) closeBtn.addEventListener("click", closeFn);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeFn();
  });
}

function buildFormationSelectorStripHTML() {
  return `
    <div class="tactics-control-bar" style="margin-bottom:8px; padding:7px 10px;">
      <div class="tac-group">
        <span class="tac-label">Formação</span>
        <div class="tac-pills">
          ${Object.keys(DB.formations || {})
            .map(
              (fk) =>
                `<button type="button" class="tac-pill-btn ${state.formation === fk ? "is-active" : ""}" data-tac-formation="${fk}">${fk}</button>`
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function syncTacticsLeadersDOM(rootEl) {
  if (!rootEl) return;
  const tac = getTactics();
  const slots = typeof getSlots === "function" ? getSlots() : [];
  const starters = slots
    .map((s) => ({ slot: s, player: state.squad?.[s.id] }))
    .filter((x) => Boolean(x.player));
  const capObj = typeof getActiveTeamCaptain === "function" ? getActiveTeamCaptain() : null;
  const capTacRole = capObj?.player?.id && capObj.player.id === tac.acePlayerId ? "CAMISA_10" : "NONE";
  const capAura = capObj && typeof getCaptainAuraInfo === "function" ? getCaptainAuraInfo(capObj.player, capObj.role, capTacRole) : null;
  const aceEntry = starters.find((x) => x.player.id === tac.acePlayerId && x.slot.role !== "GK") || null;
  if (tac.acePlayerId && !aceEntry) {
    tac.acePlayerId = null;
  }

  const capSel = rootEl.querySelector("[data-tac-captain]");
  if (capSel) {
    capSel.innerHTML = starters
      .map(
        ({ slot, player }) =>
          `<option value="${player.id}" ${capObj?.player?.id === player.id ? "selected" : ""}>[${slot.role}] ${player.name} (OVR ${getEffectiveOvr(player, slot.role)})</option>`
      )
      .join("");
  }
  const capAuraEl = rootEl.querySelector("[data-tac-captain-aura]");
  if (capAuraEl && capAura) {
    capAuraEl.innerHTML = `<span class="tac-archetype-chip">${capAura.archetypeLabel || "Líder"}</span> <strong>Aura: ${capAura.name}</strong> — ${capAura.shortEffect}`;
  }

  const aceSel = rootEl.querySelector("[data-tac-ace]");
  if (aceSel) {
    aceSel.innerHTML = `
      <option value="" ${!aceEntry ? "selected" : ""}>Automático (distribuído)</option>
      ${starters
        .filter((x) => x.slot.role !== "GK")
        .map(
          ({ slot, player }) =>
            `<option value="${player.id}" ${aceEntry?.player?.id === player.id ? "selected" : ""}>[${slot.role}] ${player.name} (OVR ${getEffectiveOvr(player, slot.role)})</option>`
        )
        .join("")}
    `;
  }
  const aceNoteEl = rootEl.querySelector("[data-tac-ace-note]");
  if (aceNoteEl) {
    aceNoteEl.innerHTML = aceEntry
      ? `O time procura mais <strong>${aceEntry.player.name}</strong> nos passes decisivos e finalizações.`
      : "Passes distribuídos conforme espaço livre e personalidade.";
  }
}

function buildUserSquadModalHTML(stats, t) {
  const clipIcon = typeof buildClipboardIconSVG === "function" ? buildClipboardIconSVG("tactics-clip-svg inline-ui-icon") : "";
  const formIcon = typeof formationIconHTML === "function" ? formationIconHTML("inline-ui-icon") : "";
  return `
    <div class="live-tactics-modal-backdrop" id="squad-overview-modal">
      <div class="live-tactics-modal-card squad-overview-modal-card">
        <div class="live-tactics-modal-head">
          <div>
            <div id="squad-modal-eyebrow" style="font-size:0.68rem; font-weight:900; color:#4ade80; text-transform:uppercase;">Dream Team • Formação <span id="squad-modal-form-val">${state.formation}</span></div>
            <h4 id="squad-modal-title" style="margin:0; font-size:1rem; font-weight:900; color:#fff;">Escalação (<span id="squad-modal-pwr-val">${stats.power.toLocaleString("pt-BR")}</span> Poder)</h4>
          </div>
          <button type="button" class="ie-cmd-btn" id="btn-close-squad-modal" style="padding:5px 12px; font-size:0.74rem; background:#334155;">
            <span>Fechar ✕</span>
          </button>
        </div>

        <div id="modal-panel-squad">
          <div class="modal-section-subhead">${formIcon} Escalação &amp; Formação (<span id="squad-collapse-form-val">${state.formation}</span>)</div>
          ${buildFormationSelectorStripHTML()}
          <div id="squad-pitch-modal-body">
            ${buildPitchHTML(true)}
          </div>
        </div>

        <div id="modal-panel-tactics" class="modal-tactics-section">
          <div class="modal-section-subhead">${clipIcon} Prancheta Tática • Capitão &amp; Tática Especial</div>
          ${buildTacticsControlBarHTML(false, false)}
        </div>
      </div>
    </div>
  `;
}

function buildTournamentBracketStripHTML(t, focusStageIdx) {
  const focusStage = t.stages[focusStageIdx] || t.stages[t.stageIndex];
  if (!focusStage) return "";

  const compName = focusStage.competition === "WORLD" ? "MUNDIAL (FFI)" : "FUTEBOL FRONTEIRA";
  const statusTxt = focusStage.finished
    ? `${focusStage.userScore} x ${focusStage.oppScore} · ${focusStage.won ? "Vitória" : focusStage.isDraw ? "Empate" : "Derrota"}`
    : t.prep && focusStageIdx === t.prep.nextStageIdx
    ? "Fase de Preparação"
    : "Partida ao Vivo";

  const isGroup = focusStage.isGroupStage;
  const roundSub = isGroup
    ? `Fase de Grupos • Rodada ${focusStage.groupRoundIdx + 1}/3`
    : focusStage.competition === "WORLD"
    ? "Mata-Mata do Mundial"
    : "Mata-Mata Eliminatório";

  const userStats = calcSquadStats();

  return `
    <div class="current-stage-hero-banner">
      <div class="current-stage-hero-left">
        <div class="current-stage-comp-badge">
          ${ffLogoIconHTML("inline-ui-icon")}
          <span>${compName}</span>
          <span style="opacity:0.4;">•</span>
          <span style="color:#93c5fd;">${roundSub}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <div class="current-stage-name-large">
            ${focusStage.stageName}
          </div>
          ${t.prep ? `
            <span class="prep-xp-pill" style="font-size:0.74rem; font-weight:900; background:rgba(161, 98, 7, 0.35); border:1px solid #facc15; color:#fde047;">
              Poder: ${userStats.power.toLocaleString("pt-BR")}
            </span>
            <span class="prep-xp-pill" style="font-size:0.72rem; font-weight:900; background:rgba(21, 128, 61, 0.35); border:1px solid #4ade80; color:#86efac;">
              Nv. ${userStats.avgLevel || 1} • OVR ${userStats.ovr} • Quím ${userStats.chem}%
            </span>
          ` : ""}
        </div>
      </div>

      ${
        t.prep
          ? ""
          : `
        <div class="current-stage-vs-badge">
          <span class="current-stage-vs-label">ADVERSÁRIO:</span>
          <div class="current-stage-opp-box">
            ${focusStage.oppTeam?.emblem ? `<img src="${focusStage.oppTeam.emblem}" alt="" class="current-stage-opp-emblem" />` : ""}
            <span class="current-stage-opp-name">${focusStage.oppTeam?.name || "A Definir"}</span>
            <span class="stage-opp-buff-badge" title="Nível do time adversário nesta fase (OVR ${focusStage.oppTeam?.baseOvr || 82})">Nv. ${getStageOpponentBuff(focusStageIdx).oppLevel} • Poder ${calcOpponentStats(focusStage.oppTeam, focusStageIdx).power.toLocaleString("pt-BR")}</span>
          </div>
          <span class="current-stage-status-pill">${statusTxt}</span>
        </div>
      `
      }
    </div>
  `;
}

// TELA 3: TORNEIO FUTEBOL FRONTEIRA & MUNDIAL (FFI)
function renderTournamentScreen() {
  hideBondPlayersTooltip();
  const container = document.getElementById("main-screen-container");
  if (!container) return;

  const t = state.tournament;
  document.body.classList.toggle("phase-prep", Boolean(t?.prep));
  const st = t.stages[t.stageIndex];
  const stats = calcSquadStats();
  const focusIdx = t.prep ? t.prep.nextStageIdx : t.stageIndex;
  const showGroupTable = Boolean(t.worldUnlocked && t.worldGroup && focusIdx <= 6);
  const groupTableHTML = showGroupTable ? buildWorldGroupTableHTML(t.worldGroup, t) : "";
  const activeBracket = getActiveBracketForTournament(t, focusIdx);
  const bracketModalHTML = activeBracket ? buildTournamentBracketModalHTML(t, focusIdx) : "";

  const pct = Math.min(100, Math.round((st.minute / st.maxMinute) * 100));

  const isFFFinalWin = Boolean(st.finished && st.won && st.competition === "FF" && t.stageIndex === 3 && !t.worldUnlocked);
  const isWorldFinalWin = Boolean(st.finished && st.won && t.worldUnlocked && t.stageIndex === t.stages.length - 1);
  const isGroupElim = Boolean(st.finished && st.isGroupStage && st.groupRoundIdx === 2 && getUserGroupRank(t.worldGroup) > 2);
  const isKnockoutLoss = Boolean(st.finished && !st.isGroupStage && !st.won);
  const isRunEnded = isWorldFinalWin || isGroupElim || isKnockoutLoss || (isFFFinalWin && t.showRunSummary);

  if (t.prep) {
    container.innerHTML = `
      ${groupTableHTML}
      ${buildBetweenMatchPrepHTML(t, stats)}
      ${buildUserSquadModalHTML(stats, t)}
      ${bracketModalHTML}
    `;

    const squadModal = document.getElementById("squad-overview-modal");
    const openSquadBtn = document.getElementById("btn-open-squad-modal");
    const openTacModalBtn = document.getElementById("btn-open-tactics-modal");
    const closeSquadBtn = document.getElementById("btn-close-squad-modal");
    const panelSquad = document.getElementById("modal-panel-squad");
    const panelTactics = document.getElementById("modal-panel-tactics");
    const modalEyebrow = document.getElementById("squad-modal-eyebrow");
    const modalTitle = document.getElementById("squad-modal-title");

    const bindSquadModalPitch = () => {
      const pitchBody = document.getElementById("squad-pitch-modal-body");
      if (!pitchBody) return;
      pitchBody.querySelectorAll("[data-slot]").forEach((node) => {
        node.addEventListener("click", () => {
          const slotId = node.getAttribute("data-slot");
          if (!slotId || !state.squad[slotId]) return;
          if (!state.swapSlotId) {
            state.swapSlotId = slotId;
          } else {
            if (state.swapSlotId !== slotId) {
              const tmp = state.squad[state.swapSlotId];
              state.squad[state.swapSlotId] = state.squad[slotId];
              state.squad[slotId] = tmp;
              saveActiveRunProgress();
            }
            state.swapSlotId = null;
          }
          pitchBody.innerHTML = buildPitchHTML(true);
          bindSquadModalPitch();
          renderHeaderAndBonds();
          syncTacticsLeadersDOM(squadModal);
          const pwrVal = document.getElementById("squad-modal-pwr-val");
          if (pwrVal) pwrVal.textContent = calcSquadStats().power.toLocaleString("pt-BR");
        });
      });
    };
    const closeSquadModal = () => {
      state.swapSlotId = null;
      hideBondPlayersTooltip();
      if (squadModal) squadModal.classList.remove("is-open");
      renderTournamentScreen();
    };
    const openSplitModal = (mode) => {
      if (!squadModal) return;
      state.swapSlotId = null;
      const isTactics = mode === "tactics";
      if (panelSquad) panelSquad.style.display = isTactics ? "none" : "block";
      if (panelTactics) panelTactics.style.display = isTactics ? "block" : "none";
      if (modalEyebrow) {
        modalEyebrow.innerHTML = isTactics
          ? `Dream Team • Comando Tático`
          : `Dream Team • Formação <span id="squad-modal-form-val">${state.formation}</span>`;
      }
      if (modalTitle) {
        const curPwr = calcSquadStats().power.toLocaleString("pt-BR");
        modalTitle.innerHTML = isTactics
          ? `Táticas, Capitão &amp; Especial`
          : `Escalação em Campo (<span id="squad-modal-pwr-val">${curPwr}</span> Poder)`;
      }
      if (!isTactics) {
        const pitchBody = document.getElementById("squad-pitch-modal-body");
        if (pitchBody) {
          pitchBody.innerHTML = buildPitchHTML(true);
          bindSquadModalPitch();
        }
      } else {
        syncTacticsLeadersDOM(squadModal);
      }
      squadModal.classList.add("is-open");
    };
    if (openSquadBtn) {
      openSquadBtn.addEventListener("click", () => openSplitModal("squad"));
    }
    if (openTacModalBtn) {
      openTacModalBtn.addEventListener("click", () => openSplitModal("tactics"));
    }
    if (closeSquadBtn && squadModal) {
      closeSquadBtn.addEventListener("click", closeSquadModal);
    }
    if (squadModal) {
      squadModal.addEventListener("click", (e) => {
        if (e.target === squadModal) closeSquadModal();
      });
    }

    if (t.prep.clash5v5?.miniSt?.pitch) {
      updatePitchCameraTransform(t.prep.clash5v5.miniSt.pitch, performance.now(), true);
    }

    container.querySelectorAll("[data-prep-loc]").forEach((card) => {
      card.addEventListener("click", () => {
        startPrepLocationTripleSlot(card.getAttribute("data-prep-loc"));
      });
    });

    bindTacticsControls(container, () => {
      // Atualiza o modal in-place para preservar scroll e estado colapsado/expandido!
      const pitchBody = document.getElementById("squad-pitch-modal-body");
      if (pitchBody) {
        pitchBody.innerHTML = buildPitchHTML(true);
        bindSquadModalPitch();
      }
      const formValEl = document.getElementById("squad-modal-form-val");
      if (formValEl) formValEl.textContent = state.formation;
      const collapseFormEl = document.getElementById("squad-collapse-form-val");
      if (collapseFormEl) collapseFormEl.textContent = state.formation;
      const openBtnSpan = openSquadBtn?.querySelector("span");
      if (openBtnSpan) {
        const formIcon = typeof formationIconHTML === "function" ? formationIconHTML("inline-ui-icon") : "";
        openBtnSpan.innerHTML = `${formIcon} Escalação (${state.formation})`;
      }
      const pwrVal = document.getElementById("squad-modal-pwr-val");
      if (pwrVal) pwrVal.textContent = calcSquadStats().power.toLocaleString("pt-BR");
      syncTacticsLeadersDOM(squadModal);
      renderHeaderAndBonds();
    });

    container.querySelectorAll("[data-scout-mark-id]").forEach((card) => {
      card.addEventListener("click", () => {
        const oppId = card.getAttribute("data-scout-mark-id");
        const oppRole = card.getAttribute("data-scout-mark-role");
        if (!oppId || oppRole === "GK") return;
        const tac = getTactics();
        tac.markedOppId = tac.markedOppId === oppId ? null : oppId;
        saveActiveRunProgress();
        renderAll();
      });
    });

    const cancelRestBtn = document.getElementById("btn-prep-cancel-rest");
    if (cancelRestBtn) {
      cancelRestBtn.addEventListener("click", () => {
        t.prep.phase = "CHOOSE_LOC";
        t.prep.locId = null;
        t.prep.choices = [];
        t.prep.energyNotice = null;
        saveActiveRunProgress();
        renderTournamentScreen();
      });
    }

    container.querySelectorAll("[data-prep-choice-idx]").forEach((cardEl) => {
      cardEl.addEventListener("click", (e) => {
        e.stopPropagation();
        const cIdx = parseInt(cardEl.getAttribute("data-prep-choice-idx"), 10);
        const chosen = t.prep.choices?.[cIdx];
        if (chosen) handleChoosePrepOption(chosen);
      });
    });

    container.querySelectorAll("[data-recruit-replace-slot]").forEach((targetCard) => {
      targetCard.addEventListener("click", () => {
        const slotId = targetCard.getAttribute("data-recruit-replace-slot");
        if (slotId && t.prep.recruitCandidate) {
          handleRecruitStarPlayer(t.prep.recruitCandidate, slotId);
        }
      });
    });

    const skipRecruitBtn = document.getElementById("btn-skip-recruit");
    if (skipRecruitBtn) {
      skipRecruitBtn.addEventListener("click", () => {
        t.prep.phase = "DONE";
        t.prep.appliedMsg = "Recrutamento dispensado. Seu elenco original segue inalterado!";
        saveActiveRunProgress();
        renderTournamentScreen();
      });
    }

    const secondEventBtn = document.getElementById("btn-prep-second-event");
    if (secondEventBtn) {
      secondEventBtn.addEventListener("click", () => {
        if (!t.prep.lastActionWasFreeRest) {
          t.prep.eventsRemaining = Math.max(0, (t.prep.eventsRemaining || 1) - 1);
        }
        t.prep.lastActionWasFreeRest = false;
        t.prep.phase = "CHOOSE_LOC";
        t.prep.locId = null;
        t.prep.choices = null;
        t.prep.slotStrips = null;
        t.prep.event = null;
        t.prep.clash5v5 = null;
        t.prep.recruitCandidate = null;
        t.prep.energyNotice = null;
        t.prep.appliedMsg = null;
        saveActiveRunProgress();
        renderTournamentScreen();
      });
    }

    const run5v5Btn = document.getElementById("btn-run-5v5");
    if (run5v5Btn) {
      run5v5Btn.addEventListener("click", () => runStreet5v5Challenge());
    }

    const prep5SpeedBtn = document.getElementById("btn-prep5-speed");
    if (prep5SpeedBtn) {
      prep5SpeedBtn.addEventListener("click", () => {
        const mSt5 = t.prep?.clash5v5?.miniSt;
        if (mSt5?.finished) return;
        state.simSpeed = state.simSpeed === 1 ? 2 : state.simSpeed === 2 ? 4 : 1;
        prep5SpeedBtn.innerHTML = `<span>Vel: ${state.simSpeed}x</span>`;
        if (
          state.simSpeed !== 1 &&
          (state.tournament.pendingClashFinish ||
            state.tournament.pendingBeatFinish ||
            state.tournament.pendingShotFlightFinish ||
            state.tournament.pendingNetFlightFinish)
        ) {
          clearTournamentTimers(true);
        }
        if (mSt5 && mSt5.running && !mSt5.finished) {
          startMatchInterval();
        }
      });
    }

    container.querySelectorAll("[data-prep-pick]").forEach((pCard) => {
      pCard.addEventListener("click", () => {
        applyPrepPlayerReward(pCard.getAttribute("data-prep-pick"));
      });
    });

    bindTournamentBracketModalEvents(null);

    const proceedBtn = document.getElementById("btn-prep-proceed");
    if (proceedBtn) {
      proceedBtn.addEventListener("click", () => {
        const nextIdx = t.prep.nextStageIdx;
        t.prep = null;
        runLiveMatchSimulation(nextIdx);
      });
    }
    return;
  }

  if (isRunEnded && t.showRunSummary) {
    const runSummaryObj = computeTournamentRunSummary(t);
    maybeAutoSaveRunToRanking(t);
    // No relatório final, não repete cards de chaveamento/topo nem de fases anteriores
    container.innerHTML = `
      ${groupTableHTML}
      ${buildRunSummaryCardHTML(runSummaryObj, stats, t)}
    `;

    const rankingNameForm = document.getElementById("run-ranking-name-form");
    if (rankingNameForm) {
      rankingNameForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const inputEl = document.getElementById("run-ranking-name-input");
        const cleanName = setSavedTeamName(inputEl ? inputEl.value : "");
        if (inputEl) inputEl.value = cleanName === "Dream Team" ? "" : cleanName;
        t.rankingTeamName = cleanName;
        const summaryNow = computeTournamentRunSummary(t);
        const statsNow = calcSquadStats();
        if (summaryNow) {
          t.rankingSavedSignature = `${t.runId}|${summaryNow.matchesPlayed}|${summaryNow.wins}|${summaryNow.draws}|${summaryNow.losses}|${Math.round(statsNow.power)}|${cleanName}`;
        }
        if (!renameLocalRankingEntry(t.runId, cleanName) && summaryNow) {
          upsertLocalRankingEntry(buildRankingEntryFromRun(t, summaryNow, statsNow));
        }
        const cfg = getRankingConfig();
        if (cfg.isOnline) {
          t.rankingStatus = "saving";
          updateRunRankingStatusBadge(t, `⏳ Atualizando nome para "${escapeHtml(cleanName)}"...`);
          try {
            const renamed = await renameOnlineRankingEntry(t.runId, t.runEditToken, cleanName);
            if (!renamed && summaryNow) {
              await pushOnlineRankingEntry(buildRankingEntryFromRun(t, summaryNow, statsNow), t.runEditToken);
            }
            if (state.tournament === t) {
              t.rankingStatus = "online";
              updateRunRankingStatusBadge(t, `✓ Nome "${escapeHtml(cleanName)}" atualizado no Ranking Global!`);
            }
          } catch {
            if (state.tournament === t) {
              t.rankingStatus = "local";
              updateRunRankingStatusBadge(t, `✓ Nome "${escapeHtml(cleanName)}" atualizado localmente!`);
            }
          }
        } else {
          t.rankingStatus = "local";
          updateRunRankingStatusBadge(t, `✓ Nome "${escapeHtml(cleanName)}" atualizado no ranking!`);
        }
      });
    }

    const advanceFromSummaryBtn = document.getElementById("btn-advance-world-from-summary");
    if (advanceFromSummaryBtn) {
      advanceFromSummaryBtn.addEventListener("click", () => advanceToWorldCup());
    }

    const retryBtn = document.getElementById("btn-retry-stage");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => runLiveMatchSimulation(t.stageIndex));
    }

    const newDraftLoss = document.getElementById("btn-new-draft-after-loss");
    if (newDraftLoss) {
      newDraftLoss.addEventListener("click", () => goToMenu());
    }

    const playAgainWin = document.getElementById("btn-play-again-draft");
    if (playAgainWin) {
      playAgainWin.addEventListener("click", () => goToMenu());
    }

    const rematchCup = document.getElementById("btn-rematch-cup");
    if (rematchCup) {
      rematchCup.addEventListener("click", () => startTournamentGo());
    }

    const exportPngBtn = document.getElementById("btn-export-run-png");
    if (exportPngBtn && runSummaryObj) {
      exportPngBtn.addEventListener("click", () => {
        exportRunSummaryImage(runSummaryObj, stats, t);
      });
    }
    return;
  }

  let postMatchBarHTML = "";
  if (st.finished) {
    if (isFFFinalWin) {
      postMatchBarHTML = `
        <div class="match-finish-bar is-win">
          <div>
            <strong>Campeão do Futebol Fronteira!</strong>
            <span>Você conquistou o Japão! Avance agora para a Fase de Grupos do Mundial (FFI) ou exporte o resumo.</span>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="ie-cmd-btn ie-cmd-gold" id="btn-advance-world-cup">
              <span>Avançar para o Mundial (FFI) →</span>
            </button>
            <button class="ie-cmd-btn" id="btn-view-run-results">
              <span>Resumo / Exportar PNG</span>
            </button>
          </div>
        </div>
      `;
    } else if (isRunEnded) {
      const isChamp = isWorldFinalWin;
      const endTitle = isChamp
        ? "Campeão Mundial (FFI)!"
        : isGroupElim
        ? `Eliminado no Grupo A (${getUserGroupRank(t.worldGroup)}º lugar)`
        : `Fim de jogo · ${st.oppTeam.name} venceu`;
      postMatchBarHTML = `
        <div class="match-finish-bar ${isChamp ? "is-win" : "is-loss"}">
          <div>
            <strong>${endTitle}</strong>
            <span>Clique para abrir o resumo completo da campanha, MVP e exportar imagem.</span>
          </div>
          <button class="ie-cmd-btn ${isChamp ? "ie-cmd-gold" : "ie-cmd-green"}" id="btn-view-run-results">
            <span>Ver Resultado &amp; Estatísticas →</span>
          </button>
        </div>
      `;
    } else {
      const nextStage = t.stages[t.stageIndex + 1];
      let barTitle = `Classificado para a ${nextStage.stageName}!`;
      let barSub = "Visite a cidade, vá ao campo ou treine no Inabikari antes do próximo jogo.";
      if (st.isGroupStage) {
        const rank = getUserGroupRank(t.worldGroup);
        const pts = t.worldGroup?.standings?.find((r) => r.isUser)?.pts || 0;
        if (st.groupRoundIdx < 2) {
          const resTxt = st.won ? "Vitória" : st.isDraw ? "Empate" : "Derrota";
          barTitle = `${resTxt} na ${st.stageName}! Dream Team em ${rank}º no Grupo A (${pts} pts)`;
          barSub = `Restam ${2 - st.groupRoundIdx} rodada(s) no grupo. Prepare o elenco para o próximo duelo!`;
        } else {
          barTitle = `Classificado em ${rank}º no Grupo A (${pts} pts)! Rumo às ${nextStage.stageName}!`;
          barSub = "Você garantiu vaga no Mata-Mata do Mundial! Escolha um local de preparação.";
        }
      }
      postMatchBarHTML = `
        <div class="match-finish-bar is-win">
          <div>
            <strong>${barTitle}</strong>
            <span>${barSub}</span>
          </div>
          <button class="ie-cmd-btn ie-cmd-green" id="btn-next-round">
            <span>Preparar para ${nextStage.stageName} →</span>
          </button>
        </div>
      `;
    }
  }

  if (!st.pitch) st.pitch = initMatchPitchState(st, t.stageIndex);
  const oppStats = calcOpponentStats(st.oppTeam, t.stageIndex);
  const compHeaderLabel = st.competition === "WORLD" ? "MUNDIAL (FFI)" : "FUTEBOL FRONTEIRA";

  // Na tela de partida ao vivo / transmissão, o banner de topo (bracketHTML) é omitido
  // para evitar redundâncias (adversário, status e competição já aparecem no cabeçalho e placar da partida).
  container.innerHTML = `
    ${groupTableHTML}
    ${bracketModalHTML}

    <div class="broadcast-card">
      <div class="broadcast-header">
        <div style="display:flex; align-items:center; gap:10px;">
          ${UI.raimonEmblem ? `<img src="${UI.raimonEmblem}" alt="" style="height:28px; width:28px; object-fit:contain;" />` : ""}
          <div>
            <span style="font-size:0.7rem; font-weight:900; color:#facc15; text-transform:uppercase;">
              ${compHeaderLabel} • ${st.stageName}
            </span>
            <h3 style="font-size:0.96rem; color:#fff; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <span>Dream Team (Nv. ${stats.avgLevel || 1}) vs ${st.oppTeam.name}</span>
              <span class="stage-opp-buff-badge">⚡ Nv. ${oppStats.oppLevel || 1}</span>
            </h3>
          </div>
        </div>
        ${activeBracket ? `<button type="button" class="ie-cmd-btn ie-cmd-blue" id="btn-open-bracket-modal" style="margin-left:auto; font-size:0.72rem; padding:6px 11px;"><span>Ver Chaveamento</span></button>` : ""}
      </div>

      <div class="time-bar-bg">
        <div class="time-bar-fill" id="live-bar-fill" style="width:${pct}%;"></div>
      </div>

      ${st.finished ? "" : buildTeamEnergyBarHTML(true, st.minute)}

      ${postMatchBarHTML}

      ${
        st.penaltiesText
          ? `<div style="text-align:center; background:rgba(250,204,21,0.15); border:1px solid #facc15; padding:6px; border-radius:8px; font-weight:800; color:#fde047; font-size:0.82rem;">
              ⚽ ${st.penaltiesText}
            </div>`
          : ""
      }

      <div class="match-arena-grid">
        ${buildLivePitchBoxHTML(st, st.oppTeam, stats, oppStats)}

        <div class="match-right-panel">
          <div id="goals-columns-box" class="goals-columns">
        <div class="goals-list" id="live-goals-user">
          <div style="font-size:0.7rem; font-weight:800; color:#4ade80; text-transform:uppercase; display:flex; align-items:center; gap:5px;">
            ${moveIconHTML("SH")} <span>Gols do Dream Team</span>
          </div>
          ${
            st.goalsUser.length === 0
              ? `<div id="empty-goals-user" style="font-size:0.74rem; color:#64748b;">Nenhum gol marcado ainda...</div>`
              : st.goalsUser
                  .map(
                    (g) => `
                <div class="goal-item user-goal">
                  <img src="${g.sprite}" alt="" />
                  <div>
                    <div style="font-weight:800; color:#fff;">${g.minute}' ${g.name}</div>
                    <div style="font-size:0.68rem; color:${g.isHissatsu ? "#86efac" : "#cbd5e1"}; display:flex; align-items:center; flex-wrap:wrap; gap:4px;">
                      ${g.isHissatsu ? `${moveIconHTML("SH")} <span>${g.shotLabel}</span>` : `<span>${g.shotLabel}</span>`}${g.assistName ? `<span style="color:#93c5fd; margin-left:4px;">• Assist: ${g.assistName}</span>` : ""}
                    </div>
                  </div>
                </div>
              `
                  )
                  .join("")
          }
        </div>

        <div class="goals-list" id="live-goals-opp">
          <div style="font-size:0.7rem; font-weight:800; color:#f87171; text-transform:uppercase; display:flex; align-items:center; gap:5px;">
            ${moveIconHTML("SH")} <span>Gols de ${st.oppTeam.name}</span>
          </div>
          ${
            st.goalsOpp.length === 0
              ? `<div id="empty-goals-opp" style="font-size:0.74rem; color:#64748b;">Nenhum gol sofrido...</div>`
              : st.goalsOpp
                  .map(
                    (g) => `
                <div class="goal-item opp-goal">
                  <img src="${g.sprite}" alt="" />
                  <div>
                    <div style="font-weight:800; color:#fff;">${g.minute}' ${g.name}</div>
                    <div style="font-size:0.68rem; color:${g.isHissatsu ? "#fca5a5" : "#cbd5e1"}; display:flex; align-items:center; gap:4px;">
                      ${g.isHissatsu ? `${moveIconHTML("SH")} <span>${g.shotLabel}</span>` : `<span>${g.shotLabel}</span>`}
                    </div>
                  </div>
                </div>
              `
                  )
                  .join("")
          }
        </div>
      </div>
        </div>

        <div class="narration-history-box">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
            <span style="font-size:0.74rem; font-weight:900; color:#facc15; text-transform:uppercase;">
              Narração ao Vivo (<span id="live-narration-count">${st.narration.length}</span>)
            </span>
            <span style="font-size:0.68rem; color:#93c5fd; display:inline-flex; align-items:center; gap:6px;">
              <span style="display:inline-flex; align-items:center; gap:2px;">${moveIconHTML("SH")} Chute</span>
              <span style="display:inline-flex; align-items:center; gap:2px;">${moveIconHTML("OF")} Drible</span>
              <span style="display:inline-flex; align-items:center; gap:2px;">${moveIconHTML("DF")} Roubo</span>
              <span style="display:inline-flex; align-items:center; gap:2px;">${moveIconHTML("GK")} Defesa</span>
            </span>
          </div>
          <div class="narration-feed" id="live-narration-feed">
            ${st.narration
              .map((item) => buildNarrationItemHTML(item))
              .join("")}
          </div>
        </div>
      </div>
    </div>

    ${
      !st.finished && !st.penalties
        ? `
      <div class="live-tactics-modal-backdrop" id="live-tactics-modal">
        <div class="live-tactics-modal-card squad-overview-modal-card">
          <div class="live-tactics-modal-head">
            <div>
              <div style="font-size:0.68rem; font-weight:900; color:#facc15; text-transform:uppercase;">Jogo Pausado</div>
              <h4 style="margin:0; font-size:1rem; font-weight:900; color:#fff;"><span class="btn-inline-flex">${typeof buildClipboardIconSVG === "function" ? buildClipboardIconSVG("tactics-clip-svg inline-ui-icon") : ""} Prancheta Tática (<span id="live-tactics-modal-min">${st.minute}'</span>)</span></h4>
            </div>
            <button type="button" class="ie-cmd-btn ie-cmd-green" id="btn-close-live-tactics">
              <span>Retomar ▶</span>
            </button>
          </div>
          <div class="live-tac-matchup-strip">
            <div class="live-tac-team-box is-user">
              <div class="live-tac-team-name">Dream Team</div>
              <div class="live-tac-team-meta" id="live-tac-user-meta">Nv. ${stats.avgLevel || 1} • Poder <strong>${stats.power.toLocaleString("pt-BR")}</strong> • Quím ${stats.chem}%</div>
            </div>
            <div class="live-tac-vs-sep">VS</div>
            <div class="live-tac-team-box is-opp">
              <div class="live-tac-team-name">${st.oppTeam.name}</div>
              <div class="live-tac-team-meta">Nv. ${oppStats.oppLevel || 1} • Poder <strong>${oppStats.power.toLocaleString("pt-BR")}</strong> • Quím ${oppStats.chem}%</div>
            </div>
          </div>
          ${buildTeamEnergyBarHTML(true, st.minute, "live-modal")}
          <div class="modal-tactics-section">
            <div class="modal-section-subhead">${typeof buildClipboardIconSVG === "function" ? buildClipboardIconSVG("tactics-clip-svg inline-ui-icon") : ""} Comandos Táticos ao Vivo</div>
            ${buildTacticsControlBarHTML(false, true)}
          </div>
          <div class="modal-collapse-section" id="live-squad-collapse-section">
            <button type="button" class="modal-collapse-header" id="btn-toggle-live-squad-collapse">
              <span>⚽ Escalação &amp; Formação (<span id="live-squad-form-val">${state.formation}</span>)</span>
              <span class="modal-collapse-chevron" id="live-squad-collapse-chevron">Expandir ▼</span>
            </button>
            <div class="modal-collapse-body is-collapsed" id="live-squad-collapse-body">
              ${buildFormationSelectorStripHTML()}
              <div id="live-tac-pitch-body">
                ${buildPitchHTML(true, getLiveStaminaMapForStage(st))}
              </div>
            </div>
          </div>
        </div>
      </div>
    `
        : ""
    }
  `;

  if (st.pitch && !st.finished && !st.penalties) {
    updatePitchCameraTransform(st.pitch, performance.now(), true);
    const tacModal = document.getElementById("live-tactics-modal");
    const liveCollapseBtn = document.getElementById("btn-toggle-live-squad-collapse");
    const liveCollapseBody = document.getElementById("live-squad-collapse-body");
    const liveCollapseChevron = document.getElementById("live-squad-collapse-chevron");

    const setLiveSquadCollapsed = (collapsed) => {
      if (liveCollapseBody) liveCollapseBody.classList.toggle("is-collapsed", collapsed);
      if (liveCollapseChevron) liveCollapseChevron.textContent = collapsed ? "Expandir ▼" : "Recolher ▲";
    };
    if (liveCollapseBtn && liveCollapseBody) {
      liveCollapseBtn.addEventListener("click", () => {
        setLiveSquadCollapsed(!liveCollapseBody.classList.contains("is-collapsed"));
      });
    }

    const syncLivePitchNodesFromSquad = (formationChanged = false) => {
      if (!st.pitch || !Array.isArray(st.pitch.userNodes)) return;
      const oldStaminaByPlayerId = {};
      const oldKeshinByPlayerId = {};
      st.pitch.userNodes.forEach((n) => {
        if (n.player?.id) {
          if (typeof n.stamina === "number") {
            oldStaminaByPlayerId[n.player.id] = n.stamina;
          }
          oldKeshinByPlayerId[n.player.id] = {
            keshinUsed: Boolean(n.keshinUsed),
            keshinState: n.keshinState || null,
            keshinTimer: n.keshinTimer || 0
          };
        }
      });
      const oldStatsByPlayerId = {};
      if (st.pitch.stats?.playerStats) {
        Object.values(st.pitch.stats.playerStats).forEach((ps) => {
          if (ps?.id) oldStatsByPlayerId[ps.id] = ps;
        });
      }
      const formSlots = getSlots();
      const slotMap = Object.fromEntries(formSlots.map((s) => [s.id, s]));

      if (formationChanged) {
        // Remapeia cada nó ao novo slot da formação mantendo player, stamina, posição física e uid
        const takenNodeUids = new Set();
        formSlots.forEach((s) => {
          const p = state.squad[s.id];
          if (!p) return;
          let node = st.pitch.userNodes.find((n) => n.player?.id === p.id && !takenNodeUids.has(n.uid));
          if (!node) {
            node = st.pitch.userNodes.find((n) => !takenNodeUids.has(n.uid));
          }
          if (!node) return;
          takenNodeUids.add(node.uid);
          node.slotId = s.id;
          node.role = s.role;
          node.tacticalRole = getTacticalRole(s.label);
          node.label = s.label;
          node.baseX = Math.max(7, Math.min(76, (96 - s.y) * 0.78 + 4));
          node.baseY = Math.max(12, Math.min(88, s.x));
        });
      }

      st.pitch.userNodes.forEach((n) => {
        const p = state.squad[n.slotId];
        if (!p) return;
        const prevStam = oldStaminaByPlayerId[p.id];
        const prevKeshin = oldKeshinByPlayerId[p.id];
        n.player = p;
        n.aiProfile = null; // Invalida personalidade cacheada para refletir novo jogador/função!
        if (!formationChanged) {
          const s = slotMap[n.slotId];
          if (s) {
            n.role = s.role;
            n.tacticalRole = getTacticalRole(s.label);
            n.label = s.label;
          }
        }
        n.effOvr = getEffectiveOvr(p, n.role);
        n.level = getPlayerLevel(p);
        n.indivPower = calcIndividualPlayerPower(p, n.role, n.level);
        n.attrs = calcPlayerAttributes(p, n.role, n.level);
        n.spd = n.attrs.vel;
        n.maxSpeed = calcNodeBaseSpeed(n.tacticalRole, n.effOvr, p);
        if (typeof prevStam === "number") {
          n.stamina = prevStam;
        }
        if (prevKeshin) {
          n.keshinUsed = prevKeshin.keshinUsed;
          n.keshinState = prevKeshin.keshinState;
          n.keshinTimer = prevKeshin.keshinTimer;
        }
        if (st.pitch.stats?.playerStats) {
          const prevStat = oldStatsByPlayerId[p.id];
          st.pitch.stats.playerStats[n.uid] = {
            ...(prevStat || {
              goals: 0, assists: 0, passesOk: 0, passesTry: 0,
              gkReleases: 0, dribblesOk: 0, dribblesTry: 0,
              steals: 0, blocks: 0, shots: 0, saves: 0
            }),
            uid: n.uid,
            slotId: n.slotId,
            role: n.role,
            id: p.id,
            name: p.name,
            fullName: p.fullName || p.name,
            sprite: getPlayerFormSprite(p, n.role),
            element: p.element,
            teamEmblem: p.teamEmblem,
            teamName: p.teamName,
            ovr: n.effOvr
          };
        }
        const dynSprite = resolveDynamicNodeSprite(n, st.pitch);
        n._renderedSprite = dynSprite;
        const tokEl = document.getElementById(`pnode-${n.uid}`);
        if (tokEl) {
          const avEl = tokEl.querySelector(".pitch-token-avatar");
          const nmEl = tokEl.querySelector(".pitch-token-name");
          if (avEl) avEl.src = dynSprite;
          if (nmEl) nmEl.textContent = (p.name || n.label).split(" ").slice(-1)[0];
        }
      });
      recomputePitchTargets(st.pitch);
      st.pitch.matchSupportInitialized = false;
      ensureMatchSupport(st, st.pitch);
      syncLivePitchDOM(st);
    };

    const bindLiveTacPitch = () => {
      const pitchBody = document.getElementById("live-tac-pitch-body");
      if (!pitchBody) return;
      pitchBody.querySelectorAll("[data-slot]").forEach((nodeEl) => {
        nodeEl.addEventListener("click", () => {
          const slotId = nodeEl.getAttribute("data-slot");
          if (!slotId || !state.squad[slotId]) return;
          if (!state.swapSlotId) {
            state.swapSlotId = slotId;
          } else {
            if (state.swapSlotId !== slotId) {
              const tmp = state.squad[state.swapSlotId];
              state.squad[state.swapSlotId] = state.squad[slotId];
              state.squad[slotId] = tmp;
              syncLivePitchNodesFromSquad(false);
              saveActiveRunProgress();
            }
            state.swapSlotId = null;
          }
          pitchBody.innerHTML = buildPitchHTML(true, getLiveStaminaMapForStage(st));
          bindLiveTacPitch();
          renderHeaderAndBonds();
          const curSt = calcSquadStats();
          const uMeta = document.getElementById("live-tac-user-meta");
          if (uMeta) {
            uMeta.innerHTML = `Nv. ${curSt.avgLevel || 1} • Poder <strong>${curSt.power.toLocaleString("pt-BR")}</strong> • Quím ${curSt.chem}%`;
          }
        });
      });
    };

    if (tacModal) {
      bindTacticsControls(tacModal, () => {
        syncLivePitchNodesFromSquad(true);
        const liveFormEl = document.getElementById("live-squad-form-val");
        if (liveFormEl) liveFormEl.textContent = state.formation;
        const pitchBody = document.getElementById("live-tac-pitch-body");
        if (pitchBody) {
          pitchBody.innerHTML = buildPitchHTML(true, getLiveStaminaMapForStage(st));
          bindLiveTacPitch();
        }
        renderHeaderAndBonds();
        const curSt = calcSquadStats();
        const uMeta = document.getElementById("live-tac-user-meta");
        if (uMeta) {
          uMeta.innerHTML = `Nv. ${curSt.avgLevel || 1} • Poder <strong>${curSt.power.toLocaleString("pt-BR")}</strong> • Quím ${curSt.chem}%`;
        }
      });
    }

    const openTacBtn = document.getElementById("btn-open-live-tactics");
    const closeTacBtn = document.getElementById("btn-close-live-tactics");
    const pauseForTactics = () => {
      if (st.finished || state.tournament.pendingWhistleFinish) return;
      hideBondPlayersTooltip();
      st.running = false;
      clearTournamentTimers(true);
      state.swapSlotId = null;
      const minEl = document.getElementById("live-tactics-modal-min");
      if (minEl) minEl.textContent = `${st.minute}'`;
      syncTeamEnergyBarDOM("live-modal", st.minute);
      const curSt = calcSquadStats();
      const uMeta = document.getElementById("live-tac-user-meta");
      if (uMeta) {
        uMeta.innerHTML = `Nv. ${curSt.avgLevel || 1} • Poder <strong>${curSt.power.toLocaleString("pt-BR")}</strong> • Quím ${curSt.chem}%`;
      }
      const liveFormEl = document.getElementById("live-squad-form-val");
      if (liveFormEl) liveFormEl.textContent = state.formation;
      const pitchBody = document.getElementById("live-tac-pitch-body");
      if (pitchBody) {
        pitchBody.innerHTML = buildPitchHTML(true, getLiveStaminaMapForStage(st));
        bindLiveTacPitch();
      }
      setLiveSquadCollapsed(true);
      if (tacModal) tacModal.classList.add("is-open");
    };
    const resumeFromTactics = () => {
      state.swapSlotId = null;
      hideBondPlayersTooltip();
      if (tacModal) tacModal.classList.remove("is-open");
      if (!st.finished) {
        st.running = true;
        startPitchRafLoop(st);
        startMatchInterval();
      }
    };
    if (openTacBtn) openTacBtn.addEventListener("click", pauseForTactics);
    if (closeTacBtn) closeTacBtn.addEventListener("click", resumeFromTactics);
    if (tacModal) {
      tacModal.addEventListener("click", (e) => {
        if (e.target === tacModal) resumeFromTactics();
      });
    }
  }

  if (!st.finished && st.penalties) {
    attachPenaltyListeners(st);
  }

  const speedBtn = document.getElementById("btn-toggle-speed");
  if (speedBtn) {
    speedBtn.addEventListener("click", () => {
      state.simSpeed = state.simSpeed === 1 ? 2 : state.simSpeed === 2 ? 4 : 1;
      speedBtn.innerHTML = `<span>Vel: ${state.simSpeed}x</span>`;
      if (
        state.simSpeed !== 1 &&
        (state.tournament.pendingClashFinish ||
          state.tournament.pendingBeatFinish ||
          state.tournament.pendingShotFlightFinish ||
          state.tournament.pendingNetFlightFinish)
      ) {
        clearTournamentTimers(true);
      }
      if (st.running && !st.finished && !state.tournament.pendingWhistleFinish) {
        startMatchInterval();
      }
    });
  }

  const hissatsuBtn = document.getElementById("btn-activate-hissatsu-tactic");
  if (hissatsuBtn) {
    hissatsuBtn.addEventListener("click", () => {
      if (typeof activateUserHissatsuTactic === "function") {
        activateUserHissatsuTactic(st);
      }
    });
  }

  const advanceWorldBtn = document.getElementById("btn-advance-world-cup");
  if (advanceWorldBtn) {
    advanceWorldBtn.addEventListener("click", () => {
      advanceToWorldCup();
    });
  }

  const viewResultsBtn = document.getElementById("btn-view-run-results");
  if (viewResultsBtn) {
    viewResultsBtn.addEventListener("click", () => {
      state.tournament.showRunSummary = true;
      renderTournamentScreen();
    });
  }

  const nextRoundBtn = document.getElementById("btn-next-round");
  if (nextRoundBtn) {
    nextRoundBtn.addEventListener("click", () => {
      openBetweenMatchPrep(t.stageIndex + 1);
    });
  }

  bindTournamentBracketModalEvents(st);
}

function renderMainScreen() {
  renderHeaderAndBonds();
  if (state.phase === "menu") {
    renderStartMenuScreen();
  } else if (state.phase === "tournament") {
    renderTournamentScreen();
    saveActiveRunProgress();
  } else {
    renderDraftScreen();
    saveActiveRunProgress();
  }
}

function hideBondPlayersTooltip() {
  const tip = document.getElementById("bond-players-tooltip");
  if (tip) {
    tip.classList.remove("is-open");
    tip._anchorEl = null;
  }
}

function showBondPlayersTooltip(anchorEl, playersRaw) {
  if (!anchorEl || !playersRaw) return;
  let tip = document.getElementById("bond-players-tooltip");
  if (!tip) {
    tip = document.createElement("div");
    tip.id = "bond-players-tooltip";
    tip.className = "bond-players-tooltip";
    document.body.appendChild(tip);
  }
  if (tip.classList.contains("is-open") && tip._anchorEl === anchorEl) {
    hideBondPlayersTooltip();
    return;
  }
  const names = playersRaw.split("||").map((s) => s.trim()).filter(Boolean);
  if (names.length === 0) {
    hideBondPlayersTooltip();
    return;
  }
  tip.innerHTML = `<div class="bond-players-tooltip-names">${names.map((n) => `<span class="bond-players-tooltip-name">${n}</span>`).join("")}</div>`;
  tip.classList.add("is-open");
  tip._anchorEl = anchorEl;

  const rect = anchorEl.getBoundingClientRect();
  const tipRect = tip.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let left = Math.max(10, Math.min(vw - tipRect.width - 10, rect.left + rect.width / 2 - tipRect.width / 2));
  let top = rect.top - tipRect.height - 8;
  if (top < 8) {
    top = Math.min(vh - tipRect.height - 8, rect.bottom + 8);
  }
  tip.style.left = `${Math.round(left)}px`;
  tip.style.top = `${Math.round(top)}px`;
}

function showActiveBuffTooltip(anchorEl) {
  if (!anchorEl) return;
  const title = anchorEl.getAttribute("data-buff-tip-title") || "";
  const stat = anchorEl.getAttribute("data-buff-tip-stat") || "";
  const desc = anchorEl.getAttribute("data-buff-tip-desc") || "";
  if (!title && !desc) return;

  let tip = document.getElementById("bond-players-tooltip");
  if (!tip) {
    tip = document.createElement("div");
    tip.id = "bond-players-tooltip";
    tip.className = "bond-players-tooltip";
    document.body.appendChild(tip);
  }
  if (tip.classList.contains("is-open") && tip._anchorEl === anchorEl) {
    hideBondPlayersTooltip();
    return;
  }
  tip.innerHTML = `
    <div class="buff-tooltip-card">
      <div class="buff-tooltip-title">${title}</div>
      ${stat ? `<div class="buff-tooltip-stat">${stat}</div>` : ""}
      ${desc ? `<div class="buff-tooltip-desc">${desc}</div>` : ""}
    </div>
  `;
  tip.classList.add("is-open");
  tip._anchorEl = anchorEl;

  const rect = anchorEl.getBoundingClientRect();
  const tipRect = tip.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const left = Math.max(10, Math.min(vw - tipRect.width - 10, rect.left + rect.width / 2 - tipRect.width / 2));
  let top = rect.top - tipRect.height - 8;
  if (top < 8) {
    top = Math.min(vh - tipRect.height - 8, rect.bottom + 8);
  }
  tip.style.left = `${Math.round(left)}px`;
  tip.style.top = `${Math.round(top)}px`;
}

function renderAll() {
  hideBondPlayersTooltip();
  renderMainScreen();
}

function goToMenu() {
  saveActiveRunProgress();
  clearRankingEscListener();
  clearTournamentTimers(false);
  if (state.spinTimerId) {
    clearTimeout(state.spinTimerId);
    state.spinTimerId = null;
  }
  state.isSpinning = false;
  state.storyLockNotice = false;
  state.phase = "menu";
  state.squad = {};
  state.currentTeam = null;
  state.selectedPlayer = null;
  state.peekField = false;
  state.swapSlotId = null;
  state.usedTeamIds = [];
  state.tournament = createFreshTournamentState();
  renderAll();
}

function init() {
  const topEmblem = document.getElementById("topbar-emblem");
  if (topEmblem && UI.raimonEmblem) {
    topEmblem.src = UI.raimonEmblem;
  }

  const resetBtn = document.getElementById("btn-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => goToMenu());
  }

  const autoBtn = document.getElementById("btn-auto-draft");
  if (autoBtn) {
    autoBtn.addEventListener("click", () => {
      clearTournamentTimers(false);
      if (state.spinTimerId) {
        clearTimeout(state.spinTimerId);
        state.spinTimerId = null;
      }
      const wasDraft = state.phase === "draft";
      state.isSpinning = false;
      state.phase = "draft";
      state.tournament = createFreshTournamentState();
      if (!wasDraft) {
        state.squad = {};
        state.usedTeamIds = [];
        state.rerollsLeft = state.hideOvrBeforePick ? 0 : 3;
      }
      const openSlots = getOpenSlots();
      const pickedIds = getPickedPlayerIds();
      const pickedFulls = getPickedFullNames();
      openSlots.forEach((slot) => {
        const candidates = [];
        DB.teams.forEach((t) => {
          t.players.forEach((p) => {
            const fnKey = (p.fullName || p.name || "").trim().toLowerCase();
            if (!pickedIds.has(p.id) && !(fnKey && pickedFulls.has(fnKey)) && playerMatchesRole(p, slot.role)) {
              candidates.push(cloneFreshPlayerForSquad(p, t, 1));
            }
          });
        });
        if (candidates.length === 0) {
          DB.teams.forEach((t) => {
            t.players.forEach((p) => {
              const fnKey = (p.fullName || p.name || "").trim().toLowerCase();
              if (!pickedIds.has(p.id) && !(fnKey && pickedFulls.has(fnKey))) {
                candidates.push(cloneFreshPlayerForSquad(p, t, 1));
              }
            });
          });
        }
        if (candidates.length > 0) {
          const pick = candidates[Math.floor(Math.random() * candidates.length)];
          state.squad[slot.id] = pick;
          pickedIds.add(pick.id);
          const fnKey = (pick.fullName || pick.name || "").trim().toLowerCase();
          if (fnKey) pickedFulls.add(fnKey);
        }
      });
      state.selectedPlayer = null;
      state.peekField = false;
      state.swapSlotId = null;
      renderAll();
    });
  }

  document.addEventListener("click", (e) => {
    const buffChip = e.target.closest("[data-buff-tip-title]");
    if (buffChip) {
      e.stopPropagation();
      showActiveBuffTooltip(buffChip);
      return;
    }
    const chip = e.target.closest("[data-bond-players]");
    if (chip) {
      e.stopPropagation();
      showBondPlayersTooltip(chip, chip.getAttribute("data-bond-players"));
      return;
    }
    if (!e.target.closest("#bond-players-tooltip")) {
      hideBondPlayersTooltip();
    }
  });

  window.addEventListener("pagehide", () => saveActiveRunProgress());

  renderAll();
}

document.addEventListener("DOMContentLoaded", init);
