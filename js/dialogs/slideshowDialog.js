var slideshowDialog = {

	editor: null,
	dialog: null,
	id: -1,

	init:function(){

		slideshowDialog.dialog = $('#slideshowDialog');

		$('#addSlideShow').click(function(){
			var editor = slideshowDialog.editor;

			var moduleId = slideshowDialog.id;

			var width = $('#slideShowWidth').val();
			var height = $('#slideShowHeight').val();

			var html = '<div id="' + moduleId + '" class="slideshow" data-width="'+width+'" data-height="'+height+'">' +
				respond.defaults.elementMenuNoConfig +
				'<div class="images"><button type="button" class="add-image"><i class="fa fa-picture-o"></i></button>' +
				'</div>' +
				'<em class="size">'+
				width + 'px x ' + height + 'px' +
				'</em>'+
				'</div>';

			respond.Editor.Append(editor,
				html);
			
			// setup sorting on slideshows
			$('.slideshow div').sortable({handle:'img', items:'span.image', placeholder: 'editor-highlight', opacity:'0.6', axis:'x'});

			$('#slideshowDialog').modal('hide');
		});
	},

	show:function(editor, id){ // shows the dialog
	
		slideshowDialog.editor = editor;

		$('#slideshowId').val(id);
    	$('#slideShowWidth').val('1024');
    	$('#slideShowHeight').val('768');

		$('#slideshowDialog').modal('show'); // show modal
	 
	}

}

$(document).ready(function(){
	slideshowDialog.init();
});