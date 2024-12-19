document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            event.preventDefault();

            const productId = button.getAttribute("data-product-id"); // Obtiene el ID del producto
            const cid = "6761a32acc3a0b76156c6aab"; // ID del carrito

            try {
                const response = await fetch(`/api/cart/${cid}/products/${productId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    alert("Producto añadido al carrito con éxito");
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message}`);
                }
            } catch (error) {
                console.error("Error al agregar producto al carrito:", error);
            }
        });
    });
});