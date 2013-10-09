<?php	
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('SuperAdmin');
?>
<!DOCTYPE html>
<html>

<head>
	
<title>Sites&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- include styles -->
<link href="<?php print FONT; ?>" rel="stylesheet" type="text/css">
<link href="<?php print BOOTSTRAP_CSS; ?>" rel="stylesheet">
<link href="<?php print FONTAWESOME_CSS; ?>" rel="stylesheet">
<link type="text/css" href="css/app.css" rel="stylesheet">
<link type="text/css" href="css/messages.css" rel="stylesheet">
<link type="text/css" href="css/list.css" rel="stylesheet">

</head>

<body data-currpage="sites">
    
<p id="message">
  <span>Holds the message text.</span>
  <a class="close" href="#"></a>
</p>

<?php include 'modules/menu.php'; ?>

<section class="main">

    <nav>
        <a class="show-menu"><i class="icon-reorder icon-large"></i></a>
    
        <ul>
            <li class="static active"><a>Sites</a></li>
        </ul>
        
    </nav>

    <div class="container">
	    <table id="siteList" class="table table-striped table-bordered">
        	<col>
    		<col>
    		<col width="15%	">
    		<thead>
    			<tr>
    			<th>Site</th>
    			<th>URL</th>
    			<th class="switch">Switch</th>
    			</tr>
    		</thead>
    		<tbody data-bind="foreach:sites">
                <tr>
                    <td data-bind="text:name"></td>
                    <td data-bind="text:domain"></td>
                    <td><a data-bind="click: $parent.switchSite"><i class="icon-exchange icon-large"></i></a></td>
                </tr>
    		</tbody>
    	</table>
	</div>

</section>
<!-- /.main -->


</body>

<!-- include js -->
<script type="text/javascript" src="<?php print JQUERY_JS; ?>"></script>
<script type="text/javascript" src="<?php print JQUERYUI_JS; ?>"></script>
<script type="text/javascript" src="<?php print BOOTSTRAP_JS; ?>"></script>
<script type="text/javascript" src="<?php print KNOCKOUT_JS; ?>"></script>
<script type="text/javascript" src="js/helper/moment.min.js"></script>
<script type="text/javascript" src="js/global.js"></script>
<script type="text/javascript" src="js/messages.js"></script>
<script type="text/javascript" src="js/viewModels/models.js"></script>
<script type="text/javascript" src="js/viewModels/switchModel.js"></script>


</html>