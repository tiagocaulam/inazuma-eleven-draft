// ============================================================================
// PREPARAÇÃO ENTRE PARTIDAS: LOCAIS DE INAZUMA + ROLETA + BOOSTS REAIS
// ============================================================================
const PREP_SVG_SUN = `<svg class="prep-inline-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4" fill="#fde047" stroke="#facc15"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="#fde047"/></svg>`;
const PREP_SVG_MOON = `<svg class="prep-inline-svg" viewBox="0 0 24 24" fill="#fef08a" stroke="#fde047" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const PREP_SVG_LOCK = `<svg class="prep-inline-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" fill="rgba(250,204,21,0.18)"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;

function prepAssetIconHTML(src, alt = "") {
  return src ? `<img class="prep-inline-asset" src="${src}" alt="${alt}" />` : "";
}

function getPrepEquippedItemContext() {
  const itemIds = new Set();
  const equippedPlayers = new Set();
  const elemCounts = {};
  Object.values(state?.squad || {}).forEach((p) => {
    if (!p) return;
    if (p.element) elemCounts[p.element] = (elemCounts[p.element] || 0) + 1;
    if (Array.isArray(p.equippedItems) && p.equippedItems.length > 0) {
      equippedPlayers.add(p.id || p.name);
      p.equippedItems.forEach((it) => {
        if (it?.id) itemIds.add(it.id);
      });
    }
  });
  return { itemIds, equippedPlayerCount: equippedPlayers.size, elemCounts };
}

function getPrepScopeLabel(ev) {
  if (!ev) return "";
  if (ev.scopeLabel) return ev.scopeLabel;
  if (ev.kind === "PASSIVE_DOUBLE_EVENT") return "Permanente • Cidade";
  if (ev.kind === "PASSIVE_LATE_RESIST") return "Permanente • 75'+";
  if (ev.kind === "STREET_5V5") return "5 Titulares";
  if (ev.kind === "ENERGY_DRINK") return "Elenco Todo";
  if (ev.kind === "REST_ACTIVE") {
    if (ev.restMode === "TACTICAL") return "Energia + Elenco";
    if (ev.restMode === "SNACK") return "Próxima Partida";
    if (ev.restMode === "BOND") return "Energia + Sintonia";
    return "Energia do Time";
  }
  if (ev.kind === "SYNERGY_PICK") return "2 ou 3 Titulares";
  if (ev.kind === "ELEM_BOOST_PICK") return "Mesmo Elemento";
  if (ev.kind === "KESHIN_PICK" || ev.kind === "EVO_PICK") return "1 Titular";
  if (ev.kind === "COLLECTIVE") {
    const roles = ev.applyRoles || [];
    if (roles.length === 1 && roles[0] === "MF") return "Todos os Meias";
    if (roles.length === 1 && roles[0] === "FW") return "Todos os Atacantes";
    if (roles.length === 2 && roles.includes("DF") && roles.includes("GK")) return "Goleiro & Zaga";
    return "Elenco Todo";
  }
  if (ev.kind === "ITEM_PICK") {
    const r = ev.targetRoles || [];
    if (r.length === 1 && r[0] === "GK") return "Goleiro";
    if (r.length === 1 && r[0] === "DF") return "1 Zagueiro";
    if (r.length === 2 && r.includes("FW") && r.includes("MF")) return "1 ATQ ou MEI";
    if (r.length === 3 && !r.includes("GK")) return "1 Jogador de Linha";
    return "1 Titular";
  }
  if (ev.kind === "SCALABLE_BUFF") {
    const map = {
      efficiencyLvl: "Na Cidade",
      restLvl: "Dormitório & Intervalo",
      recoveryLvl: "Entre Partidas",
      enduranceLvl: "Em Campo",
      wingExplosionLvl: "ATQ & MEI",
      midSynergyLvl: "Meias & Química",
      defBlockLvl: "Goleiro & Zaga",
      hissatsuMasteryLvl: "Super Técnicas",
      xpSpiritLvl: "Pós-Partida",
      passBypassLvl: "Passes em Campo",
      counterShotLvl: "Defesa / Contra-Chute",
      dribbleEdgeLvl: "Dribles 1x1"
    };
    return map[ev.buffKey] || "Elenco Todo";
  }
  return "";
}

function getPrepChoiceComboHTML(ev) {
  if (!ev) return "";
  const { itemIds, equippedPlayerCount } = getPrepEquippedItemContext();
  if (ev.id === "shoes_legend") {
    const ready = itemIds.has("glove_legend");
    return ready
      ? `<div class="prep-choice-combo is-combo-ready"><strong>Combo pronto!</strong> Você já tem Luvas Lendárias (+65 Poder • +8% Quím)</div>`
      : `<div class="prep-choice-combo"><strong>Sinergia:</strong> combine com <em>Luvas Lendárias</em> para +65 Poder e +8% Química.</div>`;
  }
  if (ev.id === "glove_legend") {
    const hasShoes = itemIds.has("shoes_legend");
    const hasSpike = itemIds.has("spike_block");
    if (hasShoes && hasSpike) {
      return `<div class="prep-choice-combo is-combo-ready"><strong>Combo duplo pronto!</strong> Ativa Conjunto Lendário (+65) e Muralha (+55)!</div>`;
    }
    if (hasShoes) {
      return `<div class="prep-choice-combo is-combo-ready"><strong>Combo pronto!</strong> Você já tem Chuteiras Lendárias (+65 Poder • +8% Quím)</div>`;
    }
    if (hasSpike) {
      return `<div class="prep-choice-combo is-combo-ready"><strong>Combo pronto!</strong> Você já tem Travas de Bloqueio (+55 Poder • +6% Quím)</div>`;
    }
    return `<div class="prep-choice-combo"><strong>Sinergia:</strong> comba com <em>Chuteiras Lendárias</em> (+65) e <em>Travas de Bloqueio</em> (+55).</div>`;
  }
  if (ev.id === "spike_block") {
    const ready = itemIds.has("glove_legend");
    return ready
      ? `<div class="prep-choice-combo is-combo-ready"><strong>Combo pronto!</strong> Você já tem Luvas Lendárias (+55 Poder • +6% Quím)</div>`
      : `<div class="prep-choice-combo"><strong>Sinergia:</strong> combine com <em>Luvas Lendárias</em> para +55 Poder e +6% Química.</div>`;
  }
  if (ev.id === "shoes_thunder") {
    const ready = itemIds.has("captain_armband") || itemIds.has("elem_crest_boost");
    return ready
      ? `<div class="prep-choice-combo is-combo-ready"><strong>Combo pronto!</strong> Ativa Tempestade Relâmpago (+50 Poder • +6% Quím)</div>`
      : `<div class="prep-choice-combo"><strong>Sinergia:</strong> combine com <em>Braçadeira</em> ou <em>Insígnia</em> para +50 Poder e +6% Química.</div>`;
  }
  if (ev.id === "captain_armband") {
    const ready = itemIds.has("shoes_thunder");
    return ready
      ? `<div class="prep-choice-combo is-combo-ready"><strong>Combo pronto!</strong> Você já tem Chuteiras do Trovão (+50 Poder • +6% Quím)</div>`
      : `<div class="prep-choice-combo"><strong>Sinergia:</strong> combine com <em>Chuteiras do Trovão</em> para +50 Poder e +6% Química.</div>`;
  }
  if (ev.id === "elem_crest_boost") {
    const ready = itemIds.has("shoes_thunder");
    return ready
      ? `<div class="prep-choice-combo is-combo-ready"><strong>Combo pronto!</strong> Comba com Chuteiras do Trovão (+50 Poder) + Domínio Elemental (3+ iguais).</div>`
      : `<div class="prep-choice-combo"><strong>Sinergia:</strong> com 3+ titulares do mesmo elemento ativa <em>Domínio Elemental</em> (+14 Poder/jogador).</div>`;
  }
  if (ev.id === "misanga_friend") {
    const nextCnt = Math.min(11, equippedPlayerCount + 1);
    return equippedPlayerCount >= 2
      ? `<div class="prep-choice-combo is-combo-ready"><strong>Arsenal ativo!</strong> ${nextCnt} jogadores equipados (+${nextCnt * 14} Poder coletivo).</div>`
      : `<div class="prep-choice-combo"><strong>Arsenal:</strong> equipe 3+ jogadores diferentes para ganhar +14 Poder por jogador equipado (${equippedPlayerCount}/3).</div>`;
  }
  return "";
}

function getPrepBuffPill(ev) {
  if (!ev) return "";
  if (ev.shortDesc) return ev.shortDesc;
  if (ev.kind === "PASSIVE_DOUBLE_EVENT") return `<span class="b-tech">4 Ações/Rodada</span> • <span class="b-chem">-3% Custo · 4ª Ação 50% OFF</span>`;
  if (ev.kind === "PASSIVE_LATE_RESIST") return `<span class="b-chem">-50% Desgaste (75'+)</span>`;
  if (ev.kind === "STREET_5V5") return `<span class="b-lvl">+95–115 XP</span> • <span class="b-tech">Recruta Craque</span>`;
  if (ev.id === "shoes_legend") return `<span class="b-lvl">+1 Nv</span> • <span class="b-pwr">+5 FOR / +7 VEL</span> • <span class="b-pwr">+26 Poder</span>`;
  if (ev.id === "glove_legend") return `<span class="b-lvl">+1 Nv</span> • <span class="b-pwr">+6 DEF / +3 FIS</span> • <span class="b-pwr">+28 Poder</span>`;
  if (ev.id === "shoes_thunder") return `<span class="b-lvl">+1 Nv</span> • <span class="b-chem">+11 VEL / +3 TEC</span> • <span class="b-pwr">+22 Poder</span>`;
  if (ev.id === "spike_block") return `<span class="b-lvl">+1 Nv</span> • <span class="b-pwr">+5 DEF / +4 FIS</span> • <span class="b-pwr">+24 Poder</span>`;
  if (ev.id === "captain_armband") return `<span class="b-lvl">+1 Nv</span> • <span class="b-tech">+4 TEC / +3 FOR / +3 FIS</span> • <span class="b-chem">+8% Quím</span>`;
  if (ev.id === "misanga_friend") return `<span class="b-lvl">+1 Nv</span> • <span class="b-tech">+4 TEC / +3 FOR / +3 FIS</span> • <span class="b-chem">+8% Quím</span>`;
  if (ev.id === "elem_crest_boost") return `<span class="b-lvl">+125 XP</span> • <span class="b-pwr">+12 Poder</span> <span class="b-tech">(por titular igual)</span>`;
  if (ev.id === "elem_resonance_tome") return `<span class="b-lvl">+145 XP (Todos)</span> • <span class="b-chem">+6% Quím</span> • <span class="b-pwr">Links +</span>`;
  if (ev.id === "secret_hissatsu_mastery") return `<span class="b-lvl">+1 Nv (+65 XP Elenco)</span> • <span class="b-tech">Técnica Suprema</span> • <span class="b-pwr">+22 Poder</span>`;
  if (ev.kind === "KESHIN_PICK") return `<span class="b-lvl">+1 Nv (+65 XP Elenco)</span> • <span class="b-tech">Ativa 1x/Jogo</span> • <span class="b-pwr">+10% Chance Duelos (Aura)</span>`;
  if (ev.kind === "EVO_PICK") return `<span class="b-lvl">+${ev.levelGain || 1} Nv (+65 XP Elenco)</span> • <span class="b-tech">Evolui Técnica</span> • <span class="b-pwr">+${ev.indivPower || 16} Poder</span>`;
  if (ev.id === "river_xp") return `<span class="b-lvl">+105 XP (Todos)</span> • <span class="b-chem">+4% Quím</span> • <span class="b-pwr">+26 Poder</span>`;
  if (ev.id === "river_tactics") return `<span class="b-lvl">+135 XP (Meias)</span> • <span class="b-chem">+8% Quím</span> • <span class="b-pwr">+18 Poder</span>`;
  if (ev.id === "river_shot") return `<span class="b-lvl">+135 XP (ATQ)</span> • <span class="b-pwr">+14 Poder/ATQ</span> • <span class="b-pwr">+18 Time</span>`;
  if (ev.id === "river_defense") return `<span class="b-lvl">+135 XP (DEF/GOL)</span> • <span class="b-chem">+5% Quím</span> • <span class="b-pwr">+14 Poder/DEF</span>`;
  if (ev.id === "river_synergy_train") return `<span class="b-lvl">+105 XP (Todos)</span> • <span class="b-tech">+22 Sintonia</span> • <span class="b-chem">+5% Quím</span>`;
  if (ev.kind === "SCALABLE_BUFF") {
    const curLvl = state.tournament?.prepBonuses?.[ev.buffKey] || 0;
    const nextLvl = Math.min(ev.maxLevel || 3, curLvl + 1);
    if (ev.buffKey === "efficiencyLvl") {
      const nextD = [0, 4, 7, 10][nextLvl] || 10;
      return `<span class="b-chem">-${nextD}% Custo na Cidade</span>`;
    }
    if (ev.buffKey === "restLvl") {
      return `<span class="b-chem">Sono +${45 + nextLvl * 7}%</span> • <span class="b-lvl">Tática +${35 + nextLvl * 10} XP</span> • <span class="b-lvl">+${nextLvl * 4}% Intervalo</span>`;
    }
    if (ev.buffKey === "recoveryLvl") {
      const bonusR = nextLvl * 5;
      return `<span class="b-chem">+${bonusR}% Energia entre Partidas</span>`;
    }
    if (ev.buffKey === "enduranceLvl") {
      const nextP = [0, 8, 15, 22][nextLvl] || 22;
      return `<span class="b-chem">-${nextP}% Gasto em Campo</span>`;
    }
    if (ev.buffKey === "wingExplosionLvl") {
      return `<span class="b-pwr">+${nextLvl * 2} VEL &amp; FOR</span>`;
    }
    if (ev.buffKey === "midSynergyLvl") {
      return `<span class="b-tech">+${nextLvl * 2} TEC</span> • <span class="b-chem">+4% Quím</span>`;
    }
    if (ev.buffKey === "defBlockLvl") {
      return `<span class="b-pwr">+${nextLvl * 2} DEF &amp; FIS</span>`;
    }
    if (ev.buffKey === "hissatsuMasteryLvl") {
      const pct = [0, 2, 4, 5][nextLvl] || 5;
      return `<span class="b-pwr">+${pct}% Chance em Técnicas</span>`;
    }
    if (ev.buffKey === "xpSpiritLvl") {
      const nextP = [0, 12, 24, 36][nextLvl] || 36;
      return `<span class="b-lvl">+${nextP}% XP Pós-Jogo</span>`;
    }
    if (ev.buffKey === "passBypassLvl") {
      const nextP = [0, 15, 28, 40][nextLvl] || 40;
      return `<span class="b-chem">-${nextP}% Interceptações</span>`;
    }
    if (ev.buffKey === "counterShotLvl") {
      const nextP = [0, 12, 24, 35][nextLvl] || 35;
      const nextFPct = [0, 3, 6, 9][nextLvl] || 9;
      return `<span class="b-tech">+${nextP}% Ativação</span> • <span class="b-pwr">+${nextFPct}% Chance</span>`;
    }
    if (ev.buffKey === "dribbleEdgeLvl") {
      const pct = [0, 3, 5, 8][nextLvl] || 8;
      return `<span class="b-pwr">+${pct}% Chance Drible (+2% Corredor)</span>`;
    }
  }
  if (ev.kind === "REST_ACTIVE") {
    if (ev.restMode === "TACTICAL") {
      return `<span class="b-chem">+${ev.energyGain || 25}% Energia</span> • <span class="b-lvl">+${ev.xpGain || 35} XP (Todos)</span>`;
    }
    if (ev.restMode === "SNACK") {
      return `<span class="b-chem">+${ev.energyGain || 30}% Energia</span> • <span class="b-tech">-20% Gasto no Jogo</span>`;
    }
    return `<span class="b-chem">+${ev.energyGain || 45}% Energia</span>`;
  }
  if (ev.kind === "ENERGY_DRINK") return `<span class="b-chem">+${ev.energyGain || 35}% Energia</span> • <span class="b-pwr">+${ev.teamPower || 14} Poder</span>`;
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
      const nextD = [0, 4, 7, 10][nextLvl] || 10;
      return `Deixa todas as visitas na cidade mais baratas em energia (<span class="b-chem">-${nextD}%</span>), permitindo treinar mais antes de cada jogo.`;
    }
    if (ev.buffKey === "restLvl") {
      return `Melhora o descanso gratuito no Dormitório (<span class="b-chem">Sono +${45 + nextLvl * 7}%</span> e <span class="b-lvl">Tática +${35 + nextLvl * 10} XP</span>) e recupera <span class="b-lvl">+${nextLvl * 4}% de fôlego</span> no intervalo das partidas.`;
    }
    if (ev.buffKey === "recoveryLvl") {
      return `Aumenta a recuperação passiva do elenco entre as partidas para <span class="b-chem">+${20 + nextLvl * 5}% de Energia</span> automáticos antes de cada rodada.`;
    }
    if (ev.buffKey === "enduranceLvl") {
      const nextP = [0, 8, 15, 22][nextLvl] || 22;
      return `Economiza <span class="b-chem">${nextP}% de energia</span> durante a partida inteira — seus titulares usam mais Super Técnicas antes de cansar.`;
    }
    if (ev.buffKey === "wingExplosionLvl") {
      return `Deixa Atacantes e Meias mais rápidos nas arrancadas e com finalizações mais pesadas (<span class="b-pwr">+${nextLvl * 2} VEL e FOR</span> permanentes).`;
    }
    if (ev.buffKey === "midSynergyLvl") {
      return `Melhora o controle de bola, passes e dribles dos Meias (<span class="b-tech">+${nextLvl * 2} TEC</span>) e fortalece o entrosamento do elenco (<span class="b-chem">+4% Química</span>).`;
    }
    if (ev.buffKey === "defBlockLvl") {
      return `Deixa Goleiro e Zagueiros mais difíceis de superar nos duelos e mais resistentes ao cansaço (<span class="b-pwr">+${nextLvl * 2} DEF e FIS</span>).`;
    }
    if (ev.buffKey === "hissatsuMasteryLvl") {
      const pct = [0, 2, 4, 5][nextLvl] || 5;
      return `Aumenta o poder das suas Super Técnicas, dando <span class="b-pwr">+${pct}% de chance</span> de vencer duelos de chute, drible e defesa.`;
    }
    if (ev.buffKey === "xpSpiritLvl") {
      const nextP = [0, 12, 24, 36][nextLvl] || 36;
      return `Acelera a evolução do elenco inteiro multiplicando em <span class="b-lvl">+${nextP}% o XP</span> ganho após cada partida oficial.`;
    }
    if (ev.buffKey === "passBypassLvl") {
      const nextP = [0, 15, 28, 40][nextLvl] || 40;
      return `Faz seus passes atravessarem a marcação com mais segurança, reduzindo em <span class="b-chem">${nextP}%</span> as interceptações do rival.`;
    }
    if (ev.buffKey === "counterShotLvl") {
      const nextP = [0, 12, 24, 35][nextLvl] || 35;
      const nextFPct = [0, 3, 6, 9][nextLvl] || 9;
      return `Quando um defensor entra na trajetória do chute rival, ativa Contra-Chute com <span class="b-tech">+${nextP}% frequência</span> e <span class="b-pwr">+${nextFPct}% chance de vencer</span>.`;
    }
    if (ev.buffKey === "dribbleEdgeLvl") {
      const pct = [0, 3, 5, 8][nextLvl] || 8;
      return `Aumenta em <span class="b-pwr">+${pct}% a chance</span> de passar pelo marcador no 1x1, com <span class="b-tech">+2% extra</span> no corredor tático escolhido.`;
    }
  }
  return ev.summary || "";
}

function getPrepLocationsCatalog() {
  const restLvlCur = state?.tournament?.prepBonuses?.restLvl || 0;
  const restBase = typeof getRestEnergyGain === "function" ? getRestEnergyGain(state?.tournament) : 35;
  const fullRestGain = restBase + 10;
  const tacticalRestGain = Math.max(20, restBase - 10);
  const snackRestGain = Math.max(25, restBase - 5);
  const tacticalRestXp = 35 + restLvlCur * 10;
  const bondRestGain = Math.max(25, restBase - 5);
  const bondRestXp = 20;
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
          summary: `Libera <span class="b-tech">1 ação extra na cidade</span> (4 ações/rodada), barateia em <span class="b-chem">-3%</span> as visitas e deixa a <span class="b-chem">4ª ação com 50% de desconto</span>.`
        },
        {
          id: "pendant_endurance",
          title: "Pingente da Resistência Final",
          icon: UI.itemPendantLightning || UI.tpPendant,
          kind: "PASSIVE_LATE_RESIST",
          weight: 2.0,
          summary: `Evita que seus titulares fiquem exaustos na reta final: a partir dos <span class="b-chem">75' de jogo</span>, gastam metade da energia.`
        },
        {
          id: "shoes_legend",
          title: "Chuteiras Lendárias",
          icon: UI.itemShoesLegend,
          kind: "ITEM_PICK",
          targetRoles: ["FW", "MF"],
          levelGain: 1,
          indivPower: 26,
          spdBoost: 3,
          teamPower: 14,
          teamChem: 0,
          weight: 2.1,
          summary: `Deixa <span class="b-pwr">chutes mais potentes</span> e aumenta a <span class="b-chem">velocidade</span> para vencer corridas e dribles em 1 Atacante ou Meia.`
        },
        {
          id: "glove_legend",
          title: "Luvas Lendárias",
          icon: UI.itemGloveLegend || UI.itemGloveRaimon,
          kind: "ITEM_PICK",
          targetRoles: ["GK"],
          levelGain: 1,
          indivPower: 28,
          teamPower: 14,
          teamChem: 0,
          weight: 1.9,
          summary: `Reforça as <span class="b-pwr">defesas do goleiro</span> contra chutes fortes e aumenta o <span class="b-chem">fôlego</span> para segurar pressão constante.`
        },
        {
          id: "shoes_thunder",
          title: "Chuteiras do Trovão",
          icon: UI.itemShoesThunder,
          kind: "ITEM_PICK",
          targetRoles: ["FW", "MF", "DF"],
          levelGain: 1,
          indivPower: 22,
          spdBoost: 5,
          teamPower: 12,
          teamChem: 0,
          weight: 2.2,
          summary: `Explosão máxima de <span class="b-chem">velocidade</span> para escapar da marcação, além de <span class="b-tech">passes e dribles mais precisos</span>.`
        },
        {
          id: "spike_block",
          title: "Travas de Bloqueio",
          icon: UI.itemSpikeBlock,
          kind: "ITEM_PICK",
          targetRoles: ["DF"],
          levelGain: 1,
          indivPower: 24,
          teamPower: 12,
          teamChem: 0,
          weight: 1.9,
          summary: `Fortalece <span class="b-pwr">desarmes e bloqueios</span> na zaga, além de dar mais <span class="b-chem">resistência física</span> nos duelos defensivos.`
        },
        {
          id: "captain_armband",
          title: "Braçadeira Dourada do Capitão",
          icon: UI.captain || UI.itemBraceletFortune,
          kind: "ITEM_PICK",
          targetRoles: ["GK", "DF", "MF", "FW"],
          levelGain: 1,
          indivPower: 24,
          teamPower: 16,
          teamChem: 8,
          weight: 1.8,
          summary: `Transforma 1 titular em <span class="b-tech">referência técnica e física</span>, elevando a <span class="b-chem">Química</span> e o poder do time inteiro.`
        },
        {
          id: "elem_crest_boost",
          title: "Insígnia de Ressonância Elemental",
          icon: UI.elemFire || UI.itemPendantLightning,
          kind: "ELEM_BOOST_PICK",
          levelGain: 1,
          indivPower: 12,
          teamPower: 12,
          teamChem: 5,
          weight: 2.0,
          summary: `Evolui de uma vez todos os titulares do <span class="b-tech">mesmo elemento</span> escolhido com <span class="b-lvl">+125 XP</span> e <span class="b-pwr">+12 Poder</span> cada.`
        },
        {
          id: "misanga_friend",
          title: "Pulseira da Amizade",
          icon: UI.itemMisangaFriend || UI.itemBraceletFortune,
          kind: "ITEM_PICK",
          targetRoles: ["GK", "DF", "MF", "FW"],
          levelGain: 1,
          indivPower: 20,
          teamPower: 14,
          teamChem: 8,
          weight: 1.7,
          summary: `Aumenta <span class="b-tech">técnica, força e resistência</span> de 1 titular e impulsiona o <span class="b-chem">entrosamento coletivo</span> do elenco.`
        },
        {
          id: "energy_drink",
          title: "Bebida Energética Raijin",
          icon: UI.sportsDrink || UI.onigiriIcon || UI.itemPendantLightning,
          kind: "ENERGY_DRINK",
          energyGain: 35,
          teamPower: 14,
          weight: 2.3,
          summary: `Recarrega a <span class="b-chem">energia do elenco na hora</span> para continuar treinando na cidade ou entrar inteiro no jogo.`
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
          summary: `Deixa todas as visitas na cidade mais baratas em energia, permitindo treinar mais antes de cada jogo.`
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
          summary: `Melhora o descanso gratuito no Dormitório (<span class="b-chem">+7% Energia</span> e <span class="b-lvl">+10 XP</span> na Tática) e recupera mais fôlego no intervalo.`
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
          summary: `Acelera a subida de nível do elenco multiplicando o <span class="b-lvl">XP ganho após cada partida</span>.`
        }
      ]
    },
    {
      id: "riverbank",
      title: "Margem do Rio",
      sub: "Treinos Coletivos & 5x5",
      mapLabel: "Campinho",
      mapX: 31,
      mapY: 71,
      energyCost: 20,
      cta: "Ir para o Campinho",
      spinMsg: "Sorteando 3 treinos coletivos no Campinho...",
      resultEyebrow: "Escolha 1 de 3 Treinos no Campinho",
      banner: UI.locRiverbank || UI.stadiumBg,
      badgeIcon: UI.iconCampinho || UI.ffLogo,
      subIcon: UI.iconBattleVR || UI.ffLogo,
      desc: "Treinos coletivos para todos os setores (ATQ, MEI, DEF/GOL), vigor entre jogos e desafio 5x5.",
      events: [
        {
          id: "clash_5v5",
          title: "Confronto 5x5 com Craque",
          icon: UI.ffLogo || UI.moveSH,
          kind: "STREET_5V5",
          weight: 2.5,
          summary: `Partida rápida de Gol de Ouro: vencer dá <span class="b-lvl">muito XP</span> aos 5 participantes e libera o <span class="b-tech">recrutamento de um craque rival</span>.`
        },
        {
          id: "river_xp",
          title: "Intensivo Coletivo",
          icon: UI.keshinCoin || UI.formation,
          kind: "COLLECTIVE",
          applyRoles: ["GK", "DF", "MF", "FW"],
          levelGain: 1,
          teamPower: 16,
          teamChem: 4,
          xpGain: 90,
          weight: 2.2,
          summary: `Evolui os <span class="b-lvl">11 titulares juntos</span> com um grande pacote de XP, elevando o entrosamento e o poder geral.`
        },
        {
          id: "river_tactics",
          title: "Roda Tática de Meio-Campo",
          icon: UI.formation || UI.moveOF,
          kind: "COLLECTIVE",
          applyRoles: ["MF"],
          levelGain: 1,
          indivPower: 12,
          teamPower: 18,
          teamChem: 8,
          xpGain: 80,
          weight: 1.9,
          summary: `Foca evolução e controle de jogo em <span class="b-lvl">todos os Meias</span> e dá um salto na <span class="b-chem">Química</span> do elenco.`
        },
        {
          id: "river_shot",
          title: "Bombardeio de Finalização",
          icon: UI.moveSH,
          kind: "COLLECTIVE",
          applyRoles: ["FW"],
          levelGain: 1,
          indivPower: 14,
          teamPower: 18,
          teamChem: 0,
          xpGain: 80,
          weight: 1.9,
          summary: `Treino pesado de finalização para deixar <span class="b-pwr">todos os Atacantes</span> mais letais e com mais XP.`
        },
        {
          id: "river_defense",
          title: "Muralha Coletiva (DEF & GOL)",
          icon: UI.moveDF || UI.itemSpikeBlock,
          kind: "COLLECTIVE",
          applyRoles: ["DF", "GK"],
          levelGain: 1,
          indivPower: 14,
          teamPower: 16,
          teamChem: 5,
          xpGain: 135,
          weight: 2.0,
          summary: `Treino coletivo de cobertura para <span class="b-lvl">Goleiro e Zagueiros</span> ganharem XP, Química e firmeza nos duelos.`
        },
        ...(isBetaMode()
          ? [
              {
                id: "river_synergy_train",
                title: "Treino de Jogadas Combinadas",
                icon: UI.formation || UI.manualInazuma || UI.ffLogo,
                kind: "COLLECTIVE",
                levelGain: 1,
                indivPower: 10,
                teamPower: 16,
                teamChem: 5,
                xpGain: 105,
                weight: 2.2,
                summary: `Ensaio coletivo de triangulações e cobertura para todo o elenco ganhar <span class="b-lvl">+105 XP</span>, elevar <span class="b-tech">+22 Sintonia</span> em duplas próximas e inspirar uma conversa tática.`
              }
            ]
          : []),
        {
          id: "recovery_upgrade",
          title: "Vigor de Campanha",
          icon: UI.onigiriIcon || UI.sportsDrink || UI.tpPendant,
          kind: "SCALABLE_BUFF",
          buffKey: "recoveryLvl",
          maxLevel: 3,
          teamPower: 12,
          weight: 1.9,
          summary: `Eleva a recuperação automática de energia <span class="b-chem">entre todas as partidas</span> (+5%/+10%/+15% extra antes de cada rodada).`
        },
        {
          id: "wing_explosion_upgrade",
          title: "Explosão nas Alas",
          icon: UI.itemShoesThunder || UI.moveOF,
          kind: "SCALABLE_BUFF",
          buffKey: "wingExplosionLvl",
          maxLevel: 3,
          teamPower: 12,
          weight: 1.8,
          summary: `Deixa Atacantes e Meias mais rápidos nas arrancadas e com finalizações mais pesadas (<span class="b-chem">+2 VEL/FOR</span> por nível).`
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
          summary: `Melhora o controle de bola, passes e dribles dos Meias (<span class="b-tech">+2 TEC</span>) e aumenta a <span class="b-chem">Química</span> do time.`
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
          summary: `Faz seus passes atravessarem a marcação com mais segurança, reduzindo interceptações do rival.`
        },
        {
          id: "dribble_edge_upgrade",
          title: "Drible Imparável",
          icon: UI.moveOF || UI.itemShoesThunder,
          kind: "SCALABLE_BUFF",
          buffKey: "dribbleEdgeLvl",
          maxLevel: 3,
          teamPower: 12,
          weight: 1.8,
          summary: `Facilita vencer duelos de 1x1 no drible, com bônus extra ao atacar pelo corredor tático escolhido.`
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
      energyCost: 26,
      cta: "Treinar no Inabikari",
      spinMsg: "Sorteando 3 salas de treino no Centro Inabikari...",
      resultEyebrow: "Escolha 1 de 3 Treinos no Inabikari",
      banner: UI.locTraining || UI.stadiumBg,
      badgeIcon: UI.iconSecretTrain || UI.keshinPegasus,
      subIcon: UI.iconSpecialTrainVR || UI.steelTowerIcon,
      desc: "Manual Secreto, Incorporação Keshin, Evolução (+65 XP no elenco) e Sinergia Elemental.",
      events: [
        {
          id: "secret_hissatsu_mastery",
          title: "Manual Secreto de Inazuma",
          icon: UI.manualInazuma || UI.manualSkill,
          kind: "EVO_PICK",
          levelGain: 1,
          indivPower: 22,
          teamPower: 15,
          xpGain: 95,
          weight: 2.5,
          summary: `Ensina uma <span class="b-tech">Super Técnica suprema</span> para 1 titular e concede <span class="b-lvl">+65 XP coletivos</span> para todo o restante do time.`
        },
        {
          id: "keshin_awaken",
          title: "Despertar Incorporação",
          icon: UI.keshinPegasus || UI.keshinIcon,
          kind: "KESHIN_PICK",
          levelGain: 1,
          indivPower: 18,
          teamPower: 15,
          xpGain: 95,
          weight: 2.4,
          summary: `1 titular desperta um <span class="b-tech">Espírito Guerreiro</span> (1x/jogo) e o treino garante <span class="b-lvl">+65 XP</span> para os outros 10 titulares.`
        },
        {
          id: "evo_move",
          title: "Evoluir Técnica (G2/Shin)",
          icon: UI.manualSkill || UI.manualKeshin,
          kind: "EVO_PICK",
          levelGain: 1,
          indivPower: 16,
          teamPower: 14,
          xpGain: 85,
          weight: 2.2,
          summary: `Evolui a <span class="b-tech">técnica principal</span> de 1 titular para G2/Shin e distribui <span class="b-lvl">+65 XP</span> para o resto do elenco.`
        },
        {
          id: "endurance_upgrade",
          title: "Resistência em Campo",
          icon: UI.steelTowerIcon || UI.moveGK,
          kind: "SCALABLE_BUFF",
          buffKey: "enduranceLvl",
          maxLevel: 3,
          teamPower: 10,
          weight: 2.0,
          summary: `Economiza energia durante toda a partida — seus titulares usam mais Super Técnicas antes de cansar.`
        },
        {
          id: "elem_resonance_tome",
          title: "Tomo da Sincronia Elemental",
          icon: UI.elemWind || UI.formation,
          kind: "COLLECTIVE",
          applyRoles: ["GK", "DF", "MF", "FW"],
          levelGain: 1,
          teamPower: 16,
          teamChem: 6,
          xpGain: 145,
          elemResonance: true,
          weight: 1.9,
          summary: `Distribui <span class="b-lvl">+145 XP para os 11 titulares</span>, sobe a Química e amplifica os <span class="b-pwr">Links Elementais</span>.`
        },
        {
          id: "def_block_upgrade",
          title: "Bloco Defensivo",
          icon: UI.itemSpikeBlock || UI.moveDF,
          kind: "SCALABLE_BUFF",
          buffKey: "defBlockLvl",
          maxLevel: 3,
          teamPower: 12,
          weight: 1.9,
          summary: `Deixa Goleiro e Zagueiros mais difíceis de superar nos duelos e mais resistentes ao cansaço.`
        },
        {
          id: "hissatsu_mastery_upgrade",
          title: "Maestria de Hissatsu",
          icon: UI.manualInazuma || UI.moveSH,
          kind: "SCALABLE_BUFF",
          buffKey: "hissatsuMasteryLvl",
          maxLevel: 3,
          teamPower: 12,
          weight: 1.9,
          summary: `Aumenta o poder real das suas Super Técnicas, elevando a chance de vencer duelos de chute, drible e defesa.`
        },
        {
          id: "counter_shot_upgrade",
          title: "Reflexo de Contra-Chute",
          icon: UI.moveDF || UI.moveSH,
          kind: "SCALABLE_BUFF",
          buffKey: "counterShotLvl",
          maxLevel: 3,
          teamPower: 12,
          weight: 1.8,
          summary: `Ativa Contra-Chutes com mais frequência e potência quando um defensor entra na trajetória do chute rival.`
        }
      ]
    },
    {
      id: "rest",
      title: "Dormitório do Clube",
      sub: "1x Grátis • Encerra o dia",
      mapLabel: "Dormitório (Grátis)",
      mapX: 19,
      mapY: 46,
      energyGain: fullRestGain,
      isRestLocation: true,
      cta: "Visitar Dormitório (Grátis)",
      resultEyebrow: "Dormitório do Clube • Escolha 1 Rotina (Grátis — encerra o dia)",
      banner: UI.locTown || UI.stadiumBg,
      badgeIcon: UI.raimonEmblem || UI.iconDestVR || UI.ffLogo,
      subIcon: UI.onigiriIcon || UI.sportsDrink || UI.tpPendant,
      desc: "Descanso gratuito para conservar energia antes do jogo: se visitado antes de gastar todas as ações, encerra o dia e prepara o time para a próxima partida.",
      events: [
        {
          id: "rest_full_sleep",
          title: "Sono Completo no Dormitório",
          icon: UI.sportsDrink || UI.raimonEmblem || UI.ffLogo,
          kind: "REST_ACTIVE",
          restMode: "FULL",
          energyGain: fullRestGain,
          summary: `A maior recuperação de energia do Dormitório (<span class="b-chem">+${fullRestGain}%</span>, máx. 100%). Ideal para voltar ao verde com folga antes da partida.`
        },
        {
          id: "rest_tactical_video",
          title: "Análise Tática do Treinador",
          icon: UI.manualInazuma || UI.ffLogo,
          kind: "REST_ACTIVE",
          restMode: "TACTICAL",
          energyGain: tacticalRestGain,
          xpGain: tacticalRestXp,
          summary: `Recupera parte do fôlego (<span class="b-chem">+${tacticalRestGain}%</span>) enquanto todos os 11 titulares estudam o rival e ganham <span class="b-lvl">+${tacticalRestXp} XP</span>.`
        },
        {
          id: "rest_manager_snack",
          title: "Lanche Especial das Gerentes",
          icon: UI.onigiriIcon || UI.itemPendantLightning || UI.tpPendant,
          kind: "REST_ACTIVE",
          restMode: "SNACK",
          energyGain: snackRestGain,
          summary: `Recupera <span class="b-chem">+${snackRestGain}% de Energia</span> e deixa o elenco <span class="b-tech">20% mais resistente ao cansaço</span> durante toda a próxima partida.`
        }
      ]
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
  if (player._baseHissatsuSnapshot === undefined) {
    player._baseHissatsuSnapshot = player.hissatsu || "";
  }
  const order =
    slotRole === "GK"
      ? ["GK", "DF", "SH", "OF"]
      : slotRole === "DF"
      ? ["DF", "OF", "SH", "GK"]
      : slotRole === "MF"
      ? ["OF", "SH", "DF", "GK"]
      : ["SH", "OF", "DF", "GK"];

  const baseMoves = player._baseMovesSnapshot || {};
  for (const cat of order) {
    const arr = player.moves[cat];
    if (Array.isArray(arr) && arr.length > 0) {
      const origList = Array.isArray(baseMoves[cat]) ? baseMoves[cat] : [];
      let targetIdx = arr.findIndex((m) => !m.includes("★") && (origList.length === 0 || origList.some((o) => m.startsWith(o))));
      if (targetIdx < 0) targetIdx = arr.findIndex((m) => !m.includes("★"));
      if (targetIdx < 0) continue;
      const oldName = arr[targetIdx];
      let nextName = oldName;
      if (cat === "GK") {
        nextName = oldName.includes("Shin") ? `${oldName} ★` : oldName.includes("Kai") ? oldName.replace("Kai", "Shin") : `${oldName} Shin`;
      } else if (cat === "DF") {
        nextName = oldName.includes("V2") ? oldName.replace("V2", "V3") : oldName.includes("V3") ? `${oldName} ★` : `${oldName} V2`;
      } else {
        nextName = oldName.includes("G2") ? oldName.replace("G2", "G3") : oldName.includes("G3") ? `${oldName} ★` : `${oldName} G2`;
      }
      arr[targetIdx] = nextName;
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
  if (player._baseHissatsuSnapshot === undefined) {
    player._baseHissatsuSnapshot = player.hissatsu || "";
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
      icon: UI.sportsDrink || UI.manualSkill || UI.ffLogo,
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
  if (player._baseHissatsuSnapshot === undefined) {
    player._baseHissatsuSnapshot = player.hissatsu || "";
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

function getXpForNextLevel(lvl) {
  const l = Math.max(1, Math.round(lvl || 1));
  return Math.round(115 + (l - 1) * 24 + Math.pow(Math.max(0, l - 1), 1.55) * 6);
}

function gainPlayerXp(player, amount, slotRole = null) {
  if (!player || !amount) return { xpGained: 0, levelsGained: 0, currentXp: 0, learnedMoves: [] };
  if (getPlayerLevel(player) >= 30) {
    player.xp = 0;
    return { xpGained: 0, levelsGained: 0, ovrGained: 0, currentXp: 0, learnedMoves: [] };
  }
  player.xp = (player.xp || 0) + amount;
  let levelsGained = 0;
  while (getPlayerLevel(player) < 30) {
    const need = getXpForNextLevel(getPlayerLevel(player));
    if (player.xp < need) break;
    player.xp -= need;
    player.level = getPlayerLevel(player) + 1;
    levelsGained++;
  }
  if (getPlayerLevel(player) >= 30) {
    player.xp = 0;
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
    const attrs = calcPlayerAttributes(p, coords.role, pLvl);
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
      attrs,
      spd: attrs.vel,
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
      receiveDashUntil: 0,
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
    ballZ: 0,
    ballVx: 0,
    ballVy: 0,
    ballVz: 0,
    synergyLinkFx: null,
    camX: 50,
    camY: 50,
    camSnap: true,
    camLastNow: 0,
    ballFlight: null,
    passState: null,
    looseState: null,
    holdBallPos: null,
    lastAssistCandidate: null,
    lastPasserUid: null,
    lastAction: null,
    sameActionStreak: 0,
    teamConsecutivePasses: 0,
    justKickedOff: true,
    passTrail: null,
    interceptTweens: [],
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

function openBetweenMatchPrep(nextStageIdx, opts = {}) {
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
  t.nextMatchEnergyMul = 1;
  t.nextMatchChatBuffs = [];
  let autoRestMsg = null;
  if (opts && opts.worldFullRest) {
    t.teamEnergy = 100;
    autoRestMsg = `${prepAssetIconHTML(UI.ffLogo, "")} Viagem para a Ilha Liocott: Energia do elenco restaurada para 100%!`;
  } else if (nextStageIdx > 0) {
    const prevE = Math.round(getTeamEnergy());
    const recGain = 20 + (t.prepBonuses?.recoveryLvl || 0) * 5;
    const nextE = Math.round(adjustTeamEnergy(recGain));
    if (nextE > prevE) {
      autoRestMsg = `${prepAssetIconHTML(UI.sportsDrink || UI.raimonEmblem, "")} Você recuperou +${nextE - prevE}% de Energia entre as partidas (${prevE}% ➔ ${nextE}%).`;
    }
  }
  // Até 3 ações por preparação na cidade (ou 4 com a passiva permanente do treinador)
  const allowedEvents = t.prepBonuses.permanentDoublePrep ? 4 : 3;
  // Limpa marcação especial do adversário anterior ao iniciar a preparação de uma nova partida
  getTactics().markedOppId = null;

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
    restUsedThisRound: false,
    lastActionWasFreeRest: false,
    autoRestMsg,
    usedEventIdsThisRound: [],
    synergySelectedSlots: [],
    teamChats: [],
    activeChatId: null,
    chatReturnPhase: "CHOOSE_LOC",
    appliedMsg: null,
    clash5v5: null,
    recruitCandidate: null,
    riskTargetSlotId: null
  };
  if (typeof isBetaMode === "function" && isBetaMode() && typeof generateInitialRoundTeamChats === "function") {
    generateInitialRoundTeamChats(t);
  }
  renderAll();
}

function isPrepNightTime(t = state.tournament) {
  const prep = t?.prep;
  if (!prep) return false;
  if (prep.restUsedThisRound) return true;
  if ((prep.eventsRemaining || 0) <= 0) return true;
  const curE = Math.round(getTeamEnergy());
  const nonRestCosts = getPrepLocationsCatalog()
    .filter((l) => !l.isRestLocation)
    .map((l) => getPrepLocationCost(l, t));
  const cheapestCost = nonRestCosts.length > 0 ? Math.min(...nonRestCosts) : 0;
  return curE < cheapestCost;
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
    if (t.prep.restUsedThisRound) {
      t.prep.energyNotice = "Você já descansou no Dormitório do Clube antes desta partida.";
      renderTournamentScreen();
      return;
    }
    t.prep.energyNotice = null;
    t.prep.locId = locId;
    t.prep.phase = "PICK_CHOICE";
    t.prep.choices = [...loc.events];
    t.prep.appliedMsg = null;
    renderTournamentScreen();
    return;
  }

  if (t.prep.restUsedThisRound || (t.prep.eventsRemaining || 0) <= 0) {
    t.prep.energyNotice = "Suas ações desta preparação acabaram! Ajuste Táticas/Escalação ou inicie a partida.";
    renderTournamentScreen();
    return;
  }

  const reqCost = getPrepLocationCost(loc, t);
  if (reqCost > 0 && getTeamEnergy() < reqCost) {
    t.prep.energyNotice = `Energia insuficiente para ${loc.title} (precisa de ${reqCost}% — descanse no Dormitório do Clube!).`;
    renderTournamentScreen();
    return;
  }
  t.prep.energyNotice = null;
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

  if (typeof saveActiveRunProgress === "function") saveActiveRunProgress();
  renderTournamentScreen();
}

function handleChoosePrepOption(choiceEvent) {
  const t = state.tournament;
  const prep = t.prep;
  if (!prep || !choiceEvent || prep.phase !== "PICK_CHOICE") return;
  prep.lastActionWasFreeRest = false;
  prep.event = choiceEvent;
  if (choiceEvent.id) {
    if (!Array.isArray(prep.usedEventIdsThisRound)) prep.usedEventIdsThisRound = [];
    if (!prep.usedEventIdsThisRound.includes(choiceEvent.id)) {
      prep.usedEventIdsThisRound.push(choiceEvent.id);
    }
  }

  if (choiceEvent.kind === "REST_ACTIVE") {
    const base = getRestEnergyGain(t);
    const prevE = Math.round(getTeamEnergy());
    let gain = base + 10;
    let extraTxt = "";
    const affected = [];

    if (choiceEvent.restMode === "TACTICAL") {
      gain = Math.max(20, base - 10);
      const tacticalXp = 35 + (t.prepBonuses?.restLvl || 0) * 10;
      getSlots().forEach((slot) => {
        const p = state.squad[slot.id];
        if (!p) return;
        const prevLvl = getPlayerLevel(p);
        const beforePwr = calcIndividualPlayerPower(p, slot.role, prevLvl);
        const xpRes = gainPlayerXp(p, tacticalXp, slot.role);
        const newLvl = getPlayerLevel(p);
        const afterPwr = calcIndividualPlayerPower(p, slot.role, newLvl);
        affected.push({
          name: p.name,
          role: slot.role,
          sprite: getPlayerFormSprite(p, slot.role),
          xpGained: tacticalXp,
          prevLevel: prevLvl,
          newLevel: newLvl,
          levelsGained: Math.max(0, newLvl - prevLvl),
          pwrGained: Math.max(0, afterPwr - beforePwr),
          newPwr: afterPwr,
          learnedMoves: xpRes.learnedMoves || []
        });
      });
      t.prepBonuses.xp += tacticalXp;
      extraTxt = ` e <span class="b-lvl">+${tacticalXp} XP</span> para os 11 titulares`;
    } else if (choiceEvent.restMode === "SNACK") {
      gain = Math.max(25, base - 5);
      t.nextMatchEnergyMul = 0.80;
      extraTxt = ` e <span class="b-tech">-20% gasto de energia</span> na próxima partida`;
    } else if (choiceEvent.restMode === "BOND") {
      gain = Math.max(25, base - 5);
      const bondXp = 20;
      const allSlots = getSlots();
      allSlots.forEach((slot) => {
        const p = state.squad[slot.id];
        if (!p) return;
        const prevLvl = getPlayerLevel(p);
        const beforePwr = calcIndividualPlayerPower(p, slot.role, prevLvl);
        const xpRes = gainPlayerXp(p, bondXp, slot.role);
        const newLvl = getPlayerLevel(p);
        const afterPwr = calcIndividualPlayerPower(p, slot.role, newLvl);
        affected.push({
          name: p.name,
          role: slot.role,
          sprite: getPlayerFormSprite(p, slot.role),
          xpGained: bondXp,
          prevLevel: prevLvl,
          newLevel: newLvl,
          levelsGained: Math.max(0, newLvl - prevLvl),
          pwrGained: Math.max(0, afterPwr - beforePwr),
          newPwr: afterPwr,
          learnedMoves: xpRes.learnedMoves || []
        });
      });
      const candPairs = [];
      for (let i = 0; i < allSlots.length; i++) {
        for (let j = i + 1; j < allSlots.length; j++) {
          const pA = state.squad[allSlots[i].id];
          const pB = state.squad[allSlots[j].id];
          if (!pA || !pB) continue;
          const cur = typeof getPairAffinityEntry === "function" ? getPairAffinityEntry(pA, pB, t) : { level: 0, points: 0 };
          if ((cur.level || 0) < 3) {
            const dist = Math.hypot((allSlots[i].x || 50) - (allSlots[j].x || 50), (allSlots[i].y || 50) - (allSlots[j].y || 50));
            candPairs.push({ pA, pB, dist, points: cur.points || 0 });
          }
        }
      }
      candPairs.sort((a, b) => a.dist - b.dist || a.points - b.points);
      const boostedLabels = [];
      candPairs.slice(0, 3).forEach((pair) => {
        if (typeof addPairAffinityPoints === "function") {
          addPairAffinityPoints(pair.pA, pair.pB, 18, null, t);
        }
        boostedLabels.push(`${pair.pA.name} & ${pair.pB.name}`);
      });
      t.prepBonuses.xp += bondXp;
      const pairTxt = boostedLabels.length > 0 ? ` • <span class="b-tech">+18 Sintonia</span> (${boostedLabels.join(", ")})` : "";
      extraTxt = ` e <span class="b-lvl">+${bondXp} XP</span> no elenco${pairTxt}`;
    }

    const nextE = Math.round(adjustTeamEnergy(gain));
    prep.restUsedThisRound = true;
    prep.lastActionWasFreeRest = true;
    prep.eventsRemaining = 0;
    prep.phase = "DONE";
    prep.affectedPlayers = affected;
    prep.appliedMsg = `${choiceEvent.title}: <span class="b-chem">+${gain}% Energia</span> (${prevE}% ➔ ${nextE}%)${extraTxt}. <span style="color:#93c5fd;">(Noite encerrada — pronto para o jogo!)</span>`;
    t.prepBonuses.log.push(`${choiceEvent.title} (+${gain}% Energia)`);
    renderAll();
    return;
  }

  // 1. Passiva Permanente: Passe Livre do Treinador (+1 ação extra e -3% custo de energia em todas as rodadas)
  if (choiceEvent.kind === "PASSIVE_DOUBLE_EVENT") {
    if (!t.prepBonuses.permanentDoublePrep) {
      t.prepBonuses.permanentDoublePrep = true;
      prep.eventsTotal = (prep.eventsTotal || 3) + 1;
      prep.eventsRemaining = (prep.eventsRemaining || 3) + 1;
      t.prepBonuses.log.push("Passe Livre do Treinador (4 Ações e -3% Custo na Cidade)");
    }
    prep.phase = "DONE";
    prep.affectedPlayers = [];
    prep.appliedMsg = `Passiva ativada: seu time agora tem <span class="b-tech">4 ações por rodada</span>, <span class="b-chem">-3% custo</span> nos locais e <span class="b-chem">50% de desconto na 4ª ação</span>.`;
    renderAll();
    return;
  }

  // 2. Passiva: Pingente da Resistência Final (-50% gasto de stamina após 75' — única vez!)
  if (choiceEvent.kind === "PASSIVE_LATE_RESIST") {
    if (!t.prepBonuses.lateMatchNoStaminaLoss) {
      t.prepBonuses.lateMatchNoStaminaLoss = true;
      t.prepBonuses.log.push("Resistência Final (-50% gasto aos 75'+)");
    }
    prep.phase = "DONE";
    prep.affectedPlayers = [];
    prep.appliedMsg = `Passiva equipada: os 11 titulares gastam <span class="b-chem">50% menos energia</span> a partir dos 75' de jogo.`;
    renderAll();
    return;
  }

  // 2.5 Bebida Energética
  if (choiceEvent.kind === "ENERGY_DRINK") {
    const prevE = Math.round(getTeamEnergy());
    const gain = choiceEvent.energyGain || 35;
    const nextE = Math.round(adjustTeamEnergy(gain));
    const pwr = choiceEvent.teamPower || 14;
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
      t.prepBonuses.staminaMul = [1, 0.92, 0.85, 0.78][nextL] || 0.78;
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
    if (key === "efficiencyLvl") {
      const disc = [0, 4, 7, 10][nextL] || 10;
      effectTxt = `<span class="b-chem">-${disc}% custo de energia</span> nos locais da cidade`;
    } else if (key === "restLvl") {
      effectTxt = `Sono do Dormitório agora recupera <span class="b-chem">+${45 + nextL * 7}% Energia</span>, Análise Tática dá <span class="b-lvl">+${35 + nextL * 10} XP</span> e intervalos recuperam <span class="b-lvl">+${nextL * 4}% fôlego</span>`;
    } else if (key === "recoveryLvl") {
      const recBonus = nextL * 5;
      effectTxt = `Recuperação passiva entre partidas sobe para <span class="b-chem">+${20 + recBonus}% de Energia</span> antes de cada rodada`;
    }
    else if (key === "enduranceLvl") {
      const pct = [0, 8, 15, 22][nextL] || 22;
      effectTxt = `<span class="b-chem">-${pct}% gasto de energia</span> em técnicas e desgaste de campo`;
    } else if (key === "wingExplosionLvl") {
      collectAffectedRoles(["FW", "MF"], `+${nextL * 2} VEL/FOR`);
      effectTxt = `<span class="b-chem">+2 VEL e +2 FOR</span> acumulados (<span class="b-pwr">+${nextL * 2} total</span>) para Atacantes e Meias`;
    } else if (key === "midSynergyLvl") {
      t.prepBonuses.chem = (t.prepBonuses.chem || 0) + (choiceEvent.teamChem || 4);
      collectAffectedRoles(["MF"], `+${nextL * 2} TEC`);
      effectTxt = `<span class="b-tech">+2 TEC</span> nos Meias (<span class="b-pwr">+${nextL * 2} total</span>) e <span class="b-chem">+4% Química</span>`;
    } else if (key === "defBlockLvl") {
      collectAffectedRoles(["GK", "DF"], `+${nextL * 2} DEF/FIS`);
      effectTxt = `<span class="b-pwr">+2 DEF e +2 FIS</span> acumulados (<span class="b-pwr">+${nextL * 2} total</span>) em Goleiro e Zaga`;
    } else if (key === "hissatsuMasteryLvl") {
      const pct = [0, 2, 4, 5][nextL] || 5;
      effectTxt = `<span class="b-pwr">+${pct}% chance</span> de vencer duelos ao usar Super Técnicas`;
    } else if (key === "xpSpiritLvl") {
      const pct = [0, 12, 24, 36][nextL] || 36;
      effectTxt = `<span class="b-lvl">+${pct}% XP</span> ganho após cada partida oficial`;
    } else if (key === "passBypassLvl") {
      const pct = [0, 15, 28, 40][nextL] || 40;
      effectTxt = `<span class="b-chem">-${pct}% chance</span> de interceptação nos passes do time`;
    } else if (key === "counterShotLvl") {
      const pct = [0, 12, 24, 35][nextL] || 35;
      const winPct = [0, 3, 6, 9][nextL] || 9;
      effectTxt = `<span class="b-tech">+${pct}% frequência</span> de Contra-Chute e <span class="b-pwr">+${winPct}% chance</span> de gol`;
    } else if (key === "dribbleEdgeLvl") {
      const pct = [0, 3, 5, 8][nextL] || 8;
      effectTxt = `<span class="b-pwr">+${pct}% chance</span> nos dribles 1x1 (+2% extra no corredor tático)`;
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
    if (typeof saveActiveRunProgress === "function") saveActiveRunProgress();
    renderTournamentScreen();
    return;
  }

  // 4. Coletivos normais
  if (choiceEvent.kind === "COLLECTIVE") {
    applyPrepCollectiveEvent(choiceEvent);
    return;
  }

  // 5. Itens, Keshin ou Evolução
  prep.phase = "RESULT";
  if (typeof saveActiveRunProgress === "function") saveActiveRunProgress();
  renderTournamentScreen();
}

function handleRecruitStarPlayer(starRecruit, replaceSlotId) {
  const t = state.tournament;
  const prep = t.prep;
  if (!prep || !starRecruit || !replaceSlotId) return;

  const oldPlayer = state.squad[replaceSlotId];
  const targetSlot = getSlots().find((s) => s.id === replaceSlotId);
  const targetRole = targetSlot?.role || starRecruit.player?.pos || starRecruit.role || "MF";
  const nextIdx = prep.nextStageIdx ?? t.stageIndex ?? 0;
  const stageTargetLvl = STAGE_OPPONENT_LEVELS[Math.min(nextIdx, STAGE_OPPONENT_LEVELS.length - 1)] || 1;
  const recruitLvl = Math.max(getPlayerLevel(oldPlayer), stageTargetLvl);
  const newP = cloneFreshPlayerForSquad(
    starRecruit.player,
    { id: starRecruit.teamId, name: starRecruit.teamName, emblem: starRecruit.emblem },
    recruitLvl
  );
  checkAndLearnLevelMoves(newP, targetRole);
  state.squad[replaceSlotId] = newP;
  if (oldPlayer?.id && getTactics().acePlayerId === oldPlayer.id) {
    getTactics().acePlayerId = null;
  }
  const newPwr = calcIndividualPlayerPower(newP, targetRole, recruitLvl);
  prep.phase = "DONE";
  prep.recruitCandidate = null;
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
  const isTeamWide = !event.applyRoles || event.applyRoles.length >= 4;

  slots.forEach((slot) => {
    const p = state.squad[slot.id];
    if (!p) return;
    if (!event.applyRoles || event.applyRoles.includes(slot.role)) {
      const prevLvl = getPlayerLevel(p);
      const beforePwr = calcIndividualPlayerPower(p, slot.role, prevLvl);
      let learnedMoves = [];
      if (lvlGain > 0) {
        // Em vez de pular direto de nível em bloco de 11 atletas, concede grande pacote de XP com progressão natural
        const xpAmount = isTeamWide ? Math.max(105, event.xpGain || 105) : Math.max(135, event.xpGain || 135);
        const xpRes = gainPlayerXp(p, xpAmount, slot.role);
        learnedMoves = xpRes.learnedMoves || [];
      }
      if (indivPwrGain > 0) {
        p.bonusPower = (p.bonusPower || 0) + indivPwrGain;
      } else if (lvlGain > 0 && isTeamWide) {
        p.bonusPower = (p.bonusPower || 0) + 10;
      }
      const newLvl = getPlayerLevel(p);
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
  if (event.elemResonance) {
    t.prepBonuses.elemResonance = true;
  }
  t.prepBonuses.log.push(event.title);
  t.prep.phase = "DONE";
  t.prep.affectedPlayers = affectedPlayers;
  const totalPwr = totalPowerGainedFromLevels + (event.teamPower || 0);
  let synergyExtraMsg = "";
  if (typeof isBetaMode === "function" && isBetaMode() && event.id === "river_synergy_train") {
    const candPairs = [];
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        const pA = state.squad[slots[i].id];
        const pB = state.squad[slots[j].id];
        if (!pA || !pB) continue;
        const cur = typeof getPairAffinityEntry === "function" ? getPairAffinityEntry(pA, pB, t) : { level: 0, points: 0 };
        if ((cur.points || 0) < 120) {
          const d = Math.hypot((slots[i].x || 50) - (slots[j].x || 50), (slots[i].y || 50) - (slots[j].y || 50));
          candPairs.push({ pA, pB, d, pts: cur.points || 0 });
        }
      }
    }
    candPairs.sort((a, b) => a.d - b.d || a.pts - b.pts);
    const boosted = [];
    candPairs.slice(0, 3).forEach((pair) => {
      if (typeof addPairAffinityPoints === "function") {
        addPairAffinityPoints(pair.pA, pair.pB, 22, null, t);
      }
      boosted.push(`${pair.pA.name} &amp; ${pair.pB.name}`);
    });
    if (typeof spawnSpontaneousTeamChat === "function") {
      spawnSpontaneousTeamChat(t, "CRIAR_TECNICA");
    }
    if (boosted.length > 0) {
      synergyExtraMsg = ` • <span class="b-tech">+22 Sintonia</span> (${boosted.join(", ")})`;
    }
  }
  t.prep.appliedMsg = `${event.title} concluído: <span class="b-lvl">${affectedPlayers.length} jogador(es)</span> evoluíram (<span class="b-pwr">+${totalPwr} Poder Total</span>${event.teamChem ? ` • <span class="b-chem">+${event.teamChem}% Química</span>` : ""}${synergyExtraMsg}).`;
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
  const indivPwrGain = event.indivPower || 20;
  const prevLvl = getPlayerLevel(player);
  const beforePwr = calcIndividualPlayerPower(player, slot.role, prevLvl);

  if (event.kind === "ELEM_BOOST_PICK") {
    const targetElem = player.element || "Fogo";
    if (!Array.isArray(player.equippedItems)) player.equippedItems = [];
    player.equippedItems.push({ id: event.id, title: `${event.title} (${targetElem})`, icon: event.icon });
    if (!Array.isArray(t.prepBonuses.boostedElements)) t.prepBonuses.boostedElements = [];
    if (!t.prepBonuses.boostedElements.includes(targetElem)) {
      t.prepBonuses.boostedElements.push(targetElem);
    }
    t.prepBonuses.boostedElement = targetElem;
    let totalElemPwr = 0;
    getSlots().forEach((s) => {
      const mate = state.squad[s.id];
      if (mate && mate.element === targetElem) {
        const mPrevLvl = getPlayerLevel(mate);
        const bPwr = calcIndividualPlayerPower(mate, s.role, mPrevLvl);
        const xpRes = gainPlayerXp(mate, 125, s.role);
        mate.bonusPower = (mate.bonusPower || 0) + indivPwrGain;
        const mNewLvl = getPlayerLevel(mate);
        const learnedMoves = xpRes.learnedMoves || [];
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
      else if (event.id === "misanga_friend" || event.id === "captain_armband") {
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
      const usedKeshins = new Set(
        Object.values(state.squad || {})
          .filter((sp) => sp && sp.keshin && sp.keshin.name)
          .map((sp) => sp.keshin.name)
      );
      const chosenK = pickCanonicalKeshinForPlayer(player, slot.role, usedKeshins, null);
      player.keshin = chosenK;
      player.level = prevLvl + lvlGain;
      player.bonusPower = (player.bonusPower || 0) + indivPwrGain;
      const newLvl = getPlayerLevel(player);
      const learnedMoves = checkAndLearnLevelMoves(player, slot.role);
      const afterPwr = calcIndividualPlayerPower(player, slot.role, newLvl);
      const pwrDelta = Math.max(0, afterPwr - beforePwr);
      const moveSuffix = chosenK.move ? ` • ${chosenK.move}` : "";
      affectedPlayers.push({
        name: player.name,
        role: slot.role,
        sprite: getPlayerFormSprite(player, slot.role),
        prevLevel: prevLvl,
        newLevel: newLvl,
        levelsGained: Math.max(0, newLvl - prevLvl),
        pwrGained: pwrDelta,
        newPwr: afterPwr,
        extraBadge: `Keshin: ${chosenK.name}${moveSuffix}`,
        learnedMoves
      });
      msg = `${player.name} despertou <span class="b-tech">${chosenK.name}</span>${chosenK.move ? ` (Hissatsu: <strong>${chosenK.move}</strong>)` : ""} (<span class="b-lvl">Nv. ${prevLvl} → Nv. ${newLvl}</span> • <span class="b-pwr">+${pwrDelta} Poder</span>).`;
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

  // Treinos do Inabikari (Keshin / Manual / Evolução) também dão +65 XP reais para o restante do time titular!
  if (event.kind === "KESHIN_PICK" || event.kind === "EVO_PICK") {
    getSlots().forEach((s) => {
      if (s.id === slotId) return;
      const mate = state.squad[s.id];
      if (!mate) return;
      const mPrevLvl = getPlayerLevel(mate);
      const mBeforePwr = calcIndividualPlayerPower(mate, s.role, mPrevLvl);
      const mXp = gainPlayerXp(mate, 65, s.role);
      const mNewLvl = getPlayerLevel(mate);
      const mAfterPwr = calcIndividualPlayerPower(mate, s.role, mNewLvl);
      if (mXp.levelsGained > 0 || (mXp.learnedMoves && mXp.learnedMoves.length > 0)) {
        affectedPlayers.push({
          name: mate.name,
          role: s.role,
          sprite: getPlayerFormSprite(mate, s.role),
          prevLevel: mPrevLvl,
          newLevel: mNewLvl,
          levelsGained: Math.max(0, mNewLvl - mPrevLvl),
          pwrGained: Math.max(0, mAfterPwr - mBeforePwr),
          newPwr: mAfterPwr,
          extraBadge: "+65 XP Coletivo",
          learnedMoves: mXp.learnedMoves || []
        });
      }
    });
    msg += ` <span class="b-lvl">(+65 XP coletivo para os outros 10 titulares!)</span>`;
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

function computeGroupChatClimate(selectedIds, t = state.tournament) {
  const validIds = Array.isArray(selectedIds) ? selectedIds.filter((id) => state.squad[id]) : [];
  const teamChem = typeof calcSquadStats === "function" ? (calcSquadStats()?.chem || 0) : 40;
  let pairPtsSum = 0;
  let pairCount = 0;
  let relBonus = 0;
  let egoClash = 0;

  for (let i = 0; i < validIds.length; i++) {
    for (let j = i + 1; j < validIds.length; j++) {
      const pA = state.squad[validIds[i]];
      const pB = state.squad[validIds[j]];
      const ent = typeof getPairAffinityEntry === "function" ? getPairAffinityEntry(pA, pB, t) : { points: 0, level: 0 };
      pairPtsSum += ent?.points || 0;
      pairCount++;
      if (typeof hasFriendshipLinkBetween === "function" && hasFriendshipLinkBetween(pA, pB)) {
        relBonus += 16;
      }
      if (pA.teamId && pA.teamId === pB.teamId) {
        relBonus += 10;
      }
      if (pA.element && pA.element === pB.element) {
        relBonus += 6;
      }
      const arcA = pA.archetype || "";
      const arcB = pB.archetype || "";
      if (arcA === "INDIVIDUALISTA" && arcB === "INDIVIDUALISTA" && (ent?.points || 0) < 35) {
        egoClash += 12;
      }
    }
  }

  const avgPairPts = pairCount > 0 ? pairPtsSum / pairCount : 0;
  const rawScore = Math.round(avgPairPts * 0.62 + teamChem * 0.46 + relBonus - egoClash);
  const climateScore = Math.max(0, Math.min(110, rawScore));

  if (climateScore < 26 || (teamChem < 24 && avgPairPts < 18)) {
    return {
      id: "TOXICO",
      label: "Clima Tenso • Discórdia",
      badgeClass: "is-toxic",
      icon: "⚡💢",
      climateScore,
      avgPairPts: Math.round(avgPairPts),
      teamChem: Math.round(teamChem),
      hint: "Química baixa gera intrigas e cobranças duras no grupo. Medie o clima antes de tentar técnicas combinadas."
    };
  }
  if (climateScore < 48) {
    return {
      id: "NEUTRO",
      label: "Resenha • Quebrando o Gelo",
      badgeClass: "is-neutral",
      icon: "💬😅",
      climateScore,
      avgPairPts: Math.round(avgPairPts),
      teamChem: Math.round(teamChem),
      hint: "Clima leve entre provocações e estudo do rival. Boa chance de elevar sintonia e começar a esboçar jogadas."
    };
  }
  if (climateScore < 74) {
    return {
      id: "CONFIANCA",
      label: "Alta Confiança • Ideias em Dobro",
      badgeClass: "is-trust",
      icon: "🔥🤝",
      climateScore,
      avgPairPts: Math.round(avgPairPts),
      teamChem: Math.round(teamChem),
      hint: "Elogios mútuos e sintonia afiada! Grande chance de aprender uma Técnica Combinada em Dupla/Trio."
    };
  }
  return {
    id: "SINTONIA_MAX",
    label: "Sintonia Máxima • Imparáveis!",
    badgeClass: "is-max",
    icon: "⚡🌟",
    climateScore,
    avgPairPts: Math.round(avgPairPts),
    teamChem: Math.round(teamChem),
    hint: "Entrosamento absoluto! Técnicas combinadas fluem naturalmente e fortalecem cada passe no próximo jogo."
  };
}

function getNextOpponentDisplayName(t) {
  const prep = t?.prep;
  const nextStage = t?.stages?.[prep?.nextStageIdx];
  return nextStage?.opp?.name || nextStage?.oppTeam?.name || nextStage?.team?.name || nextStage?.stageName || "o próximo adversário";
}

function getPlayerSignatureMoveName(p) {
  if (!p) return "Chute Relâmpago";
  const order = p.pos === "GK" ? ["GK", "DF", "SH", "OF"] : p.pos === "DF" ? ["DF", "OF", "SH", "GK"] : p.pos === "MF" ? ["OF", "SH", "DF", "GK"] : ["SH", "OF", "DF", "GK"];
  for (const cat of order) {
    if (Array.isArray(p.moves?.[cat]) && p.moves[cat][0]) return p.moves[cat][0];
  }
  return p.hissatsu || "Super Técnica";
}

const CHAT_ROLE_LABELS = {
  GK: "Goleiro",
  DF: "Zagueiro",
  MF: "Meia",
  FW: "Atacante"
};

const CHAT_ARCHETYPE_LABELS = {
  KEEPER_WALL: "Guardião",
  EGO_STRIKER: "Artilheiro",
  STRATEGIST: "Estrategista",
  PACE_LEADER: "Velocista",
  WARRIOR: "Guerreiro",
  COLLECTIVE: "Colaborativo"
};

const OPPOSITE_ELEM_PAIRS = new Set([
  "Fogo|Gelo", "Gelo|Fogo",
  "Fogo|Terra", "Terra|Fogo",
  "Vento|Terra", "Terra|Vento",
  "Montanha|Vento", "Vento|Montanha",
  "Fogo|Vento", "Vento|Fogo"
]);

function buildChatActorProfile(slot, player, t = state.tournament) {
  const tac = typeof getTactics === "function" ? getTactics() : {};
  const capObj = typeof getActiveTeamCaptain === "function" ? getActiveTeamCaptain() : null;
  const isAce = Boolean(tac.acePlayerId && player.id === tac.acePlayerId);
  const archetype = typeof computePlayerArchetype === "function"
    ? computePlayerArchetype(player, slot.role, isAce ? "CAMISA_10" : "NONE")
    : "COLLECTIVE";
  const moves = player.moves || {};
  const shMove = (Array.isArray(moves.SH) && moves.SH[0]) || "Chute Relâmpago";
  const ofMove = (Array.isArray(moves.OF) && moves.OF[0]) || "Drible Relâmpago";
  const dfMove = (Array.isArray(moves.DF) && moves.DF[0]) || "Corte Rápido";
  const gkMove = (Array.isArray(moves.GK) && moves.GK[0]) || "Mão Fantasma";
  const sigMove =
    slot.role === "GK" ? gkMove :
    slot.role === "DF" ? dfMove :
    slot.role === "MF" ? (moves.OF?.[0] || moves.SH?.[0] || ofMove) :
    shMove;
  return {
    slotId: slot.id,
    id: player.id,
    name: player.name,
    role: slot.role,
    roleLabel: CHAT_ROLE_LABELS[slot.role] || "Titular",
    archetype,
    archetypeLabel: CHAT_ARCHETYPE_LABELS[archetype] || "Colaborativo",
    element: player.element || "Vento",
    sprite: typeof getPlayerFormSprite === "function" ? getPlayerFormSprite(player, slot.role) : player.sprite,
    shMove,
    ofMove,
    dfMove,
    gkMove,
    sigMove,
    keshinName: player.keshin?.name || null,
    equipTitle: Array.isArray(player.equippedItems) && player.equippedItems[0]?.title ? player.equippedItems[0].title : null,
    isCaptain: Boolean(capObj?.player?.id && capObj.player.id === player.id),
    isAce,
    level: typeof getPlayerLevel === "function" ? getPlayerLevel(player) : 1
  };
}

function getSquadChatActors(t = state.tournament) {
  const slots = typeof getSlots === "function" ? getSlots() : [];
  const out = [];
  slots.forEach((slot) => {
    const p = state.squad?.[slot.id];
    if (p) out.push(buildChatActorProfile(slot, p, t));
  });
  return out;
}

function pickChatActorsByPredicates(actors, specs = []) {
  if (!Array.isArray(actors) || actors.length < 2) return [];
  const picked = [];
  const used = new Set();
  const tryPick = (predFn, roleFallback = null) => {
    const avail = actors.filter((a) => !used.has(a.slotId));
    if (avail.length === 0) return null;
    let found = predFn ? avail.find((a) => predFn(a, picked)) : null;
    if (!found && roleFallback) {
      found = avail.find((a) => a.role === roleFallback);
    }
    if (!found) {
      found = avail[Math.floor(Math.random() * avail.length)];
    }
    if (found) {
      used.add(found.slotId);
      picked.push(found);
    }
    return found;
  };
  specs.forEach((sp) => {
    if (typeof sp === "function") tryPick(sp, null);
    else if (sp && typeof sp === "object") tryPick(sp.pred, sp.role);
  });
  return picked;
}

function pickChatVariant(list) {
  if (!Array.isArray(list) || list.length === 0) return "";
  return list[Math.floor(Math.random() * list.length)];
}

function getTopOutfieldRivalHighlight(t = state.tournament) {
  try {
    const idx = t?.prep?.nextStageIdx ?? t?.stageIndex ?? 0;
    const stg = t?.stages?.[idx];
    const oppTeam = stg?.oppTeam;
    if (!oppTeam || typeof calcOpponentStats !== "function") return null;
    const stats = calcOpponentStats(oppTeam, idx);
    const hl = (stats?.highlights || []).find((h) => h.role !== "GK" && h.player?.id);
    if (hl) {
      return {
        id: hl.player.id,
        name: hl.player.name,
        role: hl.role,
        primaryMove: hl.primaryMove || "Técnica Principal"
      };
    }
    const pOut = (oppTeam.players || []).find((p) => p && p.pos !== "GK" && p.id);
    return pOut ? { id: pOut.id, name: pOut.name, role: pOut.pos || "FW", primaryMove: pOut.hissatsu || "Super Técnica" } : null;
  } catch {
    return null;
  }
}

function describeChatTacticsPatch(patch, actors = [], ctx = {}) {
  if (!patch || typeof patch !== "object") return "";
  const parts = [];
  if (patch.posture) {
    parts.push({ offensive: "Avançado", defensive: "Recuado", balanced: "Equilibrado" }[patch.posture] || patch.posture);
  }
  if (patch.style) {
    parts.push({ vertical: "Vertical", possession: "Posse", free: "Instinto" }[patch.style] || patch.style);
  }
  if (patch.lane) {
    parts.push({ wings: "Pontas", center: "Meio", balanced: "Livre" }[patch.lane] || patch.lane);
  }
  if (patch.intensity) {
    parts.push(`Esforço ${patch.intensity === "high" ? "Alta" : patch.intensity === "low" ? "Baixa" : "Média"}`);
  }
  if (patch.hissatsuTactic && typeof HISSATSU_TACTICS_CATALOG === "object" && HISSATSU_TACTICS_CATALOG[patch.hissatsuTactic]) {
    parts.push(HISSATSU_TACTICS_CATALOG[patch.hissatsuTactic].name);
  }
  if (patch.captainActorIdx != null && actors[patch.captainActorIdx]) {
    parts.push(`Cap: ${actors[patch.captainActorIdx].name}`);
  }
  if (patch.aceActorIdx === "CLEAR") {
    parts.push("Camisa 10: Auto");
  } else if (patch.aceActorIdx != null && actors[patch.aceActorIdx]) {
    parts.push(`10: ${actors[patch.aceActorIdx].name}`);
  }
  if (patch.markRival === true) {
    parts.push(`Marcar: ${ctx.rivalStar?.name || "Rival"}`);
  } else if (patch.markRival === "CLEAR") {
    parts.push("Marcação Livre");
  }
  if (patch.formation) {
    parts.push(patch.formation);
  }
  return parts.length > 0 ? `⚙️ ${parts.slice(0, 2).join(" • ")}` : "";
}

function applyChatTacticalPatch(t, patch, actors = [], ctx = {}) {
  if (typeof isBetaMode === "function" && !isBetaMode()) return [];
  if (!t || !patch || typeof patch !== "object") return [];
  const tac = typeof getTactics === "function" ? getTactics() : null;
  if (!tac) return [];
  const changes = [];

  if (patch.posture && ["offensive", "balanced", "defensive"].includes(patch.posture)) {
    tac.posture = patch.posture;
    changes.push(`Postura: ${{ offensive: "Avançado", balanced: "Equilibrado", defensive: "Recuado" }[patch.posture]}`);
  }
  if (patch.style && ["vertical", "possession", "free"].includes(patch.style)) {
    tac.style = patch.style;
    changes.push(`Estilo: ${{ vertical: "Vertical", possession: "Posse", free: "Instinto" }[patch.style]}`);
  }
  if (patch.lane && ["wings", "center", "balanced"].includes(patch.lane)) {
    tac.lane = patch.lane;
    changes.push(`Corredor: ${{ wings: "Pontas", center: "Meio", balanced: "Livre" }[patch.lane]}`);
  }
  if (patch.intensity && ["high", "medium", "low"].includes(patch.intensity)) {
    tac.intensity = patch.intensity;
    changes.push(`Esforço: ${{ high: "Alta", medium: "Média", low: "Baixa" }[patch.intensity]}`);
  }
  if (patch.hissatsuTactic && typeof HISSATSU_TACTICS_CATALOG === "object" && HISSATSU_TACTICS_CATALOG[patch.hissatsuTactic]) {
    tac.hissatsuTactic = patch.hissatsuTactic;
    changes.push(`Tática Especial: ${HISSATSU_TACTICS_CATALOG[patch.hissatsuTactic].name}`);
  }
  if (patch.captainActorIdx != null && actors[patch.captainActorIdx]?.id) {
    tac.captainPlayerId = actors[patch.captainActorIdx].id;
    changes.push(`Capitão: ${actors[patch.captainActorIdx].name}`);
  }
  if (patch.aceActorIdx === "CLEAR") {
    tac.acePlayerId = null;
    changes.push("Camisa 10: Automático");
  } else if (patch.aceActorIdx != null && actors[patch.aceActorIdx]?.id) {
    tac.acePlayerId = actors[patch.aceActorIdx].id;
    changes.push(`Camisa 10: ${actors[patch.aceActorIdx].name}`);
  }
  if (patch.markRival === true) {
    const targetRival = ctx.rivalStar || getTopOutfieldRivalHighlight(t);
    if (targetRival?.id) {
      tac.markedOppId = targetRival.id;
      changes.push(`Marcação Especial: ${targetRival.name}`);
    }
  } else if (patch.markRival === "CLEAR") {
    tac.markedOppId = null;
    changes.push("Marcação Especial: Livre");
  }
  if (patch.formation && typeof switchTeamFormation === "function" && DB?.formations?.[patch.formation] && state.formation !== patch.formation) {
    const switched = switchTeamFormation(patch.formation);
    if (switched) {
      changes.push(`Formação: ${patch.formation}`);
      // Re-mapeia slotId dos chats abertos pelo player.id após trocar a formação
      if (Array.isArray(t.prep?.teamChats) && typeof getSlots === "function") {
        const curSlots = getSlots();
        const idToSlot = {};
        curSlots.forEach((sl) => {
          const p = state.squad?.[sl.id];
          if (p?.id) idToSlot[p.id] = sl.id;
        });
        t.prep.teamChats.forEach((ch) => {
          if (Array.isArray(ch.participants)) {
            ch.participants.forEach((pt) => {
              if (pt.id && idToSlot[pt.id]) pt.slotId = idToSlot[pt.id];
            });
            ch.selectedIds = ch.participants.map((pt) => pt.slotId).filter(Boolean);
          }
        });
      }
    }
  }
  return changes;
}

function mkSpontaneousMsg(actors, senderIdx, text, tone = "normal", opts = {}) {
  const actor = actors[senderIdx] || actors[0];
  return {
    senderIdx,
    speakerRole: `P${senderIdx}`,
    speakerName: actor.name,
    speakerSprite: actor.sprite,
    roleTag: `${actor.roleLabel} • ${actor.archetypeLabel}`,
    tone,
    quote: opts.quote || null,
    time: opts.time || null,
    text
  };
}

function buildShuffledChatChoices(actors, defs, ctx = {}) {
  const list = ["great", "good", "poor"].map((q) => {
    const d = defs[q];
    const patchDesc = d.tacticsPatch ? describeChatTacticsPatch(d.tacticsPatch, actors, ctx) : "";
    return {
      quality: q.toUpperCase(),
      label: d.label,
      approachTag: d.approachTag,
      configTag: patchDesc,
      tacticsPatch: d.tacticsPatch || null,
      coachLine: d.coachLine,
      reactions: d.reactions.map((r) =>
        typeof r === "function" ? r() : mkSpontaneousMsg(actors, r.idx, r.text, r.tone || "normal", { quote: r.quote || null })
      )
    };
  });
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list.map((item, idx) => ({ ...item, id: idx }));
}

const CHAT_CATEGORY_META = {
  RAIVA: { categoryLabel: "Tensão / Discórdia", categoryIcon: "💢", badgeClass: "is-toxic" },
  CRIAR_TECNICA: { categoryLabel: "Criação de Técnica", categoryIcon: "⚡", badgeClass: "is-idea" },
  ELOGIO: { categoryLabel: "Elogio & União", categoryIcon: "🌟", badgeClass: "is-max" },
  TATICA_RIVAL: { categoryLabel: "Estudo do Rival", categoryIcon: "📋", badgeClass: "is-trust" },
  RESENHA: { categoryLabel: "Resenha de Elenco", categoryIcon: "💬", badgeClass: "is-neutral" }
};

function makeChatTpl(id, category, title, specs, buildDialogue, buildChoices) {
  const meta = CHAT_CATEGORY_META[category] || CHAT_CATEGORY_META.RESENHA;
  return {
    id,
    category,
    title,
    categoryLabel: meta.categoryLabel,
    categoryIcon: meta.categoryIcon,
    badgeClass: meta.badgeClass,
    pickActors: (actors) => pickChatActorsByPredicates(actors, specs),
    buildDialogue,
    buildChoices
  };
}

const SPONTANEOUS_CHAT_TEMPLATES = [
  // ===================== RAIVA / ATRITOS (8) =====================
  makeChatTpl(
    "rage_gk_vs_df",
    "RAIVA",
    "Cobrança na Grande Área",
    [
      { pred: (a) => a.role === "GK", role: "GK" },
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "DF" || a.role === "MF", role: "DF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Já deu! Eu fico me esticando inteiro na ${actors[0].gkMove} e vocês continuam abrindo o corredor pro chute livre!`, "toxic"),
      mkSpontaneousMsg(actors, 1, `Não vem jogar a culpa só na defesa, ${actors[0].name}! Contra ${ctx.oppName}, o meio não acompanha a segunda bola e sobra tudo nas nossas costas!`, "toxic"),
      mkSpontaneousMsg(actors, 2, `Eu até tento dar cobertura com ${actors[2].dfMove}, mas ninguém avisa quando o ponta corta pro meio...`, "tense"),
      mkSpontaneousMsg(actors, 0, `Pois ou a linha conversa antes da área ou eu não respondo pelos chutes de ${ctx.oppName}!`, "toxic")
    ],
    (actors, ctx) => buildShuffledChatChoices(actors, {
      great: {
        label: "Definir gatilho de grito entre Goleiro e Zaga pra fechar o centro",
        approachTag: "Ajuste Defensivo",
        coachLine: `${actors[0].name}, você enxerga o campo inteiro. Comande a linha e ${actors[1].name}, feche o corredor antes da área!`,
        reactions: [
          { idx: 0, text: `Agora sim! Eu aviso a dobra na hora certa e ninguém entra limpo.`, tone: "calm" },
          { idx: 1, text: `Combinado! Se vier o comando da meta, eu travo na hora com ${actors[1].dfMove}.`, tone: "calm" },
          { idx: 2, text: `Com a linha alinhada desse jeito, ${ctx.oppName} vai bater na parede.`, tone: "hype" }
        ]
      },
      good: {
        label: "Pedir calma e dividir a responsabilidade entre todos",
        approachTag: "Apaziguar",
        coachLine: `Todo setor erra e acerta junto. Respirem fundo e simplifiquem a marcação hoje.`,
        reactions: [
          { idx: 1, text: `Certo... vou ficar mais atento na cobertura.`, tone: "calm" },
          { idx: 0, text: `Beleza, menos falação e mais atenção.`, tone: "normal" }
        ]
      },
      poor: {
        label: "Cobrar só o Goleiro pra defender qualquer chute",
        approachTag: "Pulso Firme",
        coachLine: `${actors[0].name}, goleiro decisivo garante mesmo se a zaga falhar — para de reclamar e segura tudo!`,
        reactions: [
          { idx: 0, text: `Ah, claro! Agora eu viro mágico sozinho contra onze?! Inacreditável...`, tone: "toxic" },
          { idx: 1, text: `Puts... isso só deixou o clima ainda mais pesado no vestiário.`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "rage_ego_vs_strat",
    "RAIVA",
    "Fominha ou Lento?",
    [
      { pred: (a) => a.archetype === "EGO_STRIKER" || a.role === "FW", role: "FW" },
      { pred: (a) => a.archetype === "STRATEGIST" || a.role === "MF", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Você segura a bola demais no meio, ${actors[1].name}! Eu faço o facão com minha ${actors[0].shMove} pronta e o passe nunca chega!`, "toxic"),
      mkSpontaneousMsg(actors, 1, `Claro que não chega! Você corre em linha reta pro meio de três marcadores e acha que eu tenho telepatia!`, "toxic"),
      mkSpontaneousMsg(actors, 0, `Sou ${actors[0].archetypeLabel}, minha função é definir! Contra ${ctx.oppName} precisa ser mais direto!`, "toxic"),
      mkSpontaneousMsg(actors, 1, `E eu organizo o time! Sem ângulo decente sua corrida só entrega contra-ataque!`, "tense")
    ],
    (actors, ctx) => buildShuffledChatChoices(actors, {
      great: {
        label: "Marcar sinal visual: meia segura 1 tempo pro atacante abrir em diagonal",
        approachTag: "Sincronia Tática",
        coachLine: `${actors[1].name} dita o segundo do passe; ${actors[0].name}, espere o ombro girar e ataque a diagonal livre.`,
        reactions: [
          { idx: 1, text: `Se ele cortar na diagonal assim, eu coloco na medida com ${actors[1].ofMove}!`, tone: "idea" },
          { idx: 0, text: `Demorou! Manda no espaço que eu chego destruindo contra ${ctx.oppName}!`, tone: "hype" }
        ]
      },
      good: {
        label: "Pedir pra respeitarem a função de cada um em campo",
        approachTag: "Mediação",
        coachLine: `Precisamos do instinto de gol e da cabeça fria juntos. Sem brigas no treino.`,
        reactions: [
          { idx: 0, text: `Tudo bem, vou esperar o tempo certo.`, tone: "calm" },
          { idx: 1, text: `E eu acelero o passe quando vir ele livre.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Mandar cada um resolver do seu jeito sem depender do outro",
        approachTag: "Dar Liberdade",
        coachLine: `Se não se entendem no passe, esqueçam a tabela e cada um resolve no talento individual.`,
        reactions: [
          { idx: 0, text: `Beleza! Então nem espere toque meu na área também!`, tone: "toxic" },
          { idx: 1, text: `Ótimo... agora que não saem mais dois toques juntos mesmo.`, tone: "toxic" }
        ]
      }
    })
  ),

  makeChatTpl(
    "rage_pace_vs_pace",
    "RAIVA",
    "Passe Atrasado na Corrida",
    [
      { pred: (a) => a.archetype === "PACE_LEADER" || a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "DF" || a.role === "MF", role: "DF" },
      { pred: (a) => a.role === "MF", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Quando eu disparo pela ponta, a bola tem que viajar na minha frente, não no meu calcanhar!`, "toxic"),
      mkSpontaneousMsg(actors, 1, `Pera lá, ${actors[0].name}! Você arranca a mil sem olhar se eu tô cercado!`, "toxic"),
      mkSpontaneousMsg(actors, 2, `A verdade é que vocês tão fora de sintonia no tempo do lançamento. ${ctx.oppName} vai cortar todas assim.`, "tense")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Instruir passe adiantado no espaço vazio pro velocista atacar na passada",
        approachTag: "Bola no Espaço",
        coachLine: `${actors[1].name}, não mire no pé dele — jogue 5 metros à frente no espaço vivo pro ${actors[0].name} usar a velocidade!`,
        reactions: [
          { idx: 0, text: `ISSO! Bola solta na frente é tudo que eu preciso pra sumir na corrida!`, tone: "hype" },
          { idx: 1, text: `Beleza, agora fica muito mais fácil lançar sabendo onde você vai buscar.`, tone: "calm" }
        ]
      },
      good: {
        label: "Pedir pro ponta reduzir um pouco a arrancada pra facilitar o passe",
        approachTag: "Pausa",
        coachLine: `${actors[0].name}, segure meio passo antes da linha pra dar janela limpa ao passador.`,
        reactions: [
          { idx: 0, text: `Aham... não gosto de frear, mas vou tentar sincronizar.`, tone: "normal" },
          { idx: 1, text: `Ajuda bem na hora de achar o ângulo.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Criticar a falta de técnica de ambos na frente do grupo",
        approachTag: "Cobrança Dura",
        coachLine: `Com esse nível de erro primário de passe e corrida, nenhum dos dois aguenta jogo grande!`,
        reactions: [
          { idx: 0, text: `Valeu pelo apoio hein, treinador... motivador demais.`, tone: "toxic" },
          { idx: 2, text: `Clima azedou feio no grupo agora.`, tone: "toxic" }
        ]
      }
    })
  ),

  makeChatTpl(
    "rage_trio_triangle",
    "RAIVA",
    "Curto-Circuito na Saída",
    [
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Quando eu roubo com ${actors[0].dfMove}, olho pro meio e não tem ninguém pra receber!`, "toxic"),
      mkSpontaneousMsg(actors, 1, `Porque o ataque deita lá na frente e eu fico sozinho contra três volantes de ${ctx.oppName}!`, "toxic"),
      mkSpontaneousMsg(actors, 2, `Se eu voltar toda hora pra buscar no círculo central, quem fica lá na frente pra assustar a zaga deles?!`, "toxic")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Montar triângulo curto: DF entrega no MF que gira de primeira pro FW",
        approachTag: "Estrutura 3 Setores",
        coachLine: `${actors[1].name} se aproxima como pivô de tabela, e ${actors[2].name} recua só 4 passos pra puxar o zagueiro e abrir o espaço!`,
        reactions: [
          { idx: 1, text: `Genial! Recebo de costas já sabendo onde o ${actors[2].name} tá livre!`, tone: "idea" },
          { idx: 0, text: `Aí sim! Saída limpa e sem desespero.`, tone: "calm" },
          { idx: 2, text: `E quando girar pra frente, sobra espaço pra minha arrancada!`, tone: "hype" }
        ]
      },
      good: {
        label: "Subir os três juntos em bloco mais compacto",
        approachTag: "Compactação",
        coachLine: `Encurtam a distância entre zaga e ataque em 10 metros. Fica tudo mais próximo.`,
        reactions: [
          { idx: 1, text: `Faz sentido, reduz meu sufoco no meio.`, tone: "calm" },
          { idx: 2, text: `Posso testar me aproximar um pouco mais.`, tone: "normal" }
        ]
      },
      poor: {
        label: "Mandar o zagueiro só dar chutão pra frente e ignorar o meio",
        approachTag: "Bola Longa Forçada",
        coachLine: `${actors[0].name}, esmaga a bola pro alto lá na frente e acabou a discussão!`,
        reactions: [
          { idx: 1, text: `E eu virei enfeite no meio-campo agora?!`, tone: "toxic" },
          { idx: 2, text: `Chutão cego contra três zagueiros não funciona, treinador!`, tone: "toxic" }
        ]
      }
    })
  ),

  makeChatTpl(
    "rage_fatigue_temp",
    "RAIVA",
    "Nervos à Flor da Pele",
    [
      { pred: (a) => a.isCaptain || a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "DF", role: "DF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 1, `Com a energia do time em ${ctx.teamEnergy}%, todo mundo tá chegando atrasado nas divididas e se xingando no treino!`, "tense"),
      mkSpontaneousMsg(actors, 2, `Não aguenta a pressão vai descansar no banco! Aqui ninguém dá moleza pra ${ctx.oppName}!`, "toxic"),
      mkSpontaneousMsg(actors, 0, `Chega de grosseria! Descontar o cansaço nos colegas não faz ninguém correr mais rápido!`, "tense")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Transformar a irritação em foco competitivo e economia inteligente de fôlego",
        approachTag: "Canalizar Raiva",
        coachLine: `Guardem essa raiva pros adversários! Dosando corridas inúteis e soltando a bola rápido, vocês transformam tensão em força pura nos duelos!`,
        reactions: [
          { idx: 2, text: `Tem razão... descontar em ${actors[1].name} não resolve. Quero é passar por cima dos rivais!`, tone: "hype" },
          { idx: 0, text: `Boa, treinador. Cabeça no lugar e sangue nos olhos no apito!`, tone: "calm" },
          { idx: 1, text: `Fechado! Toda essa adrenalina agora vai pro jogo.`, tone: "hype" }
        ]
      },
      good: {
        label: "Pedir pra encerrarem o bate-boca e hidratarem juntos",
        approachTag: "Paz no Grupo",
        coachLine: `Pausa pra água agora. Esfriem a cabeça antes de entrar em campo.`,
        reactions: [
          { idx: 1, text: `Beleza... precisava mesmo respirar.`, tone: "calm" },
          { idx: 2, text: `Tudo certo então.`, tone: "normal" }
        ]
      },
      poor: {
        label: "Dobrar a intensidade do atrito colocando os dois pra se marcar duro",
        approachTag: "Incendiar Clima",
        coachLine: `Vão pro 1x1 agora e mostrem quem tem mais pulmão aqui!`,
        reactions: [
          { idx: 1, text: `Nessa altura você quer estourar todo mundo antes da partida?!`, tone: "toxic" },
          { idx: 2, text: `Se a gente se lesionar aqui a culpa é sua!`, tone: "toxic" }
        ]
      }
    })
  ),

  makeChatTpl(
    "rage_element_clash",
    "RAIVA",
    "Choque de Elementos",
    [
      { pred: () => true, role: "FW" },
      { pred: (a, p) => OPPOSITE_ELEM_PAIRS.has(`${p[0]?.element}|${a.element}`), role: "MF" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 0, `Minha afinidade de ${actors[0].element} pede explosão e corte seco, mas o seu ritmo de ${actors[1].element} quebra minha passada!`, "toxic"),
      mkSpontaneousMsg(actors, 1, `Engraçado! Pra mim quem atropela tudo sem pensar é justamente o seu estilo de ${actors[0].element}!`, "toxic"),
      mkSpontaneousMsg(actors, 0, `Desse jeito nossas jogadas nunca vão somar força nenhuma!`, "tense")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Usar o contraste dos elementos pra confundir a marcação em dois tempos",
        approachTag: "Contraste Elemental",
        coachLine: `Vocês não precisam ser iguais! Use ${actors[1].element} pra atrair o marcador e solte pro corte de ${actors[0].element} pegar o rival no contrapé!`,
        reactions: [
          { idx: 1, text: `Peraí... contraste de ritmo quebra o zagueiro na hora! Boa leitura!`, tone: "idea" },
          { idx: 0, text: `Gostei disso! Fica até mais imprevisível pro goleiro deles!`, tone: "hype" }
        ]
      },
      good: {
        label: "Focar nos fundamentos neutros sem depender de sinergia elemental",
        approachTag: "Fundamento Básico",
        coachLine: `Esqueçam o estilo por um segundo — um passe simples no pé sempre funciona.`,
        reactions: [
          { idx: 0, text: `É, no simples não tem como errar tanto.`, tone: "calm" },
          { idx: 1, text: `Verdade, menos atrito assim.`, tone: "normal" }
        ]
      },
      poor: {
        label: "Mandar evitarem trocar passes entre si durante a partida",
        approachTag: "Isolar Setor",
        coachLine: `Se ${actors[0].element} e ${actors[1].element} não batem, joguem em lados opostos e nem passem um pro outro.`,
        reactions: [
          { idx: 0, text: `Isolar o próprio time? Isso só deixa a gente mais previsível!`, tone: "toxic" },
          { idx: 1, text: `Terrível decisão...`, tone: "toxic" }
        ]
      }
    })
  ),

  makeChatTpl(
    "rage_shot_greed",
    "RAIVA",
    "Quem Bate a Bola?",
    [
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "FW" || a.archetype === "EGO_STRIKER", role: "MF" },
      { pred: (a) => a.role === "MF", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Duas vezes na cara da área eu tava livre de frente e você preferiu forçar a ${actors[1].shMove} na muralha deles!`, "toxic"),
      mkSpontaneousMsg(actors, 1, `Se eu chegar com espaço eu chuto mesmo! Eu não sou garçom de ninguém, ${actors[0].name}!`, "toxic"),
      mkSpontaneousMsg(actors, 2, `Enquanto os dois disputam quem aparece na foto do gol, ${ctx.oppName} agradece os chutes bloqueados...`, "tense")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Regra clara: quem estiver com ângulo limpo finaliza; marcado, rola pro lado!",
        approachTag: "Hierarquia de Área",
        coachLine: `Gosto da fome de gol dos dois! Mas quem estiver sem bloqueio direto finaliza; se tiver dois marcadores na frente, rola que o colega empurra!`,
        reactions: [
          { idx: 0, text: `Justo! Se ele tiver ângulo limpo eu até abro espaço puxando o zagueiro.`, tone: "calm" },
          { idx: 1, text: `Fechado! Mas quando eu tiver livre não reclama se eu soltar o pé!`, tone: "hype" },
          { idx: 2, text: `Finalmente bom senso dentro da grande área!`, tone: "calm" }
        ]
      },
      good: {
        label: "Alternar as jogadas principais pelos dois corredores",
        approachTag: "Dividir Bolas",
        coachLine: `Vamos alternar os ataques entre os dois lados para ambos terem chances reais.`,
        reactions: [
          { idx: 1, text: `Justo pra todo mundo.`, tone: "normal" },
          { idx: 0, text: `Certo, contanto que a bola chegue.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Dizer que o time inteiro deve jogar exclusivamente pra um único atacante",
        approachTag: "Privilégio",
        coachLine: `A partir de hoje só ${actors[1].name} finaliza; o resto só toca pra ele.`,
        reactions: [
          { idx: 0, text: `Tá de brincadeira comigo?! E minha ${actors[0].shMove} serve pra quê?!`, tone: "toxic" },
          { idx: 2, text: `A zaga rival vai dobrar a marcação nele em dois minutos...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "rage_warrior_hard",
    "RAIVA",
    "Entrada Firme Demais",
    [
      { pred: (a) => a.archetype === "WARRIOR" || a.role === "DF", role: "DF" },
      { pred: (a) => a.archetype === "STRATEGIST" || a.archetype === "PACE_LEADER" || a.role === "FW", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 1, `Pega leve no coletivo, ${actors[0].name}! Quase arrancou minha perna tentando testar ${actors[0].dfMove} em treino!`, "toxic"),
      mkSpontaneousMsg(actors, 0, `Se eu aliviar no treino, você vai voar no primeiro tranco de ${ctx.oppName}! Futebol não é dança de salão!`, "toxic"),
      mkSpontaneousMsg(actors, 1, `Uma coisa é intensidade, outra é quebrar o próprio camisa de criação antes do apito!`, "tense")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Elogiar a garra do zagueiro e canalizá-la pra antecipar a bola antes do contato",
        approachTag: "Intensidade Limpa",
        coachLine: `Admiro essa entrega, ${actors[0].name}! Mas use essa explosão pra cortar a linha de passe ANTES do choque — assim protege nosso time e apavora o rival!`,
        reactions: [
          { idx: 0, text: `Antecipar o corte sem dar mole... beleza! ${actors[1].name}, valeu por aguentar a pressão, vai nos deixar casca-grossa.`, tone: "calm" },
          { idx: 1, text: `Aí sim! Se antecipar desse jeito atrás, eu jogo muito mais solto na frente.`, tone: "hype" }
        ]
      },
      good: {
        label: "Separar os dois em times diferentes no rachão",
        approachTag: "Separar Lados",
        coachLine: `Vamos baixar o contato direto hoje e treinar posicionamento sem carrinho.`,
        reactions: [
          { idx: 0, text: `Certo, sem contato excessivo por hoje.`, tone: "normal" },
          { idx: 1, text: `Melhor pros tornozelos do elenco...`, tone: "calm" }
        ]
      },
      poor: {
        label: "Mandar o atacante endurecer e parar de reclamar do tranco",
        approachTag: "Ignorar Queixa",
        coachLine: `${actors[1].name}, para de chorar! Se não aguenta um toque no treino não entra no campeonato.`,
        reactions: [
          { idx: 1, text: `Beleza então... quando eu ficar travado no jogo não pergunte o motivo.`, tone: "toxic" },
          { idx: 0, text: `Tsc... até eu percebi que peguei pesado e você piorou tudo.`, tone: "tense" }
        ]
      }
    })
  ),

  // ===================== CRIAR TÉCNICA (8) =====================
  makeChatTpl(
    "tech_twin_strikers",
    "CRIAR_TECNICA",
    "Impacto em Dupla no Ataque",
    [
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "FW" || a.role === "MF", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Ei, ${actors[1].name}, tô pensando numa técnica nova absurda pra quebrar o goleiro de ${ctx.oppName}!`, "idea"),
      mkSpontaneousMsg(actors, 1, `Manda! Se misturar a velocidade da minha ${actors[1].shMove} com a pressão da sua ${actors[0].shMove}...`, "idea"),
      mkSpontaneousMsg(actors, 0, `Exato! Eu ergo a bola girando e nós dois batemos juntos no exato segundo do impacto! Eles não têm chance contra nós!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Ajustar o ângulo dos pés pro impacto simultâneo sem perder força",
        approachTag: "Sincronia Técnica",
        coachLine: `Façam um passo curto sincronizado: o toque de ${actors[0].name} cria o spin e ${actors[1].name} fecha o ângulo no segundo toque!`,
        reactions: [
          { idx: 0, text: `BATEU PERFEITO!! Senti o ar rasgar quando nossos pés encostaram juntos!`, tone: "hype" },
          { idx: 1, text: `Isso ficou INSANO! O goleiro nem vai ver da onde veio a curva!`, tone: "hype" }
        ]
      },
      good: {
        label: "Treinar primeiro com chute alternado antes de baterem juntos",
        approachTag: "Passo a Passo",
        coachLine: `Comecem num passe-chute rápido pra garantir a direção primeiro.`,
        reactions: [
          { idx: 0, text: `Boa ideia, tá pegando forma aos poucos.`, tone: "idea" },
          { idx: 1, text: `Logo a gente encaixa o tempo completo!`, tone: "normal" }
        ]
      },
      poor: {
        label: "Mandar baterem com força máxima no susto sem alinhar o tempo",
        approachTag: "Força Bruta",
        coachLine: `Só corram e chutem o mais forte que puderem ao mesmo tempo, sem perder tempo ajustando passo!`,
        reactions: [
          { idx: 0, text: `A gente quase trombou no ar e gastou fôlego à toa!`, tone: "tense" },
          { idx: 1, text: `Minha perna tá pesada e a bola saiu torta... precisa de mais treino antes.`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tech_trio_triangle",
    "CRIAR_TECNICA",
    "Formação de Triângulo Mortal",
    [
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "FW" || a.role === "MF", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Galera, tive uma visão pro jogo contra ${ctx.oppName}: se desenharmos um triângulo em alta velocidade...`, "idea"),
      mkSpontaneousMsg(actors, 1, `Tipo eu atraio o zagueiro, você limpa com ${actors[0].ofMove} e joga pro alto no terceiro vértice?`, "idea"),
      mkSpontaneousMsg(actors, 2, `Aí eu entro fechando com tudo! Uma técnica em Trio dessa varre a defesa inteira!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Calibrar o ritmo dos 3 toques de primeira em velocidade crescente",
        approachTag: "Ritmo em Trio",
        coachLine: `1-2-3 sem deixar a bola cair! Cada passe aumenta o giro da bola até explodir na conclusão!`,
        reactions: [
          { idx: 0, text: `Um... dois... AGORA!! Que sincronia absurda nós três pegamos!`, tone: "hype" },
          { idx: 1, text: `Parece até coreografia de seleção mundial!!`, tone: "hype" },
          { idx: 2, text: `Tô arrepiado! Essa técnica vai entrar pra história do time!`, tone: "hype" }
        ]
      },
      good: {
        label: "Focar primeiro na ligação entre os dois meias e o atacante finalizador",
        approachTag: "Base Segura",
        coachLine: `Vamos consolidar os dois primeiros passes pra não perder a bola no meio.`,
        reactions: [
          { idx: 0, text: `Ficou bem sólido assim!`, tone: "calm" },
          { idx: 2, text: `Bom treino de triangulação.`, tone: "normal" }
        ]
      },
      poor: {
        label: "Trocar o triângulo por jogada parada só esperando rebote",
        approachTag: "Conservador Demais",
        coachLine: `Inventar jogada em trio cansa muito — fiquem cada um fixo na sua zona esperando a sobra.`,
        reactions: [
          { idx: 0, text: `Ué... matou nossa melhor ideia antes mesmo de testar.`, tone: "tense" },
          { idx: 1, text: `Sem movimento ninguém abre aquela defesa...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tech_wing_cross",
    "CRIAR_TECNICA",
    "Cruzamento com Efeito & Voleio",
    [
      { pred: (a) => a.archetype === "PACE_LEADER" || a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `${actors[1].name}, quando eu chego na linha de fundo em velocidade, prefere que eu levante alta ou mande fechada com curva?`, "idea"),
      mkSpontaneousMsg(actors, 1, `Se você mandar girando na altura do peito, eu entro de primeira emendando com ${actors[1].shMove}!`, "hype"),
      mkSpontaneousMsg(actors, 0, `Bora treinar esse efeito na bola agora mesmo! O zagueiro de ${ctx.oppName} não vai achar nada pelo alto!`, "idea")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Treinar ponto de queda no segundo pau com curva fechada no pé dominante",
        approachTag: "Mira Aérea",
        coachLine: `${actors[0].name}, coloque rotação externa na bola pra ela descer já morrendo na entrada da pequena área pro ${actors[1].name} bater de primeira!`,
        reactions: [
          { idx: 0, text: `Olha essa curva desenhada no ar!! Caiu na medida exata!`, tone: "hype" },
          { idx: 1, text: `QUE VOLEIO!! Parecia um foguete guiado!`, tone: "hype" }
        ]
      },
      good: {
        label: "Treinar cruzamento rasteiro rápido pra garantir o domínio antes do chute",
        approachTag: "Cruzamento Baixo",
        coachLine: `Bola rápida na meia altura também facilita muito o controle na área.`,
        reactions: [
          { idx: 0, text: `Boa, bem mais seguro contra marcação baixa.`, tone: "calm" },
          { idx: 1, text: `Consigo emendar fácil assim.`, tone: "normal" }
        ]
      },
      poor: {
        label: "Proibir cruzamentos aéreos e mandar voltar sempre a bola pro meio",
        approachTag: "Bloquear Ala",
        coachLine: `Cruzamento é loteria. Chegou na linha de fundo, breca e toca pra trás.`,
        reactions: [
          { idx: 0, text: `Sério?! Todo meu trabalho de ultrapassagem pelas pontas pra recuar...`, tone: "tense" },
          { idx: 1, text: `Desanimei legal agora.`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tech_wall_defense",
    "CRIAR_TECNICA",
    "Barreira Dupla na Zaga",
    [
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "DF" || a.role === "GK", role: "DF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `${actors[1].name}, estive testando juntar ${actors[0].dfMove} com a sua cobertura quando o atacante vem embalado!`, "idea"),
      mkSpontaneousMsg(actors, 1, `Tipo você fecha a esquerda e eu entro travando a frente no mesmo tempo?!`, "idea"),
      mkSpontaneousMsg(actors, 0, `Sim! Uma técnica defensiva combinada dessas fecha qualquer atacante de ${ctx.oppName} na porta da área!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Sincronizar a dobra: primeiro tira o ângulo, segundo trava e sai jogando",
        approachTag: "Engenharia Defensiva",
        coachLine: `${actors[0].name} induz pro corredor e ${actors[1].name} fecha o cadeado no timing certo — e já sai com posse limpa!`,
        reactions: [
          { idx: 0, text: `Ninguém passa por essa muralha! Ficou sólido demais!`, tone: "hype" },
          { idx: 1, text: `E a bola ainda sobra limpa no nosso pé pra ligar o contra-ataque!`, tone: "hype" }
        ]
      },
      good: {
        label: "Treinar só a posição de bloqueio de chute sem avançar muito",
        approachTag: "Bloco Baixo",
        coachLine: `Mantenham o passo firme perto da meia-lua pra bloquear chutes diretos.`,
        reactions: [
          { idx: 0, text: `Tá bem firme assim atrás.`, tone: "calm" },
          { idx: 1, text: `Dá bastante segurança pro gol.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Mandar os dois darem o bote ao mesmo tempo no mesmo jogador",
        approachTag: "Bote Duplo Cego",
        coachLine: `Cheguem os dois juntos no portador com tudo ao mesmo tempo!`,
        reactions: [
          { idx: 0, text: `Se ele der um toque pro lado a gente bate cabeça e deixa o gol vazio!`, tone: "tense" },
          { idx: 1, text: `Bote duplo aberto assim é pedir pra tomar tabela...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tech_trio_counter",
    "CRIAR_TECNICA",
    "Contra-Ataque em 3 Segundos",
    [
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Toda vez que eu paro o ataque com ${actors[0].dfMove}, olho pra frente já querendo ligar vocês dois em 2 toques!`, "idea"),
      mkSpontaneousMsg(actors, 1, `Se eu nem dominar — já devolver de primeira por cima pro ${actors[2].name} correr no espaço...`, "idea"),
      mkSpontaneousMsg(actors, 2, `Em 3 segundos a gente sai da nossa área e já tá chutando contra ${ctx.oppName}! Vamos criar essa sequência!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Ensaiar passe de primeira do zagueiro e giro cego do meia pro atacante disparar",
        approachTag: "Transição Relâmpago",
        coachLine: `Recuperou atrás, olho no ${actors[1].name} antes mesmo da bola chegar — toque único de primeira rasgando o campo pro ${actors[2].name}!`,
        reactions: [
          { idx: 0, text: `Bola na saída perfeita!`, tone: "hype" },
          { idx: 1, text: `De primeira no ponto futuro — sem dar chance de voltarem!`, tone: "hype" },
          { idx: 2, text: `Gol em quatro segundos no treino!! ${actors[0].name}, que ligação absurda!`, tone: "hype" }
        ]
      },
      good: {
        label: "Treinar apenas a saída segura com 2 toques antes de acelerar",
        approachTag: "Transição Segura",
        coachLine: `Garantam o primeiro domínio firme antes de esticar a bola.`,
        reactions: [
          { idx: 0, text: `Menos chance de errar o passe atrás.`, tone: "calm" },
          { idx: 1, text: `Fica bem consistente assim.`, tone: "normal" }
        ]
      },
      poor: {
        label: "Pedir pro zagueiro segurar a bola por 5 segundos esperando todo mundo subir andando",
        approachTag: "Esfriar Ritmo",
        coachLine: `Freiem tudo quando roubar a bola. Não acelerem nada.`,
        reactions: [
          { idx: 2, text: `Aí dá tempo dos onze adversários fecharem a área inteira...`, tone: "tense" },
          { idx: 1, text: `Perdeu totalmente a surpresa da nossa corrida.`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tech_midfield_orchestra",
    "CRIAR_TECNICA",
    "Finta & Tabela no Meio",
    [
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "MF" || a.archetype === "STRATEGIST", role: "FW" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 0, `${actors[1].name}, quando eles fecham o meio com dois volantes, e se a gente cruzar as linhas usando ${actors[0].ofMove} e ${actors[1].ofMove} em sequência?`, "idea"),
      mkSpontaneousMsg(actors, 1, `Um drible duplo em espelho?! O marcador não vai saber quem tá com a bola nem pra que lado girar!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Sincronizar troca de posição em X com passe curto escondido na passada",
        approachTag: "Orquestra no Meio",
        coachLine: `Cruzem as trajetórias em X bem na frente do marcador: quem vem de trás leva a bola limpa embalado!`,
        reactions: [
          { idx: 0, text: `PERFEITO!! O cone de marcação ficou girando sozinho no meio!`, tone: "hype" },
          { idx: 1, text: `Nunca mais ficamos presos contra linha de cinco volantes!`, tone: "hype" }
        ]
      },
      good: {
        label: "Treinar tabela simples de devolução rápida",
        approachTag: "Tabela Clássica",
        coachLine: `Toca e passa sem complicar muito o movimento.`,
        reactions: [
          { idx: 0, text: `Funciona bem demais.`, tone: "calm" },
          { idx: 1, text: `Clássico que nunca falha.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Mandar driblar tudo sozinho antes de pensar em tocar",
        approachTag: "Individualismo",
        coachLine: `Não precisam cruzar juntos — quem pegar primeiro dribla todo mundo sozinho.`,
        reactions: [
          { idx: 0, text: `Mas a graça justamente era quebrar dois de uma vez em dupla...`, tone: "tense" },
          { idx: 1, text: `Vai cansar à toa no meio-campo.`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tech_element_fusion",
    "CRIAR_TECNICA",
    "Ressonância Elemental",
    [
      { pred: () => true, role: "FW" },
      { pred: (a, p) => p[0] && a.element === p[0].element, role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Já reparou que nós dois carregamos a força de ${actors[0].element}? Quando treinamos perto, até a bola responde diferente!`, "idea"),
      mkSpontaneousMsg(actors, 1, `Com certeza! Se fundirmos ${actors[0].sigMove} com minha ${actors[1].sigMove}, vai dar um salto absurdo de poder contra ${ctx.oppName}!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Alinhar o ritmo respiratório pra dispararem a energia elemental juntos",
        approachTag: "Fusão Elemental",
        coachLine: `Deixem a mesma energia elemental correr no passe antes do golpe final — a bola vai ganhar rotação dupla!`,
        reactions: [
          { idx: 0, text: `A aura de ${actors[0].element} duplicou de brilho na hora!!`, tone: "hype" },
          { idx: 1, text: `Nossa conexão tá num nível surreal agora!`, tone: "hype" }
        ]
      },
      good: {
        label: "Usar o elemento só nos duelos individuais perto um do outro",
        approachTag: "Cobertura Próxima",
        coachLine: `Joguem próximos no campo pra multiplicar a vantagem do elemento.`,
        reactions: [
          { idx: 0, text: `Boa, já fortalece bastante nosso setor.`, tone: "calm" },
          { idx: 1, text: `Fechado!`, tone: "normal" }
        ]
      },
      poor: {
        label: "Ignorar a vantagem elemental e focar só em passe lateral lento",
        approachTag: "Desperdiçar Potencial",
        coachLine: `Não forcem aura nenhuma — joguem morno e sem arriscar técnica.`,
        reactions: [
          { idx: 0, text: `Que desperdício de sintonia natural...`, tone: "tense" },
          { idx: 1, text: `Logo hoje que a gente tava voando juntos!`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tech_keshin_resonance",
    "CRIAR_TECNICA",
    "Isca de Espírito Guerreiro",
    [
      { pred: (a) => Boolean(a.keshinName) || a.isAce, role: "FW" },
      { pred: (a) => a.role === "MF" || a.role === "FW", role: "MF" },
      { pred: (a) => a.role === "DF" || a.role === "MF", role: "DF" }
    ],
    (actors, ctx) => {
      const auraRef = actors[0].keshinName ? `minha Keshin 【${actors[0].keshinName}】` : `minha ${actors[0].shMove}`;
      return [
        mkSpontaneousMsg(actors, 0, `Quando eu chamo atenção puxando ${auraRef}, ${ctx.oppName} manda dois marcadores em cima de mim na hora!`, "idea"),
        mkSpontaneousMsg(actors, 1, `E é justamente nessa hora que eu entro nas costas! Enquanto eles travam em você, a bola sobra limpa pra nossa jogada combinada!`, "hype"),
        mkSpontaneousMsg(actors, 2, `Se a gente ensaiar esse movimento como uma Hissatsu combinada, não sobra defensor em pé!`, "idea")
      ];
    },
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Desenhar a finta: astro atrai a dobra e solta pro ataque conjunto no ponto cego",
        approachTag: "Isca & Golpe Final",
        coachLine: `${actors[0].name} puxa os holofotes e segura meio segundo — na hora da dobra, aciona ${actors[1].name} e ${actors[2].name} pro ataque combinado!`,
        reactions: [
          { idx: 0, text: `Eles vão cair na armadilha toda santa vez!!`, tone: "hype" },
          { idx: 1, text: `Técnica de seleção campeã isso aqui!!`, tone: "hype" },
          { idx: 2, text: `Pronto pra explodir na hora do passe!`, tone: "hype" }
        ]
      },
      good: {
        label: "Focar em apoiar o craque caso ele fique cercado",
        approachTag: "Apoio Seguro",
        coachLine: `Fiquem sempre perto pra dar opção de passe de saída caso dobrem a marcação.`,
        reactions: [
          { idx: 0, text: `Ter apoio perto tira muito peso das minhas costas.`, tone: "calm" },
          { idx: 1, text: `Estaremos sempre na linha de passe!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Deixar o astro preso no meio dos marcadores sem aproximação de ninguém",
        approachTag: "Sobrecarregar Craque",
        coachLine: `${actors[0].name} que se vire com os dois marcadores sozinho, os outros ficam parados olhando.`,
        reactions: [
          { idx: 0, text: `Vou acabar tomando falta e perdendo todo o fôlego assim...`, tone: "tense" },
          { idx: 1, text: `Não faz sentido ter um time unido pra jogar isolado.`, tone: "tense" }
        ]
      }
    })
  ),

  // ===================== ELOGIO / UNIÃO (7) =====================
  makeChatTpl(
    "praise_gk_wall",
    "ELOGIO",
    "Muralha Impassável",
    [
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "GK", role: "GK" },
      { pred: (a) => a.role === "FW" || a.role === "DF", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Cara, precisa falar: jogar atrás sabendo que ${actors[1].name} garante tudo com ${actors[1].gkMove} muda completamente nossa confiança!`, "praise"),
      mkSpontaneousMsg(actors, 2, `Até nos treinos de finalização é um sufoco passar por você, ${actors[1].archetypeLabel}!`, "praise"),
      mkSpontaneousMsg(actors, 1, `Vocês que tornam meu trabalho possível! Quando vocês fecham o ângulo na frente, fica muito mais tranquilo ler o chute de ${ctx.oppName}!`, "praise")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Celebrar a confiança mútua e estender essa garra pro vestiário inteiro",
        approachTag: "Inspirar Elenco",
        coachLine: `Essa confiança entre linha de frente, zaga e gol é o que constrói campeões. Levem essa leveza e fome de vitória pra todo o time!`,
        reactions: [
          { idx: 1, text: `Podem ir pro ataque sem medo — o gol tá trancado hoje!!`, tone: "hype" },
          { idx: 0, text: `O astral do grupo subiu nas alturas agora!`, tone: "hype" },
          { idx: 2, text: `Tô até sentindo as pernas mais leves pra voar em campo!`, tone: "hype" }
        ]
      },
      good: {
        label: "Reforçar o elogio com foco na concentração defensiva",
        approachTag: "Reconhecimento",
        coachLine: `Parabéns pela dedicação atrás. Mantenham o mesmo nível de foco na partida.`,
        reactions: [
          { idx: 1, text: `Valeu, professor! Vamos continuar firme.`, tone: "calm" },
          { idx: 0, text: `Tamo fechado!`, tone: "normal" }
        ]
      },
      poor: {
        label: "Cortar o elogio dizendo que defender é apenas obrigação básica",
        approachTag: "Frieza",
        coachLine: `Goleiro tá lá pra defender mesmo, não tem nada demais pra comemorar.`,
        reactions: [
          { idx: 0, text: `Nossa... custava reconhecer o esforço do cara?!`, tone: "tense" },
          { idx: 1, text: `Tá bom então... vamos voltar pro treino.`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "praise_captain_lead",
    "ELOGIO",
    "Espírito de Liderança",
    [
      { pred: (a) => a.isCaptain, role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "DF", role: "DF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 1, `${actors[0].name}, desde que você assumiu a faixa, até nos momentos apertados ninguém abaixa a cabeça!`, "praise"),
      mkSpontaneousMsg(actors, 2, `Verdade! Quando você puxa o ritmo, o time inteiro cresce em campo contra qualquer adversário!`, "praise"),
      mkSpontaneousMsg(actors, 0, `A força vem de vocês confiarem no meu comando. Contra ${ctx.oppName}, vamos jogar juntos até o último apito!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Dar voz ao Capitão pra fechar o discurso motivacional pro time",
        approachTag: "Moral Máxima",
        coachLine: `Você representa a nossa identidade dentro das quatro linhas, ${actors[0].name}. Guiem o elenco com essa energia hoje!`,
        reactions: [
          { idx: 0, text: `TIME! Ninguém larga a mão de ninguém hoje — eles não têm chance contra nós!!`, tone: "hype" },
          { idx: 1, text: `BORA!! Tô pilhado pra deixar tudo no gramado!`, tone: "hype" },
          { idx: 2, text: `Esse vestiário tá imparável!!`, tone: "hype" }
        ]
      },
      good: {
        label: "Agradecer ao grupo e pedir serenidade tática durante os 90 minutos",
        approachTag: "Equilíbrio",
        coachLine: `Excelente postura de grupo. Mantenham a calma quando a bola rolar.`,
        reactions: [
          { idx: 0, text: `Com certeza, professor.`, tone: "calm" },
          { idx: 1, text: `Foco total!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Desvalorizar a liderança falando que só importa quem faz o gol",
        approachTag: "Desprezo",
        coachLine: `Discurso não ganha jogo, só importa quem empurra a bola pra rede.`,
        reactions: [
          { idx: 0, text: `Caramba... espírito de equipe também ganha jogo, treinador.`, tone: "tense" },
          { idx: 2, text: `Que balde de água fria no vestiário...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "praise_ace_clutch",
    "ELOGIO",
    "Frieza de Decisão",
    [
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.isAce || a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `${actors[1].name}, é impressionante como no aperto você puxa ${actors[1].shMove} sem tremer um milímetro!`, "praise"),
      mkSpontaneousMsg(actors, 1, `Se eu consigo bater limpo desse jeito é porque seus passes com ${actors[0].ofMove} chegam sempre no tempo perfeito, ${actors[0].name}! Contra ${ctx.oppName} vai sair mais gol!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Valorizar a dupla criador-finalizador e inflamar a confiança pra vitória",
        approachTag: "Conexão Decisiva",
        coachLine: `Vocês dois juntos decidem qualquer torneio: passe genial com frieza mortal na conclusão!`,
        reactions: [
          { idx: 0, text: `Pode deixar que a bola vai chegar redonda de novo hoje!`, tone: "hype" },
          { idx: 1, text: `E eu garanto que vai morrer no fundo da rede!`, tone: "hype" }
        ]
      },
      good: {
        label: "Elogiar e lembrar de observar outros colegas livres na área",
        approachTag: "Visão Ampla",
        coachLine: `Ótima conexão! Só não esqueçam dos outros companheiros se fecharem vocês.`,
        reactions: [
          { idx: 1, text: `Pode deixar, olho sempre aberto.`, tone: "calm" },
          { idx: 0, text: `Combinado!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Dizer que só tiveram sorte nas últimas finalizações",
        approachTag: "Minimizar Mérito",
        coachLine: `Não se empolguem demais — várias bolas entraram por sorte ou desvio.`,
        reactions: [
          { idx: 1, text: `Treinei horas todo dia pra ouvir que foi sorte?!`, tone: "tense" },
          { idx: 0, text: `Poxa, treinador... reconhecimento zero hoje.`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "praise_df_sacrifice",
    "ELOGIO",
    "Guerreiro Silencioso",
    [
      { pred: (a) => a.role === "FW" || a.role === "MF", role: "FW" },
      { pred: (a) => a.role === "DF", role: "DF" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 0, `A gente lá na frente leva os aplausos pelos gols, mas quem carrega o plano pesado é você travando tudo com ${actors[1].dfMove}, ${actors[1].name}!`, "praise"),
      mkSpontaneousMsg(actors, 1, `Valeu demais ouvir isso, ${actors[0].name}! Quando vejo você correndo pra pressionar também, dá gosto de dar a vida lá atrás!`, "praise")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Destacar pro time inteiro que ataque e defesa vencem juntos",
        approachTag: "Espírito de Sacrifício",
        coachLine: `Reconhecimento gera entrega em dobro! Com essa humildade entre frente e zaga, o time recupera energia e força moral juntos!`,
        reactions: [
          { idx: 1, text: `Energia renovada 100%! Hoje ninguém passa por mim!`, tone: "hype" },
          { idx: 0, text: `E eu vou ajudar a abafar lá na frente pra aliviar você!`, tone: "hype" }
        ]
      },
      good: {
        label: "Parabenizar os dois pelo respeito mútuo no elenco",
        approachTag: "Apoio",
        coachLine: `Muito bom ver o ataque valorizando o sistema defensivo.`,
        reactions: [
          { idx: 1, text: `Valeu, professor!`, tone: "calm" },
          { idx: 0, text: `Merecido demais!`, tone: "normal" }
        ]
      },
      poor: {
        label: "Concordar que defesa nunca aparece mesmo e focar só no ataque",
        approachTag: "Ignorar Defesa",
        coachLine: `Normal, futebol lembra dos artilheiros mesmo. Zagueiro só precisa não atrapalhar.`,
        reactions: [
          { idx: 1, text: `Tranquilo... bom saber o peso que você dá ao nosso esforço.`, tone: "toxic" },
          { idx: 0, text: `Que comentário infeliz, professor...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "praise_mid_vision",
    "ELOGIO",
    "Passes Milimétricos",
    [
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.archetype === "STRATEGIST" || a.role === "MF", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `${actors[1].name}, jogar na frente contigo é fácil demais — seus passes com ${actors[1].ofMove} já chegam dizendo "só chuta"!`, "praise"),
      mkSpontaneousMsg(actors, 1, `Só funciona porque sua leitura de espaço é afiada! Contra ${ctx.oppName} vou te achar de novo nas costas da linha!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Incentivar essa sintonia refinada pra acelerar a conexão nos jogos grandes",
        approachTag: "Refinar Conexão",
        coachLine: `Mantenham esse olhar conectado desde o aquecimento — a confiança entre vocês eleva o nível técnico de todo ataque!`,
        reactions: [
          { idx: 1, text: `Meu campo de visão até parece maior jogando com ele!`, tone: "hype" },
          { idx: 0, text: `Hoje sai gol de placa, pode anotar!`, tone: "hype" }
        ]
      },
      good: {
        label: "Elogiar e pedir atenção com a marcação alta do adversário",
        approachTag: "Cautela",
        coachLine: `Ótima leitura, só não prendam a bola demais sob pressão.`,
        reactions: [
          { idx: 1, text: `Toque rápido garantido.`, tone: "calm" },
          { idx: 0, text: `Certo!`, tone: "normal" }
        ]
      },
      poor: {
        label: "Exigir que mudem a forma de jogar porque ficou muito previsível",
        approachTag: "Quebrar Ritmo",
        coachLine: `Parem de procurar sempre um ao outro, estão previsíveis demais.`,
        reactions: [
          { idx: 0, text: `Mas é nossa melhor arma funcionando...`, tone: "tense" },
          { idx: 1, text: `Ok, vou segurar mais então.`, tone: "normal" }
        ]
      }
    })
  ),

  makeChatTpl(
    "praise_bench_rise",
    "ELOGIO",
    "Evolução do Elenco",
    [
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 1, `Olhando pra trás desde o começo do torneio... cada um aqui evoluiu demais! Até os treinos pesados estão fluindo melhor.`, "praise"),
      mkSpontaneousMsg(actors, 0, `Verdade! Nossa defesa tá mais firme e a bola sai mais limpa pro ataque.`, "praise"),
      mkSpontaneousMsg(actors, 2, `Com essa união, ${ctx.oppName} vai enfrentar a melhor versão do nosso Dream Team!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Celebrar o crescimento coletivo e renovar o ânimo do grupo inteiro",
        approachTag: "União Total",
        coachLine: `Vocês construíram esse entrosamento na base do suor e respeito. Entrem em campo orgulhosos e com fome de jogo!`,
        reactions: [
          { idx: 2, text: `Ninguém para um elenco unido desse jeito!!`, tone: "hype" },
          { idx: 1, text: `Fôlego lá em cima e cabeça fria! Vamos pra cima!`, tone: "hype" },
          { idx: 0, text: `Fechados até o fim!`, tone: "hype" }
        ]
      },
      good: {
        label: "Concordar e lembrar de manter os pés no chão",
        approachTag: "Humildade",
        coachLine: `Sim, evoluíram muito, mas o torneio ainda exige foco máximo.`,
        reactions: [
          { idx: 1, text: `Com certeza, passo de cada vez.`, tone: "calm" },
          { idx: 0, text: `Pé no chão e trabalho!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Dizer que ainda falta muito para serem um time bom de verdade",
        approachTag: "Pessimismo",
        coachLine: `Não vejo motivo pra comemorar — comparando com os favoritos ainda estamos bem atrás.`,
        reactions: [
          { idx: 2, text: `Nossa... a gente tentando levantar a moral e você derruba assim.`, tone: "tense" },
          { idx: 1, text: `Difícil manter a confiança desse jeito.`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "praise_same_elem",
    "ELOGIO",
    "Sintonia Elemental Pura",
    [
      { pred: () => true, role: "MF" },
      { pred: (a, p) => p[0] && a.element === p[0].element, role: "FW" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 0, `${actors[1].name}, incrível como nos entendemos só no olhar — o ritmo de ${actors[0].element} conecta nossos passos automático!`, "praise"),
      mkSpontaneousMsg(actors, 1, `Total! Jogando lado a lado parece que cada dividida fica mais leve!`, "praise")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Potencializar essa confiança positiva pra animar o vestiário inteiro",
        approachTag: "Aura Positiva",
        coachLine: `Essa sintonia natural de vocês contagia os onze titulares. Aproveitem esse embalo em campo!`,
        reactions: [
          { idx: 0, text: `Bateria carregada 100%!`, tone: "hype" },
          { idx: 1, text: `Eles que tentem parar nossa ligação hoje!`, tone: "hype" }
        ]
      },
      good: {
        label: "Apoiar e reforçar atenção na troca de passes",
        approachTag: "Sintonia",
        coachLine: `Sigam jogando próximos sempre que possível.`,
        reactions: [
          { idx: 0, text: `Pode deixar!`, tone: "calm" },
          { idx: 1, text: `Com certeza!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Dizer que elemento não serve pra nada em partida disputada",
        approachTag: "Desinteresse",
        coachLine: `Bobagem ficar reparando nisso. Corram e acabou.`,
        reactions: [
          { idx: 0, text: `Ok então...`, tone: "normal" },
          { idx: 1, text: `Clima deu uma esfriada.`, tone: "tense" }
        ]
      }
    })
  ),

  // ===================== ESTUDO DO RIVAL / TÁTICA (6) =====================
  makeChatTpl(
    "tac_break_defense",
    "TATICA_RIVAL",
    "Mapa da Zaga Adversária",
    [
      { pred: (a) => a.archetype === "STRATEGIST" || a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "MF" || a.role === "FW", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Estive analisando os últimos lances de ${ctx.oppName}: os zagueiros deles perseguem muito o portador e deixam buraco atrás!`, "idea"),
      mkSpontaneousMsg(actors, 1, `Se eu puxar o beque pro lado fingindo receber curto, abre uma avenida no centro!`, "idea"),
      mkSpontaneousMsg(actors, 2, `Aí quem vem de trás usando ${actors[2].ofMove} invade livre pra bater pro gol!`, "hype")
    ],
    (actors, ctx) => buildShuffledChatChoices(actors, {
      great: {
        label: "Confirmar a isca: atrair o zagueiro e explorar as costas com passe cirúrgico",
        approachTag: "Leitura Tática",
        coachLine: `Leitura brilhante de ${ctx.oppName}! Atraiam o primeiro marcador e rasguem a linha nas costas sem hesitar!`,
        reactions: [
          { idx: 0, text: `Já mapeamos o ponto fraco inteiro deles! Vai entrar passe limpo toda hora!`, tone: "hype" },
          { idx: 1, text: `Tô pronto pra arrastar a zaga deles pro espaço errado!`, tone: "idea" },
          { idx: 2, text: `Com essa leitura, interceptar nossos passes vai ficar quase impossível!`, tone: "hype" }
        ]
      },
      good: {
        label: "Pedir cautela nos passes verticais pra não perder posse cedo",
        approachTag: "Controle",
        coachLine: `Usem essa movimentação, mas só soltem a bola se tiverem certeza do espaço.`,
        reactions: [
          { idx: 0, text: `Faz sentido, segurança primeiro.`, tone: "calm" },
          { idx: 1, text: `Vou medir bem o risco.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Ignorar a análise e pedir pro time chutar de qualquer distância desde o meio",
        approachTag: "Forçar Chutes",
        coachLine: `Não precisa ler defesa nenhuma — recebeu no meio, manda chutar direto de longe!`,
        reactions: [
          { idx: 0, text: `Chutar cego no bloco fechado só entrega a bola pra ${ctx.oppName}...`, tone: "tense" },
          { idx: 2, text: `Desperdiçamos o estudo inteiro do rival.`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tac_stop_ace",
    "TATICA_RIVAL",
    "Plano Anti-Artilheiro",
    [
      { pred: (a) => a.role === "GK", role: "GK" },
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "DF" || a.role === "MF", role: "DF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 1, `O ataque de ${ctx.oppName} joga quase todas as bolas pro camisa principal deles armar técnica!`, "normal"),
      mkSpontaneousMsg(actors, 0, `Se deixarem ele girar de frente na entrada da área, até com ${actors[0].gkMove} vai ser duelo duro!`, "tense"),
      mkSpontaneousMsg(actors, 2, `A gente precisa cercar a linha do passe ANTES da bola chegar nele!`, "idea")
    ],
    (actors, ctx) => buildShuffledChatChoices(actors, {
      great: {
        label: "Antecipar o passe no craque rival e forçá-lo a tocar pra trás",
        approachTag: "Fechar Linha",
        coachLine: `Isso! Cortem o oxigênio do passe antes que chegue no artilheiro de ${ctx.oppName} e não deem espaço pra giro!`,
        reactions: [
          { idx: 2, text: `Vou colar na linha de passe desde o meio-campo!`, tone: "hype" },
          { idx: 1, text: `E se sobrar aqui atrás, trava na hora com ${actors[1].dfMove}!`, tone: "hype" },
          { idx: 0, text: `Assim jogo tranquilo no gol!`, tone: "calm" }
        ]
      },
      good: {
        label: "Manter marcação em zona tradicional perto da grande área",
        approachTag: "Zona Padrão",
        coachLine: `Fiquem bem posicionados em linha na frente da área pra bloquear finalizações.`,
        reactions: [
          { idx: 1, text: `Certo, defesa fechada.`, tone: "calm" },
          { idx: 0, text: `Fica sólido assim.`, tone: "normal" }
        ]
      },
      poor: {
        label: "Mandar todo o setor defensivo avançar pro ataque sem preocupação",
        approachTag: "Expor Defesa",
        coachLine: `Esqueçam o ataque de ${ctx.oppName}, avancem todos pro meio e deixem o gol por conta do goleiro.`,
        reactions: [
          { idx: 0, text: `Vão me deixar no 3 contra 1 o jogo inteiro?!`, tone: "toxic" },
          { idx: 1, text: `Loucura tática...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tac_aerial_balls",
    "TATICA_RIVAL",
    "Por Cima ou Pelo Chão?",
    [
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `${actors[1].name}, a zaga de ${ctx.oppName} intercepta muito passe curto no chão quando aperta o meio.`, "normal"),
      mkSpontaneousMsg(actors, 1, `Então varia! Se fecharem o corredor rasteiro, manda cavadinha ou virada alta pro meu domínio — eu mato no peito e acelero!`, "idea")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Liberar cavadinhas e lançamentos altos sempre que houver bloqueio no corredor",
        approachTag: "Variação Aérea",
        coachLine: `Quando o zagueiro fechar sua linha de passe rasteira, erga a bola por cima pro ${actors[1].name} matar na corrida — leitura pura!`,
        reactions: [
          { idx: 0, text: `Perfeito! Com passe rasteiro e cavadinha alternados eles não leem nada!`, tone: "hype" },
          { idx: 1, text: `Adoro matar lançamento longo na passada!`, tone: "hype" }
        ]
      },
      good: {
        label: "Priorizar toque curto pelas pontas pra contornar o meio congestionado",
        approachTag: "Pelas Alas",
        coachLine: `Abram o jogo pelos flancos com toques simples antes de entrar.`,
        reactions: [
          { idx: 0, text: `Bem seguro pelos lados.`, tone: "calm" },
          { idx: 1, text: `Também funciona bem.`, tone: "normal" }
        ]
      },
      poor: {
        label: "Proibir passes elevados mesmo quando houver dois zagueiros na linha",
        approachTag: "Rigidez",
        coachLine: `Só quero passe rasteiro no pé, mesmo se tiver um muro na frente.`,
        reactions: [
          { idx: 0, text: `Aí a chance de interceptação vai lá em cima...`, tone: "tense" },
          { idx: 1, text: `Fica bem mais difícil receber limpo assim.`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tac_counter_press",
    "TATICA_RIVAL",
    "Pressão Pós-Perda",
    [
      { pred: (a) => a.archetype === "WARRIOR" || a.role === "DF", role: "DF" },
      { pred: (a) => a.archetype === "PACE_LEADER" || a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 1, `Se eu perder uma dividida na frente contra ${ctx.oppName}, consigo abafar o zagueiro deles nos primeiros 3 segundos!`, "idea"),
      mkSpontaneousMsg(actors, 0, `Boa! Se você fechar a saída pro meio, eu já avanço pra roubar o passe forçado pro lado!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Alinhar o gatilho: atacante fecha passe central, defensor rouba o lateral!",
        approachTag: "Armadilha de Pressão",
        coachLine: `Pressão coordenada em dois tempos! Cercam o passe de saída que nós mesmos vamos interceptar já na intermediária!`,
        reactions: [
          { idx: 1, text: `Vou sufocar a saída de bola deles desde o primeiro segundo!`, tone: "hype" },
          { idx: 0, text: `E eu já fico pronto pro bote limpo atrás!`, tone: "hype" }
        ]
      },
      good: {
        label: "Recompor o time atrás rápido sempre que perder a posse",
        approachTag: "Reorganizar",
        coachLine: `Melhor recompor as linhas antes de tentar abafar muito alto.`,
        reactions: [
          { idx: 0, text: `Gasta menos fôlego assim.`, tone: "calm" },
          { idx: 1, text: `Certo, recompondo rápido.`, tone: "normal" }
        ]
      },
      poor: {
        label: "Correr desordenado atrás do goleiro rival sozinho",
        approachTag: "Corrida Inútil",
        coachLine: `Sai correndo sozinho atrás de quem tiver com a bola, sem olhar pros colegas.`,
        reactions: [
          { idx: 1, text: `Vou correr em círculo feito bobo e cansar em 10 minutos...`, tone: "tense" },
          { idx: 0, text: `Vai abrir um buraco enorme no meio assim.`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tac_stamina_pacing",
    "TATICA_RIVAL",
    "Gestão de Fôlego em 90'",
    [
      { pred: (a) => a.isCaptain || a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "GK", role: "GK" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 2, `Atenção time: ${ctx.oppName} costuma acelerar muito no segundo tempo. Não vale queimar toda técnica no começo.`, "normal"),
      mkSpontaneousMsg(actors, 0, `Verdade! Quando eu estiver em ${ctx.teamEnergy}% ou abaixo, precisamos trocar passes simples pra recuperar fôlego sem perder a bola!`, "idea"),
      mkSpontaneousMsg(actors, 1, `E guardar explosão pra quando a defesa deles abrir no fim do jogo!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Definir pausas com passe seguro pra recuperar fôlego e atacar com inteligência",
        approachTag: "Ritmo Inteligente",
        coachLine: `Time maduro controla o relógio com a bola! Circulam com calma pra respirar e leiam cada brecha pra não entregar posse boba!`,
        reactions: [
          { idx: 0, text: `Cabeça pensante do começo aos 90'!`, tone: "hype" },
          { idx: 1, text: `Aí chego inteiro na reta final pra decidir!`, tone: "hype" },
          { idx: 2, text: `Dá gosto ver o elenco jogando com inteligência!`, tone: "calm" }
        ]
      },
      good: {
        label: "Pedir pra dosarem Hissatsu pesada só nos momentos decisivos",
        approachTag: "Economia",
        coachLine: `Evitem gastar Super Técnicas em duelos pouco perigosos no meio.`,
        reactions: [
          { idx: 1, text: `Certo, guardar pro chute claro.`, tone: "calm" },
          { idx: 0, text: `Faz muita diferença no fim.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Ordenar sprint máximo o jogo todo mesmo sem energia",
        approachTag: "Exaustão",
        coachLine: `Não existe administrar nada — corram no máximo até as pernas travarem!`,
        reactions: [
          { idx: 1, text: `No segundo tempo ninguém vai conseguir nem ativar técnica desse jeito...`, tone: "tense" },
          { idx: 2, text: `Risco enorme de perdermos todos os duelos finais.`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tac_set_shape",
    "TATICA_RIVAL",
    "Cobertura nas Subidas",
    [
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Se o nosso meio subir forte pra apoiar o ataque contra ${ctx.oppName}, quem fica cobrindo o contra-ataque na intermediária?`, "normal"),
      mkSpontaneousMsg(actors, 1, `Eu seguro um passo atrás sempre que o ataque entrar na área — leio fácil onde eles tentam sair jogando!`, "idea"),
      mkSpontaneousMsg(actors, 2, `Sabendo que tá coberto atrás, eu parto pra cima com muito mais ousadia!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Consolidar a pirâmide: atacante agride, meia fecha rebote e zagueiro vigia lançamento",
        approachTag: "Equilíbrio de Setores",
        coachLine: `Cobertura em camadas! Ninguém corre perdido, e nossa leitura mata qualquer tentativa de passe longo deles!`,
        reactions: [
          { idx: 1, text: `Rebote e segunda bola vão ser tudo nossos!`, tone: "hype" },
          { idx: 0, text: `Zaga protegida e tranquila!`, tone: "calm" },
          { idx: 2, text: `Liberdade total com responsabilidade atrás!`, tone: "hype" }
        ]
      },
      good: {
        label: "Pedir pra não subirem dois meias ao mesmo tempo",
        approachTag: "Prudência",
        coachLine: `Subam um de cada vez para manter sempre equilíbrio no centro.`,
        reactions: [
          { idx: 1, text: `Boa regra prática.`, tone: "calm" },
          { idx: 0, text: `Deixa tudo em ordem.`, tone: "normal" }
        ]
      },
      poor: {
        label: "Mandar todos ficarem presos atrás pra não correr nenhum risco",
        approachTag: "Retranca Total",
        coachLine: `Ninguém passa da linha do meio-campo! Defendam o empate o jogo todo.`,
        reactions: [
          { idx: 2, text: `E como vamos fazer gol sem subir ninguém?!`, tone: "tense" },
          { idx: 1, text: `Assim vamos só chamar o rival pra nossa área.`, tone: "tense" }
        ]
      }
    })
  ),

  // ===================== RESENHA / DESCONTRAÇÃO (5) =====================
  makeChatTpl(
    "banter_snack_bet",
    "RESENHA",
    "Aposta do Lámen Pós-Jogo",
    [
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "DF", role: "DF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Bora fazer valer a pena contra ${ctx.oppName}: quem errar mais passes fáceis hoje paga o lámen da galera depois!`, "banter"),
      mkSpontaneousMsg(actors, 1, `Haha! Já vai separando o dinheiro, ${actors[0].name}, porque você chuta tudo e quase não toca!`, "banter"),
      mkSpontaneousMsg(actors, 2, `Eu vou é roubar três bolas e só dar toquinho seguro pro lado — refeição grátis garantida kkk!`, "banter")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Entrar na zoeira e dobrar a aposta pro elenco jogar leve e confiante",
        approachTag: "Clima Leve",
        coachLine: `Fechado! Se o time vencer dando show de passes fáceis, eu mesmo pago a primeira rodada pra todo mundo!`,
        reactions: [
          { idx: 0, text: `OLHA O TREINADOR!! Agora ninguém cansa nem com 120 minutos kkk!`, tone: "hype" },
          { idx: 1, text: `Vestiário leve desse jeito joga o dobro!`, tone: "banter" },
          { idx: 2, text: `Melhor clima do campeonato inteiro!!`, tone: "hype" }
        ]
      },
      good: {
        label: "Rir da aposta e lembrar de priorizar a vitória do time",
        approachTag: "Bom Humor",
        coachLine: `Só não fiquem prendendo a bola por medo da aposta — joguem pelo time!`,
        reactions: [
          { idx: 1, text: `Haha, claro professor!`, tone: "banter" },
          { idx: 0, text: `Vitória em primeiro lugar sempre!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Proibir brincadeiras e mandar todos ficarem em silêncio absoluto",
        approachTag: "Clima Rígido",
        coachLine: `Acabou a palhaçada! Quero cara fechada e silêncio total até entrar no ônibus!`,
        reactions: [
          { idx: 0, text: `Nossa... a gente só tava tentando relaxar antes da decisão.`, tone: "tense" },
          { idx: 2, text: `Tensão subiu do nada...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "banter_technique_names",
    "RESENHA",
    "Ranking de Nomes Épicos",
    [
      { pred: (a) => a.role === "FW" || a.role === "MF", role: "FW" },
      { pred: (a) => a.role === "MF" || a.role === "DF", role: "MF" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 0, `Falando sério: o nome "${actors[0].sigMove}" impõe muito mais respeito do que "${actors[1].sigMove}", admite vai!`, "banter"),
      mkSpontaneousMsg(actors, 1, `Para de viajar!! A minha "${actors[1].sigMove}" tem muito mais estilo! Pergunta pro treinador qual assusta mais!`, "banter")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Brincar que o combo das duas juntas teria o nome mais temido do torneio",
        approachTag: "Resenha Criativa",
        coachLine: `As duas são incríveis — imagina só o terror da torcida quando vocês usarem "${actors[0].sigMove}" e "${actors[1].sigMove}" na mesma jogada!`,
        reactions: [
          { idx: 0, text: `Haha! Verdade, combinado fica invencível!`, tone: "hype" },
          { idx: 1, text: `Ganhamos os dois então! Clima leve antes do jogo ajuda demais.`, tone: "banter" }
        ]
      },
      good: {
        label: "Elogiar as duas técnicas e focar na execução perfeita",
        approachTag: "Diplomacia",
        coachLine: `O melhor nome é aquele que vence o duelo dentro de campo!`,
        reactions: [
          { idx: 0, text: `Verdade total!`, tone: "calm" },
          { idx: 1, text: `Hoje vou provar em campo!`, tone: "normal" }
        ]
      },
      poor: {
        label: "Falar que ficar escolhendo técnica favorita é perda de tempo",
        approachTag: "Secura",
        coachLine: `Que papo infantil... fiquem quietos e parem com essa bobeira.`,
        reactions: [
          { idx: 0, text: `Tá bom, desculpa aí...`, tone: "tense" },
          { idx: 1, text: `Clima secou rapidinho.`, tone: "normal" }
        ]
      }
    })
  ),

  makeChatTpl(
    "banter_gk_gloves",
    "RESENHA",
    "Desafio das Cobranças",
    [
      { pred: (a) => a.role === "GK", role: "GK" },
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "MF", role: "MF" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 0, `Nem usando ${actors[1].shMove} dez vezes seguidas você fura minha ${actors[0].gkMove} hoje, ${actors[1].name}!`, "banter"),
      mkSpontaneousMsg(actors, 1, `Apostado! Três cobranças depois do aquecimento — se eu fizer duas você limpa as chuteiras de todo mundo kkk!`, "banter"),
      mkSpontaneousMsg(actors, 2, `Eu sirvo as bolas só pra assistir de camarote!`, "banter")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Autorizar só 2 minutinhos de desafio pra afiar reflexos e soltar o grupo",
        approachTag: "Aquecimento Divertido",
        coachLine: `Dou 2 minutos valendo — aquece a luva do ${actors[0].name}, afia o pé do ${actors[1].name} e ainda deixa todo mundo leve!`,
        reactions: [
          { idx: 0, text: `PEGUEI!! Pode ir separando a escova de chuteira aí kkk!`, tone: "hype" },
          { idx: 1, text: `Na gaveta no segundo chute!! Tá equilibrado demais, que ótimo clima!`, tone: "banter" },
          { idx: 2, text: `Todo mundo solto, leve e pronto pro jogo!`, tone: "hype" }
        ]
      },
      good: {
        label: "Deixar pra depois da partida pra preservar energia agora",
        approachTag: "Poupar Energia",
        coachLine: `Boa energia! Façam esse desafio na volta da vitória pra não gastar perna agora.`,
        reactions: [
          { idx: 0, text: `Justo! Depois do jogo eu ganho mesmo.`, tone: "banter" },
          { idx: 1, text: `Anota aí que eu não esqueci não!`, tone: "normal" }
        ]
      },
      poor: {
        label: "Dar bronca por apostarem em aquecimento",
        approachTag: "Rigor Excessivo",
        coachLine: `Falta de seriedade! Não quero ver ninguém rindo ou apostando perto do campo.`,
        reactions: [
          { idx: 0, text: `Relaxar ajuda nos reflexos, treinador...`, tone: "tense" },
          { idx: 1, text: `Ficou pesado o ambiente sem necessidade.`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "banter_locker_music",
    "RESENHA",
    "Ritmo no Vestiário",
    [
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Coloquei aquela playlist agitada no vestiário pra tirar o peso antes de enfrentar ${ctx.oppName}!`, "banter"),
      mkSpontaneousMsg(actors, 2, `Aprovada demais! Tira a tensão das pernas antes de entrar no estádio!`, "banter"),
      mkSpontaneousMsg(actors, 1, `Só faltava o técnico escolher a música tema de entrada kkk!`, "banter")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Apoiar o som e usar o ritmo pra soltar o corpo pro jogo",
        approachTag: "Leveza & Fôlego",
        coachLine: `Mantenham o som ligado! Atleta relaxado respira melhor, cansa menos e confia no próprio instinto!`,
        reactions: [
          { idx: 0, text: `Agora sim!! Vestiário em paz e mente afiada!`, tone: "hype" },
          { idx: 1, text: `O cansaço até sumiu!`, tone: "banter" },
          { idx: 2, text: `Bora entrar voando!!`, tone: "hype" }
        ]
      },
      good: {
        label: "Deixar tocar baixo só até a preleção começar",
        approachTag: "Equilíbrio",
        coachLine: `Podem curtir mais cinco minutinhos antes do plano final.`,
        reactions: [
          { idx: 0, text: `Fechado, professor!`, tone: "calm" },
          { idx: 2, text: `Valeu!`, tone: "banter" }
        ]
      },
      poor: {
        label: "Desligar a caixa de som e passar um sermão longo e cansativo",
        approachTag: "Peso Mental",
        coachLine: `Desliguem isso imediatamente! Sentem e ouçam meia hora de bronca sobre o que não errar.`,
        reactions: [
          { idx: 1, text: `Nossa... bateu um cansaço instantâneo agora.`, tone: "tense" },
          { idx: 2, text: `Entrar todo travado de preocupação nunca ajuda...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "banter_rival_hype",
    "RESENHA",
    "Fama do Adversário",
    [
      { pred: (a) => a.role === "FW" || a.archetype === "PACE_LEADER", role: "FW" },
      { pred: (a) => a.role === "MF" || a.role === "DF", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Todo mundo na cidade falando que ${ctx.oppName} tá forte... ótimo! Adoro estragar festa de favorito!`, "banter"),
      mkSpontaneousMsg(actors, 1, `Haha! Eles ainda não conhecem nossa ${actors[0].sigMove} funcionando juntos — vão levar um susto logo aos 10 minutos!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Canalizar essa confiança leve pro jogo sem pressão excessiva",
        approachTag: "Confiança Leve",
        coachLine: `Deixem o peso da obrigação nos ombros deles — vocês entram livres, rápidos e curtindo cada jogada!`,
        reactions: [
          { idx: 0, text: `Sem peso nenhum nas costas — eles que se cuidem!!`, tone: "hype" },
          { idx: 1, text: `Melhor espírito possível pra jogar solto!`, tone: "hype" }
        ]
      },
      good: {
        label: "Lembrar de respeitar a qualidade rival dentro de campo",
        approachTag: "Respeito",
        coachLine: `Confiantes sim, mas com atenção dobrada do início ao fim.`,
        reactions: [
          { idx: 0, text: `Pode deixar, respeito total mas sem medo!`, tone: "calm" },
          { idx: 1, text: `Sempre ligados!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Falar pro grupo ficar assustado e jogar esperando o rival mandar",
        approachTag: "Submissão",
        coachLine: `Temos que respeitar muito eles mesmo — provavelmente são bem melhores que a gente.`,
        reactions: [
          { idx: 0, text: `Ué... o próprio treinador já entrou derrotado?!`, tone: "toxic" },
          { idx: 1, text: `Que discurso estranho antes do jogo...`, tone: "tense" }
        ]
      }
    })
  ),

  // ===================== NOVAS VARIAÇÕES + DECISÕES TÁTICAS (44) =====================
  makeChatTpl(
    "rage_ace_shirt_ten",
    "RAIVA",
    "Disputa pela Camisa 10",
    [
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.archetype === "STRATEGIST" || a.role === "MF", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, pickChatVariant([
        `Se é pra decidir contra ${ctx.oppName}, a bola final tem que passar por mim! Minha ${actors[0].shMove} tá afiada!`,
        `Todo ataque trava porque ninguém sabe quem é a referência oficial na frente!`
      ]), "toxic"),
      mkSpontaneousMsg(actors, 1, `Quem arma e pensa o jogo aqui sou eu com ${actors[1].ofMove}! Referência não é só ficar parado na área esperando!`, "toxic", {
        quote: { speakerName: actors[0].name, text: `A bola final tem que passar por mim!` }
      })
    ],
    (actors, ctx) => buildShuffledChatChoices(actors, {
      great: {
        label: `Definir ${actors[0].name} como Camisa 10 com estilo Vertical para acioná-lo rápido`,
        approachTag: "Hierarquia Ofensiva",
        tacticsPatch: { aceActorIdx: 0, style: "vertical" },
        coachLine: `${actors[0].name} assume a Camisa 10 nas finalizações e o time acelera no estilo Vertical pra servi-lo limpo!`,
        reactions: [
          { idx: 0, text: `Pode jogar nas minhas costas que eu resolvo!`, tone: "hype" },
          { idx: 1, text: `Beleza! Sabendo que você é a referência, minhas enfiadas ficam ainda mais fáceis.`, tone: "calm" }
        ]
      },
      good: {
        label: "Deixar o Camisa 10 distribuído automaticamente conforme o espaço",
        approachTag: "Fluxo Livre",
        tacticsPatch: { aceActorIdx: "CLEAR" },
        coachLine: `Ninguém tem passe exclusivo — toca em quem estiver melhor livre contra ${ctx.oppName}.`,
        reactions: [
          { idx: 1, text: `Mais justo pro coletivo mesmo.`, tone: "calm" },
          { idx: 0, text: `Só me deixem livre então!`, tone: "normal" }
        ]
      },
      poor: {
        label: "Mudar para bloco recuado e desistir de acionar os dois na frente",
        approachTag: "Recuar Tudo",
        tacticsPatch: { posture: "defensive", intensity: "low" },
        coachLine: `Enquanto brigam por protagonismo, vou recuar o time inteiro e baixar o ritmo.`,
        reactions: [
          { idx: 0, text: `Poxa... matar o ataque por uma discussão?!`, tone: "toxic" },
          { idx: 1, text: `Não era isso que a gente queria resolver...`, tone: "tense" }
        ]
      }
    }, ctx)
  ),

  makeChatTpl(
    "rage_captain_pressure",
    "RAIVA",
    "Cobrança no Vestiário",
    [
      { pred: (a) => a.isCaptain || a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "DF" || a.role === "FW", role: "DF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 1, `Não aguento mais levar esporro sem feedback claro! Se quer mandar no time, ${actors[0].name}, mostra postura de líder contra ${ctx.oppName}!`, "toxic"),
      mkSpontaneousMsg(actors, 0, `Eu tento organizar todo mundo e você vira a cara! Quer a faixa? Pega e resolve então!`, "toxic"),
      mkSpontaneousMsg(actors, 2, `Gente... apaga o incêndio antes que o vestiário rache no meio!`, "tense")
    ],
    (actors, ctx) => buildShuffledChatChoices(actors, {
      great: {
        label: `Confirmar a liderança de ${actors[0].name} com Harmonia da Raimon pro time unir`,
        approachTag: "Unir Liderança",
        tacticsPatch: { captainActorIdx: 0, hissatsuTactic: "raimon_harmony" },
        coachLine: `${actors[0].name} é meu Capitão de confiança e vamos com Harmonia da Raimon pra todo mundo falar a mesma língua!`,
        reactions: [
          { idx: 0, text: `Obrigado pela confiança, professor. Vou liderar ouvindo vocês dois!`, tone: "calm" },
          { idx: 1, text: `Justo... desculpa estourar. Fechado contigo, Capitão!`, tone: "calm" }
        ]
      },
      good: {
        label: `Testar ${actors[1].name} com a braçadeira para aliviar a pressão sobre ${actors[0].name}`,
        approachTag: "Rodízio de Faixa",
        tacticsPatch: { captainActorIdx: 1 },
        coachLine: `${actors[1].name}, assume a faixa neste jogo para puxar a zaga e liberar o ${actors[0].name} pra pensar o jogo.`,
        reactions: [
          { idx: 1, text: `Beleza! Responsabilidade aceita!`, tone: "normal" },
          { idx: 0, text: `Menos peso pra mim realmente ajuda.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Deixar os dois se xingando e trocar para intensidade máxima sem organização",
        approachTag: "Caos Total",
        tacticsPatch: { intensity: "high", style: "free" },
        coachLine: `Resolvam na porrada em campo! Todo mundo no máximo sem tática.`,
        reactions: [
          { idx: 2, text: `Assim o vestiário explode aos 10 minutos...`, tone: "toxic" }
        ]
      }
    }, ctx)
  ),

  makeChatTpl(
    "rage_wing_vs_center",
    "RAIVA",
    "Briga de Corredor",
    [
      { pred: (a) => a.archetype === "PACE_LEADER" || a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "MF", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Eu me mato correndo pela lateral aberta contra ${ctx.oppName} e vocês só afunilam pelo meio entupido!`, "toxic"),
      mkSpontaneousMsg(actors, 1, `Pelo meio é o caminho mais curto pro gol com ${actors[1].ofMove}! Na ponta você se isola na bandeirinha!`, "toxic")
    ],
    (actors, ctx) => buildShuffledChatChoices(actors, {
      great: {
        label: "Abrir o corredor pelas Pontas e ativar Rota do Céu para explorar a velocidade",
        approachTag: "Ataque Pelas Pontas",
        tacticsPatch: { lane: "wings", hissatsuTactic: "route_of_sky" },
        coachLine: `Vamos atacar pelas Pontas com Rota do Céu! ${actors[1].name} vira o jogo por cima e ${actors[0].name} atropela livre!`,
        reactions: [
          { idx: 0, text: `AGORA SIM! Vai ter bola pra minha corrida o jogo todo!`, tone: "hype" },
          { idx: 1, text: `Com Rota do Céu atravessando os marcadores, fica fácil te achar na ala!`, tone: "idea" }
        ]
      },
      good: {
        label: "Centralizar as infiltrações pelo Meio usando posse curta",
        approachTag: "Infiltração Central",
        tacticsPatch: { lane: "center", style: "possession" },
        coachLine: `Vamos pelo Meio com toque curto — ${actors[0].name} fecha por dentro junto com o meia.`,
        reactions: [
          { idx: 1, text: `Por dentro o gol fica logo ali!`, tone: "calm" },
          { idx: 0, text: `Vou cortar da ponta pro centro então.`, tone: "normal" }
        ]
      },
      poor: {
        label: "Forçar jogo estático e mandar ambos não se aproximarem um do outro",
        approachTag: "Afunilar Sem Apoio",
        tacticsPatch: { posture: "balanced", lane: "balanced" },
        coachLine: `Cada um fique longe do outro e nem tente tabela.`,
        reactions: [
          { idx: 0, text: `Zero química assim...`, tone: "toxic" }
        ]
      }
    }, ctx)
  ),

  makeChatTpl(
    "rage_voice_note_rant",
    "RAIVA",
    "Áudio Revoltado no Grupo",
    [
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "MF" || a.role === "FW", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `🎤 Áudio (0:14): "Olha o replay do gol que levamos no treino!! Eu dando carrinho com ${actors[0].dfMove} e ninguém fecha a sobra da entrada da área!"`, "toxic"),
      mkSpontaneousMsg(actors, 1, `Escutei o áudio no volume mínimo e já deu pra sentir o chilique daqui... contra ${ctx.oppName} eu volto sim!`, "tense")
    ],
    (actors, ctx) => buildShuffledChatChoices(actors, {
      great: {
        label: "Reconhecer a falha e ajustar Postura Recuada + Contra-Ataque Catenaccio",
        approachTag: "Fechar Sobras",
        tacticsPatch: { posture: "defensive", hissatsuTactic: "catenaccio" },
        coachLine: `${actors[0].name} tem ponto — contra ${ctx.oppName} ajustamos Postura Recuada e Catenaccio pra transformar cada rebote em contra-ataque!`,
        reactions: [
          { idx: 0, text: `Aí sim professor! Catenaccio trava tudo e ainda devolve rápido!`, tone: "hype" },
          { idx: 1, text: `E eu saio voando na transição assim que você roubar!`, tone: "hype" }
        ]
      },
      good: {
        label: "Manter equilíbrio e pedir foco na segunda bola",
        approachTag: "Ajuste Simples",
        tacticsPatch: { posture: "balanced" },
        coachLine: `Sem desespero: postura equilibrada e mais atenção na sobra.`,
        reactions: [
          { idx: 0, text: `Beleza, menos erro bobo então.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Rir do áudio e mandar linha alta mesmo sem cobertura",
        approachTag: "Expor Zaga",
        tacticsPatch: { posture: "offensive", style: "vertical" },
        coachLine: `Deixa o áudio pra lá e sobe a defesa toda sem cobertura mesmo.`,
        reactions: [
          { idx: 0, text: `Depois não reclama quando tomarmos bola nas costas!`, tone: "toxic" }
        ]
      }
    }, ctx)
  ),

  makeChatTpl(
    "rage_formation_complaint",
    "RAIVA",
    "Reclamação da Formação",
    [
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Desse jeito no esquema ${state.formation}, o meio fica aberto demais contra o ritmo de ${ctx.oppName}!`, "toxic"),
      mkSpontaneousMsg(actors, 1, `Se tirar zagueiro vai sobrar tudo nas minhas costas!!`, "toxic"),
      mkSpontaneousMsg(actors, 2, `E se tirar atacante quem faz os gols?!`, "tense")
    ],
    (actors, ctx) => buildShuffledChatChoices(actors, {
      great: {
        label: "Ajustar esquema para 3-5-2 e dominar o meio com 5 meias!",
        approachTag: "Mudar p/ 3-5-2",
        tacticsPatch: { formation: "3-5-2", style: "possession" },
        coachLine: `Fechado: mudamos para o 3-5-2 Imperial para dominar a posse com 5 meias e proteger a saída!`,
        reactions: [
          { idx: 0, text: `AGORA SIM! 3-5-2 enche o meio-campo de opções de passe!`, tone: "hype" },
          { idx: 1, text: `Três zagueiros bem protegidos pelos alas funciona demais!`, tone: "calm" }
        ]
      },
      good: {
        label: "Adotar 4-4-2 clássica equilibrada entre todos os setores",
        approachTag: "Mudar p/ 4-4-2",
        tacticsPatch: { formation: "4-4-2" },
        coachLine: `Vamos no 4-4-2 clássico: duas linhas de quatro sólidas e dupla na frente.`,
        reactions: [
          { idx: 1, text: `4-4-2 traz segurança imediata.`, tone: "calm" },
          { idx: 2, text: `Dupla de ataque sempre rende!`, tone: "normal" }
        ]
      },
      poor: {
        label: "Ignorar os três e colocar estilo aleatório sem ajuste",
        approachTag: "Ignorar Setores",
        tacticsPatch: { style: "free" },
        coachLine: `Fiquem quietos e joguem do jeito que cair sem reclamação.`,
        reactions: [
          { idx: 0, text: `Que teimosia...`, tone: "toxic" }
        ]
      }
    }, ctx)
  ),

  makeChatTpl(
    "rage_stamina_vs_intensity",
    "RAIVA",
    "Ritmo Insustentável",
    [
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "MF", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Você quer marcar em cima no talo desde o minuto 1 com energia em ${ctx.teamEnergy}%?! Vai travar todo mundo aos 60'!`, "toxic"),
      mkSpontaneousMsg(actors, 1, `Se aliviar agora ${ctx.oppName} toma conta da bola e a gente só assiste!`, "toxic")
    ],
    (actors, ctx) => buildShuffledChatChoices(actors, {
      great: {
        label: "Dosar para Esforço Médio + estilo Posse para economizar fôlego",
        approachTag: "Ritmo Inteligente",
        tacticsPatch: { intensity: "medium", style: "possession" },
        coachLine: `Esforço Médio com estilo Posse! Circulando a bola recuperamos fôlego sem entregar campo pra ${ctx.oppName}!`,
        reactions: [
          { idx: 0, text: `Perfeito! Fico inteiro pra arrancar no 2º tempo!`, tone: "hype" },
          { idx: 1, text: `Posse controlada resolve os dois problemas.`, tone: "calm" }
        ]
      },
      good: {
        label: "Baixar para Esforço Baixo e priorizar conservação de fôlego",
        approachTag: "Poupar Elenco",
        tacticsPatch: { intensity: "low" },
        coachLine: `Esforço Baixo desde já pra garantir fôlego no fim.`,
        reactions: [
          { idx: 0, text: `Pelo menos não morremos cedo.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Puxar Esforço Alto no talo o jogo inteiro",
        approachTag: "Tudo ou Nada",
        tacticsPatch: { intensity: "high" },
        coachLine: `Vai ser Esforço Alto do começo ao fim, aguente quem aguentar!`,
        reactions: [
          { idx: 0, text: `Prepara a maca porque minhas pernas já estão gritando...`, tone: "toxic" }
        ]
      }
    }, ctx)
  ),

  makeChatTpl(
    "rage_marked_rival_panic",
    "RAIVA",
    "Medo da Estrela Rival",
    [
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "GK", role: "GK" }
    ],
    (actors, ctx) => {
      const rName = ctx.rivalStar?.name || "o artilheiro deles";
      const rMove = ctx.rivalStar?.primaryMove || "o chute principal dele";
      return [
        mkSpontaneousMsg(actors, 1, `Se deixar ${rName} armar ${rMove} solto igual ontem, a culpa vai cair toda no meu colo de novo?!`, "toxic"),
        mkSpontaneousMsg(actors, 0, `Como é que eu vou adivinhar quem dobra nele se você não definir uma Marcação Especial?!`, "toxic")
      ];
    },
    (actors, ctx) => buildShuffledChatChoices(actors, {
      great: {
        label: `Ativar Marcação Especial em ${ctx.rivalStar?.name || "estrela rival"} com Pressão Relâmpago`,
        approachTag: "Anular Estrela",
        tacticsPatch: { markRival: true, hissatsuTactic: "lightning_press" },
        coachLine: `Marcação Especial ativada em ${ctx.rivalStar?.name || "ele"} + Pressão Relâmpago! Não vai respirar livre nem 1 segundo!`,
        reactions: [
          { idx: 0, text: `Agora sim! Com ordem clara eu grudo nele até o apito final!`, tone: "hype" },
          { idx: 1, text: `Tirou um peso gigante do gol!`, tone: "calm" }
        ]
      },
      good: {
        label: `Ativar Marcação Especial mantendo postura equilibrada`,
        approachTag: "Sombra Segura",
        tacticsPatch: { markRival: true, posture: "balanced" },
        coachLine: `Marcação Especial ligada nele, mas sem abandonar a linha.`,
        reactions: [
          { idx: 0, text: `Fechado, cobertura em dia.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Remover toda marcação especial e avançar as linhas",
        approachTag: "Deixar Livre",
        tacticsPatch: { markRival: "CLEAR", posture: "offensive" },
        coachLine: `Deixa ${ctx.rivalStar?.name || "ele"} solto e todo mundo avança!`,
        reactions: [
          { idx: 1, text: `Você quer me matar do coração no gol?!`, tone: "toxic" }
        ]
      }
    }, ctx)
  ),

  makeChatTpl(
    "rage_blooper_laugh",
    "RAIVA",
    "Furada Viralisou",
    [
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "MF" || a.role === "GK", role: "MF" },
      { pred: (a) => a.role === "DF", role: "DF" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 1, `Kkkkk alguém viu o vídeo do ${actors[0].name} furando a bola tentando mandar ${actors[0].shMove} no treino?!`, "banter"),
      mkSpontaneousMsg(actors, 0, `APAGA ESSA PORCARIA AGORA!! A bola molhada quicou errado e vocês ficam rindo igual bobos?!`, "toxic"),
      mkSpontaneousMsg(actors, 2, `Ih, pesou o clima... melhor nem mandar figurinha agora.`, "tense")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Transformar o tropeço em treino sério de domínio sob pressão",
        approachTag: "Foco Técnico",
        coachLine: `Até bola difícil exige concentração total no domínio! Canalizem essa energia para acertar tudo contra o adversário!`,
        reactions: [
          { idx: 0, text: `Certo... foco 100% agora. No jogo eu guardo duas só pra responder!`, tone: "hype" },
          { idx: 1, text: `Desculpa aí fera, tô contigo pro passe perfeito hoje.`, tone: "calm" }
        ]
      },
      good: {
        label: "Pedir pra apagarem o vídeo e seguirem o treino",
        approachTag: "Encerrar Zoeira",
        coachLine: `Chega de zoação no grupo. Foco total na partida agora.`,
        reactions: [
          { idx: 1, text: `Apaguei já, foi mal!`, tone: "normal" },
          { idx: 0, text: `Valeu.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Compartilhar mais memes da furada no grupo",
        approachTag: "Botar Lenha",
        coachLine: `Tem que rir mesmo, foi feio demais kkk!`,
        reactions: [
          { idx: 0, text: `Até o técnico tirando onda... valeu mesmo hein.`, tone: "toxic" }
        ]
      }
    })
  ),

  makeChatTpl(
    "rage_dribble_lost_ball",
    "RAIVA",
    "Perda no Meio-Campo",
    [
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "MF", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Não dá pra inventar drible na frente da área com ${ctx.oppName} pressionando! Solta a bola!!`, "toxic"),
      mkSpontaneousMsg(actors, 1, `Se eu não usar ${actors[1].ofMove} pra limpar o volante, o passe morre no pé do rival!`, "toxic")
    ],
    (actors, ctx) => buildShuffledChatChoices(actors, {
      great: {
        label: "Ajustar estilo Posse pra dar opção curta segura antes do drible",
        approachTag: "Apoio Curto",
        tacticsPatch: { style: "possession", lane: "center" },
        coachLine: `Com estilo Posse todo mundo se aproxima pra dar passe curto — só use ${actors[1].ofMove} quando estiver no 1x1 limpo!`,
        reactions: [
          { idx: 1, text: `Tendo opção próxima eu solto muito mais fácil!`, tone: "calm" },
          { idx: 0, text: `E eu fico atrás pronto pra cobertura!`, tone: "hype" }
        ]
      },
      good: {
        label: "Pedir pro meia soltar mais vertical ao recuperar a posse",
        approachTag: "Saída Rápida",
        tacticsPatch: { style: "vertical" },
        coachLine: `Pensou dois segundos, joga vertical pros atacantes brigarem.`,
        reactions: [
          { idx: 1, text: `Menos risco na frente da zaga mesmo.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Proibir qualquer tentativa de drible do meia no jogo",
        approachTag: "Engessar Criador",
        tacticsPatch: { style: "free" },
        coachLine: `Se tentar um drible sequer vai pro banco na hora.`,
        reactions: [
          { idx: 1, text: `Cortou meu melhor recurso em campo...`, tone: "toxic" }
        ]
      }
    }, ctx)
  ),

  // ===================== CRIAR TÉCNICA (+9 = 17) =====================
  makeChatTpl(
    "tech_vertical_rocket",
    "CRIAR_TECNICA",
    "Foguete Vertical 1-2",
    [
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "FW" || a.role === "MF", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Tô testando um passe rasante girando pra ligar direto ${actors[1].shMove} e ${actors[2].shMove} contra ${ctx.oppName}!`, "idea"),
      mkSpontaneousMsg(actors, 1, `Se o time jogar no estilo Vertical, a gente rasga a defesa antes deles piscarem!`, "hype"),
      mkSpontaneousMsg(actors, 2, `Bora transformar essa tabela relâmpago numa Hissatsu combinada AGORA!`, "hype")
    ],
    (actors, ctx) => buildShuffledChatChoices(actors, {
      great: {
        label: "Ajustar estilo Vertical + Postura Avançada pro trio testar a jogada!",
        approachTag: "Ataque Vertical",
        tacticsPatch: { style: "vertical", posture: "offensive" },
        coachLine: `Estilo Vertical e Postura Avançada ligados! Disparem o trio em velocidade máxima até cravar a técnica!`,
        reactions: [
          { idx: 0, text: `A bola saiu raspando a grama num foguete!!`, tone: "hype" },
          { idx: 1, text: `PERFEITO!! ${ctx.oppName} nunca vai acompanhar essa velocidade!`, tone: "hype" },
          { idx: 2, text: `Nasceu um golpe mortal do trio!!`, tone: "hype" }
        ]
      },
      good: {
        label: "Testar a jogada no contra-ataque mantendo postura equilibrada",
        approachTag: "Equilíbrio",
        tacticsPatch: { style: "vertical", posture: "balanced" },
        coachLine: `Vamos usar a transição vertical sem abrir muito atrás.`,
        reactions: [
          { idx: 0, text: `Boa segurança mantendo potência!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Pedir passe devagar pro lado pra não perder fôlego",
        approachTag: "Frear Ataque",
        tacticsPatch: { posture: "defensive", intensity: "low" },
        coachLine: `Esqueçam ataque rápido, segurem lá atrás.`,
        reactions: [
          { idx: 1, text: `Perdemos toda a explosão da jogada...`, tone: "tense" }
        ]
      }
    }, ctx)
  ),

  makeChatTpl(
    "tech_433_trident",
    "CRIAR_TECNICA",
    "Tridente de Ataque 4-3-3",
    [
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "MF" || a.role === "FW", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Imagina nós três fechando em tridente na cara do goleiro de ${ctx.oppName}... ninguém segura!`, "idea"),
      mkSpontaneousMsg(actors, 1, `Mas precisamos do esquema com 3 atacantes pra ficarmos próximos na área!`, "idea"),
      mkSpontaneousMsg(actors, 2, `Aí sai jogada combinada de primeira direto na rede!!`, "hype")
    ],
    (actors, ctx) => buildShuffledChatChoices(actors, {
      great: {
        label: "Mudar formação para 4-3-3 Ofensiva e sincronizar o Tridente!",
        approachTag: "Formação 4-3-3",
        tacticsPatch: { formation: "4-3-3", posture: "offensive" },
        coachLine: `Vai ser 4-3-3 Ofensiva! Três atacantes pressionando a zaga pra inventar uma técnica mortal em trio!`,
        reactions: [
          { idx: 0, text: `TRIDENTE ATIVADO!! Vai ser chuva de gols!!`, tone: "hype" },
          { idx: 1, text: `Agora ninguém segura nós três perto da área!`, tone: "hype" }
        ]
      },
      good: {
        label: "Aproximar os atacantes usando corredor das Pontas",
        approachTag: "Apoio Pelas Alas",
        tacticsPatch: { lane: "wings" },
        coachLine: `Atacamos pelas pontas pra juntar vocês na finalização.`,
        reactions: [
          { idx: 2, text: `Chego fechando fácil assim!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Recuar todo mundo pro 3-5-2 deixando só um isolado na frente",
        approachTag: "Quebrar Tridente",
        tacticsPatch: { posture: "defensive" },
        coachLine: `Melhor isolar só um atacante e fechar atrás.`,
        reactions: [
          { idx: 0, text: `Acabou com o trio...`, tone: "tense" }
        ]
      }
    }, ctx)
  ),

  makeChatTpl(
    "tech_curved_pinpoint",
    "CRIAR_TECNICA",
    "Laboratório de Curva & Spin",
    [
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 0, `Tô treinando bater com efeito por fora na bola pra ela contornar o zagueiro e cair no seu pé!`, "idea"),
      mkSpontaneousMsg(actors, 1, `Sério?! Quando a bola faz essa curva girando no ar, consigo emendar de primeira com ${actors[1].shMove}!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Ativar Rota do Céu pro elenco abusar de lançamentos curvos!",
        approachTag: "Passes Curvos",
        tacticsPatch: { hissatsuTactic: "route_of_sky", lane: "wings" },
        coachLine: `Rota do Céu configurada! Usem essa curva pro passe voar sobre os marcadores direto pro ataque!`,
        reactions: [
          { idx: 0, text: `QUE EFEITO ABSURDO A BOLA FEZ!!`, tone: "hype" },
          { idx: 1, text: `Impossível pra zaga ler a trajetória!`, tone: "hype" }
        ]
      },
      good: {
        label: "Treinar o tempo do domínio quando a bola quicar com spin",
        approachTag: "Controle Fino",
        coachLine: `Amortecem o primeiro toque no quique antes de concluir.`,
        reactions: [
          { idx: 1, text: `Domínio macio garantido!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Proibir passes com efeito por achar arriscado",
        approachTag: "Sem Efeito",
        tacticsPatch: { style: "free" },
        coachLine: `Nada de firula com curva, toca reto sempre.`,
        reactions: [
          { idx: 0, text: `Desanimou o treino de bola parada...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tech_catenaccio_counter",
    "CRIAR_TECNICA",
    "Muralha & Bote Coletivo",
    [
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "GK" || a.role === "DF", role: "GK" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Se encaixarmos ${actors[0].dfMove} com um passe cego no instante do desarme, viramos o jogo em cima de ${ctx.oppName}!`, "idea"),
      mkSpontaneousMsg(actors, 2, `Quando a defesa sincroniza desse jeito, dá pra sentir a aura subindo até debaixo das traves!`, "hype"),
      mkSpontaneousMsg(actors, 1, `Bora testar essa técnica defensiva combinada no esquema Catenaccio!`, "idea")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Configurar Contra-Ataque Catenaccio + Postura Recuada pra engatilhar o golpe!",
        approachTag: "Catenaccio Letal",
        tacticsPatch: { hissatsuTactic: "catenaccio", posture: "defensive" },
        coachLine: `Catenaccio ativo! Roubem em dupla e disparem o contra-ataque sincronizado na hora!`,
        reactions: [
          { idx: 0, text: `Ninguém fura esse bloqueio combinado!!`, tone: "hype" },
          { idx: 2, text: `Defesa de ferro pro torneio inteiro!`, tone: "hype" }
        ]
      },
      good: {
        label: "Praticar só o posicionamento em linha atrás",
        approachTag: "Bloco Sólido",
        tacticsPatch: { posture: "defensive" },
        coachLine: `Compactem atrás antes de sair jogando.`,
        reactions: [
          { idx: 0, text: `Bem firme atrás.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Abrir toda a defesa no 3-4-3 sem zagueiros extras",
        approachTag: "Expor Retaguarda",
        tacticsPatch: { posture: "offensive" },
        coachLine: `Esquece defesa, manda zagueiro pro ataque também.`,
        reactions: [
          { idx: 2, text: `Aí desmontou toda a muralha que estávamos montando...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tech_item_combo_lab",
    "CRIAR_TECNICA",
    "Teste de Equipamento Novo",
    [
      { pred: (a) => Boolean(a.equipTitle) || a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "MF", role: "MF" }
    ],
    (actors) => {
      const eq = actors[0].equipTitle || "as chuteiras novas";
      return [
        mkSpontaneousMsg(actors, 0, `Cara, usando ${eq} eu senti minha arrancada e força subirem absurdo! Quer testar uma tabela rápida pra ver o estrago?!`, "idea"),
        mkSpontaneousMsg(actors, 1, `Bora! Se eu acompanhar sua velocidade com ${actors[1].ofMove}, sai técnica nova na hora!`, "hype")
      ];
    },
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Acelerar no corredor e consolidar a técnica da dupla em velocidade!",
        approachTag: "Acelerar Combo",
        tacticsPatch: { style: "vertical" },
        coachLine: `Aproveitem o boost do equipamento no estilo Vertical — quero vocês rasgando a marcação em dupla!`,
        reactions: [
          { idx: 0, text: `QUE IMPACTO ABSURDO!! Parecia um cometa no campo!`, tone: "hype" },
          { idx: 1, text: `Encaixou no primeiro toque!`, tone: "hype" }
        ]
      },
      good: {
        label: "Focar na precisão antes de forçar a corrida máxima",
        approachTag: "Precisão",
        coachLine: `Ajustem a passada devagar até pegar confiança no toque.`,
        reactions: [
          { idx: 0, text: `Tá ótimo, pegando o jeito rápido.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Mandar tirar ritmo e nem usar arranque na partida",
        approachTag: "Frear",
        tacticsPatch: { intensity: "low" },
        coachLine: `Joguem devagar sem correr com bola.`,
        reactions: [
          { idx: 0, text: `E o equipamento no pé fica só de enfeite...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tech_late_night_spark",
    "CRIAR_TECNICA",
    "Ideia de Madrugada",
    [
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "FW" || a.role === "MF", role: "MF" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 0, `Acordei 02:14 pensando nisso!! Se eu der um toque picado com efeito e você já bater no giro, nasce uma técnica nova!`, "idea", { time: "02:14" }),
      mkSpontaneousMsg(actors, 1, `Cê não dorme não?! kkk Mas espera... pior que faz MUITO sentido! Amanhã no aquecimento nós três testamos isso!`, "hype", { time: "02:16" }),
      mkSpontaneousMsg(actors, 2, `Contem comigo fechando a triangulação!!`, "hype", { time: "02:17" })
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Validar o rascunho cedo no campo e testar a jogada combinada!",
        approachTag: "Ensaio Matinal",
        coachLine: `Mentes brilhantes não desligam! No primeiro toque do treino hoje nós montamos essa sequência no campo!`,
        reactions: [
          { idx: 0, text: `DEUS DO FUTEBOL!! Saiu exatamente igual eu sonhei!!`, tone: "hype" },
          { idx: 1, text: `Insônia abençoada essa hein kkk!`, tone: "hype" }
        ]
      },
      good: {
        label: "Anotar no quadro tático pra testar com calma depois",
        approachTag: "Anotar Plano",
        coachLine: `Boa visão! Desenha na prancheta depois que todo mundo acordar.`,
        reactions: [
          { idx: 0, text: `Já deixei tudo riscado na prancheta!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Dar sermão por mandarem mensagem de madrugada",
        approachTag: "Silenciar Ideia",
        coachLine: `Apaguem essa bobagem e vão dormir, proibido falar de técnica de noite.`,
        reactions: [
          { idx: 0, text: `Poxa... esfriou toda minha empolgação.`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tech_lightning_press_trap",
    "CRIAR_TECNICA",
    "Bote Sincronizado no Meio",
    [
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "MF", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 1, `Quando ${ctx.oppName} tenta rodar a bola devagar, se nós dois fecharmos em pinça ao mesmo tempo...`, "idea"),
      mkSpontaneousMsg(actors, 0, `Você tira a saída curta e eu esmago com ${actors[0].dfMove}! Viramos máquina de roubar bola!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Ativar Pressão Relâmpago pro time engolir a saída adversária!",
        approachTag: "Pressão Relâmpago",
        tacticsPatch: { hissatsuTactic: "lightning_press", intensity: "high" },
        coachLine: `Pressão Relâmpago ativada! Quando fecharem em pinça, ninguém sai jogando limpo contra nós!`,
        reactions: [
          { idx: 0, text: `Mordemos a bola antes deles passarem do meio!!`, tone: "hype" },
          { idx: 1, text: `Pressão mortal funcionando liso!`, tone: "hype" }
        ]
      },
      good: {
        label: "Manter pressão moderada sem gastar tanta energia",
        approachTag: "Pressão Média",
        tacticsPatch: { intensity: "medium" },
        coachLine: `Fechem os espaços em ritmo médio pra não estourar cedo.`,
        reactions: [
          { idx: 0, text: `Equilibrado e eficiente!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Recuar todos atrás deixando o adversário trocar passes livre",
        approachTag: "Passividade",
        tacticsPatch: { intensity: "low", posture: "defensive" },
        coachLine: `Nem tentem pressionar, só assistam eles tocarem bola.`,
        reactions: [
          { idx: 1, text: `Aí matou nossa melhor arma defensiva...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tech_gk_long_counter",
    "CRIAR_TECNICA",
    "Reposição Míssil do Goleiro",
    [
      { pred: (a) => a.role === "GK", role: "GK" },
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "MF", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Quando eu seguro com ${actors[0].gkMove}, já levanto a cabeça na hora! Se você arrancar no segundo zero, ${actors[1].name}, mando na tua passada!`, "idea"),
      mkSpontaneousMsg(actors, 1, `Bola longa do goleiro direto pra minha ${actors[1].shMove}?! ${ctx.oppName} nem volta a tempo!`, "hype"),
      mkSpontaneousMsg(actors, 2, `Eu corro logo atrás pra emendar de primeira se precisar do terceiro toque!`, "idea")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Ligar Estilo Vertical + Rota do Céu pro contra-ataque direto do goleiro!",
        approachTag: "Ligação Direta",
        tacticsPatch: { style: "vertical", hissatsuTactic: "route_of_sky" },
        coachLine: `Estilo Vertical! Saiu da mão do ${actors[0].name}, vocês dois já partem na diagonal pra cravar a técnica!`,
        reactions: [
          { idx: 0, text: `Lançamento teleguiado de 70 metros!!`, tone: "hype" },
          { idx: 1, text: `No peito e direto pro gol!! Técnica perfeita!`, tone: "hype" }
        ]
      },
      good: {
        label: "Manter opção de reposição curta segura quando estiverem marcados",
        approachTag: "Saída Curta",
        coachLine: `Se marcarem o ataque, sai jogando curto pelos lados com calma.`,
        reactions: [
          { idx: 0, text: `Combinado, sempre olho antes de repor.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Proibir o goleiro de repor rápido pedindo pra segurar o relógio",
        approachTag: "Lento Demais",
        tacticsPatch: { intensity: "low" },
        coachLine: `Segura a bola na mão 5 segundos sempre que defender.`,
        reactions: [
          { idx: 1, text: `Assim a defesa deles sempre se fecha toda...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tech_center_tiki_taka",
    "CRIAR_TECNICA",
    "Carrossel de Passe Curto",
    [
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 0, `Toque de 1 metro, giro rápido e passe invisível entre nós três — vamos virar um carrossel no meio-campo!`, "idea"),
      mkSpontaneousMsg(actors, 1, `Com Posse de Bola ativada ninguém intercepta um passe sequer!`, "hype"),
      mkSpontaneousMsg(actors, 2, `E no último toque eu finalizo livre dentro da área!!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Configurar estilo Posse + Corredor pelo Meio pro carrossel rodar liso!",
        approachTag: "Tiki-Taka Centro",
        tacticsPatch: { style: "possession", lane: "center" },
        coachLine: `Posse pelo Meio ativada! Toque de primeira até abrir o clarão final pro golpe combinado!`,
        reactions: [
          { idx: 0, text: `Os marcadores ficaram tontos tentando acompanhar!!`, tone: "hype" },
          { idx: 1, text: `Nossa tabela tá imparável!!`, tone: "hype" },
          { idx: 2, text: `Bola redondinha na marca do pênalti!`, tone: "hype" }
        ]
      },
      good: {
        label: "Praticar o carrossel mantendo o corredor livre",
        approachTag: "Tabela Livre",
        tacticsPatch: { style: "possession" },
        coachLine: `Estilo Posse com liberdade de movimento pros lados também.`,
        reactions: [
          { idx: 0, text: `Flui muito bem!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Mandar chutar balão de longe antes de completar 2 passes",
        approachTag: "Forçar Balão",
        tacticsPatch: { style: "vertical", lane: "wings" },
        coachLine: `Sem passe curto hoje, só chutão alto pros cantos.`,
        reactions: [
          { idx: 0, text: `Acabou com toda a beleza do meio-campo...`, tone: "tense" }
        ]
      }
    })
  ),

  // ===================== ELOGIO & UNIÃO (+8 = 15) =====================
  makeChatTpl(
    "praise_super_harmony",
    "ELOGIO",
    "Aura Coletiva Imbatível",
    [
      { pred: (a) => a.isCaptain || a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "DF", role: "DF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Pessoal, esse grupo tem algo especial. Mesmo contra ${ctx.oppName}, dá pra sentir todo mundo jogando um pelo outro!`, "praise"),
      mkSpontaneousMsg(actors, 1, `Real! Hoje eu entrei em campo sem medo porque confio cegamente em quem tá atrás e do meu lado!`, "hype"),
      mkSpontaneousMsg(actors, 2, `Essa união multiplica nosso fôlego!!`, "praise")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Ativar Harmonia da Raimon como Tática Especial e exaltar a união!",
        approachTag: "Harmonia Total",
        tacticsPatch: { hissatsuTactic: "raimon_harmony" },
        coachLine: `Harmonia da Raimon selecionada pro jogo! Quando a química brilha assim, nenhum adversário segura o nosso time!`,
        reactions: [
          { idx: 0, text: `É isso!! Energia renovada e elenco 100% fechado!`, tone: "hype" },
          { idx: 1, text: `Vamo buscar esse título juntos!!`, tone: "hype" }
        ]
      },
      good: {
        label: "Agradecer o clima e reforçar foco antes do apito",
        approachTag: "Foco Positivo",
        coachLine: `Orgulho de comandar um time unido assim. Sigam concentrados!`,
        reactions: [
          { idx: 0, text: `Tamo junto sempre, professor!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Falar que sentimentalismo atrapalha jogadores frios",
        approachTag: "Cortar Clima",
        coachLine: `Menos papo de amizade, futebol é cada um por si.`,
        reactions: [
          { idx: 1, text: `Nossa... jogou um balde de gelo no grupo inteiro.`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "praise_gk_clean_sheet",
    "ELOGIO",
    "Confiança Debaixo das Traves",
    [
      { pred: (a) => a.role === "GK", role: "GK" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 1, `${actors[0].name}, vi o treino de reflexos hoje — até bola desviada você foi buscar com ${actors[0].gkMove}!`, "praise"),
      mkSpontaneousMsg(actors, 0, `Tô no melhor momento do torneio! Podem ir buscar gols em cima de ${ctx.oppName} que eu seguro as pontas aqui atrás!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Dar liberdade ofensiva pro time sabendo que o gol está blindado!",
        approachTag: "Avançar Linhas",
        tacticsPatch: { posture: "offensive" },
        coachLine: `Com ${actors[0].name} nesse nível no gol, vamos em Postura Avançada sufocar o adversário no ataque!`,
        reactions: [
          { idx: 1, text: `AGORA SIM!! Pressão lá em cima sem medo de tomar bola atrás!`, tone: "hype" },
          { idx: 0, text: `Pode deixar a meta comigo!!`, tone: "hype" }
        ]
      },
      good: {
        label: "Elogiar o goleiro mantendo postura equilibrada",
        approachTag: "Equilíbrio",
        coachLine: `Nosso paredão dá calma pro time todo jogar leve!`,
        reactions: [
          { idx: 0, text: `Valeu, treinador!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Lembrar de uma falha antiga só pra mantê-lo nervoso",
        approachTag: "Abalar Confiança",
        coachLine: `Cuidado pra não engolir frango igual no começo da temporada hein.`,
        reactions: [
          { idx: 0, text: `Valeu pela força... ajudou bastante a confiança agora...`, tone: "toxic" }
        ]
      }
    })
  ),

  makeChatTpl(
    "praise_training_workhorse",
    "ELOGIO",
    "O Último a Sair do Campo",
    [
      { pred: (a) => a.archetype === "WARRIOR" || a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 1, `Ontem fui pegar minha garrafa depois do treino e o ${actors[0].name} ainda tava aperfeiçoando ${actors[0].dfMove} sozinho no escuro!`, "praise"),
      mkSpontaneousMsg(actors, 2, `Dedicação surreal!! É por isso que você não perde dividida nenhuma!`, "praise"),
      mkSpontaneousMsg(actors, 0, `Quero estar 100% pronto quando o time precisar!`, "calm")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Usar o exemplo dele pro time inteiro recuperar o ânimo e elevar a entrega!",
        approachTag: "Exemplo de Raça",
        coachLine: `Olhem pro esforço do ${actors[0].name}! Essa fome de vencer renova a energia de qualquer vestiário!`,
        reactions: [
          { idx: 1, text: `Inspirou todo mundo! Hoje ninguém para de correr!`, tone: "hype" },
          { idx: 2, text: `Moral lá no teto!!`, tone: "hype" }
        ]
      },
      good: {
        label: "Parabenizar mas lembrar de descansar antes do jogo",
        approachTag: "Cuidar do Corpo",
        coachLine: `Orgulho do seu empenho, mas descansa o corpo agora pro jogo.`,
        reactions: [
          { idx: 0, text: `Pode deixar, professor!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Dar bronca por ficar treinando depois do horário",
        approachTag: "Repreender",
        coachLine: `Ninguém pediu hora extra, só vai se machucar à toa.`,
        reactions: [
          { idx: 0, text: `Só queria melhorar pro time...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "praise_winger_assist",
    "ELOGIO",
    "Rei das Assistências",
    [
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.archetype === "PACE_LEADER" || a.role === "MF", role: "MF" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 0, `Cara, cada cruzamento ou toque teu pelas pontas chega tão limpo que metade dos meus gols são teus, ${actors[1].name}!`, "praise"),
      mkSpontaneousMsg(actors, 1, `E eu só cruzo tranquilo porque sei que você tá sempre no lugar exato pra matar o goleiro!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Privilegiar o corredor das Pontas para alimentar ainda mais essa dupla!",
        approachTag: "Corredor: Pontas",
        tacticsPatch: { lane: "wings" },
        coachLine: `Corredor pelas Pontas liberado! Continuem alimentando essa conexão mortal na área!`,
        reactions: [
          { idx: 1, text: `Vão chover assistências hoje!!`, tone: "hype" },
          { idx: 0, text: `Tô faminto por gol, só manda!`, tone: "hype" }
        ]
      },
      good: {
        label: "Elogiar e manter variedade pelos dois lados",
        approachTag: "Corredor Livre",
        tacticsPatch: { lane: "balanced" },
        coachLine: `Ótima sintonia — sigam variando quando a ala fechar.`,
        reactions: [
          { idx: 1, text: `Certo!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Dizer pro ponta parar de cruzar e só recuar pro goleiro",
        approachTag: "Matar Jogada",
        coachLine: `Chega de cruzar, recuem tudo.`,
        reactions: [
          { idx: 0, text: `Estranho cortar justo o que tá dando mais certo...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "praise_smart_sub_adapt",
    "ELOGIO",
    "Adaptação Perfeita",
    [
      { pred: (a) => a.role === "DF" || a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW" || a.role === "MF", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 1, `Impressionante como você lê cada mudança do jogo em segundos, ${actors[0].name}. Dá muita paz jogar contra ${ctx.oppName} contigo no setor!`, "praise"),
      mkSpontaneousMsg(actors, 0, `Jogar com companheiros inteligentes deixa qualquer esquema 10x mais fácil!`, "praise")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: `Nomear ${actors[0].name} referência de confiança no time pro próximo duelo!`,
        approachTag: "Elevar Líder",
        coachLine: `Inteligência e humildade assim carregam um campeão! Entrem confiantes e com espírito renovado!`,
        reactions: [
          { idx: 0, text: `Valeu mesmo! Moral no máximo!`, tone: "hype" },
          { idx: 1, text: `Ninguém derruba nosso grupo hoje!`, tone: "hype" }
        ]
      },
      good: {
        label: "Confirmar que a leitura coletiva tá afiada",
        approachTag: "Apoio",
        coachLine: `Continuem se comunicando em voz alta durante os 90 minutos.`,
        reactions: [
          { idx: 0, text: `Com certeza!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Desviar do elogio cobrando mais gols",
        approachTag: "Frieza",
        coachLine: `Bonito elogiar, mas quero números, não conversa.`,
        reactions: [
          { idx: 1, text: `Clima deu uma travada...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "praise_equip_respect",
    "ELOGIO",
    "Reconhecimento no Treino",
    [
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "GK" || a.role === "DF", role: "GK" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 0, `${actors[1].name}, aquela sua saída limpa de bola ontem livrou o time de sufoco três vezes seguidas!`, "praise"),
      mkSpontaneousMsg(actors, 1, `E quando você entra firme com ${actors[0].dfMove}, eu já sei que a bola é nossa antes mesmo da dividida!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Exaltar a firmeza defensiva e renovar a disposição do setor!",
        approachTag: "Moral Defensiva",
        coachLine: `Zaga e goleiro nessa sintonia tiram o sono de qualquer ataque!`,
        reactions: [
          { idx: 0, text: `Energia no talo e zero medo!`, tone: "hype" },
          { idx: 1, text: `Vamo sair sem sofrer gol!`, tone: "hype" }
        ]
      },
      good: {
        label: "Pedir pra manterem a calma na saída de bola",
        approachTag: "Serenidade",
        coachLine: `Mantenham a tranquilidade sempre que pressionados.`,
        reactions: [
          { idx: 1, text: `Fica firme assim!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Falar que só não levaram gol porque o treino foi fraco",
        approachTag: "Diminuir Feito",
        coachLine: `Nosso ataque no treino não exigiu nada de vocês.`,
        reactions: [
          { idx: 0, text: `Poxa... não é bem assim não.`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "praise_double_comeback",
    "ELOGIO",
    "Memória da Virada",
    [
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "GK", role: "GK" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 1, `Lembram quando a gente parecia travado e bastou uma tabela pra virar o jogo inteiro? Esse elenco nunca desiste!`, "praise"),
      mkSpontaneousMsg(actors, 0, `Quando a bola chega em ${actors[0].shMove} nos minutos finais, parece até cena de anime kkk!`, "hype"),
      mkSpontaneousMsg(actors, 2, `Hoje contra ${ctx.oppName}, se precisarmos decidir no fim, todo mundo já sabe quem cresce!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Transformar essa confiança em energia extra imediata pro grupo!",
        approachTag: "Garra Inazuma",
        coachLine: `Esse é o verdadeiro Futebol Inazuma — coragem até o último segundo do relógio!`,
        reactions: [
          { idx: 0, text: `ARREPIEI!! Bora entrar pra vencer desde já!`, tone: "hype" },
          { idx: 1, text: `Energia renovada de verdade!`, tone: "hype" }
        ]
      },
      good: {
        label: "Pedir pro time decidir cedo pra não precisar sofrer no fim",
        approachTag: "Decidir Cedo",
        coachLine: `Ótima mentalidade, mas melhor construir o placar já no 1º tempo!`,
        reactions: [
          { idx: 0, text: `Melhor ainda — resolver cedo!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Falar que virar jogos foi sorte pura e não volta a acontecer",
        approachTag: "Descrença",
        coachLine: `Se sairmos atrás de novo hoje, já era — não temos força pra virar sempre.`,
        reactions: [
          { idx: 2, text: `Caramba, que falta de fé no próprio elenco...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "praise_locker_gratitude",
    "ELOGIO",
    "Chuteira Brilhando",
    [
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "DF", role: "DF" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 0, `Valeu por cobrir minhas subidas o tempo inteiro sem reclamar uma vez sequer, ${actors[1].name}. Você faz eu jogar muito melhor!`, "praise"),
      mkSpontaneousMsg(actors, 1, `Tamo aqui pra isso! Quando vejo você distribuindo passe lindo na frente, vale cada corrida atrás!`, "praise")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Reforçar essa parceria — juntos são imbatíveis no meio e na defesa!",
        approachTag: "Dupla de Confiança",
        coachLine: `Essa entrega sem vaidade faz a equipe inteira crescer e poupa fôlego de todo mundo!`,
        reactions: [
          { idx: 0, text: `Energia mil pra próxima partida!!`, tone: "hype" },
          { idx: 1, text: `Conte comigo em cada lance!`, tone: "hype" }
        ]
      },
      good: {
        label: "Aplaudir a parceria e alinhar saída curta",
        approachTag: "Boa Dupla",
        coachLine: `Continuem se cobrindo com inteligência.`,
        reactions: [
          { idx: 1, text: `Sempre atento!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Dizer pro zagueiro parar de ajudar o meia e só olhar pro próprio lado",
        approachTag: "Desconectar Setor",
        coachLine: `Cada um cuida só do seu metro quadrado e pronto.`,
        reactions: [
          { idx: 0, text: `Justo quando a parceria tava voando...`, tone: "tense" }
        ]
      }
    })
  ),

  // ===================== ESTUDO DO RIVAL / TÁTICA (+10 = 16) =====================
  makeChatTpl(
    "tac_man_mark_star",
    "TATICA_RIVAL",
    "Dossiê do Craque Rival",
    [
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "MF", role: "MF" }
    ],
    (actors, ctx) => {
      const rName = ctx.rivalStar?.name || "o camisa principal deles";
      const rMove = ctx.rivalStar?.primaryMove || "a Hissatsu principal";
      return [
        mkSpontaneousMsg(actors, 1, `Levantei os números de ${ctx.oppName}: quase toda bola perigosa passa pelo ${rName} (${rMove}).`, "idea"),
        mkSpontaneousMsg(actors, 0, `Se eu colar nele com Marcação Especial e fechar o espaço antes da área, cortamos o ataque inteiro de ${ctx.oppName}!`, "hype")
      ];
    },
    (actors, ctx) => buildShuffledChatChoices(actors, {
      great: {
        label: `Ativar Marcação Especial em ${ctx.rivalStar?.name || "estrela"} e fechar com ${actors[0].dfMove}!`,
        approachTag: "Sombra no Craque",
        tacticsPatch: { markRival: true },
        coachLine: `Excelente scout! Marcação Especial ativada nele — cortem a linha do passe e não deem meio metro!`,
        reactions: [
          { idx: 0, text: `Ele vai achar que tem minha sombra colada nas costas hoje!!`, tone: "hype" },
          { idx: 1, text: `E o passe pro resto do time deles vai cair todo errado!`, tone: "idea" }
        ]
      },
      good: {
        label: "Focar em interceptar em zona sem prender um marcador fixo",
        approachTag: "Marcação em Zona",
        tacticsPatch: { markRival: "CLEAR", style: "possession" },
        coachLine: `Fechamos em zona compacta sem deixar espaço pra outros atacantes entrarem.`,
        reactions: [
          { idx: 1, text: `Mais equilibrado pro bloco todo.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Deixar o craque livre e mandar o time todo pro ataque",
        approachTag: "Ignorar Scout",
        tacticsPatch: { markRival: "CLEAR", posture: "offensive" },
        coachLine: `Nem esquentem com quem tem a bola — deixem ele solto.`,
        reactions: [
          { idx: 0, text: `Estudamos o cara à toa então...`, tone: "tense" }
        ]
      }
    }, ctx)
  ),

  makeChatTpl(
    "tac_choose_343_blitz",
    "TATICA_RIVAL",
    "Blitz Para Vencer Cedo",
    [
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW" || a.role === "DF", role: "DF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Contra ${ctx.oppName}, se entrarmos já mordendo com 3 atacantes e 4 meias empurrando, matamos o jogo antes do intervalo!`, "idea"),
      mkSpontaneousMsg(actors, 1, `Um 3-4-3 Relâmpago?! Vai ter gente entrando na área por todo lado!`, "hype"),
      mkSpontaneousMsg(actors, 2, `Só garante que todo mundo pressione quando perder a bola!`, "normal")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Mudar para 3-4-3 Relâmpago + Estilo Vertical pra atropelar desde o início!",
        approachTag: "Blitz 3-4-3",
        tacticsPatch: { formation: "3-4-3", style: "vertical", posture: "offensive" },
        coachLine: `Formação 3-4-3 Relâmpago + Estilo Vertical! Entramos pra massacrar o campo adversário!`,
        reactions: [
          { idx: 0, text: `FORMAÇÃO RELÂMPAGO ATIVADA!!`, tone: "hype" },
          { idx: 1, text: `Ataque em massa e posse rápida!`, tone: "hype" }
        ]
      },
      good: {
        label: "Subir só a postura para Avançado mantendo a formação atual",
        approachTag: "Avançar Linha",
        tacticsPatch: { posture: "offensive" },
        coachLine: `Mantemos a base mas avançamos a postura do elenco.`,
        reactions: [
          { idx: 2, text: `Preserva a segurança atrás e agride bem!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Desligar o ataque e jogar no Esforço Baixo recuado",
        approachTag: "Recuar Blitz",
        tacticsPatch: { posture: "defensive", intensity: "low" },
        coachLine: `Esqueçam ataque cedo, fica todo mundo atrás segurando 0x0.`,
        reactions: [
          { idx: 0, text: `Sem ousadia não assustamos ninguém...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tac_switch_wings_vs_343",
    "TATICA_RIVAL",
    "Flanco Descoberto",
    [
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Os laterais de ${ctx.oppName} sobem demais pro ataque e deixam uma avenida vazia nos cantos!`, "idea"),
      mkSpontaneousMsg(actors, 1, `Se concentrarmos os passes pelas Pontas assim que roubarmos a bola, fico mano a mano com o goleiro!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Ajustar Corredor: Pontas + Estilo Vertical pra explorar as alas abertas!",
        approachTag: "Explorar Alas",
        tacticsPatch: { lane: "wings", style: "vertical" },
        coachLine: `Leitura cirúrgica! Ataque pelas Pontas + Vertical pra castigar os corredores vazios!`,
        reactions: [
          { idx: 0, text: `Cada roubada já vira inversão longa pro canto!`, tone: "hype" },
          { idx: 1, text: `Eles vão correr atrás de poeira na linha lateral!`, tone: "hype" }
        ]
      },
      good: {
        label: "Deixar corredor Livre pra alternar entre centro e pontas",
        approachTag: "Corredor Livre",
        tacticsPatch: { lane: "balanced" },
        coachLine: `Sem forçar só a ponta — escolham o lado que tiver mais espaço.`,
        reactions: [
          { idx: 0, text: `Fica bem imprevisível também.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Afunilar pelo Meio onde eles colocam três marcadores",
        approachTag: "Ir no Muro",
        tacticsPatch: { lane: "center" },
        coachLine: `Não interessa se a ponta tá livre, só passem pelo meio congestionado.`,
        reactions: [
          { idx: 1, text: `Vamos bater direto na parede deles...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tac_high_press_trap",
    "TATICA_RIVAL",
    "Saída Lenta do Goleiro Rival",
    [
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "DF", role: "DF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Notei que o goleiro de ${ctx.oppName} demora pra decidir quando aperta a marcação na entrada da área!`, "idea"),
      mkSpontaneousMsg(actors, 1, `Se subirmos o bloco na Pressão Relâmpago, roubamos a bola já perto do gol deles!`, "hype"),
      mkSpontaneousMsg(actors, 2, `Aí eu só fico vigiando o lançamento longo caso tentem escapar pelo alto.`, "calm")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Armar Pressão Relâmpago com Postura Avançada pra sufocar na área deles!",
        approachTag: "Pressão Alta",
        tacticsPatch: { hissatsuTactic: "lightning_press", posture: "offensive" },
        coachLine: `Pressão Relâmpago + Postura Avançada! Sufocam a saída curta deles até forçar erro na cara do gol!`,
        reactions: [
          { idx: 0, text: `Vou morar na frente da área deles roubando saída!!`, tone: "hype" },
          { idx: 1, text: `Nenhuma saída limpa pro adversário hoje!`, tone: "hype" }
        ]
      },
      good: {
        label: "Pressionar só no meio-campo com postura equilibrada",
        approachTag: "Bloco Médio",
        tacticsPatch: { posture: "balanced" },
        coachLine: `Esperem passar do círculo central pra fechar os passes com mais segurança.`,
        reactions: [
          { idx: 2, text: `Protege melhor nossas costas assim.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Baixar tudo no próprio campo deixando eles saírem andando",
        approachTag: "Dar Espaço",
        tacticsPatch: { posture: "defensive", intensity: "low" },
        coachLine: `Deixem o goleiro deles sair jogando tranquilo sem apertar ninguém.`,
        reactions: [
          { idx: 0, text: `Desperdiçamos o melhor ponto fraco que achamos...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tac_ace_playmaker_shift",
    "TATICA_RIVAL",
    "Maestro Camisa 10",
    [
      { pred: (a) => a.archetype === "STRATEGIST" || a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 1, `Contra a linha baixa de ${ctx.oppName}, precisamos de alguém centralizando as bolas perigosas com precisão cirúrgica!`, "idea"),
      mkSpontaneousMsg(actors, 0, `Se passar pelo meu pé na armação ou no chute decisivo com ${actors[0].sigMove}, eu abro a defesa deles!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: `Dar a Camisa 10 pro ${actors[0].name} e focar estilo Posse pelo Meio!`,
        approachTag: "Camisa 10 Maestro",
        tacticsPatch: { aceActorIdx: 0, style: "possession", lane: "center" },
        coachLine: `${actors[0].name} vira nossa Referência Camisa 10 com Posse pelo Meio! Todo mundo gira em torno da visão dele!`,
        reactions: [
          { idx: 0, text: `Deixa comigo! Vou desmontar a retranca deles passe por passe!`, tone: "hype" },
          { idx: 1, text: `E eu só espero o espaço abrir pra fuzilar!`, tone: "hype" }
        ]
      },
      good: {
        label: "Manter Camisa 10 automático pro time decidir em campo",
        approachTag: "Sem Fixar 10",
        tacticsPatch: { aceActorIdx: "CLEAR" },
        coachLine: `Cada lance pede um protagonista — mantemos o Camisa 10 aberto.`,
        reactions: [
          { idx: 1, text: `Boa flexibilidade.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Mudar para Vertical cego sem armação pelo meio",
        approachTag: "Sem Armação",
        tacticsPatch: { style: "vertical", aceActorIdx: "CLEAR" },
        coachLine: `Não precisa de armador contra retranca, só chuta pra frente.`,
        reactions: [
          { idx: 0, text: `Contra defesa fechada chutão cego nunca passa...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tac_elem_disadvantage_plan",
    "TATICA_RIVAL",
    "Cuidado Elemental no Duelo",
    [
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "MF", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Olhei a escalação de ${ctx.oppName}: o goleiro deles tem elemento chato pro meu chute individual!`, "normal"),
      mkSpontaneousMsg(actors, 1, `Fácil! Se você bater de frente em desvantagem, rola a bola pro companheiro com elemento favorável empurrar!`, "idea")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Instruir estilo Posse pra rodar a bola até achar o melhor ângulo/elemento!",
        approachTag: "Escolha Inteligente",
        tacticsPatch: { style: "possession" },
        coachLine: `Estilo Posse ativo! Não forcem duelo desfavorável — toquem pro lado que tiver vantagem elemental!`,
        reactions: [
          { idx: 0, text: `Inteligente demais! Se fecharem com vantagem elemental em mim, eu assisto o colega!`, tone: "hype" },
          { idx: 1, text: `Chance de gol sobe absurdo assim!`, tone: "calm" }
        ]
      },
      good: {
        label: "Usar estilo Instinto pra cada um ler na hora do lance",
        approachTag: "Leitura Livre",
        tacticsPatch: { style: "free" },
        coachLine: `Confio no instinto de vocês pra decidir entre chutar ou tocar.`,
        reactions: [
          { idx: 0, text: `Certo, olho aberto na área.`, tone: "calm" }
        ]
      },
      poor: {
        label: "Mandar chutar de cara mesmo em total desvantagem elemental",
        approachTag: "Teimosia",
        tacticsPatch: { style: "vertical" },
        coachLine: `Não interessa elemento — pegou a bola, chuta direto mesmo na desvantagem.`,
        reactions: [
          { idx: 0, text: `O goleiro deles vai agradecer...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tac_set_piece_captain",
    "TATICA_RIVAL",
    "Voz de Comando em Campo",
    [
      { pred: (a) => a.archetype === "STRATEGIST" || a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "DF", role: "DF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 1, `Contra ${ctx.oppName}, se sairmos atrás no placar ou entrar na prorrogação, quem segura a ansiedade do elenco?`, "normal"),
      mkSpontaneousMsg(actors, 0, `Precisamos do Capitão falando direto perto de quem arma e recebe cada passe decisivo!`, "idea")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: `Entregar a faixa ao Estrategista ${actors[0].name} e ativar Harmonia da Raimon!`,
        approachTag: "Capitão Maestro",
        tacticsPatch: { captainActorIdx: 0, hissatsuTactic: "raimon_harmony" },
        coachLine: `${actors[0].name} comanda com a cabeça fria e Harmonia da Raimon segura a calma nos momentos quentes!`,
        reactions: [
          { idx: 0, text: `Cada passe meu vai sair com precisão e confiança pro elenco!`, tone: "hype" },
          { idx: 1, text: `Com o maestro com a faixa, ninguém perde a cabeça!`, tone: "calm" }
        ]
      },
      good: {
        label: `Dar a faixa ao Guerreiro ${actors[1].name} pela força defensiva`,
        approachTag: "Capitão Guerreiro",
        tacticsPatch: { captainActorIdx: 1 },
        coachLine: `${actors[1].name} assume a braçadeira pra blindar nossa zaga nos minutos finais.`,
        reactions: [
          { idx: 1, text: `Não passará nada na reta final!`, tone: "hype" }
        ]
      },
      poor: {
        label: "Dizer que Capitão não faz diferença nenhuma na partida",
        approachTag: "Descartar Aura",
        coachLine: `Qualquer um veste a faixa, não serve pra nada mesmo.`,
        reactions: [
          { idx: 0, text: `Aura do Capitão literalmente puxa o time nos momentos críticos, professor...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tac_box_overload_433",
    "TATICA_RIVAL",
    "Invasão da Grande Área",
    [
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "MF", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `A área de ${ctx.oppName} sempre fica vazia quando os meias empurram a marcação! Se entrarmos em mais gente...`, "idea"),
      mkSpontaneousMsg(actors, 1, `Um 4-3-3 bem aberto pelas alas cria duas opções livres de tap-in por ataque!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Mudar para 4-3-3 e atacar pelas Pontas!",
        approachTag: "4-3-3 Pontas",
        tacticsPatch: { formation: "4-3-3", lane: "wings" },
        coachLine: `Vamos de 4-3-3 com ataque pelas Pontas — inundem a área adversária!`,
        reactions: [
          { idx: 0, text: `Bola na área não vai faltar hoje!!`, tone: "hype" },
          { idx: 1, text: `Munição garantida pelos dois lados!`, tone: "calm" }
        ]
      },
      good: {
        label: "Manter 4-4-2 com posse equilibrada",
        approachTag: "Base 4-4-2",
        tacticsPatch: { formation: "4-4-2" },
        coachLine: `4-4-2 dá duas referências na frente sem abrir o meio.`,
        reactions: [
          { idx: 0, text: `Sólido também!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Recuar todos pra defender 90 minutos",
        approachTag: "Medo de Atacar",
        tacticsPatch: { posture: "defensive", lane: "balanced" },
        coachLine: `Fiquem longe da área deles.`,
        reactions: [
          { idx: 0, text: `Aí não fazemos gol nunca...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tac_energy_conservation",
    "TATICA_RIVAL",
    "Reserva de Energia Inteligente",
    [
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Pessoal, nossa energia tá em ${ctx.teamEnergy}% antes de enfrentar ${ctx.oppName}. Se queimarmos tudo no 1º tempo, o 2º vira pesadelo.`, "normal"),
      mkSpontaneousMsg(actors, 1, `Com Esforço Médio + estilo Posse, a gente cansa bem menos e usa técnica só na hora certa!`, "idea"),
      mkSpontaneousMsg(actors, 2, `Apoio! Quero perna inteira no fim do jogo pra decidir!`, "calm")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Configurar Esforço Médio + Estilo Posse para administrar o fôlego e passes!",
        approachTag: "Controle + Posse",
        tacticsPatch: { intensity: "medium", style: "possession" },
        coachLine: `Perfeito! Esforço Médio com Posse — o time controla a bola e guarda fôlego pros momentos agudos!`,
        reactions: [
          { idx: 0, text: `Leitura madura de elenco campeão!`, tone: "hype" },
          { idx: 2, text: `Com perna inteira aos 80' ninguém me segura!`, tone: "hype" }
        ]
      },
      good: {
        label: "Colocar Esforço Baixo só pra poupar no começo",
        approachTag: "Esforço Baixo",
        tacticsPatch: { intensity: "low" },
        coachLine: `Vamos com Esforço Baixo e subir depois se precisar.`,
        reactions: [
          { idx: 1, text: `Bem econômico!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Mandar Esforço Alto sem posse pra gastar toda bateria rápido",
        approachTag: "Queimar Fôlego",
        tacticsPatch: { intensity: "high", style: "vertical" },
        coachLine: `Gasta tudo em 20 minutos mesmo se estiver cansado!`,
        reactions: [
          { idx: 2, text: `No intervalo já estaremos mortos...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "tac_aerial_sky_switch",
    "TATICA_RIVAL",
    "Bloqueio no Chão",
    [
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 1, `Os volantes de ${ctx.oppName} fecham muito bem o meio no chão. Passe curto ali tá perigoso.`, "normal"),
      mkSpontaneousMsg(actors, 0, `Quando eu roubar com ${actors[0].dfMove}, posso pular o meio-campo lançando por cima pro ${actors[2].name}!`, "idea"),
      mkSpontaneousMsg(actors, 2, `Se ligarmos Rota do Céu, esses lançamentos por cima chegam limpinhos!!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Ativar Tática Especial Rota do Céu + estilo Vertical pra furar por cima!",
        approachTag: "Rota do Céu",
        tacticsPatch: { hissatsuTactic: "route_of_sky", style: "vertical" },
        coachLine: `Rota do Céu na agulha! Pula a pressão do meio com bolas aéreas girando direto pro ataque!`,
        reactions: [
          { idx: 1, text: `Que atalho inteligente pro gol!`, tone: "hype" },
          { idx: 2, text: `Vou voar atrás desses lançamentos!!`, tone: "hype" }
        ]
      },
      good: {
        label: "Alternar entre chão e lançamento livremente",
        approachTag: "Instinto",
        tacticsPatch: { style: "free" },
        coachLine: `Joguem por instinto conforme o marcador der espaço.`,
        reactions: [
          { idx: 1, text: `Natural e variado!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Forçar toque curto justamente onde estão os volantes deles",
        approachTag: "Teimar no Meio",
        tacticsPatch: { lane: "center", style: "possession" },
        coachLine: `Não chutem longo jamais — entrem driblando no bolo deles.`,
        reactions: [
          { idx: 0, text: `Perigo enorme de tomar contra-ataque ali...`, tone: "tense" }
        ]
      }
    })
  ),

  // ===================== RESENHA & VESTIÁRIO (+8 = 13) =====================
  makeChatTpl(
    "banter_goal_celebration",
    "RESENHA",
    "Enquete da Comemoração",
    [
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "DF", role: "DF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Se eu marcar gol hoje contra ${ctx.oppName}, qual comemoração mando na câmera: giro relâmpago ou corrida abraçando o banco? kkk`, "banter"),
      mkSpontaneousMsg(actors, 1, `Giro relâmpago!! Mas só se você me der créditos pela assistência depois na entrevista!`, "banter"),
      mkSpontaneousMsg(actors, 2, `Se ganharmos sem sofrer gol eu até faço o mortal lá atrás junto kkk!`, "banter")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Votar na corrida com o elenco inteiro — vitória é de todo o grupo!",
        approachTag: "União do Time",
        coachLine: `Corre abraçando o time todo! Gol aqui nasce da zaga até a finalização — clima leve demais!`,
        reactions: [
          { idx: 0, text: `FECHADO!! Time inteiro comemorando na bandeirinha!`, tone: "hype" },
          { idx: 2, text: `Melhor grupo que já joguei!!`, tone: "hype" }
        ]
      },
      good: {
        label: "Autorizar qualquer comemoração depois que o 2º gol sair",
        approachTag: "Pé no Chão",
        coachLine: `Faz o que quiser quando abrirmos 2 gols de vantagem!`,
        reactions: [
          { idx: 0, text: `Combinado professor — foco em fazer dois rápido kkk!`, tone: "banter" }
        ]
      },
      poor: {
        label: "Proibir comemoração em gol por achar perda de postura",
        approachTag: "Sem Graça",
        coachLine: `Ninguém comemora nada, fez gol volta sério pro meio.`,
        reactions: [
          { idx: 0, text: `Ué, tirou a alegria do futebol...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "banter_pingpong_tourney",
    "RESENHA",
    "Torneio de Tênis de Mesa",
    [
      { pred: (a) => a.role === "GK", role: "GK" },
      { pred: (a) => a.role === "DF", role: "DF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 0, `Invicto na mesa do clube há 5 jogos!! Reflexo de goleiro até na raquete é outro nível kkk!`, "banter"),
      mkSpontaneousMsg(actors, 2, `Só ganhou porque eu ainda não entrei na chave! Daqui a pouco eu te amasso igual na finalização!`, "banter"),
      mkSpontaneousMsg(actors, 1, `🎤 Áudio (0:06): "Tô organizando a tabela — técnico, entra no desafio também?"`, "banter")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Entrar numa partida relâmpago pra soltar os reflexos e descansar a mente!",
        approachTag: "Descontrair",
        coachLine: `Bora uma melhor de 3 rápida! Tira toda a tensão pré-jogo e ainda afia o tempo de reação!`,
        reactions: [
          { idx: 0, text: `TREINADOR AMASSANDO NO SMASH KKKKK!!`, tone: "banter" },
          { idx: 2, text: `Vestiário leve e sem estresse nenhum pro jogo!`, tone: "hype" }
        ]
      },
      good: {
        label: "Assistir 5 minutinhos e mandar irem descansar",
        approachTag: "Moderação",
        coachLine: `Só mais um set e depois descanso total pro jogo.`,
        reactions: [
          { idx: 1, text: `Fechado, chefe!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Confiscar a mesa e dar sermão na frente de todo mundo",
        approachTag: "Severidade",
        coachLine: `Proibido jogos recreativos no clube! Vão encarar a parede e pensar tática.`,
        reactions: [
          { idx: 0, text: `Poxa... a gente tava super leve...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "banter_superstition_socks",
    "RESENHA",
    "Meião da Sorte",
    [
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "MF", role: "MF" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Juro pra você: toda vez que eu coloco primeiro a chuteira direita antes de pegar ${ctx.oppName}, eu guardo gol!`, "banter"),
      mkSpontaneousMsg(actors, 1, `Kkkkk superstição boba... mas olha que semana passada funcionou mesmo!`, "banter")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Entrar na brincadeira e reforçar que a maior sorte é o entrosamento deles!",
        approachTag: "Bom Humor",
        coachLine: `Calça a direita, respira fundo e entra sorrindo — com a química de vocês a sorte sempre cai pro nosso lado!`,
        reactions: [
          { idx: 0, text: `Haha! Confiança no máximo agora!!`, tone: "hype" },
          { idx: 1, text: `Vestiário feliz joga muito melhor!`, tone: "banter" }
        ]
      },
      good: {
        label: "Rir e lembrar que o treino vale mais que amuleto",
        approachTag: "Realismo",
        coachLine: `Pode usar seu ritual, desde que mantenha o foco no passe.`,
        reactions: [
          { idx: 0, text: `Sempre!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Zombar falando que quem precisa de superstição é jogador fraco",
        approachTag: "Sarcasmo",
        coachLine: `Coisa de atleta inseguro acreditar nessas baboseiras.`,
        reactions: [
          { idx: 0, text: `Ei... era só brincadeira pra descontrair...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "banter_crossbar_challenge",
    "RESENHA",
    "Desafio do Travessão",
    [
      { pred: (a) => a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "GK", role: "GK" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 1, `Bate do meio-campo e acerta o travessão, ${actors[0].name} — duvido acertar de primeira!`, "banter"),
      mkSpontaneousMsg(actors, 0, `Olha a curva que a ${actors[0].shMove} vai fazer no ar... só assiste!!`, "hype"),
      mkSpontaneousMsg(actors, 2, `Se acertar a trave eu pago o isotônico do grupo inteiro kkk!`, "banter")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Autorizar 1 chute caprichado pra calibrar o pé e animar o grupo!",
        approachTag: "Mira Afiada",
        coachLine: `Um chute só valendo! Calibra essa curva aí e diverte a rapaziada!`,
        reactions: [
          { idx: 0, text: `*CLANG!!* NO ÂNGULO DO TRAVESSÃO!! VAI SEPARANDO O ISOTÔNICO!!`, tone: "hype" },
          { idx: 2, text: `NÃO ACREDITO QUE ACERTOU!! KKKK CLIMA PERFEITO!!`, tone: "banter" }
        ]
      },
      good: {
        label: "Sugerir tentar mirando no ângulo do gol normal",
        approachTag: "Mira no Gol",
        coachLine: `Prefiro no fundo da rede do que na trave — capricha lá!`,
        reactions: [
          { idx: 0, text: `No ângulo baixo então, fácil!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Dar bronca por chutarem na trave sem permissão",
        approachTag: "Brigar à Toa",
        coachLine: `Chega! Estão desperdiçando força atoa no campo.`,
        reactions: [
          { idx: 0, text: `Nossa... era só um chute de aquecimento...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "banter_crowd_hype",
    "RESENHA",
    "Estádio Lotado Hoje",
    [
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Espiei a arquibancada agora: tá lotado pro duelo contra ${ctx.oppName}! Dá um frio bom na barriga!`, "banter"),
      mkSpontaneousMsg(actors, 1, `Adoro estádio cheio!! Quanto maior o barulho, mais bonito fica quando eu mando ${actors[1].shMove}!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Usar a energia da torcida como combustível leve — divirtam-se jogando!",
        approachTag: "Show no Estádio",
        coachLine: `O estádio veio ver espetáculo! Entrem leves, confiantes e mostrem o melhor futebol de vocês!`,
        reactions: [
          { idx: 0, text: `A arquibancada vai tremer hoje!!`, tone: "hype" },
          { idx: 1, text: `Vou fazer eles gritarem meu nome!`, tone: "hype" }
        ]
      },
      good: {
        label: "Pedir calma nos primeiros 5 minutos apesar do barulho",
        approachTag: "Começo Frio",
        coachLine: `Ignorem o barulho no começo e acertem os primeiros passes.`,
        reactions: [
          { idx: 0, text: `Certo, pés no chão logo cedo!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Colocar medo falando que a torcida vai vaiar se errarem um passe",
        approachTag: "Pressão Negativa",
        coachLine: `Se errarem o primeiro passe essa multidão inteira cai matando em vocês.`,
        reactions: [
          { idx: 0, text: `Valeu por deixar todo mundo travado agora...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "banter_sprint_race",
    "RESENHA",
    "Quem é o Mais Rápido?",
    [
      { pred: (a) => a.archetype === "PACE_LEADER" || a.role === "FW", role: "FW" },
      { pred: (a) => a.role === "DF" || a.role === "MF", role: "DF" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 0, `Na corrida limpa de 30 metros não tem ninguém nesse elenco que me pegue! Nem tente apostar!`, "banter"),
      mkSpontaneousMsg(actors, 1, `Você corre muito sem bola, mas quando tenta passar por mim com ${actors[1].dfMove} eu fecho na antecipação kkk!`, "banter")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Brincar que velocidade + antecipação juntas formam o time perfeito!",
        approachTag: "Sinergia de Ritmo",
        coachLine: `Um voando nas pontas e o outro cortando na cobertura: é por isso que somos duros de bater!`,
        reactions: [
          { idx: 0, text: `Verdade! Ninguém vence nosso contra-ataque nem nossa cobertura!`, tone: "hype" },
          { idx: 1, text: `Clima leve e respeito puro!`, tone: "banter" }
        ]
      },
      good: {
        label: "Deixar o pique guardado só pros lances do jogo",
        approachTag: "Poupar Perna",
        coachLine: `Deixem pra medir velocidade dando sprint nos lances reais da partida.`,
        reactions: [
          { idx: 0, text: `Economizando pro 1º contra-ataque!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Mandar correrem 10 voltas no campo pra provar agora",
        approachTag: "Cansar Elenco",
        coachLine: `Deem 10 voltas correndo ao redor do estádio agora pra eu ver quem ganha.`,
        reactions: [
          { idx: 1, text: `Morremos antes do apito inicial...`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "banter_chef_onigiri",
    "RESENHA",
    "Onigiri Pós-Treino",
    [
      { pred: (a) => a.role === "GK" || a.role === "DF", role: "GK" },
      { pred: (a) => a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors) => [
      mkSpontaneousMsg(actors, 0, `As gerentes mandaram bandeja dupla de onigiri recheado agora! Quem chegou primeiro já garantiu os melhores kkk!`, "banter"),
      mkSpontaneousMsg(actors, 2, `SEGURA DOIS PRA MIM AÍ!! Depois desse treino eu comia quatro fácil!!`, "banter"),
      mkSpontaneousMsg(actors, 1, `Nada recupera a vibe do grupo melhor que comida boa depois de ralar no campo!`, "praise")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Liberar pausa rápida pro lanche pra todo mundo entrar leve e bem disposto!",
        approachTag: "Vibe Leve",
        coachLine: `Comam tranquilo e conversem — time bem alimentado e unido cansa metade em campo!`,
        reactions: [
          { idx: 2, text: `SALVOU DEMAIS TREINADOR!!`, tone: "hype" },
          { idx: 1, text: `Energia leve e elenco sorrindo!`, tone: "hype" }
        ]
      },
      good: {
        label: "Pedir pra comerem leve pra não pesar no estômago antes do jogo",
        approachTag: "Comer Leve",
        coachLine: `Um ou dois só agora, deixem a bandeja cheia pro pós-jogo!`,
        reactions: [
          { idx: 0, text: `Justo kkk guardei pro pós-vitória!`, tone: "banter" }
        ]
      },
      poor: {
        label: "Tirar a bandeja e dizer que ninguém mereceu lanche",
        approachTag: "Cortar Pausa",
        coachLine: `Sem lanche antes da partida, voltem já pro banco!`,
        reactions: [
          { idx: 2, text: `Poxa... até o onigiri foi bloqueado hoje.`, tone: "tense" }
        ]
      }
    })
  ),

  makeChatTpl(
    "banter_captain_tactic_joke",
    "RESENHA",
    "Prancheta do Treinador",
    [
      { pred: (a) => a.archetype === "STRATEGIST" || a.role === "MF", role: "MF" },
      { pred: (a) => a.role === "FW", role: "FW" }
    ],
    (actors, ctx) => [
      mkSpontaneousMsg(actors, 0, `Se o técnico desenhar mais uma seta na prancheta contra ${ctx.oppName}, vai parecer um mapa do tesouro kkk!`, "banter"),
      mkSpontaneousMsg(actors, 1, `O importante é a última seta apontar pro fundo da rede de ${ctx.oppName}!`, "hype")
    ],
    (actors) => buildShuffledChatChoices(actors, {
      great: {
        label: "Rir junto e dizer que o tesouro é o troféu na mão deles!",
        approachTag: "Humor & Foco",
        coachLine: `O X no mapa marca exatamente onde vocês levantam a taça! Joguem leves e soltos!`,
        reactions: [
          { idx: 0, text: `Haha! Agora entendi o mapa inteiro!`, tone: "hype" },
          { idx: 1, text: `Bora buscar esse tesouro então!!`, tone: "hype" }
        ]
      },
      good: {
        label: "Resumir em uma única instrução simples",
        approachTag: "Simplicidade",
        coachLine: `Só lembrem: toquem rápido e finalizem com convicção!`,
        reactions: [
          { idx: 1, text: `Direto ao ponto, gostei!`, tone: "calm" }
        ]
      },
      poor: {
        label: "Ficar ofendido com a brincadeira e passar 20 slides extras",
        approachTag: "Levar a Mal",
        coachLine: `Acham engraçado? Agora vão ver mais vinte diagramas táticos!`,
        reactions: [
          { idx: 0, text: `Vish... zoeira saiu caro hoje kkk.`, tone: "tense" }
        ]
      }
    })
  )
];

function pushNextMatchChatBuff(t, newBuff) {
  if (!t || !newBuff) return;
  if (!Array.isArray(t.nextMatchChatBuffs)) t.nextMatchChatBuffs = [];
  const existing = t.nextMatchChatBuffs.find((b) => b.type === newBuff.type);
  if (existing) {
    const merged = new Set([...(existing.playerIds || []), ...(newBuff.playerIds || [])]);
    existing.playerIds = [...merged];
  } else {
    t.nextMatchChatBuffs.push({
      type: newBuff.type,
      label: newBuff.label,
      desc: newBuff.desc || "",
      playerIds: Array.isArray(newBuff.playerIds) ? [...newBuff.playerIds] : []
    });
  }
}

function pickWeightedChatCategory(t, actors) {
  const teamChem = typeof calcSquadStats === "function" ? (calcSquadStats()?.chem || 45) : 45;
  const energy = typeof getTeamEnergy === "function" ? getTeamEnergy() : 85;
  const weights = {
    RAIVA: teamChem < 35 || energy < 60 ? 2.8 : 1.5,
    CRIAR_TECNICA: teamChem >= 50 ? 2.6 : 1.7,
    ELOGIO: teamChem >= 45 ? 2.1 : 1.2,
    TATICA_RIVAL: 1.8,
    RESENHA: 1.6
  };
  const cats = Object.keys(weights);
  const sum = cats.reduce((a, c) => a + weights[c], 0);
  let r = Math.random() * sum;
  for (const c of cats) {
    r -= weights[c];
    if (r <= 0) return c;
  }
  return "RESENHA";
}

function formatChatTimestamp(baseMin, idx = 0) {
  const tot = (Number(baseMin) || 920) + idx;
  const hh = String(Math.floor(tot / 60) % 24).padStart(2, "0");
  const mm = String(tot % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function stampThreadTimestamps(msgs, baseMin) {
  if (!Array.isArray(msgs)) return [];
  return msgs.map((m, i) => ({
    ...m,
    time: m.time || formatChatTimestamp(baseMin, i)
  }));
}

function spawnSpontaneousTeamChat(t = state.tournament, forcedCategory = null) {
  if (typeof isBetaMode === "function" && !isBetaMode()) return null;
  const prep = t?.prep;
  if (!prep) return null;
  if (!Array.isArray(prep.teamChats)) prep.teamChats = [];
  if (prep.teamChats.length >= 5) return null;

  const actors = getSquadChatActors(t);
  if (actors.length < 2) return null;

  const usedIds = new Set(prep.teamChats.map((c) => c.templateId));
  const category = forcedCategory || pickWeightedChatCategory(t, actors);
  let pool = SPONTANEOUS_CHAT_TEMPLATES.filter((tpl) => tpl.category === category && !usedIds.has(tpl.id));
  if (pool.length === 0) {
    pool = SPONTANEOUS_CHAT_TEMPLATES.filter((tpl) => !usedIds.has(tpl.id));
  }
  if (pool.length === 0) return null;

  const tpl = pool[Math.floor(Math.random() * pool.length)];
  const chosenActors = tpl.pickActors(actors, t);
  if (!chosenActors || chosenActors.length < 2) return null;

  const selectedIds = chosenActors.map((a) => a.slotId);
  const oppName = getNextOpponentDisplayName(t);
  const rivalStar = getTopOutfieldRivalHighlight(t);
  const ctx = {
    oppName,
    rivalStar,
    teamEnergy: Math.round(typeof getTeamEnergy === "function" ? getTeamEnergy() : 85),
    teamChem: Math.round(typeof calcSquadStats === "function" ? (calcSquadStats()?.chem || 45) : 45)
  };
  const climate = computeGroupChatClimate(selectedIds, t);
  const baseTimeMin = 840 + Math.floor(Math.random() * 180) + prep.teamChats.length * 14;
  const messages = stampThreadTimestamps(tpl.buildDialogue(chosenActors, ctx), baseTimeMin);
  const choices = tpl.buildChoices(chosenActors, ctx);

  const chatObj = {
    id: `chat_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    templateId: tpl.id,
    category: tpl.category,
    categoryLabel: tpl.categoryLabel,
    categoryIcon: tpl.categoryIcon,
    badgeClass: tpl.badgeClass,
    title: tpl.title,
    oppName,
    ctx,
    baseTimeMin,
    climate,
    participants: chosenActors,
    selectedIds,
    messages,
    choices,
    resolved: false,
    chosenIdx: null,
    outcomeQuality: null,
    outcomeSummary: "",
    learnedCoop: null,
    grantedBuff: null,
    appliedConfigChanges: []
  };

  prep.teamChats.push(chatObj);
  return chatObj;
}

function generateInitialRoundTeamChats(t = state.tournament) {
  if (typeof isBetaMode === "function" && !isBetaMode()) return [];
  const count = Math.random() < 0.42 ? 3 : 2;
  const created = [];
  for (let i = 0; i < count; i++) {
    const ch = spawnSpontaneousTeamChat(t);
    if (ch) created.push(ch);
  }
  return created;
}

function openPrepTeamChats(returnPhase = null) {
  if (typeof isBetaMode === "function" && !isBetaMode()) return;
  const prep = state.tournament?.prep;
  if (!prep) return;
  if (!Array.isArray(prep.teamChats)) prep.teamChats = [];
  if (prep.teamChats.length === 0) {
    spawnSpontaneousTeamChat(state.tournament);
  }
  if (!returnPhase) {
    prep.chatReturnPhase = prep.phase === "TEAM_CHAT" ? (prep.chatReturnPhase || "CHOOSE_LOC") : prep.phase;
  } else {
    prep.chatReturnPhase = returnPhase;
  }
  const firstUnread = prep.teamChats.find((c) => !c.resolved);
  prep.activeChatId = (firstUnread || prep.teamChats[prep.teamChats.length - 1] || {}).id || null;
  prep.phase = "TEAM_CHAT";
  if (typeof saveActiveRunProgress === "function") saveActiveRunProgress();
  renderTournamentScreen();
}

function selectPrepTeamChatThread(chatId) {
  const prep = state.tournament?.prep;
  if (!prep || !Array.isArray(prep.teamChats)) return;
  const found = prep.teamChats.find((c) => c.id === chatId);
  if (!found) return;
  prep.activeChatId = found.id;
  if (typeof saveActiveRunProgress === "function") saveActiveRunProgress();
  renderTournamentScreen();
}

function closePrepTeamChats() {
  const prep = state.tournament?.prep;
  if (!prep) return;
  prep.phase = prep.chatReturnPhase && prep.chatReturnPhase !== "TEAM_CHAT" ? prep.chatReturnPhase : "CHOOSE_LOC";
  if (typeof saveActiveRunProgress === "function") saveActiveRunProgress();
  renderTournamentScreen();
}

function resolveSpontaneousTeamChat(chatId, choiceIdx) {
  const t = state.tournament;
  const prep = t?.prep;
  if (!prep || !Array.isArray(prep.teamChats)) return;
  const chat = prep.teamChats.find((c) => c.id === (chatId || prep.activeChatId));
  if (!chat || chat.resolved) return;

  const choice = chat.choices?.[choiceIdx] || chat.choices?.[0];
  if (!choice) return;

  const baseT = chat.baseTimeMin || 920;
  const curLen = chat.messages.length;
  chat.messages.push({
    senderIdx: -1,
    speakerRole: "COACH",
    speakerName: "Você (Técnico)",
    speakerSprite: UI.coachIcon || UI.ffLogo || "",
    roleTag: "Técnico",
    tone: "coach",
    time: formatChatTimestamp(baseT, curLen),
    text: choice.coachLine
  });
  if (Array.isArray(choice.reactions)) {
    choice.reactions.forEach((m, rIdx) => {
      chat.messages.push({
        ...m,
        time: m.time || formatChatTimestamp(baseT, curLen + 1 + rIdx)
      });
    });
  }

  const configChanges = applyChatTacticalPatch(t, choice.tacticsPatch, chat.participants, chat.ctx || {});
  if (configChanges.length > 0) {
    chat.messages.push({
      senderIdx: -2,
      speakerRole: "SYSTEM",
      speakerName: "Configuração da Equipe",
      speakerSprite: "",
      roleTag: "Tática",
      tone: "system",
      time: formatChatTimestamp(baseT, chat.messages.length),
      text: `⚙️ Configuração para o próximo jogo: ${configChanges.join(" • ")}`
    });
  }

  const selectedIds = (chat.selectedIds || []).filter((id) => state.squad?.[id]);
  const slotsMap = {};
  (typeof getSlots === "function" ? getSlots() : []).forEach((s) => { slotsMap[s.id] = s; });
  const playerIds = selectedIds.map((sid) => state.squad[sid]?.id).filter(Boolean);

  const quality = choice.quality || "GOOD";
  let affPts = quality === "GREAT"
    ? (chat.category === "CRIAR_TECNICA" || chat.category === "ELOGIO" ? 34 : 28)
    : quality === "GOOD"
    ? 15
    : (chat.category === "RAIVA" ? -6 : 4);
  const xpAmt = quality === "GREAT" ? 45 : quality === "GOOD" ? 25 : 0;
  const chemDelta = quality === "GREAT" ? 4 : quality === "GOOD" ? 2 : (chat.category === "RAIVA" ? -2 : 0);
  const pwrDelta = quality === "GREAT" ? 8 : 0;

  let maxNewAffLv = 0;
  let pairPtsTotal = 0;
  let pairCnt = 0;
  for (let i = 0; i < selectedIds.length; i++) {
    for (let j = i + 1; j < selectedIds.length; j++) {
      const pA = state.squad[selectedIds[i]];
      const pB = state.squad[selectedIds[j]];
      const res = typeof addPairAffinityPoints === "function" ? addPairAffinityPoints(pA, pB, affPts, null, t) : null;
      if (res) {
        maxNewAffLv = Math.max(maxNewAffLv, res.newLevel || 0);
        pairPtsTotal += res.entry?.points || 0;
        pairCnt++;
      }
    }
  }
  const avgPairPts = pairCnt > 0 ? pairPtsTotal / pairCnt : 0;

  if (xpAmt > 0) {
    selectedIds.forEach((sid) => {
      const p = state.squad[sid];
      const role = slotsMap[sid]?.role || "MF";
      if (p && typeof gainPlayerXp === "function") {
        gainPlayerXp(p, xpAmt, role);
      }
    });
    t.prepBonuses.xp += xpAmt;
  }
  if (chemDelta !== 0) {
    t.prepBonuses.chem = Math.max(-10, (t.prepBonuses.chem || 0) + chemDelta);
  }
  if (pwrDelta > 0) {
    t.prepBonuses.power = (t.prepBonuses.power || 0) + pwrDelta;
  }

  let learnedCoop = { learned: false, move: null, cat: null, tier: null, recipientNames: [], newlyAddedNames: [] };
  let grantedBuff = null;
  let extraOutcomeTxt = "";

  if (chat.category === "CRIAR_TECNICA" && (quality === "GREAT" || quality === "GOOD")) {
    const teamChemNow = typeof calcSquadStats === "function" ? (calcSquadStats()?.chem || 40) : 40;
    const coopProb = quality === "GREAT" ? (avgPairPts >= 18 || teamChemNow >= 35 ? 1.0 : 0.65) : 0.25;
    if (Math.random() < coopProb && typeof teachCoopMoveToGroup === "function") {
      const groupEntries = selectedIds.map((sid) => ({
        player: state.squad[sid],
        role: slotsMap[sid]?.role || "MF"
      }));
      learnedCoop = teachCoopMoveToGroup(groupEntries, Math.max(1, maxNewAffLv));
      if (learnedCoop.learned) {
        for (let i = 0; i < selectedIds.length; i++) {
          for (let j = i + 1; j < selectedIds.length; j++) {
            addPairAffinityPoints(state.squad[selectedIds[i]], state.squad[selectedIds[j]], 6, "coopMoves", t);
          }
        }
        const tierTxt = learnedCoop.tier === "TRIO" ? "Trio" : "Dupla";
        chat.messages.push({
          senderIdx: -2,
          speakerRole: "SYSTEM",
          speakerName: `Nova Técnica em ${tierTxt}!`,
          speakerSprite: "",
          roleTag: learnedCoop.cat || "SH",
          tone: "system",
          text: `⚡ O grupo desenvolveu e aprendeu a técnica combinada 【${learnedCoop.move}】 (${learnedCoop.cat}) para usar em campo!`
        });
        extraOutcomeTxt += ` • Nova Técnica: <strong>${learnedCoop.move}</strong>`;
      }
    }
  }

  if (quality === "GREAT") {
    if (chat.category === "RAIVA") {
      grantedBuff = {
        type: "BLOOD_FOCUS",
        label: "🔥 Sangue nos Olhos (+Duelo)",
        desc: "Participantes recebem +Duelo na próxima partida",
        playerIds
      };
    } else if (chat.category === "CRIAR_TECNICA") {
      grantedBuff = {
        type: "COOP_SYNC",
        label: "⚡ Sincronia Combinada (+Co-op/Passe)",
        desc: "Participantes têm +força em técnicas co-op e menos interceptações",
        playerIds
      };
    } else if (chat.category === "ELOGIO") {
      const prevE = typeof getTeamEnergy === "function" ? Math.round(getTeamEnergy()) : 80;
      const nextE = typeof adjustTeamEnergy === "function" ? Math.round(adjustTeamEnergy(6)) : prevE;
      extraOutcomeTxt += ` • <span class="b-chem">+6% Energia</span> (${prevE}% ➔ ${nextE}%)`;
      grantedBuff = {
        type: "MORALE_BOOST",
        label: "🌟 Moral Inspirada (+Energia & Duelo)",
        desc: "+6% Energia imediata e bônus de duelo acima de 60% de fôlego",
        playerIds
      };
    } else if (chat.category === "TATICA_RIVAL") {
      grantedBuff = {
        type: "RIVAL_READ",
        label: "📋 Leitura do Rival (-12% Interceptações)",
        desc: "Reduz em 12% as interceptações rivais na próxima partida",
        playerIds
      };
    } else {
      grantedBuff = {
        type: "LIGHT_LOCKER",
        label: "😄 Vestiário Leve (-12% Cansaço)",
        desc: "Participantes gastam 12% menos stamina no próximo jogo",
        playerIds
      };
    }
    pushNextMatchChatBuff(t, grantedBuff);
    extraOutcomeTxt += ` • Buff ativo: <strong>${grantedBuff.label}</strong>`;
  } else if (quality === "POOR") {
    if (chat.category === "CRIAR_TECNICA" && typeof getTeamEnergy === "function" && typeof adjustTeamEnergy === "function") {
      if (getTeamEnergy() > 14) {
        adjustTeamEnergy(-4);
        extraOutcomeTxt += ` • <span style="color:#fca5a5;">-4% Energia</span> pelo desgaste forçado`;
      }
    } else if (chat.category === "RAIVA") {
      extraOutcomeTxt += ` • <span style="color:#fca5a5;">-6 Sintonia / -2% Química</span> pelo atrito`;
    }
  }

  const headerDesc = quality === "GREAT"
    ? `🌟 Administração Perfeita!`
    : quality === "GOOD"
    ? `👍 Boa Gestão`
    : `⚠️ Gestão Conturbada`;
  const baseStatParts = [];
  if (affPts > 0) baseStatParts.push(`<span class="b-tech">+${affPts} Sintonia</span>`);
  if (xpAmt > 0) baseStatParts.push(`<span class="b-lvl">+${xpAmt} XP</span>`);
  if (chemDelta > 0) baseStatParts.push(`<span class="b-chem">+${chemDelta}% Química</span>`);
  if (pwrDelta > 0) baseStatParts.push(`<span class="b-pwr">+${pwrDelta} Poder</span>`);

  chat.resolved = true;
  chat.chosenIdx = choiceIdx;
  chat.outcomeQuality = quality;
  chat.learnedCoop = learnedCoop;
  chat.grantedBuff = grantedBuff;
  chat.appliedConfigChanges = configChanges;
  const configOutcome = configChanges.length > 0 ? ` • <span class="b-tech">⚙️ ${configChanges.join(" • ")}</span>` : "";
  chat.outcomeSummary = `<strong>${headerDesc}</strong> ${baseStatParts.join(" · ")}${extraOutcomeTxt}${configOutcome}`;
  t.prepBonuses.log.push(`Chat (${chat.title}): ${quality}${learnedCoop.learned ? ` + ${learnedCoop.move}` : ""}${configChanges.length ? ` [${configChanges.join(", ")}]` : ""}`);

  if (typeof saveActiveRunProgress === "function") saveActiveRunProgress();
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
        const xpAmt = won ? (isScorer ? 115 : 95) : 40;
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
        const nextE = Math.round(adjustTeamEnergy(15));
        drinkMsg = ` + <span class="b-chem">Bebida Energética (+15% Energia: ${prevE}% ➔ ${nextE}%)</span>`;
      }
      
      // Se venceu e havia um craque adversário, abre a oportunidade de RECRUTAMENTO!
      if (won && c5.starRecruit) {
        prep.phase = "RECRUIT_OFFER";
        prep.recruitCandidate = c5.starRecruit;
        prep.appliedMsg = `Vitória épica por Gol de Ouro (1 x 0${scorerName ? ` · ${scorerName}` : ""})! Os 5 participantes ganharam +95 a +115 XP${drinkMsg} e o craque rival ${c5.starRecruit.player.name} (OVR ${c5.starRecruit.player.ovr}) quer se juntar ao seu Dream Team!`;
      } else {
        prep.phase = "DONE";
        prep.appliedMsg = won
          ? `Vitória por Gol de Ouro (1 x 0${scorerName ? ` · ${scorerName}` : ""})! Todos os 5 participantes ganharam +95 a +115 XP${drinkMsg} e o time ganhou +${pwr} Poder!`
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

function buildTeamEnergyBarHTML(isLive = false, activeMinute = 0, customPrefix = null) {
  const val = Math.round(getTeamEnergy());
  const band = getTeamEnergyBand(val);
  const prefix = customPrefix || (isLive ? "live" : "prep");
  const isLiveCtx = Boolean(isLive || customPrefix === "live-modal");
  const descText = isLiveCtx ? (band.liveDesc || band.desc) : band.desc;
  const showLateBadge = Boolean(
    state.tournament?.prepBonuses?.lateMatchNoStaminaLoss && activeMinute >= 75
  );
  return `
    <div class="team-energy-strip ${isLiveCtx ? "is-live" : ""}" id="${prefix}-team-energy-strip" style="border-color:${band.border}; background:${band.bg};">
      <div class="team-energy-row">
        <span class="team-energy-title">⚡ Energia do Time: <strong id="${prefix}-team-energy-pill" style="color:${band.color};">${val}% (${band.label})</strong><span class="team-energy-passive-badge" id="${prefix}-team-energy-passive" style="display:${showLateBadge ? "inline-flex" : "none"};">🛡️ -50% (75'+)</span></span>
        <span class="team-energy-desc" id="${prefix}-team-energy-desc">${descText}</span>
      </div>
      <div class="team-energy-bar-bg">
        <div class="team-energy-bar-fill" id="${prefix}-team-energy-fill" style="width:${val}%; background:${band.color};"></div>
      </div>
    </div>
  `;
}

function syncTeamEnergyBarDOM(prefix = "live", activeMinute = 0) {
  const eVal = Math.round(getTeamEnergy());
  const eBand = getTeamEnergyBand(eVal);
  const isLiveCtx = prefix === "live" || prefix === "live-modal";
  const stripEl = document.getElementById(`${prefix}-team-energy-strip`);
  const pillEl = document.getElementById(`${prefix}-team-energy-pill`);
  const descEl = document.getElementById(`${prefix}-team-energy-desc`);
  const fillEl = document.getElementById(`${prefix}-team-energy-fill`);
  const passiveEl = document.getElementById(`${prefix}-team-energy-passive`);
  if (stripEl) {
    stripEl.style.borderColor = eBand.border;
    stripEl.style.background = eBand.bg;
  }
  if (pillEl) {
    pillEl.textContent = `${eVal}% (${eBand.label})`;
    pillEl.style.color = eBand.color;
  }
  if (descEl) {
    descEl.textContent = isLiveCtx ? (eBand.liveDesc || eBand.desc) : eBand.desc;
  }
  if (fillEl) {
    fillEl.style.width = `${eVal}%`;
    fillEl.style.background = eBand.color;
  }
  if (passiveEl) {
    const showLate = Boolean(
      state.tournament?.prepBonuses?.lateMatchNoStaminaLoss && activeMinute >= 75
    );
    passiveEl.style.display = showLate ? "inline-flex" : "none";
  }
}

function getIntensityHintText(intensity) {
  if (intensity === "low") {
    return "Baixa (~20%/jogo): recupera mais fôlego, usa técnicas padrão, reduz força em duelos e não ativa Keshin.";
  }
  if (intensity === "high") {
    return "Alta (~56%/jogo): +força nos duelos, técnicas frequentes e Keshin mais agressiva, mas cansa rápido.";
  }
  return "Média (~34%/jogo): ritmo equilibrado entre técnica, ativação de Keshin e gasto de energia.";
}

function getTacticsSingleHints(tac) {
  const postureMap = {
    defensive: "Recuado: +6% defesa, bloco baixo (-3% ataque)",
    balanced: "Equilibrado: sem bônus ou penalidade",
    offensive: "Avançado: +5% ataque, linha alta (-4% defesa)"
  };
  const laneMap = {
    wings: "Pontas: foco nas alas (escala com VEL)",
    balanced: "Livre: escolhem o melhor espaço",
    center: "Meio: infiltração central (escala com TEC)"
  };
  const styleMap = {
    possession: "Posse: tabelas curtas, -14% interceptações e menos desgaste",
    free: "Instinto: cada jogador segue sua personalidade",
    vertical: "Vertical: enfiadas rápidas e chutes diretos"
  };
  return {
    intensity: getIntensityHintText(tac.intensity),
    posture: postureMap[tac.posture] || postureMap.balanced,
    lane: laneMap[tac.lane] || laneMap.balanced,
    style: styleMap[tac.style] || styleMap.free
  };
}

function buildPrepTacticsTriggerBarHTML(t) {
  const tac = getTactics();
  const hCatalog = typeof HISSATSU_TACTICS_CATALOG === "object" ? HISSATSU_TACTICS_CATALOG : {};
  const activeHissatsu = hCatalog[tac.hissatsuTactic] || hCatalog.route_of_sky;
  const capObj = typeof getActiveTeamCaptain === "function" ? getActiveTeamCaptain() : null;
  const intLabel = tac.intensity === "high" ? "Alta" : tac.intensity === "low" ? "Baixa" : "Média";
  const postureLabel = tac.posture === "offensive" ? "Avançado" : tac.posture === "defensive" ? "Recuado" : null;
  const styleLabel = tac.style === "vertical" ? "Vertical" : tac.style === "possession" ? "Posse" : null;
  const laneLabel = tac.lane === "wings" ? "Pontas" : tac.lane === "center" ? "Meio" : null;
  const aceSlot = tac.acePlayerId
    ? (typeof getSlots === "function" ? getSlots() : []).map((s) => state.squad?.[s.id]).find((p) => p?.id === tac.acePlayerId)
    : null;
  const markedOppName = tac.markedOppId
    ? (() => {
        const oppPlayers = t?.stages?.[t?.prep?.nextStageIdx]?.oppTeam?.players || [];
        return oppPlayers.find((p) => p?.id === tac.markedOppId)?.name || "Rival";
      })()
    : null;
  return `
    <div class="prep-tactics-launch-bar">
      <div class="prep-tactics-launch-info">
        <div class="prep-tactics-launch-title">Estratégia &amp; Time</div>
        <div class="prep-tactics-launch-pills">
          <span class="prep-tac-chip">Esforço: <strong>${intLabel}</strong></span>
          ${postureLabel ? `<span class="prep-tac-chip">Postura: <strong>${postureLabel}</strong></span>` : ""}
          ${styleLabel ? `<span class="prep-tac-chip">Estilo: <strong>${styleLabel}</strong></span>` : ""}
          ${laneLabel ? `<span class="prep-tac-chip">Corredor: <strong>${laneLabel}</strong></span>` : ""}
          <span class="prep-tac-chip">Tática: <strong>${activeHissatsu?.name || "Rota do Céu"}</strong></span>
          ${capObj ? `<span class="prep-tac-chip">${captainIconHTML("inline-ui-icon")} Cap: <strong>${capObj.player.name}</strong></span>` : ""}
          ${aceSlot ? `<span class="prep-tac-chip">10: <strong>${aceSlot.name}</strong></span>` : ""}
          ${markedOppName ? `<span class="prep-tac-chip">Marcado: <strong>${markedOppName}</strong></span>` : ""}
        </div>
      </div>
      <div class="prep-tactics-launch-btns">
        <button type="button" class="ie-cmd-btn ie-cmd-blue" id="btn-open-tactics-modal">
          <span class="btn-inline-flex">${typeof buildClipboardIconSVG === "function" ? buildClipboardIconSVG("tactics-clip-svg inline-ui-icon") : ""} Táticas &amp; Líderes</span>
        </button>
        <button type="button" class="ie-cmd-btn ie-cmd-gold" id="btn-open-squad-modal">
          <span class="btn-inline-flex">${typeof formationIconHTML === "function" ? formationIconHTML("inline-ui-icon") : ""} Escalação (${state.formation})</span>
        </button>
      </div>
    </div>
  `;
}

function buildTacticsControlBarHTML(showSquadBtn = false, isLiveMatch = false) {
  const tac = getTactics();
  const pillBtn = (attr, val, label, active) =>
    `<button type="button" class="tac-pill-btn ${active ? "is-active" : ""}" ${attr}="${val}">${label}</button>`;

  const hints = getTacticsSingleHints(tac);
  const hCatalog = typeof HISSATSU_TACTICS_CATALOG === "object" ? HISSATSU_TACTICS_CATALOG : {};
  const activeHissatsu = hCatalog[tac.hissatsuTactic] || hCatalog.route_of_sky;

  const slots = typeof getSlots === "function" ? getSlots() : [];
  const starters = slots
    .map((s) => ({ slot: s, player: state.squad?.[s.id] }))
    .filter((x) => Boolean(x.player));
  const capObj = typeof getActiveTeamCaptain === "function" ? getActiveTeamCaptain() : null;
  const capTacRole = capObj?.player?.id && capObj.player.id === tac.acePlayerId ? "CAMISA_10" : "NONE";
  const capAura = capObj && typeof getCaptainAuraInfo === "function" ? getCaptainAuraInfo(capObj.player, capObj.role, capTacRole) : null;
  const acePlayer = starters.find((x) => x.player.id === tac.acePlayerId)?.player || null;

  const TACTIC_CARD_META = {
    route_of_sky: { tag: "ATAQUE", tone: "is-sky", icon: UI.moveOF || UI.iconDestVR, brief: "Passes rasgam a marcação" },
    catenaccio: { tag: "DEFESA", tone: "is-def", icon: UI.moveDF || UI.itemSpikeBlock, brief: "Trava a zaga + contra-ataque" },
    lightning_press: { tag: "PRESSÃO", tone: "is-volt", icon: UI.itemShoesThunder || UI.moveOF, brief: "Marcação alta e roubos" },
    raimon_harmony: { tag: "SINERGIA", tone: "is-team", icon: UI.raimonEmblem || UI.ffLogo, brief: "Buff coletivo e fôlego" }
  };

  const extraPreMatchHTML = isLiveMatch
    ? ""
    : `
      <div class="tac-extra-grid">
        <div class="tac-extra-card">
          <div class="tac-extra-head">
            <span class="tac-label">Tática Especial (1x ao vivo no jogo)</span>
          </div>
          <div class="tac-hissatsu-grid">
            ${Object.values(hCatalog)
              .map((ht) => {
                const isActive = tac.hissatsuTactic === ht.id;
                const meta = TACTIC_CARD_META[ht.id] || { tag: "TÁTICA", tone: "is-sky", icon: UI.ffLogo, brief: "" };
                return `
                  <button type="button" class="tac-hissatsu-card ${meta.tone} ${isActive ? "is-active" : ""}" data-tac-hissatsu="${ht.id}">
                    <div class="tac-hissatsu-card-top">
                      ${meta.icon ? `<img class="tac-hissatsu-ico" src="${meta.icon}" alt="" />` : ""}
                      <span class="tac-hissatsu-tag">${meta.tag}</span>
                      ${isActive ? `<span class="tac-hissatsu-active-dot">ATIVA</span>` : ""}
                    </div>
                    <div class="tac-hissatsu-name">${ht.name}</div>
                    <div class="tac-hissatsu-brief">${meta.brief}</div>
                  </button>
                `;
              })
              .join("")}
          </div>
          <div class="tac-extra-desc" data-tac-hissatsu-desc>
            <strong>${activeHissatsu?.name || ""}:</strong> ${activeHissatsu?.desc || ""}
          </div>
        </div>

        <div class="tac-extra-card tac-leaders-card">
          <div class="tac-leader-row">
            <label class="tac-label">${captainIconHTML("inline-ui-icon")} Capitão do Time</label>
            <select class="tac-select" data-tac-captain>
              ${starters
                .map(
                  ({ slot, player }) =>
                    `<option value="${player.id}" ${capObj?.player?.id === player.id ? "selected" : ""}>[${slot.role}] ${player.name} (OVR ${getEffectiveOvr(player, slot.role)})</option>`
                )
                .join("")}
            </select>
            <div class="tac-aura-note" data-tac-captain-aura>
              ${capAura ? `<span class="tac-archetype-chip">${capAura.archetypeLabel || "Líder"}</span> <strong>Aura: ${capAura.name}</strong> — ${capAura.shortEffect}` : ""}
            </div>
          </div>

          <div class="tac-leader-row">
            <label class="tac-label">Referência Ofensiva (Camisa 10)</label>
            <select class="tac-select" data-tac-ace>
              <option value="" ${!acePlayer ? "selected" : ""}>Automático (distribuído)</option>
              ${starters
                .filter((x) => x.slot.role !== "GK")
                .map(
                  ({ slot, player }) =>
                    `<option value="${player.id}" ${acePlayer?.id === player.id ? "selected" : ""}>[${slot.role}] ${player.name} (OVR ${getEffectiveOvr(player, slot.role)})</option>`
                )
                .join("")}
            </select>
            <div class="tac-aura-note" data-tac-ace-note>
              ${acePlayer ? `O time procura mais <strong>${acePlayer.name}</strong> nos passes decisivos e finalizações.` : "Passes distribuídos conforme espaço livre e personalidade."}
            </div>
          </div>
        </div>
      </div>
    `;

  return `
    <div class="tactics-control-bar is-clean-modal-tac">
      <div class="tac-cards-grid">
        <div class="tac-setting-card">
          <div class="tac-setting-top">
            <span class="tac-label">Intensidade</span>
            <div class="tac-pills">
              ${pillBtn("data-tac-intensity", "low", "Baixa", tac.intensity === "low")}
              ${pillBtn("data-tac-intensity", "medium", "Média", tac.intensity === "medium")}
              ${pillBtn("data-tac-intensity", "high", "Alta", tac.intensity === "high")}
            </div>
          </div>
          <div class="tac-setting-hint" data-tac-hint-intensity>${hints.intensity}</div>
        </div>

        <div class="tac-setting-card">
          <div class="tac-setting-top">
            <span class="tac-label">Postura</span>
            <div class="tac-pills">
              ${pillBtn("data-tac-posture", "defensive", "Recuado", tac.posture === "defensive")}
              ${pillBtn("data-tac-posture", "balanced", "Equilibrado", tac.posture === "balanced")}
              ${pillBtn("data-tac-posture", "offensive", "Avançado", tac.posture === "offensive")}
            </div>
          </div>
          <div class="tac-setting-hint" data-tac-hint-posture>${hints.posture}</div>
        </div>

        <div class="tac-setting-card">
          <div class="tac-setting-top">
            <span class="tac-label">Ataque</span>
            <div class="tac-pills">
              ${pillBtn("data-tac-lane", "wings", "Pontas", tac.lane === "wings")}
              ${pillBtn("data-tac-lane", "balanced", "Livre", tac.lane === "balanced")}
              ${pillBtn("data-tac-lane", "center", "Meio", tac.lane === "center")}
            </div>
          </div>
          <div class="tac-setting-hint" data-tac-hint-lane>${hints.lane}</div>
        </div>

        <div class="tac-setting-card">
          <div class="tac-setting-top">
            <span class="tac-label">Estilo</span>
            <div class="tac-pills">
              ${pillBtn("data-tac-style", "possession", "Posse", tac.style === "possession")}
              ${pillBtn("data-tac-style", "free", "Instinto", tac.style === "free")}
              ${pillBtn("data-tac-style", "vertical", "Vertical", tac.style === "vertical")}
            </div>
          </div>
          <div class="tac-setting-hint" data-tac-hint-style>${hints.style}</div>
        </div>
      </div>

      ${extraPreMatchHTML}
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
  const syncHints = () => {
    const hints = getTacticsSingleHints(getTactics());
    rootEl.querySelectorAll("[data-tac-hint-intensity]").forEach((el) => { el.textContent = hints.intensity; });
    rootEl.querySelectorAll("[data-tac-hint-posture]").forEach((el) => { el.textContent = hints.posture; });
    rootEl.querySelectorAll("[data-tac-hint-lane]").forEach((el) => { el.textContent = hints.lane; });
    rootEl.querySelectorAll("[data-tac-hint-style]").forEach((el) => { el.textContent = hints.style; });
  };
  rootEl.querySelectorAll("[data-tac-formation]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fk = btn.getAttribute("data-tac-formation");
      if (switchTeamFormation(fk)) {
        syncActive("data-tac-formation", fk);
        saveActiveRunProgress();
        if (typeof onFormationChanged === "function") onFormationChanged(fk);
      }
    });
  });
  rootEl.querySelectorAll("[data-tac-intensity]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-tac-intensity");
      getTactics().intensity = val;
      syncActive("data-tac-intensity", val);
      syncHints();
      saveActiveRunProgress();
    });
  });
  rootEl.querySelectorAll("[data-tac-posture]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-tac-posture");
      getTactics().posture = val;
      syncActive("data-tac-posture", val);
      syncHints();
      saveActiveRunProgress();
    });
  });
  rootEl.querySelectorAll("[data-tac-lane]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-tac-lane");
      getTactics().lane = val;
      syncActive("data-tac-lane", val);
      syncHints();
      saveActiveRunProgress();
    });
  });
  rootEl.querySelectorAll("[data-tac-style]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-tac-style");
      getTactics().style = val;
      syncActive("data-tac-style", val);
      syncHints();
      saveActiveRunProgress();
    });
  });
  rootEl.querySelectorAll("[data-tac-hissatsu]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-tac-hissatsu");
      const hObj = HISSATSU_TACTICS_CATALOG?.[val];
      if (!hObj) return;
      getTactics().hissatsuTactic = val;
      syncActive("data-tac-hissatsu", val);
      rootEl.querySelectorAll(".tac-hissatsu-card").forEach((card) => {
        const isOn = card.getAttribute("data-tac-hissatsu") === val;
        const dot = card.querySelector(".tac-hissatsu-active-dot");
        if (isOn && !dot) {
          card.querySelector(".tac-hissatsu-card-top")?.insertAdjacentHTML("beforeend", `<span class="tac-hissatsu-active-dot">ATIVA</span>`);
        } else if (!isOn && dot) {
          dot.remove();
        }
      });
      rootEl.querySelectorAll("[data-tac-hissatsu-desc]").forEach((el) => {
        el.innerHTML = `<strong>${hObj.name}:</strong> ${hObj.desc}`;
      });
      saveActiveRunProgress();
    });
  });
  const refreshCapAuraInRoot = () => {
    const capObj = getActiveTeamCaptain();
    const tac = getTactics();
    const tacRole = capObj?.player?.id && capObj.player.id === tac.acePlayerId ? "CAMISA_10" : "NONE";
    const aura = capObj ? getCaptainAuraInfo(capObj.player, capObj.role, tacRole) : null;
    rootEl.querySelectorAll("[data-tac-captain-aura]").forEach((el) => {
      el.innerHTML = aura
        ? `<span class="tac-archetype-chip">${aura.archetypeLabel || "Líder"}</span> <strong>Aura: ${aura.name}</strong> — ${aura.shortEffect}`
        : "";
    });
  };
  rootEl.querySelectorAll("[data-tac-captain]").forEach((sel) => {
    sel.addEventListener("change", () => {
      getTactics().captainPlayerId = sel.value || null;
      refreshCapAuraInRoot();
      saveActiveRunProgress();
    });
  });
  rootEl.querySelectorAll("[data-tac-ace]").forEach((sel) => {
    sel.addEventListener("change", () => {
      getTactics().acePlayerId = sel.value || null;
      const chosen = Object.values(state.squad || {}).find((p) => p && p.id === sel.value);
      rootEl.querySelectorAll("[data-tac-ace-note]").forEach((el) => {
        el.innerHTML = chosen
          ? `O time procura mais <strong>${chosen.name}</strong> nos passes decisivos e finalizações.`
          : "Passes distribuídos conforme espaço livre e personalidade.";
      });
      refreshCapAuraInRoot();
      saveActiveRunProgress();
    });
  });
}

function escapeHtmlAttr(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildActiveScalableBuffsHTML(t) {
  const b = t?.prepBonuses || {};
  const chips = [];

  if (b.permanentDoublePrep) {
    const title = "Passe Livre do Treinador";
    const stat = "4 Ações (4ª com 50% OFF) • -3% Custo na Cidade";
    const desc = "Libera 1 ação extra na cidade antes de cada partida (com metade do custo de energia na 4ª ação) e barateia todas as visitas pelo resto do torneio.";
    chips.push(
      `<button type="button" class="scalable-buff-chip is-passive" aria-label="${escapeHtmlAttr(`${title} — ${stat}`)}" data-buff-tip-title="${escapeHtmlAttr(title)}" data-buff-tip-stat="${escapeHtmlAttr(stat)}" data-buff-tip-desc="${escapeHtmlAttr(desc)}">Passe Livre <strong>4 Ações</strong></button>`
    );
  }
  if (b.lateMatchNoStaminaLoss) {
    const title = "Pingente da Resistência Final";
    const stat = "-50% Desgaste a partir dos 75'";
    const desc = "Seus 11 titulares gastam metade da energia na reta final das partidas, mantendo fôlego para viradas.";
    chips.push(
      `<button type="button" class="scalable-buff-chip is-passive" aria-label="${escapeHtmlAttr(`${title} — ${stat}`)}" data-buff-tip-title="${escapeHtmlAttr(title)}" data-buff-tip-stat="${escapeHtmlAttr(stat)}" data-buff-tip-desc="${escapeHtmlAttr(desc)}">Resistência 75'+ <strong>-50%</strong></button>`
    );
  }

  const defs = [
    {
      key: "efficiencyLvl",
      label: "Eficiência",
      fullTitle: "Eficiência de Treino",
      stat: (l) => `-${[0, 4, 7, 10][l] || 10}% Custo na Cidade`,
      desc: () => "Deixa todas as visitas na cidade mais baratas em energia, permitindo treinar mais antes de cada jogo."
    },
    {
      key: "restLvl",
      label: "Descanso",
      fullTitle: "Descanso Aprimorado",
      stat: (l) => `Sono +${45 + l * 7}% • Tática +${35 + l * 10} XP • +${l * 4}% Intervalo`,
      desc: () => "Melhora a recuperação gratuita no Dormitório do Clube, aumenta o XP da Análise Tática e recupera mais fôlego no intervalo."
    },
    {
      key: "recoveryLvl",
      label: "Vigor Campanha",
      fullTitle: "Vigor de Campanha",
      stat: (l) => `+${20 + l * 5}% Energia entre Partidas (+${l * 5}% extra)`,
      desc: () => "Aumenta a recuperação automática de energia do elenco entre todas as rodadas do torneio."
    },
    {
      key: "enduranceLvl",
      label: "Resistência",
      fullTitle: "Resistência em Campo",
      stat: (l) => `-${[0, 8, 15, 22][l] || 22}% Gasto em Campo`,
      desc: () => "Economiza energia durante toda a partida — seus jogadores conseguem usar mais Super Técnicas antes de cansar."
    },
    {
      key: "wingExplosionLvl",
      label: "Explosão Alas",
      fullTitle: "Explosão nas Alas",
      stat: (l) => `+${l * 2} VEL & +${l * 2} FOR (ATQ e MEI)`,
      desc: () => "Deixa Atacantes e Meias mais rápidos nas arrancadas e com finalizações mais pesadas."
    },
    {
      key: "midSynergyLvl",
      label: "Sintonia Meio",
      fullTitle: "Sintonia de Meio-Campo",
      stat: (l) => `+${l * 2} TEC (Meias) • +${l * 4}% Química`,
      desc: () => "Melhora o controle de bola, passes e dribles dos Meias, além de elevar o entrosamento coletivo do time."
    },
    {
      key: "defBlockLvl",
      label: "Bloco Defensivo",
      fullTitle: "Bloco Defensivo",
      stat: (l) => `+${l * 2} DEF & +${l * 2} FIS (GK e Zaga)`,
      desc: () => "Deixa Goleiro e Zagueiros mais seguros nos desarmes e defesas, além de mais resistentes ao cansaço."
    },
    {
      key: "hissatsuMasteryLvl",
      label: "Maestria Técnica",
      fullTitle: "Maestria de Hissatsu",
      stat: (l) => `+${[0, 2, 4, 5][l] || 5}% Chance em Super Técnicas`,
      desc: () => "Aumenta o poder real das suas Super Técnicas, elevando a chance de vencer duelos de chute, drible e defesa."
    },
    {
      key: "xpSpiritLvl",
      label: "Espírito XP",
      fullTitle: "Espírito de Evolução",
      stat: (l) => `+${[0, 12, 24, 36][l] || 36}% XP Pós-Jogo`,
      desc: () => "Acelera a subida de nível do elenco inteiro ao multiplicar o XP ganho após cada partida oficial."
    },
    {
      key: "passBypassLvl",
      label: "Passe Cirúrgico",
      fullTitle: "Passe Cirúrgico",
      stat: (l) => `-${[0, 15, 28, 40][l] || 40}% Interceptações Rivais`,
      desc: () => "Faz seus passes atravessarem a marcação com mais segurança, reduzindo roubadas de bola do adversário."
    },
    {
      key: "counterShotLvl",
      label: "Contra-Chute",
      fullTitle: "Reflexo de Contra-Chute",
      stat: (l) => `+${[0, 12, 24, 35][l] || 35}% Frequência • +${[0, 3, 6, 9][l] || 9}% Chance`,
      desc: () => "Ativa contra-chutes com mais frequência e potência quando um defensor entra na trajetória do chute rival."
    },
    {
      key: "dribbleEdgeLvl",
      label: "Drible Imparável",
      fullTitle: "Drible Imparável",
      stat: (l) => `+${[0, 3, 5, 8][l] || 8}% Chance Drible (+2% Corredor)`,
      desc: () => "Facilita vencer duelos 1x1 no drible, com chance extra ao atacar pelo corredor tático escolhido."
    }
  ];

  defs.forEach((d) => {
    const lvl = b[d.key] || 0;
    if (lvl <= 0) return;
    const cls = lvl >= 3 ? "is-nv3" : lvl === 2 ? "is-nv2" : "is-nv1";
    const fullTitle = `${d.fullTitle} (Nv. ${lvl}/3)`;
    const statTxt = d.stat(lvl);
    const descTxt = d.desc(lvl);
    chips.push(
      `<button type="button" class="scalable-buff-chip ${cls}" aria-label="${escapeHtmlAttr(`${fullTitle} — ${statTxt}`)}" data-buff-tip-title="${escapeHtmlAttr(fullTitle)}" data-buff-tip-stat="${escapeHtmlAttr(statTxt)}" data-buff-tip-desc="${escapeHtmlAttr(descTxt)}">${d.label} <strong>Nv.${lvl}</strong></button>`
    );
  });

  if (chips.length === 0) return "";
  return `
    <div class="active-scalable-buffs-wrap">
      <div class="active-scalable-buffs-label">Buffs Ativos <span>(clique para ver o efeito)</span></div>
      <div class="active-scalable-buffs-row">
        ${chips.join("")}
      </div>
    </div>
  `;
}

function buildOpponentScoutCardHTML(nextStage, stageIdx) {
  const oppTeam = nextStage?.oppTeam;
  if (!oppTeam) return "";
  const oppStats = calcOpponentStats(oppTeam, stageIdx);
  const highlights = oppStats.highlights || [];
  const tac = getTactics();
  let markedId = tac.markedOppId || null;
  const markedHighlight = highlights.find((h) => h.role !== "GK" && h.player?.id === markedId) || null;
  if (markedId && !markedHighlight && highlights.some((h) => h.role === "GK" && h.player?.id === markedId)) {
    tac.markedOppId = null;
    markedId = null;
  }
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
      <div class="opp-scout-subhead-row">
        <span class="opp-scout-subhead">4 Destaques do Rival</span>
        <span class="opp-scout-mark-hint">
          ${markedHighlight
            ? `Marcação Especial ativa em <strong>${markedHighlight.player.name}</strong> (-4% ofensivo + cobertura próxima)`
            : "Clique em 1 jogador de linha rival para ativar Marcação Especial (-4% ofensivo + cobertura próxima)"}
        </span>
      </div>
      <div class="opp-scout-highlights-grid">
        ${highlights
          .map((h) => {
            const p = h.player;
            const canMark = h.role !== "GK";
            const isMarked = Boolean(canMark && markedId && p.id === markedId);
            const innerHTML = `
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
                  <div class="opp-scout-mark-tag ${isMarked ? "is-active" : ""} ${!canMark ? "is-gk-locked" : ""}">
                    ${!canMark ? "Goleiro (não marcável)" : isMarked ? "MARCAÇÃO ESPECIAL ATIVA" : "Marcar este jogador"}
                  </div>
                </div>
            `;
            if (!canMark) {
              return `<div class="opp-scout-player is-gk-scout">${innerHTML}</div>`;
            }
            return `
              <button type="button" class="opp-scout-player is-clickable-scout ${isMarked ? "is-marked-target" : ""}" data-scout-mark-id="${p.id}" data-scout-mark-role="${h.role}" title="${isMarked ? "Remover Marcação Especial" : `Ativar Marcação Especial em ${p.name}`}">
                ${innerHTML}
              </button>
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
      : `Escolha até ${totActions} ações na cidade ou vá direto para a partida:`;

    const snackActive = (t.nextMatchEnergyMul || 1) < 1;
    const isNight = isPrepNightTime(t);
    const activeChatBuffsHTML =
      typeof isBetaMode === "function" && isBetaMode() && Array.isArray(t.nextMatchChatBuffs) && t.nextMatchChatBuffs.length > 0
        ? `<div class="prep-banner-notice is-chat-buffs">${t.nextMatchChatBuffs.map((b) => `<span class="prep-chat-buff-pill" title="${b.desc || ""}">${b.label}</span>`).join("")}</div>`
        : "";
    topBannerHTML = `
      <div class="prep-top-banner">
        <div class="prep-banner-main">
          <h3 style="font-size:1.0rem; font-weight:900; color:#fff; margin:0 0 6px 0;">
            ${prepHeadline}
          </h3>
          ${buildTeamEnergyBarHTML(false)}
          ${prep.autoRestMsg ? `<div class="prep-banner-notice is-rest">${prep.autoRestMsg}</div>` : ""}
          ${snackActive ? `<div class="prep-banner-notice is-snack">${prepAssetIconHTML(UI.onigiriIcon || UI.tpPendant, "")} Lanche Ativo (-20% gasto de energia no próximo jogo)</div>` : ""}
          ${activeChatBuffsHTML}
          ${prep.energyNotice ? `<div class="prep-banner-notice is-warn">${prepAssetIconHTML(UI.whistleIcon || UI.refereeWhistle, "")} ${prep.energyNotice}</div>` : ""}
        </div>
        <div class="prep-banner-actions">
          <span class="prep-xp-pill">Ações: ${remActions}/${totActions}</span>
          ${typeof isFourthActionHalfCostActive === "function" && isFourthActionHalfCostActive(t) ? `<span class="prep-xp-pill prep-half-cost-pill">4ª Ação: 50% OFF!</span>` : ""}
          <span class="prep-xp-pill">Dormitório: ${prep.restUsedThisRound ? "Usado" : isNight ? `${PREP_SVG_MOON} Liberado` : "Disponível"}</span>
          ${typeof getActiveBracketForTournament === "function" && getActiveBracketForTournament(t, prep.nextStageIdx) ? `<button type="button" class="ie-cmd-btn ie-cmd-blue" id="btn-open-bracket-modal"><span>Ver Chaveamento</span></button>` : ""}
          <button class="ie-cmd-btn ie-cmd-green" id="btn-prep-proceed">
            <span>Ir para ${nextStage.stageName} →</span>
          </button>
        </div>
      </div>
    `;

    const mapImgSrc = UI.inazumaMap || UI.locTown || UI.stadiumBg;
    const mapHeaderTxt = !isNight
      ? `${PREP_SVG_SUN}<span>Dia • ${remActions} ${remActions === 1 ? "ação restante" : "ações restantes"}</span>`
      : !prep.restUsedThisRound
      ? `${PREP_SVG_MOON}<span>Anoiteceu • Visite o Dormitório do Clube</span>`
      : `${PREP_SVG_MOON}<span>Noite encerrada • Pronto para jogar</span>`;
    const isBetaChatOn = typeof isBetaMode === "function" && isBetaMode();
    const mapStageHTML = mapImgSrc
      ? `
        <div class="prep-inazuma-map-stage ${isNight ? "is-night-mode" : ""} ${isBetaChatOn ? "has-beta-chat-fab" : ""}">
          <img class="prep-inazuma-map-img" src="${mapImgSrc}" alt="Mapa da Cidade de Inazuma" />
          <div class="prep-inazuma-map-shade"></div>
          <div class="prep-map-header-tag">
            ${mapHeaderTxt}
          </div>
          ${isNight ? `<div class="prep-map-moon-badge" title="Noite em Inazuma">${PREP_SVG_MOON}<span>Noite</span></div>` : ""}
          <div class="prep-map-footer-tag">
            ${UI.iconDestVR ? `<img src="${UI.iconDestVR}" alt="" />` : PREP_SVG_SUN}
            <span>${isNight ? "Noite em Inazuma" : "Inazuma"}</span>
          </div>
          ${locations
            .map(
              (loc) => {
                const reqCost = getPrepLocationCost(loc, t);
                const isNoActions = remActions <= 0;
                const isRestUsed = Boolean(loc.isRestLocation && prep.restUsedThisRound);
                const isRestReady = Boolean(loc.isRestLocation && !isRestUsed);
                const isRestEarlyDay = Boolean(loc.isRestLocation && !isNight && !isRestUsed);
                const isRestReadyNight = Boolean(loc.isRestLocation && isNight && !isRestUsed);
                const isDisabled = loc.isRestLocation
                  ? isRestUsed
                  : (isNoActions || curTeamEnergy < reqCost);
                const pinTitle = loc.isRestLocation
                  ? isRestUsed
                    ? `${loc.title} — Descanso já utilizado nesta rodada`
                    : isRestEarlyDay
                    ? `${loc.title} — Grátis: encerra as ações restantes do dia para conservar energia`
                    : `${loc.title} — Descanso noturno gratuito para preparar o elenco`
                  : isNoActions
                  ? `${loc.title} — Ações desta rodada encerradas`
                  : isDisabled
                  ? `${loc.title} — Energia insuficiente (precisa de ${reqCost}%)`
                  : `${loc.title} — ${loc.sub}`;
                const energyBadge = loc.isRestLocation
                  ? `<span class="pin-energy-tag is-gain">${isRestUsed ? "Usado" : isRestEarlyDay ? "Encerra Dia" : "Grátis"}</span>`
                  : `<span class="pin-energy-tag is-cost">-${reqCost}%</span>`;
                return `
            <div class="prep-map-pin ${loc.isRestLocation ? "is-rest-pin" : ""} ${isRestReadyNight ? "is-night-highlight" : isRestReady ? "is-rest-open" : ""} ${isDisabled ? "is-disabled" : ""}" data-prep-loc="${loc.id}" style="left:${loc.mapX || 50}%; top:${loc.mapY || 50}%;" title="${pinTitle}">
              <div class="prep-map-pin-orb">
                ${loc.badgeIcon ? `<img class="pin-main-icon" src="${loc.badgeIcon}" alt="" />` : ""}
                ${loc.subIcon ? `<span class="prep-map-pin-sub"><img src="${loc.subIcon}" alt="" /></span>` : ""}
                ${energyBadge}
              </div>
              <span class="prep-map-pin-label">${loc.mapLabel || loc.title}</span>
            </div>
          `;
              }
            )
            .join("")}
          ${(() => {
            if (!isBetaChatOn) return "";
            const allChats = Array.isArray(prep.teamChats) ? prep.teamChats : [];
            const unreadCount = allChats.filter((c) => !c.resolved).length;
            return `
              <button type="button" class="prep-map-chat-fab ${unreadCount > 0 ? "has-unread" : ""}" id="btn-open-map-chats" aria-label="Conversas (${unreadCount} pendentes)" title="Abrir conversas espontâneas do elenco (0 energia, 0 ações)">
                <svg class="prep-map-chat-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 9H7V9h10v2zm-4 4H7v-2h6v2zm4-8H7V5h10v2z"/>
                </svg>
                ${unreadCount > 0 ? `<span class="prep-map-chat-badge is-alert">${unreadCount}</span>` : ""}
              </button>
            `;
          })()}
        </div>
      `
      : "";

    bodyHTML = `
      ${mapStageHTML}
      ${buildActiveScalableBuffsHTML(t)}
      ${buildPrepTacticsTriggerBarHTML(t)}
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
      } else if (chosenWinner.kind === "ITEM_PICK" || chosenWinner.kind === "ELEM_BOOST_PICK") {
        badgeTxt = "EQUIPAMENTO";
      } else if (chosenWinner.kind === "ENERGY_DRINK") {
        badgeTxt = "CONSUMÍVEL";
      } else if (chosenWinner.kind === "REST_ACTIVE") {
        badgeTxt = "DORMITÓRIO GRÁTIS";
      } else if (chosenWinner.kind === "STREET_5V5") {
        badgeTxt = "DESAFIO 5x5";
      } else if (chosenWinner.kind === "KESHIN_PICK") {
        rarityCls = "rarity-nv3";
        badgeTxt = "KESHIN";
      } else if (chosenWinner.kind === "EVO_PICK") {
        rarityCls = "rarity-nv2";
        badgeTxt = "TÉCNICA";
      } else if (chosenWinner.kind === "SYNERGY_PICK") {
        rarityCls = "rarity-nv2";
        badgeTxt = "SINTONIA";
      } else if (chosenWinner.kind === "COLLECTIVE") {
        badgeTxt = "TREINO";
      }
      const scopeTxt = getPrepScopeLabel(chosenWinner);
      const comboHTML = getPrepChoiceComboHTML(chosenWinner);
      return `
        <div class="prep-slot-col is-clickable-choice ${rarityCls}" data-prep-choice-idx="${sIdx}">
          <div class="prep-slot-col-header">
            <span class="prep-slot-badge">${badgeTxt}</span>
            ${scopeTxt ? `<span class="prep-slot-scope">${scopeTxt}</span>` : ""}
          </div>
          <div class="prep-choice-card-body is-revealed-choice">
            <div class="prep-choice-name">${chosenWinner.title}</div>
            <div class="prep-choice-icon-wrap">
              ${chosenWinner.icon ? `<img src="${chosenWinner.icon}" alt="" />` : ""}
            </div>
            <div class="prep-choice-buff-pill">${getPrepBuffPill(chosenWinner)}</div>
            <div class="prep-choice-summary">${getPrepChoiceSummary(chosenWinner)}</div>
            ${comboHTML}
            <button type="button" class="ie-cmd-btn ie-cmd-gold prep-btn-pick">
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
        ${activeLoc?.isRestLocation ? `
          <div class="prep-rest-energy-preview">
            ${buildTeamEnergyBarHTML(false)}
            ${!isPrepNightTime(t) ? `
              <div class="prep-early-rest-warn">
                ${PREP_SVG_MOON} <span><strong>Encerrar o dia e descansar agora?</strong> Você ainda tem ${remActions} ${remActions === 1 ? "ação disponível" : "ações disponíveis"} na cidade — escolher uma rotina no Dormitório encerra o dia para preparar a equipe diretamente para a partida.</span>
              </div>
            ` : ""}
            <div style="display:flex; justify-content:flex-end; margin-top:6px;">
              <button type="button" class="ie-cmd-btn" id="btn-prep-cancel-rest" style="padding:5px 12px; font-size:0.72rem; background:#334155;">
                <span>← Voltar ao Mapa</span>
              </button>
            </div>
          </div>
        ` : ""}
        <div class="prep-triple-cols-grid ${(prep.choices || []).length >= 4 ? "is-four-cols" : ""}">
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
            Após a vitória no 5x5, este craque do ${rec.teamName} reconheceu a força da sua equipe e quer uma vaga como titular.
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
            const recLvl = Math.max(curLvl, STAGE_OPPONENT_LEVELS[Math.min(nextIdx, STAGE_OPPONENT_LEVELS.length - 1)] || 1);
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

        const pickComboHTML = getPrepChoiceComboHTML(ev);
        outcomeHTML = `
          <div class="prep-reward-box">
            <div class="prep-reward-hero">
              <div class="prep-reward-icon-frame">
                ${ev.icon ? `<img src="${ev.icon}" alt="" />` : ""}
              </div>
              <div style="flex:1; min-width:200px;">
                <div style="font-size:0.7rem; font-weight:900; color:#facc15; text-transform:uppercase;">${activeLoc?.resultEyebrow || activeLoc?.title || ""}</div>
                <div style="font-size:1.05rem; font-weight:900; color:#fff;">${ev.title}</div>
                <div class="prep-choice-buff-pill is-hero-pill">${getPrepBuffPill(ev)}</div>
                <div style="font-size:0.76rem; color:#cbd5e1; margin-top:4px;">${getPrepChoiceSummary(ev)}</div>
                ${pickComboHTML}
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
                  const lvlGain = ev.levelGain || ev.ovrBoost || 1;
                  const nextLvl = curLvl + lvlGain;
                  const curPwr = calcIndividualPlayerPower(p, slot.role, curLvl);
                  const pwrPerLvl = calcPowerPerLevel(curOvr);
                  const extraItemPwr =
                    (ev.indivPower || 20) +
                    (ev.id === "secret_hissatsu_mastery" ? 18 : ev.kind === "EVO_PICK" ? 13 : 0);
                  const nextPwr = curPwr + (ev.kind === "ELEM_BOOST_PICK" ? 0 : lvlGain * pwrPerLvl) + extraItemPwr;
                  const previewGainLine =
                    ev.kind === "ELEM_BOOST_PICK"
                      ? `+125 XP • Poder ${curPwr} ➔ ${nextPwr}+ (todos de ${p.element})`
                      : `Nv. ${curLvl} ➔ Nv. ${nextLvl} • Poder ${curPwr} ➔ ${nextPwr}`;
                  const extraInfo =
                    ev.kind === "ELEM_BOOST_PICK"
                      ? `Elemento: ${p.element} (+125 XP e +${ev.indivPower || 12} Poder em todos de ${p.element})`
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
                        <div style="display:flex; align-items:center; gap:4px; flex-wrap:wrap; font-size:0.76rem; font-weight:900; color:#fff;">
                          ${posIconHTML(slot.role, true)}
                          <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1 1 auto;">${p.name}</span>
                          <span style="color:#fde047; flex-shrink:0;">(OVR ${curOvr})</span>
                        </div>
                        <div style="font-size:0.68rem; font-weight:800; color:#4ade80; margin-top:2px;">
                          ${previewGainLine}
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
    } else if (prep.phase === "TEAM_CHAT") {
      const threads = Array.isArray(prep.teamChats) ? prep.teamChats : [];
      const activeChat = threads.find((c) => c.id === prep.activeChatId) || threads[0] || null;
      const unreadThreads = threads.filter((c) => !c.resolved);
      const nextUnread = unreadThreads.find((c) => c.id !== activeChat?.id) || null;

      const sidebarThreadsHTML = threads
        .map((ch) => {
          const isAct = activeChat && ch.id === activeChat.id;
          const firstPt = (ch.participants || [])[0];
          const lastMsg = Array.isArray(ch.messages) && ch.messages.length > 0 ? ch.messages[ch.messages.length - 1] : null;
          const rawSnip = String(lastMsg?.text || "").replace(/<[^>]+>/g, "");
          const snippet = rawSnip.length > 44 ? `${rawSnip.slice(0, 44)}...` : rawSnip;
          const lastTime = lastMsg?.time || "15:20";
          return `
            <button type="button" class="wpp-thread-row ${isAct ? "is-active" : ""} ${ch.resolved ? "is-resolved" : "is-unread"}" data-chat-thread-id="${ch.id}">
              <div class="wpp-thread-avatar-wrap">
                ${firstPt?.sprite ? `<img class="wpp-thread-avatar" src="${firstPt.sprite}" alt="${firstPt.name}" />` : `<span class="wpp-thread-avatar-fallback">${ch.categoryIcon || "💬"}</span>`}
                <span class="wpp-thread-cat-mini">${ch.categoryIcon || "💬"}</span>
              </div>
              <div class="wpp-thread-info">
                <div class="wpp-thread-top">
                  <span class="wpp-thread-title">${ch.title || ch.categoryLabel}</span>
                  <span class="wpp-thread-time">${lastTime}</span>
                </div>
                <div class="wpp-thread-bottom">
                  <span class="wpp-thread-snippet">${snippet}</span>
                  ${ch.resolved ? `<span class="wpp-checks is-read">✓✓</span>` : `<span class="wpp-unread-count">1</span>`}
                </div>
              </div>
            </button>
          `;
        })
        .join("");

      if (!activeChat) {
        outcomeHTML = `
          <div class="wpp-shell">
            <div class="wpp-main" style="width:100%;">
              <div class="wpp-topbar">
                <div class="wpp-topbar-title">InaZap • Vestiário</div>
                <button type="button" class="wpp-back-btn" id="btn-close-map-chats">← Voltar ao Mapa</button>
              </div>
              <div class="wpp-feed" id="wpp-chat-feed">
                <div class="wpp-sys-row"><span class="wpp-sys-pill">Nenhuma conversa ativa nesta rodada no momento.</span></div>
              </div>
            </div>
          </div>
        `;
      } else {
        const namesSubtitle = (activeChat.participants || []).map((pt) => `${pt.name} (${pt.roleLabel})`).join(", ");
        const headerAvatarsHTML = (activeChat.participants || [])
          .slice(0, 2)
          .map((pt) => `<img src="${pt.sprite}" alt="${pt.name}" />`)
          .join("");
        const senderPaletteClass = ["is-c0", "is-c1", "is-c2"];

        const feedHTML = (activeChat.messages || [])
          .map((m) => {
            if (m.speakerRole === "SYSTEM") {
              return `<div class="wpp-sys-row"><span class="wpp-sys-pill">${m.text}</span></div>`;
            }
            if (m.speakerRole === "COACH") {
              return `
                <div class="wpp-row is-out">
                  <div class="wpp-bubble is-out">
                    <div class="wpp-bubble-text">${m.text}</div>
                    <div class="wpp-bubble-meta">
                      <span>${m.time || "15:25"}</span>
                      <span class="wpp-checks is-read">✓✓</span>
                    </div>
                  </div>
                </div>
              `;
            }
            const cIdx = Math.max(0, Number(m.senderIdx) || 0) % 3;
            const quoteHTML = m.quote?.text
              ? `
                <div class="wpp-quoted">
                  <div class="wpp-quoted-name">${m.quote.speakerName || ""}</div>
                  <div class="wpp-quoted-txt">${m.quote.text}</div>
                </div>
              `
              : "";
            const toneBadge = m.tone === "toxic" ? " is-toxic" : m.tone === "hype" ? " is-hype" : m.tone === "idea" ? " is-idea" : "";
            return `
              <div class="wpp-row is-in ${toneBadge}">
                ${m.speakerSprite ? `<img class="wpp-msg-avatar" src="${m.speakerSprite}" alt="${m.speakerName}" />` : ""}
                <div class="wpp-bubble is-in ${senderPaletteClass[cIdx]}">
                  <div class="wpp-msg-head">
                    <span class="wpp-msg-author">${m.speakerName}</span>
                    ${m.roleTag ? `<span class="wpp-msg-role">${m.roleTag}</span>` : ""}
                  </div>
                  ${quoteHTML}
                  <div class="wpp-bubble-text">${m.text}</div>
                  <div class="wpp-bubble-meta">
                    <span>${m.time || "15:21"}</span>
                  </div>
                </div>
              </div>
            `;
          })
          .join("");

        const coopBannerHTML = activeChat.learnedCoop?.learned
          ? `
            <div class="synergy-coop-learned-banner">
              <div style="font-size:0.7rem; font-weight:900; color:#fde047; text-transform:uppercase; letter-spacing:0.4px;">
                ⚡ Nova Técnica em ${activeChat.learnedCoop.tier === "TRIO" ? "Trio" : "Dupla"} Desbloqueada!
              </div>
              <div style="font-size:0.96rem; font-weight:900; color:#fff; margin-top:2px;">
                ${activeChat.learnedCoop.move} <span style="font-size:0.74rem; color:#93c5fd;">(${activeChat.learnedCoop.cat})</span>
              </div>
              <div style="font-size:0.68rem; color:#cbd5e1; margin-top:2px;">
                Aprendida por: <strong>${(activeChat.learnedCoop.recipientNames || []).join(" &amp; ")}</strong>
              </div>
            </div>
          `
          : "";

        const qualCls =
          activeChat.outcomeQuality === "GREAT"
            ? "is-great"
            : activeChat.outcomeQuality === "POOR"
            ? "is-poor"
            : "is-good";

        const sendIconSVG = `
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        `;
        const emojiIconSVG = `
          <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-9c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm7 0c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
          </svg>
        `;

        const composerHTML = activeChat.resolved
          ? `
            <div class="wpp-composer-zone">
              <div class="wpp-resolved-bar">
                <div class="synergy-outcome-card ${qualCls}">${activeChat.outcomeSummary || ""}</div>
                <div class="wpp-resolved-actions">
                  ${nextUnread
                    ? `<button type="button" class="ie-cmd-btn ie-cmd-gold" id="btn-next-unread-chat" data-next-chat-id="${nextUnread.id}"><span>Próxima Conversa (${unreadThreads.length}) →</span></button>`
                    : ""}
                  <button type="button" class="ie-cmd-btn ie-cmd-green" id="btn-close-map-chats-footer">
                    <span>← Voltar ao Mapa</span>
                  </button>
                </div>
              </div>
              <div class="wpp-fake-bar is-sent">
                <span class="wpp-fake-emoji">${emojiIconSVG}</span>
                <div class="wpp-fake-input" id="wpp-fake-input-preview">Orientação enviada ao grupo ✓✓</div>
                <span class="wpp-fake-send-circle">${sendIconSVG}</span>
              </div>
            </div>
          `
          : `
            <div class="wpp-composer-zone">
              <div class="wpp-reply-drawer">
                ${(activeChat.choices || [])
                  .map(
                    (ch, idx) => `
                      <button type="button" class="wpp-reply-option" data-chat-choice="${idx}" data-preview-line="${escapeHtmlAttr(ch.coachLine || ch.label)}">
                        <div class="wpp-reply-main">
                          <span class="wpp-reply-text">${ch.label}</span>
                          <span class="wpp-reply-tags">
                            ${ch.configTag ? `<span class="wpp-config-tag">${ch.configTag}</span>` : ""}
                            <span class="wpp-approach-tag">${ch.approachTag || "Orientar"}</span>
                          </span>
                        </div>
                        <span class="wpp-reply-arrow">${sendIconSVG}</span>
                      </button>
                    `
                  )
                  .join("")}
              </div>
              <div class="wpp-fake-bar">
                <span class="wpp-fake-emoji">${emojiIconSVG}</span>
                <div class="wpp-fake-input" id="wpp-fake-input-preview" data-placeholder="Toque em uma resposta acima para enviar...">Toque em uma resposta acima para enviar...</div>
                <span class="wpp-fake-send-circle">${sendIconSVG}</span>
              </div>
            </div>
          `;

        outcomeHTML = `
          <div class="wpp-shell">
            <aside class="wpp-sidebar">
              <div class="wpp-sidebar-head">
                <div class="wpp-sidebar-brand">
                  <span class="wpp-brand-dot"></span>
                  <span>InaZap</span>
                  ${unreadThreads.length > 0 ? `<span class="wpp-brand-unread">${unreadThreads.length}</span>` : ""}
                </div>
                <button type="button" class="wpp-back-btn" id="btn-close-map-chats">← Mapa</button>
              </div>
              <div class="wpp-thread-list">${sidebarThreadsHTML}</div>
            </aside>
            <section class="wpp-main">
              <div class="wpp-topbar">
                <div class="wpp-topbar-left">
                  <button type="button" class="wpp-back-btn is-mobile-back" id="btn-close-map-chats-top">←</button>
                  <div class="wpp-topbar-avatars">${headerAvatarsHTML}</div>
                  <div class="wpp-topbar-meta">
                    <div class="wpp-topbar-title">${activeChat.title || "Papo de Vestiário"}</div>
                    <div class="wpp-topbar-sub">${namesSubtitle} • vs ${activeChat.oppName || ""}</div>
                  </div>
                </div>
                <span class="synergy-climate-badge ${activeChat.badgeClass || "is-neutral"}">${activeChat.categoryIcon || "💬"} ${activeChat.categoryLabel || "Resenha"}</span>
              </div>
              <div class="wpp-feed" id="wpp-chat-feed">
                <div class="wpp-sys-row"><span class="wpp-sys-pill is-date">HOJE • PRÉ-JOGO VS ${String(activeChat.oppName || "RIVAL").toUpperCase()}</span></div>
                ${feedHTML}
                ${coopBannerHTML}
              </div>
              ${composerHTML}
            </section>
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
                      .map((m) => `<div class="new-move-pill">Nova Técnica: ${m?.move || m}</div>`)
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
            <div class="prep-reward-actions">
              ${(() => {
                const unreadDoneChats = typeof isBetaMode === "function" && isBetaMode() && Array.isArray(prep.teamChats)
                  ? prep.teamChats.filter((c) => !c.resolved).length
                  : 0;
                const doneChatBtn = unreadDoneChats > 0
                  ? `<button type="button" class="ie-cmd-btn ie-cmd-blue" id="btn-open-map-chats-done"><span>💬 Conversas (${unreadDoneChats})</span></button>`
                  : "";
                const minCityCost = Math.min(...locations.filter((l) => !l.isRestLocation).map((l) => getPrepLocationCost(l, t)));
                const cantAffordMoreCity = curTeamEnergy < minCityCost;
                const entersNightNow = !prep.lastActionWasFreeRest && !prep.restUsedThisRound && (prep.eventsRemaining === 1 || cantAffordMoreCity);
                const hasMoreDayActions = prep.lastActionWasFreeRest ? (prep.eventsRemaining > 0 && !cantAffordMoreCity) : (prep.eventsRemaining > 1 && !cantAffordMoreCity);
                if (hasMoreDayActions) {
                  return `
                ${doneChatBtn}
                <button class="ie-cmd-btn ie-cmd-gold" id="btn-prep-second-event">
                  <span>Voltar para o Mapa →</span>
                </button>`;
                }
                if (entersNightNow) {
                  return `
                ${doneChatBtn}
                <button class="ie-cmd-btn ie-cmd-gold" id="btn-prep-second-event">
                  <span>${PREP_SVG_MOON} Anoitecer • Ir para o Dormitório →</span>
                </button>`;
                }
                return `
                ${doneChatBtn}
                <button class="ie-cmd-btn ie-cmd-green" id="btn-prep-proceed">
                  <span>Ir para ${nextStage.stageName} →</span>
                </button>
                <button class="ie-cmd-btn ie-cmd-gold" id="btn-prep-second-event" style="font-size:0.76rem; padding:7px 14px;">
                  <span>Ajustar Escalação / Mapa</span>
                </button>`;
              })()}
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
