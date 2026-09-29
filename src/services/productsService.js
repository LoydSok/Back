import { Product } from '../db.js';

export const ProductsService = {
  getAll: async () => await Product.findAll(),

  getById: async (id) => await Product.findByPk(id),

  create: async ({ title, price }) => await Product.create({ title, price }),

  update: async (id, { title, price }) => {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return await product.update({ title, price });
  },

  delete: async (id) => {
    const product = await Product.findByPk(id);
    if (!product) return null;
    await product.destroy();
    return product;
  }
};