<?php	
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('SuperAdmin');
	
	$currpage = 'sites';
	
	$p = new Sites($authUser); // setup controller
?>
<!DOCTYPE html>
<html>

<head>
	
<title>Sites&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- include styles -->
<link type="text/css" href="libs/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link type="text/css" href="libs/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet">
<link type="text/css" href="css/app.css" rel="stylesheet">
<link type="text/css" href="css/page.css" rel="stylesheet">
<link type="text/css" href="css/messages.css" rel="stylesheet">
<link type="text/css" href="css/menu.css" rel="stylesheet">
<link type="text/css" href="css/list.css" rel="stylesheet">

<!-- include scripts -->
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>
<script type="text/javascript" src="libs/bootstrap/js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/global.js"></script>
<script type="text/javascript" src="js/ajaxupload.3.1.js"></script>
<script type="text/javascript" src="js/messages.js"></script>
<script type="text/javascript" src="js/sites.js"></script>

</head>

<body>
	
<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
		
<input type="hidden" name="_submit_check" value="1"/>

<?php include 'modules/menu.php'; ?>

<p id="message">
  <span>Holds the message text.</span>
  <a class="close" href="#"></a>
</p>
		
<div class="content container-fluid">
  <div class="row-fluid header-row">
    <div class="span12">

	<h1>
		Sites
	</h1>
	
	</div>
  </div>

  <div class="row-fluid content-row">
    <div class="span12">

	<table id="siteList" class="table table-striped table-bordered">
		<col>
		<col>
		<col width="15%	">
		<thead>
			<tr>
			<th>Site</th>
			<th>URL</th>
			<th class="date">Created</th>
			<th class="switch">Switch</th>
			</tr>
		</thead>
		<tbody>
		<?php while($row = mysql_fetch_array($p->List)){ ?>
			<tr id="site-<?php print $row['SiteUniqId']; ?>" <?php if($authUser->SiteId==$row['SiteId']){print 'class="active"';}?>>
			<td><?php print $row['Name']; ?></td>
			<td><code><?php print $row['Domain']; ?></code></td>
			<td class="date"><?php print $p->GetFriendlyDate(strtotime($row['Created'])); ?></td>
			<td class="switch"><a id="switch-<?php print $row['SiteUniqId']; ?>" class="switch" href="#">Switch</a></td>
			</tr>
		<?php } ?>
		</tbody>
	</table>
	
	</div>
	<!-- /.span12 -->	
	
  </div>
  <!-- /.row-fluid -->

</div>
<!-- /.content -->

</form>

<?php include 'modules/footer.php'; ?>

</body>

</html>