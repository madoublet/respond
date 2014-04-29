// models the files page
var filesModel = {
    
    siteUniqId: ko.observable(),
    
    files: ko.observableArray([]),
    filesLoading: ko.observable(false),
    
    toBeRemoved: null,
    toBeEdited: null,
    
    dz: null,

    init:function(){ // initializes the model
        filesModel.updateFiles();
        
        Dropzone.autoDiscover = false;

        filesModel.dz = new Dropzone("#drop", { 
            url: "api/file/post",
            clickable: true,
            sending: function(file, xhr, formData){
	          
	          if(filesModel.toBeEdited != null){
		          formData.append('overwrite', filesModel.toBeEdited.filename);
	          }
	          
	          return true;
	            
            },
            accept: function(file, done) {
            
            	if(filesModel.toBeEdited != null){
            	
            		var tbe = filesModel.toBeEdited.filename.split('.').pop();
            		var ext = file.name.split('.').pop();
            	
					if(tbe.toUpperCase() != ext.toUpperCase()) {
						message.showMessage('error', $('#msg-extension-match').val());
						done($('#msg-extension-match').val());
					}
					else{ 
						done();
					}
				}
				else{
					done();
				}
			},
            success: function(file, response){
            
            	// update files
                filesModel.updateFiles();
                
                // undo edit
                filesModel.toBeEdited = null;
                $('.dz-message').html('<i class="fa fa-cloud-upload fa-4x"></i> ' + $('#msg-drag').val() + '</span>');
				$('.dropzone').removeClass('edit-mode');
            }
            
            });

		ko.applyBindings(filesModel);  // apply bindings
	},
    
    updateFiles:function(){  // grabs the files from the size

        filesModel.files.removeAll();
        filesModel.filesLoading(true);
        
        var m = moment();
        
        var ts = m.format('MDYYYYhhmmss');

		$.ajax({
			url: 'api/file/list/all',
			type: 'GET',
            dataType: 'JSON',
			data: {},
			success: function(data){
     
                for(x in data){
            
    				var file = {
        			    'filename': data[x].filename,
                        'fullUrl': data[x].fullUrl,
                        'thumbUrl': data[x].thumbUrl + '?' + ts	,
                        'extension': data[x].extension,
                        'mimetype': data[x].mimetype,
                        'isImage': data[x].isImage,
                        'width': data[x].width,
                        'height': data[x].height
    				};
                
					filesModel.files.push(file); 
				}
                
                filesModel.filesLoading(false);

			}
		});

	},

	edit:function(o, e){
		filesModel.toBeEdited = o;	
		
		console.log(filesModel.dz);
	
		$('.listItem').removeClass('edit-mode');
		$(e.target).parents('.listItem').addClass('edit-mode');
		$('.dz-message').html('<i class="fa fa-cloud-upload fa-4x"></i> ' + $('#msg-drag-replace').val() + '</span>');
		$('.dropzone').addClass('edit-mode');
	},

	undoEdit:function(o, e){
		filesModel.toBeEdited = null;
		
		$('.listItem').removeClass('edit-mode');
		$('.dz-message').html('<i class="fa fa-cloud-upload fa-4x"></i> ' + $('#msg-drag').val() + '</span>');
		$('.dropzone').removeClass('edit-mode');
	},

    showRemoveDialog:function(o, e){
        
        filesModel.toBeRemoved = o;
        
        $('#removeName').text(o.filename);
        $('#deleteDialog').modal('show');
    
    },
    
    removeFile:function(o, e){
        
        console.log(filesModel.toBeRemoved.filename);
        
        $.ajax({
    		url: 'api/file/remove',
			type: 'POST',
            data: {filename: filesModel.toBeRemoved.filename},
            dataType: 'JSON',
			success: function(data){
     
                filesModel.files.remove(filesModel.toBeRemoved); // remove the page from the model

    			$('#deleteDialog').modal('hide');

				message.showMessage('success', $('#msg-remove-successfully').val());

			},
			error: function(xhr, errorText, thrownError){
				console.log(xhr.responseText);
				message.showMessage('error', xhr.responseText);
				$('#deleteDialog').modal('hide');   
			}
        });
         
    }
}

filesModel.init();