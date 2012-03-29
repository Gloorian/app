/*
    This function returns a random string and before, check wether it has already been taken or not
*/

exports.reduct = function genHash(model, callback){

    // Simple random number generator helper
    var randomRange = function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    var redir = "";
    for (var i = 0; i < 2; i++){
        var digit;
        if (randomRange(0,1) === 0){
           digit = String(randomRange(0,9));
        }else{
           digit = String.fromCharCode(randomRange(97,122));
        }
        redir = redir + digit;
    }
    /*
        Checking in the db. It's a recursive function
    */
	model.get_redir_exist_async(redir, function(results){
		if (results.length > 0){
			require(__dirname + '/../config/function').reduct(model, callback);
		}else{
			callback(redir);
			return redir;
		}
	});
};

//function to create a random string and check wether it already exists or not. It's in a separated file because it's reused by many controllers
