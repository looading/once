'use strict';


var express = require('express');
var app = express();

var io = require('socket.io')(5555);
var clientService = require('./app/clientService');
var auth = require('./app/auth');


app.use(express.static(__dirname + '/'));
// 数据池
var database = require('./app/database');

app.get('/', function(req, res) {
	res.sendfile(__dirname+ '/index.html')
});

io.on('connection', function (socket) {
	// console.log(socket.id);
	socket.on('message', function(data){
		if(auth(data)){
			// 初始化 用户数据 并 监听 userData
			clientService.init(io, socket, function(x) {
				console.log(x);
			});
			//  获取用户列表 事件
			clientService.getUsers(io, socket,function (x)  {
				console.log(x)
			});

			// 创建、加入聊天室
			clientService.createChat(io, socket, function(x) {
				console.log(x)
			});
			// 退出应用
			clientService.exit(io, socket, function() {
				console.log(x)
			});

			// 聊天
			clientService.chat(io, socket);

			// 离开聊天室
			clientService.removeChat(io, socket);

			// 聊天室列表
			clientService.roomList(io, socket)
		}
	})

	
});


app.listen(5000,function(){
	console.log('server is running #: 5000');
});