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
    url = `https://vidflix.club/movie/${tmdbId}`;
  } else {
    // VIDFLIX expects /tv/{showId}/{season}/{episode}
    url = `https://vidflix.club/tv/${tmdbId}/${season || 1}/${episode || 1}`;
  }

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
      <iframe
        src={url}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        allow="encrypted-media"
        className="w-full h-full"
        title="Video Player (VIDFLIX)"
      />
    </div>
  );
};
