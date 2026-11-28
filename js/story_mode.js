// ============================================================================
// MODO HISTÓRIA (BETA WIP — FASE 1)
// Prancheta Tática (11 + 5 Reservas via 5x5), Série A (10 Times, Zero Clones),
// Notas Pós-Jogo (0.0 - 10.0), Central de Estatísticas & Scout Completo
// ============================================================================

function normalizeStoryPlayerKey(p) {
  const raw = typeof p === "string" ? p : (p?.fullName || p?.name || "");
  if (typeof normalizePlayerFullName === "function") {
    return normalizePlayerFullName(raw).trim().toLowerCase();
  }
  return String(raw || "").trim().toLowerCase();
}

function shuffleStoryCopy(list) {
  const arr = Array.isArray(list) ? [...list] : [];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function getStorySquadAvgLevel() {
  const players = Object.values(state.squad || {}).filter(Boolean);
  if (players.length === 0) return 1;
  const sum = players.reduce((acc, p) => acc + (typeof getPlayerLevel === "function" ? getPlayerLevel(p) : 1), 0);
  return Math.max(1, Math.round(sum / players.length));
}

function wrapStoryClipboardHTML(innerHTML, clipTitle = "PRANCHETA TÁTICA • MODO HISTÓRIA (WIP)") {
  if (typeof isStoryMode !== "function" || !isStoryMode()) return innerHTML;
  return `
    <div class="story-clipboard-frame">
      <div class="story-clipboard-header">
        <div class="story-clip-clamp" aria-hidden="true"><span></span></div>
        <div class="story-clipboard-title-row">
          <span class="story-clip-label">${escapeHtml(clipTitle)}</span>
          <span class="story-wip-pill">BETA WIP</span>
        </div>
      </div>
      <div class="story-clipboard-body">
        ${innerHTML}
      </div>
    </div>
  `;
}

function clearStoryIntroRuntime() {
  if (typeof window !== "undefined") {
    if (window._storyIntroTypeTimer) {
      clearInterval(window._storyIntroTypeTimer);
      window._storyIntroTypeTimer = null;
    }
    if (window._storyIntroKeyHandler && typeof document !== "undefined" && typeof document.removeEventListener === "function") {
      document.removeEventListener("keydown", window._storyIntroKeyHandler);
      window._storyIntroKeyHandler = null;
    }
  }
}

function initFreshStoryIntroState() {
  clearStoryIntroRuntime();
  state.storyRun = {
    active: true,
    wip: true,
    phase: "INTRO",
    introStep: 0,
    bench: [],
    usedFullNames: [],
    leagueFullNames: [],
    freeAgentPool: [],
    league: null
  };
  return state.storyRun;
}

function beginStoryDraftFromIntro(nameVal = "") {
  const cleanVal = String(nameVal || state.draftTeamName || "").trim();
  state.draftTeamName = cleanVal;
  if (typeof setSavedTeamName === "function" && cleanVal) setSavedTeamName(cleanVal);
  clearStoryIntroRuntime();
  if (state.spinTimerId) {
    clearTimeout(state.spinTimerId);
    state.spinTimerId = null;
  }
  if (typeof stopRouletteSpinAudio === "function") stopRouletteSpinAudio();
  state.isSpinning = false;
  state.phase = "draft";
  state.squad = {};
  state.selectedPlayer = null;
  state.peekField = false;
  state.swapSlotId = null;
  state.swapBenchIdx = null;
  state.rerollsLeft = state.hideOvrBeforePick ? 0 : 3;
  state.usedTeamIds = [];
  state.tournament = createFreshTournamentState();
  if (!state.storyRun) initFreshStoryIntroState();
  state.storyRun.phase = "DRAFT";
  spinNextTeam(false);
}

// ============================================================================
// ATO I — NARRAÇÃO INTERATIVA ESTILO RPG / VISUAL NOVEL (MODO HISTÓRIA WIP)
// ============================================================================
function renderStoryIntroScreen() {
  const container = document.getElementById("main-screen-container");
  if (!container) return;

  clearStoryIntroRuntime();
  if (!state.storyRun) initFreshStoryIntroState();
  state.storyRun.phase = "INTRO";

  const curName = state.draftTeamName !== null && state.draftTeamName !== undefined
    ? state.draftTeamName
    : (typeof getSavedTeamName === "function" ? getSavedTeamName() : "");

  const step = Math.max(0, Math.min(4, Number(state.storyRun.introStep) || 0));
  state.storyRun.introStep = step;

  const ffIco = typeof ffLogoIconHTML === "function" ? ffLogoIconHTML("inline-ui-icon") : "";
  const boltIco = typeof buildInazumaBoltSVG === "function" ? buildInazumaBoltSVG("inline-svg-icon") : "";
  const formIco = typeof formationIconHTML === "function" ? formationIconHTML("inline-ui-icon") : "";
  const raimonSrc = UI.raimonEmblem || "";
  const ffSrc = UI.ffLogo || raimonSrc;
  const campSrc = UI.iconCampinho || UI.locRiverbank || "";

  const scenes = [
    {
      bg: UI.stadiumBg || "",
      chapter: "ATO I · CONVITE DA FEDERAÇÃO",
      speakerIcon: ffSrc,
      speaker: "DIRETOR DA FEDERAÇÃO",
      text: "Treinador! A nova Série A Inazuma acaba de abrir uma vaga especial. Você foi escolhido para assumir o 10º clube e construir uma equipe do zero!",
      visualHTML: `
        <div class="story-vn-emblem-hero">
          ${ffSrc ? `<img class="story-vn-hero-crest" src="${ffSrc}" alt="Federação Inazuma" />` : ""}
          <div class="story-vn-eyebrow">TEMPORADA INAUGURAL • FASE 1 (WIP)</div>
          <h2 class="story-vn-hero-title">PROJETO CLUBE ESPECIAL</h2>
          <p class="story-vn-hero-sub">Do rascunho na Prancheta Tática ao topo da Série A Nacional</p>
        </div>
      `
    },
    {
      bg: UI.stadiumBg || "",
      chapter: "ATO I · REGULAMENTO DA SÉRIE A",
      speakerIcon: ffSrc,
      speaker: "DIRETOR DA FEDERAÇÃO",
      text: "Dez clubes se enfrentam em turno único de 9 rodadas — sem jogadores repetidos na liga. O Top 2 vai direto ao Mundial de Clubes, e 3º e 4º disputam o Play-In.",
      visualHTML: `
        <div class="story-vn-visual-head">
          <div class="story-vn-eyebrow">REGRAS DO CAMPEONATO</div>
          <h3 class="story-vn-stage-title">Série A Inazuma — Turno Único</h3>
        </div>
        <div class="story-vn-rules-strip">
          <div class="story-vn-rule-tile">
            <span class="story-vn-rule-kpi">10 CLUBES</span>
            <span class="story-vn-rule-desc">9 rodadas (empate vale 1 pt)</span>
          </div>
          <div class="story-vn-rule-tile">
            <span class="story-vn-rule-kpi">ZERO CLONES</span>
            <span class="story-vn-rule-desc">Nenhum atleta repetido na liga</span>
          </div>
          <div class="story-vn-rule-tile">
            <span class="story-vn-rule-kpi">TOP 2 / G-4</span>
            <span class="story-vn-rule-desc">Mundial direto • 3º–4º Play-In</span>
          </div>
        </div>
      `
    },
    {
      bg: UI.locTraining || UI.stadiumBg || "",
      chapter: "ATO I · PRANCHETA & ANÁLISE",
      speakerIcon: raimonSrc,
      speaker: "COMISSÃO TÉCNICA",
      text: "Na Prancheta Tática você monta seus 11 titulares na roleta (com 3 rerolls). A cada rodada terá Scout completo dos rivais, Tabela e Notas de 0.0 a 10.0!",
      visualHTML: `
        <div class="story-vn-visual-head">
          <div class="story-vn-eyebrow">SEUS INSTRUMENTOS DE TREINADOR</div>
          <h3 class="story-vn-stage-title">Prancheta, Scout &amp; Estatísticas</h3>
        </div>
        <div class="story-vn-rules-strip">
          <div class="story-vn-rule-tile">
            <span class="story-vn-rule-kpi">11 TITULARES</span>
            <span class="story-vn-rule-desc">Roleta com 3 rerolls na Prancheta</span>
          </div>
          <div class="story-vn-rule-tile">
            <span class="story-vn-rule-kpi">NOTAS 0–10</span>
            <span class="story-vn-rule-desc">Avaliação real + Artilharia e GK</span>
          </div>
          <div class="story-vn-rule-tile">
            <span class="story-vn-rule-kpi">SCOUT XI</span>
            <span class="story-vn-rule-desc">Veja todos os 11 de cada rival</span>
          </div>
        </div>
      `
    },
    {
      bg: UI.locRiverbank || UI.stadiumBg || "",
      chapter: "ATO I · PENEIRAS NO CAMPINHO",
      speakerIcon: raimonSrc,
      speaker: "COMISSÃO TÉCNICA",
      text: "Seu elenco começa sem reservas — mas craques sem clube disputam rachões 5x5 no Campinho! Vença esses duelos para contratar até 5 reservas.",
      visualHTML: `
        <div class="story-vn-bench-preview">
          <div class="story-vn-bench-head">
            ${campSrc ? `<img class="story-vn-camp-ico" src="${campSrc}" alt="" />` : ""}
            <div>
              <div class="story-vn-eyebrow">EXPANSÃO DE ELENCO</div>
              <h3 class="story-vn-stage-title">BANCO DE 5 RESERVAS · AGENTES LIVRES</h3>
            </div>
          </div>
          <div class="story-vn-slots-row">
            ${[1, 2, 3, 4, 5]
              .map((num) => `
                <div class="story-vn-slot-chip">
                  <span class="svsc-num">VAGA ${num}</span>
                  <span class="svsc-tag">5x5 Livre</span>
                </div>
              `)
              .join("")}
          </div>
        </div>
      `
    },
    {
      bg: UI.stadiumBg || "",
      chapter: "ATO I · REGISTRO DO CLUBE",
      speakerIcon: ffSrc,
      speaker: "DIRETOR DA FEDERAÇÃO",
      text: "Tudo pronto na federação! Batize o seu clube, escolha sua formação inicial e abra a Prancheta Tática para escalar seus 11 titulares.",
      visualHTML: `
        <div class="story-vn-contract-card">
          <div class="story-vn-visual-head" style="text-align:left;">
            <div class="story-vn-eyebrow">REGISTRO OFICIAL NA SÉRIE A</div>
            <h3 class="story-vn-stage-title">Assinatura de Clube &amp; Esquema</h3>
          </div>
          <div class="story-intro-config">
            <div class="story-config-row">
              <label for="story-intro-team-name">${raimonSrc ? `<img src="${raimonSrc}" alt="" class="inline-ui-icon" />` : ""} Nome do Seu Clube:</label>
              <input
                type="text"
                id="story-intro-team-name"
                class="draft-team-name-input"
                maxlength="28"
                placeholder="Ex: Inazuma Phoenix (padrão: Dream Team)"
                value="${escapeHtml(curName || "")}"
              />
            </div>
            <div class="story-config-row">
              <span>${formIco} Formação Inicial:</span>
              <div class="formation-pills" style="margin:0; justify-content:flex-start;">
                ${["4-3-3", "4-4-2", "3-4-3", "3-5-2"]
                  .map(
                    (f) => `<button type="button" class="form-pill ${state.formation === f ? "selected" : ""}" data-story-form="${f}">${f}</button>`
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      `
    }
  ];

  const scene = scenes[step] || scenes[0];
  const skipTypeNow = Boolean(state.storyRun._skipIntroTypeOnce);
  state.storyRun._skipIntroTypeOnce = false;

  container.innerHTML = `
    <div class="story-vn-stage">
      ${scene.bg ? `<div class="story-vn-bg" style="background-image:url('${scene.bg}');"></div>` : ""}
      <div class="story-vn-scrim"></div>
      <div class="story-vn-content">
        <div class="story-vn-topbar">
          <div class="story-vn-top-left">
            <span class="story-phase-badge">${ffIco} ${escapeHtml(scene.chapter)}</span>
            <span class="story-wip-pill">WIP</span>
            <div class="story-vn-progress" aria-label="Progresso da introdução">
              ${scenes
                .map((_, idx) => `<span class="story-vn-pip ${idx < step ? "is-done" : idx === step ? "is-active" : ""}"></span>`)
                .join("")}
            </div>
          </div>
          <div class="story-vn-top-right">
            <button type="button" class="story-vn-nav-btn" id="btn-story-back-menu">← Menu</button>
            ${
              step < 4
                ? `<button type="button" class="story-vn-nav-btn is-skip" id="btn-story-skip-intro">Pular ▶▶</button>`
                : ""
            }
          </div>
        </div>

        <div class="story-vn-visual">
          ${scene.visualHTML}
        </div>

        <div class="story-vn-dialog-box" id="story-vn-dialog-box">
          <div class="story-vn-speaker">
            ${scene.speakerIcon ? `<img src="${scene.speakerIcon}" alt="" />` : ""}
            <span>${escapeHtml(scene.speaker)}</span>
          </div>
          <p class="story-vn-text" id="story-vn-dialogue-text" data-full-text="${escapeHtml(scene.text)}">${
            skipTypeNow ? `${escapeHtml(scene.text)}` : `<span class="story-vn-caret" aria-hidden="true"></span>`
          }</p>
          <div class="story-vn-dialog-actions">
            <span class="story-vn-step-counter">${step + 1} / ${scenes.length} · Clique na caixa ou Próximo</span>
            <div class="story-vn-btn-group">
              ${
                step > 0
                  ? `<button type="button" class="ie-cmd-btn story-vn-prev-btn" id="btn-story-prev"><span>← Anterior</span></button>`
                  : ""
              }
              ${
                step < 4
                  ? `<button type="button" class="ie-cmd-btn ie-cmd-green" id="btn-story-next"><span>Próximo ▶</span></button>`
                  : `<button type="button" class="ie-cmd-btn ie-cmd-gold" id="btn-story-begin-draft">${boltIco}<span>ABRIR PRANCHETA TÁTICA ▶</span></button>`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Efeito máquina de escrever no diálogo (pula instantaneamente ao clicar ou completar)
  const textEl = document.getElementById("story-vn-dialogue-text");
  let typingDone = skipTypeNow;
  const finishTypingNow = () => {
    if (window._storyIntroTypeTimer) {
      clearInterval(window._storyIntroTypeTimer);
      window._storyIntroTypeTimer = null;
    }
    typingDone = true;
    if (textEl) textEl.textContent = scene.text;
  };

  if (!skipTypeNow && textEl && typeof setInterval === "function") {
    let charIdx = 0;
    window._storyIntroTypeTimer = setInterval(() => {
      charIdx += 1;
      if (charIdx >= scene.text.length) {
        finishTypingNow();
      } else {
        textEl.innerHTML = `${escapeHtml(scene.text.slice(0, charIdx))}<span class="story-vn-caret" aria-hidden="true"></span>`;
      }
    }, 16);
  }

  const goToStep = (nextIdx, skipAnim = false) => {
    clearStoryIntroRuntime();
    state.storyRun.introStep = Math.max(0, Math.min(4, nextIdx));
    state.storyRun._skipIntroTypeOnce = Boolean(skipAnim);
    renderStoryIntroScreen();
  };

  const nameInput = document.getElementById("story-intro-team-name");
  if (nameInput) {
    nameInput.addEventListener("input", () => {
      state.draftTeamName = nameInput.value;
    });
    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        beginStoryDraftFromIntro(nameInput.value);
      }
    });
  }

  container.querySelectorAll("[data-story-form]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.getAttribute("data-story-form");
      if (f && DB.formations?.[f]) {
        state.formation = f;
        goToStep(step, true);
      }
    });
  });

  const backBtn = document.getElementById("btn-story-back-menu");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (typeof goToMenu === "function") goToMenu();
    });
  }

  const skipBtn = document.getElementById("btn-story-skip-intro");
  if (skipBtn) {
    skipBtn.addEventListener("click", () => goToStep(4, false));
  }

  const prevBtn = document.getElementById("btn-story-prev");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => goToStep(step - 1, true));
  }

  const nextBtn = document.getElementById("btn-story-next");
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      goToStep(step + 1, false);
    });
  }

  const dialogBox = document.getElementById("story-vn-dialog-box");
  if (dialogBox) {
    dialogBox.addEventListener("click", (e) => {
      const target = e.target;
      if (target && typeof target.closest === "function" && target.closest("button, input, select, textarea, label")) {
        return;
      }
      if (!typingDone) {
        finishTypingNow();
      } else if (step < 4) {
        goToStep(step + 1, false);
      }
    });
  }

  const startBtn = document.getElementById("btn-story-begin-draft");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      beginStoryDraftFromIntro(nameInput ? nameInput.value : state.draftTeamName);
    });
  }

  if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
    const keyFn = (e) => {
      if (state.phase !== "story_intro") {
        clearStoryIntroRuntime();
        return;
      }
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        if (!typingDone) finishTypingNow();
        else if (step < 4) goToStep(step + 1, false);
        else beginStoryDraftFromIntro(nameInput ? nameInput.value : state.draftTeamName);
      } else if (e.key === "ArrowLeft" && step > 0) {
        e.preventDefault();
        goToStep(step - 1, true);
      }
    };
    window._storyIntroKeyHandler = keyFn;
    document.addEventListener("keydown", keyFn);
  }
}

// ============================================================================
// ATO II -> III: CONFIRMAÇÃO DO ELENCO NA PRANCHETA & ABERTURA DA SÉRIE A
// ============================================================================
function renderStorySquadRevealScreen() {
  const container = document.getElementById("main-screen-container");
  if (!container) return;
  clearStoryIntroRuntime();
  if (!state.storyRun) initFreshStoryIntroState();
  state.storyRun.phase = "SQUAD_REVEAL";

  if (state.draftTeamName === null || state.draftTeamName === undefined) {
    state.draftTeamName = typeof getSavedTeamName === "function" ? getSavedTeamName() : "";
  }

  const boltIco = typeof buildInazumaBoltSVG === "function" ? buildInazumaBoltSVG("inline-svg-icon") : "";
  const revealBody = `
    <div class="story-reveal-banner">
      <div class="story-reveal-copy">
        <div class="story-reveal-eyebrow">${boltIco} ELENCO FECHADO (11/11) • SÉRIE A INAZUMA</div>
        <h3>Titulares garantidos e sem clones na liga!</h3>
        <p>Seu banco começa com <strong>5 vagas abertas</strong> — vença partidas <strong>5x5 no Campinho</strong> durante a temporada para contratar reservas livres.</p>
      </div>
      <div class="story-reveal-cta-col">
        <button class="ie-cmd-btn ie-cmd-green" id="btn-start-story-league">
          <span>INICIAR SÉRIE A (10 TIMES) ▶</span>
        </button>
      </div>
    </div>

    <div class="story-reveal-controls">
      <div class="story-reveal-name-group">
        <label for="draft-team-name-input">${uiAssetIconHTML("raimonEmblem", "", "inline-ui-icon")} Clube:</label>
        <input
          type="text"
          id="draft-team-name-input"
          class="draft-team-name-input"
          maxlength="28"
          placeholder="Ex: Inazuma Phoenix"
          value="${escapeHtml(state.draftTeamName || "")}"
        />
      </div>
      <div class="story-reveal-form-row">
        <span>Formação:</span>
        <div class="formation-pills" style="margin:0;">
          ${["4-3-3", "4-4-2", "3-4-3", "3-5-2"]
            .map((f) => `<button type="button" class="form-pill ${state.formation === f ? "selected" : ""}" data-reveal-form="${f}">${f}</button>`)
            .join("")}
        </div>
      </div>
    </div>

    ${buildPitchHTML(true)}
  `;

  container.innerHTML = wrapStoryClipboardHTML(revealBody, "PRANCHETA TÁTICA • 11 TITULARES PRONTOS");

  const nameInputEl = document.getElementById("draft-team-name-input");
  if (nameInputEl) {
    nameInputEl.addEventListener("input", () => {
      state.draftTeamName = nameInputEl.value;
    });
    nameInputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        startStorySerieACampaign();
      }
    });
  }

  container.querySelectorAll("[data-reveal-form]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.getAttribute("data-reveal-form");
      if (f && typeof switchTeamFormation === "function" && switchTeamFormation(f)) {
        renderDraftScreen();
      }
    });
  });

  const goBtn = document.getElementById("btn-start-story-league");
  if (goBtn) {
    goBtn.addEventListener("click", () => {
      if (nameInputEl) state.draftTeamName = nameInputEl.value.trim();
      startStorySerieACampaign();
    });
  }

  container.querySelectorAll("[data-slot]").forEach((el) => {
    el.addEventListener("click", () => handleFieldSlotClick(el.getAttribute("data-slot")));
  });
}

// ============================================================================
// GERADOR DA SÉRIE A (10 TIMES, TURNO ÚNICO, ZERO CLONES)
// ============================================================================
function buildStoryRoundRobinSchedule(teamIds) {
  const n = teamIds.length;
  const arr = [...teamIds];
  const rounds = [];
  for (let r = 0; r < n - 1; r++) {
    const matches = [];
    for (let i = 0; i < n / 2; i++) {
      const a = arr[i];
      const b = arr[n - 1 - i];
      const swap = (r + i) % 2 === 1;
      matches.push({
        homeId: swap ? b : a,
        awayId: swap ? a : b,
        scoreH: null,
        scoreA: null,
        played: false
      });
    }
    rounds.push(matches);
    const fixed = arr[0];
    const rest = arr.slice(1);
    const last = rest.pop();
    rest.unshift(last);
    arr.splice(0, arr.length, fixed, ...rest);
  }
  return rounds;
}

function pickUniquePlayersForClub(buckets, formKey, usedKeys, targetOvr = 84) {
  const slots = DB.formations?.[formKey]?.slots || DB.formations["4-3-3"].slots;
  const roster = [];
  const pickFromRole = (role) => {
    const pool = (buckets[role] || []).filter((e) => !usedKeys.has(e.key));
    let sourcePool = pool;
    if (sourcePool.length === 0) {
      // Fallback para qualquer posição disponível sem clonar ninguém
      const allRoles = ["MF", "DF", "FW", "GK"].flatMap((r) => buckets[r] || []);
      sourcePool = allRoles.filter((e) => !usedKeys.has(e.key));
    }
    if (sourcePool.length === 0) return null;
    // Escolhe dentro de uma faixa próxima do targetOvr para gerar elencos variados e realistas
    sourcePool.sort(
      (a, b) =>
        Math.abs((a.player.ovr || 82) - targetOvr) - Math.abs((b.player.ovr || 82) - targetOvr)
    );
    const windowSize = Math.min(sourcePool.length, 10);
    const chosen = sourcePool[Math.floor(Math.random() * windowSize)];
    usedKeys.add(chosen.key);
    return {
      ...chosen.player,
      pos: chosen.player.pos || role
    };
  };

  slots.forEach((sl) => {
    const pl = pickFromRole(sl.role);
    if (pl) roster.push(pl);
  });
  return roster;
}

function startStorySerieACampaign() {
  clearTournamentTimers(false);
  resetSquadPrepBonuses();

  const chosenTeamName = typeof setSavedTeamName === "function"
    ? setSavedTeamName(
        state.draftTeamName !== undefined && state.draftTeamName !== null
          ? state.draftTeamName
          : (typeof getSavedTeamName === "function" ? getSavedTeamName() : "")
      )
    : "Dream Team";

  const usedKeys = new Set();
  Object.values(state.squad || {}).forEach((p) => {
    if (!p) return;
    const key = normalizeStoryPlayerKey(p);
    if (key) usedKeys.add(key);
  });

  // Dedup global de todos os jogadores restantes do DB
  const dedupMap = new Map();
  (DB.teams || []).forEach((tm) => {
    (tm.players || []).forEach((pl) => {
      const key = normalizeStoryPlayerKey(pl);
      if (!key || usedKeys.has(key)) return;
      const existing = dedupMap.get(key);
      if (!existing || (pl.ovr || 0) > (existing.player.ovr || 0)) {
        dedupMap.set(key, {
          key,
          player: pl,
          sourceTeamId: tm.id,
          sourceTeamName: tm.name,
          emblem: tm.emblem
        });
      }
    });
  });

  const buckets = { GK: [], DF: [], MF: [], FW: [] };
  shuffleStoryCopy([...dedupMap.values()]).forEach((entry) => {
    const pos = ["GK", "DF", "MF", "FW"].includes(entry.player.pos) ? entry.player.pos : "MF";
    buckets[pos].push(entry);
  });

  // Seleciona 9 identidades distintas de clubes rivais para formar os 10 times da Série A
  const clubIdentities = shuffleStoryCopy(
    (DB.teams || []).filter((tm) => tm && tm.id && tm.name)
  ).slice(0, 9);

  const formKeys = ["4-3-3", "4-4-2", "3-4-3", "3-5-2"];
  const targetOvrs = [90, 89, 87, 86, 85, 84, 83, 81, 80];
  const rivalLeagueTeams = clubIdentities.map((club, idx) => {
    const formKey = formKeys[idx % formKeys.length];
    const roster = pickUniquePlayersForClub(buckets, formKey, usedKeys, targetOvrs[idx] || 84);
    const avgOvr = roster.length > 0
      ? Math.round(roster.reduce((a, p) => a + (p.ovr || 80), 0) / roster.length)
      : 82;
    return {
      id: `story_${club.id}`,
      sourceTeamId: club.id,
      name: club.name,
      emblem: club.emblem || UI.ffLogo || "",
      formation: formKey,
      baseOvr: avgOvr,
      players: roster,
      isUser: false,
      pts: 0,
      p: 0,
      w: 0,
      d: 0,
      l: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      form: []
    };
  });

  // Agentes Livres reservados para peneiras 5x5 (totalmente disjuntos dos 10 clubes!)
  const remainingEntries = ["GK", "DF", "MF", "FW"]
    .flatMap((r) => buckets[r])
    .filter((e) => !usedKeys.has(e.key));

  const freeAgents = [];
  const pickFreeAgentsByPos = (pos, maxCount) => {
    const pool = remainingEntries
      .filter((e) => (e.player.pos || "MF") === pos && !usedKeys.has(e.key))
      .sort((a, b) => (b.player.ovr || 80) - (a.player.ovr || 80));
    const slice = shuffleStoryCopy(pool.slice(0, maxCount * 2)).slice(0, maxCount);
    slice.forEach((e) => {
      freeAgents.push({
        id: String(e.player.id),
        key: e.key,
        role: pos,
        sourceTeamId: e.sourceTeamId,
        sourceTeamName: "Agente Livre (Sem Clube)"
      });
    });
  };
  pickFreeAgentsByPos("GK", 10);
  pickFreeAgentsByPos("DF", 20);
  pickFreeAgentsByPos("MF", 24);
  pickFreeAgentsByPos("FW", 18);

  const userAvgOvr = calcSquadStats().ovr || 84;
  const userClubEntry = {
    id: "story_user",
    name: chosenTeamName,
    emblem: UI.raimonEmblem || "",
    formation: state.formation || "4-3-3",
    baseOvr: userAvgOvr,
    isUser: true,
    pts: 0,
    p: 0,
    w: 0,
    d: 0,
    l: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    form: []
  };

  const allLeagueTeams = [userClubEntry, ...rivalLeagueTeams];
  const teamIds = allLeagueTeams.map((t) => t.id);
  const schedule = buildStoryRoundRobinSchedule(teamIds);
  const teamsById = Object.fromEntries(allLeagueTeams.map((t) => [t.id, t]));

  const stages = schedule.map((roundMatches, rIdx) => {
    const userMatch = roundMatches.find((m) => m.homeId === "story_user" || m.awayId === "story_user");
    const oppId = userMatch.homeId === "story_user" ? userMatch.awayId : userMatch.homeId;
    const oppTeam = teamsById[oppId] || rivalLeagueTeams[0];
    return createTournamentStage({
      stageName: `Rodada ${rIdx + 1} · Série A`,
      oppTeam,
      competition: "SERIE_A",
      ovrBoost: 0,
      oppBuffPct: rIdx * 4,
      oppLevel: Math.min(10, 1 + rIdx),
      isStoryLeague: true,
      allowDraw: true,
      storyRoundIdx: rIdx
    });
  });

  if (!state.storyRun) initFreshStoryIntroState();
  state.storyRun.phase = "SERIE_A";
  state.storyRun.bench = [];
  state.storyRun.usedFullNames = [...usedKeys];
  state.storyRun.leagueFullNames = [...usedKeys];
  state.storyRun.freeAgentPool = freeAgents;
  state.storyRun.league = {
    roundIndex: 0,
    teams: allLeagueTeams,
    schedule,
    playerStats: {},
    lastRoundResults: [],
    lastUserMatchRatings: [],
    activeStatsTab: "ratings"
  };

  state.phase = "tournament";
  state.tournament = {
    ...createFreshTournamentState(),
    rankingTeamName: chosenTeamName,
    stages
  };

  openBetweenMatchPrep(0);
}

// ============================================================================
// SISTEMA DE NOTAS (0.0 A 10.0) & SIMULAÇÃO DE RODADA DA SÉRIE A
// ============================================================================
function computePlayerMatchRating({
  role = "MF",
  goals = 0,
  assists = 0,
  passesOk = 0,
  passesTry = 0,
  dribblesOk = 0,
  steals = 0,
  blocks = 0,
  saves = 0,
  teamGF = 0,
  teamGA = 0
}) {
  let score = 6.0;
  if (teamGF > teamGA) score += 0.4;
  else if (teamGF === teamGA) score += 0.1;
  else score -= 0.3;

  score += (goals || 0) * 1.15;
  score += (assists || 0) * 0.85;
  score += ((steals || 0) + (blocks || 0)) * 0.34;
  score += (dribblesOk || 0) * 0.24;

  const pTry = Math.max(0, passesTry || 0);
  const pOk = Math.max(0, passesOk || 0);
  if (pTry >= 2) {
    const acc = pOk / pTry;
    score += Math.min(0.85, acc * 0.55 + Math.min(6, pOk) * 0.05);
  }

  if (role === "GK") {
    score += Math.min(2.6, (saves || 0) * 0.62);
    if (teamGA === 0) score += 0.9;
    else score -= Math.min(1.8, teamGA * 0.45);
  } else if (role === "DF") {
    if (teamGA === 0) score += 0.55;
    else if (teamGA >= 2) score -= Math.min(0.8, (teamGA - 1) * 0.25);
  }

  const clamped = Math.max(3.5, Math.min(10.0, score));
  return Number(clamped.toFixed(1));
}

function getRatingBadgeClass(rating) {
  const r = Number(rating) || 6.0;
  if (r >= 8.5) return "is-elite";
  if (r >= 7.5) return "is-great";
  if (r >= 6.5) return "is-good";
  return "is-low";
}

function recordPlayerLeagueStats(league, entry) {
  if (!league || !entry || !entry.id) return;
  if (!league.playerStats) league.playerStats = {};
  const pid = String(entry.id);
  const prev = league.playerStats[pid] || {
    id: pid,
    name: entry.name,
    sprite: entry.sprite || "",
    role: entry.role || "MF",
    teamId: entry.teamId || "",
    teamName: entry.teamName || "",
    teamEmblem: entry.teamEmblem || "",
    isUser: Boolean(entry.isUser),
    matches: 0,
    goals: 0,
    assists: 0,
    steals: 0,
    saves: 0,
    cleanSheets: 0,
    goalsConceded: 0,
    ratingSum: 0,
    avgRating: 0,
    bestRating: 0,
    lastRating: 6.0
  };
  prev.matches += 1;
  prev.goals += entry.goals || 0;
  prev.assists += entry.assists || 0;
  prev.steals += (entry.steals || 0) + (entry.blocks || 0);
  prev.saves += entry.saves || 0;
  if (entry.role === "GK") {
    if ((entry.teamGA || 0) === 0) prev.cleanSheets += 1;
    prev.goalsConceded += entry.teamGA || 0;
  }
  const rVal = Number(entry.rating) || 6.0;
  prev.ratingSum = Number((prev.ratingSum + rVal).toFixed(2));
  prev.avgRating = Number((prev.ratingSum / Math.max(1, prev.matches)).toFixed(2));
  prev.bestRating = Math.max(prev.bestRating || 0, rVal);
  prev.lastRating = rVal;
  if (entry.isUser) {
    prev.isUser = true;
    prev.teamId = "story_user";
    prev.teamName = entry.teamName || prev.teamName;
    prev.teamEmblem = entry.teamEmblem || prev.teamEmblem;
  }
  league.playerStats[pid] = prev;
}

function applyMatchScoreToTableRow(row, gf, ga) {
  if (!row) return;
  row.p = (row.p || 0) + 1;
  row.gf = (row.gf || 0) + gf;
  row.ga = (row.ga || 0) + ga;
  row.gd = row.gf - row.ga;
  if (gf > ga) {
    row.w = (row.w || 0) + 1;
    row.pts = (row.pts || 0) + 3;
    row.form = [...(row.form || []).slice(-4), "W"];
  } else if (gf === ga) {
    row.d = (row.d || 0) + 1;
    row.pts = (row.pts || 0) + 1;
    row.form = [...(row.form || []).slice(-4), "D"];
  } else {
    row.l = (row.l || 0) + 1;
    row.form = [...(row.form || []).slice(-4), "L"];
  }
}

function sortStoryLeagueStandings(teams) {
  if (!Array.isArray(teams)) return [];
  return teams.sort(
    (a, b) =>
      (b.pts || 0) - (a.pts || 0) ||
      (b.w || 0) - (a.w || 0) ||
      (b.gd || 0) - (a.gd || 0) ||
      (b.gf || 0) - (a.gf || 0) ||
      (b.isUser ? 1 : 0) - (a.isUser ? 1 : 0)
  );
}

function simulateClubPlayerStatsForAiTeam(league, teamRow, gf, ga) {
  const roster = Array.isArray(teamRow?.players) ? teamRow.players : [];
  if (roster.length === 0) return;

  const fwPool = roster.filter((p) => p.pos === "FW");
  const mfPool = roster.filter((p) => p.pos === "MF");
  const dfPool = roster.filter((p) => p.pos === "DF");
  const gkPlayer = roster.find((p) => p.pos === "GK") || roster[0];

  const goalsBy = {};
  const assistsBy = {};
  const stealsBy = {};
  const savesBy = {};

  const pickWeighted = (arr) => {
    if (!arr || arr.length === 0) return roster[Math.floor(Math.random() * roster.length)];
    return arr[Math.floor(Math.random() * arr.length)];
  };

  for (let g = 0; g < gf; g++) {
    const scorerPool = fwPool.length && Math.random() < 0.72 ? fwPool : mfPool.length ? mfPool : roster;
    const sc = pickWeighted(scorerPool);
    if (sc) goalsBy[sc.id] = (goalsBy[sc.id] || 0) + 1;
    if (Math.random() < 0.75) {
      const assPool = [...mfPool, ...fwPool].filter((x) => x.id !== sc?.id);
      const as = pickWeighted(assPool);
      if (as) assistsBy[as.id] = (assistsBy[as.id] || 0) + 1;
    }
  }

  const teamSteals = 4 + Math.floor(Math.random() * 6);
  for (let s = 0; s < teamSteals; s++) {
    const stPool = dfPool.length && Math.random() < 0.65 ? dfPool : mfPool;
    const st = pickWeighted(stPool);
    if (st) stealsBy[st.id] = (stealsBy[st.id] || 0) + 1;
  }

  if (gkPlayer) {
    savesBy[gkPlayer.id] = Math.max(1, 2 + Math.floor(Math.random() * 5) - Math.floor(ga * 0.4));
  }

  roster.forEach((p) => {
    const role = p.pos || "MF";
    const g = goalsBy[p.id] || 0;
    const a = assistsBy[p.id] || 0;
    const st = stealsBy[p.id] || 0;
    const sv = savesBy[p.id] || 0;
    const passesTry = role === "GK" ? 3 : 5 + Math.floor(Math.random() * 6);
    const passesOk = Math.round(passesTry * (0.68 + Math.random() * 0.25));
    const dribblesOk = role === "FW" || role === "MF" ? Math.floor(Math.random() * 3) : 0;
    const rating = computePlayerMatchRating({
      role,
      goals: g,
      assists: a,
      passesOk,
      passesTry,
      dribblesOk,
      steals: st,
      blocks: 0,
      saves: sv,
      teamGF: gf,
      teamGA: ga
    });
    recordPlayerLeagueStats(league, {
      id: p.id,
      name: p.name,
      sprite: p.sprite || "",
      role,
      teamId: teamRow.id,
      teamName: teamRow.name,
      teamEmblem: teamRow.emblem,
      isUser: false,
      goals: g,
      assists: a,
      steals: st,
      blocks: 0,
      saves: sv,
      teamGF: gf,
      teamGA: ga,
      rating
    });
  });
}

function finalizeStoryLeagueRound(st) {
  if (!st || !st.isStoryLeague || st._storyRecorded) return;
  const sr = state.storyRun;
  const league = sr?.league;
  if (!sr || !league) return;

  st._storyRecorded = true;
  const rIdx = typeof st.storyRoundIdx === "number" ? st.storyRoundIdx : (league.roundIndex || 0);
  const roundMatches = league.schedule?.[rIdx] || [];
  const teamsById = Object.fromEntries((league.teams || []).map((tm) => [tm.id, tm]));
  const userRow = teamsById["story_user"];
  const userTeamDisp = typeof getActiveTeamName === "function" ? getActiveTeamName() : (userRow?.name || "Dream Team");
  if (userRow) userRow.name = userTeamDisp;

  const uGF = Number(st.userScore) || 0;
  const uGA = Number(st.oppScore) || 0;

  // 1) Calcula Notas (0.0 a 10.0) dos 11 titulares do usuário
  const rawPlayerStats = Object.values(st.pitch?.stats?.playerStats || {});
  const gkSavesFallback = Number(st.pitch?.stats?.userSaves) || 0;
  const userRatings = rawPlayerStats.map((ps) => {
    const role = ps.role || "MF";
    const saves = role === "GK" ? Math.max(ps.saves || 0, gkSavesFallback) : (ps.saves || 0);
    const rating = computePlayerMatchRating({
      role,
      goals: ps.goals || 0,
      assists: ps.assists || 0,
      passesOk: ps.passesOk || 0,
      passesTry: ps.passesTry || 0,
      dribblesOk: ps.dribblesOk || 0,
      steals: ps.steals || 0,
      blocks: ps.blocks || 0,
      saves,
      teamGF: uGF,
      teamGA: uGA
    });
    const entry = {
      id: ps.id,
      name: ps.name,
      sprite: ps.sprite || (typeof getPlayerFormSprite === "function" ? getPlayerFormSprite(ps, role) : ""),
      role,
      teamId: "story_user",
      teamName: userTeamDisp,
      teamEmblem: UI.raimonEmblem || "",
      isUser: true,
      goals: ps.goals || 0,
      assists: ps.assists || 0,
      steals: (ps.steals || 0) + (ps.blocks || 0),
      saves,
      dribblesOk: ps.dribblesOk || 0,
      teamGF: uGF,
      teamGA: uGA,
      rating
    };
    recordPlayerLeagueStats(league, entry);
    return entry;
  }).sort((a, b) => b.rating - a.rating);

  st.storyPlayerRatings = userRatings;
  league.lastUserMatchRatings = userRatings;

  // 2) Registra os stats do time adversário do jogo do usuário (para artilharia/notas justas na liga!)
  const userOppRow = teamsById[st.oppTeam?.id];
  if (userOppRow) {
    simulateClubPlayerStatsForAiTeam(league, userOppRow, uGA, uGF);
  }

  // 3) Atualiza tabela para o confronto do usuário e simula os outros 4 jogos da rodada
  const roundResults = [];
  roundMatches.forEach((m) => {
    if (m.homeId === "story_user" || m.awayId === "story_user") {
      const userIsHome = m.homeId === "story_user";
      m.scoreH = userIsHome ? uGF : uGA;
      m.scoreA = userIsHome ? uGA : uGF;
      m.played = true;
      applyMatchScoreToTableRow(userRow, uGF, uGA);
      applyMatchScoreToTableRow(userOppRow, uGA, uGF);
      const hTeam = teamsById[m.homeId];
      const aTeam = teamsById[m.awayId];
      roundResults.push({
        homeName: hTeam?.name || userTeamDisp,
        homeEmblem: hTeam?.emblem || "",
        awayName: aTeam?.name || st.oppTeam?.name || "Rival",
        awayEmblem: aTeam?.emblem || "",
        scoreH: m.scoreH,
        scoreA: m.scoreA,
        involvesUser: true
      });
    } else if (!m.played) {
      const hTeam = teamsById[m.homeId];
      const aTeam = teamsById[m.awayId];
      const hOvr = hTeam?.baseOvr || 84;
      const aOvr = aTeam?.baseOvr || 84;
      const diff = (hOvr - aOvr) * 0.08 + 0.15;
      const expH = Math.max(0.35, Math.min(3.4, 1.35 + diff + (Math.random() - 0.5) * 1.4));
      const expA = Math.max(0.30, Math.min(3.2, 1.25 - diff + (Math.random() - 0.5) * 1.4));
      const scoreH = Math.min(5, Math.max(0, Math.round(expH + (Math.random() - 0.45) * 1.1)));
      const scoreA = Math.min(5, Math.max(0, Math.round(expA + (Math.random() - 0.45) * 1.1)));
      m.scoreH = scoreH;
      m.scoreA = scoreA;
      m.played = true;
      applyMatchScoreToTableRow(hTeam, scoreH, scoreA);
      applyMatchScoreToTableRow(aTeam, scoreA, scoreH);
      simulateClubPlayerStatsForAiTeam(league, hTeam, scoreH, scoreA);
      simulateClubPlayerStatsForAiTeam(league, aTeam, scoreA, scoreH);
      roundResults.push({
        homeName: hTeam?.name || "Clube",
        homeEmblem: hTeam?.emblem || "",
        awayName: aTeam?.name || "Clube",
        awayEmblem: aTeam?.emblem || "",
        scoreH,
        scoreA,
        involvesUser: false
      });
    }
  });

  league.lastRoundResults = roundResults;
  sortStoryLeagueStandings(league.teams);
  league.roundIndex = Math.min(9, rIdx + 1);
  if (rIdx >= 8) {
    sr.phase = "SEASON_END";
  }
}

// ============================================================================
// BANCO DE 5 RESERVAS VIA 5x5 AGENTES LIVRES & TROCAS NO ELENCO
// ============================================================================
function getStoryFreeAgent5v5Candidates() {
  const sr = state.storyRun;
  if (!sr) return null;
  const idx = typeof buildPlayerLookupIndex === "function" ? buildPlayerLookupIndex() : null;
  if (!idx) return null;

  const takenKeys = new Set(
    [
      ...Object.values(state.squad || {}),
      ...(sr.bench || [])
    ]
      .filter(Boolean)
      .map((p) => normalizeStoryPlayerKey(p))
  );
  (sr.leagueFullNames || []).forEach((k) => takenKeys.add(k));

  const hydrated = [];
  (sr.freeAgentPool || []).forEach((fa) => {
    const p = idx.byId.get(String(fa.id));
    if (!p) return;
    const key = normalizeStoryPlayerKey(p);
    if (!key || takenKeys.has(key)) return;
    hydrated.push({
      player: p,
      role: p.pos || fa.role || "MF",
      teamId: "free_agent",
      teamName: "Agente Livre (Sem Clube)",
      emblem: UI.campinhoBg || UI.ffLogo || ""
    });
  });

  if (hydrated.length >= 10) return hydrated;

  // Fallback seguro sem repetir ninguém da liga nem do usuário
  (DB.teams || []).forEach((tm) => {
    (tm.players || []).forEach((p) => {
      const key = normalizeStoryPlayerKey(p);
      if (key && !takenKeys.has(key)) {
        takenKeys.add(key);
        hydrated.push({
          player: p,
          role: p.pos || "MF",
          teamId: "free_agent",
          teamName: "Agente Livre (Sem Clube)",
          emblem: UI.ffLogo || ""
        });
      }
    });
  });
  return hydrated;
}

function recruitFreeAgentToBench(starRecruit, replaceBenchIdx = null) {
  const t = state.tournament;
  const prep = t?.prep;
  const sr = state.storyRun;
  if (!sr || !prep || !starRecruit) return;
  if (!Array.isArray(sr.bench)) sr.bench = [];

  const targetRole = starRecruit.player?.pos || starRecruit.role || "MF";
  const recruitLvl = Math.max(getStorySquadAvgLevel(), 1);
  const newP = cloneFreshPlayerForSquad(
    starRecruit.player,
    { id: "free_agent", name: "Agente Livre (Sem Clube)", emblem: UI.ffLogo || "" },
    recruitLvl
  );
  checkAndLearnLevelMoves(newP, targetRole);
  if (starRecruit.previewKeshin) {
    newP.keshin = { ...starRecruit.previewKeshin };
  }

  let replacedName = "";
  if (typeof replaceBenchIdx === "number" && replaceBenchIdx >= 0 && replaceBenchIdx < sr.bench.length) {
    replacedName = sr.bench[replaceBenchIdx]?.name || "reserva";
    sr.bench[replaceBenchIdx] = newP;
  } else if (sr.bench.length < 5) {
    sr.bench.push(newP);
  } else {
    replacedName = sr.bench[4]?.name || "reserva";
    sr.bench[4] = newP;
  }

  const rKey = normalizeStoryPlayerKey(newP);
  if (rKey && Array.isArray(sr.usedFullNames) && !sr.usedFullNames.includes(rKey)) {
    sr.usedFullNames.push(rKey);
  }
  if (Array.isArray(sr.freeAgentPool)) {
    sr.freeAgentPool = sr.freeAgentPool.filter((fa) => String(fa.id) !== String(starRecruit.player?.id));
  }

  const newPwr = calcIndividualPlayerPower(newP, targetRole, recruitLvl);
  prep.phase = "DONE";
  prep.recruitCandidate = null;
  prep.appliedMsg = replacedName
    ? `⭐ CONTRATAÇÃO PARA O BANCO! ${newP.name} (OVR ${newP.ovr} • Poder ${newPwr}) assumiu a vaga de ${replacedName} (${sr.bench.length}/5)!`
    : `⭐ CONTRATAÇÃO PARA O BANCO! O agente livre ${newP.name} (OVR ${newP.ovr} • Poder ${newPwr}) fechou contrato e ocupa a vaga ${sr.bench.length}/5 do banco!`;
  if (t.prepBonuses?.log) t.prepBonuses.log.push(`Banco 5x5: ${newP.name} (${sr.bench.length}/5)`);
  if (typeof saveActiveRunProgress === "function") saveActiveRunProgress();
  renderAll();
}

function swapStarterWithBench(slotId, benchIdx) {
  const sr = state.storyRun;
  if (!sr || !Array.isArray(sr.bench)) return false;
  const starter = state.squad?.[slotId];
  const benchP = sr.bench[benchIdx];
  if (!starter || !benchP) return false;

  state.squad[slotId] = benchP;
  sr.bench[benchIdx] = starter;
  const tac = typeof getTactics === "function" ? getTactics() : null;
  if (tac) {
    if (tac.captainPlayerId === starter.id) tac.captainPlayerId = benchP.id;
    if (tac.acePlayerId === starter.id) tac.acePlayerId = benchP.id;
  }
  state.swapSlotId = null;
  state.swapBenchIdx = null;
  if (typeof saveActiveRunProgress === "function") saveActiveRunProgress();
  return true;
}

function buildStoryBenchSectionHTML() {
  if (typeof isStoryMode !== "function" || !isStoryMode() || !state.storyRun) return "";
  const bench = Array.isArray(state.storyRun.bench) ? state.storyRun.bench : [];
  const slotsCards = [];
  for (let i = 0; i < 5; i++) {
    const bp = bench[i];
    if (!bp) {
      slotsCards.push(`
        <div class="story-bench-card is-empty">
          <div class="story-bench-empty-idx">VAGA ${i + 1}/5</div>
          <span>Recrute no 5x5 do Campinho</span>
        </div>
      `);
    } else {
      const pLvl = typeof getPlayerLevel === "function" ? getPlayerLevel(bp) : 1;
      const isSelected = state.swapBenchIdx === i;
      const moveName = typeof getPrimaryMoveForRole === "function" ? getPrimaryMoveForRole(bp, bp.pos || "MF") : (bp.hissatsu || "");
      slotsCards.push(`
        <button type="button" class="story-bench-card ${isSelected ? "is-swap-selected" : ""}" data-story-bench-idx="${i}">
          <img class="story-bench-avatar" src="${getPlayerFormSprite(bp, bp.pos || "MF")}" alt="${escapeHtml(bp.name)}" />
          <div class="story-bench-info">
            <div class="story-bench-name">${posIconHTML(bp.pos || "MF", true)} <span>${escapeHtml(bp.name)}</span></div>
            <div class="story-bench-meta">OVR ${bp.ovr} • Nv.${pLvl}${bp.keshin ? ` • ⚡ ${escapeHtml(bp.keshin.name)}` : ""}</div>
            ${moveName ? `<div class="story-bench-move">${escapeHtml(moveName)}</div>` : ""}
          </div>
        </button>
      `);
    }
  }
  return `
    <div class="story-bench-section" id="story-bench-section">
      <div class="story-bench-head">
        <span>Banco de Reservas (${bench.length}/5)</span>
        <small>${bench.length > 0 ? "Clique em um reserva e depois em um titular acima para trocar" : "Vença desafios 5x5 no Campinho para preencher suas 5 vagas"}</small>
      </div>
      <div class="story-bench-grid" id="story-bench-grid">
        ${slotsCards.join("")}
      </div>
    </div>
  `;
}

// ============================================================================
// HUB DA SÉRIE A, TABELA (10), CENTRAL DE ESTATÍSTICAS (5 ABAS) & SCOUT (11)
// ============================================================================
function getUserStoryRank(league) {
  const teams = league?.teams || [];
  const idx = teams.findIndex((tm) => tm.isUser);
  return idx >= 0 ? idx + 1 : 1;
}

function buildStoryLeagueHubBarHTML(t) {
  if (typeof isStoryMode !== "function" || !isStoryMode() || !state.storyRun?.league) return "";
  const league = state.storyRun.league;
  const roundIdx = Math.min(8, t?.prep ? t.prep.nextStageIdx : (league.roundIndex || 0));
  const rank = getUserStoryRank(league);
  const userRow = (league.teams || []).find((tm) => tm.isUser) || { pts: 0, w: 0, d: 0, l: 0 };
  const benchCount = Array.isArray(state.storyRun.bench) ? state.storyRun.bench.length : 0;
  const zoneLabel = rank <= 2 ? "Zona Direta Mundial" : rank <= 4 ? "Zona Play-In Mundial" : "Fora do G-4";
  const zoneCls = rank <= 2 ? "is-g2" : rank <= 4 ? "is-g4" : "is-out";
  const ffIco = typeof ffLogoIconHTML === "function" ? ffLogoIconHTML("inline-ui-icon") : "";
  const formIco = typeof formationIconHTML === "function" ? formationIconHTML("inline-ui-icon") : "";

  return `
    <div class="story-league-bar">
      <div class="story-league-bar-left">
        <div class="story-league-eyebrow">
          ${ffIco} <span>SÉRIE A INAZUMA • RODADA ${roundIdx + 1} DE 9</span>
          <span class="story-wip-pill">WIP</span>
        </div>
        <div class="story-league-pos-row">
          <span class="story-rank-chip ${zoneCls}">${rank}º Lugar • ${userRow.pts || 0} pts</span>
          <span class="story-record-txt">${userRow.w || 0}V ${userRow.d || 0}E ${userRow.l || 0}D</span>
          <span class="story-zone-txt ${zoneCls}">${zoneLabel}</span>
        </div>
      </div>
      <div class="story-league-bar-actions">
        <button type="button" class="ie-cmd-btn ie-cmd-blue story-hub-btn" id="btn-open-story-table">
          <span>Tabela (10)</span>
        </button>
        <button type="button" class="ie-cmd-btn ie-cmd-gold story-hub-btn" id="btn-open-story-stats">
          <span>Estatísticas &amp; Notas</span>
        </button>
        <button type="button" class="ie-cmd-btn story-hub-btn is-slate" id="btn-open-story-scout">
          <span>${formIco} Scout (11)</span>
        </button>
        <button type="button" class="ie-cmd-btn story-hub-btn is-emerald" id="btn-open-story-bench">
          <span>Banco (${benchCount}/5)</span>
        </button>
      </div>
    </div>
  `;
}

function buildStoryTableModalBodyHTML(league) {
  const teams = sortStoryLeagueStandings([...(league?.teams || [])]);
  const rowsHTML = teams
    .map((tm, idx) => {
      const rank = idx + 1;
      const cls = [
        tm.isUser ? "is-user-row" : "",
        rank <= 2 ? "is-g2" : rank <= 4 ? "is-g4" : "is-out"
      ]
        .filter(Boolean)
        .join(" ");
      const gdStr = (tm.gd || 0) > 0 ? `+${tm.gd}` : String(tm.gd || 0);
      return `
        <tr class="${cls}">
          <td class="pos-col">${rank}º</td>
          <td class="team-col">
            ${tm.emblem ? `<img src="${tm.emblem}" alt="" />` : ""}
            <span>${escapeHtml(tm.name)}</span>
          </td>
          <td class="num pts-col">${tm.pts || 0}</td>
          <td class="num">${tm.p || 0}</td>
          <td class="num">${tm.w || 0}</td>
          <td class="num">${tm.d || 0}</td>
          <td class="num">${tm.l || 0}</td>
          <td class="num">${tm.gf || 0}</td>
          <td class="num">${tm.ga || 0}</td>
          <td class="num">${gdStr}</td>
        </tr>
      `;
    })
    .join("");

  const lastRes = Array.isArray(league?.lastRoundResults) ? league.lastRoundResults : [];
  const resultsHTML = lastRes.length > 0
    ? `
      <div class="story-last-results">
        <div class="story-subhead">Resultados da Última Rodada</div>
        <div class="story-results-grid">
          ${lastRes
            .map(
              (r) => `
            <div class="story-res-card ${r.involvesUser ? "is-user" : ""}">
              <span class="src-team">${r.homeEmblem ? `<img src="${r.homeEmblem}" alt="" />` : ""}${escapeHtml(r.homeName)}</span>
              <strong>${r.scoreH} × ${r.scoreA}</strong>
              <span class="src-team is-right">${escapeHtml(r.awayName)}${r.awayEmblem ? `<img src="${r.awayEmblem}" alt="" />` : ""}</span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
    : "";

  return `
    <div class="story-zone-legend">
      <span><i class="dot-g2"></i> 1º–2º Direto Mundial de Clubes</span>
      <span><i class="dot-g4"></i> 3º–4º Play-In Mundial (Jogo Único)</span>
    </div>
    <div class="world-group-table-wrap">
      <table class="world-group-table story-league-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Clube</th>
            <th class="num">P</th>
            <th class="num">J</th>
            <th class="num">V</th>
            <th class="num">E</th>
            <th class="num">D</th>
            <th class="num">GP</th>
            <th class="num">GC</th>
            <th class="num">SG</th>
          </tr>
        </thead>
        <tbody>${rowsHTML}</tbody>
      </table>
    </div>
    ${resultsHTML}
  `;
}

function buildStoryStatsRowsHTML(league, tabKey) {
  const all = Object.values(league?.playerStats || {});
  if (all.length === 0) {
    return `<div class="story-empty-stats">Jogue a Rodada 1 para gerar as estatísticas oficiais e notas (0.0 a 10.0) da Série A!</div>`;
  }

  let sorted = [];
  let metricHeader = "";
  let getMetricHTML = (p) => "";

  if (tabKey === "goals") {
    sorted = all.filter((p) => p.goals > 0).sort((a, b) => b.goals - a.goals || b.avgRating - a.avgRating);
    if (sorted.length === 0) sorted = all.slice().sort((a, b) => b.goals - a.goals || b.avgRating - a.avgRating);
    metricHeader = "Gols";
    getMetricHTML = (p) => `<strong style="color:#4ade80;">${p.goals} ${p.goals === 1 ? "gol" : "gols"}</strong>`;
  } else if (tabKey === "assists") {
    sorted = all.filter((p) => p.assists > 0).sort((a, b) => b.assists - a.assists || b.avgRating - a.avgRating);
    if (sorted.length === 0) sorted = all.slice().sort((a, b) => b.assists - a.assists || b.avgRating - a.avgRating);
    metricHeader = "Assistências";
    getMetricHTML = (p) => `<strong style="color:#93c5fd;">${p.assists} assist.</strong>`;
  } else if (tabKey === "gk") {
    sorted = all
      .filter((p) => p.role === "GK" || p.saves > 0)
      .sort((a, b) => (b.cleanSheets * 3 + b.saves - b.goalsConceded * 0.5) - (a.cleanSheets * 3 + a.saves - a.goalsConceded * 0.5) || b.avgRating - a.avgRating);
    metricHeader = "Defesas / SG";
    getMetricHTML = (p) => `<strong style="color:#fde047;">${p.saves} def · ${p.cleanSheets} s/ gol</strong>`;
  } else if (tabKey === "steals") {
    sorted = all.filter((p) => p.steals > 0).sort((a, b) => b.steals - a.steals || b.avgRating - a.avgRating);
    if (sorted.length === 0) sorted = all.slice().sort((a, b) => b.steals - a.steals || b.avgRating - a.avgRating);
    metricHeader = "Roubos";
    getMetricHTML = (p) => `<strong style="color:#38bdf8;">${p.steals} roubos</strong>`;
  } else {
    sorted = all.slice().sort((a, b) => b.avgRating - a.avgRating || b.bestRating - a.bestRating);
    metricHeader = "Nota Média";
    getMetricHTML = (p) => `<span class="recap-rating-chip ${getRatingBadgeClass(p.avgRating)}">${p.avgRating.toFixed(1)}</span>`;
  }

  return sorted
    .slice(0, 15)
    .map((p, idx) => `
      <div class="story-stats-row ${p.isUser ? "is-user" : ""}">
        <span class="ssr-rank">${idx + 1}º</span>
        ${p.sprite ? `<img class="ssr-avatar" src="${p.sprite}" alt="${escapeHtml(p.name)}" />` : ""}
        <div class="ssr-info">
          <div class="ssr-name">${posIconHTML(p.role || "MF", true)} <span>${escapeHtml(p.name)}</span></div>
          <div class="ssr-team">${p.teamEmblem ? `<img src="${p.teamEmblem}" alt="" />` : ""} <span>${escapeHtml(p.teamName || "Clube")}</span> · ${p.matches}J</div>
        </div>
        <div class="ssr-metric" aria-label="${metricHeader}">
          ${getMetricHTML(p)}
          <small>Média ${p.avgRating.toFixed(1)}</small>
        </div>
      </div>
    `)
    .join("");
}

function buildStoryFullScoutBodyHTML(t) {
  const focusIdx = t?.prep ? t.prep.nextStageIdx : (t?.stageIndex || 0);
  const nextStage = t?.stages?.[focusIdx];
  const oppTeam = nextStage?.oppTeam;
  if (!oppTeam) return `<div class="story-empty-stats">Nenhum adversário pendente.</div>`;

  const evolved = getEvolvedOpponentRoster(oppTeam, focusIdx);
  const oppStats = calcOpponentStats(oppTeam, focusIdx);
  const lineupCards = (evolved.formSlots || []).map((slot) => {
    const p = evolved.assignments?.[slot.id];
    if (!p) return "";
    const effOvr = getEffectiveOvr(p, slot.role, true);
    const moveName = typeof getPrimaryMoveForRole === "function" ? getPrimaryMoveForRole(p, slot.role) : (p.hissatsu || "Jogada Direta");
    return `
      <div class="story-scout-player-card">
        <img src="${getPlayerFormSprite(p, slot.role)}" alt="${escapeHtml(p.name)}" />
        <div class="sspc-body">
          <div class="sspc-top">
            ${posIconHTML(slot.role, true)}
            ${elemIconHTML(p.element, "inline-elem-icon")}
            <strong title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</strong>
          </div>
          <div class="sspc-meta">OVR ${effOvr} · ${slot.label}</div>
          <div class="sspc-move">${escapeHtml(moveName)}</div>
          ${p.keshin ? `<div class="sspc-keshin">⚡ ${escapeHtml(p.keshin.name)}</div>` : ""}
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="story-scout-modal-head">
      ${oppTeam.emblem ? `<img src="${oppTeam.emblem}" alt="" />` : ""}
      <div>
        <div style="font-size:0.7rem; color:#facc15; font-weight:900;">${escapeHtml(nextStage.stageName)} • Nv.${oppStats.oppLevel || 1} • Formação ${escapeHtml(oppTeam.formation || "4-3-3")}</div>
        <strong style="font-size:1.05rem; color:#fff;">${escapeHtml(oppTeam.name)}</strong>
        <div style="font-size:0.74rem; color:#cbd5e1;">ATQ ${oppStats.atk} · MEI ${oppStats.mid} · DEF ${oppStats.def} · OVR ${oppStats.ovr} · Poder ${oppStats.power.toLocaleString("pt-BR")}</div>
      </div>
    </div>
    <div class="story-subhead" style="margin-top:10px;">Escalação Completa (11 Titulares Únicos)</div>
    <div class="story-scout-xi-grid">
      ${lineupCards}
    </div>
  `;
}

function buildStoryModalsHTML(t) {
  if (typeof isStoryMode !== "function" || !isStoryMode() || !state.storyRun?.league) return "";
  const league = state.storyRun.league;
  const activeTab = league.activeStatsTab || "ratings";

  return `
    <div class="live-tactics-modal-backdrop" id="story-table-modal">
      <div class="live-tactics-modal-card story-modal-card">
        <div class="live-tactics-modal-head">
          <div>
            <div style="font-size:0.66rem; font-weight:900; color:#facc15; text-transform:uppercase;">Série A Inazuma • Turno Único (10 Clubes)</div>
            <h4 style="margin:0; font-size:1rem; font-weight:900; color:#fff;">Classificação &amp; Rodada</h4>
          </div>
          <button type="button" class="ie-cmd-btn" id="btn-close-story-table" style="padding:5px 12px; font-size:0.74rem; background:#334155;"><span>Fechar ✕</span></button>
        </div>
        <div id="story-table-modal-body">${buildStoryTableModalBodyHTML(league)}</div>
      </div>
    </div>

    <div class="live-tactics-modal-backdrop" id="story-stats-modal">
      <div class="live-tactics-modal-card story-modal-card">
        <div class="live-tactics-modal-head">
          <div>
            <div style="font-size:0.66rem; font-weight:900; color:#facc15; text-transform:uppercase;">Central de Estatísticas • Série A</div>
            <h4 style="margin:0; font-size:1rem; font-weight:900; color:#fff;">Líderes da Liga &amp; Notas 0–10</h4>
          </div>
          <button type="button" class="ie-cmd-btn" id="btn-close-story-stats" style="padding:5px 12px; font-size:0.74rem; background:#334155;"><span>Fechar ✕</span></button>
        </div>
        <div class="story-stats-tabs">
          ${[
            ["ratings", "Maiores Notas (0–10)"],
            ["goals", "Artilharia"],
            ["assists", "Assistências"],
            ["gk", "Goleiros"],
            ["steals", "Roubos de Bola"]
          ]
            .map(([k, lbl]) => `<button type="button" class="story-stats-tab ${activeTab === k ? "is-active" : ""}" data-story-stats-tab="${k}">${lbl}</button>`)
            .join("")}
        </div>
        <div class="story-stats-list" id="story-stats-modal-body">${buildStoryStatsRowsHTML(league, activeTab)}</div>
      </div>
    </div>

    <div class="live-tactics-modal-backdrop" id="story-scout-modal">
      <div class="live-tactics-modal-card story-modal-card">
        <div class="live-tactics-modal-head">
          <div>
            <div style="font-size:0.66rem; font-weight:900; color:#facc15; text-transform:uppercase;">Departamento de Análise</div>
            <h4 style="margin:0; font-size:1rem; font-weight:900; color:#fff;">Scout Completo do Adversário</h4>
          </div>
          <button type="button" class="ie-cmd-btn" id="btn-close-story-scout" style="padding:5px 12px; font-size:0.74rem; background:#334155;"><span>Fechar ✕</span></button>
        </div>
        <div id="story-scout-modal-body">${buildStoryFullScoutBodyHTML(t)}</div>
      </div>
    </div>
  `;
}

function bindStoryModalEvents(t) {
  const bindBackdrop = (openId, closeId, modalId) => {
    const modal = document.getElementById(modalId);
    const openBtn = document.getElementById(openId);
    const closeBtn = document.getElementById(closeId);
    if (!modal) return;
    if (openBtn) {
      openBtn.addEventListener("click", () => modal.classList.add("is-open"));
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", () => modal.classList.remove("is-open"));
    }
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("is-open");
    });
  };
  bindBackdrop("btn-open-story-table", "btn-close-story-table", "story-table-modal");
  bindBackdrop("btn-open-story-stats", "btn-close-story-stats", "story-stats-modal");
  bindBackdrop("btn-open-story-scout", "btn-close-story-scout", "story-scout-modal");

  const statsModal = document.getElementById("story-stats-modal");
  if (statsModal && state.storyRun?.league) {
    statsModal.querySelectorAll("[data-story-stats-tab]").forEach((tabBtn) => {
      tabBtn.addEventListener("click", () => {
        const key = tabBtn.getAttribute("data-story-stats-tab") || "ratings";
        state.storyRun.league.activeStatsTab = key;
        statsModal.querySelectorAll("[data-story-stats-tab]").forEach((b) => {
          b.classList.toggle("is-active", b.getAttribute("data-story-stats-tab") === key);
        });
        const bodyEl = document.getElementById("story-stats-modal-body");
        if (bodyEl) bodyEl.innerHTML = buildStoryStatsRowsHTML(state.storyRun.league, key);
      });
    });
  }

  const benchOpenBtn = document.getElementById("btn-open-story-bench");
  const squadOpenBtn = document.getElementById("btn-open-squad-modal");
  if (benchOpenBtn && squadOpenBtn) {
    benchOpenBtn.addEventListener("click", () => squadOpenBtn.click());
  }
}

// ============================================================================
// NOTAS PÓS-JOGO NO RECAP & RESUMO FINAL DA SÉRIE A
// ============================================================================
function buildStoryRecapRatingsHTML(st) {
  if (!st || !Array.isArray(st.storyPlayerRatings) || st.storyPlayerRatings.length === 0) return "";
  const mvpId = st.storyPlayerRatings[0]?.id;
  return `
    <div class="recap-ratings-block">
      <div class="recap-ratings-head">
        <span>Notas da Partida (0.0 – 10.0)</span>
        <small>Craque: ${escapeHtml(st.storyPlayerRatings[0]?.name || "")}</small>
      </div>
      <div class="recap-ratings-grid">
        ${st.storyPlayerRatings
          .map(
            (r) => `
          <div class="recap-rating-item ${r.id === mvpId ? "is-mvp" : ""}">
            ${r.sprite ? `<img src="${r.sprite}" alt="${escapeHtml(r.name)}" />` : ""}
            <span class="rri-name">${escapeHtml(r.name)}${r.id === mvpId ? ` <b>MVP</b>` : ""}</span>
            <span class="recap-rating-chip ${getRatingBadgeClass(r.rating)}">${Number(r.rating).toFixed(1)}</span>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

function buildStorySeasonEndHTML(t, stats) {
  const league = state.storyRun?.league;
  const teams = sortStoryLeagueStandings([...(league?.teams || [])]);
  const rank = getUserStoryRank(league);
  const userRow = teams.find((tm) => tm.isUser) || { name: getActiveTeamName(), pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 };
  const allStats = Object.values(league?.playerStats || {});
  const bolaDeOuro = allStats.slice().sort((a, b) => b.avgRating - a.avgRating)[0];
  const artilheiro = allStats.slice().sort((a, b) => b.goals - a.goals || b.avgRating - a.avgRating)[0];
  const garcom = allStats.slice().sort((a, b) => b.assists - a.assists || b.avgRating - a.avgRating)[0];
  const paredao = allStats.filter((p) => p.role === "GK" || p.saves > 0).sort((a, b) => (b.cleanSheets * 3 + b.saves) - (a.cleanSheets * 3 + a.saves))[0];
  const ladrao = allStats.slice().sort((a, b) => b.steals - a.steals || b.avgRating - a.avgRating)[0];

  const qualTitle =
    rank === 1
      ? `Campeão da Série A Inazuma! (${userRow.pts} pts)`
      : rank === 2
      ? `Vice-Campeão da Série A — Vaga Direta no Mundial! (${userRow.pts} pts)`
      : rank <= 4
      ? `${rank}º Lugar — Classificado ao Play-In do Mundial! (${userRow.pts} pts)`
      : `Fim da Série A em ${rank}º Lugar (${userRow.pts} pts)`;
  const qualSub =
    rank <= 2
      ? "Seu clube garantiu vaga direta na Fase de Grupos do Mundial de Clubes (Fase 3 do Modo História WIP)!"
      : rank <= 4
      ? "Seu clube garantiu vaga no Play-In em jogo único pelo Mundial de Clubes (Fase 3 do Modo História WIP)!"
      : "Campanha encerrada na Série A. Tente novamente ou use as estatísticas abaixo para ajustar sua próxima escalação.";

  return `
    <div class="story-season-end-card">
      <div class="story-season-hero ${rank <= 2 ? "is-gold" : rank <= 4 ? "is-playin" : ""}">
        <span class="story-wip-pill">MODO HISTÓRIA WIP • FIM DA FASE 1 (SÉRIE A)</span>
        <h2>${qualTitle}</h2>
        <p>${qualSub}</p>
        <div class="story-season-meta">
          <span>Poder: <strong>${Math.round(stats.power || 0).toLocaleString("pt-BR")}</strong></span>
          <span>Campanha: <strong>${userRow.w}V ${userRow.d}E ${userRow.l}D</strong></span>
          <span>Gols: <strong>${userRow.gf}:${userRow.ga}</strong></span>
        </div>
      </div>

      <div class="story-awards-grid">
        <div class="story-award-card">
          <small>Bola de Ouro (Nota Média)</small>
          <strong>${bolaDeOuro ? escapeHtml(bolaDeOuro.name) : "—"}</strong>
          <span>${bolaDeOuro ? `${bolaDeOuro.avgRating.toFixed(1)} · ${escapeHtml(bolaDeOuro.teamName)}` : ""}</span>
        </div>
        <div class="story-award-card">
          <small>Artilheiro</small>
          <strong>${artilheiro ? escapeHtml(artilheiro.name) : "—"}</strong>
          <span>${artilheiro ? `${artilheiro.goals} gols · ${escapeHtml(artilheiro.teamName)}` : ""}</span>
        </div>
        <div class="story-award-card">
          <small>Garçom (Assistências)</small>
          <strong>${garcom ? escapeHtml(garcom.name) : "—"}</strong>
          <span>${garcom ? `${garcom.assists} assist. · ${escapeHtml(garcom.teamName)}` : ""}</span>
        </div>
        <div class="story-award-card">
          <small>Paredão (Goleiro)</small>
          <strong>${paredao ? escapeHtml(paredao.name) : "—"}</strong>
          <span>${paredao ? `${paredao.saves} def · ${paredao.cleanSheets} s/ gol` : ""}</span>
        </div>
        <div class="story-award-card">
          <small>Ladrão de Bolas</small>
          <strong>${ladrao ? escapeHtml(ladrao.name) : "—"}</strong>
          <span>${ladrao ? `${ladrao.steals} roubos · ${escapeHtml(ladrao.teamName)}` : ""}</span>
        </div>
      </div>

      ${buildStoryTableModalBodyHTML(league)}

      <div class="story-wip-roadmap-note">
        <strong>Próximas fases do Modo História (WIP):</strong> Fase 2 trará Pré-Temporada de 3 dias (Treino vs Amistoso com Scouts) + Liga Viva + Jornal <em>InaNews</em>; Fase 3 adicionará substituições em jogo, lesões, faltas/pênaltis e o <strong>Mundial de Clubes (Grupos 4×4 + Ida/Volta + Final Única)</strong>.
      </div>

      <div class="story-intro-actions" style="margin-top:14px;">
        <button type="button" class="ie-cmd-btn ie-cmd-gold" id="btn-open-story-stats">
          <span>Abrir Central de Estatísticas Completa</span>
        </button>
        <button type="button" class="ie-cmd-btn ie-cmd-green" id="btn-story-back-menu">
          <span>Voltar ao Menu Inicial</span>
        </button>
      </div>
    </div>
    ${buildStoryModalsHTML(t)}
  `;
}

// ============================================================================
// SERIALIZAÇÃO / RESTAURAÇÃO DE SAVE DO MODO HISTÓRIA
// ============================================================================
function serializeStoryRunForSave(sr) {
  if (!sr || typeof sr !== "object") return null;
  const benchRaw = {};
  (sr.bench || []).forEach((p, idx) => {
    if (p) benchRaw[idx] = p;
  });
  const serializedBench = typeof serializeSquadForSave === "function" ? serializeSquadForSave(benchRaw) : {};
  return {
    active: Boolean(sr.active),
    wip: true,
    phase: sr.phase || "SERIE_A",
    usedFullNames: Array.isArray(sr.usedFullNames) ? [...sr.usedFullNames] : [],
    leagueFullNames: Array.isArray(sr.leagueFullNames) ? [...sr.leagueFullNames] : [],
    freeAgentPool: Array.isArray(sr.freeAgentPool) ? [...sr.freeAgentPool] : [],
    bench: serializedBench,
    league: sr.league
      ? {
          roundIndex: sr.league.roundIndex || 0,
          activeStatsTab: sr.league.activeStatsTab || "ratings",
          lastRoundResults: Array.isArray(sr.league.lastRoundResults) ? [...sr.league.lastRoundResults] : [],
          lastUserMatchRatings: Array.isArray(sr.league.lastUserMatchRatings) ? [...sr.league.lastUserMatchRatings] : [],
          playerStats: sr.league.playerStats ? JSON.parse(JSON.stringify(sr.league.playerStats)) : {},
          schedule: sr.league.schedule ? JSON.parse(JSON.stringify(sr.league.schedule)) : [],
          teams: (sr.league.teams || []).map((tm) => ({
            ...tm,
            emblem: undefined,
            playerIds: Array.isArray(tm.players) ? tm.players.map((pl) => String(pl.id)) : null
          }))
        }
      : null
  };
}

function deserializeStoryRunFromSave(raw) {
  if (!raw || typeof raw !== "object") return null;
  const idxMap = typeof buildPlayerLookupIndex === "function" ? buildPlayerLookupIndex() : null;
  const restoredBenchMap = raw.bench && typeof deserializeSquadFromSave === "function" ? deserializeSquadFromSave(raw.bench) : {};
  const bench = Object.keys(restoredBenchMap)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => restoredBenchMap[k])
    .filter(Boolean);

  let league = null;
  if (raw.league) {
    const teams = (raw.league.teams || []).map((tm) => {
      if (tm.isUser) {
        return { ...tm, emblem: UI.raimonEmblem || "" };
      }
      const src = typeof findTeamById === "function" ? findTeamById(tm.sourceTeamId) : null;
      const players = Array.isArray(tm.playerIds) && idxMap
        ? tm.playerIds.map((id) => idxMap.byId.get(String(id))).filter(Boolean)
        : (src?.players || []);
      return {
        ...tm,
        emblem: src?.emblem || UI.ffLogo || "",
        players
      };
    });
    league = {
      ...raw.league,
      teams
    };
  }
  return {
    active: Boolean(raw.active),
    wip: true,
    phase: raw.phase || "SERIE_A",
    usedFullNames: Array.isArray(raw.usedFullNames) ? [...raw.usedFullNames] : [],
    leagueFullNames: Array.isArray(raw.leagueFullNames) ? [...raw.leagueFullNames] : [],
    freeAgentPool: Array.isArray(raw.freeAgentPool) ? [...raw.freeAgentPool] : [],
    bench,
    league
  };
}
