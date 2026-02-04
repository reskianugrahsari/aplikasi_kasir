import React, { useState, useRef, useEffect } from 'react';
import { generateBusinessInsight } from '../services/geminiService';
import { Product, Transaction } from '../types';
import { Bot, Send, Sparkles, User, Loader2 } from 'lucide-react';

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
    "Bagaimana performa penjualan hari ini?",
    "Produk apa yang paling laris minggu ini?",
    "Buatkan ide promo untuk menu kopi.",
    "Apakah stok barang aman?"
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-gray-100 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <Sparkles className="text-indigo-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Asisten Bisnis AI</h2>
            <p className="text-sm text-gray-500">Didukung oleh Gemini 2.0 Flash</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-3`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                msg.sender === 'user' ? 'bg-gray-200' : 'bg-indigo-600'
              }`}>
                {msg.sender === 'user' ? <User size={16} className="text-gray-600" /> : <Bot size={16} className="text-white" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-white text-gray-800 rounded-tr-none' 
                  : 'bg-indigo-600 text-white rounded-tl-none'
              }`}>
                {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                ))}
                <span className={`text-[10px] mt-2 block opacity-70 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="flex space-x-3">
               <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                 <Bot size={16} className="text-white" />
               </div>
               <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
                 <Loader2 size={16} className="animate-spin text-indigo-600" />
                 <span className="text-sm text-gray-500">Sedang berpikir...</span>
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length < 3 && !isLoading && (
        <div className="px-6 py-2 bg-gray-50 flex gap-2 overflow-x-auto no-scrollbar">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setInput(q)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-colors whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pertanyaan Anda di sini..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-sm"
            rows={1}
            style={{ minHeight: '46px', maxHeight: '120px' }}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-center text-gray-400 mt-2">
          AI dapat melakukan kesalahan. Harap verifikasi informasi penting.
        </p>
      </div>
    </div>
  );
};