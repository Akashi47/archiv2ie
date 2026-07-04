import React, { useState } from 'react';
import { s1Subjects, s2Subjects, s3Subjects, s4Subjects, driveLinks } from '../data';
import { Subject } from '../types';
import { Search, FolderOpen, AlertCircle, BookOpen, Filter, Download } from 'lucide-react';

export default function TroncCommun() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<'all' | 'S1' | 'S2' | 'S3' | 'S4'>('all');

  const filterSubjects = (subjects: Subject[], semesterLabel: string) => {
    return subjects.filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            sub.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSemester = selectedSemester === 'all' || selectedSemester === semesterLabel;
      return matchesSearch && matchesSemester;
    });
  };

  const s1Filtered = filterSubjects(s1Subjects, 'S1');
  const s2Filtered = filterSubjects(s2Subjects, 'S2');
  const s3Filtered = filterSubjects(s3Subjects, 'S3');
  const s4Filtered = filterSubjects(s4Subjects, 'S4');

  const totalResults = s1Filtered.length + s2Filtered.length + s3Filtered.length + s4Filtered.length;

  const openDriveFolder = (key: string) => {
    const link = driveLinks[key];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      alert("📂 Le dossier Drive demandé est en cours de centralisation.\nIl sera disponible très prochainement !");
    }
  };

  const renderSubjectTable = (title: string, subjects: Subject[], driveKey: string) => {
    if (subjects.length === 0) return null;

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden space-y-4">
        
        {/* Table header */}
        <div className="px-6 py-5 bg-gradient-to-r from-brand/5 to-transparent border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand/10 text-brand rounded-xl">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mt-0.5">
                {subjects.length} matières répertoriées
              </p>
            </div>
          </div>
          
          <button
            onClick={() => openDriveFolder(driveKey)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white font-bold text-xs rounded-xl hover:bg-brand-hover shadow-sm transition-all text-left"
          >
            <FolderOpen className="h-4 w-4" />
            <span>Accéder au Drive {title.split(' ')[2]} 📁</span>
          </button>
        </div>

        {/* Desktop and mobile responsive list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold text-xs uppercase tracking-wider bg-gray-50/50">
                <th className="py-3 px-6">Matière</th>
                <th className="py-3 px-6">Unité d'Enseignement / Type</th>
                <th className="py-3 px-6 text-right">Ressources</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subjects.map((sub, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 transition-all group">
                  <td className="py-4 px-6 font-medium text-gray-900">
                    {sub.name}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-brand bg-brand/5 rounded-full border border-brand/10">
                      {sub.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => openDriveFolder(sub.driveKey)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-brand transition-colors group-hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Télécharger</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title block */}
      <div className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Tronc Commun <span className="text-gray-400 font-light">S1 à S4</span>
        </h1>
        
        <div className="bg-gradient-to-r from-brand/5 via-brand/5 to-transparent border-l-4 border-brand p-6 rounded-r-2xl space-y-2">
          <p className="font-sans text-gray-600 text-base sm:text-lg italic leading-relaxed">
            "Avant d'être ingénieur de l'eau, de l'énergie ou du béton — vous êtes d'abord ingénieur, tout court."
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-bold text-brand mt-4 uppercase tracking-wider">
            <span>📊 4 Semestres</span>
            <span>·</span>
            <span>📚 64 Matières d'excellence</span>
            <span>·</span>
            <span>🎓 Tous les étudiants de 2iE</span>
          </div>
        </div>
      </div>

      {/* Control panel: search and semester tabs */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une matière (ex: Algèbre, Hydraulique, SIG)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all shadow-sm"
          />
        </div>

        {/* Semester tabs filter */}
        <div className="flex flex-wrap gap-1.5 bg-gray-200/50 p-1 rounded-xl border border-gray-200/10">
          <button
            onClick={() => setSelectedSemester('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedSemester === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Tous les Semestres
          </button>
          {['S1', 'S2', 'S3', 'S4'].map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedSemester === sem ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Semestre {sem}
            </button>
          ))}
        </div>

      </div>

      {/* Tables layout */}
      <div className="space-y-12">
        {totalResults === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 card-shadow flex flex-col items-center justify-center space-y-3">
            <AlertCircle className="h-10 w-10 text-gray-300" />
            <h3 className="text-base font-bold text-gray-700">Aucun résultat trouvé</h3>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Nous n'avons pas trouvé de matière correspondant à <strong className="text-gray-600">"{searchQuery}"</strong> dans ce filtre de semestre. Vérifiez l'orthographe ou essayez un autre filtre.
            </p>
          </div>
        ) : (
          <>
            {renderSubjectTable("🔹 Semestre 1 (S1)", s1Filtered, "tc-s1")}
            {renderSubjectTable("🔹 Semestre 2 (S2)", s2Filtered, "tc-s2")}
            {renderSubjectTable("🔹 Semestre 3 (S3)", s3Filtered, "tc-s3")}
            {renderSubjectTable("🔹 Semestre 4 (S4)", s4Filtered, "tc-s4")}
          </>
        )}
      </div>

    </div>
  );
}
