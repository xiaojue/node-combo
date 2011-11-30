/**
 * @author fuqiang[designsor@gamil.com]
 * @version 20111129
 * @desprition 文本文件合并
 * @Todo 图片合并
 */

var deps = require('./requires.js');
deps.GlobalInit();
deps.init(['./config.js', './tools.js']);

Combo = {
	check: function(filepath) {
    //这里要检验？？开始的位置，然后再分组文件
    var param=filepath.match(/(^.+\?\?)|(.+$)/gi);
		if (param){
			var type, types = /[^\,]+\.(js|css)(?=$|[\,|\?])/gi,
			matched = path.normalize(param[1]).match(types);
			ret = function() {
				if (matched) {
					matched = tools.unique(matched);
					var extension = matched.map(function(element) {
						return element.match(/(\.)(js|css)/)[2];
					});
					if (tools.unique(extension).length == 2) {
						return null;
					} else {
            var root=param[0].slice(0,-2),
            files=matched.map(function(element){
              var t=element.indexOf('?');
               if(t!==-1){
                  element=element.slice(0,t);
               }
               if(element.slice(0,1)==='/'){
                 return path.normalize(config.list.src+element);
               }else{
                 return root+element;
               }
            });
						return files;
					}
				} else {
					return null;
				}
			} ();
			return ret;
		} else {
			return null;
		}
	},
	fetch: function() {

	},
	merge: function() {

	},
	run: function() {

	},
	distoryCache: function() {

	},
	writeCache: function() {

	}
};

for(var i in Combo){
  exports[i]=Combo[i];
}
