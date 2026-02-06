"use client";

import { useMovieDetails } from "@/services/queries";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Clock } from "lucide-react";
import { use } from "react";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

export default function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: movie, loading } = useMovieDetails(id);

  if (loading || !movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Backdrop */}
      <div className="relative h-[60vh] w-full">
        <img
          src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 w-48 md:w-64 rounded-lg overflow-hidden shadow-2xl border-4 border-background/20">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-6 pt-4 md:pt-12">
            <h1 className="text-4xl md:text-5xl font-bold">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-foreground font-medium">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{movie.runtime} min</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {movie.genres?.map((g: { id: number; name: string }) => (
                <Badge key={g.id} variant="secondary">
                  {g.name}
                </Badge>
              ))}
            </div>

            <p className="text-lg leading-relaxed text-muted-foreground max-w-3xl">
              {movie.overview}
            </p>

            <div className="pt-8">
              <h2 className="text-2xl font-bold mb-4">Watch Now</h2>
              <VideoPlayer tmdbId={id} type="movie" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
