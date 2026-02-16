'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../../globals.css';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function NewProject() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [typeProjet, setTypeProjet] = useState('developpement');
  const [statut, setStatut] = useState('en_cours');
  const [budget, setBudget] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!name.trim()) {
      setError('Le nom du projet est obligatoire');
      setSaving(false);
      return;
    }

    try {
      const projectData: any = {
        name: name.trim(),
        type_projet: typeProjet,
        statut
      };

      if (budget) projectData.budget = parseFloat(budget);
      if (dateStart) projectData.date_start = dateStart;
      if (dateEnd) projectData.date_end = dateEnd;
      if (description.trim()) projectData.description = description.trim();

      const { error: insertError } = await supabase
        .from('projects')
        .insert([projectData]);

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
            📁 Nouveau projet
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Infos principales */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Informations principales</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom du projet *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Refonte site web"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type de projet
              </label>
              <select
                value={typeProjet}
                onChange={(e) => setTypeProjet(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="developpement">💻 Développement</option>
                <option value="consulting">💼 Consulting</option>
                <option value="design">🎨 Design</option>
                <option value="marketing">📢 Marketing</option>
                <option value="formation">🎓 Formation</option>
                <option value="autre">📦 Autre</option>
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
                <option value="prospect">🎯 Prospect</option>
                <option value="en_cours">⏳ En cours</option>
                <option value="termine">✅ Terminé</option>
                <option value="pause">⏸️ En pause</option>
                <option value="annule">❌ Annulé</option>
              </select>
            </div>
          </div>

          {/* Budget & Dates */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Budget & Planning</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Budget (€)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="5000"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date de fin prévue
                </label>
                <input
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails du projet..."
              rows={5}
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
              {saving ? 'Création...' : '✅ Créer le projet'}
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
