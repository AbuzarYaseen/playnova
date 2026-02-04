"use client";

import { Season } from "@/services/queries";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Link from "next/link";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface SeasonCardProps {
  tvId: number | string;
  showName: string;
  season: Season;
}

export const SeasonCard = ({ tvId, showName, season }: SeasonCardProps) => {
  const title = `${showName} — ${season.name}`;
  const year = season.air_date
    ? new Date(season.air_date).getFullYear()
    : "Unknown";

  return (
    <Link href={`/tv/${tvId}/season/${season.season_number}`}>
      <motion.div
        className="group relative shrink-0 w-40 md:w-50 cursor-pointer"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.15 }}
      >
        <div className="aspect-2/3 relative rounded-lg overflow-hidden bg-secondary/20 shadow-lg">
          {season.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${season.poster_path}`}
              alt={season.name || "Season Poster"}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs p-4 text-center bg-secondary">
              No Image Available
            </div>
          )}

          <div className="absolute inset-0 flex flex-col justify-end p-3">
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="bg-red-200 cursor-pointer rounded-full p-3 text-black">
                <Play />
              </button>
            </div>
            <div className="bg-linear-to-t from-black/70 to-transparent p-3 w-full">
              <h4 className="text-sm font-medium text-white truncate">
                {season.name}
              </h4>
              <p className="text-xs text-green-200">
                {season.episode_count} episodes • {year}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2 space-y-1">
          <h3 className="text-sm font-medium leading-tight truncate group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>
      </motion.div>
    </Link>
  );
};
