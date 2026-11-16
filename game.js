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
      pitchRafId: null,
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

  function getAdjacentSlotPairs(slots) {
    const pairs = [];
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        const d = Math.hypot(slots[i].x - slots[j].x, slots[i].y - slots[j].y);
        if (d <= 34) {
          pairs.push([slots[i], slots[j]]);
        }
      }
    }
    return pairs;
  }

  function calcPlayerPowerContribution(effOvr) {
    // Contribuição progressiva por OVR: craques 90+ geram vantagem real e impedem inversões 81 > 92
    return Math.pow(Math.max(40, effOvr) / 85, 2.7) * 100;
  }

  // Cálculo unificado de Química, Poder e Sinergia de Proximidade (usado tanto no Dream Team quanto no Adversário!)
  function evaluateTeamStats(slots, getPlayerForSlot, options = {}) {
    const { isOpponent = false, ovrAdjust = 0, clubIdHint = null, oppStageIdx = 0 } = options;
    let sumOvr = 0;
    let sumBasePwr = 0;
    let count = 0;
    let atkSum = 0, atkCnt = 0;
    let midSum = 0, midCnt = 0;
    let defSum = 0, defCnt = 0;

    const teamsCount = {};
    const teamNames = {};
    const fullNamesInSquad = new Set();
    const elemCountsByLink = {};
    const activeElemPairs = [];
    const slotPlayerMap = {};
    let correctPosCount = 0;

    slots.forEach((s) => {
      const p = getPlayerForSlot(s);
      if (!p) return;
      count++;
      slotPlayerMap[s.id] = p;
      const adjP = isOpponent
        ? { ...p, ovr: Math.min(99, Math.max(58, Math.round(p.ovr + ovrAdjust))) }
        : p;
      if (adjP.pos === s.role) correctPosCount++;
      const eff = isOpponent
        ? Math.max(55, adjP.ovr - (adjP.pos === s.role ? 0 : 4))
        : getEffectiveOvr(adjP, s.role);
      sumOvr += eff;
      sumBasePwr += calcPlayerPowerContribution(eff);

      const tId = p.teamId || clubIdHint || "club";
      teamsCount[tId] = (teamsCount[tId] || 0) + 1;
      teamNames[tId] = p.teamName || clubIdHint || "Clube";
      if (p.fullName) fullNamesInSquad.add(p.fullName);

      if (s.role === "FW") { atkSum += eff; atkCnt++; }
      else if (s.role === "MF") { midSum += eff; midCnt++; }
      else { defSum += eff; defCnt++; }
    });

    const avgRawOvr = count > 0 ? sumOvr / count : 80;
    // Escala pelo nível do elenco (elencos de OVR baixo não ganham o mesmo bônus bruto que seleções 92+)
    const tierScale = Math.max(0.55, Math.min(1.16, Math.pow(avgRawOvr / 90, 1.45)));

    let chem = 0;
    let bondsPower = 0;
    const activeBonds = [];

    // Parâmetros de Sinergia Elemental em PROXIMIDADE (jogadores colados ao lado, acima ou abaixo)
    const adjPairs = getAdjacentSlotPairs(slots);
    adjPairs.forEach(([sA, sB]) => {
      const pA = slotPlayerMap[sA.id];
      const pB = slotPlayerMap[sB.id];
      if (pA && pB && pA.element && pA.element === pB.element) {
        activeElemPairs.push({ a: sA, b: sB, element: pA.element });
        elemCountsByLink[pA.element] = (elemCountsByLink[pA.element] || 0) + 1;
      }
    });

    if (isOpponent) {
      // Adversários baseiam Poder principalmente no OVR dos jogadores + Links Elementais em proximidade (sem loteria de Química/Amizade)
      if (count > 0) {
        const posChem = Math.round(correctPosCount * 2.0);
        const posPwr = Math.round(correctPosCount * 4.5 * tierScale);
        chem += posChem;
        bondsPower += posPwr;
        activeBonds.push({
          type: correctPosCount === 11 ? "perfect-formation" : "team",
          label: `📐 Formação Tática ${correctPosCount}/11 (+${posChem}% Quím • +${posPwr} Poder)`
        });
      }

      if (activeElemPairs.length > 0) {
        const linkChem = Math.min(35, activeElemPairs.length * 5);
        const rawLinkPwr =
          activeElemPairs.length <= 4
            ? activeElemPairs.length * 13
            : 52 + (activeElemPairs.length - 4) * 5;
        const linkPwr = Math.min(Math.round(80 * tierScale), Math.round(rawLinkPwr * tierScale));
        chem += linkChem;
        bondsPower += linkPwr;
        const summaryParts = Object.keys(elemCountsByLink)
          .map((el) => `${DB.elements[el]?.icon || "⚡"}×${elemCountsByLink[el]}`)
          .join(" ");
        activeBonds.push({
          type: "element",
          label: `🔗 ${activeElemPairs.length}x Links Elementais Próximos (${summaryParts}) (+${linkChem}% • +${linkPwr} Poder)`
        });
      }

      const maxClub = Math.max(0, ...Object.values(teamsCount));
      if (maxClub >= 2) {
        const clubChem = Math.min(28, Math.round(12 + maxClub * 1.5));
        const clubPwr = Math.round(Math.min(48, maxClub * 4.2) * tierScale);
        chem += clubChem;
        bondsPower += clubPwr;
        activeBonds.push({
          type: "team",
          label: `🏟️ Entrosamento de Elenco (+${clubChem}% • +${clubPwr} Poder)`
        });
      }

      chem = Math.min(100, Math.max(0, chem));
      const oppChemOvr = oppStageIdx >= 3 ? 2 : oppStageIdx >= 1 ? 1 : 0;
      const ovr = count > 0 ? Math.min(99, Math.round(avgRawOvr) + oppChemOvr) : 0;

      const chemPower = Math.round(chem * 0.55 * tierScale);
      const basePower = Math.round(sumBasePwr);
      const power = count > 0 ? basePower + chemPower + bondsPower : 0;

      return {
        count,
        correctPosCount,
        ovr,
        power,
        basePower,
        chemPower,
        bondsPower,
        elemLinksCount: activeElemPairs.length,
        activeElemPairs,
        atk: atkCnt > 0 ? Math.round(atkSum / atkCnt) : 0,
        mid: midCnt > 0 ? Math.round(midSum / midCnt) : 0,
        def: defCnt > 0 ? Math.round(defSum / defCnt) : 0,
        chem,
        activeBonds
      };
    }

    // 0. Química & Poder por Posições Corretas (Dream Team)
    if (count > 0) {
      if (correctPosCount === 11) {
        const pwr = Math.round(92 * tierScale);
        chem += 20;
        bondsPower += pwr;
        activeBonds.push({
          type: "perfect-formation",
          label: `📐 Formação Perfeita 11/11 (+20% Quím • +${pwr} Poder)`
        });
      } else {
        const posChem = Math.round(correctPosCount * 1.4);
        const posPwr = Math.round(correctPosCount * 5 * tierScale);
        const improvised = count - correctPosCount;
        chem += posChem;
        bondsPower += posPwr;
        activeBonds.push({
          type: improvised > 0 ? "warn-pos" : "team",
          label:
            improvised > 0
              ? `⚠️ Posições: ${correctPosCount}/${count} (${improvised} improvisado = -OVR e sem bônus 11/11!)`
              : `📐 Posições Corretas: ${correctPosCount}/11 (+${posChem}% Quím • Faça 11/11 p/ +20% e +2 OVR!)`
        });
      }
    }

    // 1. Química & Poder por Sinergia Elemental em PROXIMIDADE (Dream Team)
    if (activeElemPairs.length > 0) {
      const linkChem = Math.min(35, activeElemPairs.length * 5);
      const rawLinkPwr =
        activeElemPairs.length <= 5
          ? activeElemPairs.length * 20
          : 100 + (activeElemPairs.length - 5) * 10;
      const linkPwr = Math.min(Math.round(135 * tierScale), Math.round(rawLinkPwr * tierScale));
      chem += linkChem;
      bondsPower += linkPwr;
      const summaryParts = Object.keys(elemCountsByLink)
        .map((el) => `${DB.elements[el]?.icon || "⚡"}×${elemCountsByLink[el]}`)
        .join(" ");
      activeBonds.push({
        type: "element",
        label: `🔗 ${activeElemPairs.length}x Links Elementais Próximos (${summaryParts}) (+${linkChem}% • +${linkPwr} Poder)`
      });
    }

    // 2. Química & Poder por Mesmo Clube/Escola
    Object.keys(teamsCount).forEach((tId) => {
      const c = teamsCount[tId];
      if (c >= 2) {
        const chemBonus = c <= 4 ? (c - 1) * 9 : Math.min(38, 27 + Math.round((c - 4) * 2));
        const rawPwr = c <= 4 ? (c - 1) * 25 : Math.min(100, 75 + (c - 4) * 3);
        const pwrBonus = Math.round(rawPwr * tierScale);
        chem += chemBonus;
        bondsPower += pwrBonus;
        activeBonds.push({
          type: "team",
          label: `🏟️ ${c}x ${teamNames[tId]} (+${chemBonus}% • +${pwrBonus} Poder)`
        });
      }
    });

    // 3. Química & Poder por Laços de Amizade (com curva decrescente para laços sobrepostos)
    const matchedBonds = [];
    FRIENDSHIP_BONDS.forEach((bond) => {
      const matched = bond.members.filter((m) => fullNamesInSquad.has(m));
      if (matched.length >= bond.minCount) {
        matchedBonds.push({
          bond,
          extraCount: matched.length - 1,
          rawChem: (matched.length - 1) * bond.chemPerMatch,
          rawPwr: (matched.length - 1) * 42
        });
      }
    });
    matchedBonds.sort((a, b) => b.rawPwr - a.rawPwr);

    const decayWeights = [1.0, 0.55, 0.30, 0.15];
    let friendChemTotal = 0;
    let friendPwrTotal = 0;
    const maxFriendPwr = Math.round(135 * tierScale);

    matchedBonds.forEach((entry, idx) => {
      const w = decayWeights[Math.min(idx, decayWeights.length - 1)];
      const chemBonus = Math.max(2, Math.round(entry.rawChem * w));
      let pwrBonus = Math.round(entry.rawPwr * w * tierScale);
      if (friendPwrTotal + pwrBonus > maxFriendPwr) {
        pwrBonus = Math.max(0, maxFriendPwr - friendPwrTotal);
      }
      friendChemTotal += chemBonus;
      friendPwrTotal += pwrBonus;
      chem += chemBonus;
      bondsPower += pwrBonus;
      if (pwrBonus > 0 || idx < 3) {
        activeBonds.push({
          type: "friendship",
          label: `${entry.bond.name} (+${chemBonus}% • +${pwrBonus} Poder)`
        });
      }
    });

    chem = Math.min(100, Math.max(0, chem));

    let ovr = 0;
    if (count > 0) {
      const chemOvrBonus = chem >= 80 ? 3 : chem >= 55 ? 2 : chem >= 30 ? 1 : 0;
      const perfectPosOvrBonus = correctPosCount === 11 ? 2 : 0;
      ovr = Math.min(99, Math.round(avgRawOvr) + chemOvrBonus + perfectPosOvrBonus);
    }

    // Poder Final Total = Soma Progressiva dos OVRs + Química + Bônus de Sinergia
    const chemPower = Math.round(chem * 1.4 * tierScale);
    const basePower = Math.round(sumBasePwr);
    const power = count > 0 ? basePower + chemPower + bondsPower : 0;

    return {
      count,
      correctPosCount,
      ovr,
      power,
      basePower,
      chemPower,
      bondsPower,
      elemLinksCount: activeElemPairs.length,
      activeElemPairs,
      atk: atkCnt > 0 ? Math.round(atkSum / atkCnt) : 0,
      mid: midCnt > 0 ? Math.round(midSum / midCnt) : 0,
      def: defCnt > 0 ? Math.round(defSum / defCnt) : 0,
      chem,
      activeBonds
    };
  }

  function calcSquadStats() {
    return evaluateTeamStats(getSlots(), (s) => state.squad[s.id], { isOpponent: false });
  }

  function getOpponentSlotAssignments(oppTeam) {
    const raw = (oppTeam.players || []).slice();
    const formOrder = ["4-4-2", "4-3-3", "3-4-3", "3-5-2"];
    let best = null;

    formOrder.forEach((fKey) => {
      const formSlots = DB.formations[fKey].slots;
      const usedIds = new Set();
      const assignments = {};
      let correct = 0;
      const pickByRole = (role) => {
        const idx = raw.findIndex((p) => !usedIds.has(p.id) && p.pos === role);
        if (idx >= 0) {
          usedIds.add(raw[idx].id);
          return raw[idx];
        }
        const fallback = raw.find((p) => !usedIds.has(p.id));
        if (fallback) {
          usedIds.add(fallback.id);
          return fallback;
        }
        return oppTeam.players[0];
      };
      formSlots.forEach((slot) => {
        const chosen = pickByRole(slot.role);
        assignments[slot.id] = chosen;
        if (chosen && chosen.pos === slot.role) correct++;
      });
      if (!best || correct > best.correct) {
        best = { formSlots, assignments, correct };
      }
    });

    return { formSlots: best.formSlots, assignments: best.assignments };
  }

  function calcOpponentStats(oppTeam, stageIdx) {
    const { formSlots, assignments } = getOpponentSlotAssignments(oppTeam);
    return evaluateTeamStats(formSlots, (s) => assignments[s.id], {
      isOpponent: true,
      ovrAdjust: stageIdx * 1.5,
      clubIdHint: oppTeam.name || oppTeam.id,
      oppStageIdx: stageIdx
    });
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
    const adjPairs = getAdjacentSlotPairs(slots);
    const elemColors = {
      Fogo: "#ef4444",
      Floresta: "#22c55e",
      Vento: "#38bdf8",
      Montanha: "#f59e0b"
    };

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
        <svg class="draft-links-svg" viewBox="0 0 100 100" preserveAspectRatio="none">${linksSVG}</svg>
        <div id="pitch-nodes-container">${nodesHTML}</div>
      </div>
    `;
  }

  // ============================================================================
  // TORNEIO FUTEBOL FRONTEIRA (SEM PISCAR! ATUALIZAÇÃO INCREMENTAL DO DOM)
  // ============================================================================
  function getTickMs() {
    if (state.simSpeed === 4) return 85;
    if (state.simSpeed === 2) return 200;
    return 480; // 1x tático: cada tick avança posse, passes no mapa e duelos animados
  }

  function startTournamentGo() {
    clearTournamentTimers(false);

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
      timerId: null,
      pitchRafId: null,
      clashTimer1: null,
      clashTimer2: null,
      pendingClashFinish: null
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
    if (state.tournament.pitchRafId) {
      cancelAnimationFrame(state.tournament.pitchRafId);
      state.tournament.pitchRafId = null;
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

  function resetPitchForKickoff(pitch, kickoffSide, snapNodes = false) {
    if (!pitch) return;
    const koNodes = kickoffSide === "user" ? pitch.userNodes : pitch.oppNodes;
    const koMid = koNodes.find((n) => n.role === "MF") || koNodes[5] || koNodes[0];

    [...pitch.userNodes, ...pitch.oppNodes].forEach((n) => {
      n.advanceOffset = 0;
      n.laneOffset = 0;
      if (snapNodes) {
        // Mantém cada time no próprio campo de defesa/meio antes da saída de bola
        const halfClampX =
          n.side === "user" ? Math.min(46, n.baseX) : Math.max(54, n.baseX);
        n.x = halfClampX;
        n.y = n.baseY;
      }
    });

    pitch.ballSide = kickoffSide;
    pitch.carrierUid = koMid ? koMid.uid : "u_MF1";
    pitch.challengerUid = null;
    pitch.ballFlight = null;
    pitch.holdBallPos = null;
    pitch.ballX = 50;
    pitch.ballY = 50;
    pitch.passTrail = null;
    pitch.justKickedOff = true;

    recomputePitchTargets(pitch);
    if (koMid) {
      pinNodeToCoord(pitch, koMid, 50, 50, true);
    }
  }

  function handleMinuteEndBoundaries(st, ovrDiff) {
    if (st.minute === 45) {
      if (st.pitch) {
        const nextSide = st.pitch.initialSide === "user" ? "opp" : "user";
        resetPitchForKickoff(st.pitch, nextSide, true);
        st.pitch.ticker = `45' ⏱️ Fim do 1º Tempo! Recomeço com ${nextSide === "user" ? "Dream Team" : st.oppTeam.name}.`;
        syncLivePitchDOM(st);
      }
      prependNarrationLine(
        st,
        "",
        `⏱️ 45' Fim do 1º Tempo! Placar parcial: Dream Team ${st.userScore} x ${st.oppScore} ${st.oppTeam.name}.`
      );
    }

    if (st.minute === 90 && st.userScore === st.oppScore && st.maxMinute === 90) {
      st.maxMinute = 120;
      if (st.pitch) {
        resetPitchForKickoff(st.pitch, "user", true);
        st.pitch.ticker = `90' ⚡ Prorrogação iniciada! Bola no centro!`;
        syncLivePitchDOM(st);
      }
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
    // Teto suave acima de 85: impede que um único craque OVR 98 atropele um time inteiro sozinho
    return effOvr <= 85 ? effOvr : 85 + (effOvr - 85) * 0.5;
  }

  function getElementEdge(atkElem, defElem) {
    if (!atkElem || !defElem) return 0;
    if (ELEMENT_ADVANTAGE[atkElem] === defElem) return 1.5;
    if (ELEMENT_ADVANTAGE[defElem] === atkElem) return -1.0;
    return 0;
  }

  function calcNodeDuelScore(node, teamSupportBonus, opponentElem = null) {
    if (!node) return 75;
    // Jogador que centraliza muitas ações cansa e perde eficiência até circular a bola
    const fatiguePenalty = node.stamina < 70 ? (70 - node.stamina) * 0.17 : 0;
    return (
      compressOvr(node.effOvr) +
      teamSupportBonus -
      fatiguePenalty +
      getElementEdge(node.player?.element, opponentElem)
    );
  }

  function logisticWinProb(atkScore, defScore, baseShift = 0, minP = 0.10, maxP = 0.85) {
    const diff = Math.max(-14, Math.min(14, atkScore - defScore)) + baseShift;
    const p = 1 / (1 + Math.exp(-diff * 0.088));
    return Math.max(minP, Math.min(maxP, p));
  }

  function spendStamina(node, cost) {
    if (!node) return;
    node.stamina = Math.max(22, node.stamina - cost);
  }

  function buildOpponentLineup(oppTeam, stageIdx) {
    const { formSlots, assignments } = getOpponentSlotAssignments(oppTeam);
    return formSlots.map((slot) => {
      const player = assignments[slot.id];
      const rawPosMatch = player.pos === slot.role ? 0 : -4;
      const effOvr = Math.min(99, Math.max(58, Math.round(player.ovr + stageIdx * 1.5 + rawPosMatch)));
      const baseX = Math.max(7, Math.min(93, 100 - ((96 - slot.y) * 0.78 + 4)));
      const baseY = Math.max(12, Math.min(88, 100 - slot.x + (slot.role === "DF" ? 3 : -3)));
      return {
        uid: `o_${slot.id}`,
        side: "opp",
        slotId: slot.id,
        role: slot.role,
        label: slot.label,
        player,
        effOvr,
        stamina: 100,
        baseX,
        baseY,
        x: baseX,
        y: baseY,
        targetX: baseX,
        targetY: baseY,
        advanceOffset: 0,
        laneOffset: 0
      };
    });
  }

  function initMatchPitchState(st, stageIdx) {
    const slots = getSlots();
    const userNodes = slots.map((slot) => {
      const player = state.squad[slot.id];
      const effOvr = getEffectiveOvr(player, slot.role);
      const baseX = Math.max(7, Math.min(76, (96 - slot.y) * 0.78 + 4));
      const baseY = Math.max(12, Math.min(88, slot.x));
      return {
        uid: `u_${slot.id}`,
        side: "user",
        slotId: slot.id,
        role: slot.role,
        label: slot.label,
        player,
        effOvr,
        stamina: 100,
        baseX,
        baseY,
        x: baseX,
        y: baseY,
        targetX: baseX,
        targetY: baseY,
        advanceOffset: 0,
        laneOffset: 0
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
      userNodes,
      oppNodes,
      oppTeamName: st.oppTeam.name,
      initialSide: startSide,
      ballSide: startSide,
      carrierUid: startNode ? startNode.uid : "u_MF1",
      challengerUid: null,
      ballX: 50,
      ballY: 50,
      ballFlight: null,
      holdBallPos: null,
      justKickedOff: true,
      passTrail: null,
      floatBadge: null,
      goalFlashSide: null,
      goalFlashUntil: 0,
      ticker: `0' Bola rolando — ${startNode?.player?.name || "Meio-campo"} inicia a jogada!`,
      lastClashMinute: -10,
      stats: {
        userTicks: 1,
        oppTicks: 1,
        userPassesOk: 0,
        userPassesTry: 0,
        userDribblesOk: 0,
        userDribblesTry: 0,
        userSteals: 0,
        userSaves: 0,
        userShots: 0,
        oppShots: 0
      }
    };
    recomputePitchTargets(pitch);
    if (startNode) {
      pinNodeToCoord(pitch, startNode, 50, 50, true);
    }
    return pitch;
  }

  function findPitchNode(pitch, uid) {
    if (!pitch || !uid) return null;
    return (
      pitch.userNodes.find((n) => n.uid === uid) ||
      pitch.oppNodes.find((n) => n.uid === uid) ||
      null
    );
  }

  function getNodeTacticalAnchor(node, pitch, refBallX, refBallY) {
    if (node.role === "GK") {
      return {
        ax: node.baseX,
        ay: Math.max(40, Math.min(60, 50 + (refBallY - 50) * 0.22))
      };
    }
    const ballPush = ((refBallX - 50) / 50) * 7.5;
    const sideBias =
      node.side === "user"
        ? pitch.ballSide === "user"
          ? 5.5
          : -4.5
        : pitch.ballSide === "opp"
        ? -5.5
        : 4.5;
    const verticalPull = ((refBallY - 50) / 50) * 4.5;
    return {
      ax: node.baseX + sideBias + ballPush,
      ay: node.baseY + verticalPull
    };
  }

  function pinNodeToCoord(pitch, node, wx, wy, snapImmediate = false) {
    if (!pitch || !node) return;
    const refBallX = pitch.ballFlight ? pitch.ballFlight.toX : pitch.ballX;
    const refBallY = pitch.ballFlight ? pitch.ballFlight.toY : pitch.ballY;
    const { ax, ay } = getNodeTacticalAnchor(node, pitch, refBallX, refBallY);
    const clampedX = Math.max(10, Math.min(90, wx));
    const clampedY = Math.max(11, Math.min(89, wy));
    node.advanceOffset = clampedX - ax;
    node.laneOffset = clampedY - ay;
    node.targetX = Number(clampedX.toFixed(1));
    node.targetY = Number(clampedY.toFixed(1));
    if (snapImmediate) {
      node.x = node.targetX;
      node.y = node.targetY;
    }
  }

  function recomputePitchTargets(pitch) {
    if (!pitch) return;
    const refBallX = pitch.ballFlight ? pitch.ballFlight.toX : pitch.ballX;
    const refBallY = pitch.ballFlight ? pitch.ballFlight.toY : pitch.ballY;

    const all = [...pitch.userNodes, ...pitch.oppNodes];
    all.forEach((node) => {
      if (node.uid !== pitch.carrierUid && node.uid !== pitch.challengerUid) {
        // Jogadores sem a bola recompõem suavemente sua posição na formação
        node.advanceOffset = (node.advanceOffset || 0) * 0.7;
        node.laneOffset = (node.laneOffset || 0) * 0.7;
      }

      if (node.role === "GK") {
        node.targetX = node.baseX;
        node.targetY = Math.max(40, Math.min(60, 50 + (refBallY - 50) * 0.22));
        return;
      }

      const { ax, ay } = getNodeTacticalAnchor(node, pitch, refBallX, refBallY);
      const tx = ax + (node.advanceOffset || 0);
      const ty = ay + (node.laneOffset || 0);

      node.targetX = Math.max(10, Math.min(90, Number(tx.toFixed(1))));
      node.targetY = Math.max(11, Math.min(89, Number(ty.toFixed(1))));
    });

    // Se houver um marcador em duelo direto com o portador, aproxima ele do ponto do duelo
    const carrier = findPitchNode(pitch, pitch.carrierUid);
    const challenger = findPitchNode(pitch, pitch.challengerUid);
    if (carrier && challenger && challenger.role !== "GK" && !pitch.ballFlight) {
      const gapX = challenger.side === "user" ? -3.8 : 3.8;
      challenger.targetX = Math.max(10, Math.min(90, carrier.targetX + gapX));
      challenger.targetY = Math.max(
        11,
        Math.min(89, carrier.targetY + (challenger.y >= carrier.y ? 2.2 : -2.2))
      );
    }
  }

  function showPitchBadge(pitch, x, y, text, cls = "badge-pass", durationMs = 750) {
    if (!pitch) return;
    pitch.floatBadge = {
      x: Math.max(12, Math.min(88, x)),
      y: Math.max(18, Math.min(86, y)),
      text,
      cls,
      until: performance.now() + durationMs
    };
  }

  function startBallFlight(pitch, fromX, fromY, toX, toY, durationMs, arcHeight = 2.6, kind = "PASS", trailColor = "#4ade80") {
    if (!pitch) return;
    const now = performance.now();
    const dur = Math.max(55, durationMs);
    pitch.ballFlight = {
      fromX,
      fromY,
      toX,
      toY,
      start: now,
      duration: dur,
      arcHeight,
      kind
    };
    pitch.passTrail = {
      fromX,
      fromY,
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

  function startPitchRafLoop(st) {
    if (state.tournament.pitchRafId) {
      cancelAnimationFrame(state.tournament.pitchRafId);
      state.tournament.pitchRafId = null;
    }

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
      const followRate = state.simSpeed === 4 ? 0.38 : state.simSpeed === 2 ? 0.24 : 0.14;

      const stepNode = (node) => {
        node.x += (node.targetX - node.x) * followRate;
        node.y += (node.targetY - node.y) * followRate;
        const el = document.getElementById(`pnode-${node.uid}`);
        if (el) {
          el.style.left = `${node.x.toFixed(2)}%`;
          el.style.top = `${node.y.toFixed(2)}%`;
        }
      };

      pitch.userNodes.forEach(stepNode);
      pitch.oppNodes.forEach(stepNode);

      const carrier = findPitchNode(pitch, pitch.carrierUid);
      let ballScale = 1;

      if (pitch.ballFlight) {
        const f = pitch.ballFlight;
        const t = Math.min(1, Math.max(0, (now - f.start) / f.duration));
        const eased = 1 - Math.pow(1 - t, 2.2);
        pitch.ballX = f.fromX + (f.toX - f.fromX) * eased;
        pitch.ballY = f.fromY + (f.toY - f.fromY) * eased - Math.sin(t * Math.PI) * f.arcHeight;
        ballScale = 1 + Math.sin(t * Math.PI) * 0.28;
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
      } else if (pitch.holdBallPos && !pitch.carrierUid) {
        // Enquanto ninguém retomou a bola (ex: chute no ar / bola na rede do gol), ela NÃO volta ao pé do batedor!
        pitch.ballX = pitch.holdBallPos.x;
        pitch.ballY = pitch.holdBallPos.y;
      } else if (carrier) {
        // Bola colada no pé do portador com leve balanço de condução!
        const weaveY = Math.sin(now * 0.014) * 0.65;
        const footX = carrier.x + (carrier.side === "user" ? 2.3 : -2.3);
        const footY = carrier.y + 1.3 + weaveY;
        const ballFollow = state.simSpeed === 4 ? 0.6 : 0.38;
        pitch.ballX += (footX - pitch.ballX) * ballFollow;
        pitch.ballY += (footY - pitch.ballY) * ballFollow;
      }

      const ballEl = document.getElementById("live-pitch-ball");
      if (ballEl) {
        ballEl.style.left = `${pitch.ballX.toFixed(2)}%`;
        ballEl.style.top = `${pitch.ballY.toFixed(2)}%`;
        ballEl.style.transform = `translate(-50%, -50%) scale(${ballScale.toFixed(2)})`;
      }

      // Atualiza trilha SVG animada (cresce junto com a bola e depois suaviza o fade)
      const lineGlow = document.getElementById("pitch-pass-glow");
      const lineMain = document.getElementById("pitch-pass-line");
      if (lineGlow && lineMain) {
        const tr = pitch.passTrail;
        if (tr && now < tr.fadeUntil) {
          const endX = tr.curX !== undefined ? tr.curX : tr.toX;
          const endY = tr.curY !== undefined ? tr.curY : tr.toY;
          const remain = Math.max(0, Math.min(1, (tr.fadeUntil - now) / 460));
          lineGlow.setAttribute("x1", tr.fromX.toFixed(1));
          lineGlow.setAttribute("y1", tr.fromY.toFixed(1));
          lineGlow.setAttribute("x2", endX.toFixed(1));
          lineGlow.setAttribute("y2", endY.toFixed(1));
          lineGlow.setAttribute("stroke", tr.color);
          lineGlow.style.opacity = (0.38 * remain).toFixed(2);

          lineMain.setAttribute("x1", tr.fromX.toFixed(1));
          lineMain.setAttribute("y1", tr.fromY.toFixed(1));
          lineMain.setAttribute("x2", endX.toFixed(1));
          lineMain.setAttribute("y2", endY.toFixed(1));
          lineMain.setAttribute("stroke", tr.color);
          lineMain.style.opacity = (0.95 * remain).toFixed(2);
        } else {
          pitch.passTrail = null;
          lineGlow.style.opacity = "0";
          lineMain.style.opacity = "0";
        }
      }

      // Atualiza badge flutuante no gramado
      const badgeEl = document.getElementById("pitch-float-badge");
      if (badgeEl) {
        const fb = pitch.floatBadge;
        if (fb && now < fb.until) {
          badgeEl.className = `pitch-float-badge ${fb.cls} is-visible`;
          badgeEl.style.left = `${fb.x.toFixed(1)}%`;
          badgeEl.style.top = `${fb.y.toFixed(1)}%`;
          if (badgeEl.textContent !== fb.text) badgeEl.textContent = fb.text;
        } else {
          badgeEl.className = "pitch-float-badge";
        }
      }

      // Flash na rede do gol quando sai gol
      const gLeft = document.getElementById("pitch-goal-left");
      const gRight = document.getElementById("pitch-goal-right");
      if (gLeft && gRight) {
        const activeFlash = pitch.goalFlashUntil && now < pitch.goalFlashUntil ? pitch.goalFlashSide : null;
        gLeft.classList.toggle("goal-flash", activeFlash === "left");
        gRight.classList.toggle("goal-flash", activeFlash === "right");
      }

      if (!st.finished || pitch.ballFlight) {
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

  function pickPassReceiver(nodes, defNodes, carrier, strictForward = false) {
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
        forwardGain >= 4 ? 2.4 : forwardGain >= 0 ? 1.5 : forwardGain >= -6 ? 0.55 : 0.14;
      const distFactor = dist >= 8 && dist <= 38 ? 1.45 : dist < 6 ? 0.4 : 0.75;

      let minDefDist = 99;
      if (defNodes && defNodes.length) {
        defNodes.forEach((d) => {
          const dd = Math.hypot(d.x - n.targetX, d.y - n.targetY);
          if (dd < minDefDist) minDefDist = dd;
        });
      }
      const openFactor = minDefDist >= 10 ? 1.45 : minDefDist >= 6 ? 1.0 : 0.6;
      const staminaW = Math.max(0.3, n.stamina / 100);
      const skillW = Math.pow(Math.max(55, n.effOvr) / 80, 0.65);
      return forwardFactor * distFactor * openFactor * staminaW * skillW;
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

    const oppGoalX = attIsUser ? 96 : 4;
    const goalDist = Math.hypot(carrier.x - oppGoalX, carrier.y - 50);
    const inPenaltyX = attIsUser ? carrier.x >= 72 : carrier.x <= 28;
    const centralLane = carrier.y >= 24 && carrier.y <= 76;
    const inFinalThird = attIsUser ? carrier.x >= 58 : carrier.x <= 42;

    // Conta defensores na frente entre o portador e o gol
    const blockingDefs = defNodes.filter((d) => {
      if (d.role === "GK") return false;
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

    const roll = Math.random();

    // 1) Cara a cara ou dentro da área central -> CHUTA! (sem passes idiotas para trás!)
    if ((inPenaltyX && centralLane) || goalDist <= 22) {
      if (blockingDefs <= 1 || goalDist <= 18) {
        if (roll < 0.90 || !hasOpenBoxTarget) return { action: "SHOT", strictForward: true };
        return { action: "PASS", strictForward: true };
      }
      if (roll < 0.72) return { action: "SHOT", strictForward: true };
      if (roll < 0.88) return { action: "DRIBBLE", strictForward: true };
      return hasOpenBoxTarget ? { action: "PASS", strictForward: true } : { action: "SHOT", strictForward: true };
    }

    // 2) Ponta / linha de fundo na área -> cruza para quem entra na área ou corta para finalizar
    if (inPenaltyX && !centralLane) {
      if (hasOpenBoxTarget && roll < 0.58) return { action: "PASS", strictForward: true };
      if (roll < 0.84) return { action: "DRIBBLE", strictForward: true };
      return { action: "SHOT", strictForward: true };
    }

    // 3) Terço final / entrada da área
    if (inFinalThird || effRole === "FW") {
      if (blockingDefs === 0) {
        if (roll < 0.56) return { action: "SHOT", strictForward: true };
        if (roll < 0.80) return { action: "DRIBBLE", strictForward: true };
        return { action: "PASS", strictForward: true };
      }
      if (roll < 0.36) return { action: "SHOT", strictForward: true };
      if (roll < 0.72) return { action: "DRIBBLE", strictForward: true };
      return { action: "PASS", strictForward: true };
    }

    // 4) Defesa / Meio-campo construtivo
    if (effRole === "DF") {
      return roll < 0.76 ? { action: "PASS", strictForward: true } : { action: "DRIBBLE", strictForward: false };
    }
    if (roll < 0.56) return { action: "PASS", strictForward: false };
    if (roll < 0.93) return { action: "DRIBBLE", strictForward: false };
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
    const carrier = findPitchNode(pitch, pitch.carrierUid);
    const isUserPoss = pitch.ballSide === "user";

    if (cardEl) {
      cardEl.classList.toggle("poss-user", isUserPoss);
      cardEl.classList.toggle("poss-opp", !isUserPoss);
    }
    if (possBar) {
      possBar.classList.toggle("poss-user", isUserPoss);
      possBar.classList.toggle("poss-opp", !isUserPoss);
      const teamLabel = isUserPoss ? "DREAM TEAM" : (pitch.oppTeamName || "ADVERSÁRIO").toUpperCase();
      const playerLabel = carrier ? `${carrier.player.name} (${carrier.label})` : "";
      const dirArrow = isUserPoss ? "Atacando ➔" : "⬅ Atacando";
      possBar.innerHTML = `
        <span class="poss-team-chip">
          <span class="poss-pulse-dot"></span>
          <span>POSSE: ${teamLabel}${playerLabel ? ` • ${playerLabel}` : ""}</span>
        </span>
        <span style="font-size:0.64rem; opacity:0.9;">${dirArrow}</span>
      `;
    }

    const updateNodeState = (list) => {
      list.forEach((node) => {
        const el = document.getElementById(`pnode-${node.uid}`);
        if (!el) return;
        el.classList.toggle("has-ball", node.uid === pitch.carrierUid);
        el.classList.toggle("is-challenger", node.uid === pitch.challengerUid);

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

  function buildLivePitchBoxHTML(st, oppTeam) {
    const pitch = st.pitch;
    if (!pitch) return "";
    const allNodes = [...pitch.userNodes, ...pitch.oppNodes];

    const tokensHTML = allNodes
      .map((node) => {
        const sideCls = node.side === "user" ? "side-user" : "side-opp";
        const ballCls = node.uid === pitch.carrierUid ? "has-ball" : "";
        const chalCls = node.uid === pitch.challengerUid ? "is-challenger" : "";
        const shortName = (node.player?.name || node.label).split(" ").slice(-1)[0];
        const stamColor =
          node.stamina >= 70 ? "#4ade80" : node.stamina >= 45 ? "#facc15" : "#ef4444";

        return `
          <div id="pnode-${node.uid}" class="pitch-player-token ${sideCls} ${ballCls} ${chalCls}" style="left:${node.x}%; top:${node.y}%;">
            <img class="pitch-token-avatar" src="${node.player?.sprite || ""}" alt="${shortName}" />
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
    const carrier = findPitchNode(pitch, pitch.carrierUid);
    const possTeamLabel = isUserPoss ? "DREAM TEAM" : oppTeam.name.toUpperCase();
    const possPlayerLabel = carrier ? `${carrier.player.name} (${carrier.label})` : "";

    return `
      <div id="live-pitch-box" class="live-pitch-card ${possCls}">
        <div class="pitch-possession-bar ${possCls}" id="pitch-possession-bar">
          <span class="poss-team-chip">
            <span class="poss-pulse-dot"></span>
            <span>POSSE: ${possTeamLabel}${possPlayerLabel ? ` • ${possPlayerLabel}` : ""}</span>
          </span>
          <span style="font-size:0.64rem; opacity:0.9;">${isUserPoss ? "Atacando ➔" : "⬅ Atacando"}</span>
        </div>

        <div class="pitch-header-strip">
          <span class="pitch-side-dir" style="color:#4ade80;">
            ${UI.raimonEmblem ? `<img src="${UI.raimonEmblem}" alt="" />` : "⚡"} Gol →
          </span>
          <div class="pitch-action-ticker" id="pitch-action-ticker">${pitch.ticker}</div>
          <span class="pitch-side-dir" style="color:#f87171;">
            ← Gol <img src="${oppTeam.emblem}" alt="" />
          </span>
        </div>

        <div class="live-tactical-pitch">
          <div class="pitch-line-mid"></div>
          <div class="pitch-center-circle"></div>
          <div class="pitch-box-left"></div>
          <div class="pitch-box-right"></div>
          <div class="pitch-goal-left" id="pitch-goal-left"></div>
          <div class="pitch-goal-right" id="pitch-goal-right"></div>

          <svg class="pitch-pass-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line id="pitch-pass-glow" x1="50" y1="50" x2="50" y2="50" stroke="#facc15" stroke-width="2.2" stroke-linecap="round" style="opacity:0;" />
            <line id="pitch-pass-line" x1="50" y1="50" x2="50" y2="50" stroke="#facc15" stroke-width="0.9" stroke-dasharray="2.5 1.8" stroke-linecap="round" style="opacity:0;" />
          </svg>

          ${tokensHTML}
          <div id="live-pitch-ball" class="pitch-ball-dot" style="left:${pitch.ballX}%; top:${pitch.ballY}%;">⚽</div>
          <div id="pitch-float-badge" class="pitch-float-badge"></div>
        </div>

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

  function playShotClashAndContinue(st, clash, onImpactOutcome, ovrDiff, onAfterBanner = null) {
    // Em 2x/4x resolve instantaneamente sem abrir o palco 1x
    if (state.simSpeed !== 1) {
      if (onImpactOutcome) onImpactOutcome();
      if (onAfterBanner) onAfterBanner();
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
      if (onAfterBanner) onAfterBanner();
      syncLivePitchDOM(st);
      if (!handleMinuteEndBoundaries(st, ovrDiff)) startMatchInterval();
      return;
    }

    const kind = clash.kind || "SHOT"; // "SHOT" | "DRIBBLE" | "STEAL"
    const dir = clash.dir === "rtl" ? "rtl" : "ltr";
    const dirCls = `dir-${dir}`;

    let stageModCls = "";
    let topPillCls = "clash-move-shoot";
    let topIconCat = "SH";
    let botPillCls = "clash-move-def";
    let botIconCat = clash.bottomIcon || "GK";
    let runnerHTML = `
      <div class="fireball-runner ${dirCls}">
        <div class="fireball-trail"></div>
        <div class="fireball-orb">${buildFireballSVG()}</div>
      </div>
    `;
    let actionMs = 2350;
    let bannerMs = 1250;

    if (kind === "DRIBBLE") {
      stageModCls = "stage-dribble";
      topPillCls = "clash-move-dribble";
      topIconCat = "OF";
      botIconCat = "DF";
      runnerHTML = `
        <div class="dribble-runner ${dirCls}">
          <div class="dribble-trail"></div>
          <div class="boot-dash-icon">${buildDribbleBootSVG()}</div>
        </div>
      `;
      actionMs = 1850;
      bannerMs = 1000;
    } else if (kind === "STEAL") {
      stageModCls = "stage-steal";
      topPillCls = "clash-move-def";
      topIconCat = "DF";
      botPillCls = "clash-move-pass";
      botIconCat = "OF";
      runnerHTML = `
        <div class="steal-runner ${dirCls}">
          <div class="steal-trail"></div>
          <div class="tackle-slide-icon">${buildSlideTackleSVG()}</div>
        </div>
      `;
      actionMs = 1850;
      bannerMs = 1000;
    }

    const goalsBox = document.getElementById("goals-columns-box");
    if (goalsBox) goalsBox.style.display = "none";
    slotEl.style.display = "block";

    // Dream Team fica sempre na ESQUERDA e Adversário na DIREITA (alinhado com o mapa 2D!)
    slotEl.innerHTML = `
      <div class="shot-clash-stage ${stageModCls}">
        <div class="clash-arena-grid">
          <div class="clash-fighter">
            <img class="clash-avatar side-user" src="${clash.userPlayer.sprite}" alt="${clash.userPlayer.name}" />
            <div class="clash-fighter-name">${clash.userPlayer.name}</div>
            <span class="clash-role-badge">${clash.userPlayer.roleText}</span>
          </div>

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

          <div class="clash-fighter">
            <img class="clash-avatar side-opp" src="${clash.oppPlayer.sprite}" alt="${clash.oppPlayer.name}" />
            <div class="clash-fighter-name">${clash.oppPlayer.name}</div>
            <span class="clash-role-badge">${clash.oppPlayer.roleText}</span>
          </div>
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
      const restoreGoalsBox = document.getElementById("goals-columns-box");
      if (restoreGoalsBox) restoreGoalsBox.style.display = "";

      if (!impactApplied && onImpactOutcome) {
        impactApplied = true;
        onImpactOutcome();
      }
      if (!afterApplied && onAfterBanner) {
        afterApplied = true;
        onAfterBanner();
      }
      syncLivePitchDOM(st);
      const matchEnded = handleMinuteEndBoundaries(st, ovrDiff);
      if (!matchEnded && !skipRestart && st.running && !st.finished) {
        startMatchInterval();
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

  function startMatchInterval() {
    if (state.tournament.timerId) clearInterval(state.tournament.timerId);

    const stageIdx = state.tournament.stageIndex;
    const st = state.tournament.stages[stageIdx];
    if (!st || st.finished) return;
    if (!st.pitch) st.pitch = initMatchPitchState(st, stageIdx);
    if (!state.tournament.pitchRafId) startPitchRafLoop(st);

    const userStats = calcSquadStats();
    const oppStats = calcOpponentStats(st.oppTeam, stageIdx);

    // Ambos os times usam o mesmo sistema de Química + Formação + Links Elementais Próximos!
    const userTeamSupport =
      (userStats.chem / 100) * 4.4 +
      (userStats.correctPosCount === 11 ? 2.4 : userStats.correctPosCount * 0.12);
    const oppTeamSupport =
      (oppStats.chem / 100) * 4.4 +
      (oppStats.correctPosCount === 11 ? 2.4 : oppStats.correctPosCount * 0.12);
    const ovrDiff = userStats.ovr - oppStats.ovr;

    state.tournament.timerId = setInterval(() => {
      st.minute++;
      const pitch = st.pitch;

      const clockEl = document.getElementById("live-clock-text");
      const barEl = document.getElementById("live-bar-fill");
      if (clockEl) clockEl.textContent = `${st.minute}'`;
      if (barEl) {
        const pct = Math.min(100, Math.round((st.minute / st.maxMinute) * 100));
        barEl.style.width = `${pct}%`;
      }

      pitch.userNodes.forEach((n) => {
        if (n.uid !== pitch.carrierUid) n.stamina = Math.min(100, n.stamina + 3.8);
      });
      pitch.oppNodes.forEach((n) => {
        if (n.uid !== pitch.carrierUid) n.stamina = Math.min(100, n.stamina + 3.8);
      });

      const attIsUser = pitch.ballSide === "user";
      const attNodes = attIsUser ? pitch.userNodes : pitch.oppNodes;
      const defNodes = attIsUser ? pitch.oppNodes : pitch.userNodes;
      const attSupport = attIsUser ? userTeamSupport : oppTeamSupport;
      const defSupport = attIsUser ? oppTeamSupport : userTeamSupport;

      if (attIsUser) pitch.stats.userTicks++;
      else pitch.stats.oppTicks++;

      const carrier = findPitchNode(pitch, pitch.carrierUid) || attNodes[0];
      const effRole = getEffectiveCarrierRole(carrier);

      // Decisão tática contextual inteligente (chuta quando de cara pro gol; evita passes para trás inúteis!)
      const decision = chooseTacticalAction(carrier, attNodes, defNodes, attIsUser, pitch);
      const action = decision.action;
      const strictForward = decision.strictForward;

      const isSafeProtectedPass = Boolean(decision.safeRestart || carrier.role === "GK");

      const canHissatsuFieldDuel = state.simSpeed === 1 && st.minute - pitch.lastClashMinute >= 2;
      const passFlightMs = state.simSpeed === 4 ? 70 : state.simSpeed === 2 ? 155 : 350;

      // ----------------------------------------------------------------------
      // AÇÃO 1: PASSE INDIVIDUAL (GOLEIRO E SAÍDA DE BOLA SÃO 100% PROTEGIDOS CONTRA ROUBO!)
      // ----------------------------------------------------------------------
      if (action === "PASS") {
        const receiver = pickPassReceiver(attNodes, defNodes, carrier, strictForward);
        const midX = (carrier.x + receiver.targetX) * 0.5;
        const midY = (carrier.y + receiver.targetY) * 0.5;
        const pressRoles =
          effRole === "GK"
            ? ["FW"]
            : effRole === "DF"
            ? ["FW", "MF"]
            : effRole === "MF"
            ? ["MF", "DF"]
            : ["DF"];
        const interceptor = pickMarkerFor(defNodes, pressRoles, midX, midY);

        const passScore = calcNodeDuelScore(carrier, attSupport, interceptor?.player?.element);
        const defScore = calcNodeDuelScore(interceptor, defSupport, carrier?.player?.element);
        const sectorShift = effRole === "GK" ? 13 : effRole === "DF" ? 9.5 : effRole === "MF" ? 6.5 : 5.0;
        const passSuccess = isSafeProtectedPass
          ? true
          : Math.random() < logisticWinProb(passScore, defScore, sectorShift, 0.56, 0.93);

        spendStamina(carrier, isSafeProtectedPass ? 2 : 6);
        if (!isSafeProtectedPass) spendStamina(interceptor, 4);
        if (attIsUser) pitch.stats.userPassesTry++;

        const startX = carrier.x;
        const startY = carrier.y;

        if (passSuccess) {
          if (attIsUser) pitch.stats.userPassesOk++;
          pitch.carrierUid = receiver.uid;
          pitch.challengerUid = null;
          pitch.holdBallPos = null;
          recomputePitchTargets(pitch);

          startBallFlight(
            pitch,
            startX,
            startY,
            receiver.targetX,
            receiver.targetY,
            passFlightMs,
            2.4,
            "PASS",
            attIsUser ? "#4ade80" : "#f87171"
          );
          const passBadgeText = carrier.role === "GK" ? "🧤 REPOSIÇÃO" : "⚽ PASSE";
          showPitchBadge(pitch, receiver.targetX, receiver.targetY, passBadgeText, "badge-pass", passFlightMs + 260);
          pitch.ticker =
            carrier.role === "GK"
              ? `${st.minute}' 🧤 Reposição: ${carrier.player.name} ➔ ${receiver.player.name}`
              : `${st.minute}' ⚽ Passe: ${carrier.player.name} ➔ ${receiver.player.name}`;
          syncLivePitchDOM(st);
          handleMinuteEndBoundaries(st, ovrDiff);
          return;
        } else {
          // Interceptado na linha de passe! Bola viaja até (ix, iy) onde o interceptor entra no carrinho
          const ix = Math.max(12, Math.min(88, startX * 0.46 + receiver.targetX * 0.54));
          const iy = Math.max(14, Math.min(86, startY * 0.46 + receiver.targetY * 0.54));
          const stealMove = pickPlayerMove(interceptor.player, "DF") || "Corte Rápido";
          const passMove = pickPlayerMove(carrier.player, "OF") || "Passe Tático";

          pitch.challengerUid = interceptor.uid;
          if (canHissatsuFieldDuel) {
            pitch.carrierUid = null;
            pitch.holdBallPos = { x: ix, y: iy };
          }
          pinNodeToCoord(pitch, interceptor, ix, iy, false);
          startBallFlight(
            pitch,
            startX,
            startY,
            ix,
            iy,
            canHissatsuFieldDuel ? 950 : passFlightMs,
            1.6,
            "INTERCEPT",
            "#38bdf8"
          );

          const applyStealOutcome = () => {
            pitch.ballSide = attIsUser ? "opp" : "user";
            pitch.carrierUid = interceptor.uid;
            pitch.challengerUid = null;
            pitch.holdBallPos = null;
            pinNodeToCoord(pitch, interceptor, ix, iy, true);
            pitch.ballFlight = null;
            pitch.ballX = ix + (interceptor.side === "user" ? 2.2 : -2.2);
            pitch.ballY = iy + 1.2;
            showPitchBadge(pitch, ix, iy, `🛡️ ${stealMove}`, "badge-steal", 900);
            if (!attIsUser) pitch.stats.userSteals++;
            pitch.ticker = `${st.minute}' 🛡️ ${interceptor.player.name} interceptou passe de ${carrier.player.name}!`;
            prependNarrationLine(
              st,
              "nar-steal",
              `🛡️ ${st.minute}' [Roubo] ${interceptor.player.name} deu um carrinho com 【${stealMove}】 e interceptou ${carrier.player.name}!`,
              { name: interceptor.player.name, sprite: interceptor.player.sprite, side: interceptor.side },
              { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side }
            );
          };

          if (canHissatsuFieldDuel) {
            pitch.lastClashMinute = st.minute;
            pitch.ticker = `${st.minute}' ⚡ ${interceptor.player.name} deu o bote no passe de ${carrier.player.name}!`;
            syncLivePitchDOM(st);
            const stealFromLeft = interceptor.side === "user";
            playShotClashAndContinue(
              st,
              {
                kind: "STEAL",
                dir: stealFromLeft ? "ltr" : "rtl",
                userPlayer: stealFromLeft
                  ? { name: interceptor.player.name, sprite: interceptor.player.sprite, roleText: "CARRINHO" }
                  : { name: carrier.player.name, sprite: carrier.player.sprite, roleText: "POSSE / PASSE" },
                oppPlayer: stealFromLeft
                  ? { name: carrier.player.name, sprite: carrier.player.sprite, roleText: "POSSE / PASSE" }
                  : { name: interceptor.player.name, sprite: interceptor.player.sprite, roleText: "CARRINHO" },
                topMoveName: stealMove,
                bottomMoveName: passMove,
                bottomIcon: "OF",
                outcomePositive: stealFromLeft,
                resultBannerText: "🛡️ BOLA ROUBADA!"
              },
              applyStealOutcome,
              ovrDiff
            );
            return;
          } else {
            applyStealOutcome();
            syncLivePitchDOM(st);
            handleMinuteEndBoundaries(st, ovrDiff);
            return;
          }
        }
      }

      // ----------------------------------------------------------------------
      // AÇÃO 2: DRIBLE INDIVIDUAL (SE VENCER, A BOLA CONTINUA COM ELE E ELE AVANÇA!)
      // ----------------------------------------------------------------------
      if (action === "DRIBBLE") {
        const markerRoles = effRole === "DF" ? ["FW", "MF"] : effRole === "MF" ? ["MF", "DF"] : ["DF"];
        const aheadX = Math.max(12, Math.min(88, carrier.x + (attIsUser ? 7 : -7)));
        const marker = pickMarkerFor(defNodes, markerRoles, aheadX, carrier.y);

        const dribScore = calcNodeDuelScore(carrier, attSupport, marker?.player?.element);
        const defScore = calcNodeDuelScore(marker, defSupport, carrier?.player?.element);
        const wonDribble = Math.random() < logisticWinProb(dribScore, defScore, 1.0, 0.25, 0.78);

        spendStamina(carrier, 11);
        spendStamina(marker, 9);
        if (attIsUser) pitch.stats.userDribblesTry++;

        const ofMove = pickPlayerMove(carrier.player, "OF") || "Finta Veloz";
        const dfMove = pickPlayerMove(marker.player, "DF") || "Marcação Cerrada";
        const startX = carrier.x;
        const startY = carrier.y;

        pitch.challengerUid = marker.uid;
        pinNodeToCoord(
          pitch,
          marker,
          carrier.x + (attIsUser ? 3.8 : -3.8),
          carrier.y + (marker.y >= carrier.y ? 2.0 : -2.0),
          false
        );

        const applyDribbleOutcome = () => {
          if (wonDribble) {
            if (attIsUser) pitch.stats.userDribblesOk++;
            const newX = Math.max(12, Math.min(86, startX + (attIsUser ? 12 : -12)));
            const dodgeY = Math.max(14, Math.min(86, startY + (marker.y >= startY ? -6.5 : 6.5)));
            pitch.carrierUid = carrier.uid;
            pitch.challengerUid = null;
            pitch.holdBallPos = null;
            pinNodeToCoord(pitch, carrier, newX, dodgeY, false);

            pitch.passTrail = {
              fromX: startX,
              fromY: startY,
              toX: newX,
              toY: dodgeY,
              curX: newX,
              curY: dodgeY,
              color: "#c084fc",
              start: performance.now(),
              flightDuration: 280,
              fadeUntil: performance.now() + 680
            };
            showPitchBadge(pitch, newX, dodgeY, `💨 ${ofMove}`, "badge-dribble", 900);
            pitch.ticker = `${st.minute}' 💨 ${carrier.player.name} driblou ${marker.player.name} e avança!`;
            prependNarrationLine(
              st,
              "nar-dribble",
              `💨 ${st.minute}' [Drible] ${carrier.player.name} ativou 【${ofMove}】 e passou por ${marker.player.name}!`,
              { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side },
              { name: marker.player.name, sprite: marker.player.sprite, side: marker.side }
            );
          } else {
            const tackleX = Math.max(12, Math.min(88, startX + (attIsUser ? 1.8 : -1.8)));
            const tackleY = startY;
            pitch.ballSide = attIsUser ? "opp" : "user";
            pitch.carrierUid = marker.uid;
            pitch.challengerUid = null;
            pitch.holdBallPos = null;
            pinNodeToCoord(pitch, marker, tackleX, tackleY, true);
            pitch.ballFlight = null;
            pitch.ballX = tackleX + (marker.side === "user" ? 2.2 : -2.2);
            pitch.ballY = tackleY + 1.2;
            pitch.passTrail = null;
            showPitchBadge(pitch, tackleX, tackleY, `🛡️ ${dfMove}`, "badge-steal", 900);
            if (!attIsUser) pitch.stats.userSteals++;
            pitch.ticker = `${st.minute}' 🛡️ ${marker.player.name} desarmou ${carrier.player.name}!`;
            prependNarrationLine(
              st,
              "nar-steal",
              `🛡️ ${st.minute}' [Desarme] ${marker.player.name} usou 【${dfMove}】 e roubou a bola de ${carrier.player.name}!`,
              { name: marker.player.name, sprite: marker.player.sprite, side: marker.side },
              { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side }
            );
          }
        };

        if (canHissatsuFieldDuel) {
          pitch.lastClashMinute = st.minute;
          pitch.ticker = `${st.minute}' 💨 ${carrier.player.name} encara ${marker.player.name} no 1x1!`;
          syncLivePitchDOM(st);
          playShotClashAndContinue(
            st,
            {
              kind: "DRIBBLE",
              dir: attIsUser ? "ltr" : "rtl",
              userPlayer: attIsUser
                ? { name: carrier.player.name, sprite: carrier.player.sprite, roleText: "DRIBLE" }
                : { name: marker.player.name, sprite: marker.player.sprite, roleText: "MARCAÇÃO" },
              oppPlayer: attIsUser
                ? { name: marker.player.name, sprite: marker.player.sprite, roleText: "MARCAÇÃO" }
                : { name: carrier.player.name, sprite: carrier.player.sprite, roleText: "DRIBLE" },
              topMoveName: ofMove,
              bottomMoveName: dfMove,
              bottomIcon: "DF",
              outcomePositive: wonDribble ? attIsUser : !attIsUser,
              resultBannerText: wonDribble ? "💨 DRIBLE PERFEITO!" : "🛡️ DESARMADO!"
            },
            applyDribbleOutcome,
            ovrDiff
          );
          return;
        } else {
          applyDribbleOutcome();
          syncLivePitchDOM(st);
          handleMinuteEndBoundaries(st, ovrDiff);
          return;
        }
      }

      // ----------------------------------------------------------------------
      // AÇÃO 3: FINALIZAÇÃO (CHUTE vs BLOQUEIO DA ZAGA PRÓXIMA ou GOLEIRO)
      // ----------------------------------------------------------------------
      const pureDefs = defNodes.filter((n) => n.role === "DF");
      const gkNode = defNodes.find((n) => n.role === "GK") || defNodes[0];
      const goalX = attIsUser ? 97 : 3;
      const goalY = 50;

      const vsDefender = pureDefs.length > 0 && Math.random() < 0.30;
      const blocker = vsDefender
        ? pickMarkerFor(pureDefs, ["DF"], (carrier.x + goalX) * 0.5, (carrier.y + goalY) * 0.5)
        : null;
      const defTarget = vsDefender ? blocker : gkNode;
      const defCategory = vsDefender ? "DF" : "GK";
      const shooterNode = carrier;

      const isLongShot = effRole === "MF";
      const shotScore =
        calcNodeDuelScore(shooterNode, attSupport, defTarget?.player?.element) - (isLongShot ? 3.5 : 0);
      const stopScore = calcNodeDuelScore(defTarget, defSupport, shooterNode?.player?.element);

      const goalProb = vsDefender
        ? logisticWinProb(shotScore, stopScore, -4.8, 0.08, 0.48)
        : logisticWinProb(shotScore, stopScore, -7.4, 0.08, 0.50);
      const isGoal = Math.random() < goalProb;

      spendStamina(shooterNode, 14);
      spendStamina(defTarget, 11);
      if (attIsUser) pitch.stats.userShots++;
      else pitch.stats.oppShots++;

      const shotInfo = buildGoalShotLabel(shooterNode.player);
      const defMoveName =
        pickPlayerMove(defTarget.player, defCategory) ||
        (defCategory === "DF" ? "Bloqueio de Corpo" : "Defesa Direta");

      const shotOriginX = shooterNode.x;
      const shotOriginY = shooterNode.y;

      const duelX = vsDefender
        ? Math.max(14, Math.min(86, shotOriginX * 0.38 + goalX * 0.62))
        : attIsUser
        ? 91.5
        : 8.5;
      const duelY = vsDefender
        ? Math.max(20, Math.min(80, shotOriginY * 0.42 + goalY * 0.58))
        : Math.max(41, Math.min(59, 50 + (shotOriginY - 50) * 0.22));

      // CRÍTICO: assim que chuta, o batedor SOLTA a bola! Ela NUNCA volta pro pé dele!
      pitch.carrierUid = null;
      pitch.challengerUid = defTarget.uid;
      pitch.holdBallPos = { x: duelX, y: duelY };
      pitch.lastClashMinute = st.minute;
      if (vsDefender) {
        pinNodeToCoord(pitch, defTarget, duelX, duelY, false);
      }

      // Fase 1: bola voa continuamente até o momento do impacto (2150ms no modo 1x)
      startBallFlight(
        pitch,
        shotOriginX,
        shotOriginY,
        duelX,
        duelY,
        state.simSpeed === 1 ? 2150 : passFlightMs,
        3.2,
        "SHOT",
        "#f97316"
      );
      showPitchBadge(pitch, shotOriginX, shotOriginY, `🔥 ${shotInfo.label}`, "badge-shot", state.simSpeed === 1 ? 1900 : 650);
      pitch.ticker = `${st.minute}' 🔥 CHUTE! ${shooterNode.player.name} (${shotInfo.label}) vs ${defTarget.player.name}!`;
      syncLivePitchDOM(st);

      // Fase 2 (No impacto): se foi gol, bola entra e FICA na rede; se não, vai para o defensor/goleiro!
      const applyShotImpact = () => {
        if (isGoal) {
          pitch.carrierUid = null;
          pitch.challengerUid = null;
          pitch.holdBallPos = { x: goalX, y: goalY };
          startBallFlight(pitch, duelX, duelY, goalX, goalY, state.simSpeed === 1 ? 360 : 50, 0.8, "GOAL", "#facc15");
          pitch.goalFlashSide = attIsUser ? "right" : "left";
          pitch.goalFlashUntil = performance.now() + 1300;
          showPitchBadge(pitch, goalX, goalY, "⚽ GOOOL!!", "badge-goal", 1200);

          if (attIsUser) {
            st.userScore++;
            const goalObj = {
              minute: st.minute,
              name: shooterNode.player.name,
              sprite: shooterNode.player.sprite,
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
                ? `⚽ ${st.minute}' GOOOL DO DREAM TEAM! ${shooterNode.player.name} disparou 【${shotInfo.label}】 e furou 【${defMoveName}】 de ${defTarget.player.name}! (${st.userScore} x ${st.oppScore})`
                : `⚽ ${st.minute}' GOOOL DO DREAM TEAM! ${shooterNode.player.name} superou ${defTarget.player.name} com um ${shotInfo.label.toLowerCase()}! (${st.userScore} x ${st.oppScore})`,
              { name: shooterNode.player.name, sprite: shooterNode.player.sprite, side: "user" },
              { name: defTarget.player.name, sprite: defTarget.player.sprite, side: "opp" }
            );
          } else {
            st.oppScore++;
            const goalObj = {
              minute: st.minute,
              name: shooterNode.player.name,
              sprite: shooterNode.player.sprite,
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
                ? `💥 ${st.minute}' GOL DE ${st.oppTeam.name.toUpperCase()}! ${shooterNode.player.name} usou 【${shotInfo.label}】 e venceu 【${defMoveName}】 de ${defTarget.player.name}! (${st.userScore} x ${st.oppScore})`
                : `💥 ${st.minute}' GOL DE ${st.oppTeam.name.toUpperCase()}! ${shooterNode.player.name} venceu ${defTarget.player.name} com um ${shotInfo.label.toLowerCase()}! (${st.userScore} x ${st.oppScore})`,
              { name: shooterNode.player.name, sprite: shooterNode.player.sprite, side: "opp" },
              { name: defTarget.player.name, sprite: defTarget.player.sprite, side: "user" }
            );
          }
          pitch.ticker = `${st.minute}' ⚽ GOOOL de ${shooterNode.player.name}! (${st.userScore} x ${st.oppScore})`;
        } else {
          pitch.ballSide = attIsUser ? "opp" : "user";
          pitch.carrierUid = defTarget.uid;
          pitch.challengerUid = null;
          pitch.holdBallPos = null;
          if (vsDefender) {
            pinNodeToCoord(pitch, defTarget, duelX, duelY, true);
          }
          pitch.ballFlight = null;
          pitch.ballX = duelX + (defTarget.side === "user" ? 2.2 : -2.2);
          pitch.ballY = duelY + 1.2;
          pitch.passTrail = null;
          showPitchBadge(pitch, duelX, duelY, `🧤 ${defMoveName}`, "badge-steal", 1000);

          if (defCategory === "DF") {
            if (!attIsUser) pitch.stats.userSteals++;
            pitch.ticker = `${st.minute}' 🛡️ ${defTarget.player.name} bloqueou o chute de ${shooterNode.player.name}!`;
            prependNarrationLine(
              st,
              "nar-steal",
              `🛡️ ${st.minute}' [Bloqueio da Zaga] ${defTarget.player.name} entrou na frente com 【${defMoveName}】 e bloqueou 【${shotInfo.label}】 de ${shooterNode.player.name}!`,
              { name: defTarget.player.name, sprite: defTarget.player.sprite, side: defTarget.side },
              { name: shooterNode.player.name, sprite: shooterNode.player.sprite, side: shooterNode.side }
            );
          } else {
            if (!attIsUser) pitch.stats.userSaves++;
            pitch.ticker = `${st.minute}' 🧤 ${defTarget.player.name} defendeu o chute de ${shooterNode.player.name}!`;
            prependNarrationLine(
              st,
              "nar-save",
              `🧤 ${st.minute}' [Defesa de Goleiro] ${defTarget.player.name} acionou 【${defMoveName}】 e espalmou 【${shotInfo.label}】 de ${shooterNode.player.name}!`,
              { name: defTarget.player.name, sprite: defTarget.player.sprite, side: defTarget.side },
              { name: shooterNode.player.name, sprite: shooterNode.player.sprite, side: shooterNode.side }
            );
          }
        }
      };

      // Fase 3: Após gol, quem SOFREU o gol recomeça obrigatoriamente do círculo central (50%, 50%)!
      const applyAfterGoalKickoff = () => {
        if (isGoal) {
          const concedingSide = attIsUser ? "opp" : "user";
          resetPitchForKickoff(pitch, concedingSide, true);
          pitch.ticker = `${st.minute}' ⚽ Saída no centro com ${concedingSide === "user" ? "Dream Team" : st.oppTeam.name}!`;
        }
      };

      const bannerText = isGoal
        ? "⚽ GOOOL!!"
        : defCategory === "DF"
        ? "🛡️ BLOQUEADO PELA ZAGA!"
        : "🧤 DEFENDEU!";

      const defRoleBadge = defCategory === "DF" ? "ZAGA • BLOQUEIO" : "GOLEIRO";

      playShotClashAndContinue(
        st,
        {
          kind: "SHOT",
          dir: attIsUser ? "ltr" : "rtl",
          userPlayer: attIsUser
            ? { name: shooterNode.player.name, sprite: shooterNode.player.sprite, roleText: "CHUTE" }
            : { name: defTarget.player.name, sprite: defTarget.player.sprite, roleText: defRoleBadge },
          oppPlayer: attIsUser
            ? { name: defTarget.player.name, sprite: defTarget.player.sprite, roleText: defRoleBadge }
            : { name: shooterNode.player.name, sprite: shooterNode.player.sprite, roleText: "CHUTE" },
          topMoveName: shotInfo.label,
          bottomMoveName: defMoveName,
          bottomIcon: defCategory,
          outcomePositive: isGoal ? attIsUser : !attIsUser,
          resultBannerText: bannerText
        },
        applyShotImpact,
        ovrDiff,
        applyAfterGoalKickoff
      );
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
    st.pitch = initMatchPitchState(st, stageIdx);

    renderTournamentScreen();
    startPitchRafLoop(st);
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
        bondsBar.innerHTML = `<span style="color:#93c5fd;">📐 <strong>Dica Tática:</strong> Escale todos os <strong>11 na posição correta</strong> (+20% Quím / +2 OVR) e conecte jogadores do <strong>mesmo elemento colados</strong> (lado/acima/abaixo) para ativar links elementais!</span>`;
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
            ⚡ <strong style="color:#facc15;">Como somar Poder Final & Química (para você e os adversários):</strong><br/>
            • <strong>Posição Certa:</strong> <strong style="color:#86efac;">+20% Quím / +2 OVR</strong> e bônus de Poder ao escalar os 11 na posição natural!<br/>
            • <strong>Sinergia Elemental Próxima 🔗:</strong> Colocar jogadores do <strong>mesmo elemento colados</strong> (ao lado, acima ou abaixo) acende um link no campo e dá +Química e +Poder!<br/>
            • <strong>Duplas/Trios & Mesmo Clube:</strong> Laços do anime e colegas de equipe também somam força!
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
                          ? `Toque em uma vaga de <strong>${sel.pos}</strong> em verde! (Feche 11/11 p/ <strong>+20% Quím e +2 OVR</strong> • Colar elementos iguais acende link próximo!)`
                          : `⚠️ Vagas de ${sel.pos} ocupadas! Improvisar tira <strong>-6 a -14 OVR</strong> do jogador e perde o bônus de <strong>11/11 na Posição (+20% Quím / +2 OVR)</strong>.`
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

    if (!st.pitch) st.pitch = initMatchPitchState(st, t.stageIndex);
    const stadiumStyle = UI.stadiumBg ? `background-image: url('${UI.stadiumBg}');` : "";
    const oppStats = calcOpponentStats(st.oppTeam, t.stageIndex);

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
            <div style="font-size:0.7rem; color:#fed7aa; font-weight:800;">Poder ${stats.power.toLocaleString("pt-BR")} • OVR ${stats.ovr} • Quím ${stats.chem}%</div>
          </div>

          <div class="score-digits">
            <span id="live-score-user">${st.userScore}</span>
            <span style="font-size:1.2rem; color:#93c5fd;">X</span>
            <span id="live-score-opp">${st.oppScore}</span>
          </div>

          <div class="score-team">
            <img class="score-emblem" src="${st.oppTeam.emblem}" alt="${st.oppTeam.name}" />
            <div style="font-weight:900; font-size:0.95rem;">${st.oppTeam.name}</div>
            <div style="font-size:0.7rem; color:#facc15; font-weight:800;">Poder ${oppStats.power.toLocaleString("pt-BR")} • OVR ${oppStats.ovr} • Quím ${oppStats.chem}%</div>
          </div>
        </div>

        ${
          st.penaltiesText
            ? `<div style="text-align:center; background:rgba(250,204,21,0.15); border:1px solid #facc15; padding:6px; border-radius:8px; font-weight:800; color:#fde047; font-size:0.82rem;">
                ${moveIconHTML("SH")} ${st.penaltiesText}
              </div>`
            : ""
        }

        <div class="match-arena-split">
          ${buildLivePitchBoxHTML(st, st.oppTeam)}

          <div class="match-right-panel">
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
        clearTournamentTimers(false);
        if (state.spinTimerId) {
          clearTimeout(state.spinTimerId);
          state.spinTimerId = null;
        }
        state.isSpinning = false;
        state.phase = "draft";
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
