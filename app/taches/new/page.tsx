'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function NouvelleTache() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [entree, setEntree] = useState('');
  const [notes, setNotes] = useState('');
  const [priorite, setPriorite] = useState('standard');
  const [statut, setStatut] = useState('non_debutee');
  const [deadline, setDeadline] = useState('');
  const [urlDrive, setUrlDrive] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Le nom de la tâche est obligatoire');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const insertData: any = {
        name: name.trim(),
        entree: entree.trim() || null,
        notes: notes.trim() || null,
        priorite,
        statut,
        url_drive: urlDrive.trim() || null,
        archived: false
      };

      if (deadline) insertData.deadline = deadline;

      const { data, error: insertError } = await supabase
        .from('taches')
        .insert(insertData)
        .select()
        .single();

      if (insertError) throw insertError;

      router.push(`/taches/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Erreur de création');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/taches" className="text-blue-200 hover:text-white text-sm mb-2 inline-block">
            ← Retour aux tâches
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            ➕ Nouvelle tâche
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nom de la tâche *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Finaliser le projet LMD"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description / Détails
            </label>
            <textarea
              value={entree}
              onChange={(e) => setEntree(e.target.value)}
              rows={4}
              placeholder="Détails de la tâche..."
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
              Notes supplémentaires
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Notes additionnelles..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Lien Google Drive
            </label>
            <input
              type="url"
              value={urlDrive}
              onChange={(e) => setUrlDrive(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Création...' : '✅ Créer la tâche'}
            </button>
            <Link
              href="/taches"
              className="px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors text-center"
            >
              Annuler
            </Link>
          </div>

        </form>

      </div>
    </div>
  );
}
