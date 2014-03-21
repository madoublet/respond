<?php
	if(isset($_SESSION[$siteFriendlyId.'.UserId'])){ ?>
<span class="welcome-message">
	<?php print _("Welcome"); ?> <?php print $_SESSION[$siteFriendlyId.'.FirstName']; ?> <?php print $_SESSION[$siteFriendlyId.'.LastName']; ?>
	<a href="<?php print $rootloc; ?>logout"><?php print _("Logout"); ?></a>
</span>
<?php	
	}else{ ?>
<span class="welcome-message">
	<a href="<?php print $rootloc; ?>login"><?php print _("Sign in"); ?></a>
</span>		
<?php		
	} ?>

