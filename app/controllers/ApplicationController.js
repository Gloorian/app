module.exports = function (app, config) {
	return app.controllers.Base.extend();
};
//Application controller, extends the base controller. Request filtering would be put here if needed (in case there's a need for logging)
