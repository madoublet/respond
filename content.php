<?php 
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('All');
	
	Utilities::SetLanguage($authUser->Language); // set language
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $authUser->Language) ?>">

<head>
  
<title><?php print _("Content"); ?> - <?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- css -->
<?php include 'modules/css.php'; ?>
<link type="text/css" href="css/content.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/editor.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/dialog.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/list.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/prettify.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/dropzone.css?v=<?php print VERSION; ?>" rel="stylesheet">

<!-- head -->
<script src="js/helper/head.min.js"></script>

</head>

<body data-currpage="content" data-domain="<?php print $authUser->Domain; ?>" data-appurl="<?php print APP_URL; ?>" data-timezone="<?php print $authUser->TimeZone; ?>" data-offset="<?php print $authUser->Offset(); ?>">

<?php include 'modules/menu.php'; ?>

<!-- messages -->
<input id="msg-saving" value="<?php print _("Saving..."); ?>" type="hidden">
<input id="msg-saved" value="<?php print _("Content successfully saved"); ?>" type="hidden">
<input id="msg-saving-error" value="<?php print _("There was a problem saving content, please try again"); ?>" type="hidden">
<input id="msg-draft-saving" value="<?php print _("Saving..."); ?>" type="hidden">
<input id="msg-draft-saved" value="<?php print _("Draft successfully saved"); ?>" type="hidden">
<input id="msg-draft-error" value="<?php print _("There was a problem saving the draft, please try again"); ?>" type="hidden">
<input id="msg-settings-saving" value="<?php print _("Saving..."); ?>" type="hidden">
<input id="msg-settings-saved" value="<?php print _("Settings successfully saved"); ?>" type="hidden">
<input id="msg-settings-error" value="<?php print _("There was a problem saving settings, please try again"); ?>" type="hidden">
<input id="msg-draft-saved-preview" value="<?php print _("Draft saved, launching preview"); ?>" type="hidden">

<section class="main">

	<div id="editor-menu"></div>
	<!-- /#editor-menu -->
 
    <div id="editor-container">
        <div id="desc" class="container" data-bind="html: content"></div>
    </div>
    <!-- /#editor-container -->
    
    <div id="actions">
    
    	<!-- ko with:page -->
    
        <button class="primary-button" type="button" data-bind="click: $parent.saveContent, visible: canPublish"><?php print _("Save and Publish"); ?></button>
        <button class="secondary-button" type="button" data-bind="click: $parent.saveDraft, visible: canEdit"><?php print _("Save Draft"); ?></button>
        
        <button class="tertiary-button offset-left" type="button" onclick="javascript:history.back()"><i class="fa fa-reply"></i> <?php print _("Return"); ?></button>
    
		<!-- /ko -->
    
		<div class="alternate">
			<a class="live" data-bind="attr:{'href':fullUrl}" target="_blank"><?php print _("Live"); ?></a><a class="preview" data-bind="click:preview" target="_blank"><?php print _("Preview"); ?></a>
		</div>
    </div>
    <!-- /#actions -->
    
</section>
<!-- /.main -->

<p id="contentLoading" data-bind="visible: contentLoading()" class="inline-status"><i class="fa fa-spinner fa-spin"></i> <?php print _("Loading content..."); ?></p>

<div id="previewMessage">
<?php if($authUser->Role=='Admin'){ ?>
  <button class="tertiary-button" data-bind="click: saveContent"><?php print _("Save Content"); ?></button>
<?php } ?>
  <button class="tertiary-button" data-bind="click: hidePreview"><i class="fa fa-reply"></i> <?php print _("Return to Editor"); ?></button>
</div>

<div id="previewContainer">
  <iframe id="preview" src=""></iframe>
</div>  
  
<div id="overlay"></div>  

<?php include 'modules/dialogs/imagesDialog.php'; ?>

<?php include 'modules/dialogs/slideshowDialog.php'; ?>

<?php include 'modules/dialogs/elementConfigDialog.php'; ?>

<?php include 'modules/dialogs/blockConfigDialog.php'; ?>

<?php include 'modules/dialogs/formDialog.php'; ?>

<?php include 'modules/dialogs/secureDialog.php'; ?>

<?php include 'modules/dialogs/fieldDialog.php'; ?>

<?php include 'modules/dialogs/skuDialog.php'; ?>

<?php include 'modules/dialogs/listDialog.php'; ?>

<?php include 'modules/dialogs/linkDialog.php'; ?>

<?php include 'modules/dialogs/featuredDialog.php'; ?>

<?php include 'modules/dialogs/pluginsDialog.php'; ?>

<?php include 'modules/dialogs/configPluginsDialog.php'; ?>

<?php include 'modules/dialogs/pageSettingsDialog.php'; ?>

<?php include 'modules/dialogs/htmlDialog.php'; ?>

<?php include 'modules/dialogs/codeBlockDialog.php'; ?>

<?php include 'modules/dialogs/filesDialog.php'; ?>

<?php include 'modules/dialogs/fontAwesomeDialog.php'; ?>

<?php include 'modules/dialogs/layoutDialog.php'; ?>

<?php include 'modules/dialogs/loadLayoutDialog.php'; ?>

<div id='aviary-modal'></div>

<div id="overlay"></div>

</body>

<!-- js -->
<?php include 'modules/js.php'; ?>

<script type="text/javascript" src="js/helper/flipsnap.min.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/helper/prettify.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/helper/dropzone.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/helper/beautify-html.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="http://feather.aviary.com/js/feather.js"></script>

<?php if(GOOGLE_MAPS_API_KEY != '' && GOOGLE_MAPS_API_KEY != 'YOUR GOOGLE MAPS API KEY'){ ?>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=<?php print GOOGLE_MAPS_API_KEY; ?>&sensor=false"></script>
<?php } ?>

<!-- plugins -->
<script type="text/javascript" src="js/plugins/jquery.paste.js?v=<?php print VERSION; ?>"></script>

<!-- respond.Editor -->
<script type="text/javascript" src="js/respond.Editor.js?v=<?php print VERSION; ?>"></script>

<!-- dialogs -->
<script type="text/javascript" src="js/dialogs/fontAwesomeDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/loadLayoutDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/pluginsDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/configPluginsDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/pageSettingsDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/codeBlockDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/htmlDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/imagesDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/filesDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/listDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/featuredDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/linkDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/fieldDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/formDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/secureDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/skuDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/slideshowDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/elementConfigDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/blockConfigDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/aviaryDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/layoutDialog.js?v=<?php print VERSION; ?>"></script>

<!-- page -->
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>" defer="defer"></script>
<script type="text/javascript" src="js/viewModels/contentModel.js?v=<?php print VERSION; ?>" defer="defer"></script>

</html>