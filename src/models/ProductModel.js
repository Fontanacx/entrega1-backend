const fs = require('fs');
const path = require('path');

const PRODUCT_FILE = path.resolve('src/public/products.json');

class ProductModel {
  static async getAll() {
    if (!fs.existsSync(PRODUCT_FILE)) return [];
    const data = await fs.promises.readFile(PRODUCT_FILE, 'utf-8');
    return JSON.parse(data);
  }

  static async add(product) {
    const products = await this.getAll();
    if (products.some((p) => p.code === product.code)) {
      throw new Error('El código ya existe.');
    }
    product.id = Date.now().toString();
    products.push(product);
    await fs.promises.writeFile(PRODUCT_FILE, JSON.stringify(products, null, 2));
    return product;
  }
}

module.exports = ProductModel;
