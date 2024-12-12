import { connect, Schema, model } from "mongoose";
import fs from "fs";

const URL = "mongodb+srv://fontanac:45963439@fontanac.np81n.mongodb.net/?retryWrites=true&w=majority&appName=Fontanac";

// Define el esquema y modelo del producto directamente en el script
const productSchema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Product = model('Product', productSchema);

const loadProducts = async () => {
    try {
        await connect(URL);
        console.log("Conectado a MongoDB");

        // Elimina todos los productos existentes en la colección
        await Product.deleteMany({});
        console.log("Productos existentes eliminados");

        const productsData = JSON.parse(fs.readFileSync("src/data/products.json", "utf8"));

        // Filtra solo los campos necesarios
        const filteredProducts = productsData.map(product => ({
          code: product.code,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          description: product.description,
          stock: product.stock,
          thumbnail: product.thumbnail,
          inStock: product.inStock || true,
          createdAt: product.createdAt || Date.now(),
          updatedAt: product.updatedAt || Date.now()
        }));

        await Product.insertMany(filteredProducts);

        console.log("Productos cargados correctamente en MongoDB");
        process.exit();
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        process.exit(1);
    }
};

loadProducts();
