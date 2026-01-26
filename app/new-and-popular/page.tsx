"use client";

import {
  useInfiniteTrendingMovies,
  useInfiniteTrendingTV,
  useInfiniteUpcomingMovies,
} from "@/services/queries";
import { MovieCard } from "@/components/MovieCard";
import { LoadMore } from "@/components/LoadMore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Movie, TVShow } from "@/services/queries";
import { UseInfiniteQueryResult, InfiniteData } from "@tanstack/react-query";

export default function NewAndPopularPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-24 space-y-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">New & Popular</h1>

        <Tabs defaultValue="trending_movies" className="space-y-8">
          <TabsList className="bg-secondary/20">
            <TabsTrigger value="trending_movies">Trending Movies</TabsTrigger>
            <TabsTrigger value="trending_tv">Trending TV</TabsTrigger>
            <TabsTrigger value="coming_soon">Coming Soon</TabsTrigger>
          </TabsList>

          <TabsContent value="trending_movies">
            <Grid useQueryHook={useInfiniteTrendingMovies} type="movie" />
          </TabsContent>
          <TabsContent value="trending_tv">
            <Grid useQueryHook={useInfiniteTrendingTV} type="tv" />
          </TabsContent>
          <TabsContent value="coming_soon">
            <Grid useQueryHook={useInfiniteUpcomingMovies} type="movie" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Grid({
  useQueryHook,
  type,
}: {
  useQueryHook: () => UseInfiniteQueryResult<
    InfiniteData<{ results: (Movie | TVShow)[] }>
  >;
  type: "movie" | "tv";
}) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useQueryHook();

  const items =
    data?.pages.flatMap(
      (page: { results: (Movie | TVShow)[] }) => page.results,
    ) || [];

  if (isLoading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {items.map((item: Movie | TVShow, index: number) => (
          <MovieCard key={`${item.id}-${index}`} item={item} type={type} />
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
