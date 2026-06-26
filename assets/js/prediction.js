/* ===========================================
   WORLD CUP VISION 2026
   PREDICTION
=========================================== */

let predictionTeams = [];
let predictionRounds = [];

function generatePrediction() {
  const matches = window.appState?.matches || [];

  const round32Matches = getRealKnockoutMatches(matches, "LAST_32");

  if (!round32Matches.length) {
    alert("Todavía no hay cruces reales suficientes para generar el pronóstico.");
    return;
  }

  predictionTeams = mergeUniqueTeams(
    round32Matches.flatMap(match => [match.home, match.away]).filter(Boolean)
  );

  predictionRounds = [
    {
      name: getLanguage() === "es" ? "Ronda de 32" : "Round of 32",
      matches: round32Matches
    },
    buildEmptyRound(getLanguage() === "es" ? "Octavos" : "Round of 16", 16),
    buildEmptyRound(getLanguage() === "es" ? "Cuartos" : "Quarter-finals", 8),
    buildEmptyRound(getLanguage() === "es" ? "Semifinal" : "Semi-finals", 4),
    buildEmptyRound(getLanguage() === "es" ? "Final" : "Final", 2)
  ];

  renderPrediction();
  updatePredictionPanel();
}

function getRealKnockoutMatches(matches, stage) {
  return matches
    .filter(match => match.stage === stage)
    .map(match => ({
      home: isValidTeam(match.homeTeam) ? match.homeTeam : null,
      away: isValidTeam(match.awayTeam) ? match.awayTeam : null,
      winner: null
    }))
    .filter(match => match.home || match.away);
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

function buildEmptyRound(name, slots) {
  const matches = [];

  for (let i = 0; i < slots; i += 2) {
    matches.push({
      home: null,
      away: null,
      winner: null
    });
  }

  return { name, matches };
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
    return `<div class="prediction-team empty"><span>Por definir</span><small>-</small></div>`;
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

  clearFollowingRounds(roundIndex + 1);

  renderPrediction();
  updatePredictionPanel();
}

function clearFollowingRounds(startRoundIndex) {
  for (let i = startRoundIndex; i < predictionRounds.length; i++) {
    predictionRounds[i].matches.forEach(match => {
      match.winner = null;
    });
  }

  for (let i = startRoundIndex + 1; i < predictionRounds.length; i++) {
    predictionRounds[i].matches.forEach(match => {
      match.home = null;
      match.away = null;
      match.winner = null;
    });
  }
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

  if (oddsContainer) {
    oddsContainer.innerHTML = `
      <p class="muted">
        El pronóstico se completa manualmente seleccionando ganadores ronda por ronda.
      </p>
    `;
  }

  if (analysis) {
    analysis.textContent = champion
      ? `${teamName(champion)} es tu campeón proyectado.`
      : "Selecciona los ganadores de cada cruce real para construir tu llave.";
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
