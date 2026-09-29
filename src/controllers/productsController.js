import { ProductsService } from '../services/productsService.js';
import { validateProductData } from '../utils/validators.js';

export const ProductsController = {
  getAll: async (req, res) => {
    const products = await ProductsService.getAll();
    res.json(products);
  },

  getById: async (req, res) => {
    const item = await ProductsService.getById(Number(req.params.id));
    if (!item) return res.status(404).json({ message: 'Товар не найден' });
    res.json(item);
  },

  create: async (req, res) => {
    const error = validateProductData(req.body);
    if (error) return res.status(400).json({ error });

    const newProduct = await ProductsService.create(req.body);
    res.status(201).json(newProduct);
  },

  update: async (req, res) => {
    const error = validateProductData(req.body);
    if (error) return res.status(400).json({ error });

    const updatedProduct = await ProductsService.update(Number(req.params.id), req.body);
    if (!updatedProduct) return res.status(404).json({ message: 'Товар не найден' });

    res.json(updatedProduct);
  },

  delete: async (req, res) => {
    const deletedProduct = await ProductsService.delete(Number(req.params.id));
    if (!deletedProduct) return res.status(404).json({ message: 'Товар не найден' });

    res.json({ message: 'Товар успешно удален', deletedProduct });
  }
};