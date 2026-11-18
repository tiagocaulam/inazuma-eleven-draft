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

  function moveIconHTML(cat, extraCls = "") {
    const src = UI["move" + cat];
    if (!src) return "";
    const cls = extraCls ? `move-icon-img ${extraCls}` : "move-icon-img";
    return `<img class="${cls}" src="${src}" alt="${cat}" />`;
  }

  function captainIconHTML(extraCls = "") {
    if (!UI.captain) return "";
    const cls = extraCls ? `captain-icon-img ${extraCls}` : "captain-icon-img";
    return `<img class="${cls}" src="${UI.captain}" alt="Capitão" title="Capitão" />`;
  }

  function formationIconHTML(extraCls = "") {
    if (!UI.formation) return "";
    const cls = extraCls ? `form-icon-img ${extraCls}` : "form-icon-img";
    return `<img class="${cls}" src="${UI.formation}" alt="" />`;
  }

  function ffLogoIconHTML(extraCls = "") {
    const src = UI.ffLogo || UI.raimonEmblem;
    if (!src) return "";
    const cls = extraCls ? `ff-mini-img ${extraCls}` : "ff-mini-img";
    return `<img class="${cls}" src="${src}" alt="FF" />`;
  }

  function buildMiniBallSVG(cls = "mini-ball-svg") {
    return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.2" fill="#f8fafc" stroke="#0f172a" stroke-width="1.8"/><polygon points="12,7.2 15.8,10 14.3,14.5 9.7,14.5 8.2,10" fill="#0f172a"/><line x1="12" y1="7.2" x2="12" y2="2" stroke="#0f172a" stroke-width="1.4"/><line x1="15.8" y1="10" x2="21.2" y2="8.2" stroke="#0f172a" stroke-width="1.4"/><line x1="8.2" y1="10" x2="2.8" y2="8.2" stroke="#0f172a" stroke-width="1.4"/><line x1="14.3" y1="14.5" x2="18.2" y2="20" stroke="#0f172a" stroke-width="1.4"/><line x1="9.7" y1="14.5" x2="5.8" y2="20" stroke="#0f172a" stroke-width="1.4"/></svg>`;
  }

  function buildGoalTopDownSVG(side = "left") {
    const isLeft = side === "left";
    const netPatternId = isLeft ? "netGridLeft" : "netGridRight";
    const postGradId = isLeft ? "postGradLeft" : "postGradRight";

    // Vista de cima totalmente (planta baixa pura a 90°):
    // side === 'left': o travessão e postes ficam exatamente no limite direito do box (x=35),
    // apoiados sobre a linha de fundo (4.5%), enquanto a rede se estende para trás na grama externa (x=2).
    // side === 'right': o travessão e postes ficam no limite esquerdo do box (x=2),
    // apoiados sobre a linha de fundo (95.5%), enquanto a rede se estende para trás na grama externa (x=35).
    const frontX = isLeft ? 35 : 2;
    const backX = isLeft ? 2 : 35;
    const topY = 6;
    const botY = 94;
    const rectX = Math.min(frontX, backX);
    const width = Math.abs(frontX - backX);
    const height = botY - topY;

    return `
      <svg class="goal-topdown-svg side-${side}" viewBox="0 0 37 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="${postGradId}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#cbd5e1"/>
            <stop offset="30%" stop-color="#ffffff"/>
            <stop offset="70%" stop-color="#f8fafc"/>
            <stop offset="100%" stop-color="#64748b"/>
          </linearGradient>
          <pattern id="${netPatternId}" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(255,255,255,0.68)" stroke-width="0.8"/>
          </pattern>
        </defs>

        <!-- Sombra da rede e da armação no gramado atrás da linha de fundo -->
        <rect x="${rectX}" y="${topY}" width="${width}" height="${height}" rx="1" fill="rgba(0, 15, 6, 0.45)" />

        <!-- Malha quadriculada da rede vista de cima totalmente -->
        <rect x="${rectX}" y="${topY}" width="${width}" height="${height}" class="goal-net-mesh" fill="url(#${netPatternId})" stroke="rgba(255,255,255,0.72)" stroke-width="1.2" />

        <!-- Estrutura metálica de sustentação (barras horizontais e barra de fundo no chão) -->
        <line x1="${frontX}" y1="${topY}" x2="${backX}" y2="${topY}" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="${frontX}" y1="${botY}" x2="${backX}" y2="${botY}" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="${backX}" y1="${topY}" x2="${backX}" y2="${botY}" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="${backX}" cy="${topY}" r="2" fill="#64748b"/>
        <circle cx="${backX}" cy="${botY}" r="2" fill="#64748b"/>

        <!-- Travessão branco cilíndrico visto de cima conectando os dois postes sobre a linha de fundo -->
        <line x1="${frontX}" y1="${topY}" x2="${frontX}" y2="${botY}" stroke="url(#${postGradId})" stroke-width="4.4" stroke-linecap="round"/>
        <line x1="${frontX}" y1="${topY}" x2="${frontX}" y2="${botY}" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>

        <!-- Postes verticais cilíndricos (vistos de cima como círculos brancos sobre a linha de fundo) -->
        <circle cx="${frontX}" cy="${topY}" r="3.2" fill="#ffffff" stroke="#1e293b" stroke-width="1.2"/>
        <circle cx="${frontX}" cy="${topY}" r="1.4" fill="#f8fafc"/>
        <circle cx="${frontX}" cy="${botY}" r="3.2" fill="#ffffff" stroke="#1e293b" stroke-width="1.2"/>
        <circle cx="${frontX}" cy="${botY}" r="1.4" fill="#f8fafc"/>
      </svg>
    `;
  }

  function buildRefereeGraphicSVG(soundText, isFulltime) {
    return `
      <svg class="referee-vector-svg" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="refGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#1e3a8a"/>
            <stop offset="60%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </radialGradient>
          <linearGradient id="refJerseyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="50%" stop-color="#f8fafc"/>
            <stop offset="100%" stop-color="#e2e8f0"/>
          </linearGradient>
          <linearGradient id="refGoldWhistle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="50%" stop-color="#facc15"/>
            <stop offset="100%" stop-color="#ca8a04"/>
          </linearGradient>
        </defs>

        <!-- Fundo de estádio noturno com holofote -->
        <rect width="120" height="120" rx="8" fill="url(#refGlow)"/>

        <!-- Feixes de luz anime ao fundo -->
        <path d="M 0,0 L 50,120 L 70,120 L 120,0 Z" fill="rgba(56, 189, 248, 0.08)"/>
        <path d="M 60,0 L 40,120 L 80,120 Z" fill="rgba(250, 204, 21, 0.09)"/>

        <!-- Uniforme oficial de árbitro (Camisa listrada preta e branca) -->
        <path d="M 28,76 L 16,120 L 104,120 L 92,76 Z" fill="url(#refJerseyGrad)"/>
        <!-- Listras verticais pretas -->
        <path d="M 38,76 L 30,120 L 40,120 L 46,76 Z" fill="#0f172a"/>
        <path d="M 56,76 L 53,120 L 63,120 L 64,76 Z" fill="#0f172a"/>
        <path d="M 74,76 L 76,120 L 86,120 L 82,76 Z" fill="#0f172a"/>

        <!-- Bolso com cartões (Amarelo e Vermelho) visíveis -->
        <rect x="76" y="86" width="7" height="13" rx="1.2" fill="#facc15" stroke="#ca8a04" stroke-width="0.5" transform="rotate(6 76 86)"/>
        <rect x="80" y="87" width="7" height="13" rx="1.2" fill="#ef4444" stroke="#991b1b" stroke-width="0.5" transform="rotate(18 80 87)"/>

        <!-- Gola da camisa -->
        <polygon points="50,76 60,88 70,76" fill="#0f172a"/>

        <!-- Pescoço -->
        <rect x="53" y="62" width="14" height="16" rx="2" fill="#fed7aa"/>

        <!-- Cabeça / Rosto estilo anime -->
        <polygon points="46,42 60,70 74,42" fill="#ffedd5"/>
        <circle cx="45" cy="48" r="4" fill="#fed7aa"/>
        <circle cx="75" cy="48" r="4" fill="#fed7aa"/>

        <!-- Cabelo preto espetado estilo anime -->
        <path d="M 40,42 Q 60,16 80,42 Q 88,30 76,20 Q 60,12 44,20 Q 32,30 40,42 Z" fill="#1e293b"/>
        <path d="M 46,24 L 52,14 L 56,22 L 64,12 L 68,22 L 76,16 L 74,26" stroke="#0f172a" stroke-width="2" stroke-linecap="round" fill="#1e293b"/>

        <!-- Olhos focados e determinados -->
        <path d="M 48,45 L 56,47" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M 72,45 L 64,47" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round"/>
        <!-- Sobrancelhas inclinadas -->
        <path d="M 46,42 L 56,44" stroke="#020617" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M 74,42 L 64,44" stroke="#020617" stroke-width="2.2" stroke-linecap="round"/>

        <!-- Cordão do apito no pescoço -->
        <path d="M 52,70 Q 60,78 68,70" stroke="#475569" stroke-width="1.4" fill="none"/>

        <!-- Apito dourado na boca do árbitro -->
        <path d="M 58,56 L 66,56 L 68,53 L 73,53 L 73,59 L 68,59 L 66,62 L 58,60 Z" fill="url(#refGoldWhistle)" stroke="#854d0e" stroke-width="0.8"/>
        <circle cx="71" cy="56" r="3.2" fill="#fef08a" stroke="#ca8a04" stroke-width="0.6"/>

        <!-- Ondas sonoras radiantes do apito (pulsantes via CSS) -->
        <path class="ref-whistle-wave wave-a" d="M 77,50 A 8 8 0 0 1 77,62" stroke="#facc15" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <path class="ref-whistle-wave wave-b" d="M 83,45 A 15 15 0 0 1 83,67" stroke="#fde047" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path class="ref-whistle-wave wave-c" d="M 89,40 A 22 22 0 0 1 89,72" stroke="#fef08a" stroke-width="1.8" stroke-dasharray="3 2" stroke-linecap="round" fill="none"/>

        <!-- Balão do som do apito na base -->
        <rect x="8" y="96" width="104" height="18" rx="9" fill="rgba(15, 23, 42, 0.94)" stroke="#facc15" stroke-width="1.2"/>
        <text x="60" y="109" text-anchor="middle" font-size="8.5" font-weight="900" fill="#fde047" letter-spacing="0.5">${soundText}</text>
      </svg>
    `;
  }

  function renderPitchIconTag(iconCat, extraCls = "badge-move-icon") {
    if (!iconCat) return "";
    if (iconCat === "BALL") return buildMiniBallSVG(extraCls);
    if (iconCat === "FF") return ffLogoIconHTML(extraCls);
    return moveIconHTML(iconCat, extraCls);
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
      name: "Trio Lendário (Endo, Goenji, Kido)",
      members: ["Endou Mamoru", "Gouenji Shuuya", "Kidou Yuuto"],
      minCount: 2,
      chemPerMatch: 14
    },
    {
      id: "fogo_gelo",
      name: "Fogo Cruzado (Goenji & Fubuki)",
      members: ["Gouenji Shuuya", "Fubuki Shirou"],
      minCount: 2,
      chemPerMatch: 16
    },
    {
      id: "laco_imperial",
      name: "Irmandade Imperial (Kido, Sakuma, Genda, Fudou)",
      members: ["Kidou Yuuto", "Sakuma Jirou", "Genda Koujirou", "Fudou Akio"],
      minCount: 2,
      chemPerMatch: 12
    },
    {
      id: "trio_caos",
      name: "Trio Caos / Dragão de Fogo (Aphrodi, Burn, Gazel, Choi)",
      members: ["Afuro Terumi", "Nagumo Haruya", "Suzuno Fuusuke", "Choi Chang-Soo"],
      minCount: 2,
      chemPerMatch: 13
    },
    {
      id: "laco_aliea",
      name: "Estrelas do Instituto Alien (Hiroto, Reize, Desarm, Ulvida, Nero)",
      members: ["Kiyama Hiroto", "Midorikawa Ryuuji", "Saginuma Osamu", "Yagami Reina", "Nemuro Keita"],
      minCount: 2,
      chemPerMatch: 12
    },
    {
      id: "laco_fenix_usa",
      name: "Laço Fênix & Unicórnio (Ichinose, Domon, Kruger, Dylan, Endo)",
      members: ["Ichinose Kazuya", "Domon Asuka", "Mark Krueger", "Dylan Keith", "Endou Mamoru"],
      minCount: 2,
      chemPerMatch: 11
    },
    {
      id: "caravana_inazuma",
      name: "Caravana Inazuma (Kazemaru, Kabeyama, Someoka, Tsunami, Tachimukai, Kogure, Touko)",
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
      name: "Companheiros de Seleção (Toramaru, Tobitaka, Hijikata, Hiroto, Fubuki, Goenji, Endo)",
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
      name: "Mestres da Orfeu (Fidio, Nakata, Blasi)",
      members: ["Fideo Ardena", "Nakata Hidetoshi", "Gigi Blasi"],
      minCount: 2,
      chemPerMatch: 14
    },
    {
      id: "legado_daisuke",
      name: "Legado de Daisuke (Endo & Rococo)",
      members: ["Endou Mamoru", "Rococo Urupa"],
      minCount: 2,
      chemPerMatch: 16
    },
    {
      id: "geracao_go",
      name: "Revolução GO & Chrono Storm (Tenma, Tsurugi, Shindou, Kirino, Shinsuke, Fei, Kinako, Zanark)",
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
      name: "Luz & Escuridão (Hakuryuu & Shuu)",
      members: ["Hakuryuu", "Shuu"],
      minCount: 2,
      chemPerMatch: 18
    },
    {
      id: "trio_ares_orion",
      name: "Trindade Ares/Orion (Asuto, Haizaki, Nosaka)",
      members: ["Inamori Asuto", "Haizaki Ryouhei", "Nosaka Yuuma"],
      minCount: 2,
      chemPerMatch: 15
    },
    {
      id: "laco_outei_seishou",
      name: "Rivais & Parceiros (Nosaka, Nishikage, Haizaki, Mizukamiya, Kira Hiroto)",
      members: ["Nosaka Yuuma", "Nishikage Seiya", "Haizaki Ryouhei", "Mizukamiya Seiryuu", "Kira Hiroto"],
      minCount: 2,
      chemPerMatch: 12
    },
    {
      id: "laco_orion_amigos",
      name: "Estrelas de Orion (Ichihoshi, Froy, Malik, Asuto, Yurika)",
      members: ["Ichihoshi Mitsuru", "Ichihoshi Hikaru", "Froy Girikanan", "Malik Kuabel", "Inamori Asuto", "Yurika Beor"],
      minCount: 2,
      chemPerMatch: 13
    },
    {
      id: "earth_eleven_galaxy",
      name: "Earth Eleven (Ibuki, Matatagi, Konoha, Minaho, Manabe, Tenma, Tsurugi, Shindou)",
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

  const WORLD_TEAM_IDS = new Set([
    "star_unicorn",
    "navy_invader",
    "knights_of_queen",
    "muteki_no_giant",
    "the_empire",
    "perfect_spark",
    "unicorn",
    "earth_eleven",
    "fire_dragon",
    "ixal_fleet",
    "orpheus",
    "the_kingdom",
    "inazuma_japan__orion_",
    "shadow_of_orion",
    "inazuma_japan",
    "little_gigant"
  ]);

  const state = {
    phase: "menu", // "menu" | "draft" | "tournament"
    gameMode: "relampago",
    storyLockNotice: false,
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
      worldUnlocked: false,
      worldGroup: null,
      timerId: null,
      pitchRafId: null,
      clashTimer1: null,
      clashTimer2: null,
      pendingClashFinish: null,
      shotFlightTimer: null,
      pendingShotFlightFinish: null,
      netFlightTimer: null,
      pendingNetFlightFinish: null,
      actionBeatTimer: null,
      pendingBeatFinish: null,
      whistleKeyHandler: null,
      penTimerId: null,
      prepTimerId: null,
      prepMatchTimerId: null,
      prep: null,
      prepBonuses: {
        xp: 0,
        chem: 0,
        power: 0,
        staminaMul: 1,
        lateMatchNoStaminaLoss: false,
        permanentDoublePrep: false,
        tireTrainingDone: false,
        efficiencyLvl: 0,
        restLvl: 0,
        enduranceLvl: 0,
        wingExplosionLvl: 0,
        midSynergyLvl: 0,
        defBlockLvl: 0,
        hissatsuMasteryLvl: 0,
        xpSpiritLvl: 0,
        passBypassLvl: 0,
        counterShotLvl: 0,
        dribbleEdgeLvl: 0,
        log: []
      },
      teamEnergy: 100,
      tactics: {
        lane: "balanced", // "wings" | "balanced" | "center"
        posture: "balanced", // "defensive" | "balanced" | "offensive"
        intensity: "medium" // "low" | "medium" | "high"
      },
      showRunSummary: false
    }
  };

  function getTeamEnergy() {
    const val = state.tournament?.teamEnergy;
    return typeof val === "number" && !Number.isNaN(val) ? Math.max(0, Math.min(100, val)) : 100;
  }

  function getTeamEnergyBand(energy = getTeamEnergy()) {
    if (energy >= 70) {
      return {
        key: "GREEN",
        label: "Descansado",
        color: "#4ade80",
        bg: "rgba(21, 128, 61, 0.28)",
        border: "rgba(74, 222, 128, 0.55)",
        duelPenalty: 0,
        startStamina: 100,
        desc: "100% dos atributos em campo"
      };
    }
    if (energy >= 35) {
      return {
        key: "YELLOW",
        label: "Cansado",
        color: "#facc15",
        bg: "rgba(161, 98, 7, 0.3)",
        border: "rgba(250, 204, 21, 0.6)",
        duelPenalty: -3.2,
        startStamina: 82,
        desc: "-10% Poder nos duelos"
      };
    }
    return {
      key: "RED",
      label: "Exausto",
      color: "#ef4444",
      bg: "rgba(153, 27, 27, 0.35)",
      border: "rgba(248, 113, 113, 0.65)",
      duelPenalty: -6.8,
      startStamina: 62,
      desc: "-22% Poder nos duelos"
    };
  }

  function adjustTeamEnergy(delta) {
    if (!state.tournament) return 100;
    const prev = getTeamEnergy();
    const next = Math.max(0, Math.min(100, Math.round((prev + delta) * 10) / 10));
    state.tournament.teamEnergy = next;
    return next;
  }

  function getPrepLocationCost(loc, t = state.tournament) {
    const baseCost = loc?.energyCost || 0;
    if (baseCost <= 0) return 0;
    const bonuses = t?.prepBonuses || {};
    const passDiscount = bonuses.permanentDoublePrep ? 5 : 0;
    const effDiscount = (bonuses.efficiencyLvl || 0) * 3;
    return Math.max(5, baseCost - passDiscount - effDiscount);
  }

  function getRestEnergyGain(t = state.tournament) {
    const restLvl = t?.prepBonuses?.restLvl || 0;
    return 60 + restLvl * 10;
  }

  function getTactics() {
    if (!state.tournament.tactics) {
      state.tournament.tactics = { lane: "balanced", posture: "balanced", intensity: "medium" };
    }
    return state.tournament.tactics;
  }

  function getOpponentDynamicPosture() {
    const st = state.tournament?.stages?.[state.tournament.stageIndex];
    if (!st || st.isGoldenGoal5v5 || st.finished) return "balanced";
    const m = st.minute || 0;
    if (st.oppScore < st.userScore && m >= 50) return "offensive";
    if (st.oppScore === st.userScore + 1 && m >= 70) return "defensive";
    return "balanced";
  }

  function switchTeamFormation(newFormationKey) {
    if (!DB.formations[newFormationKey] || state.formation === newFormationKey) return false;
    const oldSlots = getSlots();
    const byRole = { GK: [], DF: [], MF: [], FW: [] };
    oldSlots.forEach((s) => {
      const p = state.squad[s.id];
      if (p) {
        const bucket = byRole[s.role] || byRole.MF;
        bucket.push(p);
      }
    });
    const leftover = [];
    const newSlots = DB.formations[newFormationKey].slots;
    const nextSquad = {};
    // 1ª passada: encaixa na mesma função (GK, DF, MF, FW)
    newSlots.forEach((s) => {
      const pool = byRole[s.role];
      if (pool && pool.length > 0) {
        nextSquad[s.id] = pool.shift();
      }
    });
    Object.values(byRole).forEach((arr) => leftover.push(...arr));
    // 2ª passada: preenche slots restantes com quem sobrou
    newSlots.forEach((s) => {
      if (!nextSquad[s.id] && leftover.length > 0) {
        nextSquad[s.id] = leftover.shift();
      }
    });
    state.formation = newFormationKey;
    state.squad = nextSquad;
    return true;
  }

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

  function getPlayerPositionsList(player) {
    if (!player) return [];
    const list = [player.pos];
    if (Array.isArray(player.altPositions)) {
      player.altPositions.forEach((r) => {
        if (r && !list.includes(r)) list.push(r);
      });
    }
    return list;
  }

  function playerMatchesRole(player, role) {
    return Boolean(player && role && getPlayerPositionsList(player).includes(role));
  }

  function getPlayerFormSprite(player, roleOrMode) {
    if (!player) return "";
    const fs = player.formSprites;
    if (fs) {
      if (roleOrMode && fs[roleOrMode]) return fs[roleOrMode];
      if ((roleOrMode === "MF" || roleOrMode === "FW" || roleOrMode === "DF") && fs.FIELD) {
        return fs.FIELD;
      }
    }
    return player.sprite || "";
  }

  function getEffectiveOvr(player, slotRole) {
    if (!player) return 0;
    // OVR é a média dos status base do jogador no Nv. 1 (fixo).
    // Apenas improvisar fora da posição reduz o OVR tático naquela vaga.
    if (!slotRole || playerMatchesRole(player, slotRole)) return player.ovr;
    const validPos = getPlayerPositionsList(player);
    const adj = validPos.some(
      (pos) =>
        (pos === "DF" && slotRole === "MF") ||
        (pos === "MF" && (slotRole === "DF" || slotRole === "FW")) ||
        (pos === "FW" && slotRole === "MF")
    );
    return Math.max(45, player.ovr - (adj ? 6 : 14));
  }

  function getPlayerLevel(player) {
    if (!player) return 1;
    return Math.max(1, Math.min(30, Math.round(player.level || 1)));
  }

  // Perfis de Status Base inspirados na Wiki/Jogos de Inazuma Eleven:
  // FOR (Força/Chute), TEC (Técnica/Controle), DEF (Defesa/Guarda), VEL (Velocidade), FIS (Físico/Vigor)
  // A soma dos desvios é 0 para que a média exata dos 5 atributos no Nv. 1 seja igual ao OVERALL (OVR)!
  const CANONICAL_PLAYER_ARCHETYPES = [
    { rx: /endou|satoru endo/i, d: [0, -1, 4, -5, 2] },
    { rx: /gouenji|goenji/i, d: [4, 0, -6, 1, 1] },
    { rx: /kidou|yuto kido/i, d: [-1, 5, -2, 0, -2] },
    { rx: /kazemaru/i, d: [-3, 1, 0, 7, -5] },
    { rx: /kabeyama/i, d: [-4, -4, 8, -8, 8] },
    { rx: /someoka/i, d: [5, -2, -5, -1, 3] },
    { rx: /fubuki|shirou/i, d: [3, 1, 1, 4, -9] },
    { rx: /hiroto|kiyama|gran/i, d: [4, 2, -6, 1, -1] },
    { rx: /toramaru/i, d: [3, 3, -7, 3, -2] },
    { rx: /tobitaka/i, d: [1, -6, 7, 0, -2] },
    { rx: /tsunami/i, d: [4, -4, 2, -1, -1] },
    { rx: /fudou|caleb/i, d: [1, 5, -1, 1, -6] },
    { rx: /sakuma/i, d: [2, 3, -4, 1, -2] },
    { rx: /genda/i, d: [-2, -2, 6, -4, 2] },
    { rx: /ichinose/i, d: [0, 6, -3, 2, -5] },
    { rx: /domon/i, d: [-4, 0, 5, 0, -1] },
    { rx: /aphrodi|afuro|byron/i, d: [3, 4, -6, 1, -2] },
    { rx: /burn|nagumo/i, d: [4, 0, -6, 3, -1] },
    { rx: /gazel|suzuno/i, d: [2, 3, -4, 2, -3] },
    { rx: /desarm|saginuma/i, d: [3, 0, 3, -5, -1] },
    { rx: /midorikawa|reize/i, d: [0, 3, -4, 4, -3] },
    { rx: /rococo|hector/i, d: [3, -1, 4, -5, -1] },
    { rx: /fideo|paolo/i, d: [3, 4, -5, 1, -3] },
    { rx: /teres|thiago/i, d: [-2, -2, 7, -7, 4] },
    { rx: /edgar/i, d: [5, 1, -5, -1, 0] },
    { rx: /roniejo|robinson/i, d: [4, 3, -6, 2, -3] },
    { rx: /tenma|arion/i, d: [-1, 4, 0, 3, -6] },
    { rx: /tsurugi|victor/i, d: [5, 1, -6, 2, -2] },
    { rx: /shindou|riccardo/i, d: [-1, 6, -1, -1, -3] },
    { rx: /kirino|gabriel/i, d: [-5, 2, 6, 1, -4] },
    { rx: /shinsuke|jp/i, d: [-4, 0, 5, 3, -4] },
    { rx: /kariya|aitor/i, d: [-5, 1, 6, 2, -4] },
    { rx: /sangoku|sam/i, d: [-3, -2, 6, -5, 4] },
    { rx: /nishiki|roma/i, d: [3, 1, -3, 1, -2] },
    { rx: /hakuryuu|bailong/i, d: [5, 0, -7, 3, -1] },
    { rx: /taiyou|sol/i, d: [2, 5, -6, 2, -3] },
    { rx: /yukimura/i, d: [3, 1, -6, 4, -2] },
    { rx: /alpha/i, d: [4, 2, -6, 2, -2] },
    { rx: /beta/i, d: [5, 2, -6, 2, -3] },
    { rx: /gamma/i, d: [4, 3, -6, 1, -2] },
    { rx: /zanark/i, d: [6, -2, -6, 0, 2] },
    { rx: /saru|simeon/i, d: [4, 2, -6, 2, -2] },
    { rx: /fei/i, d: [2, 3, -5, 4, -4] },
    { rx: /kinako|goldie/i, d: [0, 0, 6, -2, -4] },
    { rx: /matatagi|falco/i, d: [2, 0, -7, 8, -3] },
    { rx: /ibuki|terry/i, d: [0, -3, 5, -3, 1] },
    { rx: /ozrock/i, d: [5, 0, -6, 0, 1] },
    { rx: /baddap|bash/i, d: [5, 0, -6, 1, 0] }
  ];

  function calcPlayerAttributes(player, slotRole = null, forcedLevel = null) {
    if (!player) {
      return { for: 75, tec: 75, def: 75, vel: 75, fis: 75, baseAvg: 75, primaryKey: "tec" };
    }
    const role = slotRole || player.pos || "MF";
    const effOvr = getEffectiveOvr(player, slotRole);
    const lvl = forcedLevel != null ? Math.max(1, forcedLevel) : getPlayerLevel(player);
    const fullNameStr = `${player.name || ""} ${player.fullName || ""}`;

    // 1. Perfil Base por Posição + Elemento (ou Arquétipo Canônico da Wiki)
    let dFor = 0, dTec = 0, dDef = 0, dVel = 0, dFis = 0;
    const matchedArch = CANONICAL_PLAYER_ARCHETYPES.find((a) => a.rx.test(fullNameStr));
    if (matchedArch) {
      [dFor, dTec, dDef, dVel, dFis] = matchedArch.d;
    } else {
      const natPos = player.pos || role;
      if (natPos === "FW") {
        dFor = 6; dTec = 1; dDef = -8; dVel = 2; dFis = -1;
      } else if (natPos === "MF") {
        dFor = 0; dTec = 5; dDef = -2; dVel = 2; dFis = -5;
      } else if (natPos === "DF") {
        dFor = -5; dTec = -2; dDef = 6; dVel = -1; dFis = 2;
      } else {
        // GK
        dFor = -4; dTec = -2; dDef = 7; dVel = -4; dFis = 3;
      }

      // Ajuste Elemental
      const elem = player.element || "";
      if (elem === "Fogo") { dFor += 2; dDef -= 1; dTec -= 1; }
      else if (elem === "Vento") { dVel += 3; dFis -= 2; dFor -= 1; }
      else if (elem === "Floresta") { dTec += 2; dVel += 1; dFor -= 2; dFis -= 1; }
      else if (elem === "Montanha") { dDef += 2; dFis += 2; dVel -= 3; dTec -= 1; }

      // Variação determinística leve por ID do jogador mantendo soma zero
      const idStr = String(player.id || player.name || "p");
      let hash = 0;
      for (let i = 0; i < idStr.length; i++) hash = (hash * 31 + idStr.charCodeAt(i)) & 0xffff;
      if (hash % 3 === 0) { dFor += 1; dFis -= 1; }
      else if (hash % 3 === 1) { dTec += 1; dDef -= 1; }
    }

    // Garante que no Nv. 1 os 5 status base tenham média exata = effOvr
    let bFor = Math.max(40, Math.min(99, effOvr + dFor));
    let bTec = Math.max(40, Math.min(99, effOvr + dTec));
    let bDef = Math.max(40, Math.min(99, effOvr + dDef));
    let bVel = Math.max(40, Math.min(99, effOvr + dVel));
    let bFis = Math.max(40, Math.min(99, effOvr + dFis));

    const targetSum = effOvr * 5;
    let curSum = bFor + bTec + bDef + bVel + bFis;
    let diff = targetSum - curSum;
    // Ajusta o resíduo de clamping nos atributos secundários para que round(soma/5) === effOvr
    const adjustOrder =
      (player.pos || role) === "FW"
        ? ["fis", "tec", "vel", "for", "def"]
        : (player.pos || role) === "MF"
        ? ["for", "fis", "def", "vel", "tec"]
        : ["tec", "for", "vel", "fis", "def"];
    const baseMap = { for: bFor, tec: bTec, def: bDef, vel: bVel, fis: bFis };
    let guard = 0;
    while (diff !== 0 && guard < 25) {
      guard++;
      for (const k of adjustOrder) {
        if (diff === 0) break;
        if (diff > 0 && baseMap[k] < 99) { baseMap[k]++; diff--; }
        else if (diff < 0 && baseMap[k] > 40) { baseMap[k]--; diff++; }
      }
    }

    // 2. Crescimento por Nível (escala pelo OVR base e pela função do atleta!)
    // Jogadores de OVR maior ganham mais pontos de atributo a cada nível!
    const lvlSteps = Math.max(0, lvl - 1);
    const ovrGrowthScale = 1.15 + Math.pow(Math.max(0, effOvr - 60) / 16, 1.45);
    const roleWeights =
      role === "FW"
        ? { for: 1.35, tec: 1.05, def: 0.65, vel: 1.15, fis: 0.95 }
        : role === "MF"
        ? { for: 0.95, tec: 1.35, def: 0.85, vel: 1.15, fis: 0.95 }
        : role === "DF"
        ? { for: 0.70, tec: 0.90, def: 1.35, vel: 0.95, fis: 1.20 }
        : { for: 0.75, tec: 0.95, def: 1.40, vel: 0.75, fis: 1.25 };

    const bStats = player.bonusStats || {};
    const keshinBonus = player.keshin ? 4 : 0;
    const evoBonus = (player.moveEvoCount || 0) * 2;
    const manualBonus = player.learnedSecretManual ? 3 : 0;

    // Bônus dinâmicos de função dos buffs escaláveis (funciona mesmo ao trocar formação ou recrutar craque no 5x5!)
    const isSquadMember = Object.values(state.squad).some((sp) => sp && sp.id === player.id);
    const pb = isSquadMember ? state.tournament?.prepBonuses || {} : {};
    const wingStat = (role === "FW" || role === "MF") ? (pb.wingExplosionLvl || 0) * 3 : 0;
    const midStat = role === "MF" ? (pb.midSynergyLvl || 0) * 3 : 0;
    const defStat = (role === "GK" || role === "DF") ? (pb.defBlockLvl || 0) * 3 : 0;

    const finalFor = Math.round(
      baseMap.for + lvlSteps * ovrGrowthScale * roleWeights.for + (bStats.for || 0) + wingStat + (role === "FW" ? keshinBonus + evoBonus + manualBonus : Math.floor(keshinBonus / 2))
    );
    const finalTec = Math.round(
      baseMap.tec + lvlSteps * ovrGrowthScale * roleWeights.tec + (bStats.tec || 0) + midStat + (role === "MF" ? keshinBonus + evoBonus + manualBonus : Math.floor(keshinBonus / 2))
    );
    const finalDef = Math.round(
      baseMap.def + lvlSteps * ovrGrowthScale * roleWeights.def + (bStats.def || 0) + defStat + (role === "DF" || role === "GK" ? keshinBonus + evoBonus + manualBonus : Math.floor(keshinBonus / 2))
    );
    const finalVel = Math.round(
      baseMap.vel + lvlSteps * ovrGrowthScale * roleWeights.vel + (bStats.vel || 0) + wingStat + (player.bonusSpd || 0)
    );
    const finalFis = Math.round(
      baseMap.fis + lvlSteps * ovrGrowthScale * roleWeights.fis + (bStats.fis || 0) + defStat + Math.floor((keshinBonus + evoBonus) / 2)
    );

    const primaryKey = role === "FW" ? "for" : role === "MF" ? "tec" : "def";

    return {
      for: finalFor,
      tec: finalTec,
      def: finalDef,
      vel: finalVel,
      fis: finalFis,
      baseFor: baseMap.for,
      baseTec: baseMap.tec,
      baseDef: baseMap.def,
      baseVel: baseMap.vel,
      baseFis: baseMap.fis,
      baseAvg: effOvr,
      primaryKey
    };
  }

  function formatPlayerStatsStripHTML(player, slotRole = null, forcedLevel = null, maskStats = false) {
    if (maskStats) {
      return `
        <div class="roster-stats-strip">
          <span class="stat-mini-chip">FOR <strong>??</strong></span>
          <span class="stat-mini-chip">TEC <strong>??</strong></span>
          <span class="stat-mini-chip">DEF <strong>??</strong></span>
          <span class="stat-mini-chip">VEL <strong>??</strong></span>
          <span class="stat-mini-chip">FIS <strong>??</strong></span>
        </div>
      `;
    }
    const st = calcPlayerAttributes(player, slotRole, forcedLevel);
    const pKey = st.primaryKey;
    return `
      <div class="roster-stats-strip" title="Status do Atleta (Média Base = OVR ${st.baseAvg} • Crescem a cada Nível!)">
        <span class="stat-mini-chip ${pKey === "for" ? "is-primary" : ""}">FOR <strong>${st.for}</strong></span>
        <span class="stat-mini-chip ${pKey === "tec" ? "is-primary" : ""}">TEC <strong>${st.tec}</strong></span>
        <span class="stat-mini-chip ${pKey === "def" ? "is-primary" : ""}">DEF <strong>${st.def}</strong></span>
        <span class="stat-mini-chip ${pKey === "vel" ? "is-primary" : ""}">VEL <strong>${st.vel}</strong></span>
        <span class="stat-mini-chip ${pKey === "fis" ? "is-primary" : ""}">FIS <strong>${st.fis}</strong></span>
      </div>
    `;
  }

  // Quanto maior o OVR do jogador, MAIS PODER ele recebe a cada Nível!
  function calcPowerPerLevel(effOvr) {
    const clamped = Math.max(55, Math.min(99, effOvr || 75));
    return Math.max(6, Math.round(6 + Math.pow((clamped - 60) / 10, 2.25)));
  }

  function calcBasePlayerPowerAtLevel1(effOvr) {
    const clamped = Math.max(45, Math.min(99, effOvr || 75));
    return Math.round(Math.pow(clamped / 84, 2.85) * 95);
  }

  function calcIndividualPlayerPower(player, slotRole = null, forcedLevel = null, extraComboPower = 0) {
    if (!player) return 60;
    const role = slotRole || player.pos || "MF";
    const effOvr = getEffectiveOvr(player, role);
    const lvl = forcedLevel != null ? Math.max(1, forcedLevel) : getPlayerLevel(player);
    const basePwr = calcBasePlayerPowerAtLevel1(effOvr);
    const pwrPerLvl = calcPowerPerLevel(effOvr);
    const levelPwr = (lvl - 1) * pwrPerLvl;
    const itemPwr = player.bonusPower || 0;
    const keshinPwr = player.keshin ? 38 : 0;
    const evoPwr = (player.moveEvoCount || 0) * 22;
    const manualPwr = player.learnedSecretManual ? 28 : 0;
    const isSquadMember = Object.values(state.squad).some((sp) => sp && sp.id === player.id);
    const pb = isSquadMember ? state.tournament?.prepBonuses || {} : {};
    let roleScalablePwr = 0;
    if (role === "FW" || role === "MF") roleScalablePwr += (pb.wingExplosionLvl || 0) * 6;
    if (role === "MF") roleScalablePwr += (pb.midSynergyLvl || 0) * 5;
    if (role === "GK" || role === "DF") roleScalablePwr += (pb.defBlockLvl || 0) * 6;
    return Math.round(basePwr + levelPwr + itemPwr + keshinPwr + evoPwr + manualPwr + roleScalablePwr + (extraComboPower || 0));
  }

  const HEAVY_MOVE_RX =
    /(ômega|omega|terra|earth|god catch|maou|rei demônio|captura|dimensional|martelo da ira|grand fire|grande fogo|fogo máximo|maximum|explosion|tenkuu|chaos|big bang|god break|x blast|last resort|zero magnum|infinity|asura|saikyou|tamashii|alma suprema|god hand x|god hand v|god hand w|prime legend|death break|supernova|g2|g3|v2|v3|shin|★)/i;

  const LONG_SHOT_RX =
    /(impulso tsunami|o tufão|excalibur|meteoro cortante|supernova|lança de odin|gungnir|observador das estrelas|ballista shot|carronade hou|dragon cannon|sidewinder|controle remoto|chuva da morte|death rain|chute astro|eiffel drive|kiku ichimonji|shellbit burst|tsuutenkaku|rainbow bubble|diamond ray|slingshot|gunshot|mil flechas|gauss shot|cosmic blaster|perseus orb|onda cintilante|pinguins imperiais nº 3|pinguins espaciais|koutei penguin 7|lança glacial|tempestade tornado furacão|the earth|queda de meteoro|overcyclone|desastre total|explosão universo|próton de ganimedes|cabeçada megaton|megaton head|gigaton head|bola de terra)/i;

  const COUNTER_SHOT_RX =
    /(excalibur|megaton head|cabeçada megaton|gigaton head|flecha refletora|o tufão|impulso tsunami|lança de odin|gungnir|rocket head|head bazooka|kyoubou head|tsubame gaeshi|backdraft|overcyclone|furacão invertido|tatsumaki otoshi|dragon cannon|pinguins imperiais nº 3|the galaxy|the earth|lança glacial)/i;

  const COUNTER_DF_RX =
    /(falcão voador|shinkuuma|corte giratório|estrela cadente|giro espiral|muralha de ferro|terremoto mega)/i;

  const CHAIN_SHOT_RX =
    /(furacão de fogo|fire tornado|tempestade explosiva|parafuso explosivo|super relâmpago|relâmpago nº 1|inazuma break|impacto dragão|furacão dragão|impacto wyvern|vendaval wyvern|matador de dragões|explosão do dragão|vendaval eterno|lobo lendário|vendaval de fogo|impacto do norte|erupção atômica|grande fogo|fogo máximo|fogo do inferno|pinguins imperiais|pinguins perfeitos|pinguins aéreos|bicicleta espada|espada da morte|impulso tigre|tempestade do tigre|arco gladiador|tenkuu otoshi|lâmina de diamante|asas celestiais|god knows|impacto divino|god break|explosão do caos|chaos break|big bang|the birth|the earth|prime legend|chute duplo|golpe duplo|impulso duplo|triple boost|twin boost|twin lancer|dual strike|zona mortal|triângulo z|triangle zz|last death zone|lança da escuridão|death spear|ruptura mortal|death break|zero magnum|último recurso|last resort|setsuna boost|fortíssimo|blitz do amanhecer|black dawn|impacto x|x blast|mandíbula dupla|neo galaxy|grande fenrir|impulso unicórnio|panther blizzard|thunder beast|fênix negra|a fênix|chute pégaso|cross drive)/i;

  function getEligibleMovesFromList(list, stamina) {
    if (!Array.isArray(list) || list.length === 0 || stamina < 45) return [];
    const usable = [];
    list.forEach((m, idx) => {
      const isSup = HEAVY_MOVE_RX.test(m) || (list.length >= 3 && idx >= 2);
      if (stamina >= 70 || !isSup) {
        usable.push({ move: m, isHeavy: isSup });
      }
    });
    return usable;
  }

  function getNodeLongShotMove(node) {
    const shList = node?.player?.moves?.SH || [];
    const usable = getEligibleMovesFromList(shList, node?.stamina ?? 0).filter((e) => LONG_SHOT_RX.test(e.move));
    if (usable.length === 0) return null;
    const picked = usable[Math.floor(Math.random() * usable.length)];
    return {
      move: picked.move,
      isHeavy: picked.isHeavy,
      cost: picked.isHeavy ? 38 : 28,
      duelBonus: picked.isHeavy ? 1.6 : 0.4
    };
  }

  function getNodeCounterShotMove(node) {
    const stamina = node?.stamina ?? 0;
    if (stamina < 45) return null;
    const shUsable = getEligibleMovesFromList(node?.player?.moves?.SH || [], stamina).filter((e) =>
      COUNTER_SHOT_RX.test(e.move)
    );
    if (shUsable.length > 0) {
      const picked = shUsable[Math.floor(Math.random() * shUsable.length)];
      return {
        move: picked.move,
        isShCounter: true,
        isHeavy: picked.isHeavy,
        cost: picked.isHeavy ? 34 : 26,
        bonus: picked.isHeavy ? 2.8 : 1.9
      };
    }
    const dfUsable = getEligibleMovesFromList(node?.player?.moves?.DF || [], stamina).filter((e) =>
      COUNTER_DF_RX.test(e.move)
    );
    if (dfUsable.length > 0) {
      const picked = dfUsable[Math.floor(Math.random() * dfUsable.length)];
      return {
        move: picked.move,
        isShCounter: false,
        isHeavy: picked.isHeavy,
        cost: picked.isHeavy ? 30 : 24,
        bonus: picked.isHeavy ? 1.5 : 0.8
      };
    }
    return null;
  }

  function getNodeChainShotMove(node) {
    const stamina = node?.stamina ?? 0;
    if (stamina < 48) return null;
    const usable = getEligibleMovesFromList(node?.player?.moves?.SH || [], stamina);
    if (usable.length === 0) return null;
    const canonical = usable.filter((e) => CHAIN_SHOT_RX.test(e.move));
    const pool = canonical.length > 0 ? canonical : usable;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    const isCanonicalChain = CHAIN_SHOT_RX.test(picked.move);
    return {
      move: picked.move,
      isCanonicalChain,
      isHeavy: picked.isHeavy,
      // Chain shot cansa bastante o 2º jogador (+14 de desgaste sobre o custo base do chute)
      cost: (picked.isHeavy ? 38 : 26) + 14,
      bonus: (picked.isHeavy ? 1.4 : 0) + (isCanonicalChain ? 1.8 : 0.4)
    };
  }

  function pickPlayerMove(player, category) {
    if (!player || !player.moves || !Array.isArray(player.moves[category])) return null;
    const list = player.moves[category];
    if (list.length === 0) return null;
    const pool = list.slice(0, Math.min(4, list.length));
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Sistema de Energia em 3 faixas: Verde (>=70 todas), Amarela (45..69 sem fortes), Vermelha (<45 sem técnica!)
  function pickStaminaGatedMove(node, category) {
    const stamina = node ? node.stamina : 100;
    const list = node?.player?.moves?.[category] || [];
    // Técnicas pesadas (super técnicas de grau alto) gastam bem mais energia!
    const heavyCost = category === "GK" || category === "SH" ? 38 : 32;
    // Técnicas padrão/médias também têm gasto relevante
    const stdCost = category === "GK" || category === "SH" ? 26 : 22;

    if (stamina < 45) {
      return {
        move: null,
        isHeavy: false,
        exhausted: true,
        gatedReason: "RED",
        cost: 10,
        duelBonus: -2.2
      };
    }

    if (list.length === 0) {
      return {
        move: null,
        isHeavy: false,
        exhausted: false,
        gatedReason: null,
        cost: 12,
        duelBonus: -0.6
      };
    }

    const heavyMoves = [];
    const standardMoves = [];
    list.forEach((m, idx) => {
      const isSup = HEAVY_MOVE_RX.test(m) || (list.length >= 3 && idx >= 2);
      if (isSup) heavyMoves.push(m);
      else standardMoves.push(m);
    });

    const userIntensity = node?.side === "user" ? getTactics().intensity : "medium";
    const masteryLvl = node?.side === "user" ? (state.tournament?.prepBonuses?.hissatsuMasteryLvl || 0) : 0;
    const masteryBonus = [0, 0.8, 1.6, 2.5][masteryLvl] || 0;

    // Intensidade BAIXA: prioriza jogadas sem técnica ou técnicas leves para economizar energia
    if (userIntensity === "low") {
      if (category !== "GK" && Math.random() < 0.62) {
        return {
          move: null,
          isHeavy: false,
          exhausted: false,
          gatedReason: null,
          cost: 8,
          duelBonus: 0
        };
      }
      if (standardMoves.length > 0) {
        const move = standardMoves[Math.floor(Math.random() * standardMoves.length)];
        return {
          move,
          isHeavy: false,
          exhausted: false,
          gatedReason: null,
          cost: Math.round(stdCost * 0.72),
          duelBonus: 0
        };
      }
    }

    if (stamina >= 70) {
      const heavyProb = userIntensity === "high" ? 0.90 : 0.65;
      const useHeavy = heavyMoves.length > 0 && (standardMoves.length === 0 || Math.random() < heavyProb);
      const pool = useHeavy ? heavyMoves : standardMoves.length > 0 ? standardMoves : heavyMoves;
      const move = pool[Math.floor(Math.random() * pool.length)];
      const isHeavy = heavyMoves.includes(move);
      const extraBonus = userIntensity === "high" ? 1.5 : 0;
      return {
        move,
        isHeavy,
        exhausted: false,
        gatedReason: null,
        cost: isHeavy ? heavyCost : stdCost,
        duelBonus: (isHeavy ? 1.4 : 0) + extraBonus + masteryBonus
      };
    }

    // Faixa Amarela (45..69): técnicas mais fortes bloqueadas!
    if (standardMoves.length > 0) {
      const move = standardMoves[Math.floor(Math.random() * standardMoves.length)];
      return {
        move,
        isHeavy: false,
        exhausted: false,
        gatedReason: heavyMoves.length > 0 ? "YELLOW" : null,
        cost: stdCost,
        duelBonus: -0.35 + masteryBonus
      };
    }

    // Se todas as técnicas da categoria forem pesadas e ele está na amarela: fica sem técnica pesada
    return {
      move: null,
      isHeavy: false,
      exhausted: false,
      gatedReason: "YELLOW_ONLY_HEAVY",
      cost: 12,
      duelBonus: -1.4
    };
  }

  function buildShotInfoForNode(shooterNode, forceLongShot = false) {
    if (forceLongShot) {
      const longPick = getNodeLongShotMove(shooterNode);
      if (longPick) {
        return {
          isHissatsu: true,
          isLongShotMove: true,
          label: longPick.move,
          isHeavy: longPick.isHeavy,
          exhausted: false,
          gatedReason: null,
          cost: longPick.cost,
          duelBonus: longPick.duelBonus
        };
      }
    }
    const pick = pickStaminaGatedMove(shooterNode, "SH");
    const userInt = shooterNode?.side === "user" ? getTactics().intensity : "medium";
    const shotHissatsuProb = userInt === "low" ? 0.34 : userInt === "high" ? 0.95 : 0.8;
    if (pick.move && Math.random() < shotHissatsuProb) {
      return {
        isHissatsu: true,
        isLongShotMove: LONG_SHOT_RX.test(pick.move),
        label: pick.move,
        isHeavy: pick.isHeavy,
        exhausted: false,
        gatedReason: pick.gatedReason,
        cost: pick.cost,
        duelBonus: pick.duelBonus
      };
    }
    const normalDesc = pick.exhausted
      ? "Chute sem técnica (sem energia)"
      : pick.gatedReason === "YELLOW_ONLY_HEAVY"
      ? "Chute sem técnica (pouca energia)"
      : NORMAL_SHOT_DESCRIPTIONS[Math.floor(Math.random() * NORMAL_SHOT_DESCRIPTIONS.length)];
    return {
      isHissatsu: false,
      isLongShotMove: false,
      label: normalDesc,
      isHeavy: false,
      exhausted: pick.exhausted,
      gatedReason: pick.gatedReason,
      cost: Math.min(9, pick.cost),
      duelBonus: pick.exhausted ? -2.0 : pick.gatedReason === "YELLOW_ONLY_HEAVY" ? -1.1 : -0.4
    };
  }

  function formatPlayerMovesSummary(p) {
    if (!p || !p.moves) return p.hissatsu || "";
    const tagFor = (m, cat) => {
      const tags = [];
      if (cat === "SH" && LONG_SHOT_RX.test(m)) tags.push("L");
      if ((cat === "SH" && COUNTER_SHOT_RX.test(m)) || (cat === "DF" && COUNTER_DF_RX.test(m))) tags.push("CT");
      if (cat === "SH" && CHAIN_SHOT_RX.test(m)) tags.push("CH");
      return tags.length ? ` <em style="color:#fde047; font-style:normal; font-size:0.62em; font-weight:900;">[${tags.join("/")}]</em>` : "";
    };
    const parts = [];
    if (p.pos === "GK" && p.moves.GK?.length) parts.push(`${moveIconHTML("GK")} <span>${p.moves.GK[0]}</span>`);
    if (p.moves.SH?.length) parts.push(`${moveIconHTML("SH")} <span>${p.moves.SH[0]}${tagFor(p.moves.SH[0], "SH")}</span>`);
    if (p.moves.OF?.length && parts.length < 2) parts.push(`${moveIconHTML("OF")} <span>${p.moves.OF[0]}</span>`);
    if (p.moves.DF?.length && parts.length < 2) parts.push(`${moveIconHTML("DF")} <span>${p.moves.DF[0]}${tagFor(p.moves.DF[0], "DF")}</span>`);
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

  function calcPlayerPowerContribution(effOvr, level = 1, player = null, slotRole = null) {
    if (player) {
      return calcIndividualPlayerPower(player, slotRole, level);
    }
    return calcBasePlayerPowerAtLevel1(effOvr) + Math.max(0, level - 1) * calcPowerPerLevel(effOvr);
  }

  // Status de Velocidade (VEL) individual do atleta: vem diretamente dos Status Base do jogador (que crescem com o Nível!)
  function calcPlayerSpeedStat(player, effOvr = null) {
    if (!player) return 70;
    const attrs = calcPlayerAttributes(player);
    return Math.min(125, Math.max(50, attrs.vel || effOvr || player.ovr || 75));
  }

  // Cálculo unificado de OVR Fixo, Nível, Poder Escalar por OVR, Combos de Itens e Sinergias (Dream Team & Adversário)
  function evaluateTeamStats(slots, getPlayerForSlot, options = {}) {
    const { isOpponent = false, clubIdHint = null, oppStageIdx = 0, oppBuffPct = 0, oppLevel = 1 } = options;
    let sumOvr = 0;
    let sumLevel = 0;
    let sumBasePwr = 0;
    let count = 0;
    let atkSum = 0, atkCnt = 0;
    let midSum = 0, midCnt = 0;
    let defSum = 0, defCnt = 0;

    const teamsCount = {};
    const teamNames = {};
    const teamEmblems = {};
    const fullNamesInSquad = new Set();
    const elemCountsByLink = {};
    const elemTotalsInSquad = {};
    const activeElemPairs = [];
    const slotPlayerMap = {};
    const equippedItemIds = new Set();
    let totalEquippedItemsCount = 0;
    let correctPosCount = 0;

    slots.forEach((s) => {
      const p = getPlayerForSlot(s);
      if (!p) return;
      count++;
      slotPlayerMap[s.id] = p;
      if (playerMatchesRole(p, s.role)) correctPosCount++;
      const eff = getEffectiveOvr(p, s.role);
      const pLvl = isOpponent ? Math.max(1, oppLevel) : getPlayerLevel(p);
      const pPwr = isOpponent
        ? calcIndividualPlayerPower({ ...p, level: pLvl }, s.role, pLvl)
        : calcIndividualPlayerPower(p, s.role, pLvl);

      sumOvr += eff;
      sumLevel += pLvl;
      sumBasePwr += pPwr;

      if (p.element) {
        elemTotalsInSquad[p.element] = (elemTotalsInSquad[p.element] || 0) + 1;
      }
      if (!isOpponent && Array.isArray(p.equippedItems)) {
        p.equippedItems.forEach((it) => {
          totalEquippedItemsCount++;
          if (it.id) equippedItemIds.add(it.id);
        });
      }

      const tId = p.teamId || clubIdHint || "club";
      teamsCount[tId] = (teamsCount[tId] || 0) + 1;
      teamNames[tId] = p.teamName || clubIdHint || "Clube";
      if (p.teamEmblem) teamEmblems[tId] = p.teamEmblem;
      if (p.fullName) fullNamesInSquad.add(p.fullName);

      if (s.role === "FW") { atkSum += eff; atkCnt++; }
      else if (s.role === "MF") { midSum += eff; midCnt++; }
      else { defSum += eff; defCnt++; }
    });

    const avgRawOvr = count > 0 ? sumOvr / count : 80;
    const avgLevel = count > 0 ? Number((sumLevel / count).toFixed(1)) : 1;
    // OVR é 100% FIXO: reflete exatamente a média real dos OVRs escalados!
    const ovr = count > 0 ? Math.round(avgRawOvr) : 0;
    // Escala pelo talento do elenco (elencos de OVR alto aproveitam melhor os bônus táticos)
    const tierScale = Math.max(0.60, Math.min(1.25, Math.pow(avgRawOvr / 88, 1.55)));

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
      if (count > 0) {
        const posChem = Math.round(correctPosCount * 2.0);
        const posPwr = Math.round(correctPosCount * 7.2 * tierScale);
        chem += posChem;
        bondsPower += posPwr;
        activeBonds.push({
          type: correctPosCount === 11 ? "perfect-formation" : "team",
          label: `${formationIconHTML("inline-ui-icon")} Formação Tática ${correctPosCount}/11 (+${posChem}% Quím • +${posPwr} Poder)`
        });
      }

      if (activeElemPairs.length > 0) {
        const linkChem = Math.min(35, activeElemPairs.length * 5);
        const rawLinkPwr =
          activeElemPairs.length <= 4
            ? activeElemPairs.length * 16
            : 64 + (activeElemPairs.length - 4) * 8;
        const linkPwr = Math.min(Math.round(110 * tierScale), Math.round(rawLinkPwr * tierScale));
        chem += linkChem;
        bondsPower += linkPwr;
        const summaryParts = Object.keys(elemCountsByLink)
          .map((el) => `${elemIconHTML(el, "inline-elem-icon")}×${elemCountsByLink[el]}`)
          .join(" ");
        activeBonds.push({
          type: "element",
          label: `${activeElemPairs.length}x Links Elementais (${summaryParts}) (+${linkChem}% • +${linkPwr} Poder)`
        });
      }

      const maxClub = Math.max(0, ...Object.values(teamsCount));
      if (maxClub >= 2) {
        const clubChem = Math.min(28, Math.round(12 + maxClub * 1.5));
        const clubPwr = Math.round(Math.min(68, maxClub * 6.0) * tierScale);
        chem += clubChem;
        bondsPower += clubPwr;
        activeBonds.push({
          type: "team",
          label: `${ffLogoIconHTML("inline-ui-icon")} Entrosamento de Elenco (+${clubChem}% • +${clubPwr} Poder)`
        });
      }

      if (oppLevel > 1) {
        bondsPower += Math.round((oppLevel - 1) * 6);
      }

      chem = Math.min(100, Math.max(0, chem));
      const chemPower = Math.round(chem * 1.05 * tierScale);
      const basePower = Math.round(sumBasePwr);
      const power = count > 0 ? basePower + chemPower + bondsPower : 0;

      return {
        count,
        correctPosCount,
        ovr,
        avgLevel,
        oppLevel: Math.max(1, oppLevel),
        power,
        basePower,
        chemPower,
        bondsPower,
        buffPct: oppBuffPct,
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
        const pwr = Math.round(105 * tierScale);
        chem += 20;
        bondsPower += pwr;
        activeBonds.push({
          type: "perfect-formation",
          label: `${formationIconHTML("inline-ui-icon")} Formação Perfeita 11/11 (+20% Quím • +${pwr} Poder)`
        });
      } else {
        const posChem = Math.round(correctPosCount * 1.4);
        const posPwr = Math.round(correctPosCount * 5.5 * tierScale);
        const improvised = count - correctPosCount;
        chem += posChem;
        bondsPower += posPwr;
        activeBonds.push({
          type: improvised > 0 ? "warn-pos" : "team",
          label:
            improvised > 0
              ? `${formationIconHTML("inline-ui-icon")} Posições: ${correctPosCount}/${count} (${improvised} improvisado = -OVR)`
              : `${formationIconHTML("inline-ui-icon")} Posições: ${correctPosCount}/11 (+${posChem}% Quím • 11/11 = +20%)`
        });
      }
    }

    // 1. Química & Poder por Sinergia Elemental em PROXIMIDADE (Dream Team)
    const prepB = state.tournament?.prepBonuses || null;
    const elemResonanceActive = Boolean(prepB?.elemResonance);
    if (activeElemPairs.length > 0) {
      const linkChem = Math.min(35, activeElemPairs.length * 5);
      const perLinkBase = elemResonanceActive ? 35 : 21;
      const rawLinkPwr =
        activeElemPairs.length <= 6
          ? activeElemPairs.length * perLinkBase
          : 6 * perLinkBase + (activeElemPairs.length - 6) * (elemResonanceActive ? 18 : 10);
      const maxCap = elemResonanceActive ? 260 : 150;
      const linkPwr = Math.min(Math.round(maxCap * tierScale), Math.round(rawLinkPwr * tierScale));
      chem += linkChem;
      bondsPower += linkPwr;
      const summaryParts = Object.keys(elemCountsByLink)
        .map((el) => `${elemIconHTML(el, "inline-elem-icon")}×${elemCountsByLink[el]}`)
        .join(" ");
      activeBonds.push({
        type: "element",
        label: `${activeElemPairs.length}x Links Elementais (${summaryParts}) (+${linkChem}% • +${linkPwr} Poder${elemResonanceActive ? " · Ressonância!" : ""})`
      });
    }

    // 2. Química & Poder por Mesmo Clube/Escola
    Object.keys(teamsCount).forEach((tId) => {
      const c = teamsCount[tId];
      if (c >= 2) {
        const chemBonus = c <= 4 ? (c - 1) * 9 : Math.min(38, 27 + Math.round((c - 4) * 2));
        const rawPwr = c <= 4 ? (c - 1) * 26 : Math.min(110, 78 + (c - 4) * 4);
        const pwrBonus = Math.round(rawPwr * tierScale);
        chem += chemBonus;
        bondsPower += pwrBonus;
        const emblemTag = teamEmblems[tId]
          ? `<img class="inline-ui-icon" src="${teamEmblems[tId]}" alt="" />`
          : ffLogoIconHTML("inline-ui-icon");
        activeBonds.push({
          type: "team",
          label: `${emblemTag} ${c}x ${teamNames[tId]} (+${chemBonus}% • +${pwrBonus} Poder)`
        });
      }
    });

    // 3. Química & Poder por Laços de Amizade
    const matchedBonds = [];
    FRIENDSHIP_BONDS.forEach((bond) => {
      const matched = bond.members.filter((m) => fullNamesInSquad.has(m));
      if (matched.length >= bond.minCount) {
        matchedBonds.push({
          bond,
          extraCount: matched.length - 1,
          rawChem: (matched.length - 1) * bond.chemPerMatch,
          rawPwr: (matched.length - 1) * 44
        });
      }
    });
    matchedBonds.sort((a, b) => b.rawPwr - a.rawPwr);

    const decayWeights = [1.0, 0.55, 0.30, 0.15];
    let friendChemTotal = 0;
    let friendPwrTotal = 0;
    const maxFriendPwr = Math.round(145 * tierScale);

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

    // 4. COMBOS DE ITENS & SINERGIAS DE TREINO (Novos Combos!)
    const activeCombos = [];
    // Combo 1: Conjunto Lendário da Raimon (Luvas Lendárias + Chuteiras Lendárias)
    if (equippedItemIds.has("glove_legend") && equippedItemIds.has("shoes_legend")) {
      const cPwr = 65;
      chem += 8;
      bondsPower += cPwr;
      activeCombos.push(`🔥 Combo Lendário (Luvas + Chuteiras: +${cPwr} Poder • +8% Quím)`);
    }
    // Combo 2: Muralha Impenetrável (Luvas Lendárias + Travas de Bloqueio)
    if (equippedItemIds.has("glove_legend") && equippedItemIds.has("spike_block")) {
      const cPwr = 55;
      chem += 6;
      bondsPower += cPwr;
      activeCombos.push(`🛡️ Combo Muralha Impenetrável (Luvas + Travas: +${cPwr} Poder • +6% Quím)`);
    }
    // Combo 3: Tempestade Relâmpago (Chuteiras do Trovão + Braçadeira do Capitão ou Amuleto Elemental)
    if (equippedItemIds.has("shoes_thunder") && (equippedItemIds.has("captain_armband") || equippedItemIds.has("elem_crest_boost"))) {
      const cPwr = 50;
      chem += 6;
      bondsPower += cPwr;
      activeCombos.push(`⚡ Combo Tempestade Relâmpago (+${cPwr} Poder • +6% Quím)`);
    }
    // Combo 4: Esquadrão Equipado (3 ou mais jogadores equipados com itens)
    if (totalEquippedItemsCount >= 3) {
      const cPwr = totalEquippedItemsCount * 15;
      bondsPower += cPwr;
      activeCombos.push(`🎒 Arsenal Completo (${totalEquippedItemsCount} itens: +${cPwr} Poder)`);
    }
    // Combo 5: Domínio Elemental (3+ titulares do mesmo elemento quando Amuleto Elemental foi ativado)
    if (prepB?.boostedElement) {
      const elCnt = elemTotalsInSquad[prepB.boostedElement] || 0;
      if (elCnt >= 3) {
        const cPwr = elCnt * 18;
        chem += 6;
        bondsPower += cPwr;
        activeCombos.push(`🌟 Domínio de ${prepB.boostedElement} (${elCnt}x atletas: +${cPwr} Poder • +6% Quím)`);
      }
    }

    activeCombos.forEach((lbl) => {
      activeBonds.push({
        type: "friendship",
        label: lbl
      });
    });

    if (prepB && (prepB.chem > 0 || prepB.power > 0 || (prepB.log && prepB.log.length > 0))) {
      chem += prepB.chem || 0;
      bondsPower += prepB.power || 0;
      const evtCnt = prepB.log ? prepB.log.length : 0;
      const prepIcon = UI.steelTowerIcon
        ? `<img class="inline-ui-icon" src="${UI.steelTowerIcon}" alt="" />`
        : "";
      activeBonds.push({
        type: "friendship",
        label: `${prepIcon} Treinos &amp; Itens (${evtCnt}x) (+${prepB.chem || 0}% Quím • +${prepB.power || 0} Poder • Nv. Médio ${avgLevel})`
      });
    }

    chem = Math.min(100, Math.max(0, chem));

    // Poder Final Total = Soma do Poder Individual (OVR × Nível) + Química + Sinergias & Combos
    const chemPower = Math.round(chem * 1.15 * tierScale);
    const basePower = Math.round(sumBasePwr);
    const power = count > 0 ? basePower + chemPower + bondsPower : 0;

    return {
      count,
      correctPosCount,
      ovr,
      avgLevel,
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
        let idx = raw.findIndex((p) => !usedIds.has(p.id) && p.pos === role);
        if (idx < 0) {
          idx = raw.findIndex((p) => !usedIds.has(p.id) && playerMatchesRole(p, role));
        }
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
        if (chosen && playerMatchesRole(chosen, slot.role)) correct++;
      });
      if (!best || correct > best.correct) {
        best = { formSlots, assignments, correct };
      }
    });

    return { formSlots: best.formSlots, assignments: best.assignments };
  }

  // Tabela de Nível dos Times Adversários por Fase (calibrada com evolução real de Keshin/Técnicas da CPU + Energia!)
  const STAGE_OPPONENT_LEVELS = [3, 4, 5, 7, 8, 9, 10, 12, 13, 15, 16];

  function getStageOpponentBuff(stageIdx) {
    const idx = Math.max(0, stageIdx || 0);
    const st = state.tournament?.stages?.[idx];
    const oppLevel = typeof st?.oppLevel === "number"
      ? st.oppLevel
      : (STAGE_OPPONENT_LEVELS[Math.min(idx, STAGE_OPPONENT_LEVELS.length - 1)] || (1 + idx * 2));
    const pct = typeof st?.oppBuffPct === "number" ? st.oppBuffPct : idx * 5;
    return {
      pct,
      oppLevel,
      ovrBoost: 0, // OVR é fixo! A progressão agora é por Nível!
      powerMultiplier: 1,
      badgeText: `Nv. ${oppLevel}`
    };
  }

  function getStageOvrBoost(stageIdx) {
    return 0;
  }

  const CANONICAL_KESHINS = {
    GK: [
      { name: "Majin Great (Mão Demoníaca)", iconKey: "keshinMajin" },
      { name: "Kougaishin Poseidon", iconKey: "keshinIcon" },
      { name: "Goujin Tekki Atlas", iconKey: "keshinCoin" }
    ],
    DF: [
      { name: "Kensei Lancelot", iconKey: "keshinIcon" },
      { name: "Teppeki Gigadon", iconKey: "keshinCoin" },
      { name: "Juukishi Kingburn", iconKey: "keshinIcon" }
    ],
    MF: [
      { name: "Sousha Maestro", iconKey: "keshinIcon" },
      { name: "Majin Pegasus Arc", iconKey: "keshinPegasus" },
      { name: "Gouen no Gazard", iconKey: "keshinIcon" }
    ],
    FW: [
      { name: "Majin Pegasus Arc", iconKey: "keshinPegasus" },
      { name: "Kensei Lancelot", iconKey: "keshinIcon" },
      { name: "Majuu Grendel", iconKey: "keshinMajin" }
    ]
  };

  // Sistema de Aprendizado de Técnicas por Nível (usado tanto pelo usuário quanto pelos rivais)
  const LEVEL_MOVE_CATALOG = {
    3: {
      FW: { cat: "SH", Fogo: "Chute Ardente", Vento: "Vendaval Cortante", Floresta: "Disparo Espiral", Montanha: "Impacto Rochoso" },
      MF: { cat: "OF", Fogo: "Avanço Flamejante", Vento: "Drible Sônico", Floresta: "Passo Ilusório", Montanha: "Arrancada Sísmica" },
      DF: { cat: "DF", Fogo: "Corte Vulcânico", Vento: "Vórtice Defensivo", Floresta: "Teia de Espinhos", Montanha: "Muralha de Pedra" },
      GK: { cat: "GK", Fogo: "Punho Flamejante", Vento: "Barreira Eólica", Floresta: "Escudo da Floresta", Montanha: "Defesa Rochosa" }
    },
    6: {
      FW: { cat: "SH", Fogo: "Tormenta de Fogo", Vento: "Tufão Celeste", Floresta: "Lança Botânica", Montanha: "Meteoro de Rocha" },
      MF: { cat: "OF", Fogo: "Roda de Fogo", Vento: "Dança do Deus do Vento", Floresta: "Bola Ilusão", Montanha: "Terremoto Ofensivo" },
      DF: { cat: "DF", Fogo: "Bloqueio Explosivo", Vento: "Furacão Giratório", Floresta: "Corte da Floresta", Montanha: "A Montanha" },
      GK: { cat: "GK", Fogo: "Mão Explosiva", Vento: "Vórtice do Guardião", Floresta: "Mão Infinita", Montanha: "Mão Demoníaca" }
    },
    10: {
      FW: { cat: "SH", Fogo: "Grande Fogo G2", Vento: "O Tufão V2", Floresta: "Explosão do Caos", Montanha: "Bola de Terra G2" },
      MF: { cat: "OF", Fogo: "Campo Assassino G2", Vento: "Aikidou G2", Floresta: "Dobra Espacial G2", Montanha: "Quebra-Rochas G2" },
      DF: { cat: "DF", Fogo: "Muralha de Ferro V2", Vento: "Falcão Voador V2", Floresta: "Armadilha Dimensional V2", Montanha: "Terremoto Mega V2" },
      GK: { cat: "GK", Fogo: "Martelo da Ira Shin", Vento: "Mão Dimensional Shin", Floresta: "Rei Demônio (Maou)", Montanha: "Captura Ômega" }
    },
    15: {
      FW: { cat: "SH", Fogo: "Fogo Máximo ★", Vento: "Prime Legend ★", Floresta: "Big Bang ★", Montanha: "A Terra ★" },
      MF: { cat: "OF", Fogo: "Sobrecarga Solar ★", Vento: "Domínio Celestial ★", Floresta: "Ilusão Suprema ★", Montanha: "Força Tectônica ★" },
      DF: { cat: "DF", Fogo: "Escudo Vulcânico ★", Vento: "Tempestade Defensiva ★", Floresta: "Prisão da Floresta ★", Montanha: "A Montanha ★" },
      GK: { cat: "GK", Fogo: "Mão Ômega ★", Vento: "Mão Celestial W ★", Floresta: "Alma Suprema ★", Montanha: "Captura Ômega ★" }
    }
  };

  function getPrimaryMoveForRole(player, role) {
    if (!player?.moves) return player?.hissatsu || "Jogada Direta";
    const ord =
      role === "GK"
        ? ["GK", "DF", "SH", "OF"]
        : role === "DF"
        ? ["DF", "OF", "SH", "GK"]
        : role === "MF"
        ? ["OF", "SH", "DF", "GK"]
        : ["SH", "OF", "DF", "GK"];
    for (const cat of ord) {
      if (Array.isArray(player.moves[cat]) && player.moves[cat].length > 0) {
        return player.moves[cat][0];
      }
    }
    return player.hissatsu || "Jogada Direta";
  }

  function getEvolvedOpponentRoster(oppTeam, stageIdx) {
    const { formSlots, assignments } = getOpponentSlotAssignments(oppTeam);
    const buff = getStageOpponentBuff(stageIdx);
    const oppLevel = buff.oppLevel || 1;
    const sIdx = Math.max(0, stageIdx || 0);

    const cloned = {};
    const ranked = [];

    formSlots.forEach((slot) => {
      const raw = assignments[slot.id];
      const copy = {
        ...raw,
        level: oppLevel,
        moves: JSON.parse(JSON.stringify(raw.moves || { SH: [], OF: [], DF: [], GK: [] })),
        bonusStats: { ...(raw.bonusStats || { for: 0, tec: 0, def: 0, vel: 0, fis: 0 }) },
        bonusPower: raw.bonusPower || 0,
        moveEvoCount: raw.moveEvoCount || 0,
        learnedLvlMilestones: []
      };
      // Rivals também aprendem técnicas conforme sobem de nível!
      checkAndLearnLevelMoves(copy, slot.role);
      cloned[slot.id] = copy;

      const roleWeight = slot.role === "FW" ? 6 : slot.role === "GK" ? 5 : slot.role === "MF" ? 3 : 1;
      const starScore = (copy.isCaptain ? 1000 : 0) + (copy.ovr || 75) + roleWeight;
      ranked.push({ slot, player: copy, starScore });
    });

    ranked.sort((a, b) => b.starScore - a.starScore);

    // Quantos craques rivais têm Keshin (desde o começo!), técnicas evoluídas e bônus de item
    const keshinCount = sIdx <= 1 ? 1 : sIdx <= 4 ? 2 : sIdx <= 7 ? 3 : 4;
    const evoCount = sIdx === 0 ? 1 : sIdx <= 2 ? 2 : sIdx <= 4 ? 4 : sIdx <= 7 ? 6 : 8;
    const equipCount = sIdx === 0 ? 2 : sIdx <= 3 ? 4 : 6;

    const idSeed = String(oppTeam?.id || oppTeam?.name || "opp")
      .split("")
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

    ranked.forEach((entry, idx) => {
      const p = entry.player;
      const role = entry.slot.role;
      if (idx < keshinCount) {
        const pool = CANONICAL_KESHINS[role] || CANONICAL_KESHINS.MF;
        const chosenK = pool[(idSeed + idx + sIdx) % pool.length];
        p.keshin = { name: chosenK.name, icon: UI[chosenK.iconKey] || UI.keshinIcon };
      }
      if (idx < evoCount) {
        evolvePlayerPrimaryMove(p, role);
        if (sIdx >= 4 && idx < 2) {
          evolvePlayerPrimaryMove(p, role);
        }
      }
      if (idx < equipCount) {
        p.bonusPower = (p.bonusPower || 0) + 10 + sIdx * 4;
        const statBoost = 2 + Math.floor(sIdx / 2);
        if (role === "FW") { p.bonusStats.for += statBoost; p.bonusStats.vel += statBoost; }
        else if (role === "MF") { p.bonusStats.tec += statBoost; p.bonusStats.vel += statBoost; }
        else { p.bonusStats.def += statBoost; p.bonusStats.fis += statBoost; }
      }
    });

    const highlights = formSlots
      .map((slot) => {
        const p = cloned[slot.id];
        const effOvr = getEffectiveOvr(p, slot.role);
        const indivPower = calcIndividualPlayerPower(p, slot.role, oppLevel);
        return {
          slot,
          role: slot.role,
          player: p,
          effOvr,
          indivPower,
          primaryMove: getPrimaryMoveForRole(p, slot.role),
          keshin: p.keshin || null
        };
      })
      .sort((a, b) => b.indivPower - a.indivPower)
      .slice(0, 4);

    return { formSlots, assignments: cloned, oppLevel, buff, highlights };
  }

  function calcOpponentStats(oppTeam, stageIdx) {
    const { formSlots, assignments, buff, highlights } = getEvolvedOpponentRoster(oppTeam, stageIdx);
    const res = evaluateTeamStats(formSlots, (s) => assignments[s.id], {
      isOpponent: true,
      clubIdHint: oppTeam.name || oppTeam.id,
      oppStageIdx: stageIdx,
      oppBuffPct: buff.pct,
      oppLevel: buff.oppLevel
    });
    res.highlights = highlights;
    return res;
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
        t.players.some((p) => !pickedIds.has(p.id) && getPlayerPositionsList(p).some((r) => openRoles.has(r)))
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

  function buildPitchHTML(isComplete = false) {
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
          let icon = b.type === "perfect-formation" ? "🌱" : b.type === "friendship" ? "⭐" : b.type === "element" ? "⚡" : "🛡️";
          return `<span class="pitch-synergy-chip chip-${b.type}">${b.label}</span>`;
        }).join("")
      : `<span class="pitch-synergy-chip chip-empty">${formationIconHTML("inline-ui-icon")} Escale na posição certa (+20% Quím / +2 OVR) e conecte mesmo elemento colado!</span>`;

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

        const renderY = slot.role === "GK" ? 91.5 : slot.role === "DF" && slot.y >= 73 ? 72 : slot.y;

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
        const nodeTooltip = `OVR ${effOvr} • Nv.${pLvl} • Poder ${pPwr} | FOR ${attrs.for} · TEC ${attrs.tec} · DEF ${attrs.def} · VEL ${attrs.vel} · FIS ${attrs.fis}`;

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
      delete p.boostOvr;
      delete p.bonusPower;
      delete p.bonusSpd;
      delete p.bonusStats;
      delete p.equippedItems;
      delete p.keshin;
      delete p.moveEvoCount;
      delete p.learnedSecretManual;
      if (p._baseMovesSnapshot) {
        p.moves = JSON.parse(JSON.stringify(p._baseMovesSnapshot));
        delete p._baseMovesSnapshot;
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

  function startTournamentGo() {
    clearTournamentTimers(false);
    resetSquadPrepBonuses();

    const domestic = DB.teams.filter((t) => !WORLD_TEAM_IDS.has(t.id));
    const tiers = [
      domestic.filter((t) => t.baseOvr <= 81),
      domestic.filter((t) => t.baseOvr >= 82 && t.baseOvr <= 85),
      domestic.filter((t) => t.baseOvr >= 86 && t.baseOvr <= 89),
      domestic.filter((t) => t.baseOvr >= 89)
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

    state.phase = "tournament";
    state.tournament = {
      stageIndex: 0,
      stages,
      worldUnlocked: false,
      worldGroup: null,
      timerId: null,
      pitchRafId: null,
      clashTimer1: null,
      clashTimer2: null,
      pendingClashFinish: null,
      shotFlightTimer: null,
      pendingShotFlightFinish: null,
      netFlightTimer: null,
      pendingNetFlightFinish: null,
      actionBeatTimer: null,
      pendingBeatFinish: null,
      whistleKeyHandler: null,
      penTimerId: null,
      prepTimerId: null,
      prepMatchTimerId: null,
      prep: null,
      prepBonuses: {
        xp: 0,
        chem: 0,
        power: 0,
        staminaMul: 1,
        lateMatchNoStaminaLoss: false,
        permanentDoublePrep: false,
        tireTrainingDone: false,
        elemResonance: false,
        boostedElement: null,
        efficiencyLvl: 0,
        restLvl: 0,
        enduranceLvl: 0,
        wingExplosionLvl: 0,
        midSynergyLvl: 0,
        defBlockLvl: 0,
        hissatsuMasteryLvl: 0,
        xpSpiritLvl: 0,
        passBypassLvl: 0,
        counterShotLvl: 0,
        dribbleEdgeLvl: 0,
        log: []
      },
      teamEnergy: 100,
      tactics: {
        lane: "balanced",
        posture: "balanced",
        intensity: "medium"
      },
      showRunSummary: false
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
  }

  function advanceToWorldCup() {
    const t = state.tournament;
    if (!t) return;
    clearTournamentTimers(false);

    const worldPool = DB.teams.filter((tm) => WORLD_TEAM_IDS.has(tm.id));
    const usedWorld = new Set();

    // 3 Seleções para o Grupo A do Mundial (FFI)
    const grpOpp1 = pickPoolTeam(
      [worldPool.filter((tm) => tm.baseOvr <= 87), worldPool],
      usedWorld
    );
    const grpOpp2 = pickPoolTeam(
      [worldPool.filter((tm) => tm.baseOvr >= 86 && tm.baseOvr <= 89), worldPool],
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
        name: "Dream Team",
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
        pools: [worldPool.filter((tm) => tm.baseOvr <= 88), worldPool]
      },
      {
        stageName: "Quartas do Mundial",
        pools: [worldPool.filter((tm) => tm.baseOvr >= 87 && tm.baseOvr <= 90), worldPool]
      },
      {
        stageName: "Semifinal Mundial",
        pools: [worldPool.filter((tm) => tm.baseOvr >= 89 && tm.baseOvr <= 91), worldPool]
      },
      {
        stageName: "Final Mundial (FFI)",
        pools: [worldPool.filter((tm) => tm.baseOvr >= 90), worldPool]
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

    openBetweenMatchPrep(4);
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
    if (state.tournament.qteRafId) {
      cancelAnimationFrame(state.tournament.qteRafId);
      state.tournament.qteRafId = null;
    }
    if (state.tournament.whistleTimerId) {
      clearTimeout(state.tournament.whistleTimerId);
      state.tournament.whistleTimerId = null;
    }
    if (typeof state.tournament.qteKeyHandler === "function") {
      document.removeEventListener("keydown", state.tournament.qteKeyHandler);
      state.tournament.qteKeyHandler = null;
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
    pitch.ballFlight = null;
    pitch.passState = null;
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
    pitch.justKickedOff = true;

    if (koMid) {
      koMid.x = 50;
      koMid.y = 50;
      koMid.targetX = 50;
      koMid.targetY = 50;
    }
  }

  function describeSvgArc(cx, cy, r, startDeg, endDeg) {
    const toRad = (deg) => ((deg - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startDeg));
    const y1 = cy + r * Math.sin(toRad(startDeg));
    const x2 = cx + r * Math.cos(toRad(endDeg));
    const y2 = cy + r * Math.sin(toRad(endDeg));
    const largeArc = Math.abs(endDeg - startDeg) <= 180 ? "0" : "1";
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }

  function updateVoluntaryRecoverButtonDOM(st) {
    const btn = document.getElementById("btn-voluntary-recover");
    if (!btn || !st) return;
    const charges = st.recoverCharges ?? 0;
    const iconHTML = UI.sportsDrink
      ? `<img src="${UI.sportsDrink}" alt="" style="width:15px; height:15px; object-fit:contain;" />`
      : "";
    btn.innerHTML = `${iconHTML}<span>Recuperar (${charges})</span>`;
    btn.disabled = charges <= 0 || Boolean(st.finished || st.penalties);
  }

  function computeShortestAngleDiffDeg(a, b) {
    let diff = ((a - b + 540) % 360) - 180;
    return Math.abs(diff);
  }

  // Desafio circular de 1 única volta (usado no Apito de 45' e no botão voluntário Recuperar)
  function openCircleTimingChallenge(st, ovrDiff, opts = {}) {
    const isHalftime = opts.mode === "HALFTIME";
    clearTournamentTimers(false);
    const slotEl = document.getElementById("shot-clash-slot");
    if (!slotEl || !st || !st.pitch) {
      if (isHalftime && st?.pitch) {
        [...st.pitch.userNodes, ...st.pitch.oppNodes].forEach((n) => {
          n.stamina = Math.min(100, n.stamina + (n.role === "GK" ? 18 : 10));
        });
        const nextSide = st.pitch.initialSide === "user" ? "opp" : "user";
        resetPitchForKickoff(st.pitch, nextSide, true);
        syncLivePitchDOM(st);
      }
      startMatchInterval();
      return;
    }

    // Alvo fixo no topo (0°) no Intervalo; ângulo aleatório no desafio voluntário!
    const targetDeg = isHalftime ? 0 : Math.round(-120 + Math.random() * 240);
    const greenHalf = isHalftime ? 34 : 32;
    const yellowHalf = isHalftime ? 68 : 64;
    const speedDegPerSec = isHalftime ? 175 : 190;
    const startDeg = ((targetDeg + 180 + 540) % 360) - 180;

    const yellowArc = describeSvgArc(80, 80, 56, targetDeg - yellowHalf, targetDeg + yellowHalf);
    const greenArc = describeSvgArc(80, 80, 56, targetDeg - greenHalf, targetDeg + greenHalf);
    const drinkIcon = isHalftime
      ? UI.sportsDrink || UI.onigiriIcon || UI.tpPendant || ""
      : UI.onigiriIcon || UI.sportsDrink || "";
    const headerImg = isHalftime ? UI.refereeWhistle || UI.whistleIcon || "" : UI.sportsDrink || UI.onigiriIcon || "";
    const badgeImg = isHalftime ? UI.whistleIcon : UI.onigiriIcon;
    const badgeHTML = badgeImg
      ? `<img src="${badgeImg}" alt="" style="width:18px; height:18px; object-fit:contain;" />`
      : "";

    const headerTitle = isHalftime
      ? "45' • APITO DO JUIZ — FIM DO 1º TEMPO!"
      : `${st.minute}' • PAUSA TÁTICA — RECUPERAÇÃO`;
    const headerSub = isHalftime
      ? `Dream Team ${st.userScore} x ${st.oppScore} ${st.oppTeam.name}`
      : "Desafio rápido de fôlego (1 volta única!)";
    const bodyHint = isHalftime
      ? `Você tem <strong style="color:#fde047;">1 volta</strong> para acertar o <strong style="color:#4ade80;">VERDE</strong> e restaurar o time no intervalo!`
      : `Acerte o <strong style="color:#4ade80;">VERDE</strong> na <strong style="color:#fde047;">única volta</strong> para recuperar energia imediata!`;

    slotEl.style.display = "flex";
    slotEl.innerHTML = `
      <div class="halftime-qte-stage">
        <div class="halftime-ref-row">
          ${headerImg ? `<img class="${isHalftime ? "halftime-ref-img" : "qte-vol-img"}" src="${headerImg}" alt="" />` : ""}
          <div style="flex:1; min-width:0;">
            <div style="display:flex; align-items:center; gap:5px; font-size:0.72rem; font-weight:900; color:#facc15; text-transform:uppercase;">
              ${badgeHTML}<span>${headerTitle}</span>
            </div>
            <div style="font-size:0.84rem; font-weight:900; color:#fff; margin-top:2px;">
              ${headerSub}
            </div>
          </div>
          <span class="prep-xp-pill" id="qte-lap-pill" style="font-size:0.64rem; padding:3px 8px;">1 VOLTA</span>
        </div>

        <div class="halftime-qte-body">
          <div class="qte-circle-wrap" id="qte-circle-wrap" title="Clique ou aperte Espaço na zona verde (1 volta)!">
            <svg class="qte-circle-svg" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="56" fill="none" stroke="rgba(148, 163, 184, 0.25)" stroke-width="14" />
              <path d="${yellowArc}" fill="none" stroke="#eab308" stroke-width="14" stroke-linecap="round" />
              <path d="${greenArc}" fill="none" stroke="#22c55e" stroke-width="15" stroke-linecap="round" />
              <g id="qte-needle-group" transform="rotate(${startDeg.toFixed(1)} 80 80)">
                <line x1="80" y1="80" x2="80" y2="16" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" />
                <circle cx="80" cy="24" r="5.5" fill="#fde047" stroke="#0f172a" stroke-width="2" />
              </g>
            </svg>
            <div class="qte-center-icon">
              ${drinkIcon ? `<img src="${drinkIcon}" alt="Energia" />` : ""}
            </div>
          </div>

          <div class="qte-controls-col">
            <div style="font-size:0.74rem; font-weight:800; color:#cbd5e1; line-height:1.35;">
              ${bodyHint}
            </div>
            <div id="qte-result-area"></div>
            <button class="ie-cmd-btn ie-cmd-green" id="btn-qte-stop" style="width:100%; justify-content:center;">
              <span>PARAR NO VERDE!</span>
            </button>
            <button class="ie-cmd-btn" id="btn-qte-skip" style="width:100%; justify-content:center; font-size:0.7rem; padding:4px 8px;">
              <span>${isHalftime ? "Descanso Rápido (+12%)" : "Pular (+6%)"}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    let qteResolved = false;
    const startT = performance.now();
    const computeProgressAt = (now) => {
      const elapsedSec = Math.max(0, (now - startT) / 1000);
      const traveledDeg = elapsedSec * speedDegPerSec;
      const raw = (startDeg + traveledDeg) % 360;
      const angle = ((raw + 540) % 360) - 180;
      return { traveledDeg, angle };
    };
    let curAngleDeg = startDeg;

    const finalizeResume = () => {
      state.tournament.pendingClashFinish = null;
      if (state.tournament.qteRafId) {
        cancelAnimationFrame(state.tournament.qteRafId);
        state.tournament.qteRafId = null;
      }
      if (typeof state.tournament.qteKeyHandler === "function") {
        document.removeEventListener("keydown", state.tournament.qteKeyHandler);
        state.tournament.qteKeyHandler = null;
      }
      const mSlot = document.getElementById("shot-clash-slot");
      if (mSlot) {
        mSlot.innerHTML = "";
        mSlot.style.display = "none";
      }
      if (st.pitch && !st.finished) {
        if (isHalftime) {
          const nextSide = st.pitch.initialSide === "user" ? "opp" : "user";
          resetPitchForKickoff(st.pitch, nextSide, true);
          st.pitch.ticker = `46' Início do 2º Tempo — posse de ${nextSide === "user" ? "Dream Team" : st.oppTeam.name}!`;
        } else {
          st.pitch.ticker = `${st.minute}' Fôlego renovado! Bola em jogo!`;
        }
        syncLivePitchDOM(st);
        if (!handleMinuteEndBoundaries(st, ovrDiff)) startMatchInterval();
      }
    };

    const resolveQte = (reason = "CLICK") => {
      if (qteResolved) return;
      qteResolved = true;

      if (state.tournament.qteRafId) {
        cancelAnimationFrame(state.tournament.qteRafId);
        state.tournament.qteRafId = null;
      }
      if (typeof state.tournament.qteKeyHandler === "function") {
        document.removeEventListener("keydown", state.tournament.qteKeyHandler);
        state.tournament.qteKeyHandler = null;
      }

      const isSkip = reason === "SKIP";
      const isTimeout = reason === "TIMEOUT";
      if (!isSkip && !isTimeout) {
        curAngleDeg = computeProgressAt(performance.now()).angle;
        const needle = document.getElementById("qte-needle-group");
        if (needle) needle.setAttribute("transform", `rotate(${curAngleDeg.toFixed(1)} 80 80)`);
      }

      const diffDeg = computeShortestAngleDiffDeg(curAngleDeg, targetDeg);
      const hasTireBonus = (state.tournament?.prepBonuses?.staminaMul || 1) < 1;
      const extra = hasTireBonus ? 5 : 0;

      let userGain = (isHalftime ? 12 : 6) + extra;
      let zoneCls = "is-miss";
      let zoneLabel = isTimeout
        ? `Acabou a volta! Descanso mínimo (+${userGain}% Energia)`
        : `Fora do alvo (+${userGain}% Energia)`;

      if (!isSkip && !isTimeout && diffDeg <= greenHalf) {
        userGain = (isHalftime ? 40 : 35) + extra;
        zoneCls = "is-green";
        zoneLabel = `VERDE PERFEITO! +${userGain}% Energia!`;
      } else if (!isSkip && !isTimeout && diffDeg <= yellowHalf) {
        userGain = (isHalftime ? 25 : 20) + extra;
        zoneCls = "is-yellow";
        zoneLabel = `BOM TIMING (AMARELO)! +${userGain}% Energia!`;
      }

      if (st.pitch) {
        st.pitch.userNodes.forEach((n) => {
          const gkExtra = !isHalftime && n.role === "GK" && zoneCls === "is-green" ? 7 : 0;
          n.stamina = Math.min(100, n.stamina + userGain + gkExtra);
        });
        if (isHalftime) {
          st.pitch.oppNodes.forEach((n) => {
            n.stamina = Math.min(100, n.stamina + (n.role === "GK" ? 18 : 10));
          });
        }
        syncLivePitchDOM(st);
      }

      prependNarrationLine(
        st,
        zoneCls === "is-green" ? "nar-dribble" : "",
        isHalftime
          ? `45' [Intervalo] Árbitro apitou o fim do 1º tempo (${st.userScore} x ${st.oppScore}) • ${zoneLabel}`
          : `${st.minute}' [Recuperação] Pausa de fôlego do time • ${zoneLabel}`,
        null,
        null,
        isHalftime ? "BALL" : "GK"
      );

      if (isSkip) {
        finalizeResume();
        return;
      }

      const resArea = document.getElementById("qte-result-area");
      const stopBtn = document.getElementById("btn-qte-stop");
      const skipBtn = document.getElementById("btn-qte-skip");
      if (resArea) resArea.innerHTML = `<div class="qte-result-pill ${zoneCls}">${zoneLabel}</div>`;
      if (stopBtn) stopBtn.disabled = true;
      if (skipBtn) skipBtn.style.display = "none";

      state.tournament.clashTimer1 = setTimeout(finalizeResume, 900);
    };

    const tickNeedle = (now) => {
      if (qteResolved || state.phase !== "tournament") return;
      const { traveledDeg, angle } = computeProgressAt(now);
      if (traveledDeg >= 360) {
        curAngleDeg = startDeg;
        const needle = document.getElementById("qte-needle-group");
        if (needle) needle.setAttribute("transform", `rotate(${startDeg.toFixed(1)} 80 80)`);
        resolveQte("TIMEOUT");
        return;
      }
      curAngleDeg = angle;
      const needle = document.getElementById("qte-needle-group");
      if (needle) needle.setAttribute("transform", `rotate(${curAngleDeg.toFixed(1)} 80 80)`);
      state.tournament.qteRafId = requestAnimationFrame(tickNeedle);
    };
    state.tournament.qteRafId = requestAnimationFrame(tickNeedle);

    state.tournament.pendingClashFinish = () => resolveQte("SKIP");

    const stopBtn = document.getElementById("btn-qte-stop");
    const skipBtn = document.getElementById("btn-qte-skip");
    const circleWrap = document.getElementById("qte-circle-wrap");
    if (stopBtn) stopBtn.addEventListener("click", () => resolveQte("CLICK"));
    if (circleWrap) circleWrap.addEventListener("click", () => resolveQte("CLICK"));
    if (skipBtn) skipBtn.addEventListener("click", () => resolveQte("SKIP"));

    state.tournament.qteKeyHandler = (ev) => {
      if (ev.code === "Space" || ev.key === " ") {
        ev.preventDefault();
        resolveQte("CLICK");
      }
    };
    document.addEventListener("keydown", state.tournament.qteKeyHandler);
  }

  function showRefereeWhistleModal(st, type, onProceed) {
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

    const subtitleText = isHalftime
      ? "O árbitro apita o intervalo! Ambos os times recuperam +20% de fôlego."
      : isExtraTime
      ? "O empate persiste aos 90'! Vamos para a Prorrogação com Gol de Ouro!"
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

  function triggerVoluntaryRecoveryChallenge(st) {
    if (!st || st.finished || !st.running || st.penalties || (st.recoverCharges || 0) <= 0) return;
    if (
      state.tournament.pendingClashFinish ||
      state.tournament.pendingBeatFinish ||
      state.tournament.pendingShotFlightFinish ||
      state.tournament.pendingNetFlightFinish ||
      state.tournament.pendingWhistleFinish
    ) {
      return;
    }
    st.recoverCharges--;
    updateVoluntaryRecoverButtonDOM(st);
    const ovrDiff = st.pitch?.matchSupport?.ovrDiff || 0;
    openCircleTimingChallenge(st, ovrDiff, { mode: "VOLUNTARY" });
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
      prependNarrationLine(
        st,
        "nar-pass",
        `45' [Intervalo] Árbitro apita o fim do 1º tempo! (${st.userScore} x ${st.oppScore})`,
        null,
        null,
        "FF"
      );
      if (st.pitch) {
        st.pitch.minuteFloat = 45;
        st.pitch.ticker = `45' Fim do 1º tempo! Placar: ${st.userScore} x ${st.oppScore}`;
        [...st.pitch.userNodes, ...st.pitch.oppNodes].forEach((n) => {
          n.stamina = Math.min(100, n.stamina + (n.role === "GK" ? 18 : 10));
        });
        const secondHalfSide = st.pitch.initialSide === "user" ? "opp" : "user";
        resetPitchForKickoff(st.pitch, secondHalfSide, true);
        syncLivePitchDOM(st);
      }
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
      if (st.pitch) {
        st.pitch.minuteFloat = 90;
        resetPitchForKickoff(st.pitch, "user", true);
        st.pitch.ticker = `90' Prorrogação iniciada! Bola no centro!`;
        syncLivePitchDOM(st);
      }
      prependNarrationLine(
        st,
        "nar-save",
        `90' Empate no tempo normal! Vamos para a Prorrogação (até os 120')!`,
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
          "SH"
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

      showRefereeWhistleModal(st, "FULLTIME", () => {
        renderTournamentScreen();
      });
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
    const fatiguePenalty = node.stamina < 45 ? Math.min(4.2, 1.5 + (45 - node.stamina) * 0.09) : 0;
    const keshinBonus = node.player?.keshin ? 3.2 : 0;
    const evoBonus = node.player?.moveEvoCount ? Math.min(2.2, node.player.moveEvoCount * 1.1) : 0;

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
      statSpecBonus = (attrs.for - 82) * 0.14 + (attrs.tec - 82) * 0.05;
    } else if (roleOrAction === "OF" || roleOrAction === "MF") {
      statSpecBonus = (attrs.tec - 82) * 0.13 + (attrs.vel - 82) * 0.07;
    } else if (roleOrAction === "DF") {
      statSpecBonus = (attrs.def - 82) * 0.14 + (attrs.fis - 82) * 0.06;
    } else if (roleOrAction === "GK") {
      statSpecBonus = (attrs.def - 82) * 0.15 + (attrs.fis - 82) * 0.06;
    }

    const powerScore = 54 + (indivPwr - 75) * 0.21 + (node.effOvr - 80) * 0.42 + statSpecBonus;

    let tacticalAndEnergyAdj = 0;
    if (node.side === "user") {
      const band = getTeamEnergyBand();
      tacticalAndEnergyAdj += band.duelPenalty || 0;

      const tac = getTactics();
      // Postura Tática
      if (tac.posture === "defensive") {
        if (roleOrAction === "DF" || roleOrAction === "GK") tacticalAndEnergyAdj += 2.6;
        else if (roleOrAction === "SH") tacticalAndEnergyAdj -= 1.2;
      } else if (tac.posture === "offensive") {
        if (roleOrAction === "SH" || roleOrAction === "OF" || roleOrAction === "FW") tacticalAndEnergyAdj += 2.4;
        else if (roleOrAction === "DF") tacticalAndEnergyAdj -= 1.8;
      }

      // Canal de Ataque (escalado pelos atributos do jogador naquela faixa!)
      if (tac.lane === "wings" && (node.y < 34 || node.y > 66)) {
        tacticalAndEnergyAdj += 1.6 + Math.max(-0.5, (attrs.vel - 80) * 0.08);
      } else if (tac.lane === "center" && node.y >= 34 && node.y <= 66) {
        tacticalAndEnergyAdj += 1.6 + Math.max(-0.5, (attrs.tec - 80) * 0.08);
      }

      // Intensidade
      if (tac.intensity === "high") tacticalAndEnergyAdj += 1.3;
      else if (tac.intensity === "low") tacticalAndEnergyAdj -= 0.4;
    } else if (node.side === "opp") {
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

  function logisticWinProb(atkScore, defScore, baseShift = 0, minP = 0.04, maxP = 0.94) {
    // Curva logística mais íngreme (0.165) e faixa ampliada (-32..+32):
    // Quando um time/jogador tem muito mais Poder e Status, vence com consistência esmagadora!
    const diff = Math.max(-32, Math.min(32, atkScore - defScore)) + baseShift;
    const p = 1 / (1 + Math.exp(-diff * 0.165));
    return Math.max(minP, Math.min(maxP, p));
  }

  function spendStamina(node, cost) {
    if (!node) return;
    // Passiva: Pingente da Resistência Final — não perde energia nos minutos finais (a partir de 75' em partidas 11x11)
    const active5v5 = state.tournament?.prep?.clash5v5?.miniSt;
    const isIn5v5 = Boolean(active5v5 && active5v5.running && !active5v5.finished);
    const curMinute = isIn5v5
      ? 0
      : state.tournament?.stages?.[state.tournament.stageIndex]?.minute || 0;
    const hasFinalResistance = !isIn5v5 && node.side === "user" && state.tournament?.prepBonuses?.lateMatchNoStaminaLoss;
    if (hasFinalResistance && curMinute >= 75) {
      return;
    }
    const fisStat = node.attrs?.fis || 80;
    const fisMul = Math.max(0.76, Math.min(1.12, 1 - (fisStat - 82) * 0.004));
    const userInt = node.side === "user" ? getTactics().intensity : "medium";
    const tacIntMul = userInt === "high" ? 1.22 : userInt === "low" ? 0.78 : 1.0;
    const mul = (node.side === "user" ? state.tournament?.prepBonuses?.staminaMul || 1 : 1) * fisMul * tacIntMul;
    node.stamina = Math.max(18, node.stamina - cost * mul);
  }

  function buildOpponentLineup(oppTeam, stageIdx) {
    const { formSlots, assignments, oppLevel } = getEvolvedOpponentRoster(oppTeam, stageIdx);
    return formSlots.map((slot, idx) => {
      const player = assignments[slot.id];
      const rawPosMatch = playerMatchesRole(player, slot.role) ? 0 : -4;
      const effOvr = Math.min(99, Math.max(58, Math.round(player.ovr + rawPosMatch)));
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
      holdBallPos: null,
      lastAssistCandidate: null,
      lastPasserUid: null,
      lastAction: null,
      sameActionStreak: 0,
      teamConsecutivePasses: 0,
      justKickedOff: true,
      passTrail: null,
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

  function computeNodeRoleTarget(node, pitch, carrier, chaserUid, coverUid, deepestOppDefX, deepestOwnDefX) {
    const isUser = node.side === "user";
    const dir = isUser ? 1 : -1;
    const ownGoalX = isUser ? 4 : 96;
    const oppGoalX = isUser ? 96 : 4;
    const inPossession = pitch.ballSide === node.side;
    const ballX = pitch.ballFlight ? pitch.ballFlight.toX : pitch.passState ? pitch.passState.toX : pitch.ballX;
    const ballY = pitch.ballFlight ? pitch.ballFlight.toY : pitch.passState ? pitch.passState.toY : pitch.ballY;
    const t = pitch.simTime || 0;
    const tr = node.tacticalRole || node.role;

    // 1) Se está recebendo um passe em voo, corre para dominar a bola!
    if (pitch.passState && pitch.passState.receiverUid === node.uid) {
      const isSprintPass = Boolean(pitch.passState.isThroughBall || pitch.passState.isOneTwoPass);
      return { tx: pitch.passState.toX, ty: pitch.passState.toY, sprint: isSprintPass ? 1.38 : 1.08 };
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
      let steerX = oppGoalX - dir * 10 - node.x;
      let steerY = (50 + Math.sin(t * 1.1 + node.wanderPhase) * 16) - node.y;
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

    // 4) Defendendo: marcador principal fecha o portador e o 2º marcador faz dobra de marcação no terço final!
    if (!inPossession) {
      const targetAnchorX = carrier ? carrier.x + (carrier.vx || 0) * 0.22 : ballX;
      const targetAnchorY = carrier ? carrier.y + (carrier.vy || 0) * 0.22 : ballY;
      const dangerousZone = isUser ? ballX <= 42 : ballX >= 58;

      if (chaserUid === node.uid && node.staggerTimer <= 0) {
        return {
          tx: Math.max(8, Math.min(92, targetAnchorX)),
          ty: Math.max(10, Math.min(90, targetAnchorY)),
          sprint: 1.08
        };
      }
      if (coverUid === node.uid && node.staggerTimer <= 0) {
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
    const defNodes = attIsUser ? pitch.oppNodes : pitch.userNodes;

    const userBackLine = Math.min(...pitch.userNodes.filter((n) => n.role !== "GK").map((n) => n.x));
    const oppBackLine = Math.max(...pitch.oppNodes.filter((n) => n.role !== "GK").map((n) => n.x));

    const ballRefX = pitch.passState ? pitch.passState.toX : pitch.ballX;
    const ballRefY = pitch.passState ? pitch.passState.toY : pitch.ballY;
    const rankedDefs = defNodes
      .filter((d) => d.role !== "GK" && (d.staggerTimer || 0) <= 0)
      .map((d) => ({
        uid: d.uid,
        dist: Math.hypot(d.x - (carrier ? carrier.x : ballRefX), (d.y - (carrier ? carrier.y : ballRefY)) * 1.1)
      }))
      .sort((a, b) => a.dist - b.dist);

    const chaserUid = rankedDefs[0]?.uid || null;
    const coverUid = rankedDefs[1]?.uid || null;
    pitch.chaserUid = chaserUid;
    pitch.challengerUid = carrier && chaserUid && rankedDefs[0].dist < 10 ? chaserUid : null;

    const assignTeamTargets = (teamNodes, deepestOwnDef, deepestOppDef) => {
      teamNodes.forEach((node) => {
        const aim = computeNodeRoleTarget(
          node,
          pitch,
          carrier,
          chaserUid,
          coverUid,
          deepestOppDef,
          deepestOwnDef
        );
        node.targetX = aim.tx;
        node.targetY = aim.ty;
        node.targetSprint = aim.sprint || 0.9;
        if (node.side === "user" && node.role !== "GK" && !pitch.is5v5 && node.uid !== pitch.carrierUid) {
          const tac = getTactics();
          if (tac.posture === "defensive") {
            node.targetX = Math.max(10, node.targetX - 7);
          } else if (tac.posture === "offensive") {
            node.targetX = Math.min(90, node.targetX + 7);
          }
          if (tac.lane === "wings" && (node.role === "MF" || node.role === "FW")) {
            node.targetY = node.targetY <= 50 ? Math.max(10, node.targetY - 6) : Math.min(90, node.targetY + 6);
          } else if (tac.lane === "center" && (node.role === "MF" || node.role === "FW")) {
            node.targetY = node.targetY * 0.72 + 50 * 0.28;
          }
        } else if (node.side === "opp" && node.role !== "GK" && !pitch.is5v5 && node.uid !== pitch.carrierUid) {
          const oppPost = getOpponentDynamicPosture();
          if (oppPost === "offensive") node.targetX = Math.max(10, node.targetX - 5);
          else if (oppPost === "defensive") node.targetX = Math.min(90, node.targetX + 5);
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

  function startBallFlight(pitch, fromX, fromY, toX, toY, durationMs, arcHeight = 2.6, kind = "PASS", trailColor = "#4ade80") {
    if (!pitch) return;
    const now = performance.now();
    const dur = Math.max(55, durationMs);
    const isShot = kind === "SHOT" || kind === "GOAL";
    // Disparo direto reto sem arco para chutes a gol
    const actualArc = isShot ? 0 : arcHeight;
    pitch.ballFlight = {
      fromX,
      fromY,
      toX,
      toY,
      start: now,
      duration: dur,
      arcHeight: actualArc,
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

    const activeDashUid = pitch.dashFx ? pitch.dashFx.uid : null;
    const stepDomNode = (node) => {
      const el = document.getElementById(`pnode-${node.uid}`);
      if (el) {
        el.style.left = `${node.x.toFixed(2)}%`;
        el.style.top = `${node.y.toFixed(2)}%`;
        el.classList.toggle("is-dashing", node.uid === activeDashUid);
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
      const eased = isShot ? Math.pow(t, 1.18) : (1 - Math.pow(1 - t, 2.1));
      pitch.ballX = f.fromX + (f.toX - f.fromX) * eased;
      const verticalArc = isShot ? 0 : Math.sin(t * Math.PI) * (f.arcHeight || 0);
      pitch.ballY = f.fromY + (f.toY - f.fromY) * eased - verticalArc;

      if (isShot) {
        // Disparo direto reto: distorção de movimento (squash & stretch alinhado à trajetória)
        const dx = f.toX - f.fromX;
        const dy = (f.toY - f.fromY) * 0.55;
        const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
        const flightIntensity = Math.sin(t * Math.PI);
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
        pitch.passTrail.fadeUntil = now + 380;
      }
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
        lineGlow.setAttribute("x1", fromX.toFixed(1));
        lineGlow.setAttribute("y1", fromY.toFixed(1));
        lineGlow.setAttribute("x2", endX.toFixed(1));
        lineGlow.setAttribute("y2", endY.toFixed(1));
        lineGlow.setAttribute("stroke", tr.color);
        lineGlow.style.opacity = (0.38 * remain).toFixed(2);

        lineMain.setAttribute("x1", fromX.toFixed(1));
        lineMain.setAttribute("y1", fromY.toFixed(1));
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
        forwardGain >= 5 ? 2.5 : forwardGain >= 0 ? 1.55 : forwardGain >= -6 ? 0.52 : 0.14;
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
      const wingSwitchW = Math.abs(n.targetY - carrier.y) >= 18 && forwardGain >= 0 && minDefDist >= 8 ? 1.45 : 1.0;
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

  const PENALTY_ZONES = [
    { id: 0, label: "Sup. Esq.", x: 20, y: 27, col: 0 },
    { id: 1, label: "Centro Alto", x: 50, y: 27, col: 1 },
    { id: 2, label: "Sup. Dir.", x: 80, y: 27, col: 2 },
    { id: 3, label: "Inf. Esq.", x: 20, y: 74, col: 0 },
    { id: 4, label: "Centro Baixo", x: 50, y: 74, col: 1 },
    { id: 5, label: "Inf. Dir.", x: 80, y: 74, col: 2 }
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
      lastDiveZone: null,
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
    const baseXp = st.won ? 35 : st.isDraw ? 22 : 12;
    const pStats = st.pitch?.stats?.playerStats || {};
    const leveledNames = [];

    getSlots().forEach((slot) => {
      const p = state.squad[slot.id];
      if (!p) return;
      const uid = `u_${slot.id}`;
      const ps = pStats[uid] || {};
      const perfXp =
        (ps.goals || 0) * 16 +
        (ps.assists || 0) * 10 +
        Math.min(2, ps.saves || 0) * 8 +
        Math.min(2, ps.steals || 0) * 6;
      const xpSpiritLvl = state.tournament?.prepBonuses?.xpSpiritLvl || 0;
      const xpMult = 1 + xpSpiritLvl * 0.15;
      const res = gainPlayerXp(p, Math.round((baseXp + perfXp) * xpMult), slot.role);
      if (res.levelsGained > 0) {
        const moveNote = res.learnedMoves?.length ? ` [Aprendeu: ${res.learnedMoves.map((m) => m.move).join(", ")}]` : "";
        leveledNames.push(`${p.name} (Nv.${getPlayerLevel(p)})${moveNote}`);
      }
    });

    if (leveledNames.length > 0) {
      prependNarrationLine(
        st,
        "nar-goal-user",
        `📈 [Evolução Pós-Jogo] Subiram de nível com a experiência da partida: ${leveledNames.join(", ")}!`,
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
    st.penaltiesText = `Decisão por Pênaltis: Dream Team ${pen.userGoals} x ${pen.oppGoals} ${st.oppTeam.name}`;
    prependNarrationLine(
      st,
      st.won ? "nar-goal-user" : "nar-goal-opp",
      `${st.won ? "VITÓRIA NOS PÊNALTIS!" : "DERROTA NOS PÊNALTIS!"} ${st.penaltiesText}!`,
      null,
      null,
      "SH"
    );
    awardPostMatchExperience(st);
    renderTournamentScreen();
  }

  function resolvePenaltyTurn(st, chosenZone, isAuto = false) {
    const pen = st.penalties;
    if (!pen || st.finished || (pen.phase !== "USER_KICK" && pen.phase !== "USER_SAVE")) return;

    const pitch = st.pitch;
    const support = pitch?.matchSupport || { userTeamSupport: 0, oppTeamSupport: 0 };
    const isUserKicking = pen.phase === "USER_KICK";
    const kicker = getCurrentPenaltyKicker(pen, isUserKicking ? "user" : "opp");
    const keeper = isUserKicking ? pen.oppGk : pen.userGk;

    const aiPickZone = () => {
      const pool = PENALTY_ZONES.map((z) => z.id).filter((id) => id !== pen.lastDiveZone || Math.random() < 0.35);
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const shootZone = isUserKicking ? chosenZone : aiPickZone();
    const diveZone = isUserKicking ? aiPickZone() : chosenZone;
    pen.lastDiveZone = diveZone;

    const shootInfo = PENALTY_ZONES[shootZone] || PENALTY_ZONES[0];
    const diveInfo = PENALTY_ZONES[diveZone] || PENALTY_ZONES[0];

    const kickerSupp = isUserKicking ? support.userTeamSupport : support.oppTeamSupport;
    const keeperSupp = isUserKicking ? support.oppTeamSupport : support.userTeamSupport;
    const shotScore = calcNodeDuelScore(kicker, kickerSupp * 0.5, keeper?.player?.element);
    const gkScore = calcNodeDuelScore(keeper, keeperSupp * 0.5, kicker?.player?.element);

    let isGoal = false;
    if (shootZone === diveZone) {
      // Mesmo canto escolhido pelo goleiro: disputa direta entre técnica de chute e defesa!
      const saveProb = logisticWinProb(gkScore, shotScore, 3.4, 0.54, 0.86);
      isGoal = Math.random() >= saveProb;
    } else if (shootInfo.col === diveInfo.col) {
      // Mesmo lado, altura diferente: chance pequena de defesa com a ponta dos dedos
      isGoal = Math.random() >= 0.16;
    } else {
      // Canto oposto: chance alta de gol (pequeno risco de trave/defesa impossível)
      isGoal = Math.random() < 0.94;
    }

    const shotLabel = buildGoalShotLabel(kicker.player).label;
    const gkMove = pickPlayerMove(keeper.player, "GK") || "Ponte de Reflexo";

    if (isUserKicking) {
      pen.userTaken++;
      if (isGoal) pen.userGoals++;
      pen.userKicks.push({
        kickerName: kicker.player.name,
        sprite: kicker.player.sprite,
        zone: shootZone,
        outcome: isGoal ? "GOAL" : "SAVED"
      });
      prependNarrationLine(
        st,
        isGoal ? "nar-goal-user" : "nar-save",
        isGoal
          ? `[Pênalti ${pen.userTaken}] ${kicker.player.name} mandou 【${shotLabel}】 no ${shootInfo.label} e marcou! (${pen.userGoals} x ${pen.oppGoals})`
          : `[Pênalti ${pen.userTaken}] ${keeper.player.name} acertou o ${diveInfo.label} com 【${gkMove}】 e pegou o chute de ${kicker.player.name}!`,
        { name: kicker.player.name, sprite: kicker.player.sprite, side: "user" },
        { name: keeper.player.name, sprite: keeper.player.sprite, side: "opp" },
        isGoal ? "SH" : "GK"
      );
    } else {
      pen.oppTaken++;
      if (isGoal) pen.oppGoals++;
      else recordUserPlayerStat(pitch, keeper, "saves", 1);
      pen.oppKicks.push({
        kickerName: kicker.player.name,
        sprite: kicker.player.sprite,
        zone: shootZone,
        outcome: isGoal ? "GOAL" : "SAVED"
      });
      prependNarrationLine(
        st,
        isGoal ? "nar-goal-opp" : "nar-save",
        isGoal
          ? `[Pênalti ${pen.oppTaken}] ${kicker.player.name} bateu com 【${shotLabel}】 no ${shootInfo.label} e superou ${keeper.player.name}. (${pen.userGoals} x ${pen.oppGoals})`
          : `[DEFESA DE ${keeper.player.name.toUpperCase()}!] ${keeper.player.name} voou no ${diveInfo.label} com 【${gkMove}】 e defendeu o pênalti de ${kicker.player.name}!`,
        { name: keeper.player.name, sprite: keeper.player.sprite, side: "user" },
        { name: kicker.player.name, sprite: kicker.player.sprite, side: "opp" },
        "GK"
      );
    }

    if (isAuto) {
      if (isPenaltyShootoutDecided(pen)) {
        finishPenaltyShootout(st);
        return;
      }
      pen.activeSide = isUserKicking ? "opp" : "user";
      pen.phase = pen.activeSide === "user" ? "USER_KICK" : "USER_SAVE";
      return;
    }

    pen.phase = "RESULT_BEAT";
    pen.lastAnim = {
      isUserKicking,
      shootZone,
      diveZone,
      shootInfo,
      diveInfo,
      isGoal,
      kicker,
      keeper,
      shotLabel,
      gkMove
    };

    renderTournamentScreen();

    // Dispara transição suave da bola e do ícone do goleiro no frame seguinte!
    setTimeout(() => {
      const gkEl = document.getElementById("pen-gk-actor");
      const ballEl = document.getElementById("pen-ball-actor");
      if (gkEl) {
        gkEl.style.left = `${diveInfo.x}%`;
        gkEl.style.top = `${diveInfo.y}%`;
        gkEl.classList.add(diveInfo.col === 0 ? "dive-left" : diveInfo.col === 2 ? "dive-right" : "dive-center");
      }
      if (ballEl) {
        ballEl.style.left = `${shootInfo.x}%`;
        ballEl.style.top = `${shootInfo.y}%`;
        ballEl.classList.add(isGoal ? "ball-goal" : "ball-saved");
      }
    }, 35);

    if (state.tournament.penTimerId) clearTimeout(state.tournament.penTimerId);
    state.tournament.penTimerId = setTimeout(() => {
      state.tournament.penTimerId = null;
      if (isPenaltyShootoutDecided(pen)) {
        finishPenaltyShootout(st);
        return;
      }
      pen.lastAnim = null;
      pen.activeSide = isUserKicking ? "opp" : "user";
      pen.phase = pen.activeSide === "user" ? "USER_KICK" : "USER_SAVE";
      renderTournamentScreen();
    }, 1500);
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
      pen.phase = pen.activeSide === "user" ? "USER_KICK" : "USER_SAVE";
    } else if (pen.phase === "RESULT_BEAT") {
      if (isPenaltyShootoutDecided(pen)) {
        finishPenaltyShootout(st);
        return;
      }
      const wasUserKicking = pen.lastAnim ? pen.lastAnim.isUserKicking : pen.activeSide === "user";
      pen.lastAnim = null;
      pen.activeSide = wasUserKicking ? "opp" : "user";
      pen.phase = pen.activeSide === "user" ? "USER_KICK" : "USER_SAVE";
    }
    let guard = 0;
    while (!st.finished && guard < 40) {
      guard++;
      const z = Math.floor(Math.random() * 6);
      resolvePenaltyTurn(st, z, true);
    }
    if (!st.finished) finishPenaltyShootout(st);
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

    if (pen.phase === "ORDER") {
      const rowsHTML = pen.userOrder
        .map((n, idx) => {
          const bestShot = pickPlayerMove(n.player, "SH") || n.player.hissatsu || "Chute Direto";
          const isTop5 = idx < 5;
          const isSwapSelected = pen.swapIdx === idx;
          return `
            <div class="pen-order-row ${isTop5 ? "is-main5" : "is-alt"} ${isSwapSelected ? "is-swap" : ""}" data-pen-swap="${idx}">
              <span class="pen-order-num">${idx + 1}º</span>
              <img class="pen-order-avatar" src="${n.player.sprite || ""}" alt="${n.player.name}" />
              <div class="pen-order-meta">
                <strong>${n.player.name} <small>(${n.label} · OVR ${n.effOvr})</small></strong>
                <span>${bestShot}</span>
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
              <span class="pen-eyebrow">${moveIconHTML("SH")} DECISÃO POR PÊNALTIS</span>
              <h4>Defina a Ordem dos Batedores</h4>
              <p>Use as setas ▲▼ ou clique em dois jogadores para trocar a posição da lista.</p>
            </div>
            <button type="button" class="ie-cmd-btn" id="btn-pen-first-toggle" style="font-size:0.7rem; padding:6px 10px;">
              <span>Inicia: ${pen.firstSide === "user" ? "Dream Team" : st.oppTeam.name}</span>
            </button>
          </div>

          <div class="pen-order-list">${rowsHTML}</div>

          <div class="pen-footer-actions">
            <button type="button" class="ie-cmd-btn ie-cmd-green" id="btn-pen-start-shootout" style="flex:1;">
              <span>Confirmar Ordem e Ir para as Cobranças</span>
            </button>
            <button type="button" class="ie-cmd-btn" id="btn-pen-auto-finish" style="font-size:0.72rem;">
              <span>Simular Auto</span>
            </button>
          </div>
        </div>
      `;
    }

    const isBeat = pen.phase === "RESULT_BEAT" && pen.lastAnim;
    const isUserKicking = isBeat ? pen.lastAnim.isUserKicking : pen.phase === "USER_KICK";
    const kicker = isBeat ? pen.lastAnim.kicker : getCurrentPenaltyKicker(pen, isUserKicking ? "user" : "opp");
    const keeper = isBeat ? pen.lastAnim.keeper : (isUserKicking ? pen.oppGk : pen.userGk);
    const kickNum = isUserKicking ? (isBeat ? pen.userTaken : pen.userTaken + 1) : (isBeat ? pen.oppTaken : pen.oppTaken + 1);
    const modeTitle = isUserKicking ? "SUA VEZ DE CHUTAR" : "SUA VEZ DE DEFENDER";
    const modeSub = isBeat
      ? pen.lastAnim.isGoal
        ? `GOOOL! ${pen.lastAnim.kicker.player.name} venceu ${pen.lastAnim.keeper.player.name} (${pen.lastAnim.shotLabel})!`
        : `DEFENDEU ${pen.lastAnim.keeper.player.name.toUpperCase()}! ${pen.lastAnim.gkMove} parou ${pen.lastAnim.kicker.player.name}!`
      : isUserKicking
      ? `Escolha 1 dos 6 cantos do gol para ${kicker.player.name} bater o ${kickNum}º pênalti.`
      : `Escolha onde o goleiro ${keeper.player.name} vai pular para defender!`;

    const zonesHTML = PENALTY_ZONES.map((z) => {
      const shootHere = isBeat && pen.lastAnim.shootZone === z.id;
      const diveHere = isBeat && pen.lastAnim.diveZone === z.id;
      const zCls = [
        "pen-zone-btn",
        isUserKicking ? "mode-shoot" : "mode-save",
        shootHere ? (pen.lastAnim.isGoal ? "was-goal" : "was-shot") : "",
        diveHere ? "was-dive" : ""
      ]
        .filter(Boolean)
        .join(" ");
      return `
        <button type="button" class="${zCls}" data-pen-zone="${z.id}" ${isBeat ? "disabled" : ""}>
          <span>${z.label}</span>
        </button>
      `;
    }).join("");

    return `
      <div id="live-pitch-box" class="live-pitch-card pen-shootout-card ${isUserKicking ? "poss-user" : "poss-opp"}">
        <div class="pen-scoreboard">
          <div class="pen-sb-side">
            <strong>Dream Team (${pen.userGoals})</strong>
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

          <div class="pen-turn-callout ${isBeat ? (pen.lastAnim.isGoal ? "is-goal" : "is-save") : ""}">
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
          <div class="pen-goal-frame">
            <div class="pen-goal-grid">${zonesHTML}</div>

            <div id="pen-gk-actor" class="pen-gk-actor ${isUserKicking ? "side-opp" : "side-user"}" style="left:50%; top:65%;">
              <img src="${keeper.player.sprite || ""}" alt="${keeper.player.name}" />
              <span>${keeper.player.name.split(" ").slice(-1)[0]}</span>
            </div>

            <div id="pen-ball-actor" class="pen-ball-actor" style="left:50%; top:104%;">
              ${buildMiniBallSVG("pen-ball-svg")}
            </div>

            ${
              isBeat
                ? `<div class="pen-result-pop ${pen.lastAnim.isGoal ? "is-goal" : "is-save"}">
                    ${moveIconHTML(pen.lastAnim.isGoal ? "SH" : "GK")}
                    <span>${pen.lastAnim.isGoal ? "GOOOL!" : "DEFENDEU!"}</span>
                  </div>`
                : ""
            }
          </div>
          <div class="pen-turf-strip">
            <span class="pen-spot-dot"></span>
          </div>
        </div>

        <div class="pen-footer-actions">
          <span class="pen-hint-txt">
            ${isUserKicking ? "Clique no setor para finalizar" : `Clique onde ${keeper.player.name} deve defender`}
          </span>
          <button type="button" class="ie-cmd-btn" id="btn-pen-auto-finish" style="font-size:0.68rem; padding:5px 10px;">
            <span>Simular Restante</span>
          </button>
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
        pen.phase = pen.activeSide === "user" ? "USER_KICK" : "USER_SAVE";
        renderTournamentScreen();
      });
    }

    document.querySelectorAll("[data-pen-zone]").forEach((zoneBtn) => {
      zoneBtn.addEventListener("click", () => {
        const zoneId = Number(zoneBtn.getAttribute("data-pen-zone"));
        resolvePenaltyTurn(st, zoneId, false);
      });
    });

    const autoBtn = document.getElementById("btn-pen-auto-finish");
    if (autoBtn) {
      autoBtn.addEventListener("click", () => {
        autoResolveRemainingPenalties(st);
      });
    }
  }

  function buildLivePitchBoxHTML(st, oppTeam, stats = calcSquadStats(), oppStats = calcOpponentStats(oppTeam, state.tournament.stageIndex)) {
    if (!st.finished && st.penalties) {
      return buildPenaltyShootoutHTML(st);
    }
    if (st.finished) {
      return buildMatchRecapBoxHTML(st, oppTeam, stats, oppStats);
    }
    const pitch = st.pitch;
    if (!pitch) return "";
    const allNodes = [...pitch.userNodes, ...pitch.oppNodes];

    const tokensHTML = allNodes
      .map((node) => {
        const sideCls = node.side === "user" ? "side-user" : "side-opp";
        const ballCls = node.uid === pitch.carrierUid ? "has-ball" : "";
        const chalCls = node.uid === pitch.challengerUid ? "is-challenger" : "";
        const tiredCls = node.stamina < 45 ? "is-tired" : "";
        const shortName = (node.player?.name || node.label).split(" ").slice(-1)[0];
        const stamColor =
          node.stamina >= 70 ? "#4ade80" : node.stamina >= 45 ? "#facc15" : "#ef4444";

        const initSprite = resolveDynamicNodeSprite(node, pitch);
        return `
          <div id="pnode-${node.uid}" class="pitch-player-token ${sideCls} ${ballCls} ${chalCls} ${tiredCls}" style="left:${node.x}%; top:${node.y}%;">
            <div id="pbadge-${node.uid}" class="pitch-token-action-badge"></div>
            <img class="pitch-token-avatar" src="${initSprite}" alt="${shortName}" />
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
    const possTeamLabel = isUserPoss ? "DREAM TEAM" : oppTeam.name.toUpperCase();

    const oppTag = (oppTeam.name || "RIV").replace(/[^A-Za-zÀ-ÿ0-9]/g, "").slice(0, 3).toUpperCase() || "RIV";

    return `
      <div id="live-pitch-box" class="live-pitch-card ${possCls}">
        <div class="pitch-header-strip">
          <span class="pitch-side-dir" style="color:#4ade80;">
            ${UI.raimonEmblem ? `<img src="${UI.raimonEmblem}" alt="" />` : "⚡"} Gol →
          </span>
          <div class="pitch-action-ticker" id="pitch-action-ticker">${pitch.ticker}</div>
          <span class="pitch-side-dir" style="color:#f87171;">
            ← Gol <img src="${oppTeam.emblem}" alt="" />
          </span>
        </div>

        <div class="live-tactical-pitch ${st.isGoldenGoal5v5 ? "is-5v5-pitch" : ""}" id="live-tactical-pitch-viewport">
          ${
            !st.isGoldenGoal5v5
              ? `
            <div class="pitch-tv-scoreboard-bug">
              <span class="tv-team is-user">
                ${UI.raimonEmblem ? `<img src="${UI.raimonEmblem}" alt="" />` : ""}
                <span>DRM</span>
              </span>
              <span class="tv-score-box">
                <span id="live-score-user">${st.userScore}</span>
                <span class="tv-sep">-</span>
                <span id="live-score-opp">${st.oppScore}</span>
              </span>
              <span class="tv-team is-opp">
                <span>${oppTag}</span>
                ${oppTeam.emblem ? `<img src="${oppTeam.emblem}" alt="" />` : ""}
              </span>
              <span class="tv-clock-pill" id="live-clock-text">${st.minute}'</span>
            </div>
            <div class="pitch-tv-controls-bug">
              <button type="button" class="ie-cmd-btn pitch-hud-btn" id="btn-toggle-speed">
                <span>Vel: ${state.simSpeed}x</span>
              </button>
              <button type="button" class="ie-cmd-btn ie-cmd-gold pitch-hud-btn" id="btn-open-live-tactics" title="Pausar e ajustar Táticas">
                <span>⚙️</span>
              </button>
            </div>
          `
              : ""
          }
          <div class="pitch-world" id="live-pitch-world">
            <div class="pitch-field-outline"></div>
            <div class="pitch-line-mid"></div>
            <div class="pitch-center-circle"></div>
            <div class="pitch-center-dot"></div>
            <div class="pitch-box-left"></div>
            <div class="pitch-box-right"></div>
            <div class="pitch-small-box-left"></div>
            <div class="pitch-small-box-right"></div>
            <div class="pitch-arc-left"></div>
            <div class="pitch-arc-right"></div>
            <div class="pitch-goal-left" id="pitch-goal-left">${buildGoalTopDownSVG("left")}</div>
            <div class="pitch-goal-right" id="pitch-goal-right">${buildGoalTopDownSVG("right")}</div>

            <svg class="pitch-pass-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line id="pitch-pass-glow" x1="50" y1="50" x2="50" y2="50" stroke="#facc15" stroke-width="2.2" stroke-linecap="round" style="opacity:0;" />
              <line id="pitch-pass-line" x1="50" y1="50" x2="50" y2="50" stroke="#facc15" stroke-width="0.9" stroke-dasharray="2.5 1.8" stroke-linecap="round" style="opacity:0;" />
            </svg>

            <div id="pitch-shockwave" class="pitch-shockwave"></div>
            <div id="pitch-save-ring" class="pitch-save-ring"></div>
            <div id="pitch-goal-burst" class="pitch-goal-burst">
              <svg viewBox="0 0 160 140" fill="none" class="pitch-lightning-svg">
                <defs>
                  <radialGradient id="plasmaGlow" cx="20%" cy="50%" r="65%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
                    <stop offset="25%" stop-color="#fef08a" stop-opacity="0.95"/>
                    <stop offset="55%" stop-color="#38bdf8" stop-opacity="0.8"/>
                    <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
                  </radialGradient>
                  <linearGradient id="boltGradGold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="40%" stop-color="#fde047"/>
                    <stop offset="100%" stop-color="#f59e0b"/>
                  </linearGradient>
                  <linearGradient id="boltGradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="45%" stop-color="#7dd3fc"/>
                    <stop offset="100%" stop-color="#0284c7"/>
                  </linearGradient>
                  <filter id="lightningGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1"/>
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2"/>
                    <feMerge>
                      <feMergeNode in="blur2"/>
                      <feMergeNode in="blur1"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <ellipse class="lightning-ring outer-ring" cx="24" cy="70" rx="34" ry="48" stroke="rgba(56,189,248,0.7)" stroke-width="2.5" stroke-dasharray="10 8" fill="none"/>
                <ellipse class="lightning-ring inner-ring" cx="24" cy="70" rx="20" ry="28" stroke="rgba(254,240,138,0.9)" stroke-width="3" fill="none"/>
                <circle class="lightning-core" cx="24" cy="70" r="16" fill="url(#plasmaGlow)"/>
                <path class="lightning-wave-crest wave-1" d="M 45,18 C 72,38 78,102 45,122" stroke="rgba(254,240,138,0.95)" stroke-width="3.6" stroke-linecap="round" fill="none"/>
                <path class="lightning-wave-crest wave-2" d="M 68,10 C 102,32 108,108 68,130" stroke="rgba(56,189,248,0.85)" stroke-width="2.8" stroke-linecap="round" fill="none"/>
                <path class="lightning-wave-crest wave-3" d="M 94,6 C 132,28 138,112 94,134" stroke="rgba(186,230,253,0.65)" stroke-width="2" stroke-linecap="round" stroke-dasharray="6 4" fill="none"/>
                <path class="lightning-bolt bolt-main" d="M 24,70 L 42,60 L 52,66 L 76,52 L 90,60 L 118,44 L 140,50 L 158,40" stroke="url(#boltGradGold)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" filter="url(#lightningGlow)"/>
                <path class="lightning-bolt bolt-top" d="M 24,66 L 40,46 L 54,54 L 78,32 L 96,40 L 122,22 L 138,28 L 156,14" stroke="url(#boltGradCyan)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" filter="url(#lightningGlow)"/>
                <path class="lightning-bolt bolt-bot" d="M 24,74 L 40,92 L 56,86 L 80,108 L 98,100 L 124,118 L 142,112 L 158,126" stroke="url(#boltGradCyan)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" filter="url(#lightningGlow)"/>
                <path class="lightning-bolt bolt-fork-1" d="M 52,66 L 68,82 L 88,78 L 112,94" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                <path class="lightning-bolt bolt-fork-2" d="M 76,52 L 92,36 L 114,40 L 134,26" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle class="lightning-spark s1" cx="82" cy="44" r="2.8" fill="#ffffff"/>
                <circle class="lightning-spark s2" cx="106" cy="74" r="3.2" fill="#fde047"/>
                <circle class="lightning-spark s3" cx="128" cy="36" r="2.5" fill="#38bdf8"/>
                <circle class="lightning-spark s4" cx="138" cy="98" r="2.8" fill="#ffffff"/>
                <circle class="lightning-spark s5" cx="64" cy="98" r="2.2" fill="#fde047"/>
              </svg>
            </div>
            ${tokensHTML}
            <div id="live-pitch-ball" class="pitch-ball-dot" style="left:${pitch.ballX}%; top:${pitch.ballY}%;">${buildMiniBallSVG("pitch-ball-svg")}</div>
            <div id="pitch-float-badge" class="pitch-float-badge"></div>
          </div>
          <div id="pitch-center-callout" class="pitch-center-callout" style="display:none;"></div>
          <div id="shot-clash-slot" class="pitch-clash-modal" style="display:none;"></div>
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

  function pauseForPitchBeat(st, calloutHTML, calloutCls, durationMs, ovrDiff, onBeatDone = null) {
    if (state.simSpeed !== 1) {
      if (onBeatDone) onBeatDone(true);
      syncLivePitchDOM(st);
      handleMinuteEndBoundaries(st, ovrDiff);
      return;
    }

    if (state.tournament.timerId) {
      clearInterval(state.tournament.timerId);
      state.tournament.timerId = null;
    }

    const calloutEl = document.getElementById("pitch-center-callout");
    if (calloutEl && calloutHTML) {
      calloutEl.className = `pitch-center-callout ${calloutCls || ""}`.trim();
      calloutEl.innerHTML = calloutHTML;
      calloutEl.style.display = "flex";
    }

    let beatResolved = false;
    const finishBeat = (skipRestart = false) => {
      if (beatResolved) return;
      beatResolved = true;
      state.tournament.pendingBeatFinish = null;
      if (state.tournament.actionBeatTimer) {
        clearTimeout(state.tournament.actionBeatTimer);
        state.tournament.actionBeatTimer = null;
      }

      const cEl = document.getElementById("pitch-center-callout");
      if (cEl) {
        cEl.innerHTML = "";
        cEl.style.display = "none";
        cEl.className = "pitch-center-callout";
      }

      if (onBeatDone) onBeatDone(skipRestart);
      syncLivePitchDOM(st);
      const matchEnded = handleMinuteEndBoundaries(st, ovrDiff);
      if (!matchEnded && !skipRestart && st.running && !st.finished && !state.tournament.pendingClashFinish) {
        startMatchInterval();
      }
    };

    state.tournament.pendingBeatFinish = finishBeat;
    state.tournament.actionBeatTimer = setTimeout(() => {
      finishBeat(false);
    }, durationMs);
  }

  function playShotClashAndContinue(st, clash, onImpactOutcome, ovrDiff, onModalClosed = null) {
    // Em 2x/4x resolve instantaneamente sem abrir o modal
    if (state.simSpeed !== 1) {
      if (onImpactOutcome) onImpactOutcome();
      if (onModalClosed) onModalClosed(true);
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
      if (onModalClosed) onModalClosed(true);
      syncLivePitchDOM(st);
      if (!handleMinuteEndBoundaries(st, ovrDiff)) startMatchInterval();
      return;
    }

    const dir = clash.dir === "rtl" ? "rtl" : "ltr";
    const dirCls = `dir-${dir}`;
    const topPillCls = "clash-move-shoot";
    const topIconCat = "SH";
    const botPillCls = "clash-move-def";
    const botIconCat = clash.bottomIcon || "GK";
    const runnerHTML = `
      <div class="fireball-runner ${dirCls}">
        <div class="fireball-trail"></div>
        <div class="fireball-orb">${buildFireballSVG()}</div>
      </div>
    `;
    const actionMs = 1950;
    const bannerMs = 850;

    slotEl.style.display = "flex";

    // Modal de Chute / Bloqueio sobre o campo (Dream Team à ESQUERDA, Adversário à DIREITA)
    slotEl.innerHTML = `
      <div class="shot-clash-stage pitch-modal-stage">
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

      if (!impactApplied && onImpactOutcome) {
        impactApplied = true;
        onImpactOutcome();
      }
      syncLivePitchDOM(st);

      let beatOwned = false;
      if (!afterApplied && onModalClosed) {
        afterApplied = true;
        beatOwned = Boolean(onModalClosed(skipRestart));
      }
      if (!beatOwned) {
        const matchEnded = handleMinuteEndBoundaries(st, ovrDiff);
        if (!matchEnded && !skipRestart && st.running && !st.finished) {
          startMatchInterval();
        }
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

  function ensureMatchSupport(st, pitch) {
    if (!pitch || pitch.matchSupportInitialized) return;
    if (st.isGoldenGoal5v5) {
      const uPwrAvg = pitch.userNodes.reduce((s, n) => s + (n.indivPower || 120), 0) / Math.max(1, pitch.userNodes.length);
      const oPwrAvg = pitch.oppNodes.reduce((s, n) => s + (n.indivPower || 120), 0) / Math.max(1, pitch.oppNodes.length);
      const pwrEdge = (uPwrAvg - oPwrAvg) * 0.08;
      pitch.matchSupport = {
        userTeamSupport: 2.2 + Math.max(-5, Math.min(8, pwrEdge)),
        oppTeamSupport: 2.0 + Math.max(-5, Math.min(8, -pwrEdge)),
        powerDiff: Math.round((uPwrAvg - oPwrAvg) * 5),
        ovrDiff: Math.round((uPwrAvg - oPwrAvg) / 10)
      };
      pitch.matchSupportInitialized = true;
      return;
    }
    const stageIdx = state.tournament.stageIndex || 0;
    const userStats = calcSquadStats();
    const oppStats = calcOpponentStats(st.oppTeam, stageIdx);
    const powerDiff = userStats.power - oppStats.power;
    // Vantagem de Poder do Time gera suporte equilibrado nos duelos (evita bola de neve extrema!)
    const userPwrBonus = powerDiff > 0 ? Math.min(7.5, (powerDiff / 150) * 1.1) : 0;
    const oppPwrBonus = powerDiff < 0 ? Math.min(7.5, (Math.abs(powerDiff) / 150) * 1.1) : 0;

    pitch.matchSupport = {
      userTeamSupport:
        (userStats.chem / 100) * 4.2 +
        (userStats.correctPosCount === 11 ? 2.4 : userStats.correctPosCount * 0.12) +
        userPwrBonus,
      oppTeamSupport:
        (oppStats.chem / 100) * 4.2 +
        (oppStats.correctPosCount === 11 ? 2.4 : oppStats.correctPosCount * 0.12) +
        oppPwrBonus,
      powerDiff,
      ovrDiff: userStats.ovr - oppStats.ovr
    };
    pitch.matchSupportInitialized = true;
  }

  function triggerStealShockwave(pitch, centerX, centerY, stealerUid, tackledUid = null) {
    if (!pitch) return;
    const now = performance.now();
    const dur = state.simSpeed === 4 ? 95 : state.simSpeed === 2 ? 220 : 420;
    pitch.shockFx = { x: centerX, y: centerY, start: now, duration: dur + 120 };
    pitch.pushTweens = [];

    [...pitch.userNodes, ...pitch.oppNodes].forEach((n) => {
      if (n.uid === stealerUid || n.role === "GK") return;
      const dx = n.x - centerX;
      const dy = n.y - centerY;
      const dist = Math.hypot(dx, dy);
      if (dist > 20) return;

      const angle = dist > 0.25 ? Math.atan2(dy, dx) : n.side === "user" ? Math.PI : 0;
      const pushDist = n.uid === tackledUid ? 6.6 : Math.max(2.6, (1 - dist / 20) * 5.8);
      const toX = Math.max(8, Math.min(92, n.x + Math.cos(angle) * pushDist));
      const toY = Math.max(10, Math.min(90, n.y + Math.sin(angle) * pushDist));

      n.vx = Math.cos(angle) * 7.5;
      n.vy = Math.sin(angle) * 7.5;
      pitch.pushTweens.push({
        node: n,
        fromX: n.x,
        fromY: n.y,
        toX,
        toY,
        start: now,
        duration: dur
      });
    });
  }

  function triggerSaveImplosion(pitch, centerX, centerY) {
    if (!pitch) return;
    const dur = state.simSpeed === 4 ? 130 : state.simSpeed === 2 ? 270 : 620;
    pitch.saveRingFx = {
      x: Math.max(4, Math.min(96, centerX)),
      y: Math.max(10, Math.min(90, centerY)),
      start: performance.now(),
      duration: dur
    };
  }

  function triggerGoalLightningBurst(pitch, goalSide, targetX = null, targetY = 50) {
    if (!pitch) return;
    const dur = state.simSpeed === 4 ? 260 : state.simSpeed === 2 ? 550 : 1200;
    const isRight = goalSide !== "left";
    const burstX = targetX !== null ? targetX : (isRight ? 95.8 : 4.2);
    const burstY = targetY !== null ? targetY : 50;
    pitch.goalBurstFx = {
      side: isRight ? "right" : "left",
      x: burstX,
      y: burstY,
      start: performance.now(),
      duration: dur
    };
  }

  function resolvePhysicalDribbleClash(st, pitch, carrier, marker, attSupport, defSupport, ovrDiff) {
    const attIsUser = carrier.side === "user";
    const ofPick = pickStaminaGatedMove(carrier, "OF");
    const dfPick = pickStaminaGatedMove(marker, "DF");
    const carrierSpd = carrier.spd || calcPlayerSpeedStat(carrier.player, carrier.effOvr);
    const markerSpd = marker.spd || calcPlayerSpeedStat(marker.player, marker.effOvr);
    const spdDiff = carrierSpd - markerSpd;
    const spdBonus = Math.max(-4.5, Math.min(4.5, spdDiff * 0.28));
    let dribTacBonus = 0;
    if (attIsUser) {
      const dLvl = state.tournament?.prepBonuses?.dribbleEdgeLvl || 0;
      if (dLvl > 0) {
        dribTacBonus += [0, 1.2, 2.4, 3.6][dLvl] || 3.6;
        const lane = getTactics().lane;
        const inChosenLane =
          (lane === "wings" && (carrier.y < 34 || carrier.y > 66)) ||
          (lane === "center" && carrier.y >= 34 && carrier.y <= 66);
        if (inChosenLane) dribTacBonus += 0.8;
      }
    }
    const dribScore = calcNodeDuelScore(carrier, attSupport, marker?.player?.element) + ofPick.duelBonus + spdBonus + dribTacBonus;
    const defScore = calcNodeDuelScore(marker, defSupport, carrier?.player?.element) + dfPick.duelBonus;
    const wonDribble = Math.random() < logisticWinProb(dribScore, defScore, 4.4, 0.38, 0.86);

    spendStamina(carrier, ofPick.cost);
    spendStamina(marker, dfPick.cost);
    carrier.duelCooldown = 2.4;
    marker.duelCooldown = 2.4;

    if (attIsUser) {
      pitch.stats.userDribblesTry++;
      recordUserPlayerStat(pitch, carrier, "dribblesTry", 1);
    }

    const ofMove = ofPick.move || (ofPick.exhausted ? "Drible sem técnica (sem energia)" : "Avanço Direto");
    const dfMove = dfPick.move || (dfPick.exhausted ? "Corte sem técnica (sem energia)" : "Marcação Cerrada");
    const dir = attIsUser ? 1 : -1;

    if (wonDribble) {
      if (attIsUser) {
        pitch.stats.userDribblesOk++;
        recordUserPlayerStat(pitch, carrier, "dribblesOk", 1);
      }
      if (
        !(
          pitch.lastAssistCandidate &&
          pitch.lastAssistCandidate.side === carrier.side &&
          pitch.lastAssistCandidate.receiverUid === carrier.uid
        )
      ) {
        pitch.lastAssistCandidate = null;
      }
      pitch.lastPasserUid = null;
      pitch.lastAction = "DRIBBLE";
      const startX = carrier.x;
      const startY = carrier.y;
      const dodgeSign = startY >= marker.y ? 1 : -1;
      const dashToX = Math.max(10, Math.min(90, startX + dir * 10.5));
      const dashToY = Math.max(12, Math.min(88, startY + dodgeSign * 5.2));
      const dashMs = state.simSpeed === 4 ? 95 : state.simSpeed === 2 ? 190 : 380;

      pitch.dashFx = {
        uid: carrier.uid,
        fromX: startX,
        fromY: startY,
        toX: dashToX,
        toY: dashToY,
        start: performance.now(),
        duration: dashMs
      };
      pitch.passTrail = {
        fromX: startX,
        fromY: startY,
        toX: dashToX,
        toY: dashToY,
        curX: startX,
        curY: startY,
        color: "#c084fc",
        start: performance.now(),
        flightDuration: dashMs,
        fadeUntil: performance.now() + dashMs + 520
      };
      if (state.simSpeed !== 1) {
        carrier.x = dashToX;
        carrier.y = dashToY;
        pitch.ballX = dashToX;
        pitch.ballY = dashToY;
      }
      carrier.vx = dir * carrier.maxSpeed * 1.15;
      carrier.vy = dodgeSign * 6.5;
      carrier.carryTime = 0.35;
      carrier.decisionTimer = 0.32;
      marker.staggerTimer = 1.65;
      marker.vx *= 0.15;
      marker.vy *= 0.15;

      const spdAdvTag = spdDiff >= 5 ? ` <span style="color:#7dd3fc; font-size:0.75rem;">(⚡ +${spdDiff} VEL)</span>` : "";
      const ofBadgeText = ofPick.move ? `Avançou • ${ofMove}` : ofPick.exhausted ? "Avançou (Sem técnica)" : "Avançou";
      showNodeBadge(pitch, carrier.uid, ofBadgeText, "badge-dribble", 1500, ofPick.move ? "OF" : null);
      pitch.ticker = `${st.minute}' ${carrier.player.name} avançou com ${ofMove} sobre ${marker.player.name}!`;
      prependNarrationLine(
        st,
        "nar-dribble",
        ofPick.move
          ? `${st.minute}' [Drible] ${carrier.player.name} ativou 【${ofMove}】 e avançou por ${marker.player.name}!${spdAdvTag}`
          : `${st.minute}' [Drible] ${carrier.player.name} avançou sem técnica${ofPick.exhausted ? " (energia vermelha)" : ""} por ${marker.player.name}!${spdAdvTag}`,
        { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side },
        { name: marker.player.name, sprite: marker.player.sprite, side: marker.side },
        "OF"
      );
      syncLivePitchDOM(st);
      pauseForPitchBeat(st, "", "", 1050, ovrDiff);
    } else {
      pitch.ballSide = attIsUser ? "opp" : "user";
      pitch.ballMode = "CARRIED";
      pitch.carrierUid = marker.uid;
      pitch.challengerUid = null;
      pitch.holdBallPos = null;
      pitch.lastAssistCandidate = null;
      pitch.lastPasserUid = null;
      pitch.lastAction = "STEAL";
      pitch.teamConsecutivePasses = 0;
      marker.carryTime = 0;
      marker.decisionTimer = 0.25;
      marker.vx = -dir * marker.maxSpeed * 0.85;
      carrier.staggerTimer = 1.45;
      carrier.vx *= 0.15;
      carrier.vy *= 0.15;
      pitch.ballX = marker.x + (marker.side === "user" ? 1.9 : -1.9);
      pitch.ballY = marker.y + 1.0;

      const spdDefTag = spdDiff <= -5 ? ` <span style="color:#7dd3fc; font-size:0.75rem;">(⚡ +${Math.abs(spdDiff)} VEL marcador)</span>` : "";
      triggerStealShockwave(pitch, marker.x, marker.y, marker.uid, carrier.uid);
      showNodeBadge(pitch, carrier.uid, "Perdeu a bola", "badge-lost", 1500);
      showNodeBadge(pitch, marker.uid, dfPick.move ? `Roubou • ${dfMove}` : "Roubou (Sem técnica)", "badge-steal", 1500, dfPick.move ? "DF" : null);
      if (!attIsUser) {
        pitch.stats.userSteals++;
        recordUserPlayerStat(pitch, marker, "steals", 1);
      }
      pitch.ticker = `${st.minute}' ${carrier.player.name} perdeu a bola — roubo de ${marker.player.name} (${dfMove})!`;
      prependNarrationLine(
        st,
        "nar-steal",
        dfPick.move
          ? `${st.minute}' [Desarme] ${marker.player.name} usou 【${dfMove}】 e roubou a bola de ${carrier.player.name}!${spdDefTag}`
          : `${st.minute}' [Desarme] ${marker.player.name} roubou a bola sem técnica${dfPick.exhausted ? " (energia vermelha)" : ""} de ${carrier.player.name}!${spdDefTag}`,
        { name: marker.player.name, sprite: marker.player.sprite, side: marker.side },
        { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side },
        "DF"
      );
      syncLivePitchDOM(st);
      pauseForPitchBeat(st, "", "", 1050, ovrDiff);
    }
  }

  function launchContinuousPass(st, pitch, carrier, attNodes, defNodes, strictForward, safeRestart, isOneTwoPass = false, passOptions = {}) {
    const attIsUser = carrier.side === "user";
    const isGkOutlet = carrier.role === "GK";
    const isSafeProtectedPass = Boolean(safeRestart || isGkOutlet || isOneTwoPass || passOptions.isReturnOneTwo);
    const receiver = passOptions.targetReceiver || pickPassReceiver(attNodes, defNodes, carrier, strictForward, pitch);
    if (!receiver) return false;

    const fwdDir = attIsUser ? 1 : -1;

    // Linha de impedimento (penúltimo adversário, ou seja, o último jogador de linha)
    // No 5x5 NÃO há regra de impedimento
    const oppOutfieldDefs = (defNodes || []).filter((d) => d.role !== "GK");
    const oppDefLineX = oppOutfieldDefs.length > 0
      ? (attIsUser ? Math.max(...oppOutfieldDefs.map((d) => d.x)) : Math.min(...oppOutfieldDefs.map((d) => d.x)))
      : (attIsUser ? 84 : 16);

    // Condição legal de impedimento no instante do passe (at the moment the ball is played):
    // 1) Em seu próprio campo, OU
    // 2) Atrás ou na mesma linha da bola, OU
    // 3) Atrás ou na mesma linha do penúltimo adversário
    // OBS: No 5x5, jogador está SEMPRE em condição legal (isReceiverOnside = true)
    const isReceiverOnside = pitch.is5v5 || (attIsUser
      ? (receiver.x <= 50 || receiver.x <= carrier.x + 0.8 || receiver.x <= oppDefLineX + 0.8)
      : (receiver.x >= 50 || receiver.x >= carrier.x - 0.8 || receiver.x >= oppDefLineX - 0.8));

    const wasOffsideAtPassTime = !pitch.is5v5 && !isReceiverOnside && (attIsUser ? receiver.x > 50 : receiver.x < 50);

    const effRole = getEffectiveCarrierRole(carrier);
    const forwardSpace = attIsUser ? (oppDefLineX - receiver.x) : (receiver.x - oppDefLineX);
    const fwdDistToCarrier = attIsUser ? (receiver.x - carrier.x) : (carrier.x - receiver.x);

    // Decisão tática de colocar a bola à frente no espaço vazio (Passe em Profundidade / Enfiada de Bola):
    // Se for tabela, retorno de 1-2, opção forçada, ou jogador em posição legal com corredor livre
    const wantsSpacePass = Boolean(
      passOptions.forceSpacePass ||
      isOneTwoPass ||
      passOptions.isReturnOneTwo ||
      (!isGkOutlet && !safeRestart && isReceiverOnside && (effRole === "MF" || effRole === "FW") && (forwardSpace >= 5 || fwdDistToCarrier >= 4) && Math.random() < 0.65)
    );

    const isThroughBall = Boolean(wantsSpacePass && !wasOffsideAtPassTime);

    let leadX;
    let leadY;

    if (isThroughBall) {
      // Projeta a bola à frente no espaço vazio para o recebedor avançar e buscar!
      const passerSkill = Math.max(50, Math.min(99, carrier.effOvr || 75));
      const spaceLeadDist = 8.5 + (passerSkill / 100) * 6.5; // 8.5 a 15 unidades de avanço

      let projX = receiver.x + fwdDir * spaceLeadDist;
      if (attIsUser) {
        projX = Math.max(12, Math.min(89.5, projX));
      } else {
        projX = Math.max(10.5, Math.min(88, projX));
      }

      // Projeta no corredor com leve convergência para o gol ou flanco desimpedido
      const rx = Number.isFinite(receiver.x) ? receiver.x : (attIsUser ? 45 : 55);
      const ry = Number.isFinite(receiver.y) ? receiver.y : 50;
      const uidHash = typeof receiver.uid === "string"
        ? (receiver.uid.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 5)
        : ((Number(receiver.uid) || 1) % 5);
      const corridorDrift = (50 - ry) * 0.18 + (uidHash - 2) * 1.5;
      let projY = ry + corridorDrift;
      projY = Math.max(13, Math.min(87, projY));

      leadX = Number.isFinite(projX) ? projX : (attIsUser ? 75 : 25);
      leadY = Number.isFinite(projY) ? projY : 50;

      // O recebedor dispara em arrancada física para dominar a bola no espaço vazio!
      receiver.targetX = leadX;
      receiver.targetY = leadY;
      receiver.targetSprint = 1.38;
      receiver.vx = (leadX - rx) * 1.35;
      receiver.vy = (leadY - ry) * 1.35;
    } else {
      const rx = Number.isFinite(receiver.x) ? receiver.x : (attIsUser ? 45 : 55);
      const ry = Number.isFinite(receiver.y) ? receiver.y : 50;
      leadX = Math.max(8, Math.min(92, rx + (receiver.vx || 0) * 0.25));
      leadY = Math.max(10, Math.min(90, ry + (receiver.vy || 0) * 0.25));
    }

    const dist = Math.hypot(leadX - carrier.x, leadY - carrier.y);
    const passSpeed = dist > 30 ? 58 : isThroughBall ? 54 : 48;
    const duration = Math.max(0.20, Math.min(0.85, dist / passSpeed));

    // Passe normal consome 4.5; reposição de goleiro 2.0; bola enfiada 6.5; tabela com arrancada 12 de stamina!
    const passStaminaCost = isOneTwoPass ? 12 : isThroughBall ? 6.5 : isGkOutlet ? 2.0 : safeRestart ? 2.5 : 4.5;
    spendStamina(carrier, passStaminaCost);
    if (attIsUser) {
      if (isGkOutlet) {
        pitch.stats.userGkReleases = (pitch.stats.userGkReleases || 0) + 1;
        recordUserPlayerStat(pitch, carrier, "gkReleases", 1);
      } else {
        pitch.stats.userPassesTry++;
        recordUserPlayerStat(pitch, carrier, "passesTry", 1);
      }
    }

    // Se for jogada combinada / tabela (1-2), o passador dá um DASH nas costas do marcador!
    if (isOneTwoPass) {
      carrier.targetX = Math.max(8, Math.min(92, carrier.x + fwdDir * 18));
      carrier.targetY = Math.max(12, Math.min(88, carrier.y + (Math.random() < 0.5 ? 5 : -5)));
      carrier.vx += fwdDir * 28;
      carrier.targetSprint = 1.38;
      showNodeBadge(pitch, carrier.uid, "⚡ Tabela (Dash)!", "badge-dribble", 1500);
      prependNarrationLine(
        st,
        "nar-pass",
        `${st.minute}' [Tabela Rápida] ${carrier.player.name} tabelou de primeira com ${receiver.player.name} e arrancou em velocidade nas costas da marcação!`,
        { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side },
        { name: receiver.player.name, sprite: receiver.player.sprite, side: receiver.side },
        "BALL"
      );
    } else if (isThroughBall && !passOptions.isReturnOneTwo) {
      showNodeBadge(pitch, receiver.uid, "🏃 No Espaço!", "badge-dribble", 1500);
      prependNarrationLine(
        st,
        "nar-pass",
        `${st.minute}' [Passe em Profundidade] ${carrier.player.name} enfiou a bola no espaço vazio! ${receiver.player.name} disparou em posição legal para buscar!`,
        { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side },
        { name: receiver.player.name, sprite: receiver.player.sprite, side: receiver.side },
        "BALL"
      );
    } else if (passOptions.isReturnOneTwo) {
      showNodeBadge(pitch, receiver.uid, "⚡ Devolveu no Espaço!", "badge-dribble", 1500);
      prependNarrationLine(
        st,
        "nar-pass",
        `${st.minute}' [Tabela no Espaço] ${carrier.player.name} colocou a bola mais à frente no espaço vazio e ${receiver.player.name} correu para pegar!`,
        { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side },
        { name: receiver.player.name, sprite: receiver.player.sprite, side: receiver.side },
        "BALL"
      );
    }

    pitch.ballMode = "PASS_FLIGHT";
    pitch.carrierUid = null;
    pitch.challengerUid = null;
    pitch.holdBallPos = null;
    pitch.lastAction = (isOneTwoPass || passOptions.isReturnOneTwo) ? "ONE_TWO" : isThroughBall ? "THROUGH_BALL" : "PASS";
    pitch.teamConsecutivePasses = (pitch.teamConsecutivePasses || 0) + 1;

    pitch.passState = {
      passerUid: carrier.uid,
      passerNode: carrier,
      receiverUid: receiver.uid,
      effRole,
      isGkOutlet,
      isSafeProtectedPass,
      isOneTwoPass,
      isThroughBall,
      wasOffsideAtPassTime,
      fromX: pitch.ballX,
      fromY: pitch.ballY,
      toX: leadX,
      toY: leadY,
      elapsed: 0,
      duration,
      progress: 0
    };

    const trailColor = (isOneTwoPass || passOptions.isReturnOneTwo)
      ? "#facc15"
      : isThroughBall
      ? (attIsUser ? "#38bdf8" : "#f472b6")
      : (attIsUser ? "#4ade80" : "#f87171");

    pitch.passTrail = {
      fromX: pitch.ballX,
      fromY: pitch.ballY,
      toX: leadX,
      toY: leadY,
      curX: pitch.ballX,
      curY: pitch.ballY,
      color: trailColor,
      start: performance.now(),
      flightDuration: Math.round(duration * 1000),
      fadeUntil: performance.now() + 900
    };

    const badgeTxt = isGkOutlet
      ? "REPOSIÇÃO"
      : (isOneTwoPass || passOptions.isReturnOneTwo)
      ? "TABELA"
      : isThroughBall
      ? "NO ESPAÇO"
      : "PASSE";

    showPitchBadge(pitch, leadX, leadY, badgeTxt, "badge-pass", 750, isGkOutlet ? "GK" : "BALL");
    pitch.ticker = isGkOutlet
      ? `${st.minute}' Reposição: ${carrier.player.name} ➔ ${receiver.player.name}`
      : (isOneTwoPass || passOptions.isReturnOneTwo)
      ? `${st.minute}' Tabela no Espaço: ${carrier.player.name} ➔ ${receiver.player.name}!`
      : isThroughBall
      ? `${st.minute}' Bola Enfiada: ${carrier.player.name} ➔ espaço vazio para ${receiver.player.name}!`
      : `${st.minute}' Passe: ${carrier.player.name} ➔ ${receiver.player.name}`;
    return true;
  }

  function pointToSegmentDist(px, py, ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    if (lenSq <= 0.0001) return Math.hypot(px - ax, py - ay);
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  }

  function visualPitchDist(ax, ay, bx, by) {
    // Compensa proporção do campo expandido (largura vs altura visual) para colisões fiéis ao tamanho dos ícones
    return Math.hypot(ax - bx, (ay - by) * 0.52);
  }

  function launchContinuousShot(st, pitch, shooterNode, defNodes, attSupport, defSupport, ovrDiff, attNodesArg = null, opts = {}) {
    const origAttIsUser = shooterNode.side === "user";
    const origAttNodes = attNodesArg || (origAttIsUser ? pitch.userNodes : pitch.oppNodes);
    const origDefNodes = defNodes || (origAttIsUser ? pitch.oppNodes : pitch.userNodes);
    const effRole = getEffectiveCarrierRole(shooterNode);
    // Linha de fundo real do campo: 4.5% (esquerda) e 95.5% (direita). O fundo da rede fica a 2.5% e 97.5%.
    const origGoalX = origAttIsUser ? 96.8 : 3.2;
    const goalY = 50;
    const origGkNode = origDefNodes.find((n) => n.role === "GK") || origDefNodes[0];

    const shotDist = Math.hypot(shooterNode.x - origGoalX, shooterNode.y - goalY);
    const isLongDist = effRole === "MF" || shotDist > 26;
    const shotInfo = buildShotInfoForNode(shooterNode, Boolean(opts.forceLongShot));
    const isLongShotPlay = Boolean(shotInfo.isLongShotMove && (isLongDist || opts.forceLongShot));
    const longMod = isLongShotPlay ? 1.8 : isLongDist ? -3.5 : 0;

    // Vantagem elemental contra o goleiro (calculada diretamente para o chute contra o GK)
    const baseShotScore =
      calcNodeDuelScore(shooterNode, attSupport, origGkNode?.player?.element) +
      longMod +
      (shotInfo.duelBonus || 0);

    spendStamina(shooterNode, shotInfo.cost);

    const shotAssistCandidate =
      pitch.lastAssistCandidate &&
      pitch.lastAssistCandidate.side === shooterNode.side &&
      pitch.lastAssistCandidate.receiverUid === shooterNode.uid &&
      pitch.lastAssistCandidate.passerUid !== shooterNode.uid
        ? pitch.lastAssistCandidate
        : null;
    pitch.lastAssistCandidate = null;
    pitch.lastPasserUid = null;
    pitch.lastAction = "SHOT";
    pitch.teamConsecutivePasses = 0;

    if (origAttIsUser) {
      pitch.stats.userShots++;
      recordUserPlayerStat(pitch, shooterNode, "shots", 1);
    } else {
      pitch.stats.oppShots++;
    }

    if (isLongShotPlay) {
      showNodeBadge(pitch, shooterNode.uid, `⚡ Chute Longo! • ${shotInfo.label}`, "badge-shot", 1300, "SH");
      prependNarrationLine(
        st,
        "nar-shot",
        `${st.minute}' [Chute Longo] ${shooterNode.player.name} arriscou de longe com 【${shotInfo.label}】!`,
        { name: shooterNode.player.name, sprite: shooterNode.player.sprite, side: shooterNode.side },
        null,
        "SH"
      );
    }

    const resolveAgainstGk = (
      activeShooter,
      activeShotLabel,
      activeIsHissatsu,
      effectiveShotScore,
      fromX,
      fromY,
      curAttIsUser,
      curGkNode,
      curDefSupport,
      curGoalX,
      weakenedByBlocker,
      specialContext = null,
      forceInstant = false
    ) => {
      const gkPick = pickStaminaGatedMove(curGkNode, "GK");
      const gkMoveName =
        gkPick.move || (gkPick.exhausted ? "Defesa sem técnica (sem energia)" : "Defesa Direta");
      spendStamina(curGkNode, gkPick.cost);

      const gkStopScore = calcNodeDuelScore(curGkNode, curDefSupport, activeShooter?.player?.element) + gkPick.duelBonus;
      const goldenBias = st.isGoldenGoal5v5
        ? st.minute >= 30
          ? Math.min(14, 7.5 + (st.minute - 30) * 0.25)
          : st.minute >= 8
          ? Math.min(7.5, 1.5 + (st.minute - 7) * 0.7)
          : 1.5
        : 0;
      // Domínio moderado na finalização: Poder maior ajuda sem anular o goleiro rival
      const rawPwrDiff = pitch.matchSupport?.powerDiff || 0;
      const attPowerDiff = curAttIsUser ? rawPwrDiff : -rawPwrDiff;
      const dominanceShift =
        attPowerDiff >= 0
          ? Math.min(5.0, (attPowerDiff / 240) * 1.45)
          : Math.max(-5.0, (attPowerDiff / 220) * 1.65);
      const goalProb = st.isGoldenGoal5v5
        ? logisticWinProb(effectiveShotScore + goldenBias + dominanceShift * 0.6, gkStopScore, -3.6, 0.10, 0.86)
        : logisticWinProb(effectiveShotScore + dominanceShift, gkStopScore, -5.8, 0.03, 0.88);
      const isGoal = Math.random() < goalProb;

      const duelX = curAttIsUser ? 91.5 : 8.5;
      const duelY = Math.max(41, Math.min(59, 50 + (fromY - 50) * 0.22));
      const shotGoalY = Math.max(41.5, Math.min(58.5, duelY));
      const instantMode = forceInstant || state.simSpeed !== 1;

      pitch.ballMode = "SHOT_FLIGHT";
      pitch.carrierUid = null;
      pitch.challengerUid = curGkNode.uid;
      pitch.holdBallPos = { x: duelX, y: duelY };
      pitch.lastClashMinute = st.minute;

      const flightMs = instantMode ? 75 : Math.round(Math.max(450, Math.min(1150, 260 + Math.hypot(duelX - fromX, duelY - fromY) * 13.5)));
      const trailCol = specialContext?.isChain ? "#facc15" : specialContext?.isCounter ? "#38bdf8" : "#f97316";
      startBallFlight(pitch, fromX, fromY, duelX, duelY, flightMs, weakenedByBlocker ? 1.6 : 2.8, "SHOT", trailCol);
      if (!weakenedByBlocker) {
        showPitchBadge(pitch, fromX, fromY, activeShotLabel, specialContext?.isChain ? "badge-goal" : "badge-shot", instantMode ? 600 : 1750, "SH");
      }
      pitch.ticker = `${st.minute}' CHUTE! ${activeShooter.player.name} (${activeShotLabel}) vs ${curGkNode.player.name}!`;
      syncLivePitchDOM(st);

      const gSide = curAttIsUser ? "right" : "left";
      const concedingSide = curAttIsUser ? "opp" : "user";
      let impactApplied = false;

      const commitGoalOutcome = () => {
        if (impactApplied) return;
        impactApplied = true;

        const weakNote = weakenedByBlocker ? " (mesmo após desvio da zaga)" : "";
        const styleTag = specialContext?.isChain
          ? " [CHAIN SHOT]"
          : specialContext?.isCounter
          ? " [CONTRA-CHUTE]"
          : isLongShotPlay && !specialContext?.isCounter
          ? " [CHUTE LONGO]"
          : "";

        if (curAttIsUser) {
          st.userScore++;
          recordUserPlayerStat(pitch, activeShooter, "goals", 1);
          const assistNode = specialContext?.chainInitiator
            ? specialContext.chainInitiator
            : !specialContext?.isCounter && shotAssistCandidate
            ? findPitchNode(pitch, shotAssistCandidate.passerUid)
            : null;
          if (assistNode && assistNode.uid !== activeShooter.uid && assistNode.side === "user") {
            recordUserPlayerStat(pitch, assistNode, "assists", 1);
          }
          const assistTag =
            assistNode && assistNode.uid !== activeShooter.uid ? ` (assist. de ${assistNode.player.name})` : "";
          const goalObj = {
            minute: st.minute,
            name: activeShooter.player.name,
            sprite: activeShooter.player.sprite,
            shotLabel: `${activeShotLabel}${styleTag}`,
            isHissatsu: activeIsHissatsu,
            assistName: assistNode && assistNode.uid !== activeShooter.uid ? assistNode.player.name : null
          };
          st.goalsUser.push(goalObj);
          const scoreUserEl = document.getElementById("live-score-user");
          if (scoreUserEl) scoreUserEl.textContent = st.userScore;
          appendGoalItemDOM("user", goalObj);
          prependNarrationLine(
            st,
            "nar-goal-user",
            activeIsHissatsu
              ? `${st.minute}' GOOOL DO DREAM TEAM!${styleTag} ${activeShooter.player.name} disparou 【${activeShotLabel}】${assistTag}${weakNote} e furou 【${gkMoveName}】 de ${curGkNode.player.name}! (${st.userScore} x ${st.oppScore})`
              : `${st.minute}' GOOOL DO DREAM TEAM!${styleTag} ${activeShooter.player.name} superou ${curGkNode.player.name} com um ${activeShotLabel.toLowerCase()}${assistTag}${weakNote}! (${st.userScore} x ${st.oppScore})`,
            { name: activeShooter.player.name, sprite: activeShooter.player.sprite, side: "user" },
            { name: curGkNode.player.name, sprite: curGkNode.player.sprite, side: "opp" },
            "SH"
          );
        } else {
          st.oppScore++;
          const goalObj = {
            minute: st.minute,
            name: activeShooter.player.name,
            sprite: activeShooter.player.sprite,
            shotLabel: `${activeShotLabel}${styleTag}`,
            isHissatsu: activeIsHissatsu
          };
          st.goalsOpp.push(goalObj);
          const scoreOppEl = document.getElementById("live-score-opp");
          if (scoreOppEl) scoreOppEl.textContent = st.oppScore;
          appendGoalItemDOM("opp", goalObj);
          prependNarrationLine(
            st,
            "nar-goal-opp",
            activeIsHissatsu
              ? `${st.minute}' GOL DE ${st.oppTeam.name.toUpperCase()}!${styleTag} ${activeShooter.player.name} usou 【${activeShotLabel}】${weakNote} e venceu 【${gkMoveName}】 de ${curGkNode.player.name}! (${st.userScore} x ${st.oppScore})`
              : `${st.minute}' GOL DE ${st.oppTeam.name.toUpperCase()}!${styleTag} ${activeShooter.player.name} venceu ${curGkNode.player.name} com um ${activeShotLabel.toLowerCase()}${weakNote}! (${st.userScore} x ${st.oppScore})`,
            { name: activeShooter.player.name, sprite: activeShooter.player.sprite, side: "opp" },
            { name: curGkNode.player.name, sprite: curGkNode.player.sprite, side: "user" },
            "SH"
          );
        }
        pitch.ticker = `${st.minute}' GOOOL de ${activeShooter.player.name}! (${st.userScore} x ${st.oppScore})`;
      };

      const commitSaveOutcome = () => {
        if (impactApplied) return;
        impactApplied = true;

        if (!curAttIsUser) {
          pitch.stats.userSaves++;
          recordUserPlayerStat(pitch, curGkNode, "saves", 1);
        }
        pitch.ticker = `${st.minute}' ${curGkNode.player.name} defendeu o chute de ${activeShooter.player.name}!`;
        const gkAdvantageNote =
          curGkNode.player?.element &&
          activeShooter.player?.element &&
          ELEMENT_ADVANTAGE[curGkNode.player.element] === activeShooter.player.element
            ? " (Vantagem Elemental de Defesa)"
            : "";
        prependNarrationLine(
          st,
          "nar-save",
          gkPick.move
            ? `${st.minute}' [Defesa de Goleiro] ${curGkNode.player.name} acionou 【${gkMoveName}】${gkAdvantageNote} e espalmou ${weakenedByBlocker ? "o chute enfraquecido " : ""}【${activeShotLabel}】 de ${activeShooter.player.name}!`
            : `${st.minute}' [Defesa de Goleiro] ${curGkNode.player.name} defendeu sem técnica${gkAdvantageNote}${gkPick.exhausted ? " (energia vermelha)" : ""} e segurou ${weakenedByBlocker ? "o chute enfraquecido " : ""}${activeShotLabel} de ${activeShooter.player.name}!`,
          { name: curGkNode.player.name, sprite: curGkNode.player.sprite, side: curGkNode.side },
          { name: activeShooter.player.name, sprite: activeShooter.player.sprite, side: activeShooter.side },
          "GK"
        );
      };

      const applyShotImpact = () => {
        const nowInstant = forceInstant || state.simSpeed !== 1;
        if (nowInstant) {
          if (isGoal) {
            commitGoalOutcome();
            pitch.ballMode = "GOAL_NET";
            pitch.carrierUid = null;
            pitch.challengerUid = null;
            pitch.holdBallPos = { x: curGoalX, y: shotGoalY };
            startBallFlight(pitch, duelX, duelY, curGoalX, shotGoalY, 40, 0.4, "GOAL", "#facc15");
            pitch.goalFlashSide = gSide;
            pitch.goalFlashUntil = performance.now() + 2200;
            triggerStealShockwave(pitch, curGoalX, shotGoalY, null, null);
            triggerGoalLightningBurst(pitch, gSide, curGoalX, shotGoalY);
            showPitchBadge(pitch, curGoalX, shotGoalY, "GOOOL!!", "badge-goal", 1400, "SH");
            showNodeBadge(pitch, activeShooter.uid, `GOOOL! • ${activeShotLabel}`, "badge-goal", 1400, "SH");
          } else {
            commitSaveOutcome();
            pitch.ballSide = curAttIsUser ? "opp" : "user";
            pitch.ballMode = "CARRIED";
            pitch.carrierUid = curGkNode.uid;
            pitch.challengerUid = null;
            pitch.holdBallPos = null;
            curGkNode.carryTime = 0;
            curGkNode.decisionTimer = 0.35;
            curGkNode.duelCooldown = 1.8;
            pitch.ballFlight = null;
            pitch.ballX = curGkNode.x + (curGkNode.side === "user" ? 1.9 : -1.9);
            pitch.ballY = curGkNode.y + 1.0;
            pitch.passTrail = null;
            triggerSaveImplosion(pitch, duelX, duelY);
            showPitchBadge(pitch, curGkNode.x, curGkNode.y, gkMoveName, "badge-steal", 900, "GK");
            showNodeBadge(pitch, curGkNode.uid, `Defendeu • ${gkMoveName}`, "badge-steal", 900, "GK");
          }
        }
      };

      const onShotModalClosed = (skipRestart = false) => {
        const nowInstant = forceInstant || state.simSpeed !== 1;
        if (isGoal) {
          const doKickoffReset = () => {
            resetPitchForKickoff(pitch, concedingSide, true, true);
            pitch.ticker = `${st.minute}' Saída no centro com ${concedingSide === "user" ? "Dream Team" : st.oppTeam.name}! Fôlego restaurado pós-gol (+60% de energia gasta).`;
          };

          if (skipRestart || nowInstant) {
            commitGoalOutcome();
            pitch.goalFlashSide = gSide;
            pitch.goalFlashUntil = performance.now() + (state.simSpeed === 4 ? 700 : 1400);
            triggerStealShockwave(pitch, curGoalX, shotGoalY, null, null);
            triggerGoalLightningBurst(pitch, gSide, curGoalX, shotGoalY);
            showPitchBadge(pitch, curGoalX, shotGoalY, "GOOOL!!", "badge-goal", 1100, "SH");
            showNodeBadge(pitch, activeShooter.uid, `GOOOL! • ${activeShotLabel}`, "badge-goal", 1100, "SH");
            if (st.isGoldenGoal5v5) return false;
            doKickoffReset();
            return false;
          }

          // Animação de GOL no campo pós-resultado do duelo:
          // 1) Onda de choque atravessando o goleiro EXATAMENTE no corpo dele (curGkNode.x, curGkNode.y)
          triggerStealShockwave(pitch, curGkNode.x, curGkNode.y, null, curGkNode.uid);
          curGkNode.staggerTimer = 1.35;
          curGkNode.vx = curAttIsUser ? 3.2 : -3.2;
          showPitchBadge(pitch, curGkNode.x, curGkNode.y, "FURADA!", "badge-shot", 850, "SH");

          // 2) Bola atravessa em tiro direto e reto em direção às redes (arcHeight = 0)
          const netFlightMs = 240;
          pitch.ballMode = "GOAL_NET";
          pitch.carrierUid = null;
          pitch.challengerUid = null;
          pitch.holdBallPos = { x: curGoalX, y: shotGoalY };
          startBallFlight(pitch, curGkNode.x, curGkNode.y, curGoalX, shotGoalY, netFlightMs, 0, "GOAL", "#fde047");
          syncLivePitchDOM(st);

          // 3) Entrada nas redes com onda de choque e raio fluído exatamente onde a bola entrou na rede (curGoalX, shotGoalY)
          let netResolved = false;
          const finishGoalNetEntry = (skipBeat = false) => {
            if (netResolved) return;
            netResolved = true;
            state.tournament.pendingNetFlightFinish = null;
            if (state.tournament.netFlightTimer) {
              clearTimeout(state.tournament.netFlightTimer);
              state.tournament.netFlightTimer = null;
            }
            commitGoalOutcome();
            pitch.goalFlashSide = gSide;
            pitch.goalFlashUntil = performance.now() + 2200;
            triggerStealShockwave(pitch, curGoalX, shotGoalY, null, null);
            triggerGoalLightningBurst(pitch, gSide, curGoalX, shotGoalY);
            showPitchBadge(pitch, curGoalX, shotGoalY, "GOOOL!!", "badge-goal", 1600, "SH");
            showNodeBadge(pitch, activeShooter.uid, `GOOOL! • ${activeShotLabel}`, "badge-goal", 1650, "SH");
            syncLivePitchDOM(st);

            if (skipBeat || state.simSpeed !== 1) {
              if (!st.isGoldenGoal5v5) doKickoffReset();
              syncLivePitchDOM(st);
              handleMinuteEndBoundaries(st, ovrDiff);
              return;
            }

            if (st.isGoldenGoal5v5) {
              pauseForPitchBeat(
                st,
                `<span class="callout-tag">GOL DE OURO!</span><strong>${activeShooter.player.name}</strong><span>5x5 Encerrado · ${activeShotLabel}</span>`,
                "callout-goal",
                1200,
                ovrDiff,
                null
              );
            } else {
              pauseForPitchBeat(
                st,
                `<span class="callout-tag">GOOOL!</span><strong>${activeShooter.player.name}</strong><span>${st.userScore} x ${st.oppScore} · ${activeShotLabel}</span>`,
                "callout-goal",
                1500,
                ovrDiff,
                doKickoffReset
              );
            }
          };

          state.tournament.pendingNetFlightFinish = finishGoalNetEntry;
          state.tournament.netFlightTimer = setTimeout(() => {
            finishGoalNetEntry(false);
          }, netFlightMs);

          return true;
        }

        // Cenário de DEFESA: transfere sempre a posse limpa para o goleiro (mesmo se mudou para 2x/4x durante o duelo!)
        commitSaveOutcome();
        pitch.ballSide = curAttIsUser ? "opp" : "user";
        pitch.ballMode = "CARRIED";
        pitch.carrierUid = curGkNode.uid;
        pitch.challengerUid = null;
        pitch.holdBallPos = null;
        curGkNode.carryTime = 0;
        curGkNode.decisionTimer = 0.4;
        curGkNode.duelCooldown = 1.8;
        pitch.ballFlight = null;
        pitch.ballX = curGkNode.x + (curGkNode.side === "user" ? 1.9 : -1.9);
        pitch.ballY = curGkNode.y + 0.8;
        pitch.passTrail = null;

        triggerSaveImplosion(pitch, curGkNode.x, curGkNode.y);
        showPitchBadge(pitch, curGkNode.x, curGkNode.y, `DEFESA! • ${gkMoveName}`, "badge-steal", 1100, "GK");
        showNodeBadge(pitch, curGkNode.uid, `Defendeu • ${gkMoveName}`, "badge-steal", 1200, "GK");
        syncLivePitchDOM(st);

        if (skipRestart || nowInstant) {
          return false;
        }

        pauseForPitchBeat(st, "", "", 750, ovrDiff, null);
        return true;
      };

      const launchClashModal = (skipModal = false) => {
        state.tournament.shotFlightTimer = null;
        state.tournament.pendingShotFlightFinish = null;

        if (skipModal || forceInstant || state.simSpeed !== 1) {
          applyShotImpact();
          onShotModalClosed(true);
          syncLivePitchDOM(st);
          handleMinuteEndBoundaries(st, ovrDiff);
          return true;
        }

        const roleTag = specialContext?.isChain
          ? "CHAIN SHOT!"
          : specialContext?.isCounter
          ? "CONTRA-CHUTE!"
          : isLongShotPlay
          ? "CHUTE LONGO"
          : weakenedByBlocker
          ? "CHUTE (-FORÇA)"
          : "CHUTE";

        playShotClashAndContinue(
          st,
          {
            kind: "SHOT",
            dir: curAttIsUser ? "ltr" : "rtl",
            userPlayer: curAttIsUser
              ? { name: activeShooter.player.name, sprite: resolveDynamicNodeSprite(activeShooter, pitch), roleText: roleTag }
              : { name: curGkNode.player.name, sprite: resolveDynamicNodeSprite(curGkNode, pitch), roleText: "GOLEIRO" },
            oppPlayer: curAttIsUser
              ? { name: curGkNode.player.name, sprite: resolveDynamicNodeSprite(curGkNode, pitch), roleText: "GOLEIRO" }
              : { name: activeShooter.player.name, sprite: resolveDynamicNodeSprite(activeShooter, pitch), roleText: roleTag },
            topMoveName: weakenedByBlocker ? `${activeShotLabel} (Enfraquecido)` : activeShotLabel,
            bottomMoveName: gkMoveName,
            bottomIcon: "GK",
            outcomePositive: isGoal ? curAttIsUser : !curAttIsUser,
            resultBannerText: isGoal ? "GOOOL!!" : "DEFENDEU!"
          },
          applyShotImpact,
          ovrDiff,
          onShotModalClosed
        );
        return true;
      };

      if (instantMode) {
        return launchClashModal();
      }

      // Em velocidade normal (1x): o chute viaja visivelmente pelo campo até o goleiro!
      // Apenas quando chega perto dele abre-se a cena/modal das técnicas e o resultado.
      if (state.tournament.timerId) {
        clearInterval(state.tournament.timerId);
        state.tournament.timerId = null;
      }
      state.tournament.pendingShotFlightFinish = launchClashModal;
      state.tournament.shotFlightTimer = setTimeout(() => {
        launchClashModal();
      }, Math.max(50, flightMs - 40));
      return true;
    };

    // Verifica possibilidade de CHAIN SHOT por um companheiro posicionado na linha do chute!
    const maybeChainAndResolveGk = (
      activeShooter,
      activeShotLabel,
      activeIsHissatsu,
      effectiveShotScore,
      fromX,
      fromY,
      curAttIsUser,
      curAttNodes,
      curGkNode,
      curDefSupport,
      curGoalX,
      weakenedByBlocker,
      specialContext = null,
      forceInstant = false
    ) => {
      const distFromToGoal = Math.hypot(fromX - curGoalX, fromY - goalY);
      const gkElem = curGkNode?.player?.element;
      const shooterDisadv =
        activeShooter.player?.element && gkElem && ELEMENT_ADVANTAGE[gkElem] === activeShooter.player.element;

      const chainCandidates = (curAttNodes || [])
        .filter((n) => {
          if (n.uid === activeShooter.uid || n.role === "GK" || (n.staggerTimer || 0) > 0 || n.stamina < 48) return false;
          const nDistGoal = Math.hypot(n.x - curGoalX, n.y - goalY);
          const nDistFrom = Math.hypot(n.x - fromX, n.y - fromY);
          if (nDistGoal >= distFromToGoal - 4 || nDistGoal < 5 || nDistFrom < 3.5) return false;
          return pointToSegmentDist(n.x, n.y, fromX, fromY, curGoalX, goalY) <= 11.5;
        })
        .map((n) => ({ node: n, chainPick: getNodeChainShotMove(n) }))
        .filter((x) => Boolean(x.chainPick))
        .sort((a, b) => Math.hypot(a.node.x - fromX, a.node.y - fromY) - Math.hypot(b.node.x - fromX, b.node.y - fromY));

      if (chainCandidates.length > 0 && !specialContext?.isChain) {
        const chosen = chainCandidates[0];
        const chainNode = chosen.node;
        const cPick = chosen.chainPick;
        const cElem = chainNode.player?.element;
        const chainBetterVsGk =
          cElem &&
          gkElem &&
          (ELEMENT_ADVANTAGE[cElem] === gkElem || ELEMENT_ADVANTAGE[gkElem] !== cElem);

        let willProb = 0.40;
        if (cPick.isCanonicalChain) willProb += 0.22;
        if (shooterDisadv && chainBetterVsGk) willProb += 0.22;
        if (isLongShotPlay) willProb += 0.16;
        if (chainNode.stamina < 62) willProb -= 0.16;
        if (curAttIsUser) {
          const intMode = getTactics().intensity;
          if (intMode === "low") willProb -= 0.35;
          else if (intMode === "high") willProb += 0.25;
        }

        if (Math.random() < Math.max(0.08, Math.min(0.92, willProb))) {
          // Chain Shot aceito! Cansa bastante o 2º jogador (+14 extra já incluído em cPick.cost) e aumenta muito a força
          spendStamina(chainNode, cPick.cost);
          const ovrBoost = Math.max(0, (chainNode.effOvr - 75) * 0.15);
          const chainPowerBoost = 4.8 + ovrBoost + cPick.bonus;
          const elemUpgrade = Math.max(
            0,
            getElementEdge(cElem, gkElem) - getElementEdge(activeShooter.player?.element, gkElem)
          ) * 0.8;
          const chainedScore = effectiveShotScore + chainPowerBoost + elemUpgrade;
          const combinedMove = `${activeShotLabel} ➔ ${cPick.move}`;
          const nextCtx = {
            ...(specialContext || {}),
            isChain: true,
            chainInitiator: activeShooter
          };

          const chainInstant = forceInstant || state.simSpeed !== 1;
          pitch.ballMode = "SHOT_FLIGHT";
          pitch.carrierUid = null;
          pitch.challengerUid = chainNode.uid;
          pitch.holdBallPos = { x: chainNode.x, y: chainNode.y };

          const leg1Ms = chainInstant ? 45 : 620;
          startBallFlight(pitch, fromX, fromY, chainNode.x, chainNode.y, leg1Ms, 2.2, "SHOT", "#facc15");
          showNodeBadge(pitch, chainNode.uid, `⚡ Chain Shot! • ${cPick.move}`, "badge-chain", 1600, "SH");
          pitch.ticker = `${st.minute}' CHAIN SHOT! ${activeShooter.player.name} encadeou com ${chainNode.player.name} (${cPick.move})!`;
          prependNarrationLine(
            st,
            "nar-shot",
            `${st.minute}' [Chain Shot] ${activeShooter.player.name} (【${activeShotLabel}】) encadeou com ${chainNode.player.name} (【${cPick.move}】) — chute com força amplificada!`,
            { name: activeShooter.player.name, sprite: activeShooter.player.sprite, side: activeShooter.side },
            { name: chainNode.player.name, sprite: chainNode.player.sprite, side: chainNode.side },
            "SH"
          );
          syncLivePitchDOM(st);

          if (chainInstant) {
            return resolveAgainstGk(
              chainNode,
              combinedMove,
              true,
              chainedScore,
              chainNode.x,
              chainNode.y,
              curAttIsUser,
              curGkNode,
              curDefSupport,
              curGoalX,
              weakenedByBlocker,
              nextCtx,
              true
            );
          }

          pauseForPitchBeat(st, "", "", leg1Ms, ovrDiff, (skipRestart) => {
            resolveAgainstGk(
              chainNode,
              combinedMove,
              true,
              chainedScore,
              chainNode.x,
              chainNode.y,
              curAttIsUser,
              curGkNode,
              curDefSupport,
              curGoalX,
              weakenedByBlocker,
              nextCtx,
              Boolean(skipRestart || state.simSpeed !== 1)
            );
          });
          return true;
        }
      }

      return resolveAgainstGk(
        activeShooter,
        activeShotLabel,
        activeIsHissatsu,
        effectiveShotScore,
        fromX,
        fromY,
        curAttIsUser,
        curGkNode,
        curDefSupport,
        curGoalX,
        weakenedByBlocker,
        specialContext,
        forceInstant
      );
    };

    // Verifica interceptadores na linha do chute: 1) Counter Shot, 2) Bloqueio de zaga
    const pathEnemies = origDefNodes
      .filter((n) => n.role !== "GK" && (n.staggerTimer || 0) <= 0)
      .map((n) => ({
        node: n,
        distLine: pointToSegmentDist(n.x, n.y, shooterNode.x, shooterNode.y, origGoalX, goalY),
        distShooter: Math.hypot(n.x - shooterNode.x, n.y - shooterNode.y),
        distGoal: Math.hypot(n.x - origGoalX, n.y - goalY)
      }))
      .filter((b) => b.distLine <= 8.5 && b.distShooter >= 2.5 && b.distGoal < shotDist - 2)
      .sort((a, b) => a.distShooter - b.distShooter);

    // 1) COUNTER SHOT (se algum jogador na trajetória tiver técnica de contra-chute)
    const counterCandEntry = pathEnemies
      .map((e) => ({ entry: e, cPick: getNodeCounterShotMove(e.node) }))
      .find((x) => x.cPick);

    const counterBaseProb = counterCandEntry ? (counterCandEntry.cPick.isShCounter ? 0.44 : 0.25) : 0;
    const userCounterLvl = !origAttIsUser ? (state.tournament?.prepBonuses?.counterShotLvl || 0) : 0;
    const counterTriggerProb = counterBaseProb + ([0, 0.12, 0.24, 0.35][userCounterLvl] || 0);

    if (counterCandEntry && Math.random() < Math.min(0.85, counterTriggerProb)) {
      const counterNode = counterCandEntry.entry.node;
      const cPick = counterCandEntry.cPick;
      spendStamina(counterNode, cPick.cost);

      const counterLvlBonus = [0, 1.0, 2.0, 3.2][userCounterLvl] || 0;
      const counterDuelScore =
        calcNodeDuelScore(counterNode, defSupport, shooterNode?.player?.element) + cPick.bonus + counterLvlBonus;
      const counterWinProb = logisticWinProb(counterDuelScore, baseShotScore, -0.3, 0.22, 0.78);
      const counterSuccess = Math.random() < counterWinProb;

      const duelX = counterNode.x;
      const duelY = counterNode.y;
      pitch.ballMode = "SHOT_FLIGHT";
      pitch.carrierUid = null;
      pitch.challengerUid = counterNode.uid;
      pitch.holdBallPos = { x: duelX, y: duelY };
      pitch.lastClashMinute = st.minute;

      const cFlightMs = state.simSpeed === 1
        ? Math.round(Math.max(260, Math.min(680, 170 + Math.hypot(duelX - shooterNode.x, duelY - shooterNode.y) * 13)))
        : 65;
      startBallFlight(pitch, shooterNode.x, shooterNode.y, duelX, duelY, cFlightMs, 2.5, "SHOT", "#38bdf8");
      showNodeBadge(pitch, counterNode.uid, `🔄 Contra-Chute!`, "badge-counter", 1400, cPick.isShCounter ? "SH" : "DF");
      pitch.ticker = `${st.minute}' CONTRA-CHUTE! ${counterNode.player.name} tenta rebater ${shotInfo.label} com ${cPick.move}!`;
      syncLivePitchDOM(st);

      const applyCounterImpact = () => {
        if (counterSuccess) {
          counterNode.duelCooldown = 1.6;
          pitch.ballSide = origAttIsUser ? "opp" : "user";
          if (!origAttIsUser) {
            pitch.stats.userShots++;
            recordUserPlayerStat(pitch, counterNode, "shots", 1);
          } else {
            pitch.stats.oppShots++;
          }
          showNodeBadge(pitch, counterNode.uid, `CONTRA-CHUTE! • ${cPick.move}`, "badge-counter", 1600, "SH");
          pitch.ticker = `${st.minute}' CONTRA-CHUTE! ${counterNode.player.name} devolveu com 【${cPick.move}】!`;
          prependNarrationLine(
            st,
            "nar-shot",
            `${st.minute}' [Contra-Chute!] ${counterNode.player.name} rebateu 【${shotInfo.label}】 de ${shooterNode.player.name} de volta com 【${cPick.move}】!`,
            { name: counterNode.player.name, sprite: counterNode.player.sprite, side: counterNode.side },
            { name: shooterNode.player.name, sprite: shooterNode.player.sprite, side: shooterNode.side },
            "SH"
          );
        } else {
          counterNode.staggerTimer = 1.25;
          counterNode.duelCooldown = 1.8;
          showPitchBadge(pitch, counterNode.x, counterNode.y, "Contra-chute falhou!", "badge-shot", 850, "SH");
          prependNarrationLine(
            st,
            "nar-shot",
            `${st.minute}' [Contra-Chute Superado] ${counterNode.player.name} tentou rebater com 【${cPick.move}】, mas 【${shotInfo.label}】 de ${shooterNode.player.name} furou!`,
            { name: shooterNode.player.name, sprite: shooterNode.player.sprite, side: shooterNode.side },
            { name: counterNode.player.name, sprite: counterNode.player.sprite, side: counterNode.side },
            "SH"
          );
        }
      };

      const onCounterModalClosed = (skipRestart = false) => {
        if (counterSuccess) {
          const retAttIsUser = !origAttIsUser;
          const retAttNodes = retAttIsUser ? pitch.userNodes : pitch.oppNodes;
          const retDefNodes = retAttIsUser ? pitch.oppNodes : pitch.userNodes;
          const retGkNode = retDefNodes.find((n) => n.role === "GK") || retDefNodes[0];
          const retGoalX = retAttIsUser ? 96.8 : 3.2;
          const returnScore = Math.max(baseShotScore, counterDuelScore) + 3.2;

          return maybeChainAndResolveGk(
            counterNode,
            cPick.move,
            true,
            returnScore,
            duelX,
            duelY,
            retAttIsUser,
            retAttNodes,
            retGkNode,
            attSupport,
            retGoalX,
            false,
            { isCounter: true },
            skipRestart
          );
        }

        const weakenedScore = baseShotScore - 3.2;
        return maybeChainAndResolveGk(
          shooterNode,
          shotInfo.label,
          shotInfo.isHissatsu,
          weakenedScore,
          duelX,
          duelY,
          origAttIsUser,
          origAttNodes,
          origGkNode,
          defSupport,
          origGoalX,
          true,
          null,
          skipRestart
        );
      };

      const launchCounterModal = (skipModal = false) => {
        state.tournament.shotFlightTimer = null;
        state.tournament.pendingShotFlightFinish = null;
        if (skipModal || state.simSpeed !== 1) {
          applyCounterImpact();
          const beatOwned = onCounterModalClosed(true);
          syncLivePitchDOM(st);
          if (!beatOwned) handleMinuteEndBoundaries(st, ovrDiff);
          return;
        }
        playShotClashAndContinue(
          st,
          {
            kind: "SHOT",
            dir: origAttIsUser ? "ltr" : "rtl",
            userPlayer: origAttIsUser
              ? { name: shooterNode.player.name, sprite: resolveDynamicNodeSprite(shooterNode, pitch), roleText: "CHUTE" }
              : { name: counterNode.player.name, sprite: resolveDynamicNodeSprite(counterNode, pitch), roleText: "CONTRA-CHUTE" },
            oppPlayer: origAttIsUser
              ? { name: counterNode.player.name, sprite: resolveDynamicNodeSprite(counterNode, pitch), roleText: "CONTRA-CHUTE" }
              : { name: shooterNode.player.name, sprite: resolveDynamicNodeSprite(shooterNode, pitch), roleText: "CHUTE" },
            topMoveName: shotInfo.label,
            bottomMoveName: `Contra-Chute: ${cPick.move}`,
            bottomIcon: cPick.isShCounter ? "SH" : "DF",
            outcomePositive: counterSuccess ? !origAttIsUser : origAttIsUser,
            resultBannerText: counterSuccess ? "CONTRA-CHUTE!!" : "FUROU O CONTRA-CHUTE!"
          },
          applyCounterImpact,
          ovrDiff,
          onCounterModalClosed
        );
      };

      if (state.simSpeed !== 1) {
        launchCounterModal(true);
        return;
      }
      if (state.tournament.timerId) {
        clearInterval(state.tournament.timerId);
        state.tournament.timerId = null;
      }
      state.tournament.pendingShotFlightFinish = launchCounterModal;
      state.tournament.shotFlightTimer = setTimeout(() => {
        launchCounterModal(false);
      }, Math.max(50, cFlightMs - 30));
      return;
    }

    // 2) BLOQUEIO NORMAL DE ZAGA
    const laneBlockers = pathEnemies.filter((b) => b.node.role === "DF" && b.distShooter <= 26);
    const blockerNode = laneBlockers.length > 0 && Math.random() < 0.34 ? laneBlockers[0].node : null;

    if (!blockerNode) {
      maybeChainAndResolveGk(
        shooterNode,
        shotInfo.label,
        shotInfo.isHissatsu,
        baseShotScore,
        shooterNode.x,
        shooterNode.y,
        origAttIsUser,
        origAttNodes,
        origGkNode,
        defSupport,
        origGoalX,
        false,
        null,
        false
      );
      return;
    }

    // Etapa 1: Defensor na linha tenta bloquear o chute!
    const blockPick = pickStaminaGatedMove(blockerNode, "DF");
    const blockMoveName =
      blockPick.move || (blockPick.exhausted ? "Bloqueio sem técnica (sem energia)" : "Bloqueio de Corpo");
    spendStamina(blockerNode, blockPick.cost);

    const blockerStopScore =
      calcNodeDuelScore(blockerNode, defSupport, shooterNode?.player?.element) + blockPick.duelBonus;
    const passBlockerProb = logisticWinProb(baseShotScore, blockerStopScore, -1.6, 0.38, 0.80);
    const passedBlocker = Math.random() < passBlockerProb;

    const duelX = blockerNode.x;
    const duelY = blockerNode.y;
    pitch.ballMode = "SHOT_FLIGHT";
    pitch.carrierUid = null;
    pitch.challengerUid = blockerNode.uid;
    pitch.holdBallPos = { x: duelX, y: duelY };
    pitch.lastClashMinute = st.minute;

    const blockFlightMs = state.simSpeed === 1
      ? Math.round(Math.max(260, Math.min(680, 170 + Math.hypot(duelX - shooterNode.x, duelY - shooterNode.y) * 13)))
      : 65;
    startBallFlight(pitch, shooterNode.x, shooterNode.y, duelX, duelY, blockFlightMs, 2.6, "SHOT", "#f97316");
    showPitchBadge(pitch, shooterNode.x, shooterNode.y, shotInfo.label, "badge-shot", state.simSpeed === 1 ? 1600 : 600, "SH");
    pitch.ticker = `${st.minute}' CHUTE! ${shooterNode.player.name} (${shotInfo.label}) enfrenta bloqueio de ${blockerNode.player.name}!`;
    syncLivePitchDOM(st);

    const applyBlockerImpact = () => {
      if (!passedBlocker) {
        pitch.ballSide = origAttIsUser ? "opp" : "user";
        pitch.ballMode = "CARRIED";
        pitch.carrierUid = blockerNode.uid;
        pitch.challengerUid = null;
        pitch.holdBallPos = null;
        blockerNode.carryTime = 0;
        blockerNode.decisionTimer = 0.35;
        blockerNode.duelCooldown = 1.8;
        pitch.ballFlight = null;
        pitch.ballX = blockerNode.x + (blockerNode.side === "user" ? 1.9 : -1.9);
        pitch.ballY = blockerNode.y + 1.0;
        pitch.passTrail = null;
        if (state.simSpeed !== 1) triggerSaveImplosion(pitch, duelX, duelY);
        showPitchBadge(pitch, blockerNode.x, blockerNode.y, blockMoveName, "badge-steal", 1000, "DF");

        if (!origAttIsUser) {
          pitch.stats.userSteals++;
          pitch.stats.userBlocks = (pitch.stats.userBlocks || 0) + 1;
          recordUserPlayerStat(pitch, blockerNode, "blocks", 1);
          recordUserPlayerStat(pitch, blockerNode, "steals", 1);
        }
        pitch.ticker = `${st.minute}' ${blockerNode.player.name} bloqueou o chute de ${shooterNode.player.name}!`;
        prependNarrationLine(
          st,
          "nar-steal",
          `${st.minute}' [Bloqueio da Zaga] ${blockerNode.player.name} entrou na frente com 【${blockMoveName}】 e bloqueou 【${shotInfo.label}】 de ${shooterNode.player.name}!`,
          { name: blockerNode.player.name, sprite: blockerNode.player.sprite, side: blockerNode.side },
          { name: shooterNode.player.name, sprite: shooterNode.player.sprite, side: shooterNode.side },
          "DF"
        );
      } else {
        blockerNode.staggerTimer = 1.25;
        blockerNode.duelCooldown = 1.8;
        showPitchBadge(pitch, blockerNode.x, blockerNode.y, "Desviou (-Força)", "badge-shot", 850, "DF");
        pitch.ticker = `${st.minute}' ${shooterNode.player.name} furou o bloqueio de ${blockerNode.player.name} — bola vai para o gol!`;
        prependNarrationLine(
          st,
          "nar-shot",
          `${st.minute}' [Bloqueio Parcial] ${blockerNode.player.name} tentou travar 【${shotInfo.label}】 com 【${blockMoveName}】 — o chute perdeu força, mas passou para ${origGkNode.player.name}!`,
          { name: shooterNode.player.name, sprite: shooterNode.player.sprite, side: shooterNode.side },
          { name: blockerNode.player.name, sprite: blockerNode.player.sprite, side: blockerNode.side },
          "DF"
        );
      }
    };

    const onBlockerModalClosed = (skipRestart = false) => {
      if (!passedBlocker) {
        if (state.simSpeed === 1) {
          triggerSaveImplosion(pitch, pitch.ballX, pitch.ballY);
        }
        showNodeBadge(pitch, blockerNode.uid, `Bloqueou • ${blockMoveName}`, "badge-steal", 1100, "DF");
        if (skipRestart || state.simSpeed !== 1) return false;
        pauseForPitchBeat(st, "", "", 780, ovrDiff, null);
        return true;
      }

      // Chute passou pelo defensor com força reduzida -> pode virar Chain Shot ou ir direto ao goleiro!
      const weakenedScore = baseShotScore - 5.2;
      return maybeChainAndResolveGk(
        shooterNode,
        shotInfo.label,
        shotInfo.isHissatsu,
        weakenedScore,
        duelX,
        duelY,
        origAttIsUser,
        origAttNodes,
        origGkNode,
        defSupport,
        origGoalX,
        true,
        null,
        skipRestart
      );
    };

    const launchBlockerModal = (skipModal = false) => {
      state.tournament.shotFlightTimer = null;
      state.tournament.pendingShotFlightFinish = null;
      if (skipModal || state.simSpeed !== 1) {
        applyBlockerImpact();
        const beatOwned = onBlockerModalClosed(true);
        syncLivePitchDOM(st);
        if (!beatOwned) handleMinuteEndBoundaries(st, ovrDiff);
        return;
      }
      playShotClashAndContinue(
        st,
        {
          kind: "SHOT",
          dir: origAttIsUser ? "ltr" : "rtl",
          userPlayer: origAttIsUser
            ? { name: shooterNode.player.name, sprite: resolveDynamicNodeSprite(shooterNode, pitch), roleText: "CHUTE" }
            : { name: blockerNode.player.name, sprite: resolveDynamicNodeSprite(blockerNode, pitch), roleText: "ZAGA • BLOQUEIO" },
          oppPlayer: origAttIsUser
            ? { name: blockerNode.player.name, sprite: resolveDynamicNodeSprite(blockerNode, pitch), roleText: "ZAGA • BLOQUEIO" }
            : { name: shooterNode.player.name, sprite: resolveDynamicNodeSprite(shooterNode, pitch), roleText: "CHUTE" },
          topMoveName: shotInfo.label,
          bottomMoveName: blockMoveName,
          bottomIcon: "DF",
          outcomePositive: passedBlocker ? origAttIsUser : !origAttIsUser,
          resultBannerText: passedBlocker ? "PASSOU • PERDEU FORÇA!" : "BLOQUEADO PELA ZAGA!"
        },
        applyBlockerImpact,
        ovrDiff,
        onBlockerModalClosed
      );
    };

    if (state.simSpeed !== 1) {
      launchBlockerModal(true);
      return;
    }
    if (state.tournament.timerId) {
      clearInterval(state.tournament.timerId);
      state.tournament.timerId = null;
    }
    state.tournament.pendingShotFlightFinish = launchBlockerModal;
    state.tournament.shotFlightTimer = setTimeout(() => {
      launchBlockerModal(false);
    }, Math.max(50, blockFlightMs - 30));
  }

  function stepContinuousPhysics(st, pitch, dt) {
    if (!st || !pitch || st.finished || !st.running) return;
    ensureMatchSupport(st, pitch);
    const { userTeamSupport, oppTeamSupport, ovrDiff } = pitch.matchSupport;

    pitch.simTime += dt;
    pitch.minuteFloat += dt * 1.45;

    const allNodes = [...pitch.userNodes, ...pitch.oppNodes];
    allNodes.forEach((n) => {
      if (n.duelCooldown > 0) n.duelCooldown = Math.max(0, n.duelCooldown - dt);
      if (n.staggerTimer > 0) n.staggerTimer = Math.max(0, n.staggerTimer - dt);
    });

    // Avança minutos do relógio e recupera energia fora da posse
    const targetMin = Math.floor(pitch.minuteFloat);
    if (targetMin > st.minute) {
      while (st.minute < targetMin && !st.finished) {
        st.minute++;
        const clockEl = document.getElementById("live-clock-text");
        const barEl = document.getElementById("live-bar-fill");
        if (clockEl) clockEl.textContent = `${st.minute}'`;
        if (barEl) {
          const pct = Math.min(100, Math.round((st.minute / st.maxMinute) * 100));
          barEl.style.width = `${pct}%`;
        }
        allNodes.forEach((n) => {
          if (n.uid !== pitch.carrierUid) {
            // Recuperação bem leve por minuto: exige administrar intensidade e habilidades em campo
            const regen = n.role === "GK" ? 0.55 : 0.32;
            n.stamina = Math.min(100, n.stamina + regen);
          }
        });
        if (!pitch.is5v5) {
          const tac = getTactics();
          const hasLateRes = Boolean(state.tournament?.prepBonuses?.lateMatchNoStaminaLoss && st.minute >= 75);
          if (!hasLateRes) {
            const perMinDrain = tac.intensity === "high" ? 0.54 : tac.intensity === "low" ? 0.15 : 0.31;
            const stamMul = state.tournament?.prepBonuses?.staminaMul || 1;
            adjustTeamEnergy(-(perMinDrain * stamMul));
          }
          const eVal = Math.round(getTeamEnergy());
          const eBand = getTeamEnergyBand(eVal);
          const pillEl = document.getElementById("live-team-energy-pill");
          const fillEl = document.getElementById("live-team-energy-fill");
          if (pillEl) {
            pillEl.textContent = `${eVal}% (${eBand.label})`;
            pillEl.style.color = eBand.color;
          }
          if (fillEl) {
            fillEl.style.width = `${eVal}%`;
            fillEl.style.background = eBand.color;
          }
        }
        if (pitch.ballSide === "user") pitch.stats.userTicks++;
        else pitch.stats.oppTicks++;

        syncLivePitchDOM(st);
        if (handleMinuteEndBoundaries(st, ovrDiff)) return;
      }
    }

    // Steering + integração suave de velocidade e separação entre colegas (ZERO teleporte!)
    recomputePitchTargets(pitch);
    const steerNodes = (list) => {
      list.forEach((node) => {
        const dx = node.targetX - node.x;
        const dy = node.targetY - node.y;
        const dist = Math.hypot(dx, dy);
        const staminaFactor = node.stamina < 45 ? 0.9 : 1.0;
        const staggerFactor = node.staggerTimer > 0 ? 0.42 : 1.0;
        const speedLimit = node.maxSpeed * (node.targetSprint || 0.9) * staminaFactor * staggerFactor;
        const arriveScale = dist < 3.0 ? dist / 3.0 : 1.0;

        let desVx = dist > 0.05 ? (dx / dist) * speedLimit * arriveScale : 0;
        let desVy = dist > 0.05 ? (dy / dist) * speedLimit * arriveScale : 0;

        // Separação suave entre companheiros para aproveitar o campo amplo sem amontoar
        if (node.role !== "GK") {
          list.forEach((other) => {
            if (other.uid === node.uid || other.role === "GK") return;
            const rx = node.x - other.x;
            const ry = node.y - other.y;
            const rDist = Math.hypot(rx, ry);
            if (rDist > 0.05 && rDist < 9.2) {
              const push = ((9.2 - rDist) / 9.2) * 13.5;
              desVx += (rx / rDist) * push;
              desVy += (ry / rDist) * push;
            }
          });
        }

        const accel = Math.min(1, dt * 8.2);
        node.vx += (desVx - node.vx) * accel;
        node.vy += (desVy - node.vy) * accel;
        node.x += node.vx * dt;
        node.y += node.vy * dt;

        const minX = node.role === "GK" ? 4 : 8;
        const maxX = node.role === "GK" ? 96 : 92;
        node.x = Math.max(minX, Math.min(maxX, node.x));
        node.y = Math.max(9, Math.min(91, node.y));
      });
    };
    steerNodes(pitch.userNodes);
    steerNodes(pitch.oppNodes);

    const attIsUser = pitch.ballSide === "user";
    const attNodes = attIsUser ? pitch.userNodes : pitch.oppNodes;
    const defNodes = attIsUser ? pitch.oppNodes : pitch.userNodes;
    const attSupport = attIsUser ? userTeamSupport : oppTeamSupport;
    const defSupport = attIsUser ? oppTeamSupport : userTeamSupport;

    // Watchdog anti-travamento: se a física rodar sem modal ativo e a bola ficar fora de CARRIED/PASS_FLIGHT, devolve posse ao goleiro defensor
    if (pitch.ballMode !== "CARRIED" && pitch.ballMode !== "PASS_FLIGHT") {
      pitch._stuckBallTime = (pitch._stuckBallTime || 0) + dt;
      if (pitch._stuckBallTime > 0.85) {
        pitch._stuckBallTime = 0;
        const recoveryGk = defNodes.find((n) => n.role === "GK") || defNodes[0];
        if (recoveryGk) {
          pitch.ballSide = recoveryGk.side;
          pitch.ballMode = "CARRIED";
          pitch.carrierUid = recoveryGk.uid;
          pitch.challengerUid = null;
          pitch.holdBallPos = null;
          pitch.ballFlight = null;
          pitch.passState = null;
          recoveryGk.carryTime = 0;
          recoveryGk.decisionTimer = 0.35;
          pitch.ballX = recoveryGk.x + (recoveryGk.side === "user" ? 1.8 : -1.8);
          pitch.ballY = recoveryGk.y;
        }
      }
      return;
    }
    pitch._stuckBallTime = 0;

    // FASE A: BOLA NO PÉ DE UM PORTADOR EM MOVIMENTO CONTÍNUO
    if (pitch.ballMode === "CARRIED") {
      const carrier = findPitchNode(pitch, pitch.carrierUid) || attNodes[0];
      if (!carrier) return;

      carrier.carryTime += dt;
      carrier.decisionTimer -= dt;

      const weave = Math.sin(pitch.simTime * 8.5) * 0.42;
      pitch.ballX = carrier.x + (attIsUser ? 1.8 : -1.8);
      pitch.ballY = carrier.y + 0.9 + weave;

      // 1) Checa contato físico real para embate Drible (OF) vs Desarme (DF) ou Tabela de Escape!
      if (carrier.role !== "GK" && !pitch.justKickedOff && carrier.duelCooldown <= 0) {
        let closestDef = null;
        let closestDist = 999;
        defNodes.forEach((d) => {
          if (d.role === "GK" || d.staggerTimer > 0 || d.duelCooldown > 0) return;
          const dist = visualPitchDist(d.x, d.y, carrier.x, carrier.y);
          if (dist < closestDist) {
            closestDist = dist;
            closestDef = d;
          }
        });

        // Quando o marcador se aproxima, avalia diferencial de velocidade (Arranque / Recuperação Veloz), Tabela ou Duelo
        if (closestDef && carrier.carryTime >= 0.25) {
          const carrierSpd = carrier.spd || calcPlayerSpeedStat(carrier.player, carrier.effOvr);
          const defSpd = closestDef.spd || calcPlayerSpeedStat(closestDef.player, closestDef.effOvr);
          const spdDiff = carrierSpd - defSpd;

          // 1. ⚡ Arranque Veloz: Atacante com vantagem de velocidade (spdDiff >= +6) deixa o marcador na poeira sem duelo físico
          if (spdDiff >= 6 && closestDist <= 5.8 && closestDist > 3.25) {
            const burstChance = Math.min(0.68, 0.35 + (spdDiff - 6) * 0.04);
            if (Math.random() < burstChance) {
              spendStamina(carrier, 4.5);
              carrier.duelCooldown = 1.35;
              closestDef.duelCooldown = 2.1;
              closestDef.staggerTimer = 0.65;
              const dir = attIsUser ? 1 : -1;
              const startX = carrier.x;
              const startY = carrier.y;
              const dodgeSign = startY >= closestDef.y ? 1 : -1;
              const dashToX = Math.max(10, Math.min(90, startX + dir * 11.5));
              const dashToY = Math.max(12, Math.min(88, startY + dodgeSign * 4.5));
              const dashMs = state.simSpeed === 4 ? 90 : state.simSpeed === 2 ? 180 : 360;
              pitch.dashFx = {
                uid: carrier.uid,
                fromX: startX,
                fromY: startY,
                toX: dashToX,
                toY: dashToY,
                start: performance.now(),
                duration: dashMs
              };
              pitch.passTrail = {
                fromX: startX,
                fromY: startY,
                toX: dashToX,
                toY: dashToY,
                curX: startX,
                curY: startY,
                color: "#38bdf8",
                start: performance.now(),
                flightDuration: dashMs,
                fadeUntil: performance.now() + dashMs + 450
              };
              carrier.x = dashToX;
              carrier.y = dashToY;
              pitch.ballX = dashToX;
              pitch.ballY = dashToY;
              carrier.carryTime = 0.1;
              carrier.decisionTimer = 0.3;
              showNodeBadge(pitch, carrier.uid, `⚡ Arranque (+${spdDiff} VEL)`, "badge-dribble", 1500, "OF");
              pitch.ticker = `${st.minute}' Arranque Veloz: ${carrier.player.name} (VEL ${carrierSpd}) deixou ${closestDef.player.name} (VEL ${defSpd}) para trás!`;
              prependNarrationLine(
                st,
                "nar-dribble",
                `${st.minute}' ⚡ [Arranque Veloz] ${carrier.player.name} (VEL ${carrierSpd}) acelerou fundo e deixou ${closestDef.player.name} (VEL ${defSpd}) para trás na velocidade pura! (+${spdDiff} VEL)`,
                { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side },
                { name: closestDef.player.name, sprite: closestDef.player.sprite, side: closestDef.side },
                "OF"
              );
              if (attIsUser) {
                pitch.stats.userDribblesOk++;
                pitch.stats.userDribblesTry++;
                recordUserPlayerStat(pitch, carrier, "dribblesOk", 1);
                recordUserPlayerStat(pitch, carrier, "dribblesTry", 1);
              }
              syncLivePitchDOM(st);
              pauseForPitchBeat(st, "", "", 750, ovrDiff);
              return;
            }
          }

          // 2. ⚡ Recuperação Veloz: Marcador com vantagem de velocidade (spdDiff <= -6) engole a distância na corrida
          if (spdDiff <= -6 && closestDist <= 5.0 && closestDist > 2.8) {
            const recoveryChance = Math.min(0.65, 0.32 + (Math.abs(spdDiff) - 6) * 0.04);
            if (Math.random() < recoveryChance) {
              spendStamina(closestDef, 4.5);
              closestDef.duelCooldown = 1.35;
              carrier.duelCooldown = 2.1;
              carrier.staggerTimer = 0.65;
              pitch.ballSide = closestDef.side;
              pitch.ballMode = "CARRIED";
              pitch.carrierUid = closestDef.uid;
              pitch.challengerUid = null;
              pitch.holdBallPos = null;
              pitch.lastAssistCandidate = null;
              pitch.lastPasserUid = null;
              pitch.lastAction = "STEAL";
              pitch.teamConsecutivePasses = 0;
              closestDef.carryTime = 0.1;
              closestDef.decisionTimer = 0.32;
              pitch.ballX = closestDef.x + (closestDef.side === "user" ? 1.9 : -1.9);
              pitch.ballY = closestDef.y + 1.0;
              triggerStealShockwave(pitch, closestDef.x, closestDef.y, closestDef.uid, carrier.uid);
              showNodeBadge(pitch, closestDef.uid, `⚡ Recuperação (+${Math.abs(spdDiff)} VEL)`, "badge-steal", 1500, "DF");
              showNodeBadge(pitch, carrier.uid, "Alcançado!", "badge-lost", 1500);
              pitch.ticker = `${st.minute}' Recuperação Veloz: ${closestDef.player.name} (VEL ${defSpd}) desarmou ${carrier.player.name} (VEL ${carrierSpd}) na corrida!`;
              prependNarrationLine(
                st,
                "nar-steal",
                `${st.minute}' ⚡ [Recuperação Veloz] ${closestDef.player.name} (VEL ${defSpd}) engoliu a distância na corrida e desarmou ${carrier.player.name} (VEL ${carrierSpd}) com velocidade pura! (+${Math.abs(spdDiff)} VEL)`,
                { name: closestDef.player.name, sprite: closestDef.player.sprite, side: closestDef.side },
                { name: carrier.player.name, sprite: carrier.player.sprite, side: carrier.side },
                "DF"
              );
              if (closestDef.side === "user") {
                pitch.stats.userSteals++;
                recordUserPlayerStat(pitch, closestDef, "steals", 1);
              }
              syncLivePitchDOM(st);
              pauseForPitchBeat(st, "", "", 750, ovrDiff);
              return;
            }
          }

          // 3) Quando o marcador se aproxima perigosamente (entre 3.4 e 6.2 unidades visuais),
          // jogadores técnicos têm chance de TABELAR de primeira sem confronto!
          if (closestDist <= 6.2 && closestDist > 3.35 && carrier.carryTime >= 0.35) {
            const passReceiver = pickPassReceiver(attNodes, defNodes, carrier, false, pitch);
            const hasTeammateNear = passReceiver && Math.hypot(passReceiver.x - carrier.x, passReceiver.y - carrier.y) <= 32;
            const skillBonus = carrier.effOvr >= 80 ? 0.36 : 0.22;
            if (hasTeammateNear && Math.random() < skillBonus) {
              carrier.duelCooldown = 1.4;
              closestDef.duelCooldown = 1.4;
              launchContinuousPass(st, pitch, carrier, attNodes, defNodes, true, false, true);
              return;
            }
          }

          if (closestDist <= 3.35) {
            resolvePhysicalDribbleClash(st, pitch, carrier, closestDef, attSupport, defSupport, ovrDiff);
            return;
          }
        }
      }

      // 2) Decisão tática contínua do portador (Passe, Condução, Long Shot ou Chute)
      if (carrier.decisionTimer <= 0) {
        const rawPwrDiff = pitch.matchSupport?.powerDiff || 0;
        const sidePwrDiff = attIsUser ? rawPwrDiff : -rawPwrDiff;
        // Time com Poder muito superior pensa e executa jogadas até 30% mais rápido!
        const tempoFactor = sidePwrDiff >= 250 ? 0.72 : sidePwrDiff <= -250 ? 1.18 : 1.0;
        carrier.decisionTimer = (0.22 + Math.random() * 0.13) * tempoFactor;

        if (pitch.justKickedOff) {
          pitch.justKickedOff = false;
          launchContinuousPass(st, pitch, carrier, attNodes, defNodes, false, true);
          return;
        }

        if (carrier.role === "GK") {
          if (carrier.carryTime >= 0.45) {
            launchContinuousPass(st, pitch, carrier, attNodes, defNodes, true, true);
          }
          return;
        }

        const oppGoalX = attIsUser ? 96 : 4;
        const goalDist = Math.hypot(carrier.x - oppGoalX, carrier.y - 50);
        const inPenaltyX = attIsUser ? carrier.x >= 72 : carrier.x <= 28;
        const centralLane = carrier.y >= 24 && carrier.y <= 76;
        const inFinalThird = attIsUser ? carrier.x >= 58 : carrier.x <= 42;

        const oppGk = defNodes.find((d) => d.role === "GK");
        const oppGkElem = oppGk?.player?.element;
        const carrierElem = carrier.player?.element;
        const isCarrierDisadvVsGk = Boolean(carrierElem && oppGkElem && ELEMENT_ADVANTAGE[oppGkElem] === carrierElem);
        const hasBetterElemTeammate = attNodes.some((n) => {
          if (n.uid === carrier.uid || n.role === "GK") return false;
          const fwd = attIsUser ? n.x >= 55 : n.x <= 45;
          const el = n.player?.element;
          return fwd && el && oppGkElem && ELEMENT_ADVANTAGE[oppGkElem] !== el;
        });

        let nearestDefDist = 99;
        let blockingDefs = 0;
        defNodes.forEach((d) => {
          if (d.role === "GK") return;
          const dd = visualPitchDist(d.x, d.y, carrier.x, carrier.y);
          if (dd < nearestDefDist) nearestDefDist = dd;
          const isAhead = attIsUser ? d.x >= carrier.x - 1 : d.x <= carrier.x + 1;
          if (isAhead && Math.abs(d.y - carrier.y) <= 13 && Math.abs(d.x - carrier.x) <= 16) blockingDefs++;
        });

        const roll = Math.random();

        // LONG SHOT: se o jogador tiver técnica de Chute Longo (ex: Impulso Tsunami, Excalibur, Meteoro Cortante)
        const longMove = getNodeLongShotMove(carrier);
        const inLongZone = attIsUser ? (carrier.x >= 28 && carrier.x < 68) : (carrier.x <= 72 && carrier.x > 32);
        if (
          longMove &&
          inLongZone &&
          carrier.stamina >= 50 &&
          carrier.carryTime >= 0.45 &&
          nearestDefDist >= 4.2 &&
          !isCarrierDisadvVsGk &&
          roll < (carrier.role === "FW" || carrier.role === "MF" ? 0.24 : 0.14)
        ) {
          launchContinuousShot(st, pitch, carrier, defNodes, attSupport, defSupport, ovrDiff, attNodes, { forceLongShot: true });
          return;
        }

        const mustShoot =
          (inPenaltyX && centralLane) ||
          goalDist <= 22 ||
          (inFinalThird && blockingDefs === 0 && goalDist <= 30 && roll < (sidePwrDiff >= 200 ? 0.74 : 0.56)) ||
          (effRoleOrPos(carrier) === "FW" && goalDist <= 32 && roll < (sidePwrDiff >= 200 ? 0.52 : 0.34));

        if (mustShoot) {
          // Inteligência elemental: em desvantagem contra o GK, tenta acionar um colega antes de forçar o chute
          if (isCarrierDisadvVsGk && hasBetterElemTeammate && goalDist > 13 && roll < 0.50) {
            launchContinuousPass(st, pitch, carrier, attNodes, defNodes, true, false);
            return;
          }
          launchContinuousShot(st, pitch, carrier, defNodes, attSupport, defSupport, ovrDiff, attNodes);
          return;
        }

        // Procura enfiada de bola / passe no espaço vazio se houver companheiro bem desmarcado em posição legal
        const oppOutfieldDefs = defNodes.filter((d) => d.role !== "GK");
        const oppDefLineX = oppOutfieldDefs.length > 0
          ? (attIsUser ? Math.max(...oppOutfieldDefs.map((d) => d.x)) : Math.min(...oppOutfieldDefs.map((d) => d.x)))
          : (attIsUser ? 84 : 16);

        const throughCandidate = attNodes.find((n) => {
          if (n.uid === carrier.uid || n.role === "GK") return false;
          const fwdGain = attIsUser ? (n.x - carrier.x) : (carrier.x - n.x);
          const openGrass = attIsUser ? (oppDefLineX - n.x) : (n.x - oppDefLineX);
          const isLegal = attIsUser
            ? (n.x <= 50 || n.x <= carrier.x + 0.6 || n.x <= oppDefLineX + 0.6)
            : (n.x >= 50 || n.x >= carrier.x - 0.6 || n.x >= oppDefLineX - 0.6);
          return isLegal && fwdGain >= 3 && openGrass >= 5;
        });

        if (throughCandidate && carrier.carryTime >= 0.38 && nearestDefDist >= 3.6 && roll < 0.44) {
          launchContinuousPass(st, pitch, carrier, attNodes, defNodes, true, false, false, {
            targetReceiver: throughCandidate,
            forceSpacePass: true
          });
          return;
        }

        const tiredPass = carrier.stamina < 45 && roll < 0.65;
        const pressPass = nearestDefDist < 7.8 && roll < 0.50;
        const flowPass = carrier.carryTime >= 1.15 && roll < (carrier.role === "DF" ? 0.64 : 0.40);
        const forceRecycle = carrier.carryTime >= 2.8;

        if (tiredPass || pressPass || flowPass || forceRecycle) {
          const strictFwd = inFinalThird || carrier.role === "DF";
          launchContinuousPass(st, pitch, carrier, attNodes, defNodes, strictFwd, false);
          return;
        }
      }
      return;
    }

    // FASE B: BOLA VIAJANDO NO PASSE (CORRE PARA INTERCEPTAÇÃO FÍSICA OU RECEPÇÃO)
    if (pitch.ballMode === "PASS_FLIGHT" && pitch.passState) {
      const ps = pitch.passState;
      const receiver = findPitchNode(pitch, ps.receiverUid);
      // Para passes normais, a bola ajusta sutilmente aos pés do recebedor;
      // Para passes em profundidade / no espaço / tabela, a bola vai exatamente para o ponto vazio projetado!
      if (receiver && !ps.isThroughBall && !ps.isOneTwoPass) {
        ps.toX = ps.toX * 0.85 + receiver.x * 0.15;
        ps.toY = ps.toY * 0.85 + receiver.y * 0.15;
      }
      ps.elapsed += dt;
      ps.progress = Math.min(1, ps.elapsed / ps.duration);
      pitch.ballX = ps.fromX + (ps.toX - ps.fromX) * ps.progress;
      pitch.ballY = ps.fromY + (ps.toY - ps.fromY) * ps.progress;

      // Interceptação física apenas se um marcador realmente cruzar a trajetória!
      if (!ps.isSafeProtectedPass && ps.progress >= 0.18 && ps.progress <= 0.88) {
        // Interceptação física: exige proximidade real no trajeto e depende da força do passe vs defensor!
        const interceptor = defNodes.find(
          (d) =>
            d.role !== "GK" &&
            d.staggerTimer <= 0 &&
            d.duelCooldown <= 0 &&
            visualPitchDist(d.x, d.y, pitch.ballX, pitch.ballY) <= 2.1
        );
        if (interceptor) {
          interceptor.duelCooldown = 2.0;
          const passScore = calcNodeDuelScore(ps.passerNode, attSupport, interceptor?.player?.element);
          const defScore = calcNodeDuelScore(interceptor, defSupport, ps.passerNode?.player?.element);
          
          // Se o passador for muito superior ao defensor em OVR/Passe, a bola passa com força e o defensor fura!
          const passerOvr = ps.passerNode?.effOvr || 75;
          const defOvr = interceptor.effOvr || 75;
          const ovrAdvantage = passerOvr - defOvr;

          // Se o passe vem de um craque contra um cara mais fraco (ex: 88 vs 76), a interceptação falha quase sempre
          const powerWhiffChance = ovrAdvantage >= 6 ? Math.min(0.72, 0.35 + (ovrAdvantage - 6) * 0.04) : 0.08;
          
          // Probabilidade base de interceptação com teto mais baixo (máximo 42%, caindo se passador for superior)
          const rawSuccessProb = Math.max(0.06, Math.min(0.42, 0.28 + (defScore - passScore) * 0.022));
          let finalInterceptProb = Math.random() < powerWhiffChance ? 0 : rawSuccessProb;
          if (attIsUser && finalInterceptProb > 0) {
            const pbLvl = state.tournament?.prepBonuses?.passBypassLvl || 0;
            if (pbLvl > 0) {
              const mult = [1, 0.85, 0.72, 0.60][pbLvl] || 0.60;
              finalInterceptProb *= mult;
            }
          }

          if (Math.random() < finalInterceptProb) {
            spendStamina(interceptor, 4);

            pitch.ballSide = attIsUser ? "opp" : "user";
            pitch.ballMode = "CARRIED";
            pitch.carrierUid = interceptor.uid;
            pitch.challengerUid = null;
            pitch.passState = null;
            pitch.lastAssistCandidate = null;
            pitch.lastPasserUid = null;
            pitch.lastAction = "STEAL";
            pitch.teamConsecutivePasses = 0;
            interceptor.carryTime = 0;
            interceptor.decisionTimer = 0.25;
            pitch.ballX = interceptor.x + (interceptor.side === "user" ? 1.9 : -1.9);
            pitch.ballY = interceptor.y + 1.0;

            if (ps.passerNode) showNodeBadge(pitch, ps.passerNode.uid, "Interceptado", "badge-lost", 1450);
            showNodeBadge(pitch, interceptor.uid, "Interceptou", "badge-steal", 1450, "BALL");
            if (!attIsUser) {
              pitch.stats.userSteals++;
              recordUserPlayerStat(pitch, interceptor, "steals", 1);
            }
            pitch.ticker = `${st.minute}' ${interceptor.player.name} interceptou o passe de ${ps.passerNode?.player?.name || ""}!`;
            prependNarrationLine(
              st,
              "nar-steal",
              `${st.minute}' [Interceptação] ${interceptor.player.name} interceptou o passe de ${ps.passerNode?.player?.name || ""}!`,
              { name: interceptor.player.name, sprite: interceptor.player.sprite, side: interceptor.side },
              ps.passerNode ? { name: ps.passerNode.player.name, sprite: ps.passerNode.player.sprite, side: ps.passerNode.side } : null,
              "BALL"
            );
            syncLivePitchDOM(st);
            pauseForPitchBeat(st, "", "", 950, ovrDiff);
            return;
          } else {
            // Defensor tentou esticar o pé mas o passe forte passou direto!
            showNodeBadge(pitch, interceptor.uid, "Passe Forte!", "badge-lost", 1000);
          }
        }
      }

      const catchDist = (ps.isThroughBall || ps.isOneTwoPass) ? 3.4 : 2.4;
      if (ps.progress >= 1 || (receiver && ps.progress >= 0.38 && Math.hypot(receiver.x - pitch.ballX, receiver.y - pitch.ballY) <= catchDist)) {
        const catcher = receiver || attNodes[0];

        // Se o recebedor partiu de posição de impedimento no momento do passe, o juiz apita! (Apenas no 11x11, nunca no 5x5)
        if (ps.wasOffsideAtPassTime && !pitch.is5v5) {
          const foulX = Math.max(14, Math.min(86, catcher.x));
          const foulY = Math.max(16, Math.min(84, catcher.y));
          const nonGkDefs = defNodes.filter((d) => d.role !== "GK");
          const restartDef =
            nonGkDefs.length > 0
              ? nonGkDefs.slice().sort((a, b) => Math.hypot(a.x - foulX, a.y - foulY) - Math.hypot(b.x - foulX, b.y - foulY))[0]
              : defNodes[0];

          pitch.ballSide = attIsUser ? "opp" : "user";
          pitch.ballMode = "CARRIED";
          pitch.carrierUid = restartDef.uid;
          pitch.challengerUid = null;
          pitch.holdBallPos = null;
          pitch.ballFlight = null;
          pitch.passTrail = null;
          pitch.passState = null;
          pitch.lastAssistCandidate = null;
          pitch.lastPasserUid = null;
          pitch.teamConsecutivePasses = 0;
          pitch.justKickedOff = true;
          restartDef.carryTime = 0;
          restartDef.decisionTimer = 0.35;

          pitch.ballX = foulX;
          pitch.ballY = foulY;

          // Reestruturação tática animada: ambos os times se reorganizam em campo antes de bater o tiro livre indireto!
          const now = performance.now();
          const tweenDur = state.simSpeed === 1 ? 950 : 180;
          const defSideIsUser = restartDef.side === "user";
          const reorganizeMoves = [];
          pitch.pushTweens = [];

          [...pitch.userNodes, ...pitch.oppNodes].forEach((n) => {
            n.vx = 0;
            n.vy = 0;
            n.duelCooldown = 0.9;
            n.staggerTimer = 0;
            let toX = n.x;
            let toY = n.y;

            if (n.uid === restartDef.uid) {
              toX = foulX;
              toY = foulY;
            } else if (n.role === "GK") {
              toX = n.baseX;
              toY = 50;
            } else if (n.side === restartDef.side) {
              toX = defSideIsUser
                ? Math.min(80, Math.max(14, n.baseX + 5))
                : Math.max(20, Math.min(86, n.baseX - 5));
              toY = n.baseY;
            } else {
              // Time infrator recompõe inteiro para o seu campo / atrás da linha da bola
              toX = defSideIsUser
                ? Math.max(Math.min(88, foulX + 8), Math.min(88, n.baseX + 4))
                : Math.min(Math.max(12, foulX - 8), Math.max(12, n.baseX - 4));
              toY = n.baseY;
            }

            reorganizeMoves.push({ node: n, toX, toY });
            if (state.simSpeed === 1) {
              pitch.pushTweens.push({
                node: n,
                fromX: n.x,
                fromY: n.y,
                toX,
                toY,
                start: now,
                duration: tweenDur
              });
            } else {
              n.x = toX;
              n.y = toY;
              n.targetX = toX;
              n.targetY = toY;
            }
          });

          const applyReorganizedCoords = () => {
            reorganizeMoves.forEach(({ node, toX, toY }) => {
              node.x = toX;
              node.y = toY;
              node.targetX = toX;
              node.targetY = toY;
              node.vx = 0;
              node.vy = 0;
            });
            pitch.ballX = foulX + (defSideIsUser ? 1.6 : -1.6);
            pitch.ballY = foulY;
          };

          showNodeBadge(pitch, catcher.uid, "🚩 Impedimento!", "badge-lost", 1700);
          showPitchBadge(pitch, foulX, foulY, "IMPEDIMENTO", "badge-lost", 1350);
          prependNarrationLine(
            st,
            "nar-steal",
            `${st.minute}' [Impedimento] O árbitro paralisa o lance! ${catcher.player.name} estava adiantado. Os times se reestruturam antes da cobrança.`,
            { name: catcher.player.name, sprite: catcher.player.sprite, side: catcher.side },
            { name: restartDef.player.name, sprite: restartDef.player.sprite, side: restartDef.side },
            "BALL"
          );
          pitch.ticker = `${st.minute}' 🚩 Impedimento contra ${catcher.player.name}! Times se reestruturando para a cobrança...`;
          syncLivePitchDOM(st);
          pauseForPitchBeat(st, "", "", 1250, ovrDiff, applyReorganizedCoords);
          return;
        }

        if (attIsUser && !ps.isGkOutlet) {
          pitch.stats.userPassesOk++;
          if (ps.passerNode) recordUserPlayerStat(pitch, ps.passerNode, "passesOk", 1);
        }
        // Passes completos dão um respiro leve no fôlego do time em campo
        if (!ps.isGkOutlet) {
          const teamList = attIsUser ? pitch.userNodes : pitch.oppNodes;
          (teamList || []).forEach((n) => {
            if (n.uid === catcher.uid) {
              n.stamina = Math.min(100, n.stamina + 1.8);
            } else {
              n.stamina = Math.min(100, n.stamina + 0.45);
            }
          });
        }
        pitch.lastAssistCandidate = ps.isGkOutlet
          ? null
          : { passerUid: ps.passerUid, receiverUid: catcher.uid, side: catcher.side };
        pitch.lastPasserUid = ps.passerUid;
        pitch.ballMode = "CARRIED";
        pitch.carrierUid = catcher.uid;
        pitch.passState = null;
        catcher.carryTime = 0;
        catcher.decisionTimer = ps.isOneTwoPass ? 0.05 : 0.22;
        pitch.ballX = catcher.x + (catcher.side === "user" ? 1.8 : -1.8);
        pitch.ballY = catcher.y + 1.0;

        // Se veio de uma tabela rápida (1-2), o receptor devolve DE PRIMEIRA mais à frente no espaço para o passador correr e pegar!
        if (ps.isOneTwoPass && ps.passerNode && Math.random() < 0.78) {
          const runner = ps.passerNode;
          const runnerFwd = attIsUser ? runner.x > catcher.x - 4 : runner.x < catcher.x + 4;
          if (runnerFwd && Math.hypot(runner.x - catcher.x, runner.y - catcher.y) <= 32) {
            catcher.duelCooldown = 1.0;
            launchContinuousPass(st, pitch, catcher, attNodes, defNodes, true, false, false, {
              targetReceiver: runner,
              forceSpacePass: true,
              isReturnOneTwo: true
            });
            return;
          }
        }
        syncLivePitchDOM(st);
      }
    }
  }

  function effRoleOrPos(node) {
    return getEffectiveCarrierRole(node);
  }

  function startMatchInterval() {
    if (state.tournament.timerId) {
      clearInterval(state.tournament.timerId);
      state.tournament.timerId = null;
    }
    const active5v5 = state.tournament.prep?.clash5v5?.miniSt;
    if (active5v5 && active5v5.running && !active5v5.finished) {
      ensureMatchSupport(active5v5, active5v5.pitch);
      if (!state.tournament.pitchRafId) startPitchRafLoop(active5v5);
      return;
    }
    const stageIdx = state.tournament.stageIndex;
    const st = state.tournament.stages[stageIdx];
    if (!st || st.finished) return;
    if (!st.pitch) st.pitch = initMatchPitchState(st, stageIdx);
    ensureMatchSupport(st, st.pitch);
    if (!state.tournament.pitchRafId) startPitchRafLoop(st);
  }

  function runLiveMatchSimulation(stageIdx) {
    clearTournamentTimers(false);
    state.tournament.stageIndex = stageIdx;
    state.tournament.showRunSummary = false;

    const st = state.tournament.stages[stageIdx];
    if (st.isGroupStage && state.tournament.worldGroup) {
      if (st._groupSnapshotBefore) {
        state.tournament.worldGroup = JSON.parse(JSON.stringify(st._groupSnapshotBefore));
      } else {
        st._groupSnapshotBefore = JSON.parse(JSON.stringify(state.tournament.worldGroup));
      }
      st._groupRecorded = false;
    }
    const compLabel = st.competition === "WORLD" ? "Mundial (FFI)" : "Futebol Fronteira";
    st.minute = 0;
    st.maxMinute = 90;
    st.userScore = 0;
    st.oppScore = 0;
    st.goalsUser = [];
    st.goalsOpp = [];
    st.narration = [
      {
        cls: "",
        iconCat: "FF",
        text: `0' Apito inicial pela ${st.stageName} do ${compLabel}: Sua Seleção enfrenta ${st.oppTeam.name}!`
      }
    ];
    st.running = true;
    st.finished = false;
    st.halftimeHandled = false;
    st.recoverCharges = 2;
    st.won = null;
    st.isDraw = false;
    st.penalties = null;
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
    const inPrep = Boolean(state.phase === "tournament" && state.tournament?.prep);
    document.body.classList.toggle("phase-tournament", state.phase === "tournament");
    document.body.classList.toggle("phase-prep", inPrep);
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
          bondsBar.innerHTML = `<span style="color:#93c5fd; display:inline-flex; align-items:center; gap:5px; flex-wrap:wrap;">${formationIconHTML("inline-ui-icon")} <strong>Dica Tática:</strong> Escale todos os <strong>11 na posição correta</strong> (+20% Quím / +2 OVR) e conecte jogadores do <strong>mesmo elemento colados</strong> para ativar links elementais!</span>`;
        } else {
          bondsBar.innerHTML =
            `<strong style="color:#38bdf8; margin-right:4px; display:inline-flex; align-items:center; gap:4px;">${captainIconHTML("inline-ui-icon")} Laços:</strong>` +
            stats.activeBonds
              .map(
                (b) =>
                  `<span class="bond-tag ${b.type === "friendship" ? "friendship" : b.type === "perfect-formation" ? "perfect-formation" : b.type === "warn-pos" ? "warn-pos" : ""}">${b.label}</span>`
              )
              .join("");
        }
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
            <div class="start-title-ribbon">DREAM TEAM • MODO RELÂMPAGO</div>
          </div>
        </div>

        <div class="start-body">
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
                <span>O Overall fica oculto na lista e só é revelado quando você escala no campo!</span>
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

    document.getElementById("btn-start-game-now").addEventListener("click", () => {
      state.storyLockNotice = false;
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
                    <div style="font-size:1.02rem; font-weight:900; color:#fff; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                      <span>${sel.name}</span> ${posIconHTML(sel.pos, true)} ${elemIconHTML(sel.element)} <span class="ovr-tag">Nv. ${getPlayerLevel(sel)}</span> <span class="ovr-tag">OVR ${sel.ovr}</span>
                    </div>
                    <div style="font-size:0.74rem; color:#dbeafe; margin-top:2px;">
                      ${
                        hasNaturalOpen
                          ? `Toque em uma vaga de <strong>${sel.pos}</strong> em verde! (Feche 11/11 p/ <strong>+20% Quím e +2 OVR</strong> • Colar elementos iguais acende link próximo!)`
                          : `Vagas de ${sel.pos} ocupadas! Improvisar tira <strong>-6 a -14 OVR</strong> do jogador e perde o bônus de <strong>11/11 na Posição (+20% Quím / +2 OVR)</strong>.`
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
        renderDraftWheelAndRoster(false);
      });

      container.querySelectorAll(".field-node").forEach((el) => {
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
    const statusEl = document.getElementById("export-png-status");
    const previewSlot = document.getElementById("run-export-preview-slot");
    if (statusEl) statusEl.textContent = "⏳ Gerando imagem...";

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
  }

  // ============================================================================
  // PREPARAÇÃO ENTRE PARTIDAS: LOCAIS DE INAZUMA + ROLETA + BOOSTS REAIS
  // ============================================================================
  function getPrepBuffPill(ev) {
    if (!ev) return "";
    if (ev.shortDesc) return ev.shortDesc;
    if (ev.kind === "PASSIVE_DOUBLE_EVENT") return `<span class="b-tech">4 Ações</span> • <span class="b-chem">-5% Custo</span>`;
    if (ev.kind === "PASSIVE_LATE_RESIST") return `<span class="b-chem">Fôlego Infinito (75'+)</span>`;
    if (ev.kind === "STREET_5V5") return `<span class="b-lvl">+120–150 XP</span> • <span class="b-chem">+25% Energia</span>`;
    if (ev.id === "elem_crest_boost") return `<span class="b-lvl">+1 Nv</span> • <span class="b-pwr">+16 Poder</span> (Elemento)`;
    if (ev.id === "elem_resonance_tome") return `<span class="b-lvl">+1 Nv (Todos)</span> • <span class="b-chem">+6% Quím</span>`;
    if (ev.id === "captain_armband") return `<span class="b-lvl">+2 Níveis</span> • <span class="b-chem">+8% Quím</span>`;
    if (ev.id === "secret_hissatsu_mastery") return `<span class="b-lvl">+2 Níveis</span> • <span class="b-tech">Técnica Suprema</span>`;
    if (ev.kind === "KESHIN_PICK") return `<span class="b-lvl">+2 Níveis</span> • <span class="b-tech">Desperta Keshin</span>`;
    if (ev.kind === "EVO_PICK") return `<span class="b-lvl">+${ev.levelGain || 2} Níveis</span> • <span class="b-tech">Evolui Técnica</span>`;
    if (ev.id === "river_xp") return `<span class="b-lvl">+1 Nível (Todos)</span> • <span class="b-pwr">+25 Poder</span>`;
    if (ev.id === "river_tactics") return `<span class="b-lvl">+1 Nv Meias</span> • <span class="b-chem">+8% Quím</span>`;
    if (ev.id === "river_shot") return `<span class="b-lvl">+1 Nv Atacantes</span> • <span class="b-pwr">+28 Poder</span>`;
    if (ev.kind === "SCALABLE_BUFF") {
      const curLvl = state.tournament?.prepBonuses?.[ev.buffKey] || 0;
      const nextLvl = Math.min(ev.maxLevel || 3, curLvl + 1);
      if (ev.buffKey === "efficiencyLvl") return `<span class="b-chem">-${nextLvl * 3}% Custo na Cidade</span>`;
      if (ev.buffKey === "restLvl") return `<span class="b-chem">Descanso +${60 + nextLvl * 10}%</span>`;
      if (ev.buffKey === "enduranceLvl") {
        const pct = [0, 12, 22, 32][nextLvl] || 32;
        return `<span class="b-chem">-${pct}% Gasto em Campo</span>`;
      }
      if (ev.buffKey === "wingExplosionLvl") return `<span class="b-pwr">+${nextLvl * 3} VEL/FOR</span>`;
      if (ev.buffKey === "midSynergyLvl") return `<span class="b-chem">+${nextLvl * 3} TEC · +4% Quím</span>`;
      if (ev.buffKey === "defBlockLvl") return `<span class="b-pwr">+${nextLvl * 3} DEF/FIS</span>`;
      if (ev.buffKey === "hissatsuMasteryLvl") {
        const val = [0, 0.8, 1.6, 2.5][nextLvl] || 2.5;
        return `<span class="b-pwr">+${val} Duelo Técnica</span>`;
      }
      if (ev.buffKey === "xpSpiritLvl") return `<span class="b-lvl">+${nextLvl * 15}% XP Pós-Jogo</span>`;
      if (ev.buffKey === "passBypassLvl") {
        const pct = [0, 15, 28, 40][nextLvl] || 40;
        return `<span class="b-chem">-${pct}% Interceptação</span>`;
      }
      if (ev.buffKey === "counterShotLvl") {
        const pct = [0, 12, 24, 35][nextLvl] || 35;
        return `<span class="b-pwr">+${pct}% Contra-Chute</span>`;
      }
      if (ev.buffKey === "dribbleEdgeLvl") {
        const val = [0, 1.2, 2.4, 3.6][nextLvl] || 3.6;
        return `<span class="b-pwr">+${val} Força Drible</span>`;
      }
    }
    if (ev.kind === "ENERGY_DRINK") return `<span class="b-chem">+${ev.energyGain || 35}% Energia</span> • <span class="b-pwr">+${ev.teamPower || 12} Poder</span>`;
    if (ev.levelGain && ev.indivPower) return `<span class="b-lvl">+${ev.levelGain} Nv</span> • <span class="b-pwr">+${ev.indivPower} Poder</span>`;
    if (ev.levelGain) return `<span class="b-lvl">+${ev.levelGain} Nível(is)</span>`;
    if (ev.teamPower) return `<span class="b-pwr">+${ev.teamPower} Poder</span>`;
    return ev.summary || "";
  }

  function getPrepChoiceSummary(ev) {
    if (!ev) return "";
    if (ev.kind === "SCALABLE_BUFF") {
      const curLvl = state.tournament?.prepBonuses?.[ev.buffKey] || 0;
      const nextLvl = Math.min(ev.maxLevel || 3, curLvl + 1);
      if (ev.buffKey === "efficiencyLvl") {
        return curLvl === 0
          ? `Reduz em <span class="b-chem">3%</span> o custo de energia dos locais da cidade.`
          : `Aumenta o desconto nos locais de <span class="b-chem">-${curLvl * 3}%</span> para <span class="b-chem">-${nextLvl * 3}%</span>.`;
      }
      if (ev.buffKey === "restLvl") {
        return curLvl === 0
          ? `Descansar na Sede passa a recuperar <span class="b-chem">+70%</span> de energia.`
          : `Evolui o Descansar de <span class="b-chem">+${60 + curLvl * 10}%</span> para <span class="b-chem">+${60 + nextLvl * 10}%</span>.`;
      }
      if (ev.buffKey === "enduranceLvl") {
        const prevP = [0, 12, 22, 32][curLvl] || 0;
        const nextP = [0, 12, 22, 32][nextLvl] || 32;
        return curLvl === 0
          ? `Reduz em <span class="b-chem">12%</span> o gasto das técnicas e o desgaste em campo.`
          : `Aumenta a economia em campo de <span class="b-chem">-${prevP}%</span> para <span class="b-chem">-${nextP}%</span>.`;
      }
      if (ev.buffKey === "wingExplosionLvl") {
        return curLvl === 0
          ? `Atacantes e Meias ganham <span class="b-chem">+3 VEL e +3 FOR</span>.`
          : `Atacantes e Meias sobem de <span class="b-chem">+${curLvl * 3}</span> para <span class="b-chem">+${nextLvl * 3} VEL/FOR</span>.`;
      }
      if (ev.buffKey === "midSynergyLvl") {
        return curLvl === 0
          ? `Meias ganham <span class="b-tech">+3 TEC</span> e o time ganha <span class="b-chem">+4% Química</span>.`
          : `Meias sobem de <span class="b-tech">+${curLvl * 3}</span> para <span class="b-tech">+${nextLvl * 3} TEC</span> (<span class="b-chem">+4% Quím</span>).`;
      }
      if (ev.buffKey === "defBlockLvl") {
        return curLvl === 0
          ? `Goleiro e Zaga ganham <span class="b-pwr">+3 DEF e +3 FIS</span>.`
          : `Goleiro e Zaga sobem de <span class="b-pwr">+${curLvl * 3}</span> para <span class="b-pwr">+${nextLvl * 3} DEF/FIS</span>.`;
      }
      if (ev.buffKey === "hissatsuMasteryLvl") {
        const prevV = [0, 0.8, 1.6, 2.5][curLvl] || 0;
        const nextV = [0, 0.8, 1.6, 2.5][nextLvl] || 2.5;
        return curLvl === 0
          ? `Dá <span class="b-pwr">+0.8</span> de força extra nos duelos com técnica.`
          : `Bônus em duelos de técnica sobe de <span class="b-pwr">+${prevV}</span> para <span class="b-pwr">+${nextV}</span>.`;
      }
      if (ev.buffKey === "xpSpiritLvl") {
        return curLvl === 0
          ? `Elenco ganha <span class="b-lvl">+15% XP</span> extra após cada partida.`
          : `Bônus de XP pós-jogo sobe de <span class="b-lvl">+${curLvl * 15}%</span> para <span class="b-lvl">+${nextLvl * 15}%</span>.`;
      }
      if (ev.buffKey === "passBypassLvl") {
        const prevP = [0, 15, 28, 40][curLvl] || 0;
        const nextP = [0, 15, 28, 40][nextLvl] || 40;
        return curLvl === 0
          ? `Reduz em <span class="b-chem">15%</span> a chance do rival interceptar seus passes.`
          : `Redução de interceptação sobe de <span class="b-chem">-${prevP}%</span> para <span class="b-chem">-${nextP}%</span>.`;
      }
      if (ev.buffKey === "counterShotLvl") {
        const prevP = [0, 12, 24, 35][curLvl] || 0;
        const nextP = [0, 12, 24, 35][nextLvl] || 35;
        return curLvl === 0
          ? `Aumenta em <span class="b-tech">+12%</span> a chance de Contra-Chute na defesa.`
          : `Chance de Contra-Chute sobe de <span class="b-tech">+${prevP}%</span> para <span class="b-tech">+${nextP}%</span>.`;
      }
      if (ev.buffKey === "dribbleEdgeLvl") {
        const prevV = [0, 1.2, 2.4, 3.6][curLvl] || 0;
        const nextV = [0, 1.2, 2.4, 3.6][nextLvl] || 3.6;
        return curLvl === 0
          ? `Dá <span class="b-pwr">+1.2</span> nos dribles (bônus extra no corredor tático).`
          : `Força nos dribles sobe de <span class="b-pwr">+${prevV}</span> para <span class="b-pwr">+${nextV}</span>.`;
      }
    }
    return ev.summary || "";
  }

  function getPrepLocationsCatalog() {
    return [
      {
        id: "town",
        title: "Cidade de Inazuma",
        sub: "Lojas & Equipamentos",
        mapLabel: "Lojas & Itens",
        mapX: 50,
        mapY: 46,
        energyCost: 15,
        cta: "Visitar as Lojas",
        spinMsg: "Sorteando 3 equipamentos e amuletos na Cidade de Inazuma...",
        resultEyebrow: "Escolha 1 de 3 Descobertas na Cidade",
        banner: UI.locTown || UI.stadiumBg,
        badgeIcon: UI.iconShopBag || UI.itemShoesLegend,
        subIcon: UI.iconShopBoots || UI.itemShoesLegend,
        desc: "Equipamentos que combam entre si, Níveis, Amuletos Elementais e Passivas.",
        events: [
          {
            id: "coach_double_pass",
            title: "Passe Livre Permanente do Treinador",
            icon: UI.manualInazuma || UI.ffLogo,
            kind: "PASSIVE_DOUBLE_EVENT",
            weight: 2.2,
            summary: `Passiva: <span class="b-tech">+1 ação extra (4 ações)</span> na cidade e <span class="b-chem">-5% custo de energia</span> em todos os locais.`
          },
          {
            id: "pendant_endurance",
            title: "Pingente da Resistência Final",
            icon: UI.itemPendantLightning || UI.tpPendant,
            kind: "PASSIVE_LATE_RESIST",
            weight: 2.0,
            summary: `Passiva: Os 11 titulares <span class="b-chem">não perdem energia</span> a partir dos 75' de jogo.`
          },
          {
            id: "shoes_legend",
            title: "Chuteiras Lendárias",
            icon: UI.itemShoesLegend,
            kind: "ITEM_PICK",
            targetRoles: ["FW", "MF"],
            levelGain: 1,
            indivPower: 38,
            spdBoost: 3,
            teamPower: 20,
            teamChem: 0,
            weight: 2.1,
            summary: `<span class="b-lvl">+1 Nível</span> e <span class="b-pwr">+38 Poder</span> para 1 Atacante ou Meia. Comba com Luvas Lendárias (<span class="b-pwr">+65 Poder</span>).`
          },
          {
            id: "glove_legend",
            title: "Luvas Lendárias",
            icon: UI.itemGloveLegend || UI.itemGloveRaimon,
            kind: "ITEM_PICK",
            targetRoles: ["GK"],
            levelGain: 1,
            indivPower: 42,
            teamPower: 22,
            teamChem: 0,
            weight: 1.9,
            summary: `<span class="b-lvl">+1 Nível</span> e <span class="b-pwr">+42 Poder</span> no Goleiro. Comba com Chuteiras Lendárias (<span class="b-pwr">+65</span>) e Travas (<span class="b-pwr">+55</span>).`
          },
          {
            id: "shoes_thunder",
            title: "Chuteiras do Trovão",
            icon: UI.itemShoesThunder,
            kind: "ITEM_PICK",
            targetRoles: ["FW", "MF", "DF"],
            levelGain: 1,
            indivPower: 30,
            spdBoost: 5,
            teamPower: 18,
            teamChem: 0,
            weight: 2.2,
            summary: `<span class="b-lvl">+1 Nível</span>, <span class="b-pwr">+30 Poder</span> e <span class="b-chem">+5 VEL</span> para 1 jogador de linha. Comba com Braçadeira/Insígnia.`
          },
          {
            id: "spike_block",
            title: "Travas de Bloqueio",
            icon: UI.itemSpikeBlock,
            kind: "ITEM_PICK",
            targetRoles: ["DF"],
            levelGain: 1,
            indivPower: 36,
            teamPower: 18,
            teamChem: 0,
            weight: 1.9,
            summary: `<span class="b-lvl">+1 Nível</span> e <span class="b-pwr">+36 Poder</span> para 1 Zagueiro. Comba com Luvas Lendárias (<span class="b-pwr">+55 Poder</span>).`
          },
          {
            id: "captain_armband",
            title: "Braçadeira Dourada do Capitão",
            icon: UI.captain || UI.itemBraceletFortune,
            kind: "ITEM_PICK",
            targetRoles: ["GK", "DF", "MF", "FW"],
            levelGain: 2,
            indivPower: 32,
            teamPower: 25,
            teamChem: 8,
            weight: 1.8,
            summary: `<span class="b-lvl">+2 Níveis</span> no líder, <span class="b-chem">+8% Química</span> e <span class="b-pwr">+57 Poder total</span>. Comba com Chuteiras do Trovão.`
          },
          {
            id: "elem_crest_boost",
            title: "Insígnia de Ressonância Elemental",
            icon: UI.elemFire || UI.itemPendantLightning,
            kind: "ELEM_BOOST_PICK",
            levelGain: 1,
            indivPower: 16,
            teamPower: 15,
            teamChem: 5,
            weight: 2.0,
            summary: `Todos os titulares do <span class="b-tech">mesmo elemento</span> ganham <span class="b-lvl">+1 Nível</span> e <span class="b-pwr">+16 Poder</span> cada.`
          },
          {
            id: "misanga_friend",
            title: "Pulseira da Amizade",
            icon: UI.itemMisangaFriend || UI.itemBraceletFortune,
            kind: "ITEM_PICK",
            targetRoles: ["GK", "DF", "MF", "FW"],
            levelGain: 1,
            indivPower: 28,
            teamPower: 20,
            teamChem: 8,
            weight: 1.7,
            summary: `<span class="b-lvl">+1 Nível</span> e <span class="b-pwr">+28 Poder</span> em 1 titular e <span class="b-chem">+8% Química</span>. Conta para Arsenal Completo.`
          },
          {
            id: "energy_drink",
            title: "Bebida Energética Raijin",
            icon: UI.sportsDrink || UI.onigiriIcon || UI.itemPendantLightning,
            kind: "ENERGY_DRINK",
            energyGain: 35,
            teamPower: 12,
            weight: 2.3,
            summary: `Recupera <span class="b-chem">+35% de Energia do Time</span> na hora e garante <span class="b-pwr">+12 Poder</span>.`
          },
          {
            id: "efficiency_upgrade",
            title: "Eficiência de Treino",
            icon: UI.manualSkill || UI.iconShopBoots || UI.iconShopBag,
            kind: "SCALABLE_BUFF",
            buffKey: "efficiencyLvl",
            maxLevel: 3,
            teamPower: 10,
            weight: 1.9,
            summary: `Reduz em <span class="b-chem">-3% por nível</span> (-3% / -6% / -9%) o custo de energia dos locais da cidade.`
          },
          {
            id: "rest_upgrade",
            title: "Descanso Aprimorado",
            icon: UI.raimonEmblem || UI.itemBraceletFortune,
            kind: "SCALABLE_BUFF",
            buffKey: "restLvl",
            maxLevel: 3,
            teamPower: 10,
            weight: 1.8,
            summary: `O Descansar na Sede passa a recuperar <span class="b-chem">+70% / +80% / +90%</span> de Energia.`
          },
          {
            id: "xp_spirit_upgrade",
            title: "Espírito de Evolução",
            icon: UI.keshinCoin || UI.manualInazuma,
            kind: "SCALABLE_BUFF",
            buffKey: "xpSpiritLvl",
            maxLevel: 3,
            teamPower: 12,
            weight: 1.8,
            summary: `Aumenta o XP ganho pelo elenco após cada partida em <span class="b-lvl">+15% / +30% / +45%</span>.`
          }
        ]
      },
      {
        id: "riverbank",
        title: "Margem do Rio",
        sub: "Campinho da Raimon",
        mapLabel: "Campinho 5x5",
        mapX: 30,
        mapY: 79,
        energyCost: 25,
        cta: "Ir para o Campinho",
        spinMsg: "Sorteando 3 oportunidades na Margem do Rio...",
        resultEyebrow: "Escolha 1 de 3 Oportunidades na Margem",
        banner: UI.locRiverbank || UI.stadiumBg,
        badgeIcon: UI.iconCampinho || UI.ffLogo,
        subIcon: UI.iconBattleVR || UI.ffLogo,
        desc: "5x5 com recrutamento de craque, subida de Nível em grupo e táticas.",
        events: [
          {
            id: "clash_5v5",
            title: "Confronto 5x5 com Craque",
            icon: UI.ffLogo || UI.moveSH,
            kind: "STREET_5V5",
            weight: 2.8,
            summary: `Gol de Ouro: vencer dá <span class="b-lvl">+120 a +150 XP</span> nos 5 participantes e libera <span class="b-tech">recrutamento do craque</span>.`
          },
          {
            id: "river_xp",
            title: "Intensivo Coletivo",
            icon: UI.keshinCoin || UI.formation,
            kind: "COLLECTIVE",
            applyRoles: ["GK", "DF", "MF", "FW"],
            levelGain: 1,
            teamPower: 25,
            teamChem: 4,
            xpGain: 90,
            weight: 2.1,
            summary: `Todos os 11 titulares sobem <span class="b-lvl">+1 Nível</span>, ganham <span class="b-chem">+4% Química</span> e <span class="b-pwr">+25 Poder</span>.`
          },
          {
            id: "river_tactics",
            title: "Roda Tática de Meio-Campo",
            icon: UI.formation || UI.moveOF,
            kind: "COLLECTIVE",
            applyRoles: ["MF"],
            levelGain: 1,
            indivPower: 16,
            teamPower: 30,
            teamChem: 8,
            xpGain: 80,
            weight: 1.9,
            summary: `Todos os Meias sobem <span class="b-lvl">+1 Nível</span> e <span class="b-pwr">+16 Poder</span> • <span class="b-chem">+8% Química</span> • <span class="b-pwr">+30 Poder</span>.`
          },
          {
            id: "river_shot",
            title: "Bombardeio de Finalização",
            icon: UI.moveSH,
            kind: "COLLECTIVE",
            applyRoles: ["FW"],
            levelGain: 1,
            indivPower: 18,
            teamPower: 28,
            teamChem: 0,
            xpGain: 80,
            weight: 1.8,
            summary: `Todos os Atacantes sobem <span class="b-lvl">+1 Nível</span> e <span class="b-pwr">+18 Poder</span> • <span class="b-pwr">+28 Poder Coletivo</span>.`
          },
          {
            id: "wing_explosion_upgrade",
            title: "Explosão nas Alas",
            icon: UI.itemShoesThunder || UI.moveOF,
            kind: "SCALABLE_BUFF",
            buffKey: "wingExplosionLvl",
            maxLevel: 3,
            teamPower: 14,
            weight: 1.8,
            summary: `<span class="b-chem">+3 VEL e +3 FOR</span> acumulados por nível nos Atacantes e Meias.`
          },
          {
            id: "mid_synergy_upgrade",
            title: "Sintonia de Meio-Campo",
            icon: UI.formation || UI.moveOF,
            kind: "SCALABLE_BUFF",
            buffKey: "midSynergyLvl",
            maxLevel: 3,
            teamPower: 12,
            teamChem: 4,
            weight: 1.8,
            summary: `<span class="b-tech">+3 TEC</span> nos Meias e <span class="b-chem">+4% Química</span> acumulados por nível.`
          },
          {
            id: "pass_bypass_upgrade",
            title: "Passe Cirúrgico",
            icon: UI.formation || UI.moveOF,
            kind: "SCALABLE_BUFF",
            buffKey: "passBypassLvl",
            maxLevel: 3,
            teamPower: 12,
            weight: 1.8,
            summary: `Reduz em <span class="b-chem">-15% / -28% / -40%</span> a chance do rival interceptar seus passes.`
          },
          {
            id: "dribble_edge_upgrade",
            title: "Drible Imparável",
            icon: UI.moveOF || UI.itemShoesThunder,
            kind: "SCALABLE_BUFF",
            buffKey: "dribbleEdgeLvl",
            maxLevel: 3,
            teamPower: 14,
            weight: 1.8,
            summary: `Força extra nos dribles (<span class="b-pwr">+1.2 / +2.4 / +3.6</span>) e bônus no corredor tático.`
          }
        ]
      },
      {
        id: "training",
        title: "Centro Inabikari",
        sub: "Treino Secreto",
        mapLabel: "Treino Secreto",
        mapX: 82,
        mapY: 66,
        energyCost: 30,
        cta: "Treinar no Inabikari",
        spinMsg: "Sorteando 3 salas de treino no Centro Inabikari...",
        resultEyebrow: "Escolha 1 de 3 Treinos no Inabikari",
        banner: UI.locTraining || UI.stadiumBg,
        badgeIcon: UI.iconSecretTrain || UI.keshinPegasus,
        subIcon: UI.iconSpecialTrainVR || UI.steelTowerIcon,
        desc: "Manual Secreto, Incorporação Keshin, Evolução de Técnica e Sinergia Elemental.",
        events: [
          {
            id: "secret_hissatsu_mastery",
            title: "Manual Secreto de Inazuma",
            icon: UI.manualInazuma || UI.manualSkill,
            kind: "EVO_PICK",
            levelGain: 2,
            indivPower: 45,
            teamPower: 25,
            xpGain: 95,
            weight: 2.5,
            summary: `1 titular aprende uma <span class="b-tech">técnica suprema</span>, sobe <span class="b-lvl">+2 Níveis</span> e ganha <span class="b-pwr">+45 Poder</span>.`
          },
          {
            id: "keshin_awaken",
            title: "Despertar Incorporação",
            icon: UI.keshinPegasus || UI.keshinIcon,
            kind: "KESHIN_PICK",
            levelGain: 2,
            indivPower: 42,
            teamPower: 25,
            xpGain: 95,
            weight: 2.4,
            summary: `1 titular desperta um <span class="b-tech">Espírito Guerreiro</span> (<span class="b-pwr">+3.2 nos duelos</span>), sobe <span class="b-lvl">+2 Níveis</span> e ganha <span class="b-pwr">+42 Poder</span>.`
          },
          {
            id: "evo_move",
            title: "Evoluir Técnica (G2/Shin)",
            icon: UI.manualSkill || UI.manualKeshin,
            kind: "EVO_PICK",
            levelGain: 2,
            indivPower: 34,
            teamPower: 22,
            xpGain: 85,
            weight: 2.2,
            summary: `Evolua a técnica principal de 1 titular e suba <span class="b-lvl">+2 Níveis</span> e <span class="b-pwr">+34 Poder</span>.`
          },
          {
            id: "endurance_upgrade",
            title: "Resistência em Campo",
            icon: UI.steelTowerIcon || UI.moveGK,
            kind: "SCALABLE_BUFF",
            buffKey: "enduranceLvl",
            maxLevel: 3,
            teamPower: 14,
            weight: 2.0,
            summary: `Reduz em <span class="b-chem">-12% / -22% / -32%</span> o gasto das técnicas e o desgaste do time em campo.`
          },
          {
            id: "elem_resonance_tome",
            title: "Tomo da Sincronia Elemental",
            icon: UI.elemWind || UI.formation,
            kind: "COLLECTIVE",
            applyRoles: ["GK", "DF", "MF", "FW"],
            levelGain: 1,
            teamPower: 25,
            teamChem: 6,
            xpGain: 85,
            elemResonance: true,
            weight: 1.8,
            summary: `Todos sobem <span class="b-lvl">+1 Nível</span>, <span class="b-chem">+6% Química</span> e fortalece o <span class="b-pwr">Poder dos Links Elementais</span>.`
          },
          {
            id: "def_block_upgrade",
            title: "Bloco Defensivo",
            icon: UI.itemSpikeBlock || UI.moveDF,
            kind: "SCALABLE_BUFF",
            buffKey: "defBlockLvl",
            maxLevel: 3,
            teamPower: 14,
            weight: 1.9,
            summary: `<span class="b-pwr">+3 DEF e +3 FIS</span> acumulados por nível no Goleiro e Zagueiros.`
          },
          {
            id: "hissatsu_mastery_upgrade",
            title: "Maestria de Hissatsu",
            icon: UI.manualInazuma || UI.moveSH,
            kind: "SCALABLE_BUFF",
            buffKey: "hissatsuMasteryLvl",
            maxLevel: 3,
            teamPower: 15,
            weight: 1.9,
            summary: `Força extra nos duelos ao usar técnicas (<span class="b-pwr">+0.8 / +1.6 / +2.5</span>).`
          },
          {
            id: "counter_shot_upgrade",
            title: "Reflexo de Contra-Chute",
            icon: UI.moveDF || UI.moveSH,
            kind: "SCALABLE_BUFF",
            buffKey: "counterShotLvl",
            maxLevel: 3,
            teamPower: 14,
            weight: 1.8,
            summary: `Aumenta em <span class="b-tech">+12% / +24% / +35%</span> a chance de Contra-Chute e sua força.`
          }
        ]
      },
      {
        id: "rest",
        title: "Sede do Clube",
        sub: "Descanso & Recuperação",
        mapLabel: "Descansar",
        mapX: 17,
        mapY: 42,
        energyGain: 60,
        isRestLocation: true,
        cta: "Descansar (+60%)",
        banner: UI.locTown || UI.stadiumBg,
        badgeIcon: UI.raimonEmblem || UI.iconDestVR || UI.ffLogo,
        subIcon: UI.itemPendantLightning || UI.tpPendant,
        desc: "Recupera +60% de Energia do Time de forma bruta (máximo 100%).",
        events: []
      }
    ];
  }

  function pickWeightedPrepEvent(events) {
    const bonuses = state.tournament?.prepBonuses || {};
    const getW = (e) => {
      let w = e.weight || 1;
      if (e.kind === "SCALABLE_BUFF") {
        const cur = bonuses[e.buffKey] || 0;
        if (cur > 0 && cur < (e.maxLevel || 3)) w *= 1.45;
      }
      return w;
    };
    const total = events.reduce((s, e) => s + getW(e), 0);
    let r = Math.random() * total;
    for (let i = 0; i < events.length; i++) {
      r -= getW(events[i]);
      if (r <= 0) return events[i];
    }
    return events[events.length - 1];
  }

  function canPlayerEvolveAnyMove(player) {
    if (!player || !player.moves) return false;
    return ["SH", "OF", "DF", "GK"].some((cat) => {
      const arr = player.moves[cat];
      return Array.isArray(arr) && arr.length > 0 && !arr[0].includes("★");
    });
  }

  function evolvePlayerPrimaryMove(player, slotRole) {
    if (!player || !player.moves) return null;
    if (!player._baseMovesSnapshot) {
      player._baseMovesSnapshot = JSON.parse(JSON.stringify(player.moves));
    }
    const order =
      slotRole === "GK"
        ? ["GK", "DF", "SH", "OF"]
        : slotRole === "DF"
        ? ["DF", "OF", "SH", "GK"]
        : slotRole === "MF"
        ? ["OF", "SH", "DF", "GK"]
        : ["SH", "OF", "DF", "GK"];

    for (const cat of order) {
      const arr = player.moves[cat];
      if (Array.isArray(arr) && arr.length > 0) {
        const oldName = arr[0];
        if (oldName.includes("★")) continue;
        let nextName = oldName;
        if (cat === "GK") {
          nextName = oldName.includes("Shin") ? `${oldName} ★` : oldName.includes("Kai") ? oldName.replace("Kai", "Shin") : `${oldName} Shin`;
        } else if (cat === "DF") {
          nextName = oldName.includes("V2") ? oldName.replace("V2", "V3") : oldName.includes("V3") ? `${oldName} ★` : `${oldName} V2`;
        } else {
          nextName = oldName.includes("G2") ? oldName.replace("G2", "G3") : oldName.includes("G3") ? `${oldName} ★` : `${oldName} G2`;
        }
        arr[0] = nextName;
        player.moveEvoCount = (player.moveEvoCount || 0) + 1;
        player.hissatsu = [
          ...(player.moves[order[0]] || []),
          ...(player.moves[order[1]] || [])
        ]
          .slice(0, 2)
          .join(" / ");
        return { cat, oldName, nextName };
      }
    }
    return null;
  }

  function applySecretManualMastery(player, slotRole) {
    if (!player) return null;
    if (!player.moves) player.moves = { SH: [], OF: [], DF: [], GK: [] };
    if (!player._baseMovesSnapshot) {
      player._baseMovesSnapshot = JSON.parse(JSON.stringify(player.moves));
    }
    player.learnedSecretManual = true;
    player.moveEvoCount = (player.moveEvoCount || 0) + 1;
    const secretCatalog = {
      GK: { cat: "GK", move: "Mão Ômega ★" },
      DF: { cat: "DF", move: "A Montanha ★" },
      MF: { cat: "OF", move: "Campo Relâmpago ★" },
      FW: { cat: "SH", move: "A Terra ★" }
    };
    const spec = secretCatalog[slotRole] || secretCatalog.FW;
    if (!Array.isArray(player.moves[spec.cat])) player.moves[spec.cat] = [];
    if (!player.moves[spec.cat].includes(spec.move)) {
      player.moves[spec.cat].unshift(spec.move);
    }
    const order =
      slotRole === "GK"
        ? ["GK", "DF", "SH", "OF"]
        : slotRole === "DF"
        ? ["DF", "OF", "SH", "GK"]
        : slotRole === "MF"
        ? ["OF", "SH", "DF", "GK"]
        : ["SH", "OF", "DF", "GK"];
    player.hissatsu = [
      ...(player.moves[order[0]] || []),
      ...(player.moves[order[1]] || [])
    ]
      .slice(0, 2)
      .join(" / ");
    return spec.move;
  }

  function getEligibleSlotsForPrepEvent(ev) {
    if (!ev) return [];
    return getSlots().filter((slot) => {
      const p = state.squad[slot.id];
      if (!p) return false;
      if (ev.targetRoles && ev.targetRoles.length > 0 && !ev.targetRoles.includes(slot.role)) {
        return false;
      }
      if (ev.kind === "ITEM_PICK" || ev.kind === "MANUAL_PICK" || ev.kind === "ELEM_BOOST_PICK") {
        const alreadyHas =
          Array.isArray(p.equippedItems) &&
          p.equippedItems.some((it) => it.id === ev.id || it.title === ev.title);
        if (alreadyHas) return false;
      } else if (ev.kind === "KESHIN_PICK") {
        if (p.keshin) return false;
      } else if (ev.kind === "EVO_PICK") {
        if (ev.id === "secret_hissatsu_mastery") {
          if (p.learnedSecretManual) return false;
        } else if (!canPlayerEvolveAnyMove(p)) {
          return false;
        }
      }
      return true;
    });
  }

  function getEligiblePrepEventsForLocation(loc, t) {
    if (!loc || !Array.isArray(loc.events)) return [];
    const bonuses = t?.prepBonuses || {};
    const baseEligible = loc.events.filter((ev) => {
      if (ev.kind === "PASSIVE_DOUBLE_EVENT" && bonuses.permanentDoublePrep) return false;
      if (ev.kind === "PASSIVE_LATE_RESIST" && bonuses.lateMatchNoStaminaLoss) return false;
      if (ev.id === "tire_training" && (bonuses.tireTrainingDone || (bonuses.staminaMul || 1) <= 0.72)) return false;
      if (ev.kind === "SCALABLE_BUFF") {
        return (bonuses[ev.buffKey] || 0) < (ev.maxLevel || 3);
      }
      if (ev.id === "elem_resonance_tome" && bonuses.elemResonance) return false;
      if (ev.id === "captain_armband") {
        const someoneHasArmband = Object.values(state.squad).some(
          (p) => Array.isArray(p?.equippedItems) && p.equippedItems.some((it) => it.id === "captain_armband")
        );
        if (someoneHasArmband) return false;
      }
      if (
        ev.kind === "ITEM_PICK" ||
        ev.kind === "MANUAL_PICK" ||
        ev.kind === "ELEM_BOOST_PICK" ||
        ev.kind === "KESHIN_PICK" ||
        ev.kind === "EVO_PICK"
      ) {
        return getEligibleSlotsForPrepEvent(ev).length > 0;
      }
      return true;
    });

    const usedThisRound = new Set(t?.prep?.usedEventIdsThisRound || []);
    if (usedThisRound.size > 0) {
      const withoutUsedThisRound = baseEligible.filter((ev) => !usedThisRound.has(ev.id));
      if (withoutUsedThisRound.length >= Math.min(3, baseEligible.length) && withoutUsedThisRound.length > 0) {
        return withoutUsedThisRound;
      }
    }

    if (baseEligible.length > 0) return baseEligible;

    return [
      {
        id: `fallback_${loc.id}`,
        title: loc.id === "town" ? "Suplemento Relâmpago" : "Treino Intensivo Relâmpago",
        icon: UI.tpWater || UI.manualSkill || UI.ffLogo,
        kind: "COLLECTIVE",
        applyRoles: ["GK", "DF", "MF", "FW"],
        levelGain: 1,
        teamPower: 35,
        teamChem: 3,
        xpGain: 100,
        weight: 1.0,
        summary: "+1 Nível em todos os titulares • +3% Química • +35 Poder"
      }
    ];
  }

  // ============================================================================
  // (LEVEL_MOVE_CATALOG definido acima antes de getEvolvedOpponentRoster)

  function checkAndLearnLevelMoves(player, slotRole = null) {
    if (!player) return [];
    const curLvl = getPlayerLevel(player);
    const role = slotRole || player.pos || "MF";
    const elem = player.element || "Fogo";
    if (!player.moves) player.moves = { SH: [], OF: [], DF: [], GK: [] };
    if (!player._baseMovesSnapshot) {
      player._baseMovesSnapshot = JSON.parse(JSON.stringify(player.moves));
    }
    if (!Array.isArray(player.learnedLvlMilestones)) {
      player.learnedLvlMilestones = [];
    }

    const learned = [];
    const milestones = [3, 6, 10, 15];
    milestones.forEach((mLvl) => {
      if (curLvl >= mLvl && !player.learnedLvlMilestones.includes(mLvl)) {
        player.learnedLvlMilestones.push(mLvl);
        const spec = LEVEL_MOVE_CATALOG[mLvl]?.[role] || LEVEL_MOVE_CATALOG[mLvl]?.MF;
        if (!spec) return;
        const cat = spec.cat;
        let moveName = spec[elem] || spec.Fogo;
        if (!Array.isArray(player.moves[cat])) player.moves[cat] = [];
        if (player.moves[cat].includes(moveName)) {
          moveName = `${moveName} G2`;
        }
        if (!player.moves[cat].includes(moveName)) {
          // Coloca técnica mais forte na frente para ser priorizada
          if (mLvl >= 10) player.moves[cat].unshift(moveName);
          else player.moves[cat].push(moveName);
          learned.push({ move: moveName, cat, level: mLvl });
        }
      }
    });

    if (learned.length > 0) {
      const order =
        role === "GK"
          ? ["GK", "DF", "SH", "OF"]
          : role === "DF"
          ? ["DF", "OF", "SH", "GK"]
          : role === "MF"
          ? ["OF", "SH", "DF", "GK"]
          : ["SH", "OF", "DF", "GK"];
      player.hissatsu = [
        ...(player.moves[order[0]] || []),
        ...(player.moves[order[1]] || [])
      ]
        .slice(0, 2)
        .join(" / ");
    }
    return learned;
  }

  function gainPlayerXp(player, amount, slotRole = null) {
    if (!player || !amount) return { xpGained: 0, levelsGained: 0, currentXp: 0, learnedMoves: [] };
    player.xp = (player.xp || 0) + amount;
    let levelsGained = 0;
    while (player.xp >= 100) {
      player.xp -= 100;
      player.level = getPlayerLevel(player) + 1;
      levelsGained++;
    }
    const learnedMoves = levelsGained > 0 ? checkAndLearnLevelMoves(player, slotRole || player.pos) : [];
    return { xpGained: amount, levelsGained, ovrGained: levelsGained, currentXp: player.xp, learnedMoves };
  }

  function buildStreet5v5Matchup() {
    const slots = getSlots();
    const pickUserByRole = (role, usedSet) => {
      const exact = slots.filter((s) => s.role === role && state.squad[s.id] && !usedSet.has(s.id));
      const pool = exact.length > 0 ? exact : slots.filter((s) => s.role !== "GK" && state.squad[s.id] && !usedSet.has(s.id));
      const fallbackPool = pool.length > 0 ? pool : slots.filter((s) => state.squad[s.id] && !usedSet.has(s.id));
      const chosenSlot = fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
      if (!chosenSlot) return null;
      usedSet.add(chosenSlot.id);
      return { slot: chosenSlot, player: state.squad[chosenSlot.id], role: chosenSlot.role };
    };
    const usedUser = new Set();
    const userQuintet = ["GK", "DF", "MF", "MF", "FW"]
      .map((r) => pickUserByRole(r, usedUser))
      .filter(Boolean);

    const usedOppIds = getPickedPlayerIds();
    const usedFullNames = new Set(
      Object.values(state.squad)
        .filter(Boolean)
        .map((p) => (p.fullName || p.name || "").toLowerCase())
    );
    // Seleciona um craque estrela (OVR 88 a 96) para liderar o time adversário de rua!
    const starCandidates = [];
    DB.teams.forEach((t) => {
      t.players.forEach((p) => {
        const fn = (p.fullName || p.name || "").toLowerCase();
        if (!usedOppIds.has(p.id) && !usedFullNames.has(fn) && p.ovr >= 87) {
          starCandidates.push({ player: p, teamName: t.name, teamId: t.id, emblem: t.emblem, role: p.pos });
        }
      });
    });
    const starRecruit = starCandidates.length > 0
      ? starCandidates[Math.floor(Math.random() * starCandidates.length)]
      : null;
    if (starRecruit) {
      usedOppIds.add(starRecruit.player.id);
      usedFullNames.add((starRecruit.player.fullName || starRecruit.player.name || "").toLowerCase());
    }

    let starPlaced = false;
    const pickOppByRole = (role) => {
      if (starRecruit && !starPlaced && starRecruit.role === role) {
        starPlaced = true;
        return starRecruit;
      }
      const cands = [];
      DB.teams.forEach((t) => {
        t.players.forEach((p) => {
          const fn = (p.fullName || p.name || "").toLowerCase();
          if (!usedOppIds.has(p.id) && !usedFullNames.has(fn) && p.pos === role && p.ovr >= 76 && p.ovr <= 89) {
            cands.push({ player: p, teamName: t.name, teamId: t.id, emblem: t.emblem, role });
          }
        });
      });
      const picked = cands[Math.floor(Math.random() * cands.length)] || { player: DB.teams[0].players[0], teamName: DB.teams[0].name, teamId: DB.teams[0].id, emblem: DB.teams[0].emblem, role };
      usedOppIds.add(picked.player.id);
      usedFullNames.add((picked.player.fullName || picked.player.name || "").toLowerCase());
      return picked;
    };
    const oppQuintet = ["GK", "DF", "MF", "MF", "FW"].map(pickOppByRole);

    return { userQuintet, oppQuintet, starRecruit, status: "READY", miniSt: null, xpSummary: [] };
  }

  function initStreet5v5PitchState(miniSt, c5) {
    const userCoords = [
      { key: "GK", role: "GK", tacticalRole: "GK", label: "GOL", x: 9, y: 50 },
      { key: "DF", role: "DF", tacticalRole: "CB", label: "ZAG", x: 24, y: 50 },
      { key: "MF1", role: "MF", tacticalRole: "CM", label: "MEI", x: 37, y: 27 },
      { key: "MF2", role: "MF", tacticalRole: "CM", label: "MEI", x: 37, y: 73 },
      { key: "FW", role: "FW", tacticalRole: "ST", label: "ATA", x: 47, y: 50 }
    ];
    const oppCoords = [
      { key: "GK", role: "GK", tacticalRole: "GK", label: "GOL", x: 91, y: 50 },
      { key: "DF", role: "DF", tacticalRole: "CB", label: "ZAG", x: 76, y: 50 },
      { key: "MF1", role: "MF", tacticalRole: "CM", label: "MEI", x: 63, y: 27 },
      { key: "MF2", role: "MF", tacticalRole: "CM", label: "MEI", x: 63, y: 73 },
      { key: "FW", role: "FW", tacticalRole: "ST", label: "ATA", x: 53, y: 50 }
    ];

    const makeNode = (entry, coords, side, idx) => {
      const rawP = entry.player;
      const nextIdx = state.tournament?.prep?.nextStageIdx ?? state.tournament?.stageIndex ?? 0;
      const oppLvl = STAGE_OPPONENT_LEVELS[Math.min(nextIdx, STAGE_OPPONENT_LEVELS.length - 1)] || 1;
      const p = side === "opp" ? { ...rawP, level: oppLvl } : rawP;
      const pLvl = side === "opp" ? oppLvl : getPlayerLevel(p);
      const effOvr = side === "user" && entry.slot ? getEffectiveOvr(p, entry.slot.role) : p.ovr;
      const indivPower = calcIndividualPlayerPower(p, coords.role, pLvl);
      return {
        uid: `${side === "user" ? "u5" : "o5"}_${coords.key}`,
        side,
        slotId: entry.slot?.id || coords.key,
        role: coords.role,
        tacticalRole: coords.tacticalRole,
        label: coords.label,
        player: p,
        effOvr,
        level: pLvl,
        indivPower,
        spd: calcPlayerSpeedStat(p, effOvr),
        stamina: 100,
        baseX: coords.x,
        baseY: coords.y,
        x: coords.x,
        y: coords.y,
        vx: 0,
        vy: 0,
        maxSpeed: calcNodeBaseSpeed(coords.tacticalRole, effOvr, p) * 1.12,
        targetX: coords.x,
        targetY: coords.y,
        targetSprint: 0.95,
        duelCooldown: 0,
        staggerTimer: 0,
        carryTime: 0,
        decisionTimer: 0.2 + (idx % 3) * 0.08,
        wanderPhase: idx * 1.27
      };
    };

    const userNodes = c5.userQuintet.map((entry, idx) => makeNode(entry, userCoords[idx] || userCoords[2], "user", idx));
    const oppNodes = c5.oppQuintet.map((entry, idx) => makeNode(entry, oppCoords[idx] || oppCoords[2], "opp", idx));

    const startSide = Math.random() < 0.55 ? "user" : "opp";
    const startPool = startSide === "user" ? userNodes : oppNodes;
    const startNode = startPool[4] || startPool[2] || startPool[0];
    if (startNode) {
      startNode.x = 50;
      startNode.y = 50;
      startNode.targetX = 50;
      startNode.targetY = 50;
    }

    const pitch = {
      is5v5: true,
      userNodes,
      oppNodes,
      oppTeamName: miniSt.oppTeam.name,
      initialSide: startSide,
      ballSide: startSide,
      ballMode: "CARRIED",
      carrierUid: startNode ? startNode.uid : "u5_FW",
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
      holdBallPos: null,
      lastAssistCandidate: null,
      lastPasserUid: null,
      lastAction: null,
      sameActionStreak: 0,
      teamConsecutivePasses: 0,
      justKickedOff: true,
      passTrail: null,
      floatBadge: null,
      nodeBadges: {},
      goalFlashSide: null,
      goalFlashUntil: 0,
      simTime: 0,
      minuteFloat: 0,
      matchSupport: { userTeamSupport: 2.2, oppTeamSupport: 2.0, ovrDiff: 0 },
      ticker: `0' Bola rolando no 5x5! Quem fizer o 1º gol vence!`,
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
        playerStats: {}
      }
    };
    recomputePitchTargets(pitch);
    return pitch;
  }

  function openBetweenMatchPrep(nextStageIdx) {
    clearTournamentTimers(false);
    const t = state.tournament;
    if (!t.prepBonuses) {
      t.prepBonuses = {
        xp: 0,
        chem: 0,
        power: 0,
        staminaMul: 1,
        lateMatchNoStaminaLoss: false,
        permanentDoublePrep: false,
        tireTrainingDone: false,
        efficiencyLvl: 0,
        restLvl: 0,
        enduranceLvl: 0,
        wingExplosionLvl: 0,
        midSynergyLvl: 0,
        defBlockLvl: 0,
        hissatsuMasteryLvl: 0,
        xpSpiritLvl: 0,
        passBypassLvl: 0,
        counterShotLvl: 0,
        dribbleEdgeLvl: 0,
        log: []
      };
    }
    // Até 3 ações por preparação na cidade (ou 4 com a passiva permanente do treinador)
    const allowedEvents = t.prepBonuses.permanentDoublePrep ? 4 : 3;

    t.prep = {
      nextStageIdx,
      phase: "CHOOSE_LOC",
      locId: null,
      event: null,
      choices: [], // 3 opções sorteadas para o jogador escolher 1
      isSpinningSlots: false,
      slotsSpun: [false, false, false],
      eventsTotal: allowedEvents,
      eventsRemaining: allowedEvents,
      usedEventIdsThisRound: [],
      appliedMsg: null,
      clash5v5: null,
      recruitCandidate: null,
      riskTargetSlotId: null
    };
    renderAll();
  }

  function startPrepLocationTripleSlot(locId) {
    const t = state.tournament;
    if (!t.prep) return;
    const loc = getPrepLocationsCatalog().find((x) => x.id === locId);
    if (!loc) return;

    if (t.prepTimerId) {
      clearTimeout(t.prepTimerId);
      t.prepTimerId = null;
    }

    if (loc.isRestLocation) {
      const prevE = Math.round(getTeamEnergy());
      const gain = getRestEnergyGain(t);
      const nextE = Math.round(adjustTeamEnergy(gain));
      t.prep.locId = locId;
      t.prep.event = {
        id: "club_rest",
        title: "Descanso na Sede do Clube",
        icon: loc.badgeIcon
      };
      t.prep.phase = "DONE";
      t.prep.affectedPlayers = [];
      t.prep.appliedMsg = `O elenco descansou na Sede do Clube e recuperou <span class="b-chem">+${gain}% de Energia</span> (${prevE}% ➔ ${nextE}%).`;
      t.prepBonuses.log.push(`Descanso (+${gain}% Energia)`);
      renderAll();
      return;
    }

    const reqCost = getPrepLocationCost(loc, t);
    if (reqCost > 0 && getTeamEnergy() < reqCost) {
      return;
    }
    if (reqCost > 0) {
      adjustTeamEnergy(-reqCost);
    }

    // Sorteia até 3 opções DISTINTAS e ELEGÍVEIS (itens únicos / passivas já adquiridos nunca reaparecem!)
    const availableEvents = [...getEligiblePrepEventsForLocation(loc, t)];
    const pickedThree = [];
    for (let c = 0; c < 3 && availableEvents.length > 0; c++) {
      const ev = pickWeightedPrepEvent(availableEvents);
      pickedThree.push(ev);
      const idx = availableEvents.indexOf(ev);
      if (idx !== -1) availableEvents.splice(idx, 1);
    }

    t.prep.locId = locId;
    t.prep.phase = "PICK_CHOICE";
    t.prep.choices = pickedThree;
    t.prep.appliedMsg = null;

    renderTournamentScreen();
  }

  function handleChoosePrepOption(choiceEvent) {
    const t = state.tournament;
    const prep = t.prep;
    if (!prep || !choiceEvent) return;
    prep.event = choiceEvent;
    if (choiceEvent.id) {
      if (!Array.isArray(prep.usedEventIdsThisRound)) prep.usedEventIdsThisRound = [];
      if (!prep.usedEventIdsThisRound.includes(choiceEvent.id)) {
        prep.usedEventIdsThisRound.push(choiceEvent.id);
      }
    }

    // 1. Passiva Permanente: Passe Livre do Treinador (+1 ação extra e -5% custo de energia em todas as rodadas)
    if (choiceEvent.kind === "PASSIVE_DOUBLE_EVENT") {
      if (!t.prepBonuses.permanentDoublePrep) {
        t.prepBonuses.permanentDoublePrep = true;
        prep.eventsTotal = (prep.eventsTotal || 3) + 1;
        prep.eventsRemaining = (prep.eventsRemaining || 3) + 1;
        t.prepBonuses.log.push("Passe Livre do Treinador (4 Ações e -5% Custo na Cidade)");
      }
      prep.phase = "DONE";
      prep.affectedPlayers = [];
      prep.appliedMsg = `Passiva ativada: seu time agora tem <span class="b-tech">4 ações por rodada</span> e <span class="b-chem">-5% custo de energia</span> nos locais da cidade.`;
      renderAll();
      return;
    }

    // 2. Passiva: Pingente da Resistência Final (não perde stamina após 75' — única vez!)
    if (choiceEvent.kind === "PASSIVE_LATE_RESIST") {
      if (!t.prepBonuses.lateMatchNoStaminaLoss) {
        t.prepBonuses.lateMatchNoStaminaLoss = true;
        t.prepBonuses.log.push("Resistência Final (Fôlego aos 75'+)");
      }
      prep.phase = "DONE";
      prep.affectedPlayers = [];
      prep.appliedMsg = `Passiva equipada: os 11 titulares possuem <span class="b-chem">fôlego infinito</span> a partir dos 75' de jogo.`;
      renderAll();
      return;
    }

    // 2.5 Bebida Energética
    if (choiceEvent.kind === "ENERGY_DRINK") {
      const prevE = Math.round(getTeamEnergy());
      const gain = choiceEvent.energyGain || 35;
      const nextE = Math.round(adjustTeamEnergy(gain));
      const pwr = choiceEvent.teamPower || 12;
      t.prepBonuses.power += pwr;
      t.prepBonuses.log.push(`${choiceEvent.title} (+${gain}% Energia)`);
      prep.phase = "DONE";
      prep.affectedPlayers = [];
      prep.appliedMsg = `<span class="b-chem">+${gain}% de Energia do Time</span> (${prevE}% ➔ ${nextE}%) e <span class="b-pwr">+${pwr} Poder</span>!`;
      renderAll();
      return;
    }

    // 2.6 Buffs Escaláveis (Nv. 1 -> 2 -> 3)
    if (choiceEvent.kind === "SCALABLE_BUFF") {
      const key = choiceEvent.buffKey;
      const maxL = choiceEvent.maxLevel || 3;
      const prevL = t.prepBonuses[key] || 0;
      const nextL = Math.min(maxL, prevL + 1);
      const beforePwrBySlot = {};
      getSlots().forEach((slot) => {
        const p = state.squad[slot.id];
        if (p) beforePwrBySlot[slot.id] = calcIndividualPlayerPower(p, slot.role, getPlayerLevel(p));
      });
      t.prepBonuses[key] = nextL;
      const pwr = choiceEvent.teamPower || 10;
      t.prepBonuses.power += pwr;
      if (key === "enduranceLvl") {
        t.prepBonuses.staminaMul = [1, 0.88, 0.78, 0.68][nextL] || 0.68;
      }
      const affected = [];
      const collectAffectedRoles = (roles, badgeTxt) => {
        getSlots().forEach((slot) => {
          const p = state.squad[slot.id];
          if (!p || (roles && !roles.includes(slot.role))) return;
          const lvl = getPlayerLevel(p);
          const beforeP = beforePwrBySlot[slot.id] || calcIndividualPlayerPower(p, slot.role, lvl);
          const afterP = calcIndividualPlayerPower(p, slot.role, lvl);
          affected.push({
            name: p.name,
            role: slot.role,
            sprite: getPlayerFormSprite(p, slot.role),
            prevLevel: lvl,
            newLevel: lvl,
            levelsGained: 0,
            pwrGained: Math.max(0, afterP - beforeP),
            newPwr: afterP,
            learnedMoves: [],
            extraBadge: badgeTxt
          });
        });
      };

      let effectTxt = "";
      if (key === "efficiencyLvl") effectTxt = `<span class="b-chem">-${nextL * 3}% custo de energia</span> nos locais da cidade`;
      else if (key === "restLvl") effectTxt = `Descansar agora recupera <span class="b-chem">+${60 + nextL * 10}% de Energia</span>`;
      else if (key === "enduranceLvl") {
        const pct = [0, 12, 22, 32][nextL] || 32;
        effectTxt = `<span class="b-chem">-${pct}% gasto de energia</span> em técnicas e desgaste de campo`;
      } else if (key === "wingExplosionLvl") {
        collectAffectedRoles(["FW", "MF"], `+${nextL * 3} VEL/FOR`);
        effectTxt = `<span class="b-chem">+3 VEL e +3 FOR</span> acumulados (<span class="b-pwr">+${nextL * 3} total</span>) para Atacantes e Meias`;
      } else if (key === "midSynergyLvl") {
        t.prepBonuses.chem = (t.prepBonuses.chem || 0) + (choiceEvent.teamChem || 4);
        collectAffectedRoles(["MF"], `+${nextL * 3} TEC`);
        effectTxt = `<span class="b-tech">+3 TEC</span> nos Meias (<span class="b-pwr">+${nextL * 3} total</span>) e <span class="b-chem">+4% Química</span>`;
      } else if (key === "defBlockLvl") {
        collectAffectedRoles(["GK", "DF"], `+${nextL * 3} DEF/FIS`);
        effectTxt = `<span class="b-pwr">+3 DEF e +3 FIS</span> acumulados (<span class="b-pwr">+${nextL * 3} total</span>) em Goleiro e Zaga`;
      } else if (key === "hissatsuMasteryLvl") {
        const val = [0, 0.8, 1.6, 2.5][nextL] || 2.5;
        effectTxt = `<span class="b-pwr">+${val} de força extra</span> nos duelos ao usar técnicas`;
      } else if (key === "xpSpiritLvl") {
        effectTxt = `<span class="b-lvl">+${nextL * 15}% XP</span> ganho após cada partida oficial`;
      } else if (key === "passBypassLvl") {
        const pct = [0, 15, 28, 40][nextL] || 40;
        effectTxt = `<span class="b-chem">-${pct}% chance</span> de interceptação nos passes do time`;
      } else if (key === "counterShotLvl") {
        const pct = [0, 12, 24, 35][nextL] || 35;
        const pwrB = [0, 1.0, 2.0, 3.2][nextL] || 3.2;
        effectTxt = `<span class="b-tech">+${pct}% chance</span> de Contra-Chute e <span class="b-pwr">+${pwrB} força</span>`;
      } else if (key === "dribbleEdgeLvl") {
        const val = [0, 1.2, 2.4, 3.6][nextL] || 3.6;
        effectTxt = `<span class="b-pwr">+${val} de força</span> nos duelos de drible (bônus extra no corredor tático)`;
      }

      t.prepBonuses.log.push(`${choiceEvent.title} Nv. ${nextL}`);
      prep.phase = "DONE";
      prep.affectedPlayers = affected;
      const tierCls = nextL >= 3 ? "b-lvl" : nextL === 2 ? "b-tech" : "b-chem";
      prep.appliedMsg = `<span class="${tierCls}">${choiceEvent.title} (Nv. ${prevL} ➔ Nv. ${nextL}/${maxL})</span>: ${effectTxt} e <span class="b-pwr">+${pwr} Poder</span>.`;
      renderAll();
      return;
    }

    // 3. 5v5 com Estrela Desafiante
    if (choiceEvent.kind === "STREET_5V5") {
      prep.clash5v5 = buildStreet5v5Matchup();
      prep.phase = "RESULT";
      renderTournamentScreen();
      return;
    }

    // 4. Coletivos normais
    if (choiceEvent.kind === "COLLECTIVE") {
      applyPrepCollectiveEvent(choiceEvent);
      return;
    }

    // 5. Itens, Keshin ou Evolução para 1 jogador selecionado do elenco
    prep.phase = "RESULT";
    renderTournamentScreen();
  }

  function handleRecruitStarPlayer(starRecruit, replaceSlotId) {
    const t = state.tournament;
    const prep = t.prep;
    if (!prep || !starRecruit || !replaceSlotId) return;

    const oldPlayer = state.squad[replaceSlotId];
    const nextIdx = prep.nextStageIdx ?? t.stageIndex ?? 0;
    const stageTargetLvl = STAGE_OPPONENT_LEVELS[Math.min(nextIdx, STAGE_OPPONENT_LEVELS.length - 1)] || 1;
    const recruitLvl = Math.max(getPlayerLevel(oldPlayer) + 1, stageTargetLvl);
    const newP = {
      ...starRecruit.player,
      level: recruitLvl,
      xp: 0,
      teamId: starRecruit.teamId,
      teamName: starRecruit.teamName,
      teamEmblem: starRecruit.emblem
    };
    state.squad[replaceSlotId] = newP;
    const newPwr = calcIndividualPlayerPower(newP, starRecruit.role || newP.pos, recruitLvl);
    prep.phase = "DONE";
    prep.appliedMsg = `⭐ RECRUTAMENTO OFICIAL! ${newP.name} (OVR ${newP.ovr} • Nv. ${recruitLvl} • Poder ${newPwr}) entrou como titular no lugar de ${oldPlayer?.name || "titular"}!`;
    t.prepBonuses.log.push(`Recrutou ${newP.name} (Nv.${recruitLvl})`);
    renderAll();
  }

  function applyPrepCollectiveEvent(event) {
    const t = state.tournament;
    if (!t.prep) return;
    const slots = getSlots();
    const affectedPlayers = [];
    let totalPowerGainedFromLevels = 0;
    const lvlGain = event.levelGain || event.ovrBoost || 0;
    const indivPwrGain = event.indivPower || 0;

    slots.forEach((slot) => {
      const p = state.squad[slot.id];
      if (!p) return;
      if (!event.applyRoles || event.applyRoles.includes(slot.role)) {
        const prevLvl = getPlayerLevel(p);
        const beforePwr = calcIndividualPlayerPower(p, slot.role, prevLvl);
        if (lvlGain > 0) {
          p.level = prevLvl + lvlGain;
        }
        if (indivPwrGain > 0) {
          p.bonusPower = (p.bonusPower || 0) + indivPwrGain;
        }
        const newLvl = getPlayerLevel(p);
        const learnedMoves = lvlGain > 0 ? checkAndLearnLevelMoves(p, slot.role) : [];
        const afterPwr = calcIndividualPlayerPower(p, slot.role, newLvl);
        const pwrGained = Math.max(0, afterPwr - beforePwr);
        totalPowerGainedFromLevels += pwrGained;
        affectedPlayers.push({
          name: p.name,
          role: slot.role,
          sprite: getPlayerFormSprite(p, slot.role),
          prevLevel: prevLvl,
          newLevel: newLvl,
          levelsGained: Math.max(0, newLvl - prevLvl),
          pwrGained,
          newPwr: afterPwr,
          learnedMoves
        });
      }
    });
    t.prepBonuses.xp += event.xpGain || 0;
    t.prepBonuses.chem += event.teamChem || 0;
    t.prepBonuses.power += event.teamPower || 0;
    if (event.staminaMul) {
      t.prepBonuses.staminaMul = Math.min(t.prepBonuses.staminaMul || 1, event.staminaMul);
    }
    if (event.id === "tire_training") {
      t.prepBonuses.tireTrainingDone = true;
    }
    if (event.elemResonance) {
      t.prepBonuses.elemResonance = true;
    }
    t.prepBonuses.log.push(event.title);
    t.prep.phase = "DONE";
    t.prep.affectedPlayers = affectedPlayers;
    const totalPwr = totalPowerGainedFromLevels + (event.teamPower || 0);
    t.prep.appliedMsg = `${event.title} concluído: <span class="b-lvl">${affectedPlayers.length} jogador(es)</span> evoluíram (<span class="b-pwr">+${totalPwr} Poder Total</span>${event.teamChem ? ` • <span class="b-chem">+${event.teamChem}% Química</span>` : ""}).`;
    renderAll();
  }

  function applyPrepPlayerReward(slotId) {
    const t = state.tournament;
    const prep = t.prep;
    const event = prep?.event;
    const player = state.squad[slotId];
    const slot = getSlots().find((s) => s.id === slotId);
    if (!prep || !event || !player || !slot) return;

    let msg = "";
    const affectedPlayers = [];
    const lvlGain = event.levelGain || event.ovrBoost || 1;
    const indivPwrGain = event.indivPower || 28;
    const prevLvl = getPlayerLevel(player);
    const beforePwr = calcIndividualPlayerPower(player, slot.role, prevLvl);

    if (event.kind === "ELEM_BOOST_PICK") {
      const targetElem = player.element || "Fogo";
      if (!Array.isArray(player.equippedItems)) player.equippedItems = [];
      player.equippedItems.push({ id: event.id, title: `${event.title} (${targetElem})`, icon: event.icon });
      t.prepBonuses.boostedElement = targetElem;
      let totalElemPwr = 0;
      getSlots().forEach((s) => {
        const mate = state.squad[s.id];
        if (mate && mate.element === targetElem) {
          const mPrevLvl = getPlayerLevel(mate);
          const bPwr = calcIndividualPlayerPower(mate, s.role, mPrevLvl);
          mate.level = mPrevLvl + lvlGain;
          mate.bonusPower = (mate.bonusPower || 0) + indivPwrGain;
          const mNewLvl = getPlayerLevel(mate);
          const learnedMoves = checkAndLearnLevelMoves(mate, s.role);
          const aPwr = calcIndividualPlayerPower(mate, s.role, mNewLvl);
          const mDelta = Math.max(0, aPwr - bPwr);
          totalElemPwr += mDelta;
          affectedPlayers.push({
            name: mate.name,
            role: s.role,
            sprite: getPlayerFormSprite(mate, s.role),
            prevLevel: mPrevLvl,
            newLevel: mNewLvl,
            levelsGained: Math.max(0, mNewLvl - mPrevLvl),
            pwrGained: mDelta,
            newPwr: aPwr,
            learnedMoves
          });
        }
      });
      msg = `Ressonância de <span class="b-tech">${targetElem}</span>: <span class="b-lvl">${affectedPlayers.length} jogador(es)</span> evoluíram (<span class="b-pwr">+${totalElemPwr + (event.teamPower || 0)} Poder Total</span>).`;
    } else if (event.kind === "ITEM_PICK" || event.kind === "MANUAL_PICK") {
      if (!Array.isArray(player.equippedItems)) player.equippedItems = [];
      const alreadyHas = player.equippedItems.some((it) => it.id === event.id || it.title === event.title);
      if (!alreadyHas) {
        player.level = prevLvl + lvlGain;
        player.bonusPower = (player.bonusPower || 0) + indivPwrGain;
        if (event.spdBoost) {
          player.bonusSpd = (player.bonusSpd || 0) + event.spdBoost;
        }
        if (!player.bonusStats) player.bonusStats = { for: 0, tec: 0, def: 0, vel: 0, fis: 0 };
        if (event.id === "shoes_legend") { player.bonusStats.for += 5; player.bonusStats.vel += 4; }
        else if (event.id === "shoes_thunder") { player.bonusStats.vel += 6; player.bonusStats.tec += 3; }
        else if (event.id === "glove_legend") { player.bonusStats.def += 6; player.bonusStats.fis += 3; }
        else if (event.id === "spike_block") { player.bonusStats.def += 5; player.bonusStats.fis += 4; }
        else if (event.id === "bracelet_friendship" || event.id === "misanga_friend" || event.id === "captain_armband") {
          player.bonusStats.tec += 4; player.bonusStats.for += 3; player.bonusStats.fis += 3;
        }
        player.equippedItems.push({ id: event.id, title: event.title, icon: event.icon });
      }
      const newLvl = getPlayerLevel(player);
      const learnedMoves = checkAndLearnLevelMoves(player, slot.role);
      const afterPwr = calcIndividualPlayerPower(player, slot.role, newLvl);
      const pwrDelta = Math.max(0, afterPwr - beforePwr);
      affectedPlayers.push({
        name: player.name,
        role: slot.role,
        sprite: getPlayerFormSprite(player, slot.role),
        prevLevel: prevLvl,
        newLevel: newLvl,
        levelsGained: Math.max(0, newLvl - prevLvl),
        pwrGained: pwrDelta,
        newPwr: afterPwr,
        learnedMoves
      });
      msg = `${player.name} equipou <span class="b-tech">${event.title}</span> (<span class="b-lvl">Nv. ${prevLvl} → Nv. ${newLvl}</span> • <span class="b-pwr">+${pwrDelta} Poder</span>).`;
    } else if (event.kind === "KESHIN_PICK") {
      if (!player.keshin) {
        const pool = CANONICAL_KESHINS[slot.role] || CANONICAL_KESHINS.MF;
        const chosenK = pool[Math.floor(Math.random() * pool.length)];
        player.keshin = { name: chosenK.name, icon: UI[chosenK.iconKey] || UI.keshinIcon };
        player.level = prevLvl + lvlGain;
        player.bonusPower = (player.bonusPower || 0) + indivPwrGain;
        const newLvl = getPlayerLevel(player);
        const learnedMoves = checkAndLearnLevelMoves(player, slot.role);
        const afterPwr = calcIndividualPlayerPower(player, slot.role, newLvl);
        const pwrDelta = Math.max(0, afterPwr - beforePwr);
        affectedPlayers.push({
          name: player.name,
          role: slot.role,
          sprite: getPlayerFormSprite(player, slot.role),
          prevLevel: prevLvl,
          newLevel: newLvl,
          levelsGained: Math.max(0, newLvl - prevLvl),
          pwrGained: pwrDelta,
          newPwr: afterPwr,
          extraBadge: `Keshin: ${chosenK.name}`,
          learnedMoves
        });
        msg = `${player.name} despertou <span class="b-tech">${chosenK.name}</span> (<span class="b-lvl">Nv. ${prevLvl} → Nv. ${newLvl}</span> • <span class="b-pwr">+${pwrDelta} Poder</span>).`;
      } else {
        msg = `${player.name} já possui a Incorporação ${player.keshin.name}.`;
      }
    } else if (event.kind === "EVO_PICK") {
      let techBadge = "";
      if (event.id === "secret_hissatsu_mastery") {
        const learnedMove = applySecretManualMastery(player, slot.role);
        techBadge = `Técnica: ${learnedMove}`;
      } else {
        const evo = evolvePlayerPrimaryMove(player, slot.role);
        techBadge = evo ? `Evolução: ${evo.nextName}` : "Técnica Aperfeiçoada";
      }
      player.level = prevLvl + lvlGain;
      player.bonusPower = (player.bonusPower || 0) + indivPwrGain;
      const newLvl = getPlayerLevel(player);
      const learnedMoves = checkAndLearnLevelMoves(player, slot.role);
      const afterPwr = calcIndividualPlayerPower(player, slot.role, newLvl);
      const pwrDelta = Math.max(0, afterPwr - beforePwr);
      affectedPlayers.push({
        name: player.name,
        role: slot.role,
        sprite: getPlayerFormSprite(player, slot.role),
        prevLevel: prevLvl,
        newLevel: newLvl,
        levelsGained: Math.max(0, newLvl - prevLvl),
        pwrGained: pwrDelta,
        newPwr: afterPwr,
        extraBadge: techBadge,
        learnedMoves
      });
      msg = `${player.name} dominou <span class="b-tech">${techBadge}</span> (<span class="b-lvl">Nv. ${prevLvl} → Nv. ${newLvl}</span> • <span class="b-pwr">+${pwrDelta} Poder</span>).`;
    }

    t.prepBonuses.xp += event.xpGain || 80;
    t.prepBonuses.chem += event.teamChem || 0;
    t.prepBonuses.power += event.teamPower || 0;
    t.prepBonuses.log.push(`${event.title} (${player.name})`);
    prep.phase = "DONE";
    prep.affectedPlayers = affectedPlayers;
    prep.appliedMsg = msg;
    renderAll();
  }

  function runStreet5v5Challenge() {
    const t = state.tournament;
    const prep = t.prep;
    const c5 = prep?.clash5v5;
    if (!prep || !c5 || c5.status !== "READY") return;

    clearTournamentTimers(false);
    c5.status = "RUNNING";
    c5.xpSummary = [];

    const miniSt = {
      stageName: "Margem do Rio (5x5)",
      oppTeam: {
        id: "street_5v5",
        name: "Desafiantes 5x5",
        emblem: UI.ffLogo || UI.raimonEmblem
      },
      minute: 0,
      maxMinute: 99,
      userScore: 0,
      oppScore: 0,
      goalsUser: [],
      goalsOpp: [],
      narration: [
        {
          cls: "",
          iconCat: "FF",
          text: "0' Começa o 5x5 na Margem do Rio (1 GK + 4 linha) — quem fizer o 1º gol vence!"
        }
      ],
      running: true,
      finished: false,
      won: null,
      penalties: null,
      penaltiesText: null,
      isGoldenGoal5v5: true,
      _goldenHandled: false,
      pitch: null,
      onGoldenGoalDone: (finishedSt, scorerName) => {
        if (!state.tournament.prep || state.tournament.prep.clash5v5 !== c5) return;
        c5.status = "DONE";
        const won = finishedSt.userScore > finishedSt.oppScore;
        const pwr = won ? 22 : -20;
        let totalXpGiven = 0;

        c5.xpSummary = c5.userQuintet.map((entry) => {
          const p = entry.player;
          const role = entry.slot?.role || entry.role;
          const isScorer = won && scorerName && p.name === scorerName;
          const xpAmt = won ? (isScorer ? 150 : 120) : 50;
          totalXpGiven += xpAmt;
          const prevLvl = getPlayerLevel(p);
          const beforePwr = calcIndividualPlayerPower(p, role, prevLvl);
          const res = gainPlayerXp(p, xpAmt, role);
          const newLvl = getPlayerLevel(p);
          const afterPwr = calcIndividualPlayerPower(p, role, newLvl);
          return {
            name: p.name,
            role,
            sprite: getPlayerFormSprite(p, role),
            xpGained: res.xpGained,
            levelsGained: res.levelsGained,
            prevLevel: prevLvl,
            newLevel: newLvl,
            pwrGained: Math.max(0, afterPwr - beforePwr),
            newPwr: afterPwr,
            curXp: res.currentXp,
            learnedMoves: res.learnedMoves || [],
            isScorer
          };
        });

        t.prepBonuses.xp += totalXpGiven;
        t.prepBonuses.power += pwr;
        t.prepBonuses.log.push(`5x5 Margem do Rio (${finishedSt.userScore}x${finishedSt.oppScore})`);
        let drinkMsg = "";
        if (won) {
          const prevE = Math.round(getTeamEnergy());
          const nextE = Math.round(adjustTeamEnergy(25));
          drinkMsg = ` + <span class="b-chem">Bebida Energética (+25% Energia: ${prevE}% ➔ ${nextE}%)</span>`;
        }
        
        // Se venceu e havia um craque adversário, abre a oportunidade de RECRUTAMENTO!
        if (won && c5.starRecruit) {
          prep.phase = "RECRUIT_OFFER";
          prep.recruitCandidate = c5.starRecruit;
          prep.appliedMsg = `Vitória épica por Gol de Ouro (1 x 0${scorerName ? ` · ${scorerName}` : ""})! Os 5 participantes subiram +2 Níveis${drinkMsg} e o craque rival ${c5.starRecruit.player.name} (OVR ${c5.starRecruit.player.ovr}) quer se juntar ao seu Dream Team!`;
        } else {
          prep.phase = "DONE";
          prep.appliedMsg = won
            ? `Vitória por Gol de Ouro (1 x 0${scorerName ? ` · ${scorerName}` : ""})! Todos os 5 participantes subiram +2 Níveis${drinkMsg} e o time ganhou +${pwr} Poder!`
            : `Os Desafiantes venceram o Gol de Ouro (0 x 1). O time sentiu a pressão (-20 Poder), mas ganhou +${totalXpGiven} XP de aprendizado.`;
        }
        renderAll();
      }
    };

    miniSt.pitch = initStreet5v5PitchState(miniSt, c5);
    c5.miniSt = miniSt;

    renderTournamentScreen();
    ensureMatchSupport(miniSt, miniSt.pitch);
    startPitchRafLoop(miniSt);
  }

  function buildTeamEnergyBarHTML(isLive = false) {
    const val = Math.round(getTeamEnergy());
    const band = getTeamEnergyBand(val);
    return `
      <div class="team-energy-strip ${isLive ? "is-live" : ""}" style="border-color:${band.border}; background:${band.bg};">
        <div class="team-energy-row">
          <span class="team-energy-title">⚡ Energia do Time: <strong id="${isLive ? "live-team-energy-pill" : "prep-team-energy-pill"}" style="color:${band.color};">${val}% (${band.label})</strong></span>
          <span class="team-energy-desc">${band.desc}</span>
        </div>
        <div class="team-energy-bar-bg">
          <div class="team-energy-bar-fill" id="${isLive ? "live-team-energy-fill" : "prep-team-energy-fill"}" style="width:${val}%; background:${band.color};"></div>
        </div>
      </div>
    `;
  }

  function buildTacticsControlBarHTML(showSquadBtn = false) {
    const tac = getTactics();
    const pillBtn = (attr, val, label, active) =>
      `<button type="button" class="tac-pill-btn ${active ? "is-active" : ""}" ${attr}="${val}">${label}</button>`;

    return `
      <div class="tactics-control-bar">
        <div class="tac-group">
          <span class="tac-label">Intensidade</span>
          <div class="tac-pills">
            ${pillBtn("data-tac-intensity", "low", "Baixa", tac.intensity === "low")}
            ${pillBtn("data-tac-intensity", "medium", "Média", tac.intensity === "medium")}
            ${pillBtn("data-tac-intensity", "high", "Alta", tac.intensity === "high")}
          </div>
        </div>
        <div class="tac-group">
          <span class="tac-label">Postura</span>
          <div class="tac-pills">
            ${pillBtn("data-tac-posture", "defensive", "Recuado", tac.posture === "defensive")}
            ${pillBtn("data-tac-posture", "balanced", "Equilibrado", tac.posture === "balanced")}
            ${pillBtn("data-tac-posture", "offensive", "Avançado", tac.posture === "offensive")}
          </div>
        </div>
        <div class="tac-group">
          <span class="tac-label">Ataque</span>
          <div class="tac-pills">
            ${pillBtn("data-tac-lane", "wings", "Pontas", tac.lane === "wings")}
            ${pillBtn("data-tac-lane", "balanced", "Livre", tac.lane === "balanced")}
            ${pillBtn("data-tac-lane", "center", "Meio", tac.lane === "center")}
          </div>
        </div>
        ${showSquadBtn ? `
          <div class="tac-group tac-squad-group">
            <button type="button" class="ie-cmd-btn ie-cmd-gold tac-squad-btn" id="btn-open-squad-modal">
              <span>Ver Escalação (${state.formation})</span>
            </button>
          </div>
        ` : ""}
      </div>
    `;
  }

  function bindTacticsControls(rootEl, onFormationChanged = null) {
    if (!rootEl) return;
    const syncActive = (attr, val) => {
      rootEl.querySelectorAll(`[${attr}]`).forEach((b) => {
        b.classList.toggle("is-active", b.getAttribute(attr) === val);
      });
    };
    rootEl.querySelectorAll("[data-tac-formation]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const fk = btn.getAttribute("data-tac-formation");
        if (switchTeamFormation(fk)) {
          syncActive("data-tac-formation", fk);
          if (typeof onFormationChanged === "function") onFormationChanged(fk);
        }
      });
    });
    rootEl.querySelectorAll("[data-tac-intensity]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-tac-intensity");
        getTactics().intensity = val;
        syncActive("data-tac-intensity", val);
      });
    });
    rootEl.querySelectorAll("[data-tac-posture]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-tac-posture");
        getTactics().posture = val;
        syncActive("data-tac-posture", val);
      });
    });
    rootEl.querySelectorAll("[data-tac-lane]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-tac-lane");
        getTactics().lane = val;
        syncActive("data-tac-lane", val);
      });
    });
  }

  function buildActiveScalableBuffsHTML(t) {
    const b = t?.prepBonuses || {};
    const defs = [
      { key: "efficiencyLvl", label: "Eficiência" },
      { key: "restLvl", label: "Descanso" },
      { key: "enduranceLvl", label: "Resistência" },
      { key: "wingExplosionLvl", label: "Alas VEL/FOR" },
      { key: "midSynergyLvl", label: "Meio TEC" },
      { key: "defBlockLvl", label: "Bloco DEF/FIS" },
      { key: "hissatsuMasteryLvl", label: "Maestria" },
      { key: "xpSpiritLvl", label: "Espírito XP" },
      { key: "passBypassLvl", label: "Passe Cirúrgico" },
      { key: "counterShotLvl", label: "Contra-Chute" },
      { key: "dribbleEdgeLvl", label: "Drible" }
    ];
    const active = defs.filter((d) => (b[d.key] || 0) > 0);
    if (active.length === 0) return "";
    return `
      <div class="active-scalable-buffs-row">
        ${active
          .map((d) => {
            const lvl = b[d.key];
            const cls = lvl >= 3 ? "is-nv3" : lvl === 2 ? "is-nv2" : "is-nv1";
            return `<span class="scalable-buff-chip ${cls}">${d.label} <strong>Nv.${lvl}</strong></span>`;
          })
          .join("")}
      </div>
    `;
  }

  function buildOpponentScoutCardHTML(nextStage, stageIdx) {
    const oppTeam = nextStage?.oppTeam;
    if (!oppTeam) return "";
    const oppStats = calcOpponentStats(oppTeam, stageIdx);
    const highlights = oppStats.highlights || [];
    return `
      <div class="opp-scout-card">
        <div class="opp-scout-head">
          <div class="opp-scout-team-info">
            ${oppTeam.emblem ? `<img src="${oppTeam.emblem}" alt="" class="opp-scout-emblem" />` : ""}
            <div>
              <div class="opp-scout-eyebrow">Scout do Adversário • Nv. ${oppStats.oppLevel || 1}</div>
              <div class="opp-scout-team-name">${oppTeam.name}</div>
            </div>
          </div>
          <div class="opp-scout-stats-row">
            <span class="opp-stat-pill">ATQ <strong>${oppStats.atk}</strong></span>
            <span class="opp-stat-pill">MEI <strong>${oppStats.mid}</strong></span>
            <span class="opp-stat-pill">DEF <strong>${oppStats.def}</strong></span>
            <span class="opp-stat-pill">OVR <strong>${oppStats.ovr}</strong></span>
            <span class="opp-stat-pill">Quím <strong>${oppStats.chem}%</strong></span>
            <span class="opp-stat-pill is-pwr">Poder <strong>${oppStats.power.toLocaleString("pt-BR")}</strong></span>
          </div>
        </div>
        <div class="opp-scout-subhead">4 Destaques do Rival</div>
        <div class="opp-scout-highlights-grid">
          ${highlights
            .map((h) => {
              const p = h.player;
              return `
                <div class="opp-scout-player">
                  <img class="opp-scout-avatar" src="${getPlayerFormSprite(p, h.role)}" alt="${p.name}" />
                  <div class="opp-scout-pinfo">
                    <div class="opp-scout-pname-row">
                      ${posIconHTML(h.role, true)}
                      ${elemIconHTML(p.element, "inline-elem-icon")}
                      <span class="opp-scout-pname">${p.name}</span>
                    </div>
                    <div class="opp-scout-pmeta">
                      <span>OVR ${h.effOvr}</span> • <span class="b-pwr">Poder ${h.indivPower}</span>
                    </div>
                    <div class="opp-scout-pmove">${h.primaryMove}</div>
                    ${
                      h.keshin
                        ? `<div class="opp-scout-keshin-pill">Keshin: ${h.keshin.name}</div>`
                        : ""
                    }
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  function buildBetweenMatchPrepHTML(t, stats) {
    const prep = t.prep;
    const nextStage = t.stages[prep.nextStageIdx];
    const locations = getPrepLocationsCatalog();
    const activeLoc = locations.find((l) => l.id === prep.locId);
    const isFirstMatchEver = prep.nextStageIdx === 0;
    const isWorldDebut = nextStage.competition === "WORLD" && nextStage.isGroupStage && nextStage.groupRoundIdx === 0;

    let bodyHTML = "";
    let topBannerHTML = "";

    const curTeamEnergy = Math.round(getTeamEnergy());
    const remActions = Math.max(0, prep.eventsRemaining || 0);
    const totActions = prep.eventsTotal || (t.prepBonuses?.permanentDoublePrep ? 4 : 3);

    if (prep.phase === "CHOOSE_LOC") {
      const prepHeadline = isFirstMatchEver
        ? "Prepare seu Dream Team antes da partida de estreia!"
        : isWorldDebut
        ? "Prepare a seleção para a estreia na Fase de Grupos do Mundial!"
        : "Escolha até 3 ações na cidade ou vá direto para a partida:";

      topBannerHTML = `
        <div class="prep-top-banner">
          <div style="flex:1; min-width:220px;">
            <h3 style="font-size:1.0rem; font-weight:900; color:#fff; margin:0 0 6px 0;">
              ${prepHeadline}
            </h3>
            ${buildTeamEnergyBarHTML(false)}
          </div>
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="prep-xp-pill">Ações: ${remActions}/${totActions}</span>
            <button class="ie-cmd-btn ie-cmd-green" id="btn-prep-proceed">
              <span>Ir para ${nextStage.stageName} →</span>
            </button>
          </div>
        </div>
      `;

      const mapImgSrc = UI.inazumaMap || UI.locTown || UI.stadiumBg;
      const mapStageHTML = mapImgSrc
        ? `
          <div class="prep-inazuma-map-stage">
            <img class="prep-inazuma-map-img" src="${mapImgSrc}" alt="Mapa da Cidade de Inazuma" />
            <div class="prep-inazuma-map-shade"></div>
            <div class="prep-map-header-tag">
              <span>Onde quer ir? • ${remActions} ${remActions === 1 ? "ação restante" : "ações restantes"}</span>
            </div>
            <div class="prep-map-footer-tag">
              ${UI.iconDestVR ? `<img src="${UI.iconDestVR}" alt="" />` : "⚡"}
              <span>Inazuma</span>
            </div>
            ${locations
              .map(
                (loc) => {
                  const reqCost = getPrepLocationCost(loc, t);
                  const restGain = getRestEnergyGain(t);
                  const isDisabled = !loc.isRestLocation && curTeamEnergy < reqCost;
                  const pinTitle = isDisabled
                    ? `${loc.title} — Energia insuficiente (precisa de ${reqCost}%)`
                    : `${loc.title} — ${loc.sub}`;
                  const energyBadge = loc.isRestLocation
                    ? `<span class="pin-energy-tag is-gain">+${restGain}%</span>`
                    : `<span class="pin-energy-tag is-cost">-${reqCost}%</span>`;
                  return `
              <div class="prep-map-pin ${loc.isRestLocation ? "is-rest-pin" : ""} ${isDisabled ? "is-disabled" : ""}" data-prep-loc="${loc.id}" style="left:${loc.mapX || 50}%; top:${loc.mapY || 50}%;" title="${pinTitle}">
                <div class="prep-map-pin-orb">
                  ${loc.badgeIcon ? `<img class="pin-main-icon" src="${loc.badgeIcon}" alt="${loc.title}" />` : ""}
                  ${loc.subIcon ? `<span class="prep-map-pin-sub"><img src="${loc.subIcon}" alt="" /></span>` : ""}
                  ${energyBadge}
                </div>
                <span class="prep-map-pin-label">${loc.mapLabel || loc.title}</span>
              </div>
            `;
                }
              )
              .join("")}
          </div>
        `
        : "";

      bodyHTML = `
        ${mapStageHTML}
        ${buildActiveScalableBuffsHTML(t)}
        ${buildTacticsControlBarHTML(true)}
        ${buildOpponentScoutCardHTML(nextStage, prep.nextStageIdx)}
      `;
    } else if (prep.phase === "PICK_CHOICE" || prep.phase === "SPINNING_CHOICES") {
      const slotColsHTML = (prep.choices || []).map((chosenWinner, sIdx) => {
        let rarityCls = "";
        let badgeTxt = `OPÇÃO ${sIdx + 1}`;
        if (chosenWinner.kind === "SCALABLE_BUFF") {
          const curL = t.prepBonuses?.[chosenWinner.buffKey] || 0;
          const nextL = Math.min(chosenWinner.maxLevel || 3, curL + 1);
          rarityCls = nextL >= 3 ? "rarity-nv3" : nextL === 2 ? "rarity-nv2" : "rarity-nv1";
          badgeTxt = nextL >= 3 ? "NV. 3 ★" : nextL === 2 ? "NV. 2" : "NV. 1";
        } else if (chosenWinner.kind === "PASSIVE_DOUBLE_EVENT" || chosenWinner.kind === "PASSIVE_LATE_RESIST") {
          rarityCls = "rarity-unique";
          badgeTxt = "PASSIVA";
        }
        return `
          <div class="prep-slot-col is-clickable-choice ${rarityCls}" data-prep-choice-idx="${sIdx}">
            <div class="prep-slot-col-header">
              <span class="prep-slot-badge">${badgeTxt}</span>
            </div>
            <div class="prep-choice-card-body is-revealed-choice">
              <div class="prep-choice-name">${chosenWinner.title}</div>
              <div class="prep-choice-buff-pill">${getPrepBuffPill(chosenWinner)}</div>
              <div class="prep-choice-icon-wrap">
                ${chosenWinner.icon ? `<img src="${chosenWinner.icon}" alt="" />` : ""}
              </div>
              <div class="prep-choice-summary">${getPrepChoiceSummary(chosenWinner)}</div>
              <button class="ie-cmd-btn ie-cmd-gold prep-btn-pick" data-prep-choice-idx="${sIdx}">
                <span>ESCOLHER</span>
              </button>
            </div>
          </div>
        `;
      }).join("");

      bodyHTML = `
        <div class="prep-triple-slot-container">
          <div class="prep-triple-header ${activeLoc?.banner ? "has-loc-hero" : ""}">
            ${activeLoc?.banner ? `<img class="prep-loc-hero-bg" src="${activeLoc.banner}" alt="${activeLoc.title || ""}" />` : ""}
            <div class="prep-loc-hero-shade"></div>
            <div class="prep-loc-hero-content">
              <div style="font-size:0.68rem; font-weight:900; color:#facc15; text-transform:uppercase; letter-spacing:0.4px;">${activeLoc?.sub || "LOCAL"}</div>
              <div style="font-size:1.18rem; font-weight:900; color:#fff; line-height:1.2; text-shadow:0 2px 6px rgba(0,0,0,0.8);">${activeLoc?.title || ""}</div>
              <div class="prep-triple-choose-prompt" style="font-size:0.8rem; color:#bae6fd; font-weight:800; margin-top:2px;">
                Escolha 1 opção:
              </div>
            </div>
          </div>
          <div class="prep-triple-cols-grid">
            ${slotColsHTML}
          </div>
        </div>
      `;
    } else if (prep.phase === "RECRUIT_OFFER" && prep.recruitCandidate) {
      const rec = prep.recruitCandidate;
      const recPlayer = rec.player;
      bodyHTML = `
        <div class="prep-recruit-container">
          <div class="prep-recruit-hero">
            <div class="prep-recruit-badge">⭐ OPORTUNIDADE DE RECRUTAMENTO DE CRAQUE ⭐</div>
            <div style="font-size:1.15rem; font-weight:900; color:#fff; margin-top:6px;">
              ${recPlayer.name} (OVR ${recPlayer.ovr} · ${recPlayer.pos}) quer jogar no seu time!
            </div>
            <div style="font-size:0.78rem; color:#cbd5e1; max-width:620px; margin:4px auto 0;">
              Após a derrota no 5x5, este craque do ${rec.teamName} reconheceu a força da sua equipe e quer uma vaga como titular.
              Selecione quem você deseja substituir no seu time principal:
            </div>
          </div>

          <div class="prep-recruit-card-preview">
            <img class="prep-recruit-img" src="${recPlayer.sprite}" alt="${recPlayer.name}" />
            <div>
              <div style="font-size:1.05rem; font-weight:900; color:#fde047;">${recPlayer.name}</div>
              <div style="font-size:0.78rem; font-weight:800; color:#93c5fd;">${posIconHTML(recPlayer.pos, true)} OVR ${recPlayer.ovr} • ${rec.teamName}</div>
              <div style="font-size:0.72rem; color:#cbd5e1; margin-top:2px;">Técnica: <strong>${recPlayer.hissatsu || "Super Técnica"}</strong></div>
            </div>
          </div>

          <div style="font-size:0.78rem; font-weight:800; color:#facc15; margin:14px 0 6px;">
            Clique no titular que sairá para dar lugar a ${recPlayer.name}:
          </div>
          <div class="prep-pick-grid">
            ${getSlots().map((slot) => {
              const p = state.squad[slot.id];
              if (!p) return "";
              const curOvr = getEffectiveOvr(p, slot.role);
              const curLvl = getPlayerLevel(p);
              const curPwr = calcIndividualPlayerPower(p, slot.role, curLvl);
              const nextIdx = prep.nextStageIdx ?? t.stageIndex ?? 0;
              const recLvl = Math.max(curLvl + 1, STAGE_OPPONENT_LEVELS[Math.min(nextIdx, STAGE_OPPONENT_LEVELS.length - 1)] || 1);
              const recPwr = calcIndividualPlayerPower({ ...recPlayer, level: recLvl }, slot.role, recLvl);
              return `
                <div class="prep-pick-card is-recruit-target" data-recruit-replace-slot="${slot.id}">
                  <img class="prep-pick-sprite" src="${getPlayerFormSprite(p, slot.role)}" alt="${p.name}" />
                  <div style="min-width:0; flex:1;">
                    <div style="font-size:0.78rem; font-weight:900; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                      ${posIconHTML(slot.role, true)} ${p.name} <span style="color:#86efac;">(Nv.${curLvl})</span>
                    </div>
                    <div style="font-size:0.68rem; font-weight:800; color:#94a3b8;">
                      OVR ${curOvr} • Poder ${curPwr}
                    </div>
                    <div style="font-size:0.64rem; color:#fde047; font-weight:700;">
                      Entra ${recPlayer.name} (OVR ${recPlayer.ovr} • Nv.${recLvl} • Poder ${recPwr})
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>

          <div style="text-align:center; margin-top:14px;">
            <button class="ie-cmd-btn" id="btn-skip-recruit" style="background:#334155;">
              <span>Não quero recrutar (Manter meu time original)</span>
            </button>
          </div>
        </div>
      `;
    } else {
      const is5v5Live = prep.phase === "RESULT" && prep.clash5v5?.status === "RUNNING" && prep.clash5v5?.miniSt;

      let outcomeHTML = "";
      if (prep.phase === "SPINNING") {
        outcomeHTML = `
          <div style="text-align:center; font-size:0.82rem; font-weight:800; color:#fde047; padding:6px 0;">
            ${activeLoc?.spinMsg || `Explorando ${activeLoc?.title || "Inazuma"}...`}
          </div>
        `;
      } else if (prep.phase === "RESULT" && prep.event) {
        const ev = prep.event;
        if (ev.kind === "STREET_5V5" && prep.clash5v5) {
          const c5 = prep.clash5v5;
          if (c5.status === "RUNNING" && c5.miniSt) {
            const mSt = c5.miniSt;
            const livePitchHTML = buildLivePitchBoxHTML(mSt, mSt.oppTeam, stats, {
              ovr: 86,
              power: 900,
              chem: 60
            });
            outcomeHTML = `
              <div class="prep-reward-box">
                <div class="prep-5v5-live-head">
                  <div>
                    <div style="font-size:0.68rem; font-weight:900; color:#facc15; text-transform:uppercase;">MARGEM DO RIO • 5x5 AO VIVO (GOL DE OURO)</div>
                    <div style="font-size:0.82rem; font-weight:800; color:#cbd5e1;">Quem fizer o 1º gol vence!</div>
                  </div>
                  <div class="prep-5v5-score-pill">
                    <span>Dream Team</span>
                    <span id="live-score-user">${mSt.userScore}</span>
                    <span style="color:#93c5fd;">×</span>
                    <span id="live-score-opp">${mSt.oppScore}</span>
                    <span>Desafiantes</span>
                  </div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <button class="ie-cmd-btn" id="btn-prep5-speed" style="padding:5px 10px; font-size:0.72rem;">
                      <span>Vel: ${state.simSpeed}x</span>
                    </button>
                    <div class="minute-clock" id="live-clock-text">${mSt.minute}'</div>
                  </div>
                </div>
                ${livePitchHTML}
                <div class="narration-history-box" style="max-height:130px;">
                  <div class="narration-feed" id="live-narration-feed">
                    ${mSt.narration.map((item) => buildNarrationItemHTML(item)).join("")}
                  </div>
                </div>
              </div>
            `;
          } else {
            const renderMini = (list, sideCls) =>
              list
                .map(
                  (x) => `
                <div class="prep-4v4-mini ${sideCls}">
                  <img src="${x.slot ? getPlayerFormSprite(x.player, x.slot.role) : x.player.sprite}" alt="${x.player.name}" />
                  <div style="min-width:0;">
                    <div style="font-size:0.7rem; font-weight:800; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${x.player.name}</div>
                    <div style="font-size:0.62rem; color:#93c5fd; font-weight:700;">${x.slot?.role || x.role} · OVR ${x.slot ? getEffectiveOvr(x.player, x.slot.role) : x.player.ovr}</div>
                  </div>
                </div>
              `
                )
                .join("");

            outcomeHTML = `
              <div class="prep-reward-box">
                <div class="prep-reward-hero">
                  <div class="prep-reward-icon-frame">
                    ${ev.icon ? `<img src="${ev.icon}" alt="" />` : ""}
                  </div>
                  <div style="flex:1; min-width:200px;">
                    <div style="font-size:0.7rem; font-weight:900; color:#facc15; text-transform:uppercase;">${activeLoc?.resultEyebrow || "Margem do Rio"}</div>
                    <div style="font-size:1.05rem; font-weight:900; color:#fff;">${ev.title}</div>
                    <div style="font-size:0.76rem; color:#cbd5e1;">${ev.summary}</div>
                  </div>
                  <button class="ie-cmd-btn ie-cmd-gold" id="btn-run-5v5">
                    <span>Assistir 5x5 (Gol de Ouro)!</span>
                  </button>
                </div>
                <div class="prep-4v4-matchup">
                  <div class="prep-4v4-side">${renderMini(c5.userQuintet, "is-user")}</div>
                  <div style="font-weight:900; font-size:0.95rem; color:#facc15;">VS</div>
                  <div class="prep-4v4-side">${renderMini(c5.oppQuintet, "is-opp")}</div>
                </div>
              </div>
            `;
          }
        } else {
          // Escolha de jogador elegível para Item / Keshin / Evolução / Manual (sem permitir duplicatas no mesmo jogador!)
          const eligibleSlots = getEligibleSlotsForPrepEvent(ev);
          const pickList = eligibleSlots.length > 0 ? eligibleSlots : getSlots().filter((s) => state.squad[s.id]);

          outcomeHTML = `
            <div class="prep-reward-box">
              <div class="prep-reward-hero">
                <div class="prep-reward-icon-frame">
                  ${ev.icon ? `<img src="${ev.icon}" alt="" />` : ""}
                </div>
                <div style="flex:1; min-width:200px;">
                  <div style="font-size:0.7rem; font-weight:900; color:#facc15; text-transform:uppercase;">${activeLoc?.resultEyebrow || activeLoc?.title || ""}</div>
                  <div style="font-size:1.05rem; font-weight:900; color:#fff;">${ev.title}</div>
                  <div style="font-size:0.76rem; color:#cbd5e1;">${ev.summary}</div>
                </div>
              </div>
              <div style="font-size:0.76rem; font-weight:800; color:#93c5fd;">
                Selecione qual jogador do seu elenco vai receber este bônus:
              </div>
              <div class="prep-pick-grid">
                ${pickList
                  .map((slot) => {
                    const p = state.squad[slot.id];
                    const curOvr = getEffectiveOvr(p, slot.role);
                    const curLvl = getPlayerLevel(p);
                    const lvlGain = ev.levelGain || ev.ovrBoost || 2;
                    const nextLvl = curLvl + lvlGain;
                    const curPwr = calcIndividualPlayerPower(p, slot.role, curLvl);
                    const pwrPerLvl = calcPowerPerLevel(curOvr);
                    const extraItemPwr = (ev.indivPower || 35) + (ev.kind === "KESHIN_PICK" ? 38 : ev.id === "secret_hissatsu_mastery" ? 50 : ev.kind === "EVO_PICK" ? 22 : 0);
                    const nextPwr = curPwr + lvlGain * pwrPerLvl + extraItemPwr;
                    const extraInfo =
                      ev.kind === "ELEM_BOOST_PICK"
                        ? `Elemento: ${p.element} (+${lvlGain} Nv em todos de ${p.element})`
                        : ev.kind === "EVO_PICK"
                        ? (() => {
                            const ord = slot.role === "GK" ? ["GK", "DF", "SH", "OF"] : slot.role === "DF" ? ["DF", "OF", "SH", "GK"] : slot.role === "MF" ? ["OF", "SH", "DF", "GK"] : ["SH", "OF", "DF", "GK"];
                            for (const c of ord) {
                              if (p.moves?.[c]?.length) return `Técnica: ${p.moves[c][0]}`;
                            }
                            return p.hissatsu;
                          })()
                        : p.keshin
                        ? `Incorporação: ${p.keshin.name}`
                        : p.equippedItems?.length
                        ? `Itens: ${p.equippedItems.map((x) => x.title).join(", ")}`
                        : p.hissatsu;

                    return `
                      <div class="prep-pick-card" data-prep-pick="${slot.id}">
                        <img class="prep-pick-sprite" src="${getPlayerFormSprite(p, slot.role)}" alt="${p.name}" />
                        <div style="min-width:0; flex:1;">
                          <div style="font-size:0.78rem; font-weight:900; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                            ${posIconHTML(slot.role, true)} ${p.name} <span style="color:#fde047;">(OVR ${curOvr})</span>
                          </div>
                          <div style="font-size:0.68rem; font-weight:800; color:#4ade80; margin-top:2px;">
                            Nv. ${curLvl} ➔ Nv. ${nextLvl} • Poder ${curPwr} ➔ ${nextPwr}
                          </div>
                          ${formatPlayerStatsStripHTML(p, slot.role, curLvl)}
                          <div style="font-size:0.64rem; color:#94a3b8; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:2px;">
                            ${extraInfo || ""}
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
      } else if (prep.phase === "DONE") {
        const rawAffected = prep.affectedPlayers && prep.affectedPlayers.length > 0
          ? prep.affectedPlayers
          : (prep.clash5v5?.xpSummary || []);
        const affectedCardsHTML =
          rawAffected.length > 0
            ? `
              <div class="prep-5v5-xp-grid">
                ${rawAffected
                  .map(
                    (px) => {
                      const leveled = (px.levelsGained || 0) > 0;
                      const lvlText = leveled
                        ? `<span class="b-lvl">Nv.${px.prevLevel || Math.max(1, px.newLevel - px.levelsGained)} → Nv.${px.newLevel}</span>`
                        : `<span>Nv.${px.newLevel}</span>`;
                      const xpText = px.xpGained ? `<span class="b-chem">+${px.xpGained} XP</span> • ` : "";
                      const pwrText = px.pwrGained > 0 ? ` • <span class="b-pwr">+${px.pwrGained} Poder</span>` : "";
                      const newMoveBadges = (px.learnedMoves || [])
                        .map((m) => `<div class="new-move-pill">Nova Técnica: ${m.move}</div>`)
                        .join("");
                      const extraBadge = px.extraBadge
                        ? `<div class="new-move-pill">${px.extraBadge}</div>`
                        : "";
                      return `
                        <div class="prep-xp-player-card ${leveled ? "is-level-up" : ""}">
                          <img src="${px.sprite}" alt="${px.name}" />
                          <div style="min-width:0; flex:1;">
                            <div style="display:flex; align-items:center; justify-content:space-between; gap:4px; flex-wrap:wrap;">
                              <div style="display:flex; align-items:center; gap:4px; min-width:0; flex:1; font-size:0.76rem; font-weight:900; color:#fff;">
                                ${posIconHTML(px.role, true)}
                                <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${px.name}</span>
                              </div>
                              ${leveled ? `<span class="level-up-pill" style="margin-left:0; flex-shrink:0;">LEVEL UP</span>` : ""}
                            </div>
                            <div style="font-size:0.69rem; font-weight:800; color:#cbd5e1; margin-top:2px;">
                              ${xpText}${lvlText}${pwrText}
                            </div>
                            ${extraBadge}
                            ${newMoveBadges}
                          </div>
                        </div>
                      `;
                    }
                  )
                  .join("")}
              </div>
            `
            : "";

        outcomeHTML = `
          <div class="prep-reward-box">
            <div class="prep-reward-hero">
              <div class="prep-reward-icon-frame">
                ${prep.event?.icon ? `<img src="${prep.event.icon}" alt="" />` : ""}
              </div>
              <div style="flex:1; min-width:200px;">
                <div style="font-size:0.68rem; font-weight:900; color:#4ade80; text-transform:uppercase; letter-spacing:0.4px;">Preparação Concluída</div>
                <div style="font-size:0.92rem; font-weight:800; color:#fff; margin-top:2px;">${prep.appliedMsg || "Bônus aplicado."}</div>
                <div class="prep-summary-pills-row">
                  <span class="prep-summary-stat-pill">Nível Médio <span class="b-lvl">${stats.avgLevel || 1}</span></span>
                  <span class="prep-summary-stat-pill">Poder <span class="b-pwr">${stats.power.toLocaleString("pt-BR")}</span></span>
                  <span class="prep-summary-stat-pill">OVR ${stats.ovr}</span>
                  <span class="prep-summary-stat-pill">Química <span class="b-chem">${stats.chem}%</span></span>
                  <span class="prep-summary-stat-pill">Energia <span class="b-chem">${Math.round(getTeamEnergy())}%</span></span>
                </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${prep.eventsRemaining > 1 ? `
                  <button class="ie-cmd-btn ie-cmd-gold" id="btn-prep-second-event">
                    <span>Voltar para o Mapa →</span>
                  </button>
                ` : `
                  <button class="ie-cmd-btn ie-cmd-green" id="btn-prep-proceed">
                    <span>Ir para ${nextStage.stageName} →</span>
                  </button>
                `}
              </div>
            </div>
            ${affectedCardsHTML}
          </div>
        `;
      }

      bodyHTML = outcomeHTML;
    }

    return `
      <div class="prep-stage-card" style="position:relative;">
        ${topBannerHTML}
        ${bodyHTML}
      </div>
    `;
  }

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
    `;
  }

  function buildUserSquadModalHTML(stats, t) {
    return `
      <div class="live-tactics-modal-backdrop" id="squad-overview-modal">
        <div class="live-tactics-modal-card squad-overview-modal-card">
          <div class="live-tactics-modal-head">
            <div>
              <div style="font-size:0.68rem; font-weight:900; color:#4ade80; text-transform:uppercase;">Dream Team • Formação ${state.formation}</div>
              <h4 style="margin:0; font-size:1rem; font-weight:900; color:#fff;">Escalação &amp; Posições (<span id="squad-modal-pwr-val">${stats.power.toLocaleString("pt-BR")}</span> Poder)</h4>
            </div>
            <button type="button" class="ie-cmd-btn" id="btn-close-squad-modal" style="padding:5px 12px; font-size:0.74rem; background:#334155;">
              <span>Fechar ✕</span>
            </button>
          </div>
          <div id="squad-pitch-modal-body">
            ${buildPitchHTML(true)}
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
            ? `
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <button type="button" class="ie-cmd-btn ie-cmd-gold" id="btn-open-squad-modal" style="padding:7px 14px; font-size:0.78rem;">
              <span>Ver Escalação (${state.formation})</span>
            </button>
          </div>
        `
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
    const container = document.getElementById("main-screen-container");
    if (!container) return;

    const t = state.tournament;
    document.body.classList.toggle("phase-prep", Boolean(t?.prep));
    const st = t.stages[t.stageIndex];
    const stats = calcSquadStats();
    const focusIdx = t.prep ? t.prep.nextStageIdx : t.stageIndex;
    const bracketHTML = buildTournamentBracketStripHTML(t, focusIdx);
    const showGroupTable = Boolean(t.worldUnlocked && t.worldGroup && focusIdx <= 6);
    const groupTableHTML = showGroupTable ? buildWorldGroupTableHTML(t.worldGroup, t) : "";

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
      `;

      const squadModal = document.getElementById("squad-overview-modal");
      const openSquadBtn = document.getElementById("btn-open-squad-modal");
      const closeSquadBtn = document.getElementById("btn-close-squad-modal");
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
              }
              state.swapSlotId = null;
            }
            pitchBody.innerHTML = buildPitchHTML(true);
            bindSquadModalPitch();
            renderHeaderAndBonds();
            const pwrVal = document.getElementById("squad-modal-pwr-val");
            if (pwrVal) pwrVal.textContent = calcSquadStats().power.toLocaleString("pt-BR");
          });
        });
      };
      const closeSquadModal = () => {
        state.swapSlotId = null;
        if (squadModal) squadModal.classList.remove("is-open");
        renderTournamentScreen();
      };
      if (openSquadBtn && squadModal) {
        openSquadBtn.addEventListener("click", () => {
          state.swapSlotId = null;
          const pitchBody = document.getElementById("squad-pitch-modal-body");
          if (pitchBody) {
            pitchBody.innerHTML = buildPitchHTML(true);
            bindSquadModalPitch();
          }
          squadModal.classList.add("is-open");
        });
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

      bindTacticsControls(container, () => renderAll());

      container.querySelectorAll("[data-prep-choice-idx]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const cIdx = parseInt(btn.getAttribute("data-prep-choice-idx"), 10);
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
          renderTournamentScreen();
        });
      }

      const secondEventBtn = document.getElementById("btn-prep-second-event");
      if (secondEventBtn) {
        secondEventBtn.addEventListener("click", () => {
          t.prep.eventsRemaining = Math.max(1, (t.prep.eventsRemaining || 2) - 1);
          t.prep.phase = "CHOOSE_LOC";
          t.prep.locId = null;
          t.prep.choices = null;
          t.prep.slotStrips = null;
          t.prep.event = null;
          t.prep.clash5v5 = null;
          t.prep.appliedMsg = null;
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
      // No relatório final, não repete cards de chaveamento/topo nem de fases anteriores
      container.innerHTML = `
        ${groupTableHTML}
        ${buildRunSummaryCardHTML(runSummaryObj, stats, t)}
      `;

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
        </div>

        <div class="time-bar-bg">
          <div class="time-bar-fill" id="live-bar-fill" style="width:${pct}%;"></div>
        </div>

        ${st.finished ? "" : buildTeamEnergyBarHTML(true)}

        ${postMatchBarHTML}

        ${
          st.penaltiesText
            ? `<div style="text-align:center; background:rgba(250,204,21,0.15); border:1px solid #facc15; padding:6px; border-radius:8px; font-weight:800; color:#fde047; font-size:0.82rem;">
                ${moveIconHTML("SH")} ${st.penaltiesText}
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
          <div class="live-tactics-modal-card">
            <div class="live-tactics-modal-head">
              <div>
                <div style="font-size:0.68rem; font-weight:900; color:#facc15; text-transform:uppercase;">Jogo Pausado</div>
                <h4 style="margin:0; font-size:1rem; font-weight:900; color:#fff;">⚙️ Táticas da Partida (<span id="live-tactics-modal-min">${st.minute}'</span>)</h4>
              </div>
              <button type="button" class="ie-cmd-btn ie-cmd-green" id="btn-close-live-tactics">
                <span>Retomar ▶</span>
              </button>
            </div>
            ${buildTeamEnergyBarHTML(false)}
            ${buildTacticsControlBarHTML(false)}
          </div>
        </div>
      `
          : ""
      }
    `;

    if (st.pitch && !st.finished && !st.penalties) {
      updatePitchCameraTransform(st.pitch, performance.now(), true);
      const tacModal = document.getElementById("live-tactics-modal");
      if (tacModal) bindTacticsControls(tacModal);

      const openTacBtn = document.getElementById("btn-open-live-tactics");
      const closeTacBtn = document.getElementById("btn-close-live-tactics");
      const pauseForTactics = () => {
        if (st.finished || state.tournament.pendingWhistleFinish || state.tournament.qteRafId) return;
        st.running = false;
        clearTournamentTimers(true);
        const minEl = document.getElementById("live-tactics-modal-min");
        if (minEl) minEl.textContent = `${st.minute}'`;
        const eVal = Math.round(getTeamEnergy());
        const eBand = getTeamEnergyBand(eVal);
        const mPill = document.getElementById("prep-team-energy-pill");
        const mFill = document.getElementById("prep-team-energy-fill");
        if (mPill) {
          mPill.textContent = `${eVal}% (${eBand.label})`;
          mPill.style.color = eBand.color;
        }
        if (mFill) {
          mFill.style.width = `${eVal}%`;
          mFill.style.background = eBand.color;
        }
        if (tacModal) tacModal.classList.add("is-open");
      };
      const resumeFromTactics = () => {
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
    state.storyLockNotice = false;
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
              if (!pickedIds.has(p.id) && playerMatchesRole(p, slot.role)) {
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
