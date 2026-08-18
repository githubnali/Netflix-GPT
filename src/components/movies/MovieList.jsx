import { useEffect, useRef, useState } from "react";
import { IoChevronForward } from "react-icons/io5";
import MovieCard from './MovieCard'

const MovieList = ({title, movies}) => {
  const rowRef = useRef(null);
  const [canScrollForward, setCanScrollForward] = useState(false);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const checkOverflow = () => setCanScrollForward(row.scrollWidth > row.clientWidth + 1);

    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(row);
    return () => observer.disconnect();
  }, [movies]);

  if (!movies?.length) return null;

  const scrollForward = () => {
    rowRef.current?.scrollBy({
      left: rowRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section className="group/row relative">
      <h2 className="mb-3 text-lg font-bold tracking-tight text-white sm:mb-4 sm:text-2xl">{title}</h2>
      <div
        ref={rowRef}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-visible pb-5 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-3"
        aria-label={`${title} movies`}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} id={movie.id} posterPath={movie.poster_path} title={movie.title || movie.original_title} />
        ))}
      </div>
      {canScrollForward && (
        <button
          type="button"
          onClick={scrollForward}
          className="absolute bottom-5 right-0 top-10 z-20 flex w-10 items-center justify-center bg-linear-to-r from-transparent to-black/90 text-3xl text-white opacity-90 outline-none transition hover:w-12 hover:bg-black/80 hover:text-red-500 focus:outline-none sm:top-12 sm:w-12"
          aria-label={`Show more ${title} movies`}
        >
          <IoChevronForward aria-hidden="true" />
        </button>
      )}
    </section>
  );
}

export default MovieList
