import ShimmerCard from "./ShimmerCard"

const ShimmerMovieList = ({ title, cards = 6 }) => {
  return (
    <section>
      {title ? (
        <h2 className="mb-3 text-lg font-bold tracking-tight text-white sm:mb-4 sm:text-2xl">{title}</h2>
      ) : (
        <div className="mb-3 h-5 w-40 rounded shimmer sm:mb-4 sm:h-7 sm:w-56" />
      )}
      <div className="flex gap-2 overflow-hidden pb-5 pt-2 sm:gap-3">
        {Array.from({ length: cards }).map((_, index) => (
          <ShimmerCard key={index} />
        ))}
      </div>
    </section>
  )
}

export default ShimmerMovieList
