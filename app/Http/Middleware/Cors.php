<?php

namespace App\Http\Middleware;

use Closure;
use App\Respond\Libraries\Utilities;

class Cors
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

      $response = $next($request);

      $response->header('Access-Control-Allow-Origin','*');

      return $response;


      /*
        return $next($request)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); */

    }
}

