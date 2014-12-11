// create namespace
var plugin = plugin || {};

// sample plugin
plugin.sample = {

	// creates map
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('sample', 'sample');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-certificate"></i> <span>Example Plugin</span></div>';	
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'plugin-sample';
		attrs['data-cssclass'] = '';
		attrs['data-attr1'] = 'default';
		attrs['data-attr2'] = 'default';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse example
	parse:function(node){
	
		// get params
		var id = $(node).attr('id');
		var attr1 = $(node).attr('attr1');
		var attr2 = $(node).attr('attr2');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-certificate"></i> <span>Example Plugin</span></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'plugin-sample';
		attrs['data-cssclass'] = $(node).attr('class');
		attrs['data-attr1'] = attr1;
		attrs['data-attr2'] = attr2;
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate example
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['id'] = $(node).attr('data-id');
		attrs['class'] = $(node).attr('data-cssclass');
		attrs['attr1'] = $(node).attr('data-attr1');
		attrs['attr2'] = $(node).attr('data-attr2');
		
		// return element
		return utilities.element('plugin-sample', attrs, '');
		
	},
	
	// config example
	config:function(node, form){}
	
};