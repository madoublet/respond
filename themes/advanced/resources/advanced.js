// methods for the advanced Respond features
var advanced = {
    
    init:function(){
      
        // toggle nav
        $('.settings-toggle').on('click', function(){
        	$('body').toggleClass('show-settings'); 
        });
      
    }

}

advanced.init();