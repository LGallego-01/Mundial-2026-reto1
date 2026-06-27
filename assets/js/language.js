/* ===========================================
   WORLD CUP VISION 2026
   LANGUAGE
=========================================== */

let currentLanguage = "es";

const dictionary = {
  es: {
    appTitle: "Centro de seguimiento mundialista",
    eyebrow: "FIFA World Cup 2026",
    inicio: "Inicio",
    partidos: "Partidos",
    paises: "Países",
    grupos: "Grupos",
    llaves: "Llaves",
    pronostico: "Pronóstico",
    estadisticas: "Estadísticas",
    guia: "Guía fácil",
    actualizar: "Actualizar",
    proximoPartido: "Próximo partido",
    cargando: "Cargando información...",
    hoyMundial: "🔥 HOY EN EL MUNDIAL",
    proximoInicio: "Próximo inicio",
    sincronizando: "Sincronizando datos del torneo.",
    partidosKpi: "Partidos",
    finalizados: "Finalizados",
    enVivo: "En vivo",
    equipos: "Equipos",
    partidosDestacados: "Partidos destacados",
    calendario: "Calendario y resultados",
    calendarioDesc: "Consulta partidos próximos, en vivo y finalizados.",
    todos: "Todos",
    proximos: "Próximos",
    consultaPais: "Consulta por país",
    consultaPaisDesc: "Busca una selección participante del Mundial 2026.",
    buscar: "Buscar",
    placeholderPais: "Ejemplo: Colombia, Argentina, España",
    clasificacion: "Clasificación por grupos",
    clasificacionDesc: "Tabla actualizada con puntos y diferencia de gol.",
    eliminacion: "Llaves de eliminación directa",
    eliminacionDesc: "Se mostrarán cuando existan clasificados confirmados.",
    miPronostico: "Mi pronóstico del Mundial 2026",
    pronosticoDesc: "Construye tu llave personalizada y descubre tu campeón proyectado.",
    generarPronostico: "Generar pronóstico automático",
    reiniciarPronostico: "Reiniciar pronóstico",
    btnGenerarPronostico: "Generar pronóstico automático",
    btnReiniciarPronostico: "Reiniciar pronóstico",
    campeonProyectado: "Campeón proyectado",
    probabilidadesTitulo: "Probabilidades",
    analisisInteligente: "Análisis inteligente",
    textoPronosticoVacio: "Haz clic en “Generar pronóstico automático” para crear tu llave.",
    campeon: "Campeón proyectado",
    probabilidades: "Probabilidades",
    analisis: "Análisis inteligente",
    estadisticasTitulo: "Estadísticas del torneo",
    estadisticasDesc: "Resumen visual de partidos, goles y estados del torneo.",
    guiaTitulo: "Guía fácil del Mundial",
    guiaDesc: "Explicaciones simples para usuarios que no conocen mucho de fútbol.",
    victoria: "Victoria",
    victoriaDesc: "El equipo suma 3 puntos.",
    empate: "Empate",
    empateDesc: "Cada equipo suma 1 punto.",
    derrota: "Derrota",
    derrotaDesc: "No suma puntos.",
    diferenciaGol: "Diferencia de gol",
    diferenciaGolDesc: "Goles a favor menos goles en contra.",
    llaveDesc: "Desde eliminación directa, si pierdes quedas fuera.",
    actualizando: "Actualizando datos del Mundial...",
    actualizado: "Datos actualizados correctamente con horario local automático.",
    noPartidosFiltro: "No hay partidos para este filtro.",
    paisNoParticipante: "País no participante",
    paisNoParticipanteDesc: "no aparece entre las selecciones registradas para el Mundial 2026.",
    codigo: "Código",
    grupo: "Grupo",
    porDefinir: "Por definir",
    partidosEncontrados: "Partidos encontrados",
    equipo: "Equipo",
    dg: "DG"
    
  },

  en: {
    appTitle: "World Cup Live Center",
    eyebrow: "FIFA World Cup 2026",
    inicio: "Home",
    partidos: "Matches",
    paises: "Teams",
    grupos: "Groups",
    llaves: "Bracket",
    pronostico: "Prediction",
    estadisticas: "Statistics",
    guia: "Easy Guide",
    actualizar: "Refresh",
    proximoPartido: "Next match",
    hoyMundial: "🔥 TODAY AT THE WORLD CUP",
    proximoInicio: "Next kickoff",
    cargando: "Loading information...",
    sincronizando: "Syncing tournament data.",
    partidosKpi: "Matches",
    finalizados: "Finished",
    enVivo: "Live",
    equipos: "Teams",
    partidosDestacados: "Featured matches",
    calendario: "Schedule and results",
    calendarioDesc: "Check upcoming, live and finished matches.",
    todos: "All",
    proximos: "Upcoming",
    consultaPais: "Search by country",
    consultaPaisDesc: "Search for a 2026 World Cup participating team.",
    buscar: "Search",
    placeholderPais: "Example: Colombia, Argentina, Spain",
    clasificacion: "Group standings",
    clasificacionDesc: "Updated table with points and goal difference.",
    eliminacion: "Knockout bracket",
    eliminacionDesc: "It will be shown when qualified teams are confirmed.",
    miPronostico: "My 2026 World Cup prediction",
    pronosticoDesc: "Build your custom bracket and discover your projected champion.",
    generarPronostico: "Generate automatic prediction",
    reiniciarPronostico: "Reset prediction",
    btnGenerarPronostico: "Generate automatic prediction",
    btnReiniciarPronostico: "Reset prediction",
    campeonProyectado: "Projected champion",
    probabilidadesTitulo: "Probabilities",
    analisisInteligente: "Smart analysis",
    textoPronosticoVacio: "Click “Generate automatic prediction” to create your bracket.",
    campeon: "Projected champion",
    probabilidades: "Probabilities",
    analisis: "Smart analysis",
    estadisticasTitulo: "Tournament statistics",
    estadisticasDesc: "Visual summary of matches, goals and tournament status.",
    guiaTitulo: "Easy World Cup guide",
    guiaDesc: "Simple explanations for users who do not know much about football.",
    victoria: "Win",
    victoriaDesc: "The team earns 3 points.",
    empate: "Draw",
    empateDesc: "Each team earns 1 point.",
    derrota: "Loss",
    derrotaDesc: "No points are awarded.",
    diferenciaGol: "Goal difference",
    diferenciaGolDesc: "Goals scored minus goals conceded.",
    llaveDesc: "In knockout rounds, if you lose, you are eliminated.", 
    actualizando: "Updating World Cup data...",
    actualizado: "Data updated successfully with automatic local time.",
    noPartidosFiltro: "No matches for this filter.",
    paisNoParticipante: "Country not participating",
    paisNoParticipanteDesc: "is not listed among the registered teams for the 2026 World Cup.",
    codigo: "Code", 
    grupo: "Group",
    porDefinir: "TBD",
    partidosEncontrados: "Matches found",
    equipo: "Team",
    dg: "GD"
  }
};

const teamTranslations = {
  Germany: "Alemania",
  Ecuador: "Ecuador",
  Scotland: "Escocia",
  Mexico: "México",
  "South Africa": "Sudáfrica",
  "South Korea": "Corea del Sur",
  Czechia: "República Checa",
  "United States": "Estados Unidos",
  Brazil: "Brasil",
  Spain: "España",
  England: "Inglaterra",
  Netherlands: "Países Bajos",
  Switzerland: "Suiza",
  "Ivory Coast": "Costa de Marfil",
  "Saudi Arabia": "Arabia Saudita",
  "Cape Verde": "Cabo Verde",
  "Bosnia-H.": "Bosnia-Herzegovina",
  Morocco: "Marruecos",
  France: "Francia",
  Belgium: "Bélgica",
  Egypt: "Egipto",
  Japan: "Japón",
  Sweden: "Suecia",
  Tunisia: "Túnez",
  Norway: "Noruega",
  Turkey: "Turquía",
  Curaçao: "Curazao",
  Qatar: "Catar",
  Haiti: "Haití",
  Iran: "Irán",
  "New Zealand": "Nueva Zelanda",
  Iraq: "Irak",
  Jordan: "Jordania",
  Algeria: "Argelia",
  Croatia: "Croacia",
  Panama: "Panamá",
  Uzbekistan: "Uzbekistán",
  "DR Congo": "RD Congo"
};

function setLanguage(value) {
  currentLanguage = value || "es";
  applyStaticTranslations();
}

function getLanguage() {
  return currentLanguage;
}

function t(key) {
  return dictionary[currentLanguage]?.[key] || dictionary.es[key] || key;
}

function teamName(team) {
  if (!team) return currentLanguage === "es" ? "Por definir" : "TBD";

  const shortName = team.shortName || "";
  const fullName = team.name || "";
  const tla = team.tla || "";

  if (currentLanguage === "es") {
    return (
      teamTranslations[shortName] ||
      teamTranslations[fullName] ||
      teamTranslations[tla] ||
      shortName ||
      fullName ||
      "Por definir"
    );
  }

  return shortName || fullName || "TBD";
}

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function applyStaticTranslations() {
  const menuButtons = document.querySelectorAll(".menu button");
  const menuKeys = ["inicio", "partidos", "paises", "grupos", "llaves", "pronostico", "estadisticas", "guia"];

  menuButtons.forEach((button, index) => {
    if (menuKeys[index]) button.textContent = t(menuKeys[index]);
  });

  const eyebrow = document.querySelector(".eyebrow");
  if (eyebrow) eyebrow.textContent = t("eyebrow");

  const h1 = document.querySelector(".topbar h1");
  if (h1) h1.textContent = t("appTitle");

  const refreshBtn = document.querySelector(".top-actions button:last-child");
  if (refreshBtn) refreshBtn.textContent = t("actualizar");

  const label = document.querySelector(".hero-card .label");
  if (label) label.textContent = t("proximoPartido");

  const heroBadge = document.querySelector(".hero-badge");
  if (heroBadge) heroBadge.textContent = t("hoyMundial");

  const countdownTitle = document.querySelector(".countdown-card span");
  if (countdownTitle) countdownTitle.textContent = t("proximoInicio");

  const kpis = document.querySelectorAll(".kpi-grid article span");
  const kpiKeys = ["partidosKpi", "finalizados", "enVivo", "equipos"];
  kpis.forEach((item, index) => {
    if (kpiKeys[index]) item.textContent = t(kpiKeys[index]);
  });

  const panelCardTitle = document.querySelector(".panel-card h2");
  if (panelCardTitle) panelCardTitle.textContent = t("partidosDestacados");

  const countryInput = document.getElementById("countryInput");
  if (countryInput) countryInput.placeholder = t("placeholderPais");

  const searchButton = document.querySelector(".searchBox button");
  if (searchButton) searchButton.textContent = t("buscar");

   

  
  // -------- NUEVOS TITULOS --------

  const countryTitle = document.getElementById("countryTitle");
  if (countryTitle) countryTitle.textContent = t("consultaPais");

  const countrySubtitle = document.getElementById("countrySubtitle");
  if (countrySubtitle) countrySubtitle.textContent = t("consultaPaisDesc");

  const groupsTitle = document.getElementById("groupsTitle");
  if (groupsTitle) groupsTitle.textContent = t("clasificacion");

  const groupsSubtitle = document.getElementById("groupsSubtitle");
  if (groupsSubtitle) groupsSubtitle.textContent = t("clasificacionDesc");

  const bracketTitle = document.getElementById("bracketTitle");
  if (bracketTitle) bracketTitle.textContent = t("eliminacion");

  const bracketSubtitle = document.getElementById("bracketSubtitle");
  if (bracketSubtitle) bracketSubtitle.textContent = t("eliminacionDesc");

  const predictionTitle = document.getElementById("predictionTitle");
  if (predictionTitle) predictionTitle.textContent = t("miPronostico");

  const predictionSubtitle = document.getElementById("predictionSubtitle");
  if (predictionSubtitle) predictionSubtitle.textContent = t("pronosticoDesc");

  const statsTitle = document.getElementById("statsTitle");
  if (statsTitle) statsTitle.textContent = t("estadisticasTitulo");

  const statsSubtitle = document.getElementById("statsSubtitle");
  if (statsSubtitle) statsSubtitle.textContent = t("estadisticasDesc");

  const guideTitle = document.getElementById("guideTitle");
  if (guideTitle) guideTitle.textContent = t("guiaTitulo");

  const guideSubtitle = document.getElementById("guideSubtitle");
  if (guideSubtitle) guideSubtitle.textContent = t("guiaDesc");

   const calendarTitle = document.getElementById("calendarTitle");
   if (calendarTitle) calendarTitle.textContent = t("calendario");

   const calendarSubtitle = document.getElementById("calendarSubtitle");
   if (calendarSubtitle) calendarSubtitle.textContent = t("calendarioDesc");

   const filterAll = document.getElementById("filterAll");
   if (filterAll) filterAll.textContent = t("todos");

   const filterNext = document.getElementById("filterNext");
   if (filterNext) filterNext.textContent = t("proximos");

   const filterLive = document.getElementById("filterLive");
   if (filterLive) filterLive.textContent = t("enVivo");

   const filterFinished = document.getElementById("filterFinished");
   if (filterFinished) filterFinished.textContent = t("finalizados");

   const btnGeneratePrediction = document.getElementById("btnGeneratePrediction");
   if (btnGeneratePrediction) btnGeneratePrediction.textContent = t("btnGenerarPronostico");

   const btnResetPrediction = document.getElementById("btnResetPrediction");
   if (btnResetPrediction) btnResetPrediction.textContent = t("btnReiniciarPronostico");

   const championTitle = document.getElementById("championTitle");
   if (championTitle) championTitle.textContent = t("campeonProyectado");

   const oddsTitle = document.getElementById("oddsTitle");
   if (oddsTitle) oddsTitle.textContent = t("probabilidadesTitulo");

   const analysisTitle = document.getElementById("analysisTitle");
   if (analysisTitle) analysisTitle.textContent = t("analisisInteligente");

   const predictionEmptyText = document.getElementById("predictionEmptyText");
   if (predictionEmptyText) predictionEmptyText.textContent = t("textoPronosticoVacio");

   const guideWinTitle = document.getElementById("guideWinTitle");
   if (guideWinTitle) guideWinTitle.textContent = t("victoria");

   const guideWinDesc = document.getElementById("guideWinDesc");
   if (guideWinDesc) guideWinDesc.textContent = t("victoriaDesc");

   const guideDrawTitle = document.getElementById("guideDrawTitle");
   if (guideDrawTitle) guideDrawTitle.textContent = t("empate");

   const guideDrawDesc = document.getElementById("guideDrawDesc");
   if (guideDrawDesc) guideDrawDesc.textContent = t("empateDesc");

   const guideLoseTitle = document.getElementById("guideLoseTitle");
   if (guideLoseTitle) guideLoseTitle.textContent = t("derrota");

   const guideLoseDesc = document.getElementById("guideLoseDesc");
   if (guideLoseDesc) guideLoseDesc.textContent = t("derrotaDesc");

   const guideGoalTitle = document.getElementById("guideGoalTitle");
   if (guideGoalTitle) guideGoalTitle.textContent = t("diferenciaGol");

   const guideGoalDesc = document.getElementById("guideGoalDesc");
   if (guideGoalDesc) guideGoalDesc.textContent = t("diferenciaGolDesc");

   const guideBracketTitle = document.getElementById("guideBracketTitle");
   if (guideBracketTitle) guideBracketTitle.textContent = t("llaves");

   const guideBracketDesc = document.getElementById("guideBracketDesc");
   if (guideBracketDesc) guideBracketDesc.textContent = t("llaveDesc");
   
 
}

