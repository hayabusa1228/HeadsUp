from flask import Flask,jsonify
from game_engine import Game_Engine
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_socketio import SocketIO, emit,join_room,close_room
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['SQLALCHEMY_DATABASE_URI']= 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO']=True
socketio = SocketIO(app, cors_allowed_origins=[['http://127.0.0.1:3000']])
db = SQLAlchemy(app)
ma = Marshmallow(app)

#テーブル定義
class User(db.Model):
  __tablename__ = 'users'

  name = db.Column(db.String(100),  primary_key=True,nullable=False)
  password= db.Column(db.String(100), nullable=False)
  rate = db.Column(db.Integer, nullable=False)
  match_num = db.Column(db.Integer, nullable=True)
  win_num = db.Column(db.Integer, nullable=True)


# with app.app_context():
#    db.create_all()
game_engine = Game_Engine()


waiting_users = []
rooms = []


@socketio.on("sign_up")
def sign_up(username,password):
   user = User(
            name=username,
            password=password,
            rate = 100,
            match_num = 0,
            win_num = 0
   )
   result = User.query.filter_by(name=username).first()
   if(result):
     print("同じ名前のuserがいます")
     emit("res_sign_up",{"msg":"exist_same_name_user"})
   elif(username == ""):
      emit("res_sign_up",{"msg":"name_empty"})
   elif(password == ""):
       emit("res_sign_up",{"msg":"password_empty"})
   else:
    db.session.add(user)
    db.session.commit()
    emit("res_sign_up",{"msg":"complete_sign_up"})

@socketio.on("sign_in")
def sign_in(username,password):
   result = User.query.filter_by(name=username).first()
   if(result):
      if result.password == password:
         print("sing in")
         emit("res_sign_in",{"msg":"complete_sign_in","name":result.name})
      else:
         print("Passwordが違います")
         emit("res_sign_in",{"msg":"wrong_password"})
   else:
      print("sign upしてください")
      emit("res_sign_in",{"msg":"user_not_exist"})


@socketio.on("get_user_data")
def data_update(username):
   result = User.query.filter_by(name=username).first()
   emit("user_data",{"rate":result.rate,"match_num":result.match_num,"win_num":result.win_num})

# ユーザーが新しく接続すると実行
#matching処理
@socketio.on('connect')
def connect():
   print("connect!")

@socketio.on("test")
def test():
   print("test")

@socketio.on('disconnect')
def disconnect():
   print("disconnect!")

@socketio.on('my_disconnect')
def my_disconnect(user_data):
   global waiting_users,rooms
   if user_data in waiting_users:
      waiting_users = []
      print("close room")
   for i in range(len(rooms)):
      if user_data in [rooms[i].player1.name,rooms[i].player2.name,]:
         if user_data == rooms[i].player1.name:
            rooms[i].game_winner = rooms[i].player2.name
         else:
            rooms[i].game_winner = rooms[i].player1.name
         emit("close_room",to=rooms[i].table_id,broadcast=True)
         close_room(rooms[i].table_id)
         print("close room")

@socketio.on("break_room")
def break_room(table_id):
   for i in range(len(rooms)):
      if str(rooms[i].table_id) == table_id:
         rooms.pop(i) 
   print("room break")
   print("rooms",rooms)


@socketio.on('join_room')
def join(user_data):
    global waiting_users,rooms
    table_id = len(rooms)
    join_room(table_id)
    print("join_room")
    if waiting_users != []:
       room_info = game_engine.get_room_info()
       room_info.table_id = table_id
       room_info.player1.name = waiting_users[0]
       room_info.player1.money = 990
       room_info.player1.bet = 0
       room_info.sb = waiting_users[0]
       room_info.player2.name = user_data
       room_info.player2.money = 980
       room_info.player2.bet = 10
       room_info.bb = user_data
       room_info.state.hand_num = 10
       room_info.state.game_progress = 0
       # rate記録
       result = User.query.filter_by(name=waiting_users[0]).first()
       room_info.player1.rate = result.rate
       result = User.query.filter_by(name=user_data).first()
       room_info.player2.rate = result.rate
       rooms.append(room_info)
       print("p1_money",room_info.player1.money)
       print("p2_money",room_info.player2.money)
       waiting_users = []
       emit('match',{"table_id": table_id,"users":[room_info.player1.name,room_info.player2.name]},to=table_id,broadcast=True)
    else:
       waiting_users.append(user_data)
    print("rooms",rooms)
    print("waiting_users",waiting_users)

@socketio.on('preflop')
def preflop(table_id,user_name):
   print("table_id:",table_id)
   print("user_name:",user_name)
   for room in rooms:
      if str(room.table_id) == table_id: 
         # sb bbの回収
         if room.player1.name == user_name:
            print("p1_get")
            cards = [card.to_list() for card in room.player1.cards]
            emit('preflop_get',{"card1_suit": cards[0][0], "card1_num": cards[0][1], "card2_suit": cards[1][0], "card2_num": cards[1][1],"action_player":room.sb,"opponent_name":room.player2.name,"my_pos":"SB","op_pos":"BB","sb_bet":room.sb_bet,"bb_bet":room.bb_bet,"my_money": room.player1.money,"op_money":room.player2.money,"pod":room.pod})
         if room.player2.name == user_name:
            cards = [card.to_list() for card in room.player2.cards]
            emit('preflop_get',{"card1_suit": cards[0][0], "card1_num": cards[0][1], "card2_suit": cards[1][0], "card2_num": cards[1][1],"action_player":room.sb,"opponent_name":room.player1.name,"my_pos":"BB","op_pos":"SB","sb_bet":room.sb_bet,"bb_bet":room.bb_bet,"my_money": room.player2.money,"op_money":room.player1.money,"pod":room.pod})
         return 0
   return 0

def initialize_game(room):
      # roomの情報初期化
      if(room.state.hand_num == 1):
         if(room.player1.money > room.player2.money):
            room.game_winner = room.player1.name
         elif(room.player1.money < room.player2.money):
            room.game_winner = room.player2.name
         else:
            room.game_winner = "draw"
         return
      room.state.game_progress = 0
      room.state.hand_num -= 1
      new_room_info = game_engine.get_room_info()
      room.player1.cards = new_room_info.player1.cards
      room.player2.cards = new_room_info.player2.cards
      room.common_cards = new_room_info.common_cards
      room.sb_bet = room.blind[(room.state.hand_num-1)//2]
      room.bb_bet = room.blind[(room.state.hand_num-1)//2]*2
      room.pod = room.sb_bet + room.bb_bet
      room.sb_first_action = True
      room.sb, room.bb = room.bb, room.sb
      if room.state.hand_num%2 == 0:
         room.player1.money -= room.sb_bet
         room.player1.bet = 0
         room.player2.money -= room.bb_bet
         room.player2.bet = room.sb_bet
      else:
         room.player1.money -= room.bb_bet
         room.player1.bet = room.sb_bet
         room.player2.money -= room.sb_bet
         room.player2.bet = 0
      room.winner = new_room_info.winner


      
def update(table_id,room,op_action,user_name):
   room.player1.bet = 0
   room.player2.bet = 0
   if room.state.game_progress == 1:
      # flopを配る sbにactionを要求
      print("flop!!")
      emit('update',{"action":"flop","flop": [card.to_list() for card in room.common_cards][0:3],room.player1.name+"_money":room.player1.money,room.player2.name+"_money":room.player2.money,"pod":room.pod,"op_action":op_action,"action_player":room.sb,"prev_action_player":user_name},to=int(table_id),broadcast=True)
   if room.state.game_progress == 2:
      print("turn!!")
      emit('update',{"action":"turn","turn": [card.to_list() for card in room.common_cards][3],room.player1.name+"_money":room.player1.money,room.player2.name+"_money":room.player2.money,"pod":room.pod,"op_action":op_action,"action_player":room.sb,"prev_action_player":user_name},to=int(table_id),broadcast=True)
   if room.state.game_progress == 3:
      print("river!!")
      emit('update',{"action":"river","river": [card.to_list() for card in room.common_cards][4],room.player1.name+"_money":room.player1.money,room.player2.name+"_money":room.player2.money,"pod":room.pod,"op_action":op_action,"action_player":room.sb,"prev_action_player":user_name},to=int(table_id),broadcast=True)
   if room.state.game_progress == 4:
      print("fight!!!!!")
      if room.winner == 1:
         print("winner1")
         room.player1.money += room.pod
         emit("result",{"result": room.player1.name,room.player1.name + "_money": room.player1.money,room.player2.name + "_money": room.player2.money,room.player1.name + "_pre_money": room.player1.money-room.pod,room.player2.name + "_pre_money": room.player2.money,room.player1.name + "_cards":[card.to_list() for card in room.player1.cards],room.player2.name + "_cards":[card.to_list() for card in room.player2.cards],room.player1.name + "_role":room.player1.role,room.player2.name + "_role":room.player2.role,"action":"fight","op_action":op_action,"prev_action_player":user_name,"hand_num":room.state.hand_num-1},to=int(table_id),broadcast=True)
      if room.winner == 2:
         print("winner2")
         room.player2.money += room.pod
         emit("result",{"result": room.player2.name,room.player1.name + "_money": room.player1.money,room.player2.name + "_money": room.player2.money,room.player1.name + "_pre_money": room.player1.money,room.player2.name + "_pre_money": room.player2.money-room.pod,room.player1.name + "_cards":[card.to_list() for card in room.player1.cards],room.player2.name + "_cards":[card.to_list() for card in room.player2.cards],room.player1.name + "_role":room.player1.role,room.player2.name + "_role":room.player2.role,"action":"fight","op_action":op_action,"prev_action_player":user_name,"hand_num":room.state.hand_num-1},to=int(table_id),broadcast=True)
      if room.winner == 0:
         print("draw")
         room.player1.money += room.pod/2
         room.player2.money += room.pod/2
         emit("result",{"result": "draw",room.player1.name+"_money":room.player1.money,room.player2.name+"_money":room.player2.money,room.player1.name + "_pre_money": room.player1.money-room.pod/2,room.player2.name + "_pre_money": room.player2.money-room.pod/2,room.player1.name + "_cards":[card.to_list() for card in room.player1.cards],room.player2.name + "_cards":[card.to_list() for card in room.player2.cards],room.player1.name + "_role":room.player1.role,room.player2.name + "_role":room.player2.role,"action":"fight","op_action":op_action,"prev_action_player":user_name,"hand_num":room.state.hand_num-1},to=int(table_id),broadcast=True)
      initialize_game(room)


@socketio.on('call')
def call_action(table_id,user_name,op_name,bet):
   for room in rooms:
      if str(room.table_id) == table_id:
         room.pod += bet
         if room.player1.name == user_name:
            room.player1.money -= bet
            room.player1.bet = 0
         if room.player2.name == user_name:
            room.player2.money -= bet
            room.player2.bet = 0
         print("call action!",room.sb)
         if user_name == room.sb and room.sb_first_action:
            room.sb_first_action = False
            room.pod += room.sb_bet - bet
            if room.player1.name == user_name:
               room.player1.money += bet-room.sb_bet
            if room.player2.name == user_name:
               room.player2.money += bet - room.sb_bet
            emit("check_action",{"action_player": room.bb,room.player1.name+"_money":room.player1.money,room.player2.name+"_money":room.player2.money,"pod":room.pod,"op_action": "call"},to=int(table_id),broadcast=True)
            # print("call action!")
            return 0
         # All in か判断する
         if(room.player1.money != 0 and room.player2.money != 0):
            room.state.game_progress += 1
         else:
            # カード配布
            emit("all_in",{"flop":[card.to_list() for card in room.common_cards][0:3],"turn": [card.to_list() for card in room.common_cards][3],"river": [card.to_list() for card in room.common_cards][4],"game_progress":room.state.game_progress},to=int(table_id),broadcast=True)
            room.state.game_progress = 4
         update(table_id,room,"call",user_name) 


@socketio.on('check')
def check_action(table_id,user_name):
   print("check!")
   for room in rooms:
      if str(room.table_id) == table_id: 
         if room.sb == user_name:
            # bbにactionを求める
            emit("check_action",{"action_player": room.bb,room.player1.name+"_money":room.player1.money,room.player2.name+"_money":room.player2.money,"pod":room.pod,"op_action": "check"},to=int(table_id),broadcast=True)
         if room.bb == user_name:
             # ゲームをすすめる
             room.state.game_progress += 1
             update(table_id,room,"check",room.bb)    

@socketio.on('raise')
def raise_action(table_id,user_name,bet,op_bet):
   for room in rooms:
      if str(room.table_id) == table_id: 
         if user_name == room.sb and room.sb_first_action:
            room.sb_first_action = False
         room.pod += bet
         if room.player1.name == user_name:
            room.player1.money -= bet
            room.player1.bet = bet-room.player2.bet
            emit("call_action",{"bet": bet,"action_player": room.player2.name,room.player1.name+"_money":room.player1.money,room.player2.name+"_money":room.player2.money,"op_action":"raise","pod":room.pod,"my_bet":room.player2.bet},to=int(table_id),broadcast=True)
         if room.player2.name == user_name:
            room.player2.money -= bet
            room.player2.bet = bet-room.player1.bet
            emit("call_action",{"bet": bet,"action_player": room.player1.name,room.player1.name+"_money":room.player1.money,room.player2.name+"_money":room.player2.money,"op_action":"raise","pod":room.pod,"my_bet":room.player1.bet},to=int(table_id),broadcast=True)
         

@socketio.on('fold')
def fold_action(table_id,user_name):
   for room in rooms:
      if str(room.table_id) == table_id: 
         if room.player1.name == user_name:
            room.player2.money += room.pod
            emit("result",{"result": room.player2.name,room.player1.name+"_money":room.player1.money,room.player2.name+"_money":room.player2.money,room.player1.name + "_cards":[card.to_list() for card in room.player1.cards],room.player2.name + "_cards":[card.to_list() for card in room.player2.cards],"action":"fold","hand_num": room.state.hand_num},to=int(table_id),broadcast=True)
         if room.player2.name == user_name:
            room.player1.money += room.pod
            emit("result",{"result": room.player1.name,room.player1.name+"_money":room.player1.money,room.player2.name+"_money":room.player2.money,room.player1.name + "_cards":[card.to_list() for card in room.player1.cards],room.player2.name + "_cards":[card.to_list() for card in room.player2.cards],"action":"fold","hand_num": room.state.hand_num},to=int(table_id),broadcast=True)
         initialize_game(room)

@socketio.on("get_game_winner")
def get_game_winner(table_id):
   print("get game winner!!!")
   for room in rooms:
      if str(room.table_id) == table_id:
         emit("game_winner",{"game_winner": room.game_winner},to=int(table_id),broadcast=True)

@socketio.on("update_rate")
def update_rate(table_id,winner):
   rate_change = 0
   for room in rooms:
      if str(room.table_id) == table_id:
         p1_data = User.query.filter_by(name=room.player1.name).first()
         p2_data = User.query.filter_by(name=room.player2.name).first()
         p1_data.match_num += 1 
         p2_data.match_num += 1 
         if winner == room.player1.name:
             rate_change = room.player2.rate/10
             room.player1.rate += room.player2.rate/10
             room.player2.rate -= room.player2.rate/10
             p1_data.win_num += 1 
         else:
             rate_change = room.player1.rate/10
             room.player2.rate += room.player1.rate/10
             room.player1.rate -= room.player1.rate/10
             p2_data.win_num += 1 
         p1_data.rate = room.player1.rate
         p2_data.rate = room.player2.rate
         db.session.commit()
         emit("rate_change",{"rate_change": rate_change},to=int(table_id),broadcast=True)

if __name__ == "__main__":
 with app.app_context():
    db.create_all()
#   app.run(host="127.0.0.0.1",debug=True,port=5000)
 socketio.run(app,host='0.0.0.0',port=5000,debug=True)
