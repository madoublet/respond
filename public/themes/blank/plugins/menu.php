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
                $cssClass = ' class="' . $css . '"';
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
                $menu_html .= '<li class="dropdown">';
                $menu_html .= '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">' . $item['html'] . ' <span class="caret"></span></a>';
                $menu_html .= '<ul class="dropdown-menu">';
                $new_parent = false;
            } else {
                $menu_html .= '<li' . $cssClass . '>';
                $menu_html .= '<a href="' . $url . '">' . $item['html'] . '</a>';
                $menu_html .= '</li>';
            }

            // end parent
            if (isset($items[$i + 1])) {
                if ($items[$i + 1]['isNested'] == false && $parent_flag == true) {
                    $menu_html .= '</ul></li>'; // end parent if next item is not nested
                    $parent_flag = false;
                    $new_parent = true;
                }
            } else {
                if ($parent_flag == true) {
                    $menu_html .= '</ul></li>'; // end parent if next menu item is null
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