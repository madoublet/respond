<?php

	// Version
	define('VERSION', '4.5');

	// Brand name
	define('BRAND', 'Respond');
	
	// Location of custom css for your brand (e.g. css/custom.css)
	define('BRAND_CSS', '');
	
	// Brand logos (should be fully qualified (e.g. http://) to support emails, paypal)
	define('BRAND_LOGO', '/images/respond-icon.png');
	define('BRAND_ICON', '/images/respond-icon.png');
	
	// Copyright and default email
	define('COPY', 'Made by Matthew Smith in Manchester, MO');
	define('EMAIL', 'sample@adminemail.com');

	// DB connection parameters
	define('DB_HOST', 'localhost');
	define('DB_NAME', 'respond');
	define('DB_USER', 'dbuser');
	define('DB_PASSWORD', 'dbpass');
	
	// Debugging
	define('DEBUG', true);

	if(DEBUG){
		error_reporting(E_ALL);
		ini_set('display_errors', '1');
	}
	
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
	
	// URLs
	define('APP_URL', 'http://app.myrespond.com');
	define('API_URL', 'http://app.myrespond.com/api');
	define('SITES_URL', 'http://app.myrespond.com/sites');
	define('SITE_URL', 'http://{{friendlyId}}.myrespond.com');
	define('TERMS_URL', 'http://myrespond.com/page/terms-of-service');
	define('PRICING_URL', 'http://myrespond.com/page/terms-of-service');
	
	// Webhooks URL
	define('WEBHOOKS_URL', '');

	// Default URL mode (hash, hashbang, html5, static)
	define('DEFAULT_URL_MODE', 'static');
	
	// Image prefix (the protocol to use for accessing images, prefixes the domain name)
	define('IMAGE_PREFIX', 'http://');

	// Locations of apps and sites
	define('APP_LOCATION', '../');
	define('SITES_LOCATION', '../sites');
	
	// Setup default language for the site
	define('DEFAULT_LANGUAGE', 'en');
	
	// Default the name on create
	define('DEFAULT_NAME_ON_CREATE', true);
	
	// Setup the default text direction for the site (ltr, rtl, auto)
	define('DEFAULT_DIRECTION', 'ltr');
	
	// Determines whether the user can change the default language while creating the site
	define('CHANGE_DEFAULT_LANGUAGE', false);
	
	// Passcode
	define('PASSCODE', 'iloverespond');
	
	// JWT key
	define('JWT_KEY', 'iloverespond');
	
	// Paypal
	define('PAYPAL_EMAIL', '');
	define('PAYPAL_USE_SANDBOX', false);
	define('PAYPAL_CURRENCY', 'USD');
	define('PAYPAL_LOGO', '/images/respond-icon.png');
	
	// Stripe keys
	define('STRIPE_SECRET_KEY', '');
	define('STRIPE_PUBLISHABLE_KEY', '');
	
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
	
	// Cross Origin Resource Sharing (CORS)
	define ('CORS', serialize (array (
	    'http://sites.myrespond.com'
	    )));
	    
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
	
    // Start page (sets the default page (route state) a user sees after logon)
	define('START_PAGE', 'app.pages');
	
	// Set the default theme (directory name: themes/simple => simple)
	define('DEFAULT_THEME', 'simple');
	define('THEMES_FOLDER', 'themes');
	
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