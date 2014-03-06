var formDialog = {

	dialog: null,
	editor: null,
	id: -1,

	init:function(){

		formDialog.dialog = $('#formDialog');

	 	$('#formType').change(function(){
      

			return false;
		});
    
		$('#addForm').click(function(){

		});
	},

	show:function(editor, id){ // shows the dialog
	 
	 	formDialog.editor = editor;
		formDialog.id = id;

	    $('#formDialog').modal('show');

	}

}

$(document).ready(function(){
  	formDialog.init();
});