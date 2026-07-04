import { Subject, CourseCategory, FiliereData } from './types';

export const driveLinks: Record<string, string> = {
  "maths": "https://drive.google.com/drive/folders/1bzCJFDkE8TgHboS7j_Fb9V8hQPs7sbG6?usp=drive_link",
  "hydraulique": "https://drive.google.com/drive/folders/1o3H20jmfyknqpRiBHdIr4Kfzb4Q2ZLLK?usp=drive_link",
  "structures": "https://drive.google.com/drive/folders/1VipaXOLVzsboPvqDIURTfxBc_T8Go-Gu?usp=drive_link",
  "electricite": "https://drive.google.com/drive/folders/1vxJjBZ3RWn4rXxP3HRrCKJD5T9CQWfK5?usp=drive_link",
  "environnement": "https://drive.google.com/drive/folders/16kGTSON3VM00fgO7yHSw-Crd_Invwl2E?usp=drive_link",
  "topo": "https://drive.google.com/drive/folders/1qHREb9syoYHnP8SDe3fNB0doqYVlfyIg?usp=drive_link",
  "gestion": "https://drive.google.com/drive/folders/1ogXJra52xgtYmpJzdGvK-Jqb7i648-hz?usp=drive_link",
  "outils": "https://drive.google.com/drive/folders/1Fit1ZhawLmkbBpwykFl4XdTA5Byiat01?usp=drive_link",
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

// Tronc Commun S1-S4 subjects
export const s1Subjects: Subject[] = [
  { name: "Algèbre 1", type: "Mathématiques", driveKey: "tc-s1" },
  { name: "Analyse 1", type: "Mathématiques", driveKey: "tc-s1" },
  { name: "Anglais 1", type: "Langues", driveKey: "tc-s1" },
  { name: "Apprendre/se former IA", type: "Méthodologie", driveKey: "tc-s1" },
  { name: "Biologie", type: "Sciences de la vie", driveKey: "tc-s1" },
  { name: "Chimie générale", type: "Sciences physiques", driveKey: "tc-s1" },
  { name: "Dessin Technique 1", type: "Ingénierie", driveKey: "tc-s1" },
  { name: "Electricité appliquée", type: "Électricité", driveKey: "tc-s1" },
  { name: "Electricité générale", type: "Électricité", driveKey: "tc-s1" },
  { name: "Mécanique des fluides", type: "Hydraulique & Fluides", driveKey: "tc-s1" },
  { name: "Mécanique du solide", type: "Physique", driveKey: "tc-s1" },
  { name: "Mécanique générale", type: "Physique", driveKey: "tc-s1" },
  { name: "Organisation du travail étudiant", type: "Méthodologie", driveKey: "tc-s1" },
  { name: "Outils de la réussite", type: "Méthodologie", driveKey: "tc-s1" },
  { name: "Outils informatiques 1", type: "Informatique", driveKey: "tc-s1" },
  { name: "Structure et propriétés matières", type: "Sciences des matériaux", driveKey: "tc-s1" },
  { name: "Topographie 1", type: "Géomatique", driveKey: "tc-s1" }
];

export const s2Subjects: Subject[] = [
  { name: "Algèbre 2", type: "Mathématiques", driveKey: "tc-s2" },
  { name: "Analyse 2", type: "Mathématiques", driveKey: "tc-s2" },
  { name: "Anglais 2", type: "Langues", driveKey: "tc-s2" },
  { name: "Calcul numérique", type: "Informatique & Mathématiques", driveKey: "tc-s2" },
  { name: "Dessin Technique 2", type: "Ingénierie", driveKey: "tc-s2" },
  { name: "Géologie pour ingénieurs", type: "Sciences de la terre", driveKey: "tc-s2" },
  { name: "Hydraulique à surface libre", type: "Hydraulique", driveKey: "tc-s2" },
  { name: "Hydraulique en charge", type: "Hydraulique", driveKey: "tc-s2" },
  { name: "Mécanique des fluides", type: "Hydraulique & Fluides", driveKey: "tc-s2" },
  { name: "Outils informatiques 2", type: "Informatique", driveKey: "tc-s2" },
  { name: "Recherche documentaire 2", type: "Méthodologie", driveKey: "tc-s2" },
  { name: "Résistance des matériaux 1", type: "Ingénierie des structures", driveKey: "tc-s2" },
  { name: "Structure propriétés matières S2", type: "Sciences des matériaux", driveKey: "tc-s2" },
  { name: "Techniques d'expression écrite", type: "Communication", driveKey: "tc-s2" },
  { name: "Topographie 2", type: "Géomatique", driveKey: "tc-s2" }
];

export const s3Subjects: Subject[] = [
  { name: "Analyse 2", type: "Mathématiques", driveKey: "tc-s3" },
  { name: "Analyse 3", type: "Mathématiques", driveKey: "tc-s3" },
  { name: "Analyse fonctionnelle", type: "Mathématiques", driveKey: "tc-s3" },
  { name: "Anglais 3", type: "Langues", driveKey: "tc-s3" },
  { name: "Comptabilité de gestion", type: "Management", driveKey: "tc-s3" },
  { name: "Comptabilité générale", type: "Management", driveKey: "tc-s3" },
  { name: "Dessin Assisté par Ordinateur", type: "Informatique & Conception", driveKey: "tc-s3" },
  { name: "Géométrie vectorielle", type: "Mathématiques", driveKey: "tc-s3" },
  { name: "L'entreprise et son environnement", type: "Management", driveKey: "tc-s3" },
  { name: "Liaisons et transmission", type: "Ingénierie", driveKey: "tc-s3" },
  { name: "Mécanique des sols 1", type: "Géotechnique", driveKey: "tc-s3" },
  { name: "Méthodes numériques 1", type: "Informatique & Mathématiques", driveKey: "tc-s3" },
  { name: "Projet professionnel", type: "Méthodologie", driveKey: "tc-s3" },
  { name: "Recherche opérationnelle", type: "Mathématiques appliquées", driveKey: "tc-s3" },
  { name: "Résistance des matériaux 2", type: "Ingénierie des structures", driveKey: "tc-s3" },
  { name: "Topographie 3", type: "Géomatique", driveKey: "tc-s3" }
];

export const s4Subjects: Subject[] = [
  { name: "Algorithmique et programmation", type: "Informatique", driveKey: "tc-s4" },
  { name: "Alimentation énergétique pompes", type: "Énergie", driveKey: "tc-s4" },
  { name: "Anglais 4", type: "Langues", driveKey: "tc-s4" },
  { name: "Automatisme", type: "Électricité", driveKey: "tc-s4" },
  { name: "Base de données", type: "Informatique", driveKey: "tc-s4" },
  { name: "Electronique", type: "Électricité", driveKey: "tc-s4" },
  { name: "Etudes de faisabilité", type: "Management", driveKey: "tc-s4" },
  { name: "Innovation et créativité", type: "Méthodologie", driveKey: "tc-s4" },
  { name: "Installation électrique", type: "Électricité", driveKey: "tc-s4" },
  { name: "Méthodes numériques 2", type: "Informatique & Mathématiques", driveKey: "tc-s4" },
  { name: "Probabilités et statistique", type: "Mathématiques", driveKey: "tc-s4" },
  { name: "SIG 1", type: "Géomatique", driveKey: "tc-s4" },
  { name: "Technologie de pompe", type: "Hydraulique", driveKey: "tc-s4" },
  { name: "Théorie des pompes", type: "Hydraulique", driveKey: "tc-s4" },
  { name: "Thermodynamique", type: "Physique", driveKey: "tc-s4" },
  { name: "Transfert thermique", type: "Physique", driveKey: "tc-s4" }
];

// Bibliotheque Category Map
export const libraryCategories: CourseCategory[] = [
  {
    id: "maths",
    title: "📐 Mathématiques & Info",
    description: "Algèbre linéaire, équations aux dérivées partielles (EDP), programmation et scripts numériques de calcul.",
    iconName: "Calculator",
    driveKey: "maths"
  },
  {
    id: "hydraulique",
    title: "💧 Hydraulique & Hydrologie",
    description: "Écoulements en charge, hydraulique à surface libre, modélisation hydrologique et écoulements fluviaux.",
    iconName: "Droplet",
    driveKey: "hydraulique"
  },
  {
    id: "structures",
    title: "🏗️ Structures & Géotechnique",
    description: "Résistance des matériaux (RDM), règles de calcul BAEL et Eurocodes 2, 3 et 7, mécanique des sols.",
    iconName: "HardHat",
    driveKey: "structures"
  },
  {
    id: "electricite",
    title: "⚡ Énergie & Électricité",
    description: "Génie électrique, systèmes solaires photovoltaïques, smart grids et machines électriques tournantes.",
    iconName: "Zap",
    driveKey: "electricite"
  },
  {
    id: "environnement",
    title: "🌿 Environnement & Assainissement",
    description: "Normes environnementales ISO, études d'impact environnemental (EIES), traitement des boues et des déchets.",
    iconName: "Leaf",
    driveKey: "environnement"
  },
  {
    id: "topo",
    title: "🗺️ Topographie & SIG",
    description: "Systèmes d'information géographique (QGIS), télédétection spatiale et traitement des données géomatiques.",
    iconName: "Map",
    driveKey: "topo"
  },
  {
    id: "gestion",
    title: "📈 Gestion & Management",
    description: "Comptabilité analytique, économie de projet d'ingénierie et suivi organisationnel de chantiers.",
    iconName: "TrendingUp",
    driveKey: "gestion"
  },
  {
    id: "outils",
    title: "🛠️ Liens & Outils utiles",
    description: "Utilitaires de calcul rapide de structures, fiches Excel automatisées de dimensionnement, tables de calcul.",
    iconName: "Wrench",
    driveKey: "outils"
  }
];

// Branches (Filieres) details
export const filieresData: FiliereData[] = [
  {
    key: "gee",
    name: "GEE",
    fullName: "Génie Électrique et Énergétique",
    colorClass: "bg-gee text-white hover:bg-red-800",
    textClass: "text-gee",
    bgClass: "bg-red-50",
    borderClass: "border-red-200",
    badgeClass: "bg-red-100 text-red-800",
    quote: "Dans un monde qui brûle ses dernières réserves fossiles, l'ingénieur GEE est celui qui allume une autre lumière.",
    semesters: [
      { key: "S5D", title: "Semestre 5 — Parcours D", description: "Bases de l'électrotechnique, circuits électriques et intégration post-BTS.", driveKey: "gee-s5d" },
      { key: "S5S", title: "Semestre 5 — Parcours S", description: "Électromagnétisme fondamental, thermodynamique appliquée et physique de l'ingénieur.", driveKey: "gee-s5s" },
      { key: "S6D", title: "Semestre 6 — Parcours D", description: "Harmonisation des notions de machines électriques tournantes et automatique.", driveKey: "gee-s6d" },
      { key: "S6S", title: "Semestre 6 — Parcours S", description: "Traitement de signal, commande analogique et électronique de puissance.", driveKey: "gee-s6s" },
      { key: "S7", title: "Semestre 7", description: "Turbomachines, conversion d'énergie, réseaux électriques équilibrés et déséquilibrés.", driveKey: "gee-s7" },
      { key: "S8", title: "Semestre 8", description: "Économie énergétique de marché, régulation numérique et commande avancée des machines.", driveKey: "gee-s8" }
    ],
    options: [
      {
        title: "🌱 Option 1 : Énergies Renouvelables (S9)",
        description: "Dimensionnement solaire photovoltaïque, solaire thermique, biomasse et réseaux électriques hybrides intelligents.",
        driveKey: "gee-op1",
        subjects: ["Génie Solaire PV & Thermique", "Modélisation des gisements éoliens", "Biomasse & Bioénergies", "Optimisation des Smart Grids"]
      },
      {
        title: "⚡ Option 2 : Réseaux Électriques (S9)",
        description: "Calcul de stabilité dynamique des réseaux, haute tension, protections numériques industrielles et distribution.",
        driveKey: "gee-op2",
        subjects: ["Lignes Haute Tension & Postes de transformation", "Relais de protection numérique", "Stabilité transitoire des alternateurs", "Qualité de l'onde électrique"]
      }
    ]
  },
  {
    key: "gc-btp",
    name: "GC-BTP",
    fullName: "Génie Civil — Bâtiment et Travaux Publics",
    colorClass: "bg-gc text-white hover:bg-amber-700",
    textClass: "text-gc",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
    badgeClass: "bg-amber-100 text-amber-800",
    quote: "Avant qu'une route existe, elle a d'abord existé dans la tête d'un ingénieur GC.",
    semesters: [
      { key: "S5D", title: "Semestre 5 — Parcours D", description: "Bases du calcul structural, RDM appliquée et initiation Eurocodes/BAEL.", driveKey: "gc-s5d" },
      { key: "S5S", title: "Semestre 5 — Parcours S", description: "Mécanique des milieux continus (MMC), mathématiques de l'ingénieur et structures.", driveKey: "gc-s5s" },
      { key: "S6D", title: "Semestre 6 — Parcours D", description: "Topographie d'exécution, calcul d'ouvrages routiers et terrassements.", driveKey: "gc-s6d" },
      { key: "S6S", title: "Semestre 6 — Parcours S", description: "Résistance des matériaux avancée (RDM 2), méthodes énergétiques de calcul.", driveKey: "gc-s6s" },
      { key: "S7", title: "Semestre 7", description: "Dimensionnement Béton Armé complet, note de calcul de fondations et ouvrages de soutènement.", driveKey: "gc-s7" },
      { key: "S8", title: "Semestre 8", description: "Charpente métallique avancée, modélisation RDM sur logiciel, dynamique des structures.", driveKey: "gc-s8" }
    ],
    options: [
      {
        title: "🏢 Option 1 : Bâtiment (S9)",
        description: "Règles du béton précontraint, dynamique des structures sous sollicitations complexes, analyse sismique et réhabilitation.",
        driveKey: "gc-op1",
        subjects: ["Béton Précontraint par post-tension", "Modélisation sismique Eurocode 8", "Réhabilitation & Pathologie du béton", "Calcul plastique des ossatures"]
      },
      {
        title: "🛣️ Option 2 : Transport (S9)",
        description: "Dimensionnement de structures de chaussées, méthodes Alizé-LCPC, conception d'ouvrages d'art et de ponts complexes.",
        driveKey: "gc-op2",
        subjects: ["Méthode rationnelle Alizé-LCPC", "Conception & Calcul de Ponts", "Géotechnique routière & Terrassements", "Sécurité & Signalisation routière"]
      }
    ]
  },
  {
    key: "geaah",
    name: "GEAAH",
    fullName: "Génie de l'Eau, de l'Assainissement et des Aménagements Hydro-agricoles",
    colorClass: "bg-geaah text-white hover:bg-blue-800",
    textClass: "text-geaah",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200",
    badgeClass: "bg-blue-100 text-blue-800",
    quote: "L'eau est rare. Les ingénieurs qui savent la trouver, la traiter et la distribuer le sont encore plus.",
    semesters: [
      { key: "S5D", title: "Semestre 5 — Parcours D", description: "Bases de l'hydrologie générale, chimie de l'eau et microbiologie sanitaire.", driveKey: "geaah-s5d" },
      { key: "S5S", title: "Semestre 5 — Parcours S", description: "Mécanique des fluides incompressibles complexes, mathématiques de l'ingénieur.", driveKey: "geaah-s5s" },
      { key: "S6D", title: "Semestre 6 — Parcours D", description: "Dimensionnement d'ouvrages de captage et d'art hydraulique élémentaire.", driveKey: "geaah-s6d" },
      { key: "S6S", title: "Semestre 6 — Parcours S", description: "Hydrologie statistique fréquentielle et modélisation des écoulements de bassin.", driveKey: "geaah-s6s" },
      { key: "S7", title: "Semestre 7", description: "Calcul hydraulique des réseaux d'Adduction en Eau Potable (AEP), épuration biologique des eaux usées.", driveKey: "geaah-s7" },
      { key: "S8", title: "Semestre 8", description: "Hydraulique fluviale, Planification intégrée des ressources en eau (GIRE) et SIG appliqués.", driveKey: "geaah-s8" }
    ],
    options: [
      {
        title: "💧 Option 1 : Approvisionnement en eau (S9)",
        description: "Traitement avancé de potabilisation, stations de pompage lourd, réseaux de télégestion et maintenance hydraulique.",
        driveKey: "geaah-op1",
        subjects: ["Traitement de potabilisation complexe", "Dimensionnement Stations de Pompage", "Télégestion & Automatisme de réseau", "Calcul de coup de bélier en conduite"]
      },
      {
        title: "🌱 Option 2 : Assainissement (S9)",
        description: "Assainissement autonome et collectif, gestion des boues de vidange, réseaux d'eaux pluviales urbains complexes.",
        driveKey: "geaah-op2",
        subjects: ["Filières de traitement des boues", "Modélisation hydraulique pluviale", "Réseaux d'assainissement sous vide", "Gestion intégrée des eaux pluviales"]
      },
      {
        title: "🌾 Option 3 : Hydro-agricoles (S9)",
        description: "Périmètres irrigués (goutte-à-goutte, aspersion), gestion de barrages en terre et développement rural.",
        driveKey: "geaah-op3",
        subjects: ["Réseaux d'irrigation sous pression", "Calcul de stabilité de barrage en terre", "Drainage des sols agricoles", "Aménagement des bas-fonds"]
      }
    ]
  }
];
