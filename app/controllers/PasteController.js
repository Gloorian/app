module.exports = function (app, config) {

	return app.getController("Application", true).extend()
	.methods({
		index : function(req, res){
			this.render(res, 'paste/index', { title: 'Âpp', paste: true });
		},
		sent : function(req, res) {
			var code = req.body.code,
				type = req.body.type,
				title = req.body.title,
				types = [
					'Text',
					'Javascript',
					'C',
					'Python',
					'Bash',
					'SQL',
					'HTML',
					'XML',
					'CSS',
					'PHP'
				],
				name = '';

			if(code !== '' && type !== '' && title !== '') {
				if(types.indexOf(type)) {
					require('../config/function').reduct(app.getModel('Paste'), function(redir) {
						var name = title + '_' + redir;
						app.getModel('Paste').insert(name, redir, type, title);
						console.log('paste ajouté avec succès');

						require('fs').writeFile(__dirname + '/../public/paste/' + name.replace(' ', '_'), code, 'utf-8', function(err) {
							if(err) { throw err; }

							res.redirect('/paste/' + redir);
						});
					});
				} else {
					this.render(res, 'error', {title: 'Âpp', error: 'Une erreur est survenu avec le type'});
				}
			} else {
				this.render(res, 'error', {title: 'Âpp', error: 'Les champs doivent être remplis'});
			}

		},

		show : function(req, res) {
			var redir = req.params.redir;
			app.getModel('Paste').get_redir_exist_async(redir, function(results) {

				if(results.length) {
					require('fs').readFile(__dirname + '/../public/paste/' + results[0].name.replace(' ', '_'), 'utf-8', function(err, data) {
						if(err) { throw err; }
						var text = results[0].type == 'txt' ? true : false;
						//checks the type of the the paste
						app.getController('Paste').render(res, 'paste/result', {code: data, titre: results[0].title, type: results[0].type, text: text, paste_pretty: true, title: 'Âpp', paste: true, redir: redir});
					});
				} else {
					app.getController('Paste').render(res, 'error', {title: 'Âpp', error: 'Ce paste n\'existe pas !'});
				}
			});
		},
		download : function(req, res) {
			var redir = req.params.redir;
			app.getModel('Paste').get_redir_exist_async(redir, function(results) {

				if(results.length) {
					app.getModel('Upload').upload_seen(redir, function() {
						var fs = require('fs'),
							zip = require("node-native-zip"),
							path = require('path');

						path.exists(__dirname + '/../public/paste/zip/' + results[0].name.replace(' ', '_') +'.zip', function(exists) {
							if(exists) {
								var zip_path = path.normalize(__dirname + '/../public/paste/zip/' + results[0].name.replace(' ', '_') +'.zip');
								res.contentType('zip');
								res.sendfile(zip_path);
							} else {
								var archive = new zip();
								var filepath = __dirname + '/../public/paste/' + results[0].name.replace(' ', '_');
								archive.addFiles([
									{ name: results[0].name.replace(' ', '_') + '.txt', path: filepath }
								], function (err) {
									if (err){ return console.log("err while adding files", err); }

									var buff = archive.toBuffer();

									fs.writeFile(__dirname + '/../public/paste/zip/' + results[0].name.replace(' ', '_') +'.zip', buff, function () {
										var zip_path = path.normalize(__dirname + '/../public/paste/zip/' + results[0].name.replace(' ', '_') +'.zip');
										res.contentType('zip');
										res.sendfile(zip_path);
									});
								});
								
							}

						});

					});
				}
			});
		}
	});

};
