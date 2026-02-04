import React, { useState, useRef, useEffect } from 'react';
import { generateBusinessInsight } from '../services/geminiService';
import { Product, Transaction } from '../types';
import { Bot, Send, Sparkles, User, Loader2, MessageSquare, BrainCircuit, Lightbulb, Zap, Info, ChevronRight } from 'lucide-react';

interface AIProps {
  products: Product[];
  transactions: Transaction[];
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export const AIAssistant: React.FC<AIProps> = ({ products, transactions }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Halo! Saya asisten bisnis pintar Anda. Tanyakan saya tentang performa penjualan, saran promosi, atau analisis stok barang.',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateBusinessInsight(transactions, products, userMsg.text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Maaf, terjadi kesalahan saat memproses permintaan Anda.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    { text: "Berapa penjualan hari ini?", icon: <Zap size={14} />, color: "text-amber-500 bg-amber-50" },
    { text: "Produk paling laris?", icon: <Sparkles size={14} />, color: "text-brand-500 bg-brand-50" },
    { text: "Ide promosi kopi?", icon: <Lightbulb size={14} />, color: "text-emerald-500 bg-emerald-50" },
    { text: "Analisis stok aman?", icon: <Info size={14} />, color: "text-indigo-500 bg-indigo-50" }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-200/50 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-100/30 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <div className="p-8 pb-6 glass-dark border-b border-white/20 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-500/40 border border-brand-400 group overflow-hidden">
                <BrainCircuit className="text-white relative z-10" size={28} />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-600 to-accent-500 opacity-50" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-0.5">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display">Neural Assistant</h2>
                <div className="px-2 py-0.5 bg-brand-50 text-brand-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-brand-100">Pro</div>
              </div>
              <div className="flex items-center space-x-3 text-slate-500 text-xs font-bold">
                <span className="flex items-center space-x-1">
                  <Zap size={12} className="text-amber-500 fill-amber-500" />
                  <span>Gemini 2.0 Engine</span>
                </span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>Real-time Analytics</span>
              </div>
            </div>
          </div>
          <button className="p-3 bg-white/50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all border border-white/40 shadow-sm">
            <MessageSquare size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-8 relative z-10">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`flex max-w-[85%] lg:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-4`}>
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg border-2 ${msg.sender === 'user'
                  ? 'bg-white text-slate-400 border-white'
                  : 'bg-slate-900 text-white border-slate-800'
                }`}>
                {msg.sender === 'user' ? <User size={18} strokeWidth={2.5} /> : <Bot size={18} strokeWidth={2.5} />}
              </div>
              <div className={`relative space-y-2 group`}>
                <div className={`p-6 rounded-[2rem] text-sm leading-[1.8] shadow-xl ${msg.sender === 'user'
                    ? 'bg-white text-slate-700 rounded-tr-none border border-slate-100'
                    : 'bg-slate-900 text-white rounded-tl-none border border-slate-800'
                  }`}>
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-3' : ''}>{line}</p>
                  ))}
                </div>
                <div className={`flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span>{msg.sender === 'user' ? 'Acknowledged' : 'Insights Engine'}</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full" />
                  <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center border-2 border-slate-800">
                <Bot size={18} strokeWidth={2.5} />
              </div>
              <div className="bg-slate-900 p-6 rounded-[2rem] rounded-tl-none shadow-2xl border border-slate-800 flex items-center space-x-4">
                <div className="flex space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-sm text-slate-400 font-bold tracking-tight">Menganalisis data transaksi...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length < 3 && !isLoading && (
        <div className="px-8 py-3 bg-transparent flex gap-3 overflow-x-auto no-scrollbar relative z-10">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setInput(q.text)}
              className={`flex items-center space-x-2 px-5 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-wider text-slate-600 hover:text-brand-600 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100/50 hover:-translate-y-0.5 transition-all whitespace-nowrap group shrink-0`}
            >
              <div className={`p-1.5 rounded-lg ${q.color}`}>
                {q.icon}
              </div>
              <span>{q.text}</span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-8 pt-4 bg-white/40 backdrop-blur-xl border-t border-white/40 relative z-10">
        <div className="relative flex items-center group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik instruksi atau pertanyaan bisnis Anda..."
            className="w-full pl-6 pr-16 py-5 bg-white border border-slate-100 rounded-[2.5rem] focus:ring-4 focus:ring-brand-50 focus:border-brand-200 focus:outline-none resize-none text-[15px] font-bold text-slate-900 placeholder-slate-300 shadow-xl shadow-slate-200/50 transition-all no-scrollbar"
            rows={1}
            style={{ minHeight: '64px', maxHeight: '150px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-4 bg-slate-900 text-white rounded-full hover:bg-brand-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 shadow-xl group"
          >
            <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
        <div className="flex items-center justify-center space-x-4 mt-4">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[4px]">
            AI Powered Insight Engine
          </p>
          <div className="w-1 h-1 bg-slate-200 rounded-full" />
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[4px]">
            Secure Data Processing
          </p>
        </div>
      </div>
    </div>
  );
};