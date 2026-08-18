import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OPTIONS } from "../utils/constants";
import { setMovieDetails, setMovieDetailsError, startMovieDetailsFetch } from "../utils/movieDetailsSlice";

const useMovieDetails = (movieId) => {
  const dispatch = useDispatch();
  const { details, cast, trailerKey, similarMovies, isLoading, errorMessage } = useSelector(
    (store) => store.movieDetails
  );

  useEffect(() => {
    dispatch(startMovieDetailsFetch(movieId));

    const fetchMovieDetails = async () => {
      try {
        const [detailsRes, creditsRes, videosRes, similarRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${movieId}`, OPTIONS),
          fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits`, OPTIONS),
          fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos`, OPTIONS),
          fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?page=1`, OPTIONS),
        ]);

        if (!detailsRes.ok) throw new Error("Movie not found");

        const [detailsJson, creditsJson, videosJson, similarJson] = await Promise.all([
          detailsRes.json(),
          creditsRes.json(),
          videosRes.json(),
          similarRes.json(),
        ]);

        const trailers = (videosJson.results ?? []).filter(
          (video) => video.site === "YouTube" && video.type === "Trailer"
        );

        dispatch(setMovieDetails({
          movieId,
          details: detailsJson,
          cast: (creditsJson.cast ?? []).slice(0, 10),
          trailerKey: trailers[0]?.key ?? null,
          similarMovies: similarJson.results ?? [],
        }));
      } catch {
        dispatch(setMovieDetailsError({ movieId, errorMessage: "Couldn't load this movie right now. Please try again." }));
      }
    };

    fetchMovieDetails();
  }, [movieId, dispatch]);

  return { details, cast, trailerKey, similarMovies, isLoading, errorMessage };
};

export default useMovieDetails;
