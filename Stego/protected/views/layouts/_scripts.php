<?php 
	$baseUrl = Yii::app()->request->baseUrl; 

	$urlList = array(
		"//code.jquery.com/jquery-1.11.2.min.js",
		$baseUrl."/js/bootstrap/bootstrap.min.js",
		$baseUrl."/js/site/global.js",
	);

	if (isset($scripts))
	{
		$urlList = array_merge($urlList, $scripts);
	}

	for ($i = 0; $i < sizeof($urlList); $i ++)
	{
		echo "<script type='text/javascript' src='".$urlList[$i]."'></script>\n";
	}
?>