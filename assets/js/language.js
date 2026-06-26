/* ===========================================
   WORLD CUP VISION 2026
   LANGUAGE
=========================================== */

let currentLanguage = "es";

const teamTranslations = {
  Germany: "Alemania",
  Ecuador: "Ecuador",
  Scotland: "Escocia",
  Mexico: "México",
  "South Africa": "Sudáfrica",
  "South Korea": "Corea del Sur",
  Czechia: "República Checa",
  "United States": "Estados Unidos",
  Brazil: "Brasil",
  Spain: "España",
  England: "Inglaterra",
  Netherlands: "Países Bajos",
  Switzerland: "Suiza",
  "Ivory Coast": "Costa de Marfil",
  "Saudi Arabia": "Arabia Saudita",
  "Cape Verde": "Cabo Verde",
  "Cape Verde Islands": "Cabo Verde",
  "Bosnia-H.": "Bosnia-Herzegovina",
  Morocco: "Marruecos",
  France: "Francia",
  Belgium: "Bélgica",
  Egypt: "Egipto",
  Japan: "Japón",
  Sweden: "Suecia",
  Tunisia: "Túnez",
  Norway: "Noruega",
  Portugal: "Portugal",
  Colombia: "Colombia",
  Argentina: "Argentina",
  Uruguay: "Uruguay",
  Canada: "Canadá",
  Australia: "Australia",
  Turkey: "Turquía",
  Curaçao: "Curazao",
  Qatar: "Catar",
  Paraguay: "Paraguay",
  Haiti: "Haití",
  Iran: "Irán",
  "New Zealand": "Nueva Zelanda",
  Iraq: "Irak",
  Jordan: "Jordania",
  Austria: "Austria",
  Algeria: "Argelia",
  Senegal: "Senegal",
  Ghana: "Ghana",
  Panama: "Panamá",
  Croatia: "Croacia",
  "DR Congo": "RD Congo",
  Uzbekistan: "Uzbekistán"
};

function setLanguage(value) {
  currentLanguage = value || "es";
}

function getLanguage() {
  return currentLanguage;
}

function teamName(team) {
  if (!team) return currentLanguage === "es" ? "Por definir" : "TBD";

  const shortName = team.shortName || "";
  const fullName = team.name || "";
  const tla = team.tla || "";

  if (currentLanguage === "es") {
    return (
      teamTranslations[shortName] ||
      teamTranslations[fullName] ||
      teamTranslations[tla] ||
      shortName ||
      fullName ||
      "Por definir"
    );
  }

  return shortName || fullName || "TBD";
}

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
