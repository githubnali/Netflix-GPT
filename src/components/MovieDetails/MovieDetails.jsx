import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack, IoStar, IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import useMovieDetails from "../../hooks/useMovieDetails";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import MovieList from "../movies/MovieList";
import ShimmerMovieDetails from "../shimmer/ShimmerMovieDetails";
import { BACKDROP_CDN_URL, PROFILE_CDN_URL } from "../../utils/constants";

const formatRuntime = (minutes) => {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours ? `${hours}h ${mins}m` : `${mins}m`;
};

const MovieDetails = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { details, cast, trailerKey, similarMovies, isLoading, errorMessage } = useMovieDetails(movieId);

  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef(null);

  useDocumentTitle(details ? `Netflix+GPT | ${details.title}` : "Netflix+GPT | Movie");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [movieId]);

  const toggleMute = () => {
    const command = isMuted ? "unMute" : "mute";
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: command, args: [] }),
      "*"
    );
    setIsMuted((currentValue) => !currentValue);
  };

  if (isLoading) return <ShimmerMovieDetails />;

  if (errorMessage || !details) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-black px-4 text-center text-white">
        <p className="text-lg font-semibold text-red-500">{errorMessage ?? "Movie not found."}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="cursor-pointer rounded bg-red-600 px-5 py-2.5 font-semibold transition hover:bg-red-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { title, overview, backdrop_path, poster_path, genres, release_date, runtime, vote_average, tagline } = details;
  const year = release_date ? release_date.slice(0, 4) : null;
  const backdrop = backdrop_path ?? poster_path;

  return (
    <div className="min-h-dvh bg-black text-white">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="fixed left-4 top-4 z-30 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-xl text-white backdrop-blur-sm transition hover:bg-black/80 sm:left-8 sm:top-6"
        aria-label="Go back"
      >
        <IoArrowBack />
      </button>

      <div className="relative h-[70dvh] w-full overflow-hidden bg-zinc-900 sm:h-[85dvh]">
        {trailerKey ? (
          <iframe
            className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-screen min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2 border-0"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&rel=0&cc_load_policy=0&iv_load_policy=3&enablejsapi=1`}
            title={`${title} trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            ref={iframeRef}
          />
        ) : backdrop ? (
          <img
            src={BACKDROP_CDN_URL + backdrop}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

        {trailerKey && (
          <button
            type="button"
            onClick={toggleMute}
            className="absolute bottom-[26dvh] right-4 z-20 grid size-10 place-items-center rounded-full border border-white/70 bg-black/45 text-xl text-white backdrop-blur-sm transition hover:scale-110 hover:bg-black/70 focus:outline-none sm:bottom-[30dvh] sm:right-8 sm:size-12"
            aria-label={isMuted ? "Unmute trailer" : "Mute trailer"}
          >
            {isMuted ? <IoVolumeMuteOutline /> : <IoVolumeHighOutline />}
          </button>
        )}

        <div className="absolute inset-x-0 bottom-0 space-y-3 px-4 pb-8 sm:px-8 sm:pb-12 md:px-12">
          <h1 className="max-w-2xl text-balance text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">{title}</h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/90 sm:text-base">
            {vote_average > 0 && (
              <span className="flex items-center gap-1 font-semibold text-green-400">
                <IoStar aria-hidden="true" /> {vote_average.toFixed(1)}
              </span>
            )}
            {year && <span>{year}</span>}
            {formatRuntime(runtime) && <span>{formatRuntime(runtime)}</span>}
            {genres?.length > 0 && <span className="truncate">{genres.map((g) => g.name).join(" • ")}</span>}
          </div>

          {tagline && <p className="max-w-xl text-sm italic text-white/70 sm:text-base">{tagline}</p>}
        </div>
      </div>

      <div className="space-y-10 px-4 py-8 sm:px-8 sm:py-10 md:px-12">
        {overview && (
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">{overview}</p>
        )}

        {cast?.length > 0 && (
          <section>
            <h2 className="mb-3 text-lg font-bold tracking-tight text-white sm:mb-4 sm:text-2xl">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {cast.filter((member) => member.profile_path).map((member) => (
                <div key={member.id} className="w-20 shrink-0 text-center sm:w-24">
                  <img
                    src={PROFILE_CDN_URL + member.profile_path}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    className="mb-2 aspect-square w-full rounded-full object-cover"
                  />
                  <p className="truncate text-xs font-semibold text-white">{member.name}</p>
                  <p className="truncate text-xs text-white/60">{member.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {similarMovies?.length > 0 && (
          <MovieList title="More Like This" movies={similarMovies} />
        )}
      </div>
    </div>
  )
}

export default MovieDetails
