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
				 	xhr.setRequestHeader('Authorization', 'Bearer ' + window.sessionStorage.token);
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
				 	xhr.setRequestHeader('Authorization', 'Bearer ' + window.sessionStorage.token);
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
				 	xhr.setRequestHeader('Authorization', 'Bearer ' + window.sessionStorage.token);
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