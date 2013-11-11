// handles global functions for this app
var global = {
    
    init:function(){
      
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
	}
}

$(document).ready(function(){
    global.init();
});
