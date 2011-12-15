/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111214
 * @description 负责js和css的自定义标签功能,查询顺序
 * 1.先查找自身目录下的common.js然后给当前文件进行替换
 * 2.查找当前文件第一行引入的//nodeImport(*.js)文件进行替换，如果多个用逗号隔开
 */
var deps = require('./requires.js');

deps.GlobalInit();
deps.init(['./config.js']);

(function(ex) {
	if (ex) {
		var tools = {
			findDirConfig: function(filepath, callback) {
				var dir = path.dirname(filepath),
				configfile = dir + '/' + config.list.configfile,
                ret = [];
				fs.stat(configfile, function(err, stats) {
					if (!err) {
                        ret=[configfile];
					} 
                    callback(ret);
				});
			},
			findSourceConfig: function(filepath, callback) {
				var stream = fs.createReadStream(filepath, {
					start: 0,
					end: 300
				});
				stream.setEncoding('ascii');
				stream.on('data', function(str) {
					var ret = [],
					firstline = str.split(/\r|\n/gi)[0],
                    matched=firstline.match(/nodeImport\((.*?)\)/);
                    if(matched){
                        ret=ret.concat(matched[1].split(','));
                    }
					callback(ret);
				});
			},
			displace: function(config, filepath,callback) {
                fs.readFile(config,'utf-8',function(err,str){
                   try{
                   var data=JSON.parse(str);
                   }catch(ex){
                       console.log(ex);
                   }
                   fs.readFile(filepath,'utf-8',function(err,str){
                       var temp = str;
                       var compiled = Mu.compileText(temp);
                       compiled(data).addListener('data',function(c){
                            callback(c);
                       });
                   });
                });  
			}
		};

		ex.findConfig = function(filepath, callback) {
            
		};
		ex.displace = tools.displace;
	}
})(exports);

