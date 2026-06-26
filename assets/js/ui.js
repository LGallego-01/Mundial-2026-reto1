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
  const value = String(stage || "").toUpperCase();

  const labels = {

    GROUP_STAGE: getLanguage() === "es" ? "Fase de grupos" : "Group Stage",
     
    LAST_32: getLanguage() === "es" ? "Ronda de 32" : "Round of 32",
    ROUND_OF_32: getLanguage() === "es" ? "Ronda de 32" : "Round of 32",

    LAST_16: getLanguage() === "es" ? "Octavos de final" : "Round of 16",
    ROUND_OF_16: getLanguage() === "es" ? "Octavos de final" : "Round of 16",

    QUARTER_FINALS: getLanguage() === "es" ? "Cuartos de final" : "Quarter-finals",
    QUARTER_FINAL: getLanguage() === "es" ? "Cuartos de final" : "Quarter-finals",

    SEMI_FINALS: getLanguage() === "es" ? "Semifinal" : "Semi-finals",
    SEMI_FINAL: getLanguage() === "es" ? "Semifinal" : "Semi-finals",

    THIRD_PLACE: getLanguage() === "es" ? "Tercer puesto" : "Third place",
    FINAL: getLanguage() === "es" ? "Final" : "Final"
  };

  return labels[value] || value.replaceAll("_", " ");
}
