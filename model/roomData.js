'use strict'

function Room(obj) {

	var o = new Object();
	
	o.id = obj.id ? String(obj.id) : '0'
	o.userList = obj.userList ? obj.userList : []
	o.name = obj.name ? String(obj.name) : ''
	return o;
}


module.exports = Room