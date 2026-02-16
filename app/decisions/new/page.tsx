'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function NouvelleDecision() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [decision, setDecision] = useState('');
  const [context, setContext] = useState('');
  const [rationale, setRationale] = useState('');
  const [analyseConcil, setAnalyseConcil] = useState('');
  const [typeConcil, setTypeConcil] = useState('petit_concil');
  const [statut, setStatut] = useState('active');
  const [deadline, setDeadline] = useState('');
  const [urlDrive, setUrlDrive] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !decision.trim()) {
      setError('Le titre et la décision sont obligatoires');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const insertData: any = {
        title: title.trim(),
        decision: decision.trim(),
        context: context.trim() || null,
        rationale: rationale.trim() || null,
        analyse_concil: analyseConcil.trim() || null,
        type_concil: typeConcil,
        statut,
        url_drive: urlDrive.trim() || null,
        archived: false
      };

      if (deadline) insertData.deadline = deadline;

      const { data, error: insertError } = await supabase
        .from('decisions')
        .insert(insertData)
        .select()
        .single();

      if (insertError) throw insertError;

      router.push(`/decisions/${data.id}`);
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
          <Link href="/decisions" className="text-blue-200 hover:text-white text-sm mb-2 inline-block">
            ← Retour aux décisions
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            ➕ Nouvelle décision
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
              Titre *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Automatiser 80% du CDI"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Décision *
            </label>
            <textarea
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              rows={4}
              placeholder="Quelle décision a été prise ?"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type de Concil *
              </label>
              <select
                value={typeConcil}
                onChange={(e) => setTypeConcil(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="petit_concil">🟡 Petit Concil (Opérationnel, quotidien)</option>
                <option value="grand_concil">🔴 Grand Concil (Stratégique, important)</option>
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
                <option value="active">✅ Active</option>
                <option value="implementee">🎯 Implémentée</option>
                <option value="revisee">🔄 Révisée</option>
                <option value="annulee">❌ Annulée</option>
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
              Contexte
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={3}
              placeholder="Quel était le contexte de cette décision ?"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rationale (Pourquoi cette décision)
            </label>
            <textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              rows={3}
              placeholder="Pourquoi avez-vous pris cette décision ?"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Analyse Concil (IA)
            </label>
            <textarea
              value={analyseConcil}
              onChange={(e) => setAnalyseConcil(e.target.value)}
              rows={6}
              placeholder="Analyse générée par l'IA..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-500 mt-2">
              💡 Si vous avez une analyse IA, collez-la ici
            </p>
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
              {saving ? 'Création...' : '✅ Créer la décision'}
            </button>
            <Link
              href="/decisions"
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
