import { useSearchParams } from "react-router-dom";
import { InfiniteMovieList } from "@/components/movies/InfiniteMovieList";

export default function MoviesPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  return <InfiniteMovieList query={searchQuery} />;
}