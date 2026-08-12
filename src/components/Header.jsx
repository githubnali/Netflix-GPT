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
    onAuthStateChanged(auth, (user) => {
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

  }, [])

  return (

    <div className="absolute px-8 py-2 bg-linear-to-b from-black z-10 flex justify-between w-screen">
      <img
        className="w-44"
        src="/header_logo.png"
        alt="Netflix GPT logo"
      />    

    {user && 
        <div className="flex items-center gap-5">
          <img 
            src={user.photoURL}
            alt="user-logo"
            className="w-10 rounded-full"
          />
          
          <button className="text-white font-semibold cursor-pointer" onClick={handleSignOut}>Sign Out</button>
        </div>
    
    }
    
    
    </div>

  )
}

export default Header
