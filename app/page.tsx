"use client";

import { Hero } from "@/components/Hero";
import { MovieRow } from "@/components/MovieRow";
import {
  usePopularMovies,
  useRegionMovies,
  useTrendingMovies,
} from "@/services/queries";

export default function Home() {
  const { data: popularMovies } = usePopularMovies();
  const { data: trendingMovies } = useTrendingMovies();
  const { data: hindiMovies } = useRegionMovies("hi");
  const { data: tamilMovies } = useRegionMovies("ta");
  const { data: teluguMovies } = useRegionMovies("te");
  const { data: punjabiMovies } = useRegionMovies("pa");
  const { data: pakistaniMovies } = useRegionMovies("ur");

  return (
    <div className="min-h-screen pb-20 space-y-8">
      <Hero />

      <div className="-mt-20 relative z-10 pl-4 md:pl-8 space-y-4">
        {/* Overlapping rows */}
        <MovieRow title="Popular Now" data={popularMovies?.results} />
        <MovieRow title="Trending This Week" data={trendingMovies?.results} />

        {/* Regional Content */}
        <MovieRow
          title="Hindi Blockbusters"
          data={hindiMovies?.results}
          viewAllLink="/region/hi"
        />
        <MovieRow
          title="Pakistani Blockbusters"
          data={pakistaniMovies?.results}
          viewAllLink="/region/ur"
        />
        <MovieRow
          title="Telugu Hits"
          data={teluguMovies?.results}
          viewAllLink="/region/te"
        />
        <MovieRow
          title="Tamil Action"
          data={tamilMovies?.results}
          viewAllLink="/region/ta"
        />
        <MovieRow
          title="Punjabi Entertainment"
          data={punjabiMovies?.results}
          viewAllLink="/region/pa"
        />
      </div>
    </div>
  );
}
