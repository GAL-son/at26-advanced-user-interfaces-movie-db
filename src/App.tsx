import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MovieIcon from "@mui/icons-material/Movie";
import PeopleIcon from "@mui/icons-material/People";
import { useIsFetching } from "@tanstack/react-query";
import { useState, useEffect } from "react";

// React Router i Framer Motion
import { Outlet, Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

import ReactGA from "react-ga4";

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
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Dynamicznie sprawdzamy, czy jakikolwiek hook z React Query akurat pobiera dane
  const isFetchingGlobal = useIsFetching() > 0;

  // Mapowanie ścieżki na indeks zakładki MUI
  const getTabIndex = (pathname: string) => {
    if (pathname.startsWith("/rick-and-morty")) return 1;
    return 0; // domyślnie /movies
  };

  const currentTab = getTabIndex(location.pathname);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  // Aktualizacja lokalnego inputa, jeśli zmienią się parametry URL z zewnątrz
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    // Wysyła informację do GA4 przy każdej zmianie ścieżki (URL)
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search
    });
  }, [location]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    const targetPath = newValue === 0 ? "/movies" : "/rick-and-morty";

    // Zdarzenie 1: Kliknięcie CTA / Przełączenie zakładki nawigacji
    ReactGA.event("cta_click", {
      location: "main_navigation",
      target_tab: targetPath
    });

    navigate(targetPath);
    setSearchQuery("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value) {
      setSearchParams({ search: value });

      // Zdarzenie 2: Wyszukiwanie (Submit/Wpisanie frazy)
      ReactGA.event("search_submit", {
        search_term: value
      });
    } else {
      // Zdarzenie 3: Porzucenie wyszukiwania (wyczyszczenie inputa)
      ReactGA.event("search_abandoned", {
        reason: "clear_input"
      });

      searchParams.delete("search");
      setSearchParams(searchParams);
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* NAGŁÓWEK APLIKACJI */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: "bold", letterSpacing: -1 }}>
          🍿 Movie
          <Box component="span" sx={{ color: "primary.main" }}>
            Browser
          </Box>
        </Typography>
        {isFetchingGlobal && <CircularProgress size={24} />}
      </Box>

      {/* PASEK NAWIGACYJNY (TABS) ZINTEGROWANY Z ROUTEREM */}
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
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="Główna nawigacja">
          <Tab icon={<MovieIcon />} iconPosition="start" label="Przeglądarka Filmów" />
          <Tab icon={<PeopleIcon />} iconPosition="start" label="Rick & Morty (Warm-up)" />
        </Tabs>

        {/* DYNAMICZNA WYSZUKIWARKA */}
        <TextField
          size="small"
          placeholder={currentTab === 0 ? "Szukaj filmu..." : "Szukaj postaci..."}
          value={searchQuery}
          onChange={handleSearchChange}
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

      {/* ANIMOWANA ZMIANA STRON */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname} // Klucz oparty o pathname odpala animację przy przejściu między URL
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ width: "100%" }}
        >
          {/* Miejsce na podmontowanie podstron (MoviesPage / RickAndMortyPage) */}
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </Container>
  );
}

export default App;

/**
 * DOKUMENTACJA ZGODNOŚCI Z RODO (Zasada minimalizacji danych):
 * * W projekcie zbierane są wyłącznie anonimowe dane analityczne:
 * 1. pageview (URL ścieżki) - niezbędne do analizy, które sekcje aplikacji są popularne.
 * 2. cta_click (nazwa zakładki) - określa zaangażowanie w nawigację.
 * 3. search_submit / search_abandoned (fraz wyszukiwania) - pozwala optymalizować trafność wyników API.
 *
 * Dlaczego są niezbędne: Dane te nie zawierają żadnych informacji pozwalających na identyfikację użytkownika 
 * (PII - Personally Identifiable Information). Adresy IP są przymusowo anonimizowane na poziomie konfiguracji 
 * (anonymize_ip: true). Zbieranie tych danych opiera się na uzasadnionym interesie administratora w celu 
 * poprawy działania interfejsu (UX), bez naruszania prywatności użytkowników.
 */