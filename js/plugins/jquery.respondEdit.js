currnode = null;

jQuery.fn.swap = function(b){ 
	b = jQuery(b)[0]; 
	var a = this[0]; 
	var t = a.parentNode.insertBefore(document.createTextNode(''), a); 
	b.parentNode.insertBefore(a, b); 
	t.parentNode.insertBefore(b, t); 
	t.parentNode.removeChild(t); 
	return this; 
};

(function($){  
  $.fn.respondEdit = function () {

	// create menu
	var menu =  '<nav class="editor-menu">' +
                '<a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>' +
                '<div class="editor-actions"><div>' +
				'<a class="bold fa fa-bold" title="Bold Text (select text first)"></a>' +
				'<a class="italic fa fa-italic" title="Italicize Text (select text first)"></a>' +
				'<a class="strike fa fa-strikethrough" title="Strike Text (select text first)"></a>' +
				'<a class="subscript fa fa-subscript" title="Subscript Text (select text first)"></a>' +
				'<a class="superscript fa fa-superscript" title="Superscript Text (select text first)"></a>' +
				'<a class="underline fa fa-underline" title="Underline Text (select text first)"></a>' +
				'<a class="align-left fa fa-align-left" title="Align text to the left" data-align="left"></a>' +
				'<a class="align-center fa fa-align-center" title="Align text to the center" data-align="center"></a>' +
				'<a class="align-right fa fa-align-right" title="Align text to the right" data-align="right"></a>' +
				'<a class="link fa fa-link" title="Add Link (select text first)"></a>' +
				'<a class="code fa fa-code" title="Add code"></a>' +
        		'<a class="icon fa fa-flag" title="Add Font Awesome icon"></a>' + // WIP, coming soon
				'<a class="h1" title="Add Headline">H1</a>' +
				'<a class="h2" title="Add Headline">H2</a>' +
				'<a class="h3" title="Add Headline">H3</a>' +
				'<a class="p" title="Add a Paragraph">P</a>' +
				'<a class="q fa fa-quote-left" title="Add Block Quote"></a>' +
				'<a class="ul fa fa-list" title="Add a List"></a>' +
				'<a class="table fa fa-table" title="Add Table"></a>' +
				'<a class="hr fa fa-minus" title="Add a Horizontal Rule"></a>' +
				'<a class="img fa fa-picture-o" title="Add an Image"></span>' +
				'<a class="slideshow  fa fa-film" title="Add a Slideshow"></a>' +
				'<a class="map  fa fa-map-marker" title="Add a Map"></a>' +
				'<a class="twitter fa fa-twitter" title="Add your Twitter&reg; feed"></a>' +
				'<a class="like fa fa-facebook" title="Add Facebook&reg; Like button"></a>' +
				'<a class="comments fa fa-comments" title="Add Facebook&reg; comments"></a>' +
				'<a class="youtube fa fa-video-camera" title="Add a video"></span>' +
				'<a class="list fa fa-bars" title="Add a list of pages"></span>' +
                '<a class="featured fa fa-star" title="Add Featured Content"></a>' +
				'<a class="file fa fa-file-o" title="Add a File"></a>' +
				//'<a class="cart fa fa-shopping-cart" title="Add SKUs"></a>' +
				'<a class="form fa fa-check" title="Add a Form"></a>' +
				'<a class="html fa fa-html5" title="Add HTML"></a>' + 
				'<a class="syntax fa fa-terminal" title="Add Code Block"></a>';

   	menu += '<a class="plugins fa fa-cogs" title="Plugins"></a>';
   	menu += '<a class="settings fa fa-wrench" title="Page Settings"></a>';
    menu +=  '<a class="cols fa fa-columns" title="Add a 50/50 Column Layout"><small>50/50</small></a>' +
        	   '<a class="single fa fa-columns" title="Add a Full Column Layout"><small>100</small></a>' +
        	   '<a class="cols73 fa fa-columns" title="Add a 70/30 Column Layout"><small>70/30</small></a>' +
        	   '<a class="cols37 fa fa-columns" title="Add a 30/70 Column Layout"><small>30/70</small></a>' +
        	   '<a class="cols333 fa fa-columns" title="Add a 33/33/33 Column Layout"><small>3/3/3</small></a>' +
        	   '<a class="cols425 fa fa-columns" title="Add a 25/25/25/25 Column Layout"><small>4*25</small></a>' +
        	   '<a class="load fa fa-circle-arrow-up" title="Load New Layout"></a></div></div>';
    menu += '<a class="next fs-next"><i class="fa fa-chevron-right"></i></a>';
    menu += '<a class="previous fs-prev"><i class="fa fa-chevron-left"></i></a>';
    menu += '<a class="primary-action preview"><i class="fa fa-eye"></i> Preview</a>';
   
   	menu += '</nav>';
	   
   	var editor = '<div class="block row sortable">' +
		'<a class="remove-block fa fa-minus-circle"></a><a class="up fa fa-chevron-up"></a><a class="down fa fa-chevron-down"></a>' +
		'<div class="col col-md-12"><div class="p">' +
		'<div class="content" contentEditable="true"></div>' +
		'<span class="marker">P</span>' +
		'<a class="remove fa fa-minus-circle"></a>' +
		'</div>' +
		'</div></div>';
	
	var context = this;
			
	// parse HTML, #parse
	function parseHTML(top){

  		function parseModules(node){
			var children = $(node).children();
			var response = '';
			

			for(var x=0; x<children.length; x++){
		  		var node = children[x];
		  		var cssclass = '';
		 
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
			
				response+= '<div id="'+id+'" class="p'+alignclass+'" data-id="'+id+'" data-cssclass="'+cssclass+'">' +
					'<div class="content" contentEditable="true">' + $(node).html() + '</div>' +
					'<span class="marker">P</span>' +
					'<a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>' +
					'</div>';
		  	}

		  	if(node.nodeName=='TABLE'){
	            var id = $(node).attr('id');
	            if(id==undefined || id=='')id='h1-'+parseInt(new Date().getTime() / 1000);
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
	            
	            var table = '<div id="'+id+'" class="table" data-id="'+id+'" data-cssclass="'+cssclass+'"><table class="'+cssclass+'" data-columns="'+columns+'">'+
                        rows + '</table>' +
                       '<span class="marker fa fa-table"></span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>'+
                        '</div>';

            	response += table;
          	}
		  
		  	if(node.nodeName=='BLOCKQUOTE'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='bq-'+parseInt(new Date().getTime() / 1000);
				cssclass = $(node).attr('class');
				if(cssclass==undefined) cssclass='';
			
				response+= '<div id="'+id+'" class="q" data-id="'+id+'" data-cssclass="'+cssclass+'"><i class="fa fa-quote-left"></i>' +
					'<div class="content" contentEditable="true">' + $(node).html() + '</div>' +
					'<span class="marker fa fa-quote-left"></span>' +
					'<a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>' +
					'</div>';
		  	}
		  
		  	if(node.nodeName=='UL'){
				var lis = $(node).children();
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='ul-'+parseInt(new Date().getTime() / 1000);
				cssclass = $(node).attr('class');
				if(cssclass==undefined) cssclass='';
			
				response+= '<div id="'+id+'" class="ul" data-id="'+id+'" data-cssclass="'+cssclass+'">';
			
				for(y=0; y<lis.length; y++){
					response+= '<div class="content" contentEditable="true">' + $(lis[y]).html() + '</div>';
				}
			  
				response+= '<span class="marker fa fa-list"></span>';
				response+= '<a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>';
				response+= '</div>';
		  	}
		  
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
					'<div contentEditable="true">' + $(node).html() + '</div><span class="marker">H1</span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a><a class="config fa fa-cog"></a>'+
					'</div>';
		  	}
		  
		  	if(node.nodeName=='HR'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='hr-'+parseInt(new Date().getTime() / 1000);
				cssclass = $(node).attr('class');
			  	if(cssclass==undefined) cssclass='';
			  	response+= '<div id="'+id+'" class="hr" data-id="'+id+'" data-cssclass="'+cssclass+'">' +
					'<div></div>' +
					'<span class="marker fa fa-minus"></span>' +
					'<a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>' +
					'</div>';
	
		  	}
		  
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
					'<div contentEditable="true">' + $(node).html() + '</div><span class="marker">H2</span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>'+
					'</div>';
		  	}
		  
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
					'<div contentEditable="true">' + $(node).html() + '</div><span class="marker">H3</span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>'+
					'</div>';
		  	}

		  	if(node.nodeName=='PRE'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='syntax-'+parseInt(new Date().getTime() / 1000);
				
				response+= '<div id="'+id+'" class="syntax" data-id="'+id+'" data-cssclass="prettyprint linenums pre-scrollable">'+
					'<pre class="prettyprint linenums pre-scrollable">' + $(node).html() + '</pre>' +
					'<pre class="non-pretty">' + $(node).html() + '</pre>' +
					'<span class="marker fa fa-terminal"></span><a class="remove fa fa-minus-circle"></a>'+
					'</div>';
		  	}
		  
		  	if(node.nodeName=='DIV'){
				var className = $(node).attr('class');

				if(className=='l-image')className = ' left';
				else if(className=='r-image')className = ' right';
				else if(className=='o-image')className = '';

				var rel = $(node).find('a').attr('rel');
				if(rel==undefined || rel=='')rel='';

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
		  
		  	if(id==undefined || id=='')id='i-'+parseInt(new Date().getTime() / 1000);
		  
		  	if(className==' left'){
				response+= '<div id="'+id+'" class="i' + className + '"'+constraints+' data-id="'+id+'" data-cssclass="'+cssclass+'">';
				if(href==undefined){
			  		response+='<div class="img"><img id="'+i_id+'" src="' + src + '"></div>';
				}
				else{
			  		response+='<div class="img hasUrl"><img id="'+i_id+'" src="' + src + '" data-url="' + href + '"></div>';
				}
				response+='<div class="content" contentEditable="true">' + html + '</div><span class="marker fa fa-picture-o"></span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>';
				response+='</div>';
		  	}
		  	else if(className==' right'){
				response+= '<div id="'+id+'" class="i' + className + '"'+constraints+' data-id="'+id+'" data-cssclass="'+cssclass+'">';
				response+='<div class="content" contentEditable="true">' + html + '</div>';
				if(href==undefined){
			  		response+='<div class="img"><img id="'+i_id+'" src="' + src + '"></div>';
				}
				else{
			  		response+='<div class="img hasUrl"><img id="'+i_id+'" src="' + src + '" data-url="' + href + '"></div>';
				}
				response+='<span class="marker fa fa-picture-o"></span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>';
				response+='</div>';
		  	}
		  	else{
				response+= '<div id="'+id+'" class="i"'+constraints+' data-id="'+id+'" data-cssclass="'+cssclass+'">';
				if(href==undefined){
			  		response+= '<div class="img"><img id="'+i_id+'" src="' + src + '"></div>';
				}
				else{
			  		response+= '<div class="img hasUrl"><img id="'+i_id+'" src="' + src + '" data-url="' + href + '"></div>';
				}
				response+= '<span class="marker fa fa-picture-o"></span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a></div>';
		  	}
		}

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

			response+= '<div id="'+id+'" data-type="'+type+'" data-name="'+name+'" data-render="'+render+'" data-config="'+config+'" ' + nvps + 'class="plugin"><div>'+name+'</div><span class="marker fa fa-cogs" title="Module"></span>';
		 
			if(config=='true'){
		        response +=  '<a class="remove fa fa-minus-circle"></a><a class="config-plugin fa fa-cog"></a></div>';
	      	}
	      	else{
		        response += '<a class="remove fa fa-minus-circle"></a></div>';
	      	}
		}
		  
	  	if(node.nodeName=='MODULE'){
			var name = $(node).attr('name') || '';
			var id = $(node).attr('id');
			
			if(id==undefined || id=='')id='s-'+parseInt(new Date().getTime() / 1000);
			
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
			  
			  	response+= '<div id="' + id + '" class="slideshow" data-width="'+width+'" data-height="'+height+'"><div>';
			
			  	for(var y=0; y<imgs.length; y++){
					var caption = $(imgs[y]).attr('title');
					imghtml = $('<div>').append($(imgs[y]).clone()).remove().html();
					response +='<span class="image">' + imghtml + '<span class="caption"><input type="text" value="'+caption+'" placeholder="Enter caption" maxwidth="140" class="form-control"></span><a class="remove-image fa fa-minus-circle"></a></span>';
			  	}
			
			  	response += '<button type="button" class="secondary-button add-image"><i class="fa fa-picture-o"></i></button></div><span class="marker fa fa-film" title="Module"></span><a class="remove fa fa-minus-circle"></a>' + '</div>';
			}

	
			if(name=='like'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='f-'+parseInt(new Date().getTime() / 1000);
				
				response+= '<div id="'+id+'" class="like"><div><i class="fa fa-facebook"></i>Facebook Like</div><span class="marker fa fa-facebook" title="Module"></span><a class="remove fa fa-minus-circle"></a></div>';
			}

			if(name=='comments'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='c-'+parseInt(new Date().getTime() / 1000);
				
				response+= '<div id="'+id+'" class="comments"><div><i class="fa fa-facebook"></i>Facebook comments</div><span class="marker fa fa-comments" title="Module"></span><a class="remove fa fa-minus-circle"></a></div>';
			}
			
			if(name=='html'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='h-'+parseInt(new Date().getTime() / 1000);
				
				var desc = $(node).attr('desc');
				if(desc==undefined || desc=='')desc='HTML block';
				
				var type = $(node).attr('type');
				if(type==undefined || type=='')desc='html';
				
				response+= '<div id="'+id+'" class="html" data-id="'+id+'" data-cssclass="prettyprint linenums pre-scrollable"  data-desc="'+desc+'" data-type="'+type+'">'+
					'<div><i class="fa fa-html5"></i>'+desc+' <i class="fa fa-angle-down"></i></div>' +
					'<pre class="prettyprint linenums pre-scrollable">' + $(node).html() + '</pre>' +
					'<pre class="non-pretty">' + $(node).html() + '</pre>' +
					'<span class="marker fa fa-html5"></span><a class="remove fa fa-minus-circle"></a><a class="config-html fa fa-cog"></a>'+
					'</div>';
			}
			
			if(name=='youtube'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='y-'+parseInt(new Date().getTime() / 1000);
				
				var h = $(node).html();
				response+= '<div id="'+id+'" class="youtube"><textarea placeholder="Paste HTML embed code here">'+h+'</textarea><span class="marker fa fa-video-camera" title="Module"></span><a class="remove fa fa-minus-circle"></a></div>';
			}
			
			if(name=='map'){
		  		var address = $(node).attr('address');
			  	if(address==undefined)address='';
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='m-'+parseInt(new Date().getTime() / 1000);
		  
			  	response+= '<div id="'+id+'" class="map"><div><i class="fa fa-map-marker"></i><input type="text" value="' + address + '" spellcheck="false" maxlength="512" placeholder="1234 Main Street, Some City, LA 90210"></div><span class="marker fa fa-map-marker" title="Module"></span><a class="remove fa fa-minus-circle"></a></div>';
			}
			
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
			  	var groupby = $(node).attr('groupby');
			  	var pageresults = $(node).attr('pageresults');
			  	if(type==undefined)type='';
				if(label==undefined)label='';
				if(desclength==undefined)desclength='250';
				if(length==undefined)length='';
				if(orderby==undefined)orderby='';
				if(groupby==undefined)groupby='';
				if(pageresults==undefined)pageresults='';
				
			  	chtml = '<div id="'+id+'" data-display="'+display+'" data-type="'+type+'" class="list"' +
					' data-label="' + label + '"' +
					' data-desclength="' + desclength + '"' +
					' data-length="' + length + '" data-orderby="' + orderby + '" data-groupby="' + groupby + '" data-pageresults="' + pageresults + '">' +
					' <div><i class="fa fa-bars"></i> List '+label+' </div><span class="marker fa fa-bars" title="Module"></span><a class="remove fa fa-minus-circle"></a><a class="config-list fa fa-cog"></a></div>';

			  	response += chtml;
			  
			}
			
			if(name=='featured'){
			  	var id = $(node).attr('id');
                      
			  	if(id==undefined || id==''){
    		  	  id = 'list'+($(node).find('.featured').length + 1);  
			  	}

			  	var pageName = $(node).attr('pagename');
			  	var pageUniqId = $(node).attr('pageUniqId');
				
			  	chtml = '<div id="'+id+'" data-pageuniqid="'+pageUniqId+'" data-pagename="'+pageName+'" class="featured">' +
					' <div><i class="fa fa-star"></i> Featured Content: '+pageName+' </div><span class="marker fa fa-star" title="Module"></span><a class="remove fa fa-minus-circle"></a></div>';

			  	response += chtml;  
			}
			
			if(name=='file'){
		  		var file = $(node).attr('file');
			  	var desc = $(node).attr('description');
			  	var id = $(node).attr('id');
			  	if(id==undefined || id=='')id='f-'+parseInt(new Date().getTime() / 1000);
			  
			  	response+= '<div id="'+id+'" class="file" data-filename="'+file+'"><div><i class="fa fa-file-o"></i><input type="text" value="'+desc+'" spellcheck="false" maxlength="256" placeholder="Description for the file"></div><span class="marker fa fa-file-o" title="Module"></span><a class="remove fa fa-minus-circle"></a></div>';
			}
			
			if(name=='form'){
				var id = $(node).attr('id');
				response+= '<div id="'+id+'" class="form"><div>';
				
				var fields = $(node).find('.form-group');
				
				for(y=0; y<fields.length; y++){
			  		fhtml = $('<div>').append($(fields[y]).clone()).remove().html();
				  	response += '<span class="field-container">';
				  	response += fhtml;
				  	response += '<a class="remove-field fa fa-minus-circle"></a><span class="marker-field" title="Field"><i class="fa fa-arrows-v"></i></span>';
				  	response += '</span>';
				}
				
				response+= '</div><a class="add-field">Add Field</a><span class="marker" title="Module"><i class="fa fa-check"></i></span><a class="remove fa fa-minus-circle"></a>';
				response+= '</div>';
			 }
		  }
		  
		  if(name=='cart'){
				var id = $(node).attr('id');
				var skus = $(node).attr('skus');
				
				response+= '<div id="'+id+'" class="cart" data-skus="'+skus+'"><input type="button" value="Add SKU" class="secondary-button addSKU"><div>';
				response+= '</div><span class="marker" title="Module"><i class="fa fa-shopping-cart"></i></span><a class="remove fa fa-minus-circle"></a>';
				response+= '</div>';
		  }
		  
		}
		
		return response;
	}
	  
  	var html = '';
	  
  	var blocks = $(top).find('div.block');
	  
  	if(blocks.length==0){
		html += '<div id="block-000" class="block sortable">';
		html += parseModules(top);
		html += '<span class="block-actions"><span>#block-000 .block.row</span><a class="up fa fa-chevron-up"></a><a class="down fa fa-chevron-down"></a><a class="config-block fa fa-cog"></a><a class="remove-block fa fa-minus-circle"></a></span></div>'; 
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

		  html += '<span class="block-actions"><span>#'+ id + ' ' + cssclass_readable + '</span><a class="up fa fa-chevron-up"></a><a class="down fa fa-chevron-down"></a><a class="config-block fa fa-cog"></a><a class="remove-block fa fa-minus-circle"></a></span></div>';
		}
	  }

	  return html;
	}
	
	var response = parseHTML(this);
	
	$('#editor-menu').html(menu);
   
  	$(this).html(response); 
  
	$(this).addClass('editor');
	 
	$('div.sortable').sortable({handle:'span.marker', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6', tolerance: "pointer"});
	
	$(this).respondHandleEvents();
	
	// handle bold menu item
	$('.editor-menu a.bold').click(function(){
	  document.execCommand("Bold", false, null);
	  return false;
	});
	
	// handle italic menu item
	$('.editor-menu a.italic').click(function(){
	  document.execCommand("Italic", false, null);
	  return false;
	});
	
	// handle strike menu item
	$('.editor-menu a.strike').click(function(){
	  document.execCommand("strikeThrough", false, null);
	  return false;
	});
	
	// handle underline item
	$('.editor-menu a.underline').click(function(){
	  document.execCommand("underline", false, null);
	  return false;
	});
	
	// handle subscript item
	$('.editor-menu a.subscript').click(function(){
	  document.execCommand("subscript", false, null);
	  return false;
	});
	
	// handle superscript item
	$('.editor-menu a.superscript').click(function(){
	  document.execCommand("superscript", false, null);
	  return false;
	});
	
	// handle alignment
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

	// handle code menu item
	$('.editor-menu a.code').click(function(){

	  var text = global.getSelectedText();
	  var html = '<code>'+text+'</code>';

	  document.execCommand("insertHTML", false, html);
	  return false;
	});
    
    // handle font awesome
    $('.editor-menu a.icon').click(function(){
    
    	fontAwesomeDialog.show();
	  
		return false;
	});

	// handle syntax menu item
	$('.editor-menu a.syntax').click(function(){

	  codeBlockDialog.show();

	  return false;
	});
	
	// handle link menu item
	$('.editor-menu a.link').click(function(){
	  
	  linkDialog.show();

	  return false;
	});

	// handle load new layout
	$('.editor-menu a.load').click(function(){
	  
	  loadLayoutDialog.show(); 

	  return false;
	});

	// handle plugins dialog
	$('.editor-menu a.plugins').click(function(){
	  
	  pluginsDialog.show(); 

	  return false;
	});
 
	// handle page settings
	$('.editor-menu a.settings').click(function(){
	  
	  pageSettingsDialog.show(); 

	  return false;
	});

	// handle p menu item
	$('.editor-menu a.p').click(function(){
	  var editor = $('#desc').get(0);
	  var length = $(editor).find('.p').length + 1;
	  var uniqId = 'paragraph-'+ length;
  
	  $(editor).respondAppend(
		  '<div id="'+uniqId+'" class="p" data-id="'+uniqId+'" data-cssclass="">'+
		  '<div contentEditable="true"></div><span class="marker">P</span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>'+
		  '</div>'
	  );

	  $(editor).respondHandleEvents();
	  
	  return false;
	});

	 // handle table menu item
	$('.editor-menu a.table').click(function(){
      var editor = $('#desc').get(0);

	  var length = $(editor).find('table').length + 1;
	  var uniqId = 'table-'+ length;

	  $(editor).respondAppend(
		  '<div id="'+uniqId+'" class="table" data-id="'+uniqId+'" data-cssclass="">'+
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
		  '<span class="marker fa fa-table"></span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>'+
		  '</div>'
	  );

	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle blockquote menu item
	$('.editor-menu a.q').click(function(){
      var editor = $('#desc').get(0);

	  var length = $(editor).find('.q').length + 1;
	  var uniqId = 'quote-'+ length;

	  $(editor).respondAppend(
		  '<div id="'+uniqId+'" class="q" data-id="'+uniqId+'" data-cssclass=""><i class="fa fa-quote-left"></i>'+
		  '<div contentEditable="true"></div><span class="marker fa fa-quote-left"></span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>'+
		  '</div>'
	  );

	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle html menu item
	$('.editor-menu a.html').click(function(){
      htmlDialog.show('html', 'add', -1);

	  return false;
	});
	
	// handle youtube menu item
	$('.editor-menu a.youtube').click(function(){
      var editor = $('#desc').get(0);

	  var length = $(editor).find('.youtube').length + 1;
	  var uniqId = 'youtube-'+ length;

	  $(editor).respondAppend(
	  	'<div id="'+uniqId+'" class="youtube"><textarea placeholder="Paste HTML embed code here"></textarea><span class="marker fa fa-video-camera"></span><a class="remove fa fa-minus-circle"></a></div>');

	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle source menu item
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
	
	// handle ul menu item
	$('.editor-menu a.ul').click(function(){
      var editor = $('#desc').get(0);

	  var length = $(editor).find('.ul').length + 1;
	  var uniqId = 'ul-'+ length;
	  
	  $(editor).respondAppend(
		  '<div id="'+uniqId+'" class="ul" data-id="'+uniqId+'" data-cssclass=""><div contentEditable="true"></div><span class="marker fa fa-list"></span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>' +
		  '</div>');
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle hr menu item
	$('.editor-menu a.hr').click(function(){
      var editor = $('#desc').get(0);

	  var length = $(editor).find('.hr').length + 1;
	  var uniqId = 'hr-'+ length;
	  
	 $(editor).respondAppend(
	  	 '<div id="'+uniqId+'" class="hr" data-id="'+uniqId+'" data-cssclass="">'+
		  '<div></div><span class="marker fa fa-minus"></span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>' +
		  '</div>');
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle img menu item
	$('.editor-menu a.img').click(function(){
	  
	  imagesDialog.show('image', -1);
	 
	  return false;
	});
	
	// handle slideshow
	$('.editor-menu a.slideshow').click(function(){
      var editor = $('#desc').get(0);

	  var length = $(editor).find('.slideshow').length + 1;
	  var uniqId = 'slideshow-'+ length;

	  slideshowDialog.show(uniqId);

	  return false;
	});

	
	// handle map
	$('.editor-menu a.map').click(function(){
      var editor = $('#desc').get(0);

	  var length = $(editor).find('.map').length + 1;
	  var uniqId = 'map-'+ length;
	  
	  $(editor).respondAppend(
		'<div id="'+uniqId+'" class="map"><div><i class="fa fa-map-marker"></i><input type="text" value="" spellcheck="false" maxlength="512" placeholder="1234 Main Street, Some City, LA 90210"></div><span class="marker fa fa-map-marker" title="Module"></span><a class="remove fa fa-minus-circle"></a></div>'
	  );
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle twitter
	$('.editor-menu a.twitter').click(function(){
		htmlDialog.show('twitter', 'add', -1);
		
		return false;
	});
	
	// handle like
	$('.editor-menu a.like').click(function(){
      var editor = $('#desc').get(0);

	  var length = $(editor).find('.like').length + 1;
	  var uniqId = 'like-'+ length;
	  
	  $(editor).respondAppend(
		'<div id="'+uniqId+'" class="like"><div><i class="fa fa-facebook"></i> Facebook Like</div><span class="marker fa fa-facebook" title="Module"></span><a class="remove fa fa-minus-circle""></a></div>'
	  );
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});

	// handle comments
	$('.editor-menu a.comments').click(function(){
      var editor = $('#desc').get(0);

	  var length = $(editor).find('.comments').length + 1;
	  var uniqId = 'comments-'+ length;
	
	  $(editor).respondAppend(
		'<div id="'+uniqId+'" class="comments"><div><i class="fa fa-facebook"></i> Facebook Comments</div><span class="marker fa fa-comments" title="Module"></span><a class="remove fa fa-minus-circle"></a></div>'
	  );
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle files
	$('.editor-menu a.file').click(function(){
	  filesDialog.show();
	  return false;
	});
	
	// handle form
	$('.editor-menu a.form').click(function(){
      var editor = $('#desc').get(0);

	  var length = $(editor).find('.form').length + 1;
	  var uniqId = 'form-'+ length;
	  
	  $(editor).respondAppend(
		'<div id="'+uniqId+'" class="form"><div>' +
		'</div><a class="add-field">Add Field</a><span class="marker" title="Module"><i class="fa fa-check"></i></span><a class="remove fa fa-minus-circle"></a>' + 
		'</div>'
	  );
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle shopping cart
	$('.editor-menu a.cart').click(function(){
      var editor = $('#desc').get(0);

	  var length = $(editor).find('.form').length + 1;
	  var uniqId = 'cart-'+ length;
	  
	  $(editor).respondAppend(
		'<div id="'+uniqId+'" class="cart" data-skus=""><input type="button" value="Add SKU" class="secondary-button addSKU"><div>' +
		'</div><span class="marker" title="Module"><i class="fa fa-shopping-cart"></i></span><a class="remove fa fa-minus-circle"></a>' + 
		'</div>'
	  );
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle h1 menu item
	$('.editor-menu a.h1').click(function(){
      var editor = $('#desc').get(0);

	  var length = $(editor).find('.h1').length + 1;
	  var uniqId = 'h1-'+ length;
	
	  $(editor).respondAppend(
		'<div id="'+uniqId+'" class="h1" data-id="'+uniqId+'" data-cssclass="">'+
		'<div contentEditable="true"></div><span class="marker">H1</span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>'+
		'</div>'
	  );
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle h2 menu item
	$('.editor-menu a.h2').click(function(){
      var editor = $('#desc').get(0);

	  var length = $(editor).find('.h2').length + 1;
	  var uniqId = 'h2-'+ length;
	
	  $(editor).respondAppend(
		  '<div id="'+uniqId+'" class="h2" data-id="'+uniqId+'" data-cssclass="">'+
			'<div contentEditable="true"></div><span class="marker">H2</span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>'+
			'</div>'
	  );
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle h3 menu item
	$('.editor-menu a.h3').click(function(){
      var editor = $('#desc').get(0);

	  var length = $(editor).find('.h3').length + 1;
	  var uniqId = 'h3-'+ length;
	
	  $(editor).respondAppend(
		  '<div id="'+uniqId+'" class="h3" data-id="'+uniqId+'" data-cssclass="">'+
			'<div contentEditable="true"></div><span class="marker">H3</span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>'+
			'</div>'
	  );
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle cols menu item
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
		'<span class="block-actions"><span>#'+ uniqId + ' .block.row</span><a class="up fa fa-chevron-up"></a><a class="down fa fa-chevron-down"></a><a class="config-block fa fa-cog"></a><a class="remove-block fa fa-minus-circle"></a></span></div>'
	  );

	  $('.block-actions').show();

	  currnode = null;
   
	  var sortable = $('div.sortable');
	  
	  $('div.sortable').sortable({handle:'span.marker', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6', tolerance: "pointer"});
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});

	
	// handle preview
	$('.editor-menu a.preview').click(function(){
      var editor = $('#desc').get(0);
	  
	  contentModel.preview();

	  return false;
	});


	// handle cols73 menu item
	$('.editor-menu a.cols73').click(function(){
      var editor = $('#desc').get(0);
	  var length = $(editor).find('.block').length + 1;
	  var uniqId = 'block-'+ length;
	
	  var html = '<div id="'+uniqId+'" class="block row">' +
			  '<div class="col col-md-9 sortable">' +
			'</div>' +
			'<div class="col col-md-3 sortable">' +
			'</div>' +
		  '<span class="block-actions"><span>#'+ uniqId + ' .block.row</span><a class="up fa fa-chevron-up"></a><a class="down fa fa-chevron-down"></a><a class="config-block fa fa-cog"></a><a class="remove-block fa fa-minus-circle"></a></span></div>';
	  
	  $(editor).append(
		html
	  );

	  $('.block-actions').show();
	  
	  currnode = null;
   
	  var sortable = $('div.sortable');
	  
	  $('div.sortable').sortable({handle:'span.marker', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6', tolerance: "pointer"});
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle cols37 menu item
	$('.editor-menu a.cols37').click(function(){
      var editor = $('#desc').get(0);
	  var length = $(editor).find('.block').length + 1;
	  var uniqId = 'block-'+ length;
	
	  var html = '<div id="'+uniqId+'" class="block row">' +
			  '<div class="col col-md-3 sortable">' +
			'</div>' +
			'<div class="col col-md-9 sortable">' +
			'</div>' +
		  '<span class="block-actions"><span>#'+ uniqId + ' .block.row</span><a class="up fa fa-chevron-up"></a><a class="down fa fa-chevron-down"></a><a class="config-block fa fa-cog"></a><a class="remove-block fa fa-minus-circle"></a></span></div>';
	  
	  $(editor).append(
		html
	  );

	  $('.block-actions').show();
	  
	  currnode = null;
   
	  var sortable = $('div.sortable');
	  
	  $('div.sortable').sortable({handle:'span.marker', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6', tolerance: "pointer"});
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});

	// handle cols333 menu item
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
		  '<span class="block-actions"><span>#'+ uniqId + ' .block.row</span><a class="up fa fa-chevron-up"></a><a class="down fa fa-chevron-down"></a><a class="config-block fa fa-cog"></a><a class="remove-block fa fa-minus-circle"></a></span></div>';
	  
	  $(editor).append(
		html
	  );

	  $('.block-actions').show();
	  
	  currnode = null;
   
	  var sortable = $('div.sortable');
	  
	  $('div.sortable').sortable({handle:'span.marker', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6', tolerance: "pointer"});
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle cols425 menu item
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
		  '<span class="block-actions"><span>#'+ uniqId + ' .block.row</span><a class="up fa fa-chevron-up"></a><a class="down fa fa-chevron-down"></a><a class="config-block fa fa-cog"></a><a class="remove-block fa fa-minus-circle"></a></span></div>';
	  
	  $(editor).append(
		html
	  );

	  $('.block-actions').show();
	  
	  currnode = null;
   
	  var sortable = $('div.sortable');
	  
	  $('div.sortable').sortable({handle:'span.marker', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6', tolerance: "pointer"});
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle single menu item
	$('.editor-menu a.single').click(function(){
      var editor = $('#desc').get(0);
	  var length = $(editor).find('.block').length + 1;
	  var uniqId = 'block-'+ length;
	
	  $(editor).append(
		'<div id="'+uniqId+'" class="block row"><div class="col col-md-12 sortable"></div>' +
		 '<span class="block-actions"><span>#'+ uniqId + ' .block.row</span><a class="up fa fa-chevron-up"></a><a class="down fa fa-chevron-down"></a><a class="config-block fa fa-cog"></a><a class="remove-block fa fa-minus-circle"></a></span></div>'
	  );

	  $('.block-actions').show();
	  
	  currnode = null;
	  
	  $('div.sortable').sortable({handle:'span.marker', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6', tolerance: "pointer"});
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle list menu item
	$('.editor-menu a.list').click(function(){
	  listDialog.show('add', -1);
	  return false;
	});
	
	// handle featured menu item
	$('.editor-menu a.featured').click(function(){
	  featuredDialog.show();
	  return false;
	});
	
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
		
			// handle paragraphs
			if($(divs[x]).hasClass('p')){
		  		var id = $(divs[x]).attr('data-id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  		var cssclass = $(divs[x]).attr('data-cssclass');
		  		if(cssclass==undefined || cssclass=='')cssclass = '';
		  
		  		var h = jQuery.trim($(divs[x]).find('div').html());
				newhtml += '<p id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '>' + h + '</p>';
			}

			// handle tables
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
		
			// handle blockquotes
			if($(divs[x]).hasClass('q')){
		  		var id = $(divs[x]).attr('data-id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  		var cssclass = $(divs[x]).attr('data-cssclass');
		  		if(cssclass==undefined || cssclass=='')cssclass = '';
		  
		  		var h = jQuery.trim($(divs[x]).find('div').html());
				newhtml += '<blockquote id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '>' + h + '</blockquote>';
			}
		
			// handle html
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
		
			// handle plugin
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
		
			// handle youtube
			if($(divs[x]).hasClass('youtube')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				
				var h = jQuery.trim($(divs[x]).find('textarea').val());
				
				newhtml += '<module id="'+id+'" name="youtube">' + h + '</module>';
			}
			
			// handle vimeo
			if($(divs[x]).hasClass('vimeo')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				
				var h = jQuery.trim($(divs[x]).find('textarea').val());
				
				newhtml += '<module id="'+id+'" name="vimeo">' + h + '</module>';
			}
		
			// handle ul
			if($(divs[x]).hasClass('ul')){
				var id = $(divs[x]).attr('data-id');
			  	if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			  	var cssclass = $(divs[x]).attr('data-cssclass');
			  	if(cssclass==undefined || cssclass=='')cssclass = '';
			  
			  	var lis = $(divs[x]).find('div');
			  	newhtml += '<ul id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
			  	newhtml += '>';
			  
			  	for(var y=0; y<lis.length; y++){
					newhtml += '<li>' + jQuery.trim($(lis[y]).html()) + '</li>';
			  	}
			  
			  	newhtml += '</ul>';
			}
		
			// handle headlines 
			if($(divs[x]).hasClass('h1')){
				var id = $(divs[x]).attr('data-id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				var cssclass = $(divs[x]).attr('data-cssclass');
				if(cssclass==undefined || cssclass=='')cssclass = '';
				
				var h = jQuery.trim($(divs[x]).find('div').html());
				newhtml += '<h1 id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '>' + h + '</h1>';
			}
		
			// h2
			if($(divs[x]).hasClass('h2')){
		  		var id = $(divs[x]).attr('data-id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  		var cssclass = $(divs[x]).attr('data-cssclass');
				if(cssclass==undefined || cssclass=='')cssclass = '';
		  
		  		var h = jQuery.trim($(divs[x]).find('div').html());
		  		newhtml += '<h2 id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '>' + h + '</h2>';
	  		}
		
			// h3
			if($(divs[x]).hasClass('h3')){
				var id = $(divs[x]).attr('data-id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				var cssclass = $(divs[x]).attr('data-cssclass');
				if(cssclass==undefined || cssclass=='')cssclass = '';

				var h = jQuery.trim($(divs[x]).find('div').html());
				newhtml += '<h3 id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '>' + h + '</h3>';
			}

			// syntax
			if($(divs[x]).hasClass('syntax')){
				var id = $(divs[x]).attr('data-id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);

				var h = jQuery.trim($(divs[x]).find('pre.non-pretty').html());

				newhtml += '<pre id="'+id+'" class="prettyprint linenums pre-scrollable">' + h + '</pre>';
			}
		
			// handle images
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
		
			// handle modules
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
		
			// list
			if($(divs[x]).hasClass('list')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				  
				var display = $(divs[x]).attr('data-display');
				var type = $(divs[x]).attr('data-type');
				var label = $(divs[x]).attr('data-label');

				var desclength = $(divs[x]).attr('data-desclength');
				var length = $(divs[x]).attr('data-length');
				var orderby = $(divs[x]).attr('data-orderby');
				var groupby = $(divs[x]).attr('data-groupby');
				var pageresults = $(divs[x]).attr('data-pageresults');

				newhtml += '<module id="'+id+'" name="list" display="'+display+'" type="'+type+'" label="' + label + '"' +
					' desclength="'+desclength+'"' +
					' length="'+length+'"' +
					' orderby="'+orderby+'" groupby="'+groupby+'" pageresults="'+pageresults+'"' +
					'></module>';
			}
			
			// featured
			if($(divs[x]).hasClass('featured')){
				var id = $(divs[x]).attr('id');
				  
				var pageUniqId = $(divs[x]).attr('data-pageuniqid');
				var pageName = $(divs[x]).attr('data-pagename');
				
				newhtml += '<module id="'+id+'" name="featured" pageuniqid="'+pageUniqId+'" pagename="'+pageName+'"></module>';
			}
		
			// twitter
			if($(divs[x]).hasClass('twitter')){
		  		var id = $(divs[x]).attr('id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  
		  		var username = $(divs[x]).find('input[type=text]').val();
		  		newhtml += '<module id="'+id+'" name="twitter" username="'+username+'"></module>';
			}
		
			// like
			if($(divs[x]).hasClass('like')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			
				newhtml += '<module id="'+id+'" name="like"></module>';
			}

			// comments
			if($(divs[x]).hasClass('comments')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			
				newhtml += '<module id="'+id+'" name="comments"></module>';
			}

			// blog
			if($(divs[x]).hasClass('blog')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			
				newhtml += '<module id="'+id+'" name="blog"></module>';
			}
		
			// hr
			if($(divs[x]).hasClass('hr')){
		  		var id = $(divs[x]).attr('data-id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);

				var cssclass = $(divs[x]).attr('data-cssclass');
				if(cssclass==undefined || cssclass=='')cssclass = '';
			
				newhtml += '<hr id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '></hr>';
			}
		
			// form
			if($(divs[x]).hasClass('form')){
		  		var id= $(divs[x]).attr('id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  
		 		newhtml += '<module id="'+id+'" name="form">';
		  
		  		var fields = $(divs[x]).find('span.field-container');
		  
		  		for(var y=0; y<fields.length; y++){
		  			field = $(fields[y]).html();
					field = field.replace('<a class="remove-field fa fa-minus-circle"></a>', '');
					field = field.replace('<span class="marker-field" title="Field"><i class="fa fa-arrows-v"></i></span>', '');
					field = global.replaceAll(field, ' ui-sortable', '');
					newhtml += field;
		  		}
		  
		  		newhtml += '</module>';
			}
			
			// cart
			if($(divs[x]).hasClass('cart')){
		  		var id= $(divs[x]).attr('id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  		
		  		var skus = $(divs[x]).attr('data-skus');
		  
		 		newhtml += '<module id="'+id+'" name="cart" skus="'+skus+'"></module>';
			}
		
			// map
			if($(divs[x]).hasClass('map')){
		  		var id = $(divs[x]).attr('id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  
		  		var address = $(divs[x]).find('input[type=text]').val();
		  		newhtml += '<module id="'+id+'" name="map" address="'+address+'"></module>';
			}
	
			// file
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
			$(curr).find('[contentEditable=true], input, textarea').focus(); // #here
		}
		
		$(this).respondHandleEvents();
	
	}

})(jQuery);

(function($){  
  $.fn.respondHandleEvents = function(){
	
	var context = this;
    
    console.log('handle events');
    console.log(this);

	$(context).find('.sortable div').focusin(function(){
		currnode = this;
	});
	
	$(context).find('div.col>div').focusin(function(){
		$(this).addClass('has-focus');
	})
	
	$(context).find('div.col>div').focusin(function(){
		$(this).addClass('has-focus');
	})
	
	$(context).find('div.col>div').focusout(function(){
		$(this).removeClass('has-focus');
	})

	$(context).find('.sortable textarea').focusin(function(){
		currnode = this;
	});

	$(context).find('.sortable input').focusin(function(){
	  
		if($(this.parentNode).hasClass('field') || $(this.parentNode).hasClass('caption')){
		
		}
		else{
			currnode = this.parentNode;
		}
		
	});

	// add field
	$(context).find('.add-field').click(function(){
		var id = $(this.parentNode).attr('id');
		fieldDialog.show(id);
		return false;
	});
	
	// add sku
	$(context).find('input.addSKU').click(function(){
		var id = $(this.parentNode).attr('id');
		skuDialog.show(id);
		return false;
	});
	
	// handle focus
	$(context).find('div.table td').focus(function(){
		$(this).addClass('current');
	});

	$(context).find('div.table td').blur(function(){
		$(this).removeClass('current');
	});

	// handle add row
	$(context).find('a.add-row').click(function(){
		var table = $(this).parent().parent().find('table');
		var cols = $(table).attr('data-columns');

		var html = '<tr>';

		for(var x=0; x<cols; x++){
			html += '<td contentEditable="true"></td>';
		}

		html += '</tr>';

		$(table).find('tbody').append(html);

		return false;
	});

	// handle add column
	$(context).find('a.add-column').click(function(){
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


	$('div.form div').sortable({handle: 'span.marker-field', placeholder: 'editor-highlight', opacity:'0.6', axis:'y'});

	$('div.slideshow div').sortable({handle:'img', items:'span.image', placeholder: 'editor-highlight', opacity:'0.6', axis:'x'});
	
	$(context).find('span.caption input').focus(function(){
		$(this.parentNode.parentNode).addClass('edit');
	});

	$(context).find('span.caption input').blur(function(){
		var caption = $(this).val();
		$(this.parentNode.parentNode).find('img').attr('title', caption);
		$(this.parentNode.parentNode).removeClass('edit');
	});

	$(context).find('div.img').click(function(){
		var moduleId = this.parentNode.id;
		var src = $('div#'+moduleId+' img').attr('src');
		var uniqueName = $('div#'+moduleId+' img').attr('id');

		aviaryDialog.show(uniqueName, src);

		return false;
	});

	$(context).find('a.remove, a.remove-image').click(function(){
	
		$(this.parentNode).remove();
		context.find('a.'+this.parentNode.className).show();
		currnode = null;
		return false;
	}); 

	$(context).find('a.config').click(function(){

		var moduleId = $(this.parentNode).attr('id');

		var id = $(this.parentNode).attr('data-id');
		var cssClass = $(this.parentNode).attr('data-cssclass');
		
		elementConfigDialog.show(moduleId, id, cssClass);

		currnode = null;
		return false;
	}); 

	$(context).find('a.config-block').click(function(){

		var blockId = $(this.parentNode.parentNode).attr('id');
		var id = $(this.parentNode.parentNode).attr('id');
		var cssClass = $(this.parentNode.parentNode).attr('data-cssclass');
		
		blockConfigDialog.show(blockId, id, cssClass);

		currnode = null;
		return false;
	}); 

	$(context).find('a.remove-field').click(function(){
		$(this.parentNode).remove();
		return false;
	});  
	
	function handleUpDown(){
		$(context).find('a.up').removeClass('disabled');
		$(context).find('a.up').first().addClass('disabled');

		$(context).find('a.down').removeClass('disabled');
		$(context).find('a.down').last().addClass('disabled');   
	}
   
	$(context).find('a.remove-block').click(function(){
		$(this.parentNode.parentNode).remove();
		handleUpDown();
		return false;
	});
	
 	handleUpDown();
	
	$(context).find('a.down').click(function(){
		if($(this).hasClass('disabled')){return false;}

		var curr = $(this.parentNode.parentNode);
		var next = $(this.parentNode.parentNode).next();

		$(curr).swap(next); 
		handleUpDown();
		return false;
	});

	$(context).find('a.up').click(function(){
		if($(this).hasClass('disabled')){return false;}
		  
		var curr = $(this.parentNode.parentNode);
		var next = $(this.parentNode.parentNode).prev();
		  
		$(curr).swap(next); 
		handleUpDown();
		return false;
	});
   
	$(context).find('button.add-image').click(function(){
		var d = this.parentNode.parentNode;
		var id = $(d).attr('id');

		imagesDialog.show('slideshow', id);
	});
	   
	$(context).find('.config-list').click(function(){
		var id=$(this.parentNode).attr('id');
		listDialog.show('edit', id);
		return false;
	});
	
	$(context).find('.config-html').click(function(){
		var id=$(this.parentNode).attr('id');
		
		htmlDialog.show('html', 'edit', id);
		return false;
	});

	$(context).find('.config-plugin').click(function(){
		var id=$(this.parentNode).attr('id');
		var type=$(this.parentNode).attr('data-type');
		configPluginsDialog.show(id, type);
		return false;
	});
	
	
	$(context).find('.html div').unbind('click');
	
	$(context).find('.html div').on('click', function(){
		$(this).parent().toggleClass('active');	
	});
		
	$(context).find('a.switch').click(function(){
		$(this.parentNode).find('a').removeClass('selected');
		$(this).addClass('selected');
		return false;
	});
	  
	$(context).find('[contentEditable=true]').unbind('keydown');
		
	$('[contentEditable=true]').paste();
	 
	$(context).find('[contentEditable=true]').keydown(function(event){
	
		var editor = $('#desc').get(0);
		
		var el = $(this).parents('div')[0];
	 
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
		
				$(table).find('tbody').append(html);
				
				$(table).find('tr:last-child td:first-child').focus();
				
			}
			else{
				$(el).after(
					'<div class="p"><div contentEditable="true"></div><span class="marker">P</span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a></div>'
					);
			
					$(this.parentNode.nextSibling).find('div').focus();
			}
		
			$(editor).respondHandleEvents();
		
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