// Inazuma Eleven 7x0 — Engine v3 (Sem Piscar, Menu Inicial, Roleta Animada e Química por Amizade/Time)

(function () {
  const DB = window.INAZUMA_DB;

  const NORMAL_SHOT_DESCRIPTIONS = [
    "Chute colocado no ângulo",
    "Bomba de fora da área",
    "Finalização cruzada rasteira",
    "Chute de primeira na gaveta",
    "Cabeçada certeira após cruzamento",
    "Toque sutil na saída do goleiro"
  ];

  // Grupos de Amizade / Afinidade Canônica do Anime (funcionam mesmo se tirados de times diferentes!)
  const FRIENDSHIP_BONDS = [
    {
      id: "trio_raimon",
      name: "⚡ Trio Lendário (Endo, Goenji, Kido)",
      members: ["Endou Mamoru", "Gouenji Shuuya", "Kidou Yuuto"],
      minCount: 2,
      chemPerMatch: 14
    },
    {
      id: "fogo_gelo",
      name: "❄️🔥 Fogo Cruzado (Goenji & Fubuki)",
      members: ["Gouenji Shuuya", "Fubuki Shirou"],
      minCount: 2,
      chemPerMatch: 16
    },
    {
      id: "laco_imperial",
      name: "🦅 Irmandade Imperial (Kido, Sakuma, Genda, Fudou)",
      members: ["Kidou Yuuto", "Sakuma Jirou", "Genda Koujirou", "Fudou Akio"],
      minCount: 2,
      chemPerMatch: 12
    },
    {
      id: "trio_caos",
      name: "🐉 Trio Caos / Dragão de Fogo (Aphrodi, Burn, Gazel, Choi)",
      members: ["Afuro Terumi", "Nagumo Haruya", "Suzuno Fuusuke", "Choi Chang-Soo"],
      minCount: 2,
      chemPerMatch: 13
    },
    {
      id: "laco_aliea",
      name: "☄️ Estrelas do Instituto Alien (Hiroto, Reize, Desarm, Ulvida, Nero)",
      members: ["Kiyama Hiroto", "Midorikawa Ryuuji", "Saginuma Osamu", "Yagami Reina", "Nemuro Keita"],
      minCount: 2,
      chemPerMatch: 12
    },
    {
      id: "laco_fenix_usa",
      name: "🦄 Laço Fênix & Unicórnio (Ichinose, Domon, Kruger, Dylan, Endo)",
      members: ["Ichinose Kazuya", "Domon Asuka", "Mark Krueger", "Dylan Keith", "Endou Mamoru"],
      minCount: 2,
      chemPerMatch: 11
    },
    {
      id: "caravana_inazuma",
      name: "🚌 Caravana Inazuma (Kazemaru, Kabeyama, Someoka, Tsunami, Tachimukai, Kogure, Touko)",
      members: [
        "Kazemaru Ichirouta",
        "Kabeyama Heigorou",
        "Someoka Ryuugo",
        "Tsunami Jousuke",
        "Tachimukai Yuuki",
        "Kogure Yuuya",
        "Zaizen Touko"
      ],
      minCount: 2,
      chemPerMatch: 9
    },
    {
      id: "inazuma_japan_ffi",
      name: "🇯🇵 Companheiros de Seleção (Toramaru, Tobitaka, Hijikata, Hiroto, Fubuki, Goenji, Endo)",
      members: [
        "Utsunomiya Toramaru",
        "Tobitaka Seiya",
        "Hijikata Raiden",
        "Kiyama Hiroto",
        "Fubuki Shirou",
        "Gouenji Shuuya",
        "Endou Mamoru"
      ],
      minCount: 2,
      chemPerMatch: 10
    },
    {
      id: "laco_orfeu",
      name: "🇮🇹 Mestres da Orfeu (Fidio, Nakata, Blasi)",
      members: ["Fideo Ardena", "Nakata Hidetoshi", "Gigi Blasi"],
      minCount: 2,
      chemPerMatch: 14
    },
    {
      id: "legado_daisuke",
      name: "🧤 Legado de Daisuke (Endo & Rococo)",
      members: ["Endou Mamoru", "Rococo Urupa"],
      minCount: 2,
      chemPerMatch: 16
    },
    {
      id: "geracao_go",
      name: "🌟 Revolução GO & Chrono Storm (Tenma, Tsurugi, Shindou, Kirino, Shinsuke, Fei, Kinako, Zanark)",
      members: [
        "Matsukaze Tenma",
        "Tsurugi Kyousuke",
        "Shindou Takuto",
        "Kirino Ranmaru",
        "Nishizono Shinsuke",
        "Fei Rune",
        "Nanobana Kinako",
        "Zanark Avalonic"
      ],
      minCount: 2,
      chemPerMatch: 12
    },
    {
      id: "dupla_zero",
      name: "☯️ Luz & Escuridão (Hakuryuu & Shuu)",
      members: ["Hakuryuu", "Shuu"],
      minCount: 2,
      chemPerMatch: 18
    }
  ];

  const state = {
    phase: "menu", // "menu" | "draft" | "tournament"
    formation: "4-3-3",
    hideOvrBeforePick: true, // Dificuldade: true = Sem Overall no sorteio, false = Com Overall visível
    squad: {}, // slotId -> player
    currentTeam: null,
    selectedPlayer: null,
    peekField: false,
    swapSlotId: null,
    rerollsLeft: 3,
    isSpinning: false,
    usedTeamIds: [],
    simSpeed: 1, // 1 = 420ms/min, 2 = 200ms/min, 4 = 80ms/min
    tournament: {
      stageIndex: 0,
      stages: [],
      timerId: null
    }
  };

  function getSlots() {
    return DB.formations[state.formation].slots;
  }

  function getPickedCount() {
    return Object.values(state.squad).filter(Boolean).length;
  }

  function getPickedPlayerIds() {
    return new Set(Object.values(state.squad).filter(Boolean).map((p) => p.id));
  }

  function getOpenSlots() {
    return getSlots().filter((s) => !state.squad[s.id]);
  }

  function getEffectiveOvr(player, slotRole) {
    if (!player) return 0;
    if (player.pos === slotRole) return player.ovr;
    const adj =
      (player.pos === "DF" && slotRole === "MF") ||
      (player.pos === "MF" && (slotRole === "DF" || slotRole === "FW")) ||
      (player.pos === "FW" && slotRole === "MF");
    return Math.max(50, player.ovr - (adj ? 4 : 9));
  }

  function pickPlayerMove(player, category) {
    if (!player || !player.moves || !Array.isArray(player.moves[category])) return null;
    const list = player.moves[category];
    if (list.length === 0) return null;
    const pool = list.slice(0, Math.min(4, list.length));
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function formatPlayerMovesSummary(p) {
    if (!p || !p.moves) return p.hissatsu || "";
    const parts = [];
    if (p.pos === "GK" && p.moves.GK?.length) parts.push(`🧤 ${p.moves.GK[0]}`);
    if (p.moves.SH?.length) parts.push(`⚽ ${p.moves.SH[0]}`);
    if (p.moves.OF?.length && parts.length < 2) parts.push(`💨 ${p.moves.OF[0]}`);
    if (p.moves.DF?.length && parts.length < 2) parts.push(`🛡️ ${p.moves.DF[0]}`);
    if (p.moves.GK?.length && parts.length === 0) parts.push(`🧤 ${p.moves.GK[0]}`);
    return parts.join(" • ") || p.hissatsu;
  }

  // Verifica se um jogador do sorteio atual teria link de amizade/mesmo time com alguém já escalado!
  function hasAffinityWithCurrentSquad(candidate) {
    const currentPlayers = Object.values(state.squad).filter(Boolean);
    if (currentPlayers.length === 0) return false;

    // 1. Mesmo time?
    if (currentPlayers.some((p) => p.teamId === candidate.teamId)) return true;

    // 2. Laço de amizade canônico?
    const candFull = candidate.fullName;
    const squadFulls = new Set(currentPlayers.map((p) => p.fullName));
    for (const bond of FRIENDSHIP_BONDS) {
      if (bond.members.includes(candFull)) {
        if (bond.members.some((m) => m !== candFull && squadFulls.has(m))) {
          return true;
        }
      }
    }
    return false;
  }

  // Cálculo de Química baseado em: Mesmo Time, Laços de Amizade do Anime e Afinidade Elemental!
  function calcSquadStats() {
    const slots = getSlots();
    let sumOvr = 0;
    let count = 0;
    let atkSum = 0, atkCnt = 0;
    let midSum = 0, midCnt = 0;
    let defSum = 0, defCnt = 0;

    const teamsCount = {};
    const teamNames = {};
    const elemsCount = {};
    const fullNamesInSquad = new Set();

    slots.forEach((s) => {
      const p = state.squad[s.id];
      if (!p) return;
      count++;
      const eff = getEffectiveOvr(p, s.role);
      sumOvr += eff;

      teamsCount[p.teamId] = (teamsCount[p.teamId] || 0) + 1;
      teamNames[p.teamId] = p.teamName;
      elemsCount[p.element] = (elemsCount[p.element] || 0) + 1;
      if (p.fullName) fullNamesInSquad.add(p.fullName);

      if (s.role === "FW") { atkSum += eff; atkCnt++; }
      else if (s.role === "MF") { midSum += eff; midCnt++; }
      else { defSum += eff; defCnt++; }
    });

    let chem = 0;
    const activeBonds = [];

    // 1. Química por Mesmo Time (Colegas de Clube/Escola)
    Object.keys(teamsCount).forEach((tId) => {
      const c = teamsCount[tId];
      if (c >= 2) {
        const bonus = (c - 1) * 14;
        chem += bonus;
        activeBonds.push({
          type: "team",
          label: `🏟️ ${c}x ${teamNames[tId]} (+${bonus}%)`
        });
      }
    });

    // 2. Química por Laços de Amizade / Duplas e Trios do Anime
    FRIENDSHIP_BONDS.forEach((bond) => {
      const matched = bond.members.filter((m) => fullNamesInSquad.has(m));
      if (matched.length >= bond.minCount) {
        const bonus = (matched.length - 1) * bond.chemPerMatch;
        chem += bonus;
        activeBonds.push({
          type: "friendship",
          label: `${bond.name} (+${bonus}%)`
        });
      }
    });

    // 3. Química por Ressonância Elemental (3+ jogadores do mesmo elemento)
    Object.keys(elemsCount).forEach((el) => {
      const c = elemsCount[el];
      if (c >= 3) {
        const bonus = (c - 2) * 7;
        chem += bonus;
        const icon = DB.elements[el]?.icon || "⚡";
        activeBonds.push({
          type: "element",
          label: `${icon} ${c}x Afinidade ${el} (+${bonus}%)`
        });
      }
    });

    chem = Math.min(100, Math.max(0, chem));

    // A Química dá bônus direto no Overall Geral do time (+0 a +4 OVR)!
    const chemOvrBonus = chem >= 80 ? 3 : chem >= 55 ? 2 : chem >= 30 ? 1 : 0;
    const ovr = count > 0 ? Math.min(99, Math.round(sumOvr / count) + chemOvrBonus) : 0;

    return {
      count,
      ovr,
      atk: atkCnt > 0 ? Math.round(atkSum / atkCnt) : 0,
      mid: midCnt > 0 ? Math.round(midSum / midCnt) : 0,
      def: defCnt > 0 ? Math.round(defSum / defCnt) : 0,
      chem,
      activeBonds
    };
  }

  // Sorteia o próximo time e anima o carrossel da roleta sem piscar!
  function spinNextTeam(isManualReroll = false) {
    if (state.isSpinning) return;
    if (isManualReroll) {
      if (state.rerollsLeft <= 0) return;
      state.rerollsLeft--;
    }

    state.selectedPlayer = null;
    state.peekField = false;

    const pickedIds = getPickedPlayerIds();
    const openRoles = new Set(getOpenSlots().map((s) => s.role));

    let pool = DB.teams.filter(
      (t) =>
        !state.usedTeamIds.includes(t.id) &&
        t.players.some((p) => !pickedIds.has(p.id) && openRoles.has(p.pos))
    );
    if (pool.length === 0) {
      pool = DB.teams.filter((t) => t.players.some((p) => !pickedIds.has(p.id)));
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

    const pickedCount = getPickedCount();
    const pickedIds = getPickedPlayerIds();
    const openSlots = getOpenSlots();
    const openRoles = new Set(openSlots.map((s) => s.role));
    const team = state.currentTeam || DB.teams[0];

    // Monta a tira da roleta com 28 itens onde o item #22 é o time sorteado!
    const targetIdx = 22;
    const stripTeams = [];
    for (let i = 0; i < 28; i++) {
      if (i === targetIdx) {
        stripTeams.push(team);
      } else {
        stripTeams.push(DB.teams[Math.floor(Math.random() * DB.teams.length)]);
      }
    }

    const posOrder = { GK: 1, DF: 2, MF: 3, FW: 4 };
    const sortedPlayers = [...team.players].sort(
      (a, b) => (posOrder[a.pos] || 9) - (posOrder[b.pos] || 9) || b.ovr - a.ovr
    );

    const openRolesSummary = ["GK", "DF", "MF", "FW"]
      .map((r) => {
        const cnt = openSlots.filter((s) => s.role === r).length;
        return cnt > 0
          ? `<span class="node-pos-pill pos-${r}" style="font-size:0.72rem; padding:2px 8px;">${r}: ${cnt}</span>`
          : "";
      })
      .filter(Boolean)
      .join(" ");

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div style="font-size:0.8rem; font-weight:900; color:#facc15; text-transform:uppercase;">
          🎡 Roleta de Times • Rodada ${pickedCount + 1} de 11
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          <span style="font-size:0.74rem; color:#94a3b8;">Faltam:</span>
          ${openRolesSummary}
        </div>
      </div>

      <!-- Roleta Carrossel com Todos os Times -->
      <div class="wheel-carousel-wrapper" id="wheel-box">
        <div class="wheel-center-pointer"></div>
        <div class="wheel-strip" id="wheel-strip">
          ${stripTeams
            .map(
              (t) => `
            <div class="wheel-item">
              <img src="${t.emblem}" alt="${t.name}" />
              <span>${t.name}</span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- Elenco do Time Sorteado -->
      <div id="roster-reveal-section" style="opacity: ${animateWheel ? "0.18" : "1"}; pointer-events: ${animateWheel ? "none" : "auto"}; transition: opacity 0.3s ease;">
        <div class="drawn-team-header" style="margin-bottom: 12px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="${team.emblem}" alt="" style="width:46px; height:46px; object-fit:contain;" />
            <div>
              <h3 style="font-size:1.15rem; font-weight:900; color:#fff;" id="drawn-team-title">
                ${animateWheel ? "Sorteando time na roleta..." : team.name}
              </h3>
              <p style="font-size:0.76rem; color:#94a3b8;">
                Toque em <strong>1 personagem</strong> abaixo para abrir o campo e escalá-lo na sua seleção:
              </p>
            </div>
          </div>

          <div style="display:flex; gap:8px;">
            <button class="ui-btn" id="btn-peek-field">
              👁️ Ver Campo (${pickedCount}/11)
            </button>
            <button class="ui-btn" id="btn-reroll-team" ${state.rerollsLeft <= 0 ? "disabled" : ""}>
              🎲 Girar Outro (${state.rerollsLeft})
            </button>
          </div>
        </div>

        <div class="roster-grid">
          ${sortedPlayers
            .map((p) => {
              const alreadyPicked = pickedIds.has(p.id);
              const hasNaturalSlot = openRoles.has(p.pos);
              const elem = DB.elements[p.element] || { icon: "⚡" };
              const movesSummary = formatPlayerMovesSummary(p);
              const hasLink = !alreadyPicked && hasAffinityWithCurrentSquad({ ...p, teamId: team.id });

              return `
                <div class="roster-player-card ${alreadyPicked ? "disabled-card" : ""} ${!hasNaturalSlot && !alreadyPicked ? "pos-full-card" : ""}"
                     data-player-id="${p.id}">
                  <img class="roster-sprite" src="${p.sprite}" alt="${p.name}" />
                  <div class="roster-meta">
                    <div class="roster-name">#${p.number} ${p.name}</div>
                    <div class="roster-sub">${movesSummary}</div>
                    <div class="roster-badges">
                      <span class="node-pos-pill pos-${p.pos}">${p.pos}</span>
                      <span class="ovr-tag">${state.hideOvrBeforePick && !alreadyPicked ? "OVR ??" : `OVR ${p.ovr}`}</span>
                      <span style="font-size:0.72rem;">${elem.icon}</span>
                      ${hasLink ? `<span class="affinity-badge">🤝 +Química</span>` : ""}
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

    // Posiciona e anima a tira da roleta com CSS transition suave (sem piscar!)
    const wheelBox = document.getElementById("wheel-box");
    const stripEl = document.getElementById("wheel-strip");
    const itemWidth = 126; // 120px + 6px margin
    const boxCenter = (wheelBox ? wheelBox.clientWidth : 600) / 2;
    const finalOffset = boxCenter - targetIdx * itemWidth - itemWidth / 2;

    if (animateWheel && stripEl) {
      stripEl.style.transition = "none";
      stripEl.style.transform = `translateX(0px)`;
      // Força reflow e aplica transição suave de 1.5s
      void stripEl.offsetWidth;
      stripEl.style.transition = "transform 1.55s cubic-bezier(0.12, 0.82, 0.18, 1)";
      stripEl.style.transform = `translateX(${finalOffset}px)`;

      setTimeout(() => {
        state.isSpinning = false;
        const rev = document.getElementById("roster-reveal-section");
        const titleEl = document.getElementById("drawn-team-title");
        if (rev) {
          rev.style.opacity = "1";
          rev.style.pointerEvents = "auto";
        }
        if (titleEl) {
          titleEl.textContent = team.name;
        }
      }, 1550);
    } else if (stripEl) {
      state.isSpinning = false;
      stripEl.style.transform = `translateX(${finalOffset}px)`;
    }

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
        if (player && !pickedIds.has(player.id)) {
          state.selectedPlayer = {
            ...player,
            teamId: team.id,
            teamName: team.name,
            teamEmblem: team.emblem
          };
          state.swapSlotId = null;
          renderMainScreen();
        }
      });
    });
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

  function buildPitchHTML() {
    const slots = getSlots();
    const sel = state.selectedPlayer;

    const nodesHTML = slots
      .map((slot) => {
        const p = state.squad[slot.id];
        const isSwap = state.swapSlotId === slot.id;

        if (!p) {
          let targetClass = "";
          let hintText = "Vazio";
          if (sel) {
            if (sel.pos === slot.role) {
              targetClass = "valid-target";
              hintText = "⚡ Escalar";
            } else {
              targetClass = "improv-target";
              hintText = "Improvisar";
            }
          }

          return `
            <div class="field-node ${targetClass}"
                 style="left:${slot.x}%; top:${slot.y}%;"
                 data-slot="${slot.id}">
              <span class="node-pos-pill pos-${slot.role}">${slot.label} (${slot.role})</span>
              <span style="font-size:1.25rem; color:rgba(255,255,255,0.65); margin:1px 0;">＋</span>
              <span style="font-size:0.62rem; color:#f8fafc; font-weight:800;">${hintText}</span>
            </div>
          `;
        }

        const effOvr = getEffectiveOvr(p, slot.role);
        const isImprovised = p.pos !== slot.role;

        return `
          <div class="field-node occupied ${isSwap ? "swap-active" : ""}"
               style="left:${slot.x}%; top:${slot.y}%;"
               data-slot="${slot.id}">
            ${p.teamEmblem ? `<img class="node-team-emblem" src="${p.teamEmblem}" alt="" />` : ""}
            <div class="node-ovr">${effOvr}</div>
            <img class="node-avatar" src="${p.sprite}" alt="${p.name}" />
            <div class="node-name">${p.name}</div>
            <span class="node-pos-pill pos-${slot.role}">
              ${slot.label}${isImprovised ? ` (${p.pos}⚠️)` : ""}
            </span>
          </div>
        `;
      })
      .join("");

    return `
      <div class="soccer-pitch">
        <div class="pitch-penalty-top"></div>
        <div class="pitch-half-line"></div>
        <div class="pitch-center-circle">⚡</div>
        <div class="pitch-penalty-bottom"></div>
        <div id="pitch-nodes-container">${nodesHTML}</div>
      </div>
    `;
  }

  // ============================================================================
  // TORNEIO FUTEBOL FRONTEIRA (SEM PISCAR! ATUALIZAÇÃO INCREMENTAL DO DOM)
  // ============================================================================
  function getTickMs() {
    if (state.simSpeed === 4) return 90;
    if (state.simSpeed === 2) return 210;
    return 420; // 1x cadenciado (~37 segundos para os 90 minutos, ~4 segundos entre lances!)
  }

  function startTournamentGo() {
    if (state.tournament.timerId) clearInterval(state.tournament.timerId);

    const tiers = [
      DB.teams.filter((t) => t.baseOvr <= 81),
      DB.teams.filter((t) => t.baseOvr >= 82 && t.baseOvr <= 86),
      DB.teams.filter((t) => t.baseOvr >= 87 && t.baseOvr <= 90),
      DB.teams.filter((t) => t.baseOvr >= 90)
    ];

    const stageNames = [
      "Oitavas de Final",
      "Quartas de Final",
      "Semifinal",
      "Grande Final"
    ];

    const usedOpp = new Set();
    const stages = stageNames.map((sName, idx) => {
      const pool = tiers[idx].filter((t) => !usedOpp.has(t.id));
      const opp = pool[Math.floor(Math.random() * pool.length)] || DB.teams[idx * 5];
      usedOpp.add(opp.id);
      return {
        stageName: sName,
        oppTeam: opp,
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
        penaltiesText: null
      };
    });

    state.phase = "tournament";
    state.tournament = {
      stageIndex: 0,
      stages,
      timerId: null
    };

    runLiveMatchSimulation(0);
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

  // Insere apenas 1 linha nova no topo do histórico de narração sem tocar no resto da página!
  function prependNarrationLine(st, cls, text) {
    st.narration.unshift({ cls, text });
    const feedEl = document.getElementById("live-narration-feed");
    const countEl = document.getElementById("live-narration-count");
    if (feedEl) {
      feedEl.insertAdjacentHTML(
        "afterbegin",
        `<div class="narration-item ${cls}">${text}</div>`
      );
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
      listEl.insertAdjacentHTML(
        "beforeend",
        `<div class="goal-item ${side === "user" ? "user-goal" : "opp-goal"}">
          <img src="${goalObj.sprite}" alt="" />
          <div>
            <div style="font-weight:800; color:#fff;">⚽ ${goalObj.minute}' ${goalObj.name}</div>
            <div style="font-size:0.68rem; color:${color};">
              ${goalObj.isHissatsu ? `⚡ Hissatsu: ${goalObj.shotLabel}` : `👟 ${goalObj.shotLabel}`}
            </div>
          </div>
        </div>`
      );
    }
  }

  function startMatchInterval() {
    if (state.tournament.timerId) clearInterval(state.tournament.timerId);

    const stageIdx = state.tournament.stageIndex;
    const st = state.tournament.stages[stageIdx];
    if (!st || st.finished) return;

    const userStats = calcSquadStats();
    const oppOvr = st.oppTeam.baseOvr + stageIdx * 1.5;

    const slots = getSlots();
    const userAll = slots.map((s) => state.squad[s.id]).filter(Boolean);
    const userAttackers = slots
      .filter((s) => s.role === "FW" || s.role === "MF")
      .map((s) => state.squad[s.id])
      .filter(Boolean);
    const userMidfielders = slots
      .filter((s) => s.role === "MF" || s.role === "FW")
      .map((s) => state.squad[s.id])
      .filter(Boolean);
    const userDefenders = slots
      .filter((s) => s.role === "DF" || s.role === "MF")
      .map((s) => state.squad[s.id])
      .filter(Boolean);
    const userGk = state.squad["GK"] || userAll[0];

    const oppAll = st.oppTeam.players;
    const oppAttackers = oppAll.filter((p) => p.pos === "FW" || p.pos === "MF");
    const oppDefenders = oppAll.filter((p) => p.pos === "DF" || p.pos === "MF");
    const oppGk = oppAll.find((p) => p.pos === "GK") || oppAll[0];

    const ovrDiff = userStats.ovr - oppOvr;
    const userGoalProbPerMin = Math.max(0.008, Math.min(0.045, 0.022 + ovrDiff * 0.0022));
    const oppGoalProbPerMin = Math.max(0.006, Math.min(0.040, 0.018 - ovrDiff * 0.0018));

    state.tournament.timerId = setInterval(() => {
      st.minute++;

      // Atualiza apenas o texto do relógio e a largura da barra (ZERO piscar!)
      const clockEl = document.getElementById("live-clock-text");
      const barEl = document.getElementById("live-bar-fill");
      if (clockEl) clockEl.textContent = `⏱️ ${st.minute}'`;
      if (barEl) {
        const pct = Math.min(100, Math.round((st.minute / st.maxMinute) * 100));
        barEl.style.width = `${pct}%`;
      }

      // 1) Chance de Gol da Sua Seleção
      if (Math.random() < userGoalProbPerMin) {
        const scorer =
          userAttackers[Math.floor(Math.random() * userAttackers.length)] || userAll[0];
        const shotInfo = buildGoalShotLabel(scorer);
        st.userScore++;

        const goalObj = {
          minute: st.minute,
          name: scorer.name,
          sprite: scorer.sprite,
          shotLabel: shotInfo.label,
          isHissatsu: shotInfo.isHissatsu
        };
        st.goalsUser.push(goalObj);

        const scoreUserEl = document.getElementById("live-score-user");
        if (scoreUserEl) scoreUserEl.textContent = st.userScore;
        appendGoalItemDOM("user", goalObj);

        prependNarrationLine(
          st,
          "nar-goal-user",
          shotInfo.isHissatsu
            ? `⚽ ${st.minute}' GOOOL DA SUA SELEÇÃO! ${scorer.name} disparou a técnica de chute 【${shotInfo.label}】 sem chances para ${oppGk.name}! (${st.userScore} x ${st.oppScore})`
            : `⚽ ${st.minute}' GOOOL DA SUA SELEÇÃO! ${scorer.name} recebeu na área e marcou com um ${shotInfo.label.toLowerCase()}! (${st.userScore} x ${st.oppScore})`
        );
      }
      // 2) Chance de Gol do Adversário
      else if (Math.random() < oppGoalProbPerMin) {
        const oppScorer =
          oppAttackers[Math.floor(Math.random() * oppAttackers.length)] || oppAll[0];
        const shotInfo = buildGoalShotLabel(oppScorer);
        st.oppScore++;

        const goalObj = {
          minute: st.minute,
          name: oppScorer.name,
          sprite: oppScorer.sprite,
          shotLabel: shotInfo.label,
          isHissatsu: shotInfo.isHissatsu
        };
        st.goalsOpp.push(goalObj);

        const scoreOppEl = document.getElementById("live-score-opp");
        if (scoreOppEl) scoreOppEl.textContent = st.oppScore;
        appendGoalItemDOM("opp", goalObj);

        prependNarrationLine(
          st,
          "nar-goal-opp",
          shotInfo.isHissatsu
            ? `💥 ${st.minute}' GOL DE ${st.oppTeam.name.toUpperCase()}! ${oppScorer.name} finalizou usando 【${shotInfo.label}】! (${st.userScore} x ${st.oppScore})`
            : `💥 ${st.minute}' GOL DE ${st.oppTeam.name.toUpperCase()}! ${oppScorer.name} marcou com um ${shotInfo.label.toLowerCase()}! (${st.userScore} x ${st.oppScore})`
        );
      }
      // 3) Lances de Narração a cada 10 minutos (Dribles OF, Roubos DF e Defesas GK)
      else if (st.minute % 10 === 0 && st.minute !== 90) {
        const rollType = Math.random();

        if (rollType < 0.34) {
          const isUserPlay = Math.random() < 0.55;
          const dribbler = isUserPlay
            ? userMidfielders[Math.floor(Math.random() * userMidfielders.length)]
            : oppAttackers[Math.floor(Math.random() * oppAttackers.length)];
          const marker = isUserPlay
            ? oppDefenders[Math.floor(Math.random() * oppDefenders.length)]
            : userDefenders[Math.floor(Math.random() * userDefenders.length)];

          if (dribbler && marker) {
            const ofMove = pickPlayerMove(dribbler, "OF");
            prependNarrationLine(
              st,
              "nar-dribble",
              ofMove
                ? `💨 ${st.minute}' [Drible] ${dribbler.name} usou 【${ofMove}】 e passou por ${marker.name} pelo meio-campo!`
                : `💨 ${st.minute}' [Jogada] ${dribbler.name} aplicou um drible rápido em ${marker.name} e armou o ataque!`
            );
          }
        } else if (rollType < 0.68) {
          const isUserDef = Math.random() < 0.55;
          const defender = isUserDef
            ? userDefenders[Math.floor(Math.random() * userDefenders.length)]
            : oppDefenders[Math.floor(Math.random() * oppDefenders.length)];
          const runner = isUserDef
            ? oppAttackers[Math.floor(Math.random() * oppAttackers.length)]
            : userAttackers[Math.floor(Math.random() * userAttackers.length)];

          if (defender && runner) {
            const dfMove = pickPlayerMove(defender, "DF");
            prependNarrationLine(
              st,
              "nar-steal",
              dfMove
                ? `🛡️ ${st.minute}' [Roubo de Bola] ${defender.name} ativou 【${dfMove}】 e travou o avanço de ${runner.name}!`
                : `🛡️ ${st.minute}' [Defesa] ${defender.name} antecipou a jogada e roubou a bola limpa de ${runner.name}!`
            );
          }
        } else {
          const isUserSave = Math.random() < 0.55;
          const gk = isUserSave ? userGk : oppGk;
          const shooter = isUserSave
            ? oppAttackers[Math.floor(Math.random() * oppAttackers.length)]
            : userAttackers[Math.floor(Math.random() * userAttackers.length)];

          if (gk && shooter) {
            const gkMove = pickPlayerMove(gk, "GK");
            const shMove = pickPlayerMove(shooter, "SH");
            const shotPart = shMove ? `o chute 【${shMove}】 de ${shooter.name}` : `o chute forte de ${shooter.name}`;
            prependNarrationLine(
              st,
              "nar-save",
              gkMove
                ? `🧤 ${st.minute}' [Defesa de Goleiro] ${gk.name} acionou 【${gkMove}】 e espalmou ${shotPart}!`
                : `🧤 ${st.minute}' [Defesa de Goleiro] ${gk.name} saltou no ângulo e salvou ${shotPart}!`
            );
          }
        }
      }

      if (st.minute === 45) {
        prependNarrationLine(
          st,
          "",
          `⏱️ 45' Fim do 1º Tempo! Placar parcial: Sua Seleção ${st.userScore} x ${st.oppScore} ${st.oppTeam.name}.`
        );
      }

      if (st.minute === 90 && st.userScore === st.oppScore && st.maxMinute === 90) {
        st.maxMinute = 120;
        prependNarrationLine(
          st,
          "nar-save",
          `⚡ 90' Empate no tempo normal! Vamos para a Prorrogação (até os 120')!`
        );
      }

      if (st.minute >= st.maxMinute) {
        clearInterval(state.tournament.timerId);
        state.tournament.timerId = null;
        st.running = false;
        st.finished = true;

        if (st.userScore === st.oppScore) {
          const userWinPen = Math.random() < (0.52 + ovrDiff * 0.015);
          const uPen = userWinPen ? 5 : 4;
          const oPen = userWinPen ? 4 : 5;
          st.won = userWinPen;
          st.penaltiesText = `Decisão por Pênaltis: Sua Seleção ${uPen} x ${oPen} ${st.oppTeam.name}`;
          prependNarrationLine(
            st,
            userWinPen ? "nar-goal-user" : "nar-goal-opp",
            `🎯 120' FIM DA PRORROGAÇÃO! ${st.penaltiesText}!`
          );
        } else {
          st.won = st.userScore > st.oppScore;
          prependNarrationLine(
            st,
            st.won ? "nar-goal-user" : "nar-goal-opp",
            `🏁 ${st.minute}' APITO FINAL! Sua Seleção ${st.userScore} x ${st.oppScore} ${st.oppTeam.name}!`
          );
        }

        // Renderiza o estado final da partida (botões de avançar/revanche e chaveamento atualizado)
        renderTournamentScreen();
      }
    }, getTickMs());
  }

  function runLiveMatchSimulation(stageIdx) {
    if (state.tournament.timerId) clearInterval(state.tournament.timerId);
    state.tournament.stageIndex = stageIdx;

    const st = state.tournament.stages[stageIdx];
    st.minute = 0;
    st.maxMinute = 90;
    st.userScore = 0;
    st.oppScore = 0;
    st.goalsUser = [];
    st.goalsOpp = [];
    st.narration = [
      {
        cls: "",
        text: `⚡ 0' Apito inicial pela ${st.stageName} do Futebol Fronteira: Sua Seleção enfrenta ${st.oppTeam.name}!`
      }
    ];
    st.running = true;
    st.finished = false;
    st.won = null;
    st.penaltiesText = null;

    renderTournamentScreen();
    startMatchInterval();
  }

  // ============================================================================
  // RENDERIZAÇÃO DAS TELAS
  // ============================================================================
  function renderHeaderAndBonds() {
    const headerWrap = document.getElementById("hud-bars-wrap");
    if (!headerWrap) return;

    if (state.phase === "menu") {
      headerWrap.style.display = "none";
      return;
    }

    headerWrap.style.display = "flex";
    const stats = calcSquadStats();
    document.getElementById("val-ovr").textContent = stats.ovr;
    document.getElementById("val-atk").textContent = stats.atk;
    document.getElementById("val-mid").textContent = stats.mid;
    document.getElementById("val-def").textContent = stats.def;
    document.getElementById("val-chem").textContent = `${stats.chem}%`;

    const bondsBar = document.getElementById("bonds-bar");
    if (bondsBar) {
      if (stats.activeBonds.length === 0) {
        bondsBar.innerHTML = `<span style="color:#94a3b8;">🤝 <strong>Química por Afinidade:</strong> Escale jogadores do mesmo time, amigos do anime (ex: Endo + Goenji + Kido, Goenji + Fubuki) ou mesmo elemento para ganhar Química!</span>`;
      } else {
        bondsBar.innerHTML =
          `<strong style="color:#38bdf8; margin-right:4px;">🤝 Laços Ativos:</strong>` +
          stats.activeBonds
            .map(
              (b) =>
                `<span class="bond-tag ${b.type === "friendship" ? "friendship" : ""}">${b.label}</span>`
            )
            .join("");
      }
    }
  }

  // TELA 1: MENU INICIAL LIMPO
  function renderStartMenuScreen() {
    const container = document.getElementById("main-screen-container");
    if (!container) return;

    container.innerHTML = `
      <div class="start-menu-card">
        <div class="start-logo-bolt">⚡⚽</div>
        <h2>INAZUMA ELEVEN — DRAFT 7x0</h2>
        <p>
          Gire a roleta de times, escolha 1 personagem de cada equipe sorteada para montar sua Seleção e tente conquistar o mata-mata do <strong>Futebol Fronteira</strong>!
        </p>

        <div class="option-group">
          <label>1. Escolha a Dificuldade do Sorteio:</label>
          <div class="difficulty-grid">
            <div class="diff-card ${state.hideOvrBeforePick ? "selected" : ""}" data-diff="hidden">
              <strong>🔥 Modo 7x0 Raiz (Sem Overall)</strong>
              <span>O Overall fica oculto na lista e só é revelado quando você escala o jogador no campo!</span>
            </div>
            <div class="diff-card ${!state.hideOvrBeforePick ? "selected" : ""}" data-diff="visible">
              <strong>🌟 Modo Normal (Com Overall)</strong>
              <span>Mostra o Overall de todos os jogadores do time sorteado antes de você escolher.</span>
            </div>
          </div>
        </div>

        <div class="option-group">
          <label>2. Escolha a Formação Tática:</label>
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
          ⚡ COMEÇAR JOGO E GIRAR ROLETA!
        </button>
      </div>
    `;

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

    document.getElementById("btn-start-game-now").addEventListener("click", () => {
      state.phase = "draft";
      state.squad = {};
      state.rerollsLeft = 3;
      state.usedTeamIds = [];
      spinNextTeam(false);
    });
  }

  // TELA 2: DRAFT (Roleta ou Campo ao Selecionar Personagem)
  function renderDraftScreen() {
    const container = document.getElementById("main-screen-container");
    if (!container) return;

    const pickedCount = getPickedCount();
    const openSlots = getOpenSlots();
    const openRoles = new Set(openSlots.map((s) => s.role));

    // Se já escolheu os 11 jogadores -> Mostra Campo Completo + DAR GO!
    if (pickedCount >= 11) {
      const stats = calcSquadStats();
      container.innerHTML = `
        <div class="go-ready-banner">
          <div style="font-size:2rem;">⚡⚽🏆</div>
          <h2 style="font-size:1.35rem; font-weight:900; color:#4ade80;">
            SELEÇÃO PRONTA! (OVERALL ${stats.ovr} • QUÍMICA ${stats.chem}%)
          </h2>
          <p style="font-size:0.82rem; color:#cbd5e1; max-width:560px; margin:4px auto 0;">
            Seus 11 titulares foram escalados! Clique em dois jogadores no campo se quiser trocar posições ou clique em <strong>DAR GO!</strong> para começar o Futebol Fronteira!
          </p>
          <button class="big-go-btn" id="btn-start-go">
            ⚽ DAR GO! — INICIAR FUTEBOL FRONTEIRA
          </button>
        </div>

        ${buildPitchHTML()}
      `;

      document.getElementById("btn-start-go").addEventListener("click", () => {
        startTournamentGo();
      });

      container.querySelectorAll(".field-node").forEach((el) => {
        el.addEventListener("click", () => handleFieldSlotClick(el.getAttribute("data-slot")));
      });
      return;
    }

    // Se o usuário selecionou um personagem (ou clicou em Ver Campo) -> Abre o Campo!
    if (state.selectedPlayer || state.peekField) {
      const sel = state.selectedPlayer;
      const hasNaturalOpen = sel ? openRoles.has(sel.pos) : true;

      container.innerHTML = `
        <div class="placing-banner">
          ${
            sel
              ? `<div class="placing-player-info">
                  <img src="${sel.sprite}" alt="${sel.name}" />
                  <div>
                    <div style="font-size:0.7rem; font-weight:900; color:#4ade80; text-transform:uppercase;">
                      🎯 Posicionando no Campo (${pickedCount + 1} de 11)
                    </div>
                    <div style="font-size:1.1rem; font-weight:900; color:#fff;">
                      #${sel.number} ${sel.name} <span class="node-pos-pill pos-${sel.pos}">${sel.pos}</span>
                    </div>
                    <div style="font-size:0.76rem; color:#cbd5e1;">
                      ${
                        hasNaturalOpen
                          ? `Toque em uma vaga de <strong>${sel.pos}</strong> destacada em verde no campo abaixo!`
                          : `⚠️ Vagas de ${sel.pos} ocupadas! Toque em outra vaga vazia para improvisar ou volte para escolher outro jogador.`
                      }
                    </div>
                  </div>
                </div>
                <button class="ui-btn btn-primary" id="btn-back-to-team">
                  ⬅️ Voltar ao Time
                </button>`
              : `<div class="placing-player-info">
                  <div>
                    <div style="font-size:1rem; font-weight:900; color:#facc15;">
                      👁️ Seu Campo Atual (${pickedCount}/11 Escalados)
                    </div>
                    <div style="font-size:0.76rem; color:#cbd5e1;">
                      Toque em dois jogadores para inverter posições ou volte para a roleta.
                    </div>
                  </div>
                </div>
                <button class="ui-btn btn-primary" id="btn-back-to-team">
                  ⬅️ Voltar à Roleta
                </button>`
          }
        </div>

        ${buildPitchHTML()}
      `;

      document.getElementById("btn-back-to-team").addEventListener("click", () => {
        state.selectedPlayer = null;
        state.peekField = false;
        renderDraftWheelAndRoster(false);
      });

      container.querySelectorAll(".field-node").forEach((el) => {
        el.addEventListener("click", () => handleFieldSlotClick(el.getAttribute("data-slot")));
      });
      return;
    }

    renderDraftWheelAndRoster(false);
  }

  // TELA 3: TORNEIO FUTEBOL FRONTEIRA
  function renderTournamentScreen() {
    const container = document.getElementById("main-screen-container");
    if (!container) return;

    const t = state.tournament;
    const st = t.stages[t.stageIndex];
    const stats = calcSquadStats();

    const bracketHTML = t.stages
      .map((s, idx) => {
        const isUnlocked = idx <= t.stageIndex;
        let cls = "";
        if (s.finished) cls = s.won ? "passed-stage" : "lost-stage";
        else if (idx === t.stageIndex) cls = "active-stage";

        if (!isUnlocked) {
          return `
            <div class="bracket-step" style="opacity: 0.55;">
              <div style="width:32px; height:32px; border-radius:8px; background:#0f172a; border:1px dashed rgba(148,163,184,0.4); display:flex; align-items:center; justify-content:center;">
                🔒
              </div>
              <div style="min-width:0;">
                <div style="font-size:0.63rem; color:#94a3b8; font-weight:800; text-transform:uppercase;">${s.stageName}</div>
                <div style="font-size:0.75rem; font-weight:800; color:#94a3b8;">❓ A Definir</div>
              </div>
            </div>
          `;
        }

        return `
          <div class="bracket-step ${cls}">
            <img src="${s.oppTeam.emblem}" alt="" style="width:32px; height:32px; object-fit:contain;" />
            <div style="min-width:0;">
              <div style="font-size:0.63rem; color:#94a3b8; font-weight:800; text-transform:uppercase;">${s.stageName}</div>
              <div style="font-size:0.75rem; font-weight:800; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${s.oppTeam.name}</div>
              <div style="font-size:0.7rem; font-weight:900; color:${s.finished ? (s.won ? "#4ade80" : "#f87171") : "#facc15"};">
                ${s.finished ? `${s.userScore} x ${s.oppScore} ${s.won ? "✅" : "❌"}` : "🔥 Ao Vivo"}
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    const pct = Math.min(100, Math.round((st.minute / st.maxMinute) * 100));

    let footerActions = "";
    if (st.finished) {
      if (st.won && t.stageIndex === 3) {
        footerActions = `
          <div class="go-ready-banner" style="margin-top:8px;">
            <div style="font-size:2.2rem;">🏆⚡🎉</div>
            <h3 style="font-size:1.35rem; font-weight:900; color:#facc15;">
              CAMPEÃO DO FUTEBOL FRONTEIRA!!
            </h3>
            <p style="font-size:0.84rem; color:#e2e8f0; margin:6px 0 12px;">
              Sua Seleção de Inazuma Eleven (OVR ${stats.ovr} • Química ${stats.chem}%) venceu todas as etapas e levantou a taça!
            </p>
            <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
              <button class="ui-btn btn-go" id="btn-play-again-draft">🔄 Novo Jogo</button>
              <button class="ui-btn" id="btn-rematch-cup">⚽ Jogar Outro Torneio com Este Time</button>
            </div>
          </div>
        `;
      } else if (st.won) {
        const nextStage = t.stages[t.stageIndex + 1];
        footerActions = `
          <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(34,197,94,0.14); border:1.5px solid #22c55e; padding:12px 16px; border-radius:12px; flex-wrap:wrap; gap:10px;">
            <div>
              <strong style="color:#4ade80; font-size:0.92rem;">✅ Classificado para a ${nextStage.stageName}!</strong>
              <div style="font-size:0.76rem; color:#cbd5e1;">Toque ao lado para revelar o adversário da ${nextStage.stageName}!</div>
            </div>
            <button class="ui-btn btn-go" id="btn-next-round" style="padding:10px 18px;">
              ⏩ Ir para ${nextStage.stageName} →
            </button>
          </div>
        `;
      } else {
        footerActions = `
          <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(239,68,68,0.14); border:1.5px solid #ef4444; padding:12px 16px; border-radius:12px; flex-wrap:wrap; gap:10px;">
            <div>
              <strong style="color:#f87171; font-size:0.92rem;">💔 Eliminado na ${st.stageName} pelo ${st.oppTeam.name}!</strong>
              <div style="font-size:0.76rem; color:#cbd5e1;">Tente a revanche ou comece um novo jogo!</div>
            </div>
            <div style="display:flex; gap:8px;">
              <button class="ui-btn" id="btn-retry-stage">🔥 Revanche</button>
              <button class="ui-btn btn-go" id="btn-new-draft-after-loss">🔄 Novo Jogo</button>
            </div>
          </div>
        `;
      }
    }

    container.innerHTML = `
      <div class="bracket-row">${bracketHTML}</div>

      <div class="broadcast-card">
        <div class="broadcast-header">
          <div>
            <span style="font-size:0.72rem; font-weight:900; color:#facc15; text-transform:uppercase;">
              🏆 Futebol Fronteira • ${st.stageName}
            </span>
            <h3 style="font-size:1rem; color:#fff;">Sua Seleção vs ${st.oppTeam.name}</h3>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="ui-btn" id="btn-toggle-speed" style="padding:5px 10px; font-size:0.74rem;">
              ⏩ Velocidade: ${state.simSpeed}x
            </button>
            <div class="minute-clock" id="live-clock-text">
              ⏱️ ${st.minute}' ${st.finished ? "FIM" : ""}
            </div>
          </div>
        </div>

        <div class="time-bar-bg">
          <div class="time-bar-fill" id="live-bar-fill" style="width:${pct}%;"></div>
        </div>

        <div class="live-scoreboard">
          <div class="score-team">
            <div style="font-size:1.9rem;">⚡</div>
            <div style="font-weight:900; font-size:0.95rem;">Sua Seleção</div>
            <div style="font-size:0.72rem; color:#4ade80; font-weight:700;">OVR ${stats.ovr} • Quím. ${stats.chem}%</div>
          </div>

          <div class="score-digits">
            <span id="live-score-user">${st.userScore}</span>
            <span style="font-size:1.2rem; color:#64748b;">X</span>
            <span id="live-score-opp">${st.oppScore}</span>
          </div>

          <div class="score-team">
            <img class="score-emblem" src="${st.oppTeam.emblem}" alt="${st.oppTeam.name}" />
            <div style="font-weight:900; font-size:0.95rem;">${st.oppTeam.name}</div>
            <div style="font-size:0.72rem; color:#facc15; font-weight:700;">OVR ${Math.round(st.oppTeam.baseOvr + t.stageIndex * 1.5)}</div>
          </div>
        </div>

        ${
          st.penaltiesText
            ? `<div style="text-align:center; background:rgba(250,204,21,0.15); border:1px solid #facc15; padding:6px; border-radius:8px; font-weight:800; color:#fde047; font-size:0.82rem;">
                ⚽ ${st.penaltiesText}
              </div>`
            : ""
        }

        <div class="goals-columns">
          <div class="goals-list" id="live-goals-user">
            <div style="font-size:0.7rem; font-weight:800; color:#4ade80; text-transform:uppercase;">
              ⚽ Gols da Sua Seleção
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
                      <div style="font-weight:800; color:#fff;">⚽ ${g.minute}' ${g.name}</div>
                      <div style="font-size:0.68rem; color:${g.isHissatsu ? "#86efac" : "#cbd5e1"};">
                        ${g.isHissatsu ? `⚡ Hissatsu: ${g.shotLabel}` : `👟 ${g.shotLabel}`}
                      </div>
                    </div>
                  </div>
                `
                    )
                    .join("")
            }
          </div>

          <div class="goals-list" id="live-goals-opp">
            <div style="font-size:0.7rem; font-weight:800; color:#f87171; text-transform:uppercase;">
              ⚽ Gols de ${st.oppTeam.name}
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
                      <div style="font-weight:800; color:#fff;">⚽ ${g.minute}' ${g.name}</div>
                      <div style="font-size:0.68rem; color:${g.isHissatsu ? "#fca5a5" : "#cbd5e1"};">
                        ${g.isHissatsu ? `⚡ Hissatsu: ${g.shotLabel}` : `👟 ${g.shotLabel}`}
                      </div>
                    </div>
                  </div>
                `
                    )
                    .join("")
            }
          </div>
        </div>

        <div class="narration-history-box">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.74rem; font-weight:900; color:#facc15; text-transform:uppercase;">
              🎙️ Narração ao Vivo & Histórico (<span id="live-narration-count">${st.narration.length}</span>)
            </span>
            <span style="font-size:0.66rem; color:#94a3b8;">
              ⚽ Chutes • 💨 Dribles • 🛡️ Roubos • 🧤 Defesas
            </span>
          </div>
          <div class="narration-feed" id="live-narration-feed">
            ${st.narration
              .map((item) => `<div class="narration-item ${item.cls}">${item.text}</div>`)
              .join("")}
          </div>
        </div>

        ${footerActions}
      </div>
    `;

    const speedBtn = document.getElementById("btn-toggle-speed");
    if (speedBtn) {
      speedBtn.addEventListener("click", () => {
        state.simSpeed = state.simSpeed === 1 ? 2 : state.simSpeed === 2 ? 4 : 1;
        speedBtn.textContent = `⏩ Velocidade: ${state.simSpeed}x`;
        if (st.running && !st.finished) {
          startMatchInterval();
        }
      });
    }

    const nextRoundBtn = document.getElementById("btn-next-round");
    if (nextRoundBtn) {
      nextRoundBtn.addEventListener("click", () => {
        runLiveMatchSimulation(t.stageIndex + 1);
      });
    }

    const retryBtn = document.getElementById("btn-retry-stage");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        runLiveMatchSimulation(t.stageIndex);
      });
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
  }

  function renderMainScreen() {
    renderHeaderAndBonds();
    if (state.phase === "menu") {
      renderStartMenuScreen();
    } else if (state.phase === "tournament") {
      renderTournamentScreen();
    } else {
      renderDraftScreen();
    }
  }

  function renderAll() {
    renderMainScreen();
  }

  function goToMenu() {
    if (state.tournament.timerId) clearInterval(state.tournament.timerId);
    state.phase = "menu";
    state.squad = {};
    state.selectedPlayer = null;
    state.peekField = false;
    state.swapSlotId = null;
    renderAll();
  }

  function init() {
    const resetBtn = document.getElementById("btn-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => goToMenu());
    }

    const autoBtn = document.getElementById("btn-auto-draft");
    if (autoBtn) {
      autoBtn.addEventListener("click", () => {
        if (state.phase === "menu") state.phase = "draft";
        const openSlots = getOpenSlots();
        const pickedIds = getPickedPlayerIds();
        openSlots.forEach((slot) => {
          const candidates = [];
          DB.teams.forEach((t) => {
            t.players.forEach((p) => {
              if (!pickedIds.has(p.id) && p.pos === slot.role) {
                candidates.push({ ...p, teamId: t.id, teamName: t.name, teamEmblem: t.emblem });
              }
            });
          });
          if (candidates.length > 0) {
            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            state.squad[slot.id] = pick;
            pickedIds.add(pick.id);
          }
        });
        state.selectedPlayer = null;
        state.peekField = false;
        renderAll();
      });
    }

    renderAll();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
