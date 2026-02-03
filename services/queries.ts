import { useFetch, useInfiniteFetch } from "@/hooks/use-fetch";

// Types
export interface Episode {
  id: number;
  name: string;
  episode_number: number;
  still_path: string | null;
  overview: string;
  air_date: string;
  vote_average: number;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string;
  overview: string;
  episodes?: Episode[];
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  // Details
  runtime?: number;
  genres?: { id: number; name: string }[];
  media_type?: string;
  name?: string; // For search results
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  // Details
  number_of_seasons?: number;
  genres?: { id: number; name: string }[];
  seasons?: Season[];
  media_type?: string;
  networks?: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
}

interface FetchResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
}

// Helper to construct proxy URL
const getProxyUrl = (
  endpoint: string,
  params?: Record<string, string | number>,
) => {
  const url = new URL(`/api/tmdb${endpoint}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
};

// Hooks
export const useTrendingMovies = () => {
  return useFetch<FetchResponse<Movie>>(getProxyUrl("/trending/movie/week"));
};

export const usePopularMovies = () => {
  return useFetch<FetchResponse<Movie>>(getProxyUrl("/movie/popular"));
};

export const useTopRatedMovies = () => {
  return useFetch<FetchResponse<Movie>>(getProxyUrl("/movie/top_rated"));
};

export const useUpcomingMovies = () => {
  return useFetch<FetchResponse<Movie>>(getProxyUrl("/movie/upcoming"));
};

export const useMovieDetails = (id: string) => {
  return useFetch<Movie>(id ? getProxyUrl(`/movie/${id}`) : "");
};

export const useTVDetails = (id: string) => {
  return useFetch<TVShow>(id ? getProxyUrl(`/tv/${id}`) : "");
};

export const usePopularTV = () => {
  return useFetch<FetchResponse<TVShow>>(getProxyUrl("/tv/popular"));
};

export const useTopRatedTV = () => {
  return useFetch<FetchResponse<TVShow>>(getProxyUrl("/tv/top_rated"));
};

export const useOnTheAirTV = () => {
  return useFetch<FetchResponse<TVShow>>(getProxyUrl("/tv/on_the_air"));
};

export const useTrendingTV = () => {
  return useFetch<FetchResponse<TVShow>>(getProxyUrl("/trending/tv/week"));
};

export const useSeasonDetails = (tvId: string, seasonNumber: string) => {
  return useFetch<Season>(
    tvId && seasonNumber
      ? getProxyUrl(`/tv/${tvId}/season/${seasonNumber}`)
      : "",
  );
};

export const useSearch = (query: string) => {
  return useFetch<FetchResponse<Movie | TVShow>>(
    query ? getProxyUrl("/search/multi", { query }) : "",
  );
};

// Region/Language Specific
export const useRegionMovies = (
  region: "en" | "hi" | "ur" | "te" | "ta" | "pa",
) => {
  const isSouthIndian = region === "te" || region === "ta";
  const isPakistani = region === "ur";

  const params: Record<string, string> = {
    sort_by: "primary_release_date.desc",
    "primary_release_date.lte": new Date().toISOString().split("T")[0],
  };

  if (isPakistani) {
    params.with_origin_country = "PK";
    params.with_original_language = "ur";
  } else if (isSouthIndian) {
    params.with_original_language = region;
  } else {
    params.with_original_language = region;
  }

  return useFetch<FetchResponse<Movie>>(getProxyUrl("/discover/movie", params));
};

export const useDiscoverTV = (filters: {
  with_genres?: string;
  first_air_date_year?: string;
  with_origin_country?: string;
  sort_by?: string;
}) => {
  return useFetch<FetchResponse<TVShow>>(
    getProxyUrl("/discover/tv", filters as Record<string, string>),
  );
};

// Note: Infinite queries have been replaced by standard fetch hooks for now.
// If pagination is needed, the useFetch hook should be updated to handle it.
// For the purpose of this refactor, we are using standard fetches.

// Infinite Queries
export const useInfinitePopularMovies = () => {
  return useInfiniteFetch<FetchResponse<Movie>>(
    getProxyUrl("/movie/popular"),
    {},
  );
};

export const useInfiniteTopRatedMovies = () => {
  return useInfiniteFetch<FetchResponse<Movie>>(
    getProxyUrl("/movie/top_rated"),
    {},
  );
};

export const useInfiniteUpcomingMovies = () => {
  return useInfiniteFetch<FetchResponse<Movie>>(
    getProxyUrl("/movie/upcoming"),
    {},
  );
};

export const useInfinitePopularTV = () => {
  return useInfiniteFetch<FetchResponse<TVShow>>(
    getProxyUrl("/tv/popular"),
    {},
  );
};

export const useInfiniteTopRatedTV = () => {
  return useInfiniteFetch<FetchResponse<TVShow>>(
    getProxyUrl("/tv/top_rated"),
    {},
  );
};

export const useInfiniteOnTheAirTV = () => {
  return useInfiniteFetch<FetchResponse<TVShow>>(
    getProxyUrl("/tv/on_the_air"),
    {},
  );
};

export const useInfiniteTrendingMovies = () => {
  return useInfiniteFetch<FetchResponse<Movie>>(
    getProxyUrl("/trending/movie/week"),
    {},
  );
};

export const useInfiniteTrendingTV = () => {
  return useInfiniteFetch<FetchResponse<TVShow>>(
    getProxyUrl("/trending/tv/week"),
    {},
  );
};

export const useInfiniteRegionMovies = (
  region: "en" | "hi" | "ur" | "te" | "ta" | "pa",
) => {
  const isSouthIndian = region === "te" || region === "ta";
  const isPakistani = region === "ur";

  const baseParams: Record<string, string> = {
    sort_by: "primary_release_date.desc",
    "primary_release_date.lte": new Date().toISOString().split("T")[0],
  };

  if (isPakistani) {
    baseParams.with_origin_country = "PK";
    baseParams.with_original_language = "ur";
  } else if (isSouthIndian) {
    baseParams.with_original_language = region;
  } else {
    baseParams.with_original_language = region;
  }

  return useInfiniteFetch<FetchResponse<Movie>>(
    getProxyUrl("/discover/movie"),
    baseParams,
  );
};

export const useInfiniteDiscoverTV = (filters: {
  with_genres?: string;
  first_air_date_year?: string;
  with_origin_country?: string;
  sort_by?: string;
}) => {
  return useInfiniteFetch<FetchResponse<TVShow>>(
    getProxyUrl("/discover/tv"),
    filters,
  );
};

export const useInfiniteDiscoverMovies = (filters: {
  with_genres?: string;
  primary_release_year?: string;
  with_origin_country?: string;
  with_original_language?: string;
  sort_by?: string;
}) => {
  const params = {
    sort_by: "primary_release_date.desc", // Default to newest first
    ...filters,
    "primary_release_date.lte": new Date().toISOString().split("T")[0],
  };
  return useInfiniteFetch<FetchResponse<Movie>>(
    getProxyUrl("/discover/movie"),
    params,
  );
};
