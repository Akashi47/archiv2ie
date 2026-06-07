/**
 * ARCHIV2IE - CONFIGURATION & COMPOSANTS INTELLIGENTS
 * Script global de gestion et d'automatisation de l'affichage
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialisation des composants dynamiques globaux
    injecterComposantsPartages();
    configurerMenuMobile();
    configurerVerificateurLiensDrive();
    configurerFormulaireContribution();
});

/**
 * Injection automatique de la structure commune (Barre tricolore, Header et Footer)
 * Permet d'éviter le copier-coller de la navigation sur toutes les pages du projet.
 */
function injecterComposantsPartages() {
    // Détermination de la racine relative (selon si on est dans un sous-dossier ou non)
    const estDansSousDossier = window.location.pathname.includes('/cours/');
    const cheminRacine = estDansSousDossier ? '../../' : '';

    // HTML de la Barre de Navigation commune
    const gabaritHeader = `
        <div class="barre-tricolore">
            <div class="barre-tricolore__segment barre-tricolore__segment--gee"></div>
            <div class="barre-tricolore__segment barre-tricolore__segment--gc"></div>
            <div class="barre-tricolore__segment barre-tricolore__segment--geaah"></div>
        </div>
        <div class="nav-container">
            
            <a href="${cheminRacine}index.html" class="nav-logo">
                <img src="${cheminRacine}assets/img/logo-2ie.png" alt="Logo 2iE" style="height: 40px; width: auto; display: block; object-fit: contain;">
                
                <span class="nav-logo__texte">Archiv2iE</span>
            </a>

            <button class="hamburger" aria-label="Ouvrir le menu">
                <span class="hamburger__barre"></span>
                <span class="hamburger__barre"></span>
                <span class="hamburger__barre"></span>
            </button>
            
            <ul class="nav-menu">
                <li><a href="${cheminRacine}index.html" class="nav-menu__lien">Accueil</a></li>
                <li><a href="${cheminRacine}cours/tronc-commun.html" class="nav-menu__lien">Tronc Commun</a></li>
                <li class="nav-item--dropdown">
                    <a href="#" class="nav-menu__lien" onclick="return false;">Filières Spécialisées</a>
                    <ul class="dropdown-menu">
                        <li><a href="${cheminRacine}cours/gee/index.html" class="dropdown-menu__lien">Génie Électrique & Énergétique (GEE)</a></li>
                        <li><a href="${cheminRacine}cours/gc-btp/index.html" class="dropdown-menu__lien">Génie Civil & BTP (GC-BTP)</a></li>
                        <li><a href="${cheminRacine}cours/geaah/index.html" class="dropdown-menu__lien">Génie Eau, Assainissement & AH (GEAAH)</a></li>
                    </ul>
                </li>
                <li><a href="${cheminRacine}bibliotheque.html" class="nav-menu__lien">Bibliothèque</a></li>
                <li><a href="${cheminRacine}rapports.html" class="nav-menu__lien">Stages & PFE</a></li>
                <li><a href="${cheminRacine}a-propos.html" class="nav-menu__lien">À Propos</a></li>
                <li><a href="${cheminRacine}contribuer.html" class="nav-menu__lien btn-contribuer">Contribuer</a></li>
            </ul>
        </div>
    `;

    // Injection au sommet du header
    const elementHeader = document.getElementById("header-commun");
    if (elementHeader) {
        elementHeader.className = "site-header";
        elementHeader.innerHTML = gabaritHeader;
    }

    // Injection au niveau du footer
    const elementFooter = document.getElementById("footer-commun");
    if (elementFooter) {
        elementFooter.className = "site-footer";
        elementFooter.innerHTML = `<p>Archiv2iE © 2026 · Tous droits réservés</p>`;
    }
}

/**
 * Gestion du menu Hamburger pour les supports mobiles
 */
function configurerMenuMobile() {
    setTimeout(() => {
        const boutonHamburger = document.querySelector(".hamburger");
        const menuNavigation = document.querySelector(".nav-menu");

        if (boutonHamburger && menuNavigation) {
            boutonHamburger.addEventListener("click", () => {
                menuNavigation.classList.toggle("nav-menu--actif");
                
                const barres = boutonHamburger.querySelectorAll(".hamburger__barre");
                barres.forEach(barre => barre.classList.toggle("active"));
            });
        }
    }, 100);
}

/**
 * Sécurité & Redirection vers les dossiers Google Drive correspondants
 */
function configurerVerificateurLiensDrive() {
    const liensDrive = {
        "rapports-stage": "https://drive.google.com/drive/folders/1BlvVMKXNe9vtMIrDwi-rCikYBIWQ8Vfb?usp=drive_link",
        "rapports-pfe": "https://drive.google.com/drive/folders/1I2ZrQ3mFpQ4hwxV_5lbyESOrPsL4jAPS?usp=drive_link",
        "rapports-projets": "https://drive.google.com/drive/folders/1OxNcNcWlR4O18F2Eu-nrUeWZuwe0w46q?usp=drive_link",
        "guides-modeles": "https://drive.google.com/drive/folders/1_g4y4-HUjdwBVmmFZRkTmAfNaFoO2V3n?usp=drive_link",
        "tc-s1": "https://drive.google.com/drive/folders/19G4_BPndtxWuYFKImC-L4D3lK9VeG5P7?usp=drive_link",
        "tc-s2": "https://drive.google.com/drive/folders/1f6pkYf4SJljr1-IEkTIom3oSWv1Ej_Cm?usp=drive_link",
        "tc-s3": "https://drive.google.com/drive/folders/1YEHPWDjE1QGHu5gC1LRZqq4n77U9mzZe?usp=drive_link",
        "tc-s4": "https://drive.google.com/drive/folders/1czWqZdMmXPLF3nkr14qH7EeodfCpBSI-?usp=drive_link",
        "gc-s5d": "https://drive.google.com/drive/folders/1wE0PeGAmlXJ85UNzQmfRDjgAY9TUK58o?usp=drive_link",
        "gc-s5s": "https://drive.google.com/drive/folders/1-cXQVkpW7lwyttYJpSo_LTh3_1IY1ov_?usp=drive_link",
        "gc-s6d": "https://drive.google.com/drive/folders/1dOs0fNRD8N4C2WyNoa8wEUXtZu2SYprI?usp=drive_link",
        "gc-s6s": "https://drive.google.com/drive/folders/1Qsyd0g6CQCya-Ztuhhmw2l3Qjim6A87_?usp=drive_link",
        "gc-s7":  "https://drive.google.com/drive/folders/1F4kUemDLczada5B_-VylVYU_zySp1gDC?usp=drive_link",
        "gc-s8":  "https://drive.google.com/drive/folders/1SQBgV0dH9zaCH7Q6eIYyU0dO7X033kpM?usp=drive_link",
        "gc-op1": "https://drive.google.com/drive/folders/1pjf3eSoTye5fWCF2hS8JYJMLJYcJrsej?usp=drive_link",
        "gc-op2": "https://drive.google.com/drive/folders/1IDlwrkb9AXgmd6CQ49hH1rwsLdPjeBgE?usp=drive_link",
        "geaah-s5d": "https://drive.google.com/drive/folders/1BfLjbdz6MbcKe-LSpN0TpLfr82nZs2ys?usp=drive_link",
        "geaah-s5s": "https://drive.google.com/drive/folders/1XrrO5cNma_UGikZ1foYjLygGfIlJgtS?usp=drive_link",
        "geaah-s6d": "https://drive.google.com/drive/folders/1V4rHsZFw3h-qH4Zzx9cb59BmzW89dJ6p?usp=drive_link",
        "geaah-s6s": "https://drive.google.com/drive/folders/15ToT7XwuhyUXOsZYOkXQMayVzi1CuSwA?usp=drive_link",
        "geaah-s7":  "https://drive.google.com/drive/folders/1QPzu-CyTFHCDSIrt5ejV3RAWNo_8YaRY?usp=drive_link",
        "geaah-s8":  "https://drive.google.com/drive/folders/1Srzj7FfofuEWC03qxjFgFtuNUCEYKorB?usp=drive_link",
        "geaah-op1": "https://drive.google.com/drive/folders/1m6F4tr51l794-ISpeyQJX9svvu-lD_lC?usp=drive_link",
        "geaah-op2": "https://drive.google.com/drive/folders/1ZKRSz3eC9tGEnqdG-JK_pp49o_R2AA1A?usp=drive_link",
        "geaah-op3": "https://drive.google.com/drive/folders/1ZKRSz3eC9tGEnqdG-JK_pp49o_R2AA1A?usp=drive_link",
        "gee-s5d": "https://drive.google.com/drive/folders/1VoZW0tGkMamtWrFh3NIdwFbbjTttYWhy?usp=drive_link",
        "gee-s5s": "https://drive.google.com/drive/folders/1t-ysGz42J6mDFtYg0UnDWuf8_h1RWp6O?usp=drive_link",
        "gee-s6d": "https://drive.google.com/drive/folders/1PqNSPEFMN0gKDZqsCxCrhZUHyFf5GI_K?usp=drive_link",
        "gee-s6s": "https://drive.google.com/drive/folders/1PlhwTmhljtsE_22d4lIxS4AmJXCYNv-5?usp=drive_link",
        "gee-s7":  "https://drive.google.com/drive/folders/1FIuD6mq1ZfBnYgps0tmF8BfWxmXjSx8q?usp=drive_link",
        "gee-s8":  "https://drive.google.com/drive/folders/11iDH0xATNn4Q1Q4wf6zIjDfpxHuAkejJ?usp=drive_link",
        "gee-op1": "https://drive.google.com/drive/folders/105IhsVSJTISzpC5QupYgsHuFA9JMqlS_?usp=drive_link",
        "gee-op2": "https://drive.google.com/drive/folders/1jYavMbNRr3T8GS-2rq6tWEWVvlOWf72n?usp=drive_link"
    };

    document.addEventListener("click", (evenement) => {
        const cible = evenement.target.closest('a[data-drive="true"]');
        if (cible) {
            evenement.preventDefault();
            const cleDossier = cible.getAttribute("data-dossier");
            const urlDestination = liensDrive[cleDossier];

            if (urlDestination && urlDestination !== "") {
                window.open(urlDestination, "_blank");
            } else {
                alert(`📂 Le dossier Drive pour "${cible.textContent.trim()}" est en cours de centralisation.\nIl sera disponible très prochainement !`);
            }
        }
    });
}

/**
 * Gestion du formulaire de contribution
 */
function configurerFormulaireContribution() {
    const formulaire = document.getElementById("formulaire-contribution");
    const selectSemestre = document.getElementById("contrib-semestre");

    if (!formulaire || !selectSemestre) return;

    formulaire.addEventListener("submit", (evenement) => {
        evenement.preventDefault();
        const nom = document.getElementById("contrib-nom").value;
        const nomDoc = document.getElementById("contrib-nom-doc").value;

        alert("Merci pour votre contribution, " + nom + " !\n\nVotre document \"" + nomDoc + "\" sera examiné par l'équipe Archiv2iE avant d'être publié.\n\nEnsemble, on construit quelque chose de grand. 🚀");
        
        formulaire.reset();
        selectSemestre.disabled = true;
        selectSemestre.style.background = "#f5f5f5";
        selectSemestre.innerHTML = '<option value="">-- Choisissez d\'abord la filière --</option>';
    });
}

/**
 * Gestion de la mise à jour dynamique des semestres
 */
function actualiserListeSemestres(filiereSelectionnee) {
    const selectSemestre = document.getElementById("contrib-semestre");
    if (!selectSemestre) return;

    const optionsSemestres = {
        "tc": ["S1", "S2", "S3", "S4"],
        "gee": ["S5D", "S5S", "S6D", "S6S", "S7", "S8", "S9 - Énergies Renouvelables", "S9 - Réseaux Électriques"],
        "gc-btp": ["S5D", "S5S", "S6D", "S6S", "S7", "S8", "S9 - Bâtiment", "S9 - Transport"],
        "geaah": ["S5D", "S5S", "S6D", "S6S", "S7", "S8", "S9 - Approvisionnement en eau", "S9 - Assainissement", "S9 - Hydro-agricoles"]
    };

    selectSemestre.innerHTML = '<option value="">-- Sélectionnez le semestre/option --</option>';

    if (filiereSelectionnee && optionsSemestres[filiereSelectionnee]) {
        selectSemestre.disabled = false;
        selectSemestre.style.background = "#ffffff";
        
        optionsSemestres[filiereSelectionnee].forEach(sem => {
            const opt = document.createElement("option");
            opt.value = sem;
            opt.textContent = sem;
            selectSemestre.appendChild(opt);
        });
    } else {
        selectSemestre.disabled = true;
        selectSemestre.style.background = "#f5f5f5";
        selectSemestre.innerHTML = '<option value="">-- Choisissez d\'abord la filière --</option>';
    }
}
// On cible le formulaire avec son identifiant exact
const formulaire = document.getElementById('formulaire-contribution');

if (formulaire) {
    formulaire.addEventListener('submit', function(e) {
        e.preventDefault(); // On empêche le rechargement de la page
        
        // Effet visuel sur ton bouton pour faire patienter l'utilisateur
        const bouton = formulaire.querySelector('button[type="submit"]');
        const texteOrigine = bouton.innerHTML;
        bouton.innerHTML = "Envoi en cours... ⏳";
        bouton.disabled = true;

        // Récupération du fichier via son ID exact
        const champFichier = document.getElementById('contrib-fichier');
        const fichier = champFichier.files[0];

        if (!fichier) {
            alert("Veuillez sélectionner un fichier à envoyer.");
            bouton.innerHTML = texteOrigine;
            bouton.disabled = false;
            return;
        }

        // Lecture et conversion du document en Base64
        const reader = new FileReader();
        reader.readAsDataURL(fichier);
        
        reader.onload = function() {
            const base64Data = reader.result.split(',')[1];
            
            const filePayload = {
                filename: fichier.name,
                mimeType: fichier.type,
                bytes: base64Data
            };

            // Extraction des valeurs en utilisant tes vrais ID et balises boutons radios
            const vNom = document.getElementById('contrib-nom').value;
            const vEmail = document.getElementById('contrib-email').value;
            
            // Radio bouton pour le statut
            const rStatut = formulaire.querySelector('input[name="statut-user"]:checked');
            const vStatut = rStatut ? rStatut.value : "Non précisé";
            
            // Sélections textuelles des listes déroulantes
            const eFiliere = document.getElementById('contrib-filiere');
            const vFiliere = eFiliere.options[eFiliere.selectedIndex].text;
            
            const eSemestre = document.getElementById('contrib-semestre');
            const vSemestre = eSemestre.options[eSemestre.selectedIndex].text;
            
            const vNomDoc = document.getElementById('contrib-nom-doc').value;
            const vMatiere = document.getElementById('contrib-matiere').value;
            
            // Radio bouton pour le type de document
            const rType = formulaire.querySelector('input[name="type-doc"]:checked');
            const vType = rType ? rType.value : "Autre";
            
            const vCommentaire = document.getElementById('contrib-commentaire').value;

            // Construction de l'adresse de transmission vers ton Google Apps Script
            const urlScript = "https://script.google.com/macros/s/AKfycbyCsHpIQj_ncjj6Tjbvaz4xqoA6KbWBpXmR-D5TvAVdTAFgKZzXpjzhf0TaDY41J7Ol/exec"
                + "?nom=" + encodeURIComponent(vNom)
                + "&email=" + encodeURIComponent(vEmail)
                + "&statut=" + encodeURIComponent(vStatut)
                + "&filiere=" + encodeURIComponent(vFiliere)
                + "&semestre=" + encodeURIComponent(vSemestre)
                + "&typeDoc=" + encodeURIComponent(vType + " - " + vNomDoc)
                + "&matiere=" + encodeURIComponent(vMatiere)
                + "&commentaire=" + encodeURIComponent(vCommentaire || "Aucun");

            // Envoi transparent à l'infrastructure de ton Google Drive
            fetch(urlScript, {
                method: 'POST',
                body: JSON.stringify(filePayload)
            })
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    alert("Merci pour votre contribution ! Votre document a bien été reçu par l'équipe Archiv2iE.");
                    formulaire.reset(); // Nettoyage de la saisie
                    
                    // Si tu as une fonction JavaScript pour ré-initialiser l'état du sélecteur de semestre, appelle-la ici :
                    if (typeof actualiserListeSemestres === "function") {
                        document.getElementById('contrib-semestre').disabled = true;
                    }
                } else {
                    alert("Une petite erreur est survenue : " + result.message);
                }
            })
            .catch(error => {
                console.error("Erreur technique :", error);
                alert("Impossible de joindre le système. Vérifiez votre connexion internet.");
            })
            .finally(() => {
                // Restauration de l'état initial de ton magnifique bouton vert
                bouton.innerHTML = texteOrigine;
                bouton.disabled = false;
            });
        };
    });
}