import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import ErrorManager from "./ErrorManager.js";
import ProductsManager from "./ProductsManager.js";
import mongoose from "mongoose";

const productsManager = new ProductsManager();

class CartsManager {
  // GET ALL CARTS
  async getCarts(query) {
    const { limit } = query;
    try {
      const carts = await readJsonFile(paths.data, "carts.json");

      if (limit > 0) {
        return carts.slice(0, limit);
      }

      return carts;
    } catch (err) {
      throw new ErrorManager(err.message, err.code);
    }
  }

  // FIND CART BY ID
  async findById(id) {
    try {
      const carts = await this.getCarts({});
      const cartFound = carts.find((cart) => cart.id === Number(id));

      if (!cartFound) {
        throw new ErrorManager("Carrito no encontrado", 404);
      }
      return cartFound;
    } catch (err) {
      throw new ErrorManager(err.message, err.code);
    }
  }

  // GET CART BY ID
  async getById(id) {
    try {
      return await this.findById(id);
    } catch (err) {
      throw new ErrorManager(err.message, err.code);
    }
  }

  // SHOW PRODUCTS IN CART
  async showProductInCart() {
    try {
      const carts = await this.getCarts({});
      const productInCart = await Promise.all(
        carts.flatMap((cart) =>
          cart.products.map(async (product) => {
            if (!mongoose.Types.ObjectId.isValid(product.id)) {
              throw new ErrorManager(`ID inválido: ${product.id}`, 400);
            }
            const productId = new mongoose.Types.ObjectId(product.id);
            console.log(`Buscando producto con ID: ${productId}`);
            const productData = await productsManager.getById(productId);
            if (!productData) {
              console.log(`Producto con ID ${productId} no encontrado`);
              throw new ErrorManager(`Producto con ID ${productId} no encontrado`, 404);
            }
            return { ...productData.toObject(), quantity: product.quantity };
          })
        )
      );

      return productInCart;
    } catch (err) {
      throw new ErrorManager(err.message, err.code || 500);
    }
  }

  // EMPTY CART
  async emptyCart() {
    try {
      const carts = await this.getCarts({});
      carts.forEach((cart) => {
        cart.products = [];
      });
      await writeJsonFile(paths.data, "carts.json", carts);
    } catch (err) {
      throw new ErrorManager(err.message, err.code || 500);
    }
  }

  // CHECKOUT CART
  async checkoutCart() {
    try {
      const carts = await this.getCarts({});
      // Simular proceso de compra, aquí puedes añadir lógica específica para el checkout
      carts.forEach((cart) => {
        cart.products = [];
      });
      await writeJsonFile(paths.data, "carts.json", carts);
    } catch (err) {
      throw new ErrorManager(err.message, err.code || 500);
    }
  }

  // INSERT PRODUCT TO CART
  async insertProductToCart(cart, product) {
    try {
      const productInCart = cart.products.find(p => p.id === product._id.toString());
      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        cart.products.push({ id: product._id.toString(), quantity: 1 });
      }
      const carts = await this.getCarts({});
      const updatedCarts = carts.map(c => c.id === cart.id ? cart : c);
      await writeJsonFile(paths.data, "carts.json", updatedCarts);
    } catch (err) {
      throw new ErrorManager(err.message, err.code || 500);
    }
  }

  // DELETE PRODUCT FROM CART
  async deleteProductToCart(cart, productId) {
    try {
      const productIndex = cart.products.findIndex(p => p.id === productId);
      if (productIndex > -1) {
        cart.products.splice(productIndex, 1);
      }
      const carts = await this.getCarts({});
      const updatedCarts = carts.map(c => c.id === cart.id ? cart : c);
      await writeJsonFile(paths.data, "carts.json", updatedCarts);
    } catch (err) {
      throw new ErrorManager(err.message, err.code || 500);
    }
  }
}

export default CartsManager;
