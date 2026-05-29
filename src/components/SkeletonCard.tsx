import { Card, CardContent, Box, Skeleton } from "@mui/material";

export function SkeletonCard() {
  // Globalna reguła stylów dla wyłączenia animacji, gdy użytkownik preferuje zredukowany ruch.
  // Nadpisujemy animację fali na 'none' i ustawiamy stały kolor (statyczny placeholder).
  const reducedMotionStyles = {
    "@media (prefers-reduced-motion: reduce)": {
      animation: "none !important",
      opacity: 0.7, // Delikatne przygaszenie, by statyczny boks wyglądał naturalnie
    },
  };

  return (
    <Card
      aria-hidden="true" // Komunikat dla czytników ekranu (Screen Readers), żeby ignorowały makiety ładowania
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: "100%",
          aspectRatio: "2/3",
          ...reducedMotionStyles, // Wstrzyknięcie reguły mmedia-query
        }}
      />

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}
      >
        <Skeleton
          variant="text"
          animation="wave"
          sx={{ fontSize: "1.25rem", width: "80%", ...reducedMotionStyles }}
        />

        <Skeleton
          variant="text"
          animation="wave"
          sx={{ fontSize: "1.25rem", width: "40%", mb: 1, ...reducedMotionStyles }}
        />

        <Skeleton
          variant="text"
          animation="wave"
          sx={{ fontSize: "0.875rem", width: "25%", ...reducedMotionStyles }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: "auto" }}>
          <Skeleton
            variant="rectangular"
            animation="wave"
            height={18}
            width={80}
            sx={{ borderRadius: 0.5, ...reducedMotionStyles }}
          />
          <Skeleton 
            variant="text" 
            animation="wave" 
            width={20} 
            sx={{ ...reducedMotionStyles }} 
          />
        </Box>
      </CardContent>
    </Card>
  );
}