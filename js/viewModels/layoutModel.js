// models the layout page
var layoutModel = {
    
    files: ko.observableArray([]),
    content: ko.observable(''),
    cm: null,
    
    current: null,
    toBeRemoved: null,

    init:function(){ // initializes the model
        layoutModel.updateFiles();
       
		ko.applyBindings(layoutModel);  // apply bindings
	},
    
    updateFiles:function(){  // updates the page types arr
    
        layoutModel.files.removeAll();

		$.ajax({
    		url: 'api/layout/list',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
                
                var i=0;
                var current = null;
                
                for(x in data){
                    
                    var file = {
            		    'name': data[x],
                        'file': data[x]+'.html'
    				};
                    
                    if(i==0){
                        current = file;
                    }
                    
    				layoutModel.files.push(file);
                    
                    i++;
				}
                
                if(current!=null){
                    layoutModel.updateContent(current);
                }
                
                global.setupFs();
			}
		});

	},
    
    updateContent:function(o){
        
        layoutModel.current = o;
   
    	$('nav ul li').removeClass('active');
		$('nav ul li.'+o.name).addClass('active');

        $.ajax({
        	url: 'api/layout/get',
			type: 'POST',
			data: {name: o.name},
			success: function(data){
                layoutModel.content(data);
                
                // setup codemirror
                var content = $('#content').get(0);
                
                if(layoutModel.cm==null){
                    layoutModel.cm = CodeMirror.fromTextArea(content, {mode: 'text/html', lineNumbers: true});
                }
                else{
        	        layoutModel.cm.setValue(data);   
			    }
			}
		});
        
    },
    
    save:function(o, e){
        
		message.showMessage('progress', $('#msg-updating').val());
        
        var content = layoutModel.cm.getValue();
        
        $.ajax({
            url: 'api/layout/update',
			type: 'POST',
			data: {name: layoutModel.current.name, content: content},
			success: function(data){
    			message.showMessage('success', $('#msg-saved').val());
			},
			error: function(data){
				message.showMessage('error', $('#msg-saving-error').val());
			}
		});
        
    },
    
    showAddDialog:function(o, e){
        $('#name').val('');
		
		$('#addDialog').modal('show');

		return false;
    },
    
    addLayout:function(o, e){
        
        var name = jQuery.trim($('#name').val());
        
        name = global.replaceAll(name, '.html', '');
    		
		if(name==''){
			message.showMessage('error', $('#msg-add-error').val());
			return false;
		}
		
        $.ajax({
            url: 'api/layout/add',
        	type: 'POST',
			data: {name: name},
			success: function(data){
                layoutModel.files.push({
                	    'name': name,
                        'file': name+'.html'
    				});
                
    			message.showMessage('success', $('#msg-add-success').val());
                
                $('#addDialog').modal('hide');
			},
			error: function(data){
				message.showMessage('error', $('#msg-add-problem').val());
			}
		});
        
    },
    
    showRemoveDialog:function(o, e){
        layoutModel.toBeRemoved = o;
        
        $('#removeName').text(o.file);
        
		$('#removeDialog').modal('show');

		return false;
    },
    
    removeLayout: function(o, e){
        
        $.ajax({
            url: 'api/layout/delete',
    		type: 'DELETE',
			data: {name: layoutModel.toBeRemoved.name},
			success: function(data){
                layoutModel.files.remove(layoutModel.toBeRemoved); // remove the page from the model
                
    			message.showMessage('success', $('#msg-remove-success').val());
    	        $('#removeDialog').modal('hide');
			},
			error: function(data){
				message.showMessage('error', $('msg-remove-problem').val());
			}
		});
        
    }
}

layoutModel.init();