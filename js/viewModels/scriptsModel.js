// models the scripts page
var scriptsModel = {
    
    files: ko.observableArray([]),
    content: ko.observable(''),
    cm: null,
    
    current: null,
    toBeRemoved: null,

    init:function(){ // initializes the model
        scriptsModel.updateFiles();

		ko.applyBindings(scriptsModel);  // apply bindings
	},
    
    updateFiles:function(){  // updates the page types arr
    
        scriptsModel.files.removeAll();

		$.ajax({
    		url: './api/script/list',
			type: 'GET',
			data: {},
			success: function(data){
                
                var i=0;
                var current = null;
                
                for(x in data){
                    
                    var file = {
                        'file': data[x]
    				};
                    
                    if(i==0){
                        current = file;
                    }
                    
    				scriptsModel.files.push(file);
                    
                    i++;
				}
                
                if(current!=null){
                    scriptsModel.updateContent(current);
                }
                
			}
		}, 'json');

	},
    
    updateContent:function(o){
        
        scriptsModel.current = o;
   
    	$('nav ul li').removeClass('active');
		$('nav ul li[data-file="'+o.file+'"]').addClass('active');
        

        $.ajax({
        	url: './api/script/get',
			type: 'POST',
			data: {file: o.file},
			success: function(data){
                scriptsModel.content(data);
                
                // setup codemirror
                var content = $('#content').get(0);
                
                if(scriptsModel.cm==null){
                    scriptsModel.cm = CodeMirror.fromTextArea(content, {mode: 'text/css', lineNumbers: true});
                }
                else{
    		        scriptsModel.cm.setValue(data);   
			    }
            
            }
		});
        
    },
    
    save:function(o, e){
        
		message.showMessage('progress', 'Updating styles...');
        
        var content = scriptsModel.cm.getValue();
        
        $.ajax({
            url: './api/script/update',
			type: 'POST',
			data: {file: scriptsModel.current.file, content: content},
			success: function(data){
    			message.showMessage('success', 'Script saved');
			},
			error: function(data){
				message.showMessage('error', 'There was a problem saving the script file, please try again');
			}
		});
        
    },
    
    showAddDialog:function(o, e){
        $('#name').val('');
		
		$('#addDialog').modal('show');

		return false;
    },
    
    addScript:function(o, e){
        
        var name = jQuery.trim($('#name').val());
    		
		if(name==''){
			message.showMessage('error', 'A name is required to add a script');
			return false;
		}
        
        $.ajax({
            url: './api/script/add',
        	type: 'POST',
			data: {name: name},
			success: function(data){
                scriptsModel.files.push({
                	    'name': name,
                        'file': name+'.js'
    				});
                
    			message.showMessage('success', 'Script successfully added');
                
                $('#addDialog').modal('hide');
			},
			error: function(data){
				message.showMessage('error', 'There was a problem adding the script, please try again');
			}
		});
        
    },
    
    showRemoveDialog:function(o, e){
        scriptsModel.toBeRemoved = o;
        
        $('#removeName').text(o.file);
        
		$('#removeDialog').modal('show');

		return false;
    },
    
    removeScript: function(o, e){
        
        $.ajax({
            url: './api/script/delete',
    		type: 'DELETE',
			data: {file: scriptsModel.toBeRemoved.file},
			success: function(data){
                scriptsModel.files.remove(scriptsModel.toBeRemoved); // remove the page from the model
                
    			message.showMessage('success', 'Script successfully removed');
                
                $('#removeDialog').modal('hide');
			},
			error: function(data){
				message.showMessage('error', 'There was a problem deleting the script, please try again');
			}
		});
        
    }
}

scriptsModel.init();