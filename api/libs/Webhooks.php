<?php
	
class Webhooks
{
	
	// sends a webhook for a new site
	public static function NewSite($site){
		
		if(WEBHOOKS_URL != ''){
		
			$client = new GuzzleHttp\Client();
			
			$client->post(WEBHOOKS_URL, [
				'headers' => [
			        'X-Action' => 'Site.New'
			    ],
			    'json' => $site
			]);
		
		}
		
	}
	
	// sends a webhook for a new user
	public static function NewUser($user){
		
		if(WEBHOOKS_URL != ''){
		
			$client = new GuzzleHttp\Client();
			
			$client->post(WEBHOOKS_URL, [
				'headers' => [
			        'X-Action' => 'User.New'
			    ],
			    'json' => $user
			    ]);
		
		}
		
	}
	
	// sends a webhook for a form submission
	public static function FormSubmit($form){
		
		if(WEBHOOKS_URL != ''){
		
			$client = new GuzzleHttp\Client();
			
			$client->post(WEBHOOKS_URL, [
				'headers' => [
			        'X-Action' => 'Form.Submit'
			    ],
			    'json' => $form
			    ]);
		
		}
		
	}


}
	
?>