export type Page = 'home' | 'tronc-commun' | 'filieres' | 'bibliotheque' | 'rapports' | 'contribuer' | 'about';

export type DocTypeFilter = 'all' | 'cours' | 'examens' | 'td-tp' | 'rapports' | 'bibliotheque' | 'specialites';

export interface SearchableItem {
  id: string;
  title: string;
  category: 'cours' | 'examens' | 'td-tp' | 'rapports' | 'bibliotheque' | 'specialites';
  categoryLabel: string;
  filiereOrLevel: string;
  description: string;
  keywords: string[];
  driveKey: string;
  pageTarget?: Page;
  filiereTarget?: FiliereKey;
  badgeClass?: string;
}

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

export interface RecentDocument {
  id: string;
  title: string;
  filiere: string;
  type: 'Cours' | 'Annales' | 'Bibliothèque' | 'Rapport' | 'Projet';
  description: string;
  driveKey: string;
  dateAdded: string;
  badgeClass: string;
  borderClass: string;
}

export interface FavoriteItem {
  id: string;
  title: string;
  category: string;
  filiereOrLevel?: string;
  driveKey: string;
  addedAt: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  category?: string;
  filiereOrLevel?: string;
  driveKey: string;
  viewedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  filiere?: FiliereKey | 'tronc-commun' | '';
  semestre?: string;
  promotion?: string;
  favorites: FavoriteItem[];
  recentHistory: HistoryItem[];
  createdAt?: string;
  updatedAt?: string;
}

