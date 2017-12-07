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
   * [Active | Trial | Failed | Unsubscribed]
   * Active -> Subscribed
   * Trial -> In Trial Period
   * Failed -> Failed Charge
   * Unsubscribed -> Customer selected Unsubscribe
   */
  public $status;
  public $startDate;
  public $customerId;

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
      $this->status = 'Active';
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
   * Gets a site by $customerId
   *
   * @param {string} $customerId - Stripe CustomerID
   * @return {Site}
   */
  public static function getSiteByCustomerId($customerId)
  {
    // get base path for the site
    $dir = app()->basePath().'/resources/sites';

    $arr = glob($dir . '/*' , GLOB_ONLYDIR);

    foreach($arr as &$item) {
      $id = basename($item);

      // get site
      $site = Site::getById($id);

      if($site != NULL) {
        if($site->customerId == $customerId) {
          return $site;
        }
      }
    }

    return null;
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
	public static function create($name, $theme, $email, $password) {

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
      'email' => $email,
      'theme' => $theme,
      'supportsFriendlyUrls' => $supportsFriendlyUrls,
      'timeZone' => $timeZone,
      'status' => $status,
      'customerId' => ''
    );

    // create and save the site
  	$site = new Site($site_arr);
  	$site->save();

    // send new site hook
    Webhooks::NewSite($site);

    // create and save the user
    $user = new User(array(
      'email' => $email,
      'password' => password_hash($password, PASSWORD_DEFAULT),
      'firstName' => 'New',
      'lastName' => 'User',
      'language' => 'en',
      'photo' => '',
      'token' => ''
    ));

    $user->save($site->id);

    // publish theme
    Publish::publishTheme($theme, $site);

    // publish plugins
    Publish::publishPlugins($user, $site);

    // get default status
    $status = 'Active';

    // set as default status
    if(env('DEFAULT_STATUS') == NULL) {
      $status = env('DEFAULT_STATUS');
    }


    // return site information
    return array(
      'id' => $id,
      'name' => $name,
      'email' => $email,
      'theme' => $theme,
      'supportsFriendlyUrls' => $supportsFriendlyUrls,
      'timeZone' => $timeZone,
      'status' => $status,
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
