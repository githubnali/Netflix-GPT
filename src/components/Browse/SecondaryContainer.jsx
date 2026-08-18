import { useSelector } from "react-redux"
import MovieList from "../movies/MovieList"
import ShimmerMovieList from "../shimmer/ShimmerMovieList"

const SecondaryContainer = () => {

  const movies = useSelector((store) => store.movies);

  const rows = [
    { title: "Now Playing Movies", movies: movies.nowPlayingMovies },
    { title: "Top Rated Movies", movies: movies.topratedMovies },
    { title: "Popular Movies", movies: movies.popularMovies },
    { title: "Upcoming Movies", movies: movies.upcomingMovies },
  ];

  return (
    <section className="relative z-20 -mt-[24dvh] space-y-9 bg-linear-to-b from-transparent via-black/40 to-black px-4 pb-12 pt-16 sm:-mt-[26dvh] sm:space-y-12 sm:px-8 sm:pt-20 md:px-12">
      {rows.map((row) =>
        row.movies === null
          ? <ShimmerMovieList key={row.title} title={row.title} />
          : <MovieList key={row.title} title={row.title} movies={row.movies}/>
      )}
    </section>
  )
}

export default SecondaryContainer
