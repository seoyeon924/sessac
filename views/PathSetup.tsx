
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Proficiency, CareerGoal } from '../types';
import { Check, Sparkles, User, Target, ChevronRight, Loader2, BarChart3, Settings, PieChart, TrendingUp, Presentation } from 'lucide-react';
import { generateLearningPath } from '../geminiService';

interface PathSetupProps {
  onComplete: (path: any) => void;
}

const PathSetup: React.FC<PathSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [proficiency, setProficiency] = useState<Proficiency | null>(null);
  const [goal, setGoal] = useState<CareerGoal | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const proficiencies: Proficiency[] = ['입문자', '중급자', '숙련자'];
  const goals: CareerGoal[] = ['BI 엔지니어', '데이터 분석가', 'PM/PO', '비즈니스 애널리스트', '그로스 마케터'];

  const getGoalIcon = (g: CareerGoal) => {
    switch (g) {
      case 'BI 엔지니어': return <Settings size={28} />;
      case '데이터 분석가': return <BarChart3 size={28} />;
      case 'PM/PO': return <Presentation size={28} />;
      case '비즈니스 애널리스트': return <PieChart size={28} />;
      case '그로스 마케터': return <TrendingUp size={28} />;
      default: return <User size={28} />;
    }
  };

  const handleFinish = async () => {
    if (proficiency && goal) {
      setIsGenerating(true);
      const path = await generateLearningPath(proficiency, goal);
      onComplete({ ...path, proficiency, goal });
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-5xl mx-auto min-h-[80vh]">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles size={14} /> AI 맞춤형 실무 경로
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">커리어 치트키, 나만의 학습 경로</h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          한국 주요 IT 기업의 채용 공고를 분석한 AI가<br/>
          지금 당신에게 꼭 필요한 '태블로 클라우드 실무' 역량만 골라 담아 드릴게요.
        </p>
      </div>

      <div className="w-full bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-50">
          <div className={`flex-1 p-6 text-center border-r border-slate-50 transition-colors ${step === 1 ? 'bg-indigo-50/30' : ''}`}>
            <p className={`text-xs font-bold uppercase tracking-widest ${step === 1 ? 'text-indigo-600' : 'text-slate-300'}`}>01. 보유 역량</p>
          </div>
          <div className={`flex-1 p-6 text-center transition-colors ${step === 2 ? 'bg-indigo-50/30' : ''}`}>
            <p className={`text-xs font-bold uppercase tracking-widest ${step === 2 ? 'text-indigo-600' : 'text-slate-300'}`}>02. 목표 직무</p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          {step === 1 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <User className="text-indigo-500" /> 현재 실력이 어느 정도인가요?
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {proficiencies.map((p) => (
                  <button
                    key={p}
                    onClick={() => setProficiency(p)}
                    className={`p-6 text-left rounded-3xl border-2 transition-all flex items-center justify-between group ${
                      proficiency === p ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200'
                    }`}
                  >
                    <div>
                      <p className={`font-bold text-lg ${proficiency === p ? 'text-indigo-700' : 'text-slate-700'}`}>{p}</p>
                      <p className="text-sm text-slate-500 font-medium mt-1">
                        {p === '입문자' && '태블로 데스크탑 설치부터 시작하는 단계입니다.'}
                        {p === '중급자' && '기본적인 차트 작성과 필터 사용법은 숙지하고 있습니다.'}
                        {p === '숙련자' && '태블로 클라우드 운영 및 거버넌스 최적화를 원합니다.'}
                      </p>
                    </div>
                    {proficiency === p && (
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                        <Check size={18} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button
                disabled={!proficiency}
                onClick={() => setStep(2)}
                className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 mt-4"
              >
                다음 단계로 <ChevronRight size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Target className="text-indigo-500" /> 어떤 커리어로 나아가고 싶으신가요?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {goals.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`p-6 text-center rounded-[32px] border-2 transition-all space-y-4 flex flex-col items-center justify-center ${
                      goal === g ? 'border-indigo-500 bg-indigo-50 shadow-xl scale-105' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                      goal === g ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {getGoalIcon(g)}
                    </div>
                    <div>
                      <p className={`font-bold text-base ${goal === g ? 'text-indigo-700' : 'text-slate-700'}`}>{g}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">준비하기</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-5 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  이전으로
                </button>
                <button
                  disabled={!goal || isGenerating}
                  onClick={handleFinish}
                  className="flex-[2] py-5 bg-indigo-600 text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={18} /> 맞춤형 로드맵 설계 시작</>}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PathSetup;
