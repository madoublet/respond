// handles the featured dialog on content.php
var featuredDialog = {

	pageUniqId: -1,
	name: '',

	init:function(){
	
		$('#selectFeaturedPage li').live('click', function(){
			var pageUniqId = $(this).attr('data-pageuniqid');
			var name = $(this).attr('data-name');

			featuredDialog.pageUniqId = pageUniqId;
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
			var editor = $('#desc');
			var uniqId = 'featured'+ ($(editor).find('.featured').length + 1);
			
			var html = '<div id="'+uniqId+'" data-pageuniqid="'+featuredDialog.pageUniqId +
			'" data-pagename="'+featuredDialog.name+'" class="featured">' +
			editorDefaults.elementMenuNoConfig + 
			'<div class="title"><i class="fa fa-star"></i> ' + $('#msg-featured-content').val() + ' '+featuredDialog.name +
			'</div></div>';

		  $(editor).respondAppend(
		    html
		  );
		  
		  $(editor).respondHandleEvents();

		  $('#featuredDialog').modal('hide');

		});

	},

	// shows the slide show dialog
	show:function(){
		contentModel.updatePages(); // update pages for the dialog

		$('#selectFeaturedPage').show();
		featuredDialog.pageUniqId = -1;
		$('#featuredDialog').modal('show');
	}
}

$(document).ready(function(){
	featuredDialog.init();
});