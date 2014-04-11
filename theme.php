<?php	
	include 'app.php'; // import php files

	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('Admin');
	
	Utilities::SetLanguage($authUser->Language); // set language
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $authUser->Language) ?>">

<head>
	
<title><?php print _("Themes"); ?>&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include css -->
<?php include 'modules/css.php'; ?>

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

    <div id="themesList" class="image-list" data-bind="foreach: themes">
    
        <div class="image-item" data-bind="css:{active: ($parent.theme()==id())}">
            <h2 data-bind="text: name"></h2>
            
            <img data-bind="attr:{'src': 'themes/'+id()+'/logo.png'}">
            
            <div class="secondary inactive-button" data-bind="click: $parent.showApplyDialog"><?php print _("Apply Theme"); ?></div>
    		<div class="active-button" data-bind="click: $parent.showResetDialog"><?php print _("Reset Theme"); ?></div>
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
<?php include 'modules/js.php'; ?>
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/themeModel.js?v=<?php print VERSION; ?>"></script>

</html>