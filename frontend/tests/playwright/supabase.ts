import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_PROJECT_URL, process.env.SUPABASE_SECRET_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

export const adminAuthClient = supabase.auth.admin;