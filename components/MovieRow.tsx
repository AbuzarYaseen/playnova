"use client";

import * as React from "react";
import { MovieCard } from "./MovieCard";
import { Movie, TVShow } from "@/services/queries";
import { ChevronRight } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "./ui/button";

interface MovieRowProps {
  title: string;
  data?: Movie[] | TVShow[];
  type?: "movie" | "tv";
  viewAllLink?: string;
}

export const MovieRow = ({
  title,
  data,
  type = "movie",
  viewAllLink,
}: MovieRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  if (!data || data.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { current } = rowRef;
      const scrollAmount =
        direction === "left" ? -window.innerWidth / 2 : window.innerWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-8 space-y-4">
      {viewAllLink ? (
        <div className="flex items-center justify-between px-4 md:px-8">
          <p className="text-xl md:text-2xl font-semibold text-foreground  flex items-center jus group-hover:text-primary transition-colors">
            {title}
            <ChevronRight className="w-5 h-5 group-hover:opacity-100 transition-opacity ml-1" />
          </p>
          <Link href={viewAllLink}>
            <Button className="cursor-pointer">View All</Button>
          </Link>
        </div>
      ) : (
        <p className="px-4 md:px-8 text-xl md:text-2xl font-semibold text-foreground  flex items-center jus group-hover:text-primary transition-colors">
          {title}
        </p>
      )}

      <div className="relative group">
        {/* Custom Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-linear-to-r from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer disabled:hidden"
        >
          <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full">
            <ChevronRight className="w-8 h-8 text-white rotate-180" />
          </div>
        </button>

        <div
          ref={rowRef}
          className="flex items-start gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {data.map((item) => (
            <MovieCard key={item.id} item={item} type={type} />
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-40 w-12 bg-linear-to-l from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
        >
          <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full">
            <ChevronRight className="w-8 h-8 text-white" />
          </div>
        </button>
      </div>
    </section>
  );
};
