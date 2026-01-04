
import React, { useState } from 'react';
import { TargetIndustry, TargetRole, MentorshipProfile } from '../types';
import { Briefcase, Building2, ChevronRight, Sparkles } from 'lucide-react';

interface Props {
  onComplete: (profile: MentorshipProfile) => void;
}

const MentorshipProfileSetup: React.FC<Props> = ({ onComplete }) => {
  const [industry, setIndustry] = useState<TargetIndustry | null>(null);
  const [role, setRole] = useState<TargetRole | null>(null);

  const industries: TargetIndustry[] = [
    '커머스 (쿠팡, 11번가, 네이버쇼핑 등)',
    '금융/핀테크 (토스, 카카오뱅크, 뱅크샐러드 등)',
    '모빌리티/제조 (현대자동차, 쏘카, 타다 등)'
  ];

  const roles: TargetRole[] = ['데이터 분석가', 'BI 엔지니어', '그로스 마케터'];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles size={14} /> Career Personalization
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">나만의 1:1 사수 매칭</h1>
          <p className="text-slate-500 font-medium">희망하시는 산업군과 직무를 선택해 주세요. <br/> Sarah 멘토가 해당 실무 환경에 맞춘 전문적인 가이드를 시작합니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Building2 size={24} />
              </div>
              <h2 className="text-xl font-black text-slate-800">Target Industry</h2>
            </div>
            <div className="space-y-4 flex-1">
              {industries.map((i) => (
                <button
                  key={i}
                  onClick={() => setIndustry(i)}
                  className={`w-full p-6 text-left rounded-3xl border-2 transition-all font-bold text-sm leading-relaxed ${
                    industry === i ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' : 'border-slate-50 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Briefcase size={24} />
              </div>
              <h2 className="text-xl font-black text-slate-800">Target Role</h2>
            </div>
            <div className="space-y-4 flex-1">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`w-full p-6 text-left rounded-3xl border-2 transition-all font-bold text-base ${
                    role === r ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' : 'border-slate-50 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <button
            disabled={!industry || !role}
            onClick={() => industry && role && onComplete({ industry, role })}
            className="px-16 py-6 bg-indigo-600 text-white font-black rounded-[28px] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 flex items-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed group active:scale-95"
          >
            Sarah 멘토와 오리엔테이션 시작 <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorshipProfileSetup;
