import { db, Order, getNextId } from '../db.js';

export const OrdersService = {
  getAll: () => db.orders,

  getById: (id) => db.orders.find((o) => o.id === id),

  create: ({ userId, productIds, totalPrice }) => {
    const id = getNextId(db.orders);
    const newOrder = new Order(id, userId, productIds, totalPrice);
    db.orders.push(newOrder);
    return newOrder;
  },

  update: (id, { userId, productIds, totalPrice }) => {
    const index = db.orders.findIndex((o) => o.id === id);
    if (index === -1) return null;

    const updatedOrder = new Order(id, userId, productIds, totalPrice);
    db.orders[index] = updatedOrder;
    return updatedOrder;
  },

  delete: (id) => {
    const index = db.orders.findIndex((o) => o.id === id);
    if (index === -1) return null;

    const [deletedOrder] = db.orders.splice(index, 1);
    return deletedOrder;
  }
};