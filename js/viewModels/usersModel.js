// models the users page
var usersModel = {

	users: ko.observableArray([]),
	usersLoading: ko.observable(true),
	
	roles: ko.observableArray([]),
	rolesLoading: ko.observable(false),
	
	images: ko.observableArray([]),
    imagesLoading: ko.observable(false),
    
    newimages: ko.observableArray([]),

	
    languages: ko.observableArray([]),

	toBeRemoved: null,
    toBeEdited: null,

	init:function(){ // initializes the model
		usersModel.updateLanguages();
		usersModel.updateUsers();	
		usersModel.updateRoles();
		
		Dropzone.autoDiscover = false;
		
		$("#drop").dropzone({ 
            url: "api/file/post",
            success: function(file, response){
                var image = response;
                
                var filename = response.filename;
    
                var match = ko.utils.arrayFirst(usersModel.images(), function (item) {
                                return item.filename === filename; 
                            });
                                
                if (!match) {
                    usersModel.images.push(image); 
                    usersModel.newimages.push(image); 
                }
            }
            
        });

		ko.applyBindings(usersModel);  // apply bindings
	},
 
	updateUsers:function(){

		usersModel.users.removeAll();
		usersModel.usersLoading(true);

		$.ajax({
			url: 'api/user/list/all',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){

				for(x in data){

					var user = User.create(data[x]);

					usersModel.users.push(user); 
    	
				}

				usersModel.usersLoading(false);

			}
		});

	},
	
	updateRoles:function(){

		usersModel.roles.removeAll();
		usersModel.rolesLoading(true);

		$.ajax({
			url: 'api/role/list',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
			
				// set up the defaults
				usersModel.roles.push({'id': 'Admin', 'name': $('#msg-admin').val()});
				usersModel.roles.push({'id': 'Contributor', 'name': $('#msg-contributor').val()});
				usersModel.roles.push({'id': 'Member', 'name': $('#msg-member').val()});
			
				for(x in data){
				
					var role = {
        			    'id': data[x]['Name'],
        			    'name': data[x]['Name']
    				};
                
					usersModel.roles.push(role); 

				}

				usersModel.rolesLoading(false);

			}
		});

	},
	
	updateLanguages:function(){
        
        usersModel.languages.removeAll();
       
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
                
					usersModel.languages.push(language); 
				}

			}
		});
    },
    
    showAddDialog:function(o, e){ // shows a dialog to add a page
    
        $('#addEditDialog').find('.edit').hide();
        $('#addEditDialog').find('.add').show();
        
        $('#firstName').val('');
        $('#lastName').val('');
        $('#role').val('Admin');
        $('#language').val('en');
        $('#isActive').val('1');
        $('#email').val('');
        $('#password').val('');
        $('#retype').val('');
        
		$('#addEditDialog').modal('show');

		return false;
	},
    
    showEditDialog:function(o, e){ // shows a dialog to add a page
    
        $('#addEditDialog').find('.add').hide();
        $('#addEditDialog').find('.edit').show();
        
        usersModel.toBeEdited = o;
        
        $('#firstName').val(o.firstName());
        $('#lastName').val(o.lastName());
        $('#role').val(o.role());
        $('#language').val(o.language());
        $('#email').val(o.email());
        $('#isActive').val(o.isActive());
        $('#password').val('temppassword');
        $('#retype').val('temppassword');

		$('#addEditDialog').modal('show');

		return false;
	},
    
    // adds a user
    addUser: function(o, e){
        
        var firstName = jQuery.trim($('#firstName').val());
        var lastName = jQuery.trim($('#lastName').val());
        var role = $('#role').val();
        var language = $('#language').val();
        var isActive = $('#isActive').val();
        var email = jQuery.trim($('#email').val());
        var password = jQuery.trim($('#password').val());
        var retype = jQuery.trim($('#retype').val());
        var isActive = $('#isActive').val();
        
        if(firstName=='' || lastName=='' || email=='' || password==''){
            message.showMessage('error', $('#msg-all-required').val());
            return;
        }
        
        if(password != retype){
            message.showMessage('progress', $('#msg-match').val());
            return;
        }
           
   
        message.showMessage('progress', $('#msg-adding').val());

        $.ajax({
          url: 'api/user/add',
          type: 'POST',
          data: {firstName: firstName, lastName: lastName, role: role, language: language, isActive: isActive, email: email, password: password},
		  dataType: 'json',
          success: function(data){

            var user = User.create(data);
          	
          	usersModel.users.push(user);

            message.showMessage('success', $('#msg-added').val());
            
            $('#addEditDialog').modal('hide');
          }
        });
        
    },
    
    // edits a user
    editUser: function(o, e){
        
        var firstName = jQuery.trim($('#firstName').val());
        var lastName = jQuery.trim($('#lastName').val());
        var role = $('#role').val();
        var language = $('#language').val();
        var isActive = $('#isActive').val();
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
           
    
        var userUniqId = usersModel.toBeEdited.userUniqId();
   
        message.showMessage('progress', $('#msg-updating').val());

        $.ajax({
          url: 'api/user/' + userUniqId,
          type: 'POST',
          data: {firstName: firstName, lastName: lastName, role: role, language: language, isActive: isActive, email: email, password: password},
          success: function(data){

            // update the model
            usersModel.toBeEdited.firstName(firstName);
            usersModel.toBeEdited.lastName(lastName);
            usersModel.toBeEdited.role(role);
            usersModel.toBeEdited.language(language);
            usersModel.toBeEdited.email(email);
            usersModel.toBeEdited.isActive(isActive);
            usersModel.toBeEdited.password('temppassword');
            
            message.showMessage('success', $('#msg-updated').val());
     
            $('#addEditDialog').modal('hide');
          }
        });    
    },

    // shows a dialog to remove a menuitem
    showRemoveDialog:function(o, e){
		usersModel.toBeRemoved = o;

		var id = o.userUniqId();
		var name = o.fullName();
        
		$('#removeName').html(name);  // show remove dialog
		$('#deleteDialog').data('id', id);
		$('#deleteDialog').modal('show');

		return false;
	},
    
    removeUser:function(o, e){
        
        var userUniqId = usersModel.toBeRemoved.userUniqId();
        
        message.showMessage('progress', $('#msg-removing').val());
        
        $.ajax({
          url: 'api/user/'+userUniqId,
          type: 'DELETE',
          data: {},
          success: function(data){
            
            usersModel.users.remove(usersModel.toBeRemoved);
              
            message.showMessage('success', $('#msg-removed').val());
    	    $('#deleteDialog').modal('hide');
          }
        });
        
    },
    
    setImage:function(o, e){
    
        var photoUrl = o.filename;
        
        message.showMessage('progress', $('#msg-updating').val());
        
		$.ajax({
			url: 'api/user/photo/',
			type: 'POST',
			data: {userUniqId: usersModel.toBeEdited.userUniqId(), photoUrl:photoUrl},
			dataType: 'json',
			success: function(data){
     
                message.showMessage('success', $('#msg-updated').val());
                
                $('#imagesDialog').modal('hide');
                
                // update model
                usersModel.updateUsers();

			}
		});
        
    },
    
    showImagesDialog:function(o, e){
    
    	usersModel.toBeEdited = o;
        
        $('#imagesDialog').modal('show');
        
        usersModel.images.removeAll();
    	usersModel.imagesLoading(true);

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
                
					usersModel.images.push(image); 
				}

			}
		});
        
    }
}

usersModel.init();
