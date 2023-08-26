import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Title from "./Pages/Title.tsx";
import SignIn from "./Pages/SignIn.tsx";
import SignUp from "./Pages/SignUp.tsx";
import Home from "./Pages/Home.tsx";
import Matching from "./Pages/Matching.tsx";
import Game from "./Pages/Game.tsx";
import Result from "./Pages/Result.tsx";



export const router = createBrowserRouter([
  { path: "/", element: <Title /> },
  { path: "/signin", element: <SignIn/> },
  { path: "/signup", element: <SignUp/> },
  {path: "/home", element: <Home/>},
  {path: "/matching", element: <Matching/>},
  {path: "/game", element: <Game/>},
  {path: "/result",element: <Result/>}
]);