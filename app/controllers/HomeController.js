module.exports = function (app, config) {
	return app.getController("Application", true).extend()
	.methods({
		index: function (req, res) {
			this.render(res, 'index', {
				title: 'Âpp',
				home: true
			});
		}
	});
};
