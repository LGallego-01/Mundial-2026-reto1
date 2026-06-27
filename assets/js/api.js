/* ===========================================
   WORLD CUP VISION 2026
   API
=========================================== */

const API_URL = "https://mundial2026reto1.quinterolila03.workers.dev";

/*
===========================================
Consulta un endpoint del Worker
===========================================
*/

async function apiGet(endpoint) {
  const url = `${API_URL}${endpoint}`;
  const cacheKey = `cache_${endpoint}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Guarda última versión buena
    localStorage.setItem(cacheKey, JSON.stringify(data));

    return data;

  } catch (error) {
    console.warn("API caída, usando caché:", endpoint, error);

    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    throw error;
  }
}

/*
===========================================
Partidos
===========================================
*/

async function getMatches(){

    const data = await apiGet("/matches");

    return data?.matches || [];

}

/*
===========================================
Equipos
===========================================
*/

async function getTeams(){

    const data = await apiGet("/teams");

    return data?.teams || [];

}

/*
===========================================
Grupos
===========================================
*/

async function getStandings(){

    const data = await apiGet("/standings");

    return data?.standings || [];

}

/*
===========================================
Carga completa
===========================================
*/

async function loadTournament() {
  try {
    const [matches, teams, standings] = await Promise.all([
      getMatches(),
      getTeams(),
      getStandings()
    ]);

    return {
      matches: matches || [],
      teams: teams || [],
      standings: standings || []
    };

  } catch (error) {
    console.error("No se pudo cargar torneo ni caché:", error);

    return {
      matches: [],
      teams: [],
      standings: []
    };
  }
}
