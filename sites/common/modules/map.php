<div id="<?php print $id; ?>" class="respond-map <?php print $cssClass; ?>" data-zoom="<?php print $zoom; ?>">
	<div id="inline-map-<?php print $mapcount; ?>" class="map-container"></div>
	<p class="map-address"><span><?php print $address; ?></span> <a id="directions-<?php print $mapcount; ?>" href="http://maps.google.com/?q=<?php print $address; ?>"><?php print '<?php print _("Get Directions"); ?>'; ?></a></p>
</div>
<?php $mapcount++; ?>