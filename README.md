# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Netflix+GPT
- created react project scaffold using vite build tool npm create vite@latest my-react-app -- --template react and configured

# Features
- Login/Signup page
    - Sign IN/Sign Up form
    - once logged in redirect to browserPage
- BrowserPage (comes after authentication)
    - Header
    - Main Movie
        - Trailer in Bg
        - Movie Title and Description
        - MovieSuggestion
          - movies list n

- NetflixGPT
    - SearchBar
    - Movie Suggestions


# Netflix + GPT
- Routing "React Router DOM"
- Header
- Login Form
- Sign Up Form
- Form validation
- useRef() Hook
- firebase setup
- deplying app to production
- create sign up authentication in firebase
- implemented sign in user API
- Created Redux Store with user slice
- implemented Signout
- updated profile api call
- 

# Bug Fixes
- Sign up user displayname and profile picture update
- if the user is not logged in /browse to login vice versa
- unsubscribed to onAuthStateChanged callback
- add hardcoded values to constants file very important



# Next Step Fetch Movies from (TMDB)
- Register for TMDB API
- Create a new APP
- Get Access Toekn
- Go to Documentation
- get data from TMDB now playing movive list from API
- custom hook for now playing movies
- updated the store with nowplaying
- created movie slice
- planning for main container and secondary container
- fetch data for trailer video
- updated store with trailer video data
- embeded the youtube video
- make it autoplay and mute
- added tailwind utility to looks main container awesome