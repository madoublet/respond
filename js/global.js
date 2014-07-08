// handles global functions for this app
var global = {
    
    init:function(){
    
    	// enable tooltip
	  	if(!Modernizr.touch){ 
	  		$('.show-tooltip').tooltip({container: 'body', placement: 'bottom'});
	  	}
      
        // toggle nav
        $('.show-menu, .hide-menu').live('click', function(){
            $('body').toggleClass('show-nav'); 
        });
        
        // set current page in menu
        var currpage = $('body').data('currpage');
        $('.menu-'+currpage).addClass('active');
        
        // publishes the site
        $('.publish-site').on('click', function(){
            
           message.showMessage('progress', 'Re-publishing the site');
           
            $.ajax({
                url: 'api/site/publish',
                type: 'GET',
                data: {},
                success: function(data){
                    message.showMessage('success', 'Site published successfully');
                }
            });
           
        });
      
    },
    
    // basic email validation, ref: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    veryBasicEmailValidation:function(email){
	
    	var re = /\S+@\S+\.\S+/;
		return re.test(email);
	    
    },
    
    // parse gettext (for multi-lingual support)
    parseGettext:function(html){
    
	    // remove start php tag
		html = global.replaceAll(html, '<?php print _("', '');
		
		// remove end php tag
		html = global.replaceAll(html, '"); ?>', '');
		
		// remove escaped double quotes
		html = html.replace(/\\"/g, '"');
		
		return html;
	  	  
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
	
	// replaces all occurances for a string
	replaceAll:function(src, stringToFind, stringToReplace){
	  	var temp = src;
	
		var index = temp.indexOf(stringToFind);
		
		while(index != -1){
			temp = temp.replace(stringToFind,stringToReplace);
			index = temp.indexOf(stringToFind);
		}
		
		return temp;
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

		
	}
}

$(document).ready(function(){
    global.init();
});
