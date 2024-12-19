const socket = io();

document.addEventListener("DOMContentLoaded", () => {
  const emptyCartBtn = document.getElementById("emptyCartBtn");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // Evento para vaciar carrito
  if (emptyCartBtn) {
    emptyCartBtn.addEventListener("click", async () => {
      await socket.emit("empty-cart");
      Swal.fire({
        title: "Carrito vaciado",
        icon: "success",
        width: 600
      });
      location.reload(); // Recargar la página para actualizar
    });
  }

  // Evento para finalizar compra
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
      await socket.emit("checkout-cart");
      Swal.fire({
        title: "Compra finalizada",
        icon: "success",
        width: 600
      });
      location.reload(); // Recargar la página para actualizar
    });
  }

  // Escuchar actualizaciones del carrito
  socket.on("cart-updated", (cart) => {
    location.reload();
  });
});
