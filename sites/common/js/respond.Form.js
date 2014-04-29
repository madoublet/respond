/*
	Creates the form for Respond CMS
*/
var respond = respond || {};

respond.Form = function(config){

	// set context for event
	var context = config.el;
	
	// hide spinner by default
	$(context).find('.icon-spinner').hide();
	
	// set required fields
	respond.Form.SetRequired(context);
	
	// handle click of button
	$(context).find('button').on('click', function(){
		
		var hasError = respond.Form.Validate(context);
		
		if(hasError == false){
			if (respond.Form.hasCaptcha(context)) {
				$('#recaptcha').removeClass('alert alert-danger');
				$(context).find('.icon-spinner').show();
				var siteUniqId = $('body').attr('data-siteuniqid');
				var pageUniqId = $('body').attr('data-pageuniqid');
				$.when($.ajax({
					url: pageModel.apiEndpoint+'api/checkCaptcha',
					type: 'POST',
					data: {siteUniqId: siteUniqId, pageUniqId: pageUniqId,
						recaptcha_challenge_field: $('#recaptcha_challenge_field').val(),
						recaptcha_response_field: $('#recaptcha_response_field').val()}
				})).then(function (data, textStatus, jqXHR) {
					$(context).find('.icon-spinner').hide();
					if (data=='OK') {
						respond.Form.Process(context);
					} else {
						$(context).find('.alert-danger').show();
						$('#recaptcha').addClass('alert alert-danger').show();
					}
					Recaptcha.reload();
				});
			} else {
				respond.Form.Process(context);
			}
		}
		
		return false;
		
	});
	
}

// sets required fields for the form
respond.Form.SetRequired = function(el){
   
	var fields = $(el).find('div.form-group');
		
	for(var x=0; x<fields.length; x++){
		var req = $(fields[x]).attr('data-required');	
		
		var label = $(fields[x]).find('label:first');
		
		if(req=='true'){
			$(label).html('* '+$(label).html());
			$(fields[x]).addClass('required');
		}	
	}
   
}

// check if the current form has a reCaptcha field
respond.Form.hasCaptcha = function(el) {
	var hasCaptcha = false;
	var fields = $(el).find('div.form-group');
	var x=0;
	while (x<fields.length && !hasCaptcha) {
		hasCaptcha = ($(fields[x]).attr('data-type')=='recaptcha');
		x++;
	}
	return hasCaptcha;
}

// validates fields in the form
respond.Form.Validate = function(el){
	
	var siteUniqId = $('body').attr('data-siteuniqid');
    var pageUniqId = $('body').attr('data-pageuniqid');
	
	// build body
	var fields = $(el).find('div.form-group');

	var hasError = false;

	for(var x=0; x<fields.length; x++){
		var label = $(fields[x]).find('label').html();
		var label = (!label ? '' : label.replace('* ', ''));
		var text = '';
		
		var type = $(fields[x]).attr('data-type');
		var required = false;
		var req = $(fields[x]).attr('data-required');
		if(req){
			if(req=='true')required = true;
		}
		
		if(type=='text'){
			text = $.trim($(fields[x]).find('input[type=text]').val());
			
			if(required==true && text==''){
				hasError = true;
				$(fields[x]).addClass('error');
			}
			else{
				$(fields[x]).removeClass('error');
			}
		}
		else if(type=='textarea'){
			text = $.trim($(fields[x]).find('textarea').val());
			
			if(required==true && text==''){
				hasError = true;
				$(fields[x]).addClass('error');
			}
			else{
				$(fields[x]).removeClass('error');
			}
	
		}
		else if(type=='select'){
			text = $(fields[x]).find('select').val();
			
			if(required==true && text==''){
				hasError = true;
				$(fields[x]).addClass('error');
			}
			else{
				$(fields[x]).removeClass('error');
			}
		}
		else if(type=='radiolist'){
			text = $(fields[x]).find('input[type=radio]:checked').val();
			
			if(text==undefined)text = '';
			
			if(required==true && text==''){
				hasError = true;
				$(fields[x]).addClass('error');
			}
			else{
				$(fields[x]).removeClass('error');
			}
			
		}
		else if(type=='checkboxlist'){
			var checkboxes = $(fields[x]).find('input[type=checkbox]:checked');
			
			for(var y=0; y<checkboxes.length; y++){
				text += '<span class="item">'+$(checkboxes[y]).val()+'</span>';
			}
			
			if(required==true && text==''){
				hasError = true;
				$(fields[x]).addClass('error');
			}
			else{
				$(fields[x]).removeClass('error');
			}
			
		}
	
	}
	
	if(hasError == true){
		$(el).find('.alert-danger').show();
	}

	return hasError;

	
}

// processes the form
respond.Form.Process = function(el){
	
	var siteUniqId = $('body').attr('data-siteuniqid');
	var pageUniqId = $('body').attr('data-pageuniqid');
	
	// build body
	var fields = $(el).find('div.form-group');
	
	var body = '<table>';
	var hasError = false;

	for(var x=0; x<fields.length; x++){
		var label = $(fields[x]).find('label').html();
		var label = (!label ? '' : label.replace('* ', ''));
		var text = '';
		
		var type = $(fields[x]).attr('data-type');
		
		if(type=='recaptcha') continue; // do not add recaptcha field to email

		var required = false;
		var req = $(fields[x]).attr('data-required');
		if(req){
			if(req=='true')required = true;
		}
		
		var span = '<span class="value">';
					
		if(type=='text'){
			text = $.trim($(fields[x]).find('input[type=text]').val());
			text = span+text+'</span>';
		}
		else if(type=='textarea'){
			text = $.trim($(fields[x]).find('textarea').val());
			text = span+text+'</span>';
		}
		else if(type=='select'){
			text = $(fields[x]).find('select').val();
			text = span+text+'</span>';
		}
		else if(type=='radiolist'){
			text = $(fields[x]).find('input[type=radio]:checked').val();
			
			if(text==undefined)text = '';
			text = span+text+'</span>';
		}
		else if(type=='checkboxlist'){
			var checkboxes = $(fields[x]).find('input[type=checkbox]:checked');
			
			for(var y=0; y<checkboxes.length; y++){
				text += '<span class="item">'+$(checkboxes[y]).val()+'</span>';
			}
			
			text = span+text+'</span>';
		}
	
		body += '<tr><td style="padding: 5px 25px 5px 0;">'+label+':</td><td style="padding: 5px 0">'+text+'</td></tr>';
	}
	
	body += '</table>'
	
	if(hasError == false){
	
        $(el).find('.icon-spinner').show();
        
        // post to API
        $.ajax({
            url: pageModel.apiEndpoint+'api/form',
			type: 'POST',
			data: {pageUniqId: pageUniqId, body: body},
			success: function(data){
			
                $(el).find('.error').removeClass('error');
    			
				$('div.formgroup input').val('');
				$('div.formgroup textarea').val('');
				$('div.formgroup select').val('');
				$('div.formgroup input[type=radio]').attr('checked', false);
				$('div.formgroup input[type=checkbox]').attr('checked', false);
				
				
				$(el).find('input').val('');
				$(el).find('select').val('');
				$(el).find('textarea').val('');
				$(el).find('.alert-danger').hide();
				$(el).find('.alert-success').show();
				$(el).find('.icon-spinner').hide();
			}
        });

	}
	else{
		$(el).find('.alert-danger').show();
	}
	
}