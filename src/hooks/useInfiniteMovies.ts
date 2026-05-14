import { useInfiniteQuery } from '@tanstack/react-query';
import { tmdbClient } from '@/api/tmdbClient';
import type { Movie } from './useFetchMovies';

interface TmdbInfiniteResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export function useInfiniteMovies(query = '') {
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
  });
}