<!--[if lt IE 9]>
<script src="<?php print $rootloc; ?>js/html5.js"></script>
<![endif]-->

<?php if($site['FacebookAppId']!=''){ ?>
<meta property="fb:app_id" content="<?php print $site['FacebookAppId']; ?>" />  
<?php } ?>

<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
<script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.js"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/jquery.cookie.js"></script>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=<?php print GOOGLE_MAPS_API_KEY; ?>g&sensor=false"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/jquery.respondMap-1.0.1.js"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/jquery.respondForm-1.0.1.js"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/messages.js"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/pageModel.js"></script>
<script type="text/javascript" src="<?php print $rootloc; ?>js/prettify.js"></script>

