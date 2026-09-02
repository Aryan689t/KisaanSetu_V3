import React, { useState, useRef, useEffect } from 'react';
import { useDemo } from '../context/DemoContext';
import { Bot, X, Send, Sparkles, Wheat, RefreshCw, MessageSquare } from 'lucide-react';

export const KisanAIChat = () => {
  const { lang, t } = useDemo();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: lang === 'hi' 
        ? '🙏 **नमस्ते! मैं किसान एआई सहायक हूँ।**\nधान एमएसपी दरें, मंडी कतार स्थिति, चेक-इन दस्तावेज या नमी नियमों के बारे में मुझसे पूछें।'
        : '🙏 **Namaste! I am Kisan AI Sahayak.**\nAsk me about Paddy MSP rates, Mandi queue tracking, gate check-in documents, or moisture rules.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-4),
          lang
        })
      });

      const data = await response.json();
      const botReplyText = data.reply || (lang === 'hi' ? 'क्षमा करें, मैं आपका उत्तर संसाधित नहीं कर सका।' : 'Sorry, I could not process your query.');

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);

    } catch (err) {
      console.error('Chat API Error:', err);
      const errorMsg = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: lang === 'hi' 
          ? '🌾 **किसान एआई सहायक (ऑफलाइन):**\nधान (ग्रेड ए) एमएसपी: **₹2,200/क्विंटल**। गेट पर आधार, बैंक पासबुक व टोकन पास लाएं।' 
          : '🌾 **Kisan AI Sahayak (Offline):**\nPaddy Grade A MSP: **₹2,200/Quintal**. Bring Aadhaar, Bank Passbook, and Token Pass to Mandi gate.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickChips = [
    { label: lang === 'hi' ? '🌾 धान एमएसपी दर' : '🌾 Paddy MSP Rate', query: 'What is the Paddy MSP rate per quintal?' },
    { label: lang === 'hi' ? '📋 आवश्यक दस्तावेज' : '📋 Gate Documents', query: 'What documents are required at the Mandi gate?' },
    { label: lang === 'hi' ? '💧 नमी की सीमा' : '💧 Moisture Limit', query: 'What is the maximum allowed moisture percentage?' },
    { label: lang === 'hi' ? '⏱ भुगतान में समय' : '⏱ Payment SLA', query: 'How long does MSP bank DBT payout take?' }
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-agri-gold hover:bg-agri-gold-dark text-agri-green-dark p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center space-x-2 border-2 border-white transform hover:scale-105 transition-all group touch-target"
          title="Open Kisan AI Sahayak Chat"
        >
          <div className="relative">
            <Bot className="w-6 h-6 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
          </div>
          <span className="font-heading font-extrabold text-xs hidden sm:inline tracking-tight">
            Kisan AI Sahayak
          </span>
          <span className="bg-agri-green text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md font-mono hidden md:inline">
            Groq Llama-3.1
          </span>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl w-[90vw] sm:w-[380px] h-[520px] shadow-2xl border border-agri-green/20 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-agri-green text-white p-4 flex items-center justify-between border-b border-agri-green-dark">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-agri-gold text-agri-green-dark flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-heading font-bold text-sm text-white">
                    Kisan AI Sahayak
                  </h3>
                  <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.2 rounded font-mono font-bold">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-agri-ivory/80">
                  {lang === 'hi' ? 'DoCA आधिकारिक सहायक • Groq AI' : 'DoCA Official Assistant • Groq Llama 3.1'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-agri-ivory hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Query Chips */}
          <div className="bg-agri-ivory/60 p-2 border-b border-agri-green/10 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.query)}
                className="px-2.5 py-1 bg-white hover:bg-agri-gold/20 text-agri-text border border-agri-green/15 rounded-lg text-[10px] font-bold shrink-0 transition-all hover:border-agri-gold"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#FAF8F3]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs space-y-1 ${
                    msg.sender === 'user'
                      ? 'bg-agri-green text-white rounded-br-none shadow-sm'
                      : 'bg-white text-agri-text border border-agri-green/15 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </p>
                  <div className="flex items-center justify-between text-[9px] opacity-70 pt-1">
                    <span>{msg.time}</span>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-agri-green/15 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-2 text-xs text-agri-text-muted">
                  <Sparkles className="w-4 h-4 text-agri-gold animate-spin" />
                  <span>{lang === 'hi' ? 'उत्तर तैयार किया जा रहा है...' : 'Groq AI is thinking...'}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-agri-green/15 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={lang === 'hi' ? 'अपना प्रश्न पूछें (जैसे एमएसपी दर, नमी)...' : 'Ask any question (e.g. MSP rate, moisture)...'}
              className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-green"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2 bg-agri-green hover:bg-agri-green-dark text-white rounded-xl disabled:opacity-40 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
