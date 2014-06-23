<?php 
	$imgHtml = str_get_html($imgList);
	
	$img_count = 0;
	
?>

<div id="<?php print $id; ?>" class="carousel slide">
        <ol class="carousel-indicators">
                <?php
                        if($imgHtml){
                                foreach($imgHtml->find('img') as $index=>$img) {
                                        print '<li data-target="#'.$id.'" data-slide-to="'.$index.'" '.($index==0 ? 'class="active"' : '').'></li>';
                                }
                        }
                ?>
        </ol>
	<div class="carousel-inner">
		<?php 
			if($imgHtml){
			
				foreach($imgHtml->find('img') as $img){ ?>
			<div class="item<?php if($img_count==0){print ' active';}?>">	
				<img class="sliderImage" src="<?php print $rootloc.'files/'; ?><?php print $img->id; ?>">
				<?php if(empty($img->title)==false){?>
				<div class="carousel-caption">
                  <p style="margin-bottom: 0px;"><?php print '<?php print _("'.$img->title.'"); ?>'; ?></p>
                </div>
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
