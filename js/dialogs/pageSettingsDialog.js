// handles the page settings dialog
var pageSettingsDialog = {

	init:function(){
		$('#pageSettingsDialog').find('.segment').hide();
		
		$('#pageSettingsDialog .segmented-control li').on('click', function(){
			
			$(this).parent().find('li').removeClass('active');
			$(this).addClass('active');
			
			var segment = $(this).attr('data-navigate');
			
			// show basic by default
			$('#pageSettingsDialog').find('.segment').hide();
			$('#'+segment).show();
			
		});
		
		// geocode location
		$('body').on('blur', '#location', function(){
			
			var callback = function(latitude, longitude, fmtAddress){
				$('#lat').val(latitude);
				$('#long').val(longitude);
			}
			
			var address = $(this).val();
			
			global.geocode(address, callback);
			
		});
	},

	// shows the page settings dialog
	show:function(){
	
		// show basic by default
		$('#pageSettingsDialog').find('.segment').hide();
		$('#settings-basic').show();
		$('#pageSettingsDialog').find('li').removeClass('active');
		$('#pageSettingsDialog li:first-child').addClass('active');
	
		contentModel.updateStylesheets();
		contentModel.updateLayouts();
		contentModel.updateCategories();
		
		$('#pageSettingsDialog').modal('show');
		
	}
}

$(document).ready(function(){
	pageSettingsDialog.init();
});