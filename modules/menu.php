<header>

	<?php
		if(isset($path_prefix)==false){
			$path_prefix = '';
		}
	?>
	
	<div class="sub-menu">
		<a class="site" target="_blank" href="sites/<?php print $authUser->SiteFriendlyId; ?>" title="<?php print _("View Site"); ?>"><i class="fa fa-eye"></i></a>
    <?php if($authUser->IsSuperAdmin==true){ ?>
        <a class="switch" href="admin" title="<?php print _("Site Admin"); ?>"><i class="fa fa-briefcase"></i></a>
	<?php } ?>	
	<?php if($authUser->Role=='Admin'){ ?>
    	<a class="files" href="<?php print $path_prefix; ?>files" title="<?php print _("Files"); ?>"><i class="fa fa-folder-open"></i></a>
		<a class="republish publish-site" title="<?php print _("Re-publish Site"); ?>"><i class="fa fa-refresh"></i></a>
	<?php } ?>	
		<a class="signout" href="<?php print $path_prefix; ?>logout" title="<?php print _("Sign Out"); ?>"><i class="fa fa-power-off"></i></a>
		<a class="hide-menu" title="<?php print _("Close Menu"); ?>"><i class="fa fa-times"></i></a>
	</div>

	<?php if($authUser->Role=='Admin'){ ?>
	<h2 class="basic"><?php print _("Manage your Site"); ?></h2>

	<ul class="menu">
		<li class="menu-pages"><a href="<?php print $path_prefix; ?>pages"><i class="fa fa-file"></i> <?php print _("Pages"); ?></a></li>
    	<li class="menu-menu"><a href="<?php print $path_prefix; ?>menus"><i class="fa fa-bars"></i> <?php print _("Menus"); ?></a></li>
		<li class="menu-theme"><a href="<?php print $path_prefix; ?>theme"><i class="fa fa-desktop"></i> <?php print _("Theme"); ?></a></li>
    	<li class="menu-branding"><a href="<?php print $path_prefix; ?>branding"><i class="fa fa-certificate"></i> <?php print _("Branding"); ?></a></li>
		<li class="menu-users"><a href="<?php print $path_prefix; ?>users"><i class="fa fa-user"></i> <?php print _("Users"); ?></a></li>
		<li class="menu-account"><a href="<?php print $path_prefix; ?>account"><i class="fa fa-key"></i> <?php print _("Account"); ?></a></li>
	</ul>
	
	<h2 class="advanced"><?php print _("Advanced Configurations"); ?></h2>
	
	<ul class="menu">	
        <li class="menu-layout"><a href="<?php print $path_prefix; ?>layout"><i class="fa fa-th-large"></i> <?php print _("Layout"); ?></a></li>
        <li class="menu-snippets"><a href="<?php print $path_prefix; ?>snippets"><i class="fa fa-scissors"></i> <?php print _("Snippets"); ?></a></li>	
        <li class="menu-styles"><a href="<?php print $path_prefix; ?>styles"><i class="fa fa-text-height"></i> <?php print _("Styles"); ?></a></li>
        <li class="menu-scripts"><a href="<?php print $path_prefix; ?>scripts"><i class="fa fa-bolt"></i> <?php print _("Scripts"); ?></a></li>
		<li class="menu-settings"><a href="<?php print $path_prefix; ?>settings"><i class="fa fa-cog"></i> <?php print _("Settings"); ?></a></li>
	</ul>
	<?php } ?>
	
	<?php if($authUser->Role=='Contributor'){ ?>
	<h2 class="basic"><?php print _("Menu"); ?></h2>
	
	<ul class="menu">
		<li class="menu-pages"><a href="<?php print $path_prefix; ?>pages"><i class="fa fa-file"></i> <?php print _("Pages"); ?></a></li>
		<li class="menu-profile"><a href="<?php print $path_prefix; ?>profile"><i class="fa fa-user"></i> <?php print _("Profile"); ?></a></li>
	</ul>
	<?php } ?>
	
</header>