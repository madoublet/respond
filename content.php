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
<link href="<?php print FONT; ?>" rel="stylesheet" type="text/css">
<link href="<?php print BOOTSTRAP_CSS; ?>" rel="stylesheet">
<link type="text/css" href="css/app.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/content.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/editor.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/messages.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/dialog.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/list.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/prettify.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/dropzone.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link href="<?php print JQUERYUI_CSS; ?>" rel="stylesheet">
<link href="<?php print FONTAWESOME_CSS; ?>" rel="stylesheet">

<!-- head -->
<script src="js/helper/head.min.js"></script>

</head>

<body data-currpage="content" data-domain="<?php print $authUser->Domain; ?>" data-appurl="<?php print APP_URL; ?>">

<!-- begin global messages -->
<p id="message">
  <span>Holds the message text.</span>
  <a class="close" href="#"></a>
</p>

<?php include 'modules/menu.php'; ?>

<section class="main">

	<div id="editor-menu">
	
	</div>
 
    <div id="editor-container">
        <div id="desc" class="container" data-bind="html: content"></div>
    </div>
    
    <div id="actions">
        <button class="primary-button" type="button" data-bind="click: saveContent">Save and Publish</button>
        <button class="secondary-button" type="button" data-bind="click: saveDraft">Save Draft</button>
        <button class="tertiary-button offset-left" type="button" onclick="javascript:history.back()">Return</button>
    </div>
    
</section>
<!-- /.main -->

<p id="contentLoading" data-bind="visible: contentLoading()" class="inline-status"><i class="fa fa-spinner fa-spin"></i> Loading content and editor...</p>

<div id="previewMessage">
  <span>You are previewing this page, click save to publish it.
  <button class="tertiary-button" data-bind="click: saveContent">Save Content</button> or
  <button class="tertiary-button" data-bind="click: hidePreview">Return to Editor</button></span>
</div>

<div id="previewContainer">
  <iframe id="preview" src=""></iframe>
</div>  
  
<div id="overlay"></div>  

<div class="immersive" id="imagesDialog">

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
    
    <div id="drop" class="dropzone in-dialog">
        <span class="dz-message">
            <i class="fa fa-cloud-upload fa-4x"></i> Drag file here or click to upload</span>
        </span>
    </div>
    <!-- /.dropzone -->
    
  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->

<div class="modal fade" id="slideshowDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3>Add Slideshow</h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">

			<p>
			  Select the target width and height for the images in the slideshow.
			</p>
			
			<div class="form-group">
			  <label for="slideShowWidth" class="control-label">Target Width:</label>
			  <input id="slideShowWidth" type="number" value="1024" class="form-control">
			  <span class="help-block">In Pixels</span>
			</div>
			
			<div class="form-group">
			  <label for="slideShowHeight" class="control-label">Target Height:</label>
			  <input id="slideShowHeight" type="number" value="768" class="form-control">
			  <span class="help-block">In Pixels</span>
			</div>
			
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<input id="addSlideShow" type="button" class="primary-button" value="Add Slideshow">
			</div>
			<!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->

<div class="modal fade" id="elementConfigDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3>Settings</h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">
			
				<div class="form-group">
					<label for="elementId" class="control-label">Element Id:</label>
					<input id="elementId" type="text" maxlength="128" value="" class="form-control">
				</div>
				
				<div id="cssClass" class="form-group">
					<label for="elementCssClass" class="control-label">CSS Class:</label>
					<input id="elementCssClass" type="text" maxlength="128" value="" class="form-control">
				</div>
				
				<!-- image options -->
				<div id="imageOrientation" class="form-group image-config">
					<label for="elementCssClass">Image Orientation:</label>
					<select id="imagePosition" class="form-control">
						<option value="left">Left of the text</option>
						<option value="right">Right of the text</option>
						<option value="none">No text</option>
					</select>
				</div>
				
				<div id="imageLink" class="form-group image-config">
				  <label for="elementCssClass" class="control-label">Image Link:</label>
				  <input id="imageLink" type="text" maxlength="512" value="" placeholder="http://" class="form-control">
				</div>
				
				<!-- table options -->
				<div class="form-group table-config">
				  <label for="tableRows" class="control-label">Table Rows:</label>
				  <input id="tableRows" type="number" class="form-control">
				</div>
				
				<div class="form-group table-config">
				  <label for="tableColumns" class="control-label">Table Columns:</label>
				  <input id="tableColumns" type="number" class="form-control">
				</div>
				
			
			</div>
			<!-- /.modal-body -->
			
			
			
			<div class="modal-footer">
			<button class="secondary-button" data-dismiss="modal">Close</button>
			<button id="updateElementConfig" class="primary-button" data-dismiss="modal">Update</button>
			</div> 
			<!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->
			
</div>
<!-- /.modal -->

<div class="modal fade" id="blockConfigDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3>Settings</h3>
			</div>
			<!-- /.modal-header -->
	
			<div class="modal-body">
			
				<div class="form-group">
					<label for="blockId" class="control-label">Block Id:</label>
					<input id="blockId" type="text" maxlength="128" value="" class="form-control">
				</div>
				
				<div class="form-group">
					<label for="blockCssClass" class="control-label">Block Class:</label>
					<input id="blockCssClass" type="text" maxlength="128" value="" class="form-control">
				</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button id="updateBlockConfig" class="primary-button" data-dismiss="modal">Update</button>
			</div> 
			<!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->

<div class="modal fade" id="fieldDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3>Add Field</h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">

				<div class="form-group">
					<label for="fieldName" class="control-label">Field Name:</label>
					<input id="fieldName" type="text" maxlength="128" value="" class="form-control">
					<span class="help-block">e.g.: Phone Number, Name, etc.</span>
				</div>
				
				<div class="form-group">
					<label for="fieldType" class="control-label">Field Type:</label>
					<select id="fieldType" class="form-control">
						<option value="text">Text Box</option>
						<option value="textarea">Text Area</option>
						<option value="select">Dropdown List</option>
						<option value="checkboxlist">Checkbox List</option>
						<option value="radiolist">Radio button List</option>
				  	</select>
				</div>
				
				<div class="form-group">
					<label for="fieldRequired" class="control-label">Required:</label>
					<select id="fieldRequired" class="form-control">
					  <option value="yes">Yes</option>
					  <option value="no">No</option>
					</select>
				</div>
				
				<div id="options" class="form-group">
					<label for="fieldOptions" class="control-label">Options:</label>
					<textarea id="fieldOptions" class="form-control"></textarea>
					<span class="help-block">Separate each option with a comma</span>
				</div>
				
				<div class="form-group">
					<label for="fieldHelperText" class="control-label">Helper Text:</label>
					<input id="fieldHelperText" type="text" maxlength="256" value="" class="form-control">
					<span class="help-block">e.g.: (314) 444-2343</span>
				</div>
				
				</div>
				<!-- /.modal-body -->
				
				<div class="modal-footer">
					<button type="button" class="secondary-button" data-dismiss="modal">Close</button>
					<button id="addField" type="button" class="primary-button">Add Field</button>
				</div>  
				<!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->

<div class="modal fade" id="skuDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3>Add SKU</h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">

				<div class="form-group">
					<label for="sku" class="control-label">SKU:</label>
					<input id="sku" type="text" maxlength="128" value="" class="form-control">
				</div>
				
				<div class="form-group">
					<label for="sku-desc" class="control-label">Description:</label>
					<input id="sku-desc" type="text" maxlength="128" value="" class="form-control">
				</div>
				
				<div class="form-group">
					<label for="sku-price" class="control-label">Price:</label>
				    <input id="sku-currency" type="number" maxlength="128" value="" class="form-control">
				</div>
				
				<div class="form-group">
					<label for="sku-price" class="control-label">Currency:</label>
				    <select id="sku-currency" class="form-control">
				    	<option value="USD">USD</option>
				    </select>
				</div>
				
				<div class="form-group">
					<label for="sku-quantity" class="control-label">Quantity:</label>
					<input id="sku-quantity" type="number" value="" class="form-control">
				</div>
				
				<div class="form-group">
					<label for="sku-shipping-type" class="control-label">Shipping Type:</label>
				    <select id="sku-shipping-type" class="form-control">
				    	<option value="flat-rate">Flat Rate</option>
				    	<option value="per-item">Per Item</option>
				    	<option value="digital">Digital Download (not shipped)</option>
				    	<option value="delivered">Delivered (not shipped)</option>
				    	<option value="other">Other (not shipped)</option>
				    </select>
				</div>
				
				<div id="sku-show-ship" class="form-group">
					<label for="sku-shipping" class="control-label">Shipping Rate:</label>
				    <input id="sku-shipping" type="number" maxlength="128" value="" class="form-control">
				</div>
				
				<div id="sku-show-download" class="form-group">
					<label for="sku-download-url" class="control-label">Download URL:</label>
					<input id="sku-download-url" type="text" maxlength="256" value="" placeholder="http://" class="form-control">
				</div>
				
				</div>
				<!-- /.modal-body -->
				
				<div class="modal-footer">
					<button type="button" class="secondary-button" data-dismiss="modal">Close</button>
					<button id="addField" type="button" class="primary-button">Add SKU</button>
				</div>  
				<!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->


<div class="modal fade" id="listDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3>Add List</h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">
			
			<div id="listPageTypeBlock" class="form-group">
				<label for="listPageType">Page Type:</label>
				<select id="listPageType" data-bind="foreach: pageTypes" class="form-control">
					<option data-bind="value: pageTypeUniqId, text: typeP"></option>
				</select>
			</div>
			
			<div class="form-group">
				<label for="listDisplay">Display:</label>
				<select id="listDisplay" class="form-control">
					<option value="list">List</option>
					<option value="blog">Blog</option>
				</select>
			</div>
			
			<div class="form-group">
				<label for="listOrderBy">Order By:</label>
				<select id="listOrderBy" class="form-control">
					<option value="Name">Name</option>
					<option value="Created">Date Created (newest first)</option>
				</select>
			</div>
			
			<div class="form-group">
				<label for="listDescLength">Description Length:</label>
				<input id="listDescLength" type="number" value="250" class="form-control">
			</div>
			
			<div class="form-group">
				<label for="listLength">Page Size:</label>
				<input id="listLength" type="number" value="10" class="form-control">
			</div>
			
			<div class="form-group">
				<label for="listPageResults">Page Results:</label>
				<select id="listPageResults" class="form-control">
					<option value="true">Yes</option>
					<option value="false">No</option>
				</select>
			</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button id="addList" class="primary-button">Add List</button>
				<button id="updateList" class="primary-button">Update List</button>
			</div>   
			<!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->

<div class="modal fade" id="linkDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3>Add Link</h3>
			</div>
			<!-- /.modal-header -->
	
			<div class="modal-body">
			
			<div class="form-group">
				<label class="radio"><input id="existing" type="radio" class="radio" name="content" checked> Existing Page</label>
			</div>  
		
			<div class="form-group">
				<div id="pageUrl" class="select small">
					<ul data-bind="foreach: pages">
						<li data-bind="attr:{'data-pageid': pageId, 'data-url': $parent.toPagePrefix() + url()}, text:name"></li>
					</ul>
					<p data-bind="visible: pagesLoading()" class="inline-status"><i class="fa fa-spinner fa fa-spin"></i> Loading pages...</p>
				</div>
			</div>
			
			<div class="form-group">
				<label class="radio"><input id="customUrl" type="radio" name="content" class="radio"> Custom URL</label>
			</div>
			
			<div class="form-group">
				<input id="linkUrl" type="text" class="form-control">
			</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button id="addLink" type="button" class="primary-button">Add Link</button>
			</div>   
			<!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->

<div class="modal fade" id="loadLayoutDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
  
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
				<p data-bind="visible: pagesLoading()" class="inline-status"><i class="fa fa-spinner fa fa-spin"></i> Loading pages...</p>
			</div>    
			
			</div>
			<!-- /.modal-body -->

			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button id="loadLayout" class="primary-button" type="button">Load Layout</button>
			</div>
			<!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->

<div class="modal fade" id="featuredDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3>Feature Content</h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">
			
				<div class="form-block">
					<div id="selectFeaturedPage" class="select select-lg">
						<ul data-bind="foreach: pages">
							<li data-bind="attr:{'data-pageuniqid': pageUniqId, 'data-name': name}, text:name"></li>
						</ul>
						<p data-bind="visible: pagesLoading()" class="inline-status"><i class="fa fa-spinner fa fa-spin"></i> Loading pages...</p>
					</div>    
				</div>
			
			</div>
			<!-- /.modal-body -->

			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button id="addFeatured" class="primary-button" type="button">Add Featured Content</button>
			</div>
			<!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->

<div class="modal fade" id="pluginsDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3>Select Plugin</h3>
			</div>
			<!-- /.modal-header -->
	
			<div class="modal-body">
			
			<div id="selectPlugin" class="select select-g">
			
				<ul data-bind="foreach: plugins">
					<li>
						<a data-bind="attr:{'data-name':name, 'data-type':type, 'data-render':render, 'data-config':config}, text:name"></a>
						<em data-bind="text:desc"></em>
					</li>
				</ul>
				
				<p data-bind="visible: pluginsLoading()" class="inline-status"><i class="fa fa-spinner fa fa-spin"></i> Loading plugins...</p>
				
			</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button id="addPlugin" class="primary-button">Add Plugin</button>
			</div>
			<!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->

<div class="modal fade" id="configPluginsDialog" data-id="-1" data-type="-1">

	<div class="modal-dialog">
	
		<div class="modal-content">

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
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->

<div class="modal fade" id="pageSettingsDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3>Page Settings</h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body" data-bind="with: page">

				<div class="form-group">
					<label for="name">Name:</label>
					<input id="name" type="text" maxlength="128" data-bind="value: name" class="form-control">
				</div>
				
				<div class="form-group">
					<label for="URL">URL:</label>
					<input id="friendlyId" type="text" maxlength="128" data-bind="value: friendlyId" class="form-control">
					<span class="help-block">No spaces, no special characters, dashes allowed.</span>
				</div>
				
				<div class="form-group">
					<label for="description">Description:</label>
					<textarea id="description" data-bind="value: description" class="form-control"></textarea>
					<span class="help-block">Added to the <code>head</code> of the page, used as the description in search engines and for lists</span>
				</div>
				
				<div class="form-group">
					<label for="keywords">Keywords:</label>
					<textarea id="keywords" placeholder="keyword1, keyword2, keyword3, etc." data-bind="value: keywords" class="form-control"></textarea>
				</div>   
				
				<div class="form-group">
					<label for="callout">Callout:</label>
					<input id="callout" type="text" maxlength="100" placeholder="Between $5-$8, On Sale Now"  data-bind="value: callout" class="form-control">
					<span class="help-block">Shows below the page name in lists to call attention to the item</span>
				</div>
				
				<div class="form-group">
					<label for="rss" class="control-label">RSS:</label>  
					<span class="checklist" data-bind="foreach: $parent.pageTypes">
						<label class="checkbox"><input type="checkbox" class="rss" data-bind="value: friendlyId, checked: ($parent.rss().indexOf(friendlyId())>-1), attr:{'data-rss': $parent.rss, 'data-friendlyId': friendlyId}"> <span data-bind="text:typeP"></span></label>
					</span>
					<span class="help-block">Adds a reference to the selected RSS feeds in the <code>head</code> of the page</span>
				</div>
				
				<div class="form-group">
					<label for="layout">Layout:</label>
					<select id="layout" data-bind="options: $parent.layouts, value: layout()" class="form-control"></select>
					<p data-bind="visible: $parent.layoutsLoading()" class="inline-status"><i class="fa fa-spinner fa fa-spin"></i> Loading...</p>
					<span class="help-block">HTML used to render the page</span>
				</div>
				
				<div class="control-group">
					<label for="stylesheet">Styles:</label>
					<select id="stylesheet" data-bind="options: $parent.stylesheets, value: stylesheet()" class="form-control"></select>
					<p data-bind="visible: $parent.stylesheetsLoading()" class="inline-status"><i class="fa fa-spinner fa fa-spin"></i> Loading...</p>
					<span class="help-block">CSS used to render the page</span>
				</div>
				
			</div>
			<!-- /.modal-body -->
				
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button class="primary-button" data-bind="click:saveSettings">Update</button>
			</div>
			<!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->

<div class="modal fade" id="htmlDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3>Add HTML</h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">
			
				<p class="twitter-instructions instructions alert alert-info">Create your widget at <a href="https://twitter.com/settings/widgets" target="_blank">//twitter.com/settings/widgets</a> and paste the HTML code below.</p>
			
				<div class="control-group">
					<label for="stylesheet">HTML:</label>
					<textarea id="Html" class="form-control"></textarea>
					<span class="help-block">Add your HTML, JS, or HTML here.</span>
				</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button id="addHtml" class="primary-button">Add HTML</buttons>
			</div>
			<!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->

<div class="modal fade" id="codeBlockDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3>Add Code Block</h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">
			
				<div class="control-group">
					<label for="stylesheet">Code:</label>
					<textarea id="Code" class="form-control"></textarea>
					<span class="help-block">Paste your code in the textarea above.</span>
				</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button id="addCode" class="primary-button">Add Code Block</buttons>
			</div>
			<!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->

<div class="modal fade" id="filesDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3>Add File</h3>
			</div>
			
			<div class="modal-body">
			
				<div id="selectFile" class="select select-lg">
				
				    <ul data-bind="foreach: files">
				      <li>
				        <i class="fa fa-file-alt" data-bind="visible: (extension == 'pdf' || extension == 'doc'|| extension == 'docx'|| extension == 'zip' || extension == 'ppt')"></i>
				        <i class="fa fa-picture" data-bind="visible: (extension == 'png' || extension == 'jpg'|| extension == 'gif')"></i>
				        <a data-bind="attr:{'data-filename':filename, 'data-fullurl':fullUrl, 'data-extension':extension}, text:filename"></a>
				      </li>
				    </ul>
				
				    <p data-bind="visible: filesLoading()" class="inline-status"><i class="fa fa-spinner fa fa-spin"></i> Loading files...</p>
				
				</div>
				
			</div>
				
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button class="primary-button" data-bind="click: addFile">Add File</a>
			</div>  
			<!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->
  
</div>
<!-- /.modal -->

<div class="modal fade" id="fontAwesomeDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3>Add Font Awesome Icon</h3>
			</div>
  
			<div class="modal-body">

				<div id="selectIcon" class="select select-lg">
				
				<ul data-bind="foreach: icons">
					<li>
						<i data-bind="css: icon"></i> <span data-bind="text: name"></span>
					</li>
				</ul>
				
				<p data-bind="visible: iconsLoading()" class="inline-status"><i class="fa fa-spinner fa fa-spin"></i> Loading icons...</p>
				
				</div>
				
			</div>
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button class="primary-button" data-bind="click: addIcon">Add Icon</a>
			</div>  
			<!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->
  
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
<script type="text/javascript" src="js/helper/moment.min.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/helper/flipsnap.min.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/helper/prettify.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/helper/dropzone.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="http://feather.aviary.com/js/feather.js"></script>

<!-- plugins -->
<script type="text/javascript" src="js/plugins/jquery.ui.touch-punch.min.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/plugins/jquery.paste.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/plugins/jquery.respondEdit.js?v=<?php print VERSION; ?>"></script>

<!-- app -->
<script type="text/javascript" src="js/global.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/messages.js?v=<?php print VERSION; ?>"></script>

<!-- dialogs -->
<script type="text/javascript" src="js/dialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/fontAwesomeDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/loadLayoutDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/pluginsDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/configPluginsDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/pageSettingsDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/codeBlockDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/htmlDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/imagesDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/filesDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/listDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/featuredDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/linkDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/fieldDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/skuDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/slideshowDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/elementConfigDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/blockConfigDialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialogs/aviaryDialog.js?v=<?php print VERSION; ?>"></script>

<!-- page -->
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>" defer="defer"></script>
<script type="text/javascript" src="js/viewModels/contentModel.js?v=<?php print VERSION; ?>" defer="defer"></script>

</html>