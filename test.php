<?php	
	include 'app.php'; // import php files
?>
<!DOCTYPE html>
<html>

<head>
	
<title>Test Installation&mdash;<?php print BRAND; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- include styles -->
<link href="<?php print FONT; ?>" rel="stylesheet" type="text/css">
<link href="<?php print BOOTSTRAP_CSS; ?>" rel="stylesheet">
<link href="<?php print FONTAWESOME_CSS; ?>" rel="stylesheet">
<link type="text/css" href="css/app.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/messages.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/login.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body id="test-page">

<p id="message">
  <span></span>
  <a class="close" href="#"></a>
</p>
	
<!-- begin content -->
<div class="content">

	<h1><span class="brand"><?php print BRAND; ?></span></h1>

	<div>
	
    <p>
        Below are some tests to help troubleshoot common problems with your installation.
    </p>
    
    <p>
    	<i class="fa fa-check-circle"></i> = success and <i class="fa fa-times-circle"></i> = faliure.
    </p>
    
        <table class="test pdo">
        
            <tr class="pdo">
                <td class="test">PDO Enabled</td>
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
                <td class="test">Sites Directory is Writeable</td>
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
                <td class="test">GD Library is installed</td>
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
                <td class="test">PHP Version is greater than 5.3</td>
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
                <td class="test">Database connection works</td>
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
                <td class="test">CURL enabled</td>
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
                <td class="test">APP_URL is set in app.php</td>
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
                <td class="test">MOD_REWRITE is working</td>
                <td class="result">
<?php 
    $url =  APP_URL.'/create';

	// mod_rewrite flag
	$mr = false;
	$title = 'MOD_REWRITE is not working';
	
    // test for mod_rewrite
    $mr = in_array('mod_rewrite', apache_get_modules());
    
    if($mr == true){ // mod_php test
	    $title = 'MOD_REWRITE working via mod_php';
    }
    else{ // CGI test
	    if(strpos(shell_exec('/usr/local/apache/bin/apachectl -l'), 'mod_rewrite') !== false){
		    $mr = true;
		    $title = 'MOD_REWRITE working via CGI';
	    }
    }
    
    
    if($mr == true) {
        print '<i title="'.$title.'" class="fa fa-check-circle"></i>';
    }
    else{
        print '<i title="MOD_REWRITE not working" class="fa fa-times-circle"></i>';
    }
?>
                </td>
            </tr>
            <!-- /.mod-rewrite -->
            
            <tr class="api">
                <td class="test">API is working</td>
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
            
             <tr class="magic-quotes">
                <td class="test">Magic Quotes not automatically Escaping</td>
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
        For help troubleshooting your installation, visit:
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