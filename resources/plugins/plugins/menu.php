<?php

$menu_html = '';

foreach ($menus as $menu) {

    if ($menu['id'] == $attributes['menu']) {

        $items = $menu['items'];
        $i = 0;
        $parent_flag = false;
        $new_parent = true;

        // walk through items
        foreach ($items as $item) {

            $url = $item['url'];
            $name = $item['html'];
            $css = '';
            $cssClass = '';
            $active = '';

            if ($page['url'] == $item['url']) {
                $css = 'active';
            }

            $css .= ' ' . $item['cssClass'];

            if (trim($css) != '') {
                $cssClass = ' class="nav-item ' . $css . '"';
            }

            // check for new parent
            if (isset($items[$i + 1])) {
                if ($items[$i + 1]['isNested'] == true && $new_parent == true) {
                    $parent_flag = true;
                }
            }

            $menu_root = '/';

            // check for external links
            if (strpos($url, 'http') !== false) {
                $menu_root = '';
            }

            if ($new_parent == true && $parent_flag == true) {
                $menu_html .= '<li class="nav-item dropdown">';
                $menu_html .= '<a href="#" class="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' . $item['html'] . '</a>';
                $menu_html .= '<div class="dropdown-menu" aria-labelledby="navbarDropdown">';
                $new_parent = false;
            } else {

                if($parent_flag == true) {
                  $menu_html .= '<a class="dropdown-item" href="' . $url . '">' . $item['html'] . '</a>'; // dropdown menu item
                }
                else {
                  $menu_html .= '<li' . $cssClass . '>';
                  $menu_html .= '<a class="nav-link" href="' . $url . '">' . $item['html'] . '</a>'; // standard menu item
                  $menu_html .= '</li>';
                }
            }

            // end parent
            if (isset($items[$i + 1])) {
                if ($items[$i + 1]['isNested'] == false && $parent_flag == true) {
                    $menu_html .= '</div></li>';
                    $parent_flag = false;
                    $new_parent = true;
                }
            } else {
                if ($parent_flag == true) {
                    $menu_html .= '</div></li>';
                    $parent_flag = false;
                    $new_parent = true;
                }
            }

            $i = $i + 1;
        }
    }

}


print $menu_html;

?>