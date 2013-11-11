<?php	
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('All');
	
	$path_prefix = '../';
?>
<!DOCTYPE html>
<html>

<head>
	
<title>Settings&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- include css -->
<link href="<?php print FONT; ?>" rel="stylesheet" type="text/css">
<link href="<?php print BOOTSTRAP_CSS; ?>" rel="stylesheet">
<link href="<?php print FONTAWESOME_CSS; ?>" rel="stylesheet">
<link type="text/css" href="css/app.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/messages.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body data-currpage="account" data-pubkey="<?php print STRIPE_PUB_KEY; ?>">
	
<p id="message">
  <span>Holds the message text.</span>
  <a class="close" href="#"></a>
</p>

<?php include 'modules/menu.php'; ?>

<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
    
        <ul>
            <li class="static active"><a>Account</a></li>
        </ul>
        
    </nav>
    <!-- /nav -->

	<div class="container">
	
		<div class="row">
		
			<div class="col-md-12">
			
				<table class="read-only-table table table-bordered">
					<col width="20%">
				
					<tr>
						<th>Type:</th>
						<td>
							<span class="loading" data-bind="visible: customerLoading()"><i class="fa fa-refresh fa-spin"></i> Loading account...</span>
							<span data-bind="text:type"></span>
						</td>
					</tr>
					<tr>
						<th>Status:</th>
						<td>
							<span data-bind="text:status"></span>
							<a class="btn btn-default" data-bind="visible: (status().toUpperCase()=='TRIAL' || status().toUpperCase()=='UNSUBSCRIBED'), click: showSubscribe">Subscribe</a>
						</td>
					</tr>
					<tr data-bind="visible: (type().toUpperCase() == 'SUBSCRIPTION')">
						<th>Plan:</th>
						<td>
							<span data-bind="text:planName()"></span>
							<small data-bind="text:amountReadable()"></small>
							<a class="btn btn-default" data-bind="visible: (status().toUpperCase()=='ACTIVE'), click: showChangePlans">Change Plan</a>
							<a class="btn btn-default" data-bind="visible: (status().toUpperCase()=='ACTIVE'), click: showUnsubscribe">Unsubscribe</a>
						</td>
					</tr>
					<tr data-bind="visible: (type().toUpperCase() == 'SUBSCRIPTION')">
						<th>Renewal Date:</th>
						<td>
							<span data-bind="text:renewalReadable"></span>
						</td>
					</tr>
					<tr data-bind="visible: hasCard">
						<th>Payment:</th>
						<td>
							<span data-bind="text:cardReadable"></span> 
							<small data-bind="text:cardExpires"></small>
							<a class="btn btn-default" data-bind="click:showUpdatePayment">Update Payment</a>
						</td>
					</tr>
					
				</table>
				<!-- /.table -->
	
			</div>
			<!-- /.col-md-12 -->
			
		</div>
		<!-- /.row -->
	
	</div>
	<!-- /.container -->
   
</section>
<!-- /.main -->

<div class="modal fade" id="unsubscribeDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3>Unsubscribe</h3>
			</div>
			
			<div class="modal-body">
			
				<p>
					Are you sure that you want to unsubscribe?
				</p>
				
			</div>
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button class="primary-button" data-bind="click: unsubscribe">Unsubscribe</button>
			</div>
			<!-- /.modal-footer -->
			
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

</div>
<!-- /.modal -->

<div class="modal fade" id="changePlanDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3>Change Plan</h3>
			</div>
			
			<div class="modal-body">
			
				<p class="modal-info">
					Select your new plan from the list below.
				</p>
				
				<div class="form-group separator">
					<div>
					<!-- ko foreach: plans -->
						<label class="radio">
							<input type="radio" name="plan" data-bind="value:id, checked:$parent.planId()">
							<span data-bind="text:name"></span><br>
							<small data-bind="text:readable"></small> 
						</label>
					<!-- /ko -->
					<span class="loading" data-bind="visible: plansLoading()"><i class="fa fa-refresh fa-spin"></i> Loading plans...</span>
					</div>
				</div>
				
			</div>
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button class="primary-button" data-bind="click: changePlan">Change Plan</button>
			</div>
			<!-- /.modal-footer -->
			
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

</div>
<!-- /.modal -->

<div class="modal fade" id="updatePaymentDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3>Update Payment</h3>
			</div>
			
			<div class="modal-body">
			
				<form data-bind="visible: (showNewCard() == false)">
				
					<p class="modal-info">
						Update the expiration date for your card.  If you want to add a new card, click the "New Card" button.
					</p>
		
				   <div class="form-group">
						<div>							
							<span class="read-only">
								<span data-bind="text:cardReadable"></span> 
								<small data-bind="text:cardExpires"></small>
							</span>
						</div>
					</div>
					
					<div class="form-group">
						<label for="expires">Expires:</label>
						<div>
						<input id="changeMM" type="number" placeholder="MM" class="inline form-control input-2" maxlength="2" data-bind="value: cardExpiredMonth"> / <input id="changeYY" type="number" maxlength="4" placeholder="YYYY" class="inline form-control input-4" data-bind="value: cardExpiredYear">
						</div>
					</div>
					
			    </form>
			    <!-- /.form-horizontal -->
			    
			    <form action="" method="POST" id="newcard-form" data-bind="visible: showNewCard">
			    
			    	<p class="modal-info">
						Enter the details for your new credit card.
					</p>
					
				    <div class="form-group">
						<label for="update-cc">Credit Card #:</label>
						<input id="update-cc" type="text" maxlength="20" data-stripe="number" class="form-control">
					</div>
					
					<div class="form-group">
						<label for="update-cvc">Card Code (CVC):</label>
						<input id="update-cvc" type="text" placeholder="CVC" class="form-control input-4" maxlength="4" data-stripe="cvc">
					</div>
					
					<div class="form-group separator">
						<label for="update-expiresMM">Expires:</label>
						<div>
						<input id="update-expiresMM" type="text" placeholder="MM" class="inline form-control input-2" maxlength="2" data-stripe="exp-month"> / <input id="update-expiresYY" type="text" maxlength="4" placeholder="YYYY" class="inline form-control input-4" data-stripe="exp-year">
						</div>
					</div>
				    
			    </form>
			    <!-- /.form-horizontal -->
				
			</div>
			
			<div class="modal-footer">
				<button class="tertiary-button" data-bind="click: newCard, visible: (showNewCard()==false)">New Card</button>
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button class="primary-button" data-bind="click: updatePayment">Update Payment</button>
			</div>
			<!-- /.modal-footer -->
			
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

</div>
<!-- /.modal -->

<div class="modal fade" id="subscribeDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3>Subscribe</h3>
			</div>
			
			<div class="modal-body">
			
				<form action="" method="POST" id="subscribe-form">
		
					<p class="modal-info">
						Select a plan and enter your credit card information to subscribe.
					</p>
		
					<div class="form-group separator">
						<div>
						<!-- ko foreach: plans -->
							<label class="radio">
								<input type="radio" name="plan" data-bind="value:id, checked:$parent.planId()">
								<span data-bind="text:name"></span><br>
								<small data-bind="text:readable"></small> 
							</label>
						<!-- /ko -->
						</div>
					</div>
			
				    <div class="form-group">
						<label for="address">Credit Card #:</label>
						<input id="cc" type="text" maxlength="20" data-stripe="number" class="form-control">
					</div>
					
					<div class="form-group">
						<label for="cvc">Card Code (CVC):</label>
						<input id="cvc" type="text" placeholder="CVC" class="form-control input-4" maxlength="4" data-stripe="cvc">
					</div>
					
					<div class="form-group">
						<label for="expires">Expires:</label>
						<div>
							<input id="expiresMM" type="text" placeholder="MM" class="inline form-control input-2" maxlength="2" data-stripe="exp-month"> / <input id="expiresYY" type="text" maxlength="4" placeholder="YYYY" class="inline form-control input-4" data-stripe="exp-year">
						</div>
					</div>
					
				    
			    </form>
			    <!-- /.form-horizontal -->
			
			</div>
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button class="primary-button" data-bind="click: subscribe">Subscribe</button>
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
<script type="text/javascript" src="<?php print STRIPE_JS; ?>"></script>
<script type="text/javascript" src="js/helper/moment.min.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/global.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/dialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/messages.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/accountModel.js?v=<?php print VERSION; ?>"></script>

</html>