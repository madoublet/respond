// handles the plugin configurations dialog on content.php
var codeBlockDialog = {

	init:function(){
	
		$('#addCode').click(function(){
		
			var editor = $('#desc');
			var uniqId = 'code-'+parseInt(new Date().getTime() / 1000);
			var code = $('#Code').val();
			
			code = global.replaceAll(code, '<', '&lt;');
			
			var html = '<div id="'+uniqId+'" class="syntax">' +
				'<pre class="prettyprint linenums pre-scrollable">' + code + '</pre>' +
				'<pre class="non-pretty">' + code + '</pre>' +
				'<span class="marker fa fa-terminal" title="Code block"></span><a class="remove fa fa-minus-circle"></a></div>';
			
			$(editor).respondAppend(
				html
			);
			
			prettyPrint();
			
			$('#codeBlockDialog').modal('hide');
		
		});
	
	},
	
	// shows the dialog
	show:function(){
	
		$('#Code').val('');
	
		$('#codeBlockDialog').modal('show');  // hide the dialog
	
	}
}

$(document).ready(function(){
	codeBlockDialog.init();
});