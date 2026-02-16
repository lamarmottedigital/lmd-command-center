'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [tresorerie, setTresorerie] = useState<any>(null);
  const [tachesEnCours, setTachesEnCours] = useState<any[]>([]);
  const [tachesUrgentes, setTachesUrgentes] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [rdvs, setRdvs] = useState<any[]>([]);
  const [prospects, setProspects] = useState<any[]>([]);
  const [journalOS, setJournalOS] = useState<any>(null);
  const [punchline, setPunchline] = useState<string>('');
  const [focusData, setFocusData] = useState<any[]>([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadTresorerie(),
      loadTachesEnCours(),
      loadTachesUrgentes(),
      loadNotes(),
      loadDecisions(),
      loadRDVs(),
      loadProspects(),
      loadJournalOS(),
      loadPunchline(),
      loadFocusChart()
    ]);
    setLoading(false);
  };

  const loadTresorerie = async () => {
    try {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const { data, error } = await supabase
        .from('finances')
        .select('montant, statut')
        .gte('date_transaction', firstDay.toISOString().split('T')[0]);
      
      if (error) throw error;
      
      const revenus = data
        .filter((f: any) => (f.statut === 'reçu' || f.statut === 'payé') && f.montant > 0)
        .reduce((sum: number, f: any) => sum + parseFloat(f.montant), 0);
      
      const depenses = data
        .filter((f: any) => (f.statut === 'reçu' || f.statut === 'payé') && f.montant < 0)
        .reduce((sum: number, f: any) => sum + Math.abs(parseFloat(f.montant)), 0);
      
      setTresorerie({ revenus, depenses, net: revenus - depenses });
    } catch (error) {
      console.error('Erreur trésorerie:', error);
    }
  };

  const loadTachesEnCours = async () => {
    try {
      const { data, error } = await supabase
        .from('taches')
        .select('*')
        .eq('archived', false)
        .eq('statut', 'en_cours')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      setTachesEnCours(data || []);
    } catch (error) {
      console.error('Erreur tâches en cours:', error);
    }
  };

  const loadTachesUrgentes = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const in3days = new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('taches')
        .select('*')
        .eq('archived', false)
        .neq('statut', 'terminee')
        .or(`priorite.eq.urgent,and(deadline.gte.${today},deadline.lte.${in3days})`)
        .order('deadline', { ascending: true, nullsFirst: false })
        .limit(5);
      
      if (error) throw error;
      setTachesUrgentes(data || []);
    } catch (error) {
      console.error('Erreur tâches urgentes:', error);
    }
  };

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('archived', false)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Erreur notes:', error);
    }
  };

  const loadDecisions = async () => {
    try {
      const { data, error } = await supabase
        .from('decisions')
        .select('*')
        .eq('archived', false)
        .in('statut', ['active', 'implementee'])
        .order('decision_date', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      setDecisions(data || []);
    } catch (error) {
      console.error('Erreur décisions:', error);
    }
  };

  const loadRDVs = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*, contacts(nom_complet)')
        .gte('happened_at', today)
        .lt('happened_at', tomorrow)
        .eq('type', 'meeting')
        .order('happened_at', { ascending: true });
      
      if (error) throw error;
      setRdvs(data || []);
    } catch (error) {
      console.error('Erreur RDVs:', error);
    }
  };

  const loadProspects = async () => {
    try {
      const last7days = new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('type_contact', 'prospect')
        .gte('date_premier_contact', last7days)
        .order('score_priorite', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      setProspects(data || []);
    } catch (error) {
      console.error('Erreur prospects:', error);
    }
  };

  const loadJournalOS = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('journal_os')
        .select('*')
        .eq('date', today)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      setJournalOS(data);
    } catch (error) {
      console.error('Erreur journal:', error);
    }
  };

  const loadPunchline = async (forceNew = false) => {
    try {
      const dateKey = new Date().toISOString().split('T')[0];
      
      if (!forceNew) {
        const stored = localStorage.getItem('punchline_date');
        if (stored === dateKey) {
          const storedPunchline = localStorage.getItem('punchline_text');
          if (storedPunchline) {
            setPunchline(storedPunchline);
            return;
          }
        }
      }
      
      const { data, error } = await supabase
        .from('affirmations')
        .select('citation')
        .order('numero', { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const date = new Date();
        const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        
        let index = dayOfYear % data.length;
        if (forceNew) {
          const currentIndex = parseInt(localStorage.getItem('punchline_index') || '0');
          index = (currentIndex + 1) % data.length;
        }
        
        const affirmation = data[index];
        const text = affirmation.citation;
        setPunchline(text);
        
        localStorage.setItem('punchline_date', dateKey);
        localStorage.setItem('punchline_text', text);
        localStorage.setItem('punchline_index', index.toString());
      }
    } catch (error) {
      console.error('Erreur punchline:', error);
    }
  };

  const loadFocusChart = async () => {
    try {
      const last7days = new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('journal_os')
        .select('date, overall_score, energy_score, work_score')
        .gte('date', last7days)
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      const chartData = (data || []).map((d: any) => ({
        date: new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        score: d.overall_score || 0,
        energy: d.energy_score || 0,
        work: d.work_score || 0
      }));
      
      setFocusData(chartData);
    } catch (error) {
      console.error('Erreur graphique:', error);
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'urgent': return 'bg-red-500';
      case 'a_planifier': return 'bg-yellow-500';
      case 'a_valider': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getTypeConcilBadge = (type: string) => {
    return type === 'petit_concil' 
      ? 'bg-yellow-100 text-yellow-800' 
      : 'bg-purple-100 text-purple-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              🏠 LMD Command Center
            </h1>
            <p className="text-blue-200">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <button
            onClick={loadAllData}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
          >
            🔄 Actualiser
          </button>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Trésorerie */}
          <Link href="/finances/new" className="block">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">💰</span>
                <span className="text-sm opacity-80">Ce mois • ➕</span>
              </div>
              <div className="text-3xl font-bold mb-1">
                {tresorerie ? `${tresorerie.net.toLocaleString('fr-FR')}€` : '...'}
              </div>
              <div className="text-sm opacity-90">
                {tresorerie && `↗ ${tresorerie.revenus.toLocaleString('fr-FR')}€ | ↘ ${tresorerie.depenses.toLocaleString('fr-FR')}€`}
              </div>
            </div>
          </Link>

          {/* Tâches */}
          <Link href="/taches" className="block">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">📋</span>
                <span className="text-sm opacity-80">Actives</span>
              </div>
              <div className="text-3xl font-bold mb-1">
                {tachesEnCours.length} en cours
              </div>
              <div className="text-sm opacity-90">
                {tachesUrgentes.length} urgentes
              </div>
            </div>
          </Link>

          {/* RDVs */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">👥</span>
              <span className="text-sm opacity-80">Aujourd'hui</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              {rdvs.length} RDV
            </div>
            <div className="text-sm opacity-90">
              {rdvs[0] && new Date(rdvs[0].happened_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Prospects */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                🎯 Prospects qualifiés (7 derniers jours)
              </h2>
              <Link
                href="/contacts/new"
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors"
              >
                ➕
              </Link>
            </div>
            {prospects.length > 0 ? (
              <div className="space-y-3">
                {prospects.map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                    <div>
                      <div className="font-semibold text-slate-900">{p.nom_complet}</div>
                      <div className="text-sm text-slate-600">{p.societe || 'Particulier'}</div>
                    </div>
                    <div className="text-2xl">
                      {p.score_priorite >= 8 ? '🔥' : p.score_priorite >= 5 ? '⭐' : '📌'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Aucun prospect récent</p>
            )}
          </div>

          {/* Tâches en cours */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">⏳ Tâches en cours</h2>
              <div className="flex gap-2">
                <Link
                  href="/taches"
                  className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-lg transition-colors"
                >
                  Voir tout
                </Link>
                <Link
                  href="/taches/new"
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors"
                >
                  ➕
                </Link>
              </div>
            </div>
            {tachesEnCours.length > 0 ? (
              <div className="space-y-2">
                {tachesEnCours.map(t => (
                  <Link 
                    key={t.id} 
                    href={`/taches/${t.id}`}
                    className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${getPrioriteColor(t.priorite)}`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900">{t.name}</div>
                      {t.deadline && (
                        <div className="text-xs text-slate-500">
                          📅 {new Date(t.deadline).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Aucune tâche en cours</p>
            )}
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Tâches urgentes */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">🔥 Tâches urgentes</h2>
              <Link
                href="/taches?filter=urgent"
                className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-lg transition-colors"
              >
                Voir tout
              </Link>
            </div>
            {tachesUrgentes.length > 0 ? (
              <div className="space-y-2">
                {tachesUrgentes.map(t => (
                  <Link 
                    key={t.id} 
                    href={`/taches/${t.id}`}
                    className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${getPrioriteColor(t.priorite)}`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900">{t.name}</div>
                      {t.deadline && (
                        <div className="text-xs text-red-600 font-semibold">
                          ⏰ {new Date(t.deadline).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Aucune tâche urgente</p>
            )}
          </div>

          {/* Notes récentes */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">📝 Notes récentes</h2>
              <div className="flex gap-2">
                <Link
                  href="/notes"
                  className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-lg transition-colors"
                >
                  Voir tout
                </Link>
                <Link
                  href="/notes/new"
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors"
                >
                  ➕
                </Link>
              </div>
            </div>
            {notes.length > 0 ? (
              <div className="space-y-2">
                {notes.map(n => (
                  <Link 
                    key={n.id} 
                    href={`/notes/${n.id}`}
                    className="block p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="text-sm font-medium text-slate-900">
                      {n.title || 'Sans titre'}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1">
                      {n.content.substring(0, 100)}...
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Aucune note</p>
            )}
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Décisions */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">🧠 Décisions actives</h2>
              <div className="flex gap-2">
                <Link
                  href="/decisions"
                  className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-lg transition-colors"
                >
                  Voir tout
                </Link>
                <Link
                  href="/decisions/new"
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors"
                >
                  ➕
                </Link>
              </div>
            </div>
            {decisions.length > 0 ? (
              <div className="space-y-2">
                {decisions.map(d => (
                  <Link 
                    key={d.id} 
                    href={`/decisions/${d.id}`}
                    className="block p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-1 rounded ${getTypeConcilBadge(d.type_concil)}`}>
                        {d.type_concil === 'petit_concil' ? '🟡 Petit Concil' : '🔴 Grand Concil'}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-900">{d.title}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">
                      {d.decision.substring(0, 80)}...
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Aucune décision active</p>
            )}
          </div>

          {/* Journal OS */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">📊 Journal OS</h2>
              <Link
                href="/journal"
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors"
              >
                ➕ Saisir
              </Link>
            </div>
            {journalOS ? (
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-1">
                    {journalOS.overall_score}/10
                  </div>
                  <div className="text-sm text-slate-600">Score global</div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Énergie</span>
                      <span className="font-semibold">{journalOS.energy_score}/10</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{width: `${(journalOS.energy_score || 0) * 10}%`}}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Travail</span>
                      <span className="font-semibold">{journalOS.work_score}/10</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{width: `${(journalOS.work_score || 0) * 10}%`}}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Sommeil</span>
                      <span className="font-semibold">{journalOS.hours_sleep}h</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{width: `${Math.min((journalOS.hours_sleep || 0) / 10 * 100, 100)}%`}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Aucune entrée aujourd'hui</p>
            )}
          </div>
        </div>

        {/* Punchline */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 shadow-xl text-white mb-6 flex flex-col relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">💪 Punchline</h2>
            <button
              onClick={() => loadPunchline(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg transition-colors text-sm"
            >
              🔄 Suivante
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-medium italic leading-relaxed">
                {punchline || 'Chargement...'}
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        {focusData.length > 0 && (
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-4">📈 Évolution (7 derniers jours)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={focusData}>
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis domain={[0, 10]} stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} name="Score global" />
                <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} name="Énergie" />
                <Line type="monotone" dataKey="work" stroke="#f59e0b" strokeWidth={2} name="Travail" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>
    </div>
  );
}
