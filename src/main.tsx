import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import App from './App';
import { ToastProvider } from "@/context/ToastContext";

// IMPORT WŁAŚCIWYCH KOMPONENTÓW STRON
import MoviesPage from '@/pages/MoviesPage';
import RickAndMortyPage from '@/pages/RickAndMortyPage';

import ReactGA from "react-ga4";

// Konfiguracja routingu z pełnymi podstronami
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // Główny layout (z nagłówkiem i wyszukiwarką)
    children: [
      {
        path: '',
        element: <Navigate to="/movies" replace />, // Przekierowanie roota na /movies
      },
      {
        path: 'movies',
        element: <MoviesPage />, // Poprawny komponent filmów
      },
      {
        path: 'rick-and-morty',
        element: <RickAndMortyPage />, // Poprawny komponent Rick & Morty
      },
    ],
  },
]);

// Konfiguracja globalna React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minut
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Nowoczesny, ciemny motyw kinowy w MUI
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e50914',
    },
    background: {
      default: '#141414',
      paper: '#1f1f1f',
    },
  },
});

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }
  const { worker } = await import('@/mocks/browser');
  return worker.start({ onUnhandledRequest: 'bypass' });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <ToastProvider>
            {/* RouterProvider zarządza teraz renderowaniem całego drzewa */}
            <RouterProvider router={router} />
          </ToastProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
});

ReactGA.initialize("G-TEST123456", {
  gaOptions: { anonymize_ip: true } // RODO: Anonimizacja IP
});