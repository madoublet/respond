<?php 

$type = $authUser->Type;
$status = $authUser->Status;
$plan = $authUser->Plan;

$subscribeLink = '<a href="account#subscribe">Subscribe</a>';
$accountLink = '<a href="account">Manage Account</a>';
$updatePaymentLink = '<a href="account#payment">Update Payment</a>';

// get utc date
date_default_timezone_set('UTC');
$now = time(); 

// message params
$alertVisible = false;
$alertClass = 'alert-info';
$alertText = '';

if(strtoupper($type)=='SUBSCRIPTION'){ // if the site has a plan

	$your_date = strtotime($authUser->RenewalDate);
	$datediff = $your_date - $now;
	
	$days = floor($datediff/(60*60*24));
	
	// active, everything looks good
	if($days < 30 && $status == 'active'){
		$alertVisible = true;
		$alertClass = 'message-info';
		$alertText = 'Your plan will automatically renew in '.$days.' days. '.$accountLink;
	}
	
	// trials
	if($days < 30 && $status == 'trialing'){
		$alertVisible = true;
		$alertClass = 'message-info';
		$alertText = 'Thank you for trying '.BRAND.'! Your trial will expire in '.$days.' days. '.$subscribeLink;
	}
	
	if($days < 10 && $status == 'trialing'){
		$alertVisible = true;
		$alertClass = 'message-warning';
		$alertText = 'Thank you for trying '.BRAND.'! Your trial will expire in '.$days.' days. '.$subscribeLink;
	}
	
	// past due
	if($status == 'past_due'){
		$alertVisible = true;
		$alertClass = 'message-danger';
		$alertText = 'Your plan has expired. Please update your method of payment to avoid disruption of service.'.$updatePaymentLink;
	}
	
	// canceled or unpaid
	if($status == 'canceled' || $status == 'unpaid' || $status == 'unsubscribed'){
		$alertVisible = true;
		$alertClass = 'message-danger';
		$alertText = 'Your subscription has ended. View your account to re-subscribe.'.$accountLink;
	}
	
} 

if($alertVisible==true){	
	print '<p id="account-message" class="'.$alertClass.'">'.$alertText.'</p>';
}
?>