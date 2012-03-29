module.exports = function (app) {
	return {
		root: [
			['get', '/', 'Home'],
			

			['get', '/url', 'Url'],
			['post', '/url/sent', 'Url', 'sent'],
			['get', '/url/:url', 'Url', 'redir'],


			['get', '/upload', 'Upload'],
			['post', '/upload/sent', 'Upload', 'sent'],
			['get', '/upload/:redir', 'Upload', 'show'],
			['get', '/upload/dl/:redir', 'Upload', 'dl'],

			['get', '/password', 'Password'],

			['get', '/paste', 'Paste'],
			['post', '/paste/sent', 'Paste', 'sent'],
			['get', '/paste/:redir', 'Paste', 'show'],
			['get', '/paste/dl/:redir', 'Paste', 'download']
		]
	};
};

//routes: ['method (get, post)', 'url to get, :example are got by req.params.example', 'Controller', 'action, optional, index by defaults']
