// Moteur IA spécialisé Plomberie - Version enrichie

class PlumberAIProcessor {
    constructor() {
        this.isInitialized = false;
        this.model = null;
        this.tokenizer = null;
        this.priceDatabase = this.initializePlumbingPriceDatabase();
    }

    // Base de données de prix spécialisée PLOMBERIE (100+ références)
    initializePlumbingPriceDatabase() {
        return {
            // SANITAIRES
            'lavabo': { price: 125, unit: 'unité', category: 'sanitaires', installation_time: 2.5 },
            'lavabo suspendu': { price: 165, unit: 'unité', category: 'sanitaires', installation_time: 3.0 },
            'lavabo d\'angle': { price: 145, unit: 'unité', category: 'sanitaires', installation_time: 2.8 },
            'vasque': { price: 95, unit: 'unité', category: 'sanitaires', installation_time: 2.0 },
            'vasque à poser': { price: 110, unit: 'unité', category: 'sanitaires', installation_time: 2.2 },
            'plan vasque': { price: 180, unit: 'unité', category: 'sanitaires', installation_time: 3.5 },
            'lave-mains': { price: 75, unit: 'unité', category: 'sanitaires', installation_time: 1.5 },
            
            'wc suspendu': { price: 220, unit: 'unité', category: 'sanitaires', installation_time: 4.0 },
            'wc au sol': { price: 150, unit: 'unité', category: 'sanitaires', installation_time: 3.0 },
            'wc avec lave-mains': { price: 280, unit: 'unité', category: 'sanitaires', installation_time: 4.5 },
            'cuvette wc': { price: 120, unit: 'unité', category: 'sanitaires', installation_time: 2.5 },
            'réservoir wc': { price: 85, unit: 'unité', category: 'sanitaires', installation_time: 1.5 },
            'mécanisme wc': { price: 35, unit: 'unité', category: 'sanitaires', installation_time: 0.5 },
            'abattant wc': { price: 45, unit: 'unité', category: 'sanitaires', installation_time: 0.3 },
            
            'bidet': { price: 180, unit: 'unité', category: 'sanitaires', installation_time: 3.0 },
            'urinoir': { price: 250, unit: 'unité', category: 'sanitaires', installation_time: 3.5 },
            
            // ROBINETTERIE
            'mitigeur lavabo': { price: 89, unit: 'unité', category: 'robinetterie', installation_time: 1.0 },
            'mitigeur évier': { price: 125, unit: 'unité', category: 'robinetterie', installation_time: 1.2 },
            'mitigeur douche': { price: 95, unit: 'unité', category: 'robinetterie', installation_time: 1.5 },
            'mitigeur baignoire': { price: 145, unit: 'unité', category: 'robinetterie', installation_time: 2.0 },
            'mitigeur thermostatique': { price: 185, unit: 'unité', category: 'robinetterie', installation_time: 2.5 },
            'mitigeur bec haut': { price: 165, unit: 'unité', category: 'robinetterie', installation_time: 1.5 },
            'mitigeur cascade': { price: 220, unit: 'unité', category: 'robinetterie', installation_time: 2.0 },
            
            'robinet simple': { price: 45, unit: 'unité', category: 'robinetterie', installation_time: 0.8 },
            'robinet temporisé': { price: 95, unit: 'unité', category: 'robinetterie', installation_time: 1.2 },
            'robinet flotteur': { price: 25, unit: 'unité', category: 'robinetterie', installation_time: 0.5 },
            'robinet d\'arrêt': { price: 15, unit: 'unité', category: 'robinetterie', installation_time: 0.3 },
            'robinet de purge': { price: 12, unit: 'unité', category: 'robinetterie', installation_time: 0.3 },
            
            'douchette': { price: 35, unit: 'unité', category: 'robinetterie', installation_time: 0.5 },
            'pommeau de douche': { price: 55, unit: 'unité', category: 'robinetterie', installation_time: 0.3 },
            'colonne de douche': { price: 285, unit: 'unité', category: 'robinetterie', installation_time: 4.0 },
            'barre de douche': { price: 45, unit: 'unité', category: 'robinetterie', installation_time: 1.0 },
            
            // DOUCHE & BAIGNOIRE
            'receveur de douche': { price: 185, unit: 'unité', category: 'douche', installation_time: 3.0 },
            'receveur extra-plat': { price: 245, unit: 'unité', category: 'douche', installation_time: 3.5 },
            'bac à douche': { price: 165, unit: 'unité', category: 'douche', installation_time: 2.8 },
            'cabine de douche': { price: 450, unit: 'unité', category: 'douche', installation_time: 6.0 },
            'paroi de douche': { price: 285, unit: 'unité', category: 'douche', installation_time: 3.5 },
            'porte de douche': { price: 195, unit: 'unité', category: 'douche', installation_time: 2.5 },
            
            'baignoire acrylique': { price: 385, unit: 'unité', category: 'baignoire', installation_time: 5.0 },
            'baignoire fonte': { price: 650, unit: 'unité', category: 'baignoire', installation_time: 6.0 },
            'baignoire d\'angle': { price: 485, unit: 'unité', category: 'baignoire', installation_time: 5.5 },
            'baignoire îlot': { price: 850, unit: 'unité', category: 'baignoire', installation_time: 7.0 },
            'tablier de baignoire': { price: 85, unit: 'unité', category: 'baignoire', installation_time: 1.5 },
            
            // TUYAUTERIE
            'tuyau pvc 32mm': { price: 6, unit: 'mètre', category: 'tuyauterie', installation_time: 0.2 },
            'tuyau pvc 40mm': { price: 8, unit: 'mètre', category: 'tuyauterie', installation_time: 0.2 },
            'tuyau pvc 50mm': { price: 10, unit: 'mètre', category: 'tuyauterie', installation_time: 0.3 },
            'tuyau pvc 100mm': { price: 18, unit: 'mètre', category: 'tuyauterie', installation_time: 0.4 },
            'tuyau pvc 125mm': { price: 25, unit: 'mètre', category: 'tuyauterie', installation_time: 0.5 },
            
            'tuyau cuivre 12mm': { price: 8, unit: 'mètre', category: 'tuyauterie', installation_time: 0.3 },
            'tuyau cuivre 14mm': { price: 10, unit: 'mètre', category: 'tuyauterie', installation_time: 0.3 },
            'tuyau cuivre 16mm': { price: 12, unit: 'mètre', category: 'tuyauterie', installation_time: 0.4 },
            'tuyau cuivre 18mm': { price: 15, unit: 'mètre', category: 'tuyauterie', installation_time: 0.4 },
            'tuyau cuivre 22mm': { price: 18, unit: 'mètre', category: 'tuyauterie', installation_time: 0.5 },
            
            'tuyau per 16mm': { price: 4, unit: 'mètre', category: 'tuyauterie', installation_time: 0.2 },
            'tuyau per 20mm': { price: 6, unit: 'mètre', category: 'tuyauterie', installation_time: 0.2 },
            'tuyau multicouche': { price: 8, unit: 'mètre', category: 'tuyauterie', installation_time: 0.3 },
            
            // RACCORDS
            'coude pvc 90°': { price: 3, unit: 'unité', category: 'raccords', installation_time: 0.1 },
            'coude pvc 45°': { price: 2.5, unit: 'unité', category: 'raccords', installation_time: 0.1 },
            'té pvc': { price: 4, unit: 'unité', category: 'raccords', installation_time: 0.1 },
            'manchon pvc': { price: 2, unit: 'unité', category: 'raccords', installation_time: 0.1 },
            'réduction pvc': { price: 3.5, unit: 'unité', category: 'raccords', installation_time: 0.1 },
            
            'coude cuivre 90°': { price: 5, unit: 'unité', category: 'raccords', installation_time: 0.2 },
            'coude cuivre 45°': { price: 4.5, unit: 'unité', category: 'raccords', installation_time: 0.2 },
            'té cuivre': { price: 8, unit: 'unité', category: 'raccords', installation_time: 0.2 },
            'manchon cuivre': { price: 4, unit: 'unité', category: 'raccords', installation_time: 0.2 },
            'soudure cuivre': { price: 12, unit: 'unité', category: 'raccords', installation_time: 0.3 },
            
            'raccord per': { price: 6, unit: 'unité', category: 'raccords', installation_time: 0.1 },
            'raccord laiton': { price: 8, unit: 'unité', category: 'raccords', installation_time: 0.2 },
            'raccord rapide': { price: 12, unit: 'unité', category: 'raccords', installation_time: 0.1 },
            
            // ÉVACUATION
            'siphon lavabo': { price: 25, unit: 'unité', category: 'évacuation', installation_time: 0.5 },
            'siphon évier': { price: 35, unit: 'unité', category: 'évacuation', installation_time: 0.8 },
            'siphon douche': { price: 45, unit: 'unité', category: 'évacuation', installation_time: 1.0 },
            'siphon baignoire': { price: 55, unit: 'unité', category: 'évacuation', installation_time: 1.2 },
            'bonde de douche': { price: 35, unit: 'unité', category: 'évacuation', installation_time: 0.8 },
            'bonde baignoire': { price: 45, unit: 'unité', category: 'évacuation', installation_time: 1.0 },
            'grille d\'évacuation': { price: 15, unit: 'unité', category: 'évacuation', installation_time: 0.3 },
            
            // CHAUFFAGE
            'radiateur acier': { price: 185, unit: 'unité', category: 'chauffage', installation_time: 3.0 },
            'radiateur fonte': { price: 285, unit: 'unité', category: 'chauffage', installation_time: 3.5 },
            'radiateur aluminium': { price: 225, unit: 'unité', category: 'chauffage', installation_time: 3.2 },
            'sèche-serviettes': { price: 195, unit: 'unité', category: 'chauffage', installation_time: 2.5 },
            'sèche-serviettes électrique': { price: 245, unit: 'unité', category: 'chauffage', installation_time: 2.0 },
            'plancher chauffant': { price: 45, unit: 'm²', category: 'chauffage', installation_time: 0.8 },
            
            'chauffe-eau 100L': { price: 385, unit: 'unité', category: 'chauffage', installation_time: 4.0 },
            'chauffe-eau 150L': { price: 485, unit: 'unité', category: 'chauffage', installation_time: 4.5 },
            'chauffe-eau 200L': { price: 585, unit: 'unité', category: 'chauffage', installation_time: 5.0 },
            'chauffe-eau instantané': { price: 285, unit: 'unité', category: 'chauffage', installation_time: 3.0 },
            'chauffe-eau thermodynamique': { price: 1250, unit: 'unité', category: 'chauffage', installation_time: 8.0 },
            
            'chaudière gaz': { price: 2500, unit: 'unité', category: 'chauffage', installation_time: 12.0 },
            'chaudière condensation': { price: 3500, unit: 'unité', category: 'chauffage', installation_time: 14.0 },
            'pompe à chaleur': { price: 8500, unit: 'unité', category: 'chauffage', installation_time: 20.0 },
            
            // VANNES & ACCESSOIRES
            'vanne d\'arrêt': { price: 25, unit: 'unité', category: 'vannes', installation_time: 0.5 },
            'vanne thermostatique': { price: 45, unit: 'unité', category: 'vannes', installation_time: 0.8 },
            'détendeur': { price: 85, unit: 'unité', category: 'vannes', installation_time: 1.0 },
            'réducteur de pression': { price: 125, unit: 'unité', category: 'vannes', installation_time: 1.5 },
            'clapet anti-retour': { price: 35, unit: 'unité', category: 'vannes', installation_time: 0.5 },
            'purgeur': { price: 15, unit: 'unité', category: 'vannes', installation_time: 0.3 },
            
            'flexible inox': { price: 18, unit: 'unité', category: 'accessoires', installation_time: 0.2 },
            'joint plomberie': { price: 2, unit: 'unité', category: 'accessoires', installation_time: 0.1 },
            'pâte à joint': { price: 8, unit: 'tube', category: 'accessoires', installation_time: 0.1 },
            'téflon': { price: 3, unit: 'rouleau', category: 'accessoires', installation_time: 0.1 },
            'collier de serrage': { price: 2.5, unit: 'unité', category: 'accessoires', installation_time: 0.1 },
            
            // SERVICES & INTERVENTIONS
            'débouchage canalisation': { price: 95, unit: 'intervention', category: 'service', installation_time: 1.5 },
            'détartrage': { price: 125, unit: 'intervention', category: 'service', installation_time: 2.0 },
            'recherche de fuite': { price: 145, unit: 'intervention', category: 'service', installation_time: 2.5 },
            'réparation fuite': { price: 85, unit: 'intervention', category: 'service', installation_time: 1.8 },
            'vidange chauffe-eau': { price: 95, unit: 'intervention', category: 'service', installation_time: 1.5 },
            'entretien chaudière': { price: 125, unit: 'intervention', category: 'service', installation_time: 2.0 },
            
            // MAIN D'ŒUVRE
            'main d\'œuvre plombier': { price: 45, unit: 'heure', category: 'service' },
            'déplacement': { price: 45, unit: 'forfait', category: 'service' },
            'urgence weekend': { price: 75, unit: 'heure', category: 'service' },
            'urgence nuit': { price: 85, unit: 'heure', category: 'service' }
        };
    }

    // Analyse spécialisée pour la plomberie
    async analyzePlumbingWork(description) {
        try {
            console.log('🔧 Analyse IA Plomberie en cours...', description);
            
            const items = this.extractPlumbingItems(description);
            const estimatedQuantities = this.estimatePlumbingQuantities(description, items);
            
            return {
                success: true,
                items: estimatedQuantities,
                confidence: 0.90,
                suggestions: this.generatePlumbingSuggestions(items),
                totalEstimate: this.calculateTotal(estimatedQuantities)
            };
        } catch (error) {
            console.error('Erreur analyse IA Plomberie:', error);
            return {
                success: false,
                error: error.message,
                items: this.getFallbackPlumbingItems()
            };
        }
    }

    // Extraction spécialisée éléments plomberie
    extractPlumbingItems(description) {
        const text = description.toLowerCase();
        const foundItems = [];
        
        // Mots-clés spécifiques plomberie
        const plumbingKeywords = {
            'lavabo': ['lavabo', 'vasque', 'lave-mains'],
            'wc': ['wc', 'toilettes', 'cuvette'],
            'robinet': ['robinet', 'mitigeur', 'robinetterie'],
            'douche': ['douche', 'receveur', 'cabine'],
            'baignoire': ['baignoire', 'bain'],
            'fuite': ['fuite', 'réparation fuite', 'réparer fuite'],
            'débouchage': ['déboucher', 'bouchon', 'canalisation bouchée'],
            'chauffe-eau': ['chauffe-eau', 'ballon eau chaude'],
            'radiateur': ['radiateur', 'chauffage']
        };
        
        // Recherche avec synonymes
        for (const [item, data] of Object.entries(this.priceDatabase)) {
            if (data.category === 'plomberie' || data.category.includes('plomberie') || 
                ['sanitaires', 'robinetterie', 'douche', 'baignoire', 'tuyauterie', 'raccords', 'évacuation', 'chauffage', 'vannes', 'accessoires', 'service'].includes(data.category)) {
                
                if (text.includes(item) || this.findPlumbingSynonyms(text, item)) {
                    foundItems.push({
                        name: item,
                        ...data
                    });
                }
            }
        }
        
        return foundItems.length > 0 ? foundItems : this.getDefaultPlumbingItems(text);
    }

    // Calcul du total avec main d'œuvre
    calculateTotal(items) {
        let materialTotal = 0;
        let laborTotal = 0;
        
        items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            materialTotal += itemTotal;
            
            if (item.installation_time) {
                laborTotal += item.installation_time * 45; // 45€/heure
            }
        });
        
        const subtotal = materialTotal + laborTotal;
        const tva = subtotal * 0.20;
        
        return {
            materials: materialTotal,
            labor: laborTotal,
            subtotal_ht: subtotal,
            tva: tva,
            total_ttc: subtotal + tva
        };
    }

    // Suggestions spécialisées plomberie
    generatePlumbingSuggestions(items) {
        const suggestions = [];
        
        if (items.some(item => item.name.includes('lavabo'))) {
            suggestions.push('Pensez à inclure la robinetterie et l\'évacuation');
        }
        
        if (items.some(item => item.name.includes('wc'))) {
            suggestions.push('Vérifiez l\'état des canalisations d\'évacuation');
        }
        
        if (items.some(item => item.name.includes('fuite'))) {
            suggestions.push('Contrôlez l\'ensemble de l\'installation après réparation');
        }
        
        return suggestions;
    }

    // Éléments par défaut selon contexte plomberie
    getDefaultPlumbingItems(text) {
        if (text.includes('salle de bain')) {
            return [
                { name: 'lavabo', price: 125, unit: 'unité', category: 'sanitaires', installation_time: 2.5 },
                { name: 'mitigeur lavabo', price: 89, unit: 'unité', category: 'robinetterie', installation_time: 1.0 }
            ];
        }
        
        if (text.includes('cuisine')) {
            return [
                { name: 'mitigeur évier', price: 125, unit: 'unité', category: 'robinetterie', installation_time: 1.2 }
            ];
        }
        
        return [
            { name: 'main d\'œuvre plombier', price: 45, unit: 'heure', category: 'service' }
        ];
    }

    // Recherche de synonymes plomberie
    findPlumbingSynonyms(text, item) {
        const synonyms = {
            'lavabo': ['vasque', 'lave-mains', 'plan vasque'],
            'wc': ['toilettes', 'cuvette', 'sanitaires'],
            'robinet': ['mitigeur', 'robinetterie'],
            'douche': ['cabine douche', 'receveur'],
            'baignoire': ['bain', 'baignoire'],
            'fuite': ['réparation', 'réparer'],
            'chauffe-eau': ['ballon', 'eau chaude']
        };
        
        if (synonyms[item]) {
            return synonyms[item].some(synonym => text.includes(synonym));
        }
        
        return false;
    }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlumberAIProcessor;
}
