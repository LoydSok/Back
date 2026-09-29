export class User {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

export class Product {
  constructor(id, title, price) {
    this.id = id;
    this.title = title;
    this.price = price;
  }
}

export class Order {
  constructor(id, userId, productIds, totalPrice) {
    this.id = id;
    this.userId = userId;
    this.productIds = productIds;
    this.totalPrice = totalPrice;
  }
}

export const db = {
  users: [
    new User(1, 'Иван', 'ivan@example.com', 'Password123'),
    new User(2, 'Мария', 'maria@example.com', 'Password123')
  ],
  products: [
    new Product(1, 'Ноутбук', 50000),
    new Product(2, 'Мышь', 1500)
  ],
  orders: [
    new Order(1, 1, [1, 2], 51500)
  ]
};

export const getNextId = (items) => (items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1);