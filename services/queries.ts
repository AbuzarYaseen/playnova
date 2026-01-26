import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "./api";

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

// Queries
export const useTrendingMovies = () => {
  return useQuery({
    queryKey: ["trendingMovies"],
    queryFn: () =>
      api.get<unknown, FetchResponse<Movie>>("/trending/movie/week"),
  });
};

export const usePopularMovies = () => {
  return useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => api.get<unknown, FetchResponse<Movie>>("/movie/popular"),
  });
};

export const useTopRatedMovies = () => {
  return useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: () => api.get<unknown, FetchResponse<Movie>>("/movie/top_rated"),
  });
};

export const useUpcomingMovies = () => {
  return useQuery({
    queryKey: ["upcomingMovies"],
    queryFn: () => api.get<unknown, FetchResponse<Movie>>("/movie/upcoming"),
  });
};

export const useMovieDetails = (id: string) => {
  return useQuery({
    queryKey: ["movieDetails", id],
    queryFn: () => api.get<unknown, Movie>(`/movie/${id}`),
    enabled: !!id,
  });
};

export const useTVDetails = (id: string) => {
  return useQuery({
    queryKey: ["tvDetails", id],
    queryFn: () => api.get<unknown, TVShow>(`/tv/${id}`),
    enabled: !!id,
  });
};

export const usePopularTV = () => {
  return useQuery({
    queryKey: ["popularTV"],
    queryFn: () => api.get<unknown, FetchResponse<TVShow>>("/tv/popular"),
  });
};

export const useTopRatedTV = () => {
  return useQuery({
    queryKey: ["topRatedTV"],
    queryFn: () => api.get<unknown, FetchResponse<TVShow>>("/tv/top_rated"),
  });
};

export const useOnTheAirTV = () => {
  return useQuery({
    queryKey: ["onTheAirTV"],
    queryFn: () => api.get<unknown, FetchResponse<TVShow>>("/tv/on_the_air"),
  });
};

export const useTrendingTV = () => {
  return useQuery({
    queryKey: ["trendingTV"],
    queryFn: () => api.get<unknown, FetchResponse<TVShow>>("/trending/tv/week"),
  });
};

export const useSeasonDetails = (tvId: string, seasonNumber: string) => {
  return useQuery({
    queryKey: ["seasonDetails", tvId, seasonNumber],
    queryFn: () =>
      api.get<unknown, Season>(`/tv/${tvId}/season/${seasonNumber}`),
    enabled: !!tvId && !!seasonNumber,
  });
};

export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () =>
      api.get<unknown, FetchResponse<Movie | TVShow>>(`/search/multi`, {
        params: { query },
      }),
    enabled: !!query,
  });
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
    // Attempt to show Hindi dub metadata if available, usually handled by client locale,
    // but we can try forcing it. However, the user wants "In Hindi Dubbed".
    // TMDB doesn't filter "dubbed" content easily.
    // We will just fetch the content. The user might mean they want the audio, which we can't control here.
    // But we can ensure we are getting the right regional hits.
  } else {
    params.with_original_language = region;
  }

  return useQuery({
    queryKey: ["regionMovies", region],
    queryFn: () =>
      api.get<unknown, FetchResponse<Movie>>("/discover/movie", {
        params,
      }),
  });
};

export const useDiscoverTV = (filters: {
  with_genres?: string;
  first_air_date_year?: string;
  with_origin_country?: string;
  sort_by?: string;
}) => {
  return useQuery({
    queryKey: ["discoverTV", filters],
    queryFn: () =>
      api.get<unknown, FetchResponse<TVShow>>("/discover/tv", {
        params: filters,
      }),
  });
};

// Infinite Queries for Pagination

export const useInfinitePopularMovies = () => {
  return useInfiniteQuery({
    queryKey: ["popularMovies", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      api.get<unknown, FetchResponse<Movie>>("/movie/popular", {
        params: { page: pageParam },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: FetchResponse<Movie>) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
};

export const useInfiniteTopRatedMovies = () => {
  return useInfiniteQuery({
    queryKey: ["topRatedMovies", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      api.get<unknown, FetchResponse<Movie>>("/movie/top_rated", {
        params: { page: pageParam },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: FetchResponse<Movie>) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
};

export const useInfiniteUpcomingMovies = () => {
  return useInfiniteQuery({
    queryKey: ["upcomingMovies", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      api.get<unknown, FetchResponse<Movie>>("/movie/upcoming", {
        params: { page: pageParam },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: FetchResponse<Movie>) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
};

export const useInfinitePopularTV = () => {
  return useInfiniteQuery({
    queryKey: ["popularTV", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      api.get<unknown, FetchResponse<TVShow>>("/tv/popular", {
        params: { page: pageParam },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: FetchResponse<TVShow>) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
};

export const useInfiniteTopRatedTV = () => {
  return useInfiniteQuery({
    queryKey: ["topRatedTV", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      api.get<unknown, FetchResponse<TVShow>>("/tv/top_rated", {
        params: { page: pageParam },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: FetchResponse<TVShow>) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
};

export const useInfiniteOnTheAirTV = () => {
  return useInfiniteQuery({
    queryKey: ["onTheAirTV", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      api.get<unknown, FetchResponse<TVShow>>("/tv/on_the_air", {
        params: { page: pageParam },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: FetchResponse<TVShow>) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
};

export const useInfiniteTrendingMovies = () => {
  return useInfiniteQuery({
    queryKey: ["trendingMovies", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      api.get<unknown, FetchResponse<Movie>>("/trending/movie/week", {
        params: { page: pageParam },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: FetchResponse<Movie>) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
};

export const useInfiniteTrendingTV = () => {
  return useInfiniteQuery({
    queryKey: ["trendingTV", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      api.get<unknown, FetchResponse<TVShow>>("/trending/tv/week", {
        params: { page: pageParam },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: FetchResponse<TVShow>) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
};

export const useInfiniteRegionMovies = (
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

  return useInfiniteQuery({
    queryKey: ["regionMovies", region, "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      api.get<unknown, FetchResponse<Movie>>("/discover/movie", {
        params: { ...params, page: pageParam },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: FetchResponse<Movie>) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
};

export const useInfiniteDiscoverTV = (filters: {
  with_genres?: string;
  first_air_date_year?: string;
  with_origin_country?: string;
  sort_by?: string;
}) => {
  return useInfiniteQuery({
    queryKey: ["discoverTV", filters, "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      api.get<unknown, FetchResponse<TVShow>>("/discover/tv", {
        params: { ...filters, page: pageParam },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: FetchResponse<TVShow>) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
};
