# 📝 MISE À JOUR : Formulaire Journal OS

## ✨ Nouveauté ajoutée

**Page de saisie Journal OS** : `/journal`

Formulaire complet pour saisir votre journal quotidien avec :
- 📊 10 scores (slider 0-10)
- ✅ Habitudes (wellness, nutrition, sport)
- 💼 Métriques travail
- 🙏 Spiritualité
- 📝 Notes libres

---

## 🚀 Comment déployer cette mise à jour

### Option A : Via GitHub (recommandé)

1. **Supprimez tous les fichiers** actuels de votre repo GitHub
2. **Uploadez tous les fichiers** de ce dossier `lmd-dashboard-update`
3. **Vercel redéploie automatiquement**

### Option B : Via ligne de commande

```bash
cd lmd-command-center
git rm -r .
cp -r /chemin/vers/lmd-dashboard-update/* .
git add .
git commit -m "Ajout formulaire Journal OS"
git push
```

---

## 📱 Utilisation

### Depuis le dashboard

1. Dans la section **"📊 Journal OS"**, cliquez sur **"➕ Saisir"**
2. Remplissez le formulaire
3. Cliquez sur **"💾 Enregistrer"**
4. Retour automatique au dashboard

### URL directe

https://votre-app.vercel.app/journal

---

## ✨ Fonctionnalités

### Détection automatique

- Si une entrée existe pour la date sélectionnée → Mode **édition**
- Sinon → Mode **création**

### Champs inclus

**Scores (sliders)** :
- Score global
- Énergie, Travail, Nutrition, Sommeil
- Mindset, Relations, Paix, Amour, Joie

**Habitudes Wellness** :
- Méditation (+ durée)
- Breathwork
- Douche froide
- Soleil 30min
- Visualisation

**Nutrition** :
- 2L d'eau
- Légumes, Fruits
- Restrictions (pain, pâtes)

**Sport** :
- Workout, Course, Marche

**Travail** :
- Heures deep work
- Nombre appels clients

**Spirituel** :
- Nombre de prières

**Discipline** :
- Abstinences (porn, alcool, tabac)

**Notes libres** :
- Focus du jour
- Gratitude
- Intentions
- Notes générales

---

## 🎯 Améliorations futures possibles

- [ ] Bouton "Dupliquer hier" pour pré-remplir
- [ ] Historique des 7 derniers jours
- [ ] Statistiques mensuelles
- [ ] Export PDF mensuel
- [ ] Rappel quotidien (notification)

---

Fait avec ❤️ par Claude
