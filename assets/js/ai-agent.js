const chatMessages = document.getElementById("chatMessages");
const userQuestion = document.getElementById("userQuestion");
const sendQuestion = document.getElementById("sendQuestion");
const quickQuestions = document.querySelectorAll(".quick-questions button");

const agentKnowledge = {
  bestTeam: "Argentina",
  bestDefense: "Francia",
  bestPossession: "España",
  mostEfficient: "Francia",
  topScore: 91,
  avgGoals: 2.84
};

function addMessage(message, type = "bot") {
  const div = document.createElement("div");
  div.className = type === "user" ? "user-message" : "bot-message";
  div.textContent = message;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function analyzeQuestion(question) {
  const q = question.toLowerCase();

  if (q.includes("mejor equipo") || q.includes("mejor rendimiento")) {
    return `El equipo con mejor rendimiento es ${agentKnowledge.bestTeam}, con un Performance Score de ${agentKnowledge.topScore}/100. Su ventaja está en la combinación de ataque, conversión y consistencia durante las fases decisivas.`;
  }

  if (q.includes("defensa") || q.includes("defensivo")) {
    return `${agentKnowledge.bestDefense} presenta el mejor balance defensivo del torneo. Su fortaleza está en reducir oportunidades claras y mantener estabilidad incluso contra equipos de alta posesión.`;
  }

  if (q.includes("posesión") || q.includes("posesion")) {
    return `${agentKnowledge.bestPossession} domina la posesión promedio. Sin embargo, el dashboard muestra que controlar el balón no siempre significa mayor efectividad ofensiva.`;
  }

  if (q.includes("francia") && q.includes("argentina")) {
    return "Argentina supera a Francia en índice ofensivo y volumen de ataque. Francia, en cambio, destaca por solidez defensiva y eficiencia. El cruce sería muy equilibrado: Argentina tendría más iniciativa, pero Francia tendría mayor control del riesgo.";
  }

  if (q.includes("brasil") && q.includes("españa")) {
    return "Brasil muestra mayor explosividad ofensiva, mientras que España domina la posesión y la circulación. Si España no mejora conversión, Brasil tendría ventaja en transiciones rápidas.";
  }

  if (q.includes("efectivo") || q.includes("efectividad")) {
    return `${agentKnowledge.mostEfficient} es el equipo más efectivo porque transforma menos oportunidades en mayor impacto. Su eficiencia compensa un menor volumen ofensivo frente a equipos de posesión alta.`;
  }

  if (q.includes("goles") || q.includes("promedio")) {
    return `El torneo tiene un promedio de ${agentKnowledge.avgGoals} goles por partido. La fase de grupos concentra la mayor producción ofensiva y las fases finales reducen el margen táctico.`;
  }

  if (q.includes("insight") || q.includes("hallazgo")) {
    return "Insight clave: España domina la posesión, Argentina lidera el rendimiento ofensivo y Francia tiene el mejor balance defensa-efectividad. Esto muestra que el torneo no se decide solo por controlar el balón, sino por convertir oportunidades en momentos críticos.";
  }

  if (q.includes("campeón") || q.includes("campeon") || q.includes("favorito")) {
    return "Según el Performance Score, Argentina aparece como favorita por su equilibrio entre ataque, conversión y rendimiento decisivo. Francia sería el principal competidor por su solidez defensiva.";
  }

  return "Puedo ayudarte a analizar rendimiento, goles, posesión, defensa, efectividad, favoritos o comparaciones entre selecciones. Prueba con: ¿qué equipo tiene mejor rendimiento? o compara Argentina contra Francia.";
}

function sendUserQuestion(question) {
  if (!question.trim()) return;

  addMessage(question, "user");

  setTimeout(() => {
    const response = analyzeQuestion(question);
    addMessage(response, "bot");
  }, 450);

  userQuestion.value = "";
}

sendQuestion.addEventListener("click", () => {
  sendUserQuestion(userQuestion.value);
});

userQuestion.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendUserQuestion(userQuestion.value);
  }
});

quickQuestions.forEach((button) => {
  button.addEventListener("click", () => {
    const question = button.dataset.question;
    sendUserQuestion(question);
  });
});