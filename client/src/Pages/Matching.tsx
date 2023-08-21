import React, { useEffect, useState } from 'react'
import { io }  from 'socket.io-client';
import Cookies from 'js-cookie';
import Header from '../Components/Header.tsx';


const Matching: React.FC = () => {
  const socket = io("ws://127.0.0.1:5000")
  const user_name = Math.random().toString(32).substring(2) 
  let match = false
  window.onbeforeunload = () => {
    if(!match){
      socket.emit('my_disconnect', user_name);
    }
    socket.disconnect()
}

  useEffect(() => {
    socket.emit("join_room",user_name)
    socket.on("match",(msg:any) => {
          match = true
          Cookies.set("user_name",user_name)
          Cookies.set("table_id",msg["table_id"])
          window.location.href = "/game" 
    })
  },[])

  return (
<div className='bg-home-bg-img h-screen bg-cover bg-opacity-10'>
<Header/>
<div className='flex items-center justify-center text-4xl bg-gray-900 text-white border-4 border-white border-double p-3'>対戦相手を探しています</div>
</div>
  )
}

export default Matching