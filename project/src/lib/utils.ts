import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function formatMessageTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function getRandomName(): string {
  const adjectives = [
    'Happy', 'Silent', 'Clever', 'Brave', 'Calm', 'Eager', 
    'Gentle', 'Humble', 'Jolly', 'Kind', 'Lucky', 'Mighty', 
    'Noble', 'Polite', 'Quiet', 'Wise'
  ];
  
  const nouns = [
    'Tiger', 'Lotus', 'Mountain', 'River', 'Eagle', 'Peacock',
    'Elephant', 'Mango', 'Banyan', 'Dolphin', 'Falcon', 'Lion',
    'Cheetah', 'Oak', 'Sparrow', 'Jasmine'
  ];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective}${randomNoun}`;
}

export function simulateNetworkDelay(minMs = 300, maxMs = 800): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
}