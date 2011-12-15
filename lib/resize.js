/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111206
 * @description 图片尺寸重新计算
 */
var deps = require('./requires.js');
deps.GlobalInit();
deps.init(['./handle.js', './config.js', './headers.js']);

(function(ex) {
	if (ex) {
		ex.check = function(path) {
			var isHasExt = /(png|gif|jpg)_\d+x\d+\.\1/gi,
			matched = path.match(isHasExt);
			if (matched) {
				var ret = {},
				size = matched[0].match(/\d+/gi),
				realpath = path.match(/^(.*?)(jpg|png|gif)(?=_)/gi);
				ret[realpath] = size;
				return ret;
			}
			return null;
		};
		ex.fetch = function(fileobject, req, rep, stats) {
			console.log(fileobject);
			handle.noCacheCallback(stats, req, rep, function() {
				var src;
				for (src in fileobject) {
					console.log(src);
					fs.stat(src, function(err, stats) {
						if (err) {
							handle.writeError(rep);
						} else {
							var img = new canvas.Image();
							img.onerror = function(err) {
								handle.writeError(rep);
								throw err;
							};
							img.onload = function() {
								console.log('load resize img');
								var size = fileobject[src],
								fixw = parseInt(size[0]),
								fixh = parseInt(size[1]),
								w = img.width,
								h = img.height;
								//这里是等比缩放
								var mycanvas, stream, Now = new Date().valueOf(),
								temp = fs.createWriteStream(__dirname + '/resizetemp' + Now + '.png');
								mycanvas = (fixw > w || fixh > h) ? new canvas(w, h) : new canvas(fixw, fixh);
								var ctx = mycanvas.getContext('2d');

								if (fixw > w || fixh > h) {
									ctx.drawImage(img, 0, 0, w, h);
								} else {
									ctx.drawImage(img, 0, 0, fixw, fixh);
								}

								stream = mycanvas.createPNGStream();

								stream.on('data', function(chunk) {
									temp.write(chunk);
								});

								stream.on('end', function() {
									console.log('resize img end');
									var ext = handle.ext(src),
									contentType = handle.contentType('png'),
									lastModified = stats.mtime.toUTCString();

									handle.setHead(rep, {
										"Content-Type": contentType,
										"Last-Modified": lastModified,
										"Server": "Node " + process.version
									});

									handle.setExpires(ext, rep);

									var tempstream = fs.createReadStream(__dirname + '/resizetemp' + Now + '.png');
									handle.compressHandle(tempstream, 200, "OK", ext, req, rep, function() {
										fs.unlink(__dirname + '/resizetemp' + Now + '.png');
									});
								});
							};
							img.src = src;
						}
					});
				}
			});
		};
	}
})(exports);

