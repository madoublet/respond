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
    		url: './api/stylesheet/list',
			type: 'GET',
			data: {},
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
                
			}
		}, 'json');

	},
    
    updateContent:function(o){
        
        stylesModel.current = o;
   
    	$('nav ul li').removeClass('active');
		$('nav ul li.'+o.name).addClass('active');

        $.ajax({
        	url: './api/stylesheet/get',
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
        
		message.showMessage('progress', 'Updating styles...');
        
        var content = stylesModel.cm.getValue();
        
        $.ajax({
            url: './api/stylesheet/update',
			type: 'POST',
			data: {name: stylesModel.current.name, content: content},
			success: function(data){
    			message.showMessage('success', 'Stylesheet saved');
			},
			error: function(data){
				message.showMessage('error', 'There was a problem saving the stylesheet, please try again');
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
    		
		if(name==''){
			message.showMessage('error', 'A name is required to add a stylesheet');
			return false;
		}
        
        $.ajax({
            url: './api/stylesheet/add',
        	type: 'POST',
			data: {name: name},
			success: function(data){
                stylesModel.files.push({
                	    'name': name,
                        'file': name+'.less'
    				});
                
    			message.showMessage('success', 'Stylesheet successfully added');
                
                $('#addDialog').modal('hide');
			},
			error: function(data){
				message.showMessage('error', 'There was a problem adding the stylesheet, please try again');
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
        
        $.ajax({
            url: './api/stylesheet/delete',
    		type: 'DELETE',
			data: {name: stylesModel.toBeRemoved.name},
			success: function(data){
                stylesModel.files.remove(stylesModel.toBeRemoved); // remove the page from the model
                
    			message.showMessage('success', 'Stylesheet successfully removed');
                
                $('#removeDialog').modal('hide');
			},
			error: function(data){
				message.showMessage('error', 'There was a problem deleting the stylesheet, please try again');
			}
		});
        
    }
}

stylesModel.init();