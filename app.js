import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQoDu0ZDyvhA7HsIWvYqXZi3Ka5w3VE3o",
  authDomain: "globalgrab-catlog.firebaseapp.com",
  projectId: "globalgrab-catlog",
  storageBucket: "globalgrab-catlog.firebasestorage.app",
  messagingSenderId: "75700633115",
  appId: "1:75700633115:web:6c8a47a4ce1258c60ec2be",
  measurementId: "G-NWV1LVDB69"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let products = [];
let currentFilter = 'all';

// Listen to products in real-time
onSnapshot(collection(db, "products"), (snapshot) => {
    products = [];
    snapshot.forEach(doc => products.push(doc.data()));
    products.sort((a, b) => a.id - b.id);
    renderProducts(currentFilter);
}, (error) => {
    console.error("Error fetching products. Make sure Firestore is created in test mode.", error);
});

const catalogGrid = document.getElementById('catalogGrid');
const filterLinks = document.querySelectorAll('.nav-links a');

// Modal Elements
const modal = document.getElementById('productModal');
const closeModalBtn = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');

// Render Products
function renderProducts(filter = 'all') {
    catalogGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter);

    filteredProducts.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        if (product.inStock === false) {
            card.classList.add('out-of-stock');
        }
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}">
                ${product.inStock === false ? '<div class="out-of-stock-badge">Out of Stock</div>' : ''}
                ${product.originalPrice ? '<div class="sale-badge" style="position:absolute; top:10px; left:10px; background:var(--accent); color:black; padding:5px 10px; border-radius:5px; font-size:0.8rem; font-weight:bold; z-index:2;">SALE</div>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">${product.originalPrice ? `<s style="color:#aaa; font-size:0.9em; margin-right:5px;">${product.originalPrice}</s>` : ''}${product.price}</p>
            </div>
        `;
        
        if (product.inStock !== false) {
            card.addEventListener('click', () => openModal(product));
        }
        catalogGrid.appendChild(card);
    });
}

// Filter Logic
filterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active class
        filterLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Filter
        const filter = link.getAttribute('data-filter');
        renderProducts(filter);
    });
});

let currentProduct = null;
let selectedSize = null;
let selectedColor = null;

// Checkout Elements
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutBtn = document.getElementById('closeCheckout');
const checkoutImage = document.getElementById('checkoutImage');
const checkoutTitle = document.getElementById('checkoutTitle');
const checkoutSize = document.getElementById('checkoutSize');
const checkoutPrice = document.getElementById('checkoutPrice');
const checkoutForm = document.getElementById('checkoutForm');
const addToCartBtn = document.querySelector('.add-to-cart-btn');

addToCartBtn.textContent = 'Buy Now';

// Modal Logic
function openModal(product) {
    currentProduct = product;
    selectedSize = null;
    selectedColor = null;
    
    // Dynamic sizes based on category
    const modalSizes = document.getElementById('modalSizes');
    modalSizes.innerHTML = '';
    
    let availableSizes = [];
    if (product.category === 'tshirts') {
        availableSizes = ['M', 'L', 'XL'];
    } else if (product.category === 'jeans') {
        availableSizes = ['28', '30', '32', '34', '36'];
    }
    
    availableSizes.forEach(size => {
        const btn = document.createElement('button');
        btn.className = 'size-btn';
        btn.textContent = size;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedSize = size;
        });
        modalSizes.appendChild(btn);
    });
    
    const colorSelectorContainer = document.getElementById('colorSelectorContainer');
    const modalColors = document.getElementById('modalColors');
    if (modalColors) modalColors.innerHTML = '';
    
    if (product.colors && product.colors.length > 0 && colorSelectorContainer) {
        colorSelectorContainer.style.display = 'block';
        
        // Filter out completely disabled if all colors out of stock? We handle whole product out of stock elsewhere.
        // Find first in-stock color
        selectedColor = product.colors.find(c => c.inStock !== false) || product.colors[0];
        modalImage.src = selectedColor.image;
        modalPrice.textContent = selectedColor.price;
        
        product.colors.forEach((color, index) => {
            const btn = document.createElement('button');
            btn.className = 'color-btn';
            btn.textContent = color.name;
            
            const isOutOfStock = color.inStock === false;
            
            if (color === selectedColor) btn.classList.add('selected');
            if (isOutOfStock) {
                btn.style.opacity = '0.4';
                btn.style.textDecoration = 'line-through';
                btn.style.cursor = 'not-allowed';
            }
            
            btn.addEventListener('click', () => {
                if (isOutOfStock) return;
                
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedColor = color;
                
                // Update image and price
                modalImage.src = color.image;
                modalPrice.textContent = color.price;
            });
            modalColors.appendChild(btn);
        });
    } else {
        if (colorSelectorContainer) colorSelectorContainer.style.display = 'none';
        
        currentProduct = product;
        selectedColor = null;
        selectedSize = null;
        
        modalImage.src = product.image;
        
        // Original price logic for modal
        const priceHTML = product.originalPrice ? 
            `<s style="color:#aaa; font-size:0.8em; margin-right:8px;">${product.originalPrice}</s>${product.price}` : 
            product.price;
            
        modalPrice.innerHTML = priceHTML;
    }
    
    modalTitle.textContent = product.title;
    modalDesc.textContent = product.description;
    
    // --- Related Products Logic ---
    const relatedGrid = document.getElementById('relatedProductsGrid');
    if (relatedGrid) {
        relatedGrid.innerHTML = '';
        
        // Find 3 products from same category, excluding current product
        const related = products.filter(p => p.category === product.category && p.id !== product.id && p.inStock !== false);
        
        // Shuffle and pick top 3
        const shuffled = related.sort(() => 0.5 - Math.random()).slice(0, 3);
        
        shuffled.forEach(rel => {
            const relCard = document.createElement('div');
            relCard.className = 'related-product-card';
            relCard.innerHTML = `
                <img src="${rel.image}" alt="${rel.title}">
                <p>${rel.title}</p>
                <p style="color:var(--accent);">${rel.price}</p>
            `;
            // Click to open this product
            relCard.addEventListener('click', () => {
                openModal(rel);
            });
            relatedGrid.appendChild(relCard);
        });
        
        if (shuffled.length === 0) {
            relatedGrid.innerHTML = '<p style="color:#aaa; font-size:0.8rem;">No related items found.</p>';
        }
    }
    
    if (window.location.hash !== '#modal') {
        history.pushState(null, '', '#modal');
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

window.addEventListener('popstate', () => {
    modal.classList.remove('active');
    checkoutModal.classList.remove('active');
    cartSidebar.classList.remove('active');
    document.getElementById('myOrdersModal').classList.remove('active');
    document.getElementById('successModal').classList.remove('active');
    document.body.style.overflow = '';
});

function closeModal() {
    if (window.location.hash === '#modal') {
        history.back();
    } else {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// --- Cart System Logic ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartSidebar = document.getElementById('cartSidebar');
const floatingCartBtn = document.getElementById('floatingCartBtn');
const cartCount = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const closeCartBtn = document.getElementById('closeCartBtn');
const checkoutCartBtn = document.getElementById('checkoutCartBtn');

function updateCartUI() {
    cartCount.textContent = cart.length;
    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#aaa; margin-top:20px;">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            // Parse price string to number (e.g. "₹1,299" -> 1299)
            const priceNum = parseInt(item.price.replace(/[^\d]/g, ''), 10) || 0;
            total += priceNum;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>Size: ${item.size}</p>
                    <p style="font-weight:bold; color:var(--accent); margin-top:5px;">${item.price}</p>
                </div>
                <button class="remove-item-btn" data-index="${index}">&times;</button>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });
    }
    
    cartTotalPrice.textContent = `₹${total.toLocaleString('en-IN')}`;
    
    // Attach remove listeners
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'));
            cart.splice(idx, 1);
            saveCart();
            updateCartUI();
        });
    });
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Initial UI update
updateCartUI();

floatingCartBtn.addEventListener('click', () => {
    if (window.location.hash !== '#modal') {
        history.pushState(null, '', '#modal');
    }
    cartSidebar.classList.add('active');
});

closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
});

// Update the Add to Cart button behavior
addToCartBtn.textContent = 'Add to Cart';

addToCartBtn.addEventListener('click', () => {
    if (!selectedSize) {
        alert('Please select a size first.');
        return;
    }
    
    const finalImage = selectedColor ? selectedColor.image : currentProduct.image;
    const finalTitle = selectedColor ? `${currentProduct.title} - ${selectedColor.name}` : currentProduct.title;
    const finalPrice = selectedColor ? selectedColor.price : currentProduct.price;
    
    cart.push({
        title: finalTitle,
        image: finalImage,
        price: finalPrice,
        size: selectedSize
    });
    
    saveCart();
    updateCartUI();
    
    // Close modal and open cart sidebar
    closeModal();
    if (window.location.hash !== '#modal') {
        history.pushState(null, '', '#modal');
    }
    cartSidebar.classList.add('active');
});

// Open Checkout Modal from Cart
checkoutCartBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    cartSidebar.classList.remove('active');
    
    // Update Checkout UI for multiple items
    checkoutImage.style.display = 'none'; // hide single image
    checkoutTitle.textContent = `${cart.length} item(s) in order`;
    checkoutSize.textContent = "Multiple";
    checkoutPrice.textContent = cartTotalPrice.textContent;
    
    if (window.location.hash !== '#modal') {
        history.pushState(null, '', '#modal');
    }
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close Checkout Modal
function closeCheckout() {
    if (window.location.hash === '#modal') {
        history.back();
    } else {
        checkoutModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}
closeCheckoutBtn.addEventListener('click', closeCheckout);
checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) closeCheckout();
});

// Pincode Auto-Detect Logic
const pincodeInput = document.getElementById('cPincode');
const cityInput = document.getElementById('cCity');
const stateSelect = document.getElementById('cState');

pincodeInput.addEventListener('input', async (e) => {
    const pin = e.target.value;
    if (pin.length === 6 && !isNaN(pin)) {
        try {
            cityInput.value = "Detecting...";
            
            const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
            const data = await response.json();
            
            if (data && data[0].Status === 'Success') {
                const postOffice = data[0].PostOffice[0];
                cityInput.value = postOffice.District; 
                
                const state = postOffice.State;
                const stateOption = Array.from(stateSelect.options).find(opt => opt.value === state || opt.text === state);
                if (stateOption) {
                    stateOption.selected = true;
                }
            } else {
                cityInput.value = ""; 
            }
        } catch (err) {
            console.error('Error fetching pincode details:', err);
            cityInput.value = "";
        }
    } else if (cityInput.value === "Detecting...") {
        cityInput.value = "";
    }
});

// Handle WhatsApp Submit
checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('cName').value;
    const phone = document.getElementById('cPhone').value;
    const email = document.getElementById('cEmail').value;
    const address = document.getElementById('cAddress').value;
    const city = document.getElementById('cCity').value;
    const state = document.getElementById('cState').value;
    const pincode = document.getElementById('cPincode').value;
    
    // Build the order summary
    let orderSummary = "";
    let imageLinks = "\n\n*Product Images:*\n";
    cart.forEach((item, i) => {
        orderSummary += `${i+1}. ${item.title} (Size: ${item.size}) - ${item.price}\n`;
        
        // Make image URLs absolute for WhatsApp preview
        try {
            const absUrl = new URL(item.image, window.location.origin).href;
            imageLinks += `${absUrl}\n`;
        } catch(e) {
            imageLinks += `${item.image}\n`; // Fallback if already absolute or invalid
        }
    });
    
    const total = cartTotalPrice.textContent;
    
    const message = `*NEW ORDER - GLOBAL GRAB* 🛍️\n\n*Items:*\n${orderSummary}\n*Total Price:* ${total}\n\n*Delivery Details:*\n*Name:* ${name}\n*Phone:* +91 ${phone}\n*Email:* ${email}\n*Address:* ${address}\n*City:* ${city}\n*State:* ${state}\n*PIN Code:* ${pincode}\n\nIs this available?${imageLinks}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '919317091542';
    
    // Save order to Firestore first
    const orderData = {
        customerInfo: { name, phone, email, address, city, state, pincode },
        items: cart.map(item => ({ title: item.title, size: item.size, price: item.price, image: item.image })),
        totalPrice: total,
        timestamp: serverTimestamp(), // For Firestore
        status: "Pending" // Default status
    };
    
    // Save to LocalStorage for "My Orders" feature (with a string timestamp instead of server object)
    let localOrderData = { ...orderData, timestamp: new Date().toISOString() };
    let myOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
    myOrders.unshift(localOrderData); // Add to beginning
    localStorage.setItem('myOrders', JSON.stringify(myOrders));
    
    // Save order to Firestore first (without awaiting, so we don't block the popup)
    addDoc(collection(db, "orders"), orderData).catch(err => {
        console.error("Error saving order to DB:", err);
    });
    
    // 1. Open WhatsApp in new tab IMMEDIATELY
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    
    // 2. Clear Cart and Update UI
    cart = [];
    saveCart();
    updateCartUI();
    
    // 3. Close Checkout Modal properly
    closeCheckout();
    
    // 4. Show Success Modal and set session flag
    const successModal = document.getElementById('successModal');
    successModal.classList.add('active');
    sessionStorage.setItem('showSuccessModal', 'true');
    
    // 5. Reset the form
    checkoutForm.reset();
});

// Setup Success Modal Close Handlers
const successModal = document.getElementById('successModal');
document.querySelector('.close-success').addEventListener('click', () => {
    successModal.classList.remove('active');
});
document.getElementById('continueShoppingBtn').addEventListener('click', () => {
    successModal.classList.remove('active');
});

// Check if we need to show the success modal after a refresh/return from WhatsApp
if (sessionStorage.getItem('showSuccessModal') === 'true') {
    sessionStorage.removeItem('showSuccessModal');
    document.getElementById('successModal').classList.add('active');
}

// ==========================================
// MY ORDERS LOGIC
// ==========================================
const myOrdersBtn = document.getElementById('myOrdersBtn');
const myOrdersModal = document.getElementById('myOrdersModal');
const closeMyOrders = document.querySelector('.close-my-orders');
const myOrdersList = document.getElementById('myOrdersList');
const viewMyOrdersBtn = document.getElementById('viewMyOrdersBtn');

function renderMyOrders() {
    let myOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
    myOrdersList.innerHTML = '';
    
    if (myOrders.length === 0) {
        myOrdersList.innerHTML = '<p style="text-align:center; color:#aaa; margin-top:30px;">You haven\'t placed any orders yet.</p>';
        return;
    }
    
    myOrders.forEach((order, idx) => {
        const dateStr = new Date(order.timestamp).toLocaleString();
        
        const card = document.createElement('div');
        card.style.cssText = 'background: #1a1c23; border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 15px;';
        
        let itemsHtml = order.items.map(item => `
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px; background:#0f1115; padding:8px; border-radius:6px;">
                <img src="${item.image}" alt="${item.title}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;">
                <div>
                    <p style="margin:0; font-weight:bold; font-size:0.9rem;">${item.title}</p>
                    <p style="margin:0; font-size:0.8rem; color:#aaa;">Size: ${item.size} | ${item.price}</p>
                </div>
            </div>
        `).join('');
        
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:10px;">
                <span style="font-family:'Bebas Neue', sans-serif; color:#d4af37; font-size:1.2rem; letter-spacing:1px;">Order ${myOrders.length - idx}</span>
                <span style="color:#aaa; font-size:0.8rem;">${dateStr}</span>
            </div>
            <div>${itemsHtml}</div>
            <div style="text-align:right; font-weight:bold; color:var(--accent); margin-top:10px; padding-top:10px; border-top:1px solid #333;">
                Total: ${order.totalPrice}
            </div>
        `;
        myOrdersList.appendChild(card);
    });
}

function openMyOrders() {
    renderMyOrders();
    if (window.location.hash !== '#modal') {
        history.pushState(null, '', '#modal');
    }
    myOrdersModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

myOrdersBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openMyOrders();
});

viewMyOrdersBtn.addEventListener('click', () => {
    document.getElementById('successModal').classList.remove('active');
    openMyOrders();
});

closeMyOrders.addEventListener('click', () => {
    myOrdersModal.classList.remove('active');
    document.body.style.overflow = '';
});

myOrdersModal.addEventListener('click', (e) => {
    if (e.target === myOrdersModal) {
        myOrdersModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});
