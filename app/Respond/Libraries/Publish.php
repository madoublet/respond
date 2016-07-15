<?php

namespace App\Respond\Libraries;

// respond libraries
use App\Respond\Models\Site;
use App\Respond\Models\User;
use App\Respond\Models\Page;
use App\Respond\Models\Form;
use App\Respond\Models\Menu;
use App\Respond\Models\Gallery;
use App\Respond\Libraries\Utilities;
use App\Respond\Models\Setting;

// DOM parser
use Sunra\PhpSimple\HtmlDomParser;

// Twig Extensions
use App\Respond\Extensions\BetterSortTwigExtension;

class Publish
{

    /**
     * Pubishes the theme to the site
     *
     * @param {Site} $site
     */
    public static function publishTheme($theme, $site)
    {

        // publish theme files
        $src = app()->basePath() . '/public/themes/' . $theme;
        $dest = app()->basePath() . '/public/sites/' . $site->id;

        // copy the directory
        Utilities::copyDirectory($src, $dest);

        // copy the private files
        $src = app()->basePath() . '/public/themes/' . $theme . '/private';
        $dest = app()->basePath() . '/resources/sites/' . $site->id;

        // copy the directory
        Utilities::copyDirectory($src, $dest);
        
        // remove settings and plugins
        if(file_exists($dest.'/private/plugins.js')) {
          unlink($dest.'/private/plugins.js');
        }
        
        if(file_exists($dest.'/private/settings.json')) {
          unlink($dest.'/private/settings.json');
        }
        
        // remove the directory
        if(file_exists($dest.'/private')) {
          rmdir($dest.'/private');
        }

    }
    
    /**
     * Publishes a sitemap for the site
     *
     * @param {Site} $site
     */
    public static function publishSiteMap($site)
    {
    
      // get all pages
      $pages = Page::listAll($user, $site);
      
      // xml file
      $file = app()->basePath() . '/public/sites/' . $site->id . '/sitemap.xml';
      
      // get domain from settings
      $domain = Setting::getById('domain', $site->id);
      
      // get generated domain
      if($domain === NULL) {
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
     * Publishes plugins for the site
     *
     * @param {Site} $site
     */
    public static function publishPlugins($user, $site)
    {
        // get plugins for the site
        $dir = app()->basePath().'/public/sites/'.$site->id.'/plugins/';
        $exts = array('html');

        $files = Utilities::listFiles($dir, $site->id, $exts);
        $plugins = array();

        foreach($files as $file) {

          $path = app()->basePath().'/public/sites/'.$site->id.'/'.$file;

          if(file_exists($path)) {

            $html = file_get_contents($path);
            $id = basename($path);
            $id = str_replace('.html', '', $id);

            // push plugin to array
            array_push($plugins, $id);

          }

        }

        // setup twig
        $loader = new \Twig_Loader_Filesystem(app()->basePath().'/public/sites/'.$site->id.'/plugins');

        $twig = new \Twig_Environment($loader);
        $twig->addExtension(new BetterSortTwigExtension());

        // get all pages
        $pages = Page::listAll($user, $site);

        // list all forms, menus, galleries
        $forms = Form::listExtended($site->id);
        $menus = Menu::listExtended($site->id);
        $galleries = Gallery::listExtended($site->id);
        
        $i = 0;
        
        // get html of pages
        foreach($pages as $page) {
      
          // stript html
          $url = $page['url'];
          $url = preg_replace('/\\.[^.\\s]{3,4}$/', '', $url);
      
          // get html of page
          $file = app()->basePath() . '/public/sites/' . $site->id . '/' . $url . '.html';
          
        
          if(file_exists($file)) {
            $html = file_get_contents($file);
            
            // set parser
            $dom = HtmlDomParser::str_get_html($html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);
  
            // find main content
            $el = $dom->find('[role=main]');
            $main_content = '';
      
            // get the fragment content
            if(isset($el[0])) {
              $main_content = $el[0]->innertext;
            }
            
            // set html
            $pages[$i]['html'] = $main_content;
          }
          
          $i++;
          
        }
        
        $i = 0;
        
        // public plugin for pages
        foreach($pages as $item) {
        
          // get page
          $page = new Page($item);

          // setup current page
          $current_page = array(
            'url' => $page->url,
            'title' => $page->title,
            'description' => $page->description,
            'keywords' => $page->keywords,
            'callout' => $page->callout,
            'photo' => $page->photo,
            'thumb' => $page->thumb,
            'language' => $page->language,
            'direction' => $page->direction,
            'firstName' => $page->firstName,
            'lastName' => $page->lastName,
            'lastModifiedBy' => $page->lastModifiedBy,
            'lastModifiedDate' => $page->lastModifiedDate
          );
          
          // setup whether the site is using friendly urls
          $useFriendlyURLs = false;
  
          if(env('FRIENDLY_URLS') === true || env('FRIENDLY_URLS') === 'true') {
            $useFriendlyURLs = true;
          }
          
          // setup current site
          $current_site = array(
            'id' => $site->id,
            'name' => $site->name,
            'email' => $site->email,
            'api' => Utilities::retrieveAppUrl() . '/api',
            'useFriendlyURLs' => $useFriendlyURLs
          );
          
          // set url
          $url = $page->url;
          $url = preg_replace('/\\.[^.\\s]{3,4}$/', '', $url);

          $location = app()->basePath().'/public/sites/'.$site->id.'/'.$url.'.html';

          // check for valid location
          if(file_exists($location)) {
          
            // get html from page
            $html = file_get_contents($location);
  
            // walk through plugins
            foreach($plugins as $plugin) {
  
              // insert into respond-plugin comments
              $start = '<!-- respond-plugin:'.$plugin.' -->';
              $end = '<!-- /respond-plugin:'.$plugin.' -->';
  
              // check for start and end
              if(strpos($html, $start) !== FALSE && strpos($html, $end) !== FALSE) {
  
                // load the template
                $template = $twig->loadTemplate($plugin.'.html');
  
                // render the template
                $plugin_html = $template->render(array('pages' => $pages));
  
                // replace content
                $html = Utilities::replaceBetween($html, $start, $end, $plugin_html);
              }
  
            }
  
            // make sure the html is not empty
            if(!empty($html)) {
  
              // load the parser
              $dom = HtmlDomParser::str_get_html($html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);
    
              // insert into [respond-plugin] elements
              foreach($dom->find('[respond-plugin]') as $el) {
    
                if(isset($el->type)) {
    
                  if(array_search($el->type, $plugins) !== FALSE) {
    
                    // load the template
                    $template = $twig->loadTemplate($el->type.'.html');
    
                    $render_arr = array('page' => $current_page, 
                                          'site' => $current_site, 
                                          'pages' => $pages, 
                                          'forms' => $forms, 
                                          'galleries' => $galleries, 
                                          'menus' => $menus, 
                                          'attributes' => $el->attr);
                                          
                    // render the template
                    $plugin_html = $template->render($render_arr);
    
                    // set the inner text
                    $el->innertext = $plugin_html;
    
                  }
    
                }
    
              }
            
            }
  
            // find main content
            $el = $dom->find('[role=main]');
            $main_content = '';
      
            // get the fragment content
            if(isset($el[0])) {
              $main_content = $el[0]->innertext;
            }
  
            // put html back
            file_put_contents($location, $dom);
            
            // update html in the array
            $pages[$i]['html'] = $main_content;
            
            // increment
            $i++;
          
          }

        }

    }

}