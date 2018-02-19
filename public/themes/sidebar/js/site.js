var respond = respond || {};

/*
 * Site JS
 */
respond.site = (function() {

  'use strict';

  return {

    version: '0.0.1',

    /**
     * Creates the toast
     */
    setup: function() {

      var el;
      
      el = document.querySelector('.toggle-nav');
      
      // toggle show-nav
      el.addEventListener('click', function(){
        document.body.classList.toggle('show-nav');  
      });

      

    }
  }

})();

respond.site.setup();