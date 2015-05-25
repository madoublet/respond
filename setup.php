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
	define('VERSION', '4.9');

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
	
	// Information on upgrading site to latest versino
	define('UPDATE_LINK', 'https://github.com/madoublet/respond/blob/master/README.md');
	
	// system message (shown at login if not blank)
	define('SYSTEM_MESSAGE', '');
	
	
	/************************************/
	/*  ADVANCED SETUP - AMAZON S3      */
	/************************************/
	
	// Enables copying site to S3 for deployment
	define('ENABLE_S3_DEPLOYMENT', false);
	
	// Stores all uploaded files on S3
	define('FILES_ON_S3', false);
	
	// Default bucket
	define('BUCKET_NAME', 'yourdomain.com');
	define('S3_LOCATION', 'us-east-1');
	define('S3_URL', 'http://{{bucket}}.s3-website-us-east-1.amazonaws.com/{{site}}');
	define('S3_KEY', 'AWS ACCESS KEY');
	define('S3_SECRET', 'AWS SECRET KEY');
	
	
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
	/*  ADVANCED SETUP - PAYPAL         */
	/************************************/
	
	// Paypal
	define('PAYPAL_EMAIL', '');
	define('PAYPAL_USE_SANDBOX', false);
	define('PAYPAL_CURRENCY', 'USD');
	define('PAYPAL_LOGO', '/images/respond-icon.png');
	
	
	/************************************/
	/*  ADVANCED SETUP - STRIPE         */
	/************************************/
	
	// Stripe keys
	define('STRIPE_SECRET_KEY', '');
	define('STRIPE_PUBLISHABLE_KEY', '');
	
	
	/************************************/
	/*  ADVANCED SETUP - ACCOUNTS       */
	/************************************/
	
	// Default account status (Trial for subscription based sites, or Active for non-subscription based sites)
	define('DEFAULT_STATUS', 'Trial');
	
	// Default plan (Typically Trial or blank for non-subscription based sites)
	define('DEFAULT_PLAN', 'Trial');
	
	// Trial length
	define('TRIAL_LENGTH', 30);
	
	// Disable after trial
	define('DISABLE_AFTER_TRIAL', true);
	
	// Default user limit
	define('DEFAULT_USER_LIMIT', 1);
	
	// default file limit (in MBs)
	define('DEFAULT_FILE_LIMIT', 100);
	
	
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
	    
    // Set what emails should be sent out and a reply-to email address
	define('REPLY_TO', '');
	define('REPLY_TO_NAME', '');
	
	// Welcome email
	define('SEND_WELCOME_EMAIL', true);
	define('WELCOME_EMAIL_SUBJECT', 'Respond: Welcome to Respond!');
	define('WELCOME_EMAIL_FILE', '../emails/new-user.html');
	
	// New subscription email (to user)
	define('NEW_SUBSCRIPTION_EMAIL', true);
	define('NEW_SUBSCRIPTION_EMAIL_SUBJECT', 'Respond: Thank you for subscribing!');
	define('NEW_SUBSCRIPTION_EMAIL_FILE', '../emails/subscribe-success.html');
	
	// New subscriber email (to admin)
	define('NEW_SUBSCRIBER_EMAIL', true);
	define('NEW_SUBSCRIBER_EMAIL_SUBJECT', 'Respond: We have a new subscriber!');
	define('NEW_SUBSCRIBER_EMAIL_FILE', '../emails/subscribe-details.html');
	
	// Site emails
	define('SITE_RECEIPT_EMAIL_SUBJECT', '[{{site}}] Receipt for your purchase (Transaction #: {{transactionId}})');
	define('SITE_WELCOME_EMAIL_SUBJECT', 'Welcome to {{site}}');
	
	
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
	
?>