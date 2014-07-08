var fieldDialog = {

	dialog: null,
	editor: null,
	formId: -1,
	container: null,

	init:function(){

		fieldDialog.dialog = $('#fieldDialog');

	 	$('#fieldType').change(function(){
      
			var fieldType = $('#fieldType').val();
	      
			if(fieldType=='select' || fieldType=='checkboxlist' || fieldType=='radiolist' || fieldType=='hidden'){
				$('#options').show();
			}
			else{
				$('#options').hide();
			}

			return false;
		});
		
		$('#fieldLabel').keyup(function(){
    		var keyed = $(this).val().toLowerCase().replace(/[^a-zA-Z 0-9]+/g,'').replace(/\s/g, '-');
			keyed = keyed.substring(0,25);
			$('#fieldName').val(keyed);
		});
    
		$('#addField, #updateField').click(function(){

			var fieldType = $('#fieldType').val();
			var required = $('#fieldRequired').val();
			var fieldLabel = $('#fieldLabel').val().trim();
			var id = $('#fieldName').val().trim();
			var options = $('#fieldOptions').val();
			
			if(id == ''){
				id = fieldLabel.toLowerCase();
				id = id.replace(/ /g, '-');
				id = id.replace(/:/g, '');
			}
			
			var helperText = $('#fieldHelperText').val().trim();
			var placeholder = $.trim($('#fieldPlaceholderText').val());
			var cssClass = $.trim($('#fieldCssClass').val());
			
			if(cssClass != ''){
				cssClass = ' ' + cssClass;
			}
			
			if(placeholder != ''){
				placeholder = ' placeholder="' + placeholder + '"';
			}

			var html = respond.defaults.elementMenuField +
							'<div class="form-group' + cssClass + '" data-type="'+ fieldType + '"';

			if(required=='yes'){
				html += ' data-required="true"';
			}

			html += '><label for="' + id + '"';
			html += '>' + fieldLabel + '</label>';

			if(fieldType=='text'){
				html += '<input id="' + id + '" name="' + id + '" type="text" class="form-control"'+placeholder+'>';
			}

			if(fieldType=='hidden'){
				// first we force the label to not visible
				htmltmp = html.substring(0, html.indexOf('<label for=', 1));
				htmltmp += '<label style="display:none;" for=';
				htmltmp += html.substring(html.indexOf('<label for=', 1) + 11);
				html =  htmltmp + '<input id="' + id + '" name="' + id + '" type="hidden" value="' + options + '" class="form-control"'+placeholder+'>';
				helperText = '';
			}

			if(fieldType=='textarea'){
				html += '<textarea id="' + id + '" name="' + id + '" class="form-control"></textarea>\n';
			}

			if(fieldType=='select'){
				html += '  <select id="' + id + '" name="' + id + '" class="form-control">\n';

				var arr = options.split(',');

				for(x=0; x<arr.length; x++){
		  			html += '<option>' + $.trim(arr[x]) + '</option>\n';
				}

				html += '</select>'
			}

			if(fieldType=='checkboxlist'){
				html += '<span class="list">';

				var arr = options.split(',');

				for(x=0; x<arr.length; x++){
		  			html += '<label class="checkbox"><input name="' + id + '" type="checkbox" value="' + $.trim(arr[x]) + '">' + $.trim(arr[x]) + '</label>';
				}

				html += '</span>';
			}

			if(fieldType=='radiolist'){
				html += '<span class="list">';

				var arr = options.split(',');

				for(x=0; x<arr.length; x++){
		  			html += '<label class="radio"><input name="' + id + '" type="radio" value="' + $.trim(arr[x]) + '" name="' + id + '">' + $.trim(arr[x]) + '</label>';
				}

				html += '</span>';
			}

			if(helperText != '') {
				html += '<span class="help-block">' + helperText + '</span>';
			}

			if (fieldType=='recaptcha') {
				var html = respond.defaults.elementMenuField +
				'<div id="recaptcha" class="form-group' + cssClass + '" data-type="'+ fieldType + '">{{reCaptcha}}';
			}

			html += '</div>';

			// add a new container to the editor
			if(fieldDialog.container == null){
				
				html = '<span class="field-container">' + html + '</span>';
				
				var formId = fieldDialog.formId;

				var editor = fieldDialog.editor;	
	
				if($('div#'+formId+' span.field-container:last-child').get(0)){
					$(editor).find('div#'+formId+' span.field-container:last-child').after(html);
				}
				else{
					$(editor).find('div#'+formId+' div.field-list').html(html);
				}
			}
			else{ // edit existing container
				$(fieldDialog.container).html(html);
			}
			
			$('#fieldDialog').modal('hide');

			return false;
		});
	},

	show:function(editor, formId){ // shows the dialog
	 
	 	fieldDialog.editor = editor;
		fieldDialog.formId = formId;
		fieldDialog.container = null;
		
		// toggle add/edit
		$('#fieldDialog .add').show();
		$('#fieldDialog .edit').hide();

	    $('#options').hide();
	    $('#fieldLabel').val('');
	    $('#fieldName').val('');
	    $('#fieldType').val('');
	    $('#fieldOptions').val('');
	    $('#fieldHelperText').val('');
	    $('#fieldPlaceholderText').val('');
	    $('#fieldCssClass').val('');
	  
	    $('#fieldDialog').modal('show');

	},
	
	edit:function(container){ // shows the dialog
	
		fieldDialog.container = container;
		
		// toggle add/edit
		$('#fieldDialog .add').hide();
		$('#fieldDialog .edit').show();

	 	var type = $(container).find('.form-group').attr('data-type');
	 	var label = $(container).find('.form-group>label').text();
	 	var id = $(container).find('label').attr('for');
	 	var required = $(container).find('.form-group').attr('data-required');
	 	var options = '';
	 	
	 	if(required == '' || required == undefined){
		 	required = 'no';
	 	}
	 	else{
		 	required = 'yes';
	 	}
	 	
	 	// parse options
	 	if(type=='select'){
	 	
	 		var opts = $(container).find('option');
	 		
	 		for(x=0; x<opts.length; x++){
		 		options += $(opts[x]).text() + ', ';
	 		}
		}

		if(type=='checkboxlist'){
		
			var checks = $(container).find('input[type=checkbox]');
	 		
	 		for(x=0; x<checks.length; x++){
		 		options += $(checks[x]).val() + ', ';
	 		}
	
		}

		if(type=='radiolist'){
		
			var radios = $(container).find('input[type=radio]');
	 		
	 		for(x=0; x<radios.length; x++){
		 		options += $(radios[x]).val() + ', ';
	 		}
		
		}

		// trim trailing options
		if(options.length > 2){
			 options = options.substring(0, options.length-2);
		}

		if(type=='hidden'){
	 		var options = $(container).find(':input[type=hidden]').val();
		}

		// hide/show options
		if(type=='select' || type=='checkboxlist' || type=='radiolist' || type=='hidden'){
			$('#options').show();
		}
		else{
			$('#options').hide();
		}
		
		// get placeholder
		var placeholder = $(container).find('input[type=text]').attr('placeholder');
		
		if(placeholder == undefined){
			placeholder = '';
		}
		
		// get helper text
		var helper = $(container).find('.help-block').text();
		
		if(helper == undefined){
			helper = '';
		}
		
		// get css
		var cssClass = $(container).find('.form-group').attr('class');
		cssClass = global.replaceAll(cssClass, 'form-group', '');
		cssClass = global.replaceAll(cssClass, 'ui-sortable', '');
		
		cssClass = $.trim(cssClass);
		
		// set values
		$('#fieldType').val(type);
	 	$('#fieldLabel').val(label);
	 	$('#fieldName').val(id);
	 	$('#fieldRequired').val(required);
	 	$('#fieldOptions').val(options);
	 	$('#fieldPlaceholderText').val(placeholder);
	 	$('#fieldHelperText').val(helper);
	 	$('#fieldCssClass').val(cssClass);
	  
	    $('#fieldDialog').modal('show');

	}

}

$(document).ready(function(){
  	fieldDialog.init();
});