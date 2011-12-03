/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111202
 * @description 多图片地址的合并，使用node-canvas来进行新图片的创建与操作
 */

var deps = require('./requires.js');
deps.GlobalInit();

var Image = canvas.Image;
var img1 = new Image;
var img2 = new Image;
img1.onload = function() {
    img1load=true;
};
img2.onload = function(){
    img2load=true;
};
img1.src = '2.jpg';
img2.src= '1.png';
var T=setInterval(function(){
    if(img1load && img2load){
        clearInterval(T);
	var pic = new canvas(img1.width+img2.width, img1.height+img2.height),
	ctx = pic.getContext('2d');
	ctx.drawImage(img1, 0, 0);
	ctx.drawImage(img2, 0, img1.height);
//	console.log(pic.toDataURL());
    var out=fs.createWriteStream(__dirname+'/3.png'),
    stream = pic.createPNGStream();

    stream.on('data',function(chunk){
        out.write(chunk);
    });

    stream.on('end',function(){
        console.log('saved');
    });


    }
},1000);
