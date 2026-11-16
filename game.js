// Inazuma Eleven 7x0 — Engine v3 (Sem Piscar, Menu Inicial, Roleta Animada e Química por Amizade/Time)

(function () {
  const DB = window.INAZUMA_DB;
  const UI = window.INAZUMA_UI || {};

  function posIconHTML(role, small = false) {
    const src = UI["pos" + role];
    if (!src) return `<span>${role}</span>`;
    return `<img class="${small ? "pos-icon-sm" : "pos-icon-img"}" src="${src}" alt="${role}" title="${role}" />`;
  }

  function elemIconHTML(elemName, cls = "elem-icon-img") {
    const map = { Fogo: "elemFire", Vento: "elemWind", Floresta: "elemForest", Montanha: "elemMountain" };
    const src = UI[map[elemName]];
    if (!src) return `<span>${DB.elements[elemName]?.icon || "⚡"}</span>`;
    return `<img class="${cls}" src="${src}" alt="${elemName}" title="${elemName}" />`;
  }

  function moveIconHTML(cat) {
    const src = UI["move" + cat];
    if (!src) return "";
    return `<img class="move-icon-img" src="${src}" alt="${cat}" />`;
  }

  function captainIconHTML() {
    return UI.captain ? `<img class="captain-icon-img" src="${UI.captain}" alt="Capitão" title="Capitão" />` : "";
  }

  function formationIconHTML() {
    return UI.formation ? `<img class="form-icon-img" src="${UI.formation}" alt="" />` : "";
  }

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
    },
    {
      id: "trio_ares_orion",
      name: "🔥 Trindade Ares/Orion (Asuto, Haizaki, Nosaka)",
      members: ["Inamori Asuto", "Haizaki Ryouhei", "Nosaka Yuuma"],
      minCount: 2,
      chemPerMatch: 15
    },
    {
      id: "laco_outei_seishou",
      name: "⚔️ Rivais & Parceiros (Nosaka, Nishikage, Haizaki, Mizukamiya, Kira Hiroto)",
      members: ["Nosaka Yuuma", "Nishikage Seiya", "Haizaki Ryouhei", "Mizukamiya Seiryuu", "Kira Hiroto"],
      minCount: 2,
      chemPerMatch: 12
    },
    {
      id: "laco_orion_amigos",
      name: "🌌 Estrelas de Orion (Ichihoshi, Froy, Malik, Asuto, Yurika)",
      members: ["Ichihoshi Mitsuru", "Ichihoshi Hikaru", "Froy Girikanan", "Malik Kuabel", "Inamori Asuto", "Yurika Beor"],
      minCount: 2,
      chemPerMatch: 13
    },
    {
      id: "earth_eleven_galaxy",
      name: "🌍 Earth Eleven (Ibuki, Matatagi, Konoha, Minaho, Manabe, Tenma, Tsurugi, Shindou)",
      members: [
        "Ibuki Munemasa",
        "Matatagi Hayato",
        "Morimura Konoha",
        "Minaho Kazuto",
        "Manabe Jinichirou",
        "Matsukaze Tenma",
        "Tsurugi Kyousuke",
        "Shindou Takuto"
      ],
      minCount: 2,
      chemPerMatch: 12
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
    spinTimerId: null,
    usedTeamIds: [],
    simSpeed: 1, // 1 = 420ms/min, 2 = 200ms/min, 4 = 80ms/min
    tournament: {
      stageIndex: 0,
      stages: [],
      timerId: null,
      clashTimer1: null,
      clashTimer2: null,
      pendingClashFinish: null
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
    return Math.max(45, player.ovr - (adj ? 6 : 14));
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
    if (p.pos === "GK" && p.moves.GK?.length) parts.push(`${moveIconHTML("GK")} <span>${p.moves.GK[0]}</span>`);
    if (p.moves.SH?.length) parts.push(`${moveIconHTML("SH")} <span>${p.moves.SH[0]}</span>`);
    if (p.moves.OF?.length && parts.length < 2) parts.push(`${moveIconHTML("OF")} <span>${p.moves.OF[0]}</span>`);
    if (p.moves.DF?.length && parts.length < 2) parts.push(`${moveIconHTML("DF")} <span>${p.moves.DF[0]}</span>`);
    if (p.moves.GK?.length && parts.length === 0) parts.push(`${moveIconHTML("GK")} <span>${p.moves.GK[0]}</span>`);
    return parts.slice(0, 2).join(" ") || `<span>${p.hissatsu}</span>`;
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
    let correctPosCount = 0;

    slots.forEach((s) => {
      const p = state.squad[s.id];
      if (!p) return;
      count++;
      if (p.pos === s.role) correctPosCount++;
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
    let bondsPower = 0;
    const activeBonds = [];

    // 0. Química & Poder por Posições Corretas (Regra Tática!)
    // +2% de Química por jogador na posição exata; ao completar 11/11 posições corretas -> Bônus Formação Perfeita (+25% Química e +220 Poder!)
    if (count > 0) {
      if (correctPosCount === 11) {
        chem += 25;
        bondsPower += 220;
        activeBonds.push({
          type: "perfect-formation",
          label: `📐 Formação Perfeita 11/11 (+25% Quím • +220 Poder)`
        });
      } else {
        const posChem = correctPosCount * 2;
        const posPwr = correctPosCount * 10;
        const improvised = count - correctPosCount;
        chem += posChem;
        bondsPower += posPwr;
        activeBonds.push({
          type: improvised > 0 ? "warn-pos" : "team",
          label:
            improvised > 0
              ? `⚠️ Posições: ${correctPosCount}/${count} (${improvised} improvisado = -OVR e sem bônus 11/11!)`
              : `📐 Posições Corretas: ${correctPosCount}/11 (+${posChem}% Quím • Faça 11/11 p/ +25% e +220 Poder!)`
        });
      }
    }

    // 1. Química & Poder por Mesmo Time (Colegas de Clube/Escola)
    Object.keys(teamsCount).forEach((tId) => {
      const c = teamsCount[tId];
      if (c >= 2) {
        const chemBonus = (c - 1) * 14;
        const pwrBonus = (c - 1) * 85;
        chem += chemBonus;
        bondsPower += pwrBonus;
        activeBonds.push({
          type: "team",
          label: `🏟️ ${c}x ${teamNames[tId]} (+${chemBonus}% • +${pwrBonus} Poder)`
        });
      }
    });

    // 2. Química & Poder por Laços de Amizade / Duplas e Trios do Anime
    FRIENDSHIP_BONDS.forEach((bond) => {
      const matched = bond.members.filter((m) => fullNamesInSquad.has(m));
      if (matched.length >= bond.minCount) {
        const chemBonus = (matched.length - 1) * bond.chemPerMatch;
        const pwrBonus = (matched.length - 1) * 120;
        chem += chemBonus;
        bondsPower += pwrBonus;
        activeBonds.push({
          type: "friendship",
          label: `${bond.name} (+${chemBonus}% • +${pwrBonus} Poder)`
        });
      }
    });

    // 3. Química & Poder por Ressonância Elemental (3+ jogadores do mesmo elemento)
    Object.keys(elemsCount).forEach((el) => {
      const c = elemsCount[el];
      if (c >= 3) {
        const chemBonus = (c - 2) * 7;
        const pwrBonus = (c - 2) * 55;
        chem += chemBonus;
        bondsPower += pwrBonus;
        const icon = DB.elements[el]?.icon || "⚡";
        activeBonds.push({
          type: "element",
          label: `${icon} ${c}x Afinidade ${el} (+${chemBonus}% • +${pwrBonus} Poder)`
        });
      }
    });

    chem = Math.min(100, Math.max(0, chem));

    // A Química dá bônus direto no Overall Geral do time (+0 a +3 OVR), mais +2 OVR se fechar 11/11 na posição certa!
    const chemOvrBonus = chem >= 80 ? 3 : chem >= 55 ? 2 : chem >= 30 ? 1 : 0;
    const perfectPosOvrBonus = correctPosCount === 11 ? 2 : 0;
    const ovr = count > 0 ? Math.min(99, Math.round(sumOvr / count) + chemOvrBonus + perfectPosOvrBonus) : 0;

    // Poder Final Total = Soma dos OVRs individuais + Bônus de Química + Bônus de Formação Perfeita/Duplas/Trios/Clubes/Elementos
    const chemPower = chem * 3;
    const basePower = Math.round(sumOvr);
    const power = count > 0 ? basePower + chemPower + bondsPower : 0;

    return {
      count,
      correctPosCount,
      ovr,
      power,
      basePower,
      chemPower,
      bondsPower,
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

    if (state.spinTimerId) {
      clearTimeout(state.spinTimerId);
      state.spinTimerId = null;
    }

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
              <button class="ie-cmd-btn ie-cmd-gold" id="btn-reroll-team" ${state.rerollsLeft <= 0 ? "disabled" : ""}>
                <span>Girar Outro (${state.rerollsLeft})</span>
              </button>
            </div>
          </div>

          <div class="roster-grid">
            ${sortedPlayers
              .map((p) => {
                const alreadyPicked = pickedIds.has(p.id);
                const hasNaturalSlot = openRoles.has(p.pos);
                const movesSummary = formatPlayerMovesSummary(p);
                const hasLink = !alreadyPicked && hasAffinityWithCurrentSquad({ ...p, teamId: team.id });

                return `
                  <div class="roster-player-card ${alreadyPicked ? "disabled-card" : ""} ${!hasNaturalSlot && !alreadyPicked ? "pos-full-card" : ""}"
                       data-player-id="${p.id}">
                    <img class="roster-sprite" src="${p.sprite}" alt="${p.name}" />
                    <div class="roster-meta">
                      <div class="roster-name">${p.isCaptain ? captainIconHTML() : ""} <span>#${p.number} ${p.name}</span></div>
                      <div class="roster-sub">${movesSummary}</div>
                      <div class="roster-badges">
                        ${posIconHTML(p.pos, true)}
                        <span class="ovr-tag">${state.hideOvrBeforePick && !alreadyPicked ? "OVR ??" : `OVR ${p.ovr}`}</span>
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
              ${posIconHTML(slot.role, true)}
              <span style="font-size:1.15rem; color:rgba(255,255,255,0.65); margin:1px 0;">＋</span>
              <span style="font-size:0.6rem; color:#f8fafc; font-weight:800;">${hintText}</span>
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
            ${elemIconHTML(p.element, "node-elem-mini")}
            <img class="node-avatar" src="${p.sprite}" alt="${p.name}" />
            <div class="node-name">${p.name}</div>
            <div style="display:flex; align-items:center; gap:3px; margin-top:1px;">
              ${posIconHTML(slot.role, true)}
              <span class="node-slot-label">${slot.label}${isImprovised ? "⚠️" : ""}</span>
            </div>
          </div>
        `;
      })
      .join("");

    return `
      <div class="soccer-pitch">
        <div class="pitch-penalty-top"></div>
        <div class="pitch-half-line"></div>
        <div class="pitch-center-circle">
          ${UI.raimonEmblem ? `<img class="pitch-center-emblem" src="${UI.raimonEmblem}" alt="" />` : "⚡"}
        </div>
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
    return `<div class="narration-item ${item.cls || ""}">${avatarsHTML}<div class="nar-text">${item.text}</div></div>`;
  }

  // Insere apenas 1 linha nova no topo do histórico de narração sem tocar no resto da página!
  function prependNarrationLine(st, cls, text, actor = null, target = null) {
    const item = { cls, text, actor, target };
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
      listEl.insertAdjacentHTML(
        "beforeend",
        `<div class="goal-item ${side === "user" ? "user-goal" : "opp-goal"}">
          <img src="${goalObj.sprite}" alt="" />
          <div>
            <div style="font-weight:800; color:#fff;">${goalObj.minute}' ${goalObj.name}</div>
            <div style="font-size:0.68rem; color:${color}; display:flex; align-items:center; gap:4px;">
              ${goalObj.isHissatsu ? `${moveIconHTML("SH")} <span>${goalObj.shotLabel}</span>` : `<span>${goalObj.shotLabel}</span>`}
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
    if (state.tournament.clashTimer1) {
      clearTimeout(state.tournament.clashTimer1);
      state.tournament.clashTimer1 = null;
    }
    if (state.tournament.clashTimer2) {
      clearTimeout(state.tournament.clashTimer2);
      state.tournament.clashTimer2 = null;
    }
    if (resolvePending && typeof state.tournament.pendingClashFinish === "function") {
      const fn = state.tournament.pendingClashFinish;
      state.tournament.pendingClashFinish = null;
      const slot = document.getElementById("shot-clash-slot");
      if (slot) {
        slot.innerHTML = "";
        slot.style.display = "none";
      }
      fn(true);
    } else {
      state.tournament.pendingClashFinish = null;
      const slot = document.getElementById("shot-clash-slot");
      if (slot) {
        slot.innerHTML = "";
        slot.style.display = "none";
      }
      const goalsBox = document.getElementById("goals-columns-box");
      if (goalsBox) goalsBox.style.display = "";
    }
  }

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

  function handleMinuteEndBoundaries(st, ovrDiff) {
    if (st.minute === 45) {
      prependNarrationLine(
        st,
        "",
        `⏱️ 45' Fim do 1º Tempo! Placar parcial: Dream Team ${st.userScore} x ${st.oppScore} ${st.oppTeam.name}.`
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
      clearTournamentTimers(false);
      st.running = false;
      st.finished = true;

      if (st.userScore === st.oppScore) {
        const userWinPen = Math.random() < (0.52 + ovrDiff * 0.015);
        const uPen = userWinPen ? 5 : 4;
        const oPen = userWinPen ? 4 : 5;
        st.won = userWinPen;
        st.penaltiesText = `Decisão por Pênaltis: Dream Team ${uPen} x ${oPen} ${st.oppTeam.name}`;
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
          `🏁 ${st.minute}' APITO FINAL! Dream Team ${st.userScore} x ${st.oppScore} ${st.oppTeam.name}!`
        );
      }

      renderTournamentScreen();
      return true;
    }
    return false;
  }

  function playShotClashAndContinue(st, clash, applyOutcome, ovrDiff) {
    // Somente no modo 1x ocorre a animação da bola pegando fogo!
    if (state.simSpeed !== 1) {
      applyOutcome();
      handleMinuteEndBoundaries(st, ovrDiff);
      return;
    }

    // Pausa o relógio para a cena de duelo
    if (state.tournament.timerId) {
      clearInterval(state.tournament.timerId);
      state.tournament.timerId = null;
    }

    const slotEl = document.getElementById("shot-clash-slot");
    if (!slotEl) {
      applyOutcome();
      if (!handleMinuteEndBoundaries(st, ovrDiff)) startMatchInterval();
      return;
    }

    const shooterCls = clash.shooter.side === "user" ? "side-user" : "side-opp";
    const defCls = clash.defender.side === "user" ? "side-user" : "side-opp";
    const defRoleText = clash.defCategory === "DF" ? "ZAGA • BLOQUEIO" : "GOLEIRO";

    const goalsBox = document.getElementById("goals-columns-box");
    if (goalsBox) goalsBox.style.display = "none";
    slotEl.style.display = "block";

    slotEl.innerHTML = `
      <div class="shot-clash-stage">
        <div class="clash-arena-grid">
          <div class="clash-fighter">
            <img class="clash-avatar ${shooterCls}" src="${clash.shooter.sprite}" alt="${clash.shooter.name}" />
            <div class="clash-fighter-name">${clash.shooter.name}</div>
            <span class="clash-role-badge">CHUTE</span>
          </div>

          <div class="clash-center-lane">
            <div class="clash-move-pill clash-move-shoot">
              ${moveIconHTML("SH")} <span>${clash.shootLabel}</span>
            </div>

            <div class="clash-track">
              <div class="fireball-runner">
                <div class="fireball-trail"></div>
                <div class="fireball-orb">${buildFireballSVG()}</div>
              </div>
            </div>

            <div class="clash-move-pill clash-move-def">
              ${moveIconHTML(clash.defCategory)} <span>${clash.defMoveName}</span>
            </div>
          </div>

          <div class="clash-fighter">
            <img class="clash-avatar ${defCls}" src="${clash.defender.sprite}" alt="${clash.defender.name}" />
            <div class="clash-fighter-name">${clash.defender.name}</div>
            <span class="clash-role-badge">${defRoleText}</span>
          </div>
        </div>
        <div id="clash-result-mount"></div>
      </div>
    `;

    const finishClash = (skipRestart = false) => {
      state.tournament.pendingClashFinish = null;
      const mountSlot = document.getElementById("shot-clash-slot");
      if (mountSlot) {
        mountSlot.innerHTML = "";
        mountSlot.style.display = "none";
      }
      const restoreGoalsBox = document.getElementById("goals-columns-box");
      if (restoreGoalsBox) restoreGoalsBox.style.display = "";
      applyOutcome();
      const matchEnded = handleMinuteEndBoundaries(st, ovrDiff);
      if (!matchEnded && !skipRestart && st.running && !st.finished) {
        startMatchInterval();
      }
    };

    state.tournament.pendingClashFinish = finishClash;

    state.tournament.clashTimer1 = setTimeout(() => {
      const resMount = document.getElementById("clash-result-mount");
      if (resMount) {
        const resCls = clash.isGoal ? "res-goal" : "res-saved";
        const resText = clash.isGoal
          ? "⚽ GOOOL!!"
          : clash.defCategory === "DF"
          ? "🛡️ BLOQUEADO PELA ZAGA!"
          : "🧤 DEFENDEU!";
        resMount.innerHTML = `
          <div class="clash-result-overlay ${resCls}">
            <div class="clash-result-banner">${resText}</div>
          </div>
        `;
      }

      state.tournament.clashTimer2 = setTimeout(() => {
        finishClash(false);
      }, 1350);
    }, 2450);
  }

  function startMatchInterval() {
    if (state.tournament.timerId) clearInterval(state.tournament.timerId);

    const stageIdx = state.tournament.stageIndex;
    const st = state.tournament.stages[stageIdx];
    if (!st || st.finished) return;

    const userStats = calcSquadStats();
    const oppOvr = st.oppTeam.baseOvr + stageIdx * 1.5;
    const oppPower = Math.round(oppOvr * 11 + 180 + stageIdx * 115);

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
    const userPureDefs = slots
      .filter((s) => s.role === "DF")
      .map((s) => state.squad[s.id])
      .filter(Boolean);
    const userGk = state.squad["GK"] || userAll[0];

    const oppAll = st.oppTeam.players;
    const oppAttackers = oppAll.filter((p) => p.pos === "FW" || p.pos === "MF");
    const oppDefenders = oppAll.filter((p) => p.pos === "DF" || p.pos === "MF");
    const oppPureDefs = oppAll.filter((p) => p.pos === "DF");
    const oppGk = oppAll.find((p) => p.pos === "GK") || oppAll[0];

    // Diferença combinada de OVR e Poder Final (duplas, trios e química pesam na partida!)
    const ovrDiff = userStats.ovr - oppOvr;
    const powerEdge = (userStats.power - oppPower) / 140;
    const totalEdge = ovrDiff * 0.65 + powerEdge;
    const userGoalProbPerMin = Math.max(0.008, Math.min(0.048, 0.022 + totalEdge * 0.0022));
    const oppGoalProbPerMin = Math.max(0.006, Math.min(0.042, 0.018 - totalEdge * 0.0018));

    state.tournament.timerId = setInterval(() => {
      st.minute++;

      // Atualiza apenas o texto do relógio e a largura da barra (ZERO piscar!)
      const clockEl = document.getElementById("live-clock-text");
      const barEl = document.getElementById("live-bar-fill");
      if (clockEl) clockEl.textContent = `${st.minute}'`;
      if (barEl) {
        const pct = Math.min(100, Math.round((st.minute / st.maxMinute) * 100));
        barEl.style.width = `${pct}%`;
      }

      // 1) Chance de Gol da Sua Seleção
      if (Math.random() < userGoalProbPerMin) {
        const scorer =
          userAttackers[Math.floor(Math.random() * userAttackers.length)] || userAll[0];
        const shotInfo = buildGoalShotLabel(scorer);

        // 25% das vezes um zagueiro tenta bloquear o chute antes, 75% vai direto no goleiro
        const vsDefender = oppPureDefs.length > 0 && Math.random() < 0.25;
        const defenderObj = vsDefender
          ? oppPureDefs[Math.floor(Math.random() * oppPureDefs.length)]
          : oppGk;
        const defCategory = vsDefender ? "DF" : "GK";
        const defMoveName =
          pickPlayerMove(defenderObj, defCategory) ||
          (defCategory === "DF" ? "Bloqueio de Corpo" : "Defesa Direta");

        const clash = {
          minute: st.minute,
          shooter: { name: scorer.name, sprite: scorer.sprite, side: "user" },
          defender: { name: defenderObj.name, sprite: defenderObj.sprite, side: "opp" },
          defCategory,
          shootLabel: shotInfo.label,
          isShootHissatsu: shotInfo.isHissatsu,
          defMoveName,
          isGoal: true
        };

        playShotClashAndContinue(
          st,
          clash,
          () => {
            st.userScore++;
            const goalObj = {
              minute: clash.minute,
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
                ? `⚽ ${clash.minute}' GOOOL DO DREAM TEAM! ${scorer.name} disparou 【${shotInfo.label}】 e furou 【${defMoveName}】 de ${defenderObj.name}! (${st.userScore} x ${st.oppScore})`
                : `⚽ ${clash.minute}' GOOOL DO DREAM TEAM! ${scorer.name} superou ${defenderObj.name} com um ${shotInfo.label.toLowerCase()}! (${st.userScore} x ${st.oppScore})`,
              { name: scorer.name, sprite: scorer.sprite, side: "user" },
              { name: defenderObj.name, sprite: defenderObj.sprite, side: "opp" }
            );
          },
          ovrDiff
        );
        return;
      }
      // 2) Chance de Gol do Adversário
      else if (Math.random() < oppGoalProbPerMin) {
        const oppScorer =
          oppAttackers[Math.floor(Math.random() * oppAttackers.length)] || oppAll[0];
        const shotInfo = buildGoalShotLabel(oppScorer);

        const vsDefender = userPureDefs.length > 0 && Math.random() < 0.25;
        const defenderObj = vsDefender
          ? userPureDefs[Math.floor(Math.random() * userPureDefs.length)]
          : userGk;
        const defCategory = vsDefender ? "DF" : "GK";
        const defMoveName =
          pickPlayerMove(defenderObj, defCategory) ||
          (defCategory === "DF" ? "Bloqueio de Corpo" : "Defesa Direta");

        const clash = {
          minute: st.minute,
          shooter: { name: oppScorer.name, sprite: oppScorer.sprite, side: "opp" },
          defender: { name: defenderObj.name, sprite: defenderObj.sprite, side: "user" },
          defCategory,
          shootLabel: shotInfo.label,
          isShootHissatsu: shotInfo.isHissatsu,
          defMoveName,
          isGoal: true
        };

        playShotClashAndContinue(
          st,
          clash,
          () => {
            st.oppScore++;
            const goalObj = {
              minute: clash.minute,
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
                ? `💥 ${clash.minute}' GOL DE ${st.oppTeam.name.toUpperCase()}! ${oppScorer.name} usou 【${shotInfo.label}】 e venceu 【${defMoveName}】 de ${defenderObj.name}! (${st.userScore} x ${st.oppScore})`
                : `💥 ${clash.minute}' GOL DE ${st.oppTeam.name.toUpperCase()}! ${oppScorer.name} venceu ${defenderObj.name} com um ${shotInfo.label.toLowerCase()}! (${st.userScore} x ${st.oppScore})`,
              { name: oppScorer.name, sprite: oppScorer.sprite, side: "opp" },
              { name: defenderObj.name, sprite: defenderObj.sprite, side: "user" }
            );
          },
          ovrDiff
        );
        return;
      }
      // 3) Lances de Narração a cada 10 minutos (Dribles OF, Roubos DF, Defesas GK e Bloqueios de Chute DF!)
      else if (st.minute % 10 === 0 && st.minute !== 90) {
        const rollType = Math.random();

        if (rollType < 0.28) {
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
                : `💨 ${st.minute}' [Jogada] ${dribbler.name} aplicou um drible rápido em ${marker.name} e armou o ataque!`,
              { name: dribbler.name, sprite: dribbler.sprite, side: isUserPlay ? "user" : "opp" },
              { name: marker.name, sprite: marker.sprite, side: isUserPlay ? "opp" : "user" }
            );
          }
        } else if (rollType < 0.54) {
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
                : `🛡️ ${st.minute}' [Defesa] ${defender.name} antecipou a jogada e roubou a bola limpa de ${runner.name}!`,
              { name: defender.name, sprite: defender.sprite, side: isUserDef ? "user" : "opp" },
              { name: runner.name, sprite: runner.sprite, side: isUserDef ? "opp" : "user" }
            );
          }
        } else {
          // Chute defendido pelo Goleiro (GK) OU Bloqueado pela Zaga (DF)!
          const isUserSave = Math.random() < 0.55;
          const isDefenseBlock =
            Math.random() < 0.45 &&
            (isUserSave ? userPureDefs.length > 0 : oppPureDefs.length > 0);

          const defenderObj = isDefenseBlock
            ? isUserSave
              ? userPureDefs[Math.floor(Math.random() * userPureDefs.length)]
              : oppPureDefs[Math.floor(Math.random() * oppPureDefs.length)]
            : isUserSave
            ? userGk
            : oppGk;
          const shooter = isUserSave
            ? oppAttackers[Math.floor(Math.random() * oppAttackers.length)]
            : userAttackers[Math.floor(Math.random() * userAttackers.length)];

          if (defenderObj && shooter) {
            const defCategory = isDefenseBlock ? "DF" : "GK";
            const defMoveName =
              pickPlayerMove(defenderObj, defCategory) ||
              (isDefenseBlock ? "Bloqueio de Corpo" : "Defesa Espetacular");
            const shMove = pickPlayerMove(shooter, "SH");
            const shootLabel = shMove || "Chute Forte";

            const clash = {
              minute: st.minute,
              shooter: { name: shooter.name, sprite: shooter.sprite, side: isUserSave ? "opp" : "user" },
              defender: { name: defenderObj.name, sprite: defenderObj.sprite, side: isUserSave ? "user" : "opp" },
              defCategory,
              shootLabel,
              isShootHissatsu: Boolean(shMove),
              defMoveName,
              isGoal: false
            };

            playShotClashAndContinue(
              st,
              clash,
              () => {
                const shotPart = shMove ? `o chute 【${shMove}】 de ${shooter.name}` : `o chute forte de ${shooter.name}`;
                if (isDefenseBlock) {
                  prependNarrationLine(
                    st,
                    "nar-steal",
                    `🛡️ ${clash.minute}' [Bloqueio da Zaga] ${defenderObj.name} entrou na frente com 【${defMoveName}】 e bloqueou ${shotPart}!`,
                    { name: defenderObj.name, sprite: defenderObj.sprite, side: isUserSave ? "user" : "opp" },
                    { name: shooter.name, sprite: shooter.sprite, side: isUserSave ? "opp" : "user" }
                  );
                } else {
                  prependNarrationLine(
                    st,
                    "nar-save",
                    `🧤 ${clash.minute}' [Defesa de Goleiro] ${defenderObj.name} acionou 【${defMoveName}】 e espalmou ${shotPart}!`,
                    { name: defenderObj.name, sprite: defenderObj.sprite, side: isUserSave ? "user" : "opp" },
                    { name: shooter.name, sprite: shooter.sprite, side: isUserSave ? "opp" : "user" }
                  );
                }
              },
              ovrDiff
            );
            return;
          }
        }
      }

      handleMinuteEndBoundaries(st, ovrDiff);
    }, getTickMs());
  }

  function runLiveMatchSimulation(stageIdx) {
    clearTournamentTimers(false);
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
    const pwrEl = document.getElementById("val-power");
    if (pwrEl) pwrEl.textContent = stats.power.toLocaleString("pt-BR");
    document.getElementById("val-ovr").textContent = stats.ovr;
    document.getElementById("val-atk").textContent = stats.atk;
    document.getElementById("val-mid").textContent = stats.mid;
    document.getElementById("val-def").textContent = stats.def;
    document.getElementById("val-chem").textContent = `${stats.chem}%`;

    const bondsBar = document.getElementById("bonds-bar");
    if (bondsBar) {
      if (stats.activeBonds.length === 0) {
        bondsBar.innerHTML = `<span style="color:#93c5fd;">📐 <strong>Dica Tática:</strong> Escale todos os <strong>11 na posição correta</strong> para ganhar <strong>+25% Química e +220 Poder</strong>! Duplas, trios do anime e colegas do mesmo time também somam Química e Poder!</span>`;
      } else {
        bondsBar.innerHTML =
          `<strong style="color:#38bdf8; margin-right:4px;">🤝 Bônus & Laços:</strong>` +
          stats.activeBonds
            .map(
              (b) =>
                `<span class="bond-tag ${b.type === "friendship" ? "friendship" : b.type === "perfect-formation" ? "perfect-formation" : b.type === "warn-pos" ? "warn-pos" : ""}">${b.label}</span>`
            )
            .join("");
      }
    }
  }

  // TELA 1: MENU INICIAL ESTILO JOGO
  function renderStartMenuScreen() {
    const container = document.getElementById("main-screen-container");
    if (!container) return;

    const stadiumStyle = UI.stadiumBg ? `background-image: url('${UI.stadiumBg}');` : "";

    container.innerHTML = `
      <div class="start-menu-card">
        <div class="start-hero-banner" style="${stadiumStyle}">
          <div class="start-hero-overlay"></div>
          <div class="start-hero-content">
            ${UI.ieLogo ? `<img class="start-ie-logo" src="${UI.ieLogo}" alt="Inazuma Eleven" />` : `<h2>INAZUMA ELEVEN</h2>`}
            <div class="start-title-ribbon">DREAM TEAM • FUTEBOL FRONTEIRA</div>
          </div>
        </div>

        <div class="start-body">
          <p>
            Gire a roleta entre <strong>57 times</strong> de todas as sagas, escale 1 jogador por clube sorteado e conquiste o <strong>Futebol Fronteira</strong>!
          </p>
          <div style="background:rgba(37,99,235,0.16); border:1px solid rgba(96,165,250,0.4); border-radius:8px; padding:9px 12px; margin-top:10px; font-size:0.74rem; color:#dbeafe; line-height:1.4; text-align:left;">
            ⚡ <strong style="color:#facc15;">Como somar Poder Final & Química:</strong><br/>
            • <strong>Posição Certa:</strong> +2% Quím por jogador e <strong style="color:#86efac;">+25% Quím / +220 Poder / +2 OVR</strong> se todos os 11 estiverem na posição correta! (Improvisar tira até -14 OVR)<br/>
            • <strong>Duplas/Trios & Mesmo Time:</strong> Amigos do anime e colegas de escola somam ainda mais Química e Poder Final!
          </div>

          <div class="option-group">
            <label>${captainIconHTML()} 1. Escolha a Dificuldade:</label>
            <div class="difficulty-grid">
              <div class="diff-card ${!state.hideOvrBeforePick ? "selected" : ""}" data-diff="visible">
                <strong>${elemIconHTML("Vento")} Modo Fácil (Com Overall)</strong>
                <span>Mostra o Overall dos jogadores do time sorteado antes de você escolher.</span>
              </div>
              <div class="diff-card ${state.hideOvrBeforePick ? "selected" : ""}" data-diff="hidden">
                <strong>${elemIconHTML("Fogo")} Modo Difícil (Sem Overall)</strong>
                <span>O Overall fica oculto na lista e só é revelado quando você escala no campo!</span>
              </div>
            </div>
          </div>

          <div class="option-group">
            <label>${formationIconHTML()} 2. Escolha a Formação Tática:</label>
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
            COMEÇAR JOGO E GIRAR ROLETA!
          </button>
        </div>
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
          ${UI.raimonEmblem ? `<img src="${UI.raimonEmblem}" alt="Dream Team" style="width:52px; height:52px; object-fit:contain; margin-bottom:4px;" />` : ""}
          <h2 style="font-size:1.35rem; font-weight:900; color:#4ade80;">
            DREAM TEAM COMPLETO!
          </h2>
          <div style="font-size:0.95rem; font-weight:900; color:#fed7aa; margin-top:4px;">
            ⚡ PODER FINAL: ${stats.power.toLocaleString("pt-BR")} PTS &nbsp;•&nbsp; OVR ${stats.ovr} &nbsp;•&nbsp; QUÍMICA ${stats.chem}%
          </div>
          <div style="font-size:0.74rem; color:#93c5fd; margin-top:2px;">
            (Base Elenco: ${stats.basePower} + Química: +${stats.chemPower} + Duplas/Trios/Clubes: +${stats.bondsPower})
          </div>
          <p style="font-size:0.82rem; color:#dbeafe; max-width:560px; margin:8px auto 10px;">
            Toque em dois jogadores no campo se quiser trocar posições ou clique em <strong>DAR GO!</strong> para o Futebol Fronteira!
          </p>
          <button class="ie-cmd-btn ie-cmd-green" id="btn-start-go" style="padding:13px 28px; font-size:1rem;">
            <span>DAR GO! — INICIAR FUTEBOL FRONTEIRA</span>
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
                      POSICIONANDO NO CAMPO (${pickedCount + 1} DE 11)
                    </div>
                    <div style="font-size:1.05rem; font-weight:900; color:#fff; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                      <span>#${sel.number} ${sel.name}</span> ${posIconHTML(sel.pos, true)} ${elemIconHTML(sel.element)}
                    </div>
                    <div style="font-size:0.74rem; color:#dbeafe; margin-top:2px;">
                      ${
                        hasNaturalOpen
                          ? `Toque em uma vaga de <strong>${sel.pos}</strong> em verde! (Posição certa dá +Química e bônus de <strong>+25% Quím / +220 Poder</strong> ao fechar 11/11)`
                          : `⚠️ Vagas de ${sel.pos} ocupadas! Improvisar tira <strong>-6 a -14 OVR</strong> do jogador e perde o bônus de <strong>11/11 na Posição (+25% Quím / +220 Poder)</strong>.`
                      }
                    </div>
                  </div>
                </div>
                <button class="ie-cmd-btn ie-cmd-gold" id="btn-back-to-team">
                  <span>⬅️ Voltar ao Time</span>
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
        const rank = stats.power >= 1650 ? "S+" : stats.power >= 1450 ? "S" : stats.power >= 1250 ? "A" : "B";
        footerActions = `
          <div class="go-ready-banner" style="margin-top:8px;">
            <div style="font-size:2.2rem;">🏆⚡</div>
            <h3 style="font-size:1.35rem; font-weight:900; color:#facc15;">
              CAMPEÃO DO FUTEBOL FRONTEIRA!!
            </h3>
            <div style="font-size:1rem; font-weight:900; color:#fed7aa; margin-top:4px;">
              PONTUAÇÃO FINAL: ${stats.power.toLocaleString("pt-BR")} PTS (RANK ${rank})
            </div>
            <p style="font-size:0.82rem; color:#e2e8f0; margin:6px 0 12px;">
              OVR ${stats.ovr} • Química ${stats.chem}% • Laços & Sinergias (+${stats.bondsPower} Poder)
            </p>
            <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
              <button class="ie-cmd-btn ie-cmd-green" id="btn-play-again-draft"><span>🔄 Novo Jogo</span></button>
              <button class="ie-cmd-btn ie-cmd-gold" id="btn-rematch-cup"><span>Jogar Outro Torneio</span></button>
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
            <button class="ie-cmd-btn ie-cmd-green" id="btn-next-round" style="padding:10px 18px;">
              <span>⏩ Ir para ${nextStage.stageName} →</span>
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
              <button class="ie-cmd-btn ie-cmd-gold" id="btn-retry-stage"><span>🔥 Revanche</span></button>
              <button class="ie-cmd-btn ie-cmd-green" id="btn-new-draft-after-loss"><span>🔄 Novo Jogo</span></button>
            </div>
          </div>
        `;
      }
    }

    const stadiumStyle = UI.stadiumBg ? `background-image: url('${UI.stadiumBg}');` : "";
    const oppPower = Math.round((st.oppTeam.baseOvr + t.stageIndex * 1.5) * 11 + 180 + t.stageIndex * 115);

    container.innerHTML = `
      <div class="bracket-row">${bracketHTML}</div>

      <div class="broadcast-card">
        <div class="broadcast-header">
          <div style="display:flex; align-items:center; gap:10px;">
            ${UI.raimonEmblem ? `<img src="${UI.raimonEmblem}" alt="" style="height:28px; width:28px; object-fit:contain;" />` : ""}
            <div>
              <span style="font-size:0.7rem; font-weight:900; color:#facc15; text-transform:uppercase;">
                FUTEBOL FRONTEIRA • ${st.stageName}
              </span>
              <h3 style="font-size:0.96rem; color:#fff;">Dream Team vs ${st.oppTeam.name}</h3>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="ie-cmd-btn" id="btn-toggle-speed" style="padding:5px 10px; font-size:0.72rem;">
              <span>Vel: ${state.simSpeed}x</span>
            </button>
            <div class="minute-clock" id="live-clock-text">
              ${st.minute}' ${st.finished ? "FIM" : ""}
            </div>
          </div>
        </div>

        <div class="time-bar-bg">
          <div class="time-bar-fill" id="live-bar-fill" style="width:${pct}%;"></div>
        </div>

        <div class="live-scoreboard" style="${stadiumStyle}">
          <div class="scoreboard-overlay"></div>
          <div class="score-team">
            ${UI.raimonEmblem ? `<img class="score-emblem" src="${UI.raimonEmblem}" alt="Dream Team" />` : `<div style="font-size:1.9rem;">⚡</div>`}
            <div style="font-weight:900; font-size:0.95rem;">Dream Team</div>
            <div style="font-size:0.7rem; color:#fed7aa; font-weight:800;">Poder ${stats.power.toLocaleString("pt-BR")} • OVR ${stats.ovr}</div>
          </div>

          <div class="score-digits">
            <span id="live-score-user">${st.userScore}</span>
            <span style="font-size:1.2rem; color:#93c5fd;">X</span>
            <span id="live-score-opp">${st.oppScore}</span>
          </div>

          <div class="score-team">
            <img class="score-emblem" src="${st.oppTeam.emblem}" alt="${st.oppTeam.name}" />
            <div style="font-weight:900; font-size:0.95rem;">${st.oppTeam.name}</div>
            <div style="font-size:0.7rem; color:#facc15; font-weight:800;">Poder ${oppPower.toLocaleString("pt-BR")} • OVR ${Math.round(st.oppTeam.baseOvr + t.stageIndex * 1.5)}</div>
          </div>
        </div>

        ${
          st.penaltiesText
            ? `<div style="text-align:center; background:rgba(250,204,21,0.15); border:1px solid #facc15; padding:6px; border-radius:8px; font-weight:800; color:#fde047; font-size:0.82rem;">
                ${moveIconHTML("SH")} ${st.penaltiesText}
              </div>`
            : ""
        }

        <div id="shot-clash-slot" style="display:none;"></div>

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
                      <div style="font-size:0.68rem; color:${g.isHissatsu ? "#86efac" : "#cbd5e1"}; display:flex; align-items:center; gap:4px;">
                        ${g.isHissatsu ? `${moveIconHTML("SH")} <span>${g.shotLabel}</span>` : `<span>${g.shotLabel}</span>`}
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

        ${footerActions}
      </div>
    `;

    const speedBtn = document.getElementById("btn-toggle-speed");
    if (speedBtn) {
      speedBtn.addEventListener("click", () => {
        state.simSpeed = state.simSpeed === 1 ? 2 : state.simSpeed === 2 ? 4 : 1;
        speedBtn.innerHTML = `<span>Vel: ${state.simSpeed}x</span>`;
        if (state.simSpeed !== 1 && state.tournament.pendingClashFinish) {
          clearTournamentTimers(true);
        }
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
    clearTournamentTimers(false);
    if (state.spinTimerId) {
      clearTimeout(state.spinTimerId);
      state.spinTimerId = null;
    }
    state.isSpinning = false;
    state.phase = "menu";
    state.squad = {};
    state.selectedPlayer = null;
    state.peekField = false;
    state.swapSlotId = null;
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
        if (state.spinTimerId) {
          clearTimeout(state.spinTimerId);
          state.spinTimerId = null;
        }
        state.isSpinning = false;
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
