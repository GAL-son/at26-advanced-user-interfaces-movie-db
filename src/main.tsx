import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';

// IMPORT NOWEGO PROVIDERA TOASTÓW
import { ToastProvider } from "@/context/ToastContext";

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

// Nowoczesny, ciemny motyw kinowy w MUI v9
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e50914', // Czerwień w stylu Netflixa
    },
    background: {
      default: '#141414',
      paper: '#1f1f1f',
    },
  },
});

// Funkcja uruchamiająca Mock Service Worker (tylko w trybie DEV)
async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }
  const { worker } = await import('@/mocks/browser');
  return worker.start({ onUnhandledRequest: 'bypass' });
}

// Najpierw odpalamy mocki (jeśli tryb DEV), potem renderujemy aplikację
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          {/* Owijamy App w ToastProvider – dzięki temu alerty MUI przejmą poprawny, ciemny motyw z ThemeProvider */}
          <ToastProvider>
            <App />
          </ToastProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
});