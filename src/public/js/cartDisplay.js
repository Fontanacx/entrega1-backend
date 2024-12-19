// public/js/cartDisplay.js

document.addEventListener("DOMContentLoaded", async () => {
    const cartContainer = document.querySelector(".cart-container");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>El carrito está vacío</p>";
    } else {
        // Enviar el carrito al servidor para procesar los productos
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cart),
        });

        const productsInCart = await response.json();

        if (productsInCart.length === 0) {
            cartContainer.innerHTML = "<p>No hay productos en tu carrito.</p>";
        } else {
            productsInCart.forEach(product => {
                const cartItem = document.createElement("div");
                cartItem.className = "cart-item";

                const productName = document.createElement("h3");
                productName.textContent = product.name;

                const productQuantity = document.createElement("p");
                productQuantity.textContent = `Cantidad: ${product.quantity}`;

                const productPrice = document.createElement("p");
                productPrice.textContent = `Precio: $${product.price}`;

                const productImage = document.createElement("img");
                productImage.src = product.imageUrl;
                productImage.alt = product.name;

                cartItem.append(productImage, productName, productQuantity, productPrice);
                cartContainer.appendChild(cartItem);
            });
        }
    }

    const emptyCartButton = document.querySelector("#emptyCartButton");
    if (emptyCartButton) {
        emptyCartButton.onclick = () => {
            localStorage.removeItem("cart");
            cartContainer.innerHTML = "<p>El carrito está vacío</p>";
        };
    }
});