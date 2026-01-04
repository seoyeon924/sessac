import { createClient } from '@supabase/supabase-js';

/**
 * 🛠️ Supabase 연동 정보
 * import.meta.env가 정의되지 않은 환경에서도 안전하게 작동하도록 수정되었습니다.
 */
const getSupabaseConfig = () => {
  // 기본값 (연동 정보)
  let url = 'https://tgnadgsvoerlgcfgpexq.supabase.co';
  let key = 'sb_publishable_rUKFpnXuxlqBmyrFbgIzNQ_lVpI-wTC';

  try {
    // Vite 환경 변수가 있을 경우에만 덮어쓰기
    // @ts-ignore
    const env = (import.meta as any)?.env;
    if (env?.VITE_SUPABASE_URL) url = env.VITE_SUPABASE_URL;
    if (env?.VITE_SUPABASE_ANON_KEY) key = env.VITE_SUPABASE_ANON_KEY;
  } catch (e) {
    console.warn("환경 변수 접근 중 경고: 기본 설정을 사용합니다.");
  }

  return { url, key };
};

const { url: SUPABASE_URL, key: SUPABASE_ANON_KEY } = getSupabaseConfig();

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
