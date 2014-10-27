<?php 
	$imgHtml = str_get_html($imgList);
	
	$img_count = 0;
	
?>

<div id="<?php print $id; ?>" class="carousel slide">

	<ol class="carousel-indicators">
		<?php 
		for( $i = 0; $i <= ( sizeof($imgHtml->find('img')) - 1); $i++ ) { 
		?>
			<li data-target="#<?php print $id; ?>" data-slide-to="<?php print $i; ?>"></li>
		<?php
		}
		?>
	</ol>

	<div class="carousel-inner">
		<?php 
			if($imgHtml){
			
				foreach($imgHtml->find('img') as $img){ 

					// convert to an array to make it easier to access hyphenated properties
					$a_img = Utilities::objectToArray( $img );

					?>

			<div class="item<?php if($img_count==0){print ' active';}?><?php if (empty($a_img['attr']['data-slidecssclass'])==false) { print ' '.$a_img['attr']['data-slidecssclass']; } ?>" id="<?php print $img->id; ?>">
				<img class="sliderImage" src="<?php print $rootloc; ?><?php print $a_img['attr']['data-srcfullsize']; ?>">

				<?php if (
						(empty($a_img['attr']['data-headline'])==false) ||
						(empty($a_img['attr']['data-buttonlabel'])==false) ||
						(empty($a_img['attr']['title'])==false)
					)
					{?>

				<div class="carousel-caption">

				<?php if(empty($a_img['attr']['data-headline'])==false){?>
                  <h2 class="carousel-headline"><?php print '<?php print _("'.$a_img['attr']['data-headline'].'"); ?>'; ?></h2>
				<?php } ?>

				<?php if(empty($a_img['attr']['title'])==false){?>
                  <p class="carousel-captiontext"><?php print '<?php print _("'.$a_img['attr']['title'].'"); ?>'; ?></p>
				<?php } ?>

				<?php if(empty($a_img['attr']['data-buttonlabel'])==false){?>
                  <a <?php if(empty($a_img['attr']['target'])==false){ print 'target="' . $a_img['attr']['target'] . '"'; } ?> href="<?php print $a_img['attr']['data-buttonurl']; ?>" class="btn btn-lg btn-primary carousel-button" role="button"><?php print '<?php print _("'.$a_img['attr']['data-buttonlabel'].'"); ?>'; ?></a>
				<?php } ?>

                </div><!-- /.carousel-caption -->

				<?php } ?>

			</div>
		<?php 
					$img_count = $img_count+1;
				} 
			
			}?>
	</div>
	<!-- /.carousel-inner -->

	<a class="carousel-control left" href="#<?php print $id; ?>" data-slide="prev"><span class="icon-prev"></span></a>
  	<a class="carousel-control right" href="#<?php print $id; ?>" data-slide="next"><span class="icon-next"></span></a>

</div>
<!-- /.carousel -->
