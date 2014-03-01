<script type="text/javascript" src="<?php print MODERNIZR_JS; ?>"></script>
<script type="text/javascript" src="<?php print JQUERY_JS; ?>"></script>
<script type="text/javascript" src="<?php print JQUERYUI_JS; ?>"></script>
<script type="text/javascript" src="<?php print BOOTSTRAP_JS; ?>"></script>
<script type="text/javascript" src="<?php print KNOCKOUT_JS; ?>"></script>
<script type="text/javascript" src="<?php print MOMENT_JS; ?>?v=<?php print VERSION; ?>"></script>
<script type="text/javascript">moment.lang("<?php echo (isset($authUser) ? $authUser->Language : (empty($language) ? "en" : $language)); ?>");</script>
<script type="text/javascript" src="js/translations.php?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/helper/flipsnap.min.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/global.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/messages.js?v=<?php print VERSION; ?>"></script>