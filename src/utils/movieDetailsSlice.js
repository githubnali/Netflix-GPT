import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    movieId: null,
    details: null,
    cast: null,
    trailerKey: null,
    similarMovies: null,
    isLoading: true,
    errorMessage: null
};

const movieDetailsSlice = createSlice({
    name: 'movieDetails',
    initialState,
    reducers: {
        startMovieDetailsFetch: (state, action) => {
            state.movieId = action.payload;
            state.isLoading = true;
            state.errorMessage = null;
            state.details = null;
            state.cast = null;
            state.trailerKey = null;
            state.similarMovies = null;
        },
        setMovieDetails: (state, action) => {
            const { movieId, details, cast, trailerKey, similarMovies } = action.payload;
            if (state.movieId !== movieId) return;
            state.details = details;
            state.cast = cast;
            state.trailerKey = trailerKey;
            state.similarMovies = similarMovies;
            state.isLoading = false;
        },
        setMovieDetailsError: (state, action) => {
            const { movieId, errorMessage } = action.payload;
            if (state.movieId !== movieId) return;
            state.errorMessage = errorMessage;
            state.isLoading = false;
        }
    }
})

export const { startMovieDetailsFetch, setMovieDetails, setMovieDetailsError } = movieDetailsSlice.actions;

export default movieDetailsSlice.reducer
