// Article Management System for WELL WELL WELL
// Handles dynamic loading of 30+ satirical articles

// Article data structure - Add your 30+ articles here
const articleDatabase = [
    // Americas
    {
        id: 1,
        category: "Americas",
        emoji: "🏦",
        image: "images/articles/jpmorgan.jpg",
        title: "JPMorgan Admits They Just Press Random Buttons Too",
        excerpt: "Senior traders confirm their strategy is 'basically the same as retail but with more zeros'",
        content: "Full article content here...",
        date: "2025-11-14",
        featured: true
    },
    {
        id: 2,
        category: "Americas",
        emoji: "🦅",
        image: null,
        title: "Area Man Finally Understands Blockchain After Losing Everything",
        excerpt: "Local investor reports breakthrough moment of clarity came exactly 3 seconds after final liquidation",
        content: "Full article content here...",
        date: "2025-11-13",
        featured: true
    },
    
    // Europe
    {
        id: 3,
        category: "Europe",
        emoji: "🚀",
        image: null,
        title: "New Whitepaper Just Says 'Trust Me Bro' 47 Times",
        excerpt: "Revolutionary project documentation praised for honesty and brevity by community members",
        content: "Full article content here...",
        date: "2025-11-12",
        featured: true
    },
    {
        id: 4,
        category: "Europe",
        emoji: "🏰",
        image: "images/articles/swiss-bank.jpg",
        title: "Swiss Banks Now Accept Meme Coins, God Help Us All",
        excerpt: "Traditional finance capitulates as Pepe becomes legal tender in Geneva",
        content: "Full article content here...",
        date: "2025-11-11",
        featured: false
    },
    
    // Asia
    {
        id: 5,
        category: "Asia",
        emoji: "💎",
        image: null,
        title: "Holder Announces Diamond Hands While Secretly Panic Selling",
        excerpt: "'I'm never selling,' declares investor currently filling out market sell order",
        content: "Full article content here...",
        date: "2025-11-10",
        featured: true
    },
    {
        id: 6,
        category: "Asia",
        emoji: "🇨🇳",
        image: "images/articles/china-ban.jpg",
        title: "China Bans Crypto Again, Market Pretends to Care",
        excerpt: "This marks the 47th official ban this year, traders yawn collectively",
        content: "Full article content here...",
        date: "2025-11-09",
        featured: false
    },
    {
        id: 7,
        category: "Asia",
        emoji: "🍜",
        image: null,
        title: "Japan Creates Anime Waifu Coin, Immediately Hits $1 Billion Market Cap",
        excerpt: "Economists baffled as body pillow sales correlate with token price",
        content: "Full article content here...",
        date: "2025-11-08",
        featured: false
    },
    
    // Global
    {
        id: 8,
        category: "Global",
        emoji: "🌏",
        image: null,
        title: "UN Declares Crypto Twitter a Humanitarian Crisis",
        excerpt: "Emergency aid requested for victims of relentless shilling campaigns",
        content: "Full article content here...",
        date: "2025-11-07",
        featured: true
    },
    {
        id: 9,
        category: "Global",
        emoji: "📊",
        image: "images/articles/technical-analysis.jpg",
        title: "Technical Analysis Reveals Charts Look Exactly Like Charts",
        excerpt: "Groundbreaking study confirms lines go up, down, and sometimes sideways",
        content: "Full article content here...",
        date: "2025-11-06",
        featured: false
    },
    
    // Technology
    {
        id: 10,
        category: "Technology",
        emoji: "💻",
        image: null,
        title: "Developer Accidentally Creates Working Product, Immediately Rugs It",
        excerpt: "'I panicked when I saw actual utility,' admits anonymous founder",
        content: "Full article content here...",
        date: "2025-11-05",
        featured: false
    },
    {
        id: 11,
        category: "Technology",
        emoji: "🤖",
        image: "images/articles/ai-trader.jpg",
        title: "ChatGPT Becomes Better Trader Than Humans By Doing Nothing",
        excerpt: "AI's strategy of 'not trading at all' outperforms 99% of day traders",
        content: "Full article content here...",
        date: "2025-11-04",
        featured: true
    },
    
    // Add more articles here up to 30+
    // ...
];

// Article loading configuration
const articlesConfig = {
    articlesPerPage: 8,
    currentPage: 1,
    currentCategory: 'all',
    searchQuery: '',
    sortBy: 'date' // 'date', 'popular', 'random'
};

// Initialize article system
function initArticleSystem() {
    loadFeaturedArticles();
    setupCategoryFilters();
    setupSearchBar();
    setupLoadMoreButton();
}

// Load featured articles on homepage
function loadFeaturedArticles() {
    const featured = articleDatabase.filter(article => article.featured);
    const container = document.querySelector('#home .articles-grid');
    
    if (container) {
        container.innerHTML = '';
        featured.slice(0, 4).forEach(article => {
            container.appendChild(createArticleCard(article));
        });
    }
}

// Create article card element
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.onclick = () => {
        playSound();
        openArticle(article.id);
    };
    
    card.innerHTML = `
        <div class="article-image">
            ${article.image ? 
                `<img src="${article.image}" alt="${article.title}" onerror="this.style.display='none'; this.parentElement.innerHTML='${article.emoji}';">` : 
                article.emoji}
        </div>
        <div class="article-content">
            <span class="article-category">${article.category}</span>
            <h3 class="article-title">${article.title}</h3>
            <p class="article-excerpt">${article.excerpt}</p>
        </div>
    `;
    
    return card;
}

// Load articles for articles section
function loadArticles(category = 'all', page = 1) {
    const container = document.querySelector('#articles .articles-grid');
    if (!container) return;
    
    // Filter articles
    let filtered = articleDatabase;
    if (category !== 'all') {
        filtered = articleDatabase.filter(article => article.category === category);
    }
    
    // Apply search filter
    if (articlesConfig.searchQuery) {
        filtered = filtered.filter(article => 
            article.title.toLowerCase().includes(articlesConfig.searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(articlesConfig.searchQuery.toLowerCase())
        );
    }
    
    // Sort articles
    filtered = sortArticles(filtered, articlesConfig.sortBy);
    
    // Paginate
    const start = (page - 1) * articlesConfig.articlesPerPage;
    const end = start + articlesConfig.articlesPerPage;
    const paginated = filtered.slice(start, end);
    
    // Clear container if first page
    if (page === 1) {
        container.innerHTML = '';
    }
    
    // Add articles
    paginated.forEach(article => {
        container.appendChild(createArticleCard(article));
    });
    
    // Update load more button
    updateLoadMoreButton(filtered.length, end);
}

// Sort articles
function sortArticles(articles, sortBy) {
    const sorted = [...articles];
    
    switch(sortBy) {
        case 'date':
            return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'popular':
            // Add view count tracking for real popularity sorting
            return sorted.sort((a, b) => b.featured - a.featured);
        case 'random':
            return sorted.sort(() => Math.random() - 0.5);
        default:
            return sorted;
    }
}

// Setup category filter buttons
function setupCategoryFilters() {
    const filterButtons = `
        <div class="article-filters">
            <button onclick="filterArticles('all')" class="filter-btn active">All</button>
            <button onclick="filterArticles('Americas')" class="filter-btn">Americas</button>
            <button onclick="filterArticles('Europe')" class="filter-btn">Europe</button>
            <button onclick="filterArticles('Asia')" class="filter-btn">Asia</button>
            <button onclick="filterArticles('Global')" class="filter-btn">Global</button>
            <button onclick="filterArticles('Technology')" class="filter-btn">Technology</button>
        </div>
    `;
    
    const articlesSection = document.querySelector('#articles');
    if (articlesSection) {
        const title = articlesSection.querySelector('.featured-title');
        if (title) {
            title.insertAdjacentHTML('afterend', filterButtons);
        }
    }
}

// Filter articles by category
function filterArticles(category) {
    articlesConfig.currentCategory = category;
    articlesConfig.currentPage = 1;
    loadArticles(category, 1);
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === category || (category === 'all' && btn.textContent === 'All')) {
            btn.classList.add('active');
        }
    });
}

// Setup search bar
function setupSearchBar() {
    const searchBar = `
        <div class="article-search">
            <input type="text" id="articleSearch" placeholder="Search hilarious headlines..." onkeyup="searchArticles(this.value)">
        </div>
    `;
    
    const filters = document.querySelector('.article-filters');
    if (filters) {
        filters.insertAdjacentHTML('afterend', searchBar);
    }
}

// Search articles
function searchArticles(query) {
    articlesConfig.searchQuery = query;
    articlesConfig.currentPage = 1;
    loadArticles(articlesConfig.currentCategory, 1);
}

// Setup load more button
function setupLoadMoreButton() {
    const loadMoreBtn = `
        <div class="load-more-container" style="text-align: center; margin: 40px 0;">
            <button id="loadMoreBtn" class="load-more-btn" onclick="loadMoreArticles()">
                Load More Articles
            </button>
        </div>
    `;
    
    const articlesSection = document.querySelector('#articles');
    if (articlesSection) {
        articlesSection.insertAdjacentHTML('beforeend', loadMoreBtn);
    }
}

// Load more articles
function loadMoreArticles() {
    articlesConfig.currentPage++;
    loadArticles(articlesConfig.currentCategory, articlesConfig.currentPage);
}

// Update load more button visibility
function updateLoadMoreButton(totalArticles, loadedCount) {
    const btn = document.getElementById('loadMoreBtn');
    if (btn) {
        if (loadedCount >= totalArticles) {
            btn.style.display = 'none';
        } else {
            btn.style.display = 'inline-block';
            btn.textContent = `Load More (${totalArticles - loadedCount} remaining)`;
        }
    }
}

// Open full article (modal or new page)
function openArticle(articleId) {
    const article = articleDatabase.find(a => a.id === articleId);
    if (!article) return;
    
    // Create modal or navigate to article page
    // For now, we'll create a simple modal
    const modal = document.createElement('div');
    modal.className = 'article-modal';
    modal.innerHTML = `
        <div class="article-modal-content">
            <button class="close-modal" onclick="closeArticleModal()">×</button>
            <h1>${article.title}</h1>
            <div class="article-meta">
                <span>${article.category}</span> • <span>${article.date}</span>
            </div>
            <p class="article-lead">${article.excerpt}</p>
            <div class="article-body">
                ${article.content}
            </div>
            <div class="article-disclaimer">
                ⚠ This article is satire and should not be taken as factual reporting ⚠
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

// Close article modal
function closeArticleModal() {
    const modal = document.querySelector('.article-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Add CSS for article system
const articleStyles = `
<style>
.article-filters {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;
    flex-wrap: wrap;
}

.filter-btn {
    background: white;
    border: 2px solid #1A1A2E;
    padding: 8px 20px;
    cursor: pointer;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: all 0.3s ease;
}

.filter-btn:hover,
.filter-btn.active {
    background: #1A1A2E;
    color: #FFE66D;
}

.article-search {
    max-width: 400px;
    margin: 20px auto;
}

.article-search input {
    width: 100%;
    padding: 12px 20px;
    border: 2px solid #1A1A2E;
    font-size: 16px;
    font-family: 'Space Grotesk', sans-serif;
}

.load-more-btn {
    background: #FF6B6B;
    color: white;
    border: none;
    padding: 15px 40px;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
}

.load-more-btn:hover {
    background: #1A1A2E;
    color: #FFE66D;
    transform: translateY(-2px);
}

.article-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
    padding: 20px;
    overflow-y: auto;
}

.article-modal.active {
    opacity: 1;
}

.article-modal-content {
    background: white;
    max-width: 800px;
    width: 100%;
    padding: 40px;
    border: 4px solid #1A1A2E;
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
}

.close-modal {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    font-size: 30px;
    cursor: pointer;
    color: #1A1A2E;
}

.article-disclaimer {
    background: #FFE66D;
    color: #1A1A2E;
    padding: 15px;
    text-align: center;
    font-weight: 700;
    letter-spacing: 2px;
    margin-top: 30px;
}
</style>
`;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Add styles
        document.head.insertAdjacentHTML('beforeend', articleStyles);
        // Initialize system
        initArticleSystem();
    });
} else {
    document.head.insertAdjacentHTML('beforeend', articleStyles);
    initArticleSystem();
}

// Export functions for global use
window.filterArticles = filterArticles;
window.searchArticles = searchArticles;
window.loadMoreArticles = loadMoreArticles;
window.closeArticleModal = closeArticleModal;