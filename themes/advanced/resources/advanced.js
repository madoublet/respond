// methods for the advanced theme
var advanced = {
    
    init:function(){
      
        // toggle nav
        $('.settings-toggle').on('click', function(){
        	$('body').toggleClass('show-settings'); 
        });
      
    }

}

advanced.init();