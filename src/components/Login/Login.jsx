import { useEffect, useRef, useState } from "react";
import Header from "../common/Header";
import { checkValidData } from "../../utils/validate";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile  } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addUser } from "../../utils/useSlice";
import useDocumentTitle from "../../hooks/useDocumentTitle";

import { BG_LOGO } from "../../utils/constants";

import { DEFAULT_USER_AVATAR } from "../../utils/constants";


const Login = () => {
  //set the form change
  const [isSignInForm, setIsSignForm]= useState(true);
  useDocumentTitle(isSignInForm ? "Netflix+GPT | Sign In" : "Netflix+GPT | Sign Up");

  //to error message
  const [errorMessage, setErrorMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (user) {
      navigate("/browse", { replace: true });
    }
  }, [user, navigate]);


  
  //useref hook
  const email = useRef(null);
  const password = useRef(null);
  const fullName = useRef(null);

  const toggleSignInForm = () => {
    setIsSignForm(!isSignInForm);
  }

  const handleButtonClick = (event) => {
    event.preventDefault();
     const message = checkValidData(email.current.value, password.current.value);
    setErrorMessage(message);

    if(message) return;

    //sign in/ sign up user
    if(!isSignInForm) {

      //sign up logic
      createUserWithEmailAndPassword(
        auth, 
        email.current.value, 
        password.current.value)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;

          updateProfile(user, {
            displayName: fullName.current.value, 
            photoURL: DEFAULT_USER_AVATAR
          }).then(() => {
            // Profile updated!
            const {uid, email, displayName, photoURL} = auth.currentUser;
            
            dispatch(addUser({uid: uid, email: email, displayName: displayName, photoURL: photoURL}));
          }).catch((error) => {
            setErrorMessage(error.message);
          });

        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + errorMessage);
          // ..
        });

    } else {

      //sign in logic
      signInWithEmailAndPassword(auth, email.current.value, password.current.value)
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + errorMessage);
          
        });
    }
  }

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-black">
      <Header/>
      <div className="absolute inset-0" aria-hidden="true">
        <img src={BG_LOGO} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 flex min-h-dvh items-center justify-center px-4 pb-6 pt-24 sm:px-6 sm:pt-28">
      <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md rounded-md bg-black/80 p-6 text-white shadow-2xl sm:p-10">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">
        {isSignInForm ? "Sign In" : "Sign Up"}
      </h1>
      
      {!isSignInForm && (
        <input
          type="text"
          placeholder="Full Name"
          className="mb-4 w-full rounded-sm bg-gray-700 p-3 text-base outline-none ring-0 placeholder:text-gray-300 focus:ring-2 focus:ring-red-500"
          ref={fullName}
          
        />
      )}

      <input
        type="email"
        placeholder="Email Address"
        className="mb-4 w-full rounded-sm bg-gray-700 p-3 text-base outline-none ring-0 placeholder:text-gray-300 focus:ring-2 focus:ring-red-500"
        ref={email}
      />
      <input
        type="password"
        placeholder="Password"
        className="mb-1 w-full rounded-sm bg-gray-700 p-3 text-base outline-none ring-0 placeholder:text-gray-300 focus:ring-2 focus:ring-red-500"
        ref={password}
      />
      <p className="min-h-9 py-2 text-sm font-semibold text-red-500" aria-live="polite">{errorMessage}</p>
      <button className="mt-2 w-full rounded-sm bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-black cursor-pointer" onClick={handleButtonClick}>{isSignInForm ? "Sign In" : "Sign Up"}</button>
      <p className="pt-6 text-sm text-gray-300 sm:text-base">{isSignInForm ? "New to Netflix+GPT?" : "Already registered"}  <button type="button" className="font-semibold text-red-500 underline underline-offset-2 hover:text-red-400 cursor-pointer" onClick={toggleSignInForm}>{isSignInForm ? "Sign Up Now" : "Sign In Now"}</button></p>
      </form>
      </div>
    </main>
  )
}

export default Login;
