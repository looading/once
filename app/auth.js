'use strict'

function authority(data) {

	var permission = data.once.toString().match(/once/g);
	return permission;
}



module.exports = authority
