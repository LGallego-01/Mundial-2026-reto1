/* ===========================================
   WORLD CUP VISION 2026
   APP
=========================================== */

window.appState = {
  matches: [],
  teams: [],
  standings: []
};

async function initApp() {
  setText("smartNote", "Actualizando datos del Mundial...");

  const data = await loadTournament();

  window.appState.matches = data.matches || [];
  window.appState.teams = data.teams || [];
  window.appState.standings = data.standings || [];

  setText("smartNote", "Datos actualizados correctamente con horario local automático.");

  renderDashboard(window.appState.matches, window.appState.teams);
  renderMatches("all");
  renderGroups();
  renderBracket();
  renderStats(window.appState.matches, window.appState.teams);
}

function renderMatches(filter = "all") {
  const container = document.getElementById("matchesGrid");
  if (!container) return;

  const list = window.appState.matches.filter(match => {
    return filter === "all" || statusOf(match) === filter;
  });

  container.innerHTML = list.map(matchCard).join("") ||
    `<p class="muted">No hay partidos para este filtro.</p>`;
}

function matchCard(match) {
  const homeScore = match.score?.fullTime?.home ?? "-";
  const awayScore = match.score?.fullTime?.away ?? "-";

  return `
    <article class="card">
      <span class="pill">${statusLabel(statusOf(match))}</span>
      <h3>${teamName(match.homeTeam)} vs ${teamName(match.awayTeam)}</h3>
      <div class="score">${homeScore} - ${awayScore}</div>
      <p>${localTime(match.utcDate)}</p>
      <p class="muted">${smartMatchNote(match)}</p>
    </article>
  `;
}

function matchCardCompact(match) {
  return `
    <article class="card">
      <span class="pill">${statusLabel(statusOf(match))}</span>
      <h3>${teamName(match.homeTeam)} vs ${teamName(match.awayTeam)}</h3>
      <p>${localTime(match.utcDate)}</p>
      <p class="muted">${smartMatchNote(match)}</p>
    </article>
  `;
}

function smartMatchNote(match) {
  const status = statusOf(match);

  if (getLanguage() === "en") {
    if (status === "live") return "This result may change the group standings.";
    if (status === "finished") return "Result available for standings and tiebreakers.";
    return "Upcoming match automatically converted to your local time.";
  }

  if (status === "live") return "Este resultado puede cambiar la clasificación del grupo.";
  if (status === "finished") return "Resultado disponible para clasificación y desempates.";
  return "Próximo partido convertido automáticamente al horario local.";
}

function searchCountry() {
  const input = document.getElementById("countryInput")?.value.trim();
  const result = document.getElementById("countryResult");

  if (!input || !result) return;

  const search = normalizeText(input);

  const team = window.appState.teams.find(team => {
    return (
      normalizeText(team.name).includes(search) ||
      normalizeText(team.shortName).includes(search) ||
      normalizeText(team.tla).includes(search) ||
      normalizeText(teamName(team)).includes(search)
    );
  });

  if (!team) {
    result.innerHTML = `
      <article class="card">
        <h3>País no participante</h3>
        <p>“${input}” no aparece entre las selecciones registradas para el Mundial 2026.</p>
      </article>
    `;
    return;
  }

  const matches = window.appState.matches.filter(match => {
    return match.homeTeam?.id === team.id || match.awayTeam?.id === team.id;
  });

  const group = findTeamGroup(team.id);

  result.innerHTML = `
    <article class="card">
      <h3>${teamName(team)}</h3>
      <p><b>Código:</b> ${team.tla}</p>
      <p><b>Grupo:</b> ${group || "Por definir"}</p>
      <p><b>Partidos encontrados:</b> ${matches.length}</p>
    </article>
    ${matches.map(matchCardCompact).join("")}
  `;
}

function findTeamGroup(teamId) {
  for (const group of window.appState.standings) {
    const found = group.table?.find(row => row.team.id === teamId);
    if (found) return group.group;
  }
  return null;
}

function renderGroups() {
  const container = document.getElementById("groupsGrid");
  if (!container) return;

  container.innerHTML = window.appState.standings.map(group => `
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
            <td>${teamName(row.team)}</td>
            <td>${row.points}</td>
            <td>${row.goalDifference}</td>
          </tr>
        `).join("")}
      </table>
    </article>
  `).join("");
}

function renderBracket() {
  const container = document.getElementById("bracket");
  if (!container) return;

  const knockoutMatches = window.appState.matches.filter(match => match.stage !== "GROUP_STAGE");

  if (!knockoutMatches.length) {
    container.innerHTML = `
      <div class="round">
        <h3>Llaves</h3>
        <p>Las llaves se mostrarán cuando existan clasificados confirmados.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = knockoutMatches.map(match => `
    <div class="round">
      <h3>${formatStage(match.stage)}</h3>
      <p>${teamName(match.homeTeam)} vs ${teamName(match.awayTeam)}</p>
      <p class="muted">${localTime(match.utcDate)}</p>
    </div>
  `).join("");
}

function changeLanguage() {
  const language = document.getElementById("languageSelect")?.value || "es";

  setLanguage(language);

  renderDashboard(window.appState.matches, window.appState.teams);
  renderMatches("all");
  renderGroups();
  renderBracket();
  renderStats(window.appState.matches, window.appState.teams);
}

function loadData() {
  initApp();
}

initApp();

setInterval(initApp, 60000);
