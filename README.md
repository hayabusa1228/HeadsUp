# Heads Up!
### テキサスホールデムの1vs1のオンライン対戦アプリです。<br>

_[アプリの構成]_<br>
server: flask flask-socketio<br>
client: react io-client<br>
database:sqlite<br>

リアルタイム通信のために、websocketを用いています。<br>
CSSフレームワークはtailwindを使用しています。

_[サーバーの構成]_<br>
webserver: nginx<br>
↓<br>
port 443 ssl: npm server<br>
port 8081 ssl: uwsgi(gevent)  <-> port 5001:flask<br> 

EC2のt2.micro上でアプリを実行しています。<br>
Let’s Encryptを用いてssl対応しています。<br>