// API интеграции
class TechStoreAPI {
    constructor() {
        this.baseURL = 'https://jsonplaceholder.typicode.com'; // Тестовый API
        this.unsplashAccessKey = 'YOUR_UNSPLASH_ACCESS_KEY'; // В реальном приложении нужно получить ключ
        this.leafletPromise = null;
        this.leafletMap = null;
        this.shopCoordinates = { lat: 59.91795, lng: 30.30897 };
    }

    // Получение реальных изображений товаров через Unsplash API
    async getProductImages(query = 'gaming computer', count = 10) {
        try {
            // В реальном приложении раскомментировать и использовать свой API ключ
            /*
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${query}&per_page=${count}&client_id=${this.unsplashAccessKey}`
            );
            
            if (!response.ok) throw new Error('Ошибка загрузки изображений');
            
            const data = await response.json();
            return data.results.map(photo => ({
                url: photo.urls.regular,
                alt: photo.alt_description
            }));
            */
            
            // Заглушка для демонстрации
            return this.mockProductImages(count);
        } catch (error) {
            console.error('Error fetching product images:', error);
            return this.mockProductImages(count);
        }
    }

    // Мок изображений для демонстрации
    mockProductImages(count) {
        const images = [];
        for (let i = 1; i <= count; i++) {
            images.push({
                url: `images/pc${i}.jpg`,
                alt: `Компьютер ${i}`
            });
        }
        return images;
    }

    // Интеграция с картами (Leaflet + OpenStreetMap)
    async initMap() {
        const mapContainer = document.getElementById('contactMap');
        if (!mapContainer) return;

        try {
            await this.ensureLeaflet();
            this.showLeafletMap(mapContainer);
        } catch (error) {
            console.error('Error initialising map:', error);
            this.showMockMap(mapContainer);
        }
    }

    ensureLeaflet() {
        if (window.L) {
            return Promise.resolve();
        }

        if (this.leafletPromise) {
            return this.leafletPromise;
        }

        this.leafletPromise = new Promise((resolve, reject) => {
            const existingStylesheet = document.getElementById('leaflet-css');
            if (!existingStylesheet) {
                const leafletCSS = document.createElement('link');
                leafletCSS.id = 'leaflet-css';
                leafletCSS.rel = 'stylesheet';
                leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(leafletCSS);
            }

            const script = document.createElement('script');
            script.id = 'leaflet-js';
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => resolve();
            script.onerror = reject;
            document.body.appendChild(script);
        });

        return this.leafletPromise;
    }

    showLeafletMap(mapContainer) {
        if (!window.L) {
            this.showMockMap(mapContainer);
            return;
        }

        if (this.leafletMap) {
            this.leafletMap.remove();
            this.leafletMap = null;
        }

        mapContainer.innerHTML = '';
        mapContainer.setAttribute('tabindex', '0');
        const coords = [this.shopCoordinates.lat, this.shopCoordinates.lng];

        this.leafletMap = L.map(mapContainer, {
            scrollWheelZoom: false
        }).setView(coords, 16);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.leafletMap);

        L.marker(coords)
            .addTo(this.leafletMap)
            .bindPopup('TechStore<br>1-я Красноармейская ул., Санкт-Петербург, 190005')
            .openPopup();

        mapContainer.addEventListener('mouseenter', () => this.leafletMap.scrollWheelZoom.enable());
        mapContainer.addEventListener('mouseleave', () => this.leafletMap.scrollWheelZoom.disable());
    }

    showMockMap(mapContainer) {
        if (!mapContainer) return;

        mapContainer.innerHTML = `
            <div class="map-fallback">
                <div class="map-icon">🗺️</div>
                <p>1-я Красноармейская ул., Санкт-Петербург, 190005</p>
                <p class="map-note">Не удалось загрузить карту. Попробуйте обновить страницу.</p>
            </div>
        `;
    }

    // API для работы с валютой (курсы валют)
    async getExchangeRates() {
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/RUB');
            if (!response.ok) throw new Error('Ошибка загрузки курсов валют');
            
            const data = await response.json();
            return data.rates;
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            return this.mockExchangeRates();
        }
    }

    mockExchangeRates() {
        return {
            USD: 0.011,
            EUR: 0.010,
            CNY: 0.079
        };
    }

    // API для проверки доступности товара
    async checkProductAvailability(productId) {
        try {
            // В реальном приложении здесь был бы запрос к вашему API
            const response = await fetch(`${this.baseURL}/posts/${productId}`);
            if (!response.ok) throw new Error('Ошибка проверки доступности');
            
            // Симуляция проверки доступности
            const isAvailable = Math.random() > 0.3; // 70% вероятность наличия
            return {
                available: isAvailable,
                deliveryTime: isAvailable ? '1-2 дня' : '2-3 недели',
                inStock: Math.floor(Math.random() * 50) + 1
            };
        } catch (error) {
            console.error('Error checking product availability:', error);
            return {
                available: true,
                deliveryTime: '1-2 дня',
                inStock: 10
            };
        }
    }

    // API для отправки отзывов
    async submitReview(productId, reviewData) {
        try {
            const response = await fetch(`${this.baseURL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    ...reviewData,
                    userId: window.techStore?.currentUser?.id || 'anonymous',
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) throw new Error('Ошибка отправки отзыва');
            
            const data = await response.json();
            return { success: true, reviewId: data.id };
        } catch (error) {
            console.error('Error submitting review:', error);
            return { success: false, error: error.message };
        }
    }

    // API для получения рекомендаций
    async getProductRecommendations(userId, productId = null) {
        try {
            // В реальном приложении здесь была бы ML-рекомендательная система
            const response = await fetch(`${this.baseURL}/posts?_limit=4`);
            if (!response.ok) throw new Error('Ошибка загрузки рекомендаций');
            
            const data = await response.json();
            return this.mockRecommendations();
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            return this.mockRecommendations();
        }
    }

    mockRecommendations() {
        return [
            { id: 101, name: 'Игровая мышь Razer', price: 4500, image: 'images/pc6.jpg' },
            { id: 102, name: 'Механическая клавиатура', price: 8900, image: 'images/pc7.jpg' },
            { id: 103, name: 'Игровой монитор 27"', price: 23400, image: 'images/pc8.jpg' },
            { id: 104, name: 'Игровое кресло', price: 15600, image: 'images/pc9.jpg' }
        ];
    }

    // API для подписки на рассылку
    async subscribeToNewsletter(email) {
        try {
            const response = await fetch(`${this.baseURL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    type: 'newsletter',
                    subscribed: true,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) throw new Error('Ошибка подписки');
            
            return { success: true, message: 'Вы успешно подписались на рассылку' };
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            return { success: false, error: error.message };
        }
    }

    // API для поиска товаров
    async searchProducts(query, filters = {}) {
        try {
            // В реальном приложении здесь был бы поиск по вашему API
            const response = await fetch(`${this.baseURL}/posts?q=${query}`);
            if (!response.ok) throw new Error('Ошибка поиска');
            
            // Симуляция поиска по нашим товарам
            const allProducts = await window.techStore?.mockApiGetProducts() || [];
            const searchResults = allProducts.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );

            return {
                results: searchResults,
                total: searchResults.length,
                query,
                filters
            };
        } catch (error) {
            console.error('Error searching products:', error);
            return { results: [], total: 0, query, filters };
        }
    }

    // API для получения статистики
    async getStoreStats() {
        try {
            // В реальном приложении здесь была бы аналитика
            return {
                totalProducts: 156,
                totalOrders: 1247,
                happyCustomers: 98.2,
                deliveryTime: '1.3 дня'
            };
        } catch (error) {
            console.error('Error fetching store stats:', error);
            return this.mockStoreStats();
        }
    }

    mockStoreStats() {
        return {
            totalProducts: 150,
            totalOrders: 1200,
            happyCustomers: 97.5,
            deliveryTime: '1.5 дня'
        };
    }
}

// Инициализация API
window.techStoreAPI = new TechStoreAPI();

// Дополнительные функции для интеграции с API
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация карты на странице контактов
    if (document.querySelector('.map-placeholder')) {
        techStoreAPI.initMap();
    }

    // Загрузка дополнительных данных при необходимости
    loadAdditionalData();
});

async function loadAdditionalData() {
    // Загрузка курсов валют
    const rates = await techStoreAPI.getExchangeRates();
    console.log('Exchange rates:', rates);

    // Загрузка статистики магазина
    const stats = await techStoreAPI.getStoreStats();
    console.log('Store stats:', stats);
}

// Функция для поиска товаров
async function handleSearch(query) {
    const searchResults = await techStoreAPI.searchProducts(query);
    displaySearchResults(searchResults);
}

function displaySearchResults(results) {
    // Реализация отображения результатов поиска
    console.log('Search results:', results);
}

// Функция для проверки доступности товара
async function checkAvailability(productId) {
    const availability = await techStoreAPI.checkProductAvailability(productId);
    return availability;
}

// Функция для отправки отзыва
async function submitReview(productId, rating, comment) {
    const result = await techStoreAPI.submitReview(productId, { rating, comment });
    return result;
}

// Функция для подписки на рассылку
async function subscribeNewsletter(email) {
    const result = await techStoreAPI.subscribeToNewsletter(email);
    return result;
}