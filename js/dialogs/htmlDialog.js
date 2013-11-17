// handles the html dialog
var htmlDialog = {

	init:function(){
	
		$('#addHtml').click(function(){
		
			var editor = $('#desc');
			var uniqId = 'html-'+parseInt(new Date().getTime() / 1000);
			var code = $('#Html').val();
			var desc = jQuery.trim($('#HtmlDescription').val());
			
			if(desc==''){
				desc = 'HTML block';
			}
			
			code = global.replaceAll(code, '<', '&lt;');
			
			var html = '<div id="'+uniqId+'" class="html" data-desc="'+desc+'">' +
					'<div><i class="fa fa-html5"></i>'+desc+' <i class="fa fa-angle-down"></i></div>' +
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
			$('#HtmlDescription').val('Twitter Widget');
		}
		else{
			$('#htmlDialog h3').text('Add HTML');
			$('#htmlDialog .primary-button').text('Add HTML');
			$('#HtmlDescription').val('HTML block');
		}
	
		$('#Html').val('');
		
		$('#htmlDialog').modal('show');  // hide the dialog
	
	}
}

$(document).ready(function(){
	htmlDialog.init();
});