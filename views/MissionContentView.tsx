
import React, { useState, useRef, useEffect } from 'react';
import { Mission, MentorshipProfile } from '../types';
import { 
  ChevronRight, Bookmark, ExternalLink, Loader2, ArrowRight, CheckCircle2, Circle, Info, AlertCircle, Sparkles, BookOpen, MessageSquare, Send
} from 'lucide-react';

interface MissionContentViewProps {
  mission: Mission;
  profile?: MentorshipProfile;
  onComplete: (xp: number) => void;
}

const MissionContentView: React.FC<MissionContentViewProps> = ({ mission, profile, onComplete }) => {
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [guidebookRead, setGuidebookRead] = useState(false);
  const [quizPhase, setQuizPhase] = useState<'NONE' | 'MCQ' | 'SHORT' | 'COMPLETED'>('NONE');
  const [mcqValue, setMcqValue] = useState<number | null>(null);
  const [shortValue, setShortValue] = useState('');
  const [quizError, setQuizError] = useState('');
  
  const contentEndRef = useRef<HTMLDivElement>(null);

  const notionUrls: Record<string, string> = {
    '1-1-1': "https://trail-bowler-04f.notion.site/ebd//2de4126a7fc481ed922dfbf5c95818e7",
    '1-1-2': "https://trail-bowler-04f.notion.site/ebd//2de4126a7fc481968729fe4c323098d1",
    '1-1-3': "https://trail-bowler-04f.notion.site/ebd//2de4126a7fc4813c9b6bf3be6fa4343a",
    '1-1-4': "https://trail-bowler-04f.notion.site/ebd//2de4126a7fc481b088e6ed92b839eb99",
    '1-1-5': "https://trail-bowler-04f.notion.site/ebd//2de4126a7fc481f7a6b8e44ac5ea23b1",
    '1-1-6': "https://trail-bowler-04f.notion.site/ebd//2de4126a7fc48118816ec9d4b439405b",
    '1-1-7': "https://trail-bowler-04f.notion.site/ebd//2de4126a7fc4810fb9dccb3c41668602",
    '1-1-8': "https://trail-bowler-04f.notion.site/ebd//2de4126a7fc481cc8fc7cb9c54b916f3",
  };

  const currentNotionUrl = notionUrls[mission.id] || notionUrls['1-1-1'];

  const quizData: Record<string, { mcq: any, short: any }> = {
    '1-1-1': {
      mcq: { q: "실무 대시보드 설계 시 가장 먼저 고려해야 할 요소는?", options: ["차트의 화려함", "사용자(Who)와 분석 목적(Why)", "데이터 용량"], ans: 1 },
      short: { q: "전체 매출에 영향을 주는 하위 지표들을 계층적으로 설계한 구조는? (영어 약자 2단어)", ans: "Metric Hierarchy" }
    },
    '1-1-5': {
      mcq: { q: "실제 비즈니스 액션을 이끌어낼 수 있는 지표의 특징은?", options: ["Actionable", "Visible", "Readable"], ans: 0 },
      short: { q: "사용자가 서비스를 얼마나 반복적으로 사용하는지 나타내는 지표는? (한글 3글자)", ans: "리텐션" }
    }
  };

  const currentQuiz = quizData[mission.id] || quizData['1-1-1'];

  const handleReadComplete = () => {
    setGuidebookRead(true);
    setQuizPhase('MCQ');
    setTimeout(() => {
      contentEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const handleMcqSubmit = () => {
    if (mcqValue === currentQuiz.mcq.ans) {
      setQuizPhase('SHORT');
      setQuizError('');
    } else {
      setQuizError('오답입니다. 가이드북 내용을 다시 꼼꼼히 확인해 보세요.');
    }
  };

  const handleShortSubmit = () => {
    if (shortValue.trim().replace(/\s/g, '').toLowerCase() === currentQuiz.short.ans.toLowerCase()) {
      setQuizPhase('COMPLETED');
      setQuizError('');
    } else {
      setQuizError('정답이 아닙니다. 핵심 키워드를 다시 생각해보세요.');
    }
  };

  useEffect(() => {
    setIsIframeLoading(true);
    setGuidebookRead(false);
    setQuizPhase('NONE');
    setMcqValue(null);
    setShortValue('');
    setQuizError('');
  }, [mission.id]);

  const allDone = guidebookRead && quizPhase === 'COMPLETED';

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden font-sans">
      <aside className="w-64 border-r border-slate-200 flex flex-col bg-white overflow-y-auto shadow-sm z-10">
        <div className="p-5 border-b border-slate-100 bg-slate-900 text-white">
          <h2 className="text-[13px] font-bold leading-tight">진행 현황</h2>
          <p className="text-[9px] font-medium text-slate-400 opacity-80 mt-1">미션을 완료하면 활성화됩니다.</p>
        </div>
        
        <div className="flex-1 p-4 space-y-2.5">
          <div className={`p-3.5 rounded-xl border flex items-center gap-2.5 transition-all ${guidebookRead ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
            {guidebookRead ? <CheckCircle2 className="text-emerald-500 shrink-0" size={16} /> : <Circle className="text-slate-300 shrink-0" size={16} />}
            <p className={`text-[11px] font-bold ${guidebookRead ? 'text-emerald-800' : 'text-slate-600'}`}>가이드북 정독</p>
          </div>
          <div className={`p-3.5 rounded-xl border flex items-center gap-2.5 transition-all ${quizPhase === 'COMPLETED' ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
            {quizPhase === 'COMPLETED' ? <CheckCircle2 className="text-emerald-500 shrink-0" size={16} /> : <Circle className="text-slate-300 shrink-0" size={16} />}
            <p className={`text-[11px] font-bold ${quizPhase === 'COMPLETED' ? 'text-emerald-800' : 'text-slate-600'}`}>확인 퀴즈 완료</p>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-50">
          <button 
            disabled={!allDone}
            onClick={() => onComplete(100)}
            className={`w-full py-3 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center gap-2 ${
              allDone ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' : 'bg-slate-100 text-slate-400'
            }`}
          >
            학습 완료 보고 <ArrowRight size={12} />
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50 flex flex-col">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex items-center justify-between shadow-sm">
           <h1 className="text-[12px] font-bold text-slate-800 tracking-tight">{mission.title}</h1>
           <a href={currentNotionUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-[9px] font-bold rounded-lg hover:bg-black transition-all">
             <ExternalLink size={10} /> 노션 원문
           </a>
        </div>

        <div className="p-5 space-y-6">
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden relative min-h-[500px]">
            {isIframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mb-2" />
                <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">Loading...</p>
              </div>
            )}
            <iframe src={currentNotionUrl} className="w-full h-[800px] border-none" onLoad={() => setIsIframeLoading(false)} title="Notion" />
          </div>

          <div className="flex justify-center">
            {!guidebookRead ? (
              <button 
                onClick={handleReadComplete}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95"
              >
                가이드북 정독 완료 <ArrowRight size={16} />
              </button>
            ) : (
              <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[11px] border border-emerald-100 animate-in fade-in zoom-in-95">
                <CheckCircle2 size={16} /> 정독 완료! 아래 퀴즈를 풀어보세요.
              </div>
            )}
          </div>

          {guidebookRead && (
            <div className="bg-white rounded-[28px] p-8 border border-indigo-50 shadow-lg space-y-6 max-w-xl mx-auto mb-12 animate-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-bold text-slate-900 text-center tracking-tight">확인 퀴즈</h3>
              
              {quizPhase === 'MCQ' && (
                <div className="space-y-4">
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">Q. {currentQuiz.mcq.q}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {currentQuiz.mcq.options.map((opt: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setMcqValue(i)}
                        className={`p-3.5 rounded-xl text-left text-[12px] font-bold border transition-all ${
                          mcqValue === i ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-indigo-100'
                        }`}
                      >
                        {i + 1}. {opt}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleMcqSubmit} disabled={mcqValue === null} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-md active:scale-[0.98]">정답 확인</button>
                </div>
              )}

              {quizPhase === 'SHORT' && (
                <div className="space-y-5 text-center">
                  <p className="text-sm font-bold text-slate-700">Q. {currentQuiz.short.q}</p>
                  <input 
                    type="text" 
                    value={shortValue} 
                    onChange={(e) => setShortValue(e.target.value)}
                    placeholder="정답 입력..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-center focus:border-indigo-500 outline-none text-sm shadow-inner"
                  />
                  <button onClick={handleShortSubmit} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs active:scale-[0.98]">제출</button>
                </div>
              )}

              {quizPhase === 'COMPLETED' && (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle2 size={40} className="text-emerald-500 mx-auto" />
                  <h4 className="text-lg font-bold text-slate-900">미션 통과!</h4>
                  <p className="text-slate-400 text-[10px] font-bold">이제 학습 완료 보고 버튼을 눌러 경험치를 획득하세요.</p>
                </div>
              )}
              {quizError && <p className="text-red-500 text-center font-bold text-[10px]">{quizError}</p>}
            </div>
          )}
          <div ref={contentEndRef} className="h-10" />
        </div>
      </main>
    </div>
  );
};

export default MissionContentView;
