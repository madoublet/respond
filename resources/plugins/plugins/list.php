<?php

/* Respond List Plugin
 * <div respond-plugin type="list" display="list|thumbnail|map" url="page/"></div>
 */

$html = '<div class="list">';

if (function_exists("url_starts_with") == false) {
  // check if a string starts with a $needle
  function url_starts_with($haystack, $needle) {
       $length = strlen($needle);
       return (substr($haystack, 0, $length) === $needle);
  }
}

// add map-container for maps
if ($attributes['display'] == 'map') {
  $html .= '<div class="map-container"></div>';
}

// add tag
$tag = '';

// get tag (if set)
if (isset($attributes['tag'])) {
  $tag = $attributes['tag'];
}

// walk through pages and filter by url
foreach ($pages as $page) {

  // filter by tag
  if ($tag != '') {

    if (isset($page['tags'])) {

      $tags = explode(',', $page['tags']);
      $tags = array_map('trim', $tags);

      if (!in_array($tag, $tags)) {
        continue;
      }

    }
    else {
      continue;
    }

  }

  // check if the URL starts with
  if (url_starts_with($page['url'], $attributes['url'])) {

    if ($attributes['display'] == 'thumbnail') {

      if(isset($page['thumb'])) {

        if($page['thumb'] != '') {

          // list thumb
          $html .= '<div class="list-thumb">' .
                      '<a href="'.$page['url'].'" title="'.$page['description'].'"><img src="'.$page['thumb'].'"></a>'.
                      '<h5><a href="'.$page['url'].'">'.$page['title'].'</a></h5>'.
                   '</div>';

         }

      }

    }
    else if ($attributes['display'] == 'map') {

      // check for location
      if(isset($page['location'])) {

        // make sure the location is set
        if($page['location'] != '') {
            $html .= '<div class="list-item">' .
                        '<h5 title><a href="'.$page['url'].'">'.$page['title'].'</a></h5>'.
                        '<p address>'.$page['location'].'</p>'.
                        '<p>'.$page['description'].'</p>'.
                      '</div>';
        }

      }

    }
    else {

      // show list item
      $html .= '<div class="list-item">' .
                  '<h5><a href="'.$page['url'].'">'.$page['title'].'</a></h5>'.
                  '<p>'.$page['description'].'</p>'.
                '</div>';

    }

  }

}

$html .= '</div>';

print $html;

?>