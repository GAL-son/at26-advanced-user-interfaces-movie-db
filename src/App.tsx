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
import SearchIcon from "@mui/icons-material/Search";
import MovieIcon from "@mui/icons-material/Movie";
import PeopleIcon from "@mui/icons-material/People";

// 1. IMPORTY FRAMER MOTION
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

// Importy przy użyciu skonfigurowanych aliasów @/
import { useCharacters } from "@/hooks/useCharacters";
import { useFetchMovies } from "@/hooks/useFetchMovies";
import { InfiniteMovieList } from "./components/movies/InfiniteMovieList";
import { CharacterList } from "./components/characters/CharacterList";

// 2. DEFINICJA WARIANTÓW ANIMACJI (dokładnie wg wytycznych wykładowcy)
const pageVariants: Variants = {
  initial: { opacity: 0, x: -16 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: "easeOut" },
  },
  exit: { opacity: 0, x: 16, transition: { duration: 0.18, ease: "easeIn" } },
};

function App() {
  const [currentTab, setCurrentTab] = useState<number>(0); // 0 = Filmy, 1 = Rick & Morty
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Pobieranie danych dla filmów
  const { error: moviesError, isFetching: isMoviesFetching } = useFetchMovies(
    page,
    searchQuery,
  );

  // Pobieranie danych dla rozgrzewki (Rick & Morty)
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
            setPage(1);
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

      {/* 3. ANIMOWANA ZMIANA TREŚCI Z UŻYCIEM ANIMATEPRESENCE */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab} // Klucz oparty o stan tabu zmusza komponent do ponownego montowania i uruchamia animację exit/initial
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ width: "100%" }} // Rozwiązuje problem ewentualnego kurczenia się siatki przy transformacjach x
        >
          {currentTab === 0 ? (
            // RENDEROWANIE FILMÓW (Zarządza swoimi wewnętrznymi skeletonami i błędami w InfiniteMovieList)
            <InfiniteMovieList query={searchQuery} />
          ) : (
            // RENDEROWANIE RICK & MORTY
            <>
              {isRamError && (
                <Alert severity="error" sx={{ mb: 4 }}>
                  Wystąpił błąd:{" "}
                  {ramError instanceof Error
                    ? ramError.message
                    : "Błąd sieci RAM API"}
                </Alert>
              )}
              <CharacterList
                data={ramData}
                page={page}
                setPage={setPage}
                isLoading={isRamLoading}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </Container>
  );
}

export default App;
