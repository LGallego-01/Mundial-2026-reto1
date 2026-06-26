/* ===========================================
   WORLD CUP VISION 2026
   DASHBOARD
=========================================== */

let countdownTimer = null;

function getNextMatches(matches, limit = 3) {
  return matches
    .filter(match => statusOf(match) === "next")
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
    .slice(0, limit);
}

function renderDashboard(matches, teams) {
  const total = matches.length;
  const finished = matches.filter(match => statusOf(match) === "finished").length;
  const live = matches.filter(match => statusOf(match) === "live").length;

  setText("totalMatches", total);
  setText("finishedMatches", finished);
  setText("liveMatches", live);
  setText("totalTeams", teams.length);

  const nextMatches = getNextMatches(matches, 4);

  renderNextMatches(nextMatches);
  renderFeaturedMatches(matches);
}

function renderNextMatches(nextMatches) {

  const nextMatch = document.getElementById("nextMatch");
  const todayMatches = document.getElementById("todayMatches");

  if (!nextMatch || !todayMatches) return;

  if (!nextMatches.length) {

    nextMatch.textContent =
      getLanguage() === "es"
        ? "No hay próximos partidos"
        : "No upcoming matches";

    todayMatches.innerHTML = "";

    setText("countdown", "--:--:--");

    return;
  }

  // Partido principal
  nextMatch.innerHTML = `
      <strong>${teamName(nextMatches[0].homeTeam)}</strong>
      <span style="opacity:.7;"> vs </span>
      <strong>${teamName(nextMatches[0].awayTeam)}</strong>
  `;

  // Tarjetas inferiores
  todayMatches.innerHTML = nextMatches.map(match => `

      <div class="today-match">

          <strong>${teamName(match.homeTeam)}</strong>

          <div style="margin:8px 0;color:#bfe7ff;">
              VS
          </div>

          <strong>${teamName(match.awayTeam)}</strong>

          <div style="margin-top:12px;font-size:.9rem;opacity:.85;">
              ${localTime(match.utcDate)}
          </div>

      </div>

  `).join("");

  startCountdown(nextMatches[0].utcDate);

}

function startCountdown(dateValue) {
  if (countdownTimer) clearInterval(countdownTimer);

  function updateCountdown() {
    const diff = new Date(dateValue) - new Date();

    if (diff <= 0) {
      setText("countdown", "00:00:00");
      return;
    }

    const hours = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, "0");
    const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

    setText("countdown", `${hours}:${minutes}:${seconds}`);
  }

  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);
}

function renderFeaturedMatches(matches) {
  const container = document.getElementById("featuredMatches");
  if (!container) return;

  const featured = matches
    .filter(match => statusOf(match) !== "finished")
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
    .slice(0, 4);

  container.innerHTML = featured.map(matchCardCompact).join("") ||
    `<p class="muted">${getLanguage() === "es" ? "No hay partidos destacados." : "No featured matches."}</p>`;
}
