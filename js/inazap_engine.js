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
      [/administração perfeita/gi, "mando muito bem"],
      [/elevar o nível/gi, "subir o ritmo"],
      [/fator psicológico/gi, "cabeça no lugar"],
      [/protocolo tático/gi, "esquema de jogo"],
      [/executar até o último segundo do relógio/gi, "correr até o apito final"],
      [/cumprir minha parte no gramado/gi, "fazer o meu em campo"]
    ];
    for (let i = 0; i < naturalSwaps.length; i++) {
      txt = txt.replace(naturalSwaps[i][0], naturalSwaps[i][1]);
    }

    // 3) Pequena variação orgânica por voz (sem exagerar nem quebrar nomes/técnicas)
    const p = resolveInazumaPersona(actor);
    if (p.voice === "COLD_ACE") {
      txt = txt.replace(/^Haha[,!]?\s*/i, "");
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

  function describeActorMoveAction(actor = {}, ctx = {}) {
    const move = ctx.sigMove || actor.sigMove || "minha técnica";
    const cat = ctx.sigMoveCat || actor.sigMoveCat || (actor.role === "GK" ? "GK" : actor.role === "DF" ? "DF" : actor.role === "MF" ? "OF" : "SH");
    const opp = ctx.oppName || "eles";
    if (cat === "GK") {
      return {
        cat,
        move,
        clutchLine: `Com a ${move} fechando o gol, ${opp} não passa lá atrás hoje.`,
        supportLine: `lá atrás o gol tá trancado com a ${move}!`,
        breakLine: `Se tentarem chutar da entrada da área eu seguro na ${move}.`
      };
    }
    if (cat === "DF") {
      return {
        cat,
        move,
        clutchLine: `Se o ataque de ${opp} tentar entrar na área, eu travo na hora com a ${move}.`,
        supportLine: `na marcação eu fecho a porta com a ${move}!`,
        breakLine: `Quem tentar passar por mim para na ${move}.`
      };
    }
    if (cat === "OF") {
      return {
        cat,
        move,
        clutchLine: `Se der meio metro de espaço, eu corto a marcação com a ${move} e deixo alguém na cara do gol.`,
        supportLine: `se abrir corredor no meio eu passo liso com a ${move}!`,
        breakLine: `Com a ${move} eu limpo dois marcadores e sirvo na boa.`
      };
    }
    return {
      cat: "SH",
      move,
      clutchLine: `Se der espaço pra ${move}, o goleiro de ${opp} nem vê a cor da bola.`,
      supportLine: `se sobrar na área eu solto a ${move}!`,
      breakLine: `Quando eu engatilhar a ${move}, a zaga deles não acompanha.`
    };
  }

  function pickFreshWeighted(t, pool = [], threadUsedSet = null) {
    if (!Array.isArray(pool) || pool.length === 0) return null;
    const store = t && typeof t === "object" ? t : null;
    const history = store && Array.isArray(store._usedInaZapLineKeys) ? store._usedInaZapLineKeys : [];
    const recentSet = new Set(history.slice(-55));
    const isFreshInThread = (item) => {
      if (!threadUsedSet || !item?.text) return true;
      return !threadUsedSet.has(String(item.text).trim().toLowerCase());
    };
    let candidates = pool.filter((item) => item && item.key && !recentSet.has(item.key) && isFreshInThread(item));
    if (candidates.length === 0) {
      const shorterSet = new Set(history.slice(-18));
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
      if (store._usedInaZapLineKeys.length > 90) {
        store._usedInaZapLineKeys = store._usedInaZapLineKeys.slice(-90);
      }
    }
    return chosen;
  }

  function getPersonaReplyBank(voice, ctx = {}) {
    const opp = ctx.oppName || "eles";
    const oppShort = shortFirstName(opp);
    const move = ctx.sigMove || "minha técnica";
    const other = ctx.otherName || "galera";
    const tac = humanizeTacticalChangeForChat(ctx.tacText || "");
    const coopMove = ctx.coopMove || "";
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
          { key: "cf_g3", text: tac ? `Curti demais apostar na ${tac}! Bora entrar mordendo desde o primeiro minuto!` : `Tô arrepiado já, sério. Bora fazer valer cada gota de suor contra ${opp}!` },
          { key: "cf_g4", text: `Futebol é isso aqui, ${other}! Quando todo mundo olha pro mesmo lado sai jogada gigante!` }
        ],
        GOOD: [
          { key: "cf_ok1", text: tac ? `Fechado na ${tac}! Todo mundo ajudando na marcação fica bem mais leve!` : `Boa, professor! Se a gente correr um pelo outro já muda a cara do jogo.` },
          { key: "cf_ok2", text: `Beleza! Já vou avisando a linha de trás pra ninguém desligar contra ${opp}.` },
          { key: "cf_ok3", text: `Tamo junto nessa! Agora é ir pro campo e testar na prática.` }
        ],
        TRADEOFF: [
          { key: "cf_tr1", text: `Beleza, professor. Tem risco, mas futebol sem coragem não tem graça nenhuma!` },
          { key: "cf_tr2", text: tac ? `Vai exigir mais fôlego com ${tac}, então bora puxar o ritmo no aquecimento!` : `Se apertar lá atrás eu mesmo cubro a sobra, pode deixar comigo.` }
        ],
        POOR: [
          { key: "cf_bd1", text: `Pô professor... eu vou dar o sangue igual, mas senti que a galera ficou meio travada.` },
          { key: "cf_bd2", text: `Eita, assim o clima pesa antes do jogo. Bora tentar não levar isso pro campo, pessoal.` }
        ],
        CHIME_RAGE: [
          { key: "cf_cr1", text: `Ei ei, para tudo vocês dois! A gente tá no mesmo barco contra ${opp}!` },
          { key: "cf_cr2", text: `Calma aí, ${other}! Não deixa uma discussão boba esfriar o nosso treino!` }
        ],
        CHIME_HYP: [
          { key: "cf_ch1", text: `Tô dentro total! Se der brecha eu grito na hora pra gente encaixar!` },
          { key: "cf_ch2", text: `Cara, que absurdo vai ficar isso quando sair no meio do jogo!!` }
        ]
      },

      COLD_ACE: {
        GREAT: [
          { key: "ca_g1", text: `Fechado. Toca no tempo certo que o gol sai.` },
          { key: "ca_g2", text: tac ? `Bom ajuste na ${tac}. Agora é mostrar contra ${opp}.` : `Certo. Só façam a parte de vocês que eu resolvo no meu setor.` },
          { key: "ca_g3", text: mv.clutchLine },
          { key: "ca_g4", text: `${other}, mantém o olho na minha corrida. Um segundo basta.` }
        ],
        GOOD: [
          { key: "ca_ok1", text: `Certo. Faz sentido pra cima de ${opp}.` },
          { key: "ca_ok2", text: `Ok. Foca no treino que eu tô pronto.` },
          { key: "ca_ok3", text: `Beleza, menos conversa e mais jogo.` }
        ],
        TRADEOFF: [
          { key: "ca_tr1", text: `Tem custo, mas funciona. Eu banco lá na frente.` },
          { key: "ca_tr2", text: tac ? `Aceito o risco com ${tac}. Só não vacilem na saída.` : `Tanto faz o desgaste. O que importa é vencer ${opp}.` }
        ],
        POOR: [
          { key: "ca_bd1", text: `...Decisão estranha, técnico.` },
          { key: "ca_bd2", text: `Se a bola não chegar limpa desse jeito, não cobra depois.` },
          { key: "ca_bd3", text: `Tsc. Tomara que dê certo contra ${opp}.` }
        ],
        CHIME_RAGE: [
          { key: "ca_cr1", text: `Chega. Os dois estão falando demais.` },
          { key: "ca_cr2", text: `Se tiverem essa energia toda pra marcar ${opp}, o jogo já ajuda.` }
        ],
        CHIME_HYP: [
          { key: "ca_ch1", text: `Interessante. Se abrir o corredor eu entro.` },
          { key: "ca_ch2", text: `Não atrasem o passe. Só isso.` }
        ]
      },

      TACTICIAN: {
        GREAT: [
          { key: "tc_g1", text: tac ? `Boa leitura, técnico! Com ${tac}, o meio de ${opp} vai abrir espaço nas costas dos volantes.` : `Exato! Se a gente girar a bola rápido pelo meio, ${opp} não acompanha a troca.` },
          { key: "tc_g2", text: mv.cat === "DF" || mv.cat === "GK" ? `${other}, se você fechar a primeira linha comigo, a gente trava o ataque de ${opp} na ${move}.` : `${other}, se você puxar um marcador quando eu preparar a ${move}, a linha deles quebra inteira.` },
          { key: "tc_g3", text: `Perfeito. Já até marquei onde costuma sobrar o rebote contra o esquema deles.` }
        ],
        GOOD: [
          { key: "tc_ok1", text: `Faz bastante sentido. Dá pra controlar o ritmo sem se expor.` },
          { key: "tc_ok2", text: tac ? `Anotado sobre ${tac}. Só precisamos sincronizar a distância entre linhas.` : `Certo, vou ajustar a leitura de passe pensando nisso.` },
          { key: "tc_ok3", text: `Boa, assim ninguém corre errado atrás da bola.` }
        ],
        TRADEOFF: [
          { key: "tc_tr1", text: `É uma aposta ousada. Ganha poder de fogo mas exige cobertura rápida se perdermos a bola.` },
          { key: "tc_tr2", text: `Beleza, vou ficar de olho na transição de ${opp} pra não deixar buraco.` }
        ],
        POOR: [
          { key: "tc_bd1", text: `Sinceramente, professor? Esse plano entrega exatamente o espaço que ${opp} gosta.` },
          { key: "tc_bd2", text: `Não curti a ideia, mas vou tentar consertar o posicionamento na hora.` }
        ],
        CHIME_RAGE: [
          { key: "tc_cr1", text: `Pessoal, brigar aqui só ajuda ${opp}. Olhem pro que a gente precisa ajustar no campo.` },
          { key: "tc_cr2", text: `Os dois têm parte de razão, mas se não conversarem direito vai dar erro de passe na hora H.` }
        ],
        CHIME_HYP: [
          { key: "tc_ch1", text: `O ângulo dessa jogada é ótimo. Se soltar de primeira não tem interceptação que pegue.` },
          { key: "tc_ch2", text: `Eu calculo o tempo da tabela com vocês, manda o sinal no treino.` }
        ]
      },

      HOTHEAD: {
        GREAT: [
          { key: "hh_g1", text: `Aí sim!! Tava na hora de partir pra cima sem medo de ${opp}!!` },
          { key: "hh_g2", text: mv.cat === "DF" || mv.cat === "GK" ? `Quero ver o ataque deles passar da minha ${move} depois dessa conversa!` : `Quero ver a zaga deles aguentar minha ${move} depois dessa conversa!` },
          { key: "hh_g3", text: tac ? `Mandar ${tac} agora ficou brabo demais!! Bora atropelar!` : `É disso que eu tô falando! Agora ninguém tira o olho da bola!` }
        ],
        GOOD: [
          { key: "hh_ok1", text: `Beleza, fechou! Só quero intensidade lá dentro.` },
          { key: "hh_ok2", text: `Tô pronto já. Se ${opp} vier duro eu respondo em campo!` },
          { key: "hh_ok3", text: `Demorou, ${other}, agora sim vamos jogar sério.` }
        ],
        TRADEOFF: [
          { key: "hh_tr1", text: `Pode mandar o risco! Melhor morrer tentando ganhar do que ficar assistindo ${opp} jogar!` },
          { key: "hh_tr2", text: `Se cansar eu corro na raça mesmo, tô nem aí!` }
        ],
        POOR: [
          { key: "hh_bd1", text: `Ah qual é, professor?! Desse jeito a gente vai entrar recuado apanhando!` },
          { key: "hh_bd2", text: `Não desceu bem não... mas bora ver quem aguenta na hora do jogo.` }
        ],
        CHIME_RAGE: [
          { key: "hh_cr1", text: `Ôpa, querem resolver no grito ou mostrando bola no campo?!` },
          { key: "hh_cr2", text: `Para de chorar os dois, ${opp} não vai ter dó de ninguém amanhã!` }
        ],
        CHIME_HYP: [
          { key: "hh_ch1", text: `Tô dentro!! Me coloca nessa jogada que eu dou a vida em campo!` },
          { key: "hh_ch2", text: `Quero ver se a marcação deles segura o tranco da nossa jogada!` }
        ]
      },

      REBEL_TROLL: {
        GREAT: [
          { key: "rt_g1", text: `Olha só, até que o técnico mandou bem nessa kkk. Quero ver ${opp} entender algo agora.` },
          { key: "rt_g2", text: `Haha beleza, pelo menos não ficou aquele papo chato. Agora vai ficar divertido.` },
          { key: "rt_g3", text: `Se deixarem solto eu aposto que faço o marcador de ${opp} cair sentado kkk` }
        ],
        GOOD: [
          { key: "rt_ok1", text: `É, dá pro gasto. Melhor do que ficar parado no treino sem fazer nada kkk` },
          { key: "rt_ok2", text: `Tranquilo, ${other}. Só não me pede pra sorrir depois da jogada kkk` },
          { key: "rt_ok3", text: `Bora testar então. Se der bom eu até falo que foi ideia sua.` }
        ],
        TRADEOFF: [
          { key: "rt_tr1", text: `Opa, gostei da loucura kkk. Se der errado ninguém viu quem sugeriu hein!` },
          { key: "rt_tr2", text: `Arriscado? Bem melhor assim. Jogo morno dá sono.` }
        ],
        POOR: [
          { key: "rt_bd1", text: `kkkkk sério mesmo essa ordem? Tá bom né, quem sou eu...` },
          { key: "rt_bd2", text: `Vish, já vi tudo. Depois não reclama se o plano azedar no meio do jogo.` },
          { key: "rt_bd3", text: `Ah pronto... boa sorte pra quem for obedecer isso aí kkk` }
        ],
        CHIME_RAGE: [
          { key: "rt_cr1", text: `Pega a pipoca que o grupo hoje tá pegando fogo kkk`, extra: `Mas falando sério, guarda metade dessa raiva pra bater em ${opp}.` },
          { key: "rt_cr2", text: `Ué, já acabou a briga ou vai ter segundo tempo? kkk` }
        ],
        CHIME_HYP: [
          { key: "rt_ch1", text: `Se vocês errarem esse tempo novo eu vou zoar a semana inteira kkk` },
          { key: "rt_ch2", text: `Até que ficou sinistro hein. Quero ver ${opp} tentar marcar isso!` }
        ]
      },

      DIVINE_PRIDE: {
        GREAT: [
          { key: "dp_g1", text: `Agora sim uma estratégia digna do nosso futebol. ${opp} vai apenas assistir.` },
          { key: "dp_g2", text: `Quando eu acionar a ${move} com esse apoio, o jogo vira obra de arte.` },
          { key: "dp_g3", text: `Perfeito, professor. A vitória já começa a tomar forma.` }
        ],
        GOOD: [
          { key: "dp_ok1", text: `Aceitável. Se mantiverem esse padrão, nós controlamos ${opp} fácil.` },
          { key: "dp_ok2", text: `Muito bem, ${other}. Só capriche no timing e o resto flui.` }
        ],
        TRADEOFF: [
          { key: "dp_tr1", text: `Um preço pequeno para quem busca o extraordinário em campo.` },
          { key: "dp_tr2", text: `Não temo o risco. Grandes jogadas exigem ousadia.` }
        ],
        POOR: [
          { key: "dp_bd1", text: `Isso limita completamente o meu brilho em campo, treinador.` },
          { key: "dp_bd2", text: `Comum demais... esperava algo muito mais ambicioso contra ${opp}.` }
        ],
        CHIME_RAGE: [
          { key: "dp_cr1", text: `Que falta de elegância ficar batendo boca antes da entrada em campo.` },
          { key: "dp_cr2", text: `Elevem o nível, por favor. Brigas pequenas não combinam com quem quer o topo.` }
        ],
        CHIME_HYP: [
          { key: "dp_ch1", text: `Com a minha presença no lance, essa técnica fica simplesmente impecável.` },
          { key: "dp_ch2", text: `Interessante... deixe-me polir os detalhes finais disso no treino.` }
        ]
      },

      CHILL_JOKER: {
        GREAT: [
          { key: "cj_g1", text: `Aeee boa professor!! Se a gente ganhar de ${opp} hoje eu pago um lámen pra galera kkk` },
          { key: "cj_g2", text: `Cara, agora sim deu ânimo! Sério, parecia até que ia chover no vestiário antes.` },
          { key: "cj_g3", text: `Boraa! Quem der assistência ganha folga de carregar as bolas amanhã kkk` }
        ],
        GOOD: [
          { key: "cj_ok1", text: `Showw! Bem mais tranquilo agora, vamo que vamo!` },
          { key: "cj_ok2", text: `Boa ${other}, fechou total! Só não esquece de tocar pra mim livre kkk` },
          { key: "cj_ok3", text: `Tranquilaço! Tudo certo pro jogo contra ${opp}.` }
        ],
        TRADEOFF: [
          { key: "cj_tr1", text: `Eita, vai cansar um pouco mas depois a gente come dobrado pra recuperar kkk` },
          { key: "cj_tr2", text: `Opa, apostinha boa hein! Bora encarar!` }
        ],
        POOR: [
          { key: "cj_bd1", text: `Ué... achei que ia ser mais de boa, deu até um frio na barriga agora.` },
          { key: "cj_bd2", text: `Vish maria, clima azedou legal aqui no zap kkk melhor eu ir encher minha garrafa.` }
        ],
        CHIME_RAGE: [
          { key: "cj_cr1", text: `Calma aí gente kkk respira, toma uma água gelada antes de mandar áudio bravo!` },
          { key: "cj_cr2", text: `Poxa, vamos parar de brigar antes que o professor tire nosso lanche!` }
        ],
        CHIME_HYP: [
          { key: "cj_ch1", text: `Eitaa! Só toma cuidado pra não derrubar eu no meio desse lance kkk` },
          { key: "cj_ch2", text: `Maneiro demais!! Quero ver a cara do time de ${opp} vendo isso.` }
        ]
      },

      STOIC_WALL: {
        GREAT: [
          { key: "sw_g1", text: mv.cat === "DF" || mv.cat === "GK" ? `Podem avançar tranquilos contra ${opp}. Com a minha ${move}, a meta tá fechada hoje.` : `Podem confiar, professor! Eu ajudo na recomposição pra gente pressionar ${opp} com segurança.` },
          { key: "sw_g2", text: tac ? `Excelente apostar na ${tac}, professor! Protege exatamente onde ${opp} costuma forçar.` : `Confiança lá em cima. Se fecharmos os espaços atrás, a bola lá na frente entra.` },
          { key: "sw_g3", text: `Tamo fechado, ${other}. Pode soltar o jogo sem medo de contra-ataque.` }
        ],
        GOOD: [
          { key: "sw_ok1", text: `Combinado. Vou manter a linha organizada e avisar todo mundo na marcação.` },
          { key: "sw_ok2", text: `Podem deixar a cobertura comigo. Foco total até o fim.` }
        ],
        TRADEOFF: [
          { key: "sw_tr1", text: `Vai puxar mais da defesa, mas eu aguento o tranco. Pode mandar.` },
          { key: "sw_tr2", text: `Se alguém cansar no segundo tempo eu fecho o espaço na raça.` }
        ],
        POOR: [
          { key: "sw_bd1", text: `Deixar a defesa exposta assim contra ${opp} me preocupa bastante, professor.` },
          { key: "sw_bd2", text: `Não concordo com esse caminho, mas não vou abandonar minha área.` }
        ],
        CHIME_RAGE: [
          { key: "sw_cr1", text: `Ei, foco. Lá atrás eu preciso que vocês se falem direito, não que briguem.` },
          { key: "sw_cr2", text: `Respiram os dois. Quando a bola rolar eu quero todo mundo inteiro.` }
        ],
        CHIME_HYP: [
          { key: "sw_ch1", text: `Boa iniciativa. Quando recuperar atrás eu já mando a bola direto pra vocês.` },
          { key: "sw_ch2", text: `Firmeza. Se encaixar no treino ninguém para.` }
        ]
      },

      SPEED_SPARK: {
        GREAT: [
          { key: "ss_g1", text: `Vambora!! Se a bola cair no espaço eu disparo antes mesmo da zaga de ${opp} piscar!` },
          { key: "ss_g2", text: mv.cat === "OF" || mv.cat === "SH" ? `Curti demais!! Já tô imaginando a velocidade que a gente vai pegar com a ${move}!` : `Curti demais!! Já tô imaginando a velocidade da nossa saída de bola contra ${opp}!` },
          { key: "ss_g3", text: `Partiu campo agora!! Quero testar esse arranque no treino antes de esfriar!` }
        ],
        GOOD: [
          { key: "ss_ok1", text: `Fechado! Se acelerar na transição a gente pega ${opp} todo aberto.` },
          { key: "ss_ok2", text: `Beleza ${other}, só lança na corrida que eu chego primeiro!` }
        ],
        TRADEOFF: [
          { key: "ss_tr1", text: `Puxado na correria? Deixa comigo que perna aqui não falta!` },
          { key: "ss_tr2", text: `Pode exigir o ritmo alto, eu aguento ir e voltar o jogo todo.` }
        ],
        POOR: [
          { key: "ss_bd1", text: `Poxa, segurar tanto o ritmo assim tira meu melhor ponto em campo.` },
          { key: "ss_bd2", text: `Beleza então... só achei lento demais pra pegar ${opp}.` }
        ],
        CHIME_RAGE: [
          { key: "ss_cr1", text: `Gente, menos briga no chat e mais pique no campo, pfvr!` },
          { key: "ss_cr2", text: `Enquanto vocês digitam textão ${opp} tá treinando lá kkk bora focar!` }
        ],
        CHIME_HYP: [
          { key: "ss_ch1", text: `Opa! Se for jogada em velocidade pode me chamar na hora!` },
          { key: "ss_ch2", text: `Se eu puxar o marcador no drible sobra limpo pra vocês!` }
        ]
      },

      HEART_TEAM: {
        GREAT: [
          { key: "ht_g1", text: `Muito bom ouvir isso, professor! Dá uma confiança enorme pra todo mundo.` },
          { key: "ht_g2", text: `Valeu mesmo, galera. Assim a gente joga leve e dando o máximo contra ${opp}!` },
          { key: "ht_g3", text: coopMove ? `A gente conseguiu encaixar a ${coopMove}!! Nem acredito, bora mostrar pro estádio inteiro!` : `Bora! Eu ajudo no que precisar pro esquema funcionar 100%.` }
        ],
        GOOD: [
          { key: "ht_ok1", text: `Boa, professor! Tmj time, vamos pra cima de ${opp} unidos.` },
          { key: "ht_ok2", text: `Gostei da ideia, ${other}. Se der tudo certo hoje a gente comemora depois!` }
        ],
        TRADEOFF: [
          { key: "ht_tr1", text: `Justo! Cada um faz um esforço a mais e a gente compensa junto em campo.` },
          { key: "ht_tr2", text: `Combinado então. Ninguém vai deixar ninguém na mão hoje.` }
        ],
        POOR: [
          { key: "ht_bd1", text: `Ficou meio estranho esse clima... tomara que dê tudo certo no jogo.` },
          { key: "ht_bd2", text: `Vou fazer minha parte direitinho, mas não fiquei tão seguro não.` }
        ],
        CHIME_RAGE: [
          { key: "ht_cr1", text: `Calma galera, a gente se ajuda todo dia no treino, não vale brigar por isso.` },
          { key: "ht_cr2", text: `Bora conversar de boa, faltando pouco pra enfrentar ${opp}.` }
        ],
        CHIME_HYP: [
          { key: "ht_ch1", text: `Caramba, que daora! Se eu puder ajudar na tabela só falar!` },
          { key: "ht_ch2", text: `Tô animado pra ver vocês soltando isso no jogo!` }
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

    // Resenha / vestiário leve: NUNCA mistura tática séria ou contra-ataque fora de contexto
    if (category === "RESENHA") {
      if (kind === "CHIME") {
        const chimeResenha = {
          CAPTAIN_FIRE: [
            { key: "cr_cf1", text: `Haha esse grupo não tem jeito mesmo! Só não vale perder a hora do treino depois.` },
            { key: "cr_cf2", text: `Kkk bom demais ver todo mundo leve antes de encarar ${opp}.` }
          ],
          COLD_ACE: [
            { key: "cr_ca1", text: `Vocês não param um minuto no grupo.` },
            { key: "cr_ca2", text: `Só guardem metade desse gás pro campo.` }
          ],
          TACTICIAN: [
            { key: "cr_tc1", text: `Pelo menos o astral do vestiário tá lá em cima hoje kkk` },
            { key: "cr_tc2", text: `Vocês distraem até a comissão técnica antes de ${opp} haha` }
          ],
          HOTHEAD: [
            { key: "cr_hh1", text: `Quero só ver quem vai aguentar correr amanhã depois dessa resenha kkk` },
            { key: "cr_hh2", text: `Haha deixa o treino começar que eu quero ver a disposição de vocês!` }
          ],
          REBEL_TROLL: [
            { key: "cr_rt1", text: `kkkkk alguém salva o print disso aqui pro técnico ver depois` },
            { key: "cr_rt2", text: `Se perder bola amanhã eu já sei o motivo hein kkk` }
          ],
          DIVINE_PRIDE: [
            { key: "cr_dp1", text: `Curioso o senso de humor desse elenco às vésperas do jogo.` },
            { key: "cr_dp2", text: `Ao menos a confiança do vestiário está intacta antes de ${opp}.` }
          ],
          CHILL_JOKER: [
            { key: "cr_cj1", text: `Kkkk já cheguei no grupo rindo! Tem mais história boa aí?` },
            { key: "cr_cj2", text: `Olha, eu não julgo não kkk depois do treino eu também capricho no lanche!` }
          ],
          STOIC_WALL: [
            { key: "cr_sw1", text: `Haha só cuidado pra não pesar no aquecimento amanhã cedo.` },
            { key: "cr_sw2", text: `Tudo bem dar uma relaxada, só não deixem cair o ritmo depois.` }
          ],
          SPEED_SPARK: [
            { key: "cr_ss1", text: `kkkk ainda bem que eu queimo tudo no primeiro pique do treino!` },
            { key: "cr_ss2", text: `Esse chat rende demais todo dia antes dos jogos!` }
          ],
          HEART_TEAM: [
            { key: "cr_ht1", text: `Haha adoro quando o grupo fica leve assim antes de entrar em campo!` },
            { key: "cr_ht2", text: `Faz bem dar uma risada junto pra quebrar a pressão antes de ${opp}.` }
          ]
        };
        return chimeResenha[voice] || chimeResenha.HEART_TEAM;
      }

      const wrapResenha = {
        GREAT: {
          CAPTAIN_FIRE: [
            { key: "wr_g_cf1", text: `Haha boa, professor!! Vestiário leve desse jeito joga muito mais solto!` },
            { key: "wr_g_cf2", text: `Aeee! Amanhã contra ${opp} a gente entrega o dobro dentro de campo!` }
          ],
          COLD_ACE: [
            { key: "wr_g_ca1", text: `Se render em campo amanhã, tá valendo.` },
            { key: "wr_g_ca2", text: `Só não relaxem demais antes de ${opp}.` }
          ],
          REBEL_TROLL: [
            { key: "wr_g_rt1", text: `Aí sim professor kkk sabia que ia entrar na resenha!` },
            { key: "wr_g_rt2", text: `Fechado, agora tá devendo uma assistência pra turma hein kkk` }
          ],
          CHILL_JOKER: [
            { key: "wr_g_cj1", text: `Aeee!! Melhor técnico possível kkk vou dormir feliz hoje!` },
            { key: "wr_g_cj2", text: `Isso sim levanta a moral do grupo inteiro!!` }
          ],
          DEFAULT: [
            { key: "wr_g_df1", text: `Combinado, professor! O clima no grupo ficou leve demais agora!` },
            { key: "wr_g_df2", text: `Haha fechou! Amanhã contra ${opp} todo mundo entra voando.` },
            { key: "wr_g_df3", text: `Merecido depois dos treinos dessa semana!` }
          ]
        },
        GOOD: {
          COLD_ACE: [
            { key: "wr_ok_ca1", text: `Justo. Hora de descansar pro jogo.` },
            { key: "wr_ok_ca2", text: `Certo. Foco amanhã.` }
          ],
          REBEL_TROLL: [
            { key: "wr_ok_rt1", text: `Beleza professor, tá bom até demais kkk` },
            { key: "wr_ok_rt2", text: `Recado dado hein galera, sem exagero hoje!` }
          ],
          CHILL_JOKER: [
            { key: "wr_ok_cj1", text: `Tranquilo! Já tá de bom tamanho pro nosso grupo kkk` },
            { key: "wr_ok_cj2", text: `Fechado chefia! Agora sim partiu descanso.` }
          ],
          DEFAULT: [
            { key: "wr_ok_df1", text: `Tudo certo então! Deu pra dar boas risadas e manter a cabeça no jogo.` },
            { key: "wr_ok_df2", text: `Combinado! Amanhã cedo estamos inteiros pro aquecimento.` },
            { key: "wr_ok_df3", text: `Boa, professor! Equilíbrio certinho no vestiário.` }
          ]
        },
        TRADEOFF: {
          DEFAULT: [
            { key: "wr_tr_df1", text: `Justo, professor! Deu uma segurada boa sem perder o foco contra ${opp}.` },
            { key: "wr_tr_df2", text: `Anotado! Cada um sabe o limite antes de decisão.` },
            { key: "wr_tr_df3", text: `Combinado, bora fechar a noite tranquilos!` }
          ]
        },
        POOR: {
          CHILL_JOKER: [
            { key: "wr_bd_cj1", text: `Poxa, achei que ia levar mais na esportiva kkk bora dormir logo então.` },
            { key: "wr_bd_cj2", text: `Eita, clima fechou do nada kkk vou até desligar o celular.` }
          ],
          REBEL_TROLL: [
            { key: "wr_bd_rt1", text: `Vish, zero humor hoje hein professor kkk fui!` },
            { key: "wr_bd_rt2", text: `Ok ok, clima de quartel ativado.` }
          ],
          DEFAULT: [
            { key: "wr_bd_df1", text: `Entendido... acabou a resenha por hoje então, galera.` },
            { key: "wr_bd_df2", text: `Ficou meio pesado o papo, mas amanhã a gente responde em campo.` },
            { key: "wr_bd_df3", text: `Certo, técnico. Todo mundo focado amanhã.` }
          ]
        }
      };
      const qKey = quality === "GREAT" || quality === "GOOD" || quality === "TRADEOFF" ? quality : "POOR";
      return wrapResenha[qKey][voice] || wrapResenha[qKey].DEFAULT;
    }

    // Estudo do Rival: chime-ins táticos coerentes
    if (category === "TATICA_RIVAL" && kind === "CHIME") {
      const chimeTat = {
        TACTICIAN: [
          { key: "ct_tc1", text: `Concordo com a leitura. Contra ${opp}, quem dominar o meio controla o placar.` },
          { key: "ct_tc2", text: `Se a transição deles aperta pelos lados, ajustar o tempo do passe já resolve metade.` }
        ],
        COLD_ACE: [
          { key: "ct_ca1", text: `Só me digam onde querem que eu ataque contra ${opp}.` },
          { key: "ct_ca2", text: `Se abrir espaço na área deles eu resolvo.` }
        ],
        CAPTAIN_FIRE: [
          { key: "ct_cf1", text: `Boa visão! Se o time todo se ajudar na recomposição, ${opp} não passa!` },
          { key: "ct_cf2", text: `Tamo ligado nesse detalhe! Só dar o comando que a gente aplica.` }
        ],
        STOIC_WALL: [
          { key: "ct_sw1", text: `Do meu setor também dá pra fechar esse corredor de ${opp}.` },
          { key: "ct_sw2", text: `Se combinarmos a cobertura atrás, ninguém entra livre.` }
        ],
        SPEED_SPARK: [
          { key: "ct_ss1", text: `Se der brecha nas costas da linha de ${opp}, eu chego primeiro nessa bola!` },
          { key: "ct_ss2", text: `Só me acionarem rápido quando roubarmos no meio.` }
        ],
        DEFAULT: [
          { key: "ct_df1", text: `Faz sentido olhar esse ponto de ${opp} agora antes do aquecimento.` },
          { key: "ct_df2", text: `Tô acompanhando aqui! O que o técnico definir a gente executa certinho.` }
        ]
      };
      return chimeTat[voice] || chimeTat.DEFAULT;
    }

    // Wrap-up específico por categoria quando há ajuste tático ou técnica combinada
    if (kind === "WRAP" && coop && (quality === "GREAT" || quality === "GOOD")) {
      const targetReaction =
        coopCat === "DF" || coopCat === "GK"
          ? `Quero ver o ataque de ${opp} passar por essa barreira!`
          : coopCat === "OF"
          ? `A marcação de ${opp} vai ficar perdida com esse giro!`
          : `O goleiro de ${opp} não segura isso nunca!`;
      const coopLines = {
        CAPTAIN_FIRE: [{ key: "wc_cf", text: `A ${coop} encaixou bonito demais!! Quero soltar ela logo contra ${opp}!` }],
        COLD_ACE: [{ key: "wc_ca", text: `A ${coop} ficou limpa. Só chamar na hora certa.` }],
        TACTICIAN: [{ key: "wc_tc", text: `O timing da ${coop} ficou perfeito pra surpreender ${opp}.` }],
        HOTHEAD: [{ key: "wc_hh", text: `A ${coop} tá braba demais!! ${targetReaction}` }],
        REBEL_TROLL: [{ key: "wc_rt", text: `Imagina a cara do time de ${opp} levando uma ${coop} do nada kkk` }],
        DEFAULT: [{ key: "wc_df", text: `Incrível termos fechado a ${coop}! Vai ser arma pesada contra ${opp}!` }]
      };
      return coopLines[voice] || coopLines.DEFAULT;
    }

    if (kind === "WRAP" && tac && (quality === "GREAT" || quality === "GOOD" || quality === "TRADEOFF")) {
      const tacLines = {
        TACTICIAN: [{ key: "wt_tc", text: `Anotado, vamos com ${tac}. Isso encaixa certinho pra enfrentar ${opp}.` }],
        STOIC_WALL: [{ key: "wt_sw", text: `Beleza, fechou na ${tac}. Já me preparo com o setor todo.` }],
        COLD_ACE: [{ key: "wt_ca", text: `Certo, apostamos na ${tac}. Foco em campo.` }],
        CAPTAIN_FIRE: [{ key: "wt_cf", text: `Fechou na ${tac}!! Agora é executar com garra contra ${opp}!` }],
        REBEL_TROLL: [{ key: "wt_rt", text: `Olha, apostar na ${tac} contra ${opp} pode render demais kkk.` }],
        CHILL_JOKER: [{ key: "wt_cj", text: `Demorou professor, vamos de ${tac} e já era!` }],
        DEFAULT: [{ key: "wt_df", text: `Combinado na ${tac}! Todo mundo na mesma página pro próximo jogo.` }]
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
      const bank = getPersonaReplyBank(persona.voice, {
        actor,
        oppName: opp,
        sigMove: actor.sigMove || actor.shMove || "minha técnica",
        sigMoveCat: actor.sigMoveCat,
        otherName: shortFirstName(otherActor)
      });

      let chosenPool = getCategoryCoherentPool("CHIME", category, persona.voice, "GOOD", { oppName: opp });
      let tone = "normal";
      if (category === "RAIVA") {
        chosenPool = bank.CHIME_RAGE || bank.TRADEOFF;
        tone = persona.voice === "REBEL_TROLL" ? "normal" : "tense";
      } else if (category === "CRIAR_TECNICA") {
        chosenPool = bank.CHIME_HYP || bank.GREAT;
        tone = "idea";
      } else if (category === "ELOGIO") {
        chosenPool = bank.GREAT;
        tone = "hype";
      } else if (category === "TATICA_RIVAL") {
        tone = persona.voice === "TACTICIAN" ? "idea" : "normal";
      } else if (category === "RESENHA") {
        tone = persona.voice === "CHILL_JOKER" || persona.voice === "REBEL_TROLL" ? "hype" : "normal";
      }

      const poolArr = chosenPool || bank.GOOD;
      const picked = pickFreshWeighted(t, poolArr, threadUsedTexts);
      const rawLine = picked?.text || `Tamo junto nessa contra ${opp}, ${shortFirstName(otherActor)}!`;
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

      const fallbackPool = bank[qBucket] || bank.GOOD || [];
      const mergedPool = catPool ? [...catPool, ...fallbackPool] : fallbackPool;
      const unusedInThread = mergedPool.filter((item) => item?.text && !usedLineTexts.has(String(item.text).trim().toLowerCase()));
      if (unusedInThread.length === 0) continue;
      const picked = pickFreshWeighted(t, unusedInThread, usedLineTexts);
      const msgText = picked?.text || `Fechado então, professor! Bora encarar ${opp}, ${shortFirstName(partner)}!`;
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

  function generateProceduralBetaChat(t, actors = [], ctx = {}, forcedKind = null, opts = {}) {
    if (!Array.isArray(actors) || actors.length < 2) return null;
    const opp = ctx.oppName || "o adversário";
    const teamChem = Number(ctx.teamChem) || 45;
    const squadObj = typeof state !== "undefined" && state?.squad ? state.squad : {};
    const findReal = (actor) => Object.values(squadObj).find((p) => p && p.id === actor?.id) || null;
    const pickOther = (excludeIds, pred = null) => {
      const ex = new Set(excludeIds.filter(Boolean));
      const cands = actors.filter((a) => !ex.has(a.id) && (!pred || pred(a)));
      if (cands.length > 0) return cands[Math.floor(Math.random() * cands.length)];
      return actors.find((a) => !ex.has(a.id)) || actors[1] || actors[0];
    };
    const shuffleChoices = (arr) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const kindsPool = [
      "QUEST_LEARN_MOVE",
      "QUEST_AWAKEN_KESHIN",
      "PROC_FORMATION_DEBATE",
      "PROC_RIVAL_COUNTERPLAN",
      "PROC_MOVE_SPAR",
      "PROC_GK_DF_SYNC",
      "PROC_LOCKER_BANTER"
    ];
    let kind = forcedKind;
    if (!kind) {
      const candidates = [...kindsPool];
      const eligibleKeshin = actors.some((a) => {
        const rp = findReal(a);
        return rp && !rp.keshin && a.role !== "GK";
      });
      if (!eligibleKeshin) {
        const idxK = candidates.indexOf("QUEST_AWAKEN_KESHIN");
        if (idxK >= 0) candidates.splice(idxK, 1);
      }
      kind = candidates[Math.floor(Math.random() * candidates.length)];
    }

    const baseResult = (meta) => {
      const extraActors = actors.filter((a) => !meta.coreActors.some((c) => c.id === a.id)).slice(0, 2);
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
      const hero = actors.find((a) => a.id === bt.playerId) || actors[0];
      const cap = pickOther([hero.id], (a) => a.isCaptain || resolveInazumaPersona(a).voice === "CAPTAIN_FIRE");
      const tact = pickOther([hero.id, cap.id], (a) => resolveInazumaPersona(a).voice === "TACTICIAN");
      const core = [hero, cap, tact].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      if (core.length < 2) return null;
      const isKeshin = bt.kind === "AWAKEN_KESHIN";
      const msgs = [
        makeProcMsg(core, 0, isKeshin
          ? `Cara, ainda tô sentindo a energia da ${bt.name} no corpo!! Quando entrou aquela bola parecia outro nível!`
          : `Galera, viram na hora do jogo?! A ${bt.name} finalmente saiu limpa quando eu mais precisava!`, "hype"),
        makeProcMsg(core, 1, isKeshin
          ? `Arrepiou o estádio todo, ${shortFirstName(hero)}!! Todo mundo sentiu o peso da tua aura naquele lance!`
          : `Baita evolução, ${shortFirstName(hero)}!! Agora já chega contra ${opp} com arma nova no pé!`, "praise", { quote: { speakerName: core[0].name, text: "saiu" } }),
        ...(core[2] ? [makeProcMsg(core, 2, `Contra ${opp}, se a gente encaixar a ${bt.name} no segundo tempo vai pegar eles de surpresa total.`, "idea")] : [])
      ];
      const choices = shuffleChoices([
        {
          label: `Construir o plano contra ${opp} em volta da nova força do ${hero.name}!`,
          approachTag: "Valorizar Despertar",
          quality: "GREAT",
          tacticsPatch: hero.role === "DF" || hero.role === "GK" ? { posture: "balanced" } : { aceActorIdx: 0 },
          coachLine: `O mérito é todo do teu treino, ${shortFirstName(hero)}! Contra ${opp} a gente vai explorar a ${bt.name} no momento decisivo.`,
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

    // 2. Pós-jogo: Jogador fominha / segurou bola ignorando colega livre
    if (kind === "POST_MATCH_BALL_HOG") {
      const inc = ctx.ballHogIncident || ctx.lastMatch?.ballHogIncident;
      if (!inc) return null;
      const hog = actors.find((a) => a.id === inc.hogId) || actors[0];
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
        ...(core[2] ? [makeProcMsg(core, 2, `Gente, acertei aqui fora antes que vire bola de neve contra ${opp}. Técnico, qual é a regra ali na área?`, "calm")] : [])
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

    // 3. Plot da Cidade: Treta Aberta pedindo acerto no mapa da cidade
    if (kind === "PLOT_FEUD_ESCALATION") {
      const plot = ctx.plot || (Array.isArray(t?.activeCityPlots) ? t.activeCityPlots.find((pl) => !pl.resolved) : null);
      if (!plot) return null;
      const a0 = actors.find((a) => a.id === plot.aId) || actors[0];
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
            makeProcMsg(core, 1, `Fechado então. Vamos ver no ${locName}.`, "calm")
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

    // 4. Desfecho celebrando reconciliação após ação na cidade
    if (kind === "CITY_PLOT_RESOLVED") {
      const plot = ctx.plot;
      if (!plot) return null;
      const a0 = actors.find((a) => a.id === plot.aId) || actors[0];
      const a1 = actors.find((a) => a.id === plot.bId && a.id !== a0.id) || pickOther([a0.id]);
      const cap = pickOther([a0.id, a1.id], (a) => a.isCaptain);
      const core = [a0, a1, cap].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const msgs = [
        makeProcMsg(core, 0, `Valeu por levar a gente em ${plot.locLabel}, professor! Deu pra zerar aquela treta com o ${shortFirstName(a1)}.`, "hype"),
        makeProcMsg(core, 1, `Pois é, jogamos limpo e acabou o climão. Agora contra ${opp} pode contar com nossa tabela!`, "hype"),
        ...(core[2] ? [makeProcMsg(core, 2, `Aeeee!! Agora sim esse vestiário tá com cara de campeão!!`, "praise")] : [])
      ];
      return baseResult({
        id: "proc_city_resolved",
        contextTrigger: "CITY_PLOT_RESOLVED",
        category: "ELOGIO",
        categoryLabel: "Reconciliação",
        categoryIcon: "🤝",
        badgeClass: "cat-chem",
        interactionMode: "AUTO_COMPLETE",
        title: `Pazes em ${plot.locLabel}`,
        coreActors: core,
        messages: msgs,
        choices: [],
        autoOutcome: {
          kind: "CHEMISTRY_BOND",
          headline: `✨ ${shortFirstName(a0)} e ${shortFirstName(a1)} selaram as pazes em ${plot.locLabel}!`,
          affPts: 8,
          chemDelta: 1,
          setArc: "RECONCILIADOS",
          respectDelta: 2
        }
      });
    }

    // 5. Quest: Jogador tentando aprender uma nova técnica (desperta no jogo!)
    if (kind === "QUEST_LEARN_MOVE") {
      const learner = actors.find((a) => a.role !== "GK" && (a.archetype !== "EGO_STRIKER" || Math.random() < 0.7)) || actors[0];
      const partner = pickOther([learner.id], (a) => a.role !== "GK");
      const med = pickOther([learner.id, partner.id], (a) => a.isCaptain || resolveInazumaPersona(a).voice === "TACTICIAN");
      const core = [learner, partner, med].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const realLearner = findReal(learner);
      const mvPick = pickFreshLearnableMoveForActor(learner, realLearner);
      const verb = mvPick.cat === "SH" ? "soltar um chute absurdo com" : mvPick.cat === "OF" ? "cortar qualquer marcador com" : mvPick.cat === "DF" ? "fechar a área inteira com" : "defender até pensamento com";
      const msgs = [
        makeProcMsg(core, 0, `Professor, tô treinando escondido faz dois dias pra conseguir ${verb} a ${mvPick.moveName}! Só falta confiança pra tentar no jogo!`, "idea"),
        makeProcMsg(core, 1, `Eu vi ele ficando depois do horário! Se encaixar a ${mvPick.moveName} contra ${opp}, vai levantar a arquibancada!`, "hype"),
        ...(core[2] ? [makeProcMsg(core, 2, `Deixa o técnico aprovar o desafio que a gente te dá cobertura em campo pra soltar!`, "calm")] : [])
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
          coachLine: `Pode ir pra cima sem medo contra ${opp}! Na primeira oportunidade em campo, solta a ${mvPick.moveName} que o grupo garante!`,
          customEffects: { affPts: 14, xpAmt: 20, buffType: "COOP_SYNC", note: `Missão ativa: ${shortFirstName(learner)} despertará ${mvPick.moveName} em campo` },
          reactions: [
            makeProcMsg(core, 0, `Sério?! Valeu demais pela confiança!! Em campo eu faço a ${mvPick.moveName} acontecer!`, "hype"),
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

    // 6. Quest: Jogador sem Keshin sentindo despertar de Espírito Guerreiro!
    if (kind === "QUEST_AWAKEN_KESHIN") {
      const cand = actors.find((a) => {
        const rp = findReal(a);
        return rp && !rp.keshin && a.role !== "GK";
      }) || actors.find((a) => {
        const rp = findReal(a);
        return rp && !rp.keshin;
      });
      if (!cand) return generateProceduralBetaChat(t, actors, ctx, "QUEST_LEARN_MOVE", opts);
      const partner = pickOther([cand.id]);
      const cap = pickOther([cand.id, partner.id], (a) => a.isCaptain);
      const core = [cand, partner, cap].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const usedKeshins = new Set(
        Object.values(squadObj).map((p) => p?.keshin?.name).filter(Boolean)
      );
      const keshin = resolvePlayerLatentKeshin(cand, findReal(cand), usedKeshins);
      const msgs = [
        makeProcMsg(core, 0, `Treinador, estranho falar isso, mas toda vez que divido bola forte sinto uma pressão quente nas costas... acho que o ${keshin.name} tá quase despertando!`, "idea"),
        makeProcMsg(core, 1, `Caramba, eu também senti a energia subir no último treino do ${shortFirstName(cand)}!`, "hype"),
        ...(core[2] ? [makeProcMsg(core, 2, `Se você invocar um Espírito Guerreiro no meio do jogo contra ${opp}, o estádio inteiro vai tremer!`, "hype")] : [])
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
            makeProcMsg(core, 0, `Pode deixar!! Contra ${opp} eu vou romper esse limite e trazer o ${keshin.name} pro jogo!`, "hype"),
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

    // 7. Debate orgânico de Formação (abre botão "Ajustar Formação e Escalação" no chat!)
    if (kind === "PROC_FORMATION_DEBATE") {
      const curForm = typeof state !== "undefined" && state.formation ? state.formation : "4-3-3";
      const allForms = typeof DB === "object" && DB?.formations ? Object.keys(DB.formations) : ["4-3-3", "4-4-2", "3-4-3", "3-5-2"];
      const alts = allForms.filter((f) => f !== curForm);
      const targetForm = alts[Math.floor(Math.random() * alts.length)] || "3-5-2";
      const tact = actors.find((a) => resolveInazumaPersona(a).voice === "TACTICIAN") || actors[0];
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
        makeProcMsg(core, 0, `Professor, olhando pro jeito que ${opp} joga, o nosso ${curForm} pode sofrer espaço. Acho que mudar pro ${targetForm} ia ajudar demais pra ${formReason}!`, "idea"),
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
            makeProcMsg(core, 0, `Boa!! Com a ${targetForm} encaixada, o meio de ${opp} vai ficar sem saída.`, "hype"),
            makeProcMsg(core, 1, `Tô pronto já! Só encaixar os nomes na formação e partir pro campo.`, "hype")
          ]
        },
        {
          label: `Manter a ${curForm} por entrosamento, mas ajustar a movimentação pelas pontas`,
          approachTag: `Manter ${curForm}`,
          quality: "GOOD",
          tacticsPatch: { lane: "wings" },
          coachLine: `O grupo já conhece a ${curForm} de cor. Vamos manter o desenho e abrir mais pelas pontas pra quebrar a marcação.`,
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

    // 8. Resenha / duelo amistoso de técnicas (100% coerente com sigMoveCat!)
    if (kind === "PROC_MOVE_SPAR") {
      const a0 = actors.find((a) => a.hasRealShMove || a.hasRealOfMove || a.hasRealDfMove) || actors[0];
      const a1 = pickOther([a0.id]);
      const a2 = pickOther([a0.id, a1.id], (a) => resolveInazumaPersona(a).voice === "CHILL_JOKER" || resolveInazumaPersona(a).voice === "REBEL_TROLL");
      const core = [a0, a1, a2].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const d0 = describeActorMoveAction(a0, { oppName: opp });
      const d1 = describeActorMoveAction(a1, { oppName: opp });
      const msgs = [
        makeProcMsg(core, 0, `Bora apostar no treino de hoje, ${shortFirstName(a1)}? Quero ver se você acompanha o ritmo da minha ${d0.move}!`, "banter"),
        makeProcMsg(core, 1, `Haha fechou demais! ${d1.breakLine} Aposto o suco de depois do treino!`, "hype")
      ];
      const choices = shuffleChoices([
        {
          label: "Incentivar o desafio saudável e marcar um mini-treino de duelos!",
          approachTag: "Competição Boa",
          quality: "GREAT",
          coachLine: `Gostei de ver essa fome de bola! Podem apostar o desafio no treino, só lembrem de levar essa pegada contra ${opp}.`,
          customEffects: { affPts: 18, xpAmt: 28, buffType: "MORALE_BOOST" },
          reactions: [
            makeProcMsg(core, 0, `Agora ficou oficial hein ${shortFirstName(a1)}, quero ver pagar o suco depois kkk`, "hype"),
            makeProcMsg(core, 1, `Pode preparar a carteira porque hoje eu tô voando!`, "hype")
          ]
        },
        {
          label: "Elogiar o foco, mas pedir cuidado pra ninguém se machucar na dividida",
          approachTag: "Cuidado Físico",
          quality: "GOOD",
          coachLine: `Competitividade lá em cima é ótimo, só dosam a força na dividida pra chegarmos inteiros contra ${opp}.`,
          customEffects: { energyDelta: 3, affPts: 10 },
          reactions: [
            makeProcMsg(core, 0, `Pode deixar professor, vai ser na técnica pura!`, "calm")
          ]
        }
      ]);
      return baseResult({
        id: "proc_move_spar",
        category: "RESENHA",
        categoryLabel: "Desafio no Treino",
        categoryIcon: "⚡",
        badgeClass: "cat-banter",
        title: `Duelo: ${shortFirstName(a0)} × ${shortFirstName(a1)}`,
        coreActors: core,
        messages: msgs,
        choices
      });
    }

    // 9. Sintonia Goleiro & Zaga
    if (kind === "PROC_GK_DF_SYNC") {
      const gk = actors.find((a) => a.role === "GK") || actors[0];
      const df = pickOther([gk.id], (a) => a.role === "DF");
      const cap = pickOther([gk.id, df.id], (a) => a.isCaptain);
      const core = [gk, df, cap].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const star = ctx.rivalStar?.name || `o camisa 10 de ${opp}`;
      const msgs = [
        makeProcMsg(core, 0, `${shortFirstName(df)}, hoje no coletivo repara no tempo da saída contra ${star}: se fechar o ângulo do chute cruzado eu pego na ${gk.gkMove || gk.sigMove}.`, "idea"),
        makeProcMsg(core, 1, `Fechado demais! Quando eles avançarem pelo meio eu já fecho o chute com a ${df.dfMove || df.sigMove} pro seu lado.`, "calm")
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

    // 10. Plano contra estrela rival
    if (kind === "PROC_RIVAL_COUNTERPLAN") {
      const tact = actors.find((a) => resolveInazumaPersona(a).voice === "TACTICIAN" || a.role === "MF") || actors[0];
      const fw = pickOther([tact.id], (a) => a.role === "FW");
      const med = pickOther([tact.id, fw.id]);
      const core = [tact, fw, med].filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i);
      const star = ctx.rivalStar?.name || `o craque de ${opp}`;
      const msgs = [
        makeProcMsg(core, 0, `Revendo o último jogo de ${opp}, quase toda jogada perigosa passa pelos pés de ${star}. Se a gente cortar essa linha de passe, eles travam.`, "idea"),
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

    // 11. Resenha leve aleatória de vestiário (comida, música, superstição)
    const joker = actors.find((a) => {
      const v = resolveInazumaPersona(a).voice;
      return v === "CHILL_JOKER" || v === "REBEL_TROLL";
    }) || actors[0];
    const buddy = pickOther([joker.id]);
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
        m1: `Foi mal kkk achei que ia ajudar o pessoal a respirar fundo antes do aquecimento!`,
        c0: `Cada jogo pede um clima diferente, então soltem um som animado aí pra acordar a perna antes do apito!`,
        goodLine: `Vestiário vivo desse jeito dá prazer de treinar!`,
        chemLine: `Equilíbrio entre concentração e alegria é o ponto certo desse time.`
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

    const isWinning = uScore > oScore;
    const isLosing = uScore < oScore;

    const bubbles = isLosing
      ? [
          {
            name: cap.p.name,
            roleLabel: "Capitão",
            sprite: spriteFor(cap),
            tone: "tense",
            text: `O placar em ${uScore} x ${oScore} ainda dá pra virar fácil contra ${oppName}! Só falta a gente ajustar a pegada pro 2º tempo!`
          },
          {
            name: voice2.p.name,
            roleLabel: voice2.slot.role,
            sprite: spriteFor(voice2),
            tone: "normal",
            text: `Eles deram espaço quando subimos a linha. Professor, qual a ordem pra segunda etapa?`
          }
        ]
      : isWinning
      ? [
          {
            name: gk.p.name,
            roleLabel: gk.slot.role,
            sprite: spriteFor(gk),
            tone: "hype",
            text: `Boa vantagem nesse ${uScore} x ${oScore}! Agora é manter a cabeça no lugar porque ${oppName} vai vir com tudo no 2º tempo.`
          },
          {
            name: voice2.p.name,
            roleLabel: voice2.slot.role,
            sprite: spriteFor(voice2),
            tone: "hype",
            text: `Se encaixarmos o contragolpe certo dá pra matar o jogo rápido!`
          }
        ]
      : [
          {
            name: cap.p.name,
            roleLabel: "Capitão",
            sprite: spriteFor(cap),
            tone: "normal",
            text: `Primeiro tempo pegado nesse ${uScore} x ${oScore} contra ${oppName}! Tá na mão da gente decidir nos últimos 45 minutos.`
          },
          {
            name: voice2.p.name,
            roleLabel: voice2.slot.role,
            sprite: spriteFor(voice2),
            tone: "normal",
            text: `Só diz onde a gente aperta mais agora na volta do intervalo, professor.`
          }
        ];

    const choices = [
      {
        key: "FIRE",
        title: "🔥 Ataque Total",
        subtitle: "+Chute/Ataque • -4% Fôlego",
        coachText: `Quero pressão lá na frente desde o primeiro segundo do 2º tempo! Sem medo contra ${oppName}!`,
        playerReact: `${cap.p.name}: Boraaa!! Todo mundo mordendo na área deles agora!`
      },
      {
        key: "CALM",
        title: "🧠 Cabeça Fria",
        subtitle: "+Drible & Meio-Campo",
        coachText: `Respirem fundo! Quero posse limpa no meio e passes conscientes até abrir a defesa de ${oppName}.`,
        playerReact: `${voice2.p.name}: Perfeito, vamos controlar o tempo da bola e achar os espaços.`
      },
      {
        key: "WALL",
        title: "🛡️ Muralha Fechada",
        subtitle: "+Defesa & Goleiro",
        coachText: `Linhas compactas atrás! Primeiro fechamos todos os espaços pro ${shortFirstName(gk.p.name)}, depois saímos limpos.`,
        playerReact: `${gk.p.name}: Fechado! Da minha área não passa nem vento no 2º tempo.`
      }
    ];

    return { bubbles, choices };
  }

  const g = typeof window !== "undefined" ? window : globalThis;
  g.resolveInazumaPersona = resolveInazumaPersona;
  g.humanizeInaZapText = humanizeInaZapText;
  g.humanizeTacticalChangeForChat = humanizeTacticalChangeForChat;
  g.describeActorMoveAction = describeActorMoveAction;
  g.buildDynamicGroupChimeIns = buildDynamicGroupChimeIns;
  g.buildDynamicSilentResolution = buildDynamicSilentResolution;
  g.buildDynamicPostDecisionWrapUp = buildDynamicPostDecisionWrapUp;
  g.attachDynamicEmojiReactions = attachDynamicEmojiReactions;
  g.generateProceduralBetaChat = generateProceduralBetaChat;
  g.buildHalftimeLockerTalk = buildHalftimeLockerTalk;
})();
