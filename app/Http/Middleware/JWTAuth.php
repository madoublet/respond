<?php

namespace App\Http\Middleware;

use Closure;
use App\Respond\Libraries\Utilities;

class JWTAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        $auth = $request->header('X-AUTH');
        $token = NULL;

        if($auth != NULL) {
          $token = Utilities::ValidateJWTToken($auth);
          
          if($token != NULL) {
            // merge the userId, siteId and friendlyId into the request
            $request->merge(array('auth-email' => $token->email, 'auth-id' => $token->id));
          }
          else {
            return response('Unauthorized.', 401);
          }
          
        }
        else {
          return response('Unauthorized.', 401);
        }

        // continue
        return $next($request);

    }
}

