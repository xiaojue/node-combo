/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111127
 * @description 静态服务器监听handle
 */
var deps = require('./requires.js');
deps.GlobalInit();
deps.init(['./template.js', './resize.js', './image.js', './combo.js', './range.js', './config.js', './headers.js']);

(function(ex) {
	ex.contentType = function(ext) {
		return headers.types[ext] || 'text/plain';
	};
	ex.ext = function(filepath) {
		var ext = path.extname(filepath);
		return (ext) ? ext.slice(1) : 'unknow';
	};
	ex.setExpires = function(ext, rep) {
		var expires = config.list.expires;
		if (ext.match(expires.fileMatch)) {
			var now = new Date();
			now.setTime(now.getTime() + expires.maxAge * 1000);
			ex.setHead(rep, {
				"Expires": now.toUTCString(),
				"Cache-Control": "max-age=" + expires.maxAge
			});
		}
	};
	ex.noCacheCallback = function(stats, req, rep, callback) {
		var lastModified = stats ? stats.mtime.toUTCString() : stats,
		ifModifiedSince = 'if-Modified-Since'.toLowerCase();
		if (lastModified === undefined && req.headers[ifModifiedSince]) {
			rep.writeHead(304, 'Not Modified');
			rep.end();
			return;
		}
		if (req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {
			rep.writeHead(304, 'Not Modified');
			rep.end();
		} else {
			callback();
		}
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
	ex.compressHandle = function(raw, statusCode, reasonPhrase, ext, req, rep,callback) {
		var stream = raw,
		acceptEncoding = req.headers['accept-encoding'] || "",
		matched = ext.match(config.list.compress.match);
		function gizp(s) {
			if (matched && acceptEncoding.match(/\bgzip\b/)) {
				ex.setHead(rep, {
					"Content-Encoding": "gzip"
				});
				s = s.pipe(zlib.createGzip());
			} else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
				ex.setHead(rep, {
					"Content-Encoding": "deflate"
				});
				s = s.pipe(zlib.createDeflate());
			}
			rep.writeHead(statusCode, reasonPhrase);
			s.pipe(rep);
		}
		//增加txt，js，css的自定义标签机制,stream有path属性……
		var filepath = stream.path;
        console.log(filepath);
		if (/txt|js|css/.test(ext)) {
			template.findConfig(filepath, function(ret) {
                console.log(ret);
				var JSONRET = {},
				i;
				ret.forEach(function(element) {
                    var JSONFILE={};
                    try{
                        var str=fs.readFileSync(element,'utf-8');
                        JSONFILE = eval("("+str+")");
                    }catch(ex){
                        console.log('json type error');
                        JSONFILE = {};
                    }
					for (i in JSONFILE) {
						JSONRET[i] = JSONFILE[i];
					}
				});
				template.displace(JSONRET, filepath, function(source) {
					var NOW = new Date().valueOf();
					var file = __dirname+'/temp' + NOW + '.txt';
					var wt = fs.createWriteStream(file);
					wt.end(source);
					wt.on('error', function(err) {
						console.log(err);
					});
					wt.on('close', function() {
						var temp = fs.createReadStream(file);
						gizp(temp);
						fs.unlink(file);
						if (callback) {
							callback();
						}
					});
				});
			});
		} else {
			gizp(stream);
			if (callback) {
				callback();
			}
		}
	};
	ex.run = function(req, rep) {
		var pathname = url.parse(req.url).path,
		filepath = config.list.src + pathname;
		//禁止访问非src目录之外的
		filepath = path.normalize(filepath.replace(/\.\./ig, ''));
		fs.stat(filepath, function(err, stats) {
			if (err) {
				//有可能是combo的格式
				var txtfiles = combo.check(filepath),
				imagefiles = image.check(filepath),
				resizefile = resize.check(filepath);
				if (txtfiles) {
					combo.fetch(txtfiles, req, rep, stats);
				} else if (imagefiles) {
					image.fetch(imagefiles, req, rep, stats);
				} else if (resizefile) {
					resize.fetch(resizefile, req, rep, stats);
				} else {
					ex.writeError(rep);
				}
			} else {
				if (stats.isDirectory()) {
					ex.writeError(rep);
				} else {
					var ext = ex.ext(filepath),
					contentType = ex.contentType(ext),
					lastModified = stats.mtime.toUTCString();
					ex.setHead(rep, {
						"Last-Modified": lastModified,
						"Server": "Node" + process.version,
						"Accept-Ranges": "bytes"
					});
					ex.setExpires(ext, rep);
					ex.noCacheCallback(stats, req, rep, function() {
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
					});
				}
			}
		});
	};
})(exports);

