
export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  variant?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface DeliveryDetails {
  address: string;
  pincode: string;
  contact: string;
}

export enum MessageType {
  USER = 'user',
  BOT = 'bot'
}

export interface ChatMessage {
  type: MessageType;
  text: string;
  timestamp: Date;
}
