// import Logo from '../assets/netflix+GPT_logo';

import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { addUser, removeUser } from "../utils/useSlice";

const Header = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user );

  const handleSignOut = () => {
    signOut(auth).then(() => {
    }).catch(() => {
      // An error happened.
      navigate("/error")
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const {uid, email, displayName, photoURL} = user;
            
            dispatch(addUser({uid: uid, email: email, displayName: displayName, photoURL: photoURL}));
            navigate("/browse");
            // ...
        } else {
            // User is signed out
            // ...
            dispatch(removeUser());
            navigate("/");
        }
    });

    //this will be called unsubscribe when component unmounts
    return () => unsubscribe();

  }, [])

  return (

    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-linear-to-b from-black px-4 py-2 sm:px-8">
      <img
        className="h-11 w-auto object-contain sm:h-14 md:h-16"
        src="/header_logo.png"
        alt="Netflix GPT logo"
      />    

    {user && 
        <div className="flex items-center gap-2 sm:gap-5">
          <img 
            src={user.photoURL}
            alt="user-logo"
            className="w-8 rounded-full sm:w-10"
          />
          
          <button className="cursor-pointer text-sm font-semibold text-white sm:text-base" onClick={handleSignOut}>Sign Out</button>
        </div>
    
    }
    
    
    </header>

  )
}

export default Header
