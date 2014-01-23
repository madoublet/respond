// models the scripts page
var scriptsModel = {
    
    files: ko.observableArray([]),
    content: ko.observable(''),
    cm: null,
    hasFile: ko.observable(false),
    name: ko.observable(''),
    
    current: null,
    toBeRemoved: null,

    init:function(){ // initializes the model
        scriptsModel.updateFiles();

		ko.applyBindings(scriptsModel);  // apply bindings
	},
    
    updateFiles:function(){  // updates the page types arr
    
        scriptsModel.files.removeAll();

		$.ajax({
    		url: 'api/script/list',
			type: 'GET',
			data: {},
			dataType: 'json',
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
                	scriptsModel.hasFile(true);
                    scriptsModel.updateContent(current);
                }
                
                global.setupFs();
                
			}
		});

	},
    
    updateContent:function(o){
        
        scriptsModel.current = o;
        
        var name = global.replaceAll(o.file, '.js', '');
        scriptsModel.name(name);
   
    	$('nav ul li').removeClass('active');
		$('nav ul li[data-file="'+o.file+'"]').addClass('active');
        
        $.ajax({
        	url: 'api/script/get',
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
            
                scriptsModel.hasFile(true);
				
            }
		});
        
    },
    
    save:function(o, e){
        
		message.showMessage('progress', $('#msg-updating').val());
        
        var content = scriptsModel.cm.getValue();
        
        $.ajax({
            url: 'api/script/update',
			type: 'POST',
			data: {file: scriptsModel.current.file, content: content},
			success: function(data){
    			message.showMessage('success', $('#msg-updated').val());
			},
			error: function(data){
				message.showMessage('error', $('#msg-updating-error').val());
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
        
        name = global.replaceAll(name, '.js', '');
    		
		if(name==''){
			message.showMessage('error', $('#msg-name-required').val());
			return false;
		}
		
		message.showMessage('progress', $('#msg-script-adding').val());
        
        $.ajax({
            url: 'api/script/add',
        	type: 'POST',
			dataType: 'json',
			data: {name: name},
			success: function(data){
                scriptsModel.files.push({
                	    'name': name,
                        'file': name+'.js'
    				});
                
    			message.showMessage('success', $('#msg-script-added').val());
                
                $('#addDialog').modal('hide');
			},
			error: function(data){
				message.showMessage('error', $('#msg-script-adding-error').val());
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
    
    	message.showMessage('progress', $('#msg-script-removing').val());
        
        $.ajax({
            url: 'api/script/delete',
    		type: 'DELETE',
			data: {file: scriptsModel.toBeRemoved.file},
			success: function(data){
                scriptsModel.files.remove(scriptsModel.toBeRemoved); // remove the page from the model
                
    			message.showMessage('success', $('#msg-script-removed').val());
                
                $('#removeDialog').modal('hide');
			},
			error: function(data){
				message.showMessage('error', $('#msg-script-remove-error').val());
			}
		});
        
    }
}

scriptsModel.init();