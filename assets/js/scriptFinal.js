//Variables globales
let iInterval;

let iLimiteMinX, iLimiteMaxX, iLimiteMinY, iLimiteMaxY;

const oJeu = {
    titre: "Mon jeu",
    largeur: (window.innerWidth * 2) / 3,
    hauteur: (window.innerHeight * 2) / 3,
    estFini: false,
    score: 0,
};

const oSons = {
    musique: new Audio("assets/audio/trameMusicale1.mp3"),
    sonCollision: new Audio("assets/audio/sonCollision.wav"),
    sonFin: new Audio("assets/audio/sonFin.wav"),
    sonGagnant: new Audio("assets/audio/sonGagnant.wav"),
};

const oArrierePlan1 = {
    srcImage: "assets/images/bg1.png",
    posX: 0,
    posY: 0,
    vitesse: 1,
};
const oArrierePlan2 = {
    srcImage: "assets/images/bg2.png",
    posX: 0,
    posY: 0,
    vitesse: 2,
};
const oArrierePlan3 = {
    srcImage: "assets/images/bg3.png",
    posX: 0,
    posY: 0,
    vitesse: 3,
};

let oImageFond1, oImageFond2, oImageFond3;

const oPersonnage = {
    srcImage: "assets/images/Death.png",
    animIndex: 0,
    animIndexMax: 5,
    posX: 0,
    posY: 0,
    largeur: 96,
    hauteur: 96,
    vies: 5,
    vitesse: 10,
};

let oImagePerso;
const nombreEnnemis = 5;

const ennemiModele = {
    srcImage: "assets/images/drone.png",
    posX: -10,
    posY: -10,
    largeur: 82,
    hauteur: 60,
    vitesse: 1,
};

const aEnnemis = [];

const bonusModele = {
    srcImage: "assets/images/btn-gris.png",
    posX: -10,
    posY: -10,
    largeur: 50,
    hauteur: 50,
    vitesse: 1,
};
const nombreBonus = 5;
const bonus = [];
let iTemps = 0;
//Éléments HTML
const oPanneauIntroHTML = document.querySelector("#introduction");
const oPanneauJeuHTML = document.querySelector("#jeu");
const oBoutonDemarrerHTML = document.querySelector("#bouton-demarrer");

const oCanvasHTML = document.querySelector("#monCanvas");
const oContexte = oCanvasHTML.getContext("2d");
oCanvasHTML.width = oJeu.largeur;
oCanvasHTML.height = oJeu.hauteur;

//Créer les médias nécessaires

//Fonctions
/**
 * Fonction d'initialisation appelée au chargement de la page
 */
function initialiser() {
    oBoutonDemarrerHTML.addEventListener("click", afficherJeu);
    afficherIntro();
}

/**
 * Fonction qui dessine les éléments du jeu
 */
function boucleJeu() {
    oContexte.clearRect(0, 0, oCanvasHTML.width, oCanvasHTML.height);

    dessinerArrierePlan(oArrierePlan1, oImageFond1);
    // dessinerArrierePlan(oArrierePlan2, oImageFond2);
    // dessinerArrierePlan(oArrierePlan3, oImageFond3);
    // dessinerPersonnage();
    animerSpriteSheet();
    dessinerEnnemis();
    dessinerBonus();

    afficherScore();

    detecterCollisionAvecObstacles(oPersonnage, aEnnemis);
    detecterCollisionAvecBonus(oPersonnage, bonus);
    iTemps++;
}

/**
 * Fonction qui crée un bonus
 */
function creerBonus() {
    let oNouveauBonus = Object.create(bonusModele);

    oNouveauBonus.image = new Image();
    oNouveauBonus.image.src = oNouveauBonus.srcImage;
    oNouveauBonus.posY = Math.floor(Math.random() * oCanvasHTML.height);
    oNouveauBonus.posX = oCanvasHTML.width + Math.floor(Math.random() * 1000);
    oNouveauBonus.vitesse = Math.floor(Math.random() * 4) + 2;

    bonus.push(oNouveauBonus);
}

function animerSpriteSheet() {
    console.log("patate", oPersonnage.animIndex);

    //Dessiner le sprite
    oContexte.drawImage(
        oImagePerso,
        oPersonnage.animIndex * oPersonnage.largeur,
        0,
        oPersonnage.largeur,
        oPersonnage.hauteur,
        oPersonnage.posX,
        oPersonnage.posY,
        oPersonnage.largeur,
        oPersonnage.hauteur
    );

    //Incrémenter le numéro du sprite
    if (iTemps % 5 == 0) {
        oPersonnage.animIndex++;
    }

    //Si on a atteint le dernier sprite, on revient au premier
    if (oPersonnage.animIndex > oPersonnage.animIndexMax) {
        oPersonnage.animIndex = 0;
    }
}
/**
 * Fonction qui crée un ennemi
 */
function creerEnnemi() {
    let oNouvelEnnemi = Object.create(ennemiModele);

    oNouvelEnnemi.image = new Image();
    oNouvelEnnemi.image.src = oNouvelEnnemi.srcImage;
    oNouvelEnnemi.posY = Math.floor(Math.random() * oCanvasHTML.height);
    oNouvelEnnemi.posX = oCanvasHTML.width + Math.floor(Math.random() * 600);
    oNouvelEnnemi.vitesse = Math.floor(Math.random() * 4) + 2;

    aEnnemis.push(oNouvelEnnemi);
}

//Fonction qui dessine l'arrière-plan. Permet de créer un effet de défilement
function dessinerArrierePlan(oArrierePlan, oImage) {
    oContexte.drawImage(oImage, oArrierePlan.posX, oArrierePlan.posY, oCanvasHTML.width, oCanvasHTML.height);
    oContexte.drawImage(
        oImage,
        oArrierePlan.posX + oCanvasHTML.width,
        oArrierePlan.posY,
        oCanvasHTML.width,
        oCanvasHTML.height
    );

    if (oArrierePlan.posX < 0 - oCanvasHTML.width) {
        oArrierePlan.posX = 0;
    } else {
        oArrierePlan.posX -= 1 * oArrierePlan.vitesse;
    }
}

//Fonction qui dessine le personnage
function dessinerPersonnage() {
    oContexte.drawImage(oImagePerso, oPersonnage.posX, oPersonnage.posY, oPersonnage.largeur, oPersonnage.hauteur);
}

//Fonction qui dessine les ennemis
function dessinerEnnemis() {
    for (let i = 0; i < aEnnemis.length; i++) {
        oContexte.drawImage(
            aEnnemis[i].image,
            aEnnemis[i].posX,
            aEnnemis[i].posY,
            aEnnemis[i].largeur,
            aEnnemis[i].hauteur
        );

        if (aEnnemis[i].posX < 0 - aEnnemis[i].largeur) {
            aEnnemis[i].posY = Math.floor(Math.random() * oCanvasHTML.height);
            aEnnemis[i].posX = oCanvasHTML.width + Math.floor(Math.random() * 100);
            aEnnemis[i].vitesse++;
        } else {
            aEnnemis[i].posX -= 1 * aEnnemis[i].vitesse;
        }
    }
}

//Fonction qui dessine les bonus
function dessinerBonus() {
    for (let i = 0; i < bonus.length; i++) {
        oContexte.drawImage(bonus[i].image, bonus[i].posX, bonus[i].posY, bonus[i].largeur, bonus[i].hauteur);

        if (bonus[i].posX < 0 - bonus[i].largeur) {
            bonus[i].posY = Math.floor(Math.random() * oCanvasHTML.height);
            bonus[i].posX = oCanvasHTML.width + Math.floor(Math.random() * 100);
            bonus[i].vitesse++;
        } else {
            bonus[i].posX -= 1 * bonus[i].vitesse;
        }
    }
}

//Fonction qui affiche le score du joueur
function afficherScore() {
    oContexte.font = "20px Arial";
    oContexte.fillStyle = "black";
    oContexte.fillText(`Score: ${oJeu.score} | Vies: ${oPersonnage.vies}`, 10, 30);
}

//Fonction qui détecte les touches du clavier et déplace le personnage
function onDetectionTouches(event) {
    // Vérifier si le jeu est en cours
    // Si le jeu est en cours, on peut déplacer le personnage
    if (oJeu.estFini == false) {
        let toucheClavier = event.key;

        // Traitement de la touche appuyée
        if (toucheClavier === "ArrowUp") {
            oPersonnage.posY = Math.max(oPersonnage.posY - 1 * oPersonnage.vitesse, iLimiteMinY);
        } else if (toucheClavier === "ArrowDown") {
            oPersonnage.posY = Math.min(oPersonnage.posY + 1 * oPersonnage.vitesse, iLimiteMaxY);
        } else if (toucheClavier === "ArrowLeft") {
            oPersonnage.posX = Math.max(oPersonnage.posX - 1 * oPersonnage.vitesse, iLimiteMinX);
        } else if (toucheClavier === "ArrowRight") {
            oPersonnage.posX = Math.min(oPersonnage.posX + 1 * oPersonnage.vitesse, iLimiteMaxX);
        }
    }
}

//Fonction qui détecte les collisions entre deux objets
function detecterCollision(personnage, objet) {
    //Si les deux objets se touchent, on retourne true
    //Sinon, on retourne false
    if (
        personnage.posX < objet.posX + objet.largeur &&
        personnage.posX + personnage.largeur > objet.posX &&
        personnage.posY < objet.posY + objet.hauteur &&
        personnage.posY + personnage.hauteur > objet.posY
    ) {
        return true;
    } else {
        return false;
    }
}

//Fonction qui détecte les collisions entre le personnage et les obstacles
function detecterCollisionAvecObstacles(personnage, obstacles) {
    let collisions = [];

    for (let i = 0; i < obstacles.length; i++) {
        if (detecterCollision(personnage, obstacles[i]) == true) {
            collisions.push(i);
            break;
        }
    }

    //On retire les bonus qui ont été touchés et on en crée de nouveaux
    if (collisions.length > 0) {
        for (let i = 0; i < collisions.length; i++) {
            obstacles.splice(collisions[i], 1);
            personnage.vies--;
            oSons.sonCollision.play();
            if (personnage.vies <= 0) {
                terminerJeu();
            } else {
                setTimeout(creerEnnemi, 1000 * i);
            }
        }
    }
}

//Fonction qui détecte les collisions entre le personnage et les bonus
function detecterCollisionAvecBonus(personnage, bonus) {
    let collisions = [];

    //On vérifie si le personnage touche un bonus
    for (let i = 0; i < bonus.length; i++) {
        if (detecterCollision(personnage, bonus[i]) == true) {
            collisions.push(i);
            break;
        }
    }

    //On retire les bonus qui ont été touchés et on en crée de nouveaux
    if (collisions.length > 0) {
        for (let i = 0; i < collisions.length; i++) {
            oJeu.score++;
            oSons.sonGagnant.play();

            if (oJeu.score % 5 == 0) {
                oPersonnage.vies++;
            }

            bonus.splice(collisions[i], 1);
            setTimeout(creerBonus, 1000 * i);
        }
    }
}

//Fonction qui affiche le panneau d'introduction
function afficherIntro() {
    oPanneauIntroHTML.classList.remove("invisible");
}

//Fonction qui affiche le panneau de jeu et démarre le jeu
function afficherJeu() {
    oPanneauIntroHTML.classList.add("invisible");
    oPanneauJeuHTML.classList.remove("invisible");

    setTimeout(demarrerJeu, 1000);
}

//Fonction qui démarre le jeu, crée les ennemis et les bonus, et démarre la boucle de jeu
function demarrerJeu() {
    for (let i = 0; i < nombreEnnemis; i++) {
        creerEnnemi();
    }

    for (let i = 0; i < nombreBonus; i++) {
        creerBonus();
    }

    oImageFond1 = new Image();
    oImageFond1.src = oArrierePlan1.srcImage;

    oImageFond2 = new Image();
    oImageFond2.src = oArrierePlan2.srcImage;

    oImageFond3 = new Image();
    oImageFond3.src = oArrierePlan3.srcImage;

    oImagePerso = new Image();
    oImagePerso.src = oPersonnage.srcImage;

    iLimiteMinX = 0;
    iLimiteMaxX = oCanvasHTML.width - oPersonnage.largeur;
    iLimiteMinY = 0;
    iLimiteMaxY = oCanvasHTML.height - oPersonnage.hauteur;

    oSons.musique.play();

    document.addEventListener("keydown", onDetectionTouches);
    iInterval = setInterval(boucleJeu, 1000 / 60);
}

//Fonction qui termine le jeu
function terminerJeu() {
    clearInterval(iInterval);
    oSons.sonFin.play();

    alert("Le jeu est terminé");
    setTimeout(recommencerJeu, 1000);
}

//Fonction qui recommence le jeu en rechargeant la page
function recommencerJeu() {
    document.location.reload();
}

//Au chargement de la page, on appelle la fonction initialiser lorsque tous les éléments HTML ont été chargés
window.addEventListener("load", initialiser);
