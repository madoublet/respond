<?php

namespace App\Respond\Models;

use App\Respond\Libraries\Utilities;
use App\Respond\Libraries\Publish;

use App\Respond\Models\Menu;

/**
 * Models a menu item
 */
class FormField {

  public $id;
  public $label;
  public $type;
  public $required;
  public $options;
  public $helperText;
  public $placeholder;
  public $cssClass;

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
   * lists all form fields
   *
   * @param {files} $data
   * @return {array}
   */
  public static function listAll($id, $siteId) {

    $file = app()->basePath().'/public/sites/'.$siteId.'/data/forms/'.$id.'.json';

    $arr = array();

    if(file_exists($file)) {
      $json = json_decode(file_get_contents($file), true);

      $arr = $json['fields'];
    }

    return $arr;

  }

  /**
   * Adds a form field
   *
   * @param {string} $id
   * @param {string} $type
   * @param {string} $required
   * @param {string} $options
   * @param {string} $helperText
   * @param {string} $placeholder
   * @param {string} $cssClass
   * @param {string} $formId
   * @param {string} $siteId
   * @return {array}
   */
  public static function add($id, $label, $type, $required, $options, $helperText, $placeholder, $cssClass, $formId, $siteId) {

    $form = Form::getById($formId, $siteId);

    $field = array(
      'id' => $id,
      'label' => $label,
      'type' => $type,
      'required' => $required,
      'options' => $options,
      'helperText' => $helperText,
      'placeholder' => $placeholder,
      'cssClass' => $cssClass,
      );

    array_push($form->fields, $field);

    $form->save($siteId);

    return $form;

  }

}