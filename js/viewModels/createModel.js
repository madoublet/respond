// models the create page
var createModel = {
    
    timeZone: ko.observable('America/Chicago'),
    languages: ko.observableArray([]),
    
    init:function(){
        
        var tz = jstz.determine();
        createModel.timeZone(tz.name());
        
        $('#name').keyup(function(){
    		var keyed = $(this).val().toLowerCase().replace(/[^a-zA-Z 0-9]+/g,'').replace(/\s/g, '');
			keyed = keyed.substring(0,25);
			$('#tempUrl').removeClass('temp');
			$('#tempUrl').html(keyed);
			$('#friendlyId').val(keyed);
		});
		
		// validate site id
		$('#name').blur(function(){
			
			$('#site-invalid').hide()
			$('#site-valid').hide();
			$('#validate-site').show();
			
			var name = $.trim($('#name').val());
			var friendlyId = $('#friendlyId').val();
			
			if(name == ''){
				$('#validate-site').hide();
				$('#site-invalid').show();
				return;
			}
			
			$.ajax({
	          url: 'api/site/validate/id',
	          type: 'POST',
	          data: {friendlyId: friendlyId},
	          success: function(data){
	            $('#site-invalid').hide()
				$('#site-valid').show();
				$('#validate-site').hide();
	          },
	          statusCode: {
	            401: function() {  // UNAUTHORIZED
	                $('#site-invalid').show()
					$('#site-valid').hide();
					$('#validate-site').hide();
	            },
	            409: function() {  // CONFLICT
	                $('#site-invalid').show()
					$('#site-valid').hide();
					$('#validate-site').hide();
	            }
	          },
	          error: function(data){}
	        });
			
		});
		
		
		// validate email
		$('#email').blur(function(){
			
			$('#email-invalid').hide()
			$('#email-valid').hide();
			$('#validate-email').show();
			
			var email = $.trim($('#email').val());
			
			if(email == ''){
				$('#validate-email').hide();
				$('#email-invalid').show();
				return;
			}
			
			$.ajax({
	          url: 'api/site/validate/email',
	          type: 'POST',
	          data: {email: email},
	          success: function(data){
	            $('#email-invalid').hide()
				$('#email-valid').show();
				$('#validate-email').hide();
	          },
	          statusCode: {
	            401: function() {  // UNAUTHORIZED
	                $('#email-invalid').show()
					$('#email-valid').hide();
					$('#validate-email').hide();
	            },
	            409: function() {  // CONFLICT
	                $('#email-invalid').show()
					$('#email-valid').hide();
					$('#validate-email').hide();
	            }
	          },
	          error: function(data){}
	        });
			
		});

        
        createModel.updateLanguages();
        
        ko.applyBindings(createModel);  // apply bindings
    },
    
    create:function(o, e){
        var friendlyId = $('#friendlyId').val();
        var name = $('#name').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var retype = $('#retype').val();
        var passcode = $('#passcode').val();
        var timeZone = $('#timeZone').val();
        var language = $('#language').val();
        
        if(name=='' || friendlyId=='' || email=='' || password=='' || retype==''){
			message.showMessage('error', $('#msg-create-required').val());
			return;
		}
		
		if(password!=retype){
			message.showMessage('error', $('#msg-password-error').val());
			return;
		}

        message.showMessage('progress', $('#msg-creating').val());

        $.ajax({
          url: 'api/site/create',
          type: 'POST',
          data: {friendlyId: friendlyId, name: name, email: email, password: password, passcode: passcode, timeZone: timeZone, language: language},
          success: function(data){
            message.showMessage('success', $('#msg-created-successfully').val());
            
            $('#create-form').hide();
			$('#create-confirmation').show();
		
			// update site link
			href = $('#siteLink').html();
			href = href.replace('{friendlyId}', friendlyId);
			$('#siteLink').html(href);
			$('#siteLink').attr('href', href);
          },
          statusCode: {
            401: function() {  // UNAUTHORIZED
                message.showMessage('error', $('#msg-passcode-invalid').val());
            },
            409: function() {  // CONFLICT
                message.showMessage('error', $('#msg-email-invalid').val());
            }
          },
          error: function(data){}
        });

        return false;
    },
    
    updateLanguages:function(){
        
        createModel.languages.removeAll();
       
    	$.ajax({
			url: 'data/languages.json',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
	
                for(x in data.languages){
    
    				var language = {
        			    'code': data.languages[x]['code'],
                        'text': data.languages[x]['text']
    				};
                
					createModel.languages.push(language); 
				}

			}
		});
    },
    
}

createModel.init();
