document.addEventListener("DOMContentLoaded", function () {

/* =========================
   ELEMENTS
========================= */

const cartButton =
    document.getElementById("cartButton");

const cartOverlay =
    document.getElementById("cartOverlay");

const closeCart =
    document.getElementById("closeCart");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const whatsappBtn =
    document.getElementById("whatsappBtn");

const categoriesContainer =
    document.getElementById("categories");

const categories =
    document.querySelectorAll(".category-card");

const categoryProducts =
    document.querySelectorAll(".category-products");

const backButtons =
    document.querySelectorAll(".back-btn");

const products =
    document.querySelectorAll(".product-card");


/* =========================
   CHECK ELEMENTS
========================= */

if (
    !cartButton ||
    !cartOverlay ||
    !closeCart ||
    !cartItems ||
    !cartCount ||
    !cartTotal ||
    !whatsappBtn
) {

    console.error(
        "STYLE TEAM: Some HTML elements are missing."
    );

    return;

}


/* =========================
   CART DATA
========================= */

let cart = [];


try {

    const savedCart =
        localStorage.getItem("styleTeamCart");

    if (savedCart) {

        const parsedCart =
            JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {

            cart = parsedCart;

        }

    }

} catch (error) {

    console.error(
        "STYLE TEAM: Error loading cart.",
        error
    );

    cart = [];

}


/* =========================
   SAVE CART
========================= */

function saveCart() {

    try {

        localStorage.setItem(
            "styleTeamCart",
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error(
            "STYLE TEAM: Error saving cart.",
            error
        );

    }

}


/* =========================
   CATEGORY SYSTEM
========================= */

function showCategory(categoryName) {

    // إخفاء قائمة الكروت الرئيسية تماماً
    if (categoriesContainer) {
        categoriesContainer.style.display = "none";
    }

    // إخفاء جميع أقسام المنتجات أولاً
    categoryProducts.forEach(function (section) {
        section.classList.remove("active");
    });

    // إظهار القسم المختار فقط
    const selectedSection =
        document.getElementById(categoryName);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }

}


function showCategories() {

    // إخفاء جميع أقسام المنتجات
    categoryProducts.forEach(function (section) {
        section.classList.remove("active");
    });

    // إظهار قائمة الكروت الرئيسية مرة أخرى
    if (categoriesContainer) {
        categoriesContainer.style.display = "";
    }

}


categories.forEach(function (category) {

    category.addEventListener(
        "click",
        function () {

            const categoryName =
                category.dataset.category;

            if (!categoryName) {

                return;

            }

            showCategory(
                categoryName
            );

            const shop =
                document.getElementById("shop");

            if (shop) {

                shop.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

});


backButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            showCategories();

            const shop =
                document.getElementById("shop");

            if (shop) {

                shop.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

});


/* =========================
   OPEN CART
========================= */

function openCart() {

    cartOverlay.classList.add("active");

    document.body.classList.add("cart-open");

}


/* =========================
   CLOSE CART
========================= */

function closeCartWindow() {

    cartOverlay.classList.remove("active");

    document.body.classList.remove("cart-open");

}


/* =========================
   ADD TO CART
========================= */

function addToCart(name, price) {

    if (!name) {

        return;

    }

    const numericPrice =
        Number(price);

    if (
        !Number.isFinite(numericPrice) ||
        numericPrice <= 0
    ) {

        return;

    }

    const existingProduct =
        cart.find(function (item) {

            return item.name === name;

        });

    if (existingProduct) {

        existingProduct.quantity =
            Number(existingProduct.quantity) + 1;

    } else {

        cart.push({

            name: name,

            price: numericPrice,

            quantity: 1

        });

    }

    saveCart();

    updateCart();

}


/* =========================
   PRODUCT CLICK
========================= */

products.forEach(function (product) {

    product.addEventListener(
        "click",
        function () {

            const name =
                product.dataset.name;

            const price =
                product.dataset.price;

            addToCart(
                name,
                price
            );

        }
    );

});


/* =========================
   UPDATE CART
========================= */

function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;

    let count = 0;


    /* CLEAN INVALID PRODUCTS */

    cart = cart.filter(function (product) {

        return (
            product &&
            product.name &&
            Number(product.price) > 0 &&
            Number(product.quantity) > 0
        );

    });


    /* EMPTY CART */

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

    }


    /* CART PRODUCTS */

    cart.forEach(function (product, index) {

        const price =
            Number(product.price);

        const quantity =
            Number(product.quantity);

        const productTotal =
            price * quantity;

        total += productTotal;

        count += quantity;

        const item =
            document.createElement("div");

        item.className =
            "cart-item";

        item.innerHTML = `

            <div class="cart-item-info">

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <p>
                    ${price.toLocaleString()}
                    EGP
                </p>

            </div>

            <div class="quantity-controls">

                <button
                    type="button"
                    data-action="increase"
                    data-index="${index}">
                    +
                </button>

                <span>
                    ${quantity}
                </span>

                <button
                    type="button"
                    data-action="decrease"
                    data-index="${index}">
                    −
                </button>

            </div>

            <div class="cart-item-total">

                ${productTotal.toLocaleString()}
                EGP

            </div>

            <button
                type="button"
                class="remove-item"
                data-action="remove"
                data-index="${index}">
            </button>

        `;

        cartItems.appendChild(item);

    });


    /* COUNT */

    cartCount.textContent =
        count;


    /* TOTAL */

    cartTotal.textContent =
        total.toLocaleString() +
        " EGP";


    saveCart();

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================
   CART ACTIONS
========================= */

cartItems.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest("button");

        if (!button) {

            return;

        }

        const action =
            button.dataset.action;

        const index =
            Number(button.dataset.index);

        if (
            !action ||
            !Number.isInteger(index) ||
            !cart[index]
        ) {

            return;

        }

        /* INCREASE */

        if (action === "increase") {

            cart[index].quantity =
                Number(
                    cart[index].quantity
                ) + 1;

        }

        /* DECREASE */

        if (action === "decrease") {

            cart[index].quantity =
                Number(
                    cart[index].quantity
                ) - 1;

            if (
                cart[index].quantity <= 0
            ) {

                cart.splice(
                    index,
                    1
                );

            }

        }

        /* REMOVE */

        if (action === "remove") {

            cart.splice(
                index,
                1
            );

        }

        saveCart();

        updateCart();

    }
);


/* =========================
   CART BUTTON
========================= */

cartButton.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        openCart();

    }
);


/* =========================
   CLOSE BUTTON
========================= */

closeCart.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        closeCartWindow();

    }
);


/* =========================
   CLOSE BY OVERLAY
========================= */

cartOverlay.addEventListener(
    "click",
    function (event) {

        if (
            event.target === cartOverlay
        ) {

            closeCartWindow();

        }

    }
);


/* =========================
   ESCAPE KEY
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeCartWindow();

        }

    }
);


/* =========================
   WHATSAPP
========================= */

whatsappBtn.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        if (cart.length === 0) {

            alert(
                "Your cart is empty!"
            );

            return;

        }

        const phoneNumber =
            "201007341483";

        let message =
            "Hello STYLE TEAM 👋\n\n";

        message +=
            "I want to order:\n\n";

        let total = 0;

        cart.forEach(function (product) {

            const price =
                Number(product.price);

            const quantity =
                Number(product.quantity);

            const productTotal =
                price * quantity;

            total += productTotal;

            message +=
                product.name +
                " x " +
                quantity +
                " = " +
                productTotal.toLocaleString() +
                " EGP\n";

        });

        message +=
            "\n--------------------\n";

        message +=
            "Total: " +
            total.toLocaleString() +
            " EGP";

        const whatsappURL =
            "https://wa.me/" +
            phoneNumber +
            "?text=" +
            encodeURIComponent(
                message
            );

        const newWindow =
            window.open(
                whatsappURL,
                "_blank"
            );

        if (
            !newWindow ||
            newWindow.closed ||
            typeof newWindow.closed === "undefined"
        ) {

            window.location.href =
                whatsappURL;

        }

    }
);


/* =========================
   INITIAL UPDATE
========================= */

updateCart();

});
// إظهار القسم المحدد وإخفاء كروت الأقسام الرئيسية
function showCategory(categoryId) {
    // إخفاء الأقسام الرئيسية
    document.getElementById('categoriesContainer').style.display = 'none';
    
    // إخفاء كل أقسام المنتجات أولاً احتياطياً
    const allProductsSections = document.querySelectorAll('.category-products');
    allProductsSections.forEach(section => {
        section.classList.remove('active');
    });

    // إظهار القسم المطلوب فقط
    const targetSection = document.getElementById(categoryId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// العودة للقائمة الرئيسية للأقسام
function hideCategories() {
    // إخفاء كل أقسام المنتجات
    const allProductsSections = document.querySelectorAll('.category-products');
    allProductsSections.forEach(section => {
        section.classList.remove('active');
    });

    // إظهار كروت الأقسام الرئيسية تاني
    document.getElementById('categoriesContainer').style.display = 'grid';
}
// تشغيل الموسيقى
const bgMusic = document.getElementById("bgMusic");

function playMusic() {
    bgMusic.py?.() || bgMusic.play().catch(function(error) {
        console.log("Music error:", error);
    });
}

document.addEventListener("touchstart", playMusic, { once: true });
document.addEventListener("click", playMusic, { once: true });

// --- إدارة سلة الشراء (Cart State) ---
let cart = [];

const cartButton = document.getElementById('cartButton');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const whatsappBtn = document.getElementById('whatsappBtn');

// فتح وإغلاق السلة الأساسية
cartButton.addEventListener('click', () => {
    cartOverlay.classList.add('active');
});

closeCartBtn.addEventListener('click', () => {
    cartOverlay.classList.remove('active');
});

cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) {
        cartOverlay.classList.remove('active');
    }
});

// دالة إضافة منتج للسلة
function addToCart(name, price, img) {
    // التأكد من تحويل السعر لرقم لحساب الإجمالي
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    
    // نشوف لو المنتج موجود قبل كده في السلة نزيد كميته أو نضيفه كعنصر جديد
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price: numericPrice, rawPrice: price, img, quantity: 1 });
    }
    
    updateCartUI();
    
    // إشعارات بصرية سريعة إن المنتج اتضاف (ممكن تفتح السلة أو تظهر تنبيه، هنحدث العداد هنا)
    alert(`Added ${name} to cart! 🛒`);
}

// تحديث واجهة السلة (العدد، العناصر، الإجمالي)
function updateCartUI() {
    // تحديث العداد
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalCount;

    // تحديث المحتوى جوه السلة
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
        cartTotal.innerText = `0 EGP`;
        return;
    }

    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item" style="display: flex; gap: 15px; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; justify-content: space-between;">
            <div style="display: flex; gap: 10px; align-items: center;">
                <img src="${item.img}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                <div>
                    <h4 style="font-size: 13px; margin-bottom: 3px; color: #333;">${item.name}</h4>
                    <p style="color: #666; font-size: 12px;">${item.rawPrice} × ${item.quantity}</p>
                </div>
            </div>
            <button onclick="removeFromCart(${index})" style="background: none; border: none; color: red; cursor: pointer; font-size: 16px;">×</button>
        </div>
    `).join('');

    // حساب الإجمالي الكلي
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.innerText = `${totalPrice} EGP`;
}

// حذف عنصر من السلة
window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
};

// ربط زر الواتساب لإرسال الطلب
whatsappBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    let message = "Hello VORIX, I want to order:\n";
    cart.forEach(item => {
        message += `- ${item.name} (${item.quantity}x) - ${item.rawPrice}\n`;
    });
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: ${totalPrice} EGP`;
    
    const whatsappUrl = `https://wa.me/201117704856?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});


// --- منطق قائمة الأقسام المنزلقة (Category Drawer) ---
const categoryOverlay = document.getElementById('categoryOverlay');
const closeCategoryBtn = document.getElementById('closeCategory');
const categoryTitle = document.getElementById('categoryTitle');
const categoryContainer = document.getElementById('categoryProductsContainer');

// بيانات المنتجات لكل قسم (ممكن تزود براحتك)
const categoryData = {
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

// فتح قائمة القسم عند الضغط عليه
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const catKey = card.getAttribute('data-category');
        const products = categoryData[catKey] || [];
        
        categoryTitle.innerText = card.querySelector('h3').innerText;
        
        if(products.length > 0) {
            categoryContainer.innerHTML = products.map((item, idx) => `
                <div class="category-product-item" style="display: flex; gap: 15px; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; justify-content: space-between;">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <img src="${item.img}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                        <div>
                            <h4 style="font-size: 14px; margin-bottom: 4px; color: #333;">${item.name}</h4>
                            <p style="color: #666; font-size: 13px; font-weight: bold;">${item.price}</p>
                        </div>
                    </div>
                    <button type="button" class="add-to-cart-action-btn" onclick="addToCart('${item.name}', '${item.price}', '${item.img}')" style="background: #000; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">Add 🛒</button>
                </div>
            `).join('');
        } else {
            categoryContainer.innerHTML = `<p class="empty-cart">No products available in this category.</p>`;
        }

        categoryOverlay.classList.add('active');
    });
});

// إغلاق قائمة الأقسام
closeCategoryBtn.addEventListener('click', () => {
    categoryOverlay.classList.remove('active');
});

categoryOverlay.addEventListener('click', (e) => {
    if (e.target === categoryOverlay) {
        categoryOverlay.classList.remove('active');
    }
});
// تشغيل الموسيقى
const bgMusic = document.getElementById("bgMusic");

function playMusic() {
    bgMusic.py?.() || bgMusic.play().catch(function(error) {
        console.log("Music error:", error);
    });
}

document.addEventListener("touchstart", playMusic, { once: true });
document.addEventListener("click", playMusic, { once: true });

// --- إدارة سلة الشراء (Cart State) ---
let cart = [];

const cartButton = document.getElementById('cartButton');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const whatsappBtn = document.getElementById('whatsappBtn');

// فتح وإغلاق السلة الأساسية
cartButton.addEventListener('click', () => {
    cartOverlay.classList.add('active');
});

closeCartBtn.addEventListener('click', () => {
    cartOverlay.classList.remove('active');
});

cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) {
        cartOverlay.classList.remove('active');
    }
});

// دالة إضافة منتج للسلة (مع استلام المقاس)
window.addToCartFromCategory = function(name, price, img, buttonElement) {
    // نجيب المقاس اللي المستخدم اختاره من الـ Select جنب الزرار
    const productItemContainer = buttonElement.closest('.category-product-item');
    const sizeSelect = productItemContainer.querySelector('.size-select');
    const selectedSize = sizeSelect ? sizeSelect.value : 'M';

    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    
    // نشوف لو نفس المنتج ونفس المقاس موجودين قبل كده في السلة
    const existingItem = cart.find(item => item.name === name && item.size === selectedSize);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ 
            id: `${name}-${selectedSize}`, 
            name, 
            size: selectedSize, 
            price: numericPrice, 
            rawPrice: price, 
            img, 
            quantity: 1 
        });
    }
    
    updateCartUI();
    alert(`Added ${name} (Size: ${selectedSize}) to cart! 🛒`);
};

// تحديث واجهة السلة
function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalCount;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
        cartTotal.innerText = `0 EGP`;
        return;
    }

    cartItemsContainer.innerHTML = cart.map((item) => `
        <div class="cart-item" style="display: flex; gap: 12px; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 12px; justify-content: space-between;">
            <div style="display: flex; gap: 10px; align-items: center;">
                <img src="${item.img}" alt="${item.name}" style="width: 55px; height: 55px; object-fit: cover; border-radius: 8px;">
                <div>
                    <h4 style="font-size: 13px; margin-bottom: 2px; color: #333;">${item.name}</h4>
                    <p style="color: #666; font-size: 11px; margin-bottom: 4px;">Size: <b>${item.size}</b> | ${item.rawPrice}</p>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button onclick="decreaseQuantity('${item.id}')" style="background: #eee; border: none; width: 22px; height: 22px; border-radius: 4px; cursor: pointer; font-weight: bold;">-</button>
                        <span style="font-size: 13px; font-weight: bold;">${item.quantity}</span>
                        <button onclick="increaseQuantity('${item.id}')" style="background: #eee; border: none; width: 22px; height: 22px; border-radius: 4px; cursor: pointer; font-weight: bold;">+</button>
                    </div>
                </div>
            </div>
            <button onclick="removeItem('${item.id}')" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 18px; padding: 5px;">×</button>
        </div>
    `).join('');

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.innerText = `${totalPrice} EGP`;
}

// زيادة الكمية من جوه السلة
window.increaseQuantity = function(id) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += 1;
        updateCartUI();
    }
};

// تقليل الكمية من جوه السلة
window.decreaseQuantity = function(id) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        updateCartUI();
    }
};

// حذف المنتج نهائياً من السلة
window.removeItem = function(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
};

// ربط زر الواتساب لإرسال تفاصيل الطلب بالمقاسات والكميات
whatsappBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    let message = "Hello VORIX, I want to order:\n";
    cart.forEach(item => {
        message += `- ${item.name} (Size: ${item.size}) x${item.quantity} - ${item.rawPrice}\n`;
    });
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: ${totalPrice} EGP`;
    
    const whatsappUrl = `https://wa.me/201117704856?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});


// --- منطق قائمة الأقسام المنزلقة (Category Drawer) ---
const categoryOverlay = document.getElementById('categoryOverlay');
const closeCategoryBtn = document.getElementById('closeCategory');
const categoryTitle = document.getElementById('categoryTitle');
const categoryContainer = document.getElementById('categoryProductsContainer');

// بيانات المنتجات لكل قسم (متاحة بالمقاسات)
const categoryData = {
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

// فتح قائمة القسم وعرض المنتجات مع اختيار المقاس
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const catKey = card.getAttribute('data-category');
        const products = categoryData[catKey] || [];
        
        categoryTitle.innerText = card.querySelector('h3').innerText;
        
        if(products.length > 0) {
            categoryContainer.innerHTML = products.map((item) => `
                <div class="category-product-item" style="display: flex; gap: 12px; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 12px; justify-content: space-between;">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <img src="${item.img}" alt="${item.name}" style="width: 55px; height: 55px; object-fit: cover; border-radius: 8px;">
                        <div>
                            <h4 style="font-size: 13px; margin-bottom: 2px; color: #333;">${item.name}</h4>
                            <p style="color: #666; font-size: 12px; font-weight: bold; margin-bottom: 4px;">${item.price}</p>
                            <!-- اختيار المقاس -->
                            <select class="size-select" style="padding: 3px 6px; font-size: 11px; border-radius: 4px; border: 1px solid #ccc;">
                                <option value="S">S</option>
                                <option value="M" selected>M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                            </select>
                        </div>
                    </div>
                    <button type="button" onclick="addToCartFromCategory('${item.name}', '${item.price}', '${item.img}', this)" style="background: #000; color: #fff; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold;">Add 🛒</button>
                </div>
            `).join('');
        } else {
            categoryContainer.innerHTML = `<p class="empty-cart">No products available in this category.</p>`;
        }

        categoryOverlay.classList.add('active');
    });
});

// إغلاق قائمة الأقسام
closeCategoryBtn.addEventListener('click', () => {
    categoryOverlay.classList.remove('active');
});

categoryOverlay.addEventListener('click', (e) => {
    if (e.target === categoryOverlay) {
        categoryOverlay.classList.remove('active');
    }
});