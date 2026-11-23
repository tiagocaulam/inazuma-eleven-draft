// ============================================================================
// RENDERIZAÇÃO DAS TELAS
// ============================================================================
function renderHeaderAndBonds() {
  const inPrep = Boolean(state.phase === "tournament" && state.tournament?.prep);
  document.body.classList.toggle("phase-tournament", state.phase === "tournament");
  document.body.classList.toggle("phase-prep", inPrep);
  const autoBtn = document.getElementById("btn-auto-draft");
  if (autoBtn) {
    autoBtn.style.display = state.phase === "draft" ? "inline-flex" : "none";
  }
  const subEl = document.getElementById("topbar-brand-sub");
  if (subEl) {
    if (state.phase === "tournament") {
      const curSt = state.tournament?.stages?.[state.tournament.stageIndex];
      const comp = state.tournament?.prep
        ? state.tournament.stages?.[state.tournament.prep.nextStageIdx]?.competition
        : curSt?.competition;
      subEl.textContent =
        comp === "WORLD" ? "MODO RELÂMPAGO • MUNDIAL (FFI)" : "MODO RELÂMPAGO • FUTEBOL FRONTEIRA";
    } else {
      subEl.textContent = "DREAM TEAM • MODO RELÂMPAGO";
    }
  }
  const headerWrap = document.getElementById("hud-bars-wrap");
  if (!headerWrap) return;

  if (state.phase === "menu") {
    headerWrap.style.display = "none";
    return;
  }

  headerWrap.style.display = "flex";
  const stats = calcSquadStats();
  const pwrEl = document.getElementById("val-power");
  if (pwrEl) pwrEl.textContent = stats.power.toLocaleString("pt-BR");
  const lvlEl = document.getElementById("val-lvl");
  if (lvlEl) lvlEl.textContent = `Nv. ${stats.avgLevel || 1}`;
  document.getElementById("val-ovr").textContent = stats.ovr;
  document.getElementById("val-atk").textContent = stats.atk;
  document.getElementById("val-mid").textContent = stats.mid;
  document.getElementById("val-def").textContent = stats.def;
  document.getElementById("val-chem").textContent = `${stats.chem}%`;

  const bondsBar = document.getElementById("bonds-bar");
  if (bondsBar) {
    if (state.phase === "draft" || inPrep) {
      // Na montagem (draft) e na preparação, o topo exibe exatamente as mesmas barras de Poder/Nível/OVR/Química do Draft!
      bondsBar.style.display = "none";
    } else {
      bondsBar.style.display = "flex";
      if (stats.activeBonds.length === 0) {
        bondsBar.innerHTML = `<span style="color:#93c5fd; display:inline-flex; align-items:center; gap:5px; flex-wrap:wrap;">${formationIconHTML("inline-ui-icon")} <strong>Dica Tática:</strong> Escale jogadores na <strong>posição correta</strong> (improvisar aplica -OVR no atleta) e conecte o <strong>mesmo elemento colado</strong> para ativar links elementais!</span>`;
      } else {
        bondsBar.innerHTML =
          `<strong style="color:#38bdf8; margin-right:4px; display:inline-flex; align-items:center; gap:4px;">${captainIconHTML("inline-ui-icon")} Laços:</strong>` +
          stats.activeBonds
            .map((b) => {
              const playersList = Array.isArray(b.players) && b.players.length > 0 ? b.players.join("||") : "";
              const safeAttr = playersList ? ` data-bond-players="${playersList.replace(/"/g, "&quot;")}"` : "";
              const clickCls = playersList ? " is-clickable" : "";
              const typeCls = b.type === "friendship" ? "friendship" : b.type === "perfect-formation" ? "perfect-formation" : b.type === "warn-pos" ? "warn-pos" : "";
              return `<span class="bond-tag ${typeCls}${clickCls}"${safeAttr}>${b.label}</span>`;
            })
            .join("");
      }
    }
  }
}

let _activeRankingEscHandler = null;
function clearRankingEscListener() {
  if (_activeRankingEscHandler) {
    document.removeEventListener("keydown", _activeRankingEscHandler);
    _activeRankingEscHandler = null;
  }
}

function renderRankingModalList(entries, filterDiff = "all", expandedSet = new Set(), noticeMsg = "") {
  const bodyEl = document.getElementById("ranking-list-body");
  const countEl = document.getElementById("ranking-count-pill");
  if (!bodyEl) return;

  const sortedAll = (Array.isArray(entries) ? entries : []).slice().sort(compareRankingEntries);
  const filtered = sortedAll.filter((entry) => filterDiff === "all" || entry.difficulty === filterDiff);
  if (countEl) {
    countEl.textContent = `${filtered.length} ${filtered.length === 1 ? "time" : "times"}`;
  }

  const noticeHTML = noticeMsg
    ? `<div class="ranking-notice-banner">${escapeHtml(noticeMsg)}</div>`
    : "";

  if (filtered.length === 0) {
    bodyEl.innerHTML = `${noticeHTML}
      <div class="ranking-empty-state">
        <strong>Nenhum time registrado ainda${filterDiff !== "all" ? " nesta dificuldade" : ""}.</strong>
        <span>Complete uma campanha (vitória ou eliminação) para entrar no Ranking por Força de Time!</span>
      </div>
    `;
    return;
  }

  bodyEl.innerHTML = `${noticeHTML}
    <div class="ranking-list">
      ${filtered
        .map((entry, idx) => {
          const pos = idx + 1;
          const posCls = pos === 1 ? "rank-1" : pos === 2 ? "rank-2" : pos === 3 ? "rank-3" : "";
          const isExpanded = expandedSet.has(entry.runId);
          const diffLabel = entry.difficulty === "hidden" ? "Difícil" : "Fácil";
          const champBadge = entry.isWorldChampion
            ? `<span class="ranking-micro-badge is-world">🏆 Mundial</span>`
            : entry.isChampion
            ? `<span class="ranking-micro-badge is-ff">🥇 FF</span>`
            : "";
          const rosterHTML = (entry.roster || [])
            .map((pl) => {
              const roleSafe = VALID_RANKING_ROLES.has(pl.role) ? pl.role : "MF";
              const elemSafe = VALID_RANKING_ELEMENTS.has(pl.element) ? pl.element : "";
              const spr = resolveRankingPlayerSprite(pl);
              return `
                <div class="ranking-roster-item${pl.isImprovised ? " is-improvised" : ""}">
                  <div class="ranking-roster-avatar-wrap">
                    ${spr ? `<img class="ranking-roster-avatar" src="${spr}" alt="${escapeHtml(pl.name)}" />` : `<div class="ranking-roster-avatar"></div>`}
                    ${elemSafe ? elemIconHTML(elemSafe, "ranking-roster-elem") : ""}
                  </div>
                  <div class="ranking-roster-info">
                    <div class="ranking-roster-name-row">
                      ${posIconHTML(roleSafe, true)}
                      <span class="ranking-roster-slot">${escapeHtml(pl.slotLabel || roleSafe)}${pl.isImprovised ? " *" : ""}</span>
                      <span class="ranking-roster-name">${escapeHtml(pl.name)}</span>
                    </div>
                    <div class="ranking-roster-meta">
                      <span class="ranking-roster-lvl">Nv.${pl.level}</span>
                      <span>OVR ${pl.ovr}</span>
                    </div>
                  </div>
                  <span class="ranking-roster-pwr">⚔️ ${Number(pl.power || 0).toLocaleString("pt-BR")}</span>
                </div>
              `;
            })
            .join("");

          return `
            <div class="ranking-entry-card${isExpanded ? " is-expanded" : ""}" data-rank-id="${escapeHtml(entry.runId)}">
              <button type="button"
                      class="ranking-entry-head"
                      data-rank-toggle="${escapeHtml(entry.runId)}"
                      aria-expanded="${isExpanded ? "true" : "false"}">
                <span class="ranking-pos-badge ${posCls}">#${pos}</span>
                <div class="ranking-entry-main">
                  <div class="ranking-entry-title-row">
                    <span class="ranking-team-name">${escapeHtml(entry.teamName)}</span>
                    ${champBadge}
                    <span class="ranking-micro-badge is-diff-${entry.difficulty}">${diffLabel}</span>
                  </div>
                  <div class="ranking-entry-sub-row">
                    <span>Nv. ${entry.avgLevel}</span>
                    <span>•</span>
                    <span>${entry.wins}V ${entry.draws}E ${entry.losses}D</span>
                    <span>•</span>
                    <span>${escapeHtml(entry.formation)}</span>
                  </div>
                </div>
                <div class="ranking-entry-right">
                  <span class="ranking-power-pill">⚔️ ${Number(entry.power || 0).toLocaleString("pt-BR")}</span>
                  <span class="ranking-chevron" aria-hidden="true">▾</span>
                </div>
              </button>
              <div class="ranking-entry-body">
                <div class="ranking-stats-strip">
                  <div class="ranking-stat-box">
                    <small>Nível Médio</small>
                    <strong>Nv. ${entry.avgLevel}</strong>
                  </div>
                  <div class="ranking-stat-box">
                    <small>Campanha (V/E/D)</small>
                    <strong>${entry.wins}V · ${entry.draws}E · ${entry.losses}D</strong>
                    <span>${escapeHtml(entry.stageName || `${entry.matchesPlayed} jogos`)}</span>
                  </div>
                  <div class="ranking-stat-box">
                    <small>OVR / Química</small>
                    <strong>OVR ${entry.ovr} · ${entry.chem}%</strong>
                  </div>
                  <div class="ranking-stat-box">
                    <small>Formação / Modo</small>
                    <strong>${escapeHtml(entry.formation)} · ${diffLabel}</strong>
                  </div>
                </div>
                ${
                  rosterHTML
                    ? `<div class="ranking-roster-title">Escalação (${entry.roster.length}/11)</div>
                       <div class="ranking-roster-grid">${rosterHTML}</div>`
                    : `<div class="ranking-empty-roster">Escalação detalhada indisponível para este registro.</div>`
                }
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;

  bodyEl.querySelectorAll("[data-rank-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-rank-toggle");
      if (!id) return;
      const card = btn.closest(".ranking-entry-card");
      if (expandedSet.has(id)) {
        expandedSet.delete(id);
        if (card) card.classList.remove("is-expanded");
        btn.setAttribute("aria-expanded", "false");
      } else {
        expandedSet.add(id);
        if (card) card.classList.add("is-expanded");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

// TELA 1: MENU INICIAL ESTILO JOGO
function renderStartMenuScreen() {
  clearRankingEscListener();
  const container = document.getElementById("main-screen-container");
  if (!container) return;

  const stadiumStyle = UI.stadiumBg ? `background-image: url('${UI.stadiumBg}');` : "";
  const rankCfg = getRankingConfig();
  const savedRun = loadActiveRunPreview();

  container.innerHTML = `
    <div class="start-menu-card">
      <div class="start-hero-banner" style="${stadiumStyle}">
        <div class="start-hero-overlay"></div>
        <button type="button"
                class="start-ranking-icon-btn"
                id="btn-open-ranking-modal"
                title="Ranking por Força de Time"
                aria-label="Abrir Ranking por Força de Time">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        </button>
        <div class="start-hero-content">
          ${UI.ieLogo ? `<img class="start-ie-logo" src="${UI.ieLogo}" alt="Inazuma Eleven" />` : `<h2>INAZUMA ELEVEN</h2>`}
          <div class="start-title-ribbon">DREAM TEAM • MODO RELÂMPAGO</div>
        </div>
      </div>

      <div class="start-body">
        ${
          savedRun
            ? `<div class="continue-run-banner" id="continue-run-banner">
                <div class="continue-run-info">
                  <div class="continue-run-eyebrow">⚡ CAMPANHA EM ANDAMENTO</div>
                  <div class="continue-run-title">${escapeHtml(savedRun.preview.stageLabel)}</div>
                  <div class="continue-run-meta">${escapeHtml(savedRun.preview.metaLine)}</div>
                </div>
                <div class="continue-run-actions">
                  <button type="button" class="ie-cmd-btn ie-cmd-green continue-run-btn" id="btn-continue-saved-run">
                    <span>▶ Continuar</span>
                  </button>
                  <button type="button" class="continue-discard-btn" id="btn-discard-saved-run" title="Descartar campanha salva" aria-label="Descartar campanha salva">✕</button>
                </div>
              </div>`
            : ""
        }
        <div class="option-group" style="margin-top:0;">
          <label>${ffLogoIconHTML("inline-ui-icon")} 1. Escolha o Modo de Jogo:</label>
          <div class="mode-select-grid">
            <div class="mode-card selected" data-game-mode="relampago">
              <div class="mode-card-head">
                <div class="mode-card-title">
                  ${elemIconHTML("Vento")}
                  <strong>Modo Relâmpago</strong>
                </div>
                <span class="mode-badge is-active">LIBERADO</span>
              </div>
              <span class="mode-card-desc">
                Roleta entre <strong>57 times</strong>, preparação em Inazuma antes de cada jogo, <strong>Futebol Fronteira</strong> e <strong>Mundial (FFI)</strong>!
              </span>
            </div>

            <div class="mode-card is-locked" data-game-mode="historia" aria-disabled="true">
              <div class="mode-card-head">
                <div class="mode-card-title">
                  <span class="mode-title-lock" aria-hidden="true">
                    <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path fill-rule="evenodd" d="M10 2a4 4 0 0 0-4 4v2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1V6a4 4 0 0 0-4-4Zm2 6V6a2 2 0 1 0-4 0v2h4Zm-2 3.25a1.25 1.25 0 0 1 .75 2.25V15a.75.75 0 0 1-1.5 0v-1.5a1.25 1.25 0 0 1 .75-2.25Z" clip-rule="evenodd"/></svg>
                  </span>
                  <strong>Modo História</strong>
                </div>
                <span class="mode-badge is-locked">EM BREVE</span>
              </div>
              <span class="mode-card-desc">
                Faça a história do seu time crescendo a partir do começo — evolua seus jogadores passo a passo até conquistar tudo!
              </span>
            </div>
          </div>
          ${
            state.storyLockNotice
              ? `<div class="mode-locked-toast">🔒 O <strong>Modo História</strong> ainda está em desenvolvimento e chegará em breve! Por enquanto, jogue o <strong>Modo Relâmpago</strong>.</div>`
              : ""
          }
        </div>

        <div class="option-group">
          <label>${captainIconHTML()} 2. Escolha a Dificuldade:</label>
          <div class="difficulty-grid">
            <div class="diff-card ${!state.hideOvrBeforePick ? "selected" : ""}" data-diff="visible">
              <strong>${elemIconHTML("Vento")} Modo Fácil (Com Overall)</strong>
              <span>Mostra o Overall dos jogadores do time sorteado antes de você escolher.</span>
            </div>
            <div class="diff-card ${state.hideOvrBeforePick ? "selected" : ""}" data-diff="hidden">
              <strong>${elemIconHTML("Fogo")} Modo Difícil (Sem Overall)</strong>
              <span>O Overall fica oculto na lista e não é permitido roletar outro time!</span>
            </div>
          </div>
        </div>

        <div class="option-group">
          <label>${formationIconHTML()} 3. Escolha a Formação Tática:</label>
          <div class="formation-pills">
            ${["4-3-3", "4-4-2", "3-4-3", "3-5-2"]
              .map(
                (f) => `
              <div class="form-pill ${state.formation === f ? "selected" : ""}" data-form="${f}">
                ${f}
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <button class="start-big-btn" id="btn-start-game-now">
          COMEÇAR MODO RELÂMPAGO E GIRAR ROLETA!
        </button>
      </div>
    </div>

    <div class="live-tactics-modal-backdrop" id="ranking-modal">
      <div class="live-tactics-modal-card ranking-modal-card">
        <div class="live-tactics-modal-head">
          <div>
            <div style="font-size:0.66rem; font-weight:900; color:#facc15; text-transform:uppercase;">
              Hall da Fama • <span id="ranking-mode-label">${rankCfg.isOnline ? "Ranking Global Online" : "Ranking Local"}</span>
            </div>
            <h4 style="margin:0; font-size:1rem; font-weight:900; color:#fff;">Ranking por Força de Time</h4>
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <button type="button" class="ie-cmd-btn ranking-refresh-btn" id="btn-refresh-ranking" title="Atualizar ranking">
              <span>↻ Atualizar</span>
            </button>
            <button type="button" class="ie-cmd-btn" id="btn-close-ranking-modal" style="padding:5px 12px; font-size:0.74rem; background:#334155;">
              <span>Fechar ✕</span>
            </button>
          </div>
        </div>
        <div class="ranking-filter-bar">
          <div class="ranking-filter-pills">
            <button type="button" class="ranking-filter-pill is-active" data-rank-filter="all">Todos</button>
            <button type="button" class="ranking-filter-pill" data-rank-filter="visible">Fácil</button>
            <button type="button" class="ranking-filter-pill" data-rank-filter="hidden">Difícil</button>
          </div>
          <span class="ranking-count-pill" id="ranking-count-pill">0 times</span>
        </div>
        <div id="ranking-list-body"></div>
      </div>
    </div>
  `;

  container.querySelectorAll("[data-game-mode]").forEach((el) => {
    el.addEventListener("click", () => {
      const mode = el.getAttribute("data-game-mode");
      if (mode === "historia") {
        state.storyLockNotice = true;
        renderStartMenuScreen();
        return;
      }
      state.gameMode = "relampago";
      state.storyLockNotice = false;
      renderStartMenuScreen();
    });
  });

  container.querySelectorAll("[data-diff]").forEach((el) => {
    el.addEventListener("click", () => {
      state.hideOvrBeforePick = el.getAttribute("data-diff") === "hidden";
      renderStartMenuScreen();
    });
  });

  container.querySelectorAll("[data-form]").forEach((el) => {
    el.addEventListener("click", () => {
      state.formation = el.getAttribute("data-form");
      renderStartMenuScreen();
    });
  });

  const continueSavedBtn = document.getElementById("btn-continue-saved-run");
  if (continueSavedBtn) {
    continueSavedBtn.addEventListener("click", () => {
      resumeSavedRunProgress();
    });
  }

  const discardSavedBtn = document.getElementById("btn-discard-saved-run");
  if (discardSavedBtn) {
    discardSavedBtn.addEventListener("click", () => {
      clearActiveRunProgress();
      renderStartMenuScreen();
    });
  }

  document.getElementById("btn-start-game-now").addEventListener("click", () => {
    clearRankingEscListener();
    clearActiveRunProgress();
    clearTournamentTimers(false);
    if (state.spinTimerId) {
      clearTimeout(state.spinTimerId);
      state.spinTimerId = null;
    }
    state.isSpinning = false;
    state.storyLockNotice = false;
    state.phase = "draft";
    state.squad = {};
    state.selectedPlayer = null;
    state.peekField = false;
    state.swapSlotId = null;
    state.rerollsLeft = state.hideOvrBeforePick ? 0 : 3;
    state.usedTeamIds = [];
    state.tournament = createFreshTournamentState();
    spinNextTeam(false);
  });

  const rankingModal = document.getElementById("ranking-modal");
  const openRankingBtn = document.getElementById("btn-open-ranking-modal");
  const closeRankingBtn = document.getElementById("btn-close-ranking-modal");
  const refreshRankingBtn = document.getElementById("btn-refresh-ranking");
  let rankingFilter = "all";
  let cachedRankingEntries = [];
  const expandedRankingIds = new Set();

  const loadAndRenderRankingModal = async () => {
    const bodyEl = document.getElementById("ranking-list-body");
    const modeLbl = document.getElementById("ranking-mode-label");
    const cfg = getRankingConfig();
    if (cfg.isOnline) {
      if (modeLbl) modeLbl.textContent = "Ranking Global Online";
      if (bodyEl) {
        bodyEl.innerHTML = `<div class="ranking-empty-state"><strong>⏳ Carregando Ranking Global...</strong><span>Conectando ao servidor...</span></div>`;
      }
      try {
        cachedRankingEntries = await fetchOnlineRankings();
        renderRankingModalList(cachedRankingEntries, rankingFilter, expandedRankingIds, "");
      } catch {
        if (modeLbl) modeLbl.textContent = "Ranking Local (Fallback Offline)";
        cachedRankingEntries = loadLocalRankings();
        renderRankingModalList(
          cachedRankingEntries,
          rankingFilter,
          expandedRankingIds,
          "Não foi possível conectar ao ranking global; exibindo registros locais."
        );
      }
    } else {
      if (modeLbl) modeLbl.textContent = "Ranking Local";
      cachedRankingEntries = loadLocalRankings();
      renderRankingModalList(cachedRankingEntries, rankingFilter, expandedRankingIds, "");
    }
  };

  const closeRankingModal = () => {
    if (rankingModal) rankingModal.classList.remove("is-open");
    clearRankingEscListener();
  };

  const openRankingModal = () => {
    if (!rankingModal) return;
    rankingModal.classList.add("is-open");
    clearRankingEscListener();
    _activeRankingEscHandler = (ev) => {
      if (ev.key === "Escape") closeRankingModal();
    };
    document.addEventListener("keydown", _activeRankingEscHandler);
    loadAndRenderRankingModal();
  };

  if (openRankingBtn) {
    openRankingBtn.addEventListener("click", openRankingModal);
  }
  if (closeRankingBtn) {
    closeRankingBtn.addEventListener("click", closeRankingModal);
  }
  if (refreshRankingBtn) {
    refreshRankingBtn.addEventListener("click", loadAndRenderRankingModal);
  }
  if (rankingModal) {
    rankingModal.addEventListener("click", (e) => {
      if (e.target === rankingModal) closeRankingModal();
    });
    rankingModal.querySelectorAll("[data-rank-filter]").forEach((pill) => {
      pill.addEventListener("click", () => {
        rankingFilter = pill.getAttribute("data-rank-filter") || "all";
        rankingModal.querySelectorAll("[data-rank-filter]").forEach((p) => {
          p.classList.toggle("is-active", p === pill);
        });
        renderRankingModalList(cachedRankingEntries, rankingFilter, expandedRankingIds, "");
      });
    });
  }
}

// TELA 2: DRAFT (Roleta ou Campo ao Selecionar Personagem)
function renderDraftScreen() {
  const container = document.getElementById("main-screen-container");
  if (!container) return;

  const pickedCount = getPickedCount();
  const openSlots = getOpenSlots();
  const openRoles = new Set(openSlots.map((s) => s.role));

  // Se já escolheu os 11 jogadores -> Mostra Vantagens, Campo com instrução de troca e DAR GO!
  if (pickedCount >= 11) {
    container.innerHTML = `
      <div class="go-ready-actions" style="display:flex; justify-content:center; margin-bottom:10px;">
        <button class="ie-cmd-btn ie-cmd-green" id="btn-start-go" style="padding:14px 34px; font-size:1.05rem; box-shadow: 0 4px 18px rgba(74, 222, 128, 0.45);">
          <span>DAR GO! — PREPARAR MODO RELÂMPAGO</span>
        </button>
      </div>

      ${buildPitchHTML(true)}
    `;

    document.getElementById("btn-start-go").addEventListener("click", () => {
      startTournamentGo();
    });

    container.querySelectorAll("[data-slot]").forEach((el) => {
      el.addEventListener("click", () => handleFieldSlotClick(el.getAttribute("data-slot")));
    });
    return;
  }

  // Se o usuário selecionou um personagem (ou clicou em Ver Campo) -> Abre o Campo!
  if (state.selectedPlayer || state.peekField) {
    const sel = state.selectedPlayer;
    const hasNaturalOpen = sel ? getPlayerPositionsList(sel).some((r) => openRoles.has(r)) : true;

    container.innerHTML = `
      <div class="placing-banner">
        ${
          sel
            ? `<div class="placing-player-info">
                <img src="${sel.sprite}" alt="${sel.name}" />
                <div>
                  <div style="font-size:0.7rem; font-weight:900; color:#4ade80; text-transform:uppercase;">
                    POSICIONANDO NO CAMPO (${pickedCount + 1} DE 11)
                  </div>
                  <div style="font-size:1.02rem; font-weight:900; color:#fff; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                    <span>${sel.name}</span> ${posIconHTML(sel.pos, true)} ${elemIconHTML(sel.element)} <span class="ovr-tag">Nv. ${getPlayerLevel(sel)}</span> <span class="ovr-tag">${state.hideOvrBeforePick ? "OVR ??" : `OVR ${sel.ovr}`}</span>
                  </div>
                  <div style="font-size:0.74rem; color:#dbeafe; margin-top:2px;">
                    ${
                      hasNaturalOpen
                        ? `Toque em uma vaga de <strong>${getPlayerPositionsList(sel).join("/")}</strong> em verde! (Colar elementos iguais acende link próximo!)`
                        : `Vagas de ${getPlayerPositionsList(sel).join("/")} ocupadas! Improvisar reduz <strong>-6 a -14 OVR</strong> apenas no jogador fora de posição.`
                    }
                  </div>
                </div>
              </div>
              <button class="ie-cmd-btn ie-cmd-gold" id="btn-back-to-team">
                <span>← Voltar ao Time</span>
              </button>`
            : `<div class="placing-player-info">
                <div>
                  <div style="font-size:1rem; font-weight:900; color:#facc15; display:flex; align-items:center; gap:6px;">
                    ${formationIconHTML()} <span>Seu Campo Atual (${pickedCount}/11 Escalados)</span>
                  </div>
                  <div style="font-size:0.75rem; color:#dbeafe;">
                    Toque em dois jogadores para inverter posições ou volte para a roleta.
                  </div>
                </div>
              </div>
              <button class="ie-cmd-btn ie-cmd-gold" id="btn-back-to-team">
                <span>⬅️ Voltar à Roleta</span>
              </button>`
        }
      </div>

      ${buildPitchHTML()}
    `;

    document.getElementById("btn-back-to-team").addEventListener("click", () => {
      state.selectedPlayer = null;
      state.peekField = false;
      state.swapSlotId = null;
      renderDraftWheelAndRoster(false);
    });

    container.querySelectorAll("[data-slot]").forEach((el) => {
      el.addEventListener("click", () => handleFieldSlotClick(el.getAttribute("data-slot")));
    });
    return;
  }

  renderDraftWheelAndRoster(false);
}

function pluralPt(n, singular, pluralWord) {
  return `${n} ${n === 1 ? singular : pluralWord}`;
}

function computeTournamentRunSummary(t = state.tournament) {
  if (!t || !Array.isArray(t.stages)) return null;
  const finishedStages = t.stages.filter((s, idx) => idx <= t.stageIndex && s.finished);
  const currentStage = t.stages[t.stageIndex];
  const isFFChampion = Boolean(t.stages[3]?.finished && t.stages[3]?.won);
  const isWorldChampion = Boolean(
    t.worldUnlocked &&
    currentStage &&
    currentStage.finished &&
    currentStage.won &&
    t.stageIndex === t.stages.length - 1
  );
  const isChampion = isWorldChampion || (isFFChampion && !t.worldUnlocked);

  const playerTotals = {};
  getSlots().forEach((slot) => {
    const p = state.squad[slot.id];
    if (!p) return;
    const uid = `u_${slot.id}`;
    const pKey = String(p.id || uid);
    playerTotals[pKey] = {
      uid,
      slotId: slot.id,
      role: slot.role,
      id: p.id,
      name: p.name,
      fullName: p.fullName || p.name,
      sprite: getPlayerFormSprite(p, slot.role),
      element: p.element,
      teamEmblem: p.teamEmblem,
      teamName: p.teamName,
      ovr: getEffectiveOvr(p, slot.role),
      matches: 0,
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

  let goalsFor = 0;
  let goalsAgainst = 0;
  let passesOk = 0;
  let passesTry = 0;
  let gkReleases = 0;
  let dribblesOk = 0;
  let dribblesTry = 0;
  let steals = 0;
  let blocks = 0;
  let saves = 0;
  let shots = 0;
  let oppShots = 0;
  let userTicksSum = 0;
  let totalTicksSum = 0;
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let cleanSheets = 0;

  const matchResults = [];

  finishedStages.forEach((s) => {
    goalsFor += s.userScore || 0;
    goalsAgainst += s.oppScore || 0;
    if ((s.oppScore || 0) === 0) cleanSheets++;
    if (s.won) wins++;
    else if (s.isDraw) draws++;
    else losses++;

    const ps = s.pitch?.stats;
    if (ps) {
      passesOk += ps.userPassesOk || 0;
      passesTry += ps.userPassesTry || 0;
      gkReleases += ps.userGkReleases || 0;
      dribblesOk += ps.userDribblesOk || 0;
      dribblesTry += ps.userDribblesTry || 0;
      steals += ps.userSteals || 0;
      blocks += ps.userBlocks || 0;
      saves += ps.userSaves || 0;
      shots += ps.userShots || 0;
      oppShots += ps.oppShots || 0;
      userTicksSum += ps.userTicks || 0;
      totalTicksSum += (ps.userTicks || 0) + (ps.oppTicks || 0);

      if (ps.playerStats) {
        Object.keys(ps.playerStats).forEach((uid) => {
          const mp = ps.playerStats[uid];
          const pKey = String(mp.id || uid);
          if (!playerTotals[pKey]) {
            playerTotals[pKey] = { ...mp, matches: 1 };
          } else {
            const target = playerTotals[pKey];
            target.matches = (target.matches || 0) + 1;
            target.goals += mp.goals || 0;
            target.assists += mp.assists || 0;
            target.passesOk += mp.passesOk || 0;
            target.passesTry += mp.passesTry || 0;
            target.gkReleases += mp.gkReleases || 0;
            target.dribblesOk += mp.dribblesOk || 0;
            target.dribblesTry += mp.dribblesTry || 0;
            target.steals += mp.steals || 0;
            target.blocks += mp.blocks || 0;
            target.shots += mp.shots || 0;
            target.saves += mp.saves || 0;
          }
        });
      }
    }

    matchResults.push({
      stageName: s.stageName,
      oppName: s.oppTeam?.name || "Adversário",
      oppEmblem: s.oppTeam?.emblem || "",
      userScore: s.userScore || 0,
      oppScore: s.oppScore || 0,
      won: Boolean(s.won),
      penaltiesText: s.penaltiesText || null
    });
  });

  // Formato de MVP equilibrado: foco em impacto decisivo (Gols, Assistências, Roubos/Bloqueios, Dribles e Defesas com Clean Sheet; Passe com peso baixo de desempate)
  const playersList = Object.values(playerTotals).map((p) => {
    const cleanTackles = Math.max(0, (p.steals || 0) - (p.blocks || 0));
    const outfieldPassPts = (p.passesOk || 0) * 0.12;
    const gkPts =
      p.role === "GK"
        ? (p.saves || 0) * 1.4 + cleanSheets * 4.0 - goalsAgainst * 0.35
        : (p.saves || 0) * 1.4;
    const rawScore =
      (p.goals || 0) * 6.0 +
      (p.assists || 0) * 4.5 +
      (p.blocks || 0) * 3.0 +
      cleanTackles * 1.7 +
      (p.dribblesOk || 0) * 1.3 +
      outfieldPassPts +
      gkPts;
    const mvpScore = +Math.max(0, rawScore).toFixed(1);
    const passAcc = p.passesTry > 0 ? Math.round((p.passesOk / p.passesTry) * 100) : 0;
    const dribbleAcc = p.dribblesTry > 0 ? Math.round((p.dribblesOk / p.dribblesTry) * 100) : 0;
    return { ...p, mvpScore, passAcc, dribbleAcc };
  });

  const pickLeader = (list, sortFn) => {
    if (!list.length) return null;
    return list.slice().sort(sortFn)[0];
  };

  const outfieldPool = playersList.filter((p) => p.role !== "GK");
  const passerPool = outfieldPool.length ? outfieldPool : playersList;

  const topScorer = pickLeader(
    playersList,
    (a, b) => b.goals - a.goals || b.assists - a.assists || b.shots - a.shots || b.ovr - a.ovr
  );
  const topAssister = pickLeader(
    passerPool,
    (a, b) => b.assists - a.assists || b.passesOk - a.passesOk || b.goals - a.goals || b.ovr - a.ovr
  );
  const topPasser = pickLeader(
    passerPool,
    (a, b) => b.passesOk - a.passesOk || b.passAcc - a.passAcc || b.ovr - a.ovr
  );
  const topDribbler = pickLeader(
    passerPool,
    (a, b) => b.dribblesOk - a.dribblesOk || b.dribblesTry - a.dribblesTry || b.ovr - a.ovr
  );
  const topStealer = pickLeader(
    passerPool,
    (a, b) => b.steals - a.steals || b.blocks - a.blocks || b.ovr - a.ovr
  );
  const keepersPool = playersList.filter((p) => p.role === "GK" || p.saves > 0);
  const topKeeper = pickLeader(
    keepersPool.length ? keepersPool : playersList,
    (a, b) => b.saves - a.saves || (b.role === "GK" ? 1 : 0) - (a.role === "GK" ? 1 : 0) || b.ovr - a.ovr
  );
  const mvp = pickLeader(
    playersList,
    (a, b) => b.mvpScore - a.mvpScore || b.goals - a.goals || b.assists - a.assists || b.ovr - a.ovr
  );

  const rosterSorted = playersList
    .slice()
    .sort((a, b) => b.mvpScore - a.mvpScore || b.goals - a.goals || b.assists - a.assists || b.passesOk - a.passesOk);

  const elimInGroup = Boolean(
    !isChampion &&
    currentStage?.isGroupStage &&
    currentStage.groupRoundIdx === 2 &&
    getUserGroupRank(t.worldGroup) > 2
  );
  const groupRank = t.worldGroup ? getUserGroupRank(t.worldGroup) : 0;

  return {
    isChampion,
    isFFChampion,
    isWorldChampion,
    elimInGroup,
    groupRank,
    worldUnlocked: Boolean(t.worldUnlocked),
    stageName: currentStage?.stageName || "Torneio",
    eliminatedBy: elimInGroup
      ? `Grupo A (${groupRank}º lugar)`
      : !isChampion && currentStage && !currentStage.won
      ? currentStage.oppTeam?.name || ""
      : "",
    matchesPlayed: finishedStages.length,
    wins,
    draws,
    losses,
    cleanSheets,
    goalsFor,
    goalsAgainst,
    goalDiff: goalsFor - goalsAgainst,
    passesOk,
    passesTry,
    gkReleases,
    passAccuracyPct: passesTry > 0 ? Math.round((passesOk / passesTry) * 100) : 0,
    dribblesOk,
    dribblesTry,
    dribbleAccuracyPct: dribblesTry > 0 ? Math.round((dribblesOk / dribblesTry) * 100) : 0,
    steals,
    blocks,
    saves,
    shots,
    oppShots,
    avgPossessionPct: totalTicksSum > 0 ? Math.round((userTicksSum / totalTicksSum) * 100) : 50,
    topScorer,
    topAssister,
    topPasser,
    topDribbler,
    topStealer,
    topKeeper,
    mvp,
    rosterSorted,
    matchResults,
    allStages: t.stages
  };
}

let _playerLookupIndexCache = null;

function getRankingConfig() {
  const raw = window.INAZUMA_RANKING_CONFIG || {};
  const supabaseUrl = String(raw.supabaseUrl || "").trim().replace(/\/+$/, "");
  const supabaseAnonKey = String(raw.supabaseAnonKey || "").trim();
  const maxEntries = Math.max(10, Math.min(100, Number(raw.maxEntries) || 50));
  return {
    supabaseUrl,
    supabaseAnonKey,
    maxEntries,
    isOnline: Boolean(supabaseUrl && supabaseAnonKey)
  };
}

function buildPlayerLookupIndex() {
  if (_playerLookupIndexCache) return _playerLookupIndexCache;
  const byId = new Map();
  const byName = new Map();
  (DB.teams || []).forEach((team) => {
    (team.players || []).forEach((pl) => {
      if (pl.id != null) byId.set(String(pl.id), pl);
      const nm = String(pl.name || "").trim().toLowerCase();
      if (nm && !byName.has(nm)) byName.set(nm, pl);
      const fnm = String(pl.fullName || "").trim().toLowerCase();
      if (fnm && !byName.has(fnm)) byName.set(fnm, pl);
    });
  });
  _playerLookupIndexCache = { byId, byName };
  return _playerLookupIndexCache;
}

function resolveRankingPlayerSprite(entryPlayer) {
  if (!entryPlayer) return "";
  const idx = buildPlayerLookupIndex();
  let found = entryPlayer.id != null ? idx.byId.get(String(entryPlayer.id)) : null;
  if (!found && entryPlayer.name) {
    found = idx.byName.get(String(entryPlayer.name).trim().toLowerCase()) || null;
  }
  if (!found) return "";
  const role = VALID_RANKING_ROLES.has(entryPlayer.role) ? entryPlayer.role : found.pos;
  return getPlayerFormSprite(found, role) || found.sprite || "";
}

function buildCompactRankingRoster() {
  const slots = getSlots();
  const roleOrder = { FW: 0, MF: 1, DF: 2, GK: 3 };
  const items = [];
  slots.forEach((slot) => {
    const p = state.squad[slot.id];
    if (!p) return;
    const lvl = getPlayerLevel(p);
    const effOvr = getEffectiveOvr(p, slot.role);
    const pwr = calcIndividualPlayerPower(p, slot.role, lvl);
    items.push({
      id: p.id != null ? String(p.id) : "",
      name: String(p.name || "Jogador"),
      role: slot.role,
      slotLabel: String(slot.label || slot.role),
      level: lvl,
      ovr: effOvr,
      power: Math.round(pwr),
      element: VALID_RANKING_ELEMENTS.has(p.element) ? p.element : "",
      isImprovised: !playerMatchesRole(p, slot.role)
    });
  });
  return items.sort((a, b) => {
    const ra = roleOrder[a.role] ?? 9;
    const rb = roleOrder[b.role] ?? 9;
    if (ra !== rb) return ra - rb;
    return b.power - a.power;
  });
}

function compareRankingEntries(a, b) {
  return (
    (b.power || 0) - (a.power || 0) ||
    (b.wins || 0) - (a.wins || 0) ||
    (b.avgLevel || 0) - (a.avgLevel || 0) ||
    String(a.createdAt || "").localeCompare(String(b.createdAt || ""))
  );
}

function normalizeRankingEntry(raw) {
  if (!raw || typeof raw !== "object") return null;
  const runId = String(raw.runId || raw.run_id || "").trim();
  if (!runId) return null;
  const rosterRaw = Array.isArray(raw.roster)
    ? raw.roster
    : Array.isArray(raw.roster_json)
    ? raw.roster_json
    : [];
  return {
    runId,
    teamName: sanitizeTeamName(raw.teamName || raw.team_name),
    power: Math.round(Number(raw.power) || 0),
    avgLevel: Number((Number(raw.avgLevel != null ? raw.avgLevel : raw.avg_level) || 1).toFixed(1)),
    ovr: Math.round(Number(raw.ovr) || 0),
    chem: Math.round(Number(raw.chem) || 0),
    wins: Math.max(0, Math.round(Number(raw.wins) || 0)),
    draws: Math.max(0, Math.round(Number(raw.draws) || 0)),
    losses: Math.max(0, Math.round(Number(raw.losses) || 0)),
    matchesPlayed: Math.max(0, Math.round(Number(raw.matchesPlayed != null ? raw.matchesPlayed : raw.matches_played) || 0)),
    stageName: String(raw.stageName != null ? raw.stageName : raw.stage_name || ""),
    isChampion: Boolean(raw.isChampion != null ? raw.isChampion : raw.is_champion),
    isWorldChampion: Boolean(raw.isWorldChampion != null ? raw.isWorldChampion : raw.is_world_champion),
    difficulty: raw.difficulty === "hidden" ? "hidden" : "visible",
    formation: ["4-3-3", "4-4-2", "3-4-3", "3-5-2"].includes(raw.formation) ? raw.formation : "4-3-3",
    roster: rosterRaw.slice(0, 11).map((pl) => ({
      id: pl?.id != null ? String(pl.id) : "",
      name: String(pl?.name || "Jogador"),
      role: VALID_RANKING_ROLES.has(pl?.role) ? pl.role : "MF",
      slotLabel: String(pl?.slotLabel || pl?.role || ""),
      level: Math.max(1, Math.round(Number(pl?.level) || 1)),
      ovr: Math.round(Number(pl?.ovr) || 75),
      power: Math.round(Number(pl?.power) || 0),
      element: VALID_RANKING_ELEMENTS.has(pl?.element) ? pl.element : "",
      isImprovised: Boolean(pl?.isImprovised)
    })),
    createdAt: String(raw.createdAt || raw.created_at || new Date().toISOString())
  };
}

function loadLocalRankings() {
  try {
    const raw = window.localStorage?.getItem(RANKING_LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeRankingEntry).filter(Boolean).sort(compareRankingEntries);
  } catch {
    return [];
  }
}

function saveLocalRankings(list) {
  try {
    const { maxEntries } = getRankingConfig();
    const sorted = (Array.isArray(list) ? list : [])
      .map(normalizeRankingEntry)
      .filter(Boolean)
      .sort(compareRankingEntries)
      .slice(0, maxEntries);
    window.localStorage?.setItem(RANKING_LOCAL_KEY, JSON.stringify(sorted));
    return sorted;
  } catch {
    return [];
  }
}

function upsertLocalRankingEntry(entry) {
  const clean = normalizeRankingEntry(entry);
  if (!clean) return [];
  const current = loadLocalRankings().filter((item) => item.runId !== clean.runId);
  current.push(clean);
  return saveLocalRankings(current);
}

function renameLocalRankingEntry(runId, newName) {
  if (!runId) return false;
  const cleanName = sanitizeTeamName(newName);
  const list = loadLocalRankings();
  let updated = false;
  const next = list.map((item) => {
    if (item.runId === runId) {
      updated = true;
      return { ...item, teamName: cleanName };
    }
    return item;
  });
  if (updated) saveLocalRankings(next);
  return updated;
}

function findTeamById(teamId) {
  if (teamId == null) return null;
  const key = String(teamId);
  return (DB.teams || []).find((t) => String(t.id) === key) || null;
}

function findPrepEventById(eventId) {
  if (!eventId) return null;
  const locs = getPrepLocationsCatalog();
  for (const loc of locs) {
    const found = (loc.events || []).find((ev) => ev.id === eventId);
    if (found) return found;
  }
  return null;
}

function serializeSquadForSave(squadObj) {
  const out = {};
  Object.entries(squadObj || {}).forEach(([slotId, p]) => {
    if (!p || p.id == null) return;
    out[slotId] = {
      id: String(p.id),
      teamId: p.teamId ?? null,
      level: getPlayerLevel(p),
      xp: p.xp || 0,
      bonusStats: p.bonusStats ? { ...p.bonusStats } : { for: 0, tec: 0, def: 0, vel: 0, fis: 0 },
      bonusPower: p.bonusPower || 0,
      bonusSpd: p.bonusSpd || 0,
      equippedItems: Array.isArray(p.equippedItems)
        ? p.equippedItems.map((it) => ({ id: it.id, title: it.title }))
        : [],
      keshin: p.keshin ? { name: p.keshin.name, iconKey: p.keshin.iconKey } : null,
      moveEvoCount: p.moveEvoCount || 0,
      learnedSecretManual: Boolean(p.learnedSecretManual),
      learnedLvlMilestones: Array.isArray(p.learnedLvlMilestones) ? [...p.learnedLvlMilestones] : [],
      moves: p.moves ? JSON.parse(JSON.stringify(p.moves)) : null,
      hissatsu: p.hissatsu || "",
      _baseMovesSnapshot: p._baseMovesSnapshot ? JSON.parse(JSON.stringify(p._baseMovesSnapshot)) : null,
      _baseHissatsuSnapshot: p._baseHissatsuSnapshot !== undefined ? p._baseHissatsuSnapshot : null
    };
  });
  return out;
}

function deserializeSquadFromSave(rawSquad) {
  const out = {};
  const idx = buildPlayerLookupIndex();
  Object.entries(rawSquad || {}).forEach(([slotId, rawP]) => {
    if (!rawP || rawP.id == null) return;
    const baseP = idx.byId.get(String(rawP.id));
    if (!baseP) return;
    const baseT = findTeamById(rawP.teamId) || findTeamById(baseP.teamId);
    const p = cloneFreshPlayerForSquad(baseP, baseT, Math.max(1, Number(rawP.level) || 1));
    if (!p) return;
    p.xp = Number(rawP.xp) || 0;
    p.bonusStats = {
      for: Number(rawP.bonusStats?.for) || 0,
      tec: Number(rawP.bonusStats?.tec) || 0,
      def: Number(rawP.bonusStats?.def) || 0,
      vel: Number(rawP.bonusStats?.vel) || 0,
      fis: Number(rawP.bonusStats?.fis) || 0
    };
    p.bonusPower = Number(rawP.bonusPower) || 0;
    p.bonusSpd = Number(rawP.bonusSpd) || 0;
    p.equippedItems = Array.isArray(rawP.equippedItems)
      ? rawP.equippedItems.map((it) => ({ id: it.id, title: it.title }))
      : [];
    p.keshin = rawP.keshin
      ? {
          name: rawP.keshin.name,
          iconKey: rawP.keshin.iconKey || null,
          icon: (rawP.keshin.iconKey && UI[rawP.keshin.iconKey]) || UI.keshinIcon
        }
      : null;
    p.moveEvoCount = Number(rawP.moveEvoCount) || 0;
    p.learnedSecretManual = Boolean(rawP.learnedSecretManual);
    p.learnedLvlMilestones = Array.isArray(rawP.learnedLvlMilestones) ? [...rawP.learnedLvlMilestones] : [];
    if (rawP.moves && typeof rawP.moves === "object") {
      p.moves = JSON.parse(JSON.stringify(rawP.moves));
    }
    if (typeof rawP.hissatsu === "string" && rawP.hissatsu) {
      p.hissatsu = rawP.hissatsu;
    }
    if (rawP._baseMovesSnapshot) {
      p._baseMovesSnapshot = JSON.parse(JSON.stringify(rawP._baseMovesSnapshot));
    }
    if (rawP._baseHissatsuSnapshot !== null && rawP._baseHissatsuSnapshot !== undefined) {
      p._baseHissatsuSnapshot = rawP._baseHissatsuSnapshot;
    }
    out[slotId] = p;
  });
  return out;
}

function compactPitchStatsForSave(ps) {
  if (!ps || typeof ps !== "object") return null;
  const compactPlayers = {};
  if (ps.playerStats && typeof ps.playerStats === "object") {
    Object.entries(ps.playerStats).forEach(([uid, st]) => {
      if (!st) return;
      compactPlayers[uid] = {
        uid: st.uid || uid,
        slotId: st.slotId || "",
        role: st.role || "MF",
        id: st.id != null ? String(st.id) : "",
        name: st.name || "",
        fullName: st.fullName || st.name || "",
        element: st.element || "",
        teamId: st.teamId ?? null,
        teamName: st.teamName || "",
        ovr: Number(st.ovr) || 75,
        goals: Number(st.goals) || 0,
        assists: Number(st.assists) || 0,
        passesOk: Number(st.passesOk) || 0,
        passesTry: Number(st.passesTry) || 0,
        gkReleases: Number(st.gkReleases) || 0,
        dribblesOk: Number(st.dribblesOk) || 0,
        dribblesTry: Number(st.dribblesTry) || 0,
        steals: Number(st.steals) || 0,
        blocks: Number(st.blocks) || 0,
        shots: Number(st.shots) || 0,
        saves: Number(st.saves) || 0
      };
    });
  }
  return {
    userTicks: Number(ps.userTicks) || 0,
    oppTicks: Number(ps.oppTicks) || 0,
    userShots: Number(ps.userShots) || 0,
    oppShots: Number(ps.oppShots) || 0,
    userPassesOk: Number(ps.userPassesOk) || 0,
    userPassesTry: Number(ps.userPassesTry) || 0,
    userGkReleases: Number(ps.userGkReleases) || 0,
    userDribblesOk: Number(ps.userDribblesOk) || 0,
    userDribblesTry: Number(ps.userDribblesTry) || 0,
    userSteals: Number(ps.userSteals) || 0,
    userBlocks: Number(ps.userBlocks) || 0,
    userSaves: Number(ps.userSaves) || 0,
    playerStats: compactPlayers
  };
}

function rehydratePitchStatsFromSave(rawStats) {
  if (!rawStats || typeof rawStats !== "object") return null;
  const playerStats = {};
  if (rawStats.playerStats && typeof rawStats.playerStats === "object") {
    Object.entries(rawStats.playerStats).forEach(([uid, st]) => {
      if (!st) return;
      const tm = findTeamById(st.teamId);
      playerStats[uid] = {
        ...st,
        sprite: resolveRankingPlayerSprite({ id: st.id, name: st.name, role: st.role }),
        teamEmblem: tm?.emblem || ""
      };
    });
  }
  return { ...rawStats, playerStats };
}

function serializeWorldGroupForSave(wg) {
  if (!wg || typeof wg !== "object") return null;
  return {
    groupName: wg.groupName || "Grupo A",
    opponentIds: (wg.opponents || []).map((o) => o?.id).filter((id) => id != null),
    otherPairs: wg.otherPairs || [[1, 2], [0, 2], [0, 1]],
    standings: (wg.standings || []).map(({ emblem, ...rest }) => rest),
    lastOtherResult: wg.lastOtherResult || ""
  };
}

function deserializeWorldGroupFromSave(rawWg) {
  if (!rawWg || typeof rawWg !== "object") return null;
  return {
    groupName: rawWg.groupName || "Grupo A",
    opponents: (rawWg.opponentIds || []).map(findTeamById).filter(Boolean),
    otherPairs: rawWg.otherPairs || [[1, 2], [0, 2], [0, 1]],
    standings: (rawWg.standings || []).map((row) => ({
      ...row,
      emblem: row.isUser ? (UI.raimonEmblem || "") : (findTeamById(row.id)?.emblem || "")
    })),
    lastOtherResult: rawWg.lastOtherResult || ""
  };
}

function serializeBracketForSave(br) {
  if (!br || typeof br !== "object" || !Array.isArray(br.rounds)) return null;
  const slimEntry = (e) => {
    if (!e || typeof e !== "object") return null;
    const { emblem, ...rest } = e;
    return rest;
  };
  return {
    comp: br.comp || "FF",
    title: br.title || "Chaveamento",
    champion: slimEntry(br.champion),
    rounds: br.rounds.map((round) =>
      (round || []).map((m) => ({
        id: m.id,
        a: slimEntry(m.a),
        b: slimEntry(m.b),
        scoreA: m.scoreA ?? null,
        scoreB: m.scoreB ?? null,
        penText: m.penText || null,
        played: Boolean(m.played),
        winner: slimEntry(m.winner)
      }))
    )
  };
}

function deserializeBracketFromSave(rawBr) {
  if (!rawBr || typeof rawBr !== "object" || !Array.isArray(rawBr.rounds)) return null;
  const hydrateEntry = (e) => {
    if (!e || typeof e !== "object") return null;
    return {
      ...e,
      emblem: e.isUser ? (UI.raimonEmblem || "") : (findTeamById(e.id)?.emblem || "")
    };
  };
  return {
    comp: rawBr.comp || "FF",
    title: rawBr.title || "Chaveamento",
    champion: hydrateEntry(rawBr.champion),
    rounds: rawBr.rounds.map((round) =>
      (round || []).map((m) => ({
        ...m,
        a: hydrateEntry(m.a),
        b: hydrateEntry(m.b),
        winner: hydrateEntry(m.winner)
      }))
    )
  };
}

function serializePrepForSave(prep) {
  if (!prep || typeof prep !== "object") return null;
  return {
    nextStageIdx: prep.nextStageIdx || 0,
    phase: prep.phase || "CHOOSE_LOC",
    locId: prep.locId || null,
    eventsTotal: prep.eventsTotal || 3,
    eventsRemaining: prep.eventsRemaining ?? 3,
    restUsedThisRound: Boolean(prep.restUsedThisRound),
    lastActionWasFreeRest: Boolean(prep.lastActionWasFreeRest),
    autoRestMsg: prep.autoRestMsg || null,
    usedEventIdsThisRound: Array.isArray(prep.usedEventIdsThisRound) ? [...prep.usedEventIdsThisRound] : [],
    appliedMsg: prep.appliedMsg || null,
    choiceIds: Array.isArray(prep.choices) ? prep.choices.map((c) => c?.id).filter(Boolean) : [],
    eventId: prep.event?.id || null,
    affectedPlayers: Array.isArray(prep.affectedPlayers)
      ? prep.affectedPlayers.map(({ sprite, ...rest }) => rest)
      : [],
    recruitCandidate: prep.recruitCandidate
      ? {
          playerId: prep.recruitCandidate.player?.id != null ? String(prep.recruitCandidate.player.id) : null,
          teamId: prep.recruitCandidate.teamId ?? prep.recruitCandidate.team?.id ?? prep.recruitCandidate.player?.teamId ?? null,
          role: prep.recruitCandidate.role || prep.recruitCandidate.player?.pos || "MF"
        }
      : null
  };
}

function deserializePrepFromSave(rawPrep, t) {
  if (!rawPrep || typeof rawPrep !== "object") return null;
  const choices = (rawPrep.choiceIds || []).map(findPrepEventById).filter(Boolean);
  const event = findPrepEventById(rawPrep.eventId);
  const affectedPlayers = (rawPrep.affectedPlayers || []).map((ap) => ({
    ...ap,
    sprite: resolveRankingPlayerSprite({ name: ap.name, role: ap.role })
  }));
  const prep = {
    nextStageIdx: Number(rawPrep.nextStageIdx) || 0,
    phase: rawPrep.phase || "CHOOSE_LOC",
    locId: rawPrep.locId || null,
    event: event || null,
    choices,
    isSpinningSlots: false,
    slotsSpun: [true, true, true],
    eventsTotal: Number(rawPrep.eventsTotal) || (t?.prepBonuses?.permanentDoublePrep ? 4 : 3),
    eventsRemaining: typeof rawPrep.eventsRemaining === "number" ? rawPrep.eventsRemaining : 3,
    restUsedThisRound: Boolean(rawPrep.restUsedThisRound),
    lastActionWasFreeRest: Boolean(rawPrep.lastActionWasFreeRest),
    autoRestMsg: rawPrep.autoRestMsg || null,
    usedEventIdsThisRound: Array.isArray(rawPrep.usedEventIdsThisRound) ? [...rawPrep.usedEventIdsThisRound] : [],
    appliedMsg: rawPrep.appliedMsg || null,
    affectedPlayers,
    clash5v5: null,
    recruitCandidate: null,
    riskTargetSlotId: null
  };

  const isBrokenResult = prep.phase === "RESULT" && (!prep.event || prep.event.kind === "STREET_5V5");
  if (prep.phase === "CLASH_5V5" || prep.phase === "SPINNING" || prep.phase === "SPINNING_CHOICES" || isBrokenResult) {
    const loc = getPrepLocationsCatalog().find((x) => x.id === (prep.locId || "riverbank"));
    if (loc && !loc.isRestLocation) {
      adjustTeamEnergy(getPrepLocationCost(loc, t));
    }
    prep.phase = "CHOOSE_LOC";
    prep.locId = null;
    prep.event = null;
    prep.choices = [];
  } else if (prep.phase === "PICK_CHOICE" && prep.choices.length === 0) {
    prep.phase = "CHOOSE_LOC";
    prep.locId = null;
    prep.event = null;
  } else if (prep.phase === "PICK_PLAYER" && !prep.event) {
    prep.phase = "CHOOSE_LOC";
    prep.locId = null;
  } else if (prep.phase === "RECRUIT_OFFER") {
    const rc = rawPrep.recruitCandidate;
    const baseP = rc?.playerId ? buildPlayerLookupIndex().byId.get(String(rc.playerId)) : null;
    const team = findTeamById(rc?.teamId) || findTeamById(baseP?.teamId);
    if (baseP) {
      prep.recruitCandidate = {
        player: baseP,
        team,
        teamId: team?.id ?? rc?.teamId ?? baseP.teamId,
        teamName: team?.name || baseP.teamName || "Time Rival",
        emblem: team?.emblem || "",
        role: rc?.role || baseP.pos || "MF"
      };
    } else {
      prep.phase = "DONE";
      prep.recruitCandidate = null;
    }
  }
  return prep;
}

function clearActiveRunProgress() {
  try {
    window.localStorage?.removeItem(ACTIVE_RUN_SAVE_KEY);
  } catch {
    // ignora erro de armazenamento privado
  }
}

function saveActiveRunProgress() {
  try {
    if (state.phase === "menu") return;
    if (state.phase === "draft") {
      const pickedCount = getPickedCount();
      if (pickedCount === 0 && !state.currentTeam) return;
      const stats = calcSquadStats();
      const diffLabel = state.hideOvrBeforePick ? "Difícil" : "Fácil";
      const payload = {
        v: 1,
        savedAt: new Date().toISOString(),
        phase: "draft",
        formation: state.formation || "4-3-3",
        hideOvrBeforePick: Boolean(state.hideOvrBeforePick),
        simSpeed: state.simSpeed || 1,
        rerollsLeft: state.rerollsLeft ?? 0,
        usedTeamIds: Array.isArray(state.usedTeamIds) ? [...state.usedTeamIds] : [],
        currentTeamId: state.currentTeam?.id ?? null,
        squad: serializeSquadForSave(state.squad),
        preview: {
          phase: "draft",
          pickedCount,
          stageLabel: pickedCount >= 11 ? "Draft 11/11 Pronto" : `Draft (${pickedCount}/11 Escalados)`,
          metaLine: `${state.formation} • Modo ${diffLabel} • Poder ${Math.round(stats.power || 0).toLocaleString("pt-BR")}`
        }
      };
      window.localStorage?.setItem(ACTIVE_RUN_SAVE_KEY, JSON.stringify(payload));
      return;
    }

    if (state.phase === "tournament" && state.tournament) {
      const t = state.tournament;
      if (isPermanentRunEnd(t)) {
        clearActiveRunProgress();
        return;
      }
      const curSt = t.stages?.[t.stageIndex];
      const isLiveMidMatch = Boolean(!t.prep && curSt && !curSt.finished);
      const safeEnergy =
        isLiveMidMatch && typeof t.preMatchTeamEnergy === "number"
          ? t.preMatchTeamEnergy
          : getTeamEnergy();
      const stats = calcSquadStats();
      const focusStage = t.prep ? t.stages?.[t.prep.nextStageIdx] || curSt : curSt;
      const stageTitle = focusStage?.stageName || "Torneio";
      const stageLabel = t.prep
        ? `Preparação · ${stageTitle}`
        : curSt?.finished
        ? `Pós-Jogo · ${stageTitle}`
        : `Partida · ${stageTitle}`;
      const metaLine = `Poder ${Math.round(stats.power || 0).toLocaleString("pt-BR")} • Nv. ${stats.avgLevel || 1} • Energia ${Math.round(safeEnergy)}% • ${state.formation}`;

      const compactStages = (t.stages || []).map((s) => ({
        stageName: s.stageName,
        oppTeamId: s.oppTeam?.id ?? null,
        competition: s.competition || "FF",
        ovrBoost: s.ovrBoost || 0,
        oppBuffPct: s.oppBuffPct || 0,
        oppLevel: s.oppLevel || 1,
        isGroupStage: Boolean(s.isGroupStage),
        groupRoundIdx: s.groupRoundIdx ?? -1,
        minute: s.finished ? s.minute : 0,
        maxMinute: s.finished ? s.maxMinute : 90,
        userScore: s.finished ? s.userScore || 0 : 0,
        oppScore: s.finished ? s.oppScore || 0 : 0,
        goalsUser: s.finished ? (s.goalsUser || []).map(({ sprite, ...g }) => g) : [],
        goalsOpp: s.finished ? (s.goalsOpp || []).map(({ sprite, ...g }) => g) : [],
        narration: s.finished
          ? (s.narration || []).slice(0, 25).map((item) => ({
              cls: item.cls || "",
              iconCat: item.iconCat || "FF",
              text: item.text || ""
            }))
          : [],
        finished: Boolean(s.finished),
        won: s.finished ? s.won : null,
        isDraw: s.finished ? Boolean(s.isDraw) : false,
        penaltiesText: s.finished ? s.penaltiesText || null : null,
        _groupRecorded: Boolean(s._groupRecorded),
        _bracketRecorded: Boolean(s._bracketRecorded),
        _groupSnapshotBefore: s._groupSnapshotBefore ? serializeWorldGroupForSave(s._groupSnapshotBefore) : null,
        stats: s.finished ? compactPitchStatsForSave(s.pitch?.stats) : null
      }));

      const payload = {
        v: 1,
        savedAt: new Date().toISOString(),
        phase: "tournament",
        formation: state.formation || "4-3-3",
        hideOvrBeforePick: Boolean(state.hideOvrBeforePick),
        simSpeed: state.simSpeed || 1,
        usedTeamIds: Array.isArray(state.usedTeamIds) ? [...state.usedTeamIds] : [],
        squad: serializeSquadForSave(state.squad),
        tournament: {
          runId: t.runId,
          runEditToken: t.runEditToken,
          rankingSavedSignature: t.rankingSavedSignature || null,
          rankingStatus: t.rankingStatus || null,
          rankingTeamName: t.rankingTeamName || "Dream Team",
          stageIndex: t.stageIndex || 0,
          worldUnlocked: Boolean(t.worldUnlocked),
          worldGroup: serializeWorldGroupForSave(t.worldGroup),
          ffBracket: serializeBracketForSave(t.ffBracket),
          worldBracket: serializeBracketForSave(t.worldBracket),
          teamEnergy: safeEnergy,
          preMatchTeamEnergy: safeEnergy,
          nextMatchEnergyMul: typeof t.nextMatchEnergyMul === "number" ? t.nextMatchEnergyMul : 1,
          tactics: { ...(t.tactics || { lane: "balanced", posture: "balanced", intensity: "medium" }) },
          prepBonuses: {
            ...(t.prepBonuses || createFreshPrepBonuses()),
            log: Array.isArray(t.prepBonuses?.log) ? [...t.prepBonuses.log] : []
          },
          prep: serializePrepForSave(t.prep),
          showRunSummary: Boolean(t.showRunSummary),
          stages: compactStages
        },
        preview: {
          phase: "tournament",
          stageLabel,
          metaLine
        }
      };
      window.localStorage?.setItem(ACTIVE_RUN_SAVE_KEY, JSON.stringify(payload));
    }
  } catch {
    // ignora erro de armazenamento privado/quota
  }
}

function loadActiveRunPreview() {
  try {
    const raw = window.localStorage?.getItem(ACTIVE_RUN_SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.v !== 1 || (parsed.phase !== "draft" && parsed.phase !== "tournament") || !parsed.preview) {
      return null;
    }
    return {
      preview: parsed.preview,
      savedAt: parsed.savedAt || "",
      raw: parsed
    };
  } catch {
    return null;
  }
}

function resumeSavedRunProgress() {
  const loaded = loadActiveRunPreview();
  if (!loaded || !loaded.raw) {
    clearActiveRunProgress();
    renderStartMenuScreen();
    return;
  }
  const save = loaded.raw;
  clearRankingEscListener();
  clearTournamentTimers(false);
  if (state.spinTimerId) {
    clearTimeout(state.spinTimerId);
    state.spinTimerId = null;
  }
  state.isSpinning = false;
  state.storyLockNotice = false;
  state.selectedPlayer = null;
  state.peekField = false;
  state.swapSlotId = null;

  state.formation = DB.formations?.[save.formation] ? save.formation : "4-3-3";
  state.hideOvrBeforePick = Boolean(save.hideOvrBeforePick);
  state.simSpeed = [1, 2, 4].includes(save.simSpeed) ? save.simSpeed : 1;
  state.usedTeamIds = Array.isArray(save.usedTeamIds) ? [...save.usedTeamIds] : [];
  state.squad = deserializeSquadFromSave(save.squad);

  if (save.phase === "draft") {
    state.phase = "draft";
    state.rerollsLeft = typeof save.rerollsLeft === "number" ? save.rerollsLeft : (state.hideOvrBeforePick ? 0 : 3);
    state.currentTeam = findTeamById(save.currentTeamId);
    state.tournament = createFreshTournamentState();
    if (getPickedCount() < 11 && !state.currentTeam) {
      spinNextTeam(false);
    } else {
      renderAll();
    }
    return;
  }

  if (save.phase === "tournament" && save.tournament) {
    const rt = save.tournament;
    const fresh = createFreshTournamentState();
    const restoredStages = (rt.stages || []).map((rs, idx) => {
      const oppTeam = findTeamById(rs.oppTeamId) || DB.teams?.[0];
      const minLvl = STAGE_OPPONENT_LEVELS[Math.min(idx, STAGE_OPPONENT_LEVELS.length - 1)] || 1;
      const stage = createTournamentStage({
        stageName: rs.stageName || "Partida",
        oppTeam,
        competition: rs.competition || "FF",
        ovrBoost: rs.ovrBoost || 0,
        oppBuffPct: rs.oppBuffPct || 0,
        oppLevel: Math.max(rs.oppLevel || 1, minLvl),
        isGroupStage: Boolean(rs.isGroupStage),
        groupRoundIdx: rs.groupRoundIdx ?? -1
      });
      stage.finished = Boolean(rs.finished);
      if (stage.finished) {
        stage.minute = Number(rs.minute) || 90;
        stage.maxMinute = Number(rs.maxMinute) || 90;
        stage.userScore = Number(rs.userScore) || 0;
        stage.oppScore = Number(rs.oppScore) || 0;
        stage.goalsUser = (rs.goalsUser || []).map((g) => ({
          ...g,
          sprite: resolveRankingPlayerSprite({ name: g.name })
        }));
        stage.goalsOpp = (rs.goalsOpp || []).map((g) => ({
          ...g,
          sprite: resolveRankingPlayerSprite({ name: g.name })
        }));
        stage.narration = Array.isArray(rs.narration) ? rs.narration : [];
        stage.won = rs.won;
        stage.isDraw = Boolean(rs.isDraw);
        stage.penaltiesText = rs.penaltiesText || null;
        stage._groupRecorded = Boolean(rs._groupRecorded);
        stage._bracketRecorded = Boolean(rs._bracketRecorded);
        if (rs._groupSnapshotBefore) {
          stage._groupSnapshotBefore = deserializeWorldGroupFromSave(rs._groupSnapshotBefore);
        }
        if (rs.stats) {
          stage.pitch = { stats: rehydratePitchStatsFromSave(rs.stats) };
        }
      }
      return stage;
    });

    const restoredT = {
      ...fresh,
      runId: rt.runId || fresh.runId,
      runEditToken: rt.runEditToken || fresh.runEditToken,
      rankingSavedSignature: rt.rankingSavedSignature || null,
      rankingStatus: rt.rankingStatus || null,
      rankingTeamName: sanitizeTeamName(rt.rankingTeamName || getSavedTeamName() || "Dream Team"),
      stageIndex: Math.max(0, Math.min(restoredStages.length - 1, Number(rt.stageIndex) || 0)),
      stages: restoredStages,
      worldUnlocked: Boolean(rt.worldUnlocked),
      worldGroup: deserializeWorldGroupFromSave(rt.worldGroup),
      ffBracket: deserializeBracketFromSave(rt.ffBracket),
      worldBracket: deserializeBracketFromSave(rt.worldBracket),
      teamEnergy: typeof rt.teamEnergy === "number" ? Math.max(0, Math.min(100, rt.teamEnergy)) : 100,
      preMatchTeamEnergy: typeof rt.preMatchTeamEnergy === "number" ? rt.preMatchTeamEnergy : undefined,
      nextMatchEnergyMul: typeof rt.nextMatchEnergyMul === "number" ? rt.nextMatchEnergyMul : 1,
      tactics: {
        lane: ["wings", "balanced", "center"].includes(rt.tactics?.lane) ? rt.tactics.lane : "balanced",
        posture: ["defensive", "balanced", "offensive"].includes(rt.tactics?.posture) ? rt.tactics.posture : "balanced",
        intensity: ["low", "medium", "high"].includes(rt.tactics?.intensity) ? rt.tactics.intensity : "medium",
        style: ["possession", "free", "vertical"].includes(rt.tactics?.style) ? rt.tactics.style : "free",
        hissatsuTactic: typeof rt.tactics?.hissatsuTactic === "string" ? rt.tactics.hissatsuTactic : "route_of_sky",
        captainPlayerId: rt.tactics?.captainPlayerId || null,
        acePlayerId: rt.tactics?.acePlayerId || null,
        markedOppId: rt.tactics?.markedOppId || null
      },
      prepBonuses: {
        ...createFreshPrepBonuses(),
        ...(rt.prepBonuses || {}),
        log: Array.isArray(rt.prepBonuses?.log) ? [...rt.prepBonuses.log] : []
      },
      showRunSummary: Boolean(rt.showRunSummary)
    };

    state.phase = "tournament";
    state.tournament = restoredT;
    restoredT.prep = deserializePrepFromSave(rt.prep, restoredT);

    const curSt = restoredT.stages[restoredT.stageIndex];
    if (restoredT.prep || (curSt && curSt.finished)) {
      renderAll();
    } else if (curSt && !curSt.finished) {
      runLiveMatchSimulation(restoredT.stageIndex);
    } else {
      openBetweenMatchPrep(restoredT.stageIndex);
    }
  }
}

function buildSupabaseHeaders(cfg, includeJson = false) {
  const key = String(cfg?.supabaseAnonKey || "").trim();
  const headers = { apikey: key };
  if (key.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${key}`;
  }
  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

async function fetchOnlineRankings() {
  const cfg = getRankingConfig();
  if (!cfg.isOnline) {
    throw new Error("Supabase ranking config is empty");
  }
  const endpoint =
    `${cfg.supabaseUrl}/rest/v1/rankings_public` +
    `?select=run_id,team_name,power,avg_level,ovr,chem,wins,draws,losses,matches_played,stage_name,is_champion,is_world_champion,difficulty,formation,roster_json,created_at` +
    `&order=power.desc,wins.desc,avg_level.desc,created_at.asc&limit=${cfg.maxEntries}`;
  const res = await fetch(endpoint, {
    method: "GET",
    headers: buildSupabaseHeaders(cfg, false)
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const rows = await res.json();
  if (!Array.isArray(rows)) return [];
  return rows.map(normalizeRankingEntry).filter(Boolean).sort(compareRankingEntries);
}

async function pushOnlineRankingEntry(entry, editToken) {
  const cfg = getRankingConfig();
  if (!cfg.isOnline) return false;
  const res = await fetch(`${cfg.supabaseUrl}/rest/v1/rpc/save_ranking_run`, {
    method: "POST",
    headers: buildSupabaseHeaders(cfg, true),
    body: JSON.stringify({
      p_run_id: entry.runId,
      p_edit_token: editToken,
      p_team_name: entry.teamName,
      p_power: entry.power,
      p_avg_level: entry.avgLevel,
      p_ovr: entry.ovr,
      p_chem: entry.chem,
      p_wins: entry.wins,
      p_draws: entry.draws,
      p_losses: entry.losses,
      p_matches_played: entry.matchesPlayed,
      p_stage_name: entry.stageName,
      p_is_champion: entry.isChampion,
      p_is_world_champion: entry.isWorldChampion,
      p_difficulty: entry.difficulty,
      p_formation: entry.formation,
      p_roster_json: entry.roster
    })
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return true;
}

async function renameOnlineRankingEntry(runId, editToken, newName) {
  const cfg = getRankingConfig();
  if (!cfg.isOnline) return false;
  const res = await fetch(`${cfg.supabaseUrl}/rest/v1/rpc/rename_ranking_run`, {
    method: "POST",
    headers: buildSupabaseHeaders(cfg, true),
    body: JSON.stringify({
      p_run_id: runId,
      p_edit_token: editToken,
      p_team_name: sanitizeTeamName(newName)
    })
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const ok = await res.json();
  return Boolean(ok);
}

function buildRankingEntryFromRun(t, summary, stats) {
  const teamName = sanitizeTeamName(t?.rankingTeamName || getSavedTeamName() || "Dream Team");
  return normalizeRankingEntry({
    runId: t?.runId || generateRandomToken("run"),
    teamName,
    power: Math.round(stats?.power || 0),
    avgLevel: Number(stats?.avgLevel || 1),
    ovr: Math.round(stats?.ovr || 0),
    chem: Math.round(stats?.chem || 0),
    wins: summary?.wins || 0,
    draws: summary?.draws || 0,
    losses: summary?.losses || 0,
    matchesPlayed: summary?.matchesPlayed || 0,
    stageName: summary?.stageName || "",
    isChampion: Boolean(summary?.isChampion || summary?.isFFChampion),
    isWorldChampion: Boolean(summary?.isWorldChampion),
    difficulty: state.hideOvrBeforePick ? "hidden" : "visible",
    formation: state.formation || "4-3-3",
    roster: buildCompactRankingRoster(),
    createdAt: new Date().toISOString()
  });
}

function isTournamentRunTerminal(t = state.tournament) {
  if (!t || !Array.isArray(t.stages) || t.stages.length === 0) return false;
  const st = t.stages[t.stageIndex];
  if (!st || !st.finished) return false;
  const isFFFinalWin = Boolean(st.won && st.competition === "FF" && t.stageIndex === 3 && !t.worldUnlocked);
  const isWorldFinalWin = Boolean(st.won && t.worldUnlocked && t.stageIndex === t.stages.length - 1);
  const isGroupElim = Boolean(st.isGroupStage && st.groupRoundIdx === 2 && getUserGroupRank(t.worldGroup) > 2);
  const isKnockoutLoss = Boolean(!st.isGroupStage && !st.won);
  return isFFFinalWin || isWorldFinalWin || isGroupElim || isKnockoutLoss;
}

function getRankingStatusBadgeHTML(t) {
  const cfg = getRankingConfig();
  if (t?.rankingStatus === "saving") {
    return `⏳ Salvando campanha no Ranking Global...`;
  }
  if (t?.rankingStatus === "online") {
    return `🌐 Salvo no Ranking Global (${escapeHtml(sanitizeTeamName(t.rankingTeamName))})`;
  }
  if (cfg.isOnline && t?.rankingStatus === "local") {
    return `💾 Salvo localmente (sem conexão ao servidor global)`;
  }
  return `🏆 Salvo automaticamente no Ranking (${escapeHtml(sanitizeTeamName(t?.rankingTeamName || "Dream Team"))})`;
}

function updateRunRankingStatusBadge(t, customHtml = null) {
  const el = document.getElementById("run-ranking-status-badge");
  if (!el || state.tournament !== t) return;
  el.innerHTML = customHtml != null ? customHtml : getRankingStatusBadgeHTML(t);
}

function maybeAutoSaveRunToRanking(t = state.tournament) {
  if (!t || !t.runId) return;
  const summary = computeTournamentRunSummary(t);
  const stats = calcSquadStats();
  if (!summary || (stats?.power || 0) < 100) return;
  const teamName = sanitizeTeamName(t.rankingTeamName || getSavedTeamName() || "Dream Team");
  t.rankingTeamName = teamName;
  const sig = `${t.runId}|${summary.matchesPlayed}|${summary.wins}|${summary.draws}|${summary.losses}|${Math.round(stats.power)}|${teamName}`;
  if (t.rankingSavedSignature === sig) return;
  t.rankingSavedSignature = sig;

  const entry = buildRankingEntryFromRun(t, summary, stats);
  if (!entry) return;
  upsertLocalRankingEntry(entry);

  const cfg = getRankingConfig();
  if (cfg.isOnline) {
    t.rankingStatus = "saving";
    updateRunRankingStatusBadge(t);
    pushOnlineRankingEntry(entry, t.runEditToken)
      .then(() => {
        if (state.tournament !== t) return;
        t.rankingStatus = "online";
        updateRunRankingStatusBadge(t);
      })
      .catch(() => {
        if (state.tournament !== t) return;
        t.rankingStatus = "local";
        updateRunRankingStatusBadge(t);
      });
  } else {
    t.rankingStatus = "local";
    updateRunRankingStatusBadge(t);
  }
}

function buildRunSummaryCardHTML(summary, stats, t) {
  if (!summary) return "";
  const rank = stats.power >= 1650 ? "S+" : stats.power >= 1450 ? "S" : stats.power >= 1250 ? "A" : "B";
  const statusTitle = summary.isWorldChampion
    ? `${ffLogoIconHTML("inline-trophy-icon")} CAMPEÃO DO FUTEBOL FRONTEIRA & MUNDIAL (FFI)`
    : summary.isChampion
    ? `${ffLogoIconHTML("inline-trophy-icon")} CAMPEÃO DO FUTEBOL FRONTEIRA`
    : summary.isFFChampion
    ? `CAMPEÃO DO FF • ELIMINADO NA ${summary.stageName.toUpperCase()}`
    : `FIM DA CAMPANHA — ${summary.stageName.toUpperCase()}`;
  const recordTxt = summary.draws > 0
    ? `${summary.wins}V/${summary.draws}E/${summary.losses}D`
    : `${summary.wins}V/${summary.losses}D`;
  const statusSub = summary.isChampion
    ? `${pluralPt(summary.wins, "vitória", "vitórias")} em ${pluralPt(summary.matchesPlayed, "jogo", "jogos")} (${recordTxt}) · Poder ${stats.power.toLocaleString("pt-BR")} (Rank ${rank}) · Nv. ${stats.avgLevel || 1} · OVR ${stats.ovr}`
    : `${recordTxt} em ${pluralPt(summary.matchesPlayed, "jogo", "jogos")} · Poder ${stats.power.toLocaleString("pt-BR")} (Rank ${rank}) · Nv. ${stats.avgLevel || 1}`;

  const renderAwardCard = (cls, tag, player, statMain, statSub) => {
    if (!player) return "";
    return `
      <div class="run-award-card ${cls}">
        <img class="run-award-avatar" src="${player.sprite || ""}" alt="${player.name}" />
        <div class="run-award-info">
          <div class="run-award-tag">${tag}</div>
          <div class="run-award-player">${player.name} <span class="run-award-role">· ${player.role}</span></div>
          <div class="run-award-stat">${statMain}</div>
          <div class="run-award-sub">${statSub}</div>
        </div>
      </div>
    `;
  };

  const mvp = summary.mvp;
  const goalDiffStr = summary.goalDiff >= 0 ? `+${summary.goalDiff}` : `${summary.goalDiff}`;
  const canAdvanceWorldBtn = summary.isFFChampion && !summary.worldUnlocked;
  let actionButtons = "";
  if (canAdvanceWorldBtn) {
    // Ao ser campeão do FF, foco total em continuar para o Mundial
    actionButtons = `
      <button class="ie-cmd-btn export-png-btn" id="btn-export-run-png"><span>Exportar Imagem (PNG)</span></button>
      <button class="ie-cmd-btn ie-cmd-gold" id="btn-advance-world-from-summary"><span>Continuar para o Mundial (FFI) →</span></button>
    `;
  } else if (summary.isChampion) {
    // Campeão Mundial final
    actionButtons = `
      <button class="ie-cmd-btn export-png-btn" id="btn-export-run-png"><span>Exportar Imagem (PNG)</span></button>
      <button class="ie-cmd-btn ie-cmd-green" id="btn-play-again-draft"><span>Novo Jogo</span></button>
      <button class="ie-cmd-btn ie-cmd-gold" id="btn-rematch-cup"><span>Outro Torneio</span></button>
    `;
  } else {
    // Eliminação / Derrota
    actionButtons = `
      <button class="ie-cmd-btn export-png-btn" id="btn-export-run-png"><span>Exportar Imagem (PNG)</span></button>
      <button class="ie-cmd-btn ie-cmd-green" id="btn-new-draft-after-loss"><span>Novo Jogo</span></button>
    `;
  }

  return `
    <div class="run-summary-card ${summary.isChampion ? "is-champion" : ""}" id="run-summary-card">
      <div class="run-summary-top">
        <div>
          <h3 style="font-size:1.15rem; font-weight:900; color:${summary.isChampion ? "#facc15" : "#fca5a5"};">
            ${statusTitle}
          </h3>
          <div style="font-size:0.78rem; color:#cbd5e1; margin-top:3px;">
            ${statusSub} · Química ${stats.chem}%
          </div>
        </div>
        <div class="run-summary-actions">
          ${actionButtons}
          <span class="export-png-status" id="export-png-status"></span>
        </div>
      </div>

      <div class="run-ranking-bar">
        <div class="run-ranking-status" id="run-ranking-status-badge">
          ${getRankingStatusBadgeHTML(t)}
        </div>
        <form class="run-ranking-name-form" id="run-ranking-name-form">
          <input type="text"
                 id="run-ranking-name-input"
                 class="run-ranking-name-input"
                 maxlength="28"
                 autocomplete="off"
                 placeholder="Nome / apelido do time..."
                 value="${escapeHtml(t?.rankingTeamName && t.rankingTeamName !== "Dream Team" ? t.rankingTeamName : getSavedTeamName())}" />
          <button type="submit" class="ie-cmd-btn ie-cmd-gold run-ranking-save-btn" id="btn-save-ranking-name">
            <span>Salvar Nome</span>
          </button>
        </form>
      </div>

      <div class="run-team-totals-grid">
        <div class="run-total-box">
          <small>Gols Feitos</small>
          <strong style="color:#4ade80;">${summary.goalsFor}</strong>
          <span>Saldo ${goalDiffStr} · ${pluralPt(summary.shots, "chute", "chutes")}</span>
        </div>
        <div class="run-total-box">
          <small>Gols Sofridos</small>
          <strong style="color:#f87171;">${summary.goalsAgainst}</strong>
          <span>${pluralPt(summary.oppShots, "chute contra", "chutes contra")}</span>
        </div>
        <div class="run-total-box">
          <small>Passes Certos</small>
          <strong style="color:#86efac;">${summary.passesOk}</strong>
          <span>${summary.passesOk}/${summary.passesTry} · ${summary.passAccuracyPct}%</span>
        </div>
        <div class="run-total-box">
          <small>Defesas (GOL)</small>
          <strong style="color:#facc15;">${summary.saves}</strong>
          <span>${summary.topKeeper ? summary.topKeeper.name : "Goleiro"} · ${pluralPt(summary.gkReleases, "reposição", "reposições")}</span>
        </div>
        <div class="run-total-box">
          <small>Dribles Certos</small>
          <strong style="color:#c084fc;">${summary.dribblesOk}</strong>
          <span>${summary.dribblesOk}/${summary.dribblesTry} · ${summary.dribbleAccuracyPct}%</span>
        </div>
        <div class="run-total-box">
          <small>Roubos de Bola</small>
          <strong style="color:#38bdf8;">${summary.steals}</strong>
          <span>${pluralPt(summary.blocks, "bloqueio", "bloqueios")} na área</span>
        </div>
        <div class="run-total-box">
          <small>Posse Média</small>
          <strong style="color:#fed7aa;">${summary.avgPossessionPct}%</strong>
          <span>${pluralPt(summary.matchesPlayed, "partida", "partidas")}</span>
        </div>
      </div>

      ${
        mvp
          ? `
        <div class="run-mvp-banner">
          <div class="run-mvp-left">
            <img class="run-mvp-avatar" src="${mvp.sprite || ""}" alt="${mvp.name}" />
            <div>
              <div style="font-size:0.65rem; font-weight:900; color:#facc15; text-transform:uppercase; letter-spacing:0.6px;">
                Craque da Campanha · MVP
              </div>
              <div style="font-size:1.02rem; font-weight:900; color:#fff;">
                ${mvp.name} <span style="font-size:0.76rem; color:#fde047;">· ${mvp.role} · OVR ${mvp.ovr}</span>
              </div>
              <div style="font-size:0.72rem; color:#cbd5e1;">${mvp.teamName || "Dream Team"} · Nota MVP ${mvp.mvpScore}</div>
            </div>
          </div>
          <div class="run-mvp-pills">
            <span class="run-mvp-pill">${pluralPt(mvp.goals, "Gol", "Gols")}</span>
            <span class="run-mvp-pill">${pluralPt(mvp.assists, "Assist.", "Assist.")}</span>
            <span class="run-mvp-pill">${pluralPt(mvp.dribblesOk, "Drible", "Dribles")}</span>
            <span class="run-mvp-pill">${pluralPt(mvp.steals, "Roubo", "Roubos")}</span>
            <span class="run-mvp-pill">${pluralPt(mvp.passesOk, "Passe", "Passes")}</span>
            ${mvp.saves > 0 ? `<span class="run-mvp-pill">${pluralPt(mvp.saves, "Defesa", "Defesas")}</span>` : ""}
          </div>
        </div>
      `
          : ""
      }

      <div class="run-awards-grid">
        ${renderAwardCard(
          "award-goals",
          "ARTILHEIRO",
          summary.topScorer,
          pluralPt(summary.topScorer?.goals || 0, "gol", "gols"),
          `${pluralPt(summary.topScorer?.shots || 0, "chute", "chutes")} · ${pluralPt(summary.topScorer?.assists || 0, "assist.", "assist.")}`
        )}
        ${renderAwardCard(
          "award-assists",
          "ASSISTÊNCIAS",
          summary.topAssister,
          pluralPt(summary.topAssister?.assists || 0, "assistência", "assistências"),
          `${pluralPt(summary.topAssister?.passesOk || 0, "passe", "passes")} · ${pluralPt(summary.topAssister?.goals || 0, "gol", "gols")}`
        )}
        ${renderAwardCard(
          "award-passes",
          "PASSADOR",
          summary.topPasser,
          pluralPt(summary.topPasser?.passesOk || 0, "passe certo", "passes certos"),
          `${summary.topPasser?.passesTry || 0} tentados · ${summary.topPasser?.passAcc || 0}%`
        )}
        ${renderAwardCard(
          "award-dribbles",
          "DRIBLADOR",
          summary.topDribbler,
          pluralPt(summary.topDribbler?.dribblesOk || 0, "drible", "dribles"),
          `${summary.topDribbler?.dribblesTry || 0} tentados · ${summary.topDribbler?.dribbleAcc || 0}%`
        )}
        ${renderAwardCard(
          "award-steals",
          "LADRÃO DE BOLAS",
          summary.topStealer,
          pluralPt(summary.topStealer?.steals || 0, "roubo", "roubos"),
          `${pluralPt(summary.topStealer?.blocks || 0, "bloqueio", "bloqueios")} na área`
        )}
        ${renderAwardCard(
          "award-saves",
          "GOLEIRO",
          summary.topKeeper,
          pluralPt(summary.topKeeper?.saves || 0, "defesa", "defesas"),
          `${pluralPt(summary.goalsAgainst, "gol sofrido", "gols sofridos")} · ${pluralPt(summary.topKeeper?.gkReleases || 0, "reposição", "reposições")}`
        )}
      </div>

      <div class="run-matches-strip">
        ${(summary.allStages || [])
          .map((s, idx) => {
            const played = idx <= t.stageIndex && s.finished;
            const cls = played ? (s.won ? "match-win" : s.isDraw ? "match-draw" : "match-loss") : "match-locked";
            const resLabel = s.won ? "Vitória" : s.isDraw ? "Empate" : "Derrota";
            return `
              <div class="run-match-chip ${cls}">
                ${played && s.oppTeam?.emblem ? `<img src="${s.oppTeam.emblem}" alt="" />` : ""}
                <div style="min-width:0;">
                  <div class="run-match-stage">${s.stageName}</div>
                  <div class="run-match-opp">${idx <= t.stageIndex ? s.oppTeam?.name || "Adversário" : "Não disputado"}</div>
                  <div class="run-match-score">${played ? `${s.userScore} x ${s.oppScore} · ${resLabel}` : "—"}</div>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>

      <div class="run-roster-wrap">
        <table class="run-roster-table">
          <thead>
            <tr>
              <th>Jogador</th>
              <th class="num">Pos</th>
              <th class="num">Gols</th>
              <th class="num">Assist</th>
              <th class="num">Passes</th>
              <th class="num">Dribles</th>
              <th class="num">Roubos</th>
              <th class="num">Defesas</th>
              <th class="num">MVP</th>
            </tr>
          </thead>
          <tbody>
            ${summary.rosterSorted
              .map(
                (p) => `
              <tr>
                <td style="display:flex; align-items:center; gap:6px; font-weight:800;">
                  <img src="${p.sprite || ""}" alt="" style="width:22px; height:22px; border-radius:50%; object-fit:contain;" />
                  <span>${p.name}</span>
                </td>
                <td class="num" style="color:#93c5fd; font-weight:800;">${p.role}</td>
                <td class="num" style="font-weight:900; color:${p.goals > 0 ? "#4ade80" : "#94a3b8"};">${p.goals}</td>
                <td class="num" style="font-weight:900; color:${p.assists > 0 ? "#38bdf8" : "#94a3b8"};">${p.assists}</td>
                <td class="num">${p.role === "GK" ? `${p.gkReleases} rep.` : `${p.passesOk}/${p.passesTry}`}</td>
                <td class="num">${p.dribblesOk}/${p.dribblesTry}</td>
                <td class="num" style="color:${p.steals > 0 ? "#22d3ee" : "#94a3b8"}; font-weight:800;">${p.steals}</td>
                <td class="num" style="color:${p.saves > 0 ? "#facc15" : "#94a3b8"}; font-weight:800;">${p.saves}</td>
                <td class="num" style="color:#fde047; font-weight:900;">${p.mvpScore}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div id="run-export-preview-slot"></div>
    </div>
  `;
}

function loadCanvasImageSafe(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function fillRoundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
  ctx.fill();
}

function strokeRoundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
  ctx.stroke();
}

function drawClippedText(ctx, text, x, y, maxW) {
  let out = String(text || "");
  if (ctx.measureText(out).width <= maxW) {
    ctx.fillText(out, x, y);
    return;
  }
  while (out.length > 1 && ctx.measureText(out + "...").width > maxW) {
    out = out.slice(0, -1);
  }
  ctx.fillText(out + "...", x, y);
}

function drawCircularAvatar(ctx, img, cx, cy, radius, borderColor, bgFill) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = bgFill || "#0b1a3d";
  ctx.fill();
  ctx.clip();
  if (img) {
    ctx.drawImage(img, cx - radius * 0.92, cy - radius * 0.92, radius * 1.84, radius * 1.84);
  }
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = borderColor || "#facc15";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

async function exportRunSummaryImage(summary, stats, t) {
  const btnEl = document.getElementById("btn-export-run-png");
  if (btnEl && btnEl.disabled) return null;
  if (btnEl) btnEl.disabled = true;
  const statusEl = document.getElementById("export-png-status");
  const previewSlot = document.getElementById("run-export-preview-slot");
  if (statusEl) statusEl.textContent = "⏳ Gerando imagem...";

  try {
    const imgCache = new Map();
    const urls = new Set();
    if (UI.raimonEmblem) urls.add(UI.raimonEmblem);
    [
      summary.mvp,
      summary.topScorer,
      summary.topAssister,
      summary.topPasser,
      summary.topDribbler,
      summary.topStealer,
      summary.topKeeper,
      ...(summary.rosterSorted || [])
    ].forEach((p) => {
      if (p?.sprite) urls.add(p.sprite);
    });
    (summary.allStages || []).forEach((s) => {
      if (s?.oppTeam?.emblem) urls.add(s.oppTeam.emblem);
    });

    await Promise.all(
      Array.from(urls).map(async (u) => {
        imgCache.set(u, await loadCanvasImageSafe(u));
      })
    );
    if (state.phase !== "tournament" || state.tournament !== t || !t?.showRunSummary) {
      return null;
    }

  const stageCount = (summary.allStages || []).length || 4;
  const stageRows = Math.max(1, Math.ceil(stageCount / 4));
  const extraStageH = (stageRows - 1) * 120;
  const W = 1200;
  const H = 1480 + extraStageH;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const fontFamily = "'Segoe UI', Roboto, Arial, sans-serif";

  // Fundo gradiente Inazuma
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, "#051029");
  bgGrad.addColorStop(0.45, "#0b2052");
  bgGrad.addColorStop(1, "#040b1d");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Linhas sutis diagonais de energia
  ctx.save();
  ctx.strokeStyle = "rgba(56, 189, 248, 0.06)";
  ctx.lineWidth = 36;
  for (let x = -300; x < W + 300; x += 180) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - 320, H);
    ctx.stroke();
  }
  ctx.restore();

  // Moldura externa
  ctx.strokeStyle = summary.isChampion ? "rgba(250, 204, 21, 0.72)" : "rgba(56, 189, 248, 0.5)";
  ctx.lineWidth = 4;
  strokeRoundRect(ctx, 14, 14, W - 28, H - 28, 20);

  // HEADER CARD (y: 28..168)
  ctx.fillStyle = "rgba(6, 17, 44, 0.9)";
  fillRoundRect(ctx, 32, 28, W - 64, 140, 16);
  ctx.strokeStyle = summary.isChampion ? "#facc15" : "#38bdf8";
  ctx.lineWidth = 2;
  strokeRoundRect(ctx, 32, 28, W - 64, 140, 16);

  const emblemImg = UI.raimonEmblem ? imgCache.get(UI.raimonEmblem) : null;
  if (emblemImg) {
    ctx.drawImage(emblemImg, 54, 48, 96, 96);
  }

  ctx.textBaseline = "top";
  ctx.fillStyle = "#93c5fd";
  ctx.font = `900 18px ${fontFamily}`;
  ctx.fillText(
    summary.worldUnlocked
      ? "INAZUMA ELEVEN • MODO RELÂMPAGO • FUTEBOL FRONTEIRA & MUNDIAL (FFI)"
      : "INAZUMA ELEVEN • MODO RELÂMPAGO • FUTEBOL FRONTEIRA",
    170,
    44
  );

  const gamesWord = summary.matchesPlayed === 1 ? "jogo" : "jogos";
  const pngTitle = summary.isWorldChampion
    ? "CAMPEÃO DO MUNDO (FFI)!"
    : summary.isChampion
    ? "CAMPEÃO DO FUTEBOL FRONTEIRA!"
    : summary.isFFChampion
    ? `CAMPEÃO DO FF • ${summary.stageName.toUpperCase()}`
    : `FIM DA RUN — ${summary.stageName.toUpperCase()}`;
  const pngRec = summary.draws > 0
    ? `${summary.wins}V / ${summary.draws}E / ${summary.losses}D`
    : `${summary.wins}V / ${summary.losses}D`;
  ctx.fillStyle = summary.isChampion ? "#facc15" : "#fca5a5";
  ctx.font = `900 30px ${fontFamily}`;
  drawClippedText(ctx, pngTitle, 170, 76, 748);

  const rank = stats.power >= 1650 ? "S+" : stats.power >= 1450 ? "S" : stats.power >= 1250 ? "A" : "B";
  ctx.fillStyle = "#e2e8f0";
  ctx.font = `700 19px ${fontFamily}`;
  drawClippedText(
    ctx,
    `${pngRec} em ${pluralPt(summary.matchesPlayed, "jogo", "jogos")} · OVR ${stats.ovr} · Química ${stats.chem}% · Laços +${stats.bondsPower}`,
    170,
    122,
    748
  );

  // Pill de Rank / Poder no canto direito do Header
  ctx.fillStyle = "rgba(250, 204, 21, 0.16)";
  fillRoundRect(ctx, 940, 44, 206, 108, 14);
  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 2;
  strokeRoundRect(ctx, 940, 44, 206, 108, 14);
  ctx.textAlign = "center";
  ctx.fillStyle = "#fde047";
  ctx.font = `900 15px ${fontFamily}`;
  ctx.fillText("PODER FINAL", 1043, 56);
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 32px ${fontFamily}`;
  ctx.fillText(stats.power.toLocaleString("pt-BR"), 1043, 80);
  ctx.fillStyle = "#facc15";
  ctx.font = `900 18px ${fontFamily}`;
  ctx.fillText(`RANK ${rank}`, 1043, 120);
  ctx.textAlign = "left";

  // TEAM TOTALS STRIP (y: 184..288)
  const totals = [
    { label: "GOLS FEITOS", val: String(summary.goalsFor), sub: `Saldo ${summary.goalDiff >= 0 ? "+" : ""}${summary.goalDiff}`, color: "#4ade80" },
    { label: "GOLS SOFRIDOS", val: String(summary.goalsAgainst), sub: pluralPt(summary.oppShots, "chute contra", "chutes contra"), color: "#f87171" },
    { label: "PASSES CERTOS", val: String(summary.passesOk), sub: `${summary.passesOk}/${summary.passesTry} · ${summary.passAccuracyPct}%`, color: "#86efac" },
    { label: "DEFESAS GOL", val: String(summary.saves), sub: `${summary.topKeeper?.name || "Goleiro"} · ${summary.gkReleases} rep.`, color: "#facc15" },
    { label: "DRIBLES CERTOS", val: String(summary.dribblesOk), sub: `${summary.dribblesOk}/${summary.dribblesTry} · ${summary.dribbleAccuracyPct}%`, color: "#c084fc" },
    { label: "ROUBOS DE BOLA", val: String(summary.steals), sub: pluralPt(summary.blocks, "bloqueio", "bloqueios"), color: "#38bdf8" },
    { label: "POSSE MÉDIA", val: `${summary.avgPossessionPct}%`, sub: pluralPt(summary.shots, "chute", "chutes"), color: "#fed7aa" }
  ];
  const boxGap = 10;
  const boxW = (W - 64 - boxGap * (totals.length - 1)) / totals.length;
  totals.forEach((item, i) => {
    const bx = 32 + i * (boxW + boxGap);
    ctx.fillStyle = "rgba(13, 28, 66, 0.92)";
    fillRoundRect(ctx, bx, 184, boxW, 102, 12);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
    ctx.lineWidth = 1.5;
    strokeRoundRect(ctx, bx, 184, boxW, 102, 12);

    ctx.textAlign = "center";
    ctx.fillStyle = "#93c5fd";
    ctx.font = `900 12px ${fontFamily}`;
    ctx.fillText(item.label, bx + boxW / 2, 196);
    ctx.fillStyle = item.color;
    ctx.font = `900 32px ${fontFamily}`;
    ctx.fillText(item.val, bx + boxW / 2, 218);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = `700 12px ${fontFamily}`;
    drawClippedText(ctx, item.sub, bx + boxW / 2, 260, boxW - 10);
  });
  ctx.textAlign = "left";

  // MVP BANNER (y: 302..410)
  ctx.fillStyle = "rgba(250, 204, 21, 0.13)";
  fillRoundRect(ctx, 32, 302, W - 64, 108, 14);
  ctx.strokeStyle = "rgba(250, 204, 21, 0.78)";
  ctx.lineWidth = 2;
  strokeRoundRect(ctx, 32, 302, W - 64, 108, 14);

  if (summary.mvp) {
    const m = summary.mvp;
    drawCircularAvatar(ctx, imgCache.get(m.sprite), 96, 356, 38, "#facc15", "#09183b");
    ctx.fillStyle = "#facc15";
    ctx.font = `900 15px ${fontFamily}`;
    ctx.fillText("CRAQUE DA CAMPANHA · MVP", 150, 318);
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 28px ${fontFamily}`;
    drawClippedText(ctx, `${m.name} (${m.role} · OVR ${m.ovr})`, 150, 342, 430);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = `700 16px ${fontFamily}`;
    ctx.fillText(`${m.teamName || "Dream Team"} · Nota MVP ${m.mvpScore}`, 150, 378);

    const pills = [
      pluralPt(m.goals, "Gol", "Gols"),
      pluralPt(m.assists, "Assist.", "Assist."),
      pluralPt(m.dribblesOk, "Drible", "Dribles"),
      pluralPt(m.steals, "Roubo", "Roubos"),
      pluralPt(m.passesOk, "Passe", "Passes"),
      pluralPt(m.saves, "Defesa", "Defesas")
    ];
    pills.forEach((txt, idx) => {
      const px = 605 + (idx % 3) * 182;
      const py = 318 + Math.floor(idx / 3) * 40;
      ctx.fillStyle = "rgba(7, 15, 38, 0.9)";
      fillRoundRect(ctx, px, py, 170, 32, 16);
      ctx.strokeStyle = "rgba(250, 204, 21, 0.45)";
      ctx.lineWidth = 1.2;
      strokeRoundRect(ctx, px, py, 170, 32, 16);
      ctx.textAlign = "center";
      ctx.fillStyle = "#fef08a";
      ctx.font = `900 15px ${fontFamily}`;
      ctx.fillText(txt, px + 85, py + 8);
    });
    ctx.textAlign = "left";
  }

  // 6 INDIVIDUAL AWARD CARDS (y: 428..792) - 3 cols x 2 rows
  const awards = [
    {
      title: "ARTILHEIRO",
      accent: "#f97316",
      p: summary.topScorer,
      main: pluralPt(summary.topScorer?.goals || 0, "GOL", "GOLS"),
      sub: `${pluralPt(summary.topScorer?.shots || 0, "chute", "chutes")} · ${pluralPt(summary.topScorer?.assists || 0, "assist.", "assist.")}`
    },
    {
      title: "ASSISTÊNCIAS",
      accent: "#38bdf8",
      p: summary.topAssister,
      main: pluralPt(summary.topAssister?.assists || 0, "ASSISTÊNCIA", "ASSISTÊNCIAS"),
      sub: `${pluralPt(summary.topAssister?.passesOk || 0, "passe", "passes")} · ${pluralPt(summary.topAssister?.goals || 0, "gol", "gols")}`
    },
    {
      title: "PASSADOR",
      accent: "#4ade80",
      p: summary.topPasser,
      main: pluralPt(summary.topPasser?.passesOk || 0, "PASSE CERTO", "PASSES CERTOS"),
      sub: `${summary.topPasser?.passesTry || 0} tentados · ${summary.topPasser?.passAcc || 0}%`
    },
    {
      title: "DRIBLADOR",
      accent: "#c084fc",
      p: summary.topDribbler,
      main: pluralPt(summary.topDribbler?.dribblesOk || 0, "DRIBLE", "DRIBLES"),
      sub: `${summary.topDribbler?.dribblesTry || 0} tentados · ${summary.topDribbler?.dribbleAcc || 0}%`
    },
    {
      title: "LADRÃO DE BOLAS",
      accent: "#22d3ee",
      p: summary.topStealer,
      main: pluralPt(summary.topStealer?.steals || 0, "ROUBO", "ROUBOS"),
      sub: `${pluralPt(summary.topStealer?.blocks || 0, "bloqueio", "bloqueios")} na área`
    },
    {
      title: "GOLEIRO",
      accent: "#facc15",
      p: summary.topKeeper,
      main: pluralPt(summary.topKeeper?.saves || 0, "DEFESA", "DEFESAS"),
      sub: `${pluralPt(summary.goalsAgainst, "gol sofrido", "gols sofridos")} · ${pluralPt(summary.topKeeper?.gkReleases || 0, "repos.", "repos.")}`
    }
  ];

  const awGap = 16;
  const awW = (W - 64 - awGap * 2) / 3;
  const awH = 172;
  awards.forEach((aw, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const ax = 32 + col * (awW + awGap);
    const ay = 428 + row * (awH + 16);

    ctx.fillStyle = "rgba(10, 23, 56, 0.94)";
    fillRoundRect(ctx, ax, ay, awW, awH, 14);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.32)";
    ctx.lineWidth = 1.5;
    strokeRoundRect(ctx, ax, ay, awW, awH, 14);

    ctx.fillStyle = aw.accent;
    fillRoundRect(ctx, ax, ay, 8, awH, 4);

    if (aw.p) {
      drawCircularAvatar(ctx, imgCache.get(aw.p.sprite), ax + 64, ay + 88, 38, aw.accent, "#081433");
      ctx.fillStyle = "#93c5fd";
      ctx.font = `900 13px ${fontFamily}`;
      ctx.fillText(aw.title, ax + 116, ay + 20);

      ctx.fillStyle = "#ffffff";
      ctx.font = `900 22px ${fontFamily}`;
      drawClippedText(ctx, `${aw.p.name} (${aw.p.role})`, ax + 116, ay + 46, awW - 130);

      ctx.fillStyle = aw.accent;
      ctx.font = `900 26px ${fontFamily}`;
      ctx.fillText(aw.main, ax + 116, ay + 84);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = `700 14px ${fontFamily}`;
      drawClippedText(ctx, aw.sub, ax + 116, ay + 124, awW - 130);
    }
  });

  // STAGE BRACKET RESULTS (y: 806..930)
  ctx.fillStyle = "#93c5fd";
  ctx.font = `900 16px ${fontFamily}`;
  ctx.fillText("CAMPANHA JOGO A JOGO", 32, 792);

  const stGap = 14;
  const stW = (W - 64 - stGap * 3) / 4;
  (summary.allStages || []).forEach((s, idx) => {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const sx = 32 + col * (stW + stGap);
    const sy = 818 + row * 120;
    const reached = idx <= t.stageIndex && s.finished;
    ctx.fillStyle = reached
      ? s.won
        ? "rgba(20, 83, 45, 0.55)"
        : s.isDraw
        ? "rgba(113, 63, 18, 0.52)"
        : "rgba(127, 29, 29, 0.55)"
      : "rgba(15, 23, 42, 0.65)";
    fillRoundRect(ctx, sx, sy, stW, 108, 12);
    ctx.strokeStyle = reached
      ? s.won
        ? "#4ade80"
        : s.isDraw
        ? "#facc15"
        : "#f87171"
      : "rgba(148, 163, 184, 0.25)";
    ctx.lineWidth = 1.5;
    strokeRoundRect(ctx, sx, sy, stW, 108, 12);

    const oppEmb = s.oppTeam?.emblem ? imgCache.get(s.oppTeam.emblem) : null;
    if (oppEmb && idx <= t.stageIndex) {
      ctx.drawImage(oppEmb, sx + 14, sy + 32, 46, 46);
    }

    ctx.fillStyle = "#93c5fd";
    ctx.font = `900 12px ${fontFamily}`;
    drawClippedText(ctx, (s.stageName || "").toUpperCase(), sx + 70, sy + 16, stW - 82);

    ctx.fillStyle = "#ffffff";
    ctx.font = `800 16px ${fontFamily}`;
    drawClippedText(ctx, idx <= t.stageIndex ? s.oppTeam?.name || "Adversário" : "Não enfrentado", sx + 70, sy + 38, stW - 82);

    ctx.fillStyle = reached ? (s.won ? "#4ade80" : s.isDraw ? "#fde047" : "#f87171") : "#64748b";
    ctx.font = `900 22px ${fontFamily}`;
    const resTxt = s.won ? "VITÓRIA" : s.isDraw ? "EMPATE" : "DERROTA";
    ctx.fillText(
      reached ? `${s.userScore} x ${s.oppScore} ${resTxt}` : "—",
      sx + 70,
      sy + 68
    );
  });

  // ROSTER TABLE
  ctx.fillStyle = "#93c5fd";
  ctx.font = `900 16px ${fontFamily}`;
  ctx.fillText("DESEMPENHO COMPLETO DO ELENCO NA RUN", 32, 944 + extraStageH);

  const tblY = 970 + extraStageH;
  ctx.fillStyle = "rgba(8, 19, 46, 0.94)";
  fillRoundRect(ctx, 32, tblY, W - 64, 442, 12);
  ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
  ctx.lineWidth = 1.5;
  strokeRoundRect(ctx, 32, tblY, W - 64, 442, 12);

  ctx.fillStyle = "rgba(15, 36, 82, 0.95)";
  fillRoundRect(ctx, 32, tblY, W - 64, 38, 12);

  const cols = [
    { label: "JOGADOR", x: 56, align: "left" },
    { label: "POS", x: 380, align: "center" },
    { label: "OVR", x: 455, align: "center" },
    { label: "GOLS", x: 540, align: "center" },
    { label: "ASSIST", x: 630, align: "center" },
    { label: "PASSES", x: 745, align: "center" },
    { label: "DRIBLES", x: 865, align: "center" },
    { label: "ROUBOS", x: 970, align: "center" },
    { label: "DEFESAS", x: 1060, align: "center" },
    { label: "MVP", x: 1135, align: "center" }
  ];
  ctx.fillStyle = "#93c5fd";
  ctx.font = `900 13px ${fontFamily}`;
  cols.forEach((c) => {
    ctx.textAlign = c.align;
    ctx.fillText(c.label, c.x, tblY + 12);
  });

  const rows = (summary.rosterSorted || []).slice(0, 11);
  rows.forEach((p, idx) => {
    const ry = tblY + 42 + idx * 36;
    if (idx % 2 === 1) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.fillRect(34, ry, W - 68, 34);
    }
    const spImg = p.sprite ? imgCache.get(p.sprite) : null;
    if (spImg) {
      ctx.drawImage(spImg, 50, ry + 4, 26, 26);
    }
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 16px ${fontFamily}`;
    drawClippedText(ctx, p.name, 84, ry + 8, 250);

    ctx.textAlign = "center";
    ctx.fillStyle = "#93c5fd";
    ctx.font = `800 15px ${fontFamily}`;
    ctx.fillText(p.role, 380, ry + 9);
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(String(p.ovr), 455, ry + 9);
    ctx.fillStyle = p.goals > 0 ? "#4ade80" : "#64748b";
    ctx.font = `900 16px ${fontFamily}`;
    ctx.fillText(String(p.goals), 540, ry + 9);
    ctx.fillStyle = p.assists > 0 ? "#38bdf8" : "#64748b";
    ctx.fillText(String(p.assists), 630, ry + 9);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = `700 15px ${fontFamily}`;
    ctx.fillText(p.role === "GK" ? `${p.gkReleases} rep.` : `${p.passesOk}/${p.passesTry}`, 745, ry + 9);
    ctx.fillText(`${p.dribblesOk}/${p.dribblesTry}`, 865, ry + 9);
    ctx.fillStyle = p.steals > 0 ? "#22d3ee" : "#64748b";
    ctx.font = `900 16px ${fontFamily}`;
    ctx.fillText(String(p.steals), 970, ry + 9);
    ctx.fillStyle = p.saves > 0 ? "#facc15" : "#64748b";
    ctx.fillText(String(p.saves), 1060, ry + 9);
    ctx.fillStyle = "#fde047";
    ctx.fillText(String(p.mvpScore), 1135, ry + 9);
  });
  ctx.textAlign = "left";

  // Rodapé
  ctx.textAlign = "center";
  ctx.fillStyle = "#64748b";
  ctx.font = `700 14px ${fontFamily}`;
  ctx.fillText("Inazuma Eleven Dream Team • Resumo Oficial da Campanha (Modo Relâmpago)", W / 2, 1434 + extraStageH);
  ctx.textAlign = "left";

  const dataUrl = canvas.toDataURL("image/png");
  const fileName = summary.isChampion
    ? "inazuma-dream-team-campeao.png"
    : "inazuma-dream-team-resumo-run.png";

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  if (statusEl) statusEl.textContent = `Imagem "${fileName}" exportada!`;
  if (previewSlot) {
    previewSlot.innerHTML = `
      <div class="run-export-preview">
        <div style="font-size:0.74rem; color:#bae6fd; font-weight:800;">
          Prévia da Imagem Exportada (${W}x${H}px)
        </div>
        <img src="${dataUrl}" alt="Resumo da Campanha Dream Team" />
      </div>
    `;
  }
  return dataUrl;
  } finally {
    if (btnEl && btnEl.isConnected) btnEl.disabled = false;
  }
}
