<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

// handle Angular app routes
$app_routes = array('/', 'login', 'create', 'pages', 'components', 'users', 'files', 'plugins', 'menus', 'forms', 'submissions', 'branding', 'settings', 'galleries', 'edit', 'developer', 'code');

foreach($app_routes as $app_route) {

  // load the angular app at index.html
  $app->get($app_route, function () use ($app) {
      $public = rtrim(app()->basePath('public/index.html'), '/');

      return file_get_contents($public);
  });

}

// the login/my-site route should load the angular2 app
$app->get('login/{id}', function ($id) {
    $public = rtrim(app()->basePath('public/index.html'), '/');

    return file_get_contents($public);
});

// the login/my-site route should load the angular2 app
$app->get('forgot/{id}', function ($id) {
    $public = rtrim(app()->basePath('public/index.html'), '/');

    return file_get_contents($public);
});

// the edit route should load the angular2 app
$app->get('edit/{id}', function ($id) {
    $public = rtrim(app()->basePath('public/index.html'), '/');

    return file_get_contents($public);
});

// the code route should load the angular2 app
$app->get('code/{id}', function ($id) {
    $public = rtrim(app()->basePath('public/index.html'), '/');

    return file_get_contents($public);
});

// the login/my-site route should load the angular2 app
$app->get('reset/{id}/{token}', function ($id) {
    $public = rtrim(app()->basePath('public/index.html'), '/');

    return file_get_contents($public);
});

// handles editing
$app->get('/edit', 'EditController@edit');

// handles code editing
$app->get('/api/code/retrieve', ['middleware' => 'jwtauth', 'uses'=> 'CodeController@retrieve']);
$app->post('/api/code/save', ['middleware' => 'jwtauth', 'uses'=> 'CodeController@save']);
$app->post('/api/code/add', ['middleware' => 'jwtauth', 'uses'=> 'CodeController@add']);
$app->get('/api/code/list/{id}', ['middleware' => 'jwtauth', 'uses'=> 'CodeController@listAll']);
$app->post('/api/code/upload/{type}', ['middleware' => 'jwtauth', 'uses'=> 'CodeController@upload']);

// checks auth status
$app->get('/api/auth', ['middleware' => 'jwtauth', 'uses'=> 'UserController@auth']);

// test site
$app->get('/api/sites/test', 'SiteController@test');

// app
$app->get('/api/app/settings', 'AppController@settings');
$app->get('/api/app/css', 'AppController@appCSS');
$app->get('/api/editor/css', 'AppController@editorCSS');
$app->get('/api/themes/list', 'AppController@listThemes');
$app->get('/api/languages/list', 'AppController@listLanguages');

// site
$app->post('/api/sites/create', 'SiteController@create');
$app->post('/api/sites/activate', 'SiteController@activate');
$app->post('/api/sites/subscribe', ['middleware' => 'jwtauth', 'uses'=> 'SiteController@subscribe']);
$app->post('/api/sites/unsubscribe', ['middleware' => 'jwtauth', 'uses'=> 'SiteController@unsubscribe']);
$app->get('/api/sites/subscription/retrieve', ['middleware' => 'jwtauth', 'uses'=> 'SiteController@retrieveSubscription']);
$app->get('/api/sites/reload', ['middleware' => 'jwtauth', 'uses'=> 'SiteController@reload']);
$app->get('/api/sites/sitemap', ['middleware' => 'jwtauth', 'uses'=> 'SiteController@generateSitemap']);
$app->get('/api/sites/migrate', ['middleware' => 'jwtauth', 'uses'=> 'SiteController@migrate']);
$app->get('/api/sites/reindex', ['middleware' => 'jwtauth', 'uses'=> 'SiteController@reindexPages']);
$app->get('/api/sites/republish/templates', ['middleware' => 'jwtauth', 'uses'=> 'SiteController@republishTemplates']);
$app->get('/api/sites/update/plugins', ['middleware' => 'jwtauth', 'uses'=> 'SiteController@updatePlugins']);
$app->get('/api/sites/sync', ['middleware' => 'jwtauth', 'uses'=> 'SiteController@sync']);
$app->get('/api/templates/list', ['middleware' => 'jwtauth', 'uses'=> 'SiteController@listTemplates']);
$app->get('/api/plugins/list', ['middleware' => 'jwtauth', 'uses'=> 'PluginController@listAll']);
$app->post('/api/plugins/upload', ['middleware' => 'jwtauth', 'uses'=> 'PluginController@upload']);
$app->post('/api/plugins/remove', ['middleware' => 'jwtauth', 'uses'=> 'PluginController@remove']);
$app->post('/api/stripe/webhooks', 'AppController@listenForStripeWebhooks');

// login
$app->post('/api/users/login', 'UserController@login');
$app->post('/api/users/forgot', 'UserController@forgot');
$app->post('/api/users/reset', 'UserController@reset');
$app->post('/api/users/site/count', 'UserController@reset');

// users
$app->get('/api/users/list', ['middleware' => 'jwtauth', 'uses'=> 'UserController@listAll']);
$app->post('/api/users/edit', ['middleware' => 'jwtauth', 'uses'=> 'UserController@edit']);
$app->post('/api/users/add', ['middleware' => 'jwtauth', 'uses'=> 'UserController@add']);
$app->post('/api/users/remove', ['middleware' => 'jwtauth', 'uses'=> 'UserController@remove']);

// pages
$app->get('/api/pages/list', ['middleware' => 'jwtauth', 'uses'=> 'PageController@listAll']);
$app->post('/api/pages/add', ['middleware' => 'jwtauth', 'uses'=> 'PageController@add']);
$app->get('/api/routes/list', ['middleware' => 'jwtauth', 'uses'=> 'PageController@listRoutes']);
$app->post('/api/pages/save', ['middleware' => 'jwtauth', 'uses'=> 'PageController@save']);
$app->post('/api/pages/add', ['middleware' => 'jwtauth', 'uses'=> 'PageController@add']);
$app->post('/api/pages/remove', ['middleware' => 'jwtauth', 'uses'=> 'PageController@remove']);
$app->post('/api/pages/settings', ['middleware' => 'jwtauth', 'uses'=> 'PageController@settings']);

// components
$app->get('/api/components/list', ['middleware' => 'jwtauth', 'uses'=> 'ComponentController@listAll']);
$app->post('/api/components/add', ['middleware' => 'jwtauth', 'uses'=> 'ComponentController@add']);
$app->post('/api/components/remove', ['middleware' => 'jwtauth', 'uses'=> 'ComponentController@remove']);
$app->post('/api/components/save', ['middleware' => 'jwtauth', 'uses'=> 'ComponentController@save']);

// files
$app->post('/api/images/add', ['middleware' => 'jwtauth', 'uses'=> 'FileController@upload']);
$app->post('/api/files/add', ['middleware' => 'jwtauth', 'uses'=> 'FileController@upload']);
$app->get('/api/images/list', ['middleware' => 'jwtauth', 'uses'=> 'FileController@listImages']);
$app->get('/api/files/list', ['middleware' => 'jwtauth', 'uses'=> 'FileController@listFiles']);
$app->post('/api/files/remove', ['middleware' => 'jwtauth', 'uses'=> 'FileController@remove']);

// menus
$app->get('/api/menus/list', ['middleware' => 'jwtauth', 'uses'=> 'MenuController@listAll']);
$app->post('/api/menus/add', ['middleware' => 'jwtauth', 'uses'=> 'MenuController@add']);
$app->post('/api/menus/edit', ['middleware' => 'jwtauth', 'uses'=> 'MenuController@edit']);
$app->post('/api/menus/remove', ['middleware' => 'jwtauth', 'uses'=> 'MenuController@remove']);

// menu items
$app->get('/api/menus/items/list/{id}', ['middleware' => 'jwtauth', 'uses'=> 'MenuItemController@listAll']);
$app->post('/api/menus/items/add', ['middleware' => 'jwtauth', 'uses'=> 'MenuItemController@add']);
$app->post('/api/menus/items/edit', ['middleware' => 'jwtauth', 'uses'=> 'MenuItemController@edit']);
$app->post('/api/menus/items/remove', ['middleware' => 'jwtauth', 'uses'=> 'MenuItemController@remove']);
$app->post('/api/menus/items/order', ['middleware' => 'jwtauth', 'uses'=> 'MenuItemController@updateOrder']);

// forms
$app->get('/api/forms/list', ['middleware' => 'jwtauth', 'uses'=> 'FormController@listAll']);
$app->post('/api/forms/add', ['middleware' => 'jwtauth', 'uses'=> 'FormController@add']);
$app->post('/api/forms/edit', ['middleware' => 'jwtauth', 'uses'=> 'FormController@edit']);
$app->post('/api/forms/remove', ['middleware' => 'jwtauth', 'uses'=> 'FormController@remove']);

// form field
$app->get('/api/forms/fields/list/{id}', ['middleware' => 'jwtauth', 'uses'=> 'FormFieldController@listAll']);
$app->post('/api/forms/fields/add', ['middleware' => 'jwtauth', 'uses'=> 'FormFieldController@add']);
$app->post('/api/forms/fields/edit', ['middleware' => 'jwtauth', 'uses'=> 'FormFieldController@edit']);
$app->post('/api/forms/fields/remove', ['middleware' => 'jwtauth', 'uses'=> 'FormFieldController@remove']);
$app->post('/api/forms/fields/order', ['middleware' => 'jwtauth', 'uses'=> 'FormFieldController@updateOrder']);

// settings
$app->get('/api/settings/list', ['middleware' => 'jwtauth', 'uses'=> 'SettingController@listAll']);
$app->post('/api/settings/edit', ['middleware' => 'jwtauth', 'uses'=> 'SettingController@edit']);

// submissions
$app->get('/api/submissions/list', ['middleware' => 'jwtauth', 'uses'=> 'SubmissionController@listAll']);
$app->post('/api/submissions/remove', ['middleware' => 'jwtauth', 'uses'=> 'SubmissionController@remove']);
$app->post('/api/submissions/add', 'SubmissionController@add');
$app->post('/api/submissions/submit', 'SubmissionController@submit');

// galleries
$app->get('/api/galleries/list', ['middleware' => 'jwtauth', 'uses'=> 'GalleryController@listAll']);
$app->post('/api/galleries/add', ['middleware' => 'jwtauth', 'uses'=> 'GalleryController@add']);
$app->post('/api/galleries/edit', ['middleware' => 'jwtauth', 'uses'=> 'GalleryController@edit']);
$app->post('/api/galleries/remove', ['middleware' => 'jwtauth', 'uses'=> 'GalleryController@remove']);

// gallery images
$app->get('/api/galleries/images/list/{id}', ['middleware' => 'jwtauth', 'uses'=> 'GalleryImageController@listAll']);
$app->post('/api/galleries/images/add', ['middleware' => 'jwtauth', 'uses'=> 'GalleryImageController@add']);
$app->post('/api/galleries/images/edit', ['middleware' => 'jwtauth', 'uses'=> 'GalleryImageController@edit']);
$app->post('/api/galleries/images/remove', ['middleware' => 'jwtauth', 'uses'=> 'GalleryImageController@remove']);
$app->post('/api/galleries/images/order', ['middleware' => 'jwtauth', 'uses'=> 'GalleryImageController@updateOrder']);

