import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

const initialProducts = [
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
        ],
        inStock: true
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
        ],
        inStock: true
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
        ],
        inStock: true
    },
    {
        id: 4,
        title: "Classic Blue Baggy Jeans",
        price: "₹1,299",
        category: "jeans",
        image: "assets/baggy_jeans_blue.jpeg",
        description: "Premium streetwear baggy jeans with an ultra-relaxed fit.",
        inStock: true
    },
    {
        id: 5,
        title: "Printed Baggy Jeans",
        price: "₹1,499",
        category: "jeans",
        image: "assets/baggy_jeans_printed.jpeg",
        description: "Unique printed streetwear baggy jeans.",
        inStock: true
    },
    {
        id: 6,
        title: "Dark Wash Baggy Denim",
        price: "₹1,299",
        category: "jeans",
        image: "assets/bagy.png",
        description: "Dark wash relaxed fit denim.",
        inStock: true
    },
    {
        id: 7,
        title: "Faded Relaxed Jeans",
        price: "₹1,299",
        category: "jeans",
        image: "assets/bagy1.png",
        description: "Lightly faded streetwear jeans.",
        inStock: true
    },
    {
        id: 8,
        title: "Vintage Wash Denim 1",
        price: "₹1,199",
        category: "jeans",
        image: "assets/jean1.jpeg",
        description: "Classic vintage wash relaxed denim.",
        inStock: true
    },
    {
        id: 9,
        title: "Vintage Wash Denim 3",
        price: "₹1,199",
        category: "jeans",
        image: "assets/jean3.jpeg",
        description: "Timeless vintage style denim.",
        inStock: true
    },
    {
        id: 10,
        title: "Vintage Wash Denim 5",
        price: "₹1,199",
        category: "jeans",
        image: "assets/jean5..jpeg",
        description: "Premium faded vintage denim.",
        inStock: true
    }
];

const adminGrid = document.getElementById('adminGrid');
const statusMessage = document.getElementById('statusMessage');
const initBtn = document.getElementById('initBtn');

// Initialize Database Function
initBtn.addEventListener('click', async () => {
    initBtn.disabled = true;
    initBtn.textContent = "Initializing...";
    try {
        for (const product of initialProducts) {
            const docRef = doc(db, "products", product.id.toString());
            await setDoc(docRef, product);
        }
        statusMessage.textContent = "Database Initialized Successfully!";
        initBtn.style.display = "none";
    } catch (error) {
        console.error("Error initializing:", error);
        statusMessage.textContent = "Error: Please make sure Firestore is created in Test Mode in Firebase Console.";
        initBtn.disabled = false;
        initBtn.textContent = "Retry Initialization";
    }
});

// Load products and listen for changes
onSnapshot(collection(db, "products"), (snapshot) => {
    if (snapshot.empty) {
        statusMessage.textContent = "Database is empty. Please initialize it.";
        initBtn.style.display = "block";
        adminGrid.innerHTML = "";
        return;
    }
    
    statusMessage.style.display = "none";
    initBtn.style.display = "none";
    adminGrid.innerHTML = "";
    
    const products = [];
    snapshot.forEach(doc => products.push(doc.data()));
    
    // Sort by ID
    products.sort((a, b) => a.id - b.id);
    
    products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'product-item';
        
        const inStock = product.inStock !== false; // Default true
        
        item.innerHTML = `
            <div class="product-info">
                <img src="${product.image}" alt="${product.title}">
                <div class="product-details">
                    <h3>${product.title}</h3>
                    <p>${product.price}</p>
                </div>
            </div>
            <button class="toggle-btn ${inStock ? 'in-stock' : 'out-stock'}" data-id="${product.id}" data-instock="${inStock}">
                ${inStock ? 'In Stock' : 'Out of Stock'}
            </button>
        `;
        adminGrid.appendChild(item);
    });
    
    // Add event listeners to toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            const currentlyInStock = e.target.getAttribute('data-instock') === 'true';
            
            e.target.disabled = true;
            e.target.textContent = "Updating...";
            
            try {
                await updateDoc(doc(db, "products", id.toString()), {
                    inStock: !currentlyInStock
                });
            } catch (error) {
                console.error("Error updating stock:", error);
                alert("Error updating stock. Ensure Firestore is in Test Mode.");
                e.target.disabled = false;
                e.target.textContent = currentlyInStock ? 'In Stock' : 'Out of Stock';
            }
        });
    });
}, (error) => {
    console.error("Firestore Error:", error);
    statusMessage.textContent = "Error connecting to Database. Have you clicked 'Create Database' in Firebase Console?";
});
