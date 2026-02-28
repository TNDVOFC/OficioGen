/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import AdBanner from './components/AdBanner';
import AdWallModal from './components/AdWallModal';
import { ChatSession, Message } from './types';
import { loadChats, saveChats, createNewChat } from './services/chatStorage';
import { generateOficioFromPrompt } from './services/gemini';

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Ad Wall State
  const [isAdWallOpen, setIsAdWallOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  // Load chats on mount
  useEffect(() => {
    const loadedChats = loadChats();
    setSessions(loadedChats);
    
    if (loadedChats.length > 0) {
      setCurrentSessionId(loadedChats[0].id);
    } else {
      createNewSession();
    }
  }, []);

  // Save chats whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      saveChats(sessions);
    }
  }, [sessions]);

  const createNewSession = () => {
    const newChat = createNewChat();
    setSessions(prev => [newChat, ...prev]);
    setCurrentSessionId(newChat.id);
    setIsSidebarOpen(false); // Close sidebar on mobile when creating new chat
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    saveChats(newSessions); // Force save immediately

    if (currentSessionId === id) {
      if (newSessions.length > 0) {
        setCurrentSessionId(newSessions[0].id);
      } else {
        createNewSession();
      }
    }
  };

  const handleSendMessage = (content: string) => {
    if (!currentSessionId) return;

    // Trigger Ad Wall before generating
    setPendingMessage(content);
    setIsAdWallOpen(true);
  };

  const executeGeneration = async () => {
    if (!currentSessionId || !pendingMessage) return;
    
    const content = pendingMessage;
    setIsAdWallOpen(false);
    setPendingMessage(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    // Update state optimistically
    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        // Generate a title if it's the first message
        const title = session.messages.length === 0 
          ? (content.length > 30 ? content.substring(0, 30) + '...' : content)
          : session.title;
          
        return {
          ...session,
          title,
          messages: [...session.messages, userMessage],
          updatedAt: Date.now()
        };
      }
      return session;
    }));

    setIsGenerating(true);

    try {
      const responseText = await generateOficioFromPrompt(content);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now()
      };

      setSessions(prev => prev.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, botMessage],
            updatedAt: Date.now()
          };
        }
        return session;
      }));

    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={(id) => {
          setCurrentSessionId(id);
          setIsSidebarOpen(false);
        }}
        onNewChat={createNewSession}
        onDeleteSession={deleteSession}
      />

      <main className="flex-1 flex flex-col h-full relative w-full">
        {/* Ad Banner */}
        <div className="bg-slate-50 px-4 pt-2 shrink-0">
          <AdBanner className="bg-white" />
        </div>

        <ChatInterface
          messages={currentSession?.messages || []}
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />
      </main>

      <AdWallModal 
        isOpen={isAdWallOpen} 
        onClose={() => setIsAdWallOpen(false)}
        onComplete={executeGeneration}
      />
    </div>
  );
}

