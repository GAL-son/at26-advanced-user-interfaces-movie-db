import { useState, useCallback } from 'react';
import type { Movie } from './useFetchMovies';

const STORAGE_KEY = 'movie-browser-favorites';

function loadFavorites(): Movie[] {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
        return [];
    }
}

export function useFavorites() {
    const [favorites, setFavorites] = useState<Movie[]>(loadFavorites);
    const toggleFavorite = useCallback(async (movie: Movie) => {
        setFavorites((prev) => {
            const next = prev.some((m) => m.id === movie.id)
                ? prev.filter((m) => m.id !== movie.id)
                : [...prev, movie];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

            return next;
        });
    }, []);


    const isFavorite = useCallback(
        (id: number) => favorites.some((m) => m.id === id),
        [favorites]
    );

    return { favorites, toggleFavorite, isFavorite };
}