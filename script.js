document.addEventListener("DOMContentLoaded", function () {


const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const whatsappBtn = document.getElementById("whatsappBtn");

const categoriesContainer = document.getElementById("categories") || document.getElementById("categoriesContainer");
const categories = document.querySelectorAll(".category-card");

const categoryOverlay = document.getElementById("categoryOverlay");
const closeCategoryBtn = document.getElementById("closeCategory");
const categoryTitle = document.getElementById("categoryTitle");
const categoryProductsContainer = document.getElementById("categoryProductsContainer");



if (!cartButton || !cartOverlay || !closeCart || !cartItems || !cartCount || !cartTotal || !whatsappBtn) {
    console.error("STYLE TEAM: Some essential cart HTML elements are missing.");
    return;
}



let cart = [];

try {
    const savedCart = localStorage.getItem("styleTeamCart");
    if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
            cart = parsedCart;
        }
    }
} catch (error) {
    console.error("STYLE TEAM: Error loading cart.", error);
    cart = [];
}

function saveCart() {
    try {
        localStorage.setItem("styleTeamCart", JSON.stringify(cart));
    } catch (error) {
        console.error("STYLE TEAM: Error saving cart.", error);
    }
}



const bgMusic = document.getElementById("bgMusic");
function playMusic() {
    if (bgMusic && typeof bgMusic.play === "function") {
        bgMusic.play().catch(function(error) {
            console.log("Music auto-play prevented:", error);
        });
    }
}
document.addEventListener("touchstart", playMusic, { once: true });
document.addEventListener("click", playMusic, { once: true });



let categoryData = {
    tshirts: [
        { name: "Classic Black T-Shirt", price: "350 EGP", img: "https://i.postimg.cc/KYzBVP7d/IMG-20260909-142026.png" },
        { name: "White Oversized Tee", price: "400 EGP", img: "https://i.postimg.cc/KYzBVP7d/IMG-20260909-142026.png" }
    ],
    shoes: [
        { name: "VORIX Runner Sneakers", price: "1200 EGP", img: "https://i.postimg.cc/CK1ktGC9/IMG-20260909-142057.png" }
    ],
    pants: [
        { name: "Cargo Street Pants", price: "750 EGP", img: "https://i.postimg.cc/fbLmFc7G/IMG-20260909-142108.png" }
    ],
    hoodies: [
        { name: "Heavyweight Black Hoodie", price: "950 EGP", img: "https://i.postimg.cc/7L60c31d/IMG-20260909-142044.png" }
    ]
};

// Pull live products from Supabase (admin-managed). Falls back to the
// hardcoded list above if Supabase isn't configured yet or the fetch fails.
async function loadProductsFromSupabase() {
    if (typeof supabaseClient === "undefined" || !supabaseClient) return;
    try {
        const { data, error } = await supabaseClient
            .from("products")
            .select("*")
            .eq("is_active", true);
        if (error || !data || data.length === 0) return;

        const grouped = {};
        data.forEach(function (p) {
            if (!grouped[p.category]) grouped[p.category] = [];
            grouped[p.category].push({
                name: p.name,
                price: Number(p.price).toLocaleString() + " EGP",
                img: p.image
            });
        });
        categoryData = grouped;
    } catch (e) {
        console.error("STYLE TEAM: Could not load products from Supabase.", e);
    }
}

// Visitor tracking: one row per browser session
async function trackVisit() {
    if (typeof supabaseClient === "undefined" || !supabaseClient) return;
    try {
        if (sessionStorage.getItem("styleTeamVisitLogged")) return;

        let visitorId = localStorage.getItem("styleTeamVisitorId");
        if (!visitorId) {
            visitorId = "v-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
            localStorage.setItem("styleTeamVisitorId", visitorId);
        }

        await supabaseClient.from("page_views").insert({
            visitor_id: visitorId,
            page: window.location.pathname
        });
        sessionStorage.setItem("styleTeamVisitLogged", "1");
    } catch (e) {
        console.error("STYLE TEAM: Could not log visit.", e);
    }
}
trackVisit();
loadProductsFromSupabase();

categories.forEach(function (card) {
    card.addEventListener("click", function () {
        const catKey = card.getAttribute("data-category");
        const products = categoryData[catKey] || [];
        
        const titleEl = card.querySelector("h3");
        if (categoryTitle && titleEl) {
            categoryTitle.innerText = titleEl.innerText;
        }

        if (categoryProductsContainer) {
            if (products.length > 0) {
                categoryProductsContainer.innerHTML = products.map(function(item) {
                    return `
                        <div class="category-product-item" style="display: flex; gap: 12px; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 12px; justify-content: space-between;">
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <img src="${item.img}" alt="${escapeHTML(item.name)}" style="width: 55px; height: 55px; object-fit: cover; border-radius: 8px;">
                                <div>
                                    <h4 style="font-size: 13px; margin-bottom: 2px; color: #333;">${escapeHTML(item.name)}</h4>
                                    <p style="color: #666; font-size: 12px; font-weight: bold; margin-bottom: 4px;">${item.price}</p>
                                    <select class="size-select" style="padding: 3px 6px; font-size: 11px; border-radius: 4px; border: 1px solid #ccc;">
                                        <option value="S">S</option>
                                        <option value="M" selected>M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                        <option value="XXL">XXL</option>
                                    </select>
                                </div>
                            </div>
                            <button type="button" onclick="window.addToCartFromCategory('${escapeHTML(item.name)}', '${item.price}', '${item.img}', this)" style="background: #000; color: #fff; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold;">Add 🛒</button>
                        </div>
                    `;
                }).join("");
            } else {
                categoryProductsContainer.innerHTML = `<p class="empty-cart">No products available in this category.</p>`;
            }
        }

        if (categoryOverlay) {
            categoryOverlay.classList.add("active");
        }
    });
});

if (closeCategoryBtn && categoryOverlay) {
    closeCategoryBtn.addEventListener("click", function () {
        categoryOverlay.classList.remove("active");
    });

    categoryOverlay.addEventListener("click", function (e) {
        if (e.target === categoryOverlay) {
            categoryOverlay.classList.remove("active");
        }
    });
}


window.addToCartFromCategory = function(name, price, img, buttonElement) {
    const productItemContainer = buttonElement.closest(".category-product-item");
    const sizeSelect = productItemContainer ? productItemContainer.querySelector(".size-select") : null;
    const selectedSize = sizeSelect ? sizeSelect.value : "M";

    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
    const cartItemId = `${name}-${selectedSize}`;

    const existingItem = cart.find(function(item) {
        return item.id === cartItemId;
    });

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: cartItemId,
            name: name,
            size: selectedSize,
            price: numericPrice,
            rawPrice: price,
            img: img,
            quantity: 1
        });
    }

    updateCart();
    alert(`Added ${name} (Size: ${selectedSize}) to cart! 🛒`);
};

window.increaseQuantity = function(id) {
    const item = cart.find(function(i) { return i.id === id; });
    if (item) {
        item.quantity += 1;
        updateCart();
    }
};

window.decreaseQuantity = function(id) {
    const item = cart.find(function(i) { return i.id === id; });
    if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            cart = cart.filter(function(i) { return i.id !== id; });
        }
        updateCart();
    }
};

window.removeItem = function(id) {
    cart = cart.filter(function(i) { return i.id !== id; });
    updateCart();
};

function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;

    // Filter invalid entries
    cart = cart.filter(function (product) {
        return (
            product &&
            product.name &&
            Number(product.price) > 0 &&
            Number(product.quantity) > 0
        );
    });

    if (cart.length === 0) {
        cartItems.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
        cartCount.textContent = "0";
        cartTotal.textContent = "0 EGP";
        saveCart();
        return;
    }

    cart.forEach(function (product) {
        const price = Number(product.price);
        const quantity = Number(product.quantity);
        const productTotal = price * quantity;
        const itemId = product.id || `${product.name}-${product.size || 'M'}`;

        total += productTotal;
        count += quantity;

        const item = document.createElement("div");
        item.className = "cart-item";
        item.style.cssText = "display: flex; gap: 12px; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 12px; justify-content: space-between;";
        
        item.innerHTML = `
            <div style="display: flex; gap: 10px; align-items: center;">
                ${product.img ? `<img src="${product.img}" alt="${escapeHTML(product.name)}" style="width: 55px; height: 55px; object-fit: cover; border-radius: 8px;">` : ''}
                <div>
                    <h4 style="font-size: 13px; margin-bottom: 2px; color: #333;">${escapeHTML(product.name)}</h4>
                    <p style="color: #666; font-size: 11px; margin-bottom: 4px;">Size: <b>${product.size || 'M'}</b> | ${price.toLocaleString()} EGP</p>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button type="button" onclick="window.decreaseQuantity('${itemId}')" style="background: #eee; border: none; width: 22px; height: 22px; border-radius: 4px; cursor: pointer; font-weight: bold;">-</button>
                        <span style="font-size: 13px; font-weight: bold;">${quantity}</span>
                        <button type="button" onclick="window.increaseQuantity('${itemId}')" style="background: #eee; border: none; width: 22px; height: 22px; border-radius: 4px; cursor: pointer; font-weight: bold;">+</button>
                    </div>
                </div>
            </div>
            <button type="button" onclick="window.removeItem('${itemId}')" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 18px; padding: 5px;">×</button>
        `;

        cartItems.appendChild(item);
    });

    cartCount.textContent = count;
    cartTotal.textContent = total.toLocaleString() + " EGP";

    saveCart();
}



function openCart() {
    cartOverlay.classList.add("active");
    document.body.classList.add("cart-open");
}

function closeCartWindow() {
    cartOverlay.classList.remove("active");
    document.body.classList.remove("cart-open");
}

cartButton.addEventListener("click", function (event) {
    event.preventDefault();
    openCart();
});

closeCart.addEventListener("click", function (event) {
    event.preventDefault();
    closeCartWindow();
});

cartOverlay.addEventListener("click", function (event) {
    if (event.target === cartOverlay) {
        closeCartWindow();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeCartWindow();
        if (categoryOverlay) categoryOverlay.classList.remove("active");
    }
});



async function logOrderToSupabase(items, total) {
    if (typeof supabaseClient === "undefined" || !supabaseClient) return;
    try {
        await supabaseClient.from("orders").insert({
            items: items,
            total: total,
            payment_method: "whatsapp",
            status: "pending"
        });
    } catch (e) {
        console.error("STYLE TEAM: Could not log order.", e);
    }
}

whatsappBtn.addEventListener("click", function (event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const phoneNumber = "201007341483"; 
    let message = "Hello STYLE TEAM 👋\n\nI want to order:\n";

    let total = 0;
    const orderItems = [];

    cart.forEach(function (product) {
        const price = Number(product.price);
        const quantity = Number(product.quantity);
        const productTotal = price * quantity;
        total += productTotal;

        orderItems.push({
            name: product.name,
            size: product.size || "M",
            price: price,
            quantity: quantity,
            img: product.img || ""
        });

        message += `- ${product.name} (Size: ${product.size || 'M'}) x${quantity} = ${productTotal.toLocaleString()} EGP\n`;
    });

    message += `\n--------------------\nTotal: ${total.toLocaleString()} EGP`;

    logOrderToSupabase(orderItems, total);

    const whatsappURL = "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(message);

    const newWindow = window.open(whatsappURL, "_blank");

    if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
        window.location.href = whatsappURL;
    }
});


function escapeHTML(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}



updateCart();

});
