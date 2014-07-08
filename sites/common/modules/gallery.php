<?php 
	$imgHtml = str_get_html($imgList);
	
	$img_count = 0;
	
?>

<div id="<?php print $id; ?>" class="gallery">
	<div class="gallery-inner">
		<?php 
			if($imgHtml){
			
				foreach($imgHtml->find('img') as $img){ ?>
				
			<div class="thumbnail thumbail-<?php if($img_count==0){print ' active';}?>">	
				<a class="gallery-image" href="<?php print $rootloc.'files/'; ?><?php print $img->id; ?>" rel="group-<?php print $id; ?>" title="<?php print '<?php print _("'.htmlentities($img->title, ENT_QUOTES).'"); ?>'; ?>">
					<img src="<?php print $rootloc.'files/t-'; ?><?php print $img->id; ?>">
				</a>
				<?php if(empty($img->title)==false){?>
				<div class="caption">
                  <p><?php print '<?php print _("'.$img->title.'"); ?>'; ?></p>
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
