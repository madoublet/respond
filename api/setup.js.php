<?php 

	// include setup
    if(file_exists('../setup.local.php')){
    	include '../setup.local.php';
    }
    else{
    	include '../setup.php';
    }
	
	$arr = Array(false => 'false', true => 'true');
	
	// get system message
	$system_message = '';
	
	if(defined('SYSTEM_MESSAGE')){
		$system_message = SYSTEM_MESSAGE;
	}
	
	// hide/show passcode
	$showPasscode = true;
	
	if(PASSCODE == ''){
		$showPasscode = false;
	}
	
	header("content-type: application/javascript"); 
	
	?>
angular.module('respond.setup', [])
.constant('Setup', {
	debug: 					<?php print $arr[DEBUG]; ?>,
	
	// urls where your app (url), api and sites folder are publicly available
	url: 					'<?php print APP_URL; ?>',
	login:					'<?php print LOGIN_URL; ?>',
	api: 					'<?php print API_URL; ?>',
	sites:					'<?php print SITES_URL; ?>',
	site:					'<?php print SITE_URL; ?>',
	terms:					'<?php print TERMS_URL; ?>',
	
	// default theme
	themeId: 				'<?php print DEFAULT_THEME; ?>',
	
	// branding
	logo: 					'<?php print BRAND_LOGO; ?>',
	icon: 					'<?php print BRAND_ICON; ?>',
	brand: 					'<?php print BRAND; ?>',
	css:					'<?php print BRAND_CSS; ?>',
	
	// defaults
	language: 				'<?php print DEFAULT_LANGUAGE; ?>',
	direction: 				'<?php print DEFAULT_DIRECTION; ?>',
	changeDefaultLanguage:	<?php print $arr[CHANGE_DEFAULT_LANGUAGE]; ?>, 
	defaultNameOnCreate:	<?php print $arr[DEFAULT_NAME_ON_CREATE]; ?>, 
	
	// app branding
	app:					'<?php print BRAND; ?>',
	version:				'<?php print VERSION; ?>',
	updateLink:				'<?php print UPDATE_LINK; ?>',
	copy: 					'<?php print COPY; ?>',
	email:					'<?php print EMAIL; ?>',
	updateLink:				'<?php print SUBSCRIBE_LINK; ?>',
	subscribeLink:			'<?php print SUBSCRIBE_LINK; ?>',
	trialMessage:			'<?php print TRIAL_MESSAGE; ?>',
	
	// themes 
	themes:					'<?php print THEMES_FOLDER; ?>',
	
	// app
	systemMessage:			'<?php print $system_message; ?>',
	urlMode:			 	'<?php print URL_MODE; ?>',
	
	// show passcode
	showPasscode: 			<?php print $arr[$showPasscode]; ?>
	
});