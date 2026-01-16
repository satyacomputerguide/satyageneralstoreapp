
import { Product } from './types';

export const STORE_NAME = 'Satya General Store';
export const WHATSAPP_NUMBER = '919876543210'; 

export const CATEGORIES = [
  'All',
  'Groceries',
  'Fruits & Veggies',
  'Dairy',
  'Personal Care',
  'Beverages'
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'G001',
    name: 'Basmati Rice',
    category: 'Groceries',
    price: 450.00,
    unit: '5 kg',
    description: 'Premium aged long grain basmati rice perfect for biryani.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 'G002',
    name: 'Cooking Oil',
    category: 'Groceries',
    price: 185.00,
    unit: '1 L',
    variant: 'Fortune Sunflower Oil',
    description: 'Pure refined sunflower oil for healthy everyday cooking.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 'F001',
    name: 'Fresh Apples',
    category: 'Fruits & Veggies',
    price: 160.00,
    unit: '1 kg',
    description: 'Crisp and sweet Kashmiri apples, handpicked for quality.',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 'D001',
    name: 'Fresh Milk',
    category: 'Dairy',
    price: 64.00,
    unit: '1 L',
    variant: 'Amul Gold',
    description: 'Farm fresh homogenized full cream milk.',
    image: 'https://images.unsplash.com/photo-1550583724-125581ecc278?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 'P001',
    name: 'Colgate Toothpaste',
    category: 'Personal Care',
    price: 95.00,
    unit: '200 g',
    description: 'Advanced dental protection with cooling crystals.',
    image: 'https://images.unsplash.com/photo-1559594864-18860347ef61?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 'B001',
    name: 'Orange Juice',
    category: 'Beverages',
    price: 110.00,
    unit: '1 L',
    description: 'Real fruit power - 100% natural orange juice.',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 'G003',
    name: 'Whole Wheat Flour',
    category: 'Groceries',
    price: 320.00,
    unit: '5 kg',
    variant: 'Aashirvaad Shudh Chakki',
    description: '100% pure chakki atta for soft and fluffy rotis.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 'D002',
    name: 'Butter',
    category: 'Dairy',
    price: 255.00,
    unit: '500 g',
    variant: 'Amul Pasteurized',
    description: 'The taste of India - delicious creamy salted butter.',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=400&h=300'
  }
];
