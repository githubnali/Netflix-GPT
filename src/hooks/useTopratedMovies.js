import { useDispatch, useSelector } from "react-redux";

import { OPTIONS } from "../utils/constants";

import { addTopratedMovies } from "../utils/moviesSlice";

import { useEffect } from "react";


const useTopratedMovies = () => {

    //fetch data from TMDB api and updating the store
    const dispatch = useDispatch();

    const topRatedMovies = useSelector((store) => store.movies.topRatedMovies);

    const getTopratedMovies = async () => {

        const data = await fetch("https://api.themoviedb.org/3/movie/top_rated?&page=1", OPTIONS);

        const json = await data.json();

        dispatch( addTopratedMovies(json.results));

    }

    useEffect(() => {
        !topRatedMovies && getTopratedMovies();
    }, [])
}

export default useTopratedMovies;