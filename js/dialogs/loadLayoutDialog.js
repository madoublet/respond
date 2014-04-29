// handles the load layout dialog on content.php
var loadLayoutDialog = {

	pageUniqId: -1,
	location: null,
	editor: null,

	init:function(){
		
		$('#selectPage').on('click', 'li', function(){
			var pageUniqId = $(this).attr('data-pageuniqid');

			loadLayoutDialog.pageUniqId = pageUniqId;

			$('#selectPage li').removeClass('selected');
			$(this).addClass('selected');
		});
		
		$('#selectThemePage').on('click', 'li', function(){
			var location = $(this).attr('data-location');

			loadLayoutDialog.location = location;

			$('#selectThemePage li').removeClass('selected');
			$(this).addClass('selected');
		});

		$('#loadLayout').on('click', function(){

			if(loadLayoutDialog.pageUniqId==-1){
				message.showMessage('error', $('#msg-select-layout-error').val());
				return;
			}

			$.ajax({
				url: 'api/page/content/'+loadLayoutDialog.pageUniqId,
				type: 'GET',
				data: {},
				success: function(data){
					contentModel.content(data);
					contentModel.contentLoading(false);
					
					// create editor
	    			respond.Editor.Refresh(loadLayoutDialog.editor);

					$('#loadLayoutDialog').modal('hide');
				}
			});

		});
		
		$('#loadLayoutFromTheme').on('click', function(){

			if(loadLayoutDialog.location==null){
				message.showMessage('error', $('#msg-select-layout-error').val());
				return;
			}

			$.ajax({
				url: 'api/theme/page/content',
				type: 'post',
				data: {location: loadLayoutDialog.location},
				success: function(data){
					contentModel.content(data);
					contentModel.contentLoading(false);
					
					// create editor
	    			respond.Editor.Refresh(loadLayoutDialog.editor);

					$('#loadLayoutDialog').modal('hide');
				}
			});

		});
		
		$('#loadLayoutFromCode').on('click', function(){
		
			var data = $('#load-code').val();
		
			contentModel.content(data);
			
			// create editor
			respond.Editor.Refresh(loadLayoutDialog.editor);

			$('#loadLayoutDialog').modal('hide');
			

		});
		
		$('#loadLayoutDialog .segmented-control li').on('click', function(){
			$('#loadLayoutDialog .segmented-control li').removeClass('active');
			$(this).addClass('active');
			
			var navigate = $(this).attr('data-navigate');
			
			$('.load-existing').hide();
			$('.load-theme').hide();
			$('.load-code').hide();
			$('.'+navigate).show();
		});

	},

	// shows the slide show dialog
	show:function(editor){
		loadLayoutDialog.editor = editor;
		
		contentModel.updateThemePages();
	
		contentModel.updatePages(); // update pages for the dialog

		$('#selectPage').show();
		loadLayoutDialog.pageUniqId = -1;
		loadLayoutDialog.location = null;
		$('#loadLayoutDialog').modal('show');
		
		// get the content and image from the editor
		var content = respond.Editor.GetContent(editor);
		
		$('#load-code').val(style_html(content));
		
		// init page
		$('.load-existing').show();
		$('.load-theme').hide();
		$('.load-code').hide();
		
		$('#loadLayoutDialog .segmented-control li').removeClass('active');
		$('#loadLayoutDialog li:first-child').addClass('active');
	}
}

$(document).ready(function(){
	loadLayoutDialog.init();
});