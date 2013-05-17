<header class="navbar">
  <div>
<?php 

	if($site['LogoUrl']!=''){
		print '<a id="logo" href="'.$rootloc.'" alt="'.$site['Name'].'">'.
			'<img src="'.$rootloc.'files/'.$site['LogoUrl'].'"></a>';
	} 

print '<h1>'.$site['Name'].'</h1>';
?>

<?php print "<?php include '".$commonloc."modules/menu.php'; ?>"; ?>
  </div>
</header>

<p id="message">
  <span></span>
  <a class="close" href="#"></a>
</p>