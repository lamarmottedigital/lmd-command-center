'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../../globals.css';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function NewFinance() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [type, setType] = useState('revenu');
  const [montant, setMontant] = useState('');
  const [categorie, setCategorie] = useState('');
  const [source, setSource] = useState('');
  const [statut, setStatut] = useState('reçu');
  const [dateTransaction, setDateTransaction] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!montant || parseFloat(montant) === 0) {
      setError('Le montant est obligatoire');
      setSaving(false);
      return;
    }

    try {
      let finalMontant = parseFloat(montant);
      // Si c'est une dépense, le montant doit être négatif
      if (type === 'depense' && finalMontant > 0) {
        finalMontant = -finalMontant;
      }

      const financeData: any = {
        montant: finalMontant,
        statut,
        date_transaction: dateTransaction
      };

      if (categorie.trim()) financeData.categorie = categorie.trim();
      if (source.trim()) financeData.source = source.trim();
      if (notes.trim()) financeData.notes = notes.trim();

      const { error: insertError } = await supabase
        .from('finances')
        .insert([financeData]);

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
            💰 Nouvelle transaction
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Type & Montant */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Transaction</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="revenu">💰 Revenu</option>
                <option value="depense">💸 Dépense</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Montant (€) *
              </label>
              <input
                type="number"
                step="0.01"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                placeholder="1000.00"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                {type === 'depense' ? 'Le montant sera automatiquement négatif' : 'Montant positif'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date de transaction
              </label>
              <input
                type="date"
                value={dateTransaction}
                onChange={(e) => setDateTransaction(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Catégorie & Source */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Détails</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Catégorie
              </label>
              <input
                type="text"
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                placeholder={type === 'revenu' ? 'Ex: Prestation, Vente' : 'Ex: Logiciel, Matériel'}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Source / Destinataire
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder={type === 'revenu' ? 'Client ou source' : 'Fournisseur'}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
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
                <option value="reçu">✅ Reçu / Payé</option>
                <option value="en_attente">⏳ En attente</option>
                <option value="prevu">📅 Prévu</option>
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
              placeholder="Détails complémentaires..."
              rows={3}
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
              {saving ? 'Création...' : '✅ Créer la transaction'}
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
