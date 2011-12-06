/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111127
 * @description 入口server文件
 */

var deps = require('./requires.js');

deps.GlobalInit();
deps.CustomInit();

exports.run = function() {
	var host = config.list.host,
	port = config.list.port,
	server = http.createServer(handle.run);

	server.listen(port);
	console.log('server on ' + port);
}

