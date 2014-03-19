/*
	Handles the login for Respond CMS
*/
var respond = respond || {};

respond.Registration = function(config){

	this.el = config.el;
	
	var context = this.el;
	
	// hide errors
	$(this.el).find('.alert-success').hide();
	$(this.el).find('.alert-danger').hide();
	
	$(this.el).find('button[type=submit]').on('click', function(){
		
		var firstName = $(context).find('.firstName').val();
		var lastName = $(context).find('.lastName').val();
		var email = $(context).find('.email').val();
		var password = $(context).find('.password').val();
		var retype = $(context).find('.retype').val();
    	var language = $('html').attr('lang');
		var site = $('body').attr('data-sitefriendlyid');
		
		// reset errors
		$(context).find('.registration-success').hide();
		$(context).find('.registration-error').hide();
		$(context).find('.registration-retype-error').hide();
		$(context).find('.registration-required-error').hide();
		
		// show required error
		if(firstName == '' || lastName == '' || email == '' || password == '' || retype == ''){
			$(context).find('.registration-required-error').show();
			return;
		}
		
		// show retype errors
		if(password != retype){
			$(context).find('.registration-retype-error').show();
			return;
		}
		
		$.ajax({
			url: pageModel.apiEndpoint + 'api/user/add',
			type: 'POST',
			data: {firstName: firstName, lastName: lastName, email: email, password: password, language: language, site: site},
			success: function(data){
			
				$(content).find('input[type=text], input[type=password], input[type=email]').val('');
				$(context).find('.registration-success').show();
				
			},
			error: function(xhr, errorText, thrownError){
				$(context).find('.registration-error').show();
			}
        });
        
        return false;
		
	});
	
}