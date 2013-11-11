<header>

	<?php
		if(isset($path_prefix)==false){
			$path_prefix = '';
		}
	?>
	
	<div class="sub-menu">
    <?php if($authUser->IsSuperAdmin==true){ ?>
        <a class="switch" href="switch" title="Switch Site"><i class="fa fa-briefcase"></i></a>
	<?php } ?>	
    	<a class="files" href="<?php print $path_prefix; ?>files" title="Files"><i class="fa fa-folder-open"></i></a>
		<a class="republish publish-site" title="Re-publish Site"><i class="fa fa-refresh"></i></a>
		<a class="signout" href="<?php print $path_prefix; ?>logout" title="Sign Out"><i class="fa fa-power-off"></i></a>
		<a class="hide-menu" title="Close Menu"><i class="fa fa-times"></i></a>
	</div>

	<h2 class="basic">Manage your Site</h2>

	<ul class="menu">
		<li class="menu-pages"><a href="<?php print $path_prefix; ?>pages"><i class="fa fa-file"></i> Pages</a></li>
    	<li class="menu-menu"><a href="<?php print $path_prefix; ?>menus"><i class="fa fa-bars"></i> Menus</a></li>
		<li class="menu-template"><a href="<?php print $path_prefix; ?>template"><i class="fa fa-desktop"></i> Template</a></li>
    	<li class="menu-branding"><a href="<?php print $path_prefix; ?>branding"><i class="fa fa-certificate"></i> Branding</a></li>
		<li class="menu-users"><a href="<?php print $path_prefix; ?>users"><i class="fa fa-user"></i> Users</a></li>
		<li class="menu-account"><a href="<?php print $path_prefix; ?>account"><i class="fa fa-key"></i> Account</a></li>
	</ul>
	
	<h2 class="advanced">Advanced Configurations</h2>
	
	<ul class="menu">	
        <li class="menu-layout"><a href="<?php print $path_prefix; ?>layout"><i class="fa fa-th-large"></i> Layout</a></li>
        <li class="menu-styles"><a href="<?php print $path_prefix; ?>styles"><i class="fa fa-text-height"></i> Styles</a></li>
        <li class="menu-scripts"><a href="<?php print $path_prefix; ?>scripts"><i class="fa fa-bolt"></i> Scripts</a></li>
		<li class="menu-settings"><a href="<?php print $path_prefix; ?>settings"><i class="fa fa-cog"></i> Settings</a></li>
	</ul>
	
</header>