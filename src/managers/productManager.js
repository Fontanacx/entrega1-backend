import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

class ProductManager {
  constructor() {
    this.filePath = './src/data/products.json'; // Asegúrate de que la ruta al archivo sea correcta
  }

  async getProducts() {
    const data = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const newProduct = { id: uuidv4(), ...product }; // Genera un ID único para el nuevo producto
    products.push(newProduct);
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return newProduct;
  }
}

export default ProductManager;
