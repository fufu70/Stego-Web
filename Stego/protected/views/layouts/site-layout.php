<?php
	$baseUrl = Yii::app()->request->baseUrl;
	date_default_timezone_set("America/New_York");

	$linkUrlList = array(
		$baseUrl."/css/global.css",
		$baseUrl."/css/businessStyle.css",
		$baseUrl."/css/footable.core.css",
		$baseUrl."/css/jquery.filthypillow.css",
		$baseUrl."/css/font-awesome.min.css",
		$baseUrl."/css/doorkeeper.css",
		$baseUrl."/css/animate.min.css",
		"https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.1/css/bootstrap3/bootstrap-switch.min.css",
	);

	$scriptUrlList = array(
		"http://www.parsecdn.com/js/parse-1.3.3.min.js",
		$baseUrl."/js/bootstrap/bootstrap-datetimepicker.min.js",
		$baseUrl."/js/bootstrap/bootstrap-switch.min.js",
		$baseUrl."/js/footable/footable.js",
		$baseUrl."/js/footable/footable.filter.js",
		$baseUrl."/js/footable/footable.sort.js",
		$baseUrl."/js/jquery.maskedinput.js",
		$baseUrl."/js/jquery.floatThead.min.js",
		$baseUrl."/js/chosen.jquery.js",
		$baseUrl."/js/moment.js",
		$baseUrl."/js/jquery.filthypillow.js",
		$baseUrl."/js/site/parse/before.js",
		$baseUrl."/js/site/parse/init.js",
		$baseUrl."/js/site/parse/business.js",
		$baseUrl."/js/site/parse/cu-functions.js",
		$baseUrl."/js/snackbar.js",
		$baseUrl."/js/site/stegonagraphy/generateStego.js",
		$baseUrl."/js/site/stegonagraphy/Transformations.js",
		$baseUrl."/js/site/stegonagraphy/header/Header.js",
		$baseUrl."/js/site/stegonagraphy/header/HeaderInfo.js",
		$baseUrl."/js/site/stegonagraphy/header/EncodeBase.js",
		$baseUrl."/js/site/stegonagraphy/header/EncodeEncryption.js",
		$baseUrl."/js/site/stegonagraphy/header/EncodeType.js",
		$baseUrl."/js/site/stegonagraphy/header/FileExtension.js",
		$baseUrl."/js/site/stegonagraphy/header/EncodeSize.js",
	);
?>

<!DOCTYPE>
<html>
	<?php 
		$this->renderPartial('/layouts/_header', array(
			"links" => $linkUrlList,
			"scripts" => $scriptUrlList,
			"title" => $this->pageTitle,
		));
	?>

	<body>
		<div id="businessContent" class="">
			<?php echo $content; ?>
		</div>
	</body>	
</html>
