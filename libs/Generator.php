<?php 

class Generator
{
  
    // generate rss
    public static function GenerateRSS($site, $pageType){
        
        $list = Page::GetRSS($site['SiteId'], $pageType['PageTypeId']);
        
        $timeZone = $site['TimeZone'];
        $offset = 0;
        
        if($timeZone=='EST'){
          $offset = -5 * (60 * 60);
        }
        else if($timeZone=='CST'){
          $offset = -6 * (60 * 60);
        }
        else if($timeZone=='MST'){
          $offset = -7 * (60 * 60);
        }
        else if($timeZone=='PST'){
          $offset = -8 * (60 * 60);
        }
        
        $rss = '<?xml version="1.0" encoding="ISO-8859-1"?>'.
            '<rss version="2.0">'.
              '<channel>'.
              '<title>'.$site['Name'].' - '.$pageType['TypeP'].'</title>'.
              '<link>http://'.$site['Domain'].'</link>'.
              '<description></description>'.
              '<language>en-us</language>'.
              '<copyright>Copyright (C) '.date('Y').' '.$site['Domain'].'</copyright>';
        
        foreach ($list as $row){
            
            $u = (strtotime($row['Created'])+$offset);
          
            $rss = $rss.'<item>'.
                   '<title>'.$row['Name'].'</title>'.
                   '<description><![CDATA['.$row['Description'].']]></description>'.
                   '<link>http://'.$site['Domain'].'/'.strtolower($pageType['FriendlyId']).'/'.strtolower($row['FriendlyId']).'.html</link>'.
                   '<pubDate>'.date('D, d M Y H:i:s T', $u).'</pubDate>'.
                   '</item>';
        }
        
        $rss = $rss.'</channel>';
        $rss = $rss.'</rss>';
        
        return $rss;
    }
      
    // generate site map
    public static function GenerateSiteMap($site){
        
        $list = Page::GetPagesForSite($site['SiteId']);
        
        $timeZone = $site['TimeZone'];
        $offset = 0;
        
        if($timeZone=='EST'){
          $offset = -5 * (60 * 60);
        }
        else if($timeZone=='CST'){
          $offset = -6 * (60 * 60);
        }
        else if($timeZone=='MST'){
          $offset = -7 * (60 * 60);
        }
        else if($timeZone=='PST'){
          $offset = -8 * (60 * 60);
        }
        
        $xml = '<?xml version="1.0" encoding="UTF-8"?>'.
               '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
               
        date_default_timezone_set('America/Los_Angeles');
    
        foreach ($list as $row){
            
          $u = (strtotime($row['LastModifiedDate'])+$offset);
          
          $pageType = PageType::GetByPageTypeId($row['PageTypeId']);
          
          if($row['PageTypeId']==-1){
            
            $xml = $xml.'<url>'.
                       '<loc>http://'.$site['Domain'].'/</loc>'.
                       '<lastmod>'.date('Y-m-d', $u).'</lastmod>'.
                     '<priority>1.0</priority>'.
                       '</url>';
            
          }
          else{
            $xml = $xml.'<url>'.
                       '<loc>http://'.$site['Domain'].'/'.strtolower($pageType['FriendlyId']).'/'.strtolower($row['FriendlyId']).'</loc>'.
                       '<lastmod>'.date('Y-m-d', $u).'</lastmod>'.
                     '<priority>0.5</priority>'.
                       '</url>';
          }
        }
        
        $xml = $xml.'</urlset>';
        
        return $xml;
    }
      
    // generates a page
    public static function GeneratePage($site, $page, $siteurl, $imageurl, $preview, $root = '../'){
        
        $pageTypeId = $page['PageTypeId'];
        $path = '/';
        
        $pageType = null;
        $type = 'preview';
        
        if($page['PageTypeId']!=-1){
            $pageType = PageType::GetByPageTypeId($pageTypeId);
            $type = $pageType['FriendlyId'];
        }
        
        $rootloc = '';
        $commonloc = '../common/';
        $default_url = '';
      
        if($page['PageTypeId']!=-1 || $preview==true){
            $rootloc = '../';
            $commonloc = '../../common/';
            $path = '/'.strtolower($type).'/'.strtolower($page['FriendlyId']);
            $default_url = $path;
        }
                  
        $siteId = $site['SiteId'];
        $timezone = $site['TimeZone'];
        $siteUniqId = $site['SiteUniqId'];
        
        $siteName = $site['Name'];
        $template = $site['Template'];
        $analyticsId = $site['AnalyticsId'];
 
        $htmlDir = $root.'sites/'.$site['FriendlyId'].'/templates/'.$site['Template'].'/html/';
        $htmlFile = $htmlDir.$page['Layout'].'.html';
        $content = '{content}';
    
        if(file_exists($htmlFile)){
            $content = file_get_contents($htmlFile);
            
            if($content==''){
                $content = '{content}';
            }
        }
    
        // global constants
        $content = str_replace('{site}', $site['Name'], $content);
        
        // replace with constants
        $content = str_replace('{id}', $page['FriendlyId'], $content);
        $content = str_replace('{type}', $type, $content);
        $content = str_replace('{name}', $page['Name'], $content);
        $content = str_replace('{description}', $page['Description'], $content);
        $content = str_replace('{keywords}', $page['Keywords'], $content);
        
        $p_content = '';
        $status = 'publish';
    
        if($preview==true){
            $status = 'draft';
        }
    
        $fragment = $root.'sites/'.$site['FriendlyId'].'/fragments/'.$status.'/'.$page['PageUniqId'].'.html';
    
        if(file_exists($fragment)){
          $p_content = file_get_contents($fragment);
        }

        $p_content = str_replace('sites/'.$site['FriendlyId'].'/', $rootloc, $p_content);
        $content = str_replace('{content}', $p_content, $content);
          
        $content = str_replace('{synopsis}', substr(strip_tags(html_entity_decode($page['Description'])), 0, 200), $content);
        
        $html = Generator::ParseHTML($site, $page, $content, $preview, $root);
        
        $pageTypeUniqId = '-1';
    
        if($pageType){
            $pageTypeUniqId = $pageType['PageTypeUniqId'];
        }
        
        if($preview==true){
            $pageTypeUniqId = 'preview';
        }
        
        // setup php header
        $header = '<?php '.PHP_EOL.
            '$siteUniqId="'.$site['SiteUniqId'].'";'.PHP_EOL.
            '$siteFriendlyId="'.$site['FriendlyId'].'";'.PHP_EOL.
            '$pageUniqId="'.$page['PageUniqId'].'";'.PHP_EOL.
            '$pageFriendlyId="'.$page['FriendlyId'].'";'.PHP_EOL.
            '$pageTypeUniqId="'.$pageTypeUniqId.'";'.PHP_EOL.
            '?>';
        
        $inject = '<body data-siteuniqid="'.$site['SiteUniqId'].'" data-sitefriendlyid="'.$site['FriendlyId'].'" data-pageuniqid="'.$page['PageUniqId'].'" data-pagefriendlyid="'.$page['FriendlyId'].'" data-pagetypeuniqid="'.$pageTypeUniqId.'"';
        
        $html = str_replace('<body', $inject, $html);
        $html = str_replace('{root}', $rootloc, $html);
        
        return $header.$html;
        
    }
      
    public static function ParseHTML($site, $page, $content, $preview, $root='../'){
    
        $html = str_get_html($content, true, true, DEFAULT_TARGET_CHARSET, false, DEFAULT_BR_TEXT);
    
        $mapcount = 0;
        $pageId = $page['PageId'];
        
        $rootloc = '';
        $commonloc = '../common/';
        
        if($page['PageTypeId']!=-1 || $preview==true){
            $rootloc = '../';
            $commonloc = '../../common/';
        }
        
        $css = $rootloc.'css/'.$page['Stylesheet'].'.css';
    
		if($html == null){
			return '';
		}
    
        foreach($html->find('module') as $el){
          
            if(isset($el->name)){
                $name = $el->name;
            
                if($name=='styles'){
                    $el->outertext = '<link href="'.$css.'" type="text/css" rel="stylesheet" media="screen">'.
                       '<link href="'.BOOTSTRAP_CSS.'" rel="stylesheet">'.
                       '<link href="'.FONTAWESOME_CSS.'" rel="stylesheet">'.
                       '<link href="'.$rootloc.'css/prettify.css" type="text/css" rel="stylesheet" media="screen">';
                }
                else if($name=='header'){
                    ob_start();
                    include $root.'sites/common/modules/header.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
              
                    $el->outertext= $content;
                }
                else if($name=='scripts'){
                    ob_start();
                    include $root.'sites/common/modules/scripts.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
              
                    $el->outertext= $content;
                }
                else if($name=='analytics'){
                    ob_start();
              
                    $webpropertyid = $site['AnalyticsId'];
              
                    include $root.'sites/common/modules/analytics.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
              
                    $el->outertext= $content;
                }
                else if($name=='rss'){
                    ob_start();
              
                    include $root.'sites/common/modules/rss.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else if($name=='list'){
              
                    $type = $el->type;
                    $label = $el->label;
                    $isAjax = false;
                    $pageNo = 1;
                    $curr = 0;
                    $listid = $el->id;
                    $display = $el->display;
                    $desclength = $el->desclength;
                    $length = $el->length;
                    $orderby = $el->orderby;
                    $groupby = $el->groupby;
                    $pageresults = $el->pageresults;
                  
                    if($el->display == 'blog'){
                      
                        $list = '<div id="'.$listid.'" class="list" data-bind="foreach: '.$listid.'" data-display="'.$el->display.'" data-label="'.$el->label.'" data-pagetypeid="'.$el->type.'" data-length="'.$length.'" data-orderby="'.$orderby.'">'
                                .'<h1><a data-bind="text:name, attr:{\'href\':url}"></a></h1>'
                                .'<div class="content" data-bind="html:content"></div>'
                                .'</div>';  
                    }
                    else{
                        $list = '<div id="'.$listid.'" class="list" data-bind="foreach: '.$listid.'" data-display="'.$el->display.'" data-label="'.$el->label.'" data-pagetypeid="'.$el->type.'" data-length="'.$length.'" data-orderby="'.$orderby.'">'
                                .'<div class="listItem" data-bind="css:{\'hasImage\': hasImage}">'
                                .'<h4><a data-bind="text:name, attr:{\'href\':url}"></a></h4>'
                                .'<em class="callout" data-bind="visible: hasCallout, text: callout"></em>'
                                .'<span class="image" data-bind="visible: hasImage"><img data-bind="attr: {\'src\': thumb}"></span>'
                                .'<p class="description" data-bind="text:desc"></p>'
                                .'</div>'
                                .'</div>';  
                    }
                    
                    $el->outertext = $list;
              
                }
                else if($name=='featured'){
					
                    $id = $el->id;
                    $pageName = $el->pagename;
                    $pageUniqId = $el->pageuniqid;
                  
                    $featured = '<div id="'.$id.'" data-pageuniqid="'.$pageUniqId.'" data-pagename="'.$pageName.'" class="featured-content"></div>';  
                    
                    $el->outertext = $featured	;
              
                }
                else if($name=='menu'){
    
                    if(isset($el->type)){
                        $type = $el->type;
                    }
                    else{
                        $type = 'primary';
                    }
                    
                    $el->outertext = '<?php $type="'.$type.'"; include "'.$commonloc.'modules/menu.php"; ?>';
              
                }
                else if($name=='footer'){
                    ob_start();
                    
                    $copy = $el->innertext;
                    
                    include $root.'sites/common/modules/footer.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else if($name=='slideshow'){
                    $id = $el->id;
                    $width = $el->width;
                    $height = $el->height;
                    $imgList = $el->innertext;
                    ob_start();
                    include $root.'sites/common/modules/slideshow.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else if($name=='gallery'){
                    $id = $el->id;
                    $imgList = $el->innertext;
                    ob_start();
                    include $root.'sites/common/modules/gallery.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else if($name=='html' || $name=='youtube' || $name=='vimeo'){
                    $el->outertext= $el->innertext;
                }
                else if($name=='file'){
                    $file = $el->file;
                    $description = $el->description;
                    ob_start();
                    include $root.'sites/common/modules/file.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else if($name=='form'){
                    $form = $el->innertext;
                    $file = $el->file;
                    $description = $el->description;
                    ob_start();
                    include $root.'sites/common/modules/form.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else if($name=='map'){
                    $address = $el->address;
                    ob_start();
                    include $root.'sites/common/modules//map.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else if($name=='twitter'){
                    $username = $el->username;
                    ob_start();
                    include $root.'sites/common/modules/twitter.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else if($name=='like'){
                    $username = $el->username;
                    ob_start();
                    include $root.'sites/common/modules/like.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else if($name=='comments'){
                    ob_start();
                    include $root.'sites/common/modules/comments.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else if($name=='byline'){
                    ob_start();
                    include $root.'sites/common/modules/byline.php'; // loads the module
                    $content = ob_get_contents(); // holds the content
                    ob_end_clean();
                    
                    $el->outertext= $content;
                }
                else{ 
                    // do nothing
                }
            
            }
        }
    
        foreach($html->find('plugin') as $el){
    
            $attrs = $el->attr;
    
            $p_vars = '';
            
            foreach($attrs as $key => &$val){
                ${$key} = $val; // set variable
    
                $p_vars .= '$'.$key.'="'.$val.'";';
            }
    
            $id = $el->id;
            $name = $el->name;
          
            if($render=='publish'){
                ob_start();
                include $root.'plugins/'.$type.'/render.php'; // loads the module
                $content = ob_get_contents(); // holds the content
                ob_end_clean();
                
                $el->outertext= $content;
            }
            else if($render=='runtime'){
                $list = '<?php '.
                    $p_vars.
                    'include "'.$rootloc.'plugins/'.$type.'/render.php"; ?>';
                
                $el->outertext = $list;
            }
    
        }
        
        return $html;
    }
  
}


?>