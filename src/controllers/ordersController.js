import { OrdersService } from '../services/ordersService.js';
import { validateOrderData } from '../utils/validators.js';

export const OrdersController = {
  getAll: async (req, res) => {
    const orders = await OrdersService.getAll();
    res.json(orders);
  },

  getById: async (req, res) => {
    const item = await OrdersService.getById(Number(req.params.id));
    if (!item) return res.status(404).json({ message: 'Заказ не найден' });
    res.json(item);
  },

  create: async (req, res) => {
    const error = validateOrderData(req.body);
    if (error) return res.status(400).json({ error });

    const newOrder = await OrdersService.create(req.body);
    res.status(201).json(newOrder);
  },

  update: async (req, res) => {
    const error = validateOrderData(req.body);
    if (error) return res.status(400).json({ error });

    const updatedOrder = await OrdersService.update(Number(req.params.id), req.body);
    if (!updatedOrder) return res.status(404).json({ message: 'Заказ не найден' });

    res.json(updatedOrder);
  },

  delete: async (req, res) => {
    const deletedOrder = await OrdersService.delete(Number(req.params.id));
    if (!deletedOrder) return res.status(404).json({ message: 'Заказ не найден' });

    res.json({ message: 'Заказ успешно удален', deletedOrder });
  }
};