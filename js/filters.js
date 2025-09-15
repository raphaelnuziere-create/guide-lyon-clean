class AnnuaireFilters {
    constructor() {
        this.categoryFilter = null;
        this.sortFilter = null;
        this.resetBtn = null;
        this.grid = null;
        this.resultsCount = null;
        this.allEntreprises = [];
        this.filteredEntreprises = [];
        
        this.init();
    }
    
    init() {
        this.bindElements();
        this.loadInitialData();
        this.bindEvents();
    }
    
    bindElements() {
        this.categoryFilter = document.getElementById('category-filter');
        this.sortFilter = document.getElementById('sort-filter');
        this.resetBtn = document.getElementById('reset-filters');
        this.grid = document.getElementById('entreprises-grid');
        this.resultsCount = document.getElementById('results-count');
    }
    
    bindEvents() {
        if (this.categoryFilter) {
            this.categoryFilter.addEventListener('change', () => this.applyFilters());
        }
        
        if (this.sortFilter) {
            this.sortFilter.addEventListener('change', () => this.applyFilters());
        }
        
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetFilters());
        }
    }
    
    async loadInitialData() {
        try {
            const response = await fetch('/api/annuaire-data.php');
            const data = await response.json();
            
            if (data.success) {
                this.allEntreprises = data.entreprises;
                this.filteredEntreprises = [...this.allEntreprises];
                this.applyFilters();
            } else {
                this.showError('Erreur lors du chargement des données');
            }
        } catch (error) {
            console.error('Erreur:', error);
            this.showError('Erreur de connexion');
        }
    }
    
    applyFilters() {
        let filtered = [...this.allEntreprises];
        
        // Filtrer par catégorie
        const selectedCategory = this.categoryFilter?.value;
        if (selectedCategory) {
            filtered = filtered.filter(entreprise => 
                entreprise.categorie === selectedCategory
            );
        }
        
        // Trier
        const sortValue = this.sortFilter?.value || 'date';
        filtered.sort((a, b) => {
            switch (sortValue) {
                case 'name':
                    return a.nom.localeCompare(b.nom);
                case 'name-desc':
                    return b.nom.localeCompare(a.nom);
                case 'date':
                default:
                    return new Date(b.date_created) - new Date(a.date_created);
            }
        });
        
        this.filteredEntreprises = filtered;
        this.renderEntreprises();
        this.updateResultsCount();
    }
    
    renderEntreprises() {
        if (!this.grid) return;
        
        if (this.filteredEntreprises.length === 0) {
            this.grid.innerHTML = `
                <div class="card no-results">
                    <div class="card-content">
                        <h3 class="card-title">Aucune entreprise trouvée</h3>
                        <p class="card-excerpt">Aucune entreprise ne correspond aux critères sélectionnés.</p>
                        <button onclick="annuaireFilters.resetFilters()" class="card-link">Réinitialiser les filtres</button>
                    </div>
                </div>
            `;
            return;
        }
        
        const html = this.filteredEntreprises.map(entreprise => `
            <div class="card" data-category="${entreprise.categorie || ''}">
                <div class="card-content">
                    <h3 class="card-title">${this.escapeHtml(entreprise.nom)}</h3>
                    <p class="card-excerpt">${this.escapeHtml(this.truncateText(entreprise.description || '', 150))}</p>
                    <div class="card-meta">
                        <span class="card-category">${this.escapeHtml(entreprise.categorie || 'Entreprise')}</span>
                        ${entreprise.adresse ? `<span class="card-location">${this.escapeHtml(entreprise.adresse)}</span>` : ''}
                        ${entreprise.telephone ? `<span class="card-phone">${this.escapeHtml(entreprise.telephone)}</span>` : ''}
                    </div>
                    <a href="/entreprise/${entreprise.slug || entreprise.id}" class="card-link">En savoir plus</a>
                </div>
            </div>
        `).join('');
        
        this.grid.innerHTML = html;
        
        // Animation d'apparition
        requestAnimationFrame(() => {
            const cards = this.grid.querySelectorAll('.card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'all 0.3s ease';
                    
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                }, index * 50);
            });
        });
    }
    
    updateResultsCount() {
        if (!this.resultsCount) return;
        
        const count = this.filteredEntreprises.length;
        const total = this.allEntreprises.length;
        
        if (count === total) {
            this.resultsCount.textContent = `${count} entreprise${count > 1 ? 's' : ''}`;
        } else {
            this.resultsCount.textContent = `${count} sur ${total} entreprise${total > 1 ? 's' : ''}`;
        }
    }
    
    resetFilters() {
        if (this.categoryFilter) this.categoryFilter.value = '';
        if (this.sortFilter) this.sortFilter.value = 'date';
        
        this.applyFilters();
    }
    
    showError(message) {
        if (!this.grid) return;
        
        this.grid.innerHTML = `
            <div class="card error">
                <div class="card-content">
                    <h3 class="card-title">Erreur</h3>
                    <p class="card-excerpt">${message}</p>
                    <button onclick="location.reload()" class="card-link">Réessayer</button>
                </div>
            </div>
        `;
        
        if (this.resultsCount) {
            this.resultsCount.textContent = 'Erreur de chargement';
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    truncateText(text, length) {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    }
}

// Initialiser les filtres
let annuaireFilters;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('entreprises-grid')) {
        annuaireFilters = new AnnuaireFilters();
    }
});