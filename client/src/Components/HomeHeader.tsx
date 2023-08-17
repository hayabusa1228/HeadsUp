import React from 'react'
import { Link } from "react-router-dom";
const Header: React.FC = () => {
  return (
  <nav className="flex items-center justify-between flex-wrap bg-gray-900 p-6">
  <div className="flex items-center flex-shrink-0 text-white mr-6">
    <span className="font-semibold text-xl md:text-3xl tracking-tight italic p-3"><Link to="/">Heads Up!</Link></span>
  </div>
  <div className="flex items-center w-auto">
      <Link to="/signup" className="inline-block text-sm md:text-base px-4 py-2 mx-5 leading-none border rounded text-white border-white hover:border-transparent hover:text-white hover:bg-gray-600 mt-4 lg:mt-0">Sign up </Link>
      <Link to="/signin" className="inline-block text-sm md:text-base px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-white hover:bg-gray-600 mt-4 lg:mt-0">Sign in</Link>
  </div>
</nav>
  )
}

export default Header