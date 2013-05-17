<?php 
	if($page['LastModifiedBy']!=-1){
		$fullname = '';

		$user = User::GetByUserId($page['LastModifiedBy']);

		if($user!=null){
			$fullname = $user['FirstName'].' '.$user['LastName'];
		}
	}
	
?>
<div class="byline">
	<span class="author">By <?php print $fullname; ?></span>
	<span class="date">on <?php print Utilities::GetReadable($page['LastModifiedDate'], $site['TimeZone']); ?></span>
</div>
