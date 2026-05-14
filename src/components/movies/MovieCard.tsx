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

  const displayedFav = optimisticFav ?? isFavorite(movie.id);

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      setOptimisticFav(!displayedFav);
      try {
        await toggleFavorite(movie);
        setOptimisticFav(null);
      } catch {
        setOptimisticFav(null);
      }
    },
    [displayedFav, toggleFavorite, movie],
  );

  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "Brak danych";
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
            height: "2.6em",
          }}
        >
          {movie.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {releaseYear}
        </Typography>

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
