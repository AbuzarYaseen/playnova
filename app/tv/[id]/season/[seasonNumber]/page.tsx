"use client";

import { useSeasonDetails, useTVDetails, Episode } from "@/services/queries";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Card, CardContent } from "@/components/ui/card";
import { use } from "react";
import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/Loader";

export default function SeasonPage({
  params,
}: {
  params: Promise<{ id: string; seasonNumber: string }>;
}) {
  const { id, seasonNumber } = use(params);
  const { data: season, isLoading } = useSeasonDetails(id, seasonNumber);
  const { data: show } = useTVDetails(id);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);

  if (isLoading || !season || !show) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-24 container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-2">{show.name}</h1>
      <h2 className="text-xl text-muted-foreground mb-8">
        Season {seasonNumber} - Episode {selectedEpisode}
      </h2>

      <div className="aspect-video w-full max-w-5xl mx-auto mb-12">
        <VideoPlayer
          tmdbId={id}
          type="tv"
          season={seasonNumber}
          episode={selectedEpisode.toString()}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {season.episodes?.map((episode: Episode) => (
          <Card
            key={episode.id}
            className={cn(
              "cursor-pointer hover:bg-accent/50 transition-colors border-border/50",
              selectedEpisode === episode.episode_number
                ? "border-primary bg-accent/20"
                : "bg-card",
            )}
            onClick={() => setSelectedEpisode(episode.episode_number)}
          >
            <CardContent className="p-4 flex gap-4">
              <div className="w-32 shrink-0 aspect-video rounded-md overflow-hidden bg-secondary relative">
                {episode.still_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${episode.still_path}`}
                    alt={episode.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-muted">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-sm truncate pr-2">
                    {episode.episode_number}. {episode.name}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {episode.overview}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
