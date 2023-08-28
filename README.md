テキサスホールデムの1vs1のオンライン対戦アプリです。

[アプリの構成]
server: flask flask-socketio
client: react io-client
database:sqlite

リアルタイム通信のために、websocketを用いています。
CSSフレームワークはtailwindを使用しています。

[サーバーの構成]
webserver: nginx
↓
port 443 ssl: npm server
port 8081 ssl: uwsgi(gevent)  <-> port 5001:flask 

EC2のt2.micro上でアプリを実行しています。
Let’s Encryptを用いてssl対応しています。