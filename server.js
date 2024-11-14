import express from 'express';
import productsRouter from './src/routes/productsRouter.js';
import cartsRouter from './src/routes/carts.routes.js';

const app = express();
const PORT = 8080;

app.use(express.json());

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para la raíz
app.get('/', (req, res) => {
  res.send('<h1>Bienvenido a la API de Ecommerce</h1><p>Usa las rutas <code>/api/products</code> y <code>/api/carts</code> para interactuar con los productos y carritos.</p>');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
