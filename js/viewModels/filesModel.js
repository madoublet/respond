// models the branding page
var filesModel = {
    
    siteUniqId: ko.observable(),
    
    files: ko.observableArray([]),
    filesLoading: ko.observable(false),
    
    toBeRemoved: null,

    init:function(){ // initializes the model
        filesModel.updateFiles();

        $("#drop").dropzone({ 
            url: "/api/file/post",
            success: function(file, response){
                var file = jQuery.parseJSON(response);
                
                var filename = file.filename;
    
                var match = ko.utils.arrayFirst(brandingModel.images(), function (item) {
                                return item.filename === filename; 
                            });
                        
                if (!match) {
                    filesModel.files.push(file); 
                }
            }
            
            });
            
        $("#drop").addClass('dropzone');

		ko.applyBindings(filesModel);  // apply bindings
	},
    
    updateFiles:function(){  // updates the site to get the logoUrls

        filesModel.files.removeAll();
        filesModel.filesLoading(true);

		$.ajax({
			url: './api/file/list/all',
			type: 'GET',
            dataType: 'JSON',
			data: {},
			success: function(data){
     
                for(x in data){
            
    				var file = {
        			    'filename': data[x].filename,
                        'fullUrl': data[x].fullUrl,
                        'thumbUrl': data[x].thumbUrl,
                        'extension': data[x].extension,
                        'mimetype': data[x].mimetype,
                        'isImage': data[x].isImage,
                        'width': data[x].width,
                        'height': data[x].height
    				}
                
            
					filesModel.files.push(file); 
				}
                
                filesModel.filesLoading(false);

			}
		});

	},

    showRemoveDialog:function(o, e){
        
        filesModel.toBeRemoved = o;
        
        $('#removeName').text(o.filename);
        $('#deleteDialog').modal('show');
    
    },
    
    removeFile:function(o, e){
        
        /*
        $.ajax({
    		url: './api/file/remove',
			type: 'POST',
            data: {filename: o.filename()},
            dataType: 'JSON',
			data: {},
			success: function(data){
     
                filesModel.files.remove(filesModel.toBeRemoved); // remove the page from the model

    			$('#deleteDialog').modal('hide');

				message.showMessage('success', 'The file was removed successfully');

			}
        
        
        $('#deleteDialog').modal('hide');*/
        
    }
}

filesModel.init();