var galleryImgDialog = {

	dialog: null,
	imageId: null,

	init:function(){

		galleryImgDialog.dialog = $('#galleryImgDialog');

		$('#updateGalleryImg').on('click', function(){
		  
			var imageId = galleryImgDialog.imageId;

			// Store values from dialog
			$('#'+imageId).attr('title', $('#galleryImgCaption').val());
			$('#'+imageId).attr('id', $('#galleryImgId').val());
			$('#'+imageId).attr('data-containercssclass', $('#galleryImgCssClass').val());

			$('#galleryImgDialog').modal('hide');
		});

	},

	show:function(imageId){ // shows the dialog

		galleryImgDialog.imageId = imageId;

		// Populate dialog with initial values
		$('#galleryImgId').val( $('#'+imageId).attr('id') );
		$('#galleryImgCssClass').val( $('#'+imageId).attr('data-containercssclass') );
		$('#galleryImgCaption').val( $('#'+imageId).attr('title') );

		$('#galleryImgDialog').modal('show'); // show modal
	}
}

$(document).ready(function(){
	galleryImgDialog.init();
});