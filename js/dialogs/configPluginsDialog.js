// create the plugin namespace
if(typeof plugin == "undefined" || !plugin) {
    var plugin = {};
}

// handles the plugin configurations dialog on content.php
var configPluginsDialog = {

  modal: null,

  init:function(){
    configPluginsDialog.modal = $('#configPluginsDialog');
  },

  // shows the slide show dialog
  show:function(id, type){

    configPluginsDialog.modal.data('id', id);
    configPluginsDialog.modal.data('type', type);

    $('#configurePluginForm').load('plugins/'+type+'/config.php', function(){ // load the config file

        if(typeof plugin[type] == "undefined" || !plugin[type]){ // check to see if the plugin has been loaded

            head.js('plugins/'+type+'/js/config.js', function(){ // load the js for the config file
                configPluginsDialog.setup(id, type);
            });

        }
        else{
            configPluginsDialog.setup(id, type);
        }

    });

  },

  // setup the plugin
  setup:function(id, type){

    var pageUniqId = contentModel.pageUniqId();
    var pluginUniqId = id;

    plugin[type].init(pageUniqId, pluginUniqId); // initialize the plugin

    // show the dialog
    $('#configPluginsDialog').modal('show');  // show the dialog

    if(plugin[type].showUpdate==false){
        $('#updatePluginConfigs').hide();        
    }
    else{
        $('#updatePluginConfigs').show();
    }

    $('#updatePluginConfigs').unbind('click');

    $('#updatePluginConfigs').click(function(){
        plugin[type].update(this);

        $('#configPluginsDialog').modal('hide');  // hide the dialog
    });
  }
}

$(document).ready(function(){
  configPluginsDialog.init();
});