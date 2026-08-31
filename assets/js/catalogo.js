const products = [

    {
        id: 1,
        name: "Bye, Bye Quitamanchas",
        presentation: "250 ml",
        price: 40000,
        category: "Limpieza",

        image: "imagenes/bye12x80.png",
        infoImage: "imagenes/infobye.jpg"
    },


    {
        id: 2,
        name: "Desengrasante",
        presentation: "1000ml",
        price: 35000,
        category: "Cocina",

        image: "imagenes/desegrasante12x80.png",
        infoImage: "imagenes/infodengrasante.jpg"
    },


    {
        id: 3,
        name: "Limpia Vidrios",
        presentation: "1000ml",
        price: 35000,
        category: "Vidrios",

        image: "imagenes/limpiavidrios12x80.png",
        infoImage: "imagenes/infolimpia vidrios.jpg"
    },


    {
        id: 4,
        name: "Limpia juntas multiusos",
        presentation: "1000ml",
        price: 35000,
        category: "Baños limpia juntas",

        image: "imagenes/desmanchajuntas12x80.png",
        infoImage: "imagenes/infolimpiajuntas.jpg"
    },


    {
        id: 5,
        name: "Cepillo Individual",
        presentation: "PRESENTACIÓN",
        price: 35000,
        category: "cepillo",

        image: "imagenes/cepillo12x80.png",
        infoImage: "imagenes/infocepillo.jpg"
    },


   {
    id: 6,
    name: "Kit de productos de limpieza Drops",
    presentation: "Combo 1",
    price: 153000,
    oldPrice: 180000,
    category: "Limpieza , combo",
    image: "imagenes/kit800.jpg",
    infoImage: "imagenes/infocombo1.jpg"
},


    {
        id: 7,
        name: "Kit de productos de limpieza Drops",
        presentation: "Combo 2",
        price: 94500,
        oldPrice: 105000,
        category: "Limpieza, combo",

        image: "imagenes/C-combo-2.png",
        infoImage: "imagenes/infocombo2.jpg"
    },


    {
        id: 8,
        name: "Kit Desengrasante 1L + ByeBye Manchas 250 ml",
        presentation: "Combo 3",
        price: 67500,
        oldPrice: 75000,
        category: "Limpieza, combo",

        image: "imagenes/desenbye.png",
        infoImage: "imagenes/infocombo3.jpg"
    },

        {
        id: 9,
        name: "Kit Desmanchador de Juntas + Cepillo Limpia Juntas",
        presentation: "Combo 4",
        price: 63000,
        oldPrice: 70000,
        category: "juntas cepillo kit , combo ",

        image: "imagenes/jun1200x800.png",
        infoImage: "imagenes/infocombo4.jpg"
    },

    //         {
    //     id: 10,
    //     name: "Combo 5",
    //     presentation: "PRESENTACIÓN",
    //     price: 0,
    //     category: "Limpieza",

    //     image: "imagenes/empaquekit.jpg",
    //     infoImage: "imagenes/PRODUCTO-10-info.jpg"
    // },

    

];

const productsGrid = document.getElementById("productsGrid");

function renderProducts(list = products) {

    productsGrid.innerHTML = "";

    list.forEach(product => {

const card = document.createElement("article");

card.className = "product-flip-card";

card.dataset.productId = product.id;

        card.innerHTML = `
            <div class="product-flip-inner">

                <!-- FRENTE -->
                <div class="product-card-front">

                    <div class="product-card-image">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >

                    </div>

                    <div class="product-card-content">

                        <span class="product-presentation">
                            ${product.presentation}
                        </span>

                        <h3>
                            ${product.name}
                        </h3>

                        <div class="product-card-bottom">

                            <div class="product-card-price-container">

    ${
        product.oldPrice
            ? `
                <span class="product-card-old-price">
                    $${product.oldPrice.toLocaleString("es-CO")}
                </span>
                <strong class="product-card-price">
                    $${product.price.toLocaleString("es-CO")}
                </strong>
              `
            : `
                <strong class="product-card-price">
                    $${product.price.toLocaleString("es-CO")}
                </strong>
              `
    }

                            </div>

                            <button
                                type="button"
                                class="product-info-button"
                                aria-label="Ver información">

                                <i data-lucide="refresh-cw"></i>
                                <span>Ver información</span>

                            </button>

                        </div>

                    </div>

                </div>

                <!-- REVERSO -->
                <div class="product-card-back">

                    <img
                        src="${product.infoImage}"
                        alt="Información de ${product.name}"
                    >

                </div>

            </div>

            <button
                type="button"
                class="add-to-cart-button"
                data-product-id="${product.id}">

                <i data-lucide="shopping-cart"></i>
                Agregar al carrito

            </button>
        `;
 
        productsGrid.appendChild(card);
    });

    lucide.createIcons();
}

renderProducts();

const productSearch = document.getElementById("productSearch");


productSearch.addEventListener("input", function () {

    const searchTerm = this.value
        .toLowerCase()
        .trim();


    if (!searchTerm) {

        renderProducts();

        return;

    }


    const filteredProducts = products.filter(product => {

        const productName = product.name
            .toLowerCase();

        const presentation = product.presentation
            .toLowerCase();

        return productName.includes(searchTerm) ||
               presentation.includes(searchTerm);

    });


    renderProducts(filteredProducts);


    if (filteredProducts.length === 1) {

        setTimeout(() => {

            const productCard = document.querySelector(
                `[data-product-id="${filteredProducts[0].id}"]`
            );


            if (productCard) {

                productCard.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        }, 100);

    }

});

/* =========================================================
   PRODUCTOS DESTACADOS - GIRO AUTOMÁTICO
========================================================= */

const featuredCards = document.querySelectorAll(".featured-flip-card");

if (featuredCards.length) {

    let currentFeaturedCard = 0;

    function rotateFeaturedCard() {

        featuredCards.forEach(card => {
            card.classList.remove("auto-flip");
        });

        featuredCards[currentFeaturedCard].classList.add("auto-flip");

        currentFeaturedCard++;

        if (currentFeaturedCard >= featuredCards.length) {
            currentFeaturedCard = 0;
        }
    }

    setInterval(rotateFeaturedCard, 6000);

}

/* =========================================================
   CARRITO DE COMPRAS
========================================================= */

let cart = [];

/* ELEMENTOS DEL CARRITO */
const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeCart");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");

const cartSubtotal = document.getElementById("cartSubtotal");
const cartDelivery = document.getElementById("cartDelivery");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.querySelector(".cart-count");

const DELIVERY_COST = 9000;

/* =========================================================
   MODO DEL CATÁLOGO
========================================================= */

const catalogMode = sessionStorage.getItem("modoCatalogo") || "compra";

const isServiceMode = catalogMode === "servicio";


/* =========================================================
   IR AL CATÁLOGO DESDE UN SERVICIO
========================================================= */

function irAlCatalogoDesdeServicio() {

    sessionStorage.setItem("modoCatalogo", "servicio");

    window.location.href = "catalogo.html";
}


/* =========================================================
   VOLVER AL FORMULARIO DEL SERVICIO
========================================================= */

function volverAlServicio() {

    sessionStorage.setItem(
        "productosServicio",
        JSON.stringify(cart)
    );

    sessionStorage.removeItem("modoCatalogo");

    window.location.href = "index.html#booking";
}


/* =========================================================
   FORMATO DE DINERO
========================================================= */

function formatPrice(price) {
    return `$${price.toLocaleString("es-CO")}`;
}


/* =========================================================
   ABRIR CARRITO
========================================================= */

function openCartPanel() {

    cartPanel.classList.add("active");
    cartOverlay.classList.add("active");

    cartPanel.setAttribute("aria-hidden", "false");

}


/* =========================================================
   CERRAR CARRITO
========================================================= */

function closeCartPanel() {

    cartPanel.classList.remove("active");
    cartOverlay.classList.remove("active");

    cartPanel.setAttribute("aria-hidden", "true");

}


/* =========================================================
   AGREGAR PRODUCTO
========================================================= */

function addToCart(productId) {

    const product = products.find(
        product => product.id === productId
    );

    if (!product) return;


    const existingProduct = cart.find(
        item => item.id === productId
    );


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    renderCart();

    openCartPanel();

}


/* =========================================================
   MOSTRAR CARRITO
========================================================= */

function renderCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="cart-empty">
                <i data-lucide="shopping-cart"></i>
                <p>Tu carrito está vacío.</p>
                <span>Agrega productos para continuar.</span>
            </div>
        `;

        cartSubtotal.textContent = "$0";
        cartDelivery.textContent = "$0";
        cartTotal.textContent = "$0";
        cartCount.textContent = "0";

        lucide.createIcons();

        return;
    }


    let subtotal = 0;
    let totalItems = 0;


    cart.forEach(item => {

        const itemSubtotal = item.price * item.quantity;

        subtotal += itemSubtotal;
        totalItems += item.quantity;


        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img
                    src="${item.image}"
                    alt="${item.name}">
            </div>


            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <span>${item.presentation}</span>

                <strong>
                    ${formatPrice(item.price)}
                </strong>


                <div class="cart-item-actions">

                    <div class="quantity-control">

                        <button
                            type="button"
                            class="quantity-minus"
                            data-id="${item.id}">
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            class="quantity-plus"
                            data-id="${item.id}">
                            +
                        </button>

                    </div>


                    <button
                        type="button"
                        class="remove-cart-item"
                        data-id="${item.id}"
                        aria-label="Eliminar producto">

                        <i data-lucide="trash-2"></i>

                    </button>

                </div>

            </div>


            <strong class="cart-item-subtotal">
                ${formatPrice(itemSubtotal)}
            </strong>
        `;


        cartItems.appendChild(cartItem);

    });


const delivery = isServiceMode ? 0 : DELIVERY_COST;
const total = subtotal + delivery;


    cartSubtotal.textContent = formatPrice(subtotal);
    cartDelivery.textContent = formatPrice(delivery);
    cartTotal.textContent = formatPrice(total);

    cartCount.textContent = totalItems;


    lucide.createIcons();

}


/* =========================================================
   EVENTOS DE LOS BOTONES
========================================================= */

document.addEventListener("click", function(event) {

    const addButton = event.target.closest(".add-to-cart-button");

    if (addButton) {

        const productId = Number(
            addButton.dataset.productId
        );

        addToCart(productId);

        return;
    }


    const plusButton = event.target.closest(".quantity-plus");

    if (plusButton) {

        const productId = Number(
            plusButton.dataset.id
        );

        const item = cart.find(
            product => product.id === productId
        );

        if (item) {

            item.quantity++;

            renderCart();

        }

        return;
    }


    const minusButton = event.target.closest(".quantity-minus");

    if (minusButton) {

        const productId = Number(
            minusButton.dataset.id
        );

        const item = cart.find(
            product => product.id === productId
        );

        if (item) {

            item.quantity--;

            if (item.quantity <= 0) {

                cart = cart.filter(
                    product => product.id !== productId
                );

            }

            renderCart();

        }

        return;
    }


    const removeButton = event.target.closest(".remove-cart-item");

    if (removeButton) {

        const productId = Number(
            removeButton.dataset.id
        );

        cart = cart.filter(
            product => product.id !== productId
        );

        renderCart();

    }

});


/* =========================================================
   ABRIR / CERRAR
========================================================= */

if (openCart) {

    openCart.addEventListener(
        "click",
        openCartPanel
    );

}


if (closeCart) {

    closeCart.addEventListener(
        "click",
        closeCartPanel
    );

}


if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        closeCartPanel
    );

}


/* =========================================================
   INICIAR CARRITO
========================================================= */

renderCart();

/* =========================================================
   CHECKOUT - DATOS DE ENTREGA + RESUMEN
========================================================= */

const checkoutButton = document.getElementById("checkoutButton");

const checkoutModalOverlay =
    document.getElementById("checkoutModalOverlay");

const closeCheckout =
    document.getElementById("closeCheckout");

const checkoutForm =
    document.getElementById("checkoutForm");

    if (checkoutButton && isServiceMode) {

    checkoutButton.textContent = "Agregar al servicio";

}


/* =========================================================
   ELEMENTOS DEL RESUMEN
========================================================= */

const orderSummaryOverlay =
    document.getElementById("orderSummaryOverlay");

const closeOrderSummary =
    document.getElementById("closeOrderSummary");

const backToCheckout =
    document.getElementById("backToCheckout");

const orderSummaryProducts =
    document.getElementById("orderSummaryProducts");

const customerSummary =
    document.getElementById("customerSummary");

const summarySubtotal =
    document.getElementById("summarySubtotal");

const summaryDelivery =
    document.getElementById("summaryDelivery");

const summaryTotal =
    document.getElementById("summaryTotal");

const goToPayment =
    document.getElementById("goToPayment");


/* =========================================================
   ABRIR DATOS DE ENTREGA
========================================================= */
if (checkoutButton) {

    checkoutButton.addEventListener("click", function () {

        if (cart.length === 0) {

            alert("Agrega al menos un producto.");

            return;
        }


        if (isServiceMode) {

            volverAlServicio();

            return;

        }


        closeCartPanel();

        checkoutModalOverlay.classList.add("active");

        lucide.createIcons();

    });

}

/* =========================================================
   CERRAR DATOS DE ENTREGA
========================================================= */

if (closeCheckout) {

    closeCheckout.addEventListener("click", function () {

        checkoutModalOverlay.classList.remove("active");

    });

}


if (checkoutModalOverlay) {

    checkoutModalOverlay.addEventListener("click", function (event) {

        if (event.target === checkoutModalOverlay) {

            checkoutModalOverlay.classList.remove("active");

        }

    });

}


/* =========================================================
   CREAR RESUMEN DE PRODUCTOS
========================================================= */

function renderOrderSummaryProducts() {

    orderSummaryProducts.innerHTML = "";


    cart.forEach(item => {

        const itemSubtotal =
            item.price * item.quantity;


        const productElement =
            document.createElement("div");

        productElement.className =
            "order-summary-product";


        productElement.innerHTML = `

            <div class="order-summary-product-image">

                <img
                    src="${item.image}"
                    alt="${item.name}">

            </div>


            <div class="order-summary-product-info">

                <h4>
                    ${item.name}
                </h4>

                <span>
                    ${item.presentation} × ${item.quantity}
                </span>

            </div>


            <strong class="order-summary-product-price">

                ${formatPrice(itemSubtotal)}

            </strong>

        `;


        orderSummaryProducts.appendChild(
            productElement
        );

    });

}


/* =========================================================
   CREAR RESUMEN DE DATOS DEL CLIENTE
========================================================= */

function renderCustomerSummary() {

    const name =
        document.getElementById("customerName").value;

    const phone =
        document.getElementById("customerPhone").value;

    const email =
        document.getElementById("customerEmail").value;

    const address =
        document.getElementById("customerAddress").value;

    const neighborhood =
        document.getElementById("customerNeighborhood").value;

    const notes =
        document.getElementById("deliveryNotes").value;


    customerSummary.innerHTML = `

        <div class="customer-summary-row">

            <span>
                Nombre
            </span>

            <strong>
                ${name}
            </strong>

        </div>


        <div class="customer-summary-row">

            <span>
                Celular
            </span>

            <strong>
                ${phone}
            </strong>

        </div>


        <div class="customer-summary-row">

            <span>
                Correo
            </span>

            <strong>
                ${email}
            </strong>

        </div>


        <div class="customer-summary-row">

            <span>
                Dirección
            </span>

            <strong>
                ${address}
            </strong>

        </div>


        <div class="customer-summary-row">

            <span>
                Barrio
            </span>

            <strong>
                ${neighborhood}
            </strong>

        </div>


        ${
            notes
                ? `
                    <div class="customer-summary-row">

                        <span>
                            Indicaciones
                        </span>

                        <strong>
                            ${notes}
                        </strong>

                    </div>
                `
                : ""
        }

    `;

}


/* =========================================================
   ABRIR RESUMEN
========================================================= */

if (checkoutForm) {

    checkoutForm.addEventListener("submit", function (event) {

        event.preventDefault();


        if (cart.length === 0) {

            alert("Tu carrito está vacío.");

            return;
        }


        renderOrderSummaryProducts();

        renderCustomerSummary();


        summarySubtotal.textContent =
            cartSubtotal.textContent;

        summaryDelivery.textContent =
            cartDelivery.textContent;

        summaryTotal.textContent =
            cartTotal.textContent;


        checkoutModalOverlay.classList.remove(
            "active"
        );


        orderSummaryOverlay.classList.add(
            "active"
        );


        lucide.createIcons();

    });

}


/* =========================================================
   VOLVER A DATOS DE ENTREGA
========================================================= */

if (backToCheckout) {

    backToCheckout.addEventListener(
        "click",
        function () {

            orderSummaryOverlay.classList.remove(
                "active"
            );

            checkoutModalOverlay.classList.add(
                "active"
            );

        }
    );

}


/* =========================================================
   CERRAR RESUMEN
========================================================= */

if (closeOrderSummary) {

    closeOrderSummary.addEventListener(
        "click",
        function () {

            orderSummaryOverlay.classList.remove(
                "active"
            );

        }
    );

}


if (orderSummaryOverlay) {

    orderSummaryOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                orderSummaryOverlay
            ) {

                orderSummaryOverlay.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   CONTINUAR AL PAGO
========================================================= */

if (goToPayment) {

    goToPayment.addEventListener("click", function () {

        // Obtener método de pago seleccionado
        const paymentMethodElement =
            document.getElementById("catalogPaymentMethod");

        const paymentMethod =
            paymentMethodElement
                ? paymentMethodElement.value
                : "No seleccionado";


        // Obtener total del pedido
        const textoTotal = summaryTotal.textContent;

        const monto =
            parseInt(textoTotal.replace(/[^0-9]/g, "")) || 0;


        // Verificar que exista un total
        if (monto <= 0) {

            alert("El valor de la compra debe ser mayor a cero.");

            return;
        }


        // Verificar que haya seleccionado medio de pago
        if (paymentMethod === "No seleccionado" || !paymentMethod) {

            alert("Por favor selecciona una forma de pago.");

            return;
        }


        console.log("Medio de pago seleccionado:", paymentMethod);
        console.log("Total de la compra:", monto);


        /* =====================================================
           BRE-B
        ===================================================== */

        if (paymentMethod === "Bre-B") {

            window.open(
                "https://checkout.bold.co/payment/LNK_QMFMMNY3DK",
                "_blank"
            );

            return;
        }


        /* =====================================================
           PSE / TARJETAS
        ===================================================== */

        if (paymentMethod === "PSE / Tarjeta") {

            window.open(
                "https://checkout.bold.co/payment/LNK_QMFMMNY3DK",
                "_blank"
            );

            return;
        }

    });

}

/* =========================================================
   TRANSFERENCIA DAVIVIENDA
========================================================= */

function seleccionarTransferencia() {

    // Seleccionar método de pago
    const paymentMethod =
        document.getElementById("catalogPaymentMethod");

    if (paymentMethod) {
        paymentMethod.value = "Transferencia Bancaria";
    }


    // Obtener el total actual del pedido
    const textoTotal = summaryTotal.textContent;

    const monto =
        parseInt(
            textoTotal.replace(/[^0-9]/g, "")
        ) || 0;


    // Mostrar el total
    const transferAmount =
        document.getElementById("transferAmount");

    if (transferAmount) {

        transferAmount.textContent =
            "$" + monto.toLocaleString("es-CO");

    }


    // Mostrar los datos bancarios
    const transferenciaInfo =
        document.getElementById("transferenciaInfo");

    if (transferenciaInfo) {

        transferenciaInfo.classList.remove("hidden");

    }

}



/* ABRIR FORMULARIO */

if (checkoutButton) {

    checkoutButton.addEventListener("click", function () {

        if (cart.length === 0) {

            alert("Tu carrito está vacío.");

            return;
        }

        closeCartPanel();

        checkoutModalOverlay.classList.add("active");

        lucide.createIcons();

    });

}


/* CERRAR FORMULARIO */

if (closeCheckout) {

    closeCheckout.addEventListener("click", function () {

        checkoutModalOverlay.classList.remove("active");

    });

}


/* CERRAR AL HACER CLIC FUERA */

if (checkoutModalOverlay) {

    checkoutModalOverlay.addEventListener("click", function (event) {

        if (event.target === checkoutModalOverlay) {

            checkoutModalOverlay.classList.remove("active");

        }

    });

}


/* FORMULARIO */

if (checkoutForm) {

    checkoutForm.addEventListener("submit", function (event) {

        event.preventDefault();

        console.log("Datos de entrega listos para continuar.");

    });

}

// formulario drive

document.addEventListener('DOMContentLoaded', () => {
  const checkoutForm = document.getElementById('checkoutForm');
  const goToPaymentBtn = document.getElementById('goToPayment'); 

  if (goToPaymentBtn) {
    goToPaymentBtn.addEventListener('click', async function(e) {
      e.preventDefault();

      // CAPTURAMOS LOS PRODUCTOS DIRECTAMENTE DESDE LOS ELEMENTOS VISIBLES EN EL CARRITO
      let productsText = "Sin productos especificados";
      try {
        // Buscamos los contenedores de productos dentro del carrito en el HTML
        // (Ajusta los selectores si tus clases o IDs de los elementos del carrito son diferentes)
        const cartProductElements = document.querySelectorAll('.cart-item, #cartItemsContainer > div, [data-cart-item]');
        
        if (cartProductElements && cartProductElements.length > 0) {
          const items = [];
          cartProductElements.forEach(el => {
            const name = el.querySelector('.product-name, h3, h4, span')?.innerText || 'Producto';
            const qty = el.querySelector('.product-qty, input[type="number"], .quantity')?.value || 
                        el.querySelector('.product-qty, .quantity')?.innerText || '1';
            items.push(`${name.trim()} (Cant: ${qty.trim()})`);
          });
          if (items.length > 0) {
            productsText = items.join(' | ');
          }
        } else {
          // Plan B: Si están en el modal de resumen actual
          const summaryItems = document.querySelectorAll('#orderSummaryProducts > div');
          if (summaryItems && summaryItems.length > 0) {
            const items = [];
            summaryItems.forEach(el => {
              const text = el.innerText.replace(/\n/g, ' - ');
              if(text) items.push(text);
            });
            if (items.length > 0) productsText = items.join(' | ');
          }
        }
      } catch (err) {
        console.error("Error obteniendo productos de la interfaz:", err);
      }

      // DATOS DEL FORMULARIO Y MEDIO DE PAGO
      const formData = {
        customerName: document.getElementById('customerName')?.value || '',
        customerCedula: document.getElementById('customerCedula')?.value || '',
        customerPhone: document.getElementById('customerPhone')?.value || '',
        customerEmail: document.getElementById('customerEmail')?.value || '',
        customerAddress: document.getElementById('customerAddress')?.value || '',
        customerNeighborhood: document.getElementById('customerNeighborhood')?.value || '',
        cartItems: productsText, 
        deliveryNotes: document.getElementById('deliveryNotes')?.value || '',
        paymentMethod: document.getElementById('catalogPaymentMethod')?.value || 'No especificado'
      };

      const scriptURL = 'https://script.google.com/macros/s/AKfycby3y62omYGnY0SPAZljXVP1i7X_lXWlJDvGUen1arB2JgWTzpZ_RuHPnfBQ8XUjBRo/exec';

      try {
        await fetch(scriptURL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        alert('¡Pedido registrado con éxito!');
        
        if (checkoutForm) checkoutForm.reset();

        const orderSummaryOverlay = document.getElementById('orderSummaryOverlay');
        if (orderSummaryOverlay) orderSummaryOverlay.style.display = 'none';

        const modalOverlay = document.getElementById('checkoutModalOverlay');
        if (modalOverlay) modalOverlay.style.display = 'none';

      } catch (error) {
        console.error('Error al enviar el pedido:', error);
        alert('Hubo un error al procesar tu pedido. Inténtalo de nuevo.');
      }
    });
  }




  
});

/* =========================================================
   LLUVIA DE COMETAS DE BIENVENIDA (script independiente)
========================================================= */
(function () {
    var splashScreen = document.getElementById("seasonal-splash");
    var container = document.getElementById("particles-container");

    if (!splashScreen || !container) return;

    var currentThemeIcon = "♥️ ❤️ ❤️";
    var particleCount = 50;
    var splashDuration = 3500;

    for (var i = 0; i < particleCount; i++) {
        var span = document.createElement("span");
        span.className = "seasonal-particle";
        span.textContent = currentThemeIcon;

        var randomLeft = Math.random() * 100;
        var randomDuration = 2.5 + Math.random() * 2.5;
        var randomDelay = Math.random() * 2;
        var randomSize = 1.5 + Math.random() * 1.5;

        span.style.left = randomLeft + "%";
        span.style.animationDuration = randomDuration + "s";
        span.style.animationDelay = randomDelay + "s";
        span.style.fontSize = randomSize + "rem";

        container.appendChild(span);
    }

    setTimeout(function () {
        splashScreen.style.transition = "opacity 1s ease";
        splashScreen.style.opacity = "0";
        setTimeout(function () {
            splashScreen.remove();
        }, 1000);
    }, splashDuration);
})();

/* =========================================================
   BOTÓN FLOTANTE WHATSAPP (visibilidad según scroll)
========================================================= */
(function () {
    var floatBtn = document.getElementById("whatsappFloat");

    if (!floatBtn) return;

    var footer = document.querySelector(".catalog-footer");

    function updateWhatsAppVisibility() {
        var scrollY = window.scrollY || window.pageYOffset;
        var vh = window.innerHeight || document.documentElement.clientHeight;

        var show = true;

        if (scrollY < 60) {
            show = false;
        }

        if (footer) {
            var footerTop = footer.getBoundingClientRect().top;
            if (footerTop < vh - 20) {
                show = false;
            }
        }

        floatBtn.classList.toggle("visible", show);
    }

    window.addEventListener("scroll", updateWhatsAppVisibility, { passive: true });
    window.addEventListener("resize", updateWhatsAppVisibility);

    updateWhatsAppVisibility();
})();

