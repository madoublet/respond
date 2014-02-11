<div id="<?php print $listid; ?>" class="respond-list" data-bind="foreach: <?php print $listid; ?>" 
	data-display="<?php print $el->display; ?>" 
	data-label="<?php print $el->label; ?>" 
	data-pagetypeid="<?php print $el->type; ?>" 
	data-length="<?php print $length; ?>" 
	data-orderby="<?php print $orderby; ?>" 
	data-category="<?php print $category; ?>">
		<div class="content" data-bind="html:content"></div>
        <div class="blog-meta">
			<p>
				<a data-bind="attr:{'href':url}"><?php print '<?php print _("Permanent Link"); ?>'; ?></a>
                <?php print '<?php print _("Last modified by"); ?>'; ?> <span data-bind="text:author"></span>
                <span data-bind="text:lastModifiedReadable" class="last-modified-date"></span>
			</p>
        </div>
</div>

<?php if($pageresults == 'true'){ ?>
	<div class="page-results">
		<button id="pager-<?php print $listid; ?>" class="btn btn-default" data-id="<?php print $listid; ?>"><?php print '<?php print _("Older posts"); ?>'; ?></button>
	</div>
<?php } ?>