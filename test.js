'use strict'

var io = require('socket.io-client');

var socket = io('localhost:5555');
var room,users,rooms;
var tool = {
	socket : '',
	auth : function(){
		tool.socket.send({once:"adadaonceadasd"})
	},
	getUsers : function() {
		tool.socket.emit('SHOW_NEARBY', {
			R : 30
		}, function(res) {
			users = res;
			// console.log("附近的人" ,res);
		});
		tool.socket.on('SHOW_NEARBY', function(res) {
			users = res;
			// console.log("附近的人" ,res);
		})
	},
	getIbeacon : function() {
		tool.socket.on('IBEACON', function(res) {
			console.log('ibdeacons:', res);
		})
	},
	sendPosition : function() {
		tool.socket.emit('GET_POSITION', {
			X : Math.floor(Math.random()*40),
			Y : Math.floor(Math.random()*40)
		})
	},
	getRoomList : function() {
		tool.socket.emit('SHOW_ROOMS',{
			room:true
		})
	},
	removeChat : function() {
		console.log('leave');
		tool.socket.emit('RM_ROOM',{
			action : "RM_ROOM",
			room : room
		})
	},
	listenRemove : function() {
		tool.socket.on('RM_ROOM', function(res) {
			if(res.target_id == tool.socket.id){
				console.log('RM_ROOM',res);
				tool.socket.emit('RM_ROOM',{
					action : "RM_ROOM_TOO",
					room : room
				})
			}
		})
	},
	sendMsg : function(msg) {
		console.log('发送');
		tool.socket.emit('SEND_MSG', {
			room : room,
			msg : msg
		})
	},
	fetchMsg : function() {
		console.log('接收');
		tool.socket.on('GET_MSG', function(res) {
			console.log(res);
		})
	},
	createRoom : function(target_id, name) {
		console.log('创建');
		tool.socket.emit('CHAT_USER', {
			action : 'create',
			target_id : target_id,
			name : name
		}, function(res) {
			room = res.room
			console.log('创建聊天室',room);
		})
	},
	listenCreateRoom : function() {
		tool.socket.on('CHAT_USER', function(res) {
			console.log(res,tool.socket.id);
			console.log(res.target_id == tool.socket.id);
			if(res.target_id == ("/#" + tool.socket.id)) {
				console.log('success');
				tool.socket.emit('CHAT_USER', {
					action : 'join',
					room : res.room
				}, function(res) {
					room = res.room
				})
			}
		})
	},
	listenGetRoomList : function() {
		// setInterval(function(){
		// 	tool.socket.emit('SHOW_ROOMS')
		// }, 1000);
		tool.socket.on('SHOW_ROOMS', function(res) {
			console.log('----');
			console.log(res.roomList);
		})
	}
}
var create = document.getElementById('create')
var send = document.getElementById('send')
var leave = document.getElementById('leave')
socket.on('connect', function(){
	tool.socket = socket
	console.log(socket.id);
	// socket.send({once: "once"})
	tool.auth()
	tool.getIbeacon()
	tool.sendPosition()
	tool.getRoomList()
	tool.getUsers()
	tool.listenCreateRoom()
	tool.listenRemove()
	tool.listenGetRoomList()
	tool.fetchMsg()
	tool.getRoomList()
	setInterval(function(){
		
		tool.getUsers()
		window.mine = {
			room : room,
			user : users,
			rooms : rooms
		};
	}, 3000);
});

create.addEventListener('click', function() {
	tool.createRoom(users[0].id, 'hehhhh')
}, false);
send.addEventListener('click', function() {
	tool.sendMsg("asdasdasdasdasd")
}, false);
leave.addEventListener('click', function() {
	tool.removeChat()
}, false);



