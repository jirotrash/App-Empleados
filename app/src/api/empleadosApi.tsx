import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_BASE = 'http://192.168.42.155:3000/api/dsm44';

export const empleadosApi = axios.create({
    baseURL: DEFAULT_BASE,
    timeout: 10000,
});

export const buildApiBaseFromInput = (ipOrUrl: string) => {
    const raw = (ipOrUrl || '').toString().trim();
    if (!raw) return DEFAULT_BASE;

    if (raw.startsWith('http://') || raw.startsWith('https://')) {
        const noSlash = raw.replace(/\/$/, '');
        return noSlash.includes('/api') ? noSlash : `${noSlash}/api/dsm44`;
    }

    
    const cleaned = raw.replace(/\/$/, '');

    
    if (/:[0-9]+$/.test(cleaned)) {
        return `http://${cleaned}/api/dsm44`;
    }

    return `http://${cleaned}:3000/api/dsm44`;
};

export const setApiBaseUrl = async (ipOrUrl: string) => {
    try {
        const url = buildApiBaseFromInput(ipOrUrl);
        empleadosApi.defaults.baseURL = url;
        await AsyncStorage.setItem('@api_base', url);
        return url;
    } catch (err) {
        console.warn('setApiBaseUrl error', err);
        throw err;
    }
};

export const loadApiBaseUrl = async () => {
    try {
        const stored = await AsyncStorage.getItem('@api_base');
        if (stored) {
            empleadosApi.defaults.baseURL = stored;
            return stored;
        }
        return DEFAULT_BASE;
    } catch (err) {
        console.warn('loadApiBaseUrl error', err);
        return DEFAULT_BASE;
    }
};

export const getStoredApiBase = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem('@api_base');
    } catch (err) {
        console.warn('getStoredApiBase error', err);
        return null;
    }
};

export const clearApiBase = async () => {
    try {
        await AsyncStorage.removeItem('@api_base');
        empleadosApi.defaults.baseURL = DEFAULT_BASE;
    } catch (err) {
        console.warn('clearApiBase error', err);
    }
};

export default empleadosApi;