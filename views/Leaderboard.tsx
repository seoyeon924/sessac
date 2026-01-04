
import React, { useState, useEffect, useCallback } from 'react';
import { UserStats } from '../types';
import { Trophy, Medal, Star, Loader2, AlertCircle, Database, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

interface LeaderboardProps {
  stats: UserStats;
}

interface Ranker {
  nickname: string;
  xp: number;
  level: string;
  isMe: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ stats }) => {
  const [rankers, setRankers] = useState<Ranker[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const SQL_CODE = `-- 1. profiles 테이블 생성
CREATE TABLE profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  nickname text NOT NULL,
  xp integer DEFAULT 0,
  level text DEFAULT 'Lv.1 인턴',
  progress integer DEFAULT 0,
  completed_missions integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. 모든 사용자가 데이터를 읽고 쓸 수 있도록 보안 정책(RLS) 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all to public" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- 3. 실시간 랭킹 업데이트를 위한 Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchRankings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname, xp, level')
        .order('xp', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (data) {
        const mapped = data.map(r => ({
          nickname: r.nickname,
          xp: r.xp,
          level: r.level,
          isMe: r.nickname === stats.nickname
        }));
        setRankers(mapped);
        setErrorInfo(null);
      }
    } catch (err: any) {
      console.error("Ranking fetch error:", err);
      setErrorInfo(err.message || "데이터베이스 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [stats.nickname]);

  useEffect(() => {
    fetchRankings();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          fetchRankings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRankings]);

  const myRank = rankers.findIndex(r => r.isMe) + 1;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-black uppercase tracking-widest text-[10px]">수강생 실시간 데이터 동기화 중...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 min-h-screen pb-20">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Trophy size={14} /> SeSAC Seongdong Live
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">BI 히어로 랭킹</h1>
        <p className="text-slate-500 font-bold">전체 수강생들의 실시간 학습 현황입니다.</p>
      </div>

      {errorInfo && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-red-100 p-10 rounded-[40px] space-y-8 shadow-2xl shadow-red-100/20"
        >
          <div className="flex items-center gap-4 text-red-600">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center shadow-inner">
              <AlertCircle size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black">데이터베이스 설정이 필요합니다</h3>
              <p className="text-red-400 font-bold text-sm">Supabase에 'profiles' 테이블이 존재하지 않습니다.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-inner relative group">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-800">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supabase SQL Editor용 쿼리</span>
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white text-[11px] font-black rounded-xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                >
                  {copied ? <><Check size={14} /> 복사됨</> : <><Copy size={14} /> 코드 복사</>}
                </button>
              </div>
              <pre className="p-6 text-[12px] text-indigo-300 font-mono overflow-x-auto whitespace-pre leading-relaxed select-all">
                {SQL_CODE}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black text-indigo-600 uppercase mb-2 block">STEP 01</span>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">Supabase 접속 후 <br/><b>SQL Editor</b> 메뉴 클릭</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black text-indigo-600 uppercase mb-2 block">STEP 02</span>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">복사한 코드를 붙여넣고 <br/>하단 <b>Run</b> 버튼 클릭</p>
              </div>
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-[10px] font-black text-emerald-600 uppercase mb-2 block">STEP 03</span>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">새로고침하면 <br/><b>실시간 랭킹</b>이 활성화!</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {!errorInfo && (
        <>
          <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl flex items-center justify-between relative overflow-hidden group">
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex flex-col items-center justify-center border border-white/30 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase opacity-60">My Rank</p>
                <p className="text-3xl font-black">{myRank > 0 ? myRank : '-'}</p>
              </div>
              <div>
                <h2 className="text-2xl font-black mb-1">{stats.nickname || 'Guest'}</h2>
                <p className="text-indigo-200 font-bold text-sm">{stats.level} • {stats.xp.toLocaleString()} XP</p>
              </div>
            </div>
            <Star className="absolute right-[-20px] top-[-20px] w-48 h-48 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
          </div>

          <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between px-10">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ranker</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience Points</span>
            </div>
            <div className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {rankers.length === 0 ? (
                  <div className="p-20 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                      <Trophy size={32} />
                    </div>
                    <p className="text-sm text-slate-300 font-bold">아직 데이터가 없습니다.<br/>첫 번째 랭커가 되어보세요!</p>
                  </div>
                ) : (
                  rankers.map((ranker, idx) => (
                    <motion.div 
                      layout
                      key={ranker.nickname}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`flex items-center justify-between p-6 px-10 transition-all ${ranker.isMe ? 'bg-indigo-50/50' : ''}`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-10 h-10 flex items-center justify-center font-black rounded-xl ${
                          idx === 0 ? 'bg-amber-100 text-amber-600' :
                          idx === 1 ? 'bg-slate-200 text-slate-600' :
                          idx === 2 ? 'bg-orange-100 text-orange-600' : 'text-slate-400'
                        }`}>
                          {idx < 3 ? <Medal size={24} /> : idx + 1}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${ranker.isMe ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {ranker.nickname.charAt(0)}
                          </div>
                          <div>
                            <h3 className={`text-sm font-black ${ranker.isMe ? 'text-indigo-600' : 'text-slate-800'}`}>
                              {ranker.nickname}
                              {ranker.isMe && <span className="ml-2 text-[9px] bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-600 uppercase">Me</span>}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{ranker.level}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-black ${ranker.isMe ? 'text-indigo-600' : 'text-slate-700'}`}>{ranker.xp.toLocaleString()}</p>
                        <p className="text-[9px] text-slate-300 font-black tracking-widest uppercase">Points</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
