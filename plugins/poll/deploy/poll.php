<?php

include '../../../common/Utilities.php';
include '../../../common/API.php';

class Poll{

	function __construct(){
		
		$ajax = Utilities::GetPostData("ajax"); /* check for any ajax calls */
	
		if($ajax=='poll.save'){
			$this->Save();
		}
	}

	function Save(){

		$id = Utilities::GetPostData("id");
		$answer = Utilities::GetPostData("answer");

		$file = 'data/'.$id.'.json';

		$option1=0;
		$option2=0;
		$option3=0;
		$option4=0;
		$option5=0;
		$total=0;

		if(file_exists($file)){ 

			$json = file_get_contents($file); // open json file
			$data = json_decode($json, true);

			$option1 = $data['option1'];
			$option2 = $data['option2'];
			$option3 = $data['option3']; 
			$option4 = $data['option4'];
			$option6 = $data['option5'];

		}

		if($answer=='option1'){
			$option1 = $option1+1;
		}
		else if($answer=='option2'){
			$option2 = $option2+1;
		}
		else if($answer=='option3'){
			$option3 = $option3+1;
		}
		else if($answer=='option4'){
			$option4 = $option4+1;
		}
		else if($answer=='option4'){
			$option4 = $option4+1;
		}
		else if($answer=='option5'){
			$option5 = $option5+1;
		}	

		$arr = array( // create new array
			'option1' => $option1,
			'option2' => $option2,
			'option3' => $option3,
			'option4' => $option4,
			'option5' => $option5
			); 

		$encoded = json_encode($arr);

		// save json file
		Utilities::SaveContent('data/', $id.'.json', $encoded);

		die($encoded);
	}

	function Get(){

		// return json data

	}
}

$p = new Poll(); // setup controller

?>