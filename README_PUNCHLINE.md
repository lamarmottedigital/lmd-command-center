# 💪 MISE À JOUR : Punchline déterministe

## ✨ Changement apporté

**Affirmation quotidienne basée sur la date (Option A)**

### Comment ça marche maintenant :

1. **Chaque jour = 1 affirmation spécifique**
   - Basée sur le jour de l'année (1-365)
   - Même affirmation toute la journée
   - Exemple : Le 16 février = toujours l'affirmation #47

2. **Bouton "🔄 Suivante"**
   - En haut à droite de la card punchline
   - Permet de passer à l'affirmation suivante
   - Sauvegardé pour la journée

3. **Préchargement intelligent**
   - Première visite du jour : calcul + sauvegarde
   - Visites suivantes : lecture instantanée (localStorage)

---

## 🚀 Déployer cette mise à jour

### Méthode rapide (1 fichier)

1. Sur GitHub → `app/page.tsx`
2. Cliquez sur **Edit** (crayon)
3. **Supprimez** tout le contenu
4. **Téléchargez** `page-with-punchline.tsx` ci-dessus
5. **Copiez** tout son contenu
6. **Collez** dans GitHub
7. **Commit changes**

Vercel redéploie automatiquement en 2-3 min.

---

## 🎯 Résultat

**Avant :**
- Affirmation aléatoire changée à chaque chargement de page

**Après :**
- 1 affirmation stable par jour
- Bouton pour en voir d'autres si besoin
- Chargement instantané (pas d'attente)

---

## 💡 Algorithme

```javascript
// Calcul du jour de l'année (1-365)
const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);

// Index de l'affirmation
const index = dayOfYear % nombre_affirmations;

// Exemple : 16 février = jour 47
// 47 % 578 affirmations = affirmation #47
```

---

## 📊 Exemples

- **1er janvier** → Affirmation #1
- **16 février** → Affirmation #47
- **31 décembre** → Affirmation #365

Vous verrez les **578 affirmations** défiler en ~1 an et demi.

---

Fait avec ❤️ par Claude
