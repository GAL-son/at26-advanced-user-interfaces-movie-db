import { useInfiniteQuery } from '@tanstack/react-query';
import { tmdbClient } from '@/api/tmdbClient';
import { useToast } from '@/context/ToastContext'; // <-- IMPORTUJEMY TOAST
import type { Movie } from './useFetchMovies';

interface TmdbInfiniteResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export function useInfiniteMovies(query = '') {
  const { showToast } = useToast(); // <-- POBIERAMY FUNKCJĘ POKAZYWANIA TOASTÓW

  return useInfiniteQuery<TmdbInfiniteResponse>({
    queryKey: ['movies', 'infinite', query],
    queryFn: async ({ pageParam = 1 }) => {
      const endpoint = query ? '/search/movie' : '/movie/popular';
      
      const { data } = await tmdbClient.get<TmdbInfiniteResponse>(endpoint, {
        params: {
          page: pageParam as number,
          ...(query ? { query } : {}),
        },
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,

    // GWARANCJA WYŁAPANIA BŁĘDU: 
    // Każda porażka (również zapytania o 3. stronę) odpyta ten callback
    meta: {
      onError: (error: unknown) => {
        const errMsg = error instanceof Error ? error.message : "Błąd sieci API";
        showToast(`Problem z przewijaniem: ${errMsg}`);
      }
    }
  });
}