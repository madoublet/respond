<header>
    <h2>&nbsp;</h2>
    
    <?php if($authUser->IsSuperAdmin==true){ ?>
        <a class="switch" href="switch" title="Switch Site"><i class="icon-exchange icon-large"></i></a>
	<?php } ?>	

    <a class="files" href="files" title="Files"><i class="icon-folder-open icon-large"></i></a>
    <a class="signout" href="logout" title="Sign Out"><i class="icon-signout icon-large"></i></a>
    <a class="republish publish-site" title="Re-publish Site"><i class="icon-refresh icon-large"></i></a>

	<ul class="menu">
		<li class="menu-pages"><a href="pages"><i class="icon-file icon-large"></i> Pages</a></li>
    	<li class="menu-menu"><a href="menus"><i class="icon-reorder icon-large"></i> Menus</a></li>
		<li class="menu-template"><a href="template"><i class="icon-desktop icon-large"></i> Template</a></li>
    	<li class="menu-branding"><a href="branding"><i class="icon-certificate icon-large"></i> Branding</a></li>
        <li class="menu-layout"><a href="layout"><i class="icon-th-large icon-large"></i> Layout</a></li>
        <li class="menu-styles"><a href="styles"><i class="icon-text-height icon-large"></i> Styles</a></li>
        <li class="menu-scripts"><a href="scripts"><i class="icon-bolt icon-large"></i> Scripts</a></li>
		<li class="menu-users"><a href="users"><i class="icon-user icon-large"></i> Users</a></li>
		<li class="menu-settings"><a href="settings"><i class="icon-cog icon-large"></i> Settings</a></li>
	</ul>

<?php if($authUser->Role=='Demo'){ ?>
	<span class="demo-mode">Demo Mode</span>
<?php } ?>

</header>