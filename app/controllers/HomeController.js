module.exports = function (app, config) {
	return app.getController("Application", true).extend()
	.methods({
		index: function (req, res) {
			this.render(res, 'index', {
				title: 'Âpp',
				home: true

				//always send a boolen named as the page for the navbar. See views to understand
			});
		}
	});
};

//home controller, sends back the index page
