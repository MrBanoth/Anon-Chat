import { create } from 'zustand';
import { generateRandomId, simulateNetworkDelay } from '../lib/utils';
import { Chat, User } from '../types';
import { socket } from '../lib/socket';

// Combine both Message interfaces
interface Message {
  id: string;
  senderId: string;
  text?: string;
  content?: string;
  timestamp: Date | number;
  isRead?: boolean;
}

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  isLoading: boolean;
  isTyping: boolean;
  onlineUsers: string[];
  randomUser: User | null;
  // Add socket-related state
  messages: Message[];
  isConnected: boolean;
}

interface ChatActions {
  initializeChat: (currentUserId: string) => Promise<void>;
  sendMessage: (senderId: string, text: string) => Promise<void>;
  setCurrentChat: (chatId: string) => void;
  markMessagesAsRead: (chatId: string, userId: string) => void;
  endChat: () => void;
  findNewChat: (currentUserId: string) => Promise<void>;
  // Add socket-related actions
  connect: (userId: string) => void;
  disconnect: () => void;
  setTyping: (typing: boolean) => void;
  sendSocketMessage: (content: string) => void;
}

// Mock random users for chat pairing
const randomUsers: User[] = [
  {
    id: 'user1',
    name: 'NimbleUnicorn',
    isGuest: true,
    isPremium: false,
    avatarColor: 'bg-blue-500',
    createdAt: new Date(),
  },
  {
    id: 'user2',
    name: 'WiseElephant',
    isGuest: false,
    isPremium: true,
    avatarColor: 'bg-purple-500',
    createdAt: new Date(),
  },
  {
    id: 'user3',
    name: 'SwiftFalcon',
    isGuest: true,
    isPremium: false,
    avatarColor: 'bg-green-500',
    createdAt: new Date(),
  },
  {
    id: 'user4',
    name: 'BraveTiger',
    isGuest: false,
    isPremium: true,
    avatarColor: 'bg-pink-500',
    createdAt: new Date(),
  },
];

// Single export of the store with combined functionality
export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
  chats: [],
  currentChatId: null,
  isLoading: false,
  isTyping: false,
  onlineUsers: randomUsers.map(user => user.id),
  randomUser: null,
  messages: [],
  isConnected: false,

  // Socket-related methods
  connect: (userId: string) => {
    socket.auth = { userId };
    socket.connect();

    socket.on('message', (message: Message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    socket.on('typing', (isTyping: boolean) => {
      set({ isTyping });
    });

    socket.on('online-users', (onlineUserIds: string[]) => {
      set({ onlineUsers: onlineUserIds });
    });

    socket.on('connect', () => {
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false, onlineUsers: [] });
    });
  },

  disconnect: () => {
    socket.disconnect();
    set({ messages: [], isConnected: false, onlineUsers: [] });
  },

  sendSocketMessage: (content: string) => {
    if (!socket.connected) return;

    const message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'current-user', // You'll need to set this properly
      content,
      timestamp: Date.now(),
    };

    socket.emit('message', message);
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  // Original methods
  initializeChat: async (currentUserId) => {
    set({ isLoading: true });
    
    await simulateNetworkDelay(800, 1500);
    
    // Select a random user to chat with
    const availableUsers = randomUsers.filter(user => user.id !== currentUserId);
    const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
    
    // Create a new chat
    const newChat: Chat = {
      id: generateRandomId(),
      participants: [currentUserId, randomUser.id],
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };
    
    set((state) => ({
      chats: [...state.chats, newChat],
      currentChatId: newChat.id,
      isLoading: false,
      randomUser,
    }));
    
    // Simulate the random user sending a greeting message after a delay
    setTimeout(async () => {
      const greetings = [
        "Hi there! How are you doing today?",
        "Hello! Nice to meet you!",
        "Hey! What's up?",
        "Namaste! How's your day going?",
        "Hi! Looking forward to chatting with you!"
      ];
      
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      
      set({ isTyping: true });
      await simulateNetworkDelay(1000, 2000);
      
      const newMessage: Message = {
        id: generateRandomId(),
        senderId: randomUser.id,
        text: randomGreeting,
        timestamp: new Date(),
        isRead: false,
      };
      
      set((state) => {
        const updatedChats = state.chats.map(chat => {
          if (chat.id === state.currentChatId) {
            return {
              ...chat,
              messages: [...chat.messages, newMessage],
              updatedAt: new Date(),
            };
          }
          return chat;
        });
        
        return {
          chats: updatedChats,
          isTyping: false,
        };
      });
    }, 2000);
  },

  sendMessage: async (senderId, text) => {
    const { currentChatId } = get();
    if (!currentChatId || !text.trim()) return;
    
    const newMessage: Message = {
      id: generateRandomId(),
      senderId,
      text,
      timestamp: new Date(),
      isRead: false,
    };
    
    set((state) => {
      const updatedChats = state.chats.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            updatedAt: new Date(),
          };
        }
        return chat;
      });
      
      return { chats: updatedChats };
    });
    
    // Simulate response after a delay
    const chance = Math.random();
    if (chance > 0.3) {
      setTimeout(async () => {
        const { randomUser } = get();
        if (!randomUser) return;
        
        set({ isTyping: true });
        await simulateNetworkDelay(1500, 3000);
        
        const responses = [
          "That's interesting! Tell me more.",
          "I see what you mean.",
          "Hmm, I haven't thought about it that way.",
          "Really? That's cool!",
          "Nice! What else is going on?",
          "I'm curious to know more about that.",
          "That sounds fun!",
          "Ah, I understand now.",
          "Great point!",
          "I agree with you on that."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMessage: Message = {
          id: generateRandomId(),
          senderId: randomUser.id,
          text: randomResponse,
          timestamp: new Date(),
          isRead: false,
        };
        
        set((state) => {
          const updatedChats = state.chats.map(chat => {
            if (chat.id === currentChatId) {
              return {
                ...chat,
                messages: [...chat.messages, responseMessage],
                updatedAt: new Date(),
              };
            }
            return chat;
          });
          
          return {
            chats: updatedChats,
            isTyping: false,
          };
        });
      }, 2000 + Math.random() * 2000);
    }
  },

  setCurrentChat: (chatId) => {
    set({ currentChatId: chatId });
  },

  markMessagesAsRead: (chatId, userId) => {
    set((state) => {
      const updatedChats = state.chats.map(chat => {
        if (chat.id === chatId) {
          const updatedMessages = chat.messages.map(message => {
            if (message.senderId !== userId && !message.isRead) {
              return { ...message, isRead: true };
            }
            return message;
          });
          
          return {
            ...chat,
            messages: updatedMessages,
          };
        }
        return chat;
      });
      
      return { chats: updatedChats };
    });
  },

  endChat: () => {
    set((state) => {
      const updatedChats = state.chats.map(chat => {
        if (chat.id === state.currentChatId) {
          return {
            ...chat,
            isActive: false,
          };
        }
        return chat;
      });
      
      return {
        chats: updatedChats,
        currentChatId: null,
        randomUser: null,
      };
    });
  },
  
  findNewChat: async (currentUserId) => {
    set({
      currentChatId: null,
      randomUser: null,
    });
    
    // Initialize a new chat with a random user
    await get().initializeChat(currentUserId);
  },
}));
