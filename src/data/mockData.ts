import { Order, Offer, Notification } from '../types';

// Mock данные для демонстрации
export const mockOrders: Order[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Nike sneakers',
    description: 'Looking for quality Nike sneakers for running, size 42, black color',
    filters: {
      price: { min: 5000, max: 15000 },
      color: 'black',
      size: '42'
    },
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    offers: []
  },
  {
    id: '2',
    userId: 'user2',
    title: 'iPhone smartphone',
    description: 'Need an iPhone in good condition, no older than 2 years',
    filters: {
      price: { min: 30000, max: 80000 },
      color: 'any'
    },
    status: 'active',
    createdAt: '2024-01-14T15:30:00Z',
    offers: []
  },
  {
    id: '3',
    userId: 'user3',
    title: 'Winter jacket',
    description: 'Warm winter jacket for men, size L, dark color',
    filters: {
      price: { min: 3000, max: 12000 },
      color: 'dark',
      size: 'L'
    },
    status: 'active',
    createdAt: '2024-01-13T09:15:00Z',
    offers: []
  }
];

export const mockOffers: Offer[] = [
  {
    id: '1',
    orderId: '1',
    manufacturerId: 'man1',
    manufacturerUsername: 'sport_shop',
    price: 12000,
    description: 'Great Nike Air Max sneakers, practically new, worn 2 times',
    images: ['https://via.placeholder.com/300x200?text=Nike+Air+Max'],
    characteristics: 'Size: 42, Color: black, Condition: excellent',
    status: 'pending',
    createdAt: '2024-01-15T12:00:00Z'
  },
  {
    id: '2',
    orderId: '2',
    manufacturerId: 'man2',
    manufacturerUsername: 'tech_store',
    price: 45000,
    description: 'iPhone 13 in excellent condition, battery 95%, all functions work',
    images: ['https://via.placeholder.com/300x200?text=iPhone+13'],
    characteristics: 'Model: iPhone 13, Memory: 128GB, Color: blue, Condition: excellent',
    status: 'pending',
    createdAt: '2024-01-14T18:00:00Z'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user1',
    type: 'new_offer',
    title: 'New offer',
    message: 'Received a new offer for your order "Nike sneakers"',
    orderId: '1',
    offerId: '1',
    read: false,
    createdAt: '2024-01-15T12:00:00Z'
  },
  {
    id: '2',
    userId: 'user2',
    type: 'new_offer',
    title: 'New offer',
    message: 'Received a new offer for your order "iPhone smartphone"',
    orderId: '2',
    offerId: '2',
    read: false,
    createdAt: '2024-01-14T18:00:00Z'
  }
];

// Функции для работы с данными
export const getOrders = (): Order[] => {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : mockOrders;
};

export const saveOrders = (orders: Order[]): void => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const getOffers = (): Offer[] => {
  const offers = localStorage.getItem('offers');
  return offers ? JSON.parse(offers) : mockOffers;
};

export const saveOffers = (offers: Offer[]): void => {
  localStorage.setItem('offers', JSON.stringify(offers));
};

export const getNotifications = (userId: string): Notification[] => {
  const notifications = localStorage.getItem(`notifications_${userId}`);
  return notifications ? JSON.parse(notifications) : mockNotifications.filter(n => n.userId === userId);
};

export const saveNotifications = (userId: string, notifications: Notification[]): void => {
  localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
};
