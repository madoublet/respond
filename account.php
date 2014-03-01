<?php	
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('Admin');
	
	Utilities::SetLanguage($authUser->Language); // set language
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $authUser->Language) ?>">

<head>
	
<title><?php print _("Account"); ?>&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include css -->
<?php include 'modules/css.php'; ?>
<link type="text/css" href="css/messages.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body data-currpage="account" data-pubkey="<?php print STRIPE_PUB_KEY; ?>">

<?php include 'modules/menu.php'; ?>

<!-- messages -->
<input id="msg-unsubscribing" value="<?php print _("Unsubscribing..."); ?>" type="hidden">
<input id="msg-unsubscribe-success" value="<?php print _("You have successfully unsubscribed"); ?>" type="hidden">
<input id="msg-select-a-plan" value="<?php print _("Select a Plan"); ?>" type="hidden">
<input id="msg-updating-plan" value="<?php print _("Updating..."); ?>" type="hidden">
<input id="msg-update-successful" value="<?php print _("Update Successful"); ?>" type="hidden">
<input id="msg-change-plan-error" value="<?php print _("There was a problem changing the plan"); ?>" type="hidden">
<input id="msg-validating-card" value="<?php print _("Validating..."); ?>" type="hidden">
<input id="msg-updating-card" value="<?php print _("Updating..."); ?>" type="hidden">
<input id="msg-updating-card-successful" value="<?php print _("Credit Card Update Successful"); ?>" type="hidden">
<input id="msg-add-card" value="<?php print _("Adding..."); ?>" type="hidden">
<input id="msg-card-added" value="<?php print _("New card added"); ?>" type="hidden">
<input id="msg-card-declined" value="<?php print _("Credit Card declined"); ?>" type="hidden">
<input id="msg-updating-card-error" value="<?php print _("There was a problem updating the card"); ?>" type="hidden">
<input id="msg-validating-payment" value="<?php print _("Validating..."); ?>" type="hidden">
<input id="msg-paying" value="<?php print _("Paying..."); ?>" type="hidden">
<input id="msg-payment-successful" value="<?php print _("Payment successful"); ?>" type="hidden">
<input id="msg-subscription-problem" value="<?php print _("There was a problem paying for the subscription"); ?>" type="hidden">

<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
    
        <ul>
            <li class="static active"><a><?php print _("Account"); ?></a></li>
        </ul>
        
    </nav>
    <!-- /nav -->

	<div class="container">
	
		<div class="row">
		
			<div class="col-md-12">
			
				<table class="read-only-table table table-bordered">
					<col width="20%">
				
					<tr>
						<th><?php print _("Type:"); ?></th>
						<td>
							<span class="loading" data-bind="visible: customerLoading()"><i class="fa fa-refresh fa-spin"></i> Loading account...</span>
							<span data-bind="text:type"></span>
						</td>
					</tr>
					<tr>
						<th><?php print _("Status"); ?></th>
						<td>
							<span data-bind="text:status"></span>
							<a class="btn btn-default" data-bind="visible: (status().toUpperCase()=='TRIAL' || status().toUpperCase()=='UNSUBSCRIBED'), click: showSubscribe"><?php print _("Subscribe"); ?></a>
						</td>
					</tr>
					<tr data-bind="visible: (type().toUpperCase() == 'SUBSCRIPTION')">
						<th><?php print _("Plan:"); ?></th>
						<td>
							<span data-bind="text:planName()"></span>
							<small data-bind="text:amountReadable()"></small>
							<a class="btn btn-default" data-bind="visible: (status().toUpperCase()=='ACTIVE'), click: showChangePlans"><?php print _("Change Plan"); ?></a>
							<a class="btn btn-default" data-bind="visible: (status().toUpperCase()=='ACTIVE'), click: showUnsubscribe"><?php print _("Unsubscribe"); ?></a>
						</td>
					</tr>
					<tr data-bind="visible: (type().toUpperCase() == 'SUBSCRIPTION')">
						<th><?php print _("Renewal Date:"); ?></th>
						<td>
							<span data-bind="text:renewalReadable"></span>
						</td>
					</tr>
					<tr data-bind="visible: hasCard">
						<th><?php print _("Payment:"); ?></th>
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
				<h3><?php print _("Unsubscribe"); ?></h3>
			</div>
			
			<div class="modal-body">
			
				<p>
					<?php print _("Are you sure that you want to unsubscribe?"); ?>
				</p>
				
			</div>
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: unsubscribe"><?php print _("Unsubscribe"); ?></button>
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
				<h3><?php print _("Change Plan"); ?></h3>
			</div>
			
			<div class="modal-body">
			
				<p class="modal-info">
					<?php print _("Select your new plan from the list below."); ?>
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
					<span class="loading" data-bind="visible: plansLoading()"><i class="fa fa-refresh fa-spin"></i> <?php print _("Loading plans..."); ?></span>
					</div>
				</div>
				
			</div>
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: changePlan"><?php print _("Change Plan"); ?></button>
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
				<h3><?php print _("Update Payment"); ?></h3>
			</div>
			
			<div class="modal-body">
			
				<form data-bind="visible: (showNewCard() == false)">
				
					<p class="modal-info">
						<?php print _("Update the expiration date for your card. If you want to add a new card, click the New Card button."); ?>
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
						<label for="expires"><?php print _("Expires:"); ?></label>
						<div>
						<input id="changeMM" type="number" placeholder="MM" class="inline form-control input-2" maxlength="2" data-bind="value: cardExpiredMonth"> / <input id="changeYY" type="number" maxlength="4" placeholder="YYYY" class="inline form-control input-4" data-bind="value: cardExpiredYear">
						</div>
					</div>
					
			    </form>
			    <!-- /.form-horizontal -->
			    
			    <form action="" method="POST" id="newcard-form" data-bind="visible: showNewCard">
			    
			    	<p class="modal-info">
						<?php print _("Enter the details for your new credit card."); ?>
					</p>
					
				    <div class="form-group">
						<label for="update-cc"><?php print _("Credit Card #:"); ?></label>
						<input id="update-cc" type="text" maxlength="20" data-stripe="number" class="form-control">
					</div>
					
					<div class="form-group">
						<label for="update-cvc"><?php print _("Card Code (CVC):"); ?></label>
						<input id="update-cvc" type="text" placeholder="CVC" class="form-control input-4" maxlength="4" data-stripe="cvc">
					</div>
					
					<div class="form-group separator">
						<label for="update-expiresMM"><?php print _("Expires:"); ?></label>
						<div>
						<input id="update-expiresMM" type="text" placeholder="MM" class="inline form-control input-2" maxlength="2" data-stripe="exp-month"> / <input id="update-expiresYY" type="text" maxlength="4" placeholder="YYYY" class="inline form-control input-4" data-stripe="exp-year">
						</div>
					</div>
				    
			    </form>
			    <!-- /.form-horizontal -->
				
			</div>
			
			<div class="modal-footer">
				<button class="tertiary-button" data-bind="click: newCard, visible: (showNewCard()==false)"><?php print _("New Card"); ?></button>
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: updatePayment"><?php print _("Update Payment"); ?></button>
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
				<h3><?php print _("Subscribe"); ?></h3>
			</div>
			
			<div class="modal-body">
			
				<form action="" method="POST" id="subscribe-form">
		
					<p class="modal-info">
						<?php print _("Select a plan and enter your credit card information to subscribe."); ?>
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
						<label for="address"><?php print _("Credit Card #:"); ?></label>
						<input id="cc" type="text" maxlength="20" data-stripe="number" class="form-control">
					</div>
					
					<div class="form-group">
						<label for="cvc"><?php print _("Card Code (CVC):"); ?></label>
						<input id="cvc" type="text" placeholder="CVC" class="form-control input-4" maxlength="4" data-stripe="cvc">
					</div>
					
					<div class="form-group">
						<label for="expires"><?php print _("Expires:"); ?></label>
						<div>
							<input id="expiresMM" type="text" placeholder="MM" class="inline form-control input-2" maxlength="2" data-stripe="exp-month"> / <input id="expiresYY" type="text" maxlength="4" placeholder="YYYY" class="inline form-control input-4" data-stripe="exp-year">
						</div>
					</div>
					
				    
			    </form>
			    <!-- /.form-horizontal -->
			
			</div>
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: subscribe"><?php print _("Subscribe"); ?></button>
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
<?php include 'modules/js.php'; ?>
<script type="text/javascript" src="<?php print STRIPE_JS; ?>"></script>
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/accountModel.js?v=<?php print VERSION; ?>"></script>

</html>