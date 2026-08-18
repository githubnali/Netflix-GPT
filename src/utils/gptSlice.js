import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showGptSearch: false,
    movieNames: null,
    movieResults: null,
    isLoading: false,
    errorMessage: null
};

const gptSlice = createSlice({
    name: 'gpt',
    initialState,
    reducers: {
        resetGptSearch: () => initialState,
        toggleGptSearchView: (state) => {
            state.showGptSearch = !state.showGptSearch;
            state.movieNames = null;
            state.movieResults = null;
            state.isLoading = false;
            state.errorMessage = null;
        },
        setGptSearchLoading: (state, action) => {
            state.isLoading = action.payload;
            if (action.payload) {
                state.errorMessage = null;
            }
        },
        setGptSearchError: (state, action) => {
            state.errorMessage = action.payload;
            state.isLoading = false;
        },
        addGptMovieResult: (state, action) => {

            const {movieNames, movieResults} = action.payload;
            state.movieNames = movieNames;
            state.movieResults = movieResults;
            state.isLoading = false;
            state.errorMessage = null;

        }

    }
})


export const {toggleGptSearchView, addGptMovieResult, setGptSearchLoading, setGptSearchError, resetGptSearch} = gptSlice.actions;

export default gptSlice.reducer
