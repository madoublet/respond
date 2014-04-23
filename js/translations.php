<?php 
	include '../app.php'; // import php files
	$language = '';
	if(session_id() == '') {
		$authUser = new AuthUser(false); // get auth user
		$authUser->Authenticate('All');
		$language = isset($authUser->Language) ? $authUser->Language : '';
	}
	if ($language=='') {
		// set language to preferred language (HTTP_ACCEPT_LANGUAGE)
		$supported = Utilities::GetSupportedLanguages('');
		$language = Utilities::GetPreferredLanguage($supported);
	}
	Utilities::SetLanguage($language); // set language
	
	header('Content-type: text/javascript');
?>
var i18njsstrings = {
	'bold_text':"<?php echo _("Bold Text (select text first)"); ?>",
	'italic_text':"<?php echo _("Italicize Text (select text first)"); ?>",
	'strike_text':"<?php echo _("Strike Text (select text first)"); ?>",
	'subscript_text':"<?php echo _("Subscript Text (select text first)"); ?>",
	'superscript_text':"<?php echo _("Superscript Text (select text first)"); ?>",
	'underline_text':"<?php echo _("Underline Text (select text first)"); ?>",
	'align-left_text':"<?php echo _("Align text to the left"); ?>",
	'align-center_text':"<?php echo _("Align text to the center"); ?>",
	'align-right_text':"<?php echo _("Align text to the right"); ?>",
	'addLink':"<?php echo _("Add Link (select text first)"); ?>",
	'addBr':"<?php echo _("Add <br> (place cursor before text to break)"); ?>",
	'addCode':"<?php echo _("Add Code"); ?>",
	'iconfa':"<?php echo _("Add Font Awesome icon"); ?>",
	'addHeadline':"<?php echo _("Add Headline"); ?>",
	'addParagraph':"<?php echo _("Add a Paragraph"); ?>",
	'addquote':"<?php echo _("Add Block Quote"); ?>",
	'addlist':"<?php echo _("Add a List"); ?>",
	'addtable':"<?php echo _("Add Table"); ?>",
	'addhr':"<?php echo _("Add a Horizontal Rule"); ?>",
	'addimg':"<?php echo _("Add an Image"); ?>",
	'addslideshow':"<?php echo _("Add a Slideshow"); ?>",
	'addmap':"<?php echo _("Add a Map"); ?>",
	'addtwitter':"<?php echo _("Add your Twitter&reg; feed"); ?>",
	'addfacebook':"<?php echo _("Add Facebook&reg; Like button"); ?>",
	'fa-comments':"<?php echo _("Add Facebook&reg; comments"); ?>",
	'youtube':"<?php echo _("Add a video"); ?>",
	'list_pages':"<?php echo _("Add a list of pages"); ?>",
	'featured':"<?php echo _("Add Featured Content"); ?>",
	'addFile':"<?php echo _("Add a File"); ?>",
	'addSKUs':"<?php echo _("Add SKUs"); ?>",
	'addForm':"<?php echo _("Add a Form"); ?>",
	'addhtml':"<?php echo _("Add HTML"); ?>", 
	'addSyntax':"<?php echo _("Add Code Block"); ?>",
	'plugins':"<?php echo _("Plugins"); ?>",
	'settings':"<?php echo _("Page Settings"); ?>",
	'preview':"<?php echo _("Preview"); ?>",
	'load':"<?php echo _("Load Existing Page"); ?>",
	'secure':"<?php echo _("Add a login or registration form"); ?>",
	'login':"<?php echo _("Login"); ?>",
	'registration':"<?php echo _("Registration"); ?>",
	'layout':"<?php echo _("Add New Columnar Layout"); ?>",
	'cols55':"<?php echo _("Add a 50/50 Column Layout"); ?>",
	'cols100':"<?php echo _("Add a Full Column Layout"); ?>",
	'cols73':"<?php echo _("Add a 70/30 Column Layout"); ?>",
	'cols37':"<?php echo _("Add a 30/70 Column Layout"); ?>",
	'cols333':"<?php echo _("Add a 33/33/33 Column Layout"); ?>",
	'cols425':"<?php echo _("Add a 25/25/25/25 Column Layout"); ?>"
}

function t(text) {
	return (i18njsstrings[text]==undefined ? text : i18njsstrings[text]);
}