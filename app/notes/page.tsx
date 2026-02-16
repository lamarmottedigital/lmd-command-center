'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function NotesPage() {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadNotes();
  }, [searchQuery]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('notes')
        .select('*')
        .eq('archived', false);

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
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
              📝 Toutes les notes
            </h1>
          </div>
          
          <Link
            href="/notes/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ➕ Nouvelle note
          </Link>
        </div>

        {/* Recherche */}
        <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              🔍 Rechercher
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans les titres et contenus..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              {notes.length} note{notes.length > 1 ? 's' : ''} trouvée{notes.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">Chargement...</div>
          </div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map(note => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
              >
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {note.title || 'Sans titre'}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-4">
                    {note.content}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-200">
                  <div>
                    {new Date(note.created_at).toLocaleDateString('fr-FR')}
                  </div>
                  {note.favoris && (
                    <div className="text-yellow-500">⭐</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur rounded-2xl p-12 shadow-xl text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {searchQuery ? 'Aucune note trouvée' : 'Aucune note'}
            </h2>
            <p className="text-slate-600 mb-6">
              {searchQuery ? 'Essayez une autre recherche' : 'Commencez par créer votre première note !'}
            </p>
            {!searchQuery && (
              <Link
                href="/notes/new"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                ➕ Créer une note
              </Link>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
