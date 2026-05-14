import { useState, useCallback } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Rating,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useFavorites } from "@/hooks/useFavourites";
import type { Movie } from "@/hooks/useFetchMovies";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

interface Props {
  movie: Movie;
}

export function MovieCard({ movie }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [optimisticFav, setOptimisticFav] = useState<boolean | null>(null);

  // Stan wyświetlany = optimistic (jeśli ustawiony) ?? rzeczywisty
  const displayedFav = optimisticFav ?? isFavorite(movie.id);

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      // Zapobiegamy otwarciu modala ze szczegółami, jeśli karta docelowo ma być klikalna
      e.stopPropagation();

      // 1. Natychmiast zaktualizuj UI (optimistic)
      setOptimisticFav(!displayedFav);
      try {
        // 2. Wykonaj faktyczną operację
        await toggleFavorite(movie);
        // 3. Wyczyść stan optimistic — rzeczywisty stan zsynchronizowany
        setOptimisticFav(null);
      } catch {
        // 4. Rollback przy błędzie
        setOptimisticFav(null);
      }
    },
    [displayedFav, toggleFavorite, movie],
  );

  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "Brak danych";
  // TMDB daje ocenę w skali 1-10, MUI Rating potrzebuje skali 1-5
  const ratingValue = movie.vote_average ? movie.vote_average / 2 : 0;

  return (
    <Card
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: 3,
        borderRadius: 2,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
          cursor: "pointer",
        },
      }}
    >
      {/* Przycisk ulubionych umieszczony absolutnie na plakacie */}
      <IconButton
        onClick={handleToggle}
        aria-label={displayedFav ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: displayedFav ? "error.main" : "white",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            transform: "scale(1.1)",
          },
          transition: "transform 0.1s ease-in-out",
          zIndex: 2,
        }}
      >
        {displayedFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>

      {/* Plakat filmu */}
      <CardMedia
        component="img"
        image={
          movie.poster_path
            ? `${IMG_BASE}${movie.poster_path}`
            : "/no-poster.png"
        }
        alt={movie.title}
        sx={{
          aspectRatio: "2/3",
          objectFit: "cover",
        }}
      />

      {/* Zawartość tekstowa */}
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: "bold",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            height: "2.6em", // Rezerwuje miejsce na 2 linijki tekstu, żeby karty były równe
          }}
        >
          {movie.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {releaseYear}
        </Typography>

        {/* Ocena filmu za pomocą gwiazdek z MUI */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: "auto" }}>
          <Rating value={ratingValue} precision={0.1} readOnly size="small" />
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {movie.vote_average.toFixed(1)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
