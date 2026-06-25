const API = "https://mundial2026reto1.quinterolila03.workers.dev";

let games = [];
let teams = [];
let standings = [];
let currentLanguage = "es";

const teamTranslations = {
  "Germany": "Alemania",
  "Ecuador": "Ecuador",
  "Mexico": "México",
  "South Africa": "Sudáfrica",
  "South Korea": "Corea del Sur",
  "Czechia": "Chequia",
  "United States": "Estados Unidos",
  "Brazil": "Brasil",
  "Spain": "España",
  "England": "Inglaterra",
  "Netherlands": "Países Bajos",
  "Switzerland": "Suiza",
  "Ivory Coast": "Costa de Marfil",
  "Saudi Arabia": "Arabia Saudita",
  "Cape Verde": "Cabo Verde",
  "Bosnia-H.": "Bosnia-Herzegovina",
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
  "Turkey": "Turquía"
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

  const name = team.shortName || team.name || "Por definir";

  if (currentLanguage === "es") {
    return teamTranslations[name] || teamTranslations[team.name] || name;
  }

  return name;
}

function getMatchDate(match) {
  return match.utcDate;
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
  if (status === "live") return "EN VIVO";
  if (status === "finished") return "FINALIZADO";
  return "PRÓXIMO";
}

function smartMatchNote(match) {
  const status = statusOf(match);

  if (status === "live") {
    return "Este resultado puede cambiar la clasificación del grupo.";
  }

  if (status === "finished") {
    return "Resultado disponible para clasificación y desempates.";
  }

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
      normalizeText(t.tla).includes(search)
    );
  });

  if (!team) {
    result.innerHTML = `
      <article class="card">
        <h3>País no participante</h3>
        <p>“${input}” no aparece entre los 48 equipos registrados para el Mundial 2026.</p>
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
      <h3>${team.name}</h3>
      <p><b>Código:</b> ${team.tla}</p>
      <p><b>Grupo:</b> ${group || "Por definir"}</p>
      <p><b>Partidos encontrados:</b> ${teamMatches.length}</p>
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
          <th>Equipo</th>
          <th>Pts</th>
          <th>DG</th>
        </tr>
        ${group.table.map(row => `
          <tr>
            <td>${row.position}</td>
            <td>${row.team.shortName}</td>
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
        <h3>Llaves</h3>
        <p>Las llaves se mostrarán cuando estén disponibles los clasificados.</p>
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
