/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111129
 * @description 常用的一些辅助工具类与函数
 */
exports.unique = function(data) {
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
}

