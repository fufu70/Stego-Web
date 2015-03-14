<head>
	<?php
		$baseUrl = Yii::app()->request->baseUrl; 

		$metaList = array();
		if (isset($meta))
		{
			$metaList = array_merge($meta, $metaList);
		}
		$linkList = array();
		if (isset($links))
		{
			$linkList = array_merge($links, $linkList);
		}
		$scriptList = array();
		if (isset($scripts))
		{
			$scriptList = array_merge($scripts, $scriptList);
		}
		
	    $this->renderPartial('/layouts/_meta', array("meta" => $metaList));
	    if (isset($extra))
	    {
	    	echo $extra;
	    }
	    $this->renderPartial('/layouts/_links', array("links" => $linkList));
	    $this->renderPartial('/layouts/_scripts', array("scripts" => $scriptList));	
	    echo '<title>'.CHtml::encode($this->pageTitle).'</title>';

	?>
</head>