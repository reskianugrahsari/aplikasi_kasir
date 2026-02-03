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
    image: 'C:/Users/Reski_Anugrah_Sari/.gemini/antigravity/brain/77943b5e-d5b6-4748-addf-eebb296013da/es_kopi_susu_aren_1770126071691.png',
    stock: 100,
  },
  {
    id: '3',
    name: 'Mie Goreng Jawa',
    price: 22000,
    category: Category.FOOD,
    image: 'C:/Users/Reski_Anugrah_Sari/.gemini/antigravity/brain/77943b5e-d5b6-4748-addf-eebb296013da/mie_goreng_jawa_1770126087783.png',
    stock: 40,
  },
  {
    id: '4',
    name: 'Teh Manis Dingin',
    price: 5000,
    category: Category.DRINK,
    image: 'C:/Users/Reski_Anugrah_Sari/.gemini/antigravity/brain/77943b5e-d5b6-4748-addf-eebb296013da/teh_manis_dingin_1770126115103.png',
    stock: 200,
  },
  {
    id: '5',
    name: 'Kentang Goreng',
    price: 15000,
    category: Category.SNACK,
    image: 'C:/Users/Reski_Anugrah_Sari/.gemini/antigravity/brain/77943b5e-d5b6-4748-addf-eebb296013da/kentang_goreng_1770126156570.png',
    stock: 80,
  },
  {
    id: '6',
    name: 'Roti Bakar Coklat',
    price: 12000,
    category: Category.DESSERT,
    image: 'C:/Users/Reski_Anugrah_Sari/.gemini/antigravity/brain/77943b5e-d5b6-4748-addf-eebb296013da/roti_bakar_coklat_1770126175308.png',
    stock: 30,
  },
  {
    id: '7',
    name: 'Burger Sapi',
    price: 35000,
    category: Category.FOOD,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=400&h=400',
    stock: 25,
  },
  {
    id: '8',
    name: 'Matcha Latte',
    price: 24000,
    category: Category.DRINK,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&h=400',
    stock: 45,
  },
];

export const MOCK_TRANSACTIONS = [
  // Generating some fake history for the dashboard to look good initially
  { id: 't1', date: new Date(Date.now() - 86400000 * 2).toISOString(), total: 150000, items: [], paymentMethod: 'cash' },
  { id: 't2', date: new Date(Date.now() - 86400000).toISOString(), total: 230000, items: [], paymentMethod: 'qris' },
  { id: 't3', date: new Date().toISOString(), total: 45000, items: [], paymentMethod: 'cash' },
];