<?php

namespace App\Respond\Models;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;
use App\Respond\Libraries\Webhooks;

use App\Respond\Models\Site;
use App\Respond\Models\User;

/**
 * Models submission
 */
class Submission {

  public $id;
  public $name;
  public $url;
  public $formId;
  public $date;
  public $fields;

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
   * lists all settings
   *
   * @param {files} $data
   * @return {array}
   */
  public static function listAll($siteId) {

    $file = app()->basePath().'/resources/sites/'.$siteId.'/submissions.json';

    $arr = array();

    if(file_exists($file)) {
      $arr = json_decode(file_get_contents($file), true);
    }

    // sort by last modified date
    usort($arr, function($a, $b) {
        $ts1 = strtotime($a['date']);
        $ts2 = strtotime($b['date']);
        return $ts2 - $ts1;
    });

    return $arr;

  }

  /**
   * Gets a submission by id
   *
   * @param {string} $id
   * @param {string} $email
   * @return {User}
   */
	public static function getById($id, $siteId){

    $submissions = Submission::listAll($siteId);

    foreach($submissions as $submission) {

      if($submission['id'] == $id) {

        return new Submission($submission);

      }

    }

    return NULL;

	}

	/**
   * Removes a submission
   *
   * @param {string} $siteId
   * @return Response
   */
  public function remove($siteId){

    // remove the user from JSON
    $json_file = app()->basePath().'/resources/sites/'.$siteId.'/submissions.json';

    if(file_exists($json_file)) {

      $json = file_get_contents($json_file);

      // decode json file
      $submissions = json_decode($json, true);
      $i = 0;

      foreach($submissions as $submission){

        // remove submission
        if($submission['id'] == $this->id) {
          unset($submissions[$i]);
        }

        $i++;

      }
      
      // prevent showing the index (e.g. "0":{})
      $json_arr = array_values($submissions);

      // re-encode json
      $json_text = json_encode($json_arr);

      file_put_contents($json_file, $json_text);

    }

    return TRUE;

  }

  /**
   * Saves a submission
   *
   * @param {string} $id the ID of the site
   * @return {Site}
   */
  public function save($siteId) {

    // defaults
    $dir = app()->basePath().'/resources/sites/'.$siteId.'/';
    $is_match = false;

    $submissions = Submission::listAll($siteId);

    // push this submission into the array
    array_push($submissions, (array)$this);

    // encode submissions
    $json = json_encode($submissions, JSON_PRETTY_PRINT);

    // save submissions.json
    Utilities::saveContent($dir, 'submissions.json', $json);

    // Add siteId to webhook data
    $wh_data = clone $this;
    $wh_data->siteId = $siteId;

    // send webhook
    Webhooks::FormSubmit($wh_data);

    return;

  }

}
