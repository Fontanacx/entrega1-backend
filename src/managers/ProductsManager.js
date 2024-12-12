import mongoose from "mongoose";
import Product from "../models/Product.js";
import ErrorManager from "./ErrorManager.js";

class ProductsManager {
  // GET ALL PRODUCTS
  async getProducts(query = {}) {
    try {
      const products = await Product.find(query);
      console.log("Productos obtenidos de la base de datos:", products);
      return products;
    } catch (err) {
      throw new ErrorManager(err.message, err.code || 500);
    }
  }

  // GET PRODUCT BY ID
  async getById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ErrorManager(`ID inválido: ${id}`, 400);
      }
      const product = await Product.findById(id);
      if (!product) {
        throw new ErrorManager(`Producto con ID ${id} no encontrado`, 404);
      }
      return product;
    } catch (err) {
      throw new ErrorManager(err.message, err.code || 500);
    }
  }
}

export default ProductsManager;
