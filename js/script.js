// ------------------------------------------------------------------
// Config : adresse de la personne qui reçoit l'enveloppe
// ------------------------------------------------------------------
const DESTINATAIRE_EMAIL = "biyongdelbrique@gmail.com";
// Config : ton adresse pour recevoir sa réponse
const ADRESSE_RETOUR_EMAIL = "ton-adresse@gmail.com";

const isReplyMode = new URLSearchParams(window.location.search).get("reply") === "1";

// ------------------------------------------------------------------
// Navigation entre les étapes
// ------------------------------------------------------------------
const stages = {
  envelope: document.getElementById("stage-envelope"),
  question: document.getElementById("stage-question"),
  plan: document.getElementById("stage-plan"),
  recap: document.getElementById("stage-recap"),
};

function goTo(stageName) {
  Object.values(stages).forEach((el) => el.classList.add("stage--hidden"));
  stages[stageName].classList.remove("stage--hidden");
}

// ------------------------------------------------------------------
// Étape 0 : ouvrir l'enveloppe
// ------------------------------------------------------------------
const envelope = document.getElementById("envelope");

envelope.addEventListener("click", () => {
  envelope.classList.add("is-open");
  setTimeout(() => goTo("question"), 650);
});

// ------------------------------------------------------------------
// Étape 1 : le bouton "Non" qui fuit
// ------------------------------------------------------------------
const btnNo = document.getElementById("btn-no");
const btnYes = document.getElementById("btn-yes");
const buttonRow = document.getElementById("buttonRow");
const taunt = document.getElementById("taunt");

const taunts = [
  "Tu me plais beaucoup, et j'aimerais qu'on soit plus que des amis.",
  "Essaie encore.",
  "Le \"Non\" n'a pas trop envie, on dirait.",
  "Tu peux courir après, si tu veux.",
  "Allez, sois honnête avec toi-même.",
  "Le \"Non\" est presque invisible maintenant.",
  "Il ne reste qu'une réponse possible.",
];

let dodgeCount = 0;
const maxDodges = taunts.length - 1;

function dodge() {
  if (dodgeCount >= maxDodges) return;
  dodgeCount++;

  const rect = btnNo.getBoundingClientRect();
  const margin = 16;
  const maxX = window.innerWidth - rect.width - margin;
  const maxY = window.innerHeight - rect.height - margin;

  const x = Math.max(margin, Math.random() * maxX);
  const y = Math.max(margin, Math.random() * maxY);

  btnNo.classList.add("is-fleeing");
  btnNo.style.left = `${x}px`;
  btnNo.style.top = `${y}px`;

  // Le "Non" rétrécit et le "Oui" grandit un peu à chaque tentative
  const shrink = Math.max(0.4, 1 - dodgeCount * 0.09);
  btnNo.style.fontSize = `${15 * shrink}px`;
  btnNo.style.opacity = `${Math.max(0.35, shrink)}`;
  btnYes.style.transform = `scale(${1 + dodgeCount * 0.035})`;

  taunt.textContent = taunts[Math.min(dodgeCount, maxDodges)];
}

btnNo.addEventListener("mouseover", dodge);
btnNo.addEventListener("touchstart", (e) => { e.preventDefault(); dodge(); }, { passive: false });
btnNo.addEventListener("click", (e) => { e.preventDefault(); dodge(); });

btnYes.addEventListener("click", () => {
  goTo("plan");
});

// ------------------------------------------------------------------
// Étape 2 : formulaire du plan
// ------------------------------------------------------------------
const planForm = document.getElementById("planForm");
let lastPlan = null;

planForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(planForm);
  lastPlan = {
    name: (data.get("name") || "").trim() || "Toi",
    date: data.get("date"),
    time: data.get("time"),
    place: data.get("place"),
    message: (data.get("message") || "").trim(),
  };

  fillRecap(lastPlan);
  goTo("recap");
});

// ------------------------------------------------------------------
// Étape 3 : récapitulatif + ouverture de Gmail
// ------------------------------------------------------------------
function formatDate(iso) {
  if (!iso) return "à définir";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

function fillRecap(plan) {
  document.getElementById("recapName").textContent = plan.name;
  document.getElementById("recapWhen").textContent =
    `${formatDate(plan.date)}${plan.time ? " à " + plan.time : ""}`;
  document.getElementById("recapWhere").textContent = plan.place;

  const msgRow = document.getElementById("recapMsgRow");
  if (plan.message) {
    document.getElementById("recapMsg").textContent = plan.message;
    msgRow.style.display = "";
  } else {
    msgRow.style.display = "none";
  }

  let recipient;
  let subject;
  let body;
  const mailBtn = document.getElementById("mailBtn");

  if (isReplyMode) {
    recipient = ADRESSE_RETOUR_EMAIL;
    subject = encodeURIComponent(`${plan.name} a répondu à ton enveloppe ❤️`);
    body = encodeURIComponent(
      `Coucou !\n\n` +
      `J'ai ouvert ton enveloppe et je te réponds avec plaisir : oui ! ❤️\n\n` +
      `Pour notre premier moment à deux :\n` +
      `Date : ${formatDate(plan.date)}\n` +
      `Heure : ${plan.time || "à définir"}\n` +
      `Notre idée : ${plan.place}\n` +
      (plan.message ? `\nMon petit mot : ${plan.message}\n` : "") +
      `\nÀ très vite !`
    );
    mailBtn.textContent = "Envoyer ma réponse par Gmail";
  } else {
    recipient = DESTINATAIRE_EMAIL;
    subject = encodeURIComponent("Une petite enveloppe pour toi ❤️");
    const invitationUrl = new URL(window.location.href);
    invitationUrl.searchParams.set("reply", "1");
    invitationUrl.hash = "";
    body = encodeURIComponent(
      `Coucou ${plan.name} !\n\n` +
      `Je t'envoie une petite enveloppe avec une question importante...\n` +
      `Ouvre-la ici : ${invitationUrl.toString()}\n\n` +
      `J'espère que tu souriras en la découvrant. ❤️\n\n` +
      `À très vite !`
    );
    mailBtn.textContent = "Envoyer l'enveloppe par Gmail";
  }

  mailBtn.href =
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${subject}&body=${body}`;
}
