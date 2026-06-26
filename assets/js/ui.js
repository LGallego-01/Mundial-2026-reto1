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
  return String(stage || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase());
}
