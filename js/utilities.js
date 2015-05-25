// handles global functions for this app
var utilities = {

	selection:null,
    
    init:function(){
    
    	// enable tooltip
	  	if(!Modernizr.touch){ 
	  		$('.show-tooltip').tooltip({container: 'body', placement: 'bottom'});
	  	}
      
        // toggle nav
        $(document).on('click', '.show-menu, .hide-menu', function(){
            $('body').toggleClass('show-nav'); 
        });
        
         $(document).on('click', '.signout', function(){
            $('body').removeClass('show-nav'); 
        });
        
        // segmented control
        $(document).on('click', '.segmented-control li', function(){
        
        	// hide other segements
			var lis = $(this).parents('.segmented-control').find('li');
			
			for(x=0; x<lis.length; x++){
				var target = $(lis[x]).attr('data-target');
				
				$(target).addClass('hidden');
				$(lis[x]).removeClass('active');
			}
        
			// show current segment
	        var target = $(this).attr('data-target');
	        $(target).removeClass('hidden');
	        $(this).addClass('active');
        });

		// segmented control
        $(document).on('click', '.dropdown-auto li', function(){
        
        	// hide other segements
			var lis = $(this).parents('.dropdown-auto').find('li');
			
			for(x=0; x<lis.length; x++){
				var target = $(lis[x]).attr('data-target');
				
				$(target).addClass('hidden');
				$(lis[x]).removeClass('active');
			}
        
			// show current segment
	        var target = $(this).attr('data-target');
	        
	        $(target).removeClass('hidden');
	        $(this).addClass('active');
	        
	        // get text
	        var text = $(this).find('a').text();
	        
	        var display = $(this).parents('.dropdown-auto').attr('data-display');
	        
	        if(display != undefined){
		        $(display).text(text);
	        }
        });


        
        // set current page in menu
        var currpage = $('body').data('currpage');
        $('.menu-'+currpage).addClass('active');
        
        // setup dropdown control
        $(document).on('click', '.dropdown-menu a', function(){
	        
	        var value = $(this).attr('data-value');
	        
	        if(value != undefined){
	        	var input = $(this).parents('.form-group').find('input');
	        
				// need to figure out how to bind this to a model
	        
				$(input).val(value);
				//$(input).trigger('input');
				
				angular.element(input).triggerHandler('change');
	        }
	        
        });
        
         // setup toggle
        $(document).on('click', '[data-toggle]', function(){
	        
	        var node = $(this).attr('data-toggle');
	        
	        $(node).toggleClass('hidden');
	        
        });
        
        // create sticky header for editor
        $(window).scroll(function() {
			if ($(this).scrollTop() > 63){  
				$('#editor-menu').addClass("sticky");
				$('#context-menu').addClass("sticky");
			}
			else{
				$('#editor-menu').removeClass("sticky");
				$('#context-menu').removeClass("sticky");
			}
		});
       
    },
    
    // reset segmented control
    resetSegmentedControl:function(selector){
	  
	 	 // hide other segements
		var lis = $(selector).find('li');
		
		for(x=0; x<lis.length; x++){
			var target = $(lis[x]).attr('data-target');
			
			$(target).addClass('hidden');
			$(lis[x]).removeClass('active');
		}
    
		// show current segment
        var first = $(selector).find('li:first-child');
        var target = first.attr('data-target');
        
        $(first).addClass('active');
        $(target).removeClass('hidden');
        
    },
    
    // basic email validation, ref: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    veryBasicEmailValidation:function(email){
	
    	var re = /\S+@\S+\.\S+/;
		return re.test(email);
	    
    },
    
    // use Google maps to geocode address, #ref: https://developers.google.com/maps/documentation/javascript/geocoding
    geocode:function(address, callback){
    
    	try{
	    	if(google.maps.Geocoder){
	    
				var geocoder = new google.maps.Geocoder();
				
				geocoder.geocode({'address': address}, function(results, status){
				
					console.log('fn geocode: ' + results);
				
					if (status == google.maps.GeocoderStatus.OK){
						// #ref: https://developers.google.com/maps/documentation/javascript/reference#LatLng
						callback(results[0].geometry.location.lat(), results[0].geometry.location.lng(), results[0].formatted_address);
					}
				
				});
		      
	      	}
	      	else{
		      	return false;
	      	}
      	}
      	catch(e){
	      	return false;
      	}

    },

    // use Google maps to reverse geocode address, #ref: https://developers.google.com/maps/documentation/javascript/geocoding
    reverseGeocode:function(latitude, longitude, callback){
		
		try{
			if(google.maps.Geocoder){
	
				var latLng  = new google.maps.LatLng(latitude, longitude);
				var geocoder = new google.maps.Geocoder();
				
				geocoder.geocode({'latLng': latLng}, function(results, status){
				
					console.log(results);
				
					if (status == google.maps.GeocoderStatus.OK){
						// #ref: https://developers.google.com/maps/documentation/javascript/reference#LatLng
						callback(results[0].geometry.location.lat(), results[0].geometry.location.lng(), results[0].formatted_address);
					}
				
				});
			
			}
	      	else{
		      	return false;
	      	}
      	}
      	catch(e){
	      	return false;
      	}

    },
	
	// gets a query string variable by name	
	getQueryStringByName:function(name){
		  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		  var regexS = "[\\?&]" + name + "=([^&#]*)";
		  var regex = new RegExp(regexS);
		  var results = regex.exec(window.location.href);
		  if(results == null)
		    return "";
		  else
		    return decodeURIComponent(results[1].replace(/\+/g, " "));
	},

	// gets the selected text
	getSelectedText:function(){

		var text = "";
	    if(window.getSelection) {
	        text = window.getSelection().toString();
	    }else if (document.selection && document.selection.type != "Control") {
	        text = document.selection.createRange().text;
	    }
	    return text;
	},
	
	// saves a selection to add a link
	saveSelection:function(){
	    if (window.getSelection) {
	        sel = window.getSelection();
	        if (sel.getRangeAt && sel.rangeCount) {
	            var ranges = [];
	            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
	                ranges.push(sel.getRangeAt(i));
	            }
	            return ranges;
	        }
	    } else if (document.selection && document.selection.createRange) {
	        return document.selection.createRange();
	    }
	    return null;
	},
	
	// get a link from the selected text
	getLinkFromSelection:function() {
		
		var parent = null;
		
		if(document.selection){
    		parent = document.selection.createRange().parentElement();
    	}
	    else{
	    	var selection = window.getSelection();
	    	if(selection.rangeCount > 0){
	    		parent = selection.getRangeAt(0).startContainer.parentNode;
	    	}
	    }
	    
	    if(parent != null){
		    if(parent.tagName == 'A'){
			    return parent;
		    }
	    }
	    
	    if (window.getSelection) {
	        var selection = window.getSelection();
	        
	        if(selection.rangeCount > 0) {
	            var range = selection.getRangeAt(0);
	            var div = document.createElement('DIV');
	            div.appendChild(range.cloneContents());
	            var links = div.getElementsByTagName("A");
	            
	            if(links.length > 0){
		            return links[0];
	            }
	            else{
		            return null;
	            }
	            
	        }
	    }
	    
	    return null;
	},
	
	// restores the selection
	restoreSelection:function(savedSel) {
	    if (savedSel) {
	        if (window.getSelection) {
	            sel = window.getSelection();
	            sel.removeAllRanges();
	            for (var i = 0, len = savedSel.length; i < len; ++i) {
	                sel.addRange(savedSel[i]);
	            }
	        } else if (document.selection && savedSel.select) {
	            savedSel.select();
	        }
	    }
	},
	
	// converts an rgb color to a hex color value
	rgbToHex:function(rgb){
		
		if(jQuery.browser.msie)return rgb.replace('#', '');
		
		 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		 function hex(x) {
		  hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");
		  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
		 }
		 return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	},
	
	// replaces all occurences for a string
	replaceAll:function(src, stringToFind, stringToReplace){
	  	var temp = src;
	
		var index = temp.indexOf(stringToFind);
		
		while(index != -1){
			temp = temp.replace(stringToFind,stringToReplace);
			index = temp.indexOf(stringToFind);
		}
		
		return temp;
	},
	
	// converts to local date
	convertToLocalDate:function(date, offset){
		if(date != null && date != ''){
			var m = moment(date, 'YYYY-MM-DD HH:mm:ss');
			m.add('hours',offset);
			
			return m.toDate();
		}
		else{
			return null;
		}
	},
	
	// converts to date string
	convertToDateString:function(date){
		
		if(date != null && date != ''){
			var m = moment(date);
			
			return m.format('YYYY-MM-DD');
		}
		else{
			return '';
		}
		
	},
	
	// converts to local date
	convertToLocalTime:function(date, offset){
		if(date != null && date != ''){
			var m = moment(date, 'YYYY-MM-DD HH:mm:ss');
			m.add('hours',offset);
			
			return m.toDate();
		}
		else{
			return null;
		}
	},
	
	// converts to time string
	convertToTimeString:function(date){
		
		if(date != null && date != ''){
			var m = moment(date);
			
			return m.format('HH:mm:ss');
		}
		else{
			return '';
		}
		
	},
	
	// parses latitude from LatLong
	parseLatitude:function(latLong){
		if(latLong != null && latLong != ''){
		
			var point = latLong.replace('POINT(', '').replace(')', '');
			var arr = point.split(' ');
		
			return arr[0];
		}
		else{
			return '';
		}	
	},
	
	// parses longitude from LatLong
	parseLongitude:function(latLong){
		if(latLong != null && latLong != ''){
		
			var point = latLong.replace('POINT(', '').replace(')', '');
			var arr = point.split(' ');
		
			return arr[1];
		}
		else{
			return '';
		}
	},
	
	// executes a funtion by its name
	executeFunctionByName:function(functionName, context /*, args */) {
		var args = [].slice.call(arguments).splice(2);
		var namespaces = functionName.split(".");
		
		var func = namespaces.pop();
		for(var i = 0; i < namespaces.length; i++) {
			context = context[namespaces[i]];
		}
		return context[func].apply(this, args);
	},
	
	// gets index of array by attribute
	getIndexByAttribute:function(arr, attr, value){
		
		// error checking
		if(arr == null || arr == undefined){
			console.log('[respond.utilities.error] getIndexByAttribute was null or undefined');
			return -1;
		}
		
		for(z=0; z<arr.length; z++){
			if(arr[z][attr] == value){
				return z;
			}
		}
		
		return -1;
		
	},
	
	// gets alignment for a given element
	getAlignClass:function(cssClass){
	
		// error checking
		if(cssClass == null || cssClass == undefined){
			return '';
		}
		
		var alignClass = '';
		
		// check for alignemnt
		if(cssClass.indexOf('text-left')!=-1){
			alignClass = ' text-left';
		}
		else if(cssClass.indexOf('text-center')!=-1){
			alignClass = ' text-center';
		}
		else if(cssClass.indexOf('text-right')!=-1){
			alignClass = ' text-right';
		}
	
		return alignClass;
	},
	
	// gets display for a given element
	getDisplay:function(cssClass){
	
		// error checking
		if(cssClass == null || cssClass == undefined){
			return '';
		}
		
		var display = 'standalone';
		
		// check for alignemnt
		if(cssClass.indexOf('display-left')!=-1){
			display = 'left';
		}
		else if(cssClass.indexOf('display-right')!=-1){
			display = 'right';
		}
	
		return display;
	},
	
	// generates an element 
	element:function(tag, attrs, html, translate){
		
		if(translate == null){
			translate = false;
		}
		
		// start tag
		var el = '<' + tag;
		
		// add attrs to tag
		for(var key in attrs){
		
			var value = attrs[key];
			
			if(value != '' && value != null && value != undefined){
				el += ' ' + key + '="' + value + '"';
			}
		}
		
		// end tag, add html
		if(translate == true && attrs['id'] != null){
		
			// get scope
			var scope = angular.element($("section.main")).scope();
			
			// get pageId
			var prefix = scope.page.PageId + '.';
		
			el += ' data-i18n="' + prefix + attrs['id'] + '">';
		}
		else{
			el += '>';
		}
		el += html;
		el += '</' + tag + '>';
		
		return el;

	},
	
	// sets up flipsnap
	setupFs:function(){
	
		// calculate distance
		var d = $('.fs-container').width() - 100;
		
		// setup flipsnap
	    var fs = Flipsnap('.main nav .fs', {distance: d, maxPoint:3});
	    
	    // create next and previous buttons
	    $('.fs-container').append(
	    		'<a class="fs-next"><i class="fa fa-chevron-right"></i></a>' +
	    		'<a class="fs-prev"><i class="fa fa-chevron-left"></i></a>');
        
        $('.fs-next').on('click', function(){
            fs.toNext(); 
            
            if(fs.hasPrev()){
                $('.fs-prev').show();
            }
            else{
                $('.fs-prev').hide();
            }
            
            if(fs.hasNext()){
                $('.fs-next').show();
            }
            else{
                $('.fs-next').hide();
            }
        });
        
        $('.fs-prev').on('click', function(){
            fs.toPrev(); 
            
            if(fs.hasPrev()){
                $('.fs-prev').show();
            }
            else{
                $('.fs-prev').hide();
            }
            
            if(fs.hasNext()){
                $('.fs-next').show();
            }
            else{
                $('.fs-next').hide();
            }
        });

		
	},
	
	// dynamically adds a script to a page
	addScript:function(src){
		var script = document.createElement("script");
		script.setAttribute("src", src);
		document.getElementsByTagName("head")[0].appendChild(script);
	},
	
	// transforms a string to title case
	toTitleCase:function(str){
		
		// remove special characters, replace hyphens with spaces
		str = str.replace(/[^a-zA-Z 0-9]+/g,'').replace(/-/g, ' ');
		
		// capitalize first letter of each word
		str = str.replace(/(?:^|\s)\w/g, function(match) {
			 		return match.toUpperCase();
			 	});
			 	
		// remove spaces
		str = str.replace(/\s/g, '');
		
		// lowercase first letter
		str = str.substring(0, 1).toLowerCase() + str.substring(1);
		
		return str;
		
	},
	
	// generate uniqid http://phpjs.org/functions/uniqid/
	uniqid:function() {
	  var prefix = '';
	  var more_entropy = false;
	
	  var retId;
	  var formatSeed = function(seed, reqWidth) {
	    seed = parseInt(seed, 10)
	      .toString(16); // to hex str
	    if (reqWidth < seed.length) { // so long we split
	      return seed.slice(seed.length - reqWidth);
	    }
	    if (reqWidth > seed.length) { // so short we pad
	      return Array(1 + (reqWidth - seed.length))
	        .join('0') + seed;
	    }
	    return seed;
	  };
	
	  // BEGIN REDUNDANT
	  if (!this.php_js) {
	    this.php_js = {};
	  }
	  // END REDUNDANT
	  if (!this.php_js.uniqidSeed) { // init seed with big random int
	    this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
	  }
	  this.php_js.uniqidSeed++;
	
	  retId = prefix; // start with prefix, add current milliseconds hex string
	  retId += formatSeed(parseInt(new Date()
	    .getTime() / 1000, 10), 8);
	  retId += formatSeed(this.php_js.uniqidSeed, 5); // add seed hex string
	  if (more_entropy) {
	    // for more entropy we add a float lower to 10
	    retId += (Math.random() * 10)
	      .toFixed(8)
	      .toString();
	  }
	
	  return retId;
	},
	
	// cleans editor css classes
	cleanEditorCssClass:function(cssclass){
		
		// clean css of sortable, ui-sortable
	  	cssclass = utilities.replaceAll(cssclass, 'sortable', '');
	  	cssclass = utilities.replaceAll(cssclass, 'ui-sortable', '');
	  	
	  	// remove extra whitespace
	  	cssclass = cssclass.replace(/\s{2,}/g, ' ');
	  	
	  	return cssclass;
	}
}

$(document).ready(function(){
    utilities.init();
});
