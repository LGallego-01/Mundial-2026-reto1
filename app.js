const API = "https://mundial2026reto1.quinterolila03.workers.dev";

let games = [];
let teams = [];
let standings = [];
let currentLanguage = "es";

const teamTranslations = {
  "Germany": "Alemania",
  "Ecuador": "Ecuador",
  "Scotland": "Escocia",
  "Mexico": "México",
  "South Africa": "Sudáfrica",
  "South Korea": "Corea del Sur",
  "Czechia": "República Checa",
  "United States": "Estados Unidos",
  "Brazil": "Brasil",
  "Spain": "España",
  "England": "Inglaterra",
  "Netherlands": "Países Bajos",
  "Switzerland": "Suiza",
  "Ivory Coast": "Costa de Marfil",
  "Saudi Arabia": "Arabia Saudita",
  "Cape Verde": "Cabo Verde",
  "Cape Verde Islands": "Cabo Verde",
  "Bosnia-H.": "Bosnia-Herzegovina",
  "Bosnia-Herzegovina": "Bosnia-Herzegovina",
  "Morocco": "Marruecos",
  "France": "Francia",
  "Belgium": "Bélgica",
  "Egypt": "Egipto",
  "Japan": "Japón",
  "Sweden": "Suecia",
  "Tunisia": "Túnez",
  "Norway": "Noruega",
  "Portugal": "Portugal",
  "Colombia": "Colombia",
  "Argentina": "Argentina",
  "Uruguay": "Uruguay",
  "Canada": "Canadá",
  "Australia": "Australia",
  "Turkey": "Turquía",
  "Curaçao": "Curazao",
  "Qatar": "Catar",
  "Paraguay": "Paraguay",
  "Haiti": "Haití",
  "Iran": "Irán",
  "New Zealand": "Nueva Zelanda",
  "Iraq": "Irak",
  "Jordan": "Jordania",
  "Austria": "Austria",
  "Algeria": "Argelia",
  "Senegal": "Senegal",
  "Ghana": "Ghana",
  "Panama": "Panamá",
  "Croatia": "Croacia",
  "DR Congo": "RD Congo",
  "Uzbekistan": "Uzbekistán",

  "GER": "Alemania",
  "ECU": "Ecuador",
  "SCO": "Escocia",
  "MEX": "México",
  "RSA": "Sudáfrica",
  "KOR": "Corea del Sur",
  "CZE": "República Checa",
  "USA": "Estados Unidos",
  "BRA": "Brasil",
  "ESP": "España",
  "ENG": "Inglaterra",
  "NED": "Países Bajos",
  "SUI": "Suiza",
  "CIV": "Costa de Marfil",
  "KSA": "Arabia Saudita",
  "CPV": "Cabo Verde",
  "BIH": "Bosnia-Herzegovina",
  "MAR": "Marruecos",
  "FRA": "Francia",
  "BEL": "Bélgica",
  "EGY": "Egipto",
  "JPN": "Japón",
  "SWE": "Suecia",
  "TUN": "Túnez",
  "NOR": "Noruega",
  "POR": "Portugal",
  "COL": "Colombia",
  "ARG": "Argentina",
  "URU": "Uruguay",
  "CAN": "Canadá",
  "AUS": "Australia",
  "TUR": "Turquía",
  "CUW": "Curazao",
  "QAT": "Catar",
  "PAR": "Paraguay",
  "HAI": "Haití",
  "IRN": "Irán",
  "NZL": "Nueva Zelanda",
  "IRQ": "Irak",
  "JOR": "Jordania",
  "AUT": "Austria",
  "ALG": "Argelia",
  "SEN": "Senegal",
  "GHA": "Ghana",
  "PAN": "Panamá",
  "CRO": "Croacia",
  "COD": "RD Congo",
  "UZB": "Uzbekistán"
};

async function fetchJson(path) {
  const response = await fetch(`${API}${path}`);
  if (!response.ok) throw new Error("No se pudo consultar " + path);
  return await response.json();
}

async function loadData() {
  setText("smartNote", "Actualizando datos desde Football Data...");

  try {
    const [matchesData, teamsData, standingsData] = await Promise.all([
      fetchJson("/matches"),
      fetchJson("/teams"),
      fetchJson("/standings")
    ]);

    games = matchesData.matches || [];
    teams = teamsData.teams || [];
    standings = standingsData.standings || [];

    setText("smartNote", "Datos actualizados correctamente. Horarios convertidos al horario local del visitante.");
  } catch (error) {
    console.error(error);
    setText("smartNote", "No se pudieron cargar los datos. Intenta actualizar la página.");
  }

  renderNextMatch();
  renderMatches("all");
  renderGroups();
  renderBracket();
}

function getTeamName(team) {
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

function localTime(dateValue) {
  if (!dateValue) return "Horario por definir";

  const date = new Date(dateValue);

  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function statusOf(match) {
  if (match.status === "IN_PLAY" || match.status === "PAUSED") return "live";
  if (match.status === "FINISHED") return "finished";
  return "next";
}

function renderNextMatch() {
  const upcoming = games
    .filter(match => statusOf(match) === "next")
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))[0];

  if (!upcoming) {
    setText("nextMatch", "No hay próximos partidos disponibles.");
    return;
  }

  const home = getTeamName(upcoming.homeTeam);
  const away = getTeamName(upcoming.awayTeam);

  setText("nextMatch", `${home} vs ${away} · ${localTime(upcoming.utcDate)}`);
}

function renderMatches(filter = "all") {
  const container = document.getElementById("matchesGrid");

  const list = games.filter(match => {
    return filter === "all" || statusOf(match) === filter;
  });

  container.innerHTML = list.map(match => {
    const home = getTeamName(match.homeTeam);
    const away = getTeamName(match.awayTeam);

    const homeScore = match.score?.fullTime?.home ?? "-";
    const awayScore = match.score?.fullTime?.away ?? "-";

    const status = statusOf(match);

    return `
      <article class="card">
        <span class="pill">${statusLabel(status)}</span>
        <h3>${home} vs ${away}</h3>
        <div class="score">${homeScore} - ${awayScore}</div>
        <p>${localTime(match.utcDate)}</p>
        <p class="muted">${smartMatchNote(match)}</p>
      </article>
    `;
  }).join("") || `<p class="muted">No hay partidos para este filtro.</p>`;
}

function statusLabel(status) {
  if (status === "live") return currentLanguage === "es" ? "EN VIVO" : "LIVE";
  if (status === "finished") return currentLanguage === "es" ? "FINALIZADO" : "FINISHED";
  return currentLanguage === "es" ? "PRÓXIMO" : "NEXT";
}

function smartMatchNote(match) {
  const status = statusOf(match);

  if (currentLanguage === "en") {
    if (status === "live") return "This result may change the group standings.";
    if (status === "finished") return "Result available for standings and tiebreakers.";
    return "Upcoming match automatically converted to your local time.";
  }

  if (status === "live") return "Este resultado puede cambiar la clasificación del grupo.";
  if (status === "finished") return "Resultado disponible para clasificación y desempates.";
  return "Próximo partido convertido automáticamente al horario local.";
}

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function searchCountry() {
  const input = document.getElementById("countryInput").value.trim();
  const result = document.getElementById("countryResult");

  if (!input) return;

  const search = normalizeText(input);

  const team = teams.find(t => {
    return (
      normalizeText(t.name).includes(search) ||
      normalizeText(t.shortName).includes(search) ||
      normalizeText(t.tla).includes(search) ||
      normalizeText(getTeamName(t)).includes(search)
    );
  });

  if (!team) {
    result.innerHTML = `
      <article class="card">
        <h3>${currentLanguage === "es" ? "País no participante" : "Country not participating"}</h3>
        <p>${currentLanguage === "es"
          ? `“${input}” no aparece entre los 48 equipos registrados para el Mundial 2026.`
          : `“${input}” is not listed among the 48 registered teams for the 2026 World Cup.`
        }</p>
      </article>
    `;
    return;
  }

  const teamMatches = games.filter(match => {
    return match.homeTeam?.id === team.id || match.awayTeam?.id === team.id;
  });

  const group = findTeamGroup(team.id);

  result.innerHTML = `
    <article class="card">
      <h3>${getTeamName(team)}</h3>
      <p><b>${currentLanguage === "es" ? "Código" : "Code"}:</b> ${team.tla}</p>
      <p><b>${currentLanguage === "es" ? "Grupo" : "Group"}:</b> ${group || "Por definir"}</p>
      <p><b>${currentLanguage === "es" ? "Partidos encontrados" : "Matches found"}:</b> ${teamMatches.length}</p>
    </article>
    ${teamMatches.map(match => `
      <article class="card">
        <b>${getTeamName(match.homeTeam)} vs ${getTeamName(match.awayTeam)}</b>
        <p>${localTime(match.utcDate)}</p>
        <p class="muted">${smartMatchNote(match)}</p>
      </article>
    `).join("")}
  `;
}

function findTeamGroup(teamId) {
  for (const group of standings) {
    const found = group.table?.find(row => row.team.id === teamId);
    if (found) return group.group;
  }
  return null;
}

function renderGroups() {
  const container = document.getElementById("groupsGrid");

  if (!standings.length) {
    container.innerHTML = `<p class="muted">Clasificación pendiente de sincronización.</p>`;
    return;
  }

  container.innerHTML = standings.map(group => `
    <article class="card">
      <h3>${group.group}</h3>
      <table>
        <tr>
          <th>#</th>
          <th>${currentLanguage === "es" ? "Equipo" : "Team"}</th>
          <th>Pts</th>
          <th>${currentLanguage === "es" ? "DG" : "GD"}</th>
        </tr>
        ${group.table.map(row => `
          <tr>
            <td>${row.position}</td>
            <td>${getTeamName(row.team)}</td>
            <td>${row.points}</td>
            <td>${row.goalDifference}</td>
          </tr>
        `).join("")}
      </table>
    </article>
  `).join("");
}

function renderBracket() {
  const knockoutMatches = games.filter(match => match.stage !== "GROUP_STAGE");
  const container = document.getElementById("bracket");

  if (!knockoutMatches.length) {
    container.innerHTML = `
      <div class="round">
        <h3>${currentLanguage === "es" ? "Llaves" : "Bracket"}</h3>
        <p>${currentLanguage === "es"
          ? "Las llaves se mostrarán cuando estén disponibles los clasificados."
          : "The bracket will be shown when qualified teams are available."
        }</p>
      </div>
    `;
    return;
  }

  container.innerHTML = knockoutMatches.map(match => `
    <div class="round">
      <h3>${formatStage(match.stage)}</h3>
      <p>${getTeamName(match.homeTeam)} vs ${getTeamName(match.awayTeam)}</p>
      <p class="muted">${localTime(match.utcDate)}</p>
    </div>
  `).join("");
}

function formatStage(stage) {
  return String(stage || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

function showSection(id) {
  document.querySelectorAll(".panel").forEach(panel => {
    panel.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function changeLanguage() {
  currentLanguage = document.getElementById("languageSelect").value;
  renderNextMatch();
  renderMatches("all");
  renderGroups();
  renderBracket();
}

loadData();
