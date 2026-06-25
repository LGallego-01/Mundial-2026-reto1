const API = "https://worldcup26.ir";
let games = [];
let teams = [];
let groups = [];

const aliases = {
  "estados unidos": "usa", "eeuu": "usa", "usa": "usa",
  "inglaterra": "england", "españa": "spain", "alemania": "germany",
  "brasil": "brazil", "corea del sur": "south korea", "costa rica": "costa rica"
};

async function fetchJson(path) {
  const response = await fetch(`${API}${path}`);
  if (!response.ok) throw new Error("API no disponible");
  return await response.json();
}

async function loadData() {
  setText("smartNote", "Actualizando resultados y clasificación...");
  try {
    const [g, t, gr] = await Promise.all([
      fetchJson("/get/games"),
      fetchJson("/get/teams"),
      fetchJson("/get/groups")
    ]);
    games = normalizeArray(g);
    teams = normalizeArray(t);
    groups = normalizeArray(gr);
    setText("smartNote", "Datos cargados. Horarios convertidos automáticamente al horario del dispositivo.");
  } catch (e) {
    games = demoGames();
    teams = demoTeams();
    groups = demoGroups();
    setText("smartNote", "Modo demostración: cuando la API esté disponible, la página se sincronizará automáticamente.");
  }
  renderNextMatch();
  renderMatches("all");
  renderGroups();
  renderBracket();
}

function normalizeArray(data) {
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  if (data?.games) return data.games;
  if (data?.teams) return data.teams;
  if (data?.groups) return data.groups;
  return [];
}

function getTeamName(value) {
  if (!value) return "Por definir";
  if (typeof value === "string") return value;
  return value.name || value.country || value.team || value.en || "Por definir";
}

function getMatchDate(match) {
  return match.date || match.datetime || match.time || match.start_time || match.kickoff;
}

function localTime(dateValue) {
  if (!dateValue) return "Horario por definir";
  const d = new Date(dateValue);
  if (isNaN(d)) return dateValue;
  return d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function statusOf(match) {
  const raw = String(match.status || match.state || "").toLowerCase();
  if (raw.includes("live") || raw.includes("playing")) return "live";
  if (raw.includes("finish") || raw.includes("final")) return "finished";
  const d = new Date(getMatchDate(match));
  if (!isNaN(d) && d < new Date()) return "finished";
  return "next";
}

function renderNextMatch() {
  const upcoming = games
    .filter(m => statusOf(m) === "next")
    .sort((a,b) => new Date(getMatchDate(a)) - new Date(getMatchDate(b)))[0];
  if (!upcoming) return setText("nextMatch", "No hay próximos partidos disponibles");
  const a = getTeamName(upcoming.home_team || upcoming.home || upcoming.team1);
  const b = getTeamName(upcoming.away_team || upcoming.away || upcoming.team2);
  setText("nextMatch", `${a} vs ${b} · ${localTime(getMatchDate(upcoming))}`);
}

function renderMatches(filter = "all") {
  const container = document.getElementById("matchesGrid");
  const list = games.filter(m => filter === "all" || statusOf(m) === filter);
  container.innerHTML = list.map(m => {
    const home = getTeamName(m.home_team || m.home || m.team1);
    const away = getTeamName(m.away_team || m.away || m.team2);
    const hs = m.home_score ?? m.score_home ?? m.home_goals ?? "-";
    const as = m.away_score ?? m.score_away ?? m.away_goals ?? "-";
    const st = statusOf(m);
    return `<article class="card">
      <span class="pill">${st === "live" ? "EN VIVO" : st === "finished" ? "FINALIZADO" : "PRÓXIMO"}</span>
      <h3>${home} vs ${away}</h3>
      <div class="score">${hs} - ${as}</div>
      <p>${localTime(getMatchDate(m))}</p>
      <p class="muted">${smartMatchNote(m)}</p>
    </article>`;
  }).join("") || `<p class="muted">No hay partidos para este filtro.</p>`;
}

function smartMatchNote(m) {
  const st = statusOf(m);
  if (st === "live") return "Este resultado puede cambiar la clasificación del grupo.";
  if (st === "finished") return "Resultado disponible para clasificación y desempates.";
  return "Próximo partido convertido al horario local de quien abre la página.";
}

function searchCountry() {
  const input = document.getElementById("countryInput").value.trim().toLowerCase();
  const normalized = aliases[input] || input;
  const team = teams.find(t => getTeamName(t).toLowerCase() === normalized || getTeamName(t).toLowerCase().includes(normalized));
  const result = document.getElementById("countryResult");
  if (!input) return;
  if (!team) {
    result.innerHTML = `<article class="card"><h3>País no participante</h3><p>“${input}” no aparece como selección clasificada o registrada en la API del Mundial 2026.</p></article>`;
    return;
  }
  const name = getTeamName(team);
  const teamGames = games.filter(m => JSON.stringify(m).toLowerCase().includes(name.toLowerCase()));
  result.innerHTML = `<article class="card"><h3>${name}</h3><p><b>Grupo:</b> ${team.group || team.group_name || "Por definir"}</p><p>${teamGames.length} partido(s) encontrados.</p></article>` +
    teamGames.map(m => `<article class="card"><b>${getTeamName(m.home_team || m.home || m.team1)} vs ${getTeamName(m.away_team || m.away || m.team2)}</b><p>${localTime(getMatchDate(m))}</p><p class="muted">${smartMatchNote(m)}</p></article>`).join("");
}

function renderGroups() {
  const container = document.getElementById("groupsGrid");
  if (groups.length) {
    container.innerHTML = groups.map((g, i) => `<article class="card"><h3>Grupo ${g.name || g.group || String.fromCharCode(65+i)}</h3>${groupTable(g)}</article>`).join("");
  } else {
    container.innerHTML = `<p class="muted">Clasificación pendiente de sincronización.</p>`;
  }
}

function groupTable(group) {
  const rows = group.teams || group.standings || [];
  if (!rows.length) return `<p class="muted">Sin posiciones disponibles todavía.</p>`;
  return `<table><tr><th>Equipo</th><th>Pts</th><th>DG</th></tr>${rows.map(t => `<tr><td>${getTeamName(t)}</td><td>${t.points ?? t.pts ?? 0}</td><td>${t.goal_difference ?? t.gd ?? 0}</td></tr>`).join("")}</table>`;
}

function renderBracket() {
  const rounds = ["Ronda de 32", "Octavos", "Cuartos", "Semifinal", "Final"];
  document.getElementById("bracket").innerHTML = rounds.map(r => `<div class="round"><h3>${r}</h3><p>Por definir vs Por definir</p><p class="muted">Se actualiza con clasificados disponibles.</p></div>`).join("");
}

function showSection(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function setText(id, text) { document.getElementById(id).textContent = text; }

function demoTeams() { return [{name:"Colombia", group:"Por definir"},{name:"Argentina", group:"Por definir"},{name:"Spain", group:"Por definir"},{name:"Brazil", group:"Por definir"},{name:"USA", group:"Por definir"}]; }
function demoGroups() { return [{name:"A", teams:[{name:"Por definir", points:0, gd:0},{name:"Por definir", points:0, gd:0}]}]; }
function demoGames() { return [{home_team:"México", away_team:"Por definir", date:"2026-06-11T20:00:00Z", status:"scheduled"},{home_team:"Canadá", away_team:"Por definir", date:"2026-06-12T00:00:00Z", status:"scheduled"}]; }

loadData();
