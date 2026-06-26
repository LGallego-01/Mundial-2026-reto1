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
}
