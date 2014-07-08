<header>

	<?php
		if(isset($path_prefix)==false){
			$path_prefix = '';
		}
	?>
	
	<div class="profile">
		<?php if($authUser->HasPhotoUrl){ ?>
			<span id="menu-photo" class="photo" style="background-image:url(sites/<?php print $authUser->SiteFriendlyId; ?>/files/<?php print $authUser->PhotoUrl; ?>)"></span>
		<?php } ?>
		<a id="menu-name" href="profile"><?php print $authUser->Name; ?></a>
	</div>
	<!-- /.profile -->
	
	<div class="sub-menu">
		<a class="signout" href="<?php print $path_prefix; ?>logout" title="<?php print _("Sign Out"); ?>"><i class="fa fa-power-off"></i></a>
		<a class="hide-menu" title="<?php print _("Close Menu"); ?>"><i class="fa fa-times"></i></a>
	</div>
	<!-- /.sub-menu -->

	<?php if($authUser->Role=='Admin'){ ?>
	<h2 class="basic">
		<?php print _("Manage your Site"); ?>
		<a class="site" target="_blank" href="sites/<?php print $authUser->SiteFriendlyId; ?>"><?php print _("View Site"); ?> <i class="fa fa-external-link"></i></a>
	</h2>
	<!-- /.basic -->

	<ul class="menu">
		<li class="menu-pages"><a href="<?php print $path_prefix; ?>pages"><i class="fa fa-file"></i> <?php print _("Pages"); ?></a></li>
    	<li class="menu-menu"><a href="<?php print $path_prefix; ?>menus"><i class="fa fa-bars"></i> <?php print _("Menus"); ?></a></li>
		<li class="menu-theme"><a href="<?php print $path_prefix; ?>theme"><i class="fa fa-desktop"></i> <?php print _("Theme"); ?></a></li>
    	<li class="menu-branding"><a href="<?php print $path_prefix; ?>branding"><i class="fa fa-certificate"></i> <?php print _("Branding"); ?></a></li>
		<li class="menu-transactions"><a href="<?php print $path_prefix; ?>transactions"><i class="fa fa-money"></i> <?php print _("Transactions"); ?></a></li>
    <?php if($authUser->Role=='Admin'){ ?>	
    	<li class="menu-files"><a href="<?php print $path_prefix; ?>files"><i class="fa fa-folder-open"></i> <?php print _("Files"); ?></a></li>
    <?php } ?>	
		<li class="menu-users"><a href="<?php print $path_prefix; ?>users"><i class="fa fa-user"></i> <?php print _("Users"); ?></a></li>
		<li class="menu-account"><a href="<?php print $path_prefix; ?>account"><i class="fa fa-key"></i> <?php print _("Account"); ?></a></li>
	</ul>
	<!-- /.menu -->
	
	<h2 class="advanced">
		<?php print _("Advanced Configurations"); ?>
		<a class="republish publish-site"><?php print _("Republish"); ?> <i class="fa fa-refresh"></i></a>
	</h2>
	<!-- /.advanced -->
	
	<ul class="menu">	
        <li class="menu-layout"><a href="<?php print $path_prefix; ?>layout"><i class="fa fa-th-large"></i> <?php print _("Layout"); ?></a></li>
        <li class="menu-snippets"><a href="<?php print $path_prefix; ?>snippets"><i class="fa fa-scissors"></i> <?php print _("Snippets"); ?></a></li>	
        <li class="menu-styles"><a href="<?php print $path_prefix; ?>styles"><i class="fa fa-text-height"></i> <?php print _("Styles"); ?></a></li>
        <li class="menu-scripts"><a href="<?php print $path_prefix; ?>scripts"><i class="fa fa-bolt"></i> <?php print _("Scripts"); ?></a></li>
		<li class="menu-settings"><a href="<?php print $path_prefix; ?>settings"><i class="fa fa-cog"></i> <?php print _("Settings"); ?></a></li>
		<?php if($authUser->IsSuperAdmin==true){ ?>
		<li class="menu-admin">
        	<a href="admin"><i class="fa fa-briefcase"></i> <?php print _("Site Admin"); ?></a>
		</li>
		<?php } ?>	
	</ul>
	<!-- /.menu -->
	<?php } else { ?>
	<h2 class="basic"><?php print _("Menu"); ?></h2>
	
	<ul class="menu">
		<li class="menu-pages"><a href="<?php print $path_prefix; ?>pages"><i class="fa fa-file"></i> <?php print _("Pages"); ?></a></li>
		<li class="menu-profile"><a href="<?php print $path_prefix; ?>profile"><i class="fa fa-user"></i> <?php print _("Profile"); ?></a></li>
	</ul>
	<!-- /.menu -->
	<?php } ?>
	
</header>