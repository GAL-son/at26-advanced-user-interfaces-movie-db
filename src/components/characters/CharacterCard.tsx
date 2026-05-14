import { Card, CardMedia, CardContent, Typography, Chip } from "@mui/material";

interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  image: string;
}

interface Props {
  character: Character;
}

export function CharacterCard({ character }: Props) {
  // Dobieramy kolor chipu w zależności od statusu postaci
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Alive":
        return "success";
      case "Dead":
        return "error";
      default:
        return "default";
    }
  };

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
        },
      }}
    >
      {/* Status postaci jako absolutnie pozycjonowany Chip */}
      <Chip
        label={character.status}
        color={getStatusColor(character.status)}
        size="small"
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          fontWeight: "bold",
          backdropFilter: "blur(4px)",
          backgroundColor:
            character.status === "unknown"
              ? "rgba(100,100,100,0.8)"
              : undefined,
        }}
      />

      <CardMedia
        component="img"
        image={character.image || "/no-avatar.png"}
        alt={character.name}
        sx={{
          aspectRatio: "1/1", // Postacie z RAM są kwadratowe, wygląda to lepiej niż 2/3
          objectFit: "cover",
        }}
      />

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 0.5 }}
      >
        <Typography
          variant="h6"
          component="h2"
          noWrap={true}
          sx={{
            fontWeight: "bold",
            lineHeight: 1.3,
          }}
        >
          {character.name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Gatunek: {character.species}
        </Typography>
      </CardContent>
    </Card>
  );
}
