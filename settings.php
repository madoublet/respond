<?php	
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('All');
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

<body data-currpage="settings">
	
<p id="message">
  <span>Holds the message text.</span>
  <a class="close" href="#"></a>
</p>

<?php include 'modules/menu.php'; ?>

<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
    
        <ul>
            <li class="static active"><a>Settings</a></li>
        </ul>
        
    </nav>
    <!-- /nav -->

	
	<form class="form-horizontal" data-bind="with: site">
		
		<div class="form-group">
			<label for="name" class="col-lg-2 control-label">Site Name:</label>
			<div class="col-lg-4">
				<input id="name" type="text" data-bind="value: name" class="form-control">
			</div>
		</div>
		
		<div class="form-group">
			<label for="domain" class="col-lg-2 control-label">Domain:</label>
			<div class="col-lg-4">
				<input id="domain" type="text"  data-bind="value: domain" class="form-control">
				<span class="help-block">e.g. domain.com, sub.domain.com (leave off www)</span>
			</div>
		</div>
		
		<div class="form-group">
			<label for="primaryEmail" class="col-lg-2 control-label">Primary Email:</label>
			<div class="col-lg-4">
				<input id="primaryEmail" type="text" data-bind="value: primaryEmail" class="form-control">
				<span class="help-block">Forms submitted on your site will be sent to this email address</span>
			</div>
		</div>
		
		<div class="form-group">
			<label for="timeZone" class="col-lg-2 control-label">Time Zone:</label>
			<div class="col-lg-4">
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
		</div>
		
		<div class="form-group">
			<label for="analyticsId" class="col-lg-2 control-label">Google Analytics ID:</label>
			<div class="col-lg-4">
				<input id="analyticsId" type="text" data-bind="value: analyticsId" class="form-control">
				<span class="help-block">Google Analytics Web Property Id (adds analytics to all pages on your site)</span>
			</div>
		</div>	
		
		<div class="form-group">
			<label for="facebookAppId" class="col-lg-2 control-label">Facebook App ID:</label>
			<div class="col-lg-4">
				<input id="facebookAppId" type="text" data-bind="value: facebookAppId" class="form-control">
				<span class="help-block">Allows you to moderate comments on your site, create here: <a href="https://developers.facebook.com/apps/">https://developers.facebook.com/apps/</a></span>
			</div>
		</div>	
		
		<div class="form-group">
			<label for="sitemap" class="col-lg-2 control-label">Sitemap:</label>
			<div class="col-lg-4">
				<span class="read-only" data-bind="text: $parent.siteMap"></span>
			</div>
		</div>	
		
		<div class="form-group">
			<label for="verification" class="col-lg-2 control-label">Sitemap Verification:</label>
			<div class="col-lg-4">
				<span class="read-only">
					<a data-bind="click: $parent.showVerificationDialog">Generate Verification File</a>
				</span>
				<span class="help-block">Setup your sitemaps at google.com/webmasters</span>
			</div>
		</div>
		
    </form>
    <!-- /.form-horizontal -->
    
    <div class="actions" data-bind="with: site">
        <button class="primary-button" type="button" data-bind="click: $parent.save">Save</button>
    </div>

</section>
<!-- /.main -->

<div class="modal fade" id="verificationDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3>Generate Verification File</h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">
			
				<div class="form-group">
					<label for="fileName">File Name:</label>
					<input id="fileName" type="text" value="" maxlength="255" class="form-control">
					<span class="help-block">e.g. google12345678910abc123.html</span>
				</div>
				
				<div class="form-group">
					<label for="fileContent">File Contents:</label>
					<textarea id="fileContent" class="form-control"></textarea>
					<span class="help-block">e.g. google-site-verification: google12345678910abc123.html</span>
				</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button class="primary-button" data-bind="click: generateVerification">Generate Verification File</button>
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
<script type="text/javascript" src="js/dialog.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/messages.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/settingsModel.js?v=<?php print VERSION; ?>"></script>

</html>