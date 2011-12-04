/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111202
 * @description 多图片地址的合并，使用node-canvas来进行新图片的创建与操作
 */

var deps = require('./requires.js');
deps.GlobalInit();
deps.CustomInit();

var Image = canvas.Image;

var comboImg = {
    check:function(filepath){
     return tools.checkFilePath(filepath,"jpg|gif|png");      
    },
    fetch:function(files,req,rep,stats){
        console.log(files);
    }
};