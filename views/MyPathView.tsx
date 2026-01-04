
import React from 'react';
import { motion } from 'framer-motion';
import { UserStats, Mission } from '../types';
import { MISSIONS } from '../constants';
import { Star, ChevronRight, CheckCircle2, Lock, Bot, Map, Target } from 'lucide-react';

interface MyPathViewProps {
  stats: UserStats;
  onMissionClick: (mission: Mission) => void;
}

const MyPathView: React.FC<MyPathViewProps> = ({ stats, onMissionClick }) => {
  if (!stats.learningPath) return null;

  const pathMissions = stats.learningPath.recommendedMissionIds
    .map(id => MISSIONS.find(m => m.id === id))
    .filter(Boolean) as Mission[];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">{stats.learningPath.proficiency}</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider">{stats.learningPath.goal}</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">커리어 로드맵</h1>
          <p className="text-slate-500 font-medium">{stats.learningPath.goal} 목표 달성을 위한 최적화 과정입니다.</p>
        </div>
        <div className="w-full md:w-80 bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Bot size={24} />
            </div>
            <p className="text-sm font-bold leading-relaxed italic opacity-95">"{stats.learningPath.customPlan}"</p>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold mt-4 opacity-60">— Sarah, 시니어 BI 멘토</p>
        </div>
      </header>

      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-slate-800">성장 경로</h2>
        <div className="relative">
          <div className="absolute left-6 top-8 bottom-8 w-1 bg-slate-100 rounded-full" />

          <div className="space-y-12">
            {pathMissions.map((mission, idx) => (
              <motion.div 
                key={mission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-16 flex flex-col md:flex-row gap-6 group"
              >
                <div className={`absolute left-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                  stats.completedMissions > idx 
                    ? 'bg-emerald-500 text-white' 
                    : idx === stats.completedMissions 
                      ? 'bg-indigo-600 text-white scale-110' 
                      : 'bg-white text-slate-300 border border-slate-100'
                }`}>
                  {stats.completedMissions > idx ? <CheckCircle2 size={24} /> : <span className="font-bold">{idx + 1}</span>}
                </div>

                <div className={`flex-1 p-6 rounded-3xl border transition-all ${
                  idx === stats.completedMissions
                    ? 'bg-white border-indigo-200 shadow-xl'
                    : 'bg-white border-slate-100'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{mission.chapter}</span>
                      <h3 className="text-lg font-bold text-slate-800">{mission.title}</h3>
                    </div>
                    {idx > stats.completedMissions && <Lock size={16} className="text-slate-300" />}
                  </div>
                  <p className="text-sm text-slate-500 mb-4 font-medium">{mission.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star size={14} className="text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-slate-600">{mission.xpReward} XP</span>
                    </div>
                    {idx === stats.completedMissions && (
                      <button 
                        onClick={() => onMissionClick(mission)}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                      >
                        학습 시작
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyPathView;
