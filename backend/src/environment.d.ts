declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            JWT_ISS: string;
            CORS_ORIGIN: string;
            PGUSER: string;
            PGPASSWORD: string;
            PGHOST: string;
            PGPORT: string;
            PGDATABASE: string;
        }
    }
}

export {};