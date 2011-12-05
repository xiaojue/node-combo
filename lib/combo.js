/**
 * @author fuqiang[designsor@gamil.com]
 * @version 20111129
 * @desprition 文本文件合并
 * @Todo 图片合并
 */

var deps = require('./requires.js');
deps.GlobalInit();
deps.init(['./headers.js', './config.js', './tools.js', './handle.js']);

var TYPES = headers.types;
var Combo = {
	check: function(filepath) {
        return tools.checkFilePath(filepath,"js|css");
	},
	fetch: function(files, req, rep, stats) {
		//抓所有的资源，有一个没有则返回null 返回404
		console.log(files);
		handle.noCacheCallback(stats, req, rep, function() {
			var raw = [],
			isError;
			files.forEach(function(element, index) {
				fs.stat(element, function(err, stats) {
					if (err) {
						handle.writeError(rep);
						isError = true;
					} else {
						fs.readFile(element, function(err, data) {
							if (data !== 'undefined') {
								raw.push(data);
							}
							if (!isError && files.length === raw.length) {
								raw = raw.join("");
								var ext = handle.ext(files[0]),
								contentType = handle.contentType(ext),
								lastModified = stats.mtime.toUTCString(),
								now = new Date(),
								T = now.getTime();

								handle.setHead(rep, {
									"Last-Modified": lastModified,
									"Server": "Node " + process.version
								});

								handle.setExpires(ext, rep);

								fs.writeFile(config.list.src + 'temp' + T, raw, function(err) {
									if (err) throw err;
									var stream = fs.createReadStream(config.list.src + 'temp' + T);
									handle.compressHandle(stream, 200, "OK", ext, req, rep);
									fs.unlink(config.list.src + 'temp' + T);
								});
							}
						});
					}
				});
			});
		});
	}
};

exports.check = Combo.check;
exports.fetch = Combo.fetch;

