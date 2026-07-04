export type Page = 'home' | 'tronc-commun' | 'filieres' | 'bibliotheque' | 'rapports' | 'contribuer' | 'about';

export interface Subject {
  name: string;
  type: string;
  driveKey: string;
}

export interface CourseCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  driveKey: string;
}

export type FiliereKey = 'gee' | 'gc-btp' | 'geaah';

export interface SemesterDetail {
  key: string;
  title: string;
  description: string;
  driveKey: string;
}

export interface FiliereData {
  key: FiliereKey;
  name: string;
  fullName: string;
  colorClass: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
  quote: string;
  semesters: SemesterDetail[];
  options?: {
    title: string;
    description: string;
    driveKey: string;
    subjects: string[];
  }[];
}

export interface ContributionData {
  nom: string;
  email: string;
  statut: string;
  filiere: string;
  semestre: string;
  nomDoc: string;
  matiere: string;
  typeDoc: string;
  commentaire: string;
  fileName?: string;
  fileData?: string; // base64
}
