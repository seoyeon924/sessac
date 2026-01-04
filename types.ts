

export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  MISSION_ARCHIVE = 'MISSION_ARCHIVE',
  MISSION_DETAIL = 'MISSION_DETAIL',
  LEADERBOARD = 'LEADERBOARD',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  PROFILE_SETUP = 'PROFILE_SETUP',
  GALLERY = 'GALLERY'
}

export enum Level {
  INTERN = 'Lv.1 인턴',
  JUNIOR = 'Lv.2 주니어 분석가',
  ANALYST = 'Lv.3 분석가',
  SENIOR = 'Lv.4 시니어 분석가',
  BI_ENGINEER = 'Lv.5 BI 엔지니어'
}

export type PostCategory = '과제제출' | '대시보드' | '자유';

export interface GalleryComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface GalleryPost {
  id: string;
  category: PostCategory;
  title: string;
  content: string;
  author: string;
  authorNickname: string;
  imageUrl?: string;
  createdAt: string;
  likes: number;
  comments: GalleryComment[];
}

export type TargetIndustry = 
  | '커머스 (쿠팡, 11번가, 네이버쇼핑 등)'
  | '패션/라이프스타일 (지그재그, 무신사, 에이블리 등)'
  | '금융/핀테크 (토스, 카카오뱅크, 뱅크샐러드 등)'
  | '뷰티 (올리브영, 화해, 컬리 뷰티 등)'
  | '모빌리티/제조 (현대자동차, 쏘카, 타다 등)'
  | '기타 일반 IT (당근, 배달의민족 등)';

export type TargetRole = '데이터 분석가' | 'BI 엔지니어' | '서비스 기획자' | '그로스 마케터';

export interface MentorshipProfile {
  industry: TargetIndustry;
  role: TargetRole;
}

// Added missing Proficiency type to fix import errors in PathSetup.tsx and geminiService.ts
export type Proficiency = '입문자' | '중급자' | '숙련자';

// Added missing CareerGoal type to fix import errors in PathSetup.tsx and geminiService.ts
export type CareerGoal = 'BI 엔지니어' | '데이터 분석가' | 'PM/PO' | '비즈니스 애널리스트' | '그로스 마케터';

// Added LearningPath interface to support personalized roadmap features
export interface LearningPath {
  proficiency: Proficiency;
  goal: CareerGoal;
  recommendedMissionIds: string[];
  customPlan: string;
}

export interface UserStats {
  userName: string;
  nickname: string;
  email: string;
  xp: number;
  level: Level;
  progress: number;
  completedMissions: number;
  totalMissions: number;
  learningHours: number;
  mentorshipProfile?: MentorshipProfile;
  // Added learningPath to support career roadmap views
  learningPath?: LearningPath;
}

export interface DialogueNode {
  speaker: string;
  text: string;
  isUserTurn: boolean;
}

export type LessonPhase = 'INTRO_CHAT' | 'GUIDEBOOK' | 'OUTRO_CHAT' | 'COMPLETED';

export interface Mission {
  id: string;
  chapter: string;
  title: string;
  description: string;
  xpReward: number;
  isCompleted: boolean;
  type: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  quiz?: any;
  // Added sections property to fix "Object literal may only specify known properties" errors in constants.tsx
  sections?: any[];
}
