import { IoIosPlay } from "react-icons/io";
import { MdOutlineInfo } from "react-icons/md";

const VideoTitle = ({title, overview}) => {
  return (
    <section className="absolute inset-0 z-10 bg-gradient-to-r from-black pt-[15%] px-12">
        <h1 className="text-4xl font-bold text-white">{title}</h1>
        <p className="py-6 text-sm w-1/2 text-white">{overview}</p>

        <div className="flex gap-5">
            <button className="cursor-pointer bg-opacity-50 bg-white text-black py-2 px-8 rounded text-lg font-semibold flex items-center gap-1 hover:bg-opacity-80">
             <IoIosPlay /> 
             <span>Play</span>
            </button>
            <button className="cursor-pointer bg-opacity-50 bg-gray-500 text-white py-2 px-8 rounded text-lg font-semibold flex items-center gap-1">
              <MdOutlineInfo/>

              <span>
                More Info
              </span>
            </button>
        </div>
    </section>
  )
}

export default VideoTitle;
