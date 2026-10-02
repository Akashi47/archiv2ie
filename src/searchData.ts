import { SearchableItem } from './types';
import { s1Subjects, s2Subjects, s3Subjects, s4Subjects, libraryCategories, filieresData } from './data';

// Helper to generate search items
const items: SearchableItem[] = [];

// 1. Tronc Commun S1 Subjects
s1Subjects.forEach(s => {
  items.push({
    id: `tc-s1-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: s.name,
    category: 'cours',
    categoryLabel: 'Cours & Polycopiés',
    filiereOrLevel: 'Tronc Commun · S1',
    description: `Documents de cours, syllabus et fiches de révision en ${s.name} (${s.type}).`,
    keywords: [s.name, s.type, 'S1', 'Tronc Commun', 'L1', 'Semestre 1', 'cours', 'base'],
    driveKey: s.driveKey,
    pageTarget: 'tronc-commun'
  });

  items.push({
    id: `tc-s1-exam-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: `Examens & Annales · ${s.name}`,
    category: 'examens',
    categoryLabel: 'Examens & Annales',
    filiereOrLevel: 'Tronc Commun · S1',
    description: `Sujets d'examens finaux, partiels et sessions de rattrapage en ${s.name}.`,
    keywords: [s.name, s.type, 'examen', 'partiel', 'annales', 'rattrapage', 'S1', 'corrigé'],
    driveKey: s.driveKey,
    pageTarget: 'tronc-commun'
  });

  items.push({
    id: `tc-s1-td-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: `Fiches de TD & Exercices · ${s.name}`,
    category: 'td-tp',
    categoryLabel: 'TD & Travaux Pratiques',
    filiereOrLevel: 'Tronc Commun · S1',
    description: `Fiches de travaux dirigés (TD) et exercices d'application corrigés en ${s.name}.`,
    keywords: [s.name, s.type, 'TD', 'TP', 'exercices', 'travaux dirigés', 'S1'],
    driveKey: s.driveKey,
    pageTarget: 'tronc-commun'
  });
});

// 2. Tronc Commun S2 Subjects
s2Subjects.forEach(s => {
  items.push({
    id: `tc-s2-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: s.name,
    category: 'cours',
    categoryLabel: 'Cours & Polycopiés',
    filiereOrLevel: 'Tronc Commun · S2',
    description: `Documents de cours et supports d'enseignement en ${s.name} (${s.type}).`,
    keywords: [s.name, s.type, 'S2', 'Tronc Commun', 'L1', 'Semestre 2', 'cours'],
    driveKey: s.driveKey,
    pageTarget: 'tronc-commun'
  });

  items.push({
    id: `tc-s2-exam-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: `Examens & Annales · ${s.name}`,
    category: 'examens',
    categoryLabel: 'Examens & Annales',
    filiereOrLevel: 'Tronc Commun · S2',
    description: `Sujets d'examens et annales de devoirs surveillés en ${s.name}.`,
    keywords: [s.name, s.type, 'examen', 'partiel', 'annales', 'rattrapage', 'S2', 'corrigé'],
    driveKey: s.driveKey,
    pageTarget: 'tronc-commun'
  });

  items.push({
    id: `tc-s2-td-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: `Fiches de TD & Exercices · ${s.name}`,
    category: 'td-tp',
    categoryLabel: 'TD & Travaux Pratiques',
    filiereOrLevel: 'Tronc Commun · S2',
    description: `Cahiers de travaux dirigés, séries d'exercices et TP en ${s.name}.`,
    keywords: [s.name, s.type, 'TD', 'TP', 'exercices', 'travaux pratiques', 'S2'],
    driveKey: s.driveKey,
    pageTarget: 'tronc-commun'
  });
});

// 3. Tronc Commun S3 Subjects
s3Subjects.forEach(s => {
  items.push({
    id: `tc-s3-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: s.name,
    category: 'cours',
    categoryLabel: 'Cours & Polycopiés',
    filiereOrLevel: 'Tronc Commun · S3',
    description: `Cours magistraux et supports de travaux pour ${s.name} (${s.type}).`,
    keywords: [s.name, s.type, 'S3', 'Tronc Commun', 'L2', 'Semestre 3', 'cours', 'RDM', 'Mécanique'],
    driveKey: s.driveKey,
    pageTarget: 'tronc-commun'
  });

  items.push({
    id: `tc-s3-exam-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: `Examens & Annales · ${s.name}`,
    category: 'examens',
    categoryLabel: 'Examens & Annales',
    filiereOrLevel: 'Tronc Commun · S3',
    description: `Épreuves d'examens et annales de synthèse en ${s.name}.`,
    keywords: [s.name, s.type, 'examen', 'partiel', 'annales', 'S3', 'corrigé'],
    driveKey: s.driveKey,
    pageTarget: 'tronc-commun'
  });

  items.push({
    id: `tc-s3-td-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: `Fiches de TD & Exercices · ${s.name}`,
    category: 'td-tp',
    categoryLabel: 'TD & Travaux Pratiques',
    filiereOrLevel: 'Tronc Commun · S3',
    description: `Fiches de TD, applications numériques et comptes-rendus en ${s.name}.`,
    keywords: [s.name, s.type, 'TD', 'TP', 'exercices', 'S3'],
    driveKey: s.driveKey,
    pageTarget: 'tronc-commun'
  });
});

// 4. Tronc Commun S4 Subjects
s4Subjects.forEach(s => {
  items.push({
    id: `tc-s4-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: s.name,
    category: 'cours',
    categoryLabel: 'Cours & Polycopiés',
    filiereOrLevel: 'Tronc Commun · S4',
    description: `Supports de cours et fiches de révision en ${s.name} (${s.type}).`,
    keywords: [s.name, s.type, 'S4', 'Tronc Commun', 'L2', 'Semestre 4', 'cours', 'programmation', 'thermodynamique'],
    driveKey: s.driveKey,
    pageTarget: 'tronc-commun'
  });

  items.push({
    id: `tc-s4-exam-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: `Examens & Annales · ${s.name}`,
    category: 'examens',
    categoryLabel: 'Examens & Annales',
    filiereOrLevel: 'Tronc Commun · S4',
    description: `Annales d'examens de fin de semestre et rattrapages en ${s.name}.`,
    keywords: [s.name, s.type, 'examen', 'annales', 'rattrapage', 'S4', 'corrigé'],
    driveKey: s.driveKey,
    pageTarget: 'tronc-commun'
  });

  items.push({
    id: `tc-s4-td-${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: `Fiches de TD & Exercices · ${s.name}`,
    category: 'td-tp',
    categoryLabel: 'TD & Travaux Pratiques',
    filiereOrLevel: 'Tronc Commun · S4',
    description: `Enoncés et corrigés de travaux dirigés et TP en ${s.name}.`,
    keywords: [s.name, s.type, 'TD', 'TP', 'exercices', 'S4'],
    driveKey: s.driveKey,
    pageTarget: 'tronc-commun'
  });
});

// 5. Filieres (GEE, GC-BTP, GEAAH) Semesters & Options
filieresData.forEach(f => {
  f.semesters.forEach(sem => {
    items.push({
      id: `${f.key}-${sem.key.toLowerCase()}`,
      title: `${f.name} · ${sem.title}`,
      category: 'specialites',
      categoryLabel: 'Filières Spécialisées',
      filiereOrLevel: `${f.name} · ${sem.key}`,
      description: sem.description,
      keywords: [f.name, f.fullName, sem.key, sem.title, 'cours', 'semestre', 'spécialité'],
      driveKey: sem.driveKey,
      pageTarget: 'filieres',
      filiereTarget: f.key
    });

    items.push({
      id: `${f.key}-${sem.key.toLowerCase()}-exam`,
      title: `Examens & Annales · ${f.name} ${sem.key}`,
      category: 'examens',
      categoryLabel: 'Examens & Annales',
      filiereOrLevel: `${f.name} · ${sem.key}`,
      description: `Archives des sujets d'examens de spécialité, devoirs surveillés et sessions de rattrapage (${f.name} ${sem.key}).`,
      keywords: [f.name, f.fullName, sem.key, 'examen', 'annales', 'partiel', 'rattrapage', 'corrigé'],
      driveKey: sem.driveKey,
      pageTarget: 'filieres',
      filiereTarget: f.key
    });

    items.push({
      id: `${f.key}-${sem.key.toLowerCase()}-td`,
      title: `Travaux Dirigés & TP · ${f.name} ${sem.key}`,
      category: 'td-tp',
      categoryLabel: 'TD & Travaux Pratiques',
      filiereOrLevel: `${f.name} · ${sem.key}`,
      description: `Recueil de travaux dirigés, études de cas réels et comptes-rendus de laboratoires (${f.name} ${sem.key}).`,
      keywords: [f.name, f.fullName, sem.key, 'TD', 'TP', 'exercices', 'laboratoire', 'études de cas'],
      driveKey: sem.driveKey,
      pageTarget: 'filieres',
      filiereTarget: f.key
    });
  });

  if (f.options) {
    f.options.forEach((op, idx) => {
      items.push({
        id: `${f.key}-op-${idx}`,
        title: `${f.name} · ${op.title}`,
        category: 'specialites',
        categoryLabel: 'Options de Spécialité S9',
        filiereOrLevel: `${f.name} · S9 Option`,
        description: `${op.description} (Matières : ${op.subjects.join(', ')})`,
        keywords: [f.name, f.fullName, 'Option', 'S9', 'Master', ...op.subjects],
        driveKey: op.driveKey,
        pageTarget: 'filieres',
        filiereTarget: f.key
      });

      op.subjects.forEach((subj, sIdx) => {
        items.push({
          id: `${f.key}-op-${idx}-subj-${sIdx}`,
          title: `${subj} (${f.name} S9)`,
          category: 'cours',
          categoryLabel: 'Cours de Spécialité S9',
          filiereOrLevel: `${f.name} · S9`,
          description: `Module de spécialité approfondi en ${subj} pour les ingénieurs ${f.name}.`,
          keywords: [subj, f.name, f.fullName, 'S9', 'Option', 'cours', 'spécialité'],
          driveKey: op.driveKey,
          pageTarget: 'filieres',
          filiereTarget: f.key
        });
      });
    });
  }
});

// 6. Bibliothèque Numérique Shelves & Mémentos
libraryCategories.forEach(cat => {
  items.push({
    id: `lib-${cat.id}`,
    title: cat.title,
    category: 'bibliotheque',
    categoryLabel: 'Bibliothèque & Mémentos',
    filiereOrLevel: 'Bibliothèque Numérique',
    description: cat.description,
    keywords: [cat.title, cat.description, 'livre', 'mémento', 'eurocode', 'manuel', 'bibliothèque', 'formulaire'],
    driveKey: cat.driveKey,
    pageTarget: 'bibliotheque'
  });
});

// Specific popular library books / codes
items.push(
  {
    id: 'lib-eurocodes',
    title: 'Eurocodes 1, 2, 3, 7 & 8 (Recueil complet)',
    category: 'bibliotheque',
    categoryLabel: 'Normes & Eurocodes',
    filiereOrLevel: 'Bibliothèque Numérique · GC',
    description: 'Normes européennes de dimensionnement des structures en béton, acier, géotechnique et sismique.',
    keywords: ['Eurocode', 'EC2', 'EC3', 'EC7', 'EC8', 'norme', 'béton', 'acier', 'BAEL', 'fondation'],
    driveKey: 'structures',
    pageTarget: 'bibliotheque'
  },
  {
    id: 'lib-calcul-beton',
    title: 'Mémento de Béton Armé et Précontraint',
    category: 'bibliotheque',
    categoryLabel: 'Manuels de Calcul',
    filiereOrLevel: 'Bibliothèque Numérique · GC',
    description: 'Guides pratiques de calcul des armatures, flèches, fissuration et états limites ultimes et de service.',
    keywords: ['béton armé', 'précontraint', 'mémento', 'calcul', 'poutre', 'poteau', 'dalle'],
    driveKey: 'structures',
    pageTarget: 'bibliotheque'
  },
  {
    id: 'lib-hydraulique-charge',
    title: 'Traité d\'Hydraulique Appliquée & Écoulements en charge',
    category: 'bibliotheque',
    categoryLabel: 'Manuels Techniques',
    filiereOrLevel: 'Bibliothèque Numérique · GEAAH',
    description: 'Calcul de conduites, pertes de charge de Darcy-Weisbach et Colebrook, coups de bélier et régimes transitoires.',
    keywords: ['hydraulique', 'écoulement', 'conduite', 'pompe', 'perte de charge', 'bélier', 'AEP'],
    driveKey: 'hydraulique',
    pageTarget: 'bibliotheque'
  },
  {
    id: 'lib-energie-pv',
    title: 'Guide de Dimensionnement Solaire Photovoltaïque',
    category: 'bibliotheque',
    categoryLabel: 'Manuels d\'Ingénierie',
    filiereOrLevel: 'Bibliothèque Numérique · GEE',
    description: 'Manuel de calcul des champs PV, dimensionnement d\'onduleurs, batteries et calcul de rentabilité économique.',
    keywords: ['solaire', 'photovoltaïque', 'onduleur', 'batterie', 'gisement', 'énergie', 'PV'],
    driveKey: 'electricite',
    pageTarget: 'bibliotheque'
  },
  {
    id: 'lib-qgis-tuto',
    title: 'Guide Pratique QGIS & Traitement SIG pour Ingénieurs',
    category: 'bibliotheque',
    categoryLabel: 'Logiciels & SIG',
    filiereOrLevel: 'Bibliothèque Numérique · SIG',
    description: 'Tutoriels pas à pas pour la cartographie thématique, modélisation de bassins versants et analyse spatiale.',
    keywords: ['QGIS', 'SIG', 'cartographie', 'bassin versant', 'MNT', 'télédétection', 'géomatique'],
    driveKey: 'topo',
    pageTarget: 'bibliotheque'
  }
);

// 7. Rapports & PFE & Guides
items.push(
  {
    id: 'rep-stages-all',
    title: 'Rapports de Stage (Ouvrier & Technicien)',
    category: 'rapports',
    categoryLabel: 'Rapports & Mémoires',
    filiereOrLevel: 'Rapports 2iE · S4 & S6',
    description: 'Archives de rapports de stage en entreprise classés par filière (GC-BTP, GEE, GEAAH) et par niveau.',
    keywords: ['rapport', 'stage', 'technicien', 'ouvrier', 'immersion', 'entreprise', 'mémoire', 'soutenance'],
    driveKey: 'rapports-stage',
    pageTarget: 'rapports'
  },
  {
    id: 'rep-pfe-all',
    title: 'Projets de Fin d\'Études (PFE Ingénieur)',
    category: 'rapports',
    categoryLabel: 'Rapports & Mémoires',
    filiereOrLevel: 'Rapports 2iE · S10 / Master',
    description: 'Mémoires de master et projets de fin d\'études soutenus avec succès devant les jurys académiques de 2iE.',
    keywords: ['PFE', 'projet de fin d\'études', 'master', 'ingénieur', 'soutenance', 'thèse', 'mémoire'],
    driveKey: 'rapports-pfe',
    pageTarget: 'rapports'
  },
  {
    id: 'rep-projets-tps',
    title: 'Rapports de Projets Techniques & Études de Cas',
    category: 'rapports',
    categoryLabel: 'Rapports & Mémoires',
    filiereOrLevel: 'Rapports 2iE · Projets',
    description: 'Dossiers de projets semestriels, comptes-rendus d\'ingénierie et études de cas réels menées à 2iE.',
    keywords: ['projet', 'bureau d\'études', 'compte-rendu', 'TP', 'dimensionnement', 'synthèse'],
    driveKey: 'rapports-projets',
    pageTarget: 'rapports'
  },
  {
    id: 'rep-guides-modeles',
    title: 'Guides de Rédaction & Modèles Word / LaTeX',
    category: 'rapports',
    categoryLabel: 'Outils & Modèles',
    filiereOrLevel: 'Rapports 2iE · Modèles',
    description: 'Modèles officiels de mise en page pour PFE et rapports de stage, grilles d\'évaluation et guides typographiques.',
    keywords: ['modèle', 'LaTeX', 'Word', 'guide de rédaction', 'charte', 'page de garde', 'bibliographie', 'Zotero'],
    driveKey: 'guides-modeles',
    pageTarget: 'rapports'
  }
);

export const allSearchableItems: SearchableItem[] = items;
