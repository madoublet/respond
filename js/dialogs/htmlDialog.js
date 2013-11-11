// handles the html dialog
var htmlDialog = {

	init:function(){
	
		$('#addHtml').click(function(){
		
			var editor = $('#desc');
			var uniqId = 'html-'+parseInt(new Date().getTime() / 1000);
			var code = $('#Html').val();
			
			code = global.replaceAll(code, '<', '&lt;');
			
			var html = '<div id="'+uniqId+'" class="html">' +
					'<pre class="prettyprint linenums pre-scrollable">' + code + '</pre>' +
					'<pre class="non-pretty">' + code + '</pre>' +
					'<span class="marker fa fa-html5" title="Code block"></span><a class="remove fa fa-minus-circle"></a></div>';
			
			$(editor).respondAppend(
				html
			);
			
			prettyPrint();
			
			$('#htmlDialog').modal('hide');
		
		});
	
	},
	
	// shows the dialog
	show:function(type){
	
		$('.instructions').hide();
		
		if(type=='twitter'){
			$('.twitter-instructions').show();
			$('#htmlDialog h3').text('Add Twitter Widget');
			$('#htmlDialog .primary-button').text('Add Twitter HTML');
		}
		else{
			$('#htmlDialog h3').text('Add HTML');
			$('#htmlDialog .primary-button').text('Add HTML');
		}
	
		$('#Html').val('');
		
		$('#htmlDialog').modal('show');  // hide the dialog
	
	}
}

$(document).ready(function(){
	htmlDialog.init();
});