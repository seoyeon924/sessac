
import React from 'react';
import { LayoutDashboard, Target, Trophy, Settings, GraduationCap, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: ViewType.DASHBOARD, label: '나의 대시보드', icon: LayoutDashboard },
    { id: ViewType.MISSION_ARCHIVE, label: '커리큘럼 보관함', icon: Target },
    { id: ViewType.GALLERY, label: '커뮤니티 갤러리', icon: ImageIcon },
    { id: ViewType.LEADERBOARD, label: 'BI 랭킹', icon: Trophy },
  ];

  return (
    <aside className="w-64 bg-slate-900 flex flex-col h-screen sticky top-0 z-20 text-white">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
            TQ
          </div>
          <div>
            <h1 className="font-black text-white tracking-tight text-lg leading-none">TableauQuest</h1>
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">BI Hero Academy</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentView === item.id
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'
            }`}
          >
            <item.icon size={18} />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4">
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <GraduationCap size={16} />
            <span className="text-[9px] font-black uppercase tracking-widest">SeSAC Seongdong</span>
          </div>
          <p className="text-xs font-bold text-slate-200">전서연 강사</p>
          <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">BI 데이터 엔지니어링 실무</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
