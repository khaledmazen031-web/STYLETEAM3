document.addEventListener("DOMContentLoaded", function () {


const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const payBtn = document.getElementById("payBtn");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutName = document.getElementById("checkoutName");
const checkoutPhone = document.getElementById("checkoutPhone");
const checkoutError = document.getElementById("checkoutError");
const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");
let selectedPaymentMethod = null;

const categoriesContainer = document.getElementById("categories") || document.getElementById("categoriesContainer");
const categories = document.querySelectorAll(".category-card");

const categoryOverlay = document.getElementById("categoryOverlay");
const closeCategoryBtn = document.getElementById("closeCategory");
const categoryTitle = document.getElementById("categoryTitle");
const categoryProductsContainer = document.getElementById("categoryProductsContainer");



if (!cartButton || !cartOverlay || !closeCart || !cartItems || !cartCount || !cartTotal || !payBtn) {
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
        { name: "Classic Black T-Shirt", price: "350 EGP", img: "https://i.postimg.cc/KYzBVP7d/IMG-20260909-142026.png", colors: [{ name: "Black", hex: "#000000" }] },
        { name: "White Oversized Tee", price: "400 EGP", img: "https://i.postimg.cc/KYzBVP7d/IMG-20260909-142026.png", colors: [{ name: "White", hex: "#ffffff" }] }
    ],
    shoes: [
        { name: "VORIX Runner Sneakers", price: "1200 EGP", img: "https://i.postimg.cc/CK1ktGC9/IMG-20260909-142057.png", colors: [{ name: "Black", hex: "#000000" }, { name: "White", hex: "#ffffff" }] }
    ],
    pants: [
        { name: "Cargo Street Pants", price: "750 EGP", img: "https://i.postimg.cc/fbLmFc7G/IMG-20260909-142108.png", colors: [{ name: "Black", hex: "#000000" }] }
    ],
    hoodies: [
        { name: "Heavyweight Black Hoodie", price: "950 EGP", img: "https://i.postimg.cc/7L60c31d/IMG-20260909-142044.png", colors: [{ name: "Black", hex: "#000000" }] }
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
                img: p.image,
                colors: Array.isArray(p.colors) ? p.colors : []
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
                categoryProductsContainer.innerHTML = `<div class="product-grid">` + products.map(function(item, index) {
                    const colors = Array.isArray(item.colors) ? item.colors : [];
                    const swatchesHTML = colors.length > 0 ? `
                        <div class="color-swatches" data-product-index="${index}">
                            ${colors.map(function (c, cIndex) {
                                return `<span class="color-swatch ${cIndex === 0 ? 'selected' : ''}" style="background:${c.hex}" data-color-name="${escapeHTML(c.name)}" data-color-hex="${c.hex}" title="${escapeHTML(c.name)}"></span>`;
                            }).join("")}
                        </div>
                    ` : "";

                    return `
                        <div class="product-card-big" data-product-index="${index}">
                            <div class="product-card-img">
                                <img src="${item.img}" alt="${escapeHTML(item.name)}">
                            </div>
                            <h4 class="product-card-name">${escapeHTML(item.name)}</h4>
                            <p class="product-card-price">${item.price}</p>
                            ${swatchesHTML}
                            <select class="size-select">
                                <option value="S">S</option>
                                <option value="M" selected>M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                            </select>
                            <button type="button" class="product-card-add" onclick="window.addToCartFromCategory('${escapeHTML(item.name)}', '${item.price}', '${item.img}', this)">Add 🛒</button>
                        </div>
                    `;
                }).join("") + `</div>`;

                // color swatch selection
                categoryProductsContainer.querySelectorAll(".color-swatches").forEach(function (group) {
                    group.querySelectorAll(".color-swatch").forEach(function (dot) {
                        dot.addEventListener("click", function () {
                            group.querySelectorAll(".color-swatch").forEach(function (d) { d.classList.remove("selected"); });
                            dot.classList.add("selected");
                        });
                    });
                });
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
    const productItemContainer = buttonElement.closest(".product-card-big");
    const sizeSelect = productItemContainer ? productItemContainer.querySelector(".size-select") : null;
    const selectedSize = sizeSelect ? sizeSelect.value : "M";

    const selectedSwatch = productItemContainer ? productItemContainer.querySelector(".color-swatch.selected") : null;
    const selectedColor = selectedSwatch ? selectedSwatch.getAttribute("data-color-name") : null;

    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
    const cartItemId = `${name}-${selectedSize}-${selectedColor || "default"}`;

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
            color: selectedColor,
            price: numericPrice,
            rawPrice: price,
            img: img,
            quantity: 1
        });
    }

    updateCart();
    alert(`Added ${name}${selectedColor ? " (" + selectedColor + ")" : ""} (Size: ${selectedSize}) to cart! 🛒`);
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
                    <p style="color: #666; font-size: 11px; margin-bottom: 4px;">Size: <b>${product.size || 'M'}</b>${product.color ? ` | Color: <b>${escapeHTML(product.color)}</b>` : ''} | ${price.toLocaleString()} EGP</p>
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
        if (checkoutOverlay) checkoutOverlay.classList.remove("active");
    }
});



async function logOrderToSupabase(items, total, paymentMethod, customerName, customerPhone) {
    if (typeof supabaseClient === "undefined" || !supabaseClient) return null;
    try {
        const { data, error } = await supabaseClient.from("orders").insert({
            items: items,
            total: total,
            payment_method: paymentMethod,
            status: "pending",
            customer_name: customerName,
            customer_phone: customerPhone
        }).select().single();
        if (error) throw error;
        return data;
    } catch (e) {
        console.error("STYLE TEAM: Could not log order.", e);
        return null;
    }
}

function openCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    checkoutOverlay.classList.add("active");
}

function closeCheckoutWindow() {
    checkoutOverlay.classList.remove("active");
}

payBtn.addEventListener("click", function (event) {
    event.preventDefault();
    openCheckout();
});

if (closeCheckout) {
    closeCheckout.addEventListener("click", function () {
        closeCheckoutWindow();
    });
}

checkoutOverlay.addEventListener("click", function (event) {
    if (event.target === checkoutOverlay) closeCheckoutWindow();
});

document.querySelectorAll(".payment-method-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
        document.querySelectorAll(".payment-method-btn").forEach(function (b) { b.classList.remove("selected"); });
        btn.classList.add("selected");
        selectedPaymentMethod = btn.dataset.method;
        confirmPaymentBtn.disabled = false;
    });
});

checkoutForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    checkoutError.textContent = "";

    if (!selectedPaymentMethod) {
        checkoutError.textContent = "اختر طريقة الدفع.";
        return;
    }

    const name = checkoutName.value.trim();
    const phone = checkoutPhone.value.trim();
    if (!name || !phone) {
        checkoutError.textContent = "اكتب الاسم ورقم الموبايل.";
        return;
    }

    let total = 0;
    const orderItems = [];
    cart.forEach(function (product) {
        const price = Number(product.price);
        const quantity = Number(product.quantity);
        total += price * quantity;
        orderItems.push({
            name: product.name,
            size: product.size || "M",
            color: product.color || null,
            price: price,
            quantity: quantity,
            img: product.img || ""
        });
    });

    confirmPaymentBtn.disabled = true;
    confirmPaymentBtn.textContent = "جاري التحويل...";

    const order = await logOrderToSupabase(orderItems, total, selectedPaymentMethod, name, phone);

    try {
        const response = await fetch("/api/create-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: total,
                method: selectedPaymentMethod,
                name: name,
                phone: phone,
                orderId: order ? order.id : null
            })
        });

        const result = await response.json();

        if (!response.ok || !result.redirectUrl) {
            throw new Error(result.error || "Payment initialization failed");
        }

        window.location.href = result.redirectUrl;
    } catch (e) {
        console.error("STYLE TEAM: Payment initialization failed.", e);
        checkoutError.textContent = "حصل خطأ أثناء بدء الدفع. حاول تاني.";
        confirmPaymentBtn.disabled = false;
        confirmPaymentBtn.textContent = "تأكيد الدفع";
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
