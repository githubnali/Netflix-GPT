import { IMG_CDN_URL } from "../utils/constants"

const MovieCard = ({posterPath, title}) => {

  if (!posterPath) return null;

  return (
    <article className="group/card relative w-28 shrink-0 snap-start overflow-hidden rounded-sm bg-zinc-900 shadow-lg transition duration-300 hover:z-10 hover:scale-110 hover:shadow-2xl focus-within:z-10 focus-within:scale-110 sm:w-36 md:w-40 lg:w-44">
        <img className="aspect-[2/3] w-full object-cover transition duration-300 group-hover/card:brightness-75" src={IMG_CDN_URL + posterPath} alt={title}/>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 bg-linear-to-t from-black via-black/80 to-transparent px-2 pb-2 pt-8 opacity-0 transition duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 sm:block">
          <p className="truncate text-xs font-semibold text-white">{title}</p>
        </div>
    </article>
  )
}

export default MovieCard
