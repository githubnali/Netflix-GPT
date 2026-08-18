import { Link } from "react-router-dom"
import { IMG_CDN_URL } from "../../utils/constants"

const MovieCard = ({id, posterPath, title}) => {

  if (!posterPath) return null;

  return (
    <Link
      to={`/browse/movie/${id}`}
      className="group/card relative block w-28 shrink-0 snap-start overflow-hidden rounded-sm bg-zinc-900 shadow-lg transition duration-300 hover:z-10 hover:scale-110 hover:shadow-2xl focus:z-10 focus:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-36 md:w-40 lg:w-44"
    >
        <img
          className="aspect-[2/3] w-full object-cover transition duration-300 group-hover/card:brightness-75 group-focus/card:brightness-75"
          src={IMG_CDN_URL + posterPath}
          alt={title}
          loading="lazy"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 bg-linear-to-t from-black via-black/80 to-transparent px-2 pb-2 pt-8 opacity-0 transition duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus/card:translate-y-0 group-focus/card:opacity-100 sm:block">
          <p className="truncate text-xs font-semibold text-white">{title}</p>
        </div>
    </Link>
  )
}

export default MovieCard
