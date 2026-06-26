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

  const nextMatches = getNextMatches(matches, 3);

  renderNextMatches(nextMatches);
  renderFeaturedMatches(matches);
}

function renderNextMatches(nextMatches) {
  const nextMatch = document.getElementById("nextMatch");

  if (!nextMatch) return;

  if (!nextMatches.length) {
    nextMatch.innerHTML = getLanguage() === "es"
      ? "No hay próximos partidos"
      : "No upcoming matches";

    setText("countdown", "--:--:--");
    return;
  }

  nextMatch.innerHTML = nextMatches.map(match => `
    <div class="next-match-line">
      <strong>${teamName(match.homeTeam)}</strong>
      <span>vs</span>
      <strong>${teamName(match.awayTeam)}</strong>
      <small>${localTime(match.utcDate)}</small>
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
