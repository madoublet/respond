var fieldDialog = {

	dialog: null,
	formId: -1,

	init:function(){

		fieldDialog.dialog = $('#fieldDialog');

	 	$('#fieldType').change(function(){
      
			var fieldType = $('#fieldType').val();
	      
			if(fieldType=='select' || fieldType=='checkboxlist' || fieldType=='radiolist'){
				$('#options').show();
			}
			else{
				$('#options').hide();
			}

			return false;
		});
    
		$('#addField').click(function(){

			var fieldType = $('#fieldType').val();
			var required = $('#fieldRequired').val();
			var fieldName = $('#fieldName').val().trim();
			var options = $('#fieldOptions').val();
			var id = fieldName.toLowerCase();
			var id = id.replace(/ /g, '-');
			var id = id.replace(/:/g, '');
			var helperText = $('#fieldHelperText').val().trim();

			var html = '<span class="field-container">';
			html += '<div class="control-group" data-type="'+ fieldType + '"';

			if(required=='yes'){
				html += ' data-required="true"';
			}

			html += '><label for="' + id + '"';
			html += ' class="control-label">' + fieldName + '</label><div class="controls">';

			if(fieldType=='text'){
				html += '<input id="' + id + '" type="text">';
			}

			if(fieldType=='textarea'){
				html += '<textarea id="' + id + '"></textarea>\n';
			}

			if(fieldType=='select'){
				html += '  <select id="' + id + '">\n';

				var arr = options.split(',');

				for(x=0; x<arr.length; x++){
		  			html += '<option>' + jQuery.trim(arr[x]) + '</option>\n';
				}

				html += '</select>'
			}

			if(fieldType=='checkboxlist'){
				html += '<span class="list">';

				var arr = options.split(',');

				for(x=0; x<arr.length; x++){
		  			html += '<label class="checkbox"><input type="checkbox" value="' + jQuery.trim(arr[x]) + '">' + jQuery.trim(arr[x]) + '</label>';
				}

				html += '</span>';
			}

			if(fieldType=='radiolist'){
				html += '<span class="list">';

				var arr = options.split(',');

				for(x=0; x<arr.length; x++){
		  			html += '<label class="radio"><input type="radio" value="' + jQuery.trim(arr[x]) + '" name="' + id + '">' + jQuery.trim(arr[x]) + '</label>';
				}

				html += '</span>';
			}

			if(helperText != '') {
				html += '<span class="help-block">' + helperText + '</span>';
			}

			html += '</div></div>';

			html += '<a class="remove-field" href="#"></a><span class="marker-field" title="Field"><i class="icon-resize-vertical"></i></span>';
			html += '</span>';

			var formId = fieldDialog.formId;

			var editor = $('#desc');

			if($('div#'+formId+' span.field-container:last-child').get(0)){
				$(editor).find('div#'+formId+' span.field-container:last-child').after(html);
			}
			else{
				$(editor).find('div#'+formId+' div').html(html);
			}

			$(editor).respondHandleEvents();

			$('#fieldDialog').modal('hide');

			return false;
		});
	},

	show:function(formId){ // shows the dialog
	 
		fieldDialog.formId = formId;

	    $('#options').hide();
	    $('#fieldName').val('');
	    $('#fieldType').val('');
	    $('#fieldOptions').val('');
	    $('#fieldHelperText').val('');
	  
	    $('#fieldDialog').modal('show');

	}

}

$(document).ready(function(){
  	fieldDialog.init();
});