const teamData = {
  Argentina: {
    group: "A",
    score: 91,
    attack: 91,
    defense: 82,
    possession: 58,
    precision: 88,
    discipline: 81,
    efficiency: 90,
    risk: "Medio",
    goals: 18
  },
  Francia: {
    group: "B",
    score: 88,
    attack: 84,
    defense: 86,
    possession: 52,
    precision: 84,
    discipline: 86,
    efficiency: 88,
    risk: "Bajo",
    goals: 16
  },
  Brasil: {
    group: "C",
    score: 85,
    attack: 89,
    defense: 78,
    possession: 55,
    precision: 82,
    discipline: 76,
    efficiency: 84,
    risk: "Medio",
    goals: 15
  },
  España: {
    group: "D",
    score: 82,
    attack: 78,
    defense: 80,
    possession: 63,
    precision: 91,
    discipline: 83,
    efficiency: 76,
    risk: "Medio",
    goals: 13
  }
};

const phaseGoals = {
  all: [64, 48, 32, 20, 8],
  groups: [64, 0, 0, 0, 0],
  round16: [0, 48, 0, 0, 0],
  quarter: [0, 0, 32, 0, 0],
  semi: [0, 0, 0, 20, 0],
  final: [0, 0, 0, 0, 8]
};

let goalsChart;
let radarChart;
let attackDefenseChart;

document.addEventListener("DOMContentLoaded", () => {
  createGoalsChart("all");
  createRadarChart("Argentina");
  createAttackDefenseChart();

  document.getElementById("applyFilters").addEventListener("click", applyDashboardFilters);
  document.getElementById("teamA").addEventListener("change", updateComparator);
  document.getElementById("teamB").addEventListener("change", updateComparator);

  updateComparator();
});

function getFilteredTeams() {
  const selectedTeam = document.getElementById("filterTeam").value;
  const selectedGroup = document.getElementById("filterGroup").value;

  return Object.entries(teamData)
    .filter(([name, data]) => selectedTeam === "all" || name === selectedTeam)
    .filter(([_, data]) => selectedGroup === "all" || data.group === selectedGroup);
}

function applyDashboardFilters() {
  const selectedPhase = document.getElementById("filterPhase").value;
  const filteredTeams = getFilteredTeams();

  updateKpis(filteredTeams);
  updateRanking(filteredTeams);
  updateInsights(filteredTeams);
  updateExecutiveSummary(filteredTeams);

  const radarTeam = filteredTeams[0]?.[0] || "Argentina";
  createRadarChart(radarTeam);
  createGoalsChart(selectedPhase);
}

function updateKpis(filteredTeams) {
  const teams = filteredTeams.length ? filteredTeams : Object.entries(teamData);
  const totalGoals = teams.reduce((sum, [_, team]) => sum + team.goals, 0);
  const avgScore = Math.round(teams.reduce((sum, [_, team]) => sum + team.score, 0) / teams.length);
  const avgPossession = Math.round(teams.reduce((sum, [_, team]) => sum + team.possession, 0) / teams.length);
  const avgEfficiency = Math.round(teams.reduce((sum, [_, team]) => sum + team.efficiency, 0) / teams.length);

  document.getElementById("kpiMatches").textContent = teams.length * 3;
  document.getElementById("kpiGoals").textContent = totalGoals;
  document.getElementById("kpiAvgGoals").textContent = (totalGoals / Math.max(teams.length * 3, 1)).toFixed(2);
  document.getElementById("kpiEfficiency").textContent = `${avgEfficiency}%`;
  document.getElementById("kpiPossession").textContent = `${avgPossession}%`;
  document.getElementById("globalScore").textContent = avgScore;
}

function updateRanking(filteredTeams) {
  const ranking = document.getElementById("rankingList");
  const teams = filteredTeams.length ? filteredTeams : Object.entries(teamData);

  ranking.innerHTML = teams
    .sort((a, b) => b[1].score - a[1].score)
    .map(([name, data], index) => `
      <div>
        <span>${index + 1}. ${name}</span>
        <strong>${data.score}</strong>
      </div>
    `)
    .join("");
}

function updateInsights(filteredTeams) {
  const insights = document.getElementById("insightsList");
  const teams = filteredTeams.length ? filteredTeams : Object.entries(teamData);

  const bestAttack = [...teams].sort((a, b) => b[1].attack - a[1].attack)[0];
  const bestDefense = [...teams].sort((a, b) => b[1].defense - a[1].defense)[0];
  const bestPossession = [...teams].sort((a, b) => b[1].possession - a[1].possession)[0];

  insights.innerHTML = `
    <article>
      <strong>Insight ofensivo</strong>
      <p>${bestAttack[0]} lidera el índice ofensivo con ${bestAttack[1].attack}/100, mostrando alta capacidad de generación y conversión.</p>
    </article>

    <article>
      <strong>Insight defensivo</strong>
      <p>${bestDefense[0]} presenta la mejor solidez defensiva con ${bestDefense[1].defense}/100, reduciendo riesgos en fases críticas.</p>
    </article>

    <article>
      <strong>Insight táctico</strong>
      <p>${bestPossession[0]} domina la posesión con ${bestPossession[1].possession}%, aunque la posesión debe analizarse junto con efectividad.</p>
    </article>
  `;
}

function updateExecutiveSummary(filteredTeams) {
  const teams = filteredTeams.length ? filteredTeams : Object.entries(teamData);

  const leader = [...teams].sort((a, b) => b[1].score - a[1].score)[0];
  const defense = [...teams].sort((a, b) => b[1].defense - a[1].defense)[0];
  const possession = [...teams].sort((a, b) => b[1].possession - a[1].possession)[0];

  document.getElementById("executiveSummary").textContent =
    `${leader[0]} lidera el Performance Score del análisis seleccionado. ${defense[0]} destaca por solidez defensiva y ${possession[0]} domina la posesión. El filtro aplicado permite observar cómo cambia el balance competitivo del torneo.`;
}

function updateComparator() {
  const teamAName = document.getElementById("teamA").value;
  const teamBName = document.getElementById("teamB").value;

  const a = teamData[teamAName];
  const b = teamData[teamBName];

  document.getElementById("attackCompare").textContent = `${a.attack} / ${b.attack}`;
  document.getElementById("defenseCompare").textContent = `${a.defense} / ${b.defense}`;
  document.getElementById("possessionCompare").textContent = `${a.possession}% / ${b.possession}%`;
  document.getElementById("riskCompare").textContent = `${a.risk} / ${b.risk}`;

  const bars = document.querySelectorAll(".compare-bars i");
  bars[0].style.width = `${a.attack}%`;
  bars[1].style.width = `${a.defense}%`;
  bars[2].style.width = `${a.possession}%`;
  bars[3].style.width = a.risk === "Bajo" ? "25%" : a.risk === "Medio" ? "55%" : "85%";
}

function createGoalsChart(phase) {
  const ctx = document.getElementById("goalsByPhaseChart");
  if (!ctx) return;

  if (goalsChart) goalsChart.destroy();

  goalsChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Grupos", "Octavos", "Cuartos", "Semis", "Final"],
      datasets: [{
        label: "Goles",
        data: phaseGoals[phase] || phaseGoals.all,
        backgroundColor: ["#00e5ff", "#00f5a0", "#ffc857", "#ff5c7a", "#7c5cff"],
        borderRadius: 12
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#c7d8e8" }, grid: { color: "rgba(255,255,255,0.06)" } },
        y: { ticks: { color: "#c7d8e8" }, grid: { color: "rgba(255,255,255,0.06)" } }
      }
    }
  });
}

function createRadarChart(teamName) {
  const ctx = document.getElementById("performanceRadarChart");
  if (!ctx) return;

  if (radarChart) radarChart.destroy();

  const team = teamData[teamName];

  radarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Ataque", "Defensa", "Posesión", "Precisión", "Disciplina", "Efectividad"],
      datasets: [{
        label: teamName,
        data: [team.attack, team.defense, team.possession, team.precision, team.discipline, team.efficiency],
        backgroundColor: "rgba(0, 229, 255, 0.18)",
        borderColor: "#00e5ff",
        pointBackgroundColor: "#00f5a0"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#c7d8e8" } } },
      scales: {
        r: {
          angleLines: { color: "rgba(255,255,255,0.12)" },
          grid: { color: "rgba(255,255,255,0.12)" },
          pointLabels: { color: "#c7d8e8" },
          ticks: { color: "#c7d8e8", backdropColor: "transparent" }
        }
      }
    }
  });
}

function createAttackDefenseChart() {
  const ctx = document.getElementById("attackDefenseChart");
  if (!ctx) return;

  if (attackDefenseChart) attackDefenseChart.destroy();

  attackDefenseChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [{
        label: "Equipos",
        data: Object.entries(teamData).map(([name, team]) => ({
          x: team.defense,
          y: team.attack
        })),
        backgroundColor: "#ffc857",
        pointRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#c7d8e8" } } },
      scales: {
        x: {
          title: { display: true, text: "Defensa", color: "#c7d8e8" },
          ticks: { color: "#c7d8e8" },
          grid: { color: "rgba(255,255,255,0.06)" }
        },
        y: {
          title: { display: true, text: "Ataque", color: "#c7d8e8" },
          ticks: { color: "#c7d8e8" },
          grid: { color: "rgba(255,255,255,0.06)" }
        }
      }
    }
  });
}