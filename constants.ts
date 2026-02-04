import { Product, Category } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Nasi Goreng Spesial',
    price: 25000,
    category: Category.FOOD,
    image: '/photo.jpg',
    stock: 50,
  },
  {
    id: '2',
    name: 'Es Kopi Susu Gula Aren',
    price: 18000,
    category: Category.DRINK,
    image: '/kopi.png',
    stock: 100,
  },
  {
    id: '3',
    name: 'Mie Goreng Jawa',
    price: 22000,
    category: Category.FOOD,
    image: '/mie.png',
    stock: 40,
  },
  {
    id: '4',
    name: 'Teh Manis Dingin',
    price: 5000,
    category: Category.DRINK,
    image: '/teh.png',
    stock: 200,
  },
  {
    id: '5',
    name: 'Kentang Goreng',
    price: 15000,
    category: Category.SNACK,
    image: '/kentang.png',
    stock: 80,
  },
  {
    id: '6',
    name: 'Roti Bakar Coklat',
    price: 12000,
    category: Category.DESSERT,
    image: '/roti.png',
    stock: 30,
  },
  {
    id: '7',
    name: 'Burger Sapi',
    price: 35000,
    category: Category.FOOD,
    image: '/burger.png',
    stock: 25,
  },
  {
    id: '8',
    name: 'Matcha Latte',
    price: 24000,
    category: Category.DRINK,
    image: '/matcha.png',
    stock: 45,
  },
];

export const MOCK_TRANSACTIONS = [
  // Generating some fake history for the dashboard to look good initially
  { id: 't1', date: new Date(Date.now() - 86400000 * 2).toISOString(), total: 150000, items: [], paymentMethod: 'cash' },
  { id: 't2', date: new Date(Date.now() - 86400000).toISOString(), total: 230000, items: [], paymentMethod: 'qris' },
  { id: 't3', date: new Date().toISOString(), total: 45000, items: [], paymentMethod: 'cash' },
];