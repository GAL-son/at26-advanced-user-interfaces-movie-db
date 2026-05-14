import { useQuery } from '@tanstack/react-query';
import { tmdbClient } from '../api/tmdbClient';
import { QUERY_KEYS } from '../constants/queryKeys';


export function useMovieDetails(id: number | null) {
    return useQuery({
        queryKey: QUERY_KEYS.movies.detail(id ?? 0),

        queryFn: async () => {
            const { data } = await tmdbClient.get(`/movie/${id}`);
            return data;
        },

        enabled: id !== null, // pobiera TYLKO gdy modal otwarty
    });
}