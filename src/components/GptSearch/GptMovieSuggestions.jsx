import { useSelector } from "react-redux"
import MovieList from "../movies/MovieList";
import ShimmerGptResults from "../shimmer/ShimmerGptResults";

const GptMovieSuggestions = () => {

    const {movieNames, movieResults, isLoading, errorMessage} = useSelector((store) => store.gpt);

    if (isLoading) return <ShimmerGptResults />;

    if (errorMessage) {
        return (
            <p className="mx-auto w-[90%] max-w-4xl rounded bg-black/60 p-4 text-center text-sm font-semibold text-red-500 sm:p-6">
                {errorMessage}
            </p>
        )
    }

    if(!movieNames) return null;

  return (

    <div className="mx-auto w-[90%] max-w-4xl space-y-8 rounded bg-black/60 p-4 sm:p-6">
        {movieNames.map((movieName, index) => <MovieList key={movieName} title={movieName} movies={movieResults[index]}/>)}
    </div>
  )
}

export default GptMovieSuggestions
