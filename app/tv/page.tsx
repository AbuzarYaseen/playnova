"use client";

import {
  useInfinitePopularTV,
  useInfiniteTopRatedTV,
  useInfiniteOnTheAirTV,
  useInfiniteDiscoverTV,
  TVShow,
} from "@/services/queries";
import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { MovieCard } from "@/components/MovieCard";
import { LoadMore } from "@/components/LoadMore";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TVPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-24 space-y-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">TV Shows</h1>
        </div>

        <Tabs defaultValue="popular" className="space-y-8">
          <TabsList className="bg-secondary/20 flex-wrap h-auto p-1">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="top_rated">Top Rated</TabsTrigger>
            <TabsTrigger value="on_the_air">On The Air</TabsTrigger>
            <TabsTrigger value="discover">Discover / Filter</TabsTrigger>
          </TabsList>

          <TabsContent value="popular">
            <TVGrid useQueryHook={useInfinitePopularTV} />
          </TabsContent>
          <TabsContent value="top_rated">
            <TVGrid useQueryHook={useInfiniteTopRatedTV} />
          </TabsContent>
          <TabsContent value="on_the_air">
            <TVGrid useQueryHook={useInfiniteOnTheAirTV} />
          </TabsContent>
          <TabsContent value="discover">
            <DiscoverTVGrid />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function TVGrid({
  useQueryHook,
}: {
  useQueryHook: () => UseInfiniteQueryResult<
    { pages: { results: TVShow[] }[] },
    unknown
  >;
}) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useQueryHook();

  const items = data?.pages.flatMap((page) => page.results) || [];

  if (isLoading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {items.map((item: TVShow, index: number) => (
          <MovieCard key={`${item.id}-${index}`} item={item} type="tv" />
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

function DiscoverTVGrid() {
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    country: "",
    sortBy: "first_air_date.desc",
  });
  // Triggers refetch when changed
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {},
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteDiscoverTV(activeFilters);

  const handleApplyFilters = () => {
    const query: Record<string, string> = {};
    if (filters.genre) query.with_genres = filters.genre;
    if (filters.year) query.first_air_date_year = filters.year;
    if (filters.country) query.with_origin_country = filters.country;
    if (filters.sortBy) query.sort_by = filters.sortBy;

    setActiveFilters(query);
  };

  const clearFilters = () => {
    setFilters({ genre: "", year: "", country: "", sortBy: "popularity.desc" });
    setActiveFilters({});
  };

  const genres = [
    { id: "10759", name: "Action & Adventure" },
    { id: "16", name: "Animation" },
    { id: "35", name: "Comedy" },
    { id: "80", name: "Crime" },
    { id: "99", name: "Documentary" },
    { id: "18", name: "Drama" },
    { id: "10751", name: "Family" },
    { id: "10762", name: "Kids" },
    { id: "9648", name: "Mystery" },
    { id: "10763", name: "News" },
    { id: "10764", name: "Reality" },
    { id: "10765", name: "Sci-Fi & Fantasy" },
    { id: "10766", name: "Soap" },
    { id: "10767", name: "Talk" },
    { id: "10768", name: "War & Politics" },
    { id: "37", name: "Western" },
  ];

  const countries = [
    { code: "US", name: "United States" },
    { code: "KR", name: "South Korea" },
    { code: "GB", name: "United Kingdom" },
    { code: "JP", name: "Japan" },
    { code: "IN", name: "India" },
    { code: "PK", name: "Pakistan" },
    { code: "TR", name: "Turkey" },
  ];

  const items = data?.pages.flatMap((page) => page.results) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2 bg-secondary/20 p-4 rounded-lg">
        <Select
          value={filters.genre}
          onValueChange={(v) => setFilters({ ...filters, genre: v })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            {genres.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Year"
          className="w-[100px]"
          type="number"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        />
        <Select
          value={filters.country}
          onValueChange={(v) => setFilters({ ...filters, country: v })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.sortBy}
          onValueChange={(v) => setFilters({ ...filters, sortBy: v })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity.desc">Popularity</SelectItem>
            <SelectItem value="vote_average.desc">Rating</SelectItem>
            <SelectItem value="first_air_date.desc">Newest</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleApplyFilters}>Apply</Button>
        {Object.keys(activeFilters).length > 0 && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {items.map((item: TVShow, index: number) => (
          <MovieCard key={`${item.id}-${index}`} item={item} type="tv" />
        ))}
      </div>
      {isLoading && <div className="text-center py-20">Loading...</div>}
      <LoadMore
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}
