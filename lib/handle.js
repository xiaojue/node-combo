/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111127
 * @desprition 静态服务器监听handle
 */

var deps = require('./requires.js');
deps.GlobalInit();
deps.init(['./range.js', './config.js', './headers.js']);

//404 error
function writeError(rep) {
	rep.writeHead(404, {
		'Content-Type': 'text/plain',
		'Server': 'Nodejs:' + process.version
	});
	rep.write('404');
	rep.end();
}

(function(ex) {
	if (ex) {
		var TYPES = headers.types;
		ex.run = function(req, rep) {
			var pathname = url.parse(req.url).pathname,
			filepath = config.list.src + pathname;
			//禁止访问非src目录之外的
			filepath = path.normalize(filepath.replace(/\.\./ig, ''));
			fs.stat(filepath, function(err, stats) {
				if (err) {
					writeError(rep);
				} else {
					if (stats.isDirectory()) {
						writeError(rep);
					} else {
						var ext = path.extname(filepath),
						expires = config.list.expires;
						ext = ext ? ext.slice(1) : 'unknow';
						var contentType = TYPES[ext] || 'text/plain';
						var lastModified = stats.mtime.toUTCString(),
						ifModifiedSince = 'if-Modified-Since'.toLowerCase();

						rep.setHeader('Last-Modified', lastModified);
						rep.setHeader('server', 'Nodejs:' + process.version);

						if (ext.match(expires.fileMatch)) {
							var now = new Date();
							now.setTime(now.getTime() + expires.maxAge * 1000);
							rep.setHeader('Expires', now.toUTCString());
							rep.setHeader('Cache-Control', 'max-age=' + expires.maxAge);
						}

						if (req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {
							rep.writeHead(304, 'Not Modified');
							rep.end();
						} else {
							var raw = fs.createReadStream(filepath),
							acceptEncoding = req.headers['accept-encoding'] || "",
							matched = ext.match(config.list.compress.match);

							if (matched && acceptEncoding.match(/\bgzip\b/)) {
								rep.writeHead(200, "Ok", {
									'Content-Encoding': 'gzip'
								});
								raw.pipe(zlib.createGzip()).pipe(rep);
							} else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
								rep.writeHead(200, "Ok", {
									'Content-Encoding': 'deflate'
								});
								raw.pipe(zlib.createDeflate()).pipe(rep);
							} else {
								rep.writeHead(200, "Ok");
								raw.pipe(rep);
							}
						}
					}
				}
			});
		};
	}
})(exports);
