<div class="immersive" id="imagesDialog">

	<!-- messages -->
	<input id="msg-enter-caption" value="<?php print _("Enter caption"); ?>" type="hidden">
	<input id="msg-image-instructions" value="<?php print _("Add your content here or click the settings icon to change the image layout"); ?>" type="hidden">
	<input id="msg-enter-caption" value="<?php print _("Enter caption"); ?>" type="hidden">

	<div class="immersive-header">
		<h3><?php print _("Select or upload a new image"); ?></h3>
		<button type="button" class="close" data-dismiss="modal">x</button>
	</div>
	<!-- /.modal-header -->

	<div class="immersive-body">
	
		<h2 data-bind="visible: (newimages().length > 0)"><?php print _("New Images"); ?></h2>
		
		<div  data-bind="visible: (newimages().length > 0)" class="image-list">
		
		    <!-- ko foreach:newimages -->
		    <div class="image new">
		        <img data-bind="attr:{'src': thumbUrl}, click: $parent.setImage">
		        <small>
		            <span data-bind="text: filename"></span><br>
		            <span data-bind="text: width"></span>px x <span data-bind="text: height"></span>px
		        </small>
		    </div>
		    <!-- /ko -->
		
		</div>
		
		<h2><?php print _("Existing Images"); ?></h2>
		
		<div class="image-list">
		
		    <!-- ko foreach:images -->
		    <div class="image existing">
		        <img data-bind="attr:{'src': thumbUrl}, click: $parent.setImage">
		        <small>
		            <span data-bind="text: filename"></span><br>
		            <span data-bind="text: width"></span>px x <span data-bind="text: height"></span>px
		        </small>
		    </div>
		    <!-- /ko -->
		
		</div>
		
		<div id="drop" class="dropzone in-dialog">
		    <span class="dz-message">
		        <i class="fa fa-cloud-upload fa-4x"></i> <?php print _("Drag file here or click to upload"); ?></span>
		    </span>
		</div>
		<!-- /.dropzone -->
	
	</div>
	<!-- /.immersive-body -->

</div>
<!-- /.modal -->