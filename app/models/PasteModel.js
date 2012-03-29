module.exports = function (app, config) {

	return app.getModel("Application", true).extend().methods({
		get_redir_exist_async: function(redir, callback) {
			this.client.query('SELECT * FROM ' + this.config.table.paste + ' WHERE redir = "' + redir + '"', function(err, results, fields) {
				if(err) { throw err; }

				callback(results);
			});
		},

		//adding a new entry (name, redir, type, title)
		insert: function(name, redir, type, title) {
			this.client.query('INSERT INTO ' + this.config.table.paste + ' SET name = ?, redir = ?, type = ?, title = ?', [name, redir, type, title]);
		}
	});

};
//basic methods almost the same in every models
