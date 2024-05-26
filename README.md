# Heads Up!
### Texas Hold'em 1vs1 online match app.<br>

サーバー代がかかるため現在は公開していません、

**[App configuration]**<br>
server: flask flask-socketio<br>
client: react io-client<br>
database:sqlite<br>

I am using websockets for real time communication.<br>
I am using tailwind as CSS framework.

**[Server configuration]**<br>
webserver: nginx<br>
↓<br>
port 443 ssl: npm server<br>
port 8081 ssl: uwsgi(gevent)  <-> port 5001:flask<br> 

I'm running this app on a t2.micro on EC2.<br>
It supports SSL using Let's Encrypt.
<br>

![screen_image](https://github.com/hayabusa1228/HeadsUp/assets/93904888/4ac71f86-34fd-42b1-9f11-8c4fcf03da55)

