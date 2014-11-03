<?php 

/**
 * This class defines an example resource that is wired into the URI /example
 * @uri /app/setup
 */
class AppSetupResource extends Tonic\Resource {

    /**
     * @method GET
     */
    function get() {
	    
	    $setup = array(
		    'debug' => DEBUG,
		    'url' => APP_URL,
		    'api' => API_URL,
		    'sites' => SITES_URL,
		    'site' => SITE_URL,
		    'terms' => TERMS_URL,
		    'themeId' => DEFAULT_THEME,
		    'logo' => BRAND_LOGO,
		    'icon' => BRAND_ICON,
		    'brand' => BRAND,
		    'language' => DEFAULT_LANGUAGE,
		    'stripePubKey' => STRIPE_PUBLISHABLE_KEY,
		    'paypalEmail' => PAYPAL_EMAIL,
		    'passcode' => PASSCODE,
		    'app' => BRAND,
		    'version' => VERSION,
		    'copy' => COPY,
		    'pricingLink' => PRICING_URL
	    );
	 
        $response = new Tonic\Response(Tonic\Response::OK);
        $response->contentType = 'application/json';
        $response->body = json_encode($setup);

        return $response;
    }
}