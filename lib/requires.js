/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111126
 * @desprition 全局的requires
 */
(function(ex) {
	if (ex) {
		var requireList = ['path', 'fs', 'util', 'http', 'url', 'events', 'querystring', 'net', 'os', 'vm', 'assert', './config.js'];
		ex.map = {};

		function fixName(name) {
			var matchs = name.match(/\.\/(\w+)\.js/);
			return (matchs) ? matchs[1] : name;
		}

		requireList.forEach(function(val) {
			if (require(val)) {
				var req = require(val),
				name = fixName(val);
				ex['map'][name] = (val === 'events') ? req.EventEmitter: req;
			}
		});
		ex.list = requireList;
		ex.init = function() {
			ex.list.forEach(function(val) {
				var name = fixName(val);
				eval(name + '=ex["map"]["' + name + '"]');
			});
		};
	}
})(exports);

