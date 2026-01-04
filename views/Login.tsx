
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ArrowRight, Loader2 } from 'lucide-react';
import { logToGoogleSheet } from '../googleSheetService';

interface LoginProps {
  onComplete: (user: { name: string; email: string; nickname: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onComplete }) => {
  // 처음부터 닉네임 입력 단계로 시작하도록 변경
  const [step, setStep] = useState<'nickname' | 'loading'>('nickname');
  // 가상의 사용자 정보 기본값 설정
  const [tempUser] = useState({ name: "SeSAC 교육생", email: "student@sesac.ac.kr" });
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!nickname.trim()) return;
    setIsLoading(true);

    const newUser = { ...tempUser, nickname };
    
    // Google Sheet DB 로깅
    await logToGoogleSheet('REGISTER', {
      userEmail: newUser.email,
      userName: newUser.name,
      nickname: newUser.nickname,
      provider: 'DIRECT_ENTRY',
      campus: '청년취업사관학교 성동캠퍼스',
      instructor: '전서연 강사'
    });

    setTimeout(() => {
      onComplete(newUser);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-indigo-100">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-[30px] flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6 shadow-2xl shadow-indigo-200 animate-bounce-slow">
            T
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">TableauQuest</h1>
          <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">SeSAC Seongdong BI Hero Academy</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'nickname' && (
            <motion.div 
              key="nickname"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200 border border-white"
            >
              <div className="text-center mb-10">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-6 ring-8 ring-indigo-50/50">
                  <User size={48} />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">반가워요!</h2>
                <p className="text-slate-500 text-sm mt-2 font-medium">시뮬레이션에서 사용할 닉네임을 입력해주세요.</p>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-black text-slate-400 mb-3 ml-2 uppercase tracking-widest">사용할 닉네임</label>
                  <input 
                    type="text" 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="예: 데이터분석가_사라"
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-xl placeholder:text-slate-300"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                  />
                </div>
                <button 
                  onClick={handleRegister}
                  disabled={!nickname.trim() || isLoading}
                  className="w-full py-5 bg-indigo-600 text-white font-bold rounded-[24px] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>분석가 등록하고 시작하기 <ArrowRight size={24} /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-20 rounded-[40px] shadow-2xl shadow-slate-200 border border-white flex flex-col items-center"
            >
              <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-100 rounded-full" />
                <div className="w-20 h-20 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0" />
              </div>
              <p className="font-bold text-slate-800 mt-8 animate-pulse">시뮬레이션을 준비하고 있습니다...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-16 text-center">
          <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase mb-1">SeSAC Seongdong BI Engineering</p>
          <p className="text-[10px] font-bold text-slate-300">Instructor: 전서연 | Version 1.5.0</p>
        </footer>
      </div>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Login;
