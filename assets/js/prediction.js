/* ===========================================
   WORLD CUP VISION 2026
   PREDICTION
=========================================== */

let predictionTeams = [];
let predictionRounds = [];

function generatePrediction() {
  const matches = window.appState?.matches || [];
  const standings = window.appState?.standings || [];

  const realKnockoutMatches = getRealKnockoutMatches(matches);
const projectedTeams = getTeamsFromStandings(standings);

predictionTeams = mergeUniqueTeams(
  realKnockoutMatches.flatMap(match => [match.home, match.away]).filter(Boolean),
  projectedTeams
).slice(0, 32);

if (!realKnockoutMatches.length && !predictionTeams.length) {
  alert("No hay datos suficientes para generar el pronóstico.");
  return;
}

predictionRounds = [
  {
    name: getLanguage() === "es" ? "Ronda de 32" : "Round of 32",
    matches: realKnockoutMatches.length
      ? realKnockoutMatches
      : buildRound("Ronda de 32", predictionTeams).matches
  },
  buildEmptyRound(getLanguage() === "es" ? "Octavos" : "Round of 16", 16),
  buildEmptyRound(getLanguage() === "es" ? "Cuartos" : "Quarter-finals", 8),
  buildEmptyRound(getLanguage() === "es" ? "Semifinal" : "Semi-finals", 4),
  buildEmptyRound(getLanguage() === "es" ? "Final" : "Final", 2)
];

  autoAdvanceByStrength();

  renderPrediction();
  updatePredictionPanel();
}

function getTeamsFromKnockout(matches) {
  const teams = [];

  matches
    .filter(match => match.stage !== "GROUP_STAGE")
    .forEach(match => {
      [match.homeTeam, match.awayTeam].forEach(team => {
        if (isValidTeam(team)) teams.push(team);
      });
    });

  return teams;
}

function getTeamsFromStandings(standings) {
  const teams = [];

  standings.forEach(group => {
    const sorted = [...(group.table || [])].sort((a, b) => {
      if ((b.points ?? 0) !== (a.points ?? 0)) return (b.points ?? 0) - (a.points ?? 0);
      if ((b.goalDifference ?? 0) !== (a.goalDifference ?? 0)) return (b.goalDifference ?? 0) - (a.goalDifference ?? 0);
      return (b.goalsFor ?? 0) - (a.goalsFor ?? 0);
    });

    sorted.slice(0, 2).forEach(row => {
      if (isValidTeam(row.team)) teams.push(row.team);
    });
  });

  return teams;
}

function isValidTeam(team) {
  if (!team) return false;

  const name = String(team.name || team.shortName || "").toLowerCase();

  return (
    team.id &&
    !name.includes("tbd") &&
    !name.includes("por definir") &&
    !name.includes("winner") &&
    !name.includes("runner")
  );
}

function mergeUniqueTeams(...lists) {
  const map = new Map();

  lists.flat().forEach(team => {
    if (team?.id && !map.has(team.id)) {
      map.set(team.id, team);
    }
  });

  return [...map.values()];
}

function buildRound(name, teams) {
  const matches = [];

  for (let i = 0; i < teams.length; i += 2) {
    matches.push({
      home: teams[i],
      away: teams[i + 1] || null,
      winner: null
    });
  }

  return { name, matches };
}

function buildEmptyRound(name, slots) {
  const teams = Array.from({ length: slots }, () => null);
  return buildRound(name, teams);
}

function teamStrength(team) {
  const standings = window.appState?.standings || [];

  for (const group of standings) {
    const row = group.table?.find(item => item.team.id === team?.id);

    if (row) {
      return (
        (row.points ?? 0) * 100 +
        (row.goalDifference ?? 0) * 10 +
        (row.goalsFor ?? 0)
      );
    }
  }

  return 0;
}

function pickWinner(home, away) {
  if (!home) return away;
  if (!away) return home;

  return teamStrength(home) >= teamStrength(away) ? home : away;
}

function autoAdvanceByStrength() {
  for (let roundIndex = 0; roundIndex < predictionRounds.length - 1; roundIndex++) {
    const round = predictionRounds[roundIndex];

    round.matches.forEach((match, matchIndex) => {
      const winner = pickWinner(match.home, match.away);
      match.winner = winner;

      const nextRound = predictionRounds[roundIndex + 1];
      const nextMatchIndex = Math.floor(matchIndex / 2);
      const nextSide = matchIndex % 2 === 0 ? "home" : "away";

      if (nextRound?.matches?.[nextMatchIndex]) {
        nextRound.matches[nextMatchIndex][nextSide] = winner;
      }
    });
  }
}

function renderPrediction() {
  const container = document.getElementById("predictionBracket");
  if (!container) return;

  container.innerHTML = `
    <div class="bracket-rounds">
      ${predictionRounds.map((round, roundIndex) => `
        <div class="prediction-round">
          <h3>${round.name}</h3>

          ${round.matches.map((match, matchIndex) => `
            <div class="prediction-match">
              ${predictionTeamButton(match.home, roundIndex, matchIndex, "home", match.winner)}
              ${predictionTeamButton(match.away, roundIndex, matchIndex, "away", match.winner)}
            </div>
          `).join("")}
        </div>
      `).join("")}
    </div>
  `;
}

function predictionTeamButton(team, roundIndex, matchIndex, side, winner) {
  if (!team) {
    return `<div class="prediction-team"><span>Por definir</span><small>-</small></div>`;
  }

  const isWinner = winner?.id === team.id ? "winner" : "";

  return `
    <div class="prediction-team ${isWinner}"
      onclick="selectPredictionWinner(${roundIndex}, ${matchIndex}, '${side}')">
      <span>${teamName(team)}</span>
      <small>${team.tla || ""}</small>
    </div>
  `;
}

function selectPredictionWinner(roundIndex, matchIndex, side) {
  const match = predictionRounds[roundIndex].matches[matchIndex];
  const winner = side === "home" ? match.home : match.away;

  if (!winner) return;

  match.winner = winner;

  const nextRound = predictionRounds[roundIndex + 1];

  if (nextRound) {
    const nextMatchIndex = Math.floor(matchIndex / 2);
    const nextSide = matchIndex % 2 === 0 ? "home" : "away";

    nextRound.matches[nextMatchIndex][nextSide] = winner;
  }

  for (let i = roundIndex + 1; i < predictionRounds.length - 1; i++) {
    predictionRounds[i].matches.forEach((m, idx) => {
      const autoWinner = pickWinner(m.home, m.away);
      m.winner = autoWinner;

      const nextRound = predictionRounds[i + 1];
      const nextMatchIndex = Math.floor(idx / 2);
      const nextSide = idx % 2 === 0 ? "home" : "away";

      if (nextRound?.matches?.[nextMatchIndex]) {
        nextRound.matches[nextMatchIndex][nextSide] = autoWinner;
      }
    });
  }

  renderPrediction();
  updatePredictionPanel();
}

function updatePredictionPanel() {
  const championBox = document.getElementById("predictedChampion");
  const oddsContainer = document.getElementById("championOdds");
  const analysis = document.getElementById("predictionAnalysis");

  const finalRound = predictionRounds[predictionRounds.length - 1];
  const champion = finalRound?.matches?.[0]?.winner;

  if (championBox) {
    championBox.textContent = champion
      ? `🏆 ${teamName(champion)}`
      : "Por definir";
  }

  const candidates = [...predictionTeams]
    .sort((a, b) => teamStrength(b) - teamStrength(a))
    .slice(0, 5)
    .map((team, index) => ({
      team,
      odds: Math.max(10, 38 - index * 5)
    }));

  if (oddsContainer) {
    oddsContainer.innerHTML = candidates.map(item => `
      <div class="odds-item">
        <div class="odds-row">
          <span>${teamName(item.team)}</span>
          <strong>${item.odds}%</strong>
        </div>
        <div class="odds-bar">
          <span style="width:${item.odds}%"></span>
        </div>
      </div>
    `).join("");
  }

  if (analysis) {
    analysis.textContent = champion
      ? `${teamName(champion)} aparece como campeón proyectado usando equipos ya presentes en llaves y clasificación actual.`
      : "El pronóstico se genera con los equipos definidos por la API y la tabla de grupos.";
  }
}

function resetPrediction() {
  predictionTeams = [];
  predictionRounds = [];

  const bracket = document.getElementById("predictionBracket");
  const champion = document.getElementById("predictedChampion");
  const odds = document.getElementById("championOdds");
  const analysis = document.getElementById("predictionAnalysis");

  if (bracket) {
    bracket.innerHTML = `<p class="muted">Haz clic en “Generar pronóstico automático” para crear tu llave.</p>`;
  }

  if (champion) champion.textContent = "Por definir";
  if (odds) odds.innerHTML = "";
  if (analysis) analysis.textContent = "El análisis se generará según tu pronóstico.";
}
function getRealKnockoutMatches(matches) {
  return matches
    .filter(match => match.stage === "LAST_32")
    .map(match => ({
      home: isValidTeam(match.homeTeam) ? match.homeTeam : null,
      away: isValidTeam(match.awayTeam) ? match.awayTeam : null,
      winner: null
    }))
    .filter(match => match.home || match.away);
}
