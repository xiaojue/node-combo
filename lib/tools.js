/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111129
 * @description 常用的一些辅助工具类与函数
 */
var tools = {
	unique: function(data) {
		data = data || [];
		var a = {},
		i = 0,
		len = data.length;
		for (; i < len; i++) {
			var v = data[i];
			if ('undefined' == typeof(a[v])) {
				a[v] = 1;
			}
		}
		data.length = 0;
		for (var i in a) {
			data.push(i);
		}
		return data;
	},
	checkFilePath: function(filepath, typelist) {
		var param = filepath.match(/(^.+\?\?)|(.+$)/gi);
		if (param) {
			var types = new RegExp("/[^\,]+\.(" + typelist + ")(?=$|[\,|\?])/gi");
			if (param[1]) {
				var matched = path.normalize(param[1]).match(types);
				if (matched) {
					matched = tools.unique(matched);
					var extension = matched.map(function(element) {
						var typeReg = new RegExp("/(\.)(" + typelist + ")/");
						return element.match(typeReg)[2];
					});
					if (tools.unique(extension).length == 1) {
						var root = param[0].slice(0, - 2),
						files = matched.map(function(element) {
							var t = element.indexOf('?');
							element = (t !== - 1) ? element.slice(0, t) : element;
							return (element.slice(0, 1) === '/') ? path.normalize(config.list.src + element) : root + element;
						});
						return files;
					}
				}
			}
		}
		return null;
	}
	exports.unique = tools.unique;
	exports.checkFilePath = tools.checkFilePath;

