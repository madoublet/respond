<div class="modal fade" id="elementConfigDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Settings"); ?></h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">
			
				<div class="form-group">
					<label for="elementId" class="control-label"><?php print _("Element Id:"); ?></label>
					<input id="elementId" type="text" maxlength="128" value="" class="form-control">
				</div>
				
				<div id="cssClass" class="form-group">
					<label for="elementCssClass" class="control-label"><?php print _("CSS Class:"); ?></label>
					<input id="elementCssClass" type="text" maxlength="128" value="" class="form-control">
				</div>
				
				<!-- image options -->
				<div class="form-group map-config">
					<label for="elementZoom"><?php print _("Zoom:"); ?></label>
					<select id="elementZoom" class="form-control">
						<option value="auto"><?php print _("Auto"); ?></option>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
						<option value="6">6</option>
						<option value="7">7</option>
						<option value="8">8</option>
						<option value="9">9</option>
						<option value="10">10</option>
						<option value="11">11</option>
						<option value="12">12</option>
						<option value="13">13</option>
						<option value="14">14</option>
						<option value="15">15</option>
						<option value="16">16</option>
						<option value="17">17</option>
						<option value="18">18</option>
						<option value="19">19</option>
						<option value="20">20</option>
					</select>
				</div>
				
				<!-- image options -->
				<div class="form-group image-config">
					<label for="elementCssClass"><?php print _("Image Orientation:"); ?></label>
					<select id="imagePosition" class="form-control">
						<option value="left"><?php print _("Left of the text"); ?></option>
						<option value="right"><?php print _("Right of the text"); ?></option>
						<option value="none"><?php print _("No text"); ?></option>
					</select>
				</div>
				
				<div class="form-group image-config">
				  <label for="elementCssClass" class="control-label"><?php print _("Image Link:"); ?></label>
				  <input id="imageLink" type="text" maxlength="512" value="" placeholder="http://" class="form-control">
				</div>
				
				<!-- table options -->
				<div class="form-group table-config">
				  <label for="tableRows" class="control-label"><?php print _("Table Rows:"); ?></label>
				  <input id="tableRows" type="number" class="form-control">
				</div>
				
				<div class="form-group table-config">
				  <label for="tableColumns" class="control-label"><?php print _("Table Columns:"); ?></label>
				  <input id="tableColumns" type="number" class="form-control">
				</div>
				
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button id="updateElementConfig" class="primary-button" data-dismiss="modal"><?php print _("Update"); ?></button>
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