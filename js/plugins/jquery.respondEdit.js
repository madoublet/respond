currnode = null;
currrow = null;

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

// parse gettext (WIP)
function parseGettext(html){

	// remove start php tag
	html = global.replaceAll(html, '<?php print _("', '');
	
	// remove end php tag
	html = global.replaceAll(html, '"); ?>', '');
	
	// remove escaped quotes
	html = global.replaceAll(html, '/"', '"');
	
	// return html
	return html;
	
}


// editor defaults
var editorDefaults = {

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
	
	elementMenuHtml: '<a class="expand-menu fa fa-ellipsis-v"></a>' +
				'<div class="element-menu"><a class="config-html fa fa-cog"></a><a class="move fa fa-arrows"></a>' +
				'<a class="remove fa fa-minus-circle"></a></div>',
				
	elementMenuShelf: '<i class="expand-menu fa fa-ellipsis-v"></i>' +
				'<div class="element-menu"><a class="config-shelf fa fa-cog"></a><a class="move fa fa-arrows"></a>' +
				'<a class="remove fa fa-minus-circle"></a></div>',
				
	blockMenu: '<a class="expand-menu fa fa-ellipsis-v"></a>' +
			'<div class="element-menu">' + 
			'<a class="up fa fa-chevron-up"></a><a class="down fa fa-chevron-down"></a>' +
			'<a class="config-block fa fa-cog"></a>'+
			'<a class="remove-block fa fa-minus-circle"></a></div>',

	};

// editor plugin
(function($){  
	$.fn.respondEdit = function () {

		// create menu
		var menu =  '<nav class="editor-menu">' +
	                '<a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>' +
	                '<div class="editor-actions"><div>' +
					'<a class="bold fa fa-bold" title="'+t('bold_text')+'"></a>' +
					'<a class="italic fa fa-italic" title="'+t('italic_text')+'"></a>' +
					'<a class="strike fa fa-strikethrough" title="'+t('strike_text')+'"></a>' +
					'<a class="subscript fa fa-subscript" title="'+t('subscript_text')+'"></a>' +
					'<a class="superscript fa fa-superscript" title="'+t('superscript_text')+'"></a>' +
					'<a class="underline fa fa-underline" title="'+t('underline_text')+'"></a>' +
					'<a class="align-left fa fa-align-left" title="'+t('align-left_text')+'" data-align="left"></a>' +
					'<a class="align-center fa fa-align-center" title="'+t('align-center_text')+'" data-align="center"></a>' +
					'<a class="align-right fa fa-align-right" title="'+t('align-right_text')+'" data-align="right"></a>' +
					'<a class="link fa fa-link" title="'+t('addLink')+'"></a>' +
					'<a class="code fa fa-code" title="'+t('addCode')+'"></a>' +
	        		'<a class="icon fa fa-flag" title="'+t('iconfa')+'"></a>' + // WIP, coming soon
					'<a class="h1" title="'+t('addHeadline')+'">H1</a>' +
					'<a class="h2" title="'+t('addHeadline')+'">H2</a>' +
					'<a class="h3" title="'+t('addHeadline')+'">H3</a>' +
					'<a class="p" title="'+t('addParagraph')+'">P</a>' +
					'<a class="q fa fa-quote-left" title="'+t('addquote')+'"></a>' +
					'<a class="ul fa fa-list" title="'+t('addlist')+'"></a>' +
					'<a class="table fa fa-table" title="'+t('addtable')+'"></a>' +
					'<a class="hr fa fa-minus" title="'+t('addhr')+'"></a>' +
					'<a class="img fa fa-picture-o" title="'+t('addimg')+'"></span>' +
					'<a class="slideshow  fa fa-film" title="'+t('addslideshow')+'"></a>' +
					'<a class="map  fa fa-map-marker" title="'+t('addmap')+'"></a>' +
					'<a class="twitter fa fa-twitter" title="'+t('addtwitter')+'"></a>' +
					'<a class="like fa fa-facebook" title="'+t('addfacebook')+'"></a>' +
					'<a class="comments fa fa-comments" title="'+t('fa-comments')+'"></a>' +
					'<a class="youtube fa fa-video-camera" title="'+t('youtube')+'"></span>' +
					'<a class="list fa fa-bars" title="'+t('list_pages')+'"></span>' +
	                '<a class="featured fa fa-star" title="'+t('featured')+'"></a>' +
					'<a class="file fa fa-file-o" title="'+t('addFile')+'"></a>' +
					'<a class="shelf fa fa-tags" title="'+t('addSKUs')+'"></a>' +
					'<a class="form fa fa-check" title="'+t('addForm')+'"></a>' +
					'<a class="html fa fa-html5" title="'+t('addhtml')+'"></a>' + 
					'<a class="syntax fa fa-terminal" title="'+t('addSyntax')+'"></a>' +
					'<a class="plugins fa fa-cogs" title="'+t('Plugins')+'"></a>' +
					'<a class="cols fa fa-columns" title="'+t('cols55')+'"><small>50/50</small></a>' +
					'<a class="single fa fa-columns" title="'+t('cols100')+'"><small>100</small></a>' +
					'<a class="cols73 fa fa-columns" title="'+t('cols73')+'"><small>70/30</small></a>' +
					'<a class="cols37 fa fa-columns" title="'+t('cols37')+'"><small>30/70</small></a>' +
					'<a class="cols333 fa fa-columns" title="'+t('cols333')+'"><small>3/3/3</small></a>' +
					'<a class="cols425 fa fa-columns" title="'+t('cols425')+'"><small>4*25</small></a>' +
					'</div></div>' +
					'<a class="next fs-next"><i class="fa fa-chevron-right"></i></a>' +
					'<a class="previous fs-prev"><i class="fa fa-chevron-left"></i></a>' +
					'<a class="primary-action alt preview" title="'+t('preview')+'"><i class="fa fa-play-circle"></i></a>' +
					'<a class="primary-action settings" title="'+t('settings')+'"><i class="fa fa-cog"></i></a>' +
					'</nav>';
		   
	   	var editor = '';
		
		var context = this;
				
		// parse HTML, #parse
		function parseHTML(top){
	
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
						
						if(cssclass.indexOf('align-left')!=-1){
							alignclass = ' align-left';
						}
						else if(cssclass.indexOf('align-center')!=-1){
							alignclass = ' align-center';
						}
						else if(cssclass.indexOf('align-right')!=-1){
							alignclass = ' align-right';
						}
						
						var h = $(node).html();
						
						// remove gettext
						h = parseGettext(h); 
					
						response+= '<div id="'+id+'" class="p'+alignclass+'" data-id="'+id+'" data-cssclass="'+cssclass+'">' +
							editorDefaults.elementMenu +
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
			            				editorDefaults.elementMenuTable +
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
			            				editorDefaults.elementMenu +
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
									editorDefaults.elementMenu;
					
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
						
						if(cssclass.indexOf('align-left')!=-1){
							alignclass = ' align-left';
						}
						else if(cssclass.indexOf('align-center')!=-1){
							alignclass = ' align-center';
						}
						else if(cssclass.indexOf('align-right')!=-1){
							alignclass = ' align-right';
						}
					
						response+= '<div id="'+id+'" class="h1'+alignclass+'" data-id="'+id+'" data-cssclass="'+cssclass+'">'+
							editorDefaults.elementMenu +
							'<div contentEditable="true">' + $(node).html() + '</div>' +
							'</div>';
				  	}
				  
				  	// parse H4
				  	if(node.nodeName=='HR'){
						var id = $(node).attr('id');
						if(id==undefined || id=='')id='hr-'+parseInt(new Date().getTime() / 1000);
						cssclass = $(node).attr('class');
					  	if(cssclass==undefined) cssclass='';
					  	response+= '<div id="'+id+'" class="hr" data-id="'+id+'" data-cssclass="'+cssclass+'">' +
					  		editorDefaults.elementMenu +
							'<div></div>' +
							'</div>';
			
				  	}
				  
				  	// parse H2
				  	if(node.nodeName=='H2'){
						var id = $(node).attr('id');
						if(id==undefined || id=='')id='h2-'+parseInt(new Date().getTime() / 1000);
						cssclass = $(node).attr('class');
						if(cssclass==undefined) cssclass='';
						
						var alignclass = '';
						
						if(cssclass.indexOf('align-left')!=-1){
							alignclass = ' align-left';
						}
						else if(cssclass.indexOf('align-center')!=-1){
							alignclass = ' align-center';
						}
						else if(cssclass.indexOf('align-right')!=-1){
							alignclass = ' align-right';
						}
						
						response+= '<div id="'+id+'" class="h2'+alignclass+'" data-id="'+id+'" data-cssclass="'+cssclass+'">'+
							editorDefaults.elementMenu +
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
						
						if(cssclass.indexOf('align-left')!=-1){
							alignclass = ' align-left';
						}
						else if(cssclass.indexOf('align-center')!=-1){
							alignclass = ' align-center';
						}
						else if(cssclass.indexOf('align-right')!=-1){
							alignclass = ' align-right';
						}
				  
				  		response+= '<div id="'+id+'" class="h3'+alignclass+'" data-id="'+id+'" data-cssclass="'+cssclass+'">'+
				  			editorDefaults.elementMenu +
							'<div contentEditable="true">' + $(node).html() + '</div>' +
							'</div>';
				  	}
		
				  	// parse PRE
				  	if(node.nodeName=='PRE'){
						var id = $(node).attr('id');
						if(id==undefined || id=='')id='syntax-'+parseInt(new Date().getTime() / 1000);
						
						response+= '<div id="'+id+'" class="syntax" data-id="'+id+'" data-cssclass="prettyprint linenums pre-scrollable">'+
							editorDefaults.elementMenuNoConfig +
							'<pre class="prettyprint linenums pre-scrollable">' + $(node).html() + '</pre>' +
							'<pre class="non-pretty">' + $(node).html() + '</pre>' +
							'</div>';
				  	}
				  
				  	// parse DIV
				  	if(node.nodeName=='DIV'){
						var className = $(node).attr('class');
		
						if(className=='l-image'){
							className = ' left';
						}
						else if(className=='r-image'){
							className = ' right';
						}
						else if(className=='o-image'){
							className = '';
						}
		
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
											' data-id="'+id+'" data-cssclass="'+cssclass+'">' +
											editorDefaults.elementMenu;
											
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
											' data-id="'+id+'" data-cssclass="'+cssclass+'">' +
											editorDefaults.elementMenu;
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
							response+= '<div id="'+id+'" class="i"'+constraints+' data-id="'+id+'" data-cssclass="'+cssclass+'">' +
											editorDefaults.elementMenu;
							if(href==undefined){
						  		response+= '<div class="img"><img id="'+i_id+'" src="' + src + '"></div>';
							}
							else{
						  		response+= '<div class="img hasUrl"><img id="'+i_id+'" src="' + src + '" data-url="' + href + '"></div>';
							}
							response+= '</div>';
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
					        response +=  editorDefaults.elementMenuPlugin;
				      	}
				      	else{
					        response += editorDefaults.elementMenuNoConfig;
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
								var width = $(node).attr('width');  
						  	if(width==undefined || width==''){
								width = '300';
						  	}
						  	var height = $(node).attr('height'); 
						  	if(height==undefined || height==''){
								height = '200';
						  	}
						  
						  	var menu = $(context).find('a.slideshow');
						  	var imgs = $(node).find('img');
						  
						  	response+= '<div id="' + id + '" class="slideshow" data-width="'+width+'" data-height="'+height+'">' +
						  		editorDefaults.elementMenuNoConfig +
						  		'<div class="images">';
						
						  	for(var y=0; y<imgs.length; y++){
								var caption = $(imgs[y]).attr('title');
								imghtml = $('<div>').append($(imgs[y]).clone()).remove().html();
								response +='<span class="image">' + imghtml + '<span class="caption"><input type="text" value="'+caption+'" placeholder="Enter caption" maxwidth="140" class="form-control"></span><a class="remove-image fa fa-minus-circle"></a></span>';
						  	}
						
						  	response += '<button type="button" class="secondary-button add-image"><i class="fa fa-picture-o"></i></button></div></div>';
						}
		
						// parse LIKE MODULE
						if(name=='like'){
							var id = $(node).attr('id');
							if(id==undefined || id=='')id='f-'+parseInt(new Date().getTime() / 1000);
							
							response+= '<div id="'+id+'" class="like">' +
											editorDefaults.elementMenuNoConfig +
											'<div class="title"><i class="fa fa-facebook"></i>Facebook Like</div></div>';
						}
		
						// parse COMMENTS MODULE
						if(name=='comments'){
							var id = $(node).attr('id');
							if(id==undefined || id=='')id='c-'+parseInt(new Date().getTime() / 1000);
							
							response+= '<div id="'+id+'" class="comments">' +
											editorDefaults.elementMenuNoConfig +
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
							
							response+= '<div id="'+id+'" class="html" data-id="'+id+'" data-cssclass="prettyprint linenums pre-scrollable"  data-desc="'+desc+'" data-type="'+type+'">'+
								editorDefaults.elementMenuHtml +
								'<div class="title"><i class="fa fa-html5"></i>'+desc+' <i class="fa fa-angle-down"></i></div>' +
								'<pre class="prettyprint linenums pre-scrollable">' + $(node).html() + '</pre>' +
								'<pre class="non-pretty">' + $(node).html() + '</pre>' +
								'</div>';
						}
						
						// parse YOUTUBE MODULE
						if(name=='youtube'){
							var id = $(node).attr('id');
							if(id==undefined || id=='')id='y-'+parseInt(new Date().getTime() / 1000);
							
							var h = $(node).html();
							response+= '<div id="'+id+'" class="youtube">' +
										editorDefaults.elementMenuNoConfig +
										'<textarea placeholder="Paste HTML embed code here">'+h+'</textarea></div>';
						}
						
						// parse MAP MODULE
						if(name=='map'){
					  		var address = $(node).attr('address');
						  	if(address==undefined)address='';
							var id = $(node).attr('id');
							if(id==undefined || id=='')id='m-'+parseInt(new Date().getTime() / 1000);
					  
						  	response+= '<div id="'+id+'" class="map">' +
						  				editorDefaults.elementMenuNoConfig +
										'<div><i class="in-textbox fa fa-map-marker"></i><input type="text" value="' + address + '" spellcheck="false" maxlength="512" placeholder="1234 Main Street, Some City, LA 90210"></div></div>';
						}
						
						// parse LIST MODULE
						if(name=='list'){
					  		var display = $(node).attr('display');
						  	var id = $(node).attr('id');
			                  
			                      
						  	if(id==undefined || id==''){
			    		  	  id = 'list'+($(node).find('.list').length + 1);  
						  	}
			
						  	var type = $(node).attr('type');
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
							
						  	chtml = '<div id="'+id+'" data-display="'+display+'" data-type="'+type+'" class="list"' +
								' data-label="' + label + '"' +
								' data-desclength="' + desclength + '"' +
								' data-length="' + length + '" data-orderby="' + orderby + '" data-category="' + category  + '" data-pageresults="' + pageresults + '">' +
								editorDefaults.elementMenuList +
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
							
						  	chtml = '<div id="'+id+'" data-pageuniqid="'+pageUniqId+'" data-pagename="'+pageName+'" class="featured">' +
						  		editorDefaults.elementMenuNoConfig +
								' <div class="title"><i class="fa fa-star"></i> Featured content: '+pageName+' </div></div>';
			
						  	response += chtml;  
						}
						
						// parse FILE MODULE
						if(name=='file'){
					  		var file = $(node).attr('file');
						  	var desc = $(node).attr('description');
						  	var id = $(node).attr('id');
						  	if(id==undefined || id=='')id='f-'+parseInt(new Date().getTime() / 1000);
						  
						  	response+= '<div id="'+id+'" class="file" data-filename="'+file+'">' +
						  					editorDefaults.elementMenuNoConfig +
						  					'<div><i class="in-textbox fa fa-file-o"></i><input type="text" value="'+desc+'" spellcheck="false" maxlength="256" placeholder="Description for the file"></div></div>';
						}
						
						// parse FORM MODULE
						if(name=='form'){
							var id = $(node).attr('id');
							response+= '<div id="'+id+'" class="form">' +
								editorDefaults.elementMenuNoConfig + 
								'<div class="field-list">';
							
							var fields = $(node).find('.form-group');
							
							for(y=0; y<fields.length; y++){
						  		fhtml = $('<div>').append($(fields[y]).clone()).remove().html();
							  	response += '<span class="field-container">' +
							  					editorDefaults.elementMenuNoConfig +
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
											editorDefaults.elementMenuShelf + 
											item + 
											'</div>';
								
							
							}
						
							response+= '<div id="'+id+'" class="shelf">' +
											editorDefaults.elementMenuNoConfig + 
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
						editorDefaults.blockMenu + '</span></div>'; 
		}
		else{
			// walk through blocks
			for(var y=0; y<blocks.length; y++){
		  		var id = $(blocks[y]).attr('id');
			  	var cssclass = $(blocks[y]).attr('class');
			  	var cssclass_readable = '.' + global.replaceAll(cssclass, ' ', '.');
			  	
			  	cssclass = jQuery.trim(global.replaceAll(cssclass, 'block', ''));
			  	cssclass = jQuery.trim(global.replaceAll(cssclass, 'row', ''));
	
				if(id==undefined || id=='')id='undefined';
	
			  	html += '<div id="'+id+'" class="block row" data-cssclass="' + cssclass + '">';        
			  
			  	// determine if there are columns
			  	var cols = $(blocks[y]).find('.col');
	  
				for(var z=0; z<cols.length; z++){
					var className = $(cols[z]).attr('class'); 
	
			  		html += '<div class="'+className+' sortable">';
			  		html += parseModules(cols[z]);
			  		html += '</div>';
			  }
	
			  html += '<span class="block-actions"><span>#'+ id + ' ' + cssclass_readable + '</span>' +
			  			editorDefaults.blockMenu + '</span></div>';
			}
		  }
	
		  return html;
		}
		
		// parse HTML
		var response = parseHTML(this);
		
		// set menu
		$('#editor-menu').html(menu);
	   
		// set HTML
	  	$(this).html(response); 
	  
	  	// add editor class
		$(this).addClass('editor');
		
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
		
		// create ALIGNMENT
		$('.editor-menu a.align-center, .editor-menu a.align-left, .editor-menu a.align-right').click(function(){
		
			var alignclass = 'align-'+$(this).attr('data-align');
			
			if($('*:focus').length>0){
				var el = $('*:focus').parents('div.p, div.h1, div.h2, div.h3');
				
				var cssclass = el.attr('data-cssclass');
				cssclass = global.replaceAll(cssclass, 'align-left', ''); // replace other alignments
				cssclass = global.replaceAll(cssclass, 'align-right', '');
				cssclass = global.replaceAll(cssclass, 'align-center', '');
				cssclass += ' '+alignclass;
				cssclass = $.trim(cssclass);
				
				el.attr('data-cssclass', cssclass);
				el.removeClass('align-left');
				el.removeClass('align-right');
				el.removeClass('align-center');
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
	
		// create SYNTAX
		$('.editor-menu a.syntax').click(function(){
	
			codeBlockDialog.show();
			
			return false;
		});
		
		// create LINK
		$('.editor-menu a.link').click(function(){
		  
			linkDialog.show();
			
			return false;
		});
	
		// create LAYOUT
		$('.editor-menu a.load').click(function(){
		  
			loadLayoutDialog.show(); 
			
			return false;
		});
	
		// create PLUGINS
		$('.editor-menu a.plugins').click(function(){
		  
			pluginsDialog.show(); 
			
			return false;
		});
	 
		// update PAGE SETTINGS
		$('.editor-menu a.settings').click(function(){
		  
			pageSettingsDialog.show(); 
			
			return false;
		});
	
		// create P
		$('.editor-menu a.p').click(function(){
			var editor = $('#desc').get(0);
			var length = $(editor).find('.p').length + 1;
			var uniqId = 'paragraph-'+ length;
			
			$(editor).respondAppend(
			  '<div id="'+uniqId+'" class="p" data-id="'+uniqId+'" data-cssclass="">' +
			  editorDefaults.elementMenu + 
			  '<div contentEditable="true"></div>' +
			  '</div>'
			);
			
			// setup paste filter
			$('#'+uniqId+' [contentEditable=true]').paste();
			
			return false;
		});
	
		 // create TABLE
		$('.editor-menu a.table').click(function(){
			var editor = $('#desc').get(0);
			
			var length = $(editor).find('table').length + 1;
			var uniqId = 'table-'+ length;
			
			$(editor).respondAppend(
			  '<div id="'+uniqId+'" class="table" data-id="'+uniqId+'" data-cssclass="">'+
			  editorDefaults.elementMenuTable + 
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
			
			return false;
		});
		
		// create BLOCKQUOTE
		$('.editor-menu a.q').click(function(){
			var editor = $('#desc').get(0);
			
			var length = $(editor).find('.q').length + 1;
			var uniqId = 'quote-'+ length;
			
			$(editor).respondAppend(
			  '<div id="'+uniqId+'" class="q" data-id="'+uniqId+'" data-cssclass=""><i class="in-textbox fa fa-quote-left"></i>'+
			  editorDefaults.elementMenu + 
			  '<div contentEditable="true"></div>' +
			  '</div>'
			);
			
			// setup paste filter
			$('#'+uniqId+' [contentEditable=true]').paste();
			
			return false;
		});
		
		// create HTML BLOCK
		$('.editor-menu a.html').click(function(){
			htmlDialog.show('HTML block', 'html', 'add', -1);
			
			return false;
		});
		
		// create YOUTUBE
		$('.editor-menu a.youtube').click(function(){
			var editor = $('#desc').get(0);
			
			var length = $(editor).find('.youtube').length + 1;
			var uniqId = 'youtube-'+ length;
			
			$(editor).respondAppend(
				'<div id="'+uniqId+'" class="youtube">' +
				editorDefaults.elementMenuNoConfig + 
				'<textarea placeholder="Paste HTML embed code here"></textarea></div>');
			
			return false;
		});
		
		// import LAYOUT
		$('.editor-menu a.layout').click(function(){
			var editor = $('#desc').get(0);
			
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
		$('.editor-menu a.ul').click(function(){
			var editor = $('#desc').get(0);
			
			var length = $(editor).find('.ul').length + 1;
			var uniqId = 'ul-'+ length;
			
			$(editor).respondAppend(
			  '<div id="'+uniqId+'" class="ul" data-id="'+uniqId+'" data-cssclass="">' +
			  editorDefaults.elementMenu + 
			  '<div contentEditable="true"></div>' +
			  '</div>');
			
			// setup paste filter
			$('#'+uniqId+' [contentEditable=true]').paste();
			
			return false;
		});
		
		// create HR
		$('.editor-menu a.hr').click(function(){
			var editor = $('#desc').get(0);
			
			var length = $(editor).find('.hr').length + 1;
			var uniqId = 'hr-'+ length;
			
			$(editor).respondAppend(
				 '<div id="'+uniqId+'" class="hr" data-id="'+uniqId+'" data-cssclass="">'+
				 editorDefaults.elementMenuNoConfig + 
				 '<div></div>' +
				 '</div>');
			
			return false;
		});
		
		// create IMAGE
		$('.editor-menu a.img').click(function(){
		  
			imagesDialog.show('image', -1);
			
			return false;
		});
		
		// create SLIDESHOW
		$('.editor-menu a.slideshow').click(function(){
			var editor = $('#desc').get(0);
			
			var length = $(editor).find('.slideshow').length + 1;
			var uniqId = 'slideshow-'+ length;
			
			slideshowDialog.show(uniqId);
			
			return false;
		});
	
		// create MAP
		$('.editor-menu a.map').click(function(){
			var editor = $('#desc').get(0);
			
			var length = $(editor).find('.map').length + 1;
			var uniqId = 'map-'+ length;
			
			$(editor).respondAppend(
			'<div id="'+uniqId+'" class="map">' +
			editorDefaults.elementMenuNoConfig + 
			'<div><i class="in-textbox fa fa-map-marker"></i><input type="text" value="" spellcheck="false" maxlength="512" placeholder="1234 Main Street, Some City, LA 90210"></div></div>'
			);
			
			return false;
		});
		
		// create TWITTER
		$('.editor-menu a.twitter').click(function(){
			htmlDialog.show('Twitter Widget', 'twitter', 'add', -1);
			
			return false;
		});
		
		// create LIKE
		$('.editor-menu a.like').click(function(){
			var editor = $('#desc').get(0);
			
			var length = $(editor).find('.like').length + 1;
			var uniqId = 'like-'+ length;
			
			$(editor).respondAppend(
				'<div id="'+uniqId+'" class="like">' +
				editorDefaults.elementMenu + 
				'<div class="title"><i class="fa fa-facebook"></i> Facebook Like</div></div>'
				);
			
			return false;
		});
	
		// create COMMENTS
		$('.editor-menu a.comments').click(function(){
			var editor = $('#desc').get(0);
			
			var length = $(editor).find('.comments').length + 1;
			var uniqId = 'comments-'+ length;
			
			$(editor).respondAppend(
				'<div id="'+uniqId+'" class="comments">' +
				editorDefaults.elementMenuNoConfig + 
				'<div class="title"><i class="fa fa-facebook"></i> Facebook Comments</div></div>'
				);
			
			return false;
		});
		
		// create FILES
		$('.editor-menu a.file').click(function(){
			filesDialog.show();
			return false;
		});
		
		// create FORM
		$('.editor-menu a.form').click(function(){
			var editor = $('#desc').get(0);
			
			var length = $(editor).find('.form').length + 1;
			var uniqId = 'form-'+ length;
			
			$(editor).respondAppend(
				'<div id="'+uniqId+'" class="form">' +
				editorDefaults.elementMenuNoConfig + 
				'<div class="field-list"></div><a class="add-field"><i class="fa fa-check"></i> Add Field</a></div>'
			);
			
			// set up sorting on form elements
			$('.form div').sortable({handle: '.move', placeholder: 'editor-highlight', opacity:'0.6', axis:'y'});
			
			return false;
		});
		
		// create SHELF
		$('.editor-menu a.shelf').click(function(){
			var editor = $('#desc').get(0);
			
			var length = $(editor).find('.form').length + 1;
			var uniqId = 'shelf'+ length;
			
			$(editor).respondAppend(
				'<div id="'+uniqId+'" class="shelf">' +
				editorDefaults.elementMenuNoConfig + 
				'<div class="shelf-items"></div>' + 
				'<a class="add-sku"><i class="fa fa-tag"></i> Add SKU</a></div>'
			);
			
			// set up sorting on shelf items
			$('.shelf-items').sortable({handle: '.move', placeholder: 'editor-highlight', opacity:'0.6', axis:'y'});
			
			return false;
		});
		
		// create H1
		$('.editor-menu a.h1').click(function(){
			var editor = $('#desc').get(0);
			
			var length = $(editor).find('.h1').length + 1;
			var uniqId = 'h1-'+ length;
			
			$(editor).respondAppend(
				'<div id="'+uniqId+'" class="h1" data-id="'+uniqId+'" data-cssclass="">' +
				editorDefaults.elementMenu + 
				'<div contentEditable="true"></div></div>'
			);
			
			// setup paste filter
			$('#'+uniqId+' [contentEditable=true]').paste();
			
			return false;
		});
		
		// create H2
		$('.editor-menu a.h2').click(function(){
			var editor = $('#desc').get(0);
			
			var length = $(editor).find('.h2').length + 1;
			var uniqId = 'h2-'+ length;
			
			$(editor).respondAppend(
			  '<div id="'+uniqId+'" class="h2" data-id="'+uniqId+'" data-cssclass="">' +
				editorDefaults.elementMenu + 
				'<div contentEditable="true"></div></div>'
			);
			
			// setup paste filter
			$('#'+uniqId+' [contentEditable=true]').paste();
			
			return false;
		});
		
		// create H3
		$('.editor-menu a.h3').click(function(){
			var editor = $('#desc').get(0);
			
			var length = $(editor).find('.h3').length + 1;
			var uniqId = 'h3-'+ length;
			
			$(editor).respondAppend(
			  '<div id="'+uniqId+'" class="h3" data-id="'+uniqId+'" data-cssclass="">'+
				editorDefaults.elementMenu + 
				'<div contentEditable="true"></div></div>'
			);
			
			// setup paste filter
			$('#'+uniqId+' [contentEditable=true]').paste();
			
			return false;
		});
		
		// create COLS
		$('.editor-menu a.cols').click(function(){
			var editor = $('#desc').get(0);
			var length = $(editor).find('.block').length + 1;
			var uniqId = 'block-'+ length;
			
			$(editor).append(
				'<div id="'+uniqId+'" class="block row">' +
				'<div class="col col-md-6 sortable">' +
				'</div>' +
				'<div class="col col-md-6 sortable">' +
				'</div>' +
				'<span class="block-actions"><span>#'+ uniqId + ' .block.row</span>' + 
				editorDefaults.blockMenu + '</span></div>'
			);
			
			$('.block-actions').show();
			
			// reset currnode (new content should be added to the end)
			currnode = null;
			
			// re-init sortable
			$('.sortable').sortable({handle:'.move', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6', tolerance: 'pointer'});
			
			return false;
		});
	
		
		// create PREVIEW
		$('.editor-menu a.preview').click(function(){
			var editor = $('#desc').get(0);
			
			contentModel.preview();
			
			return false;
		});
	
		// create COLS 7/3
		$('.editor-menu a.cols73').click(function(){
			var editor = $('#desc').get(0);
			var length = $(editor).find('.block').length + 1;
			var uniqId = 'block-'+ length;
			
			var html = '<div id="'+uniqId+'" class="block row">' +
							'<div class="col col-md-9 sortable">' +
							'</div>' +
							'<div class="col col-md-3 sortable">' +
							'</div>' +
							'<span class="block-actions"><span>#'+ uniqId + ' .block.row</span>' +
							editorDefaults.blockMenu + '</span></div>';
			
			$(editor).append(
				html
			);
			
			$('.block-actions').show();
			
			// reset currnode (new content should be added to the end)
			currnode = null;
			
			// re-init sortable
			$('.sortable').sortable({handle:'.move', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6', tolerance: 'pointer'});
			
			return false;
		});
		
		// create COLS 3/7
		$('.editor-menu a.cols37').click(function(){
			var editor = $('#desc').get(0);
			var length = $(editor).find('.block').length + 1;
			var uniqId = 'block-'+ length;
			
			var html = '<div id="'+uniqId+'" class="block row">' +
							'<div class="col col-md-3 sortable">' +
							'</div>' +
							'<div class="col col-md-9 sortable">' +
							'</div>' +
							'<span class="block-actions"><span>#'+ uniqId + ' .block.row</span>' +
							editorDefaults.blockMenu + '</span></div>';
			
			$(editor).append(
			html
			);
			
			$('.block-actions').show();
			
			// reset currnode (new content should be added to the end)
			currnode = null;
			
			// re-init sortable
			$('.sortable').sortable({handle:'.move', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6', tolerance: 'pointer'});
			
			return false;
		});
	
		// create COLS 3/3/3
		$('.editor-menu a.cols333').click(function(){
			var editor = $('#desc').get(0);
			var length = $(editor).find('.block').length + 1;
			var uniqId = 'block-'+ length;
			
			var html = '<div id="'+uniqId+'" class="block row">' +
							'<div class="col col-md-4 sortable">' +
							'</div>' +
							'<div class="col col-md-4 sortable">' +
							'</div>' +
							'<div class="col col-md-4 sortable">' +
							'</div>' +
							'<span class="block-actions"><span>#'+ uniqId + ' .block.row</span>' +
							editorDefaults.blockMenu + '</span></div>';
			
			$(editor).append(
				html
			);
			
			$('.block-actions').show();
			
			// reset currnode (new content should be added to the end)
			currnode = null;
			
			// re-init sortable
			$('.sortable').sortable({handle:'.move', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6', tolerance: 'pointer'});
			
			return false;
		});
		
		// create COLS 4*25
		$('.editor-menu a.cols425').click(function(){
			var editor = $('#desc').get(0);
			var length = $(editor).find('.block').length + 1;
			var uniqId = 'block-'+ length;
			
			var html = '<div id="'+uniqId+'" class="block row">' +
							'<div class="col col-md-3 sortable">' +
							'</div>' +
							'<div class="col col-md-3 sortable">' +
							'</div>' +
							'<div class="col col-md-3 sortable">' +
							'</div>' +
							'<div class="col col-md-3 sortable">' +
							'</div>' +
							'<span class="block-actions"><span>#'+ uniqId + ' .block.row</span>' +
							editorDefaults.blockMenu + '</span></div>'; 
			
			$(editor).append(
				html
			);
			
			$('.block-actions').show();
			
			// reset currnode (new content should be added to the end)
			currnode = null;
			
			// re-init sortable
			$('.sortable').sortable({handle:'.move', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6', tolerance: 'pointer'});
			
			return false;
		});
		
		// create SINGLE COL
		$('.editor-menu a.single').click(function(){
			var editor = $('#desc').get(0);
			var length = $(editor).find('.block').length + 1;
			var uniqId = 'block-'+ length;
			
			$(editor).append(
			'<div id="'+uniqId+'" class="block row"><div class="col col-md-12 sortable"></div>' +
			 '<span class="block-actions"><span>#'+ uniqId + ' .block.row</span>' +
			 editorDefaults.blockMenu + '</span></div>'
			);
			
			$('.block-actions').show();
			
			// reset currnode (new content should be added to the end)
			currnode = null;
			
			// re-init sortable
			$('.sortable').sortable({handle:'.move', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6', tolerance: 'pointer'});
			
			return false;
		});
		
		// create LIST
		$('.editor-menu a.list').click(function(){
			listDialog.show('add', -1);
			return false;
		});
		
		// create FEATURED
		$('.editor-menu a.featured').click(function(){
			featuredDialog.show();
			return false;
		});
		
		// #persistent events
		
		// setup context
		var context = this;
		
		// make blocks sortable 
		$('.sortable').sortable({handle:'.move', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6', tolerance: 'pointer'});
		
		// handle remove-block
		$(this).on('click', '.remove-block', function(){
			$(this.parentNode.parentNode.parentNode).remove();
			
			$(context).find('.up').removeClass('disabled');
			$(context).find('.up').first().addClass('disabled');
	
			$(context).find('.down').removeClass('disabled');
			$(context).find('.down').last().addClass('disabled');
			
			return false;
		});
		
		// handle expand-menu
		$(this).on('click', '.expand-menu', function(){
			$(this).toggleClass('active');
			$(this).next().toggleClass('active');
		});
		
		// add field
		$(this).on('click', '.add-field', function(){
			var id = $(this.parentNode).attr('id');
			fieldDialog.show(id);
			return false;
		});
		
		// add sku
		$(this).on('click', '.add-sku', function(){
			var id = $(this.parentNode).attr('id');
			skuDialog.show(id);
			return false;
		});
		
		// set currnode when div is focused
		$(this).on('focusin', '.sortable div', function(){
			currnode = this;
		});
		
		// set currrow when the th or td is focused
		$(this).on('focusin', 'th, td', function(){
			currrow = this.parentNode;
			$('tr').removeClass('curr-row');
			$(this.parentNode).addClass('curr-row');
		});
		
		// set currnode when textarea is focused
		$(this).on('focusin', '.sortable textarea, .sortable input', function(){
			if(!$(this.parentNode).hasClass('field') && !$(this.parentNode).hasClass('caption')){
				currnode = this.parentNode;
			}
		});
		
		// add row
		$(this).on('click', '.add-row', function(){
			var table = $(this).parent().parent().find('table');
			var cols = $(table).attr('data-columns');
	
			var html = '<tr>';
	
			for(var x=0; x<cols; x++){
				html += '<td contentEditable="true"></td>';
			}
	
			html += '</tr>';
			
			if(currrow){
				$(currrow).after(html);
			}
			else{
				$(table).find('tbody').append(html);
			}
	
			return false;
		});
		
		// remove row
		$(this).on('click', '.remove-row', function(){
			if(currrow){
				$(currrow).remove();
			}
			
			return false;
		});
	
		// add column
		$(this).on('click', '.add-column', function(){
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
		$(this).on('focus', '.caption input', function(){
			$(this.parentNode.parentNode).addClass('edit');
		});
	
		// caption blur (for images)
		$(this).on('blur', '.caption input', function(){
			var caption = $(this).val();
			$(this.parentNode.parentNode).find('img').attr('title', caption);
			$(this.parentNode.parentNode).removeClass('edit');
		});
	
		// image click
		$(this).on('click', '.img', function(){
			var moduleId = this.parentNode.id;
			var src = $('div#'+moduleId+' img').attr('src');
			var uniqueName = $('div#'+moduleId+' img').attr('id');
	
			aviaryDialog.show(uniqueName, src);
	
			return false;
		});
		
		// remove click
		$(this).on('click', '.remove', function(){
			$(this.parentNode.parentNode).remove();
			context.find('a.'+this.parentNode.className).show();
			currnode = null;
			return false;
		}); 
	
		// remove-image click
		$(this).on('click', '.remove-image', function(){
			$(this.parentNode).remove();
			context.find('a.'+this.parentNode.className).show();
			currnode = null;
			return false;
		}); 
	
		// config click
		$(this).on('click', '.config', function(){
			$(this.parentNode.parentNode).find('.expand-menu').toggleClass('active');
			$(this.parentNode.parentNode).find('.element-menu').toggleClass('active');
	
			var moduleId = $(this.parentNode.parentNode).attr('id');
	
			var id = $(this.parentNode.parentNode).attr('data-id');
			var cssClass = $(this.parentNode.parentNode).attr('data-cssclass');
			
			elementConfigDialog.show(moduleId, id, cssClass);
	
			currnode = null;
			return false;
		}); 
	
		// config block click
		$(this).on('click', '.config-block', function(){
			var blockId = $(this.parentNode.parentNode.parentNode).attr('id');
			var id = $(this.parentNode.parentNode.parentNode).attr('id');
			var cssClass = $(this.parentNode.parentNode.parentNode).attr('data-cssclass');
			
			blockConfigDialog.show(blockId, id, cssClass);
	
			currnode = null;
			return false;
		}); 
	
		// remove field click
		$(this).on('click', '.remove-field', function(){
			$(this.parentNode).remove();
			return false;
		});
		
		// add image click
		$(this).on('click', '.add-image', function(){
			var d = this.parentNode.parentNode;
			var id = $(d).attr('id');
	
			imagesDialog.show('slideshow', id);
		});
		
		// config list click   
		$(this).on('click', '.config-list', function(){
			var id=$(this.parentNode.parentNode).attr('id');
			listDialog.show('edit', id);
			return false;
		});
		
		// config html click
		$(this).on('click', '.config-html', function(){
			var id=$(this.parentNode.parentNode).attr('id');
			var desc=$(this.parentNode.parentNode).attr('data-desc');
			var type=$(this.parentNode.parentNode).attr('data-type');
			
			htmlDialog.show(desc, type, 'edit', id);
			return false;
		});
	
		// config plugin click
		$(this).on('click', '.config-plugin', function(){
			var id=$(this.parentNode.parentNode).attr('id');
			var type=$(this.parentNode.parentNode).attr('data-type');
			configPluginsDialog.show(id, type);
			return false;
		});

		// handle html div click
		$(this).on('click', '.html div', function(){
			$(this).parent().toggleClass('active');	
		});
			
		// handle switch
		$(this).on('click', '.switch', function(){
			$(this.parentNode).find('a').removeClass('selected');
			$(this).addClass('selected');
			return false;
		});
		
		// handle down
		$(this).on('click', '.down', function(){
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
		$(this).on('click', '.up', function(){
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
		
		// handle key events
		$(this).on('keydown', '[contentEditable=true]', function(){
		
			var editor = $(context).get(0);
			
			var el = $(this).parents('div')[0];
		 
			// ENTER KEY events
			if(event.keyCode == '13'){
			
				if($(el).hasClass('ul')){
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
					
					var tr = $(this).parents('tr')[0];
					
					$(tr).after(html);
			
					$(tr).next().find('[contentEditable=true]').get(0).focus();
				}
				else{
					$(el).after(
						'<div class="p">' +
						editorDefaults.elementMenu + 
						'<div contentEditable="true"></div></div>'
						);
				
					$(this.parentNode.nextSibling).find('div').focus();
				}
			
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
					
						if($(el).hasClass('ul')){
			  		
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

})(jQuery);

(function($){  
	$.fn.respondHtml = function () {
	
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
					
					newhtml += '<module id="'+id+'" name="youtube">' + h + '</module>';
				}
				
				// generate VIMEO
				if($(divs[x]).hasClass('vimeo')){
					var id = $(divs[x]).attr('id');
					if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
					
					var h = jQuery.trim($(divs[x]).find('textarea').val());
					
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
					if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		
					var dir = 'o';
					if($(divs[x]).hasClass('right')){
						dir = 'r';
					}
					else if($(divs[x]).hasClass('left')){
						dir = 'l';
					}
			  
					var constraints = '';
					var width = $(divs[x]).attr('data-width');
					var height = $(divs[x]).attr('data-height');
					if(width!=''&&height!=''){
						if(!isNaN(width)&&!isNaN(height)){ // set constraints
							constraints = ' data-width="'+width+'" data-height="'+height+'"';
						}
		  			}
			  
					var i_id = $(divs[x]).find('img').attr('id');
					var src = $(divs[x]).find('img').attr('src');
					var url = $(divs[x]).find('img').attr('data-url');
					var h = jQuery.trim($(divs[x]).find('div.content').html());
		   
			  		newhtml += '<div id="'+id+'" class="'+dir+'-image"'+constraints+'>';
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
		
					var width = $(divs[x]).attr('data-width');
					if(width==undefined || width=='')width=300;
		
					var height = $(divs[x]).attr('data-height');
					if(height==undefined || height=='')height=200;
		
					var imgs = $(divs[x]).find('span.image img');
		
					newhtml += '<module id="'+id+'" name="slideshow" width="'+width+'" height="'+height+'">';
		
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
					var type = $(divs[x]).attr('data-type');
					var label = $(divs[x]).attr('data-label');
		
					var desclength = $(divs[x]).attr('data-desclength');
					var length = $(divs[x]).attr('data-length');
					var orderby = $(divs[x]).attr('data-orderby');
					var category = $(divs[x]).attr('data-category');
					var pageresults = $(divs[x]).attr('data-pageresults');
		
					newhtml += '<module id="'+id+'" name="list" display="'+display+'" type="'+type+'" label="' + label + '"' +
						' desclength="'+desclength+'"' +
						' length="'+length+'"' +
						' orderby="'+orderby+'" category="'+category+'" pageresults="'+pageresults+'"' +
						'></module>';
				}
				
				// generate FEATURED
				if($(divs[x]).hasClass('featured')){
					var id = $(divs[x]).attr('id');
					  
					var pageUniqId = $(divs[x]).attr('data-pageuniqid');
					var pageName = $(divs[x]).attr('data-pagename');
					
					newhtml += '<module id="'+id+'" name="featured" pageuniqid="'+pageUniqId+'" pagename="'+pageName+'"></module>';
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
			  
			 		newhtml += '<module id="'+id+'" name="form">';
			  
			  		var fields = $(divs[x]).find('span.field-container');
			  
			  		for(var y=0; y<fields.length; y++){
			  			field = $(fields[y]).html();
			  			
			  			field = global.replaceAll(field, editorDefaults.elementMenuNoConfig, '');
			  			
						field = global.replaceAll(field, '<a class="expand-menu fa fa-ellipsis-v"></a><div class="element-menu ui-sortable"><a class="move fa fa-arrows"></a><a class="remove fa fa-minus-circle"></a></div>', '');
						
						field = global.replaceAll(field, '<a class="expand-menu fa fa-ellipsis-v active"></a><div class="element-menu ui-sortable active"><a class="move fa fa-arrows"></a><a class="remove fa fa-minus-circle"></a></div>', '');
						
						field = global.replaceAll(field, ' ui-sortable', '');
						newhtml += field;
			  		}
			  
			  		newhtml += '</module>';
				}
				
				// generate SHELF
				if($(divs[x]).hasClass('shelf')){
			  		var id= $(divs[x]).attr('id');
			  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		
			  		var items = $(divs[x]).find('.shelf-items').html();
			  		
			  		items = global.replaceAll(items, editorDefaults.elementMenuShelf, '');
			  		
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
			  		var id = $(divs[x]).attr('id');
			  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			  
			  		var address = $(divs[x]).find('input[type=text]').val();
			  		newhtml += '<module id="'+id+'" name="map" address="'+address+'"></module>';
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
		
		var blocks = $(this).find('div.block');
		
		// walk through blocks
		for(var y=0; y<blocks.length; y++){
		  	var id = $(blocks[y]).attr('id');
		  	var cssclass = $(blocks[y]).attr('data-cssclass');
		
		  	if(cssclass==undefined || cssclass=='')cssclass = '';
		
		  	if(cssclass!=''){
		  		cssclass = ' ' + cssclass;
		  	}
		  
		  	if(id==undefined || id=='')id='block-'+y;
		  
		  	html += '<div id="'+id+'" class="block row' + cssclass + '">';
		  
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
		
		}
		
		return html;
	}

})(jQuery);

(function($){  
	$.fn.respondAppend = function(html){
	
		var blocks = $(this).find('div.block');
		var length = blocks.length;
		
		if(currnode){
		
			// alert('boom');
		
			var temp = $(currnode).after(html).get(0);
			
			var added = $(temp).next();
			
			$('[contentEditable=true], input, textarea').blur();
			$(added).find('[contentEditable=true], input, textarea').focus();
			
			currnode = $(added);
		
		}
		else if(length>0){  
			var curr = blocks[length-1]; // get last block
			
			var cols = $(curr).find('div.col');
			
			if(cols.length>0){
				curr = $(cols[0]);
				currnode = $(html).appendTo(curr);
			}
			
			// arrh! focus!
			$(curr).find('[contentEditable=true], input, textarea').focus();
		}
		
	}

})(jQuery);

(function($){  
	$.fn.respondHandleEvents = function(){
	
	
	}

})(jQuery);


(function($){  
	$.fn.respondGetDesc = function(){
	
		var divs = $(this).find('div.p');
	
		var desc = '';
	
		for(var x=0; x<divs.length; x++){
			desc += jQuery.trim($(divs[x]).find('div').text());
		}
	
		if(desc.length>200){
			desc = desc.substring(0, 200) + '...';
		}
		
		return desc;
	}

})(jQuery);

(function($){  
	$.fn.respondGetPrimaryImage = function(){
	
		var imgs = $(this).find('div.block .img img');
		
		if(imgs.length==0){
			imgs = $(this).find('div.block span.image img');
		}
		
		var image = '';
		
		if(imgs && imgs.length>0){
			var parts = imgs[0].src.split('/');
			
			if(parts.length>0){
				image = parts[parts.length-1];
			}
		}
		
		return image;
	}

})(jQuery);

(function($){  
	$.fn.respondGetLocation = function(){
	
		var inputs = $(this).find('div.map input');
		
		var address='';
		
		if(inputs.length>0){
			address = $(inputs[0]).val();
		}
	
		return address;
	}
})(jQuery);