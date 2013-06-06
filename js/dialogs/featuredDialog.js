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
				message.showMessage('error', 'Please select a page to feature');
				return;
			}

			// add featured widget
			var editor = $('#desc');
			var uniqId = 'featured'+ ($(editor).find('.featured').length + 1);
			
			var html = '<div id="'+uniqId+'" data-pageuniqid="'+featuredDialog.pageUniqId+'" data-pagename="'+featuredDialog.name+'" class="featured"><div>'+featuredDialog.name+'</div><span class="marker icon-star" title="Module"></span><a class="remove" href="#"></a></div>';

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