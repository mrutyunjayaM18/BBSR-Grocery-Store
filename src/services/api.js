import products from '../data/products.json';
import orders from '../data/orders.json';
import users from '../data/users.json';

export const fetchProducts = async () => {
  return products;
};

export const fetchOrders = async () => {
  return orders;
};

export const fetchUsers = async () => {
  return users;
};
