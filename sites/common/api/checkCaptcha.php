<?php

/**
 * A public method to check reCaptcha field on form submissions to Respond
 * @uri /checkCaptcha
 */
class CheckCaptchaResource extends Tonic\Resource {

    /* Test if the text introduced in reCaptcha field is correct */
	/**
	 * @method POST
	 */
    function checkCaptcha() {
    	// parse request
    	parse_str($this->request->data, $request);

    	$siteUniqId = SITE_UNIQ_ID;
    	$pageUniqId = $request['pageUniqId'];
    	$recaptcha_challenge_field = $request['recaptcha_challenge_field'];
    	$recaptcha_response_field = $request['recaptcha_response_field'];

    	require_once('../libs/recaptchalib.php');
    	$site = Site::GetBySiteUniqId($siteUniqId);
    	$resp = recaptcha_check_answer ($site['FormPrivateId'],
    			$_SERVER["REMOTE_ADDR"],
    			$recaptcha_challenge_field,
    			$recaptcha_response_field);

    	$response = new Tonic\Response(Tonic\Response::OK);
    	$response->contentType = 'text/html';
    	if ($resp->is_valid) {
    		$response->body = 'OK';
    	} else {
    		$response->body = 'NOK';
    	}
    	return $response;
    }
}

?>