import { useRef, useState } from "react";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

const VideoBackground = ({movieId}) => {
  const trailerVideo = useSelector((store) => store.movies.trailerVideo);
  const trailerKey = trailerVideo?.key;
  const iframeRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useMovieTrailer(movieId);

  const toggleMute = () => {
    const command = isMuted ? "unMute" : "mute";

    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: command, args: [] }),
      "*"
    );
    setIsMuted((currentValue) => !currentValue);
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
        {trailerKey && <iframe 
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-screen w-screen min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2 border-0"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&rel=0&cc_load_policy=0&iv_load_policy=3&enablejsapi=1`}
          title="YouTube video player" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          ref={iframeRef}
          ></iframe>}
        {trailerKey && <button
          type="button"
          onClick={toggleMute}
          className="absolute bottom-[32dvh] right-4 z-20 grid size-10 place-items-center rounded-full border border-white/70 bg-black/45 text-xl text-white backdrop-blur-sm transition hover:scale-110 hover:bg-black/70 focus:outline-none sm:right-8 sm:size-12"
          aria-label={isMuted ? "Unmute trailer" : "Mute trailer"}
        >
          {isMuted ? <IoVolumeMuteOutline /> : <IoVolumeHighOutline />}
        </button>}
    </div>
  )
}

export default VideoBackground
