const fs = require('fs');
const path = require('path');

const CART_FILE = path.resolve('src/public/carts.json');

class CartModel {
  static async getAll() {
    if (!fs.existsSync(CART_FILE)) return [];
    const data = await fs.promises.readFile(CART_FILE, 'utf-8');
    return JSON.parse(data);
  }

  static async create() {
    const carts = await this.getAll();
    const newCart = { id: Date.now().toString(), items: [] };
    carts.push(newCart);
    await fs.promises.writeFile(CART_FILE, JSON.stringify(carts, null, 2));
    return newCart;
  }
}

module.exports = CartModel;
