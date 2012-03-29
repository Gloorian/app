module.exports = function (app, config) {
	return app.getModel('Base', true).extend(function () {
		this.mysql = require('mysql');
		this.config = require(__dirname + '/../config/config_db');
		this.client = this.mysql.createClient({
			user: this.config.user,
			password: this.config.password,
			database: this.config.db
		});
	});
};
