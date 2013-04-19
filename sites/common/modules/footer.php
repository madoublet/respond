<!-- begin footer -->
<footer>
  <div>
  
  <p>
    &copy; <?php print $site->Name; ?>
  </p>
  
  <p class="poweredBy">
    Powered by <a href="http://respondcms.com">Respond CMS</a>
  </p>
  </div>
</footer>

<?php 
  if(isset($analyticsId)){
    if($analyticsId!=''){
      $webpropertyid = $analyticsId;
      include 'modules/analytics.php';
    } 
  }
?>
<!-- end footer -->