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
    
		message.showMessage('progress', $('#msg-loading').val());
		
        colorsModel.files.removeAll();

		$.ajax({
    		url: 'api/stylesheet/list',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
                
                for(x in data){
                    
                    var file = {
            		    'name': data[x],
                        'file': data[x]+'.less'
    				};
                    
    				colorsModel.files.push(file);
					colorsModel.updateContent(file);
                    
				}
				
				message.hide();
                
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
			async: false, //disable this so that we get the colors in order
			success: function(data){
                colorsModel.content(data);
				
				var pattern = /\s*@([a-zA-Z0-9_-]+)\s*=\s*(.*?);/g;
				var match;
				if(match = pattern.exec(data)){
					//add the contents to an array
					//var fileInd = colorsModel.files.indexOf(o);
					o.content = data;
					o.matches = [];
				
					$('#variable-def').append('<h2>' + o.name + '</h2><ul></ul>');
					
					var lastUL = $('#variable-def ul:last-child');
					do{
						
						o.matches.push($.trim(match[0]));
						
						var name = o.name + '-' + match[1] + '-color_hex';
						
						lastUL.append(
							'<li>' + match[1] +
								' <input type="text" name="' + name + '" id="' + name + '" value="' + match[2] + '" />'  +
								' <input type="text" name="' + name + '_copy" id="' + name + '_copy" value="' + match[2] + '" />'  +
							'</li>');
					}while(match = pattern.exec(data));
					
					//bind color pickers
					$('input[id*="color_hex_copy"]', lastUL).spectrum({
						showInput: true,
						change: function(color){
							$('#' + this.id.replace('_copy', '')).val('#' + color.toHex());
						}
					});
					$('input[name*="color_hex"]', lastUL).change(function(){
						$('#' + this.id + '_copy').spectrum('set', '#' + this.value);
					});
					
					//while the new file object back to the files array
					//colorsModel.files()[fileInd] = o;
				}
            }
		});
        
    },
    
    save:function(o, e){
        
		message.showMessage('progress', $('#msg-updating').val());
        
		$('#variable-def h2').each(function(){
			var file = null;
			var fileChanged = false;
			
			var filename = $(this).text();
			
			//get the element that matches
			file = $.grep(colorsModel.files(), function(elementOfArray, indexInArray){
				return elementOfArray.name == filename;
			})[0];
			
			//get the inputs for this file
			$(this).next('ul').find('li input[id$="color_hex"]').each(function(){
				var varName = '@' + this.id.replace(file.name + '-', '').replace('-color_hex', '');
				var varValue = this.value;
				var varReplacement = varName + ' = ' + varValue + ';';
				
				//for each match, update the content to replace it
				for(var j in file.matches){
					if(new RegExp('\\s*' + varName + '\\s*=').test(file.matches[j])){
						console.log(file.matches[j]);
						console.log(varReplacement);
						
						if(file.matches[j] != varReplacement){
							fileChanged = true;
							file.content = file.content.replace(file.matches[j], varReplacement);
						}
						break;
					}
				}
			});
			
			//update the file on the server
			if(fileChanged){
				$.ajax({
					url: 'api/stylesheet/update',
					type: 'POST',
					data: {name: file.name, content: file.content},
					success: function(data){
						message.showMessage('success', $('#msg-updated').val());
					},
					error: function(data){
						message.showMessage('error', $('#msg-updating-error').val());
					}
				});
			}
		});
        
    }
}

colorsModel.init();