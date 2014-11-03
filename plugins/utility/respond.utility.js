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
		// create COLS
		$(document).on('click', '.cols5050', function(){
		
			var uniqId = respond.editor.generateUniqId('block', 'block');
			
			var html = '<div id="'+uniqId+'" class="block row" data-nested="not-nested" data-containerid=""  data-containercssclass="">' +
					'<div class="col col-md-6 sortable">' +
					'</div>' +
					'<div class="col col-md-6 sortable">' +
					'</div>' +
					'<span class="block-actions"><span>#'+ uniqId + ' .block.row</span>' + 
					respond.editor.defaults.blockMenu + '</span></div>';
					
			
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
	
		// create COLS 7/3
		$(document).on('click', '.cols73', function(){
		
			var uniqId = respond.editor.generateUniqId('block', 'block');
			
			var html = '<div id="'+uniqId+'" class="block row" data-nested="not-nested" data-containerid=""  data-containercssclass="">' +
							'<div class="col col-md-9 sortable">' +
							'</div>' +
							'<div class="col col-md-3 sortable">' +
							'</div>' +
							'<span class="block-actions"><span>#'+ uniqId + ' .block.row</span>' +
							respond.editor.defaults.blockMenu + '</span></div>';
			
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
		
		// create COLS 3/7
		$(document).on('click', '.cols37', function(){
		
			var uniqId = respond.editor.generateUniqId('block', 'block');
			
			var html = '<div id="'+uniqId+'" class="block row" data-nested="not-nested" data-containerid=""  data-containercssclass="">' +
							'<div class="col col-md-3 sortable">' +
							'</div>' +
							'<div class="col col-md-9 sortable">' +
							'</div>' +
							'<span class="block-actions"><span>#'+ uniqId + ' .block.row</span>' +
							respond.editor.defaults.blockMenu + '</span></div>';
			
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
	
		// create COLS 3/3/3
		$(document).on('click', '.cols333', function(){
		
			var uniqId = respond.editor.generateUniqId('block', 'block');
			
			var html = '<div id="'+uniqId+'" class="block row" data-nested="not-nested" data-containerid=""  data-containercssclass="">' +
							'<div class="col col-md-4 sortable">' +
							'</div>' +
							'<div class="col col-md-4 sortable">' +
							'</div>' +
							'<div class="col col-md-4 sortable">' +
							'</div>' +
							'<span class="block-actions"><span>#'+ uniqId + ' .block.row</span>' +
							respond.editor.defaults.blockMenu + '</span></div>';
			
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
		
		// create COLS 4*25
		$(document).on('click', '.cols425', function(){
		
			var uniqId = respond.editor.generateUniqId('block', 'block');
			
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
							respond.editor.defaults.blockMenu + '</span></div>'; 
			
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
		
		// create SINGLE COL
		$(document).on('click', '.single', function(){
		
			var uniqId = respond.editor.generateUniqId('block', 'block');
			
			var html = '<div id="'+uniqId+'" class="block row" data-nested="not-nested" data-containerid=""  data-containercssclass="">' +
					'<div class="col col-md-12 sortable"></div>' +
					 '<span class="block-actions"><span>#'+ uniqId + ' .block.row</span>' +
					 respond.editor.defaults.blockMenu + '</span></div>';
			
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
		
	},

	// creates bold text
	create:function(){
	
		$('#layoutDialog').modal('show');	
		
	}
	
};

respond.utility.layout.init();