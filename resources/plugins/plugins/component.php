<?php

  $runat = $attributes['runat'];
  $component = $attributes['component'];

  if(isset($runat) && isset($component)) {

    // error checking
    if($component != '' && $runat == 'publish') {

      // get component html
      $file = app()->basePath().'/public/sites/'.$site['id'].'/components/'.$component;

      // check to see if the file exits
      if(file_exists($file)) {

        // get html
        $component_html = file_get_contents($file);

        // print to page
        print $component_html;

      }

    }

  }

  ?>