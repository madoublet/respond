// handles the html dialog
var htmlDialog = {

	editor: null,
	desc: '',
	type: 'html',
	mode: 'add',
	moduleId: null,

	init:function(){
	
		htmlDialog.desc = $('#msg-html-dialog-desc').val();
	
		$('#addHtml').click(function(){
		
			var editor = htmlDialog.editor;
			var uniqId = 'html'+ ($(editor).find('.html').length + 1);
			var code = $('#Html').val();
			var desc = jQuery.trim($('#HtmlDescription').val());
			var type = htmlDialog.type;
			
			if(desc==''){
				desc = 'HTML block';
			}
			
			// create pretty code for display
			var prettyCode = global.replaceAll(code, '<', '&lt;');
			prettyCode = global.replaceAll(prettyCode, '>', '&gt;');
			
			if(htmlDialog.mode=='add'){
			
				var html = '<div id="'+uniqId+'" class="html" data-desc="'+desc+'" data-type="'+type+'">' +
						respond.defaults.elementMenuHtml +
						'<div class="title"><i class="fa fa-html5"></i>' + 
						desc + 
						'<i class="fa fa-angle-down"></i></div>' +
						'<pre class="prettyprint linenums pre-scrollable">' + prettyCode + '</pre>' +
						'<pre class="non-pretty">' + code + '</pre>' +
						'</div>';
				
				respond.Editor.Append(editor, 
					html
				);
			
			}
			else{
				$('#'+htmlDialog.moduleId).attr('data-desc', desc);
				$('#'+htmlDialog.moduleId).find('div.title').html('<i class="fa fa-html5"></i>'+desc+' <i class="fa fa-angle-down"></i>');
				$('#'+htmlDialog.moduleId).find('.non-pretty').html(code);
				$('#'+htmlDialog.moduleId).find('.prettyprint').html(code);
				$('#'+htmlDialog.moduleId).find('.prettyprint').removeClass('prettyprinted');
			}
			
			prettyPrint();
			
			$('#htmlDialog').modal('hide');
		
		});
		
		
	
	},
	
	// shows the dialog
	show:function(editor, desc, type, mode, id){
	
		console.log(editor);
	
		htmlDialog.editor = editor;
		htmlDialog.desc = desc;
		htmlDialog.type = type;
		htmlDialog.mode = mode;
		htmlDialog.moduleId = id;
	
		$('.instructions').hide();
		
		var label = 'Add';
		var html = '';
		
		if(mode=='edit'){
			label = 'Update';
			html = $('#'+id).find('.non-pretty').html();
			//html = global.replaceAll(html, '&lt;', '<');
			//html = global.replaceAll(html, '&gt;', '>');
			
		}
		
		if(type=='twitter'){
			$('.twitter-instructions').show();
			$('#htmlDialog h3').text(label + ' Twitter Widget');
			$('#htmlDialog .primary-button').text(label + ' Twitter HTML');
		}
		else{
			$('#htmlDialog h3').text(label + ' HTML');
			$('#htmlDialog .primary-button').text(label + ' HTML');
		}
		
		$('#HtmlDescription').val(desc);
		
		$('#Html').val(html);
		
		$('#htmlDialog').modal('show');  // hide the dialog
	
	}
}

$(document).ready(function(){
	htmlDialog.init();
});