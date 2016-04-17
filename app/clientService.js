'use strict'


// clientService


var database = require('./database')
var config  = require('./config')

var User = require('../model/userData')
var Room = require('../model/roomData')

//  指定范围内用户
var getUsers = function (io, socket) {
	console.log(`${socket.id}___++++++`);
	socket.on(config.event.show_nearby, (data, cb) =>{
		// default
		data = data.R?data : {R:30}

		let temp = getNearby(data.R, socket)

	
		// socket.emit(config.event.show_nearby, temp)
		
		cb(temp)
		
	})
}

// 初始化 该用户 服务
var init = function(io, socket, cb) {
	var user = new User({
		id : socket.id
	})
	
	database.userList[socket.id] = user;

	// 发送 3个云盒 的作用
	// origin 原点
	// xlabel x轴
	// ylabel y轴
	socket.emit(config.event.ibeacon, config.ibeacons)

	// 接收坐标值
	socket.on(config.event.position, function(res) {
		// console.log(res);
		database.userList[socket.id].X = res.X
		database.userList[socket.id].Y = res.Y
	})

	cb(`${socket.id}初始化成功`)
}

// 退出
var exit = function(io, socket) {
	socket.on('disconnect', function () {
		delete database.userList[socket.id];
		console.log(`${socket.id}退出应用`);
		console.log(database);
	})
}

// 创建聊天室
var createChat = function(io, socket, cb) {
	
	socket.on(config.event.createRoom, function(res, cb) {

		// 加入聊天室
		if(res.action == 'join'){
			socket.join(res.room.id)
			cb({room: res.room})
		} else {
			// 创建聊天室
			let target_id = res.target_id ? String(res.target_id) : '0';
			let roomId = `${socket.id}_${target_id}`
			
			let room = new Room({
				id : roomId,
				name : res.name,
				userList : [socket.id, target_id]
			})

			database.roomList[roomId] = room
			socket.join(roomId)
			io.emit(config.event.createRoom, {
				room : room,
				target_id : target_id
			})
			// console.log(`${socket.id}create`)
			cb({room: room})
		}
		
	})
}

// 聊天
var chat = function(io, socket) {
	socket.on(config.event.recevice, function(res) {
		// console.log(res);

		let room = res.room
		// console.log(room);
		socket.broadcast.to(room.id).emit(config.event.send, res)
	})
}

// 离开聊天室
var removeChat = function(io, socket) {
	socket.on(config.event.leave, function(res) {
		let room = res.room
		// console.log(res);
		if(res.action == 'RM_ROOM') {
			let arr = room.id.split('_')
			arr.splice(arr.indexOf(socket.id),1)

			socket.leave(room.id)
			delete database.roomList[room.id]
			io.emit(config.event.leave, {
				target_id : arr[0],
				room : room
			})
			// console.log(database.roomList);
		} else {
			socket.leave(room.id)
		}		
	})
}

// 获取聊天室列表
var roomList = function(io, socket) {
	
		// socket.on(config.event.roomList, function(res) {
		// 	// if(config.editable){
		// 	// 	config.editable = false
		// 	// 	calRoom(socket)
		// 	// }
			
		// })
	
		setInterval(function(){
			console.log(database.roomList);
			socket.emit(config.event.roomList, {
				roomList : database.roomList
			})
		}, 500);

	// setInterval(function(){
	// 	calRoom(socket)
	// }, 1000);
}



/* 工具 */

function getNearby (R, socket) {

	let oX = database.userList[socket.id].X
	let oY = database.userList[socket.id].Y
	let temp = new Array()

	for(let item in database.userList){
		let nX = database.userList[item].X
		let nY = database.userList[item].Y 
		let tell = Math.sqrt(Math.abs(oX-nX)*Math.abs(oX-nX) + Math.abs(oY-nY)*Math.abs(oY-nY)) - R <= config.pricision ? true : false;
		if(tell && (socket.id != item)) {
			temp.push(database.userList[item])
		}
	}

	return temp;

}

function calRoom(socket) {
	// console.log(database.roomList);
	var a = database.roomList
	socket.emit(config.event.roomList, {
		roomList : a
	})
	config.editable = true;
}



module.exports = {
	init : init,
	getUsers : getUsers,
	exit  : exit,
	createChat : createChat,
	chat : chat,
	removeChat : removeChat,
	roomList : roomList
}