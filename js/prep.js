// ============================================================================
// PREPARAÇÃO ENTRE PARTIDAS: LOCAIS DE INAZUMA + ROLETA + BOOSTS REAIS
// ============================================================================
const PREP_SVG_SUN = `<svg class="prep-inline-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4" fill="#fde047" stroke="#facc15"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="#fde047"/></svg>`;
const PREP_SVG_MOON = `<svg class="prep-inline-svg" viewBox="0 0 24 24" fill="#fef08a" stroke="#fde047" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const PREP_SVG_LOCK = `<svg class="prep-inline-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" fill="rgba(250,204,21,0.18)"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;

function prepAssetIconHTML(src, alt = "") {
  return src ? `<img class="prep-inline-asset" src="${src}" alt="${alt}" />` : "";
}

function getPrepBuffPill(ev) {
  if (!ev) return "";
  if (ev.shortDesc) return ev.shortDesc;
  if (ev.kind === "PASSIVE_DOUBLE_EVENT") return `<span class="b-tech">4 Ações</span> • <span class="b-chem">-3% Custo</span>`;
  if (ev.kind === "PASSIVE_LATE_RESIST") return `<span class="b-chem">-50% Desgaste (75'+)</span>`;
  if (ev.kind === "STREET_5V5") return `<span class="b-lvl">+95–115 XP</span> • <span class="b-chem">+15% Energia</span>`;
  if (ev.id === "elem_crest_boost") return `<span class="b-lvl">+125 XP</span> • <span class="b-pwr">+12 Poder</span> (Elemento)`;
  if (ev.id === "elem_resonance_tome") return `<span class="b-lvl">+105 XP (Todos)</span> • <span class="b-chem">+6% Quím</span>`;
  if (ev.id === "captain_armband") return `<span class="b-lvl">+1 Nível</span> • <span class="b-chem">+8% Quím</span>`;
  if (ev.id === "secret_hissatsu_mastery") return `<span class="b-lvl">+1 Nível</span> • <span class="b-tech">Técnica Suprema</span>`;
  if (ev.kind === "KESHIN_PICK") return `<span class="b-lvl">+1 Nível</span> • <span class="b-tech">Desperta Keshin</span>`;
  if (ev.kind === "EVO_PICK") return `<span class="b-lvl">+${ev.levelGain || 1} Nível</span> • <span class="b-tech">Evolui Técnica</span>`;
  if (ev.id === "river_xp") return `<span class="b-lvl">+XP Coletivo</span> • <span class="b-pwr">+16 Poder</span>`;
  if (ev.id === "river_tactics") return `<span class="b-lvl">+XP Meias</span> • <span class="b-chem">+8% Quím</span>`;
  if (ev.id === "river_shot") return `<span class="b-lvl">+XP Atacantes</span> • <span class="b-pwr">+18 Poder</span>`;
  if (ev.kind === "SCALABLE_BUFF") {
    const curLvl = state.tournament?.prepBonuses?.[ev.buffKey] || 0;
    const nextLvl = Math.min(ev.maxLevel || 3, curLvl + 1);
    if (ev.buffKey === "efficiencyLvl") {
      const disc = [0, 4, 7, 10][nextLvl] || 10;
      return `<span class="b-chem">-${disc}% Custo na Cidade</span>`;
    }
    if (ev.buffKey === "restLvl") return `<span class="b-chem">Sono +${45 + nextLvl * 7}%</span> • <span class="b-lvl">+${35 + nextLvl * 10} XP Tática</span> • <span class="b-lvl">+${nextLvl * 4}% Intervalo</span>`;
    if (ev.buffKey === "enduranceLvl") {
      const pct = [0, 8, 15, 22][nextLvl] || 22;
      return `<span class="b-chem">-${pct}% Gasto em Campo</span>`;
    }
    if (ev.buffKey === "wingExplosionLvl") return `<span class="b-pwr">+${nextLvl * 2} VEL/FOR</span>`;
    if (ev.buffKey === "midSynergyLvl") return `<span class="b-chem">+${nextLvl * 2} TEC · +4% Quím</span>`;
    if (ev.buffKey === "defBlockLvl") return `<span class="b-pwr">+${nextLvl * 2} DEF/FIS</span>`;
    if (ev.buffKey === "hissatsuMasteryLvl") {
      const val = [0, 0.6, 1.2, 1.8][nextLvl] || 1.8;
      return `<span class="b-pwr">+${val} Duelo Técnica</span>`;
    }
    if (ev.buffKey === "xpSpiritLvl") {
      const pct = [0, 12, 24, 36][nextLvl] || 36;
      return `<span class="b-lvl">+${pct}% XP Pós-Jogo</span>`;
    }
    if (ev.buffKey === "passBypassLvl") {
      const pct = [0, 15, 28, 40][nextLvl] || 40;
      return `<span class="b-chem">-${pct}% Interceptação</span>`;
    }
    if (ev.buffKey === "counterShotLvl") {
      const pct = [0, 12, 24, 35][nextLvl] || 35;
      return `<span class="b-pwr">+${pct}% Contra-Chute</span>`;
    }
    if (ev.buffKey === "dribbleEdgeLvl") {
      const val = [0, 0.9, 1.8, 2.7][nextLvl] || 2.7;
      return `<span class="b-pwr">+${val} Força Drible</span>`;
    }
  }
  if (ev.kind === "REST_ACTIVE") {
    if (ev.restMode === "TACTICAL") {
      return `<span class="b-chem">+${ev.energyGain || 25}% Energia</span> • <span class="b-lvl">+${ev.xpGain || 35} XP</span>`;
    }
    if (ev.restMode === "SNACK") {
      return `<span class="b-chem">+${ev.energyGain || 30}% Energia</span> • <span class="b-tech">-20% Gasto</span>`;
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
      const prevD = [0, 4, 7, 10][curLvl] || 0;
      const nextD = [0, 4, 7, 10][nextLvl] || 10;
      return curLvl === 0
        ? `Reduz em <span class="b-chem">4%</span> o custo de energia dos locais da cidade.`
        : `Aumenta o desconto nos locais de <span class="b-chem">-${prevD}%</span> para <span class="b-chem">-${nextD}%</span>.`;
    }
    if (ev.buffKey === "restLvl") {
      return curLvl === 0
        ? `Sede dá <span class="b-chem">+7% Energia</span> (Sono +52%), Análise Tática sobe para <span class="b-lvl">+45 XP</span> e intervalos dão <span class="b-lvl">+4% fôlego</span>.`
        : `Sede sobe para <span class="b-chem">+${45 + nextLvl * 7}%</span> no Sono, <span class="b-lvl">+${35 + nextLvl * 10} XP</span> na Tática e <span class="b-lvl">+${nextLvl * 4}% fôlego</span> nos intervalos.`;
    }
    if (ev.buffKey === "enduranceLvl") {
      const prevP = [0, 8, 15, 22][curLvl] || 0;
      const nextP = [0, 8, 15, 22][nextLvl] || 22;
      return curLvl === 0
        ? `Reduz em <span class="b-chem">8%</span> o gasto das técnicas e o desgaste em campo.`
        : `Aumenta a economia em campo de <span class="b-chem">-${prevP}%</span> para <span class="b-chem">-${nextP}%</span>.`;
    }
    if (ev.buffKey === "wingExplosionLvl") {
      return curLvl === 0
        ? `Atacantes e Meias ganham <span class="b-chem">+2 VEL e +2 FOR</span>.`
        : `Atacantes e Meias sobem de <span class="b-chem">+${curLvl * 2}</span> para <span class="b-chem">+${nextLvl * 2} VEL/FOR</span>.`;
    }
    if (ev.buffKey === "midSynergyLvl") {
      return curLvl === 0
        ? `Meias ganham <span class="b-tech">+2 TEC</span> e o time ganha <span class="b-chem">+4% Química</span>.`
        : `Meias sobem de <span class="b-tech">+${curLvl * 2}</span> para <span class="b-tech">+${nextLvl * 2} TEC</span> (<span class="b-chem">+4% Quím</span>).`;
    }
    if (ev.buffKey === "defBlockLvl") {
      return curLvl === 0
        ? `Goleiro e Zaga ganham <span class="b-pwr">+2 DEF e +2 FIS</span>.`
        : `Goleiro e Zaga sobem de <span class="b-pwr">+${curLvl * 2}</span> para <span class="b-pwr">+${nextLvl * 2} DEF/FIS</span>.`;
    }
    if (ev.buffKey === "hissatsuMasteryLvl") {
      const prevV = [0, 0.6, 1.2, 1.8][curLvl] || 0;
      const nextV = [0, 0.6, 1.2, 1.8][nextLvl] || 1.8;
      return curLvl === 0
        ? `Dá <span class="b-pwr">+0.6</span> de força extra nos duelos com técnica.`
        : `Bônus em duelos de técnica sobe de <span class="b-pwr">+${prevV}</span> para <span class="b-pwr">+${nextV}</span>.`;
    }
    if (ev.buffKey === "xpSpiritLvl") {
      const curP = [0, 12, 24, 36][curLvl] || 0;
      const nextP = [0, 12, 24, 36][nextLvl] || 36;
      return curLvl === 0
        ? `Elenco ganha <span class="b-lvl">+12% XP</span> extra após cada partida.`
        : `Bônus de XP pós-jogo sobe de <span class="b-lvl">+${curP}%</span> para <span class="b-lvl">+${nextP}%</span>.`;
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
      const prevV = [0, 0.9, 1.8, 2.7][curLvl] || 0;
      const nextV = [0, 0.9, 1.8, 2.7][nextLvl] || 2.7;
      return curLvl === 0
        ? `Dá <span class="b-pwr">+0.9</span> nos dribles (bônus extra no corredor tático).`
        : `Força nos dribles sobe de <span class="b-pwr">+${prevV}</span> para <span class="b-pwr">+${nextV}</span>.`;
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
          summary: `Passiva: <span class="b-tech">+1 ação extra (4 ações)</span> na cidade e <span class="b-chem">-3% custo de energia</span> em todos os locais.`
        },
        {
          id: "pendant_endurance",
          title: "Pingente da Resistência Final",
          icon: UI.itemPendantLightning || UI.tpPendant,
          kind: "PASSIVE_LATE_RESIST",
          weight: 2.0,
          summary: `Passiva: Reduz em <span class="b-chem">50% o gasto de energia</span> dos 11 titulares a partir dos 75' de jogo.`
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
          summary: `<span class="b-lvl">+1 Nível</span> e <span class="b-pwr">+26 Poder</span> para 1 Atacante ou Meia. Comba com Luvas Lendárias (<span class="b-pwr">+65 Poder</span>).`
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
          summary: `<span class="b-lvl">+1 Nível</span> e <span class="b-pwr">+28 Poder</span> no Goleiro. Comba com Chuteiras Lendárias (<span class="b-pwr">+65</span>) e Travas (<span class="b-pwr">+55</span>).`
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
          summary: `<span class="b-lvl">+1 Nível</span>, <span class="b-pwr">+22 Poder</span> e <span class="b-chem">+5 VEL</span> para 1 jogador de linha. Comba com Braçadeira/Insígnia.`
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
          summary: `<span class="b-lvl">+1 Nível</span> e <span class="b-pwr">+24 Poder</span> para 1 Zagueiro. Comba com Luvas Lendárias (<span class="b-pwr">+55 Poder</span>).`
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
          summary: `<span class="b-lvl">+1 Nível</span> no líder, <span class="b-chem">+8% Química</span> e <span class="b-pwr">+40 Poder total</span>. Comba com Chuteiras do Trovão.`
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
          summary: `Todos os titulares do <span class="b-tech">mesmo elemento</span> ganham <span class="b-lvl">+125 XP</span> e <span class="b-pwr">+12 Poder</span> cada.`
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
          summary: `<span class="b-lvl">+1 Nível</span> e <span class="b-pwr">+20 Poder</span> em 1 titular e <span class="b-chem">+8% Química</span>. Conta para Arsenal.`
        },
        {
          id: "energy_drink",
          title: "Bebida Energética Raijin",
          icon: UI.sportsDrink || UI.onigiriIcon || UI.itemPendantLightning,
          kind: "ENERGY_DRINK",
          energyGain: 35,
          teamPower: 14,
          weight: 2.3,
          summary: `Recupera <span class="b-chem">+35% de Energia do Time</span> na hora e garante <span class="b-pwr">+14 Poder</span>.`
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
          summary: `Reduz o custo de energia dos locais da cidade em <span class="b-chem">-4% / -7% / -10%</span>.`
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
          summary: `Sede dá <span class="b-chem">+7% Energia</span>, Análise Tática dá <span class="b-lvl">+10 XP</span> extras (<span class="b-lvl">+45/+55/+65 XP</span>) e intervalos dão <span class="b-lvl">+4%/+8%/+12%</span> fôlego.`
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
          summary: `Aumenta o XP ganho pelo elenco após cada partida em <span class="b-lvl">+12% / +24% / +36%</span>.`
        }
      ]
    },
    {
      id: "riverbank",
      title: "Margem do Rio",
      sub: "Campinho da Raimon",
      mapLabel: "Campinho 5x5",
      mapX: 31,
      mapY: 71,
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
          summary: `Gol de Ouro: vencer dá <span class="b-lvl">+95 a +115 XP</span> nos 5 participantes e libera <span class="b-tech">recrutamento do craque</span>.`
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
          weight: 2.1,
          summary: `Todos os 11 titulares ganham <span class="b-lvl">+105 XP</span>, <span class="b-chem">+4% Química</span> e <span class="b-pwr">+26 Poder</span>.`
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
          summary: `Todos os Meias ganham <span class="b-lvl">+135 XP</span> e <span class="b-pwr">+12 Poder</span> • <span class="b-chem">+8% Química</span> • <span class="b-pwr">+18 Poder</span>.`
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
          weight: 1.8,
          summary: `Todos os Atacantes ganham <span class="b-lvl">+135 XP</span> e <span class="b-pwr">+14 Poder</span> • <span class="b-pwr">+18 Poder Coletivo</span>.`
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
          summary: `<span class="b-chem">+2 VEL e +2 FOR</span> acumulados por nível nos Atacantes e Meias.`
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
          summary: `<span class="b-tech">+2 TEC</span> nos Meias e <span class="b-chem">+4% Química</span> acumulados por nível.`
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
          teamPower: 12,
          weight: 1.8,
          summary: `Força extra nos dribles (<span class="b-pwr">+0.9 / +1.8 / +2.7</span>) e bônus no corredor tático.`
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
          levelGain: 1,
          indivPower: 22,
          teamPower: 15,
          xpGain: 95,
          weight: 2.5,
          summary: `1 titular aprende uma <span class="b-tech">técnica suprema</span>, sobe <span class="b-lvl">+1 Nível</span> e ganha <span class="b-pwr">+22 Poder</span>.`
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
          summary: `1 titular desperta um <span class="b-tech">Espírito Guerreiro</span> (<span class="b-pwr">+1.5 nos duelos</span>), sobe <span class="b-lvl">+1 Nível</span> e ganha <span class="b-pwr">+18 Poder</span>.`
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
          summary: `Evolua a técnica principal de 1 titular e suba <span class="b-lvl">+1 Nível</span> e <span class="b-pwr">+16 Poder</span>.`
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
          summary: `Reduz em <span class="b-chem">-8% / -15% / -22%</span> o gasto das técnicas e o desgaste do time em campo.`
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
          xpGain: 85,
          elemResonance: true,
          weight: 1.8,
          summary: `Todos ganham <span class="b-lvl">+105 XP</span>, <span class="b-chem">+6% Química</span> e fortalece o <span class="b-pwr">Poder dos Links Elementais</span>.`
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
          summary: `<span class="b-pwr">+2 DEF e +2 FIS</span> acumulados por nível no Goleiro e Zagueiros.`
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
          summary: `Força extra nos duelos ao usar técnicas (<span class="b-pwr">+0.6 / +1.2 / +1.8</span>).`
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
          summary: `Aumenta em <span class="b-tech">+12% / +24% / +35%</span> a chance de Contra-Chute e sua força.`
        }
      ]
    },
    {
      id: "rest",
      title: "Sede do Clube",
      sub: "1x Grátis • Não gasta ação",
      mapLabel: "Sede (Grátis)",
      mapX: 19,
      mapY: 46,
      energyGain: fullRestGain,
      isRestLocation: true,
      cta: "Visitar Sede (Grátis)",
      resultEyebrow: "Sede do Clube • Escolha 1 Rotina (Grátis — não gasta ação)",
      banner: UI.locTown || UI.stadiumBg,
      badgeIcon: UI.raimonEmblem || UI.iconDestVR || UI.ffLogo,
      subIcon: UI.onigiriIcon || UI.sportsDrink || UI.tpPendant,
      desc: "1 visita gratuita antes de cada partida (não consome ação): escolha entre Sono Completo, Análise Tática (+XP) ou Lanche das Gerentes (-20% gasto no próximo jogo).",
      events: [
        {
          id: "rest_full_sleep",
          title: "Sono Completo na Sede",
          icon: UI.sportsDrink || UI.raimonEmblem || UI.ffLogo,
          kind: "REST_ACTIVE",
          restMode: "FULL",
          energyGain: fullRestGain,
          summary: `Recupera <span class="b-chem">+${fullRestGain}% de Energia</span> (máx. 100%). Ideal para voltar ao verde com folga.`
        },
        {
          id: "rest_tactical_video",
          title: "Análise Tática do Treinador",
          icon: UI.manualInazuma || UI.ffLogo,
          kind: "REST_ACTIVE",
          restMode: "TACTICAL",
          energyGain: tacticalRestGain,
          xpGain: tacticalRestXp,
          summary: `Recupera <span class="b-chem">+${tacticalRestGain}% de Energia</span> e concede <span class="b-lvl">+${tacticalRestXp} XP</span> para os 11 titulares.`
        },
        {
          id: "rest_manager_snack",
          title: "Lanche Especial das Gerentes",
          icon: UI.onigiriIcon || UI.itemPendantLightning || UI.tpPendant,
          kind: "REST_ACTIVE",
          restMode: "SNACK",
          energyGain: snackRestGain,
          summary: `Recupera <span class="b-chem">+${snackRestGain}% de Energia</span> e reduz em <span class="b-tech">20% o gasto de energia</span> na próxima partida.`
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
    ballVx: 0,
    ballVy: 0,
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
  let autoRestMsg = null;
  if (opts && opts.worldFullRest) {
    t.teamEnergy = 100;
    autoRestMsg = `${prepAssetIconHTML(UI.ffLogo, "Mundial")} Viagem para a Ilha Liocott: Energia do elenco restaurada para 100%!`;
  } else if (nextStageIdx > 0) {
    const prevE = Math.round(getTeamEnergy());
    const nextE = Math.round(adjustTeamEnergy(20));
    if (nextE > prevE) {
      autoRestMsg = `${prepAssetIconHTML(UI.sportsDrink || UI.raimonEmblem, "Energia")} Descanso entre rodadas: +${nextE - prevE}% de Energia (${prevE}% ➔ ${nextE}%).`;
    }
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
    restUsedThisRound: false,
    lastActionWasFreeRest: false,
    autoRestMsg,
    usedEventIdsThisRound: [],
    appliedMsg: null,
    clash5v5: null,
    recruitCandidate: null,
    riskTargetSlotId: null
  };
  renderAll();
}

function isPrepNightTime(t = state.tournament) {
  const prep = t?.prep;
  if (!prep) return false;
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
    if (!isPrepNightTime(t)) {
      t.prep.energyNotice = "A Sede do Clube abre à noite! Use suas ações na cidade primeiro.";
      renderTournamentScreen();
      return;
    }
    if (t.prep.restUsedThisRound) {
      t.prep.energyNotice = "Você já usou o descanso gratuito na Sede do Clube antes desta partida.";
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

  if ((t.prep.eventsRemaining || 0) <= 0) {
    t.prep.energyNotice = "Suas ações desta preparação acabaram! Ajuste Táticas/Escalação ou inicie a partida.";
    renderTournamentScreen();
    return;
  }

  const reqCost = getPrepLocationCost(loc, t);
  if (reqCost > 0 && getTeamEnergy() < reqCost) {
    t.prep.energyNotice = `Energia insuficiente para ${loc.title} (precisa de ${reqCost}% — descanse na Sede do Clube!).`;
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

  renderTournamentScreen();
}

function handleChoosePrepOption(choiceEvent) {
  const t = state.tournament;
  const prep = t.prep;
  if (!prep || !choiceEvent) return;
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
    }

    const nextE = Math.round(adjustTeamEnergy(gain));
    prep.restUsedThisRound = true;
    prep.lastActionWasFreeRest = true;
    prep.phase = "DONE";
    prep.affectedPlayers = affected;
    prep.appliedMsg = `${choiceEvent.title}: <span class="b-chem">+${gain}% Energia</span> (${prevE}% ➔ ${nextE}%)${extraTxt}. <span style="color:#93c5fd;">(Ação gratuita!)</span>`;
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
    prep.appliedMsg = `Passiva ativada: seu time agora tem <span class="b-tech">4 ações por rodada</span> e <span class="b-chem">-3% custo de energia</span> nos locais da cidade.`;
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
      effectTxt = `Sono da Sede agora recupera <span class="b-chem">+${45 + nextL * 7}% Energia</span>, Análise Tática dá <span class="b-lvl">+${35 + nextL * 10} XP</span> e intervalos recuperam <span class="b-lvl">+${nextL * 4}% fôlego</span>`;
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
      const val = [0, 0.6, 1.2, 1.8][nextL] || 1.8;
      effectTxt = `<span class="b-pwr">+${val} de força extra</span> nos duelos ao usar técnicas`;
    } else if (key === "xpSpiritLvl") {
      const pct = [0, 12, 24, 36][nextL] || 36;
      effectTxt = `<span class="b-lvl">+${pct}% XP</span> ganho após cada partida oficial`;
    } else if (key === "passBypassLvl") {
      const pct = [0, 15, 28, 40][nextL] || 40;
      effectTxt = `<span class="b-chem">-${pct}% chance</span> de interceptação nos passes do time`;
    } else if (key === "counterShotLvl") {
      const pct = [0, 12, 24, 35][nextL] || 35;
      const pwrB = [0, 1.0, 2.0, 3.2][nextL] || 3.2;
      effectTxt = `<span class="b-tech">+${pct}% chance</span> de Contra-Chute e <span class="b-pwr">+${pwrB} força</span>`;
    } else if (key === "dribbleEdgeLvl") {
      const val = [0, 0.9, 1.8, 2.7][nextL] || 2.7;
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
        const xpAmount = isTeamWide ? 105 : 135;
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
        prep.appliedMsg = `Vitória épica por Gol de Ouro (1 x 0${scorerName ? ` · ${scorerName}` : ""})! Os 5 participantes ganharam +120 a +150 XP${drinkMsg} e o craque rival ${c5.starRecruit.player.name} (OVR ${c5.starRecruit.player.ovr}) quer se juntar ao seu Dream Team!`;
      } else {
        prep.phase = "DONE";
        prep.appliedMsg = won
          ? `Vitória por Gol de Ouro (1 x 0${scorerName ? ` · ${scorerName}` : ""})! Todos os 5 participantes ganharam +120 a +150 XP${drinkMsg} e o time ganhou +${pwr} Poder!`
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

function buildTeamEnergyBarHTML(isLive = false, activeMinute = 0) {
  const val = Math.round(getTeamEnergy());
  const band = getTeamEnergyBand(val);
  const prefix = isLive ? "live" : "prep";
  const showLateBadge = Boolean(
    state.tournament?.prepBonuses?.lateMatchNoStaminaLoss && activeMinute >= 75
  );
  return `
    <div class="team-energy-strip ${isLive ? "is-live" : ""}" id="${prefix}-team-energy-strip" style="border-color:${band.border}; background:${band.bg};">
      <div class="team-energy-row">
        <span class="team-energy-title">⚡ Energia do Time: <strong id="${prefix}-team-energy-pill" style="color:${band.color};">${val}% (${band.label})</strong><span class="team-energy-passive-badge" id="${prefix}-team-energy-passive" style="display:${showLateBadge ? "inline-flex" : "none"};">🛡️ -50% (75'+)</span></span>
        <span class="team-energy-desc" id="${prefix}-team-energy-desc">${band.desc}</span>
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
    descEl.textContent = eBand.desc;
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
    return "Baixa (~22%/jogo): recupera mais fôlego sem bola, usa só técnicas padrão e reduz força em duelos.";
  }
  if (intensity === "high") {
    return "Alta (~68%/jogo): +força nos duelos e super técnicas frequentes, mas desgasta muito mais rápido.";
  }
  return "Média (~41%/jogo): ritmo equilibrado entre técnica, fôlego individual e gasto de energia.";
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
      <div class="tac-intensity-hint" data-tac-intensity-hint>${getIntensityHintText(tac.intensity)}</div>
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
      const hintTxt = getIntensityHintText(val);
      rootEl.querySelectorAll("[data-tac-intensity-hint]").forEach((el) => {
        el.textContent = hintTxt;
      });
      saveActiveRunProgress();
    });
  });
  rootEl.querySelectorAll("[data-tac-posture]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-tac-posture");
      getTactics().posture = val;
      syncActive("data-tac-posture", val);
      saveActiveRunProgress();
    });
  });
  rootEl.querySelectorAll("[data-tac-lane]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-tac-lane");
      getTactics().lane = val;
      syncActive("data-tac-lane", val);
      saveActiveRunProgress();
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
      : `Escolha até ${totActions} ações na cidade ou vá direto para a partida:`;

    const snackActive = (t.nextMatchEnergyMul || 1) < 1;
    const isNight = isPrepNightTime(t);
    topBannerHTML = `
      <div class="prep-top-banner">
        <div class="prep-banner-main">
          <h3 style="font-size:1.0rem; font-weight:900; color:#fff; margin:0 0 6px 0;">
            ${prepHeadline}
          </h3>
          ${buildTeamEnergyBarHTML(false)}
          ${prep.autoRestMsg ? `<div class="prep-banner-notice is-rest">${prep.autoRestMsg}</div>` : ""}
          ${snackActive ? `<div class="prep-banner-notice is-snack">${prepAssetIconHTML(UI.onigiriIcon || UI.tpPendant, "Lanche")} Lanche Ativo (-20% gasto de energia no próximo jogo)</div>` : ""}
          ${prep.energyNotice ? `<div class="prep-banner-notice is-warn">${prepAssetIconHTML(UI.whistleIcon || UI.refereeWhistle, "Aviso")} ${prep.energyNotice}</div>` : ""}
        </div>
        <div class="prep-banner-actions">
          <span class="prep-xp-pill">Ações: ${remActions}/${totActions}</span>
          <span class="prep-xp-pill">Sede: ${prep.restUsedThisRound ? "Usada" : isNight ? `${PREP_SVG_MOON} Liberada` : `${PREP_SVG_LOCK} À Noite`}</span>
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
      ? `${PREP_SVG_MOON}<span>Anoiteceu • Visite a Sede do Clube</span>`
      : `${PREP_SVG_MOON}<span>Noite encerrada • Pronto para jogar</span>`;
    const mapStageHTML = mapImgSrc
      ? `
        <div class="prep-inazuma-map-stage ${isNight ? "is-night-mode" : ""}">
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
                const isRestLockedDay = Boolean(loc.isRestLocation && !isNight);
                const isRestUsed = Boolean(loc.isRestLocation && prep.restUsedThisRound);
                const isRestReadyNight = Boolean(loc.isRestLocation && isNight && !isRestUsed);
                const isDisabled = loc.isRestLocation
                  ? (isRestLockedDay || isRestUsed)
                  : (isNoActions || curTeamEnergy < reqCost);
                const pinTitle = loc.isRestLocation
                  ? isRestLockedDay
                    ? `${loc.title} — Abre à noite após usar suas ações`
                    : isRestUsed
                    ? `${loc.title} — Descanso gratuito já usado nesta rodada`
                    : `${loc.title} — 1x Grátis à noite (não gasta ação)`
                  : isNoActions
                  ? `${loc.title} — Ações desta rodada encerradas`
                  : isDisabled
                  ? `${loc.title} — Energia insuficiente (precisa de ${reqCost}%)`
                  : `${loc.title} — ${loc.sub}`;
                const energyBadge = loc.isRestLocation
                  ? `<span class="pin-energy-tag is-gain">${isRestUsed ? "Usado" : isRestLockedDay ? "À Noite" : "Grátis"}</span>`
                  : `<span class="pin-energy-tag is-cost">-${reqCost}%</span>`;
                return `
            <div class="prep-map-pin ${loc.isRestLocation ? "is-rest-pin" : ""} ${isRestReadyNight ? "is-night-highlight" : ""} ${isDisabled ? "is-disabled" : ""}" data-prep-loc="${loc.id}" style="left:${loc.mapX || 50}%; top:${loc.mapY || 50}%;" title="${pinTitle}">
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
        ${activeLoc?.isRestLocation ? `<div class="prep-rest-energy-preview">${buildTeamEnergyBarHTML(false)}</div>` : ""}
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
                  const lvlGain = ev.levelGain || ev.ovrBoost || 1;
                  const nextLvl = curLvl + lvlGain;
                  const curPwr = calcIndividualPlayerPower(p, slot.role, curLvl);
                  const pwrPerLvl = calcPowerPerLevel(curOvr);
                  const extraItemPwr = (ev.indivPower || 20) + (ev.kind === "KESHIN_PICK" ? 32 : ev.id === "secret_hissatsu_mastery" ? 38 : ev.kind === "EVO_PICK" ? 16 : 0);
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
                        <div style="display:flex; align-items:center; gap:4px; flex-wrap:wrap; font-size:0.76rem; font-weight:900; color:#fff;">
                          ${posIconHTML(slot.role, true)}
                          <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1 1 auto;">${p.name}</span>
                          <span style="color:#fde047; flex-shrink:0;">(OVR ${curOvr})</span>
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
            <div class="prep-reward-actions">
              ${(() => {
                const minCityCost = Math.min(...locations.filter((l) => !l.isRestLocation).map((l) => getPrepLocationCost(l, t)));
                const cantAffordMoreCity = curTeamEnergy < minCityCost;
                const entersNightNow = !prep.lastActionWasFreeRest && !prep.restUsedThisRound && (prep.eventsRemaining === 1 || cantAffordMoreCity);
                const hasMoreDayActions = prep.lastActionWasFreeRest ? (prep.eventsRemaining > 0 && !cantAffordMoreCity) : (prep.eventsRemaining > 1 && !cantAffordMoreCity);
                if (hasMoreDayActions) {
                  return `
                <button class="ie-cmd-btn ie-cmd-gold" id="btn-prep-second-event">
                  <span>Voltar para o Mapa →</span>
                </button>`;
                }
                if (entersNightNow) {
                  return `
                <button class="ie-cmd-btn ie-cmd-gold" id="btn-prep-second-event">
                  <span>${PREP_SVG_MOON} Anoitecer • Ir para a Sede →</span>
                </button>`;
                }
                return `
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
