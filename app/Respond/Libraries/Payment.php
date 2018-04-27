<?php

namespace App\Respond\Libraries;

use App\Respond\Models\Site;
use App\Respond\Models\Setting;
use App\Respond\Libraries\Utilities;

// Class to support cart payment activities
class Payment
{

  private static $DOWNLOAD_TOKEN = "RSP123";

  public $site;
  public $stripe_secret_key;
  public $flat_rate_shipping;
  public $tax_rate;
  public $locale;
  public $currency;
  public $money_format;
  public $email;
  public $receipt_subject;
  public $confirmation_subject;

  /**
   * Constructs a page from an array of data
   *
   * @param {arr} $data
   */
  function __construct($site) {

    $this->site = $site;

    $this->stripe_secret_key = Setting::getById('cart-stripe-secret-key', $site->id);
    $this->flat_rate_shipping = Setting::getById('cart-flat-rate-shipping', $site->id);
    $this->tax_rate = Setting::getById('cart-tax-rate', $site->id);
    $this->currency = Setting::getById('cart-currency', $site->id);
    $this->locale = Setting::getById('cart-locale', $site->id);
    $this->receipt_subject = Setting::getById('receipt-subject', $site->id);
    $this->confirmation_subject = Setting::getById('confirmation-subject', $site->id);

    // set money format
    if($this->currency == 'USD') {
      $this->money_format = '$%i';
    }
    else {
      '%i';
    }

  }


  /**
   * Handles the pay function for the Cart
   *
   * @return Response
   */
	public function pay($token, $email, $items, $name) {

    // set locale, format for money_format()
    setlocale(LC_MONETARY, $this->locale);

    $fmt = $this->money_format;

    // get total
    $total = $this->calculateTotal($items);
    $tax = 0;
    $shipping = 0;
    $final_total = $total;

    // add tax and shipping (if items are greater than 0)
    if($total > 0) {
      $shipping = $this->calculateShipping($items);

      // calc tax
      $tax = $total * $this->tax_rate;

      // calc final total
      $final_total = $tax + $total + $shipping;
    }

    // create a charge if total is greater than 0
    if($total > 0) {

      // set your secret key: remember to change this to your live secret key in production (https://dashboard.stripe.com/account/apikeys)
      \Stripe\Stripe::setApiKey($this->stripe_secret_key);

      // charge the cards (convert dollars to cents for amount)
      $charge = \Stripe\Charge::create(array(
        "amount" => round($final_total * 100),
        "currency" => "usd",
        "description" => $name,
        "source" => $token,
      ));

      // save charge to charges JSON file
      if($charge->paid == true) {

        $final_total_text = money_format($fmt, ($charge->amount/100));

        $this->sendReceipt($email, $charge->id, $items, $tax, $shipping, $final_total_text);
        $this->sendConfirmation($email, $charge->id, $items, $tax, $shipping, $final_total_text);
        $html = $this->getDownloadHTML($email, $items);

      }
      else {
        return array(
          "isSuccessful" => FALSE,
          "message" => "Payment not successful"
        );
      }
    }

    // send successful response
    return array(
          "isSuccessful" => TRUE,
          "message" => $html
        );
  }

  /**
   * Handles the pay function for the Cart
   *
   * @return Response
   */
	public function subscribe($token, $email, $items, $name) {

    // set locale, format for money_format()
    setlocale(LC_MONETARY, $this->locale);

    $fmt = $this->money_format;

    // get sku from items
    $sku = $items[0]['sku'];

    // retrieve product from SKU
    $product = $this->retrieveProduct($sku);

    // create a charge if total is greater than 0
    if($product != NULL) {

      if(isset($product['plan'])) {

        // set your secret key: remember to change this to your live secret key in production (https://dashboard.stripe.com/account/apikeys)
        \Stripe\Stripe::setApiKey($this->stripe_secret_key);

        try {

          // create customer
          $customer = \Stripe\Customer::create(array(
            'email' => $email,
            'source'  => $token
          ));

          // subscribe customer to plan
          $subscription = \Stripe\Subscription::create([
            'customer' => $customer->id,
            'items' => [['plan' => $product['plan']]],
          ]);

          $tax = 0;
          $shipping = 0;
          $final_total_text = $product['planPrice'];

          // send emails
          $this->sendReceipt($email, $customer->id, $items, $tax, $shipping, $final_total_text);
          $this->sendConfirmation($email, $customer->id, $items, $tax, $shipping, $final_total_text);

          return array(
            "isSuccessful" => TRUE,
            "message" => ""
          );

        }
        catch(Exception $e) {

          return array(
            "isSuccessful" => FALSE,
            "message" => "Stripe error."
          );

        }

      }
      else {
        return array(
          "isSuccessful" => FALSE,
          "message" => "Plan not specified for product."
        );
      }

    }

    // send successful response
    return array(
          "isSuccessful" => FALSE,
          "message" => "Unspecified error."
        );
  }


  /**
   * Calculates the total	 for the selected items
   *
   * @return Response
   */
  public function calculateTotal($items) {

    $total = 0;

    // get total
    foreach($items as $key => $value) {

      $product = $this->retrieveProduct($value['sku']);
      $price = $product['price'];
      $total += $price * $value['quantity'];
    }

    return $total;

  }

  /**
   * Calculates shipping for the selected items
   *
   * @return Response
   */
  public function calculateShipping($items) {

    $has_items_shipped = false;

    // get total
    foreach($items as $key => $value) {

      $product = $this->retrieveProduct($value['sku']);

      if(isset($product['shipped'])) {
        if($product['shipped'] == true) {
          $has_items_shipped = true;
        }
      }

    }

    if($has_items_shipped == true) {
      return $this->flat_rate_shipping;
    }
    else {
      return 0;
    }

  }

  /**
   * Sends a receipt to the customer
   *
   * @return Response
   */
  public function sendReceipt($email, $referenceId, $items, $tax, $shipping, $final_total_text) {

    $file = app()->basePath().'/public/sites/'.$this->site->id.'/resources/emails/receipt.html';

    // fall back to the default
    if(!file_exists($file)) {
      $file = app()->basePath().'/resources/plugins/resources/resources/emails/receipt.html';
    }

    // create content
    $content = '';

    // walk through form fields
    foreach($items as $key => $value) {

      // retrieve price
      $price = $this->retrievePrice($value['sku']);

      // set email content
      $content .= '<tr><td style="border-bottom: 1px solid #ddd; padding: 5px;">'.$value['name'] .'<br><small>' . $value['sku'] . '</small></td>' .
                '<td align="right" style="border-bottom: 1px solid #ddd; padding: 5px;">'.$value['quantity'].'</td>' .
                '<td align="right" style="border-bottom: 1px solid #ddd; padding: 5px;">'.money_format($this->money_format, $price) .'</td><tr>';
    }

    // create totals block
    $totals = '';

    if($tax > 0) {
      $totals .= '<tr><td colspan="2" align="right" style="border-bottom: 1px solid #ddd; padding: 5px;">Tax:</td><td align="right" style="border-bottom:    1px solid #ddd; padding: 5px;">' . money_format($fmt, $tax) . '</td></tr>';
    }
    if($shipping > 0) {
      $totals .= '<tr><td colspan="2" align="right" style="border-bottom: 1px solid #ddd; padding: 5px;">Shipping:</td><td align="right" style="border-bottom:    1px solid #ddd; padding: 5px;">' . money_format($fmt, $shipping) . '</td></tr>';
    }
    $totals .= '<tr><td colspan="2" align="right" style="border-bottom: 1px solid #ddd; padding: 5px;">Total:</td><td align="right" style="border-bottom:    1px solid #ddd; padding: 5px;">' . $final_total_text . '</td></tr>';


    $replace = array(
      '{{id}}' => $referenceId,
      '{{content}}' => $content,
      '{{totals}}' => $totals
    );

    // setup email
    $to = $email;
    $from = $this->site->email;
    $fromName = $this->site->name;
    $subject = $this->receipt_subject;

    // send email from file
    Utilities::sendEmailFromFile($to, $from, $fromName, $subject, $replace, $file);

  }

  /**
   * Sends confirmation to the site owner
   *
   * @return Response
   */
  public function sendConfirmation($email, $referenceId, $items, $tax, $shipping, $final_total_text) {

    $file = app()->basePath().'/public/sites/'.$this->site->id.'/resources/emails/receipt.html';

    // fall back to the default
    if(!file_exists($file)) {
      $file = app()->basePath().'/resources/plugins/resources/resources/emails/receipt.html';
    }

    // create content
    $content = '';

    // walk through items
    foreach($items as $key => $value) {

      // retrieve price
      $price = Payment::retrievePrice($value['sku']);

      // set email content
      $content .= '<tr><td style="border-bottom: 1px solid #ddd; padding: 5px;">'.$value['name'] .'<br><small>' . $value['sku'] . '</small></td>' .
                '<td align="right" style="border-bottom: 1px solid #ddd; padding: 5px;">'.$value['quantity'].'</td>' .
                '<td align="right" style="border-bottom: 1px solid #ddd; padding: 5px;">'.money_format($this->money_format, $price) .'</td><tr>';
    }

    // create totals block
    $totals = '';

    if($tax > 0) {
      $totals .= '<tr><td colspan="2" align="right" style="border-bottom: 1px solid #ddd; padding: 5px;">Tax:</td><td align="right" style="border-bottom:    1px solid #ddd; padding: 5px;">' . money_format($fmt, $tax) . '</td></tr>';
    }
    if($shipping > 0) {
      $totals .= '<tr><td colspan="2" align="right" style="border-bottom: 1px solid #ddd; padding: 5px;">Shipping:</td><td align="right" style="border-bottom:    1px solid #ddd; padding: 5px;">' . money_format($fmt, $shipping) . '</td></tr>';
    }
    $totals .= '<tr><td colspan="2" align="right" style="border-bottom: 1px solid #ddd; padding: 5px;">Total:</td><td align="right" style="border-bottom:    1px solid #ddd; padding: 5px;">' . $final_total_text . '</td></tr>';

    $replace = array(
      '{{id}}' => $referenceId,
      '{{content}}' => $content,
      '{{totals}}' => $totals
    );

    // setup email
    $to = $this->site->email;
    $from = $this->site->email;
    $fromName = $this->site->name;
    $subject = $this->confirmation_subject;

    // send email from file
    Utilities::sendEmailFromFile($to, $from, $fromName, $subject, $replace, $file);

  }

  /**
   * Retrieves the HTML to enable downloads
   *
   * @return Response
   */
  public function getDownloadHTML($email, $items) {

    // init html
    $download_html = '';

    // walk through purchased items
    foreach($items as $key => $value) {

      $sku = $value['sku'];

      if($this->hasDownload($sku)) {
        $passcode = $this->generatePasscode($email, $sku);
        $download_html = '<a href="api/download.php?' .
                          'email=' . urlencode($email) .
                          '&sku=' . urlencode($sku) .
                          '&passcode=' . urlencode($passcode) . '">' .
                          'Download ' . $value['name'] .'</a>';
      }
    }

    return $download_html;

  }

  /**
   * Determine if a SKU has a download
   *
   * @param {obj} $charge - Stripe/Charge
   * @param {arr[]} array of items in the cart
   * @return void
   */
  public function hasDownload($sku) {

    $product = $this->retrieveProduct($sku);

    if(isset($product['file'])) {

      if($product['file'] != '') {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }

  }


  /**
   * Generates a passcode to download files
   *
   * @param {string} $email the recipient's email address
   * @param {string} $sku the product sku
   * @return void
   */
  public static function generatePasscode($email, $sku) {

    $download_token = Payment::$DOWNLOAD_TOKEN;

    // break down email
    $email_parts = explode("@", $email);
    $email_first_part = $email_parts[0];

    // get first 6 characters of $email (if applicable)
    if(strlen($email_first_part) > 6) {
      $email_first_part = substr($email_first_part, 0, 6);
    }

    // get first 6 characters of $ (if applicable)
    if(strlen($sku) > 6) {
      $sku = substr($sku, 0, 6);
    }

    $password = 'respond12345' . $email_first_part . $sku;

    return password_hash($password, PASSWORD_DEFAULT);

  }

  /**
   * Generates a passcode to download files
   *
   * @param {string} $email the recipient's email address
   * @param {string} $sku the product sku
   * @return void
   */
  public static function validatePasscode($email, $sku, $passcode) {

    $download_token = Payment::$DOWNLOAD_TOKEN;

    // break down email
    $email_parts = explode("@", $email);
    $email_first_part = $email_parts[0];

    // get first 6 characters of $email (if applicable)
    if(strlen($email_first_part) > 6) {
      $email_first_part = substr($email_first_part, 0, 6);
    }

    // get first 6 characters of $ (if applicable)
    if(strlen($sku) > 6) {
      $sku = substr($sku, 0, 6);
    }

    $password = $download_token . $email_first_part . $sku;

    // verify passcode
    if(password_verify($password, $passcode)) {
        return TRUE;
    }
    else {
        return FALSE;
    }

  }

  /**
   * Retrieves price for a given SKU
   *
   * @param {obj} $charge - Stripe/Charge
   * @param {arr[]} array of items in the cart
   * @return void
   */
  public function retrievePrice($sku) {

    $product = $this->retrieveProduct($sku);

    if($product != NULL) {
      return $product['price'];
    }
    else {
      return NULL;
    }

  }

  /**
   * Retrieves product for a given SKU
   *
   * @param {obj} $charge - Stripe/Charge
   * @param {arr[]} array of items in the cart
   * @return void
   */
  public function retrieveProduct($sku) {

    $products_file = app()->basePath().'/public/sites/'.$this->site->id.'/data/products.json';

    $products = array();

    if(file_exists($products_file)) {
      $products = json_decode(file_get_contents($products_file), true);
    }

    // determine if SKU has a download
    foreach($products as $product) {

      if($product['id'] == $sku) {
        return $product;
      }

    }

    return NULL;

  }


}