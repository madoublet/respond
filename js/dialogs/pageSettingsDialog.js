// handles the page settings dialog
var pageSettingsDialog = {

	init:function(){
		
		$('#updatePageSettings').click(function(){
		
			var pageUniqId = $('#PageUniqId').val();
			var typeS = $('#TypeS').val();
			
			var name = $('#Name').val();
			
			if(name==''){
				message.showMessage('error', 'You must add a name');
				return;
			}
			
			var friendlyId = $('#FriendlyId').val();
			
			if(friendlyId==''){
				message.showMessage('error', 'You must select a friendly URL.');
				return;
			}
			
			// get desc and content
			var keywords = $('#Keywords').val();
			var callout = $('#Callout').val();
			var domain = $('#Domain').val();
			var description = $('#Description').val(); // keyed description
			var checks = $('input.rss:checked');
			var rss = '';
			
			for(var x=0; x<checks.length; x++){
				rss += $(checks[x]).val() + ',';
			}
			
			if(rss.length>0){
				rss=rss.substring(0,rss.length-1);
			}
			
			// get layout and stylesheet
			var layout = $('#Layout').val();
			var stylesheet = $('#Stylesheet').val();
			
			var pageTypeUniqId = $('#PageTypeUniqId').val();
			
			var successText = 'You have succesfully updated the ' + typeS.toLowerCase() + '.';
			
			message.showMessage('progress', 'Updating ' + typeS.toLowerCase()+'...');
			
			$.post('content.php', {
				Ajax: 'content.updateSettings',
				PageUniqId: pageUniqId,
				Name: name,
				Description: description,
				Keywords: keywords,
				Callout: callout,
				Rss: rss,
				Layout: layout,
				Stylesheet: stylesheet,
				FriendlyId: friendlyId,
				PageTypeUniqId: pageTypeUniqId
				}, function(data){
			
					if(data.IsSuccessful=='false'){
						message.showMessage('error', data.Error);
					}
					else{
						message.showMessage('success', successText);
						$('#pageSettingsDialog').modal('hide');
					}
				});
		
		});
	
	},

	// shows the slide show dialog
	show:function(){
	
		contentModel.updateStylesheets();
		contentModel.updateLayouts();
		
		$('#pageSettingsDialog').modal('show');
		
	}
}

$(document).ready(function(){
	pageSettingsDialog.init();
});