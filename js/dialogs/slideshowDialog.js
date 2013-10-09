var slideshowDialog = {

	dialog: null,
	id: -1,

	init:function(){

		slideshowDialog.dialog = $('#slideshowDialog');

		$('#addSlideShow').click(function(){
			var editor = $('#desc');

			var moduleId = slideshowDialog.id;

			var width = $('#slideShowWidth').val();
			var height = $('#slideShowHeight').val();

			var html = '<div id="' + moduleId + '" class="slideshow" data-width="'+width+'" data-height="'+height+'"><div>' +
				'<button type="button" class="addImage"></button>' +
				'</div><span class="marker icon-film" title="Module"></span><a class="remove icon-remove-sign"></a>' +
				'<em class="size">'+
				width + 'px x ' + height + 'px' +
				'</em>'+
				'</div>';

			$(editor).respondAppend(html);

			$('#slideshowDialog').modal('hide');
		});
	},

	show:function(id){ // shows the dialog

		$('#slideshowId').val(id);
    	$('#slideShowWidth').val('1024');
    	$('#slideShowHeight').val('768');

		$('#slideshowDialog').modal('show'); // show modal
	 
	}

}

$(document).ready(function(){
  slideshowDialog.init();
});