/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_SITE_URL: string;
    readonly VITE_API_URL: string;
    readonly VITE_SUPABASE_PROJECT_URL: string;
    readonly VITE_SUPABASE_PUB_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}