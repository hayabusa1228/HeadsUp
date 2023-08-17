import React from 'react'
import { Link } from "react-router-dom";
import Header from '../Components/Header.tsx';

const Home: React.FC = () => {
  return (
<div className="h-screen bg-home-bg-img  bg-cover">
  <Header/>
        <div className="absolute flex-col lg:flex-row inset-0 flex items-center justify-center text-white w-full">
          <div className="bg-gray-100  bg-cover p-6 lg:p-8 rounded-xl italic text-2xl text-gray-900 border-4 border-black border-double">
            <div className="text-4xl decoration-red-500 underline mb-4 text-center">Profile<br></br></div>
            <div className='my-2 px-5'>♠ ユーザー名: hogehoge</div>
            <div className='my-2 px-5'>♦ rate: 100</div>
            <div className='my-2 px-5'>♣ 試合数: 10</div>
            <div className='my-2 px-5'>❤ 勝率: 60%</div>
          </div>
          <div className='flex flex-col lg:flex-row'>
          <Link to="/matching" className="flex items-center justify-center m-5 p-6 text-4xl">
            <button
              className="bg-gray-900 hover:text-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline italic"
              type="button"
            >
              vs Online
            </button>
          </Link>          
          <Link to="/vsCPU" className="flex items-center justify-center text-4xl">
            <button
              className="bg-gray-900 hover:text-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline italic"
              type="button"
            >
              vs CPU
            </button>
          </Link>
          </div>
  </div>
</div>
  )
}

export default Home