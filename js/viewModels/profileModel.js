// models the settings page
var profileModel = {
    
    user: ko.observable(''),
    languages: ko.observableArray([]),
    
    images: ko.observableArray([]),
    imagesLoading: ko.observable(false),
    
    newimages: ko.observableArray([]),
    
    init:function(){ // initializes the model
    	profileModel.updateLanguages();
        profileModel.updateProfile();
        
        Dropzone.autoDiscover = false;
        
        $("#drop").dropzone({ 
            url: "api/file/post",
            success: function(file, response){
                var image = response;
                
                var filename = response.filename;
    
                var match = ko.utils.arrayFirst(profileModel.images(), function (item) {
                                return item.filename === filename; 
                            });
                                
                if (!match) {
                    profileModel.images.push(image); 
                    profileModel.newimages.push(image); 
                }
            }
            
        })
        
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
    
    showEditDialog:function(o, e){ // shows a dialog to add a page
    
        $('#password').val('temppassword');
        $('#retype').val('temppassword');

		$('#editDialog').modal('show');

		return false;
	},
    
    editUser:function(o, e){
        
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
            profileModel.updateProfile();
            
            // update the menu
            $('#menu-name').text(firstName + ' ' + lastName);
            
            message.showMessage('success', $('#msg-updated').val());
            
            $('#editDialog').modal('hide');
     
          }
        });    
        
    },
    
    setImage:function(o, e){
    
        var photoUrl = o.filename;
        
        message.showMessage('progress', $('#msg-updating').val());
        
		$.ajax({
			url: 'api/user/photo/',
			type: 'POST',
			data: {userUniqId: profileModel.user().userUniqId(), photoUrl:photoUrl},
			dataType: 'json',
			success: function(data){
     
                message.showMessage('success', $('#msg-updated').val());
                
                $('#imagesDialog').modal('hide');
                
                // update the menu
	            var sitename = $('body').attr('data-sitefriendlyid');
	            $('#menu-photo').attr('style', 'background-image:url(sites/'+sitename+'/files/'+photoUrl+')');
                
                // update model
                profileModel.updateProfile();

			}
		});
        
    },
    
    showImagesDialog:function(o, e){
    
        $('#imagesDialog').modal('show');
        
        profileModel.images.removeAll();
    	profileModel.imagesLoading(true);

		$.ajax({
			url: 'api/image/list/all',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
     
                for(x in data){
            
    				var image = {
        			    'filename': data[x].filename,
                        'fullUrl': data[x].fullUrl,
                        'thumbUrl': data[x].thumbUrl,
                        'extension': data[x].extension,
                        'mimetype': data[x].mimetype,
                        'isImage': data[x].isImage,
                        'width': data[x].width,
                        'height': data[x].height
    				};
                
					profileModel.images.push(image); 
				}

			}
		});
        
    }
}

profileModel.init();