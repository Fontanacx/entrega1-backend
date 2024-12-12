import { Server } from "socket.io";
import ProductsManager from "../managers/ProductsManager.js";
import CartsManager from "../managers/CartsManager.js";

const productsManager = new ProductsManager();
const cartsManager = new CartsManager();

export const config = (httpServer) => {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", async (socket) => {
    try {
      await socketServer.emit("products-list", {
        products: await productsManager.getProducts({}),
      });

      await socketServer.emit("cart-list", {
        cart: await cartsManager.showProductInCart(),
      });

      socket.on("new-product", async (data) => {
        try {
          await productsManager.addProduct(data);

          await socketServer.emit("products-list", {
            products: await productsManager.getProducts({}),
          });
        } catch (err) {
          socketServer.emit("err-message", {
            message: err.message,
          });
        }
      });

      socket.on("update-product", async (data) => {
        try {
          await productsManager.updateProduct(data.id, data.data);

          await socketServer.emit("products-list", {
            products: await productsManager.getProducts({}),
          });
        } catch (err) {
          socketServer.emit("err-message", {
            message: err.message,
          });
        }
      });

      socket.on("delete-product", async (data) => {
        try {
          await productsManager.deleteProduct(data.id);

          await socketServer.emit("products-list", {
            products: await productsManager.getProducts({}),
          });
        } catch (err) {
          socketServer.emit("err-message", {
            message: err.message,
          });
        }
      });

      socket.on("add-product-cart", async (data) => {
        try {
          const productFound = await productsManager.getById(data.product);
          const cartFound = await cartsManager.getById(data.cart);

          await cartsManager.insertProductToCart(cartFound, productFound);
          await socketServer.emit("cart-list", {
            cart: await cartsManager.showProductInCart(),
          });
        } catch (err) {
          socketServer.emit("err-message", {
            message: err.message,
          });
        }
      });

      socket.on("delete-product-cart", async (data) => {
        try {
          const cartFound = await cartsManager.getById(data.cart);
          await cartsManager.deleteProductToCart(cartFound, data.product);

          await socketServer.emit("cart-list", {
            cart: await cartsManager.showProductInCart(),
          });
        } catch (err) {
          socketServer.emit("err-message", {
            message: err.message,
          });
        }
      });

      socket.on("empty-cart", async () => {
        try {
          await cartsManager.emptyCart();
          await socketServer.emit("cart-updated", await cartsManager.showProductInCart());
        } catch (err) {
          socketServer.emit("err-message", {
            message: err.message,
          });
        }
      });

      socket.on("checkout-cart", async () => {
        try {
          await cartsManager.checkoutCart();
          await socketServer.emit("cart-updated", await cartsManager.showProductInCart());
        } catch (err) {
          socketServer.emit("err-message", {
            message: err.message,
          });
        }
      });
    } catch (err) {
      console.error("Error en la conexión del socket:", err.message);
    }
  });
};
