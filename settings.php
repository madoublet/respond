<?php	
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('Admin');
	
	Utilities::SetLanguage($authUser->Language); // set language
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $authUser->Language) ?>">

<head>
	
<title><?php print _("Settings"); ?>&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include css -->
<?php include 'modules/css.php'; ?>

</head>

<body id="settings-page" data-currpage="settings">
	
<?php include 'modules/menu.php'; ?>

<!-- messages -->
<input id="msg-updating" value="<?php print _("Updating..."); ?>" type="hidden">
<input id="msg-updated" value="<?php print _("Settings updated successfully"); ?>" type="hidden">
<input id="msg-updating-error" value="<?php print _("There was a problem saving the settings, please try again"); ?>" type="hidden">
<input id="msg-name-content-error" value="<?php print _("The name and content are required"); ?>" type="hidden">
<input id="msg-generating" value="<?php print _("Generating..."); ?>" type="hidden">
<input id="msg-generated" value="<?php print _("Verification file successfully generated"); ?>" type="hidden">
<input id="msg-generating-error" value="<?php print _("There was a problem generating the file, please try again"); ?>" type="hidden">

<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
    
        <ul>
            <li class="static active"><a><?php print _("Settings"); ?></a></li>
        </ul>
        
    </nav>
    <!-- /nav -->
    
    <div class="list-menu hidden">
		<p>
			<?php print _("Updates to settings will not be reflected until the site is re-published."); ?>
			<a class="publish-site"><?php print _("Re-publish now"); ?></a>
		</p>
	</div>
	<!-- /.list-menu -->
   
	<ul class="segmented-control">
		<li class="active" data-navigate="site"><a><?php print _("Site"); ?></a></li>
		<li data-navigate="payments"><a><?php print _("Payments"); ?></a></li>
		<li data-navigate="social"><a><?php print _("Social"); ?></a></li>
		<li data-navigate="analytics"><a><?php print _("Analytics"); ?></a></li>
		<li data-navigate=formscaptcha><a><?php print _("Forms"); ?></a></li>
	</ul>
	<!-- /.segmented-control -->
	
	<form class="form-vertical" data-bind="with: site">
	
		<div class="section-site">
	
			<div class="form-group">
				<label for="name" class="control-label"><?php print _("Site Name:"); ?></label>
				<div>
					<input id="name" type="text" data-bind="value: name" class="form-control">
				</div>
			</div>
			
			<div class="form-group">
				<label for="domain" class="control-label"><?php print _("Domain:"); ?></label>
				<div>
					<input id="domain" type="text"  data-bind="value: domain" class="form-control">
					<span class="help-block"><?php print _("e.g. domain.com, sub.domain.com (leave off www, http://, and trailing /)"); ?></span>
				</div>
			</div>
			
			<div class="form-group">
				<label for="primaryEmail" class="control-label"><?php print _("Primary Email:"); ?></label>
				<div>
					<input id="primaryEmail" type="text" data-bind="value: primaryEmail" class="form-control">
					<span class="help-block"><?php print _("Forms submitted on your site will be sent to this email address"); ?></span>
				</div>
			</div>
			
			<div class="form-group">
				<label for="timeZone" class="control-label"><?php print _("Time Zone:"); ?></label>
				<div>
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
	Australia/Perth">(GMT+08:00) Perth</option>
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
				<label for="language" class="control-label"><?php print _("Default Language:"); ?></label>
				<div>
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
						<option value="en-us">English (en-us)</option>
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
					<input id="language" type="text" class="form-control form-stacked-bottom hidden" placeholder="us-us">
				</div>
			</div>
		
		</div>	
		<!-- /.section-site -->

		<div class="section-payments hidden">
		
			<div class="form-group">
				<label for="payPalId" class="control-label"><?php print _("PayPal ID:"); ?></label>
				<div>
					<input id="payPalId" type="text"  data-bind="value: payPalId" class="form-control">
				</div>
			</div>
			
			<div class="form-group">
				<label for="payPalId" class="control-label"><?php print _("Use PayPal Sandbox (for testing):"); ?></label>
				<div>
					<select id="payPalUseSandbox" data-bind="value:payPalUseSandbox" class="form-control">
						<option value="1">Yes</option>
				    	<option value="0">No</option>
					</select>
				</div>
			</div>
		
			<div class="form-group">
				<label for="currency" class="control-label"><?php print _("Currency:"); ?></label>
				<div>
					<select id="currency" class="form-control" data-bind="
					    options: $parent.currencies,
					    optionsText: 'text',
					    optionsValue: 'code', 
					    value: currency">
						</select>
				</div>
			</div>
			
			<div class="form-group">
				<label for="weightUnit" class="control-label"><?php print _("Weight Unit:"); ?></label>
				<div>
					<select id="weightUnit" class="form-control" data-bind="value:weightUnit">
				    	<option value="kgs">kgs</option>
				    	<option value="lbs">lbs</option>
					</select>
					<span class="help-block"><?php print _("Optionally used to calculate shipping costs"); ?></span>
				</div>
			</div>
			
			<div class="form-group">
				<label for="taxRate" class="control-label"><?php print _("Tax Rate:"); ?></label>
				<div>
					<input id="taxRate" type="number" class="form-control" data-bind="value:taxRate">
				</div>
			</div>
			
			<div class="form-group">
				<label for="shippingCalculation" class="control-label"><?php print _("Shipping Calculation:"); ?></label>
				<div>
					<select id="shippingCalculation" class="form-control" data-bind="value:shippingCalculation">
						<option value="free"><?php print _("Free"); ?></option>
						<option value="flat-rate"><?php print _("Flat Rate"); ?></option>
						<option value="amount"><?php print _("By Order Amount"); ?></option>
						<option value="weight"><?php print _("By Weight"); ?></option>
					</select>
				</div>
			</div>
			
			<div class="form-group flat-rate" data-bind="visible: shippingCalculation()=='flat-rate'">
				<label for="shippingRate" class="control-label"><?php print _("Shipping Rate:"); ?></label>
			    <div class="input-group">
				 	<input id="shippingRate" type="number" maxlength="128" value="" class="form-control" data-bind="value:shippingRate">
				 	<span class="input-group-addon"><?php print $authUser->Currency; ?></span>
				</div>
			</div>
			
			
			<div class="form-group weight" data-bind="visible: shippingCalculation()=='weight'">
				<table class="table">
					<col width="33.3%">
					<col width="33.3%">
					<col width="33.3%">
					<thead>
						<tr>
							<th>From <small>(<?php print $authUser->WeightUnit; ?>)</small></th>
							<th>To <small>(<?php print $authUser->WeightUnit; ?>)</small></th>
							<th>Rate <small>(<?php print $authUser->Currency; ?>)</small></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><span class="from">0</span></td>
							<td><input class="to" class="form-control" type="number"></td>
							<td><input class="rate" class="form-control" type="number"></td>
						</tr>
						<tr>
							<td><span class="from">--</span></td>
							<td><input class="to" class="form-control" type="number"></td>
							<td><input class="rate" class="form-control" type="number"></td>
						</tr>
						<tr>
							<td><span class="from">--</span></td>
							<td><input class="to" class="form-control" type="number"></td>
							<td><input class="rate" class="form-control" type="number"></td>
						</tr>
						<tr>
							<td><span class="from">--</span></td>
							<td><input class="to" class="form-control" type="text"></td>
							<td><input class="rate" class="form-control" type="text"></td>
						</tr>
						<tr>
							<td><span class="from">--</span></td>
							<td><input class="to" class="form-control" type="text"></td>
							<td><input class="rate" class="form-control" type="text"></td>
						</tr>
					</tbody>
				</table>
			</div>
			
			<div class="form-group amount" data-bind="visible: shippingCalculation()=='amount'">
				<table class="table">
					<col width="33.3%">
					<col width="33.3%">
					<col width="33.3%">
					<thead>
						<tr>
							<th>From <small>(<?php print $authUser->Currency; ?>)</small></th>
							<th>To <small>(<?php print $authUser->Currency; ?>)</small></th>
							<th>Rate <small>(<?php print $authUser->Currency; ?>)</small></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><span class="from">0</span></td>
							<td><input class="to" class="form-control" type="text"></td>
							<td><input class="rate" class="form-control" type="text"></td>
						</tr>
						<tr>
							<td><span class="from">--</span></td>
							<td><input class="to" class="form-control" type="text"></td>
							<td><input class="rate" class="form-control" type="text"></td>
						</tr>
						<tr>
							<td><span class="from">--</span></td>
							<td><input class="to" class="form-control" type="text"></td>
							<td><input class="rate" class="form-control" type="text"></td>
						</tr>
						<tr>
							<td><span class="from">--</span></td>
							<td><input class="to" class="form-control" type="text"></td>
							<td><input class="rate" class="form-control" type="text"></td>
						</tr>
						<tr>
							<td><span class="from">--</span></td>
							<td><input class="to" class="form-control" type="text"></td>
							<td><input class="rate" class="form-control" type="text"></td>
						</tr>
					</tbody>
				</table>
			</div>
			
		</div>	
		<!-- /.section-payments -->

		<div class="section-social hidden">
			
			<div class="form-group">
				<label for="facebookAppId" class="control-label"><?php print _("Facebook App ID:"); ?></label>
				<div>
					<input id="facebookAppId" type="text" data-bind="value: facebookAppId" class="form-control">
					<span class="help-block"><?php print _("Allows you to moderate comments on your site, create here:"); ?> <a href="https://developers.facebook.com/apps/">https://developers.facebook.com/apps/</a></span>
				</div>
			</div>
		
		</div>	
		<!-- /.section-social -->
		
		<div class="section-analytics hidden">

			<div class="form-group">
				<label for="analyticsId" class="control-label"><?php print _("Google Analytics ID:"); ?></label>
				<div>
					<input id="analyticsId" type="text" data-bind="value: analyticsId" class="form-control">
					<span class="help-block"><?php print _("Google Analytics Web Property Id (adds analytics to all pages on your site)"); ?></span>
				</div>
			</div>
			
			<div class="form-group">
				<label for="analyticssubdomain" class="checkbox">
					<input id="analyticssubdomain" type="checkbox" data-bind="checked: analyticssubdomain">
					<?php print _("Google Analytics Sub-Domain"); ?>
				</label>
				<span class="help-block"><?php print _("Control Sub-domains; e.g. www.your_domain.com, apps.your_domain.com, and store.your_domain.com."); ?></span>
			</div>
			
			<div class="form-group" data-bind="visible: analyticssubdomain">
				<label for="analyticsdomain" class="control-label"><?php print _("Google Analytics Domain:"); ?></label>
				<div>
					<input id="analyticsdomain" type="text" data-bind="value: analyticsdomain, enable: analyticssubdomain" class="form-control">
				</div>
			</div>
			
			<div class="form-group">
					<label for="analyticsmultidomain" class="checkbox">
						<input id="analyticsmultidomain" type="checkbox" data-bind="checked: analyticsmultidomain">
						<?php print _("Google Analytics Multi-Domain"); ?>
					</label>
					
					<span class="help-block"><?php print _("Control Top Level Domains, e.g. your_domain.com, your_domain.org, your_domain.es "); ?></span>
			</div>
			
			<div class="form-group">
				<label for="sitemap" class="control-label"><?php print _("Sitemap:"); ?></label>
				<div>
					<span class="read-only" data-bind="text: $parent.siteMap"></span> <a data-bind="click: $parent.showVerificationDialog"><?php print _("Generate Verification File"); ?></a>
				</div>
			</div>
		
		</div>	
		<!-- /.section-analytics -->
		
		<div class="section-formscaptcha hidden">
			
			<div class="form-group">
				<label for="formPublicId" class="control-label"><?php print _("reCaptcha Public ID:"); ?></label>
				<div>
					<input id="formPublicId" type="text" data-bind="value: formPublicId" class="form-control">
					<span class="help-block"><?php print _("Allows you to put a reCaptcha field on your forms, create here:"); ?> <a href="https://www.google.com/recaptcha/">https://www.google.com/recaptcha/</a></span>
				</div>
			</div>
			<div class="form-group">
				<label for="formPrivateId" class="control-label"><?php print _("reCaptcha Private ID:"); ?></label>
				<div>
					<input id="formPrivateId" type="text" data-bind="value: formPrivateId" class="form-control">
					<span class="help-block"><?php print _("Allows you to validate a reCaptcha field from your forms, create here:"); ?> <a href="https://www.google.com/recaptcha/">https://www.google.com/recaptcha/</a></span>
				</div>
			</div>
			
		</div>	
		<!-- /.section-social -->
		
    </form>
    <!-- /.form-horizontal -->
    
    <div class="actions" data-bind="with: site">
        <button class="primary-button" type="button" data-bind="click: $parent.save"><?php print _("Save"); ?></button>
    </div>

</section>
<!-- /.main -->

<div class="modal fade" id="verificationDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3><?php print _("Generate Verification File"); ?></h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">
			
				<div class="form-group">
					<label for="fileName"><?php print _("File Name:"); ?></label>
					<input id="fileName" type="text" value="" maxlength="255" class="form-control">
					<span class="help-block">e.g. google12345678910abc123.html</span>
				</div>
				
				<div class="form-group">
					<label for="fileContent"><?php print _("File Contents:"); ?></label>
					<textarea id="fileContent" class="form-control"></textarea>
					<span class="help-block">e.g. google-site-verification: google12345678910abc123.html</span>
				</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: generateVerification"><?php print _("Generate Verification File"); ?></button>
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
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/settingsModel.js?v=<?php print VERSION; ?>"></script>

</html>