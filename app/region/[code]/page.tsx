"use client";

import { useInfiniteRegionMovies, Movie } from "@/services/queries";
import { MovieCard } from "@/components/MovieCard";
import { LoadMore } from "@/components/LoadMore";
import { use } from "react";

// Map codes to readable names
const REGION_NAMES: Record<string, string> = {
  hi: "Hindi Blockbusters",
  te: "Telugu Hits",
  ta: "Tamil Action",
  pa: "Punjabi Entertainment",
  ur: "Pakistani Content",
  en: "Hollywood",
};

export default function RegionPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);

  const validCode = code as "en" | "hi" | "ur" | "te" | "ta" | "pa";

  // Use the infinite hook
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteRegionMovies(validCode);

  const title = REGION_NAMES[code] || `${code.toUpperCase()} Movies`;
  const movies = data?.pages.flatMap((page) => page.results) || [];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-24 space-y-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">{title}</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {movies.map((item: Movie, index: number) => (
            <MovieCard key={`${item.id}-${index}`} item={item} type="movie" />
          ))}
          {isLoading && (
            <div className="col-span-full text-center py-20">Loading...</div>
          )}
          {!isLoading && movies.length === 0 && (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              No movies found for this region.
            </div>
          )}
        </div>

        <LoadMore
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </div>
  );
}
