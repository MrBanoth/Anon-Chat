import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  isGuest: boolean;
  isPremium: boolean;
  avatarColor: string;
  createdAt: Date;
  gender?: 'male' | 'female';
  preferredGender?: 'male' | 'female' | 'any';
  email?: string;
  avatarUrl?: string;
  bio?: string;
  status?: 'online' | 'away' | 'offline';
  lastSeen?: Date;
  subscriptionStart?: string | null;
  subscriptionEnd?: string | null;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
  isVanished?: boolean;
  vanishAfter?: number;
}

export interface Chat {
  id: string;
  participants: string[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isGuest: boolean;
  isPremium: boolean;
  updateProfile: (data: Partial<User>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
}

export interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  gender?: 'male' | 'female';
  preferredGender?: 'male' | 'female' | 'any';
  bio?: string;
  avatarUrl?: string;
}

export enum SubscriptionPlan {
  FREE = 'free',
  PREMIUM = 'premium'
}

export interface Subscription {
  plan: SubscriptionPlan;
  price: number;
  currency: string;
  features: string[];
}

export interface PaymentMethod {
  type: 'card' | 'upi';
  details: {
    cardNumber?: string;
    upiId?: string;
  };
}