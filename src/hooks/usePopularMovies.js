import { useDispatch, useSelector } from "react-redux";

import { OPTIONS } from "../utils/constants";

import { addPopularMovies } from "../utils/moviesSlice";

import { useEffect } from "react";


const usePopularMovies = () => {

    //fetch data from TMDB api and updating the store
    const dispatch = useDispatch();

    const popularMovies = useSelector((store) => store.movies.popularMovies);

    const getPopularMovies = async () => {

        const data = await fetch("https://api.themoviedb.org/3/movie/popular?&page=1", OPTIONS);

        const json = await data.json();

        dispatch(addPopularMovies(json.results));

    }

    useEffect(() => {
        !popularMovies && getPopularMovies();
    }, [])
}

export default usePopularMovies