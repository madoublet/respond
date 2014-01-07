// handles the load layout dialog on content.php
var loadLayoutDialog = {

	pageUniqId: -1,

	init:function(){
		
		$('#selectPage li').live('click', function(){
			var pageUniqId = $(this).attr('data-pageuniqid');

			loadLayoutDialog.pageUniqId = pageUniqId;

			$('#selectPage li').removeClass('selected');
			$(this).addClass('selected');
		});

		$('#loadLayout').click(function(){

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
					$('#desc').respondEdit();
					contentModel.contentLoading(false);

					$('#loadLayoutDialog').modal('hide');
				}
			});

		});

	},

	// shows the slide show dialog
	show:function(){
		contentModel.updatePages(); // update pages for the dialog

		$('#selectPage').show();
		loadLayoutDialog.pageUniqId = -1;
		$('#loadLayoutDialog').modal('show');
	}
}

$(document).ready(function(){
	loadLayoutDialog.init();
});