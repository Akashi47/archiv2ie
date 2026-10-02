import React from 'react';
import { Target, Heart, MessageSquare, Award, Users, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
      
      {/* Page Title */}
      <div className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight">
          À propos d'archiv2ie
        </h1>
        
        <div className="human-note p-6 sm:p-8 rounded-2xl sm:rounded-3xl space-y-2">
          <p className="font-sans text-[#334155] text-base sm:text-lg italic leading-relaxed">
            Plateforme collaborative d'archivage numérique conçue par et pour les étudiants de l'Institut 2iE. Accédez librement aux cours, TD, examens, ainsi qu'aux rapports de stage et PFE.
          </p>
        </div>
      </div>

      {/* Grid: 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
        
        {/* Our Mission */}
        <div className="human-card p-6 sm:p-8 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#EAF5EE] text-[#1B835E] flex items-center justify-center font-bold text-xl flex-shrink-0">
                🎯
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0F172A]">Notre mission</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Centraliser, pérenniser et démocratiser l'accès aux supports documentaires indispensables de l'étudiant. Que vous soyez en Tronc Commun ou en phase de spécialisation poussée (GEE, GC-BTP, GEAAH), archiv2ie vous fournit les armes nécessaires pour appréhender sereinement vos contrôles et projets.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-[#1B835E] flex items-center gap-1.5">
            <span>Transmission de promo en promo</span>
          </div>
        </div>

        {/* How to Contribute */}
        <div className="human-card p-6 sm:p-8 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#FEF8ED] text-gc flex items-center justify-center font-bold text-xl flex-shrink-0">
                🤝
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0F172A]">Comment contribuer ?</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              La plateforme vit uniquement grâce aux transferts de connaissances intergénérationnels. En partageant vos sujets d'examen récents ou vos rapports validés, vous facilitez le parcours académique des promotions suivantes. La réussite au sein de l'institut est un projet solidaire et collectif.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-gc flex items-center gap-1.5">
            <span>100% collaboratif & bénévole</span>
          </div>
        </div>

        {/* Cadre pédagogique */}
        <div className="human-card p-6 sm:p-8 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#F0F6FC] text-geaah flex items-center justify-center font-bold text-xl flex-shrink-0">
                <ShieldCheck className="h-6 w-6 text-geaah" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0F172A]">Cadre pédagogique</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Plateforme indépendante à vocation strictement pédagogique et non lucrative. Les supports partagés demeurent la propriété intellectuelle de leurs enseignants et auteurs respectifs et sont diffusés dans un cadre d'entraide universitaire désintéressée.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-geaah flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Usage strictement éducatif</span>
          </div>
        </div>

      </div>

      {/* Cheikh Anta Diop Inspiring Quote */}
      <div className="max-w-4xl mx-auto bg-white border border-[#E2E8F0] rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm mt-12">
        <div className="p-3 bg-[#F1F5F9] text-[#1B835E] rounded-2xl w-fit mx-auto shadow-xs border border-[#E2E8F0]">
          <Award className="h-7 w-7" />
        </div>
        
        <p className="font-serif text-xl sm:text-2xl text-[#0F172A] leading-relaxed max-w-3xl mx-auto italic font-medium">
          "Par conséquent, il n'y a qu'un seul salut, c'est la connaissance directe et aucune paresse ne pourra nous dispenser de cet effort. Formez-vous, armez-vous de Sciences jusqu'aux dents et arrachez votre patrimoine culturel."
        </p>
        
        <div className="space-y-1">
          <p className="font-bold text-brand text-base sm:text-lg">- Cheikh Anta Diop</p>
          <p className="text-[#94A3B8] text-xs uppercase tracking-wider font-semibold">
            Conférence de Niamey (Niger), 1984
          </p>
        </div>
      </div>

    </div>
  );
}
