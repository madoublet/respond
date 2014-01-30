<?php	
	include 'app.php'; // import php files

	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('Admin');
	
	Utilities::SetLanguage($authUser->Language); // set language
?>
<!DOCTYPE html>
<html>

<head>
	
<title><?php print _("Themes"); ?>&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">

<!-- include css -->
<link href="<?php print FONT; ?>" rel="stylesheet" type="text/css">
<link href="<?php print BOOTSTRAP_CSS; ?>" rel="stylesheet">
<link href="<?php print FONTAWESOME_CSS; ?>" rel="stylesheet">
<link type="text/css" href="css/app.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/messages.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/list.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body data-currpage="theme">

<?php include 'modules/menu.php'; ?>

<!-- messages -->
<input id="msg-resetting" value="<?php print _("Resetting..."); ?>" type="hidden">
<input id="msg-reset" value="<?php print _("Theme successfully reset"); ?>" type="hidden">
<input id="msg-applying" value="<?php print _("Applying..."); ?>" type="hidden">
<input id="msg-applied" value="<?php print _("Theme successfully applied"); ?>" type="hidden">

<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
    
        <ul>
    	    <li class="static active"><a href="theme"><?php print _("Themes"); ?></a></li>
        </ul>
        
    </nav>

    <div id="themesList" class="list" data-bind="foreach: themes">
    
        <div class="listItem">
            <h2 data-bind="text: name"></h2>
            <p data-bind="text: desc"></p>
            
            <button class="primary-button" data-bind="click: $parent.showApplyDialog, visible: ($parent.theme()!=id())"><?php print _("Apply Theme"); ?></button>
    		<button class="secondary-button" data-bind="click: $parent.showResetDialog, visible: ($parent.theme()==id())"><?php print _("Reset Theme"); ?></button>
        </div>
    
    </div>
    <!-- /.list -->

</section>
<!-- /.main -->

<div class="modal fade" id="applyDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
		    <div class="modal-header">
		        <button type="button" class="close" data-dismiss="modal">×</button>
		        <h3><?php print _("Apply Theme"); ?></span></h3>
		    </div>
		    <div class="modal-body">
		    
		    <p>
		    	<?php print _("Confirm you want to apply:"); ?> <strong id="applyName">theme</strong>
		    </p>
		    
		    <p>
		        <?php print _("This will completely change the look and feel of your site and remove any custom changes you made to the layout and styles of the site."); ?>
		    </p>
		    
		    </div>
		    <div class="modal-footer">
		    	<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
		    	<button class="primary-button" data-bind="click: applyTheme"><?php print _("Apply Theme"); ?></button>
		    </div>
		    <!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->

<div class="modal fade" id="resetDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

		    <div class="modal-header">
		        <button type="button" class="close" data-dismiss="modal">×</button>
		        <h3><?php print _("Reset Theme"); ?></span></h3>
		    </div>
		    <div class="modal-body">
		    
		    <p>
		        <?php print _("Confirm you want to reset:"); ?> <strong id="resetName">theme</strong>
		    </p>
		    
		    <p>
		        <?php print _("This will override any custom changes you made to the Layout or Styles for the site."); ?>
		    </p>
		    
		    </div>
		    <div class="modal-footer">
		        <button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
		    	<button class="primary-button" data-bind="click: resetTheme"><?php print _("Reset Theme"); ?></button>
		    </div>
		    <!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->

</body>

<!-- include js -->
<script type="text/javascript" src="<?php print JQUERY_JS; ?>"></script>
<script type="text/javascript" src="<?php print JQUERYUI_JS; ?>"></script>
<script type="text/javascript" src="<?php print BOOTSTRAP_JS; ?>"></script>
<script type="text/javascript" src="<?php print KNOCKOUT_JS; ?>"></script>
<script type="text/javascript" src="js/helper/moment.min.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/global.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/messages.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/themeModel.js?v=<?php print VERSION; ?>"></script>

</html>