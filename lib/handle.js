/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111127
 * @desprition 静态服务器监听handle
 */
var deps = require('./requires.js');
deps.GlobalInit();
deps.init(['./combo.js', './range.js', './config.js', './headers.js']);

(function(ex) {
	ex.ext = function(filepath) {
		var ext = path.extname(filepath),
		expires = config.list.expires;
		ext = ext ? ext.slice(1) : 'unknow';
		return  headers.types[ext] || 'text/plain';
	};
	//404 error
	ex.setHead = function(rep, config) {
		var i;
		for (i in config) {
			rep.setHeader(i, config[i]);
		}
	};
	ex.writeError = function(rep) {
		rep.writeHead(404, {
			'Content-Type': 'text/plain',
			'Server': 'Nodejs:' + process.version
		});
		rep.write('404');
		rep.end();
	};
	//compress
	ex.compressHandle = function(raw, statusCode, reasonPhrase, ext, req, rep) {
		var stream = raw,
		acceptEncoding = req.headers['accept-encoding'] || "",
		matched = ext.match(config.list.compress.match);
		if (matched && acceptEncoding.match(/\bgzip\b/)) {
			ex.setHead(rep, {
				"Content-Encoding": "gzip"
			});
			stream = raw.pipe(zlib.createGzip());
		} else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
			ex.setHead(rep, {
				"Content-Encoding": "deflate"
			});
			stream = raw.pipe(zlib.createDeflate());
		}
		rep.writeHead(statusCode, reasonPhrase);
		stream.pipe(rep);
	};

	ex.run = function(req, rep) {
		var pathname = url.parse(req.url).path,
		filepath = config.list.src + pathname;
		//禁止访问非src目录之外的
		filepath = path.normalize(filepath.replace(/\.\./ig, ''));
		fs.stat(filepath, function(err, stats) {
			if (err) {
				//有可能是combo的格式
				var files = combo.check(filepath);
				files && combo.fetch(files, req, rep) || ex.writeError(rep);
			} else {
				if (stats.isDirectory()) {
					ex.writeError(rep);
				} else {
					var contentType = ex.ext(filepath),
					lastModified = stats.mtime.toUTCString(),
					ifModifiedSince = 'if-Modified-Since'.toLowerCase();
					ex.setHead(rep, {
						"Last-Modified": lastModified,
						"Server": "Node" + process.version,
						"Accept-Ranges": "bytes"
					});
                    //1
					if (ext.match(expires.fileMatch)) {
						var now = new Date();
						now.setTime(now.getTime() + expires.maxAge * 1000);
						ex.setHead(rep, {
							"Expires": now.toUTCString(),
							"Cache-Control": "max-age=" + expires.maxAge
						});
					}
					if (req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {
						rep.writeHead(304, 'Not Modified');
						rep.end();
					} else {
						var raw;
						if (req.headers.range) {
							var Isrange = range.parseRange(req.headers.range, stats.size);
							if (Isrange) {
								ex.setHead(rep, {
									"Content-Range": "bytes" + Isrange.start + "-" + Isrange.end + "/" + start.size,
									"Content-Length": Isrange.end - Isrange.start + 1
								});
								raw = fs.createReadStream(filepath, {
									"start": Isrange.start,
									"end": Isrange.end
								});
								ex.compressHandle(raw, 206, "Partial Content", ext, req, rep);
							} else {
								rep.removeHeader("Content-Length");
								rep.writeHead(416, "Request Range Not Satisfiable");
								rep.end();
							}
						} else {
							raw = fs.createReadStream(filepath);
							ex.compressHandle(raw, 200, "Ok", ext, req, rep);
						}
					}
				}
			}
		});
	};
})(exports);

