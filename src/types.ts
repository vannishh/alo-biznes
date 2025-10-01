export interface User {
  id: string;
  username: string;
  role: 'buyer' | 'manufacturer' | 'both';
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  title: string;
  description: string;
  filters: {
    price?: {
      min?: number;
      max?: number;
    };
    color?: string;
    size?: string;
  };
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  offers?: Offer[];
}

export interface Offer {
  id: string;
  orderId: string;
  manufacturerId: string;
  manufacturerUsername: string;
  price: number;
  description: string;
  images: string[];
  characteristics: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'new_offer' | 'offer_accepted' | 'offer_rejected';
  title: string;
  message: string;
  orderId?: string;
  offerId?: string;
  read: boolean;
  createdAt: string;
}
