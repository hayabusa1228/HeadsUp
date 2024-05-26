# Heads Up!
### Texas Hold'em 1vs1 online match app.<br>

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

<p>
![AE657949-0B4E-4569-9CE8-66C7147E33AF](https://github.com/hayabusa1228/HeadsUp/assets/93904888/a00e0ae8-5fd3-40a2-98a6-381a5b2231d4)
![33B1EBA3-1E74-48E8-A0F2-972D620A21E4](https://github.com/hayabusa1228/HeadsUp/assets/93904888/d8aeb7ff-0263-4898-b513-3732ef8be61d)
</p>
