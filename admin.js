import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, onSnapshot, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

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
const auth = getAuth(app);

// Authentication Logic
const loginContainer = document.getElementById('loginContainer');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        loginContainer.style.display = 'none';
        adminDashboard.style.display = 'block';
        logoutBtn.style.display = 'block';
    } else {
        // User is logged out
        loginContainer.style.display = 'block';
        adminDashboard.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
});

// Handle Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Logged in successfully
            loginForm.reset();
        })
        .catch((error) => {
            alert("Login Failed: " + error.message);
        });
});

// Handle Logout
logoutBtn.addEventListener('click', () => {
    signOut(auth).catch((error) => {
        console.error("Logout Error", error);
    });
});

const initialProducts = [
    {
        id: 1,
        title: "Courage Graphic Oversized T-Shirt",
        price: "₹799",
        category: "tshirts",
        image: "assets/courage_black.png",
        description: "Premium oversized 'Courage' graphic tee. High quality print and relaxed drop-shoulder fit.",
        colors: [
            { name: "Black", image: "assets/courage_black.png", price: "₹799", inStock: true },
            { name: "Blue", image: "assets/courage_blue.png", price: "₹799", inStock: true },
            { name: "Brown", image: "assets/courage_brown.png", price: "₹799", inStock: true },
            { name: "Grey", image: "assets/courage_grey.png", price: "₹799", inStock: true }
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
            { name: "Black", image: "assets/dream_black.png", price: "₹799", inStock: true },
            { name: "Blue", image: "assets/dream_blue.png", price: "₹799", inStock: true },
            { name: "Brown", image: "assets/dream_brown.png", price: "₹799", inStock: true },
            { name: "Grey", image: "assets/dream_grey.png", price: "₹799", inStock: true }
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
            { name: "Black", image: "assets/rebels black.png", price: "₹799", inStock: true },
            { name: "Blue", image: "assets/rebels blue.png", price: "₹799", inStock: true },
            { name: "Red", image: "assets/rebels red.png", price: "₹799", inStock: true }
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
        item.style.flexDirection = 'column';
        item.style.alignItems = 'stretch';
        
        const inStock = product.inStock !== false; // Default true
        
        let colorsHTML = '';
        if (product.colors && product.colors.length > 0) {
            colorsHTML = '<div style="margin-top: 15px; border-top: 1px solid #333; padding-top: 15px;"><h4>Colors:</h4>';
            product.colors.forEach((color, idx) => {
                const colorInStock = color.inStock !== false;
                colorsHTML += `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 10px; background: #23252e; border-radius: 5px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="${color.image}" style="width: 30px; height: 30px; border-radius: 5px; object-fit: cover;">
                            <span>${color.name}</span>
                        </div>
                        <button class="toggle-color-btn ${colorInStock ? 'in-stock' : 'out-stock'}" data-id="${product.id}" data-colorindex="${idx}" data-instock="${colorInStock}">
                            ${colorInStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                    </div>
                `;
            });
            colorsHTML += '</div>';
        }
        
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="product-info">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="product-details">
                        <h3>${product.title}</h3>
                        <p>${product.originalPrice ? `<s style="color:#aaa;">${product.originalPrice}</s> ` : ''}${product.price}</p>
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="toggle-btn ${inStock ? 'in-stock' : 'out-stock'}" data-id="${product.id}" data-instock="${inStock}">
                        ${inStock ? 'In Stock (All)' : 'Out of Stock (All)'}
                    </button>
                    <button class="edit-btn" data-id="${product.id}" style="padding: 10px 15px; border-radius: 5px; background: #2196F3; color: white; border: none; font-weight: bold; cursor: pointer;">Edit</button>
                    <button class="delete-btn" data-id="${product.id}" style="padding: 10px 15px; border-radius: 5px; background: #F44336; color: white; border: none; font-weight: bold; cursor: pointer;">Delete</button>
                </div>
            </div>
            ${colorsHTML}
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
            }
        });
    });

    document.querySelectorAll('.toggle-color-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            const colorIndex = parseInt(e.target.getAttribute('data-colorindex'));
            const currentlyInStock = e.target.getAttribute('data-instock') === 'true';
            
            e.target.disabled = true;
            e.target.textContent = "Updating...";
            
            try {
                // Find product locally
                const product = products.find(p => p.id.toString() === id);
                if (!product) throw new Error("Product not found locally");
                
                // Update the specific color
                const updatedColors = [...product.colors];
                updatedColors[colorIndex].inStock = !currentlyInStock;

                await updateDoc(doc(db, "products", id.toString()), {
                    colors: updatedColors
                });
            } catch (error) {
                console.error("Error updating color stock:", error);
                alert("Error updating color stock.");
                e.target.disabled = false;
            }
        });
    });

    // Edit Button Logic
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(p => p.id === id);
            
            if (product) {
                // Populate form
                document.getElementById('editProductId').value = product.id;
                document.getElementById('pTitle').value = product.title;
                document.getElementById('pOriginalPrice').value = product.originalPrice || '';
                document.getElementById('pPrice').value = product.price;
                document.getElementById('pCategory').value = product.category;
                document.getElementById('pDesc').value = product.description;
                
                // Clear existing color rows
                colorRows.innerHTML = '';
                
                // Add color rows
                if (product.colors && product.colors.length > 0) {
                    product.colors.forEach(c => {
                        const row = document.createElement('div');
                        row.className = 'color-row form-grid';
                        row.style.marginTop = '10px';
                        row.innerHTML = `
                            <div style="flex:1;">
                                <label style="font-size:0.8rem; color:#aaa;">Color Name</label>
                                <input type="text" class="cName" required value="${c.name}">
                            </div>
                            <div style="flex:1;">
                                <label style="font-size:0.8rem; color:#aaa;">Color Image</label>
                                <input type="file" class="cImage" accept="image/*">
                                <input type="hidden" class="cExistingImage" value="${c.image}">
                            </div>
                            <button type="button" class="remove-color-btn">X</button>
                        `;
                        
                        row.querySelector('.remove-color-btn').addEventListener('click', () => {
                            row.remove();
                        });
                        
                        colorRows.appendChild(row);
                    });
                }
                
                // Update UI
                document.getElementById('addProductSection').scrollIntoView({ behavior: 'smooth' });
                document.querySelector('#addProductSection h2').textContent = "Edit Product";
                document.getElementById('submitBtn').textContent = "Save Changes";
                
                // Note: Image fields are deliberately left blank. Users only pick if they want to override.
                window.currentEditProductImage = product.image;
            }
        });
    });

    // Delete Button Logic
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            const confirmDelete = confirm("Are you sure you want to delete this product? This action cannot be undone.");
            
            if (confirmDelete) {
                e.target.disabled = true;
                e.target.textContent = "Deleting...";
                try {
                    await deleteDoc(doc(db, "products", id.toString()));
                } catch (error) {
                    console.error("Error deleting product:", error);
                    alert("Failed to delete product.");
                    e.target.disabled = false;
                    e.target.textContent = "Delete";
                }
            }
        });
    });
}, (error) => {
    console.error("Firestore Error:", error);
    statusMessage.textContent = "Error connecting to Database. Have you clicked 'Create Database' in Firebase Console?";
});

// Dynamic Color Fields Logic
const colorRows = document.getElementById('colorRows');
const addColorBtn = document.getElementById('addColorBtn');

function createColorRow() {
    const row = document.createElement('div');
    row.className = 'color-row form-grid';
    row.style.marginTop = '10px';
    row.innerHTML = `
        <div style="flex:1;">
            <label style="font-size:0.8rem; color:#aaa;">Color Name</label>
            <input type="text" class="cName" required placeholder="e.g. Red">
        </div>
        <div style="flex:1;">
            <label style="font-size:0.8rem; color:#aaa;">Color Image</label>
            <input type="file" class="cImage" accept="image/*">
            <input type="hidden" class="cExistingImage" value="">
        </div>
        <button type="button" class="remove-color-btn">X</button>
    `;

    row.querySelector('.remove-color-btn').addEventListener('click', () => {
        row.remove();
    });

    return row;
}

if (addColorBtn) {
    addColorBtn.addEventListener('click', () => {
        colorRows.appendChild(createColorRow());
    });
}

// Helper function to upload image to ImgBB
async function uploadToImgBB(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    // The user's ImgBB API key
    const apiKey = 'd8d781f490f26e9220b1d1f189935d30';
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
    });
    
    const data = await response.json();
    if (data.success) {
        return data.data.url; // Returns the short, public ImgBB URL
    } else {
        throw new Error(data.error ? data.error.message : 'ImgBB Upload Failed');
    }
}

// Handle Form Submission
const addProductForm = document.getElementById('addProductForm');
const submitBtn = document.getElementById('submitBtn');

if (addProductForm) {
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        submitBtn.disabled = true;
        submitBtn.textContent = "Uploading Images & Saving...";
        
        try {
            const editId = document.getElementById('editProductId').value;
            const title = document.getElementById('pTitle').value;
            const originalPrice = document.getElementById('pOriginalPrice').value;
            const price = document.getElementById('pPrice').value;
            const category = document.getElementById('pCategory').value;
            const description = document.getElementById('pDesc').value;
            const baseImageFile = document.getElementById('pImage').files[0];
            
            // Generate a unique ID if new, or use editId
            const productId = editId ? parseInt(editId) : Date.now();
            
            // Upload Base Image (if new file is provided, use it, else keep old)
            let baseImageUrl = '';
            if (baseImageFile) {
                baseImageUrl = await uploadToImgBB(baseImageFile);
            } else if (editId && window.currentEditProductImage) {
                baseImageUrl = window.currentEditProductImage; // keep existing image
            } else {
                throw new Error("Base image is required for new products.");
            }
            
            // Process Colors
            const colors = [];
            const colorElements = document.querySelectorAll('.color-row');
            
            for (let i = 0; i < colorElements.length; i++) {
                const row = colorElements[i];
                const cName = row.querySelector('.cName').value;
                const cImageFile = row.querySelector('.cImage').files[0];
                const cExistingImage = row.querySelector('.cExistingImage').value;
                
                let cImageUrl = '';
                if (cImageFile) {
                    cImageUrl = await uploadToImgBB(cImageFile);
                } else if (cExistingImage) {
                    cImageUrl = cExistingImage; // keep existing
                } else {
                    throw new Error(`Image required for color ${cName}`);
                }
                
                colors.push({
                    name: cName,
                    image: cImageUrl,
                    originalPrice: originalPrice,
                    price: price, // defaults to same price
                    inStock: true
                });
            }
            
            // Create Product Object
            const newProduct = {
                id: productId,
                title: title,
                originalPrice: originalPrice,
                price: price,
                category: category,
                description: description,
                image: baseImageUrl,
                inStock: true,
                colors: colors
            };
            
            // Save to Firestore (setDoc overwrites perfectly for Edit, creates if new)
            await setDoc(doc(db, "products", productId.toString()), newProduct);
            
            alert(editId ? "Product Updated Successfully!" : "Product Added Successfully!");
            
            addProductForm.reset();
            document.getElementById('editProductId').value = '';
            document.querySelector('#addProductSection h2').textContent = "Add New Product";
            colorRows.innerHTML = ''; // clear colors
            window.currentEditProductImage = null;
            
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product. Error processing images or saving to database.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Add Product";
        }
    });
}
