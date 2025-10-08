/**
 * AI Processor avec Google Vision API Integration
 * Version améliorée pour DevisBoostAI avec reconnaissance photo réelle
 */

// Import de la base de données plomberie existante
const plumbingDatabase = [
    // SANITAIRES
    { id: 'wc_suspendu', category: 'sanitaires', description: 'WC suspendu avec bâti-support', price: 280, installTime: 180, synonyms: ['wc', 'toilette', 'toilet'] },
    { id: 'lavabo_ceramique', category: 'sanitaires', description: 'Lavabo céramique 60cm avec colonne', price: 150, installTime: 120, synonyms: ['lavabo', 'vasque', 'sink'] },
    { id: 'bidet_ceramique', category: 'sanitaires', description: 'Bidet céramique blanc', price: 180, installTime: 90, synonyms: ['bidet'] },
    { id: 'urinoir_ceramique', category: 'sanitaires', description: 'Urinoir céramique avec chasse', price: 220, installTime: 100, synonyms: ['urinoir'] },
    
    // ROBINETTERIE
    { id: 'mitigeur_lavabo', category: 'robinetterie', description: 'Mitigeur lavabo chromé bec fixe', price: 85, installTime: 45, synonyms: ['mitigeur', 'robinet lavabo', 'faucet'] },
    { id: 'mitigeur_evier', category: 'robinetterie', description: 'Mitigeur évier douchette extractible', price: 120, installTime: 60, synonyms: ['robinet évier', 'mitigeur cuisine'] },
    { id: 'mitigeur_douche', category: 'robinetterie', description: 'Mitigeur douche thermostatique', price: 160, installTime: 75, synonyms: ['robinet douche', 'mitigeur thermostatique'] },
    { id: 'robinet_simple', category: 'robinetterie', description: 'Robinet simple eau froide', price: 35, installTime: 30, synonyms: ['robinet simple', 'tap'] },
    { id: 'douchette_main', category: 'robinetterie', description: 'Douchette à main 3 jets', price: 45, installTime: 15, synonyms: ['douchette', 'pommeau douche', 'showerhead'] },
    
    // DOUCHE & BAIGNOIRE
    { id: 'receveur_douche', category: 'douche_baignoire', description: 'Receveur douche 90x90 extra-plat', price: 180, installTime: 120, synonyms: ['receveur', 'bac douche', 'shower'] },
    { id: 'cabine_douche', category: 'douche_baignoire', description: 'Cabine douche complète 90x90', price: 450, installTime: 240, synonyms: ['cabine douche', 'paroi douche'] },
    { id: 'baignoire_acrylique', category: 'douche_baignoire', description: 'Baignoire acrylique 170x70', price: 320, installTime: 180, synonyms: ['baignoire', 'bain', 'bathtub'] },
    
    // TUYAUTERIE
    { id: 'tube_cuivre_16', category: 'tuyauterie', description: 'Tube cuivre écroui Ø16 (ml)', price: 8, installTime: 5, synonyms: ['tube cuivre', 'tuyau cuivre', 'pipe'] },
    { id: 'tube_pvc_100', category: 'tuyauterie', description: 'Tube PVC évacuation Ø100 (ml)', price: 12, installTime: 8, synonyms: ['tube pvc', 'tuyau pvc', 'plumbing'] },
    { id: 'tube_per_16', category: 'tuyauterie', description: 'Tube PER Ø16 avec gaine (ml)', price: 6, installTime: 4, synonyms: ['tube per', 'per'] },
    
    // ÉVACUATION
    { id: 'siphon_lavabo', category: 'evacuation', description: 'Siphon lavabo réglable chromé', price: 25, installTime: 20, synonyms: ['siphon', 'drain'] },
    { id: 'bonde_douche', category: 'evacuation', description: 'Bonde de douche Ø90 inox', price: 35, installTime: 30, synonyms: ['bonde', 'évacuation douche'] },
    { id: 'grille_evacuation', category: 'evacuation', description: 'Grille évacuation sol 150x150', price: 18, installTime: 15, synonyms: ['grille', 'évacuation sol'] },
    
    // CHAUFFAGE
    { id: 'radiateur_acier', category: 'chauffage', description: 'Radiateur acier 600x1000 1200W', price: 180, installTime: 90, synonyms: ['radiateur', 'chauffage', 'radiator'] },
    { id: 'chauffe_eau_100l', category: 'chauffage', description: 'Chauffe-eau électrique 100L', price: 280, installTime: 150, synonyms: ['chauffe-eau', 'ballon eau chaude', 'boiler'] },
    { id: 'chauffe_eau_200l', category: 'chauffage', description: 'Chauffe-eau électrique 200L', price: 420, installTime: 180, synonyms: ['chauffe-eau 200l', 'water heater'] },
    
    // SERVICES
    { id: 'debouchage_canalisation', category: 'services', description: 'Débouchage canalisation haute pression', price: 120, installTime: 60, synonyms: ['débouchage', 'déboucher'] },
    { id: 'detartrage_chauffe_eau', category: 'services', description: 'Détartrage chauffe-eau complet', price: 150, installTime: 120, synonyms: ['détartrage', 'entretien'] },
    { id: 'reparation_fuite', category: 'services', description: 'Réparation fuite avec joint', price: 80, installTime: 45, synonyms: ['réparation', 'fuite', 'repair'] }
];

class AIProcessorWithVision {
    constructor() {
        this.database = plumbingDatabase;
        this.visionIntegration = null;
        this.initializeVision();
    }

    /**
     * Initialiser l'intégration Google Vision
     */
    async initializeVision() {
        if (window.GoogleVisionIntegration && window.visionConfig.apiKey) {
            this.visionIntegration = new GoogleVisionIntegration(window.visionConfig.apiKey);
            console.log('✅ Google Vision API initialisée');
        } else {
            console.warn('⚠️ Google Vision API non configurée, utilisation du mode simulation');
        }
    }

    /**
     * Analyser une photo avec Google Vision API
     * @param {File} imageFile - Fichier image
     * @param {string} context - Contexte utilisateur
     * @returns {Promise<Object>} Analyse complète
     */
    async analyzePhoto(imageFile, context = '') {
        try {
            // Convertir l'image en base64
            const base64Image = await this.fileToBase64(imageFile);
            
            if (this.visionIntegration) {
                // Utiliser Google Vision API
                console.log('🔍 Analyse avec Google Vision API...');
                const visionResult = await this.visionIntegration.analyzeImage(base64Image, context);
                
                if (visionResult.success) {
                    // Convertir en éléments de devis
                    const quoteElements = this.visionIntegration.convertToQuoteElements(visionResult);
                    
                    return {
                        success: true,
                        method: 'google_vision',
                        confidence: visionResult.confidence,
                        elements: quoteElements,
                        recommendations: visionResult.recommendations,
                        detectedText: visionResult.detectedText,
                        rawAnalysis: visionResult
                    };
                } else {
                    // Fallback en cas d'erreur
                    return this.analyzePhotoFallback(context);
                }
            } else {
                // Mode simulation amélioré
                return this.analyzePhotoSimulation(context);
            }
            
        } catch (error) {
            console.error('Erreur analyse photo:', error);
            return this.analyzePhotoFallback(context);
        }
    }

    /**
     * Convertir un fichier en base64
     * @param {File} file - Fichier à convertir
     * @returns {Promise<string>} Image en base64
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // Retirer le préfixe data:image/...;base64,
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Analyse photo en mode simulation (amélioré)
     * @param {string} context - Contexte utilisateur
     * @returns {Object} Résultat simulé mais cohérent
     */
    analyzePhotoSimulation(context) {
        console.log('🎭 Mode simulation - Analyse contextuelle...');
        
        const contextLower = context.toLowerCase();
        let detectedElements = [];

        // Analyse contextuelle améliorée
        if (contextLower.includes('robinet') || contextLower.includes('faucet')) {
            if (contextLower.includes('cuisine') || contextLower.includes('évier')) {
                detectedElements.push(this.database.find(item => item.id === 'mitigeur_evier'));
            } else {
                detectedElements.push(this.database.find(item => item.id === 'mitigeur_lavabo'));
            }
        }
        
        if (contextLower.includes('wc') || contextLower.includes('toilette')) {
            detectedElements.push(this.database.find(item => item.id === 'wc_suspendu'));
        }
        
        if (contextLower.includes('lavabo') || contextLower.includes('vasque')) {
            detectedElements.push(this.database.find(item => item.id === 'lavabo_ceramique'));
        }
        
        if (contextLower.includes('douche')) {
            detectedElements.push(this.database.find(item => item.id === 'receveur_douche'));
            detectedElements.push(this.database.find(item => item.id === 'mitigeur_douche'));
        }
        
        if (contextLower.includes('fuite') || contextLower.includes('réparation')) {
            detectedElements.push(this.database.find(item => item.id === 'reparation_fuite'));
        }

        // Si rien de spécifique détecté, proposer une intervention standard
        if (detectedElements.length === 0) {
            detectedElements.push(this.database.find(item => item.id === 'reparation_fuite'));
        }

        return {
            success: true,
            method: 'simulation_enhanced',
            confidence: 0.6,
            elements: detectedElements.filter(Boolean).map(item => ({
                description: item.description,
                category: item.category,
                price: item.price,
                installTime: item.installTime,
                confidence: 0.6,
                source: 'simulation'
            })),
            recommendations: ['Vérification manuelle recommandée', 'Prix estimatifs basés sur le contexte'],
            message: '⚠️ Analyse en mode simulation - Activez Google Vision API pour une précision optimale'
        };
    }

    /**
     * Analyse de fallback en cas d'erreur
     * @param {string} context - Contexte utilisateur
     * @returns {Object} Résultat de base
     */
    analyzePhotoFallback(context) {
        return {
            success: false,
            method: 'fallback',
            confidence: 0.3,
            elements: [{
                description: 'Intervention plomberie standard',
                category: 'services',
                price: 100,
                installTime: 60,
                confidence: 0.3,
                source: 'fallback'
            }],
            recommendations: ['Analyse automatique indisponible', 'Estimation manuelle requise'],
            error: 'Service d\'analyse temporairement indisponible'
        };
    }

    /**
     * Analyser une dictée vocale (méthode existante améliorée)
     * @param {string} transcript - Transcription vocale
     * @returns {Object} Analyse de la dictée
     */
    analyzeVoice(transcript) {
        console.log('🎤 Analyse vocale:', transcript);
        
        const elements = [];
        const transcriptLower = transcript.toLowerCase();
        
        // Recherche dans la base de données par synonymes
        this.database.forEach(item => {
            const allSynonyms = [item.description.toLowerCase(), ...item.synonyms];
            
            if (allSynonyms.some(synonym => transcriptLower.includes(synonym))) {
                // Calculer la confiance basée sur la correspondance
                let confidence = 0.7;
                if (item.synonyms.some(synonym => transcriptLower.includes(synonym))) {
                    confidence = 0.9;
                }
                
                elements.push({
                    description: item.description,
                    category: item.category,
                    price: item.price,
                    installTime: item.installTime,
                    confidence: confidence,
                    source: 'voice_analysis'
                });
            }
        });

        // Analyse contextuelle pour améliorer les résultats
        const context = this.analyzeVoiceContext(transcriptLower);
        
        return {
            success: elements.length > 0,
            method: 'voice_analysis',
            transcript: transcript,
            elements: elements,
            context: context,
            confidence: elements.length > 0 ? Math.max(...elements.map(e => e.confidence)) : 0
        };
    }

    /**
     * Analyser le contexte d'une dictée vocale
     * @param {string} transcript - Transcription en minuscules
     * @returns {Object} Contexte analysé
     */
    analyzeVoiceContext(transcript) {
        const context = {
            location: 'unknown',
            urgency: 'normal',
            action: 'unknown',
            quantity: 1
        };

        // Détecter le lieu
        if (transcript.includes('salle de bain') || transcript.includes('toilette')) {
            context.location = 'bathroom';
        } else if (transcript.includes('cuisine') || transcript.includes('évier')) {
            context.location = 'kitchen';
        }

        // Détecter l'urgence
        if (transcript.includes('urgent') || transcript.includes('fuite') || transcript.includes('cassé')) {
            context.urgency = 'high';
        }

        // Détecter l'action
        if (transcript.includes('remplacer') || transcript.includes('changer')) {
            context.action = 'replacement';
        } else if (transcript.includes('réparer') || transcript.includes('fixer')) {
            context.action = 'repair';
        } else if (transcript.includes('installer') || transcript.includes('poser')) {
            context.action = 'installation';
        }

        // Détecter les quantités
        const numbers = transcript.match(/\d+/g);
        if (numbers && numbers.length > 0) {
            context.quantity = parseInt(numbers[0]);
        }

        return context;
    }

    /**
     * Générer un devis complet
     * @param {Array} elements - Éléments détectés
     * @param {Object} context - Contexte d'analyse
     * @returns {Object} Devis structuré
     */
    generateQuote(elements, context = {}) {
        let totalMaterials = 0;
        let totalLaborTime = 0;
        const laborRate = 45; // €/heure
        
        const quoteItems = elements.map(element => {
            const quantity = context.quantity || 1;
            const materialCost = element.price * quantity;
            const laborTime = element.installTime * quantity;
            const laborCost = (laborTime / 60) * laborRate;
            
            totalMaterials += materialCost;
            totalLaborTime += laborTime;
            
            return {
                description: element.description,
                category: element.category,
                quantity: quantity,
                unitPrice: element.price,
                materialCost: materialCost,
                laborTime: laborTime,
                laborCost: laborCost,
                total: materialCost + laborCost,
                confidence: element.confidence
            };
        });

        const totalLaborCost = (totalLaborTime / 60) * laborRate;
        const subtotal = totalMaterials + totalLaborCost;
        const tva = subtotal * 0.20;
        const total = subtotal + tva;

        return {
            items: quoteItems,
            summary: {
                totalMaterials: totalMaterials,
                totalLaborTime: totalLaborTime,
                totalLaborCost: totalLaborCost,
                subtotal: subtotal,
                tva: tva,
                total: total
            },
            metadata: {
                generatedAt: new Date().toISOString(),
                confidence: elements.length > 0 ? elements.reduce((acc, el) => acc + el.confidence, 0) / elements.length : 0,
                method: context.method || 'unknown'
            }
        };
    }
}

// Export global
window.AIProcessorWithVision = AIProcessorWithVision;
window.plumbingDatabase = plumbingDatabase;

console.log('✅ AI Processor avec Google Vision chargé');
