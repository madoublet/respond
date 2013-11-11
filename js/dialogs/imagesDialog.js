// handles the images dialog on content.php
var imagesDialog = {
    
    moduleId: null,

    init:function(){
        
        // setup dropzone
        $("#drop").dropzone({ 
            url: "/api/file/post",
            clickable: true,
            success: function(file, response){
                var image = jQuery.parseJSON(response);
                
                var filename = image.filename;
    
                var match = ko.utils.arrayFirst(contentModel.images(), function (item) {
                                return item.filename === filename; 
                            });
                        
                if (!match) {
                    contentModel.images.push(image); 
                    contentModel.newimages.push(image); 
                }
            }
            
        });
      
    },
    
    addImage:function(src, t_src, filename){
      
      var images_count = $('div.img').length + 1;
      
      var uniqId = 'image'+images_count;
      
      if(imagesDialog.type=='slideshow'){  // add image (thumb) to slideshow
      
        var html = '<span class="image"><img id="' + filename + '" src="'+t_src+'" title=""><span class="caption"><input type="text" value="" placeholder="Enter caption" maxwidth="140"></span><a class="remove fa-minus-circle"></a></span>';
        
        html += '<button type="button" class="secondary-button add-image"><i class="fa fa-picture-o"></i></button>';
        
        $('#desc').find('div#'+imagesDialog.moduleId+' .add-image').remove();
        
        $('#desc').find('div#'+imagesDialog.moduleId+
        ' div').append(
          html
        );
        
        $('#desc').respondHandleEvents();
          
      }
      else{ // add image
          var divId = 'imagecontainer'+images_count;
          
          var href = '';
          
          var html = '<div id="'+divId+'" class="i" data-id="'+divId+'" data-cssclass="">';
          html += imagesDialog.getImageHtml('none', uniqId, src, href, '&nbsp;');
          html += '</div>';
          
          $('#desc').respondAppend(html);
      }
      
      $('#imagesDialog').modal('hide');
      
    },
    
    // gets the image HTML
    getImageHtml:function(position, imageId, src, href, content){
    
    	if(content == '&nbsp;'){
	    	content = 'Add your content here or click the settings icon to change the image layout...';
    	}
    
		if(position=='left'){
			if(href==''){
				html = '<div class="img"><img id="' + imageId + '" src="'+src+'"></div><div class="content" contentEditable="true">'+content+'</div><span class="marker fa fa-picture-o"></span><a class="remove fa fa-minus-circle""></a><a class="config fa fa-cog"></a>';
			}
			else{
				html = '<div class="img"><img id="' + imageId + '" src="'+src+'" data-url="'+href+'"></div><div class="content" contentEditable="true">'+content+'</div><span class="marker fa fa-picture-o"></span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>';
			}
		}
		else if(position=='right'){
			if(href==''){
				html = '<div class="content" contentEditable="true">'+content+'</div><div class="img"><img id="' + imageId + '" src="'+src+'"></div><span class="marker fa fa-picture-o"></span><a class="remove fa fa-minus-circle""></a><a class="config fa fa-cog"></a>';
			}
			else{
				html = '<div class="content" contentEditable="true">'+content+'</div><div class="img hasUrl"><img id="' + imageId + '" src="'+src+'" data-url="'+href+'"></div><span class="marker fa fa-picture-o"></span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>';
			}
		}
		else{ // for no text
			if(href==''){
				html = '<div class="img"><img id="' + imageId + '" src="'+src+'"></div><span class="marker fa fa-picture-o"></span><a class="remove fa fa-minus-circle""></a><a class="config fa fa-cog"></a>'; 
			}
			else{
				html = '<div class="img hasUrl"><img id="' + imageId + '" src="'+src+'" data-url="'+href+'"></div><span class="marker fa fa-picture-o"></span><a class="remove fa fa-minus-circle"></a><a class="config fa fa-cog"></a>'; 
			}
		}
		
		return html;
	},

    // shows the images dialog
    show:function(type, moduleId){
        
        imagesDialog.type = type;
        imagesDialog.moduleId = moduleId;
        
        contentModel.updateImages();
        
        $('#imagesDialog').modal('show');
    }
}

$(document).ready(function(){
  imagesDialog.init();
});