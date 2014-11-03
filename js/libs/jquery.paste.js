(function($){  
	$.fn.paste = function(){
		
		$(this).on('paste', function(e){
			
			ph.curr = this;
			
			setTimeout('ph.callback()', 100);
		});
		
	}	
})(jQuery);

var ph = {
		
  curr:null,
		
  callback:function(){
	
	function removeTags(data, tag){
		var re = new RegExp('<'+tag+'[^><]*>|<.'+tag+'[^><]*>','g') // remove tags
		
		data = data.replace(re, '');
		
		return data;
	}
	
	function removeStyle(data){
		var rs = new RegExp(/<a[^>]*style=.*?>/);
		
		data = data.replace(rs, '');
		
		return data;
	}
	
	var data = $(ph.curr).html();
	
	// remove style attributes
	var rs = new RegExp("([\w-]+)\s*:\s*([^;]+)"); // remove style attributes
	data = data.replace(rs, '');
	
	// really only want to leave b, i, and a tags
	// data = removeTags(data, 'a');
	data = removeStyle(data);
	data = removeTags(data, 'abbr');
	data = removeTags(data, 'acronym');
	data = removeTags(data, 'address');
	data = removeTags(data, 'applet');
	data = removeTags(data, 'area');
	// data = removeTags(data, 'b');
	data = removeTags(data, 'base');
	data = removeTags(data, 'basefont');
	data = removeTags(data, 'bdo');
	data = removeTags(data, 'big');
	data = removeTags(data, 'blockquote');
	data = removeTags(data, 'body');
	data = removeTags(data, 'br');
	data = removeTags(data, 'button');
	data = removeTags(data, 'caption');
	data = removeTags(data, 'center');
	data = removeTags(data, 'cite');
	data = removeTags(data, 'code');
	data = removeTags(data, 'col');
	data = removeTags(data, 'colgroup');
	data = removeTags(data, 'dd');
	data = removeTags(data, 'del');
	data = removeTags(data, 'dfn');
	data = removeTags(data, 'dir');
	data = removeTags(data, 'div');
	data = removeTags(data, 'dl');
	data = removeTags(data, 'dt');
	data = removeTags(data, 'em');
	data = removeTags(data, 'fieldset');
	data = removeTags(data, 'font');
	data = removeTags(data, 'form');
	data = removeTags(data, 'frame');
	data = removeTags(data, 'frameset');
	data = removeTags(data, 'h1');
	data = removeTags(data, 'h2');
	data = removeTags(data, 'h3');
	data = removeTags(data, 'h4');
	data = removeTags(data, 'h5');
	data = removeTags(data, 'h6');
	data = removeTags(data, 'head');
	data = removeTags(data, 'hr');
	data = removeTags(data, 'html');
	// data = removeTags(data, 'i');
	data = removeTags(data, 'iframe');
	data = removeTags(data, 'img');
	data = removeTags(data, 'input');
	data = removeTags(data, 'ins');
	data = removeTags(data, 'kbd');
	data = removeTags(data, 'label');
	data = removeTags(data, 'legend');
	data = removeTags(data, 'li');
	data = removeTags(data, 'link');
	data = removeTags(data, 'map');
	data = removeTags(data, 'menu');
	data = removeTags(data, 'meta');
	data = removeTags(data, 'noframes');
	data = removeTags(data, 'noscript');
	data = removeTags(data, 'object');
	data = removeTags(data, 'ol');
	data = removeTags(data, 'optgroup');
	data = removeTags(data, 'option');
	data = removeTags(data, 'p');
	data = removeTags(data, 'param');
	data = removeTags(data, 'pre');
	data = removeTags(data, 'q');
	data = removeTags(data, 's');
	data = removeTags(data, 'samp');
	data = removeTags(data, 'script');
	data = removeTags(data, 'select');
	data = removeTags(data, 'small');
	data = removeTags(data, 'span');
	data = removeTags(data, 'strike');
	data = removeTags(data, 'strong');
	data = removeTags(data, 'style');
	data = removeTags(data, 'sub');
	data = removeTags(data, 'sup');
	data = removeTags(data, 'table');
	data = removeTags(data, 'tbody');
	data = removeTags(data, 'td');
	data = removeTags(data, 'textarea');
	data = removeTags(data, 'tfoot');
	data = removeTags(data, 'th');
	data = removeTags(data, 'thead');
	data = removeTags(data, 'title');
	data = removeTags(data, 'tr');
	data = removeTags(data, 'tt');
	data = removeTags(data, 'u');
	data = removeTags(data, 'ul');
	data = removeTags(data, 'var');
	data = removeTags(data, 'xmp');
	
	if(document.all){ // right now, ie just wipes everything out b/c that regular expression is not working
	  data = data.replace(/<\/?[^>]+>/gi, '');
	  data = data.replace(/"/gi, '').replace(/'/gi, '');
	}
	
	$(ph.curr).html(data);
  }
		
}