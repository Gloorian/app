module.exports = function (app, config) {
	return app.getController("Application", true).extend()
	.methods({
		index: function(req, res) {
			this.render(res, 'password/index', { title: 'Âpp', password: true });
		}
	});

};

//this module is entirely done client-side. We only need to give the page
