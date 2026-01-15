// ===============================
// Telegram Mini App setup
// ===============================
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// ===============================
// Demo cart (for now)
// ===============================
let cart = [];

// ===============================
// Show Telegram user name
// ===============================
const user = tg.initDataUnsafe?.user;

if (user) {
    document.getElementById("welcome").innerText =
        `👋 Hi ${user.first_name}, Mini Shop`;
}

// ===============================
// Fetch demo products (static / demo)
// ===============================
const demoProducts = [
    { id: 1, name: "Nike Air Max", price: 120, image: "https://via.placeholder.com/300x200?text=Nike+Air+Max" },
    { id: 2, name: "Apple Watch Series 9", price: 399, image: "https://via.placeholder.com/300x200?text=Apple+Watch+S9" },
    { id: 3, name: "Adidas Cap", price: 25, image: "https://via.placeholder.com/300x200?text=Adidas+Cap" }
];

renderProducts(demoProducts);

// ===============================
// Render products
// ===============================
function renderProducts(products) {
    const container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}">
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price}</div>
            <button class="add-btn">Add to Cart</button>
        `;

        card.querySelector(".add-btn").addEventListener("click", () => {
            addToCart(product);
        });

        container.appendChild(card);
    });
}

// ===============================
// Add to cart
// ===============================
function addToCart(product) {
    const existing = cart.find(p => p.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    tg.showAlert("🛒 Added to cart");
}

// ===============================
// Calculate total
// ===============================
function calculateTotal() {
    return cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);
}

// ===============================
// Send order to n8n webhook
// ===============================
function sendOrderToWebhook() {
    if (cart.length === 0) {
        tg.showAlert("Cart is empty");
        return;
    }

    const order = {
        user_id: user?.id || 0,
        user_name: user?.first_name || "Guest",
        products: cart,
        total: calculateTotal()
    };

    fetch("https://oluwatobii100.app.n8n.cloud/webhook-test/mini-shop-order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
    })
    .then(res => res.json())
    .then(() => {
        tg.showAlert("✅ Order sent successfully!");
        cart = []; // clear cart
    })
    .catch(err => {
        console.error(err);
        tg.showAlert("❌ Failed to send order");
    });
}

// ===============================
// Telegram Main Button = Checkout
// ===============================
tg.MainButton.setText("Checkout");
tg.MainButton.show();

tg.MainButton.onClick(() => {
    sendOrderToWebhook();
});
