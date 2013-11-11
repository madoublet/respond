var aviaryDialog = {

	editor: null,
	src: null,

	init: function(){  // initializes the dialog

		aviaryDialog.editor = new Aviary.Feather({
		   apiKey: 'u6f8ojCPJkaeGhL2InhFTw',
		   apiVersion: 3,
		   tools: 'all',
		   appendTo: '',
		   onSave: function(imageID, newURL) {
		       var img = document.getElementById(imageID);
		       img.src = aviaryDialog.src;
		       
		       var fromUrl = newURL;
		       var toUrl = '../'+aviaryDialog.src; 

				message.showMessage('progress', 'Saving image...');

		       $.ajax({
					url: 'api/page/image/swap/',
					type: 'POST',
					data: {fromUrl:fromUrl, toUrl:toUrl},
					success: function(data){
						message.showMessage('success', 'Image updated successfully');
					},
					error: function(data){
						message.showMessage('error', 'There was a problem saving the image, please try again');
					}
				});
				
				aviaryDialog.editor.close();
		   },
		   onError: function(errorObj) {
		       alert(errorObj.message);
		   }
		});

	},

	show: function(imageId, imageSrc){  // shows the dialog

		var url = contentModel.appUrl() + '/' + imageSrc;

		aviaryDialog.src = imageSrc;

		aviaryDialog.editor.launch({
           image: imageId,
           url: url
       });

	}

}

$(document).ready(function(){
  aviaryDialog.init();
});