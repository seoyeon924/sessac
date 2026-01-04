
import React, { useState, useEffect } from 'react';
import { Bell, Flame, Zap, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserStats } from '../types';
import { supabase } from '../supabaseClient';

interface TopBarProps {
  stats: UserStats;
}

const TopBar: React.FC<TopBarProps> = ({ stats }) => {
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error) throw error;
        setDbStatus('connected');
      } catch (err) {
        console.error("DB Connection Check Failed:", err);
        setDbStatus('error');
      }
    };
    checkConnection();
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full text-amber-600 text-sm font-bold">
          <Flame size={16} />
          <span>7일 연속 출석</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-indigo-600 text-sm font-bold">
          <Zap size={16} />
          <span>{stats.xp} XP</span>
        </div>
        
        {/* DB 연결 상태 표시등 */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
          dbStatus === 'connected' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
          dbStatus === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-100'
        }`}>
          <Database size={12} />
          <span>DB: {dbStatus === 'connected' ? 'LIVE' : dbStatus === 'error' ? 'OFFLINE' : 'SYNCING'}</span>
          {dbStatus === 'connected' ? <CheckCircle2 size={10} /> : dbStatus === 'error' ? <AlertCircle size={10} /> : null}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
        </button>
        <div className="h-8 w-px bg-slate-200" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">{stats.nickname || stats.userName || "홍길동"}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stats.level}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stats.nickname || 'default'}`} alt="Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
