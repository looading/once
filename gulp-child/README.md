# run a node app & close it
just for fun!

## Guide
```bash
var gulpChild = require('gulp-child'),
	gulp = require('gulp')
gulp.task('createChild', function(){
	gulpChild.init({
		bin : 'node',
		main : ['app.js'],
		stdout : function(data){
			console.log('stdout : ' + data + '\n')
		},
		stderr : function(data){
			console.log('stderr : ' + data + '\n')
		},
		closeCb : function(code){
			console.log('exit code : ' + code + '\n')
		}
	})	
})

gulp.task('killChild', function() {
	gulpChild.close()
})

```

## [Function] gulpChild.init(obj)  创建一个node进程
```bash
var obj = {
	bin 	: string,
	main 	: Array,
	stdout 	: callback,
	stderr 	: callback,
	closeCb : callback
}
```
## [Function] gulpChild.close()  关闭子进程
## [Function] gulpChild.restrt(callback) 重启子进程