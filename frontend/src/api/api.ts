import axios, { InternalAxiosRequestConfig } from "axios";
import { auth } from '@/supabase';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

async function authorizationHeader(config: InternalAxiosRequestConfig) {
    const sessionData = (await auth.getSession()).data.session;
    if(sessionData === null) {
        return config;
    }
    config.headers.Authorization = `Bearer ${sessionData.access_token}`;
    return config;
}

api.interceptors.request.use(authorizationHeader);

export async function testUser(): Promise<string> {
    const res = await api.get('/testauth');
    return res.data.uuid as string;
}