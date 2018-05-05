<?php
/*
 *  Routes specific to Respond PRO
 */
// test pro route
$app->get('/api/custom/example',
  function () { return App\Custom\Controllers\CustomController::example(); });

  ?>