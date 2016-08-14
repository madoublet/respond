<?php

namespace App\Respond\Models;

use App\Respond\Libraries\Utilities;

use App\Respond\Libraries\Publish;

/**
 * Models a site
 */
class Site {

  public $id;
  public $name;
  public $email;
  public $theme;

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
   * Gets a site for a given Id
   *
   * @param {string} $id the ID for the user
   * @return {Site}
   */
	public static function create($name, $theme, $email, $password) {

	  // create an id
	  $id = strtolower($name);

    // replaces all spaces with hyphens
    $id = str_replace(' ', '-', $id);

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

    // create a site
    $site_arr = array(
      'id' => $id,
      'name' => $name,
      'email' => $email,
      'theme' => $theme
    );

    // create and save the site
  	$site = new Site($site_arr);
  	$site->save();

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

    // return site information
    return array(
      'id' => $id,
      'name' => $name
      );

  }


}