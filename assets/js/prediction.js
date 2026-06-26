/* ===========================================
   WORLD CUP VISION 2026
   PREDICTION
=========================================== */

let predictionTeams = [];
let predictionRounds = [];

function generatePrediction() {
  if (!window.appState?.teams?.length) {
    alert("Primero carga los datos del torneo.");
    return;
  }

  predictionTeams = [...window.appState.teams]
    .sort(() => Math.random() - 0.5)
    .slice(0, 32);

  predictionRounds = [
    buildRound("Ronda de 32", predictionTeams),
    buildEmptyRound("Octavos", 16),
    buildEmptyRound("Cuartos", 8),
    buildEmptyRound("Semifinal", 4),
    buildEmptyRound("Final", 2)
  ];

  renderPrediction();
  updatePredictionPanel();
}

function buildRound(name, teams) {
  const matches = [];

  for (let i = 0; i < teams.length; i += 2) {
    matches.push({
      home: teams[i],
      away: teams[i + 1],
      winner: null
    });
  }

  return { name, matches };
}

function buildEmptyRound(name, slots) {
  const teams = Array.from({ length: slots }, () => null);
  return buildRound(name, teams);
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

  const candidates = predictionTeams.slice(0, 5).map((team, index) => ({
    team,
    odds: Math.max(12, 38 - index * 5)
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
      ? `${teamName(champion)} aparece como campeón proyectado según tu llave personalizada.`
      : "Selecciona ganadores ronda por ronda para construir tu pronóstico.";
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
