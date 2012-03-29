module.exports = function (app, config) {

	return app.getModel('Application', true).extend().methods({

		get_redir_exist_async: function(redir, callback) {
			this.client.query('SELECT * FROM ' + this.config.table.url + ' WHERE redir = "' + redir + '"', function(err, results, fields) {
				if(err) { throw err; }

				callback(results);
			});
		},

		get_url_exist: function(url, callback) {
			this.client.query('SELECT * FROM ' + this.config.table.url + ' WHERE url = "' + url + '"', function(err, results, fields) {
				
				if(err) { throw err; }
				callback(results);
			});
		},

		insert_url: function(url, redir) {
			this.client.query('INSERT INTO ' + this.config.table.url + ' SET url = ?, redir = ?', [url, redir]);
		}

	});

};

//basic methods almost the same in every models
