document.addEventListener("DOMContentLoaded", () => {
  if (typeof Chart === "undefined") {
    console.error("Chart.js no cargó");
    return;
  }

  createGoalsChart();
  createRadarChart();
  createAttackDefenseChart();
});

function createGoalsChart() {
  const ctx = document.getElementById("goalsByPhaseChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Grupos", "Octavos", "Cuartos", "Semis", "Final"],
      datasets: [{
        label: "Goles",
        data: [64, 48, 32, 20, 8],
        backgroundColor: ["#00e5ff", "#00f5a0", "#ffc857", "#ff5c7a", "#7c5cff"],
        borderRadius: 12
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { ticks: { color: "#c7d8e8" }, grid: { color: "rgba(255,255,255,0.06)" } },
        y: { ticks: { color: "#c7d8e8" }, grid: { color: "rgba(255,255,255,0.06)" } }
      }
    }
  });
}

function createRadarChart() {
  const ctx = document.getElementById("performanceRadarChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Ataque", "Defensa", "Posesión", "Precisión", "Disciplina", "Efectividad"],
      datasets: [{
        label: "Argentina",
        data: [91, 82, 76, 88, 81, 90],
        backgroundColor: "rgba(0, 229, 255, 0.18)",
        borderColor: "#00e5ff",
        pointBackgroundColor: "#00f5a0"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#c7d8e8" } }
      },
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

  new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [{
        label: "Equipos",
        data: [
          { x: 82, y: 91 },
          { x: 86, y: 88 },
          { x: 78, y: 85 },
          { x: 80, y: 82 },
          { x: 72, y: 79 }
        ],
        backgroundColor: "#ffc857",
        pointRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#c7d8e8" } }
      },
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