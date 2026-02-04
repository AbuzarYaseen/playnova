"use client";

import { Hero } from "@/components/Hero";
import { MovieRow } from "@/components/MovieRow";
import { ProviderSlider } from "@/components/ProviderSlider";
import {
  usePopularMovies,
  useTrendingMovies,
  useUpcomingMovies,
} from "@/services/queries";

export default function Home() {
  const { data: popularMovies } = usePopularMovies();
  const { data: trendingMovies } = useTrendingMovies();
  const { data: upcomingMovies } = useUpcomingMovies();

  return (
    <div className="min-h-screen pb-20 space-y-8">
      <Hero />

      <div className="-mt-20 relative z-10 pl-4 md:pl-8 space-y-4">
        <ProviderSlider />
        <MovieRow title="Popular Now" data={popularMovies?.results} />
        <MovieRow title="Trending This Week" data={trendingMovies?.results} />
        <MovieRow title="Coming Soon" data={upcomingMovies?.results} />
      </div>
    </div>
  );
}
