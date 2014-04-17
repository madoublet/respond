<script type="text/javascript" src="<?php print JQUERY_JS; ?>"></script>
<script type="text/javascript" src="<?php print BOOTSTRAP_JS; ?>"></script>
<script type="text/javascript" src="<?php print KNOCKOUT_JS; ?>"></script>
<script type="text/javascript" src="<?php print MOMENT_JS; ?>"></script>
<script type="text/javascript" src="<?php print FANCYBOX_JS; ?>"></script>
<?php if(GOOGLE_MAPS_API_KEY != 'YOUR GOOGLE MAPS API KEY' && trim(GOOGLE_MAPS_API_KEY) != ''){ ?>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=<?php print GOOGLE_MAPS_API_KEY; ?>&sensor=false"></script>
<?php } ?>
<script type="text/javascript" src="<?php print $rootloc; ?>js/respond.Map.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/respond.Form.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/respond.Calendar.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/respond.List.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/respond.Featured.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/respond.Login.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/respond.Registration.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/respond.Search.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/pageModel.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/prettify.js"></script>