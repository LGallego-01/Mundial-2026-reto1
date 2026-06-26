/* ===========================================
   WORLD CUP VISION 2026
   STATISTICS
=========================================== */

function statusOf(match) {
  if (match.status === "IN_PLAY" || match.status === "PAUSED") return "live";
  if (match.status === "FINISHED") return "finished";
  return "next";
}

function statusLabel(status) {
  if (getLanguage() === "en") {
    if (status === "live") return "LIVE";
    if (status === "finished") return "FINISHED";
    return "NEXT";
  }

  if (status === "live") return "EN VIVO";
  if (status === "finished") return "FINALIZADO";
  return "PRÓXIMO";
}

function renderStats(matches, teams) {
  const container = document.getElementById("statsPanel");
  if (!container) return;

  const finished = matches.filter(match => statusOf(match) === "finished");

  const goals = finished.reduce((total, match) => {
    return total + (match.score?.fullTime?.home || 0) + (match.score?.fullTime?.away || 0);
  }, 0);

  const averageGoals = finished.length ? (goals / finished.length).toFixed(2) : "0.00";

  container.innerHTML = `
    <article>
      <strong>${goals}</strong>
      <span>${getLanguage() === "es" ? "Goles totales" : "Total goals"}</span>
    </article>

    <article>
      <strong>${averageGoals}</strong>
      <span>${getLanguage() === "es" ? "Promedio de goles" : "Goals per match"}</span>
    </article>

    <article>
      <strong>${finished.length}</strong>
      <span>${getLanguage() === "es" ? "Partidos finalizados" : "Finished matches"}</span>
    </article>

    <article>
      <strong>${teams.length}</strong>
      <span>${getLanguage() === "es" ? "Selecciones" : "Teams"}</span>
    </article>
  `;
}
