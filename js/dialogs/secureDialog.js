var secureDialog = {

	dialog: null,
	editor: null,
	id: -1,
	type: 'login',

	init:function(){

		secureDialog.dialog = $('#secureDialog');

	 	$('#selectSecureType li').live('click', function(){
			secureDialog.type = $(this).attr('data-type');
			
			$('#selectSecureType li').removeClass('selected');
			$(this).addClass('selected');
		});
    
		$('#addSecure').on('click', function(){

			// add featured widget
			var editor = secureDialog.editor;
			var className = 'secure';
			var prefix = 'secure';
		
			var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
			
			var text = t(secureDialog.type);
			
			var html = '<div id="'+uniqId+'" data-type="'+secureDialog.type +
				'"  class="secure">' +
				respond.defaults.elementMenuNoConfig + 
				'<div class="title"><i class="fa fa-lock"></i> ' + text +			
				'</div></div>';
			
			respond.Editor.Append(editor,
				html
			);
		  
			$('#secureDialog').modal('hide');

		});
	},

	show:function(editor, id){ // shows the dialog
	 
	 	secureDialog.editor = editor;
		secureDialog.id = id;
		secureDialog.type = 'login';
		$('#selectSecureType li').removeClass('selected');
		$('#selectSecureType li[data-type=login]').addClass('selected');

	    $('#secureDialog').modal('show');

	}

}

$(document).ready(function(){
  	secureDialog.init();
});