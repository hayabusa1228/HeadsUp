import React from "react";
import Header from "../Components/HomeHeader.tsx";
import Logo from "../../src/images/logo2.png";

const Title: React.FC = () => {
  //cookieでログインしてるか確認してhomeへredirect
  return (
    <div className="h-screen bg-home-bg-img  bg-cover">
      <Header />
      <div>
        <div className="flex flex-col justify-center items-center">
          <img
            className="object-cover"
            src={Logo}
            alt="logoが取得できませんでした"
          ></img>
          <div className="mt-20 text-white bg-gray-900 p-6 lg:p-8 rounded-2xl border-double border-4 border-white">
            This is a Texas Hold'em online match site.<br></br>
            The one who reduces the opponent's money to less than BB or has more money after 10 hands wins.<br></br>
            If the time limit for one action exceeds 20 seconds, it will be treated as a fold.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Title;
