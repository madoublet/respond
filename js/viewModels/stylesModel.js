// models the styles page
var stylesModel = {
    
    files: ko.observableArray([]),
    content: ko.observable(''),
    cm: null,
    
    current: null,
    toBeRemoved: null,

    init:function(){ // initializes the model
        stylesModel.updateFiles();

		ko.applyBindings(stylesModel);  // apply bindings
	},
    
    updateFiles:function(){  // updates the page types arr
    
        stylesModel.files.removeAll();

		$.ajax({
    		url: 'api/stylesheet/list',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
                
                var i=0;
                var current = null;
                
                for(x in data){
                    
                    var file = {
            		    'name': data[x],
                        'file': data[x]+'.less'
    				};
                    
                    if(i==0){
                        current = file;
                    }
                    
    				stylesModel.files.push(file);
                    
                    i++;
				}
                
                if(current!=null){
                    stylesModel.updateContent(current);
                }
                
                global.setupFs();
                
			}
		});

	},
    
    updateContent:function(o){
        
        stylesModel.current = o;
   
    	$('nav ul li').removeClass('active');
		$('nav ul li.'+o.name).addClass('active');

        $.ajax({
        	url: 'api/stylesheet/get',
			type: 'POST',
			data: {name: o.name},
			success: function(data){
                stylesModel.content(data);
                
                // setup codemirror
                var content = $('#content').get(0);
                
                if(stylesModel.cm==null){
                    stylesModel.cm = CodeMirror.fromTextArea(content, {mode: 'text/css', lineNumbers: true});
                }
                else{
    		        stylesModel.cm.setValue(data);   
			    }
            
            }
		});
        
    },
    
    save:function(o, e){
        
		message.showMessage('progress', $('#msg-updating').val());
        
        var content = stylesModel.cm.getValue();
        
        $.ajax({
            url: 'api/stylesheet/update',
			type: 'POST',
			data: {name: stylesModel.current.name, content: content},
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
    
    addStylesheet:function(o, e){
        
        var name = jQuery.trim($('#name').val());
        
        name = global.replaceAll(name, '.less', '');
    		
		if(name==''){
			message.showMessage('error', $('#msg-name-required').val());
			return false;
		}
        
        message.showMessage('progress', $('#msg-style-adding').val());
        
        $.ajax({
            url: 'api/stylesheet/add',
        	type: 'POST',
			data: {name: name},
			success: function(data){
                stylesModel.files.push({
                	    'name': name,
                        'file': name+'.less'
    				});
                
    			message.showMessage('success', $('#msg-style-added').val());
                
                $('#addDialog').modal('hide');
			},
			error: function(data){
				message.showMessage('error', $('#msg-style-adding-error').val());
			}
		});
        
    },
    
    showRemoveDialog:function(o, e){
        stylesModel.toBeRemoved = o;
        
        $('#removeName').text(o.file);
        
		$('#removeDialog').modal('show');

		return false;
    },
    
    removeStylesheet: function(o, e){
    
    	message.showMessage('success', $('#msg-style-removing').val());
        
        $.ajax({
            url: 'api/stylesheet/delete',
    		type: 'DELETE',
			data: {name: stylesModel.toBeRemoved.name},
			dataType: 'json',
			success: function(data){
                stylesModel.files.remove(stylesModel.toBeRemoved); // remove the page from the model
                
    			message.showMessage('success', $('#msg-style-removed').val());
                
                $('#removeDialog').modal('hide');
			},
			error: function(data){
				message.showMessage('error', $('#msg-style-removing-error').val());
			}
		});
        
    }
}

stylesModel.init();