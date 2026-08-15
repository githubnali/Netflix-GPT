import Header from "./Header";

import useNowPlayingMovies from "../hooks/useNowPlayingMovies";
import MainContainer from "./mainContainer";
import SecondaryContainer from "./secondaryContainer";
import usePopularMovies from "../hooks/usePopularMovies";
import useTopratedMovies from "../hooks/useTopratedMovies";
import useUpcomingMovies from "../hooks/useUpcomingMovies";
import GptSearch from "./GptSearch";
import { useSelector } from "react-redux";

const Browse = () => {

  useNowPlayingMovies();
  usePopularMovies();
  useTopratedMovies();
  useUpcomingMovies();

  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);

  return (

    <>
      <Header/>
      {
        showGptSearch ? (
          <GptSearch/>
        ): (
          <>
          <MainContainer/>
          <SecondaryContainer/>
          </>
        )
      }
    </>

      /**
       * Main Video Container
       *  - it has video background
       *  - video title
       *  - 
       * Secondary Container
       *  - movie list more tha 5
       *    - movie cards * n
       */
  )
}

export default Browse;