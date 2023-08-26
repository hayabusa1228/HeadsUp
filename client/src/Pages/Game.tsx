import React, { useEffect, useState } from 'react'
import { io }  from 'socket.io-client';
import Cookies from 'js-cookie';
import Header from '../Components/Header.tsx';
import Result from './Result.tsx';

const Game: React.FC = () => {
  const socket = io("ws://127.0.0.1:5000",{
    withCredentials: true
  }
  )
  let game_end = false
  const table_id = Cookies.get("table_id")

  const user_name = Cookies.get("user_name")
  const opponent_name = Cookies.get("op_name")
  
  const [game_end_page_show,set_game_end_page_show] = useState(false)

  const [my_money,set_my_money] = useState(1000)
  const [op_money,set_op_money] = useState(1000)
  const [pod, set_pod] = useState(0)
  const [my_bet, set_my_bet] = useState(1)
  const [op_bet, set_op_bet] = useState(0)


  const [my_pos, set_my_pos] = useState("SB")
  const [op_pos, set_op_pos] = useState("BB")
  const [sb_bet, set_sb_bet] = useState(10)
  const [bb_bet, set_bb_bet] = useState(20)

  const [hand_num,set_hand_num] = useState(10)
  const [my_turn, set_my_turn] = useState(false)
  const [op_action, set_op_action] = useState("")

  const [check, set_check] = useState(false)
  const [my_role, set_my_role] = useState("")
  const [op_role, set_op_role] = useState("")
  const [my_result, set_my_result] = useState("win")
  const [show_result, set_show_result] = useState(false)
  const [timer,set_timer] = useState(-1)
  const count_time = () => set_timer(prev => prev-1)
  const timer_start = () => {
    set_timer(prev => 20)
  }
  const initial_cards =  ["tramp_back.png","tramp_back.png","green_back.png","green_back.png","green_back.png","green_back.png","green_back.png","tramp_back.png","tramp_back.png"]
  const [imgs, set_img] = useState<any>(initial_cards)
  window.onbeforeunload = () => {
    if(!game_end){
      socket.emit('my_disconnect', user_name);
    }
    socket.emit("break_room",table_id)
    socket.disconnect()
  }
  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
  useEffect(() => {
    if(timer === 0){
      socket.emit("fold",table_id,user_name)
    }
  },[timer])
  useEffect(() => {
    if(Cookies.get("winner") !== "None"){
      window.location.href = "/home"
    }
    setInterval(count_time,1000)
    socket.emit("preflop",table_id,user_name)
    socket.on("preflop_get",(data:any) => {
          // 所持金がBB以下なら負け
          let m_money = 0
          let o_money = 0
          if(user_name === data["action_player"]){
            m_money = data["my_money"] + data["sb_bet"]
            o_money =  data["op_money"] + data["bb_bet"]
          }else{
            m_money = data["my_money"] + data["bb_bet"]
            o_money =  data["op_money"] + data["sb_bet"]
          }
          if(m_money < data["bb_bet"] || o_money < data["bb_bet"]){
            game_end = true
            console.log("game end!!!!!")
            if(data["my_money"] > data["op_money"]){
                Cookies.set("winner",String(user_name))
            }else if(data["my_money"] < data["op_money"]){
              Cookies.set("winner",String(opponent_name))
              }
            set_game_end_page_show(prev => true)
          }
          console.log("get_preflop")
          set_my_pos(prev => data["my_pos"])
          set_op_pos(prev => data["op_pos"])
          set_my_money(prev => data["my_money"])
          set_op_money(prev => data["op_money"])
          set_pod(prev => data["pod"])
          set_sb_bet(prev => data["sb_bet"])
          set_bb_bet(prev => data["bb_bet"])
          set_img(prev => initial_cards)
          if(user_name===data["action_player"]){
            timer_start()
            set_my_turn(prev => true)
            set_check(prev => false)
            set_op_bet(prev => sb_bet)
          }
          set_img((prevState) =>
          prevState.map((img,index) => (index === 0 ?  data["card1_suit"] + "/" + data["card1_num"] + ".png" : img))
          );
          set_img((prevState) =>
          prevState.map((img,index) => (index === 1 ?  data["card2_suit"] + "/" + data["card2_num"] + ".png" : img))
          );
    })
    socket.on("update",async function(data:any){
      if(user_name !== data["prev_action_player"]){
        console.log("op_action",data["op_action"])
        set_op_action(prev => data["op_action"])
        await sleep(2000)
        set_op_action(prev => "")
      }
      if(user_name === data["action_player"]){
        timer_start()
        set_my_turn(prev => true)
      }else{
        set_my_turn(prev => false)
      }
      if(data["action"] === "flop"){
        data["flop"].forEach((card, i) => {
          console.log(card)
          set_img((prev) => 
          prev.map((img,j) => (j === i+2 ? card[0] + "/" + card[1] + ".png": img))
          )
        });
      }else if(data["action"] === "turn"){
        set_img((prev) => 
        prev.map((img,index) => (index === 5 ? data["turn"][0] + "/" + data["turn"][1] + ".png": img))
        )
      }else if(data["action"] === "river"){
        set_img((prev) => 
        prev.map((img,index) => (index === 6 ? data["river"][0] + "/" + data["river"][1] + ".png": img))
        )
      }
      console.log("my_betを0にする")
      set_my_bet(prev => 1)
      set_op_bet(prev => 0)
      set_check(prev => true)
      set_my_money(prev => data[user_name+"_money"])
      set_op_money(prev => data[opponent_name+"_money"])
      set_pod(prev => data["pod"])

    })

    socket.on("result",async function (data:any){
      set_my_turn(prev => false)
      if(user_name !== data["prev_action_player"]){
        if(Number(data[opponent_name+"_money"]) === 0){
          console.log("All in")
          set_op_action(prev => "All in")
        }else{
          set_op_action(prev => data["op_action"])
        }
        await sleep(2000)
        set_op_action(prev => "")
      }
      console.log("fight!!!")
      if(data["action"] === "fight"){
        set_my_money(prev => data[user_name+"_pre_money"])
        set_op_money(prev => data[opponent_name+"_pre_money"])
        data[opponent_name+"_cards"].forEach((card, i) => {
          set_img((prev) => 
          prev.map((img,j) => (j === i+7 ? card[0] + "/" + card[1] + ".png": img))
          )
          set_my_role(prev => data[user_name+"_role"])
          set_op_role(prev => data[opponent_name+"_role"])
        });
      }else{
        set_my_role(prev => "")
        set_op_role(prev => "")
        if(data["result"] === user_name){
          set_op_action(prev => "fold")
          await sleep(1000)
          set_op_action(prev => "")
        }
      }
      console.log("my_money",data[user_name + "_money"])
      console.log("op_money",data[opponent_name + "_money"])
      if(Number(data[user_name + "_pre_money"]) === 0 || Number(data[opponent_name + "_pre_money"]) === 0){
        console.log("waiting all in")
        await sleep(7000)
      }
      if(data["result"] === user_name){
        set_my_result(prev => "You Win")
        set_my_money(prev => data[user_name + "_money"])
      }else if(data["result"] === opponent_name){
        set_my_result(prev => "You Lose")
        set_op_money(prev => data[opponent_name + "_money"])
      }else{
        set_my_result(prev => "Draw")
        set_my_money(prev => data[user_name+"_money"])
        set_op_money(prev => data[opponent_name+"_money"])
      }
      set_show_result(prev => true)
      await sleep(3500);
      set_show_result(prev => false)
      console.log("check game end!!")
      set_hand_num(prev => prev-1)
      console.log("my_money",data[user_name + "_money"]!)
      console.log("op_money",data[opponent_name + "_money"]!)
      console.log("hand_num",data["hand_num"])
      if(data["hand_num"] !== 1 && data[user_name + "_money"]!== 0 && data[opponent_name + "_money"] !== 0){
        socket.emit("preflop",table_id,user_name)
      }else{
        // ゲーム終了
        game_end = true
        console.log("game end!!!!!")
        if(data[user_name + "_money"] > data[opponent_name + "_money"]){
          Cookies.set("winner",String(user_name))
        }else if(data[user_name + "_money"] < data[opponent_name + "_money"]){
          Cookies.set("winner",String(opponent_name))
        }else{
          Cookies.set("winner","Draw")
        }
        set_game_end_page_show(prev => true)
      }
    })
    socket.on("check_action",async function(data:any){
      console.log(data[opponent_name+"_money"])
      if(user_name === data["action_player"]){
        console.log("op_action",data["op_action"])
        set_op_action(prev => data["op_action"])
        await sleep(2000)
        set_op_action(prev => "")
        timer_start()
      }
      set_my_money(prev => data[user_name+"_money"])
      set_op_money(prev => data[opponent_name+"_money"])
      set_pod(prev => data["pod"])
      set_my_turn(prev => !prev)
      set_op_bet(prev => 0)
      set_check(prev => true)
    })
    socket.on("call_action",async function(data:any){
      if(user_name === data["action_player"]){
        console.log("op_action",data["op_action"])
        if(Number(data[opponent_name + "_money"]) === 0){
          console.log("All in")
          set_op_action(prev => "All in")
        }else{
          set_op_action(prev => data["op_action"] + "\n $" + String(Number(data["bet"])-Number(data["my_bet"])))
        }
        await sleep(2000)
        set_op_action(prev => "")
        timer_start()
      }else{
        set_my_bet(prev => 1)
      }
      set_op_bet(prev => Number(data["bet"])-Number(data["my_bet"]))
      set_my_money(prev => data[user_name+"_money"])
      set_op_money(prev => data[opponent_name+"_money"])
      set_pod(prev => data["pod"])
      set_my_turn(prev => !prev)
      set_check(prev => false)
    })
    socket.on("all_in",async function(data:any){
      //community cards すべて配る
        if(Number(data["game_progress"]) === 0){
          data["flop"].forEach((card, i) => {
            console.log(card)
            set_img((prev) => 
            prev.map((img,j) => (j === i+2 ? card[0] + "/" + card[1] + ".png": img))
          )
        })
        }
        await sleep(2000)
        if(Number(data["game_progress"]) <= 1){
          set_img((prev) => 
          prev.map((img,index) => (index === 5 ? data["turn"][0] + "/" + data["turn"][1] + ".png": img))
          )
        }
        await sleep(2000)
        if(Number(data["game_progress"]) <= 2){
          set_img((prev) => 
          prev.map((img,index) => (index === 6 ? data["river"][0] + "/" + data["river"][1] + ".png": img))
          )
        }
        await sleep(2000)
      });
    socket.on("close_room",() => {
      if(!game_end){
        game_end = true
        Cookies.set("winner","opponent exit")
        set_game_end_page_show(prev => true)
      }
    })
  },[])
  return (
    <>
    { !game_end_page_show ? 
    <div className='bg-poker-table-bg-img h-screen bg-cover'>
      <Header/>
      <div className='relative top-0 left-0 text-white text-md  md:text-lg mx-4'>残り{hand_num}ハンド （SB-BB:{sb_bet}-{bb_bet}）
      {
        timer >= 0 ?
        <>
         　timer:{timer}
        </>:<></>
      }
      <br></br>
      { show_result ?
         <>
          {my_result}
         </>:<></>
      }</div>
      <div className='flex text-center justify-center h-1/5 my-5'>
      <div className='inline-grid grid-cols-4 gap-1'>
      <div className='text-white text-xl lg:text-4xl lg:mx-4'><div className='invisible'>{user_name}</div><br></br>{show_result ? <>{op_role}</>: <>{op_action}</>}</div>
      <img src={`${process.env.PUBLIC_URL}/cards/` + imgs[7]} className='bg-cover mx-1' alt="card"></img>
      <img src={`${process.env.PUBLIC_URL}/cards/` + imgs[8]} className='bg-cover mx-1' alt="card"></img>
      <div className=' text-white text-xl lg:text-4xl lg:mx-4'>{(hand_num%2===0)? <>{op_pos}</>:<>{my_pos}</>}<br></br>{opponent_name}<br></br>${op_money}</div>
      </div>
      </div>
      <div className='flex flex-row text-center justify-center  my-2 text-white text-md'>Pod<br></br>${pod}</div>
      <div className='flex flex-row text-center justify-center  my-2 h-1/6 '>
      <div className='inline-grid grid-cols-5 mx-3'>
      <img src={`${process.env.PUBLIC_URL}/cards/` + imgs[2]} className='bg-cover mx-1' alt="card"></img>
      <img src={`${process.env.PUBLIC_URL}/cards/` + imgs[3]} className='bg-cover mx-1' alt="card"></img>
      <img src={`${process.env.PUBLIC_URL}/cards/` + imgs[4]} className='bg-cover mx-1' alt="card"></img>
      <img src={`${process.env.PUBLIC_URL}/cards/` + imgs[5]} className='bg-cover mx-1' alt="card"></img>
      <img src={`${process.env.PUBLIC_URL}/cards/` + imgs[6]} className='bg-cover mx-1' alt="card"></img>
      </div>
      </div>
      <br></br>
      <div className='flex text-center justify-center h-1/5 my-5'>
      <div className='inline-grid grid-cols-4 gap-1'>
      <div className='text-white text-xl lg:text-4xl lg:mx-4'>{(hand_num%2===0)?  <>{my_pos}</>:<>{op_pos}</>}<br></br>{user_name}<br></br>${my_money}</div>
      <img src={`${process.env.PUBLIC_URL}/cards/` + imgs[0]} className='bg-cover mx-1' alt="card"></img>
      <img src={`${process.env.PUBLIC_URL}/cards/` + imgs[1]} className='bg-cover mx-1' alt="card"></img>
      <div className=' text-white text-xl lg:text-4xl lg:mx-4'>
      { my_turn ?
      <div className='flex flex-col mx-4'>
        <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold  my-1 py-1 md:py-2 md:px-4 rounded-l text-xs"
        onClick={() => {
          socket.emit("raise",table_id,user_name,my_bet+op_bet,op_bet)
          set_timer(prev => -1)
          }}>
           raise
        </button>
        {check ?
        <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold  my-1 py-1 md:py-2 md:px-4  rounded-l text-xs"
        onClick={() => {
          socket.emit("check",table_id,user_name)
          set_timer(prev => -1)
          }}>
           check
        </button>:
        <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold  my-1 py-1 md:py-2 md:px-4  rounded-l text-xs"
        onClick={() => {
          socket.emit("call",table_id,user_name,opponent_name,op_bet)
          set_timer(prev => -1)
          }}>
           call 
        </button>
        }
        <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold  my-1 py-1 md:py-2 md:px-4  rounded-l text-xs"
         onClick={() => {
          socket.emit("fold",table_id,user_name)
          set_timer(prev => -1)
          }}>
           fold
        </button>    
      <label htmlFor="minmax-range" className="block mb-2 text-sm font-medium text-white dark:text-white">bet: {my_bet}</label>
      <input id="minmax-range" type="range" min="1" max={(my_money-op_bet) < (op_money) ? my_money-op_bet: op_money} defaultValue="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-800 accent-gray-900" onChange={(e: React.ChangeEvent<HTMLInputElement>) => set_my_bet(prev => Number(e.target.value))}></input>

      </div>
      :<div>{show_result ? <>{my_role}</> : <div className="invisible">{opponent_name}</div>}</div>
      }
      </div>
      </div>
      </div>
    </div>
    :<><Result/></>
    }
    </>
  )
}

export default Game