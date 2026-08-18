import { createBrowserRouter } from "react-router-dom"
import ProtectedRoute from "./common/ProtectedRoute";

import { RouterProvider } from "react-router-dom";

import { Suspense, lazy, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, initAnalytics } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../utils/useSlice";
import { resetGptSearch } from "../utils/gptSlice";

const Login = lazy(() => import("./Login/Login"));
const Browse = lazy(() => import("./Browse/Browse"));
const MovieDetails = lazy(() => import("./MovieDetails/MovieDetails"));
const NotFound = lazy(() => import("./NotFound/NotFound"));

const PageLoader = () => (
    <div className="flex min-h-dvh items-center justify-center bg-black text-white">
        Loading...
    </div>
)

const Body = () => {

    const dispatch = useDispatch();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const idleId = (window.requestIdleCallback ?? ((cb) => setTimeout(cb, 200)))(() => {
            initAnalytics();
        });

        return () => (window.cancelIdleCallback ?? clearTimeout)(idleId);
    }, [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const { uid, email, displayName, photoURL } = user;
                dispatch(addUser({ uid: uid, email: email, displayName: displayName, photoURL: photoURL }));
            } else {
                dispatch(removeUser());
                dispatch(resetGptSearch());
            }
            setAuthChecked(true);
        });

        return () => unsubscribe();
    }, [dispatch])

    const appRouter = createBrowserRouter([
        {
            path: "/",
            element: <Suspense fallback={<PageLoader/>}><Login/></Suspense>
        },
        {
            path: "/browse",
            element: <ProtectedRoute><Suspense fallback={<PageLoader/>}><Browse/></Suspense></ProtectedRoute>
        },
        {
            path: "/browse/movie/:movieId",
            element: <ProtectedRoute><Suspense fallback={<PageLoader/>}><MovieDetails/></Suspense></ProtectedRoute>
        },
        {
            path: "*",
            element: <Suspense fallback={<PageLoader/>}><NotFound/></Suspense>
        }
    ]);

    if (!authChecked) {
        return <PageLoader/>
    }

    return (
        <div>
            <RouterProvider router={appRouter}/>
        </div>
    )
}

export default Body
