git config --global user.name "bresu" /"login"

git add *

git commit -m "ich bin sick" /macht nachricht zum commit

git push -u origin master /lädt das ding hoch

git remote update /geht auf repo

git status -uno /schaut was neu is

git pull /falls was neu is, lädt er runter

nohup node server.js > /dev/null 2>&1 &
tmux a
node server.js
strg b + d
[detached]

at ClientRequest.<anonymous> (/var/www/virtual/zebo/pausebot.com/server.js:31:13)
   at Object.onceWrapper (events.js:428:26)
   at ClientRequest.emit (events.js:321:20)
   at HTTPParser.parserOnIncomingClient [as onIncoming] (_http_client.js:610:27)
   at HTTPParser.parserOnHeadersComplete (_http_common.js:116:17) {
 status: 1,
 signal: null,
 output: [
   null,
   <Buffer >,
   <Buffer 74 69 6b 74 6f 6b 2d 73 63 72 61 70 65 72 20 76 69 64 65 6f 20 5b 69 64 5d 0a 0a 44 6f 77 6e 6c 6f 61 64 20 73 69 6e 67 6c 65 20 76 69 64 65 6f 20 77 ... 1845 more bytes>
 ],
 pid: 14953,
 stdout: <Buffer >,
 stderr: <Buffer 74 69 6b 74 6f 6b 2d 73 63 72 61 70 65 72 20 76 69 64 65 6f 20 5b 69 64 5d 0a 0a 44 6f 77 6e 6c 6f 61 64 20 73 69 6e 67 6c 65 20 76 69 64 65 6f 20 77 ... 1845 more bytes>
}
[zebo@tuttle pausebot.com]$
[0] <e:/var/www/virtual/zebo/pausebot.com* "tuttle.uberspace.de" 00:59 21-Apr-20
                                           
                                           
# Server neustarten
ssh zebo@tuttle.uberspace.de

tmux a

cd /var/www/virtual/zebo/pausebot.com

forever stop server.js

forever start server.js

strg+b, d

# Server starten
ssh zebo@tuttle.uberspace.de

tmux

(falls ein grüner Balken unten ist, dann bist du in tmux drinnen)

cd /var/www/virtual/zebo/pausebot.com

forever start server.js

strg+b, d
