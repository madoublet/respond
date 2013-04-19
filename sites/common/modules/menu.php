<?php 
    if(!isset($type)){
		$type = 'primary';
	} ?>

<nav class="<?php print $type; ?>">
	<ul>

<?php

    if($pageTypeUniqId=='-1'){
        $root = '';
    }
    else{
        $root = '../';
    }

	$json = file_get_contents($root.'data/menu.json');
	$data = json_decode($json, true);

	foreach($data as &$item) {
		$c_pageUniqId = $item['PageUniqId'];
		$c_type = $item['Type'];
		$cssClass = '';

		if($c_type==$type){

			if(isset($item['CssClass'])){
				$cssClass = ' '.trim($item['CssClass']);
			}
            
            if($c_pageUniqId==$pageUniqId){
                $cssClass .= ' selected';
            }
            
			print '<li data-pageuniqid="'.$c_pageUniqId.'" class="'.$cssClass.'">';
	
			if(strpos($item['Url'], 'http://')===false && strpos($item['Url'], 'https://')===false){
				$c_url = $root.$item['Url'];
			}
			else{
				$c_url = $item['Url'];
			}
			
		
		    print '<a href="'.$c_url.'">'.$item['Name'].'</a></li><!--position: '.strpos($item['Url'], 'http://').'-->';
	    }
	}
?>
	</ul>	
</nav>