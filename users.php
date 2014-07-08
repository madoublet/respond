<?php	
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('Admin');
	
	Utilities::SetLanguage($authUser->Language); // set language
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $authUser->Language) ?>">

<head>
	
<title><?php print _("Users"); ?>&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include css -->
<?php include 'modules/css.php'; ?>
<link type="text/css" href="css/dialog.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/dropzone.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body data-currpage="users" data-sitefriendlyid="<?php print $authUser->SiteFriendlyId; ?>">

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
<input id="msg-admin" value="<?php print _("Administrator"); ?>" type="hidden">
<input id="msg-contributor" value="<?php print _("Contributor"); ?>" type="hidden">
<input id="msg-member" value="<?php print _("Member"); ?>" type="hidden">
		
<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
    
        <ul>
            <li class="static active"><a><?php print _("Users"); ?></a></li>
            <li class="static"><a href="roles"><?php print _("Roles"); ?></a></li>
        </ul>
        
        <a class="primary-action show-tooltip" data-bind="click: showAddDialog" title="<?php print _("Add User"); ?>"><i class="fa fa-plus-circle"></i></span></a>
    </nav>

    <div id="usersList" class="list has-photo" data-bind="foreach: users">
    
        <div class="listItem" data-bind="attr: { 'data-id': userUniqId}">
    		<a class="remove" data-bind="click: $parent.showRemoveDialog">
                <i class="fa fa-minus-circle"></i>
            </a>
            <button class="update-photo" data-bind="click: $parent.showImagesDialog, css:{'has-photo':hasPhotoUrl}, attr:{'style':'background-image: url(sites/<?php print $authUser->SiteFriendlyId; ?>/files/'+photoUrl() +')'}"><span><?php print _("Update Photo"); ?></span></button>
    		<h2>
    			<a data-bind="text:fullName, click: $parent.showEditDialog"></a>
				<span class="role admin" data-bind="visible:role()=='Admin'"><?php print _("Administrator"); ?><span data-bind="visible:isActive()=='0'"> &ndash; <?php print _("Not Active"); ?></span></span>
				<span class="role contributor" data-bind="visible:role()=='Contributor'"><?php print _("Contributor"); ?><span data-bind="visible:isActive()=='0'"> &ndash; <?php print _("Not Active"); ?></span></span>
				<span class="role member" data-bind="visible:role()=='Member'"><?php print _("Member"); ?><span data-bind="visible:isActive()=='0'"> &ndash; <?php print _("Not Active"); ?></span></span>
				<span class="role contributor" data-bind="visible:role()!='Member' && role()!='Contributor' && role()!='Admin'"><span data-bind="text:role"></span><span data-bind="visible:isActive()=='0'"> &ndash; <?php print _("Not Active"); ?></span></span>
    		</h2>
    		<p><span class="email" data-bind="text:email"></span></p>
            <em><?php print _("Created"); ?> <span data-bind="text:friendlyDate"></span></em>
    	</div>
    	<!-- /.listItem -->
    
    </div>
    <!-- /.list -->
    
    <p data-bind="visible: usersLoading()" class="list-loading"><i class="fa fa-spinner fa-spin"></i> <?php print _("Loading..."); ?></p>
    
    <p data-bind="visible: usersLoading()==false && users().length < 1" class="list-none"><?php print _("No users here. Click Add User to get started."); ?></p>
      

</section>
<!-- /.main -->

<?php include 'modules/dialogs/imagesDialog.php'; ?>

<div class="modal fade" id="addEditDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3 class="add"><?php print _("Add User"); ?></h3>
				<h3 class="edit"><?php print _("Update User"); ?></h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">
			
				<div class="form-group">
					<label for="firstName"><?php print _("First Name:"); ?></label>
					<input id="firstName" type="text" class="form-control">
				</div>
				
				<div class="form-group">
					<label for="lastName"><?php print _("Last Name:"); ?></label>
					<input id="lastName" type="text" class="form-control">
				</div>
				
		
				<div class="form-group">
					<label for="role"><?php print _("Role:"); ?></label>
					<select id="role" class="form-control" data-bind="
					    options: roles,
					    optionsText: 'name',
					    optionsValue: 'id'">
					    <option value="Admin"><?php print _("Administrator"); ?></option>
				    </select>
				</div>
				
				<div class="form-group">
					<label for="language"><?php print _("Language:"); ?></label>
					<select id="language" class="form-control" data-bind="
					    options: languages,
					    optionsText: 'text',
					    optionsValue: 'code'">
					    <option value="en">English</option>
				    </select>
				</div>
				
				<div class="form-group">
					<label for="isActive"><?php print _("Active:"); ?></label>
					<select id="isActive" class="form-control">
					    <option value="1">Yes</option>
					    <option value="0">No</option>
				    </select>
				</div>
				
				<div class="form-group">
					<label for="email"><?php print _("Email:"); ?></label>
					<input id="email" type="text" class="form-control">
					<span class="help-block"><?php print _("Also used as the login"); ?></span>
				</div>
				
				<div class="form-group">
					<label for="password"><?php print _("Password:"); ?></label>
					<input id="password" type="password" class="form-control">
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
				<button class="primary-button add" type="button" data-bind="click: addUser"><?php print _("Add User"); ?></button>
				<button class="primary-button edit" type="button" data-bind="click: editUser"><?php print _("Update User"); ?></button>
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

<div class="modal fade" id="deleteDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3><?php print _("Remove User"); ?></h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">
			
				<p>
				<?php print _("Confirm you want to remove:"); ?> <strong id="removeName">this user</strong>
				</p>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: removeUser"><?php print _("Remove User"); ?></button>
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

</form>

</body>

<!-- include js -->
<?php include 'modules/js.php'; ?>
<script type="text/javascript" src="js/helper/dropzone.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/usersModel.js?v=<?php print VERSION; ?>"></script>

</html>