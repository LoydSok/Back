import { db, Product, getNextId } from '../db.js';

export const ProductsService = {
  getAll: () => db.products,

  getById: (id) => db.products.find((p) => p.id === id),

  create: ({ title, price }) => {
    const id = getNextId(db.products);
    const newProduct = new Product(id, title, price);
    db.products.push(newProduct);
    return newProduct;
  },

  update: (id, { title, price }) => {
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updatedProduct = new Product(id, title, price);
    db.products[index] = updatedProduct;
    return updatedProduct;
  },

  delete: (id) => {
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const [deletedProduct] = db.products.splice(index, 1);
    return deletedProduct;
  }
};