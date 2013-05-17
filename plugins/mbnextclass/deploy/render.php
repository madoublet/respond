<?php

/*
$sourcename = "MatthewSmith";
$password = "4HxrfxvOR5FI9bsAEDtDMKyJpdM=";
$siteID = "33339";*/

include "api/classService.php";

// #ref https://api.mindbodyonline.com/Doc

date_default_timezone_set("America/Chicago");

// initialize default credentials
$creds = new SourceCredentials($sourcename, $password, array($siteid));

$classService = new MBClassService();
$classService->SetDefaultCredentials($creds);

$classDescriptionIDs = array();
$classIDs = array();
$staffIDs = array();
$startDate = new DateTime(date('Y-m-d g:iA', strtotime('now')));
$endDate = new DateTime(date('Y-m-d', strtotime('+7 day')));

$result = $classService->GetClasses($classDescriptionIDs, $classIDs, $staffIDs, $startDate, $endDate);

$classes = toArray($result->GetClassesResult->Classes->Class);

$now_stamp = strtotime('now');

// #debug print '$now_stamp = '.$now_stamp.'<br><br>';

$list = array();

foreach ($classes as $class) {

	$stamp = strtotime($class->StartDateTime);
	$headline = date("l n/j", strtotime($class->StartDateTime));
	$start = date("M j g:iA", strtotime($class->StartDateTime));
	$startTime = date("gA", strtotime($class->StartDateTime));
	$startSignUpDate = date("m/d/Y", strtotime($class->StartDateTime));
	$end = date("M j g:iA", strtotime($class->EndDateTime));
	$endTime = date("g:iA", strtotime($class->EndDateTime));

	// #debug print '$stamp = '.$stamp.'<br>';

	if($stamp > $now_stamp){
	
		array_push($list, array(
			'stamp' => $stamp,
			'headline' => $headline,
			'id' => $class->ID,
			'classScheduleID' => $class->ClassScheduleID,
			'classid' => $class->ClassDescription->ID,
			'name' => $class->ClassDescription->Name,
			'start' => $start,
			'startDateTime' => $class->StartDateTime,
			'startTime' => $startTime,
			'startSignUpDate' => $startSignUpDate,
			'end' => $end,
			'endTime' => $endTime,
			'staff' => $class->Staff->Name,
			'isAvailable' => $class->IsAvailable
			));

		break;
	}
}

// #ref: http://stackoverflow.com/questions/7983822/sort-a-multi-dimensional-associative-array
uasort($list, function ($i, $j) {
    $a=$i['stamp'];
    $b=$j['stamp'];
    if ($a == $b) return 0;
    elseif ($a > $b) return 1;
    else return -1;
});

$curr_divider = '';

$mb_output = '<div class="mb-nextclass">';

foreach ($list as $item) {

	$mb_output .= '<h4>'.$item['headline'].'<span class="time">'.$item['startTime'].'</span></h4>';
	$mb_output .= '<p>'.$item['name'].'</p>';

	if($item['isAvailable']==true){
		$mb_output .= '<a class="sign-up" href="https://clients.mindbodyonline.com/ws.asp?studioid='.$siteid.
						'&sclassid='.$item['classScheduleID'].'&sDate='.$item['startSignUpDate'].'">Sign Up</a>';
	}
}

// #open question: https://getsatisfaction.com/mindbody/topics/what_is_the_format_for_creating_a_sign_up_now_link?rfm=1
// #format: https://clients.mindbodyonline.com/ws.asp?studioid=1513&sclassid=897&sDate=12/04/2012

$mb_output .= '</div>';

print $mb_output;

?>