<?php

  // get a readable date for the site's timezone
  $date = DateTime::createFromFormat("Y-m-d\TH:i:sO", $page['lastModifiedDate']);

  $local = new DateTimeZone($site['timeZone']);
  $date->setTimezone($local);
  $readable = $date->format('D, M d y h:i a');
?>

<p class="respond-byline">Published by <?php print $page['firstName']; ?> <?php print $page['lastName']; ?> on <?php print $readable; ?></p>