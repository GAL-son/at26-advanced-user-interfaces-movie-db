import { useEffect, useRef } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useInfiniteMovies } from "@/hooks/useInfiniteMovies";
import { MovieCard } from "@/components/movies/MovieCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { ErrorBanner } from "@/components/ErrorBanner"; 
import { EmptyState } from "@/components/EmptyState";   

interface Props {
  query?: string;
}

export function InfiniteMovieList({ query = "" }: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteMovies(query);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Mapujemy strukturę stron React Query (pages) na płaską tablicę filmów
  const movies = data?.pages.flatMap((p) => p.results) ?? [];

  // Pierwsze ładowanie (gdy nie ma jeszcze żadnych danych)
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Grid key={`init-sk-${i}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <SkeletonCard />
          </Grid>
        ))}
      </Grid>
    );
  }

  // Obsługa stanu błędu przy użyciu nowego ErrorBanner
  if (isError) {
    return (
      <ErrorBanner 
        message={error instanceof Error ? error.message : "Wystąpił nieoczekiwany problem z API."}
        onRetry={() => refetch()} // Podpięcie akcji ponowienia zapytania
      />
    );
  }

  // Obsługa pustego stanu (gdy wyszukiwanie nic nie zwróciło)
  if (movies.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {/* Główna siatka filmów */}
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid key={movie.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <MovieCard movie={movie} />
          </Grid>
        ))}

        {/* Jeśli dociągamy kolejną stronę, doklejamy makiety skeletonów na końcu */}
        {isFetchingNextPage &&
          Array.from({ length: 4 }).map((_, i) => (
            <Grid key={`next-sk-${i}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <SkeletonCard />
            </Grid>
          ))}
      </Grid>

      {/* Element "strażnika" obserwowany przez przeglądarkę */}
      <Box
        ref={sentinelRef}
        sx={{
          height: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          width: "100%",
        }}
      >
        {isFetchingNextPage && <CircularProgress size={24} />}
        {!hasNextPage && movies.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            To już wszystkie filmy, które udało się znaleźć.
          </Typography>
        )}
      </Box>
    </>
  );
}