import ShimmerMovieList from "./ShimmerMovieList"

const ShimmerMovieDetails = () => {
  return (
    <div className="min-h-dvh bg-black">
      <div className="relative h-[70dvh] w-full shimmer sm:h-[80dvh]">
        <div className="absolute inset-x-0 bottom-0 space-y-4 bg-gradient-to-t from-black to-transparent p-4 sm:p-8 md:p-12">
          <div className="h-9 w-2/3 max-w-xl rounded shimmer sm:h-12" />
          <div className="h-4 w-1/3 max-w-xs rounded shimmer" />
          <div className="h-10 w-32 rounded shimmer" />
        </div>
      </div>

      <div className="space-y-10 px-4 py-8 sm:px-8 sm:py-10 md:px-12">
        <div className="space-y-2">
          <div className="h-4 w-full max-w-2xl rounded shimmer" />
          <div className="h-4 w-full max-w-xl rounded shimmer" />
          <div className="h-4 w-2/3 max-w-md rounded shimmer" />
        </div>

        <ShimmerMovieList title="Cast" cards={8} />
        <ShimmerMovieList title="More Like This" cards={6} />
      </div>
    </div>
  )
}

export default ShimmerMovieDetails
