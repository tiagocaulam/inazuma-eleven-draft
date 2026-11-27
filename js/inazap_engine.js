// Motor dinâmico de personalidades, falas brasileiras e reações vivas para o InaZap (Teste Beta)
(function () {
  const CANONICAL_VOICE_RULES = [
    // CAPTAIN_FIRE: apaixonado, pilha alta, chama a galera pro campo
    { voice: "CAPTAIN_FIRE", patterns: ["endou", "endo", "mark", "tenma", "arion", "asuto", "inamori", "rococo", "hector", "fidio", "paolo", "sangoku", "shinsuke", "jp", "goujin"] },
    // COLD_ACE: seco, poucas palavras, direto e letal
    { voice: "COLD_ACE", patterns: ["gouenji", "goenji", "axel", "fubuki", "shawn", "tsurugi", "victor", "gazel", "bryce", "suzuno", "shadow", "kurogane", "yukimura", "haizaki"] },
    // TACTICIAN: cerebral, leitura limpa de campo e espaço
    { voice: "TACTICIAN", patterns: ["kidou", "kido", "jude", "shindou", "riccardo", "nosaka", "ichihoshi", "froy", "nakata", "clario", "mizukamiya", "kirino", "gabi", "ichinose", "erik", "alpha", "otomura"] },
    // HOTHEAD: esquentado, competitivo, fala na lata
    { voice: "HOTHEAD", patterns: ["someoka", "kevin", "burn", "nagumo", "torch", "desarm", "saginuma", "dvalin", "atsuya", "hiroto kira", "baddap", "drago", "mukata", "senguuji", "nishiki", "roma", "ibuki"] },
    // REBEL_TROLL: provocador, irônico, ri de treta e mete lenha com humor
    { voice: "REBEL_TROLL", patterns: ["fudou", "caleb", "kariya", "aitor", "kogure", "beta", "gamma", "zanark", "saru", "ulvida", "reina", "matatagi", "falco", "ozrock", "medusa"] },
    // DIVINE_PRIDE: confiante, teatral, elegante, se acha acima da média
    { voice: "DIVINE_PRIDE", patterns: ["aphrodi", "afuro", "byron", "taiyou", "sol", "hakuryuu", "bailong", "edgar", "poseidon", "apollon", "artemis", "zeus", "alvega", "xeno"] },
    // CHILL_JOKER: resenha, comida, zoeira, quebra o gelo, fala leve
    { voice: "CHILL_JOKER", patterns: ["tsunami", "hurley", "kabeyama", "jack", "max", "matsuno", "megane", "kurimatsu", "shishido", "tamagorou", "golem", "han-chan", "hamano", "amagi", "kinako", "goldie", "torb", "fei", "dylan"] },
    // STOIC_WALL: guardião firme, protetor da defesa/gol, seguro
    { voice: "STOIC_WALL", patterns: ["genda", "king", "tachimukai", "darren", "tobitaka", "archer", "hijikata", "raiden", "domon", "bobby", "sugimori", "sakuma", "nero", "teles", "nishikage", "norika", "seidou"] },
    // SPEED_SPARK: elétrico, fala rápido, foca em velocidade e contra-ataque
    { voice: "SPEED_SPARK", patterns: ["kazemaru", "nathan", "toramaru", "austin", "midorikawa", "reize", "hiura", "kirina", "shourin", "gran", "hirotokiyama", "kiyama", "nae", "mansaku", "kurama"] },
    // HEART_TEAM: parceiro leal, equilibrado, acolhedor no grupo
    { voice: "HEART_TEAM", patterns: ["handa", "jin", "kageyama hikaru", "kurosaki", "mahoro", "ponko", "konoha", "sakura", "minaho", "manabe", "sakanoue", "mark kruger"] }
  ];

  const VOICE_META = {
    CAPTAIN_FIRE: { label: "Alma do Time", laughs: ["haha", "kkk"], slang: "bora", intensity: 3 },
    COLD_ACE: { label: "Frio e Direto", laughs: ["tsc", "hm"], slang: "foco", intensity: 1 },
    TACTICIAN: { label: "Cabeça Fria", laughs: ["haha"], slang: "espaço", intensity: 2 },
    HOTHEAD: { label: "Sangue Quente", laughs: ["aham", "pff"], slang: "bora logo", intensity: 3 },
    REBEL_TROLL: { label: "Provocador", laughs: ["kkk", "kkkk"], slang: "quero só ver", intensity: 2 },
    DIVINE_PRIDE: { label: "Estrela", laughs: ["hmph", "haha"], slang: "perfeito", intensity: 2 },
    CHILL_JOKER: { label: "Resenha", laughs: ["kkk", "rs", "kkkk"], slang: "relaxa", intensity: 2 },
    STOIC_WALL: { label: "Muralha", laughs: ["haha"], slang: "garantido", intensity: 2 },
    SPEED_SPARK: { label: "Veloz", laughs: ["haha", "kkk"], slang: "partiu", intensity: 3 },
    HEART_TEAM: { label: "Parceiro", laughs: ["haha", "kk"], slang: "tmj", intensity: 2 }
  };

  function normNameKey(raw) {
    return String(raw || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function hashActorSeed(str) {
    let h = 2166136261;
    const s = String(str || "actor");
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
  }

  function shortFirstName(actorOrName) {
    const raw = typeof actorOrName === "string" ? actorOrName : (actorOrName?.name || "");
    const clean = String(raw || "").trim().replace(/\s*\([^)]*\)/g, "");
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "parceiro";
    if (parts.length === 1) return parts[0];
    // Em nomes estilo "Satoru Endo" / "Shuya Goenji" / "Jousuke Tsunami", usa o nome mais reconhecível
    if (parts[parts.length - 1].length >= 4 && !/^(da|de|do|dos|das|silva|junior)$/i.test(parts[parts.length - 1])) {
      return parts[parts.length - 1];
    }
    return parts[0];
  }

  function resolveInazumaPersona(actor) {
    if (!actor) return { voice: "HEART_TEAM", meta: VOICE_META.HEART_TEAM, isCanonical: false };
    if (actor._personaVoice && VOICE_META[actor._personaVoice]) {
      return { voice: actor._personaVoice, meta: VOICE_META[actor._personaVoice], isCanonical: true };
    }
    const haystack = normNameKey(`${actor.name || ""} ${actor.fullName || ""} ${actor.id || ""}`);
    for (let i = 0; i < CANONICAL_VOICE_RULES.length; i++) {
      const rule = CANONICAL_VOICE_RULES[i];
      if (rule.patterns.some((pat) => haystack.includes(normNameKey(pat)))) {
        actor._personaVoice = rule.voice;
        return { voice: rule.voice, meta: VOICE_META[rule.voice], isCanonical: true };
      }
    }

    // Fallback determinístico baseado no arquétipo real, posição, elemento e hash único
    let fallbackVoice = "HEART_TEAM";
    const arch = String(actor.archetype || "");
    const el = String(actor.element || "");
    const h = hashActorSeed(actor.id || actor.name);
    if (actor.isCaptain || arch === "WARRIOR") {
      fallbackVoice = h % 3 === 0 ? "CAPTAIN_FIRE" : "HOTHEAD";
    } else if (arch === "EGO_STRIKER") {
      fallbackVoice = el === "Vento" ? "DIVINE_PRIDE" : h % 2 === 0 ? "COLD_ACE" : "HOTHEAD";
    } else if (arch === "STRATEGIST") {
      fallbackVoice = h % 4 === 0 ? "REBEL_TROLL" : "TACTICIAN";
    } else if (arch === "KEEPER_WALL") {
      fallbackVoice = h % 3 === 0 ? "CAPTAIN_FIRE" : "STOIC_WALL";
    } else if (arch === "PACE_LEADER") {
      fallbackVoice = "SPEED_SPARK";
    } else {
      fallbackVoice = h % 3 === 0 ? "CHILL_JOKER" : h % 3 === 1 ? "HEART_TEAM" : "SPEED_SPARK";
    }
    actor._personaVoice = fallbackVoice;
    return { voice: fallbackVoice, meta: VOICE_META[fallbackVoice], isCanonical: false };
  }

  function humanizeInaZapText(rawText, actor = null) {
    let txt = String(rawText || "");
    if (!txt) return "";

    // 1) Elimina 100% de travessões e meia-risca em mensagens de chat
    txt = txt
      .replace(/\s*[—–]\s*([a-zà-ÿ])/g, ", $1")
      .replace(/\s*[—–]\s*([A-ZÀ-Ÿ0-9])/g, ". $1")
      .replace(/[—–]+/g, ", ")
      .replace(/\s{2,}/g, " ")
      .replace(/,\s*,+/g, ",")
      .replace(/\.\s+\.+/g, "...")
      .replace(/\.{4,}/g, "...");

    // 2) Troca expressões artificiais / corporativas por português natural de futebol brasileiro
    const naturalSwaps = [
      [/comprou a ideia/gi, "fechou junto"],
      [/assumir a maturidade aqui dentro/gi, "resolver isso entre a gente"],
      [/assumir a maturidade/gi, "segurar a onda aqui"],
      [/blindar(?:mos)? o vestiário/gi, "fechar o grupo"],
      [/hierarquia ofensiva/gi, "quem decide na frente"],
      [/dentro das quatro linhas/gi, "no campo"],
      [/administração perfeita/gi, "mandou muito bem"],
      [/elevar o nível/gi, "subir o ritmo"],
      [/fator psicológico/gi, "cabeça no lugar"],
      [/protocolo tático/gi, "esquema de jogo"],
      [/executar até o último segundo do relógio/gi, "correr até o apito final"],
      [/cumprir minha parte no gramado/gi, "fazer o meu em campo"],
      [/\bde o (próximo adversário|próximo time|adversário|time)\b/gi, "do $1"],
      [/\bpra o (próximo adversário|próximo time|adversário|time)\b/gi, "pro $1"],
      [/\bno o (próximo adversário|próximo time|adversário|time)\b/gi, "no $1"]
    ];
    for (let i = 0; i < naturalSwaps.length; i++) {
      txt = txt.replace(naturalSwaps[i][0], naturalSwaps[i][1]);
    }

    // 3) Variação orgânica estrita por voz (COLD_ACE nunca grita em CAPS nem ri com kkk/haha)
    const p = resolveInazumaPersona(actor);
    if (p.voice === "COLD_ACE") {
      txt = txt
        .replace(/^(Haha|K+k+|Rs+|Aeee+)[,!.\s]*/i, "")
        .replace(/(?:^|\s)(k{2,}|haha+|rs+|aeee+)[!?.]*(?=\s|$|[,.])/gi, "")
        .replace(/\?{2,}/g, "?")
        .replace(/!{2,}/g, ".")
        .replace(/\b([A-ZÀ-Ÿ]{5,})\b/g, (w) => {
          if (/^(EX|GK|FW|MF|DF|OVR|FFI|INAZUMA)$/.test(w)) return w;
          return w.toLowerCase();
        })
        .replace(/\s{2,}/g, " ")
        .trim();
      txt = txt.replace(/^([a-zà-ÿ])/, (_, ch) => ch.toUpperCase());
      if (txt && !/[.!?]$/.test(txt)) txt += ".";
    } else if (p.voice === "REBEL_TROLL" || p.voice === "CHILL_JOKER") {
      txt = txt.replace(/\bHaha\b/g, "kkk");
    }

    return txt.trim();
  }

  function humanizeTacticalChangeForChat(rawChange = "") {
    const raw = String(rawChange || "").trim();
    if (!raw) return "";
    const low = raw.toLowerCase();
    if (low.includes("postura:")) {
      if (low.includes("avançado")) return "postura agressiva no ataque";
      if (low.includes("recuado")) return "linha mais fechada atrás";
      return "postura equilibrada entre ataque e defesa";
    }
    if (low.includes("estilo:")) {
      if (low.includes("posse")) return "troca de passes com calma";
      if (low.includes("vertical")) return "jogada vertical rápida pro ataque";
      return "liberdade pra improvisar em campo";
    }
    if (low.includes("corredor:")) {
      if (low.includes("pontas")) return "saída pelas pontas";
      if (low.includes("meio")) return "infiltração pelo meio";
      return "movimentação livre pelos lados e pelo centro";
    }
    if (low.includes("esforço:")) {
      if (low.includes("alta")) return "pressão alta no campo todo";
      if (low.includes("baixa")) return "preservação de fôlego em campo";
      return "intensidade controlada";
    }
    if (low.includes("formação:")) {
      const f = raw.replace(/^[^:]+:\s*/, "").trim();
      return f ? `nova formação ${f}` : "nova formação em campo";
    }
    if (low.includes("capitão:")) {
      const n = raw.replace(/^[^:]+:\s*/, "").trim();
      return n ? `faixa de capitão com ${n}` : "liderança em campo";
    }
    if (low.includes("camisa 10:")) {
      const n = raw.replace(/^[^:]+:\s*/, "").trim();
      if (low.includes("automático")) return "divisão de jogadas sem fixar camisa 10";
      return n ? `criação centralizada no ${n}` : "referência técnica no meio";
    }
    if (low.includes("marcação especial:")) {
      const n = raw.replace(/^[^:]+:\s*/, "").trim();
      if (low.includes("livre")) return "marcação por setor sem perseguir um só jogador";
      return n ? `marcação colada no ${n}` : "marcação individual no destaque deles";
    }
    if (low.includes("tática especial:")) {
      const n = raw.replace(/^[^:]+:\s*/, "").trim();
      return n ? `tática especial ${n}` : "tática especial do time";
    }
    return raw.replace(/^[^:]+:\s*/, "").trim();
  }

  function moveWithArticle(moveName, prep = "") {
    const clean = String(moveName || "técnica").trim();
    const low = clean.toLowerCase();
    let art = "o";
    if (/^(asas|chamas|garras|ondas|estrelas|l[aâ]minas|sombras|espadas|rosas|balas)\b/i.test(low)) {
      art = "as";
    } else if (/^(pinguins|raios|meteoros|lobos|drag[õo]es|ventos|golpes|punhos|canh[õo]es|furac[õo]es|tornados|disparos|chutes|olhos)\b/i.test(low)) {
      art = "os";
    } else if (/^(grande\s+(muralha|barreira|defesa|torre)|m[aã]o|barreira|muralha|torre|rede|dan[çc]a|finta|bola|espiral|l[aâ]mina|estrela|zona|defesa|guarda|asa|chama|aura|tempestade|origem|lenda|f[eê]nix|flecha|garra|for[çc]a|onda|flor|luz|sombra|nevasca|avalanche|espada|cruz|corrida|roleta|parede|cortina|explos[aã]o|ilus[aã]o|miragem|chuva|queda|presa|serpente|corrente|pris[aã]o|esfera|rajada|lan[çc]a|ponte|roda|t[eé]cnica)\b/i.test(low)) {
      art = "a";
    }
    if (prep === "de") {
      const map = { a: "da", o: "do", as: "das", os: "dos" };
      return `${map[art]} ${clean}`;
    }
    if (prep === "em") {
      const map = { a: "na", o: "no", as: "nas", os: "nos" };
      return `${map[art]} ${clean}`;
    }
    if (prep === "com") {
      return `com ${art} ${clean}`;
    }
    if (prep === "para") {
      const map = { a: "pra", o: "pro", as: "pras", os: "pros" };
      return `${map[art]} ${clean}`;
    }
    return `${art} ${clean}`;
  }

  function describeActorMoveAction(actor = {}, ctx = {}) {
    const move = ctx.sigMove || actor.sigMove || "minha técnica";
    const cat = ctx.sigMoveCat || actor.sigMoveCat || (actor.role === "GK" ? "GK" : actor.role === "DF" ? "DF" : actor.role === "MF" ? "OF" : "SH");
    const opp = ctx.oppName || "eles";
    const mArt = moveWithArticle(move);
    const mEm = moveWithArticle(move, "em");
    const mCom = moveWithArticle(move, "com");
    if (cat === "GK") {
      return {
        cat,
        move,
        clutchLine: `${mCom.charAt(0).toUpperCase() + mCom.slice(1)} fechando o gol, ${opp} não passa lá atrás hoje.`,
        supportLine: `lá atrás o gol tá trancado ${mCom}!`,
        breakLine: `Se tentarem chutar da entrada da área eu seguro ${mEm}.`
      };
    }
    if (cat === "DF") {
      return {
        cat,
        move,
        clutchLine: `Se o ataque de ${opp} tentar entrar na área, eu travo na hora ${mCom}.`,
        supportLine: `na marcação eu fecho a porta ${mCom}!`,
        breakLine: `Quem tentar passar por mim para ${mEm}.`
      };
    }
    if (cat === "OF") {
      return {
        cat,
        move,
        clutchLine: `Se der meio metro de espaço, eu corto a marcação ${mCom} e deixo alguém na cara do gol.`,
        supportLine: `se abrir corredor no meio eu passo liso ${mCom}!`,
        breakLine: `${mCom.charAt(0).toUpperCase() + mCom.slice(1)} eu limpo dois marcadores e sirvo na boa.`
      };
    }
    return {
      cat: "SH",
      move,
      clutchLine: `Se der espaço ${moveWithArticle(move, "para")}, o goleiro de ${opp} nem vê a cor da bola.`,
      supportLine: `se sobrar na área eu solto ${mArt}!`,
      breakLine: `Quando eu engatilhar ${mArt}, a zaga deles não acompanha.`
    };
  }

  function pickFreshWeighted(t, pool = [], threadUsedSet = null) {
    if (!Array.isArray(pool) || pool.length === 0) return null;
    const store = t && typeof t === "object" ? t : null;
    const history = store && Array.isArray(store._usedInaZapLineKeys) ? store._usedInaZapLineKeys : [];
    const recentSet = new Set(history.slice(-85));
    const isFreshInThread = (item) => {
      if (!threadUsedSet || !item?.text) return true;
      return !threadUsedSet.has(String(item.text).trim().toLowerCase());
    };
    let candidates = pool.filter((item) => item && item.key && !recentSet.has(item.key) && isFreshInThread(item));
    if (candidates.length === 0) {
      const shorterSet = new Set(history.slice(-24));
      candidates = pool.filter((item) => item && item.key && !shorterSet.has(item.key) && isFreshInThread(item));
    }
    if (candidates.length === 0) {
      candidates = pool.filter((item) => item && isFreshInThread(item));
    }
    if (candidates.length === 0) candidates = pool;
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    if (store && chosen?.key) {
      if (!Array.isArray(store._usedInaZapLineKeys)) store._usedInaZapLineKeys = [];
      store._usedInaZapLineKeys.push(chosen.key);
      if (store._usedInaZapLineKeys.length > 140) {
        store._usedInaZapLineKeys = store._usedInaZapLineKeys.slice(-140);
      }
    }
    return chosen;
  }

  function getPersonaReplyBank(voice, ctx = {}) {
    const opp = ctx.oppName || "eles";
    const move = ctx.sigMove || "minha técnica";
    const other = ctx.otherName || "galera";
    const tac = humanizeTacticalChangeForChat(ctx.tacText || "");
    const coopMove = ctx.coopMove || "";
    const mArt = moveWithArticle(move);
    const mDe = moveWithArticle(move, "de");
    const mEm = moveWithArticle(move, "em");
    const mCom = moveWithArticle(move, "com");
    const mv = describeActorMoveAction(ctx.actor || {}, {
      sigMove: move,
      sigMoveCat: ctx.sigMoveCat,
      oppName: opp
    });

    const banks = {
      CAPTAIN_FIRE: {
        GREAT: [
          { key: "cf_g1", text: `É isso aí, professor!! Com o time fechado assim ninguém segura a gente contra ${opp}!` },
          { key: "cf_g2", text: `Boraaa! Essa energia no grupo já me deu pilha pra treinar mais duas horas!`, extra: `E pode ter certeza, ${mv.supportLine}` },
          { key: "cf_g3", text: tac ? `Curti demais apostar em ${tac}! Bora entrar mordendo desde o primeiro minuto!` : `Tô arrepiado já, sério. Bora fazer valer cada gota de suor contra ${opp}!` },
          { key: "cf_g4", text: `Futebol é isso aqui, ${other}! Quando todo mundo olha pro mesmo lado sai jogada gigante!` },
          { key: "cf_g5", text: `Com esse foco contra ${opp}, a torcida vai sair do estádio sem voz!` }
        ],
        GOOD: [
          { key: "cf_ok1", text: tac ? `Fechado em ${tac}! Todo mundo ajudando na marcação fica bem mais leve!` : `Boa, professor! Se a gente correr um pelo outro já muda a cara do jogo.` },
          { key: "cf_ok2", text: `Beleza! Já vou avisando a linha de trás pra ninguém desligar contra ${opp}.` },
          { key: "cf_ok3", text: `Tamo junto nessa! Agora é ir pro campo e testar na prática.` },
          { key: "cf_ok4", text: `Firmeza, ${other}! Cada bola dividida contra ${opp} vai ser nossa!` }
        ],
        TRADEOFF: [
          { key: "cf_tr1", text: `Beleza, professor. Tem risco, mas futebol sem coragem não tem graça nenhuma!` },
          { key: "cf_tr2", text: tac ? `Vai exigir mais fôlego com ${tac}, então bora puxar o ritmo no aquecimento!` : `Se apertar lá atrás eu mesmo cubro a sobra, pode deixar comigo.` },
          { key: "cf_tr3", text: `Aposta alta pede entrega dobrada! Bora segurar juntos em campo!` }
        ],
        POOR: [
          { key: "cf_bd1", text: `Pô professor... eu vou dar o sangue igual, mas senti que a galera ficou meio travada.` },
          { key: "cf_bd2", text: `Eita, assim o clima pesa antes do jogo. Bora tentar não levar isso pro campo, pessoal.` },
          { key: "cf_bd3", text: `Não curti muito o rumo, mas vestiário campeão resolve jogando bola!` }
        ],
        CHIME_RAGE: [
          { key: "cf_cr1", text: `Ei ei, para tudo vocês dois! A gente tá no mesmo barco contra ${opp}!` },
          { key: "cf_cr2", text: `Calma aí, ${other}! Não deixa uma discussão boba esfriar o nosso treino!` },
          { key: "cf_cr3", text: `Respirem fundo os dois! Se dividirmos o grupo agora quem ganha é ${opp}!` },
          { key: "cf_cr4", text: `Bora focar no escudo que a gente carrega antes de sair trocando farpa aqui!` }
        ],
        CHIME_HYP: [
          { key: "cf_ch1", text: `Tô dentro total! Se der brecha eu grito na hora pra gente encaixar!` },
          { key: "cf_ch2", text: `Cara, que absurdo vai ficar isso quando sair contra ${opp}!!` },
          { key: "cf_ch3", text: `Essa é a faísca que faltava! Quero ver todo mundo ligado no lance!` },
          { key: "cf_ch4", text: `Se precisarem de corredor aberto ou apoio no lance, tô colado com vocês!` }
        ]
      },

      COLD_ACE: {
        GREAT: [
          { key: "ca_g1", text: `Fechado. Toca no tempo certo que o gol sai.` },
          { key: "ca_g2", text: tac ? `Bom ajuste em ${tac}. Agora é mostrar contra ${opp}.` : `Certo. Só façam a parte de vocês que eu resolvo no meu setor.` },
          { key: "ca_g3", text: mv.clutchLine },
          { key: "ca_g4", text: `${other}, mantém o olho na minha corrida. Um segundo basta.` },
          { key: "ca_g5", text: `Objetivo claro. Contra ${opp} ninguém vacila.` }
        ],
        GOOD: [
          { key: "ca_ok1", text: `Certo. Faz sentido pra cima de ${opp}.` },
          { key: "ca_ok2", text: `Ok. Foca no treino que eu tô pronto.` },
          { key: "ca_ok3", text: `Beleza, menos conversa e mais jogo.` },
          { key: "ca_ok4", text: `Combinado, ${other}. Só manter o ritmo.` }
        ],
        TRADEOFF: [
          { key: "ca_tr1", text: `Tem custo, mas funciona. Eu banco lá na frente.` },
          { key: "ca_tr2", text: tac ? `Aceito o risco com ${tac}. Só não vacilem na saída.` : `Tanto faz o desgaste. O que importa é vencer ${opp}.` },
          { key: "ca_tr3", text: `Ousado. Desde que a bola chegue inteira, por mim tudo bem.` }
        ],
        POOR: [
          { key: "ca_bd1", text: `...Decisão estranha, técnico.` },
          { key: "ca_bd2", text: `Se a bola não chegar limpa desse jeito, não cobra depois.` },
          { key: "ca_bd3", text: `Tsc. Tomara que dê certo contra ${opp}.` }
        ],
        CHIME_RAGE: [
          { key: "ca_cr1", text: `Chega. Os dois estão falando demais.` },
          { key: "ca_cr2", text: `Se tiverem essa energia toda pra marcar ${opp}, já ajuda.` },
          { key: "ca_cr3", text: `Discussão inútil. Resolvam treinando.` },
          { key: "ca_cr4", text: `Poupem fôlego pro jogo.` }
        ],
        CHIME_HYP: [
          { key: "ca_ch1", text: `Interessante. Se abrir o corredor eu entro.` },
          { key: "ca_ch2", text: `Não atrasem o passe. Só isso.` },
          { key: "ca_ch3", text: `Boa ideia. Dá pra quebrar a marcação de ${opp} nisso.` },
          { key: "ca_ch4", text: `Me acionem na hora certa que funciona.` }
        ]
      },

      TACTICIAN: {
        GREAT: [
          { key: "tc_g1", text: tac ? `Boa leitura, técnico! Com ${tac}, o meio de ${opp} vai abrir espaço nas costas dos volantes.` : `Exato! Se a gente girar a bola rápido pelo meio, ${opp} não acompanha a troca.` },
          { key: "tc_g2", text: mv.cat === "DF" || mv.cat === "GK" ? `${other}, se você fechar a primeira linha comigo, a gente trava o ataque de ${opp} ${mCom}.` : `${other}, se você puxar um marcador quando eu preparar ${mArt}, a linha deles quebra inteira.` },
          { key: "tc_g3", text: `Perfeito. Já até marquei onde costuma sobrar o rebote contra o esquema deles.` },
          { key: "tc_g4", text: `Com essa organização, cada passe nosso contra ${opp} vai ter dois alvos livres.` }
        ],
        GOOD: [
          { key: "tc_ok1", text: `Faz bastante sentido. Dá pra controlar o ritmo sem se expor.` },
          { key: "tc_ok2", text: tac ? `Anotado sobre ${tac}. Só precisamos sincronizar a distância entre linhas.` : `Certo, vou ajustar a leitura de passe pensando nisso.` },
          { key: "tc_ok3", text: `Boa, assim ninguém corre errado atrás da bola.` },
          { key: "tc_ok4", text: `Equilibrado, ${other}. Dá pra rodar o jogo com tranquilidade.` }
        ],
        TRADEOFF: [
          { key: "tc_tr1", text: `É uma aposta ousada. Ganha poder de fogo mas exige cobertura rápida se perdermos a bola.` },
          { key: "tc_tr2", text: `Beleza, vou ficar de olho na transição de ${opp} pra não deixar buraco.` },
          { key: "tc_tr3", text: `Tem margem de risco calculada. Se ajustarmos o tempo da pressão, compensa.` }
        ],
        POOR: [
          { key: "tc_bd1", text: `Sinceramente, professor? Esse plano entrega exatamente o espaço que ${opp} gosta.` },
          { key: "tc_bd2", text: `Não curti a ideia, mas vou tentar consertar o posicionamento na hora.` },
          { key: "tc_bd3", text: `Vamos ficar com a linha curta se jogarmos assim... olho atento lá atrás.` }
        ],
        CHIME_RAGE: [
          { key: "tc_cr1", text: `Pessoal, brigar aqui só ajuda ${opp}. Olhem pro que a gente precisa ajustar no campo.` },
          { key: "tc_cr2", text: `Os dois têm parte de razão, mas se não conversarem direito vai dar erro de passe na hora H.` },
          { key: "tc_cr3", text: `Se a comunicação quebrar fora de campo, dentro dele o meio-campo vira uma peneira.` },
          { key: "tc_cr4", text: `Baixem a temperatura, ${other}. A gente precisa das duas cabeças frescas contra ${opp}.` }
        ],
        CHIME_HYP: [
          { key: "tc_ch1", text: `O ângulo dessa jogada é ótimo. Se soltar de primeira não tem interceptação que pegue.` },
          { key: "tc_ch2", text: `Eu calculo o tempo da tabela com vocês, manda o sinal no treino.` },
          { key: "tc_ch3", text: `Se puxarmos dois marcadores pro centro, essa saída abre um clarão.` },
          { key: "tc_ch4", text: `Tecnicamente é exatamente o ponto fraco da defesa de ${opp}!` }
        ]
      },

      HOTHEAD: {
        GREAT: [
          { key: "hh_g1", text: `Aí sim!! Tava na hora de partir pra cima sem medo de ${opp}!!` },
          { key: "hh_g2", text: mv.cat === "DF" || mv.cat === "GK" ? `Quero ver o ataque deles passar ${mDe} depois dessa conversa!` : `Quero ver a zaga deles aguentar ${mArt} depois dessa conversa!` },
          { key: "hh_g3", text: tac ? `Mandar ${tac} agora ficou brabo demais!! Bora atropelar!` : `É disso que eu tô falando! Agora ninguém tira o olho da bola!` },
          { key: "hh_g4", text: `Agora sim o sangue ferveu do jeito certo! Coitado de ${opp}!` }
        ],
        GOOD: [
          { key: "hh_ok1", text: `Beleza, fechou! Só quero intensidade lá dentro.` },
          { key: "hh_ok2", text: `Tô pronto já. Se ${opp} vier duro eu respondo em campo!` },
          { key: "hh_ok3", text: `Demorou, ${other}, agora sim vamos jogar sério.` },
          { key: "hh_ok4", text: `Bora pra cima então, sem moleza em dividida nenhuma!` }
        ],
        TRADEOFF: [
          { key: "hh_tr1", text: `Pode mandar o risco! Melhor morrer tentando ganhar do que ficar assistindo ${opp} jogar!` },
          { key: "hh_tr2", text: `Se cansar eu corro na raça mesmo, tô nem aí!` },
          { key: "hh_tr3", text: `Jogo grande é pra quem bota a cara! Manda ver!` }
        ],
        POOR: [
          { key: "hh_bd1", text: `Ah qual é, professor?! Desse jeito a gente vai entrar recuado apanhando!` },
          { key: "hh_bd2", text: `Não desceu bem não... mas bora ver quem aguenta na hora do jogo.` },
          { key: "hh_bd3", text: `Ficar segurando freio contra ${opp} me tira do sério, mas bora lá.` }
        ],
        CHIME_RAGE: [
          { key: "hh_cr1", text: `Ôpa, querem resolver no grito ou mostrando bola no campo?!` },
          { key: "hh_cr2", text: `Para de chorar os dois, ${opp} não vai ter dó de ninguém amanhã!` },
          { key: "hh_cr3", text: `Se é pra ter fogo, vamo jogar essa raiva toda em cima da marcação de ${opp}!` },
          { key: "hh_cr4", text: `Bora testar quem tem razão na próxima disputa de bola do treino, simples!` }
        ],
        CHIME_HYP: [
          { key: "hh_ch1", text: `Tô dentro!! Me coloca nessa jogada que eu dou a vida em campo!` },
          { key: "hh_ch2", text: `Quero ver se a marcação deles segura o tranco da nossa jogada!` },
          { key: "hh_ch3", text: `Essa sim tem cara de lance que derruba goleiro!!` },
          { key: "hh_ch4", text: `Já quero testar isso agora mesmo antes do treino acabar!` }
        ]
      },

      REBEL_TROLL: {
        GREAT: [
          { key: "rt_g1", text: `Olha só, até que o técnico mandou bem nessa kkk. Quero ver ${opp} entender algo agora.` },
          { key: "rt_g2", text: `Haha beleza, pelo menos não ficou aquele papo chato. Agora vai ficar divertido.` },
          { key: "rt_g3", text: `Se deixarem solto eu aposto que faço o marcador de ${opp} cair sentado kkk` },
          { key: "rt_g4", text: `Bom plano professor, até eu fiquei com vontade de assistir esse jogo kkk` }
        ],
        GOOD: [
          { key: "rt_ok1", text: `É, dá pro gasto. Melhor do que ficar parado no treino sem fazer nada kkk` },
          { key: "rt_ok2", text: `Tranquilo, ${other}. Só não me pede pra sorrir depois da jogada kkk` },
          { key: "rt_ok3", text: `Bora testar então. Se der bom eu até falo que foi ideia sua.` },
          { key: "rt_ok4", text: `Fechou! Se ${opp} piscar a gente já apronta.` }
        ],
        TRADEOFF: [
          { key: "rt_tr1", text: `Opa, gostei da loucura kkk. Se der errado ninguém viu quem sugeriu hein!` },
          { key: "rt_tr2", text: `Arriscado? Bem melhor assim. Jogo morno dá sono.` },
          { key: "rt_tr3", text: `Gosto quando a comissão joga pra bagunçar o plano dos caras kkk` }
        ],
        POOR: [
          { key: "rt_bd1", text: `kkkkk sério mesmo essa ordem? Tá bom né, quem sou eu...` },
          { key: "rt_bd2", text: `Vish, já vi tudo. Depois não reclama se o plano azedar no meio do jogo.` },
          { key: "rt_bd3", text: `Ah pronto... boa sorte pra quem for obedecer isso aí kkk` }
        ],
        CHIME_RAGE: [
          { key: "rt_cr1", text: `Pega a pipoca que o grupo hoje tá pegando fogo kkk`, extra: `Mas falando sério, guarda metade dessa raiva pra bater em ${opp}.` },
          { key: "rt_cr2", text: `Ué, já acabou a briga ou vai ter segundo tempo? kkk` },
          { key: "rt_cr3", text: `Vocês dois discutindo por aqui parece até pré-jogo de rival kkk` },
          { key: "rt_cr4", text: `Duvido vocês dois pararem de olhar torto até entrar no campo kkk` }
        ],
        CHIME_HYP: [
          { key: "rt_ch1", text: `Se vocês errarem esse tempo novo eu vou zoar a semana inteira kkk` },
          { key: "rt_ch2", text: `Até que ficou sinistro hein. Quero ver ${opp} tentar marcar isso!` },
          { key: "rt_ch3", text: `Se funcionar de primeira no jogo eu finjo que ajudei a inventar kkk` },
          { key: "rt_ch4", text: `Isso aí vai deixar o camisa 10 de ${opp} falando sozinho!` }
        ]
      },

      DIVINE_PRIDE: {
        GREAT: [
          { key: "dp_g1", text: `Agora sim uma estratégia digna do nosso futebol. ${opp} vai apenas assistir.` },
          { key: "dp_g2", text: `Quando eu acionar ${mArt} com esse apoio, o jogo vira obra de arte.` },
          { key: "dp_g3", text: `Perfeito, professor. A vitória já começa a tomar forma.` },
          { key: "dp_g4", text: `Com esse nível de exigência, ninguém neste torneio nos acompanha.` }
        ],
        GOOD: [
          { key: "dp_ok1", text: `Aceitável. Se mantiverem esse padrão, nós controlamos ${opp} fácil.` },
          { key: "dp_ok2", text: `Muito bem, ${other}. Só capriche no timing e o resto flui.` },
          { key: "dp_ok3", text: `Razoável. Façamos o necessário com elegância.` }
        ],
        TRADEOFF: [
          { key: "dp_tr1", text: `Um preço pequeno para quem busca o extraordinário em campo.` },
          { key: "dp_tr2", text: `Não temo o risco. Grandes jogadas exigem ousadia.` },
          { key: "dp_tr3", text: `Que assim seja. Vamos impor nossa superioridade.` }
        ],
        POOR: [
          { key: "dp_bd1", text: `Isso limita completamente o meu brilho em campo, treinador.` },
          { key: "dp_bd2", text: `Comum demais... esperava algo muito mais ambicioso contra ${opp}.` },
          { key: "dp_bd3", text: `Se querem jogar no básico, que seja... mas podemos muito mais.` }
        ],
        CHIME_RAGE: [
          { key: "dp_cr1", text: `Que falta de elegância ficar batendo boca antes da entrada em campo.` },
          { key: "dp_cr2", text: `Elevem o nível, por favor. Brigas pequenas não combinam com quem quer o topo.` },
          { key: "dp_cr3", text: `Enquanto discutem detalhes banais, ${opp} espera por nós.` },
          { key: "dp_cr4", text: `Usem o talento dentro do campo em vez de desperdiçar energia aqui.` }
        ],
        CHIME_HYP: [
          { key: "dp_ch1", text: `Com a minha presença no lance, essa jogada fica simplesmente impecável.` },
          { key: "dp_ch2", text: `Interessante... deixe-me polir os detalhes finais disso no treino.` },
          { key: "dp_ch3", text: `Um movimento refinado assim realmente merece destaque no próximo jogo.` },
          { key: "dp_ch4", text: `Se o passe vier na altura exata, a execução será perfeita.` }
        ]
      },

      CHILL_JOKER: {
        GREAT: [
          { key: "cj_g1", text: `Aeee boa professor!! Se a gente ganhar de ${opp} hoje eu pago um lámen pra galera kkk` },
          { key: "cj_g2", text: `Cara, agora sim deu ânimo! Sério, parecia até que ia chover no vestiário antes.` },
          { key: "cj_g3", text: `Boraa! Quem der assistência ganha folga de carregar as bolas amanhã kkk` },
          { key: "cj_g4", text: `Esse técnico manja demais kkk agora ninguém segura a gente!` }
        ],
        GOOD: [
          { key: "cj_ok1", text: `Showw! Bem mais tranquilo agora, vamo que vamo!` },
          { key: "cj_ok2", text: `Boa ${other}, fechou total! Só não esquece de tocar pra mim livre kkk` },
          { key: "cj_ok3", text: `Tranquilaço! Tudo certo pro jogo contra ${opp}.` },
          { key: "cj_ok4", text: `Massa demais! Só manter o passo leve que o gol vem.` }
        ],
        TRADEOFF: [
          { key: "cj_tr1", text: `Eita, vai cansar um pouco mas depois a gente come dobrado pra recuperar kkk` },
          { key: "cj_tr2", text: `Opa, apostinha boa hein! Bora encarar!` },
          { key: "cj_tr3", text: `Beleza kkk só me separa uma garrafinha d'água extra no banco!` }
        ],
        POOR: [
          { key: "cj_bd1", text: `Ué... achei que ia ser mais de boa, deu até um frio na barriga agora.` },
          { key: "cj_bd2", text: `Vish maria, clima azedou legal aqui no zap kkk melhor eu ir encher minha garrafa.` },
          { key: "cj_bd3", text: `Poxa, deu uma brochada de leve mas amanhã a gente corre igual!` }
        ],
        CHIME_RAGE: [
          { key: "cj_cr1", text: `Calma aí gente kkk respira, toma uma água gelada antes de mandar áudio bravo!` },
          { key: "cj_cr2", text: `Poxa, vamos parar de brigar antes que tirem nosso lanche pós-treino!` },
          { key: "cj_cr3", text: `Ôpa ôpa, olha a pressão arterial galera kkk vamos resolver de boa!` },
          { key: "cj_cr4", text: `Gente, eu só queria tomar meu suco em paz e vocês já tão em pé de guerra kkk` }
        ],
        CHIME_HYP: [
          { key: "cj_ch1", text: `Eitaa! Só toma cuidado pra não derrubar eu no meio desse lance kkk` },
          { key: "cj_ch2", text: `Maneiro demais!! Quero ver a cara do time de ${opp} vendo isso.` },
          { key: "cj_ch3", text: `Olocoo!! Se sair isso no jogo eu comemoro até dando cambalhota kkk` },
          { key: "cj_ch4", text: `Rapaz, essa jogada aí parece coisa de final de campeonato!` }
        ]
      },

      STOIC_WALL: {
        GREAT: [
          { key: "sw_g1", text: mv.cat === "DF" || mv.cat === "GK" ? `Podem avançar tranquilos contra ${opp}. ${mCom.charAt(0).toUpperCase() + mCom.slice(1)}, a meta tá fechada hoje.` : `Podem confiar, professor! Eu ajudo na recomposição pra gente pressionar ${opp} com segurança.` },
          { key: "sw_g2", text: tac ? `Excelente apostar em ${tac}, professor! Protege exatamente onde ${opp} costuma forçar.` : `Confiança lá em cima. Se fecharmos os espaços atrás, a bola lá na frente entra.` },
          { key: "sw_g3", text: `Tamo fechado, ${other}. Pode soltar o jogo sem medo de contra-ataque.` },
          { key: "sw_g4", text: `Lá atrás não passa nada hoje, professor. O time todo pode atacar inteiro.` }
        ],
        GOOD: [
          { key: "sw_ok1", text: `Combinado. Vou manter a linha organizada e avisar todo mundo na marcação.` },
          { key: "sw_ok2", text: `Podem deixar a cobertura comigo. Foco total até o fim.` },
          { key: "sw_ok3", text: `Firme e seguro, ${other}. Seguimos firmes contra ${opp}.` }
        ],
        TRADEOFF: [
          { key: "sw_tr1", text: `Vai puxar mais da defesa, mas eu aguento o tranco. Pode mandar.` },
          { key: "sw_tr2", text: `Se alguém cansar no segundo tempo eu fecho o espaço na raça.` },
          { key: "sw_tr3", text: `Mesmo mais exposto atrás, eu garanto a primeira trava na área.` }
        ],
        POOR: [
          { key: "sw_bd1", text: `Deixar a defesa exposta assim contra ${opp} me preocupa bastante, professor.` },
          { key: "sw_bd2", text: `Não concordo com esse caminho, mas não vou abandonar minha área.` },
          { key: "sw_bd3", text: `Vai exigir milagre na cobertura lá atrás se eles contra-atacarem.` }
        ],
        CHIME_RAGE: [
          { key: "sw_cr1", text: `Ei, foco. Lá atrás eu preciso que vocês se falem direito, não que briguem.` },
          { key: "sw_cr2", text: `Respirem os dois. Quando a bola rolar eu quero todo mundo inteiro.` },
          { key: "sw_cr3", text: `União defensiva começa aqui no grupo, não deixem o clima rachar.` },
          { key: "sw_cr4", text: `Já enfrentei jogos duros antes e garanto: time dividido perde sozinho.` }
        ],
        CHIME_HYP: [
          { key: "sw_ch1", text: `Boa iniciativa. Quando recuperar atrás eu já mando a bola direto pra vocês.` },
          { key: "sw_ch2", text: `Firmeza. Se encaixar no treino ninguém para.` },
          { key: "sw_ch3", text: `Lá atrás eu seguro a onda pra vocês testarem isso com calma.` },
          { key: "sw_ch4", text: `Gostei da coragem! Vai pegar ${opp} desprevenido.` }
        ]
      },

      SPEED_SPARK: {
        GREAT: [
          { key: "ss_g1", text: `Vambora!! Se a bola cair no espaço eu disparo antes mesmo da zaga de ${opp} piscar!` },
          { key: "ss_g2", text: mv.cat === "OF" || mv.cat === "SH" ? `Curti demais!! Já tô imaginando a velocidade que a gente vai pegar ${mCom}!` : `Curti demais!! Já tô imaginando a velocidade da nossa saída de bola contra ${opp}!` },
          { key: "ss_g3", text: `Partiu campo agora!! Quero testar esse arranque no treino antes de esfriar!` },
          { key: "ss_g4", text: `Ritmo lá em cima, professor!! Desse jeito ${opp} não vê a placa!` }
        ],
        GOOD: [
          { key: "ss_ok1", text: `Fechado! Se acelerar no contra-ataque a gente pega ${opp} todo aberto.` },
          { key: "ss_ok2", text: `Beleza ${other}, só lança na corrida que eu chego primeiro!` },
          { key: "ss_ok3", text: `Tô pronto já! É só soar o apito que eu decolo!` }
        ],
        TRADEOFF: [
          { key: "ss_tr1", text: `Puxado na correria? Deixa comigo que perna aqui não falta!` },
          { key: "ss_tr2", text: `Pode exigir o ritmo alto, eu aguento ir e voltar o jogo todo.` },
          { key: "ss_tr3", text: `Se cansar no fim a gente decide nos primeiros 20 minutos!` }
        ],
        POOR: [
          { key: "ss_bd1", text: `Poxa, segurar tanto o ritmo assim tira meu melhor ponto em campo.` },
          { key: "ss_bd2", text: `Beleza então... só achei lento demais pra pegar ${opp}.` },
          { key: "ss_bd3", text: `Vou obedecer, mas se precisar de arrancada vai fazer falta.` }
        ],
        CHIME_RAGE: [
          { key: "ss_cr1", text: `Gente, menos briga no chat e mais pique no campo, pfvr!` },
          { key: "ss_cr2", text: `Enquanto vocês digitam textão ${opp} tá treinando lá kkk bora focar!` },
          { key: "ss_cr3", text: `Deixem essa treta pra trás rapidão antes que esfrie nosso ritmo!` },
          { key: "ss_cr4", text: `Vambora resolver correndo no rachão em vez de ficar no clima pesado!` }
        ],
        CHIME_HYP: [
          { key: "ss_ch1", text: `Opa! Se for jogada em velocidade pode me chamar na hora!` },
          { key: "ss_ch2", text: `Se eu puxar o marcador no drible sobra limpo pra vocês!` },
          { key: "ss_ch3", text: `Velocidade pura nisso aí!! Quando lançarem na ponta já tô lá!` },
          { key: "ss_ch4", text: `Só dar o toque na frente que eu acompanho qualquer arrancada!` }
        ]
      },

      HEART_TEAM: {
        GREAT: [
          { key: "ht_g1", text: `Muito bom ouvir isso, professor! Dá uma confiança enorme pra todo mundo.` },
          { key: "ht_g2", text: `Valeu mesmo, galera. Assim a gente joga leve e dando o máximo contra ${opp}!` },
          { key: "ht_g3", text: coopMove ? `A gente conseguiu encaixar ${moveWithArticle(coopMove)}!! Nem acredito, bora mostrar pro estádio inteiro!` : `Bora! Eu ajudo no que precisar pro time funcionar 100%.` },
          { key: "ht_g4", text: `Quando todo mundo se apoia assim, o jogo flui naturalmente!` }
        ],
        GOOD: [
          { key: "ht_ok1", text: `Boa, professor! Tmj time, vamos pra cima de ${opp} unidos.` },
          { key: "ht_ok2", text: `Gostei da ideia, ${other}. Se der tudo certo hoje a gente comemora depois!` },
          { key: "ht_ok3", text: `Show! Todo mundo junto fica bem mais tranquilo.` }
        ],
        TRADEOFF: [
          { key: "ht_tr1", text: `Justo! Cada um faz um esforço a mais e a gente compensa junto em campo.` },
          { key: "ht_tr2", text: `Combinado então. Ninguém vai deixar ninguém na mão hoje.` },
          { key: "ht_tr3", text: `Topado! Se precisar de cobertura eu dou uma força extra.` }
        ],
        POOR: [
          { key: "ht_bd1", text: `Ficou meio estranho esse clima... tomara que dê tudo certo no jogo.` },
          { key: "ht_bd2", text: `Vou fazer minha parte direitinho, mas não fiquei tão seguro não.` },
          { key: "ht_bd3", text: `Vamos manter a calma pessoal, a gente ainda se ajuda dentro de campo.` }
        ],
        CHIME_RAGE: [
          { key: "ht_cr1", text: `Calma galera, a gente se ajuda todo dia no treino, não vale brigar por isso.` },
          { key: "ht_cr2", text: `Bora conversar de boa, faltando pouco pra enfrentar ${opp}.` },
          { key: "ht_cr3", text: `Todo mundo quer o mesmo resultado aqui, só precisamos alinhar o passo.` },
          { key: "ht_cr4", text: `Não deixem um mal-entendido apagar o esforço da semana inteira.` }
        ],
        CHIME_HYP: [
          { key: "ht_ch1", text: `Caramba, que daora! Se eu puder ajudar na tabela só falar!` },
          { key: "ht_ch2", text: `Tô animado pra ver vocês soltando isso no jogo!` },
          { key: "ht_ch3", text: `Que entrosamento bonito tá ficando entre vocês!` },
          { key: "ht_ch4", text: `Tamo torcendo e correndo junto por vocês em campo!` }
        ]
      }
    };

    return banks[voice] || banks.HEART_TEAM;
  }

  function getCategoryCoherentPool(kind, category, voice, quality, ctx = {}) {
    const opp = ctx.oppName || "o adversário";
    const tac = humanizeTacticalChangeForChat(ctx.tacText || "");
    const coop = ctx.coopMove || "";
    const coopCat = ctx.coopCat || "SH";
    const other = ctx.otherName || "pessoal";

    // DILEMA antes da resposta do técnico: nunca comemora decisão antecipada e foca nos dois lados da escolha
    if (kind === "CHIME" && ctx.interactionMode === "DILEMMA") {
      const dilemmaChimes = {
        CAPTAIN_FIRE: [
          { key: "cd_cf1", text: `Os dois caminhos têm valor contra ${opp}, só precisamos decidir juntos e ir com tudo!` },
          { key: "cd_cf2", text: `Não importa o lado escolhido, o grupo inteiro vai abraçar e correr dobrado!` },
          { key: "cd_cf3", text: `Bora ouvir o comando e fechar questão logo antes do treino começar!` }
        ],
        COLD_ACE: [
          { key: "cd_ca1", text: `Os dois pontos fazem sentido. Falta definir qual vale mais contra ${opp}.` },
          { key: "cd_ca2", text: `Sem perder tempo. Decidam logo pra gente treinar.` },
          { key: "cd_ca3", text: `Só não fiquem no meio do caminho.` }
        ],
        TACTICIAN: [
          { key: "cd_tc1", text: `Cada opção mexe num equilíbrio diferente do time contra ${opp}. Depende do risco que queremos correr.` },
          { key: "cd_tc2", text: `Um lado garante segurança, o outro força o erro de ${opp}. Boa dúvida pro vestiário.` },
          { key: "cd_tc3", text: `Olhando pelo mapa do campo, as duas escolhas pedem ajustes distintos no meio.` }
        ],
        HOTHEAD: [
          { key: "cd_hh1", text: `Eu já tenho meu lado preferido nessa história aí, bora bater o martelo logo!` },
          { key: "cd_hh2", text: `Prefiro arriscar pra ganhar de ${opp} do que ficar em cima do muro!` },
          { key: "cd_hh3", text: `Seja o que for, ninguém pode entrar meia-boca depois!` }
        ],
        REBEL_TROLL: [
          { key: "cd_rt1", text: `Clássico dilema do grupo kkk quero só ver que lado vai levar essa.` },
          { key: "cd_rt2", text: `Se ninguém decidir logo a gente tira no par ou ímpar kkk` },
          { key: "cd_rt3", text: `Cada um defendendo o seu lado aí tá melhor que mesa redonda kkk` }
        ],
        DIVINE_PRIDE: [
          { key: "cd_dp1", text: `Duas filosofias bem claras. Resta saber qual combina melhor com a nossa ambição.` },
          { key: "cd_dp2", text: `Qualquer decisão tomada com firmeza nos deixa acima de ${opp}.` },
          { key: "cd_dp3", text: `Escolham a opção que mais valoriza o nosso talento em campo.` }
        ],
        CHILL_JOKER: [
          { key: "cd_cj1", text: `Rapaz, essa dividida aí deixou até o grupo pensativo kkk` },
          { key: "cd_cj2", text: `Pior que faz sentido o que os dois falaram, ${other}!` },
          { key: "cd_cj3", text: `Seja qual for o plano contra ${opp}, eu fecho com a galera!` }
        ],
        STOIC_WALL: [
          { key: "cd_sw1", text: `Só espero que a escolha não deixe nossa linha vulnerável atrás.` },
          { key: "cd_sw2", text: `Precisamos de uma diretriz clara pra todo mundo saber seu papel.` },
          { key: "cd_sw3", text: `Quando definirmos o rumo, eu garanto a cobertura no meu setor.` }
        ],
        SPEED_SPARK: [
          { key: "cd_ss1", text: `Por mim vamos pro caminho que deixar o jogo mais rápido contra ${opp}!` },
          { key: "cd_ss2", text: `Boa discussão! Só definam logo pro treino render.` },
          { key: "cd_ss3", text: `Se abrir espaço pra correr, eu apoio na hora!` }
        ],
        HEART_TEAM: [
          { key: "cd_ht1", text: `Legal ver todo mundo dando opinião sincera pelo bem do time.` },
          { key: "cd_ht2", text: `Independente do que for definido, vamos estar juntos nessa contra ${opp}.` },
          { key: "cd_ht3", text: `Os dois argumentos ajudam o grupo a crescer!` }
        ]
      };
      return dilemmaChimes[voice] || dilemmaChimes.HEART_TEAM;
    }

    // ELOGIO pré-decisão: exalta companheiros e grupo SEM agradecer decisão do técnico antes da hora
    if (kind === "CHIME" && category === "ELOGIO") {
      const chimeElogio = {
        CAPTAIN_FIRE: [
          { key: "ce_cf1", text: `Dá gosto demais jogar num elenco que se apoia assim todo dia!!` },
          { key: "ce_cf2", text: `Com essa irmandade aqui dentro, ${opp} vai ter que suar dobrado!` },
          { key: "ce_cf3", text: `Todo mundo crescendo junto na hora certa do campeonato!` },
          { key: "ce_cf4", text: `Orgulho absurdo de dividir esse vestiário com vocês, ${other}!` }
        ],
        COLD_ACE: [
          { key: "ce_ca1", text: `Reconhecimento merecido. A entrega no treino está aparecendo.` },
          { key: "ce_ca2", text: `Bom momento do grupo. Agora manter esse padrão contra ${opp}.` },
          { key: "ce_ca3", text: `Entrosamento sólido. Faz diferença na hora decisiva.` },
          { key: "ce_ca4", text: `Continuem nesse ritmo sem perder foco.` }
        ],
        TACTICIAN: [
          { key: "ce_tc1", text: `Dá pra ver no campo: quando a sintonia sobe assim, os passes saem de olhos fechados.` },
          { key: "ce_tc2", text: `Cada setor tá entendendo o tempo do outro muito melhor contra ${opp}.` },
          { key: "ce_tc3", text: `Confiança mútua reduz erros de posicionamento pela metade.` },
          { key: "ce_tc4", text: `Esse equilíbrio emocional ajuda demais nas viradas de jogo.` }
        ],
        HOTHEAD: [
          { key: "ce_hh1", text: `É isso aí!! Moral nas alturas pra atropelar ${opp} sem dó!!` },
          { key: "ce_hh2", text: `Quando o grupo fecha desse jeito não tem zaga que aguente nossa pressão!` },
          { key: "ce_hh3", text: `Esse fogo no vestiário dá vontade de entrar em campo agora mesmo!` },
          { key: "ce_hh4", text: `Ninguém tira a confiança desse elenco hoje!!` }
        ],
        REBEL_TROLL: [
          { key: "ce_rt1", text: `Olha os caras se elogiando ao vivo kkk mas pior que tá merecido mesmo!` },
          { key: "ce_rt2", text: `Se continuarem jogando assim vou até ficar sem piada pra fazer no treino kkk` },
          { key: "ce_rt3", text: `Belo momento do time! Quero ver ${opp} segurar a onda agora!` },
          { key: "ce_rt4", text: `Até quem geralmente é calado tá sorrindo hoje kkk sinal bom!` }
        ],
        DIVINE_PRIDE: [
          { key: "ce_dp1", text: `A evolução coletiva deste grupo finalmente acompanha o nosso talento.` },
          { key: "ce_dp2", text: `Um elenco em harmonia assim transforma o jogo contra ${opp} em espetáculo.` },
          { key: "ce_dp3", text: `Justo reconhecer quem eleva o padrão dos treinos todos os dias.` },
          { key: "ce_dp4", text: `É dessa excelência que nascem as grandes campanhas.` }
        ],
        CHILL_JOKER: [
          { key: "ce_cj1", text: `Clima bom demais no grupo kkk dá até prazer acordar cedo pro treino!` },
          { key: "ce_cj2", text: `Aeee galera mandando bem demais! Tô me sentindo em família aqui!` },
          { key: "ce_cj3", text: `Quando o vestiário tá leve assim a bola até procura o gol sozinha kkk` },
          { key: "ce_cj4", text: `Só vitória e sintonia boa antes de pegar ${opp}!` }
        ],
        STOIC_WALL: [
          { key: "ce_sw1", text: `Essa confiança entre os setores deixa todo mundo mais seguro nas divididas.` },
          { key: "ce_sw2", text: `Treino sério e união sincera formam a base de uma equipe difícil de bater.` },
          { key: "ce_sw3", text: `Daqui de trás eu sinto como o time inteiro está correndo mais firme.` },
          { key: "ce_sw4", text: `Justíssimo o reconhecimento, ${other}. Seguimos firmes juntos.` }
        ],
        SPEED_SPARK: [
          { key: "ce_ss1", text: `Com o grupo embalado assim até os piques no fim do treino parecem leves!` },
          { key: "ce_ss2", text: `Essa energia positiva acelera o ritmo de todo mundo contra ${opp}!` },
          { key: "ce_ss3", text: `Daora demais ver a sintonia fluindo em cada tabela!` },
          { key: "ce_ss4", text: `Vamo com essa vibração toda pra cima de ${opp}!` }
        ],
        HEART_TEAM: [
          { key: "ce_ht1", text: `Bonito demais ver o grupo se valorizando assim fora e dentro de campo.` },
          { key: "ce_ht2", text: `Cada treino juntos deixa esse time ainda mais unido, ${other}!` },
          { key: "ce_ht3", text: `Com essa força coletiva, ninguém se sente sozinho contra ${opp}.` },
          { key: "ce_ht4", text: `Dá muito orgulho fazer parte desse elenco!` }
        ]
      };
      return chimeElogio[voice] || chimeElogio.HEART_TEAM;
    }

    // Resenha / vestiário leve: NUNCA mistura tática séria ou contra-ataque fora de contexto
    if (category === "RESENHA") {
      if (kind === "CHIME") {
        const chimeResenha = {
          CAPTAIN_FIRE: [
            { key: "cr_cf1", text: `Haha esse grupo não tem jeito mesmo! Só não vale perder a hora do treino depois.` },
            { key: "cr_cf2", text: `Kkk bom demais ver todo mundo leve antes de encarar ${opp}.` },
            { key: "cr_cf3", text: `Adoro essa energia no grupo! Só guardar fôlego pro aquecimento!` },
            { key: "cr_cf4", text: `Vestiário feliz joga muito melhor, bora manter o pique!` }
          ],
          COLD_ACE: [
            { key: "cr_ca1", text: `Vocês não param um minuto no grupo.` },
            { key: "cr_ca2", text: `Só guardem metade desse gás pro campo.` },
            { key: "cr_ca3", text: `Aproveitem a folga enquanto dá. Amanhã é sério.` },
            { key: "cr_ca4", text: `Foco também no descanso antes de ${opp}.` }
          ],
          TACTICIAN: [
            { key: "cr_tc1", text: `Pelo menos o astral do vestiário tá lá em cima hoje kkk` },
            { key: "cr_tc2", text: `Vocês distraem até a comissão técnica antes de ${opp} haha` },
            { key: "cr_tc3", text: `Um pouco de resenha ajuda a soltar a tensão antes do jogo.` },
            { key: "cr_tc4", text: `Só não virem a noite conversando no grupo hein pessoal haha` }
          ],
          HOTHEAD: [
            { key: "cr_hh1", text: `Quero só ver quem vai aguentar correr amanhã depois dessa resenha kkk` },
            { key: "cr_hh2", text: `Haha deixa o treino começar que eu quero ver a disposição de vocês!` },
            { key: "cr_hh3", text: `Se tiver desafio valendo algo depois do treino eu entro na hora!` },
            { key: "cr_hh4", text: `Resenha tá boa mas amanhã quero esse mesmo fogo contra ${opp}!` }
          ],
          REBEL_TROLL: [
            { key: "cr_rt1", text: `kkkkk alguém salva o print disso aqui pro técnico ver depois` },
            { key: "cr_rt2", text: `Se alguém tropeçar amanhã eu já sei o motivo hein kkk` },
            { key: "cr_rt3", text: `Eu sabia que esse assunto ia render pérola no grupo kkk` },
            { key: "cr_rt4", text: `Nunca decepcionam na bagunça pós-treino kkk` }
          ],
          DIVINE_PRIDE: [
            { key: "cr_dp1", text: `Curioso o senso de humor desse elenco às vésperas do jogo.` },
            { key: "cr_dp2", text: `Ao menos a confiança do vestiário está intacta antes de ${opp}.` },
            { key: "cr_dp3", text: `Vocês transformam qualquer pausa em teatro, impressionante.` },
            { key: "cr_dp4", text: `Contanto que durmam na hora certa, aproveitem o momento.` }
          ],
          CHILL_JOKER: [
            { key: "cr_cj1", text: `Kkkk já cheguei no grupo rindo! Tem mais história boa aí?` },
            { key: "cr_cj2", text: `Olha, eu não julgo não kkk depois do treino eu também capricho no lanche!` },
            { key: "cr_cj3", text: `Resenha de qualidade merece até figurinha nova no grupo kkk` },
            { key: "cr_cj4", text: `Por mim o vestiário ficava nessa vibe até depois da final kkk` }
          ],
          STOIC_WALL: [
            { key: "cr_sw1", text: `Haha só cuidado pra não pesar no aquecimento amanhã cedo.` },
            { key: "cr_sw2", text: `Tudo bem dar uma relaxada, só não deixem cair a concentração depois.` },
            { key: "cr_sw3", text: `Bom ver a turma sorrindo depois de tanta cobrança na semana.` },
            { key: "cr_sw4", text: `Só lembrem da hora de descansar direito pra encarar ${opp}.` }
          ],
          SPEED_SPARK: [
            { key: "cr_ss1", text: `kkkk ainda bem que eu queimo tudo no primeiro pique do treino!` },
            { key: "cr_ss2", text: `Esse chat rende demais todo dia antes dos jogos!` },
            { key: "cr_ss3", text: `Não pisca não que já tem mais piada chegando no grupo kkk` },
            { key: "cr_ss4", text: `Bora aproveitar a leveza pra recarregar a bateria pro próximo jogo!` }
          ],
          HEART_TEAM: [
            { key: "cr_ht1", text: `Haha adoro quando o grupo fica leve assim antes de entrar em campo!` },
            { key: "cr_ht2", text: `Faz bem dar uma risada junto pra quebrar a pressão antes de ${opp}.` },
            { key: "cr_ht3", text: `Esse clima de amizade é o que faz diferença nos momentos difíceis.` },
            { key: "cr_ht4", text: `Só risada boa com esse time kkk` }
          ]
        };
        return chimeResenha[voice] || chimeResenha.HEART_TEAM;
      }

      const wrapResenha = {
        GREAT: {
          CAPTAIN_FIRE: [
            { key: "wr_g_cf1", text: `Haha boa, professor!! Vestiário leve desse jeito joga muito mais solto!` },
            { key: "wr_g_cf2", text: `Aeee! Amanhã contra ${opp} a gente entrega o dobro dentro de campo!` },
            { key: "wr_g_cf3", text: `Esse clima unido dá uma força absurda pro time inteiro!` }
          ],
          COLD_ACE: [
            { key: "wr_g_ca1", text: `Se render em campo amanhã, tá valendo.` },
            { key: "wr_g_ca2", text: `Só não relaxem demais antes de ${opp}.` },
            { key: "wr_g_ca3", text: `Bom astral. Agora foco no próximo compromisso.` }
          ],
          TACTICIAN: [
            { key: "wr_g_tc1", text: `Clima leve assim limpa a cabeça pra tomarmos boas decisões em campo!` },
            { key: "wr_g_tc2", text: `Valeu professor, até o descanso rende mais com o grupo entrosado assim.` },
            { key: "wr_g_tc3", text: `Amanhã ninguém entra tenso demais contra ${opp}!` }
          ],
          HOTHEAD: [
            { key: "wr_g_hh1", text: `Aí sim!! Depois dessa moral, quero ver quem segura a gente!` },
            { key: "wr_g_hh2", text: `Partiu campo amanhã com sangue nos olhos e sorriso no rosto!` },
            { key: "wr_g_hh3", text: `Fechado! Vamos descontar essa pilha toda na bola!` }
          ],
          REBEL_TROLL: [
            { key: "wr_g_rt1", text: `Aí sim professor kkk sabia que ia entrar na resenha!` },
            { key: "wr_g_rt2", text: `Fechado, agora tá devendo uma pizza pra turma se ganharmos hein kkk` },
            { key: "wr_g_rt3", text: `Melhor técnico da liga, zero frescura no vestiário kkk` }
          ],
          DIVINE_PRIDE: [
            { key: "wr_g_dp1", text: `Excelente condução do ambiente, professor. Chegaremos leves e confiantes.` },
            { key: "wr_g_dp2", text: `Quando o espírito está em paz, o futebol flui como arte.` },
            { key: "wr_g_dp3", text: `Amanhã retribuiremos essa confiança em grande estilo.` }
          ],
          CHILL_JOKER: [
            { key: "wr_g_cj1", text: `Aeee!! Melhor técnico possível kkk vou dormir feliz hoje!` },
            { key: "wr_g_cj2", text: `Isso sim levanta a moral do grupo inteiro!!` },
            { key: "wr_g_cj3", text: `Já garanti minha risada do dia, amanhã o pé vai tar leve!` }
          ],
          STOIC_WALL: [
            { key: "wr_g_sw1", text: `Muito bom manter a união leve assim antes de encarar ${opp}.` },
            { key: "wr_g_sw2", text: `Grupo feliz corre pelo companheiro do lado até o fim.` },
            { key: "wr_g_sw3", text: `Boa, professor! Agora descanso caprichado pro elenco.` }
          ],
          SPEED_SPARK: [
            { key: "wr_g_ss1", text: `Vambora!! Astral lá em cima e perna leve pro jogo de amanhã!` },
            { key: "wr_g_ss2", text: `Showww! Clima bom assim dá vontade até de fazer tiro extra no treino!` },
            { key: "wr_g_ss3", text: `Tudo certo aqui no grupo, amanhã é dia de voar!` }
          ],
          DEFAULT: [
            { key: "wr_g_df1", text: `Combinado, professor! O clima no grupo ficou leve demais agora!` },
            { key: "wr_g_df2", text: `Haha fechou! Amanhã contra ${opp} todo mundo entra com o astral lá em cima.` },
            { key: "wr_g_df3", text: `Merecido depois da semana puxada de treinos!` }
          ]
        },
        GOOD: {
          COLD_ACE: [
            { key: "wr_ok_ca1", text: `Justo. Hora de descansar pro jogo.` },
            { key: "wr_ok_ca2", text: `Certo. Foco amanhã.` },
            { key: "wr_ok_ca3", text: `Entendido. Cada um faz a sua parte.` }
          ],
          REBEL_TROLL: [
            { key: "wr_ok_rt1", text: `Beleza professor, tá bom até demais kkk` },
            { key: "wr_ok_rt2", text: `Recado dado hein galera, sem exagero hoje!` },
            { key: "wr_ok_rt3", text: `Justo kkk pelo menos não cortou a resenha inteira.` }
          ],
          CHILL_JOKER: [
            { key: "wr_ok_cj1", text: `Tranquilo! Já tá de bom tamanho pro nosso grupo kkk` },
            { key: "wr_ok_cj2", text: `Fechado chefia! Agora sim partiu descanso.` },
            { key: "wr_ok_cj3", text: `Showw! Já vou até guardar o celular e dormir cedo hoje.` }
          ],
          DEFAULT: [
            { key: "wr_ok_df1", text: `Tudo certo então! Deu pra dar boas risadas e manter a cabeça no jogo.` },
            { key: "wr_ok_df2", text: `Combinado! Amanhã cedo estamos inteiros pro aquecimento.` },
            { key: "wr_ok_df3", text: `Boa, professor! Equilíbrio certinho no vestiário.` },
            { key: "wr_ok_df4", text: `Fechado! Vamo com o espírito leve enfrentar ${opp}.` }
          ]
        },
        TRADEOFF: {
          COLD_ACE: [
            { key: "wr_tr_ca1", text: `Aceito os limites. O jogo contra ${opp} exige cabeça no lugar.` },
            { key: "wr_tr_ca2", text: `Decisão sensata.` }
          ],
          DEFAULT: [
            { key: "wr_tr_df1", text: `Justo, professor! Deu uma segurada boa sem perder o foco antes de ${opp}.` },
            { key: "wr_tr_df2", text: `Anotado! Cada um sabe o limite antes de decisão.` },
            { key: "wr_tr_df3", text: `Combinado, bora fechar a noite tranquilos!` },
            { key: "wr_tr_df4", text: `Beleza, foco na medida certa sem cortar o clima!` }
          ]
        },
        POOR: {
          COLD_ACE: [
            { key: "wr_bd_ca1", text: `Tanto faz. Concentração pra amanhã.` },
            { key: "wr_bd_ca2", text: `Fim de papo.` }
          ],
          CHILL_JOKER: [
            { key: "wr_bd_cj1", text: `Poxa, achei que ia levar mais na esportiva kkk bora dormir logo então.` },
            { key: "wr_bd_cj2", text: `Eita, clima fechou do nada kkk vou até desligar o celular.` },
            { key: "wr_bd_cj3", text: `Beleza né... acabou a diversão de hoje, fui dormir kkk` }
          ],
          REBEL_TROLL: [
            { key: "wr_bd_rt1", text: `Vish, zero humor hoje hein professor kkk fui!` },
            { key: "wr_bd_rt2", text: `Ok ok, clima de quartel ativado.` },
            { key: "wr_bd_rt3", text: `Silêncio no grupo então kkk até amanhã!` }
          ],
          DEFAULT: [
            { key: "wr_bd_df1", text: `Entendido... acabou a resenha por hoje então, galera.` },
            { key: "wr_bd_df2", text: `Ficou meio pesado o papo, mas amanhã a gente responde em campo.` },
            { key: "wr_bd_df3", text: `Certo, técnico. Todo mundo focado amanhã.` },
            { key: "wr_bd_df4", text: `Pessoal deu uma murchada aqui, mas amanhã passa.` }
          ]
        }
      };
      const qKey = quality === "GREAT" || quality === "GOOD" || quality === "TRADEOFF" ? quality : "POOR";
      return wrapResenha[qKey][voice] || wrapResenha[qKey].DEFAULT;
    }

    // Estudo do Rival: chime-ins táticos coerentes para TODAS as 10 vozes
    if (category === "TATICA_RIVAL" && kind === "CHIME") {
      const chimeTat = {
        TACTICIAN: [
          { key: "ct_tc1", text: `Concordo com a leitura. Contra ${opp}, quem dominar o meio controla o placar.` },
          { key: "ct_tc2", text: `Se o ataque deles aperta pelos lados, ajustar o tempo do passe já resolve metade.` },
          { key: "ct_tc3", text: `Reparei que a linha defensiva de ${opp} sobe descoordenada quando viramos a bola rápido.` },
          { key: "ct_tc4", text: `Se fecharmos a saída curta deles pelo centro, o goleiro vai ter que rifar toda hora.` }
        ],
        COLD_ACE: [
          { key: "ct_ca1", text: `Só me digam onde querem que eu ataque contra ${opp}.` },
          { key: "ct_ca2", text: `Se abrir espaço na área deles eu resolvo.` },
          { key: "ct_ca3", text: `Leitura clara. Só executar quando o jogo começar.` },
          { key: "ct_ca4", text: `A zaga de ${opp} vacila se receber pressão contínua.` }
        ],
        CAPTAIN_FIRE: [
          { key: "ct_cf1", text: `Boa visão! Se o time todo se ajudar na volta defensiva, ${opp} não passa!` },
          { key: "ct_cf2", text: `Tamo ligado nesse detalhe! Só dar o sinal que a gente ajusta na hora.` },
          { key: "ct_cf3", text: `É estudando ${opp} assim antes do apito que a gente sai na frente!` },
          { key: "ct_cf4", text: `Se cada um cobrir o setor do parceiro, esse esquema funciona 100%!` }
        ],
        STOIC_WALL: [
          { key: "ct_sw1", text: `Do meu setor também dá pra fechar esse corredor de ${opp}.` },
          { key: "ct_sw2", text: `Se combinarmos a cobertura atrás, ninguém entra livre.` },
          { key: "ct_sw3", text: `A linha de trás já sabe onde apertar contra os pontas de ${opp}.` },
          { key: "ct_sw4", text: `Comunicação constante lá atrás evita surpresa em contra-ataque.` }
        ],
        SPEED_SPARK: [
          { key: "ct_ss1", text: `Se der brecha nas costas da linha de ${opp}, eu chego primeiro nessa bola!` },
          { key: "ct_ss2", text: `Só me acionarem rápido quando roubarmos no meio.` },
          { key: "ct_ss3", text: `Reparei nos laterais de ${opp}: quando sobem, demoram muito pra voltar!` },
          { key: "ct_ss4", text: `Dá pra explorar esse corredor na velocidade sem dar chance de recuperação!` }
        ],
        HOTHEAD: [
          { key: "ct_hh1", text: `Sem mistério: é pressionar a saída de ${opp} até sufocar eles!` },
          { key: "ct_hh2", text: `Não podemos deixar os criadores de ${opp} pensarem com a bola no pé!` },
          { key: "ct_hh3", text: `Se o plano for ir pra cima e abafar na área deles, eu assino embaixo!` },
          { key: "ct_hh4", text: `O ponto fraco deles aparece na hora que a dividida aperta!` }
        ],
        REBEL_TROLL: [
          { key: "ct_rt1", text: `Se ${opp} já tá previsível no vídeo, imagina quando mudarmos o passo no jogo kkk` },
          { key: "ct_rt2", text: `Apanhei uns cacoetes do goleiro de ${opp} também, ele sempre atrasa um segundo pra cair.` },
          { key: "ct_rt3", text: `Boa sacada! Se enganarmos eles no primeiro tempo já desmonta o plano todo.` },
          { key: "ct_rt4", text: `Adoro quando o time descobre onde o rival se aperta sozinho kkk` }
        ],
        DIVINE_PRIDE: [
          { key: "ct_dp1", text: `Observação precisa. Explorando essa brecha, ${opp} não encontrará resposta tática.` },
          { key: "ct_dp2", text: `Conhecendo os padrões de ${opp}, nossa superioridade técnica se impõe naturalmente.` },
          { key: "ct_dp3", text: `Ajuste elegante que coloca o controle da partida nas nossas mãos.` },
          { key: "ct_dp4", text: `Cada fraqueza mapeada aproxima nossa equipe de uma vitória segura.` }
        ],
        CHILL_JOKER: [
          { key: "ct_cj1", text: `Rapaz, olhando desse jeito ${opp} parece até mais fácil de marcar haha` },
          { key: "ct_cj2", text: `Tô anotando tudo aqui mentalmente kkk depois não falem que não prestei atenção!` },
          { key: "ct_cj3", text: `Boa leitura! Assim até quem tá lá trás já sabe onde a bola vai pingar!` },
          { key: "ct_cj4", text: `Gostei do estudo, dá muita calma saber o que ${opp} vai tentar!` }
        ],
        HEART_TEAM: [
          { key: "ct_ht1", text: `Bem observado! Conversando assim todo mundo entra sabendo o que esperar de ${opp}.` },
          { key: "ct_ht2", text: `Cada detalhe desses ajuda o setor vizinho a fechar junto na hora H.` },
          { key: "ct_ht3", text: `Se todo mundo acompanhar essa movimentação, ninguém fica perdido em campo.` },
          { key: "ct_ht4", text: `Ótima troca de ideias antes de entrarmos no aquecimento contra ${opp}.` }
        ]
      };
      return chimeTat[voice] || chimeTat.HEART_TEAM;
    }

    // Wrap-up específico por categoria quando há ajuste tático ou técnica combinada
    if (kind === "WRAP" && coop && (quality === "GREAT" || quality === "GOOD")) {
      const mCoop = moveWithArticle(coop);
      const targetReaction =
        coopCat === "DF" || coopCat === "GK"
          ? `Quero ver o ataque de ${opp} passar por essa barreira!`
          : coopCat === "OF"
          ? `A marcação de ${opp} vai ficar perdida com esse giro!`
          : `O goleiro de ${opp} não segura isso nunca!`;
      const coopLines = {
        CAPTAIN_FIRE: [
          { key: "wc_cf1", text: `${mCoop.charAt(0).toUpperCase() + mCoop.slice(1)} encaixou bonito demais!! Quero soltar logo contra ${opp}!` },
          { key: "wc_cf2", text: `Sintonia absurda!! Quando sair ${mCoop} no jogo o estádio vem abaixo!` }
        ],
        COLD_ACE: [
          { key: "wc_ca1", text: `${mCoop.charAt(0).toUpperCase() + mCoop.slice(1)} ficou limpa. Só chamar na hora certa.` },
          { key: "wc_ca2", text: `Movimento limpo. Vamos usar contra ${opp}.` }
        ],
        TACTICIAN: [
          { key: "wc_tc1", text: `O tempo de bola ${moveWithArticle(coop, "de")} ficou perfeito pra surpreender ${opp}.` },
          { key: "wc_tc2", text: `Essa combinação quebra qualquer linha compacta de ${opp}.` }
        ],
        HOTHEAD: [
          { key: "wc_hh1", text: `${mCoop.charAt(0).toUpperCase() + mCoop.slice(1)} tá braba demais!! ${targetReaction}` },
          { key: "wc_hh2", text: `Agora sim temos uma arma absurda pra cima deles!!` }
        ],
        REBEL_TROLL: [
          { key: "wc_rt1", text: `Imagina a cara do time de ${opp} levando ${mCoop} do nada kkk` },
          { key: "wc_rt2", text: `Pior que ${mCoop} saiu limpa de primeira kkk quero ver segurarem!` }
        ],
        DEFAULT: [
          { key: "wc_df1", text: `Incrível termos fechado ${mCoop}! Vai ser arma pesada contra ${opp}!` },
          { key: "wc_df2", text: `Ficou muito sincronizada ${mCoop}! Orgulho demais dessa dupla!` }
        ]
      };
      return coopLines[voice] || coopLines.DEFAULT;
    }

    if (kind === "WRAP" && tac && (quality === "GREAT" || quality === "GOOD" || quality === "TRADEOFF")) {
      const tacLines = {
        TACTICIAN: [
          { key: "wt_tc1", text: `Anotado, vamos com ${tac}. Isso encaixa certinho pra enfrentar ${opp}.` },
          { key: "wt_tc2", text: `Com ${tac}, nossa saída e recomposição ficam bem mais alinhadas.` }
        ],
        STOIC_WALL: [
          { key: "wt_sw1", text: `Beleza, fechou em ${tac}. Já me preparo com o setor todo.` },
          { key: "wt_sw2", text: `Garanto a cobertura lá atrás dentro desse ajuste de ${tac}.` }
        ],
        COLD_ACE: [
          { key: "wt_ca1", text: `Certo, apostamos em ${tac}. Foco em campo.` },
          { key: "wt_ca2", text: `Ajuste feito em ${tac}. Agora é jogar.` }
        ],
        CAPTAIN_FIRE: [
          { key: "wt_cf1", text: `Fechou em ${tac}!! Agora é executar com garra contra ${opp}!` },
          { key: "wt_cf2", text: `Todo mundo ligado na movimentação de ${tac} pro próximo jogo!` }
        ],
        HOTHEAD: [
          { key: "wt_hh1", text: `Bora pra cima com ${tac}!! Quero ver quem para a gente!` },
          { key: "wt_hh2", text: `Gostei da pegada em ${tac}! É assim que se entra em jogo grande!` }
        ],
        REBEL_TROLL: [
          { key: "wt_rt1", text: `Olha, apostar em ${tac} contra ${opp} pode render demais kkk` },
          { key: "wt_rt2", text: `Se ${tac} surpreender eles logo no começo vai ser lindo kkk` }
        ],
        DIVINE_PRIDE: [
          { key: "wt_dp1", text: `Decisão cirúrgica em ${tac}. ${opp} não terá saída.` },
          { key: "wt_dp2", text: `Com ${tac} bem executado, controlamos o espetáculo.` }
        ],
        CHILL_JOKER: [
          { key: "wt_cj1", text: `Demorou professor, vamos de ${tac} e já era!` },
          { key: "wt_cj2", text: `Anotado sobre ${tac} kkk agora ninguém se perde no campinho!` }
        ],
        SPEED_SPARK: [
          { key: "wt_ss1", text: `Com ${tac} eu já sei exatamente o corredor pra acelerar!` },
          { key: "wt_ss2", text: `Partiu treinar ${tac} na velocidade máxima!` }
        ],
        DEFAULT: [
          { key: "wt_df1", text: `Combinado em ${tac}! Todo mundo na mesma página pro próximo jogo.` },
          { key: "wt_df2", text: `Anotado o plano em ${tac}! Agora é executar bem contra ${opp}.` }
        ]
      };
      return tacLines[voice] || tacLines.DEFAULT;
    }

    return null;
  }

  function buildDynamicGroupChimeIns(participants, coreCount, category, interactionMode, ctx = {}, t = (typeof state !== "undefined" ? state.tournament : null)) {
    const out = [];
    if (!Array.isArray(participants) || participants.length <= coreCount) return out;
    const opp = ctx.oppName || "o próximo time";
    const a0 = participants[0] || { name: "Parceiro" };
    const a1 = participants[1] || a0;
    const threadUsedTexts = new Set(
      (Array.isArray(ctx.existingMessages) ? ctx.existingMessages : [])
        .map((m) => String(m?.text || "").trim().toLowerCase())
        .filter(Boolean)
    );

    for (let idx = coreCount; idx < participants.length; idx++) {
      if (idx === coreCount + 1 && interactionMode !== "AUTO_COMPLETE" && Math.random() > 0.72) continue;
      if (idx >= coreCount + 2 && interactionMode !== "AUTO_COMPLETE") continue;

      const actor = participants[idx];
      if (!actor) continue;
      const persona = resolveInazumaPersona(actor);
      const otherActor = idx % 2 === 0 ? a0 : a1;
      const otherShort = shortFirstName(otherActor);
      const bank = getPersonaReplyBank(persona.voice, {
        actor,
        oppName: opp,
        sigMove: actor.sigMove || actor.shMove || "minha técnica",
        sigMoveCat: actor.sigMoveCat,
        otherName: otherShort
      });

      let chosenPool = getCategoryCoherentPool("CHIME", category, persona.voice, "GOOD", {
        oppName: opp,
        interactionMode,
        otherName: otherShort
      });
      let tone = "normal";
      if (interactionMode === "DILEMMA" && chosenPool) {
        tone = category === "RAIVA" ? "tense" : "normal";
      } else if (category === "ELOGIO") {
        chosenPool = chosenPool || bank.CHIME_HYP;
        tone = "praise";
      } else if (category === "RAIVA") {
        chosenPool = bank.CHIME_RAGE || chosenPool;
        tone = persona.voice === "REBEL_TROLL" ? "normal" : "tense";
      } else if (category === "CRIAR_TECNICA") {
        chosenPool = bank.CHIME_HYP || chosenPool;
        tone = "idea";
      } else if (category === "TATICA_RIVAL") {
        tone = persona.voice === "TACTICIAN" ? "idea" : "normal";
      } else if (category === "RESENHA") {
        tone = persona.voice === "CHILL_JOKER" || persona.voice === "REBEL_TROLL" ? "hype" : "normal";
      }

      const poolArr = chosenPool || bank.CHIME_HYP || bank.GOOD;
      const picked = pickFreshWeighted(t, poolArr, threadUsedTexts);
      const rawLine = picked?.text || `Tamo junto nessa contra ${opp}, ${otherShort}!`;
      const norm = String(rawLine).trim().toLowerCase();
      if (threadUsedTexts.has(norm)) continue;
      threadUsedTexts.add(norm);
      if (typeof mkSpontaneousMsg === "function") {
        out.push(mkSpontaneousMsg(participants, idx, rawLine, tone));
      }
    }
    return out;
  }

  function buildDynamicSilentResolution(participants, coreCount, silentMatured, category, ctx = {}, t = (typeof state !== "undefined" ? state.tournament : null)) {
    if (typeof mkSpontaneousMsg !== "function") return [];
    const opp = ctx.oppName || "o adversário";
    const a0 = participants[0] || { name: "Jogador" };
    const a1 = participants[1] || a0;
    const medIdx = participants.length >= 3 ? 2 : 0;
    const med = participants[medIdx] || a0;
    const fourthIdx = participants.length >= 4 ? 3 : 1;
    const fourth = participants[fourthIdx] || a1;

    const p0 = resolveInazumaPersona(a0).voice;
    const p1 = resolveInazumaPersona(a1).voice;
    const pMed = resolveInazumaPersona(med).voice;
    const p4 = resolveInazumaPersona(fourth).voice;

    const n0 = shortFirstName(a0);
    const n1 = shortFirstName(a1);
    const nMed = shortFirstName(med);

    if (silentMatured) {
      const open0 = p0 === "COLD_ACE"
        ? `O professor só leu. Quer que a gente resolva sozinho.`
        : p0 === "REBEL_TROLL"
        ? `kkkk o técnico meteu só um visualizado e sumiu, brabo.`
        : p0 === "HOTHEAD"
        ? `Ótimo, o técnico nem respondeu... deixou na nossa mão mesmo.`
        : `Parece que o professor visualizou e confiou que a gente se acerta por aqui.`;

      const medPool = {
        CAPTAIN_FIRE: `Então bora resolver logo! ${n0} e ${n1}, a gente precisa de vocês dois voando contra ${opp}!`,
        TACTICIAN: `Ele fez certo em não interferir. ${n0}, ${n1}, olhem pro campo: contra ${opp} vocês se completam se não segurarem a bola demais.`,
        COLD_ACE: `Menos ego, vocês dois. No jogo contra ${opp} a gente depende um do outro.`,
        REBEL_TROLL: `Haha já vi que sobrou pra mim acalmar a creche. Seguinte, ${n0} e ${n1}, resolvam no treino quem passa melhor kkk`,
        CHILL_JOKER: `Poxa, o chefe deixou no vácuo de propósito pra gente fazer as pazes kkk. Bora virar a página gente!`,
        DIVINE_PRIDE: `Um grande time resolve suas diferenças sem precisar de babá. Foco total em superar ${opp}.`
      };
      const medLine = humanizeInaZapText(
        medPool[pMed] || `Bora esfriar a cabeça, ${n0} e ${n1}. O foco agora tem que ser ganhar de ${opp}!`,
        med
      );

      const ack1 = p1 === "COLD_ACE"
        ? `Certo, ${nMed}. Passei do ponto também. Bora treinar, ${n0}.`
        : p1 === "HOTHEAD"
        ? `Tá bom vai... esquentei à toa mesmo, ${n0}. Em campo a gente se entende na bola.`
        : p1 === "DIVINE_PRIDE"
        ? `Admito que exagerei um pouco. Deixemos o orgulho de lado contra ${opp}, ${n0}.`
        : `Tem razão, ${nMed}. Bola pra frente, ${n0}, mal aí qualquer coisa!`;

      const close4 = p4 === "REBEL_TROLL"
        ? `Olha só, quem diria que ia acabar em paz kkk. Agora quero ver gols!`
        : p4 === "CHILL_JOKER"
        ? `Aeeee!! Agora sim deu paz no grupo, bora descansar bem pra amanhã!`
        : p4 === "CAPTAIN_FIRE"
        ? `É disso que eu tô falando!! Assim mesmo que o time fica forte de verdade!`
        : `Resolvido entre nós então! Amanhã contra ${opp} vai dar gosto de jogar.`;

      return [
        mkSpontaneousMsg(participants, 0, open0, "tense"),
        mkSpontaneousMsg(participants, medIdx, medLine, "calm"),
        mkSpontaneousMsg(participants, 1, ack1, "calm", { quote: { speakerName: med.name, text: medLine } }),
        mkSpontaneousMsg(participants, fourthIdx, close4, "hype")
      ];
    }

    // Clima azedou após vácuo
    const bad0 = p0 === "HOTHEAD"
      ? `Sério que o técnico só olhou a mensagem e ignorou?! Assim não dá!`
      : p0 === "REBEL_TROLL"
      ? `Vácuo ao vivo kkkk tá ótimo, cada um por si no vestiário então.`
      : p0 === "COLD_ACE"
      ? `Se ninguém da comissão responde, não espera clima bom depois.`
      : `Pô, leu tudo e não falou nada... fica difícil saber o que fazer assim.`;

    const bad1 = p1 === "COLD_ACE"
      ? `Tanto faz. No campo eu resolvo do meu jeito.`
      : p1 === "HOTHEAD"
      ? `Beleza ${n0}, então nem adianta falar mais nada! Quebra tudo lá em campo e pronto!`
      : `Viu só, ${n0}? Melhor parar por aqui antes que dê briga pior antes de ${opp}.`;

    const badMed = pMed === "TACTICIAN"
      ? `Cuidado com esse clima... se entrarmos divididos assim, ${opp} vai explorar cada erro nosso.`
      : pMed === "CHILL_JOKER"
      ? `Eita que pesou o clima legal hein... alguém muda de assunto pfv kkk`
      : `Ei, baixem a bola vocês dois! Brigar entre nós não ajuda em nada!`;

    const bad4 = p4 === "CAPTAIN_FIRE"
      ? `Poxa galera... assim vai ser duro segurar o vestiário amanhã.`
      : p4 === "COLD_ACE"
      ? `Treino pesado hoje. Fim de papo.`
      : `Tomara que essa treta não atrapalhe na hora que a bola rolar contra ${opp}...`;

    return [
      mkSpontaneousMsg(participants, 0, bad0, "toxic"),
      mkSpontaneousMsg(participants, 1, bad1, "toxic"),
      mkSpontaneousMsg(participants, medIdx, badMed, "tense"),
      mkSpontaneousMsg(participants, fourthIdx, bad4, "tense")
    ];
  }

  function buildDynamicPostDecisionWrapUp(participants, coreCount, quality, category, configChanges = [], ctx = {}, existingCount = 0, t = (typeof state !== "undefined" ? state.tournament : null), learnedCoop = null) {
    if (typeof mkSpontaneousMsg !== "function" || !Array.isArray(participants) || participants.length === 0) return [];
    const out = [];
    const opp = ctx.oppName || "o adversário";
    const tacText = Array.isArray(configChanges) && configChanges.length > 0 ? configChanges[0] : "";
    const coopMove = learnedCoop?.learned ? learnedCoop.move : "";
    const coopCat = learnedCoop?.learned ? (learnedCoop.cat || "SH") : "";
    // Máximo 3 mensagens pós-técnico somando baseReactions + wrap-up dinâmico (coeso e sem encher linguiça)
    const totalWanted = existingCount >= 2 ? existingCount + 1 : 3;
    const needed = Math.max(0, Math.min(2, totalWanted - existingCount));
    if (needed === 0) return out;

    const extraStart = participants.length > coreCount ? coreCount : 0;
    const pickSpeaker = (stepIdx) => {
      if (participants.length <= 2) return stepIdx % participants.length;
      if (stepIdx === 0 && extraStart > 0) return extraStart;
      if (stepIdx === 1) return Math.min(1, participants.length - 1);
      return (stepIdx + 1) % participants.length;
    };

    const qBucket = quality === "GREAT" ? "GREAT" : quality === "GOOD" ? "GOOD" : quality === "TRADEOFF" ? "TRADEOFF" : "POOR";
    const tone = quality === "GREAT" ? "hype" : quality === "GOOD" ? "calm" : quality === "TRADEOFF" ? "normal" : "tense";

    const usedLineTexts = new Set(
      (Array.isArray(ctx.existingMessages) ? ctx.existingMessages : [])
        .map((m) => String(m?.text || "").trim().toLowerCase())
        .filter(Boolean)
    );
    for (let i = 0; i < needed; i++) {
      const spIdx = pickSpeaker(i);
      const actor = participants[spIdx] || participants[0];
      const partner = participants[0] && participants[0].id !== actor.id ? participants[0] : (participants[1] || actor);
      const persona = resolveInazumaPersona(actor);

      // Prioriza fala 100% coerente com o assunto (RESENHA / técnica aprendida / ajuste tático) antes do banco geral da voz
      let catPool = getCategoryCoherentPool("WRAP", category, persona.voice, qBucket, {
        oppName: opp,
        tacText: i === 0 ? tacText : "",
        coopMove: i === 0 || i === needed - 1 ? coopMove : "",
        coopCat
      });

      const bank = getPersonaReplyBank(persona.voice, {
        actor,
        oppName: opp,
        sigMove: actor.sigMove || actor.shMove || "minha técnica",
        sigMoveCat: actor.sigMoveCat,
        otherName: shortFirstName(partner),
        tacText: i === 0 ? tacText : "",
        coopMove: i === 0 ? coopMove : ""
      });

      const pureResenhaBackup = [
        { key: "prb_1", text: `Tudo alinhado por aqui! Agora bora guardar energia pro jogo.` },
        { key: "prb_2", text: `Showww! Esse vestiário fechado vale ouro.` },
        { key: "prb_3", text: `Fechado, galera! Amanhã ninguém segura esse grupo!` }
      ];
      const fallbackPool = bank[qBucket] || bank.GOOD || [];
      let unusedInThread = [];
      if (category === "RESENHA") {
        const strictCat = (catPool || []).filter((item) => item?.text && !usedLineTexts.has(String(item.text).trim().toLowerCase()));
        unusedInThread = strictCat.length > 0
          ? strictCat
          : pureResenhaBackup.filter((item) => !usedLineTexts.has(item.text.trim().toLowerCase()));
      } else {
        const unusedCat = (catPool || []).filter((item) => item?.text && !usedLineTexts.has(String(item.text).trim().toLowerCase()));
        const unusedFallback = fallbackPool.filter((item) => item?.text && !usedLineTexts.has(String(item.text).trim().toLowerCase()));
        unusedInThread = unusedCat.length > 0 ? unusedCat : unusedFallback;
      }
      if (unusedInThread.length === 0) continue;
      const picked = pickFreshWeighted(t, unusedInThread, usedLineTexts);
      const msgText = picked?.text || (category === "RESENHA"
        ? `Tudo certo por aqui então, galera!`
        : `Fechado então, professor! Bora encarar ${opp}, ${shortFirstName(partner)}!`);
      const normTxt = String(msgText).trim().toLowerCase();
      if (usedLineTexts.has(normTxt)) continue;
      usedLineTexts.add(normTxt);
      out.push(mkSpontaneousMsg(participants, spIdx, msgText, tone));

      if (picked?.extra && i === needed - 1 && Math.random() < 0.35 && persona.voice !== "COLD_ACE") {
        const extraNorm = String(picked.extra).trim().toLowerCase();
        if (!usedLineTexts.has(extraNorm)) {
          usedLineTexts.add(extraNorm);
          out.push(mkSpontaneousMsg(participants, spIdx, picked.extra, tone));
        }
      }
    }
    return out;
  }

  function attachDynamicEmojiReactions(messages, participants, category, quality, fromIdx = 0) {
    if (!Array.isArray(messages) || messages.length === 0) return messages;
    const safeStart = Math.max(0, fromIdx || 0);
    const slice = messages.slice(safeStart);
    const playerRows = slice.filter((m) => m && m.speakerRole !== "SYSTEM" && m.speakerRole !== "COACH");
    if (playerRows.length < 2) return messages;

    const alreadyHas = slice.some((m) => Array.isArray(m?.reactions) && m.reactions.length > 0);
    if (alreadyHas) return messages;

    const pickEmojisForMsg = (m) => {
      if (m.tone === "toxic") return Math.random() < 0.5 ? ["👀", "😤"] : ["😤"];
      if (m.tone === "tense") return ["👀"];
      if (m.tone === "idea") return ["⚡", "🔥"];
      if (m.tone === "hype" || m.tone === "praise") {
        return String(m.text || "").includes("kkk") ? ["😂", "🔥"] : ["🔥", "👏"];
      }
      if (String(m.text || "").includes("kkk") || String(m.text || "").includes("lámen")) return ["😂"];
      if (category === "ELOGIO" || quality === "GREAT") return ["👏"];
      return null;
    };

    let reactedCount = 0;
    const maxReact = playerRows.length >= 5 ? 2 : 1;
    // Prioriza mensagens marcantes do meio/fim sem encher todas
    for (let idx = safeStart; idx < messages.length && reactedCount < maxReact; idx++) {
      const m = messages[idx];
      if (!m || m.speakerRole === "SYSTEM" || m.speakerRole === "COACH") continue;
      if (idx === safeStart && Math.random() > 0.35) continue;
      const pool = pickEmojisForMsg(m);
      if (!pool || Math.random() > 0.62) continue;
      const picked = pool[Math.floor(Math.random() * pool.length)];
      const cnt = (participants?.length || 2) >= 4 && Math.random() < 0.4 ? 2 : 1;
      const pills = [{ emoji: picked, count: cnt }];
      if (pool.length > 1 && Math.random() < 0.28) {
        const second = pool.find((x) => x !== picked);
        if (second) pills.push({ emoji: second, count: 1 });
      }
      m.reactions = pills;
      reactedCount++;
    }
    return messages;
  }

  const LEARNABLE_SIGNATURE_MOVES = {
    SH: ["Furacão de Fogo EX", "Tornado Dragão", "Lâmina Celestial", "Estrela Cadente", "Zona Mortal X", "Disparo Meteoro", "Pinguins Imperiais X", "Tiro Sônico"],
    OF: ["Dança do Vento", "Drible Fantasma", "Corte Estelar", "Finta Relâmpago", "Espiral Celeste", "Bola Ilusão EX", "Ziguezague Flamejante"],
    DF: ["A Muralha Suprema", "Torre Inabalável", "Corte Vulcaniano", "Barreira da Montanha", "Giro Defensivo", "Rede de Caça"],
    GK: ["Mão Invencível", "Punho da Justiça G2", "Defesa Cósmica", "Mão Demoníaca", "Mão Fantasma V", "Escudo Celestial"]
  };

  function resolvePlayerLatentKeshin(actor = {}, realPlayer = null, usedKeshinNames = null) {
    if (typeof pickCanonicalKeshinForPlayer === "function") {
      try {
        const picked = pickCanonicalKeshinForPlayer(realPlayer || actor, actor.role || "MF", usedKeshinNames, null);
        if (picked && picked.name) return picked;
      } catch (_e) {}
    }
    const el = String(actor.element || realPlayer?.element || "Vento");
    const byEl = {
      Fogo: { name: "Fênix Carmesim", iconKey: "keshinIcon", move: "Chama Imperial", moveCat: "SH" },
      Vento: { name: "Águia da Tempestade", iconKey: "keshinIcon", move: "Asas do Vendaval", moveCat: "OF" },
      Floresta: { name: "Guardião Esmeralda", iconKey: "keshinIcon", move: "Raiz Protetora", moveCat: "DF" },
      Montanha: { name: "Titã de Basalto", iconKey: "keshinIcon", move: "Impacto Sísmico", moveCat: "GK" }
    };
    const base = byEl[el] || byEl.Vento;
    const uIcon = typeof UI === "object" && UI ? (UI[base.iconKey] || UI.keshinIcon || "") : "";
    return { name: base.name, iconKey: base.iconKey, icon: uIcon, move: base.move, moveCat: base.moveCat };
  }

  function pickFreshLearnableMoveForActor(actor = {}, realPlayer = null) {
    const role = actor.role || "MF";
    let cat = "SH";
    if (role === "GK") cat = "GK";
    else if (role === "DF") cat = "DF";
    else if (role === "MF") cat = actor.hasRealOfMove === false ? "OF" : Math.random() < 0.62 ? "OF" : "SH";
    else cat = "SH";
    const pool = LEARNABLE_SIGNATURE_MOVES[cat] || LEARNABLE_SIGNATURE_MOVES.SH;
    const owned = Array.isArray(realPlayer?.moves?.[cat]) ? realPlayer.moves[cat] : [];
    const fresh = pool.filter((m) => !owned.includes(m));
    const chosen = fresh.length > 0 ? fresh[Math.floor(Math.random() * fresh.length)] : pool[Math.floor(Math.random() * pool.length)];
    return { cat, moveName: chosen };
  }

  function makeProcMsg(participants, idx, text, tone = "normal", opts = {}) {
    if (typeof mkSpontaneousMsg === "function") {
      return mkSpontaneousMsg(participants, idx, text, tone, opts);
    }
    const a = participants[idx] || participants[0] || { name: "Jogador", roleLabel: "Titular", sprite: "" };
    return {
      senderIdx: idx,
      speakerRole: "PLAYER",
      speakerName: a.name,
      speakerSprite: a.sprite || "",
      roleTag: a.roleLabel || "Titular",
      tone,
      text: humanizeInaZapText(text, a),
      quote: opts.quote || null
    };
  }

  function pickVariant(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateProceduralBetaChat(t, actors = [], ctx = {}, forcedKind = null, opts = {}) {
    if (!Array.isArray(actors) || actors.length < 2) return null;
    const opp = ctx.oppName || "o adversário";
    const teamName = ctx.teamName || "nosso time";
    const teamChem = Number(ctx.teamChem) || 45;
    const teamEnergy = Number(ctx.teamEnergy) || 85;
    const stageName = ctx.stageName || "Fase Decisiva";
    const oppGkElem = ctx.oppGkElem || null;
    const squadObj = typeof state !== "undefined" && state?.squad ? state.squad : {};
    const findReal = (actor) => Object.values(squadObj).find((p) => p && p.id === actor?.id) || null;
    const actorCounts = t && typeof t.chatActorCounts === "object" ? t.chatActorCounts : {};
    const lastIds = new Set(Array.isArray(t?.lastChatActorIds) ? t.lastChatActorIds : []);

    const pickFairActor = (pred = null, excludeIds = []) => {
      const ex = new Set((excludeIds || []).filter(Boolean));
      let pool = actors.filter((a) => a && !ex.has(a.id) && (!pred || pred(a)));
      if (pool.length === 0) {
        pool = actors.filter((a) => a && !ex.has(a.id));
      }
      if (pool.length === 0) return actors[0];
      const weights = pool.map((a) => {
        const cnt = Number(actorCounts[a.id]) || 0;
        const recentPenalty = lastIds.has(a.id) ? 0.42 : 1.0;
        return recentPenalty / (1 + cnt * 1.45);
      });
      const total = weights.reduce((s, w) => s + w, 0);
      let r = Math.random() * total;
      for (let i = 0; i < pool.length; i++) {
        r -= weights[i];
        if (r <= 0) return pool[i];
      }
      return pool[pool.length - 1];
    };

    const pickOther = (excludeIds, pred = null) => pickFairActor(pred, excludeIds);

    const shuffleChoices = (arr) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    // Detecta elegibilidade de cenários contextuais ricos
    const normTeam = (s) => normNameKey(s || "");
    const oppKey = normTeam(opp);
    const exClubActor = actors.find((a) => {
      const tn = normTeam(a.teamName);
      return tn && oppKey && (oppKey.includes(tn) || tn.includes(oppKey));
    }) || null;
    let sharedSchoolPair = null;
    if (!exClubActor) {
      const bySchool = new Map();
      actors.forEach((a) => {
        const k = normTeam(a.teamName);
        if (!k) return;
        if (!bySchool.has(k)) bySchool.set(k, []);
        bySchool.get(k).push(a);
      });
      const pairs = [...bySchool.values()].filter((g) => g.length >= 2);
      if (pairs.length > 0) {
        const grp = pairs[Math.floor(Math.random() * pairs.length)];
        sharedSchoolPair = [grp[0], grp[1]];
      }
    }
    const advMap = typeof ELEMENT_ADVANTAGE === "object" && ELEMENT_ADVANTAGE ? ELEMENT_ADVANTAGE : null;
    const elemEdgeActor = oppGkElem && advMap
      ? pickFairActor((a) => a.role !== "GK" && advMap[a.element] === oppGkElem)
      : null;
    const hasElemEdge = Boolean(oppGkElem && advMap && actors.some((a) => a.role !== "GK" && advMap[a.element] === oppGkElem));
    const eligibleKeshin = actors.some((a) => {
      const rp = findReal(a);
      return rp && !rp.keshin && a.role !== "GK";
    });

    const gearHolders = actors.filter((a) => (Array.isArray(a.equipTitles) && a.equipTitles.length > 0) || Boolean(a.equipTitle));
    const lessGearedActor = actors.find((a) => (!a.equipTitles || a.equipTitles.length === 0) && !a.equipTitle) ||
      actors.find((a) => (a.equipTitles?.length || (a.equipTitle ? 1 : 0)) < (gearHolders[0]?.equipTitles?.length || 1));
    const hasGearEnvyPair = Boolean(gearHolders.length >= 1 && lessGearedActor && lessGearedActor.id !== gearHolders[0].id);
    const hasGearComboOrPair =
      gearHolders.length >= 2 ||
      (typeof calcSquadStats === "function" &&
        (calcSquadStats()?.activeBonds || []).some((b) => /Combo|Muralha|Tempestade|Arsenal|Cérebro|Guardião|Vínculo/i.test(String(b.label || ""))));

    const kindsPool = [
      "QUEST_LEARN_MOVE",
      "QUEST_AWAKEN_KESHIN",
      "PROC_FORMATION_DEBATE",
      "PROC_RIVAL_COUNTERPLAN",
      "PROC_MOVE_SPAR",
      "PROC_GK_DF_SYNC",
      "PROC_LOCKER_BANTER",
      "PROC_EX_CLUB_REUNION",
      "PROC_ELEMENTAL_MATCHUP",
      "PROC_CAPTAINCY_PRESSURE",
      "PROC_CHEMISTRY_DUO_LAB",
      "PROC_TOURNAMENT_FEVER",
      "PROC_SET_PIECE_CHOREOGRAPHY",
      "PROC_BENCH_FATIGUE_ROTATION",
      "PROC_RIVAL_TRASH_TALK",
      "PROC_ITEM_ENVY",
      "PROC_ITEM_WISHLIST",
      "PROC_RAIRAIKEN_RAMEN",
      "PROC_GEAR_COMBO_HYPE"
    ];

    let kind = forcedKind;
    if (!kind) {
      const candidates = kindsPool.filter((k) => {
        if (k === "QUEST_AWAKEN_KESHIN" && !eligibleKeshin) return false;
        if (k === "PROC_EX_CLUB_REUNION" && !exClubActor && !sharedSchoolPair) return false;
        if (k === "PROC_ELEMENTAL_MATCHUP" && !hasElemEdge) return false;
        if (k === "PROC_ITEM_ENVY" && !hasGearEnvyPair) return false;
        if (k === "PROC_GEAR_COMBO_HYPE" && !hasGearComboOrPair) return false;
        return true;
      });
      const recentProc = t && Array.isArray(t._usedProcKinds) ? t._usedProcKinds.slice(-6) : [];
      const freshKinds = candidates.filter((k) => !recentProc.includes(k));
      const pickFrom = freshKinds.length > 0 ? freshKinds : candidates;
      kind = pickFrom[Math.floor(Math.random() * pickFrom.length)];
      if (t && typeof t === "object" && kind) {
        if (!Array.isArray(t._usedProcKinds)) t._usedProcKinds = [];
        t._usedProcKinds.push(kind);
        if (t._usedProcKinds.length > 10) t._usedProcKinds = t._usedProcKinds.slice(-10);
      }
    }

    const baseResult = (meta) => {
      const coreIds = new Set(meta.coreActors.map((c) => c.id));
      const remaining = actors.filter((a) => !coreIds.has(a.id));
      remaining.sort((a, b) => {
        const scoreA = (Number(actorCounts[a.id]) || 0) + (lastIds.has(a.id) ? 2 : 0) + Math.random() * 1.6;
        const scoreB = (Number(actorCounts[b.id]) || 0) + (lastIds.has(b.id) ? 2 : 0) + Math.random() * 1.6;
        return scoreA - scoreB;
      });
      const extraActors = remaining.slice(0, 2);
      const participants = [...meta.coreActors, ...extraActors];
      return {
        ...meta,
        participants,
        selectedIds: meta.coreActors.map((a) => a.slotId).filter(Boolean),
        coreCount: meta.coreActors.length,
        interactionMode: meta.interactionMode || "CLASSIC"
      };
    };

    // 1. Pós-jogo: Despertar em campo celebrado no grupo
    if (kind === "POST_MATCH_BREAKTHROUGH") {
      const bt = ctx.breakthrough || ctx.lastMatch?.breakthroughs?.[0];
      if (!bt) return null;
      const hero = actors.find((a) => a.id === bt.playerId) || pickFairActor();
      const cap = pickOther([hero.id], (a) => a.isCaptain || resolveInazumaPersona(a).voice === "CAPTAIN_FIRE");
      const tact = pickOther([hero.id, cap.id], (a) => resolveInazumaPersona(a).voice === "TACTICIAN");
      const core = [hero, cap, tact].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      if (core.length < 2) return null;
      const isKeshin = bt.kind === "AWAKEN_KESHIN";
      const btArt = moveWithArticle(bt.name);
      const msgs = [
        makeProcMsg(core, 0, isKeshin
          ? `Cara, ainda tô sentindo a energia ${moveWithArticle(bt.name, "de")} no corpo!! Quando entrou aquela bola parecia outro nível!`
          : `Galera, viram na hora do jogo?! ${btArt.charAt(0).toUpperCase() + btArt.slice(1)} finalmente saiu limpa quando eu mais precisava!`, "hype"),
        makeProcMsg(core, 1, isKeshin
          ? `Arrepiou o estádio todo, ${shortFirstName(hero)}!! Todo mundo sentiu o peso da tua aura naquele lance!`
          : `Baita evolução, ${shortFirstName(hero)}!! Agora já chega contra ${opp} com arma nova no pé!`, "praise", { quote: { speakerName: core[0].name, text: isKeshin ? "energia" : "saiu" } }),
        ...(core[2] ? [makeProcMsg(core, 2, `Contra ${opp}, se a gente encaixar ${btArt} no segundo tempo vai pegar eles de surpresa total.`, "idea")] : [])
      ];
      const choices = shuffleChoices([
        {
          label: `Construir o plano contra ${opp} em volta da nova força de ${shortFirstName(hero)}!`,
          approachTag: "Valorizar Despertar",
          quality: "GREAT",
          tacticsPatch: hero.role === "DF" || hero.role === "GK" ? { posture: "balanced" } : { aceActorIdx: 0 },
          coachLine: `O mérito é todo do teu treino, ${shortFirstName(hero)}! Contra ${opp} a gente vai explorar ${btArt} no momento decisivo.`,
          reactions: [
            makeProcMsg(core, 0, `Pode mandar a bola pra mim na hora H que eu correspondo!`, "hype"),
            makeProcMsg(core, 1, `Bora!! Grupo inteiro empurrando o ${shortFirstName(hero)} pra cima deles!`, "hype")
          ]
        },
        {
          label: "Manter os pés no chão e dividir o protagonismo com o elenco todo",
          approachTag: "Grupo Unido",
          quality: "GOOD",
          coachLine: `Excelente passo, ${shortFirstName(hero)}, só lembra que a jogada só brilha porque o time cria espaço pra ela.`,
          reactions: [
            makeProcMsg(core, 0, `Concordo total, professor! Sem os passes de vocês eu não chegava lá.`, "calm"),
            makeProcMsg(core, 1, `Espírito certinho de campeão!`, "calm")
          ]
        }
      ]);
      return baseResult({
        id: `proc_bt_${bt.kind.toLowerCase()}`,
        contextTrigger: "POST_MATCH_BREAKTHROUGH",
        category: "ELOGIO",
        categoryLabel: "Superação",
        categoryIcon: "⚡",
        badgeClass: "cat-chem",
        title: `Despertar: ${bt.name}`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 2. Pós-jogo: Virada épica celebrada no grupo
    if (kind === "POST_MATCH_COMEBACK") {
      const lm = ctx.lastMatch || { userScore: 3, oppScore: 2, oppName: opp };
      const scorer = (lm.topScorerId && actors.find((a) => a.id === lm.topScorerId))
        || pickFairActor((a) => a.role === "FW" || a.role === "MF");
      const cap = pickOther([scorer.id], (a) => a.isCaptain || resolveInazumaPersona(a).voice === "CAPTAIN_FIRE");
      const gk = pickOther([scorer.id, cap.id], (a) => a.role === "GK" || resolveInazumaPersona(a).voice === "STOIC_WALL");
      const core = [cap, scorer, gk].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      if (core.length < 2) return null;
      const prevOpp = lm.oppName || opp;
      const placar = `${lm.userScore || 2} x ${lm.oppScore || 1}`;
      const openLine = pickVariant([
        `Gente, até agora não acredito naquela virada de ${placar} em cima de ${prevOpp}!! Ninguém baixou a cabeça quando tava tudo atrás!`,
        `Aquele segundo tempo contra ${prevOpp} pra virar pra ${placar} mostrou do que esse vestiário é feito!!`
      ]);
      const msgs = [
        makeProcMsg(core, 0, openLine, "hype"),
        makeProcMsg(core, 1, `Quando você gritou no intervalo pra acreditar até o fim, virou a chave do time todo! Agora contra ${opp} entramos gigantes.`, "praise", { quote: { speakerName: core[0].name, text: prevOpp } }),
        ...(core[2] ? [makeProcMsg(core, 2, `A entrega lá atrás pra segurar o placar depois da virada também foi insana!`, "hype")] : [])
      ];
      const choices = shuffleChoices([
        {
          label: "Transformar o espírito da virada em combustível para atacar desde o minuto 1!",
          approachTag: "Garra Inazuma",
          quality: "GREAT",
          coachLine: `Virada assim só acontece em time com alma! Contra ${opp} quero essa mesma coragem desde o apito inicial!`,
          customEffects: { affPts: 20, chemDelta: 3, buffType: "MORALE_BOOST", respectDelta: 2 },
          reactions: [
            makeProcMsg(core, 0, `Agora ninguém segura a gente!! Bora com tudo contra ${opp}!`, "hype"),
            makeProcMsg(core, 1, `Com essa confiança no talo vai sair mais gol ainda!`, "hype")
          ]
        },
        {
          label: "Comemorar a raça, mas corrigir os sustos do 1º tempo pra não precisar sofrer de novo",
          approachTag: "Equilíbrio",
          quality: "GOOD",
          tacticsPatch: { posture: "balanced" },
          coachLine: `Bravos demais na reação, agora vamos entrar ligados desde cedo contra ${opp} pra não sair atrás no placar!`,
          customEffects: { affPts: 14, chemDelta: 2, buffType: "RIVAL_READ", respectDelta: 1 },
          reactions: [
            makeProcMsg(core, 0, `Justíssimo, professor! Começar ligado evita susto lá atrás.`, "calm"),
            makeProcMsg(core, 1, `Boa leitura. Virada é linda, mas dominar desde o início é melhor ainda.`, "calm")
          ]
        }
      ]);
      return baseResult({
        id: "proc_post_comeback",
        contextTrigger: "POST_MATCH_COMEBACK",
        category: "ELOGIO",
        categoryLabel: "Virada Épica",
        categoryIcon: "🔥",
        badgeClass: "cat-chem",
        title: `Virada Histórica (${placar})`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 3. Pós-jogo: Goleada / Vitória larga (evitar salto alto antes de enfrentar o próximo rival)
    if (kind === "POST_MATCH_BLOWOUT") {
      const lm = ctx.lastMatch || { userScore: 4, oppScore: 0, oppName: opp };
      const ace = (lm.topScorerId && actors.find((a) => a.id === lm.topScorerId))
        || pickFairActor((a) => a.role === "FW");
      const tact = pickOther([ace.id], (a) => resolveInazumaPersona(a).voice === "TACTICIAN" || a.isCaptain);
      const joker = pickOther([ace.id, tact.id]);
      const core = [ace, tact, joker].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      if (core.length < 2) return null;
      const placar = `${lm.userScore || 4} x ${lm.oppScore || 0}`;
      const prevOpp = lm.oppName || opp;
      const msgs = [
        makeProcMsg(core, 0, `${placar} em cima de ${prevOpp}... ataque encaixou quase tudo que tentou hoje!`, "hype"),
        makeProcMsg(core, 1, `Vitória pesada, mas cuidado com salto alto, ${shortFirstName(ace)}. ${opp} vem estudando nosso último jogo com certeza.`, "idea"),
        ...(core[2] ? [makeProcMsg(core, 2, `A galera já tava querendo folga dupla depois desse placar, né técnico?`, "banter")] : [])
      ];
      const choices = shuffleChoices([
        {
          label: "Manter os pés no chão: proibir relaxamento e já estudar pontos fracos de " + opp,
          approachTag: "Foco Máximo",
          quality: "GREAT",
          coachLine: `Goleada de ${placar} já virou passado! Contra ${opp} o placar começa 0 x 0 e respeito se ganha correndo mais!`,
          customEffects: { chemDelta: 3, affPts: 14, respectDelta: 2, buffType: "RIVAL_READ" },
          reactions: [
            makeProcMsg(core, 1, `Falou tudo! É exatamente essa postura que sustenta sequência de vitórias.`, "calm"),
            makeProcMsg(core, 0, `Certo. Zerar a cabeça e ir pro próximo jogo.`, "calm")
          ]
        },
        {
          label: "Dar um alívio leve na carga pra turma curtir a boa fase e soltar o futebol",
          approachTag: "Moral Solta",
          quality: "GOOD",
          coachLine: `Podem comemorar o ${placar} hoje sim! Time confiante joga leve contra ${opp}, só não desligam na hora H.`,
          customEffects: { energyDelta: 5, affPts: 16, buffType: "LIGHT_LOCKER" },
          reactions: [
            makeProcMsg(core, 0, `Bom equilíbrio. Time solto rende melhor.`, "hype"),
            makeProcMsg(core, 2, `Aeee!! Moral no máximo pro próximo duelo!`, "hype")
          ]
        }
      ]);
      return baseResult({
        id: "proc_post_blowout",
        contextTrigger: "POST_MATCH_BLOWOUT",
        category: "ELOGIO",
        categoryLabel: "Pós-Goleada",
        categoryIcon: "⚽",
        badgeClass: "cat-chem",
        title: `Show de ${placar}!`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 4. Pós-jogo: Jogador fominha / segurou bola ignorando colega livre
    if (kind === "POST_MATCH_BALL_HOG") {
      const inc = ctx.ballHogIncident || ctx.lastMatch?.ballHogIncident;
      if (!inc) return null;
      const hog = actors.find((a) => a.id === inc.hogId) || pickFairActor((a) => a.role === "FW");
      const victim = actors.find((a) => a.id === inc.victimId && a.id !== hog.id) || pickOther([hog.id], (a) => a.role === "FW" || a.role === "MF");
      const med = pickOther([hog.id, victim.id], (a) => a.isCaptain || resolveInazumaPersona(a).voice === "CAPTAIN_FIRE" || resolveInazumaPersona(a).voice === "TACTICIAN");
      const core = [victim, hog, med].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const vPers = resolveInazumaPersona(hog).voice;
      const hogReply = vPers === "COLD_ACE"
        ? `Eu tinha ângulo. Da próxima vez aparece mais limpo na linha de passe.`
        : vPers === "HOTHEAD"
        ? `Na hora do jogo eu fui pra resolver! Não vou ficar esperando se o espaço tá na minha frente!`
        : `Foi mal, no calor do lance achei que dava pra bater dali direto...`;
      const msgs = [
        makeProcMsg(core, 0, `Preciso falar na moral, ${shortFirstName(hog)}: aos ${inc.minute || 30}' eu entrei livre na cara do gol e você segurou a bola!`, "tense"),
        makeProcMsg(core, 1, hogReply, "tense", { quote: { speakerName: core[0].name, text: "segurei a bola" } }),
        ...(core[2] ? [makeProcMsg(core, 2, `Gente, acertem aqui fora antes que vire bola de neve contra ${opp}. Técnico, qual é a regra ali na área?`, "calm")] : [])
      ];
      const choices = shuffleChoices([
        {
          label: `Cobrar jogo coletivo: prioridade é tocar pra quem estiver melhor posicionado!`,
          approachTag: "Jogo Coletivo",
          quality: "GREAT",
          tacticsPatch: { style: "possession" },
          coachLine: `Quem vê o companheiro livre e passa constrói mais gols, ${shortFirstName(hog)}. Contra ${opp} quero posse e tabela na área.`,
          customEffects: { affPts: 22, chemDelta: 3, respectDelta: 2 },
          reactions: [
            makeProcMsg(core, 0, `Valeu, professor! É só confiança que eu meto pra dentro.`, "calm"),
            makeProcMsg(core, 1, vPers === "COLD_ACE" ? `Certo. Se correr no tempo certo, a bola chega.` : `Beleza, vou levantar mais a cabeça na próxima.`, "calm")
          ]
        },
        {
          label: `Liberar autonomia pro finalizador decidir se chuta ou toca na área`,
          approachTag: "Instinto Livre",
          quality: "TRADEOFF",
          tacticsPatch: { style: "free" },
          coachLine: `Dentro da área quem tá com a bola tem frações de segundo pra decidir. Confiar no instinto também faz parte.`,
          customEffects: { affPts: -6, pwrDelta: 8, setArc: "TRETA_ABERTA", respectDelta: -1, note: "Risco de atrito por individualismo" },
          reactions: [
            makeProcMsg(core, 1, `Era isso que eu precisava ouvir. Deixa comigo lá na frente.`, "hype"),
            makeProcMsg(core, 0, `Beleza né... depois não reclama se o ataque morrer sozinho lá na área.`, "toxic")
          ]
        }
      ]);
      return baseResult({
        id: "proc_ball_hog",
        contextTrigger: "POST_MATCH_BALL_HOG",
        category: "RAIVA",
        categoryLabel: "Individualismo",
        categoryIcon: "💢",
        badgeClass: "cat-tension",
        title: `Bola Presa com ${shortFirstName(hog)}`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 5. Plot da Cidade: Treta Aberta pedindo acerto no mapa da cidade
    if (kind === "PLOT_FEUD_ESCALATION") {
      const plot = ctx.plot || (Array.isArray(t?.activeCityPlots) ? t.activeCityPlots.find((pl) => !pl.resolved) : null);
      if (!plot) return null;
      const a0 = actors.find((a) => a.id === plot.aId) || pickFairActor();
      const a1 = actors.find((a) => a.id === plot.bId && a.id !== a0.id) || pickOther([a0.id]);
      const med = pickOther([a0.id, a1.id], (a) => a.isCaptain || resolveInazumaPersona(a).voice === "CHILL_JOKER");
      const core = [a0, a1, med].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const locName = plot.locLabel || "Campinho";
      const msgs = [
        makeProcMsg(core, 0, `Não adianta fingir que tá tudo certo, ${shortFirstName(a1)}. Desde aquele papo eu sinto o clima estranho no treino.`, "tense"),
        makeProcMsg(core, 1, `Por mim a gente resolve no campo mesmo. Tô cansado de indireta antes de pegar ${opp}.`, "tense"),
        ...(core[2] ? [makeProcMsg(core, 2, `Ó, se a galera for junta lá em ${locName} hoje, aposto que vocês se acertam antes do apito!`, "idea")] : [])
      ];
      const choices = shuffleChoices([
        {
          label: `Combinar de resolver a treta direto em ${locName} hoje ainda!`,
          approachTag: "Resolver na Cidade",
          quality: "GOOD",
          coachLine: `Ninguém guarda mágoa pro jogo contra ${opp}. Hoje vamos passar em ${locName} pra fechar esse clima de vez!`,
          customEffects: { affPts: 10, respectDelta: 1 },
          reactions: [
            makeProcMsg(core, 0, `Se passar por lá hoje eu topo conversar olho no olho.`, "calm"),
            makeProcMsg(core, 1, `Fechado então. Nos vemos em ${locName}.`, "calm")
          ]
        },
        {
          label: `Cortar o clima agora mesmo e selar as pazes pelo bem do time`,
          approachTag: "Paz Imediata",
          quality: "GREAT",
          coachLine: `A gente precisa dos dois inteiros contra ${opp}. Deixem a vaidade aqui no chat e apertem a mão no próximo treino!`,
          customEffects: { affPts: 24, chemDelta: 2, setArc: "RECONCILIADOS", respectDelta: 2 },
          reactions: [
            makeProcMsg(core, 0, `Certo, professor. Bola pra frente, ${shortFirstName(a1)}.`, "calm"),
            makeProcMsg(core, 1, `Combinado, ${shortFirstName(a0)}. Tamo fechado contra ${opp}!`, "hype")
          ]
        }
      ]);
      return baseResult({
        id: "proc_plot_feud_esc",
        contextTrigger: "PLOT_FEUD_ESCALATION",
        category: "RAIVA",
        categoryLabel: "Clima & Cidade",
        categoryIcon: "🏙️",
        badgeClass: "cat-tension",
        title: `Trama: ${shortFirstName(a0)} × ${shortFirstName(a1)}`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 6. Desfecho celebrando resolução após ação na cidade
    if (kind === "CITY_PLOT_RESOLVED") {
      const plot = ctx.plot;
      if (!plot) return null;
      const a0 = actors.find((a) => a.id === plot.aId) || pickFairActor();
      const a1 = actors.find((a) => a.id === plot.bId && a.id !== a0.id) || pickOther([a0.id]);
      const cap = pickOther([a0.id, a1.id], (a) => a.isCaptain);
      const core = [a0, a1, cap].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const pr = ctx.plotResolution || null;
      const line0 = pr?.lineA || `Valeu por levar a gente em ${plot.locLabel}, professor! Deu pra zerar aquela treta com o ${shortFirstName(a1)}.`;
      const line1 = pr?.lineB || `Pois é, jogamos limpo e acabou o climão. Agora contra ${opp} pode contar com nossa tabela!`;
      const line2 = pr?.lineCap || `Aeeee!! Agora sim esse vestiário tá com cara de campeão!!`;
      const msgs = [
        makeProcMsg(core, 0, line0, pr?.arcState === "RIVALIDADE_FRIA" ? "tense" : "hype"),
        makeProcMsg(core, 1, line1, "hype"),
        ...(core[2] ? [makeProcMsg(core, 2, line2, "praise")] : [])
      ];
      return baseResult({
        id: "proc_city_resolved",
        contextTrigger: "CITY_PLOT_RESOLVED",
        category: "ELOGIO",
        categoryLabel: pr?.categoryLabel || "Reconciliação",
        categoryIcon: "🤝",
        badgeClass: "cat-chem",
        interactionMode: "AUTO_COMPLETE",
        title: pr?.chosenTitle ? `${plot.locLabel}: ${pr.chosenTitle}` : `Pazes em ${plot.locLabel}`,
        coreActors: core,
        messages: msgs,
        choices: [],
        autoOutcome: {
          kind: "CHEMISTRY_BOND",
          headline: pr?.headline || `✨ ${shortFirstName(a0)} e ${shortFirstName(a1)} selaram as pazes em ${plot.locLabel}!`,
          affPts: pr?.chatAffPts ?? 8,
          chemDelta: pr?.chatChemDelta ?? 1,
          setArc: pr?.arcState || "RECONCILIADOS",
          respectDelta: pr?.chatRespectDelta ?? 2
        }
      });
    }

    // 7. Quest: Jogador tentando aprender uma nova técnica (desperta no jogo!)
    if (kind === "QUEST_LEARN_MOVE") {
      const learner = pickFairActor((a) => a.role !== "GK");
      const partner = pickOther([learner.id], (a) => a.role !== "GK");
      const med = pickOther([learner.id, partner.id], (a) => a.isCaptain || resolveInazumaPersona(a).voice === "TACTICIAN");
      const core = [learner, partner, med].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const realLearner = findReal(learner);
      const mvPick = pickFreshLearnableMoveForActor(learner, realLearner);
      const mvArt = moveWithArticle(mvPick.moveName);
      const mvCom = moveWithArticle(mvPick.moveName, "com");
      const verb = mvPick.cat === "SH"
        ? `soltar um chute absurdo ${mvCom}`
        : mvPick.cat === "OF"
        ? `cortar qualquer marcador ${mvCom}`
        : mvPick.cat === "DF"
        ? `fechar a área inteira ${mvCom}`
        : `defender até pensamento ${mvCom}`;
      const openers = [
        `Professor, tô treinando escondido faz dois dias pra conseguir ${verb}! Só falta confiança pra tentar no jogo!`,
        `Fiquei depois do treino ajustando o tempo de bola pra tentar ${verb} contra ${opp}. Se der brecha em campo eu mando!`
      ];
      const msgs = [
        makeProcMsg(core, 0, pickVariant(openers), "idea"),
        makeProcMsg(core, 1, `Eu vi ${shortFirstName(learner)} ralar nos treinos! Se encaixar ${mvArt} contra ${opp}, vai levantar a arquibancada!`, "hype"),
        ...(core[2] ? [makeProcMsg(core, 2, `Deixa o técnico aprovar o desafio que a gente dá cobertura em campo pra soltar!`, "calm")] : [])
      ];
      const choices = shuffleChoices([
        {
          label: `Liberar ${shortFirstName(learner)} para tentar despertar【${mvPick.moveName}】durante o jogo!`,
          approachTag: "Missão em Campo",
          quality: "GREAT",
          questSpec: {
            kind: "LEARN_MOVE",
            playerId: learner.id,
            playerName: learner.name,
            moveName: mvPick.moveName,
            cat: mvPick.cat,
            boostPower: 8
          },
          coachLine: `Pode ir pra cima sem medo contra ${opp}! Na primeira oportunidade em campo, solta ${mvArt} que o grupo garante!`,
          customEffects: { affPts: 14, xpAmt: 20, buffType: "COOP_SYNC", note: `Missão ativa: ${shortFirstName(learner)} despertará ${mvPick.moveName} em campo` },
          reactions: [
            makeProcMsg(core, 0, `Valeu demais pela confiança! Em campo eu faço ${mvArt} acontecer!`, "hype"),
            makeProcMsg(core, 1, `Bora!! Quando pegar na bola contra ${opp} todo mundo abre espaço pra você!`, "hype")
          ]
        },
        {
          label: `Pedir foco no básico primeiro e guardar a técnica nova pros treinos da cidade`,
          approachTag: "Segurança",
          quality: "GOOD",
          coachLine: `Calma, ${shortFirstName(learner)}. Usa o que você já domina 100% contra ${opp} e lapida a novidade aos poucos.`,
          customEffects: { chemDelta: 2, affPts: 10 },
          reactions: [
            makeProcMsg(core, 0, `Certo, professor... vou seguir aperfeiçoando até sair automática.`, "calm"),
            makeProcMsg(core, 1, `Decisão prudente pra um jogo grande assim.`, "calm")
          ]
        }
      ]);
      return baseResult({
        id: "proc_quest_learn_move",
        category: "CRIAR_TECNICA",
        categoryLabel: "Despertar Técnico",
        categoryIcon: "⚡",
        badgeClass: "cat-tech",
        title: `Meta: ${mvPick.moveName}`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 8. Quest: Jogador sem Keshin sentindo despertar de Espírito Guerreiro!
    if (kind === "QUEST_AWAKEN_KESHIN") {
      const cand = pickFairActor((a) => {
        const rp = findReal(a);
        return rp && !rp.keshin && a.role !== "GK";
      }) || pickFairActor((a) => {
        const rp = findReal(a);
        return rp && !rp.keshin;
      });
      if (!cand || findReal(cand)?.keshin) return generateProceduralBetaChat(t, actors, ctx, "QUEST_LEARN_MOVE", opts);
      const partner = pickOther([cand.id]);
      const cap = pickOther([cand.id, partner.id], (a) => a.isCaptain);
      const core = [cand, partner, cap].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const usedKeshins = new Set(Object.values(squadObj).map((p) => p?.keshin?.name).filter(Boolean));
      const keshin = resolvePlayerLatentKeshin(cand, findReal(cand), usedKeshins);
      const openK = pickVariant([
        `Treinador, estranho falar isso, mas toda vez que divido bola forte sinto uma pressão quente nas costas... acho que o ${keshin.name} tá quase despertando!`,
        `Senti uma aura pesada vibrando no treino de hoje, professor. Parece que o ${keshin.name} quer sair na hora do jogo contra ${opp}!`
      ]);
      const msgs = [
        makeProcMsg(core, 0, openK, "idea"),
        makeProcMsg(core, 1, `Eu também senti a energia subir no último treino de ${shortFirstName(cand)}!`, "hype"),
        ...(core[2] ? [makeProcMsg(core, 2, `Se invocar um Espírito Guerreiro no meio do jogo contra ${opp}, o estádio inteiro vai tremer!`, "hype")] : [])
      ];
      const choices = shuffleChoices([
        {
          label: `Autorizar ${shortFirstName(cand)} a buscar a Incorporação 【${keshin.name}】 na próxima partida!`,
          approachTag: "Despertar Keshin",
          quality: "GREAT",
          questSpec: {
            kind: "AWAKEN_KESHIN",
            playerId: cand.id,
            playerName: cand.name,
            keshin
          },
          coachLine: `Não segura essa energia, ${shortFirstName(cand)}! Quando o jogo contra ${opp} pedir, libera o ${keshin.name} em campo!`,
          customEffects: { affPts: 16, respectDelta: 2, note: `Missão ativa: Incorporação ${keshin.name} em campo!` },
          reactions: [
            makeProcMsg(core, 0, `Contra ${opp} eu vou romper esse limite e trazer o ${keshin.name} pro jogo!`, "hype"),
            makeProcMsg(core, 1, `Ansioso demais pra ver essa aura em campo!!`, "hype")
          ]
        },
        {
          label: `Manter o ritmo estável sem sobrecarregar o físico nesta rodada`,
          approachTag: "Ritmo Seguro",
          quality: "GOOD",
          coachLine: `Vai com calma pra não travar a perna, ${shortFirstName(cand)}. A incorporação vem naturalmente com a sequência do time.`,
          customEffects: { energyDelta: 4, chemDelta: 1 },
          reactions: [
            makeProcMsg(core, 0, `Entendido, professor. Vou guardar fôlego e jogar pro time.`, "calm")
          ]
        }
      ]);
      return baseResult({
        id: "proc_quest_keshin",
        category: "CRIAR_TECNICA",
        categoryLabel: "Incorporação",
        categoryIcon: "🔥",
        badgeClass: "cat-tech",
        title: `Aura de ${shortFirstName(cand)}`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 9. Debate orgânico de Formação (abre botão "Ajustar Formação e Escalação" no chat!)
    if (kind === "PROC_FORMATION_DEBATE") {
      const curForm = typeof state !== "undefined" && state.formation ? state.formation : "4-3-3";
      const allForms = typeof DB === "object" && DB?.formations ? Object.keys(DB.formations) : ["4-3-3", "4-4-2", "3-4-3", "3-5-2"];
      const alts = allForms.filter((f) => f !== curForm);
      const targetForm = alts[Math.floor(Math.random() * alts.length)] || "3-5-2";
      const tact = pickFairActor((a) => resolveInazumaPersona(a).voice === "TACTICIAN" || a.role === "MF");
      const wing = pickOther([tact.id], (a) => a.role === "MF" || a.role === "FW");
      const cap = pickOther([tact.id, wing.id], (a) => a.isCaptain);
      const core = [tact, wing, cap].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const formReason = targetForm === "3-5-2"
        ? `ganhar o meio-campo com cinco meias e não deixar ${opp} respirar na saída`
        : targetForm === "3-4-3"
        ? `pressionar a zaga de ${opp} lá em cima com três atacantes abertos`
        : targetForm === "4-3-3"
        ? `ter equilíbrio atrás e velocidade pelas pontas contra ${opp}`
        : `fechar duas linhas sólidas de quatro e sair no contra-ataque em dupla`;
      const msgs = [
        makeProcMsg(core, 0, `Professor, olhando pro jeito que ${opp} joga, o nosso ${curForm} pode sofrer espaço. Mudar pro ${targetForm} ia ajudar demais pra ${formReason}!`, "idea"),
        makeProcMsg(core, 1, `Concordo! No ${targetForm} cada um sabe certinho onde pisar, só o senhor ajustar as peças no campinho depois.`, "hype")
      ];
      const choices = shuffleChoices([
        {
          label: `Mudar para ${targetForm} agora e abrir a prancheta para reorganizar os titulares!`,
          approachTag: `Formação ${targetForm}`,
          quality: "GREAT",
          tacticsPatch: { formation: targetForm },
          openFormationModal: true,
          coachLine: `Fechado, vamos de ${targetForm} contra ${opp}! Vou já abrir a escalação pra posicionar todo mundo certinho nesse desenho.`,
          reactions: [
            makeProcMsg(core, 0, `Boa!! Com o ${targetForm} encaixado, o meio de ${opp} vai ficar sem saída.`, "hype"),
            makeProcMsg(core, 1, `Tô pronto já! Só encaixar os nomes na formação e partir pro campo.`, "hype")
          ]
        },
        {
          label: `Manter o ${curForm} por entrosamento, mas ajustar a movimentação pelas pontas`,
          approachTag: `Manter ${curForm}`,
          quality: "GOOD",
          tacticsPatch: { lane: "wings" },
          coachLine: `O grupo já conhece o ${curForm} de cor. Vamos manter o desenho e abrir mais pelas pontas pra quebrar a marcação.`,
          reactions: [
            makeProcMsg(core, 0, `Faz sentido também! Entrosamento conta muito em jogo apertado.`, "calm"),
            makeProcMsg(core, 1, `Show, corredor aberto pelas laterais comigo é só festa!`, "calm")
          ]
        }
      ]);
      return baseResult({
        id: "proc_formation_debate",
        category: "TATICA_RIVAL",
        categoryLabel: "Formação Tática",
        categoryIcon: "📐",
        badgeClass: "cat-tac",
        title: `Ajuste para o ${targetForm}`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 10. Resenha / duelo amistoso de técnicas (GK-aware e com artigo correto!)
    if (kind === "PROC_MOVE_SPAR") {
      const a0 = pickFairActor((a) => a.hasRealShMove || a.hasRealOfMove || a.hasRealDfMove || a.hasRealGkMove);
      const isA0Gk = a0.role === "GK";
      const a1 = isA0Gk
        ? pickOther([a0.id], (a) => a.role === "FW" || a.role === "MF")
        : pickOther([a0.id], (a) => a.role !== "GK");
      const a2 = pickOther([a0.id, a1.id], (a) => resolveInazumaPersona(a).voice === "CHILL_JOKER" || resolveInazumaPersona(a).voice === "REBEL_TROLL");
      const core = [a0, a1, a2].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const isGkDuel = a0.role === "GK" || a1.role === "GK";
      let msgs;
      if (isGkDuel) {
        const gkA = a0.role === "GK" ? a0 : a1;
        const fwA = a0.role === "GK" ? a1 : a0;
        const gkMoveArt = moveWithArticle(gkA.gkMove || gkA.sigMove);
        const shMoveArt = moveWithArticle(fwA.shMove || fwA.sigMove);
        const gkLine = `Bora ficar depois do treino batendo falta e chute de fora, ${shortFirstName(fwA)}? Quero testar ${gkMoveArt} contra ${shMoveArt}!`;
        const fwLine = `Fechou, ${shortFirstName(gkA)}. Vamos ver se ${gkMoveArt} segura quando eu caprichar no ângulo.`;
        msgs = [
          makeProcMsg(core, a0.id === gkA.id ? 0 : 1, gkLine, "banter"),
          makeProcMsg(core, a0.id === gkA.id ? 1 : 0, fwLine, "hype")
        ];
      } else {
        const d0 = describeActorMoveAction(a0, { oppName: opp });
        const d1 = describeActorMoveAction(a1, { oppName: opp });
        const sparOpener = pickVariant([
          `Bora apostar no treino de hoje, ${shortFirstName(a1)}? Quero ver se você aguenta o ritmo ${moveWithArticle(d0.move, "de")}!`,
          `Desafio relâmpago depois do aquecimento, ${shortFirstName(a1)}: se você passar ${moveWithArticle(d0.move, "de")}, eu pago o lanche!`,
          `Hoje eu tô afim de testar ${moveWithArticle(d0.move)} em 1x1 contra você, ${shortFirstName(a1)}! Topa ou vai correr?`
        ]);
        msgs = [
          makeProcMsg(core, 0, sparOpener, "banter"),
          makeProcMsg(core, 1, `Fechou! ${d1.breakLine} Aposto o suco de depois do treino!`, "hype")
        ];
      }
      const choices = shuffleChoices([
        {
          label: "Incentivar o desafio saudável e marcar um mini-treino de duelos!",
          approachTag: "Competição Boa",
          quality: "GREAT",
          coachLine: `Gostei de ver essa fome de bola! Podem apostar o desafio no treino, só lembrem de levar essa pegada contra ${opp}.`,
          customEffects: { affPts: 18, xpAmt: 28, buffType: "MORALE_BOOST" },
          reactions: [
            makeProcMsg(core, 0, `Agora ficou oficial hein, ${shortFirstName(a1)}! Quero ver pagar a aposta depois.`, "hype"),
            makeProcMsg(core, 1, `Pode separar a carteira que hoje ninguém me segura no treino!`, "hype")
          ]
        },
        {
          label: "Elogiar o foco, mas pedir cuidado pra ninguém se machucar na dividida",
          approachTag: "Cuidado Físico",
          quality: "GOOD",
          coachLine: `Competitividade lá em cima é ótimo, só dosam a força na dividida pra chegarmos inteiros contra ${opp}.`,
          customEffects: { energyDelta: 3, affPts: 10 },
          reactions: [
            makeProcMsg(core, 0, `Combinado, professor! Vai ser só na técnica limpa.`, "calm")
          ]
        }
      ]);
      return baseResult({
        id: "proc_move_spar",
        category: "RESENHA",
        categoryLabel: isGkDuel ? "Duelo Gol × Ataque" : "Desafio no Treino",
        categoryIcon: "⚡",
        badgeClass: "cat-banter",
        title: `Duelo: ${shortFirstName(a0)} × ${shortFirstName(a1)}`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 11. Sintonia Goleiro & Zaga
    if (kind === "PROC_GK_DF_SYNC") {
      const gk = pickFairActor((a) => a.role === "GK");
      const df = pickOther([gk.id], (a) => a.role === "DF");
      const cap = pickOther([gk.id, df.id], (a) => a.isCaptain);
      const core = [gk, df, cap].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const star = ctx.rivalStar?.name || `o camisa 10 de ${opp}`;
      const gkEm = moveWithArticle(gk.gkMove || gk.sigMove, "em");
      const dfCom = moveWithArticle(df.dfMove || df.sigMove, "com");
      const msgs = [
        makeProcMsg(core, 0, `${shortFirstName(df)}, hoje no coletivo repara no tempo da saída contra ${star}: se fechar o ângulo do chute cruzado eu pego ${gkEm}.`, "idea"),
        makeProcMsg(core, 1, `Fechado demais! Quando eles avançarem pelo meio eu já fecho o chute ${dfCom} pro seu lado.`, "calm")
      ];
      const choices = shuffleChoices([
        {
          label: `Travar marcação especial em cima de ${star} com linha mais compacta!`,
          approachTag: "Fechar a Área",
          quality: "GREAT",
          tacticsPatch: { markRival: true, posture: "defensive" },
          coachLine: `Comunicação perfeita lá atrás! Vamos colar a marcação no ${star} e dar segurança pro ${shortFirstName(gk)} trabalhar tranquilo.`,
          reactions: [
            makeProcMsg(core, 0, `Valeu professor! Linha alinhada desse jeito não passa nada hoje.`, "hype"),
            makeProcMsg(core, 1, `Pode deixar o homem comigo que eu não desgrudo um minuto!`, "hype")
          ]
        },
        {
          label: `Manter marcação equilibrada sem perseguir um único jogador`,
          approachTag: "Por Setor",
          quality: "GOOD",
          tacticsPatch: { posture: "balanced", markRival: "CLEAR" },
          coachLine: `Bom papo lá atrás. Vamos defender por setor pra não abrir buraco pros outros atacantes deles.`,
          reactions: [
            makeProcMsg(core, 0, `Combinado, olho em todos os setores!`, "calm")
          ]
        }
      ]);
      return baseResult({
        id: "proc_gk_df_sync",
        category: "TATICA_RIVAL",
        categoryLabel: "Linha Defensiva",
        categoryIcon: "🛡️",
        badgeClass: "cat-tac",
        title: `Paredão com ${shortFirstName(gk)}`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 12. Plano contra estrela rival
    if (kind === "PROC_RIVAL_COUNTERPLAN") {
      const tact = pickFairActor((a) => resolveInazumaPersona(a).voice === "TACTICIAN" || a.role === "MF");
      const fw = pickOther([tact.id], (a) => a.role === "FW");
      const med = pickOther([tact.id, fw.id]);
      const core = [tact, fw, med].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const star = ctx.rivalStar?.name || `o craque de ${opp}`;
      const msgs = [
        makeProcMsg(core, 0, `Revendo o último jogo de ${opp}, quase toda jogada perigosa passa pelos pés de ${star}. Se cortarmos essa linha de passe, eles travam.`, "idea"),
        makeProcMsg(core, 1, `E quando recuperarmos a bola, dá pra sair rápido nas costas dos laterais deles que sobem muito!`, "hype")
      ];
      const choices = shuffleChoices([
        {
          label: "Pressionar forte na saída e explorar contra-ataques verticais!",
          approachTag: "Pressão & Ataque",
          quality: "GREAT",
          tacticsPatch: { style: "vertical", intensity: "high" },
          coachLine: `Leitura cirúrgica! Vamos apertar a saída de ${opp} e acelerar na vertical assim que roubar a bola.`,
          reactions: [
            makeProcMsg(core, 0, `Excelente! A transição rápida vai desmontar o meio deles.`, "hype"),
            makeProcMsg(core, 1, `Só manda em profundidade que eu disparo na frente!`, "hype")
          ]
        },
        {
          label: "Trocar passes com calma pra cansar a marcação de " + opp,
          approachTag: "Controle de Bola",
          quality: "GOOD",
          tacticsPatch: { style: "possession", intensity: "medium" },
          coachLine: `Sem pressa: vamos girar a bola com paciência e fazer ${opp} correr atrás da gente.`,
          reactions: [
            makeProcMsg(core, 0, `Ótimo controle de risco, professor. A gente manda no ritmo assim.`, "calm")
          ]
        }
      ]);
      return baseResult({
        id: "proc_rival_counter",
        category: "TATICA_RIVAL",
        categoryLabel: "Leitura Rival",
        categoryIcon: "📋",
        badgeClass: "cat-tac",
        title: `Plano vs ${opp}`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 13. NOVO: Reencontro com ex-escola ou velhos companheiros da mesma escola!
    if (kind === "PROC_EX_CLUB_REUNION") {
      if (exClubActor) {
        const buddy = pickOther([exClubActor.id], (a) => a.isCaptain || a.role === "MF");
        const tact = pickOther([exClubActor.id, buddy.id]);
        const core = [exClubActor, buddy, tact].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
        const star = ctx.rivalStar?.name || `os caras de ${opp}`;
        const msgs = [
          makeProcMsg(core, 0, `Jogar contra ${opp} vai ser estranho demais... passei anos treinando lá e conheço cada atalho do jogo de ${star}.`, "idea"),
          makeProcMsg(core, 1, `Sério mesmo?! Então já entrega o mapa das jogadas ensaiadas deles antes do apito!`, "hype"),
          ...(core[2] ? [makeProcMsg(core, 2, `Se você conhece o tempo de reação do goleiro e dos zagueiros deles, vale ouro agora!`, "calm")] : [])
        ];
        const choices = shuffleChoices([
          {
            label: `Usar a leitura de ${shortFirstName(exClubActor)} para montar uma emboscada tática contra ${opp}!`,
            approachTag: "Raio-X do Rival",
            quality: "GREAT",
            tacticsPatch: { aceActorIdx: 0 },
            coachLine: `Agora você defende o ${teamName}, ${shortFirstName(exClubActor)}! Usa tudo que sabe sobre ${opp} pra guiar nosso ataque!`,
            customEffects: { affPts: 18, chemDelta: 2, buffType: "RIVAL_READ", respectDelta: 1 },
            reactions: [
              makeProcMsg(core, 0, `Pode deixar! Eu sei exatamente onde o goleiro deles costuma soltar rebote.`, "hype"),
              makeProcMsg(core, 1, `Informação privilegiada antes da decisão! Agora ${opp} tá em maus lençóis!`, "hype")
            ]
          },
          {
            label: `Agradecer as dicas, mas manter o foco no nosso próprio estilo de jogo`,
            approachTag: "Jogo Limpo",
            quality: "GOOD",
            coachLine: `Sem pressão emocional contra ex-companheiros, ${shortFirstName(exClubActor)}. Confia no que construímos no ${teamName}!`,
            customEffects: { affPts: 14, energyDelta: 3 },
            reactions: [
              makeProcMsg(core, 0, `Valeu, professor. Vai ser bonito mostrar em campo o quanto evoluí aqui.`, "calm")
            ]
          }
        ]);
        return baseResult({
          id: "proc_ex_club_reunion",
          category: "TATICA_RIVAL",
          categoryLabel: "Reencontro",
          categoryIcon: "🏫",
          badgeClass: "cat-tac",
          title: `Ex-Clube: ${shortFirstName(exClubActor)}`,
          coreActors: core,
          messages: msgs,
          choices
        });
      }
      if (sharedSchoolPair) {
        const [s0, s1] = sharedSchoolPair;
        const med = pickOther([s0.id, s1.id]);
        const core = [s0, s1, med].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
        const origTeam = s0.teamName || "nossa antiga escola";
        const msgs = [
          makeProcMsg(core, 0, `Lembra quando a gente treinava aquele passe de primeira lá no ${origTeam}, ${shortFirstName(s1)}? Até hoje o timing bate de olhos fechados.`, "praise"),
          makeProcMsg(core, 1, `Demais! Agora juntando aquilo com o ritmo do ${teamName}, vai dar trabalho dobrado pra ${opp}!`, "hype")
        ];
        const choices = shuffleChoices([
          {
            label: "Liberar os ex-companheiros para liderarem uma jogada combinada no treino!",
            approachTag: "Combo Clássico",
            quality: "GREAT",
            coachLine: `Química que vem de longe não se desperdiça! Quero ver vocês puxando essa memória do ${origTeam} contra ${opp}!`,
            customEffects: { affPts: 20, chemDelta: 2, grantCoopAttempt: true, buffType: "COOP_SYNC" },
            reactions: [
              makeProcMsg(core, 0, `Pode contar com a gente, professor! Tá no sangue já.`, "hype"),
              makeProcMsg(core, 1, `Bora mostrar pra turma inteira como funcionava nossa dupla!`, "hype")
            ]
          },
          {
            label: "Pedir pra espalharem essa sintonia pro resto do elenco no coletivo",
            approachTag: "Integrar Grupo",
            quality: "GOOD",
            coachLine: `Ensinem esse atalho de passe pros outros setores também, assim o ${teamName} inteiro sobe de nível!`,
            customEffects: { affPts: 14, pwrDelta: 6 },
            reactions: [
              makeProcMsg(core, 0, `Boa ideia! Já já todo mundo aqui tá no mesmo ritmo.`, "calm")
            ]
          }
        ]);
        return baseResult({
          id: "proc_ex_school_bond",
          category: "ELOGIO",
          categoryLabel: "Velha Dupla",
          categoryIcon: "🤝",
          badgeClass: "cat-chem",
          title: `Conexão ${origTeam}`,
          coreActors: core,
          messages: msgs,
          choices
        });
      }
    }

    // 14. NOVO: Vantagem Elemental Real contra o Goleiro Rival
    if (kind === "PROC_ELEMENTAL_MATCHUP" && elemEdgeActor && oppGkElem) {
      const a0 = elemEdgeActor;
      const partner = pickOther([a0.id], (a) => a.role === "MF" || a.role === "FW");
      const cap = pickOther([a0.id, partner.id], (a) => a.isCaptain);
      const core = [a0, partner, cap].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const mvArt = moveWithArticle(a0.shMove || a0.sigMove);
      const msgs = [
        makeProcMsg(core, 0, `Repararam no goleiro de ${opp}? Elemento ${oppGkElem}... pra minha afinidade de ${a0.element}, isso é um convite aberto pra testar ${mvArt}!`, "idea"),
        makeProcMsg(core, 1, `Real!! Quando a bola cair na sua área com vantagem de ${a0.element} contra ${oppGkElem}, a chance de furar o bloqueio dispara!`, "hype")
      ];
      const choices = shuffleChoices([
        {
          label: `Centralizar as finalizações em ${shortFirstName(a0)} (${a0.element} vs ${oppGkElem})!`,
          approachTag: "Vantagem Elemental",
          quality: "GREAT",
          tacticsPatch: a0.role !== "GK" ? { aceActorIdx: 0, style: "vertical" } : { style: "vertical" },
          coachLine: `Olho clínico! Contra goleiro ${oppGkElem}, cada bola limpa pro ${shortFirstName(a0)} vale ouro!`,
          customEffects: { affPts: 14, buffType: "BLOOD_FOCUS" },
          reactions: [
            makeProcMsg(core, 0, `Só deixar chegar limpa na entrada da área que ${mvArt} resolve!`, "hype"),
            makeProcMsg(core, 1, `Já sei exatamente pra quem vou enfiar a bola na área!`, "hype")
          ]
        },
        {
          label: "Explorar essa vantagem, mas variar as opções pra não ficar previsível",
          approachTag: "Ataque Variado",
          quality: "GOOD",
          tacticsPatch: { lane: "balanced" },
          coachLine: `Boa arma sim, só não forcem toda bola num lado só senão ${opp} dobra a marcação.`,
          customEffects: { affPts: 10, chemDelta: 2 },
          reactions: [
            makeProcMsg(core, 0, `Verdade, professor. Se marcarem dobrado em mim, sobra pro lado oposto.`, "calm")
          ]
        }
      ]);
      return baseResult({
        id: "proc_elemental_edge",
        category: "TATICA_RIVAL",
        categoryLabel: "Leitura Elemental",
        categoryIcon: "⚡",
        badgeClass: "cat-tac",
        title: `${a0.element} vs Goleiro ${oppGkElem}`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 15. NOVO: Pressão na Braçadeira de Capitão / Liderança
    if (kind === "PROC_CAPTAINCY_PRESSURE") {
      const cap = actors.find((a) => a.isCaptain) || pickFairActor((a) => resolveInazumaPersona(a).voice === "CAPTAIN_FIRE");
      const vice = pickOther([cap.id], (a) => resolveInazumaPersona(a).voice === "TACTICIAN" || resolveInazumaPersona(a).voice === "STOIC_WALL" || a.ovr >= 85);
      const third = pickOther([cap.id, vice.id]);
      const core = [cap, vice, third].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const msgs = [
        makeProcMsg(core, 0, `Vou ser sincero com o grupo: carregar a braçadeira contra ${opp} em ${stageName} pesa bastante... às vezes fico me cobrando se tô cobrando certo.`, "tense"),
        makeProcMsg(core, 1, `Você segura essa bronca todo jogo, ${shortFirstName(cap)}. Mas se precisar dividir a voz dentro de campo, tô aqui do teu lado.`, "calm")
      ];
      const choices = shuffleChoices([
        {
          label: `Reafirmar confiança total em ${shortFirstName(cap)} como nosso capitão!`,
          approachTag: "Banco o Capitão",
          quality: "GREAT",
          coachLine: `A braçadeira é tua porque o elenco confia no teu coração, ${shortFirstName(cap)}! Lidera o ${teamName} sem medo contra ${opp}!`,
          customEffects: { affPts: 20, chemDelta: 2, respectDelta: 3, buffType: "MORALE_BOOST" },
          reactions: [
            makeProcMsg(core, 0, `Obrigado pela confiança, professor!! Não vou deixar esse grupo cair nunca!`, "hype"),
            makeProcMsg(core, 1, `Capitão fechado e todo mundo junto atrás!`, "hype")
          ]
        },
        {
          label: `Dividir a comunicação: ${shortFirstName(cap)} puxa a garra e ${shortFirstName(vice)} organiza os setores`,
          approachTag: "Liderança Dupla",
          quality: "GOOD",
          coachLine: `Capitão não precisa carregar tudo sozinho! ${shortFirstName(cap)} incendeia o time e ${shortFirstName(vice)} orienta a marcação!`,
          customEffects: { affPts: 16, chemDelta: 3 },
          reactions: [
            makeProcMsg(core, 0, `Aliviou muito ouvir isso, ${shortFirstName(vice)}. Vamos dividir o campo!`, "calm"),
            makeProcMsg(core, 1, `Conta comigo pra segurar a organização lá dentro!`, "calm")
          ]
        },
        {
          label: `Passar a braçadeira para ${shortFirstName(vice)} tirar o peso das costas de ${shortFirstName(cap)}`,
          approachTag: "Trocar Capitão",
          quality: "TRADEOFF",
          tacticsPatch: { captainActorIdx: 1 },
          coachLine: `Às vezes ficar livre pra jogar seu melhor futebol ajuda mais o time. Vamos testar ${shortFirstName(vice)} com a faixa contra ${opp}.`,
          customEffects: { respectDelta: -1, pwrDelta: 6, note: "Novo capitão escolhido para aliviar pressão" },
          reactions: [
            makeProcMsg(core, 1, `Assumo essa responsabilidade de frente. Vamos organizar o ${teamName}.`, "normal"),
            makeProcMsg(core, 0, `Se for pro time render mais leve... vou correr o dobro sem a faixa mesmo.`, "tense")
          ]
        }
      ]);
      return baseResult({
        id: "proc_captaincy_pressure",
        category: "ELOGIO",
        categoryLabel: "Liderança",
        categoryIcon: "🏅",
        badgeClass: "cat-chem",
        title: `Peso da Braçadeira`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 16. NOVO: Laboratório de Tabela e Entrosamento (chance real de técnica combinada!)
    if (kind === "PROC_CHEMISTRY_DUO_LAB") {
      const a0 = pickFairActor((a) => a.role === "MF" || a.role === "FW");
      const a1 = pickOther([a0.id], (a) => a.role === "FW" || a.role === "MF");
      const a2 = pickOther([a0.id, a1.id]);
      const core = [a0, a1, a2].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const msgs = [
        makeProcMsg(core, 0, `Ei ${shortFirstName(a1)}, percebi um padrão legal no coletivo: se eu atrair dois zagueiros de ${opp} e soltar de primeira nas costas, você sai cara a cara!`, "idea"),
        makeProcMsg(core, 1, `Se a gente acertar essa tabela em velocidade máxima hoje, dá até pra nascer uma jogada combinada nossa!`, "hype")
      ];
      const choices = shuffleChoices([
        {
          label: "Liberar sessão extra no campo pros dois lapidarem a jogada combinada!",
          approachTag: "Laboratório Co-op",
          quality: "GREAT",
          tacticsPatch: { style: "possession" },
          coachLine: `Adoro iniciativa de campo! Testem essa tabela até sair automática — pode virar nossa arma secreta contra ${opp}!`,
          customEffects: { affPts: 22, xpAmt: 24, grantCoopAttempt: true, buffType: "COOP_SYNC" },
          reactions: [
            makeProcMsg(core, 0, `Bora pro campo agora mesmo, ${shortFirstName(a1)}! Vamos acertar esse último toque!`, "hype"),
            makeProcMsg(core, 1, `Quero ver a zaga de ${opp} entender quando essa bola passar!`, "hype")
          ]
        },
        {
          label: "Trabalhar a troca de passes sem forçar risco de desgaste",
          approachTag: "Ritmo Controlado",
          quality: "GOOD",
          coachLine: `Treinem o timing sem forçar demais as pernas, amanhã o simples bem feito resolve!`,
          customEffects: { affPts: 14, energyDelta: 3 },
          reactions: [
            makeProcMsg(core, 0, `Certo, professor! Foco no toque limpo.`, "calm")
          ]
        }
      ]);
      return baseResult({
        id: "proc_chem_duo_lab",
        category: "CRIAR_TECNICA",
        categoryLabel: "Sintonia de Ataque",
        categoryIcon: "⚡",
        badgeClass: "cat-tech",
        title: `Tabela: ${shortFirstName(a0)} & ${shortFirstName(a1)}`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 17. NOVO: Clima de Mata-Mata / Fase do Torneio
    if (kind === "PROC_TOURNAMENT_FEVER") {
      const a0 = pickFairActor((a) => a.isCaptain || resolveInazumaPersona(a).voice === "HOTHEAD" || resolveInazumaPersona(a).voice === "CAPTAIN_FIRE");
      const a1 = pickOther([a0.id], (a) => resolveInazumaPersona(a).voice === "TACTICIAN" || resolveInazumaPersona(a).voice === "STOIC_WALL");
      const a2 = pickOther([a0.id, a1.id]);
      const core = [a0, a1, a2].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const isFinalish = /final|semi/i.test(stageName);
      const msgs = [
        makeProcMsg(core, 0, isFinalish
          ? `Chegamos em ${stageName}!! Um erro contra ${opp} agora e acabou... dá até frio na barriga só de olhar a chave!`
          : `Clima de ${stageName} bateu pesado hoje no ônibus! Todo mundo sabe que contra ${opp} é vencer ou ir pra casa.`, "tense"),
        makeProcMsg(core, 1, `O segredo em ${stageName} é não deixar a ansiedade apressar o passe nos primeiros dez minutos.`, "calm")
      ];
      const choices = shuffleChoices([
        {
          label: `Entrar em ${stageName} com postura ofensiva total para sufocar ${opp} logo no início!`,
          approachTag: "Fogo no Mata-Mata",
          quality: "TRADEOFF",
          tacticsPatch: { posture: "offensive", intensity: "high" },
          coachLine: `Quem quer taça em ${stageName} não espera o adversário gostar do jogo! Vamos sufocar ${opp} desde o primeiro segundo!`,
          customEffects: { affPts: 12, pwrDelta: 8, energyDelta: -4, buffType: "BLOOD_FOCUS", note: "Pressão inicial máxima no mata-mata" },
          reactions: [
            makeProcMsg(core, 0, `Agora sim!! Vambora atropelar desde o apito!`, "hype"),
            makeProcMsg(core, 1, `Cuidado só com a volta atrás se não sair gol cedo.`, "tense")
          ]
        },
        {
          label: "Manter postura equilibrada e controlar os nervos com cabeça fria!",
          approachTag: "Controle Emocional",
          quality: "GREAT",
          tacticsPatch: { posture: "balanced", intensity: "medium" },
          coachLine: `Pressão de ${stageName} se vence com inteligência. Respirem fundo e joguem o futebol que trouxe o ${teamName} até aqui!`,
          customEffects: { affPts: 16, chemDelta: 3, respectDelta: 2, buffType: "RIVAL_READ" },
          reactions: [
            makeProcMsg(core, 1, `Leitura madura de treinador campeão!`, "calm"),
            makeProcMsg(core, 0, `Respirando fundo... vamo com calma mas sem tirar o pé!`, "calm")
          ]
        }
      ]);
      return baseResult({
        id: "proc_tournament_fever",
        category: "TATICA_RIVAL",
        categoryLabel: stageName,
        categoryIcon: "🏆",
        badgeClass: "cat-tac",
        title: `Clima de ${stageName}`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 18. NOVO: Jogada Ensaiada de Escanteio / Bola Parada
    if (kind === "PROC_SET_PIECE_CHOREOGRAPHY") {
      const df = pickFairActor((a) => a.role === "DF");
      const mf = pickOther([df.id], (a) => a.role === "MF");
      const fw = pickOther([df.id, mf.id], (a) => a.role === "FW");
      const core = [mf, df, fw].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const msgs = [
        makeProcMsg(core, 0, `Tava desenhando aqui: contra ${opp}, se eu bater a falta ou escanteio fechado no primeiro pau, ${shortFirstName(df)} desvia e ${shortFirstName(fw)} fecha livre atrás!`, "idea"),
        makeProcMsg(core, 1, `Pior que na hora de bola parada eles costumam olhar só pro centroavante! Eu entro fácil de surpresa pelo alto.`, "hype")
      ];
      const choices = shuffleChoices([
        {
          label: "Treinar o cruzamento pelas pontas e ensaiar o desvio no primeiro pau!",
          approachTag: "Bola Parada Ensaiada",
          quality: "GREAT",
          tacticsPatch: { lane: "wings" },
          coachLine: `Jogo duro muitas vezes se decide numa bola parada! Caprichem nesse ensaio de escanteio pra castigar ${opp}!`,
          customEffects: { affPts: 16, pwrDelta: 7, buffType: "BLOOD_FOCUS" },
          reactions: [
            makeProcMsg(core, 0, `Já tô separando as bolas no canto do campo pra gente repetir dez vezes!`, "hype"),
            makeProcMsg(core, 1, `Na primeira que pingar lá dentro eu subo no terceiro andar!`, "hype")
          ]
        },
        {
          label: "Variar com cobrança curta pra segurar posse e não expor contra-ataque",
          approachTag: "Cobrança Curta",
          quality: "GOOD",
          tacticsPatch: { style: "possession" },
          coachLine: `Escanteio curto mantém a posse e evita contra-ataque mortal se ${opp} afastar!`,
          customEffects: { affPts: 12, chemDelta: 2 },
          reactions: [
            makeProcMsg(core, 0, `Seguro demais, dá pra confundir a marcação deles assim também!`, "calm")
          ]
        }
      ]);
      return baseResult({
        id: "proc_set_piece",
        category: "TATICA_RIVAL",
        categoryLabel: "Bola Parada",
        categoryIcon: "🚩",
        badgeClass: "cat-tac",
        title: `Ensaio de Bola Parada`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 19. NOVO: Gestão de Fôlego e Rotação de Ritmo
    if (kind === "PROC_BENCH_FATIGUE_ROTATION") {
      const spk = pickFairActor((a) => resolveInazumaPersona(a).voice === "SPEED_SPARK" || a.role === "MF");
      const wall = pickOther([spk.id], (a) => resolveInazumaPersona(a).voice === "STOIC_WALL" || a.role === "DF");
      const med = pickOther([spk.id, wall.id]);
      const core = [spk, wall, med].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const lowEnergy = teamEnergy < 70;
      const msgs = [
        makeProcMsg(core, 0, lowEnergy
          ? `Vou mandar a real: com o elenco em ${teamEnergy}% de energia, sair correndo feito louco contra ${opp} pode quebrar a perna aos 60'!`
          : `Mesmo com a perna boa agora (${teamEnergy}%), ${opp} costuma acelerar no segundo tempo. A gente aperta tudo no início ou dosa?`, "tense"),
        makeProcMsg(core, 1, `Se cansarmos cedo demais, a recomposição atrás abre buraco fácil. O ritmo do técnico vai fazer toda diferença.`, "calm")
      ];
      const choices = shuffleChoices([
        {
          label: "Dosar o esforço em ritmo cadenciado e guardar fôlego para decidir no final!",
          approachTag: "Poupar Fôlego",
          quality: lowEnergy ? "GREAT" : "GOOD",
          tacticsPatch: { intensity: "low" },
          coachLine: `Inteligência física ganha campeonato! Cadência controlada na bola e pulmão sobrando quando ${opp} cansar!`,
          customEffects: { energyDelta: 6, chemDelta: 2, affPts: 12 },
          reactions: [
            makeProcMsg(core, 0, `Respiro aliviado aqui! No finalzinho a gente ainda vai ter arranque sobrando.`, "calm"),
            makeProcMsg(core, 1, `Linha descansada fecha qualquer espaço atrás.`, "calm")
          ]
        },
        {
          label: "Botar intensidade máxima desde o início mesmo gastando mais energia!",
          approachTag: "Blitz Física",
          quality: "TRADEOFF",
          tacticsPatch: { intensity: "high" },
          coachLine: `Não vim segurar empate! Quero intensidade alta em cima de ${opp} até matar o jogo!`,
          customEffects: { pwrDelta: 8, energyDelta: -4, buffType: "BLOOD_FOCUS", note: "Esforço alto aumenta desgaste físico" },
          reactions: [
            makeProcMsg(core, 0, `Beleza! Se é pra correr no limite, eu topo o desafio!`, "hype"),
            makeProcMsg(core, 1, `Vou hidratar dobrado hoje pra aguentar o segundo tempo.`, "tense")
          ]
        }
      ]);
      return baseResult({
        id: "proc_fatigue_rotation",
        category: "TATICA_RIVAL",
        categoryLabel: "Ritmo Físico",
        categoryIcon: "🔋",
        badgeClass: "cat-tac",
        title: `Ritmo vs ${opp}`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 20. NOVO: Provocação do Craque Rival antes da partida
    if (kind === "PROC_RIVAL_TRASH_TALK") {
      const hot = pickFairActor((a) => resolveInazumaPersona(a).voice === "HOTHEAD" || resolveInazumaPersona(a).voice === "REBEL_TROLL" || a.role === "FW");
      const tact = pickOther([hot.id], (a) => resolveInazumaPersona(a).voice === "TACTICIAN" || resolveInazumaPersona(a).voice === "COLD_ACE");
      const cap = pickOther([hot.id, tact.id], (a) => a.isCaptain);
      const core = [hot, tact, cap].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const star = ctx.rivalStar?.name || `o craque de ${opp}`;
      const msgs = [
        makeProcMsg(core, 0, `Viram a entrevista do ${star} hoje?! Falou que o ${teamName} só chegou até aqui na sorte e que passa fácil pela gente!!`, "tense"),
        makeProcMsg(core, 1, `Ele falou isso justamente pra fazer a gente perder a cabeça e correr errado amanhã. Não caiam na pilha fácil.`, "calm")
      ];
      const choices = shuffleChoices([
        {
          label: "Responder em campo: transformar a raiva em pressão agressiva e sede de vitória!",
          approachTag: "Resposta em Campo",
          quality: "GREAT",
          tacticsPatch: { intensity: "high", posture: "offensive" },
          coachLine: `Não respondam no microfone — deixem o placar responder no campo contra ${star} e ${opp}!`,
          customEffects: { affPts: 16, buffType: "BLOOD_FOCUS", respectDelta: 2 },
          reactions: [
            makeProcMsg(core, 0, `Agora sim!! Quando soar o apito ele vai engolir cada palavra!`, "hype"),
            makeProcMsg(core, 1, `Raiva canalizada no jogo certo faz estrago.`, "hype")
          ]
        },
        {
          label: "Ignorar totalmente o barulho externo e travar a mente no nosso plano tático!",
          approachTag: "Mente Blindada",
          quality: "GOOD",
          tacticsPatch: { style: "possession" },
          coachLine: `Falatório de fora não faz gol! Cabeça fria, marcação inteligente e futebol limpo contra ${opp}.`,
          customEffects: { chemDelta: 3, affPts: 12, buffType: "RIVAL_READ" },
          reactions: [
            makeProcMsg(core, 1, `Exatamente. Controle frio desmonta qualquer provocação.`, "calm"),
            makeProcMsg(core, 0, `Beleza... vou guardar minha resposta só pro placar final.`, "calm")
          ]
        }
      ]);
      return baseResult({
        id: "proc_rival_trash_talk",
        category: "RAIVA",
        categoryLabel: "Provocação Rival",
        categoryIcon: "🔥",
        badgeClass: "cat-tension",
        title: `Recado de ${star}`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 20b. Intriga / Comparação de Equipamentos na Cidade
    if (kind === "PROC_ITEM_ENVY") {
      const envied =
        actors.find((a) => (Array.isArray(a.equipTitles) && a.equipTitles.length > 0) || Boolean(a.equipTitle)) ||
        pickFairActor();
      const envious =
        pickOther([envied.id], (a) => (!a.equipTitles || a.equipTitles.length === 0) && !a.equipTitle) ||
        pickOther([envied.id]);
      const peacemaker = pickOther([envied.id, envious.id], (a) => resolveInazumaPersona(a).voice !== "COLD_ACE");
      const core = [envious, envied, peacemaker].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      if (core.length < 2) return null;
      const itemTitle = (envied.equipTitles && envied.equipTitles[0]) || envied.equipTitle || "as chuteiras especiais da loja";
      const msgs = [
        makeProcMsg(core, 0, `Nada contra você, ${shortFirstName(envied)}, mas todo mundo viu ${itemTitle} indo direto pro teu armário enquanto eu sigo com o básico.`, "tense"),
        makeProcMsg(core, 1, `Eu nem pedi tratamento diferente, ${shortFirstName(envious)}. Só vesti o que o técnico separou pro jogo contra ${opp}.`, "calm"),
        ...(core[2] ? [makeProcMsg(core, 2, `Gente, comparar equipamento agora só divide o grupo. Professor, resolve isso antes do treino.`, "tense", { quote: { speakerName: core[0].name, text: itemTitle } })] : [])
      ];
      const choices = shuffleChoices([
        {
          label: `Garantir que a próxima parada nas Lojas de Inazuma prioriza ${shortFirstName(envious)}!`,
          approachTag: "Equilibrar Lojas / +Moral",
          quality: "GREAT",
          coachLine: `Anotado, ${shortFirstName(envious)}. Na próxima ida às Lojas de Inazuma você passa na frente pra equipar o time de igual pra igual.`,
          customEffects: { affPts: 14, respectDelta: 3, indivRespectDelta: 4, xpAmt: 25, buffType: "MORALE_BOOST" },
          reactions: [
            makeProcMsg(core, 0, `Assim sim, professor! Agora entro bem mais leve pra buscar a titularidade contra ${opp}.`, "hype"),
            makeProcMsg(core, 1, `Fechado demais, quanto mais gente equipada aqui, mais forte o time fica.`, "praise")
          ]
        },
        {
          label: `Explicar que ${itemTitle} soma combo pro time inteiro e cobrar resposta em campo.`,
          approachTag: "+Química / +Poder",
          quality: "GOOD",
          coachLine: `Cada item equipado fortalece o conjunto todo, inclusive quem dá cobertura no setor. Quero todo mundo focado no jogo!`,
          customEffects: { chemDelta: 2, pwrDelta: 8, affPts: 10, respectDelta: 1 },
          reactions: [
            makeProcMsg(core, 1, `Verdade, o combo da loja puxa o grupo inteiro junto.`, "calm"),
            makeProcMsg(core, 0, `Entendido, professor. Vou fazer por merecer o próximo equipamento em campo.`, "calm")
          ]
        },
        {
          label: `Dizer que quem reclama pouco antes do jogo ainda precisa provar mais em campo.`,
          approachTag: "-Clima / Abre Trama nas Lojas",
          quality: "POOR",
          coachLine: `Equipamento se conquista nos 90 minutos contra ${opp}, não cobrando no grupo.`,
          customEffects: {
            affPts: -6,
            respectDelta: -3,
            indivRespectDelta: -5,
            indivRespectIdxs: [0],
            setArc: "TRETA_ABERTA",
            cityPlotLoc: "town",
            note: `Atrito por ${itemTitle} (resolver nas Lojas de Inazuma)`
          },
          reactions: [
            makeProcMsg(core, 0, `Beleza... então vou ficar quieto no meu canto e resolver tudo sozinho.`, "toxic"),
            ...(core[2] ? [makeProcMsg(core, 2, `Pesou o clima... isso ainda vai dar conversa lá nas Lojas de Inazuma.`, "tense")] : [])
          ]
        }
      ]);
      return baseResult({
        id: "proc_item_envy",
        category: "RAIVA",
        categoryLabel: "Clima & Itens",
        categoryIcon: "🛍️",
        badgeClass: "cat-tension",
        title: `Disputa por ${itemTitle}`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 20c. Plano de Combo / Pedido de Equipamento na Loja
    if (kind === "PROC_ITEM_WISHLIST") {
      const ownedSet = new Set(actors.flatMap((a) => (Array.isArray(a.equipIds) ? a.equipIds : [])));
      let wish = null;
      if (ownedSet.has("glove_legend") && !ownedSet.has("shoes_legend")) {
        wish = { itemTitle: "Chuteiras Lendárias", targetRoles: ["FW", "MF"], combo: "Combo Lendário" };
      } else if (ownedSet.has("shoes_legend") && !ownedSet.has("glove_legend")) {
        wish = { itemTitle: "Luvas Lendárias", targetRoles: ["GK"], combo: "Combo Lendário" };
      } else if (ownedSet.has("tactical_visor") && !ownedSet.has("captain_armband")) {
        wish = { itemTitle: "Braçadeira Dourada do Capitão", targetRoles: ["MF", "DF"], combo: "Cérebro do Time" };
      } else if (ownedSet.has("captain_armband") && !ownedSet.has("tactical_visor")) {
        wish = { itemTitle: "Óculos Táticos do Estrategista", targetRoles: ["MF", "DF"], combo: "Cérebro do Time" };
      } else if (ownedSet.has("raimon_keeper_gloves") && !ownedSet.has("spike_block")) {
        wish = { itemTitle: "Travas de Bloqueio", targetRoles: ["DF"], combo: "Guardião da Torre" };
      } else if (ownedSet.has("misanga_friend") && !ownedSet.has("lucky_amulet")) {
        wish = { itemTitle: "Talismã da Fortuna de Inazuma", targetRoles: ["MF", "FW", "DF"], combo: "Vínculo Inazuma" };
      } else {
        const defaultWishes = [
          { itemTitle: "Óculos Táticos do Estrategista", targetRoles: ["MF", "DF"], combo: "Cérebro do Time" },
          { itemTitle: "Luvas da Torre de Aço", targetRoles: ["GK"], combo: "Guardião da Torre" },
          { itemTitle: "Amuleto do Espírito Guerreiro", targetRoles: ["FW", "MF", "DF"], combo: "Guardião da Torre" },
          { itemTitle: "Talismã da Fortuna de Inazuma", targetRoles: ["MF", "FW"], combo: "Vínculo Inazuma" }
        ];
        wish = defaultWishes[Math.floor(Math.random() * defaultWishes.length)];
      }
      const requester = pickFairActor((a) => wish.targetRoles.includes(a.role)) || pickFairActor();
      const tact = pickOther([requester.id], (a) => resolveInazumaPersona(a).voice === "TACTICIAN" || a.role === "MF");
      const third = pickOther([requester.id, tact.id]);
      const core = [requester, tact, third].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      if (core.length < 2) return null;
      const msgs = [
        makeProcMsg(core, 0, `Professor, passei pela vitrine das Lojas de Inazuma e vi ${wish.itemTitle}. Se encaixar no nosso setor, ativa o combo ${wish.combo}!`, "idea"),
        makeProcMsg(core, 1, `Olhei os números dessa combinação também. Contra ${opp}, o salto de química com ${wish.combo} faz diferença nos duelos.`, "praise"),
        ...(core[2] ? [makeProcMsg(core, 2, `Vale a pena guardar uma visita na cidade só pra fechar essa dupla de itens.`, "calm")] : [])
      ];
      const choices = shuffleChoices([
        {
          label: `Mirar ${wish.itemTitle} nas Lojas e já ensaiar a conexão do setor hoje!`,
          approachTag: `Plano ${wish.combo}`,
          quality: "GREAT",
          coachLine: `Gostei da visão de elenco, ${shortFirstName(requester)}. Vamos buscar ${wish.itemTitle} e já sincronizar vocês em campo!`,
          customEffects: { affPts: 18, xpAmt: 24, chemDelta: 2, buffType: "COOP_SYNC" },
          reactions: [
            makeProcMsg(core, 0, `Fechado! Quando pintar na roleta da cidade a gente já sabe onde encaixar.`, "hype"),
            makeProcMsg(core, 1, `Com ${wish.combo} alinhado o time ganha outro padrão contra ${opp}.`, "praise")
          ]
        },
        {
          label: `Focar primeiro na preparação tática para ${opp} e avaliar a compra depois.`,
          approachTag: "Pragmático / +Poder",
          quality: "GOOD",
          coachLine: `Boa dica no radar! Primeiro fechamos o plano tático contra ${opp} e vemos o que aparece na loja.`,
          customEffects: { affPts: 12, respectDelta: 2, pwrDelta: 6 },
          reactions: [
            makeProcMsg(core, 0, `Justo, professor! Se sobrar energia a gente dá um pulo lá.`, "calm"),
            makeProcMsg(core, 1, `Sensato. Prioridade total nos três pontos agora.`, "calm")
          ]
        }
      ]);
      return baseResult({
        id: "proc_item_wishlist",
        category: "TATICA_RIVAL",
        categoryLabel: "Mercado & Combos",
        categoryIcon: "🧠",
        badgeClass: "cat-tactic",
        title: `Meta: ${wish.itemTitle}`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 20d. Resenha no Lámen do Mestre Hibiki (Rairaiken)
    if (kind === "PROC_RAIRAIKEN_RAMEN") {
      const lead = pickFairActor((a) => resolveInazumaPersona(a).voice !== "COLD_ACE") || pickFairActor();
      const buddy = pickOther([lead.id], (a) => resolveInazumaPersona(a).voice === "CHILL_JOKER" || resolveInazumaPersona(a).voice === "CAPTAIN_FIRE") || pickOther([lead.id]);
      const third = pickOther([lead.id, buddy.id]);
      const core = [lead, buddy, third].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      if (core.length < 2) return null;
      const msgs = [
        makeProcMsg(core, 0, `Passamos perto da barraca do Mestre Hibiki agora e ele reservou o balcão pro time fechar no Lámen Especial do Rairaiken!`, "hype"),
        makeProcMsg(core, 1, `Esse lámen salva qualquer perna pesada depois dos treinos. Dá até um ânimo novo antes de encarar ${opp}.`, "praise"),
        ...(core[2] ? [makeProcMsg(core, 2, `Sem contar que todo mundo sentado na mesma mesa limpa qualquer tensão do vestiário.`, "calm")] : [])
      ];
      const choices = shuffleChoices([
        {
          label: `Liberar a parada no Rairaiken pro grupo recarregar energia e entrosamento!`,
          approachTag: "+Energia / +Química",
          quality: "GREAT",
          coachLine: `Podem ir sim! Elenco inteiro no Rairaiken pra recuperar o fôlego e entrar unido contra ${opp}.`,
          customEffects: { energyDelta: 10, affPts: 18, chemDelta: 3, buffType: "MORALE_BOOST" },
          reactions: [
            makeProcMsg(core, 0, `Boa, professor!! O Mestre Hibiki já mandou preparar as tigelas reforçadas!`, "hype"),
            makeProcMsg(core, 1, `Amanhã o fôlego vai sobrar no segundo tempo.`, "praise")
          ]
        },
        {
          label: `Fazer um lanche rápido lá e voltar cedo pro estudo tático de ${opp}.`,
          approachTag: "Equilíbrio / +XP",
          quality: "GOOD",
          coachLine: `Boa iniciativa! Comam bem no Rairaiken e já voltem focados na leitura do jogo contra ${opp}.`,
          customEffects: { energyDelta: 5, xpAmt: 25, affPts: 12, buffType: "RIVAL_READ" },
          reactions: [
            makeProcMsg(core, 1, `Combinado, professor! Tigela rápida e olho no vídeo do rival.`, "calm"),
            makeProcMsg(core, 2 || 0, `Energia em dia e plano na cabeça.`, "calm")
          ]
        }
      ]);
      return baseResult({
        id: "proc_rairaiken_ramen",
        category: "ELOGIO",
        categoryLabel: "Lámen Rairaiken",
        categoryIcon: "🍜",
        badgeClass: "cat-chem",
        title: `Convite do Rairaiken`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 20e. Moral pelos Equipamentos & Combos Ativos
    if (kind === "PROC_GEAR_COMBO_HYPE") {
      const gHolders = actors.filter((a) => (Array.isArray(a.equipTitles) && a.equipTitles.length > 0) || Boolean(a.equipTitle));
      const g0 = gHolders[0] || pickFairActor();
      const g1 = gHolders.find((a) => a.id !== g0.id) || pickOther([g0.id]);
      const g2 = pickOther([g0.id, g1.id]);
      const core = [g0, g1, g2].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      if (core.length < 2) return null;
      const item0 = (g0.equipTitles && g0.equipTitles[0]) || g0.equipTitle || "os equipamentos novos";
      const item1 = (g1.equipTitles && g1.equipTitles[0]) || g1.equipTitle || "os ajustes do clube";
      const msgs = [
        makeProcMsg(core, 0, `Testei ${item0} no coletivo agora e a diferença na resposta em campo tá absurda!`, "hype"),
        makeProcMsg(core, 1, `Aqui também encaixou demais com ${item1}. Parece que o setor inteiro ganhou outra velocidade contra ${opp}.`, "praise"),
        ...(core[2] ? [makeProcMsg(core, 2, `Se a gente juntar esse ganho de equipamento com disciplina tática, ninguém segura nossa transição.`, "idea")] : [])
      ];
      const choices = shuffleChoices([
        {
          label: `Pressionar ${opp} em ritmo alto aproveitando o embalo dos equipamentos!`,
          approachTag: "+Poder / Pressão Alta",
          quality: "GREAT",
          tacticsPatch: { intensity: "high" },
          coachLine: `Então coloquem essa confiança pra correr! Contra ${opp} vamos subir a intensidade desde o apito inicial!`,
          customEffects: { pwrDelta: 8, affPts: 16, buffType: "BLOOD_FOCUS" },
          reactions: [
            makeProcMsg(core, 0, `Pode deixar! Vamos pra cima desde o primeiro minuto.`, "hype"),
            makeProcMsg(core, 1, `Ritmo forte pra não deixar ${opp} respirar.`, "hype")
          ]
        },
        {
          label: `Converter essa vantagem técnica em controle frio e passes seguros.`,
          approachTag: "+Química / +Sintonia",
          quality: "GOOD",
          coachLine: `Boa leitura de vocês. Usem essa confiança pra trocar passes com calma e controlar o jogo.`,
          customEffects: { chemDelta: 2, affPts: 14, xpAmt: 24, buffType: "COOP_SYNC" },
          reactions: [
            makeProcMsg(core, 1, `Fechado, controle limpo da bola até abrir a zaga deles.`, "calm"),
            makeProcMsg(core, 0, `Sincronia lá em cima pro jogo.`, "calm")
          ]
        }
      ]);
      return baseResult({
        id: "proc_gear_combo_hype",
        category: "ELOGIO",
        categoryLabel: "Arsenal do Time",
        categoryIcon: "⚡",
        badgeClass: "cat-chem",
        title: `Sintonia de Arsenal`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 21. Resenha leve aleatória de vestiário (6 temas variados e sem COLD_ACE rindo com kkk!)
    const joker = pickFairActor((a) => {
      const v = resolveInazumaPersona(a).voice;
      return v === "CHILL_JOKER" || v === "REBEL_TROLL" || v === "CAPTAIN_FIRE";
    }) || pickFairActor((a) => resolveInazumaPersona(a).voice !== "COLD_ACE");
    const buddy = pickOther([joker.id], (a) => resolveInazumaPersona(a).voice !== "COLD_ACE");
    const third = pickOther([joker.id, buddy.id]);
    const core = [joker, buddy, third].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
    const topics = [
      {
        title: "Superstição de Chuteira",
        m0: `Confessem aí no grupo: quem mais amarra a chuteira direita antes da esquerda antes de pegar ${opp}? kkk`,
        m1: `Haha eu tenho minha meia da sorte lavada desde ontem! Sem julgar ninguém aqui hein!`,
        c0: `Cada um tem sua mania kkk mas amanhã o que ganha jogo é estar ligado na bola!`,
        goodLine: `Superstição vale se o time entrar concentrado e leve!`,
        chemLine: `Sem neura com ritual, o importante é o treino que a gente já fez junto.`
      },
      {
        title: "Lámen Pós-Jogo",
        m0: `Se a gente vencer ${opp} hoje sem susto, quem vai puxar o bonde pro lámen gigante depois do jogo? kkk`,
        m1: `Opa, se tiver comemoração eu já tô garantido! Só precisa fazer o dever em campo antes!`,
        c0: `Haha ganhem de ${opp} jogando bonito que eu mesmo pago a primeira rodada pra todo mundo!`,
        goodLine: `Podem sonhar com o lámen sim, grupo unido rende o dobro em campo!`,
        chemLine: `Primeiro os três pontos contra ${opp}, depois a gente fecha o restaurante.`
      },
      {
        title: "Playlist do Vestiário",
        m0: `Quem mexeu na caixinha de som do vestiário hoje?! Colocaram uma música calma demais antes de encarar ${opp} kkk`,
        m1: `Foi mal haha achei que ia ajudar o pessoal a respirar fundo antes do aquecimento!`,
        c0: `Cada jogo pede um clima diferente, então soltem um som animado aí pra acordar a perna antes do apito!`,
        goodLine: `Vestiário vivo desse jeito dá prazer de treinar!`,
        chemLine: `Equilíbrio entre concentração e alegria é o ponto certo desse time.`
      },
      {
        title: "Desafio das Embaixadinhas",
        m0: `Pessoal tá apostando aqui no fundo quem faz mais embaixadinhas de calcanhar antes do ônibus chegar kkk`,
        m1: `Eu já passei de quarenta ontem! Só quero ver o equilíbrio da galera quando o campo molhar.`,
        c0: `Haha gosto de ver o controle de bola afiado até na brincadeira! Só guardem magia pros 90 minutos contra ${opp}!`,
        goodLine: `Controle de bola em dia até no intervalo do vestiário!`,
        chemLine: `Show de técnica na resenha, agora vamo descansar pra amanhã.`
      },
      {
        title: "Filme na Concentração",
        m0: `Que filme vocês vão colocar na TV do alojamento hoje antes de enfrentar ${opp}? Nada de terror antes de dormir hein kkk`,
        m1: `Se deixarem na mão dos atacantes só sai filme de ação explodindo tudo haha`,
        c0: `Escolham algo que deixe o elenco tranquilo pra dormir bem — quero perna fresca contra ${opp}!`,
        goodLine: `Noite tranquila em equipe recarrega mais que treino extra!`,
        chemLine: `Boa noite de descanso é metade da vitória amanhã.`
      },
      {
        title: "Foto Oficial do Elenco",
        m0: `O fotógrafo do torneio pediu uma pose nova pro ${teamName} antes do jogo contra ${opp}! Quem vai puxar a careta no fundo? kkk`,
        m1: `Haha eu juro que tentei ficar sério na última, mas sempre tem alguém piscando na hora!`,
        c0: `Haha podem caprichar na foto de equipe unida — só quero esse mesmo sorriso depois dos três apitos contra ${opp}!`,
        goodLine: `Essa foto vai entrar pra história da campanha!`,
        chemLine: `Foco e união na medida certa!`
      }
    ];
    const tp = topics[Math.floor(Math.random() * topics.length)];
    const banterMsgs = [
      makeProcMsg(core, 0, tp.m0, "banter"),
      makeProcMsg(core, 1, tp.m1, "normal")
    ];
    const banterChoices = shuffleChoices([
      {
        label: "Entrar na resenha leve e puxar o astral do grupo lá pro alto!",
        approachTag: "Moral Alta",
        quality: "GREAT",
        coachLine: tp.c0,
        customEffects: { affPts: 16, energyDelta: 4, chemDelta: 2, buffType: "LIGHT_LOCKER" },
        reactions: [
          makeProcMsg(core, 0, `Aeeee!! Agora sim o melhor técnico do campeonato kkk`, "hype"),
          makeProcMsg(core, 1, tp.goodLine, "hype")
        ]
      },
      {
        label: "Manter o bom humor dosado com foco na preparação",
        approachTag: "Foco Leve",
        quality: "GOOD",
        coachLine: tp.chemLine,
        customEffects: { affPts: 10, chemDelta: 1 },
        reactions: [
          makeProcMsg(core, 0, `Fechado professor, concentração ligada!`, "calm")
        ]
      }
    ]);
    return baseResult({
      id: "proc_locker_banter_" + topics.indexOf(tp),
      category: "RESENHA",
      categoryLabel: "Vestiário",
      categoryIcon: "😄",
      badgeClass: "cat-banter",
      title: tp.title,
      coreActors: core,
      messages: banterMsgs,
      choices: banterChoices
    });
  }

  function buildHalftimeLockerTalk(st) {
    if (!st) return null;
    const uScore = Number(st.userScore) || 0;
    const oScore = Number(st.oppScore) || 0;
    const margin = Math.abs(uScore - oScore);
    const oppName = st.oppTeam?.name || "o adversário";
    const squadObj = typeof state !== "undefined" && state?.squad ? state.squad : {};
    const slots = typeof getSlots === "function" ? getSlots() : [];
    const tac = typeof getTactics === "function" ? getTactics() : {};
    const fieldPlayers = slots
      .map((s) => ({ slot: s, p: squadObj[s.id] }))
      .filter((e) => e.p);
    if (fieldPlayers.length === 0) return null;

    const cap = fieldPlayers.find((e) => e.p.id === tac.captainPlayerId)
      || fieldPlayers.find((e) => resolveInazumaPersona(e.p).voice === "CAPTAIN_FIRE")
      || fieldPlayers[0];
    const voice2 = fieldPlayers.find((e) => e.p.id !== cap.p.id && (e.slot.role === "FW" || e.slot.role === "MF" || resolveInazumaPersona(e.p).voice === "TACTICIAN"))
      || fieldPlayers.find((e) => e.p.id !== cap.p.id)
      || cap;
    const gk = fieldPlayers.find((e) => e.slot.role === "GK") || cap;

    const spriteFor = (entry) =>
      typeof getPlayerFormSprite === "function" ? getPlayerFormSprite(entry.p, entry.slot.role) : (entry.p.sprite || "");

    const goalNames = Array.isArray(st.goalsUser) ? st.goalsUser.map((g) => g?.name).filter(Boolean) : [];
    const lastGoalName = goalNames.length > 0 ? goalNames[goalNames.length - 1] : null;
    const scorerEntry = lastGoalName ? fieldPlayers.find((e) => e.p.name === lastGoalName) : null;
    const lead2 = scorerEntry && scorerEntry.p.id !== cap.p.id ? scorerEntry : voice2;

    const pCap = resolveInazumaPersona(cap.p);
    const pGk = resolveInazumaPersona(gk.p);

    const isWinning = uScore > oScore;
    const isLosing = uScore < oScore;
    const statusKind = isLosing ? "LOSE" : isWinning ? "WIN" : "DRAW";
    const statusTag = isLosing
      ? (margin >= 2 ? "VIRADA HISTÓRICA!" : "VIRADA NO 2º TEMPO!")
      : isWinning
      ? (margin >= 2 ? "VANTAGEM SÓLIDA!" : "SEGURE A VANTAGEM!")
      : "TUDO EM ABERTO!";

    const voiceTxt = (entry, pers, mode) => {
      const v = pers.voice;
      if (mode === "LOSE") {
        if (v === "COLD_ACE") return pickVariant([
          `Estar ${uScore} x ${oScore} atrás contra ${oppName} não interessa. Soltem a bola na frente no 2º tempo que eu resolvo.`,
          `${uScore} x ${oScore} ainda dá tempo de virar. Só preciso da bola limpa uma vez.`
        ]);
        if (v === "HOTHEAD") return pickVariant([
          `Não vou aceitar sair desse campo perdendo pra ${oppName}!! Manda pressionar em cima agora, professor!`,
          `Falta 45 minutos inteiros ainda!! Libera a linha alta pra gente amassar ${oppName} na volta!`
        ]);
        if (v === "TACTICIAN") return pickVariant([
          `O meio de ${oppName} abriu espaços nos últimos dez minutos. Com um ajuste fino agora nós viramos esse ${uScore} x ${oScore}!`,
          `Eles estão marcando adiantado nesse ${uScore} x ${oScore}. Se ligarmos direto pelas pontas quebramos a linha deles!`
        ]);
        if (v === "CHILL_JOKER") return pickVariant([
          `Ei, levanta a cabeça galera! Já viramos jogos piores que esse, bora incendiar o vestiário!`,
          `Respira fundo pessoal! ${margin === 1 ? "Um golzinho já iguala tudo" : "Ainda tem muito jogo"}, bora acordar na volta!`
        ]);
        return pickVariant([
          `Esse ${uScore} x ${oScore} não acabou!! Todo mundo confia no companheiro do lado porque contra ${oppName} nós vamos buscar a virada!`,
          `Escutem a torcida ainda cantando lá fora! Vamos dar a resposta em campo contra ${oppName} nesses 45 minutos finais!`
        ]);
      }
      if (mode === "WIN") {
        if (scorerEntry && scorerEntry.p.id === entry.p.id) {
          return pickVariant([
            `Aquele gol foi só o começo contra ${oppName}! Mas ${uScore} x ${oScore} ainda pede concentração máxima na volta.`,
            `A bola entrou limpa no 1º tempo! Se ${oppName} sair pra cima agora, a gente mata o jogo no contra-ataque.`
          ]);
        }
        if (v === "STOIC_WALL") return pickVariant([
          `Seguramos bem nesse ${uScore} x ${oScore}, mas ${oppName} vai tentar tudo no 2º tempo. Linha fechada lá atrás!`,
          `Nenhum segundo de distração lá atrás, ${uScore} x ${oScore} só fica seguro quando soar o apito final.`
        ]);
        if (v === "COLD_ACE") return pickVariant([
          `Boa vantagem, mas jogo só acaba no apito. Se der espaço pra contra-atacar nós matamos ${oppName}.`,
          `Sem relaxar com ${uScore} x ${oScore}. Quero mais um pra fechar a conta.`
        ]);
        if (v === "TACTICIAN") return pickVariant([
          `Eles vão precisar avançar pra buscar o empate. Se controlarmos o ritmo do meio, a vitória não escapa.`,
          `Excelente 1º tempo em ${uScore} x ${oScore}. Agora é usar a pressa de ${oppName} contra eles mesmos.`
        ]);
        return pickVariant([
          `Bora manter esse fogo aceso!! ${uScore} x ${oScore} tá ótimo, mas quero ver todo mundo correndo ainda mais na etapa final!`,
          `Um tempo excelente já foi, falta terminar o serviço contra ${oppName} com a mesma garra!`
        ]);
      }
      if (v === "COLD_ACE") return pickVariant([
        `${uScore} x ${oScore} tá aberto demais contra ${oppName}. Só me deem a jogada limpa uma vez.`,
        `Jogo travado em ${uScore} x ${oScore}. Hora de decidir quem erra primeiro.`
      ]);
      if (v === "TACTICIAN") return pickVariant([
        `Primeiro tempo muito estudado nesse ${uScore} x ${oScore}. Qual setor vamos atacar pra quebrar o empate, treinador?`,
        `Tá muito equilibrado nesse ${uScore} x ${oScore}. Um ajuste de ritmo agora pode abrir a defesa de ${oppName}.`
      ]);
      if (v === "CHILL_JOKER") return pickVariant([
        `Jogo amarrado hein ${uScore} x ${oScore}! Um ajuste certo no intervalo e a torcida explode!`,
        `${uScore} x ${oScore} pegado demais! Qual é o comando do chefe pra destravar o placar?`
      ]);
      return pickVariant([
        `Empate em ${uScore} x ${oScore} contra ${oppName}! Ninguém abaixa o ritmo agora, os últimos 45 minutos são nossos!`,
        `Tudo aberto nesse ${uScore} x ${oScore}! Vamos voltar mordendo mais forte pra arrancar essa vitória!`
      ]);
    };

    const modeKey = isLosing ? "LOSE" : isWinning ? "WIN" : "DRAW";
    const lead1 = isWinning && !scorerEntry ? gk : cap;
    const pLead1 = isWinning && !scorerEntry ? pGk : pCap;
    const safeLead2 = lead2.p.id === lead1.p.id ? (fieldPlayers.find((e) => e.p.id !== lead1.p.id) || lead2) : lead2;
    const pSafeLead2 = resolveInazumaPersona(safeLead2.p);

    const bubbles = [
      {
        name: lead1.p.name,
        roleLabel: lead1.p.id === cap.p.id ? "Capitão" : lead1.slot.role,
        role: lead1.slot.role,
        voiceLabel: pLead1.label || "Líder",
        element: lead1.p.element || "Vento",
        sprite: spriteFor(lead1),
        tone: isLosing ? "tense" : isWinning ? "hype" : "normal",
        text: voiceTxt(lead1, pLead1, modeKey)
      },
      {
        name: safeLead2.p.name,
        roleLabel: scorerEntry && safeLead2.p.id === scorerEntry.p.id ? "Artilheiro" : safeLead2.slot.role,
        role: safeLead2.slot.role,
        voiceLabel: pSafeLead2.label || "Titular",
        element: safeLead2.p.element || "Vento",
        sprite: spriteFor(safeLead2),
        tone: isWinning ? "hype" : "idea",
        text: voiceTxt(safeLead2, pSafeLead2, modeKey)
      }
    ];

    const fwStar = fieldPlayers.find((e) => e.slot.role === "FW") || cap;
    const mfStar = fieldPlayers.find((e) => e.slot.role === "MF") || safeLead2;
    const vFw = resolveInazumaPersona(fwStar.p).voice;
    const vMf = resolveInazumaPersona(mfStar.p).voice;
    const vGk = pGk.voice;

    const choices = [
      {
        key: "FIRE",
        title: "Espírito de Chama",
        subtitle: "Pressão total no ataque",
        buffTag: "+Ataque/Chute • -4% Fôlego",
        reactName: fwStar.p.name,
        reactSprite: spriteFor(fwStar),
        coachText: isWinning
          ? `Não recuem nem um passo! Vamos matar o jogo contra ${oppName} em cima no 2º tempo!`
          : `Escutem bem: não viemos assistir ${oppName} jogar! Pressionem lá em cima e chutem com alma desde o apito!`,
        playerReact: vFw === "COLD_ACE"
          ? `Certo. Quando a bola cair na área contra ${oppName}, ela entra.`
          : `Pode deixar, professor!! No primeiro espaço na área a rede vai balançar!`
      },
      {
        key: "CALM",
        title: "Ritmo Relâmpago",
        subtitle: "Posse & drible no meio",
        buffTag: "+Drible & Meio-Campo",
        reactName: mfStar.p.name,
        reactSprite: spriteFor(mfStar),
        coachText: `Cabeça erguida e toque rápido pelo meio! Façam ${oppName} correr atrás da bola até a defesa abrir!`,
        playerReact: vMf === "COLD_ACE"
          ? `Entendido. Vou encontrar o espaço limpo no meio.`
          : `Leitura perfeita! Vamos girar a bola e desmontar a marcação deles no drible!`
      },
      {
        key: "WALL",
        title: "Paredão Inazuma",
        subtitle: "Compactar defesa e gol",
        buffTag: "+Defesa & Goleiro",
        reactName: gk.p.name,
        reactSprite: spriteFor(gk),
        coachText: `Linha compacta na frente do ${shortFirstName(gk.p.name)}! Primeiro protegemos nossa meta, depois saímos mortais!`,
        playerReact: vGk === "COLD_ACE"
          ? `Meta fechada. Ninguém passa no 2º tempo.`
          : `Fechado! Da minha área não passa nem sombra de bola no 2º tempo!`
      }
    ];

    return { statusKind, statusTag, oppEmblem: st.oppTeam?.emblem || "", bubbles, choices };
  }

  const g = typeof window !== "undefined" ? window : globalThis;
  g.resolveInazumaPersona = resolveInazumaPersona;
  g.humanizeInaZapText = humanizeInaZapText;
  g.humanizeTacticalChangeForChat = humanizeTacticalChangeForChat;
  g.moveWithArticle = moveWithArticle;
  g.describeActorMoveAction = describeActorMoveAction;
  g.buildDynamicGroupChimeIns = buildDynamicGroupChimeIns;
  g.buildDynamicSilentResolution = buildDynamicSilentResolution;
  g.buildDynamicPostDecisionWrapUp = buildDynamicPostDecisionWrapUp;
  g.attachDynamicEmojiReactions = attachDynamicEmojiReactions;
  g.generateProceduralBetaChat = generateProceduralBetaChat;
  g.buildHalftimeLockerTalk = buildHalftimeLockerTalk;
})();
