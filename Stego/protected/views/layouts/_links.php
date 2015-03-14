<?php
	$baseUrl = Yii::app()->request->baseUrl; 

	$urlList = array(
		$baseUrl."/css/bootstrap.css",
	);

	if (isset($links))
	{
		$urlList = array_merge($urlList, $links);
	}
	for ($i = 0; $i < sizeof($urlList); $i ++)
	{
		echo "<link rel='stylesheet' type='text/css' href='".$urlList[$i]."'>";
	}
?>