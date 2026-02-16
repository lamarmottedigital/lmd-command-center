'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../../globals.css';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function NewContact() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [nomComplet, setNomComplet] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [societe, setSociete] = useState('');
  const [typeContact, setTypeContact] = useState('prospect');
  const [scorePriorite, setScorePriorite] = useState(5);
  const [statutRelation, setStatutRelation] = useState('actif');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!nomComplet.trim()) {
      setError('Le nom est obligatoire');
      setSaving(false);
      return;
    }

    try {
      const contactData: any = {
        nom_complet: nomComplet.trim(),
        type_contact: typeContact,
        score_priorite: scorePriorite,
        statut_relation: statutRelation,
        date_premier_contact: new Date().toISOString().split('T')[0]
      };

      if (email.trim()) contactData.email = email.trim();
      if (telephone.trim()) contactData.telephone = telephone.trim();
      if (societe.trim()) contactData.societe = societe.trim();
      if (notes.trim()) contactData.notes = notes.trim();

      const { error: insertError } = await supabase
        .from('contacts')
        .insert([contactData]);

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
            👥 Nouveau contact
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Infos principales */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Informations principales</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                value={nomComplet}
                onChange={(e) => setNomComplet(e.target.value)}
                placeholder="Ex: Jean Dupont"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean.dupont@exemple.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Société
              </label>
              <input
                type="text"
                value={societe}
                onChange={(e) => setSociete(e.target.value)}
                placeholder="Nom de l'entreprise"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Classification */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Classification</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type de contact
              </label>
              <select
                value={typeContact}
                onChange={(e) => setTypeContact(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="prospect">🎯 Prospect</option>
                <option value="client">💰 Client</option>
                <option value="partenaire">🤝 Partenaire</option>
                <option value="fournisseur">📦 Fournisseur</option>
                <option value="reseau">🌐 Réseau</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Score de priorité : {scorePriorite}/10
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={scorePriorite}
                onChange={(e) => setScorePriorite(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Faible</span>
                <span>Moyen</span>
                <span>Élevé</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Statut de la relation
              </label>
              <select
                value={statutRelation}
                onChange={(e) => setStatutRelation(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="actif">✅ Actif</option>
                <option value="inactif">⏸️ Inactif</option>
                <option value="en_discussion">💬 En discussion</option>
                <option value="en_attente">⏳ En attente</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informations complémentaires sur le contact..."
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
              {saving ? 'Création...' : '✅ Créer le contact'}
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
