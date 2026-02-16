'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function DecisionDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [decision, setDecision] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [decisionText, setDecisionText] = useState('');
  const [context, setContext] = useState('');
  const [rationale, setRationale] = useState('');
  const [analyseConcil, setAnalyseConcil] = useState('');
  const [typeConcil, setTypeConcil] = useState('petit_concil');
  const [statut, setStatut] = useState('active');
  const [deadline, setDeadline] = useState('');
  const [urlDrive, setUrlDrive] = useState('');

  useEffect(() => {
    loadDecision();
  }, [params.id]);

  const loadDecision = async () => {
    try {
      const { data, error } = await supabase
        .from('decisions')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      
      setDecision(data);
      setTitle(data.title || '');
      setDecisionText(data.decision || '');
      setContext(data.context || '');
      setRationale(data.rationale || '');
      setAnalyseConcil(data.analyse_concil || '');
      setTypeConcil(data.type_concil || 'petit_concil');
      setStatut(data.statut || 'active');
      setDeadline(data.deadline ? data.deadline.split('T')[0] : '');
      setUrlDrive(data.url_drive || '');
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!title.trim() || !decisionText.trim()) {
      setError('Le titre et la décision sont obligatoires');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const updates: any = {
        title: title.trim(),
        decision: decisionText.trim(),
        context: context.trim() || null,
        rationale: rationale.trim() || null,
        analyse_concil: analyseConcil.trim() || null,
        type_concil: typeConcil,
        statut,
        url_drive: urlDrive.trim() || null
      };

      if (deadline) updates.deadline = deadline;

      const { error: updateError } = await supabase
        .from('decisions')
        .update(updates)
        .eq('id', params.id);

      if (updateError) throw updateError;

      setEditing(false);
      await loadDecision();
    } catch (err: any) {
      setError(err.message || 'Erreur de mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette décision ?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('decisions')
        .delete()
        .eq('id', params.id);

      if (deleteError) throw deleteError;

      router.push('/decisions');
    } catch (err: any) {
      setError(err.message || 'Erreur de suppression');
    }
  };

  const getTypeConcilBadge = (type: string) => {
    return type === 'petit_concil' 
      ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
      : 'bg-purple-100 text-purple-800 border-purple-300';
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Chargement...</div>
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">Décision introuvable</h1>
          <Link href="/decisions" className="text-blue-300 hover:text-blue-200">
            ← Retour aux décisions
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
          <Link href="/decisions" className="text-blue-200 hover:text-white text-sm mb-2 inline-block">
            ← Retour aux décisions
          </Link>
          <div className="flex items-start justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {editing ? '✏️ Modifier la décision' : '🧠 Détail de la décision'}
            </h1>
            {!editing && (
              <div className="flex gap-2">
                <span className={`text-xs px-3 py-1 rounded-full border ${getTypeConcilBadge(decision.type_concil)}`}>
                  {decision.type_concil === 'petit_concil' ? '🟡 Petit Concil' : '🔴 Grand Concil'}
                </span>
                <span className={`text-xs px-3 py-1 rounded-full ${getStatutBadge(decision.statut)}`}>
                  {decision.statut}
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
                Titre *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Décision *
              </label>
              <textarea
                value={decisionText}
                onChange={(e) => setDecisionText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Type de Concil
                </label>
                <select
                  value={typeConcil}
                  onChange={(e) => setTypeConcil(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="petit_concil">🟡 Petit Concil (Opérationnel)</option>
                  <option value="grand_concil">🔴 Grand Concil (Stratégique)</option>
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
            {/* Titre */}
            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {decision.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-600 mb-1">Date de décision</div>
                  <div className="text-lg font-semibold text-slate-900">
                    📅 {new Date(decision.decision_date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                {decision.deadline && (
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Deadline</div>
                    <div className="text-lg font-semibold text-slate-900">
                      ⏰ {new Date(decision.deadline).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Décision */}
            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 mb-3">🎯 Décision</h3>
              <p className="text-slate-700 whitespace-pre-wrap">{decision.decision}</p>
            </div>

            {/* Contexte */}
            {decision.context && (
              <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-slate-900 mb-3">📋 Contexte</h3>
                <p className="text-slate-700 whitespace-pre-wrap">{decision.context}</p>
              </div>
            )}

            {/* Rationale */}
            {decision.rationale && (
              <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-slate-900 mb-3">💡 Pourquoi cette décision</h3>
                <p className="text-slate-700 whitespace-pre-wrap">{decision.rationale}</p>
              </div>
            )}

            {/* Analyse IA */}
            {decision.analyse_concil && (
              <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-slate-900 mb-3">🤖 Analyse Concil (IA)</h3>
                <p className="text-slate-700 whitespace-pre-wrap">{decision.analyse_concil}</p>
              </div>
            )}

            {/* Drive */}
            {decision.url_drive && (
              <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-slate-900 mb-3">📁 Google Drive</h3>
                <a
                  href={decision.url_drive}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Ouvrir dans Drive →
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors"
              >
                ✏️ Modifier
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
