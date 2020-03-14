process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const fs = require('fs');
var rp = require('request-promise');

const token = require('./config').token;

const bot = new TelegramBot(token, {polling: true});

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;


  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, 'hello, just send your file, which will upload to https://file.ifthat.com');
});

bot.on('text', (msg) => {
  const chatId = msg.chat.id;
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your text');
});

// 通过 TG 上传文件到 ifthat
bot.on('document', (msg) => {
  const chatId = msg.chat.id;
  let filename = generateUUID() + '-' + msg.document.file_name.replace(/ /g, '-');
  bot.sendMessage(chatId, `${msg.document.file_name} is uploading`);
  let file_id = msg.document.file_id;
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
})

var generateUUID = function() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 16; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	var uuid = s.join("");
	return uuid;
}