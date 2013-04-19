var blockConfigDialog = {

	dialog: null,
	blockId: null,
	
	init:function(){

		blockConfigDialog.dialog = $('#blockConfigDialog');

		// handle update block settings
		$('#updateBlockConfig').click(function(){

			var blockId = blockConfigDialog.blockId;

			var id = jQuery.trim($('#blockId').val());
			var cssClass = jQuery.trim($('#blockCssClass').val());
			var cssClass_readable = '.block.row-fluid';

			if(cssClass!=''){
				cssClass_readable = cssClass_readable + '.' + cssClass;
			}

			if(id!=''){
				$('#'+blockId).attr('id', id); 
				$('#'+blockId).attr('data-cssclass', cssClass);
				$('#'+id).find('.blockActions span').text('#'+id+' '+cssClass_readable);
			}

			$('#blockConfigDialog').modal('hide');
		});
		
	},

	show:function(blockId, id, cssClass){ // shows the dialog

		blockConfigDialog.blockId = blockId;
		$('#blockId').val(id);
		$('#blockCssClass').val(cssClass);

		$('#blockConfigDialog').modal('show');
	}

}

$(document).ready(function(){
  	blockConfigDialog.init();
});