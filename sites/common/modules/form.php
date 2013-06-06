<form class="form-horizontal form-respond">
  <input class="siteUniqId" type="hidden" value="<?php print $siteUniqId; ?>">
  <input class="pageUniqId" type="hidden" value="<?php print $pageUniqId; ?>">
  <?php print html_entity_decode($form); ?>

  <div class="control-group">
  	<label>&nbsp;</label>
  	<div class="controls">
   		<button type="button" class="btn btn-primary">Submit</button>
   	</div>
  </div>
</form>

