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

function buildClipboardIconSVG(cls = "tactics-clip-svg") {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="18" rx="2.5" fill="rgba(15,23,42,0.55)"/><path d="M9 4.5h6a1 1 0 0 0 1-1V2.8a.8.8 0 0 0-.8-.8H8.8a.8.8 0 0 0-.8.8v.7a1 1 0 0 0 1 1z" fill="currentColor"/><path d="M8.5 10.5l2 2m0-2l-2 2"/><circle cx="15.2" cy="11.5" r="1.35"/><path d="M8.5 16.8c2-1.8 4.4-1.8 6.5-.2"/><path d="M13.5 17.2l2-.4-.4-2"/></svg>`;
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
    name: "Trio Lendário",
    members: ["Endou Mamoru", "Gouenji Shuuya", "Kidou Yuuto"],
    minCount: 2,
    chemPerMatch: 14
  },
  {
    id: "fogo_gelo",
    name: "Fogo Cruzado",
    members: ["Gouenji Shuuya", "Fubuki Shirou"],
    minCount: 2,
    chemPerMatch: 16
  },
  {
    id: "irmaos_fubuki",
    name: "Irmãos Fubuki",
    members: ["Fubuki Shirou", "Fubuki Atsuya"],
    minCount: 2,
    chemPerMatch: 18
  },
  {
    id: "a_fenix",
    name: "A Fênix",
    members: ["Endou Mamoru", "Ichinose Kazuya", "Domon Asuka"],
    minCount: 2,
    chemPerMatch: 14
  },
  {
    id: "laco_unicorn",
    name: "Unicórnio (EUA)",
    members: ["Ichinose Kazuya", "Domon Asuka", "Mark Krueger", "Dylan Keith"],
    minCount: 2,
    chemPerMatch: 13
  },
  {
    id: "laco_imperial",
    name: "Irmandade Imperial",
    members: ["Kidou Yuuto", "Sakuma Jirou", "Genda Koujirou", "Fudou Akio"],
    minCount: 2,
    chemPerMatch: 12
  },
  {
    id: "trio_caos",
    name: "Ataque Caos",
    members: ["Afuro Terumi", "Nagumo Haruya", "Suzuno Fuusuke", "Netsuha Natsuhiko"],
    minCount: 2,
    chemPerMatch: 13
  },
  {
    id: "dragao_fogo",
    name: "Dragão de Fogo",
    members: ["Afuro Terumi", "Nagumo Haruya", "Suzuno Fuusuke", "Choi Chang-soo"],
    minCount: 2,
    chemPerMatch: 14
  },
  {
    id: "laco_aliea",
    name: "Instituto Alien",
    members: ["Kiyama Hiroto", "Kiyama Tatsuya", "Midorikawa Ryuuji", "Saginuma Osamu", "Yagami Reina", "Nagumo Haruya", "Suzuno Fuusuke"],
    minCount: 2,
    chemPerMatch: 12
  },
  {
    id: "caravana_inazuma",
    name: "Caravana Inazuma",
    members: [
      "Kazemaru Ichirouta",
      "Kabeyama Heigorou",
      "Someoka Ryuugo",
      "Tsunami Jousuke",
      "Tachimukai Yuuki",
      "Kogure Yuuya"
    ],
    minCount: 2,
    chemPerMatch: 10
  },
  {
    id: "inazuma_japan_ffi",
    name: "Seleção Inazuma Japan",
    members: [
      "Utsunomiya Toramaru",
      "Tobitaka Seiya",
      "Hijikata Raiden",
      "Kiyama Hiroto",
      "Kazemaru Ichirouta",
      "Kabeyama Heigorou",
      "Fudou Akio",
      "Tachimukai Yuuki",
      "Tsunami Jousuke",
      "Someoka Ryuugo"
    ],
    minCount: 2,
    chemPerMatch: 10
  },
  {
    id: "laco_orfeu",
    name: "Mestres da Orfeu",
    members: ["Fidio Aldena", "Nakata Hidetoshi", "Gigi Blasi"],
    minCount: 2,
    chemPerMatch: 15
  },
  {
    id: "rivais_ffi",
    name: "Rivais do Mundial (FFI)",
    members: ["Edgar Valtinas", "Teles Torrue", "Fidio Aldena", "Mack Ronijo", "Rococo Ulpa", "Mark Krueger"],
    minCount: 2,
    chemPerMatch: 12
  },
  {
    id: "legado_daisuke",
    name: "Legado de Daisuke",
    members: ["Endou Mamoru", "Rococo Ulpa"],
    minCount: 2,
    chemPerMatch: 16
  },
  {
    id: "geracao_go",
    name: "Chrono Storm / GO",
    members: [
      "Matsukaze Tenma",
      "Tsurugi Kyousuke",
      "Shindou Takuto",
      "Kirino Ranmaru",
      "Nishizono Shinsuke",
      "Fei Rune",
      "Nanobana Kinako",
      "Zanark Avalonic",
      "Nishiki Ryouma",
      "Amemiya Taiyou",
      "Hakuryuu",
      "Torb"
    ],
    minCount: 2,
    chemPerMatch: 12
  },
  {
    id: "quinto_setor_go",
    name: "Elite Quinto Setor",
    members: [
      "Senguuji Yamato",
      "Kurosaki Makoto",
      "Amemiya Taiyou",
      "Mahoro Tadashi",
      "Namikawa Rensuke",
      "Yukimura Hyouga",
      "Hyoudou Tsukasa",
      "Minamisawa Atsushi"
    ],
    minCount: 2,
    chemPerMatch: 13
  },
  {
    id: "dupla_zero",
    name: "Luz & Escuridão",
    members: ["Hakuryuu", "Shuu"],
    minCount: 2,
    chemPerMatch: 18
  },
  {
    id: "protocolo_omega",
    name: "Protocolo Ômega",
    members: ["Alpha", "Beta", "Gamma"],
    minCount: 2,
    chemPerMatch: 16
  },
  {
    id: "earth_eleven_galaxy",
    name: "Earth Eleven (Galaxy)",
    members: [
      "Ibuki Munemasa",
      "Matatagi Hayato",
      "Morimura Konoha",
      "Minaho Kazuto",
      "Manabe Jinichirou",
      "Tetsukado Shin",
      "Kusaka Ryuuji",
      "Nozaki Sakura",
      "Ichikawa Zanakurou",
      "Matsukaze Tenma",
      "Tsurugi Kyousuke",
      "Shindou Takuto"
    ],
    minCount: 2,
    chemPerMatch: 12
  },
  {
    id: "estrelas_galaxia",
    name: "Confronto Galáctico",
    members: [
      "Bitway Ozrock",
      "Tsurugi Kyousuke",
      "Argo Burgess",
      "Rodan Gasgus",
      "Ryugel Baran",
      "Gandares Baran",
      "Alvega Gordon",
      "Stag Kuwatta"
    ],
    minCount: 2,
    chemPerMatch: 12
  },
  {
    id: "inakuni_raimon_bond",
    name: "Raimon Inakuni (Ares)",
    members: [
      "Inamori Asuto",
      "Kozoumaru Sasuke",
      "Hiura Kirina",
      "Umihara Norika",
      "Goujin Tetsunosuke",
      "Mansaku Yuuichirou",
      "Iwato Takashi"
    ],
    minCount: 2,
    chemPerMatch: 12
  },
  {
    id: "trio_ares_orion",
    name: "Trindade Ares/Orion",
    members: ["Inamori Asuto", "Haizaki Ryouhei", "Nosaka Yuuma"],
    minCount: 2,
    chemPerMatch: 15
  },
  {
    id: "laco_outei_seishou",
    name: "Rivais Ares/Orion",
    members: ["Nosaka Yuuma", "Nishikage Seiya", "Haizaki Ryouhei", "Mizukamiya Seiryuu", "Kira Hiroto"],
    minCount: 2,
    chemPerMatch: 12
  },
  {
    id: "laco_orion_amigos",
    name: "Estrelas de Orion",
    members: ["Ichihoshi Mitsuru", "Ichihoshi Hikaru", "Froy Girikanan", "Malik Kuabel", "Inamori Asuto", "Clario Orvan"],
    minCount: 2,
    chemPerMatch: 13
  },
  {
    id: "ameaca_suprema",
    name: "Chefe Supremo",
    members: ["Baddap Sleed", "Saryuu Evan", "Zanark Avalonic", "Yurika Beor", "Bitway Ozrock"],
    minCount: 2,
    chemPerMatch: 14
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

function createFreshPrepBonuses() {
  return {
    xp: 0,
    chem: 0,
    power: 0,
    staminaMul: 1,
    lateMatchNoStaminaLoss: false,
    permanentDoublePrep: false,
    elemResonance: false,
    boostedElement: null,
    efficiencyLvl: 0,
    restLvl: 0,
    recoveryLvl: 0,
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

const RANKING_LOCAL_KEY = "ie_dream_team_rankings_v2";
const TEAM_NAME_LOCAL_KEY = "ie_dream_team_nickname_v1";
const ACTIVE_RUN_SAVE_KEY = "ie_dream_team_active_run_v1";
const VALID_RANKING_ROLES = new Set(["FW", "MF", "DF", "GK"]);
const VALID_RANKING_ELEMENTS = new Set(["Fogo", "Floresta", "Vento", "Montanha"]);

function isPermanentRunEnd(t = state.tournament) {
  if (!t || !Array.isArray(t.stages) || t.stages.length === 0) return false;
  const st = t.stages[t.stageIndex];
  if (!st || !st.finished) return false;
  const isWorldFinalWin = Boolean(st.won && t.worldUnlocked && t.stageIndex === t.stages.length - 1);
  const isGroupElim = Boolean(st.isGroupStage && st.groupRoundIdx === 2 && getUserGroupRank(t.worldGroup) > 2);
  const isKnockoutLoss = Boolean(!st.isGroupStage && !st.won);
  return isWorldFinalWin || isGroupElim || isKnockoutLoss;
}

function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeTeamName(raw) {
  const cleaned = String(raw || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, 28);
  return cleaned || "Dream Team";
}

function getSavedTeamName() {
  try {
    const val = window.localStorage?.getItem(TEAM_NAME_LOCAL_KEY);
    if (!val) return "";
    const cleaned = sanitizeTeamName(val);
    return cleaned === "Dream Team" ? "" : cleaned;
  } catch {
    return "";
  }
}

function setSavedTeamName(name) {
  const clean = sanitizeTeamName(name);
  try {
    window.localStorage?.setItem(TEAM_NAME_LOCAL_KEY, clean);
  } catch {
    // ignora erro de armazenamento privado
  }
  return clean;
}

function generateRandomToken(prefix = "id") {
  try {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `${prefix}_${window.crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
    }
  } catch {
    // fallback abaixo
  }
  const rnd = Math.random().toString(36).slice(2, 12);
  const rnd2 = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${rnd}${rnd2}`;
}

function createFreshTournamentState() {
  const rememberedTeamName = getSavedTeamName();
  return {
    runId: generateRandomToken("run"),
    runEditToken: generateRandomToken("tok"),
    rankingSavedSignature: null,
    rankingStatus: null,
    rankingTeamName: rememberedTeamName || "Dream Team",
    stageIndex: 0,
    stages: [],
    worldUnlocked: false,
    worldGroup: null,
    ffBracket: null,
    worldBracket: null,
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
    prepBonuses: createFreshPrepBonuses(),
    teamEnergy: 100,
    tactics: {
      lane: "balanced", // "wings" | "balanced" | "center"
      posture: "balanced", // "defensive" | "balanced" | "offensive"
      intensity: "medium", // "low" | "medium" | "high"
      style: "free", // "possession" | "free" | "vertical"
      hissatsuTactic: "route_of_sky", // "route_of_sky" | "catenaccio" | "lightning_press" | "raimon_harmony"
      captainPlayerId: null,
      acePlayerId: null,
      markedOppId: null
    },
    showRunSummary: false
  };
}

function cloneFreshPlayerForSquad(player, teamInfo = null, forcedLevel = 1) {
  if (!player) return null;
  const rawMoves = player.moves || {};
  const clonedMoves = {};
  Object.keys(rawMoves).forEach((cat) => {
    clonedMoves[cat] = Array.isArray(rawMoves[cat]) ? [...rawMoves[cat]] : rawMoves[cat];
  });
  return {
    ...player,
    moves: clonedMoves,
    level: forcedLevel,
    xp: 0,
    bonusStats: { for: 0, tec: 0, def: 0, vel: 0, fis: 0 },
    bonusPower: 0,
    bonusSpd: 0,
    equippedItems: [],
    keshin: null,
    moveEvoCount: 0,
    learnedSecretManual: false,
    learnedLvlMilestones: [],
    teamId: teamInfo?.id ?? player.teamId,
    teamName: teamInfo?.name ?? player.teamName,
    teamEmblem: teamInfo?.emblem ?? player.teamEmblem
  };
}

const state = {
  phase: "menu", // "menu" | "draft" | "tournament"
  gameMode: "relampago",
  storyLockNotice: false,
  formation: "4-3-3",
  hideOvrBeforePick: false, // Dificuldade: true = Sem Overall no sorteio, false = Com Overall visível
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
  tournament: createFreshTournamentState()
};

function getTeamEnergy() {
  const val = state.tournament?.teamEnergy;
  return typeof val === "number" && !Number.isNaN(val) ? Math.max(0, Math.min(100, val)) : 100;
}

function getTeamEnergyBand(energy = getTeamEnergy()) {
  const e = Math.max(0, Math.min(100, Number(energy) || 0));
  if (e >= 70) {
    return {
      key: "GREEN",
      label: "Descansado",
      color: "#4ade80",
      bg: "rgba(21, 128, 61, 0.28)",
      border: "rgba(74, 222, 128, 0.55)",
      duelPenalty: 0,
      startStamina: 100,
      desc: "100% nos duelos · Início 100% fôlego",
      liveDesc: "100% nos duelos"
    };
  }
  if (e >= 35) {
    const tYellow = (70 - e) / 35;
    const duelPenalty = Number((-0.3 - tYellow * 1.2).toFixed(2));
    const penaltyPct = Math.max(1, Math.round(Math.abs(duelPenalty) * 3));
    const startStamina = Math.round(88 + ((e - 35) / 35) * 8);
    return {
      key: "YELLOW",
      label: "Cansado",
      color: "#facc15",
      bg: "rgba(161, 98, 7, 0.3)",
      border: "rgba(250, 204, 21, 0.6)",
      duelPenalty,
      startStamina,
      desc: `-${penaltyPct}% nos duelos · Início ${startStamina}% fôlego`,
      liveDesc: `-${penaltyPct}% nos duelos (time cansado)`
    };
  }
  const tRed = (35 - e) / 35;
  const duelPenalty = Number((-4.0 - tRed * 3.0).toFixed(2));
  const penaltyPct = Math.max(12, Math.round(Math.abs(duelPenalty) * 3));
  const startStamina = Math.round(55 + (e / 35) * 15);
  return {
    key: "RED",
    label: "Exausto",
    color: "#ef4444",
    bg: "rgba(153, 27, 27, 0.35)",
    border: "rgba(248, 113, 113, 0.65)",
    duelPenalty,
    startStamina,
    desc: `Exausto (-${penaltyPct}% duelos) · Início ${startStamina}% fôlego`,
    liveDesc: `Exausto (-${penaltyPct}% nos duelos)`
  };
}

function adjustTeamEnergy(delta) {
  if (!state.tournament) return 100;
  const prev = getTeamEnergy();
  const next = Math.max(0, Math.min(100, Math.round((prev + delta) * 10) / 10));
  state.tournament.teamEnergy = next;
  return next;
}

function isFourthActionHalfCostActive(t = state.tournament) {
  return Boolean(
    t?.prepBonuses?.permanentDoublePrep &&
    t?.prep &&
    (t.prep.eventsTotal || 0) >= 4 &&
    (t.prep.eventsRemaining || 0) === 1
  );
}

function getPrepLocationCost(loc, t = state.tournament) {
  const baseCost = loc?.energyCost || 0;
  if (baseCost <= 0) return 0;
  const bonuses = t?.prepBonuses || {};
  const passDiscount = bonuses.permanentDoublePrep ? 3 : 0;
  const effDiscount = [0, 4, 7, 10][Math.min(3, bonuses.efficiencyLvl || 0)] || 0;
  const flatCost = Math.max(5, baseCost - passDiscount - effDiscount);
  return isFourthActionHalfCostActive(t) ? Math.max(4, Math.round(flatCost * 0.5)) : flatCost;
}

function getRestEnergyGain(t = state.tournament) {
  const restLvl = t?.prepBonuses?.restLvl || 0;
  return 35 + restLvl * 7;
}

const HISSATSU_TACTICS_CATALOG = {
  route_of_sky: {
    id: "route_of_sky",
    name: "Rota do Céu",
    tag: "Ofensiva",
    durationSec: 10.5,
    shortEffect: "-55% interceptações • +12% velocidade no ataque",
    desc: "Por ~15' de jogo, seus passes rasgam a marcação quase sem interceptações e atacantes/pontas disparam nas costas da zaga."
  },
  catenaccio: {
    id: "catenaccio",
    name: "Contra-Ataque Catenaccio",
    tag: "Defesa & Transição",
    durationSec: 10.5,
    shortEffect: "+5% chance defensiva • Contra-ataque letal após roubo",
    desc: "Por ~15' de jogo, fortalece desarmes/defesas e transforma cada roubo em contra-ataque fulminante (+5% chance de gol)."
  },
  lightning_press: {
    id: "lightning_press",
    name: "Pressão Relâmpago",
    tag: "Pressão Alta",
    durationSec: 10.0,
    shortEffect: "+16% velocidade de marcação • +4% chance de roubo",
    desc: "Por ~15' de jogo, sufoca a saída de bola adversária com marcação intensa para forçar erros (+20% gasto de fôlego)."
  },
  raimon_harmony: {
    id: "raimon_harmony",
    name: "Harmonia da Raimon",
    tag: "Coletiva",
    durationSec: 10.5,
    shortEffect: "+10% fôlego na hora • +4% chance nos duelos • Tabelas+",
    desc: "Por ~15' de jogo, recupera fôlego dos titulares na hora, ativa tabelas rápidas (1-2) e eleva os duelos do elenco inteiro."
  }
};

function getTactics() {
  if (!state.tournament.tactics) {
    state.tournament.tactics = {
      lane: "balanced",
      posture: "balanced",
      intensity: "medium",
      style: "free",
      hissatsuTactic: "route_of_sky",
      captainPlayerId: null,
      acePlayerId: null,
      markedOppId: null
    };
  }
  const tac = state.tournament.tactics;
  if (!tac.style) tac.style = "free";
  if (!tac.hissatsuTactic || !HISSATSU_TACTICS_CATALOG[tac.hissatsuTactic]) {
    tac.hissatsuTactic = "route_of_sky";
  }
  return tac;
}

function getActiveTeamCaptain() {
  const tac = getTactics();
  const slots = typeof getSlots === "function" ? getSlots() : [];
  let chosen = null;
  let chosenRole = "MF";
  if (tac.captainPlayerId) {
    for (const s of slots) {
      const p = state.squad?.[s.id];
      if (p && p.id === tac.captainPlayerId) {
        chosen = p;
        chosenRole = s.role;
        break;
      }
    }
  }
  if (!chosen) {
    let bestScore = -1;
    for (const s of slots) {
      const p = state.squad?.[s.id];
      if (!p) continue;
      const sc = (p.ovr || 70) + (p.isCaptain ? 12 : 0) + (s.role === "GK" || s.role === "MF" ? 3 : 0);
      if (sc > bestScore) {
        bestScore = sc;
        chosen = p;
        chosenRole = s.role;
      }
    }
    if (chosen) tac.captainPlayerId = chosen.id;
  }
  return chosen ? { player: chosen, role: chosenRole } : null;
}

function computePlayerArchetype(player, role = "MF", tacticalRole = "NONE") {
  if (!player) return "COLLECTIVE";
  const attrs = typeof calcPlayerAttributes === "function"
    ? calcPlayerAttributes(player, role, getPlayerLevel(player))
    : { for: 75, tec: 75, def: 75, vel: 75, fis: 75 };

  if (role === "GK") return "KEEPER_WALL";
  if (role === "FW" && (attrs.for >= attrs.tec + 3 || attrs.for >= 82)) return "EGO_STRIKER";
  if (tacticalRole === "CAMISA_10" || attrs.tec >= Math.max(attrs.for, attrs.vel) + 2) return "STRATEGIST";
  if (attrs.vel >= attrs.tec + 3 && attrs.vel >= attrs.for) return "PACE_LEADER";
  if (role === "DF" || attrs.def + attrs.fis >= attrs.for + attrs.tec + 6) return "WARRIOR";
  return "COLLECTIVE";
}

function getCaptainAuraInfo(player, role = "MF", tacticalRole = "NONE") {
  if (!player) {
    return {
      type: "COLLECTIVE",
      archetype: "COLLECTIVE",
      archetypeLabel: "Colaborativo",
      name: "Alma Colaborativa",
      shortEffect: "Raio (24u): +5% tabela e fôlego • Passe: +5% sinergia em duelo",
      desc: "Eleva a sintonia coletiva ao redor e fortalece quem recebe seu passe."
    };
  }
  const archetype = computePlayerArchetype(player, role, tacticalRole);
  if (archetype === "KEEPER_WALL") {
    return {
      type: "KEEPER_WALL",
      archetype: "KEEPER_WALL",
      archetypeLabel: "Protetor",
      name: "Muralha Inabalável",
      shortEffect: "Raio (24u): +5% defesa e reação • Passe: +4% contenção e -12% gasto",
      desc: "Comanda a linha defensiva de trás: reforça a marcação próxima e dá segurança extra a quem recebe sua reposição."
    };
  }
  if (archetype === "EGO_STRIKER") {
    return {
      type: "EGO_STRIKER",
      archetype: "EGO_STRIKER",
      archetypeLabel: "Egoísta",
      name: "Artilheiro Egoísta",
      shortEffect: "Raio (24u): +6% chute & drible • Passe: +6% potência de finalização",
      desc: "Pressiona a defesa adversária com ambição máxima: contagia atacantes próximos e transforma passes em assistências letais."
    };
  }
  if (archetype === "STRATEGIST") {
    return {
      type: "STRATEGIST",
      archetype: "STRATEGIST",
      archetypeLabel: "Estrategista",
      name: "Estrategista Camisa 10",
      shortEffect: "Raio (24u): -15% interceptações • Passe: +7% precisão & enfiadas",
      desc: "Organiza as linhas ao seu redor: aliados próximos furam a marcação e quem recebe do Capitão ganha passe cirúrgico."
    };
  }
  if (archetype === "PACE_LEADER") {
    return {
      type: "PACE_LEADER",
      archetype: "PACE_LEADER",
      archetypeLabel: "Velocista",
      name: "Velocista Relâmpago",
      shortEffect: "Raio (24u): +8% arrancada e avanço • Passe: +6% velocidade no domínio",
      desc: "Puxa o ritmo pelas pontas e acelera quem joga ao seu lado ou recebe suas inversões em velocidade."
    };
  }
  if (archetype === "WARRIOR") {
    return {
      type: "WARRIOR",
      archetype: "WARRIOR",
      archetypeLabel: "Combativo",
      name: "Guardião de Ferro",
      shortEffect: "Raio (24u): +5% desarme & físico • Passe: -15% desgaste & +4% reação",
      desc: "Inspira raça nos companheiros ao redor para fechar espaços e reduz o desgaste após seus passes."
    };
  }
  return {
    type: "COLLECTIVE",
    archetype: "COLLECTIVE",
    archetypeLabel: "Colaborativo",
    name: "Alma Colaborativa",
    shortEffect: "Raio (24u): +12% tabelas (1-2) • Passe: +5% força no próximo duelo",
    desc: "Deixa o time conectado com tabelas rápidas ao seu redor e buff direto em todo aliado que recebe seu passe."
  };
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

function getPickedFullNames() {
  return new Set(
    Object.values(state.squad)
      .filter(Boolean)
      .map((p) => (p.fullName || p.name || "").trim().toLowerCase())
      .filter(Boolean)
  );
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
  const ovrGrowthScale = 0.82 + Math.pow(Math.max(0, effOvr - 60) / 22, 1.20);
  const roleWeights =
    role === "FW"
      ? { for: 1.20, tec: 0.95, def: 0.60, vel: 1.05, fis: 0.85 }
      : role === "MF"
      ? { for: 0.85, tec: 1.20, def: 0.78, vel: 1.05, fis: 0.88 }
      : role === "DF"
      ? { for: 0.65, tec: 0.82, def: 1.20, vel: 0.88, fis: 1.10 }
      : { for: 0.68, tec: 0.85, def: 1.25, vel: 0.70, fis: 1.12 };

  const bStats = player.bonusStats || {};
  // Keshin agora desperta dinamicamente em campo (1x por jogo), sem inflar status passivos fora do despertar
  const keshinBonus = 0;
  const evoBonus = (player.moveEvoCount || 0) * 2;
  const manualBonus = player.learnedSecretManual ? 3 : 0;

  // Bônus dinâmicos de função dos buffs escaláveis (ativos apenas durante o torneio, nunca vazando para o draft!)
  const isSquadMember = state.phase === "tournament" && Object.values(state.squad).some((sp) => sp && sp.id === player.id);
  const pb = isSquadMember ? state.tournament?.prepBonuses || {} : {};
  const wingStat = (role === "FW" || role === "MF") ? (pb.wingExplosionLvl || 0) * 2 : 0;
  const midStat = role === "MF" ? (pb.midSynergyLvl || 0) * 2 : 0;
  const defStat = (role === "GK" || role === "DF") ? (pb.defBlockLvl || 0) * 2 : 0;

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

// Quanto maior o OVR do jogador, MAIS PODER ele recebe a cada Nível (curva calibrada contra bola de neve)!
function calcPowerPerLevel(effOvr) {
  const clamped = Math.max(55, Math.min(99, effOvr || 75));
  return Math.max(5, Math.round(5 + Math.pow((clamped - 60) / 11, 1.62) * 0.95));
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
  const keshinPwr = 0;
  const evoPwr = (player.moveEvoCount || 0) * 13;
  const manualPwr = player.learnedSecretManual ? 18 : 0;
  const isSquadMember = state.phase === "tournament" && Object.values(state.squad).some((sp) => sp && sp.id === player.id);
  const pb = isSquadMember ? state.tournament?.prepBonuses || {} : {};
  let roleScalablePwr = 0;
  if (role === "FW" || role === "MF") roleScalablePwr += (pb.wingExplosionLvl || 0) * 4;
  if (role === "MF") roleScalablePwr += (pb.midSynergyLvl || 0) * 4;
  if (role === "GK" || role === "DF") roleScalablePwr += (pb.defBlockLvl || 0) * 4;
  return Math.round(basePwr + levelPwr + itemPwr + keshinPwr + evoPwr + manualPwr + roleScalablePwr + (extraComboPower || 0));
}

const HEAVY_MOVE_RX =
  /(ômega|omega|the earth|a terra|god catch|maou|rei demônio|captura|dimensional|martelo da ira|grand fire|grande fogo|fogo máximo|maximum|a explosão|explosão cósmica|explosão do caos|explosão universo|explosão diabólica|tenkuu|queda celestial|chaos|big bang|god break|impacto divino|impacto x|x blast|último recurso|last resort|zero magnum|infinity|asura|saikyou|onda dos onze|mão da alma|alma suprema|god hand x|god hand v|god hand w|super mão fantasma|mão fantasma da amizade|lenda suprema|prime legend|ruptura mortal|death break|supernova|chama do rei|presas de fera suprema|a galáxia|neo galáxia|pinguins deus|kamakura|tempestade tornado|\b(g2|g3|v2|v3|shin)\b|★)/i;

const LONG_SHOT_RX =
  /(impulso tsunami|o tufão|excalibur|meteoro cortante|supernova|lança de odin|gungnir|observador das estrelas|chute balista|ballista shot|canhão carronade|carronade hou|canhão do dragão|dragon cannon|serpente letal|sidewinder|controle remoto|chuva da morte|death rain|chute astro|impulso torre eiffel|eiffel drive|espada crisântemo|kiku ichimonji|explosão de concha|shellbit burst|chute torre de osaka|tsuutenkaku|chute bolha arco-íris|rainbow bubble|raio de diamante|diamond ray|estilingue|slingshot|disparo de canhão|gunshot|mil flechas|chute eletromagnético|gauss shot|explosão cósmica|cosmic blaster|orbe de perseu|perseus orb|onda cintilante|pinguins imperiais nº 3|pinguins espaciais|pinguins imperiais nº 7|koutei penguin 7|lança glacial|tempestade tornado furacão|the earth|a terra|queda de meteoro|overcyclone|desastre total|explosão universo|próton de ganimedes|cabeçada megaton|megaton head|cabeçada gigaton|gigaton head|bola de terra|alvorecer negro)/i;

const COUNTER_SHOT_RX =
  /(excalibur|cabeçada megaton|megaton head|cabeçada gigaton|gigaton head|flecha refletora|o tufão|impulso tsunami|lança de odin|gungnir|cabeçada foguete|rocket head|cabeçada bazuca|head bazooka|cabeçada brutal|kyoubou head|retorno da andorinha|tsubame gaeshi|ignição reversa|backdraft|overcyclone|furacão invertido|queda do tornado|tatsumaki otoshi|canhão do dragão|dragon cannon|pinguins imperiais nº 3|a galáxia|the galaxy|the earth|a terra|lança glacial)/i;

const COUNTER_DF_RX =
  /(falcão voador|shinkuuma|corte giratório|estrela cadente|giro espiral|muralha de ferro|terremoto mega|muralha infinita)/i;

const CHAIN_SHOT_RX =
  /(furacão de fogo|fire tornado|tempestade explosiva|parafuso explosivo|super relâmpago|relâmpago nº 1|tempestade relâmpago|inazuma break|impacto dragão|furacão dragão|impacto wyvern|vendaval wyvern|matador de dragões|explosão do dragão|vendaval eterno|lobo lendário|vendaval de fogo|impacto do norte|erupção atômica|grande fogo|fogo máximo|fogo do inferno|fogo cruzado|crossfire|pinguins imperiais|pinguins perfeitos|pinguins aéreos|pinguins deus|tubarão das profundezas|bicicleta espada|espada da morte|impulso tigre|tempestade do tigre|arco gladiador|queda celestial|tenkuu otoshi|lâmina de diamante|asas celestiais|god knows|impacto divino|god break|explosão do caos|chaos break|big bang|a origem|the birth|the earth|a terra|lenda suprema|prime legend|chute duplo|golpe duplo|impulso duplo|impulso triplo|twin boost|lança dupla|twin lancer|dual strike|zona mortal|última zona mortal|triângulo z|triangle zz|last death zone|lança da escuridão|death spear|ruptura mortal|death break|zero magnum|último recurso|last resort|impulso instantâneo|setsuna boost|fortíssimo|blitz do amanhecer|alvorecer negro|black dawn|impacto x|x blast|mandíbula dupla|neo galáxia|neo galaxy|grande fenrir|impulso unicórnio|nevasca da pantera|panther blizzard|fera do trovão|thunder beast|fênix negra|a fênix|chute pégaso|impulso cruzado|cross drive|estrada glacial|grande explosão|ataque ômega)/i;

function isHeavyHissatsu(move, list = null, idx = -1) {
  if (!move) return false;
  if (HEAVY_MOVE_RX.test(move)) return true;
  return Boolean(Array.isArray(list) && list.length >= 3 && idx >= 2);
}

function getEligibleMovesFromList(list, stamina) {
  if (!Array.isArray(list) || list.length === 0 || stamina < 45) return [];
  const usable = [];
  list.forEach((m, idx) => {
    const isSup = isHeavyHissatsu(m, list, idx);
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
    cost: picked.isHeavy ? 24 : 16,
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
      cost: picked.isHeavy ? 22 : 15,
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
      cost: picked.isHeavy ? 18 : 13,
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
    // Chain shot cansa um pouco mais o 2º jogador (+8 de desgaste sobre o custo base do chute)
    cost: (picked.isHeavy ? 22 : 15) + 8,
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
// Keshin Ativa libera sua Hissatsu exclusiva enquanto houver fôlego (>= 28%)
function pickStaminaGatedMove(node, category) {
  const stamina = node ? node.stamina : 100;
  const list = node?.player?.moves?.[category] || [];
  // Técnicas pesadas (super técnicas de grau alto) gastam mais fôlego, mas sem zerar o atleta no 1º tempo
  const heavyCost = category === "GK" || category === "SH" ? 22 : 19;
  // Técnicas padrão/médias têm gasto equilibrado ao longo dos 90 minutos
  const stdCost = category === "GK" || category === "SH" ? 14 : 12;
  const userIntensity = node?.side === "user" ? getTactics().intensity : "medium";
  const masteryLvl = node?.side === "user" ? (state.tournament?.prepBonuses?.hissatsuMasteryLvl || 0) : 0;
  const masteryBonus = [0, 0.6, 1.2, 1.8][masteryLvl] || 0;

  // Técnica exclusiva de Keshin (quando invocada e compatível com a ação)
  const keshin = node?.player?.keshin;
  if (
    node?.keshinState === "ACTIVE" &&
    keshin?.move &&
    stamina >= 28 &&
    (keshin.moveCat === category || (!keshin.moveCat && (category === "SH" || category === "GK")))
  ) {
    return {
      move: `Keshin: ${keshin.move}`,
      rawMove: keshin.move,
      isHeavy: true,
      isKeshinMove: true,
      exhausted: false,
      gatedReason: null,
      cost: category === "GK" || category === "SH" ? 18 : 15,
      duelBonus: 2.35 + masteryBonus
    };
  }

  if (stamina < 45) {
    return {
      move: null,
      isHeavy: false,
      exhausted: true,
      gatedReason: "RED",
      cost: 5,
      duelBonus: -2.2
    };
  }

  if (list.length === 0) {
    return {
      move: null,
      isHeavy: false,
      exhausted: false,
      gatedReason: null,
      cost: 6,
      duelBonus: -0.6
    };
  }

  const heavyMoves = [];
  const standardMoves = [];
  list.forEach((m, idx) => {
    const isSup = isHeavyHissatsu(m, list, idx);
    if (isSup) heavyMoves.push(m);
    else standardMoves.push(m);
  });

  // Intensidade BAIXA: economiza energia com jogadas sem técnica ou apenas técnicas padrão (nunca vaza técnica pesada)
  if (userIntensity === "low") {
    if (category !== "GK" && category !== "SH" && Math.random() < 0.50) {
      return {
        move: null,
        isHeavy: false,
        exhausted: false,
        gatedReason: null,
        cost: 4,
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
        duelBonus: masteryBonus
      };
    }
    if (category === "GK" && heavyMoves.length > 0) {
      const fallbackMove = heavyMoves[heavyMoves.length - 1];
      return {
        move: fallbackMove,
        isHeavy: false,
        exhausted: false,
        gatedReason: "LOW_ECONOMY",
        cost: stdCost + 2,
        duelBonus: -0.4 + masteryBonus
      };
    }
    return {
      move: null,
      isHeavy: false,
      exhausted: false,
      gatedReason: "LOW_ECONOMY",
      cost: 5,
      duelBonus: -0.4
    };
  }

  if (stamina >= 70) {
    const heavyProb = userIntensity === "high" ? 0.90 : 0.65;
    const useHeavy = heavyMoves.length > 0 && (standardMoves.length === 0 || Math.random() < heavyProb);
    const pool = useHeavy ? heavyMoves : standardMoves.length > 0 ? standardMoves : heavyMoves;
    const move = pool[Math.floor(Math.random() * pool.length)];
    const isHeavy = heavyMoves.includes(move);
    const extraBonus = userIntensity === "high" ? 0.9 : 0;
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
  const highYellowBonus = userIntensity === "high" ? 0.6 : 0;
  if (standardMoves.length > 0) {
    const move = standardMoves[Math.floor(Math.random() * standardMoves.length)];
    return {
      move,
      isHeavy: false,
      exhausted: false,
      gatedReason: heavyMoves.length > 0 ? "YELLOW" : null,
      cost: stdCost,
      duelBonus: -0.35 + highYellowBonus + masteryBonus
    };
  }

  // Se todas as técnicas da categoria forem pesadas e ele está na amarela:
  // Goleiros (e atletas sem opção leve) ainda conseguem usar sua opção menos pesada pagando um pouco mais de desgaste
  if (category === "GK" && heavyMoves.length > 0) {
    const fallbackMove = heavyMoves[heavyMoves.length - 1];
    return {
      move: fallbackMove,
      isHeavy: false,
      exhausted: false,
      gatedReason: "YELLOW",
      cost: stdCost + 4,
      duelBonus: -0.7 + highYellowBonus + masteryBonus
    };
  }

  return {
    move: null,
    isHeavy: false,
    exhausted: false,
    gatedReason: "YELLOW_ONLY_HEAVY",
    cost: 6,
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
  const shotHissatsuProb = userInt === "low" ? 0.48 : userInt === "high" ? 0.95 : 0.80;
  if (pick.move && (pick.isKeshinMove || Math.random() < shotHissatsuProb)) {
    return {
      isHissatsu: true,
      isKeshinMove: Boolean(pick.isKeshinMove),
      isLongShotMove: !pick.isKeshinMove && LONG_SHOT_RX.test(pick.move),
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
  const tagDesc = { L: "Chute Longo", CT: "Contra-Chute / Bloqueio", CH: "Chute em Cadeia" };
  const tagFor = (m, cat) => {
    const tags = [];
    if (cat === "SH" && LONG_SHOT_RX.test(m)) tags.push("L");
    if ((cat === "SH" && COUNTER_SHOT_RX.test(m)) || (cat === "DF" && COUNTER_DF_RX.test(m))) tags.push("CT");
    if (cat === "SH" && CHAIN_SHOT_RX.test(m)) tags.push("CH");
    if (!tags.length) return "";
    const tip = tags.map((t) => `${t}: ${tagDesc[t]}`).join(" • ");
    return ` <em title="${tip}" style="color:#fde047; font-style:normal; font-size:0.68em; font-weight:900;">[${tags.join("/")}]</em>`;
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
  const clubPlayersMap = {};
  const fullNamesInSquad = new Set();
  const fullToShortName = {};
  const elemCountsByLink = {};
  const elemTotalsInSquad = {};
  const elemPlayersMap = {};
  const activeElemPairs = [];
  const slotPlayerMap = {};
  const equippedItemIds = new Set();
  const itemHoldersMap = {};
  const equippedPlayersList = [];
  const trainedPlayersList = [];
  const improvisedPlayers = [];
  let totalEquippedItemsCount = 0;
  let correctPosCount = 0;

  slots.forEach((s) => {
    const p = getPlayerForSlot(s);
    if (!p) return;
    count++;
    slotPlayerMap[s.id] = p;
    const dispName = p.name || p.fullName || "";
    if (playerMatchesRole(p, s.role)) {
      correctPosCount++;
    } else if (dispName) {
      improvisedPlayers.push(dispName);
    }
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
      if (!elemPlayersMap[p.element]) elemPlayersMap[p.element] = [];
      if (dispName) elemPlayersMap[p.element].push(dispName);
    }
    if (!isOpponent && Array.isArray(p.equippedItems) && p.equippedItems.length > 0) {
      if (dispName) equippedPlayersList.push(dispName);
      p.equippedItems.forEach((it) => {
        totalEquippedItemsCount++;
        if (it.id) {
          equippedItemIds.add(it.id);
          if (!itemHoldersMap[it.id]) itemHoldersMap[it.id] = [];
          if (dispName && !itemHoldersMap[it.id].includes(dispName)) itemHoldersMap[it.id].push(dispName);
        }
      });
    }
    if (!isOpponent && (pLvl > 1 || (p.bonusPower || 0) > 0 || p.keshin || (p.moveEvoCount || 0) > 0 || p.learnedSecretManual)) {
      if (dispName) trainedPlayersList.push(dispName);
    }

    const tId = p.teamId || clubIdHint || "club";
    teamsCount[tId] = (teamsCount[tId] || 0) + 1;
    teamNames[tId] = p.teamName || clubIdHint || "Clube";
    if (!clubPlayersMap[tId]) clubPlayersMap[tId] = [];
    if (dispName) clubPlayersMap[tId].push(dispName);
    if (p.teamEmblem) teamEmblems[tId] = p.teamEmblem;
    if (p.fullName) {
      const normFull =
        p.fullName === "Kazuya Ichinose"
          ? "Ichinose Kazuya"
          : p.fullName === "Asuka Domon"
          ? "Domon Asuka"
          : p.fullName;
      fullNamesInSquad.add(normFull);
      fullToShortName[normFull] = dispName || normFull;
    }

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
    if (count > 0 && correctPosCount < count) {
      const improvisedOpp = count - correctPosCount;
      activeBonds.push({
        type: "warn-pos",
        label: `${formationIconHTML("inline-ui-icon")} Posições: ${improvisedOpp} improvisado(s) (-OVR)`
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
        label: `${activeElemPairs.length}x Links Elementais <span class="bond-nowrap">(${summaryParts})</span> (+${linkChem}% • +${linkPwr} Poder)`
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

    if (oppLevel > 1 || oppStageIdx > 0) {
      bondsPower += Math.round(Math.max(0, oppLevel - 1) * 14 + Math.max(0, oppStageIdx) * 22);
      chem += Math.min(34, Math.round(Math.max(0, oppStageIdx) * 3.2));
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

  // 0. Debuff apenas quando há jogador fora de posição (11/11 é o padrão sem bônus extra!)
  if (count > 0 && correctPosCount < count) {
    const improvised = count - correctPosCount;
    activeBonds.push({
      type: "warn-pos",
      label: `${formationIconHTML("inline-ui-icon")} ${improvised} fora de pos. (-OVR)`,
      players: improvisedPlayers
    });
  }

  // 1. Química & Poder por Sinergia Elemental em PROXIMIDADE (Dream Team)
  const prepB = (!isOpponent && state.phase === "tournament") ? (state.tournament?.prepBonuses || null) : null;
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
    const elemLinkPlayers = [];
    activeElemPairs.forEach(({ a, b }) => {
      const nA = slotPlayerMap[a.id]?.name;
      const nB = slotPlayerMap[b.id]?.name;
      if (nA && !elemLinkPlayers.includes(nA)) elemLinkPlayers.push(nA);
      if (nB && !elemLinkPlayers.includes(nB)) elemLinkPlayers.push(nB);
    });
    const summaryParts = Object.keys(elemCountsByLink)
      .map((el) => `${elemIconHTML(el, "inline-elem-icon")}×${elemCountsByLink[el]}`)
      .join(" ");
    activeBonds.push({
      type: "element",
      label: `${activeElemPairs.length}x Links <span class="bond-nowrap">(${summaryParts})</span> (+${linkChem}% • +${linkPwr}${elemResonanceActive ? " · Ressonância" : ""})`,
      players: elemLinkPlayers
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
        label: `${emblemTag} ${c}x ${teamNames[tId]} (+${chemBonus}% • +${pwrBonus})`,
        players: clubPlayersMap[tId] || []
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
        matchedCount: matched.length,
        matchedPlayers: matched.map((m) => fullToShortName[m] || m),
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
        label: `${entry.matchedCount}x ${entry.bond.name} (+${chemBonus}% • +${pwrBonus})`,
        players: entry.matchedPlayers
      });
    }
  });

  // 4. COMBOS DE ITENS & SINERGIAS DE TREINO (Novos Combos!)
  const activeCombos = [];
  const mergeUnique = (...lists) => [...new Set(lists.flat().filter(Boolean))];
  // Combo 1: Conjunto Lendário da Raimon (Luvas Lendárias + Chuteiras Lendárias)
  if (equippedItemIds.has("glove_legend") && equippedItemIds.has("shoes_legend")) {
    const cPwr = 65;
    chem += 8;
    bondsPower += cPwr;
    activeCombos.push({
      label: `🔥 Combo Lendário (+${cPwr} • +8%)`,
      players: mergeUnique(itemHoldersMap["glove_legend"], itemHoldersMap["shoes_legend"])
    });
  }
  // Combo 2: Muralha Impenetrável (Luvas Lendárias + Travas de Bloqueio)
  if (equippedItemIds.has("glove_legend") && equippedItemIds.has("spike_block")) {
    const cPwr = 55;
    chem += 6;
    bondsPower += cPwr;
    activeCombos.push({
      label: `🛡️ Muralha Impenetrável (+${cPwr} • +6%)`,
      players: mergeUnique(itemHoldersMap["glove_legend"], itemHoldersMap["spike_block"])
    });
  }
  // Combo 3: Tempestade Relâmpago (Chuteiras do Trovão + Braçadeira do Capitão ou Amuleto Elemental)
  if (equippedItemIds.has("shoes_thunder") && (equippedItemIds.has("captain_armband") || equippedItemIds.has("elem_crest_boost"))) {
    const cPwr = 50;
    chem += 6;
    bondsPower += cPwr;
    activeCombos.push({
      label: `⚡ Tempestade Relâmpago (+${cPwr} • +6%)`,
      players: mergeUnique(itemHoldersMap["shoes_thunder"], itemHoldersMap["captain_armband"], itemHoldersMap["elem_crest_boost"])
    });
  }
  // Combo 4: Esquadrão Equipado (3 ou mais jogadores distintos equipados com itens)
  const uniqueEquippedPlayers = mergeUnique(equippedPlayersList);
  if (uniqueEquippedPlayers.length >= 3) {
    const cPwr = uniqueEquippedPlayers.length * 14;
    bondsPower += cPwr;
    activeCombos.push({
      label: `🎒 Arsenal (${uniqueEquippedPlayers.length}x: +${cPwr})`,
      players: uniqueEquippedPlayers
    });
  }
  // Combo 5: Domínio Elemental (3+ titulares do mesmo elemento quando Insígnia Elemental foi ativada)
  const boostedElemsList = Array.isArray(prepB?.boostedElements) && prepB.boostedElements.length > 0
    ? prepB.boostedElements
    : prepB?.boostedElement
    ? [prepB.boostedElement]
    : [];
  boostedElemsList.forEach((bEl) => {
    const elCnt = elemTotalsInSquad[bEl] || 0;
    if (elCnt >= 3) {
      const cPwr = elCnt * 14;
      chem += 6;
      bondsPower += cPwr;
      activeCombos.push({
        label: `🌟 Domínio ${bEl} (${elCnt}x: +${cPwr} • +6%)`,
        players: elemPlayersMap[bEl] || []
      });
    }
  });

  activeCombos.forEach((cb) => {
    activeBonds.push({
      type: "friendship",
      label: cb.label,
      players: cb.players
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
      label: `${prepIcon} Treinos &amp; Itens (${evtCnt}x) (+${prepB.chem || 0}% • +${prepB.power || 0})`,
      players: trainedPlayersList.length > 0 ? mergeUnique(trainedPlayersList) : ["Elenco completo"]
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

// Tabela de Nível dos Times Adversários por Fase (Grupos próximos 6-6-7, Mata-Mata Mundial 8-9-11-12!)
const STAGE_OPPONENT_LEVELS = [2, 3, 4, 5, 6, 6, 7, 8, 9, 11, 12];

function getStageOpponentBuff(stageIdx) {
  const idx = Math.max(0, stageIdx || 0);
  const st = state.tournament?.stages?.[idx];
  const tableLvl = STAGE_OPPONENT_LEVELS[Math.min(idx, STAGE_OPPONENT_LEVELS.length - 1)] || (1 + idx * 2);
  const oppLevel = typeof st?.oppLevel === "number" ? Math.max(st.oppLevel, tableLvl) : tableLvl;
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
    { name: "Majin Great", iconKey: "keshinMajin", move: "Great The Hand", moveCat: "GK" },
    { name: "Goseishin Titania", iconKey: "keshinIcon", move: "Majin The Wave", moveCat: "GK" },
    { name: "Kenja no Ou Kingburn W", iconKey: "keshinCoin", move: "King's Fire", moveCat: "GK" },
    { name: "Kougaishin Poseidon", iconKey: "keshinIcon", move: "Heavy Aqua Lance", moveCat: "GK" },
    { name: "Goujin Tekki Atlas", iconKey: "keshinCoin", move: "Giga Wheel", moveCat: "GK" },
    { name: "Teppeki Gigadon", iconKey: "keshinCoin", move: "Gigaton Barrier", moveCat: "GK" },
    { name: "Gouma-ou Jashin", iconKey: "keshinMajin", move: "Demon Wall", moveCat: "GK" }
  ],
  DF: [
    { name: "Senkishi Brynhildr", iconKey: "keshinPegasus", move: "Valkyrie Flag", moveCat: "DF" },
    { name: "Akatsuki no Miko Amaterasu", iconKey: "keshinPegasus", move: "Kourin no Ya", moveCat: "DF" },
    { name: "Juuou Leon", iconKey: "keshinMajin", move: "King's Roar", moveCat: "DF" },
    { name: "Juukishi Kingburn", iconKey: "keshinCoin", move: "King's Crush", moveCat: "DF" },
    { name: "Kuroki Tsubasa Raven", iconKey: "keshinIcon", move: "Black Feather", moveCat: "DF" },
    { name: "Ryuukishi Tedis", iconKey: "keshinIcon", move: "Dragon Shield", moveCat: "DF" },
    { name: "Hakugin no Kishi", iconKey: "keshinCoin", move: "Silver Bastion", moveCat: "DF" }
  ],
  MF: [
    { name: "Majin Pegasus Arc", iconKey: "keshinPegasus", move: "Justice Wing", moveCat: "SH" },
    { name: "Sousha Maestro", iconKey: "keshinIcon", move: "Harmonics", moveCat: "OF" },
    { name: "Sengoku Bushin Musashi", iconKey: "keshinCoin", move: "Bushin Renzan", moveCat: "OF" },
    { name: "Taiyoushin Apollo", iconKey: "keshinPegasus", move: "Sunshine Force", moveCat: "SH" },
    { name: "Gouen no Gazard", iconKey: "keshinIcon", move: "Bakunetsu Bomber", moveCat: "SH" },
    { name: "Genei no Dullahan", iconKey: "keshinMajin", move: "Maboroshi Shot", moveCat: "SH" },
    { name: "Kikou-tei Pendragon", iconKey: "keshinCoin", move: "Imperial Order", moveCat: "OF" }
  ],
  FW: [
    { name: "Kensei Lancelot", iconKey: "keshinIcon", move: "Lost Angel", moveCat: "SH" },
    { name: "Seijuu Shining Dragon", iconKey: "keshinPegasus", move: "Shining Breath", moveCat: "SH" },
    { name: "Ankokushin Dark Exodus", iconKey: "keshinMajin", move: "Maou no Ono", moveCat: "SH" },
    { name: "Gouetsu no Saia", iconKey: "keshinIcon", move: "Icicle Road", moveCat: "SH" },
    { name: "Kokuu no Megami Athena", iconKey: "keshinPegasus", move: "Athena Assault", moveCat: "SH" },
    { name: "Makaiou Zodiac", iconKey: "keshinMajin", move: "Disaster Break", moveCat: "SH" },
    { name: "Chou Majin Evarth", iconKey: "keshinMajin", move: "Shellbit Burst", moveCat: "SH" }
  ]
};

const CHARACTER_CANONICAL_KESHINS = [
  { match: "endou", name: "Majin Great", iconKey: "keshinMajin", move: "Great The Hand", moveCat: "GK" },
  { match: "shinsuke", name: "Goseishin Titania", iconKey: "keshinIcon", move: "Majin The Wave", moveCat: "GK" },
  { match: "senguuji", name: "Kenja no Ou Kingburn W", iconKey: "keshinCoin", move: "King's Fire", moveCat: "GK" },
  { match: "genda", name: "Kougaishin Poseidon", iconKey: "keshinIcon", move: "Heavy Aqua Lance", moveCat: "GK" },
  { match: "hyoudou", name: "Teppeki Gigadon", iconKey: "keshinCoin", move: "Gigaton Barrier", moveCat: "GK" },
  { match: "tenma", name: "Majin Pegasus Arc", iconKey: "keshinPegasus", move: "Justice Wing", moveCat: "SH" },
  { match: "shindou", name: "Sousha Maestro", iconKey: "keshinIcon", move: "Harmonics", moveCat: "OF" },
  { match: "tsurugi", name: "Kensei Lancelot", iconKey: "keshinIcon", move: "Lost Angel", moveCat: "SH" },
  { match: "kirino", name: "Senkishi Brynhildr", iconKey: "keshinPegasus", move: "Valkyrie Flag", moveCat: "DF" },
  { match: "kinako", name: "Akatsuki no Miko Amaterasu", iconKey: "keshinPegasus", move: "Kourin no Ya", moveCat: "DF" },
  { match: "hakuryuu", name: "Seijuu Shining Dragon", iconKey: "keshinPegasus", move: "Shining Breath", moveCat: "SH" },
  { match: "shuu", name: "Ankokushin Dark Exodus", iconKey: "keshinMajin", move: "Maou no Ono", moveCat: "SH" },
  { match: "taiyou", name: "Taiyoushin Apollo", iconKey: "keshinPegasus", move: "Sunshine Force", moveCat: "SH" },
  { match: "yukimura", name: "Gouetsu no Saia", iconKey: "keshinIcon", move: "Icicle Road", moveCat: "SH" },
  { match: "kurosaki", name: "Gouen no Gazard", iconKey: "keshinIcon", move: "Bakunetsu Bomber", moveCat: "SH" },
  { match: "mahoro", name: "Genei no Dullahan", iconKey: "keshinMajin", move: "Maboroshi Shot", moveCat: "SH" },
  { match: "namikawa", name: "Kaitei Nepten", iconKey: "keshinIcon", move: "Kaiou no Harpoon", moveCat: "SH" },
  { match: "nishiki", name: "Sengoku Bushin Musashi", iconKey: "keshinCoin", move: "Bushin Renzan", moveCat: "OF" },
  { match: "fei rune", name: "Kousoku Toushi Robin", iconKey: "keshinPegasus", move: "Manganji Spark", moveCat: "SH" },
  { match: "zanark", name: "Makaiou Zodiac", iconKey: "keshinMajin", move: "Disaster Break", moveCat: "SH" },
  { match: "alpha", name: "Tenkuu no Shisha Gain", iconKey: "keshinIcon", move: "Command Shoot 07", moveCat: "SH" },
  { match: "beta", name: "Kokuu no Megami Athena", iconKey: "keshinPegasus", move: "Athena Assault", moveCat: "SH" },
  { match: "gamma", name: "Kyokusei no Ou Lykaon", iconKey: "keshinMajin", move: "Omega Attack", moveCat: "SH" },
  { match: "saru", name: "Chou Majin Evarth", iconKey: "keshinMajin", move: "Shellbit Burst", moveCat: "SH" },
  { match: "saryuu", name: "Chou Majin Evarth", iconKey: "keshinMajin", move: "Shellbit Burst", moveCat: "SH" },
  { match: "gouenji", name: "Honoo no Majin Gazard", iconKey: "keshinIcon", move: "Bakunetsu Storm Kai", moveCat: "SH" },
  { match: "kidou", name: "Sousha Maestro", iconKey: "keshinIcon", move: "Emperor Tact", moveCat: "OF" }
];

function pickCanonicalKeshinForPlayer(player, role = "MF", excludedNames = null, seed = null) {
  const excluded = excludedNames instanceof Set ? excludedNames : new Set();
  const full = String(player?.fullName || player?.name || "").toLowerCase();
  const charMatch = CHARACTER_CANONICAL_KESHINS.find((c) => full.includes(c.match));
  if (charMatch && !excluded.has(charMatch.name)) {
    return {
      name: charMatch.name,
      iconKey: charMatch.iconKey,
      icon: UI[charMatch.iconKey] || UI.keshinIcon,
      move: charMatch.move,
      moveCat: charMatch.moveCat
    };
  }
  const rolePool = CANONICAL_KESHINS[role] || CANONICAL_KESHINS.MF;
  const freshRole = rolePool.filter((k) => !excluded.has(k.name));
  const allPools = [
    ...(CANONICAL_KESHINS.FW || []),
    ...(CANONICAL_KESHINS.MF || []),
    ...(CANONICAL_KESHINS.DF || []),
    ...(CANONICAL_KESHINS.GK || [])
  ];
  const freshAny = allPools.filter((k) => !excluded.has(k.name));
  const pool = freshRole.length > 0 ? freshRole : freshAny.length > 0 ? freshAny : rolePool;
  const pickIdx = seed === null || seed === undefined
    ? Math.floor(Math.random() * pool.length)
    : Math.abs(seed) % pool.length;
  const chosen = pool[pickIdx];
  return {
    name: chosen.name,
    iconKey: chosen.iconKey,
    icon: UI[chosen.iconKey] || UI.keshinIcon,
    move: chosen.move,
    moveCat: chosen.moveCat
  };
}

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

  // Quantos craques rivais têm Keshin, Manual Secreto, técnicas evoluídas e bônus de item
  const keshinCount = sIdx <= 1 ? 1 : sIdx <= 5 ? 2 : sIdx <= 8 ? 3 : 4;
  const evoCount = sIdx === 0 ? 1 : sIdx <= 2 ? 2 : sIdx <= 5 ? 3 : sIdx <= 7 ? 5 : sIdx <= 9 ? 7 : 8;
  const equipCount = sIdx === 0 ? 1 : sIdx <= 2 ? 3 : sIdx <= 5 ? 4 : sIdx <= 8 ? 6 : 8;
  const manualCount = sIdx >= 9 ? 3 : sIdx >= 7 ? 2 : sIdx >= 4 ? 1 : 0;

  const idSeed = String(oppTeam?.id || oppTeam?.name || "opp")
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  const usedKeshinNames = new Set();
  ranked.forEach((entry, idx) => {
    const p = entry.player;
    const role = entry.slot.role;
    if (idx < keshinCount) {
      const k = pickCanonicalKeshinForPlayer(p, role, usedKeshinNames, idSeed + idx + sIdx);
      usedKeshinNames.add(k.name);
      p.keshin = k;
    }
    if (idx < manualCount) {
      applySecretManualMastery(p, role);
    } else if (idx < evoCount) {
      evolvePlayerPrimaryMove(p, role);
    }
    if (sIdx >= 5 && idx < (sIdx >= 8 ? 4 : 2)) {
      evolvePlayerPrimaryMove(p, role);
    }
    if (idx < equipCount) {
      p.bonusPower = (p.bonusPower || 0) + 12 + sIdx * 5;
      const statBoost = 2 + Math.floor(sIdx * 0.85);
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
