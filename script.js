document.addEventListener("DOMContentLoaded", function () {

```
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

    categories.forEach(function (category) {

        category.style.display = "none";

    });


    categoryProducts.forEach(function (section) {

        section.classList.remove("active");

    });


    const selectedSection =
        document.getElementById(categoryName);


    if (selectedSection) {

        selectedSection.classList.add("active");

    }

}


function showCategories() {

    categoryProducts.forEach(function (section) {

        section.classList.remove("active");

    });


    categories.forEach(function (category) {

        category.style.display = "";

    });

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
```

});
