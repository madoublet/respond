// create namespace
var respond = respond || {};
respond.text = respond.text || {};

// bold text
respond.text.bold = {

	create:function(){
	
		document.execCommand("Bold", false, null);
		
	}
	
};

// undo text
respond.text.undo = {

	create:function(){
	
		document.execCommand("undo", false, null);
		
	}
	
};

// redo text
respond.text.redo = {

	create:function(){
	
		document.execCommand("redo", false, null);
		
	}
	
};

// italic text
respond.text.italic = {

	// creates bold text
	create:function(){

		document.execCommand("Italic", false, null);
		return false;
		
	}
	
};

// strikethrough text
respond.text.strike = {

	// creates bold text
	create:function(){

		document.execCommand("strikeThrough", false, null);
		return false;
		
	}
	
};

// underline text
respond.text.underline = {

	// creates bold text
	create:function(){

		document.execCommand("underline", false, null);
		return false;
		
	}
	
};

// subscript text
respond.text.subscript = {

	// creates bold text
	create:function(){

		document.execCommand("subscript", false, null);
		return false;
		
	}
	
};

// superscript text
respond.text.superscript = {

	// creates bold text
	create:function(){

		document.execCommand("superscript", false, null);
		return false;
		
	}
	
};

// increase font size
respond.text.increaseFont = {

	create:function(){
	
		var text = utilities.getSelectedText();
		var html = '<big>'+text+'</big>';
		
		document.execCommand("insertHTML", false, html);
	
		return false;
		
	}
	
};

// decrease font size
respond.text.decreaseFont = {

	create:function(){
	
		var text = utilities.getSelectedText();
		var html = '<small>'+text+'</small>';
		
		document.execCommand("insertHTML", false, html);
	
		return false;
		
	}
	
};

// align text left
respond.text.alignLeft = {

	// creates bold text
	create:function(){

		// get scope from page
		var scope = angular.element($("section.main")).scope();
		
		scope.$apply(function () {
			var cssClass = scope.node.cssclass;
			
			if(cssClass != undefined){
				cssClass = utilities.replaceAll(cssClass, 'text-center', '');
				cssClass = utilities.replaceAll(cssClass, 'text-left', '');
				cssClass = utilities.replaceAll(cssClass, 'text-right', '');
			}
			else{
				cssClass = '';
			}
		
			cssClass += ' text-left';
		
            scope.node.cssclass = $.trim(cssClass);
        });
        
		return false;
		
	}
	
};

// align text center
respond.text.alignCenter = {

	// creates bold text
	create:function(){

		// get scope from page
		var scope = angular.element($("section.main")).scope();
		
		scope.$apply(function () {
			var cssClass = scope.node.cssclass;
			
			if(cssClass != undefined){
				cssClass = utilities.replaceAll(cssClass, 'text-center', '');
				cssClass = utilities.replaceAll(cssClass, 'text-left', '');
				cssClass = utilities.replaceAll(cssClass, 'text-right', '');
			}
			else{
				cssClass = '';
			}
		
			cssClass += ' text-center';
		
            scope.node.cssclass = $.trim(cssClass);
        });
        
		return false;
		
	}
	
};

// align text right
respond.text.alignRight = {

	// creates bold text
	create:function(){

		// get scope from page
		var scope = angular.element($("section.main")).scope();
		
		scope.$apply(function () {
			var cssClass = scope.node.cssclass;
			
			if(cssClass != undefined){
				cssClass = utilities.replaceAll(cssClass, 'text-center', '');
				cssClass = utilities.replaceAll(cssClass, 'text-left', '');
				cssClass = utilities.replaceAll(cssClass, 'text-right', '');
			}
			else{
				cssClass = '';
			}
		
			cssClass += ' text-right';
		
            scope.node.cssclass = $.trim(cssClass);
        });
        
		return false;
		
	}
	
};

// adds a link
respond.text.link = {

	// saves selection
	selection: null,
	
	// initializes the plugin
	init:function(){
	
		// handle link dialog
		$(document).on('click', '#pageUrl li', function(){ 
			document.getElementById('existing').checked = true; 
			$('#pageUrl li').removeClass('selected');
			$(this).addClass('selected');

			var url = $(this).find('small').text();
			
			linkDialog.url = url;        
		});

		$(document).on('click', '#linkUrl', function(){ 
			document.getElementById('customUrl').checked = true;  
		});

		$(document).on('click', '#addLink', function(){ 
  
			var url = $('#linkUrl').val();
			
			var cssClass = $('#linkCssClass').val().trim();
			var textColor = $('#linkTextColor').val().trim();
			var target = $('#linkTarget').val().trim();
			var title = $('#linkTitle').val().trim();
			var lightbox = $('#linkLightbox').is(':checked');
			
			// restore selection
			utilities.restoreSelection(respond.text.link.selection);

			// get scope
			var scope = angular.element($("section.main")).scope();
			
			var prefix = '';

			// create link
			var text = utilities.getSelectedText();
			
			if(respond.text.link.element == null){
			
				var html = '<a href="'+url+'"';
				
				// insert css class into link
				if(cssClass != ''){
					html += ' class="'+cssClass+'"';
				}
				
				// insert target into link
				if(target != ''){
					html += ' target="'+target+'"';
				}
				
				// insert title into link
				if(title != ''){
					html += ' title="'+title+'"';
				}
				
				// set lightbox
				if(lightbox == true){
					html += ' respond-lightbox';
				}
				
				// set texstyle
				if(textColor != ''){
					html += ' textcolor="'+textColor+'"';
				}
				
				html += '>'+text+'</a>';
				
				// insert HTML
				document.execCommand('InsertHTML', false, html);
			
			}
			else{
				var link = $(respond.text.link.element);
			
				link.attr('class', cssClass);
				link.attr('target', target);
				link.attr('title', title);
				link.attr('textcolor', textColor);
				
				// set lightbox
				if(lightbox == true){
					link.attr('respond-lightbox', '');
				}
				else{
					link.removeAttr('respond-lightbox');
				}
				
				link.attr('href', url);
				
				
			}

			$('#linkDialog').modal('hide');
		});
		
	},

	// creates link
	create:function(){

		// save the selection
		respond.text.link.selection = utilities.saveSelection();
		respond.text.link.element = null;

		// defaults
		var url = '';
		var cssClass = '';
		var target = '';
		var title = '';
		var textColor = '';
		var hasLightbox = false;

		// get link from selected text
		var link = utilities.getLinkFromSelection();
		
		// set link
		respond.text.link.element = link;
		
		// set link detail if available
		if(link != null){
			url = $(link).attr('href');
			
			cssClass = link.className;
			target = link.target;
			title = link.title;
			textColor = $(link).attr('textcolor');
			
			if($(link).attr('respond-lightbox') != undefined){
				hasLightbox = true;
			}
		}

	    $('#linkUrl').val(url);
	    $('#linkCssClass').val(cssClass);
	    $('#linkTarget').val(target);
	    $('#linkTitle').val(title);
	    $('#linkTextColor').val(textColor);
	    
	    if(textColor != ''){
		    $('#linkTextColorPicker').attr('color', textColor);
	    }
	    else{
		    $('#linkTextColorPicker').attr('color', '#FFFFFF');
	    }
	    
	    $('#pageUrl li').removeClass('selected');
	    $('#existing').attr('checked','checked');
	    
	    $('#linkLightbox').prop('checked', hasLightbox);
	    
	    // update pages
    	var scope = angular.element($("section.main")).scope();
		
		scope.retrievePages();
		scope.updateFiles();

		// show modal
		$('#linkDialog').modal('show');
		
		return false;
		
	}
	
};

respond.text.link.init();

// adds a code block around selected text
respond.text.code = {

	// creates bold text
	create:function(){
		
		var text = utilities.getSelectedText();
		var html = '<code>'+text+'</code>';
		
		document.execCommand("insertHTML", false, html);
	
		return false;
		
	}
	
};

// adds an icon
respond.text.icon = {

	// saves selection
	selection: null,
	
	// initializes the plugin
	init:function(){
	
		// select icon click
        $(document).on('click', '#selectIcon li', function(){ 
            $(this).parent().find('li').removeClass('selected');
            $(this).addClass('selected');
        });
        
        // add icon click
        $(document).on('click', '#iconDialog .primary-button', function(){
	        var icon = $('#selectIcon li.selected i').attr('class');
        
	        // restore selection
			utilities.restoreSelection(respond.text.icon.selection);
			
			// set icon
			var html = '<i class="'+icon+'">&nbsp;</i>';
		
			document.execCommand("insertHTML", false, html);
	
	        $('#iconDialog').modal('hide'); // show modal
        });
        
        
	},

	// creates the icon
	create:function(){
		
		respond.text.icon.selection = utilities.saveSelection();
    
	    $('#iconDialog').modal('show'); // show modal
	    
		return false;
		
	}
	
};

respond.text.icon.init();