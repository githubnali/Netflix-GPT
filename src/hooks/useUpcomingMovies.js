import { useDispatch } from "react-redux";

import { OPTIONS } from "../utils/constants";

import { addUpcomingMovies } from "../utils/moviesSlice";

import { useEffect } from "react";


const useUpcomingMovies = () => {

    //fetch data from TMDB api and updating the store
    const dispatch = useDispatch()
    const getUpcomingMovies = async () => {

        const data = await fetch("https://api.themoviedb.org/3/movie/upcoming?&page=1", OPTIONS);

        const json = await data.json();

        dispatch(addUpcomingMovies(json.results));

    }

    useEffect(() => {
        getUpcomingMovies()
    }, [])
}

export default useUpcomingMovies;