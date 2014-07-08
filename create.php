<?php	
	include 'app.php'; // import php files
	
	// set language to preferred language (HTTP_ACCEPT_LANGUAGE)
	$supported = Utilities::GetSupportedLanguages('');
	$language = Utilities::GetPreferredLanguage($supported);
	
	Utilities::SetLanguage($language);
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $language) ?>">

<head>
	
<title><?php print _("Create Site"); ?>&mdash;<?php print BRAND; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include styles -->
<?php include 'modules/css.php'; ?>
<link type="text/css" href="css/login.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body>

<!-- messages -->
<input id="msg-create-required" value="<?php print _("All fields are required"); ?>" type="hidden">
<input id="msg-password-error" value="<?php print _("The password and retype fields must match"); ?>" type="hidden">
<input id="msg-creating" value="<?php print _("Creating..."); ?>" type="hidden">
<input id="msg-created-successfully" value="<?php print _("Site created successfully"); ?>" type="hidden">
<input id="msg-passcode-invalid" value="<?php print _("The passcode is invalid"); ?>" type="hidden">
<input id="msg-email-invalid" value="<?php print _("The email or site name you provided is already used in the system"); ?>" type="hidden">

<!-- begin content -->
<div id="create" class="content" data-default="<?php print DEFAULT_THEME; ?>">

	<h1><span class="brand"><img src="<?php print BRAND_LOGO; ?>" title="<?php print BRAND; ?>"></span></h1>
	
	<div id="create-form">
	
	<fieldset>
	
		<div class="current">
	
			<h2 class="title"><span class="step">1</span> <?php print _("Create Site"); ?> <a id="toggle-advanced">Language and Timezone</a></h2>
			
			<div class="container-fluid">
			
				<div class="row">
				
					<div class="col-md-4">
						<div class="form-group">
							<label for="name"><?php print _("Site Name:"); ?></label>
							<input id="name" type="text" value="" class="form-control">
							<p class="site-name">
								<?php print APP_URL; ?>/sites/<span id="tempUrl" class="temp">your-site</span> 
							</p>
							<i id="validate-site" class="validating fa fa-spinner fa-spin"></i>
							<i id="site-valid" class="valid fa fa-check"></i>
							<i id="site-invalid" class="invalid fa fa-times"></i>
							<input id="friendlyId" type="hidden" value="">
						</div>
					</div>
					
					<div class="col-md-4">
						<div class="form-group">
							<label for="email"><?php print _("Email:"); ?></label>
							<input id="email" type="text" value="" class="form-control">
							<i id="validate-email" class="validating fa fa-spinner fa-spin"></i>
							<i id="email-valid" class="valid fa fa-check"></i>
							<i id="email-invalid" class="invalid fa fa-times"></i>
						</div>
						<!-- /.form-group -->
						
					</div>
					<!-- /.col-md-4 -->
					
					<div class="col-md-4">
						<div class="form-group">
							<label for="password"><?php print _("Password:"); ?></label>
							<input id="password" type="password" class="form-control">
						</div>
						<!-- /.form-group -->
						
					</div>
					<!-- /.col-md-4 -->
					
				</div>
				<!-- /.row -->
				
				<div class="row advanced">
				
					<div class="col-md-4">
						
						<div class="form-group">
							<label for="language" class="control-label"><?php print _("Site Language:"); ?></label>
							<select id="language-select" class="form-control">
								<option value="">Other</option> 
								<option value="aa">Afar (aa)</option> 
								<option value="ab">Abkhazian (ab)</option> 
								<option value="af">Afrikaans (af)</option> 
								<option value="am">Amharic (am)</option> 
								<option value="ar">Arabic (ar)</option> 
								<option value="as">Assamese (as)</option> 
								<option value="ay">Aymara (ay)</option> 
								<option value="az">Azerbaijani (az)</option> 
								<option value="ba">Bashkir (ba)</option> 
								<option value="be">Byelorussian (be)</option> 
								<option value="bg">Bulgarian (bg)</option> 
								<option value="bh">Bihari (bh)</option> 
								<option value="bi">Bislama (bi)</option> 
								<option value="bn">Bengali/Bangla (bn)</option> 
								<option value="bo">Tibetan (bo)</option> 
								<option value="br">Breton (br)</option> 
								<option value="ca">Catalan (ca)</option> 
								<option value="co">Corsican (co)</option> 
								<option value="cs">Czech (cs)</option>  
								<option value="cs-cs">Czech (cs-cs)</option> 
								<option value="cy">Welsh (cy)</option> 
								<option value="da">Danish (da)</option> 
								<option value="da-dk">Danish (da-dk)</option> 
								<option value="de">German (de)</option>
								<option value="de-at">German (de-at)</option>  
								<option value="de-ch">German (de-ch)</option> 
								<option value="de-de">German (de-de)</option> 
								<option value="dz">Bhutani (dz)</option> 
								<option value="el">Greek (el)</option> 
								<option value="el-gr">Greek (el-gr)</option> 
								<option value="en">English (en)</option>
								<option value="en-au">English (en-au)</option>
								<option value="en-gb">English (en-gb)</option>
								<option value="en-us" selected="selected">English (en-us)</option>
								<option value="en-za">English (en-za)</option>
								<option value="eo">Esperanto (eo)</option> 
								<option value="es">Spanish (es)</option> 
								<option value="es-ar">Spanish (es-ar)</option>
								<option value="es-cl">Spanish (es-cl)</option>
								<option value="es-es">Spanish (es-es)</option>
								<option value="es-mx">Spanish (es-mx)</option>
								<option value="es-419">Spanish (es-419)</option>
								<option value="et">Estonian (et)</option> 
								<option value="eu">Basque (eu)</option> 
								<option value="fa">Persian (fa)</option> 
								<option value="fi">Finnish (fi)</option> 
								<option value="fi-fi">Finnish (fi-fi)</option> 
								<option value="fj">Fiji (fj)</option> 
								<option value="fo">Faeroese (fo)</option> 
								<option value="fr">French (fr)</option>
								<option value="fr-be">French (fr-be)</option> 
								<option value="fr-fr">French (fr-fr)</option> 
								<option value="fy">Frisian (fy)</option> 
								<option value="ga">Irish (ga)</option> 
								<option value="gd">Scots/Gaelic (gd)</option> 
								<option value="gl">Galician (gl)</option> 
								<option value="gn">Guarani (gn)</option> 
								<option value="gu">Gujarati (gu)</option> 
								<option value="ha">Hausa (ha)</option> 
								<option value="hi">Hindi (hi)</option> 
								<option value="hr">Croatian (hr)</option> 
								<option value="hu">Hungarian (hu)</option> 
								<option value="hu-hu">Hungarian (hu-hu)</option> 
								<option value="hy">Armenian (hy)</option> 
								<option value="ia">Interlingua (ia)</option> 
								<option value="ie">Interlingue (ie)</option> 
								<option value="ik">Inupiak (ik)</option> 
								<option value="in">Indonesian (in)</option> 
								<option value="is">Icelandic (is)</option> 
								<option value="it">Italian (it)</option>  
								<option value="it-it">Italian (it-it)</option> 
								<option value="iw">Hebrew (iw)</option> 
								<option value="ja">Japanese (ja)</option> 
								<option value="ji">Yiddish (ji)</option> 
								<option value="jw">Javanese (jw)</option> 
								<option value="ka">Georgian (ka)</option> 
								<option value="kk">Kazakh (kk)</option> 
								<option value="kl">Greenlandic (kl)</option> 
								<option value="km">Cambodian (km)</option> 
								<option value="kn">Kannada (kn)</option> 
								<option value="ko">Korean (ko)</option> 
								<option value="ko-kr">Korean (ko-kr)</option> 
								<option value="ks">Kashmiri (ks)</option> 
								<option value="ku">Kurdish (ku)</option> 
								<option value="ky">Kirghiz (ky)</option> 
								<option value="la">Latin (la)</option> 
								<option value="ln">Lingala (ln)</option> 
								<option value="lo">Laothian (lo)</option> 
								<option value="lt">Lithuanian (lt)</option> 
								<option value="lv">Latvian/Lettish (lv)</option> 
								<option value="mg">Malagasy (mg)</option> 
								<option value="mi">Maori (mi)</option> 
								<option value="mk">Macedonian (mk)</option> 
								<option value="ml">Malayalam (ml)</option> 
								<option value="mn">Mongolian (mn)</option> 
								<option value="mo">Moldavian (mo)</option> 
								<option value="mr">Marathi (mr)</option> 
								<option value="ms">Malay (ms)</option> 
								<option value="mt">Maltese (mt)</option> 
								<option value="my">Burmese (my)</option> 
								<option value="na">Nauru (na)</option> 
								<option value="ne">Nepali (ne)</option> 
								<option value="nl">Dutch (nl)</option>
								<option value="nl-be">Dutch (nl-be)</option>
								<option value="nl-nl">Dutch (nl-nl)</option>  
								<option value="no">Norwegian (no)</option> 
								<option value="oc">Occitan (oc)</option> 
								<option value="om">(Afan)/Oromoor/Oriya (om)</option> 
								<option value="pa">Punjabi (pa)</option> 
								<option value="pl">Polish (pl)</option> 
								<option value="pl-pl">Polish (pl-pl)</option> 
								<option value="ps">Pashto/Pushto (ps)</option> 
								<option value="pt">Portuguese (pt)</option> 
								<option value="pt-br">Portuguese (pt-br)</option> 
								<option value="pt-pt">Portuguese (pt-pt)</option> 
								<option value="qu">Quechua (qu)</option> 
								<option value="rm">Rhaeto-Romance (rm)</option> 
								<option value="rn">Kirundi (rn)</option> 
								<option value="ro">Romanian (ro)</option> 
								<option value="ro-ro">Romanian (ro-ro)</option> 
								<option value="ru">Russian (ru)</option> 
								<option value="ru-ru">Russian (ru-ru)</option> 
								<option value="rw">Kinyarwanda (rw)</option> 
								<option value="sa">Sanskrit (sa)</option> 
								<option value="sd">Sindhi (sd)</option> 
								<option value="sg">Sangro (sg)</option> 
								<option value="sh">Serbo-Croatian (sh)</option> 
								<option value="si">Singhalese (si)</option> 
								<option value="sk">Slovak (sk)</option> 
								<option value="sl">Slovenian (sl)</option> 
								<option value="sm">Samoan (sm)</option> 
								<option value="sn">Shona (sn)</option> 
								<option value="so">Somali (so)</option> 
								<option value="sq">Albanian (sq)</option> 
								<option value="sr">Serbian (sr)</option> 
								<option value="ss">Siswati (ss)</option> 
								<option value="st">Sesotho (st)</option> 
								<option value="su">Sundanese (su)</option> 
								<option value="sv">Swedish (sv)</option>  
								<option value="sv-se">Swedish (sv-se)</option> 
								<option value="sw">Swahili (sw)</option> 
								<option value="ta">Tamil (ta)</option> 
								<option value="te">Tegulu (te)</option> 
								<option value="tg">Tajik (tg)</option> 
								<option value="th">Thai (th)</option> 
								<option value="ti">Tigrinya (ti)</option> 
								<option value="tk">Turkmen (tk)</option> 
								<option value="tl">Tagalog (tl)</option> 
								<option value="tn">Setswana (tn)</option> 
								<option value="to">Tonga (to)</option> 
								<option value="tr">Turkish (tr)</option> 
								<option value="ts">Tsonga (ts)</option> 
								<option value="tt">Tatar (tt)</option> 
								<option value="tw">Twi (tw)</option> 
								<option value="uk">Ukrainian (uk)</option> 
								<option value="ur">Urdu (ur)</option> 
								<option value="uz">Uzbek (uz)</option> 
								<option value="vi">Vietnamese (vi)</option> 
								<option value="vo">Volapuk (vo)</option> 
								<option value="wo">Wolof (wo)</option> 
								<option value="xh">Xhosa (xh)</option> 
								<option value="yo">Yoruba (yo)</option> 
								<option value="zh">Chinese (zh)</option> 
								<option value="zh-cn">Chinese (zh-cn)</option>
								<option value="zh-tw">Chinese (zh-tw)</option>
								<option value="zu">Zulu (zu)</option>
							</select>
							<input id="language" type="text" class="form-control form-stacked-bottom hidden" placeholder="us-us" value="en-us">
						</div>
						<!-- /.form-group -->
			
						<div class="form-group">
							<label for="timeZone"><?php print _("Site Timezone:"); ?></label>
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
						<!-- /.form-group -->
					
					</div>
					<!-- /.col-md-4 -->
					
					<div class="col-md-4">
						<div class="form-group advanced">
							<label for="userLanguage"><?php print _("Your Language:"); ?></label>
							<select id="userLanguage" class="form-control" data-bind="
							    options: languages,
							    optionsText: 'text',
							    optionsValue: 'code'">
								    <option value="en">English</option>
							    </select>
						</div>
					</div>
					<!-- /.col-md-4 -->
				
				</div>
				<!-- /.row -->
			
			</div>
			<!-- /.container-fluid -->

		</div>
		<!-- /.current -->
		
		<div class="future">
		
			<h2 class="title"><span class="step">2</span> <?php print _("Select Theme"); ?></h2>
			
			<div class="container-fluid">
			
				<div class="row">
				
					<div class="col-md-12">
					
						<div id="themesList" class="image-list" data-bind="foreach: themes">
    
					        <div class="image-item" data-bind="css:{active: ($parent.theme()==id())}">
					            <h2 data-bind="text: name"></h2>
					            
					            <img data-bind="attr:{'src': 'themes/'+id()+'/logo.png'}">
					            
					            <div class="secondary inactive-button" data-bind="click: $parent.setTheme"><?php print _("Select Theme"); ?></div>
    		<div class="active-button"><?php print _("Selected"); ?></div>
					    		
					        </div>
					    
					    </div>
					    <!-- /.image-list -->
					
			
					</div>
					<!-- /.col-md-4 -->
				
				</div>
				<!-- /.row -->
			
			</div>
			<!-- /.container-fluid -->
			
		</div>
		<!-- /.future -->
		
		<?php if(PASSCODE !== ''){ ?>
		<div class="future">
		
			<h2 class="title"><span class="step">3</span> <?php print _("Passcode"); ?></h2>
			
			<div class="container-fluid">
			
				<div class="row">
				
					<div class="col-md-4">
						<div class="form-group">
							<label for="passcode"><?php print _("Passcode:"); ?></label>
							<input id="passcode" type="text" class="form-control input-lg">
						</div>
					</div>
					<!-- /.col-md-4 -->
				
				</div>
				<!-- /.row -->
			
			</div>
			<!-- /.container-fluid -->
			
		</div>
		<!-- /.future -->
		<?php } else { ?>
			<input id="passcode" type="hidden" value="">
		<?php } ?>

		<span class="actions">
			<button type="button" class="primary-button" data-bind="click: create"><?php print _("Create Site"); ?> <i class="fa fa-angle-right fa-white"></i></button>
		</span>

	</fieldset>
	
	</div>
	
	<div id="create-confirmation">

	<fieldset>
		<p>
			<?php print _("Account created! To get started, click on your login link below."); ?>
		</p>	


		<p>
			<?php print _("Login here to update your site:"); ?><br>
			<a id="loginLink" href="<?php print APP_URL; ?>"><?php print APP_URL; ?></a>
		</p>
		
		<p>
			<?php print _("You can already view your site here:"); ?> <br>
			<a id="siteLink" href="<?php print APP_URL; ?>/sites/{friendlyId}"><?php print APP_URL; ?>/sites/{friendlyId}</a>
		</p>
		
		<p>
			<?php print _("Bookmark these links for easy access."); ?>
		</p>
		

	</fieldset>
	
	</div>

	 <small><?php print COPY; ?></small>


</div>
<!-- /.content -->

</body>

<!-- include js -->
<?php include 'modules/js.php'; ?>
<script type="text/javascript" src="<?php print TIMEZONEDETECT_JS; ?>"></script>
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/createModel.js?v=<?php print VERSION; ?>"></script>

</html>