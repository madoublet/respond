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
    		url: './api/template/layouts/',
			type: 'GET',
			data: {},
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
                
			}
		}, 'json');

	},
    
    updateContent:function(o){
        
        layoutModel.current = o;
   
    	$('nav ul li').removeClass('active');
		$('nav ul li.'+o.name).addClass('active');

        $.ajax({
        	url: './api/template/layout/' + o.name,
			type: 'GET',
			data: {},
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
        
		message.showMessage('progress', 'Updating layout...');
        
        var content = layoutModel.cm.getValue();
        
        $.ajax({
            url: './api/template/layout/' + layoutModel.current.name,
			type: 'POST',
			data: {content: content},
			success: function(data){
    			message.showMessage('success', 'Layout saved');
			},
			error: function(data){
				message.showMessage('error', 'There was a problem saving the layout, please try again');
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
    		
		if(name==''){
			message.showMessage('error', 'A name is required to add a layout');
			return false;
		}
        
        $.ajax({
            url: './api/template/layout/add',
        	type: 'POST',
			data: {name: name},
			success: function(data){
                layoutModel.files.push({
                	    'name': name,
                        'file': name+'.html'
    				});
                
    			message.showMessage('success', 'Layout successfully added');
                
                $('#addDialog').modal('show');
			},
			error: function(data){
				message.showMessage('error', 'There was a problem adding the layout, please try again');
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
            url: './api/template/layout/' + layoutModel.toBeRemoved.name,
    		type: 'DELETE',
			data: {},
			success: function(data){
                layoutModel.files.remove(layoutModel.toBeRemoved); // remove the page from the model
                
    			message.showMessage('success', 'Layout successfully removed');
			},
			error: function(data){
				message.showMessage('error', 'There was a problem deleting the layout, please try again');
			}
		});
        
    }
}

layoutModel.init();