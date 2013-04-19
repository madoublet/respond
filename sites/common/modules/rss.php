<?php 
$a_rss = explode(',', $page->Rss);

$count = count($a_rss);

for($x=0; $x<$count; $x++){
	$pageType = PageType::GetByFriendlyId($a_rss[$x], $site->SiteId);
	if($pageType!=null){
		print '<link rel="alternate" type="application/rss+xml" title="'.$site->Name.' - '.$pageType->TypeP.' RSS Feed" href="'.$dataloc.'data/'.strtolower($pageType->TypeP).'.xml">'.PHP_EOL;
	}
	
}?>