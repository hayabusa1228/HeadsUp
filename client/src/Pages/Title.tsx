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
            テキサスホールデムのオンライン対戦サイトです。<br></br>
            相手の所持金をBB以下にする、または10ハンドの後に所持金が多い方が勝ちです。<br></br>
            1アクションの制限時間20秒を超えると、fold扱いになります。
          </div>
        </div>
      </div>
    </div>
  );
};

export default Title;
