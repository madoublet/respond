<?php 

$type = $authUser->Type;
$status = $authUser->Status;
$plan = $authUser->Plan;

$subscribeLink = '<a href="account#subscribe">'._("Subscribe").'</a>';
$accountLink = '<a href="account">'._("Manage Account").'</a>';
$updatePaymentLink = '<a href="account#payment">'._("Update Payment").'</a>';
$link = '';

// get utc date
date_default_timezone_set('UTC');
$now = time(); 

// message params
$alertVisible = false;
$alertClass = 'alert-info';
$alertText = '';
$days = 0;

if(strtoupper($type)=='SUBSCRIPTION'){ // if the site has a plan

	$your_date = strtotime($authUser->RenewalDate);
	$datediff = $your_date - $now;
	
	$days = floor($datediff/(60*60*24));
	
	// active, everything looks good
	if($days < 30 && $status == 'active'){
		$alertVisible = true;
		$alertClass = 'message-info';
		$alertText = _("Your plan will automatically renew in %s days.");
		$link = $accountLink;
	}
	
	// trials
	if($days < 30 && $status == 'trialing'){
		$alertVisible = true;
		$alertClass = 'message-info';
		$alertText = _("Your trial will expire in %s days.");
		$link = $subscribeLink;
	}
	
	if($days < 10 && $status == 'trialing'){
		$alertVisible = true;
		$alertClass = 'message-warning';
		$alertText = _("Your trial will expire in %s days.");
		$link = $subscribeLink;
	}
	
	// past due
	if($status == 'past_due'){
		$alertVisible = true;
		$alertClass = 'message-danger';
		$alertText = _("Your plan has expired. Please update your method of payment to avoid disruption of service.");
		$link = $updatePaymentLink;
	}
	
	// canceled or unpaid
	if($status == 'canceled' || $status == 'unpaid' || $status == 'unsubscribed'){
		$alertVisible = true;
		$alertClass = 'message-danger';
		$alertText = _("Your subscription has ended. View your account to re-subscribe.");
		$link = $accountLink;
	}
	
} 

if($alertVisible==true){	
	print '<p id="account-message" class="'.$alertClass.'">';
	echo sprintf($alertText, $days);
	print $link;
	print '</p>';
}
?>