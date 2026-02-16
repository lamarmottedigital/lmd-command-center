'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function NoteDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notesSupplementaires, setNotesSupplementaires] = useState('');
  const [urlDrive, setUrlDrive] = useState('');
  const [favoris, setFavoris] = useState(false);

  useEffect(() => {
    loadNote();
  }, [params.id]);

  const loadNote = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      
      setNote(data);
      setTitle(data.title || '');
      setContent(data.content || '');
      setNotesSupplementaires(data.notes_supplementaires || '');
      setUrlDrive(data.url_drive || '');
      setFavoris(data.favoris || false);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!content.trim()) {
      setError('Le contenu est obligatoire');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('notes')
        .update({
          title: title.trim() || null,
          content: content.trim(),
          notes_supplementaires: notesSupplementaires.trim() || null,
          url_drive: urlDrive.trim() || null,
          favoris
        })
        .eq('id', params.id);

      if (updateError) throw updateError;

      setEditing(false);
      await loadNote();
    } catch (err: any) {
      setError(err.message || 'Erreur de mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('notes')
        .delete()
        .eq('id', params.id);

      if (deleteError) throw deleteError;

      router.push('/notes');
    } catch (err: any) {
      setError(err.message || 'Erreur de suppression');
    }
  };

  const toggleFavoris = async () => {
    try {
      const { error: updateError } = await supabase
        .from('notes')
        .update({ favoris: !note.favoris })
        .eq('id', params.id);

      if (updateError) throw updateError;
      await loadNote();
    } catch (err: any) {
      setError(err.message || 'Erreur de mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Chargement...</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">Note introuvable</h1>
          <Link href="/notes" className="text-blue-300 hover:text-blue-200">
            ← Retour aux notes
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
          <Link href="/notes" className="text-blue-200 hover:text-white text-sm mb-2 inline-block">
            ← Retour aux notes
          </Link>
          <div className="flex items-start justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {editing ? '✏️ Modifier la note' : '📝 Détail de la note'}
            </h1>
            {!editing && (
              <button
                onClick={toggleFavoris}
                className={`text-3xl ${note.favoris ? 'text-yellow-400' : 'text-white/30'} hover:text-yellow-400 transition-colors`}
              >
                ⭐
              </button>
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
                Titre (optionnel)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sans titre"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contenu *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notes supplémentaires
              </label>
              <textarea
                value={notesSupplementaires}
                onChange={(e) => setNotesSupplementaires(e.target.value)}
                rows={4}
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

            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={favoris}
                  onChange={(e) => setFavoris(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium text-slate-700">
                  ⭐ Marquer comme favori
                </span>
              </label>
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
            {note.title && (
              <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-slate-900">
                  {note.title}
                </h2>
              </div>
            )}

            {/* Contenu */}
            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 mb-3">📄 Contenu</h3>
              <p className="text-slate-700 whitespace-pre-wrap">{note.content}</p>
            </div>

            {/* Notes supplémentaires */}
            {note.notes_supplementaires && (
              <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-slate-900 mb-3">📝 Notes supplémentaires</h3>
                <p className="text-slate-700 whitespace-pre-wrap">{note.notes_supplementaires}</p>
              </div>
            )}

            {/* Métadonnées */}
            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-600 mb-1">Créée le</div>
                  <div className="text-lg font-semibold text-slate-900">
                    {new Date(note.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">Modifiée le</div>
                  <div className="text-lg font-semibold text-slate-900">
                    {new Date(note.updated_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                {note.url_drive && (
                  <div className="md:col-span-2">
                    <div className="text-sm text-slate-600 mb-1">Google Drive</div>
                    <a
                      href={note.url_drive}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      Ouvrir dans Drive →
                    </a>
                  </div>
                )}
              </div>
            </div>

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
