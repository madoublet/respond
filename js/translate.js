$.getScript("getjsstrings.php", function(){});

function t(text) {
	return (i18njsstrings[text]==undefined ? text : i18njsstrings[text]);
}