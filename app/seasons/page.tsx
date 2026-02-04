"use client";

import {
  useInfinitePopularTV,
  useInfiniteTopRatedTV,
  useInfiniteOnTheAirTV,
  useInfiniteDiscoverTV,
  useInfiniteTrendingTV,
  TVShow,
  useTVDetails,
} from "@/services/queries";
import { SeasonCard } from "@/components/SeasonCard";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

function ShowSeasons({
  tvId,
  showName,
  activeLanguage,
}: {
  tvId: number;
  showName: string;
  activeLanguage?: string;
}) {
  const { data: show, loading } = useTVDetails(String(tvId));

  if (loading) return <div className="text-center py-6">Loading...</div>;
  if (!show || !show.seasons || show.seasons.length === 0) return null;

  // Language filtering: only apply when `activeLanguage` is explicitly provided
  const spoken: string[] =
    (show as any).spoken_languages?.map((s: any) => s.iso_639_1) || [];
  const originalLang: string = (show as any).original_language || "";

  const matchesLanguage = (() => {
    if (!activeLanguage) return true; // no language filter by default
    if (activeLanguage === "en") {
      return originalLang === "en" || spoken.includes("en");
    }
    if (activeLanguage === "en_hi") {
      // English show that also has Hindi spoken language (dubbed/subs)
      return (
        (originalLang === "en" || spoken.includes("en")) &&
        spoken.includes("hi")
      );
    }
    if (activeLanguage === "en_pa") {
      // Punjabi might be 'pa' or 'pnb' in TMDB
      return (
        (originalLang === "en" || spoken.includes("en")) &&
        (spoken.includes("pa") || spoken.includes("pnb"))
      );
    }
    return true;
  })();

  if (!matchesLanguage) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold">{showName}</h4>
      <Carousel className="w-40 md:w-50 h-[240px] md:h-[300px] rounded-lg">
        <CarouselContent className="gap-3">
          {show.seasons.map((season) => (
            <CarouselItem key={season.id} className="w-auto">
              <SeasonCard tvId={tvId} showName={showName} season={season} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className=" hidden md:flex" />
        <CarouselNext className=" hidden md:flex" />
      </Carousel>
    </div>
  );
}

export default function SeasonsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-24 space-y-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Seasons</h1>
        </div>

        <Tabs defaultValue="discover" className="space-y-8">
          <TabsList className="bg-secondary/20 flex-wrap h-auto p-1">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="top_rated">Top Rated</TabsTrigger>
            <TabsTrigger value="on_the_air">On The Air</TabsTrigger>
            <TabsTrigger value="discover">Discover / Filter</TabsTrigger>
          </TabsList>

          <TabsContent value="popular">
            <SeasonsGrid useQueryHook={useInfinitePopularTV} />
          </TabsContent>
          <TabsContent value="top_rated">
            <SeasonsGrid useQueryHook={useInfiniteTopRatedTV} />
          </TabsContent>
          <TabsContent value="on_the_air">
            <SeasonsGrid useQueryHook={useInfiniteOnTheAirTV} />
          </TabsContent>
          <TabsContent value="discover">
            <DiscoverSeasonsGrid />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SeasonsGrid({ useQueryHook }: { useQueryHook: () => any }) {
  const { data, loading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useQueryHook();

  const items = data?.pages.flatMap((page: any) => page.results) || [];

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4  gap-6 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {items.map((show: TVShow, idx: number) => (
          <ShowSeasons
            key={`${show.id}-${idx}`}
            tvId={show.id}
            showName={show.name}
          />
        ))}
      </div>
      <LoadMore
        isLoading={loading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}

function DiscoverSeasonsGrid() {
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

  const { data, loading, fetchNextPage, hasNextPage, isFetchingNextPage } =
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

  const items = data?.pages.flatMap((page: any) => page.results) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2 bg-secondary/20 p-4 rounded-lg">
        <Select
          value={filters.genre}
          onValueChange={(v) => setFilters({ ...filters, genre: v })}
        >
          <SelectTrigger className="w-35">
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
          className="w-25"
          type="number"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        />
        <Select
          value={filters.country}
          onValueChange={(v) => setFilters({ ...filters, country: v })}
        >
          <SelectTrigger className="w-35">
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
          <SelectTrigger className="w-40">
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

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {items.map((item: TVShow, index: number) => (
          <ShowSeasons
            key={`${item.id}-${index}`}
            tvId={item.id}
            showName={item.name}
          />
        ))}
      </div>
      {loading && <div className="text-center py-20">Loading...</div>}
      <LoadMore
        isLoading={loading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}
