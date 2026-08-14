import Header from "./Header";

import useNowPlayingMovies from "../hooks/useNowPlayingMovies";
import MainContainer from "./mainContainer";
import SecondaryContainer from "./secondaryContainer";

const Browse = () => {

  useNowPlayingMovies();

  return (

    <>
      <Header/>
      <MainContainer/>
      <SecondaryContainer/>
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