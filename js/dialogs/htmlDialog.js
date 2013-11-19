// handles the html dialog
var htmlDialog = {

	type: 'html',
	mode: 'add',
	moduleId: null,

	init:function(){
	
		$('#addHtml').click(function(){
		
			var editor = $('#desc');
			var uniqId = 'html'+ ($(editor).find('.html').length + 1);
			var code = $('#Html').val();
			var desc = jQuery.trim($('#HtmlDescription').val());
			var type = htmlDialog.type;
			
			if(desc==''){
				desc = 'HTML block';
			}
			
			code = global.replaceAll(code, '<', '&lt;');
			
			if(htmlDialog.mode=='add'){
			
				var html = '<div id="'+uniqId+'" class="html" data-desc="'+desc+'" data-type="'+type+'">' +
						'<div><i class="fa fa-html5"></i>'+desc+' <i class="fa fa-angle-down"></i></div>' +
						'<pre class="prettyprint linenums pre-scrollable">' + code + '</pre>' +
						'<pre class="non-pretty">' + code + '</pre>' +
						'<span class="marker fa fa-html5" title="Code block"></span><a class="remove fa fa-minus-circle"></a><a class="config-html fa fa-cog"></a></div>';
				
				$(editor).respondAppend(
					html
				);
			
			}
			else{
				$('#'+htmlDialog.moduleId).find('.non-pretty').html(code);
				$('#'+htmlDialog.moduleId).find('.prettyprint').html(code);
				$('#'+htmlDialog.moduleId).find('.prettyprint').removeClass('prettyprinted');
			}
			
			prettyPrint();
			
			$('#htmlDialog').modal('hide');
		
		});
		
		
	
	},
	
	// shows the dialog
	show:function(type, mode, id){
	
		htmlDialog.type = type;
		htmlDialog.mode = mode;
		htmlDialog.moduleId = id;
	
		$('.instructions').hide();
		
		var label = 'Add';
		var html = '';
		
		if(mode=='edit'){
			label = 'Update';
			html = $('#'+id).find('.non-pretty').html();
			html = global.replaceAll(html, '&lt;', '<');
			html = global.replaceAll(html, '&gt;', '>');
		}
		
		if(type=='twitter'){
			$('.twitter-instructions').show();
			$('#htmlDialog h3').text(label + ' Twitter Widget');
			$('#htmlDialog .primary-button').text(label + ' Twitter HTML');
			$('#HtmlDescription').val('Twitter Widget');
		}
		else{
			$('#htmlDialog h3').text(label + ' HTML');
			$('#htmlDialog .primary-button').text(label + ' HTML');
			$('#HtmlDescription').val('HTML block');
		}
	
		$('#Html').val(html);
		
		$('#htmlDialog').modal('show');  // hide the dialog
	
	}
}

$(document).ready(function(){
	htmlDialog.init();
});