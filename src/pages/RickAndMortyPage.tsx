import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert } from "@mui/material";
import { useCharacters } from "@/hooks/useCharacters";
import { CharacterList } from "@/components/characters/CharacterList";

export default function RickAndMortyPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  
  // Oryginalny stan strony z App.tsx
  const [page, setPage] = useState<number>(1);

  // Kiedy użytkownik wpisuje coś w wyszukiwarkę, resetujemy stronę do 1 (tak jak w oryginalnym onChange)
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Oryginalne pobieranie danych dla rozgrzewki (Rick & Morty)
  const {
    data: ramData,
    isLoading: isRamLoading,
    isError: isRamError,
    error: ramError,
  } = useCharacters(page, searchQuery);

  return (
    <>
      {/* Oryginalny warunek błędu z App.tsx */}
      {isRamError && (
        <Alert severity="error" sx={{ mb: 4 }}>
          Wystąpił błąd:{" "}
          {ramError instanceof Error
            ? ramError.message
            : "Błąd sieci RAM API"}
        </Alert>
      )}

      {/* Oryginalna lista postaci */}
      <CharacterList
        data={ramData}
        page={page}
        setPage={setPage}
        isLoading={isRamLoading}
      />
    </>
  );
}