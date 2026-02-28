import React, { useRef, useEffect, useState } from 'react';
import { Send, User, Bot, Copy, Check, Sparkles, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isGenerating: boolean;
  onToggleSidebar: () => void;
}

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
    className="flex gap-4 max-w-3xl mx-auto w-full"
  >
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
      <Bot size={16} />
    </div>
    <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
      <motion.div
        className="w-2 h-2 bg-slate-400 rounded-full"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 bg-slate-400 rounded-full"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 bg-slate-400 rounded-full"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
    </div>
  </motion.div>
);

export default function ChatInterface({ 
  messages, 
  onSendMessage, 
  isGenerating,
  onToggleSidebar
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isGenerating) return;
    
    onSendMessage(input);
    setInput('');
    
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-3 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <button 
            onClick={onToggleSidebar}
            className="p-2 -ml-1 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors active:scale-95"
          >
            <Menu size={20} />
          </button>
          <span className="font-bold text-slate-800 text-sm tracking-tight">OfícioGen AI</span>
        </div>
        <div className="w-8" /> {/* Spacer for balance */}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-6 scroll-smooth pb-4">
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60"
          >
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 border border-slate-100">
              <Bot size={32} className="text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Como posso ajudar?</h3>
            <p className="max-w-xs text-sm text-slate-500 leading-relaxed">
              Peça para eu criar ofícios, memorandos ou revisar seus textos.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence initial={false} mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex gap-3 md:gap-4 max-w-3xl mx-auto w-full ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mt-1 ${
                  msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Message Content */}
                <div className={`flex flex-col max-w-[85%] md:max-w-[90%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`prose prose-sm md:prose-base prose-slate max-w-none rounded-2xl px-4 py-3 shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none prose-invert' 
                      : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap m-0 leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                  
                  {/* Actions for Assistant Messages */}
                  {msg.role === 'assistant' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mt-2"
                    >
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-indigo-700 hover:text-indigo-800 transition-colors bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg border border-indigo-100 shadow-sm active:scale-95"
                      >
                        {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                        {copiedId === msg.id ? 'Copiado!' : 'Copiar Texto'}
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isGenerating && (
              <div className="flex gap-3 md:gap-4 max-w-3xl mx-auto w-full">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm mt-1">
                  <Bot size={14} />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5 h-10">
                  <motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                  <motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                </div>
              </div>
            )}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] pb-safe">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all shadow-sm p-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-transparent text-slate-900 text-sm md:text-base block w-full p-3 outline-none resize-none max-h-[150px] min-h-[44px] placeholder:text-slate-400"
              disabled={isGenerating}
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="mb-1 mr-1 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow active:scale-95 shrink-0 flex items-center justify-center w-10 h-10"
            >
              {isGenerating ? <Sparkles size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
          <div className="mt-2 text-center hidden md:block">
            <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              O OfícioGen pode cometer erros. Verifique as informações.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
