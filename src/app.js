const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('http');
const exphbs = require('express-handlebars');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const ProductModel = require('./models/ProductModel');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configuración de Handlebars
const hbs = exphbs.create({
  defaultLayout: 'main',  // Usamos el layout principal
  extname: '.handlebars', 
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views'); // Aseguramos que las vistas se carguen desde la carpeta correcta

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src/public')); 

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Página principal
app.get('/', async (req, res) => {
  try {
    const products = await ProductModel.getAll(); // Obtén todos los productos
    console.log('Productos:', products); // Verifica que los productos se estén obteniendo correctamente

    // Si hay productos, los pasamos a la vista home.handlebars
    res.render('home', { products: products.length ? products : [] });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).send('Error al cargar los productos.');
  }
});

// Página de productos en tiempo real
app.get('/live-products', (req, res) => {
  res.render('liveProducts');
});

// WebSockets para comunicación en tiempo real
io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado');

  const products = await ProductModel.getAll();
  socket.emit('productList', products);

  socket.on('addProduct', async (data) => {
    try {
      await ProductModel.add(data);
      const updatedProducts = await ProductModel.getAll();
      io.emit('productList', updatedProducts);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });
});

// Iniciar el servidor
const PORT = 8080;
httpServer.listen(PORT, () => console.log(`Servidor activo en http://localhost:${PORT}`));
