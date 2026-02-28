import { ChatSession, Message, UserSubscription } from '../types';

const STORAGE_KEY = 'oficiogen_chats';
const SUBSCRIPTION_KEY = 'oficiogen_subscription';

export const saveChats = (chats: ChatSession[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error('Failed to save chats:', error);
  }
};

export const loadChats = (): ChatSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load chats:', error);
    return [];
  }
};

export const createNewChat = (): ChatSession => {
  return {
    id: Date.now().toString(),
    title: 'Novo Ofício',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

// Subscription & Usage Logic

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const loadSubscription = (): UserSubscription => {
  try {
    const stored = localStorage.getItem(SUBSCRIPTION_KEY);
    const now = Date.now();
    
    if (stored) {
      const sub = JSON.parse(stored) as UserSubscription;
      
      // Check if a week has passed since the last reset
      if (now - sub.lastResetTimestamp > ONE_WEEK_MS) {
        const resetSub: UserSubscription = { 
          ...sub, 
          generationsCount: 0, 
          lastResetTimestamp: now 
        };
        saveSubscription(resetSub);
        return resetSub;
      }
      return sub;
    }
  } catch (error) {
    console.error('Failed to load subscription:', error);
  }

  // Default new user
  return {
    plan: 'free',
    generationsCount: 0,
    lastResetTimestamp: Date.now()
  };
};

export const saveSubscription = (sub: UserSubscription) => {
  try {
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(sub));
  } catch (error) {
    console.error('Failed to save subscription:', error);
  }
};

export const incrementUsage = (): UserSubscription => {
  const sub = loadSubscription();
  const updated: UserSubscription = { ...sub, generationsCount: sub.generationsCount + 1 };
  saveSubscription(updated);
  return updated;
};

export const upgradeToPro = (): UserSubscription => {
  const sub = loadSubscription();
  const updated: UserSubscription = { ...sub, plan: 'pro' };
  saveSubscription(updated);
  return updated;
};
