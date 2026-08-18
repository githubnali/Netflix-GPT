import { useSelector } from "react-redux"
import MovieList from "./MovieList"

const SecondaryContainer = () => {

  const movies = useSelector((store) => store.movies);
  return (
    <section className="relative z-20 -mt-[24dvh] space-y-9 bg-linear-to-b from-transparent via-black/40 to-black px-4 pb-12 pt-16 sm:-mt-[26dvh] sm:space-y-12 sm:px-8 sm:pt-20 md:px-12">
      <MovieList title={"Now Playing Movies"} movies={movies.nowPlayingMovies}/>
      <MovieList title={"Top Rated Movies"} movies={movies.topratedMovies}/>
      <MovieList title={"Popular Movies"} movies={movies.popularMovies}/>
      <MovieList title={"Upcoming Movies"} movies={movies.upcomingMovies}/>
    </section>

    /**
     * Movie List - Popular
     *    - mutiple movie cards 
     * Movie List - trending movies
     * Movie List - now playing movies
     * Movie List - Hrror
     * 
     */
  )
}

export default SecondaryContainer
