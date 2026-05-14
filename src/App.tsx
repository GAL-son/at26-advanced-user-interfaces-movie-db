import { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Grid } from "@mui/material";
import { useCharacters } from "./hooks/useCharacters";

function App() {
  const [page, setPage] = useState(1);
  const [searchName] = useState(""); // Możesz tu później podpiąć TextField z MUI do wyszukiwania

  const { data, isLoading, isError, error, isFetching } = useCharacters(
    page,
    searchName,
  );

  // 1. Stan ładowania (Pierwsze uruchomienie)
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress color="primary" size={60} />
      </Box>
    );
  }

  // 2. Stan błędu
  if (isError) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Wystąpił błąd podczas pobierania danych:{" "}
          {error instanceof Error ? error.message : "Nieznany błąd"}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Nagłówek aplikacji */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h3" component="h1" fontWeight="bold">
          Rick & Morty – Warm-up
        </Typography>
        {isFetching && <CircularProgress size={24} />}{" "}
        {/* Delikatny wskaźnik background fetchingu */}
      </Box>

      {/* Siatka z kartami postaci */}
      <Grid container spacing={3}>
        {data?.results.map((character) => (
          <Grid key={character.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: 3,
              }}
            >
              <CardMedia
                component="img"
                height="220"
                image={character.image}
                alt={character.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" noWrap>
                  {character.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {character.status} — {character.species}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mt: 5,
        }}
      >
        <Button
          variant="contained"
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
        >
          Poprzednia
        </Button>

        <Typography variant="body1" fontWeight="medium">
          Strona {page} z {data?.info.pages || 1}
        </Typography>

        <Button
          variant="contained"
          onClick={() => setPage((old) => (data?.info.next ? old + 1 : old))}
          disabled={!data?.info.next}
        >
          Następna
        </Button>
      </Box>
    </Container>
  );
}

export default App;
