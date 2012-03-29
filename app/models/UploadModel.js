module.exports = function (app, config) {

	return app.getModel('Application', true).extend().methods({

		get_redir_exist_async: function(redir, callback) {
			this.client.query('SELECT * FROM ' + this.config.table.upload + ' WHERE redir = "' + redir + '"', function(err, results, fields) {
				if(err) { throw err; }

				callback(results);
			});
		},

		//adding a new entry (name, redir, type)
		insert: function(name, redir, type) {
			this.client.query('INSERT INTO ' + this.config.table.upload + ' SET name = ?, redir = ?, type = ?, last_seen = NOW()', [name, redir, type]);
		},
		upload_seen: function(redir, callback) {
			this.client.query('UPDATE ' + this.config.table.upload + ' SET last_seen = NOW() WHERE redir = ?', [redir]);
			callback();
		}
	});

};
//basic methods almost the same in every models
