const socket = io();

document.addEventListener("DOMContentLoaded", () => {
  const emptyCartBtn = document.getElementById("emptyCartBtn");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (emptyCartBtn) {
    emptyCartBtn.addEventListener("click", async () => {
      await socket.emit("empty-cart");
      Swal.fire({
        title: "Carrito vaciado",
        icon: "success",
        width: 600,
      });
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
      await socket.emit("checkout-cart");
      Swal.fire({
        title: "Compra finalizada",
        icon: "success",
        width: 600,
      });
    });
  }

  socket.on("cart-updated", (cart) => {
    // Aquí puedes actualizar la vista del carrito si es necesario
  });
});
