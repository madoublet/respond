// handles the page settings dialog
var pageSettingsDialog = {

	init:function(){
		
			
	},

	// shows the page settings dialog
	show:function(){
	
		contentModel.updateStylesheets();
		contentModel.updateLayouts();
		
		$('#pageSettingsDialog').modal('show');
		
	}
}

$(document).ready(function(){
	pageSettingsDialog.init();
});