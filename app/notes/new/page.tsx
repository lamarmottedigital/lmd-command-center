'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function NouvelleNote() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notesSupplementaires, setNotesSupplementaires] = useState('');
  const [urlDrive, setUrlDrive] = useState('');
  const [favoris, setFavoris] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Le contenu est obligatoire');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const { data, error: insertError } = await supabase
        .from('notes')
        .insert({
          title: title.trim() || null,
          content: content.trim(),
          notes_supplementaires: notesSupplementaires.trim() || null,
          url_drive: urlDrive.trim() || null,
          favoris,
          archived: false
        })
        .select()
        .single();

      if (insertError) throw insertError;

      router.push(`/notes/${data.id}`);
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
          <Link href="/notes" className="text-blue-200 hover:text-white text-sm mb-2 inline-block">
            ← Retour aux notes
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            ➕ Nouvelle note
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
              placeholder="Écrivez votre note ici..."
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
              placeholder="Informations additionnelles..."
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
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Création...' : '✅ Créer la note'}
            </button>
            <Link
              href="/notes"
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
