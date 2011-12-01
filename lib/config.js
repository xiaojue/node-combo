/**
 * @author fuqiang[designsor@gmail.com]
 * @version 20111126
 * @desprition 配置默认config文件
 */
(function(ex) {
	if (ex) {
		var configure = {
			host: '',
			port: '3333',
			src: '/home/xiaojue/cdn/',
            expires:{
                fileMatch:/^(ico|git|png|jpg|js|css)$/ig,
                maxAge:60*60*24*365
            },
            compress:{
                match:/css|js|html|htm/ig
            },
			debug: true
		};
		ex.list = configure;
	}
})(exports);

