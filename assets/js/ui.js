/* ===========================================
   WORLD CUP VISION 2026
   UI
=========================================== */

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function showSection(id) {
  document.querySelectorAll(".panel").forEach(panel => {
    panel.classList.remove("active");
  });

  document.getElementById(id)?.classList.add("active");

  document.querySelectorAll(".menu button").forEach(button => {
    button.classList.remove("active");
  });

  const activeButton = [...document.querySelectorAll(".menu button")]
    .find(button => button.getAttribute("onclick")?.includes(id));

  if (activeButton) activeButton.classList.add("active");
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function localTime(dateValue) {
  if (!dateValue) return getLanguage() === "es" ? "Horario por definir" : "Time TBD";

  return new Date(dateValue).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function formatStage(stage) {
  const labels = {
    LAST_32: getLanguage() === "es" ? "Ronda de 32" : "Round of 32",
    LAST_16: getLanguage() === "es" ? "Octavos de final" : "Round of 16",
    QUARTER_FINALS: getLanguage() === "es" ? "Cuartos de final" : "Quarter-finals",
    SEMI_FINALS: getLanguage() === "es" ? "Semifinal" : "Semi-finals",
    THIRD_PLACE: getLanguage() === "es" ? "Tercer puesto" : "Third place",
    FINAL: getLanguage() === "es" ? "Final" : "Final"
  };

  return labels[stage] || String(stage || "Llave").replaceAll("_", " ");
}
