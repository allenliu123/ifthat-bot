process.env.NTBA_FIX_319 = 1;
require('dotenv').config()
var http = require('http');
const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const fs = require('fs');
var rp = require('request-promise');

http.createServer(function (req, res) {
  res.end("I am still running");
}).listen(process.env.PORT || 8083);
console.log('I am running on ' + process.env.PORT || 8083);

// keep alive
// setInterval(function() {
//   var options = {
//     uri: `https://ifthat-bot-heroku.herokuapp.com/`,
//   };
//   rp(options).then(data => {
//     console.log(data)
//   });
// }, 30 * 60 * 1000);

const token = process.env.TOKEN || require('./config').token;

const bot = new TelegramBot(token, {polling: true});

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'hello, I\'m used for file.ifthat.com \nsend your file, which will upload\necho your text, which will saved \n/show, show your text');
});

// /show
bot.onText(/\/show/, (msg) => {
  const chatId = msg.chat.id;
  rp({
    uri: 'https://file.ifthat.com/getText',
    json: true
  }).then(res => {
    bot.sendMessage(chatId, res.content);
  })
})

// 收到任何文字消息时候，给出反馈
bot.on('text', (msg) => {
  const chatId = msg.chat.id;
  // 排除 /start /show的情况
  if(msg.text === '/start' || msg.text === '/show'){ return }
  rp({
    method: 'post',
    uri: 'https://file.ifthat.com/postText',
    form: {
      textarea: msg.text
    },
    json: true
  }).then(() => {
    bot.sendMessage(chatId, 'saved your text');
  }).catch(() => {
    bot.sendMessage(chatId, 'save error');
  })
});

// 上传图片
bot.on('photo', (msg) => {
  upload(msg, 'photo');
})

// 上传文件
bot.on('document', (msg) => {
  upload(msg, 'document');
})

// 上传音频
bot.on('audio', (msg) => {
  upload(msg, 'audio');
})

// 上传视频
bot.on('video', (msg) => {
  upload(msg, 'video');
})

// // debug
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   console.log(msg);
//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message');
// });

bot.on("polling_error", (err) => console.log(err));

var generateUUID = function() {
	var s = [];
  var hexDigits = "0123456789abcdef";
  s[0] = 't';
  s[1] = 'g';
	for (var i = 2; i < 16; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	var uuid = s.join("");
	return uuid;
}

var upload = function(msg, type) {
  const chatId = msg.chat.id;
  let filename;
  let file_id;
  if(type === 'photo') {
    filename = generateUUID() + '-image.jpg';
    bot.sendMessage(chatId, `photo is uploading...`);
    file_id = msg.photo[2]? msg.photo[2].file_id: msg.photo[1]? msg.photo[1].file_id: msg.photo[0].file_id;
  } else if(type === 'document') {
    filename = generateUUID() + '-' + msg.document.file_name.replace(/ /g, '-');
    bot.sendMessage(chatId, `file is uploading...`);
    file_id = msg.document.file_id;
  } else if(type === 'audio') {
    filename = generateUUID() + '-' + msg.audio.title.replace(/ /g, '-');
    bot.sendMessage(chatId, `audio is uploading...`);
    file_id = msg.audio.file_id;
  } else if(type === 'video') {
    filename = generateUUID() + '.mp4';
    bot.sendMessage(chatId, `video is uploading...`);
    file_id = msg.video.file_id;
  } else {
    return;
  }
  var options = {
    uri: `https://api.telegram.org/bot${token}/getFile?file_id=${file_id}`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };
  rp(options)
    .then(function (repos) {
      let uri = `https://api.telegram.org/file/bot${token}/${repos.result.file_path}`;
      let stream = fs.createWriteStream('../DocumentTransmission/public/data/' + filename);
      request(uri).pipe(stream).on('close', () => {
        console.log('upload success');
        bot.sendMessage(chatId, `upload success, there is https://file.ifthat.com/public/data/${filename}`);
      });
    })
    .catch(function (err) {
      bot.sendMessage(chatId, `${filename} upload error`);
    });
}
