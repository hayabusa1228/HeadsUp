import React, { useEffect, useState } from 'react'
import { io }  from 'socket.io-client';
import Cookies from 'js-cookie';
import Header from '../Components/Header.tsx';
import url from "./Config.tsx"

const Matching: React.FC = () => {
  const socket = io(url,{
    withCredentials: true
  })
  const user_name = Cookies.get("user_name")
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
          console.log(msg)
          match = true
          Cookies.set("user_name",String(user_name))
          Cookies.set("table_id",msg["table_id"])
          Cookies.set("winner","None")
          msg["users"].forEach(user => {
            if(user !== user_name){
              Cookies.set("op_name",user)
            }
          });
          socket.disconnect()
          window.location.href = "/game" 
    })
  },[])

  return (
<div className='bg-home-bg-img h-screen bg-cover bg-opacity-10'>
<Header/>
<div className="absolute flex-col lg:flex-row inset-0 flex items-center justify-center text-white w-full">
<div className='bg-gray-900 p-10 text-xl rounded-xl border-double border-4 border-white'>
matching...</div>
</div>
</div>
  )
}

export default Matching