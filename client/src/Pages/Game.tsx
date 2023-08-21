import React, { useEffect, useState } from 'react'
import { io }  from 'socket.io-client';
import Cookies from 'js-cookie';
import Header from '../Components/Header.tsx';

const Game: React.FC = () => {
  const [hand_num,set_hand_num] = useState(10)
  const [img, set_img] = useState(["spade/1.png","spade/1.png","green_back.png","green_back.png","green_back.png","green_back.png","green_back.png","tramp_back.png","tramp_back.png"])
  const socket = io("ws://127.0.0.1:5000")
  const table_id = Cookies.get("table_id")
  const user_name = Cookies.get("user_name")
  window.onbeforeunload = () => {
    socket.emit('my_disconnect', user_name);
    socket.disconnect()
  }
  useEffect(() => {
    socket.emit("flop",{"table_id": table_id, "user_name": user_name})
    socket.on("flop",(cards:any) => {
          //動的importで手札をimport 
          const card1 = cards[0] 
          const card2 = cards[0] 

    })
  },[])
  return (
    <div className='bg-poker-table-bg-img h-screen bg-cover'>
      <Header/>
      <div className='relative top-0 left-0 text-white text-md  md:text-lg mx-4'>残り{hand_num}ハンド</div>
      <div className='flex text-center justify-center h-1/5 my-5'>
      <div className='inline-grid grid-cols-3 gap-1'>
      <div className='text-white'>[action]<br></br>call</div>
      <div className='flex flex-row'>
      <img src={`${process.env.PUBLIC_URL}/cards/` + img[7]} className='bg-cover mx-1' alt="card"></img>
      <img src={`${process.env.PUBLIC_URL}/cards/` + img[8]} className='bg-cover mx-1' alt="card"></img>
      </div>
      <div className=' text-white text-xl lg:text-4xl lg:mx-4'>Yuto<br></br>$10000</div>
      </div>
      </div>
      <div className='flex flex-row text-center justify-center  my-2 text-white text-xl'>pot<br></br>$100</div>
      <div className='flex flex-row text-center justify-center  my-2 h-1/6 '>
      <div className='inline-grid grid-cols-5 mx-3'>
      <img src={`${process.env.PUBLIC_URL}/cards/` + img[2]} className='bg-cover mx-1' alt="card"></img>
      <img src={`${process.env.PUBLIC_URL}/cards/` + img[3]} className='bg-cover mx-1' alt="card"></img>
      <img src={`${process.env.PUBLIC_URL}/cards/` + img[4]} className='bg-cover mx-1' alt="card"></img>
      <img src={`${process.env.PUBLIC_URL}/cards/` + img[5]} className='bg-cover mx-1' alt="card"></img>
      <img src={`${process.env.PUBLIC_URL}/cards/` + img[6]} className='bg-cover mx-1' alt="card"></img>
      </div>
      </div>
      <br></br>
      <div className='flex text-center justify-center h-1/5 my-5'>
      <div className='inline-grid grid-cols-3 gap-1'>
      <div className=' text-white text-xl lg:text-4xl lg:mx-4'>{user_name}<br></br>$10000</div>
      <div className='flex flex-row'>
      <img src={`${process.env.PUBLIC_URL}/cards/` + img[0]} className='bg-cover mx-1' alt="card"></img>
      <img src={`${process.env.PUBLIC_URL}/cards/` + img[1]} className='bg-cover mx-1' alt="card"></img>
      </div>
      <div className='flex flex-col mx-4'>
        <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold  my-1 py-1 md:py-2 md:px-4 rounded-l text-xs">
           raise
        </button>
        <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold  my-1 py-1 md:py-2 md:px-4  rounded-l text-xs">
           call 
        </button>
        <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold  my-1 py-1 md:py-2 md:px-4  rounded-l text-xs">
           fold
        </button>
      
      </div>
      </div>
      </div>
      <div></div>
    </div>
  )
}

export default Game