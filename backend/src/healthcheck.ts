import express from "express";
import pg from 'pg';


interface HealthCheckInterface {
    isAppHealthOK(): Promise<boolean>;
}

export class HealthCheck implements HealthCheckInterface {
    private dbClient: pg.Pool;

    constructor(dbClient: pg.Pool) {
        this.dbClient = dbClient;
    }
    
    async isAppHealthOK(): Promise<boolean> {
        try {
            const qResult = await this.dbClient.query('SELECT NOW();');
            return (qResult.rowCount ?? 0) > 0;
        } catch(err) {
            console.error(err);
            return false;
        } 
    }
}

export function buildHcApp(healthChecker: HealthCheckInterface) {
    const hcApp = express();

    hcApp.get('/health', async (req, res) => {
        const hcResult = await healthChecker.isAppHealthOK();
        if(hcResult) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    });

    return hcApp;
}

