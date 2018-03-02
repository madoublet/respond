<?php

namespace App\Http\Controllers;

use App\Respond\Models\Site;
use App\Respond\Models\Setting;
use App\Respond\Libraries\Payment;

use \Illuminate\Http\Request;


class PaymentController extends Controller
{

  /**
   * Subscribes a user via Stripe
   *
   * @return Response
   */
  public static function subscribe(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get token
    $stripeToken = $request->json()->get('token');
    $stripeEmail = $request->json()->get('email');

    // get site
    $site = Site::getById($siteId);

    try {

      // #ref https://stripe.com/docs/recipes/subscription-signup
      \Stripe\Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

      $customer = \Stripe\Customer::create(array(
        'email' => $stripeEmail,
        'source'  => $stripeToken,
        'plan' => env('STRIPE_PLAN')
      ));

      // activate
      $site->status = 'Active';
      $site->customerId = $customer->id;
      $site->save();

      return response('Ok', 200);
    }
    catch(Exception $e)
    {
      return response('Unable to subscribe', 401);
    }

  }

  /**
   * Subscribes a user via Stripe
   *
   * @return Response
   */
  public static function retrieveSubscription(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get token
    $stripeToken = $request->json()->get('token');
    $stripeEmail = $request->json()->get('email');

    // get site
    $site = Site::getById($siteId);

    if($site->customerId != '') {

      try {

        // #ref https://stripe.com/docs/recipes/subscription-signup
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        $customer = \Stripe\Customer::retrieve($site->customerId);
        $subscription = NULL;

        // retrieve all subscriptions
        $subscriptions = $customer->subscriptions->all();

        // init sub array
        $subs_arr = array();

        if(sizeof($subscriptions) > 0) {
          $subscription = $subscriptions->data[0];
        }

        /*
        foreach ($subscriptions->data as $subscription) {
            array_push($subs_arr, $subscription);
        } */

        // return subscription data
        $arr = array(
          "customerId" => $site->customerId,
          "subscriptionId" => $subscription->id,
          "created" => $subscription->created,
          "currentPeriodStart" => $subscription->current_period_start,
          "currentPeriodEnd" => $subscription->current_period_end,
          "planId" => $subscription->items->data[0]->plan->id,
          "amount" => $subscription->items->data[0]->plan->amount,
          "currency" => $subscription->items->data[0]->plan->currency,
          "interval" => $subscription->items->data[0]->plan->interval,
          "name" => $subscription->items->data[0]->plan->name
        );


        return response()->json($arr);
      }
      catch(Exception $e)
      {
        return response('Customer does not exist', 401);
      }

    }

    return response('Customer does not exist', 401);

  }

  /**
   * Unsubscribes a user via Stripe
   *
   * @return Response
   */
  public static function unsubscribe(Request $request)
  {

    // get request data
    $email = $request->input('auth-email');
    $siteId = $request->input('auth-id');

    // get token
    $stripeToken = $request->json()->get('token');
    $stripeEmail = $request->json()->get('email');

    // get site
    $site = Site::getById($siteId);

    if($site->customerId != '') {

      try {

        // #ref https://stripe.com/docs/recipes/subscription-signup
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        $customer = \Stripe\Customer::retrieve($site->customerId);
        $subscription = NULL;

        // retrieve all subscriptions
        $subscriptions = $customer->subscriptions->all();

        // init sub array
        $subs_arr = array();

        if(sizeof($subscriptions) > 0) {
          $subscription = $subscriptions->data[0];
        }

        // unsubscribe from stripe
        $current_subscription = \Stripe\Subscription::retrieve($subscription->id);
        $current_subscription->cancel();

        // set site status back to trial
        $site->status = 'Trial';
        $site->save();

        return response('Subscription cancelled', 200);
      }
      catch(Exception $e)
      {
        return response('Customer does not exist', 401);
      }

    }

    return response('Customer does not exist', 401);

  }

  /**
   * Subscribes a user via Stripe
   *
   * @return Response
   */
  public static function subscribeAtSite(Request $request, $id)
  {

    // get request data
    $siteId = $id;

    // get token
    $token = $request->json()->get('token');
    $email = $request->json()->get('email');
    $items = $request->json()->get('items');
    $name = $request->json()->get('name');

    // get site
    $site = Site::getById($siteId);

    // handle payment
    $payment = new Payment($site);

    $obj = $payment->subscribe($token, $email, $items, $name);

    // return true
    if($obj['isSuccessful'] == TRUE) {
      return response($obj['message'], 200);
    }
    else {
      return response($obj['message'], 400);
    }

  }

  /**
   * Pays via Stripe
   *
   * @return Response
   */
  public static function payAtSite(Request $request, $id)
  {

    // get request data
    $siteId = $id;

    // get token
    $token = $request->json()->get('token');
    $email = $request->json()->get('email');
    $items = $request->json()->get('items');
    $name = $request->json()->get('name');

    // get site
    $site = Site::getById($siteId);

    // handle payment
    $payment = new Payment($site);

    $obj = $payment->pay($token, $email, $items, $name);

    // return true
    if($obj['isSuccessful'] == TRUE) {
      return response($obj['message'], 200);
    }
    else {
      return response($obj['message'], 400);
    }


  }


}