<?php 
	include 'app.php';
	
	$arr = Array(false => 'false', true => 'true');
	$plans = unserialize(SUBSCRIPTION_PLANS);
	
	
	
	header("content-type: application/javascript"); 
	
	?>
angular.module('respond.setup', [])
.constant('Setup', {
	debug: 				<?php print $arr[DEBUG]; ?>,
	
	// urls where your app (url), api and sites folder are publicly available
	url: 				'<?php print APP_URL; ?>',
	api: 				'<?php print API_URL; ?>',
	site:				'<?php print SITE_URL; ?>',
	terms:				'<?php print TERMS_URL; ?>',
	
	// default theme
	themeId: 			'<?php print DEFAULT_THEME; ?>',
	
	// branding
	logo: 				'<?php print BRAND_LOGO; ?>',
	icon: 				'<?php print BRAND_ICON; ?>',
	brand: 				'<?php print BRAND; ?>',
	
	// default lanugage
	language: 			'<?php print DEFAULT_LANGUAGE; ?>',

	// public keys
	stripePubKey:		'<?php print STRIPE_PUBLISHABLE_KEY; ?>',
	paypalEmail:		'<?php print PAYPAL_EMAIL; ?>',
	paypalUseSandbox:	<?php print $arr[PAYPAL_USE_SANDBOX]; ?>,
	paypalCurrency:		'<?php print PAYPAL_CURRENCY; ?>',
	paypalLogo:			'<?php print PAYPAL_LOGO; ?>',
	
	// pascode used by create (must match value set in API)
	passcode: 			'<?php print PASSCODE; ?>',
	
	// app branding
	app:				'<?php print BRAND; ?>',
	version:			'<?php print VERSION; ?>',
	copy: 				'<?php print COPY; ?>',
	email:				'<?php print EMAIL; ?>',
	
	//links
	pricingLink:		'<?php print PRICING_URL; ?>',
	
	// plans
	plans: 				<?php print json_encode($plans); ?>,
	
	// themes 
	themes:				'<?php print THEMES_FOLDER; ?>'
	
});