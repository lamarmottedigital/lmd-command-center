'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function DecisionsPage() {
  const [loading, setLoading] = useState(true);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatut, setFilterStatut] = useState<string>('all');

  useEffect(() => {
    loadDecisions();
  }, [filterType, filterStatut]);

  const loadDecisions = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('decisions')
        .select('*')
        .eq('archived', false);

      if (filterType !== 'all') {
        query = query.eq('type_concil', filterType);
      }

      if (filterStatut !== 'all') {
        query = query.eq('statut', filterStatut);
      }

      query = query.order('decision_date', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setDecisions(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeConcilBadge = (type: string) => {
    return type === 'petit_concil' 
      ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
      : 'bg-purple-100 text-purple-800 border-purple-300';
  };

  const getTypeConcilLabel = (type: string) => {
    return type === 'petit_concil' ? '🟡 Petit Concil' : '🔴 Grand Concil';
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'implementee': return 'bg-blue-100 text-blue-800';
      case 'revisee': return 'bg-orange-100 text-orange-800';
      case 'annulee': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'active': return '✅ Active';
      case 'implementee': return '🎯 Implémentée';
      case 'revisee': return '🔄 Révisée';
      case 'annulee': return '❌ Annulée';
      default: return statut;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-blue-200 hover:text-white text-sm mb-2 inline-block">
              ← Retour au dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              🧠 Toutes les décisions
            </h1>
          </div>
          
          <Link
            href="/decisions/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ➕ Nouvelle décision
          </Link>
        </div>

        {/* Filtres */}
        <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Filtre Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type de Concil
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les types</option>
                <option value="petit_concil">🟡 Petit Concil (Opérationnel)</option>
                <option value="grand_concil">🔴 Grand Concil (Stratégique)</option>
              </select>
            </div>

            {/* Filtre Statut */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Statut
              </label>
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">✅ Active</option>
                <option value="implementee">🎯 Implémentée</option>
                <option value="revisee">🔄 Révisée</option>
                <option value="annulee">❌ Annulée</option>
              </select>
            </div>

          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              {decisions.length} décision{decisions.length > 1 ? 's' : ''} trouvée{decisions.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">Chargement...</div>
          </div>
        ) : decisions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {decisions.map(decision => (
              <Link
                key={decision.id}
                href={`/decisions/${decision.id}`}
                className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-3 py-1 rounded-full border ${getTypeConcilBadge(decision.type_concil)}`}>
                        {getTypeConcilLabel(decision.type_concil)}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full ${getStatutBadge(decision.statut)}`}>
                        {getStatutLabel(decision.statut)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {decision.title}
                    </h3>
                  </div>
                </div>

                <p className="text-slate-600 mb-3 line-clamp-2">
                  {decision.decision}
                </p>

                {decision.context && (
                  <p className="text-slate-500 text-sm mb-3 line-clamp-1">
                    Contexte : {decision.context}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div>
                    📅 {new Date(decision.decision_date).toLocaleDateString('fr-FR')}
                  </div>
                  {decision.deadline && (
                    <div>
                      ⏰ Deadline : {new Date(decision.deadline).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur rounded-2xl p-12 shadow-xl text-center">
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Aucune décision trouvée
            </h2>
            <p className="text-slate-600 mb-6">
              Commencez par créer votre première décision !
            </p>
            <Link
              href="/decisions/new"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              ➕ Créer une décision
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
