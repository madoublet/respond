<?php

	/*********************************/
	/*  BASIC SETUP                  */
	/*********************************/

	// DB connection parameters
	define('DB_HOST', 'localhost');
	define('DB_NAME', 'respond');
	define('DB_USER', 'dbuser');
	define('DB_PASSWORD', 'dbpass');
	
	// APP URL
	define('APP_URL', 'http://app.myrespond.com');
	
	
	/************************************/
	/*  ADVANCED SETUP - LANGUAGES      */
	/************************************/
	
	// Setup default language for the site
	define('DEFAULT_LANGUAGE', 'en');
	
	// Setup the default text direction for the site (ltr, rtl, auto)
	define('DEFAULT_DIRECTION', 'ltr');
	
	
	/************************************/
	/*  ADVANCED SETUP - BRANDING       */
	/************************************/

	// Version
	define('VERSION', '5.2');

	// Brand name
	define('BRAND', 'Respond');
	
	// Location of custom css for your brand (e.g. css/custom.css)
	define('BRAND_CSS', '');
	
	// Brand logos (should be fully qualified (e.g. http://) to support emails, paypal)
	define('BRAND_LOGO', 'images/respond-icon.png');
	define('BRAND_ICON', 'images/respond-icon.png');
	
	// Copyright and default email
	define('COPY', 'Made by Matthew Smith in Manchester, MO');
	define('EMAIL', 'sample@adminemail.com');
	
	
	/************************************/
	/*  ADVANCED SETUP - MESSAGING      */
	/************************************/
	
	// Information on upgrading site to latest version
	define('UPDATE_LINK', 'https://github.com/madoublet/respond/blob/master/README.md');
	
	// System message (shown at login if not blank)
	define('SYSTEM_MESSAGE', '');
	
	// A link to direct trial accounts where to subscribe
	define('SUBSCRIBE_LINK', '');
	
	// Information on upgrading site to latest version
	define('TRIAL_MESSAGE', 'Thank you for trying Respond. Click to subscribe!');
	
	
	/************************************/
	/*  ADVANCED SETUP - URLS           */
	/************************************/
	
	// URLs
	define('API_URL', APP_URL.'/api');
	define('SITES_URL', APP_URL.'/sites');
	define('SITE_URL', APP_URL.'/sites/{{friendlyId}}');
	define('LOGIN_URL', APP_URL.'/#/login/{{friendlyId}}');
	define('TERMS_URL', 'http://myrespond.com/page/terms-of-service');
	define('PRICING_URL', 'http://myrespond.com/page/terms-of-service');
	
	// Webhooks URL
	define('WEBHOOKS_URL', '');

	// Default URL mode for the application (#, html5)
	define('URL_MODE', '#');
	
	// Image prefix (the protocol to use for accessing images, prefixes the domain name)
	define('IMAGE_PREFIX', 'http://');
	
	
	/************************************/
	/*  ADVANCED SETUP - CREATE         */
	/************************************/
	
	// Default the name on create
	define('DEFAULT_NAME_ON_CREATE', true);
	
	// Determines whether the user can change the default language while creating the site
	define('CHANGE_DEFAULT_LANGUAGE', false);
	
	
	/************************************/
	/*  ADVANCED SETUP - PASSCODE/KEYS  */
	/************************************/
	
	// Passcode
	define('PASSCODE', 'iloverespond');
	
	// JWT key
	define('JWT_KEY', 'iloverespond');
		
	
	/************************************/
	/*  ADVANCED SETUP - ACCOUNTS       */
	/************************************/
	
	// Default account status (Trial for subscription based sites, or Active for non-subscription based sites)
	define('DEFAULT_STATUS', 'Active');
	
	// Default plan (Typically Trial or blank for non-subscription based sites)
	define('DEFAULT_PLAN', '');	
	
	// Default user limit
	define('DEFAULT_USER_LIMIT', 5);
	
	// default file limit (in MBs)
	define('DEFAULT_FILE_LIMIT', 250);
	
	/************************************/
	/*  ADVANCED SETUP - CORS           */
	/************************************/
	
	// Cross Origin Resource Sharing (CORS)
	define ('CORS', serialize (array (
	    'http://sites.myrespond.com'
	    )));
	    
	/************************************/
	/*  ADVANCED SETUP - EMAIL          */
	/************************************/
	    
	// Advanced SMTP settings (see https://github.com/Synchro/PHPMailer)
	define('IS_SMTP', false);
	define('SMTP_HOST', 'smtp.mailserver.com');
	define('SMTP_AUTH', true);
	define('SMTP_USERNAME', '');
	define('SMTP_PASSWORD', '');
	define('SMTP_SECURE', 'tls');
	
	// Key used to encrypt site SMTP passwords
	define('SMTPENC_KEY', 'iloverespond');
	    
    // Set the From: address and name for outgoing emails
	define('EMAILS_FROM', '');
	define('EMAILS_FROM_NAME', '');
	
	// Welcome email
	define('SEND_WELCOME_EMAIL', true);
	define('WELCOME_EMAIL_SUBJECT', 'Respond: Welcome to Respond!');
	define('WELCOME_EMAIL_FILE', '../emails/new-user.html');
	
	// Site emails
	define('SITE_RECEIPT_EMAIL_SUBJECT', '[{{site}}] Receipt for your purchase (Transaction #: {{transactionId}})');
	
	
	/************************************/
	/*  ADVANCED SETUP - START PAGE     */
	/************************************/
	
    // Start page (sets the default page (route state) a user sees after logon)
	define('START_PAGE', 'app.pages');
	
	
	/************************************/
	/*  ADVANCED SETUP - THEMES         */
	/************************************/
	
	// Set the default theme (directory name: themes/simple => simple)
	define('DEFAULT_THEME', 'simple');
	define('THEMES_FOLDER', 'themes');
	
	
	/************************************/
	/*  ADVANCED SETUP - FILES          */
	/************************************/
	
	// Allowed filetypes (NOTE: gif, png, jpg, and svg are enabled by default)
	define('ALLOWED_FILETYPES', 'ico, css, js, pdf, doc, docx, zip');
	
	// Advanced configurations
	define('IMAGE_AUTO_RESIZE', true);
	define('IMAGE_MAX_WIDTH', 1024);
	define('IMAGE_MAX_HEIGHT', 768);
	
	// Thumb width and height
	define('THUMB_MAX_WIDTH', 400);
	define('THUMB_MAX_HEIGHT', 400);
	
	// Set default as UTC
	date_default_timezone_set('UTC');
	
	
	/************************************/
	/*  DEBUGGING                       */
	/************************************/
    
    // Debugging
	define('DEBUG', true);

	if(DEBUG){
		error_reporting(E_ALL);
		ini_set('display_errors', '1');
	}
	
?>