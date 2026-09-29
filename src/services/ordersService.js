import { Order } from '../db.js';

export const OrdersService = {
  getAll: async () => await Order.findAll(),

  getById: async (id) => await Order.findByPk(id),

  create: async ({ userId, productIds, totalPrice }) => {
    return await Order.create({ userId, productIds, totalPrice });
  },

  update: async (id, { userId, productIds, totalPrice }) => {
    const order = await Order.findByPk(id);
    if (!order) return null;
    return await order.update({ userId, productIds, totalPrice });
  },

  delete: async (id) => {
    const order = await Order.findByPk(id);
    if (!order) return null;
    await order.destroy();
    return order;
  }
};