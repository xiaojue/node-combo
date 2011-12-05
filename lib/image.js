/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111202
 * @description 多图片地址的合并，使用node-canvas来进行新图片的创建与操作
 */

var deps = require('./requires.js');
deps.GlobalInit();
deps.init(['./headers.js', './config.js', './tools.js', './handle.js']);

var canvasImage = canvas.Image;

var comboImg = {
	check: function(filepath) {
		return tools.checkFilePath(filepath, "jpg|gif|png");
	},
	fetch: function(files, req, rep, stats) {
        console.log('fetch')
		handle.noCacheCallback(stats, req, rep, function() {
            var Imagequeue=[],h=[],w=[],
            isError,i=0;
            files.forEach(function(element,index){
                var img = new canvasImage();
                img.onload = function(){
                    console.log('loaded');
                    Imagequeue[index]=img;
                    h[index]=img.height;
                    w[index]=img.width;
                    i++;
                    if(!isError && index===i){
                        //全部载入并且没有失效图片地址
                        var width=w.sort()[w.length-1],
                            height=function(){
                                var ret=0;
                                h.forEach(function(val){
                                    ret+=val;
                                });
                                return ret;
                            }(),
                            mycanvasImage=new canvas(width,height),
                            ctx=mycanvasImage.getContext('2d'),
                            InkrementHeight=0;
                            Imagequeue.forEach(function(element,index){
                               ctx.drawImage(element,0,InkrementHeight);
                               InkrementHeight+=h[index];
                            });
                            var Now = new Date().valueOf(),
                                tmep = fs.createWriteStream(__dirname+'/temp'+Now+'.png'),
                                stream = mycanvasImage.createPNGStream();
                            stream.on('data',function(chunk){
                                temp.wirte(chunk);
                            });
                            stream.on('end',function(){
                                var ext = handle.ext(files[0]),
                                contentType = handle.contentType('png'),
                                lastModified = stats.mtime.toUTCString();
                                handle.setHead(rep,{
                                    "Last-Modified":lastModified,
                                    "Server":"Node "+ process.version
                                });
                                handle.setExpires(ext,rep);
                                handle.compressHandle(stream,200,"OK",ext,req,rep);
                                fs.unlink(__dirname+'temp'+Now+'.png');
                                console.log('combo img end');
                            });
                    }
                };
                img.error = function(err){
                    isError=true;
                    handle.writeError(rep);
                };
                img.src = element;
            });
		});
	}
};
exports.check = comboImg.check;
exports.fetch = comboImg.fetch;

