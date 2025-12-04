document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');
    const mainNavbar = document.getElementById('mainNavbar');
    const sideCart = document.getElementById('side-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartIcon = document.getElementById('cart-icon');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');

    // --- Product Data ---
    const allProducts = [
        {
            id: 1,
            name: 'Omen Gaming Laptop',
            image: 'omen.png',
            description: 'Experience unparalleled gaming performance with the Omen series.',
            price: 189900
        },
        {
            id: 2,
            name: 'ROG Zephyrus Duo',
            image: 'rog.png',
            description: 'Dual-screen ROG Zephyrus Duo designed for extreme multitasking and gaming.',
            price: 329990
        },
        {
            id: 3,
            name: 'MacBook Air M2',
            image: 'macbook.png',
            description: 'Ultra-light and powerful MacBook Air with the M2 chip.',
            price: 114900
        },
        {
            id: 4,
            name: 'Samsung S25 Ultra',
            image: 's25.png',
            description: 'Samsung’s flagship monster featuring a pro-grade camera and top-tier performance.',
            price: 129999
        },
        {
            id: 5,
            name: 'iPhone 17 Pro',
            image: '17pro.png',
            description: 'Apple’s next-gen flagship featuring ProMotion and advanced A19 Bionic chipset.',
            price: 139999
        },
        {
            id: 6,
            name: 'Samsung Galaxy Z Flip 7',
            image: 'flip.png',
            description: 'Next-gen compact foldable with improved hinge, camera and battery.',
            price: 109999
        },
    
        /* 🔊 Headphones Section */
        {
            id: 7,
            name: 'Sony WH-1000XM5',
            image: 'sony.png',
            description: 'Industry-leading ANC with premium sound and comfort.',
            price: 29990
        },
        {
            id: 8,
            name: 'Bose QuietComfort Ultra',
            image: 'bose.png',
            description: 'Ultimate comfort and crystal-clear ANC with premium sound.',
            price: 34990
        },
        {
            id: 9,
            name: 'JBL Tour One M2',
            image: 'jbl.png',
            description: 'Signature JBL sound with adaptive noise cancellation.',
            price: 21999
        }
    ];
    

    // --- Cart State and Functions ---
    let cart = JSON.parse(localStorage.getItem('techStoreCart')) || [];

    function saveCart() {
        localStorage.setItem('techStoreCart', JSON.stringify(cart));
    }

    function formatCurrency(amount) {
        return `₹${amount.toFixed(2)}`; // Using Indian Rupee symbol
    }

    function openCart() {
        sideCart.classList.add('open');
        cartOverlay.classList.add('open');
    }

    function closeCart() {
        sideCart.classList.remove('open');
        cartOverlay.classList.remove('open');
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }

    function calculateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = formatCurrency(total);
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = ''; // Clear previous items

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
            return;
        }

        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.dataset.productId = item.id; // Store product ID on the element

            cartItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${formatCurrency(item.price)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });

        // Add event listeners for quantity changes and removal
        cartItemsContainer.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                changeQuantity(id, -1);
            });
        });
        cartItemsContainer.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                changeQuantity(id, 1);
            });
        });
        cartItemsContainer.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                removeFromCart(id);
            });
        });

        calculateCartTotal();
    }

    function addToCart(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;

        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        updateCartCount();
        renderCartItems();
        openCart(); // Open cart automatically when an item is added
    }

    function changeQuantity(productId, change) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity += change;
            if (cartItem.quantity <= 0) {
                removeFromCart(productId);
            } else {
                saveCart();
                renderCartItems();
                updateCartCount();
            }
        }
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        renderCartItems();
        updateCartCount();
        if (cart.length === 0) {
            closeCart(); // Close cart if it becomes empty
        }
    }

    // --- Page Product Rendering ---
    function renderPageProducts(productsToRender) {
        if (!productsContainer) return;

        productsContainer.innerHTML = '';

        productsToRender.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">${formatCurrency(product.price)}</p>
                <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            `;
            productsContainer.appendChild(productDiv);
        });

        // Add event listeners to newly rendered "Add to Cart" buttons
        productsContainer.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                addToCart(productId);
            });
        });
    }

    // --- Initialize Page ---
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'index.html' || currentPage === '') {
        const previewProducts = allProducts.slice(0, 3); // only 3 products

        renderPageProducts(previewProducts);
    } else if (currentPage === 'products.html') {
        renderPageProducts(allProducts);
    }

    // --- Event Listeners for Cart UI ---
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            renderCartItems(); // Render items before opening
            openCart();
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    // Initial render of cart on page load
    updateCartCount();
    renderCartItems(); // Render to show "Your cart is empty" or existing items
});
// -------------------- CONTACT FORM SUBMISSION --------------------
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent page refresh

            alert("Form submitted successfully! Thank you for your feedback.");

            contactForm.reset(); // Clear form
        });
    }
});




