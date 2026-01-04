
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserStats } from '../types';
import { Calendar, Clock, Award, TrendingUp, ArrowRight, PlayCircle, Star, Target } from 'lucide-react';

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
        <div className="flex-1 bg-indigo-600 rounded-[32px] p-10 text-white relative overflow-hidden shadow-xl border border-indigo-500">
          <div className="relative z-10">
            <div className="bg-white/20 w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target size={12} fill="white" /> {isFirstTime ? 'JUNIOR ANALYST' : 'ACTIVE ANALYST'}
            </div>
            <h2 className="text-3xl font-bold mb-3 tracking-tight leading-tight">
              {isFirstTime 
                ? `반가워요, ${stats.nickname}님!\n오늘의 학습을 시작해볼까요?` 
                : `오늘도 업무 준비 되셨나요,\n${stats.nickname}님!`}
            </h2>
            <p className="text-indigo-100 font-medium mb-8 max-w-md text-sm leading-relaxed opacity-90">
              {isFirstTime 
                ? "사수 Sarah님이 당신을 기다리고 있습니다. 실무 대시보드 설계 원칙부터 차근차근 익혀보세요."
                : `전체 커리큘럼의 ${stats.progress}%를 달성했습니다. '${stats.mentorshipProfile?.role}' 직무 역량을 완성하기 위해 다음 미션으로 이동하세요.`}
            </p>
            <button 
              onClick={onNavigateToArchive}
              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 hover:-translate-y-1 transition-all flex items-center gap-3 shadow-lg active:scale-95 text-sm"
            >
              {isFirstTime ? <><PlayCircle size={18} /> 학습 시작하기</> : <><TrendingUp size={18} /> 학습 이어가기</>} <ArrowRight size={18} />
            </button>
          </div>
          <TrendingUp className="absolute right-[-20px] bottom-[-20px] text-white opacity-10 w-64 h-64 rotate-12" />
        </div>

        <div className="w-full md:w-80 grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl w-fit mb-3">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{stats.learningHours}h</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">누적 학습 시간</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl w-fit mb-3">
              <Award size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{stats.completedMissions}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">완료 미션</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-md col-span-2">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Learning Progress</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tighter">{stats.progress}%</p>
              </div>
              <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100 mb-1">Rank: TOP 15%</div>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-sm relative"
                style={{ width: `${stats.progress}%` }}
              >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-3">
              <Calendar size={20} className="text-indigo-600" />
              활동 포인트(XP) 현황
            </h3>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">Last 7 Days</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dx={-10} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', 
                    fontWeight: 700,
                    padding: '12px 16px',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="xp" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" dot={{ r: 3, fill: '#4f46e5', strokeWidth: 1.5, stroke: 'white' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-slate-800">커리큘럼 로드맵</h3>
            <TrendingUp size={18} className="text-indigo-600" />
          </div>
          <div className="space-y-3.5 flex-1">
            {[1, 2].map(i => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                i <= stats.completedMissions 
                  ? 'bg-emerald-50 border-emerald-100' 
                  : 'bg-white border-slate-50 hover:border-indigo-100 group cursor-pointer'
              }`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                  i <= stats.completedMissions ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'
                }`}>
                  {i <= stats.completedMissions ? <Award size={20} /> : `0${i}`}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 tracking-tight leading-none mb-1">{i === 1 ? '챕터 1: BI 실무 기초' : '챕터 2: 태블로 정복'}</h4>
                  <p className={`text-[8px] font-bold uppercase tracking-widest ${i <= stats.completedMissions ? 'text-emerald-600' : 'text-slate-300'}`}>
                    {i <= stats.completedMissions ? 'Complete' : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-50">
             <div className="flex items-center justify-between px-1">
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global Ranking</span>
               <span className="text-xs font-bold text-indigo-600">Top 15%</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
