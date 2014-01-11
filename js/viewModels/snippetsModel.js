// models the snippets page
var snippetsModel = {
    
    snippets: ko.observableArray([]),
    content: ko.observable(''),
    cm: null,
    hasFile: ko.observable(false),
    name: ko.observable(''),
    
    current: null,
    toBeRemoved: null,

    init:function(){ // initializes the model
        snippetsModel.updateSnippets();

		ko.applyBindings(snippetsModel);  // apply bindings
	},
    
    updateSnippets:function(){  // updates the page types arr
    
        snippetsModel.snippets.removeAll();

		$.ajax({
    		url: 'api/snippet/list',
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
                    
    				snippetsModel.snippets.push(file);
                    
                    i++;
				}
                
                if(current!=null){
                	snippetsModel.hasFile(true);
                    snippetsModel.updateContent(current);
                }
                
                global.setupFs();
                
			}
		});

	},
    
    updateContent:function(o){
        
        snippetsModel.current = o;
        
        var name = global.replaceAll(o.file, '.php', '');
        
        snippetsModel.name(name);
   
    	$('nav ul li').removeClass('active');
		$('nav ul li[data-file="'+o.file+'"]').addClass('active');
        

        $.ajax({
        	url: 'api/snippet/get',
			type: 'POST',
			data: {file: o.file},
			success: function(data){
                snippetsModel.content(data);
                
                // setup codemirror
                var content = $('#content').get(0);
                
                if(snippetsModel.cm==null){
                    snippetsModel.cm = CodeMirror.fromTextArea(content, {mode: 'text/css', lineNumbers: true});
                }
                else{
    		        snippetsModel.cm.setValue(data);   
			    }
            
                snippetsModel.hasFile(true);
				
            }
		});
        
    },
    
    save:function(o, e){
        
		message.showMessage('progress', $('#msg-updating').val());
        
        var content = snippetsModel.cm.getValue();
        
        $.ajax({
            url: 'api/snippet/update',
			type: 'POST',
			data: {file: snippetsModel.current.file, content: content},
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
    
    addSnippet:function(o, e){
        
        var name = jQuery.trim($('#name').val());
        
        name = global.replaceAll(name, '.php', '');
    		
		if(name==''){
			message.showMessage('error', $('#msg-name-required').val());
			return false;
		}
		
		message.showMessage('progress', $('#msg-snippet-adding').val());
        
        $.ajax({
            url: 'api/snippet/add',
        	type: 'POST',
			dataType: 'json',
			data: {name: name},
			success: function(data){
                snippetsModel.snippets.push({
                	    'name': name,
                        'file': name+'.php'
    				});
                
    			message.showMessage('success', $('#msg-snippet-added').val());
                
                $('#addDialog').modal('hide');
			},
			error: function(data){
				message.showMessage('error', $('#msg-snippet-adding-error').val());
			}
		});
        
    },
    
    showRemoveDialog:function(o, e){
        snippetsModel.toBeRemoved = o;
        
        $('#removeName').text(o.file);
        
		$('#removeDialog').modal('show');

		return false;
    },
    
    removeSnippet: function(o, e){
    
    	message.showMessage('progress', $('#msg-snippet-removing').val());
        
        $.ajax({
            url: 'api/snippet/delete',
    		type: 'DELETE',
			data: {file: snippetsModel.toBeRemoved.file},
			success: function(data){
                snippetsModel.snippets.remove(snippetsModel.toBeRemoved); // remove the page from the model
                
    			message.showMessage('success', $('#msg-snippet-removed').val());
                
                $('#removeDialog').modal('hide');
			},
			error: function(data){
				message.showMessage('error', $('#msg-snippet-remove-error').val());
			}
		});
        
    }
}

snippetsModel.init();