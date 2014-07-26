/*
	Creates the Editor for Respond CMS
*/
var respond = respond || {};

// holds current row and node
respond.currnode = null;
respond.currrow = null;
respond.prefix = '';

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

// set debug
respond.debug = false;

// defaults
respond.defaults = {
	showIndividualLayoutOptions: false,

	elementMenu: '<a class="expand-menu fa fa-ellipsis-v"></a>' +
			'<div class="element-menu"><a class="config fa fa-cog"></a><a class="move fa fa-arrows"></a>'+
			'<a class="remove fa fa-minus-circle"></a></div>',
	
	elementMenuTable: '<a class="expand-menu fa fa-ellipsis-v"></a>' +
			'<div class="element-menu">' +
			'<a class="add-row fa fa-plus-square-o"></a><a class="remove-row fa fa-minus-square-o"></a>'+
			'<a class="config fa fa-cog"></a><a class="move fa fa-arrows"></a>'+
			'<a class="remove fa fa-minus-circle"></a></div>',	  
		  
	elementMenuNoConfig: '<a class="expand-menu fa fa-ellipsis-v"></a>' +
			'<div class="element-menu"><a class="move fa fa-arrows"></a><a class="remove fa fa-minus-circle"></a></div>',
			
			
	elementMenuList: '<a class="expand-menu fa fa-ellipsis-v"></a>' +
				'<div class="element-menu"><a class="config-list fa fa-cog"></a><a class="move fa fa-arrows"></a>' +
				'<a class="remove fa fa-minus-circle"></a></div>',
				
	elementMenuPlugin: '<a class="expand-menu fa fa-ellipsis-v"></a>' +
				'<div class="element-menu"><a class="config-plugin fa fa-cog"></a><a class="move fa fa-arrows"></a>' +
				'<a class="remove fa fa-minus-circle"></a></div>',
				
	elementMenuForm: '<a class="expand-menu fa fa-ellipsis-v"></a>' +
				'<div class="element-menu"><a class="config-form fa fa-cog"></a><a class="move fa fa-arrows"></a>' +
				'<a class="remove fa fa-minus-circle"></a></div>',
				
	elementMenuField: '<a class="expand-menu fa fa-ellipsis-v"></a>' +
				'<div class="element-menu"><a class="config-field fa fa-cog"></a><a class="move fa fa-arrows"></a>' +
				'<a class="remove fa fa-minus-circle"></a></div>',
	
	elementMenuHtml: '<a class="expand-menu fa fa-ellipsis-v"></a>' +
				'<div class="element-menu"><a class="config-html fa fa-cog"></a><a class="move fa fa-arrows"></a>' +
				'<a class="remove fa fa-minus-circle"></a></div>',
				
	elementMenuShelf: '<i class="expand-menu fa fa-ellipsis-v"></i>' +
				'<div class="element-menu"><a class="config-shelf fa fa-cog"></a><a class="move fa fa-arrows"></a>' +
				'<a class="remove fa fa-minus-circle"></a></div>',
				
	blockMenu: '<a class="expand-menu fa fa-ellipsis-v"></a>' +
			'<div class="element-menu">' + 
			'<a class="duplicate fa fa-copy"></a>' +
			'<a class="up fa fa-chevron-up"></a><a class="down fa fa-chevron-down"></a>' +
			'<a class="config-block fa fa-cog"></a>'+
			'<a class="remove-block fa fa-minus-circle"></a></div>'
};


// instantiate editor
respond.Editor = function(config){

	this.el = config.el;
	
	// build the editor
	respond.Editor.Build(this.el);
	
}

// builds the menu
respond.Editor.BuildMenu = function(el){
	
	var id = el.id;
	
	// create menu
	var menu =  '<nav class="editor-menu">' +
                '<div class="editor-actions"><div>' +
				'<a class="bold fa fa-bold" title="'+t('bold_text')+'" data-target="'+id+'"></a>' +
				'<a class="italic fa fa-italic" title="'+t('italic_text')+'" data-target="'+id+'"></a>' +
				'<a class="strike fa fa-strikethrough" title="'+t('strike_text')+'" data-target="'+id+'"></a>' +
				'<a class="subscript fa fa-subscript" title="'+t('subscript_text')+'" data-target="'+id+'"></a>' +
				'<a class="superscript fa fa-superscript" title="'+t('superscript_text')+'" data-target="'+id+'"></a>' +
				'<a class="underline fa fa-underline" title="'+t('underline_text')+'" data-target="'+id+'"></a>' +
				'<a class="align-left fa fa-align-left" title="'+t('align-left_text')+'" data-align="left" data-target="'+id+'"></a>' +
				'<a class="align-center fa fa-align-center" title="'+t('align-center_text')+'" data-align="center" data-target="'+id+'"></a>' +
				'<a class="align-right fa fa-align-right" title="'+t('align-right_text')+'" data-align="right" data-target="'+id+'"></a>' +
				'<a class="link fa fa-link" title="'+t('addLink')+'" data-target="'+id+'"></a>' +
				'<a class="code fa fa-code" title="'+t('addCode')+'" data-target="'+id+'"></a>' +
        		'<a class="icon fa fa-flag" title="'+t('iconfa')+'" data-target="'+id+'"></a>' +
				'<a class="br" title="'+t('addBr')+'" data-target="'+id+'">BR</a>' +
				'<span class="sep"></span>' +
				'<a class="h1 draggable" title="'+t('addHeadline')+'" data-target="'+id+'">H1</a>' +
				'<a class="h2 draggable" title="'+t('addHeadline')+'" data-target="'+id+'">H2</a>' +
				'<a class="h3 draggable" title="'+t('addHeadline')+'" data-target="'+id+'">H3</a>' +
				'<a class="h4 draggable" title="'+t('addHeadline')+'" data-target="'+id+'">H4</a>' +
				'<a class="h5 draggable" title="'+t('addHeadline')+'" data-target="'+id+'">H5</a>' +
				'<a class="p draggable" title="'+t('addParagraph')+'" data-target="'+id+'">P</a>' +
				'<a class="q fa fa-quote-left draggable" title="'+t('addquote')+'" data-target="'+id+'"></a>' +
				'<a class="ul fa fa-list-ul draggable" title="'+t('addlist')+'" data-target="'+id+'"></a>' +
				'<a class="ol fa fa-list-ol draggable" title="'+t('addlist')+'" data-target="'+id+'"></a>' +
				'<a class="table fa fa-table draggable" title="'+t('addtable')+'" data-target="'+id+'"></a>' +
				'<a class="hr fa fa-minus draggable" title="'+t('addhr')+'" data-target="'+id+'"></a>' +
				'<a class="img fa fa-picture-o draggable" title="'+t('addimg')+'" data-target="'+id+'"></span>' +
				'<a class="slideshow  fa fa-film draggable" title="'+t('addslideshow')+'" data-target="'+id+'"></a>' +
				'<a class="map  fa fa-map-marker draggable" title="'+t('addmap')+'" data-target="'+id+'"></a>' +
				'<a class="twitter fa fa-twitter draggable" title="'+t('addtwitter')+'" data-target="'+id+'"></a>' +
				'<a class="like fa fa-facebook draggable" title="'+t('addfacebook')+'" data-target="'+id+'"></a>' +
				'<a class="comments fa fa-comments draggable" title="'+t('fa-comments')+'" data-target="'+id+'"></a>' +
				'<a class="youtube fa fa-video-camera draggable" title="'+t('youtube')+'" data-target="'+id+'"></span>' +
				'<a class="list fa fa-bars draggable" title="'+t('list_pages')+'" data-target="'+id+'"></span>' +
                '<a class="featured fa fa-star draggable" title="'+t('featured')+'" data-target="'+id+'"></a>' +
				'<a class="file fa fa-file-o draggable" title="'+t('addFile')+'" data-target="'+id+'"></a>' +
				'<a class="shelf fa fa-tags draggable" title="'+t('addSKUs')+'" data-target="'+id+'"></a>' +
				'<a class="form fa fa-check draggable" title="'+t('addForm')+'" data-target="'+id+'"></a>' +
				'<a class="html fa fa-html5 draggable" title="'+t('addhtml')+'" data-target="'+id+'"></a>' + 
				'<a class="syntax fa fa-terminal draggable" title="'+t('addSyntax')+'" data-target="'+id+'"></a>' +
				'<a class="secure fa fa-lock draggable" title="'+t('secure')+'" data-target="'+id+'"></a>' +
				'<a class="plugins draggable" title="'+t('plugins')+'" data-target="'+id+'"></a>' +
				'<span class="sep"></span>' +
				'<a class="load fa fa-upload" title="'+t('load')+'" data-target="'+id+'"></a>' +
				'<a class="layout fa fa-columns" title="'+t('layout')+'" data-target="'+id+'"></a>';
	
	if(respond.defaults.showIndividualLayoutOptions){			
		menu +=	'<a class="cols5050 fa fa-columns" title="'+t('cols55')+'" data-target="'+id+'"><small>50/50</small></a>' +
					'<a class="single fa fa-columns" title="'+t('cols100')+'" data-target="'+id+'"><small>100</small></a>' +
					'<a class="cols73 fa fa-columns" title="'+t('cols73')+'" data-target="'+id+'"><small>70/30</small></a>' +
					'<a class="cols37 fa fa-columns" title="'+t('cols37')+'" data-target="'+id+'"><small>30/70</small></a>' +
					'<a class="cols333 fa fa-columns" title="'+t('cols333')+'" data-target="'+id+'"><small>3/3/3</small></a>' +
					'<a class="cols425 fa fa-columns" title="'+t('cols425')+'" data-target="'+id+'"><small>4*25</small></a>';
	}
	
	menu += '</div></div>' +
                '<a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>' +
				'<a class="next fs-next"><i class="fa fa-chevron-right"></i></a>' +
				'<a class="previous fs-prev"><i class="fa fa-chevron-left"></i></a>' +
				'<a class="primary-action settings" title="'+t('settings')+'"><i class="fa fa-cog"></i></a>' +
				'</nav>';
				
	return menu;
	
}

// parses the html
respond.Editor.ParseHTML = function(top){

	function parseModules(node){
			var children = $(node).children();
			var response = '';
			
			for(var x=0; x<children.length; x++){
		  		var node = children[x];
		  		var cssclass = '';
		 
		  		// parse P
			  	if(node.nodeName=='P'){
					var id = $(node).attr('id');
					if(id==undefined || id=='')id='p-'+parseInt(new Date().getTime() / 1000);
					cssclass = $(node).attr('class');
					if(cssclass==undefined) cssclass='';
					
					var alignclass = '';
					
					if(cssclass.indexOf('text-left')!=-1){
						alignclass = ' text-left';
					}
					else if(cssclass.indexOf('text-center')!=-1){
						alignclass = ' text-center';
					}
					else if(cssclass.indexOf('text-right')!=-1){
						alignclass = ' text-right';
					}
					
					var h = $(node).html();
					
					response+= '<div id="'+id+'" class="p'+alignclass+'" data-id="'+id+'" data-cssclass="'+cssclass+'">' +
						respond.defaults.elementMenu +
						'<div class="content" contentEditable="true">' + h + '</div>' +
						'</div>';
			  	}
	
			  	// parse TABLE
			  	if(node.nodeName=='TABLE'){
		            var id = $(node).attr('id');
		            if(id==undefined || id=='')id='table-'+parseInt(new Date().getTime() / 1000);
		            cssclass = $(node).attr('class');
		            if(cssclass==undefined) cssclass='';
	
		            var columns = $(node).attr('data-columns');
	
		           	var rows = '';
	
		           	var tr = $(node).find('thead tr');
	
		           	rows += '<thead><tr>';
	
		           	var ths = $(tr).find('th');
	
					for(var d=0; d<ths.length; d++){
						rows += '<th contentEditable="true" class="col-'+(d+1)+'">'+$(ths[d]).html()+'</td>';
					}
	
		           	rows += '</tr></thead>';
	
		            var trs = $(node).find('tbody tr');
	
		            rows += '<tbody>';
	
		            for(var t=0; t<trs.length; t++){
						rows += '<tr class="row-'+(t+1)+'">';
						var tds = $(trs[t]).find('td');
	
						for(var d=0; d<tds.length; d++){
							rows += '<td contentEditable="true" class="col-'+(d+1)+'">'+$(tds[d]).html()+'</td>';
						}
	
						rows += '</tr>';
					}
	
					rows += '</tbody>';
					
		            var table = '<div id="'+id+'" class="table" data-id="'+id+'" data-cssclass="'+cssclass+'">' +
		            				respond.defaults.elementMenuTable +
		            				'<table class="'+cssclass+'" data-columns="'+columns+'">' +
									rows + '</table>' +
									'</div>';
	
	            	response += table;
	          	}
			  
			  	// parse BLOCKQUOTE
			  	if(node.nodeName=='BLOCKQUOTE'){
					var id = $(node).attr('id');
					if(id==undefined || id=='')id='bq-'+parseInt(new Date().getTime() / 1000);
					cssclass = $(node).attr('class');
					if(cssclass==undefined) cssclass='';
				
					response+= '<div id="'+id+'" class="q" data-id="'+id+'" data-cssclass="'+cssclass+'"><i class="in-textbox fa fa-quote-left"></i>' +
		            				respond.defaults.elementMenu +
									'<div class="content" contentEditable="true">' + $(node).html() + '</div>' +
									'</div>';
			  	}
			  
			  	// parse UL
			  	if(node.nodeName=='UL'){
					var lis = $(node).children();
					var id = $(node).attr('id');
					if(id==undefined || id=='')id='ul-'+parseInt(new Date().getTime() / 1000);
					cssclass = $(node).attr('class');
					if(cssclass==undefined) cssclass='';
				
					response+= '<div id="'+id+'" class="ul" data-id="'+id+'" data-cssclass="'+cssclass+'">' +
								respond.defaults.elementMenu;
				
					for(y=0; y<lis.length; y++){
						response+= '<div class="content" contentEditable="true">' + $(lis[y]).html() + '</div>';
					}
				  
					response+= '</div>';
			  	}
			  	
			  	// parse OL
			  	if(node.nodeName=='OL'){
					var lis = $(node).children();
					var id = $(node).attr('id');
					if(id==undefined || id=='')id='ul-'+parseInt(new Date().getTime() / 1000);
					cssclass = $(node).attr('class');
					if(cssclass==undefined) cssclass='';
				
					response+= '<div id="'+id+'" class="ol" data-id="'+id+'" data-cssclass="'+cssclass+'">' +
								respond.defaults.elementMenu;
				
					for(y=0; y<lis.length; y++){
						response+= '<div class="content" contentEditable="true">' + $(lis[y]).html() + '</div>';
					}
				  
					response+= '</div>';
			  	}
			  
			  	// parse H1
			  	if(node.nodeName=='H1'){
					var id = $(node).attr('id');
					if(id==undefined || id=='')id='h1-'+parseInt(new Date().getTime() / 1000);
					cssclass = $(node).attr('class');
					if(cssclass==undefined) cssclass='';
					
					var alignclass = '';
					
					if(cssclass.indexOf('text-left')!=-1){
						alignclass = ' text-left';
					}
					else if(cssclass.indexOf('text-center')!=-1){
						alignclass = ' text-center';
					}
					else if(cssclass.indexOf('text-right')!=-1){
						alignclass = ' text-right';
					}
				
					response+= '<div id="'+id+'" class="h1'+alignclass+'" data-id="'+id+'" data-cssclass="'+cssclass+'">'+
						respond.defaults.elementMenu +
						'<div contentEditable="true">' + $(node).html() + '</div>' +
						'</div>';
			  	}
			  
			  	// parse HR
			  	if(node.nodeName=='HR'){
					var id = $(node).attr('id');
					if(id==undefined || id=='')id='hr-'+parseInt(new Date().getTime() / 1000);
					cssclass = $(node).attr('class');
				  	if(cssclass==undefined) cssclass='';
				  	response+= '<div id="'+id+'" class="hr" data-id="'+id+'" data-cssclass="'+cssclass+'">' +
				  		respond.defaults.elementMenu +
						'<div class="line"></div>' +
						'</div>';
		
			  	}
			  
			  	// parse H2
			  	if(node.nodeName=='H2'){
					var id = $(node).attr('id');
					if(id==undefined || id=='')id='h2-'+parseInt(new Date().getTime() / 1000);
					cssclass = $(node).attr('class');
					if(cssclass==undefined) cssclass='';
					
					var alignclass = '';
					
					if(cssclass.indexOf('text-left')!=-1){
						alignclass = ' text-left';
					}
					else if(cssclass.indexOf('text-center')!=-1){
						alignclass = ' text-center';
					}
					else if(cssclass.indexOf('text-right')!=-1){
						alignclass = ' text-right';
					}
					
					response+= '<div id="'+id+'" class="h2'+alignclass+'" data-id="'+id+'" data-cssclass="'+cssclass+'">'+
						respond.defaults.elementMenu +
						'<div contentEditable="true">' + $(node).html() + '</div>' +
						'</div>';
			  	}
			  
			  	// parse H3
			  	if(node.nodeName=='H3'){
			  		var id = $(node).attr('id');
			  		if(id==undefined || id=='')id='h3-'+parseInt(new Date().getTime() / 1000);
					cssclass = $(node).attr('class');
					if(cssclass==undefined) cssclass='';
					
					var alignclass = '';
					
					if(cssclass.indexOf('text-left')!=-1){
						alignclass = ' text-left';
					}
					else if(cssclass.indexOf('text-center')!=-1){
						alignclass = ' text-center';
					}
					else if(cssclass.indexOf('align-right')!=-1){
						alignclass = ' text-right';
					}
			  
			  		response+= '<div id="'+id+'" class="h3'+alignclass+'" data-id="'+id+'" data-cssclass="'+cssclass+'">'+
			  			respond.defaults.elementMenu +
						'<div contentEditable="true">' + $(node).html() + '</div>' +
						'</div>';
			  	}
			  	
			  	// parse H4
			  	if(node.nodeName=='H4'){
			  		var id = $(node).attr('id');
			  		if(id==undefined || id=='')id='h4-'+parseInt(new Date().getTime() / 1000);
					cssclass = $(node).attr('class');
					if(cssclass==undefined) cssclass='';
					
					var alignclass = '';
					
					if(cssclass.indexOf('text-left')!=-1){
						alignclass = ' text-left';
					}
					else if(cssclass.indexOf('text-center')!=-1){
						alignclass = ' text-center';
					}
					else if(cssclass.indexOf('align-right')!=-1){
						alignclass = ' text-right';
					}
			  
			  		response+= '<div id="'+id+'" class="h4'+alignclass+'" data-id="'+id+'" data-cssclass="'+cssclass+'">'+
			  			respond.defaults.elementMenu +
						'<div contentEditable="true">' + $(node).html() + '</div>' +
						'</div>';
			  	}
			  	
			  	// parse H5
			  	if(node.nodeName=='H5'){
			  		var id = $(node).attr('id');
			  		if(id==undefined || id=='')id='h5-'+parseInt(new Date().getTime() / 1000);
					cssclass = $(node).attr('class');
					if(cssclass==undefined) cssclass='';
					
					var alignclass = '';
					
					if(cssclass.indexOf('text-left')!=-1){
						alignclass = ' text-left';
					}
					else if(cssclass.indexOf('text-center')!=-1){
						alignclass = ' text-center';
					}
					else if(cssclass.indexOf('align-right')!=-1){
						alignclass = ' text-right';
					}
			  
			  		response+= '<div id="'+id+'" class="h5'+alignclass+'" data-id="'+id+'" data-cssclass="'+cssclass+'">'+
			  			respond.defaults.elementMenu +
						'<div contentEditable="true">' + $(node).html() + '</div>' +
						'</div>';
			  	}
	
			  	// parse PRE
			  	if(node.nodeName=='PRE'){
					var id = $(node).attr('id');
					if(id==undefined || id=='')id='syntax-'+parseInt(new Date().getTime() / 1000);
					
					response+= '<div id="'+id+'" class="syntax" data-id="'+id+'" data-cssclass="prettyprint linenums pre-scrollable">'+
						respond.defaults.elementMenuNoConfig +
						'<pre class="prettyprint linenums pre-scrollable">' + $(node).html() + '</pre>' +
						'<pre class="non-pretty">' + $(node).html() + '</pre>' +
						'</div>';
			  	}
			  
			  	// parse DIV
			  	if(node.nodeName=='DIV'){
					var className = $(node).attr('class');
					var p_classname = $(node).attr('class'); // parsed classname
	
					// check for non-formed divs
					if(className != undefined){
						if(className.indexOf('l-image')!=-1){
							className = ' left';
							p_classname =  global.replaceAll(p_classname, 'l-image', '');
						}
						else if(className.indexOf('r-image')!=-1){
							className = ' right';
							p_classname =  global.replaceAll(p_classname, 'r-image', '');
						}
						else if(className.indexOf('o-image')!=-1){
							className = '';
							p_classname =  global.replaceAll(p_classname, 'o-image', '');
						}
						
						// trim any whitespace
						p_classname = $.trim(p_classname);
						
						var rel = $(node).find('a').attr('rel');
						
						if(rel==undefined || rel==''){
							rel='';
						}
		
						var src = $(node).find('img').attr('src');
						var href = $(node).find('a').attr('href');
						var i_id = $(node).find('img').attr('id');
						var html = $(node).find('p').html();
					
						// set constraints
						var width = $(node).attr('data-width');
						var height = $(node).attr('data-height');
						var constraints = '';
					
						if(width!=''&&height!=''){
					  		if(!isNaN(width)&&!isNaN(height)){ // set constraints
								constraints = ' data-width="'+width+'" data-height="'+height+'"';
							}
						}
					
						var id = $(node).attr('id');
			  
						if(id==undefined || id==''){
							id='i-'+parseInt(new Date().getTime() / 1000);
						}
			  
					  	if(className==' left'){
							response+= '<div id="'+id+'" class="i' + className + '"'+constraints+
											' data-id="'+id+'" data-cssclass="'+p_classname+'">' +
											respond.defaults.elementMenu;
											
							if(href==undefined){
						  		response+='<div class="img"><img id="'+i_id+'" src="' + src + '"></div>';
							}
							else{
						  		response+='<div class="img hasUrl"><img id="'+i_id+'" src="' + src + '" data-url="' + href + '"></div>';
							}
							response +='<div class="content" contentEditable="true">' + 
											html + '</div></div>';
					  	}
					  	else if(className==' right'){
							response+= '<div id="'+id+'" class="i' + className + '"'+constraints+
											' data-id="'+id+'" data-cssclass="'+p_classname+'">' +
											respond.defaults.elementMenu;
							response+='<div class="content" contentEditable="true">' + html + '</div>';
							if(href==undefined){
						  		response+='<div class="img"><img id="'+i_id+'" src="' + src + '"></div>';
							}
							else{
						  		response+='<div class="img hasUrl"><img id="'+i_id+'" src="' + src + '" data-url="' + href + '"></div>';
							}
							response+='</div>';
					  	}
					  	else{
							response+= '<div id="'+id+'" class="i"'+constraints+' data-id="'+id+'" data-cssclass="'+p_classname+'">' +
											respond.defaults.elementMenu;
							if(href==undefined){
						  		response+= '<div class="img"><img id="'+i_id+'" src="' + src + '"></div>';
							}
							else{
						  		response+= '<div class="img hasUrl"><img id="'+i_id+'" src="' + src + '" data-url="' + href + '"></div>';
							}
							response+= '</div>';
					  	}
				  	}
				}
	
				// parse PLUGIN
				if(node.nodeName=='PLUGIN'){
					var id = $(node).attr('id');
					var type = $(node).attr('type');
					var name = $(node).attr('name');
					var render = $(node).attr('render');
					var config = $(node).attr('config');
				  	if(id==undefined || id=='')id='d-'+parseInt(new Date().getTime() / 1000);
		
				  	//var attrs = $(node).attr();
				  	var nvps = '';
		
				  	var attrs = $(node).get(0).attributes;
					
					$.each(attrs, function(i, attrib)
					{
						var name = attrib.name;
						var value = attrib.value;
						
						if(name != 'id' && name != 'type' && name != 'name' && name != 'render' && name != 'config'){
							nvps += 'data-' + name + '="' + value +'" ';
						}
					});
		
					response+= '<div id="'+id+'" data-type="'+type+'" data-name="'+name+'" data-render="'+render+'" data-config="'+config+'" ' + nvps + 'class="plugin">';
					
					if(config=='true'){
				        response +=  respond.defaults.elementMenuPlugin;
			      	}
			      	else{
				        response += respond.defaults.elementMenuNoConfig;
			      	}
					
					
					response+='<div class="title"><i class="fa fa-cogs"></i> '+name+'</div></div>';
				 
				}
			  
				// parse MODULE
				if(node.nodeName=='MODULE'){
		  	
					var name = $(node).attr('name') || '';
					var id = $(node).attr('id');
					
					if(id==undefined || id=='')id='s-'+parseInt(new Date().getTime() / 1000);
					
					// parse SLIDESHOW MODULE
					if(name=='slideshow'){
						var display = $(node).attr('display');  
					  	
					  	if(display==undefined || display==''){
							display = 'slideshow';
					  	}
					  					  
					  	var imgs = $(node).find('img');
					  
					  	response+= '<div id="' + id + '" class="slideshow" data-display="'+display+'">' +
					  		respond.defaults.elementMenuNoConfig +
					  		'<div class="images">';
					
					  	for(var y=0; y<imgs.length; y++){
							var caption = $(imgs[y]).attr('title');
							imghtml = $('<div>').append($(imgs[y]).clone()).remove().html();
							response +='<span class="image">' + imghtml + '<span class="caption"><input type="text" value="'+caption+'" placeholder="Enter caption" maxwidth="140" ></span><a class="remove-image fa fa-minus-circle"></a></span>';
					  	}
					
					  	response += '<button type="button" class="secondary-button add-image"><i class="fa fa-picture-o"></i></button></div></div>';
					}
	
					// parse LIKE MODULE
					if(name=='like'){
						var id = $(node).attr('id');
						if(id==undefined || id=='')id='f-'+parseInt(new Date().getTime() / 1000);
						
						response+= '<div id="'+id+'" class="like">' +
										respond.defaults.elementMenuNoConfig +
										'<div class="title"><i class="fa fa-facebook"></i>Facebook Like</div></div>';
					}
	
					// parse COMMENTS MODULE
					if(name=='comments'){
						var id = $(node).attr('id');
						if(id==undefined || id=='')id='c-'+parseInt(new Date().getTime() / 1000);
						
						response+= '<div id="'+id+'" class="comments">' +
										respond.defaults.elementMenuNoConfig +
										'<div class="title"><i class="fa fa-facebook"></i>Facebook comments</div></div>';
					}
					
					// parse HTML MODULE
					if(name=='html'){
						var id = $(node).attr('id');
						if(id==undefined || id=='')id='h-'+parseInt(new Date().getTime() / 1000);
						
						var desc = $(node).attr('desc');
						if(desc==undefined || desc=='')desc='HTML Block';
						
						var type = $(node).attr('type');
						if(type==undefined || type=='')desc='html';
						
						var code = $(node).html();
						
						// backwards compatibility with older version
						if(code.indexOf('&lt;') != -1){
						
							code = global.replaceAll(code, '&lt;', '<');
							code = global.replaceAll(code, '&gt;', '>');
		
						}
						
						// create pretty code for display
						var prettyCode = global.replaceAll(code, '<', '&lt;');
						prettyCode = global.replaceAll(prettyCode, '>', '&gt;');
						
						response+= '<div id="'+id+'" class="html" data-id="'+id+'" data-cssclass="prettyprint linenums pre-scrollable"  data-desc="'+desc+'" data-type="'+type+'">'+
							respond.defaults.elementMenuHtml +
							'<div class="title"><i class="fa fa-html5"></i>'+desc+' <i class="fa fa-angle-down"></i></div>' +
							'<pre class="prettyprint linenums pre-scrollable">' + prettyCode + '</pre>' +
							'<pre class="non-pretty">' + code + '</pre>' +
							'</div>';
					}
					
					// parse YOUTUBE MODULE
					if(name=='youtube'){
						var id = $(node).attr('id');
						if(id==undefined || id=='')id='y-'+parseInt(new Date().getTime() / 1000);
						
						var h = $(node).html();
						response+= '<div id="'+id+'" class="youtube">' +
									respond.defaults.elementMenuNoConfig +
									'<textarea placeholder="Paste HTML embed code here">'+h+'</textarea></div>';
					}
					
					// parse MAP MODULE
					if(name=='map'){
				  		var address = $(node).attr('address');
					  	if(address==undefined)address='';
					  	
				  		var zoom = $(node).attr('zoom');
				  		if(zoom==undefined)zoom='auto';
					  	
						var id = $(node).attr('id');
						if(id==undefined || id=='')id='m-'+parseInt(new Date().getTime() / 1000);
						
						var cssclass = $(node).attr('class');
						if(cssclass==undefined || cssclass=='')cssclass = '';
						
						cssclass = global.replaceAll(cssclass, 'map ', '');
				
					  	response+= '<div id="'+id+'" data-id="'+id+'" data-cssclass="'+cssclass+'" class="map" data-zoom="' + zoom +'">' +
					  				respond.defaults.elementMenu +
									'<div><i class="in-textbox fa fa-map-marker"></i><input type="text" value="' + address + '" spellcheck="false" maxlength="512" placeholder="1234 Main Street, Some City, LA 90210"></div></div>';
					}
					
					// parse LIST MODULE
					if(name=='list'){
				  		var display = $(node).attr('display');
					  	var id = $(node).attr('id');
		                  
		                      
					  	if(id==undefined || id==''){
		    		  	  id = 'list'+($(node).find('.list').length + 1);  
					  	}
		
					  	var pagetype = $(node).attr('pagetype');
					  	var type = $(node).attr('type'); // legacy UniqId support
					  	var label = $(node).attr('label');
					  	var desclength = $(node).attr('desclength');
					  	var length = $(node).attr('length');
					  	var orderby = $(node).attr('orderby');
					  	var category = $(node).attr('category');
					  	var pageresults = $(node).attr('pageresults');
					  	if(type==undefined)type='';
						if(label==undefined)label='';
						if(desclength==undefined)desclength='250';
						if(length==undefined)length='';
						if(orderby==undefined)orderby='';
						if(pageresults==undefined)pageresults='';
						
						// handles specify the list by pagetype (friendlyId) or type (uniqId -> legacy)
						var typeAttr = '';
						
						if(pagetype != '' && pagetype != undefined){
							typeAttr = 'data-pagetype="'+pagetype+'"';
						}
						
						if(type != '' && type != undefined){
							typeAttr = 'data-type="'+type+'"';
						}
						
					  	chtml = '<div id="'+id+'" data-display="'+display+'" '+ typeAttr +' class="list"' +
							' data-label="' + label + '"' +
							' data-desclength="' + desclength + '"' +
							' data-length="' + length + '" data-orderby="' + orderby + '" data-category="' + category  + '" data-pageresults="' + pageresults + '">' +
							respond.defaults.elementMenuList +
							' <div class="title"><i class="fa fa-bars"></i> List '+label+' </div></div>';
		
					  	response += chtml;
					  
					}
					
					// parse FEATURED MODULE
					if(name=='featured'){
					  	var id = $(node).attr('id');
		                      
					  	if(id==undefined || id==''){
		    		  	  id = 'list'+($(node).find('.featured').length + 1);  
					  	}
		
					  	var pageName = $(node).attr('pagename');
					  	var pageUniqId = $(node).attr('pageUniqId');
					  	var url = $(node).attr('url');
					  	
					  	// handles by url and pageuniqid (legacy)
					  	var typeAttr = '';
					  	
					  	if(pageUniqId != '' && pageUniqId != undefined){
							typeAttr = 'data-pageuniqid="'+pageUniqId+'"';
						}
						
						if(url != '' && url != undefined){
							typeAttr = 'data-url="'+url+'"';
						}
						
					  	chtml = '<div id="'+id+'" '+ typeAttr +' data-pagename="'+pageName+'" class="featured">' +
					  		respond.defaults.elementMenuNoConfig +
							' <div class="title"><i class="fa fa-star"></i> Featured content: '+pageName+' </div></div>';
		
					  	response += chtml;  
					}
					
					// parse SECURE MODULE
					if(name=='secure'){
					  	var id = $(node).attr('id');
		                var type = $(node).attr('type');
		                
		                var text = window.t(type); // get type from translation
		
					  	chtml = '<div id="'+id+'" data-type="'+type+'" class="secure">' +
					  		respond.defaults.elementMenuNoConfig +
							' <div class="title"><i class="fa fa-lock"></i> '+text+' </div></div>';
		
					  	response += chtml;  
					}
					
					// parse FILE MODULE
					if(name=='file'){
				  		var file = $(node).attr('file');
					  	var desc = $(node).attr('description');
					  	var id = $(node).attr('id');
					  	if(id==undefined || id=='')id='f-'+parseInt(new Date().getTime() / 1000);
					  
					  	response+= '<div id="'+id+'" class="file" data-filename="'+file+'">' +
					  					respond.defaults.elementMenuNoConfig +
					  					'<div><i class="in-textbox fa fa-file-o"></i><input type="text" value="'+desc+'" spellcheck="false" maxlength="256" placeholder="Description for the file"></div></div>';
					}
					
					// parse FORM MODULE
					if(name=='form'){
						var id = $(node).attr('id');
						var type = $(node).attr('type');
						var action = $(node).attr('action');
						var successMessage = $(node).attr('success');
						var errorMessage = $(node).attr('error');
						var submitText = $(node).attr('submit');
						
						// set some defaults
						if(type == '' || type == undefined){
							type = 'default';
						}
						
						if(action == undefined){
							action = '';
						}
						
						if(successMessage == undefined){
							successMessage = '';
						}
						
						if(errorMessage == undefined){
							errorMessage = '';
						}
						
						if(submitText == undefined){
							submitText = '';
						}
						
						response+= '<div id="'+id+'" class="form" data-type="'+type+'" data-action="'+action+'" data-success="'+successMessage+'"  data-error="'+errorMessage+'" data-submit="'+submitText+'">' +
							respond.defaults.elementMenuForm + 
							'<div class="field-list">';
						
						var fields = $(node).find('.form-group');
						
						for(y=0; y<fields.length; y++){
					  		fhtml = $('<div>').append($(fields[y]).clone()).remove().html();
						  	response += '<span class="field-container">' +
						  					respond.defaults.elementMenuField +
						  					fhtml +
						  					'</span>';
						  	
						}
						
						response+= '</div><a class="add-field"><i class="fa fa-check"></i> Add Field</a></div>';
					 }
					 
					 // parse SHELF MODULE
					 if(name=='shelf'){
						var id = $(node).attr('id');
						
						var items = $(node).find('.shelf-item');
						var n_items = '';
						
						for(y=0; y<items.length; y++){
						
							var item = $(items[y]).html();
							
							n_items += '<div class="shelf-item">' + 
										respond.defaults.elementMenuShelf + 
										item + 
										'</div>';
							
						
						}
					
						response+= '<div id="'+id+'" class="shelf">' +
										respond.defaults.elementMenuNoConfig + 
										'<div class="shelf-items">'+ n_items +
										'</div>' + 
										'<a class="add-sku"><i class="fa fa-tag"></i> Add SKU</a>' +
										'</div>';
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
		html += '<span class="block-actions"><span>#block-000 .block.row</span>' +
					respond.defaults.blockMenu + '</span></div>'; 
	}
	else{
		// walk through blocks
		for(var y=0; y<blocks.length; y++){
	  		var id = $(blocks[y]).attr('id');
		  	var cssclass = $(blocks[y]).attr('class');
		  	var cssclass_readable = '.' + global.replaceAll(cssclass, ' ', '.');
		  	
		  	// get nested
		  	var nested = $(blocks[y]).attr('data-nested');
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
		  	cssclass = jQuery.trim(global.replaceAll(cssclass, 'block row', ''));

			if(id==undefined || id=='')id='undefined';

		  	html += '<div id="'+id+'" class="block row" data-cssclass="' + cssclass + '" ' +
		  				'data-nested="' + nested + '" ' +
		  				'data-containerid="' + containerId + '" ' +
		  				'data-containercssclass="' + containerCssClass + '" ' +
		  				'>';        
		  
		  	// determine if there are columns
		  	var cols = $(blocks[y]).find('.col');
  
			for(var z=0; z<cols.length; z++){
				var className = $(cols[z]).attr('class'); 

		  		html += '<div class="'+className+' sortable">';
		  		html += parseModules(cols[z]);
		  		html += '</div>';
		  }

		  html += '<span class="block-actions"><span>#'+ id + ' ' + cssclass_readable + '</span>' +
		  			respond.defaults.blockMenu + '</span></div>';
		}
	}

	return html;
	
}

// sets up the menu events
respond.Editor.SetupMenuEvents = function(){

	// set up draggable
	$('.editor-menu a.draggable').draggable({
      connectToSortable: '.sortable',
      helper: 'clone',
      refert: 'true',
      appendTo: 'body'
    });
    
    // cleanup placeholder
	$('[data-dismiss]').on('click', function(){
    	$('#editor-placeholder').remove();
	});
	
	// create BOLD
	$('.editor-menu a.bold').click(function(){
		document.execCommand("Bold", false, null);
		return false;
	});
	
	// create ITALIC
	$('.editor-menu a.italic').click(function(){
		document.execCommand("Italic", false, null);
		return false;
	});
	
	// create STRIKE
	$('.editor-menu a.strike').click(function(){
		document.execCommand("strikeThrough", false, null);
		return false;
	});
	
	// create UNDELRINE
	$('.editor-menu a.underline').click(function(){
		document.execCommand("underline", false, null);
		return false;
	});
	
	// create SUBSCRIPT
	$('.editor-menu a.subscript').click(function(){
		document.execCommand("subscript", false, null);
		return false;
	});
	
	// create SUPERSCRIPT
	$('.editor-menu a.superscript').click(function(){
		document.execCommand("superscript", false, null);
		return false;
	});
	
	// create LINEBREAK
	$('.editor-menu a.br').click(function(){
		document.execCommand('InsertHTML', false, '<br>');
		return false;
	});
	
	// create ALIGNMENT
	$('.editor-menu a.align-center, .editor-menu a.align-left, .editor-menu a.align-right').click(function(){
	
		var alignclass = 'text-'+$(this).attr('data-align');
		
		if($('*:focus').length>0){
			var el = $('*:focus').parents('div.p, div.h1, div.h2, div.h3, div.h4, div.h5');
			
			var cssclass = el.attr('data-cssclass');
			cssclass = global.replaceAll(cssclass, 'text-left', ''); // replace other alignments
			cssclass = global.replaceAll(cssclass, 'text-right', '');
			cssclass = global.replaceAll(cssclass, 'text-center', '');
			cssclass += ' '+alignclass;
			cssclass = $.trim(cssclass);
			
			el.attr('data-cssclass', cssclass);
			el.removeClass('text-left');
			el.removeClass('text-right');
			el.removeClass('text-center');
			el.addClass(alignclass);
		}
		
		return false;
	});

	// create CODE
	$('.editor-menu a.code').click(function(){
		var text = global.getSelectedText();
		var html = '<code>'+text+'</code>';
		
		document.execCommand("insertHTML", false, html);
		return false;
	});
    
    // create FA
    $('.editor-menu a.icon').click(function(){
    
    	fontAwesomeDialog.show();
	  
		return false;
	});
	
	// create layout
    $('.editor-menu a.layout').click(function(){
    
    	var editor = $('#'+$(this).attr('data-target'));
    
    	layoutDialog.show(editor);
	  
		return false;
	});

	// create SYNTAX
	$('.editor-menu a.syntax').on('click dragstop', function(){

		var editor = $('#'+$(this).attr('data-target'));

		codeBlockDialog.show(editor);
		
		return false;
	});
	
	// create LINK
	$('.editor-menu a.link').click(function(){
	  
		linkDialog.show();
		
		return false;
	});

	// create LAYOUT
	$('.editor-menu a.load').click(function(){
	  
	  	var editor = $('#'+$(this).attr('data-target'));
	  
		loadLayoutDialog.show(editor); 
		
		return false;
	});

	// create PLUGINS
	$('.editor-menu a.plugins').on('click dragstop', function(){
	
		var editor = $('#'+$(this).attr('data-target'));
	  
		pluginsDialog.show(editor); 
		
		return true;
	});
 
	// update PAGE SETTINGS
	$('.editor-menu a.settings').click(function(){
	  
		pageSettingsDialog.show(); 
		
		return false;
	});

	// create P
	$('.editor-menu a.p').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'p';
		var prefix = 'paragraph';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		respond.Editor.Append(editor, 
			'<div id="'+uniqId+'" class="p" data-id="'+uniqId+'" data-cssclass="">' +
			respond.defaults.elementMenu + 
			'<div contentEditable="true"></div>' +
			'</div>'
		);
		
		// setup paste filter
		$('#'+uniqId+' [contentEditable=true]').paste();
		
		return true;
	});

	 // create TABLE
	$('.editor-menu a.table').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'table';
		var prefix = 'table';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		respond.Editor.Append(editor, 
		  '<div id="'+uniqId+'" class="table" data-id="'+uniqId+'" data-cssclass="">'+
		  respond.defaults.elementMenuTable + 
		  '<table class="table table-striped table-bordered col-2" data-columns="2">'+
		  '<thead><tr">'+
		  '<th contentEditable="true" class="col-1"></th>'+
		  '<th contentEditable="true" class="col-2"></th>'+
		  '</tr></thead>'+
		  '<tbody><tr class="row-1">'+
		  '<td contentEditable="true" class="col-1"></td>'+
		  '<td contentEditable="true" class="col-2"></td>'+
		  '</tr></tbody>'+
		  '</table>'+
		  '</div>'
		);
		
		// setup paste filter
		$('#'+uniqId+' [contentEditable=true]').paste();
		
		return true;
	});
	
	// create BLOCKQUOTE
	$('.editor-menu a.q').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'q';
		var prefix = 'quote';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		respond.Editor.Append(editor, 
		  '<div id="'+uniqId+'" class="q" data-id="'+uniqId+'" data-cssclass=""><i class="in-textbox fa fa-quote-left"></i>'+
		  respond.defaults.elementMenu + 
		  '<div contentEditable="true"></div>' +
		  '</div>'
		);
		
		// setup paste filter
		$('#'+uniqId+' [contentEditable=true]').paste();
		
		return true;
	});
	
	// create HTML BLOCK
	$('.editor-menu a.html').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		
		htmlDialog.show(editor, 'HTML block', 'html', 'add', -1);
		
		return true;
	});
	
	// create YOUTUBE
	$('.editor-menu a.youtube').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'youtube';
		var prefix = 'youtube';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		respond.Editor.Append(editor, 
			'<div id="'+uniqId+'" class="youtube">' +
			respond.defaults.elementMenuNoConfig + 
			'<textarea placeholder="Paste HTML embed code here"></textarea></div>');
		
		return true;
	});
	
	// import LAYOUT
	$('.editor-menu a.layout').click(function(){
		var editor = $('#'+$(this).attr('data-target'));
		
		if($(this).hasClass('visible')){
			$(editor).find('span.block-actions').css('display', 'none');
			$(this).removeClass('visible');
			$(editor).removeClass('advanced');
		}
		else{
			$(editor).find('span.block-actions').css('display', 'block');
			$(this).addClass('visible');
			$(editor).addClass('advanced');
		}
		
		return false;
	});
	
	// create UL
	$('.editor-menu a.ul').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'ul';
		var prefix = 'ul';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		respond.Editor.Append(editor, 
		  '<div id="'+uniqId+'" class="ul" data-id="'+uniqId+'" data-cssclass="">' +
		  respond.defaults.elementMenu + 
		  '<div contentEditable="true"></div>' +
		  '</div>');
		
		// setup paste filter
		$('#'+uniqId+' [contentEditable=true]').paste();
		
		return true;
	});
	
	// create OL
	$('.editor-menu a.ol').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'ol';
		var prefix = 'ol';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		respond.Editor.Append(editor, 
		  '<div id="'+uniqId+'" class="ol" data-id="'+uniqId+'" data-cssclass="">' +
		  respond.defaults.elementMenu + 
		  '<div contentEditable="true"></div>' +
		  '</div>');
		
		// setup paste filter
		$('#'+uniqId+' [contentEditable=true]').paste();
		
		return true;
	});
	
	// create HR
	$('.editor-menu a.hr').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'hr';
		var prefix = 'hr';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		respond.Editor.Append(editor, 
			 '<div id="'+uniqId+'" class="hr" data-id="'+uniqId+'" data-cssclass="">'+
			 respond.defaults.elementMenuNoConfig + 
			 '<div class="line"></div>' +
			 '</div>');
		
		return true;
	});
	
	// create IMAGE
	$('.editor-menu a.img').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
	  
		imagesDialog.show(editor, 'image', -1);
		
		return true;
	});
	
	// create SLIDESHOW
	$('.editor-menu a.slideshow').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'slideshow';
		var prefix = 'imagegroup';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		slideshowDialog.show(editor, uniqId);
		
		return true;
	});
	
	// create SECURE
	$('.editor-menu a.secure').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'secure';
		var prefix = 'secure';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		secureDialog.show(editor, uniqId);
		
		return true;
	});

	// create MAP
	$('.editor-menu a.map').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'map';
		var prefix = 'map';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		respond.Editor.Append(editor, 
			'<div id="'+uniqId+'" data-id="'+uniqId+'" data-cssclass="" class="map" data-zoom="auto">' +
			respond.defaults.elementMenu + 
			'<div><i class="in-textbox fa fa-map-marker"></i><input type="text" value="" spellcheck="false" maxlength="512" placeholder="1234 Main Street, Some City, LA 90210"></div></div>'
		);
		
		return true;
	});
	
	// create TWITTER
	$('.editor-menu a.twitter').on('click dragstop', function(){
		htmlDialog.show('Twitter Widget', 'twitter', 'add', -1);
		
		return true;
	});
	
	// create LIKE
	$('.editor-menu a.like').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'like';
		var prefix = 'like';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		respond.Editor.Append(editor, 
			'<div id="'+uniqId+'" class="like">' +
			respond.defaults.elementMenu + 
			'<div class="title"><i class="fa fa-facebook"></i> Facebook Like</div></div>'
			);
		
		return true;
	});

	// create COMMENTS
	$('.editor-menu a.comments').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'comments';
		var prefix = 'comments';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		respond.Editor.Append(editor, 
			'<div id="'+uniqId+'" class="comments">' +
			respond.defaults.elementMenuNoConfig + 
			'<div class="title"><i class="fa fa-facebook"></i> Facebook Comments</div></div>'
			);
		
		return true;
	});
	
	// create FILES
	$('.editor-menu a.file').on('click dragstop', function(){
	
		var editor = $('#'+$(this).attr('data-target'));
	
		filesDialog.show(editor);
		return true;
	});
	
	// create FORM
	$('.editor-menu a.form').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'form';
		var prefix = 'form';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		respond.Editor.Append(editor, 
			'<div id="'+uniqId+'" class="form" data-type="default" data-action="" data-success="" data-error="" data-submit="">' +
			respond.defaults.elementMenuForm + 
			'<div class="field-list"></div><a class="add-field"><i class="fa fa-check"></i> Add Field</a></div>'
		);
		
		// set up sorting on form elements
		$('.form div').sortable({handle: '.move', placeholder: 'editor-highlight', opacity:'0.6', axis:'y'});
		
		return true;
	});
	
	// create SHELF
	$('.editor-menu a.shelf').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'shelf';
		var prefix = 'shelf';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		respond.Editor.Append(editor, 
			'<div id="'+uniqId+'" class="shelf">' +
			respond.defaults.elementMenuNoConfig + 
			'<div class="shelf-items"></div>' + 
			'<a class="add-sku"><i class="fa fa-tag"></i> Add SKU</a></div>'
		);
		
		// set up sorting on shelf items
		$('.shelf-items').sortable({handle: '.move', placeholder: 'editor-highlight', opacity:'0.6', axis:'y'});
		
		return true;
	});
	
	// create H1
	$('.editor-menu a.h1').on('click dragstop', function(){
	
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'h1';
		var prefix = 'h1';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		respond.Editor.Append(editor, 
			'<div id="'+uniqId+'" class="h1" data-id="'+uniqId+'" data-cssclass="">' +
			respond.defaults.elementMenu + 
			'<div contentEditable="true"></div></div>'
		);
		
		// setup paste filter
		$('#'+uniqId+' [contentEditable=true]').paste();
		
		return true;
	});
	
	// create H2
	$('.editor-menu a.h2').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'h2';
		var prefix = 'h2';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		respond.Editor.Append(editor, 
		  '<div id="'+uniqId+'" class="h2" data-id="'+uniqId+'" data-cssclass="">' +
			respond.defaults.elementMenu + 
			'<div contentEditable="true"></div></div>'
		);
		
		// setup paste filter
		$('#'+uniqId+' [contentEditable=true]').paste();
		
		return true;
	});
	
	// create H3
	$('.editor-menu a.h3').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'h3';
		var prefix = 'h3';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		respond.Editor.Append(editor, 
		  '<div id="'+uniqId+'" class="h3" data-id="'+uniqId+'" data-cssclass="">'+
			respond.defaults.elementMenu + 
			'<div contentEditable="true"></div></div>'
		);
		
		// setup paste filter
		$('#'+uniqId+' [contentEditable=true]').paste();
		
		return true;
	});
	
	// create H4
	$('.editor-menu a.h4').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'h4';
		var prefix = 'h4';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		respond.Editor.Append(editor, 
		  '<div id="'+uniqId+'" class="h4" data-id="'+uniqId+'" data-cssclass="">'+
			respond.defaults.elementMenu + 
			'<div contentEditable="true"></div></div>'
		);
		
		// setup paste filter
		$('#'+uniqId+' [contentEditable=true]').paste();
		
		return true;
	});
	
	// create H5
	$('.editor-menu a.h5').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'h5';
		var prefix = 'h5';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		respond.Editor.Append(editor, 
		  '<div id="'+uniqId+'" class="h5" data-id="'+uniqId+'" data-cssclass="">'+
			respond.defaults.elementMenu + 
			'<div contentEditable="true"></div></div>'
		);
		
		// setup paste filter
		$('#'+uniqId+' [contentEditable=true]').paste();
		
		return true;
	});
	
	// create PREVIEW
	$('.editor-menu a.preview').click(function(){
		var editor = $('#'+$(this).attr('data-target'));
		
		contentModel.preview();
		
		return false;
	});
	
	// create COLS
	$('.cols5050').click(function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'block';
		var prefix = 'block';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		$(editor).append(
			'<div id="'+uniqId+'" class="block row" data-nested="not-nested" data-containerid=""  data-containercssclass="">' +
			'<div class="col col-md-6 sortable">' +
			'</div>' +
			'<div class="col col-md-6 sortable">' +
			'</div>' +
			'<span class="block-actions"><span>#'+ uniqId + ' .block.row</span>' + 
			respond.defaults.blockMenu + '</span></div>'
		);
		
		$('.block-actions').show();
		
		// reset respond.currnode (new content should be added to the end)
		respond.currnode = null;
		
		// re-init sortable
		setupSortable();
		
		return false;
	});

	// create COLS 7/3
	$('.cols73').click(function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'block';
		var prefix = 'block';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		var html = '<div id="'+uniqId+'" class="block row" data-nested="not-nested" data-containerid=""  data-containercssclass="">' +
						'<div class="col col-md-9 sortable">' +
						'</div>' +
						'<div class="col col-md-3 sortable">' +
						'</div>' +
						'<span class="block-actions"><span>#'+ uniqId + ' .block.row</span>' +
						respond.defaults.blockMenu + '</span></div>';
		
		$(editor).append(
			html
		);
		
		$('.block-actions').show();
		
		// reset respond.currnode (new content should be added to the end)
		respond.currnode = null;
		
		// re-init sortable
		setupSortable();
		
		return false;
	});
	
	// create COLS 3/7
	$('.cols37').click(function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'block';
		var prefix = 'block';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		var html = '<div id="'+uniqId+'" class="block row" data-nested="not-nested" data-containerid=""  data-containercssclass="">' +
						'<div class="col col-md-3 sortable">' +
						'</div>' +
						'<div class="col col-md-9 sortable">' +
						'</div>' +
						'<span class="block-actions"><span>#'+ uniqId + ' .block.row</span>' +
						respond.defaults.blockMenu + '</span></div>';
		
		$(editor).append(
		html
		);
		
		$('.block-actions').show();
		
		// reset respond.currnode (new content should be added to the end)
		respond.currnode = null;
		
		// re-init sortable
		setupSortable();
		
		return false;
	});

	// create COLS 3/3/3
	$('.cols333').click(function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'block';
		var prefix = 'block';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		var html = '<div id="'+uniqId+'" class="block row" data-nested="not-nested" data-containerid=""  data-containercssclass="">' +
						'<div class="col col-md-4 sortable">' +
						'</div>' +
						'<div class="col col-md-4 sortable">' +
						'</div>' +
						'<div class="col col-md-4 sortable">' +
						'</div>' +
						'<span class="block-actions"><span>#'+ uniqId + ' .block.row</span>' +
						respond.defaults.blockMenu + '</span></div>';
		
		$(editor).append(
			html
		);
		
		$('.block-actions').show();
		
		// reset respond.currnode (new content should be added to the end)
		respond.currnode = null;
		
		// re-init sortable
		setupSortable();
		
		return false;
	});
	
	// create COLS 4*25
	$('.cols425').click(function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'block';
		var prefix = 'block';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		var html = '<div id="'+uniqId+'" class="block row" data-nested="not-nested" data-containerid=""  data-containercssclass="">' +
						'<div class="col col-md-3 sortable">' +
						'</div>' +
						'<div class="col col-md-3 sortable">' +
						'</div>' +
						'<div class="col col-md-3 sortable">' +
						'</div>' +
						'<div class="col col-md-3 sortable">' +
						'</div>' +
						'<span class="block-actions"><span>#'+ uniqId + ' .block.row</span>' +
						respond.defaults.blockMenu + '</span></div>'; 
		
		$(editor).append(
			html
		);
		
		$('.block-actions').show();
		
		// reset respond.currnode (new content should be added to the end)
		respond.currnode = null;
		
		// re-init sortable
		setupSortable();
		
		return false;
	});
	
	// create SINGLE COL
	$('.single').click(function(){
		var editor = $('#'+$(this).attr('data-target'));
		var className = 'block';
		var prefix = 'block';
		
		var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
		
		$(editor).append(
		'<div id="'+uniqId+'" class="block row" data-nested="not-nested" data-containerid=""  data-containercssclass="">' +
		'<div class="col col-md-12 sortable"></div>' +
		 '<span class="block-actions"><span>#'+ uniqId + ' .block.row</span>' +
		 respond.defaults.blockMenu + '</span></div>'
		);
		
		$('.block-actions').show();
		
		// reset respond.currnode (new content should be added to the end)
		respond.currnode = null;
		
		// re-init sortable
		setupSortable();
		
		return false;
	});
	
	// create LIST
	$('.editor-menu a.list').on('click dragstop', function(){
		var editor = $('#'+$(this).attr('data-target'));
	
		listDialog.show(editor, 'add', -1);
		return false;
	});
	
	// create FEATURED
	$('.editor-menu a.featured').on('click dragstop', function(){
	
		var editor = $('#'+$(this).attr('data-target'));
	
		featuredDialog.show(editor);
		return true;
	});

		
}

// sets up persistent events for the ediotr
respond.Editor.SetupPersistentEvents = function(el){
	
	// setup context
	var context = $(el);
	
	// make blocks sortable
	setupSortable();
	
	// set respond.currnode when div is focused
	$(el).on('focusin', '.sortable div', function(){
		respond.currnode = this;
		
		var className = $(this).prop('class').trim();
		
		if(className != ''){
			$('.editor-actions .'+className).addClass('active');
		}
		
		console.log('.editor-actions .'+className);
	});
	
	$(el).on('focusout', '.sortable div', function(){
		$('.editor-actions a').removeClass('active');
	});
	
	// handle remove-block
	$(el).on('click', '.remove-block', function(){
		$(this.parentNode.parentNode.parentNode).remove();
		
		$(context).find('.up').removeClass('disabled');
		$(context).find('.up').first().addClass('disabled');

		$(context).find('.down').removeClass('disabled');
		$(context).find('.down').last().addClass('disabled');
		
		return false;
	});
	
	// handle expand-menu
	$(el).on('click', '.expand-menu', function(){
		$(this).toggleClass('active');
		$(this).next().toggleClass('active');
	});
	
	// add field
	$(el).on('click', '.add-field', function(){
		var editor = $('#'+$(this).parents('.editor').attr('id'));
		
		var id = $(this.parentNode).attr('id');
		fieldDialog.show(editor, id);
		return false;
	});
	
	// add sku
	$(el).on('click', '.add-sku', function(){
		var id = $(this.parentNode).attr('id');
		skuDialog.show(id);
		return false;
	});
	
	// set respond.currrow when the th or td is focused
	$(el).on('focusin', 'th, td', function(){
		respond.currrow = this.parentNode;
		$('tr').removeClass('curr-row');
		$(this.parentNode).addClass('curr-row');
	});
	
	// set respond.currnode when textarea is focused
	$(el).on('focusin', '.sortable textarea, .sortable input', function(){
		if(!$(this.parentNode).hasClass('field') && !$(this.parentNode).hasClass('caption')){
			respond.currnode = this.parentNode;
		}
	});
	
	// add row
	$(el).on('click', '.add-row', function(){
		var table = $(this).parent().parent().find('table');
		var cols = $(table).attr('data-columns');

		var html = '<tr>';

		for(var x=0; x<cols; x++){
			html += '<td contentEditable="true"></td>';
		}

		html += '</tr>';
		
		if(respond.currrow){
			$(respond.currrow).after(html);
		}
		else{
			$(table).find('tbody').append(html);
		}

		return false;
	});
	
	// remove row
	$(el).on('click', '.remove-row', function(){
		if(respond.currrow){
			$(respond.currrow).remove();
		}
		
		return false;
	});

	// add column
	$(el).on('click', '.add-column', function(){
		var table = $(this).parent().parent().find('table');
		var cols = parseInt($(table).attr('data-columns'));
		var trs = table.find('tr');

		for(var x=0; x<trs.length; x++){

			if(trs[x].parentNode.nodeName=='THEAD'){
				$(trs[x]).append('<th contentEditable="true"></th>');
			}
			else{
				$(trs[x]).append('<td contentEditable="true"></td>');
			}
		}

		var n_cols = cols + 1;

		table.removeClass('col-'+cols);
		table.addClass('col-'+(n_cols));
		table.attr('data-columns', (n_cols));

		return false;
	});
	
	// caption focus (for images)
	$(el).on('focus', '.caption input', function(){
		$(this.parentNode.parentNode).addClass('edit');
	});

	// caption blur (for images)
	$(el).on('blur', '.caption input', function(){
		var caption = $(this).val();
		$(this.parentNode.parentNode).find('img').attr('title', caption);
		$(this.parentNode.parentNode).removeClass('edit');
	});

	// image click
	$(el).on('click', '.img', function(){
		var moduleId = this.parentNode.id;
		var src = $('div#'+moduleId+' img').attr('src');
		var uniqueName = $('div#'+moduleId+' img').attr('id');

		aviaryDialog.show(uniqueName, src);

		return false;
	});
	
	// remove click
	$(el).on('click', '.remove', function(){
		$(this.parentNode.parentNode).remove();
		context.find('a.'+this.parentNode.className).show();
		respond.currnode = null;
		return false;
	}); 

	// remove-image click
	$(el).on('click', '.remove-image', function(){
		$(this.parentNode).remove();
		context.find('a.'+this.parentNode.className).show();
		respond.currnode = null;
		return false;
	}); 

	// config click
	$(el).on('click', '.config', function(){
		$(this.parentNode.parentNode).find('.expand-menu').toggleClass('active');
		$(this.parentNode.parentNode).find('.element-menu').toggleClass('active');

		var moduleId = $(this.parentNode.parentNode).attr('id');

		var id = $(this.parentNode.parentNode).attr('data-id');
		var cssClass = $(this.parentNode.parentNode).attr('data-cssclass');
		
		elementConfigDialog.show(moduleId, id, cssClass);

		respond.currnode = null;
		return false;
	}); 

	// config block click
	$(el).on('click', '.config-block', function(){
		var blockId = $(this.parentNode.parentNode.parentNode).attr('id');
		var id = $(this.parentNode.parentNode.parentNode).attr('id');
		var cssClass = $(this.parentNode.parentNode.parentNode).attr('data-cssclass');
		var nested = $(this.parentNode.parentNode.parentNode).attr('data-nested');
		var containerId = $(this.parentNode.parentNode.parentNode).attr('data-containerid');
		var containerCssClass = $(this.parentNode.parentNode.parentNode).attr('data-containercssclass');
		
		blockConfigDialog.show(blockId, id, cssClass, nested, containerId, containerCssClass);

		respond.currnode = null;
		return false;
	}); 

	// remove field click
	$(el).on('click', '.remove-field', function(){
		$(this.parentNode).remove();
		return false;
	});
	
	// add image click
	$(el).on('click', '.add-image', function(){
		var editor = $('#'+$(this).parents('.editor').attr('id'));
	
		var d = this.parentNode.parentNode;
		var id = $(d).attr('id');

		imagesDialog.show(editor, 'slideshow', id);
	});
	
	// config list click   
	$(el).on('click', '.config-list', function(){
		var editor = $('#'+$(this).parents('.editor').attr('id'));
		var id=$(this.parentNode.parentNode).attr('id');
		listDialog.show(editor, 'edit', id);
		return false;
	});
	
	// config html click
	$(el).on('click', '.config-html', function(){
		var editor = $('#'+$(this).parents('.editor').attr('id'));
		
		var id=$(this.parentNode.parentNode).attr('id');
		var desc=$(this.parentNode.parentNode).attr('data-desc');
		var type=$(this.parentNode.parentNode).attr('data-type');
		
		htmlDialog.show(editor, desc, type, 'edit', id);
		return false;
	});
	
	// config html click
	$(el).on('click', '.config-field', function(){
		var editor = $('#'+$(this).parents('.editor').attr('id'));
		
		var container = $(this).parents('.field-container').get(0);
		
		fieldDialog.edit(container);
		return false;
	});

	// config plugin click
	$(el).on('click', '.config-plugin', function(){
		var id=$(this.parentNode.parentNode).attr('id');
		var type=$(this.parentNode.parentNode).attr('data-type');
		configPluginsDialog.show(id, type);
		return false;
	});
	
	// config form click
	$(el).on('click', '.config-form', function(){
		var id=$(this.parentNode.parentNode).attr('id');
		formDialog.show(id);
		return false;
	});

	// handle html div click
	$(el).on('click', '.html div', function(){
		$(this).parent().toggleClass('active');	
	});
		
	// handle switch
	$(el).on('click', '.switch', function(){
		$(this.parentNode).find('a').removeClass('selected');
		$(this).addClass('selected');
		return false;
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
		var blockid = respond.Editor.GenerateUniqId(editor, 'block', 'block');
	
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
			var newid = respond.Editor.GenerateUniqId(editor, cssClass, cssClass, offset);
			
			// set new id
			$(blocks[x]).attr('id', newid);
			
			//alert('id='+$(blocks[x]).attr('id'));
			
			var dataid = $(blocks[x]).attr('data-id');
			
			if (typeof dataid !== 'undefined' && dataid !== false) {
			    $(blocks[x]).attr('data-id', newid);
			}
			
		}
		
		// insert clone
		$(clone).insertAfter(curr);
		
		return false;
	});
	
	// handle key events
	$(el).on('keydown', '[contentEditable=true]', function(){
	
		var editor = $(context).get(0);
		
		var el = $(this).parents('div')[0];
	 
		// ENTER KEY events
		if(event.keyCode == '13'){
		
			if($(el).hasClass('ul') || $(el).hasClass('ol')){
				$(this).after(
					'<div contentEditable="true"></div>'
				);
			
				$(this.nextSibling).focus();
			}
			else if($(el).hasClass('table')){
			
				// add row
				var table = $(el).find('table');
				var cols = $(table).attr('data-columns');
		
				var html = '<tr>';
		
				for(var x=0; x<cols; x++){
					html += '<td contentEditable="true"></td>';
				}
		
				html += '</tr>';
				
				// for headers (TH) prepend the row to the tbody
				if($(this).get(0).nodeName == 'TH'){
				
					$(el).find('tbody').prepend(html);
					$(el).find('tbody').find('[contentEditable=true]').get(0).focus();
				}
				else{ // for non-headers, insert the row after the current row
					var tr = $(this).parents('tr')[0];
					
					$(tr).after(html);
			
					$(tr).next().find('[contentEditable=true]').get(0).focus();
				}
			}
			else{
				var className = 'p';
				var prefix = 'paragraph';
		
				var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
			
				$(el).after(
					'<div id="'+uniqId+'" class="p">' +
					respond.defaults.elementMenu + 
					'<div contentEditable="true"></div></div>'
					);
			
				$(this.parentNode.nextSibling).find('div').focus();
			}
			
			$('[contentEditable=true]').paste();
		
			event.preventDefault();
			return false;
		  }
		  else if(event.keyCode == '8'){
				var h = $(this).html().trim();
				h = global.replaceAll(h, '<br>', '');
				
				if(h==''){
				
					if($(el).hasClass('table')){
					
						var previous = $(this.parentNode.previousSibling);
					
						$(this.parentNode).remove();
						
						if(previous){
							$(previous).find('td')[0].focus();
						}
						
						return false;
						
					}
				
					if($(el).hasClass('ul') || $(el).hasClass('ol')){
					
						var parent = $(this.parentNode);
						var divs = $(this.parentNode).find('div');
						
						if(divs.length>1){
						$(this).remove();
						
						var last = parent.find('div:last');
						
						last.focus();
						last.select();
						
						return false;
					}
					
					
				}
			}
		
		}
	});
	
	// setup sorting on .shelf-items, forms, slideshows
	$('.shelf-items').sortable({handle: '.move', placeholder: 'editor-highlight', opacity:'0.6', axis:'y'});
	$('.form div').sortable({handle: '.move', placeholder: 'editor-highlight', opacity:'0.6', axis:'y'});
	$('.slideshow div').sortable({handle:'img', items:'span.image', placeholder: 'editor-highlight', opacity:'0.6', axis:'x'});
	
	// setup paste
	$('[contentEditable=true]').paste();
}

// appends content to the editor
respond.Editor.Append = function(el, html){ 

	// get dom element if need be
	if(el.jquery){
		el = el.get(0);
	}
	
	// if dragged placeholder exists
	if($('#editor-placeholder').length > 0){
		var node = $('#editor-placeholder');
		
		var temp = $(node).after(html).get(0);
		
		var added = $(temp).next();
		
		$('[contentEditable=true], input, textarea').blur();
		$(added).find('[contentEditable=true], input, textarea').first().focus();
		
		$(node).remove();
		
		respond.currnode = $(added);
	}
	else{
		var blocks = $(el).find('div.block');
		var length = blocks.length;
		
		// appends it toe currnode (if set) or the last block if not set
		if(respond.currnode){
		
			var temp = $(respond.currnode).after(html).get(0);
			
			var added = $(temp).next();
			
			$('[contentEditable=true], input, textarea').blur();
			$(added).find('[contentEditable=true], input, textarea').first().focus();
			
			respond.currnode = $(added);
		
		}
		else if(length>0){  
			var curr = blocks[length-1]; // get last block
			
			var cols = $(curr).find('div.col');
			
			if(cols.length>0){
				curr = $(cols[0]);
				respond.currnode = $(html).appendTo(curr);
			}
			
			// arrh! focus!
			$(curr).find('[contentEditable=true], input, textarea').focus();
		}
	}

}

// gets the current description for the content in the editor
respond.Editor.GetDescription = function(el){ 

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
respond.Editor.GetPrimaryImage = function(el){ 

	// get dom element if need be
	if(el.jquery){
		el = el.get(0);
	}
	
	// get the first image
	var imgs = $(el).find('div.block .img img');
	
	if(imgs.length==0){
		imgs = $(el).find('div.block span.image img');
	}
	
	var image = '';
	
	if(imgs && imgs.length>0){
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

// gets the content from the editor
respond.Editor.GetContent = function(el){ 

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
		
			// generate P
			if($(divs[x]).hasClass('p')){
		  		var id = $(divs[x]).attr('data-id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  		var cssclass = $(divs[x]).attr('data-cssclass');
		  		if(cssclass==undefined || cssclass=='')cssclass = '';
		  
		  		var h = jQuery.trim($(divs[x]).find('[contentEditable=true]').html());
		  		
				newhtml += '<p id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '>' + h + '</p>';
			}
	
			// generate TABLE
			if($(divs[x]).hasClass('table')){
		  		var id = $(divs[x]).attr('data-id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		 
		 		var table = $(divs[x]).find('table');
		 		var cols = $(table).attr('data-columns');
		 		var cssclass = $(table).attr('class');
	
				newhtml += '<table id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += ' data-columns="'+cols+'"';
				newhtml += '>';
	
				newhtml+='<thead>';
	
				var tr = $(table).find('thead tr');		
	
				newhtml += '<tr>';
				var ths = $(tr).find('th');
	
				for(var d=0; d<ths.length; d++){
					newhtml += '<th class="col-'+(d+1)+'">'+$(ths[d]).html()+'</th>';
				}
				newhtml += '</tr>';		
	
				newhtml+='</thead>';
				newhtml+='<tbody>';
	
				var trs = $(table).find('tbody tr');
	
				for(var t=0; t<trs.length; t++){
					newhtml += '<tr class="row-'+(t+1)+'">';
					var tds = $(trs[t]).find('td');
	
					for(var d=0; d<tds.length; d++){
						newhtml += '<td class="col-'+(d+1)+'">'+$(tds[d]).html()+'</td>';
					}
					newhtml += '</tr>';
				}
	
				newhtml += '</tbody></table>';
			}
		
			// generate BLOCKQUOTE
			if($(divs[x]).hasClass('q')){
		  		var id = $(divs[x]).attr('data-id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  		var cssclass = $(divs[x]).attr('data-cssclass');
		  		if(cssclass==undefined || cssclass=='')cssclass = '';
		  
		  		var h = jQuery.trim($(divs[x]).find('[contentEditable=true]').html());
				newhtml += '<blockquote id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '>' + h + '</blockquote>';
			}
		
			// genearate HTML
			if($(divs[x]).hasClass('html')){
				var id = $(divs[x]).attr('data-id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				
				var desc = $(divs[x]).attr('data-desc');
				if(desc==undefined || desc=='')desc='HTML block';
				
				var type = $(divs[x]).attr('data-type');
				if(type==undefined || type=='')type='html';
	
				var h = jQuery.trim($(divs[x]).find('pre.non-pretty').html());
				
				newhtml += '<module id="'+id+'" name="html" desc="'+desc+'" type="'+type+'">' + h + '</module>';
			}
		
			// generate PLUGIN
			if($(divs[x]).hasClass('plugin')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
	
				var data = $(divs[x]).data();
				var attrs = '';
	
				for(var i in data){
					if(i != 'sortableItem'){
						attrs += i + '="' + data[i] + '" ';
					}
				}
	
				var html = '<plugin id="'+id+'" ' + attrs + '></plugin>';
				newhtml += html;
			}
		
			// generate YOUTUBE
			if($(divs[x]).hasClass('youtube')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				
				var h = jQuery.trim($(divs[x]).find('textarea').val());
				h = (h.indexOf('div class="video-container"')==-1 ? '<div class="video-container">' + h + '</div>' : h);
				newhtml += '<module id="'+id+'" name="youtube">' + h + '</module>';
			}
			
			// generate VIMEO
			if($(divs[x]).hasClass('vimeo')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				
				var h = jQuery.trim($(divs[x]).find('textarea').val());
				h = (h.indexOf('div class="video-container"')==-1 ? '<div class="video-container">' + h + '</div>' : h);
				newhtml += '<module id="'+id+'" name="vimeo">' + h + '</module>';
			}
		
			// generate UL
			if($(divs[x]).hasClass('ul')){
				var id = $(divs[x]).attr('data-id');
			  	if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			  	var cssclass = $(divs[x]).attr('data-cssclass');
			  	if(cssclass==undefined || cssclass=='')cssclass = '';
			  
			  	var lis = $(divs[x]).find('[contentEditable=true]');
			  	newhtml += '<ul id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
			  	newhtml += '>';
			  
			  	for(var y=0; y<lis.length; y++){
					newhtml += '<li>' + jQuery.trim($(lis[y]).html()) + '</li>';
			  	}
			  
			  	newhtml += '</ul>';
			}
			
			// generate OL
			if($(divs[x]).hasClass('ol')){
				var id = $(divs[x]).attr('data-id');
			  	if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			  	var cssclass = $(divs[x]).attr('data-cssclass');
			  	if(cssclass==undefined || cssclass=='')cssclass = '';
			  
			  	var lis = $(divs[x]).find('[contentEditable=true]');
			  	newhtml += '<ol id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
			  	newhtml += '>';
			  
			  	for(var y=0; y<lis.length; y++){
					newhtml += '<li>' + jQuery.trim($(lis[y]).html()) + '</li>';
			  	}
			  
			  	newhtml += '</ol>';
			}
		
			// generate H1
			if($(divs[x]).hasClass('h1')){
				var id = $(divs[x]).attr('data-id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				var cssclass = $(divs[x]).attr('data-cssclass');
				if(cssclass==undefined || cssclass=='')cssclass = '';
				
				var h = jQuery.trim($(divs[x]).find('[contentEditable=true]').html());
				newhtml += '<h1 id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '>' + h + '</h1>';
			}
		
			// generate H2
			if($(divs[x]).hasClass('h2')){
		  		var id = $(divs[x]).attr('data-id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  		var cssclass = $(divs[x]).attr('data-cssclass');
				if(cssclass==undefined || cssclass=='')cssclass = '';
		  
		  		var h = jQuery.trim($(divs[x]).find('[contentEditable=true]').html());
		  		newhtml += '<h2 id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '>' + h + '</h2>';
	  		}
		
			// generate H3
			if($(divs[x]).hasClass('h3')){
				var id = $(divs[x]).attr('data-id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				var cssclass = $(divs[x]).attr('data-cssclass');
				if(cssclass==undefined || cssclass=='')cssclass = '';
	
				var h = jQuery.trim($(divs[x]).find('[contentEditable=true]').html());
				newhtml += '<h3 id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '>' + h + '</h3>';
			}
			
			// generate H4
			if($(divs[x]).hasClass('h4')){
				var id = $(divs[x]).attr('data-id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				var cssclass = $(divs[x]).attr('data-cssclass');
				if(cssclass==undefined || cssclass=='')cssclass = '';
	
				var h = jQuery.trim($(divs[x]).find('[contentEditable=true]').html());
				newhtml += '<h4 id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '>' + h + '</h3>';
			}
			
			// generate H5
			if($(divs[x]).hasClass('h5')){
				var id = $(divs[x]).attr('data-id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				var cssclass = $(divs[x]).attr('data-cssclass');
				if(cssclass==undefined || cssclass=='')cssclass = '';
	
				var h = jQuery.trim($(divs[x]).find('[contentEditable=true]').html());
				newhtml += '<h5 id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '>' + h + '</h5>';
			}
	
			// generate SYNTAX
			if($(divs[x]).hasClass('syntax')){
				var id = $(divs[x]).attr('data-id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
	
				var h = jQuery.trim($(divs[x]).find('pre.non-pretty').html());
	
				newhtml += '<pre id="'+id+'" class="prettyprint linenums pre-scrollable">' + h + '</pre>';
			}
		
			// generate images
			if($(divs[x]).hasClass('i')){
				var id = $(divs[x]).attr('data-id');
				var cssclass = $.trim($(divs[x]).attr('data-cssclass'));
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				
				// add a space to separate class
				if(cssclass != ''){
					cssclass = ' ' + cssclass;
				}
	
				var dir = 'o';
				if($(divs[x]).hasClass('right')){
					dir = 'r';
				}
				else if($(divs[x]).hasClass('left')){
					dir = 'l';
				}
		  
				var i_id = $(divs[x]).find('img').attr('id');
				var src = $(divs[x]).find('img').attr('src');
				var url = $(divs[x]).find('img').attr('data-url');
				var h = jQuery.trim($(divs[x]).find('div.content').html());
				
		  		newhtml += '<div id="'+id+'" class="'+dir+'-image'+cssclass+'">';
		  		if(url!=undefined){
					newhtml += '<a href="'+url+'"';
					newhtml += '>';
		  		}
		  		newhtml += '<img id="'+i_id+'" src="'+src+'">';
		  		if(url!=undefined)newhtml += '</a>';
		  		if(dir=='o'){
					newhtml += '</div>';
		  		}
		  		else{
					newhtml += '<p>'+h+'</p></div>';
		  		}
	   
			}	
		
			// generate MODULES
			if($(divs[x]).hasClass('slideshow')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
	
				// slideshow is the default
				var display = $(divs[x]).attr('data-display');
				if(display==undefined || display=='')display='slideshow';
	
				var imgs = $(divs[x]).find('span.image img');
	
				newhtml += '<module id="'+id+'" name="slideshow" display="'+display+'">';
	
				for(var y=0; y<imgs.length; y++){
					var imghtml = $('<div>').append($(imgs[y]).clone()).remove().html();
					newhtml += imghtml;
				}
	
				newhtml += '</module>';
			}
		
			// generate LIST
			if($(divs[x]).hasClass('list')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				  
				var display = $(divs[x]).attr('data-display');
				var pagetype = $(divs[x]).attr('data-pagetype');
				var type = $(divs[x]).attr('data-type');
				var label = $(divs[x]).attr('data-label');
	
				var desclength = $(divs[x]).attr('data-desclength');
				var length = $(divs[x]).attr('data-length');
				var orderby = $(divs[x]).attr('data-orderby');
				var category = $(divs[x]).attr('data-category');
				var pageresults = $(divs[x]).attr('data-pageresults');
			
				// handles specify the list by pagetype (friendlyId) or type (uniqId -> legacy)
				var typeAttr = '';
				
				if(pagetype != '' && pagetype != undefined){
					typeAttr = 'pagetype="'+pagetype+'"';
				}
				
				if(type != '' && type != undefined){
					typeAttr = 'type="'+type+'"';
				}
				
				newhtml += '<module id="'+id+'" name="list" display="'+display+'" '+typeAttr+' label="' + label + '"' +
					' desclength="'+desclength+'"' +
					' length="'+length+'"' +
					' orderby="'+orderby+'" category="'+category+'" pageresults="'+pageresults+'"' +
					'></module>';
			}
			
			// generate FEATURED
			if($(divs[x]).hasClass('featured')){
				var id = $(divs[x]).attr('id');
				  
				var pageUniqId = $(divs[x]).attr('data-pageuniqid');
				var url = $(divs[x]).attr('data-url');
				var pageName = $(divs[x]).attr('data-pagename');
				
				// handles by url or pageuniqid (legacy)
				var typeAttr = '';
				
				if(pageUniqId != '' && pageUniqId != undefined){
					typeAttr = 'pageuniqid="'+pageUniqId+'"';
				}
				
				if(url != '' && url != undefined){
					typeAttr = 'url="'+url+'"';
				}
				
				
				newhtml += '<module id="'+id+'" name="featured" '+typeAttr+' pagename="'+pageName+'"></module>';
			}
			
			// generate SECURE
			if($(divs[x]).hasClass('secure')){
				var id = $(divs[x]).attr('id');
				var type = $(divs[x]).attr('data-type');
				  
				
				newhtml += '<module id="'+id+'" name="secure" type="'+type+'"></module>';
			}
		
			// generate LIKE
			if($(divs[x]).hasClass('like')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			
				newhtml += '<module id="'+id+'" name="like"></module>';
			}
	
			// generate COMMENTS
			if($(divs[x]).hasClass('comments')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			
				newhtml += '<module id="'+id+'" name="comments"></module>';
			}
	
			// generate BLOG
			if($(divs[x]).hasClass('blog')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			
				newhtml += '<module id="'+id+'" name="blog"></module>';
			}
		
			// generate H$
			if($(divs[x]).hasClass('hr')){
		  		var id = $(divs[x]).attr('data-id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
	
				var cssclass = $(divs[x]).attr('data-cssclass');
				if(cssclass==undefined || cssclass=='')cssclass = '';
			
				newhtml += '<hr id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '></hr>';
			}
		
			// generate FORM
			if($(divs[x]).hasClass('form')){
		  		var id= $(divs[x]).attr('id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  		
		  		var type = $(divs[x]).attr('data-type');
				var action = $(divs[x]).attr('data-action');
				var successMessage = $(divs[x]).attr('data-success');
				var errorMessage = $(divs[x]).attr('data-error');
				var submitText = $(divs[x]).attr('data-submit');
				
				// set some defaults
				if(type == '' || type == undefined){
					type = 'default';
				}
				
				if(action == undefined){
					action = '';
				}
				
				if(successMessage == undefined){
					successMessage = '';
				}
				
				if(errorMessage == undefined){
					errorMessage = '';
				}
				
				if(submitText == undefined){
					submitText = '';
				}
			
		 		newhtml += '<module id="'+id+'" name="form" type="'+type+'" action="'+action+'" success="'+successMessage+'" error="'+errorMessage+'" submit="'+submitText+'">';
		  
		  		var fields = $(divs[x]).find('span.field-container');
		  
		  		for(var y=0; y<fields.length; y++){
		  			field = $(fields[y]).html();
		  			
		  			// remove closed menu
		  			field = global.replaceAll(field, '<a class="expand-menu fa fa-ellipsis-v"></a><div class="element-menu ui-sortable"><a class="config-field fa fa-cog"></a><a class="move fa fa-arrows"></a><a class="remove fa fa-minus-circle"></a></div>', '');
		  			
		  			// remove open menu
		  			field = global.replaceAll(field, '<a class="expand-menu fa fa-ellipsis-v active"></a><div class="element-menu ui-sortable active"><a class="config-field fa fa-cog"></a><a class="move fa fa-arrows"></a><a class="remove fa fa-minus-circle"></a></div>', '');
		  			
		  			// remove newly created menu
		  			field = global.replaceAll(field, '<a class="expand-menu fa fa-ellipsis-v"></a><div class="element-menu"><a class="config-field fa fa-cog"></a><a class="move fa fa-arrows"></a><a class="remove fa fa-minus-circle"></a></div>', '');
		  			
		  			// remove ui-sortable
		  			field = global.replaceAll(field, 'ui-sortable', '');
		  			
					newhtml += field;
		  		}
		  
		  		newhtml += '</module>';
			}
			
			// generate SHELF
			if($(divs[x]).hasClass('shelf')){
		  		var id= $(divs[x]).attr('id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
	
		  		var items = $(divs[x]).find('.shelf-items').html();
		  		
		  		items = global.replaceAll(items, respond.defaults.elementMenuShelf, '');
		  		
		  		items = global.replaceAll(items, '<i class="expand-menu fa fa-ellipsis-v"></i>' +
			'<div class="element-menu"><a class="config-shelf fa fa-cog"></a><a class="move fa fa-arrows"></a>' +
			'<a class="remove fa fa-minus-circle"></a></div>', '');
					
				items = global.replaceAll(items, '<i class="expand-menu fa fa-ellipsis-v active"></i>' +
			'<div class="element-menu active"><a class="config-shelf fa fa-cog"></a><a class="move fa fa-arrows"></a>' +
			'<a class="remove fa fa-minus-circle"></a></div>', '');
		  		
				items = global.replaceAll(items, ' ui-sortable', '');
		  
		 		newhtml += '<module id="'+id+'" name="shelf">' +
		 					items + 
		 					'</module>';
			}
		
			// generate MAP
			if($(divs[x]).hasClass('map')){
		  		var id = $(divs[x]).attr('data-id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  		
		  		var cssclass = $(divs[x]).attr('data-cssclass') || '';
		  
		  		var address = $(divs[x]).find('input[type=text]').val();
		  		var zoom = $(divs[x]).attr('data-zoom');
		  		
		  		if(zoom == undefined)zoom = 'auto';
		  		
		  		newhtml += '<module id="'+id+'" name="map" address="' + address + '" zoom="' + zoom + '" class="' + cssclass + '"></module>';
			}
	
			// generate FILE
			if($(divs[x]).hasClass('file')){
		  		var id = $(divs[x]).attr('id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			  
		  		var desc = $(divs[x]).find('input[type=text]').val();
		  		var file = $(divs[x]).attr('data-filename');
		  		newhtml += '<module id="'+id+'" name="file" file="'+file+'" description="'+desc+'"></module>';
			}
		
	  	}
	
	  	return newhtml;
	}
	
	var blocks = $(el).find('div.block');
	
	// walk through blocks
	for(var y=0; y<blocks.length; y++){
	  	var id = $(blocks[y]).attr('id');
	  	var cssclass = $(blocks[y]).attr('data-cssclass');
	
	  	if(cssclass==undefined || cssclass=='')cssclass = '';
	
	  	if(cssclass!=''){
	  		cssclass = ' ' + cssclass;
	  	}
	  
	  	if(id==undefined || id=='')id='block-'+y;
	  	
	  	// set nested
	  	var nested = $(blocks[y]).attr('data-nested');
	  	var containerId = $(blocks[y]).attr('data-containerid');
	  	var containerCssClass = $(blocks[y]).attr('data-containercssclass');
	  	
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
		  	html += '<div' + containerIdHtml + ' class="container' + containerClassHtml + '">';
	  	}
	  	
	  	// row HTML
	  	html += '<div id="'+id+'" class="block row' + cssclass + '" ' +
	  			'data-nested="' + nested + '" ' +
	  			'data-containerid="' + containerId + '" ' +
	  			'data-containercssclass="' + containerCssClass + '"' +
	  			'>';
	  
	  	// determine if there are columns
	  	var cols = $(blocks[y]).find('.col');
	
	  	if(cols.length==0){
			html += getBlockHtml(blocks[y]);
	  	}
	  	else{
			for(var z=0; z<cols.length; z++){
		  		var className = $(cols[z]).attr('class').replace(' sortable', '').replace(' ui-sortable', '');
		  
		  		html += '<div class="'+className+'">';
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
respond.Editor.GenerateUniqId = function(el, className, prefix, offset){

	// set a default
	if(offset === undefined || offset === null){
		offset = 0;
	}
	
	// get dom element
	if(el.jquery){
		el = el.get(0);
	}
	
	var length = $(el).find('.'+className).length + 1 + offset;
	var uniqId = respond.prefix+prefix +'-'+ length;
	
	// find a uniqId
	while($('#'+uniqId).length > 0){
		length++;
		uniqId = prefix +'-'+ length;
	}
	
	return uniqId;
}

// build the editor
respond.Editor.Build = function(el){

	// get dom element
	if(el.jquery){
		el = el.get(0);
	}

  	if(respond.debug == true){
	  	console.log('[respond.Editor] enter Build');
  	}
  	
  	// adds the editor class
  	$(el).addClass('editor');
  	
  	if(respond.debug == true){
	  	console.log('[respond.Editor] before ParseHTML');
  	}
  
	// parse HTML
	var response = respond.Editor.ParseHTML(el);
	
	if(respond.debug == true){
	  	console.log('[respond.Editor] before BuildMenu');
  	}
	
	// builds the menu
	var menu = respond.Editor.BuildMenu(el);
	
	// set menu
	$('#editor-menu').html(menu);
	
	// set HTML
  	$(el).html(response); 
  	
  	// enable tooltip
  	if(!Modernizr.touch){ 
  		$('#editor-menu a').tooltip({container: 'body', placement: 'bottom'});
  	}
  	
  	if(respond.debug == true){
	  	console.log('[respond.Editor] before SetupMenuEvents');
  	}
	
	// setup menu item events
	respond.Editor.SetupMenuEvents();
	
	if(respond.debug == true){
	  	console.log('[respond.Editor] before SetupPersistentEvents');
  	}
	
	// setup persistent events
	respond.Editor.SetupPersistentEvents(el);

}

// build the editor
respond.Editor.Refresh = function(el){

	// parse HTML
	var response = respond.Editor.ParseHTML(el);
	
	// set HTML
  	$(el).html(response);
  	
  	// re-init sortable
	setupSortable();

}