/*
 * Shows a toast
 * Usage: toast.show('success', 'Saved!');  toast.show('failure', 'Error!');
 */
var toast = toast || {};

toast = (function() {

  'use strict';

  return {

    version: '0.0.1',

    /**
     * Creates the toast
     */
    setup: function() {

      var current;

      current = document.createElement('div');
      current.setAttribute('class', 'app-toast');
      current.innerHTML = 'Sample Toast';

      // append toast
      document.body.appendChild(current);

      current.addEventListener('click', function(e) {

        current.removeAttribute('active');

      });

      return current;

    },

    /**
     * Shows the toast
     */
    show: function(status, text) {

      var current, timeout=1000;

      current = document.querySelector('.app-toast');

      if(current == null) {
        current = toast.setup();
      }

      current.removeAttribute('success');
      current.removeAttribute('failure');

      current.setAttribute('active', '');

      // add success/failure
      if (status == 'success') {
        current.setAttribute('success', '');

        current.innerHTML = '<i class="material-icons toast-icon">check_circle</i>' + text + '<i class="material-icons toast-close">close</i>';

        // hide toast
        setTimeout(function() {
          current.removeAttribute('active');
        }, timeout);

      }
      else if (status == 'failure') {

        current.setAttribute('failure', '');
        timeout=3000;

        current.innerHTML = '<i class="material-icons toast-icon">error</i>' + text + '<i class="material-icons toast-close">close</i>';

      }

      // set text
      

    }

  }

})();

toast.setup();