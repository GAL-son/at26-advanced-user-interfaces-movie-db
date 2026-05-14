import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";
import MovieIcon from "@mui/icons-material/Movie";
import PeopleIcon from "@mui/icons-material/People";

// Importy przy użyciu skonfigurowanych aliasów @/
import { useCharacters } from "@/hooks/useCharacters";
import { useFetchMovies } from "@/hooks/useFetchMovies";
import { SkeletonCard } from "@/components/SkeletonCard";
import { InfiniteMovieList } from "./components/movies/InfiniteMovieList";
import { CharacterList } from "./components/characters/CharacterList";

function App() {
  const [currentTab, setCurrentTab] = useState<number>(0); // 0 = Filmy, 1 = Rick & Morty
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 1. Pobieranie danych dla filmów (TMDB / MSW)
  const {
    isLoading: isMoviesLoading,
    isError: isMoviesError,
    error: moviesError,
    isFetching: isMoviesFetching,
  } = useFetchMovies(page, searchQuery);

  // 2. Pobieranie danych dla rozgrzewki (Rick & Morty)
  const {
    data: ramData,
    isLoading: isRamLoading,
    isError: isRamError,
    error: ramError,
    isFetching: isRamFetching,
  } = useCharacters(page, currentTab === 1 ? searchQuery : "");

  // Obsługa zmiany zakładki (resetuje stronę i wyszukiwanie)
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setPage(1);
    setSearchQuery("");
  };

  // Flagi pomocnicze do zarządzania stanem UI
  const isLoading = currentTab === 0 ? isMoviesLoading : isRamLoading;
  const isError = currentTab === 0 ? isMoviesError : isRamError;
  const currentError = currentTab === 0 ? moviesError : ramError;
  const isFetching = currentTab === 0 ? isMoviesFetching : isRamFetching;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* NAGŁÓWEK APLIKACJI */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: "bold", letterSpacing: -1 }}
        >
          🍿 Movie
          <Box component="span" sx={{ color: "primary.main" }}>
            Browser
          </Box>
        </Typography>
        {isFetching && <CircularProgress size={24} />}
      </Box>

      {/* PASEK NAWIGACYJNY (TABS) */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="Główna nawigacja"
        >
          <Tab
            icon={<MovieIcon />}
            iconPosition="start"
            label="Przeglądarka Filmów"
          />
          <Tab
            icon={<PeopleIcon />}
            iconPosition="start"
            label="Rick & Morty (Warm-up)"
          />
        </Tabs>

        {/* DYNAMICZNA WYSZUKIWARKA */}
        <TextField
          size="small"
          placeholder={
            currentTab === 0 ? "Szukaj filmu..." : "Szukaj postaci..."
          }
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1); // Powrót na 1 stronę przy nowym szukaniu
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: { xs: "100%", sm: 300 } }}
        />
      </Box>

      {/* OBSŁUGA STANU BŁĘDU */}
      {isError && (
        <Alert severity="error" sx={{ mb: 4 }}>
          Wystąpił błąd:{" "}
          {currentError instanceof Error
            ? currentError.message
            : "Błąd autoryzacji lub sieci"}
        </Alert>
      )}

      {/* SIATKA DANYCH (GRID) */}
      <Grid container spacing={3}>
        {isLoading ? (
          // Jeśli trwa pierwsze ładowanie, renderuj siatkę 12 skeletonów
          Array.from({ length: 12 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <SkeletonCard />
            </Grid>
          ))
        ) : currentTab === 0 ? (
          // RENDEROWANIE FILMÓW (TMDB / MSW)
          <InfiniteMovieList query={searchQuery} />
        ) : (
          <CharacterList
            data={ramData}
            page={page}
            setPage={setPage}
            isLoading={isRamLoading}
          />
        )}
      </Grid>
    </Container>
  );
}

export default App;
