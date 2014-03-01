<?php	
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('All');
	
	Utilities::SetLanguage($authUser->Language); // set language
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $authUser->Language) ?>">

<head>
	
<title><?php print _("Profile"); ?>&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include css -->
<?php include 'modules/css.php'; ?>
<link type="text/css" href="css/dialog.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/dropzone.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body id="profile-page" data-currpage="profile" data-sitefriendlyid="<?php print $authUser->SiteFriendlyId; ?>">
	
<?php include 'modules/menu.php'; ?>

<!-- messages -->
<input id="msg-all-required" value="<?php print _("All fields are required"); ?>" type="hidden">
<input id="msg-match" value="<?php print _("The password must match the retype field"); ?>" type="hidden">
<input id="msg-adding" value="<?php print _("Adding..."); ?>" type="hidden">
<input id="msg-added" value="<?php print _("User successfully added"); ?>" type="hidden">
<input id="msg-updating" value="<?php print _("Updating..."); ?>" type="hidden">
<input id="msg-updated" value="<?php print _("User successfully updated"); ?>" type="hidden">
<input id="msg-removing" value="<?php print _("Removing..."); ?>" type="hidden">
<input id="msg-removed" value="<?php print _("User successfully removed"); ?>" type="hidden">

<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
    
        <ul>
            <li class="static active"><a><?php print _("Profile"); ?></a></li>
        </ul>
        
    </nav>
    <!-- /nav -->
    
    
    <div class="profile-view" data-bind="with: user">
    
    	<button class="update-photo" data-bind="click: $parent.showImagesDialog, css:{'has-photo':hasPhotoUrl}, attr:{'style':'background-image: url(sites/<?php print $authUser->SiteFriendlyId; ?>/files/'+photoUrl() +')'}"><span><?php print _("Update Photo"); ?></span></button>
    	
    	<div class="profile-readable">
    	
    	<h2><span data-bind="text: firstName"></span> <span data-bind="text: lastName"></span></h2>
    	
    	<p>
    		<span data-bind="text: email"></span>
    	</p>
    	
    	<p>
    		<a data-bind="click: $parent.showEditDialog">Edit Profile</a>
    	</p>
    	
    	</div>
    	
				
    </div>
    <!-- /.form-horizontal -->

	
</section>
<!-- /.main -->

<?php include 'modules/dialogs/imagesDialog.php'; ?>

<div class="modal fade" id="editDialog" data-bind="with: user">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3 class="edit"><?php print _("Update User"); ?></h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">
			
				<div class="form-group">
					<label for="firstName"><?php print _("First Name:"); ?></label>
					<input id="firstName" type="text" class="form-control" data-bind="value: firstName">
				</div>
				
				<div class="form-group">
					<label for="lastName"><?php print _("Last Name:"); ?></label>
					<input id="lastName" type="text" class="form-control" data-bind="value: lastName">
				</div>
				
				<div class="form-group">
					<label for="language"><?php print _("Language:"); ?></label>
					<select id="language" class="form-control" data-bind="
					    options: $parent.languages,
					    optionsText: 'text',
					    optionsValue: 'code',
					    value: language">
					    <option value="en">English</option>
				    </select>
				</div>
				
				<div class="form-group">
					<label for="email"><?php print _("Email:"); ?></label>
					<input id="email" type="text" class="form-control" data-bind="value: email">
					<span class="help-block"><?php print _("Also used as the login"); ?></span>
				</div>
				
				<div class="form-group">
					<label for="password"><?php print _("Password:"); ?></label>
					<input id="password" type="password" class="form-control" value="temppassword">
					<span class="help-block"><?php print _("More than 5 characters, 1 letter and 1 special character"); ?></span>
				</div>
				
				<div class="form-group">
					<label for="retype"><?php print _("Re-type Password:"); ?></label>
					<input id="retype" type="password" class="form-control">
				</div>
			
			</div>
			<!-- /.modal-body -->

			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button edit" type="button" data-bind="click: $parent.editUser"><?php print _("Update User"); ?></button>
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
<script type="text/javascript" src="js/helper/dropzone.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/profileModel.js?v=<?php print VERSION; ?>"></script>

</html>