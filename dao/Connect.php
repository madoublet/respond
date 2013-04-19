<?php

class Connect{
	
	public static function init(){
		
		$dbhost = 'localhost';
    	$dbuser = 'yourdatabaseuser';
		$dbpass = 'yourdatabasepassword';
		
		$conn = mysql_connect($dbhost, $dbuser, $dbpass);
		
		if (!$conn) {
		    echo "Unable to connect to DB: " . mysql_error() . "<br>";
		    exit;
		}
		
		$dbname = 'respond';

		if (!mysql_select_db($dbname)) {
		    echo "Unable to select mydbname: " . mysql_error() . "<br>";
		    exit;
		}
	}
}

?>