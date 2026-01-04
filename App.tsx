
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import MissionCard from './components/MissionCard';
import MissionSession from './views/MissionSession';
import GalleryView from './views/GalleryView';
import Leaderboard from './views/Leaderboard';
import { ViewType, Level, UserStats, Mission } from './types';
import { MISSIONS } from './constants';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setView] = useState<ViewType>(ViewType.DASHBOARD);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [missionStates, setMissionStates] = useState<Record<string, boolean>>({});
  const [lessonStates, setLessonStates] = useState<Record<string, boolean>>({});
  
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('tq_user_stats');
    return saved ? JSON.parse(saved) : {
      userName: '',
      nickname: '',
      email: '',
      xp: 0,
      level: Level.INTERN,
      progress: 0,
      completedMissions: 0,
      totalMissions: MISSIONS.length,
      learningHours: 0,
      mentorshipProfile: {
        industry: '커머스 (쿠팡, 11번가, 네이버쇼핑 등)',
        role: '데이터 분석가'
      }
    };
  });

  // Supabase 동기화 함수 (에러 로깅 강화)
  const syncWithSupabase = useCallback(async (newStats: UserStats) => {
    if (!newStats.email || !isAuthenticated) return;
    
    // 에러 발생 시 [object Object]가 아닌 상세 내용을 보기 위해 객체 분해 로깅 적용
    const { error } = await supabase
      .from('profiles')
      .upsert({
        email: newStats.email,
        nickname: newStats.nickname,
        xp: newStats.xp,
        level: newStats.level,
        progress: newStats.progress,
        completed_missions: newStats.completedMissions
      }, { onConflict: 'email' });

    if (error) {
      console.error("❌ Supabase Sync Error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      if (error.message.includes("relation \"public.profiles\" does not exist")) {
        console.warn("💡 Tip: Supabase 대시보드 SQL Editor에서 profiles 테이블을 생성해야 합니다.");
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('tq_user_stats', JSON.stringify(stats));
    // 과도한 호출 방지를 위해 stats가 변경될 때마다 동기화 시도 (필요시 debounce 적용 가능)
    const timeoutId = setTimeout(() => {
      syncWithSupabase(stats);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [stats, syncWithSupabase]);

  const handleLoginComplete = async (user: { name: string; email: string; nickname: string }) => {
    // 기존 데이터가 DB에 있는지 먼저 확인 (선택 사항)
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', user.email)
      .single();

    if (existingProfile) {
      setStats({
        ...stats,
        userName: user.name,
        email: user.email,
        nickname: existingProfile.nickname,
        xp: existingProfile.xp,
        level: existingProfile.level as Level,
        progress: existingProfile.progress,
        completedMissions: existingProfile.completed_missions
      });
    } else {
      setStats(prev => ({ 
        ...prev, 
        userName: user.name,
        nickname: user.nickname,
        email: user.email
      }));
    }
    
    setIsAuthenticated(true);
    setView(ViewType.DASHBOARD);
  };

  const addXp = (xpGain: number) => {
    setStats(prev => {
      const newXp = prev.xp + xpGain;
      let newLevel = prev.level;
      if (newXp >= 3000) newLevel = Level.BI_ENGINEER;
      else if (newXp >= 2000) newLevel = Level.SENIOR;
      else if (newXp >= 1000) newLevel = Level.ANALYST;
      else if (newXp >= 300) newLevel = Level.JUNIOR;

      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  const handleMissionComplete = (xpGain: number) => {
    if (!activeMission) return;
    const isFirstComplete = !missionStates[activeMission.id];
    setMissionStates(prev => ({ ...prev, [activeMission.id]: true }));
    
    setStats(prev => {
      const newXp = prev.xp + xpGain;
      const newCompletedCount = isFirstComplete ? prev.completedMissions + 1 : prev.completedMissions;
      const newProgress = Math.min(100, Math.floor((newCompletedCount / prev.totalMissions) * 100));
      return {
        ...prev,
        xp: newXp,
        completedMissions: newCompletedCount,
        progress: newProgress,
        learningHours: prev.learningHours + 1
      };
    });
    setActiveMission(null);
    setView(ViewType.MISSION_ARCHIVE);
  };

  if (!isAuthenticated) return <Login onComplete={handleLoginComplete} />;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={currentView} setView={setView} />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar stats={stats} />
        <main className="flex-1 overflow-y-auto">
          {currentView === ViewType.DASHBOARD && <Dashboard stats={stats} onNavigateToArchive={() => setView(ViewType.MISSION_ARCHIVE)} />}
          {currentView === ViewType.MISSION_ARCHIVE && (
            <div className="p-8 max-w-7xl mx-auto space-y-8">
              <h2 className="text-3xl font-black text-slate-800">커리큘럼 보관함</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MISSIONS.map((m, idx) => (
                  <MissionCard 
                    key={m.id} 
                    mission={{...m, isCompleted: !!missionStates[m.id]}} 
                    onStart={() => { setActiveMission(m); setView(ViewType.MISSION_DETAIL); }} 
                    isLocked={idx > stats.completedMissions} 
                  />
                ))}
              </div>
            </div>
          )}
          {currentView === ViewType.MISSION_DETAIL && activeMission && (
            <MissionSession 
              mission={activeMission} 
              profile={stats.mentorshipProfile as any} 
              nickname={stats.nickname} 
              onComplete={handleMissionComplete} 
              onBack={() => setView(ViewType.MISSION_ARCHIVE)} 
              completedLessonsInMission={lessonStates} 
            />
          )}
          {currentView === ViewType.GALLERY && <GalleryView stats={stats} onPostCreated={addXp} />}
          {currentView === ViewType.LEADERBOARD && <Leaderboard stats={stats} />}
        </main>
      </div>
    </div>
  );
};

export default App;
