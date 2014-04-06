// models the styles page
var colorsModel = {
    
    files: ko.observableArray([]),
    content: ko.observable(''),
    cm: null,
    
    current: null,
    toBeRemoved: null,

    init:function(){ // initializes the model
        colorsModel.updateFiles();

		ko.applyBindings(colorsModel);  // apply bindings
	},
    
    updateFiles:function(){  // updates the page types arr
    
        colorsModel.files.removeAll();

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
                    
    				colorsModel.files.push(file);
					colorsModel.updateContent(file);
                    
                    i++;
				}
                
                /*if(current!=null){
                    colorsModel.updateContent(current);
                }*/
                
                global.setupFs();
                
			}
		});

	},
    
    updateContent:function(o){
        
        colorsModel.current = o;
   
    	$('nav ul li').removeClass('active');
		$('nav ul li.'+o.name).addClass('active');

        $.ajax({
        	url: 'api/stylesheet/get',
			type: 'POST',
			data: {name: o.name},
			success: function(data){
                colorsModel.content(data);
				
				var pattern = /\s*@([a-zA-Z0-9_-]+)\s*=\s*(.*?);/g;
				var match;
				if(match = pattern.exec(data)){
					$('#variable-def').append('<h2>' + o.name + '</h2><ul></ul>');
					
					var lastUL = $('#variable-def ul:last-child');
					do{
						lastUL.append(
							'<li>' + match[1] +
								' <input type="text" name="' + match[1] + '_color_hex" id="' + match[1] + '_color_hex" value="' + match[2] + '" />'  +
								' <input type="text" name="' + match[1] + '_color_hex_copy" id="' + match[1] + '_color_hex_copy" value="' + match[2] + '" />'  +
							'</li>');
					}while(match = pattern.exec(data));
					
					$('input[id*="color_hex_copy"]', lastUL).spectrum({
						showInput: true,
						change: function(color){
							$('#' + this.id.replace('_copy', '')).val('#' + color.toHex());
						}
					});
					$('input[name*="color_hex"]', lastUL).change(function(){
						$('#' + this.id + '_copy').spectrum('set', '#' + this.value);
					});
				}
            }
		});
        
    },
    
    save:function(o, e){
        
		message.showMessage('progress', $('#msg-updating').val());
        
        var content = colorsModel.cm.getValue();
        
        $.ajax({
            url: 'api/stylesheet/update',
			type: 'POST',
			data: {name: colorsModel.current.name, content: content},
			success: function(data){
    			message.showMessage('success', $('#msg-updated').val());
			},
			error: function(data){
				message.showMessage('error', $('#msg-updating-error').val());
			}
		});
        
    }
}

colorsModel.init();