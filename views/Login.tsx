
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface LoginProps {
  onComplete: (user: { name: string; email: string; nickname: string; xp: number; progress: number; completedMissions: number }) => void;
}

const Login: React.FC<LoginProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'auth' | 'nickname' | 'loading'>('auth');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempUser, setTempUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    // 세션 확인 (이미 로그인된 경우)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        handleUserDataFetch(session.user.email!, session.user.user_metadata.full_name || '사용자');
      }
    };
    checkSession();
  }, []);

  const handleUserDataFetch = async (email: string, name: string) => {
    setStep('loading');
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (profile) {
      onComplete({
        email,
        name,
        nickname: profile.nickname,
        xp: profile.xp,
        progress: profile.progress,
        completedMissions: profile.completed_missions
      });
    } else {
      setTempUser({ email, name });
      setStep('nickname');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      alert("로그인 중 오류가 발생했습니다: " + error.message);
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!nickname.trim() || !tempUser) return;
    setIsLoading(true);

    const { error } = await supabase.from('profiles').upsert({
      email: tempUser.email,
      nickname: nickname,
      xp: 0,
      level: 'Lv.1 인턴',
      progress: 0,
      completed_missions: 0
    }, { onConflict: 'email' });

    if (error) {
      console.error("Profile sync failed:", error);
    }

    onComplete({
      email: tempUser.email,
      name: tempUser.name,
      nickname: nickname,
      xp: 0,
      progress: 0,
      completedMissions: 0
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
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
                <p className="text-slate-400 text-sm mt-2 font-medium">실무 데이터를 기록하기 위해 로그인이 필요합니다.</p>
              </div>
              <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-4 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-3 font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : (
                  <>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5" alt="Google" />
                    Google 계정으로 시작하기
                  </>
                )}
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
                <p className="text-slate-400 text-xs mt-1 font-medium">시뮬레이션에서 사용할 실무자 명칭을 입력해주세요.</p>
              </div>

              <div className="space-y-6">
                <input 
                  type="text" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="예: 분석가_전서연"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-lg text-center"
                />
                <button 
                  onClick={handleRegister}
                  disabled={!nickname.trim() || isLoading}
                  className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <>업무 시작하기 <ArrowRight size={20} /></>}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-20">
               <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
               <p className="text-slate-400 font-bold text-sm">데이터를 동기화하고 있습니다...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;
