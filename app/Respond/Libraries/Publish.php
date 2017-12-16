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
use App\Respond\Libraries\Utilities;
use App\Respond\Models\Setting;

// DOM parser
use Sunra\PhpSimple\HtmlDomParser;

// Twig Extensions
use App\Respond\Extensions\BetterSortTwigExtension;

use Exception;

// Handes common publish tasks
class Publish
{

    /**
     * Syncs site to external provider
     *
     * @param {Site} $site
     */
    public static function sync($site) {

      // get domain from settings (url)
      $sync = Setting::getById('sync', $site->id);

      // make sure sync is set
      if($sync != NULL) {

        // make sure sync is set to S3
        if($sync == 'S3') {

          $has_synced = S3::sync($site);

          return $has_synced;
        }

      }

      return false;


    }


    /**
     * Pubishes the theme to the site
     *
     * @param {Site} $site
     */
    public static function publishTheme($theme, $site)
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

        // copy the private files
        $src = realpath($src_basepath . '/' . basename($theme) . '/private');
        $dest = $dest_basepath . '/' . basename($site->id);

        // copy source
        if ($src === false || strpos($src, $src_basepath) !== 0) {
          throw new Exception('Directory traversal attempt');
        } else {
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

      echo('siteid='.$site->id.' theme='.$site->theme);

      // update theme plugin files
      $src = app()->basePath() . '/public/' . getenv('THEMES_LOCATION') . $site->theme . '/plugins';
      $dest = app()->basePath() . '/public/sites/' . $site->id . '/plugins';

      // copy the directory
      Utilities::copyDirectory($src, $dest);

      // copy the plugin JSON file
      $src = app()->basePath()  . '/public/' . getenv('THEMES_LOCATION') . $site->theme . '/data/plugins.json';
      $dest = app()->basePath() . '/public/sites/' . $site->id . '/data/plugins.json';

      copy($src, $dest);

      // copy the JS file
      $src = app()->basePath()  . '/public/' . getenv('THEMES_LOCATION') . $site->theme . '/js/plugins.js';
      $dest = app()->basePath() . '/public/sites/' . $site->id . '/js/plugins.js';

      copy($src, $dest);

      // copy the CSS file
      $src = app()->basePath()  . '/public/' . getenv('THEMES_LOCATION') . $site->theme . '/css/plugins.css';
      $dest = app()->basePath() . '/public/sites/' . $site->id . '/css/plugins.css';

      copy($src, $dest);

      // combine the css
      Publish::combineCSS($site);

      return TRUE;

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

      $all_css = "";

      // walk through files
      foreach($files as $file) {

        $path = app()->basePath('public/sites/'.$id.'/'.$file);

        // get css
        $css_file_name = basename($path);

        // read, minify, and combine css
        if($css_file_name != 'site.min.css') {

          $css = file_get_contents($path);

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
     * Migrates a site from R5 to R6
     *
     * @param {Site} $site
     */
    public static function migrate($user, $site)
    {

      // get all pages
      $pages = Page::listAll($user, $site);

      // get html of pages
      foreach($pages as $page) {

        $url = $page['url'];
        $url = preg_replace('/\\.[^.\\s]{3,4}$/', '', $url);

        // get html of page
        $file = app()->basePath() . '/public/sites/' . $site->id . '/' . $url . '.html';

        if(file_exists($file)) {
          $html = file_get_contents($file);

          // remove un-used scripts
          $html = str_replace('<script src="js/respond.site.js"></script>', '', $html);
          $html = str_replace('<!-- web components -->', '', $html);
          $html = str_replace('<script src="components/lib/webcomponentsjs/webcomponents-lite.min.js"></script>', '', $html);
          $html = str_replace('<link rel="import" href="components/respond-build.html">', '', $html);

          // remove compontents
          $html = str_replace('<respond-languages></respond-languages>', '', $html);
          $html = str_replace('<respond-cart></respond-cart>', '', $html);
          $html = str_replace('<respond-search></respond-search>', '', $html);

          // update map
          $html = str_replace('<respond-map', '<div respond-plugin type="map"', $html);
          $html = str_replace('</respond-map>', '</div>', $html);

          // update html
          $html = str_replace('<respond-html', '<div respond-plugin type="html"', $html);
          $html = str_replace('</respond-html>', '</div>', $html);

          // update video
          $html = str_replace('<respond-video', '<div respond-plugin type="video"', $html);
          $html = str_replace('</respond-video>', '</div>', $html);

          // update gallery
          $html = str_replace('<respond-gallery galleryid=', '<div respond-plugin type="gallery" gallery=', $html);
          $html = str_replace('</respond-gallery>', '</div>', $html);

          // update menu
          $html = str_replace('<respond-menu type=', '<ul respond-plugin type="menu" menu=', $html);
          $html = str_replace('</respond-gallery>', '</ul>', $html);

          // update form
          $html = str_replace('<respond-form formid=', '<div respond-plugin type="form" form=', $html);
          $html = str_replace('</respond-form>', '</div>', $html);

          // remove toggles
          $html = str_replace('<respond-cart-toggle></respond-cart-toggle>', '', $html);
          $html = str_replace('<respond-languages-toggle></respond-languages-toggle>', '', $html);

          // replace search toggle
          $html = str_replace('<respond-search-toggle></respond-search-toggle>', '', $html);

          // load the DOM parser
          $dom = HtmlDomParser::str_get_html($html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

          // remove i18n attributes
          foreach($dom->find('[data-i18n]') as $el) {
            $el->{'data-i18n'} = null;
          }

          // remove nested attributes
          foreach($dom->find('[data-nested]') as $el) {
            $el->{'data-nested'} = null;
          }

          // remove backgroundimage
          foreach($dom->find('[backgroundimage]') as $el) {
            $el->{'backgroundimage'} = null;
          }

          // remove backgroundimage
          foreach($dom->find('[backgroundstyle]') as $el) {
            $el->{'backgroundstyle'} = null;
          }

          // remove containerid
          foreach($dom->find('[data-containerid]') as $el) {
            $el->{'data-containerid'} = null;
          }

          // remove containercssclass
          foreach($dom->find('[data-containercssclass]') as $el) {
            $el->{'data-containercssclass'} = null;
          }

          // update blog
          foreach($dom->find('[display="list-blog"]') as $el) {
            $el->outertext = '<div respond-plugin type="recent-posts" class="recent-posts"></div>';
          }

          // remove page
          foreach($dom->find('[page]') as $el) {
            $el->{'page'} = null;
          }

          // set the nav in the header to the main nav
          foreach($dom->find('header .nav') as $el) {
            $el->{'respond-plugin'} = "";
            $el->{'type'} = "menu";
            $el->{'menu'} = "primary";
          }

          // remove absolute links to images
          foreach($dom->find('img') as $el) {
            $src = $el->src;

            if(isset($src)) {
              $pos = strpos($src, 'files/');
              $new_src = substr($src, $pos, strlen($src));

              $el->src = $new_src;
            }

          }

          // put html back
          file_put_contents($file, $dom);

        }


      }

      // re-publish the plugins
      Publish::publishPlugins($user, $site);

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

                // find setting
                $els = $dom->find('['.$setting['id'].']');

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

              // find main content
              $el = $page_dom->find('[role=main]');
              $main_content = '';

              // get the main content
              if(isset($el[0])) {
                $main_content = $el[0]->innertext;
              }

              // get template dom
              $template_dom = HtmlDomParser::str_get_html($template_html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

              $el = $template_dom->find('[role=main]');

              if(isset($el[0])) {
                $el[0]->innertext = $main_content;
              }

              // put the contents
              file_put_contents($page_file, $template_dom);

              // saves the page
              $page->save($site, $user);

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
      $dir = app()->basePath().'/public/sites/'.$site->id.'/plugins/';
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
