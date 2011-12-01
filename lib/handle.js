/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111127
 * @desprition 静态服务器监听handle
 */
var deps = require('./requires.js');
deps.GlobalInit();
deps.init(['./combo.js', './range.js', './config.js', './headers.js']);

(function(ex) {
    if (ex) {
        //404 error
        ex.writeError = function(rep) {
            rep.writeHead(404, {
                'Content-Type': 'text/plain',
                'Server': 'Nodejs:' + process.version
            });
            rep.write('404');
            rep.end();
        }
        //compress
        ex.compressHandle = function(raw, statusCode, reasonPhrase, ext, req, rep) {
            var stream = raw,
    acceptEncoding = req.headers['accept-encoding'] || "",
    matched = ext.match(config.list.compress.match);
if (matched && acceptEncoding.match(/\bgzip\b/)) {
    rep.setHeader("Content-Encoding", "gzip");
    stream = raw.pipe(zlib.createGzip());
} else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
    rep.setHeader("Content-Encoding", "deflate");
    stream = raw.pipe(zlib.createDeflate());
}
rep.writeHead(statusCode, reasonPhrase);
stream.pipe(rep);
}
}
var TYPES = headers.types;
ex.run = function(req, rep) {
    var pathname = url.parse(req.url).path,
        filepath = config.list.src + pathname;
    //禁止访问非src目录之外的
    filepath = path.normalize(filepath.replace(/\.\./ig, ''));
    fs.stat(filepath, function(err, stats) {
        if (err) {
            //有可能是combo的格式
            var files = combo.check(filepath);
            if (files) {
                //进行combo处理
                combo.fetch(files, req, rep);
            } else {
                ex.writeError(rep);
            }
        } else {
            if (stats.isDirectory()) {
                ex.writeError(rep);
            } else {
                var ext = path.extname(filepath),
        expires = config.list.expires;
    ext = ext ? ext.slice(1) : 'unknow';
    var contentType = TYPES[ext] || 'text/plain';
    var lastModified = stats.mtime.toUTCString(),
        ifModifiedSince = 'if-Modified-Since'.toLowerCase();
    rep.setHeader('Last-Modified', lastModified);
    rep.setHeader('Server', 'Node ' + process.version);
    rep.setHeader('Accept-Ranges', 'bytes');
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
        var raw;
        if (req.headers.range) {
            var Isrange = range.parseRange(req.headers.range, stats.size);
            if (Isrange) {
                rep.setHeader("Content-Range", "bytes " + Isrange.start + "-" + Isrange.end + "/" + stats.size);
                rep.setHeader("Content-Length", (Isrange.end - Isrange.start + 1));
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

