class SearchEngine {
    constructor() {
        this.searchInput = null;
        this.searchResults = null;
        this.searchOverlay = null;
        this.debounceTimer = null;
        this.isSearching = false;
        
        this.init();
    }
    
    init() {
        this.createSearchElements();
        this.bindEvents();
    }
    
    createSearchElements() {
        // Créer la barre de recherche
        const header = document.querySelector('.header');
        if (!header) return;
        
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" id="search-input" placeholder="Rechercher..." autocomplete="off">
                <button class="search-btn" type="button">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="M21 21l-4.5-4.5"></path>
                    </svg>
                </button>
            </div>
            <div class="search-results" id="search-results"></div>
        `;
        
        // Ajouter au header
        const navContainer = header.querySelector('.nav-container');
        if (navContainer) {
            navContainer.appendChild(searchContainer);
        }
        
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        
        // Créer l'overlay
        this.searchOverlay = document.createElement('div');
        this.searchOverlay.className = 'search-overlay';
        document.body.appendChild(this.searchOverlay);
    }
    
    bindEvents() {
        if (!this.searchInput) return;
        
        // Événements de recherche
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        this.searchInput.addEventListener('focus', () => {
            this.showSearchResults();
        });
        
        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSearchResults();
            }
        });
        
        // Fermer en cliquant ailleurs
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSearchResults();
            }
        });
        
        // Overlay click
        this.searchOverlay.addEventListener('click', () => {
            this.hideSearchResults();
        });
    }
    
    handleSearch(query) {
        clearTimeout(this.debounceTimer);
        
        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }
        
        this.debounceTimer = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }
    
    async performSearch(query) {
        if (this.isSearching) return;
        
        this.isSearching = true;
        this.showLoading();
        
        try {
            const response = await fetch(`/api/search.php?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            this.displayResults(data);
        } catch (error) {
            console.error('Erreur de recherche:', error);
            this.showError();
        } finally {
            this.isSearching = false;
        }
    }
    
    displayResults(data) {
        if (!this.searchResults) return;
        
        if (data.results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-no-results">
                    <p>Aucun résultat pour "${data.query}"</p>
                </div>
            `;
        } else {
            const resultsHTML = data.results.map(result => `
                <a href="${result.url}" class="search-result-item">
                    <div class="search-result-content">
                        <div class="search-result-header">
                            <h4>${this.highlightText(result.title, data.query)}</h4>
                            <span class="search-result-type">${result.type}</span>
                        </div>
                        <p class="search-result-description">
                            ${this.highlightText(result.description, data.query)}
                        </p>
                        ${result.category ? `<span class="search-result-category">${result.category}</span>` : ''}
                        ${result.lieu ? `<span class="search-result-location">${result.lieu}</span>` : ''}
                    </div>
                </a>
            `).join('');
            
            this.searchResults.innerHTML = `
                <div class="search-results-header">
                    <span>${data.count} résultat${data.count > 1 ? 's' : ''}</span>
                </div>
                ${resultsHTML}
            `;
        }
        
        this.showSearchResults();
    }
    
    highlightText(text, query) {
        if (!text || !query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    showLoading() {
        if (!this.searchResults) return;
        
        this.searchResults.innerHTML = `
            <div class="search-loading">
                <div class="search-spinner"></div>
                <p>Recherche en cours...</p>
            </div>
        `;
        this.showSearchResults();
    }
    
    showError() {
        if (!this.searchResults) return;
        
        this.searchResults.innerHTML = `
            <div class="search-error">
                <p>Erreur lors de la recherche. Veuillez réessayer.</p>
            </div>
        `;
    }
    
    showSearchResults() {
        if (!this.searchResults) return;
        
        this.searchResults.style.display = 'block';
        this.searchOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    hideSearchResults() {
        if (!this.searchResults) return;
        
        this.searchResults.style.display = 'none';
        this.searchOverlay.style.display = 'none';
        document.body.style.overflow = '';
        this.searchInput.blur();
    }
}

// Initialiser la recherche quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new SearchEngine();
});