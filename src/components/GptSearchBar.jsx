import { useDispatch, useSelector } from "react-redux"
import lang from "../utils/languageConstants"
import { useRef } from "react";

import openAi from "../utils/openAi";
import { OPTIONS } from "../utils/constants";
import { addGptMovieResult } from "../utils/gptSlice";

const GptSearchBar = () => {

  const langKey = useSelector((store) => store.config.lang);

  const searchText = useRef(null);

  //use dispatrch to store the data
  const dispatch = useDispatch();


  const handleGptSearchClick = async() => {

    //call the OPEN AI API
    console.log(searchText.current.value);

    const gptQuery = "act as a Movie Recomendation System Suggest Some movies for the query" + searchText.current.value + ". only give me names of 5 movies, comma seperated like the example result given ahead. example results: K.G.F, Sholay, Don, Golmal, Koi Mil Gaya"

    //search movie in TMDB data basde

    const searchMovieTMDB = async(movie) => {
        const data = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movie}&page=1`, OPTIONS);

        const json = await data.json();

        return json.results;
    }

    //make an api call to GPT API and get Movie Results
    const gptResults = await openAi.chat.completions.create({
        model: 'gpt-5.4-mini',
        messages: [
            { role: 'user', content: gptQuery },
        ],
    });

    if(!gptResults.choices) {
        //load the error message
    }

    console.log(gptResults.choices[0].message.content);

    //Premam, Ye Maaya Chesave, Geetha Govindam, Arjun Reddy, Malli Raava
    const gptMovies = gptResults.choices[0].message.content.split(',');

    //array of movies [Premam, Ye Maaya Chesave, Geetha Govindam, Arjun Reddy, Malli Raava]

    //for each movie i will use Search TMDB API to get data of particular movie

    const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie));
    
    //array of promises
    const tmdbResults = await Promise.all(promiseArray);

    console.log(tmdbResults);

    dispatch(addGptMovieResult({movieNames: gptMovies,movieResults: tmdbResults}));
  }
  return (
    <div className="pt-[8%] flex justify-center">
        <form className='p-6 bg-black/70 w-3/4 grid grid-cols-12' onSubmit={(e) => e.preventDefault()}>
            <input
                type='text'
                placeholder={lang[langKey].gptSearchPlaceholder}
                ref={searchText}
                className='p-4 mr-4 border-gray-800 border-2 rounded col-span-10 text-2xl bg-white'
            />
            <button className="py-2 px-4 bg-red-700 text-white rounded-lg col-span-2 text-xl font-semibold" onClick={handleGptSearchClick}>{lang[langKey].search}</button>
        </form>
    </div>
  )
}

export default GptSearchBar