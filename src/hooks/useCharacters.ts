import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constants/queryKeys';
import { rnmClient } from '@/api/rnmClient'; 

export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  image: string;
}

interface RamResponse {
  info: { count: number; pages: number; next: string | null };
  results: Character[];
}

export function useCharacters(page = 1, name = '') {
  return useQuery({
    queryKey: [...QUERY_KEYS.characters.page(page), name],
    queryFn: async () => {
      const { data } = await rnmClient.get<RamResponse>('/character', {
        params: {
          page,
          ...(name ? { name } : {}), 
        },
      });
      return data;
    },
    placeholderData: (prev) => prev,
  });
}