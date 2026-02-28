import React from 'react';
import { MessageSquare, Plus, Trash2, X } from 'lucide-react';
import { ChatSession } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import AdBanner from './AdBanner';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-100 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-full flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / New Chat */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between gap-2">
          <button
            onClick={onNewChat}
            className="flex-1 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-lg transition-colors border border-slate-700 text-sm font-medium"
          >
            <Plus size={16} />
            Novo Chat
          </button>
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="text-xs font-semibold text-slate-500 px-3 py-2 uppercase tracking-wider">
            Histórico
          </div>
          
          {sessions.length === 0 ? (
            <div className="text-slate-500 text-sm px-3 py-2 italic">
              Nenhum histórico ainda.
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors group relative ${
                  currentSessionId === session.id
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <MessageSquare size={16} className="shrink-0" />
                <span className="truncate text-left flex-1 pr-6">
                  {session.title || 'Novo Ofício'}
                </span>
                
                {/* Delete Button (visible on hover or active) */}
                <div 
                  onClick={(e) => onDeleteSession(session.id, e)}
                  className={`absolute right-2 p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ${
                    currentSessionId === session.id ? 'opacity-100' : ''
                  }`}
                >
                  <Trash2 size={14} />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Permanent Ad Banner in Sidebar */}
        <div className="px-4 py-4 border-t border-slate-800">
          <AdBanner className="bg-slate-800 border-slate-700" />
        </div>

        {/* User / Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
              US
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Usuário</p>
              <p className="text-xs text-slate-400 truncate">OfícioGen AI</p>
            </div>
          </div>
          <div className="px-2">
            <p className="text-[10px] text-slate-500">By Tony</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
