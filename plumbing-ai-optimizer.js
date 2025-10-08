// Optimiseur IA spécialisé Plomberie - Reconnaissance avancée

class PlumbingAIOptimizer {
    constructor() {
        this.plumbingPatterns = this.initializePlumbingPatterns();
        this.contextAnalyzer = new PlumbingContextAnalyzer();
        this.quantityEstimator = new PlumbingQuantityEstimator();
    }

    // Patterns de reconnaissance spécialisés plomberie
    initializePlumbingPatterns() {
        return {
            // INTERVENTIONS COURANTES
            installation: {
                patterns: [
                    /install\w*|pos\w*|mont\w*|mettre|placer/i,
                    /nouveau|nouvelle|neuf|neuve/i
                ],
                keywords: ['installer', 'poser', 'monter', 'mettre', 'nouveau', 'neuf']
            },
            
            remplacement: {
                patterns: [
                    /remplac\w*|chang\w*|renouvel\w*|substitu\w*/i,
                    /ancien|ancienne|vieux|vieille|cassé|défaillant/i
                ],
                keywords: ['remplacer', 'changer', 'renouveler', 'ancien', 'cassé']
            },
            
            reparation: {
                patterns: [
                    /répare\w*|répar\w*|fix\w*|arrange\w*|dépann\w*/i,
                    /fuite|qui fuit|coule|goutte|perte/i
                ],
                keywords: ['réparer', 'fixer', 'fuite', 'qui fuit', 'dépanner']
            },
            
            debouchage: {
                patterns: [
                    /débouch\w*|bouch\w*|obstru\w*|engorg\w*/i,
                    /évacuation|canalisation|évier|lavabo.*bouch/i
                ],
                keywords: ['déboucher', 'bouchon', 'engorgé', 'évacuation bouchée']
            },

            // ÉLÉMENTS SANITAIRES
            lavabo: {
                patterns: [
                    /lavabo|vasque|lave.mains|plan.vasque/i,
                    /salle.*bain.*lavabo|lavabo.*salle.*bain/i
                ],
                synonyms: ['vasque', 'lave-mains', 'plan vasque', 'lavabo suspendu'],
                context: ['salle de bain', 'toilettes', 'wc']
            },
            
            wc: {
                patterns: [
                    /wc|toilettes?|cuvette|sanitaires?/i,
                    /chasse.*eau|réservoir.*wc|mécanisme.*wc/i
                ],
                synonyms: ['toilettes', 'cuvette', 'wc suspendu', 'wc au sol'],
                context: ['toilettes', 'salle de bain', 'wc']
            },
            
            douche: {
                patterns: [
                    /douche|cabine.*douche|receveur|paroi.*douche/i,
                    /pommeau|douchette|colonne.*douche/i
                ],
                synonyms: ['cabine de douche', 'receveur', 'paroi', 'bac à douche'],
                context: ['salle de bain', 'douche']
            },

            // ROBINETTERIE
            robinet: {
                patterns: [
                    /robinet|mitigeur|robinetterie/i,
                    /bec|poignée|manette|thermostatique/i
                ],
                synonyms: ['mitigeur', 'robinetterie', 'bec', 'mitigeur thermostatique'],
                context: ['évier', 'lavabo', 'douche', 'baignoire']
            },

            // PROBLÈMES COURANTS
            fuite: {
                patterns: [
                    /fuite|fuit|coule|goutte|perte.*eau/i,
                    /sous.*évier|sous.*lavabo|tuyau.*fuit/i
                ],
                locations: ['sous évier', 'sous lavabo', 'tuyauterie', 'raccord'],
                urgency: 'high'
            },
            
            pression: {
                patterns: [
                    /pression|débit|faible.*pression|manque.*pression/i,
                    /eau.*coule.*mal|peu.*eau/i
                ],
                solutions: ['détartrage', 'réducteur de pression', 'vanne']
            }
        };
    }

    // Analyse contextuelle avancée
    analyzeContext(description) {
        const text = description.toLowerCase();
        const context = {
            location: this.detectLocation(text),
            intervention: this.detectIntervention(text),
            urgency: this.detectUrgency(text),
            complexity: this.estimateComplexity(text)
        };
        
        return context;
    }

    // Détection de lieu
    detectLocation(text) {
        const locations = {
            'salle de bain': /salle.*bain|sdb/i,
            'cuisine': /cuisine|évier/i,
            'toilettes': /toilettes?|wc/i,
            'buanderie': /buanderie|cellier/i,
            'sous-sol': /sous.sol|cave/i,
            'étage': /étage|haut/i
        };
        
        for (const [location, pattern] of Object.entries(locations)) {
            if (pattern.test(text)) {
                return location;
            }
        }
        
        return 'non spécifié';
    }

    // Détection type d'intervention
    detectIntervention(text) {
        for (const [intervention, data] of Object.entries(this.plumbingPatterns)) {
            if (data.patterns) {
                for (const pattern of data.patterns) {
                    if (pattern.test(text)) {
                        return intervention;
                    }
                }
            }
        }
        
        return 'maintenance';
    }

    // Détection urgence
    detectUrgency(text) {
        const urgentKeywords = /urgent|urgence|fuite|inondation|plus.*eau|dégât.*eaux/i;
        const normalKeywords = /prévoir|planifier|quand.*possible|pas.*urgent/i;
        
        if (urgentKeywords.test(text)) return 'high';
        if (normalKeywords.test(text)) return 'low';
        return 'medium';
    }

    // Estimation complexité
    estimateComplexity(text) {
        let complexity = 1;
        
        // Facteurs augmentant la complexité
        if (/encastr\w*|mur|cloison/i.test(text)) complexity += 0.5;
        if (/ancien|vieux|rénov\w*/i.test(text)) complexity += 0.3;
        if (/plusieurs|multiple|tout\w*/i.test(text)) complexity += 0.4;
        if (/étage|accès.*difficile/i.test(text)) complexity += 0.2;
        
        return Math.min(complexity, 2.0); // Max 2.0
    }

    // Extraction intelligente d'éléments
    extractSmartElements(description) {
        const context = this.analyzeContext(description);
        const elements = [];
        const text = description.toLowerCase();
        
        // Recherche par patterns spécialisés
        for (const [element, data] of Object.entries(this.plumbingPatterns)) {
            if (data.patterns) {
                for (const pattern of data.patterns) {
                    if (pattern.test(text)) {
                        elements.push({
                            element: element,
                            confidence: this.calculateConfidence(text, data),
                            context: context,
                            suggestions: this.generateElementSuggestions(element, context)
                        });
                    }
                }
            }
        }
        
        return elements;
    }

    // Calcul de confiance
    calculateConfidence(text, elementData) {
        let confidence = 0.5; // Base
        
        // Bonus pour patterns multiples
        if (elementData.patterns) {
            const matchCount = elementData.patterns.filter(p => p.test(text)).length;
            confidence += matchCount * 0.15;
        }
        
        // Bonus pour synonymes
        if (elementData.synonyms) {
            const synonymMatches = elementData.synonyms.filter(s => text.includes(s)).length;
            confidence += synonymMatches * 0.1;
        }
        
        // Bonus pour contexte cohérent
        if (elementData.context) {
            const contextMatches = elementData.context.filter(c => text.includes(c)).length;
            confidence += contextMatches * 0.1;
        }
        
        return Math.min(confidence, 1.0);
    }

    // Suggestions contextuelles
    generateElementSuggestions(element, context) {
        const suggestions = [];
        
        if (element === 'lavabo' && context.intervention === 'remplacement') {
            suggestions.push('Inclure robinetterie et évacuation');
            suggestions.push('Vérifier fixation murale');
        }
        
        if (element === 'fuite' && context.urgency === 'high') {
            suggestions.push('Intervention prioritaire');
            suggestions.push('Couper l\'arrivée d\'eau');
        }
        
        if (element === 'wc' && context.location === 'étage') {
            suggestions.push('Vérifier évacuation');
            suggestions.push('Accès par escalier');
        }
        
        return suggestions;
    }

    // Optimisation globale de l'analyse
    optimizeAnalysis(description) {
        const smartElements = this.extractSmartElements(description);
        const context = this.analyzeContext(description);
        const quantities = this.quantityEstimator.estimateQuantities(description, smartElements);
        
        return {
            elements: smartElements,
            context: context,
            quantities: quantities,
            recommendations: this.generateRecommendations(smartElements, context),
            timeEstimate: this.estimateWorkTime(smartElements, context),
            priceRange: this.estimatePriceRange(quantities, context)
        };
    }

    // Recommandations personnalisées
    generateRecommendations(elements, context) {
        const recommendations = [];
        
        if (context.urgency === 'high') {
            recommendations.push('Intervention d\'urgence recommandée');
        }
        
        if (context.complexity > 1.5) {
            recommendations.push('Travaux complexes - prévoir plus de temps');
        }
        
        if (elements.some(e => e.element === 'fuite')) {
            recommendations.push('Couper l\'eau avant intervention');
        }
        
        return recommendations;
    }

    // Estimation temps de travail
    estimateWorkTime(elements, context) {
        let baseTime = 1; // heure minimum
        
        elements.forEach(element => {
            if (element.element === 'lavabo') baseTime += 2.5;
            if (element.element === 'wc') baseTime += 3.0;
            if (element.element === 'robinet') baseTime += 1.0;
            if (element.element === 'fuite') baseTime += 1.5;
        });
        
        // Facteur de complexité
        baseTime *= context.complexity;
        
        return {
            estimated_hours: Math.round(baseTime * 10) / 10,
            range: {
                min: Math.round(baseTime * 0.8 * 10) / 10,
                max: Math.round(baseTime * 1.3 * 10) / 10
            }
        };
    }

    // Estimation fourchette de prix
    estimatePriceRange(quantities, context) {
        // Logique d'estimation basée sur les quantités et le contexte
        let basePrice = 100; // Prix minimum intervention
        
        // Calcul basé sur les éléments détectés
        quantities.forEach(item => {
            basePrice += item.estimated_price || 50;
        });
        
        // Facteurs contextuels
        if (context.urgency === 'high') basePrice *= 1.3;
        if (context.complexity > 1.5) basePrice *= 1.2;
        
        return {
            estimated: Math.round(basePrice),
            range: {
                min: Math.round(basePrice * 0.7),
                max: Math.round(basePrice * 1.4)
            }
        };
    }
}

// Analyseur de contexte spécialisé
class PlumbingContextAnalyzer {
    analyzeRoom(text) {
        // Analyse spécialisée par pièce
        const rooms = {
            'salle_de_bain': {
                keywords: ['salle de bain', 'sdb', 'douche', 'baignoire'],
                typical_items: ['lavabo', 'wc', 'douche', 'robinetterie']
            },
            'cuisine': {
                keywords: ['cuisine', 'évier', 'lave-vaisselle'],
                typical_items: ['évier', 'robinet évier', 'évacuation']
            },
            'toilettes': {
                keywords: ['toilettes', 'wc', 'cabinet'],
                typical_items: ['wc', 'lave-mains', 'chasse d\'eau']
            }
        };
        
        for (const [room, data] of Object.entries(rooms)) {
            if (data.keywords.some(keyword => text.includes(keyword))) {
                return {
                    room: room,
                    typical_items: data.typical_items,
                    confidence: 0.8
                };
            }
        }
        
        return { room: 'unknown', typical_items: [], confidence: 0.3 };
    }
}

// Estimateur de quantités spécialisé
class PlumbingQuantityEstimator {
    estimateQuantities(description, elements) {
        const text = description.toLowerCase();
        const quantities = [];
        
        elements.forEach(element => {
            const quantity = this.extractQuantityForElement(text, element.element);
            quantities.push({
                element: element.element,
                quantity: quantity,
                unit: this.getUnitForElement(element.element),
                estimated_price: this.getEstimatedPrice(element.element, quantity)
            });
        });
        
        return quantities;
    }
    
    extractQuantityForElement(text, element) {
        // Recherche de quantités dans le texte
        const quantityPatterns = [
            /(\d+)\s*(?:unités?|pièces?|u)/i,
            /(\d+)\s*(?:mètres?|m)/i,
            /(\d+)\s*(?:litres?|l)/i
        ];
        
        for (const pattern of quantityPatterns) {
            const match = text.match(pattern);
            if (match) {
                return parseInt(match[1]);
            }
        }
        
        // Quantité par défaut selon l'élément
        const defaultQuantities = {
            'lavabo': 1,
            'wc': 1,
            'robinet': 1,
            'fuite': 1,
            'tuyau': 5, // mètres par défaut
            'radiateur': 1
        };
        
        return defaultQuantities[element] || 1;
    }
    
    getUnitForElement(element) {
        const units = {
            'lavabo': 'unité',
            'wc': 'unité',
            'robinet': 'unité',
            'tuyau': 'mètre',
            'fuite': 'intervention'
        };
        
        return units[element] || 'unité';
    }
    
    getEstimatedPrice(element, quantity) {
        const basePrices = {
            'lavabo': 125,
            'wc': 150,
            'robinet': 89,
            'fuite': 85,
            'tuyau': 8
        };
        
        return (basePrices[element] || 50) * quantity;
    }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PlumbingAIOptimizer, PlumbingContextAnalyzer, PlumbingQuantityEstimator };
}
