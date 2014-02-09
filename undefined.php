<?php	
	include 'app.php';
	
	// set language to preferred language (HTTP_ACCEPT_LANGUAGE)
	$supported = Utilities::GetSupportedLanguages('');
	$language = Utilities::GetPreferredLanguage($supported);

	Utilities::SetLanguage($language); 
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $language) ?>">

<head>
	
<title><?php print _("Error"); ?>&mdash;<?php print BRAND; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include styles -->
<?php include 'modules/css.php'; ?>
<link type="text/css" href="css/login.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body>

<!-- begin content -->
<div class="content">

    <h1><span class="brand"><?php print BRAND; ?></span></h1>
	<div><img alt="<?php print _("Error"); ?>" src="images/error404.png">
	<p><?php print _("There seems to be some error accessing the database or configuration files.");?><br>
	<?php print _("Please review the installation steps and the test configuration screen.");?></p>
	</div>
    <small><?php print COPY; ?></small>

</div>
<!-- /.content -->

</body>

<!-- include js -->
<?php include 'modules/js.php'; ?>
<script type="text/javascript" src="js/viewModels/indexModel.js?v=<?php print VERSION; ?>"></script>

</html>