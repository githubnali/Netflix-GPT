import ShimmerMovieList from "./ShimmerMovieList"

const ShimmerGptResults = () => {
  return (
    <div className="mx-auto w-[90%] max-w-4xl space-y-8 rounded bg-black/60 p-4 sm:p-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <ShimmerMovieList key={index} cards={5} />
      ))}
    </div>
  )
}

export default ShimmerGptResults
