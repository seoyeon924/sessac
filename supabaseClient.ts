import { createClient } from '@supabase/supabase-js';

/**
 * 🛠️ Supabase 연동 정보
 * Vite 환경에서는 import.meta.env를 통해 VITE_로 시작하는 환경 변수에 접근합니다.
 * 브라우저 환경에서 env가 정의되지 않은 경우(예: 빌드 도구 없이 직접 실행)를 대비해 
 * 선택적 체이닝(?.)을 사용하여 크래시를 방지합니다.
 */
const env = (import.meta as any).env;
const SUPABASE_URL = env?.VITE_SUPABASE_URL || 'https://tgnadgsvoerlgcfgpexq.supabase.co';
const SUPABASE_ANON_KEY = env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_rUKFpnXuxlqBmyrFbgIzNQ_lVpI-wTC';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);