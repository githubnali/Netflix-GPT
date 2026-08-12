import { useRef, useState } from "react";
import Header from "./Header";
import { checkValidData } from "../utils/validate";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile  } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";

import { addUser } from "../utils/useSlice";

const Login = () => {
  //set the form change
  const [isSignInForm, setIsSignForm]= useState(true);

  //to error message
  const [errorMessage, setErrorMessage] = useState(null);

  const dispatch = useDispatch();


  
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
            photoURL: "https://avatars.githubusercontent.com/u/108607635?v=4"
          }).then(() => {
            // Profile updated!
            const {uid, email, displayName, photoURL} = auth.currentUser;
            
            dispatch(addUser({uid: uid, email: email, displayName: displayName, photoURL: photoURL}));
            
            //update our store from here

            
            // ...
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
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + errorMessage);
          
        });
    }
  }

  return (
    <>
    <Header/>
    <div className="absolute">
      <img src="https://assets.nflxext.com/ffe/siteui/vlv3/0ce6c17e-e188-4f13-aaf2-6366e12ba739/web/IN-en-20260803-TRIFECTA-perspective_7730cca2-6324-4104-bf66-1a1f6e1a3e61_large.jpg" alt="logo" className="h-screen w-screen" />
    </div>
    <form onSubmit={(e) => e.preventDefault()} className="p-5 px-8 bg-black absolute w-3/12 my-24 mx-auto left-0 right-0 text-white bg-opacity-80">
      <h1 className="font-bold text-xl p-3 my-3">
        {isSignInForm ? "Sign In" : "Sign Up"}
      </h1>
      
      {!isSignInForm && (
        <input
          type="text"
          placeholder="Full Name"
          className="p-3 my-3  w-full bg-gray-700 rounded-sm"
          ref={fullName}
          
        />
      )}

      <input
        type="text"
        placeholder="Email Address"
        className="p-3 my-3  w-full bg-gray-700 rounded-sm"
        ref={email}
      />
      <input
        type="password"
        placeholder="Password"
        className="p-3 my-3 w-full bg-gray-700 rounded-sm"
        ref={password}
      />
      <p className="text-red-500 py-2 font-semibold text-l">{errorMessage}</p>
      <button className="p-3 px-6 my-3 text-white bg-red-500 rounded-sm w-full font-semibold" onClick={handleButtonClick}>{isSignInForm ? "Sign In" : "Sign Up"}</button>
      <p className="py-4 cursor-pointer">{isSignInForm ? "New to Netflix+GPT?" : "Already regisered"}  <a className="underline text-red-600 font-semibold" onClick={toggleSignInForm}>{isSignInForm ? "Sign Up Now" : "Sign In Now"}</a></p>
    </form> 
    
    </>
  )
}

export default Login;
