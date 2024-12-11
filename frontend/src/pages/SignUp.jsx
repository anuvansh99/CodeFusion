import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../images/logo.png";
import image from "../images/authPageSide.png";
import { api_base_url } from '../helper';

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
        mode: "cors",
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
      console.error("Error:", err);
      setError("An unexpected error occurred. Please try again.");
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
