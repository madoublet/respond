// models the create page
var createModel = {
    
    timeZone: ko.observable('America/Chicago'),
    
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
    }
    
}

createModel.init();
