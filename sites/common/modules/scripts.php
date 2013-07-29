<!--[if lt IE 9]>
<script src="<?php print $rootloc; ?>js/html5.js"></script>
<![endif]-->

<?php if($site['FacebookAppId']!=''){ ?>
<meta property="fb:app_id" content="<?php print $site['FacebookAppId']; ?>" />  
<?php } ?>

<script type="text/javascript" src="<?php print JQUERY_JS; ?>"></script>
<script type="text/javascript" src="<?php print BOOTSTRAP_JS; ?>"></script>
<script type="text/javascript" src="<?php print KNOCKOUT_JS; ?>"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/jquery.cookie.js"></script>
<?php if(GOOGLE_MAPS_API_KEY != 'YOUR GOOGLE MAPS API KEY'){ ?>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=<?php print GOOGLE_MAPS_API_KEY; ?>&sensor=false"></script>
<?php } ?>
<script type="text/javascript" src="<?php print $rootloc; ?>js/jquery.respondMap-1.0.1.js"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/jquery.respondForm-1.0.1.js"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/messages.js"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/pageModel.js"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/prettify.js"></script>
