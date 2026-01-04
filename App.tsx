
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
  
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('tq_user_stats');
    return saved ? JSON.parse(saved) : {
      userName: '', nickname: '', email: '', xp: 0, level: Level.INTERN,
      progress: 0, completedMissions: 0, totalMissions: MISSIONS.length, learningHours: 0
    };
  });

  const syncWithSupabase = useCallback(async (newStats: UserStats) => {
    if (!newStats.email || !isAuthenticated) return;
    
    await supabase.from('profiles').upsert({
      email: newStats.email,
      nickname: newStats.nickname,
      xp: newStats.xp,
      level: newStats.level,
      progress: newStats.progress,
      completed_missions: newStats.completedMissions
    }, { onConflict: 'email' });
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('tq_user_stats', JSON.stringify(stats));
      syncWithSupabase(stats);
    }
  }, [stats, isAuthenticated, syncWithSupabase]);

  const handleLoginComplete = async (user: { name: string; email: string; nickname: string }) => {
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
      // 완료된 미션 상태 복구 (간단히 누적 개수 기반으로 락 해제)
    } else {
      setStats(prev => ({ ...prev, userName: user.name, nickname: user.nickname, email: user.email }));
    }
    
    setIsAuthenticated(true);
    setView(ViewType.DASHBOARD);
  };

  const handleMissionComplete = (xpGain: number) => {
    if (!activeMission) return;
    const isFirstComplete = !missionStates[activeMission.id];
    setMissionStates(prev => ({ ...prev, [activeMission.id]: true }));
    
    setStats(prev => {
      const newXp = prev.xp + xpGain;
      const newCompletedCount = isFirstComplete ? prev.completedMissions + 1 : prev.completedMissions;
      const newProgress = Math.min(100, Math.floor((newCompletedCount / prev.totalMissions) * 100));
      
      let newLevel = prev.level;
      if (newXp >= 3000) newLevel = Level.BI_ENGINEER;
      else if (newXp >= 2000) newLevel = Level.SENIOR;
      else if (newXp >= 1000) newLevel = Level.ANALYST;
      else if (newXp >= 300) newLevel = Level.JUNIOR;

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedMissions: newCompletedCount,
        progress: newProgress
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
              <h2 className="text-2xl font-bold text-slate-800">커리큘럼 보관함</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              completedLessonsInMission={{}} 
            />
          )}
          {currentView === ViewType.GALLERY && <GalleryView stats={stats} onPostCreated={(xp) => setStats(prev => ({...prev, xp: prev.xp + xp}))} />}
          {currentView === ViewType.LEADERBOARD && <Leaderboard stats={stats} />}
        </main>
      </div>
    </div>
  );
};

export default App;
