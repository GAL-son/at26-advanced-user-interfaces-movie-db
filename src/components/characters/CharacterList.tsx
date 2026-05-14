import { Box, Button, Typography } from "@mui/material";
import { Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CharacterCard } from "./CharacterCard";
import { SkeletonCard } from "@/components/SkeletonCard";

interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  image: string;
}

interface Props {
  data:
    | {
        info: { pages: number; next: string | null };
        results: Character[];
      }
    | undefined;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
}

export function CharacterList({ data, page, setPage, isLoading }: Props) {
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Grid key={`ram-sk-${i}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <SkeletonCard />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <>
      {/* 1. KONTENER SIATKI - TUTAJ ŻYJĄ TYLKO KARTY */}
      <Grid container spacing={3}>
        {data?.results.map((character) => (
          <Grid key={character.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <CharacterCard character={character} />
          </Grid>
        ))}
      </Grid>

      {/* 2. KONTENER PAGINACJI - JEST CAŁKOWICIE ODSADZONY OD SIATKI */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          mt: 6, // Duży margines górny, żeby ładnie odskoczyło od kart
          py: 2,
          width: "100%", // Gwarancja, że boks zajmie całą szerokość i nie ucieknie do boku
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          sx={{ px: 3 }}
        >
          Poprzednia
        </Button>

        <Typography
          variant="body1"
          sx={{ fontWeight: "medium", minWidth: "100px", textAlign: "center" }}
        >
          Strona <strong>{page}</strong> z {data?.info.pages || 1}
        </Typography>

        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => setPage((old) => (data?.info.next ? old + 1 : old))}
          disabled={!data?.info.next}
          sx={{ px: 3 }}
        >
          Następna
        </Button>
      </Box>
    </>
  );
}
