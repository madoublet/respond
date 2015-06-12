// create namespace
var respond = respond || {};
respond.element = respond.element || {};

// h1 element
respond.element.h1 = {
	
	// creates h1
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('h1', 'h1');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="editable-content" contentEditable="true"></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-h1';
		attrs['data-cssclass'] = '';
		attrs['data-textcolor'] = '';
		attrs['data-textsize'] = '';
		attrs['data-textshadowcolor'] = '';
		attrs['data-textshadowhorizontal'] = '';
		attrs['data-textshadowvertical'] = '';
		attrs['data-textshadowblur'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		// setup paste filter
		$('#'+id+' [contentEditable=true]').paste();
		
		return true;
		
	},
	
	// parse h1
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="editable-content" contentEditable="true">' + $(node).html() + '</div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-h1';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-textcolor'] = $(node).attr('textcolor');
		attrs['data-textsize'] = $(node).attr('textsize');
		attrs['data-textshadowcolor'] = $(node).attr('textshadowcolor');
		attrs['data-textshadowhorizontal'] = $(node).attr('textshadowhorizontal');
		attrs['data-textshadowvertical'] = $(node).attr('textshadowvertical');
		attrs['data-textshadowblur'] = $(node).attr('textshadowblur');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate h1
	generate:function(node){

  		// html for tag
  		var html = $(node).find('[contentEditable=true]').html();
  		
		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['textcolor'] = $(node).attr('data-textcolor');
		attrs['textsize'] = $(node).attr('data-textsize');
		attrs['textshadowcolor'] = $(node).attr('data-textshadowcolor');
		attrs['textshadowhorizontal'] = $(node).attr('data-textshadowhorizontal');
		attrs['textshadowvertical'] = $(node).attr('data-textshadowvertical');
		attrs['textshadowblur'] = $(node).attr('data-textshadowblur');
		
		// return element
		return utilities.element('h1', attrs, html, true);
		
	},
	
	// configure
	configure:function(node, form){
		
	}
	
};

// h2 element
respond.element.h2 = {

	// creates h2
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('h2', 'h2');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="editable-content" contentEditable="true"></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-h2';
		attrs['data-cssclass'] = '';
		attrs['data-textcolor'] = '';
		attrs['data-textsize'] = '';
		attrs['data-textshadowcolor'] = '';
		attrs['data-textshadowhorizontal'] = '';
		attrs['data-textshadowvertical'] = '';
		attrs['data-textshadowblur'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		// setup paste filter
		$('#'+id+' [contentEditable=true]').paste();
		
		return true;
		
	},
	
	// parse h2
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="editable-content" contentEditable="true">' + $(node).html() + '</div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-h2';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-textcolor'] = $(node).attr('textcolor');
		attrs['data-textsize'] = $(node).attr('textsize');
		attrs['data-textshadowcolor'] = $(node).attr('textshadowcolor');
		attrs['data-textshadowhorizontal'] = $(node).attr('textshadowhorizontal');
		attrs['data-textshadowvertical'] = $(node).attr('textshadowvertical');
		attrs['data-textshadowblur'] = $(node).attr('textshadowblur');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate h2
	generate:function(node){

  		// html for tag
  		var html = $(node).find('[contentEditable=true]').html();
  		
		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['textcolor'] = $(node).attr('data-textcolor');
		attrs['textsize'] = $(node).attr('data-textsize');
		attrs['textshadowcolor'] = $(node).attr('data-textshadowcolor');
		attrs['textshadowhorizontal'] = $(node).attr('data-textshadowhorizontal');
		attrs['textshadowvertical'] = $(node).attr('data-textshadowvertical');
		attrs['textshadowblur'] = $(node).attr('data-textshadowblur');
		
		// return element
		return utilities.element('h2', attrs, html, true);
		
	}
	
};

// h3 element
respond.element.h3 = {

	// creates h3
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('h3', 'h3');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="editable-content" contentEditable="true"></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-h3';
		attrs['data-cssclass'] = '';
		attrs['data-textcolor'] = '';
		attrs['data-textsize'] = '';
		attrs['data-textshadowcolor'] = '';
		attrs['data-textshadowhorizontal'] = '';
		attrs['data-textshadowvertical'] = '';
		attrs['data-textshadowblur'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		// setup paste filter
		$('#'+id+' [contentEditable=true]').paste();
		
		return true;
		
	},
	
	// parse h3
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="editable-content" contentEditable="true">' + $(node).html() + '</div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-h3';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-textcolor'] = $(node).attr('textcolor');
		attrs['data-textsize'] = $(node).attr('textsize');
		attrs['data-textshadowcolor'] = $(node).attr('textshadowcolor');
		attrs['data-textshadowhorizontal'] = $(node).attr('textshadowhorizontal');
		attrs['data-textshadowvertical'] = $(node).attr('textshadowvertical');
		attrs['data-textshadowblur'] = $(node).attr('textshadowblur');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate h3
	generate:function(node){

  		// html for tag
  		var html = $(node).find('[contentEditable=true]').html();
  		
		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['textcolor'] = $(node).attr('data-textcolor');
		attrs['textsize'] = $(node).attr('data-textsize');
		attrs['textshadowcolor'] = $(node).attr('data-textshadowcolor');
		attrs['textshadowhorizontal'] = $(node).attr('data-textshadowhorizontal');
		attrs['textshadowvertical'] = $(node).attr('data-textshadowvertical');
		attrs['textshadowblur'] = $(node).attr('data-textshadowblur');
		
		// return element
		return utilities.element('h3', attrs, html, true);
		
	}
	
};

// h4 element
respond.element.h4 = {

	// creates h4
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('h4', 'h4');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="editable-content" contentEditable="true"></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-h4';
		attrs['data-cssclass'] = '';
		attrs['data-textcolor'] = '';
		attrs['data-textsize'] = '';
		attrs['data-textshadowcolor'] = '';
		attrs['data-textshadowhorizontal'] = '';
		attrs['data-textshadowvertical'] = '';
		attrs['data-textshadowblur'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		// setup paste filter
		$('#'+id+' [contentEditable=true]').paste();
		
		return true;
		
	},
	
	// parse h4
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="editable-content" contentEditable="true">' + $(node).html() + '</div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-h4';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-textcolor'] = $(node).attr('textcolor');
		attrs['data-textsize'] = $(node).attr('textsize');
		attrs['data-textshadowcolor'] = $(node).attr('textshadowcolor');
		attrs['data-textshadowhorizontal'] = $(node).attr('textshadowhorizontal');
		attrs['data-textshadowvertical'] = $(node).attr('textshadowvertical');
		attrs['data-textshadowblur'] = $(node).attr('textshadowblur');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate h4
	generate:function(node){

  		// html for tag
  		var html = $(node).find('[contentEditable=true]').html();
  		
		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['textcolor'] = $(node).attr('data-textcolor');
		attrs['textsize'] = $(node).attr('data-textsize');
		attrs['textshadowcolor'] = $(node).attr('data-textshadowcolor');
		attrs['textshadowhorizontal'] = $(node).attr('data-textshadowhorizontal');
		attrs['textshadowvertical'] = $(node).attr('data-textshadowvertical');
		attrs['textshadowblur'] = $(node).attr('data-textshadowblur');
		
		// return element
		return utilities.element('h4', attrs, html, true);
		
	}
	
};

// h5 element
respond.element.h5 = {

	// creates h5
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('h5', 'h5');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="editable-content" contentEditable="true"></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-h5';
		attrs['data-cssclass'] = '';
		attrs['data-textcolor'] = '';
		attrs['data-textsize'] = '';
		attrs['data-textshadowcolor'] = '';
		attrs['data-textshadowhorizontal'] = '';
		attrs['data-textshadowvertical'] = '';
		attrs['data-textshadowblur'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		// setup paste filter
		$('#'+id+' [contentEditable=true]').paste();
		
		return true;
		
	},
	
	// parse h5
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="editable-content" contentEditable="true">' + $(node).html() + '</div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-h5';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-textcolor'] = $(node).attr('textcolor');
		attrs['data-textsize'] = $(node).attr('textsize');
		attrs['data-textshadowcolor'] = $(node).attr('textshadowcolor');
		attrs['data-textshadowhorizontal'] = $(node).attr('textshadowhorizontal');
		attrs['data-textshadowvertical'] = $(node).attr('textshadowvertical');
		attrs['data-textshadowblur'] = $(node).attr('textshadowblur');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate h5
	generate:function(node){

  		// html for tag
  		var html = $(node).find('[contentEditable=true]').html();
  		
		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['textcolor'] = $(node).attr('data-textcolor');
		attrs['textsize'] = $(node).attr('data-textsize');
		attrs['textshadowcolor'] = $(node).attr('data-textshadowcolor');
		attrs['textshadowhorizontal'] = $(node).attr('data-textshadowhorizontal');
		attrs['textshadowvertical'] = $(node).attr('data-textshadowvertical');
		attrs['textshadowblur'] = $(node).attr('data-textshadowblur');
		
		// return element
		return utilities.element('h5', attrs, html, true);
		
	}
	
};

// p element
respond.element.p = {
	
	map:[],

	// initialize p
	init:function(){
	
		// keydown event
		$(document).on('keydown keyup', '.respond-p [contentEditable=true]', function(event){
			
			respond.element.p.map[event.keyCode] = event.type == 'keydown';
		
			// ENTER KEY
			if(respond.element.p.map[13] && !respond.element.p.map[16]){
				
				// get a reference to the editor
				var editor = $(this).parents('.container');
			
				// create a new p element
				respond.element.p.create(editor);
				
				// focus on the new element
				$(this.parentNode.nextSibling).find('div').focus();
				
				event.preventDefault();
				return false;
			}
			
		});
				
	},

	// creates p
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('p', 'p');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="editable-content" contentEditable="true"></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-p';
		attrs['data-cssclass'] = '';
		attrs['data-textcolor'] = '';
		attrs['data-textsize'] = '';
		attrs['data-textshadowcolor'] = '';
		attrs['data-textshadowhorizontal'] = '';
		attrs['data-textshadowvertical'] = '';
		attrs['data-textshadowblur'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		// setup paste filter
		$('#'+id+' [contentEditable=true]').paste();
		
		return true;
		
	},
	
	// parse p
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="editable-content" contentEditable="true">' + $(node).html() + '</div>';
				
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-p';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-textcolor'] = $(node).attr('textcolor');
		attrs['data-textsize'] = $(node).attr('textsize');
		attrs['data-textshadowcolor'] = $(node).attr('textshadowcolor');
		attrs['data-textshadowhorizontal'] = $(node).attr('textshadowhorizontal');
		attrs['data-textshadowvertical'] = $(node).attr('textshadowvertical');
		attrs['data-textshadowblur'] = $(node).attr('textshadowblur');
		
		// setup paste filter
		$('#'+id+' [contentEditable=true]').paste();
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate p
	generate:function(node){
	
  		// html for tag
  		var html = $(node).find('[contentEditable=true]').html();
  		
		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['textcolor'] = $(node).attr('data-textcolor');
		attrs['textsize'] = $(node).attr('data-textsize');
		attrs['textshadowcolor'] = $(node).attr('data-textshadowcolor');
		attrs['textshadowhorizontal'] = $(node).attr('data-textshadowhorizontal');
		attrs['textshadowvertical'] = $(node).attr('data-textshadowvertical');
		attrs['textshadowblur'] = $(node).attr('data-textshadowblur');
		
		// return element
		return utilities.element('p', attrs, html, true);
		
	}
	
};

respond.element.p.init();

// blockquote element
respond.element.q = {

	// creates blockquote
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('q', 'q');
		
		// build html
		var html = '<i class="in-textbox fa fa-quote-left"></i>' + 
					respond.editor.defaults.elementMenu +
					'<div class="editable-content" contentEditable="true"></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-q';
		attrs['data-cssclass'] = '';
		attrs['data-textcolor'] = '';
		attrs['data-textsize'] = '';
		attrs['data-textshadowcolor'] = '';
		attrs['data-textshadowhorizontal'] = '';
		attrs['data-textshadowvertical'] = '';
		attrs['data-textshadowblur'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		// setup paste filter
		$('#'+id+' [contentEditable=true]').paste();
		
		return true;
		
	},
	
	// parse blockquote
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		
		// build html
		var html = '<i class="in-textbox fa fa-quote-left"></i>' + 
					respond.editor.defaults.elementMenu +
					'<div class="editable-content" contentEditable="true">' + $(node).html() + '</div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-q';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-textcolor'] = $(node).attr('textcolor');
		attrs['data-textsize'] = $(node).attr('textsize');
		attrs['data-textshadowcolor'] = $(node).attr('textshadowcolor');
		attrs['data-textshadowhorizontal'] = $(node).attr('textshadowhorizontal');
		attrs['data-textshadowvertical'] = $(node).attr('textshadowvertical');
		attrs['data-textshadowblur'] = $(node).attr('textshadowblur');
		
		// return element
		return utilities.element('div', attrs, html);
		
	},
	
	// generate blockquote
	generate:function(node){
	
  		// html for tag
  		var html = $(node).find('[contentEditable=true]').html();
  		
		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['textcolor'] = $(node).attr('data-textcolor');
		attrs['textsize'] = $(node).attr('data-textsize');
		attrs['textshadowcolor'] = $(node).attr('data-textshadowcolor');
		attrs['textshadowhorizontal'] = $(node).attr('data-textshadowhorizontal');
		attrs['textshadowvertical'] = $(node).attr('data-textshadowvertical');
		attrs['textshadowblur'] = $(node).attr('data-textshadowblur');
		
		// return element
		return utilities.element('blockquote', attrs, html, true);
		
	}
	
};

// ul element
respond.element.ul = {

	// initialize ul
	init:function(){
	
		// keydown event
		$(document).on('keydown', '.respond-ul [contentEditable=true]', function(event){
		
			// ENTER KEY
			if(event.keyCode == '13'){
				
				// add contentEditable block after the element
				$(this).after(
					'<div contentEditable="true"></div>'
				);
				
				$(this.nextSibling).focus();
				
				event.preventDefault();
				return false;
				
			}
			// DELETE KEY
			else if(event.keyCode == '8'){
			
				var h = $(this).html().trim();
				h = utilities.replaceAll(h, '<br>', '');
				
				if(h==''){
			
					var parent = $(this.parentNode);
					var divs = $(this.parentNode).find('div');
					
					if(divs.length>1){
						$(this).remove();
						
					
						var last = parent.find('div:last');
						
						last.focus();
						last.select();
					}
					
					event.preventDefault();
					return false;					
				}
				
			}
			
		});
		
	},

	// creates ul
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('ul', 'ul');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="editable-content" contentEditable="true"></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-ul';
		attrs['data-cssclass'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		// setup paste filter
		$('#'+id+' [contentEditable=true]').paste();
		
		return true;
		
	},
	
	// parse ul
	parse:function(node){
	
		// build html
		var html = respond.editor.defaults.elementMenu;
				
		// parse lis				
		var lis = $(node).children();			
					
		for(y=0; y<lis.length; y++){
		
			// tag attributes
			var attrs = [];
			attrs['data-id'] = $(lis[y]).attr('id');
			attrs['data-cssclass'] = $(lis[y]).attr('class');
			attrs['contentEditable'] = 'true';
			
			// return element
			html += utilities.element('div', attrs, $(lis[y]).html());
		}
		
		// get params
		var id = $(node).attr('id');
		
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-ul';
		attrs['data-cssclass'] = $(node).attr('class');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate ul
	generate:function(node){
	
  		// html for tag
  		var html = '';
  		
  		// get lis
  		var lis = $(node).find('[contentEditable=true]');
  		
  		for(var y=0; y<lis.length; y++){
  		
			// tag attributes
			var attrs = [];
			attrs['id'] = $(lis[y]).attr('data-id');
			attrs['class'] = $(lis[y]).attr('data-cssclass');
		
			// create li
			html += utilities.element('li', attrs, $(lis[y]).html(), true);
			
	  	}
	  	
		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		
		// return element
		return utilities.element('ul', attrs, html);
		
	}
	
};

respond.element.ul.init();

// ol element
respond.element.ol = {

	// initialize ol
	init:function(){
	
		// keydown event
		$(document).on('keydown', '.respond-ol [contentEditable=true]', function(event){
		
			// ENTER KEY
			if(event.keyCode == '13'){
				
				// add contentEditable block after the element
				$(this).after(
					'<div contentEditable="true"></div>'
				);
				
				$(this.nextSibling).focus();
				
				event.preventDefault();
				return false;
				
			}
			// DELETE KEY
			else if(event.keyCode == '8'){
			
				var h = $(this).html().trim();
				h = utilities.replaceAll(h, '<br>', '');
				
				if(h==''){
			
					var parent = $(this.parentNode);
					var divs = $(this.parentNode).find('div');
					
					if(divs.length>1){
						$(this).remove();
						
					
						var last = parent.find('div:last');
						
						last.focus();
						last.select();
					}
					
					event.preventDefault();
					return false;					
				}
				
			}
			
		});
		
	},

	// creates ol
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('ol', 'ol');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="editable-content" contentEditable="true"></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-ol';
		attrs['data-cssclass'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		// setup paste filter
		$('#'+uniqId+' [contentEditable=true]').paste();
		
		return true;
		
	},
	
	// parse ol
	parse:function(node){
	
		// build html
		var html = respond.editor.defaults.elementMenu;
	
		// parse lis				
		var lis = $(node).children();			
					
		for(y=0; y<lis.length; y++){
			
			// set attributes
			var attrs = [];
			attrs['data-id'] = $(lis[y]).attr('id');
			attrs['data-cssclass'] = $(lis[y]).attr('class');
			attrs['contentEditable'] = 'true';
			
			// return element
			html += utilities.element('div', attrs, $(lis[y]).html());
		}
		
		var id = $(node).attr('id');
		
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-ol';
		attrs['data-cssclass'] = $(node).attr('class');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate ol
	generate:function(node){
	
		// html for tag
  		var html = '';
	
  		// get lis
  		var lis = $(node).find('[contentEditable=true]');
  		
  		for(var y=0; y<lis.length; y++){
  		
			// tag attributes
			var attrs = [];
			attrs['id'] = $(lis[y]).attr('data-id');
			attrs['class'] = $(lis[y]).attr('data-cssclass');
		
			// create li
			html += utilities.element('li', attrs, $(lis[y]).html());
			
	  	}
	  	
		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		
		// return element
		return utilities.element('ol', attrs, html);
		
	}
	
};

respond.element.ol.init();

// table element
respond.element.table = {

	// adds a row
	addRowBelow:function(el){
	
		var node = $(respond.editor.currNode);
		var form = $('.config[data-action="respond.element.table"]');
		var table = node.find('table');
		var columns = $(form).find('input[name=columns]').val();
		el = $(el);
		
		// add row
		var html = '<tr>';

		for(var x=0; x<columns; x++){
			html += '<td contentEditable="true"></td>';
		}

		html += '</tr>';
		
		// for headers (TH) prepend the row to the tbody
		if($(this).get(0).nodeName == 'TH'){
		
			table.find('tbody').prepend(html);
			table.find('tbody').find('[contentEditable=true]').get(0).focus();
		}
		else{ // for non-headers, insert the row after the current row
			var tr = el.parents('tr')[0];
			
			$(tr).after(html);
	
			$(tr).next().find('[contentEditable=true]').get(0).focus();
			
		}
		
		var scope = angular.element($("section.main")).scope();
		
		scope.$apply(function(){
			scope.node.rows = scope.node.rows + 1;
		});
		
		
		
		return true;
		
	},

	// initialize table
	init:function(){
	
		// keydown event
		$(document).on('keydown', '.table [contentEditable=true]', function(event){
		
			var node = $(respond.editor.currNode);
			var form = $('.config[data-action="respond.element.table"]');
			var el = $(this);
			var table = node.find('table');
			
			// ENTER KEY
			if(event.keyCode == '13'){
			
				respond.element.table.addRowBelow(el);
				
				event.preventDefault();
				return false;
				
			}
			// DELETE KEY
			else if(event.keyCode == '8'){
			
				var h = $(this).html().trim();
				h = utilities.replaceAll(h, '<br>', '');
				
				if(h==''){
			
					var previous = $(this.parentNode.previousSibling);
				
					$(this.parentNode).remove();
					
					if(previous){
						$(previous).find('td')[0].focus();
					}
					
					return false;					
					
				}	
			}

		});
		
		// handle add above
		$(document).on('click', '.config[data-action="respond.element.table"] .add-below', function(){
			var el = $('.current-element');
			
			respond.element.table.addRowBelow(el);
		});
		
		// handle remove
		$(document).on('click', '.config[data-action="respond.element.table"] .remove', function(){
			var node = $(respond.editor.currNode);
			
			if(node){
				node.remove();
				respond.editor.currNode = null;
				
				// hide config
				$('.context-menu').find('.config').removeClass('active');
			}
			
		});
		
		// handle column change
		$(document).on('change', '.config[data-action="respond.element.table"] [name="columns"]', function(){
			var node = $(respond.editor.currNode);
			var form = $('.config[data-action="respond.element.table"]');
			
			var columns = $(form).find('input[name=columns]').val();
			var curr_columns = $(node).find('thead th').length;
			
			// update columns
            if(columns > curr_columns){ // add columns
	            
	            var toBeAdded = columns - curr_columns;
	            
	            var table = $(node).find('table');
				var trs = table.find('tr');
		
				// walk through table
				for(var x=0; x<trs.length; x++){
					
					// add columns
					for(var y=0; y<toBeAdded; y++){
						if(trs[x].parentNode.nodeName=='THEAD'){
							$(trs[x]).append('<th contentEditable="true"></th>');
						}
						else{
							$(trs[x]).append('<td contentEditable="true"></td>');
						}
					}
				}
		
				var n_cols = columns;
				
				table.removeClass('col-'+curr_columns);
				table.addClass('col-'+(n_cols));
				table.attr('data-columns', (n_cols));
	            
            }
            else if(columns < curr_columns){ // remove columns
            
            	var toBeRemoved = curr_columns - columns;
	            
	            var table = $(node).find('table');
				var trs = table.find('tr');
		
				// walk through table
				for(var x=0; x<trs.length; x++){
					
					// add columns
					for(y=0; y<toBeRemoved; y++){
						if(trs[x].parentNode.nodeName=='THEAD'){
							$(trs[x]).find('th:last-child').remove();
						}
						else{
							$(trs[x]).find('td:last-child').remove();
						}
					}
				}
		
				var n_cols = columns;
				
				table.removeClass('col-'+curr_columns);
				table.addClass('col-'+(n_cols));
				table.attr('data-columns', (n_cols));
            
            }

		});
		
		// handle row change
		$(document).on('change', '.config[data-action="respond.element.table"] [name="rows"]', function(){
		
			var node = $(respond.editor.currNode);
			var form = $('.config[data-action="respond.element.table"]');
			
            var rows = $(form).find('input[name=rows]').val();
			var curr_rows = $(node).find('tbody tr').length;
			var columns = $(node).find('thead th').length;
			
			// handle rows
            if(rows > curr_rows){ // add rows
	            
	            var toBeAdded = rows - curr_rows;
	            
	            var table = $(node).find('table');
				
				// add rows
				for(y=0; y<toBeAdded; y++){
					var html = '<tr>';

					for(x=0; x<columns; x++){
						html += '<td contentEditable="true"></td>';
					}
			
					html += '</tr>';
			
					$(table).find('tbody').append(html);
				}
	            
            }
            else if(rows < curr_rows){ // remove columns
            
            	var toBeRemoved = curr_rows - rows;
	            
	            var table = $(node).find('table');
	            
				// remove rows
				for(y=0; y<toBeRemoved; y++){
					table.find('tbody tr:last-child').remove();
				}

            }


		});
		
	},

	// creates table
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('table', 'table');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<table class="table table-striped table-bordered col-2">'+
					'<thead><tr>'+
					'<th contentEditable="true"></th>'+
					'<th contentEditable="true"></th>'+
					'</tr></thead>'+
					'<tbody><tr>'+
					'<td contentEditable="true"></td>'+
					'<td contentEditable="true"></td>'+
					'</tr></tbody>'+
					'</table>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-table';
		attrs['data-cssclass'] = '';
		attrs['data-columns'] = '2';
		attrs['data-rows'] = '1';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		// setup paste filter
		$('#'+id+' [contentEditable=true]').paste();
		
		return true;
		
	},
	
	// parse table
	parse:function(node){
	
		// build html
		var html = respond.editor.defaults.elementMenu;
		
		// get columns and rows			
		var columns = $(node).find('thead th').length;
	
       	var rows = '';

       	var tr = $(node).find('thead tr');
    
       	rows += '<thead>';

	   	// create cells
	   	var cells = '';
       	var ths = $(tr).find('th');

		for(var d=0; d<ths.length; d++){
			
			var attrs = [];
			attrs['data-id'] = $(ths[d]).attr('id');
			attrs['data-cssclass'] = $(ths[d]).attr('class');
			attrs['contentEditable'] = 'true';
			
			// return element
			cells += utilities.element('th', attrs, $(ths[d]).html());
		}
		
		// create row
		var attrs = [];
		attrs['data-id'] = $(tr).attr('id');
		attrs['data-cssclass'] = $(tr).attr('class');

		rows += utilities.element('tr', attrs, cells);

       	rows += '</thead>';
       	
        var trs = $(node).find('tbody tr');

        rows += '<tbody>';

        for(var t=0; t<trs.length; t++){
        
        	// create cells
			var tds = $(trs[t]).find('td');
			
			var cells = '';

			for(var d=0; d<tds.length; d++){
				
				var attrs = [];
				attrs['data-id'] = $(tds[d]).attr('id');
				attrs['data-cssclass'] = $(tds[d]).attr('class');
				attrs['contentEditable'] = 'true';
				
				// return element
				cells += utilities.element('td', attrs, $(tds[d]).html());
			}

			// create row
			var attrs = [];
			attrs['data-id'] = $(trs[t]).attr('id');
			attrs['data-cssclass'] = $(trs[t]).attr('class');
			
			rows += utilities.element('tr', attrs, cells);
		}

		rows += '</tbody>';
		
        html += '<table class="table table-striped table-bordered col-'+columns+'">' + rows + '</table>';
        
		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('id');
		attrs['data-id'] = $(node).attr('id');
		attrs['class'] = 'respond-table';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-columns'] = columns;
		attrs['data-rows'] =  $(node).find('tbody tr').length;
		
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate table
	generate:function(node){
	
		// get params
		var id = $(node).attr('data-id');
  		var cssClass = $(node).attr('data-cssclass');
  
  		// html for tag
  		var table = $(node).find('table');
 		var cols = $(table).attr('data-columns');

 		// get thead and tbody
		html = '<thead>';

		var tr = $(table).find('thead tr');		

		// get cells
		var cells = '';
		var ths = $(tr).find('th');
		
		for(var d=0; d<ths.length; d++){
	
			// tag attributes
			var attrs = [];
			attrs['id'] = $(ths[d]).attr('data-id');
			attrs['class'] = $(ths[d]).attr('data-cssclass');
		
			// create th
			html += utilities.element('th', attrs, $(ths[d]).html(), true);
			
		}
		
		// generate row
		var attrs = [];
		attrs['data-id'] = $(tr).attr('id');
		attrs['data-cssclass'] = $(tr).attr('class');

		html += utilities.element('tr', attrs, cells);
				

		html+='</thead>';
		html+='<tbody>';

		var trs = $(table).find('tbody tr');
		
		for(var t=0; t<trs.length; t++){
		
			// generate cells
			var cells = '';
			var tds = $(trs[t]).find('td');

			for(var d=0; d<tds.length; d++){
				
				// tag attributes
				var attrs = [];
				attrs['id'] = $(tds[d]).attr('data-id');
				attrs['class'] = $(tds[d]).attr('data-cssclass');
			
				// create td
				cells += utilities.element('td', attrs, $(tds[d]).html(), true);
		
			}
			
			// create row
			var attrs = [];
			attrs['id'] = $(trs[t]).attr('data-id');
			attrs['class'] = $(trs[t]).attr('data-cssclass');

			html += utilities.element('tr', attrs, cells);
			
		}

		html += '</tbody>';
  		
  		
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['class'] = $(table).attr('class');
		attrs['data-columns'] = cols;
		
		// return element
		return utilities.element('table', attrs, html);
		
	}
	
};

respond.element.table.init();

// hr element
respond.element.hr = {

	// creates hr
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('hr', 'hr');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="line"></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-hr';
		attrs['data-cssclass'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		return true;
		
	},
	
	// parse hr
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="line"></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-hr';
		attrs['data-cssclass'] = $(node).attr('class');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate hr
	generate:function(node){
	
		// get params
		var id = $(node).attr('data-id');
  
  		// html for tag
  		var html = '';
  		
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['class'] = $(node).attr('data-cssclass');
		
		// return element
		return utilities.element('hr', attrs, html);
		
	}
	
};


// image element
respond.element.image = {

	// init image
	init:function(){
		
		// handle row change
		$(document).on('change', '.config[data-action="respond.element.image"] [name="display"]', function(){
		
			var node = $(respond.editor.currNode);
		
			var display = $(this).val();
			var src = $(node).find('img').attr('src');
			var alt = $(node).attr('data-alt');
			var html = $(node).find('[contentEditable=true]').html() || '';
			
			// update html
			$(node).html(respond.element.image.html(display, src, html, alt));
			
		});
		
		$(document).on('click', '.respond-image img', function(){
			
			// tell the dialog which plugin is calling it
			$('#imagesDialog').attr('data-plugin', 'respond.element.image');
			$('#imagesDialog').attr('data-action', 'edit');
			
			// show dialog
			$('#imagesDialog').modal('show');
			
			// reset modal
			$('#imagesDialog .add-existing-image').removeClass('hidden');
			$('#imagesDialog .upload-new-image').addClass('hidden');
			$('#imagesDialog .add-external-image').addClass('hidden');
			$('#external-image').val('');
			$('#load-image').text(i18n.t('Existing Image'));
			$('#images-dropdown').find('li').removeClass('active');
			
			// get scope from page
			var scope = angular.element($("section.main")).scope();
			
			scope.retrieveImages();
			scope.updateFiles();
			
		});
		
	},
	
	// helper method to get HTML for the image based on alignment
	html:function(display, src, html, isExternal, alt){
		
		// set local vs external image
		var location = 'local';
		var alt_src = ' alt="' + alt + '"';
		
		if(isExternal == true){
			location = 'external';
		}
		
		var content = respond.editor.defaults.elementMenu +
					'<img src="' + src + '" data-location="' + location + '" ' + alt_src + ' >' +
					'<div class="editable-content" contentEditable="true">' + html + '</div>';
		
		// build html
		if(display=='standalone'){
			content = respond.editor.defaults.elementMenu +
					'<img src="' + src + '" data-location="' + location + '" ' + alt_src + ' >';
		}
		else if(display=='right'){
			content = respond.editor.defaults.elementMenu +
					'<div class="editable-content" contentEditable="true">' + html + '</div>' +
					'<img src="' + src + '" data-location="' + location + '" ' + alt_src + ' >';
		}
		
		return content;
		
	},
	
	// edits an image
	editImage:function(image){
		
		var node = $(respond.editor.currNode);
		
		// set local vs external image
		var location = 'local';
		
		if(image.isExternal == true){
			location = 'external';
		}
		
		$(node).find('img').attr('src', image.fullUrl);
		$(node).find('img').attr('data-location', location);
		$(node).find('img').attr('alt', '');
		
		// hide dialog
		$('#imagesDialog').modal('hide');
		
		return true;
	
	},
	
	// adds an image
	addImage:function(image){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('image', 'image');
		
		// set local vs external image
		var location = 'local';
		
		if(image.isExternal == true){
			location = 'external';
		}
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<img src="' + image.fullUrl + '" data-location="' + location +'" alt="">' +
					'<div class="editable-content" contentEditable="true"></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-image';
		attrs['data-cssclass'] = 'respond-image';
		attrs['data-alt'] = '';
		attrs['data-display'] = 'left';
		attrs['data-link'] = '';
		attrs['data-title'] = '';
		attrs['data-target'] = '';
		attrs['data-lightbox'] = 'false';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		// setup paste filter
		$('#'+id+' [contentEditable=true]').paste();
		
		// hide dialog
		$('#imagesDialog').modal('hide');
		
		return true;
	
	},

	// create image
	create:function(){
		
		// tell the dialog which plugin is calling it
		$('#imagesDialog').attr('data-plugin', 'respond.element.image');
		$('#imagesDialog').attr('data-action', 'add');
		
		// show dialog
		$('#imagesDialog').modal('show');
		
		// reset modal
		$('#imagesDialog .add-existing-image').removeClass('hidden');
		$('#imagesDialog .upload-new-image').addClass('hidden');
		$('#imagesDialog .add-external-image').addClass('hidden');
		$('#external-image').val('');
		$('#load-image').text(i18n.t('Existing Image'));
		$('#images-dropdown').find('li').removeClass('active');
		
		// get scope from page
		var scope = angular.element($("section.main")).scope();
		
		scope.retrieveImages();
		scope.updateFiles();
				
	},
	
	// parse image
	parse:function(node){
		
		console.log('respond-image');
		console.log(node);
	
		// get scope from page
		var scope = angular.element($("section.main")).scope();
		
		scope.retrieveImages();
		scope.updateFiles();
	
		// get params
		var isExternal = false;
		var id = $(node).attr('id');
		
		// get src
		var src = $(node).find('img').attr('src');
		
		// compatibility for ng-src (deprecated)
		if($(node).find('img').attr('ng-src') != '' && $(node).find('img').attr('ng-src') != undefined){
			src =  $(node).find('img').attr('ng-src');
		}
		
		var location = $(node).find('img').attr('data-location') || '';
		var alt = $(node).find('img').attr('alt') || '';
		var link = $(node).find('a').attr('href') || $(node).find('a').attr('ui-sref') || '';
		var title = $(node).find('a').attr('title') || '';
		var target = $(node).find('a').attr('target') || '';
		var lightbox = '0';
		
		// get external image
		if(location == 'external'){
			isExternal = true;
		}
		
		// set lightbox
		var attr = $(node).find('a').attr('respond-lightbox');
			
		if (typeof attr !== typeof undefined && attr !== false) {	
			lightbox = '1';
		}
		
		// get scope from page
		var scope = angular.element($("section.main")).scope();
		
		// get domain from scope
		var url = scope.site.ImagesUrl;
		
		// replace the images URL with the URL from the site
		src = utilities.replaceAll(src, '{{site.ImagesUrl}}', url);
		
		// get display class
		var display = $(node).attr('data-display') || 'left';
		
		// set html
		var html = respond.element.image.html(display, src, $(node).find('p').html(), isExternal, alt);
		
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-image';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-alt'] = alt;
		attrs['data-display'] = display;
		attrs['data-link'] = link;
		attrs['data-title'] = title;
		attrs['data-target'] = target;
		attrs['data-lightbox'] = lightbox;
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate image
	generate:function(node){
	
		// get params
		var id = $(node).attr('data-id');
  		var display = $(node).attr('data-display');
  		var cssClass = $(node).attr('data-cssclass');
  		var alt = $(node).attr('data-alt') || '';
  		var link = $(node).attr('data-link') || '';
  		var title = $(node).attr('data-title') || '';
  		var target = $(node).attr('data-target') || '';
  		var lightbox = $(node).attr('data-lightbox') || '';
  		var isLightbox = false;
  		
  		// set lightbox
  		if(lightbox == '1'){
	  		isLightbox = true;
  		}
  		
  		// build html
  		var html = '';
  		var startLink = '';
  		var endLink = '';
  		
  		if(link != ''){
	  		// external links should have http
			if(link.indexOf('http') == -1){
				startLink = '<a href="'+link+'" ui-sref="'+link+'"';
			}
			else{
				startLink = '<a href="'+link+'"';
			}
			
			// add title
			if(title != ''){
				startLink += ' title="' + title + '"';
			}
			
			// add target
			if(target != ''){
				startLink += ' target="' + target + '"';
			}
			
			// add lightbox
			if(isLightbox == true){
				startLink += ' respond-lightbox';
			}
			
			// close start of <a>
			startLink += '>';
			
			// close <a>
			endLink = '</a>';
  		}
  		
  		// set image src
  		var src = $(node).find('img').attr('src');
  		var location = $(node).find('img').attr('data-location');
  		
  		// handle older images
  		if(location == undefined || location == null){
	  		location = 'local';
  		}
  		
  		//set img
  		var img = '';
  		
  		if(location == 'local'){
	  		
	  		// removes the domain from the img
	  		if(src != ''){
		  		var parts = src.split('files/');
		  		src = 'files/' + parts[1];
	  		}
	  		
	  		// set image tag
	  		img = '<img src="{{site.ImagesUrl}}' + src + '" alt="' + alt + '" data-location="local">';
	  		
	  	}
	  	else{
		  	// set image tag
	  		img = '<img src="' + src + '" alt="' + alt + '" data-location="external">'; 	
	  	}
  		
  		var html = startLink + img + endLink;
  
  		// html for tag
  		if(display == 'left'){
	  		
	  		html = startLink + img + endLink + 
	  					'<p>' + $(node).find('[contentEditable=true]').html() + '</p>';
	  		
  		}
  		else if(display == 'right'){
	  		html =  '<p>' + $(node).find('[contentEditable=true]').html() + '</p>' +
	  					startLink + img + endLink;
  		}
  		
		// tag attributes
		var attrs = [];
		
		attrs['id'] = id;
		attrs['class'] = cssClass;
		attrs['data-display'] = display;
		
		// return element
		return utilities.element('div', attrs, html, true);
		
	}
	
};

respond.element.image.init();

// pre component
respond.element.pre = {

	init:function(){
		
		$(document).off('click', '.respond-pre div');
		
		// handle html div click
		$(document).on('click', '.respond-pre div', function(){
			$(this).parent().toggleClass('active');	
		});
		
	},

	// creates pre
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('pre', 'pre');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-terminal"></i> '+
					'<span node-text="description">PRE</span>' +
					'<i class="fa fa-angle-down"></i></div>' +
					'<textarea></textarea>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-pre';
		attrs['data-cssclass'] = '';
		attrs['data-description'] = 'PRE';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse code
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		var description = $(node).attr('description');
		var code = $(node).html();
		
		code = utilities.replaceAll(code, '&lt;', '<');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-terminal"></i> '+
					'<span node-text="description">' + description + '</span>' +
					'<i class="fa fa-angle-down"></i></div>' +
					'<textarea>' + code + '</textarea>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-pre';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-description'] = description;
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate code
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['description'] = $(node).attr('data-description');
		attrs['respond-pre'] = 'true';
		
		var code = $(node).find('textarea').val();
		code = utilities.replaceAll(code, '<', '&lt;');
		
		// return element
		return utilities.element('PRE', attrs, code);
		
	}
	
};

respond.element.pre.init();
