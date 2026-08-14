import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

const VideoBackground = ({movieId}) => {
  const trailerVideo = useSelector((store) => store.movies.trailerVideo)

  useMovieTrailer(movieId);

  return (
    <div className="absolute inset-0 overflow-hidden">
        <iframe 
          className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-screen w-screen min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2 border-0"
          src={`https://www.youtube.com/embed/${trailerVideo?.key}?&autoplay=1&mute=1`}
          title="YouTube video player" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          ></iframe>
    </div>
  )
}

export default VideoBackground
