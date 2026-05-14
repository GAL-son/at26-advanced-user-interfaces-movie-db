import { http, HttpResponse, delay } from 'msw';

// Pobieramy adresy bazowe ze zmiennych środowiskowych
const TMDB_BASE = import.meta.env.VITE_TMDB_BASE_URL;
const RAM_BASE = import.meta.env.VITE_RICK_AND_MORTY_BASE_URL;

export const handlers = [
  http.get(`${TMDB_BASE}/movie/popular`, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const shouldError = url.searchParams.get('error') === 'true';

    await delay(800); 

    if (shouldError) {
      return HttpResponse.json(
        { status_message: 'Invalid API key lub sztuczny błąd testowy.' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      page,
      total_pages: 10,
      results: Array.from({ length: 12 }, (_, i) => ({
        id: page * 100 + i,
        title: `Film testowy ${page}-${i + 1}`,
        overview: 'Wygenerowany automatycznie opis filmu przez Mock Service Worker na potrzeby laboratorium.',
        poster_path: null, 
        release_date: '2026-01-01',
        vote_average: 5.5 + (i % 5), 
        genre_ids: [28, 12],
      })),
    });
  }),

  http.get(`${RAM_BASE}/character`, () => {
    return HttpResponse.json({
      info: { count: 2, pages: 1, next: null },
      results: [
        { id: 1, name: 'Mockowany Rick', status: 'Alive', species: 'Human', image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg' },
        { id: 2, name: 'Mockowany Morty', status: 'Alive', species: 'Human', image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg' },
      ],
    });
  }),
];