import React from 'react'
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
  <nav className="flex items-center justify-between flex-wrap bg-gray-900 p-3">
  <div className="flex items-center flex-shrink-0 text-white mr-6">
    <span className="font-semibold text-xl md:text-3xl tracking-tight italic p-3"><Link to="/">Heads Up!</Link></span>
  </div>
</nav>
  )
}

export default Header