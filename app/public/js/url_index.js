/*
	AJAX and client-side script
*/

window.addEvent('domready', function() {
	var input = $('url'),
		form = $('form'),
		body = $$('body'),
		input_place = $('input_place'),
		button = $$('input[type="submit"]'),
		regex_url = /^(https?|ftp|gopher|telnet|file|notes|ms-help):\/\/[A-Za-z0-9àáâãäåçèéêëìíîïðòóôõöùúûüýÿ][A-Za-z0-9\-\.àáâãäåçèéêëìíîïðòóôõöùúûüýÿ]+[A-Za-z0-9àáâãäåçèéêëìíîïðòóôõöùúûüýÿ]\.[A-Za-z]{2,}[\43-\176]*$/i;

	form.addEvent('submit', function(e) {
		e.stop(); //Stopping the submitting
		if(regex_url.test(input.value)) //Checking the validity of the input
		{
			var req = new Request({
				url: '/url/sent',
				onRequest: function() {
					button.set('value', 'Loading...');
				},
				onSuccess: function(txt){
					input_place.set('html', '');
					var p = new Element('p');
					var a = new Element('a', {
						'id': 'result_link',
						'href': '/url' +txt,
						text: txt
					});
					a.inject(p);
					p.inject(input_place);
				},
				onFailure: function(){
					input_place.set('text', 'The request failed.');
				},
				data: {
					'url': input.value
				}
			}).send();

			/*
				Request sent to the /sent page
			*/
		}
		else
		{
			/*
				Creates a div to tell the user their regex is not valid
			*/
			var div = new Element('div', {
				id: 'temp',
				'class': 'alert'
			});
			var a = new Element('a', {
				'class': 'close',
				'data-dismiss': 'alert',
				text: 'x'
			});
			div.set('class', 'alert-error');
			var strong = new Element('strong', {
				text: 'L\'url est invalide !'
			});
			a.inject(div);
			strong.inject(div);
			div.inject(input_place);
			setTimeout(function() {
				$('temp').destroy();
			}, 2000);

		}
	});
});
