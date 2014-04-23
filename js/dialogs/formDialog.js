var formDialog = {

	dialog: null,
	id: -1,

	init:function(){

		formDialog.dialog = $('#formDialog');

		// show/hide custom options
	 	$('#formType').on('change', function(){
      
		 	var type = $(this).val();
      
		 	// show custom
		 	if(type == 'custom'){
			 	$('.form-custom').show();
		 	}
		 	else{
		 		$('#formAction').val('');
			 	$('.form-custom').hide();
			 }


			return false;
		});
    
		$('#updateForm').on('click', function(){

			var id = $('#formId').val();
			
			var type = $('#formType').val();
			var action = $('#formAction').val();
			var successMessage = $('#formSuccessMessage').val();
			var errorMessage = $('#formErrorMessage').val();
			var submitText = $('#formSubmitText').val();
			
			$('#'+formDialog.id).attr('data-type', type);
			$('#'+formDialog.id).attr('data-action', action);
			$('#'+formDialog.id).attr('data-success', successMessage);
			$('#'+formDialog.id.id).attr('data-error', errorMessage);
			$('#'+id).attr('data-submit', submitText);
			
			$('#'+formDialog.id).prop('id', id);
			
			
			$('#formDialog').modal('hide');


		});
	},

	show:function(id){ // shows the dialog
	 
	 	formDialog.id = id;
	 	
	 	var type = $('#'+id).attr('data-type');
	 	
	 	if(type == ''){
		 	type = 'default';
	 	}
	 	
	 	var action = $('#'+id).attr('data-action');
	 	
	 	if(action == '' || action == undefined){
		 	action = '';
	 	}
	 	
	 	var successMessage = $('#'+id).attr('data-success');
	 	
	 	if(successMessage == '' || successMessage == undefined){
		 	successMessage = $('#formSuccessMessage').get(0).defaultValue;
	 	}
	 	
	 	var errorMessage = $('#'+id).attr('data-error');
	 	
	 	if(errorMessage == '' || errorMessage == undefined){
		 	errorMessage = $('#formErrorMessage').prop('defaultValue');
	 	}
	 	
	 	var submitText = $('#'+id).attr('data-submit');
	 	
	 	if(submitText == '' || submitText == undefined){
		 	submitText = $('#formSubmitText').prop('defaultValue');
	 	}
	 	
	 	$('#formId').val(id);
	 	$('#formType').val(type);
	 	$('#formAction').val(action);
	 	$('#formSuccessMessage').val(successMessage);
	 	$('#formErrorMessage').val(errorMessage);
	 	$('#formSubmitText').val(submitText);
	 	
	 	// show custom
	 	if(type == 'custom'){
		 	$('.form-custom').show();
	 	}
	 	else{
		 	$('.form-custom').hide();
		 }

	    $('#formDialog').modal('show');

	}

}

$(document).ready(function(){
  	formDialog.init();
});