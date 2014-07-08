<?php	
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('SuperAdmin');
	
	Utilities::SetLanguage($authUser->Language); // set language
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $authUser->Language) ?>">

<head>
	
<title>Sites&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include styles -->
<?php include 'modules/css.php'; ?>

</head>

<body data-currpage="sites">

<?php include 'modules/menu.php'; ?>

<!-- messages -->
<input id="msg-required" value="<?php print _("All fields required"); ?>" type="hidden">
<input id="msg-adding" value="<?php print _("Adding..."); ?>" type="hidden">
<input id="msg-added" value="<?php print _("Site added successfully"); ?>" type="hidden">
<input id="msg-switching" value="<?php print _("Switching..."); ?>" type="hidden">
<input id="msg-switched" value="<?php print _("Switch successful"); ?>" type="hidden">
<input id="msg-removing" value="<?php print _("Removing..."); ?>" type="hidden">
<input id="msg-removed" value="<?php print _("Site removed successfully"); ?>" type="hidden">
<input id="msg-remove-error" value="<?php print _("There was a problem removing the site"); ?>" type="hidden">

<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
    
        <ul>
            <li class="static active"><a><?php print _("Sites"); ?></a></li>
            <li><a href="plans"><?php print _("Plans"); ?></a></li>
        </ul>
        
        <a class="primary-action" data-bind="click: showAddDialog" title="<?php print _("Add Site"); ?>"><i class="fa fa-plus-circle"></i></a>
        
    </nav>

    <div class="container">
	    <table id="siteList" class="table table-striped table-bordered">
    		<thead>
    			<tr>
    			<th><?php print _("Site"); ?></th>
    			<th><?php print _("Type"); ?></th>
    			<th><?php print _("Status"); ?></th>
    			<th><?php print _("Plan"); ?></th>
    			<th><?php print _("Customer"); ?></th>
    			<th><?php print _("Renewal Date"); ?></th>
    			<th class="switch action"><?php print _("Switch"); ?></th>
    			<th class="remove action"><?php print _("Remove"); ?></th>
    			</tr>
    		</thead>
    		<tbody data-bind="foreach:sites">
                <tr data-bind="css:{'active': (siteId=='<?php print $authUser->SiteId; ?>')}">
                    <td><span data-bind="text:name"></span><br><small data-bind="text:domain"></small></td>
                    <td data-bind="text:type"></td>
                    <td data-bind="text:status"></td>
                    <td data-bind="text:planId"></td>
                    <td data-bind="text:customerId"></td>
                    <td data-bind="text:renewalReadable"></td>
                    <td class="action"><a class="switch" data-bind="click: $parent.switchSite"><i class="fa fa-exchange"></i></a></td>
                    <td class="action"><a class="remove" data-bind="click: $parent.showRemoveDialog"><i class="fa fa-minus-circle"></i></a></td>
                </tr>
    		</tbody>
    	</table>
    	
    	<p data-bind="visible: sitesLoading()" class="table-loading"><i class="fa fa-spinner fa-spin"></i> <?php print _("Loading..."); ?></p>
	</div>

</section>
<!-- /.main -->

<div class="modal fade" id="addDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3 class="add"><?php print _("Add Site"); ?></h3>
			</div>
			<div class="modal-body">
			
				<div class="form-group">
					<label for="name" class="control-label"><?php print _("Site Name:"); ?></label>
					<input id="name" type="text" maxlength="128" value=""class="form-control">
					<p class="site-name"><?php print APP_URL; ?>/sites/<span id="tempUrl" class="temp">your-site</span></p>
					<input id="friendlyId" type="hidden" value="">
				</div>
				
				<div class="form-group">
					<label for="timeZone"><?php print _("Timezone:"); ?></label>
					<select id="timeZone" data-bind="value: timeZone" class="form-control">
						<option value="Pacific/Midway">(GMT-11:00) Midway Island, Samoa</option>
						<option value="America/Adak">(GMT-10:00) Hawaii-Aleutian</option>
						<option value="Etc/GMT+10">(GMT-10:00) Hawaii</option>
						<option value="Pacific/Marquesas">(GMT-09:30) Marquesas Islands</option>
						<option value="Pacific/Gambier">(GMT-09:00) Gambier Islands</option>
						<option value="America/Anchorage">(GMT-09:00) Alaska</option>
						<option value="America/Ensenada">(GMT-08:00) Tijuana, Baja California</option>
						<option value="Etc/GMT+8">(GMT-08:00) Pitcairn Islands</option>
						<option value="America/Los_Angeles">(GMT-08:00) Pacific Time (US & Canada)</option>
						<option value="America/Denver">(GMT-07:00) Mountain Time (US & Canada)</option>
						<option value="America/Chihuahua">(GMT-07:00) Chihuahua, La Paz, Mazatlan</option>
						<option value="America/Dawson_Creek">(GMT-07:00) Arizona</option>
						<option value="America/Belize">(GMT-06:00) Saskatchewan, Central America</option>
						<option value="America/Cancun">(GMT-06:00) Guadalajara, Mexico City, Monterrey</option>
						<option value="Chile/EasterIsland">(GMT-06:00) Easter Island</option>
						<option value="America/Chicago">(GMT-06:00) Central Time (US & Canada)</option>
						<option value="America/New_York">(GMT-05:00) Eastern Time (US & Canada)</option>
						<option value="America/Havana">(GMT-05:00) Cuba</option>
						<option value="America/Bogota">(GMT-05:00) Bogota, Lima, Quito, Rio Branco</option>
						<option value="America/Caracas">(GMT-04:30) Caracas</option>
						<option value="America/Santiago">(GMT-04:00) Santiago</option>
						<option value="America/La_Paz">(GMT-04:00) La Paz</option>
						<option value="Atlantic/Stanley">(GMT-04:00) Faukland Islands</option>
						<option value="America/Campo_Grande">(GMT-04:00) Brazil</option>
						<option value="America/Goose_Bay">(GMT-04:00) Atlantic Time (Goose Bay)</option>
						<option value="America/Glace_Bay">(GMT-04:00) Atlantic Time (Canada)</option>
						<option value="America/St_Johns">(GMT-03:30) Newfoundland</option>
						<option value="America/Araguaina">(GMT-03:00) UTC-3</option>
						<option value="America/Montevideo">(GMT-03:00) Montevideo</option>
						<option value="America/Miquelon">(GMT-03:00) Miquelon, St. Pierre</option>
						<option value="America/Godthab">(GMT-03:00) Greenland</option>
						<option value="America/Argentina/Buenos_Aires">(GMT-03:00) Buenos Aires</option>
						<option value="America/Sao_Paulo">(GMT-03:00) Brasilia</option>
						<option value="America/Noronha">(GMT-02:00) Mid-Atlantic</option>
						<option value="Atlantic/Cape_Verde">(GMT-01:00) Cape Verde Is.</option>
						<option value="Atlantic/Azores">(GMT-01:00) Azores</option>
						<option value="Europe/Belfast">(GMT) Greenwich Mean Time : Belfast</option>
						<option value="Europe/Dublin">(GMT) Greenwich Mean Time : Dublin</option>
						<option value="Europe/Lisbon">(GMT) Greenwich Mean Time : Lisbon</option>
						<option value="Europe/London">(GMT) Greenwich Mean Time : London</option>
						<option value="Africa/Abidjan">(GMT) Monrovia, Reykjavik</option>
						<option value="Europe/Amsterdam">(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna</option>
						<option value="Europe/Belgrade">(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague</option>
						<option value="Europe/Brussels">(GMT+01:00) Brussels, Copenhagen, Madrid, Paris</option>
						<option value="Africa/Algiers">(GMT+01:00) West Central Africa</option>
						<option value="Africa/Windhoek">(GMT+01:00) Windhoek</option>
						<option value="Asia/Beirut">(GMT+02:00) Beirut</option>
						<option value="Africa/Cairo">(GMT+02:00) Cairo</option>
						<option value="Asia/Gaza">(GMT+02:00) Gaza</option>
						<option value="Africa/Blantyre">(GMT+02:00) Harare, Pretoria</option>
						<option value="Asia/Jerusalem">(GMT+02:00) Jerusalem</option>
						<option value="Europe/Minsk">(GMT+02:00) Minsk</option>
						<option value="Asia/Damascus">(GMT+02:00) Syria</option>
						<option value="Europe/Moscow">(GMT+03:00) Moscow, St. Petersburg, Volgograd</option>
						<option value="Africa/Addis_Ababa">(GMT+03:00) Nairobi</option>
						<option value="Asia/Tehran">(GMT+03:30) Tehran</option>
						<option value="Asia/Dubai">(GMT+04:00) Abu Dhabi, Muscat</option>
						<option value="Asia/Yerevan">(GMT+04:00) Yerevan</option>
						<option value="Asia/Kabul">(GMT+04:30) Kabul</option>
						<option value="Asia/Yekaterinburg">(GMT+05:00) Ekaterinburg</option>
						<option value="Asia/Tashkent">(GMT+05:00) Tashkent</option>
						<option value="Asia/Kolkata">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
						<option value="Asia/Katmandu">(GMT+05:45) Kathmandu</option>
						<option value="Asia/Dhaka">(GMT+06:00) Astana, Dhaka</option>
						<option value="Asia/Novosibirsk">(GMT+06:00) Novosibirsk</option>
						<option value="Asia/Rangoon">(GMT+06:30) Yangon (Rangoon)</option>
						<option value="Asia/Bangkok">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
						<option value="Asia/Krasnoyarsk">(GMT+07:00) Krasnoyarsk</option>
						<option value="Asia/Hong_Kong">(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</option>
						<option value="Asia/Irkutsk">(GMT+08:00) Irkutsk, Ulaan Bataar</option>
						<option value="Australia/Perth">(GMT+08:00) Perth</option>
						<option value="Australia/Eucla">(GMT+08:45) Eucla</option>
						<option value="Asia/Tokyo">(GMT+09:00) Osaka, Sapporo, Tokyo</option>
						<option value="Asia/Seoul">(GMT+09:00) Seoul</option>
						<option value="Asia/Yakutsk">(GMT+09:00) Yakutsk</option>
						<option value="Australia/Adelaide">(GMT+09:30) Adelaide</option>
						<option value="Australia/Darwin">(GMT+09:30) Darwin</option>
						<option value="Australia/Brisbane">(GMT+10:00) Brisbane</option>
						<option value="Australia/Hobart">(GMT+10:00) Hobart</option>
						<option value="Asia/Vladivostok">(GMT+10:00) Vladivostok</option>
						<option value="Australia/Lord_Howe">(GMT+10:30) Lord Howe Island</option>
						<option value="Etc/GMT-11">(GMT+11:00) Solomon Is., New Caledonia</option>
						<option value="Asia/Magadan">(GMT+11:00) Magadan</option>
						<option value="Pacific/Norfolk">(GMT+11:30) Norfolk Island</option>
						<option value="Asia/Anadyr">(GMT+12:00) Anadyr, Kamchatka</option>
						<option value="Pacific/Auckland">(GMT+12:00) Auckland, Wellington</option>
						<option value="Etc/GMT-12">(GMT+12:00) Fiji, Kamchatka, Marshall Is.</option>
						<option value="Pacific/Chatham">(GMT+12:45) Chatham Islands</option>
						<option value="Pacific/Tongatapu">(GMT+13:00) Nuku'alofa</option>
						<option value="Pacific/Kiritimati">(GMT+14:00) Kiritimati</option>
						</select>
				</div>
				
				<div class="form-group">
					<label for="passcode"><?php print _("Passcode:"); ?></label>
					<input id="passcode" type="text" class="form-control input-lg">
				</div>

				
			</div>
							
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button add" data-bind="click: addSite"><?php print _("Add Site"); ?></button>
			</div>
			<!-- /.modal-footer -->
			
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

</div>
<!-- /.modal -->

<div class="modal fade" id="deleteDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Remove Site"); ?></h3>
			</div>
			<div class="modal-body">
			
			<p>
				<?php print _("Confirm that you want to remove:"); ?> <strong id="removeName">this page</strong>
			</p>
			
			</div>
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: removeSite"><?php print _("Remove Site"); ?></button>
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
<script type="text/javascript" src="<?php print TIMEZONEDETECT_JS; ?>"></script>
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/adminModel.js?v=<?php print VERSION; ?>"></script>


</html>