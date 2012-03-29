var matador = require('matador'),
	env = process.env.NODE_ENV || 'development',
	argv = matador.argv,
	config = require('./app/config/' + env),
	app = matador.createApp(__dirname, config, {}),
	port = argv.port || 3000;

app.configure(function () {
	app.set('views', __dirname + '/app/views'); //set the views directory
	app.set('view engine', 'html');
	app.register('.html', matador.engine); //allows .html extensions
	app.use(matador.cookieParser());
	app.use(matador.session({secret: 'boosh'})); //no need of it for this app, but here in case
	app.use(matador.favicon(__dirname + '/app/public/img/favicon.ico'));
	app.use(matador.bodyParser({uploadDir: __dirname + '/app/tmp'})); //put the temporary files into a specific folder for permission issues
	app.use(matador.methodOverride());
	app.use(matador.errorHandler({ dumpExceptions: true, showStack: true }));
});

//basic configuration of matador

app.configure('development', function () {
	app.use(matador.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
	app.use(matador.errorHandler());
});

app.prefetch();
app.mount();
app.listen(port);
console.log('matador running on port ' + port);
