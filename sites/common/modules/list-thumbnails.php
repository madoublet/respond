<div id="<?php print $listid; ?>" class="respond-list list-group" data-bind="foreach: <?php print $listid; ?>" 
	data-display="<?php print $el->display; ?>" 
	data-label="<?php print $el->label; ?>" 
	data-pagetypeid="<?php print $pageTypeUniqId; ?>" 
	data-length="<?php print $length; ?>" 
	data-desclength="<?php print $desclength; ?>"
	data-orderby="<?php print $orderby; ?>" 
	data-category="<?php print $category; ?>">
        <span class="thumbnail">
			<img data-bind="attr: {'src': thumb},visible: hasImage">
			<div class="caption">
				<h3><a data-bind="attr:{'href':url}, text:name"></a></h3>
				<small data-bind="visible: hasCallout, text: callout"></small>
				<p data-bind="text:desc"></p>
			</div>
		</span>
</div>

<p data-bind="visible: <?php print $listid; ?>Loading()" class="list-loading"><i class="fa fa-spinner fa-spin"></i> <?php print _("Loading..."); ?></p>

<?php if($pageresults == 'true'){ ?>
	<div class="page-results">
		<button id="pager-<?php print $listid; ?>" class="btn btn-default" data-id="<?php print $listid; ?>"><?php print '<?php print _("Next"); ?>'; ?></button>
	</div>
<?php } ?>