// handles the plugins dialog on content.php
var pluginsDialog = {

	editor: null,

	init:function(){
		
		$('#selectPlugin li').live('click',function(){
			$(this).parent().find('li').removeClass('selected');
			$(this).addClass('selected');
		});
		
		$('#addPlugin').click(function(){
		
			var plugin = $('#selectPlugin li.selected a');
			
			if(plugin.length==0){
				message.showMessage('error', $('#msg-select-plugins-error').val());
				return;
			}
			
			var editor = pluginsDialog.editor;
			var uniqId = 'p-'+parseInt(new Date().getTime() / 1000);
			var name = plugin.attr('data-name');
			var type = plugin.attr('data-type');
			var render = plugin.attr('data-render');
			var config = plugin.attr('data-config');
			
			var html = '<div id="' + uniqId+ '" data-type="' + type + 
						'" data-name="' + name+'" data-render="' + render + 
						'" data-config="'+config+'" class="plugin">';
			
			if(config=='true'){
		        html +=  respond.defaults.elementMenuPlugin;
	      	}
	      	else{
		        html += respond.defaults.elementMenuNoConfig;
	      	}
			
			html += '<div class="title"><i class="fa fa-cogs"></i> '+name+'</div></div>';
			
			respond.Editor.Append(editor,
				html
				);
			
			$('#pluginsDialog').modal('hide');
		
		});
	
	},
	
	// shows the slide show dialog
	show:function(editor){
	
		pluginsDialog.editor = editor;
	
		contentModel.updatePlugins();
		
		$('#pluginsDialog').modal('show');
	}
}

$(document).ready(function(){
	pluginsDialog.init();
});