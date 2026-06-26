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
  setText("smartNote", t("actualizando"));

  const data = await loadTournament();

  window.appState.matches = data.matches || [];
  window.appState.teams = data.teams || [];
  window.appState.standings = data.standings || [];

  setText("smartNote", t("actualizado"));

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
    `<p class="muted">${t("noPartidosFiltro")}</p>`;
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
       <h3>${t("paisNoParticipante")}</h3>
       <p>“${input}” ${t("paisNoParticipanteDesc")}</p>
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
      <h3 class="country-title">
        <img src="${team.crest || ""}" alt="${teamName(team)}" class="country-flag">
        ${teamName(team)}
      </h3>
      <p><b>${t("codigo")}:</b> ${team.tla}</p>
      <p><b>${t("grupo")}:</b> ${group || t("porDefinir")}</p>
      <p><b>${t("partidosEncontrados")}:</b> ${matches.length}</p>
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
    <article class="card group-table-card">
      <h3>${group.group}</h3>

      <div class="table-wrap">
        <table class="group-table">
          <tr>
            <th>#</th>
            <th>${t("equipo")}</th>
            <th>PJ</th>
            <th>G</th>
            <th>E</th>
            <th>P</th>
            <th>GF</th>
            <th>GC</th>
            <th>${t("dg")}</th>
            <th>Pts</th>
          </tr>

          ${group.table.map(row => `
            <tr>
              <td>${row.position}</td>
              <td>${teamName(row.team)}</td>
              <td>${row.playedGames ?? 0}</td>
              <td>${row.won ?? 0}</td>
              <td>${row.draw ?? 0}</td>
              <td>${row.lost ?? 0}</td>
              <td>${row.goalsFor ?? 0}</td>
              <td>${row.goalsAgainst ?? 0}</td>
              <td>${row.goalDifference ?? 0}</td>
              <td><b>${row.points ?? 0}</b></td>
            </tr>
          `).join("")}
        </table>
      </div>
    </article>
  `).join("");
}

function renderBracket() {
  const container = document.getElementById("bracket");
  if (!container) return;

  const knockoutMatches = window.appState.matches.filter(
    match => match.stage !== "GROUP_STAGE"
  );

  const stages = [
    ["LAST_32", getLanguage() === "es" ? "🏆 Ronda de 32" : "🏆 Round of 32"],
    ["LAST_16", getLanguage() === "es" ? "⚽ Octavos de final" : "⚽ Round of 16"],
    ["QUARTER_FINALS", getLanguage() === "es" ? "🥇 Cuartos de final" : "🥇 Quarter-finals"],
    ["SEMI_FINALS", getLanguage() === "es" ? "🔥 Semifinales" : "🔥 Semi-finals"],
    ["THIRD_PLACE", getLanguage() === "es" ? "🥉 Tercer puesto" : "🥉 Third place"],
    ["FINAL", getLanguage() === "es" ? "🏆 Final" : "🏆 Final"]
  ];

  if (!knockoutMatches.length) {
    container.innerHTML = `
      <div class="bracket-empty">
        <h3>🏆 Llaves oficiales</h3>
        <p>Las llaves aparecerán cuando finalice la fase de grupos.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = stages.map(([stageKey, title]) => {
    const matches = knockoutMatches.filter(match => match.stage === stageKey);

    if (!matches.length) return "";

    return `
      <section class="bracket-stage-section">
        <h2 class="bracket-stage-title">${title}</h2>

        <div class="bracket-grid-pro">
          ${matches.map(match => `
            <article class="bracket-match-card">
              <div class="bracket-team">
                <strong>${teamName(match.homeTeam)}</strong>
              </div>

              <div class="bracket-vs">VS</div>

              <div class="bracket-team">
                <strong>${teamName(match.awayTeam)}</strong>
              </div>

              <div class="bracket-date">
                ${localTime(match.utcDate)}
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }).join("");
}

function changeLanguage() {
  const language = document.getElementById("languageSelect")?.value || "es";

  setLanguage(language);

  renderDashboard(window.appState.matches, window.appState.teams);
  renderMatches("all");
  renderGroups();
  renderBracket();
  renderStats(window.appState.matches, window.appState.teams);

  if (predictionRounds?.length) {
    renderPrediction();
    updatePredictionPanel();
  }
}

function loadData() {
  initApp();
}

document.addEventListener("DOMContentLoaded", () => {
  initApp();
  setInterval(initApp, 60000);
});
