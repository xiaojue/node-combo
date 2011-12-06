/**
 * @author fuqiang[designsor@gamil.com]
 * @version 20111127
 * @description 支持断点续传
 */

(function(ex) {
	if (ex) {
		ex.parseRange = function(str,size) {
			if(str.indexOf(",") != - 1) {
				return;
			}

			var range = str.split("-"),
			start = parseInt(range[0], 10),
			end = parseInt(range[1], 10);

			// Case: -100
			if (isNaN(start)) {
				start = size - end;
				end = size - 1;
				// Case: 100-
			} else if (isNaN(end)) {
				end = size - 1;
			}

			// Invalid
			if (isNaN(start) || isNaN(end) || start > end || end > size) {
				return;
			}

			return {
				start: start,
				end: end
			};
		};
	}
})(exports);

