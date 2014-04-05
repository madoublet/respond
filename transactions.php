<?php	
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('All');
	
	Utilities::SetLanguage($authUser->Language); // set language
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $authUser->Language) ?>">

<head>
	
<title><?php print _("Transactions"); ?>&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include styles -->
<?php include 'modules/css.php'; ?>

</head>

<body data-currpage="sites">

<?php include 'modules/menu.php'; ?>

<!-- messages -->
<input id="msg-removing" value="<?php print _("Removing..."); ?>" type="hidden">
<input id="msg-removed" value="<?php print _("Transaction removed successfully"); ?>" type="hidden">
<input id="msg-remove-error" value="<?php print _("There was a problem removing the transaction"); ?>" type="hidden">
<input id="msg-shipping" value="<?php print _("Shipping"); ?>" type="hidden">
<input id="msg-fee" value="<?php print _("Fee"); ?>" type="hidden">
<input id="msg-tax" value="<?php print _("Tax"); ?>" type="hidden">
<input id="msg-total" value="<?php print _("Total"); ?>" type="hidden">

<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
    
        <ul>
            <li class="static active"><a><?php print _("Transactions"); ?></a></li>
        </ul>
       
    </nav>

    <div class="container">
    
	    <table id="transactionsList" class="table table-striped table-bordered">
    		<thead>
    			<tr>
	    			<th><?php print _("Id"); ?></th>
	    			<th><?php print _("Processor"); ?></th>
	    			<th><?php print _("Customer"); ?></th>
	    			<th><?php print _("Invoice"); ?></th>
    			</tr>
    		</thead>
    		<tbody data-bind="foreach:transactions">
                <tr>
                    <td data-bind="text:transactionUniqId"></td>
                    <td>
                    	<span data-bind="text:processor"></span><br>
                    	<small data-bind="text:processorTransactionId"></small><br>
                    	<small data-bind="text:processorStatus"></small>
                    </td>
                    <td>
                    	<span data-bind="text:name"></span><br>
                    	<small data-bind="text:email"></small><br>
                    	<small data-bind="text:payerId"></small>
                    </td>
                    <td data-bind="html:invoice"></td>
                </tr>
    		</tbody>
    	</table>
    	
    	<p data-bind="visible: transactionsLoading()" class="table-loading"><i class="fa fa-spinner fa-spin"></i> <?php print _("Loading..."); ?></p>
	</div>

</section>
<!-- /.main -->

</body>

<!-- include js -->
<?php include 'modules/js.php'; ?>
<script type="text/javascript" src="<?php print TIMEZONEDETECT_JS; ?>"></script>
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/transactionsModel.js?v=<?php print VERSION; ?>"></script>


</html>