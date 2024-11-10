import express from 'express';
import productRoutes from './routes/products.routes.js';
import cartRoutes from './routes/carts.js';

const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Ecommerce. Utiliza /api/products o /api/carts para acceder a los datos.');
});


// Configuración de rutas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
