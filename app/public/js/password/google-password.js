(
	function()
	{
		/* Machin à virer plus tard */
		String.prototype.format = function()
		{
			var formatted = this;
			for (i in arguments)
			{
				var regexp = new RegExp('\\{'+i+'\\}', 'gi');
				formatted = formatted.replace(regexp, arguments[i]);
			}
			return formatted;
		};

		/* On identifie les différents éléments de la page avec lesquels on va jouer */
		var elements = {
			"title": document.querySelector('title'),
			"button": document.querySelector('button[name="generate"]'),
			"field_uri": document.querySelector('input[name="uri"]'),
			"field_mainpassword": document.querySelector('input[type="password"][name="original-password"]'),
			"field_mainpasswordconfirmation": document.querySelector('input[type="password"][name="original-password-confirm"]'),
			"inputGenerate": document.querySelector('input[type="text"][name="generated-password"]'),
			"checkBox_hide": document.querySelector('input[type="checkbox"][name="hide"]')
		}

		elements.button.addEventListener
		(
			"click",
			function (event)
			{
				if ((elements.field_mainpasswordconfirmation.value.length === 0) || (elements.field_mainpassword.value === elements.field_mainpasswordconfirmation.value))
				{
					elements.inputGenerate.value = Generate();
					elements.inputGenerate.className = "success";

					/* Sélection automatique du mot de passe */
					elements.inputGenerate.focus();
					elements.inputGenerate.selectionStart = 0;
					elements.inputGenerate.selectionEnd = elements.inputGenerate.value.length;
					
					elements.field_mainpasswordconfirmation.removeAttribute('class');
				}
				else
				{
					elements.field_mainpasswordconfirmation.setAttribute('class', 'error');
					elements.field_mainpasswordconfirmation.focus();
				}
			},
			false
		);

		elements.checkBox_hide.addEventListener
		(
			"click",
			function (event)
			{
				if (event.target.checked === true)
				{
					event.target.parentNode.setAttribute("class", "checked");
					document.cookie = "hide=true";
				}
				else
				{
					event.target.parentNode.removeAttribute("class");
					document.cookie = "hide=false";
				}
			},
			false
		);
		
		elements.field_mainpasswordconfirmation.addEventListener("input", function() {
			if ((elements.field_mainpasswordconfirmation.value.length === 0) || (elements.field_mainpassword.value === elements.field_mainpasswordconfirmation.value))
			{
				elements.field_mainpasswordconfirmation.removeAttribute('class');
			}
			else
			{
				elements.field_mainpasswordconfirmation.setAttribute('class', 'error');
			}
		}, false);
	}
)();

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-26813683-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();