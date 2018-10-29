<?php

namespace App\Respond\Libraries;

// respond libraries
use App\Respond\Models\Site;
use App\Respond\Models\User;
use App\Respond\Models\Page;
use App\Respond\Models\Form;
use App\Respond\Models\Menu;
use App\Respond\Models\Gallery;
use App\Respond\Models\Component;
use App\Respond\Models\Product;
use App\Respond\Libraries\Utilities;
use App\Respond\Models\Setting;
use App\Respond\Models\Theme;

// DOM parser
use Sunra\PhpSimple\HtmlDomParser;

// Twig Extensions
use App\Respond\Extensions\BetterSortTwigExtension;
use App\Respond\Extensions\MoneyFormatTwigExtension;

use Exception;

// Handes common publish tasks
class Publish
{

    /**
     * Copies the theme to the site
     *
     * @param {Site} $site
     */
    public static function copyTheme($theme, $site)
    {

        // prevent traversal, #ref: http://bit.ly/2rdsDPS
        $src_basepath = realpath(app()->basePath() . '/public/' . getenv('THEMES_LOCATION'));
        $dest_basepath = realpath(app()->basePath() . '/public/sites');

        // publish theme files
        $src = realpath($src_basepath . '/' . basename($theme));
        $dest = $dest_basepath . '/' . basename($site->id);

        // copy source
        if ($src === false || strpos($src, $src_basepath) !== 0) {
          throw new Exception('Directory traversal attempt');
        } else {
          Utilities::copyDirectory($src, $dest);
        }

        // new dest_basepath
        $dest_basepath = realpath(app()->basePath() . '/resources/sites/');

        // copy the default settings to resources/sites/site-id
        $src = realpath(app()->basePath() . '/resources/default');
        $dest = $dest_basepath . '/' . basename($site->id);

        // copy settings
        Utilities::copyDirectory($src, $dest);

        // copy PRO default settings
        if(file_exists(app()->basePath().'/app/Pro')) {
          $src = realpath(app()->basePath() . '/app/Pro/resources/default');
          $dest = $dest_basepath . '/' . basename($site->id);

          Utilities::copyDirectory($src, $dest);
        }
    }

    /**
     * Copies the plugins to the site
     *
     * @param {Site} $site
     */
    public static function copyPlugins($site)
    {
        // copy plugins
        $src = realpath(app()->basePath() . '/resources/plugins');
        $dest = realpath(app()->basePath() . '/public/sites/'.basename($site->id));

        Utilities::copyDirectory($src, $dest);

        // copy PRO plugins
        if(file_exists(app()->basePath().'/app/Pro/resources/plugins')) {

          $src = realpath(app()->basePath() . '/app/Pro/resources/plugins');
          $dest = realpath(app()->basePath() . '/public/sites/'.basename($site->id));

          Utilities::copyDirectory($src, $dest);
        }
    }

    /**
     * Renders HTML from a given PHP plugin file (#ref: http://bit.ly/2cHYZY1)
     *
     * @param {String} $php_file
     * @param {Array} $render_arr
     */
    public static function render($php_file, $render_arr) {

      ob_start();

      extract($render_arr);
      include $php_file;

      $output = ob_get_contents();
      ob_end_clean();

      return $output;

    }

    /**
     * Updates plugins for the site
     *
     * @param {Site} $site
     */
    public static function updatePlugins($site)
    {

      // recopy the plugins

      // copy css directory
      $src = realpath(app()->basePath() . '/resources/plugins/css');
      $dest = realpath(app()->basePath() . '/public/sites/'.basename($site->id).'/css');

      Utilities::copyDirectory($src, $dest);

      // copy js directory
      $src = realpath(app()->basePath() . '/resources/plugins/js');
      $dest = realpath(app()->basePath() . '/public/sites/'.basename($site->id).'/js');

      Utilities::copyDirectory($src, $dest);

      // copy plugins directory
      $src = realpath(app()->basePath() . '/resources/plugins/plugins');
      $dest = realpath(app()->basePath() . '/public/sites/'.basename($site->id).'/plugins');

      Utilities::copyDirectory($src, $dest);

      // copy the plugins.json file
      $src = realpath(app()->basePath() . '/resources/plugins/data/plugins.json');
      $dest = realpath(app()->basePath() . '/public/sites/'.basename($site->id).'/data/plugins.json');

      copy($src, $dest);

      // copy PRO plugins
      if(file_exists(app()->basePath().'/app/Pro/resources/plugins')) {

        $src = realpath(app()->basePath() . '/app/Pro/resources/plugins/css');
        $dest = realpath(app()->basePath() . '/public/sites/'.basename($site->id).'/css');

        Utilities::copyDirectory($src, $dest);

        $src = realpath(app()->basePath() . '/app/Pro/resources/plugins/js');
        $dest = realpath(app()->basePath() . '/public/sites/'.basename($site->id).'/js');

        Utilities::copyDirectory($src, $dest);

        $src = realpath(app()->basePath() . '/app/Pro/resources/plugins/plugins');
        $dest = realpath(app()->basePath() . '/public/sites/'.basename($site->id).'/plugins');

        Utilities::copyDirectory($src, $dest);

        // copy the plugins.json file
        $src = realpath(app()->basePath() . '/app/Pro/resources/plugins/data/plugins.json');
        $dest = realpath(app()->basePath() . '/public/sites/'.basename($site->id).'/data/plugins.json');

        copy($src, $dest);
      }

      // combine the css
      Publish::combineCSS($site);

      // combine the JS
      Publish::combineJS($site);

      return TRUE;

    }

    /**
     * Returns the proper font family code
     *
     * @param {String} $siteId
     * @param {String} $type Type of code (CSS or IMPORT)
     */
    public static function getFontFamilyCode($siteId, $font, $type = 'CSS') {

      // default font
      if($font == NULL) {
        $font == 'System';
      }

      // default code
      $css_code = '"Source Sans Pro", "Helvetica Neue", Arial, sans-serif';
      $import_code = '';

      // get code per font
      if($font == 'System') {
        $css_code = '"Source Sans Pro", "Helvetica Neue", Arial, sans-serif';
        $import_code = '';
      }
      else if($font == 'Arimo') {
        $css_code = '"Arimo", sans-serif';
        $import_code = "@import url('https://fonts.googleapis.com/css?family=Arimo');";
      }
      else if($font == 'Dosis') {
        $css_code = '"Dosis", sans-serif';
        $import_code = "@import url('https://fonts.googleapis.com/css?family=Dosis');";
      }
      else if($font == 'Lato') {
        $css_code = '"Lato", sans-serif';
        $import_code = "@import url('https://fonts.googleapis.com/css?family=Lato');";
      }
      else if($font == 'Lora') {
        $css_code = '"Lora", serif';
        $import_code = "@import url('https://fonts.googleapis.com/css?family=Lora');";
      }
      else if($font == 'Merriweather') {
        $css_code = '"Merriweather", serif';
        $import_code = "@import url('https://fonts.googleapis.com/css?family=Merriweather');";
      }
      else if($font == 'Montserrat') {
        $css_code = '"Montserrat", serif';
        $import_code = "@import url('https://fonts.googleapis.com/css?family=Montserrat');";
      }
      else if($font == 'Noto Sans') {
        $css_code = '"Noto Sans", sans-serif';
        $import_code = "@import url('https://fonts.googleapis.com/css?family=Open+Sans');";
      }
      else if($font == 'Open Sans') {
        $css_code = '"Open Sans", sans-serif';
        $import_code = "@import url('https://fonts.googleapis.com/css?family=Montserrat');";
      }
      else if($font == 'Oswald') {
        $css_code = '"Oswald", sans-serif';
        $import_code = "@import url('https://fonts.googleapis.com/css?family=Oswald');";
      }
      else if($font == 'Playfair Display') {
        $css_code = '"Playfair Display", serif';
        $import_code = "@import url('https://fonts.googleapis.com/css?family=Playfair+Display');";
      }
      else if($font == 'Poppins') {
        $css_code = '"Poppins", snas-serif';
        $import_code = "@import url('https://fonts.googleapis.com/css?family=Poppins');";
      }
      else if($font == 'PT Sans') {
        $css_code = '"PT Sans", sans-serif';
        $import_code = "@import url('https://fonts.googleapis.com/css?family=PT+Sans');";
      }
      else if($font == 'Raleway') {
        $css_code = '"Raleway", sans-serif';
        $import_code = "@import url('https://fonts.googleapis.com/css?family=Raleway');";
      }
      else if($font == 'Roboto') {
        $css_code = '"Roboto", sans-serif';
        $import_code = "@import url('https://fonts.googleapis.com/css?family=Roboto');";
      }
      else if($font == 'Slabo') {
        $css_code = '"Slabo", serif';
        $import_code = "@import url('https://fonts.googleapis.com/css?family=Slabo+27px');";
      }
      else if($font == 'Source Sans Pro') {
        $css_code = '"Source Sans Pro", sans-serif';
        $import_code = "@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');";
      }
      else if($font == 'Ubuntu') {
        $css_code = '"Ubuntu", sans-serif';
        $import_code = "@import url('https://fonts.googleapis.com/css?family=Ubuntu');";
      }

      if($type == 'CSS') {
        return $css_code;
      }
      else {
        return $import_code;
      }

    }

    /**
     * Injects theme settings as CSS variables to a given css file
     *
     * @param {String} $css
     * @param {String} $siteId
     */
    public static function injectCssSettings($css, $siteId) {

      $settings = Theme::listAll($siteId);

      if(isset($settings['customizations'])) {

        // inject customizations into css
        foreach($settings['customizations'] as $customization) {

          if(isset($customization['value'])) {

            $value = $customization['value'];

            // look up font co
            if($customization['type'] == 'font') {
              $value = Publish::getFontFamilyCode($siteId, $value, 'CSS');
            }

            $search = 'var(--' . $customization['id'] . ')';
            $css = str_replace($search, $value, $css, $count);

          }

        }

      }

      return $css;

    }

    /**
     * Get fonts scripts for a given site
     *
     * @param {String} $siteId
     */
    public static function getFontImport($siteId) {

      $settings = Theme::listAll($siteId);
      $font_import = '';

      if(isset($settings['customizations'])) {

        // inject customizations into css
        foreach($settings['customizations'] as $customization) {

          if(isset($customization['value'])) {
            $value = $customization['value'];

            // look up font co
            if($customization['type'] == 'font') {
              $font_import .= Publish::getFontFamilyCode($siteId, $value, 'IMPORT');
            }
          }

        }

      }

      return $font_import;

    }

    /**
     * Combines all CSS into site.min.css
     *
     * @param {Site} $site
     */
    public static function combineCSS($site)
    {

      $id = $site->id;

      // set dir
      $dir = app()->basePath().'/public/sites/'.$id.'/css';

      // list css files
      $files = Utilities::ListFiles($dir, $id,
              array('css'),
              array());

      $import = Publish::getFontImport($site->id);

      $all_css = $import;

      // walk through files
      foreach($files as $file) {

        $path = app()->basePath('public/sites/'.$id.'/'.$file);

        // get css
        $css_file_name = basename($path);

        // read, minify, and combine css
        if($css_file_name != 'site.min.css') {

          $css = file_get_contents($path);

          // inject css settings
          if($css_file_name == 'site.css') {
            $css = Publish::injectCssSettings($css, $id);
          }


          // compress css
          $css = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css);
          $css = str_replace(': ', ':', $css);
          $css = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $css);

          // save to all css
          $all_css .= $css;
        }

      }

      // save to site.min.css
      $min_path = app()->basePath('public/sites/'.$id.'/css/site.min.css');

      // save
      file_put_contents($min_path, $all_css);

    }

    /**
     * Combines all JS into site.all.js
     *
     * @param {Site} $site
     */
    public static function combineJS($site)
    {

      $id = $site->id;

      // set dir
      $dir = app()->basePath().'/public/sites/'.$id.'/js';

      // list css files
      $files = Utilities::ListFiles($dir, $id,
              array('js'),
              array());

      $all_js = "";

      // check for libs
      $libs_file = app()->basePath().'/public/sites/'.$id.'/js/libs.min.js';

      if(file_exists($libs_file)) {

        $js = file_get_contents($libs_file);

        // save to all css
        $all_js .= $js;

      }

      // check for libs
      $plugins_file = app()->basePath().'/public/sites/'.$id.'/js/plugins.js';

      if(file_exists($plugins_file)) {

        $js = file_get_contents($plugins_file);

        // save to all css
        $all_js .= $js;

      }

      // walk through files
      foreach($files as $file) {

        $path = app()->basePath('public/sites/'.$id.'/'.$file);

        // get css
        $js_file_name = basename($path);

        // read, minify, and combine css
        if($js_file_name != 'site.all.js' && $js_file_name != 'libs.min.js' && $js_file_name != 'plugins.js') {

          $js = file_get_contents($path);

          // save to all css
          $all_js .= $js;
        }

      }

      // save to site.all.js
      $all_path = app()->basePath('public/sites/'.$id.'/js/site.all.js');

      // save
      file_put_contents($all_path, $all_js);

    }

    /**
     * Publishes a sitemap for the site
     *
     * @param {Site} $site
     */
    public static function publishSiteMap($user, $site)
    {

      // get all pages
      $pages = Page::listAll($user, $site);

      // xml file
      $file = app()->basePath() . '/public/sites/' . $site->id . '/sitemap.xml';

      // get domain from settings (url)
      $domain = Setting::getById('url', $site->id);

      // get generated domain
      if($domain == '' || $domain == NULL) {
        $domain = Utilities::retrieveSiteURL();
        $domain = str_replace('{{siteId}}', $site->id, $domain);
      }

      // trim trailing /
      $domain = rtrim($domain, '/');

      // setup xml
      $xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

      // get pages
      foreach($pages as $page) {

        $u = strtotime($page['lastModifiedDate']);

        $xml = $xml.'<url>'.
                '<loc>'.$domain.'/'.$page['url'].'</loc>'.
                '<lastmod>'.date('Y-m-d', $u).'</lastmod>'.
                '<priority>1.0</priority>'.
                '</url>';

      }

      // close urlset
      $xml = $xml.'</urlset>';

      // add xml data
      file_put_contents($file, $xml);

      return TRUE;

    }

    /**
     * Publish all settings for a specific page
     *
     * @param {Page} $page
     * @param {User} $user
     * @param {Site} $site
     * @return {array}
     */
    public static function publishSettingsForPage($page, $user, $site) {

      // get settings
      $file = app()->basePath().'/resources/sites/'.$site->id.'/settings.json';

      $settings = json_decode(file_get_contents($file), true);


      $path = app()->basePath().'/public/sites/'.$site->id.'/'.$page->url.'.html';

      // fix double html
      $path = str_replace('.html.html', '.html', $path);

      // init css
      $set_css = false;
      $css = '';

      if(file_exists($path)) {

        // get contents of the page
        $html = file_get_contents($path);

        // parse HTML
        $dom = HtmlDomParser::str_get_html($html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

        if($dom != NULL) {

          // walk through settings
          foreach($settings as $setting) {

            // handle sets
            if(isset($setting['sets'])) {

              // set attribute
              if(isset($setting['attribute'])) {

                $selector = '['.$setting['id'].']';

                if(isset($setting['selector'])) {
                  $selector = $setting['selector'];
                }

                // find setting
                $els = $dom->find($selector);

                // set attribute
                foreach($els as $el) {
                  $el->setAttribute($setting['attribute'], $setting['value']);
                }

              }

              // set css
              if(isset($setting['css'])) {

                // build css string
                $set_css = true;
                $css .= str_replace('config(--'.$setting['id'].')', $setting['value'], $setting['css']);

              }

            }

          }


          // remove existing inline styles
          $styles = $dom->find('[respond-settings]');

          foreach($styles as $style) {
             $style->outertext = '';
          }

          // append style to the dom
          $head = $dom->find('head', 0);

          if($head != NULL) {
            $head->innertext = $head->innertext() . '<style respond-settings>'.$css.'</style>';
          }

          // update contents
          file_put_contents($path, $dom);

        }

      }

      return TRUE;

    }


    /**
     * Publish all settings for the site
     *
     * @param {files} $data
     * @return {array}
     */
    public static function publishSettings($user, $site) {

      // update settings in the pages
      $arr = Page::listAll($user, $site);

      foreach($arr as $item) {

        // get page
        $page = new Page($item);

        // publish the settings for the page
        Publish::publishSettingsForPage($page, $user, $site);

      }

      return TRUE;

    }

    /**
     * Re-publishes all templates for the site
     *
     * @param {User} $user
     * @param {Site} $site
     */
    public static function publishTemplates($user, $site) {

      // get templates for the site
      $dir = app()->basePath().'/public/sites/'.$site->id.'/templates/';
      $exts = array('html');

      $files = Utilities::listFiles($dir, $site->id, $exts);
      $plugins = array();

      foreach($files as $file) {

        $path = app()->basePath().'/public/sites/'.$site->id.'/'.$file;

        $template = basename($path);
        $template = str_replace('.html', '', $template);

        Publish::publishTemplate($template, $user, $site);

      }

    }

    /**
     * Re-publishes the template for the site
     *
     * @param {String} $template
     * @param {User} $user
     * @param {Site} $site
     */
    public static function publishTemplate($template, $user, $site) {

      $template_file = $dir = app()->basePath().'/public/sites/'.$site->id.'/templates/'.$template.'.html';

      // get font
      $font_script = Publish::getFontFamilyCode($site->id, 'HTML');

      if(file_exists($template_file)) {

        // get all pages
        $pages = Page::listAll($user, $site);


        // get html of pages
        foreach($pages as $item) {

          // get page
          $page = new Page($item);

          // determine if the page derived from the template
          if($page->template == $template) {

            // get template html
            $template_html = file_get_contents($template_file);

            // replace name and description
            $template_html = str_replace('{{page.title}}', $page->title, $template_html);
            $template_html = str_replace('{{page.description}}', $page->description, $template_html);
            $template_html = str_replace('{{page.customHeader}}', $page->customHeader, $template_html);
            $template_html = str_replace('{{page.customFooter}}', $page->customFooter, $template_html);


            // stript html
            $page_url = $page->url;
            $page_url = preg_replace('/\\.[^.\\s]{3,4}$/', '', $page_url);

            // get html of page
            $page_file = app()->basePath() . '/public/sites/' . $site->id . '/' . $page_url . '.html';

            if(file_exists($page_file)) {
              $page_html = file_get_contents($page_file);

              // set parser
              $page_dom = HtmlDomParser::str_get_html($page_html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

              // check for page_dom
              if($page_dom != NULL) {

                // find main content
                $el = $page_dom->find('[role=main]');
                $main_content = '';

                // get the main content
                if(isset($el[0])) {
                  $main_content = $el[0]->innertext;
                }

                // get template dom
                $template_dom = HtmlDomParser::str_get_html($template_html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

                if($template_dom != null) {

                  $el = $template_dom->find('[role=main]');

                  if(isset($el[0])) {
                    $el[0]->innertext = $main_content;
                  }

                  // put the contents
                  file_put_contents($page_file, $template_dom);

                  // saves the page
                  $page->save($site, $user);

                }
                // end template_dom check

              }
              // end page_dom check


            }
            // end file_exists

          }
          // end template match

        }
        // end pages loop

      }
      // end file_exists loop

    }

    /**
     * Publishes plugins for the site
     *
     * @param {User} $user
     * @param {Site} $site
     */
    public static function publishPlugins($user, $site)
    {
        static $pages = array();

        // get all pages
        if(!$pages) {
          $pages = Page::listExtended($user, $site);
        }

        // get html of pages
        foreach($pages as $item) {

          $page = new Page($item);

          // publish the plugins for the page
          Publish::publishPluginsForPage($page, $user, $site, $pages);

        }

        return TRUE;
    }

    /**
     * Publishes plugins for the page
     *
     * @param {Page} $page
     * @param {User} $user
     * @param {Site} $site
     * @param {Site} $pages - Pass pages array to improve performance
     */
    public static function publishPluginsForPage($page, $user, $site, $pages = null)
    {

      // stript html
      $filename = $page->url;
      $filename = preg_replace('/\\.[^.\\s]{3,4}$/', '', $page->url);

      // get html of page
      $location = app()->basePath() . '/public/sites/' . $site->id . '/' . $filename . '.html';

      if(file_exists($location)) {

        $html = file_get_contents($location);

        // setup current page
        $meta = array(
          'url' => $page->url,
          'firstName' => $page->firstName,
          'lastName' => $page->lastName,
          'lastModifiedBy' => $page->lastModifiedBy,
          'lastModifiedDate' => $page->lastModifiedDate
        );

        // inject plugin HTML to the page
        $dom = Publish::injectPluginHTML($html, $user, $site, $meta, $pages);

        // put html back
        file_put_contents($location, $dom);

        return TRUE;

      }
      else {
        return FALSE;
      }

    }


    /**
     * Gets the plugin HTML
     *
     * @param {User} $user
     * @param {Site} $site
     */
    public static function injectPluginHTML($html, $user, $site, $meta, $pages = null) {

      // caches the values of these variables across the request to improve performance
      static $forms = array();
      static $menus = array();
      static $galleries = array();
      static $components = array();
      static $files = array();
      static $plugins = array();
      static $settings = array();
      static $products = array();

      // get all pages
      if(!$pages) {
        $pages = Page::listExtended($user, $site);
      }

      // get all forms
      if(!$forms) {
        $forms = Form::listExtended($site->id);
      }

      // get all menus
      if(!$menus) {
        $menus = Menu::listExtended($site->id);
      }

      // get all galleries
      if(!$galleries) {
        $galleries = Gallery::listExtended($site->id);
      }

      if(!$components) {
        $components = Component::listAll($site->id);
      }

      if(!$settings) {
        $settings = Setting::listAllAsAssoc($site->id);
      }

      if(!$products) {
        $products = Product::listAll($site->id);
      }

      // setup current site
      $current_site = array(
        'id' => $site->id,
        'name' => $site->name,
        'email' => $site->email,
        'api' => Utilities::retrieveAppUrl() . '/api',
        'useFriendlyURLs' => $site->supportsFriendlyUrls,
        'timeZone' => $site->timeZone,
      );

      // get plugins for the site
      $dir = app()->basePath().'/public/sites/'.$site->id.'/plugins';
      $exts = array('html', 'php');

      if(!$files) {
        $files = Utilities::listFiles($dir, $site->id, $exts);
      }

      if(!$plugins) {
        foreach($files as $file) {

          $path = app()->basePath().'/public/sites/'.$site->id.'/'.$file;

          if(file_exists($path)) {

            // $html = file_get_contents($path);
            $id = basename($path);
            $id = str_replace('.html', '', $id);
            $id = str_replace('.php', '', $id);

            // push plugin to array
            array_push($plugins, $id);

          }

        }

      }

      // location where twig should look for templates (local to site, then global)
      $template_dirs = array(
        app()->basePath().'/public/sites/'.$site->id.'/plugins'
      );

      $local_plugin_dir = app()->basePath().'/public/sites/'.$site->id.'/plugins';
      $global_plugin_dir = app()->basePath().'/resources/plugins';

      if(file_exists($global_plugin_dir)) {
        array_push($template_dirs, $global_plugin_dir);
      }

      // setup twig
      $loader = new \Twig_Loader_Filesystem($template_dirs);
      $twig = new \Twig_Environment($loader);
      $twig->addExtension(new BetterSortTwigExtension());
      $twig->addExtension(new MoneyFormatTwigExtension());

      // make sure the html is not empty
      if(!empty($html)) {

        // load the parser
        $dom = HtmlDomParser::str_get_html($html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

        // insert into [respond-plugin] elements
        foreach($dom->find('[respond-plugin]') as $el) {

          if(isset($el->type)) {

            if(array_search($el->type, $plugins) !== FALSE) {

              // render array
              $render_arr = array('page' => $meta,
                                  'meta' => $meta,
                                  'site' => $current_site,
                                  'pages' => $pages,
                                  'components' => $components,
                                  'forms' => $forms,
                                  'galleries' => $galleries,
                                  'menus' => $menus,
                                  'settings' => $settings,
                                  'products' => $products,
                                  'attributes' => $el->attr);

              $plugin_html = '';

              // check for .html (twig templates)
              if(file_exists($local_plugin_dir.'/'.$el->type.'.html') || file_exists($global_plugin_dir.'/'.$el->type.'.html')) {

                // load the template
                $template = $twig->loadTemplate($el->type.'.html');

                // render the template
                $plugin_html = $template->render($render_arr);

              }
              // check for PHP
              else if(file_exists($local_plugin_dir.'/'.$el->type.'.php') || file_exists($global_plugin_dir.'/'.$$el->type.'.php')) {

                $php_file = NULL;

                // set PHP file
                if(file_exists($local_plugin_dir.'/'.$el->type.'.php')) {
                  $php_file = $local_plugin_dir.'/'.$el->type.'.php';
                }
                else if(file_exists($local_plugin_dir.'/'.$el->type.'.php')) {
                  $php_file = $global_plugin_dir.'/'.$el->type.'.php';
                }

                // render PHP file
                if($php_file != NULL) {
                  $plugin_html = Publish::render($php_file, $render_arr);
                }

              }

              // set the inner text
              $el->innertext = $plugin_html;

            }

          }

        }

        return $dom;

      }

      return NULL;

    }


}
