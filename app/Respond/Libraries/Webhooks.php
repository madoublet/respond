<?php

namespace App\Respond\Libraries;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\RequestException;
use Log;

class Webhooks
{

  /**
   * Wrapper to send a webhook for a new site
   *
   * @param {Site} $site
   * @return void
   */
	public static function NewSite($site){

    Webhooks::SendWebhook( 'Site.New', $site );

	}

  /**
   * Wrapper to send a webhook for a new user
   *
   * @param {User} $user
   * @return void
   */
	public static function NewUser($user){

    // Don't send the password, even if it is hashed
    unset( $user->password );

    Webhooks::SendWebhook( 'User.New', $user );

	}

  /**
   * Wrapper to send a webhook for a form submission
   *
   * @param {Form} $form
   * @return void
   */
	public static function FormSubmit($form){

    Webhooks::SendWebhook( 'Form.Submit', $form );

	}

  /**
   * Sends a webhook POST request. Silently logs error on failure.
   *
   * @param {Form} $form
   * @return void
   */
  public static function SendWebhook($action,$data) {

    if(env('WEBHOOKS_URL') != ''){

			$client = new Client();

      $request = array(
        'headers' => array('X-Action' => $action),
        'json' => $data
      );

      try {
          $response = $client->post(env('WEBHOOKS_URL'), $request);
      } catch (\GuzzleHttp\Exception\ClientException $e) {
        Log::error('Unable to send ' . $action . ' webhook. Remote server responded with HTTP status code ' . $e->getResponse()->getStatusCode() . ': ' . $e->getResponse()->getReasonPhrase() );
      } catch (\GuzzleHttp\Exception\RequestException $e) {
        Log::error('Unable to send ' . $action . ' webhook. Remote server responded with ' . $e->getMessage() );
      }

		}

  }

}
