<?php 
	$imgHtml = str_get_html($imgList);
	
	$img_count = 0;
	
?>

<div id="<?php print $id; ?>" class="gallery">
	<div class="gallery-inner">
		<?php 
			if($imgHtml){
			
				foreach($imgHtml->find('img') as $img){ 

					// convert to an array to make it easier to access hyphenated properties
					$a_img = Utilities::objectToArray( $img );

					?>

			<div class="thumbnail thumbail-<?php if($img_count==0){print ' active';}?><?php if (empty($a_img['attr']['data-slidecssclass'])==false) { print ' '.$a_img['attr']['data-slidecssclass']; } ?>" id="<?php print $img->id; ?>">
				<a class="gallery-image" href="<?php print $rootloc.$a_img['attr']['data-srcfullsize']; ?>" rel="group-<?php print $id; ?>" title="<?php print '<?php print _("'.htmlentities($img->title, ENT_QUOTES).'"); ?>'; ?>">
					<img src="<?php print $a_img['attr']['src']; ?>">
				</a>
				<?php if(empty($img->title)==false){?>
				<div class="caption">
                  <p><?php print '<?php print _("'.htmlentities($img->title, ENT_QUOTES).'"); ?>'; ?></p>
                </div>
				<?php } ?>
			</div>
			
		<?php 
					$img_count = $img_count+1;
				} 
			
			}?>
	</div>
	<!-- /.gallery-inner -->

</div>
<!-- /.gallery -->
