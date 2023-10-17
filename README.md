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
