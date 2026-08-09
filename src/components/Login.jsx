import { useState } from "react";
import Header from "./Header";

const Login = () => {
  const [isSignInForm, setIsSignForm]= useState(true);

  const toggleSignInForm = () => {
    setIsSignForm(!isSignInForm);
  }
  return (
    <>
    <Header/>
    <div className="absolute">
      <img src="https://assets.nflxext.com/ffe/siteui/vlv3/0ce6c17e-e188-4f13-aaf2-6366e12ba739/web/IN-en-20260803-TRIFECTA-perspective_7730cca2-6324-4104-bf66-1a1f6e1a3e61_large.jpg" alt="logo" />
    </div>
    <form className="p-5 px-8 bg-black absolute w-3/12 my-24 mx-auto left-0 right-0 text-white bg-opacity-80">
      <h1 className="font-bold text-xl p-3 my-3">
        {isSignInForm ? "Sign In" : "Sign Up"}
      </h1>
      
      {!isSignInForm && (
        <input
          type="text"
          placeholder="Full Name"
          className="p-3 my-3  w-full bg-gray-700 rounded-lg"
        />
      )}

      <input
        type="text"
        placeholder="Email Address"
        className="p-3 my-3  w-full bg-gray-700 rounded-lg"
      />
      <input
        type="password"
        placeholder="Password"
        className="p-3 my-3 w-full bg-gray-700 rounded-lg"
      />
      <button className="p-3 px-6 my-3 text-white bg-red-700 rounded w-full">{isSignInForm ? "Sign In" : "Sign Up"}</button>
      <p className="py-4 cursor-pointer">{isSignInForm ? "New to Netflix+GPT?" : "Already regisered"}  <a className="underline text-red-600 font-semibold" onClick={toggleSignInForm}>{isSignInForm ? "Sign Up Now" : "Sign In Now"}</a></p>
    </form> 
    
    </>
  )
}

export default Login;