<?php	
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('SuperAdmin');
?>
<!DOCTYPE html>
<html>

<head>
	
<title>Plans&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- include styles -->
<link href="<?php print FONT; ?>" rel="stylesheet" type="text/css">
<link href="<?php print BOOTSTRAP_CSS; ?>" rel="stylesheet">
<link href="<?php print FONTAWESOME_CSS; ?>" rel="stylesheet">
<link type="text/css" href="css/app.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/messages.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/list.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body data-currpage="sites">
    
<p id="message">
  <span>Holds the message text.</span>
  <a class="close" href="#"></a>
</p>

<?php include 'modules/menu.php'; ?>

<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
    
        <ul>
            <li><a href="switch">Sites</a></li>
            <li class="static active"><a href="plans">Plans</a></li>
        </ul>
        
        <a class="primary-action" data-bind="click: showAddDialog"><i class="fa fa-plus-circle fa-lg"></i> Add Plan</a>
        
    </nav>

    <div class="container">
	    <table  class="table table-striped table-bordered">
        	<col>
    		<col>
    		<col width="15%">
    		<thead>
    			<tr>
	    			<th>Id</th>
	    			<th>Name</th>
	    			<th class="number">Amount</th>
	    			<th>Interval</th>
	    			<th>Currency</th>
	    			<th class="number">Trial</th>
    			</tr>
    		</thead>
    		<tbody data-bind="foreach:plans">
                <tr>
                    <td><a data-bind="text:id, click:$parent.showEditDialog"></a></td>
                    <td>
	                    <span data-bind="text:name"></span><br>
	                    <small data-bind="text:readable"></small>
                    </td>
                    <td data-bind="text:amount" class="number"></td>
                    <td data-bind="text:interval"></td>
                    <td data-bind="text:currency.toUpperCase()"></td>
                    <td data-bind="text:trial" class="number"></td>
                </tr>
    		</tbody>
    	</table>
	</div>

</section>
<!-- /.main -->

<div class="modal fade" id="addEditDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3 data-bind="text:planAction"></h3>
			</div>
			<div class="modal-body">
			
				<div class="form-group">
					<label for="plan-id" class="control-label">Id:</label>
					<input id="plan-id" type="text" maxlength="128" value=""class="form-control">
				</div>
				
				<div class="form-group">
					<label for="plan-name" class="control-label">Name:</label>
					<input id="plan-name" type="text" value="" maxlength="255" class="form-control">
				</div>
				
				
				<div id="amount-group" class="form-group">
					<label for="plan-amount" class="control-label">Amount (in cents):</label>
					<input id="plan-amount" type="number" maxlength="10" value=""class="form-control">
					<span class="help-block">e.g. 2500 = $25.00</span>
				</div>
				
				<div id="interval-group"  class="form-group">
					<label for="plan-interval" class="control-label">Interval:</label>
					<select id="plan-interval" class="form-control">
						<option value="week">Week</option>
						<option value="month">Month</option>
						<option value="year">Year</option>
					</select>
				</div>
				
				<div id="currency-group"  class="form-group">
					<label for="plan-currency" class="control-label">Currency:</label>
					<select id="plan-currency" class="form-control">
						<option value="usd">USD</option>
					</select>
				</div>
				
				<div id="trial-group" class="form-group">
					<label for="plan-trial" class="control-label">Trial Days:</label>
					<input id="plan-trial" type="number" maxlength="10" value=""class="form-control">
				</div>
				
			</div>
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button class="primary-button" data-bind="click: addEditPlan, text: planAction"></button>
			</div>
			<!-- /.modal-footer -->
			
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

</div>
<!-- /.modal -->



</body>

<!-- include js -->
<script type="text/javascript" src="<?php print JQUERY_JS; ?>"></script>
<script type="text/javascript" src="<?php print JQUERYUI_JS; ?>"></script>
<script type="text/javascript" src="<?php print BOOTSTRAP_JS; ?>"></script>
<script type="text/javascript" src="<?php print KNOCKOUT_JS; ?>"></script>
<script type="text/javascript" src="js/helper/moment.min.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/global.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/messages.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/plansModel.js?v=<?php print VERSION; ?>"></script>


</html>