import ErrorManager from "./ErrorManager.js";
import { isValidID } from "../config/mongoose.config.js";
import CartModel from "../models/cart.models.js";
import ProductModel from "../models/product.model.js"; // Asegúrate de importar el modelo de producto

export default class CartManager {
    #cartModel;

    constructor() {
        this.#cartModel = CartModel;
    }

    async #findOneById(id) {
        if (!isValidID(id)) {
            throw new ErrorManager("ID inválido", 400);
        }

        const cart = await this.#cartModel.findById(id).populate("products.product");

        if (!cart) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return cart;
    }

    async getAll(params) {
        try {
            const paginationOptions = {
                limit: params?.limit || 10, 
                page: params?.page || 1, 
                populate: "products.product", 
                lean: true, 
            };

            return await this.#cartModel.paginate({}, paginationOptions);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async getOneById(id) {
        try {
            const cart = await this.#cartModel.findById(id).populate('products.product');
            if (!cart) {
                throw new ErrorManager("Carrito no encontrado", 404);
            }
            return cart;
        } catch (error) {
            throw new Error("Error al buscar el carrito: " + error.message);
        }
    }

    async insertOne(data) {
        try {
            const cart = await this.#cartModel.create(data);
            return cart;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async addOneProduct(cartId, productId) {
        try {
            const cart = await this.#findOneById(cartId); // Busca el carrito por ID
            const product = await ProductModel.findById(productId); // Busca el producto por ID

            if (!product) {
                throw new ErrorManager("ID no encontrado", 404); // Lanza un error si el producto no se encuentra
            }

            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId);

            if (productIndex >= 0) {
                cart.products[productIndex].quantity++; // Incrementa la cantidad si el producto ya está en el carrito
            } else {
                cart.products.push({ product: productId, quantity: 1 }); // Agrega el producto si no está en el carrito
            }

            await cart.save(); // Guarda los cambios en el carrito
            return cart; // Devuelve el carrito actualizado
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async updateCartById(cartId, products) {
        try {
            const cart = await this.#findOneById(cartId);
    
            if (!Array.isArray(products) || products.some(p => !p.product || !p.quantity)) {
                throw new ErrorManager("Formato de productos no válido", 400);
            }
    
            cart.products = products.map(p => ({
                product: p.product,
                quantity: p.quantity
            }));
    
            await cart.save();
    
            return cart;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }  
    
    async clearCart(id) {
        try {
            const cart = await this.#findOneById(id);
    
            if (!cart) {
                throw new ErrorManager("Carrito no encontrado", 404);
            }
    
            cart.products = []; // Vacía el array de productos
            await cart.save(); // Guarda los cambios en la base de datos
    
            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code || 500);
        }
    }
    
    async removeOneProduct(cartId, productId) {
        try {
            const cart = await this.#findOneById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");
    
            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);
            if (productIndex === -1) throw new Error("Producto no encontrado");
    
            cart.products.splice(productIndex, 1); // Elimina el producto
            await cart.save();
    
            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
}