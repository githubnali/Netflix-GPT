import { IoIosPlay } from "react-icons/io";
import { MdOutlineInfo } from "react-icons/md";

const VideoTitle = ({title, overview}) => {
  return (
    <section className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/70 to-transparent">
      <div className="flex h-full w-full max-w-xl flex-col justify-center px-4 pt-14 sm:px-8 sm:pt-16 md:max-w-2xl md:px-12">
        <h1 className="max-w-[16ch] text-balance text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">{title}</h1>
        <p className="hidden max-w-xl py-5 text-sm leading-relaxed text-white/90 sm:block md:py-6 md:text-base">{overview}</p>

        <div className="mt-5 flex flex-wrap gap-3 sm:mt-0 sm:gap-4">
            <button className="flex cursor-pointer items-center gap-1 rounded bg-white px-5 py-2.5 text-base font-semibold text-black transition hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-white sm:px-8 sm:text-lg">
             <IoIosPlay /> 
             <span>Play</span>
            </button>
            <button className="hidden cursor-pointer items-center gap-1 rounded bg-gray-500/70 px-5 py-2.5 text-base font-semibold text-white transition hover:bg-gray-500 sm:flex sm:px-8 sm:text-lg">
              <MdOutlineInfo/>

              <span>
                More Info
              </span>
            </button>
        </div>
      </div>
    </section>
  )
}

export default VideoTitle;
