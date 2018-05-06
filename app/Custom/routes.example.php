<?php

/*
 *  Sample routes
 */

// Unauthenticated route
$app->get('/api/custom/example1',
  function () { return App\Custom\Controllers\CustomController::example(); });

// Authenticated (requires app login) route
$app->get('/api/custom/example2', ['middleware' => 'jwtauth',
  function () { return App\Custom\Controllers\CustomController::authExample(app('request')); } ]);

// Authenticated (requires app login) route with parameter
$app->get('/api/custom/example3/{param}', ['middleware' => 'jwtauth',
  function ($param) { return App\Custom\Controllers\CustomController::authExampleWithParameter(app('request'), $param); } ]);

// Open route to access server from external website
$app->get('/api/custom/example4/{param}', ['middleware' => 'cors',
  function ($param) { return App\Custom\Controllers\CustomController::corsExampleWithParameter(app('request'), $param); } ]);

  ?>