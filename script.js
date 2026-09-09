document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       ELEMENTS
    ========================= */

    const cartButton = document.getElementById("cartButton");
    const cartOverlay = document.getElementById("cartOverlay");
    const closeCart = document.getElementById("closeCart");
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const whatsappBtn = document.getElementById("whatsappBtn");

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


        /* PRODUCTS */

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

                    ×

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
                    Number(cart[index].quantity) + 1;

            }


            /* DECREASE */

            if (action === "decrease") {

                cart[index].quantity =
                    Number(cart[index].quantity) - 1;


                if (
                    cart[index].quantity <= 0
                ) {

                    cart.splice(index, 1);

                }

            }


            /* REMOVE */

            if (action === "remove") {

                cart.splice(index, 1);

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


            /* CHECK CART */

            if (cart.length === 0) {

                alert(
                    "Your cart is empty!"
                );

                return;

            }


            /* WHATSAPP NUMBER */

            const phoneNumber =
                "201007341483";


            /* MESSAGE */

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


            /* CREATE URL */

            const whatsappURL =
                "https://wa.me/" +
                phoneNumber +
                "?text=" +
                encodeURIComponent(message);


            /*

               محاولة فتح واتساب
               في نافذة جديدة

            */

            const newWindow =
                window.open(
                    whatsappURL,
                    "_blank"
                );


            /*
               لو المتصفح منع
               فتح النافذة الجديدة
            */

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
       START
    ========================= */

    updateCart();

});
/* =========================
   REALISTIC LIGHTNING
========================= */

const canvas = document.getElementById("lightningCanvas");
const ctx = canvas.getContext("2d");

let width;
let height;

function resizeLightningCanvas() {
    width = canvas.width = window.innerWidth * devicePixelRatio;
    height = canvas.height = window.innerHeight * devicePixelRatio;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0
    );
}

resizeLightningCanvas();

window.addEventListener("resize", resizeLightningCanvas);


/* إنشاء مسار برق */
function createLightning(startX, endX, segments = 18) {

    const points = [];

    let x = startX;
    const stepY = window.innerHeight / segments;

    points.push({
        x: x,
        y: 0
    });

    for (let i = 1; i < segments; i++) {

        x += (Math.random() - 0.5) * 90;

        points.push({
            x: x,
            y: stepY * i
        });
    }

    points.push({
        x: endX,
        y: window.innerHeight
    });

    return points;
}


/* رسم صاعقة */
function drawLightning(points, lineWidth = 3, alpha = 1) {

    ctx.save();

    ctx.beginPath();

    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {

        ctx.lineTo(
            points[i].x,
            points[i].y
        );

    }

    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.lineWidth = lineWidth;

    ctx.shadowColor = "rgba(255,255,255,1)";
    ctx.shadowBlur = 25;

    ctx.stroke();

    ctx.restore();
}


/* فروع البرق */
function drawBranches(points) {

    for (let i = 3; i < points.length - 2; i++) {

        if (Math.random() > 0.55) {

            const start = points[i];

            const branch = [
                {
                    x: start.x,
                    y: start.y
                }
            ];

            let x = start.x;
            let y = start.y;

            const direction =
                Math.random() > 0.5 ? 1 : -1;

            const length =
                Math.floor(Math.random() * 4) + 3;

            for (let j = 0; j < length; j++) {

                x += direction * (25 + Math.random() * 35);
                y += 25 + Math.random() * 35;

                branch.push({
                    x: x,
                    y: y
                });
            }

            drawLightning(
                branch,
                1.5,
                0.8
            );
        }
    }
}


/* فلاش الشاشة */
function screenFlash(strength = 0.8) {

    const flash = document.createElement("div");

    flash.style.position = "fixed";
    flash.style.inset = "0";
    flash.style.background = `rgba(255,255,255,${strength})`;
    flash.style.pointerEvents = "none";
    flash.style.zIndex = "9989";

    document.body.appendChild(flash);

    setTimeout(() => {
        flash.style.transition = "opacity 120ms ease";
        flash.style.opacity = "0";

        setTimeout(() => {
            flash.remove();
        }, 150);
    }, 25);
}


/* الضربة */
function strikeLightning() {

    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    const startX =
        window.innerWidth * (
            0.25 + Math.random() * 0.5
        );

    const endX =
        startX + (
            Math.random() - 0.5
        ) * 180;

    const points = createLightning(
        startX,
        endX,
        20
    );

    /* أول ضربة */
    screenFlash(0.65);

    drawLightning(
        points,
        4,
        1
    );

    drawBranches(points);


    /* ضربة ثانية سريعة */
    setTimeout(() => {

        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );

        screenFlash(0.4);

        drawLightning(
            points,
            3,
            0.9
        );

        drawBranches(points);

    }, 90);


    /* اختفاء */
    setTimeout(() => {

        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );

    }, 220);
}


/* توقيت عشوائي */
function randomLightning() {

    const delay =
        2500 + Math.random() * 5000;

    setTimeout(() => {

        strikeLightning();

        randomLightning();

    }, delay);
}

randomLightning();