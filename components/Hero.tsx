"use client";

import * as React from "react";
import { useTrendingMovies } from "@/services/queries";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

export const Hero = () => {
  const { data, loading } = useTrendingMovies();
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );

  if (loading || !data?.results) {
    return <div className="h-[80vh] w-full bg-secondary animate-pulse" />;
  }

  const movies = data.results.slice(0, 5); // Top 5 trending

  return (
    <section className="relative w-full h-[85vh] md:h-[95vh] text-white">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="h-full ml-0">
          {movies.map((movie) => (
            <CarouselItem
              key={movie.id}
              className="relative w-full h-full p-0 pl-0"
            >
              <div className="absolute inset-0">
                <img
                  src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-black/30" />
                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24 space-y-6 max-w-3xl pt-20">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-md">
                  {movie.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 line-clamp-3 drop-shadow-sm">
                  {movie.overview}
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <Link href={`/movie/${movie.id}`}>
                    <Button
                      size="lg"
                      className="gap-2 text-md font-semibold px-8 py-6 rounded-lg"
                    >
                      <Play className="fill-current w-5 h-5" /> Play Now
                    </Button>
                  </Link>
                  <Link href={`/movie/${movie.id}`}>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="gap-2 text-md font-semibold px-8 py-6 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
                    >
                      <Info className="w-5 h-5" /> More Info
                    </Button>
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-4 bg-black/20 hover:bg-black/40 border-none text-white" />
          <CarouselNext className="right-4 bg-black/20 hover:bg-black/40 border-none text-white" />
        </div>
      </Carousel>
    </section>
  );
};
