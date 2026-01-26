"use client";

import {
  useInfinitePopularMovies,
  useInfiniteTopRatedMovies,
  useInfiniteUpcomingMovies,
} from "@/services/queries";
import { MovieCard } from "@/components/MovieCard";
import { LoadMore } from "@/components/LoadMore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Movie } from "@/services/queries";
import { UseInfiniteQueryResult } from "@tanstack/react-query";

export default function MoviesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-24 space-y-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Movies</h1>

        <Tabs defaultValue="popular" className="space-y-8">
          <TabsList className="bg-secondary/20">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="top_rated">Top Rated</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          <TabsContent value="popular">
            <MovieGrid useQueryHook={useInfinitePopularMovies} />
          </TabsContent>
          <TabsContent value="top_rated">
            <MovieGrid useQueryHook={useInfiniteTopRatedMovies} />
          </TabsContent>
          <TabsContent value="upcoming">
            <MovieGrid useQueryHook={useInfiniteUpcomingMovies} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MovieGrid({
  useQueryHook,
}: {
  useQueryHook: () => UseInfiniteQueryResult<
    { pages: { results: Movie[] }[] },
    unknown
  >;
}) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useQueryHook();

  const allMovies = data?.pages.flatMap((page) => page.results) || [];

  if (isLoading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {allMovies.map((item: Movie, index: number) => (
          <MovieCard key={`${item.id}-${index}`} item={item} type="movie" />
        ))}
      </div>

      <LoadMore
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}
