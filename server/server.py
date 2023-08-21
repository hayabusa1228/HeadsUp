from flask import Flask
from game_engine import Game_Engine
from flask_socketio import SocketIO, emit,join_room,close_room

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app, cors_allowed_origins='*')
game_engine = Game_Engine()

waiting_users = []
rooms = []

# ユーザーが新しく接続すると実行
#matching処理
@socketio.on('connect')
def connect():
   print("connect!")

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
         #emit("close_room",to=rooms[i][0],broadcast=True)
         close_room(rooms[i].table_id)
         del rooms[i]
         print("close room")

@socketio.on('join_room')
def join(user_data):
    global waiting_users,rooms
    table_id = len(rooms)
    join_room(table_id)
    if waiting_users != []:
       state = game_engine.get_cards_and_result()
       state.table_id = table_id
       state.player1.name = waiting_users[0]
       state.player2.name = user_data
       rooms.append(state)
       waiting_users = []
       emit('match',{"table_id": table_id},to=table_id,broadcast=True)
    else:
       waiting_users.append(user_data)
    print("rooms",rooms)
    print("waiting_users",waiting_users)

@socketio.on('preflop')
def preflop(data):
   for room in rooms:
      if room.table_id == data["table_id"]: 
         if room.player1.name == data["user_name"]:
            emit('preflop',{"preflop": [card.to_list for card in room.player1.cards]},to=data["table_id"])
         if room.player2.name == data["user_name"]:
            emit('preflop',{"preflop": [card.to_list for card in room.player2.cards]},to=data["table_id"])
         return 0
      
@socketio.on('flop')
def flop(data):
   for room in rooms:
      if room.table_id == data["table_id"]: 
         emit('flop',{"flop": [card.to_list for card in room.common_cards][0:3]},to=data["table_id"],broadcast=True)
         return 0
      
@socketio.on('turn')
def turn(data):
   for room in rooms:
      if room.table_id == data["table_id"]: 
         emit('turn',{"turn": [card.to_list for card in room.common_cards][3]},to=data["table_id"],broadcast=True)
         return 0
      
@socketio.on('river')
def river(data):
   for room in rooms:
      if room.table_id == data["table_id"]: 
         emit('river',{"river": [card.to_list for card in room.common_cards][4]},to=data["table_id"],broadcast=True)
         return 0

   




if __name__ == "__main__":
#   app.run(host="127.0.0.0.1",debug=True,port=5000)
 socketio.run(app,host='0.0.0.0',port=5000,debug=True)
