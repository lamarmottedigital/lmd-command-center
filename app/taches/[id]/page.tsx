'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../../globals.css';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function TacheDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tache, setTache] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [priorite, setPriorite] = useState('');
  const [statut, setStatut] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadTache();
  }, [params.id]);

  const loadTache = async () => {
    try {
      const { data, error } = await supabase
        .from('captures')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      
      setTache(data);
      setName(data.name || '');
      setPriorite(data.priorite || 'standard');
      setStatut(data.statut || 'non_debutee');
      setDeadline(data.deadline ? data.deadline.split('T')[0] : '');
      setNotes(data.notes || '');
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    setError('');

    try {
      const updates: any = {
        name,
        priorite,
        statut,
        notes
      };

      if (deadline) updates.deadline = deadline;

      const { error: updateError } = await supabase
        .from('captures')
        .update(updates)
        .eq('id', params.id);

      if (updateError) throw updateError;

      setEditing(false);
      await loadTache();
    } catch (err: any) {
      setError(err.message || 'Erreur de mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('captures')
        .delete()
        .eq('id', params.id);

      if (deleteError) throw deleteError;

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Erreur de suppression');
    }
  };

  const handleToggleTerminee = async () => {
    const newStatut = tache.statut === 'terminee' ? 'non_debutee' : 'terminee';
    
    try {
      const { error: updateError } = await supabase
        .from('captures')
        .update({ statut: newStatut })
        .eq('id', params.id);

      if (updateError) throw updateError;
      await loadTache();
    } catch (err: any) {
      setError(err.message || 'Erreur de mise à jour');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Chargement...</div>
      </div>
    );
  }

  if (!tache) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">Tâche introuvable</h1>
          <Link href="/" className="text-blue-300 hover:text-blue-200">
            ← Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-200 hover:text-white text-sm mb-2 inline-block">
            ← Retour au dashboard
          </Link>
          <div className="flex items-start justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {editing ? '✏️ Modifier la tâche' : '📋 Détail de la tâche'}
            </h1>
            {!editing && (
              <div className={`px-4 py-2 rounded-lg ${getPrioriteColor(tache.priorite)}`}>
                <span className="text-white font-semibold">
                  {getPrioriteLabel(tache.priorite)}
                </span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            ❌ {error}
          </div>
        )}

        {/* Content */}
        {editing ? (
          // MODE ÉDITION
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom de la tâche
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priorité
                </label>
                <select
                  value={priorite}
                  onChange={(e) => setPriorite(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="urgent">🔴 Urgent</option>
                  <option value="a_planifier">🟡 À Planifier</option>
                  <option value="a_valider">🔵 À Valider</option>
                  <option value="standard">⚪ Standard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Statut
                </label>
                <select
                  value={statut}
                  onChange={(e) => setStatut(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="non_debutee">📝 Non débutée</option>
                  <option value="en_cours">⏳ En cours</option>
                  <option value="terminee">✅ Terminée</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : '💾 Enregistrer'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          // MODE VISUALISATION
          <div className="space-y-6">
            {/* Infos principales */}
            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {tache.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-600 mb-1">Statut</div>
                  <div className="text-lg font-semibold text-slate-900">
                    {getStatutLabel(tache.statut)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">Source</div>
                  <div className="text-lg font-semibold text-slate-900">
                    {tache.source || 'N/A'}
                  </div>
                </div>
                {tache.deadline && (
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Deadline</div>
                    <div className="text-lg font-semibold text-slate-900">
                      📅 {new Date(tache.deadline).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-slate-600 mb-1">Créée le</div>
                  <div className="text-lg font-semibold text-slate-900">
                    {new Date(tache.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {tache.notes && (
              <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-slate-900 mb-3">📝 Notes</h3>
                <p className="text-slate-700 whitespace-pre-wrap">{tache.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors"
              >
                ✏️ Modifier
              </button>
              
              <button
                onClick={handleToggleTerminee}
                className={`font-semibold py-4 rounded-lg transition-colors ${
                  tache.statut === 'terminee'
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {tache.statut === 'terminee' ? '↩️ Réouvrir' : '✅ Marquer terminée'}
              </button>
              
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg transition-colors"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
