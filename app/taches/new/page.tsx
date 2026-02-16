'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../../globals.css';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function NewTache() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [priorite, setPriorite] = useState('standard');
  const [statut, setStatut] = useState('todo');
  const [source, setSource] = useState('manuel');
  const [deadline, setDeadline] = useState('');
  const [projectId, setProjectId] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!name.trim()) {
      setError('Le nom de la tâche est obligatoire');
      setSaving(false);
      return;
    }

    try {
      const tacheData: any = {
        name: name.trim(),
        priorite,
        statut,
        source,
        archived: false
      };

      if (deadline) tacheData.deadline = deadline;
      if (projectId) tacheData.project_id = projectId;
      if (notes.trim()) tacheData.notes = notes.trim();

      const { error: insertError } = await supabase
        .from('captures')
        .insert([tacheData]);

      if (insertError) throw insertError;

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        
        <div className="mb-8">
          <Link href="/" className="text-blue-200 hover:text-white text-sm mb-2 inline-block">
            ← Retour au dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            📋 Nouvelle tâche
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Nom */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nom de la tâche *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Appeler Jean Dupont"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Priorité & Statut */}
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
                <option value="todo">📝 À faire</option>
                <option value="en_cours">⏳ En cours</option>
                <option value="done">✅ Terminée</option>
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Deadline (optionnel)
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes (optionnel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Détails supplémentaires..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Création...' : '✅ Créer la tâche'}
            </button>
            
            <Link
              href="/"
              className="px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors text-center"
            >
              Annuler
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              ❌ {error}
            </div>
          )}
        </form>

      </div>
    </div>
  );
}
