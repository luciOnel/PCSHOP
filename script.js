// Основной JavaScript файл
class TechStore {
    constructor() {
        this.products = [];
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.currentPage = 1;
        this.productsPerPage = 8;
        this.currentFilter = 'all';
        this.apiBaseUrl = window.__TECHSTORE_API__ || 'http://localhost:3000/api';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProducts();
        this.updateCartUI();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Авторизация
        const authButton = document.getElementById('authButton');
        if (authButton) {
            authButton.addEventListener('click', this.toggleAuthModal.bind(this));
        }

        const closeModal = document.querySelector('.close');
        if (closeModal) {
            closeModal.addEventListener('click', this.closeAuthModal.bind(this));
        }
        
        // Вкладки авторизации
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', this.switchAuthTab.bind(this));
        });

        // Формы авторизации
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }

        // Корзина
        const cartFloatingBtn = document.getElementById('cartFloatingBtn');
        if (cartFloatingBtn) {
            cartFloatingBtn.addEventListener('click', this.toggleCart.bind(this));
        }

        const closeCart = document.querySelector('.close-cart');
        if (closeCart) {
            closeCart.addEventListener('click', this.closeCart.bind(this));
        }

        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', this.handleCheckout.bind(this));
        }

        // Фильтрация товаров
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', this.handleFilter.bind(this));
        });

        // Кнопка "Показать еще"
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', this.loadMoreProducts.bind(this));
        }

        // Кнопка "Начать покупки"
        const exploreBtn = document.getElementById('exploreBtn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', this.scrollToProducts.bind(this));
        }

        // Закрытие модальных окон по клику вне области
        window.addEventListener('click', this.handleOutsideClick.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    // Загрузка всех 25 товаров
    async loadProducts() {
        try {
            this.products = await this.getAllProducts();
            this.renderProducts();
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
            this.showNotification('Ошибка загрузки товаров', 'error');
        }
    }

    // Все 25 товаров
   getAllProducts() {
    return [
        { id: 1, name: 'Игровой ПК "Thunder Pro"', price: 125990, category: 'gaming', image: 'images/pc1.jpg', description: 'Элитный игровой компьютер для самых требовательных геймеров' },
        { id: 2, name: 'Офисный ПК "Office Elite"', price: 52500, category: 'office', image: 'images/pc2.jpg', description: 'Надежный офисный компьютер для повседневных задач' },
        { id: 3, name: 'Мультимедийный ПК "Media Master"', price: 73700, category: 'gaming', image: 'images/pc3.jpg', description: 'Универсальный компьютер для мультимедийных задач' },
        { id: 4, name: 'Игровой ПК "CyberX"', price: 98800, category: 'gaming', image: 'images/pc4.jpg', description: 'Современный игровой компьютер с агрессивным дизайном' },
        { id: 5, name: 'Рабочая станция "WorkPro"', price: 156300, category: 'workstation', image: 'images/pc5.jpg', description: 'Профессиональная рабочая станция для сложных вычислений' },
        { id: 6, name: 'Бюджетный ПК "Budget Plus"', price: 35900, category: 'budget', image: 'images/pc6.jpg', description: 'Доступный компьютер для базовых задач' },
        { id: 7, name: 'Игровой ПК "Titan RTX"', price: 189990, category: 'gaming', image: 'images/pc7.jpg', description: 'Максимальная производительность для профессиональных геймеров' },
        { id: 8, name: 'Компактный ПК "Mini Pro"', price: 67400, category: 'office', image: 'images/pc8.jpg', description: 'Компактный и стильный компьютер для современных рабочих пространств' },
        { id: 9, name: 'Студенческий ПК "Student Edition"', price: 45600, category: 'budget', image: 'images/pc9.jpg', description: 'Оптимальный компьютер для студентов' },
        { id: 10, name: 'Профессиональный ПК "Creator Pro"', price: 142800, category: 'workstation', image: 'images/pc10.jpg', description: 'Профессиональная система для творческих задач' },
        { id: 11, name: 'Игровой ПК "Vortex"', price: 112500, category: 'gaming', image: 'images/pc11.jpg', description: 'Сбалансированный игровой компьютер' },
        { id: 12, name: 'Офисный ПК "Business Class"', price: 61200, category: 'office', image: 'images/pc12.jpg', description: 'Корпоративное решение для бизнеса' },
        { id: 13, name: 'Домашний ПК "Family Center"', price: 58900, category: 'budget', image: 'images/pc13.jpg', description: 'Универсальный семейный компьютер' },
        { id: 14, name: 'Игровой ПК "Phantom"', price: 135700, category: 'gaming', image: 'images/pc14.jpg', description: 'Игровой компьютер с футуристическим дизайном' },
        { id: 15, name: 'Рабочая станция "Power Station"', price: 178400, category: 'workstation', image: 'images/pc15.jpg', description: 'Мощная рабочая станция для профессиональных задач' },
        { id: 16, name: 'Бюджетный ПК "Eco Smart"', price: 32800, category: 'budget', image: 'images/pc16.jpg', description: 'Экономичный и энергоэффективный компьютер' },
        { id: 17, name: 'Игровой ПК "Neon Blaze"', price: 95600, category: 'gaming', image: 'images/pc17.jpg', description: 'Яркий игровой компьютер с неоновой подсветкой' },
        { id: 18, name: 'Компактный ПК "Space Saver"', price: 49300, category: 'office', image: 'images/pc18.jpg', description: 'Ультракомпактный компьютер для ограниченного пространства' },
        { id: 19, name: 'Студенческий ПК "Campus Pro"', price: 41700, category: 'budget', image: 'images/pc19.jpg', description: 'Сбалансированный компьютер для студентов технических специальностей' },
        { id: 20, name: 'Профессиональный ПК "Studio Master"', price: 165900, category: 'workstation', image: 'images/pc20.jpg', description: 'Профессиональная система для звукозаписывающих студий' },
        { id: 21, name: 'Игровой ПК "Quantum"', price: 142300, category: 'gaming', image: 'images/pc21.jpg', description: 'Высокопроизводительный игровой компьютер' },
        { id: 22, name: 'Офисный ПК "Executive"', price: 72800, category: 'office', image: 'images/pc22.jpg', description: 'Премиальный офисный компьютер для руководителей' },
        { id: 23, name: 'Домашний ПК "Home Hub"', price: 63500, category: 'budget', image: 'images/pc23.jpg', description: 'Цифровой хаб для современного дома' },
        { id: 24, name: 'Игровой ПК "Apex"', price: 155600, category: 'gaming', image: 'images/pc24.jpg', description: 'Вершина игровой производительности' },
        { id: 25, name: 'Рабочая станция "Ultimate Workstation"', price: 245000, category: 'workstation', image: 'images/pc25.jpg', description: 'Абсолютная рабочая станция для самых сложных задач' }
    ];
}

    // Рендер товаров с картинками
    renderProducts() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        const filteredProducts = this.getFilteredProducts();
        const productsToShow = filteredProducts.slice(0, this.currentPage * this.productsPerPage);

        grid.innerHTML = productsToShow.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <h3>${product.name}</h3>
                <p class="price">${this.formatPrice(product.price)}</p>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                        <span class="btn-icon">🛒</span>
                        В корзину
                    </button>
                    <button class="btn btn-secondary quick-view" data-product-id="${product.id}">
                        <span class="btn-icon">👁️</span>
                        Быстрый просмотр
                    </button>
                </div>
            </div>
        `).join('');

        // Обновляем обработчики событий
        this.setupProductEventListeners();

        // Показываем/скрываем кнопку "Показать еще"
        this.toggleLoadMoreButton(filteredProducts);
    }

    // Фильтрация товаров
    getFilteredProducts() {
        if (this.currentFilter === 'all') {
            return this.products;
        }
        return this.products.filter(product => product.category === this.currentFilter);
    }

    // Обработчики событий для товаров
    setupProductEventListeners() {
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.productId);
                this.addToCart(productId);
            });
        });

        document.querySelectorAll('.quick-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.productId);
                this.quickView(productId);
            });
        });
    }

    // Добавление в корзину
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.name} добавлен в корзину`, 'success');
    }

    // Обновление UI корзины
    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        const cartItems = document.getElementById('cartItems');

        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }

        if (cartTotal) {
            const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = this.formatPrice(totalPrice);
        }

        if (cartItems) {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${this.formatPrice(item.price)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-product-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-product-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-product-id="${item.id}">&times;</button>
                </div>
            `).join('');

            // Добавляем обработчики для элементов корзины
            document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.productId);
                    this.updateCartItemQuantity(productId, 1);
                });
            });

            document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.productId);
                    this.updateCartItemQuantity(productId, -1);
                });
            });

            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.productId);
                    this.removeFromCart(productId);
                });
            });
        }
    }

    // Обновление количества товара в корзине
    updateCartItemQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.saveCart();
            this.updateCartUI();
        }
    }

    // Удаление из корзины
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Товар удален из корзины', 'info');
    }

    // Сохранение корзины в localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Работа с корзиной
    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (!cartSidebar) return;

        const isOpen = cartSidebar.classList.toggle('open');
        this.toggleCartOverlay(isOpen);
    }

    closeCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar && cartSidebar.classList.contains('open')) {
            cartSidebar.classList.remove('open');
            this.toggleCartOverlay(false);
        } else {
            this.toggleCartOverlay(false);
        }
    }

    // Авторизация
    toggleAuthModal() {
        const modal = document.getElementById('authModal');
        if (this.currentUser) {
            this.logout();
        } else if (modal) {
            modal.style.display = 'block';
        }
    }

    closeAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    switchAuthTab(e) {
        const tab = e.target.dataset.tab;
        
        // Обновляем активные вкладки
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        // Показываем соответствующую форму
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${tab}Form`).classList.add('active');
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email').trim();
        const password = formData.get('password');

        try {
            const user = await this.loginUser({ email, password });
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.closeAuthModal();
            this.checkAuthStatus();
            this.showNotification('Успешный вход!', 'success');
        } catch (error) {
            this.showNotification(error.message || 'Ошибка авторизации', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (!name) {
            this.showNotification('Пожалуйста, укажите имя', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Пароли не совпадают', 'error');
            return;
        }

        try {
            const user = await this.registerUser({ name, email, password });
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.closeAuthModal();
            this.checkAuthStatus();
            this.showNotification('Регистрация успешна!', 'success');
        } catch (error) {
            this.showNotification(error.message || 'Ошибка регистрации', 'error');
        }
    }

    // Работа с API авторизации
    async loginUser({ email, password }) {
        const response = await fetch(`${this.apiBaseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || 'Ошибка авторизации');
        }

        return data.user;
    }

    async registerUser({ name, email, password }) {
        const response = await fetch(`${this.apiBaseUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || 'Ошибка регистрации');
        }

        return data.user;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.checkAuthStatus();
        this.showNotification('Вы вышли из системы', 'info');
    }

    checkAuthStatus() {
        const authButton = document.getElementById('authButton');
        if (authButton) {
            if (this.currentUser) {
                authButton.textContent = `Выйти (${this.currentUser.name})`;
            } else {
                authButton.textContent = 'Войти';
            }
        }
    }

    // Оформление заказа
    handleCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Корзина пуста', 'warning');
            return;
        }

        if (!this.currentUser) {
            this.showNotification('Пожалуйста, войдите в систему', 'warning');
            this.toggleAuthModal();
            return;
        }

        this.showCheckoutForm();
        this.toggleCartOverlay(false);
    }

    showCheckoutForm() {
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const formHTML = `
            <div class="checkout-form">
                <h3>Оформление заказа</h3>
                <form id="checkoutForm">
                    <div class="form-group">
                        <label>Адрес доставки:</label>
                        <input type="text" name="address" required>
                    </div>
                    <div class="form-group">
                        <label>Телефон:</label>
                        <input type="tel" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label>Комментарий:</label>
                        <textarea name="comment" rows="3"></textarea>
                    </div>
                    <div class="order-summary">
                        <h4>Итого: ${this.formatPrice(total)}</h4>
                    </div>
                    <button type="submit" class="btn btn-primary">Подтвердить заказ</button>
                </form>
            </div>
        `;

        this.showModal('Оформление заказа', formHTML);
        
        document.getElementById('checkoutForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processOrder();
        });
    }

    async processOrder() {
        try {
            await this.mockApiCreateOrder({
                userId: this.currentUser.id,
                items: this.cart,
                total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            });

            this.cart = [];
            this.saveCart();
            this.updateCartUI();
            this.closeCart();
            this.closeModal();
            
            this.showNotification('Заказ успешно оформлен!', 'success');
        } catch (error) {
            this.showNotification('Ошибка оформления заказа', 'error');
        }
    }

    async mockApiCreateOrder(orderData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Order created:', orderData);
                resolve({ orderId: Date.now(), ...orderData });
            }, 1500);
        });
    }

    // Фильтрация товаров
    handleFilter(e) {
        const filter = e.target.dataset.filter;
        
        // Обновляем активную кнопку
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        this.currentFilter = filter;
        this.currentPage = 1;
        this.renderProducts();
    }

    // Загрузка дополнительных товаров
    loadMoreProducts() {
        this.currentPage++;
        this.renderProducts();
    }

    toggleLoadMoreButton(filteredProducts) {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;

        const totalProducts = filteredProducts.length;
        const showingProducts = Math.min(this.currentPage * this.productsPerPage, totalProducts);

        if (showingProducts >= totalProducts) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    // Быстрый просмотр товара
    quickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const quickViewHTML = `
            <div class="quick-view-modal">
                <div class="product-detail">
                    <div class="product-image quick-view-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="price">${this.formatPrice(product.price)}</p>
                        <div class="specs">
                            <h4>Описание:</h4>
                            <p>${product.description}</p>
                        </div>
                        <div class="product-actions quick-view-actions">
                            <button class="btn btn-primary add-to-cart-large" data-product-id="${product.id}">
                                <span class="btn-icon">🛒</span>
                                Добавить в корзину
                            </button>
                            <button class="btn btn-secondary close-quick-view">
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modal = this.showModal('Быстрый просмотр', quickViewHTML, { size: 'large', modalClass: 'modal-quick-view' });
        
        // Добавляем обработчики
        modal.querySelector('.add-to-cart-large').addEventListener('click', () => {
            this.addToCart(productId);
            this.closeModal();
        });

        modal.querySelector('.close-quick-view').addEventListener('click', () => {
            this.closeModal();
        });
    }

    // Вспомогательные методы
    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);

        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.remove();
        });
    }

    showModal(title, content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal dynamic-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3 style="padding: 1.5rem 1.5rem 0; margin: 0; color: #2c3e50;">${title}</h3>
                <div style="padding: 1.5rem;">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        const modalContent = modal.querySelector('.modal-content');
        if (options.size === 'large') {
            modalContent.classList.add('modal-large');
        }
        if (options.modalClass) {
            modalContent.classList.add(options.modalClass);
        }

        modal.querySelector('.close').addEventListener('click', () => {
            modal.remove();
        });

        return modal;
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal.dynamic-modal');
        const modal = modals[modals.length - 1];
        if (modal) {
            modal.remove();
        }
    }

    // Прокрутка к товарам
    scrollToProducts() {
        const productsSection = document.querySelector('.featured-products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Обработка клика вне области
    handleOutsideClick(e) {
        const authModal = document.getElementById('authModal');
        if (authModal && e.target === authModal) {
            this.closeAuthModal();
        }
        
        const modals = document.querySelectorAll('.modal.dynamic-modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        const cartSidebar = document.getElementById('cartSidebar');
        const cartIsOpen = cartSidebar?.classList.contains('open');
        if (cartIsOpen && e.target.classList && e.target.classList.contains('cart-overlay')) {
            this.closeCart();
        }
    }

    handleKeyDown(e) {
        if (e.key !== 'Escape') return;

        const dynamicModals = document.querySelectorAll('.modal.dynamic-modal');
        if (dynamicModals.length) {
            this.closeModal();
            return;
        }

        const authModal = document.getElementById('authModal');
        if (authModal && authModal.style.display === 'block') {
            this.closeAuthModal();
            return;
        }

        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar && cartSidebar.classList.contains('open')) {
            this.closeCart();
        }
    }

    toggleCartOverlay(show) {
        let overlay = document.querySelector('.cart-overlay');

        if (show) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'cart-overlay';
                overlay.addEventListener('click', () => this.closeCart());
                document.body.appendChild(overlay);
            }
            requestAnimationFrame(() => {
                overlay.classList.add('visible');
            });
        } else if (overlay) {
            overlay.classList.remove('visible');
            overlay.addEventListener('transitionend', () => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, { once: true });
        }
    }

    // Предоставление данных товаров для интеграций
    mockApiGetProducts() {
        return this.products.length ? this.products : this.getAllProducts();
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.techStore = new TechStore();
});