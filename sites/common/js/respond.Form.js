/*
	Creates the form for Respond CMS
*/
var respond = respond || {};

respond.Form = function(config){

	this.el = config.el;
	
	// set required fields
	this.setRequired();
	
	// set context for event
	var context = this;
	
	// handle click of button
	$(this.el).find('button').on('click', function(){
		
		var hasError = context.validate();
		
		if(hasError == false){
			context.process();
		}
		
		return false;
		
	});
	
}

// sets required fields for the form
respond.Form.prototype.setRequired = function(){
   
	var fields = $(this.el).find('div.form-group');
		
	for(var x=0; x<fields.length; x++){
		var req = $(fields[x]).attr('data-required');	
		
		var label = $(fields[x]).find('label:first');
		
		if(req=='true'){
			$(label).html('* '+$(label).html());
			$(fields[x]).addClass('required');
		}	
	}
   
}

// validates fields in the form
respond.Form.prototype.validate = function(){
	
	var siteUniqId = $('body').attr('data-siteuniqid');
    var pageUniqId = $('body').attr('data-pageuniqid');
	
	// build body
	var fields = $(this.el).find('div.form-group');

	var hasError = false;

	for(var x=0; x<fields.length; x++){
		var label = $(fields[x]).find('label').html();
		var label = label.replace('* ', '');
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
		$(this.el).find('.alert-danger').show();
	}

	return hasError;

	
}

// processes the form
respond.Form.prototype.process = function(){
	
	var siteUniqId = $('body').attr('data-siteuniqid');
	var pageUniqId = $('body').attr('data-pageuniqid');
	
	// build body
	var fields = $(this.el).find('div.form-group');
	
	var body = '<table>';
	var hasError = false;

	for(var x=0; x<fields.length; x++){
		var label = $(fields[x]).find('label').html();
		var label = label.replace('* ', '');
		var text = '';
		
		var type = $(fields[x]).attr('data-type');
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
	
        $(this.el).find('.icon-spinner').show();
        
        var context = this;
        
        // post to API
        $.ajax({
            url: pageModel.apiEndpoint+'/api/form',
			type: 'POST',
			data: {siteUniqId: siteUniqId, pageUniqId: pageUniqId, body: body},
			success: function(data){
                
                $(context.el).find('.error').removeClass('error');
    			
				$('div.formgroup input').val('');
				$('div.formgroup textarea').val('');
				$('div.formgroup select').val('');
				$('div.formgroup input[type=radio]').attr('checked', false);
				$('div.formgroup input[type=checkbox]').attr('checked', false);
				
				
				$(context.el).find('input').val('');
				$(context.el).find('select').val('');
				$(context.el).find('textarea').val('');
				$(context.el).find('.alert-danger').hide();
				$(context.el).find('.alert-success').show();
				$(context.el).find('.icon-spinner').hide();
			}
        });

	}
	else{
		$(this.el).find('.alert-danger').show();
	}
	
}