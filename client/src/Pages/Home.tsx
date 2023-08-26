import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { io }  from 'socket.io-client';
import Header from '../Components/Header.tsx';
import url from "./Config.tsx"

const Home: React.FC = () => {
  const socket = io(url,{
    withCredentials: true
  })
  const user_name = Cookies.get("user_name")
  const [rate, set_rate] = useState(0)
  const [match_num, set_match_num] = useState(0)
  const [win_num, set_win_num] = useState(0)
  
  if(!Cookies.get("user_name")){
    window.location.href = "/"
  }
  useEffect(() => {
    socket.emit("get_user_data",user_name)
    socket.on("user_data",(data: any) => {
      set_rate(() => Number(Number(data["rate"]).toFixed(0)))
      set_match_num(() => Number(data["match_num"]))
      set_win_num(() => Number(data["win_num"]))
    })
  },[])
  return (
<div className="h-screen bg-home-bg-img  bg-cover">
  <Header/>
        <div className="absolute flex-col lg:flex-row inset-0 flex items-center justify-center text-white w-full">
          <div className="bg-gray-100  bg-cover p-6 lg:p-8 rounded-xl italic text-2xl text-gray-900 border-4 border-black border-double">
            <div className="text-4xl decoration-red-500 underline mb-4 text-center">Profile<br></br></div>
            <div className='my-2 px-5'>♠ ユーザー名: {user_name}</div>
            <div className='my-2 px-5'>♦ rate: {rate}</div>
            <div className='my-2 px-5'>♣ 試合数: {match_num}</div>
            <div className='my-2 px-5'>♥ 勝率: {match_num !== 0 ?  (win_num/match_num*100).toFixed(1): 0}%</div>
          </div>
          <div className='flex flex-col lg:flex-row'>
          <a href="/matching" className="flex items-center justify-center m-5 p-6 text-4xl">
            <button
              className="bg-gray-900 hover:text-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline italic"
              type="button"
            >
              vs Online
            </button>
          </a>          
          {/* <Link to="/vsCPU" className="flex items-center justify-center text-4xl">
            <button
              className="bg-gray-900 hover:text-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline italic"
              type="button"
            >
              vs CPU
            </button>
          </Link> */}
          </div>
  </div>
</div>
  )
}

export default Home