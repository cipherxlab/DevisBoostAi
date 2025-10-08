# Google Vision API - Informations Collectées

## 🎯 Fonctionnalités Disponibles

### Object Localization (Détection d'Objets)
- **Capacité** : Détecte et localise plusieurs objets dans une image
- **Usage pour plomberie** : Peut identifier robinets, lavabos, WC, tuyaux, etc.
- **Précision** : Bonne pour objets courants, peut nécessiter entraînement pour spécialisation plomberie

### Label Detection (Étiquetage)
- **Capacité** : Identifie le contenu général de l'image avec des labels
- **Usage** : Peut classifier "bathroom", "kitchen", "plumbing", etc.

### Text Detection (OCR)
- **Capacité** : Extrait le texte visible dans l'image
- **Usage** : Peut lire marques, modèles, références sur équipements

## 💰 Tarification (USD)

| Fonctionnalité | 1000 premières/mois | 1001-5M/mois | +5M/mois |
|----------------|---------------------|---------------|----------|
| **Object Localization** | GRATUIT | $2.25/1000 | $1.50/1000 |
| Label Detection | GRATUIT | $1.50/1000 | $1.00/1000 |
| Text Detection | GRATUIT | $1.50/1000 | $0.60/1000 |

## 📈 Calcul Coût MVP DevisBoostAI

**Estimation usage :**
- 100 photos analysées/jour
- 3000 photos/mois
- Utilisation Object Localization + Label Detection

**Coût mensuel :**
- 1000 premières : GRATUIT
- 2000 suivantes Object Localization : 2000 × ($2.25/1000) = $4.50
- 2000 suivantes Label Detection : 2000 × ($1.50/1000) = $3.00
- **Total : ~$7.50/mois (≈ 7€)**

## 🔧 Intégration Technique

### Prérequis
1. Compte Google Cloud Platform
2. Activation de l'API Vision
3. Clé API ou authentification OAuth
4. Crédit gratuit $300 pour commencer

### Endpoint API
```
POST https://vision.googleapis.com/v1/images:annotate
```

### Exemple Requête
```javascript
{
  "requests": [
    {
      "image": {
        "content": "base64_encoded_image"
      },
      "features": [
        {
          "type": "OBJECT_LOCALIZATION",
          "maxResults": 10
        },
        {
          "type": "LABEL_DETECTION",
          "maxResults": 10
        }
      ]
    }
  ]
}
```

## ✅ Avantages pour DevisBoostAI

1. **Reconnaissance réelle** : Fini les simulations, vraie IA
2. **Coût maîtrisé** : 7€/mois pour 3000 analyses
3. **Scalable** : Prix dégressifs avec le volume
4. **Fiable** : Infrastructure Google, 99.9% uptime
5. **Rapide** : Réponse en <2 secondes

## 🚨 Limitations Identifiées

1. **Spécialisation** : Pas spécialement entraîné pour plomberie
2. **Précision variable** : Peut confondre certains équipements
3. **Dépendance** : Nécessite connexion internet
4. **Coût croissant** : Plus d'usage = plus cher

## 🎯 Recommandation

**ADOPTER** Google Vision API pour le MVP car :
- Coût très raisonnable pour commencer
- Amélioration immédiate vs simulation actuelle
- Possibilité d'optimiser plus tard avec modèle custom
