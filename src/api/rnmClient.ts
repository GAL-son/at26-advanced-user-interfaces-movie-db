import axios from 'axios';

export const rnmClient = axios.create({
    baseURL: import.meta.env.VITE_RICK_AND_MORTY_BASE_URL,
});