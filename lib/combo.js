var Path = require('path');
var fs = require('fs');
var util = require('util');
var http = require('http');
var url = require('url');
var qs = require('querystring');
var Combo = exports;

//进程中缓存请求过的combo url;
Combo.cache = {};

Combo.Root = '/home/xiaojue/cdn/';

Combo.Port = 3030;

Combo.timeout = 15*1000; //15s

//启动监听服务
/*
 /js/jquery/??jq1.js,jq2.js,jq3.js&/js/other/??ot1.js,ot2.js?t=0231.js
*/
function badres(res){
     res.writeHead(200,{
	"Content-Type":"text/html",
        "Server":"NodeJs("+process.version+")"
      });
     res.write('url is not support');
     res.end();
}

function ServerStart(){
http.createServer(function (req, res) {
   var uri=url.parse(req.url).path;
   var filetype;
   if(uri.indexOf('.js')!==0){
	filetype='text/javascript';
	console.log('js')
   }else if(uri.indexOf('.css')!==0){
	filetype='text/css';
	console.log('css')
   }else{
     badres(res);
     return;
   }
   if(!Combo.cache.hasOwnProperty(uri)){
   var queue=[];
   var Tout,Tval;
   var Combotemp=qs.parse(uri,sep='&',eq='??');
   console.dir(Combotemp);
   for(var key in Combotemp){ 
	if(Combotemp[key]===""){
	  badres(res);
	  return;
	}
	var files=Combotemp[key].split(',');
	//这里全部使用异步I/O方式去读取文件和写入
	for(var i=0;i<files.length;i++){
	try{
	   (function(i){
	    var file=Path.normalize(Combo.Root+key+files[i])
	    console.log(file)
   	    fs.open(file,'r',function(err,fd){
		if(err) {
    		   badres(res);
		   return;
		}
		//一兆缓存
		console.log(fd);
		fs.readFile(file,'utf-8',function(err,str){
		if(err) {
    		   badres(res);
		   return;
		}
		queue[i]=str;		
		console.log(queue[i])
		});		
	    });
	   })(i);
	}catch(e){
	console.log(e);
	}
	}
   }
   Tout=setTimeout(function(){
	clearInterval(Tval);
     	badres(res);
   },Combo.timeout);

   Tval=setInterval(function(){
	console.log(queue.indexOf('undefined'))
	if(queue.indexOf('undefined')===-1){
	 clearTimeout(Tout);
	 clearInterval(Tval);
	 var buf=queue.join(',');
    	res.writeHead(200,{
	"Content-Type":filetype,
        "Server":"NodeJs("+process.version+")"
	});
	res.write(buf);
	res.end();
     	Combo.cache[uri]=buf;
	};
   },10);	
   }
}).listen(Combo.Port);
console.log('Server running at '+Combo.Port);
}

Combo.start=ServerStart;
