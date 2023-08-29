import React, { useEffect, useState } from 'react'
import { io }  from 'socket.io-client';
import Cookies from 'js-cookie';
import Header from '../Components/Header.tsx';
import url from "./Config.tsx"

const Result: React.FC = () => {
  const socket = io(url,{
    withCredentials: true
  })
  const winner  = Cookies.get("winner")
  const user_name = Cookies.get("user_name")
  const opponent_name = Cookies.get("op_name")
  const table_id = Cookies.get("table_id")
  const [result,set_result] = useState("")
  const [plus_minus, set_plus_minus] = useState("")
  const [rate_change, set_rate_change] = useState(-1)
  
  useEffect(() => {
    if(winner === user_name){
      set_result(prev => "YOU WIN")
      set_plus_minus(() => "+")
      // rateのupdateを送信する
      socket.emit("update_rate",table_id,user_name)
    }else if(winner === opponent_name){
      set_result(prev => "YOU LOSE")
      set_plus_minus(() => "-")
    }else if(winner === "opponent exit"){
      set_result(prev => "The connection with the opponent has been lost.")
      set_plus_minus(() => "+")
      socket.emit("update_rate",table_id,user_name)
    }else{
      set_result(prev => "DRAW")
    }
    socket.on("rate_change",(data: any) => {
      set_rate_change(() => data["rate_change"])
      Cookies.set("winner","Done")
    })
  },[])
  return (
   <div className="h-screen bg-home-bg-img  bg-cover">
    <Header/>
    <div className="absolute flex-col lg:flex-row inset-0 flex items-center justify-center text-white w-full">
      <div className="bg-gray-900  bg-cover p-6 lg:p-8 rounded-xl italic text-white border-4 border-white border-double px-20 lg:px-24">
        <div className='text-2xl text-center underline'>Result</div><br></br>
        <div className='text-4xl text-center'>
        {result}
        </div><br></br>
        <div className='text-xl text-center'>
        {Number(rate_change) !== -1 ? 
        <>
        rate（{plus_minus}{rate_change.toFixed(0)}）
        </>:<></>}
        </div>
     </div>
      <div className='flex flex-col lg:flex-row'>
        <a href="/home" className="flex items-center justify-center m-5 p-6 text-2xl">
          <button
              className="bg-gray-900 hover:text-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline italic"
              type="button">
              Home
            </button>
        </a>          
      </div>
  </div>
</div>

  )
}



export default Result