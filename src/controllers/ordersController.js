import { OrdersService } from '../services/ordersService.js';
import { validateOrderData } from '../utils/validators.js';

export const OrdersController = {
  getAll: (req, res) => {
    res.json(OrdersService.getAll());
  },

  getById: (req, res) => {
    const item = OrdersService.getById(Number(req.params.id));
    if (!item) return res.status(404).json({ message: 'Заказ не найден' });
    res.json(item);
  },

  create: (req, res) => {
    const error = validateOrderData(req.body);
    if (error) return res.status(400).json({ error });

    const newOrder = OrdersService.create(req.body);
    res.status(201).json(newOrder);
  },

  update: (req, res) => {
    const error = validateOrderData(req.body);
    if (error) return res.status(400).json({ error });

    const updatedOrder = OrdersService.update(Number(req.params.id), req.body);
    if (!updatedOrder) return res.status(404).json({ message: 'Заказ не найден' });

    res.json(updatedOrder);
  },

  delete: (req, res) => {
    const deletedOrder = OrdersService.delete(Number(req.params.id));
    if (!deletedOrder) return res.status(404).json({ message: 'Заказ не найден' });

    res.json({ message: 'Заказ успешно удален', deletedOrder });
  }
};