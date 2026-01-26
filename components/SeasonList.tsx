"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

import { Season } from "@/services/queries";

interface SeasonListProps {
  tvId: string;
  seasons: Season[];
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

export const SeasonList = ({ tvId, seasons }: SeasonListProps) => {
  // Filter out Season 0 (Specials) if preferred, or keep it. Keeping it for now.
  const sortedSeasons = [...seasons].sort(
    (a, b) => a.season_number - b.season_number,
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Seasons</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSeasons.map((season) => (
          <Link
            key={season.id}
            href={`/tv/${tvId}/season/${season.season_number}`}
          >
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer border-border/50 bg-secondary/10">
              <CardContent className="p-4 flex gap-4">
                <div className="w-24 shrink-0 rounded-md overflow-hidden bg-secondary">
                  {season.poster_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}${season.poster_path}`}
                      alt={season.name}
                      className="w-full h-auto object-cover aspect-[2/3]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-2 text-center bg-muted">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-semibold text-lg">{season.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {season.episode_count} Episodes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {season.air_date
                        ? new Date(season.air_date).getFullYear()
                        : "TBA"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-fit mt-2 gap-2"
                  >
                    <Play className="w-3 h-3" /> View Episodes
                  </Button>
                  {/* <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{season.overview}</p> */}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
