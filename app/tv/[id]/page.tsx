"use client";

import { useTVDetails } from "@/services/queries";
import { SeasonList } from "@/components/SeasonList";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar } from "lucide-react";
import { use } from "react";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

export default function TVPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: show, loading } = useTVDetails(id);

  if (loading || !show) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }
  console.log(show);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Backdrop */}
      <div className="relative h-[60vh] w-full">
        <img
          src={`${IMAGE_BASE_URL}${show.backdrop_path}`}
          alt={show.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 w-48 md:w-64 rounded-lg overflow-hidden shadow-2xl border-4 border-background/20">
            <img
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-6 pt-4 md:pt-12">
            <h1 className="text-4xl md:text-5xl font-bold">{show.name}</h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-foreground font-medium">
                  {show.vote_average.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(show.first_air_date).getFullYear()}</span>
              </div>
              <div className="text-foreground font-medium">
                {show.number_of_seasons} Seasons
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {show.genres?.map((g: { id: number; name: string }) => (
                <Badge key={g.id} variant="secondary">
                  {g.name}
                </Badge>
              ))}
            </div>

            {/* Networks */}
            {show.networks && show.networks.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Watch on:
                </span>
                <div className="flex flex-wrap gap-3 items-center">
                  {show.networks.map((network) =>
                    network.logo_path ? (
                      <div
                        key={network.id}
                        className="h-10 bg-white/90 px-3 py-1 rounded-md flex items-center justify-center"
                        title={network.name}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w500${network.logo_path}`}
                          alt={network.name}
                          className="h-full w-auto object-contain"
                        />
                      </div>
                    ) : (
                      <Badge key={network.id} variant="outline" className="h-8">
                        {network.name}
                      </Badge>
                    ),
                  )}
                </div>
              </div>
            )}

            <p className="text-lg leading-relaxed text-muted-foreground max-w-3xl">
              {show.overview}
            </p>

            <div className="pt-8">
              <SeasonList tvId={id} seasons={show.seasons || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
