// create namespace
var respond = respond || {};
respond.component = respond.component || {};

// slideshow component
respond.component.slideshow = {

	// init slideshow
	init:function(){
		
		$(document).on('click', '.add-slideshow-image', function(){
		
			// get scope from page
			var scope = angular.element($("section.main")).scope();
			
			scope.retrieveImages();
		
			$('#imagesDialog').attr('data-plugin', 'respond.component.slideshow');
			$('#imagesDialog').attr('data-action', 'add');
			$('#imagesDialog').modal('show');
			
			// reset modal
			$('#imagesDialog .add-existing-image').removeClass('hidden');
			$('#imagesDialog .upload-new-image').addClass('hidden');
			$('#imagesDialog .add-external-image').addClass('hidden');
			$('#external-image').val('');
			$('#load-image').text(i18n.t('Existing Image'));
			$('#images-dropdown').find('li').removeClass('active');
		});
		
		// caption focus (for images)
		$(document).on('focus', '.caption input', function(){
			$(this.parentNode.parentNode).addClass('edit');
		});
	
		// caption blur (for images)
		$(document).on('blur', '.caption input', function(){
			var caption = $(this).val();
			$(this.parentNode.parentNode).find('img').attr('title', caption);
			$(this.parentNode.parentNode).removeClass('edit');
		});
		
		// remove-image click
		$(document).on('click', '.remove-image', function(){
			$(this.parentNode).remove();
			context.find('a.'+this.parentNode.className).show();
			return false;
		}); 
	
		// make parsed elements sortable
		$(document).on('respond.editor.contentLoaded', function(){	
			// make the elements sortable
			$('.respond-slideshow div').sortable({handle:'img', items:'span.image', placeholder: 'editor-highlight', opacity:'0.6', axis:'x'});
			
		});
		
	},
	
	// adds an image to the slideshow
	addImage:function(image){
		
		// set local vs external image
		var location = 'local';
		
		if(image.isExternal == true){
			location = 'external';
		}
	
		// get current node
		var node = $(respond.editor.currNode);
		
		// build html
		var html = '<span class="image"><img class="respond-element" src="' + image.fullUrl + '" title="" data-location="' + location + '"></span>';
				   
		$(node).find('.images').append(html);
		
		$('#imagesDialog').modal('hide');
		
		return true;
	
	},

	// creates slideshow
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('slideshow', 'slideshow');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="images">' +
					'<button type="button" class="add-slideshow-image"><i class="fa fa-picture-o"></i></button>' +
					'</div>';		
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-slideshow';
		attrs['data-cssclass'] = '';
		attrs['data-indicators'] = 'true';
		attrs['data-arrows'] = 'true';
		attrs['data-interval'] = '5000';
		attrs['data-wrap'] = 'true';
		attrs['data-pauseonhover'] = 'true';
		attrs['data-transition'] = 'slide';
		attrs['data-position'] = 'default';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		// make the elements sortable
		$('.respond-slideshow div').sortable({handle:'img', items:'span.image', placeholder: 'editor-highlight', opacity:'0.6', axis:'x'});
		
		return true;
		
	},
	
	// parse slideshow
	parse:function(node){
	
		// get params
		var id = $(node).attr('slideshowid');
		
		// get old formid
		if(id == undefined){
			id = $(node).attr('id');
		}
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="images">' +
					'<button type="button" class="add-slideshow-image"><i class="fa fa-picture-o"></i></button>';
		
		// get images			
		var imgs = $(node).find('img');	
				
		for(var y=0; y<imgs.length; y++){
		
			// get caption
			var title = $(imgs[y]).attr('title');
			var src = $(imgs[y]).attr('src');
			var location = $(imgs[y]).attr('data-location');
			var headline = $(imgs[y]).attr('data-headline') || '';
			var caption = $(imgs[y]).attr('data-caption') || '';
			var button = $(imgs[y]).attr('data-button') || '';
			var link = $(imgs[y]).attr('data-link') || '';
			var cssclass = $(imgs[y]).attr('class') || '';
	
			// get scope from page
			var scope = angular.element($("section.main")).scope();
			
			// get domain from scope
			var url = scope.site.ImagesUrl;
			
			// replace the images URL with the URL from the site
			src = utilities.replaceAll(src, '{{site.ImagesUrl}}', url);
			
			var image = '<img class="respond-element" src="' + src + '" title="' + title + '" ' + 
				'data-headline="' + headline + '" ' +
				'data-caption="' + caption + '" ' +
				'data-button="' + button + '" ' +
				'data-link="' + link + '" ' +
				'data-cssclass="' + cssclass + '" ' +
				'data-location="' + location + '">';
			
			// build html
			html +=	'<span class="image">' + image + '</span>';
		
		}			

		// add button				  	
		html += '</div>';				
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-slideshow';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-indicators'] = $(node).attr('indicators');
		attrs['data-arrows'] = $(node).attr('arrows');
		attrs['data-interval'] = $(node).attr('interval');
		attrs['data-wrap'] = $(node).attr('wrap');
		attrs['data-pauseonhover'] = $(node).attr('pauseonhover');
		attrs['data-transition'] = $(node).attr('transition');
		attrs['data-position'] = $(node).attr('position') || 'default';
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate slideshow
	generate:function(node){

  		// html for tag
  		var html = '';
  		
  		// get images
  		var imgs = $(node).find('img');
  		
  		for(var y=0; y<imgs.length; y++){
  		
  			var title = $(imgs[y]).attr('title');
  			var src = $(imgs[y]).attr('src');
  			
  			var location = $(imgs[y]).attr('data-location');
  			
  			if(location == undefined || location == null){
	  			location = 'local';
  			}
  			
  			var headline = $(imgs[y]).attr('data-headline') || '';
  			var caption = $(imgs[y]).attr('data-caption')|| '';
  			var button = $(imgs[y]).attr('data-button')|| '';
  			var link = $(imgs[y]).attr('data-link')|| '';
  			var cssclass = $(imgs[y]).attr('data-cssclass')|| '';
  		
  			if(location == 'local'){
	  			// removes the domain from the img
		  		if(src != ''){
			  		var parts = src.split('files/');
			  		src = 'files/' + parts[1];
		  		}
	  			
	  			var image = '<img src="{{site.ImagesUrl}}' + src + '" title="' + title + '" ' +
	  							'class="' + cssclass + '" ' + 
	  							'data-headline="' + headline + '" ' +
								'data-caption="' + caption + '" ' +
								'data-button="' + button + '" ' +
								'data-link="' + link + '" ' +
	  							'data-location="local">';
  			}
  			else{
	  			var image = '<img src="' + src + '" title="' + title + '" ' + 
	  							'class="' + cssclass + '" ' +
	  							'data-headline="' + headline + '" ' +
								'data-caption="' + caption + '" ' +
								'data-button="' + button + '" ' +
								'data-link="' + link + '" ' +
	  							'" data-location="external">';
  			}
  			
			html += '<div>' + image + '</div>';
		}
  		
		// tag attributes
		var attrs = [];
		attrs['slideshowid'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['indicators'] = $(node).attr('data-indicators');
		attrs['arrows'] = $(node).attr('data-arrows');
		attrs['interval'] = $(node).attr('data-interval');
		attrs['wrap'] = $(node).attr('data-wrap');
		attrs['pauseonhover'] = $(node).attr('data-pauseonhover');
		attrs['transition'] = $(node).attr('data-transition');
		attrs['position'] = $(node).attr('data-position') || 'default';
		
		// return element
		return utilities.element('respond-slideshow', attrs, html);
		
	},
	
	// config slideshow
	config:function(node, form){}
	
};

respond.component.slideshow.init();

// map component
respond.component.map = {

	// creates map
	create:function(){
	
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<i class="in-textbox fa fa-map-marker"></i>' +
					'<input type="text" value="" spellcheck="false" maxlength="512" placeholder="">';
					
		// tag attributes
		var attrs = [];
		attrs['class'] = 'respond-map';
		attrs['data-cssclass'] = '';
		attrs['data-zoom'] = 'auto';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse map
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		var address = $(node).attr('address');
		var zoom = $(node).attr('zoom');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<i class="in-textbox fa fa-map-marker"></i>' +
					'<input type="text" value="' + address + '" spellcheck="false" maxlength="512" placeholder="' + i18n.t('1234 Main Street, Some City, LA 90210') + '">';
					
		// tag attributes
		var attrs = [];
		attrs['class'] = 'respond-map';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-zoom'] = $(node).attr('zoom');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate map
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['address'] = $(node).find('input').val();
		attrs['zoom'] = $(node).attr('data-zoom');
		
		// return element
		return utilities.element('respond-map', attrs, '');
		
	},
	
	// config map
	config:function(node, form){}
	
};

// form component
respond.component.form = {

	// inits the form
	init:function(){
	
		// adds a field
		$(document).on('click', '.add-field', function(){
			
			var node = $(respond.editor.currNode);
			
			// add temp field
			node.find('.field-list').append(
				respond.component.form.buildMock('text', 'Field', 'field-1', 'false', '', '', '', '')
			);
			
		});
		
		
		// make parsed elements sortable
		$(document).on('respond.editor.contentLoaded', function(){	
			// make the elements sortable
			$('.respond-form>div').sortable({handle: '.mock-field', placeholder: 'editor-highlight', opacity:'0.6', axis:'y'});
			
		});
		
		// get a reference to the form
		$(document).on('keyup', '.config[data-action="respond.component.form"] [name="field-label"]', function(){
			var $el = $(this);
		
			var id = utilities.toTitleCase($el.val());
		
			// get fields scope
			var fscope = angular.element($el).scope();
			
			// set id in scope
			fscope.element.id = id;
		});
		
	},
	
	// builds a mock
	buildMock:function(type, label, id, required, helper, placeholder, cssClass, options){
	
		// create field
  		var field = '<label for="field" element-text="label">' + label + '</label>' +
				'<div class="mock-field">' +
				'<span class="placeholder" element-text="placeholder">' + placeholder + '</span>' +
				'<span class="field-type" element-text="type">' + type + '</span></div>' +
				'<span class="helper-text" element-text="helper">' + helper + '</label>';
		
		// tag attributes
		var attrs = [];
		attrs['class'] = 'respond-field respond-element';
		attrs['data-type'] = type;
		attrs['data-label'] = label;
		attrs['data-required'] = required;
		attrs['data-helper'] = helper;
		attrs['data-placeholder'] = placeholder;
		attrs['data-id'] = id;
		attrs['data-cssclass'] = cssClass;
		attrs['data-options'] = options;
		
		// return element
		return utilities.element('div', attrs, field);
		
	},
	

	// builds a field
	buildField:function(type, label, id, required, helper, placeholder, cssClass, options){

		// tag attributes
		var attrs = [];
		attrs['fieldid'] = id;
		attrs['type'] = type;
		attrs['label'] = label;
		attrs['required'] = required;
		attrs['helper'] = helper;
		attrs['placeholder'] = placeholder;
		attrs['cssclass'] = cssClass;
		attrs['options'] = options;
		
		// return element
		return utilities.element('respond-form-field', attrs, '');
		
	},

	// creates form
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('form', 'form');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="field-list">' +
					respond.component.form.buildMock('text', 'Field', 'field1', 'false', '', '', 'form-control', '') +
					'</div>';
					
		html += '<button type="button" class="add-field"><i class="fa fa-plus-circle"></i></button>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-form';
		attrs['data-cssclass'] = '';
		attrs['data-action'] = '';
		attrs['data-field-count'] = '1';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		$('.respond-form>div').sortable({handle: '.mock-field', placeholder: 'editor-highlight', opacity:'0.6', axis:'y'});
	
		return true;
		
	},
	
	// parse form
	parse:function(node){
	
		// get params
		var id = $(node).attr('formid');
		
		// get old formid
		if(id == undefined){
			id = $(node).attr('id');
		}
		
		// build html
		var html = respond.editor.defaults.elementMenu + '<div class="field-list">';
		
		// support for legacy fields
		var fields = $(node).find('div');
		
		for(y=0; y<fields.length; y++){
		
			// get type
			var type = $(fields[y]).attr('data-type');
			
			if(type != null){
				
				// get attributes
				var fieldLabel = $(fields[y]).attr('data-label') || '';
				var fieldRequired = $(fields[y]).attr('data-required') || '';
				var fieldHelper = $(fields[y]).attr('data-helper') || '';
				var fieldPlaceholder = $(fields[y]).attr('data-placeholder') || '';
				var fieldId = $(fields[y]).attr('data-id') || '';
				var fieldCssClass = $(fields[y]).attr('data-cssclass') || '';
				var fieldOptions = $(fields[y]).attr('data-options') || '';
				
				// build mock element
				html += respond.component.form.buildMock(type, fieldLabel, fieldId, fieldRequired, fieldHelper, fieldPlaceholder, fieldCssClass, fieldOptions)
	
			}
			  	
		}
		
		// support respond-form-field
		var fields = $(node).find('respond-form-field');
		
		for(y=0; y<fields.length; y++){
		
			// get type
			var type = $(fields[y]).attr('type');
			
			if(type != null){
				
				var required = $(fields[y]).get(0).getAttribute('required');
				
				if(required == 'required'){
					required = 'false';
				}
				
				// get params
				var fieldId = $(fields[y]).attr('fieldid');
				
				// get old fieldid
				if(fieldId == undefined){
					fieldId = $(fields[y]).attr('id') || '';
				}
				
				// get attributes
				var fieldLabel = $(fields[y]).attr('label') || '';
				var fieldRequired = required;
				var fieldHelper = $(fields[y]).attr('helper') || '';
				var fieldPlaceholder = $(fields[y]).attr('placeholder') || '';
				var fieldCssClass = $(fields[y]).attr('cssclass') || '';
				var fieldOptions = $(fields[y]).attr('options') || '';
				
				// build mock element
				html += respond.component.form.buildMock(type, fieldLabel, fieldId, fieldRequired, fieldHelper, fieldPlaceholder, fieldCssClass, fieldOptions)
	
			}
			  	
		}
		
		
		html += '</div>';
		
		html += '<button type="button" class="add-field"><i class="fa fa-plus-circle"></i></button>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-form';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-action'] = $(node).attr('action');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate form
	generate:function(node){
	
		var fields = $(node).find('.field-list>div');
		var html = '';
		    
  		for(var y=0; y<fields.length; y++){
  			field = $(fields[y]);
  			
  			// build field
  			html += respond.component.form.buildField(
  				field.attr('data-type') || '', 
  				field.attr('data-label') || '', 
  				field.attr('data-id') || '', 
  				field.attr('data-required') || '', 
  				field.attr('data-helper') || '', 
  				field.attr('data-placeholder') || '', 
  				field.attr('data-cssclass') || '', 
  				field.attr('data-options') || '');  			
  		}
  		
  		html += '';
  		
		// tag attributes
		var attrs = [];
		attrs['formid'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['type'] = $(node).attr('data-type');
		attrs['action'] = $(node).attr('data-action');
		
		// return element
		return utilities.element('respond-form', attrs, html);
		
	},
	
	// config form
	config:function(node, form){}
	
};

respond.component.form.init();

// content component
respond.component.content = {

	// creates content
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('content', 'content');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-cube"></i> <span node-text="url">Not Selected</span></div>';		
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-content';
		attrs['data-cssclass'] = '';
		attrs['data-url'] = '';
		attrs['data-render'] = 'client';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse content
	parse:function(node){
	
		// get params
		var id = $(node).attr('contentid');
		var url = $(node).attr('url');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-cube"></i> <span node-text="url">' + url + '</span></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-content';
		attrs['data-cssclass'] = $(node).attr('cssclass');
		attrs['data-url'] = $(node).attr('url');
		attrs['data-render'] = $(node).attr('render');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate content
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['contentid'] = $(node).attr('data-id');
		attrs['cssclass'] = $(node).attr('data-cssclass');
		attrs['url'] = $(node).attr('data-url');
		attrs['render'] = $(node).attr('data-render');
		
		// return element
		return utilities.element('respond-content', attrs, '');
		
	},
	
	// config content
	config:function(node, form){
		
	}
	
};

// list component
respond.component.list = {

	// creates list
	create:function(){
	
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-cubes"></i> <span node-text="type">Not Selected</span></div>';		
					
		// tag attributes
		var attrs = [];
		attrs['class'] = 'respond-list';
		attrs['data-cssclass'] = '';
		attrs['data-type'] = '';
		attrs['data-display'] = 'list-default';
		attrs['data-pagesize'] = '10';
		attrs['data-orderby'] = 'Name';
		attrs['data-pageresults'] = 'false';
		attrs['data-tag'] = '';
		attrs['data-desclength'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse list
	parse:function(node){
		
		// get params
		var type = $(node).attr('type');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-cubes"></i> <span node-text="type">' + type + '</span></div>';
		
		// tag attributes
		var attrs = [];
		attrs['class'] = 'respond-list';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-type'] = $(node).attr('type');
		attrs['data-display'] = $(node).attr('display');
		attrs['data-pagesize'] = $(node).attr('pagesize');
		attrs['data-orderby'] =  $(node).attr('orderby');
		attrs['data-pageresults'] =  $(node).attr('pageresults');
		attrs['data-tag'] =  $(node).attr('tag');
		attrs['data-desclength'] = $(node).attr('desclength');
		
		utilities.element('div', attrs, html)
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate list
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['type'] = $(node).attr('data-type');
		attrs['display'] = $(node).attr('data-display');
		attrs['pagesize'] = $(node).attr('data-pagesize');
		attrs['orderby'] = $(node).attr('data-orderby');
		attrs['pageresults'] = $(node).attr('data-pageresults');
		attrs['tag'] = $(node).attr('data-tag');
		attrs['desclength'] = $(node).attr('data-desclength');
		
		// return element
		return utilities.element('respond-list', attrs, '');
		
	},
	
	// config list
	config:function(node, form){}
	
};

// html component
respond.component.html = {

	init:function(){
		
		$(document).off('click', '.respond-html div');
		
		// handle html div click
		$(document).on('click', '.respond-html div', function(){
			$(this).parent().toggleClass('active');	
		});
		
	},

	// creates html
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('html', 'html');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-html5"></i> '+
					'<span node-text="description">HTML</span>' +
					'<i class="fa fa-angle-down"></i></div>' +
					'<textarea></textarea>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-html';
		attrs['data-cssclass'] = '';
		attrs['data-description'] = 'HTML';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse html
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		var description = $(node).attr('description');
		var code = $(node).html();
		
		// create pretty code for display
		var pretty = utilities.replaceAll(code, '<', '&lt;');
		pretty = utilities.replaceAll(pretty, '>', '&gt;');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-html5"></i> '+
					'<span node-text="description">' + description + '</span>' +
					'<i class="fa fa-angle-down"></i></div>' +
					'<textarea>' + pretty + '</textarea>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-html';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-description'] = description;
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate html
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['description'] = $(node).attr('data-description');
		
		var html = $(node).find('textarea').val();
		
		// return element
		return utilities.element('respond-html', attrs, html);
		
	},
	
	// config html
	config:function(node, form){}
	
};

respond.component.html.init();

// login
respond.component.login = {

	// creates login
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('login', 'login');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-key"></i> <span>Login</span></div>';		
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-login';
		attrs['data-cssclass'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse login
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-key"></i> <span>Login</span></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-login';
		attrs['data-cssclass'] = $(node).attr('class');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate login
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		
		// return element
		return utilities.element('respond-login', attrs, '');
		
	},
	
	// config login
	config:function(node, form){}
	
};

// registration
respond.component.registration = {

	// creates registration
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('registration', 'registration');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-key"></i> <span>Registration</span></div>';		
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-registration';
		attrs['data-cssclass'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse registration
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		var type = $(node).attr('type');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-key"></i> <span>Registration</span></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-registration';
		attrs['data-cssclass'] = $(node).attr('class');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate registration
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		
		// return element
		return utilities.element('respond-registration', attrs, '');
		
	},
	
	// config list
	config:function(node, form){}
	
};

// shelf component
respond.component.shelf = {

	// inits the shelf
	init:function(){
	
		// adds a field
		$(document).on('click', '.add-sku', function(){
		
			var node = $(respond.editor.currNode);
			
			var uniqId = utilities.uniqid();
			
			// add temp shelf item
			node.find('.shelf-items').append(
				respond.component.shelf.buildMock(uniqId, uniqId, 'New Product', '9.99', 'not shipped', '', '')
			);
			
		});
		
		
		// make parsed elements sortable
		$(document).on('respond.editor.contentLoaded', function(){	
		
			// make the elements sortable
			$('.respond-shelf>div').sortable({placeholder: 'editor-highlight', opacity:'0.6', axis:'y'});
			
		});
		
	},
	
	// builds a mock
	buildMock:function(productId, sku, name, price, shipping, weight, download){
	
		// create field
  		var html = '<i class="fa fa-tag"></i><h4 element-text="name">' + name + '</h4>' +
  					'<small><span element-text="sku">' + sku + '</span> - <span element-text="price">' + price + '</span></small>';
		
		// tag attributes
		var attrs = [];
		attrs['class'] = 'shelf-item respond-element';
		attrs['data-productid'] = productId;
		attrs['data-sku'] = sku;
		attrs['data-name'] = name;
		attrs['data-price'] = price;
		attrs['data-shipping'] = shipping;
		attrs['data-weight'] = weight;
		attrs['data-download'] = download;
		
		// return element
		return utilities.element('div', attrs, html);
		
	},
	
	// builds a shelf item
	buildItem:function(productId, sku, name, price, shipping, weight, download){
	
		var html = '';
	
		// tag attributes
		var attrs = [];
		attrs['productid'] = productId;
		attrs['sku'] = sku;
		attrs['name'] = name;
		attrs['price'] = price;
		attrs['shipping'] = shipping;
		attrs['weight'] = weight;
		attrs['download'] = download;
		
		// return element
		return utilities.element('respond-shelf-item', attrs, html);
	},
	
	// creates shelf
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('shelf', 'shelf');
		
		// create a uniqid
		var uniqId = utilities.uniqid();
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="shelf-items">' +
					respond.component.shelf.buildMock(uniqId, uniqId, 
						'New Product', '9.99', 'not shipped', '', '') +
					'</div>';
					
		html += '<button type="button" class="add-sku"><i class="fa fa-plus-circle"></i></button>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-shelf';
		attrs['data-cssclass'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		$('.respond-shelf>div').sortable({placeholder: 'editor-highlight', opacity:'0.6', axis:'y'});
	
		return true;
		
	},
	
	// parse shelf
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		
		// build html
		var html = respond.editor.defaults.elementMenu + '<div class="shelf-items">';
		
		var items = $(node).find('respond-shelf-item');
		
		for(y=0; y<items.length; y++){
					
			// get attributes
			var productid = $(items[y]).attr('productid') || '';
			var sku = $(items[y]).attr('sku') || '';
			var name = $(items[y]).attr('name') || '';
			var price = $(items[y]).attr('price') || '';
			var shipping = $(items[y]).attr('shipping') || '';
			var weight = $(items[y]).attr('weight') || '';
			var download = $(items[y]).attr('download') || '';
			
			// build mock element
			html += respond.component.shelf.buildMock(productid, sku, name, price, shipping, weight, download);

		}
		
		html += '</div>';
		
		html += '<button type="button" class="add-sku"><i class="fa fa-plus-circle"></i></button>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-shelf';
		attrs['data-cssclass'] = $(node).attr('class');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate shelf
	generate:function(node){
	
		var items = $(node).find('.shelf-items>div');
		var html = '';
		
		// get scope from page
		var scope = angular.element($("section.main")).scope();
		
		// clear products for the page
		scope.clearProducts();
	  
  		for(var y=0; y<items.length; y++){
  			item = $(items[y]);
  			
  			// build a product
  			var product = {
  					productId: item.attr('data-productid') || '', 
					sku: item.attr('data-sku') || '', 
					name: item.attr('data-name') || '',
					price: item.attr('data-price') || '',
					shipping: item.attr('data-shipping') || '',
					weight: item.attr('data-weight') || '',
					download: item.attr('data-download') || ''};
  			
  			// build item
  			html += respond.component.shelf.buildItem(
  				product.productId, 
  				product.sku, 
  				product.name, 
  				product.price, 
  				product.shipping, 
  				product.weight,
  				product.download);
  				
  			// add products for the page
  			scope.addProduct(product);
  										
  		}
  	
		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		
		// return element
		return utilities.element('respond-shelf', attrs, html);
		
	},
	
	// config shelf
	config:function(node, shelf){}
	
};

respond.component.shelf.init();

// video component
respond.component.video = {

	init:function(){
		
		// handle html div click
		$(document).on('click', '.respond-video div', function(){
			$(this).parent().toggleClass('active');	
		});
		
	},

	// creates video
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('video', 'video');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-video-camera"></i> '+
					'<span node-text="description">Video</span>' +
					'<i class="fa fa-angle-down"></i></div>' +
					'<textarea></textarea>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-video';
		attrs['data-cssclass'] = '';
		attrs['data-description'] = 'Video';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse video
	parse:function(node){
	
		// get params
		var id = $(node).attr('videoid');
		var description = $(node).attr('description');
		var code = $(node).html();
		
		// create pretty code for display
		var pretty = utilities.replaceAll(code, '<', '&lt;');
		pretty = utilities.replaceAll(pretty, '>', '&gt;');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-video-camera"></i> '+
					'<span node-text="description">' + description + '</span>' +
					'<i class="fa fa-angle-down"></i></div>' +
					'<textarea>' + code + '</textarea>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-video';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-description'] = description;
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate video
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['videoid'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['description'] = $(node).attr('data-description');
		
		var html = $(node).find('textarea').val();
		
		// return element
		return utilities.element('respond-video', attrs, html);
		
	},
	
	// config html
	config:function(node, form){}
	
};

respond.component.video.init();

// tabset element
respond.component.tabset = {

	// initialize tabset
	init:function(){
	
		// handle column change
		$(document).on('change', '.config[data-action="respond.component.tabset"] [name="tabs"]', function(){
			
			var node = $(respond.editor.currNode);
			var form = $('.config[data-action="respond.component.tabset"]');
			
			var tabs = $(form).find('input[name=tabs]').val();
			var curr_tabs = $(node).find('.nav-tabs li').length;
			var nav = $(node).find('.nav-tabs');
			
			// update columns
            if(tabs > curr_tabs){ // add columns
	            
	            var toBeAdded = tabs - curr_tabs;
	            
	            for(x=0; x<toBeAdded; x++){
		            $(nav).append('<li class="respond-element"><a contentEditable="true">Tab</a></li>');
	            }
				
	            
            }
            else if(tabs < curr_tabs){ // remove columns
            
            	var toBeRemoved = curr_tabs - tabs;
            	
				for(var x=0; x<toBeRemoved; x++){
					$(nav).find('li').last().remove();
				}
		
            }

		});
		
	},

	// creates tabset
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('tabset', 'tabset');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<ul class="nav nav-tabs" role="tablist">' +
					  '<li class="active respond-element"><a contentEditable="true">Tab</a></li>' +
					  '<li class="respond-element"><a contentEditable="true">Tab</a></li>' +
					  '<li class="respond-element"><a contentEditable="true">Tab</a></li>' +
					'</ul>';			
					
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-tabset';
		attrs['data-cssclass'] = '';
		attrs['data-tabs'] = '3';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		// setup paste filter
		$('#'+id+' [contentEditable=true]').paste();
		
		return true;
		
	},
	
	// parse tabset
	parse:function(node){
	
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<ul class="nav nav-tabs" role="tablist">';
				
		// parse links				
		var lis = $(node).find('li');			
					
		for(y=0; y<lis.length; y++){
		
			// tag attributes
			var attrs = [];
			
			if(y == 0){
				attrs['class'] = 'active respond-element';
			}
			else{
				attrs['class'] = 'respond-element';
			}
			
			attrs['data-id'] = $(lis[y]).attr('id');
			attrs['data-target'] = $(lis[y]).attr('target');
			
			var text = $(lis[y]).find('a').text();
			var link = '<a contentEditable="true">' + text + '</a>';
			
			// return element
			html += utilities.element('li', attrs, link);
		}
		
		html += '</ul>';
		
		// get params
		var id = $(node).attr('id');
		
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-tabset';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-tabs'] = lis.length;
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate tabset
	generate:function(node){
	
  		// html for tag
  		var html = '<ul class="nav nav-tabs" role="tablist">';
  		
  		// get lis
  		var lis = $(node).find('li');
  		
  		for(var y=0; y<lis.length; y++){
  		
			// tag attributes
			var attrs = [];
			attrs['id'] = $(lis[y]).attr('data-id');
			
			if(y == 0){
				attrs['class'] = 'active';
			}
			
			var target = $(lis[y]).attr('data-target');
			
			attrs['target'] = target;
			
			var text = $(lis[y]).find('a').text();
			var link = '<a data-target="' + target + '" role="tab" data-toggle="tab" respond-showtab>' + text + '</a>';
		
			// create li
			html += utilities.element('li', attrs, link, true);
			
	  	}
	  	
	  	html += '</ul>';
	  	
		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		
		// return element
		return utilities.element('respond-tabset', attrs, html);
	}
	
};

respond.component.tabset.init();

// menu component
respond.component.menu = {

	// creates list
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('menu', 'menu');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-bars"></i> <span node-text="type">Not Selected</span></div>';		
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-menu';
		attrs['data-cssclass'] = '';
		attrs['data-type'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse menu
	parse:function(node){
		
		// get params
		var id = $(node).attr('id');
		var type = $(node).attr('type');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-bars"></i> <span node-text="type">' + type + '</span></div>';
		
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = $(node).attr('menuid');
		attrs['data-type'] = $(node).attr('type');
		attrs['class'] = 'respond-menu';
		attrs['data-cssclass'] = $(node).attr('class');
		
		utilities.element('div', attrs, html)
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate menu
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['menuid'] = $(node).attr('data-id');
		attrs['type'] = $(node).attr('data-type');
		attrs['class'] = $(node).attr('data-cssclass');	
		attrs['standalone'] = 'true';
		
		// return element
		return utilities.element('respond-menu', attrs, '');
		
	},
	
	// config list
	config:function(node, form){}
	
};

// gallery component
respond.component.gallery = {

	// init gallery
	init:function(){
		
		$(document).on('click', '.add-gallery-image', function(){
		
			// get scope from page
			var scope = angular.element($("section.main")).scope();
			
			scope.retrieveImages();
		
			$('#imagesDialog').attr('data-plugin', 'respond.component.gallery');
			$('#imagesDialog').attr('data-action', 'add');
			$('#imagesDialog').modal('show');
			
			// reset modal
			$('#imagesDialog .add-existing-image').removeClass('hidden');
			$('#imagesDialog .upload-new-image').addClass('hidden');
			$('#imagesDialog .add-external-image').addClass('hidden');
			$('#external-image').val('');
			$('#load-image').text(i18n.t('Existing Image'));
			$('#images-dropdown').find('li').removeClass('active');
		});
		
		// caption focus (for images)
		$(document).on('focus', '.caption input', function(){
			$(this.parentNode.parentNode).addClass('edit');
		});
	
		// caption blur (for images)
		$(document).on('blur', '.caption input', function(){
			var caption = $(this).val();
			$(this.parentNode.parentNode).find('img').attr('title', caption);
			$(this.parentNode.parentNode).removeClass('edit');
		});
		
		// remove-image click
		$(document).on('click', '.remove-image', function(){
			$(this.parentNode).remove();
			context.find('a.'+this.parentNode.className).show();
			return false;
		}); 
	
		// make parsed elements sortable
		$(document).on('respond.editor.contentLoaded', function(){	
			// make the elements sortable
			$('.respond-gallery div').sortable({handle:'img', items:'span.image', placeholder: 'editor-highlight', opacity:'0.6', axis:'x'});
			
		});
		
	},
	
	// adds an image to the gallery
	addImage:function(image){
		
		// set local vs external image
		var location = 'local';
		
		if(image.isExternal == true){
			location = 'external';
		}
	
		// get current node
		var node = $(respond.editor.currNode);
		
		// build html
		var html = '<span class="image"><img class="respond-element" src="' + image.fullUrl + '" title="" data-location="' + location + '" data-thumb="' + image.thumbUrl + '"></span>';
				   
		$(node).find('.images').append(html);
		
		$('#imagesDialog').modal('hide');
		
		return true;
	
	},

	// creates gallery
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('gallery', 'gallery');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="images">' +
					'<button type="button" class="add-gallery-image"><i class="fa fa-picture-o"></i></button>' +
					'</div>';		
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-gallery';
		attrs['data-cssclass'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
		
		// make the elements sortable
		$('.respond-gallery div').sortable({handle:'img', items:'span.image', placeholder: 'editor-highlight', opacity:'0.6', axis:'x'});
		
		return true;
		
	},
	
	// parse gallery
	parse:function(node){
	
		// get params
		var id = $(node).attr('galleryid');
		
		// get old formid
		if(id == undefined){
			id = $(node).attr('id');
		}
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="images">' +
					'<button type="button" class="add-gallery-image"><i class="fa fa-picture-o"></i></button>';
		
		// get images			
		var imgs = $(node).find('img');	
				
		for(var y=0; y<imgs.length; y++){
		
			// get caption
			var title = $(imgs[y]).attr('title');
			var src = $(imgs[y]).attr('src');
			var caption = $(imgs[y]).attr('data-caption') || '';
			var thumb = $(imgs[y]).attr('data-thumb') || '';
	
			// get scope from page
			var scope = angular.element($("section.main")).scope();
			
			// get domain from scope
			var url = scope.site.ImagesUrl;
			
			// replace the images URL with the URL from the site
			src = utilities.replaceAll(src, '{{site.ImagesUrl}}', url);
			
			var image = '<img class="respond-element" src="' + src + '" title="' + title + '" ' + 
				'data-caption="' + caption + '" data-thumb="' + thumb + '">';
			
			// build html
			html +=	'<span class="image">' + image + '</span>';
		
		}			

		// add button				  	
		html += '</div>';				
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-gallery';
		attrs['data-cssclass'] = $(node).attr('class');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate gallery
	generate:function(node){
		
  		// html for tag
  		var html = '';
  		
  		// get images
  		var imgs = $(node).find('img');
  		
  		for(var y=0; y<imgs.length; y++){
  		
  			var title = $(imgs[y]).attr('title');
  			var src = $(imgs[y]).attr('src');
  			
  			var location = $(imgs[y]).attr('data-location');
  			
  			if(location == undefined || location == null){
	  			location = 'local';
  			}
  			
  			var caption = $(imgs[y]).attr('data-caption')|| '';
  			var thumb = $(imgs[y]).attr('data-thumb')|| '';
  			
  			if(location == 'local'){
	  			// removes the domain from the img
		  		if(src != ''){
			  		var parts = src.split('files/');
			  		src = 'files/' + parts[1];
		  		}
	  			
	  			var image = '<img src="{{site.ImagesUrl}}' + src + '" title="' + title + '" ' +
	  							'data-caption="' + caption + '" ' +
	  							'data-thumb="' + thumb + '" ' +
								'data-location="local">';
  			}
  			else{
	  			var image = '<img src="' + src + '" title="' + title + '" ' + 
	  							'data-caption="' + caption + '" ' +
	  							'data-thumb="' + thumb + '" ' +
								'data-location="external">';
  			}
  			
			html += '<div>' + image + '</div>';
		}
  		
		// tag attributes
		var attrs = [];
		attrs['galleryid'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		
		// return element
		return utilities.element('respond-gallery', attrs, html);
		
	},
	
	// config gallery
	config:function(node, form){}
	
};

respond.component.gallery.init();

// share component
respond.component.share = {

	// create share
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('share', 'share');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-share-alt"></i> ' + 
					i18n.t('Share') + '</div>';		
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-share';
		attrs['data-cssclass'] = '';
		
		attrs['data-fbshow'] = 'true';
		attrs['data-fblayout'] = 'standard';
		attrs['data-fbaction'] = 'like';
		
		attrs['data-twshow'] = 'true';
		attrs['data-twvia'] = '';
		attrs['data-twhash'] = '';
		
		attrs['data-pinshow'] = 'true';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse share
	parse:function(node){
		
		// get params
		var id = $(node).attr('id');
		var type = $(node).attr('type');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-share-alt"></i> ' + 
					i18n.t('Share') + '</div>';
		
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = $(node).attr('shareid');
		attrs['class'] = 'respond-share';
		attrs['data-cssclass'] = $(node).attr('cssclass');
		
		attrs['data-fbshow'] = $(node).attr('fbshow');
		attrs['data-fblayout'] = $(node).attr('fblayout');
		attrs['data-fbaction'] = $(node).attr('fbaction');
		
		attrs['data-twshow'] = $(node).attr('twshow');
		attrs['data-twvia'] = $(node).attr('twvia');
		attrs['data-twhash'] = $(node).attr('twhash');
		
		attrs['data-pinshow'] = $(node).attr('pinshow');
		
		utilities.element('div', attrs, html)
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate share
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['shareid'] = $(node).attr('data-id');
		attrs['cssclass'] = $(node).attr('data-cssclass');
		
		attrs['fbshow'] = $(node).attr('data-fbshow');
		attrs['fblayout'] = $(node).attr('data-fblayout');
		attrs['fbaction'] = $(node).attr('data-fbaction');	
		
		attrs['twshow'] = $(node).attr('data-twshow');
		attrs['twvia'] = $(node).attr('data-twvia');
		attrs['twhash'] = $(node).attr('data-twhash');	
		
		attrs['pinshow'] = $(node).attr('data-pinshow');	
		
		// return element
		return utilities.element('respond-share', attrs, '');
		
	},
	
	// config list
	config:function(node, form){}
	
};

// badge component
respond.component.badge = {

	// create share
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('badge', 'badge');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-shield"></i> ' + 
					i18n.t('Badge') + '</div>';		
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-badge';
		attrs['data-cssclass'] = '';
		attrs['data-display'] = 'monochrome';
		
		attrs['data-facebook'] = '';
		attrs['data-twitter'] = '';
		attrs['data-pinterest'] = '';
		attrs['data-github'] = '';
		attrs['data-tumblr'] = '';
		attrs['data-youtube'] = '';
		attrs['data-googleplus'] = '';
		attrs['data-linkedin'] = '';
		attrs['data-instagram'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse badge
	parse:function(node){
		
		// get params
		var id = $(node).attr('id');
		var type = $(node).attr('type');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-shield"></i> ' + 
					i18n.t('Badge') + '</div>';
		
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = $(node).attr('badgeid');
		attrs['class'] = 'respond-badge';
		attrs['data-cssclass'] = $(node).attr('cssclass');
		attrs['data-display'] = $(node).attr('display');
		
		attrs['data-facebook'] = $(node).attr('facebook');
		attrs['data-twitter'] = $(node).attr('twitter');
		attrs['data-pinterest'] = $(node).attr('pinterest');
		attrs['data-github'] = $(node).attr('github');
		attrs['data-tumblr'] = $(node).attr('tumblr');
		attrs['data-youtube'] = $(node).attr('youtube');
		attrs['data-googleplus'] = $(node).attr('googleplus');
		attrs['data-linkedin'] = $(node).attr('linkedin');
		attrs['data-instagram'] = $(node).attr('instagram');
		
		utilities.element('div', attrs, html)
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate badge
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['badgeid'] = $(node).attr('data-id');
		attrs['cssclass'] = $(node).attr('data-cssclass');
		attrs['display'] = $(node).attr('data-display');
		
		attrs['facebook'] = $(node).attr('data-facebook');
		attrs['twitter'] = $(node).attr('data-twitter');
		attrs['pinterest'] = $(node).attr('data-pinterest');
		attrs['github'] = $(node).attr('data-github');
		attrs['tumblr'] = $(node).attr('data-tumblr');
		attrs['youtube'] = $(node).attr('data-youtube');
		attrs['googleplus'] = $(node).attr('data-googleplus');
		attrs['linkedin'] = $(node).attr('data-linkedin');
		attrs['instagram'] = $(node).attr('data-instagram');
		
		// return element
		return utilities.element('respond-badge', attrs, '');
		
	},
	
	// config list
	config:function(node, form){}
	
};

// comments component
respond.component.comments = {

	// create comments
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('comments', 'comments');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-comments"></i> ' + 
					i18n.t('Comments') + '</div>';		
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-comments';
		attrs['data-cssclass'] = '';
		
		attrs['data-showfacebook'] = 'true';
		attrs['data-showdisqus'] = 'false';
		attrs['data-disqusshortname'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse comments
	parse:function(node){
		
		// get params
		var id = $(node).attr('id');
		var type = $(node).attr('type');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-comments"></i> ' + 
					i18n.t('Comments') + '</div>';
		
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = $(node).attr('commentsid');
		attrs['class'] = 'respond-comments';
		attrs['data-cssclass'] = $(node).attr('cssclass');
		
		attrs['data-showfacebook'] = $(node).attr('showfacebook');
		attrs['data-showdisqus'] = $(node).attr('showdisqus');
		attrs['data-disqusshortname'] = $(node).attr('disqusshortname');
		
		utilities.element('div', attrs, html)
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate comments
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['commentsid'] = $(node).attr('data-id');
		attrs['cssclass'] = $(node).attr('data-cssclass');
		
		attrs['showfacebook'] = $(node).attr('data-showfacebook');
		attrs['showdisqus'] = $(node).attr('data-showdisqus');
		attrs['disqusshortname'] = $(node).attr('data-disqusshortname');
		
		// return element
		return utilities.element('respond-comments', attrs, '');
		
	},
	
	// config list
	config:function(node, form){}
	
};


