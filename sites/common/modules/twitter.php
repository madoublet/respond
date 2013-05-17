<?php 
	if(!isset($parser)){
		$parser = new FeedParser();
	}
?>

<?php if($username != ''){ ?>

	<div class="twitter">
		<ul>
	<?php
			  $url = "http://search.twitter.com/search.atom?q=from:" . $username . "&rpp=5";
			  $parser->parse($url);
   			  $channels = $parser->getChannels();
			  $items = $parser->getItems();
                          if(!$items) print "<li>No Recent Tweets</li>";
			  foreach($items as $item):
			  	 print '<li><img src="http://img.tweetimag.es/i/' . $username . '"> ' . $item['TITLE'] . '</li>';
			  endforeach;
	?>
		</ul>
		<a id="follow" href="http://twitter.com/<?php print $username ?>">Follow @<?php print $username ?></a>
    </div>

<?php } ?>