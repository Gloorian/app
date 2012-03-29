module.exports = function (app, config) {

	return app.getController("Application", true).extend(function() {
		this.model = app.getModel('Upload');
	})
	.methods({
		index : function(req, res) {
			this.render(res, 'upload/index', { title: 'Âpp', upload: true});
		},

		sent : function(req, res, next) {
			var file = req.files.file,
				size_limit = 20,
				extension = file.name.substr(file.name.lastIndexOf('.') + 1, file.length),
				extension_authorized = ['jpeg', 'jpg', 'png', 'pdf', 'gz', 'zip'],
				size = file.size / 1048576;
				console.log(file.type);

			if(size <= size_limit){
				if(extension_authorized.indexOf(extension)) {
					if(file.size !== 0 && file.length) {
						require('../config/function').reduct(app.getModel('Upload'), function(redir) {
							var name = file.name.substr(0, file.name.lastIndexOf('.')) + '_' + redir + '.' + extension;
							app.getModel('Upload').insert(name, redir, extension);
							console.log('fichier ajouté avec succès');
							require('fs').rename(file.path, __dirname + '/../public/uploads/' + name.replace(' ', '_'), function(err) {
								if(err) { throw err; }

								res.redirect('/upload/' + redir);
							});
						});
					} else {
						this.render(res, 'error', {title: 'Âpp', error: 'Il n\'y a pas de fichier !'});
					}
				} else {
					this.render(res, 'error', {title: 'Âpp', error: 'Le format du fichier est invalide'});
				}
			} else {
				this.render(res, 'error', {title: 'Âpp', error: 'Ce fichier est trop volumineux'});
			}

		},

		show : function(req, res) {
			var redir = req.params.redir;
			this.model.get_redir_exist_async(redir, function(results) {
				if(results.length) {
					app.getController('Upload').render(res, 'upload/result', {name: results[0].name, title: 'Âpp', redir: redir, redir_min: redir + '_min', upload: true});
				} else {
					app.getController('Upload').render(res, 'error', {title: 'Âpp', error: 'Ce fichier n\'existe pas'});
				}
			});
		},

		dl : function(req, res) {
			var redir = req.params.redir;
			this.model.get_redir_exist_async(redir, function(results) {

				var filepath = require('path').normalize(__dirname + '/../public/uploads/' + results[0].name.replace(' ', '_'));

				if(results.length) {
					app.getModel('Upload').upload_seen(redir, function() {
						res.contentType(results[0].type);
						res.sendfile(filepath);
					});
				}
			});
		}

	});

};
