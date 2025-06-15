import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../images/logo.png";
import image from "../images/authPageSide.png";
import { api_base_url } from '../helper';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Traditional signup
  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${api_base_url}/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, email, password: pwd }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Account created successfully");
        navigate("/login");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign Up Handler
  const handleGoogleSignUp = async () => {
    setError("");
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const { uid: firebaseUid, email, displayName } = result.user;

      // Set both name and username as displayName from Firebase
      const response = await fetch(`${api_base_url}/users/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid,
          email,
          name: displayName,
          username: displayName
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Account created successfully");
        navigate("/");
      } else {
        setError(data.message || "Google sign up failed. Please try again.");
      }
    } catch (err) {
      setError("Google sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex flex-col-reverse lg:flex-row items-center min-h-screen px-6 lg:px-20 bg-[#121212] text-white">
      <div className="left w-full lg:w-1/2 mb-10 lg:mb-0 flex flex-col items-start">
        <img className="w-40 mb-6" src={logo} alt="Logo" />
        <form onSubmit={submitForm} className="w-full max-w-md">
          <div className="inputBox mb-4">
            <input
              className="w-full px-4 py-2 border border-gray-600 bg-[#1E1E1E] rounded focus:outline-none focus:ring focus:ring-blue-500 text-white"
              required
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
              placeholder="Username"
              aria-label="Username"
            />
          </div>
          <div className="inputBox mb-4">
            <input
              className="w-full px-4 py-2 border border-gray-600 bg-[#1E1E1E] rounded focus:outline-none focus:ring focus:ring-blue-500 text-white"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Name"
              aria-label="Name"
            />
          </div>
          <div className="inputBox mb-4">
            <input
              className="w-full px-4 py-2 border border-gray-600 bg-[#1E1E1E] rounded focus:outline-none focus:ring focus:ring-blue-500 text-white"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              aria-label="Email"
            />
          </div>
          <div className="inputBox mb-4">
            <input
              className="w-full px-4 py-2 border border-gray-600 bg-[#1E1E1E] rounded focus:outline-none focus:ring focus:ring-blue-500 text-white"
              required
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              type="password"
              placeholder="Password"
              aria-label="Password"
            />
          </div>
          <p className="text-gray-400 text-sm mb-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            type="submit"
            className={`w-full py-2 text-white rounded ${
              isLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center w-full max-w-md my-4">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-3 text-gray-400">or</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* Google Sign Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full max-w-md py-2 bg-white text-black rounded flex items-center justify-center gap-2 font-medium hover:bg-gray-100 transition"
          disabled={isLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.2 33 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.8 0 5.3.9 7.3 2.5l6.3-6.3C34.2 5.1 29.4 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.5-4z"/><path fill="#34A853" d="M6.3 14.7l6.9 5.1C14.6 17 19 14 24 14c2.8 0 5.3.9 7.3 2.5l6.3-6.3C34.2 5.1 29.4 3 24 3 15.6 3 8.1 8.5 6.3 14.7z"/><path fill="#FBBC05" d="M24 44c5.4 0 10.2-1.8 13.9-4.9l-6.4-5.2C29.7 35.4 27 36 24 36c-5.6 0-10.2-3-12.7-7.5l-6.9 5.3C8.1 39.5 15.6 44 24 44z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7C34.2 33 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.8 0 5.3.9 7.3 2.5l6.3-6.3C34.2 5.1 29.4 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.5-4z"/></g></svg>
          {isLoading ? "Signing Up..." : "Sign Up with Google"}
        </button>
      </div>
      <div className="right w-full lg:w-1/2">
        <img
          className="w-full h-auto rounded-lg shadow-lg"
          src={image}
          alt="Side Illustration"
        />
      </div>
    </div>
  );
};

export default SignUp;
