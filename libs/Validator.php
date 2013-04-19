<?php

class Validator
{	
	/* validates required form fields */
	public function required($value){
		if($value=="")return false;
			else return true;
	}
	
	/* validates required email fields */
	public function password($password, $retype){
		if($password == "" || $retype == "")return false;
		
		if($password != $retype)return false;
			else return true;	
	}
	
	/* validates required email fields */
	public function email($value){
		if($value=="")return false;
		
		return ereg("^[a-zA-Z0-9]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$", $value);
	}
	
}

?>