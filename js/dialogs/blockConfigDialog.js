var blockConfigDialog = {

	dialog: null,
	blockId: null,
	
	init:function(){

		blockConfigDialog.dialog = $('#blockConfigDialog');

		// handle update block settings
		$('#updateBlockConfig').click(function(){

			var blockId = blockConfigDialog.blockId;

			var id = $('#blockId').val().trim().replace(/\s/g, '-');
			
			var cssClass = $.trim($('#blockCssClass').val());
			var cssClass_readable = '.block.row';
			var nested = $.trim($('#blockNested').val());
			var containerId = $.trim($('#blockContainerId').val());
			var containerCssClass = $.trim($('#blockContainerCssClass').val());

			if(cssClass!=''){
				cssClass_readable = cssClass_readable + '.' + cssClass;
			}

			if(id!=''){
				$('#'+blockId).attr('id', id); 
				$('#'+blockId).attr('data-cssclass', cssClass);
				$('#'+blockId).attr('data-nested', nested);
				$('#'+blockId).attr('data-containerid', containerId);
				$('#'+blockId).attr('data-containercssclass', containerCssClass);
				$('#'+id).find('.block-actions span').text('#'+id+' '+cssClass_readable.trim().replace(/\s/g, '.'));
			}

			$('#blockConfigDialog').modal('hide');
		});
		
		$('#blockNested').on('change', function(){
			
			var selected = $(this).val();
			
			if(selected == 'nested'){
				$('.block-nested').show();
			}
			else{
				$('.block-nested').hide();
			}
			
		});
		
	},

	show:function(blockId, id, cssClass, nested, containerId, containerCssClass){ // shows the dialog

		blockConfigDialog.blockId = blockId;
		$('#blockId').val(id);
		$('#blockCssClass').val(cssClass);
		
		if(nested == undefined){
			nested = 'not-nested';
		}
		
		if(containerId == undefined){
			containerId = '';
		}
		
		if(containerCssClass == undefined){
			containerCssClass = '';
		}
		
		if(nested == 'nested'){
			$('.block-nested').show();
		}
		else{
			$('.block-nested').hide();
		}
		
		$('#blockNested').val(nested);
		$('#blockContainerId').val(containerId);
		$('#blockContainerCssClass').val(containerCssClass);

		$('#blockConfigDialog').modal('show');
	}

}

$(document).ready(function(){
  	blockConfigDialog.init();
});