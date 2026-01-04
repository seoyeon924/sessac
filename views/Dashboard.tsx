
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserStats } from '../types';
import { Calendar, Award, TrendingUp, ArrowRight, PlayCircle, Target } from 'lucide-react';

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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 bg-indigo-600 rounded-[28px] p-8 text-white relative overflow-hidden shadow-lg border border-indigo-500">
          <div className="relative z-10">
            <div className="bg-white/20 w-fit px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Target size={12} fill="white" /> {isFirstTime ? 'JUNIOR ANALYST' : 'ACTIVE ANALYST'}
            </div>
            <h2 className="text-2xl font-bold mb-2 tracking-tight leading-tight">
              {`반가워요, ${stats.nickname || stats.userName}님!`}
              <br />
              <span className="opacity-90">오늘의 학습을 시작해볼까요?</span>
            </h2>
            <p className="text-indigo-100 font-medium mb-6 max-w-md text-[13px] leading-relaxed opacity-80">
              사수 Sarah 팀장님이 준비한 실무 가이드를 확인하고 성장을 시작해 보세요. 현재 전체 커리큘럼의 {stats.progress}%를 달성했습니다.
            </p>
            <button 
              onClick={onNavigateToArchive}
              className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 hover:-translate-y-0.5 transition-all flex items-center gap-2 shadow-md active:scale-95 text-[13px]"
            >
              {isFirstTime ? <><PlayCircle size={16} /> 첫 미션 시작하기</> : <><TrendingUp size={16} /> 학습 이어가기</>} <ArrowRight size={16} />
            </button>
          </div>
          <TrendingUp className="absolute right-[-10px] bottom-[-10px] text-white opacity-10 w-48 h-48 rotate-12" />
        </div>

        <div className="w-full md:w-72 flex flex-col gap-3">
          <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between flex-1">
            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg w-fit mb-2">
              <Award size={16} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{stats.completedMissions} / {stats.totalMissions}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">완료된 미션 수</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Progress</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tighter">{stats.progress}%</p>
              </div>
              <div className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 mb-1">Rank: Top 15%</div>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(79,70,229,0.3)]"
                style={{ width: `${stats.progress}%` }}
              >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600" />
              활동 포인트(XP) 현황
            </h3>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100">Last 7 Days</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dx={-5} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontWeight: 700, padding: '8px 12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="xp" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorXp)" dot={{ r: 3, fill: '#4f46e5', strokeWidth: 1.5, stroke: 'white' }} activeDot={{ r: 5, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-base text-slate-800">커리큘럼 로드맵</h3>
          </div>
          <div className="space-y-3 flex-1">
            {[1, 2].map(i => (
              <div key={i} className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all ${
                i <= stats.completedMissions ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-50 hover:border-indigo-100'
              }`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                  i <= stats.completedMissions ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400'
                }`}>
                  {i <= stats.completedMissions ? <Award size={16} /> : `0${i}`}
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-800 leading-none mb-1">{i === 1 ? 'BI 실무 기초' : '태블로 정복'}</h4>
                  <p className={`text-[7px] font-bold uppercase tracking-widest ${i <= stats.completedMissions ? 'text-emerald-600' : 'text-slate-300'}`}>
                    {i <= stats.completedMissions ? 'Complete' : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
