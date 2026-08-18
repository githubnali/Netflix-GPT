import { Suspense, lazy } from "react";
import Header from "../common/Header";

import useNowPlayingMovies from "../../hooks/useNowPlayingMovies";
import MainContainer from "./MainContainer";
import SecondaryContainer from "./SecondaryContainer";
import usePopularMovies from "../../hooks/usePopularMovies";
import useTopratedMovies from "../../hooks/useTopratedMovies";
import useUpcomingMovies from "../../hooks/useUpcomingMovies";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useSelector } from "react-redux";
import ShimmerGptResults from "../shimmer/ShimmerGptResults";

const GptSearch = lazy(() => import("../GptSearch/GptSearch"));

const Browse = () => {

  useNowPlayingMovies();
  usePopularMovies();
  useTopratedMovies();
  useUpcomingMovies();

  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  useDocumentTitle(showGptSearch ? "Netflix+GPT | GPT Search" : "Netflix+GPT | Browse");

  return (

    <>
      <Header/>
      {
        showGptSearch ? (
          <Suspense fallback={<ShimmerGptResults />}>
            <GptSearch/>
          </Suspense>
        ): (
          <>
          <MainContainer/>
          <SecondaryContainer/>
          </>
        )
      }
    </>
  )
}

export default Browse;