/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111214
 * @description 负责js和css的自定义标签功能,查询顺序
 * 1.先查找自身目录下的common.js或者common.json然后给当前文件进行替换
 * 2.查找当前文件第一行引入的//nodeImport(*.js,*.json)文件进行替换，如果多个用逗号隔开
 */
var deps=require('./requires.js');

deps.GlobalInit();

(function(ex) {
	if (ex) {
		var tools = {
			findDirConfig: function(filepath) {

			},
			findSourceConfig: function(filepath) {

			},
			displace: function(config, filepath) {

			}
		};

		ex.findConfig = function(filepath) {
			var ret = [],
			dirConfig = tools.findDirConfig(filepath),
			sourceConfig = tools.findSourceConfig(filepath);
            return ret.concat(dirConfig,sourceConfig);
		};
		ex.displace = tools.displace;
	}
})(exports);

