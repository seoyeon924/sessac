
import React, { useState, useEffect } from 'react';
import MissionView from './MissionView';
import MissionContentView from './MissionContentView';
import { Mission, Lesson, MentorshipProfile, LessonPhase } from '../types';
import { generateMentorDialogueSession } from '../geminiService';
import { Loader2, ChevronLeft, CheckCircle, Play, ArrowRight, MessageCircle, BookOpen, RotateCcw, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MissionSessionProps {
  mission: Mission;
  profile: MentorshipProfile;
  nickname: string;
  onComplete: (xp: number) => void;
  onBack: () => void;
  completedLessonsInMission: Record<string, boolean>;
}

const MissionSession: React.FC<MissionSessionProps> = ({ 
  mission, 
  profile, 
  nickname, 
  onComplete, 
  onBack,
  completedLessonsInMission 
}) => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentPhase, setCurrentPhase] = useState<LessonPhase>('INTRO_CHAT');
  const [sessionCompletedLessons, setSessionCompletedLessons] = useState<Record<string, boolean>>(completedLessonsInMission);
  const [dialogues, setDialogues] = useState<any[]>([]);
  const [isLoadingDialogue, setIsLoadingDialogue] = useState(false);
  const [showReviewMenu, setShowReviewMenu] = useState(false);
  
  // Quiz State
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    setSessionCompletedLessons(completedLessonsInMission);
  }, [completedLessonsInMission]);

  const handleStartLessonFlow = async (lesson: Lesson) => {
    setActiveLesson(lesson);
    if (sessionCompletedLessons[lesson.id]) {
      setShowReviewMenu(true);
    } else {
      setShowReviewMenu(false);
      startIntroChat(lesson);
    }
  };

  const startIntroChat = async (lesson: Lesson) => {
    setCurrentPhase('INTRO_CHAT');
    setIsLoadingDialogue(true);
    const intro = await generateMentorDialogueSession(profile, mission, lesson, 'INTRO', nickname);
    setDialogues(intro);
    setIsLoadingDialogue(false);
  };

  const handleDialogueComplete = () => {
    if (currentPhase === 'INTRO_CHAT') {
      setCurrentPhase('GUIDEBOOK');
    }
  };

  const handleGuidebookComplete = () => {
    if (activeLesson?.quiz) {
      setShowQuiz(true);
    } else {
      finalizeLesson();
    }
  };

  const finalizeLesson = () => {
    if (!activeLesson) return;
    setSessionCompletedLessons(prev => ({ ...prev, [activeLesson.id]: true }));
    setActiveLesson(null);
    setCurrentPhase('INTRO_CHAT');
    setShowQuiz(false);
    setSelectedOption(null);
    setQuizSubmitted(false);
  };

  const isAllCompleted = mission.lessons.every(l => sessionCompletedLessons[l.id]);

  if (activeLesson) {
    // 퀴즈 화면
    if (showQuiz && activeLesson.quiz) {
      const isCorrect = selectedOption === activeLesson.quiz.correctAnswer;
      return (
        <div className="h-full flex items-center justify-center bg-slate-50 p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full bg-white rounded-[40px] shadow-2xl p-10 border border-slate-100">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
              <HelpCircle size={32} />
            </div>
            <h2 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2">실무 역량 퀴즈</h2>
            <p className="text-xl font-black text-slate-900 mb-8 leading-tight">{activeLesson.quiz.question}</p>
            
            <div className="space-y-3 mb-8">
              {activeLesson.quiz.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={quizSubmitted}
                  onClick={() => setSelectedOption(i)}
                  className={`w-full p-5 rounded-2xl text-left font-bold transition-all border-2 ${
                    selectedOption === i 
                      ? quizSubmitted 
                        ? isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-red-500 bg-red-50 text-red-700'
                        : 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  <span className="mr-3 opacity-40">{i + 1}.</span> {opt}
                </button>
              ))}
            </div>

            {quizSubmitted ? (
              <div className="space-y-6">
                <div className={`p-5 rounded-2xl font-bold text-sm ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {isCorrect ? '정답입니다! 실무 개념을 완벽히 이해하셨군요.' : '아쉽네요. 다시 한번 가이드북을 확인해 보세요.'}
                  <p className="mt-2 text-xs opacity-80 leading-relaxed font-medium">{activeLesson.quiz.explanation}</p>
                </div>
                <button 
                  onClick={finalizeLesson}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-black transition-all"
                >
                  레슨 완료 처리하기
                </button>
              </div>
            ) : (
              <button 
                disabled={selectedOption === null}
                onClick={() => setQuizSubmitted(true)}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50"
              >
                정답 제출
              </button>
            )}
          </motion.div>
        </div>
      );
    }

    // 복습 메뉴 선택창
    if (showReviewMenu) {
      return (
        <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6">
          <button onClick={() => setActiveLesson(null)} className="absolute top-8 left-8 text-slate-400 hover:text-slate-600 flex items-center gap-1 font-black text-xs uppercase tracking-widest">
            <ChevronLeft size={16} /> 목록으로 돌아가기
          </button>
          <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-slate-100 p-10 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">이미 완료한 레슨입니다</h2>
            <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">Sarah 사수님의 실습 지시를 다시 듣거나,<br/>실무 지침서 가이드북을 다시 열람할 수 있습니다.</p>
            <div className="space-y-3">
              <button onClick={() => { setShowReviewMenu(false); startIntroChat(activeLesson); }} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                <MessageCircle size={20} /> Sarah와 다시 대화하기
              </button>
              <button onClick={() => { setShowReviewMenu(false); setCurrentPhase('GUIDEBOOK'); }} className="w-full py-4 bg-white text-indigo-600 border-2 border-indigo-50 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-indigo-50 transition-all">
                <BookOpen size={20} /> 가이드북 바로 보기
              </button>
            </div>
          </div>
        </div>
      );
    }

    const isShowingIntroChat = currentPhase === 'INTRO_CHAT';

    return (
      <div className="h-full flex flex-col bg-white">
        <div className="h-12 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => { setActiveLesson(null); }} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 font-black text-[10px] uppercase tracking-widest">
              <ChevronLeft size={16} /> 목록으로
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <h2 className="text-[12px] font-black text-slate-800 tracking-tight">{activeLesson.title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isShowingIntroChat ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {isShowingIntroChat ? 'Mentor Orientation' : 'Reference Handbook'}
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {isShowingIntroChat ? (
            isLoadingDialogue ? (
              <div className="h-full flex flex-col items-center justify-center bg-slate-50/50">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Sarah 사수님께서 실무 자료를 준비 중입니다...</p>
              </div>
            ) : (
              <MissionView dialogues={dialogues} missionTitle={activeLesson.title} onComplete={() => handleDialogueComplete()} isIntro={true} />
            )
          ) : (
            <MissionContentView mission={{ ...mission, id: activeLesson.id, title: activeLesson.title, xpReward: activeLesson.xpReward } as any} profile={profile} onComplete={handleGuidebookComplete} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-12 pb-40">
      <header className="space-y-4">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 font-black text-[10px] uppercase tracking-widest">
          <ChevronLeft size={16} /> 커리큘럼 보관함
        </button>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            {mission.chapter} • {mission.type} COURSE
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{mission.title}</h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-3xl">{mission.description}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3">
        {mission.lessons.map((lesson, idx) => {
          const isPreviousCompleted = idx === 0 || sessionCompletedLessons[mission.lessons[idx-1].id];
          const isCurrentCompleted = !!sessionCompletedLessons[lesson.id];
          return (
            <div key={lesson.id} className={`bg-white rounded-[32px] border-2 transition-all p-6 flex flex-col md:flex-row items-center justify-between gap-6 ${isPreviousCompleted ? 'border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100' : 'opacity-40 border-slate-50 pointer-events-none'}`}>
              <div className="flex items-center gap-5 flex-1">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 ${isCurrentCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {isCurrentCompleted ? <CheckCircle size={28} /> : idx + 1}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-base mb-1 leading-tight">{lesson.title}</h4>
                  <p className="text-xs text-slate-500 font-medium line-clamp-1">{lesson.description}</p>
                </div>
              </div>
              <div className="shrink-0">
                <button onClick={() => handleStartLessonFlow(lesson)} className={`px-8 py-3.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all shadow-xl active:scale-95 ${isCurrentCompleted ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-100 hover:bg-emerald-100' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200'}`}>
                  {isCurrentCompleted ? <><RotateCcw size={16} /> 복습 시작</> : <>레슨 시작 <Play size={14} fill="currentColor" /></>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isAllCompleted && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pt-16 flex flex-col items-center space-y-6">
          <div className="text-center">
             <div className="inline-block p-4 bg-emerald-100 text-emerald-600 rounded-[28px] mb-4">
                <CheckCircle size={48} />
             </div>
             <h2 className="text-2xl font-black text-slate-900 mb-1">모든 레슨 이수 완료!</h2>
             <p className="text-sm text-slate-500 font-bold tracking-tight">훌륭합니다. 이제 챕터 전체 과정을 최종 보고할 수 있습니다.</p>
          </div>
          <button onClick={() => onComplete(mission.xpReward)} className="px-16 py-5 bg-slate-900 text-white rounded-[24px] font-black text-sm shadow-2xl hover:bg-black transition-all flex items-center gap-3 group">
            최종 챕터 이수 보고 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default MissionSession;
