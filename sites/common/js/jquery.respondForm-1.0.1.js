(function($){  
	$.fn.respondProcessForm = function(){
        
		var context = this;

		var siteUniqId = $('body').attr('data-siteuniqid');
    	var pageUniqId = $('body').attr('data-pageuniqid');
		
		// build body
		var fields = $(context).find('div.control-group');
		
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
            
            message.showMessage('progress', 'Submitting form...');
            
            // post to API
            $.ajax({
                    url: pageModel.apiEndpoint+'api/form',
        			type: 'POST',
        			data: {siteUniqId: siteUniqId, pageUniqId: pageUniqId, body: body},
        			success: function(data){
                        
                        $('span.field.error').removeClass('error');
            			message.showMessage('success', 'You have successfully submitted the form.');
        				
        				$('div.formgroup input').val('');
        				$('div.formgroup textarea').val('');
        				$('div.formgroup select').val('');
        				$('div.formgroup input[type=radio]').attr('checked', false);
        				$('div.formgroup input[type=checkbox]').attr('checked', false);
        			}
            });

		}
		else{
			message.showMessage('error', 'You are missing one or more required fields.');
		}
		
	}	
})(jQuery);


(function($){  
	$.fn.respondValidateForm = function(){
        
		var context = this;
		
		var siteUniqId = $('body').attr('data-siteuniqid');
        var pageUniqId = $('body').attr('data-pageuniqid');
		
		// build body
		var fields = $(context).find('div.control-group');

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
			message.showMessage('error', 'You are missing one or more required fields.');
		}

		return hasError;
		
	}	
})(jQuery);


(function($){  
	$.fn.respondSetRequired = function(){
		
        var fields = $(this).find('div.control-group');
		
		for(var x=0; x<fields.length; x++){
			var req = $(fields[x]).attr('data-required');	
			
			var label = $(fields[x]).find('label:first');
			
			if(req=='true'){
				$(label).html('* '+$(label).html());
				$(fields[x]).addClass('required');
			}	
		}
		
	}	
})(jQuery);


(function($){  
	$.fn.respondForm = function(){
        
        $(this).respondSetRequired(); // set required

        function submitForm(form){
            
            $(form).find('button').click(function(){ 
    
    	        var hasError = $(form).respondValidateForm();
    
    	        if(hasError==false){
    	        	$(form).respondProcessForm();
    	        }
    	    });
        }
        
        submitForm(this); 
        
	}	
})(jQuery);

