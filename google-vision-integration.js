/**
 * Google Vision API Integration pour DevisBoostAI
 * Reconnaissance réelle d'équipements plomberie via IA
 */

class GoogleVisionIntegration {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://vision.googleapis.com/v1/images:annotate';
        
        // Mapping spécialisé plomberie
        this.plumbingMapping = {
            // Sanitaires
            'toilet': { category: 'sanitaires', item: 'wc_suspendu', confidence: 0.9 },
            'sink': { category: 'sanitaires', item: 'lavabo_ceramique', confidence: 0.9 },
            'washbasin': { category: 'sanitaires', item: 'lavabo_ceramique', confidence: 0.9 },
            'bathtub': { category: 'douche_baignoire', item: 'baignoire_acrylique', confidence: 0.9 },
            'shower': { category: 'douche_baignoire', item: 'receveur_douche', confidence: 0.8 },
            
            // Robinetterie
            'faucet': { category: 'robinetterie', item: 'mitigeur_lavabo', confidence: 0.9 },
            'tap': { category: 'robinetterie', item: 'robinet_simple', confidence: 0.8 },
            'mixer': { category: 'robinetterie', item: 'mitigeur_evier', confidence: 0.8 },
            'showerhead': { category: 'robinetterie', item: 'douchette_main', confidence: 0.8 },
            
            // Tuyauterie
            'pipe': { category: 'tuyauterie', item: 'tube_cuivre_16', confidence: 0.7 },
            'plumbing': { category: 'tuyauterie', item: 'tube_pvc_100', confidence: 0.7 },
            'drain': { category: 'evacuation', item: 'siphon_lavabo', confidence: 0.8 },
            
            // Chauffage
            'radiator': { category: 'chauffage', item: 'radiateur_acier', confidence: 0.9 },
            'boiler': { category: 'chauffage', item: 'chauffe_eau_100l', confidence: 0.8 },
            'water heater': { category: 'chauffage', item: 'chauffe_eau_200l', confidence: 0.8 }
        };
        
        // Mots-clés de contexte pour améliorer la précision
        this.contextKeywords = {
            bathroom: ['bathroom', 'toilet', 'washroom', 'restroom'],
            kitchen: ['kitchen', 'sink', 'cooking'],
            repair: ['broken', 'damaged', 'leak', 'repair', 'fix'],
            installation: ['new', 'install', 'replace', 'mount']
        };
    }

    /**
     * Analyser une image avec Google Vision API
     * @param {string} imageBase64 - Image encodée en base64
     * @param {string} context - Contexte fourni par l'utilisateur (optionnel)
     * @returns {Promise<Object>} Résultat d'analyse avec équipements détectés
     */
    async analyzeImage(imageBase64, context = '') {
        try {
            const requestBody = {
                requests: [{
                    image: {
                        content: imageBase64
                    },
                    features: [
                        {
                            type: 'OBJECT_LOCALIZATION',
                            maxResults: 10
                        },
                        {
                            type: 'LABEL_DETECTION', 
                            maxResults: 15
                        },
                        {
                            type: 'TEXT_DETECTION',
                            maxResults: 5
                        }
                    ]
                }]
            };

            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Google Vision API error: ${response.status}`);
            }

            const data = await response.json();
            return this.processVisionResults(data.responses[0], context);

        } catch (error) {
            console.error('Erreur Google Vision API:', error);
            return {
                success: false,
                error: error.message,
                fallback: this.getFallbackAnalysis(context)
            };
        }
    }

    /**
     * Traiter les résultats de Google Vision API
     * @param {Object} visionResponse - Réponse brute de l'API
     * @param {string} context - Contexte utilisateur
     * @returns {Object} Analyse structurée pour DevisBoostAI
     */
    processVisionResults(visionResponse, context) {
        const detectedEquipments = [];
        const confidence = { total: 0, count: 0 };
        
        // Analyser les objets localisés
        if (visionResponse.localizedObjectAnnotations) {
            visionResponse.localizedObjectAnnotations.forEach(obj => {
                const mapping = this.findPlumbingMapping(obj.name.toLowerCase());
                if (mapping) {
                    detectedEquipments.push({
                        type: 'object',
                        name: obj.name,
                        category: mapping.category,
                        item: mapping.item,
                        confidence: obj.score * mapping.confidence,
                        location: obj.boundingPoly
                    });
                    confidence.total += obj.score * mapping.confidence;
                    confidence.count++;
                }
            });
        }

        // Analyser les labels
        if (visionResponse.labelAnnotations) {
            visionResponse.labelAnnotations.forEach(label => {
                const mapping = this.findPlumbingMapping(label.description.toLowerCase());
                if (mapping) {
                    // Éviter les doublons
                    const exists = detectedEquipments.find(eq => 
                        eq.category === mapping.category && eq.item === mapping.item
                    );
                    
                    if (!exists) {
                        detectedEquipments.push({
                            type: 'label',
                            name: label.description,
                            category: mapping.category,
                            item: mapping.item,
                            confidence: label.score * mapping.confidence
                        });
                        confidence.total += label.score * mapping.confidence;
                        confidence.count++;
                    }
                }
            });
        }

        // Analyser le texte détecté (marques, modèles)
        let detectedText = '';
        if (visionResponse.textAnnotations && visionResponse.textAnnotations.length > 0) {
            detectedText = visionResponse.textAnnotations[0].description;
        }

        // Améliorer avec le contexte utilisateur
        const contextAnalysis = this.analyzeContext(context, detectedText);
        
        // Calculer la confiance globale
        const globalConfidence = confidence.count > 0 ? confidence.total / confidence.count : 0;

        return {
            success: true,
            equipments: detectedEquipments,
            context: contextAnalysis,
            detectedText: detectedText,
            confidence: globalConfidence,
            recommendations: this.generateRecommendations(detectedEquipments, contextAnalysis),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Trouver le mapping plomberie pour un terme détecté
     * @param {string} term - Terme détecté par l'IA
     * @returns {Object|null} Mapping correspondant
     */
    findPlumbingMapping(term) {
        // Recherche exacte
        if (this.plumbingMapping[term]) {
            return this.plumbingMapping[term];
        }

        // Recherche partielle
        for (const [key, mapping] of Object.entries(this.plumbingMapping)) {
            if (term.includes(key) || key.includes(term)) {
                return { ...mapping, confidence: mapping.confidence * 0.8 }; // Réduire confiance
            }
        }

        // Recherche par synonymes
        const synonyms = {
            'washbasin': 'sink',
            'basin': 'sink',
            'lavatory': 'toilet',
            'water closet': 'toilet',
            'spigot': 'faucet',
            'valve': 'faucet'
        };

        if (synonyms[term] && this.plumbingMapping[synonyms[term]]) {
            return { ...this.plumbingMapping[synonyms[term]], confidence: 0.7 };
        }

        return null;
    }

    /**
     * Analyser le contexte fourni par l'utilisateur
     * @param {string} context - Contexte utilisateur
     * @param {string} detectedText - Texte détecté dans l'image
     * @returns {Object} Analyse du contexte
     */
    analyzeContext(context, detectedText) {
        const analysis = {
            location: 'unknown',
            urgency: 'normal',
            action: 'unknown',
            keywords: []
        };

        const fullText = `${context} ${detectedText}`.toLowerCase();

        // Détecter le lieu
        if (this.contextKeywords.bathroom.some(kw => fullText.includes(kw))) {
            analysis.location = 'bathroom';
        } else if (this.contextKeywords.kitchen.some(kw => fullText.includes(kw))) {
            analysis.location = 'kitchen';
        }

        // Détecter l'urgence
        if (this.contextKeywords.repair.some(kw => fullText.includes(kw))) {
            analysis.urgency = 'high';
            analysis.action = 'repair';
        } else if (this.contextKeywords.installation.some(kw => fullText.includes(kw))) {
            analysis.action = 'installation';
        }

        // Extraire mots-clés pertinents
        const words = fullText.split(/\s+/);
        analysis.keywords = words.filter(word => 
            word.length > 3 && 
            (word.includes('plomb') || word.includes('eau') || word.includes('fuite'))
        );

        return analysis;
    }

    /**
     * Générer des recommandations basées sur l'analyse
     * @param {Array} equipments - Équipements détectés
     * @param {Object} context - Analyse du contexte
     * @returns {Array} Recommandations
     */
    generateRecommendations(equipments, context) {
        const recommendations = [];

        equipments.forEach(equipment => {
            if (context.urgency === 'high') {
                recommendations.push(`Intervention urgente requise pour ${equipment.name}`);
            }

            if (context.location === 'bathroom' && equipment.category === 'robinetterie') {
                recommendations.push('Vérifier l\'étanchéité et les joints');
            }

            if (equipment.confidence < 0.6) {
                recommendations.push(`Vérification manuelle recommandée pour ${equipment.name}`);
            }
        });

        return recommendations;
    }

    /**
     * Analyse de fallback en cas d'échec de l'API
     * @param {string} context - Contexte utilisateur
     * @returns {Object} Analyse basique
     */
    getFallbackAnalysis(context) {
        return {
            success: false,
            equipments: [{
                type: 'fallback',
                name: 'Équipement plomberie',
                category: 'divers',
                item: 'intervention_standard',
                confidence: 0.3
            }],
            context: this.analyzeContext(context, ''),
            message: 'Analyse automatique indisponible, estimation basique fournie'
        };
    }

    /**
     * Convertir l'analyse en format compatible avec ai-processor.js
     * @param {Object} analysis - Résultat d'analyse
     * @returns {Array} Éléments pour le devis
     */
    convertToQuoteElements(analysis) {
        const elements = [];

        analysis.equipments.forEach(equipment => {
            // Rechercher dans la base de prix existante
            const priceData = window.plumbingDatabase?.find(item => 
                item.id === equipment.item
            );

            if (priceData) {
                elements.push({
                    description: `${equipment.name} - ${priceData.description}`,
                    category: equipment.category,
                    price: priceData.price,
                    installTime: priceData.installTime,
                    confidence: equipment.confidence,
                    source: 'google_vision'
                });
            }
        });

        return elements;
    }
}

// Export pour utilisation dans l'application
window.GoogleVisionIntegration = GoogleVisionIntegration;

// Configuration par défaut
window.visionConfig = {
    // Clé API à configurer
    apiKey: '', // À remplir avec votre clé Google Cloud
    
    // Seuils de confiance
    confidenceThresholds: {
        high: 0.8,
        medium: 0.6,
        low: 0.4
    },
    
    // Paramètres d'analyse
    maxResults: {
        objects: 10,
        labels: 15,
        text: 5
    }
};

console.log('✅ Google Vision API Integration chargée');
