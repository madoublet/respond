<?php
	
class Image
{
	
	// saves the image with a thumbnail
	public static function SaveImageWithThumb($site, $filename, $image, $folder = 'files'){
		
		// get meta information
		$size = filesize($image);
		list($curr_w, $curr_h, $type, $attr) = Image::getImageInfo($image);
		
		// create thumb
		$thumb = Image::CreateThumb($site, $image, $filename, $folder); 
		
		// save the image to S3
		$directory = SITES_LOCATION.'/'.$site['FriendlyId'].'/'.$folder.'/';
	
		$full = $directory.$filename;
		
		// create a directory
		if(!file_exists($directory)){
			mkdir($directory, 0777, true);	
		}
		
		// just copy the image
		copy($image, $full);
			
		
		
		// return meta data
		return array(
			'size' 		=> $size,
			'width'		=> $curr_w,
			'height'	=> $curr_h
			);
	}
	
	// creates a thumbnail
	public static function CreateThumb($site, $image, $filename, $folder = 'files'){
	
		// directory
		$dir = SITES_LOCATION.'/'.$site['FriendlyId'].'/'.$folder.'/';
	
		// set thumb size
		$target_w = THUMB_MAX_WIDTH;
		$target_h = THUMB_MAX_HEIGHT;
		
		list($curr_w, $curr_h, $type, $attr) = Image::getImageInfo($image);
		
		$ext = 'jpg';
		
		switch($type){ // create image
			case IMAGETYPE_JPEG: $ext = 'jpg'; break; 
			case IMAGETYPE_PNG: $ext = 'png'; break; 
			case IMAGETYPE_GIF: $ext = 'gif'; break; 
			case 'image/svg+xml' : $ext = 'svg'; break;
			default: return false; 
		}
	
		$scale_h = $target_h/$curr_h;
		$scale_w = $target_w/$curr_w;
		
		$factor_x = ($curr_w/$target_w);
		$factor_y = ($curr_h/$target_h);
		
		if($factor_x>$factor_y){
			$factor = $factor_y;
		}
		else{
			$factor = $factor_x;
		}
	
		$up_w = ceil($target_w * $factor);
		$up_h = ceil($target_h * $factor);
		
		$x_start = ceil(($curr_w-$up_w)/2);
		$y_start = ceil(($curr_h-$up_h)/2);
		
		switch($type){ // create image
			case IMAGETYPE_JPEG: $n_img = imagecreatefromjpeg($image); break; 
			case IMAGETYPE_PNG: $n_img = imagecreatefrompng($image); break; 
			case IMAGETYPE_GIF: $n_img = imagecreatefromgif($image); break; 
			case 'image/svg+xml' : break;
			default: return false; 
		}
	
		$dst_img = ImageCreateTrueColor($target_w, $target_h);

		switch($type){ // fix for transparency issues
			case IMAGETYPE_PNG: 
				imagealphablending($dst_img, true);
		        imagesavealpha($dst_img, true);
		        $transparent_color = imagecolorallocatealpha($dst_img, 0, 0, 0, 127);
		        imagefill($dst_img, 0, 0, $transparent_color);
				break; 
			case IMAGETYPE_GIF: 
				$transparency_index = imagecolortransparent($dst_img);
		        if ($transparency_index >= 0) {
		            $transparent_color = imagecolorsforindex($dst_img, $transparency_index);
		            $transparency_index = imagecolorallocate($dst_img, $transparent_color['red'], $transparent_color['green'], $transparent_color['blue']);
		            imagefill($dst_img, 0, 0, $transparency_index);
		            imagecolortransparent($dst_img, $transparency_index);
		        }
				
				break; 
			default: break;
		}
		
		// (for testing) die('curr_w='.$curr_w.' curr_h='.$curr_h.' x_start='.$x_start.' y_start='.$y_start.' target_w='.$target_w.' target_h='.$target_h.' up_w='.$up_w.' up_h='.$up_h);
		if ($type!='image/svg+xml') {
			imagecopyresampled($dst_img, $n_img, 0, 0, $x_start, $y_start, $target_w, $target_h, $up_w, $up_h); 
		}
		
		
		//return $dst_img;
		$full = $dir.'thumbs/'.$filename;
		
		if(!file_exists($dir)){
			mkdir($dir, 0777, true);	
		}
		
		switch($ext){ 
			case 'jpg':{
			
				imagejpeg($dst_img, $full, 100);
			
				break;
			}
			case 'png':{
			
				// save file locally
				imagepng($dst_img, $full);
				
				break;
			}
			case 'gif':{
			
				// save file locally
				imagegif($dst_img, $full);
			
				break;
			}
			case 'svg':{
			
				// save file locally
				copy($image, $full);
			
				break;
			}
			default: return false; 
			
			return true;
		}
	
	}

	public static function getImageInfo($file) {
		
		list($width, $height, $type, $attr) = getimagesize($file);
		
		if (empty($type)) {  // we try for svg
			$finfo = finfo_open(FILEINFO_MIME_TYPE);
			$fi = finfo_file($finfo, $file);
			if ($fi == 'image/svg+xml') {  // for SVG files which getimagesize returns empty values
				$xmlget = simplexml_load_file($file);
				$xmlattributes = $xmlget->attributes();
				$width = (int) $xmlattributes->width;  // this is approximate
				$height = (int) $xmlattributes->height;  // this is approximate
				$type = 'image/svg+xml';
				$attr = '';
			}
		}
		
		return array($width, $height, $type, $attr);
	}
}
	
?>