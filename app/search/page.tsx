"use client";

import { useSearch, Movie, TVShow } from "@/services/queries";
import { MovieCard } from "@/components/MovieCard";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { data, isLoading } = useSearch(query);

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 container mx-auto px-4 pb-20">
      <h1 className="text-3xl font-bold mb-8">
        Search Results for &quot;{query}&quot;
      </h1>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
          {data?.results
            ?.filter(
              (item: Movie | TVShow) =>
                item.media_type === "movie" || item.media_type === "tv",
            )
            .map((item: Movie | TVShow) => (
              <MovieCard
                key={item.id}
                item={item}
                type={
                  (item.media_type as "movie" | "tv") ||
                  (item.name ? "tv" : "movie")
                }
              />
            ))}
          {data?.results?.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-20">
              No results found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
