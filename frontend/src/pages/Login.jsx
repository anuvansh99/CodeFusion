import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../images/logo.png";
import image from "../images/authPageSide.png";
import { api_base_url } from '../helper';

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${api_base_url}/login`, {
        mode: "cors",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pwd }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userId", data.userId);
        setTimeout(() => {
          window.location.href = "/";
        }, 200);
      } else {
        setError(data.message || "Login failed. Please try again.");
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
            Don't have an account?{" "}
            <Link to="/signUp" className="text-blue-400 hover:underline">
              Sign Up
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
            {isLoading ? "Logging In..." : "Login"}
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

export default Login;
