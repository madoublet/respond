<?php 
  include 'app.php'; // import php files
  
  $authUser = new AuthUser(); // get auth user
  $authUser->Authenticate('All');
?>
<!DOCTYPE html>
<html lang="en-US">

<head>
  
<title>Content - <?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- css -->
<link href="<?php print BOOTSTRAP_CSS; ?>" rel="stylesheet">
<link type="text/css" href="css/app.css" rel="stylesheet">
<link type="text/css" href="css/content.css" rel="stylesheet">
<link type="text/css" href="css/editor.css" rel="stylesheet">
<link type="text/css" href="css/messages.css" rel="stylesheet">
<link type="text/css" href="css/dialog.css" rel="stylesheet">
<link type="text/css" href="css/list.css" rel="stylesheet">
<link type="text/css" href="css/prettify.css" rel="stylesheet">
<link type="text/css" href="css/dropzone.css" rel="stylesheet">
<link href="<?php print JQUERYUI_CSS; ?>" rel="stylesheet">
<link href="<?php print FONTAWESOME_CSS; ?>" rel="stylesheet">

<!-- head -->
<script src="js/helper/head.min.js"></script>

</head>

<body data-currpage="content">

<!-- begin global messages -->
<p id="message">
  <span>Holds the message text.</span>
  <a class="close" href="#"></a>
</p>

<input type="hidden" id="PageUniqId" value="<?php print $p->PageUniqId; ?>">
<input type="hidden" id="PageTypeUniqId" value="<?php print $p->PageTypeUniqId; ?>">
<input type="hidden" id="FileUrl" value="<?php print $authUser->FileUrl; ?>">
<input type="hidden" id="TypeS" value="<?php print $p->TypeS; ?>">
<input type="hidden" id="Domain" value="<?php print $p->SiteUrl; ?>">

<?php include 'modules/menu.php'; ?>

<section class="main">
 
    <div id="editorContainer">
        <div id="desc" class="container-fluid" data-bind="html: content"></div>
    </div>
    
    <div id="actions" class="container-fluid">
        <button class="primary-button" type="button" data-bind="click: saveContent">Save and Publish</button>
        <!--<button class="secondary-button" type="button" data-bind="click: saveDraft">Save Draft</button>-->
        <button class="tertiary-button offset-left" type="button" onclick="javascript:history.back()">Cancel</button>
    </div>
    
</section>
<!-- /.main -->

<p id="contentLoading" data-bind="visible: contentLoading()" class="inline-status"><i class="icon-spinner icon-spin"></i> Loading content and editor...</p>

<div id="previewMessage">
  <span>You are previewing this page, click save to publish it.</span> 
  <button class="tertiary-button" data-bind="click: saveContent">Save Content</button> <span class="or">or
  <button class="tertiary-button" data-bind="click: hidePreview">Return to Editor</button></span>
</div>

<div id="previewContainer">
  <iframe id="preview" src=""></iframe>
</div>  
  
<div id="overlay"></div>  

<div class="hide immersive" id="imagesDialog">
  <div class="immersive-header">
    <h3>Select or upload a new image</h3>
    <button type="button" class="close" data-dismiss="modal">x</button>
  </div>
  <!-- /.modal-header -->

  <div class="immersive-body">
  
    <h2 data-bind="visible: (newimages().length > 0)">New Images</h2>

    <div  data-bind="visible: (newimages().length > 0)" class="image-list">
    
        <!-- ko foreach:newimages -->
        <div class="image new">
            <img data-bind="attr:{'src': thumbUrl}, click: $parent.addImage">
            <small>
                <span data-bind="text: filename"></span><br>
                <span data-bind="text: width"></span>px x <span data-bind="text: height"></span>px
            </small>
        </div>
        <!-- /ko -->

    </div>
  
    <h2>Existing Images</h2>

    <div class="image-list">
    
        <!-- ko foreach:images -->
        <div class="image existing">
            <img data-bind="attr:{'src': thumbUrl}, click: $parent.addImage">
            <small>
                <span data-bind="text: filename"></span><br>
                <span data-bind="text: width"></span>px x <span data-bind="text: height"></span>px
            </small>
        </div>
        <!-- /ko -->

    </div>
    
    <div id="drop" class="custom-dropzone">
        <span class="message">
            <i class="icon-cloud-upload icon-4x"></i>
            <span class="message-text">Drag file here or click to upload</span>
        </span>
    </div>
    
  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->

<div class="modal hide" id="slideshowDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">×</button>
    <h3>Add Slideshow</h3>
  </div>
  <!-- /.modal-header -->

  <div class="modal-body">

    <div class="form-horizontal">

    <p>
      Select the target width and height for the images in the slideshow.
    </p>

    <div class="control-group">
      <label for="slideShowWidth" class="control-label">Target Width:</label>
      <div class="controls">
        <input id="slideShowWidth" type="text" value="1024"> px
      </div>
    </div>

    <div class="control-group">
      <label for="slideShowHeight" class="control-label">Target Width:</label>
      <div class="controls">
        <input id="slideShowHeight" type="text" value="768"> px
      </div>
    </div>

    </div>
    <!-- /.form-horizontal -->
  
  </div>
  <!-- /.modal-body -->

  <div class="modal-footer">
    <a href="#" class="btn" data-dismiss="modal">Close</a>
    <input id="addSlideShow" type="button" class="btn btn-primary" value="Add Slideshow">
  </div>  
  <!-- /.modal-footer -->

</div>
<!-- /.modal -->

<div class="modal hide" id="elementConfigDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">×</button>
    <h3>Settings</h3>
  </div>
  <!-- /.modal-header -->

  <div class="modal-body">

    <div class="form-horizontal">

    <div class="control-group">
      <label for="elementId" class="control-label">Element Id:</label>
      <div class="controls">
        <input id="elementId" type="text" maxlength="128" value="">
      </div>
    </div>

    <div id="cssClass" class="control-group">
      <label for="elementCssClass" class="control-label">CSS Class:</label>
      <div class="controls">
        <input id="elementCssClass" type="text" maxlength="128" value="">
      </div>
    </div>
    
    <div id="imageOrientation" class="control-group image-config">
      <label for="elementCssClass" class="control-label">Image Orientation:</label>
      <div class="controls">
        <select id="imagePosition">
            <option value="left">Left of the text</option>
            <option value="right">Right of the text</option>
            <option value="none">No text</option>
        </select>
      </div>
    </div>
    
    <div id="imageLink" class="control-group image-config">
      <label for="elementCssClass" class="control-label">Image Link:</label>
      <div class="controls">
        <input id="imageLink" type="text" maxlength="512" value="" placeholder="http://">
      </div>
    </div>

    </div>
    <!-- /.form-horizontal -->
  
  </div>
  <!-- /.modal-body -->

  <div class="modal-footer">
    <button class="secondary-button" data-dismiss="modal">Close</button>
    <button id="updateElementConfig" class="primary-button" data-dismiss="modal">Update</button>
  </div>  
  <!-- /.modal-footer -->

</div>
<!-- /.modal -->

<div class="modal hide" id="blockConfigDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">×</button>
    <h3>Settings</h3>
  </div>
  <!-- /.modal-header -->

  <div class="modal-body">

    <div class="form-horizontal">

    <div class="control-group">
      <label for="blockId" class="control-label">Block Id:</label>
      <div class="controls">
        <input id="blockId" type="text" maxlength="128" value="">
      </div>
    </div>

    <div class="control-group">
      <label for="blockCssClass" class="control-label">Block Class:</label>
      <div class="controls">
        <input id="blockCssClass" type="text" maxlength="128" value="">
      </div>
    </div>

    </div>
    <!-- /.form-horizontal -->
  
  </div>
  <!-- /.modal-body -->

  <div class="modal-footer">
    <button class="secondary-button" data-dismiss="modal">Close</button>
    <button id="updateBlockConfig" class="primary-button" data-dismiss="modal">Update</button>
  </div>  
  <!-- /.modal-footer -->

</div>
<!-- /.modal -->

<div class="modal hide" id="fieldDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">×</button>
    <h3>Add Field</h3>
  </div>
  <!-- /.modal-header -->

  <div class="modal-body">

    <div class="form-horizontal">

    <div class="control-group">
      <label for="fieldName" class="control-label">Field Name:</label>
      <div class="controls">
        <input id="fieldName" type="text" maxlength="128" value="">
        <span class="help-block">e.g.: Phone Number, Name, etc.</span>
      </div>
    </div>

    <div class="control-group">
      <label for="fieldType" class="control-label">Field Type:</label>
      <div class="controls">
        <select id="fieldType">
          <option value="text">Text Box</option>
          <option value="textarea">Text Area</option>
          <option value="select">Dropdown List</option>
          <option value="checkboxlist">Checkbox List</option>
          <option value="radiolist">Radio button List</option>
        </select>
      </div>
    </div>

    <div class="control-group">
      <label for="fieldRequired" class="control-label">Required:</label>
      <div class="controls">
        <select id="fieldRequired">
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
    </div>

    <div id="options" class="control-group">
      <label for="fieldOptions" class="control-label">Options:</label>
      <div class="controls">
        <textarea id="fieldOptions"></textarea>
        <span class="help-block">Separate each option with a comma</span>
      </div>
    </div>

    <div class="control-group">
      <label for="fieldHelperText" class="control-label">Helper Text:</label>
      <div class="controls">
        <input id="fieldHelperText" type="text" maxlength="256" value="">
        <span class="help-block">e.g.: (314) 444-2343</span>
      </div>
    </div>

    </div>
    <!-- /.form-horizontal -->
  
  </div>
  <!-- /.modal-body -->

  <div class="modal-footer">
    <button type="button" class="secondary-button" data-dismiss="modal">Close</button>
    <button id="addField" type="button" class="primary-button">Add Field</button>
  </div>  
  <!-- /.modal-footer -->

</div>
<!-- /.modal -->

<div class="modal hide" id="listDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">×</button>
    <h3>Add List</h3>
  </div>
  <!-- /.modal-header -->

  <div class="modal-body">

    <div class="form-horizontal">

        <div id="listPageTypeBlock" class="control-group">
          <label for="listPageType" class="control-label">Page Type:</label>
          <div class="controls">
              <select id="listPageType" data-bind="foreach: pageTypes">
                <option data-bind="value: pageTypeUniqId, text: typeP"></option>
              </select>
          </div>
        </div>

        <div class="control-group">
          <label for="listDisplay" class="control-label">Display:</label>
          <div class="controls">
             <select id="listDisplay">
                <option value="list">List</option>
                <option value="blog">Blog</option>
             </select>
          </div>
        </div>

        <div class="control-group">
          <label for="listOrderBy" class="control-label">Order By:</label>
          <div class="controls">
             <select id="listOrderBy">
                <option value="Name">Name</option>
                <option value="Created">Date Created (newest first)</option>
              </select>
          </div>
        </div>

        <div class="control-group">
          <label for="listDescLength" class="control-label">Description Length:</label>
          <div class="controls">
             <input id="listDescLength" type="number" value="250">
          </div>
        </div>

        <div class="control-group">
          <label for="listLength" class="control-label">Page Size:</label>
          <div class="controls">
             <input id="listLength" type="number" value="10">
          </div>
        </div>

        <div class="control-group">
          <label for="listPageResults" class="control-label">Page Results:</label>
          <div class="controls">
            <select id="listPageResults">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

    </div>
    <!-- /.form-horizontal -->
  
  </div>
  <!-- /.modal-body -->

  <div class="modal-footer">
    <button class="secondary-button" data-dismiss="modal">Close</button>
    <button id="addList" class="primary-button">Add List</button>
    <button id="updateList" class="primary-button">Update List</button>
  </div>  
  <!-- /.modal-footer -->

</div>
<!-- /.modal -->

<div class="modal hide" id="linkDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">×</button>
    <h3>Add Link</h3>
  </div>
  <!-- /.modal-header -->

  <div class="modal-body">

  <p>
    <label><input id="existing" type="radio" class="radio" name="content" checked> Existing Page</label>
  </p>  

  <div id="pageUrl" class="select small">
    <ul data-bind="foreach: pages">
      <li data-bind="attr:{'data-pageid': pageId, 'data-url': $parent.toPagePrefix() + url()}, text:name"></li>
    </ul>
    <p data-bind="visible: pagesLoading()" class="inline-status"><i class="icon-spinner icon-spin"></i> Loading pages...</p>
  </div>
  
  <p>
    <label><input id="customUrl" type="radio" name="content" class="radio"> Custom URL</label>
  </p>
  
  <p>
    <input id="linkUrl" type="text" class="span3">
  </p>

  </div>
  <!-- /.modal-body -->

  <div class="modal-footer">
    <button class="secondary-button" data-dismiss="modal">Close</button>
    <button id="addLink" type="button" class="primary-button">Add Link</button>
  </div>
  <!-- /.modal-footer -->

</div>
<!-- /.modal -->

<div class="modal hide" id="loadLayoutDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">x</button>
    <h3>Load Existing Page</h3>
  </div>
  <!-- /.modal-header -->

  <div class="modal-body">

  <div id="selectPage" class="select">
    <ul data-bind="foreach: pages">
      <li data-bind="attr:{'data-pageuniqid': pageUniqId}, text:name"></li>
    </ul>
    <p data-bind="visible: pagesLoading()" class="inline-status"><i class="icon-spinner icon-spin"></i> Loading pages...</p>
  </div>    

  </div>
  <!-- /.modal-body -->

  <div class="modal-footer">
    <button class="secondary-button" data-dismiss="modal">Close</button>
    <button id="loadLayout" class="primary-button" type="button">Load Layout</button>
  </div>
  <!-- /.modal-footer -->

</div>
<!-- /.modal -->

<div class="modal hide" id="featuredDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">x</button>
    <h3>Feature Content</h3>
  </div>
  <!-- /.modal-header -->

  <div class="modal-body">

  <div id="selectFeaturedPage" class="select">
    <ul data-bind="foreach: pages">
      <li data-bind="attr:{'data-pageuniqid': pageUniqId, 'data-name': name}, text:name"></li>
    </ul>
    <p data-bind="visible: pagesLoading()" class="inline-status"><i class="icon-spinner icon-spin"></i> Loading pages...</p>
  </div>    

  </div>
  <!-- /.modal-body -->

  <div class="modal-footer">
    <button class="secondary-button" data-dismiss="modal">Close</button>
    <button id="addFeatured" class="primary-button" type="button">Add Featured Content</button>
  </div>
  <!-- /.modal-footer -->

</div>
<!-- /.modal -->

<div class="modal hide" id="pluginsDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">x</button>
    <h3>Select Plugin</h3>
  </div>
  <!-- /.modal-header -->

  <div class="modal-body">

  <div id="selectPlugin" class="select">

    <ul data-bind="foreach: plugins">
      <li>
        <a data-bind="attr:{'data-name':name, 'data-type':type, 'data-render':render, 'data-config':config}, text:name"></a>
        <em data-bind="text:desc"></em>
      </li>
    </ul>

    <p data-bind="visible: pluginsLoading()" class="inline-status"><i class="icon-spinner icon-spin"></i> Loading plugins...</p>

  </div>

  </div>
  <!-- /.modal-body -->

  <div class="modal-footer">
    <button class="secondary-button" data-dismiss="modal">Close</button>
    <button id="addPlugin" class="primary-button">Add Plugin</button>
  </div>
  <!-- /.modal-footer -->

</div>
<!-- /.modal -->

<div class="modal hide" id="configPluginsDialog" data-id="-1" data-type="-1">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">x</button>
    <h3>Configure Plugin</h3>
  </div>
  <!-- /.modal-header -->

  <div id="configurePluginForm" class="modal-body">

  </div>
  <!-- /.modal-body -->

  <div class="modal-footer">
    <button id="pluginClose" class="secondary-button" data-dismiss="modal">Close</button>
    <button id="updatePluginConfigs" class="primary-button">Update</button>
  </div>
  <!-- /.modal-footer -->

</div>
<!-- /.modal -->

<div class="modal hide" id="pageSettingsDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">x</button>
    <h3>Page Settings</h3>
  </div>
  <!-- /.modal-header -->

  <div class="modal-body" data-bind="with: page">

    <div class="form-horizontal">

      <div class="control-group">
        <label for="name" class="control-label">Name:</label>
        <div class="controls">
          <input id="name" type="text" maxlength="128" data-bind="value: name">
        </div>
      </div>
      
      <div class="control-group">
        <label for="URL" class="control-label">URL:</label>
        <div class="controls">
          <input id="friendlyId" type="text" maxlength="128" data-bind="value: friendlyId">
          <span class="help-block">No spaces, no special characters, dashes allowed.</span>
        </div>
      </div>

      <div class="control-group">
        <label for="description" class="control-label">Description:</label>
        <div class="controls">
          <textarea id="description" style="width: 80%; height: 100px;" data-bind="value: description"></textarea>
          <span class="help-block">Added to the <code>head</code> of the page, used as the description in search engines and for lists</span>
        </div>
      </div>
      
      <div class="control-group">
        <label for="keywords" class="control-label">Keywords:</label>
        <div class="controls">
          <textarea id="keywords" placeholder="keyword1, keyword2, keyword3, etc." style="width: 80%; height: 50px;" data-bind="value: keywords"></textarea>
        </div>
      </div>   
      
      <div class="control-group">
        <label for="callout" class="control-label">Callout:</label>
        <div class="controls">
          <input id="callout" type="text" maxlength="100" placeholder="Between $5-$8, On Sale Now"  data-bind="value: callout">
          <span class="help-block">Shows below the page name in lists to call attention to the item</span>
        </div>
      </div>
      
      <div class="control-group">
        <label for="rss" class="control-label">RSS:</label>  
        <div class="controls">
          <span class="checklist" data-bind="foreach: $parent.pageTypes">
            <label class="checkbox"><input type="checkbox" class="rss" data-bind="value: friendlyId, checked: ($parent.rss().indexOf(friendlyId())>-1), attr:{'data-rss': $parent.rss, 'data-friendlyId': friendlyId}"> <span data-bind="text:typeP"></span></label>
          </span>
          <span class="help-block">Adds a reference to the selected RSS feeds in the <code>head</code> of the page</span>
        </div>
      </div>
      
      <div class="control-group">
        <label for="layout" class="control-label">Layout:</label>
        <div class="controls">
          <select id="layout" data-bind="options: $parent.layouts, value: layout()"></select>
          <p data-bind="visible: $parent.layoutsLoading()" class="inline-status"><i class="icon-spinner icon-spin"></i> Loading...</p>
          <span class="help-block">HTML used to render the page</span>
        </div>
      </div>
      
      <div class="control-group">
        <label for="stylesheet" class="control-label">Styles:</label>
        <div class="controls">
          <select id="stylesheet" data-bind="options: $parent.stylesheets, value: stylesheet()"></select>
          <p data-bind="visible: $parent.stylesheetsLoading()" class="inline-status"><i class="icon-spinner icon-spin"></i> Loading...</p>
          <span class="help-block">CSS used to render the page</span>
        </div>
      </div>
    </div>

  </div>
  <!-- /.modal-body -->

  <div class="modal-footer">
    <button class="secondary-button" data-dismiss="modal">Close</button>
    <button class="primary-button" data-bind="click:saveSettings">Update</button>
  </div>
  <!-- /.modal-footer -->

</div>
<!-- /.modal -->

<div class="modal hide" id="codeBlockDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">x</button>
    <h3>Add Code Block</h3>
  </div>
  <!-- /.modal-header -->

  <div class="modal-body">

    <div class="form-horizontal">

        <p>Paste your code below:</p>
      
        <textarea id="Code" style="height: 300px; width: 100%; margin-right: 10px; box-sizing: border-box;"></textarea>

    </div>

  </div>
  <!-- /.modal-body -->

  <div class="modal-footer">
    <button class="secondary-button" data-dismiss="modal">Close</button>
    <button id="addCode" class="primary-button">Add Code Block</buttons>
  </div>
  <!-- /.modal-footer -->

</div>
<!-- /.modal -->

<div class="modal hide" id="filesDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">×</button>
    <h3>Add File</h3>
  </div>
  <div class="modal-body">

    <div id="selectFile" class="select">

        <ul data-bind="foreach: files">
          <li>
            <i class="icon-file-alt" data-bind="visible: (extension == 'pdf' || extension == 'doc'|| extension == 'docx'|| extension == 'zip' || extension == 'ppt')"></i>
            <i class="icon-picture" data-bind="visible: (extension == 'png' || extension == 'jpg'|| extension == 'gif')"></i>
            <a data-bind="attr:{'data-filename':filename, 'data-fullurl':fullUrl, 'data-extension':extension}, text:filename"></a>
          </li>
        </ul>
    
        <p data-bind="visible: filesLoading()" class="inline-status"><i class="icon-spinner icon-spin"></i> Loading files...</p>
    
      </div>
    
  </div>
  <div class="modal-footer">
    <button class="secondary-button" data-dismiss="modal">Close</button>
    <button class="primary-button" data-bind="click: addFile">Add File</a>
  </div>  
</div>
<!-- /.modal -->

<div id='aviary-modal'></div>

<div id="overlay"></div>

</body>

<!-- helper -->
<script type="text/javascript" src="<?php print JQUERY_JS; ?>"></script>
<script type="text/javascript" src="<?php print JQUERYUI_JS; ?>"></script>
<script type="text/javascript" src="<?php print BOOTSTRAP_JS; ?>"></script>
<script type="text/javascript" src="<?php print KNOCKOUT_JS; ?>"></script>
<script type="text/javascript" src="js/helper/moment.min.js"></script>
<script type="text/javascript" src="js/helper/flipsnap.min.js"></script>
<script type="text/javascript" src="js/helper/prettify.js"></script>
<script type="text/javascript" src="js/helper/dropzone.js"></script>
<script type="text/javascript" src="http://feather.aviary.com/js/feather.js"></script>

<!-- plugins -->
<script type="text/javascript" src="js/plugins/jquery.ui.touch-punch.min.js"></script>
<script type="text/javascript" src="js/plugins/jquery.paste.js"></script>
<script type="text/javascript" src="js/plugins/jquery.respondEdit.js"></script>

<!-- app -->
<script type="text/javascript" src="js/global.js"></script>
<script type="text/javascript" src="js/messages.js"></script>

<!-- dialogs -->
<script type="text/javascript" src="js/dialog.js"></script>
<script type="text/javascript" src="js/dialogs/loadLayoutDialog.js"></script>
<script type="text/javascript" src="js/dialogs/pluginsDialog.js"></script>
<script type="text/javascript" src="js/dialogs/configPluginsDialog.js"></script>
<script type="text/javascript" src="js/dialogs/pageSettingsDialog.js"></script>
<script type="text/javascript" src="js/dialogs/codeBlockDialog.js"></script>
<script type="text/javascript" src="js/dialogs/imagesDialog.js"></script>
<script type="text/javascript" src="js/dialogs/filesDialog.js"></script>
<script type="text/javascript" src="js/dialogs/listDialog.js"></script>
<script type="text/javascript" src="js/dialogs/featuredDialog.js"></script>
<script type="text/javascript" src="js/dialogs/linkDialog.js"></script>
<script type="text/javascript" src="js/dialogs/fieldDialog.js"></script>
<script type="text/javascript" src="js/dialogs/slideshowDialog.js"></script>
<script type="text/javascript" src="js/dialogs/elementConfigDialog.js"></script>
<script type="text/javascript" src="js/dialogs/blockConfigDialog.js"></script>
<script type="text/javascript" src="js/dialogs/aviaryDialog.js"></script>

<!-- page -->
<script type="text/javascript" src="js/viewModels/models.js" defer="defer"></script>
<script type="text/javascript" src="js/viewModels/contentModel.js" defer="defer"></script>

</html>