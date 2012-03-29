module.exports = function (app, config) {
	return app.getController("Application", true).extend(function() {
		this.model = app.getModel('Url');
	})
	.methods({
		index: function (req, res) {
			this.render(res, 'url/index', { title: 'Âpp', url: true });
		},
		sent: function(req, res) {
			var url = req.body.url;
			var regex_url = /^(https?|ftp|gopher|telnet|file|notes|ms-help):\/\/[A-Za-z0-9àáâãäåçèéêëìíîïðòóôõöùúûüýÿ][A-Za-z0-9\-\.àáâãäåçèéêëìíîïðòóôõöùúûüýÿ]+[A-Za-z0-9àáâãäåçèéêëìíîïðòóôõöùúûüýÿ]\.[A-Za-z]{2,}[\43-\176]*$/i;
			if(regex_url.test(url)) {
				this.model.get_url_exist(url, function(results) {
					if(!results.length)
					{
						//Checking if the url has already been saved

						//Here, it hasn't, so we create a new one
						require('../config/function').reduct(app.getModel('Url'), function(redir) {
							app.getModel('Url').insert_url(url, redir);
							console.log('url ajoutée avec succès');
							//res.render('result', {url: '/' + redir, title: 'ĜĜ'});
							res.send('/' + redir, { 'Content-Type': 'text/plain'}, 201); //response
							req.body.url = '';
						});
					} else {
						//here, we send the result from the db
						res.send('/' + results[0].redir, { 'Content-Type': 'text/plain'}, 201);
						//res.render('result', {url: '/' + results[0].redir, title: 'ĜĜ'});
						req.body.url = '';
					}
				});
				
			} else {
				res.send('L\'url rentrée est invalide', { 'Content-Type': 'text/plain'}, 201);
				//res.render('error', {error: 'L\'url rentrée est invalide', title: 'ĜĜ'});
				req.body.url = '';
			}
		},
		redir : function(req, res) {

			//redirection function that takes the id of the url and check in the db to the know the real url
			var url = req.params.url;
			this.model.get_redir_exist_async(url, function(results) {
				if(results.length) {
					res.redirect(results[0].url);
				} else {
					app.getModel('Url').render(res, 'error', {title: 'Âpp', error: 'Aucun site n\'est enregistré sous ce nom !'});
					//res.render('error', {error: 'Aucun site n\'est enregistré sous ce nom !', title: 'ĜĜ'});
				}
			});
		}

	});

};
