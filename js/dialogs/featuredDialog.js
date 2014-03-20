// handles the featured dialog on content.php
var featuredDialog = {

	editor: null,
	pageUniqId: -1,
	url: '',
	name: '',

	init:function(){
	
		$('#selectFeaturedPage li').live('click', function(){
			var pageUniqId = $(this).attr('data-pageuniqid');
			var url = $(this).attr('data-url');
			var name = $(this).attr('data-name');

			featuredDialog.pageUniqId = pageUniqId;
			featuredDialog.url = url;
			featuredDialog.name = name;
			
			$('#selectFeaturedPage li').removeClass('selected');
			$(this).addClass('selected');
		});

		$('#addFeatured').click(function(){

			if(featuredDialog.pageUniqId==-1){
				message.showMessage('error', $('#msg-select-feature-error').val());
				return;
			}

			// add featured widget
			var editor = featuredDialog.editor;
			var className = 'featured';
			var prefix = 'featured';
		
			var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
			
			var html = '<div id="'+uniqId+'" data-url="'+featuredDialog.url +
			'" data-pagename="'+featuredDialog.name+'" class="featured">' +
			respond.defaults.elementMenuNoConfig + 
			'<div class="title"><i class="fa fa-star"></i> ' + $('#msg-featured-content').val() + ' '+featuredDialog.name +
			'</div></div>';

			respond.Editor.Append(editor,
				html
			);
		  
			$('#featuredDialog').modal('hide');

		});

	},

	// shows the slide show dialog
	show:function(editor){
		
		featuredDialog.editor = editor;
	
		contentModel.updatePages(); // update pages for the dialog

		$('#selectFeaturedPage').show();
		featuredDialog.pageUniqId = -1;
		$('#featuredDialog').modal('show');
	}
}

$(document).ready(function(){
	featuredDialog.init();
});