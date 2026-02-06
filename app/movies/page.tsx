"use client";

import {
  useInfinitePopularMovies,
  useInfiniteTopRatedMovies,
  useInfiniteUpcomingMovies,
  useInfiniteDiscoverMovies,
} from "@/services/queries";
import { MovieCard } from "@/components/MovieCard";
import { LoadMore } from "@/components/LoadMore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Movie } from "@/services/queries";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function MoviesPageContent() {
  // read provider param reactively to auto-open discover and filter
  const searchParams = useSearchParams();
  const providerParam = searchParams?.get("provider");

  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(providerParam ? "discover" : "popular");
  }, [providerParam]);

  if (activeTab === null) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-20 pt-24 space-y-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Movies</h1>
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-24 space-y-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Movies</h1>

        <Tabs
          value={activeTab as string}
          onValueChange={(v) => setActiveTab(v)}
          className="space-y-8"
        >
          <TabsList className="bg-secondary/20 flex-wrap h-auto p-1">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="top_rated">Top Rated</TabsTrigger>
            <TabsTrigger value="discover">Discover / Filter</TabsTrigger>
          </TabsList>

          <TabsContent value="popular">
            <MovieGrid useQueryHook={useInfinitePopularMovies} />
          </TabsContent>
          <TabsContent value="top_rated">
            <MovieGrid useQueryHook={useInfiniteTopRatedMovies} />
          </TabsContent>
          <TabsContent value="discover">
            <DiscoverMoviesGrid initialProvider={providerParam || undefined} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <MoviesPageContent />
    </Suspense>
  );
}

function MovieGrid({ useQueryHook }: { useQueryHook: () => any }) {
  const { data, loading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useQueryHook();

  const allMovies = data?.pages.flatMap((page: any) => page.results) || [];

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {allMovies.map((item: Movie, index: number) => (
          <MovieCard key={`${item.id}-${index}`} item={item} type="movie" />
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

function DiscoverMoviesGrid({ initialProvider }: { initialProvider?: string }) {
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    country: "",
    language: "",
    sortBy: "primary_release_date.desc",
    provider: initialProvider || "",
  });

  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    initialProvider
      ? { with_watch_providers: initialProvider, watch_region: "US" }
      : {},
  );

  const [providers, setProviders] = useState<Array<any>>([]);
  const [providersLoading, setProvidersLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      setProvidersLoading(true);
      try {
        const res = await fetch(
          `/api/tmdb/watch/providers/movie?language=en-US&watch_region=US`,
        );
        if (!res.ok) {
          setProviders([]);
          return;
        }
        const json = await res.json();
        setProviders(
          (json.results || []).sort((a: any, b: any) =>
            a.provider_name.localeCompare(b.provider_name),
          ),
        );
      } catch (e) {
        setProviders([]);
      } finally {
        setProvidersLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // If a provider is present in the URL, apply it as an active filter on mount
  useEffect(() => {
    if (initialProvider) {
      setActiveFilters({
        with_watch_providers: initialProvider,
        watch_region: "US",
      });
      setFilters((f) => ({ ...f, provider: initialProvider }));
    }
  }, [initialProvider]);

  const { data, loading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteDiscoverMovies(activeFilters);

  const handleApplyFilters = () => {
    const query: Record<string, string> = {};
    if (filters.genre) query.with_genres = filters.genre;
    if (filters.year) query.primary_release_year = filters.year;
    if (filters.country) query.with_origin_country = filters.country;
    if (filters.language) query.with_original_language = filters.language;
    if (filters.sortBy) query.sort_by = filters.sortBy;
    if (filters.provider) {
      query.with_watch_providers = filters.provider;
      query.watch_region = "US";
    }

    setActiveFilters(query);
  };

  const clearFilters = () => {
    setFilters({
      genre: "",
      year: "",
      country: "",
      language: "",
      sortBy: "popularity.desc",
      provider: "",
    });
    setActiveFilters({});
  };

  const genres = [
    { id: "28", name: "Action" },
    { id: "12", name: "Adventure" },
    { id: "16", name: "Animation" },
    { id: "35", name: "Comedy" },
    { id: "80", name: "Crime" },
    { id: "99", name: "Documentary" },
    { id: "18", name: "Drama" },
    { id: "10751", name: "Family" },
    { id: "14", name: "Fantasy" },
    { id: "36", name: "History" },
    { id: "27", name: "Horror" },
    { id: "10402", name: "Music" },
    { id: "9648", name: "Mystery" },
    { id: "10749", name: "Romance" },
    { id: "878", name: "Sci-Fi" },
    { id: "10770", name: "TV Movie" },
    { id: "53", name: "Thriller" },
    { id: "10752", name: "War" },
    { id: "37", name: "Western" },
  ];

  const countries = [
    { code: "US", name: "United States" },
    { code: "IN", name: "India" },
    { code: "GB", name: "United Kingdom" },
    { code: "FR", name: "France" },
    { code: "KR", name: "South Korea" },
    { code: "JP", name: "Japan" },
    { code: "PK", name: "Pakistan" },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "te", name: "Telugu (Hindi Dubbed)" },
    { code: "ta", name: "Tamil (Hindi Dubbed)" },
    { code: "pa", name: "Punjabi" },
    { code: "en-hi", name: "English (Hindi Dubbed)" }, // Custom label, mapped to en
  ];

  const items = data?.pages.flatMap((page: any) => page.results) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end gap-2 bg-secondary/20 p-4 rounded-lg">
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground mb-1">Genre</label>
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
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground mb-1">Year</label>
          <Input
            placeholder="Year"
            className="w-[100px]"
            type="number"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground mb-1">Country</label>
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
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground mb-1">Provider</label>
          <Select
            value={filters.provider}
            onValueChange={(v) => setFilters({ ...filters, provider: v })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              {providers.map((p: any) => (
                <SelectItem key={p.provider_id} value={String(p.provider_id)}>
                  {p.provider_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground mb-1">Language</label>
          <Select
            value={filters.language}
            onValueChange={(v) =>
              setFilters({ ...filters, language: v === "en-hi" ? "en" : v })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground mb-1">Sort By</label>
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
              <SelectItem value="primary_release_date.desc">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleApplyFilters}>Apply</Button>
        {Object.keys(activeFilters).length > 0 && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {items.map((item: Movie, index: number) => (
          <MovieCard key={`${item.id}-${index}`} item={item} type="movie" />
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
