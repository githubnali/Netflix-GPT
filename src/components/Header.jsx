// import Logo from '../assets/netflix+GPT_logo';

import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { addUser, removeUser } from "../utils/useSlice";

import { toggleGptSearchView } from "../utils/gptSlice";
import { SUPPORTED_LANGUAGES } from "../utils/constants";
import { changeLanguage } from "../utils/configSlice";

const Header = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user );

  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);

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

  const handleGptSearchClick = () => {
    //Toggle the GPT Search
    dispatch(toggleGptSearchView());
  }

  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  }

  return (

    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-linear-to-b from-black px-4 py-2 sm:px-8 md:px-12">
      <img
        className="h-12 w-auto object-contain sm:h-16 md:h-20"
        src="/header_logo.png"
        alt="Netflix GPT logo"
      />    

    {user && 
        <div className="flex items-center gap-2 sm:gap-5">

          {showGptSearch && 
            <select className="p-2 rounded bg-gray-400 text-white cursor-pointer" onChange={handleLanguageChange}>
              {SUPPORTED_LANGUAGES.map(lang => 
                <option key={lang.identifier} value={lang.identifier}>{lang.name}</option>
              )}
            </select>
          }

          <button className="py-2 px-4 bg-purple-800 text-white my-2 rounded-full font-semibold cursor-pointer" onClick={handleGptSearchClick}>{showGptSearch ? "Home Page" : "GPT Search"}  </button>
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
