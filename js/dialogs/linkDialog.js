var linkDialog = {

	dialog: null,
	pageId: -1,
	url: -1,
    selection: null,

	init:function(){

		linkDialog.dialog = $('#linkDialog');

		 // handle link dialog
		$('#pageUrl li').live('click', function(){
			document.getElementById('existing').checked = true; 
			$('#pageUrl li').removeClass('selected');
			$(this).addClass('selected');

			var pageId = $(this).attr('data-pageid');
			var url = $(this).attr('data-url');

			linkDialog.pageId = pageId;
			linkDialog.url = url;        
		});

		$('#linkUrl').click(function(){
			document.getElementById('customUrl').checked = true;  
		});

		$('#addLink').live("click", function(){
  
			var pageId = -1;
			var url = '';

			if(document.getElementById('customUrl').checked){
				url = $('#linkUrl').val();
				pageId = -1;
			}
			else{
				url = linkDialog.url;
				url = url.toLowerCase();
				pageId = linkDialog.pageID;
			}
			
			var cssClass = $('#linkCssClass').val().trim();

			// restore selection
			global.restoreSelection(linkDialog.selection);

			// create link
			var text = global.getSelectedText();
			var html = '<a href="'+url+'"';
			
			// insert css class into link
			if(cssClass != ''){
				html += ' class="'+cssClass+'"';
			}
			
			html += '>'+text+'</a>';
			
			// insert HTML
			document.execCommand('InsertHTML', false, html);

			$('#linkDialog').modal('hide');
		});

	},

	show:function(){ // shows the dialog

		contentModel.updatePages(); // update pages for the dialog

		linkDialog.selection = global.saveSelection();

	    $('#linkUrl').val('');
	    $('#linkCssClass').val('');
	    $('#pageUrl li').removeClass('selected');
	    $('#existing').attr('checked','checked');

		$('#linkDialog').modal('show'); // show modal
	 
	}

}

$(document).ready(function(){
  linkDialog.init();
});