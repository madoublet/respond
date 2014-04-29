// models the styles page
var colorsModel = {

	files: ko.observableArray([]),
	filesLoading: ko.observable(false),
	showInstructions: ko.observable(false),
	content: ko.observable(''),
	cm: null,

	current: null,
	toBeRemoved: null,

	init:function(){ // initializes the model
		colorsModel.updateFiles();

		ko.applyBindings(colorsModel);  // apply bindings
	},
    
	updateFiles:function(){  // updates the page types arr

		colorsModel.filesLoading(true);
		colorsModel.showInstructions(false);
		
		//remove existing references
		colorsModel.files.removeAll();
		$('#variable-def').empty();

		//get the list of each stylesheet
		$.ajax({
			url: 'api/stylesheet/list',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
			
				colorsModel.filesLoading(false);
			
				//construct an object for each returned stylesheet
				for(x in data){

					//create a file object
					var file = {
						'name': data[x],
						'file': data[x]+'.less'
					};

					//add it to our list of files
    				colorsModel.files.push(file);
					//extract the colors for editing
					colorsModel.extractColorDefinitions(file);
                    
				}
				
				message.hide();

				global.setupFs();

			}
		});

	},

	extractColorDefinitions:function(o){

		colorsModel.current = o;

		//make an ajax request to get the stylesheet file from the server
		$.ajax({
			url: 'api/stylesheet/get',
			type: 'POST',
			data: {name: o.name},
			async: false, //disable this so that we get the colors in order
			success: function(data){
				colorsModel.content(data);
				
				//set up a regex to identify LESS variable declarations
				var pattern = /\s*@([a-zA-Z0-9_-]+)\s*:\s*(.*?);/g;
				var match;
			
				//if the stylesheet contains a match, and that match references a CSS color
				if((match = pattern.exec(data)) && colorsModel.isValidCssColor(match[2])){
				
					//add the stylesheet contents to an array
					o.content = data;
					o.matches = []; //create an array on this file to hold the list of variable declarations

					var friendlyName = o.name.split('-').join(' '); // replace 
					friendlyName = friendlyName.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

					//add an H2 and a list on page for this file
					$('#variable-def').append('<h2 data-name="'+o.name+'">' + friendlyName + '</h2><section></section>');
					
					var lastBlock = $('#variable-def section:last-child');
					
					//for each match in the file
					do{
						//add this match to the list of matches on the file object
						o.matches.push($.trim(match[0]));
						
						//add an entry in the list with two inputs (one for text input and another for a color picker)
						var name = o.name + '-' + match[1] + '-color_hex';
						
						var friendlyName = match[1].split('-').join(' '); // replace 
						friendlyName = friendlyName.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
						
						lastBlock.append(
							'<div class="form-group">' +
							'<label data-name="'+match[1]+'">' + friendlyName + '</label> ' +
							'<div>' +
								' <input type="text" name="' + name + '" id="' + name + '" value="' + match[2] + '" class="form-control" />'  +
								' <input type="text" name="' + name + '_copy" id="' + name + '_copy" value="' + match[2] + '" class="form-control" />'  +
								'<span class="help-block">@'+ match[1] +'</span>' +
							'</div></div>');
							
					}while((match = pattern.exec(data)) && colorsModel.isValidCssColor(match[2]));
					
					//bind color pickers
					$('input[id*="color_hex_copy"]', lastBlock).spectrum({
						showInput: true,
						change: function(color){
							$('#' + this.id.replace('_copy', '')).val('#' + color.toHex());
						}
					});
					
					$('input[name*="color_hex"]', lastBlock).change(function(){
						$('#' + this.id + '_copy').spectrum('set', '#' + this.value);
					});
					
					
					
				}
				else{
					if($('input[name*="color_hex"]').length == 0){
						colorsModel.showInstructions(true);
					}
					else{
						colorsModel.showInstructions(false);
					}
				}
				
            }
            
            
		});

	},

	save:function(o, e){

		message.showMessage('progress', $('#msg-updating').val());

		var failed = false;
		
		//for each file from which we pulled colors
		$('#variable-def h2').each(function(){
			var file = null;
			var fileChanged = false;
			
			var filename = $(this).attr('data-name');
			
			//get the element that matches
			file = $.grep(colorsModel.files(), function(elementOfArray, indexInArray){
				return elementOfArray.name == filename;
			})[0];
			
			//get the inputs for this file
			$(this).next('section').find('input[id$="color_hex"]').each(function(){
				//construct what the new line in the file should be
				var varName = '@' + this.id.replace(file.name + '-', '').replace('-color_hex', '');
				var varValue = this.value;
				var varReplacement = varName + ': ' + varValue + ';';
				
				//for each match, update the content to replace it
				for(var j in file.matches){
					//verify that the file we found still contains a reference to this declaration
					if(new RegExp('\\s*' + varName + '\\s*:').test(file.matches[j])){
						
						//TODO make this check cleaner
						//if the new declaration does not match the old, replace it and mark the file as dirty
						if(file.matches[j] != varReplacement){
							fileChanged = true;
							file.content = file.content.replace(file.matches[j], varReplacement);
						}
						break;
					}
				}
			});
			
			//If this file has changed, update the file on the server
			//TODO update the messages so that they wait for the last file to finish
			if(fileChanged){
				$.ajax({
					url: 'api/stylesheet/update',
					type: 'POST',
					async: false,
					data: {name: file.name, content: file.content},
					error: function(data){
						failed = true;
					}
				});
			}
		});
		
		if(failed){
			message.showMessage('error', $('#msg-updating-error').val());
		}else{ //all of the stylesheets posted successfully
			//show the success message
			message.showMessage('success', $('#msg-updated').val());
			
			//reload the items
			colorsModel.updateFiles();
		}

	},
	
	isValidCssColor : function(color){
		var rgb = $('<div style="color:#28e32a">');     // Use a non standard dummy color to ease checking for edge cases
		var valid_rgb = "rgb(40, 227, 42)";
		rgb.css("color", color);
		if(rgb.css('color') == valid_rgb && color != ':#28e32a' && color.replace(/ /g,"") != valid_rgb.replace(/ /g,""))
			return false;
		else
			return true;
	}
}

colorsModel.init();