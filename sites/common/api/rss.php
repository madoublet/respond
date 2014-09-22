<?php


/**
 * This is a public API call to publish a rss feeds
 * @uri /rss/publish
 */
class RssResource extends Tonic\Resource {

    /**
     * @method POST
     */
    function publish() {

        $siteUniqId = SITE_UNIQ_ID;
		$root = '../../../';

		// publish rss for page types
		Publish::PublishRssForPageTypes($siteUniqId, $root);
		// return a json response
		return new Tonic\Response(Tonic\Response::OK); 

	}
}

?>