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

  function pickFreshWeighted(t, pool = []) {
    if (!Array.isArray(pool) || pool.length === 0) return null;
    const store = t && typeof t === "object" ? t : null;
    const history = store && Array.isArray(store._usedInaZapLineKeys) ? store._usedInaZapLineKeys : [];
    const recentSet = new Set(history.slice(-55));
    let candidates = pool.filter((item) => item && item.key && !recentSet.has(item.key));
    if (candidates.length === 0) {
      const shorterSet = new Set(history.slice(-18));
      candidates = pool.filter((item) => item && item.key && !shorterSet.has(item.key));
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
    const tac = ctx.tacText || "";
    const coopMove = ctx.coopMove || "";

    const banks = {
      CAPTAIN_FIRE: {
        GREAT: [
          { key: "cf_g1", text: `É isso aí, professor!! Com o time fechado assim ninguém segura a gente contra ${opp}!` },
          { key: "cf_g2", text: `Boraaa! Essa energia no grupo já me deu pilha pra treinar mais duas horas!`, extra: `Se passar pelo meio eu chego junto com a ${move}!` },
          { key: "cf_g3", text: tac ? `Curti demais esse ajuste (${tac})! Bora entrar mordendo desde o primeiro minuto!` : `Tô arrepiado já, sério. Bora fazer valer cada gota de suor contra ${opp}!` },
          { key: "cf_g4", text: `Futebol é isso aqui, ${other}! Quando todo mundo olha pro mesmo lado sai jogada gigante!` }
        ],
        GOOD: [
          { key: "cf_ok1", text: tac ? `Fechou no ${tac}! Todo mundo ajudando na marcação fica bem mais leve!` : `Boa, professor! Se a gente correr um pelo outro já muda a cara do jogo.` },
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
          { key: "ca_g2", text: tac ? `Bom ajuste (${tac}). Agora para de falar e mostra contra ${opp}.` : `Certo. Só façam a parte de vocês que eu resolvo na frente.` },
          { key: "ca_g3", text: `Pronto. Se der espaço pra ${move}, o goleiro deles nem vê a cor da bola.` },
          { key: "ca_g4", text: `${other}, mantém o olho na minha corrida. Um segundo basta.` }
        ],
        GOOD: [
          { key: "ca_ok1", text: `Certo. Faz sentido pra cima de ${opp}.` },
          { key: "ca_ok2", text: `Ok. Foca no treino que eu tô pronto.` },
          { key: "ca_ok3", text: `Beleza, menos conversa e mais jogo.` }
        ],
        TRADEOFF: [
          { key: "ca_tr1", text: `Tem custo, mas funciona. Eu banco lá na frente.` },
          { key: "ca_tr2", text: tac ? `Aceito o risco do ${tac}. Só não vacilem na saída.` : `Tanto faz o desgaste. O que importa é vencer ${opp}.` }
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
          { key: "tc_g2", text: `${other}, se você puxar um marcador quando eu preparar a ${move}, a linha deles quebra inteira.` },
          { key: "tc_g3", text: `Perfeito. Já até marquei onde costuma sobrar o rebote contra o esquema deles.` }
        ],
        GOOD: [
          { key: "tc_ok1", text: `Faz bastante sentido. Dá pra controlar o ritmo sem se expor.` },
          { key: "tc_ok2", text: tac ? `Anotado o ${tac}. Só precisamos sincronizar a distância entre linhas.` : `Certo, vou ajustar a leitura de passe pensando nisso.` },
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
          { key: "hh_g2", text: `Quero ver a zaga deles aguentar minha ${move} depois dessa conversa!` },
          { key: "hh_g3", text: tac ? `Esse ${tac} ficou brabo demais!! Bora atropelar!` : `É disso que eu tô falando! Agora ninguém tira o olho da bola!` }
        ],
        GOOD: [
          { key: "hh_ok1", text: `Beleza, fechou! Só quero a bola chegando quente lá na frente.` },
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
          { key: "hh_ch1", text: `Tô dentro!! Me coloca nessa jogada que eu chuto até rasgar a rede!` },
          { key: "hh_ch2", text: `Quero ver se essa técnica segura o tranco da minha ${move}!` }
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
          { key: "rt_ch1", text: `Se vocês errarem esse passe novo eu vou zoar a semana inteira kkk` },
          { key: "rt_ch2", text: `Até que ficou sinistro hein. Quero testar pra cima do goleiro deles.` }
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
          { key: "dp_ok2", text: `Muito bem, ${other}. Só capriche no último passe e o resto flui.` }
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
          { key: "cj_ch1", text: `Eitaa! Só toma cuidado pra não derrubar eu no meio do giro desse golpe kkk` },
          { key: "cj_ch2", text: `Maneiro demais!! Quero ver a cara do time de ${opp} vendo isso.` }
        ]
      },

      STOIC_WALL: {
        GREAT: [
          { key: "sw_g1", text: `Podem avançar tranquilos contra ${opp}. Com a minha ${move}, a meta tá fechada hoje.` },
          { key: "sw_g2", text: tac ? `Excelente, professor. Esse ${tac} protege exatamente onde ${opp} costuma forçar.` : `Confiança lá em cima. Se fecharmos os espaços atrás, a bola lá na frente entra.` },
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
          { key: "ss_g2", text: `Curti demais!! Já tô imaginando a velocidade que a gente vai pegar com a ${move}!` },
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

  function buildDynamicGroupChimeIns(participants, coreCount, category, interactionMode, ctx = {}, t = (typeof state !== "undefined" ? state.tournament : null)) {
    const out = [];
    if (!Array.isArray(participants) || participants.length <= coreCount) return out;
    const opp = ctx.oppName || "o próximo time";
    const a0 = participants[0] || { name: "Parceiro" };
    const a1 = participants[1] || a0;

    for (let idx = coreCount; idx < participants.length; idx++) {
      if (idx === coreCount + 1 && interactionMode !== "AUTO_COMPLETE" && Math.random() > 0.76) continue;
      if (idx >= coreCount + 2 && interactionMode !== "AUTO_COMPLETE") continue;

      const actor = participants[idx];
      if (!actor) continue;
      const persona = resolveInazumaPersona(actor);
      const otherActor = idx % 2 === 0 ? a0 : a1;
      const bank = getPersonaReplyBank(persona.voice, {
        oppName: opp,
        sigMove: actor.sigMove || actor.shMove || "minha técnica",
        otherName: shortFirstName(otherActor)
      });

      let chosenPool = null;
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
        chosenPool = bank.GOOD;
        tone = persona.voice === "TACTICIAN" ? "idea" : "normal";
      } else {
        chosenPool = Math.random() < 0.5 ? bank.GREAT : bank.GOOD;
        tone = persona.voice === "CHILL_JOKER" ? "hype" : "normal";
      }

      const picked = pickFreshWeighted(t, chosenPool);
      const rawLine = picked?.text || `Tamo junto nessa contra ${opp}!`;
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
    const totalWanted = Math.random() < 0.56 ? 4 : 3;
    const needed = Math.max(0, totalWanted - existingCount);
    if (needed === 0) return out;

    const extraStart = participants.length > coreCount ? coreCount : 0;
    const pickSpeaker = (stepIdx) => {
      if (participants.length <= 2) return stepIdx % participants.length;
      if (stepIdx === 0 && extraStart > 0) return extraStart;
      if (stepIdx === 1) return Math.min(1, participants.length - 1);
      if (stepIdx === 2 && participants.length > extraStart + 1) return extraStart + 1;
      return (stepIdx + 1) % participants.length;
    };

    const qBucket = quality === "GREAT" ? "GREAT" : quality === "GOOD" ? "GOOD" : quality === "TRADEOFF" ? "TRADEOFF" : "POOR";
    const tone = quality === "GREAT" ? "hype" : quality === "GOOD" ? "calm" : quality === "TRADEOFF" ? "normal" : "tense";

    const usedLineTexts = new Set();
    for (let i = 0; i < needed; i++) {
      const spIdx = pickSpeaker(i);
      const actor = participants[spIdx] || participants[0];
      const partner = participants[(spIdx + 1) % participants.length] || actor;
      const persona = resolveInazumaPersona(actor);
      const bank = getPersonaReplyBank(persona.voice, {
        oppName: opp,
        sigMove: actor.sigMove || actor.shMove || "minha técnica",
        otherName: shortFirstName(partner),
        tacText: i === 0 ? tacText : "",
        coopMove: i === 0 || i === 1 ? coopMove : ""
      });

      const pool = (bank[qBucket] || bank.GOOD || []).filter((item) => !usedLineTexts.has(item.text));
      const picked = pickFreshWeighted(t, pool.length > 0 ? pool : (bank[qBucket] || bank.GOOD));
      let msgText = picked?.text || `Fechado então, professor! Bora encarar ${opp}!`;
      if (coopMove && i === needed - 1 && !msgText.includes(coopMove) && (quality === "GREAT" || quality === "GOOD") && Math.random() < 0.65) {
        msgText = `${msgText} E quero ver sair a ${coopMove} no jogo!!`;
      }
      usedLineTexts.add(msgText);
      out.push(mkSpontaneousMsg(participants, spIdx, msgText, tone));

      // Double-text natural (mensagem curtinha em sequência do mesmo jogador!)
      if (picked?.extra && out.length < needed + 1 && Math.random() < 0.45 && persona.voice !== "COLD_ACE") {
        out.push(mkSpontaneousMsg(participants, spIdx, picked.extra, tone));
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

  const g = typeof window !== "undefined" ? window : globalThis;
  g.resolveInazumaPersona = resolveInazumaPersona;
  g.humanizeInaZapText = humanizeInaZapText;
  g.buildDynamicGroupChimeIns = buildDynamicGroupChimeIns;
  g.buildDynamicSilentResolution = buildDynamicSilentResolution;
  g.buildDynamicPostDecisionWrapUp = buildDynamicPostDecisionWrapUp;
  g.attachDynamicEmojiReactions = attachDynamicEmojiReactions;
})();
