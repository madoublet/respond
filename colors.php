<?php	
	include 'app.php'; // import php files

	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('Admin');
	
	Utilities::SetLanguage($authUser->Language); // set language
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $authUser->Language) ?>">

<head>
	
<title><?php print _("Color Configuration"); ?>&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include css -->
<?php include 'modules/css.php'; ?>
<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/spectrum/1.3.0/css/spectrum.css" />

</head>

<body id="colors-page" data-currpage="colors">
	
<?php include 'modules/menu.php'; ?>

<!-- messages -->
<input id="msg-loading" value="<?php print _("Loading..."); ?>" type="hidden">
<input id="msg-updating" value="<?php print _("Updating..."); ?>" type="hidden">
<input id="msg-updated" value="<?php print _("Styles updated successfully"); ?>" type="hidden">
<input id="msg-updating-error" value="<?php print _("There was a problem saving the style file, please try again"); ?>" type="hidden">

<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
        
		 <ul>
		    <li class="static"><a href="branding"><?php print _("Branding"); ?></a></li>
		    <li class="static active"><a href="colors"><?php print _("Colors"); ?></a></li>
        </ul>
		
    </nav>
	
	<p data-bind="visible: filesLoading()" class="list-loading"><i class="fa fa-spinner fa-spin"></i> <?php print _("Loading..."); ?></p>
	
	<p data-bind="css: {'hidden': (showInstructions()==false)}" class="hidden list-instructions"><?php print _("No color variables (e.g. @background-color: #888;) available for your themes.  Learn m"); ?></p>

	<form class="form-vertical">
		<div id="variable-def"></div>
	</form>

    <div class="actions">
        <button class="primary-button" data-bind="click: save"><?php print _("Save"); ?></button>
    </div>
</section>
<!-- /.main -->

</body>

<!-- include js -->
<?php include 'modules/js.php'; ?>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/spectrum/1.3.0/js/spectrum.min.js"></script>
<script type="text/javascript" src="js/viewModels/colorsModel.js?v=<?php print VERSION; ?>"></script>

</html>