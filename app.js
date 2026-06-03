const products = [
    {
        id: 1,
        title: "Courage Graphic Oversized T-Shirt",
        price: "₹799",
        category: "tshirts",
        image: "assets/courage_black.png",
        description: "Premium oversized 'Courage' graphic tee. High quality print and relaxed drop-shoulder fit.",
        colors: [
            { name: "Black", image: "assets/courage_black.png", price: "₹799" },
            { name: "Blue", image: "assets/courage_blue.png", price: "₹799" },
            { name: "Brown", image: "assets/courage_brown.png", price: "₹799" },
            { name: "Grey", image: "assets/courage_grey.png", price: "₹799" }
        ]
    },
    {
        id: 2,
        title: "Dream Graphic Oversized T-Shirt",
        price: "₹799",
        category: "tshirts",
        image: "assets/dream_black.png",
        description: "Premium oversized 'Dream' graphic tee. High quality print and relaxed drop-shoulder fit.",
        colors: [
            { name: "Black", image: "assets/dream_black.png", price: "₹799" },
            { name: "Blue", image: "assets/dream_blue.png", price: "₹799" },
            { name: "Brown", image: "assets/dream_brown.png", price: "₹799" },
            { name: "Grey", image: "assets/dream_grey.png", price: "₹799" }
        ]
    },
    {
        id: 3,
        title: "Rebels Graphic Oversized T-Shirt",
        price: "₹799",
        category: "tshirts",
        image: "assets/rebels black.png",
        description: "Premium oversized 'Rebels' graphic tee. Bold streetwear statement.",
        colors: [
            { name: "Black", image: "assets/rebels black.png", price: "₹799" },
            { name: "Blue", image: "assets/rebels blue.png", price: "₹799" },
            { name: "Red", image: "assets/rebels red.png", price: "₹799" }
        ]
    },
    {
        id: 4,
        title: "Classic Blue Baggy Jeans",
        price: "₹1,299",
        category: "jeans",
        image: "assets/baggy_jeans_blue.jpeg",
        description: "Premium streetwear baggy jeans with an ultra-relaxed fit."
    },
    {
        id: 5,
        title: "Printed Baggy Jeans",
        price: "₹1,499",
        category: "jeans",
        image: "assets/baggy_jeans_printed.jpeg",
        description: "Unique printed streetwear baggy jeans."
    },
    {
        id: 6,
        title: "Dark Wash Baggy Denim",
        price: "₹1,299",
        category: "jeans",
        image: "assets/bagy.png",
        description: "Dark wash relaxed fit denim."
    },
    {
        id: 7,
        title: "Faded Relaxed Jeans",
        price: "₹1,299",
        category: "jeans",
        image: "assets/bagy1.png",
        description: "Lightly faded streetwear jeans."
    },
    {
        id: 8,
        title: "Vintage Wash Denim 1",
        price: "₹1,199",
        category: "jeans",
        image: "assets/jean1.jpeg",
        description: "Classic vintage wash relaxed denim."
    },
    {
        id: 9,
        title: "Vintage Wash Denim 3",
        price: "₹1,199",
        category: "jeans",
        image: "assets/jean3.jpeg",
        description: "Timeless vintage style denim."
    },
    {
        id: 10,
        title: "Vintage Wash Denim 5",
        price: "₹1,199",
        category: "jeans",
        image: "assets/jean5..jpeg",
        description: "Premium faded vintage denim."
    }
];

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
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">${product.price}</p>
            </div>
        `;
        
        card.addEventListener('click', () => openModal(product));
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
        
        // Select the first color by default
        selectedColor = product.colors[0];
        modalImage.src = selectedColor.image;
        modalPrice.textContent = selectedColor.price;
        
        product.colors.forEach((color, index) => {
            const btn = document.createElement('button');
            btn.className = 'color-btn';
            btn.textContent = color.name;
            if (index === 0) btn.classList.add('selected');
            
            btn.addEventListener('click', () => {
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
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
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
    closeModal();
    
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
    checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
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
    
    const message = `*NEW ORDER - GLOBAL GRAB* 🛍️\n\n*Product:* ${finalTitle}\n*Size:* ${selectedSize}\n*Price:* ${finalPrice}\n*Image:* ${absoluteImageUrl}\n\n*Delivery Details:*\n*Name:* ${name}\n*Phone:* +91 ${phone}\n*Email:* ${email}\n*Address:* ${address}\n*City:* ${city}\n*State:* ${state}\n*PIN Code:* ${pincode}\n\nIs this available?`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '919317091542';
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
});

// Init
renderProducts();
