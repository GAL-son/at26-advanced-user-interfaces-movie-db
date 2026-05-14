import axios from 'axios';

export const rickAndMortyClient = axios.create({
    baseURL: import.meta.env.VITE_RICK_AND_MORTY_BASE_URL,
});