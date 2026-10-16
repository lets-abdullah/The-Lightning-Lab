'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    {
      sender: 'bot',
      text: 'Hi there! Welcome to The Lightning Lab. How can our commercial & residential lighting specialists assist you today?'
    }
  ]);
  const [input, setInput] = useState('');

  const quickReplies = [
    { label: '📦 Shipping info', reply: 'Orders $99+ ship free within 1 business day across the US!' },
    { label: '💰 Bulk discount', reply: 'Bulk discounts are auto-calculated at checkout! Save up to 15% on commercial orders.' },
    { label: '⚡ DLC Warranty', reply: 'Our fixtures are DLC 5.1 Premium certified with full 5-year replacement warranties.' },
    { label: '📞 Direct support', reply: 'Call our direct contractor desk at (470)-939-0782 (Mon-Fri 8am-6pm EST).' }
  ];

  const handleQuickReply = (label: string, reply: string) => {
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: label },
      { sender: 'bot', text: reply }
    ]);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    setTimeout(() => {
      let replyText = 'Thanks for your inquiry! A lighting specialist has received your message and will follow up shortly. For immediate contractor quotes, call (470)-939-0782.';
      const lower = userText.toLowerCase();
      if (lower.includes('ship') || lower.includes('delivery')) {
        replyText = 'We offer Free Shipping on orders over $99! Items ship within 24 business hours from our Atlanta, GA warehouse.';
      } else if (lower.includes('discount') || lower.includes('coupon') || lower.includes('code') || lower.includes('10%')) {
        replyText = 'Use coupon code SAVE10LED at checkout to get an instant 10% discount on your order!';
      } else if (lower.includes('panel') || lower.includes('troffer') || lower.includes('cct')) {
        replyText = 'Our 2x4 and 2x2 flat panels feature 5CCT selectable color temperatures (3000K-6500K) and 0-10V dimming drivers.';
      }
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: replyText
        }
      ]);
    }, 600);
  };

  return (
    <>
      {/* Floating Pill Button matching screenshots */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#2e3440] hover:bg-[#232731] text-white px-4 py-2.5 rounded-full flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all cursor-pointer font-bold text-sm tracking-wide active:scale-95 border border-white/10"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          <span>Chat</span>
        </button>
      </div>

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#8B1812] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h4 className="font-extrabold text-sm">The Lightning Lab Live Support</h4>
                <p className="text-[11px] text-white/80">Typically replies in under 1 minute</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 h-72 overflow-y-auto space-y-3 bg-gray-50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-[#8B1812] text-white rounded-br-xs'
                      : 'bg-white text-gray-800 border border-gray-200 shadow-xs rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Reply Chips */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickReplies.map((qr) => (
              <button
                key={qr.label}
                type="button"
                onClick={() => handleQuickReply(qr.label, qr.reply)}
                className="text-[11px] whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer"
              >
                {qr.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-gray-200 flex items-center gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about fixtures, spec sheets..."
              className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8B1812]"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-[#8B1812] text-white flex items-center justify-center hover:bg-[#70130e] transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
