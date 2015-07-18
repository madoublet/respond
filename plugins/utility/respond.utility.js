// create namespace
var respond = respond || {};
respond.utility = respond.utility || {};

// load utility
respond.utility.load = {

	pageId: null,
	versionId: null,
	location: null,

	// init
	init:function(){
		
		$(document).on('click', '#selectPage li', function(){
			var pageId = $(this).attr('data-pageid');

			respond.utility.load.pageId = pageId;

			$('#selectPage li').removeClass('selected');
			$(this).addClass('selected');
		});
		
		$(document).on('click', '#selectVersion li', function(){
			var versionId = $(this).attr('data-version');

			respond.utility.load.versionId = versionId;

			$('#selectVersion li').removeClass('selected');
			$(this).addClass('selected');
		});
		
		$(document).on('click', '#selectThemePage li', function(){
			var location = $(this).attr('data-location');

			respond.utility.load.location = location;

			$('#selectThemePage li').removeClass('selected');
			$(this).addClass('selected');
		});

		$(document).on('click', '#loadLayout', function(){

			if(respond.utility.load.pageId==-1){
				message.showMessage('error');
				return;
			}

			$.ajax({
				url: respond.editor.api +  '/page/content/retrieve',
				type: 'POST',
				beforeSend : function(xhr) {
				 	xhr.setRequestHeader('X-Auth', 'Bearer ' + window.sessionStorage.token);
			    },
				data: {pageId: respond.utility.load.pageId},
				success: function(data){
				
					// update html
					$(respond.editor.el).html(data);
					
					// refresh editor
	    			respond.editor.refresh();

					// hide modal
					$('#loadLayoutDialog').modal('hide');
				}
			});

		});
		
		$(document).on('click', '#loadLayoutFromTheme', function(){

			if(respond.utility.load.location==null){
				message.showMessage('error');
				return;
			}

			$.ajax({
				url: respond.editor.api + '/theme/page/content',
				type: 'post',
				beforeSend : function(xhr) {
				 	xhr.setRequestHeader('X-Auth', 'Bearer ' + window.sessionStorage.token);
			    },
				data: {location: respond.utility.load.location},
				success: function(data){
					
					// update editor
					$(respond.editor.el).html(data);
					
					// create editor
	    			respond.editor.refresh();

					$('#loadLayoutDialog').modal('hide');
				}
			});

		});
		
		$(document).on('click', '#loadLayoutFromVersion', function(){

			if(respond.utility.load.versionId==null){
				message.showMessage('error');
				return;
			}

			$.ajax({
				url: respond.editor.api + '/version/retrieve',
				type: 'post',
				beforeSend : function(xhr) {
				 	xhr.setRequestHeader('X-Auth', 'Bearer ' + window.sessionStorage.token);
			    },
				data: {versionId: respond.utility.load.versionId},
				success: function(data){
				
					// update editor
					$(respond.editor.el).html(data.Content);
					
					// create editor
	    			respond.editor.refresh();

					$('#loadLayoutDialog').modal('hide');
				}
			});

		});
		
		$(document).on('click', '#loadLayoutFromCode', function(){
		
			var data = $('#load-code').val();
		
			$(respond.editor.el).html(data);
			
			// create editor
			respond.editor.refresh();

			$('#loadLayoutDialog').modal('hide');
			

		});
		
	},

	// creates bold text
	create:function(){
	
		// reset segmented control
		//utilities.resetSegmentedControl('#loadLayoutDialog .segmented-control');
		
		// get the content and image from the editor
		var content = respond.editor.getContent();
		
		// style content
		$('#load-code').val(style_html(content));
		
		
		// get scope from page
		var scope = angular.element($("section.main")).scope();
		
		scope.retrievePages();
		scope.retrievePagesForTheme();
		scope.retrieveVersions();
		
	
		// show the dialog
		$('#loadLayoutDialog').modal('show');
		
	}
	
};

respond.utility.load.init();

// load utility
respond.utility.layout = {

	init:function(){
		
		// load snippet
		$(document).on('click', '#layoutDialog button', function(){
			
			var id = $(this).attr('data-id');
			var prefix = $(this).attr('data-prefix');
			
			var uniqId = respond.editor.generateUniqId(prefix, prefix);
			
			// get scope from page
			var scope = angular.element($("section.main")).scope();
			
			var api = scope.setup.api;
			
			// get data
			$.post(api + '/snippet/content', {'snippet': id}, function(data){
				
				var html = data;
				html = utilities.replaceAll(html, '{{id}}', uniqId);
				html = utilities.replaceAll(html, '{{menu}}', respond.editor.defaults.blockMenu);
				
				// replace with flexbox classes for columns
				html = utilities.replaceAll(html, 'col-md-12', 'flex-100');
				html = utilities.replaceAll(html, 'col-md-11', 'flex-91');
				html = utilities.replaceAll(html, 'col-md-10', 'flex-83');
				html = utilities.replaceAll(html, 'col-md-9', 'flex-75');
				html = utilities.replaceAll(html, 'col-md-8', 'flex-66');
				html = utilities.replaceAll(html, 'col-md-7', 'flex-58');
				html = utilities.replaceAll(html, 'col-md-6', 'flex-50');
				html = utilities.replaceAll(html, 'col-md-5', 'flex-41');
				html = utilities.replaceAll(html, 'col-md-4', 'flex-33');
				html = utilities.replaceAll(html, 'col-md-3', 'flex-25');
				html = utilities.replaceAll(html, 'col-md-2', 'flex-16');
				html = utilities.replaceAll(html, 'col-md-1', 'flex-8');
				
				// append to editor
				$(respond.editor.el).append(
					html
				);
				
				// re-init sortable
				respond.editor.setupSortable();
				
				// reset respond.editor.currNode (new content should be added to the end)
				respond.editor.currNode = null;
				
				// hide modal
				$('#layoutDialog').modal('hide');
				
			});
			
		});
		
	},

	// create layout
	create:function(){
	
		// get scope from page
		var scope = angular.element($("section.main")).scope();
		
		// retrieve snippets
		scope.retrieveSnippets();
	
		// show modal
		$('#layoutDialog').modal('show');	
		
	}
	
};

respond.utility.layout.init();

// fetch component
respond.utility.fetch = {

	// creates fetch
	create:function(){
	
		// generate uniqId
		var id = respond.editor.generateUniqId('fetch', 'fetch');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-magnet"></i> <span node-text="url">Not Selected</span></div>';		
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-fetch';
		attrs['data-cssclass'] = '';
		attrs['data-url'] = '';
		
		// append element to the editor
		respond.editor.append(
			 utilities.element('div', attrs, html)
		);
	
		return true;
		
	},
	
	// parse fetch
	parse:function(node){
	
		// get params
		var id = $(node).attr('fetchid');
		var url = $(node).attr('url');
		
		// build html
		var html = respond.editor.defaults.elementMenu +
					'<div class="title respond-element"><i class="fa fa-magnet"></i> <span node-text="url">' + url + '</span></div>';
					
		// tag attributes
		var attrs = [];
		attrs['id'] = id;
		attrs['data-id'] = id;
		attrs['class'] = 'respond-fetch';
		attrs['data-cssclass'] = $(node).attr('cssclass');
		attrs['data-url'] = $(node).attr('url');
		
		// return element
		return utilities.element('div', attrs, html);
				
	},
	
	// generate fetch
	generate:function(node){

		// tag attributes
		var attrs = [];
		attrs['fetchid'] = $(node).attr('data-id');
		attrs['cssclass'] = $(node).attr('data-cssclass');
		attrs['url'] = $(node).attr('data-url');
		
		// return element
		return utilities.element('respond-fetch', attrs, '');
		
	},
	
	// config fetch
	config:function(node, form){
		
	}
	
};