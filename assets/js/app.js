const API = "https://mundial2026reto1.quinterolila03.workers.dev";

let games = [];
let teams = [];
let standings = [];
let currentLanguage = "es";
let countdownTimer = null;

const translations = {
  Germany: "Alemania", Ecuador: "Ecuador", Scotland: "Escocia", Mexico: "México",
  "South Africa": "Sudáfrica", "South Korea": "Corea del Sur", Czechia: "República Checa",
  "United States": "Estados Unidos", Brazil: "Brasil", Spain: "España", England: "Inglaterra",
  Netherlands: "Países Bajos", Switzerland: "Suiza", "Ivory Coast": "Costa de Marfil",
  "Saudi Arabia": "Arabia Saudita", "Cape Verde": "Cabo Verde", Morocco: "Marruecos",
  France: "Francia", Belgium: "Bélgica", Egypt: "Egipto", Japan: "Japón", Sweden: "Suecia",
  Tunisia: "Túnez", Norway: "Noruega", Turkey: "Turquía", Qatar: "Catar",
  Haiti: "Haití", Iran: "Irán", "New Zealand": "Nueva Zelanda", Iraq: "Irak",
  Jordan: "Jordania", Algeria: "Argelia", Croatia: "Croacia", Panama: "Panamá",
  Uzbekistan: "Uzbekistán", "DR Congo": "RD Congo", "Bosnia-H.": "Bosnia-Herzegovina",
  Curaçao: "Curazao"
};

async function fetchJson(path) {
  const response = await fetch(`${API}${path}`);
  if (!response.ok) throw new Error("Error consultando " + path);
  return response.json();
}

async function loadData() {
  setText("smartNote", "Actualizando datos del Mundial...");

  try {
    const [matchesData, teamsData, standingsData] = await Promise.all([
      fetchJson("/matches"),
      fetchJson("/teams"),
      fetchJson("/standings")
    ]);

    games = matchesData.matches || [];
    teams = teamsData.teams || [];
    standings = standingsData.standings || [];

    setText("smartNote", "Datos actualizados correctamente con horario local automático.");
  } catch (error) {
    console.error(error);
    setText("smartNote", "No se pudieron cargar los datos. Intenta actualizar.");
  }

  renderDashboard();
  renderMatches("all");
  renderGroups();
  renderBracket();
  renderStats();
}

function teamName(team) {
  if (!team) return currentLanguage === "es" ? "Por definir" : "TBD";
  const name = team.shortName || team.name || "TBD";
  return currentLanguage === "es" ? translations[name] || name : name;
}

function localTime(dateValue) {
  if (!dateValue) return currentLanguage === "es" ? "Horario por definir" : "Time TBD";
  return new Date(dateValue).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function statusOf(match) {
  if (match.status === "IN_PLAY" || match.status === "PAUSED") return "live";
  if (match.status === "FINISHED") return "finished";
  return "next";
}

function renderDashboard() {
  const total = games.length;
  const finished = games.filter(m => statusOf(m) === "finished").length;
  const live = games.filter(m => statusOf(m) === "live").length;

  setText("totalMatches", total);
  setText("finishedMatches", finished);
  setText("liveMatches", live);
  setText("totalTeams", teams.length);

  const next = getNextMatch();

  if (!next) {
    setText("nextMatch", currentLanguage === "es" ? "No hay próximos partidos" : "No upcoming matches");
    setText("countdown", "--:--:--");
  } else {
    setText("nextMatch", `${teamName(next.homeTeam)} vs ${teamName(next.awayTeam)} · ${localTime(next.utcDate)}`);
    startCountdown(next.utcDate);
  }

  renderFeaturedMatches();
}

function getNextMatch() {
  return games
    .filter(m => statusOf(m) === "next")
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))[0];
}

function startCountdown(dateValue) {
  if (countdownTimer) clearInterval(countdownTimer);

  function update() {
    const diff = new Date(dateValue) - new Date();

    if (diff <= 0) {
      setText("countdown", "00:00:00");
      return;
    }

    const h = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, "0");
    const m = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, "0");
    const s = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

    setText("countdown", `${h}:${m}:${s}`);
  }

  update();
  countdownTimer = setInterval(update, 1000);
}

function renderFeaturedMatches() {
  const container = document.getElementById("featuredMatches");
  if (!container) return;

  const list = games
    .filter(m => statusOf(m) !== "finished")
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
    .slice(0, 4);

  container.innerHTML = list.map(matchCardCompact).join("") ||
    `<p class="muted">${currentLanguage === "es" ? "No hay partidos destacados." : "No featured matches."}</p>`;
}

function renderMatches(filter = "all") {
  const container = document.getElementById("matchesGrid");
  if (!container) return;

  const list = games.filter(m => filter === "all" || statusOf(m) === filter);

  container.innerHTML = list.map(matchCard).join("") ||
    `<p class="muted">${currentLanguage === "es" ? "No hay partidos para este filtro." : "No matches for this filter."}</p>`;
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
      <p class="muted">${smartNote(match)}</p>
    </article>
  `;
}

function matchCardCompact(match) {
  return `
    <article class="card">
      <span class="pill">${statusLabel(statusOf(match))}</span>
      <h3>${teamName(match.homeTeam)} vs ${teamName(match.awayTeam)}</h3>
      <p>${localTime(match.utcDate)}</p>
      <p class="muted">${smartNote(match)}</p>
    </article>
  `;
}

function statusLabel(status) {
  if (currentLanguage === "en") {
    if (status === "live") return "LIVE";
    if (status === "finished") return "FINISHED";
    return "NEXT";
  }

  if (status === "live") return "EN VIVO";
  if (status === "finished") return "FINALIZADO";
  return "PRÓXIMO";
}

function smartNote(match) {
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

function searchCountry() {
  const input = document.getElementById("countryInput").value.trim();
  const result = document.getElementById("countryResult");
  if (!input || !result) return;

  const search = normalize(input);

  const team = teams.find(t =>
    normalize(t.name).includes(search) ||
    normalize(t.shortName).includes(search) ||
    normalize(t.tla).includes(search) ||
    normalize(teamName(t)).includes(search)
  );

  if (!team) {
    result.innerHTML = `
      <article class="card">
        <h3>${currentLanguage === "es" ? "País no participante" : "Country not participating"}</h3>
        <p>${currentLanguage === "es"
          ? `“${input}” no aparece entre los 48 equipos registrados.`
          : `“${input}” is not listed among the 48 registered teams.`}</p>
      </article>
    `;
    return;
  }

  const matches = games.filter(m => m.homeTeam?.id === team.id || m.awayTeam?.id === team.id);
  const group = findTeamGroup(team.id);

  result.innerHTML = `
    <article class="card">
      <h3>${teamName(team)}</h3>
      <p><b>${currentLanguage === "es" ? "Código" : "Code"}:</b> ${team.tla}</p>
      <p><b>${currentLanguage === "es" ? "Grupo" : "Group"}:</b> ${group || "Por definir"}</p>
      <p><b>${currentLanguage === "es" ? "Partidos encontrados" : "Matches found"}:</b> ${matches.length}</p>
    </article>
    ${matches.map(matchCardCompact).join("")}
  `;
}

function renderGroups() {
  const container = document.getElementById("groupsGrid");
  if (!container) return;

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
            <td>${teamName(row.team)}</td>
            <td>${row.points}</td>
            <td>${row.goalDifference}</td>
          </tr>
        `).join("")}
      </table>
    </article>
  `).join("");
}

function findTeamGroup(teamId) {
  for (const group of standings) {
    if (group.table?.some(row => row.team.id === teamId)) return group.group;
  }
  return null;
}

function renderBracket() {
  const container = document.getElementById("bracket");
  if (!container) return;

  const knockout = games.filter(m => m.stage !== "GROUP_STAGE");

  container.innerHTML = knockout.length
    ? knockout.map(m => `
        <div class="round">
          <h3>${formatStage(m.stage)}</h3>
          <p>${teamName(m.homeTeam)} vs ${teamName(m.awayTeam)}</p>
          <p class="muted">${localTime(m.utcDate)}</p>
        </div>
      `).join("")
    : `<div class="round">
        <h3>${currentLanguage === "es" ? "Llaves" : "Bracket"}</h3>
        <p>${currentLanguage === "es"
          ? "Las llaves se mostrarán cuando existan clasificados confirmados."
          : "The bracket will appear when qualified teams are confirmed."}</p>
      </div>`;
}

function renderStats() {
  const container = document.getElementById("statsPanel");
  if (!container) return;

  const finished = games.filter(m => statusOf(m) === "finished");
  const goals = finished.reduce((sum, m) => {
    return sum + (m.score?.fullTime?.home || 0) + (m.score?.fullTime?.away || 0);
  }, 0);

  const avg = finished.length ? (goals / finished.length).toFixed(2) : "0.00";

  container.innerHTML = `
    <article>
      <strong>${goals}</strong>
      <span>${currentLanguage === "es" ? "Goles totales" : "Total goals"}</span>
    </article>
    <article>
      <strong>${avg}</strong>
      <span>${currentLanguage === "es" ? "Promedio de goles" : "Goals per match"}</span>
    </article>
    <article>
      <strong>${finished.length}</strong>
      <span>${currentLanguage === "es" ? "Partidos finalizados" : "Finished matches"}</span>
    </article>
    <article>
      <strong>${teams.length}</strong>
      <span>${currentLanguage === "es" ? "Selecciones" : "Teams"}</span>
    </article>
  `;
}

function showSection(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");

  document.querySelectorAll(".menu button").forEach(btn => btn.classList.remove("active"));
  const button = [...document.querySelectorAll(".menu button")]
    .find(btn => btn.getAttribute("onclick")?.includes(id));
  if (button) button.classList.add("active");
}

function changeLanguage() {
  currentLanguage = document.getElementById("languageSelect").value;
  renderDashboard();
  renderMatches("all");
  renderGroups();
  renderBracket();
  renderStats();
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatStage(stage) {
  return String(stage || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

loadData();
setInterval(loadData, 60000);
