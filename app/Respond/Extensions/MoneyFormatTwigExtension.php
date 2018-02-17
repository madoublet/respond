<?php

/**
 * MoneyFormatTwigExtension
 */
namespace App\Respond\Extensions;

class MoneyFormatTwigExtension extends \Twig_Extension
{
    public function getFilters()
    {
        return array(
            'moneyFormat' => new \Twig_Filter_Method($this, 'money_format')
        );
    }

    public function money_format($price, $currency, $locale)
    {
        // set money format
        if($currency == 'USD') {
          $this->money_format = '$%i';
        }
        else {
          '%i';
        }

        return money_format($this->money_format, $price);
    }
}