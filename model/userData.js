'use strict'

function User(obj) {
	var o = new Object()

	o.id = obj.id ? String(obj.id) : '0'
	o.X = obj.X ? String(obj.X) : '0'
	o.Y = obj.Y ? String(obj.Y) : '0'


	return o;
}


module.exports = User