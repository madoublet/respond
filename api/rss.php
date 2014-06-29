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

        parse_str($this->request->data, $request); // parse request
        $siteUniqId = $request['siteUniqId'];

		// publish rss for page types
		Publish::PublishRssForPageTypes($siteUniqId);
		// return a json response
		return new Tonic\Response(Tonic\Response::OK); 

	}
}

?>