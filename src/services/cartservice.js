import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';

export class CartService {
  async addProduct(userId, productId, quantity = 1) {
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const existingProductIndex = cart.products.findIndex(
      p => p.product.toString() === productId
    );

    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    cart.total = cart.products.reduce((total, item) => {
      return total + (item.quantity * product.price);
    }, 0);

    return await cart.save();
  }

  // Implementar métodos adicionales para eliminar, actualizar, finalizar compra
}