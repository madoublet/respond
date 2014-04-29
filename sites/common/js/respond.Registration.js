/*
	Handles the login for Respond CMS
*/
var respond = respond || {};

respond.Registration = function(config){

	this.el = config.el;
	
	var context = this.el;
	
	$(context).find('.icon-spinner').hide();
	
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
		
		// process registration
		function processRegistration(){
			$.ajax({
				url: pageModel.apiEndpoint + 'api/user/add',
				type: 'POST',
				data: {firstName: firstName, lastName: lastName, email: email, password: password, language: language},
				success: function(data){
				
					$(content).find('input[type=text], input[type=password], input[type=email]').val('');
					$(context).find('.captcha-error, .registration-error, .registration-required-error').hide();
					$(context).find('.registration-success').show();
					$(context).find('.captcha').removeClass('alert alert-danger');
					
				},
				error: function(xhr, errorText, thrownError){
					$(context).find('.registration-error').show();
				}
	        });
        }
        
        if(respond.Registration.hasCaptcha(context)) {
        
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
					processRegistration();
				} else {
					$(context).find('.captcha-error').show();
					$(context).find('.captcha').addClass('alert alert-danger').show();
				}
				Recaptcha.reload();
			});
		} 
		else{
			processRegistration();
		}
        
        return false;
		
	});
	
}


respond.Registration.hasCaptcha = function(el) {
	var hasCaptcha = false;
	
	var fields = $(el).find('div.captcha');
	
	if(fields.length > 0){
		return true;
	}
	else{
		return false;
	}
}