<?php	
	include 'app.php';
	
	$language = 'en';
	
	// test for gettext
	if (function_exists("gettext")){
	
		// set language to preferred language (HTTP_ACCEPT_LANGUAGE)
		$supported = Utilities::GetSupportedLanguages('');
		$language = Utilities::GetPreferredLanguage($supported);
		
		Utilities::SetLanguage($language);
	}
	else{
		
		// fallback for gettext
		function _($str){
			return $str;
		}
		
	}
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $language) ?>">

<head>
	
<title><?php print _("Test Installation"); ?>&mdash;<?php print BRAND; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include styles -->
<link href="<?php print FONT; ?>" rel="stylesheet" type="text/css">
<link href="<?php print BOOTSTRAP_CSS; ?>" rel="stylesheet">
<link href="<?php print FONTAWESOME_CSS; ?>" rel="stylesheet">
<link type="text/css" href="css/app.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/messages.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/login.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body id="test-page">

<!-- begin content -->
<div class="content">

	<h1><span class="brand"><?php print BRAND; ?></span></h1>

	<div>
	
    <p>
        <?php print _("Below are some tests to help troubleshoot common problems with your installation."); ?>
    </p>
    
    <p>
    	<i class="fa fa-check-circle"></i> = <?php print _("success"); ?> and <i class="fa fa-times-circle"></i> = <?php print _("failure"); ?>.
    </p>
    
        <table class="test pdo">
        
            <tr class="pdo">
                <td class="test"><?php print _("PDO Enabled"); ?></td>
                <td class="result">
<?php 
    if (class_exists('PDO')){
        print '<i title="PDO enabled" class="fa fa-check-circle"></i>';
    }
    else{
        print '<i title="PDO disabled" class="fa fa-times-circle"></i>';
    }
?>
                </td>
            </tr>
            <!-- /.pdo -->
            
            <tr class="dir">
                <td class="test"><?php print _("Sites Directory is Writeable"); ?></td>
                <td class="result">
<?php 
    if (is_writable('sites')){
        print '<i title="Directory is writeable" class="fa fa-check-circle"></i>';
    }
    else{
        print '<i title="Directory is not writeable" class="fa fa-times-circle"></i>';
    }
?>
                </td>
            </tr>
            <!-- /.dir -->
            
            <tr class="gd">
                <td class="test"><?php print _("GD Library is installed"); ?></td>
                <td class="result">
<?php 
    if (extension_loaded('gd') && function_exists('gd_info')) {
        print '<i title="GD library is installed" class="fa fa-check-circle"></i>';
    }
    else{
        print '<i title="GD library is not installed" class="fa fa-times-circle"></i>';
    }
?>
                </td>
            </tr>
            <!-- /.gd -->
            
            <tr class="version">
                <td class="test"><?php print _("PHP Version is greater than 5.3"); ?></td>
                <td class="result">
<?php 
    if (!defined('PHP_VERSION_ID')) {
        $version = explode('.', PHP_VERSION);
    
        define('PHP_VERSION_ID', ($version[0] * 10000 + $version[1] * 100 + $version[2]));
    }

    if (PHP_VERSION_ID > 50300) {
        print '<i title="Greater than 5.3" class="fa fa-check-circle"></i>';
    }
    else{
        print '<i title="Greater than 5.3" class="fa fa-times-circle"></i>';
    }
?>
                </td>
            </tr>
            <!-- /.version -->
            
            <tr class="db">
                <td class="test"><?php print _("Database connection works"); ?></td>
                <td class="result">
<?php 
    try{
            
        $db = DB::get();
        print '<i title="Database connection works" class="fa fa-check-circle"></i>';
    }
    catch(PDOException $e){
        print '<i title="Database not connected" class="fa fa-times-circle"></i>';
    }
?>
                </td>
            </tr>
            <!-- /.db -->
            
            <tr class="curl">
                <td class="test"><?php print _("CURL enabled"); ?></td>
                <td class="result">
<?php 
    if (function_exists('curl_version')) {
        print '<i title="Curl is installed" class="fa fa-check-circle"></i>';
    }
    else{
        print '<i title="Curl is not installed" class="fa fa-times-circle"></i>';
    }
?>
                </td>
            </tr>
            <!-- /.curl -->
            
            <tr class="app-url">
                <td class="test"><?php print _("APP_URL is set in app.php"); ?></td>
                <td class="result">
<?php 
    if (APP_URL != 'http://urloftheapp.com') {
        print '<i title="APP_URL is set" class="fa fa-check-circle"></i>';
    }
    else{
        print '<i title="APP_URL is set" class="fa fa-times-circle"></i>';
    }
?>
                </td>
            </tr>
            <!-- /.app-url -->
            
            <tr class="mod-rewrite">
                <td class="test"><?php print _("MOD_REWRITE is working"); ?></td>
                <td class="result">
                
<?php 
    $url =  APP_URL.'/create';

    $handle = curl_init($url);
    curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);
    
    /* Get the HTML or whatever is linked in $url. */
    $response = curl_exec($handle);
    
    /* Check for 200*/
    $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
    if($httpCode == 200) {
        print '<i title="MOD_REWRITE working" class="fa fa-check-circle"></i>';
    }
    else{
        print '<i title="MOD_REWRITE not working" class="fa fa-times-circle"></i>';
    }
?>
                </td>
            </tr>
            <!-- /.mod-rewrite -->
            
            <tr class="api">
                <td class="test"><?php print _("API is working"); ?></td>
                <td class="result">
<?php 
    $url =  APP_URL.'/api/site/test';

    $handle = curl_init($url);
    curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);
    
    /* Get the HTML or whatever is linked in $url. */
    $response = curl_exec($handle);
    
    /* Check for 200*/
    $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
    if($httpCode == 200 && $response=='API works!') {
        print '<i title="API working" class="fa fa-check-circle"></i>';
    }
    else{
        print '<i title="API not working" class="fa fa-times-circle"></i>';
    }
?>
                </td>
            </tr>
            <!-- /.api -->
            
            <tr class="api">
                <td class="test"><?php print _("Gettext is installed"); ?></td>
                <td class="result">
<?php
if (function_exists("gettext")){
    print '<i title="Gettext is working" class="fa fa-check-circle"></i>';
}
else{
    print '<i title="Gettext is not working" class="fa fa-times-circle"></i>';
}
?>       		</td>
            </tr>
            <!-- /.gettext -->     
            
             <tr class="magic-quotes">
                <td class="test"><?php print _("Magic Quotes not automatically Escaping"); ?></td>
                <td class="result">
<?php 

	// #ref: http://stackoverflow.com/questions/5801951/does-php-auto-escapes-quotes-in-string-which-is-passed-by-get-or-post
    if (get_magic_quotes_gpc() === 1) {
        print '<i title="Magic Quotes Enabled" class="fa fa-times-circle"></i>';
    }
    else{
        print '<i title="Magic Quotes Enabled" class="fa fa-check-circle"></i>';
    }
?>
                </td>
            </tr>
            <!-- /.magic-quotes -->
            
        </table>
        
        <p>
        <?php print _("For help troubleshooting your installation, visit:"); ?>
        <a href="http://respondcms.com/documentation/troubleshooting-installation">respondcms.com/documentation/troubleshooting-installation</a>
        </p>
    
	</div>
	
	 <small><?php print COPY; ?></small>

</div>
<!-- /.content -->

</body>

<!-- include js -->
<script type="text/javascript" src="<?php print JQUERY_JS; ?>"></script>
<script type="text/javascript" src="<?php print JQUERYUI_JS; ?>"></script>
<script type="text/javascript" src="<?php print BOOTSTRAP_JS; ?>"></script>
<script type="text/javascript" src="<?php print KNOCKOUT_JS; ?>"></script>
<script type="text/javascript" src="js/helper/moment.min.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/global.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/messages.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/createModel.js?v=<?php print VERSION; ?>"></script>

</html>