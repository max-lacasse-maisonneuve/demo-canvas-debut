// === Variables globales

// === Sélections HTML
const oBtnDemarrer = document.querySelector("#bouton-demarrer");
const oSectionIntro = document.querySelector("#introduction");
const oSectionJeu = document.querySelector("#jeu");

// === Fonctions
// Fonction appelée au chargement de la page
function initialisation() {
    oBtnDemarrer.addEventListener("click", demarrerJeu);
}

function demarrerJeu() {
    // Cacher la section d'introduction
    // Afficher la section du jeu
    oSectionIntro.classList.add("invisible");
    oSectionJeu.classList.remove("invisible");
}

// === Exécution
window.addEventListener("load", initialisation);
