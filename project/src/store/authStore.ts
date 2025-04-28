import { create } from 'zustand';
import { generateRandomId, getRandomName } from '../lib/utils';
import { AuthState, User } from '../types';

// Function to generate a random avatar color
const getRandomColor = () => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const savedUser = localStorage.getItem('user');
const initialUser = savedUser ? JSON.parse(savedUser) : null;

export const useAuthStore = create<
  AuthState & {
    login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
    signup: (name: string, email: string, password: string) => Promise<boolean>;
    enterAsGuest: () => void;
    logout: () => void;
    upgradeToPremuim: () => void;
    updateProfile: (data: Partial<User>) => Promise<void>;
    uploadAvatar: (file: File) => Promise<string>;
  }
>((set) => ({
  user: initialUser,
  isLoggedIn: initialUser !== null,
  isGuest: false,
  isPremium: false,


  // Mock login functionality
  login: async (email, password, rememberMe = false) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // In a real app, you would validate credentials against a backend
    if (email && password) {
      const user: User = {
        id: generateRandomId(),
        name: email.split('@')[0],
        isGuest: false,
        isPremium: false,
        avatarColor: getRandomColor(),
        createdAt: new Date(),
        subscriptionStart: null,
        subscriptionEnd: null,
      };
      
      set({ user, isLoggedIn: true, isGuest: false, isPremium: false });
      
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
      
      return true;
    }
    return false;
  },


  // Mock signup functionality
  signup: async (name, email, password) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // In a real app, you would register the user in a backend
    if (name && email && password) {
      const user: User = {
        id: generateRandomId(),
        name,
        isGuest: false,
        isPremium: false,
        avatarColor: getRandomColor(),
        createdAt: new Date(),
        subscriptionStart: null,
        subscriptionEnd: null,
      };
      
      set({ user, isLoggedIn: true, isGuest: false, isPremium: false });
      return true;
    }
    return false;
  },


  // Enter as guest
  enterAsGuest: () => {
    const guestUser: User = {
      id: generateRandomId(),
      name: getRandomName(),
      isGuest: true,
      isPremium: false,
      avatarColor: getRandomColor(),
      createdAt: new Date(),
      subscriptionStart: null,
      subscriptionEnd: null,
    };
    
    set({ user: guestUser, isLoggedIn: true, isGuest: true, isPremium: false });
  },


  // Logout
  logout: () => {
    set({ user: null, isLoggedIn: false, isGuest: false, isPremium: false });
  },

  // Upgrade to premium
  upgradeToPremium: (months = 1) => {
    const now = new Date();
    const subscriptionStart = now.toISOString();
    const subscriptionEnd = new Date(now.setMonth(now.getMonth() + months)).toISOString();

    set((state) => ({
      isPremium: true,
      user: state.user
        ? { ...state.user, isPremium: true, subscriptionStart, subscriptionEnd }
        : null,
    }));

    const updatedUser = get().user;
    if (updatedUser) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  },

  updateProfile: async (data: Partial<User>) => {
    const user = get().user;
    if (!user) return;
    const updatedUser = { ...user, ...data };
    set({ user: updatedUser });
    localStorage.setItem('user', JSON.stringify(updatedUser));
  },

  uploadAvatar: async (file: File): Promise<string> => {
    const user = get().user;
    if (!user) throw new Error('User not logged in');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  },
}));
