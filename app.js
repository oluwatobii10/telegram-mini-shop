// Telegram Mini App setup
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Show Telegram user name if available
const user = tg.initDataUnsafe?.user;
if (user) {
    document.getElementById("welcome").innerText =
        `👋 Hi ${user.first_name}, Mini Shop`;
}

// --- 20 Demo Products ---
const demoProducts = [
  { id: 1, name: "Nike Air Max", price: 120, image: "https://via.placeholder.com/300x200?text=Nike+Air+Max" },
  { id: 2, name: "Apple Watch Series 9", price: 399, image: "https://via.placeholder.com/300x200?text=Apple+Watch+S9" },
  { id: 3, name: "Adidas Originals Cap", price: 24, image: "https://via.placeholder.com/300x200?text=Adidas+Originals+Cap" },
  { id: 4, name: "Puma RS Sneakers", price: 110, image: "https://via.placeholder.com/300x200?text=Puma+RS+Sneakers" },
  { id: 5, name: "Rolex Wristwatch", price: 999, image: "https://via.placeholder.com/300x200?text=Rolex+Wristwatch" },
  { id: 6, name: "Nike Jordan Cap", price: 28, image: "https://via.placeholder.com/300x200?text=Nike+Jordan+Cap" },
  { id: 7, name: "Adidas Ultraboost", price: 150, image: "https://via.placeholder.com/300x200?text=Adidas+Ultraboost" },
  { id: 8, name: "Casio Digital Watch", price: 55, image: "https://via.placeholder.com/300x200?text=Casio+Digital+Watch" },
  { id: 9, name: "Reebok Classic Sneaker", price: 95, image: "https://via.placeholder.com/300x200?text=Reebok+Classic+Sneaker" },
  { id: 10, name: "New Era Cap", price: 30, image: "https://via.placeholder.com/300x200?text=New+Era+Cap" },
  { id: 11, name: "Nike Air Force 1", price: 130, image: "https://via.placeholder.com/300x200?text=Nike+Air+Force+1" },
  { id: 12, name: "Samsung Galaxy Watch", price: 299, image: "https://via.placeholder.com/300x200?text=Samsung+Galaxy+Watch" },
  { id: 13, name: "Adidas NMD", price: 140, image: "https://via.placeholder.com/300x200?text=Adidas+NMD" },
  { id: 14, name: "Puma Snapback Cap", price: 25, image: "https://via.placeholder.com/300x200?text=Puma+Snapback+Cap" },
  { id: 15, name: "Timex Weekender", price: 75, image: "https://via.placeholder.com/300x200?text=Timex+Weekender" },
  { id: 16, name: "Converse All Star", price: 60, image: "https://via.placeholder.com/300x200?text=Converse+All+Star" },
  { id: 17, name: "Vans Old Skool", price: 70, image: "https://via.placeholder.com/300x200?text=Vans+Old+Skool" },
  { id: 18, name: "Under Armour Cap", price: 22, image: "https://via.placeholder.com/300x200?text=Under+Armour+Cap" },
  { id: 19, name: "Nike Jordan Sneakers", price: 160, image: "https://via.placeholder.com/300x200?text=Nike+Jordan+Sneakers" },
  { id: 20, name: "Apple Watch SE", price: 279, image: "https://via.placeholder.com/300x200?text=Apple+Watch+SE" }
];

// --- Cart ---
let cart = [];

// --- Render products ---
function renderProducts(products) {
    const container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <h4>${product.name}</h4>
            <div class="price">$${product.price}</div>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;

        container.appendChild(card);
    });
}

// --- Add product to cart ---
function addToCart(productId) {
    const product = demoProducts.find(p => p.id === productId);
    if (!product) return;

    // Check if product already in cart
    const item = cart.find(c => c.id === productId);
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    tg.showAlert(`${product.name} added to cart!`);
    console.log("Cart:", cart);
}

// --- Checkout (send to n8n) ---
function checkout() {
    if (!cart.length) {
        tg.showAlert("Your cart is empty!");
        return;
    }

    const order = {
        user_id: user?.id || 0,
        user_name: user?.first_name || "Guest",
        products: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };

    // Replace with your actual n8n Webhook URL
    const n8nWebhookUrl = "https://oluwatobii100.app.n8n.cloud/webhook/mini-shop-order";

    fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
    })
    .then(() => {
        tg.showAlert("✅ Order sent!");
        cart = []; // clear cart
    })
    .catch(() => {
        tg.showAlert("❌ Failed to send order");
    });
}

// --- Add Checkout button to Telegram main button ---
tg.MainButton.setText("Checkout");
tg.MainButton.show()

renderProducts(demoProducts);