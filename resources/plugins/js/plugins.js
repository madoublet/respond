var respond = respond || {};

/*
 * Shows a toast
 * Usage:
 * respond.toast.show('success', 'Saved!');
 * respond.toast.show('failure', 'Error!');
 */
respond.toast = (function() {

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

      return current;

    },

    /**
     * Shows the toast
     */
    show: function(status, text) {

      var current;

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

        if(text == '' || text == undefined || text == null) {

          text = '<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">' +
                  '<path d="M0 0h24v24H0z" fill="none"/>' +
                  '<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>' +
                  '</svg>';

        }


      }
      else if (status == 'failure') {
        current.setAttribute('failure', '');

        if(text == '' || text == undefined || text == null) {

          text = '<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">' +
                 '<path d="M0 0h24v24H0V0z" fill="none"/>' +
                 '<path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>' +
                 '</svg>';

        }
      }

      // set text
      current.innerHTML = text;

      // hide toast
      setTimeout(function() {
        current.removeAttribute('active');
      }, 1000);

    }

  }

})();

respond.toast.setup();

/**
 * Handles plugins functionality for Respond
 *
 */
respond.plugins = (function() {

  'use strict';

  return {

  	setup:function(){

      // generic success toast
      if(window.location.hash) {
        var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character

        if(hash === 'success') {
          respond.toast.show('success');
        }
        else if(has === 'recaptcha-failure') {
          respond.toast.show('failure');
        }
        else if(has === 'recaptcha-failure-no-secret') {
          respond.toast.show('failure');
        }

      }

    },

    /**
     * Find the parent by a selector ref: http://stackoverflow.com/questions/14234560/javascript-how-to-get-parent-element-by-selector
     * @param {Array} config.sortable
     */
    findParentBySelector: function(elm, selector) {
      var all, cur;

      all = document.querySelectorAll(selector);
      cur = elm.parentNode;

      while (cur && !respond.plugins.collectionHas(all, cur)) { //keep going up until you find a match
        cur = cur.parentNode; //go up
      }
      return cur; //will return null if not found
    },

    /**
     * Gets the query string paramger
     * @param {String} name
     * @param {String} url
     */
    getQueryStringParam: function(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    },

    /**
     * Helper for findParentBySelecotr
     * @param {Array} config.sortable
     */
    collectionHas: function(a, b) { //helper function (see below)
      var i, len;

      len = a.length;

      for (i = 0; i < len; i += 1) {
        if (a[i] == b) {
          return true;
        }
      }
      return false;
    }

  }

})();

respond.plugins.setup();


/*
 * Handles maps in respond
 */
respond.map = (function() {

  'use strict';

  return {

    version: '0.0.1',

    /**
     * Creates the lightbox
     */
    setup: function() {

      var maps, x;

      // setup maps
      maps = document.querySelectorAll('[type=map]');

      // setup submit event for form
      for(x=0; x<maps.length; x++) {
        respond.map.setupMap(maps[x]);
      }


    },

    /**
     * Setups a map
     *
     */
    setupMap: function(el) {

      var address, container, zoom, defaultZoom, mapOptions, map;

      // get container, address and zoom
      container = el.querySelector('.map-container');
      address = el.getAttribute('address');
      zoom = el.getAttribute('zoom');

      // set zoom
      defaultZoom = 8;

      if (zoom != 'auto' && zoom != undefined) {
        defaultZoom = parseInt(zoom);
      }

      // create the map
      var mapOptions = {
        center: new google.maps.LatLng(38.6272, -90.1978),
        zoom: defaultZoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      // create map and bounds
      map = new google.maps.Map(container, mapOptions);

      // set location
      respond.map.setLocation(map, address);

    },

    /**
     * Sets the location on the map (this.map) to the current address (this.address)
     */
    setLocation: function(map, address) {

      var latitude, longitude, content, infowindow, marketext, marker, marktext, coords;

      // look for a default address
      if (address != null && address != undefined) {

        // geo-code the address
        var geocoder = new google.maps.Geocoder();

        var context = this;

        geocoder.geocode({
          'address': address
        }, function(results, status) {

          if (status == google.maps.GeocoderStatus.OK) {

            latitude = results[0].geometry.location.lat();
            longitude = results[0].geometry.location.lng();
            content = results[0].formatted_address;

            coords = new google.maps.LatLng(latitude, longitude);

            infowindow = new google.maps.InfoWindow({
              content: content
            });

            // create marker
            marktext = '<div>' + content + '</div>';

            marker = new google.maps.Marker({
              position: coords,
              map: map,
              title: marktext
            });

            google.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map, marker);
            });


            map.setCenter(coords);

          }

        });

      }

    }

  }

})();

respond.map.setup();

/*
 * Handles forms in Respond
 */
respond.form = (function() {

  'use strict';

  return {

    version: '0.0.1',

    /**
     * Creates the lightbox
     */
    setup: function() {

      var form, forms, x, status, id, success, error, holder, recaptchaError, siteKey, submit;

      // setup [respond-form]
      forms = document.querySelectorAll('[respond-form]');

      // setup form
      for(x=0; x<forms.length; x++) {

        // add submit
        forms[x].addEventListener('submit', respond.form.submitForm);

        // add hidden field to track submission url
        var input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "submitted-from");
        input.setAttribute("value", window.location.href);

        forms[x].appendChild(input);

      }

      // handle messaging
      status = respond.plugins.getQueryStringParam('formstatus');

      if(status != '' && status != null) {

        id = respond.plugins.getQueryStringParam('formid');

        if(id != '' && id != null) {

          form = document.querySelector('#' + id);

          if(form != null) {
            success = form.getAttribute('data-success') || '';
            error = form.getAttribute('data-error') || '';
            recaptchaError = form.getAttribute('data-recaptcha-error') || '';

            // show success
            if(status == 'success' && success != '') {
              respond.toast.show('success', success);
            }
            else if(status == 'success'){
              respond.toast.show('success');
            }

            // show error
            if(status == 'error' && error != '') {
              respond.toast.show('failure', error);
            }
            else if(status == 'error') {
              respond.toast.show('failure');
            }

            // show error
            if(status == 'recaptcha-failure' && recaptchaError != '') {
              respond.toast.show('failure', recaptchaError);
            }
            else if(status == 'recaptcha-failure') {
              respond.toast.show('failure');
            }


          }

        }

      }

      // add recaptcha script
      if(document.querySelector('.g-recaptcha-holder') != null) {
        document.write('<script src="https://www.google.com/recaptcha/api.js?onload=onloadReCaptchaCallback&render=explicit" async defer></script>');
        document.write('<script>function onloadReCaptchaCallback(){ respond.form.setupRecaptcha(); }</script>');
      }

    },

    /**
     * checks for errors prior to submitting the form
     *
     */
    submitForm: function(e) {

      var form, groups, submission, label, id, type, required, x, hasError = false;

      // get reference to form
      form = e.target;

  		// select all inputs in the local DOM
  		groups = form.querySelectorAll('.form-group');

  		// walk through inputs
  		for(x=0; x<groups.length; x++) {

  			// get name, id, type
  			label = groups[x].getAttribute('data-label');
  			id = groups[x].getAttribute('data-id');
  			type = groups[x].getAttribute('data-type');
  			required = groups[x].getAttribute('data-required');

  			// get value by type
  			var value = '';

  			if(type == 'text' || type == 'email' || type == 'number' || type == 'url' || type == 'tel' || type == 'date' || type == 'time'){
  				value = groups[x].querySelector('input').value;
  			}
  			else if(type == 'textarea'){
  				value = groups[x].querySelector('textarea').value;
  			}
  			else if(type == 'radiolist'){
  				var radio = groups[x].querySelector('input[type=radio]:checked');

  				if(radio != null){
  					value = radio.value;
  				}
  			}
  			else if(type == 'select'){
  				value = groups[x].querySelector('select').value;
  			}
  			else if(type == 'checkboxlist'){
  				var checkboxes = groups[x].querySelectorAll('input[type=checkbox]:checked');

  				// create comma separated list
  				for(y=0; y<checkboxes.length; y++){
  					value += checkboxes[y].value + ', ';
  				}

  				// remove trailing comma and space
  				if(value != ''){
  					value = value.slice(0, -2);
  				}
  			}

  			// check required fields
  			if(required == 'true' && value == ''){
  				groups[x].className += ' has-error';
  				hasError = true;
  			}

  		}

  		// exit if error
  		if(hasError == true) {
  		  form.querySelector('.error').setAttribute('visible', '');

  		  // stop processing
  		  e.preventDefault();
  			return false;
  		}

  		// set loading
  		form.querySelector('.loading').setAttribute('visible', '');


  		return true;

    },

    /**
     * clears the form a form
     *
     */
  	clearForm:function(form) {

  	  var els, x;

  	  // remove .has-error
  		els = form.querySelectorAll('.has-error');

  		for(x=0; x<els.length; x++){
  			els[x].classList.remove('has-error');
  		}

  		// clear text fields
  		els = form.querySelectorAll('input[type=text]');

  		for(x=0; x<els.length; x++){
  			els[x].value = '';
  		}

  		// clear text areas
  		els = form.querySelectorAll('textarea');

  		for(x=0; x<els.length; x++){
  			els[x].value = '';
  		}

  		// clear checkboxes
  		els = form.querySelectorAll('input[type=checkbox]');

  		for(x=0; x<els.length; x++){
  			els[x].checked = false;
  		}

  		// clear radios
  		els = form.querySelectorAll('input[type=radio]');

  		for(x=0; x<els.length; x++){
  			els[x].checked = false;
  		}

  		// reset selects
  		els = form.querySelectorAll('select');

  		for(x=0; x<els.length; x++){
  			els[x].selectedIndex = 0;
  		}

  	},

    /**
     * Setup recaptcha
     */
  	setupRecaptcha: function() {

      var form, forms, x, status, id, success, error, holder, recaptchaError, siteKey, submit;

      // setup [respond-form]
      forms = document.querySelectorAll('[respond-form]');

      // setup form
      for(x=0; x<forms.length; x++) {

        // add submit
        forms[x].addEventListener('submit', respond.form.submitForm);

        // determine if recaptcha is setup
        holder = forms[x].querySelector('.g-recaptcha-holder');

        if(holder != null) {

          submit = forms[x].querySelector('[type=submit]');

          if(submit != null) {
            submit.setAttribute('disabled', 'disabled');
          }

          (function(form){
            siteKey = holder.getAttribute('data-sitekey');

            var holderId = grecaptcha.render(holder,{
              'sitekey': siteKey,
              'badge' : 'inline', // possible values: bottomright, bottomleft, inline
              'callback' : function (recaptchaToken) {
                submit = form.querySelector('[type=submit]');

                if(submit != null) {
                  submit.removeAttribute('disabled');
                }
              }
            });

            form.onsubmit = function (evt){
              //evt.preventDefault();
              //grecaptcha.execute(holderId);
            };
          })(forms[x]);

        }

      }

  	}

  }

})();

respond.form.setup();


/*
 * Shows a lightbox
 * Usage:
 * <a href="path/to/image.png" title="Caption" respond-lightbox><img src="path/to/thumb.png"></a>
 */
respond.lightbox = (function() {

  'use strict';

  return {

    version: '0.0.1',

    /**
     * Creates the lightbox
     */
    setup: function() {

      var lb, close, els, el, img, p, x;

      // create lighbox
      lb = document.createElement('div');
      lb.setAttribute('class', 'respond-lightbox');

      lb.innerHTML = '<div class="respond-lightbox-close" on-click="close">' +
          '<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24">' +
            '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>' +
            '<path d="M0 0h24v24H0z" fill="none"/>' +
          '</svg>' +
        '</div>' +
        '<div class="respond-lightbox-body"><img><p>Sample Caption</p></div>';

      // append lightbox
      document.body.appendChild(lb);

      // handle close
      close = document.querySelector('.respond-lightbox-close');

      close.addEventListener('click', function(e) {
        lb.removeAttribute('visible');
      });

      // get lightbox items
      els = document.querySelectorAll('[respond-lightbox]');

      for(x=0; x<els.length; x++) {

        els[x].addEventListener('click', function(e) {

          e.preventDefault();

          el = e.target;

          if(el.nodeName === 'IMG') {
            el = respond.plugins.findParentBySelector(el, '[respond-lightbox]');
          }

          // show the lightbox
          lb.setAttribute('visible', '');

          // set image
          img = lb.querySelector('img');
          img.src = el.getAttribute('href');

          // set caption
          p = lb.querySelector('p');
          p.innerHTML = el.getAttribute('title');

        });

      }

    },

  }

})();

respond.lightbox.setup();

/*
 * Shows a searchbox
 * Usage:
 * <a respond-search></a>
 */
respond.searchbox = (function() {

  'use strict';

  return {

    version: '0.0.1',

    /**
     * Creates the lightbox
     */
    setup: function() {

      var sb, close, els, el, form, img, p, x, y, term, results, ext, data;

      // create lighbox
      sb = document.createElement('div');
      sb.setAttribute('class', 'respond-searchbox');

      sb.innerHTML = '<div class="respond-searchbox-close" on-click="close">' +
          '<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">' +
            '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>' +
            '<path d="M0 0h24v24H0z" fill="none"/>' +
          '</svg>' +
        '</div>' +
        '<form class="respond-searchbox-form">' +
          '<input type="text" placeholder="Search">' +
          '<div class="respond-search-results"></div>' +
        '</form>';

      // append lightbox
      document.body.appendChild(sb);

      // handle close
      close = document.querySelector('.respond-searchbox-close');

      if(close !== null) {

        close.addEventListener('click', function(e) {
          sb.removeAttribute('visible');
        });

      }

      // get lightbox items
      els = document.querySelectorAll('[respond-search]');

      for(x=0; x<els.length; x++) {

        els[x].addEventListener('click', function(e) {

          e.preventDefault();

          el = e.target;

          if(el.nodeName === 'IMG' || el.nodeName === 'SVG') {
            el = respond.plugins.findParentBySelector(el, '[respond-search]');

          }

          // show the lightbox
          sb.setAttribute('visible', '');


        });

      }

      // handle submit
      form = document.querySelector('.respond-searchbox-form');

      if(form !== null) {

        form.addEventListener('submit', function(e) {

          e.preventDefault();

          term = form.querySelector('input[type=text]').value;
          results = document.querySelector('.respond-search-results');

          // clear existing results
          results.innerHTML = '';

          var context = this;

    			// submit form
    			var xhr = new XMLHttpRequest();

    			// set URI
    			var uri = 'data/pages.json';

    			xhr.open('GET', encodeURI(uri));
    			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    			xhr.onload = function() {

            if(xhr.status === 200){

    			    	// get data
      					data = JSON.parse(xhr.responseText);

      					ext = '';

      					// check for friendly URLs
      					if(window.location.href.indexOf('.html') !== -1){
        					ext = '.html';
      					}

      					// set class for data
      					for(x in data){

      						// pages are stored in objects
      						if(typeof(data[x]) == 'object'){

      							// check for results in non-includeOnly pages

      							// this is what will be returned
    								var result = {
    									title: data[x]['title'],
    									url: data[x]['url'] + ext,
    									description: data[x]['description']
    								}

    								// walk through data[x]
    								for(y in data[x]){

    									var text = data[x].text.toLowerCase();

    									// searh for the term
    									if(text.search(new RegExp(term.toLowerCase(), 'i')) != -1){

    										results.innerHTML += '<div class="respond-search-result"><h2><a href="' + result.url + '">' + result.title + '</a></h2>' +
    										                    '<small><a href="' + result.url + '">' + result.url + '</a></small>' +
    										                    '<p>' + result.description + '</p></div>';


    										break;
    									}

    								}

    							}

      					}

    					}

    				  else if(xhr.status !== 200){
                console.log('[respond.error] respond-search component: failed post, xhr.status='+xhr.status);
    			    }
      			};

      			// send xhr
      			xhr.send();



          });

      }


    },

  }

})();

respond.searchbox.setup();


/*
 * Handles lists in respond
 */
respond.list = (function() {

  'use strict';

  return {

    version: '0.0.1',

    /**
     * Creates the lightbox
     */
    setup: function() {

      var lists, x, y, display, container, items=[], address='', title='', link='', map=null, el;

      // setup maps
      lists = document.querySelectorAll('[type=list]');

      // setup submit event for form
      for(x=0; x<lists.length; x++) {

        display = lists[x].getAttribute('display');

        if(display != null && display != undefined) {

          // if [display=map] setup the map
          if(display == 'map') {

            container = lists[x].querySelector('.map-container');

            // setup map on the container
            if(container != null) {
              map = respond.list.setupMap(container);
            }

            // set points on the map
            items = lists[x].querySelectorAll('.list-item');

            for(y=0; y<items.length; y++) {

              // get address
              el = items[y].querySelector('[address]');
              address = '';

              if(el != null) {
                address = el.innerHTML;
              }

              // get title
              el = items[y].querySelector('[title]');
              title = '';

              if(el != null) {
                title = el.innerHTML;
              }

              // get link
              el = items[y].querySelector('a');
              link = '';

              if(el != null) {
                link = el.getAttribute('href');
              }

              // map address
              if(map != null && address != '') {
                respond.list.addPoint(map, address, title, link);
              }
            }

          }

        }


      }


    },

    /**
     * Setups a map
     *
     */
    setupMap: function(el) {

      var address, container, zoom, defaultZoom, mapOptions, map;

      // get container, address and zoom
      container = el;
      address = el.getAttribute('address');
      zoom = el.getAttribute('zoom');

      // set zoom
      defaultZoom = 8;

      if (zoom != 'auto' && zoom != undefined) {
        defaultZoom = parseInt(zoom);
      }

      // create the map
      var mapOptions = {
        center: new google.maps.LatLng(38.6272, -90.1978),
        zoom: defaultZoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      // create map and bounds
      map = new google.maps.Map(container, mapOptions);

      return map;

    },

    /**
     * Adds a point to the map
     */
    addPoint: function(map, address, title, link) {

      var latitude, longitude, content, infowindow, marketext, marker, marktext, coords;

      // look for a default address
      if (address != null && address != undefined) {

        // geo-code the address
        var geocoder = new google.maps.Geocoder();

        var context = this;

        geocoder.geocode({
          'address': address
        }, function(results, status) {

          if (status == google.maps.GeocoderStatus.OK) {

            latitude = results[0].geometry.location.lat();
            longitude = results[0].geometry.location.lng();
            content = marktext = '<div><h4><a href="' + link + '">' + title + '</a></h4><p>' + results[0].formatted_address + '</p></div>';

            coords = new google.maps.LatLng(latitude, longitude);

            infowindow = new google.maps.InfoWindow({
              content: content
            });

            // create marker
            marktext = '<div>' + results[0].formatted_address + '</div>';

            marker = new google.maps.Marker({
              position: coords,
              map: map,
              title: marktext
            });

            google.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map, marker);
            });


            map.setCenter(coords);

          }

        });

      }

    }

  }

})();

respond.list.setup();

/*
 * Loads a component
 * Usage:
 * respond.toast.show('success', 'Saved!');
 * respond.toast.show('failure', 'Error!');
 */
respond.component = (function() {

  'use strict';

  return {

    version: '0.0.1',

    /**
     * Creates the component
     */
    setup: function() {

      var els, el, x, component, delay=0;

      els = document.querySelectorAll('[respond-plugin][type=component][runat=client]');

      for(x=0; x<els.length; x++) {

        if(els[x].hasAttribute('component') == true) {

          component = els[x].getAttribute('component');

          if(els[x].hasAttribute('delay')) {
              delay = parseInt(els[x].getAttribute('delay'));
          }

          if(component != '') {

            el = els[x];

            function loadComponent(el, component) {
                var request = new XMLHttpRequest();
                request.open('GET', 'components/' + component, true);

                request.onload = function() {
                  if (request.status >= 200 && request.status < 400) {
                    var html = request.responseText;
                    el.innerHTML = html;

                    // setup other plugins
                    respond.map.setup();
                    respond.form.setup();
                    respond.lightbox.setup();
                    respond.list.setup();
                  } else {
                    console.log('[respond.component] XHR error, status=' + request.status);
                  }
                };

                request.onerror = function() {
                    console.log('[respond.component] XHR connection error');
                };

                request.send();
            }

            if(delay > 0) {
                setTimeout(function() {loadComponent(el, component);}, delay);
            }
            else {
                loadComponent(el, component);
            }

          }

        }

      }

    }

  }

})();

respond.component.setup();