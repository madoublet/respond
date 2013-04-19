<?php 
	$imgHtml = str_get_html($imgList);
?>

<div class="gallery">
		<?php foreach($imgHtml->find('img') as $img){ ?>
	<div class="gallery-image">
			<a href="<?php print $rootloc.'files/'; ?><?php print $img->id; ?>" rel="lightbox"><img src="<?php print $rootloc.'files/t-'; ?><?php print $img->id; ?>"></a>
			<?php if(empty($img->title)==false){?>
			<p class="caption" title="<?php print $img->title; ?>"><?php print $img->title; ?></p>
			<?php } ?>
	</div>
		<?php } ?>
	</div>
</div>
