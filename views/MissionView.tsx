
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DialogueNode } from '../types';
import { CheckCircle2, ChevronRight, User, Award, ArrowRight, Coffee, ExternalLink } from 'lucide-react';

interface MissionViewProps {
  dialogues: DialogueNode[]; 
  missionTitle: string;
  onComplete: (xpGain: number) => void;
  isIntro: boolean;
}

const MissionView: React.FC<MissionViewProps> = ({ dialogues, missionTitle, onComplete, isIntro }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleHistory, setVisibleHistory] = useState<DialogueNode[]>([]);
  const [accumulatedXP, setAccumulatedXP] = useState(0);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const SARAH_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProfessionalSarah&backgroundColor=b6e3f4&eyebrows=default&eyes=happy&mouth=smile&skinColor=f8d25c&hairColor=2c1b18';

  useEffect(() => {
    if (dialogues.length > 0) {
      setVisibleHistory([dialogues[0]]);
      setCurrentIndex(0);
      setShowCompletionScreen(false);
    }
  }, [dialogues]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleHistory]);

  const handleNext = () => {
    if (currentIndex < dialogues.length - 1) {
      const nextIdx = currentIndex + 1;
      const nextMsg = dialogues[nextIdx];
      setVisibleHistory(prev => [...prev, nextMsg]);
      setCurrentIndex(nextIdx);
      setAccumulatedXP(prev => prev + 10);
    } else {
      setShowCompletionScreen(true);
    }
  };

  const handleFinalAction = () => {
    onComplete(accumulatedXP);
  };

  const renderTextWithLinks = (text: string) => {
    if (typeof text !== 'string') return text;
    let parts: (string | React.ReactNode)[] = [text];
    
    // Bold 처리
    parts = parts.flatMap(part => {
      if (typeof part !== 'string') return part;
      const subParts = [];
      let lastIndex = 0;
      const boldRegex = /\*\*([^*]+)\*\*/g;
      let match;
      while ((match = boldRegex.exec(part)) !== null) {
        if (match.index > lastIndex) subParts.push(part.substring(lastIndex, match.index));
        subParts.push(<strong key={`bold-${match.index}`} className="font-black text-indigo-700">{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < part.length) subParts.push(part.substring(lastIndex));
      return subParts;
    });

    // Link 처리
    parts = parts.flatMap(part => {
      if (typeof part !== 'string') return part;
      const subParts = [];
      let lastIndex = 0;
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;
      while ((match = linkRegex.exec(part)) !== null) {
        if (match.index > lastIndex) subParts.push(part.substring(lastIndex, match.index));
        subParts.push(
          <a key={`link-${match.index}`} href={match[2]} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-black transition-all font-black text-[11px] my-2 mx-0.5 shadow-lg shadow-blue-100 active:scale-95 no-underline">
            <ExternalLink size={12} strokeWidth={3} /> {match[1]}
          </a>
        );
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < part.length) subParts.push(part.substring(lastIndex));
      return subParts;
    });

    return parts;
  };

  if (showCompletionScreen) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-slate-50/30 h-full">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-xs w-full bg-white rounded-[28px] p-8 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner ring-4 ${isIntro ? 'bg-indigo-100 text-indigo-600 ring-indigo-50/50' : 'bg-emerald-100 text-emerald-600 ring-emerald-50/50'}`}>
              {isIntro ? <Coffee size={24} /> : <Award size={24} />}
            </div>
            <h2 className="text-lg font-black text-slate-900 mb-1 tracking-tight">{isIntro ? "준비가 되셨나요?" : "미션 완료 보고"}</h2>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-6 whitespace-pre-wrap">
              {isIntro ? "사수 Sarah님이 추천한 가이드북입니다.\n실무 꿀팁들을 하나씩 확인해 보세요!" : "훌륭하게 미션을 완수하셨습니다.\n수고 많으셨습니다."}
            </p>
            <button onClick={handleFinalAction}
              className={`w-full py-3 text-white rounded-xl font-black text-[12px] transition-all shadow-lg flex items-center justify-center gap-2 group ${isIntro ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'}`}>
              {isIntro ? "가이드북 확인하기" : "미션 리스트로"} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full p-4 md:p-6 max-w-4xl mx-auto overflow-hidden">
      <div className="flex-1 bg-white rounded-[28px] border border-slate-200 shadow-xl overflow-hidden flex flex-col relative">
        {/* 대화 내역 영역: pb-32를 주어 고정 버튼에 가려지지 않게 함 */}
        <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-5 bg-slate-50/30 scroll-smooth pb-32">
          <AnimatePresence>
            {visibleHistory.map((node, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3.5 ${node.isUserTurn ? 'flex-row-reverse' : ''}`}>
                {!node.isUserTurn && (
                  <img src={SARAH_AVATAR} className="w-10 h-10 rounded-xl border-2 border-white shadow-sm self-start" alt="Sarah" />
                )}
                {node.isUserTurn && (
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white self-start shadow-md"><User size={16} /></div>
                )}
                <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm border ${node.isUserTurn ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none' : 'bg-white text-slate-700 border-slate-100 rounded-tl-none'}`}>
                  <p className={`text-[8px] font-black mb-1 uppercase tracking-widest ${node.isUserTurn ? 'text-indigo-200' : 'text-slate-400'}`}>{node.speaker}</p>
                  <div className="text-[12px] leading-relaxed font-bold">{renderTextWithLinks(node.text)}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 🌟 고정된 푸터 영역 🌟 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center pointer-events-none z-20">
          {/* 버튼 배경 그라데이션 - 텍스트 가독성을 위함 */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-30 pointer-events-auto">
            <button onClick={handleNext}
              className="px-20 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center gap-3 group active:scale-95 text-[14px] border-b-4 border-indigo-800">
              {currentIndex < dialogues.length - 1 ? (
                <>계속 <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
              ) : (
                <>안내 완료 <CheckCircle2 size={20} /></>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MissionView;
