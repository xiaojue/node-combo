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
		if (filepath.match('/\?\?/')){
			var type, types = /[^,|\?\?|\?]+\.(js|css)(?=[\,|\?])/gi,
			matched = path.normalize(filepath).match(types);
			ret = function() {
				if (matched) {
					matched = tools.unique(matched);
					var extension = matched.map(function(element) {
						return element.match(/(\.)(js|css)/)[2];
					});
					if (tools.unique(extension).length == 2) {
						return null;
					} else {
						return matched;
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
