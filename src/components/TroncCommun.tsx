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
    const link = driveLinks[key] || driveLinks.default;
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      alert("📂 Le dossier Drive demandé est en cours de centralisation.\nIl sera disponible très prochainement !");
    }
  };

  const renderSubjectTable = (title: string, subjects: Subject[], driveKey: string, semKey: string) => {
    if (subjects.length === 0) return null;

    return (
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(40,30,20,0.03)] overflow-hidden space-y-4">
        
        {/* Table header */}
        <div className="px-6 py-5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-[#EAF5EE] text-[#1B835E] rounded-2xl border border-[#1B835E]/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#0F172A]">{title}</h3>
              <p className="text-[#94A3B8] text-xs font-semibold mt-0.5">
                {subjects.length} matières répertoriées
              </p>
            </div>
          </div>
          
          <button
            onClick={() => openDriveFolder(driveKey)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white font-bold text-xs rounded-xl hover:bg-brand-hover shadow-sm transition-all text-left cursor-pointer transform hover:-translate-y-0.5"
          >
            <FolderOpen className="h-4 w-4" />
            <span>Accéder au dossier Drive {title.split(' ')[2]} 📁</span>
          </button>
        </div>

        {/* Desktop and mobile responsive list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#94A3B8] font-bold text-xs uppercase tracking-wider bg-[#F8FAFC]">
                <th className="py-3.5 px-6">Matière</th>
                <th className="py-3.5 px-6">Unité d'Enseignement / Type</th>
                <th className="py-3.5 px-6 text-right">Ressources</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]/60">
              {subjects.map((sub, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFC]/70 transition-all group">
                  <td className="py-4 px-6 font-semibold text-[#0F172A]">
                    <span>{sub.name}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-brand bg-[#EAF5EE] rounded-full border border-brand/20">
                      {sub.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => openDriveFolder(sub.driveKey)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#64748B] hover:text-brand transition-colors cursor-pointer group-hover:underline"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
      
      {/* Title block */}
      <div className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight">
          Tronc Commun <span className="text-[#94A3B8] font-light">S1 à S4</span>
        </h1>
        
        <div className="human-note p-6 sm:p-8 rounded-2xl sm:rounded-3xl space-y-2">
          <p className="font-sans text-[#334155] text-base sm:text-lg italic leading-relaxed">
            "Avant d'être ingénieur de l'eau, de l'énergie ou du génie civil - vous êtes d'abord ingénieur, tout court."
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-bold text-[#1B835E] mt-3">
            <span>📊 4 Semestres</span>
            <span>·</span>
            <span>📚 64 Matières d'excellence</span>
            <span>·</span>
            <span>🎓 Tous les étudiants de 2iE</span>
          </div>
        </div>
      </div>

      {/* Control panel: search and semester tabs */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center p-4 bg-white rounded-2xl sm:rounded-3xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(40,30,20,0.02)]">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Rechercher une matière (ex: Algèbre, Hydraulique, SIG, Thermodynamique)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all text-[#0F172A] placeholder:text-[#94A3B8]"
          />
        </div>

        {/* Semester tabs filter */}
        <div className="flex flex-wrap gap-1.5 bg-[#F8FAFC] p-1.5 rounded-2xl border border-[#E2E8F0]">
          <button
            onClick={() => setSelectedSemester('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedSemester === 'all' ? 'bg-white text-[#0F172A] shadow-sm border border-[#E2E8F0]' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Tous les Semestres
          </button>
          {['S1', 'S2', 'S3', 'S4'].map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSemester === sem ? 'bg-white text-[#0F172A] shadow-sm border border-[#E2E8F0]' : 'text-[#64748B] hover:text-[#0F172A]'
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
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col items-center justify-center space-y-3">
            <AlertCircle className="h-10 w-10 text-[#C4B7A6]" />
            <h3 className="text-base font-bold text-[#0F172A]">Aucun résultat trouvé</h3>
            <p className="text-xs text-[#64748B] max-w-sm leading-relaxed">
              Nous n'avons pas trouvé de matière correspondant à <strong className="text-[#0F172A]">"{searchQuery}"</strong> dans ce filtre. Vérifiez l'orthographe ou affichez tous les semestres.
            </p>
          </div>
        ) : (
          <>
            {renderSubjectTable("🔹 Semestre 1 (S1)", s1Filtered, "tc-s1", "S1")}
            {renderSubjectTable("🔹 Semestre 2 (S2)", s2Filtered, "tc-s2", "S2")}
            {renderSubjectTable("🔹 Semestre 3 (S3)", s3Filtered, "tc-s3", "S3")}
            {renderSubjectTable("🔹 Semestre 4 (S4)", s4Filtered, "tc-s4", "S4")}
          </>
        )}
      </div>

    </div>
  );
}
