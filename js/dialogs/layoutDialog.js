var layoutDialog = {

	dialog: null,
	selection: null,

	init:function(){

		layoutDialog.dialog = $('#layoutDialog');

		// hides the dialog		
		$('#layoutDialog button').on('click', function(){
			$('#layoutDialog').modal('hide'); 
		});
        
	},
    
    addIcon:function(){
        
    },

	// shows the dialog
	show:function(editor){ 
		
		// set editor
		var id = $(editor).attr('id');
		
		$('#layoutDialog').find('button').attr('data-target', id);
	
	    $('#layoutDialog').modal('show'); // show modal
	}

}

$(document).ready(function(){
  layoutDialog.init();
});