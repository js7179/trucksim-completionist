declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET: string;
            JWT_ISS: string;
            PGUSER: string;
            PGPASSWORD: string;
            PGHOST: string;
            PGPORT: string;
            PGDATABASE: string;
        }
    }
}

export {};