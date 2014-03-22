<div class="respond-calendar" data-list="<?php print $listid; ?>"></div>

<ul id="<?php print $listid; ?>" class="respond-list list-group" data-bind="foreach: <?php print $listid; ?>" 
	data-display="<?php print $el->display; ?>" 
	data-label="<?php print $el->label; ?>" 
	data-pagetypeid="<?php print $pageTypeUniqId; ?>" 
	data-length="<?php print $length; ?>" 
	data-desclength="<?php print $desclength; ?>"
	data-orderby="<?php print $orderby; ?>" 
	data-category="<?php print $category; ?>">
        <li class="list-group-item">
        	<a class="pull-left thumbnail" data-bind="attr:{'href':url}, visible: hasImage">
	        	<img data-bind="attr: {'src': thumb}">
            </a>
            <h4><a data-bind="attr:{'href':url}, text:name"></a></h4>
            <h5><i class="fa fa-calendar"></i><span data-bind="text:beginDateReadable"></span> &ndash; <span data-bind="text:endDateReadable"></span></h5>
			<small data-bind="visible: hasCallout, text: callout"></small>
			<p data-bind="text:desc"></p>
		</li>
</ul>

<p data-bind="visible: <?php print $listid; ?>Loading()" class="list-loading"><i class="fa fa-spinner fa-spin"></i> <?php print _("Loading..."); ?></p>

<?php if($pageresults == 'true'){ ?>
	<div class="page-results">
		<button id="pager-<?php print $listid; ?>" class="btn btn-default" data-id="<?php print $listid; ?>"><?php print '<?php print _("Next"); ?>'; ?></button>
	</div>
<?php } ?>