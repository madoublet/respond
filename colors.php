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

<body data-currpage="colors">
	
<?php include 'modules/menu.php'; ?>

<!-- messages -->
<input id="msg-loading" value="<?php print _("Loading..."); ?>" type="hidden">
<input id="msg-updating" value="<?php print _("Updating..."); ?>" type="hidden">
<input id="msg-updated" value="<?php print _("Styles updated successfully"); ?>" type="hidden">
<input id="msg-updating-error" value="<?php print _("There was a problem saving the style file, please try again"); ?>" type="hidden">

<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
        
		<div class="fs-container full">
    
			<div class="fs">
			
			</div>
			<!-- /.fs -->
        
        </div>
        <!-- /.fs-container -->
		
    </nav>
	<div class='container'>
		<div class='row'>
			<div class='col-md-12'>
				<h1>Theme color chooser</h1>
				<p>Use the list below to update the color definitions that are used for the theme of this site. For example, if under the global heading there is a line that lists <em>image-border-color</em> and <em>black</em>, but you want the borders around images to instead be green, either type that in the input field, or use the color picker to find the exact color that you want. Then simply click save. The theme for your site will immediately be updated and published.</p>
				<div id='variable-def' ></div>
			</div>
		</div>
	</div>

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