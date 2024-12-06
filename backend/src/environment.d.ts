declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET: string;
            JWT_ISS: string;
        }
    }
}

export {};