import { Card, CardContent, Box, Skeleton } from "@mui/material";

export function SkeletonCard() {
  return (
    <Card
      aria-hidden="true"
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
        }}
      />

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}
      >
        <Skeleton
          variant="text"
          animation="wave"
          sx={{ fontSize: "1.25rem", width: "80%" }}
        />

        <Skeleton
          variant="text"
          animation="wave"
          sx={{ fontSize: "1.25rem", width: "40%", mb: 1 }}
        />

        <Skeleton
          variant="text"
          animation="wave"
          sx={{ fontSize: "0.875rem", width: "25%" }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: "auto" }}>
          <Skeleton
            variant="rectangular"
            animation="wave"
            height={18}
            width={80}
            sx={{ borderRadius: 0.5 }}
          />
          <Skeleton variant="text" animation="wave" width={20} />
        </Box>
      </CardContent>
    </Card>
  );
}
