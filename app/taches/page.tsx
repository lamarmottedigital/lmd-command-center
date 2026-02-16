'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function TachesPage() {
  const [loading, setLoading] = useState(true);
  const [taches, setTaches] = useState<any[]>([]);
  const [filterStatut, setFilterStatut] = useState<string>('all');
  const [filterPriorite, setFilterPriorite] = useState<string>('all');

  useEffect(() => {
    loadTaches();
  }, [filterStatut, filterPriorite]);

  const loadTaches = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('taches')
        .select('*')
        .eq('archived', false);

      if (filterStatut !== 'all') {
        query = query.eq('statut', filterStatut);
      }

      if (filterPriorite !== 'all') {
        query = query.eq('priorite', filterPriorite);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setTaches(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'urgent': return 'bg-red-500';
      case 'a_planifier': return 'bg-yellow-500';
      case 'a_valider': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getPrioriteLabel = (priorite: string) => {
    switch (priorite) {
      case 'urgent': return '🔴 Urgent';
      case 'a_planifier': return '🟡 À Planifier';
      case 'a_valider': return '🔵 À Valider';
      default: return '⚪ Standard';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'non_debutee': return '📝 Non débutée';
      case 'en_cours': return '⏳ En cours';
      case 'terminee': return '✅ Terminée';
      default: return statut;
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'non_debutee': return 'bg-slate-100 text-slate-700';
      case 'en_cours': return 'bg-orange-100 text-orange-700';
      case 'terminee': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
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
              📋 Toutes les tâches
            </h1>
          </div>
          
          <Link
            href="/taches/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ➕ Nouvelle tâche
          </Link>
        </div>

        {/* Filtres */}
        <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
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
                <option value="non_debutee">📝 Non débutée</option>
                <option value="en_cours">⏳ En cours</option>
                <option value="terminee">✅ Terminée</option>
              </select>
            </div>

            {/* Filtre Priorité */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Priorité
              </label>
              <select
                value={filterPriorite}
                onChange={(e) => setFilterPriorite(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes les priorités</option>
                <option value="urgent">🔴 Urgent</option>
                <option value="a_planifier">🟡 À Planifier</option>
                <option value="a_valider">🔵 À Valider</option>
                <option value="standard">⚪ Standard</option>
              </select>
            </div>

          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              {taches.length} tâche{taches.length > 1 ? 's' : ''} trouvée{taches.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">Chargement...</div>
          </div>
        ) : taches.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {taches.map(tache => (
              <Link
                key={tache.id}
                href={`/taches/${tache.id}`}
                className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getPrioriteColor(tache.priorite)}`} />
                    <h3 className="text-xl font-bold text-slate-900">
                      {tache.name}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatutColor(tache.statut)}`}>
                      {getStatutLabel(tache.statut)}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-slate-200 text-slate-700">
                      {getPrioriteLabel(tache.priorite)}
                    </span>
                  </div>
                </div>

                {tache.entree && (
                  <p className="text-slate-600 mb-3 line-clamp-2">
                    {tache.entree}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-slate-500">
                  {tache.deadline && (
                    <div>
                      📅 {new Date(tache.deadline).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                  <div>
                    Créée le {new Date(tache.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur rounded-2xl p-12 shadow-xl text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Aucune tâche trouvée
            </h2>
            <p className="text-slate-600 mb-6">
              Commencez par créer votre première tâche !
            </p>
            <Link
              href="/taches/new"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              ➕ Créer une tâche
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
