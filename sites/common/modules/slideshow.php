<?php 
	$imgHtml = str_get_html($imgList);
	
	$img_count = 0;
	
?>

<div id="<?php print $id; ?>" class="carousel slide" data-width="<?php print $width; ?>" data-height="<?php print $height; ?>"  style="max-width: <?php print $width; ?>px">
	<div class="carousel-inner">
		<?php foreach($imgHtml->find('img') as $img){ ?>
			<div class="item<?php if($img_count==0){print ' active';}?>">	
				<img class="sliderImage" src="<?php print $rootloc.'files/'; ?><?php print $img->id; ?>">
				<?php if(empty($img->title)==false){?>
				<div class="carousel-caption">
                  <p><?php print $img->title; ?></p>
                </div>
				<?php } ?>
			</div>
		<?php 
			$img_count = $img_count+1;
		} ?>
	</div>
	<!-- /.carousel-inner -->

	<a class="carousel-control left" href="#<?php print $id; ?>" data-slide="prev">&lsaquo;</a>
  	<a class="carousel-control right" href="#<?php print $id; ?>" data-slide="next">&rsaquo;</a>

</div>
<!-- /.carousel -->
