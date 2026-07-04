import React from 'react';
import { Target, Heart, MessageSquare, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Page Title */}
      <div className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          À propos d'archiv2ie
        </h1>
        
        <div className="bg-gradient-to-r from-brand/5 via-brand/5 to-transparent border-l-4 border-brand p-6 rounded-r-2xl space-y-2">
          <p className="font-sans text-gray-700 text-base sm:text-lg italic leading-relaxed">
            Découvrez la genèse et la mission de l'outil numérique conçu par et pour la communauté étudiante de l'Institut 2iE.
          </p>
        </div>
      </div>

      {/* Grid: 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        
        {/* Our Mission */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-serif text-xl font-bold text-gray-900">🎯 Notre Mission</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Centraliser, pérenniser et démocratiser l'accès aux supports documentaires indispensables de l'étudiant. Que vous soyez en Tronc Commun ou en phase de spécialisation poussée (GEE, GC-BTP, GEAAH), archiv2ie vous fournit les armes nécessaires pour appréhender sereinement vos contrôles et projets de groupe.
          </p>
        </div>

        {/* How to Contribute */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-serif text-xl font-bold text-gray-900">🤝 Comment contribuer ?</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            La plateforme vit uniquement grâce aux transferts de connaissances intergénérationnels. En partageant vos sujets d'examen récents ou vos rapports validés, vous facilitez le parcours académique des promotions suivantes. La réussite au sein de l'institut est un projet solidaire et collectif.
          </p>
        </div>

        {/* Contact & Support */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-serif text-xl font-bold text-gray-900">📞 Contact & Support</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Une remarque ? Un lien mort ? Un dossier Drive qui nécessite une restructuration ? Contactez les représentants du Club de Génie Civil, de l'eau, de l'énergie ou les délégués d'étudiants de vos filières respectives pour soumettre vos suggestions d'améliorations techniques et documentaires.
          </p>
        </div>

      </div>

      {/* Cheikh Anta Diop Inspiring Quote */}
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-brand/5 to-transparent border border-dashed border-brand rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm mt-12">
        <div className="p-3 bg-white text-brand rounded-full w-fit mx-auto shadow-sm">
          <Award className="h-6 w-6" />
        </div>
        
        <p className="font-serif text-xl sm:text-2xl text-gray-900 leading-relaxed max-w-3xl mx-auto italic font-medium">
          "Par conséquent, il n'y a qu'un seul salut, c'est la connaissance directe et aucune paresse ne pourra nous dispenser de cet effort. Formez-vous, armez-vous de Sciences jusqu'aux dents et arrachez votre patrimoine culturel."
        </p>
        
        <div className="space-y-1">
          <p className="font-bold text-brand text-sm sm:text-base">— Cheikh Anta Diop</p>
          <p className="text-gray-400 text-[11px] uppercase tracking-wider font-semibold">
            Conférence de Niamey (Niger), 1984
          </p>
        </div>
      </div>

    </div>
  );
}
