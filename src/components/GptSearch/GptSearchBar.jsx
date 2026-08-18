import { useDispatch, useSelector } from "react-redux"
import lang from "../../utils/languageConstants"
import { useRef } from "react";

import openAi from "../../utils/openAi";
import { OPTIONS } from "../../utils/constants";
import { addGptMovieResult, setGptSearchError, setGptSearchLoading } from "../../utils/gptSlice";

const GptSearchBar = () => {

  const langKey = useSelector((store) => store.config.lang);
  const isLoading = useSelector((store) => store.gpt.isLoading);

  const searchText = useRef(null);

  //use dispatrch to store the data
  const dispatch = useDispatch();


  const handleGptSearchClick = async() => {

    const query = searchText.current.value.trim();
    if (!query) return;

    dispatch(setGptSearchLoading(true));

    const gptQuery = "act as a Movie Recomendation System Suggest Some movies for the query" + query + ". only give me names of 5 movies, comma seperated like the example result given ahead. example results: K.G.F, Sholay, Don, Golmal, Koi Mil Gaya"

    //search movie in TMDB data basde
    const searchMovieTMDB = async(movie) => {
        const data = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movie}&page=1`, OPTIONS);

        const json = await data.json();

        return json.results;
    }

    try {
      //make an api call to GPT API and get Movie Results
      const gptResults = await openAi.chat.completions.create({
          model: 'gpt-5.4-mini',
          messages: [
              { role: 'user', content: gptQuery },
          ],
      });

      if(!gptResults.choices?.length) {
          dispatch(setGptSearchError("Couldn't get recommendations right now. Please try again."));
          return;
      }

      const gptMovies = gptResults.choices[0].message.content.split(',').map((movie) => movie.trim());

      const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie));

      const tmdbResults = await Promise.all(promiseArray);

      dispatch(addGptMovieResult({movieNames: gptMovies,movieResults: tmdbResults}));
    } catch {
      dispatch(setGptSearchError("Something went wrong while searching. Please try again."));
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleGptSearchClick();
    }
  }

  return (
    <div className="flex justify-center pt-24 sm:pt-32">
        <form
          className="flex w-[90%] max-w-4xl flex-col gap-3 rounded bg-black/70 p-4 sm:flex-row sm:gap-4 sm:p-6"
          onSubmit={(e) => e.preventDefault()}
        >
            <input
                type="text"
                placeholder={lang[langKey].gptSearchPlaceholder}
                ref={searchText}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="w-full rounded border-2 border-gray-800 bg-white p-3 text-base text-black disabled:opacity-60 sm:flex-1"
            />
            <button
              type="button"
              className="w-full shrink-0 cursor-pointer rounded-lg bg-red-700 px-4 py-2.5 text-base font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-6"
              onClick={handleGptSearchClick}
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : lang[langKey].search}
            </button>
        </form>
    </div>
  )
}

export default GptSearchBar
