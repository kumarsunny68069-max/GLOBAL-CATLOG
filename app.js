const products = [
    {
        id: 1,
        title: "Oversized Heavyweight T-Shirt - Obsidian",
        price: "$45.00",
        category: "tshirts",
        image: "assets/tshirt_black.png",
        description: "Crafted from 100% premium heavy cotton. Features a relaxed drop-shoulder fit for the ultimate streetwear silhouette."
    },
    {
        id: 2,
        title: "Oversized Heavyweight T-Shirt - Ghost",
        price: "$45.00",
        category: "tshirts",
        image: "assets/tshirt_white.png",
        description: "The essential white oversized tee. Thick, durable fabric that drapes perfectly."
    },
    {
        id: 3,
        title: "Relaxed Baggy Denim - Vintage Blue",
        price: "$85.00",
        category: "jeans",
        image: "assets/jeans_blue.png",
        description: "Classic 90s inspired baggy jeans with a slight taper at the bottom. Washed for a perfect vintage feel."
    },
    {
        id: 4,
        title: "Relaxed Baggy Denim - Midnight",
        price: "$85.00",
        category: "jeans",
        image: "assets/jeans_black.png",
        description: "Deep black relaxed denim. Engineered for comfort and style with a wide leg profile."
    },
    {
        id: 5,
        title: "Oversized Heavyweight T-Shirt - Ash",
        price: "$45.00",
        category: "tshirts",
        image: "assets/tshirt_grey.png",
        description: "A perfect neutral ash grey tee. Minimalist and versatile."
    },
    {
        id: 6,
        title: "Graphic Oversized T-Shirt - Golden Echo",
        price: "$55.00",
        category: "tshirts",
        image: "assets/tshirt_graphic.png",
        description: "Black oversized tee featuring a subtle, abstract golden graphic on the back. Premium print."
    },
    {
        id: 7,
        title: "Relaxed Baggy Denim - Vintage Grey",
        price: "$85.00",
        category: "jeans",
        image: "assets/jeans_grey.png",
        description: "Stonewashed vintage grey denim. The ultimate relaxed fit for everyday wear."
    },
    {
        id: 8,
        title: "Baggy Cargo Pants - Olive",
        price: "$95.00",
        category: "jeans",
        image: "assets/jeans_cargo.png",
        description: "Functional streetwear. Olive green baggy cargo pants with premium utility pockets."
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

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
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

// Modal Logic
function openModal(product) {
    modalImage.src = product.image;
    modalTitle.textContent = product.title;
    modalPrice.textContent = product.price;
    modalDesc.textContent = product.description;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Size Selection Logic
const sizeBtns = document.querySelectorAll('.size-btn');
sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sizeBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    });
});

// Init
renderProducts();
