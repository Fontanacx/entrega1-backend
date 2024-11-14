import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

class CartManager {
  constructor() {
    this.filePath = './src/data/carts.json';
  }

  async getAllCarts() {
    const data = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  async createCart() {
    const carts = await this.getAllCarts();
    const newCart = { id: uuidv4(), products: [] };
    carts.push(newCart);
    await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cartId, productId, quantity) {
    const carts = await this.getAllCarts();
    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) return null;

    const productInCart = cart.products.find((p) => p.productId === productId);
    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    return cart;
  }
}

export default CartManager;
