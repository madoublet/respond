var slideshowDialog = {

	editor: null,
	dialog: null,
	id: -1,

	init:function(){

		slideshowDialog.dialog = $('#slideshowDialog');

		$('#addSlideShow').click(function(){
			var editor = slideshowDialog.editor;

			var uniqId = slideshowDialog.id;

			var display = $('#slideShowDisplay').val();

			var html = '<div id="' + uniqId + '" class="slideshow" data-display="'+display+'">' +
				respond.defaults.elementMenuNoConfig +
				'<div class="images"><button type="button" class="add-image"><i class="fa fa-picture-o"></i></button>' +
				'</div>' +
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
		slideshowDialog.id = id;

		$('#slideShowDisplay').val('slideshow');
    
		$('#slideshowDialog').modal('show'); // show modal
	 
	}

}

$(document).ready(function(){
	slideshowDialog.init();
});