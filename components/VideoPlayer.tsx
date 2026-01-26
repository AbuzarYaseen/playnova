"use client";

interface VideoPlayerProps {
  tmdbId: string;
  type: "movie" | "tv";
  season?: string;
  episode?: string;
}

export const VideoPlayer = ({
  tmdbId,
  type,
  season,
  episode,
}: VideoPlayerProps) => {
  let url = "";
  if (type === "movie") {
    url = `https://player.smashy.stream/movie/${tmdbId}`;
  } else {
    url = `https://player.smashy.stream/tv/${tmdbId}?s=${season || 1}&e=${episode || 1}`;
  }

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
      <iframe
        src={url}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        className="w-full h-full"
        title="Video Player"
      />
    </div>
  );
};
