
import React from 'react';
import { CheckCircle2, Circle, Lock, ArrowRight, RotateCcw } from 'lucide-react';
import { Mission } from '../types';

interface MissionCardProps {
  mission: Mission;
  isLocked?: boolean;
  onStart: () => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, isLocked, onStart }) => {
  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      mission.isCompleted 
        ? 'bg-emerald-50/50 border-emerald-100 shadow-sm' 
        : isLocked 
          ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
          : 'bg-white border-slate-200 hover:shadow-md hover:border-indigo-200 cursor-pointer shadow-sm'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            mission.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
          }`}>
            <span className="text-xs font-black tracking-tighter">{mission.chapter}</span>
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-[14px] leading-tight">{mission.title}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{mission.type} 미션</p>
          </div>
        </div>
        {mission.isCompleted ? (
          <div className="flex flex-col items-end">
             <CheckCircle2 className="text-emerald-500" size={24} />
             <span className="text-[10px] font-black text-emerald-600 mt-1">100% 완료</span>
          </div>
        ) : isLocked ? (
          <Lock className="text-slate-300" size={20} />
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-slate-100" />
        )}
      </div>
      
      <p className="text-[12px] text-slate-500 mb-6 line-clamp-2 font-medium leading-relaxed">
        {mission.description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-[10px] font-black text-slate-400 tracking-wider">{mission.xpReward} XP 보상</span>
        {!isLocked && (
          <button 
            onClick={onStart}
            className={`flex items-center gap-1.5 text-xs font-black transition-all ${
              mission.isCompleted 
                ? 'text-emerald-600 hover:text-emerald-700' 
                : 'text-blue-600 hover:gap-2'
            }`}
          >
            {mission.isCompleted ? (
              <><RotateCcw size={14} /> 복습하기</>
            ) : (
              <>미션 시작 <ArrowRight size={14} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default MissionCard;
