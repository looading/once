var child = require('child_process').spawn,
	config = {
		bin 	: 'node',
		main 	: ['app.js'],
		stdout 	: function(data){console.log(`stdout: ${data}`)},
		stderr 	: function(data){console.log(`stderr: ${data}`)},
		closeCb : function(code){console.log(`child process closeed with code ${code}`)}
	}

function init(obj){
	config = {
		bin 	: obj.bin 		|| config.bin,
		main 	: obj.main 		|| config.main,
		stdout 	: obj.stdout 	|| config.stdout,
		stderr 	: obj.stderr 	|| config.stderr,
		closeCb : obj.closeCb 	|| config.closeCb
	}
	childNode = child(config.bin, config.main)
	childNode.stdout.on('data', config.stdout)
	childNode.stderr.on('data', config.stderr)
	childNode.on('close', config.closeCb)
}

function close() {
	if(childNode){
		console.log(childNode.pid)
		childNode.kill()
	}
}

function restart (cb) {
	close()
	init({})
	setTimeout(cb, 300);
}
module.exports = {
	init 		: init,
	close 		: close,
	restart 	: restart,
	childNode 	: null,
	config 		: config
}