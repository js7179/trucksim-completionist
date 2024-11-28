export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            VITE_SITE_URL: string;
            VITE_SUPABASE_PROJECT_URL: string;
            VITE_SUPABASE_ANON_KEY: string;
            SUPABASE_SERVICE_KEY: string;
            INBUCKET_URL: string;
            [key: string]: string | undefined;
        }
    }
}
