var slideDialog = {

	dialog: null,
	imageId: null,

	init:function(){

		slideDialog.dialog = $('#slideDialog');

		$('#slideDialog .segmented-control li').on('click', function(){
			
			$(this).parent().find('li').removeClass('active');
			$(this).addClass('active');
			
			var segment = $(this).attr('data-navigate');
			
			$('#slideDialog').find('.segment').hide();
			$('#'+segment).show();
			
		});

		$('#updateSlide').on('click', function(){
		  
			var imageId = slideDialog.imageId;

			// Store values from dialog
			$('#'+imageId).attr('title', $('#slideCaption').val());
			$('#'+imageId).attr('id', $('#slideId').val());
			$('#'+imageId).attr('data-slidecssclass', $('#slideCssClass').val());
			$('#'+imageId).attr('data-headline', $('#slideHeadline').val());
			$('#'+imageId).attr('data-buttonlabel', $('#slideButtonLabel').val());
			$('#'+imageId).attr('data-buttonurl', $('#slideButtonURL').val());
			$('#'+imageId).attr('target', $('#slideButtonTarget').val());

			$('#slideDialog').modal('hide');
		});

	},

	show:function(imageId){ // shows the dialog

		slideDialog.imageId = imageId;

		// Populate dialog with initial values
		$('#slideId').val( $('#'+imageId).attr('id') );
		$('#slideCssClass').val( $('#'+imageId).attr('data-slidecssclass') );
		$('#slideCaption').val( $('#'+imageId).attr('title') );
		$('#slideHeadline').val( $('#'+imageId).attr('data-headline') );
		$('#slideButtonLabel').val( $('#'+imageId).attr('data-buttonlabel') );
		$('#slideButtonURL').val( $('#'+imageId).attr('data-buttonurl') );
		$('#slideButtonTarget').val( $('#'+imageId).attr('target') );

		$('#slideDialog').find('.segment').hide(); // hide segments
		$('#slideDialog .segmented-control li').removeClass('active'); // make all tabs inactive

		$('#settings-general').show(); // show the general settings segment
		$('#slideDialog .segmented-control li:first-child').addClass('active'); // make the general settings tab active

		$('#slideDialog').modal('show'); // show modal
	}
}

$(document).ready(function(){
	slideDialog.init();
});