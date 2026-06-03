import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">${product.price}</p>
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
        modalImage.src = product.image;
        modalPrice.textContent = product.price;
    }
    
    modalTitle.textContent = product.title;
    modalDesc.textContent = product.description;
    
    if (window.location.hash !== '#modal') {
        history.pushState(null, '', '#modal');
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

window.addEventListener('popstate', () => {
    modal.classList.remove('active');
    checkoutModal.classList.remove('active');
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

// Open Checkout Modal
addToCartBtn.addEventListener('click', () => {
    if (!selectedSize) {
        alert('Please select a size first.');
        return;
    }
    
    // Switch modals without touching history (keeps the #modal hash active)
    modal.classList.remove('active');
    
    // Check if the image path is local and needs absolute url for whatsapp - we only need it for display locally so relative is fine for the modal display
    checkoutImage.src = selectedColor ? selectedColor.image : currentProduct.image;
    checkoutTitle.textContent = selectedColor ? `${currentProduct.title} - ${selectedColor.name}` : currentProduct.title;
    checkoutPrice.textContent = selectedColor ? selectedColor.price : currentProduct.price;
    checkoutSize.textContent = selectedSize;
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
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('cName').value;
    const phone = document.getElementById('cPhone').value;
    const email = document.getElementById('cEmail').value;
    const address = document.getElementById('cAddress').value;
    const city = document.getElementById('cCity').value;
    const state = document.getElementById('cState').value;
    const pincode = document.getElementById('cPincode').value;
    
    // Create absolute URL for the image so WhatsApp can generate a preview
    const finalImage = selectedColor ? selectedColor.image : currentProduct.image;
    const finalTitle = selectedColor ? `${currentProduct.title} - ${selectedColor.name}` : currentProduct.title;
    const finalPrice = selectedColor ? selectedColor.price : currentProduct.price;
    const absoluteImageUrl = new URL(finalImage, window.location.origin).href;
    
    const message = `*NEW ORDER - GLOBAL GRAB* 🛍️\n\n*Product:* ${finalTitle}\n*Size:* ${selectedSize}\n*Price:* ${finalPrice}\n\n*Delivery Details:*\n*Name:* ${name}\n*Phone:* +91 ${phone}\n*Email:* ${email}\n*Address:* ${address}\n*City:* ${city}\n*State:* ${state}\n*PIN Code:* ${pincode}\n\nIs this available?\n\n${absoluteImageUrl}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '919317091542';
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
});

