// setup namespace
var respond = respond || {};
respond.editor = respond.editor || {};

// holds current row and node
respond.editor.currNode = null;
respond.editor.currBlock = null;
respond.editor.currElement = null;
respond.editor.currConfig = null;
respond.editor.prefix = '';
respond.editor.menu = null;
respond.editor.api = '';
respond.editor.imagesUrl = '';
respond.editor.isModified = false;

// reference to the editor
respond.editor.el = null;
respond.editor.pageId = null;

// swaps nodes
jQuery.fn.swap = function(b){ 
	b = jQuery(b)[0]; 
	var a = this[0]; 
	var t = a.parentNode.insertBefore(document.createTextNode(''), a); 
	b.parentNode.insertBefore(a, b); 
	t.parentNode.insertBefore(b, t);
	t.parentNode.removeChild(t); 
	return this; 
};

function setupSortable(){
	$('.sortable').sortable({
			handle:'.move', 
			connectWith: '.sortable', 
			placeholder: 'editor-highlight', 
			opacity:'0.6', 
			tolerance: 'pointer',
			receive: function(event, ui) {
	           if($(ui.item).is('a')){
		           $('#editor-container').find('a.ui-draggable').replaceWith('<div id="editor-placeholder" class="editor-highlight"></div');
	           }
	        }
		});
}

// set sortable function
respond.editor.setupSortable = function(){
	setupSortable();
}

// set debug for the editor
respond.editor.debug = false;

// defaults
respond.editor.defaults = {
	showIndividualLayoutOptions: false,

	elementMenu: '<a class="move fa fa-arrows"></a>',
					
	blockMenu: '<a class="expand-menu fa fa-ellipsis-v"></a>' +
			'<div class="element-menu">' + 
			'<a class="up fa fa-chevron-up"></a><a class="down fa fa-chevron-down"></a></div>'
};


// instantiate editor
respond.editor.setup = function(config){

	// set contextual variables
	respond.editor.el = config.el;
	respond.editor.pageId = config.pageId;
	respond.editor.api = config.api;
	respond.editor.imagesUrl = config.imagesUrl;
	
	// set namespaced globals
	respond.editor.menu = config.menu;
	
	// show loading
	$('#editor-loading').show();
	
	// get content
	$.ajax({
		url: config.api + '/page/content/retrieve',
		type: 'POST',
		beforeSend : function(xhr) {
		 	xhr.setRequestHeader('X-Auth', 'Bearer ' + window.sessionStorage.token);
	    },
		data: {pageId: this.pageId},
		success: function(data){
		
			// hide loading
			$('#editor-loading').show();
		
			//set data
			$(respond.editor.el).html(data);
			
			// build the editor
			respond.editor.build();
            
            // oh so pretty
            prettyPrint();
        }
	});
	
}

// setup plugins
respond.editor.setupPlugins = function(){
	
	// setup mapping between elements for inputs
	$(document).on('keyup change', 'input[data-map], textarea[data-map]', function(){
	
		var value = $(this).val();
		var map = $(this).attr('data-map');
		var attr = $(this).attr('data-attr');
		
		// clean html
		var clean = utilities.replaceAll(value, '<', '&lt;');
		clean = utilities.replaceAll(clean, '>', '&gt;');
		
		if(map == 'node'){
			$(respond.editor.currNode).attr(attr, value);
			$(respond.editor.currNode).find('[data-text="' + attr.replace('data-', '') + '"]').text(value);
			$(respond.editor.currNode).find('[data-html="' + attr.replace('data-', '') + '"]').html(value);
			$(respond.editor.currNode).find('[data-html-clean="' + attr.replace('data-', '') + '"]').html(clean);
			
		}
		
		if(map == 'element'){
			$(respond.editor.currElement).attr(attr, value);
			$(respond.editor.currElement).find('[data-text="' + attr.replace('data-', '') + '"]').text(value);
			$(respond.editor.currNode).find('[data-html="' + attr.replace('data-', '') + '"]').html(value);
			$(respond.editor.currElement).find('[data-html-clean="' + attr.replace('data-', '') + '"]').html(clean);
		}
		
	});
	
	// setup mapping between elements
	$(document).on('change', 'select[data-map]', function(){
		
		var value = $(this).val();
		var map = $(this).attr('data-map');
		var attr = $(this).attr('data-attr');
		
		if(map == 'node'){
			$(respond.editor.currNode).attr(attr, value);
			$(respond.editor.currNode).find('[data-text="' + attr.replace('data-', '') + '"]').text(value);
		}
		
		if(map == 'element'){
			$(respond.editor.currElement).attr(attr, value);
			$(respond.editor.currElement).find('[data-text="' + attr.replace('data-', '') + '"]').text(value);
		}
	});
	
	// remove plugin
	$(document).on('click', '.plugin-remove', function(){
		
		var node = $(respond.editor.currNode);
			
		if(node){
			node.remove();
			respond.editor.currNode = null;
			
			// hide config
			$('.context-menu').find('.config').removeClass('active');
		}
		
	});
	
	// remove element
	$(document).on('click', '.element-remove', function(){
		
		var el = $(respond.editor.currElement);
			
		if(el){
			el.remove();
			respond.editor.currElement = null;
		}
		
	});
	
	// remove parent of element
	$(document).on('click', '.element-parent', function(){
		
		var el = $(respond.editor.currElement);
			
		if(el){
			el.parent().remove();
			respond.editor.currElement = null;
		}
		
	});
	
	// remove plugin
	$(document).on('click', '.block-remove', function(){
	
		var node = $(respond.editor.currBlock);
			
		if(node){
			node.remove();
			respond.editor.currBlock = null;
			
			// hide config
			$('.context-menu').find('.config').removeClass('active');
		}
		
	});
	
	// configure block
	$(document).on('click', '.block-actions', function(){
	
		// hide config
	  	$('.context-menu').find('.config').removeClass('active');
	  	$('.block-settings').addClass('active');
	  	respond.editor.currBlock = $(this).parent();
	  	respond.editor.currElement = null;
	  	$(respond.editor.el).find('.current-element').removeClass('current-element');
	  	$(respond.editor.el).find('.current-node').removeClass('current-node');
	  	
	  	// set layout/container
	  	var id = respond.editor.currBlock.attr('id') || '';
	  	var cssClass = respond.editor.currBlock.attr('data-cssclass') || '';
	  	var nested = respond.editor.currBlock.attr('data-nested') || '';
	  	var containerId = respond.editor.currBlock.attr('data-containerid') || '';
	  	var containerCssClass = respond.editor.currBlock.attr('data-containercssclass') || '';
	  	
	  	var column1Id = respond.editor.currBlock.find('.col:nth-child(1)').attr('data-id') || '';
	  	var column1CssClass = respond.editor.currBlock.find('.col:nth-child(1)').attr('data-cssclass') || '';
	  	
	  	var column2Id = respond.editor.currBlock.find('.col:nth-child(2)').attr('data-id') || '';
	  	var column2CssClass = respond.editor.currBlock.find('.col:nth-child(2)').attr('data-cssclass') || '';
	  	
	  	var column3Id = respond.editor.currBlock.find('.col:nth-child(3)').attr('data-id') || '';
	  	var column3CssClass = respond.editor.currBlock.find('.col:nth-child(3)').attr('data-cssclass') || '';
	  	
	  	var column4Id = respond.editor.currBlock.find('.col:nth-child(4)').attr('data-id') || '';
	  	var column4CssClass = respond.editor.currBlock.find('.col:nth-child(4)').attr('data-cssclass') || '';
	  	
	  	var numColumns = respond.editor.currBlock.find('.col').length;
	  	
	  	
	  	var backgroundColor = respond.editor.currBlock.attr('data-backgroundcolor') || '';
	  	var backgroundImage = respond.editor.currBlock.attr('data-backgroundimage') || '';
	  	var backgroundStyle = respond.editor.currBlock.attr('data-backgroundstyle') || 'cover';
	  	var paddingTop = respond.editor.currBlock.attr('data-paddingtop') || '';
	  	var paddingRight = respond.editor.currBlock.attr('data-paddingright') || '';
	  	var paddingBottom = respond.editor.currBlock.attr('data-paddingbottom') || '';
	  	var paddingLeft = respond.editor.currBlock.attr('data-paddingleft') || '';
	  	
	  	// set scope
  		var scope = angular.element($("section.main")).scope();
  		
  		// set block, container
  		scope.$apply(function(){
		    scope.block.id = id;
		    scope.block.cssClass = cssClass;
		    scope.block.nested = nested;
		    
		    scope.block.backgroundColor = backgroundColor;
		    scope.block.backgroundImage = backgroundImage;
		    scope.block.backgroundStyle = backgroundStyle;
		    
		    scope.block.paddingTop = paddingTop;
		    scope.block.paddingRight = paddingRight;
		    scope.block.paddingBottom = paddingBottom;
		    scope.block.paddingLeft = paddingLeft;
		    
		    scope.container.id = containerId;
		    scope.container.cssClass = containerCssClass;
		    
		    scope.column1.id = column1Id;
		    scope.column1.cssClass = column1CssClass;
		    
		    scope.column2.id = column2Id;
		    scope.column2.cssClass = column2CssClass;
		    
		    scope.column3.id = column3Id;
		    scope.column3.cssClass = column3CssClass;
		    
		    scope.column4.id = column4Id;
		    scope.column4.cssClass = column4CssClass;
		    
		    scope.numColumns = numColumns;
		});
		
	});
	
}

// parses the html
respond.editor.parseHTML = function(){

	var top = respond.editor.el;

	function parseModules(node){
		var children = $(node).children();
		var response = '';
		
		for(var x=0; x<children.length; x++){
	  		var node = children[x];
	  		var cssclass = '';
	  		
	  		// get tag from node
	  		var tag = node.nodeName.toUpperCase();
	  		
	  		// get index from the menu
	  		var i = utilities.getIndexByAttribute(respond.editor.menu, 'tag', tag);
	  		
	  		// execute the parse method for the plugin
	  		if(i != -1){
		  		var action = respond.editor.menu[i].action + '.parse';
		  		
		  		try{
		  			var html = utilities.executeFunctionByName(action, window, node);
		  			response += html;
		  		}
		  		catch(e){
		  			if(respond.editor.debug == true){
			  			console.log('[respond.Editor.error] could not execute the parse method on the plugin');
			  		}
		  		}
	  		}
		 
		}
		
		return response;
	}
	  
  	var html = '';
	  
  	var blocks = $(top).find('div.block');
	  
  	if(blocks.length==0){
		html += '<div id="block-000" class="block sortable">';
		html += parseModules(top);
		html += '<span class="block-actions"><span>#block-000</span>' +
					respond.editor.defaults.blockMenu + '</span></div>'; 
	}
	else{
		// walk through blocks
		for(var y=0; y<blocks.length; y++){
	  		var id = $(blocks[y]).attr('id');
		  	var cssclass = $(blocks[y]).attr('class');
		  	var cssclass_readable = '.' + utilities.replaceAll(cssclass, ' ', '.');
		  	
		  	// get nested
		  	var nested = $(blocks[y]).attr('data-nested');
		  	var color = $(blocks[y]).attr('backgroundcolor') || '';
		  	var image = $(blocks[y]).attr('backgroundimage') || '';
		  	var style = $(blocks[y]).attr('backgroundstyle') || '';
		  	
		  	var paddingtop = $(blocks[y]).attr('paddingtop') || '';
		  	var paddingright = $(blocks[y]).attr('paddingright') || '';
		  	var paddingbottom = $(blocks[y]).attr('paddingbottom') || '';
		  	var paddingleft = $(blocks[y]).attr('paddingleft') || '';
		  	
		  	var containerId = $(blocks[y]).attr('data-containerid');
		  	var containerCssClass = $(blocks[y]).attr('data-containercssclass');
		  	
		  	// check for undefined
		  	if(nested == undefined){
				nested = 'not-nested';
			}
			
			if(containerId == undefined){
				containerId = '';
			}
			
			if(containerCssClass == undefined){
				containerCssClass = '';
			}
		  	
		  	// replace row and block
		  	cssclass = jQuery.trim(utilities.replaceAll(cssclass, 'block', ''));

			if(id==undefined || id=='')id='undefined';

		  	html += '<div id="'+id+'" class="block" ' +
		  				'data-id="' + id + '" ' +
		  				'data-cssclass="' + cssclass + '" ' +
		  				'data-nested="' + nested + '" ' +
		  				'data-backgroundcolor="' + color + '" ' +
		  				'data-backgroundimage="' + image + '" ' +
		  				'data-backgroundstyle="' + style + '" ' +
		  				'data-paddingtop="' + paddingtop + '" ' +
		  				'data-paddingright="' + paddingright + '" ' +
		  				'data-paddingbottom="' + paddingbottom + '" ' +
		  				'data-paddingleft="' + paddingleft + '" ' +
		  				'data-containerid="' + containerId + '" ' +
		  				'data-containercssclass="' + containerCssClass + '" ' +
		  				'>';        
		  
		  	// determine if there are columns
		  	var cols = $(blocks[y]).find('.col');
  
			for(var z=0; z<cols.length; z++){
				var colId = $(cols[z]).attr('id') || ''; 
				var colClassName = $(cols[z]).attr('class') || ''; 
				
				// build custom class
				var customColClassName = colClassName;
				customColClassName = utilities.replaceAll(customColClassName, 'ui-sortable', '');
				customColClassName = utilities.replaceAll(customColClassName, 'sortable', '');
				customColClassName = utilities.replaceAll(customColClassName, 'col-md-12', '');
				customColClassName = utilities.replaceAll(customColClassName, 'col-md-11', '');
				customColClassName = utilities.replaceAll(customColClassName, 'col-md-10', '');
				customColClassName = utilities.replaceAll(customColClassName, 'col-md-1', '');
				customColClassName = utilities.replaceAll(customColClassName, 'col-md-2', '');
				customColClassName = utilities.replaceAll(customColClassName, 'col-md-3', '');
				customColClassName = utilities.replaceAll(customColClassName, 'col-md-4', '');
				customColClassName = utilities.replaceAll(customColClassName, 'col-md-5', '');
				customColClassName = utilities.replaceAll(customColClassName, 'col-md-6', '');
				customColClassName = utilities.replaceAll(customColClassName, 'col-md-7', '');
				customColClassName = utilities.replaceAll(customColClassName, 'col-md-8', '');
				customColClassName = utilities.replaceAll(customColClassName, 'col-md-9', '');
				customColClassName = utilities.replaceAll(customColClassName, 'col ', '');
				
				// convert Bootstrap classes to Flex columns
		  		if(colClassName.indexOf('col-md-12') != -1){
			  		colClassName = 'col flex-100';
		  		}
		  		else if(colClassName.indexOf('col-md-11') != -1){
			  		colClassName = 'col flex-91';
		  		}
		  		else if(colClassName.indexOf('col-md-10') != -1){
			  		colClassName = 'col flex-83';
		  		}
		  		else if(colClassName.indexOf('col-md-9') != -1){
			  		colClassName = 'col flex-75';
		  		}
		  		else if(colClassName.indexOf('col-md-8') != -1){
			  		colClassName = 'col flex-66';
		  		}
		  		else if(colClassName.indexOf('col-md-7') != -1){
			  		colClassName = 'col flex-58';
		  		}
		  		else if(colClassName.indexOf('col-md-6') != -1){
			  		colClassName = 'col flex-50';
		  		}
		  		else if(colClassName.indexOf('col-md-5') != -1){
			  		colClassName = 'col flex-41';
		  		}
		  		else if(colClassName.indexOf('col-md-4') != -1){
			  		colClassName = 'col flex-33';
		  		}
		  		else if(colClassName.indexOf('col-md-3') != -1){
			  		colClassName = 'col flex-25';
		  		}
		  		else if(colClassName.indexOf('col-md-2') != -1){
			  		colClassName = 'col flex-16';
		  		}
		  		else if(colClassName.indexOf('col-md-1') != -1){
			  		colClassName = 'col flex-8';
		  		}
				
				// trim whitespace
				customColClassName = $.trim(customColClassName);
				
				// set for column
		  		html += '<div class="'+colClassName+' sortable" data-id="' + colId + '" data-cssclass="' + customColClassName + '">';
		  		html += parseModules(cols[z]);
		  		html += '</div>';
		  }
		  
		  var callout = '';
		  
		  /* WIP
		  // set color indicator
		  if(color != ''){
			  callout = '<div class="block-callout" style="background-color: ' + color + ';"></div>';
		  }
		  
		  // set image indicator
		  if(image != ''){
			  callout = '<div class="block-callout" style="background: url(' + 
			  				respond.editor.imagesUrl + image + '); background-size: cover;"></div>';
		  }
		  */

		  html += '<span class="block-actions"><span>#'+ id + '</span>' + callout +
		  			respond.editor.defaults.blockMenu + '</span></div>';
		}
	}

	return html;
	
}

// sets up the menu events
respond.editor.setupMenuEvents = function(){

	// set reference to element
	var editor = respond.editor.el;
	
	// a flag to flip if an event should be cancelled
	var cancel = false;
	
	// cancel on escape (revert draggable)
	$(document).keyup(function(e){
	    if(e.which=== 27 || e.keyCode === 27){
	        $('.editor-menu a.draggable').draggable({'revert': true }).trigger( 'mouseup' );
	        cancel = true;
	    }
	});

	// set up draggable
	$('.editor-menu a.draggable').draggable({
      connectToSortable: '.sortable',
      helper: 'clone',
      appendTo: 'body'
    });
    
    // reset the draggable on dragstart
    $('#editor-menu').on('dragstart', '.editor-menu a', function(){
    	cancel = false;
    	$('.editor-menu a.draggable').draggable({'revert': false });
    });
    
    // handle click/dragstop
    $('#editor-menu').on('dragstop click', '.editor-menu a', function(){
    
    	if(cancel == false){
	    	var action = $(this).attr('data-action') + '.create';
	    
			utilities.executeFunctionByName(action, window);
			cancel = false;
	    }
	    else{
		    $('#editor-placeholder').remove();
	    }
	    
    });
    
	// clear existing text events
	$(document).unbind('mousedown touchstart');
   
    // setup text events
	$(document).on('mousedown touchstart', '.context-menu a', function(e){
		var action = $(this).attr('data-action') + '.create';
		utilities.executeFunctionByName(action, window);
		
		return false;
	});
    
}

// sets up persistent events for the editor
respond.editor.setupPersistentEvents = function(){
	
	// setup context
	var el = $(respond.editor.el);
	var context = $(respond.editor.el);
	
	// make blocks sortable
	setupSortable();
	
	$('#blockBackgroundStyle').on('change', function(){
		
		if($(this).val() == 'parallax'){
			var scope = angular.element($("section.main")).scope();
			
			scope.$apply(function(){
				scope.block.backgroundColor = 'transparent';
			});
			
		}
		
	});
	
	// handle link clicks
	$(el).on('click', '[contentEditable=true] a', function(){
		
		// save the selection
		respond.text.link.selection = utilities.saveSelection();
		respond.text.link.element = null;

		// defaults
		var url = '';
		var cssClass = '';
		var target = '';
		var title = '';
		var hasLightbox = false;
		var textColor = '';

		// get link from selected text
		var link = utilities.getLinkFromSelection();
		
		respond.text.link.element = link;
		
		// set link detail if available
		if(link != null){
			url = $(link).attr('ui-sref');
			
			if(url == undefined){
				url = $(link).attr('href');
			}
			
			cssClass = link.className;
			target = link.target;
			title = link.title;
			textColor = $(link).attr('textcolor') || '';
			
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
	});
	
	
	// set respond.editor.currNode when div is focused
	$(el).on('click focusin', '.sortable>div', function(){
		respond.editor.currNode = this;
		
		// set current node class
		$(respond.editor.el).find('.current-node').removeClass('current-node');
		$(respond.editor.currNode).addClass('current-node');
		
		// get widget class
		var cssClass = $(this).prop('class').trim();
		
		var classes = $(this).prop('class').split(' ');
	  		
  		if(classes.length > 0){
	  		cssClass = classes[0];
  		}
  		
  		// set active in menu
		if(cssClass != ''){
			$('.editor-actions .'+cssClass).addClass('active');
		}
		
		// get index from the menu
		var i = utilities.getIndexByAttribute(respond.editor.menu, 'class', cssClass);
		
		if(i != -1){
			var node = this;
			var element = respond.editor.currElement;
	  		var action = respond.editor.menu[i].action;
	  		var form = $('.context-menu').find('[data-action="'+action+'"]');
	  		
	  		//var action = $(this).attr('data-action') + '.create';
	  		//utilities.executeFunctionByName(action, window);
	  		
	  		// hide config
	  		$('.context-menu').find('.config').removeClass('active');
	  		
	  		if(form){
	  		
	  			// add activate
		  		form.addClass('active');
		  		respond.editor.currConfig = form;
		  		
		  		// get scope of the content
		  		var scope = angular.element($("section.main")).scope();
		  		
		  		// reset node
		  		scope.$apply(function(){
				    scope.node = {}
				});
		  		
		  		// setup check for data attributes
		  		var expr = /^data\-(.+)$/;
			
		  		// walk through attributes of node
			    $.each($(node).get(0).attributes, function(index, attr) {
			        if (expr.test(attr.nodeName)) {
			            var key = attr.nodeName.replace('data-', '');
			           	var value = attr.nodeValue;
			           	
					   	// this enables binding to type=number fields for numeric values
			           	if($.isNumeric(value) === true){
				           	value = parseFloat(value);
			           	}
		  		
					   	// apply the nvp to ContentCtrl scope
				  		scope.$apply(function(){
						    scope.node[key] = value;
						});
			        }
			    });
			    
			    // execute configure event
			    action = action + '.configure';
			    
				try{
					utilities.executeFunctionByName(action, window, respond.editor.currNode, form);
				}
				catch(e){}
			  
	  		}
  		}
	});
	
	
	// handle focus out on div
	$(el).on('focusout', '.sortable div', function(){
		$('.editor-actions a').removeClass('active');
	});
	
	// handle expand-menu
	$(el).on('click', '.expand-menu', function(){
		$(this).toggleClass('active');
		$(this).next().toggleClass('active');
	});
	
	// set current element
	$(el).on('focusin click', 'textarea, input, [contenteditable=true], .respond-element', function(){
		respond.editor.currElement = this;
		
		// set current node class
		$(respond.editor.el).find('.current-element').removeClass('current-element');
		$(respond.editor.currElement).addClass('current-element');
		
		// get scope of the content
  		var scope = angular.element($("section.main")).scope();
  	
  		// walk through attributes of element
  		var element = respond.editor.currElement;
  		
  		if(element){
  		
  			// reset scope.element
	  		scope.$apply(function(){
			    scope.element = {};
			    scope.parent = {};
			});
  		
  			// setup check for data attributes
		  	var expr = /^data\-(.+)$/;
  		
  			// set attributes for element
	  		$.each($(element).get(0).attributes, function(index, attr) {
		        if (expr.test(attr.nodeName)) {
		            var key = attr.nodeName.replace('data-', '');
		           	var value = attr.nodeValue;
		           	
				   	// this enables binding to type=number fields for numeric values
		           	if($.isNumeric(value) === true){
			           	value = parseFloat(value);
		           	}
	  		
				   	// apply the nvp to ContentCtrl scope
			  		scope.$apply(function(){
					    scope.element[key] = value;
					});
		        }
			});
			
			// set attributes for parent
	  		$.each($(element).parent().get(0).attributes, function(index, attr) {
		        if (expr.test(attr.nodeName)) {
		            var key = attr.nodeName.replace('data-', '');
		           	var value = attr.nodeValue;
		           	
				   	// this enables binding to type=number fields for numeric values
		           	if($.isNumeric(value) === true){
			           	value = parseFloat(value);
		           	}
	  		
				   	// apply the nvp to ContentCtrl scope
			  		scope.$apply(function(){
					    scope.parent[key] = value;
					});
		        }
			});
  		}
  		
	});
		
	// handle down
	$(el).on('click', '.down', function(){
		if($(this).hasClass('disabled')){return false;}

		var curr = $(this.parentNode.parentNode.parentNode);
		var next = $(this.parentNode.parentNode.parentNode).next();

		$(curr).swap(next); 
		
		$(context).find('a.up').removeClass('disabled');
		$(context).find('a.up').first().addClass('disabled');

		$(context).find('a.down').removeClass('disabled');
		$(context).find('a.down').last().addClass('disabled'); 
		
		return false;
	});

	// handle up
	$(el).on('click', '.up', function(){
		if($(this).hasClass('disabled')){return false;}
		  
		var curr = $(this.parentNode.parentNode.parentNode);
		var next = $(this.parentNode.parentNode.parentNode).prev();
		  
		$(curr).swap(next); 
		
		$(context).find('a.up').removeClass('disabled');
		$(context).find('a.up').first().addClass('disabled');

		$(context).find('a.down').removeClass('disabled');
		$(context).find('a.down').last().addClass('disabled'); 
		
		return false;
	});
	
	// handle duplicate
	$(el).on('click', '.duplicate', function(){
	
		var curr = $(this.parentNode.parentNode.parentNode);
		
		var clone = curr.clone();
		
		//$(clone).insertAfter(curr);
		var editor = $(context).get(0);
		
		// generate new block id
		var blockid = respond.editor.GenerateUniqId(editor, 'block', 'block');
	
		// set new blockid
		$(clone).attr('id', blockid);
		
		// default
		var cssClass = '';
		
		// set new readable
		if($(clone).attr('data-cssclass') !== undefined && $(clone).attr('data-cssclass') !== null){
			var cssClass = $(clone).attr('data-cssclass').trim().replace(/\s/g, '.');
		}
		
		if(cssClass != ''){
			cssClass = ' .block.row.'+cssClass;
		}
		else{
			cssClass = ' .block.row';
		}
		
		$(clone).find('.block-actions span').text('#'+blockid+cssClass);
		
		// find all blocks in clone
		var blocks = $(clone).find('.col>div');
		
		// walkthough blocks
		for(x=0; x<blocks.length; x++){
			
			var cssClass = $(blocks[x]).attr('class');
			
			// ensures a unique id for cloned elements
			var offset = x;
			
			// generate a uniqid
			var newid = respond.editor.generateUniqId(cssClass, cssClass, offset);
			
			// set new id
			$(blocks[x]).attr('id', newid);
			
			//aleri18n.t('id='+$(blocks[x]).attr('id'));
			
			var dataid = $(blocks[x]).attr('data-id');
			
			if (typeof dataid !== 'undefined' && dataid !== false) {
			    $(blocks[x]).attr('data-id', newid);
			}
			
		}
		
		// insert clone
		$(clone).insertAfter(curr);
		
		return false;
	});

}

// appends content to the editor
respond.editor.append = function(html){ 

	// set reference to element
	var el = respond.editor.el;
	
	// if dragged placeholder exists
	if($('#editor-placeholder').length > 0){
		var node = $('#editor-placeholder');
		
		var temp = $(node).after(html).get(0);
		
		var added = $(temp).next();
		
		$('[contentEditable=true], input, textarea').blur();
		$(added).find('[contentEditable=true], input, textarea').first().focus();
		
		$(node).remove();
		
		respond.editor.currNode = $(added);
	}
	else{
		var blocks = $(el).find('div.block');
		var length = blocks.length;
		
		// appends it toe currnode (if set) or the last block if not set
		if(respond.editor.currNode){
		
			var temp = $(respond.editor.currNode).after(html).get(0);
			
			var added = $(temp).next();
			
			$('[contentEditable=true], input, textarea').blur();
			$(added).find('[contentEditable=true], input, textarea').first().focus();
			
			respond.editor.currNode = $(added);
		
		}
		else if(length>0){  
			var curr = blocks[length-1]; // get last block
			
			var cols = $(curr).find('div.col');
			
			if(cols.length>0){
				curr = $(cols[0]);
				respond.editor.currNode = $(html).appendTo(curr);
			}
			
			// arrh! focus!
			$(curr).find('[contentEditable=true], input, textarea').focus();
		}
	}

}

// gets the current description for the content in the editor
respond.editor.getDescription = function(){ 

	var el = respond.editor.el;

	// get dom element if need be
	if(el.jquery){
		el = el.get(0);
	}
	
	var divs = $(el).find('div.p');
	
	var desc = '';

	for(var x=0; x<divs.length; x++){
		desc += $.trim($(divs[x]).find('div').text());
	}

	if(desc.length>200){
		desc = desc.substring(0, 200) + '...';
	}
	
	return desc;
	
}

// gets the primary image (first) for the editor
respond.editor.getPrimaryImage = function(){

	var el = respond.editor.el; 

	// get dom element if need be
	if(el.jquery){
		el = el.get(0);
	}
	
	// get the first image
	var imgs = $(el).find('div.block img');
	
	if(imgs.length==0){
		imgs = $(el).find('div.block span.image img');
	}
	
	var image = '';
	
	if(imgs.length>0){
	
		var parts = imgs[0].src.split('/');
		
		if(parts.length>0){
			image = parts[parts.length-1];
		}
		
	}
	
	if(image.substr(0,2)=='t-'){
		image = image.substr(2);
	}
	
	return image;
}

// get headlines from content
respond.editor.getTranslations = function(content){

	// parse content into a crawable jQuery element
	var temp = $.parseHTML(content);
	
	// find any element with the attribute, i18next
	var els = $(temp).find('[data-i18n]');
	
	var translations = {};
	
	// set translations
	for(x=0; x<els.length; x++){
	
		var id = $(els[x]).attr('id');
		
		// add to array
		if(id != '' && id != undefined){
		
			// get content to be translated
			var html = $(els[x]).html();
		
			// trim content
			html = $.trim(html);
			
			// create translation 
			translations[id] = html;
		}
		
	}
	
	return translations;

}


// gets the content from the editor
respond.editor.getContent = function(){ 

	var el = respond.editor.el;

	// get dom element if need be
	if(el.jquery){
		el = el.get(0);
	}
	
	var html = '';
		
	// gets html for a given block
	function getBlockHtml(block){
	
		var newhtml = '';
	  
	  	var divs = $(block).find('div');
	  
	  	for(var x=0; x<divs.length; x++){
	  	
	  		var cssClass = $(divs[x]).attr('class');
	  	
	  		if(cssClass != undefined){
	  			var classes = $(divs[x]).attr('class').split(' ');
	  		
		  		if(classes.length > 0){
			  		cssClass = classes[0];
		  		}
		  		
		  		// get index from the menu
		  		var i = utilities.getIndexByAttribute(respond.editor.menu, 'class', cssClass);
		  		
		  		// execute the generate method for the plugin
		  		if(i != -1){
			  		var action =respond.editor.menu[i].action + '.generate';
			  		var node = divs[x];
			  		
			  		try{
			  			var html = utilities.executeFunctionByName(action, window, node);
			  			newhtml += html;
			  		}
			  		catch(e){
			  			if(respond.editor.debug == true){
				  			console.log('[respond.Editor.generate] parse, error=' + e.message);
				  		}
			  		}
		  		}
		  		
		  	}
	  				
	  	}
	
	  	return newhtml;
	}
	
	var blocks = $(el).find('div.block');
	
	// walk through blocks
	for(var y=0; y<blocks.length; y++){
	  	var id = $(blocks[y]).attr('id');
	  	var cssclass = $(blocks[y]).attr('data-cssclass') || '';
	  	
	  	// cleanup css class
	  	cssclass = utilities.cleanEditorCssClass(cssclass);
	
	  	if(cssclass==undefined || cssclass=='')cssclass = '';
	
	  	if(cssclass!=''){
	  		cssclass = ' ' + cssclass;
	  	}
	  	
	  	if(id==undefined || id=='')id='block-'+y;
	  	
	  	// set nested
	  	var nested = $(blocks[y]).attr('data-nested');
	  	var color = $(blocks[y]).attr('data-backgroundcolor') || '';
	  	var image = $(blocks[y]).attr('data-backgroundimage') || '';
	  	var style = $(blocks[y]).attr('data-backgroundstyle') || '';
	  	
	  	var paddingTop = $(blocks[y]).attr('data-paddingtop') || '';
	  	var paddingRight = $(blocks[y]).attr('data-paddingright') || '';
	  	var paddingBottom = $(blocks[y]).attr('data-paddingbottom' || '');
	  	var paddingLeft = $(blocks[y]).attr('data-paddingleft') || '';
	  	
	  	var containerId = $(blocks[y]).attr('data-containerid');
	  	var containerCssClass = $(blocks[y]).attr('data-containercssclass') || '';
	  	
	  	// cleanup css class
	  	containerCssClass = utilities.cleanEditorCssClass(containerCssClass);
	  	
	  	// set bg color
	  	var bgcolor = '';
	  	
	  	if(color != '' && color != undefined){
		  	bgcolor = 'backgroundcolor="' + color + '" ';
	  	}
	  	
	  	// set bg image
	  	var bgimage = '';
	  	var bgstyle = '';
	  	var padding = '';
	  	
	  	if(image != '' && image != undefined){
		  	bgimage = 'backgroundimage="' + image + '" ';
		  	
		  	if(style != '' && style != undefined){
		  		bgstyle = 'backgroundstyle="' + style + '" ';
		  	}
		  	else{
		  		bgstyle = 'backgroundstyle="cover" ';
			}
	  	}
	  	
	  	// set padding
	  	if(paddingTop != '' && paddingTop != 'undefined'){
		  	padding += 'paddingtop="' + paddingTop + '" ';
	  	}
	  	
	  	if(paddingRight != '' && paddingRight != 'undefined'){
		  	padding += 'paddingright="' + paddingRight + '" ';
	  	}
	  	
	  	if(paddingBottom != '' && paddingBottom != 'undefined'){
		  	padding += 'paddingbottom="' + paddingBottom + '" ';
	  	}
	  	
	  	if(paddingLeft != '' && paddingLeft != 'undefined'){
		  	padding += 'paddingleft="' + paddingLeft + '" ';
	  	}
	  	
	  	// check undefined
	  	if(nested == undefined){
			nested = 'not-nested';
		}
		
		if(containerId == undefined){
			containerId = '';
		}
		
		if(containerCssClass == undefined){
			containerCssClass = '';
		}
		
		// set defaults to blank
		var containerIdHtml = '';
		var containerClassHtml = '';
		
		// if an id is specified build html for it
		if($.trim(containerId) != ''){
			containerIdHtml = ' id="' + containerId + '"';
		}
		
		// add a space to separate it from .container
		if($.trim(containerCssClass) != ''){
			containerClassHtml = ' ' + containerCssClass;
		}
		
		// add container for nested blocks
	  	if(nested == 'nested'){
		  	html += '<div' + containerIdHtml + ' ' + bgcolor + bgimage + bgstyle + ' class="container' + containerClassHtml + '">';
		  	
		  	// remove any duplicate row or block tags
		  	cssclass = utilities.replaceAll(cssclass, 'block', '');
		  	cssclass = utilities.replaceAll(cssclass, 'row', '');
		  	cssclass = $.trim(cssclass);
		  	
		  	// row HTML
		  	html += '<div id="'+id+'" class="block row ' + cssclass + '" ' +
	  			'data-nested="' + nested + '" ' + bgcolor + bgimage + bgstyle + padding +
	  			'data-containerid="' + containerId + '" ' +
	  			'data-containercssclass="' + containerCssClass + '"' +
	  			'>';
	  	}
	  	else{
		  	// remove any duplicate row or block tags
		  	cssclass = utilities.replaceAll(cssclass, 'block', '');
		  	cssclass = utilities.replaceAll(cssclass, 'row', '');
		  	cssclass = $.trim(cssclass);
		  	
		  	// row HTML
		  	html += '<div id="'+id+'" class="block row ' + cssclass + '" ' +
	  			'data-nested="' + nested + '" ' + bgcolor + bgimage + bgstyle + padding +
	  			'data-containerid="' + containerId + '" ' +
	  			'data-containercssclass="' + containerCssClass + '"' +
	  			'>';
	  	}
	  	
	  	
	  
	  	// determine if there are columns
	  	var cols = $(blocks[y]).find('.col');
	
	  	if(cols.length==0){
			html += getBlockHtml(blocks[y]);
	  	}
	  	else{
			for(var z=0; z<cols.length; z++){
		  		var className = $.trim($(cols[z]).attr('class'));
		  		var customClass = $.trim($(cols[z]).attr('data-cssclass'));
		  		var customId = $.trim($(cols[z]).attr('data-id'));
		  		
		  		// parse FLEX columns into Bootstrap columns
		  		if(className.indexOf('flex-100') != -1){
			  		className = 'col col-md-12';
		  		}
		  		else if(className.indexOf('flex-91') != -1){
			  		className = 'col col-md-11';
		  		}
		  		else if(className.indexOf('flex-83') != -1){
			  		className = 'col col-md-10';
		  		}
		  		else if(className.indexOf('flex-75') != -1){
			  		className = 'col col-md-9';
		  		}
		  		else if(className.indexOf('flex-66') != -1){
			  		className = 'col col-md-8';
		  		}
		  		else if(className.indexOf('flex-58') != -1){
			  		className = 'col col-md-7';
		  		}
		  		else if(className.indexOf('flex-50') != -1){
			  		className = 'col col-md-6';
		  		}
		  		else if(className.indexOf('flex-41') != -1){
			  		className = 'col col-md-5';
		  		}
		  		else if(className.indexOf('flex-33') != -1){
			  		className = 'col col-md-4';
		  		}
		  		else if(className.indexOf('flex-25') != -1){
			  		className = 'col col-md-3';
		  		}
		  		else if(className.indexOf('flex-16') != -1){
			  		className = 'col col-md-2';
		  		}
		  		else if(className.indexOf('flex-8') != -1){
			  		className = 'col col-md-1';
		  		}
		  		
		  		// append custom class to class
		  		className = $.trim(className + ' ' + customClass);
		  		
		  		// cleanup css class
		  		className = utilities.cleanEditorCssClass(className);
		  		
		  		var id = '';
		  		
		  		// create id
		  		if(customId != ''){
			  		id = 'id="' + customId + '" ';
		  		}
		  
		  		html += '<div ' + id + ' class="'+className+'">';
		  		html += getBlockHtml(cols[z]);
		  		html += '</div>';
			}
	  	}
	
	  	html+= '</div>';
	  	
	  	// close container
	  	if(nested == 'nested'){
		  	html += '</div>';
	  	}
	
	}
	
	return html;
	
}

// generates a unique id for elements 
respond.editor.generateUniqId = function(className, prefix, offset){

	var el = respond.editor.el;

	// set a default
	if(offset === undefined || offset === null){
		offset = 0;
	}
	
	// get dom element
	if(el.jquery){
		el = el.get(0);
	}
	
	var length = $(el).find('.'+className).length + 1 + offset;
	var uniqId = respond.editor.prefix+prefix +'-'+ length;
	
	// find a uniqId
	while($('#'+uniqId).length > 0){
		length++;
		uniqId = prefix +'-'+ length;
	}
	
	return uniqId;
}

// build the editor
respond.editor.build = function(){

	var el = respond.editor.el;
	var menu = respond.editor.menu
	
	// get dom element
	if(el.jquery){
		el = el.get(0);
	}

  	if(respond.editor.debug == true){
	  	console.log('[respond.editor] enter Build');
  	}
  	
  	// adds the editor class
  	$(el).addClass('editor');
  	
  	if(respond.editor.debug == true){
	  	console.log('[respond.editor] before ParseHTML');
  	}
  
	// parse HTML
	var response = respond.editor.parseHTML();
	
	// set HTML
  	$(el).html(response); 
  	
  	$('[contenteditable=true]').paste();
  	
  	// trigger contentLoaded
	$(el).trigger('respond.editor.contentLoaded');
  	
  	// enable tooltip
  	if(!Modernizr.touch){ 
  		$('#editor-menu a').tooltip({container: 'body', placement: 'bottom'});
  	}
  	
  	if(respond.editor.debug == true){
	  	console.log('[respond.editor] before setupMenuEvents');
  	}
	
	// setup menu item events
	respond.editor.setupMenuEvents(el);
	
	if(respond.editor.debug == true){
	  	console.log('[respond.editor] before setupPersistentEvents');
  	}
	
	// setup persistent events
	respond.editor.setupPersistentEvents(el);
	
	if(respond.editor.debug == true){
	  	console.log('[respond.editor] before setupPlugins');
  	}
	
	respond.editor.setupPlugins();
	
	// detect any changes
	$(el).on('keyup', '[contentEditable=true]', function() {
	    
	    // set scope
  		var scope = angular.element($("section.main")).scope();
  		
  		// set modified
  		scope.setModified();
	    
	});
	
	$('.editor-actions a').on('mousedown', function() {
	    
	    // set scope
  		var scope = angular.element($("section.main")).scope();
  		
  		// set modified
  		scope.setModified();
	    
	});
	
	// detect any changes
	$('#context-menu input').on('keyup', function() {
	    
	    // set scope
  		var scope = angular.element($("section.main")).scope();
  		
  		// set modified
  		scope.setModified();
	    
	});
	
	// detect any changes
	$('#context-menu select').on('change', function() {
	    
	    // set scope
  		var scope = angular.element($("section.main")).scope();
  		
  		// set modified
  		scope.setModified();
	    
	});
	
}

// build the editor
respond.editor.refresh = function(){

	var el = respond.editor.el;

	// parse HTML
	var response = respond.editor.parseHTML();
	
	// set HTML
  	$(el).html(response);
  	
  	// re-init sortable
	setupSortable();

}