var config = {
	pricision : 0.001,
	status : {
		_404 : {
			status : 404,
			msg : "没有数据"
		},
		_200 : {
			status : 200,
			msg : "成功"
		}
	},
	event : {
		show_nearby : "SHOW_NEARBY",
		ibeacon : "IBEACON",
		position : "GET_POSITION",
		createRoom : "CHAT_USER",
		recevice : "SEND_MSG",
		send : "GET_MSG",
		leave : "RM_ROOM",
		roomList : "SHOW_ROOMS"

	},
	ibeacons : {
		origin : '',
		xlabel : '',
		ylabel : ''
	},
	editable : true
}

module.exports = config