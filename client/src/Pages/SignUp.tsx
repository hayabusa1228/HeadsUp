import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { io }  from 'socket.io-client';
import Header from "../Components/Header.tsx";

const SignUp: React.FC = () => {
  const socket = io("ws://127.0.0.1:5000")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  const [alert, set_alert] = useState("")
  const nameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

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
              ref={nameRef}
            ></input>
          </div>
          <div className="">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Password"
                className="shadow appearance-none border text-gray-700 rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                ref={passwordRef}
            />
            <label className="flex items-center mt-2">
            <input
                type="checkbox"
                className="mr-2 w-4 h-4"
                checked={isPasswordVisible}
                onChange={togglePasswordVisibility}
            />
            <span className="text-sm text-gray-600">Show password</span>
            </label>
          </div>
          {alert === "" ? <></> : <div className="text-red-600 m-1">{alert}</div>}
          <div className="flex items-center justify-center m-3">
            <button
              className="bg-gray-900 hover:text-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button" onClick={() => {
                console.log("name:",nameRef!.current!.value)
                console.log("password:",passwordRef!.current!.value)
                socket.emit("sign_up",nameRef!.current!.value,passwordRef!.current!.value)
                socket.on("res_sign_up",(data: any) => {
                  if(data["msg"]==="complete_sign_up"){
                    window.location.href = "/"
                  }else if(data["msg"]==="name_empty"){
                    set_alert(() => "Usernameを入力してください")
                  }else if(data["msg"]==="password_empty"){
                    set_alert(() => "Passwordを入力してください")
                  }else{
                    set_alert(() => "Usernameが既に存在しています")
                  }
                })
              }}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
