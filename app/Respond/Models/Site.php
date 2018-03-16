<?php

namespace App\Respond\Models;

use \DateTime;
use \DateTimeZone;
use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;
use App\Respond\Libraries\Webhooks;

/**
 * Models a site
 */
class Site {

  public $id;
  public $name;
  public $email;
  public $theme;
  public $supportsFriendlyUrls;
  public $timeZone;
  /**
   * Active => Normal, no message
   * Message => Show Message
   */
  public $status;
  public $messageColor;
  public $messageText;
  public $messageLink;
  public $startDate;

  public static $ISO8601 = "Y-m-d\TH:i:sO";

  /**
   * Constructs a page from an array of data
   *
   * @param {arr} $data
   */
  function __construct(array $data) {
    foreach($data as $key => $val) {
      if(property_exists(__CLASS__,$key)) {
        $this->$key = $val;
      }
    }

    // fallback to env setting if not set on site
    if(isset($this->supportsFriendlyUrls) === false) {
      $this->supportsFriendlyUrls = env('FRIENDLY_URLS');
    }

    // fallback for timezone
    if(isset($this->timeZone) === false) {

      $this->timeZone = 'America/Chicago';

      if(env('TIMEZONE')) {
        $this->timeZone = env('TIMEZONE');
      }

    }

    // fallback for status
    if(isset($this->status) === false) {
      $this->status = 'active';
    }
    else {
      $this->status = strtolower($this->status);
    }
    
    // fallback for color
    if(isset($this->messageColor) === false) {
      $this->messageColor = 'none';
    }
    
    // fallback for text
    if(isset($this->messageText) === false) {
      $this->messageText = '';
    }
    
    // fallback for link
    if(isset($this->messageLink) === false) {
      $this->messageLink = '';
    }

    // fallback for startDate
    if(isset($this->startDate) === false) {
      $this->startDate = date(Site::$ISO8601, time());
    }

  }

  /**
   * Activates a site
   *
   * @return {Site}
   */
  public function activate() {

    $this->status = 'Active';
    $this->save();

  }
  
  /**
   * updates a site
   *
   * @param {string} $name
   * @param {string} $email
   * @param {string} $status
   * @param {string} $messageColor
   * @param {string} $messageText
   * @param {string} $messageLink
   * @return {Site}
   */
  public function update($name, $email, $status, $messageColor, $messageText, $messageLink) {

    $this->name = $name;
    $this->email = $email;
    $this->status = $status;
    $this->messageColor = $messageColor;
    $this->messageText = $messageText;
    $this->messageLink = $messageLink;
    
    $this->save();

  }
  
  /**
   * Saves a site
   *
   * @param {string} $id the ID for the user
   * @return {Site}
   */
  public function save() {

    $dir = app()->basePath().'/resources/sites/'.$this->id.'/';

    $json = json_encode($this, JSON_PRETTY_PRINT);

    // save site.json
    Utilities::saveContent($dir, 'site.json', $json);

  }

  /**
   * Calculate the days remaining
   *
   * @param {string} $id the ID for the user
   * @return {Site}
   */
  public function daysRemaining() {

    // get trial length
    $trialLength = 30;

    if(env('TRIAL_LENGTH')) {
      $trialLength = env('TRIAL_LENGTH');
    }

    // get timezone
    $local = new DateTimeZone($this->timeZone);

    // get start date
    $startDate = DateTime::createFromFormat("Y-m-d\TH:i:sO", $this->startDate);
    $startDate->setTimezone($local);

    $startDate->add(date_interval_create_from_date_string($trialLength.' days'));

    // get now
    $now = new DateTime('NOW');
    $now->setTimezone($local);

    $daysLeft = $now->diff($startDate);

    return $daysLeft->format('%R%a');

  }

  /**
   * Gets a site for a given Id
   *
   * @param {string} $id the ID for the user
   * @return {Site}
   */
	public static function getById($id) {

    $file = app()->basePath().'/resources/sites/'.$id.'/site.json';

    if(file_exists($file)) {

      try {
        $arr = json_decode(file_get_contents($file), true);

        return new Site($arr);
      }
      catch (ParseException $e) {
        return NULL;
      }

    }
    else {
      return NULL;
    }

	}



	/**
   * Gets a site for a given id
   *
   * @param {string} $id
   * @return {Site}
   */
	public static function isIdUnique($id) {

    $file = app()->basePath().'/public/sites/'.$id;

    if(file_exists($file)) {

      return FALSE;
    }
    else {

      return TRUE;

    }

	}

	/**
   * Create a site for a given name, theme, email, password
   *
   * @param {string} $id the ID for the user
   * @return {Site}
   */
	public static function create($name, $theme, $user, $add_user_to_site) {

    // prevent directory names in theme
    $theme = basename($theme);

	  // create an id
	  $id = strtolower($name);

    // replaces all spaces with hyphens
    $id = str_replace(' ', '-', $id);

    // remove any slashes, dots
    $id = str_replace('/', '', $id);
    $id = str_replace('\\', '', $id);
    $id = str_replace('.', '', $id);

    // replaces all spaces with hyphens
    $id = $new_id =  preg_replace('/[^A-Za-z0-9\-]/', '', $id);

    // find a unique $id (e.g. myid, myid1, myid2, etc.)
    $x = 1;
    $folder = app()->basePath().'/public/sites/'.$id;

    while(file_exists($folder) === TRUE) {

      // increment id and folder
      $new_id = $id.$x;
      $folder = app()->basePath().'/public/sites/'.$new_id;
      $x++;

    }

    // set id to new_id
    $id = $new_id;

    // default friendly id setting to the app
    $supportsFriendlyUrls = env('FRIENDLY_URLS');

    $timeZone = 'America/Chicago';

    // default timezone to app
    if(env('TIMEZONE')) {
      $timeZone = env('TIMEZONE');
    }

    $status = 'Active';

    if(env('DEFAULT_STATUS')) {
      $status = env('DEFAULT_STATUS');
    }

    // create a site
    $site_arr = array(
      'id' => $id,
      'name' => $name,
      'email' => $user->email,
      'theme' => $theme,
      'supportsFriendlyUrls' => $supportsFriendlyUrls,
      'timeZone' => $timeZone,
      'status' => $status,
      'customerId' => ''
    );

    // create and save the site
  	$site = new Site($site_arr);
  	$site->save();

    // add the user to the site (if required)
  	if($add_user_to_site == TRUE) {
    	$user->addSite($site->id, 'admin');
  	}

    // copy theme
    Publish::copyTheme($theme, $site);

    // copy theme
    Publish::copyPlugins($site);

    // combine CSS
    Publish::combineCSS($site);

    // combine JS
    Publish::combineJS($site);

    // publish plugins
    Publish::publishPlugins($user, $site);

    // get default status
    $status = 'active';
    $message_color = '';
    $message_text = '';
    $message_link = '';

    // set default default status
    if(env('DEFAULT_STATUS') == NULL) {
      $status = env('DEFAULT_STATUS');
    }
    
    // set default message color
    if(env('DEFAULT_MESSAGE_COLOR') == NULL) {
      $message_color = env('DEFAULT_MESSAGE_COLOR');
    }
    
    // set default message text
    if(env('DEFAULT_MESSAGE_TEXT') == NULL) {
      $message_text = env('DEFAULT_MESSAGE_TEXT');
    }
    
    // set default message link
    if(env('DEFAULT_MESSAGE_LINK') == NULL) {
      $message_link = env('DEFAULT_MESSAGE_LINK');
    }

    // return site information
    return array(
      'id' => $id,
      'name' => $name,
      'email' => $user->email,
      'theme' => $theme,
      'supportsFriendlyUrls' => $supportsFriendlyUrls,
      'timeZone' => $timeZone,
      'status' => $status,
      'messageColor' => $message_color,
      'messageText' => $message_text,
      'messageLink' => $message_link,
      'startDate' => date(Site::$ISO8601, time())
      );

  }

  /**
   * Lists all sites
   *
   * @return Response
   */
  public static function getSites()
  {
    // get base path for the site
    $dir = app()->basePath().'/resources/sites';

    $arr = glob($dir . '/*' , GLOB_ONLYDIR);

    foreach($arr as &$item) {
      $item = basename($item);
    }

    return $arr;
  }


}
