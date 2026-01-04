
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserStats } from '../types';
import { Calendar, Clock, Award, TrendingUp, ArrowRight, PlayCircle, Star } from 'lucide-react';

const data = [
  { name: '월', xp: 400 },
  { name: '화', xp: 300 },
  { name: '수', xp: 900 },
  { name: '목', xp: 1200 },
  { name: '금', xp: 600 },
  { name: '토', xp: 0 },
  { name: '일', xp: 0 },
];

interface DashboardProps {
  stats: UserStats;
  onNavigateToArchive: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onNavigateToArchive }) => {
  const isFirstTime = stats.xp === 0;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-indigo-600 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-100 border border-indigo-500">
          <div className="relative z-10">
            <div className="bg-white/20 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Star size={12} fill="white" /> {isFirstTime ? 'NEW HERO' : 'ACTIVE ANALYST'}
            </div>
            <h2 className="text-4xl font-black mb-3 tracking-tight whitespace-pre-wrap">
              {isFirstTime 
                ? `반가워요, ${stats.nickname}님!\n데이터 영웅의 여정을 시작할까요?` 
                : `오늘도 멋진 분석을 기대할게요,\n${stats.nickname}님!`}
            </h2>
            <p className="text-indigo-100 font-bold mb-10 max-w-md text-sm leading-relaxed opacity-90">
              {isFirstTime 
                ? "사수 Sarah님이 당신을 기다리고 있습니다. 첫 번째 실무 가이드를 확인하고 성장을 시작해 보세요."
                : `현재 전체 커리큘럼의 ${stats.progress}%를 완수하셨습니다. 목표 직무인 '${stats.mentorshipProfile?.role}'까지 조금만 더 힘내세요!`}
            </p>
            <button 
              onClick={onNavigateToArchive}
              className="px-10 py-5 bg-white text-indigo-600 font-black rounded-[24px] hover:bg-indigo-50 hover:-translate-y-1 transition-all flex items-center gap-3 shadow-2xl active:scale-95"
            >
              {isFirstTime ? <><PlayCircle size={22} /> 학습 시작하기</> : <><TrendingUp size={22} /> 학습 이어가기</>} <ArrowRight size={20} />
            </button>
          </div>
          <TrendingUp className="absolute right-[-40px] bottom-[-40px] text-white opacity-10 w-80 h-80 rotate-12" />
        </div>

        <div className="w-full md:w-80 grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl w-fit mb-4">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.learningHours}h</p>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">학습 시간</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl w-fit mb-4">
              <Award size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.completedMissions}</p>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">완료 미션</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-md col-span-2">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Total Learning Progress</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter">{stats.progress}%</p>
              </div>
              <div className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 mb-1">Rank: TOP 15%</div>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.4)] relative"
                style={{ width: `${stats.progress}%` }}
              >
                <div className="absolute top-0 right-0 w-1.5 h-full bg-white/30" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h3 className="font-black text-xl text-slate-800 flex items-center gap-3">
              <Calendar size={22} className="text-indigo-600" />
              나의 활동 XP 현황
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Last 7 Days</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 700}} dy={20} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 700}} dx={-15} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', 
                    fontWeight: 900,
                    padding: '16px 20px',
                    fontSize: '14px'
                  }}
                  cursor={{ stroke: '#4f46e5', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="xp" stroke="#4f46e5" strokeWidth={5} fillOpacity={1} fill="url(#colorXp)" dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 8, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xl text-slate-800">커리큘럼 로드맵</h3>
            <TrendingUp size={20} className="text-indigo-600" />
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {[1, 2].map(i => (
              <div key={i} className={`flex items-center gap-5 p-5 rounded-[28px] transition-all border-2 ${
                i <= stats.completedMissions 
                  ? 'bg-emerald-50 border-emerald-100' 
                  : 'bg-white border-slate-50 hover:border-indigo-100 group cursor-pointer'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all shadow-sm ${
                  i <= stats.completedMissions ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'
                }`}>
                  {i <= stats.completedMissions ? <Award size={28} /> : `0${i}`}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1.5">{i === 1 ? '챕터 1: BI 실무 기초' : '챕터 2: 태블로 정복'}</h4>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${i <= stats.completedMissions ? 'text-emerald-600' : 'text-slate-300'}`}>
                    {i <= stats.completedMissions ? 'Mission Complete' : 'Next Journey'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-50">
             <div className="flex items-center justify-between px-2">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Ranking</span>
               <span className="text-xs font-black text-indigo-600">Top 15%</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
