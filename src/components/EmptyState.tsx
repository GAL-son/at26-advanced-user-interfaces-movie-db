import { Box, Typography } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";

interface Props {
  title?: string;
  description?: string;
}

export function EmptyState({ title, description }: Props) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 2,
        textAlign: "center",
        gap: 1.5,
      }}
    >
      <SearchOffIcon
        sx={{ fontSize: 64, color: "text.secondary", opacity: 0.7 }}
      />

      <Typography variant="h5" color="text.primary" sx={{ fontWeight: "bold" }}>
        {title || "Brak wyników wyszukiwania"}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
        {description ||
          "Nie znaleźliśmy żadnych pozycji pasujących do Twojego zapytania. Sprawdź pisownię lub spróbuj wpisać coś innego."}
      </Typography>
    </Box>
  );
}
