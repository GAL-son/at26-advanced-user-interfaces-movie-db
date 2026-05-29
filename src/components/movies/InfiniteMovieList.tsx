import { useEffect, useRef } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useInfiniteMovies } from "@/hooks/useInfiniteMovies";
import { MovieCard } from "@/components/movies/MovieCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/EmptyState";   
import { useToast } from "@/context/ToastContext"; // <-- IMPORT KOLEI TOASTU

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

interface Props {
  query?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export function InfiniteMovieList({ query = "" }: Props) {
  const { showToast } = useToast(); // Instancja wywoływania toastów
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteMovies(query);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // EFEKT MONITORUJĄCY BŁĘDY W TLE: Reaguje natychmiast na zmianę stanu isError
  useEffect(() => {
    if (isError && error) {
      const errMsg = error instanceof Error ? error.message : "Błąd sieci API";
      showToast(`Problem z przewijaniem: ${errMsg}`);
    }
  }, [isError, error, showToast]);

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

  const movies = data?.pages.flatMap((p) => p.results) ?? [];

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

  if (movies.length === 0 && !isError) {
    return <EmptyState />;
  }

  return (
    <>
      <Grid 
        container 
        spacing={3}
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {movies.map((movie) => (
          <Grid 
            key={movie.id} 
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            component={motion.div}
            variants={itemVariants}
          >
            <MovieCard movie={movie} />
          </Grid>
        ))}

        {isFetchingNextPage &&
          Array.from({ length: 4 }).map((_, i) => (
            <Grid key={`next-sk-${i}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <SkeletonCard />
            </Grid>
          ))}
      </Grid>

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