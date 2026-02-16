'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../../app/globals.css';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function JournalOS() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [existingEntry, setExistingEntry] = useState<any>(null);
  
  // Date
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  
  // Scores (0-10)
  const [overallScore, setOverallScore] = useState(5);
  const [energyScore, setEnergyScore] = useState(5);
  const [workScore, setWorkScore] = useState(5);
  const [nutritionScore, setNutritionScore] = useState(5);
  const [sleepScore, setSleepScore] = useState(5);
  const [mindsetScore, setMindsetScore] = useState(5);
  const [relationshipScore, setRelationshipScore] = useState(5);
  const [peaceScore, setPeaceScore] = useState(5);
  const [loveScore, setLoveScore] = useState(5);
  const [joyScore, setJoyScore] = useState(5);
  
  // Textes
  const [notes, setNotes] = useState('');
  const [focus, setFocus] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [intentions, setIntentions] = useState('');
  
  // Sommeil
  const [hoursSleep, setHoursSleep] = useState(7);
  const [sleepQuality, setSleepQuality] = useState('good');
  
  // Habitudes wellness
  const [meditation, setMeditation] = useState(false);
  const [meditationMinutes, setMeditationMinutes] = useState(0);
  const [breathwork, setBreathwork] = useState(false);
  const [coldShower, setColdShower] = useState(false);
  const [sunshine30min, setSunshine30min] = useState(false);
  
  // Nutrition
  const [water2l, setWater2l] = useState(false);
  const [vegetables, setVegetables] = useState(false);
  const [fruits, setFruits] = useState(false);
  const [noBread, setNoBread] = useState(false);
  const [noPasta, setNoPasta] = useState(false);
  
  // Sport
  const [workout, setWorkout] = useState(false);
  const [quickRun, setQuickRun] = useState(false);
  const [walk, setWalk] = useState(false);
  
  // Travail
  const [deepWorkHours, setDeepWorkHours] = useState(0);
  const [clientCalls, setClientCalls] = useState(0);
  
  // Spirituel
  const [prieres, setPrieres] = useState(0);
  const [visualisation, setVisualisation] = useState(false);
  
  // Discipline
  const [noPorn, setNoPorn] = useState(true);
  const [noAlcool, setNoAlcool] = useState(true);
  const [noSmoke, setNoSmoke] = useState(true);

  // Check si entrée existe déjà
  useEffect(() => {
    const checkExisting = async () => {
      const { data, error } = await supabase
        .from('journal_os')
        .select('*')
        .eq('date', date)
        .maybeSingle();
      
      if (data) {
        setExistingEntry(data);
        // Charger les valeurs existantes
        setOverallScore(data.overall_score || 5);
        setEnergyScore(data.energy_score || 5);
        setWorkScore(data.work_score || 5);
        setNutritionScore(data.nutrition_score || 5);
        setSleepScore(data.sleep_score || 5);
        setMindsetScore(data.mindset_score || 5);
        setRelationshipScore(data.relationship_score || 5);
        setPeaceScore(data.peace_score || 5);
        setLoveScore(data.love_score || 5);
        setJoyScore(data.joy_score || 5);
        setNotes(data.notes || '');
        setFocus(data.focus || '');
        setGratitude(data.gratitude || '');
        setIntentions(data.intentions || '');
        setHoursSleep(data.hours_sleep || 7);
        setSleepQuality(data.sleep_quality || 'good');
        setMeditation(data.meditation || false);
        setMeditationMinutes(data.meditation_minutes || 0);
        setBreathwork(data.breathwork || false);
        setColdShower(data.cold_shower || false);
        setSunshine30min(data.sunshine_30min || false);
        setWater2l(data.water_2l || false);
        setVegetables(data.vegetables || false);
        setFruits(data.fruits || false);
        setNoBread(data.no_bread || false);
        setNoPasta(data.no_pasta || false);
        setWorkout(data.workout || false);
        setQuickRun(data.quick_run || false);
        setWalk(data.walk || false);
        setDeepWorkHours(data.deep_work_hours || 0);
        setClientCalls(data.client_calls || 0);
        setPrieres(data.prieres || 0);
        setVisualisation(data.visualisation || false);
        setNoPorn(data.no_porn ?? true);
        setNoAlcool(data.no_alcool ?? true);
        setNoSmoke(data.no_smoke ?? true);
      }
    };
    
    checkExisting();
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    const journalData = {
      date,
      overall_score: overallScore,
      energy_score: energyScore,
      work_score: workScore,
      nutrition_score: nutritionScore,
      sleep_score: sleepScore,
      mindset_score: mindsetScore,
      relationship_score: relationshipScore,
      peace_score: peaceScore,
      love_score: loveScore,
      joy_score: joyScore,
      notes,
      focus,
      gratitude,
      intentions,
      hours_sleep: hoursSleep,
      sleep_quality: sleepQuality,
      meditation,
      meditation_minutes: meditation ? meditationMinutes : 0,
      breathwork,
      cold_shower: coldShower,
      sunshine_30min: sunshine30min,
      water_2l: water2l,
      vegetables,
      fruits,
      no_bread: noBread,
      no_pasta: noPasta,
      workout,
      quick_run: quickRun,
      walk,
      deep_work_hours: deepWorkHours,
      client_calls: clientCalls,
      prieres,
      visualisation,
      no_porn: noPorn,
      no_alcool: noAlcool,
      no_smoke: noSmoke
    };

    try {
      if (existingEntry) {
        // Update
        const { error: updateError } = await supabase
          .from('journal_os')
          .update(journalData)
          .eq('id', existingEntry.id);
        
        if (updateError) throw updateError;
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from('journal_os')
          .insert([journalData]);
        
        if (insertError) throw insertError;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const ScoreSlider = ({ label, value, onChange }: any) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-lg font-bold text-blue-600">{value}/10</span>
      </div>
      <input
        type="range"
        min="0"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  );

  const Checkbox = ({ label, checked, onChange }: any) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-blue-200 hover:text-white text-sm mb-2 inline-block">
              ← Retour au dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              📊 Journal OS
            </h1>
            <p className="text-blue-200 mt-2">
              {existingEntry ? '✏️ Modifier l\'entrée existante' : '✨ Nouvelle entrée'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Date */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Scores principaux */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">🎯 Scores du jour</h2>
            <ScoreSlider label="Score Global" value={overallScore} onChange={setOverallScore} />
            <ScoreSlider label="⚡ Énergie" value={energyScore} onChange={setEnergyScore} />
            <ScoreSlider label="💼 Travail" value={workScore} onChange={setWorkScore} />
            <ScoreSlider label="🥗 Nutrition" value={nutritionScore} onChange={setNutritionScore} />
            <ScoreSlider label="😴 Sommeil" value={sleepScore} onChange={setSleepScore} />
            <ScoreSlider label="🧠 Mindset" value={mindsetScore} onChange={setMindsetScore} />
            <ScoreSlider label="❤️ Relations" value={relationshipScore} onChange={setRelationshipScore} />
            <ScoreSlider label="☮️ Paix intérieure" value={peaceScore} onChange={setPeaceScore} />
            <ScoreSlider label="💖 Amour" value={loveScore} onChange={setLoveScore} />
            <ScoreSlider label="😊 Joie" value={joyScore} onChange={setJoyScore} />
          </div>

          {/* Sommeil */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">😴 Sommeil</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Heures de sommeil : {hoursSleep}h
              </label>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={hoursSleep}
                onChange={(e) => setHoursSleep(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Qualité du sommeil
              </label>
              <select
                value={sleepQuality}
                onChange={(e) => setSleepQuality(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Bon</option>
                <option value="average">Moyen</option>
                <option value="poor">Mauvais</option>
              </select>
            </div>
          </div>

          {/* Habitudes Wellness */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-4">🧘 Wellness</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Checkbox label="🧘 Méditation" checked={meditation} onChange={setMeditation} />
              {meditation && (
                <div className="col-span-2">
                  <label className="block text-sm text-slate-600 mb-1">
                    Durée méditation (minutes)
                  </label>
                  <input
                    type="number"
                    value={meditationMinutes}
                    onChange={(e) => setMeditationMinutes(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              )}
              <Checkbox label="🌬️ Breathwork" checked={breathwork} onChange={setBreathwork} />
              <Checkbox label="❄️ Douche froide" checked={coldShower} onChange={setColdShower} />
              <Checkbox label="☀️ 30min soleil" checked={sunshine30min} onChange={setSunshine30min} />
              <Checkbox label="🙏 Visualisation" checked={visualisation} onChange={setVisualisation} />
            </div>
          </div>

          {/* Nutrition */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-4">🥗 Nutrition</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Checkbox label="💧 2L d'eau" checked={water2l} onChange={setWater2l} />
              <Checkbox label="🥦 Légumes" checked={vegetables} onChange={setVegetables} />
              <Checkbox label="🍎 Fruits" checked={fruits} onChange={setFruits} />
              <Checkbox label="🚫 Pas de pain" checked={noBread} onChange={setNoBread} />
              <Checkbox label="🚫 Pas de pâtes" checked={noPasta} onChange={setNoPasta} />
            </div>
          </div>

          {/* Sport */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-4">💪 Sport</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Checkbox label="🏋️ Workout" checked={workout} onChange={setWorkout} />
              <Checkbox label="🏃 Course rapide" checked={quickRun} onChange={setQuickRun} />
              <Checkbox label="🚶 Marche" checked={walk} onChange={setWalk} />
            </div>
          </div>

          {/* Travail */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">💼 Travail</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Heures de deep work
              </label>
              <input
                type="number"
                min="0"
                max="12"
                step="0.5"
                value={deepWorkHours}
                onChange={(e) => setDeepWorkHours(parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre d'appels clients
              </label>
              <input
                type="number"
                min="0"
                value={clientCalls}
                onChange={(e) => setClientCalls(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Spirituel */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">🙏 Spirituel</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre de prières
              </label>
              <input
                type="number"
                min="0"
                value={prieres}
                onChange={(e) => setPrieres(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Discipline */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-4">💎 Discipline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Checkbox label="🚫 Pas de porn" checked={noPorn} onChange={setNoPorn} />
              <Checkbox label="🚫 Pas d'alcool" checked={noAlcool} onChange={setNoAlcool} />
              <Checkbox label="🚫 Pas de cigarette" checked={noSmoke} onChange={setNoSmoke} />
            </div>
          </div>

          {/* Notes libres */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">📝 Notes</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                🎯 Focus du jour
              </label>
              <input
                type="text"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder="Sur quoi te concentres-tu aujourd'hui ?"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                🙏 Gratitude
              </label>
              <textarea
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="Pour quoi es-tu reconnaissant aujourd'hui ?"
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                🎯 Intentions
              </label>
              <textarea
                value={intentions}
                onChange={(e) => setIntentions(e.target.value)}
                placeholder="Quelles sont tes intentions pour demain ?"
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                📓 Notes générales
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tes notes du jour..."
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Enregistrement...' : existingEntry ? '✏️ Modifier' : '💾 Enregistrer'}
            </button>
            
            <Link
              href="/"
              className="px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors text-center"
            >
              Annuler
            </Link>
          </div>

          {/* Messages */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              ✅ Enregistré ! Redirection vers le dashboard...
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              ❌ Erreur : {error}
            </div>
          )}
        </form>

      </div>
    </div>
  );
}
