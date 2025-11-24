export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            VITE_SITE_URL: string;
            VITE_API_URL: string;
            VITE_SUPABASE_PROJECT_URL: string;
            VITE_SUPABASE_PUB_KEY: string;
            SUPABASE_SECRET_KEY: string;
            INBUCKET_URL: string;
            [key: string]: string | undefined;
        }
    }
}
