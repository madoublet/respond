// handles the plugin configurations dialog on content.php
var codeBlockDialog = {

	editor: null,

	init:function(){
	
		$('#addCode').click(function(){
		
			var editor = codeBlockDialog.editor;
			var className = 'syntax';
			var prefix = 'syntax';
		
			var uniqId = respond.Editor.GenerateUniqId(editor, className, prefix);
			
			var code = $('#Code').val();
			
			code = global.replaceAll(code, '<', '&lt;');
			
			var html = '<div id="'+uniqId+'" class="syntax">' +
				respond.defaults.elementMenuNoConfig + 
				'<pre class="prettyprint linenums pre-scrollable">' + code + '</pre>' +
				'<pre class="non-pretty">' + code + '</pre></div>';
			
			respond.Editor.Append(editor, 
				html
			);
			
			prettyPrint();
			
			$('#codeBlockDialog').modal('hide');
		
		});
	
	},
	
	// shows the dialog
	show:function(editor){

		codeBlockDialog.editor = editor;
	
		$('#Code').val('');
	
		$('#codeBlockDialog').modal('show');  // hide the dialog
	
	}
}

$(document).ready(function(){
	codeBlockDialog.init();
});