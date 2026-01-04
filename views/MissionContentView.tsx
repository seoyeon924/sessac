
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

  /**
   * 📢 [긴급 반영] 요청하신 노션 임베드 링크 최종 매핑 리스트
   * 레슨 ID별로 정확한 URL이 매핑되도록 보장합니다.
   */
  const notionUrls: Record<string, string> = {
    '1-1-1': "https://trail-bowler-04f.notion.site/ebd//2de4126a7fc481ed922dfbf5c95818e7", // 1-1
    '1-1-2': "https://trail-bowler-04f.notion.site/ebd//2de4126a7fc481968729fe4c323098d1", // 1-2 (FIXED)
    '1-1-3': "https://trail-bowler-04f.notion.site/ebd//2de4126a7fc4813c9b6bf3be6fa4343a", // 1-3
    '1-1-4': "https://trail-bowler-04f.notion.site/ebd//2de4126a7fc481b088e6ed92b839eb99", // 2-1
    '1-1-5': "https://trail-bowler-04f.notion.site/ebd//2de4126a7fc481f7a6b8e44ac5ea23b1", // 2-2
    '1-1-6': "https://trail-bowler-04f.notion.site/ebd//2de4126a7fc48118816ec9d4b439405b", // 2-3
    '1-1-7': "https://trail-bowler-04f.notion.site/ebd//2de4126a7fc4810fb9dccb3c41668602", // 2-4
    '1-1-8': "https://trail-bowler-04f.notion.site/ebd//2de4126a7fc481cc8fc7cb9c54b916f3", // 2-5
  };

  const currentNotionUrl = notionUrls[mission.id] || notionUrls['1-1-1'];

  const quizData: Record<string, { mcq: any, short: any }> = {
    '1-1-1': {
      mcq: { q: "가이드북에서 소개한 사례 중, UX 디자인적 가치를 인정받아 어워드를 수상한 대시보드는?", options: ["게임 로그 대시보드", "HR Attrition 대시보드", "Sales Funnel 대시보드"], ans: 1 },
      short: { q: "사용자가 특정 기간 내에 재방문하는 비율을 뜻하는 지표의 이름은? (한글 3글자)", ans: "리텐션" }
    },
    '1-1-2': {
      mcq: { q: "엑셀 대신 BI 툴을 사용하는 가장 큰 실무적 이유는 무엇인가요?", options: ["표 계산을 더 정확히 하기 위해", "실시간 의사결정 및 자동화 공유", "그림판보다 그리기 편해서"], ans: 1 },
      short: { q: "데이터를 분석하여 의사결정에 활용하는 기술을 뜻하는 약어는? (대문자 2글자)", ans: "BI" }
    },
    '1-1-3': {
      mcq: { q: "우리 눈이 의식적으로 노력하지 않아도 정보를 즉각 인지하는 속성을 무엇이라 하나요?", options: ["후천적 학습 속성", "전주의적 속성", "심미적 편향 속성"], ans: 1 },
      short: { q: "통계치는 같지만 시각화하면 전혀 다른 모양이 나오는 예시의 이름은? (한글 6글자)", ans: "데이터사우르스" }
    },
    '1-1-4': {
      mcq: { q: "분석 목적을 세울 때 반드시 질문해야 하는 5W 요소가 아닌 것은?", options: ["Who (누구에게?)", "Why (왜 보는지?)", "Weight (데이터 무게?)"], ans: 2 },
      short: { q: "차트를 그리기 전, 분석의 방향을 설정하는 이 단계를 무엇이라 하나요? (한글 4글자)", ans: "목적설계" }
    },
    '1-1-5': {
      mcq: { q: "Outcome 지표가 하락했을 때 원인을 즉시 찾을 수 있게 설계한 구조는?", options: ["Metric Hierarchy", "Data Lake", "SQL Join Structure"], ans: 0 },
      short: { q: "우리가 당장 실행하여 변화시킬 수 있는 구체적인 지표를 무엇이라 하나요? (영문)", ans: "Actionable" }
    },
    '1-1-6': {
      mcq: { q: "실무에서 '시간에 따른 추세'를 보여주기에 가장 적합한 차트는?", options: ["도넛 차트", "막대 차트", "라인 차트"], ans: 2 },
      short: { q: "상단에 핵심 KPI를 두고 하단에 상세 내역을 두는 대시보드 배치 흐름을 무엇이라 하나요? (한글 2글자)", ans: "역전" }
    },
    '1-1-7': {
      mcq: { q: "에드워드 터프티가 제안한, 정보와 상관없는 불필요한 요소를 줄여야 한다는 원칙은?", options: ["데이터 잉크 비율 극대화", "화려한 그라데이션 사용", "3D 차트 효과 적용"], ans: 0 },
      short: { q: "시각화에서 정보 전달을 방해하는 불필요한 시각 요소를 무엇이라 하나요? (한글 3글자)", ans: "노이즈" }
    },
    '1-1-8': {
      mcq: { q: "전체 데이터는 좋아 보이지만 세부 그룹으로 나누면 결과가 뒤집히는 현상은?", options: ["심슨의 역설", "평균의 함정", "확증 편향"], ans: 0 },
      short: { q: "더 상세한 원인을 파악하기 위해 데이터를 쪼개고 하위 단계로 내려가는 분석 기법은? (한글 4글자)", ans: "드릴다운" }
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
      setQuizError('틀렸습니다! 가이드북 내용을 다시 한번 확인해 보세요.');
    }
  };

  const handleShortSubmit = () => {
    if (shortValue.trim().replace(/\s/g, '').toLowerCase() === currentQuiz.short.ans.toLowerCase()) {
      setQuizPhase('COMPLETED');
      setQuizError('');
    } else {
      setQuizError(`정답이 아닙니다. (힌트: ${currentQuiz.short.ans.length}글자)`);
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
    <div className="flex h-full bg-slate-100 overflow-hidden">
      <aside className="w-80 border-r border-slate-200 flex flex-col bg-white overflow-y-auto shadow-2xl z-10">
        <div className="p-8 border-b border-slate-100 bg-indigo-600 text-white">
          <h2 className="text-xl font-black leading-tight mb-2">학습 체크리스트</h2>
          <p className="text-[11px] font-bold text-indigo-100 opacity-80 leading-relaxed">활동을 완료하면 자동으로 체크됩니다.</p>
        </div>
        
        <div className="flex-1 p-6 space-y-4">
          <div className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${guidebookRead ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
            {guidebookRead ? <CheckCircle2 className="text-emerald-500 shrink-0" size={24} /> : <Circle className="text-slate-300 shrink-0" size={24} />}
            <div>
              <p className={`text-[13px] font-black ${guidebookRead ? 'text-emerald-800 line-through' : 'text-slate-700'}`}>가이드북 정독 완료</p>
            </div>
          </div>
          <div className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${quizPhase === 'COMPLETED' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
            {quizPhase === 'COMPLETED' ? <CheckCircle2 className="text-emerald-500 shrink-0" size={24} /> : <Circle className="text-slate-300 shrink-0" size={24} />}
            <div>
              <p className={`text-[13px] font-black ${quizPhase === 'COMPLETED' ? 'text-emerald-800 line-through' : 'text-slate-700'}`}>실무 퀴즈 완료</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button 
            disabled={!allDone}
            onClick={() => onComplete(100)}
            className={`w-full py-5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
              allDone ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            학습 완료 보고 <ArrowRight size={16} />
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50 flex flex-col">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm">
           <h1 className="text-lg font-black text-slate-800 tracking-tight">{mission.title}</h1>
           <a href={currentNotionUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-[11px] font-black rounded-xl hover:bg-black transition-all shadow-lg active:scale-95">
             <ExternalLink size={14} /> 노션 원본 보기
           </a>
        </div>

        <div className="p-8 space-y-10">
          <div className="bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden relative min-h-[800px]">
            {isIframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-400 font-black text-[11px] uppercase tracking-widest">실무 지침서 로딩 중...</p>
              </div>
            )}
            <iframe
              src={currentNotionUrl}
              className="w-full h-[1200px] border-none"
              onLoad={() => setIsIframeLoading(false)}
              title="Notion Handbook"
            />
          </div>

          <div className="flex justify-center pt-4">
            {!guidebookRead ? (
              <button 
                onClick={handleReadComplete}
                className="px-16 py-6 bg-indigo-600 text-white rounded-[32px] font-black text-xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-4 active:scale-95"
              >
                가이드북 정독 완료 <ArrowRight size={24} />
              </button>
            ) : (
              <div className="flex items-center gap-3 px-10 py-5 bg-emerald-50 text-emerald-700 rounded-full font-black text-base border border-emerald-200">
                <CheckCircle2 size={24} /> 가이드북을 모두 읽었습니다. 이제 아래 퀴즈를 풀어보세요!
              </div>
            )}
          </div>

          {guidebookRead && (
            <div className="bg-white rounded-[40px] p-12 border-2 border-indigo-100 shadow-2xl space-y-10 max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8">
              <h3 className="text-2xl font-black text-slate-900">Sarah 사수의 핵심 역량 검증</h3>
              
              {quizPhase === 'MCQ' && (
                <div className="space-y-8">
                  <p className="text-xl font-bold text-slate-800">Q. {currentQuiz.mcq.q}</p>
                  <div className="grid grid-cols-1 gap-4">
                    {currentQuiz.mcq.options.map((opt: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setMcqValue(i)}
                        className={`p-6 rounded-2xl text-left font-bold border-2 transition-all ${
                          mcqValue === i ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-indigo-200'
                        }`}
                      >
                        {i + 1}. {opt}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={handleMcqSubmit}
                    disabled={mcqValue === null}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl"
                  >
                    정답 확인
                  </button>
                </div>
              )}

              {quizPhase === 'SHORT' && (
                <div className="space-y-8 text-center">
                  <p className="text-xl font-bold text-slate-800">Q. {currentQuiz.short.q}</p>
                  <input 
                    type="text" 
                    value={shortValue}
                    onChange={(e) => setShortValue(e.target.value)}
                    placeholder="정답 입력..."
                    className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[28px] font-black text-2xl text-center focus:border-indigo-500 outline-none shadow-inner"
                  />
                  <button 
                    onClick={handleShortSubmit}
                    disabled={!shortValue.trim()}
                    className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black"
                  >
                    답변 제출
                  </button>
                </div>
              )}

              {quizPhase === 'COMPLETED' && (
                <div className="text-center py-10 space-y-6">
                  <CheckCircle2 size={64} className="text-emerald-500 mx-auto" />
                  <h4 className="text-3xl font-black text-slate-900">미션 클리어!</h4>
                  <p className="text-slate-500 font-bold leading-relaxed">경험치를 획득할 준비가 되었습니다.</p>
                </div>
              )}

              {quizError && <p className="text-red-500 text-center font-bold">{quizError}</p>}
            </div>
          )}
          <div ref={contentEndRef} className="h-20" />
        </div>
      </main>
    </div>
  );
};

export default MissionContentView;
