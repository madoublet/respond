// models the settings page
var profileModel = {
    
    user: ko.observable(''),
    languages: ko.observableArray([]),
    
    init:function(){ // initializes the model
    	profileModel.updateLanguages();
        profileModel.updateProfile();
        
        ko.applyBindings(profileModel);  // apply bindings
	},
    
    updateProfile:function(o){
    
        $.ajax({
    		url: 'api/user/current',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
                
                var user = User.create(data);
                
                profileModel.user(user);
			}
		});
        
    },
    
    updateLanguages:function(){
        
        profileModel.languages.removeAll();
       
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
                
					profileModel.languages.push(language); 
				}

			}
		});
    },
    
    save:function(o, e){
        
		var firstName = jQuery.trim($('#firstName').val());
        var lastName = jQuery.trim($('#lastName').val());
        var language = $('#language').val();
        var email = jQuery.trim($('#email').val());
        var password = jQuery.trim($('#password').val());
        var retype = jQuery.trim($('#retype').val());
        
        if(firstName=='' || lastName=='' || email=='' || password==''){
            message.showMessage('error', $('#msg-all-required').val());
            return;
        }
        
        if(password != retype){
            message.showMessage('progress', $('#msg-match').val());
            return;
        }
           
    
        var userUniqId = profileModel.user().userUniqId();
   
        message.showMessage('progress', $('#msg-updating').val());

        $.ajax({
          url: 'api/user/' + userUniqId,
          type: 'POST',
          data: {firstName: firstName, lastName: lastName, language: language, email: email, password: password},
          success: function(data){

            // update the model
            profileModel.user().firstName(firstName);
            profileModel.user().lastName(lastName);
            profileModel.user().language(language);
            profileModel.user().email(email);
            profileModel.user().password('temppassword');
            
            message.showMessage('success', $('#msg-updated').val());
     
          }
        });    
        
    }
}

profileModel.init();