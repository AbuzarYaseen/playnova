"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w92";

export const ProviderSlider = ({ region = "US" }: { region?: string }) => {
  const [providers, setProviders] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const rowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/tmdb/watch/providers/movie?language=en-US&watch_region=${region}`,
        );
        if (!res.ok) {
          setProviders([]);
          return;
        }
        const json = await res.json();
        // TMDB returns results array
        setProviders(json.results || []);
      } catch (e) {
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [region]);

  if (loading || providers.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount =
        direction === "left" ? -window.innerWidth / 2 : window.innerWidth / 2;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-8">
      <div className="flex items-center justify-between px-4 md:px-8 mb-4">
        <p className="text-xl md:text-2xl font-semibold text-foreground">
          Browse by Provider
        </p>
      </div>

      <div className="relative group">
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
          className="flex items-start gap-6 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {providers.map((p) => (
            <button
              key={p.provider_id}
              className="rounded-md p-3 bg-secondary/10 hover:bg-secondary transition-all flex items-center justify-center min-w-30 h-20 cursor-pointer"
              onClick={() => router.push(`/movies?provider=${p.provider_id}`)}
            >
              {p.logo_path ? (
                <img
                  src={`${IMAGE_BASE_URL}${p.logo_path}`}
                  alt={p.provider_name}
                  className="h-14 object-contain"
                />
              ) : (
                <div className="h-14 w-32 flex items-center justify-center text-xs text-muted-foreground">
                  {p.provider_name}
                </div>
              )}
            </button>
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
