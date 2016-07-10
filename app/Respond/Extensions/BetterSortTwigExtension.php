<?php

/**
 * BetterSortTwigExtension
 * Modified from: https://github.com/victor-in/Craft-TwigBetterSort/blob/master/twigbettersort/twigextensions/TwigBetterSortTwigExtension.php
 */
namespace App\Respond\Extensions;

class BetterSortTwigExtension extends \Twig_Extension
{
    protected $env;
    
    public function getName()
    {
        return 'Twig Better Sort Filter';
    }
    
    public function getFilters()
    {
        return array(
            'bettersort' => new \Twig_Filter_Method($this, 'twig_sort')
        );
    }
    
    public function initRuntime(\Twig_Environment $env)
    {
        $this->env = $env;
    }
    
    function lastModifiedDate_desc($a, $b)
    {
        $l = strtotime($a['lastModifiedDate']);
        $r = strtotime($b['lastModifiedDate']);
        
        return $l > $r ? -1 : 1;
    }
    
    public function twig_sort($array, $method = 'asort', $sort_flag = 'SORT_REGULAR')
    {
        settype($sort_flag, 'integer');
        
        switch ($method) {
            case 'asort':
                asort($array, $sort_flag);
                break;
            
            case 'arsort':
                arsort($array, $sort_flag);
                break;
            
            case 'krsort':
                krsort($array, $sort_flag);
                break;
            
            case 'ksort':
                ksort($array, $sort_flag);
                break;
            
            case 'natcasesort':
                natcasesort($array);
                break;
            
            case 'natsort':
                natsort($array);
                break;
            
            case 'rsort':
                rsort($array, $sort_flag);
                break;
            
            case 'sort':
                sort($array, $sort_flag);
                break;
            
            case 'lastModifiedDate_desc':
                usort($array, array(
                    'App\Respond\Extensions\BetterSortTwigExtension',
                    'lastModifiedDate_desc'
                ));
                break;
                
        }
        
        return $array;
    }
    
}