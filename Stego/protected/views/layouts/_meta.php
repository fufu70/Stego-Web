<?php
	$baseUrl = Yii::app()->request->baseUrl; 

	$metaList = array(
		'http-equiv="Content-Type" content="text/html; charset=utf-8"',
		'name="language" content="en"',
		'name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"',
		'name="viewport" content="initial-scale=1.0, user-scalable=no"',
	);

	if (isset($meta))
	{
		$metaList = array_merge($metaList, $meta);
	}

	for ($i = 0; $i < sizeof($metaList); $i ++)
	{
		echo '<meta '.$metaList[$i].' />';
	}
?>