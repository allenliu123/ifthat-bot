## ifthat-bot

Telegram 真是开发者的乐土，加密传输，永久免费，丰富的 Api，以及最重要且强大的bot生态等等，太多的优点，说不过来。  
考虑到 https://file.ifthat.com 在手机上不方便上传文件，刚好看了一些 telegram bot 的[文档](https://core.telegram.org/bots/api)，就打算用它来做个 bot，使用原始的 api 有点麻烦，所以使用一下大佬的轮子[node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)。  
在 botfather 上创建了一个bot, [@ifthat_bot](https://t.me/ifthat_bot)，打算实现以下功能  
- [x] 上传不同类型的文件
- [x] 上传文本
- [x] 显示文本

## 上传文件
只需要发送你的文件到@ifthat_bot，就可以保存到 https://file.ifthat.com ，目前可发送文件类型为，图片，文件，音频，视频
![image](https://static.ifthat.com/public/data/27c454e24ccc535a-image.png)
![image]（https://static.ifthat.com/public/data/ac019a4132e771ff-image.png

## 上传文本
发送文字，就可以保存，可到 https://file.ifthat.com 查看
![image](https://static.ifthat.com/public/data/646d55190f118d99-image.png)
![image](https://static.ifthat.com/public/data/fcb0d749feb57447-image.png)

## 显示文本
/show 指令可以显示文本
![image](https://static.ifthat.com/public/data/05c5a2848945f11a-image.png)