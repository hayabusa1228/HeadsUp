import React from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header.tsx";

const SignUp: React.FC = () => {
  return (
    <div className="bg-home-bg-img h-screen bg-cover bg-opacity-10">
      <Header />
      <div className="w-full  absolute  flex items-center justify-center mt-28">
        <form className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
            ></input>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border text-gray-700 rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="text"
              placeholder="password"
            ></input>
          </div>
          <Link to="/home" className="flex items-center justify-center">
            <button
              className="bg-gray-900 hover:text-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Sign Up
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
