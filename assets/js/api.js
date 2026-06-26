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

    try {

        const response = await fetch(`${API_URL}${endpoint}`);

        if (!response.ok) {

            throw new Error("Error consultando " + endpoint);

        }

        return await response.json();

    }

    catch(error){

        console.error(error);

        return null;

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

async function loadTournament(){

    const [

        matches,

        teams,

        standings

    ] = await Promise.all([

        getMatches(),

        getTeams(),

        getStandings()

    ]);

    return {

        matches,

        teams,

        standings

    };

}
