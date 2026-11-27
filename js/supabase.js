import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.2/+esm";

export const SUPABASE_URL = "https://khszfukekudyripouifm.supabase.co";
export const SUPABASE_KEY = "sb_publishable_XjCVKOZRq1aERqzOGj_tHw_eC4uCXEb";

// 사이트 전체에서 이 클라이언트 1개만 공유합니다. (다른 파일에서 createClient 호출 금지)
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
