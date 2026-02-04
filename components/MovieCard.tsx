"use client";

import { Movie, TVShow } from "@/services/queries";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star } from "lucide-react";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface MovieCardProps {
  item: Movie | TVShow;
  type: "movie" | "tv";
}

export const MovieCard = ({ item, type }: MovieCardProps) => {
  const title = "title" in item ? item.title : item.name;
  const date = "release_date" in item ? item.release_date : item.first_air_date;

  return (
    <Link href={`/${type}/${item.id}`}>
      <motion.div
        className="group relative shrink-0 w-[160px] md:w-[200px] cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <div className="aspect-2/3 relative rounded-lg overflow-hidden bg-secondary/20 shadow-lg">
          {item.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${item.poster_path}`}
              alt={title || "Movie Poster"}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs p-4 text-center bg-secondary">
              No Image Available
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4">
            <h3 className="text-base font-bold leading-tight truncate group-hover:text-primary transition-colors mb-5">
              {title}
            </h3>
            <div className="flex flex-col justify-center items-center gap-1">
              <p className="text-white text-sm font-medium line-clamp-3 mb-2">
                {item.overview}
              </p>
              <div className="flex items-center gap-1 w-fit bg-yellow-500 rounded-lg px-3 py-1 ">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs font-bold">
                  {item.vote_average.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-white mt-3">({date})</p>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
