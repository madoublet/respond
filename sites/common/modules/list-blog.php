<div id="<?php print $listid; ?>" class="respond-list" data-bind="foreach: <?php print $listid; ?>" 
	data-display="<?php print $el->display; ?>" 
	data-label="<?php print $el->label; ?>" 
	data-pagetypeid="<?php print $pageTypeUniqId; ?>" 
	data-length="<?php print $length; ?>" 
	data-orderby="<?php print $orderby; ?>" 
	data-category="<?php print $category; ?>">
		<div class="content" data-bind="html:content"></div>
        <div class="blog-meta">
			<p>
				<span data-bind="visible:hasPhoto"><span class="photo" data-bind="attr:{'style': 'background-image: url('+photo+')'}"></span></span>
                <?php print '<?php print _("Last modified by"); ?>'; ?> <span class="author" data-bind="text:author"></span>
                <span data-bind="text:lastModifiedReadable" class="last-modified-date"></span>
                <a data-bind="attr:{'href':url}"><?php print '<?php print _("Permanent Link"); ?>'; ?></a>
			</p>
        </div>
</div>

<p data-bind="visible: <?php print $listid; ?>Loading()" class="list-loading"><i class="fa fa-spinner fa-spin"></i> <?php print _("Loading..."); ?></p>

<?php if($pageresults == 'true'){ ?>
	<div class="page-results">
		<button id="pager-<?php print $listid; ?>" class="btn btn-default" data-id="<?php print $listid; ?>"><?php print '<?php print _("Older posts"); ?>'; ?></button>
	</div>
<?php } ?>