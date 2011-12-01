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
		//这里要检验？？开始的位置，然后再分组文件
		var param = filepath.match(/(^.+\?\?)|(.+$)/gi);
		if (param) {
			var types = /[^\,]+\.(js|css)(?=$|[\,|\?])/gi;
			if (param[1]) {
				var matched = path.normalize(param[1]).match(types);
				if (matched) {
					matched = tools.unique(matched);
					var extension = matched.map(function(element) {
						return element.match(/(\.)(js|css)/)[2];
					});
					if (tools.unique(extension).length == 1) {
						var root = param[0].slice(0, - 2),
						files = matched.map(function(element) {
                            var t = element.indexOf('?');
							element = (t !== - 1) ? element.slice(0, t) : element;
							return (element.slice(0, 1) === '/') ? path.normalize(config.list.src + element) : root + element;
						});
						return files;
					}
				}
			}
		}
		return null;
	},
	fetch: function(files, req, rep, stats) {
		//抓所有的资源，有一个没有则返回null 返回404
		console.log(files);
		var ifModifiedSince = 'if-Modified-Since'.toLowerCase();
		if (req.headers[ifModifiedSince]) {
			rep.writeHead(304, 'Not Modified');
			rep.end();
		} else {
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
								var ext = path.extname(files[0]),
								expires = config.list.expires;
								ext = ext ? ext.slice(1) : 'unknow';
								var contentType = TYPES[ext] || 'text/plain';
								var lastModified = stats.mtime.toUTCString();
								rep.setHeader('Last-Modified', lastModified);
								rep.setHeader('Server', 'Node ' + process.version);

								var now = new Date(),
								T = now.getTime();
								if (ext.match(expires.fileMatch)) {
									now.setTime(T + expires.maxAge * 1000);
									rep.setHeader('Expires', now.toUTCString());
									rep.setHeader('Cache-Control', 'max-age=' + expires.maxAge);
								}

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
		}
	}
};

exports.check = Combo.check;
exports.fetch = Combo.fetch;

