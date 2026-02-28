export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface UserSubscription {
  plan: 'free' | 'pro';
  generationsCount: number;
  lastResetTimestamp: number; // Timestamp of the last weekly reset
}
