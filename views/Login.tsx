
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface LoginProps {
  onComplete: (user: { name: string; email: string; nickname: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'auth' | 'nickname' | 'loading'>('auth');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // 실제 환경에서는 supabase.auth.signInWithOAuth({ provider: 'google' }) 사용
    // 여기서는 시뮬레이션을 위해 즉시 닉네임 단계로 넘김
    setTimeout(() => {
      setAuthEmail("student@sesac.ac.kr");
      setAuthName("SeSAC 교육생");
      setStep('nickname');
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = async () => {
    if (!nickname.trim()) return;
    setIsLoading(true);

    const newUser = { name: authName, email: authEmail, nickname };
    
    // DB 동기화 (Supabase)
    const { error } = await supabase.from('profiles').upsert({
      email: newUser.email,
      nickname: newUser.nickname,
      xp: 0,
      level: 'Lv.1 인턴',
      progress: 0,
      completed_missions: 0
    }, { onConflict: 'email' });

    if (error) console.error("Profile sync failed:", error);

    setTimeout(() => {
      onComplete(newUser);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-[24px] flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-xl shadow-indigo-100">
            T
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">TableauQuest</h1>
          <p className="text-slate-400 font-bold tracking-widest text-[10px] uppercase">BI HERO ACADEMY</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'auth' && (
            <motion.div key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[40px] shadow-xl border border-white space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">환영합니다!</h2>
                <p className="text-slate-400 text-sm mt-2 font-medium">실무 데이터를 다루기 위해 로그인이 필요합니다.</p>
              </div>
              <button 
                onClick={handleGoogleLogin}
                className="w-full py-4 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-3 font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5" alt="Google" />
                Google 계정으로 시작하기
              </button>
            </motion.div>
          )}

          {step === 'nickname' && (
            <motion.div key="nickname" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-10 rounded-[40px] shadow-xl border border-white">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
                  <User size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">닉네임 설정</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">시뮬레이션에서 사용할 이름을 입력해주세요.</p>
              </div>

              <div className="space-y-6">
                <input 
                  type="text" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="예: 데이터분석가_사라"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-lg text-center"
                  autoFocus
                />
                <button 
                  onClick={handleRegister}
                  disabled={!nickname.trim() || isLoading}
                  className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <>시작하기 <ArrowRight size={20} /></>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;
