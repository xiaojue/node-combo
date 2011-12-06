/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111126
 * @description 全局的requires
 */
(function(ex) {
	if (ex) {
		var requireList = ['canvas','zlib','path', 'fs', 'util', 'http', 'url', 'events', 'querystring', 'net', 'os', 'vm', 'assert'],
		customsList = ['./image.js','./combo.js','./tools.js','./range.js','./config.js', './handle.js','./headers.js'];

		ex.GlobalMap = {};
		ex.CustomMap = {};
		ex.Map = {};

		function fixName(name) {
			var matchs = name.match(/\.\/(\w+)\.js/);
			return (matchs) ? matchs[1] : name;
		}

		function bindMap(list, map) {
			list.forEach(function(val) {
				if (require(val)) {
					var req = require(val),
					name = fixName(val);
					ex[map][name] = (val === 'events') ? req.EventEmitter: req;
				}
				if (ex[map][name]) eval(name + '=ex["' + map + '"]["' + name + '"]');
			});
		}

		ex.GlobalInit = function() {
			bindMap(requireList, 'GlobalMap');
		};

		ex.CustomInit = function() {
			bindMap(customsList, 'CustomMap');
		};

		ex.init = function(list) {
			bindMap(list, 'Map');
		};

	}
})(exports);
