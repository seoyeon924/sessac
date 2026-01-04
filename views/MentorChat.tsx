
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { askMentor } from '../geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MentorChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "안녕하세요! 여러분의 시니어 BI 멘토 Sarah입니다. 태블로 계산식이나 복잡한 SQL 조인 때문에 고민 중이신가요? 무엇이든 물어보세요!" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await askMentor(userMsg);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto p-8 h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">AI 멘토 연구소</h2>
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Sarah 멘토 접속 중
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${
                m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-[80%] p-5 rounded-2xl text-sm leading-relaxed font-medium ${
                m.role === 'user' 
                  ? 'bg-indigo-50 text-indigo-900 rounded-tr-none' 
                  : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                {m.content.split('\n').map((line, idx) => (
                  <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{line}</p>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Bot size={20} />
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl rounded-tl-none border border-slate-100">
                <Loader2 size={20} className="animate-spin text-slate-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-100">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="태블로 LOD, SQL 최적화, 대시보드 디자인 등에 대해 질문하세요..."
              className="w-full pl-6 pr-16 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-slate-700 font-medium"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 w-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest w-full mb-1 ml-1 font-bold">추천 주제</p>
            {["태블로 LOD 마스터", "SQL 조인 최적화", "색상 팔레트 추천", "데이터 타입 구분"].map(topic => (
              <button 
                key={topic}
                onClick={() => setInput(`${topic}에 대해 설명해줘.`)}
                className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm font-bold"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorChat;
