<?php
/**
 * This script is in charge of printing the HTML header information for our pages and loading the common php scripts
 * Most of the outputs and actions done by this scripts can be controlled by the $headerValues array
 * This scripts tries to give consistent output with default values of the $headerValues array, in an
 * attempt to reduce the setup task of each script that includes it, while giving enough flexibility for
 * future scripts with special requirements.
 * @param $headerValues = array <p>
 *   'user' => array(
 *      // will create a $authUser object of type AuthUser() and authenticate it, if false no variable will be created
 *      'authenticate' => true,
 *      // user to be used for authentification
 *      'user' => 'All',
 *    ),
 *    // if user, language will be obtained fromt he current authenticated user > this value will force authentification so be carefull
 *    // if preferred, the language will be obtained from the browser
 *    // if any other value is set it will be treated as a valid language code and be used directly as the forced language
 *    'language' => 'user|preferred|forced',
 *    // the title is a fixed string of two values separated by a dash, this value permits establishing both parts
 *    // the first part will be passed through the translating system, the second will not
 *    // valid values are:
 *    //   SITENAME > will be transalated to the current user's SiteName
 *    //   SCRIPTNAME > current script name with first letter capital will be used
 *    //   {{CONST}} > will be set to the given CONST value
 *    //   any other string will be used directly
 *    'title' => array(
 *      'first' => 'SCRIPTNAME',
 *      'second' => 'SITENAME',
 *    ),
 *    'stylesheet' => array(
 *      'path_to_css'  // can be repeated as many times as necessary
 *      // the default values, which are ALWAYS included are:
 *      '{{FONT}}',
 *      '{{BOOTSTRAP_CSS}}',
 *      '{{FONTAWESOME_CSS}}',
 *      'css/app.css',
 *      'css/messages.css',
 *    ),
 *    'jsscript' => array(
 *      'path_to_js'  // can be repeated as many times as necessary
 *      // the default value is none=empty
 *    ),
 * @return direct output to browser: all html header directives defined by input array
 * @author Joe Bordes, JPL TSolucio, S.L.
 */

require 'app.php'; // import php files
$headerDefaultValues = array(
	'user' => array(
		'authenticate' => true,
		'user' => 'All',
		),
	'language' => 'user',
	'title' => array(
		'first' => 'SCRIPTNAME',
		'second' => 'SITENAME',
		),
	'stylesheet' => array(
		'{{FONT}}',
		'{{BOOTSTRAP_CSS}}',
		'{{FONTAWESOME_CSS}}',
		'css/app.css',
		'css/messages.css',
		),
	'jsscript' => array(
		),
);
$hdrValues['user'] = isset($headerValues['user']) ? array_replace($headerDefaultValues['user'],$headerValues['user']) : $headerDefaultValues['user'];
$hdrValues['language'] = isset($headerValues['language']) ? $headerValues['language'] : $headerDefaultValues['language'];
$hdrValues['title'] = isset($headerValues['title']) ? array_replace($headerDefaultValues['title'],$headerValues['title']) : $headerDefaultValues['title'];
$hdrValues['stylesheet'] = isset($headerValues['stylesheet']) ? array_merge($headerDefaultValues['stylesheet'],$headerValues['stylesheet']) : $headerDefaultValues['stylesheet'];
$hdrValues['jsscript'] =isset($headerValues['jsscript']) ? array_merge($headerDefaultValues['jsscript'],$headerValues['jsscript']) : $headerDefaultValues['jsscript'];

if ($hdrValues['user']['authenticate'] or $hdrValues['language']=='user') {
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate($hdrValues['user']['user']);
}

if ($hdrValues['language']=='user') {
	$language = $authUser->Language;
} elseif ($hdrValues['language']=='preferred') {
	// set language to preferred language (HTTP_ACCEPT_LANGUAGE)
	$supported = Utilities::GetSupportedLanguages('');
	$language = Utilities::GetPreferredLanguage($supported);
} else {
	$language = $hdrValues['language'];
}
Utilities::SetLanguage($language); // set language

$scriptTitle = $scriptSubTitle = '';
switch ($hdrValues['title']['first']) {
	case 'SITENAME':
		$scriptTitle = $authUser->SiteName;
		break;
	case 'SCRIPTNAME':
		$scriptTitle = ucfirst(basename($_SERVER['PHP_SELF'],'.php'));
		break;
	default:
		if (substr($hdrValues['title']['first'], 0, 2)=='{{' and substr($hdrValues['title']['first'], -2, 2)=='}}') {
			$const = substr($hdrValues['title']['first'], 2,strlen($hdrValues['title']['first']-4));
			if (defined($const)) {
				$scriptTitle = constant($const);
			} else {
				$scriptTitle = ucfirst(basename($_SERVER['PHP_SELF'],'.php'));
			}
		} else {
			$scriptTitle = $hdrValues['title']['first'];
		}
		break;
}

switch ($hdrValues['title']['second']) {
	case 'SITENAME':
		$scriptSubTitle = $authUser->SiteName;
		break;
	case 'SCRIPTNAME':
		$scriptSubTitle = ucfirst(basename($_SERVER['PHP_SELF'],'.php'));
		break;
	default:
		if (substr($hdrValues['title']['second'], 0, 2)=='{{' and substr($hdrValues['title']['second'], -2, 2)=='}}') {
			$const = substr($hdrValues['title']['second'], 2,strlen($hdrValues['title']['second'])-4);
			if (defined($const)) {
				$scriptSubTitle = constant($const);
			} else {
				$scriptSubTitle = ucfirst(basename($_SERVER['PHP_SELF'],'.php'));
			}
		} else {
			$scriptSubTitle = $hdrValues['title']['second'];
		}
		break;
}

?>
<!DOCTYPE html>
<html lang="<?php echo $language; ?>">
<head>
<title><?php print _($scriptTitle); ?>&mdash;<?php print $scriptSubTitle; ?></title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<?php
foreach ($hdrValues['stylesheet'] as $css) {
	if (substr($css, 0, 2)=='{{' and substr($css, -2, 2)=='}}') {
		$const = substr($css, 2,strlen($css)-4);
		echo "<link type='text/css' rel='stylesheet' href='".constant($const)."?v=".VERSION."'>\n";
	} else {
		echo "<link type='text/css' rel='stylesheet' href='$css?v=".VERSION."'>\n";
	}
}
foreach ($hdrValues['jsscript'] as $jss) {
	if (substr($jss, 0, 2)=='{{' and substr($jss, -2, 2)=='}}') {
		$const = substr($jss, 2,strlen($jss)-4);
		echo "<script type='text/javascript' src='".constant($const)."'></script>\n";
	} else {
		echo "<script type='text/javascript' src='$jss'></script>\n";
	}
}
?>
</head>