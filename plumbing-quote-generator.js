// Générateur de Devis PDF Plomberie - Templates professionnels

class PlumbingQuoteGenerator {
    constructor() {
        this.companyInfo = {
            name: "Entreprise Plomberie",
            address: "123 Rue de la Plomberie",
            city: "75000 Paris",
            phone: "01 23 45 67 89",
            email: "contact@plomberie.fr",
            siret: "123 456 789 00012"
        };
        
        this.quoteCounter = this.getNextQuoteNumber();
    }

    // Génération du devis complet
    async generatePlumbingQuote(analysisResult, customerInfo = {}) {
        const quoteData = this.prepareQuoteData(analysisResult, customerInfo);
        const htmlContent = this.generateHTML(quoteData);
        
        return {
            html: htmlContent,
            data: quoteData,
            filename: `devis_plomberie_${quoteData.quote_number}.html`
        };
    }

    // Préparation des données du devis
    prepareQuoteData(analysisResult, customerInfo) {
        const currentDate = new Date();
        const validityDate = new Date();
        validityDate.setMonth(validityDate.getMonth() + 1);

        return {
            // Informations devis
            quote_number: this.quoteCounter,
            date: this.formatDate(currentDate),
            validity_date: this.formatDate(validityDate),
            
            // Client
            customer: {
                name: customerInfo.name || "Client",
                address: customerInfo.address || "",
                city: customerInfo.city || "",
                phone: customerInfo.phone || "",
                email: customerInfo.email || ""
            },
            
            // Entreprise
            company: this.companyInfo,
            
            // Analyse IA
            analysis: analysisResult,
            
            // Éléments du devis
            items: this.formatQuoteItems(analysisResult.items || []),
            
            // Totaux
            totals: this.calculateTotals(analysisResult.items || []),
            
            // Conditions
            conditions: this.getPlumbingConditions(),
            
            // Garanties
            warranties: this.getPlumbingWarranties()
        };
    }

    // Formatage des éléments du devis
    formatQuoteItems(items) {
        return items.map((item, index) => {
            const quantity = item.quantity || 1;
            const unitPrice = item.price || 0;
            const totalPrice = quantity * unitPrice;
            
            return {
                id: index + 1,
                description: this.getItemDescription(item),
                quantity: quantity,
                unit: item.unit || 'unité',
                unit_price: unitPrice,
                total_price: totalPrice,
                category: item.category || 'plomberie',
                installation_time: item.installation_time || 0
            };
        });
    }

    // Description détaillée des éléments
    getItemDescription(item) {
        const descriptions = {
            'lavabo': 'Lavabo en céramique blanc avec fixations murales',
            'lavabo suspendu': 'Lavabo suspendu céramique avec système de fixation',
            'vasque': 'Vasque à poser en céramique avec évacuation',
            'wc suspendu': 'WC suspendu avec bâti-support et plaque de commande',
            'wc au sol': 'WC au sol avec réservoir et mécanisme complet',
            'mitigeur lavabo': 'Mitigeur lavabo chromé avec cartouche céramique',
            'mitigeur évier': 'Mitigeur évier bec haut avec douchette extractible',
            'mitigeur douche': 'Mitigeur douche encastré avec inverseur',
            'robinet': 'Robinet simple avec tête céramique',
            'chauffe-eau': 'Chauffe-eau électrique avec groupe de sécurité',
            'radiateur': 'Radiateur acier avec robinet thermostatique',
            'débouchage canalisation': 'Débouchage canalisation par hydrocurage',
            'réparation fuite': 'Réparation fuite avec remplacement joint/raccord',
            'main d\'œuvre plombier': 'Main d\'œuvre plombier qualifié'
        };
        
        return descriptions[item.name] || `${item.name} - Installation plomberie`;
    }

    // Calcul des totaux
    calculateTotals(items) {
        let materialTotal = 0;
        let laborTotal = 0;
        let totalTime = 0;

        items.forEach(item => {
            const quantity = item.quantity || 1;
            const unitPrice = item.price || 0;
            const itemTotal = quantity * unitPrice;
            
            if (item.category === 'service' || item.name.includes('main d\'œuvre')) {
                laborTotal += itemTotal;
            } else {
                materialTotal += itemTotal;
            }
            
            if (item.installation_time) {
                totalTime += item.installation_time * quantity;
            }
        });

        // Ajouter main d'œuvre si pas déjà incluse
        if (laborTotal === 0 && totalTime > 0) {
            laborTotal = totalTime * 45; // 45€/heure
        }

        const subtotalHT = materialTotal + laborTotal;
        const tva = subtotalHT * 0.20; // TVA 20%
        const totalTTC = subtotalHT + tva;

        return {
            materials: materialTotal,
            labor: laborTotal,
            total_time: totalTime,
            subtotal_ht: subtotalHT,
            tva_rate: 20,
            tva_amount: tva,
            total_ttc: totalTTC
        };
    }

    // Génération HTML du devis
    generateHTML(quoteData) {
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Devis Plomberie #${quoteData.quote_number}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #2563eb;
        }
        
        .company-info {
            flex: 1;
        }
        
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        
        .quote-info {
            text-align: right;
            flex: 1;
        }
        
        .quote-title {
            font-size: 20px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        
        .customer-section {
            margin: 30px 0;
            padding: 15px;
            background-color: #f8fafc;
            border-radius: 5px;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        .items-table th {
            background-color: #2563eb;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
        }
        
        .items-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .items-table tr:nth-child(even) {
            background-color: #f8fafc;
        }
        
        .category-header {
            background-color: #eff6ff !important;
            font-weight: bold;
            color: #2563eb;
        }
        
        .price {
            text-align: right;
            font-weight: bold;
        }
        
        .totals-section {
            margin-top: 30px;
            padding: 20px;
            background-color: #f0fdf4;
            border-radius: 5px;
            border: 1px solid #22c55e;
        }
        
        .totals-table {
            width: 100%;
            max-width: 400px;
            margin-left: auto;
        }
        
        .totals-table td {
            padding: 8px 15px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .total-final {
            font-size: 18px;
            font-weight: bold;
            color: #22c55e;
            border-top: 2px solid #22c55e;
        }
        
        .conditions {
            margin-top: 30px;
            font-size: 11px;
            color: #6b7280;
        }
        
        .conditions h4 {
            color: #374151;
            margin-bottom: 10px;
        }
        
        .conditions ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        
        .footer {
            margin-top: 40px;
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
        }
        
        @media print {
            body { font-size: 11px; }
            .header { page-break-after: avoid; }
            .totals-section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <!-- En-tête -->
    <div class="header">
        <div class="company-info">
            <div class="company-name">${quoteData.company.name}</div>
            <div>${quoteData.company.address}</div>
            <div>${quoteData.company.city}</div>
            <div>Tél: ${quoteData.company.phone}</div>
            <div>Email: ${quoteData.company.email}</div>
            <div>SIRET: ${quoteData.company.siret}</div>
        </div>
        
        <div class="quote-info">
            <div class="quote-title">DEVIS PLOMBERIE</div>
            <div><strong>N° ${quoteData.quote_number}</strong></div>
            <div>Date: ${quoteData.date}</div>
            <div>Valide jusqu'au: ${quoteData.validity_date}</div>
        </div>
    </div>
    
    <!-- Informations client -->
    <div class="customer-section">
        <div class="section-title">Client</div>
        <div><strong>${quoteData.customer.name}</strong></div>
        ${quoteData.customer.address ? `<div>${quoteData.customer.address}</div>` : ''}
        ${quoteData.customer.city ? `<div>${quoteData.customer.city}</div>` : ''}
        ${quoteData.customer.phone ? `<div>Tél: ${quoteData.customer.phone}</div>` : ''}
        ${quoteData.customer.email ? `<div>Email: ${quoteData.customer.email}</div>` : ''}
    </div>
    
    <!-- Analyse IA -->
    ${quoteData.analysis.context ? `
    <div class="customer-section">
        <div class="section-title">Analyse de l'Intervention</div>
        <div><strong>Type:</strong> ${quoteData.analysis.context.intervention || 'Maintenance'}</div>
        <div><strong>Lieu:</strong> ${quoteData.analysis.context.location || 'Non spécifié'}</div>
        <div><strong>Urgence:</strong> ${this.getUrgencyLabel(quoteData.analysis.context.urgency)}</div>
        <div><strong>Temps estimé:</strong> ${quoteData.totals.total_time}h</div>
    </div>
    ` : ''}
    
    <!-- Tableau des éléments -->
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 50%">Description</th>
                <th style="width: 10%">Qté</th>
                <th style="width: 10%">Unité</th>
                <th style="width: 15%">Prix Unit. HT</th>
                <th style="width: 15%">Total HT</th>
            </tr>
        </thead>
        <tbody>
            ${this.generateItemsHTML(quoteData.items)}
        </tbody>
    </table>
    
    <!-- Totaux -->
    <div class="totals-section">
        <div class="section-title">Récapitulatif</div>
        <table class="totals-table">
            <tr>
                <td>Matériaux HT:</td>
                <td class="price">${this.formatPrice(quoteData.totals.materials)} €</td>
            </tr>
            <tr>
                <td>Main d'œuvre HT:</td>
                <td class="price">${this.formatPrice(quoteData.totals.labor)} €</td>
            </tr>
            <tr>
                <td><strong>Total HT:</strong></td>
                <td class="price"><strong>${this.formatPrice(quoteData.totals.subtotal_ht)} €</strong></td>
            </tr>
            <tr>
                <td>TVA (${quoteData.totals.tva_rate}%):</td>
                <td class="price">${this.formatPrice(quoteData.totals.tva_amount)} €</td>
            </tr>
            <tr class="total-final">
                <td><strong>TOTAL TTC:</strong></td>
                <td class="price"><strong>${this.formatPrice(quoteData.totals.total_ttc)} €</strong></td>
            </tr>
        </table>
    </div>
    
    <!-- Conditions -->
    <div class="conditions">
        <h4>Conditions Générales</h4>
        <ul>
            ${quoteData.conditions.map(condition => `<li>${condition}</li>`).join('')}
        </ul>
        
        <h4>Garanties</h4>
        <ul>
            ${quoteData.warranties.map(warranty => `<li>${warranty}</li>`).join('')}
        </ul>
    </div>
    
    <!-- Pied de page -->
    <div class="footer">
        <p>Devis généré automatiquement par Devy Boost AI - ${quoteData.date}</p>
        <p>Ce devis est valable ${this.getValidityDays()} jours à compter de sa date d'émission</p>
    </div>
</body>
</html>`;
    }

    // Génération HTML des éléments par catégorie
    generateItemsHTML(items) {
        const categories = this.groupItemsByCategory(items);
        let html = '';
        
        Object.entries(categories).forEach(([category, categoryItems]) => {
            html += `<tr class="category-header">
                <td colspan="5">${this.getCategoryLabel(category)}</td>
            </tr>`;
            
            categoryItems.forEach(item => {
                html += `<tr>
                    <td>${item.description}</td>
                    <td style="text-align: center">${item.quantity}</td>
                    <td>${item.unit}</td>
                    <td class="price">${this.formatPrice(item.unit_price)} €</td>
                    <td class="price">${this.formatPrice(item.total_price)} €</td>
                </tr>`;
            });
        });
        
        return html;
    }

    // Groupement par catégorie
    groupItemsByCategory(items) {
        const categories = {};
        
        items.forEach(item => {
            const category = item.category || 'divers';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(item);
        });
        
        return categories;
    }

    // Labels des catégories
    getCategoryLabel(category) {
        const labels = {
            'sanitaires': '🚿 SANITAIRES',
            'robinetterie': '🚰 ROBINETTERIE',
            'douche': '🛁 DOUCHE & BAIGNOIRE',
            'baignoire': '🛁 DOUCHE & BAIGNOIRE',
            'tuyauterie': '🔧 TUYAUTERIE',
            'raccords': '🔗 RACCORDS',
            'évacuation': '⬇️ ÉVACUATION',
            'chauffage': '🔥 CHAUFFAGE',
            'vannes': '⚙️ VANNES & ACCESSOIRES',
            'accessoires': '⚙️ VANNES & ACCESSOIRES',
            'service': '👨‍🔧 MAIN D\'ŒUVRE & SERVICES',
            'divers': '📦 DIVERS'
        };
        
        return labels[category] || category.toUpperCase();
    }

    // Conditions spécifiques plomberie
    getPlumbingConditions() {
        return [
            "Devis valable 30 jours à compter de sa date d'émission",
            "Travaux réalisés selon les normes DTU plomberie en vigueur",
            "Fourniture et pose comprises sauf mention contraire",
            "Évacuation des gravats non comprise",
            "Accès libre et dégagé aux zones d'intervention requis",
            "Alimentation électrique 220V disponible sur site",
            "Paiement : 30% à la commande, solde à la réception des travaux",
            "Délai d'exécution : sous réserve d'approvisionnement des matériaux"
        ];
    }

    // Garanties plomberie
    getPlumbingWarranties() {
        return [
            "Garantie décennale sur les travaux de plomberie",
            "Garantie 2 ans sur les équipements fournis et posés",
            "Garantie 1 an sur la main d'œuvre",
            "SAV et dépannage assurés pendant la période de garantie",
            "Garantie constructeur sur les appareils selon fabricant"
        ];
    }

    // Utilitaires
    formatPrice(price) {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('fr-FR').format(date);
    }

    getUrgencyLabel(urgency) {
        const labels = {
            'high': '🔴 Urgent',
            'medium': '🟡 Normal',
            'low': '🟢 Planifié'
        };
        return labels[urgency] || 'Normal';
    }

    getValidityDays() {
        return 30;
    }

    getNextQuoteNumber() {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${year}-PL-${random}`;
    }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlumbingQuoteGenerator;
}
