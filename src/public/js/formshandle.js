document.addEventListener("DOMContentLoaded", () => {
    const formAddProduct = document.querySelector("#formAddProduct");
    const formUpdateProduct = document.querySelector("#formUpdateProduct");
    const formDeleteProduct = document.querySelector("#formDeleteProduct");
  
    if (formAddProduct) {
      formAddProduct.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(formAddProduct);
  
        // Emitir evento para añadir producto
        await socket.emit("new-product", {
          name: formData.get("name"),
          brand: formData.get("brand"),
          category: formData.get("category"),
          price: formData.get("price"),
          description: formData.get("description"),
          stock: formData.get("stock"),
          thumbnail: "",
          status: true,
        });
  
        await Swal.fire({
          title: "Product added",
          icon: "success",
          width: 600,
        });
  
        formAddProduct.reset();
      });
    }
  
    if (formUpdateProduct) {
      formUpdateProduct.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(formUpdateProduct);
  
        // Emitir evento para actualizar producto
        await socket.emit("update-product", {
          id: formData.get("id"),
          data: {
            name: formData.get("name"),
            brand: formData.get("brand"),
            category: formData.get("category"),
            price: formData.get("price"),
            description: formData.get("description"),
            stock: formData.get("stock"),
            thumbnail: formData.get("thumbnail") || null,
            status: true,
          },
        });
  
        await Swal.fire({
          title: `Product ID ${formData.get("id")} updated`,
          icon: "success",
          width: 600,
        });
  
        formUpdateProduct.reset();
      });
    }
  
    if (formDeleteProduct) {
      formDeleteProduct.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(formDeleteProduct);
  
        const id = formData.get("id");
  
        // Emitir evento para eliminar producto
        await socket.emit("delete-product", { id: id });
  
        await Swal.fire({
          title: `Product ID ${id} deleted`,
          icon: "success",
          width: 600,
        });
  
        formDeleteProduct.reset();
      });
    }
  });
  