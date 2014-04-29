<div class="modal fade" id="skuDialog" data-currency="<?php echo $authUser->Currency; ?>">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Add SKU"); ?></h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">

				<div class="form-group">
					<label for="sku" class="control-label"><?php print _("SKU:"); ?></label>
					<input id="sku" type="text" maxlength="128" value="" class="form-control">
				</div>
				
				<div class="form-group">
					<label for="sku-desc" class="control-label"><?php print _("Description:"); ?></label>
					<input id="sku-desc" type="text" maxlength="128" value="" class="form-control">
				</div>
				
				<div class="form-group">
					<label for="sku-price" class="control-label"><?php print _("Price:"); ?></label>
				    <div class="input-group">
					 	<input id="sku-price" type="number" maxlength="128" value="" class="form-control">
					 	<span class="input-group-addon"><?php print $authUser->Currency; ?></span>
					</div>
				</div>
				
				<div class="form-group">
					<label for="sku-shippingType" class="control-label"><?php print _("Shipping Type:"); ?></label>
				    <select id="sku-shippingType" class="form-control">
				    	<option value="not shipped"><?php print _("Not Shipped"); ?></option>
				    	<option value="shipped"><?php print _("Shipped"); ?></option>
				    	<option value="download"><?php print _("Download"); ?></option>
				    </select>
				</div>
				
				<div class="form-group shipped">
					<label for="sku-weight" class="control-label"><?php print _("Weight:"); ?> (<?php print _("optional"); ?>)</label>
				    <div class="input-group">
					 	<input id="sku-weight" type="number" maxlength="128" value="" class="form-control">
					 	<span class="input-group-addon"><?php print $authUser->WeightUnit; ?></span>
					</div>
				</div>
				
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button type="button" class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button id="add-sku" type="button" class="primary-button"><?php print _("Add SKU"); ?></button>
				<button id="update-sku" type="button" class="primary-button"><?php print _("Update SKU"); ?></button>
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