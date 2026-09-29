import { ProductsService } from '../services/productsService.js';
import { validateProductData } from '../utils/validators.js';

export const ProductsController = {
  getAll: (req, res) => {
    res.json(ProductsService.getAll());
  },

  getById: (req, res) => {
    const item = ProductsService.getById(Number(req.params.id));
    if (!item) return res.status(404).json({ message: 'Товар не найден' });
    res.json(item);
  },

  create: (req, res) => {
    const error = validateProductData(req.body);
    if (error) return res.status(400).json({ error });

    const newProduct = ProductsService.create(req.body);
    res.status(201).json(newProduct);
  },

  update: (req, res) => {
    const error = validateProductData(req.body);
    if (error) return res.status(400).json({ error });

    const updatedProduct = ProductsService.update(Number(req.params.id), req.body);
    if (!updatedProduct) return res.status(404).json({ message: 'Товар не найден' });

    res.json(updatedProduct);
  },

  delete: (req, res) => {
    const deletedProduct = ProductsService.delete(Number(req.params.id));
    if (!deletedProduct) return res.status(404).json({ message: 'Товар не найден' });

    res.json({ message: 'Товар успешно удален', deletedProduct });
  }
};