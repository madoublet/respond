var respond = respond || {};

/*
 * Handles the site JS
 */
respond.site = (function() {

  'use strict';

  return {

    version: '0.0.1',

    /**
     * Setup the site JS
     */
    setup: function() {

      var toggle, close;

      toggle = document.querySelector('.navbar-toggle');

      // show the nav
      toggle.addEventListener('click', function(e) {

        var nav = document.querySelector('.primary-nav');
        nav.setAttribute('active', '');

      });

      close = document.querySelector('.navbar-close');

      // show the nav
      close.addEventListener('click', function(e) {

        var nav = document.querySelector('.primary-nav');
        nav.removeAttribute('active');

      });

    }

  }

})();

respond.site.setup();