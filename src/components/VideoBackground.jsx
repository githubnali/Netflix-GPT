import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

const VideoBackground = ({movieId}) => {
  const trailerVideo = useSelector((store) => store.movies.trailerVideo)
  const trailerKey = trailerVideo?.key;

  useMovieTrailer(movieId);

  return (
    <div className="absolute inset-0 overflow-hidden">
        {trailerKey && <iframe 
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-screen w-screen min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2 border-0"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&rel=0&cc_load_policy=0&iv_load_policy=3`}
          title="YouTube video player" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          ></iframe>}
    </div>
  )
}

export default VideoBackground
