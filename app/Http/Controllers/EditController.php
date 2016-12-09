<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;

use App\Respond\Libraries\Utilities;

use App\Respond\Models\Form;
use App\Respond\Models\Component;
use App\Respond\Models\Gallery;
use App\Respond\Models\Setting;

// DOM parser
use Sunra\PhpSimple\HtmlDomParser;

class EditController extends Controller
{

    /**
     * Edits a page provided by the querystring, in format ?q=site-name/dir/page.html
     *
     * @return Response
     */
    public function edit(Request $request)
    {

        $q = $request->input('q');
        $m = $request->input('mode');

        if($q != NULL){

          $saveUrl = '/api/pages/save';
          $mode = 'page';
          $title = '';

          // set save URL
          if(isset($m)) {

            if($m == 'component') {
              $saveUrl = '/api/components/save';

              $mode = 'component';
            }

          }

          $arr = explode('/', $q);

          if(sizeof($arr) > 0) {

            $siteId = $arr[0];

            // set html if hiddne
            $url = $q;

            // strip any trailing .html from url
            $url = preg_replace('/\\.[^.\\s]{3,4}$/', '', $url);

            // add .html back in
            $url .= '.html';

            // build title
            $arr = explode('/', $url);

            for($x=1; $x < sizeof($arr); $x++) {
              $title .= $arr[$x].'/';
            }

            $title = rtrim($title, '/');

            // load page
            $path = rtrim(app()->basePath('public/sites/'.$url), '/');

            if(file_exists($path)) {

              $html = file_get_contents($path);

              // set dom
              $dom = HtmlDomParser::str_get_html($html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

              // find base element
              $el = $dom->find('body', 0);

              // check for body
              if(isset($el) == false) {

                $arr = explode('/', $q);

                // check for site id
                if(isset($arr[0])) {

                  $id = $arr[0];

                  $default_template_location = app()->basePath('public/sites/'.$id.'/templates/default.html');

                  if(file_get_contents($default_template_location)) {

                    // get html
                    $template_html = file_get_contents($default_template_location);

                    // set dom
                    $dom = HtmlDomParser::str_get_html($template_html, $lowercase=true, $forceTagsClosed=false, $target_charset=DEFAULT_TARGET_CHARSET, $stripRN=false, $defaultBRText=DEFAULT_BR_TEXT, $defaultSpanText=DEFAULT_SPAN_TEXT);

                    $el = $dom->find('[role=main]');

                    // get the component content
                    if(isset($el[0])) {
                      $el[0]->innertext = $html;
                    }

                  }
                  else {
                    return 'Please specify a default template to render a component.';
                  }

                }

              }

              // find base
              $el = $dom->find('base', 0);

              if(isset($el)) {
                $el->setAttribute('href', '/sites/'.$siteId.'/');
              }
              else {
                return 'Please specify a base in your html file';
              }


              // get settings
              $sortable = Setting::getById('sortable', $siteId);
              $editable = Setting::getById('editable', $siteId);
              $blocks = Setting::getById('blocks', $siteId);
              $grid = Setting::getById('grid', $siteId);
              $framework = Setting::getById('framework', $siteId);

              // framework
              if($framework === NULL) {
                $framework = 'bootstrap';
              }

              // defaults
              if($grid === NULL) {
                $grid = '[{"name": "1 Column","desc": "100%","html": "<div class=\"block row\" hashedit-block><div class=\"col col-md-12\" hashedit-sortable></div></div>"}]';
              }
              else {
                $grid = json_encode($grid);
              }

              // defaults
              if($sortable === NULL) {
                $sortable = '.col, .column';
              }

              // get editable array
              if($editable === NULL) {
                $editable = ['[role=main]'];
              }
              else {
                $editable = explode(',', $editable);
                // trim elements in the array
                $editable = array_map('trim', $editable);
              }

              if($blocks === NULL) {
                $blocks = '.row';
              }

              // find body element
              $el = $dom->find('body', 0);
              $el->setAttribute('hashedit-active', '');

              // setup editable areas
              foreach($editable as $value){

                // find body element
                $els = $dom->find($value);

                foreach($els as $el) {
                  $el->setAttribute('hashedit', '');
                  $el->setAttribute('hashedit-selector', $value);
                }

              }

              // init


              $plugins_script = '';

              // get custom plugins
              $json_file = app()->basePath().'/public/sites/'.$siteId.'/data/plugins.json';

              if(file_exists($json_file)) {

                if(file_exists($json_file)) {
                  $plugins_script .= 'var plugins = '.file_get_contents($json_file).';';
                  $plugins_script .= 'if(hashedit.menu !== null && hashedit.menu !== undefined) {hashedit.menu = hashedit.menu.concat(plugins);}';
                }

              }
              else { // fallback to existing plugins

                $js_file = app()->basePath().'/resources/sites/'.$siteId.'/plugins.js';

                if(file_exists($js_file)) {

                  if(file_exists($js_file)) {
                    $plugins_script .= file_get_contents($js_file);
                  }

                }

              }

              // inject forms into script
              if(strpos($plugins_script, 'respond.forms') !== false ) {

                $arr = Form::listAll($siteId);
                $options = array();

                // get id
                foreach($arr as $item) {
                  array_push($options, array(
                    'text' => $item['name'],
                    'value' => $item['id']
                  ));
                }

                // inject forms into script
                $plugins_script = str_replace("['respond.forms']", json_encode($options), $plugins_script);
                $plugins_script = str_replace('["respond.forms"]', json_encode($options), $plugins_script);
              }

              // inject components into script
              if(strpos($plugins_script, 'respond.components') !== false ) {

                $arr = Component::listAll($siteId);
                $options = array();

                // get id
                foreach($arr as $item) {
                  array_push($options, array(
                    'text' => $item['url'],
                    'value' => $item['url']
                  ));
                }

                // inject forms into script
                $plugins_script = str_replace("['respond.components']", json_encode($options), $plugins_script);
                $plugins_script = str_replace('["respond.components"]', json_encode($options), $plugins_script);
              }

              // inject components into script
              if(strpos($plugins_script, 'respond.components.routes') !== false ) {

                $dir = $file = app()->basePath().'/public/sites/'.$siteId.'/components';
                $arr = array_merge(array('/'), Utilities::listRoutesForComponents($dir, $siteId));

                $options = array();

                // get id
                foreach($arr as $item) {
                  array_push($options, array(
                    'text' => $item,
                    'value' => $item
                  ));
                }

                // inject forms into script
                $plugins_script = str_replace("['respond.components.routes']", json_encode($options), $plugins_script);
                $plugins_script = str_replace('["respond.components.routes"]', json_encode($options), $plugins_script);
              }

              // inject galleries into script
              if(strpos($plugins_script, 'respond.galleries') !== false ) {

                $arr = Gallery::listAll($siteId);
                $options = array();

                // get id
                foreach($arr as $item) {
                  array_push($options, array(
                    'text' => $item['name'],
                    'value' => $item['id']
                  ));
                }

                // inject galleries into script
                $plugins_script = str_replace("['respond.galleries']", json_encode($options), $plugins_script);
                $plugins_script = str_replace('["respond.galleries"]', json_encode($options), $plugins_script);
              }

              // inject routes into script
              if(strpos($plugins_script, 'respond.routes') !== false ) {

                $dir = $file = app()->basePath().'/public/sites/'.$siteId;
                $arr = array_merge(array('/'), Utilities::listRoutes($dir, $siteId));

                $options = array();

                // get id
                foreach($arr as $item) {
                  array_push($options, array(
                    'text' => $item,
                    'value' => $item
                  ));
                }

                // inject galleries into script
                $plugins_script = str_replace("['respond.routes']", json_encode($options), $plugins_script);
                $plugins_script = str_replace('["respond.routes"]', json_encode($options), $plugins_script);
              }

              // inject pages into script
              if(strpos($plugins_script, 'respond.pages') !== false ) {

                $arr = Pages::listAllBySite($siteId);
                $options = array();

                // get id
                foreach($arr as $item) {
                  array_push($options, array(
                    'text' => $item['title'],
                    'value' => $item['url']
                  ));
                }

                // inject galleries into script
                $plugins_script = str_replace("['respond.pages']", json_encode($options), $plugins_script);
                $plugins_script = str_replace('["respond.pages"]', json_encode($options), $plugins_script);
              }

              // remove elements from that have been excluded
              $els = $dom->find('[hashedit-exclude]');

              // add references to each element
              foreach($els as $el) {
                $el->outertext = '';
              }

              // setup references
              $parent = $dom->find('[role=main]', 0);

              if(env('APP_ENV') == 'development') {

                // hashedit development stack
                $hashedit = <<<EOD
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<script src="/dev/hashedit/js/fetch.min.js"></script>
<script src="/dev/hashedit/js/i18next.js"></script>
<script src="/dev/hashedit/node_modules/sortablejs/Sortable.js"></script>
<script src="/dev/hashedit/node_modules/dropzone/dist/dropzone.js"></script>
<script src="/dev/hashedit/js/hashedit.js"></script>
<script>$plugins_script</script>
<script>
hashedit.setup({
  dev: true,
  title: '$title',
  url: '$url',
  sortable: '$sortable',
  blocks: '$blocks',
  grid: $grid,
  framework: '$framework',
  login: '/login/$siteId',
  translate: true,
  stylesheet: ['/dev/hashedit/css/hashedit.css', '/api/editor/css'],
  languagePath: '/i18n/{{language}}.json',
  auth: 'token',
  authHeader: 'X-AUTH',
  saveUrl: '$saveUrl'
});
</script>
EOD;
}
              else {

                // hashedit production stack
                $hashedit = <<<EOD
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<script src="/app/libs/hashedit/dist/hashedit-min.js"></script>
<script>$plugins_script</script>
<script>
hashedit.setup({
  title: '$title',
  url: '$url',
  sortable: '$sortable',
  blocks: '$blocks',
  grid: $grid,
  framework: '$framework',
  login: '/login/$siteId',
  path: '/app/libs/hashedit/',
  stylesheet: ['/app/libs/hashedit/dist/hashedit-min.css', '/api/editor/css'],
  translate: true,
  languagePath: '/i18n/{{language}}.json',
  auth: 'token',
  authHeader: 'X-AUTH',
  saveUrl: '$saveUrl'
});
</script>
EOD;
}

              $hashedit .= '<style type="text/css">'.
                            '.respond-plugin {'.
                            '  position: relative;'.
                            '  padding: 10px 0;'.
                            '  margin: 1px 0 20px 0;'.
                            '  background-color: #f8f8f8;'.
                            '  border: 1px solid #f0f0f0;'.
                            '  text-align: center;'.
                            '  color: #aaa;'.
                            '}'.
                            '[hashedit-element]:hover .respond-plugin { border: 1px solid #00ADE3  !important; }'.
                            '.respond-plugin span {'.
                            '  display: block;'.
                            '  margin: 0; padding: 0;'.
                            '  color: #aaa;'.
                            '  text-align: center;'.
                            '  text-transform: uppercase;'.
                            '  font-size: 11px;'.
                            '  font-family: "Open Sans", sans-serif;'.
                            '}'.
                            '.respond-plugin svg{'.
                            '  fill: currentColor;'.
                            '  width: 35px;'.
                            '  height: 35px;'.
                            '}';

              // find body element
              $el = $dom->find('body', 0);

              // append
              $el->outertext = $el->makeup() . $el->innertext . $hashedit . '</body>';

              // return updated html
              return $dom;

            }


          }


        }

    }

}